import React, { useState, useRef, useEffect } from "react";

// Hidden Object — single-file React component
// Ready to paste into a StackBlitz/Vite React app (src/App.jsx)
// Usage: replace `sceneUrl` with your scene image (public folder or remote URL)

export default function App() {
    const sceneUrl = "https://images.unsplash.com/photo-1503264116251-35a269479413?auto=format&fit=crop&w=1400&q=80"; // replace

    // Objects are defined with normalized coordinates (x,y from 0..1)
    const initialObjects = [
        { id: "key", name: "Régi kulcs", x: 0.18, y: 0.68 },
        { id: "book", name: "Könyv", x: 0.62, y: 0.4 },
        { id: "hat", name: "Kalap", x: 0.8, y: 0.22 }
    ];

    const [objects, setObjects] = useState(initialObjects.map(o => ({ ...o, found: false })));
    const [startTime, setStartTime] = useState(null);
    const [timeElapsed, setTimeElapsed] = useState(0);
    const [message, setMessage] = useState("");
    const imgRef = useRef(null);
    const timerRef = useRef(null);

    useEffect(() => {
        if (startTime) {
            timerRef.current = setInterval(() => {
                setTimeElapsed(Math.floor((Date.now() - startTime) / 1000));
            }, 250);
        }
        return () => clearInterval(timerRef.current);
    }, [startTime]);

    useEffect(() => {
        if (objects.every(o => o.found)) {
            setMessage(`Gratulálok! Megtaláltál minden tárgyat ${timeElapsed}s alatt.`);
            clearInterval(timerRef.current);
        }
    }, [objects, timeElapsed]);

    function startGame() {
        setObjects(initialObjects.map(o => ({ ...o, found: false })));
        setStartTime(Date.now());
        setTimeElapsed(0);
        setMessage("");
    }

    function handleClick(e) {
        if (!imgRef.current) return;
        const rect = imgRef.current.getBoundingClientRect();
        const clickX = (e.clientX - rect.left) / rect.width;
        const clickY = (e.clientY - rect.top) / rect.height;

        // tolerance (as normalized distance)
        const tol = 0.06; // tweak for difficulty

        let hit = false;
        setObjects(prev => prev.map(o => {
            if (o.found) return o;
            const dx = o.x - clickX;
            const dy = o.y - clickY;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist <= tol) {
                hit = true;
                return { ...o, found: true };
            }
            return o;
        }));

        if (hit) {
            setMessage("Talált!");
            setTimeout(() => setMessage(""), 900);
        } else {
            setMessage("Nem itt — próbáld újra");
            setTimeout(() => setMessage(""), 700);
        }
    }

    return (
        <div className="min-h-screen flex flex-col items-center p-4 bg-gray-50">
            <div className="w-full max-w-3xl">
                <header className="flex items-center justify-between mb-3">
                    <h1 className="text-2xl font-semibold">Hidden Object — Gyors demo</h1>
                    <div className="space-x-2">
                        <button className="px-3 py-1 rounded shadow bg-white" onClick={startGame}>Újra</button>
                        <span className="text-sm text-gray-600">Idő: {timeElapsed}s</span>
                    </div>
                </header>

                <div className="relative border rounded overflow-hidden bg-white">
                    <img
                        ref={imgRef}
                        src={sceneUrl}
                        alt="Jelenet"
                        onClick={handleClick}
                        style={{ width: "100%", display: "block", userSelect: "none" }}
                    />

                    {/* markers (for debugging or showing found targets) */}
                    {objects.map(o => (
                        <div
                            key={o.id}
                            style={{
                                position: 'absolute',
                                left: `${o.x * 100}%`,
                                top: `${o.y * 100}%`,
                                transform: 'translate(-50%, -50%)',
                                pointerEvents: 'none'
                            }}
                        >
                            {/* show small indicator when found */}
                            {o.found && (
                                <div className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ background: 'rgba(34,197,94,0.9)' }}>✓</div>
                            )}
                        </div>
                    ))}
                </div>

                <aside className="mt-3 p-3 bg-white rounded shadow">
                    <h2 className="font-medium">Megtalálandó tárgyak</h2>
                    <ul className="mt-2 space-y-1">
                        {objects.map(o => (
                            <li key={o.id} className={o.found ? 'line-through text-gray-400' : ''}>{o.name}</li>
                        ))}
                    </ul>

                    <div className="mt-3 text-sm text-gray-700">{message}</div>
                </aside>

                <footer className="mt-4 text-xs text-gray-500">Tippek: állítsd a <code>tol</code>-t a pontosabb/tágabb találathoz; cseréld a képet, vagy tölts fel több jelenetet.</footer>
            </div>
        </div>
    );
}

/*
Project notes (for monorepo / StackBlitz):

- File: src/App.jsx (this file)
- Add Tailwind (optional) or keep the inline classes -> StackBlitz React + Tailwind starter works well.
- Put scene images under /public or refer to remote URLs.
- Suggested monorepo layout:
  /packages/ui (shared components)
  /packages/game-hidden (this app)
  /packages/game-other (future games)

- To try quickly on StackBlitz:
  1) Create a new Vite React project (template) on StackBlitz.
  2) Replace src/App.jsx with this content.
  3) Optionally add Tailwind according to StackBlitz template.

- Want features next? I can add: randomized object placement, zoom/pan support, revealing hints, scoreboard (localStorage), multiplayer tagging sync (WebSocket), or export-ready packaging for sharing.
*/