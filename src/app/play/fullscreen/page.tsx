"use client";

import { useState, useEffect } from "react";
import MobileControls from "@/components/MobileControls";
import SettingsModal from "@/components/SettingsModal";

export default function FullscreenPlay() {
    const [mounted, setMounted] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [gameLaunched, setGameLaunched] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const mountTimer = setTimeout(() => setMounted(true), 0);

        const checkMobile = () => {
            const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
            const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
            const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
            setIsMobile((mobileRegex.test(userAgent) || window.innerWidth <= 1024) && isTouchDevice);
        };
        checkMobile();
        window.addEventListener("resize", checkMobile);

        // Tự động hiện điều khiển sau 2 giây (giảm từ 5s để cảm giác nhanh hơn)
        const timer = setTimeout(() => {
            setGameLaunched(true);
        }, 2000);
        return () => {
            clearTimeout(mountTimer);
            clearTimeout(timer);
            window.removeEventListener("resize", checkMobile);
        };
    }, []);

    if (!mounted) return <div className="h-screen w-screen bg-black" />;

    return (
        <div className="h-screen w-screen bg-black overflow-hidden relative">
            <iframe
                id="game-iframe"
                src="/game/1.12.2/index.html"
                className="w-full h-full border-none"
                allow="autoplay; fullscreen; pointer-lock"
            />

            {gameLaunched && isMobile && (
                <MobileControls
                    onKeyDown={() => { }}
                    onKeyUp={() => { }}
                    onOpenSettings={() => setShowSettings(true)}
                    topOffset="top-1"
                    bottomOffset="bottom-[50px]"
                />
            )}

            <SettingsModal isOpen={showSettings} onClose={() => setShowSettings(false)} />
        </div>
    );
}
