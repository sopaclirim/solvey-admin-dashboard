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
    timeout: 60000, // 60 sekonda timeout (email sending mund të marrë kohë)
});

// Request interceptor - shton token në header
Http.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('sl_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        } else {
            console.warn('⚠️ No token found in localStorage');
        }
        
        // Sigurohu që Content-Type është i saktë
        if (config.data && !config.headers['Content-Type']) {
            config.headers['Content-Type'] = 'application/json';
        }
        
        // Log request për debugging
        if (import.meta.env.PROD) {
            const timestamp = new Date().toISOString();
            console.log(`📤 [${timestamp}] Request:`, config.method?.toUpperCase(), config.url);
            if (config.url?.includes('send-email')) {
                console.log('📧 Email request details:', {
                    to: config.data?.to,
                    subject: config.data?.subject,
                    messageLength: config.data?.message?.length,
                    hasToken: !!token,
                    tokenLength: token?.length,
                    headers: {
                        'Content-Type': config.headers['Content-Type'],
                        'Authorization': token ? 'Bearer ***' : 'MISSING'
                    }
                });
            }
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
            const timestamp = new Date().toISOString();
            console.log(`✅ [${timestamp}] Response:`, response.config.method?.toUpperCase(), response.config.url, response.status);
            if (response.config.url?.includes('send-email')) {
                console.log('📧 Email response:', response.data);
            }
        }
        return response;
    },
    (error) => {
        // Log error për debugging
        if (import.meta.env.PROD) {
            const timestamp = new Date().toISOString();
            console.error(`❌ [${timestamp}] API Error:`, {
                url: error.config?.url,
                method: error.config?.method,
                status: error.response?.status,
                message: error.message,
                code: error.code,
                baseURL: error.config?.baseURL,
                timeout: error.code === 'ECONNABORTED' ? 'Request timeout!' : null
            });
            
            if (error.code === 'ECONNABORTED') {
                console.error('⏱️ Request timeout! Backend-i po merr shumë kohë për të dërguar email.');
            }
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


