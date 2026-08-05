import axios from "axios";

const api = axios.create({
  baseURL: "https://memory-verse-ai-backend.onrender.com",
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;