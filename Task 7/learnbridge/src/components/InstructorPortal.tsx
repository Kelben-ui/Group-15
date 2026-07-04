import React, { useState, useEffect } from "react";
import { 
  Users, BookOpen, Plus, Search, CheckCircle, Video, Activity, BarChart2,
  Trash2, Radio, MessageSquare, Star, Play, Award, FileText, Send, Calendar, ShieldAlert
} from "lucide-react";
import { CourseModule, LessonMaterial, UserRecord, UserRole } from "../types";
import { UNIVERSITY_INFO, INITIAL_MODULES, INITIAL_STUDENTS } from "../data";

interface InstructorPortalProps {
  onModuleCreated?: (newModule: CourseModule) => void;
  pendingSyncs: any[];
}

export default function InstructorPortal({ onModuleCreated, pendingSyncs }: InstructorPortalProps) {
  // Curriculum state
  const [modules, setModules] = useState<CourseModule[]>(INITIAL_MODULES);
  const [newModTitle, setNewModTitle] = useState("");
  const [newModCode, setNewModCode] = useState("");
  const [newModDesc, setNewModDesc] = useState("");
  const [materialType, setMaterialType] = useState<"text" | "video" | "audio" | "slides">("text");
  const [materialTitle, setMaterialTitle] = useState("");
  const [materialSize, setMaterialSize] = useState("2.4 MB");
  const [materialContent, setMaterialContent] = useState("");
  const [addedMaterials, setAddedMaterials] = useState<LessonMaterial[]>([]);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  // Load modules from backend on mount
  useEffect(() => {
    const fetchModules = async () => {
      try {
        const res = await fetch("/api/modules");
        if (res.ok) {
          const data = await res.json();
          setModules(data.modules);
        }
      } catch (err) {
        console.error("Failed to fetch modules on load, falling back to static:", err);
      }
    };
    fetchModules();
  }, []);

  // Simulation of Live Streaming classroom
  const [isLive, setIsLive] = useState(false);
  const [liveTopic, setLiveTopic] = useState("Responsive Layout Design on 2G Connections");
  const [activeSessionChat, setActiveSessionChat] = useState<any[]>([
    { id: "1", user: "Karl Jonas", msg: "Will the quiz be saved if the campus generator turns off?", time: "10:41 WAT" },
    { id: "2", user: "Brianna Tebesick", msg: "Dr. Nkemeni, is HPACK header compression enabled automatically in Express?", time: "10:43 WAT" },
    { id: "3", user: "Njinya Ryan", msg: "I've successfully cached Module 1 offline! The text load is incredibly fast.", time: "10:45 WAT" }
  ]);
  const [instructorLiveMessage, setInstructorLiveMessage] = useState("");

  // Student reviews
  const [studentRatings, setStudentRatings] = useState<any[]>([
    { id: "r1", name: "Kelsey Njock-Oben", rating: 5, comment: "The highly compressed audio lesson saved my mobile bundle. It loaded instantly in my village!", date: "Today" },
    { id: "r2", name: "Brianna Tebesick", rating: 5, comment: "I really enjoy Ada AI Coach! It clarifies concepts Dr. Valery presents.", date: "Yesterday" },
    { id: "r3", name: "Karl Jonas", rating: 4, comment: "The offline cache sync worked flawlessly once I came near FET campus Wi-Fi.", date: "July 2, 2026" }
  ]);

  // Handle module generation
  const handleAddMaterial = (e: React.FormEvent) => {
    e.preventDefault();
    if (!materialTitle || !materialContent) return;

    const newMat: LessonMaterial = {
      id: `mat-${Date.now()}`,
      type: materialType,
      title: materialTitle,
      url: "#",
      size: materialSize,
      compressedSize: `${Math.round(parseFloat(materialSize) * 0.15 * 10) / 10} MB`, // 85% saved!
      content: materialContent
    };

    setAddedMaterials(prev => [...prev, newMat]);
    setMaterialTitle("");
    setMaterialContent("");
  };

  const handleCreateModuleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newModTitle || !newModCode || !newModDesc) return;

    const payload = {
      title: newModTitle,
      code: newModCode,
      description: newModDesc,
      materials: addedMaterials.length > 0 ? addedMaterials : [
        {
          id: `mat-dummy-${Date.now()}`,
          type: "text" as const,
          title: "Introduction Chapter (Auto-Generated)",
          url: "#",
          size: "1.2 MB",
          compressedSize: "180 KB",
          content: "Welcome to this newly drafted module. Read through the guidelines to complete your assessments."
        }
      ]
    };

    try {
      const token = localStorage.getItem("learnbridge_token");
      const res = await fetch("/api/modules", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        const data = await res.json();
        setModules(data.modules);
        if (onModuleCreated) {
          onModuleCreated(data.module);
        }
      } else {
        // Fallback local append
        setModules(prev => [...prev, { ...payload, id: `mod-${Date.now()}`, progress: 0, isCachedOffline: false, instructorName: "Dr. Nkemeni Valery" }]);
      }
    } catch (err) {
      console.error("Failed to post module:", err);
      setModules(prev => [...prev, { ...payload, id: `mod-${Date.now()}`, progress: 0, isCachedOffline: false, instructorName: "Dr. Nkemeni Valery" }]);
    }

    // Reset Form
    setNewModTitle("");
    setNewModCode("");
    setNewModDesc("");
    setAddedMaterials([]);
    
    setSuccessNotice(`Successfully launched Module ${newModCode} to Student portals!`);
    setTimeout(() => {
      setSuccessNotice(null);
    }, 5000);
  };

  // Live Chat Reply
  const handleSendLiveMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!instructorLiveMessage.trim()) return;

    setActiveSessionChat(prev => [...prev, {
      id: `reply-${Date.now()}`,
      user: "Dr. Nkemeni Valery (Instructor)",
      msg: instructorLiveMessage,
      time: "Just Now",
      isInstructor: true
    }]);
    setInstructorLiveMessage("");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6 bg-transparent min-h-[90vh]">
      
      {/* Upper Bio panel */}
      <div className="bg-white/5 backdrop-blur-md rounded-3xl p-6 border border-white/10 shadow-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold font-mono text-indigo-300 bg-indigo-500/15 border border-indigo-500/20 px-2 py-0.5 rounded uppercase">
              FACULTY ACCOUNT
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[11px] text-slate-400 font-mono">Live Sync Engine: Connected</span>
          </div>
          <h1 className="text-xl font-black text-white mt-1">{UNIVERSITY_INFO.instructor}</h1>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            {UNIVERSITY_INFO.department} • {UNIVERSITY_INFO.institution}
          </p>
        </div>

        {/* Live streaming switch */}
        <div className="flex items-center gap-3 bg-white/5 border border-white/10 p-3 rounded-2xl">
          <div className="text-right">
            <div className="text-[10px] text-slate-400 font-mono">LECTURE STATUS</div>
            <div className="text-xs font-bold text-white">
              {isLive ? "🔴 Active Live Stream" : "⚪ Offline / Classroom Closed"}
            </div>
          </div>
          <button 
            onClick={() => setIsLive(!isLive)}
            className={`px-4 py-2 rounded-xl font-bold text-xs transition-all ${
              isLive 
                ? "bg-red-600 border border-red-500/30 text-white hover:bg-red-500 shadow-md" 
                : "bg-indigo-600 hover:bg-indigo-500 border border-indigo-500/30 text-white shadow-md"
            }`}
          >
            {isLive ? "Stop Stream" : "Start Live Class"}
          </button>
        </div>
      </div>

      {/* Main Grid split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN (8 cols): Analytics Dashboard & Live Stream Simulator */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Quick Stats Rows */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white/5 backdrop-blur-md p-5 rounded-3xl border border-white/10 shadow-lg text-white">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <span className="text-[10px] font-mono text-slate-400 uppercase">Enrolled Students</span>
                  <h3 className="text-2xl font-black text-white">{INITIAL_STUDENTS.length}</h3>
                </div>
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/15 text-emerald-300 border border-emerald-500/20 flex items-center justify-center">
                  <Users size={18} />
                </div>
              </div>
              <div className="text-[10px] text-slate-400 font-mono mt-3">
                All 4 matricules fully verified from Buea database.
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-md p-5 rounded-3xl border border-white/10 shadow-lg text-white">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <span className="text-[10px] font-mono text-slate-400 uppercase">Average Attendance</span>
                  <h3 className="text-2xl font-black text-emerald-300">91.7%</h3>
                </div>
                <div className="w-10 h-10 rounded-2xl bg-indigo-500/15 text-indigo-300 border border-indigo-500/20 flex items-center justify-center">
                  <Activity size={18} />
                </div>
              </div>
              <div className="text-[10px] text-slate-400 font-mono mt-3">
                Calculated dynamically via client connection pings.
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-md p-5 rounded-3xl border border-white/10 shadow-lg text-white">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <span className="text-[10px] font-mono text-indigo-300 uppercase">Total Bandwidth Saved</span>
                  <h3 className="text-2xl font-black text-indigo-300">85%</h3>
                </div>
                <div className="w-10 h-10 rounded-2xl bg-blue-500/15 text-blue-300 border border-blue-500/20 flex items-center justify-center">
                  <BarChart2 size={18} />
                </div>
              </div>
              <div className="text-[10px] text-emerald-400 font-mono mt-3 font-semibold">
                Due to server-side asset compression!
              </div>
            </div>
          </div>

          {/* Live stream section */}
          {isLive && (
            <div className="bg-slate-950/80 backdrop-blur-md rounded-3xl p-5 border border-white/10 text-white space-y-4">
              <div className="flex justify-between items-center">
                <span className="flex items-center gap-1.5 bg-red-600 border border-red-500/20 text-white text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full animate-pulse font-mono shadow-md">
                  <Radio size={12} /> Live stream active
                </span>
                <span className="text-xs text-slate-400 font-mono">Duration: 12:45 mins</span>
              </div>

              <div>
                <span className="text-[10px] font-mono text-indigo-300 block uppercase">CURRENT LECTURE TOPIC</span>
                <input 
                  type="text" 
                  value={liveTopic}
                  onChange={(e) => setLiveTopic(e.target.value)}
                  className="bg-transparent border-b border-white/10 focus:border-emerald-400 outline-none text-sm font-black w-full py-1 text-white"
                />
              </div>

              {/* Classroom splitting: Screen simulation + chat splitting */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Simulated webcam */}
                <div className="bg-slate-950/90 rounded-2xl aspect-video flex flex-col justify-between p-4 relative overflow-hidden border border-white/5">
                  <div className="flex justify-between items-start z-10">
                    <span className="bg-black/60 px-2 py-0.5 rounded text-[9px] font-mono">Cam: Dr. Valery</span>
                    <span className="bg-emerald-600 text-white text-[9px] px-1.5 py-0.5 rounded font-bold font-mono border border-emerald-500/20">1080p Low-Delay</span>
                  </div>
                  
                  {/* Mock camera view */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-3 bg-slate-900/40">
                    <Video size={48} className="text-emerald-400 stroke-[1.5]" />
                    <span className="text-xs font-bold mt-2">Dr. Valery's Presentation Canvas</span>
                    <span className="text-[9px] text-slate-400 mt-0.5">Capturing presentation slides & microphone audio</span>
                  </div>

                  <div className="flex justify-between items-end z-10 text-[9px] font-mono text-slate-400">
                    <span>In-stream latency: 120ms</span>
                    <span>Buffer: Stable</span>
                  </div>
                </div>

                {/* Simulated chat inside live stream */}
                <div className="bg-slate-950/90 rounded-2xl border border-white/5 p-4 flex flex-col h-[200px] md:h-auto">
                  <span className="text-[9px] font-mono text-indigo-300 font-bold block uppercase mb-2">Live Session Q&A Chat</span>
                  
                  {/* Chat messages */}
                  <div className="flex-1 overflow-y-auto space-y-2.5 text-[11px] pr-1">
                    {activeSessionChat.map(chat => (
                      <div key={chat.id} className="bg-white/5 border border-white/5 p-2 rounded-xl">
                        <div className="flex justify-between text-slate-400 text-[9px] font-mono">
                          <span className={chat.isInstructor ? "text-emerald-400 font-bold" : "text-indigo-300 font-bold"}>{chat.user}</span>
                          <span>{chat.time}</span>
                        </div>
                        <p className="text-slate-200 mt-1">{chat.msg}</p>
                      </div>
                    ))}
                  </div>

                  {/* Reply Form */}
                  <form onSubmit={handleSendLiveMessage} className="flex gap-1.5 mt-3 pt-2 border-t border-white/10 shrink-0">
                    <input 
                      type="text" 
                      value={instructorLiveMessage}
                      onChange={(e) => setInstructorLiveMessage(e.target.value)}
                      placeholder="Answer a student query..."
                      className="flex-1 bg-white/5 text-xs text-white rounded-lg px-2 py-1.5 border border-white/10 focus:outline-none focus:border-indigo-400 placeholder-slate-500"
                    />
                    <button type="submit" className="bg-indigo-600 hover:bg-indigo-500 border border-indigo-500/30 text-white px-2.5 py-1.5 rounded-lg font-bold text-xs shadow-md">
                      Reply
                    </button>
                  </form>
                </div>

              </div>
            </div>
          )}

          {/* Active curriculum display */}
          <div className="bg-white/5 backdrop-blur-md rounded-3xl p-6 border border-white/10 shadow-lg space-y-4">
            <h2 className="text-sm font-bold text-white font-mono uppercase tracking-wider">Active Curriculum Modules</h2>
            
            <div className="space-y-3">
              {modules.map(mod => (
                <div key={mod.id} className="p-4 rounded-2xl bg-white/5 border border-white/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 hover:bg-white/10 transition-all">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono font-bold text-emerald-300 bg-emerald-500/15 border border-emerald-500/20 px-2 py-0.5 rounded">
                        {mod.code}
                      </span>
                      <span className="text-[11px] text-slate-400 font-mono">{mod.materials.length} lessons published</span>
                    </div>
                    <h4 className="text-xs font-bold text-white">{mod.title}</h4>
                    <p className="text-[11px] text-slate-400 leading-relaxed line-clamp-1">{mod.description}</p>
                  </div>

                  <div className="flex gap-2">
                    <span className="bg-white/5 border border-white/10 text-slate-300 text-[10px] font-mono px-2.5 py-1 rounded-xl">
                      Cache Ready
                    </span>
                    <button 
                      onClick={() => setModules(prev => prev.filter(m => m.id !== mod.id))}
                      className="p-1 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                      title="De-publish module"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN (4 cols): Curriculum Creation panel & Quality of Experience Feedback */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Create Curriculum Module Card */}
          <div className="bg-white/5 backdrop-blur-md rounded-3xl p-6 border border-white/10 shadow-lg space-y-4">
            <div className="flex items-center gap-2">
              <BookOpen className="text-emerald-400" size={18} />
              <h2 className="text-xs font-bold text-white font-mono uppercase tracking-wider">Curriculum Builder</h2>
            </div>
            
            <form onSubmit={handleCreateModuleSubmit} className="space-y-3.5 text-xs text-slate-200">
              {successNotice && (
                <div className="bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 p-2.5 rounded-xl font-mono text-[10px] leading-relaxed">
                  {successNotice}
                </div>
              )}

              <div>
                <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1">Module Code</label>
                <input 
                  type="text" 
                  value={newModCode}
                  onChange={(e) => setNewModCode(e.target.value)}
                  placeholder="e.g. CEF440-M4"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-emerald-500 text-white placeholder-slate-500"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1">Module Title</label>
                <input 
                  type="text" 
                  value={newModTitle}
                  onChange={(e) => setNewModTitle(e.target.value)}
                  placeholder="e.g. Server-Side REST APIs & Node"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-emerald-500 text-white placeholder-slate-500"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1">Brief Description</label>
                <textarea 
                  value={newModDesc}
                  onChange={(e) => setNewModDesc(e.target.value)}
                  placeholder="Explain course syllabus details..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-emerald-500 text-white placeholder-slate-500 h-16 resize-none"
                  required
                />
              </div>

              {/* Lesson materials preview of added ones */}
              {addedMaterials.length > 0 && (
                <div className="bg-white/5 p-3 rounded-2xl border border-white/10 space-y-1.5">
                  <div className="text-[9px] text-slate-400 font-mono font-bold uppercase">ADDED MODULE MATERIALS</div>
                  {addedMaterials.map((mat, i) => (
                    <div key={i} className="flex justify-between text-[11px] font-medium text-slate-200 bg-slate-900/60 p-2 rounded-lg border border-white/5">
                      <span>{mat.title}</span>
                      <span className="font-mono text-[9px] text-emerald-300 bg-emerald-500/20 border border-emerald-500/20 px-1 rounded font-bold">{mat.type.toUpperCase()}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Add Material Nested Panel */}
              <div className="border border-dashed border-white/10 p-3 rounded-2xl bg-white/5 space-y-2">
                <div className="text-[10px] text-slate-400 font-mono font-bold uppercase">Attach Material</div>
                
                <div className="grid grid-cols-2 gap-1 text-[10px]">
                  <button 
                    type="button" 
                    onClick={() => setMaterialType("text")}
                    className={`py-1 rounded font-mono transition-all ${materialType === "text" ? "bg-emerald-600 text-white" : "bg-white/5 text-slate-400 border border-white/5"}`}
                  >
                    TEXT
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setMaterialType("audio")}
                    className={`py-1 rounded font-mono transition-all ${materialType === "audio" ? "bg-emerald-600 text-white" : "bg-white/5 text-slate-400 border border-white/5"}`}
                  >
                    AUDIO
                  </button>
                </div>

                <input 
                  type="text" 
                  value={materialTitle}
                  onChange={(e) => setMaterialTitle(e.target.value)}
                  placeholder="Material title (e.g. Code Snippets)"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-2.5 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500 text-white placeholder-slate-500"
                />
                
                <textarea 
                  value={materialContent}
                  onChange={(e) => setMaterialContent(e.target.value)}
                  placeholder="Paste lecture body text or transcript context..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-2.5 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500 text-white placeholder-slate-500 h-12 resize-none"
                />

                <button 
                  type="button"
                  onClick={handleAddMaterial}
                  className="w-full bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/25 text-emerald-300 py-1.5 rounded-lg font-mono text-[10px] font-bold transition-all"
                >
                  + Add To Current Module
                </button>
              </div>

              <button 
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-500 border border-emerald-500/30 text-white py-2.5 rounded-xl font-bold transition-all shadow-md flex items-center justify-center gap-1 mt-4"
              >
                <Plus size={14} /> Publish Complete Module
              </button>
            </form>
          </div>

          {/* Quality of Experience Student Feedback comments */}
          <div className="bg-white/5 backdrop-blur-md rounded-3xl p-6 border border-white/10 shadow-lg space-y-4">
            <div className="flex items-center gap-2">
              <Star className="text-amber-400 fill-amber-400" size={18} />
              <h2 className="text-xs font-bold text-white font-mono uppercase tracking-wider">Student Experience Reviews</h2>
            </div>

            <div className="space-y-3">
              {studentRatings.map(rate => (
                <div key={rate.id} className="p-3 bg-white/5 rounded-2xl border border-white/10 space-y-1.5">
                  <div className="flex justify-between items-center text-[10px] font-mono">
                    <span className="font-bold text-slate-200">{rate.name}</span>
                    <div className="flex items-center text-amber-400">
                      {Array.from({ length: rate.rating }).map((_, i) => (
                        <Star key={i} size={10} fill="currentColor" />
                      ))}
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-300 italic">"{rate.comment}"</p>
                  <div className="text-[8px] text-slate-400 text-right font-mono">{rate.date}</div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
