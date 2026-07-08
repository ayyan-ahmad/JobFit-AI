import axios from "axios";

// Same pattern as auth.api.js — shared axios instance with base URL from env
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000",
  withCredentials: true, // Cookies automatically send hongi
});

// Response Interceptor — errors ko propagate karo
apiClient.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error)
);

/**
 * Practice session start karta hai selected topics ke saath.
 * @param {string[]} topics - Selected topic IDs ka array
 * @returns {{ sessionId: string, questions: object[] }}
 */
export async function startPracticeSession(topics) {
  try {
    const response = await apiClient.post("/api/practice/start", { topics });
    return response.data;
  } catch (error) {
    console.error("Error starting practice session:", error);
    throw error;
  }
}

/**
 * Test ke baad answers evaluate karta hai Gemini AI se.
 * @param {string} sessionId - MongoDB session ID
 * @param {object[]} userAnswers - Array of { questionId, answer }
 * @returns {{ evaluation: object, detailedBreakdown: object[] }}
 */
export async function evaluateSession(sessionId, userAnswers) {
  try {
    const response = await apiClient.post("/api/practice/evaluate", {
      sessionId,
      userAnswers,
    });
    return response.data;
  } catch (error) {
    console.error("Error evaluating practice session:", error);
    throw error;
  }
}


/**
 * Logged-in user ki saari past practice sessions lata hai.
 */
export async function getPracticeHistory() {
  try {
    const response = await apiClient.get("/api/practice/history");
    return response.data;
  } catch (error) {
    console.error("Error fetching practice history:", error);
    throw error;
  }
}

/**
 * Ek specific practice session ki detail lata hai.
 */
export async function getPracticeSessionById(sessionId) {
  try {
    const response = await apiClient.get(`/api/practice/history/${sessionId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching practice session details:", error);
    throw error;
  }
}
