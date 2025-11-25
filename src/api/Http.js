import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

// Log API URL për debugging (vetëm në production për të identifikuar problemin)
if (import.meta.env.PROD) {
    console.log('🔧 API Base URL:', baseURL);
    console.log('🔧 VITE_API_URL env:', import.meta.env.VITE_API_URL || 'NOT SET - Using default localhost');
    if (!import.meta.env.VITE_API_URL) {
        console.warn('⚠️ VITE_API_URL nuk është vendosur! Vendos në Vercel Environment Variables.');
    }
}

const Http = axios.create({
    baseURL,
});

// Request interceptor - shton token në header
Http.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('sl_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        // Log request për debugging
        if (import.meta.env.PROD) {
            console.log('📤 Request:', config.method?.toUpperCase(), config.url);
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor - handle 401 errors (unauthorized)
Http.interceptors.response.use(
    (response) => {
        if (import.meta.env.PROD) {
            console.log('✅ Response:', response.config.method?.toUpperCase(), response.config.url, response.status);
        }
        return response;
    },
    (error) => {
        // Log error për debugging
        if (import.meta.env.PROD) {
            console.error('❌ API Error:', {
                url: error.config?.url,
                method: error.config?.method,
                status: error.response?.status,
                message: error.message,
                code: error.code,
                baseURL: error.config?.baseURL
            });
        }
        
        if (error.response?.status === 401) {
            // Token invalid ose skaduar - fshi token dhe redirect në login
            localStorage.removeItem('sl_token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default Http;


