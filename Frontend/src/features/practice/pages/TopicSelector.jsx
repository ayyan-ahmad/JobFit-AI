import React, { useState } from "react";
import AVAILABLE_TOPICS from "../data/topics.data";
import { startPracticeSession } from "../services/practice.api";

const TopicSelector = ({ onSessionStarted }) => {
  const [selectedTopics, setSelectedTopics] = useState([]);
  const [topicDifficulties, setTopicDifficulties] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleTopicToggle = (topicId) => {
    if (selectedTopics.includes(topicId)) {
      setSelectedTopics(selectedTopics.filter((t) => t !== topicId));
      // Optionally, we could clean up topicDifficulties[topicId] here
    } else {
      setSelectedTopics([...selectedTopics, topicId]);
      setTopicDifficulties(prev => ({ ...prev, [topicId]: 'medium' }));
    }
  };

  const handleDifficultyChange = (topicId, level) => {
    setTopicDifficulties(prev => ({ ...prev, [topicId]: level }));
  };

  const handleStartSession = async () => {
    if (selectedTopics.length === 0) {
      setError("Bhai, kam se kam ek topic toh select karo practice ke liye!");
      return;
    }
    setError("");
    setLoading(true);

    try {
      const topicsWithDifficulty = selectedTopics.map(topicId => ({
        topic: topicId,
        difficulty: topicDifficulties[topicId] || 'medium'
      }));
      const data = await startPracticeSession(topicsWithDifficulty);

      if (data.success) {
        onSessionStarted({
          sessionId: data.sessionId,
          questions: data.questions,
        });
      }
    } catch (err) {
      console.error(err);
      let finalMsg = err.response?.data?.error || err.response?.data?.message || err.message || "Backend server se temporary issue aa rha h.";
      try {
        const match = typeof finalMsg === 'string' && finalMsg.match(/\{.*\}/);
        if (match) {
          const parsed = JSON.parse(match[0]);
          if (parsed.error?.message) finalMsg = parsed.error.message;
        }
      } catch (e) { }
      setError(finalMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto my-10 p-8 bg-[#FFFFFF] rounded-2xl shadow-2xl border border-[#E2E8F0] backdrop-blur-xl">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-extrabold text-[#1F2937] tracking-tight">
          Custom Practice Simulator 🛠️
        </h2>
        <p className="text-[#6B7280] mt-2 text-sm">
          Select topics you want to practice. Gemini AI will instantly generate 10 unique mixed-type questions for you.
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl font-medium text-sm flex items-center gap-2">
          <span>⚠️</span> {error}
        </div>
      )}

      {/* Grid Layout for Extended 14 Topics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
        {AVAILABLE_TOPICS.map((topic) => {
          const isSelected = selectedTopics.includes(topic.id);
          return (
            <div
              key={topic.id}
              onClick={() => handleTopicToggle(topic.id)}
              className={`cursor-pointer p-5 rounded-2xl border transition-all duration-300 transform-gpu antialiased select-none flex flex-col gap-3 group relative overflow-hidden ${isSelected
                ? "border-[#2563EB] bg-gradient-to-br from-blue-50 to-blue-100/50 shadow-md shadow-blue-500/15 -translate-y-1"
                : "border-[#E2E8F0] bg-[#FFFFFF] hover:border-[#2563EB]/30 hover:shadow-xl hover:shadow-blue-500/5 hover:-translate-y-1"
                }`}
            >
              {/* Optional background glow on hover */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-blue-100/50 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              <div className="flex items-center justify-between mb-1 relative z-10">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl transition-all duration-300 ${isSelected ? 'bg-[#2563EB] text-white shadow-md shadow-blue-500/30 scale-105' : 'bg-slate-50 text-slate-600 group-hover:bg-blue-50 group-hover:text-[#2563EB]'}`}>
                  {topic.icon}
                </div>
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${isSelected
                  ? "bg-[#2563EB] border-[#2563EB] scale-110 shadow-sm"
                  : "border-slate-300 bg-slate-50 group-hover:border-[#2563EB]/40"
                  }`}>
                  {isSelected && <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                </div>
              </div>
              <div className="relative z-10 flex flex-col justify-between flex-1">
                <div>
                  <h3 className={`font-bold text-base transition-colors ${isSelected ? "text-[#1D4ED8]" : "text-[#1F2937] group-hover:text-[#2563EB]"}`}>{topic.name}</h3>
                  <p className="text-xs text-[#6B7280] mt-1 line-clamp-2 leading-relaxed font-medium">{topic.desc}</p>
                </div>
                
                {isSelected && (
                  <div className="mt-3 flex items-center justify-between bg-white/60 p-1.5 rounded-lg border border-blue-200/60 shadow-inner">
                     {['easy', 'medium', 'hard'].map(level => (
                        <button 
                           key={level}
                           onClick={(e) => { e.stopPropagation(); handleDifficultyChange(topic.id, level); }}
                           className={`text-[10px] px-2 py-1 rounded-md font-bold capitalize transition-all ${topicDifficulties[topic.id] === level ? 'bg-[#2563EB] text-white shadow-sm' : 'text-slate-500 hover:bg-slate-200/50'}`}
                        >
                           {level}
                        </button>
                     ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="text-center">
        <button
          onClick={handleStartSession}
          disabled={loading}
          className={`px-8 py-3.5 text-white font-bold rounded-xl shadow-lg text-md transition-all duration-200 w-full sm:w-auto ${loading
            ? "bg-[#2563EB]/50 cursor-not-allowed opacity-70"
            : "bg-[#2563EB] hover:bg-[#1D4ED8] hover:-translate-y-0.5 shadow-md"
            }`}
        >
          {loading ? "Generating 10 Mixed Questions..." : "Start Practice Test 🚀"}
        </button>
      </div>
    </div>
  );
};

export default TopicSelector;