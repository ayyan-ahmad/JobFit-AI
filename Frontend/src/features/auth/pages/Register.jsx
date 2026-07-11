import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router'
import { useAuth } from '../hooks/useAuth'
import { UserPlus, Target, BrainCircuit, ArrowRight, Sparkles } from 'lucide-react'
import RingLoader from '../../../components/RingLoader'

const Register = () => {
    const navigate = useNavigate()
    const { loading, handleRegister } = useAuth()

    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError("")
        try {
            await handleRegister({ username, email, password })
            navigate("/")
        } catch (err) {
            setError("Registration failed. Please try again.")
        }
    }

    if (loading) {
        return <RingLoader title="Creating your account..." subtitle="Please wait a moment" />
    }

    return (
        <main className="h-screen w-full flex flex-col lg:flex-row relative bg-white overflow-hidden font-sans">

            {/* LEFT SIDE: Advanced Animated Form (Gamified Grid) */}
            <div className="w-full lg:w-[45%] h-full overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] flex flex-col justify-center items-center p-8 sm:p-12 lg:p-16 z-20 bg-[#e0f2fe] shadow-[20px_0_40px_rgba(0,0,0,0.03)] relative overflow-hidden">

                {/* Light Gamified Grid */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#6366f115_1px,transparent_1px),linear-gradient(to_bottom,#6366f115_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none z-0" />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#e0f2fe]/40 to-[#e0f2fe]/90 pointer-events-none z-0" />

                {/* Ambient Glows */}
                <div className="absolute top-[10%] left-[-10%] w-[400px] h-[400px] bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none z-0" />
                <div className="absolute bottom-[10%] right-[-10%] w-[300px] h-[300px] bg-blue-500/10 rounded-full blur-[100px] pointer-events-none z-0" />

                <div className="w-full max-w-[400px] relative z-10 py-10">

                    <div className="mb-8">
                        <div className="w-14 h-14 bg-blue-50 rounded-2xl border border-blue-100 flex items-center justify-center mb-6 shadow-sm transition-transform hover:scale-105">
                            <UserPlus className="w-7 h-7 text-[#2563EB]" />
                        </div>
                        <h1 className="text-4xl font-black text-[#1F2937] tracking-tight mb-2 leading-snug">
                            Join <span className="inline-block ml-1 px-4 py-1 bg-[#2563EB] text-white rounded-xl shadow-lg shadow-blue-500/30 transform -rotate-2 hover:rotate-0 hover:scale-105 transition-all duration-300 cursor-default">JobFit AI</span>
                        </h1>
                        <p className="text-gray-500 font-medium text-lg">Create an account to start preparing.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">

                        {/* Animated Light Input: Username */}
                        <div className="relative group">
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-[#2563EB] to-indigo-400 rounded-2xl opacity-0 group-focus-within:opacity-20 blur transition duration-500"></div>
                            <div className="relative flex items-center bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl overflow-hidden transition-all duration-300 group-focus-within:border-[#2563EB]/50 group-focus-within:bg-white">
                                <input
                                    onChange={(e) => { setUsername(e.target.value) }}
                                    type="text"
                                    id="username"
                                    className="w-full bg-transparent px-5 pt-8 pb-3 text-[#1F2937] font-bold focus:outline-none peer"
                                    placeholder=" "
                                    required
                                />
                                <label htmlFor="username" className="absolute left-5 top-4 text-xs font-bold text-gray-400 uppercase tracking-widest transition-all peer-placeholder-shown:top-5 peer-placeholder-shown:text-sm peer-placeholder-shown:normal-case peer-focus:top-2 peer-focus:text-[10px] peer-focus:text-[#2563EB] peer-focus:uppercase">
                                    Username
                                </label>
                            </div>
                        </div>

                        {/* Animated Light Input: Email */}
                        <div className="relative group">
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-[#2563EB] to-indigo-400 rounded-2xl opacity-0 group-focus-within:opacity-20 blur transition duration-500"></div>
                            <div className="relative flex items-center bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl overflow-hidden transition-all duration-300 group-focus-within:border-[#2563EB]/50 group-focus-within:bg-white">
                                <input
                                    onChange={(e) => { setEmail(e.target.value) }}
                                    type="email"
                                    id="email"
                                    className="w-full bg-transparent px-5 pt-8 pb-3 text-[#1F2937] font-bold focus:outline-none peer"
                                    placeholder=" "
                                    required
                                />
                                <label htmlFor="email" className="absolute left-5 top-4 text-xs font-bold text-gray-400 uppercase tracking-widest transition-all peer-placeholder-shown:top-5 peer-placeholder-shown:text-sm peer-placeholder-shown:normal-case peer-focus:top-2 peer-focus:text-[10px] peer-focus:text-[#2563EB] peer-focus:uppercase">
                                    Email Address
                                </label>
                            </div>
                        </div>

                        {/* Animated Light Input: Password */}
                        <div className="relative group">
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-[#2563EB] to-indigo-400 rounded-2xl opacity-0 group-focus-within:opacity-20 blur transition duration-500"></div>
                            <div className="relative flex items-center bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl overflow-hidden transition-all duration-300 group-focus-within:border-[#2563EB]/50 group-focus-within:bg-white">
                                <input
                                    onChange={(e) => { setPassword(e.target.value) }}
                                    type="password"
                                    id="password"
                                    className="w-full bg-transparent px-5 pt-8 pb-3 text-[#1F2937] font-bold focus:outline-none peer"
                                    placeholder=" "
                                    required
                                />
                                <label htmlFor="password" className="absolute left-5 top-4 text-xs font-bold text-gray-400 uppercase tracking-widest transition-all peer-placeholder-shown:top-5 peer-placeholder-shown:text-sm peer-placeholder-shown:normal-case peer-focus:top-2 peer-focus:text-[10px] peer-focus:text-[#2563EB] peer-focus:uppercase">
                                    Password
                                </label>
                            </div>
                        </div>

                        {error && (
                            <div className="text-sm font-bold text-rose-600 bg-rose-50 border border-rose-100 px-4 py-3 rounded-xl flex items-center gap-3">
                                <div className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                                {error}
                            </div>
                        )}

                        <div className="pt-4">
                            <button className="w-full bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-lg rounded-2xl py-4 transition-all hover:scale-[1.02] shadow-[0_10px_30px_rgba(37,99,235,0.2)] hover:shadow-[0_15px_40px_rgba(37,99,235,0.3)] flex items-center justify-center gap-2 group">
                                Create Account
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    </form>

                    <p className="text-gray-500 text-center mt-10 font-medium">
                        Already have an account?{' '}
                        <Link to={"/login"} className="text-[#1F2937] hover:text-[#2563EB] font-bold transition-colors underline underline-offset-4 decoration-gray-300 hover:decoration-[#2563EB]">
                            Sign in instead
                        </Link>
                    </p>
                </div>
            </div>

            {/* RIGHT SIDE: Dark Sidebar Background + Animated Panels */}
            <div className="hidden lg:flex w-[55%] h-full relative items-center justify-center overflow-hidden bg-gradient-to-b from-[#0A192F] to-[#11264a]">

                {/* Dark Tech Grid */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#3b82f615_1px,transparent_1px),linear-gradient(to_bottom,#3b82f615_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none z-0" />

                {/* Animated Glows */}
                <div className="absolute top-[15%] left-[20%] w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] mix-blend-screen pointer-events-none animate-[pulse_6s_ease-in-out_infinite]" />
                <div className="absolute bottom-[15%] right-[10%] w-[400px] h-[400px] bg-indigo-500/20 rounded-full blur-[120px] mix-blend-screen pointer-events-none animate-[pulse_8s_ease-in-out_infinite_reverse]" />

                <div className="relative z-10 w-full max-w-2xl px-12">

                    <div className="mb-12">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 shadow-sm backdrop-blur-md mb-6">
                            <Sparkles className="w-4 h-4 text-blue-400" />
                            <span className="text-sm font-bold text-gray-300">Welcome to JobFit AI</span>
                        </div>
                        <h2 className="text-5xl xl:text-6xl font-black text-white tracking-tighter leading-[1.1]">
                            Your Dream Job.<br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2563EB] via-indigo-500 to-[#2563EB] bg-[length:200%_auto] animate-gradient">Just one mock away.</span>
                        </h2>
                    </div>

                    {/* Floating Dark Glass Panels */}
                    <div className="relative h-[320px] w-full perspective-1000 mt-8">

                        {/* Primary Panel */}
                        <div className="absolute top-0 right-4 w-[360px] bg-white/5 border border-white/10 backdrop-blur-2xl p-6 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] transform -rotate-2 hover:rotate-0 transition-transform duration-500 animate-[bounce_5s_ease-in-out_infinite] z-20">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center border border-blue-500/30">
                                        <Target className="w-5 h-5 text-blue-400" />
                                    </div>
                                    <div>
                                        <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">Target Role</div>
                                        <div className="text-sm font-bold text-white">Frontend Developer</div>
                                    </div>
                                </div>
                                <div className="px-3 py-1 bg-emerald-500/20 text-emerald-400 text-xs font-black rounded-full border border-emerald-500/30">
                                    READY
                                </div>
                            </div>
                            <div className="space-y-3">
                                <div>
                                    <div className="flex justify-between text-[10px] font-bold text-gray-400 uppercase mb-1.5"><span>Technical Skills</span><span>95%</span></div>
                                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden"><div className="h-full bg-gradient-to-r from-blue-500 to-emerald-400 w-[95%]" /></div>
                                </div>
                                <div>
                                    <div className="flex justify-between text-[10px] font-bold text-gray-400 uppercase mb-1.5"><span>Communication</span><span>88%</span></div>
                                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden"><div className="h-full bg-gradient-to-r from-blue-500 to-indigo-400 w-[88%]" /></div>
                                </div>
                            </div>
                        </div>

                        {/* Secondary Panel */}
                        <div className="absolute top-36 left-4 w-[320px] bg-white/5 border border-white/10 backdrop-blur-2xl p-6 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] transform rotate-3 hover:rotate-0 transition-transform duration-500 animate-[bounce_6s_ease-in-out_infinite_reverse] z-10">
                            <div className="flex gap-4">
                                <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex flex-shrink-0 items-center justify-center border border-purple-500/30">
                                    <BrainCircuit className="w-6 h-6 text-purple-400" />
                                </div>
                                <div>
                                    <div className="text-xs font-black text-gray-400 uppercase tracking-widest">AI Interviewer</div>
                                    <div className="text-sm text-gray-300 mt-2 font-medium leading-relaxed">Excellent explanation of React hooks. Let's move on to the next question.</div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </main>
    )
}

export default Register