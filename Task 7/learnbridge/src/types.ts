export enum UserRole {
  STUDENT = "student",
  INSTRUCTOR = "instructor",
  ADMIN = "admin"
}

export type NetworkMode = "stable" | "low-bandwidth" | "offline";

export interface LessonMaterial {
  id: string;
  type: "video" | "audio" | "text" | "slides";
  title: string;
  url: string;
  size: string; // e.g., "1.2 MB", "4.5 MB"
  compressedSize: string; // e.g., "300 KB", "1.1 MB"
  duration?: string;
  content: string; // Plain text or markdown lesson explanation
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
}

export interface Quiz {
  id: string;
  title: string;
  questions: QuizQuestion[];
}

export interface CourseModule {
  id: string;
  title: string;
  code: string;
  description: string;
  instructorName: string;
  progress: number; // percentage completed
  materials: LessonMaterial[];
  quiz?: Quiz;
  isCachedOffline: boolean;
  downloadProgress?: number; // 0 to 100 if downloading
}

export interface ChatMessage {
  id: string;
  sender: "user" | "bot";
  text: string;
  timestamp: Date;
  status: "sending" | "sent" | "cached" | "failed";
}

export interface UserRecord {
  id: string;
  name: string;
  matricule: string;
  role: UserRole;
  email: string;
  lastActive: string;
  attendanceRate: number; // e.g. 92
  progressRate: number; // e.g. 78
}

export interface OfflineAction {
  id: string;
  type: "attendance" | "quiz_score" | "feedback" | "chat";
  timestamp: string;
  payload: any;
  status: "pending" | "synced";
}

export interface CourseFeedItem {
  id: string;
  title: string;
  type: "announcement" | "update" | "assignment";
  date: string;
  content: string;
  author: string;
}
