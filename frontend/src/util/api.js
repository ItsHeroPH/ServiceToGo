import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    timeout: 15000,
    headers: {
        "Content-Type": "application/json"
    },
    withCredentials: true
});

api.interceptors.request.use(
    (config) => {
        return config;
    },
    (error) => {
        console.log("%c[API ERROR]: %c" + error, "color: red; font-weight:bold;", "color: inherit;");
        return Promise.reject(error);
    }
)

api.interceptors.response.use(
    (response) => {
        return response.data;
    },
    (error) => {
        console.log("%c[API ERROR]: %c" + error, "color: red; font-weight:bold;", "color: inherit;");
        return Promise.reject(error);
    }
)

export default api;
