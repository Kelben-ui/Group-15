import React, { useState, useEffect } from "react";
import { 
  Shield, Server, Search, Database, RefreshCw, Plus, UserPlus, 
  Trash2, Filter, Settings, Activity, Cpu, CheckCircle, Wifi, Play, AlertTriangle
} from "lucide-react";
import { UserRecord, UserRole } from "../types";
import { UNIVERSITY_INFO, INITIAL_STUDENTS, INITIAL_INSTRUCTORS, INITIAL_ADMINS } from "../data";

interface AdminPortalProps {
  pendingSyncs: any[];
  clearPendingSyncs: () => void;
}

export default function AdminPortal({ pendingSyncs, clearPendingSyncs }: AdminPortalProps) {
  const [users, setUsers] = useState<UserRecord[]>([
    ...INITIAL_STUDENTS,
    ...INITIAL_INSTRUCTORS,
    ...INITIAL_ADMINS
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");

  // Add User Form state
  const [userName, setUserName] = useState("");
  const [userMatricule, setUserMatricule] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userRole, setUserRole] = useState<UserRole>(UserRole.STUDENT);
  const [showAddForm, setShowAddForm] = useState(false);

  // System stats
  const [systemUptime, setSystemUptime] = useState("99.98%");
  const [bandwidthSavedMb, setBandwidthSavedMb] = useState(482.4);
  const [cpuUsage, setCpuUsage] = useState(14);
  const [ramUsage, setRamUsage] = useState(42);

  // Sync log list
  const [syncLogs, setSyncLogs] = useState<any[]>([]);

  // Fetch users and logs on component load and whenever pendingSyncs gets synced
  useEffect(() => {
    const loadAdminData = async () => {
      try {
        const token = localStorage.getItem("learnbridge_token");
        
        // Fetch Users
        const resUsers = await fetch("/api/users", {
          headers: { "Authorization": `Bearer ${token}` }
        });
        if (resUsers.ok) {
          const data = await resUsers.json();
          setUsers(data.users);
        }

        // Fetch Logs
        const resLogs = await fetch("/api/logs", {
          headers: { "Authorization": `Bearer ${token}` }
        });
        if (resLogs.ok) {
          const data = await resLogs.json();
          setSyncLogs(data.logs);
        }
      } catch (err) {
        console.error("Failed to load admin telemetry data:", err);
      }
    };
    loadAdminData();
  }, [pendingSyncs]);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName || !userEmail || !userMatricule) return;

    try {
      const token = localStorage.getItem("learnbridge_token");
      const res = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          name: userName,
          email: userEmail,
          matricule: userMatricule,
          role: userRole
        })
      });

      if (res.ok) {
        const data = await res.json();
        setUsers(data.users);
        
        // Refetch logs to get updated logs list
        const resLogs = await fetch("/api/logs", {
          headers: { "Authorization": `Bearer ${token}` }
        });
        if (resLogs.ok) {
          const dataLogs = await resLogs.json();
          setSyncLogs(dataLogs.logs);
        }
      }
    } catch (err) {
      console.error("Failed to register user on server:", err);
    }

    setUserName("");
    setUserEmail("");
    setUserMatricule("");
    setShowAddForm(false);
  };

  const handleDeleteUser = async (id: string) => {
    try {
      const token = localStorage.getItem("learnbridge_token");
      const res = await fetch(`/api/users/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (res.ok) {
        const data = await res.json();
        setUsers(data.users);

        // Refetch logs
        const resLogs = await fetch("/api/logs", {
          headers: { "Authorization": `Bearer ${token}` }
        });
        if (resLogs.ok) {
          const dataLogs = await resLogs.json();
          setSyncLogs(dataLogs.logs);
        }
      } else {
        const data = await res.json();
        alert(data.error || "Failed to delete user profile");
      }
    } catch (err) {
      console.error("Failed to delete user profile:", err);
    }
  };

  // Filtered list
  const filteredUsers = users.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          u.matricule.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          u.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "all" ? true : u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6 bg-transparent min-h-[90vh]">
      
      {/* Header system banner */}
      <div className="bg-slate-950/80 backdrop-blur-md text-white rounded-3xl p-6 border border-white/10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="bg-rose-500/15 border border-rose-500/20 text-rose-300 text-[10px] font-bold font-mono px-2 py-0.5 rounded-full uppercase tracking-wider">
              System Administrator Portal
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[11px] text-slate-400 font-mono">Platform Integrity: Secured</span>
          </div>
          <h1 className="text-xl font-black tracking-tight text-white">LearnBridge Admin Workspace</h1>
          <p className="text-xs text-slate-400 font-mono">
            Node Server Daemon Caches • {UNIVERSITY_INFO.institution} • {UNIVERSITY_INFO.department}
          </p>
        </div>

        {/* Sync Queues controller */}
        <div className="flex items-center gap-3 bg-white/5 p-3.5 rounded-2xl border border-white/10">
          <div className="text-right">
            <div className="text-[9px] text-slate-500 font-mono">PENDING TRANSACTION SPOOLS</div>
            <div className="text-xs font-bold text-white">
              {pendingSyncs.length} Unsynchronized Mobile Rows
            </div>
          </div>
          <button 
            disabled={pendingSyncs.length === 0}
            onClick={() => {
              pendingSyncs.forEach(sync => {
                setSyncLogs(prev => [
                  { id: `sync-${Date.now()}-${Math.random()}`, type: "cache_sync", details: `Synced: ${sync.type === "quiz_score" ? `${sync.student} scored ${sync.score}` : (sync.details || "Material download cached")}`, status: "success", time: new Date().toLocaleTimeString() },
                  ...prev
                ]);
              });
              clearPendingSyncs();
            }}
            className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 disabled:cursor-not-allowed border border-emerald-500/30 text-white text-xs font-mono font-bold px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 shadow-md"
          >
            <RefreshCw size={12} className={pendingSyncs.length > 0 ? "animate-spin" : ""} />
            Sync Spoolers
          </button>
        </div>
      </div>

      {/* Admin system dashboards: CPU, bandwidth savings, logs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        
        <div className="bg-white/5 backdrop-blur-md p-5 rounded-3xl border border-white/10 shadow-lg flex items-center gap-4 text-white">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 text-emerald-300 border border-emerald-500/20 flex items-center justify-center shrink-0">
            <Cpu size={24} />
          </div>
          <div>
            <div className="text-[10px] text-slate-400 font-mono">SERVER CONTAINER CPU</div>
            <div className="text-lg font-black text-white">{cpuUsage}% load</div>
            <div className="text-[9px] text-slate-400 font-mono">Uptime: {systemUptime}</div>
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-md p-5 rounded-3xl border border-white/10 shadow-lg flex items-center gap-4 text-white">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/15 text-indigo-300 border border-indigo-500/20 flex items-center justify-center shrink-0">
            <Database size={24} />
          </div>
          <div>
            <div className="text-[10px] text-slate-400 font-mono">TOTAL SYSTEM RAM</div>
            <div className="text-lg font-black text-white">{ramUsage}% capacity</div>
            <div className="text-[9px] text-slate-400 font-mono">Memory stripped natively</div>
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-md p-5 rounded-3xl border border-white/10 shadow-lg flex items-center gap-4 text-white">
          <div className="w-12 h-12 rounded-2xl bg-blue-500/15 text-blue-300 border border-blue-500/20 flex items-center justify-center shrink-0">
            <Wifi size={24} />
          </div>
          <div>
            <div className="text-[10px] text-slate-400 font-mono">CELLULAR MOBILE DATA SAVED</div>
            <div className="text-lg font-black text-emerald-300">{bandwidthSavedMb} MB</div>
            <div className="text-[9px] text-slate-400 font-mono">Through 85% compression</div>
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-md p-5 rounded-3xl border border-white/10 shadow-lg flex items-center gap-4 text-white">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/15 text-amber-300 border border-amber-500/20 flex items-center justify-center shrink-0">
            <RefreshCw size={24} />
          </div>
          <div>
            <div className="text-[10px] text-slate-400 font-mono">OFFLINE CACHE POOLS</div>
            <div className="text-lg font-black text-white">3 Synced Databases</div>
            <div className="text-[9px] text-slate-400 font-mono">Encrypted locally on sqlite</div>
          </div>
        </div>

      </div>

      {/* Main split: user tables vs event logs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* User table (8 cols) */}
        <div className="lg:col-span-8 bg-white/5 backdrop-blur-md p-6 rounded-3xl border border-white/10 shadow-lg space-y-4 text-white">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
            <div>
              <h2 className="text-sm font-bold text-white font-mono uppercase tracking-wider">User Directory</h2>
              <p className="text-[11px] text-slate-400">Add, monitor, or sync user progress metrics from University of Buea.</p>
            </div>
            
            <button 
              onClick={() => setShowAddForm(!showAddForm)}
              className="bg-emerald-600 hover:bg-emerald-500 border border-emerald-500/30 text-white text-xs font-bold px-3.5 py-2 rounded-xl transition-all flex items-center gap-1 self-start sm:self-auto shadow-md"
            >
              <UserPlus size={14} /> {showAddForm ? "Cancel Form" : "Add Student / Staff"}
            </button>
          </div>

          {/* Add User form toggle */}
          {showAddForm && (
            <form onSubmit={handleCreateUser} className="bg-white/5 p-4 rounded-2xl border border-white/10 grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs text-slate-200">
              <div>
                <label className="block text-[9px] font-mono text-slate-400 uppercase mb-1">Full Name</label>
                <input 
                  type="text" 
                  value={userName} 
                  onChange={(e) => setUserName(e.target.value)} 
                  placeholder="e.g. Arrey Enow Divine"
                  className="w-full bg-slate-900/40 border border-white/10 rounded-lg p-2 focus:outline-none focus:border-emerald-400 text-white placeholder-slate-500"
                  required
                />
              </div>
              <div>
                <label className="block text-[9px] font-mono text-slate-400 uppercase mb-1">Matricule / ID</label>
                <input 
                  type="text" 
                  value={userMatricule} 
                  onChange={(e) => setUserMatricule(e.target.value)} 
                  placeholder="e.g. FE23A990"
                  className="w-full bg-slate-900/40 border border-white/10 rounded-lg p-2 focus:outline-none focus:border-emerald-400 text-white placeholder-slate-500"
                  required
                />
              </div>
              <div>
                <label className="block text-[9px] font-mono text-slate-400 uppercase mb-1">Email address</label>
                <input 
                  type="email" 
                  value={userEmail} 
                  onChange={(e) => setUserEmail(e.target.value)} 
                  placeholder="e.g. divine@ubuea.cm"
                  className="w-full bg-slate-900/40 border border-white/10 rounded-lg p-2 focus:outline-none focus:border-emerald-400 text-white placeholder-slate-500"
                  required
                />
              </div>
              <div>
                <label className="block text-[9px] font-mono text-slate-400 uppercase mb-1">Access Role</label>
                <div className="flex gap-1.5">
                  <select 
                    value={userRole} 
                    onChange={(e) => setUserRole(e.target.value as UserRole)}
                    className="flex-1 bg-slate-900 border border-white/10 rounded-lg p-2 focus:outline-none text-slate-200"
                  >
                    <option value={UserRole.STUDENT}>Student</option>
                    <option value={UserRole.INSTRUCTOR}>Instructor</option>
                    <option value={UserRole.ADMIN}>Admin</option>
                  </select>
                  <button type="submit" className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-3.5 py-2 rounded-lg transition-all shadow-md">
                    Save
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* Search/Filter row */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
              <input 
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name, matricule, or email..."
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500 text-white placeholder-slate-500"
              />
            </div>

            <div className="flex gap-2">
              <select 
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none"
              >
                <option value="all">All Roles</option>
                <option value={UserRole.STUDENT}>Students</option>
                <option value={UserRole.INSTRUCTOR}>Instructors</option>
                <option value={UserRole.ADMIN}>Administrators</option>
              </select>
            </div>
          </div>

          {/* User records list Table */}
          <div className="overflow-x-auto rounded-2xl border border-white/10 bg-slate-950/20">
            <table className="w-full text-left text-xs text-slate-300 font-sans border-collapse">
              <thead>
                <tr className="bg-white/5 border-b border-white/10 font-mono text-[9px] uppercase tracking-wider text-slate-400">
                  <th className="p-3.5 pl-4">Member Name & ID</th>
                  <th className="p-3.5">Matricule</th>
                  <th className="p-3.5">System Access Role</th>
                  <th className="p-3.5">Last Active Log</th>
                  <th className="p-3.5">Attendance</th>
                  <th className="p-3.5">Progress</th>
                  <th className="p-3.5 text-right pr-4">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-white/5 transition-colors">
                    <td className="p-3.5 pl-4">
                      <div>
                        <div className="font-bold text-white text-[11px]">{user.name}</div>
                        <div className="text-[10px] text-slate-400 font-mono mt-0.5">{user.email}</div>
                      </div>
                    </td>
                    <td className="p-3.5 font-mono text-[10px] text-slate-300">
                      {user.matricule}
                    </td>
                    <td className="p-3.5">
                      <span className={`text-[9px] font-bold font-mono px-2 py-0.5 rounded-full border ${
                        user.role === UserRole.STUDENT ? "bg-emerald-500/15 border-emerald-500/20 text-emerald-300" :
                        user.role === UserRole.INSTRUCTOR ? "bg-indigo-500/15 border-indigo-500/20 text-indigo-300" : "bg-rose-500/15 border-rose-500/20 text-rose-300"
                      }`}>
                        {user.role.toUpperCase()}
                      </span>
                    </td>
                    <td className="p-3.5 font-mono text-[10px] text-slate-400">
                      {user.lastActive}
                    </td>
                    <td className="p-3.5 font-bold font-mono text-slate-200">
                      {user.attendanceRate}%
                    </td>
                    <td className="p-3.5">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold font-mono text-slate-200">{user.progressRate}%</span>
                        <div className="w-12 bg-white/10 h-1 rounded-full overflow-hidden shrink-0">
                          <div className="bg-emerald-500 h-full" style={{ width: `${user.progressRate}%` }} />
                        </div>
                      </div>
                    </td>
                    <td className="p-3.5 text-right pr-4">
                      {user.id !== "admin1" ? (
                        <button 
                          onClick={() => handleDeleteUser(user.id)}
                          className="p-1.5 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                          title="Purge profile"
                        >
                          <Trash2 size={13} />
                        </button>
                      ) : (
                        <span className="text-[9px] text-slate-400 italic">Protected</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Sync logs & System events (4 cols) */}
        <div className="lg:col-span-4 bg-white/5 backdrop-blur-md p-6 rounded-3xl border border-white/10 shadow-lg space-y-4 text-white">
          <div className="flex justify-between items-center border-b border-white/5 pb-3">
            <div>
              <h2 className="text-sm font-bold text-white font-mono uppercase tracking-wider">System Audit Logs</h2>
              <p className="text-[10px] text-slate-400 font-mono">Live telemetry thread</p>
            </div>
            
            <button 
              onClick={async () => {
                try {
                  const token = localStorage.getItem("learnbridge_token");
                  const res = await fetch("/api/logs/clear", {
                    method: "POST",
                    headers: { "Authorization": `Bearer ${token}` }
                  });
                  if (res.ok) {
                    setSyncLogs([]);
                  }
                } catch (err) {
                  console.error("Failed to clear system audit logs:", err);
                  setSyncLogs([]);
                }
              }}
              className="text-[9px] font-mono text-slate-400 hover:text-red-400 transition-colors"
            >
              Clear
            </button>
          </div>

          <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
            {syncLogs.length === 0 ? (
              <div className="text-center py-10 text-slate-400 font-mono text-[10px]">
                No recent system logging rows.
              </div>
            ) : (
              syncLogs.map((log) => (
                <div key={log.id} className="p-3 bg-white/5 rounded-2xl border border-white/5 space-y-1.5 text-[11px] leading-relaxed">
                  <div className="flex justify-between items-center">
                    <span className={`text-[8px] font-mono font-bold px-1.5 py-0.5 rounded border uppercase ${
                      log.status === "warning" ? "bg-amber-500/20 border-amber-500/20 text-amber-300" : "bg-emerald-500/20 border-emerald-500/20 text-emerald-300"
                    }`}>
                      {log.type}
                    </span>
                    <span className="text-[8px] text-slate-400 font-mono">{log.time}</span>
                  </div>
                  <p className="text-slate-300 font-mono font-medium text-[10px] break-all">{log.details}</p>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
