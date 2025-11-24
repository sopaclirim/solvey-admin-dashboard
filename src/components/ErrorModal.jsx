import { FiX, FiAlertCircle } from 'react-icons/fi';

export default function ErrorModal({ isOpen, onClose, message, title = 'Error' }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
                <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-full">
                                <FiAlertCircle className="text-red-600" size={24} />
                            </div>
                            <h2 className="text-xl font-bold text-gray-900">{title}</h2>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 p-1 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <FiX size={20} />
                        </button>
                    </div>
                    
                    <p className="text-gray-600 mb-6">
                        {message}
                    </p>

                    <button
                        onClick={onClose}
                        className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
                    >
                        OK
                    </button>
                </div>
            </div>
        </div>
    );
}

