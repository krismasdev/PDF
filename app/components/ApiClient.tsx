"use client";
import axios from "axios";

const api = axios.create({
  baseURL: "https://pdf-parse-backend.vercel.app",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;