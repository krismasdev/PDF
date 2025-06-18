"use client";
import axios from "axios";

const api = axios.create({
  baseURL: "https://pdf-backend-pela.onrender.com",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;