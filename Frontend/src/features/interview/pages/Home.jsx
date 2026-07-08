import React, { useState, useRef, useEffect, useContext } from 'react'
import { useInterview } from '../hooks/useInterview.js'
import { useNavigate } from 'react-router'
import { Loader2, Briefcase, User, UploadCloud, Info, Sparkles, Trophy, TrendingUp, Target, PlusCircle, History, FileText, LayoutDashboard, LogOut, Menu, X } from 'lucide-react'
import { getPracticeHistory } from '../services/practice.api'
import { AuthContext } from '../../auth/auth.context'

const Home = () => {
    const { user, handleLogout } = useContext(AuthContext)
    const { loading, generateReport, reports, mockResults } = useInterview()
    const [jobDescription, setJobDescription] = useState("")
    const [selfDescription, setSelfDescription] = useState("")
    const [error, setError] = useState(null)
    const [practiceSessions, setPracticeSessions] = useState([])
    const [activeTab, setActiveTab] = useState('create')
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const resumeInputRef = useRef()

    const navigate = useNavigate()

    useEffect(() => {
        getPracticeHistory()
            .then(data => {
                if (data && data.success) {
                    setPracticeSessions(data.sessions || [])
                }
            })
            .catch(err => console.error("Error fetching practice history", err))
    }, [])

    const handleGenerateReport = async () => {
        setError(null)
        try {
            const resumeFile = resumeInputRef.current.files[0]
            const data = await generateReport({ jobDescription, selfDescription, resumeFile })
            navigate(`/interview/${data._id}`)
        } catch (err) {
            const msg = err?.response?.data?.error || err?.response?.data?.message || err?.message || "Something went wrong. Please try again."
            setError(msg)
        }
    }

    if (loading) {
        return (
            <main className="min-h-screen w-full flex flex-col items-center justify-center bg-[#0B0F19] text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#37415120_1px,transparent_1px),linear-gradient(to_bottom,#37415120_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_45%,#000_85%,transparent_100%)] pointer-events-none" />
                <div className="absolute top-6 left-1/2 -translate-x-1/2 w-[500px] h-[250px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />
                <div className="relative w-24 h-24 mb-8">
                    <div className="absolute inset-0 border-t-4 border-indigo-500 rounded-full animate-spin"></div>
                    <div className="absolute inset-2 border-r-4 border-emerald-500 rounded-full animate-spin-slow"></div>
                    <div className="absolute inset-4 border-b-4 border-purple-500 rounded-full animate-spin"></div>
                </div>
                <h1 className="text-2xl font-bold text-white mb-2 tracking-wide">Loading your dashboard...</h1>
                <p className="text-indigo-300/70 font-medium">Fetching your interview data</p>
            </main>
        )
    }

    return (
        <div className="min-h-screen w-full bg-[#0B0F19] text-gray-100 flex overflow-hidden">

            {/* Background Grid Structure */}
            <div className="fixed inset-0 bg-[linear-gradient(to_right,#37415120_1px,transparent_1px),linear-gradient(to_bottom,#37415120_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_45%,#000_85%,transparent_100%)] pointer-events-none z-0" />

            {/* Ambient Background Glows */}
            <div className="fixed top-6 left-1/2 -translate-x-1/2 w-[500px] h-[250px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none z-0" />
            <div className="fixed top-1/3 right-10 w-80 h-80 bg-purple-600/10 rounded-full blur-[110px] pointer-events-none z-0" />

            {/* Sidebar (Desktop) */}
            <aside className="relative z-20 w-72 border-r border-white/[0.06] bg-[#0B0F19]/80 backdrop-blur-xl flex-col hidden lg:flex shrink-0">
                <div className="p-6 border-b border-white/[0.06] flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                        <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <span className="font-extrabold text-xl text-white tracking-wider">JobFit AI</span>
                </div>

                <nav className="flex-1 p-5 flex flex-col gap-2 overflow-y-auto">
                    <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 px-3">Main Actions</div>

                    <button 
                        onClick={() => setActiveTab('create')} 
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${activeTab === 'create' ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 shadow-[0_0_15px_rgba(99,102,241,0.1)]' : 'text-gray-400 hover:bg-white/[0.02] hover:text-gray-200 border border-transparent'}`}
                    >
                        <PlusCircle className={`w-5 h-5 ${activeTab === 'create' ? 'text-indigo-400' : 'text-gray-500'}`} />
                        <span className="text-sm font-bold">Create Interview Plan</span>
                    </button>

                    <button 
                        onClick={() => navigate("/practice")} 
                        className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 text-gray-400 hover:bg-white/[0.02] hover:text-gray-200 border border-transparent group"
                    >
                        <Target className="w-5 h-5 text-gray-500 group-hover:text-purple-400 transition-colors" />
                        <span className="text-sm font-bold group-hover:text-purple-400 transition-colors">Custom Practice Test</span>
                    </button>

                    <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest mt-8 mb-2 px-3">My History</div>

                    <button 
                        onClick={() => setActiveTab('plans')} 
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${activeTab === 'plans' ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 shadow-[0_0_15px_rgba(99,102,241,0.1)]' : 'text-gray-400 hover:bg-white/[0.02] hover:text-gray-200 border border-transparent'}`}
                    >
                        <Briefcase className={`w-5 h-5 ${activeTab === 'plans' ? 'text-indigo-400' : 'text-gray-500'}`} />
                        <span className="text-sm font-bold">Recent Plans</span>
                    </button>

                    <button 
                        onClick={() => setActiveTab('mocks')} 
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${activeTab === 'mocks' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20 shadow-[0_0_15px_rgba(251,191,36,0.1)]' : 'text-gray-400 hover:bg-white/[0.02] hover:text-gray-200 border border-transparent'}`}
                    >
                        <Trophy className={`w-5 h-5 ${activeTab === 'mocks' ? 'text-amber-400' : 'text-gray-500'}`} />
                        <span className="text-sm font-bold">Mock Scores</span>
                    </button>

                    <button 
                        onClick={() => setActiveTab('practices')} 
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${activeTab === 'practices' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20 shadow-[0_0_15px_rgba(168,85,247,0.1)]' : 'text-gray-400 hover:bg-white/[0.02] hover:text-gray-200 border border-transparent'}`}
                    >
                        <FileText className={`w-5 h-5 ${activeTab === 'practices' ? 'text-purple-400' : 'text-gray-500'}`} />
                        <span className="text-sm font-bold">Practice Tests</span>
                    </button>
                </nav>

                <div className="p-5 border-t border-white/[0.06] bg-white/[0.01]">
                    <div className="flex items-center justify-between px-2 py-1">
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-gray-700 to-gray-600 flex items-center justify-center text-white font-bold text-xs border border-white/10 uppercase">
                                {user?.username?.charAt(0) || <User className="w-4 h-4" />}
                            </div>
                            <div className="flex flex-col">
                                <span className="text-sm font-bold text-white truncate max-w-[100px]">{user?.username || 'My Account'}</span>
                                <span className="text-[10px] text-emerald-400 font-semibold tracking-wide">Online</span>
                            </div>
                        </div>
                        <button 
                            onClick={handleLogout} 
                            title="Logout"
                            className="text-gray-500 hover:text-rose-400 transition-colors p-2 rounded-lg hover:bg-rose-500/10"
                        >
                            <LogOut className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </aside>

            {/* Mobile Header */}
            <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-[#0B0F19]/90 backdrop-blur-xl border-b border-white/[0.06] flex items-center justify-between p-4">
                <div className="font-extrabold text-lg text-white tracking-wider flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-indigo-400" />
                    JobFit AI
                </div>
                <div className="flex items-center gap-1">
                    <button 
                        onClick={handleLogout} 
                        className="text-gray-400 hover:text-rose-400 transition-colors p-2 rounded-lg hover:bg-rose-500/10"
                    >
                        <LogOut className="w-5 h-5" />
                    </button>
                    <button 
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="text-gray-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/5"
                    >
                        {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            {isMobileMenuOpen && (
                <div className="lg:hidden fixed inset-0 z-30 bg-[#0B0F19]/95 backdrop-blur-xl pt-[80px] pb-6 px-4 flex flex-col overflow-y-auto animate-in fade-in slide-in-from-top-4 duration-300">
                    <div className="flex flex-col gap-2">
                        <button onClick={() => { setActiveTab('create'); setIsMobileMenuOpen(false); }} className={`flex items-center justify-between p-4 rounded-xl transition-all duration-300 border ${activeTab === 'create' ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400' : 'bg-white/[0.02] border-transparent text-gray-300 hover:bg-indigo-500/5 hover:border-indigo-500/20 hover:text-indigo-300'}`}>
                            <span className="font-bold text-sm">Create Interview Plan</span>
                            <LayoutDashboard className={`w-5 h-5 ${activeTab === 'create' ? 'opacity-100' : 'opacity-50'}`} />
                        </button>
                        <button onClick={() => { navigate("/practice"); setIsMobileMenuOpen(false); }} className={`flex items-center justify-between p-4 rounded-xl transition-all duration-300 bg-white/[0.02] border border-transparent text-gray-300 hover:bg-purple-500/10 hover:border-purple-500/30 hover:text-purple-400`}>
                            <span className="font-bold text-sm">Custom Practice Test</span>
                            <Target className="w-5 h-5 opacity-50 group-hover:opacity-100" />
                        </button>
                        
                        <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest mt-6 mb-2 px-2">My History</div>
                        
                        <button onClick={() => { setActiveTab('plans'); setIsMobileMenuOpen(false); }} className={`flex items-center justify-between p-4 rounded-xl transition-all duration-300 border ${activeTab === 'plans' ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400' : 'bg-white/[0.02] border-transparent text-gray-300 hover:bg-indigo-500/5 hover:border-indigo-500/20 hover:text-indigo-300'}`}>
                            <span className="font-bold text-sm">Recent Plans</span>
                            <Briefcase className={`w-5 h-5 ${activeTab === 'plans' ? 'opacity-100' : 'opacity-50'}`} />
                        </button>
                        <button onClick={() => { setActiveTab('mocks'); setIsMobileMenuOpen(false); }} className={`flex items-center justify-between p-4 rounded-xl transition-all duration-300 border ${activeTab === 'mocks' ? 'bg-amber-500/10 border-amber-500/30 text-amber-400' : 'bg-white/[0.02] border-transparent text-gray-300 hover:bg-amber-500/5 hover:border-amber-500/20 hover:text-amber-300'}`}>
                            <span className="font-bold text-sm">Mock Scores</span>
                            <History className={`w-5 h-5 ${activeTab === 'mocks' ? 'opacity-100' : 'opacity-50'}`} />
                        </button>
                        <button onClick={() => { setActiveTab('practices'); setIsMobileMenuOpen(false); }} className={`flex items-center justify-between p-4 rounded-xl transition-all duration-300 border ${activeTab === 'practices' ? 'bg-purple-500/10 border-purple-500/30 text-purple-400' : 'bg-white/[0.02] border-transparent text-gray-300 hover:bg-purple-500/5 hover:border-purple-500/20 hover:text-purple-300'}`}>
                            <span className="font-bold text-sm">Practice Tests</span>
                            <FileText className={`w-5 h-5 ${activeTab === 'practices' ? 'opacity-100' : 'opacity-50'}`} />
                        </button>
                    </div>
                </div>
            )}

            {/* Main Content Area */}
            <main className="relative z-10 flex-1 h-screen overflow-y-auto pt-[80px] lg:pt-0">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-10 py-8 lg:py-12 min-h-full flex flex-col">
                    
                    {/* --- TAB: CREATE PLAN --- */}
                    {activeTab === 'create' && (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 flex-1 flex flex-col justify-center">
                            <header className="max-w-2xl mx-auto text-center mb-10">
                                <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
                                    Create Your Custom <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">Interview Plan</span>
                                </h1>
                                <p className="text-sm md:text-base text-gray-400 mt-3">
                                    Let our AI analyze the job requirements and your unique profile to build a winning strategy.
                                </p>
                            </header>

                            <div className="w-full bg-white/[0.02] backdrop-blur-xl border border-white/[0.08] rounded-3xl shadow-2xl overflow-hidden">
                                <div className="grid grid-cols-1 lg:grid-cols-2">
                                    {/* Left Panel */}
                                    <div className="p-6 md:p-8 flex flex-col gap-5 border-b border-white/[0.06] lg:border-b-0 lg:border-r lg:border-white/[0.06]">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-400 border border-indigo-500/20">
                                                    <Briefcase className="w-4 h-4 md:w-5 md:h-5" />
                                                </div>
                                                <h2 className="text-lg font-bold text-white tracking-wide">Target Job Description</h2>
                                            </div>
                                            <span className="text-[10px] font-bold px-2.5 py-1 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded uppercase tracking-wider">Required</span>
                                        </div>

                                        <textarea
                                            onChange={(e) => { setJobDescription(e.target.value) }}
                                            className="w-full flex-1 min-h-[14rem] bg-black/20 border border-white/[0.08] rounded-2xl p-5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all duration-200 resize-none leading-relaxed"
                                            placeholder={`Paste the full job description here...\ne.g. 'Senior Frontend Engineer at Google requires proficiency in React, TypeScript...'`}
                                            maxLength={5000}
                                        />

                                        <div className="text-xs text-gray-500 text-right font-mono">
                                            {jobDescription.length} / 5000 chars
                                        </div>
                                    </div>

                                    {/* Right Panel */}
                                    <div className="p-6 md:p-8 flex flex-col gap-6 justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-purple-500/10 rounded-lg text-purple-400 border border-purple-500/20">
                                                <User className="w-4 h-4 md:w-5 md:h-5" />
                                            </div>
                                            <h2 className="text-lg font-bold text-white tracking-wide">Your Profile</h2>
                                        </div>

                                        <div className="flex flex-col gap-3">
                                            <label className="text-xs font-bold text-gray-300 flex items-center justify-between uppercase tracking-wider">
                                                Upload Resume
                                                <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded">Best Results</span>
                                            </label>
                                            <label className="flex flex-col items-center justify-center border-2 border-dashed border-white/[0.1] hover:border-indigo-500/50 bg-black/10 hover:bg-indigo-500/[0.02] rounded-2xl p-6 cursor-pointer transition-all duration-200 group" htmlFor="resume">
                                                <span className="p-2 bg-white/[0.02] rounded-xl text-gray-400 group-hover:text-indigo-400 mb-2 border border-white/[0.05] transition-colors shadow-sm">
                                                    <UploadCloud className="w-5 h-5 md:w-6 md:h-6" />
                                                </span>
                                                <p className="text-sm font-semibold text-white group-hover:text-indigo-400 transition-colors">Click to upload or drag &amp; drop</p>
                                                <p className="text-xs text-gray-500 mt-1">PDF or DOCX (Max 5MB)</p>
                                                <input ref={resumeInputRef} hidden type="file" id="resume" name="resume" accept=".pdf,.docx" />
                                            </label>
                                        </div>

                                        <div className="flex items-center gap-3 text-[10px] font-black text-gray-500 tracking-widest uppercase">
                                            <div className="h-[1px] w-full bg-white/[0.06]" />
                                            <span>OR</span>
                                            <div className="h-[1px] w-full bg-white/[0.06]" />
                                        </div>

                                        <div className="flex flex-col gap-3">
                                            <label className="text-xs font-bold text-gray-300 uppercase tracking-wider" htmlFor="selfDescription">Quick Self-Description</label>
                                            <textarea
                                                onChange={(e) => { setSelfDescription(e.target.value) }}
                                                id="selfDescription"
                                                name="selfDescription"
                                                className="w-full h-24 bg-black/20 border border-white/[0.08] rounded-2xl p-4 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all duration-200 resize-none leading-relaxed"
                                                placeholder="Briefly describe your experience, key skills..."
                                            />
                                        </div>

                                        <div className="flex gap-3 bg-indigo-500/5 border border-indigo-500/10 rounded-xl p-3">
                                            <Info className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                                            <p className="text-xs text-gray-400 leading-relaxed">
                                                Either a <strong className="text-gray-200 font-bold">Resume</strong> or a <strong className="text-gray-200 font-bold">Self Description</strong> is required.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white/[0.01] border-t border-white/[0.08] px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
                                    <span className="text-xs font-medium text-gray-500 flex items-center gap-2 uppercase tracking-wide">
                                        <span className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(99,102,241,0.6)]" />
                                        AI-Powered Strategy Generation &bull; Approx 30s
                                    </span>
                                    <div className="flex flex-col items-end gap-2 w-full sm:w-auto">
                                        {error && (
                                            <p className="text-xs font-bold text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-xl px-4 py-2.5 text-right max-w-sm">
                                                ⚠️ {error}
                                            </p>
                                        )}
                                        <button
                                            onClick={handleGenerateReport}
                                            disabled={loading}
                                            className="w-full sm:w-auto px-6 py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-extrabold text-sm rounded-2xl shadow-xl shadow-indigo-600/20 hover:shadow-indigo-500/30 transition-all duration-300 active:scale-[0.98] flex items-center justify-center gap-2 group border border-white/10">
                                            {loading ? (
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                            ) : (
                                                <Sparkles className="w-4 h-4 text-indigo-200 group-hover:scale-110 transition-transform" />
                                            )}
                                            {loading ? 'Generating...' : 'Generate My Interview Strategy'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* --- TAB: RECENT PLANS --- */}
                    {activeTab === 'plans' && (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 flex-1 flex flex-col">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20 shadow-[0_0_20px_rgba(99,102,241,0.2)]">
                                    <Briefcase className="w-6 h-6 text-indigo-400" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-extrabold text-white tracking-tight">My Recent Interview Plans</h2>
                                    <p className="text-sm text-gray-400 mt-1">Review and continue your personalized interview strategies.</p>
                                </div>
                            </div>
                            
                            {reports.length > 0 ? (
                                <ul className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                    {reports.map(report => (
                                        <li
                                            key={report._id}
                                            className="relative bg-white/[0.02] border border-white/[0.06] hover:border-indigo-500/40 rounded-3xl p-6 flex flex-col justify-between gap-5 group cursor-pointer transition-all duration-300 hover:bg-white/[0.04] hover:-translate-y-1.5 hover:shadow-[0_12px_40px_rgb(99,102,241,0.15)] overflow-hidden"
                                            onClick={() => navigate(`/interview/${report._id}`)}>
                                            <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-500/10 rounded-full blur-[50px] -mr-12 -mt-12 transition-opacity opacity-0 group-hover:opacity-100" />
                                            <div className="relative z-10">
                                                <h3 className="text-lg font-bold text-gray-100 group-hover:text-indigo-300 transition-colors line-clamp-1">{report.title || 'Untitled Position'}</h3>
                                                <p className="text-xs text-gray-500 mt-1 font-medium">Generated on {new Date(report.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                                            </div>
                                            <div className="relative z-10 flex items-center justify-between pt-4 border-t border-white/[0.04]">
                                                <span className="text-xs text-gray-400 font-bold tracking-wider uppercase">Match Accuracy</span>
                                                <span className={`text-sm font-black font-mono px-3 py-1.5 rounded-lg shadow-sm ${report.matchScore >= 80
                                                    ? 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/20'
                                                    : report.matchScore >= 60
                                                        ? 'text-amber-400 bg-amber-500/10 border border-amber-500/20'
                                                        : 'text-rose-400 bg-rose-500/10 border border-rose-500/20'
                                                    }`}>
                                                    {report.matchScore}%
                                                </span>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <div className="flex-1 flex flex-col items-center justify-center text-center opacity-70">
                                    <Briefcase className="w-16 h-16 text-gray-600 mb-4" />
                                    <h3 className="text-xl font-bold text-white mb-2">No Plans Yet</h3>
                                    <p className="text-sm text-gray-400">Generate your first interview plan from the Create Plan tab.</p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* --- TAB: MOCK SCORES --- */}
                    {activeTab === 'mocks' && (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 flex-1 flex flex-col">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center border border-amber-500/20 shadow-[0_0_20px_rgba(251,191,36,0.2)]">
                                    <Trophy className="w-6 h-6 text-amber-400" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-extrabold text-white tracking-tight">Past Mock Interview Scores</h2>
                                    <p className="text-sm text-gray-400 mt-1">Review your performance from AI-simulated mock interviews.</p>
                                </div>
                            </div>

                            {mockResults && mockResults.length > 0 ? (
                                <ul className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                    {mockResults.map((result) => {
                                        const score = result.overallScore;
                                        const isGood = score >= 70;
                                        const isMid = score >= 50 && score < 70;
                                        return (
                                            <li
                                                key={result._id}
                                                className="relative bg-white/[0.02] border border-white/[0.06] hover:border-amber-500/40 rounded-3xl p-6 flex flex-col justify-between gap-5 group cursor-pointer transition-all duration-300 hover:bg-white/[0.04] hover:-translate-y-1.5 hover:shadow-[0_12px_40px_rgb(251,191,36,0.15)] overflow-hidden"
                                                onClick={() => navigate(`/mock-result/${result._id}`)}
                                            >
                                                <div className="absolute top-0 right-0 w-40 h-40 bg-amber-500/10 rounded-full blur-[50px] -mr-12 -mt-12 transition-opacity opacity-0 group-hover:opacity-100" />
                                                <div className="relative z-10 flex items-start justify-between gap-3">
                                                    <div className="flex items-center gap-2.5">
                                                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center bg-white/[0.03] border ${isGood ? 'border-emerald-500/30' : isMid ? 'border-amber-500/30' : 'border-rose-500/30'}`}>
                                                            <TrendingUp className={`w-4 h-4 ${isGood ? 'text-emerald-400' : isMid ? 'text-amber-400' : 'text-rose-400'}`} />
                                                        </div>
                                                        <p className="text-xs text-gray-400 font-bold tracking-wide">
                                                            {new Date(result.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                                        </p>
                                                    </div>
                                                    <span className={`text-2xl font-black font-mono drop-shadow-md ${isGood ? 'text-emerald-400' : isMid ? 'text-amber-400' : 'text-rose-400'}`}>
                                                        {score}<span className="text-xs text-gray-500 font-semibold">/100</span>
                                                    </span>
                                                </div>
                                                <p className="relative z-10 text-sm text-gray-400 leading-relaxed line-clamp-2">
                                                    {result.overallSummary}
                                                </p>
                                                <div className="relative z-10 flex items-center justify-between pt-4 border-t border-white/[0.04]">
                                                    <span className={`text-[10px] font-black px-3 py-1.5 rounded-lg border tracking-widest uppercase shadow-sm ${isGood
                                                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                                        : isMid
                                                            ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                                                            : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                                                        }`}>
                                                        {isGood ? 'Strong' : isMid ? 'Average' : 'Needs Work'}
                                                    </span>
                                                    <span className="text-xs text-gray-500 group-hover:text-amber-400 transition-colors font-bold flex items-center gap-1.5">
                                                        View Details <span className="text-base leading-none mb-0.5">→</span>
                                                    </span>
                                                </div>
                                            </li>
                                        );
                                    })}
                                </ul>
                            ) : (
                                <div className="flex-1 flex flex-col items-center justify-center text-center opacity-70">
                                    <Trophy className="w-16 h-16 text-gray-600 mb-4" />
                                    <h3 className="text-xl font-bold text-white mb-2">No Mock Scores</h3>
                                    <p className="text-sm text-gray-400">Complete a mock interview from a generated plan to see scores here.</p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* --- TAB: PRACTICE TESTS --- */}
                    {activeTab === 'practices' && (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 flex-1 flex flex-col">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center border border-purple-500/20 shadow-[0_0_20px_rgba(168,85,247,0.2)]">
                                    <Target className="w-6 h-6 text-purple-400" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-extrabold text-white tracking-tight">Past Custom Practice Tests</h2>
                                    <p className="text-sm text-gray-400 mt-1">Review your topic-specific practice sessions.</p>
                                </div>
                            </div>
                            
                            {practiceSessions && practiceSessions.length > 0 ? (
                                <ul className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                    {practiceSessions.map((session) => {
                                        const score = session.evaluation?.totalScore || 0;
                                        const isGood = score >= 7;
                                        const isMid = score >= 5 && score < 7;
                                        return (
                                            <li
                                                key={session._id}
                                                className="relative bg-white/[0.02] border border-white/[0.06] hover:border-purple-500/40 rounded-3xl p-6 flex flex-col justify-between gap-5 group cursor-pointer transition-all duration-300 hover:bg-white/[0.04] hover:-translate-y-1.5 hover:shadow-[0_12px_40px_rgb(168,85,247,0.15)] overflow-hidden"
                                                onClick={() => navigate(`/practice-result/${session._id}`)}
                                            >
                                                <div className="absolute top-0 right-0 w-40 h-40 bg-purple-500/10 rounded-full blur-[50px] -mr-12 -mt-12 transition-opacity opacity-0 group-hover:opacity-100" />
                                                <div className="relative z-10 flex items-start justify-between gap-3">
                                                    <div className="flex items-center gap-2.5">
                                                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center bg-white/[0.03] border ${isGood ? 'border-emerald-500/30' : isMid ? 'border-amber-500/30' : 'border-rose-500/30'}`}>
                                                            <Target className={`w-4 h-4 ${isGood ? 'text-emerald-400' : isMid ? 'text-amber-400' : 'text-rose-400'}`} />
                                                        </div>
                                                        <p className="text-xs text-gray-400 font-bold tracking-wide">
                                                            {new Date(session.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                                        </p>
                                                    </div>
                                                    <span className={`text-2xl font-black font-mono drop-shadow-md ${isGood ? 'text-emerald-400' : isMid ? 'text-amber-400' : 'text-rose-400'}`}>
                                                        {score}<span className="text-xs text-gray-500 font-semibold">/10</span>
                                                    </span>
                                                </div>
                                                <div className="relative z-10 text-xs text-gray-400 leading-relaxed flex flex-wrap gap-2 items-center">
                                                    <span className="text-gray-500 font-bold uppercase tracking-wider text-[10px]">Topics:</span>
                                                    {session.selectedTopics.map((t, idx) => (
                                                        <span key={idx} className="bg-white/[0.05] border border-white/[0.08] text-gray-300 px-2.5 py-1 rounded-md text-[10px] font-bold tracking-widest uppercase">
                                                            {t}
                                                        </span>
                                                    ))}
                                                </div>
                                                <div className="relative z-10 flex items-center justify-between pt-4 border-t border-white/[0.04]">
                                                    <span className={`text-[10px] font-black px-3 py-1.5 rounded-lg border tracking-widest uppercase shadow-sm ${isGood
                                                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                                        : isMid
                                                            ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                                                            : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                                                        }`}>
                                                        {isGood ? 'Strong' : isMid ? 'Average' : 'Needs Work'}
                                                    </span>
                                                    <span className="text-xs text-gray-500 group-hover:text-purple-400 transition-colors font-bold flex items-center gap-1.5">
                                                        {session.status === 'completed' ? 'Completed' : 'Pending'} <span className="text-base leading-none mb-0.5">→</span>
                                                    </span>
                                                </div>
                                            </li>
                                        );
                                    })}
                                </ul>
                            ) : (
                                <div className="flex-1 flex flex-col items-center justify-center text-center opacity-70">
                                    <Target className="w-16 h-16 text-gray-600 mb-4" />
                                    <h3 className="text-xl font-bold text-white mb-2">No Practice Tests</h3>
                                    <p className="text-sm text-gray-400">Click on Custom Practice Test to start your first session.</p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Page Footer */}
                    <footer className="mt-auto border-t border-white/[0.06] pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-medium text-gray-600">
                        <div className="flex gap-5">
                            <a href="#" className="hover:text-gray-400 transition-colors">Privacy Policy</a>
                            <a href="#" className="hover:text-gray-400 transition-colors">Terms of Service</a>
                            <a href="#" className="hover:text-gray-400 transition-colors">Help Center</a>
                        </div>
                        <p>&copy; {new Date().getFullYear()} JobFit AI. All rights reserved.</p>
                    </footer>

                </div>
            </main>
        </div>
    )
}

export default Home