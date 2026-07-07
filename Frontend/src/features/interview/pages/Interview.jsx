import React, { useState, useEffect, useRef } from 'react'
import { useInterview } from '../hooks/useInterview.js'
import { useNavigate, useParams } from 'react-router'
// Add this with your other imports
import { updatePlanStatus } from '../services/interview.api.js'
// Modern premium icons imported here
import {
    Loader2,
    Terminal,
    MessageSquare,
    Map,
    ChevronDown,
    Target,
    AlertCircle,
    ArrowLeft,
    Download,
    X,
    CheckCircle,
    WifiOff,
    Mic
} from 'lucide-react'

const NAV_ITEMS = [
    { id: 'technical', label: 'Technical Questions', icon: <Terminal className="w-4 h-4" /> },
    { id: 'behavioral', label: 'Behavioral Questions', icon: <MessageSquare className="w-4 h-4" /> },
    { id: 'roadmap', label: 'Road Map', icon: <Map className="w-4 h-4" /> },
]

// ── Toast Component ────────────────────────────────────────────────────────────
const Toast = ({ toast, onClose }) => {
    useEffect(() => {
        if (!toast) return
        const t = setTimeout(onClose, 5000)
        return () => clearTimeout(t)
    }, [toast])

    if (!toast) return null

    const isError = toast.type === 'error'
    const isRateLimit = toast.type === 'rate_limit'

    const config = isRateLimit
        ? { bg: 'bg-amber-500/10 border-amber-500/30', icon: <WifiOff className="w-4 h-4 text-amber-400 shrink-0" />, text: 'text-amber-300' }
        : isError
            ? { bg: 'bg-rose-500/10 border-rose-500/30', icon: <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />, text: 'text-rose-300' }
            : { bg: 'bg-emerald-500/10 border-emerald-500/30', icon: <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />, text: 'text-emerald-300' }

    return (
        <div
            className={`fixed bottom-6 right-6 z-50 flex items-start gap-3 px-4 py-3 rounded-xl border backdrop-blur-xl shadow-2xl max-w-sm w-full transition-all duration-300 animate-toast-in ${config.bg}`}
            style={{ animation: 'slideInRight 0.35s cubic-bezier(0.34,1.56,0.64,1) forwards' }}
        >
            {config.icon}
            <p className={`text-sm font-medium leading-snug flex-1 ${config.text}`}>{toast.message}</p>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-300 transition-colors shrink-0 mt-0.5">
                <X className="w-3.5 h-3.5" />
            </button>
            {/* Progress bar */}
            <div className="absolute bottom-0 left-0 h-0.5 rounded-b-xl bg-white/10 w-full overflow-hidden">
                <div
                    className="h-full bg-white/30"
                    style={{ animation: 'shrinkBar 5s linear forwards' }}
                />
            </div>
            <style>{`
                @keyframes slideInRight {
                    from { opacity: 0; transform: translateX(60px) scale(0.95); }
                    to   { opacity: 1; transform: translateX(0)   scale(1); }
                }
                @keyframes shrinkBar {
                    from { width: 100%; }
                    to   { width: 0%; }
                }
            `}</style>
        </div>
    )
}

// ── Sub-components ────────────────────────────────────────────────────────────
const QuestionCard = ({ item, index }) => {
    const [open, setOpen] = useState(false)
    return (
        <div className="bg-white/[0.02] border border-white/[0.06] hover:border-white/[0.1] rounded-xl overflow-hidden transition-all duration-200">
            <div
                className="p-4 flex items-start justify-between gap-4 cursor-pointer select-none bg-white/[0.01] hover:bg-white/[0.03]"
                onClick={() => setOpen(o => !o)}
            >
                <div className="flex items-start gap-3">
                    <span className="text-xs font-mono font-bold px-2 py-0.5 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded mt-0.5">
                        Q{index + 1}
                    </span>
                    <p className="text-sm font-semibold text-white leading-relaxed">{item.question}</p>
                </div>
                <span className={`text-gray-400 shrink-0 transition-transform duration-200 mt-1 ${open ? 'rotate-180 text-indigo-400' : ''}`}>
                    <ChevronDown className="w-4 h-4" />
                </span>
            </div>

            {open && (
                <div className="p-4 bg-black/20 border-t border-white/[0.04] space-y-3.5 text-xs md:text-sm">
                    <div className="space-y-1">
                        <span className="inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded">
                            Intention
                        </span>
                        <p className="text-gray-400 leading-relaxed pl-1">{item.intention}</p>
                    </div>
                    <div className="space-y-1">
                        <span className="inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded">
                            Model Answer
                        </span>
                        <p className="text-gray-300 leading-relaxed bg-black/30 p-3 rounded-lg border border-white/[0.02]">
                            {item.answer}
                        </p>
                    </div>
                </div>
            )}
        </div>
    )
}

const RoadMapDay = ({ day, interviewId, setToast }) => {
    // 1. Local state for Optimistic Update
    const [isCompleted, setIsCompleted] = useState(day.isCompleted || false);

    // 2. Toggle Handler
    const handleToggle = async () => {
        const originalState = isCompleted;
        const newState = !isCompleted;

        // Optimistic UI Update (Instant change for the user)
        setIsCompleted(newState);

        try {
            // Background API Call
            await updatePlanStatus(interviewId, day.day, newState);
        } catch (error) {
            // Rollback if backend fails
            setIsCompleted(originalState);
            setToast({
                type: 'error',
                message: `Failed to update Day ${day.day} status. Please try again.`
            });
        }
    };

    return (
        <div className={`bg-white/[0.02] border transition-all duration-300 rounded-xl p-4 space-y-3 ${isCompleted ? 'border-emerald-500/30 bg-emerald-500/5' : 'border-white/[0.06]'
            }`}>
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-md border ${isCompleted
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                            : 'bg-purple-500/10 text-purple-400 border-purple-500/20'
                        }`}>
                        Day {day.day}
                    </span>
                    <h3 className={`text-sm md:text-base font-bold tracking-wide ${isCompleted ? 'text-gray-500 line-through' : 'text-white'
                        }`}>
                        {day.focus}
                    </h3>
                </div>

                {/* Interactive Custom Checkbox */}
                <label className="flex items-center cursor-pointer relative">
                    <input
                        type="checkbox"
                        checked={isCompleted}
                        onChange={handleToggle}
                        className="peer sr-only"
                    />
                    <div className={`w-5 h-5 rounded flex items-center justify-center transition-all duration-200 border-2 ${isCompleted
                            ? 'bg-emerald-500 border-emerald-500'
                            : 'border-gray-500 hover:border-indigo-400 bg-transparent'
                        }`}>
                        {isCompleted && <CheckCircle className="w-3.5 h-3.5 text-white" />}
                    </div>
                </label>
            </div>

            <ul className="space-y-2 pl-1">
                {day.tasks.map((task, i) => (
                    <li key={i} className={`text-xs md:text-sm flex items-start gap-2.5 ${isCompleted ? 'text-gray-600' : 'text-gray-400'
                        }`}>
                        <span className={`w-1.5 h-1.5 rounded-full shrink-0 mt-2 ${isCompleted ? 'bg-emerald-500/40' : 'bg-purple-400/70'
                            }`} />
                        <span className="leading-relaxed">{task}</span>
                    </li>
                ))}
            </ul>
        </div>
    )
}

// ── Main Component ────────────────────────────────────────────────────────────
const Interview = () => {
    const [activeNav, setActiveNav] = useState('technical')
    const [toast, setToast] = useState(null)
    const { report, getReportById, loading, getResumePdf } = useInterview()
    const { interviewId } = useParams()
    const navigate = useNavigate()

    useEffect(() => {
        if (interviewId) {
            getReportById(interviewId)
        }
    }, [interviewId])

    // --- New Function ---
    const handleStartInterview = () => {
        if (!report) return;
        
        // 1. Technical aur Behavioral questions ko combine karo
        const allQuestions = [
            ...report.technicalQuestions.map(q => ({ question: q.question })),
            ...report.behavioralQuestions.map(q => ({ question: q.question }))
        ];

        // 2. Mix karke top 5 questions nikal lo taaki interview lamba na ho
        const interviewQuestions = allQuestions.slice(0, 5); 

        // 3. Mock Simulator route par data bhejte hue redirect karo
        navigate('/mock-interview', { state: { questions: interviewQuestions } });
    };
    // ------------------------------------

    if (loading || !report) {
        return (
            <main className="min-h-screen w-full flex flex-col items-center justify-center bg-[#0B0F19] text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#37415120_1px,transparent_1px),linear-gradient(to_bottom,#37415120_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_45%,#000_85%,transparent_100%)] pointer-events-none" />
                <div className="absolute top-6 left-1/2 -translate-x-1/2 w-[500px] h-[250px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />
                <div className="relative w-24 h-24 mb-8">
                    <div className="absolute inset-0 border-t-4 border-indigo-500 rounded-full animate-spin"></div>
                    <div className="absolute inset-2 border-r-4 border-emerald-500 rounded-full animate-spin-slow"></div>
                    <div className="absolute inset-4 border-b-4 border-purple-500 rounded-full animate-spin"></div>
                </div>
                <h1 className="text-2xl font-bold text-white mb-2 tracking-wide">Loading your interview plan...</h1>
                <p className="text-indigo-300/70 font-medium">Preparing your personalized strategy</p>
            </main>
        )
    }

    return (
        <div className="min-h-screen w-full bg-[#0B0F19] text-gray-100 relative overflow-x-hidden flex flex-col justify-between">

            {/* Background Grid Structure */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#37415115_1px,transparent_1px),linear-gradient(to_bottom,#37415115_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_45%,#000_85%,transparent_100%)] pointer-events-none" />

            {/* Ambient Background Glows */}
            <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-indigo-600/10 rounded-full blur-[110px] pointer-events-none" />
            <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-600/10 rounded-full blur-[110px] pointer-events-none" />

            {/* Layout Wrapper */}
            <div className="relative z-10 w-full max-w-6xl mx-auto px-4 md:px-6 py-6 flex-1 flex flex-col justify-center">

                {/* Top Mini Actions */}
                <div className="mb-4">
                    <button
                        onClick={() => navigate('/')}
                        className="flex items-center gap-1.5 text-xs font-semibold text-gray-400 hover:text-white transition-colors group"
                    >
                        <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
                        Back to Home
                    </button>
                </div>

                {/* Dashboard Flex/Grid Container */}
                <div className="w-full bg-white/[0.02] backdrop-blur-xl border border-white/[0.08] rounded-2xl shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-white/[0.06]">

                    {/* ── Left Nav Navigation Panel ── */}
                    <nav className="p-4 md:p-6 flex flex-col justify-between gap-6 bg-black/10">
                        <div className="space-y-4">
                            <p className="text-[10px] font-bold text-gray-500 tracking-wider uppercase pl-2">Sections</p>
                            <div className="space-y-1.5">
                                {NAV_ITEMS.map(item => (
                                    <button
                                        key={item.id}
                                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs md:text-sm font-semibold transition-all duration-200 ${activeNav === item.id
                                            ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                                            : 'text-gray-400 hover:text-gray-200 hover:bg-white/[0.03]'
                                            }`}
                                        onClick={() => setActiveNav(item.id)}
                                    >
                                        <span className={activeNav === item.id ? 'text-white' : 'text-gray-400'}>{item.icon}</span>
                                        {item.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Download Resume Button */}
                        <button
                            onClick={async () => {
                                const result = await getResumePdf(interviewId)
                                if (result?.success === false) {
                                    const isRateLimit = result.message?.toLowerCase().includes('traffic') ||
                                        result.message?.toLowerCase().includes('busy') ||
                                        result.message?.toLowerCase().includes('limit')
                                    setToast({
                                        type: isRateLimit ? 'rate_limit' : 'error',
                                        message: result.message
                                    })
                                } else if (result?.success) {
                                    setToast({ type: 'success', message: 'Resume downloaded successfully!' })
                                }
                            }}
                            disabled={loading}
                            className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs md:text-sm font-semibold transition-all duration-200 bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white border border-indigo-500/30 hover:border-indigo-500 hover:shadow-lg hover:shadow-indigo-600/20 disabled:opacity-50 disabled:cursor-not-allowed group"
                        >
                            {loading ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <Download className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
                            )}
                            Download Resume
                        </button>
                       {/* --- NAYA MOCK INTERVIEW BUTTON YAHAN ADD KARO --- */}
                        <button
                            onClick={handleStartInterview}
                            className="w-full mt-2 flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs md:text-sm font-bold transition-all duration-200 bg-emerald-600/20 hover:bg-emerald-600 text-emerald-400 hover:text-white border border-emerald-500/30 hover:border-emerald-500 hover:shadow-lg hover:shadow-emerald-600/20 group"
                        >
                            <Mic className="w-4 h-4 group-hover:scale-110 transition-transform" />
                            Start AI Interview
                        </button>


                    </nav>

                    {/* ── Center Dynamic Content Panel ── */}
                    <main className="p-5 md:p-8 md:col-span-2 min-h-[24rem] max-h-[32rem] overflow-y-auto custom-scrollbar">
                        {activeNav === 'technical' && (
                            <div className="space-y-4">
                                <div className="flex items-center justify-between pb-2 border-b border-white/[0.04]">
                                    <h2 className="text-base md:text-lg font-extrabold text-white">Technical Questions</h2>
                                    <span className="text-xs font-medium px-2 py-0.5 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded">
                                        {report.technicalQuestions.length} Items
                                    </span>
                                </div>
                                <div className="space-y-3">
                                    {report.technicalQuestions.map((q, i) => (
                                        <QuestionCard key={i} item={q} index={i} />
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeNav === 'behavioral' && (
                            <div className="space-y-4">
                                <div className="flex items-center justify-between pb-2 border-b border-white/[0.04]">
                                    <h2 className="text-base md:text-lg font-extrabold text-white">Behavioral Questions</h2>
                                    <span className="text-xs font-medium px-2 py-0.5 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded">
                                        {report.behavioralQuestions.length} Items
                                    </span>
                                </div>
                                <div className="space-y-3">
                                    {report.behavioralQuestions.map((q, i) => (
                                        <QuestionCard key={i} item={q} index={i} />
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeNav === 'roadmap' && (
                            <div className="space-y-4">
                                <div className="flex items-center justify-between pb-2 border-b border-white/[0.04]">
                                    <h2 className="text-base md:text-lg font-extrabold text-white">Preparation Road Map</h2>
                                    <span className="text-xs font-medium px-2 py-0.5 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded">
                                        {report.preparationPlan.length} Days Plan
                                    </span>
                                </div>
                                <div className="space-y-3">
                                    {report.preparationPlan.map((day) => (
                                        <RoadMapDay
                                            key={day.day}
                                            day={day}
                                            interviewId={interviewId}
                                            setToast={setToast}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                    </main>

                    {/* ── Right Sidebar Metrics Panel ── */}
                    <aside className="p-5 md:p-6 flex flex-col gap-6 justify-center bg-black/5">

                        {/* Match Score Display */}
                        <div className="text-center p-4 bg-black/20 border border-white/[0.04] rounded-2xl relative overflow-hidden group">
                            <div className="absolute -top-10 -right-10 w-24 h-24 bg-indigo-600/5 rounded-full blur-xl pointer-events-none" />
                            <p className="text-[10px] font-bold text-gray-500 tracking-wider uppercase mb-3 flex items-center justify-center gap-1.5">
                                <Target className="w-3.5 h-3.5 text-gray-400" />
                                Match Score
                            </p>

                            <div className="inline-flex items-baseline justify-center gap-0.5 mb-2">
                                <span className={`text-4xl font-black font-mono tracking-tighter ${report.matchScore >= 80 ? 'text-emerald-400' : report.matchScore >= 60 ? 'text-amber-400' : 'text-rose-400'
                                    }`}>
                                    {report.matchScore}
                                </span>
                                <span className="text-sm font-bold text-gray-500">%</span>
                            </div>
                            <p className="text-xs text-gray-400 font-medium">Strong matching matrix</p>
                        </div>

                        {/* Skill Gaps Module */}
                        <div className="space-y-3">
                            <p className="text-[10px] font-bold text-gray-500 tracking-wider uppercase pl-1 flex items-center gap-1.5">
                                <AlertCircle className="w-3.5 h-3.5 text-gray-400" />
                                Skill Gaps
                            </p>
                            <div className="flex flex-wrap gap-1.5 bg-black/20 p-3 border border-white/[0.04] rounded-2xl min-h-[6rem] content-start">
                                {report.skillGaps.map((gap, i) => (
                                    <span
                                        key={i}
                                        className={`text-[11px] font-medium px-2.5 py-1 rounded-md border ${gap.severity === 'high'
                                            ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                                            : gap.severity === 'mid'
                                                ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                                                : 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
                                            }`}
                                    >
                                        {gap.skill}
                                    </span>
                                ))}
                            </div>
                        </div>

                    </aside>
                </div>

                {/* Lower Layout Footer */}
                <footer className="border-t border-white/[0.06] mt-6 pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500">
                    <div className="flex gap-4">
                        <a href="#" className="hover:text-gray-300 transition-colors">Privacy Policy</a>
                        <a href="#" className="hover:text-gray-300 transition-colors">Terms of Service</a>
                    </div>
                    <p>&copy; {new Date().getFullYear()} AI Interview Prep Blueprint.</p>
                </footer>

            </div>
            {/* Toast Notification */}
            <Toast toast={toast} onClose={() => setToast(null)} />

        </div>
    )
}

export default Interview