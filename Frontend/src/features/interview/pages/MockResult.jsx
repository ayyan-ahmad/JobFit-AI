import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useInterview } from '../hooks/useInterview.js';
import {
    Loader2, ArrowLeft, Award, Target, Play,
    CheckCircle, AlertCircle
} from 'lucide-react';

const MockResult = () => {
    const { resultId } = useParams();
    const navigate = useNavigate();
    const { getMockResultDetail, loading } = useInterview();
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (resultId) {
            getMockResultDetail(resultId).then(data => {
                if (data) setResult(data);
                else setError('Result not found.');
            });
        }
    }, [resultId]);

    if (loading || !result) {
        return (
            <div className="min-h-screen bg-[#0B0F19] flex flex-col items-center justify-center text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#37415120_1px,transparent_1px),linear-gradient(to_bottom,#37415120_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_45%,#000_85%,transparent_100%)] pointer-events-none" />
                <div className="absolute top-6 left-1/2 -translate-x-1/2 w-[500px] h-[250px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />
                {error ? (
                    <>
                        <AlertCircle className="w-12 h-12 text-rose-400 mb-3" />
                        <p className="text-rose-300 font-medium mb-2">{error}</p>
                        <button onClick={() => navigate('/')} className="text-sm text-gray-400 hover:text-white flex items-center gap-1.5 transition-colors">
                            <ArrowLeft className="w-4 h-4" /> Back to Home
                        </button>
                    </>
                ) : (
                    <>
                        <div className="relative w-24 h-24 mb-8">
                            <div className="absolute inset-0 border-t-4 border-indigo-500 rounded-full animate-spin"></div>
                            <div className="absolute inset-2 border-r-4 border-emerald-500 rounded-full animate-spin-slow"></div>
                            <div className="absolute inset-4 border-b-4 border-purple-500 rounded-full animate-spin"></div>
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-2 tracking-wide">Loading your scorecard...</h2>
                        <p className="text-indigo-300/70 font-medium">Fetching your interview results</p>
                    </>
                )}
            </div>
        );
    }

    const scoreColor = result.overallScore >= 70
        ? 'text-emerald-400'
        : result.overallScore >= 50
            ? 'text-amber-400'
            : 'text-rose-400';

    return (
        <div className="min-h-screen bg-[#0B0F19] p-4 md:p-8 font-sans text-gray-200 relative overflow-x-hidden">

            {/* Background Grid */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#37415120_1px,transparent_1px),linear-gradient(to_bottom,#37415120_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_45%,#000_85%,transparent_100%)] pointer-events-none" />

            {/* Ambient Glows */}
            <div className="absolute top-6 left-1/2 -translate-x-1/2 w-[500px] h-[250px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute top-1/3 right-10 w-80 h-80 bg-purple-600/10 rounded-full blur-[110px] pointer-events-none" />

            <div className="relative z-10 max-w-5xl mx-auto space-y-6">

                {/* Header */}
                <div className="flex items-center justify-between mb-2">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
                            Interview Scorecard
                        </h1>
                        <p className="text-gray-500 text-sm mt-1">
                            {new Date(result.createdAt).toLocaleDateString('en-US', {
                                weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
                            })}
                        </p>
                    </div>
                    <button
                        onClick={() => navigate('/')}
                        className="flex items-center gap-2 bg-white/5 hover:bg-white/10 text-white px-4 py-2 rounded-xl transition-all border border-white/10 text-sm font-medium"
                    >
                        <ArrowLeft className="w-4 h-4" /> Dashboard
                    </button>
                </div>

                {/* Top Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

                    {/* Score Card */}
                    <div className="bg-white/[0.02] border border-white/[0.08] p-6 rounded-2xl flex flex-col items-center justify-center relative overflow-hidden">
                        <div className="absolute -top-8 -right-8 w-24 h-24 bg-indigo-500/10 rounded-full blur-2xl" />
                        <Award className={`w-7 h-7 mb-3 ${scoreColor}`} />
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Overall Score</p>
                        <div className="flex items-baseline gap-1">
                            <span className={`text-6xl font-black font-mono ${scoreColor}`}>
                                {result.overallScore}
                            </span>
                            <span className="text-xl text-gray-600">/100</span>
                        </div>
                        <div className={`mt-3 text-xs font-bold px-3 py-1 rounded-full border ${
                            result.overallScore >= 70
                                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                : result.overallScore >= 50
                                    ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                                    : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                        }`}>
                            {result.overallScore >= 70 ? 'Strong Performance' : result.overallScore >= 50 ? 'Needs Improvement' : 'Keep Practicing'}
                        </div>
                    </div>

                    {/* Summary */}
                    <div className="bg-white/[0.02] border border-white/[0.08] p-6 rounded-2xl md:col-span-2 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-indigo-500 to-purple-600 rounded-l-2xl" />
                        <div className="pl-4">
                            <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                                <Target className="w-3.5 h-3.5" /> AI Verdict
                            </h3>
                            <p className="text-gray-300 leading-relaxed text-base md:text-lg">
                                {result.overallSummary}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Per-Question Breakdown */}
                <div className="pt-4">
                    <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                        <Play className="w-5 h-5 text-purple-400" />
                        Question-by-Question Breakdown
                    </h2>

                    <div className="space-y-5">
                        {result.evaluations.map((item, idx) => (
                            <div
                                key={idx}
                                className="bg-white/[0.02] border border-white/[0.06] rounded-2xl overflow-hidden hover:border-white/[0.1] transition-all duration-200"
                            >
                                <div className="p-5 md:p-6">
                                    {/* Q Header */}
                                    <div className="flex justify-between items-start gap-4 mb-5 pb-5 border-b border-white/[0.05]">
                                        <div className="flex gap-3">
                                            <span className="shrink-0 w-8 h-8 flex items-center justify-center bg-indigo-500/20 text-indigo-400 rounded-lg font-bold text-sm border border-indigo-500/20">
                                                Q{idx + 1}
                                            </span>
                                            <p className="text-base font-semibold text-white leading-snug mt-1">{item.question}</p>
                                        </div>
                                        <div className={`shrink-0 px-3 py-1.5 rounded-lg border font-black text-sm ${
                                            item.score >= 8
                                                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                                : item.score >= 5
                                                    ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                                                    : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                                        }`}>
                                            {item.score}/10
                                        </div>
                                    </div>

                                    {/* Feedback + Model Answer */}
                                    <div className="grid md:grid-cols-2 gap-5">
                                        <div className="space-y-2">
                                            <p className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                                                <AlertCircle className="w-3.5 h-3.5" /> AI Feedback
                                            </p>
                                            <div className="p-4 bg-black/20 rounded-xl border border-white/[0.03] text-sm text-gray-300 leading-relaxed">
                                                {item.feedback}
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <p className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                                                <CheckCircle className="w-3.5 h-3.5" /> Ideal Model Answer
                                            </p>
                                            <div className="p-4 bg-emerald-500/5 rounded-xl border border-emerald-500/10 text-sm text-emerald-200/80 leading-relaxed">
                                                {item.modelAnswer}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Bottom CTA */}
                <div className="pt-6 pb-8 flex flex-col sm:flex-row gap-3 justify-center">
                    <button
                        onClick={() => navigate('/')}
                        className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-3 rounded-xl font-bold text-sm transition-all shadow-lg shadow-indigo-600/20 hover:scale-105 active:scale-100"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Return to Dashboard
                    </button>
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white px-8 py-3 rounded-xl font-bold text-sm transition-all border border-white/10"
                    >
                        Take Another Interview
                    </button>
                </div>

            </div>
        </div>
    );
};

export default MockResult;
