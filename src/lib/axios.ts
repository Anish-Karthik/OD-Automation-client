import axios from "axios";

export const api = axios.create({
  baseURL: `https://od-automation.onrender.com/trpc`,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

export const auth = axios.create({
  baseURL: `https://od-automation.onrender.com/api/auth`,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});



export const flask = axios.create({
  baseURL: `https://result-analysis-server-nknm.onrender.com/`, 
  withCredentials: true,
});
