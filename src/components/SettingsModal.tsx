"use client";

import { useState } from "react";
import { X, Volume2, Monitor, Gamepad2, User, Save } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
    const [activeTab, setActiveTab] = useState("general");
    const [settings, setSettings] = useState({
        masterVolume: 80,
        musicVolume: 50,
        renderDistance: 8,
        fov: 70,
        difficulty: "Normal",
        graphics: "Fancy"
    });

    const tabs = [
        { id: "general", label: "CHUNG", icon: <Monitor size={18} /> },
        { id: "audio", label: "ÂM THANH", icon: <Volume2 size={18} /> },
        { id: "controls", label: "ĐIỀU KHIỂN", icon: <Gamepad2 size={18} /> },
        { id: "account", label: "TÀI KHOẢN", icon: <User size={18} /> },
    ];

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="relative w-full max-w-2xl bg-[#c6c6c6] border-t-4 border-l-4 border-white border-b-4 border-r-4 border-[#555] shadow-[8px_8px_0_rgba(0,0,0,0.5)] overflow-hidden"
                >
                    {/* Header */}
                    <div className="bg-[#484848] p-4 flex items-center justify-between border-b-4 border-[#222]">
                        <h2 className="text-xl font-bold text-white tracking-widest uppercase">CÀI ĐẶT GAME</h2>
                        <button
                            onClick={onClose}
                            className="p-1 hover:bg-red-600 transition-colors text-white"
                        >
                            <X size={24} />
                        </button>
                    </div>

                    <div className="flex h-[450px]">
                        {/* Sidebar Tabs */}
                        <div className="w-48 bg-[#8b8b8b] border-r-4 border-[#555] p-2 flex flex-col gap-2">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center gap-3 px-3 py-3 text-left font-bold transition-all ${activeTab === tab.id
                                            ? "bg-[#484848] text-[#ffff55] border-t-2 border-l-2 border-white/30 border-b-2 border-r-2 border-black/40 shadow-inner"
                                            : "bg-[#707070] text-gray-200 border-t-2 border-l-2 border-white/20 border-b-2 border-r-2 border-black/30 hover:bg-[#7a7a7a]"
                                        }`}
                                >
                                    {tab.icon}
                                    <span className="text-xs tracking-wider">{tab.label}</span>
                                </button>
                            ))}
                        </div>

                        {/* Content Area */}
                        <div className="flex-1 p-6 overflow-y-auto bg-[#c6c6c6] custom-scrollbar">
                            {activeTab === "general" && (
                                <div className="space-y-6">
                                    <div className="space-y-4">
                                        <label className="block text-[#484848] font-bold text-sm tracking-loose">ĐỘ KHÓ: {settings.difficulty}</label>
                                        <div className="grid grid-cols-2 gap-2">
                                            {["Peaceful", "Easy", "Normal", "Hard"].map((d) => (
                                                <button
                                                    key={d}
                                                    onClick={() => setSettings({ ...settings, difficulty: d })}
                                                    className={`mc-button text-xs py-2 ${settings.difficulty === d ? 'bg-green-700' : ''}`}
                                                >
                                                    {d.toUpperCase()}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="space-y-4 pt-4 border-t border-[#8b8b8b]">
                                        <label className="block text-[#484848] font-bold text-sm">TẦM NHÌN (RENDER DISTANCE): {settings.renderDistance} CHUNKS</label>
                                        <input
                                            type="range" min="2" max="32" step="2"
                                            value={settings.renderDistance}
                                            onChange={(e) => setSettings({ ...settings, renderDistance: parseInt(e.target.value) })}
                                            className="w-full accent-green-600 cursor-pointer"
                                        />
                                    </div>

                                    <div className="space-y-4">
                                        <label className="block text-[#484848] font-bold text-sm">GÓC NHÌN (FOV): {settings.fov}</label>
                                        <input
                                            type="range" min="30" max="110" step="5"
                                            value={settings.fov}
                                            onChange={(e) => setSettings({ ...settings, fov: parseInt(e.target.value) })}
                                            className="w-full accent-blue-600 cursor-pointer"
                                        />
                                    </div>
                                </div>
                            )}

                            {activeTab === "audio" && (
                                <div className="space-y-8">
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center text-[#484848] font-bold text-sm">
                                            <span>ÂM THANH TỔNG</span>
                                            <span>{settings.masterVolume}%</span>
                                        </div>
                                        <input
                                            type="range" min="0" max="100"
                                            value={settings.masterVolume}
                                            onChange={(e) => setSettings({ ...settings, masterVolume: parseInt(e.target.value) })}
                                            className="w-full accent-green-600"
                                        />
                                    </div>
                                    <div className="space-y-4 pt-4 border-t border-[#8b8b8b]">
                                        <div className="flex justify-between items-center text-[#484848] font-bold text-sm">
                                            <span>NHẠC NỀN</span>
                                            <span>{settings.musicVolume}%</span>
                                        </div>
                                        <input
                                            type="range" min="0" max="100"
                                            value={settings.musicVolume}
                                            onChange={(e) => setSettings({ ...settings, musicVolume: parseInt(e.target.value) })}
                                            className="w-full accent-blue-600"
                                        />
                                    </div>
                                </div>
                            )}

                            {activeTab === "controls" && (
                                <div className="space-y-4">
                                    <p className="text-[#484848] text-center italic py-10">Logic điều khiển hiện tại được mặc định theo WASD. Bạn có thể tùy chỉnh trong phiên bản cập nhật tới.</p>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="flex justify-between bg-[#8b8b8b] p-2 border-b-2 border-black/20">
                                            <span className="text-white text-xs font-bold">NHẢY</span>
                                            <span className="text-[#ffff55] text-xs font-bold font-mono">SPACE</span>
                                        </div>
                                        <div className="flex justify-between bg-[#8b8b8b] p-2 border-b-2 border-black/20">
                                            <span className="text-white text-xs font-bold">CHẠY NHANH</span>
                                            <span className="text-[#ffff55] text-xs font-bold font-mono">L-CTRL</span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="p-4 bg-[#8b8b8b] border-t-4 border-[#555] flex justify-end gap-4">
                        <button
                            onClick={onClose}
                            className="mc-button py-2 px-8 flex items-center gap-2"
                        >
                            ĐÓNG
                        </button>
                        <button
                            onClick={() => {
                                alert("Đã lưu cài đặt thành công!");
                                onClose();
                            }}
                            className="mc-button py-2 px-8 flex items-center gap-2 bg-green-700"
                        >
                            <Save size={18} /> LƯU THAY ĐỔI
                        </button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
