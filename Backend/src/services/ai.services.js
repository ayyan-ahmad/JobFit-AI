const { GoogleGenAI } = require("@google/genai")



const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_GENAI_API_KEY
})


// Plain JSON Schema for interview report (compatible with Google GenAI SDK)
const interviewReportSchema = {
    type: "object",
    properties: {
        matchScore: {
            type: "number",
            description: "A score between 0 and 100 indicating how well the candidate's profile matches the job description"
        },
        title: {
            type: "string",
            description: "The title of the job for which the interview report is generated"
        },
        technicalQuestions: {
            type: "array",
            description: "Technical questions that can be asked in the interview along with their intention and how to answer them",
            items: {
                type: "object",
                properties: {
                    question: { type: "string", description: "The technical question that can be asked in the interview" },
                    intention: { type: "string", description: "The intention of the interviewer behind asking this question" },
                    answer: { type: "string", description: "How to answer this question, what points to cover, what approach to take" }
                },
                required: ["question", "intention", "answer"]
            }
        },
        behavioralQuestions: {
            type: "array",
            description: "Behavioral questions that can be asked in the interview along with their intention and how to answer them",
            items: {
                type: "object",
                properties: {
                    question: { type: "string", description: "The behavioral question that can be asked in the interview" },
                    intention: { type: "string", description: "The intention of the interviewer behind asking this question" },
                    answer: { type: "string", description: "How to answer this question, what points to cover, what approach to take" }
                },
                required: ["question", "intention", "answer"]
            }
        },
        skillGaps: {
            type: "array",
            description: "List of skill gaps in the candidate's profile along with their severity",
            items: {
                type: "object",
                properties: {
                    skill: { type: "string", description: "The skill which the candidate is lacking" },
                    severity: { type: "string", enum: ["low", "medium", "high"], description: "The severity of this skill gap" }
                },
                required: ["skill", "severity"]
            }
        },
        preparationPlan: {
            type: "array",
            description: "A day-wise preparation plan for the candidate",
            items: {
                type: "object",
                properties: {
                    day: { type: "number", description: "The day number in the preparation plan, starting from 1" },
                    focus: { type: "string", description: "The main focus of this day" },
                    tasks: { type: "array", items: { type: "string" }, description: "List of tasks to be done on this day" }
                },
                required: ["day", "focus", "tasks"]
            }
        }
    },
    required: ["matchScore", "title", "technicalQuestions", "behavioralQuestions", "skillGaps", "preparationPlan"]
}

async function generateInterviewReport({ resume, selfDescription, jobDescription }) {

    const prompt = `Generate a detailed interview report for a candidate with the following details:
                        Resume: ${resume || "Not provided"}
                        Self Description: ${selfDescription || "Not provided"}
                        Job Description: ${jobDescription}

                        Generate 5-7 technical questions, 4-5 behavioral questions, identify key skill gaps, and create a 7-day preparation plan.
`

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: interviewReportSchema,
        }
    })

    const text = response.text
    if (!text) {
        throw new Error("Empty response from AI model")
    }

    return JSON.parse(text)

}

/**
 * @description Service to evaluate user's mock interview answers using Gemini AI.
 * @param {Array} qnaList - Array of objects containing { question, answer }.
 */
const evaluationSchema = {
    type: "object",
    properties: {
        overallScore: {
            type: "number",
            description: "Overall score out of 100 for the candidate's interview performance"
        },
        overallSummary: {
            type: "string",
            description: "A brief overall summary of the candidate's interview performance"
        },
        evaluations: {
            type: "array",
            description: "Per-question evaluation results",
            items: {
                type: "object",
                properties: {
                    question: { type: "string", description: "The interview question" },
                    score: { type: "number", description: "Score for this question out of 10" },
                    feedback: { type: "string", description: "Detailed feedback on the candidate's answer" },
                    modelAnswer: { type: "string", description: "A concise ideal answer for this question" }
                },
                required: ["question", "score", "feedback", "modelAnswer"]
            }
        }
    },
    required: ["overallScore", "overallSummary", "evaluations"]
}

const evaluateInterviewAnswers = async (qnaList) => {
    const prompt = `
        You are a strict and expert technical interviewer evaluating a candidate's mock interview performance.
        Below is the list of questions asked and the exact answers provided by the candidate.

        Candidate's Q&A:
        ${JSON.stringify(qnaList, null, 2)}

        Evaluate the candidate's performance. For EACH question, provide:
        1. A score out of 10 (be honest and strict).
        2. Detailed, constructive feedback on what was good and what was missing or technically wrong.
        3. A concise ideal model answer for that question.

        Also provide an OVERALL score out of 100 and a brief overall performance summary.
    `;

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: evaluationSchema,
        }
    });

    const text = response.text;
    if (!text) {
        throw new Error("Empty response from Gemini AI");
    }

    return JSON.parse(text);
};


async function generateResumePdf({ resume, selfDescription, jobDescription }) {

    const resumePdfSchema = {
        type: "object",
        properties: {
            html: { type: "string", description: "The complete HTML content of the resume" }
        },
        required: ["html"]
    }

    const prompt = `You are a professional resume writer. Generate a SINGLE-PAGE ATS-friendly resume in pure HTML+CSS.

                    Candidate Details:
                    - Resume/Experience: ${resume || "Not provided"}
                    - Self Description: ${selfDescription || "Not provided"}
                    - Target Job Description: ${jobDescription}

                    STRICT REQUIREMENTS:
                    1. SINGLE PAGE ONLY — the entire resume MUST fit within exactly 794px wide × 1123px tall. This is non-negotiable.
                    2. Set on <body>: margin:0; padding:0; width:794px; height:1123px; max-height:1123px; overflow:hidden; box-sizing:border-box;
                    3. Content wrapper <div>: width:794px; max-height:1123px; overflow:hidden; padding:28px 36px 20px 36px; box-sizing:border-box;
                    4. ATS FRIENDLY — use plain semantic HTML: <h1>, <h2>, <h3>, <p>, <ul>, <li>. NO tables, NO columns, NO flexbox for layout, NO CSS Grid. Single-column only.
                    5. FONT — use font-family: 'Arial', 'Helvetica', sans-serif. No Google Fonts (no @import).
                    6. FONT SIZES — Name: 20px bold; Section headings: 12px bold uppercase with a 1px solid #333 bottom border and 3px margin-bottom; Body text: 10.5px; Line-height: 1.35.
                    7. SECTIONS ORDER — Name & Contact Info → Summary → Skills → Experience → Education → (optional: Projects or Certifications ONLY if space allows).
                    8. COLORS — black text (#111) on white (#fff) background. Section heading underline: #333. Subtle only.
                    9. SPACING — use margin: 5px 0 between sections. Keep padding/margins minimal to ensure everything stays within 1123px height.
                    10. SKILLS — display as comma-separated text in a <p> tag, NOT as pills or badges.
                    11. EXPERIENCE entries — Role Title | Company | Date (same line), then bullet points as <ul><li>. Max 2-3 bullets per role.
                    12. NO images, icons, SVGs, or decorative elements.
                    13. Include a <style> block inside <head>. No external stylesheets.
                    14. The complete document must be a valid full HTML page: <!DOCTYPE html><html><head>...</head><body>...</body></html>.
                    15. CRITICAL: If content would overflow 1123px, reduce bullet points, shorten descriptions, or omit optional sections. Never exceed the height limit.

                    Tailor the resume content specifically to the target job description to maximize ATS keyword match.
                    Return ONLY the JSON object with field "html" containing the complete HTML string.
                `



    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: resumePdfSchema,
        }
    })


    const jsonContent = JSON.parse(response.text)

    return jsonContent.html

}

module.exports = { generateInterviewReport, generateResumePdf, evaluateInterviewAnswers }