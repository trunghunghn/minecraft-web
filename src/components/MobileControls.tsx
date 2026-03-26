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
    const mousePos = useRef({ x: 100, y: 100 });
    const cursorRef = useRef<HTMLDivElement>(null);
    const targetRef = useRef<HTMLElement | null>(null);
    const lastTouchPos = useRef<{ x: number, y: number } | null>(null);
    const lookTouchPos = useRef<{ x: number, y: number } | null>(null);
    const lookStartTime = useRef<number>(0);
    const lookStartPos = useRef<{ x: number, y: number } | null>(null);

    useEffect(() => {
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
        const iframe = document.getElementById('game-iframe') as HTMLIFrameElement;
        if (!iframe) return;

        const iframeRect = iframe.getBoundingClientRect();
        const iframeX = x - iframeRect.left;
        const iframeY = y - iframeRect.top;

        const buttons = type === 'mousedown' ? 1 : 0;
        const detail = (type === 'click' || type === 'mousedown') ? 1 : 0;

        const pointerTypeMap: Record<string, string> = {
            'mousedown': 'pointerdown',
            'mouseup': 'pointerup',
            'mousemove': 'pointermove',
            'click': 'click'
        };
        const pType = pointerTypeMap[type];

        // Try to dispatch directly to iframe contentDocument/contentWindow (same-origin)
        try {
            const iframeWin = iframe.contentWindow;
            const iframeDoc = iframe.contentDocument;
            if (iframeWin && iframeDoc) {
                // Find the actual element at tap position - canvas or deepest element
                const el = iframeDoc.elementFromPoint(iframeX, iframeY) || iframeDoc.body;
                const commonInit = {
                    bubbles: true,
                    cancelable: true,
                    view: iframeWin,
                    clientX: iframeX,
                    clientY: iframeY,
                    screenX: x,
                    screenY: y,
                    button: button,
                    buttons,
                    detail,
                };
                el.dispatchEvent(new MouseEvent(type, commonInit));
                if (pType) {
                    el.dispatchEvent(new PointerEvent(pType, {
                        ...commonInit,
                        pointerId: 1,
                        isPrimary: true,
                        pointerType: 'mouse',
                        pressure: buttons > 0 ? 0.5 : 0,
                    }));
                }
                return;
            }
        } catch (_) { /* cross-origin fallback below */ }

        // Cross-origin fallback: dispatch on the iframe element itself at page coords
        const target = targetRef.current || iframe;
        const fallbackInit = {
            bubbles: true,
            cancelable: true,
            view: window as Window & typeof globalThis,
            clientX: x,
            clientY: y,
            screenX: x,
            screenY: y,
            button,
            buttons,
            detail,
        };
        target.dispatchEvent(new MouseEvent(type, fallbackInit));
        if (pType) {
            target.dispatchEvent(new PointerEvent(pType, {
                ...fallbackInit,
                pointerId: 1,
                isPrimary: true,
                pointerType: 'mouse',
                pressure: buttons > 0 ? 0.5 : 0,
            }));
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
                            const sensitivity = 2.5;
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
            {/* Covers full screen to natively intercept touches and translate to game mouse events */}
            {!isMouseMode && (
                <div
                    className="absolute right-0 bottom-0 pointer-events-auto z-10"
                    style={{ left: 0, top: topPx, touchAction: 'none' }}
                    onPointerDown={(e) => {
                        // Prevent swipe-to-look starting on buttons (grid/jump)
                        const target = e.target as HTMLElement;
                        if (target.tagName === 'BUTTON') return;

                        // Ignore taps in the top button bar area (first 36px of look area)
                        const iframe = document.getElementById('game-iframe') as HTMLIFrameElement;
                        const iframeRect = iframe ? iframe.getBoundingClientRect() : { top: 60, left: 0 };
                        if (e.clientY < iframeRect.top + 36) return;

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
                                // Cache the start position to avoid e.clientX getting lost in setTimeout closure
                                const tapX = lookStartPos.current.x;
                                const tapY = lookStartPos.current.y;

                                // It's a tap, dispatch hover first to trigger button highlight
                                dispatchMouseEvent('mousemove', tapX, tapY, 0);

                                // Wait 1 frame for hover to register then click
                                requestAnimationFrame(() => {
                                    dispatchMouseEvent('mousedown', tapX, tapY, 0);
                                    dispatchMouseEvent('mouseup', tapX, tapY, 0);
                                    dispatchMouseEvent('click', tapX, tapY, 0);
                                });
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
                >
                    <svg viewBox="0 0 24 24" fill="white" stroke="black" strokeWidth="1">
                        <path d="M5.5,2 L5.5,22 L10,17.5 L14,22 L17,20.5 L13,16 L19,16 L5.5,2 Z" />
                    </svg>
                </div>
            )}

            {/* Top Bar — pointer-events-auto on wrapper to block look area from capturing button taps */}
            <div className={`absolute ${topOffset} left-0 right-0 h-[36px] z-20 pointer-events-auto`}
                onPointerDown={(e) => e.stopPropagation()}>
                <div className="flex gap-1 ml-2 pointer-events-none h-full">
                    <Btn label="DEBUG" code="F3" className="w-[70px] h-[30px]" mousePos={mousePos} dispatchMouseEvent={dispatchMouseEvent} handlePress={handlePress} handleRelease={handleRelease} />
                    <Btn label="CHAT" code="t" className="w-[70px] h-[30px]" mousePos={mousePos} dispatchMouseEvent={dispatchMouseEvent} handlePress={handlePress} handleRelease={handleRelease} />
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
        </div>
    );
}
