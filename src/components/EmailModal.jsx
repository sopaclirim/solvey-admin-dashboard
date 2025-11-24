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
            const response = await Http.post('/api/admin/send-email', {
                to: form.to.trim(),
                subject: form.subject.trim(),
                message: form.message.trim()
            });

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
            const errorMessage = error.response?.data?.message || 
                                error.message || 
                                'Failed to send email. Please check your email configuration in backend .env file.';
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
