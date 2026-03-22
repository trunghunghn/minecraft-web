"use client";

import { useRef, useState } from "react";
import { MonitorOff } from "lucide-react";
import { motion } from "framer-motion";

interface MinecraftClientProps {
    version?: string;
    onReady?: () => void;
}

export default function MinecraftClient({ version = "1.12.2", onReady }: MinecraftClientProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [showOverlay, setShowOverlay] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Khi iframe load xong HTML → ẩn overlay sau thêm 1 giây để WebGL khởi động
    const handleIframeLoad = () => {
        setTimeout(() => {
            setShowOverlay(false);
            if (onReady) onReady();
        }, 1500);
    };

    const handleIframeError = () => {
        setError("Không thể tải file game. Kiểm tra lại thư mục public/game/1.12.2/index.html");
        setShowOverlay(false);
    };

    return (
        // Quan trọng: absolute inset-0 để fill đúng vào parent
        <div
            ref={containerRef}
            className="absolute inset-0 bg-black rounded-lg overflow-hidden border-4 border-[#3d2b24] shadow-2xl"
        >
            {/* Game iframe - LUÔN render, không ẩn để game load song song */}
            {!error && (
                <iframe
                    src="/game/1.12.2/index.html"
                    className="w-full h-full border-none block"
                    title="Minecraft 1.12.2 - Eaglercraft"
                    allow="pointer-lock; fullscreen; autoplay; accelerometer; gyroscope; clipboard-read; clipboard-write"
                    referrerPolicy="no-referrer"
                    allowFullScreen
                    onLoad={handleIframeLoad}
                    onError={handleIframeError}
                    style={{ display: "block" }}
                />
            )}

            {/* Loading overlay - nằm TRÊN iframe */}
            {showOverlay && !error && (
                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-[#0a0a0a] pointer-events-none">
                    {/* Spinner */}
                    <div className="relative w-24 h-24 mb-8">
                        <div className="absolute inset-0 border-4 border-t-green-500 border-r-green-500/30 border-b-green-500/10 border-l-transparent rounded-full animate-spin" />
                        <div className="w-14 h-14 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#1a3a1a] rounded-lg flex items-center justify-center text-3xl">
                            ⛏
                        </div>
                    </div>

                    <p className="text-white text-2xl font-bold mb-1 font-mono tracking-wider">
                        Minecraft {version}
                    </p>
                    <p className="text-gray-400 text-sm mb-8">Đang khởi động Eaglercraft...</p>

                    {/* Progress bar */}
                    <div className="w-72 h-3 bg-gray-800 rounded-full overflow-hidden border border-gray-700">
                        <motion.div
                            initial={{ width: "0%" }}
                            animate={{ width: "100%" }}
                            transition={{ duration: 10, ease: [0.1, 0.4, 0.7, 1.0] }}
                            className="h-full bg-gradient-to-r from-green-700 to-green-400 rounded-full"
                        />
                    </div>

                    <p className="text-gray-600 text-xs mt-4">Vui lòng chờ, đừng tắt trang...</p>
                </div>
            )}

            {/* Error state */}
            {error && (
                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center p-6 bg-red-950/40 backdrop-blur-sm">
                    <MonitorOff className="w-16 h-16 text-red-500 mb-4" />
                    <h3 className="text-2xl font-bold text-white mb-2">Lỗi Tải Game</h3>
                    <p className="text-red-300 text-sm max-w-sm">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="mc-button mt-6 bg-red-700 hover:bg-red-600 text-white"
                    >
                        THỬ LẠI
                    </button>
                </div>
            )}
        </div>
    );
}
