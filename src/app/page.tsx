"use client";

import { motion } from "framer-motion";
import { Play, Code, BookOpen, Users } from "lucide-react";
import Link from "next/link";

export default function Home() {
  const features = [
    {
      title: "Chơi Ngay 1.12.2",
      description: "Trải nghiệm Minecraft Java 1.12.2 trực tiếp trên trình duyệt với hiệu suất cao.",
      icon: <Play className="w-8 h-8" />,
      color: "from-green-500 to-green-700",
    },
    {
      title: "Lập Trình Script",
      description: "Sửa đổi thế giới game bằng JavaScript. Tạo logic, item và sự kiện riêng của bạn.",
      icon: <Code className="w-8 h-8" />,
      color: "from-blue-500 to-blue-700",
    },
    {
      title: "Cộng Đồng",
      description: "Chia sẻ script và cùng xây dựng thế giới với bạn bè trong chế độ Multiplayer.",
      icon: <Users className="w-8 h-8" />,
      color: "from-purple-500 to-purple-700",
    },
    {
      title: "Blog Cá Nhân",
      description: "Nơi chia sẻ kiến thức, hướng dẫn và những kỷ niệm trong thế giới Minecraft.",
      icon: <BookOpen className="w-8 h-8" />,
      color: "from-orange-500 to-orange-700",
    },
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 relative">
      {/* Top Navigation */}
      <div className="absolute top-6 right-6 flex gap-4 z-50">
        <Link href="/auth/signin">
          <button className="mc-button text-sm font-bold bg-[#bebebe] hover:bg-[#d0d0d0]">
            ĐĂNG NHẬP
          </button>
        </Link>
        <Link href="/register">
          <button className="mc-button text-sm font-bold bg-green-600 !text-white !text-shadow-none hover:bg-green-500 border-green-400">
            ĐĂNG KÝ
          </button>
        </Link>
      </div>

      {/* Header Section */}
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-center mb-16"
      >
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
          className="flex justify-center mb-6"
        >
          <img src="/icon.png" alt="Dirt Block" className="w-24 h-24 drop-shadow-2xl" />
        </motion.div>
        <h1 className="text-6xl md:text-8xl font-bold text-white mb-4 drop-shadow-[0_5px_5px_rgba(0,0,0,0.8)] tracking-tighter">
          MINECRAFT <span className="text-green-500">WEB</span>
        </h1>
        <p className="text-xl md:text-2xl text-gray-200 mt-2 bg-black/40 px-6 py-2 rounded-full inline-block backdrop-blur-sm border border-white/10">
          Phiên bản 1.12.2 - Chơi, Lập trình & Sáng tạo
        </p>
      </motion.div>

      {/* Main Action Call */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex flex-col gap-6 w-full max-w-4xl"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((feature, index) => (
            <Link
              key={index}
              href="/play"
              className="contents"
            >
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`p-1 rounded-xl bg-gradient-to-br ${feature.color} shadow-2xl cursor-pointer group`}
              >
                <div className="bg-[#1e1e1e] p-6 rounded-[10px] h-full transition-colors group-hover:bg-[#252525]">
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-lg bg-gradient-to-br ${feature.color} text-white shadow-lg`}>
                      {feature.icon}
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-2">{feature.title}</h3>
                      <p className="text-gray-400 leading-relaxed text-sm">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>

        <Link href="/play" className="w-full">
          <button className="mc-button mt-8 text-2xl py-6 font-bold flex items-center justify-center gap-3 w-full animate-pulse hover:animate-none">
            <Play className="fill-current" /> BẮT ĐẦU TRẢI NGHIỆM
          </button>
        </Link>
      </motion.div>

      {/* Footer Info */}
      <div className="mt-20 text-gray-500 text-sm flex gap-8">
        <p>© 2026 Minecraft Web Project</p>
        <p>Phiên bản: 1.12.2 (Java Edition)</p>
        <p>Built for Performance & Fun</p>
        <p>Created by Trung Quan</p>
      </div>
    </div>
  );
}
