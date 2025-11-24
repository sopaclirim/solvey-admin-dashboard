import { useEffect, useState } from 'react';
import Http from '../api/Http';
import Layout from '../components/Layout/Layout';
import { 
    FiBriefcase, 
    FiTrash2, 
    FiX, 
    FiUser, 
    FiMail, 
    FiCalendar, 
    FiMessageSquare,
    FiDownload,
    FiCheckCircle,
    FiXCircle,
    FiClock,
    FiEye,
    FiSend
} from 'react-icons/fi';
import EmailModal from '../components/EmailModal';
import DeleteConfirmationModal from '../components/DeleteConfirmationModal';
import ErrorModal from '../components/ErrorModal';

export default function Applications() {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedApplication, setSelectedApplication] = useState(null);
    const [emailModalOpen, setEmailModalOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [applicationToDelete, setApplicationToDelete] = useState(null);
    const [deleting, setDeleting] = useState(false);
    const [errorModalOpen, setErrorModalOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        fetchApplications();
    }, []);

    const fetchApplications = async () => {
        try {
            const { data } = await Http.get('/api/admin/applications');
            setApplications(data.data || []);
        } catch (error) {
            console.error('Error fetching applications:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!applicationToDelete) return;
        
        setDeleting(true);
        try {
            await Http.delete(`/api/admin/applications/${applicationToDelete}`);
            setApplications(applications.filter((a) => a._id !== applicationToDelete));
            if (selectedApplication?._id === applicationToDelete) {
                setSelectedApplication(null);
            }
            setDeleteModalOpen(false);
            setApplicationToDelete(null);
        } catch (error) {
            console.error('Error deleting application:', error);
            setErrorMessage(error.response?.data?.message || 'Failed to delete application');
            setErrorModalOpen(true);
        } finally {
            setDeleting(false);
        }
    };

    const updateStatus = async (id, status) => {
        try {
            await Http.put(`/api/admin/applications/${id}`, { status });
            setApplications(
                applications.map((a) => (a._id === id ? { ...a, status } : a))
            );
            if (selectedApplication?._id === id) {
                setSelectedApplication({ ...selectedApplication, status });
            }
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    const viewApplication = async (id) => {
        try {
            const { data } = await Http.get(`/api/admin/applications/${id}`);
            setSelectedApplication(data.data);
            fetchApplications();
        } catch (error) {
            console.error('Error fetching application:', error);
        }
    };

    const getStatusConfig = (status) => {
        const configs = {
            pending: {
                color: 'bg-yellow-100 text-yellow-700 border-yellow-200',
                icon: FiClock,
                label: 'Pending'
            },
            reviewed: {
                color: 'bg-blue-100 text-blue-700 border-blue-200',
                icon: FiEye,
                label: 'Reviewed'
            },
            accepted: {
                color: 'bg-green-100 text-green-700 border-green-200',
                icon: FiCheckCircle,
                label: 'Accepted'
            },
            rejected: {
                color: 'bg-red-100 text-red-700 border-red-200',
                icon: FiXCircle,
                label: 'Rejected'
            },
        };
        return configs[status] || configs.pending;
    };

    if (loading) {
        return (
            <Layout>
                <div className="flex items-center justify-center h-64">
                    <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="flex gap-6">
                <div className="flex-1">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Applications</h1>
                        <p className="text-gray-500">View and manage job applications</p>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        {applications.length === 0 ? (
                            <div className="p-12 text-center">
                                <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                                    <FiBriefcase className="text-gray-400" size={32} />
                                </div>
                                <p className="text-gray-500 text-lg">No applications yet</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-gray-200">
                                {applications.map((application) => {
                                    const statusConfig = getStatusConfig(application.status);
                                    const StatusIcon = statusConfig.icon;
                                    return (
                                        <div
                                            key={application._id}
                                            className={`p-6 hover:bg-gray-50 transition-colors ${
                                                !application.read ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                                            }`}
                                        >
                                            <div className="flex items-center justify-between">
                                                <div
                                                    className="flex-1 cursor-pointer"
                                                    onClick={() => viewApplication(application._id)}
                                                >
                                                    <div className="flex items-center gap-3 mb-2">
                                                        <FiUser className="text-gray-400" size={18} />
                                                        <p className="text-gray-900 font-semibold">
                                                            {application.fullName}
                                                        </p>
                                                        {!application.read && (
                                                            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                                                        )}
                                                    </div>
                                                    <div className="flex items-center gap-2 text-sm text-gray-600 ml-7 mb-2">
                                                        <FiMail size={14} />
                                                        {application.email}
                                                    </div>
                                                    <div className="ml-7">
                                                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border ${statusConfig.color}`}>
                                                            <StatusIcon size={12} />
                                                            {statusConfig.label}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="text-right flex items-center gap-4">
                                                    <div className="text-right">
                                                        <p className="text-gray-500 text-xs mb-1">
                                                            {new Date(application.createdAt).toLocaleDateString()}
                                                        </p>
                                                    </div>
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setApplicationToDelete(application._id);
                                                            setDeleteModalOpen(true);
                                                        }}
                                                        className="text-red-600 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition-colors"
                                                        title="Delete"
                                                    >
                                                        <FiTrash2 size={18} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>

                {selectedApplication && (
                    <div className="w-96 bg-white rounded-xl shadow-lg border border-gray-200 p-6 sticky top-6">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-gray-900">Application Details</h2>
                            <button
                                onClick={() => setSelectedApplication(null)}
                                className="text-gray-400 hover:text-gray-600 p-1 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <FiX size={20} />
                            </button>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
                                    <FiUser size={14} />
                                    Name
                                </div>
                                <p className="text-gray-900 font-medium">{selectedApplication.fullName}</p>
                            </div>
                            <div>
                                <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
                                    <FiMail size={14} />
                                    Email
                                </div>
                                <p className="text-gray-900">{selectedApplication.email}</p>
                            </div>
                            <div>
                                <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
                                    Status
                                </div>
                                <select
                                    value={selectedApplication.status}
                                    onChange={(e) =>
                                        updateStatus(selectedApplication._id, e.target.value)
                                    }
                                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                >
                                    <option value="pending">Pending</option>
                                    <option value="reviewed">Reviewed</option>
                                    <option value="accepted">Accepted</option>
                                    <option value="rejected">Rejected</option>
                                </select>
                            </div>
                            {selectedApplication.message && (
                                <div>
                                    <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
                                        <FiMessageSquare size={14} />
                                        Message
                                    </div>
                                    <p className="text-gray-700 whitespace-pre-wrap bg-gray-50 p-3 rounded-lg">
                                        {selectedApplication.message}
                                    </p>
                                </div>
                            )}
                            {selectedApplication.cv && (
                                <div>
                                    <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
                                        <FiDownload size={14} />
                                        CV
                                    </div>
                                    <button
                                        onClick={async () => {
                                            try {
                                                // Sigurohu që path është i saktë
                                                const cvPath = selectedApplication.cv.startsWith('/') 
                                                    ? selectedApplication.cv 
                                                    : `/${selectedApplication.cv}`;
                                                
                                                // Përdor Http (axios) që ka tashmë Authorization header
                                                const response = await Http.get(cvPath, {
                                                    responseType: 'blob' // E rëndësishme për file downloads
                                                });

                                                // Krijo download link
                                                const url = window.URL.createObjectURL(new Blob([response.data]));
                                                const link = document.createElement('a');
                                                link.href = url;
                                                link.setAttribute('download', `CV-${selectedApplication.fullName.replace(/\s+/g, '-')}-${Date.now()}.pdf`);
                                                document.body.appendChild(link);
                                                link.click();
                                                
                                                // Cleanup
                                                link.parentNode.removeChild(link);
                                                window.URL.revokeObjectURL(url);
                                            } catch (error) {
                                                console.error('Error downloading CV:', error);
                                                const errorMsg = error.response?.data?.message || error.message || 'Failed to download CV';
                                                setErrorMessage(errorMsg);
                                                setErrorModalOpen(true);
                                            }
                                        }}
                                        className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium hover:underline cursor-pointer"
                                    >
                                        <FiDownload size={16} />
                                        Download CV
                                    </button>
                                </div>
                            )}
                            <div>
                                <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
                                    <FiCalendar size={14} />
                                    Date
                                </div>
                                <p className="text-gray-700 text-sm">
                                    {new Date(selectedApplication.createdAt).toLocaleString()}
                                </p>
                            </div>
                            <div className="pt-4 border-t border-gray-200">
                                <button
                                    onClick={() => setEmailModalOpen(true)}
                                    className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
                                >
                                    <FiSend size={18} />
                                    Send Email Reply
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                <EmailModal
                    isOpen={emailModalOpen}
                    onClose={() => setEmailModalOpen(false)}
                    recipientEmail={selectedApplication?.email}
                    defaultSubject={selectedApplication ? `Re: Job Application - ${selectedApplication.fullName}` : ''}
                />

                <DeleteConfirmationModal
                    isOpen={deleteModalOpen}
                    onClose={() => {
                        setDeleteModalOpen(false);
                        setApplicationToDelete(null);
                    }}
                    onConfirm={handleDelete}
                    title="Delete Application"
                    message="Are you sure you want to delete this application? This action cannot be undone."
                    itemName={applications.find(a => a._id === applicationToDelete)?.fullName}
                    loading={deleting}
                />

                <ErrorModal
                    isOpen={errorModalOpen}
                    onClose={() => setErrorModalOpen(false)}
                    message={errorMessage}
                    title="Error"
                />
            </div>
        </Layout>
    );
}
