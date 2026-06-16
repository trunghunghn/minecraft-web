"use client";

import { signIn } from "next-auth/react";
import { ArrowLeft, User, Lock } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SignInPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get("registered")) {
        setSuccess(true);
      }
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await signIn("credentials", {
        username: username.trim().toLowerCase(),
        password,
        redirect: false,
      });

      if (res?.error) {
        setError("Tên nhân vật hoặc mật khẩu không chính xác");
      } else {
        router.push("/dashboard");
      }
    } catch (error) {
      setError("Đã có lỗi xảy ra. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center p-6 bg-[url('https://www.minecraft.net/content/dam/minecraftnet/games/minecraft/key-art/MC_Background_Dirt.png')] bg-repeat bg-[length:128px_128px]">
      <div className="mc-card max-w-md w-full p-8 space-y-8 bg-[#1e1e1e]/95 backdrop-blur-sm border-4 border-[#3d2b24] outline-4 outline-black shadow-[20px_20px_0_rgba(0,0,0,0.5)]">
        <div className="text-center relative">
          <div className="text-6xl mb-4">🎮</div>
          <h1 className="text-4xl font-bold text-white tracking-widest mb-2 drop-shadow-[0_4px_0_rgba(0,0,0,1)]">
            ĐĂNG NHẬP
          </h1>
          <p className="text-[#888] text-xs font-bold mt-1">DÙNG TÊN NHÂN VẬT TRONG GAME</p>
          <div className="h-1 w-full bg-[#555] mt-4 shadow-[0_2px_0_#fff]"></div>
        </div>

        {success && (
          <div className="bg-green-900/80 border-2 border-green-500 p-3 text-green-200 text-xs text-center font-bold">
            ✅ TẠO TÀI KHOẢN THÀNH CÔNG! HÃY ĐĂNG NHẬP.
          </div>
        )}

        {error && (
          <div className="bg-red-900/80 border-2 border-red-500 p-3 text-red-200 text-xs text-center font-bold">
            ❌ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[#bebebe] text-sm font-bold flex items-center gap-2">
              <User size={14} /> TÊN NHÂN VẬT TRONG GAME
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-black border-2 border-[#555] p-3 text-white focus:border-green-500 outline-none transition-colors font-mono"
              placeholder="Steve, Alex, ..."
              required
              autoComplete="username"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[#bebebe] text-sm font-bold flex items-center gap-2">
              <Lock size={14} /> MẬT KHẨU WEB
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-black border-2 border-[#555] p-3 text-white focus:border-green-500 outline-none transition-colors font-mono"
              placeholder="Mật khẩu bạn đặt khi đăng ký"
              required
              autoComplete="current-password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mc-button w-full text-xl font-bold py-4 disabled:opacity-50"
          >
            {loading ? "ĐANG XỬ LÝ..." : "⚔️ ĐĂNG NHẬP"}
          </button>
        </form>

        <div className="pt-6 border-t border-[#3d2b24] space-y-4">
          <p className="text-center text-[#888] text-xs font-bold">
            CHƯA CÓ TÀI KHOẢN WEB?{" "}
            <Link href="/register" className="text-green-500 hover:text-green-400 underline transition-colors">
              TẠO TÀI KHOẢN NGAY
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
