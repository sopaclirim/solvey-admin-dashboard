import { FiAlertTriangle, FiTrash2 } from 'react-icons/fi';

export default function DeleteConfirmationModal({ 
    isOpen, 
    onClose, 
    onConfirm, 
    title = 'Confirm Delete',
    message = 'Are you sure you want to delete this item?',
    itemName = '',
    loading = false
}) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
                <div className="p-6">
                    <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full">
                        <FiAlertTriangle className="text-red-600" size={32} />
                    </div>
                    
                    <h2 className="text-xl font-bold text-gray-900 text-center mb-2">
                        {title}
                    </h2>
                    
                    <p className="text-gray-600 text-center mb-6">
                        {message}
                        {itemName && (
                            <span className="font-semibold text-gray-900 block mt-2">
                                "{itemName}"
                            </span>
                        )}
                    </p>

                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            disabled={loading}
                            className="flex-1 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold py-3 px-4 rounded-lg transition-colors disabled:opacity-50"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={onConfirm}
                            disabled={loading}
                            className="flex-1 flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    <span>Deleting...</span>
                                </>
                            ) : (
                                <>
                                    <FiTrash2 size={18} />
                                    <span>Delete</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

