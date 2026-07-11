import React, { useState, useEffect, useRef } from 'react'
import { useInterview } from '../hooks/useInterview.js'
import { useNavigate, useParams } from 'react-router'
import RingLoader from '../../../components/RingLoader'
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
            <button onClick={onClose} className="text-[#6B7280] hover:text-[#1F2937] transition-colors shrink-0 mt-0.5">
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
          to  { opacity: 1; transform: translateX(0)  scale(1); }
        }
        @keyframes shrinkBar {
          from { width: 100%; }
          to  { width: 0%; }
        }
      `}</style>
        </div>
    )
}

// ── Sub-components ────────────────────────────────────────────────────────────
const QuestionCard = ({ item, index }) => {
    const [open, setOpen] = useState(false)
    return (
        <div className="bg-[#FFFFFF] border border-[#E2E8F0] hover:border-indigo-300 rounded-xl overflow-hidden transition-all duration-200 shadow-sm hover:shadow-md">
            <div
                className="p-4 flex items-start justify-between gap-4 cursor-pointer select-none bg-[#FFFFFF] hover:bg-slate-50 transition-colors"
                onClick={() => setOpen(o => !o)}
            >
                <div className="flex items-start gap-3">
                    <span className="text-xs font-black px-2 py-0.5 bg-[#2563EB] text-white rounded mt-0.5 shadow-sm">
                        Q{index + 1}
                    </span>
                    <p className="text-sm font-semibold text-[#1F2937] leading-relaxed">{item.question}</p>
                </div>
                <span className={`text-[#6B7280] shrink-0 transition-transform duration-200 mt-1 ${open ? 'rotate-180 text-[#2563EB]' : ''}`}>
                    <ChevronDown className="w-5 h-5" />
                </span>
            </div>

            {open && (
                <div className="p-5 bg-slate-50/80 border-t border-[#E2E8F0] space-y-4 text-xs md:text-sm">
                    <div className="space-y-2">
                        <span className="inline-block text-[10px] font-black uppercase tracking-widest px-2.5 py-1 bg-amber-50 text-amber-600 border border-amber-200 rounded-md">
                            Intention
                        </span>
                        <p className="text-[#4B5563] leading-relaxed px-1">{item.intention}</p>
                    </div>
                    <div className="space-y-2">
                        <span className="inline-block text-[10px] font-black uppercase tracking-widest px-2.5 py-1 bg-emerald-50 text-emerald-600 border border-emerald-200 rounded-md">
                            Model Answer
                        </span>
                        <p className="text-[#1F2937] leading-relaxed bg-[#FFFFFF] p-4 rounded-xl border border-[#E2E8F0] shadow-sm">
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
        <div className={`bg-[#FFFFFF] border transition-all duration-300 rounded-xl p-5 space-y-4 shadow-sm hover:shadow-md ${isCompleted ? 'border-emerald-200 bg-emerald-50/30' : 'border-[#E2E8F0]'
            }`}>
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <span className={`text-xs font-black px-3 py-1 rounded-md border tracking-widest uppercase ${isCompleted
                        ? 'bg-emerald-100 text-emerald-600 border-emerald-200'
                        : 'bg-indigo-50 text-indigo-600 border-indigo-200'
                        }`}>
                        Day {day.day}
                    </span>
                    <h3 className={`text-sm md:text-base font-extrabold tracking-wide ${isCompleted ? 'text-[#6B7280] line-through' : 'text-[#1F2937]'
                        }`}>
                        {day.focus}
                    </h3>
                </div>

                {/* Interactive Custom Checkbox */}
                <label className="flex items-center cursor-pointer relative group">
                    <input
                        type="checkbox"
                        checked={isCompleted}
                        onChange={handleToggle}
                        className="peer sr-only"
                    />
                    <div className={`w-6 h-6 rounded flex items-center justify-center transition-all duration-200 border-2 shadow-sm group-hover:scale-105 ${isCompleted
                        ? 'bg-emerald-500 border-emerald-500'
                        : 'border-slate-300 hover:border-[#2563EB] bg-white'
                        }`}>
                        {isCompleted && <CheckCircle className="w-4 h-4 text-white" />}
                    </div>
                </label>
            </div>

            <ul className="space-y-2.5 pl-1">
                {day.tasks.map((task, i) => (
                    <li key={i} className={`text-xs md:text-sm flex items-start gap-3 ${isCompleted ? 'text-[#6B7280]' : 'text-[#4B5563] font-medium'
                        }`}>
                        <span className={`w-1.5 h-1.5 rounded-full shrink-0 mt-2 ${isCompleted ? 'bg-emerald-400' : 'bg-[#2563EB]'
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

        // 2. Mix karke top 10 questions nikal lo taaki interview standard size ka ho
        const interviewQuestions = allQuestions.slice(0, 10);

        // 3. Mock Simulator route par data bhejte hue redirect karo
        navigate('/mock-interview', { state: { questions: interviewQuestions } });
    };
    // ------------------------------------

    if (!report) {
        return <RingLoader title="Loading your interview plan..." subtitle="Preparing your personalized strategy" />
    }

    return (
        <div className="min-h-screen w-full bg-[#e0f2fe] text-[#1F2937] relative overflow-x-hidden flex flex-col justify-between">


            {/* Gamified Background Grid */}
            <div className="fixed inset-0 bg-[linear-gradient(to_right,#6366f115_1px,transparent_1px),linear-gradient(to_bottom,#6366f115_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none z-0" />
            <div className="fixed inset-0 bg-gradient-to-b from-transparent via-[#e0f2fe]/20 to-[#e0f2fe]/90 pointer-events-none z-0" />

            {/* Ambient Background Glows */}
            <div className="fixed top-6 left-1/2 -translate-x-1/2 w-[500px] h-[250px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none z-0" />
            <div className="fixed top-1/3 right-10 w-80 h-80 bg-purple-600/10 rounded-full blur-[110px] pointer-events-none z-0" />

            {/* Layout Wrapper */}
            <div className="relative z-10 w-full max-w-6xl mx-auto px-4 md:px-6 py-6 flex-1 flex flex-col justify-center">

                {/* Top Mini Actions */}
                <div className="mb-4">
                    <button
                        onClick={() => navigate('/')}
                        className="flex items-center gap-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-4 py-2 rounded-xl transition-all shadow-md text-sm font-bold shadow-blue-500/20 w-fit"
                    >
                        <ArrowLeft className="w-4 h-4" /> Back to Dashboard
                    </button>
                </div>

                {/* Dashboard Flex/Grid Container */}
                <div className="w-full bg-[#FFFFFF] border border-[#E2E8F0] rounded-3xl shadow-xl shadow-black/5 overflow-hidden grid grid-cols-1 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-[#E2E8F0]">

                    {/* ── Left Nav Navigation Panel ── */}
                    <nav className="p-4 md:p-6 flex flex-col justify-between gap-6 bg-slate-50/50">
                        <div className="space-y-4">
                            <p className="text-[10px] font-bold text-[#6B7280] tracking-wider uppercase pl-2">Sections</p>
                            <div className="space-y-1.5">
                                {NAV_ITEMS.map(item => (
                                    <button
                                        key={item.id}
                                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs md:text-sm font-semibold transition-all duration-200 ${activeNav === item.id
                                            ? 'bg-[#2563EB] text-white shadow-lg shadow-blue-500/20'
                                            : 'text-[#6B7280] hover:text-[#1F2937] hover:bg-white shadow-sm hover:shadow-md'
                                            }`}
                                        onClick={() => setActiveNav(item.id)}
                                    >
                                        <span className={activeNav === item.id ? 'text-white' : 'text-[#6B7280]'}>{item.icon}</span>
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
                            className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs md:text-sm font-semibold transition-all duration-200 bg-[#FFFFFF] hover:bg-slate-50 text-[#1F2937] border border-[#E2E8F0] shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed group mt-2"
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
                            className="w-full mt-2 flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs md:text-sm font-bold transition-all duration-200 bg-[#2563EB] hover:bg-[#1D4ED8] text-white border border-transparent hover:shadow-lg hover:shadow-blue-500/30 group"
                        >
                            <Mic className="w-4 h-4 group-hover:scale-110 transition-transform" />
                            Start AI Interview
                        </button>


                    </nav>

                    {/* ── Center Dynamic Content Panel ── */}
                    <main className="p-5 md:p-8 md:col-span-2 min-h-[24rem] max-h-[32rem] overflow-y-auto custom-scrollbar">
                        {activeNav === 'technical' && (
                            <div className="space-y-4">
                                <div className="flex items-center justify-between pb-4 border-b border-[#E2E8F0] mb-4">
                                    <h2 className="text-base md:text-xl font-extrabold text-[#1F2937] leading-snug">
                                        Technical <span className="inline-block ml-1 px-3 py-0.5 bg-[#2563EB] text-white rounded-lg shadow-md shadow-blue-500/30 transform -rotate-2 hover:rotate-0 hover:scale-105 transition-all duration-300 cursor-default">Questions</span>
                                    </h2>
                                    <span className="text-xs font-black px-2.5 py-1 bg-indigo-50 text-[#2563EB] border border-indigo-100 rounded uppercase tracking-wider">
                                        {report.technicalQuestions.length} Items
                                    </span>
                                </div>
                                <div className="space-y-4">
                                    {report.technicalQuestions.map((q, i) => (
                                        <QuestionCard key={i} item={q} index={i} />
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeNav === 'behavioral' && (
                            <div className="space-y-4">
                                <div className="flex items-center justify-between pb-4 border-b border-[#E2E8F0] mb-4">
                                    <h2 className="text-base md:text-xl font-extrabold text-[#1F2937] leading-snug">
                                        Behavioral <span className="inline-block ml-1 px-3 py-0.5 bg-[#2563EB] text-white rounded-lg shadow-md shadow-blue-500/30 transform -rotate-2 hover:rotate-0 hover:scale-105 transition-all duration-300 cursor-default">Questions</span>
                                    </h2>
                                    <span className="text-xs font-black px-2.5 py-1 bg-indigo-50 text-[#2563EB] border border-indigo-100 rounded uppercase tracking-wider">
                                        {report.behavioralQuestions.length} Items
                                    </span>
                                </div>
                                <div className="space-y-4">
                                    {report.behavioralQuestions.map((q, i) => (
                                        <QuestionCard key={i} item={q} index={i} />
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeNav === 'roadmap' && (
                            <div className="space-y-4">
                                <div className="flex items-center justify-between pb-4 border-b border-[#E2E8F0] mb-4">
                                    <h2 className="text-base md:text-xl font-extrabold text-[#1F2937] leading-snug">
                                        Preparation <span className="inline-block ml-1 px-3 py-0.5 bg-[#2563EB] text-white rounded-lg shadow-md shadow-blue-500/30 transform -rotate-2 hover:rotate-0 hover:scale-105 transition-all duration-300 cursor-default">Road Map</span>
                                    </h2>
                                    <span className="text-xs font-black px-2.5 py-1 bg-indigo-50 text-[#2563EB] border border-indigo-100 rounded uppercase tracking-wider">
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
                    <aside className="p-5 md:p-6 flex flex-col gap-6 justify-center bg-slate-50/50">

                        {/* Match Score Display */}
                        <div className="text-center p-6 bg-[#FFFFFF] border border-[#E2E8F0] rounded-3xl relative overflow-hidden group shadow-sm hover:shadow-md transition-shadow">
                            <div className="absolute -top-10 -right-10 w-24 h-24 bg-blue-500/10 rounded-full blur-xl pointer-events-none group-hover:scale-150 transition-transform duration-700" />
                            <p className="text-[10px] font-black text-[#2563EB] tracking-widest uppercase mb-4 flex items-center justify-center gap-1.5">
                                <Target className="w-4 h-4 text-[#2563EB]" />
                                Match Score
                            </p>

                            <div className="inline-flex items-baseline justify-center gap-0.5 mb-2">
                                <span className={`text-6xl font-black font-mono tracking-tighter drop-shadow-sm ${report.matchScore >= 80 ? 'text-emerald-500' : report.matchScore >= 60 ? 'text-amber-500' : 'text-rose-500'
                                    }`}>
                                    {report.matchScore}
                                </span>
                                <span className="text-xl font-bold text-[#6B7280]">%</span>
                            </div>
                            <p className="text-xs text-[#6B7280] font-bold mt-2">Strong matching matrix</p>
                        </div>

                        {/* Skill Gaps Module */}
                        <div className="space-y-3">
                            <p className="text-[10px] font-black text-[#1F2937] tracking-widest uppercase pl-2 flex items-center gap-1.5">
                                <AlertCircle className="w-3.5 h-3.5 text-[#2563EB]" />
                                Skill Gaps
                            </p>
                            <div className="flex flex-wrap gap-2 bg-[#FFFFFF] p-4 border border-[#E2E8F0] rounded-2xl min-h-[6rem] content-start shadow-sm">
                                {report.skillGaps.map((gap, i) => (
                                    <span
                                        key={i}
                                        className={`text-[10px] font-black px-2.5 py-1 rounded-md border tracking-widest uppercase shadow-sm ${gap.severity === 'high'
                                            ? 'bg-rose-50 text-rose-600 border-rose-200'
                                            : gap.severity === 'mid'
                                                ? 'bg-amber-50 text-amber-600 border-amber-200'
                                                : 'bg-indigo-50 text-indigo-600 border-indigo-200'
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
                <footer className="border-t border-[#E2E8F0] mt-6 pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#6B7280] font-semibold">
                    <div className="flex gap-4">
                        <a href="#" className="hover:text-[#1F2937] transition-colors">Privacy Policy</a>
                        <a href="#" className="hover:text-[#1F2937] transition-colors">Terms of Service</a>
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