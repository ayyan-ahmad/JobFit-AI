import axios from "axios";

const API_BASE_URL = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000",
  withCredentials: true
})

// Request Interceptor — har request mein localStorage token header mein add karo
API_BASE_URL.interceptors.request.use((config) => {
  const token = localStorage.getItem("token")
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Response Interceptor — agar 401 aaye toh token clear karo
API_BASE_URL.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token")
      // Storage event manually trigger karo (same tab ke liye)
      window.dispatchEvent(new StorageEvent("storage", { key: "token", newValue: null }))
    }
    return Promise.reject(error)
  }
)

export async function registerUser({ username, email, password }) {
  try {
    const response = await API_BASE_URL.post(
      "/api/auth/register",
      { username, email, password }
    );
    // Token localStorage mein save karo
    if (response.data?.token) {
      localStorage.setItem("token", response.data.token)
    }
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
    // Token localStorage mein save karo
    if (response.data?.token) {
      localStorage.setItem("token", response.data.token)
    }
    return response.data
  } catch (error) {
    console.error("Error logging in user:", error)
    throw error
  }
}


export async function logoutUser() {
  try {
    const response = await API_BASE_URL.get("/api/auth/logout")
    // Token localStorage se remove karo
    localStorage.removeItem("token")
    return response.data
  } catch (error) {
    localStorage.removeItem("token")
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