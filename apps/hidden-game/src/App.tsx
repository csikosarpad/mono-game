import React, { useEffect, useRef, useState } from 'react';
//import styled from 'styled-components';
import './App.scss';

// const Container = styled.div`
//   @apply flex flex-col items-center justify-center min-h-screen bg-gray-100;
// `;

// export default function App() {
//     const [message, setMessage] = useState('Üdv a Hidden Game mintában!');
//     return (
//         <div className="app-container">
//             <h1 className="text-3xl font-bold mb-4">Hidden Game</h1>
//             <p className="mb-4">{message}</p>
//             <button
//                 className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
//                 onClick={() => setMessage('Játék logika ide jön majd!')}
//             >
//                 Start
//             </button>
//         </div>
//     );
// }

export default function App() {
    const sceneUrl = "https://images.unsplash.com/photo-1503264116251-35a269479413?auto=format&fit=crop&w=1400&q=80"; // replace

    // Objects are defined with normalized coordinates (x,y from 0..1)
    const initialObjects = [
        { id: "key", name: "Régi kulcs", x: 0.18, y: 0.68 },
        { id: "book", name: "Könyv", x: 0.62, y: 0.4 },
        { id: "moon", name: "Hold", x: 0.55, y: 0.12 },
        { id: "hat", name: "Kalap", x: 0.8, y: 0.22 }
    ];

    const generateCoords = () => {
        const maxCoords = initialObjects.length;
        const coords = [];
        for (let i = 0; i < maxCoords; i++) {
            const x = +(Math.random() * (0.98 - 0.02) + 0.02).toFixed(2);
            const y = +(Math.random() * (0.98 - 0.02) + 0.02).toFixed(2);
            coords.push({ x, y });
        }
        return coords;
    };


    const [objects, setObjects] = useState(initialObjects.map(o => ({ ...o, found: false })));
    const [startTime, setStartTime] = useState<number | null>(null);
    const [timeElapsed, setTimeElapsed] = useState(0);
    const [message, setMessage] = useState("");

    const imgRef = useRef<HTMLImageElement | null>(null);
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

    useEffect(() => {
        if (startTime) {
            timerRef.current = setInterval(() => {
                setTimeElapsed(Math.floor((Date.now() - startTime) / 1000));
            }, 250);
        }
        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        };
    }, [startTime]);

    useEffect(() => {
        if (objects.every(o => o.found)) {
            setMessage(`Gratulálok! Megtaláltál minden tárgyat ${timeElapsed}s alatt.`);
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        }
    }, [objects, timeElapsed]);

    function startGame() {
        const coords = generateCoords();
        initialObjects.forEach((obj, index) => {
            obj.x = coords[index].x;
            obj.y = coords[index].y;
        });
        setObjects(initialObjects.map(o => ({ ...o, found: false })));
        setStartTime(Date.now());
        setTimeElapsed(0);
        setMessage("");
    }

    function handleClick(e: React.MouseEvent<HTMLImageElement>) {
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
                                pointerEvents: 'none',
                                color: o.found ? 'green' : 'wheat',
                                opacity: o.found ? 1 : 0.5
                            }}
                        >{!o.found && <span>✓</span>}
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
