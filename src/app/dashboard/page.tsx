import { auth, signOut } from "@/auth";
import { prisma } from "@/lib/prisma";
import { ArrowLeft, Play, Layout, FileText, User, ChevronRight, LogOut, Plus } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
    const session = await auth();

    if (!session?.user?.id) {
        redirect("/auth/signin");
    }

    const userId = session.user.id;

    // Lấy số liệu thật từ database
    const [postCount, scriptCount, recentPosts, recentScripts] = await Promise.all([
        prisma.post.count({ where: { authorId: userId } }),
        prisma.script.count({ where: { userId } }),
        prisma.post.findMany({
            where: { authorId: userId },
            orderBy: { createdAt: "desc" },
            take: 3,
            select: { id: true, title: true, published: true, createdAt: true }
        }),
        prisma.script.findMany({
            where: { userId },
            orderBy: { createdAt: "desc" },
            take: 3,
            select: { id: true, name: true, createdAt: true }
        }),
    ]);

    const stats = [
        { label: "Bài viết", value: postCount.toString(), color: "text-purple-500" },
        { label: "Số script", value: scriptCount.toString(), color: "text-blue-500" },
        { label: "Thành tựu", value: "—", color: "text-orange-500" },
        { label: "Giờ chơi", value: "—", color: "text-green-500" },
    ];

    const formatRelativeTime = (date: Date) => {
        const diff = Date.now() - date.getTime();
        const mins = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);
        if (mins < 60) return `${mins} phút trước`;
        if (hours < 24) return `${hours} giờ trước`;
        return `${days} ngày trước`;
    };

    return (
        <div className="min-h-screen bg-[#1a1a1a] flex">
            {/* Sidebar */}
            <aside className="w-64 bg-[#1e1e1e] border-r border-white/5 hidden md:flex flex-col p-6">
                <div className="mb-12">
                    <h2 className="text-2xl font-bold text-white tracking-tighter">MC-WEB <span className="text-green-500 uppercase text-xs">Admin</span></h2>
                </div>

                <nav className="flex-1 space-y-2">
                    {[
                        { icon: <Layout size={20} />, label: "Dashboard", active: true, href: "/dashboard" },
                        { icon: <FileText size={20} />, label: "Quản lý Blog", href: "/dashboard/blog" },
                        { icon: <Play size={20} />, label: "Thư viện Script", href: "/play" },
                        { icon: <User size={20} />, label: "Tài khoản", href: "#" },
                    ].map((item) => (
                        <Link
                            key={item.label}
                            href={item.href || "#"}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${item.active
                                    ? "bg-green-600/10 text-green-500 border border-green-600/20"
                                    : "text-gray-400 hover:bg-white/5 hover:text-white"
                                }`}
                        >
                            {item.icon} {item.label}
                        </Link>
                    ))}
                </nav>

                <div className="mt-auto space-y-4">
                    <form
                        action={async () => {
                            "use server";
                            await signOut({ redirectTo: "/" });
                        }}
                    >
                        <button className="flex items-center gap-2 text-red-500 hover:text-red-400 text-xs transition-colors font-bold">
                            <LogOut size={14} /> ĐĂNG XUẤT
                        </button>
                    </form>
                    <Link href="/" className="flex items-center gap-2 text-gray-500 hover:text-white text-xs transition-colors">
                        <ArrowLeft size={14} /> TRANG CHỦ
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col">
                <header className="h-16 border-b border-white/5 flex items-center justify-between px-8 bg-[#1e1e1e]/50 backdrop-blur-md">
                    <h1 className="text-lg font-bold text-white uppercase">
                        XIN CHÀO, {session.user?.name?.split(" ")[0] || "DEVELOPER"}!
                    </h1>
                    <div className="flex items-center gap-4">
                        <Link href="/play" className="mc-button py-1 px-4 text-xs">VÀO GAME</Link>
                        {session.user?.image ? (
                            <img src={session.user.image} className="w-8 h-8 rounded border-2 border-green-500" alt="Avatar" />
                        ) : (
                            <div className="w-8 h-8 rounded bg-green-500 border-2 border-white/20 flex items-center justify-center text-white text-xs font-bold" title="Avatar">
                                {session.user?.name?.[0]?.toUpperCase() || "?"}
                            </div>
                        )}
                    </div>
                </header>

                <div className="p-8 space-y-8">
                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {stats.map((stat) => (
                            <div key={stat.label} className="mc-card p-6 border-none bg-gradient-to-br from-[#252525] to-[#1e1e1e]">
                                <p className="text-gray-400 text-xs mb-2 uppercase tracking-widest">{stat.label}</p>
                                <p className={`text-4xl font-bold ${stat.color}`}>{stat.value}</p>
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Recent Posts */}
                        <div className="mc-card p-6 border-none bg-[#1e1e1e]">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="font-bold text-white">BÀI VIẾT GẦN ĐÂY</h3>
                                <Link href="/blog" className="text-green-500 text-xs hover:underline">Xem tất cả</Link>
                            </div>
                            <div className="space-y-4">
                                {recentPosts.length === 0 ? (
                                    <div className="text-center py-8">
                                        <p className="text-gray-500 text-sm mb-4">Chưa có bài viết nào</p>
                                        <Link href="/blog/create" className="mc-button text-xs py-2 px-4 inline-flex">VIẾT NGAY</Link>
                                    </div>
                                ) : (
                                    recentPosts.map((post) => (
                                        <Link key={post.id} href={`/blog/${post.id}`}
                                            className="flex items-center justify-between p-3 bg-black/20 rounded hover:bg-black/40 cursor-pointer group transition-colors">
                                            <div className="flex items-center gap-3 min-w-0">
                                                <div className={`flex-shrink-0 p-2 ${post.published ? "bg-green-500/10 text-green-500" : "bg-yellow-500/10 text-yellow-500"} rounded`}>
                                                    <FileText size={16} />
                                                </div>
                                                <span className="text-sm text-gray-300 font-mono group-hover:text-white truncate">{post.title}</span>
                                            </div>
                                            <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                                                {!post.published && (
                                                    <span className="text-[9px] bg-yellow-900/40 text-yellow-500 border border-yellow-700/40 px-1.5 py-0.5 rounded">Nháp</span>
                                                )}
                                                <span className="text-[10px] text-gray-500">{formatRelativeTime(post.createdAt)}</span>
                                            </div>
                                        </Link>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* Recent Scripts */}
                        <div className="mc-card p-6 border-none bg-[#1e1e1e]">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="font-bold text-white">SCRIPTS GẦN ĐÂY</h3>
                                <Link href="/play" className="text-green-500 text-xs hover:underline">Xem tất cả</Link>
                            </div>
                            <div className="space-y-4">
                                {recentScripts.length === 0 ? (
                                    <div className="text-center py-8">
                                        <p className="text-gray-500 text-sm mb-4">Chưa có script nào</p>
                                        <Link href="/play" className="mc-button text-xs py-2 px-4 inline-flex">TẠO SCRIPT</Link>
                                    </div>
                                ) : (
                                    recentScripts.map((script) => (
                                        <div key={script.id} className="flex items-center justify-between p-3 bg-black/20 rounded hover:bg-black/40 group transition-colors">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-blue-500/10 text-blue-500 rounded">
                                                    <Play size={16} fill="currentColor" />
                                                </div>
                                                <span className="text-sm text-gray-300 font-mono group-hover:text-white">{script.name}</span>
                                            </div>
                                            <span className="text-[10px] text-gray-500">{formatRelativeTime(script.createdAt)}</span>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="mc-card p-6 border-none bg-[#1e1e1e]">
                        <h3 className="font-bold text-white mb-6 uppercase tracking-widest text-xs">HÀNH ĐỘNG NHANH</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <Link href="/play" className="flex flex-col items-center justify-center p-6 bg-black/20 rounded-xl hover:bg-black/40 border border-white/5 hover:border-green-500/30 transition-all group">
                                <Play size={32} className="text-green-500 mb-3 group-hover:scale-110 transition-transform" />
                                <span className="text-xs font-bold text-white uppercase">CHƠI GAME</span>
                            </Link>
                            <Link href="/blog/create" className="flex flex-col items-center justify-center p-6 bg-black/20 rounded-xl hover:bg-black/40 border border-white/5 hover:border-blue-500/30 transition-all group">
                                <Plus size={32} className="text-blue-500 mb-3 group-hover:scale-110 transition-transform" />
                                <span className="text-xs font-bold text-white uppercase">VIẾT BLOG</span>
                            </Link>
                            <Link href="/blog" className="flex flex-col items-center justify-center p-6 bg-black/20 rounded-xl hover:bg-black/40 border border-white/5 hover:border-purple-500/30 transition-all group">
                                <FileText size={32} className="text-purple-500 mb-3 group-hover:scale-110 transition-transform" />
                                <span className="text-xs font-bold text-white uppercase">XEM BLOG</span>
                            </Link>
                            <Link href="/" className="flex flex-col items-center justify-center p-6 bg-black/20 rounded-xl hover:bg-black/40 border border-white/5 hover:border-orange-500/30 transition-all group">
                                <ArrowLeft size={32} className="text-orange-500 mb-3 group-hover:scale-110 transition-transform" />
                                <span className="text-xs font-bold text-white uppercase">TRANG CHỦ</span>
                            </Link>
                        </div>
                    </div>

                    {/* System Info */}
                    <div className="p-4 bg-green-900/10 border border-green-900/20 rounded-lg flex gap-4 items-start">
                        <div className="text-2xl mt-0.5">✅</div>
                        <div>
                            <p className="text-[10px] text-green-500 font-bold mb-1 uppercase tracking-tighter">Hệ thống hoạt động bình thường</p>
                            <p className="text-[11px] text-gray-400 leading-relaxed">
                                Authentication đã hoàn tất. Blog, database và game iframe đang hoạt động. Bạn có thể viết bài hoặc bắt đầu chơi.
                            </p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
