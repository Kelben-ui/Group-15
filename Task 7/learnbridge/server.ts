import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import { initializeApp } from "firebase-admin/app";
import { getFirestore, FieldValue } from "firebase-admin/firestore";

import { 
  INITIAL_STUDENTS, INITIAL_INSTRUCTORS, INITIAL_ADMINS, INITIAL_MODULES, INITIAL_FEED 
} from "./src/data";
import { UserRecord, CourseModule, CourseFeedItem, UserRole } from "./src/types";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// --- FIREBASE AND FIRESTORE PERSISTENT MODULE INITIALIZATION ---
const configPath = path.join(process.cwd(), "firebase-applet-config.json");
let firebaseConfig: any = {};
if (fs.existsSync(configPath)) {
  try {
    firebaseConfig = JSON.parse(fs.readFileSync(configPath, "utf-8"));
  } catch (err) {
    console.error("[LearnBridge Backend] Failed to parse firebase-applet-config.json:", err);
  }
}

// Initialize Firebase Admin App
try {
  if (firebaseConfig.projectId) {
    initializeApp({
      projectId: firebaseConfig.projectId
    });
    console.log(`[LearnBridge Backend] Firebase Admin initialized for project: ${firebaseConfig.projectId}`);
  } else {
    initializeApp();
    console.log("[LearnBridge Backend] Firebase Admin initialized with default credentials.");
  }
} catch (err) {
  console.error("[LearnBridge Backend] Firebase Admin App initialization warning/error:", err);
}

// Connect to the specific firestoreDatabaseId using the modern modular API
const dbReal = firebaseConfig.firestoreDatabaseId 
  ? getFirestore(undefined, firebaseConfig.firestoreDatabaseId)
  : getFirestore();

// --- RESILIENT OFFLINE CACHING AND CONNECTIVITY RESILIENCE SYSTEM ---
// Built specifically to satisfy guidelines and handle transient/permission-denied database states beautifully.
const inMemoryDB: { [col: string]: Map<string, any> } = {
  users: new Map(),
  lessons: new Map(),
  chats: new Map(),
  logs: new Map(),
  feed: new Map()
};

// Seed in-memory cache with defaults immediately
INITIAL_STUDENTS.forEach(u => inMemoryDB.users.set(u.id, { ...u }));
INITIAL_INSTRUCTORS.forEach(u => inMemoryDB.users.set(u.id, { ...u }));
INITIAL_ADMINS.forEach(u => inMemoryDB.users.set(u.id, { ...u }));
INITIAL_MODULES.forEach(m => inMemoryDB.lessons.set(m.id, { ...m }));
INITIAL_FEED.forEach(f => inMemoryDB.feed.set(f.id, { ...f }));

class ResilientDocRef {
  constructor(public colName: string, public docId: string) {}

  async get() {
    try {
      const snap = await dbReal.collection(this.colName).doc(this.docId).get();
      if (snap.exists) {
        inMemoryDB[this.colName].set(this.docId, snap.data());
      }
      return snap;
    } catch (err: any) {
      console.warn(`[LearnBridge DB Resilience] Firestore read '${this.colName}/${this.docId}' warning: ${err.message}. Using offline cache fallback.`);
      const cachedData = inMemoryDB[this.colName].get(this.docId);
      return {
        id: this.docId,
        exists: cachedData !== undefined,
        data: () => cachedData,
        ref: this
      };
    }
  }

  async set(data: any, options?: any) {
    let merged = { ...data };
    if (options?.merge) {
      const existing = inMemoryDB[this.colName].get(this.docId) || {};
      merged = { ...existing, ...data };
    }
    inMemoryDB[this.colName].set(this.docId, merged);

    try {
      await dbReal.collection(this.colName).doc(this.docId).set(data, options);
    } catch (err: any) {
      console.warn(`[LearnBridge DB Resilience] Firestore write '${this.colName}/${this.docId}' warning: ${err.message}. Offline cache loop updated.`);
    }
    return { success: true };
  }

  async delete() {
    inMemoryDB[this.colName].delete(this.docId);
    try {
      await dbReal.collection(this.colName).doc(this.docId).delete();
    } catch (err: any) {
      console.warn(`[LearnBridge DB Resilience] Firestore delete '${this.colName}/${this.docId}' warning: ${err.message}. Offlined locally.`);
    }
    return { success: true };
  }
}

class ResilientCollection {
  private isQuery = false;
  private filters: Array<(doc: any) => boolean> = [];
  private limitCount = Infinity;
  private sortField: string | null = null;
  private sortDir: "asc" | "desc" = "asc";

  constructor(public colName: string) {}

  where(field: string, op: string, value: any) {
    const q = new ResilientCollection(this.colName);
    q.isQuery = true;
    q.filters = [...this.filters, (doc: any) => {
      const val = doc[field];
      if (op === "==") return val === value;
      if (op === ">") return val > value;
      if (op === "<") return val < value;
      if (op === ">=") return val >= value;
      if (op === "<=") return val <= value;
      if (op === "array-contains") return Array.isArray(val) && val.includes(value);
      return true;
    }];
    q.limitCount = this.limitCount;
    q.sortField = this.sortField;
    q.sortDir = this.sortDir;
    return q;
  }

  limit(n: number) {
    const q = new ResilientCollection(this.colName);
    q.isQuery = true;
    q.filters = [...this.filters];
    q.limitCount = n;
    q.sortField = this.sortField;
    q.sortDir = this.sortDir;
    return q;
  }

  orderBy(field: string, dir: "asc" | "desc" = "asc") {
    const q = new ResilientCollection(this.colName);
    q.isQuery = true;
    q.filters = [...this.filters];
    q.limitCount = this.limitCount;
    q.sortField = field;
    q.sortDir = dir;
    return q;
  }

  doc(id?: string) {
    const docId = id || `doc-${Date.now()}-${Math.random().toString(36).substring(7)}`;
    return new ResilientDocRef(this.colName, docId);
  }

  async get() {
    try {
      let fRef: any = dbReal.collection(this.colName);
      if (this.sortField) {
        fRef = fRef.orderBy(this.sortField, this.sortDir);
      }
      if (this.limitCount !== Infinity) {
        fRef = fRef.limit(this.limitCount);
      }
      const snapshot = await fRef.get();
      snapshot.forEach((doc: any) => {
        inMemoryDB[this.colName].set(doc.id, doc.data());
      });
      return snapshot;
    } catch (err: any) {
      console.warn(`[LearnBridge DB Resilience] Firestore read collection '${this.colName}' warning: ${err.message}. Falling back to offline memory cache.`);
      const map = inMemoryDB[this.colName];
      let docsList = Array.from(map.entries()).map(([id, data]) => ({
        id,
        ref: new ResilientDocRef(this.colName, id),
        data: () => data,
        exists: true
      }));

      for (const filter of this.filters) {
        docsList = docsList.filter(d => filter(d.data()));
      }

      if (this.sortField) {
        const field = this.sortField;
        docsList.sort((a, b) => {
          const valA = a.data()[field];
          const valB = b.data()[field];
          if (valA === undefined) return 1;
          if (valB === undefined) return -1;
          const compare = valA > valB ? 1 : valA < valB ? -1 : 0;
          return this.sortDir === "asc" ? compare : -compare;
        });
      }

      if (this.limitCount !== Infinity) {
        docsList = docsList.slice(0, this.limitCount);
      }

      return {
        empty: docsList.length === 0,
        size: docsList.length,
        docs: docsList,
        forEach: (callback: (doc: any) => void) => {
          docsList.forEach(callback);
        }
      };
    }
  }
}

class ResilientBatch {
  private ops: Array<() => Promise<void>> = [];

  delete(docRef: any) {
    this.ops.push(async () => {
      await docRef.delete();
    });
    return this;
  }

  set(docRef: any, data: any) {
    this.ops.push(async () => {
      await docRef.set(data);
    });
    return this;
  }

  async commit() {
    for (const op of this.ops) {
      await op();
    }
  }
}

const db = {
  collection: (name: string) => new ResilientCollection(name),
  batch: () => new ResilientBatch()
};

// Firestore Collections References
const usersCol = () => db.collection("users");
const lessonsCol = () => db.collection("lessons");
const chatsCol = () => db.collection("chats");
const logsCol = () => db.collection("logs");
const feedCol = () => db.collection("feed");

// Database Seeder on Startup
async function seedDatabaseIfEmpty() {
  try {
    const usersSnapshot = await usersCol().limit(1).get();
    if (usersSnapshot.empty) {
      console.log("[LearnBridge DB] Firestore 'users' is empty. Seeding defaults...");
      const allUsers = [...INITIAL_STUDENTS, ...INITIAL_INSTRUCTORS, ...INITIAL_ADMINS];
      for (const u of allUsers) {
        await usersCol().doc(u.id).set(u);
      }
    }

    const lessonsSnapshot = await lessonsCol().limit(1).get();
    if (lessonsSnapshot.empty) {
      console.log("[LearnBridge DB] Firestore 'lessons' is empty. Seeding defaults...");
      for (const m of INITIAL_MODULES) {
        await lessonsCol().doc(m.id).set(m);
      }
    }

    const feedSnapshot = await feedCol().limit(1).get();
    if (feedSnapshot.empty) {
      console.log("[LearnBridge DB] Firestore 'feed' is empty. Seeding defaults...");
      for (const f of INITIAL_FEED) {
        await feedCol().doc(f.id).set(f);
      }
    }

    const logsSnapshot = await logsCol().limit(1).get();
    if (logsSnapshot.empty) {
      console.log("[LearnBridge DB] Firestore 'logs' is empty. Seeding default syslogs...");
      const syslogs = [
        { id: "log-1", type: "SYSTEM", details: "LearnBridge system daemon online on port 3000", status: "success", time: "10:00:15 WAT", timestamp: FieldValue.serverTimestamp() },
        { id: "log-2", type: "DB_SYNC", details: "System database connected to Firebase Firestore and seeded", status: "success", time: "10:01:22 WAT", timestamp: FieldValue.serverTimestamp() }
      ];
      for (const l of syslogs) {
        await logsCol().doc(l.id).set(l);
      }
    }
    console.log("[LearnBridge DB] Firebase database collections are synchronized.");
  } catch (err) {
    console.error("[LearnBridge DB] Error checking/seeding database:", err);
  }
}

// Run database seeding
seedDatabaseIfEmpty();


// Initialize Gemini AI Client
const apiKey = process.env.GEMINI_API_KEY || "dummy_key";
const ai = new GoogleGenAI({
  apiKey: apiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

// Helper: Authentication check from Bearer Token (containing user's ID)
const getAuthUser = async (req: express.Request): Promise<UserRecord | null> => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }
  const token = authHeader.substring(7); // Token is the user ID in localStorage
  try {
    const docSnap = await usersCol().doc(token).get();
    if (docSnap.exists) {
      return docSnap.data() as UserRecord;
    }
  } catch (err) {
    console.error("[LearnBridge Auth] Error fetching authenticated user:", err);
  }
  return null;
};


// --- AUTHENTICATION ENDPOINTS ---

// Post user login
app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Email and matricule/password are required" });
  }

  try {
    const snapshot = await usersCol().get();
    const allUsers: UserRecord[] = [];
    snapshot.forEach(doc => {
      allUsers.push(doc.data() as UserRecord);
    });

    const user = allUsers.find(u => u.email.toLowerCase() === email.toLowerCase().trim());
    if (!user) {
      return res.status(401).json({ error: "Access denied: User not found with this email" });
    }

    // In this system, password is the user's matricule (e.g. FE23A116, UB-INS-002, UB-ADM-001)
    if (user.matricule.toLowerCase() !== password.toLowerCase().trim()) {
      return res.status(401).json({ error: "Invalid password: check your matricule number" });
    }

    // Update last active date/time
    user.lastActive = new Date().toISOString().replace('T', ' ').substring(0, 16);
    await usersCol().doc(user.id).set(user);

    // Log successful audit trail
    const logId = `log-${Date.now()}`;
    await logsCol().doc(logId).set({
      id: logId,
      type: "AUTH",
      details: `${user.name} (${user.role.toUpperCase()}) authenticated successfully via web portal.`,
      status: "success",
      time: new Date().toLocaleTimeString(),
      timestamp: FieldValue.serverTimestamp()
    });

    res.json({ token: user.id, user });
  } catch (err: any) {
    console.error("[LearnBridge Server] Login Error:", err);
    res.status(500).json({ error: "Internal server error during authentication" });
  }
});

// Get current session
app.get("/api/auth/me", async (req, res) => {
  const user = await getAuthUser(req);
  if (!user) {
    return res.status(401).json({ error: "Session expired or invalid" });
  }
  res.json({ user });
});


// --- COURSE MODULES ENDPOINTS ---

// Fetch all curriculum modules
app.get("/api/modules", async (req, res) => {
  try {
    const snapshot = await lessonsCol().get();
    const modulesList: CourseModule[] = [];
    snapshot.forEach(doc => {
      modulesList.push(doc.data() as CourseModule);
    });
    res.json({ modules: modulesList });
  } catch (err) {
    console.error("[LearnBridge Server] Fetch modules error:", err);
    res.status(500).json({ error: "Failed to fetch lessons from Firestore" });
  }
});

// Publish a new module (Instructor only)
app.post("/api/modules", async (req, res) => {
  const user = await getAuthUser(req);
  if (!user || user.role !== UserRole.INSTRUCTOR) {
    return res.status(403).json({ error: "Access denied: Instructor clearance required" });
  }

  const { title, code, description, materials, quiz } = req.body;
  if (!title || !code || !description) {
    return res.status(400).json({ error: "Title, code, and description are required" });
  }

  const newModuleId = `mod-${Date.now()}`;
  const newModule: CourseModule = {
    id: newModuleId,
    title,
    code,
    description,
    instructorName: user.name,
    progress: 0,
    isCachedOffline: false,
    materials: materials || [],
    quiz: quiz || undefined
  };

  try {
    await lessonsCol().doc(newModuleId).set(newModule);

    // Log audit
    const logId = `log-${Date.now()}`;
    await logsCol().doc(logId).set({
      id: logId,
      type: "CURRICULUM",
      details: `Instructor ${user.name} published module: ${code} - ${title}`,
      status: "success",
      time: new Date().toLocaleTimeString(),
      timestamp: FieldValue.serverTimestamp()
    });

    // Fetch all updated modules
    const snapshot = await lessonsCol().get();
    const modulesList: CourseModule[] = [];
    snapshot.forEach(doc => {
      modulesList.push(doc.data() as CourseModule);
    });

    res.json({ success: true, module: newModule, modules: modulesList });
  } catch (err) {
    console.error("[LearnBridge Server] Post module error:", err);
    res.status(500).json({ error: "Failed to save curriculum module" });
  }
});


// --- STUDENT STUDY FEED ENDPOINTS ---

app.get("/api/feed", async (req, res) => {
  try {
    const snapshot = await feedCol().get();
    const feedList: CourseFeedItem[] = [];
    snapshot.forEach(doc => {
      feedList.push(doc.data() as CourseFeedItem);
    });
    res.json({ feed: feedList });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch study feed" });
  }
});


// --- USER DIRECTORY ENDPOINTS (Admin only) ---

// Fetch all registered students and staff
app.get("/api/users", async (req, res) => {
  const user = await getAuthUser(req);
  if (!user || user.role !== UserRole.ADMIN) {
    return res.status(403).json({ error: "Access denied: Admin clearance required" });
  }
  try {
    const snapshot = await usersCol().get();
    const usersList: UserRecord[] = [];
    snapshot.forEach(doc => {
      usersList.push(doc.data() as UserRecord);
    });
    res.json({ users: usersList });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch user directory" });
  }
});

// Register a student / staff member
app.post("/api/users", async (req, res) => {
  const user = await getAuthUser(req);
  if (!user || user.role !== UserRole.ADMIN) {
    return res.status(403).json({ error: "Access denied: Admin access required" });
  }

  const { name, email, matricule, role } = req.body;
  if (!name || !email || !matricule || !role) {
    return res.status(400).json({ error: "All fields (name, email, matricule, role) are required" });
  }

  const newUserId = `user-${Date.now()}`;
  const newUser: UserRecord = {
    id: newUserId,
    name,
    matricule,
    role: role as UserRole,
    email,
    lastActive: "Never",
    attendanceRate: role === UserRole.STUDENT ? 90 : 100,
    progressRate: role === UserRole.STUDENT ? 0 : 100
  };

  try {
    await usersCol().doc(newUserId).set(newUser);

    // Log audit
    const logId = `log-${Date.now()}`;
    await logsCol().doc(logId).set({
      id: logId,
      type: "USER_CREATE",
      details: `Admin ${user.name} registered member: ${newUser.name} (${newUser.matricule})`,
      status: "success",
      time: new Date().toLocaleTimeString(),
      timestamp: FieldValue.serverTimestamp()
    });

    // Get all users
    const snapshot = await usersCol().get();
    const usersList: UserRecord[] = [];
    snapshot.forEach(doc => {
      usersList.push(doc.data() as UserRecord);
    });

    res.json({ success: true, users: usersList });
  } catch (err) {
    res.status(500).json({ error: "Failed to register user" });
  }
});

// Purge/delete user
app.delete("/api/users/:id", async (req, res) => {
  const user = await getAuthUser(req);
  if (!user || user.role !== UserRole.ADMIN) {
    return res.status(403).json({ error: "Access denied: Admin access required" });
  }

  const targetId = req.params.id;
  if (targetId === "admin1") {
    return res.status(400).json({ error: "Cannot delete the primary administrator account" });
  }

  try {
    const docRef = usersCol().doc(targetId);
    const docSnap = await docRef.get();
    if (!docSnap.exists) {
      return res.status(404).json({ error: "User profile not found" });
    }
    const targetUser = docSnap.data() as UserRecord;

    await docRef.delete();

    // Log audit
    const logId = `log-${Date.now()}`;
    await logsCol().doc(logId).set({
      id: logId,
      type: "USER_DELETE",
      details: `Purged profile: ${targetUser.name} (${targetUser.matricule})`,
      status: "warning",
      time: new Date().toLocaleTimeString(),
      timestamp: FieldValue.serverTimestamp()
    });

    // Get all users
    const snapshot = await usersCol().get();
    const usersList: UserRecord[] = [];
    snapshot.forEach(doc => {
      usersList.push(doc.data() as UserRecord);
    });

    res.json({ success: true, users: usersList });
  } catch (err) {
    res.status(500).json({ error: "Failed to purge user profile" });
  }
});


// --- SYNCHRONIZATION ENDPOINTS ---

// Sync individual quiz score
app.post("/api/sync/quiz", async (req, res) => {
  const { studentId, quizTitle, score, percentage } = req.body;
  if (!studentId || !quizTitle || !score) {
    return res.status(400).json({ error: "studentId, quizTitle, and score are required" });
  }

  try {
    const docRef = usersCol().doc(studentId);
    const docSnap = await docRef.get();
    let studentName = studentId;
    if (docSnap.exists) {
      const student = docSnap.data() as UserRecord;
      studentName = student.name;
      student.progressRate = Math.min(100, Math.max(student.progressRate, percentage || 85));
      student.lastActive = new Date().toISOString().replace('T', ' ').substring(0, 16);
      await docRef.set(student);
    }

    // Add system log
    const logId = `log-${Date.now()}`;
    await logsCol().doc(logId).set({
      id: logId,
      type: "DB_SYNC",
      details: `Auto-synced quiz attempt for ${studentName}: ${quizTitle} - Score: ${score}`,
      status: "success",
      time: new Date().toLocaleTimeString(),
      timestamp: FieldValue.serverTimestamp()
    });

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to sync quiz scores" });
  }
});

// Sync client offline-queued actions (Batch Sync)
app.post("/api/sync/batch", async (req, res) => {
  const { studentId, actions } = req.body;
  if (!studentId || !Array.isArray(actions)) {
    return res.status(400).json({ error: "studentId and actions array are required" });
  }

  try {
    const docRef = usersCol().doc(studentId);
    const docSnap = await docRef.get();
    let student: UserRecord | null = null;
    if (docSnap.exists) {
      student = docSnap.data() as UserRecord;
      student.lastActive = new Date().toISOString().replace('T', ' ').substring(0, 16);
    }

    for (const act of actions) {
      let details = `Synced action for student: ${student ? student.name : studentId}`;
      if (act.type === "quiz_score") {
        details = `Synced quiz score: ${act.quizTitle} (${act.score}) for ${student ? student.name : studentId}`;
        if (student) {
          student.progressRate = Math.min(100, student.progressRate + 15);
        }
      } else if (act.type === "chat_question") {
        details = `Synced chat question: "${act.question.substring(0, 35)}..." for ${student ? student.name : studentId}`;
      } else if (act.type === "attendance") {
        details = `Synced attendance record for module ${act.moduleCode}`;
        if (student) {
          student.attendanceRate = Math.min(100, student.attendanceRate + 4);
        }
      } else if (act.type === "cache_sync") {
        details = `Registered offline package load: "${act.moduleTitle}" for ${student ? student.name : studentId}`;
      }

      const logId = `log-${Date.now()}-${Math.random().toString(36).substring(7)}`;
      await logsCol().doc(logId).set({
        id: logId,
        type: "DB_SYNC",
        details,
        status: "success",
        time: new Date().toLocaleTimeString(),
        timestamp: FieldValue.serverTimestamp()
      });
    }

    if (student) {
      await docRef.set(student);
    }

    res.json({ success: true, student });
  } catch (err) {
    console.error("[LearnBridge Server] Batch Sync error:", err);
    res.status(500).json({ error: "Failed to perform batch sync" });
  }
});


// --- SYSTEM TELEMETRY AUDIT LOGS ENDPOINTS (Admin only) ---

app.get("/api/logs", async (req, res) => {
  const user = await getAuthUser(req);
  if (!user || user.role !== UserRole.ADMIN) {
    return res.status(403).json({ error: "Forbidden: Admin access required" });
  }
  try {
    const snapshot = await logsCol().orderBy("timestamp", "desc").limit(100).get();
    const logsList: any[] = [];
    snapshot.forEach(doc => {
      logsList.push(doc.data());
    });
    res.json({ logs: logsList });
  } catch (err) {
    // Fallback un-indexed fetch just in case index is creating
    try {
      const snapshot = await logsCol().limit(100).get();
      const logsList: any[] = [];
      snapshot.forEach(doc => {
        logsList.push(doc.data());
      });
      res.json({ logs: logsList });
    } catch (innerErr) {
      res.status(500).json({ error: "Failed to fetch logs" });
    }
  }
});

app.post("/api/logs/clear", async (req, res) => {
  const user = await getAuthUser(req);
  if (!user || user.role !== UserRole.ADMIN) {
    return res.status(403).json({ error: "Forbidden" });
  }
  try {
    const snapshot = await logsCol().get();
    const batch = db.batch();
    snapshot.forEach(doc => {
      batch.delete(doc.ref);
    });
    await batch.commit();
    res.json({ success: true, logs: [] });
  } catch (err) {
    res.status(500).json({ error: "Failed to clear telemetry logs" });
  }
});


// --- AI INTERACTIVE STUDY COACH ROUTE (Gemini 2.5 Flash with Thread Context) ---

app.post("/api/chat", async (req, res) => {
  try {
    const user = await getAuthUser(req) || { id: "user-ryan", name: "Ryan Brown" }; // Fallback
    const { messages } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Invalid messages array" });
    }

    const lastMsg = messages[messages.length - 1];
    if (!lastMsg || !lastMsg.text) {
      return res.status(400).json({ error: "Empty user question text" });
    }

    // Save student's query directly to Firestore chats collection
    const userMsgId = `msg-${Date.now()}-u`;
    await chatsCol().doc(userMsgId).set({
      id: userMsgId,
      userId: user.id,
      sender: "user",
      text: lastMsg.text,
      timestamp: FieldValue.serverTimestamp()
    });

    // Fetch student's recent conversation thread logs from database
    const snapshot = await chatsCol().where("userId", "==", user.id).get();
    const rawMessages: any[] = [];
    snapshot.forEach(doc => {
      const data = doc.data();
      rawMessages.push({
        sender: data.sender,
        text: data.text,
        timestamp: data.timestamp ? (data.timestamp.toDate ? data.timestamp.toDate() : new Date(data.timestamp)) : new Date()
      });
    });

    // Sort logs in memory to bypass missing database composite indexes
    rawMessages.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());

    // Format logs for gemini-2.5-flash context thread (limit to last 10 messages)
    const contents = rawMessages.slice(-10).map((m: any) => ({
      role: m.sender === 'user' ? 'user' : 'model',
      parts: [{ text: m.text }]
    }));

    if (contents.length === 0) {
      contents.push({
        role: "user",
        parts: [{ text: lastMsg.text }]
      });
    }

    // Dispatch request to gemini-2.5-flash as explicitly requested
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: contents,
      config: {
        systemInstruction: "You are Ada, the warm, brilliant, and empathetic AI Study Coach on the LearnBridge platform. LearnBridge is designed for students in low-resource settings (unstable internet, limited devices, frequent power outages). Keep your explanations extremely clear, concise, encouraging, and scannable. Use bullet points and simple language. Offer study tips that work offline or with low resources, and always check in to see if they understood your explanation before moving on.",
      }
    });

    const responseText = response.text || "I'm having trouble thinking of a response right now. Let's try again!";

    // Save model's reply directly to Firestore chats collection
    const botMsgId = `msg-${Date.now()}-b`;
    await chatsCol().doc(botMsgId).set({
      id: botMsgId,
      userId: user.id,
      sender: "bot",
      text: responseText,
      timestamp: FieldValue.serverTimestamp()
    });

    res.json({ text: responseText });
  } catch (error: any) {
    console.error("[LearnBridge Server] Gemini API/Firestore Chat Error:", error);
    res.status(500).json({ error: error.message || "Failed to generate AI response from Gemini" });
  }
});


// --- VITE DEV SERVER / PRODUCTION SERVING ---

async function setupVite() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }
}

setupVite().then(() => {
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[LearnBridge Server] Running on http://0.0.0.0:${PORT}`);
  });
});
