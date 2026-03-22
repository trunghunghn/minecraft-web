"use client";

import { useState } from "react";
import Editor from "@monaco-editor/react";
import { Play, Save, RotateCcw, FileCode, Sparkles } from "lucide-react";
import { SCRIPT_TEMPLATES, type ScriptTemplate } from "@/lib/templates";

interface ScriptEditorProps {
    initialCode?: string;
    onRun?: (code: string) => void;
    onSave?: (code: string) => void;
    consoleMessage?: string;
    consoleType?: "info" | "success" | "error";
}

const DEFAULT_CODE = `// Minecraft JavaScript Script
// Chọn một mẫu phía dưới hoặc tự viết code của bạn!

function onInit() {
    console.log("Script đã sẵn sàng!");
}

onInit();`;

export default function ScriptEditor({
    initialCode = DEFAULT_CODE,
    onRun,
    onSave,
    consoleMessage,
    consoleType = "info"
}: ScriptEditorProps) {
    const [code, setCode] = useState(initialCode);

    const applyTemplate = (template: ScriptTemplate) => {
        setCode(template.code);
    };

    const getConsoleColor = () => {
        switch (consoleType) {
            case "success": return "text-green-500";
            case "error": return "text-red-500";
            default: return "text-blue-500";
        }
    };

    return (
        <div className="flex flex-col h-full mc-card border-none overflow-hidden">
            <div className="flex flex-col md:flex-row md:items-center justify-between p-3 bg-[#2d2d2d] border-b border-white/10 gap-3">
                <div className="flex items-center gap-2 text-white font-bold text-sm">
                    <FileCode size={18} className="text-blue-500" />
                    CODING INTERFACE (v1.12.2)
                </div>
                <div className="flex flex-wrap gap-2">
                    <button
                        onClick={() => setCode(DEFAULT_CODE)}
                        className="mc-button py-1 px-3 text-[10px] bg-gray-600 flex items-center gap-1"
                    >
                        <RotateCcw size={12} /> RESET
                    </button>
                    <button
                        onClick={() => onSave?.(code)}
                        className="mc-button py-1 px-3 text-[10px] bg-blue-600 flex items-center gap-1"
                    >
                        <Save size={12} /> LƯU SCRIPT
                    </button>
                    <button
                        onClick={() => onRun?.(code)}
                        className="mc-button py-1 px-3 text-[10px] bg-green-600 flex items-center gap-1 font-bold"
                    >
                        <Play size={12} fill="currentColor" /> CHẠY NGAY
                    </button>
                </div>
            </div>

            <div className="flex flex-col flex-1 min-h-[500px] overflow-hidden">
                {/* Templates Horizontal Bar */}
                <div className="w-full bg-[#252525] border-b border-white/5 p-3 overflow-x-auto custom-scrollbar">
                    <div className="flex items-center gap-3 min-w-max">
                        <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-1 shrink-0 mr-2">
                            <Sparkles size={12} className="text-yellow-500" /> MẪU SCRIPT
                        </h3>
                        {SCRIPT_TEMPLATES.map(template => (
                            <button
                                key={template.id}
                                onClick={() => applyTemplate(template)}
                                className="w-48 flex-shrink-0 text-left p-2.5 rounded-lg bg-black/20 hover:bg-white/5 border border-white/5 hover:border-green-500/30 transition-all group"
                            >
                                <div className="flex items-center gap-2 border-b border-white/5 pb-1.5 mb-1.5">
                                    <span className="text-sm">{template.icon}</span>
                                    <span className="text-[11px] font-bold text-white group-hover:text-green-400 transition-colors uppercase tracking-tighter truncate">{template.name}</span>
                                </div>
                                <p className="text-[10px] text-gray-500 line-clamp-2 leading-snug">{template.description}</p>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex-1 relative">
                    <Editor
                        height="100%"
                        defaultLanguage="javascript"
                        theme="vs-dark"
                        value={code}
                        onChange={(value) => setCode(value || "")}
                        options={{
                            minimap: { enabled: false },
                            fontSize: 14,
                            fontFamily: "'Minecraft', monospace",
                            padding: { top: 20 },
                            scrollBeyondLastLine: false,
                        }}
                    />
                </div>
            </div>

            <div className={`bg-[#1a1a1a] p-3 text-[10px] font-mono flex items-center gap-2 border-t border-white/5 ${getConsoleColor()}`}>
                <span className={consoleMessage ? "animate-ping" : "animate-pulse"}>●</span>
                {consoleMessage || "Console: Sẵn sàng thực thi lệnh. Chọn một mẫu hoặc viết code để bắt đầu."}
            </div>
        </div>
    );
}
