import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PracticeScoreboard from "./PracticeScoreboard";
import { getPracticeSessionById } from "../services/practice.api";
import { ArrowLeft } from "lucide-react";
import RingLoader from "../../../components/RingLoader";

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
        return <RingLoader title="Loading Practice Result..." subtitle="Analyzing your performance" />
    }

    if (error || !session) {
        return (
            <div className="min-h-screen flex items-center justify-center flex-col gap-4">
                <div className="text-rose-400 font-bold bg-rose-500/10 px-4 py-2 rounded-lg border border-rose-500/20">{error || "Result not found"}</div>
                <button onClick={() => navigate("/")} className="px-4 py-2 bg-[#2563EB] hover:bg-[#1D4ED8] border border-transparent text-white rounded-lg transition-colors shadow-lg">Back to Dashboard</button>
            </div>
        );
    }

    return (
        <div className="min-h-screen w-full bg-[#e0f2fe] text-[#1F2937] relative overflow-x-hidden flex flex-col pt-8 px-4 z-0">
            {/* Gamified Background Grid */}
            <div className="fixed inset-0 bg-[linear-gradient(to_right,#6366f115_1px,transparent_1px),linear-gradient(to_bottom,#6366f115_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none z-0" />
            <div className="fixed inset-0 bg-gradient-to-b from-transparent via-[#e0f2fe]/20 to-[#e0f2fe]/90 pointer-events-none z-0" />

            {/* Ambient Background Glows */}
            <div className="fixed top-6 left-1/2 -translate-x-1/2 w-[500px] h-[250px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none z-0" />
            <div className="fixed top-1/3 right-10 w-80 h-80 bg-purple-600/10 rounded-full blur-[110px] pointer-events-none z-0" />

            <div className="relative z-10 max-w-4xl mx-auto w-full mb-4">
                <button
                    onClick={() => navigate('/')}
                    className="flex items-center gap-2 text-white transition-colors font-medium bg-[#2563EB] hover:bg-[#1D4ED8] border border-transparent px-5 py-2.5 rounded-xl shadow-lg w-fit"
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
