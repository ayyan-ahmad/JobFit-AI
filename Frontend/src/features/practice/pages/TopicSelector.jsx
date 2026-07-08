import React, { useState } from "react";
import AVAILABLE_TOPICS from "../data/topics.data";
import { startPracticeSession } from "../services/practice.api";

const TopicSelector = ({ onSessionStarted }) => {
  const [selectedTopics, setSelectedTopics] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleTopicToggle = (topicId) => {
    if (selectedTopics.includes(topicId)) {
      setSelectedTopics(selectedTopics.filter((t) => t !== topicId));
    } else {
      setSelectedTopics([...selectedTopics, topicId]);
    }
  };

  const handleStartSession = async () => {
    if (selectedTopics.length === 0) {
      setError("Bhai, kam se kam ek topic toh select karo practice ke liye!");
      return;
    }
    setError("");
    setLoading(true);

    try {
      const data = await startPracticeSession(selectedTopics);

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
      } catch (e) {}
      setError(finalMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto my-10 p-8 bg-white/[0.02] rounded-2xl shadow-2xl border border-white/[0.06] backdrop-blur-xl">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-extrabold text-white tracking-tight">
          Custom Practice Simulator 🛠️
        </h2>
        <p className="text-gray-400 mt-2 text-sm">
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
              className={`cursor-pointer p-5 rounded-xl border transition-all duration-200 transform hover:-translate-y-1 select-none flex flex-col gap-2 ${
                isSelected
                  ? "border-indigo-500 bg-indigo-500/10 shadow-[0_0_15px_rgba(99,102,241,0.15)]"
                  : "border-white/[0.06] bg-white/[0.02] hover:border-white/[0.14] hover:bg-white/[0.04]"
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-2xl drop-shadow-md">{topic.icon}</span>
                <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${
                  isSelected 
                    ? "bg-indigo-500 border-indigo-500" 
                    : "border-gray-600 bg-transparent"
                }`}>
                  {isSelected && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                </div>
              </div>
              <h3 className={`font-bold text-base transition-colors ${isSelected ? "text-indigo-300" : "text-gray-200"}`}>{topic.name}</h3>
              <p className="text-xs text-gray-400 mt-0.5 line-clamp-2 leading-relaxed">{topic.desc}</p>
            </div>
          );
        })}
      </div>

      <div className="text-center">
        <button
          onClick={handleStartSession}
          disabled={loading}
          className={`px-8 py-3.5 text-white font-bold rounded-xl shadow-lg text-md transition-all duration-200 w-full sm:w-auto ${
            loading 
              ? "bg-indigo-600/50 cursor-not-allowed opacity-70" 
              : "bg-indigo-600 hover:bg-indigo-500 hover:-translate-y-0.5 shadow-[0_0_20px_rgba(99,102,241,0.3)] hover:shadow-[0_0_30px_rgba(99,102,241,0.5)]"
          }`}
        >
          {loading ? "Generating 10 Mixed Questions..." : "Start Practice Test 🚀"}
        </button>
      </div>
    </div>
  );
};

export default TopicSelector;