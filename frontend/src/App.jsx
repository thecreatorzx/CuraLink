import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, Plus, Send, Paperclip, Brain,
  Activity, Stethoscope, User,
  Clock, Sparkles, Loader2, Menu,
} from "lucide-react";
import axios from "axios";

import { MOCK_RESPONSE, RECENT_SESSIONS } from "./data/mockData";
import SkeletonLoader from "./components/SkeletonLoader";
import AIResponseCard from "./components/AIResponseCard";

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  // System Health State
  const [systemStatus, setSystemStatus] = useState({ backend: "checking", ai: "checking" });
  const [hasCheckedHealth, setHasCheckedHealth] = useState(false);
  const [conversationId, setConversationId] = useState(null);

  const [messages, setMessages] = useState([
    {
      id: 1,
      type: "user",
      content:
        "What are the latest research insights and active clinical trials for Glioblastoma Multiforme? Include MGMT methylation status and any emerging immunotherapy options.",
      timestamp: "10:41 AM",
    },
  ]);
  const [isLoading, setIsLoading] = useState(true);
  const [inputValue, setInputValue] = useState("");
  const endRef = useRef(null);
  const inputRef = useRef(null);

  /* Font injection */
  useEffect(() => {
    const link = document.createElement("link");
    link.href =
      "https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@300;400;500;600&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
    return () => document.head.removeChild(link);
  }, []);

  /* Helper to ensure Python string data matches your UI's Array expectation */
  const formatDataForUI = (data) => {
    return {
      ...data,
      research_insights: Array.isArray(data.research_insights) ? data.research_insights : [data.research_insights].filter(Boolean),
      recommendations: Array.isArray(data.recommendations) ? data.recommendations : [data.recommendations].filter(Boolean),
    };
  };

  /* Step 1: Check Backend Health on Mount */
  useEffect(() => {
    const checkHealth = async () => {
      try {
        const res = await axios.get("http://localhost:5000/health", { timeout: 3000 });
        setSystemStatus({
          backend: res.data.node === "ok" ? "online" : "offline",
          ai: res.data.ai_service === "ok" ? "online" : "offline"
        });
      } catch (err) {
        setSystemStatus({ backend: "offline", ai: "offline" });
      } finally {
        setHasCheckedHealth(true);
      }
    };
    checkHealth();
  }, []);

  /* Step 2: Handle Initial Message (Real or Mock based on Health) */
  useEffect(() => {
    if (!hasCheckedHealth) return;

    if (systemStatus.backend === "online" && systemStatus.ai === "online") {
      axios.post("http://localhost:5000/api/chat", {
        disease: "Glioblastoma Multiforme",
        query: messages[0].content,
        patientName: "Dr. Aisha Patel"
      }).then(res => {
        if (res.data.conversationId) setConversationId(res.data.conversationId);
        setMessages(prev => [...prev, { id: 2, type: "ai", data: formatDataForUI(res.data), timestamp: "10:41 AM" }]);
      }).catch(err => {
        console.error("Failed to fetch initial real data, falling back to mock", err);
        setMessages(prev => [...prev, { id: 2, type: "ai", data: formatDataForUI(MOCK_RESPONSE), timestamp: "10:41 AM" }]);
      }).finally(() => setIsLoading(false));
    } else {
      // Mock Fallback
      const t = setTimeout(() => {
        setIsLoading(false);
        setMessages((prev) => [
          ...prev,
          { id: 2, type: "ai", data: formatDataForUI(MOCK_RESPONSE), timestamp: "10:41 AM" },
        ]);
      }, 2600);
      return () => clearTimeout(t);
    }
  }, [hasCheckedHealth]);

  /* Auto-scroll */
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  /* Step 3: Handle User Send (Real or Mock based on Health) */
  const handleSend = async () => {
    const text = inputValue.trim();
    if (!text || isLoading) return;
    
    const ts = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    setMessages((prev) => [...prev, { id: Date.now(), type: "user", content: text, timestamp: ts }]);
    setInputValue("");
    setIsLoading(true);

    if (systemStatus.backend === "online" && systemStatus.ai === "online") {
      try {
        const res = await axios.post("http://localhost:5000/api/chat", {
          conversationId: conversationId,
          disease: "Glioblastoma Multiforme",
          query: text,
          patientName: "Dr. Aisha Patel"
        });
        if (res.data.conversationId) setConversationId(res.data.conversationId);
        setMessages((prev) => [...prev, { id: Date.now() + 1, type: "ai", data: formatDataForUI(res.data), timestamp: ts }]);
      } catch (error) {
        console.error("Backend Error:", error);
        setMessages((prev) => [...prev, { id: Date.now() + 1, type: "ai", data: formatDataForUI(MOCK_RESPONSE), timestamp: ts }]);
      } finally {
        setIsLoading(false);
      }
    } else {
      // Mock Fallback
      setTimeout(() => {
        setIsLoading(false);
        setMessages((prev) => [
          ...prev,
          { id: Date.now() + 1, type: "ai", data: formatDataForUI(MOCK_RESPONSE), timestamp: ts },
        ]);
      }, 2600);
    }
  };

  return (
    <div
      style={{ fontFamily: "'IBM Plex Sans', system-ui, sans-serif" }}
      className="flex h-screen bg-slate-50 text-slate-900 overflow-hidden"
    >
      {/* ═══════════════════════ SIDEBAR ═══════════════════════ */}
      <AnimatePresence initial={false}>
        {sidebarOpen && (
          <motion.aside
            key="sidebar"
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 264, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.26, ease: [0.4, 0, 0.2, 1] }}
            className="h-full bg-white border-r border-slate-100 flex flex-col overflow-hidden shrink-0 z-10"
          >
            {/* Logo + New Research */}
            <div className="px-4 pt-4 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-7 h-7 bg-blue-700 rounded-lg flex items-center justify-center shadow-sm">
                  <Activity className="w-4 h-4 text-white" />
                </div>
                <span className="text-base font-semibold tracking-tight text-slate-900">CuraLink</span>
                <span className="ml-auto text-[9px] font-bold text-blue-600 bg-blue-50 border border-blue-100 px-1.5 py-0.5 rounded uppercase tracking-widest">
                  AI
                </span>
              </div>
              <motion.button
                whileTap={{ scale: 0.97 }}
                className="w-full flex items-center justify-center gap-2 bg-blue-700 hover:bg-blue-800 active:bg-blue-900 text-white text-xs font-semibold py-2.5 rounded-lg transition-colors shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
                New Research
              </motion.button>
            </div>

            {/* Search */}
            <div className="px-4 py-2.5 border-b border-slate-50">
              <div className="flex items-center gap-2 bg-slate-50 border border-slate-100 rounded-lg px-3 py-2 focus-within:border-blue-200 transition-colors">
                <Search className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <input
                  placeholder="Search sessions…"
                  className="bg-transparent text-xs text-slate-600 placeholder-slate-400 outline-none w-full"
                />
              </div>
            </div>

            {/* Session list */}
            <div className="flex-1 overflow-y-auto py-2">
              <div className="px-4 pt-2 pb-1">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                  Recent
                </span>
              </div>
              {RECENT_SESSIONS.map((s) => (
                <motion.button
                  key={s.id}
                  whileHover={{ x: 1 }}
                  transition={{ duration: 0.12 }}
                  className={`w-full text-left px-4 py-2.5 transition-colors border-l-2 ${
                    s.active
                      ? "border-blue-600 bg-blue-50/50"
                      : "border-transparent hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p
                        className={`text-xs font-medium truncate ${
                          s.active ? "text-blue-700" : "text-slate-700"
                        }`}
                      >
                        {s.name}
                      </p>
                      <p className="text-[10px] text-slate-400 truncate mt-0.5">{s.subtitle}</p>
                    </div>
                    <span className="text-[9px] text-slate-300 shrink-0 mt-0.5 tabular-nums">
                      {s.time}
                    </span>
                  </div>
                </motion.button>
              ))}
            </div>

            {/* User footer */}
            <div className="px-4 py-3 border-t border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                  <User className="w-3.5 h-3.5 text-blue-700" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-medium text-slate-700 truncate">Dr. Aisha Patel</p>
                  <p className="text-[10px] text-slate-400">Neuro-Oncology · AIIMS Delhi</p>
                </div>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* ═══════════════════════ MAIN ═══════════════════════ */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* ── Header ── */}
        <header className="bg-white border-b border-slate-100 px-4 py-3 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <motion.button
              whileTap={{ scale: 0.94 }}
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors"
            >
              <Menu className="w-4 h-4" />
            </motion.button>

            {!sidebarOpen && (
              <motion.div
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-2"
              >
                <div className="w-6 h-6 bg-blue-700 rounded-md flex items-center justify-center">
                  <Activity className="w-3.5 h-3.5 text-white" />
                </div>
                <span className="font-semibold text-slate-900 text-sm tracking-tight">CuraLink</span>
              </motion.div>
            )}

            <div className="h-4 w-px bg-slate-200" />

            <div className="flex items-center gap-2">
              <Stethoscope className="w-4 h-4 text-blue-600 shrink-0" />
              <span className="text-sm font-medium text-slate-700 truncate max-w-50 sm:max-w-xs">
                Glioblastoma Multiforme
              </span>
              <span className="hidden sm:inline text-[10px] bg-blue-50 text-blue-700 border border-blue-100 px-2 py-0.5 rounded-full font-semibold">
                GBM · WHO Grade IV
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* LIVE HEALTH BADGES */}
            <div className="hidden sm:flex items-center gap-2 text-[11px] text-slate-500 bg-slate-50 border border-slate-100 px-2.5 py-1.5 rounded-lg">
              <div className="flex items-center gap-1.5">
                <span className={`w-1.5 h-1.5 rounded-full ${systemStatus.backend === 'online' ? 'bg-emerald-400 animate-pulse' : 'bg-red-400'}`} />
                <span>Node API</span>
              </div>
              <div className="w-px h-3 bg-slate-200" />
              <div className="flex items-center gap-1.5">
                <span className={`w-1.5 h-1.5 rounded-full ${systemStatus.ai === 'online' ? 'bg-emerald-400 animate-pulse' : systemStatus.ai === 'checking' ? 'bg-amber-400 animate-pulse' : 'bg-red-400'}`} />
                <span>{systemStatus.ai === 'checking' ? 'Connecting...' : systemStatus.ai === 'online' ? 'AI Active' : 'Demo Mode'}</span>
              </div>
            </div>
          </div>
        </header>

        {/* ── Chat feed ── */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">

            {messages.map((msg) =>
              msg.type === "user" ? (
                /* User bubble */
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex justify-end"
                >
                  <div className="max-w-lg">
                    <div className="bg-slate-800 text-white text-sm leading-relaxed px-4 py-3 rounded-2xl rounded-tr-sm shadow-sm">
                      {msg.content}
                    </div>
                    <div className="flex items-center justify-end gap-1 mt-1.5">
                      <Clock className="w-3 h-3 text-slate-300" />
                      <span className="text-[10px] text-slate-400">{msg.timestamp}</span>
                    </div>
                  </div>
                </motion.div>
              ) : (
                /* AI response */
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35 }}
                  className="flex gap-3"
                >
                  <div className="w-8 h-8 rounded-full bg-blue-700 flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                    <Brain className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xs font-semibold text-slate-800">CuraLink AI</span>
                      <span className="text-[10px] text-slate-400 tabular-nums">{msg.timestamp}</span>
                      <span className="text-[9px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-100 px-2 py-0.5 rounded-full uppercase tracking-wide">
                        {systemStatus.ai === "online" ? "✓ Live Research Complete" : "⚠ Demo Data Loaded"}
                      </span>
                    </div>
                    <AIResponseCard data={msg.data} />
                  </div>
                </motion.div>
              )
            )}

            {/* ── Skeleton / loading state ── */}
            <AnimatePresence>
              {isLoading && (
                <motion.div
                  key="skeleton"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex gap-3"
                >
                  {/* Spinner avatar */}
                  <div className="w-8 h-8 rounded-full bg-blue-100 border border-blue-200 flex items-center justify-center shrink-0 mt-0.5">
                    <motion.span
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1.4, repeat: Infinity, ease: "linear" }}
                    >
                      <Loader2 className="w-4 h-4 text-blue-600" />
                    </motion.span>
                  </div>

                  <div className="flex-1 bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                    {/* Status bar */}
                    <div className="px-5 py-3 border-b border-slate-50 bg-blue-50/40">
                      <motion.div
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 1.9, repeat: Infinity }}
                        className="flex items-center gap-2"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-blue-500" />
                        <span className="text-xs text-blue-700 font-medium">
                          {systemStatus.ai === "online" 
                            ? "Researching across PubMed, ClinicalTrials.gov & WHO ICD databases…" 
                            : "Loading Demo Research Data…"}
                        </span>
                      </motion.div>

                      {/* Progress pills */}
                      <div className="flex items-center gap-2 mt-2">
                        {["PubMed", "ClinicalTrials", "WHO ICD"].map((src, i) => (
                          <motion.span
                            key={src}
                            initial={{ opacity: 0, scale: 0.85 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.35 }}
                            className="text-[10px] font-semibold text-blue-600 bg-white border border-blue-200 px-2 py-0.5 rounded-full"
                          >
                            {src}
                          </motion.span>
                        ))}
                      </div>
                    </div>
                    <SkeletonLoader />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div ref={endRef} />
          </div>
        </div>

        {/* ── Sticky input ── */}
        <div className="bg-white/90 backdrop-blur border-t border-slate-100 px-4 py-4 shrink-0">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center gap-3 bg-white border border-slate-200 rounded-2xl px-4 py-3 shadow-sm focus-within:border-blue-300 focus-within:shadow-blue-100 focus-within:shadow-md transition-all duration-200">
              <button className="text-slate-300 hover:text-slate-500 transition-colors shrink-0">
                <Paperclip className="w-4 h-4" />
              </button>

              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                placeholder="Ask about a condition, drug interaction, clinical protocol…"
                className="flex-1 bg-transparent text-sm text-slate-800 placeholder-slate-400 outline-none"
              />

              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleSend}
                disabled={!inputValue.trim() || isLoading}
                className="shrink-0 flex items-center gap-1.5 bg-blue-700 hover:bg-blue-800 active:bg-blue-900 disabled:bg-slate-100 disabled:text-slate-400 text-white text-xs font-semibold px-4 py-2 rounded-xl transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Send</span>
              </motion.button>
            </div>

            <p className="text-center text-[10px] text-slate-400 mt-2 tracking-wide">
              CuraLink AI is for research assistance only — not a substitute for clinical judgment.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}