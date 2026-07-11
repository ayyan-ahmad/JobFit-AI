import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import TopicSelector from "./TopicSelector";
import CustomMockSimulator from "./CustomMockSimulator";
import PracticeScoreboard from "./PracticeScoreboard";
import { ArrowLeft } from "lucide-react";

// 3 steps ka flow:
// 1. "select"  → TopicSelector (topics choose karo)
// 2. "simulate" → CustomMockSimulator (questions answer karo)
// 3. "result"  → PracticeScoreboard (results dekho)

const PracticePage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState("select"); // "select" | "simulate" | "result"
  const [sessionData, setSessionData] = useState(null);  // { sessionId, questions }
  const [resultData, setResultData] = useState(null);   // { evaluation, detailedBreakdown }

  // Step 1 → 2: Session start hone ke baad
  const handleSessionStarted = ({ sessionId, questions }) => {
    setSessionData({ sessionId, questions });
    setStep("simulate");
  };

  // Step 2 → 3: Test submit hone ke baad
  const handleTestFinished = ({ evaluation, detailedBreakdown }) => {
    setResultData({ evaluation, detailedBreakdown });
    setStep("result");
  };

  // Step 3 → 1: Naya session shuru karna ho
  const handleReset = () => {
    setStep("select");
    setSessionData(null);
    setResultData(null);
  };

  return (
    <div className="min-h-screen w-full bg-[#e0f2fe] text-[#1F2937] relative overflow-x-hidden flex flex-col pt-8 z-0">
      {/* Gamified Background Grid */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#6366f115_1px,transparent_1px),linear-gradient(to_bottom,#6366f115_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none z-0" />
      <div className="fixed inset-0 bg-gradient-to-b from-transparent via-[#e0f2fe]/20 to-[#e0f2fe]/90 pointer-events-none z-0" />
      {/* Ambient Background Glows */}
      <div className="fixed top-6 left-1/2 -translate-x-1/2 w-[500px] h-[250px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none z-0" />
      <div className="fixed top-1/3 right-10 w-80 h-80 bg-purple-600/10 rounded-full blur-[110px] pointer-events-none z-0" />

      <div className="relative z-10 w-full flex-1 flex flex-col px-4">
        {step === "select" && (
          <div className="max-w-6xl mx-auto w-full mb-6">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-white transition-colors font-medium bg-[#2563EB] hover:bg-[#1D4ED8] border border-transparent px-5 py-2.5 rounded-xl shadow-lg"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </button>
          </div>
        )}

        {step === "select" && (
          <TopicSelector onSessionStarted={handleSessionStarted} />
        )}

        {step === "simulate" && sessionData && (
          <CustomMockSimulator
            sessionId={sessionData.sessionId}
            questions={sessionData.questions}
            onTestFinished={handleTestFinished}
          />
        )}

        {step === "result" && resultData && (
          <PracticeScoreboard
            evaluationData={resultData.evaluation}
            detailedBreakdown={resultData.detailedBreakdown}
            questions={sessionData.questions}
            onReset={handleReset}
          />
        )}
      </div>
    </div>
  );
};

export default PracticePage;
