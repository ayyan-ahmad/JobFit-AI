import { getAllInterviewReports, generateInterviewReport, getInterviewReportById, generateResumePdf } from "../services/interview.api"
import { useContext, useEffect } from "react"
import { InterviewContext } from "../interview.context"
import { useParams } from "react-router"


export const useInterview = () => {

    const context = useContext(InterviewContext)
    const { interviewId } = useParams()

    if (!context) {
        throw new Error("useInterview must be used within an InterviewProvider")
    }

    const { loading, setLoading, report, setReport, reports, setReports } = context

    const generateReport = async ({ jobDescription, selfDescription, resumeFile }) => {
        setLoading(true)
        try {
            const response = await generateInterviewReport({ jobDescription, selfDescription, resumeFile })
            setReport(response.interviewReport)
            return response.interviewReport
        } catch (error) {
            console.error('Error generating report:', error)
            throw error
        } finally {
            setLoading(false)
        }
    }

    const getReportById = async (interviewId) => {
        setLoading(true)
        try {
            const response = await getInterviewReportById(interviewId)
            if (response) {
                setReport(response.interviewReport)
                return response.interviewReport
            }
            return null
        } catch (error) {
            console.log(error)
            return null
        } finally {
            setLoading(false)
        }
    }

    const getReports = async () => {
        setLoading(true)
        try {
            const response = await getAllInterviewReports()
            if (response) {
                setReports(response.interviewReports)
                return response.interviewReports
            }
            return []
        } catch (error) {
            console.log(error)
            return []
        } finally {
            setLoading(false)
        }
    }
    const getResumePdf = async (interviewReportId) => {
        setLoading(true)
        try {
            const data = await generateResumePdf({ interviewReportId })
            const html = data?.html
            if (!html) throw new Error("No HTML content received")

            const html2pdf = (await import('html2pdf.js')).default

            // Use an iframe so body/html CSS selectors apply correctly
            const iframe = document.createElement('iframe')
            iframe.style.cssText = `
                position: fixed;
                left: -9999px;
                top: 0;
                width: 794px;
                height: 1123px;
                border: none;
                visibility: hidden;
            `
            document.body.appendChild(iframe)

            // Write full HTML into iframe
            iframe.contentDocument.open()
            iframe.contentDocument.write(html)
            iframe.contentDocument.close()

            // Wait for iframe to fully render (fonts, styles, layout)
            await new Promise(resolve => setTimeout(resolve, 600))

            const iframeBody = iframe.contentDocument.body

            await html2pdf().set({
                margin: 0,
                filename: `resume_${interviewReportId}.pdf`,
                image: { type: 'jpeg', quality: 1 },
                html2canvas: {
                    scale: 2,
                    useCORS: true,
                    allowTaint: true,
                    width: 794,
                    height: 1123,
                    windowWidth: 794,
                    scrollX: 0,
                    scrollY: 0,
                    backgroundColor: '#ffffff',
                    logging: false,
                    foreignObjectRendering: false,
                },
                jsPDF: { unit: 'px', format: [794, 1123], orientation: 'portrait' },
                pagebreak: { mode: 'avoid-all' }
            }).from(iframeBody).save()

            document.body.removeChild(iframe)

            return { success: true }
        }
        catch (error) {
            const message = error?.response?.data?.message || error?.message || "Failed to generate resume PDF. Please try again."
            console.error("Resume PDF error:", message)
            return { success: false, message }
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (interviewId) {
            getReportById(interviewId)
        } else {
            getReports()
        }
    }, [interviewId])

    return { loading, report, reports, generateReport, getReportById, getReports, getResumePdf }

}