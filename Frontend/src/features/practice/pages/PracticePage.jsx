import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import TopicSelector from "./TopicSelector";
import CustomMockSimulator from "./CustomMockSimulator";
import PracticeScoreboard from "./PracticeScoreboard";
import { ArrowLeft } from "lucide-react";

// 3 steps ka flow:
// 1. "select"    → TopicSelector (topics choose karo)
// 2. "simulate"  → CustomMockSimulator (questions answer karo)
// 3. "result"    → PracticeScoreboard (results dekho)

const PracticePage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState("select"); // "select" | "simulate" | "result"
  const [sessionData, setSessionData] = useState(null);   // { sessionId, questions }
  const [resultData, setResultData] = useState(null);     // { evaluation, detailedBreakdown }

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
    <div className="min-h-screen w-full bg-[#0B0F19] text-gray-100 relative overflow-x-hidden flex flex-col pt-8">
      {/* Background Grid Structure */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#37415120_1px,transparent_1px),linear-gradient(to_bottom,#37415120_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_45%,#000_85%,transparent_100%)] pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 w-full flex-1 flex flex-col px-4">
        {step === "select" && (
          <div className="max-w-6xl mx-auto w-full mb-6">
              <button 
                  onClick={() => navigate('/')} 
                  className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors font-medium bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.06] px-5 py-2.5 rounded-xl shadow-lg"
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
