"use client";

import { useState, useRef, useEffect } from "react";

interface MobileControlsProps {
    onKeyDown: (key: string) => void;
    onKeyUp: (key: string) => void;
    onOpenSettings?: () => void;
    topOffset?: string;
    bottomOffset?: string;
}

interface BtnProps {
    label: string;
    code?: string;
    className?: string;
    onClick?: () => void;
    style?: React.CSSProperties;
    mousePos: React.RefObject<{ x: number, y: number }>;
    dispatchMouseEvent: (type: 'mousedown' | 'mouseup' | 'click' | 'mousemove', x: number, y: number, button?: number) => void;
    handlePress: (key: string) => void;
    handleRelease: (key: string) => void;
}

const Btn = ({ label, code, className = "", onClick, style, mousePos, dispatchMouseEvent, handlePress, handleRelease }: BtnProps) => (
    <button
        style={style}
        className={`bg-gray-500/40 border border-white/30 flex items-center justify-center text-white font-bold text-[11px] uppercase select-none pointer-events-auto active:bg-white/30 backdrop-blur-sm ${className}`}
        onPointerDown={(e) => {
            e.preventDefault();
            e.stopPropagation();
            if (onClick) onClick();
            else if (code) {
                if (code === "BUTTON_ATTACK") dispatchMouseEvent('mousedown', mousePos.current!.x, mousePos.current!.y, 0);
                else if (code === "BUTTON_PLACE") dispatchMouseEvent('mousedown', mousePos.current!.x, mousePos.current!.y, 2);
                else handlePress(code);
            }
        }}
        onPointerUp={(e) => {
            e.preventDefault();
            e.stopPropagation();
            if (code) {
                if (code === "BUTTON_ATTACK") {
                    dispatchMouseEvent('mouseup', mousePos.current!.x, mousePos.current!.y, 0);
                    dispatchMouseEvent('click', mousePos.current!.x, mousePos.current!.y, 0);
                }
                else if (code === "BUTTON_PLACE") {
                    dispatchMouseEvent('mouseup', mousePos.current!.x, mousePos.current!.y, 2);
                    dispatchMouseEvent('click', mousePos.current!.x, mousePos.current!.y, 2);
                }
                else handleRelease(code);
            }
        }}
        onPointerLeave={(e) => {
            e.preventDefault();
            e.stopPropagation();
            if (code) handleRelease(code);
        }}
    >
        {label}
    </button>
);

export default function MobileControls({ onKeyDown, onKeyUp, onOpenSettings, topOffset = "top-[60px]", bottomOffset = "bottom-2" }: MobileControlsProps) {
    const [isMouseMode, setIsMouseMode] = useState(false);
    const [debugDot, setDebugDot] = useState<{ x: number; y: number } | null>(null);
    const [holdActive, setHoldActive] = useState(false);
    const [kbActive, setKbActive] = useState(false);
    const [selectedSlot, setSelectedSlot] = useState(1); // Slot hotbar đang chọn (1-9)
    const mousePos = useRef({ x: 100, y: 100 });
    const holdTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const isHoldingRef = useRef(false);
    const isInGameRef = useRef(false);
    const hiddenInputRef = useRef<HTMLInputElement>(null); // Input ẩn để mở bàn phím ảo

    // Helper: Gửi sự kiện vào game thông qua Bridge (postMessage)
    const sendToBridge = (eventData: Record<string, unknown>) => {
        const iframe = document.getElementById('game-iframe') as HTMLIFrameElement;
        if (iframe && iframe.contentWindow) {
            iframe.contentWindow.postMessage(eventData, "*");
        }
    };

    const cursorRef = useRef<HTMLDivElement>(null);
    const targetRef = useRef<HTMLElement | null>(null);
    const lastTouchPos = useRef<{ x: number, y: number } | null>(null);
    const lookTouchPos = useRef<{ x: number, y: number } | null>(null);
    const lookStartTime = useRef<number>(0);
    const lookStartPos = useRef<{ x: number, y: number } | null>(null);

    useEffect(() => {
        // Lắng nghe trạng thái game từ iframe (inGame: true = đang chơi, false = đang ở menu)
        const onGameStateMsg = (e: MessageEvent) => {
            if (e.data?.type === 'game-state') {
                isInGameRef.current = !!e.data.inGame;
                console.log('[MobileControls] Game state:', e.data.inGame ? 'IN-GAME' : 'MENU');
            }
        };
        window.addEventListener('message', onGameStateMsg);

        // Initialize cursor position on mount
        if (cursorRef.current) {
            cursorRef.current.style.transform = `translate3d(${mousePos.current.x}px, ${mousePos.current.y}px, 0)`;
        }

        const findTarget = () => {
            const iframe = document.getElementById('game-iframe') as HTMLIFrameElement || document.querySelector('iframe');
            if (iframe) {
                // If we can access the content, the canvas is the best target
                // If not (cross-origin), the iframe itself must handle it
                try {
                    if (iframe.contentDocument) {
                        const innerCanvas = iframe.contentDocument.querySelector('canvas');
                        if (innerCanvas) return innerCanvas;
                        return iframe.contentDocument.body;
                    }
                } catch (e) {
                    return iframe;
                }
            }
            const mainCanvas = document.querySelector('canvas');
            if (mainCanvas) return mainCanvas;
            return document.body;
        };

        targetRef.current = findTarget();
        const timer = setInterval(() => {
            if (!targetRef.current || !document.contains(targetRef.current)) {
                targetRef.current = findTarget();
            }
        }, 2000);

        return () => {
            clearInterval(timer);
            window.removeEventListener('message', onGameStateMsg);
        };
    }, []);

    const dispatchKeyEvent = (type: 'keydown' | 'keyup', key: string) => {
        // Gửi sự kiện cục bộ lên window để UI phản hồi (nếu cần)
        const event = new KeyboardEvent(type, { key, bubbles: true });
        window.dispatchEvent(event);

        // Gọi callback để trang mẹ (PlayPage) xử lý gửi qua Bridge
        if (type === 'keydown') onKeyDown?.(key);
        else onKeyUp?.(key);
    };

    const handlePress = (key: string) => {
        dispatchKeyEvent('keydown', key);
    };

    const handleRelease = (key: string) => {
        dispatchKeyEvent('keyup', key);
    };

    const dispatchMouseEvent = (type: string, x: number, y: number, button: number = 0) => {
        const iframe = document.getElementById('game-iframe') as HTMLIFrameElement;
        if (!iframe) return;

        const iframeRect = iframe.getBoundingClientRect();
        const iframeX = x - iframeRect.left;
        const iframeY = y - iframeRect.top;
        const buttons = type === 'mousedown' ? 1 : 0;

        if (type === 'mousedown') {
            setDebugDot({ x, y });
        }

        // Gửi qua bridge - cách duy nhất hoạt động ổn định (tránh cross-origin)
        sendToBridge({
            type,
            clientX: iframeX,
            clientY: iframeY,
            screenX: x,
            screenY: y,
            button,
            buttons,
            movementX: 0,
            movementY: 0
        });
    };

    const dispatchMovementEvent = (dx: number, dy: number) => {
        // Gửi qua bridge - cách duy nhất ổn định cho camera rotation
        sendToBridge({
            type: 'mousemove',
            clientX: mousePos.current.x,
            clientY: mousePos.current.y,
            movementX: dx,
            movementY: dy,
            button: 0,
            buttons: 0
        });
    };


    // Calculate top offset in px - default header height is 60px
    const topPx = topOffset.includes('[') ? topOffset.split('[')[1].split(']')[0] : '60px';

    return (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden font-mono" style={{ touchAction: 'none' }}>
            {/* Mouse Mode Touchpad - starts below header */}
            {isMouseMode && (
                <div
                    className="absolute right-0 bottom-0 pointer-events-auto z-10"
                    style={{ top: topPx, left: 0, touchAction: 'none' }}
                    onPointerDown={(e) => {
                        lastTouchPos.current = { x: e.clientX, y: e.clientY };
                        lookStartTime.current = Date.now();
                    }}
                    onPointerUp={(e) => {
                        if (lastTouchPos.current) {
                            const duration = Date.now() - lookStartTime.current;
                            const dx = Math.abs(e.clientX - lastTouchPos.current.x);
                            const dy = Math.abs(e.clientY - lastTouchPos.current.y);

                            // Quick tap on trackpad acts as a Left Click AT THE CURSOR POSITION
                            if (duration < 250 && dx < 10 && dy < 10) {
                                dispatchMouseEvent('mousedown', mousePos.current.x, mousePos.current.y, 0);
                                dispatchMouseEvent('mouseup', mousePos.current.x, mousePos.current.y, 0);
                                dispatchMouseEvent('click', mousePos.current.x, mousePos.current.y, 0);
                            }
                        }
                        lastTouchPos.current = null;
                    }}
                    onPointerMove={(e) => {
                        if (lastTouchPos.current) {
                            // Relative tracking like a laptop trackpad (PojavLauncher style)
                            const sensitivity = 1.6; 
                            const dx = (e.clientX - lastTouchPos.current.x) * sensitivity;
                            const dy = (e.clientY - lastTouchPos.current.y) * sensitivity;
                            
                            mousePos.current.x = Math.max(0, Math.min(window.innerWidth, mousePos.current.x + dx));
                            mousePos.current.y = Math.max(0, Math.min(window.innerHeight, mousePos.current.y + dy));
                            
                            if (cursorRef.current) {
                                cursorRef.current.style.transform = `translate3d(${mousePos.current.x}px, ${mousePos.current.y}px, 0)`;
                            }
                            
                            dispatchMouseEvent('mousemove', mousePos.current.x, mousePos.current.y);
                            lastTouchPos.current = { x: e.clientX, y: e.clientY };
                        }
                    }}
                />
            )}

            {/* Look Area Touchpad (When not in Mouse Mode) */}
            {/* Covers full screen to natively intercept touches and translate to game mouse events */}
            {!isMouseMode && (
                <div
                    className="absolute right-0 bottom-0 pointer-events-auto z-10"
                    style={{ left: 0, top: topPx, touchAction: 'none' }}
                    onPointerDown={(e) => {
                        const target = e.target as HTMLElement;
                        if (target.tagName === 'BUTTON') return;

                        lookTouchPos.current = { x: e.clientX, y: e.clientY };
                        lookStartPos.current = { x: e.clientX, y: e.clientY };
                        lookStartTime.current = Date.now();
                        isHoldingRef.current = false;

                        // Chỉ bật hold timer khi đang trong game (first-person mode)
                        if (isInGameRef.current) {
                            // === GIỮ TAY ≥ 250ms = ĐẬP BLOCK / ĐÁNH MOB (left click hold) ===
                            holdTimerRef.current = setTimeout(() => {
                                isHoldingRef.current = true;
                                setHoldActive(true);
                                if (lookStartPos.current) {
                                    dispatchMouseEvent('mousedown', lookStartPos.current.x, lookStartPos.current.y, 0);
                                }
                            }, 250);
                        }
                    }}
                    onPointerUp={(e) => {
                        // Hủy hold timer nếu chưa kích hoạt
                        if (holdTimerRef.current) {
                            clearTimeout(holdTimerRef.current);
                            holdTimerRef.current = null;
                        }

                        if (isHoldingRef.current) {
                            // === Đang giữ → thả chuột trái (dừng đập) ===
                            dispatchMouseEvent('mouseup', e.clientX, e.clientY, 0);
                            isHoldingRef.current = false;
                            setHoldActive(false);
                        } else if (lookStartPos.current) {
                            const duration = Date.now() - lookStartTime.current;
                            const dx = Math.abs(e.clientX - lookStartPos.current.x);
                            const dy = Math.abs(e.clientY - lookStartPos.current.y);

                            if (duration < 300 && dx < 15 && dy < 15) {
                                const tapX = lookStartPos.current.x;
                                const tapY = lookStartPos.current.y;
                                dispatchMouseEvent('mousemove', tapX, tapY, 0);
                                requestAnimationFrame(() => {
                                    if (isInGameRef.current) {
                                        // === TRONG GAME: Tap = ĐẶT BLOCK / ĂN (right click) ===
                                        dispatchMouseEvent('mousedown', tapX, tapY, 2);
                                        dispatchMouseEvent('mouseup', tapX, tapY, 2);
                                        dispatchMouseEvent('click', tapX, tapY, 2);
                                    } else {
                                        // === NGOÀI GAME / MENU: Tap = NHẤN NÚT (left click) ===
                                        dispatchMouseEvent('mousedown', tapX, tapY, 0);
                                        dispatchMouseEvent('mouseup', tapX, tapY, 0);
                                        dispatchMouseEvent('click', tapX, tapY, 0);
                                    }
                                });
                            }
                        }

                        lookTouchPos.current = null;
                        lookStartPos.current = null;
                    }}
                    onPointerMove={(e) => {
                        if (lookTouchPos.current) {
                            // Nếu di chuyển nhiều → hủy hold timer (đang xoay camera)
                            if (lookStartPos.current && !isHoldingRef.current) {
                                const movedX = Math.abs(e.clientX - lookStartPos.current.x);
                                const movedY = Math.abs(e.clientY - lookStartPos.current.y);
                                if ((movedX > 8 || movedY > 8) && holdTimerRef.current) {
                                    clearTimeout(holdTimerRef.current);
                                    holdTimerRef.current = null;
                                }
                            }

                            // === VUỐT = XOAY CAMERA ===
                            const sensitivity = 2.2;
                            const dx = (e.clientX - lookTouchPos.current.x) * sensitivity;
                            const dy = (e.clientY - lookTouchPos.current.y) * sensitivity;
                            dispatchMovementEvent(dx, dy);
                            lookTouchPos.current = { x: e.clientX, y: e.clientY };
                        }
                    }}
                />
            )}

            {/* Hiệu ứng đỏ khi đang giữ để đập block */}
            {holdActive && (
                <div className="absolute inset-0 pointer-events-none z-30"
                    style={{ border: '3px solid rgba(255,50,50,0.5)', boxShadow: 'inset 0 0 40px rgba(255,0,0,0.2)' }}
                />
            )}

            {/* Debug dot - shows exactly where tap event was sent */}
            {debugDot && (
                <div
                    className="absolute pointer-events-none z-[99] w-8 h-8 -translate-x-4 -translate-y-4"
                    style={{ left: debugDot.x, top: debugDot.y }}
                    onAnimationEnd={() => setDebugDot(null)}
                >
                    <div className="w-full h-full rounded-full bg-red-500 opacity-70 animate-ping" />
                </div>
            )}

            {/* Virtual Cursor */}
            {isMouseMode && (
                <div
                    ref={cursorRef}
                    className="absolute z-[60] w-6 h-6 pointer-events-none top-0 left-0"
                >
                    <svg viewBox="0 0 24 24" fill="white" stroke="black" strokeWidth="1">
                        <path d="M5.5,2 L5.5,22 L10,17.5 L14,22 L17,20.5 L13,16 L19,16 L5.5,2 Z" />
                    </svg>
                </div>
            )}

            {/* Top Bar — pointer-events-none on wrapper to allow clicking through to the game */}
            <div className={`absolute ${topOffset} left-0 right-0 h-[36px] z-20 pointer-events-none`}>
                <div className="flex gap-1 ml-2 pointer-events-none h-full">
                    <Btn label="DEBUG" code="F3" className="w-[70px] h-[30px]" mousePos={mousePos} dispatchMouseEvent={dispatchMouseEvent} handlePress={handlePress} handleRelease={handleRelease} />
                    <Btn label="CHAT" code="t" className="w-[70px] h-[30px]" mousePos={mousePos} dispatchMouseEvent={dispatchMouseEvent} handlePress={handlePress} handleRelease={handleRelease} />
                    {/* Nút KEYBOARD mở bàn phím ảo */}
                    <button
                        className={`w-[70px] h-[30px] border flex items-center justify-center text-white font-bold text-[11px] uppercase pointer-events-auto backdrop-blur-sm ${
                            kbActive ? 'bg-blue-500/60 border-blue-400/60' : 'bg-gray-500/40 border-white/30 active:bg-white/30'
                        }`}
                        onPointerDown={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            if (hiddenInputRef.current) {
                                hiddenInputRef.current.focus();
                                setKbActive(true);
                            }
                        }}
                    >
                        ⌨️ KB
                    </button>
                    <Btn label="ESC" code="Escape" className="w-[70px] h-[30px] !bg-red-500/40" mousePos={mousePos} dispatchMouseEvent={dispatchMouseEvent} handlePress={handlePress} handleRelease={handleRelease} />
                    <Btn label="TAB" code="Tab" className="w-[70px] h-[30px]" mousePos={mousePos} dispatchMouseEvent={dispatchMouseEvent} handlePress={handlePress} handleRelease={handleRelease} />
                    <Btn label="3RD" code="F5" className="w-[70px] h-[30px]" mousePos={mousePos} dispatchMouseEvent={dispatchMouseEvent} handlePress={handlePress} handleRelease={handleRelease} />
                    <Btn
                        label="MOUSE"
                        className={`w-[70px] h-[30px] ml-4 flex-shrink-0 ${isMouseMode ? 'bg-blue-500/60' : ''}`}
                        onClick={() => setIsMouseMode(!isMouseMode)}
                        mousePos={mousePos} dispatchMouseEvent={dispatchMouseEvent} handlePress={handlePress} handleRelease={handleRelease}
                    />
                </div>
            </div>

            {/* Bottom Left 3x3 Grid */}
            <div className={`absolute ${bottomOffset} left-2 w-[186px] h-[186px] grid grid-cols-3 grid-rows-3 gap-[2px] pointer-events-none z-20`}>
                <Btn label="PRI" code="BUTTON_ATTACK" mousePos={mousePos} dispatchMouseEvent={dispatchMouseEvent} handlePress={handlePress} handleRelease={handleRelease} />
                <Btn label="▲" code="w" className="text-xl" mousePos={mousePos} dispatchMouseEvent={dispatchMouseEvent} handlePress={handlePress} handleRelease={handleRelease} />
                <Btn label="SEC" code="BUTTON_PLACE" mousePos={mousePos} dispatchMouseEvent={dispatchMouseEvent} handlePress={handlePress} handleRelease={handleRelease} />

                <Btn label="◀" code="a" className="text-xl" mousePos={mousePos} dispatchMouseEvent={dispatchMouseEvent} handlePress={handlePress} handleRelease={handleRelease} />
                <Btn label="◇" code="Shift" className="text-xl" mousePos={mousePos} dispatchMouseEvent={dispatchMouseEvent} handlePress={handlePress} handleRelease={handleRelease} />
                <Btn label="▶" code="d" className="text-xl" mousePos={mousePos} dispatchMouseEvent={dispatchMouseEvent} handlePress={handlePress} handleRelease={handleRelease} />

                <Btn label="GUI" code="F1" mousePos={mousePos} dispatchMouseEvent={dispatchMouseEvent} handlePress={handlePress} handleRelease={handleRelease} />
                <Btn label="▼" code="s" className="text-xl" mousePos={mousePos} dispatchMouseEvent={dispatchMouseEvent} handlePress={handlePress} handleRelease={handleRelease} />
                <Btn label="INV" code="e" mousePos={mousePos} dispatchMouseEvent={dispatchMouseEvent} handlePress={handlePress} handleRelease={handleRelease} />
            </div>

            {/* Bottom Right Special Buttons */}
            <Btn
                label="JUMP"
                code=" "
                className={`absolute right-5 w-[60px] h-[60px] rounded-full !text-[12px] z-20`}
                style={{ bottom: `calc(${bottomOffset.includes('[') ? bottomOffset.split('[')[1].split(']')[0] : '8px'} + 100px)` }}
                mousePos={mousePos} dispatchMouseEvent={dispatchMouseEvent} handlePress={handlePress} handleRelease={handleRelease}
            />
            {/* ===== HOTBAR SELECTOR ===== */}
            {/* Nằm ở đáy màn hình, giữa grid và nút JUMP */}
            <div
                className="absolute z-20 pointer-events-none"
                style={{
                    bottom: 0,
                    left: 196,   // sau 3x3 grid (186 + 8 + 2)
                    right: 90,   // trước nút JUMP (60 + 20 + 10)
                    height: 56,
                    display: 'flex',
                    alignItems: 'stretch',
                    gap: 2,
                    padding: '4px 0',
                }}
            >
                {[1,2,3,4,5,6,7,8,9].map((slot) => (
                    <button
                        key={slot}
                        className="flex-1 h-full flex items-center justify-center text-white font-bold text-[10px] pointer-events-auto rounded-sm select-none"
                        style={{
                            background: selectedSlot === slot
                                ? 'rgba(255,255,255,0.35)'
                                : 'rgba(0,0,0,0.15)',
                            border: selectedSlot === slot
                                ? '2px solid rgba(255,255,255,0.9)'
                                : '1px solid rgba(255,255,255,0.2)',
                            boxShadow: selectedSlot === slot
                                ? '0 0 8px rgba(255,255,255,0.4)'
                                : 'none',
                            transition: 'all 0.1s',
                        }}
                        onPointerDown={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setSelectedSlot(slot);
                            // Gửi đúng keyCode: phím '1'=49, '2'=50, ..., '9'=57
                            const keyCode = 48 + slot;
                            sendToBridge({ type: 'key-down', key: String(slot), code: `Digit${slot}`, keyCode });
                            setTimeout(() => {
                                sendToBridge({ type: 'key-up', key: String(slot), code: `Digit${slot}`, keyCode });
                            }, 80);
                        }}
                    >
                        <span style={{ opacity: selectedSlot === slot ? 1 : 0.5 }}>{slot}</span>
                    </button>
                ))}
            </div>


            <input
                ref={hiddenInputRef}
                type="text"
                inputMode="text"
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck={false}
                style={{
                    position: 'fixed', opacity: 0, width: 1, height: 1,
                    top: -200, left: -200, pointerEvents: 'none', zIndex: -1
                }}
                onFocus={() => setKbActive(true)}
                onBlur={() => setKbActive(false)}
                onKeyDown={(e) => {
                    e.stopPropagation();
                    // Gửi key event vào game
                    const keyCode = e.keyCode || e.which || 0;
                    sendToBridge({ type: 'key-down', key: e.key, code: e.code, keyCode });
                    onKeyDown?.(e.key);
                }}
                onKeyUp={(e) => {
                    e.stopPropagation();
                    const keyCode = e.keyCode || e.which || 0;
                    sendToBridge({ type: 'key-up', key: e.key, code: e.code, keyCode });
                    onKeyUp?.(e.key);
                }}
                onChange={(e) => {
                    // Xoá text sau khi gửi để luôn nhận ký tự mới
                    e.target.value = '';
                }}
            />
        </div>
    );
}
