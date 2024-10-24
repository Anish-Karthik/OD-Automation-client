import axios from "axios";

export const api = axios.create({
  baseURL: "https://od-automation.onrender.com/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export const auth = axios.create({
  baseURL: "https://od-automation.onrender.com/api/auth",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
  
});
