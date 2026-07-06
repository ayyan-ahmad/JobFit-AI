const { GoogleGenAI } = require("@google/genai")
const puppeteer = require("puppeteer")



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


async function generatePdfFromHtml(htmlContent) {
    const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] })
    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: "networkidle0" })

    const pdfBuffer = await page.pdf({
        format: "A4",
        printBackground: true,
        margin: {
            top: "12mm",
            bottom: "12mm",
            left: "8mm",
            right: "15mm"
        }
    })

    await browser.close()

    return pdfBuffer
}

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
                    1. SINGLE PAGE ONLY — absolutely no overflow beyond one A4 page (210mm x 297mm).
                    2. ATS FRIENDLY — use plain semantic HTML: <h1>, <h2>, <h3>, <p>, <ul>, <li>. NO tables, NO columns, NO flexbox for layout, NO CSS Grid. Single-column only.
                    3. FONT — use font-family: 'Arial', 'Helvetica', sans-serif. No Google Fonts (no @import).
                    4. MARGINS — body margin: 0; padding: 0. Content wrapper: padding: 12mm 15mm 12mm 8mm.
                    5. FONT SIZES — Name: 20px bold; Section headings: 13px bold uppercase with a 1px solid #333 bottom border and 4px margin-bottom; Body text: 11px; Line-height: 1.4.
                    6. SECTIONS ORDER — Name & Contact Info → Summary → Skills → Experience → Education → (optional: Projects or Certifications if space allows).
                    7. COLORS — black text (#111) on white (#fff) background. Section heading underline: #333. Subtle only.
                    8. SPACING — minimize padding/margins to ensure single page. Use margin: 6px 0 between sections.
                    9. SKILLS — display as comma-separated text in a <p> tag, NOT as pills or badges.
                    10. EXPERIENCE entries — Role Title | Company | Date (same line), then bullet points as <ul><li>.
                    11. NO images, icons, SVGs, or decorative elements.
                    12. Include a <style> block inside <head>. No external stylesheets.
                    13. The complete document must be a valid full HTML page: <!DOCTYPE html><html><head>...</head><body>...</body></html>.

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

    const pdfBuffer = await generatePdfFromHtml(jsonContent.html)

    return pdfBuffer

}

module.exports = { generateInterviewReport, generateResumePdf }