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

            const element = document.createElement('div')
            element.innerHTML = html

            // Apply single-page constraints directly to the element
            element.style.width = '794px'      // A4 width at 96dpi
            element.style.maxHeight = '1123px' // A4 height at 96dpi
            element.style.overflow = 'hidden'
            element.style.boxSizing = 'border-box'

            document.body.appendChild(element)

            await html2pdf().set({
                margin: 0,
                filename: `resume_${interviewReportId}.pdf`,
                image: { type: 'jpeg', quality: 1 },
                html2canvas: {
                    scale: 1.5,
                    useCORS: true,
                    width: 794,
                    height: 1123,
                    windowWidth: 794,
                    scrollY: 0,
                },
                jsPDF: { unit: 'px', format: [794, 1123], orientation: 'portrait' },
                pagebreak: { mode: 'avoid-all' }
            }).from(element).save()

            document.body.removeChild(element)

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
    }, [ interviewId ])

    return { loading, report, reports, generateReport, getReportById, getReports, getResumePdf }

}