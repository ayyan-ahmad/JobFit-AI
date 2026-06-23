import axios from "axios";

const API_BASE_URL = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000",
  withCredentials: true  // Har request ke saath cookies automatically send hongi
})

// Response Interceptor — agar 401 aaye toh page reload karo (cookie already clear ho jaati hai server se)
API_BASE_URL.interceptors.response.use(
  (response) => response,
  (error) => {
    // 401 pe kuch nahi karna — server ne cookie clear kar di hogi
    return Promise.reject(error)
  }
)

export async function registerUser({ username, email, password }) {
  try {
    const response = await API_BASE_URL.post(
      "/api/auth/register",
      { username, email, password }
    );
    // Token cookie mein server set karta hai — frontend kuch store nahi karta
    return response.data;
  } catch (error) {
    console.error("Error registering user:", error);
    throw error;
  }
}


export async function loginUser({ email, password }) {
  try {
    const response = await API_BASE_URL.post(
      "/api/auth/login",
      { email, password }
    )
    // Token cookie mein server set karta hai — frontend kuch store nahi karta
    return response.data
  } catch (error) {
    console.error("Error logging in user:", error)
    throw error
  }
}


export async function logoutUser() {
  try {
    const response = await API_BASE_URL.get("/api/auth/logout")
    // Server ne cookie clear kar di — frontend kuch nahi karta
    return response.data
  } catch (error) {
    // Logout fail ho toh bhi user ko logout kar do
    console.error("Logout error:", error)
  }
}

export async function getMe() {
  try {
    const response = await API_BASE_URL.get("/api/auth/get-me")
    return response.data
  } catch (error) {
    return null
  }
}