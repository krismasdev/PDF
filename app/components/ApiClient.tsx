"use client";
import axios from "axios";

const api = axios.create({
  baseURL: "pdf-parse-backend-baqca8qkv-smartguy4112-gmailcoms-projects.vercel.app",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;