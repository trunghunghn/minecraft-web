import { auth, signOut } from "@/auth";
import { ArrowLeft, Play, Layout, FileText, User, ChevronRight, LogOut, Plus } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
    const session = await auth();

    if (!session) {
        redirect("/auth/signin");
    }

    const stats = [
        { label: "Giờ chơi", value: "24h", color: "text-green-500" },
        { label: "Số script", value: "8", color: "text-blue-500" },
        { label: "Bài viết", value: "12", color: "text-purple-500" },
        { label: "Thành tựu", value: "45", color: "text-orange-500" },
    ];

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
                        { icon: <FileText size={20} />, label: "Quản lý Blog", href: "/blog" },
                        { icon: <Play size={20} />, label: "Thư viện Script", href: "/play" },
                        { icon: <User size={20} />, label: "Tài khoản", href: "#" },
                    ].map((item) => (
                        <Link
                            key={item.label}
                            href={item.href || "#"}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${item.active ? "bg-green-600/10 text-green-500 border border-green-600/20" : "text-gray-400 hover:bg-white/5 hover:text-white"
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
                    <h1 className="text-lg font-bold text-white uppercase">XIN CHÀO, {session.user?.name?.split(' ')[0] || "DEVELOPER"}!</h1>
                    <div className="flex items-center gap-4">
                        <Link href="/play" className="mc-button py-1 px-4 text-xs">VÀO GAME</Link>
                        {session.user?.image ? (
                            <img src={session.user.image} className="w-8 h-8 rounded border-2 border-green-500" alt="Avatar" />
                        ) : (
                            <div className="w-8 h-8 rounded bg-green-500 border-2 border-white/20" title="Avatar" />
                        )}
                    </div>
                </header>

                <div className="p-8 space-y-8">
                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        {stats.map((stat) => (
                            <div key={stat.label} className="mc-card p-6 border-none bg-gradient-to-br from-[#252525] to-[#1e1e1e]">
                                <p className="text-gray-400 text-xs mb-2 uppercase tracking-widest">{stat.label}</p>
                                <p className={`text-4xl font-bold ${stat.color}`}>{stat.value}</p>
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Recent Scripts */}
                        <div className="mc-card p-6 border-none bg-[#1e1e1e]">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="font-bold text-white">SCRIPTS GẦN ĐÂY</h3>
                                <button className="text-green-500 text-xs hover:underline">Xem tất cả</button>
                            </div>
                            <div className="space-y-4">
                                {[
                                    { name: "BuildHouse_Auto.js", date: "2 giờ trước" },
                                    { name: "GravityControl.js", date: "Hôm qua" },
                                    { name: "MobFarm_Logic.js", date: "3 ngày trước" },
                                ].map((s) => (
                                    <div key={s.name} className="flex items-center justify-between p-3 bg-black/20 rounded hover:bg-black/40 cursor-pointer group transition-colors">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-blue-500/10 text-blue-500 rounded">
                                                <Play size={16} fill="currentColor" />
                                            </div>
                                            <span className="text-sm text-gray-300 font-mono group-hover:text-white">{s.name}</span>
                                        </div>
                                        <span className="text-[10px] text-gray-500">{s.date}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="mc-card p-6 border-none bg-[#1e1e1e]">
                            <h3 className="font-bold text-white mb-6 uppercase tracking-widest text-xs">HÀNH ĐỘNG NHANH</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <Link href="/play" className="flex flex-col items-center justify-center p-6 bg-black/20 rounded-xl hover:bg-black/40 border border-white/5 hover:border-green-500/30 transition-all group">
                                    <Play size={32} className="text-green-500 mb-3 group-hover:scale-110 transition-transform" />
                                    <span className="text-xs font-bold text-white uppercase">CHƠI GAME</span>
                                </Link>
                                <Link href="/blog/create" className="flex flex-col items-center justify-center p-6 bg-black/20 rounded-xl hover:bg-black/40 border border-white/5 hover:border-blue-500/30 transition-all group">
                                    <Plus size={32} className="text-blue-500 mb-3 group-hover:scale-110 transition-transform" />
                                    <span className="text-xs font-bold text-white uppercase">VIẾT BLOG</span>
                                </Link>
                            </div>

                            <div className="mt-6 p-4 bg-yellow-900/10 border border-yellow-900/20 rounded-lg">
                                <p className="text-[10px] text-yellow-500 font-bold mb-1 uppercase tracking-tighter">Hệ thống gợi ý</p>
                                <p className="text-[11px] text-gray-400 leading-relaxed">
                                    Thiết lập &quot;Authentication&quot; đã hoàn tất. Website của bạn giờ đây đã có thể bảo mật các bài viết và script cá nhân!
                                </p>
                                <Link href="/blog/create" className="text-[11px] text-yellow-500 mt-2 font-bold flex items-center gap-1">
                                    BẮT ĐẦU NGAY <ChevronRight size={12} />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
