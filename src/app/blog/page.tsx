import { ArrowLeft, Calendar, Tag, ChevronRight } from "lucide-react";
import Link from "next/link";

const MOCK_POSTS = [
    {
        id: "1",
        title: "Hướng dẫn xây dựng lâu đài Trung Cổ trong 1.12.2",
        excerpt: "Khám phá những kỹ thuật xây dựng độc đáo và cách sử dụng các block mới trong phiên bản 1.12.2 để tạo nên một lâu đài tráng lệ.",
        date: "2026-02-13",
        category: "Building",
        image: "https://www.minecraft.net/content/dam/games/minecraft/key-art/Minecraft-1.20-Trails-and-Tales-Update_KeyArt_1920x1080.jpg",
    },
    {
        id: "2",
        title: "Top 5 Mod tốt nhất cho Minecraft 1.12.2 (Gọn nhẹ)",
        excerpt: "Danh sách những bản mod giúp tăng trải nghiệm gameplay nhưng vẫn giữ được độ ổn định và nhẹ nhàng cho trình duyệt.",
        date: "2026-02-12",
        category: "Mods",
        image: "https://www.minecraft.net/content/dam/minecraft/blog/world-of-colors-header.jpg",
    },
    {
        id: "3",
        title: "Lập trình Redstone nâng cao bằng Scripting",
        excerpt: "Cách kết hợp giữa hệ thống Redstone truyền thống và JavaScript để tạo ra những cỗ máy tự động hóa hoàn toàn.",
        date: "2026-02-10",
        category: "Technical",
        image: "https://www.minecraft.net/content/dam/minecraft/blog/redstone-header.jpg",
    },
];

export default function BlogPage() {
    return (
        <div className="min-h-screen bg-[#1e1e1e] p-4 md:p-12">
            <div className="max-w-6xl mx-auto">
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-16">
                    <div>
                        <Link href="/" className="mc-button inline-flex items-center gap-2 py-2 mb-6">
                            <ArrowLeft size={18} /> TRANG CHỦ
                        </Link>
                        <h1 className="text-5xl font-bold text-white tracking-tighter">MINECRAFT BLOG</h1>
                        <p className="text-gray-400 mt-2">Chia sẻ kiến thức, kinh nghiệm và niềm đam mê Minecraft.</p>
                    </div>
                    <div className="hidden md:flex gap-4">
                        <div className="mc-card p-4 text-center min-w-[120px]">
                            <p className="text-gray-400 text-xs mb-1">BÀI VIẾT</p>
                            <p className="text-2xl font-bold text-green-500">12</p>
                        </div>
                        <div className="mc-card p-4 text-center min-w-[120px]">
                            <p className="text-gray-400 text-xs mb-1">CHỦ ĐỀ</p>
                            <p className="text-2xl font-bold text-blue-500">5</p>
                        </div>
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Posts List */}
                    <div className="lg:col-span-2 space-y-8">
                        {MOCK_POSTS.map((post) => (
                            <article key={post.id} className="mc-card overflow-hidden group hover:border-[#5ea135] transition-colors">
                                <div className="flex flex-col md:flex-row">
                                    <div className="md:w-1/3 h-48 md:h-auto relative overflow-hidden">
                                        <img
                                            src={post.image}
                                            alt={post.title}
                                            className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-500 brightness-75 group-hover:brightness-100"
                                        />
                                        <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-sm px-2 py-1 rounded text-[10px] text-white flex items-center gap-1">
                                            <Tag size={12} className="text-green-500" /> {post.category}
                                        </div>
                                    </div>
                                    <div className="flex-1 p-6 flex flex-col justify-between">
                                        <div>
                                            <div className="flex items-center gap-2 text-gray-400 text-xs mb-3">
                                                <Calendar size={14} /> {post.date}
                                            </div>
                                            <h2 className="text-2xl font-bold text-white mb-4 group-hover:text-green-400 transition-colors">
                                                {post.title}
                                            </h2>
                                            <p className="text-gray-400 text-sm leading-relaxed line-clamp-2">
                                                {post.excerpt}
                                            </p>
                                        </div>
                                        <Link
                                            href={`/blog/${post.id}`}
                                            className="mc-button mt-6 text-sm py-2 flex items-center justify-center gap-2 self-start px-6"
                                        >
                                            ĐỌC BÀI VIẾT <ChevronRight size={16} />
                                        </Link>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>

                    {/* Sidebar */}
                    <aside className="space-y-8">
                        <div className="mc-card p-6">
                            <h3 className="text-lg font-bold text-white mb-4 border-b border-white/10 pb-2">CHỦ ĐỀ</h3>
                            <ul className="space-y-3">
                                {["Building Tips", "Redstone Guide", "Mod Reviews", "Server News", "Minecraft Life"].map((cat) => (
                                    <li key={cat}>
                                        <button className="flex items-center justify-between w-full p-2 rounded hover:bg-white/5 transition-colors text-gray-400 hover:text-white text-sm">
                                            {cat} <span className="mc-card px-2 py-0.5 text-[10px] border-none bg-black/40">4</span>
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="mc-card p-6 bg-gradient-to-br from-green-900/20 to-black/20 border-green-900/40">
                            <h3 className="text-lg font-bold text-green-500 mb-2">BẠN MUỐN THỬ?</h3>
                            <p className="text-gray-400 text-xs leading-relaxed mb-4">
                                Trải nghiệm Minecraft 1.12.2 ngay trên trình duyệt và tự tay lập trình thế giới của mình.
                            </p>
                            <Link href="/play" className="mc-button w-full text-center block bg-green-600 border-green-400 text-white shadow-green-900/50">
                                CHƠI NGAY
                            </Link>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
}
