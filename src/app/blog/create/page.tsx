"use client";

import { useState } from "react";
import { ArrowLeft, Image as ImageIcon, Eye, Send, Bold, Italic, Underline, List, Code, Tag } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const CATEGORIES = ["Building Tips", "Redstone Guide", "Mod Reviews", "Server News", "Minecraft Life", "Technical", "General"];

export default function BlogEditor() {
    const router = useRouter();
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [excerpt, setExcerpt] = useState("");
    const [category, setCategory] = useState("General");
    const [imageUrl, setImageUrl] = useState("");
    const [isPreview, setIsPreview] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");

    const handlePublish = async (publishNow: boolean) => {
        if (!title.trim()) {
            setError("Vui lòng nhập tiêu đề bài viết!");
            return;
        }
        if (!content.trim()) {
            setError("Vui lòng nhập nội dung bài viết!");
            return;
        }

        setError("");
        setIsSubmitting(true);

        try {
            const res = await fetch("/api/posts", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title,
                    content,
                    excerpt: excerpt || content.substring(0, 200),
                    category,
                    imageUrl: imageUrl || null,
                    published: publishNow,
                }),
            });

            if (!res.ok) {
                const data = await res.json();
                setError(data.error || "Đã xảy ra lỗi, thử lại nhé!");
                return;
            }

            const post = await res.json();
            router.push(`/blog/${post.id}`);
        } catch {
            setError("Lỗi kết nối. Vui lòng thử lại!");
        } finally {
            setIsSubmitting(false);
        }
    };

    const insertFormat = (before: string, after: string = "") => {
        const textarea = document.getElementById("blog-content") as HTMLTextAreaElement;
        if (!textarea) return;
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const selectedText = content.substring(start, end);
        const newContent =
            content.substring(0, start) +
            before + (selectedText || "text") + after +
            content.substring(end);
        setContent(newContent);
    };

    return (
        <div className="min-h-screen bg-[#1a1a1a] p-4 md:p-12">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <header className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <Link href="/blog" className="mc-button py-2 px-4 flex items-center gap-2">
                            <ArrowLeft size={18} /> THOÁT
                        </Link>
                        <h1 className="text-2xl font-bold text-white uppercase tracking-tighter">VIẾT BÀI MỚI</h1>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={() => setIsPreview(!isPreview)}
                            className="mc-button py-2 px-4 flex items-center gap-2"
                        >
                            {isPreview ? <ArrowLeft size={18} /> : <Eye size={18} />}
                            {isPreview ? "SỬA TIẾP" : "XEM TRƯỚC"}
                        </button>
                        <button
                            onClick={() => handlePublish(false)}
                            disabled={isSubmitting}
                            className="mc-button py-2 px-4 flex items-center gap-2 text-sm disabled:opacity-50"
                        >
                            Lưu nháp
                        </button>
                        <button
                            onClick={() => handlePublish(true)}
                            disabled={isSubmitting}
                            className="mc-button py-2 px-6 flex items-center gap-2 bg-green-600 font-bold border-green-400 text-white disabled:opacity-50"
                        >
                            <Send size={18} /> {isSubmitting ? "ĐANG ĐĂNG..." : "XUẤT BẢN"}
                        </button>
                    </div>
                </header>

                {error && (
                    <div className="mb-6 p-4 bg-red-900/30 border border-red-500/50 rounded-lg text-red-400 text-sm font-bold">
                        ⚠️ {error}
                    </div>
                )}

                {isPreview ? (
                    <div className="mc-card p-12 bg-[#1e1e1e] min-h-[600px]">
                        {imageUrl && (
                            <div className="mb-8 rounded-xl overflow-hidden">
                                <img src={imageUrl} alt="" className="w-full h-64 object-cover" />
                            </div>
                        )}
                        <div className="flex items-center gap-2 mb-4">
                            <span className="bg-green-600/20 border border-green-500/30 px-3 py-1 rounded-full text-xs text-green-400 font-bold">
                                {category}
                            </span>
                        </div>
                        <h1 className="text-5xl font-bold mb-6 text-white">{title || "Tiêu đề bài viết"}</h1>
                        {excerpt && (
                            <p className="text-gray-400 italic text-lg mb-8 border-l-4 border-green-600 pl-4">{excerpt}</p>
                        )}
                        <div className="text-gray-300 whitespace-pre-wrap leading-relaxed text-lg">
                            {content || "Nội dung bài viết sẽ hiển thị ở đây..."}
                        </div>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {/* Category + Image URL */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-xs text-gray-400 uppercase font-bold flex items-center gap-1">
                                    <Tag size={12} /> Chủ đề
                                </label>
                                <select
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    className="w-full bg-[#1e1e1e] border-2 border-white/5 focus:border-green-500 rounded-lg p-3 text-white outline-none transition-colors"
                                >
                                    {CATEGORIES.map(c => (
                                        <option key={c} value={c}>{c}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs text-gray-400 uppercase font-bold flex items-center gap-1">
                                    <ImageIcon size={12} /> URL Ảnh bìa (tuỳ chọn)
                                </label>
                                <input
                                    type="url"
                                    placeholder="https://example.com/image.jpg"
                                    value={imageUrl}
                                    onChange={(e) => setImageUrl(e.target.value)}
                                    className="w-full bg-[#1e1e1e] border-2 border-white/5 focus:border-green-500 rounded-lg p-3 text-white outline-none transition-colors placeholder-gray-600"
                                />
                            </div>
                        </div>

                        {/* Title */}
                        <input
                            type="text"
                            placeholder="Tiêu đề bài viết..."
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full bg-[#1e1e1e] border-2 border-white/5 focus:border-green-500 rounded-lg p-6 text-3xl font-bold text-white outline-none transition-colors placeholder-gray-700"
                        />

                        {/* Excerpt */}
                        <input
                            type="text"
                            placeholder="Tóm tắt ngắn (tuỳ chọn - sẽ hiển thị trong danh sách blog)..."
                            value={excerpt}
                            onChange={(e) => setExcerpt(e.target.value)}
                            className="w-full bg-[#1e1e1e] border-2 border-white/5 focus:border-blue-500 rounded-lg p-4 text-gray-300 outline-none transition-colors placeholder-gray-700"
                        />

                        {/* Toolbar */}
                        <div className="mc-card bg-[#1e1e1e] p-2 flex gap-1 flex-wrap">
                            {[
                                { icon: <Bold size={16} />, action: () => insertFormat("**", "**"), title: "Bold" },
                                { icon: <Italic size={16} />, action: () => insertFormat("*", "*"), title: "Italic" },
                                { icon: <Underline size={16} />, action: () => insertFormat("__", "__"), title: "Underline" },
                                { icon: <List size={16} />, action: () => insertFormat("\n- ", ""), title: "List" },
                                { icon: <Code size={16} />, action: () => insertFormat("`", "`"), title: "Code" },
                            ].map((btn, i) => (
                                <button
                                    key={i}
                                    onClick={btn.action}
                                    title={btn.title}
                                    className="p-2 hover:bg-white/10 rounded text-gray-400 hover:text-white transition-colors"
                                >
                                    {btn.icon}
                                </button>
                            ))}
                        </div>

                        {/* Content */}
                        <textarea
                            id="blog-content"
                            placeholder="Bắt đầu câu chuyện Minecraft của bạn tại đây..."
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            className="w-full bg-[#1e1e1e] border-2 border-white/5 focus:border-green-500 rounded-lg p-8 text-lg text-gray-300 outline-none transition-colors min-h-[500px] resize-none leading-relaxed placeholder-gray-700"
                        />

                        {/* Word count */}
                        <div className="text-right text-xs text-gray-600">
                            {content.split(/\s+/).filter(Boolean).length} từ · {content.length} ký tự
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
