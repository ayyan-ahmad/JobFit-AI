

import axios from "axios";

const API_BASE_URL = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000",
  withCredentials: true
})

export async function registerUser({ username, email, password }) {
  try {
    const response = await API_BASE_URL.post(
      "/api/auth/register",
      {
        username,
        email,
        password,
      }

    );

    return response.data;
  } catch (error) {
    console.error("Error registering user:", error);
  }
}


export async function loginUser({ email, password }) {
  try {
    const response = await API_BASE_URL.post(
      "/api/auth/login",
      {
        email,
        password
      }
    )
    return response.data
  } catch (error) {
    console.error("Error logging in user:", error)
    throw error
  }


}


export async function logoutUser() {
  try {
    const response = await API_BASE_URL.get("/api/auth/logout", {}, { withCredentials: true })
    return response.data
  } catch (error) {

  }
}

export async function getMe() {
  try {
    const response = await API_BASE_URL.get("/api/auth/get-me", { withCredentials: true })
    return response.data
  } catch (error) {
  }
}   