import React, { useState, useEffect, useRef } from "react";
import { 
  Wifi, WifiOff, BookOpen, MessageSquare, Home, Settings, Download, 
  CheckCircle, AlertCircle, Send, User, Clock, ArrowRight, Database, 
  Award, FileText, Volume2, Play, Check, ChevronRight, Loader2, RefreshCw,
  Activity, LogOut
} from "lucide-react";
import { CourseModule, ChatMessage, NetworkMode, Quiz, QuizQuestion, CourseFeedItem, UserRole, UserRecord } from "../types";
import { UNIVERSITY_INFO, INITIAL_MODULES, INITIAL_FEED, INITIAL_STUDENTS } from "../data";

interface StudentPortalProps {
  networkMode: NetworkMode;
  setNetworkMode: (mode: NetworkMode) => void;
  pendingSyncs: any[];
  addPendingSync: (syncItem: any) => void;
  clearPendingSyncs: () => void;
  currentUser?: UserRecord;
  onLogout?: () => void;
}

export default function StudentPortal({ 
  networkMode, 
  setNetworkMode, 
  pendingSyncs, 
  addPendingSync,
  clearPendingSyncs,
  currentUser,
  onLogout
}: StudentPortalProps) {
  // Navigation tabs: 'feed' | 'modules' | 'chat' | 'settings'
  const [activeTab, setActiveTab] = useState<"feed" | "modules" | "chat" | "settings">("feed");
  const [modules, setModules] = useState<CourseModule[]>(INITIAL_MODULES);
  const [selectedModule, setSelectedModule] = useState<CourseModule | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<any | null>(null);
  
  // Quiz state
  const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [quizScore, setQuizScore] = useState<number | null>(null);

  // Chat state
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      sender: "bot",
      text: "Hello! I am Ada, your AI Study Coach for CEF440. How can I assist you with your internet and mobile programming studies today?",
      timestamp: new Date(),
      status: "sent"
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Caching animation states
  const [downloadingModuleId, setDownloadingModuleId] = useState<string | null>(null);
  const [downloadProgress, setDownloadProgress] = useState(0);

  // active student selector
  const [activeStudent, setActiveStudent] = useState(currentUser || INITIAL_STUDENTS[0]);

  // Sync active student with logged-in user
  useEffect(() => {
    if (currentUser) {
      setActiveStudent(currentUser);
    }
  }, [currentUser]);

  // Scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages, isTyping]);

  // Handle module offline caching simulation
  const handleDownloadModule = (moduleId: string) => {
    setDownloadingModuleId(moduleId);
    setDownloadProgress(0);

    const interval = setInterval(() => {
      setDownloadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setModules(prevMods => 
            prevMods.map(m => m.id === moduleId ? { ...m, isCachedOffline: true } : m)
          );
          setDownloadingModuleId(null);
          // Register cache action in sync list
          addPendingSync({
            id: `download-${Date.now()}`,
            type: "cache_sync",
            moduleTitle: modules.find(m => m.id === moduleId)?.title,
            timestamp: new Date().toLocaleTimeString()
          });
          return 100;
        }
        return prev + 20; // 5 steps
      });
    }, 200);
  };

  // Handle Quiz submissions
  const handleAnswerSelection = (optionIndex: number) => {
    setSelectedAnswer(optionIndex);
  };

  const handleNextQuizQuestion = () => {
    if (activeQuiz && selectedAnswer !== null) {
      const isCorrect = selectedAnswer === activeQuiz.questions[currentQuestionIndex].correctIndex;
      
      if (currentQuestionIndex + 1 < activeQuiz.questions.length) {
        setCurrentQuestionIndex(prev => prev + 1);
        setSelectedAnswer(null);
      } else {
        // Calculate final score
        const finalScore = isCorrect ? quizScore! + 1 : quizScore!;
        setQuizScore(finalScore);

        // Submit Quiz Score Event
        const scorePct = Math.round((finalScore / activeQuiz.questions.length) * 100);
        
        // Caching if offline or direct sync if online
        const isOffline = networkMode === "offline";
        addPendingSync({
          id: `quiz-score-${Date.now()}`,
          type: "quiz_score",
          quizTitle: activeQuiz.title,
          student: activeStudent.name,
          matricule: activeStudent.matricule,
          score: `${finalScore}/${activeQuiz.questions.length} (${scorePct}%)`,
          status: isOffline ? "cached" : "synced",
          timestamp: new Date().toLocaleTimeString()
        });

        // Update local progress of module as well
        if (selectedModule) {
          setModules(prev => prev.map(m => m.id === selectedModule.id ? { ...m, progress: Math.max(m.progress, 100) } : m));
        }
      }
      
      if (isCorrect) {
        setQuizScore(prev => (prev === null ? 1 : prev + 1));
      } else {
        setQuizScore(prev => (prev === null ? 0 : prev));
      }
    }
  };

  // Chat Submit
  const handleSendChatMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsgText = chatInput;
    setChatInput("");

    const newMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: userMsgText,
      timestamp: new Date(),
      status: networkMode === "offline" ? "cached" : "sending"
    };

    setChatMessages(prev => [...prev, newMsg]);

    // Offline simulation behavior
    if (networkMode === "offline") {
      setIsTyping(true);
      setTimeout(() => {
        setChatMessages(prev => [...prev, {
          id: `bot-offline-${Date.now()}`,
          sender: "bot",
          text: `⚠️ **[OFFLINE INTERRUPT]** I've cached your query locally on your phone. I will process this question using Gemini 2.5 Flash as soon as your device reconnects to a stable cell network! \n\n*Local Storage Backup Successful.*`,
          timestamp: new Date(),
          status: "cached"
        }]);
        setIsTyping(false);
      }, 700);

      // Add to offline actions queue
      addPendingSync({
        id: `chat-${Date.now()}`,
        type: "chat_question",
        student: activeStudent.name,
        question: userMsgText,
        status: "cached",
        timestamp: new Date().toLocaleTimeString()
      });
      return;
    }

    // Online or Low-Bandwidth behavior - calling Gemini backend!
    setIsTyping(true);
    try {
      // Build full conversation history for context
      // Limit to last 6 messages to keep payloads small for low-bandwidth optimization!
      const currentHistory = [...chatMessages, newMsg]
        .slice(-6)
        .map(m => ({
          sender: m.sender,
          text: m.text
        }));

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: currentHistory })
      });

      if (!res.ok) {
        throw new Error("Failed to get response from server");
      }

      const data = await res.json();
      
      // Update message status to sent
      setChatMessages(prev => 
        prev.map(m => m.id === newMsg.id ? { ...m, status: "sent" as const } : m)
      );

      setChatMessages(prev => [...prev, {
        id: `bot-${Date.now()}`,
        sender: "bot",
        text: data.text,
        timestamp: new Date(),
        status: "sent"
      }]);

    } catch (err: any) {
      console.error(err);
      setChatMessages(prev => 
        prev.map(m => m.id === newMsg.id ? { ...m, status: "failed" as const } : m)
      );
      setChatMessages(prev => [...prev, {
        id: `bot-err-${Date.now()}`,
        sender: "bot",
        text: "❌ **Network timeout on 3G endpoint.** I failed to reach our servers. Please switch to *Offline Mode* to save your queries locally, or try again later.",
        timestamp: new Date(),
        status: "failed"
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  // Simulating connection sync trigger
  const handleSyncAllOffline = () => {
    if (networkMode === "offline") return;
    clearPendingSyncs();
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 min-h-[85vh] bg-transparent">
      {/* Smartphone Outer shell */}
      <div className="relative w-full max-w-[390px] h-[780px] bg-white/10 backdrop-blur-3xl border border-white/20 rounded-[48px] shadow-2xl flex flex-col overflow-hidden ring-4 ring-black/40 text-slate-200">
        
        {/* Notch / Speaker bar */}
        <div className="absolute top-0 inset-x-0 h-6 bg-black/40 backdrop-blur-md z-50 flex justify-center items-center border-b border-white/5">
          <div className="w-32 h-4 bg-black/40 rounded-b-xl flex justify-between px-4 items-center border border-white/5 border-t-0">
            <span className="text-[9px] text-slate-400 font-mono">UB-Net</span>
            <div className="w-3 h-1.5 bg-white/20 rounded-full"></div>
            <span className="text-[9px] text-slate-400 font-mono">10:46 AM</span>
          </div>
        </div>

        {/* Dynamic Mobile Header */}
        <div className="pt-8 pb-3 px-4 bg-white/5 backdrop-blur-md border-b border-white/10 flex justify-between items-center z-40">
          <div>
            <span className="text-[10px] uppercase tracking-wider font-bold text-indigo-400 font-mono">
              Student Workspace
            </span>
            <h1 className="text-base font-bold text-white leading-tight">
              LearnBridge Mobile
            </h1>
          </div>
          
          {/* Signal Indicator */}
          <div className="flex items-center gap-1.5">
            {networkMode === "offline" ? (
              <span className="flex items-center gap-1 bg-red-500/10 text-red-400 text-[10px] font-bold px-2 py-0.5 rounded-full font-mono border border-red-500/20">
                <WifiOff size={11} /> Offline
              </span>
            ) : networkMode === "low-bandwidth" ? (
              <span className="flex items-center gap-1 bg-amber-500/10 text-amber-400 text-[10px] font-bold px-2 py-0.5 rounded-full font-mono border border-amber-500/20 animate-pulse">
                <Activity size={11} /> 2G Lite
              </span>
            ) : (
              <span className="flex items-center gap-1 bg-emerald-500/10 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded-full font-mono border border-emerald-500/20">
                <Wifi size={11} /> High-Speed
              </span>
            )}
          </div>
        </div>

        {/* Local Sync Notification Banner if any actions cached */}
        {pendingSyncs.filter(s => s.status === "cached").length > 0 && networkMode !== "offline" && (
          <div className="bg-amber-500/90 text-white text-[11px] font-medium py-2 px-4 flex justify-between items-center z-30 animate-pulse border-b border-white/10">
            <span className="flex items-center gap-1.5 font-mono">
              <Database size={12} /> {pendingSyncs.filter(s => s.status === "cached").length} Cached offline files
            </span>
            <button 
              onClick={handleSyncAllOffline}
              className="bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 px-2 py-0.5 rounded font-bold text-[10px] font-mono flex items-center gap-1 transition-all"
            >
              <RefreshCw size={10} /> Sync
            </button>
          </div>
        )}

        {/* Active View Container */}
        <div className="flex-1 overflow-y-auto bg-slate-950/40 p-4 pb-20">
          
          {/* Active Student Card Context */}
          <div className="mb-4 bg-gradient-to-br from-indigo-500/20 to-emerald-500/20 backdrop-blur-xl border border-white/10 text-white p-3.5 rounded-2xl shadow-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center font-bold text-white text-sm">
                {activeStudent.name.split(" ").map(n => n[0]).join("")}
              </div>
              <div className="flex-1">
                <div className="text-[10px] text-emerald-200 font-mono">STUDENT CREDENTIALS</div>
                <h3 className="text-xs font-bold leading-tight">{activeStudent.name}</h3>
                <div className="flex justify-between items-center text-[9px] text-emerald-100 font-mono mt-0.5">
                  <span>Matricule: {activeStudent.matricule}</span>
                  <span className="bg-white/10 px-1.5 py-0.2 rounded">CEF440</span>
                </div>
              </div>
            </div>

            {/* Attendance & Module complete stats */}
            <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-white/10 text-center">
              <div>
                <div className="text-[9px] text-emerald-200 font-mono">ATTENDANCE</div>
                <div className="text-sm font-black">{activeStudent.attendanceRate}%</div>
              </div>
              <div>
                <div className="text-[9px] text-emerald-200 font-mono">PROGRESS RATE</div>
                <div className="text-sm font-black">{activeStudent.progressRate}%</div>
              </div>
            </div>
          </div>

          {/* 1. FEED TAB */}
          {activeTab === "feed" && (
            <div className="space-y-4">
              <div className="bg-white/5 backdrop-blur-md border border-white/10 p-3 rounded-xl">
                <span className="text-[9px] font-mono text-slate-400 block uppercase">Department Noticeboard</span>
                <h4 className="text-xs font-bold text-white mt-1">{UNIVERSITY_INFO.department}</h4>
                <p className="text-[10px] text-slate-400 mt-0.5">Course: {UNIVERSITY_INFO.courseCode} - {UNIVERSITY_INFO.instructor}</p>
              </div>

              <h2 className="text-xs font-bold text-slate-400 font-mono uppercase tracking-wider">Course Feed Updates</h2>
              
              {INITIAL_FEED.map(item => (
                <div key={item.id} className="bg-white/5 backdrop-blur-md border border-white/10 p-4 rounded-2xl shadow-lg relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1.5 h-full bg-[#7F77DD]" />
                  <div className="flex justify-between items-center">
                    <span className={`text-[9px] font-bold font-mono px-2 py-0.5 rounded-full border ${
                      item.type === "update" ? "bg-blue-500/15 text-blue-300 border-blue-500/20" :
                      item.type === "assignment" ? "bg-red-500/15 text-red-300 border-red-500/20" : "bg-amber-500/15 text-amber-300 border-amber-500/20"
                    }`}>
                      {item.type.toUpperCase()}
                    </span>
                    <span className="text-[9px] text-slate-400 font-mono">{item.date}</span>
                  </div>
                  <h3 className="text-xs font-bold text-white mt-2">{item.title}</h3>
                  <p className="text-[11px] text-slate-300 mt-1.5 leading-relaxed">{item.content}</p>
                  <div className="text-[9px] text-slate-400 mt-3 font-mono">Published by: {item.author}</div>
                </div>
              ))}
            </div>
          )}

          {/* 2. MODULES / LESSONS TAB */}
          {activeTab === "modules" && (
            <div className="space-y-4">
              {!selectedModule && !selectedLesson && (
                <>
                  <div className="flex justify-between items-center">
                    <h2 className="text-xs font-bold text-slate-400 font-mono uppercase tracking-wider">Curriculum Modules</h2>
                    <span className="text-[10px] text-slate-400 font-mono">{modules.length} Available</span>
                  </div>

                  <div className="space-y-3">
                    {modules.map(mod => (
                      <div key={mod.id} className="bg-white/5 backdrop-blur-md border border-white/10 p-4 rounded-2xl shadow-lg flex flex-col">
                        <div className="flex justify-between items-start gap-2">
                          <span className="text-[10px] font-mono font-bold text-emerald-300 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                            {mod.code}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">{mod.progress}% Done</span>
                        </div>
                        <h3 className="text-xs font-bold text-white mt-2 line-clamp-2">{mod.title}</h3>
                        <p className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">{mod.description}</p>
                        
                        {/* Progress Bar */}
                        <div className="w-full bg-white/10 h-1.5 rounded-full mt-3 overflow-hidden">
                          <div 
                            className="bg-emerald-400 h-full rounded-full transition-all duration-300" 
                            style={{ width: `${mod.progress}%` }}
                          />
                        </div>

                        {/* Interactive Offline Storage Controls */}
                        <div className="flex justify-between items-center mt-4 pt-3 border-t border-white/10">
                          {mod.isCachedOffline ? (
                            <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-400 font-mono bg-emerald-500/10 px-2 py-1 rounded-lg border border-emerald-500/20">
                              <CheckCircle size={12} /> Saved to Phone
                            </span>
                          ) : downloadingModuleId === mod.id ? (
                            <div className="flex-1 mr-4">
                              <div className="flex justify-between text-[8px] font-mono text-amber-400 mb-1">
                                <span>CACHING MODULE ASSETS...</span>
                                <span>{downloadProgress}%</span>
                              </div>
                              <div className="w-full bg-amber-500/10 h-1 rounded-full overflow-hidden">
                                <div className="bg-amber-400 h-full transition-all duration-150" style={{ width: `${downloadProgress}%` }} />
                              </div>
                            </div>
                          ) : (
                            <button 
                              onClick={() => handleDownloadModule(mod.id)}
                              className="flex items-center gap-1 text-[10px] font-bold text-amber-300 bg-amber-500/15 hover:bg-amber-500/25 px-2.5 py-1.5 rounded-lg border border-amber-500/20 transition-colors font-mono"
                            >
                              <Download size={11} /> Download Offline
                            </button>
                          )}

                          <button 
                            onClick={() => {
                              setSelectedModule(mod);
                              setSelectedLesson(null);
                            }}
                            className="flex items-center gap-0.5 text-xs font-bold text-indigo-300 hover:translate-x-0.5 transition-transform"
                          >
                            Enter Module <ChevronRight size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
              {/* Module Active Screen */}
              {selectedModule && !selectedLesson && (
                <div className="space-y-4">
                  <button 
                    onClick={() => setSelectedModule(null)}
                    className="text-xs font-bold text-slate-400 font-mono hover:text-emerald-400 flex items-center gap-1"
                  >
                    ← Back to Modules
                  </button>

                  <div className="bg-white/5 backdrop-blur-md border border-white/10 p-4 rounded-2xl shadow-lg">
                    <span className="text-[9px] font-mono font-bold text-emerald-300 uppercase">{selectedModule.code}</span>
                    <h2 className="text-xs font-bold text-white mt-1">{selectedModule.title}</h2>
                    <p className="text-[11px] text-slate-400 mt-1.5 leading-relaxed">{selectedModule.description}</p>
                    
                    {selectedModule.isCachedOffline && (
                      <div className="mt-3 flex items-center gap-1.5 bg-emerald-500/10 text-emerald-300 text-[10px] font-mono font-semibold p-2 rounded-xl border border-emerald-500/20">
                        <Check size={12} className="stroke-[3]" /> Cached Offline & ready during outages
                      </div>
                    )}
                  </div>

                  {/* Materials list */}
                  <h3 className="text-xs font-bold text-slate-400 font-mono uppercase tracking-wider">Lesson Materials</h3>
                  
                  <div className="space-y-2.5">
                    {selectedModule.materials.map(mat => (
                      <button 
                        key={mat.id}
                        onClick={() => setSelectedLesson(mat)}
                        className="w-full text-left bg-white/5 backdrop-blur-md border border-white/10 p-3.5 rounded-2xl shadow-lg hover:border-indigo-400 transition-all flex items-start gap-3"
                      >
                        <div className="w-8 h-8 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-300 shrink-0 mt-0.5">
                          {mat.type === "text" ? <FileText size={16} /> :
                           mat.type === "audio" ? <Volume2 size={16} /> :
                           mat.type === "video" ? <Play size={16} /> : <LayersIcon size={16} />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs font-bold text-white line-clamp-1">{mat.title}</h4>
                          <div className="flex items-center gap-2 mt-1 text-[9px] font-mono text-slate-400">
                            <span className="uppercase font-bold text-indigo-300">{mat.type}</span>
                            <span>•</span>
                            <span>
                              {networkMode === "low-bandwidth" ? (
                                <span className="text-emerald-400 font-bold">Compressed: {mat.compressedSize}</span>
                              ) : `Size: ${mat.size}`}
                            </span>
                            {mat.duration && (
                              <>
                                <span>•</span>
                                <span>{mat.duration} mins</span>
                              </>
                            )}
                          </div>
                        </div>
                        <ChevronRight size={14} className="text-slate-400 shrink-0 self-center" />
                      </button>
                    ))}
                  </div>

                  {/* Module Quiz */}
                  {selectedModule.quiz && (
                    <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 p-4 rounded-2xl border border-white/10 mt-6 text-center">
                      <span className="text-[9px] font-bold font-mono text-indigo-300 uppercase tracking-wider">
                        Module Evaluation
                      </span>
                      <h4 className="text-xs font-bold text-white mt-1">{selectedModule.quiz.title}</h4>
                      <p className="text-[10px] text-slate-400 mt-1">Test your comprehension immediately. Caches results offline if signal fails.</p>
                      <button 
                        onClick={() => {
                          setActiveQuiz(selectedModule.quiz!);
                          setCurrentQuestionIndex(0);
                          setSelectedAnswer(null);
                          setQuizScore(0);
                        }}
                        className="w-full bg-indigo-600 hover:bg-indigo-500 border border-indigo-500/30 text-white py-2 rounded-xl font-bold text-xs mt-3.5 transition-colors shadow-lg"
                      >
                        Launch Interactive Quiz
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Lesson Viewer Screen */}
              {selectedLesson && (
                <div className="space-y-4">
                  <button 
                    onClick={() => setSelectedLesson(null)}
                    className="text-xs font-bold text-slate-400 font-mono hover:text-emerald-400 flex items-center gap-1"
                  >
                    ← Back to Module Overview
                  </button>

                  <div className="bg-white/5 backdrop-blur-md border border-white/10 p-4 rounded-2xl shadow-lg space-y-3">
                    <span className="text-[10px] font-mono font-bold text-indigo-300 bg-indigo-500/10 px-2 py-0.5 rounded uppercase border border-indigo-500/20">
                      {selectedLesson.type} Material
                    </span>
                    <h2 className="text-xs font-bold text-white leading-tight">{selectedLesson.title}</h2>
                    
                    {/* Simulated Player for media types */}
                    {selectedLesson.type === "video" && (
                      <div className="bg-slate-950 aspect-video rounded-xl flex flex-col items-center justify-center text-center p-4 text-white">
                        {networkMode === "low-bandwidth" ? (
                          <div className="space-y-1.5 p-2">
                            <WifiOff size={20} className="text-amber-400 mx-auto" />
                            <h5 className="text-[11px] font-bold text-amber-400">DATA-SAVER MODE ENFORCED</h5>
                            <p className="text-[9px] text-slate-300 leading-tight">Video streaming blocked to save your mobile data bundle (Saved {selectedLesson.size}). Text transcript rendered below.</p>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <div className="w-10 h-10 rounded-full bg-emerald-500/80 hover:bg-emerald-500 flex items-center justify-center cursor-pointer transition-colors mx-auto">
                              <Play size={16} fill="white" className="ml-0.5" />
                            </div>
                            <span className="text-[9px] text-slate-400 font-mono">Stream Quality Adjusted dynamically ({selectedLesson.size})</span>
                          </div>
                        )}
                      </div>
                    )}

                    {selectedLesson.type === "audio" && (
                      <div className="bg-white/5 border border-white/10 p-3 rounded-xl flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-white cursor-pointer">
                          <Play size={12} fill="white" className="ml-0.5" />
                        </div>
                        <div className="flex-1">
                          <div className="h-1.5 bg-white/10 rounded-full w-full overflow-hidden">
                            <div className="bg-emerald-400 h-full w-1/4" />
                          </div>
                          <div className="flex justify-between text-[8px] text-slate-400 font-mono mt-1">
                            <span>0:45 / {selectedLesson.duration || "4:00"}</span>
                            <span>{networkMode === "low-bandwidth" ? "Compressed G.711 Audio Codec" : "Original MP3"}</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Lesson Body Content */}
                    <div className="pt-3 border-t border-white/10">
                      <div className="prose prose-sm text-xs text-slate-300 leading-relaxed space-y-2.5 font-sans whitespace-pre-line">
                        {selectedLesson.content}
                      </div>
                    </div>
                  </div>

                  {/* Mark as complete */}
                  <button 
                    onClick={() => {
                      setSelectedLesson(null);
                      if (selectedModule) {
                        setModules(prev => prev.map(m => m.id === selectedModule.id ? { ...m, progress: Math.min(m.progress + 20, 100) } : m));
                      }
                    }}
                    className="w-full bg-emerald-600 text-white py-2.5 rounded-xl font-bold text-xs shadow-lg hover:bg-emerald-500 transition-colors border border-emerald-500/20"
                  >
                    Mark Lesson as Completed
                  </button>
                </div>
              )}
            </div>
          )}

          {/* 3. ADA AI COACH TAB */}
          {activeTab === "chat" && (
            <div className="flex flex-col h-[650px]">
              <div className="flex items-center gap-2 pb-3 mb-3 border-b border-white/10">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-500 to-indigo-400 flex items-center justify-center text-white font-bold text-xs shrink-0 shadow-md">
                  A
                </div>
                <div>
                  <h3 className="text-xs font-bold text-white">Ada AI Coach</h3>
                  <div className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-[9px] text-slate-400 font-mono">Gemini 2.5 Flash Connected</span>
                  </div>
                </div>
              </div>

              {/* Message History Scroller */}
              <div className="flex-1 overflow-y-auto space-y-3 pr-1 text-xs">
                {chatMessages.map(msg => (
                  <div key={msg.id} className={`flex gap-2 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                    {msg.sender === "bot" && (
                      <div className="w-6 h-6 rounded-lg bg-indigo-500/20 border border-indigo-500/20 flex items-center justify-center text-indigo-300 text-[10px] font-bold shrink-0">
                        A
                      </div>
                    )}
                    <div className={`max-w-[80%] rounded-2xl p-3 leading-relaxed text-[11px] ${
                      msg.sender === "user" 
                        ? "bg-indigo-600/80 backdrop-blur-md border border-indigo-500/30 text-white rounded-tr-none shadow-lg" 
                        : "bg-white/5 backdrop-blur-md border border-white/10 text-slate-200 rounded-tl-none shadow-lg"
                    }`}>
                      <div className="whitespace-pre-line">{msg.text}</div>
                      
                      {/* Meta information tags */}
                      <div className={`flex justify-end items-center gap-1 mt-1.5 text-[8px] font-mono ${
                        msg.sender === "user" ? "text-indigo-300" : "text-slate-400"
                      }`}>
                        <span>{msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        {msg.status === "cached" && (
                          <span className="text-amber-400 font-bold bg-amber-500/20 border border-amber-500/20 px-1 rounded">LOCAL CACHED</span>
                        )}
                        {msg.status === "sending" && (
                          <span className="animate-pulse text-indigo-400 font-bold">SENDING...</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {isTyping && (
                  <div className="flex gap-2 justify-start items-center">
                    <div className="w-6 h-6 rounded-lg bg-indigo-500/20 border border-indigo-500/20 flex items-center justify-center text-indigo-300 text-[10px] font-bold shrink-0">
                      A
                    </div>
                    <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl px-3.5 py-2.5 shadow-lg text-slate-400 font-mono text-[10px] flex items-center gap-1.5">
                      <Loader2 size={12} className="animate-spin text-indigo-400" />
                      <span>Ada is brainstorming...</span>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>

              {/* Suggested prompt chips */}
              <div className="flex gap-1.5 overflow-x-auto pb-2 pt-2 scrollbar-none text-[10px]">
                <button 
                  onClick={() => setChatInput("Explain how TCP handshake latency impacts mobile networks.")}
                  className="bg-white/5 hover:bg-white/10 border border-white/10 px-2.5 py-1 rounded-full text-slate-300 shrink-0 shadow-md transition-all"
                >
                  Explain TCP latency
                </button>
                <button 
                  onClick={() => setChatInput("What are Service Workers in a PWA context?")}
                  className="bg-white/5 hover:bg-white/10 border border-white/10 px-2.5 py-1 rounded-full text-slate-300 shrink-0 shadow-md transition-all"
                >
                  PWA Service Workers
                </button>
                <button 
                  onClick={() => setChatInput("Tips to sync study notes offline.")}
                  className="bg-white/5 hover:bg-white/10 border border-white/10 px-2.5 py-1 rounded-full text-slate-300 shrink-0 shadow-md transition-all"
                >
                  Offline Study Tips
                </button>
              </div>

              {/* Chat Input form */}
              <form onSubmit={handleSendChatMessage} className="flex gap-2 mt-1 shrink-0 pt-2 border-t border-white/10 bg-transparent">
                <input 
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder={networkMode === "offline" ? "Type questions (will cache)..." : "Ask Ada anything..."}
                  className="flex-1 bg-white/5 border border-white/15 text-white placeholder-slate-400 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
                <button 
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-500 border border-indigo-500/30 text-white p-2.5 rounded-xl shrink-0 transition-colors shadow-md"
                >
                  <Send size={14} />
                </button>
              </form>
            </div>
          )}

          {/* 4. SETTINGS & PROFILE TAB */}
          {activeTab === "settings" && (
            <div className="space-y-4">
              <h2 className="text-xs font-bold text-slate-400 font-mono uppercase tracking-wider">Device Settings</h2>
              
              <div className="bg-white/5 backdrop-blur-md border border-white/10 p-4 rounded-2xl shadow-lg space-y-3.5">
                <h3 className="text-xs font-bold text-white">Connection Speed Simulation</h3>
                <p className="text-[10px] text-slate-400 leading-normal">
                  Toggle your simulated cell signal below to preview how LearnBridge dynamically compresses media payloads, handles power failures, and caches student actions offline.
                </p>

                <div className="grid grid-cols-3 gap-2">
                  <button 
                    onClick={() => setNetworkMode("stable")}
                    className={`p-2 rounded-xl border text-center font-mono text-[9px] font-bold transition-all ${
                      networkMode === "stable" 
                        ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30 shadow-md" 
                        : "bg-white/5 text-slate-400 border-white/5 hover:bg-white/10"
                    }`}
                  >
                    <Wifi size={14} className="mx-auto mb-1" />
                    STABLE 4G
                  </button>
                  <button 
                    onClick={() => setNetworkMode("low-bandwidth")}
                    className={`p-2 rounded-xl border text-center font-mono text-[9px] font-bold transition-all ${
                      networkMode === "low-bandwidth" 
                        ? "bg-amber-500/20 text-amber-300 border-amber-500/30 shadow-md" 
                        : "bg-white/5 text-slate-400 border-white/5 hover:bg-white/10"
                    }`}
                  >
                    <Activity size={14} className="mx-auto mb-1" />
                    2G LITE
                  </button>
                  <button 
                    onClick={() => setNetworkMode("offline")}
                    className={`p-2 rounded-xl border text-center font-mono text-[9px] font-bold transition-all ${
                      networkMode === "offline" 
                        ? "bg-red-500/20 text-red-300 border-red-500/30 shadow-md" 
                        : "bg-white/5 text-slate-400 border-white/5 hover:bg-white/10"
                    }`}
                  >
                    <WifiOff size={14} className="mx-auto mb-1" />
                    OFFLINE
                  </button>
                </div>
              </div>

              {/* Data saving statistics */}
              <div className="bg-white/5 backdrop-blur-md border border-white/10 p-4 rounded-2xl shadow-lg space-y-3">
                <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Database size={14} className="text-emerald-400" /> Storage and Bandwidth Optimization
                </h3>
                
                <div className="space-y-2 text-[11px] text-slate-300">
                  <div className="flex justify-between font-mono">
                    <span>Data Saver Mode:</span>
                    <span className="font-bold text-emerald-400">
                      {networkMode === "low-bandwidth" ? "ENABLED (Compression Active)" : "STABLE"}
                    </span>
                  </div>
                  <div className="flex justify-between font-mono">
                    <span>Local cache size:</span>
                    <span>14.8 MB stored</span>
                  </div>
                  <div className="flex justify-between font-mono">
                    <span>Unsaved Local Logs:</span>
                    <span className="text-amber-400 font-bold">
                      {pendingSyncs.filter(s => s.status === "cached").length} records pending
                    </span>
                  </div>
                </div>
              </div>

              {/* Student Profile Switcher */}
              <div className="bg-white/5 backdrop-blur-md border border-white/10 p-4 rounded-2xl shadow-lg space-y-3">
                <h3 className="text-xs font-bold text-white">Select Active Student Profile</h3>
                <div className="space-y-2">
                  {INITIAL_STUDENTS.map(student => (
                    <button 
                      key={student.id}
                      onClick={() => setActiveStudent(student)}
                      className={`w-full text-left p-2.5 rounded-xl border flex justify-between items-center transition-all text-xs ${
                        activeStudent.id === student.id 
                          ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300 font-semibold" 
                          : "bg-white/5 border-white/5 text-slate-300 hover:bg-white/10"
                      }`}
                    >
                      <div>
                        <div>{student.name}</div>
                        <div className="text-[9px] text-slate-400 font-mono">Matricule: {student.matricule}</div>
                      </div>
                      {activeStudent.id === student.id && <Check size={14} className="text-emerald-400 shrink-0" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Logout Action */}
              {onLogout && (
                <div className="bg-white/5 backdrop-blur-md border border-white/10 p-4 rounded-2xl shadow-lg space-y-2.5">
                  <h3 className="text-xs font-bold text-white">Ecosystem Session</h3>
                  <button 
                    onClick={onLogout}
                    className="w-full bg-rose-600/80 hover:bg-rose-500 border border-rose-500/20 text-white py-2.5 rounded-xl font-bold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-md"
                  >
                    <LogOut size={13} />
                    Disconnect & Log Out
                  </button>
                </div>
              )}
            </div>
          )}

        </div>

        {/* Sticky Mobile Navigation Bar */}
        <div className="absolute bottom-0 inset-x-0 h-16 bg-black/60 backdrop-blur-xl border-t border-white/10 flex justify-around items-center z-50 px-2 pb-2">
          <button 
            onClick={() => { setActiveTab("feed"); setSelectedModule(null); setSelectedLesson(null); }}
            className={`flex flex-col items-center justify-center flex-1 h-full py-1 text-[10px] font-medium transition-all ${
              activeTab === "feed" ? "text-emerald-400" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Home size={18} className="mb-0.5" />
            Feed
          </button>
          <button 
            onClick={() => { setActiveTab("modules"); }}
            className={`flex flex-col items-center justify-center flex-1 h-full py-1 text-[10px] font-medium transition-all ${
              activeTab === "modules" ? "text-emerald-400" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <BookOpen size={18} className="mb-0.5" />
            Modules
          </button>
          <button 
            onClick={() => { setActiveTab("chat"); }}
            className={`flex flex-col items-center justify-center flex-1 h-full py-1 text-[10px] font-medium transition-all ${
              activeTab === "chat" ? "text-emerald-400" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <MessageSquare size={18} className="mb-0.5" />
            Ada Coach
          </button>
          <button 
            onClick={() => { setActiveTab("settings"); }}
            className={`flex flex-col items-center justify-center flex-1 h-full py-1 text-[10px] font-medium transition-all ${
              activeTab === "settings" ? "text-emerald-400" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Settings size={18} className="mb-0.5" />
            Settings
          </button>
        </div>

      </div>

      {/* QUIZ DIALOG / MODAL SIMULATION */}
      {activeQuiz && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[999]">
          <div className="bg-slate-900/95 backdrop-blur-2xl rounded-3xl max-w-[360px] w-full p-5 shadow-2xl border border-white/10 space-y-4 text-white">
            <div className="flex justify-between items-center border-b border-white/10 pb-2">
              <span className="text-[9px] font-mono font-bold text-indigo-300 uppercase">ACTIVE TEST</span>
              <button 
                onClick={() => setActiveQuiz(null)}
                className="text-xs font-mono text-slate-400 hover:text-white font-bold"
              >
                Close
              </button>
            </div>

            {quizScore === null || quizScore < 0 || currentQuestionIndex < activeQuiz.questions.length ? (
              <div className="space-y-4">
                <div className="flex justify-between items-center text-[10px] text-slate-400 font-mono">
                  <span>Question {currentQuestionIndex + 1} of {activeQuiz.questions.length}</span>
                  <span className="bg-indigo-500/15 text-indigo-300 font-semibold px-2 py-0.5 rounded-full border border-indigo-500/20">
                    {UNIVERSITY_INFO.courseCode}
                  </span>
                </div>

                <h3 className="text-xs font-bold text-white leading-snug">
                  {activeQuiz.questions[currentQuestionIndex].question}
                </h3>

                <div className="space-y-2">
                  {activeQuiz.questions[currentQuestionIndex].options.map((option, idx) => (
                    <button 
                      key={idx}
                      onClick={() => handleAnswerSelection(idx)}
                      className={`w-full text-left p-3 rounded-xl border text-xs leading-relaxed transition-all ${
                        selectedAnswer === idx 
                          ? "bg-indigo-500/20 border-indigo-400 text-indigo-300 font-bold" 
                          : "bg-white/5 border-white/10 hover:bg-white/10 text-slate-200"
                      }`}
                    >
                      <span className="font-mono font-bold mr-2">{String.fromCharCode(65 + idx)}.</span>
                      {option}
                    </button>
                  ))}
                </div>

                <button 
                  onClick={handleNextQuizQuestion}
                  disabled={selectedAnswer === null}
                  className="w-full bg-emerald-600 hover:bg-emerald-500 border border-emerald-500/30 text-white py-2.5 rounded-xl font-bold text-xs mt-3 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1 shadow-lg"
                >
                  {currentQuestionIndex + 1 === activeQuiz.questions.length ? "Submit Answers" : "Next Question"} <ArrowRight size={14} />
                </button>
              </div>
            ) : (
              <div className="text-center py-6 space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/20 flex items-center justify-center mx-auto shadow-inner">
                  <Award size={36} />
                </div>
                <div>
                  <h3 className="text-sm font-black text-white">Evaluation Completed!</h3>
                  <p className="text-xs text-slate-400 mt-1">Your answers have been processed successfully.</p>
                </div>

                <div className="bg-white/5 p-4 rounded-2xl border border-white/10 font-mono text-xs text-slate-200">
                  <div className="flex justify-between mb-1.5 text-slate-300">
                    <span>Student Name:</span>
                    <span className="font-bold text-white">{activeStudent.name}</span>
                  </div>
                  <div className="flex justify-between mb-1.5 text-slate-300">
                    <span>Final Score:</span>
                    <span className="font-bold text-emerald-400">{quizScore} / {activeQuiz.questions.length}</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Database Status:</span>
                    <span className={networkMode === "offline" ? "text-amber-400 font-bold" : "text-emerald-400 font-bold"}>
                      {networkMode === "offline" ? "PENDING SYNC" : "SECURE SYNCED"}
                    </span>
                  </div>
                </div>

                <button 
                  onClick={() => {
                    setActiveQuiz(null);
                    setQuizScore(null);
                  }}
                  className="w-full bg-indigo-600 hover:bg-indigo-500 border border-indigo-500/30 text-white py-2.5 rounded-xl font-bold text-xs transition-colors shadow-lg"
                >
                  Return to Module Overview
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// Dummy small helper icons
function LayersIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m12 3-10 5 10 5 10-5-10-5Z" />
      <path d="m2 17 10 5 10-5" />
      <path d="m2 12 10 5 10-5" />
    </svg>
  );
}
