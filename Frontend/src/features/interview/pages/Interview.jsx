import React, { useState } from 'react'
import { useNavigate, useParams } from 'react-router'
// Dashboard results ke liye perfect premium icons import kiye hain
import { Loader2, ArrowLeft, Sparkles, CheckCircle2, TrendingUp, AlertTriangle, Briefcase, Calendar, ShieldCheck } from 'lucide-react'

const InterviewReport = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    
    // Fake/Placeholder states taaki aap isko direct bina crash kiye run kar sakein
    const [loading] = useState(false)
    const [report] = useState({
        title: "Senior Frontend Engineer",
        createdAt: new Date(),
        matchScore: 85,
        strategy: "Focus heavily on system design patterns, state management scaling, and performance optimization techniques like code splitting and virtualization.",
        strengths: ["Strong proficiency in React & TypeScript", "Excellent component architecture design", "Good optimization practices"],
        gaps: ["Needs better depth in micro-frontends", "System design scalability can be polished"]
    })

    if (loading) {
        return (
            <main className="min-h-screen w-full flex flex-col items-center justify-center bg-[#0B0F19] text-white">
                <Loader2 className="w-12 h-12 animate-spin text-indigo-500 mb-4" />
                <h1 className="text-2xl font-medium tracking-wide">Loading your strategy report...</h1>
            </main>
        )
    }

    return (
        <div className="min-h-screen w-full bg-[#0B0F19] text-gray-100 relative overflow-x-hidden flex flex-col justify-between">
            
            {/* Background Grid Structure */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#37415120_1px,transparent_1px),linear-gradient(to_bottom,#37415120_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_45%,#000_85%,transparent_100%)] pointer-events-none" />

            {/* Ambient Background Glows */}
            <div className="absolute top-6 left-1/4 w-72 h-72 bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-purple-600/10 rounded-full blur-[100px] pointer-events-none" />

            {/* Main Wrapper - No scroll laptop optimized size */}
            <div className="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1 flex flex-col justify-center">
                
                {/* Top Action Row */}
                <div className="mb-5 flex items-center justify-between">
                    <button 
                        onClick={() => navigate('/')}
                        className="flex items-center gap-2 text-xs font-semibold text-gray-400 hover:text-white transition-colors group">
                        <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
                        Back to Dashboard
                    </button>
                    <span className="text-[10px] font-mono text-gray-500 bg-white/[0.02] border border-white/[0.05] px-2.5 py-1 rounded">
                        ID: {id || 'PREVIEW'}
                    </span>
                </div>

                {/* Main Dashboard Card */}
                <div className="w-full bg-white/[0.02] backdrop-blur-xl border border-white/[0.08] rounded-2xl shadow-2xl p-5 md:p-6 space-y-6">
                    
                    {/* Header Row: Title and Score */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-white/[0.06]">
                        <div className="space-y-1">
                            <div className="flex items-center gap-2 text-indigo-400">
                                <Briefcase className="w-4 h-4" />
                                <span className="text-xs font-semibold tracking-wider uppercase">Interview Analysis</span>
                            </div>
                            <h1 className="text-xl md:text-2xl font-extrabold text-white tracking-tight">
                                {report?.title || 'Position Strategy Plan'}
                            </h1>
                            <p className="text-xs text-gray-400 flex items-center gap-1.5">
                                <Calendar className="w-3 h-3" />
                                Generated on {new Date(report?.createdAt).toLocaleDateString()}
                            </p>
                        </div>

                        {/* Match Score Gauge */}
                        <div className="flex items-center gap-3 bg-black/20 border border-white/[0.05] rounded-xl p-3 shrink-0">
                            <div className="text-right">
                                <span className="text-[10px] text-gray-400 block uppercase font-bold tracking-wider">Match Score</span>
                                <span className="text-xs text-gray-500">Based on profile &amp; JD</span>
                            </div>
                            <div className={`text-xl font-black font-mono px-3 py-1.5 rounded-lg ${
                                report?.matchScore >= 80 
                                    ? 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/20' 
                                    : 'text-amber-400 bg-amber-500/10 border border-amber-500/20'
                            }`}>
                                {report?.matchScore}%
                            </div>
                        </div>
                    </div>

                    {/* Report Content Grid split view */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                        
                        {/* Strategy Box - Spans 2 cols */}
                        <div className="lg:col-span-2 bg-black/10 border border-white/[0.04] rounded-xl p-4 flex flex-col gap-3">
                            <div className="flex items-center gap-2 text-purple-400">
                                <Sparkles className="w-4 h-4" />
                                <h2 className="text-sm font-bold text-white uppercase tracking-wider">AI Generated Strategy</h2>
                            </div>
                            <p className="text-xs md:text-sm text-gray-300 leading-relaxed bg-black/20 p-3.5 rounded-lg border border-white/[0.02] flex-1">
                                {report?.strategy}
                            </p>
                        </div>

                        {/* Right Summary Panel (Strengths/Gaps) */}
                        <div className="space-y-4 flex flex-col justify-between">
                            
                            {/* Strengths */}
                            <div className="bg-emerald-500/[0.02] border border-emerald-500/10 rounded-xl p-3.5 space-y-2.5">
                                <div className="flex items-center gap-2 text-emerald-400">
                                    <CheckCircle2 className="w-4 h-4" />
                                    <h3 className="text-xs font-bold uppercase tracking-wider">Key Strengths</h3>
                                </div>
                                <ul className="space-y-1.5">
                                    {report?.strengths?.map((str, idx) => (
                                        <li key={idx} className="text-xs text-gray-400 flex items-start gap-1.5">
                                            <span className="text-emerald-400 font-bold mt-0.5">&bull;</span>
                                            {str}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Gaps */}
                            <div className="bg-rose-500/[0.02] border border-rose-500/10 rounded-xl p-3.5 space-y-2.5">
                                <div className="flex items-center gap-2 text-rose-400">
                                    <AlertTriangle className="w-4 h-4" />
                                    <h3 className="text-xs font-bold uppercase tracking-wider">Preparation Gaps</h3>
                                </div>
                                <ul className="space-y-1.5">
                                    {report?.gaps?.map((gap, idx) => (
                                        <li key={idx} className="text-xs text-gray-400 flex items-start gap-1.5">
                                            <span className="text-rose-400 font-bold mt-0.5">&bull;</span>
                                            {gap}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                        </div>
                    </div>

                    {/* Lower Info Banner */}
                    <div className="flex gap-2.5 bg-indigo-500/5 border border-indigo-500/10 rounded-xl p-3">
                        <ShieldCheck className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                        <p className="text-xs text-gray-400 leading-normal">
                            This customized strategy blueprint is ready. Use the insights above to structure your tech interview roadmap effectively.
                        </p>
                    </div>

                </div>

                {/* Mini Footer */}
                <footer className="border-t border-white/[0.06] mt-6 pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500">
                    <div className="flex gap-4">
                        <a href="#" className="hover:text-gray-300 transition-colors">Privacy</a>
                        <a href="#" className="hover:text-gray-300 transition-colors">Terms</a>
                    </div>
                    <p>&copy; 2026 AI Interview Strategy Layout.</p>
                </footer>

            </div>
        </div>
    )
}

export default InterviewReport