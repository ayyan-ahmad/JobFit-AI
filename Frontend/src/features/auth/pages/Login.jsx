import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router'
import { useAuth } from '../hooks/useAuth'
// Mail aur Lock icons ko import kiya responsive look ke liye
import { LogIn, Loader2, Mail, Lock } from 'lucide-react'

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
        <main className="min-h-screen w-full flex items-center justify-center bg-[#0B0F19] relative overflow-hidden px-4 py-8">

            {/* Background Grid Structure */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#37415130_1px,transparent_1px),linear-gradient(to_bottom,#37415130_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_50%,#000_85%,transparent_100%)] pointer-events-none" />

            {/* Ambient Background Glows - Reduced size to prevent screen overflow */}
            <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-indigo-600/15 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-purple-600/15 rounded-full blur-[100px] pointer-events-none" />

            {/* Optimized Card Layout: max-w-md kiya aur padding tight ki taaki laptop screen me fit aaye */}
            <div className="w-full max-w-md bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] rounded-2xl p-6 sm:p-8 shadow-2xl relative z-10">

                {/* Header Section: Reduced margins and icon sizes */}
                <div className="flex flex-col items-center mb-6">
                    <div className="p-2.5 bg-indigo-500/10 rounded-xl border border-indigo-500/20 text-indigo-400 mb-3">
                        <LogIn className="w-6 h-6" />
                    </div>
                    <h1 className="text-2xl font-extrabold text-white tracking-tight">Welcome Back</h1>
                    <p className="text-xs text-gray-400 mt-1">Enter your details to sign in</p>
                </div>

                {/* Form: space-y-5 kiya taaki vertical height choti ho */}
                <form onSubmit={handleSubmit} className="space-y-5">

                    {/* Email Field */}
                    <div className="space-y-2">
                        <label htmlFor="email" className="text-sm font-medium text-gray-200 block">Email Address</label>
                        <div className="relative flex items-center">
                            <span className="absolute left-4 text-gray-400 pointer-events-none">
                                <Mail className="w-4 h-4" />
                            </span>
                            <input
                                onChange={(e) => { setEmail(e.target.value) }}
                                type="email"
                                id="email"
                                name='email'
                                placeholder='Enter email address'
                                // py-3 aur text-sm se form clean aur short lagega
                                className="w-full pl-11 pr-4 py-3 bg-black/20 border border-white/[0.1] rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all duration-200"
                                required
                            />
                        </div>
                    </div>

                    {/* Password Field */}
                    <div className="space-y-2">
                        <label htmlFor="password" className="text-sm font-medium text-gray-200 block">Password</label>
                        <div className="relative flex items-center">
                            <span className="absolute left-4 text-gray-400 pointer-events-none">
                                <Lock className="w-4 h-4" />
                            </span>
                            <input
                                onChange={(e) => { setPassword(e.target.value) }}
                                type="password"
                                id="password"
                                name='password'
                                placeholder='Enter password'
                                className="w-full pl-11 pr-4 py-3 bg-black/20 border border-white/[0.1] rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all duration-200"
                                required
                            />
                        </div>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <p className="text-xs font-medium text-rose-500 bg-rose-500/10 border border-rose-500/20 rounded-xl py-2.5 px-3 text-center">
                            {error}
                        </p>
                    )}

                    {/* Balanced Login Button */}
                    <button className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-sm text-white font-bold rounded-xl shadow-lg shadow-indigo-600/10 hover:shadow-indigo-500/20 transition-all duration-200 active:scale-[0.99] pt-1">
                        Login
                    </button>
                </form>

                {/* Footer Link */}
                <p className="text-sm text-gray-400 text-center mt-6">
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