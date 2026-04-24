"use client";

import React, { useState, useRef, useEffect } from "react";
import { Zap, Maximize2, RefreshCcw, Shield, Globe } from "lucide-react";

interface MinecraftGameWindowProps {
  username: string;
  isMobile: boolean;
}

export default function MinecraftGameWindow({ username, isMobile }: MinecraftGameWindowProps) {
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const handlePatchLAN = () => {
    if (iframeRef.current && iframeRef.current.contentWindow) {
      iframeRef.current.contentWindow.postMessage('FORCE_LAN_PATCH', '*');
    }
  };

  const handleReload = () => {
    if (iframeRef.current) {
      iframeRef.current.src = iframeRef.current.src;
    }
  };

  const toggleFullscreen = () => {
    if (iframeRef.current) {
      if (iframeRef.current.requestFullscreen) {
        iframeRef.current.requestFullscreen();
      }
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#0a0a0a] rounded-2xl border border-white/5 overflow-hidden shadow-2xl">
      {/* Interactive Toolbar */}
      <div className="bg-[#111] border-b border-white/5 p-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
            <Globe className="w-5 h-5 text-green-500" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Minecraft Game Engine</h3>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
              <span className="text-[10px] text-gray-500 font-mono">1.12.2 • EaglercraftX</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* THE NEW LAN BUTTON */}
          <button 
            onClick={handlePatchLAN}
            className="flex items-center bg-orange-600/10 border border-orange-500/20 hover:bg-orange-600/20 text-orange-500 hover:text-orange-400 gap-2 px-3 py-1.5 rounded-md h-9 text-xs transition-all active:scale-95"
          >
            <Zap className="w-3.5 h-3.5 fill-current" />
            VÁ LỖI LAN
          </button>

          <div className="h-6 w-px bg-white/10 mx-1" />

          <button 
            onClick={handleReload}
            className="p-2 text-gray-400 hover:text-white transition-colors"
          >
            <RefreshCcw className="w-4 h-4" />
          </button>
          
          <button 
            onClick={toggleFullscreen}
            className="p-2 text-gray-400 hover:text-white transition-colors"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Game Viewport */}
      <div className="relative flex-1 bg-black group">
        {!iframeLoaded && (
          <div className="absolute inset-0 flex flex-col items-center justify-center z-10 bg-[#0a0a0a]">
            <div className="w-16 h-16 border-4 border-t-green-500 border-white/5 rounded-full animate-spin mb-4" />
            <p className="text-xs text-gray-500 font-mono uppercase tracking-[0.2em]">Đang khởi tạo Engine...</p>
          </div>
        )}
        
        <iframe
          ref={iframeRef}
          id="game-iframe-v2"
          src={`/game/1.12.2/play.html?username=${username}&mobile=${isMobile}`}
          className="w-full h-full border-none shadow-inner"
          allow="autoplay; fullscreen; pointer-lock"
          onLoad={() => setIframeLoaded(true)}
        />

        {/* Floating Protection Badge */}
        <div className="absolute bottom-4 left-4 flex items-center gap-2 px-3 py-1.5 bg-black/60 backdrop-blur-md rounded-full border border-white/5 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
          <Shield className="w-3 h-3 text-blue-400" />
          <span className="text-[10px] text-white/60 font-medium">Safe Mode Active</span>
        </div>
      </div>
    </div>
  );
}
