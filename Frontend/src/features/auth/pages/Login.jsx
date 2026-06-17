import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router'
import { useAuth } from '../hooks/useAuth'
import { LogIn, Loader2 } from 'lucide-react'

const Login = () => {
    const { loading, handleLogin } = useAuth()
    const navigate = useNavigate()

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError("")
        try {
            const data = await handleLogin({ email, password })
            if (data && data.user) {
                navigate('/')
            } else {
                setError("Invalid email or password.")
            }
        } catch (err) {
            setError("Invalid email or password.")
        }
    }

    if (loading) {
        return (
            <main className="min-h-screen w-full flex flex-col items-center justify-center bg-[#0B0F19] text-white">
                <Loader2 className="w-12 h-12 animate-spin text-indigo-500 mb-4" />
                <h1 className="text-2xl font-medium tracking-wide">Loading...</h1>
            </main>
        )
    }

    return (
        <main className="min-h-screen w-full flex items-center justify-center bg-[#0B0F19] relative overflow-hidden px-4">

            {/* Background Grid Structure */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#37415130_1px,transparent_1px),linear-gradient(to_bottom,#37415130_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_50%,#000_85%,transparent_100%)] pointer-events-none" />

            {/* Ambient Background Glows */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/15 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/15 rounded-full blur-[120px] pointer-events-none" />

            {/* Premium Large Card: Padding badha kar p-12 kiya hai taaki balanced lage */}
            <div className="w-full max-w-xl bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] rounded-2xl p-12 shadow-2xl relative z-10">

                {/* Header Section: Fonts bade kiye aur spacing set ki */}
                <div className="flex flex-col items-center mb-10">
                    <div className="p-3.5 bg-indigo-500/10 rounded-xl border border-indigo-500/20 text-indigo-400 mb-4">
                        <LogIn className="w-8 h-8" />
                    </div>
                    <h1 className="text-4xl font-extrabold text-white tracking-tight">Welcome Back</h1>
                    <p className="text-base text-gray-400 mt-2">Enter your details to sign in</p>
                </div>

                {/* Form: Space-y-8 kiya hai taaki elements pure card par fail kar khali gap bhar dein */}
                <form onSubmit={handleSubmit} className="space-y-8">

                    {/* Email Field */}
                    <div className="space-y-3">
                        <label htmlFor="email" className="text-lg font-medium p-2 text-gray-200 block">Email Address</label>
                        <div className="relative flex items-center">
                            <span className="absolute left-4 text-gray-400 pointer-events-none">

                            </span>
                            <input
                                onChange={(e) => { setEmail(e.target.value) }}
                                type="email"
                                id="email"
                                name='email'
                                placeholder='Enter email address'
                                // py-4 aur text-lg se input bada aur khula-khula lagega
                                className="w-full pl-12 pr-4 py-4 bg-black/20 border border-white/[0.1] rounded-xl text-lg text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all duration-200"
                                required
                            />
                        </div>
                    </div>

                    {/* Password Field */}
                    <div className="space-y-3">
                        <label htmlFor="password" className="text-lg font-medium text-gray-200 block">Password</label>
                        <div className="relative flex items-center">
                            <span className="absolute left-4 text-gray-400 pointer-events-none">

                            </span>
                            <input
                                onChange={(e) => { setPassword(e.target.value) }}
                                type="password"
                                id="password"
                                name='password'
                                placeholder='Enter password'
                                className="w-full pl-12 pr-4 py-4 bg-black/20 border border-white/[0.1] rounded-xl text-lg text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all duration-200"
                                required
                            />
                        </div>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <p className="text-base font-medium text-rose-500 bg-rose-500/10 border border-rose-500/20 rounded-xl py-3 px-4 text-center">
                            {error}
                        </p>
                    )}

                    {/* Bigger, Bold, Beautiful Login Button */}
                    <button className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-lg text-white font-bold rounded-xl shadow-lg shadow-indigo-600/10 hover:shadow-indigo-500/20 transition-all duration-200 active:scale-[0.99] mt-2">
                        Login
                    </button>
                </form>

                {/* Footer Link */}
                <p className="text-lg text-gray-400 text-center mt-10">
                    Don't have an account?{' '}
                    <Link to={"/register"} className="text-indigo-400 hover:text-indigo-300 font-medium underline underline-offset-4 transition-colors">
                        Register
                    </Link>
                </p>
            </div>
        </main>
    )
}

export default Login