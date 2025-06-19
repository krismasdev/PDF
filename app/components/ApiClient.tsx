"use client";
import axios from "axios";

const api = axios.create({
  baseURL: "https://pdf-parse-backend-jucpmx4k4-smartguy4112-gmailcoms-projects.vercel.app/",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;