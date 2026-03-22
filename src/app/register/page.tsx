"use client";

import { ArrowLeft, User, Mail, Lock } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signUp } from "@/lib/auth-actions";

export default function RegisterPage() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        const formData = new FormData();
        formData.append("name", name);
        formData.append("email", email);
        formData.append("password", password);

        const res = await signUp(formData);

        if (res?.error) {
            setError(res.error);
            setLoading(false);
        } else {
            router.push("/auth/signin?registered=true");
        }
    };

    return (
        <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center p-6 bg-[url('https://www.minecraft.net/content/dam/minecraftnet/games/minecraft/key-art/MC_Background_Dirt.png')] bg-repeat bg-[length:128px_128px]">
            <div className="mc-card max-w-md w-full p-8 space-y-8 bg-[#1e1e1e]/95 backdrop-blur-sm border-4 border-[#3d2b24] outline-4 outline-black shadow-[20px_20px_0_rgba(0,0,0,0.5)]">
                <div className="text-center relative">
                    <h1 className="text-4xl font-bold text-white tracking-widest mb-2 drop-shadow-[0_4px_0_rgba(0,0,0,1)]">
                        ĐĂNG KÝ
                    </h1>
                    <div className="h-1 w-full bg-[#555] mt-4 shadow-[0_2px_0_#fff]"></div>
                </div>

                {error && (
                    <div className="bg-red-900/80 border-2 border-red-500 p-3 text-red-200 text-xs text-center font-bold">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-[#bebebe] text-sm font-bold flex items-center gap-2">
                            <User size={14} /> TÊN NGƯỜI DÙNG
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full bg-black border-2 border-[#555] p-3 text-white focus:border-green-500 outline-none transition-colors font-mono"
                            placeholder="Steve"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[#bebebe] text-sm font-bold flex items-center gap-2">
                            <Mail size={14} /> EMAIL
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-black border-2 border-[#555] p-3 text-white focus:border-green-500 outline-none transition-colors font-mono"
                            placeholder="steve@minecraft.net"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[#bebebe] text-sm font-bold flex items-center gap-2">
                            <Lock size={14} /> MẬT KHẨU
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-black border-2 border-[#555] p-3 text-white focus:border-green-500 outline-none transition-colors font-mono"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="mc-button w-full text-xl font-bold py-4 disabled:opacity-50"
                    >
                        {loading ? "ĐANG XỬ LÝ..." : "TẠO TÀI KHOẢN"}
                    </button>
                </form>

                <div className="pt-6 border-t border-[#3d2b24] space-y-4">
                    <p className="text-center text-[#888] text-xs font-bold">
                        ĐÃ CÓ TÀI KHOẢN? {" "}
                        <Link href="/auth/signin" className="text-green-500 hover:text-green-400 underline transition-colors">
                            ĐĂNG NHẬP NGAY
                        </Link>
                    </p>
                    <Link href="/" className="flex items-center justify-center gap-2 text-gray-500 hover:text-white transition-colors text-xs font-bold">
                        <ArrowLeft size={14} /> QUAY LẠI TRANG CHỦ
                    </Link>
                </div>
            </div>
        </div>
    );
}
