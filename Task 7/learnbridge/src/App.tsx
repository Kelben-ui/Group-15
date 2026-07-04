import React, { useState, useEffect } from "react";
import { 
  UserRole, NetworkMode, CourseModule, UserRecord 
} from "./types";
import StudentPortal from "./components/StudentPortal";
import InstructorPortal from "./components/InstructorPortal";
import AdminPortal from "./components/AdminPortal";
import { 
  Smartphone, Monitor, Shield, Database, RefreshCw, Layers, Sparkles, BookOpen, CheckCircle, ArrowRight, LogOut
} from "lucide-react";
import { UNIVERSITY_INFO } from "./data";

export default function App() {
  // Session states
  const [currentUser, setCurrentUser] = useState<UserRecord | null>(null);
  const [isLoadingSession, setIsLoadingSession] = useState(true);
  const [activeRole, setActiveRole] = useState<UserRole>(UserRole.STUDENT);
  
  // Login form states
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  // Shared simulation states
  const [networkMode, setNetworkMode] = useState<NetworkMode>("stable");
  const [syncNotice, setSyncNotice] = useState<string | null>(null);
  const [pendingSyncs, setPendingSyncs] = useState<any[]>([
    {
      id: "pre-sync-1",
      type: "quiz_score",
      student: "Karl Jonas Acha",
      quizTitle: "Quiz: Web Protocols Mastery",
      score: "2/2 (100%)",
      status: "cached",
      timestamp: "10:15 WAT"
    }
  ]);

  // Auth boot check
  useEffect(() => {
    const checkSession = async () => {
      const token = localStorage.getItem("learnbridge_token");
      if (token) {
        try {
          const res = await fetch("/api/auth/me", {
            headers: {
              "Authorization": `Bearer ${token}`
            }
          });
          if (res.ok) {
            const data = await res.json();
            setCurrentUser(data.user);
            setActiveRole(data.user.role);
          } else {
            localStorage.removeItem("learnbridge_token");
          }
        } catch (e) {
          console.error("Session check failed, clearing token", e);
          localStorage.removeItem("learnbridge_token");
        }
      }
      setIsLoadingSession(false);
    };
    checkSession();
  }, []);

  // Form login handler
  const handleFormLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) return;

    setIsLoggingIn(true);
    setLoginError(null);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: loginEmail, password: loginPassword })
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("learnbridge_token", data.token);
        setCurrentUser(data.user);
        setActiveRole(data.user.role);
        setLoginEmail("");
        setLoginPassword("");
      } else {
        setLoginError(data.error || "Authentication failed. Check credentials.");
      }
    } catch (err) {
      console.error("Login request error:", err);
      setLoginError("Offline or server is starting up. Please try again in a moment.");
    } finally {
      setIsLoggingIn(false);
    }
  };

  // Quick Demo logins click handler
  const handleQuickLogin = async (email: string, matricule: string) => {
    setIsLoggingIn(true);
    setLoginError(null);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password: matricule })
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("learnbridge_token", data.token);
        setCurrentUser(data.user);
        setActiveRole(data.user.role);
      } else {
        setLoginError(data.error || "Quick login failed.");
      }
    } catch (err) {
      console.error("Quick login error:", err);
      setLoginError("Failed connecting to local server.");
    } finally {
      setIsLoggingIn(false);
    }
  };

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem("learnbridge_token");
    setCurrentUser(null);
    setLoginError(null);
  };

  // Actions handler
  const addPendingSync = (syncItem: any) => {
    setPendingSyncs(prev => [syncItem, ...prev]);
  };

  const clearPendingSyncs = async () => {
    if (!currentUser) return;
    try {
      const token = localStorage.getItem("learnbridge_token");
      const res = await fetch("/api/sync/batch", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          studentId: currentUser.id,
          actions: pendingSyncs
        })
      });
      if (res.ok) {
        setPendingSyncs([]);
        setSyncNotice("🚀 Local phone storage has been successfully synchronized to Buea University server!");
        setTimeout(() => {
          setSyncNotice(null);
        }, 5000);
      }
    } catch (e) {
      console.error("Failed to sync offline queue:", e);
      // Fallback local visual purge
      setPendingSyncs([]);
    }
  };

  const handleModuleCreated = (newModule: CourseModule) => {
    console.log("New module published:", newModule);
  };

  if (isLoadingSession) {
    return (
      <div className="min-h-screen bg-[#0f172a] text-slate-200 flex flex-col justify-center items-center font-sans">
        <div className="flex flex-col items-center gap-3 animate-pulse">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-500 to-emerald-400 flex items-center justify-center text-white shadow-lg">
            <Layers size={24} className="animate-spin" />
          </div>
          <span className="text-xs font-mono text-slate-400 tracking-widest uppercase">Initializing LearnBridge Link...</span>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-[#0f172a] text-slate-200 flex flex-col justify-center items-center font-sans relative overflow-hidden px-4">
        {/* Ambient background blur blobs */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] bg-indigo-500/20 blur-[120px] rounded-full"></div>
          <div className="absolute -bottom-[10%] -right-[10%] w-[50%] h-[50%] bg-emerald-500/10 blur-[100px] rounded-full"></div>
        </div>

        <div className="w-full max-w-md bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-3xl p-8 space-y-6 shadow-2xl relative z-10 animate-fadeIn">
          {/* Brand */}
          <div className="flex flex-col items-center text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-500 to-emerald-400 flex items-center justify-center text-white shadow-xl">
              <Layers size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tight text-white">LearnBridge</h1>
              <p className="text-xs text-slate-400 font-mono">Inclusive E-Learning Ecosystem</p>
              <p className="text-[10px] text-emerald-400 font-mono font-semibold uppercase tracking-wider bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded mt-2.5 inline-block">
                Buea University Portal
              </p>
            </div>
          </div>

          {loginError && (
            <div className="bg-rose-500/15 border border-rose-500/20 text-rose-300 p-3.5 rounded-xl font-mono text-[11px] leading-relaxed flex items-center gap-2">
              <Shield size={14} className="shrink-0 text-rose-400" />
              <span>{loginError}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleFormLogin} className="space-y-4 text-xs">
            <div>
              <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1">University Email Address</label>
              <input 
                type="email" 
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="e.g. ryan.njinya@ubuea.cm"
                className="w-full bg-slate-950/40 border border-white/10 rounded-xl px-3.5 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                required
              />
            </div>

            <div>
              <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1">Password (Matricule ID)</label>
              <input 
                type="password" 
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="e.g. FE23A116"
                className="w-full bg-slate-950/40 border border-white/10 rounded-xl px-3.5 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-400 font-mono"
                required
              />
              <span className="text-[9px] text-slate-500 mt-1 block leading-relaxed">
                *Students use their Matricule (e.g. FE23A116), instructors/admins use their UB-ID (e.g. UB-INS-002, UB-ADM-001).
              </span>
            </div>

            <button 
              type="submit"
              disabled={isLoggingIn}
              className="w-full bg-emerald-600 hover:bg-emerald-500 border border-emerald-500/30 text-white py-3 rounded-xl font-bold transition-all shadow-md flex items-center justify-center gap-2 text-xs font-mono"
            >
              {isLoggingIn ? (
                <>
                  <RefreshCw size={14} className="animate-spin" />
                  AUTHENTICATING...
                </>
              ) : (
                <>
                  LOG INTO MY WORKSPACE
                </>
              )}
            </button>
          </form>

          {/* Quick Demo logins */}
          <div className="pt-4 border-t border-white/5 space-y-2.5">
            <span className="block text-center text-[10px] font-mono text-slate-400 uppercase tracking-wider">Quick Demo accounts</span>
            <div className="grid grid-cols-1 gap-2">
              <button 
                onClick={() => handleQuickLogin("ryan.njinya@ubuea.cm", "FE23A116")}
                className="flex justify-between items-center bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl p-2.5 text-left transition-all"
              >
                <div className="flex items-center gap-2">
                  <Smartphone size={14} className="text-emerald-400" />
                  <div>
                    <div className="text-[11px] font-bold text-white leading-tight">Ryan Brown (Student)</div>
                    <div className="text-[9px] font-mono text-slate-500 leading-none">FE23A116</div>
                  </div>
                </div>
                <ArrowRight size={12} className="text-slate-400" />
              </button>

              <button 
                onClick={() => handleQuickLogin("nkemeni.valery@ubuea.cm", "UB-INS-002")}
                className="flex justify-between items-center bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl p-2.5 text-left transition-all"
              >
                <div className="flex items-center gap-2">
                  <Monitor size={14} className="text-indigo-400" />
                  <div>
                    <div className="text-[11px] font-bold text-white leading-tight">Dr. Nkemeni Valery (Instructor)</div>
                    <div className="text-[9px] font-mono text-slate-500 leading-none">UB-INS-002</div>
                  </div>
                </div>
                <ArrowRight size={12} className="text-slate-400" />
              </button>

              <button 
                onClick={() => handleQuickLogin("admin.fet@ubuea.cm", "UB-ADM-001")}
                className="flex justify-between items-center bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl p-2.5 text-left transition-all"
              >
                <div className="flex items-center gap-2">
                  <Shield size={14} className="text-purple-400" />
                  <div>
                    <div className="text-[11px] font-bold text-white leading-tight">System Admin (Admin)</div>
                    <div className="text-[9px] font-mono text-slate-500 leading-none">UB-ADM-001</div>
                  </div>
                </div>
                <ArrowRight size={12} className="text-slate-400" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 flex flex-col font-sans selection:bg-indigo-500/30 selection:text-white relative overflow-hidden">
      
      {/* Non-blocking sync notice toast */}
      {syncNotice && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[1000] max-w-md w-full px-4 animate-fadeIn">
          <div className="bg-emerald-600 border border-emerald-500/30 backdrop-blur-md text-white text-xs font-bold px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2">
            <CheckCircle size={16} className="shrink-0 text-white" />
            <span>{syncNotice}</span>
          </div>
        </div>
      )}
      
      {/* Ambient background blur blobs */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] bg-indigo-500/20 blur-[120px] rounded-full"></div>
        <div className="absolute -bottom-[10%] -right-[10%] w-[50%] h-[50%] bg-emerald-500/10 blur-[100px] rounded-full"></div>
        <div className="absolute top-[30%] left-[40%] w-[40%] h-[40%] bg-purple-500/10 blur-[120px] rounded-full"></div>
      </div>

      {/* 🌟 AUTHENTICATED HEADER */}
      <header className="sticky top-0 bg-white/5 backdrop-blur-md border-b border-white/10 z-[999] shadow-lg relative">
        <div className="max-w-7xl mx-auto px-6 py-3 flex flex-col md:flex-row justify-between items-center gap-3">
          
          {/* Brand Logo & Context */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-500 to-emerald-400 flex items-center justify-center text-white shadow-lg">
              <Layers size={20} className="animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-bold tracking-tight text-white">LearnBridge</span>
                <span className="text-[9px] font-mono bg-white/10 text-emerald-300 font-bold px-1.5 py-0.2 rounded border border-white/10">
                  v2.0 PWA
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-mono leading-none">
                Inclusive E-Learning • Buea University
              </p>
            </div>
          </div>

          {/* Session Profile Status & Logout Button */}
          <div className="flex items-center gap-4 text-xs font-mono">
            <div className="flex items-center gap-2.5 bg-white/5 border border-white/10 rounded-2xl px-4 py-2">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
              <div className="text-left">
                <span className="text-[11px] font-bold text-white block leading-snug">{currentUser.name}</span>
                <span className="text-[9px] text-slate-400 block font-mono capitalize leading-none">{currentUser.role} Account ({currentUser.matricule})</span>
              </div>
            </div>

            {/* Offline cached sync count badge */}
            {activeRole === UserRole.STUDENT && pendingSyncs.filter(s => s.status === "cached").length > 0 && (
              <div className="flex items-center gap-1.5 text-amber-300 font-semibold bg-amber-500/10 px-3 py-2 rounded-xl border border-amber-500/30">
                <Database size={13} className="animate-bounce" />
                <span>{pendingSyncs.filter(s => s.status === "cached").length} cached</span>
              </div>
            )}

            <button 
              onClick={handleLogout}
              className="flex items-center gap-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 font-bold px-3 py-2 rounded-xl border border-rose-500/20 transition-all text-xs"
              title="Log out of system"
            >
              <LogOut size={13} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>

        </div>
      </header>

      {/* 🌍 ACTIVE ECOSYSTEM PORTAL DISPATCHER */}
      <main className="flex-1 w-full transition-all duration-300 relative z-10">
        
        {activeRole === UserRole.STUDENT && (
          <div className="animate-fadeIn">
            <div className="max-w-md mx-auto text-center pt-6 px-4">
              <span className="text-[10px] font-bold font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded uppercase">
                Smartphone Viewport Enforced
              </span>
              <p className="text-[11px] text-slate-400 mt-1 leading-snug">
                Students access the system primarily on Android mobile devices. 
                Interact inside the device shell to test caching and Chat with Ada Coach!
              </p>
            </div>
            <StudentPortal 
              networkMode={networkMode} 
              setNetworkMode={setNetworkMode}
              pendingSyncs={pendingSyncs}
              addPendingSync={addPendingSync}
              clearPendingSyncs={clearPendingSyncs}
              currentUser={currentUser}
              onLogout={handleLogout}
            />
          </div>
        )}

        {activeRole === UserRole.INSTRUCTOR && (
          <div className="animate-fadeIn">
            <div className="max-w-4xl mx-auto text-center pt-6 px-4">
              <span className="text-[10px] font-bold font-mono text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded uppercase">
                Desktop Layout Active
              </span>
              <h2 className="text-base font-bold text-white mt-1">Instructor Workspace Dashboard</h2>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Manage curriculum, publish highly optimized multimedia content, and stream live interactive sessions.
              </p>
            </div>
            <InstructorPortal 
              onModuleCreated={handleModuleCreated}
              pendingSyncs={pendingSyncs}
            />
          </div>
        )}

        {activeRole === UserRole.ADMIN && (
          <div className="animate-fadeIn">
            <div className="max-w-4xl mx-auto text-center pt-6 px-4">
              <span className="text-[10px] font-bold font-mono bg-purple-500/10 border border-purple-500/20 text-purple-400 px-2 py-0.5 rounded uppercase">
                Enterprise panel View
              </span>
              <h2 className="text-base font-bold text-white mt-1">Buea University System Console</h2>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Audit system transactions, track user telemetry databases, and sync buffered student records.
              </p>
            </div>
            <AdminPortal 
              pendingSyncs={pendingSyncs}
              clearPendingSyncs={clearPendingSyncs}
            />
          </div>
        )}

      </main>

      {/* 🏛️ BUEA UNIVERSITY ACCREDITATION FOOTER */}
      {activeRole !== UserRole.STUDENT && (
        <footer className="bg-black/40 backdrop-blur-md text-slate-400 py-6 border-t border-white/5 z-40 text-center text-xs shrink-0 font-mono relative">
          <div className="max-w-7xl mx-auto px-4 space-y-2">
            <div className="text-slate-300 font-bold text-[11px]">
              {UNIVERSITY_INFO.institution} • {UNIVERSITY_INFO.faculty}
            </div>
            <p className="text-[10px] text-slate-500">
              Adaptive e-learning platform based on Quality of Experience for low-resource environments.
            </p>
            <div className="text-[9px] text-slate-600 pt-1.5">
              Designed by Group 15 • {UNIVERSITY_INFO.courseCode} Task 3 Project Report Implementation.
            </div>
          </div>
        </footer>
      )}

    </div>
  );
}
