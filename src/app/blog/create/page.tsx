"use client";

import { useState } from "react";
import { Save, ArrowLeft, Image as ImageIcon, Eye, Send } from "lucide-react";
import Link from "next/link";

export default function BlogEditor() {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [isPreview, setIsPreview] = useState(false);

    return (
        <div className="min-h-screen bg-[#1a1a1a] p-4 md:p-12">
            <div className="max-w-4xl mx-auto">
                <header className="flex items-center justify-between mb-12">
                    <div className="flex items-center gap-4">
                        <Link href="/dashboard" className="mc-button py-2 px-4 flex items-center gap-2">
                            <ArrowLeft size={18} /> THOÁT
                        </Link>
                        <h1 className="text-2xl font-bold text-white uppercase tracking-tighter">VIẾT BÀI MỚI</h1>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={() => setIsPreview(!isPreview)}
                            className="mc-button py-2 px-6 flex items-center gap-2 bg-gray-600"
                        >
                            {isPreview ? <ArrowLeft size={18} /> : <Eye size={18} />} {isPreview ? "SỬA TIẾP" : "XEM TRƯỚC"}
                        </button>
                        <button className="mc-button py-2 px-6 flex items-center gap-2 bg-green-600 font-bold border-green-400">
                            <Send size={18} /> XUẤT BẢN
                        </button>
                    </div>
                </header>

                {isPreview ? (
                    <div className="mc-card p-12 bg-[#1e1e1e] min-h-[600px] prose prose-invert max-w-none">
                        <h1 className="text-5xl font-bold mb-8 text-white">{title || "Tiêu đề bài viết"}</h1>
                        <div className="text-gray-300 whitespace-pre-wrap leading-relaxed">
                            {content || "Nội dung bài viết sẽ hiển thị ở đây..."}
                        </div>
                    </div>
                ) : (
                    <div className="space-y-6">
                        <input
                            type="text"
                            placeholder="Tiêu đề bài viết..."
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full bg-[#1e1e1e] border-2 border-white/5 focus:border-green-500 rounded-lg p-6 text-3xl font-bold text-white outline-none transition-colors"
                        />

                        <div className="mc-card bg-[#1e1e1e] p-2 flex gap-2">
                            <button className="p-2 hover:bg-white/5 rounded text-gray-400 hover:text-white" title="Thêm ảnh">
                                <ImageIcon size={20} />
                            </button>
                            <div className="w-px h-6 bg-white/5 self-center" />
                            {["B", "I", "U", "List", "Code"].map(btn => (
                                <button key={btn} className="px-3 py-1 hover:bg-white/5 rounded text-xs font-bold text-gray-500 hover:text-white transition-colors">
                                    {btn}
                                </button>
                            ))}
                        </div>

                        <textarea
                            placeholder="Bắt đầu câu chuyện Minecraft của bạn tại đây..."
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            className="w-full bg-[#1e1e1e] border-2 border-white/5 focus:border-green-500 rounded-lg p-8 text-lg text-gray-300 outline-none transition-colors min-h-[500px] resize-none leading-relaxed"
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
