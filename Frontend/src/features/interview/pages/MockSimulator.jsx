import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { evaluateMockInterview } from '../services/interview.api.js'; // Apna correct path daal lena
import { CheckCircle, AlertCircle, ArrowLeft, Target, Award, Play } from 'lucide-react';

const MockSimulator = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const activeQuestions = location.state?.questions || [
        { question: "What is the Virtual DOM in React, and how does it work?" },
        { question: "Explain the difference between let, const, and var in JavaScript." }
    ];

    const [currentIndex, setCurrentIndex] = useState(0);
    const [answersList, setAnswersList] = useState([]);
    const [currentAnswer, setCurrentAnswer] = useState("");
    const [isEvaluating, setIsEvaluating] = useState(false);
    const [evaluationResult, setEvaluationResult] = useState(null);
    const [isListening, setIsListening] = useState(false);

    const recognitionRef = useRef(null);

    useEffect(() => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition) {
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = true;
            recognitionRef.current.interimResults = true;
            recognitionRef.current.lang = 'en-US';

            recognitionRef.current.onresult = (event) => {
                let finalTranscript = "";
                for (let i = 0; i < event.results.length; i++) {
                    finalTranscript += event.results[i][0].transcript;
                }
                setCurrentAnswer(finalTranscript);
            };

            recognitionRef.current.onerror = (event) => {
                console.error("Mic error:", event.error);
                setIsListening(false);
            };
        }
    }, []);

    const toggleListening = () => {
        if (isListening) {
            recognitionRef.current?.stop();
            setIsListening(false);
        } else {
            recognitionRef.current?.start();
            setIsListening(true);
        }
    };

    // Using Axios with Cookies instead of LocalStorage
    const submitInterview = async (finalData) => {
        setIsEvaluating(true);
        try {
            const data = await evaluateMockInterview(finalData);
            if (data.resultId) {
                // Navigate to the saved result page — persists on refresh
                navigate(`/mock-result/${data.resultId}`);
            }
        } catch (error) {
            console.error("Evaluation Error:", error);
            const errorMsg = error.message === "rate_limit"
                ? "AI is currently busy evaluating. Please try again in a minute."
                : "Failed to connect to the server.";
            alert(errorMsg);
        } finally {
            setIsEvaluating(false);
        }
    };

    const handleNext = () => {
        if (isListening) {
            recognitionRef.current?.stop();
            setIsListening(false);
        }

        const updatedList = [
            ...answersList,
            { question: activeQuestions[currentIndex].question, answer: currentAnswer }
        ];

        setAnswersList(updatedList);
        setCurrentAnswer("");

        if (currentIndex < activeQuestions.length - 1) {
            setCurrentIndex(currentIndex + 1);
        } else {
            submitInterview(updatedList);
        }
    };

    // --- RENDER 1: LOADING SCREEN ---
    if (isEvaluating) {
        return (
            <div className="min-h-screen bg-[#0B0F19] flex flex-col items-center justify-center p-4 relative overflow-hidden">
                {/* Background Grid */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#37415120_1px,transparent_1px),linear-gradient(to_bottom,#37415120_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_45%,#000_85%,transparent_100%)] pointer-events-none" />
                <div className="absolute top-6 left-1/2 -translate-x-1/2 w-[500px] h-[250px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />
                <div className="relative w-24 h-24 mb-8">
                    <div className="absolute inset-0 border-t-4 border-indigo-500 rounded-full animate-spin"></div>
                    <div className="absolute inset-2 border-r-4 border-emerald-500 rounded-full animate-spin-slow"></div>
                    <div className="absolute inset-4 border-b-4 border-purple-500 rounded-full animate-spin"></div>
                </div>
                <h2 className="text-2xl font-bold text-white mb-2 tracking-wide">AI Evaluator is Analyzing...</h2>
                <p className="text-indigo-300/70 font-medium">Processing your answers and generating insights</p>
            </div>
        );
    }

    // --- RENDER 2: 📊 PREMIUM DASHBOARD REPORT ---
    if (evaluationResult) {
        return (
            <div className="min-h-screen bg-[#0B0F19] p-4 md:p-8 font-sans text-gray-200 relative overflow-x-hidden">
                {/* Background Grid */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#37415120_1px,transparent_1px),linear-gradient(to_bottom,#37415120_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_45%,#000_85%,transparent_100%)] pointer-events-none" />
                <div className="absolute top-6 left-1/2 -translate-x-1/2 w-[500px] h-[250px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />
                <div className="absolute top-1/3 right-10 w-80 h-80 bg-purple-600/10 rounded-full blur-[110px] pointer-events-none" />
                <div className="max-w-5xl mx-auto space-y-6 relative z-10">

                    {/* Header */}
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h1 className="text-3xl font-extrabold text-white">Performance Dashboard</h1>
                            <p className="text-gray-400 mt-1">Detailed AI analysis of your mock interview</p>
                        </div>
                        <button onClick={() => navigate('/')} className="flex items-center gap-2 bg-white/5 hover:bg-white/10 text-white px-4 py-2 rounded-xl transition-all border border-white/10">
                            <ArrowLeft className="w-4 h-4" /> Exit to Home
                        </button>
                    </div>

                    {/* Top Metrics Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Overall Score */}
                        <div className="bg-white/[0.02] border border-white/[0.08] p-6 rounded-2xl flex flex-col items-center justify-center relative overflow-hidden group">
                            <div className="absolute -top-10 -right-10 w-24 h-24 bg-indigo-500/10 rounded-full blur-xl"></div>
                            <Award className={`w-8 h-8 mb-3 ${evaluationResult.overallScore >= 70 ? 'text-emerald-400' : 'text-amber-400'}`} />
                            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">Overall Score</h3>
                            <div className="flex items-baseline gap-1">
                                <span className="text-5xl font-black text-white">{evaluationResult.overallScore}</span>
                                <span className="text-xl text-gray-500">/100</span>
                            </div>
                        </div>

                        {/* Summary Box */}
                        <div className="bg-white/[0.02] border border-white/[0.08] p-6 rounded-2xl md:col-span-2 relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500"></div>
                            <h3 className="text-sm font-semibold text-indigo-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                                <Target className="w-4 h-4" /> AI Summary & Verdict
                            </h3>
                            <p className="text-gray-300 leading-relaxed text-lg">
                                {evaluationResult.overallSummary}
                            </p>
                        </div>
                    </div>

                    {/* Detailed Q&A Analysis */}
                    <h2 className="text-xl font-bold text-white mt-10 mb-4 flex items-center gap-2">
                        <Play className="w-5 h-5 text-purple-400" /> Question-by-Question Analysis
                    </h2>

                    <div className="space-y-6">
                        {evaluationResult.evaluations.map((item, idx) => (
                            <div key={idx} className="bg-white/[0.02] border border-white/[0.06] rounded-2xl overflow-hidden hover:border-white/[0.1] transition-all">
                                <div className="p-6">
                                    {/* Question & Score Header */}
                                    <div className="flex justify-between items-start gap-4 mb-6 pb-6 border-b border-white/[0.04]">
                                        <div className="flex gap-4">
                                            <span className="shrink-0 w-8 h-8 flex items-center justify-center bg-indigo-500/20 text-indigo-400 rounded-lg font-bold border border-indigo-500/30">
                                                Q{idx + 1}
                                            </span>
                                            <h3 className="text-lg font-semibold text-white mt-1">{item.question}</h3>
                                        </div>
                                        <div className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg border font-bold text-sm ${item.score >= 8 ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                                                item.score >= 5 ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                                                    'bg-rose-500/10 text-rose-400 border-rose-500/20'
                                            }`}>
                                            {item.score}/10
                                        </div>
                                    </div>

                                    {/* Feedback Section */}
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <p className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 text-amber-400">
                                                <AlertCircle className="w-3.5 h-3.5" /> AI Feedback
                                            </p>
                                            <div className="p-4 bg-black/20 rounded-xl border border-white/[0.02] text-sm text-gray-300 leading-relaxed h-full">
                                                {item.feedback}
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <p className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 text-emerald-400">
                                                <CheckCircle className="w-3.5 h-3.5" /> Ideal Model Answer
                                            </p>
                                            <div className="p-4 bg-emerald-500/5 rounded-xl border border-emerald-500/10 text-sm text-emerald-200/80 leading-relaxed h-full">
                                                {item.modelAnswer}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Return to Dashboard Button */}
                    <div className="mt-10 flex justify-center pb-4">
                        <button
                            onClick={() => navigate('/')}
                            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-3.5 rounded-xl font-bold text-sm transition-all shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/40 hover:scale-105 active:scale-100"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Return to Dashboard
                        </button>
                    </div>

                </div>
            </div>
        );
    }

    // --- RENDER 3: 🎙️ LIVE INTERVIEW ROOM (Original) ---
    return (
        <div className="min-h-screen bg-[#0B0F19] flex items-center justify-center p-4 font-sans relative overflow-hidden">
            {/* Background Grid */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#37415120_1px,transparent_1px),linear-gradient(to_bottom,#37415120_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_45%,#000_85%,transparent_100%)] pointer-events-none" />
            {/* Ambient Glows */}
            <div className="absolute top-6 left-1/2 -translate-x-1/2 w-[500px] h-[250px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute top-1/3 right-10 w-80 h-80 bg-purple-600/10 rounded-full blur-[110px] pointer-events-none" />

            <div className="max-w-4xl w-full bg-white/[0.02] backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-white/[0.08] z-10">
                <div className="p-6 border-b border-white/[0.08] flex justify-between items-center bg-black/20">
                    <div className="flex items-center gap-3">
                        <div className="w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse shadow-[0_0_12px_rgba(239,68,68,0.8)]"></div>
                        <h2 className="text-lg font-bold text-white tracking-wide">Live Interview Session</h2>
                    </div>
                    <span className="text-xs font-bold bg-indigo-500/20 text-indigo-300 px-3 py-1.5 rounded-lg border border-indigo-500/30">
                        Q {currentIndex + 1} of {activeQuestions.length}
                    </span>
                </div>

                <div className="p-8 md:p-12">
                    <h3 className="text-2xl md:text-3xl font-semibold text-gray-100 leading-relaxed mb-10">
                        {activeQuestions[currentIndex].question}
                    </h3>

                    <div className="relative group">
                        <textarea
                            className={`w-full h-56 bg-black/20 border ${isListening ? 'border-red-500 ring-1 ring-red-500 shadow-[0_0_15px_rgba(239,68,68,0.2)]' : 'border-white/[0.1] focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500'} rounded-2xl p-6 text-gray-200 text-lg transition-all resize-none shadow-inner custom-scrollbar outline-none`}
                            placeholder="Type your answer or click the mic to speak..."
                            value={currentAnswer}
                            onChange={(e) => setCurrentAnswer(e.target.value)}
                        ></textarea>

                        <button
                            onClick={toggleListening}
                            className={`absolute bottom-6 right-6 p-4 rounded-full shadow-2xl transition-all duration-300 flex items-center justify-center ${isListening
                                    ? 'bg-red-500 hover:bg-red-600 animate-bounce scale-110'
                                    : 'bg-indigo-600 hover:bg-indigo-500 hover:scale-105'
                                }`}
                            title={isListening ? "Stop Listening" : "Start Speaking"}
                        >
                            {isListening ? (
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" /></svg>
                            ) : (
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
                            )}
                        </button>
                    </div>
                    {isListening && (
                        <div className="flex items-center gap-2 mt-4 text-red-400">
                            <div className="flex gap-1">
                                <span className="w-1 h-1 bg-red-400 rounded-full animate-bounce"></span>
                                <span className="w-1 h-1 bg-red-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                                <span className="w-1 h-1 bg-red-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
                            </div>
                            <p className="text-sm font-medium">Recording in progress...</p>
                        </div>
                    )}
                </div>

                <div className="p-6 border-t border-white/[0.08] bg-black/20 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <p className="text-gray-400 text-sm font-medium">Take a deep breath. You got this.</p>
                    <button
                        onClick={handleNext}
                        disabled={!currentAnswer.trim() || isEvaluating}
                        className="w-full sm:w-auto bg-white text-black hover:bg-gray-200 px-8 py-3 rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {currentIndex === activeQuestions.length - 1 ? "Submit & Analyze" : "Next Question"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MockSimulator;