import React, { useState, useEffect } from 'react';
import { fetchLeaderboard } from "../../practice/services/practice.api.js";
import { Trophy, Medal, Crown, ArrowLeft, Award, User as UserIcon } from 'lucide-react';
import { useNavigate } from 'react-router';
import RingLoader from '../../../components/RingLoader';

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
    return <RingLoader title="Loading Leaderboard..." subtitle="Fetching Global Standings" />
  }

  // Top 3 users alag se nikalne ke liye for Podium look
  const topThree = users.slice(0, 3);
  const restUsers = users.slice(3);

  // Helper for generating initial avatars
  const getInitial = (username) => {
    return username ? username.charAt(0).toUpperCase() : '?';
  };

  return (
    <div className="min-h-screen bg-[#e0f2fe] text-[#1F2937] p-6 md:p-12 relative overflow-hidden flex flex-col z-0">

      {/* Gamified Background Grid - Intensified */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#6366f125_1px,transparent_1px),linear-gradient(to_bottom,#6366f125_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none z-0" />
      <div className="fixed inset-0 bg-gradient-to-b from-transparent via-[#e0f2fe]/20 to-[#e0f2fe]/90 pointer-events-none z-0" />

      {/* Ambient Gamified Glows - Intensified */}
      <div className="fixed top-[-10%] left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-yellow-400/35 rounded-full blur-[120px] pointer-events-none z-0" />
      <div className="fixed top-[20%] left-[-10%] w-[500px] h-[500px] bg-blue-600/25 rounded-full blur-[100px] pointer-events-none z-0" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-purple-500/25 rounded-full blur-[120px] pointer-events-none z-0" />

      <div className="relative z-10 w-full max-w-5xl mx-auto flex flex-col flex-1">
        {/* Header section */}
        <div className="flex flex-col items-center justify-center text-center mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <button onClick={() => navigate(-1)} className="absolute left-0 top-0 md:top-2 p-2 text-[#6B7280] hover:text-[#1F2937] hover:bg-white/50 rounded-xl transition-all shadow-sm bg-white/30 backdrop-blur-md border border-white/50">
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-[#2563EB] mb-4 shadow-sm mt-8 md:mt-0">
            <Trophy className="w-3 h-3 text-yellow-500" />
            <span className="text-[10px] font-bold uppercase tracking-widest">Global Rankings</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-extrabold text-[#1F2937] tracking-tight leading-tight">
            Hall of <span className="inline-block ml-1 px-4 py-1 bg-[#2563EB] text-white rounded-xl shadow-lg shadow-blue-500/30 transform -rotate-2 hover:rotate-0 hover:scale-105 transition-all duration-300 cursor-default">Fame</span>
          </h1>
          <p className="text-[#4B5563] text-sm md:text-base mt-3 max-w-lg font-medium mx-auto">See where you stand among the top developers worldwide.</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-xl mb-6 text-center text-sm font-medium shadow-sm animate-in fade-in">
            {error}
          </div>
        )}

        {/* 🏆 TOP 3 PODIUM DISPLAY */}
        {topThree.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 items-end max-w-4xl mx-auto relative z-10 w-full animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100 fill-mode-both">

            {/* Rank 2 (Silver) */}
            {topThree[1] && (
              <div className="bg-[#FFFFFF] border border-[#E2E8F0] hover:border-slate-300 p-6 rounded-3xl flex flex-col items-center order-2 md:order-1 h-56 justify-center relative transition-all duration-300 hover:-translate-y-2 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] group">
                <Medal className="w-10 h-10 text-slate-400 absolute -top-5 drop-shadow-md group-hover:scale-110 transition-transform" />
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 border-2 border-white shadow-md flex items-center justify-center mb-3">
                  <span className="text-2xl font-black text-slate-500">{getInitial(topThree[1].username)}</span>
                </div>
                <h3 className="text-lg font-bold truncate w-full text-center text-[#1F2937] group-hover:text-[#2563EB] transition-colors">{topThree[1].username || "Unknown"}</h3>
                <p className="text-slate-600 font-extrabold mt-1 text-xl">{topThree[1].totalPoints} <span className="text-xs text-slate-400 font-medium">Pts</span></p>
                <span className="text-[10px] text-[#6B7280] mt-2 font-bold uppercase tracking-wider bg-slate-50 px-2 py-1 rounded-lg">{topThree[1].practiceSessionsCompleted || 0} Sessions</span>
              </div>
            )}

            {/* Rank 1 (Gold - Champion) */}
            {topThree[0] && (
              <div className="bg-gradient-to-b from-[#FEFCE8] to-[#FFFFFF] border-2 border-yellow-400/50 hover:border-yellow-400 p-8 rounded-3xl flex flex-col items-center order-1 md:order-2 h-64 justify-center relative shadow-[0_12px_40px_rgba(234,179,8,0.15)] hover:shadow-[0_20px_50px_rgba(234,179,8,0.25)] transition-all duration-300 hover:-translate-y-2 z-10 group">
                <Crown className="w-14 h-14 text-yellow-500 absolute -top-8 animate-bounce drop-shadow-[0_0_15px_rgba(234,179,8,0.4)]" />
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-yellow-300 to-yellow-500 border-4 border-white shadow-lg flex items-center justify-center mb-4 relative">
                  <div className="absolute inset-0 rounded-full bg-yellow-400 blur-md opacity-40 group-hover:opacity-70 transition-opacity" />
                  <span className="text-3xl font-black text-white relative z-10 drop-shadow-md">{getInitial(topThree[0].username)}</span>
                </div>
                <h3 className="text-2xl font-black truncate w-full text-center text-[#1F2937] group-hover:text-yellow-600 transition-colors">{topThree[0].username || "Unknown"}</h3>
                <p className="text-3xl font-black text-yellow-600 mt-1 drop-shadow-sm">{topThree[0].totalPoints} <span className="text-sm text-yellow-500 font-medium">Pts</span></p>
                <span className="text-[10px] text-yellow-600/80 mt-2 font-bold uppercase tracking-wider bg-yellow-500/10 px-3 py-1 rounded-full">{topThree[0].practiceSessionsCompleted || 0} Sessions</span>
              </div>
            )}

            {/* Rank 3 (Bronze) */}
            {topThree[2] && (
              <div className="bg-[#FFFFFF] border border-[#E2E8F0] hover:border-amber-300/60 p-6 rounded-3xl flex flex-col items-center order-3 h-52 justify-center relative transition-all duration-300 hover:-translate-y-2 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] group">
                <Award className="w-10 h-10 text-amber-500 absolute -top-5 drop-shadow-md group-hover:scale-110 transition-transform" />
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-100 to-amber-200 border-2 border-white shadow-md flex items-center justify-center mb-3">
                  <span className="text-2xl font-black text-amber-700">{getInitial(topThree[2].username)}</span>
                </div>
                <h3 className="text-lg font-bold truncate w-full text-center text-[#1F2937] group-hover:text-amber-600 transition-colors">{topThree[2].username || "Unknown"}</h3>
                <p className="text-amber-600 font-extrabold mt-1 text-xl">{topThree[2].totalPoints} <span className="text-xs text-amber-500/70 font-medium">Pts</span></p>
                <span className="text-[10px] text-[#6B7280] mt-2 font-bold uppercase tracking-wider bg-amber-50 px-2 py-1 rounded-lg">{topThree[2].practiceSessionsCompleted || 0} Sessions</span>
              </div>
            )}
          </div>
        )}

        {/* 📋 REST OF THE USERS LIST */}
        <div className="max-w-4xl mx-auto w-full bg-[#FFFFFF] border border-[#E2E8F0] rounded-3xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative z-10 mb-8 flex-1 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300 fill-mode-both">
          <div className="grid grid-cols-12 p-4 md:p-6 border-b border-[#E2E8F0] bg-[#F8FAFC] text-[#6B7280] text-[10px] font-bold uppercase tracking-widest sticky top-0 z-10 shadow-sm">
            <div className="col-span-2 text-center">Rank</div>
            <div className="col-span-6">Developer</div>
            <div className="col-span-2 text-center hidden sm:block">Sessions</div>
            <div className="col-span-4 sm:col-span-2 text-right pr-4">Points</div>
          </div>

          {restUsers.length === 0 && topThree.length <= 3 && restUsers.length === 0 && (
            <div className="p-12 text-center flex flex-col items-center justify-center">
              <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                <UserIcon className="w-8 h-8 text-blue-200" />
              </div>
              <p className="text-[#6B7280] text-sm font-medium">No more developers listed yet. Keep practicing to climb the ranks!</p>
            </div>
          )}

          <div className="divide-y divide-[#E2E8F0]">
            {restUsers.map((user, index) => (
              <div key={user._id} className="grid grid-cols-12 p-4 md:p-5 items-center transition-all duration-200 text-sm hover:bg-slate-50 group cursor-default">
                <div className="col-span-2 text-center font-bold text-[#6B7280]">
                  #{index + 4}
                </div>
                <div className="col-span-6 font-bold text-[#1F2937] flex items-center gap-3 pr-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-100 to-blue-100 text-[#2563EB] flex items-center justify-center flex-shrink-0 text-xs font-black shadow-sm">
                    {getInitial(user.username)}
                  </div>
                  <span className="truncate group-hover:text-[#2563EB] transition-colors">{user.username || "Unknown Developer"}</span>
                </div>
                <div className="col-span-2 flex justify-center hidden sm:flex">
                   <span className="px-2.5 py-1 bg-slate-100 text-[#4B5563] text-xs font-semibold rounded-md border border-[#E2E8F0]">
                      {user.practiceSessionsCompleted || 0}
                   </span>
                </div>
                <div className="col-span-4 sm:col-span-2 flex justify-end pr-4">
                   <span className="px-3 py-1 bg-blue-50 text-[#2563EB] text-xs font-black rounded-lg border border-blue-100 shadow-sm">
                      {user.totalPoints}
                   </span>
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