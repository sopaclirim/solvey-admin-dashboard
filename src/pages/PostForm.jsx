import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Http from '../api/Http';
import Layout from '../components/Layout/Layout';
import { FiArrowLeft, FiSave, FiX, FiFileText, FiTag, FiType, FiAlignLeft } from 'react-icons/fi';

export default function PostForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        title: '',
        content: '',
        excerpt: '',
        category: 'General',
        published: false,
    });

    useEffect(() => {
        if (id) {
            fetchPost();
        }
    }, [id]);

    const fetchPost = async () => {
        try {
            const { data } = await Http.get(`/api/admin/posts`);
            const post = data.data.find((p) => p._id === id);
            if (post) {
                setForm({
                    title: post.title || '',
                    content: post.content || '',
                    excerpt: post.excerpt || '',
                    category: post.category || 'General',
                    published: post.published || false,
                });
            }
        } catch (error) {
            console.error('Error fetching post:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (id) {
                await Http.put(`/api/admin/posts/${id}`, form);
            } else {
                await Http.post('/api/admin/posts', form);
            }
            navigate('/posts');
        } catch (error) {
            console.error('Error saving post:', error);
            alert('Failed to save post');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout>
            <div className="max-w-4xl">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                            {id ? 'Edit Post' : 'Create New Post'}
                        </h1>
                        <p className="text-gray-500">
                            {id ? 'Update your post content' : 'Write a new blog post'}
                        </p>
                    </div>
                    <button
                        onClick={() => navigate('/posts')}
                        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <FiArrowLeft size={20} />
                        <span className="hidden sm:inline">Back</span>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                            <FiType size={16} />
                            Title *
                        </label>
                        <input
                            type="text"
                            value={form.title}
                            onChange={(e) => setForm({ ...form, title: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                            placeholder="Enter post title..."
                            required
                        />
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                            <FiFileText size={16} />
                            Excerpt
                        </label>
                        <textarea
                            value={form.excerpt}
                            onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
                            rows={3}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
                            placeholder="Short description of the post..."
                        />
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                            <FiTag size={16} />
                            Category
                        </label>
                        <input
                            type="text"
                            value={form.category}
                            onChange={(e) => setForm({ ...form, category: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                            placeholder="e.g., Technology, Design, Business"
                        />
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                            <FiAlignLeft size={16} />
                            Content *
                        </label>
                        <textarea
                            value={form.content}
                            onChange={(e) => setForm({ ...form, content: e.target.value })}
                            rows={20}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all font-mono text-sm resize-none"
                            required
                            placeholder="Write your post content here..."
                        />
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <label className="flex items-center gap-3 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={form.published}
                                onChange={(e) =>
                                    setForm({ ...form, published: e.target.checked })
                                }
                                className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            />
                            <span className="text-gray-700 font-medium">Publish this post</span>
                        </label>
                    </div>

                    <div className="flex gap-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    <span>Saving...</span>
                                </>
                            ) : (
                                <>
                                    <FiSave size={20} />
                                    <span>{id ? 'Update Post' : 'Create Post'}</span>
                                </>
                            )}
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate('/posts')}
                            className="flex items-center gap-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold py-3 px-6 rounded-lg transition-colors"
                        >
                            <FiX size={20} />
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </Layout>
    );
}
