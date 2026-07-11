import React from "react";

const PracticeScoreboard = ({ evaluationData, detailedBreakdown, questions, onReset }) => {
  const score = evaluationData?.totalScore || 0;
  const feedback = evaluationData?.overallFeedback || "Test completed successfully!";

  return (
    <div className="max-w-4xl mx-auto my-10 p-8 bg-[#FFFFFF] rounded-3xl shadow-xl shadow-black/5 border border-[#E2E8F0] animate-fadeIn">
      {/* Top Banner / Circular Score */}
      <div className="text-center mb-12 pb-10 border-b border-[#E2E8F0]">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 shadow-sm mb-6">
          <span className="text-sm font-bold text-[#2563EB]">Test Completed Successfully</span>
        </div>
        <h2 className="text-4xl md:text-5xl font-extrabold text-[#1F2937] tracking-tight mb-8 leading-snug">
          Performance <span className="inline-block ml-1 px-4 py-1 bg-[#2563EB] text-white rounded-xl shadow-lg shadow-blue-500/30 transform -rotate-2 hover:rotate-0 hover:scale-105 transition-all duration-300 cursor-default">Scorecard </span>
        </h2>

        {/* Advanced Score Ring */}
        <div className="relative inline-flex items-center justify-center w-40 h-40 rounded-full bg-[#FFFFFF] border-8 border-slate-50 mb-4 shadow-[0_20px_50px_rgba(0,0,0,0.05)] group hover:scale-105 transition-transform duration-500">
          <div className="absolute inset-[-8px] rounded-full border-8 border-[#2563EB] border-t-indigo-400 border-l-blue-300 transform rotate-45 group-hover:rotate-180 transition-all duration-1000 ease-in-out shadow-[0_0_30px_rgba(37,99,235,0.3)]" />
          <div className="text-center relative z-10">
            <span className="text-5xl font-black text-[#1F2937]">{score}</span>
            <span className="text-[#6B7280] block text-sm font-extrabold uppercase tracking-widest mt-1">out of 10</span>
          </div>
        </div>

        {/* Global Evaluation Summary */}
        <div className="max-w-2xl mx-auto p-5 bg-[#FFFFFF] rounded-2xl border border-[#E2E8F0] mt-4 shadow-md shadow-black/5">
          <p className="text-[#1F2937] text-sm font-medium leading-relaxed">
            <span className="font-bold text-[#2563EB] block mb-1">Gemini AI Feedback</span> "{feedback}"
          </p>
        </div>
      </div>

      {/* Question-wise Breakdown List */}
      <div className="space-y-6 mb-8">
        <h3 className="text-2xl font-extrabold text-[#1F2937] flex items-center mb-8 leading-snug">
          <span>Detailed Review Breakdown 📑</span>
        </h3>

        {questions.map((q, idx) => {
          // Backend breakdown se is question ka result match karo
          const result = detailedBreakdown?.find((item) => item.questionId === q.id) || {};
          const isCorrect = result.isCorrect;
          const individualScore = result.score !== undefined ? result.score : (isCorrect ? 1 : 0);

          return (
            <div
              key={q.id}
              className={`p-6 rounded-2xl border transition-all duration-150 ${q.type === "subjective"
                ? "border-[#E2E8F0] bg-[#FFFFFF]"
                : individualScore > 0
                  ? "border-emerald-200 bg-emerald-50"
                  : "border-rose-200 bg-rose-50"
                }`}
            >
              {/* Question Header Status */}
              <div className="flex items-start justify-between gap-4 mb-6">
                <h4 className="font-bold text-[#1F2937] text-base leading-relaxed flex-1">
                  <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-[#2563EB] text-white text-xs mr-2 shadow-sm font-black">Q{idx + 1}</span>
                  <span className="text-[10px] font-extrabold text-[#2563EB] uppercase tracking-widest px-2.5 py-1 bg-blue-50 rounded-lg border border-blue-100 mr-2">{q.topic}</span>
                  {q.question}
                </h4>

                {q.type !== "subjective" && (
                  <span className={`text-[10px] font-extrabold uppercase px-3 py-1.5 rounded-xl border tracking-widest whitespace-nowrap shadow-sm flex items-center gap-1 ${individualScore > 0
                    ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                    : "bg-rose-500/10 text-rose-600 border-rose-500/20"
                    }`}>
                    {individualScore > 0 ? `✔️ Correct (${individualScore} Marks)` : "❌ Incorrect (0 Marks)"}
                  </span>
                )}
                {q.type === "subjective" && (
                  <span className="text-[10px] font-extrabold uppercase bg-blue-500/10 text-[#2563EB] border border-blue-500/20 px-3 py-1.5 rounded-xl tracking-widest whitespace-nowrap shadow-sm flex items-center gap-1">
                    🎙️ Subjective {individualScore > 0 ? `(${individualScore} Marks)` : "(0 Marks)"}
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* User's Answer */}
                <div className="text-xs bg-slate-50/80 border border-[#E2E8F0] p-5 rounded-2xl text-[#6B7280] shadow-sm transition-all hover:shadow-md hover:bg-white">
                  <div className="inline-block px-2.5 py-1 bg-slate-200/50 rounded uppercase tracking-widest font-black text-[9px] text-slate-500 mb-3 border border-slate-200">Your Answer</div>
                  <div className="text-[#1F2937] font-mono leading-relaxed">{Array.isArray(result.answer) ? result.answer.join(", ") : result.answer || "Left Blank / No response"}</div>
                </div>

                {/* AI Dynamic Analysis Explanation */}
                <div className={`text-xs p-5 rounded-2xl text-[#1F2937] border leading-relaxed shadow-sm transition-all hover:shadow-md ${isCorrect ? 'bg-emerald-50/50 border-emerald-100 hover:bg-emerald-50' : q.type === 'subjective' ? 'bg-blue-50/50 border-blue-100 hover:bg-blue-50' : 'bg-rose-50/50 border-rose-100 hover:bg-rose-50'}`}>
                  <div className={`inline-block px-2.5 py-1 rounded uppercase tracking-widest font-black text-[9px] mb-3 border ${isCorrect ? 'bg-emerald-100 text-emerald-600 border-emerald-200' : q.type === 'subjective' ? 'bg-blue-100 text-[#2563EB] border-blue-200' : 'bg-rose-100 text-rose-600 border-rose-200'}`}>AI Analysis</div>
                  <div>{result.feedback || "AI analysis couldn't process."}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Back to Home / Retry Button */}
      <div className="text-center pt-4">
        <button
          onClick={onReset}
          className="px-8 py-3.5 bg-[#2563EB] hover:bg-[#1D4ED8] border border-transparent text-white font-bold rounded-xl shadow-lg transition-all duration-200 text-sm hover:-translate-y-0.5"
        >
          🔄 Another Practice Session
        </button>
      </div>
    </div>
  );
};

export default PracticeScoreboard;