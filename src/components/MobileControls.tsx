"use client";

import { useState, useRef, useEffect } from "react";

interface MobileControlsProps {
    onKeyDown: (key: string) => void;
    onKeyUp: (key: string) => void;
    onOpenSettings: () => void;
    topOffset?: string;
    bottomOffset?: string;
}

export default function MobileControls({ onKeyDown, onKeyUp, onOpenSettings, topOffset = "top-[60px]", bottomOffset = "bottom-2" }: MobileControlsProps) {
    const [isMouseMode, setIsMouseMode] = useState(false);
    const mousePos = useRef({ x: 100, y: 100 });
    const cursorRef = useRef<HTMLDivElement>(null);
    const targetRef = useRef<HTMLElement | null>(null);
    const lastTouchPos = useRef<{ x: number, y: number } | null>(null);
    const lookTouchPos = useRef<{ x: number, y: number } | null>(null);
    const lookStartTime = useRef<number>(0);
    const lookStartPos = useRef<{ x: number, y: number } | null>(null);

    useEffect(() => {
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

        return () => clearInterval(timer);
    }, []);

    const dispatchKeyEvent = (type: 'keydown' | 'keyup', key: string) => {
        // Map common keys if needed (e.g., Space for Jump)
        const eventKey = key === " " ? " " : key;
        const eventCode = key === "w" ? "KeyW" :
            key === "a" ? "KeyA" :
                key === "s" ? "KeyS" :
                    key === "d" ? "KeyD" :
                        key === "e" ? "KeyE" :
                            key === "t" ? "KeyT" :
                                key === "Shift" ? "ShiftLeft" :
                                    key === "Tab" ? "Tab" :
                                        key === "Escape" ? "Escape" :
                                            key === " " ? "Space" : key;

        const eventInit = {
            key: eventKey,
            code: eventCode,
            bubbles: true,
            cancelable: true,
            view: window,
            keyCode: key === " " ? 32 : (key.length === 1 ? key.toUpperCase().charCodeAt(0) : 0)
        };

        const event = new KeyboardEvent(type, eventInit);
        window.dispatchEvent(event);

        const iframe = document.getElementById('game-iframe') as HTMLIFrameElement;
        if (iframe && iframe.contentWindow) {
            iframe.contentWindow.dispatchEvent(new KeyboardEvent(type, eventInit));
        }
    };

    const handlePress = (key: string) => {
        dispatchKeyEvent('keydown', key);
        if (onKeyDown) onKeyDown(key);
    };

    const handleRelease = (key: string) => {
        dispatchKeyEvent('keyup', key);
        if (onKeyUp) onKeyUp(key);
    };

    const dispatchMouseEvent = (type: string, x: number, y: number, button: number = 0) => {
        const target = targetRef.current || document.body;
        const rect = target.getBoundingClientRect();

        // Calculate coordinates relative to the target
        const localX = x - rect.left;
        const localY = y - rect.top;

        const eventInit = {
            view: (target.ownerDocument?.defaultView || window) as Window & typeof globalThis,
            bubbles: true,
            cancelable: true,
            clientX: x,
            clientY: y,
            screenX: x,
            screenY: y,
            button: button,
            buttons: (type === 'mousedown' || type === 'mousemove') ? (button === 0 ? 1 : button === 2 ? 2 : 4) : 0,
            detail: type === 'click' ? 1 : 0,
            offsetX: localX,
            offsetY: localY
        };

        // Dispatch MouseEvent
        const mouseEvent = new MouseEvent(type, eventInit);
        target.dispatchEvent(mouseEvent);

        // For modern web games, PointerEvents are often more important
        const pointerTypeMap: Record<string, string> = {
            'mousedown': 'pointerdown',
            'mouseup': 'pointerup',
            'mousemove': 'pointermove',
            'click': 'pointerup'
        };

        const pType = pointerTypeMap[type];
        if (pType) {
            const pointerEvent = new PointerEvent(pType, {
                ...eventInit,
                pointerId: 1,
                isPrimary: true,
                pointerType: 'mouse',
                width: 1,
                height: 1,
                pressure: (type === 'mousedown' || type === 'click') ? 0.5 : 0,
            });
            target.dispatchEvent(pointerEvent);
        }

        // Additional dispatch to iframe window directly if possible
        if (target.tagName === 'IFRAME') {
            const iframe = target as HTMLIFrameElement;
            try {
                if (iframe.contentWindow) {
                    const iframeEvent = new MouseEvent(type, { ...eventInit, bubbles: true });
                    iframe.contentWindow.dispatchEvent(iframeEvent);
                }
            } catch (e) { }
        }
    };

    const dispatchMovementEvent = (dx: number, dy: number) => {
        const target = targetRef.current || document.body;
        const eventInit = {
            view: (target.ownerDocument?.defaultView || window) as Window & typeof globalThis,
            bubbles: true,
            cancelable: true,
            clientX: mousePos.current.x,
            clientY: mousePos.current.y,
            movementX: dx,
            movementY: dy,
            button: -1,
            buttons: 0,
        };

        const mouseEvent = new MouseEvent('mousemove', eventInit);
        target.dispatchEvent(mouseEvent);
    };

    const Btn = ({ label, code, className = "", onClick, style }: { label: string, code?: string, className?: string, onClick?: () => void, style?: React.CSSProperties }) => (
        <button
            style={style}
            className={`bg-gray-500/40 border border-white/30 flex items-center justify-center text-white font-bold text-[11px] uppercase select-none pointer-events-auto active:bg-white/30 backdrop-blur-sm ${className}`}
            onPointerDown={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (onClick) onClick();
                else if (code) {
                    if (code === "BUTTON_ATTACK") dispatchMouseEvent('mousedown', mousePos.current.x, mousePos.current.y, 0);
                    else if (code === "BUTTON_PLACE") dispatchMouseEvent('mousedown', mousePos.current.x, mousePos.current.y, 2);
                    else handlePress(code);
                }
            }}
            onPointerUp={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (code) {
                    if (code === "BUTTON_ATTACK") {
                        dispatchMouseEvent('mouseup', mousePos.current.x, mousePos.current.y, 0);
                        dispatchMouseEvent('click', mousePos.current.x, mousePos.current.y, 0);
                    }
                    else if (code === "BUTTON_PLACE") {
                        dispatchMouseEvent('mouseup', mousePos.current.x, mousePos.current.y, 2);
                        dispatchMouseEvent('click', mousePos.current.x, mousePos.current.y, 2);
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

    return (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden font-mono">
            {/* Mouse Mode Touchpad */}
            {isMouseMode && (
                <div
                    className="absolute inset-0 pointer-events-auto z-10"
                    onPointerDown={(e) => {
                        lastTouchPos.current = { x: e.clientX, y: e.clientY };
                    }}
                    onPointerUp={(e) => {
                        if (lastTouchPos.current) {
                            const dx = Math.abs(e.clientX - lastTouchPos.current.x);
                            const dy = Math.abs(e.clientY - lastTouchPos.current.y);

                            if (dx < 15 && dy < 15) {
                                dispatchMouseEvent('mousemove', mousePos.current.x, mousePos.current.y);
                                dispatchMouseEvent('mousedown', mousePos.current.x, mousePos.current.y, 0);
                                dispatchMouseEvent('mouseup', mousePos.current.x, mousePos.current.y, 0);
                                dispatchMouseEvent('click', mousePos.current.x, mousePos.current.y, 0);
                            }
                        }
                        lastTouchPos.current = null;
                    }}
                    onPointerMove={(e) => {
                        if (lastTouchPos.current) {
                            const sensitivity = 5.0;
                            const dx = (e.clientX - lastTouchPos.current.x) * sensitivity;
                            const dy = (e.clientY - lastTouchPos.current.y) * sensitivity;

                            mousePos.current.x = Math.max(0, Math.min(window.innerWidth, mousePos.current.x + dx));
                            mousePos.current.y = Math.max(0, Math.min(window.innerHeight, mousePos.current.y + dy));

                            if (cursorRef.current) {
                                cursorRef.current.style.transform = `translate3d(${mousePos.current.x}px, ${mousePos.current.y}px, 0)`;
                            }

                            lastTouchPos.current = { x: e.clientX, y: e.clientY };
                            dispatchMouseEvent('mousemove', mousePos.current.x, mousePos.current.y);
                        }
                    }}
                />
            )}

            {/* Look Area Touchpad (When not in Mouse Mode) */}
            {!isMouseMode && (
                <div
                    className="absolute inset-0 pointer-events-auto z-10"
                    onPointerDown={(e) => {
                        // Prevent swipe-to-look starting on buttons (grid/jump)
                        const target = e.target as HTMLElement;
                        if (target.tagName === 'BUTTON') return;

                        lookTouchPos.current = { x: e.clientX, y: e.clientY };
                        lookStartPos.current = { x: e.clientX, y: e.clientY };
                        lookStartTime.current = Date.now();
                    }}
                    onPointerUp={(e) => {
                        // Tap to click detection
                        if (lookStartPos.current) {
                            const duration = Date.now() - lookStartTime.current;
                            const dx = Math.abs(e.clientX - lookStartPos.current.x);
                            const dy = Math.abs(e.clientY - lookStartPos.current.y);

                            if (duration < 250 && dx < 10 && dy < 10) {
                                // It's a tap, dispatch click at current position
                                dispatchMouseEvent('mousedown', e.clientX, e.clientY, 0);
                                setTimeout(() => {
                                    dispatchMouseEvent('mouseup', e.clientX, e.clientY, 0);
                                    dispatchMouseEvent('click', e.clientX, e.clientY, 0);
                                }, 50);
                            }
                        }
                        lookTouchPos.current = null;
                        lookStartPos.current = null;
                    }}
                    onPointerMove={(e) => {
                        if (lookTouchPos.current) {
                            const sensitivity = 1.0;
                            const dx = (e.clientX - lookTouchPos.current.x) * sensitivity;
                            const dy = (e.clientY - lookTouchPos.current.y) * sensitivity;

                            dispatchMovementEvent(dx, dy);
                            lookTouchPos.current = { x: e.clientX, y: e.clientY };
                        }
                    }}
                />
            )}

            {/* Virtual Cursor */}
            {isMouseMode && (
                <div
                    ref={cursorRef}
                    className="absolute z-[60] w-6 h-6 pointer-events-none top-0 left-0"
                    style={{ transform: `translate3d(${mousePos.current.x}px, ${mousePos.current.y}px, 0)` }}
                >
                    <svg viewBox="0 0 24 24" fill="white" stroke="black" strokeWidth="1">
                        <path d="M5.5,2 L5.5,22 L10,17.5 L14,22 L17,20.5 L13,16 L19,16 L5.5,2 Z" />
                    </svg>
                </div>
            )}

            {/* Top Bar */}
            <div className={`absolute ${topOffset} left-2 flex gap-1 pointer-events-none z-20`}>
                <Btn label="DEBUG" code="F3" className="w-[70px] h-[30px]" />
                <Btn label="CHAT" code="t" className="w-[70px] h-[30px]" />
                <button
                    className="w-[70px] h-[30px] bg-gray-500/40 border border-white/30 flex items-center justify-center text-white font-bold text-[11px] uppercase pointer-events-auto active:bg-white/30 backdrop-blur-sm"
                    onClick={() => {
                        const txt = prompt("Nhập nội dung chat:");
                        if (txt) {
                            // Virtual chat implementation
                        }
                    }}
                >
                    CHAT+
                </button>
                <Btn label="ESC" code="Escape" className="w-[70px] h-[30px] !bg-red-500/40" />
                <Btn label="TAB" code="Tab" className="w-[70px] h-[30px]" />
                <Btn label="3RD" code="F5" className="w-[70px] h-[30px]" />
                <Btn
                    label="MOUSE"
                    className={`w-[70px] h-[30px] ml-4 ${isMouseMode ? 'bg-blue-500/60' : ''}`}
                    onClick={() => setIsMouseMode(!isMouseMode)}
                />
            </div>

            {/* Bottom Left 3x3 Grid */}
            <div className={`absolute ${bottomOffset} left-2 w-[186px] h-[186px] grid grid-cols-3 grid-rows-3 gap-[2px] pointer-events-none z-20`}>
                <Btn label="PRI" code="BUTTON_ATTACK" />
                <Btn label="▲" code="w" className="text-xl" />
                <Btn label="SEC" code="BUTTON_PLACE" />

                <Btn label="◀" code="a" className="text-xl" />
                <Btn label="◇" code="Shift" className="text-xl" />
                <Btn label="▶" code="d" className="text-xl" />

                <Btn label="GUI" code="F1" />
                <Btn label="▼" code="s" className="text-xl" />
                <Btn label="INV" code="e" />
            </div>

            {/* Bottom Right Special Buttons */}
            <Btn
                label="JUMP"
                code=" "
                className={`absolute right-5 w-[60px] h-[60px] rounded-full !text-[12px] z-20`}
                style={{ bottom: `calc(${bottomOffset.includes('[') ? bottomOffset.split('[')[1].split(']')[0] : '8px'} + 100px)` }}
            />
        </div>
    );
}
