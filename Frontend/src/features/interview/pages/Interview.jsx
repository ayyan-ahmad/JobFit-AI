import React, { useState, useEffect } from 'react'
import { useInterview } from '../hooks/useInterview.js'
import { useNavigate, useParams } from 'react-router'
// Modern premium icons imported here
import {
    Loader2,
    Terminal,
    MessageSquare,
    Map,
    ChevronDown,
    Download,
    Target,
    AlertCircle,
    ArrowLeft
} from 'lucide-react'

const NAV_ITEMS = [
    { id: 'technical', label: 'Technical Questions', icon: <Terminal className="w-4 h-4" /> },
    { id: 'behavioral', label: 'Behavioral Questions', icon: <MessageSquare className="w-4 h-4" /> },
    { id: 'roadmap', label: 'Road Map', icon: <Map className="w-4 h-4" /> },
]

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

const RoadMapDay = ({ day }) => (
    <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-4 space-y-3">
        <div className="flex items-center gap-3">
            <span className="text-xs font-bold px-2.5 py-1 bg-purple-500/10 text-purple-400 border border-purple-500/20 rounded-md">
                Day {day.day}
            </span>
            <h3 className="text-sm md:text-base font-bold text-white tracking-wide">{day.focus}</h3>
        </div>
        <ul className="space-y-2 pl-1">
            {day.tasks.map((task, i) => (
                <li key={i} className="text-xs md:text-sm text-gray-400 flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 bg-purple-400/70 rounded-full shrink-0 mt-2" />
                    <span className="leading-relaxed">{task}</span>
                </li>
            ))}
        </ul>
    </div>
)

// ── Main Component ────────────────────────────────────────────────────────────
const Interview = () => {
    const [activeNav, setActiveNav] = useState('technical')
    const { report, getReportById, loading, getResumePdf } = useInterview()
    const { interviewId } = useParams()
    const navigate = useNavigate()

    useEffect(() => {
        if (interviewId) {
            getReportById(interviewId)
        }
    }, [interviewId])

    if (loading || !report) {
        return (
            <main className="min-h-screen w-full flex flex-col items-center justify-center bg-[#0B0F19] text-white">
                <Loader2 className="w-12 h-12 animate-spin text-indigo-500 mb-4" />
                <h1 className="text-2xl font-medium tracking-wide">Loading your interview plan...</h1>
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

                        {/* Download Resume Action */}
                        <button
                            onClick={() => { getResumePdf(interviewId) }}
                            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-xs font-bold text-white rounded-xl transition-all active:scale-[0.98]"
                        >
                            <Download className="w-4 h-4 text-indigo-400" />
                            Download Resume
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
                                        <RoadMapDay key={day.day} day={day} />
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
        </div>
    )
}

export default Interview