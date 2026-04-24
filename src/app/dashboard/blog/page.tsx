"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, Trash2, Edit, Eye, EyeOff, Plus, FileText, Globe } from "lucide-react";
import Link from "next/link";

interface Post {
    id: string;
    title: string;
    published: boolean;
    category: string | null;
    createdAt: string;
    excerpt: string | null;
}

export default function ManageBlogPage() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState<string | null>(null);

    useEffect(() => {
        fetch("/api/posts/mine")
            .then(r => r.json())
            .then(data => {
                if (Array.isArray(data)) setPosts(data);
            })
            .finally(() => setLoading(false));
    }, []);

    const handleDelete = async (id: string, title: string) => {
        if (!confirm(`Bạn có chắc muốn xóa "  ${title}"?`)) return;
        setDeleting(id);
        try {
            const res = await fetch(`/api/posts/${id}`, { method: "DELETE" });
            if (res.ok) {
                setPosts(prev => prev.filter(p => p.id !== id));
            } else {
                alert("Không thể xóa bài viết!");
            }
        } finally {
            setDeleting(null);
        }
    };

    const handleTogglePublish = async (id: string, currentPublished: boolean) => {
        try {
            const res = await fetch(`/api/posts/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ published: !currentPublished }),
            });
            if (res.ok) {
                setPosts(prev => prev.map(p => p.id === id ? { ...p, published: !currentPublished } : p));
            }
        } catch {
            alert("Lỗi khi cập nhật trạng thái!");
        }
    };

    return (
        <div className="min-h-screen bg-[#1a1a1a] p-4 md:p-12">
            <div className="max-w-4xl mx-auto">
                <header className="flex items-center justify-between mb-10">
                    <div className="flex items-center gap-4">
                        <Link href="/dashboard" className="mc-button flex items-center gap-2 py-2 px-4">
                            <ArrowLeft size={16} /> DASHBOARD
                        </Link>
                        <div>
                            <h1 className="text-2xl font-bold text-white uppercase tracking-tighter">Quản Lý Blog</h1>
                            <p className="text-gray-500 text-xs">{posts.length} bài viết</p>
                        </div>
                    </div>
                    <Link href="/blog/create" className="mc-button flex items-center gap-2 py-2 bg-green-700 border-green-500 text-white font-bold">
                        <Plus size={16} /> VIẾT MỚI
                    </Link>
                </header>

                {loading ? (
                    <div className="flex items-center justify-center py-24">
                        <div className="text-gray-500 text-sm animate-pulse">Đang tải...</div>
                    </div>
                ) : posts.length === 0 ? (
                    <div className="mc-card p-16 text-center">
                        <div className="text-6xl mb-4">📝</div>
                        <h2 className="text-xl font-bold text-white mb-2">Chưa có bài viết nào</h2>
                        <p className="text-gray-400 text-sm mb-6">Hãy bắt đầu viết bài đầu tiên của bạn!</p>
                        <Link href="/blog/create" className="mc-button inline-flex items-center gap-2 bg-green-700 border-green-500 text-white">
                            <Plus size={16} /> BẮT ĐẦU VIẾT
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {posts.map(post => (
                            <div key={post.id}
                                className="mc-card p-5 flex items-center justify-between gap-4 hover:border-white/20 transition-colors">
                                <div className="flex items-center gap-4 min-w-0">
                                    <div className={`flex-shrink-0 p-2 rounded ${post.published ? "bg-green-500/10 text-green-500" : "bg-yellow-500/10 text-yellow-500"}`}>
                                        <FileText size={18} />
                                    </div>
                                    <div className="min-w-0">
                                        <h3 className="text-white font-bold text-sm truncate">{post.title}</h3>
                                        <div className="flex items-center gap-3 mt-1">
                                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${post.published
                                                ? "bg-green-900/40 text-green-400 border border-green-700/40"
                                                : "bg-yellow-900/40 text-yellow-400 border border-yellow-700/40"
                                                }`}>
                                                {post.published ? "Đã đăng" : "Nháp"}
                                            </span>
                                            {post.category && (
                                                <span className="text-[10px] text-gray-500">{post.category}</span>
                                            )}
                                            <span className="text-[10px] text-gray-600">
                                                {new Date(post.createdAt).toLocaleDateString("vi-VN")}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 flex-shrink-0">
                                    {post.published && (
                                        <Link href={`/blog/${post.id}`} target="_blank"
                                            className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded transition-colors" title="Xem bài">
                                            <Globe size={16} />
                                        </Link>
                                    )}
                                    <button
                                        onClick={() => handleTogglePublish(post.id, post.published)}
                                        title={post.published ? "Ẩn bài viết" : "Đăng bài viết"}
                                        className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded transition-colors"
                                    >
                                        {post.published ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                    <button
                                        onClick={() => handleDelete(post.id, post.title)}
                                        disabled={deleting === post.id}
                                        title="Xóa bài viết"
                                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-500/5 rounded transition-colors disabled:opacity-50"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
