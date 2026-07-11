import React from 'react';
import { Cpu } from 'lucide-react';

const RingLoader = ({ title = "Loading...", subtitle = "Please wait a moment..." }) => {
  return (
    <div className="min-h-screen w-full bg-[#e0f2fe] text-[#1F2937] flex flex-col items-center justify-center overflow-hidden relative z-0">
      {/* Gamified Background Grid */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#6366f115_1px,transparent_1px),linear-gradient(to_bottom,#6366f115_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none z-0" />
      <div className="fixed inset-0 bg-gradient-to-b from-transparent via-[#e0f2fe]/20 to-[#e0f2fe]/90 pointer-events-none z-0" />

      {/* Ambient Background Glows */}
      <div className="fixed top-6 left-1/2 -translate-x-1/2 w-[500px] h-[250px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none z-0" />
      <div className="fixed top-1/3 right-10 w-80 h-80 bg-purple-600/10 rounded-full blur-[110px] pointer-events-none z-0" />

      {/* Premium AI Core Loader */}
      <div className="relative z-10 flex flex-col items-center justify-center mb-10">
        <div className="relative w-28 h-28 flex items-center justify-center">
            {/* Outer spinning dashed ring */}
            <div className="absolute inset-0 rounded-full border-4 border-dashed border-[#2563EB]/40 animate-[spin_4s_linear_infinite]" />
            
            {/* Middle reverse spinning ring */}
            <div className="absolute inset-2 rounded-full border border-emerald-400/60 animate-[spin_3s_linear_infinite_reverse]" />
            
            {/* Inner radar ping effect */}
            <div className="absolute inset-6 rounded-full bg-[#3B82F6] animate-ping opacity-30" />
            
            {/* Center Solid Glowing Core */}
            <div className="absolute inset-7 rounded-full bg-gradient-to-br from-[#2563EB] to-[#1D4ED8] shadow-[0_0_25px_rgba(37,99,235,0.5)] flex items-center justify-center z-10">
                <Cpu className="w-6 h-6 text-white animate-pulse" />
            </div>
        </div>
      </div>
      
      <h1 className="relative z-10 text-2xl md:text-3xl font-extrabold text-[#1F2937] mb-4 tracking-wide text-center">{title}</h1>
      <div className="relative z-10 bg-white/60 backdrop-blur-sm border border-[#E2E8F0] px-5 py-2 rounded-full shadow-sm">
        <p className="text-sm text-[#4B5563] font-bold tracking-wide animate-pulse">{subtitle}</p>
      </div>
    </div>
  );
};

export default RingLoader;
