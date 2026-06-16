"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Send, MessageCircle, Heart, UserPlus, Image as ImageIcon, MessageSquare, Search } from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";

export default function CommunityPage() {
    const { data: session } = useSession();
    const [posts, setPosts] = useState<any[]>([]);
    const [newPostContent, setNewPostContent] = useState("");
    const [activeTab, setActiveTab] = useState<"feed" | "messages">("feed");
    const [loading, setLoading] = useState(true);

    const fetchPosts = async () => {
        try {
            const res = await fetch("/api/community/posts");
            if (res.ok) {
                const data = await res.json();
                setPosts(data);
            }
        } catch (error) {
            console.error("Failed to fetch posts", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    const handleCreatePost = async () => {
        if (!newPostContent.trim() || !session) return;
        try {
            const res = await fetch("/api/community/posts", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ content: newPostContent }),
            });
            if (res.ok) {
                const post = await res.json();
                setPosts([post, ...posts]);
                setNewPostContent("");
            }
        } catch (error) {
            console.error("Failed to create post", error);
        }
    };

    const toggleLike = async (postId: string) => {
        if (!session) return alert("Vui lòng đăng nhập để thích bài viết!");
        
        // Optimistic UI update
        const updatedPosts = posts.map(p => {
            if (p.id === postId) {
                const isLiked = p.likes.some((l: any) => l.userId === session?.user?.id);
                return {
                    ...p,
                    _count: { ...p._count, likes: p._count.likes + (isLiked ? -1 : 1) },
                    likes: isLiked 
                        ? p.likes.filter((l: any) => l.userId !== session?.user?.id)
                        : [...p.likes, { userId: session?.user?.id }]
                };
            }
            return p;
        });
        setPosts(updatedPosts);

        try {
            await fetch(`/api/community/posts/${postId}/like`, { method: "POST" });
        } catch (error) {
            console.error("Failed to toggle like", error);
            fetchPosts(); // revert on fail
        }
    };

    if (loading) return <div className="h-screen w-full bg-[#121212] flex items-center justify-center text-white">Đang tải dữ liệu...</div>;

    return (
        <div className="flex flex-col h-screen bg-[#121212] overflow-hidden text-gray-200">
            {/* Navbar */}
            <div className="flex-shrink-0 flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#1a1a1a]/80 backdrop-blur-md z-50">
                <div className="flex items-center gap-6">
                    <Link href="/" className="flex items-center gap-2 hover:text-white transition-colors text-gray-400">
                        <ArrowLeft size={20} />
                        <span className="font-bold hidden md:inline">QUAY LẠI</span>
                    </Link>
                    <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent tracking-tighter">
                        CỘNG ĐỒNG MINECRAFT
                    </h1>
                </div>
                <div className="flex gap-2">
                    <button 
                        onClick={() => setActiveTab("feed")}
                        className={`px-4 py-2 rounded-lg font-bold text-sm transition-all flex items-center gap-2 ${activeTab === "feed" ? "bg-purple-600 text-white" : "bg-white/5 hover:bg-white/10"}`}
                    >
                        <MessageSquare size={16} /> Bảng tin
                    </button>
                    <button 
                        onClick={() => setActiveTab("messages")}
                        className={`px-4 py-2 rounded-lg font-bold text-sm transition-all flex items-center gap-2 ${activeTab === "messages" ? "bg-blue-600 text-white" : "bg-white/5 hover:bg-white/10"}`}
                    >
                        <MessageCircle size={16} /> Tin nhắn
                    </button>
                </div>
            </div>

            {/* Main Layout */}
            <div className="flex-1 flex overflow-hidden max-w-7xl mx-auto w-full">
                {/* Left Sidebar (Desktop) */}
                <div className="hidden lg:flex w-64 flex-col border-r border-white/10 bg-[#161616] p-4">
                    <div className="mb-6">
                        <h2 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">MENU</h2>
                        <ul className="space-y-2">
                            <li className="flex items-center gap-3 p-3 rounded-lg bg-white/5 text-white font-medium cursor-pointer hover:bg-white/10 transition-colors">
                                <MessageSquare size={18} className="text-purple-400" /> Bảng tin chính
                            </li>
                            <li className="flex items-center gap-3 p-3 rounded-lg text-gray-400 font-medium cursor-pointer hover:bg-white/5 transition-colors">
                                <UserPlus size={18} className="text-blue-400" /> Đang theo dõi
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Center Content (Feed) */}
                <div className="flex-1 overflow-y-auto custom-scrollbar p-4 md:p-6 bg-[#0a0a0a]">
                    {activeTab === "feed" && (
                        <div className="max-w-2xl mx-auto space-y-6">
                            {/* Create Post */}
                            {session ? (
                                <div className="bg-[#1e1e1e] rounded-xl p-4 border border-white/5 shadow-xl">
                                    <div className="flex gap-3">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-blue-500 shrink-0"></div>
                                        <textarea 
                                            value={newPostContent}
                                            onChange={(e) => setNewPostContent(e.target.value)}
                                            placeholder="Bạn đang nghĩ gì về thế giới Minecraft?"
                                            className="flex-1 bg-transparent border-none resize-none outline-none text-white placeholder-gray-500 min-h-[80px]"
                                        />
                                    </div>
                                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/5">
                                        <button className="flex items-center gap-2 text-gray-400 hover:text-green-400 transition-colors text-sm font-medium px-2 py-1 rounded hover:bg-white/5">
                                            <ImageIcon size={18} /> Thêm ảnh
                                        </button>
                                        <button 
                                            onClick={handleCreatePost}
                                            disabled={!newPostContent.trim()}
                                            className="bg-purple-600 hover:bg-purple-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-1.5 px-6 rounded-lg text-sm transition-all flex items-center gap-2"
                                        >
                                            <Send size={14} /> Đăng bài
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="bg-gradient-to-r from-purple-900/40 to-blue-900/40 border border-purple-500/30 rounded-xl p-6 text-center">
                                    <h3 className="text-lg font-bold text-white mb-2">Tham gia cộng đồng Minecraft Web!</h3>
                                    <p className="text-gray-400 text-sm mb-4">Đăng nhập để chia sẻ công trình, script và giao lưu với những người chơi khác.</p>
                                    <Link href="/auth/signin">
                                        <button className="bg-white text-black font-bold py-2 px-6 rounded-lg hover:bg-gray-200 transition-colors">Đăng nhập ngay</button>
                                    </Link>
                                </div>
                            )}

                            {/* Posts List */}
                            <div className="space-y-4">
                                {posts.map((post) => (
                                    <motion.div 
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        key={post.id} 
                                        className="bg-[#1a1a1a] rounded-xl border border-white/5 overflow-hidden shadow-lg hover:border-white/10 transition-colors"
                                    >
                                        <div className="p-4">
                                            <div className="flex items-center justify-between mb-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-gray-700 overflow-hidden">
                                                        {post.author.image ? <img src={post.author.image} alt={post.author.name} /> : <div className="w-full h-full bg-gradient-to-br from-pink-500 to-orange-400"></div>}
                                                    </div>
                                                    <div>
                                                        <h4 className="font-bold text-white text-sm">{post.author.name}</h4>
                                                        <span className="text-xs text-gray-500">{formatDistanceToNow(new Date(post.createdAt), { addSuffix: true, locale: vi })}</span>
                                                    </div>
                                                </div>
                                                <button className="text-blue-400 hover:text-blue-300 text-xs font-bold bg-blue-400/10 px-3 py-1 rounded-full">Follow</button>
                                            </div>
                                            <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">{post.content}</p>
                                            {post.imageUrl && (
                                                <div className="mt-3 rounded-lg overflow-hidden border border-white/5">
                                                    <img src={post.imageUrl} alt="Post image" className="w-full object-cover" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="bg-[#151515] px-4 py-2 flex items-center justify-between border-t border-white/5 text-sm">
                                            <div className="flex items-center gap-4 text-gray-400">
                                                <button 
                                                    onClick={() => toggleLike(post.id)}
                                                    className={`flex items-center gap-1.5 hover:text-pink-500 transition-colors ${post.likes.some((l: any) => l.userId === session?.user?.id) ? "text-pink-500" : ""}`}
                                                >
                                                    <Heart size={16} className={post.likes.some((l: any) => l.userId === session?.user?.id) ? "fill-current" : ""} /> {post._count.likes}
                                                </button>
                                                <button className="flex items-center gap-1.5 hover:text-blue-400 transition-colors">
                                                    <MessageCircle size={16} /> {post._count.comments}
                                                </button>
                                            </div>
                                            <button className="text-gray-500 hover:text-gray-300"><Send size={16} /></button>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === "messages" && (
                        <div className="h-full flex items-center justify-center flex-col text-center space-y-4">
                            <MessageCircle size={64} className="text-gray-600" />
                            <div>
                                <h3 className="text-xl font-bold text-white">Tin nhắn trực tiếp</h3>
                                <p className="text-gray-400 mt-2">Tính năng đang trong giai đoạn Beta. Sắp ra mắt!</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Sidebar (Desktop) */}
                <div className="hidden xl:block w-80 border-l border-white/10 bg-[#161616] p-4 overflow-y-auto custom-scrollbar">
                    <div className="relative mb-6">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                        <input 
                            type="text" 
                            placeholder="Tìm kiếm người chơi, bài viết..." 
                            className="w-full bg-[#222] border border-white/5 rounded-full py-2 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-purple-500 transition-colors"
                        />
                    </div>

                    <div>
                        <h2 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Gợi ý kết bạn</h2>
                        <div className="space-y-4">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="flex items-center justify-between p-2 rounded-lg hover:bg-white/5 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-400 to-blue-500"></div>
                                        <div>
                                            <div className="text-sm font-bold text-white">Player_{Math.floor(Math.random() * 1000)}</div>
                                            <div className="text-xs text-gray-500">Người chơi mới</div>
                                        </div>
                                    </div>
                                    <button className="text-blue-400 hover:bg-blue-400/20 p-1.5 rounded-full transition-colors"><UserPlus size={16} /></button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
