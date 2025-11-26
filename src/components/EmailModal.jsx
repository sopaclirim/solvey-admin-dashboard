import { useState, useEffect } from 'react';
import { FiX, FiSend, FiMail, FiType, FiAlignLeft } from 'react-icons/fi';
import Http from '../api/Http';

export default function EmailModal({ isOpen, onClose, recipientEmail, defaultSubject = '' }) {
    const [form, setForm] = useState({
        to: recipientEmail || '',
        subject: defaultSubject || '',
        message: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    // Update form kur modal hapet me recipientEmail të ri
    useEffect(() => {
        if (isOpen) {
            setForm({
                to: recipientEmail || '',
                subject: defaultSubject || '',
                message: ''
            });
            setError('');
            setSuccess(false);
        }
    }, [isOpen, recipientEmail, defaultSubject]);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            console.log('📧 Starting email send request...', {
                to: form.to.trim(),
                subject: form.subject.trim(),
                messageLength: form.message.trim().length
            });
            
            // Sigurohu që të dhënat janë të pastra dhe të valida
            const emailData = {
                to: form.to.trim(),
                subject: form.subject.trim(),
                message: form.message.trim()
            };
            
            // Validation
            if (!emailData.to || !emailData.subject || !emailData.message) {
                setError('Please fill in all fields');
                setLoading(false);
                return;
            }
            
            console.log('📧 Email payload:', emailData);
            console.log('📧 Token check:', localStorage.getItem('sl_token') ? 'Token exists' : 'NO TOKEN!');
            
            const startTime = Date.now();
            const response = await Http.post('/api/admin/send-email', emailData, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            const duration = Date.now() - startTime;
            console.log(`📧 Email send completed in ${duration}ms`, response.data);

            if (response.data.success) {
                setSuccess(true);
                setTimeout(() => {
                    onClose();
                }, 2000);
            } else {
                setError(response.data.message || 'Failed to send email');
            }
        } catch (error) {
            console.error('Email send error:', error);
            console.error('Error details:', {
                message: error.message,
                code: error.code,
                status: error.response?.status,
                responseData: error.response?.data,
                responseHeaders: error.response?.headers,
                url: error.config?.url,
                baseURL: error.config?.baseURL
            });
            
            // Log full error response për debugging
            if (error.response?.data) {
                console.error('📧 Backend error response:', JSON.stringify(error.response.data, null, 2));
            }
            
            let errorMessage = 'Failed to send email.';
            
            // Timeout error
            if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
                errorMessage = `Request timeout: Backend-i po merr shumë kohë për të dërguar email (më shumë se 60 sekonda). 
                
Kjo mund të ndodhë nëse:
- Email service (Gmail/SMTP) është i ngadaltë
- Backend-i ka problem me email configuration
- Network connection është e ngadaltë

Provo përsëri ose kontrollo backend logs.`;
            }
            // Network error - backend nuk është i aksesueshëm
            else if (error.code === 'ERR_NETWORK' || error.message.includes('Network Error') || error.message.includes('Failed to fetch')) {
                const baseURL = error.config?.baseURL || 'unknown';
                errorMessage = `Network error: Cannot connect to backend server. 
                
Current API URL: ${baseURL}

${baseURL.includes('localhost') ? 
    '⚠️ Problem: Po përdoret localhost URL në production! Vendos VITE_API_URL në Vercel Environment Variables me vlerën: https://solveylabs-backend.onrender.com' : 
    'Kontrollo që backend-i është online dhe i aksesueshëm.'}`;
            } 
            // CORS error
            else if (error.message.includes('CORS') || error.message.includes('cross-origin')) {
                errorMessage = 'CORS error: Backend-i nuk lejon requests nga ky domain. Kontrollo CORS settings në backend.';
            }
            // 404 - endpoint nuk ekziston
            else if (error.response?.status === 404) {
                errorMessage = `Backend endpoint not found (404). Kontrollo që URL-ja e backend-it është e saktë: ${error.config?.baseURL}`;
            }
            // 500 - server error
            else if (error.response?.status === 500) {
                const backendMessage = error.response?.data?.message || error.response?.data?.error || 'Unknown server error';
                const backendError = error.response?.data?.error || error.response?.data;
                errorMessage = `Server error (500): ${backendMessage}
                
Kjo është një problem në backend, jo në frontend. Kontrollo:
- Backend logs për detaje më specifike
- Email service configuration (Gmail SMTP settings)
- Backend environment variables për email

Backend error details: ${JSON.stringify(backendError, null, 2)}`;
            }
            // Të tjera
            else if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            } 
            else if (error.message) {
                errorMessage = error.message;
            }
            
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        if (!loading) {
            setForm({
                to: recipientEmail || '',
                subject: defaultSubject || '',
                message: ''
            });
            setError('');
            setSuccess(false);
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-gray-900">Send Email Reply</h2>
                    <button
                        onClick={handleClose}
                        disabled={loading}
                        className="text-gray-400 hover:text-gray-600 p-1 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
                    >
                        <FiX size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {error && (
                        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded">
                            <p className="text-sm font-medium">Error</p>
                            <p className="text-sm mt-1">{error}</p>
                        </div>
                    )}

                    {success && (
                        <div className="bg-green-50 border-l-4 border-green-500 text-green-700 px-4 py-3 rounded">
                            <p className="text-sm">Email sent!</p>
                        </div>
                    )}

                    <div>
                        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                            <FiMail size={16} />
                            To
                        </label>
                        <input
                            type="email"
                            value={form.to}
                            onChange={(e) => setForm({ ...form, to: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                            placeholder="recipient@example.com"
                            required
                            disabled={loading || !!recipientEmail}
                        />
                        {recipientEmail && (
                            <p className="text-xs text-gray-500 mt-1">Email is pre-filled from contact/application</p>
                        )}
                    </div>

                    <div>
                        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                            <FiType size={16} />
                            Subject
                        </label>
                        <input
                            type="text"
                            value={form.subject}
                            onChange={(e) => setForm({ ...form, subject: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                            placeholder="Re: Your inquiry"
                            required
                            disabled={loading}
                        />
                    </div>

                    <div>
                        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                            <FiAlignLeft size={16} />
                            Message
                        </label>
                        <textarea
                            value={form.message}
                            onChange={(e) => setForm({ ...form, message: e.target.value })}
                            rows={12}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
                            placeholder="Write your reply message here..."
                            required
                            disabled={loading}
                        />
                        <p className="text-xs text-gray-500 mt-2">
                            Tip: You can ask for additional information if needed.
                        </p>
                    </div>

                    <div className="flex gap-4 pt-4 border-t border-gray-200">
                        <button
                            type="submit"
                            disabled={loading || success}
                            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex-1"
                        >
                            {loading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    <span>Sending...</span>
                                </>
                            ) : (
                                <>
                                    <FiSend size={20} />
                                    <span>Send Email</span>
                                </>
                            )}
                        </button>
                        <button
                            type="button"
                            onClick={handleClose}
                            disabled={loading}
                            className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold py-3 px-6 rounded-lg transition-colors disabled:opacity-50"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
