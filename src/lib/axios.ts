import axios from "axios";

export const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL}/trpc`,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

export const auth = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL}/api/auth`,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});
