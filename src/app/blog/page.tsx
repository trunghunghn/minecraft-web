import { ArrowLeft, Calendar, Tag, ChevronRight, PenLine } from "lucide-react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

const CATEGORIES = ["Building Tips", "Redstone Guide", "Mod Reviews", "Server News", "Minecraft Life", "Technical", "General"];

export default async function BlogPage({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
    const { category } = await searchParams;
    const session = await auth();

    const posts = await prisma.post.findMany({
        where: {
            published: true,
            ...(category ? { category } : {})
        },
        include: {
            author: { select: { id: true, name: true, image: true } }
        },
        orderBy: { createdAt: "desc" },
    });

    const totalCount = await prisma.post.count({ where: { published: true } });

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
                    <div className="flex items-center gap-4">
                        <div className="hidden md:flex gap-4">
                            <div className="mc-card p-4 text-center min-w-[120px]">
                                <p className="text-gray-400 text-xs mb-1">BÀI VIẾT</p>
                                <p className="text-2xl font-bold text-green-500">{totalCount}</p>
                            </div>
                            <div className="mc-card p-4 text-center min-w-[120px]">
                                <p className="text-gray-400 text-xs mb-1">CHỦ ĐỀ</p>
                                <p className="text-2xl font-bold text-blue-500">{CATEGORIES.length}</p>
                            </div>
                        </div>
                        {session && (
                            <Link href="/blog/create"
                                className="mc-button flex items-center gap-2 py-2 bg-green-700 border-green-500 text-white font-bold">
                                <PenLine size={16} /> VIẾT BÀI
                            </Link>
                        )}
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Posts List */}
                    <div className="lg:col-span-2 space-y-8">
                        {posts.length === 0 ? (
                            <div className="mc-card p-16 text-center">
                                <div className="text-6xl mb-4">📝</div>
                                <h2 className="text-2xl font-bold text-white mb-2">Chưa có bài viết nào</h2>
                                <p className="text-gray-400 text-sm mb-6">
                                    {category ? `Không có bài viết trong chủ đề "${category}"` : "Hãy là người đầu tiên viết bài!"}
                                </p>
                                {session && (
                                    <Link href="/blog/create" className="mc-button inline-flex items-center gap-2 bg-green-700 border-green-500 text-white font-bold">
                                        <PenLine size={16} /> VIẾT BÀI ĐẦU TIÊN
                                    </Link>
                                )}
                            </div>
                        ) : (
                            posts.map((post) => (
                                <article key={post.id} className="mc-card overflow-hidden group hover:border-[#5ea135] transition-colors">
                                    <div className="flex flex-col md:flex-row">
                                        <div className="md:w-1/3 h-48 md:h-auto relative overflow-hidden bg-[#161616]">
                                            {post.imageUrl ? (
                                                <img
                                                    src={post.imageUrl}
                                                    alt={post.title}
                                                    className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-500 brightness-75 group-hover:brightness-100"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-6xl opacity-20 select-none">⛏</div>
                                            )}
                                            <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-sm px-2 py-1 rounded text-[10px] text-white flex items-center gap-1">
                                                <Tag size={12} className="text-green-500" /> {post.category || "General"}
                                            </div>
                                        </div>
                                        <div className="flex-1 p-6 flex flex-col justify-between">
                                            <div>
                                                <div className="flex items-center gap-4 mb-3">
                                                    <div className="flex items-center gap-2 text-gray-400 text-xs">
                                                        <Calendar size={14} />
                                                        {new Date(post.createdAt).toLocaleDateString("vi-VN")}
                                                    </div>
                                                    <div className="flex items-center gap-1.5 text-xs text-gray-500">
                                                        {post.author.image && (
                                                            <img src={post.author.image} className="w-4 h-4 rounded-full border border-white/10" alt="" />
                                                        )}
                                                        {post.author.name}
                                                    </div>
                                                </div>
                                                <h2 className="text-2xl font-bold text-white mb-4 group-hover:text-green-400 transition-colors">
                                                    {post.title}
                                                </h2>
                                                <p className="text-gray-400 text-sm leading-relaxed line-clamp-2">
                                                    {post.excerpt || post.content.substring(0, 200)}
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
                            ))
                        )}
                    </div>

                    {/* Sidebar */}
                    <aside className="space-y-8">
                        <div className="mc-card p-6">
                            <h3 className="text-lg font-bold text-white mb-4 border-b border-white/10 pb-2">CHỦ ĐỀ</h3>
                            <ul className="space-y-2">
                                <li>
                                    <Link
                                        href="/blog"
                                        className={`flex items-center justify-between w-full p-2 rounded hover:bg-white/5 transition-colors text-sm ${!category ? "text-green-400 font-bold" : "text-gray-400 hover:text-white"}`}
                                    >
                                        Tất cả
                                    </Link>
                                </li>
                                {CATEGORIES.map((cat) => (
                                    <li key={cat}>
                                        <Link
                                            href={`/blog?category=${encodeURIComponent(cat)}`}
                                            className={`flex items-center justify-between w-full p-2 rounded hover:bg-white/5 transition-colors text-sm ${category === cat ? "text-green-400 font-bold" : "text-gray-400 hover:text-white"}`}
                                        >
                                            {cat}
                                        </Link>
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

                        {session && (
                            <div className="mc-card p-6 bg-gradient-to-br from-blue-900/20 to-black/20 border-blue-900/40">
                                <h3 className="text-lg font-bold text-blue-400 mb-2">VIẾT BÀI MỚI</h3>
                                <p className="text-gray-400 text-xs leading-relaxed mb-4">
                                    Chia sẻ kinh nghiệm Minecraft của bạn với cộng đồng!
                                </p>
                                <Link href="/blog/create" className="mc-button w-full text-center block bg-blue-700 border-blue-500 text-white">
                                    BẮT ĐẦU VIẾT
                                </Link>
                            </div>
                        )}
                    </aside>
                </div>
            </div>
        </div>
    );
}
