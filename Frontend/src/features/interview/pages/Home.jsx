import React, { useState, useRef } from 'react'
import { useInterview } from '../hooks/useInterview.js'
import { useNavigate } from 'react-router'
import { Loader2, Briefcase, User, UploadCloud, Info, Sparkles } from 'lucide-react'

const Home = () => {
    const { loading, generateReport, reports } = useInterview()
    const [jobDescription, setJobDescription] = useState("")
    const [selfDescription, setSelfDescription] = useState("")
    const resumeInputRef = useRef()

    const navigate = useNavigate()

    const handleGenerateReport = async () => {
        const resumeFile = resumeInputRef.current.files[0]
        const data = await generateReport({ jobDescription, selfDescription, resumeFile })
        navigate(`/interview/${data._id}`)
    }

    if (loading) {
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
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#37415120_1px,transparent_1px),linear-gradient(to_bottom,#37415120_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_45%,#000_85%,transparent_100%)] pointer-events-none" />

            {/* Ambient Background Glows */}
            <div className="absolute top-6 left-1/2 -translate-x-1/2 w-[500px] h-[250px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute top-1/3 right-10 w-80 h-80 bg-purple-600/10 rounded-full blur-[110px] pointer-events-none" />

            {/* Main Content Wrapper - Controlled padding for laptop screens */}
            <div className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1 flex flex-col justify-center">

                {/* Page Header - Made title smaller to save height */}
                <header className="max-w-2xl mx-auto text-center mb-6">
                    <h1 className="text-2xl md:text-4xl font-extrabold text-white tracking-tight leading-tight">
                        Create Your Custom <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">Interview Plan</span>
                    </h1>
                    <p className="text-sm text-gray-400 mt-1.5">
                        Let our AI analyze the job requirements and your unique profile to build a winning strategy.
                    </p>
                </header>

                {/* Main Card - Compact Padding & Tightened layout */}
                <div className="w-full bg-white/[0.02] backdrop-blur-xl border border-white/[0.08] rounded-2xl shadow-2xl overflow-hidden">

                    {/* Body Split Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2">

                        {/* Left Panel - Job Description */}
                        <div className="p-5 md:p-7 flex flex-col gap-4 border-b border-white/[0.06] lg:border-b-0 lg:border-r lg:border-white/[0.06]">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2.5">
                                    <div className="p-1.5 bg-indigo-500/10 rounded-md text-indigo-400 border border-indigo-500/20">
                                        <Briefcase className="w-4 h-4" />
                                    </div>
                                    <h2 className="text-base font-bold text-white tracking-wide">Target Job Description</h2>
                                </div>
                                <span className="text-[10px] font-semibold px-2 py-0.5 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded">Required</span>
                            </div>

                            {/* Decreased min-height to fit laptop views perfectly */}
                            <textarea
                                onChange={(e) => { setJobDescription(e.target.value) }}
                                className="w-full flex-1 min-h-[11rem] lg:min-h-[13rem] bg-black/20 border border-white/[0.08] rounded-xl p-4 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all duration-200 resize-none leading-relaxed"
                                placeholder={`Paste the full job description here...\ne.g. 'Senior Frontend Engineer at Google requires proficiency in React, TypeScript...'`}
                                maxLength={5000}
                            />

                            <div className="text-xs text-gray-500 text-right font-mono">
                                {jobDescription.length} / 5000 chars
                            </div>
                        </div>

                        {/* Right Panel - Profile */}
                        <div className="p-5 md:p-7 flex flex-col gap-4 justify-between">
                            <div className="flex items-center gap-2.5">
                                <div className="p-1.5 bg-purple-500/10 rounded-md text-purple-400 border border-purple-500/20">
                                    <User className="w-4 h-4" />
                                </div>
                                <h2 className="text-base font-bold text-white tracking-wide">Your Profile</h2>
                            </div>

                            {/* Upload Resume - Made dropzone tighter */}
                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-medium text-gray-300 flex items-center justify-between">
                                    Upload Resume
                                    <span className="text-[10px] font-semibold px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded">Best Results</span>
                                </label>
                                <label className="flex flex-col items-center justify-center border-2 border-dashed border-white/[0.1] hover:border-indigo-500/50 bg-black/10 hover:bg-indigo-500/[0.02] rounded-xl p-4 cursor-pointer transition-all duration-200 group" htmlFor="resume">
                                    <span className="p-1.5 bg-white/[0.02] rounded-lg text-gray-400 group-hover:text-indigo-400 mb-1 border border-white/[0.05] transition-colors">
                                        <UploadCloud className="w-4 h-4" />
                                    </span>
                                    <p className="text-xs font-semibold text-white group-hover:text-indigo-400 transition-colors">Click to upload or drag &amp; drop</p>
                                    <p className="text-[10px] text-gray-500">PDF or DOCX (Max 5MB)</p>
                                    <input ref={resumeInputRef} hidden type="file" id="resume" name="resume" accept=".pdf,.docx" />
                                </label>
                            </div>

                            {/* OR Divider */}
                            <div className="flex items-center gap-3 text-[10px] font-bold text-gray-500 tracking-widest uppercase">
                                <div className="h-[1px] w-full bg-white/[0.06]" />
                                <span>OR</span>
                                <div className="h-[1px] w-full bg-white/[0.06]" />
                            </div>

                            {/* Quick Self-Description - Optimized height */}
                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-medium text-gray-300" htmlFor="selfDescription">Quick Self-Description</label>
                                <textarea
                                    onChange={(e) => { setSelfDescription(e.target.value) }}
                                    id="selfDescription"
                                    name="selfDescription"
                                    className="w-full h-20 bg-black/20 border border-white/[0.08] rounded-xl p-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all duration-200 resize-none leading-relaxed"
                                    placeholder="Briefly describe your experience, key skills..."
                                />
                            </div>

                            {/* Info Box - Slimmed */}
                            <div className="flex gap-2.5 bg-indigo-500/5 border border-indigo-500/10 rounded-xl p-2.5">
                                <Info className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5" />
                                <p className="text-xs text-gray-400 leading-normal">
                                    Either a <strong className="text-gray-200 font-medium">Resume</strong> or a <strong className="text-gray-200 font-medium">Self Description</strong> is required.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Card Footer - Lean padding */}
                    <div className="bg-white/[0.01] border-t border-white/[0.08] px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
                        <span className="text-xs text-gray-500 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-pulse" />
                            AI-Powered Strategy Generation &bull; Approx 30s
                        </span>
                        <button
                            onClick={handleGenerateReport}
                            className="w-full sm:w-auto px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-indigo-600/10 hover:shadow-indigo-500/20 transition-all duration-200 active:scale-[0.98] flex items-center justify-center gap-2 group">
                            <Sparkles className="w-3.5 h-3.5 text-indigo-200 group-hover:scale-110 transition-transform" />
                            Generate My Interview Strategy
                        </button>
                    </div>
                </div>

                {/* Recent Reports Grid Section - Tighter margins */}
                {reports.length > 0 && (
                    <section className="mt-8">
                        <h2 className="text-lg font-bold text-white mb-4 tracking-wide">My Recent Interview Plans</h2>
                        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {reports.map(report => (
                                <li
                                    key={report._id}
                                    className="bg-white/[0.02] border border-white/[0.06] hover:border-white/[0.12] rounded-xl p-4 flex flex-col justify-between gap-4 group cursor-pointer"
                                    onClick={() => navigate(`/interview/${report._id}`)}>
                                    <div>
                                        <h3 className="text-sm font-bold text-white group-hover:text-indigo-400 transition-colors line-clamp-1">{report.title || 'Untitled Position'}</h3>
                                        <p className="text-[10px] text-gray-500 mt-0.5">Generated on {new Date(report.createdAt).toLocaleDateString()}</p>
                                    </div>
                                    <div className="flex items-center justify-between pt-2 border-t border-white/[0.04]">
                                        <span className="text-[11px] text-gray-400">Match Accuracy</span>
                                        <span className={`text-xs font-bold font-mono px-2 py-0.5 rounded ${
                                            report.matchScore >= 80
                                                ? 'text-emerald-400 bg-emerald-500/5 border border-emerald-500/10'
                                                : report.matchScore >= 60
                                                    ? 'text-amber-400 bg-amber-500/5 border border-amber-500/10'
                                                    : 'text-rose-400 bg-rose-500/5 border border-rose-500/10'
                                        }`}>
                                            {report.matchScore}%
                                        </span>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </section>
                )}

                {/* Page Footer - Reduced spacing */}
                <footer className="border-t border-white/[0.06] mt-8 pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500">
                    <div className="flex gap-4">
                        <a href="#" className="hover:text-gray-300 transition-colors">Privacy Policy</a>
                        <a href="#" className="hover:text-gray-300 transition-colors">Terms of Service</a>
                        <a href="#" className="hover:text-gray-300 transition-colors">Help Center</a>
                    </div>
                    <p>&copy; {new Date().getFullYear()} AI Interview Strategy.</p>
                </footer>

            </div>
        </div>
    )
}

export default Home