import axios from 'axios';

const Http = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080',
});

// Request interceptor - shton token në header
Http.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('sl_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor - handle 401 errors (unauthorized)
Http.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Token invalid ose skaduar - fshi token dhe redirect në login
            localStorage.removeItem('sl_token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default Http;


