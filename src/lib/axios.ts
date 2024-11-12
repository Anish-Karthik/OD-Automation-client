import axios from "axios";

export const api = axios.create({
  baseURL: `http://localhost:3000/trpc`,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

export const auth = axios.create({
  baseURL: `http://localhost:3000/api/auth`,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});



export const flask = axios.create({
  baseURL: `https://result-analysis-server-nknm.onrender.com/`, 
  withCredentials: true,
});
