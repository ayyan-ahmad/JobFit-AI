import React from "react";

const PracticeScoreboard = ({ evaluationData, detailedBreakdown, questions, onReset }) => {
  const score = evaluationData?.totalScore || 0;
  const feedback = evaluationData?.overallFeedback || "Test completed successfully!";

  return (
    <div className="max-w-4xl mx-auto my-10 p-8 bg-white/[0.02] rounded-2xl shadow-2xl border border-white/[0.06] backdrop-blur-xl animate-fadeIn">
      {/* Top Banner / Circular Score */}
      <div className="text-center mb-10 pb-8 border-b border-white/[0.06]">
        <h2 className="text-4xl font-extrabold text-white tracking-tight mb-4">
          Performance Scorecard 📊
        </h2>
        
        {/* Score Ring */}
        <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-indigo-500/10 border-[6px] border-indigo-500 mb-4 shadow-[0_0_30px_rgba(99,102,241,0.3)]">
          <div className="text-center">
            <span className="text-4xl font-black text-indigo-400">{score}</span>
            <span className="text-indigo-500/50 block text-sm font-bold">/ 10</span>
          </div>
        </div>

        {/* Global Evaluation Summary */}
        <div className="max-w-2xl mx-auto p-5 bg-white/[0.02] rounded-xl border border-white/[0.06] mt-4 shadow-lg shadow-black/20">
          <p className="text-gray-300 text-sm font-medium leading-relaxed">
            <span className="font-bold text-indigo-400 block mb-1">Gemini AI Feedback</span> "{feedback}"
          </p>
        </div>
      </div>

      {/* Question-wise Breakdown List */}
      <div className="space-y-6 mb-8">
        <h3 className="text-xl font-bold text-white flex items-center mb-6">
          <span>Detailed Review Breakdown 📑</span>
        </h3>

        {questions.map((q, idx) => {
          // Backend breakdown se is question ka result match karo
          const result = detailedBreakdown?.find((item) => item.questionId === q.id) || {};
          const isCorrect = result.isCorrect;

          return (
            <div 
              key={q.id} 
              className={`p-6 rounded-xl border transition-all duration-150 ${
                q.type === "subjective"
                  ? "border-white/[0.1] bg-white/[0.02]"
                  : isCorrect
                  ? "border-emerald-500/30 bg-emerald-500/10"
                  : "border-rose-500/30 bg-rose-500/10"
              }`}
            >
              {/* Question Header Status */}
              <div className="flex items-start justify-between gap-4 mb-4">
                <h4 className="font-bold text-gray-200 text-base leading-relaxed">
                  Q{idx + 1}. <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">[{q.topic}]</span> {q.question}
                </h4>
                
                {q.type !== "subjective" && (
                  <span className={`text-[10px] font-extrabold uppercase px-3 py-1 rounded-full border tracking-wider whitespace-nowrap mt-1 ${
                    isCorrect 
                      ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.2)]" 
                      : "bg-rose-500/20 text-rose-400 border-rose-500/30 shadow-[0_0_10px_rgba(244,63,94,0.2)]"
                  }`}>
                    {isCorrect ? "✔️ Correct" : "❌ Incorrect"}
                  </span>
                )}
                {q.type === "subjective" && (
                  <span className="text-[10px] font-extrabold uppercase bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 px-3 py-1 rounded-full tracking-wider whitespace-nowrap mt-1 shadow-[0_0_10px_rgba(99,102,241,0.2)]">
                    🎙️ Subjective
                  </span>
                )}
              </div>

              {/* User's Answer */}
              <div className="text-xs bg-black/40 border border-white/[0.05] p-4 rounded-lg text-gray-400 mb-3 font-mono shadow-inner">
                <span className="font-bold text-gray-500 block mb-2 tracking-wider">YOUR SUBMITTED ANSWER:</span>
                <span className="text-gray-300">{Array.isArray(result.answer) ? result.answer.join(", ") : result.answer || "Left Blank / No response"}</span>
              </div>

              {/* AI Dynamic Analysis Explanation */}
              <div className="text-xs p-4 bg-indigo-500/5 rounded-lg text-indigo-200 border border-indigo-500/20 leading-relaxed shadow-sm">
                <span className="font-bold text-indigo-400 block mb-2 tracking-wider">ANALYSIS & IMPROVEMENT CHECK:</span>
                {result.feedback || "AI analysis couldn't process."}
              </div>
            </div>
          );
        })}
      </div>

      {/* Back to Home / Retry Button */}
      <div className="text-center pt-4">
        <button
          onClick={onReset}
          className="px-8 py-3.5 bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.1] text-white font-bold rounded-xl shadow-lg transition-all duration-200 text-sm hover:-translate-y-0.5"
        >
          🔄 Another Practice Session
        </button>
      </div>
    </div>
  );
};

export default PracticeScoreboard;