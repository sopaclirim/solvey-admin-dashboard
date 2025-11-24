import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
    FiLayout, 
    FiFileText, 
    FiMail, 
    FiBriefcase, 
    FiLogOut,
    FiMenu,
    FiX
} from 'react-icons/fi';
import { useState } from 'react';

export default function Sidebar() {
    const { logout } = useAuth();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const navItems = [
        { path: '/', label: 'Dashboard', icon: FiLayout },
        { path: '/posts', label: 'Posts', icon: FiFileText },
        { path: '/contacts', label: 'Contacts', icon: FiMail },
        { path: '/applications', label: 'Applications', icon: FiBriefcase },
    ];

    return (
        <>
            {/* Mobile menu button */}
            <div className="lg:hidden fixed top-4 left-4 z-50">
                <button
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    className="bg-gray-800 text-white p-2 rounded-lg hover:bg-gray-700 transition-colors"
                >
                    {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
                </button>
            </div>

            {/* Sidebar */}
            <div className={`
                fixed lg:static inset-y-0 left-0 z-40
                w-64 bg-gradient-to-b from-gray-900 to-gray-800 
                border-r border-gray-700
                transform ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                transition-transform duration-300 ease-in-out
                p-6
            `}>
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-white mb-1">Solvey Labs</h1>
                    <p className="text-gray-400 text-sm">Admin Dashboard</p>
                </div>

                <nav className="space-y-2">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        return (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                onClick={() => setMobileMenuOpen(false)}
                                className={({ isActive }) =>
                                    `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                                        isActive
                                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/50'
                                            : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                                    }`
                                }
                            >
                                <Icon size={20} />
                                <span className="font-medium">{item.label}</span>
                            </NavLink>
                        );
                    })}
                </nav>

                <div className="mt-8 pt-8 border-t border-gray-700">
                    <button
                        onClick={logout}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-red-600 hover:text-white transition-all duration-200"
                    >
                        <FiLogOut size={20} />
                        <span className="font-medium">Logout</span>
                    </button>
                </div>
            </div>

            {/* Overlay for mobile */}
            {mobileMenuOpen && (
                <div
                    className="lg:hidden fixed inset-0 bg-black/50 z-30"
                    onClick={() => setMobileMenuOpen(false)}
                />
            )}
        </>
    );
}
