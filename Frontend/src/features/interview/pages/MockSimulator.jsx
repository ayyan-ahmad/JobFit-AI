import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { evaluateMockInterview } from '../services/interview.api.js';
import { Play } from 'lucide-react';
import RingLoader from '../../../components/RingLoader';

const MockSimulator = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const activeQuestions = location.state?.questions || [
    { question: "What is the Virtual DOM in React, and how does it work?" },
    { question: "Explain the difference between let, const, and var in JavaScript." }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({}); // { index: "answer" }
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [isListening, setIsListening] = useState(false);

  const recognitionRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map((result) => result[0].transcript)
          .join("");

        setAnswers((prev) => ({
          ...prev,
          [currentIndex]: (prev[currentIndex] || "") + " " + transcript,
        }));
      };

      recognition.onend = () => setIsListening(false);
      recognitionRef.current = recognition;
    }
  }, [currentIndex]);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert("Speech recognition is not supported in this browser.");
      return;
    }
    if (isListening) {
      recognitionRef.current.stop();
    } else {
      setIsListening(true);
      recognitionRef.current.start();
    }
  };

  const handleTextChange = (e) => {
    setAnswers({
      ...answers,
      [currentIndex]: e.target.value,
    });
  };

  const submitInterview = async () => {
    setIsEvaluating(true);
    try {
      // Map back to array format for API
      const finalData = activeQuestions.map((q, i) => ({
        question: q.question,
        answer: answers[i] || ""
      }));
      
      const data = await evaluateMockInterview(finalData);
      if (data.resultId) {
        navigate(`/mock-result/${data.resultId}`);
      }
    } catch (error) {
      console.error("Evaluation Error:", error);
      let errorMsg = error?.response?.data?.error || error?.response?.data?.message || error?.message || "Failed to connect to the server.";
      try {
        const match = typeof errorMsg === 'string' && errorMsg.match(/\{.*\}/);
        if (match) {
          const parsed = JSON.parse(match[0]);
          if (parsed.error?.message) errorMsg = parsed.error.message;
        }
      } catch (e) { }
      alert(errorMsg);
      setIsEvaluating(false);
    }
  };

  // --- RENDER: 🎙️ LIVE INTERVIEW ROOM ---
  return (
    <div className="min-h-screen w-full bg-[#e0f2fe] text-[#1F2937] flex flex-col pt-8 relative overflow-x-hidden z-0">
      {/* Gamified Background Grid */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#6366f115_1px,transparent_1px),linear-gradient(to_bottom,#6366f115_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none z-0" />
      <div className="fixed inset-0 bg-gradient-to-b from-transparent via-[#e0f2fe]/20 to-[#e0f2fe]/90 pointer-events-none z-0" />

      {/* Ambient Background Glows */}
      <div className="fixed top-6 left-1/2 -translate-x-1/2 w-[500px] h-[250px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none z-0" />
      <div className="fixed top-1/3 right-10 w-80 h-80 bg-purple-600/10 rounded-full blur-[110px] pointer-events-none z-0" />

      <div className="relative z-10 w-full flex-1 flex flex-col px-4">
        <div className="max-w-3xl mx-auto w-full my-10 p-8 bg-[#FFFFFF] rounded-2xl shadow-2xl border border-[#E2E8F0] backdrop-blur-xl">
          
          {/* Header Progress Bar */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex gap-2">
                <span className="text-xs font-bold uppercase tracking-wider bg-rose-500/10 text-rose-500 border border-rose-500/20 px-3 py-1 rounded-full flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-rose-500 rounded-full animate-pulse"></span>
                  Live Interview
                </span>
            </div>
            <span className="text-sm font-semibold text-[#6B7280]">
              Question {currentIndex + 1} of {activeQuestions.length}
            </span>
          </div>

          <div className="w-full bg-slate-100 h-2 rounded-full mb-8 overflow-hidden">
            <div
              className="bg-indigo-500 h-2 rounded-full transition-all duration-300 shadow-[0_0_10px_rgba(99,102,241,0.5)]"
              style={{ width: `${((currentIndex + 1) / activeQuestions.length) * 100}%` }}
            ></div>
          </div>

          {/* Question Card */}
          <div className="mb-8">
            <span className="inline-block px-3 py-1 bg-[#2563EB] text-white text-[10px] font-black uppercase tracking-widest rounded-lg shadow-sm transform -rotate-2 mb-4">
              AI Question
            </span>
            <h3 className="text-xl md:text-2xl font-extrabold text-[#1F2937] leading-tight">
              {activeQuestions[currentIndex].question}
            </h3>
          </div>

          {/* 🛠️ Dynamic Input Interface Rendering */}
          <div className="mb-8 min-h-[200px]">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <button
                  onClick={toggleListening}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-bold text-sm transition-all duration-150 border shadow-sm ${isListening
                      ? "bg-rose-50 text-rose-500 border-rose-200 animate-pulse"
                      : "bg-[#FFFFFF] hover:bg-slate-50 text-[#1F2937] border-[#E2E8F0]"
                    }`}
                >
                  <span>{isListening ? "🛑 Stop Recording" : "🎤 Speak Answer"}</span>
                </button>
                {isListening && (
                  <div className="flex gap-1">
                    <span className="w-1.5 h-1.5 bg-rose-500 rounded-full animate-bounce"></span>
                    <span className="w-1.5 h-1.5 bg-rose-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                    <span className="w-1.5 h-1.5 bg-rose-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
                  </div>
                )}
              </div>

              <textarea
                value={answers[currentIndex] || ""}
                onChange={handleTextChange}
                rows={6}
                placeholder="Type your answer here or click the mic icon to speak..."
                className={`w-full p-5 bg-[#F8FAFC] border-2 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-[#2563EB] outline-none transition-all duration-200 resize-none text-[#1F2937] text-base md:text-lg custom-scrollbar shadow-inner ${isListening ? 'border-rose-300 bg-rose-50/30' : 'border-[#E2E8F0] hover:border-indigo-300'}`}
              />
            </div>
          </div>

          {/* Navigation Buttons Container */}
          <div className="flex justify-between items-center border-t border-[#E2E8F0] pt-6">
            <button
              onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
              disabled={currentIndex === 0}
              className={`px-5 py-2.5 font-bold rounded-lg text-sm transition-all duration-150 border ${currentIndex === 0
                  ? "bg-slate-50 text-[#9CA3AF] border-slate-100 cursor-not-allowed shadow-none"
                  : "bg-blue-50 hover:bg-blue-100 text-[#2563EB] border-blue-200 shadow-sm hover:shadow-md"
                }`}
            >
              ⬅️ Previous
            </button>

            {currentIndex < activeQuestions.length - 1 ? (
              <button
                onClick={() => setCurrentIndex((prev) => prev + 1)}
                className="px-6 py-2.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold rounded-lg text-sm shadow-md hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-150 hover:-translate-y-0.5"
              >
                Next Question ➡️
              </button>
            ) : (
              <button
                onClick={submitInterview}
                disabled={isEvaluating}
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg text-sm shadow-md hover:shadow-lg hover:shadow-emerald-500/30 transition-all duration-150 hover:-translate-y-0.5 flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isEvaluating ? "Analyzing..." : "Submit Interview 🏁"}
              </button>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default MockSimulator;