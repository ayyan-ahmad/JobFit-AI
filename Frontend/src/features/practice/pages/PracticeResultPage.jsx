import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PracticeScoreboard from "./PracticeScoreboard";
import { getPracticeSessionById } from "../services/practice.api";
import { ArrowLeft, Loader2 } from "lucide-react";

const PracticeResultPage = () => {
    const { sessionId } = useParams();
    const navigate = useNavigate();
    const [session, setSession] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchSession = async () => {
            try {
                const data = await getPracticeSessionById(sessionId);
                if (data.success && data.session) {
                    setSession(data.session);
                } else {
                    setError("Failed to load practice result.");
                }
            } catch (err) {
                setError(err.response?.data?.message || "Failed to load practice result.");
            } finally {
                setLoading(false);
            }
        };
        fetchSession();
    }, [sessionId]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#0B0F19]">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
            </div>
        );
    }

    if (error || !session) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#0B0F19] flex-col gap-4">
                <div className="text-rose-400 font-bold bg-rose-500/10 px-4 py-2 rounded-lg border border-rose-500/20">{error || "Result not found"}</div>
                <button onClick={() => navigate("/")} className="px-4 py-2 bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.1] text-white rounded-lg transition-colors">Back to Dashboard</button>
            </div>
        );
    }

    return (
        <div className="min-h-screen w-full bg-[#0B0F19] text-gray-100 relative overflow-x-hidden flex flex-col pt-8 px-4">
            {/* Background Grid Structure */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#37415120_1px,transparent_1px),linear-gradient(to_bottom,#37415120_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_45%,#000_85%,transparent_100%)] pointer-events-none" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />

            <div className="relative z-10 max-w-4xl mx-auto w-full mb-4">
                <button 
                    onClick={() => navigate('/')} 
                    className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors font-medium bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.06] px-5 py-2.5 rounded-xl shadow-lg w-fit"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Dashboard
                </button>
            </div>
            
            <div className="relative z-10 w-full">
                <PracticeScoreboard 
                    evaluationData={session.evaluation}
                    detailedBreakdown={session.userAnswers}
                    questions={session.questions}
                    onReset={() => navigate("/practice")} 
                />
            </div>
        </div>
    );
};

export default PracticeResultPage;
