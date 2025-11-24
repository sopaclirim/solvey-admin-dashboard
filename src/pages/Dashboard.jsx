import { useEffect, useState } from 'react';
import Http from '../api/Http';
import Layout from '../components/Layout/Layout';
import { FiFileText, FiMail, FiBriefcase, FiTrendingUp } from 'react-icons/fi';

export default function Dashboard() {
    const [stats, setStats] = useState({
        posts: 0,
        contacts: 0,
        applications: 0,
        unreadContacts: 0,
        unreadApplications: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const [postsRes, contactsRes, applicationsRes] = await Promise.all([
                Http.get('/api/admin/posts'),
                Http.get('/api/admin/contacts'),
                Http.get('/api/admin/applications'),
            ]);

            const posts = postsRes.data.data || [];
            const contacts = contactsRes.data.data || [];
            const applications = applicationsRes.data.data || [];

            setStats({
                posts: posts.length,
                contacts: contacts.length,
                applications: applications.length,
                unreadContacts: contacts.filter((c) => !c.read).length,
                unreadApplications: applications.filter((a) => !a.read).length,
            });
        } catch (error) {
            console.error('Error fetching stats:', error);
        } finally {
            setLoading(false);
        }
    };

    const statCards = [
        {
            title: 'Total Posts',
            value: stats.posts,
            icon: FiFileText,
            color: 'from-blue-500 to-blue-600',
            bgColor: 'bg-blue-50',
            textColor: 'text-blue-600',
        },
        {
            title: 'Total Contacts',
            value: stats.contacts,
            icon: FiMail,
            color: 'from-green-500 to-green-600',
            bgColor: 'bg-green-50',
            textColor: 'text-green-600',
            badge: stats.unreadContacts > 0 ? stats.unreadContacts : null,
        },
        {
            title: 'Total Applications',
            value: stats.applications,
            icon: FiBriefcase,
            color: 'from-purple-500 to-purple-600',
            bgColor: 'bg-purple-50',
            textColor: 'text-purple-600',
            badge: stats.unreadApplications > 0 ? stats.unreadApplications : null,
        },
    ];

    if (loading) {
        return (
            <Layout>
                <div className="flex items-center justify-center h-64">
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                        <p className="text-gray-500">Loading dashboard...</p>
                    </div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div>
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
                    <p className="text-gray-500">Welcome back! Here's what's happening today.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {statCards.map((stat, index) => {
                        const Icon = stat.icon;
                        return (
                            <div
                                key={index}
                                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <div className={`${stat.bgColor} p-3 rounded-lg`}>
                                        <Icon className={stat.textColor} size={24} />
                                    </div>
                                    {stat.badge && (
                                        <span className="bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
                                            {stat.badge} new
                                        </span>
                                    )}
                                </div>
                                <div>
                                    <p className="text-gray-500 text-sm mb-1">{stat.title}</p>
                                    <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-2 rounded-lg">
                            <FiTrendingUp className="text-white" size={20} />
                        </div>
                        <h2 className="text-xl font-semibold text-gray-900">Quick Actions</h2>
                    </div>
                    <p className="text-gray-500">Manage your content, contacts, and applications from the sidebar.</p>
                </div>
            </div>
        </Layout>
    );
}
