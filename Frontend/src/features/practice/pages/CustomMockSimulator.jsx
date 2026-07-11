import React, { useState, useEffect, useRef } from "react";
import { evaluateSession } from "../services/practice.api";

const CustomMockSimulator = ({ sessionId, questions, onTestFinished }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({}); // Stores user answers: { [qId]: "text" or ["opt1", "opt2"] }
  const [isRecording, setIsRecording] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const recognitionRef = useRef(null);
  const currentQuestion = questions[currentIndex];

  // 🎤 Web Speech API Initialization (Purana Core Mic Code)
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = false;
      recognition.lang = "en-US";

      recognition.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map((result) => result[0].transcript)
          .join("");

        // Purane answer ke aage mic text append karega
        setAnswers((prev) => ({
          ...prev,
          [currentQuestion.id]: (prev[currentQuestion.id] || "") + " " + transcript,
        }));
      };

      recognition.onend = () => setIsRecording(false);
      recognitionRef.current = recognition;
    }
  }, [currentQuestion?.id]);

  // Mic Toggle Action
  const toggleRecording = () => {
    if (!recognitionRef.current) {
      alert("Bhai, tumhara browser speech recognition support nahi karta. Chrome use karo!");
      return;
    }
    if (isRecording) {
      recognitionRef.current.stop();
    } else {
      setIsRecording(true);
      recognitionRef.current.start();
    }
  };

  // 📝 Typing Input Handler (For Subjective)
  const handleTextChange = (e) => {
    setAnswers({
      ...answers,
      [currentQuestion.id]: e.target.value,
    });
  };

  // 🔘 MCQ Selection Handler (Single String)
  const handleMCQSelect = (option) => {
    setAnswers({
      ...answers,
      [currentQuestion.id]: option,
    });
  };

  // ☑️ MSQ Selection Handler (Array of Strings)
  const handleMSQSelect = (option) => {
    const currentSelections = answers[currentQuestion.id] || [];
    if (currentSelections.includes(option)) {
      // Uncheck workflow
      setAnswers({
        ...answers,
        [currentQuestion.id]: currentSelections.filter((item) => item !== option),
      });
    } else {
      // Check workflow
      setAnswers({
        ...answers,
        [currentQuestion.id]: [...currentSelections, option],
      });
    }
  };

  // 📤 Submit Whole Test to Backend
  const handleSubmitTest = async () => {
    setLoading(true);
    try {
      // Format answers according to the Mongoose Schema we created
      const formattedAnswers = questions.map((q) => ({
        questionId: q.id,
        answer: answers[q.id] || (q.type === "msq" ? [] : ""),
      }));

      const data = await evaluateSession(sessionId, formattedAnswers);

      if (data.success) {
        onTestFinished({
          evaluation: data.evaluation,
          detailedBreakdown: data.detailedBreakdown,
        });
      }
    } catch (err) {
      console.error(err);
      let finalMsg = err.response?.data?.error || err.response?.data?.message || err.message || "Evaluation submit karne mein error aayi.";
      try {
        const match = typeof finalMsg === 'string' && finalMsg.match(/\{.*\}/);
        if (match) {
          const parsed = JSON.parse(match[0]);
          if (parsed.error?.message) finalMsg = parsed.error.message;
        }
      } catch (e) {}
      setSubmitError(finalMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto my-10 p-8 bg-[#FFFFFF] rounded-2xl shadow-2xl border border-[#E2E8F0] backdrop-blur-xl">
      {submitError && (
        <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl font-medium text-sm flex items-center gap-2">
          <span>⚠️</span> {submitError}
        </div>
      )}
      
      {/* Header Progress Bar */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex gap-2">
            <span className="text-xs font-bold uppercase tracking-wider bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-3 py-1 rounded-full">
              Topic: {currentQuestion.topic.toUpperCase()}
            </span>
            {currentQuestion.difficulty && (
                <span className={`text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full border ${currentQuestion.difficulty.toLowerCase() === 'hard' ? 'bg-rose-500/10 text-rose-500 border-rose-500/20' : currentQuestion.difficulty.toLowerCase() === 'medium' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'}`}>
                    {currentQuestion.difficulty}
                </span>
            )}
        </div>
        <span className="text-sm font-semibold text-[#6B7280]">
          Question {currentIndex + 1} of {questions.length}
        </span>
      </div>

      <div className="w-full bg-white/[0.05] h-2 rounded-full mb-8">
        <div
          className="bg-indigo-500 h-2 rounded-full transition-all duration-300 shadow-[0_0_10px_rgba(99,102,241,0.5)]"
          style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
        ></div>
      </div>

      {/* Question Card */}
      <div className="mb-8">
        <h3 className="text-xl font-bold text-[#1F2937] mb-2">{currentQuestion.question}</h3>
        <p className="text-xs text-[#6B7280] italic">Intent: {currentQuestion.interviewerIntent}</p>
      </div>

      {/* 🛠️ Dynamic Input Interface Rendering */}
      <div className="mb-8 min-h-[200px]">
        {/* CASE 1: Subjective Question (Mic + Typing Textarea) */}
        {currentQuestion.type === "subjective" && (
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <button
                onClick={toggleRecording}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium text-sm transition-all duration-150 border ${isRecording
                    ? "bg-rose-500/20 text-rose-400 border-rose-500/30 animate-pulse shadow-[0_0_15px_rgba(244,63,94,0.2)]"
                    : "bg-white/[0.05] hover:bg-white/[0.1] text-[#1F2937] border-white/[0.1]"
                  }`}
              >
                <span>{isRecording ? "🛑 Stop Recording" : "🎤 Speak Answer"}</span>
              </button>
              {isRecording && <span className="text-xs text-rose-400 italic">Listening to your voice...</span>}
            </div>

            <textarea
              value={answers[currentQuestion.id] || ""}
              onChange={handleTextChange}
              rows={6}
              placeholder="Type your answer here or click the mic icon to speak..."
              className="w-full p-4 bg-[#FFFFFF] border border-white/[0.1] rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all duration-150 resize-none text-[#1F2937] placeholder-gray-600"
            />
          </div>
        )}

        {/* CASE 2: MCQ Question (Single Choice Radio Pills) */}
        {currentQuestion.type === "mcq" && (
          <div className="grid grid-cols-1 gap-3">
            {currentQuestion.options.map((option, idx) => {
              const isSelected = answers[currentQuestion.id] === option;
              return (
                <button
                  key={idx}
                  onClick={() => handleMCQSelect(option)}
                  className={`w-full text-left p-4 rounded-xl border transition-all duration-150 font-medium ${isSelected
                      ? "border-indigo-500 bg-indigo-500/10 text-indigo-300 shadow-[0_0_15px_rgba(99,102,241,0.15)]"
                      : "border-[#E2E8F0] bg-[#FFFFFF] hover:bg-white/[0.05] text-[#1F2937]"
                    }`}
                >
                  <span className={`inline-block mr-3 text-sm ${isSelected ? 'text-indigo-400' : 'text-[#6B7280]'}`}>Option {String.fromCharCode(65 + idx)}:</span>
                  {option}
                </button>
              );
            })}
          </div>
        )}

        {/* CASE 3: MSQ Question (Multi Choice Checkbox List) */}
        {currentQuestion.type === "msq" && (
          <div className="grid grid-cols-1 gap-3">
            <p className="text-xs text-amber-500 font-semibold mb-2 bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 rounded-lg w-fit">⚠️ More than one option can be correct!</p>
            {currentQuestion.options.map((option, idx) => {
              const isSelected = (answers[currentQuestion.id] || []).includes(option);
              return (
                <button
                  key={idx}
                  onClick={() => handleMSQSelect(option)}
                  className={`w-full text-left p-4 rounded-xl border transition-all duration-150 font-medium flex items-center justify-between ${isSelected
                      ? "border-indigo-500 bg-indigo-500/10 text-indigo-300 shadow-[0_0_15px_rgba(99,102,241,0.15)]"
                      : "border-[#E2E8F0] bg-[#FFFFFF] hover:bg-white/[0.05] text-[#1F2937]"
                    }`}
                >
                  <div>
                    <span className={`inline-block mr-3 text-sm ${isSelected ? 'text-indigo-400' : 'text-[#6B7280]'}`}>Choice {String.fromCharCode(65 + idx)}:</span>
                    {option}
                  </div>
                  <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                    isSelected 
                      ? "bg-indigo-500 border-indigo-500" 
                      : "border-gray-600 bg-transparent"
                  }`}>
                    {isSelected && <svg className="w-3 h-3 text-[#1F2937]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                  </div>
                </button>
              );
            })}
          </div>
        )}
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

        {currentIndex < questions.length - 1 ? (
          <button
            onClick={() => setCurrentIndex((prev) => prev + 1)}
            className="px-6 py-2.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold rounded-lg text-sm shadow-md hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-150 hover:-translate-y-0.5"
          >
            Next Question ➡️
          </button>
        ) : (
          <button
            onClick={handleSubmitTest}
            disabled={loading}
            className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg text-sm shadow-md hover:shadow-lg hover:shadow-emerald-500/30 transition-all duration-150 hover:-translate-y-0.5 flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? "Evaluating Final Answers..." : "Submit Test 🏁"}
          </button>
        )}
      </div>
    </div>
  );
};

export default CustomMockSimulator;