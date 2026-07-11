import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useInterview } from '../hooks/useInterview.js';
import {
  ArrowLeft, Award, Target, Play,
  CheckCircle, AlertCircle
} from 'lucide-react';
import RingLoader from '../../../components/RingLoader';

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

  if (loading && !error) {
    return <RingLoader title="Loading your scorecard..." subtitle="Fetching your interview results" />
  }

  if (error || !result) {
    return (
      <div className="min-h-screen bg-[#e0f2fe] flex flex-col items-center justify-center text-[#1F2937] relative overflow-hidden">
        <AlertCircle className="w-12 h-12 text-rose-500 mb-3" />
        <p className="text-rose-600 font-medium mb-4">{error || "Result not found"}</p>
        <button onClick={() => navigate('/')} className="px-5 py-2.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-xl shadow-lg transition-all font-bold flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </button>
      </div>
    );
  }

  const scoreColor = result.overallScore >= 70
    ? 'text-emerald-500'
    : result.overallScore >= 50
      ? 'text-amber-500'
      : 'text-rose-500';

  return (
    <div className="min-h-screen bg-[#e0f2fe] p-4 md:p-8 font-sans text-[#1F2937] relative overflow-x-hidden flex flex-col z-0">

      {/* Gamified Background Grid */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#6366f115_1px,transparent_1px),linear-gradient(to_bottom,#6366f115_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none z-0" />
      <div className="fixed inset-0 bg-gradient-to-b from-transparent via-[#e0f2fe]/20 to-[#e0f2fe]/90 pointer-events-none z-0" />

      {/* Ambient Glows from Home */}
      <div className="fixed top-6 left-1/2 -translate-x-1/2 w-[500px] h-[250px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none z-0" />
      <div className="fixed top-1/3 right-10 w-80 h-80 bg-purple-600/10 rounded-full blur-[110px] pointer-events-none z-0" />

      <div className="relative z-10 max-w-5xl mx-auto space-y-8 w-full mt-4">

        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-2 gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-[#1F2937] tracking-tight leading-snug">
              Interview <span className="inline-block ml-1 px-4 py-1 bg-[#2563EB] text-white rounded-xl shadow-lg shadow-blue-500/30 transform -rotate-2 hover:rotate-0 hover:scale-105 transition-all duration-300 cursor-default">Scorecard</span>
            </h1>
            <p className="text-[#6B7280] text-sm mt-2 font-medium">
              {new Date(result.createdAt).toLocaleDateString('en-US', {
                weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
              })}
            </p>
          </div>
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-5 py-2.5 rounded-xl transition-all shadow-lg text-sm font-bold shadow-blue-500/30"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </button>
        </div>

        {/* Top Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* Score Card */}
          <div className="bg-[#FFFFFF] border border-[#E2E8F0] p-8 rounded-3xl shadow-sm hover:shadow-md transition-shadow flex flex-col items-center justify-center relative overflow-hidden group">
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
            <Award className={`w-10 h-10 mb-4 drop-shadow-sm ${scoreColor}`} />
            <p className="text-xs font-black text-[#6B7280] uppercase tracking-widest mb-2">Overall Score</p>
            <div className="flex items-baseline gap-1">
              <span className={`text-7xl font-black font-mono drop-shadow-sm ${scoreColor}`}>
                {result.overallScore}
              </span>
              <span className="text-xl text-[#6B7280] font-bold">/100</span>
            </div>
            <div className={`mt-4 text-xs font-black px-4 py-1.5 rounded-xl border tracking-widest uppercase shadow-sm ${result.overallScore >= 70
              ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
              : result.overallScore >= 50
                ? 'bg-amber-500/10 text-amber-600 border-amber-500/20'
                : 'bg-rose-500/10 text-rose-600 border-rose-500/20'
              }`}>
              {result.overallScore >= 70 ? 'Strong Performance' : result.overallScore >= 50 ? 'Needs Improvement' : 'Keep Practicing'}
            </div>
          </div>

          {/* Summary */}
          <div className="bg-[#FFFFFF] border border-[#E2E8F0] p-8 rounded-3xl shadow-sm md:col-span-2 relative overflow-hidden flex flex-col justify-center">
            <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-[#2563EB] to-indigo-400" />
            <div className="pl-4">
              <h3 className="text-xs font-black text-[#2563EB] uppercase tracking-widest mb-4 flex items-center gap-2">
                <Target className="w-4 h-4" /> AI Verdict & Summary
              </h3>
              <p className="text-[#1F2937] leading-relaxed text-base md:text-lg font-medium">
                {result.overallSummary}
              </p>
            </div>
          </div>
        </div>

        {/* Per-Question Breakdown */}
        <div className="pt-6">
          <h2 className="text-2xl font-extrabold text-[#1F2937] mb-8 flex items-center gap-2 leading-snug">
            <Play className="w-6 h-6 text-[#2563EB]" />
            Question-by-Question Breakdown
          </h2>

          <div className="space-y-6">
            {result.evaluations.map((item, idx) => (
              <div
                key={idx}
                className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-3xl shadow-sm hover:shadow-lg hover:border-indigo-200 transition-all duration-300 overflow-hidden group"
              >
                <div className="p-6 md:p-8">
                  {/* Q Header */}
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-6 pb-6 border-b border-slate-100">
                    <div className="flex gap-4 items-start">
                      <span className="shrink-0 w-10 h-10 flex items-center justify-center bg-[#2563EB] text-white rounded-xl font-black text-sm shadow-md">
                        Q{idx + 1}
                      </span>
                      <p className="text-lg font-bold text-[#1F2937] leading-relaxed mt-1">{item.question}</p>
                    </div>
                    <div className={`shrink-0 px-4 py-2 rounded-xl border font-black text-sm shadow-sm flex items-center gap-1 mt-2 sm:mt-0 ${item.score >= 8
                      ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
                      : item.score >= 5
                        ? 'bg-amber-500/10 text-amber-600 border-amber-500/20'
                        : 'bg-rose-500/10 text-rose-600 border-rose-500/20'
                      }`}>
                      {item.score}<span className="text-xs opacity-70">/10</span>
                    </div>
                  </div>

                  {/* Feedback + Model Answer */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <p className="text-[10px] font-black uppercase tracking-widest text-amber-600 flex items-center gap-1.5 bg-amber-50 w-fit px-3 py-1 rounded-lg border border-amber-200">
                        <AlertCircle className="w-3.5 h-3.5" /> AI Feedback
                      </p>
                      <div className="p-5 bg-slate-50/80 rounded-2xl border border-[#E2E8F0] text-sm text-[#4B5563] leading-relaxed shadow-inner">
                        {item.feedback}
                      </div>
                    </div>
                    <div className="space-y-3">
                      <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600 flex items-center gap-1.5 bg-emerald-50 w-fit px-3 py-1 rounded-lg border border-emerald-200">
                        <CheckCircle className="w-3.5 h-3.5" /> Ideal Model Answer
                      </p>
                      <div className="p-5 bg-emerald-50/50 rounded-2xl border border-emerald-100 text-sm text-[#1F2937] leading-relaxed shadow-sm">
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
        <div className="pt-8 pb-12 flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate('/')}
            className="flex items-center justify-center gap-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-8 py-3.5 rounded-2xl font-bold text-sm transition-all shadow-xl shadow-blue-500/20 hover:shadow-blue-500/40 hover:-translate-y-1"
          >
            <ArrowLeft className="w-4 h-4" />
            Return to Dashboard
          </button>
          <button
            onClick={() => navigate(-1)}
            className="flex items-center justify-center gap-2 bg-[#FFFFFF] hover:bg-slate-50 text-[#1F2937] px-8 py-3.5 rounded-2xl font-bold text-sm transition-all border border-[#E2E8F0] shadow-sm hover:shadow-md"
          >
            Take Another Interview
          </button>
        </div>

      </div>
    </div>
  );
};

export default MockResult;
