import React from 'react';

const RingLoader = ({ title = "Loading...", subtitle = "Please wait a moment..." }) => {
    return (
        <main className="min-h-screen w-full flex flex-col items-center justify-center bg-[#0B0F19] text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#37415120_1px,transparent_1px),linear-gradient(to_bottom,#37415120_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_45%,#000_85%,transparent_100%)] pointer-events-none" />
            <div className="absolute top-6 left-1/2 -translate-x-1/2 w-[500px] h-[250px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />
            
            <div className="relative w-24 h-24 mb-8">
                <div className="absolute inset-0 border-t-4 border-indigo-500 rounded-full animate-spin"></div>
                {/* Fallback using standard Tailwind utilities if spin-slow doesn't exist */}
                <div className="absolute inset-2 border-r-4 border-emerald-500 rounded-full animate-spin" style={{ animationDuration: '3s' }}></div>
                <div className="absolute inset-4 border-b-4 border-purple-500 rounded-full animate-spin" style={{ animationDuration: '1.5s' }}></div>
            </div>
            
            <h1 className="text-2xl font-bold text-white mb-2 tracking-wide">{title}</h1>
            <p className="text-indigo-300/70 font-medium">{subtitle}</p>
        </main>
    );
};

export default RingLoader;
