import React, { useState, useEffect } from 'react';
import { fetchLeaderboard } from "../../practice/services/practice.api.js";
import { Trophy, Medal, Crown, Loader2, ArrowLeft, Award } from 'lucide-react';
import { useNavigate } from 'react-router';

const Leaderboard = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const getLeaderboardData = async () => {
            try {
                const response = await fetchLeaderboard();
                if (response.success) {
                    setUsers(response.data);
                }
            } catch (err) {
                setError("Leaderboard load karne mein koi dikkat aayi!");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        getLeaderboardData();
    }, []);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-[#0B0F19] text-white">
                <Loader2 className="w-10 h-10 animate-spin text-indigo-500 mb-4" />
                <p className="text-indigo-200/70 font-medium tracking-wide">Loading Global Standings...</p>
            </div>
        );
    }

    // Top 3 users alag se nikalne ke liye for Podium look
    const topThree = users.slice(0, 3);
    const restUsers = users.slice(3);

    return (
        <div className="min-h-screen bg-[#0B0F19] text-white p-6 md:p-12 relative overflow-hidden flex flex-col">
            {/* Background Grid Structure */}
            <div className="fixed inset-0 bg-[linear-gradient(to_right,#37415120_1px,transparent_1px),linear-gradient(to_bottom,#37415120_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_45%,#000_85%,transparent_100%)] pointer-events-none z-0" />
            <div className="fixed top-1/4 left-1/4 w-[500px] h-[300px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none z-0" />
            <div className="fixed bottom-1/4 right-1/4 w-[400px] h-[300px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none z-0" />

            <div className="relative z-10 w-full max-w-5xl mx-auto flex flex-col flex-1">
                {/* Header section */}
                <div className="flex items-center gap-4 mb-10">
                    <button onClick={() => navigate(-1)} className="p-2 text-gray-400 hover:text-white hover:bg-white/[0.05] rounded-xl transition border border-transparent hover:border-white/[0.05]">
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent flex items-center gap-2">
                        <Trophy className="text-yellow-500" /> Global Leaderboard
                    </h1>
                    <p className="text-gray-400 text-sm">See where you stand among top developers</p>
                </div>
            </div>

            {error && (
                <div className="bg-red-500/10 border border-red-500 text-red-400 p-4 rounded-lg mb-6 text-center">
                    {error}
                </div>
            )}

            {/* 🏆 TOP 3 PODIUM DISPLAY */}
            {topThree.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 items-end max-w-4xl mx-auto relative z-10 w-full mt-4">
                    {/* Rank 2 (Left or mid adjustment) */}
                    {topThree[1] && (
                        <div className="bg-white/[0.02] backdrop-blur-xl border border-white/[0.06] hover:border-white/[0.1] p-6 rounded-3xl flex flex-col items-center order-2 md:order-1 h-48 justify-center relative transition-all duration-300 hover:-translate-y-1 shadow-lg shadow-black/20">
                            <Medal className="w-10 h-10 text-slate-300 absolute -top-5 drop-shadow-md" />
                            <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest mt-2">Rank 2</span>
                            <h3 className="text-lg font-bold mt-2 truncate w-full text-center text-white">{topThree[1].username || "Unknown Developer"}</h3>
                            <p className="text-indigo-400 font-extrabold mt-1 text-xl">{topThree[1].totalPoints} <span className="text-xs text-indigo-500/70 font-medium">Pts</span></p>
                            <span className="text-[10px] text-gray-500 mt-2 font-semibold uppercase tracking-wider">{topThree[1].practiceSessionsCompleted || 0} Sessions</span>
                        </div>
                    )}

                    {/* Rank 1 (Center - Always Highlighted & Bigger) */}
                    {topThree[0] && (
                        <div className="bg-gradient-to-b from-yellow-500/10 to-white/[0.02] backdrop-blur-xl border border-yellow-500/30 hover:border-yellow-400/50 p-8 rounded-3xl flex flex-col items-center order-1 md:order-2 h-56 justify-center relative shadow-[0_0_40px_rgba(234,179,8,0.1)] hover:shadow-[0_0_50px_rgba(234,179,8,0.15)] transition-all duration-300 hover:-translate-y-1.5 z-10">
                            <Crown className="w-14 h-14 text-yellow-400 absolute -top-8 animate-bounce drop-shadow-[0_0_15px_rgba(250,204,21,0.5)]" />
                            <span className="text-[10px] font-black uppercase text-yellow-500 tracking-widest mt-3">Champion</span>
                            <h3 className="text-2xl font-black mt-2 truncate w-full text-center text-yellow-400 drop-shadow-sm">{topThree[0].username || "Unknown Developer"}</h3>
                            <p className="text-3xl font-black text-white mt-1 drop-shadow-md">{topThree[0].totalPoints} <span className="text-sm text-yellow-500/70 font-medium">Pts</span></p>
                            <span className="text-[10px] text-yellow-500/60 mt-2 font-semibold uppercase tracking-wider">{topThree[0].practiceSessionsCompleted || 0} Sessions</span>
                        </div>
                    )}

                    {/* Rank 3 (Right) */}
                    {topThree[2] && (
                        <div className="bg-white/[0.02] backdrop-blur-xl border border-white/[0.06] hover:border-white/[0.1] p-6 rounded-3xl flex flex-col items-center order-3 h-44 justify-center relative transition-all duration-300 hover:-translate-y-1 shadow-lg shadow-black/20">
                            <Award className="w-10 h-10 text-amber-600 absolute -top-5 drop-shadow-md" />
                            <span className="text-[10px] font-black uppercase text-amber-600/70 tracking-widest mt-2">Rank 3</span>
                            <h3 className="text-lg font-bold mt-2 truncate w-full text-center text-white">{topThree[2].username || "Unknown Developer"}</h3>
                            <p className="text-purple-400 font-extrabold mt-1 text-xl">{topThree[2].totalPoints} <span className="text-xs text-purple-500/70 font-medium">Pts</span></p>
                            <span className="text-[10px] text-gray-500 mt-2 font-semibold uppercase tracking-wider">{topThree[2].practiceSessionsCompleted || 0} Sessions</span>
                        </div>
                    )}
                </div>
            )}

            {/* 📋 REST OF THE USERS LIST */}
            <div className="max-w-4xl mx-auto w-full bg-white/[0.02] backdrop-blur-xl border border-white/[0.06] rounded-3xl overflow-hidden shadow-2xl relative z-10 mb-8 flex-1">
                <div className="grid grid-cols-12 p-4 md:p-5 border-b border-white/[0.06] bg-white/[0.02] text-gray-500 text-[10px] font-black uppercase tracking-widest sticky top-0 backdrop-blur-md">
                    <div className="col-span-2 text-center">Rank</div>
                    <div className="col-span-6">Developer</div>
                    <div className="col-span-2 text-center hidden sm:block">Sessions</div>
                    <div className="col-span-4 sm:col-span-2 text-right pr-4">Points</div>
                </div>

                {restUsers.length === 0 && topThree.length <= 3 && restUsers.length === 0 && (
                    <div className="p-12 text-center text-gray-500 text-sm font-medium">No more developers listed yet. Keep practicing!</div>
                )}

                <div className="divide-y divide-white/[0.04]">
                    {restUsers.map((user, index) => (
                        <div key={user._id} className="grid grid-cols-12 p-4 md:p-5 items-center hover:bg-white/[0.02] transition-colors duration-200 text-sm group">
                            <div className="col-span-2 text-center font-black text-gray-500 group-hover:text-gray-400 transition-colors">
                                #{index + 4}
                            </div>
                            <div className="col-span-6 font-bold text-gray-300 group-hover:text-white transition-colors truncate pr-2">
                                {user.username || "Unknown Developer"}
                            </div>
                            <div className="col-span-2 text-center text-gray-500 font-medium hidden sm:block">
                                {user.practiceSessionsCompleted || 0}
                            </div>
                            <div className="col-span-4 sm:col-span-2 text-right font-black text-indigo-400 pr-4">
                                {user.totalPoints}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            </div>
        </div>
    );
};

export default Leaderboard;