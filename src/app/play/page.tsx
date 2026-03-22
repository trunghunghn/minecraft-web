"use client";

import { useState, useEffect } from "react";
import ScriptEditor from "@/components/ScriptEditor";
import SettingsModal from "@/components/SettingsModal";
import MobileControls from "@/components/MobileControls";
import { Hammer, Settings, ArrowLeft, Play, ExternalLink } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function PlayPage() {
    const [gameLaunched, setGameLaunched] = useState(false);
    const [activeTab, setActiveTab] = useState<"game" | "multiplayer">("game");
    const [mounted, setMounted] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [showEditor, setShowEditor] = useState(false);
    const [showSettings, setShowSettings] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setMounted(true), 0);
        const checkMobile = () => {
            const userAgent = navigator.userAgent || navigator.vendor || (window as unknown as { opera: string }).opera;
            const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
            const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
            setIsMobile((mobileRegex.test(userAgent) || window.innerWidth <= 1024) && isTouchDevice);
        };
        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => {
            clearTimeout(timer);
            window.removeEventListener("resize", checkMobile);
        };
    }, []);

    const handleKeyDown = (key: string) => { };
    const handleKeyUp = (key: string) => { };

    const [consoleMessage, setConsoleMessage] = useState<string>("");
    const [consoleType, setConsoleType] = useState<"info" | "success" | "error">("info");

    useEffect(() => {
        const handleMessage = (event: MessageEvent) => {
            const data = event.data;
            if (data && data.type === "script-executed") {
                if (data.status === "success") {
                    setConsoleMessage("Script executed successfully!");
                    setConsoleType("success");
                } else {
                    setConsoleMessage(`Error: ${data.message}`);
                    setConsoleType("error");
                }

                // Reset message after 5 seconds
                setTimeout(() => setConsoleMessage(""), 5000);
            }
        };

        window.addEventListener("message", handleMessage);
        return () => window.removeEventListener("message", handleMessage);
    }, []);

    const handleRunScript = (code: string) => {
        const iframe = document.getElementById("game-iframe") as HTMLIFrameElement;
        if (iframe && iframe.contentWindow) {
            iframe.contentWindow.postMessage({
                type: "execute-script",
                code: code
            }, "*");
        } else {
            alert("Game chưa được khởi động trong trang này!");
        }
    };

    if (!mounted) return <div className="h-screen w-screen bg-[#1e1e1e]" />;

    const openGameFullscreen = () => {
        window.open("/play/fullscreen", "_blank", "noopener,noreferrer");
    };

    const launchGameInPage = () => {
        setGameLaunched(true);
        setActiveTab("game");
    };

    return (
        <div className="flex flex-col h-screen bg-[#1e1e1e] overflow-hidden">
            {/* Thanh điều hướng */}
            <div className="flex-shrink-0 flex items-center justify-between px-6 py-3 border-b border-white/10 bg-[#161616]">
                <div className="flex items-center gap-4">
                    <Link href="/" className="mc-button flex items-center gap-2 py-2 text-sm px-4">
                        <ArrowLeft size={16} /> QUAY LẠI
                    </Link>
                    {gameLaunched && (
                        <div className="flex bg-black/40 rounded-lg p-1 border border-white/5">
                            <button
                                onClick={() => setActiveTab("game")}
                                className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${activeTab === "game" ? "bg-green-600 text-white" : "text-gray-500 hover:text-gray-300"}`}
                            >
                                TRÒ CHƠI
                            </button>
                            <button
                                onClick={() => setActiveTab("multiplayer")}
                                className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${activeTab === "multiplayer" ? "bg-blue-600 text-white" : "text-gray-500 hover:text-gray-300"}`}
                            >
                                CHƠI CÙNG BẠN BÈ
                            </button>
                        </div>
                    )}
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => setShowEditor(!showEditor)}
                        className={`mc-button flex items-center gap-2 py-2 text-sm ${showEditor ? "bg-green-700" : ""}`}
                    >
                        <Hammer size={16} /> {showEditor ? "ĐÓNG EDITOR" : "SCRIPT EDITOR"}
                    </button>
                    <button onClick={() => setShowSettings(true)} className="mc-button flex items-center gap-2 py-2 text-sm">
                        <Settings size={16} /> CÀI ĐẶT
                    </button>
                </div>
            </div>

            {/* Khu vực chính */}
            <div className="flex-1 flex overflow-hidden min-h-0">
                {/* Game area */}
                <div className="relative flex-1 flex flex-col bg-[#0a0a0a] overflow-hidden">
                    {!gameLaunched ? (
                        <div className="flex-1 flex flex-col items-center justify-center relative">
                            {/* Background grid effect */}
                            <div className="absolute inset-0 opacity-5"
                                style={{
                                    backgroundImage: "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
                                    backgroundSize: "40px 40px"
                                }} />

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6 }}
                                className="relative z-10 text-center px-8"
                            >
                                <div className="text-8xl mb-6 select-none">⛏</div>
                                <h1 className="text-4xl font-bold text-white mb-2 font-mono tracking-wider">
                                    Minecraft 1.12.2
                                </h1>
                                <p className="text-gray-500 text-sm mb-10">
                                    Eaglercraft Edition • WebGL
                                </p>

                                <motion.button
                                    onClick={openGameFullscreen}
                                    whileHover={{ scale: 1.03 }}
                                    whileTap={{ scale: 0.97 }}
                                    className="group flex items-center gap-3 mx-auto mb-4 bg-green-600 hover:bg-green-500 text-white font-bold text-xl px-10 py-5 rounded-xl shadow-2xl shadow-green-900/50 transition-colors w-full sm:w-auto justify-center"
                                >
                                    <ExternalLink size={24} />
                                    CHƠI NGAY (Tab Mới)
                                </motion.button>

                                <motion.button
                                    onClick={launchGameInPage}
                                    whileHover={{ scale: 1.02 }}
                                    className="flex items-center gap-2 mx-auto text-gray-400 hover:text-white text-sm transition-colors py-3 px-6 bg-white/5 rounded-lg border border-white/5 hover:border-white/20"
                                >
                                    <Play size={14} fill="white" />
                                    Chơi ngay trong trình duyệt (Hỗ trợ Coding)
                                </motion.button>

                                <div className="mt-10 grid grid-cols-3 gap-6 text-center max-w-lg mx-auto">
                                    <div className="bg-white/5 rounded-xl p-4">
                                        <div className="text-green-400 text-2xl mb-1">🌍</div>
                                        <div className="text-white text-[10px] font-bold uppercase">Survival</div>
                                    </div>
                                    <div className="bg-white/5 rounded-xl p-4">
                                        <div className="text-blue-400 text-2xl mb-1">🌐</div>
                                        <div className="text-white text-[10px] font-bold uppercase">Relay LAN</div>
                                    </div>
                                    <div className="bg-white/5 rounded-xl p-4">
                                        <div className="text-purple-400 text-2xl mb-1">💻</div>
                                        <div className="text-white text-[10px] font-bold uppercase">JS API</div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    ) : (
                        <div className="flex-1 flex flex-col h-full w-full">
                            {activeTab === "game" ? (
                                <iframe
                                    id="game-iframe"
                                    src="/game/1.12.2/index.html"
                                    className="w-full h-full border-none"
                                    allow="autoplay; fullscreen; pointer-lock"
                                />
                            ) : (
                                <div className="flex-1 p-8 overflow-y-auto bg-[#161616] text-gray-300">
                                    <div className="max-w-3xl mx-auto space-y-8">
                                        <div className="border-l-4 border-blue-600 pl-6 space-y-2">
                                            <h2 className="text-3xl font-bold text-white uppercase tracking-tighter">Hướng dẫn chơi cùng bạn bè</h2>
                                            <p className="text-sm text-gray-500 italic font-mono">Tính năng &quot;Open to LAN&quot; hỗ trợ chơi qua mã Relay Join Code</p>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            <div className="bg-white/5 p-6 rounded-xl border border-white/5 space-y-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center font-bold text-white">1</div>
                                                    <h3 className="font-bold text-white uppercase text-sm">Cho người chủ trì (Host)</h3>
                                                </div>
                                                <ul className="space-y-3 text-sm">
                                                    <li className="flex gap-2"><span>•</span> <span>Vào một thế giới Singleplayer bất kỳ.</span></li>
                                                    <li className="flex gap-2"><span>•</span> <span>Nhấn <b>ESC</b> và chọn <b>Open to LAN</b>.</span></li>
                                                    <li className="flex gap-2"><span>•</span> <span>Chọn một Relay (ví dụ: <i>deev.is</i>) và nhấn <b>Open to LAN</b>.</span></li>
                                                    <li className="flex gap-2"><span>•</span> <span>Sao chép <b>Join Code</b> xuất hiện trong chat.</span></li>
                                                    <li className="flex gap-2"><span>•</span> <span className="text-blue-400 font-bold">Gửi mã này cho bạn bè của bạn!</span></li>
                                                </ul>
                                            </div>

                                            <div className="bg-white/5 p-6 rounded-xl border border-white/5 space-y-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center font-bold text-white">2</div>
                                                    <h3 className="font-bold text-white uppercase text-sm">Cho người tham gia (Joiner)</h3>
                                                </div>
                                                <ul className="space-y-3 text-sm">
                                                    <li className="flex gap-2"><span>•</span> <span>Vào menu <b>Multiplayer</b> từ màn hình chính.</span></li>
                                                    <li className="flex gap-2"><span>•</span> <span>Nhấn vào nút <b>Direct Connect</b>.</span></li>
                                                    <li className="flex gap-2"><span>•</span> <span>Dán <b>Join Code</b> bạn nhận được vào ô.</span></li>
                                                    <li className="flex gap-2"><span>•</span> <span className="text-green-400 font-bold">Nhấn Join Server để bắt đầu!</span></li>
                                                </ul>
                                            </div>
                                        </div>

                                        <div className="bg-blue-900/20 border border-blue-500/30 p-4 rounded-lg flex gap-4 items-start">
                                            <div className="text-2xl mt-1">💡</div>
                                            <div>
                                                <h4 className="font-bold text-blue-400 text-sm mb-1 uppercase">Mẹo nhỏ</h4>
                                                <p className="text-xs leading-relaxed">Nếu không kết nối được, hãy thử đổi sang Relay server khác. Cả hai người chơi phải sử dụng cùng một mạng hoặc Relay ổn định để có trải nghiệm tốt nhất.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Script editor sidebar */}
                {showEditor && (
                    <div className="w-[450px] lg:w-[600px] flex-shrink-0 border-l border-white/10 flex flex-col bg-[#1e1e1e]">
                        <ScriptEditor
                            onRun={handleRunScript}
                            consoleMessage={consoleMessage}
                            consoleType={consoleType}
                        />
                    </div>
                )}
            </div>

            <SettingsModal isOpen={showSettings} onClose={() => setShowSettings(false)} />

            {gameLaunched && isMobile && (
                <MobileControls
                    onKeyDown={handleKeyDown}
                    onKeyUp={handleKeyUp}
                    onOpenSettings={() => setShowSettings(true)}
                />
            )}
        </div>
    );
}
