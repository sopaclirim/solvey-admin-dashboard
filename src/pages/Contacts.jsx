import { useEffect, useState } from 'react';
import Http from '../api/Http';
import Layout from '../components/Layout/Layout';
import { FiMail, FiTrash2, FiX, FiUser, FiCalendar, FiMessageSquare, FiSend } from 'react-icons/fi';
import EmailModal from '../components/EmailModal';
import DeleteConfirmationModal from '../components/DeleteConfirmationModal';
import ErrorModal from '../components/ErrorModal';

export default function Contacts() {
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedContact, setSelectedContact] = useState(null);
    const [emailModalOpen, setEmailModalOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [contactToDelete, setContactToDelete] = useState(null);
    const [deleting, setDeleting] = useState(false);
    const [errorModalOpen, setErrorModalOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        fetchContacts();
    }, []);

    const fetchContacts = async () => {
        try {
            const { data } = await Http.get('/api/admin/contacts');
            setContacts(data.data || []);
        } catch (error) {
            console.error('Error fetching contacts:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!contactToDelete) return;
        
        setDeleting(true);
        try {
            await Http.delete(`/api/admin/contacts/${contactToDelete}`);
            setContacts(contacts.filter((c) => c._id !== contactToDelete));
            if (selectedContact?._id === contactToDelete) {
                setSelectedContact(null);
            }
            setDeleteModalOpen(false);
            setContactToDelete(null);
        } catch (error) {
            console.error('Error deleting contact:', error);
            setErrorMessage(error.response?.data?.message || 'Failed to delete contact');
            setErrorModalOpen(true);
        } finally {
            setDeleting(false);
        }
    };

    const viewContact = async (id) => {
        try {
            const { data } = await Http.get(`/api/admin/contacts/${id}`);
            setSelectedContact(data.data);
            fetchContacts();
        } catch (error) {
            console.error('Error fetching contact:', error);
        }
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
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Contacts</h1>
                        <p className="text-gray-500">View and manage contact messages</p>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        {contacts.length === 0 ? (
                            <div className="p-12 text-center">
                                <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                                    <FiMail className="text-gray-400" size={32} />
                                </div>
                                <p className="text-gray-500 text-lg">No contacts yet</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-gray-200">
                                {contacts.map((contact) => (
                                    <div
                                        key={contact._id}
                                        className={`p-6 hover:bg-gray-50 cursor-pointer transition-colors ${
                                            !contact.read ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                                        }`}
                                        onClick={() => viewContact(contact._id)}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <FiUser className="text-gray-400" size={18} />
                                                    <p className="text-gray-900 font-semibold">
                                                        {contact.fullName}
                                                    </p>
                                                    {!contact.read && (
                                                        <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-2 text-sm text-gray-600 ml-7 mb-1">
                                                    <FiMail size={14} />
                                                    {contact.email}
                                                </div>
                                                <p className="text-gray-700 ml-7 font-medium">
                                                    {contact.subject}
                                                </p>
                                            </div>
                                            <div className="text-right flex items-center gap-4">
                                                <div className="text-right">
                                                    <p className="text-gray-500 text-xs mb-1">
                                                        {new Date(contact.createdAt).toLocaleDateString()}
                                                    </p>
                                                </div>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setContactToDelete(contact._id);
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
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {selectedContact && (
                    <div className="w-96 bg-white rounded-xl shadow-lg border border-gray-200 p-6 sticky top-6">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-gray-900">Contact Details</h2>
                            <button
                                onClick={() => setSelectedContact(null)}
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
                                <p className="text-gray-900 font-medium">{selectedContact.fullName}</p>
                            </div>
                            <div>
                                <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
                                    <FiMail size={14} />
                                    Email
                                </div>
                                <p className="text-gray-900">{selectedContact.email}</p>
                            </div>
                            <div>
                                <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
                                    <FiMessageSquare size={14} />
                                    Subject
                                </div>
                                <p className="text-gray-900 font-medium">{selectedContact.subject}</p>
                            </div>
                            <div>
                                <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
                                    <FiMessageSquare size={14} />
                                    Message
                                </div>
                                <p className="text-gray-700 whitespace-pre-wrap bg-gray-50 p-3 rounded-lg">
                                    {selectedContact.message}
                                </p>
                            </div>
                            <div>
                                <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
                                    <FiCalendar size={14} />
                                    Date
                                </div>
                                <p className="text-gray-700 text-sm">
                                    {new Date(selectedContact.createdAt).toLocaleString()}
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
                    recipientEmail={selectedContact?.email}
                    defaultSubject={selectedContact ? `Re: ${selectedContact.subject}` : ''}
                />

                <DeleteConfirmationModal
                    isOpen={deleteModalOpen}
                    onClose={() => {
                        setDeleteModalOpen(false);
                        setContactToDelete(null);
                    }}
                    onConfirm={handleDelete}
                    title="Delete Contact"
                    message="Are you sure you want to delete this contact? This action cannot be undone."
                    itemName={contacts.find(c => c._id === contactToDelete)?.fullName}
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
