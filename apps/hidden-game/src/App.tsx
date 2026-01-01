import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { cn } from '@mono-game/shared';
import './App.scss';

// Type definitions for better type safety
interface GameObject {
    id: string;
    name: string;
    x: number;
    y: number;
    rotation?: number;
    found: boolean;
    image?: string; // Optional image path for local assets
}

interface Coordinate {
    x: number;
    y: number;
}

// Configuration constants
const CONFIG = {
    // Image URL - can be local or remote
    //SCENE_URL: "https://images.unsplash.com/photo-1503264116251-35a269479413?auto=format&fit=crop&w=1400&q=80",
    SCENE_URL: "./images/map/camp2_1980.png", // Changed to local JPG

    // Game difficulty settings
    HIT_TOLERANCE: 0.06, // Distance tolerance for object detection
    MAX_COORDINATE: 0.98,
    MIN_COORDINATE: 0.02,

    // UI timing
    SUCCESS_MESSAGE_DURATION: 2000,
    ERROR_MESSAGE_DURATION: 700,

    // Coordinate precision
    COORDINATE_PRECISION: 2
} as const;

// Initial game objects configuration with image references
const INITIAL_OBJECTS: Omit<GameObject, 'found'>[] = [
    { id: "backpack", name: "Hátizsák", x: 0.41, y: 0.52, image: "./images/svg/backpack.svg" },
    { id: "backpack_blue", name: "Kék hátizsák", x: 0.21, y: 0.52, image: "./images/svg/backpack_blue.svg" },
    { id: "binoculars", name: "Távcső", x: 0.32, y: 0.28, image: "./images/svg/binoculars.svg" },
    { id: "boots", name: "Bakancs", x: 0.85, y: 0.65, image: "./images/svg/boots.svg" },
    { id: "bottle", name: "Kulacs", x: 0.55, y: 0.15, image: "./images/svg/bottle.svg" },
    { id: "lamp2", name: "Lámpa", x: 0.18, y: 0.72, image: "./images/svg/lamp2.svg" },
    { id: "campfire", name: "Tábortűz", x: 0.11, y: 0.42, image: "./images/svg/campfire.svg" },
    { id: "piknik_kosar", name: "Piknik kosár", x: 0.75, y: 0.33, image: "./images/svg/piknik_kosar.svg" },
    { id: "sajt", name: "Sajt", x: 0.36, y: 0.58, image: "./images/svg/sajt.svg" },
    { id: "szendvics", name: "Szendvics", x: 0.26, y: 0.78, image: "./images/svg/szendvics.svg" },
    { id: "termosz", name: "Termosz", x: 0.64, y: 0.18, image: "./images/svg/termosz.svg" },
    { id: "wrench", name: "Kulcs", x: 0.47, y: 0.39, image: "./images/svg/wrench.svg" },

];

export default function App() {
    // State management
    const [objects, setObjects] = useState<GameObject[]>(
        INITIAL_OBJECTS.map(obj => ({ ...obj, found: false }))
    );
    const [startTime, setStartTime] = useState<number | null>(null);
    const [timeElapsed, setTimeElapsed] = useState(0);
    const [message, setMessage] = useState("");
    const [isGameActive, setIsGameActive] = useState(false);
    const [imageError, setImageError] = useState(false);

    // Refs for DOM elements and timers
    const imgRef = useRef<HTMLImageElement | null>(null);
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const messageTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Memoized values for performance optimization
    const allObjectsFound = useMemo(() =>
        objects.every(obj => obj.found),
        [objects]
    );

    const remainingObjects = useMemo(() =>
        objects.filter(obj => !obj.found),
        [objects]
    );

    // Coordinate generation with better randomness and collision avoidance
    const generateRandomCoordinates = useCallback((): Coordinate[] => {
        const coords: Coordinate[] = [];
        const maxAttempts = 100; // Prevent infinite loops

        for (let i = 0; i < INITIAL_OBJECTS.length; i++) {
            let attempts = 0;
            let newCoord: Coordinate;
            let isValid = false;

            while (!isValid && attempts < maxAttempts) {
                newCoord = {
                    x: +(
                        Math.random() *
                        (CONFIG.MAX_COORDINATE - CONFIG.MIN_COORDINATE) +
                        CONFIG.MIN_COORDINATE
                    ).toFixed(CONFIG.COORDINATE_PRECISION),
                    y: +(
                        Math.random() *
                        (CONFIG.MAX_COORDINATE - CONFIG.MIN_COORDINATE) +
                        CONFIG.MIN_COORDINATE
                    ).toFixed(CONFIG.COORDINATE_PRECISION)
                };

                // Check for collision with existing coordinates
                const hasCollision = coords.some(existing => {
                    const distance = Math.sqrt(
                        Math.pow(newCoord.x - existing.x, 2) +
                        Math.pow(newCoord.y - existing.y, 2)
                    );
                    return distance < CONFIG.HIT_TOLERANCE;
                });

                if (!hasCollision) {
                    isValid = true;
                    coords.push(newCoord);
                }
                attempts++;
            }

            // Fallback if we can't find a valid position
            if (!isValid) {
                coords.push({
                    x: +(Math.random() * (CONFIG.MAX_COORDINATE - CONFIG.MIN_COORDINATE) + CONFIG.MIN_COORDINATE).toFixed(CONFIG.COORDINATE_PRECISION),
                    y: +(Math.random() * (CONFIG.MAX_COORDINATE - CONFIG.MIN_COORDINATE) + CONFIG.MIN_COORDINATE).toFixed(CONFIG.COORDINATE_PRECISION)
                });
            }
        }

        return coords;
    }, []);

    // Timer management
    useEffect(() => {
        if (startTime && isGameActive) {
            timerRef.current = setInterval(() => {
                setTimeElapsed(Math.floor((Date.now() - startTime) / 1000));
            }, 250);
        }

        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
                timerRef.current = null;
            }
        };
    }, [startTime, isGameActive]);

    // Game completion logic
    useEffect(() => {
        if (allObjectsFound && isGameActive) {
            //setMessage(`Gratulálok! Megtaláltál minden tárgyat ${timeElapsed}s alatt.`);
            messageTimeoutRef.current = setTimeout(() => setMessage(`Gratulálok! Megtaláltál minden tárgyat ${timeElapsed}s alatt.`), CONFIG.SUCCESS_MESSAGE_DURATION);
            setIsGameActive(false);

            if (timerRef.current) {
                clearInterval(timerRef.current);
                timerRef.current = null;
            }
        }
    }, [allObjectsFound, timeElapsed, isGameActive]);

    // Cleanup message timeout
    useEffect(() => {
        return () => {
            if (messageTimeoutRef.current) {
                clearTimeout(messageTimeoutRef.current);
            }
        };
    }, []);

    // Start new game
    const startGame = useCallback(() => {
        const coords = generateRandomCoordinates();

        // Create new objects with randomized positions
        const newObjects = INITIAL_OBJECTS.map((obj, index) => ({
            ...obj,
            x: coords[index].x,
            y: coords[index].y,
            rotation: Math.floor(Math.random() * 360),
            found: false
        }));

        setObjects(newObjects);
        setStartTime(Date.now());
        setTimeElapsed(0);
        setMessage("");
        setIsGameActive(true);
        setImageError(false);
    }, [generateRandomCoordinates]);

    // Handle image loading errors
    const handleImageError = useCallback(() => {
        setImageError(true);
        setMessage("Kép betöltése sikertelen. Kérlek, ellenőrizd az internetkapcsolatot.");
    }, []);

    // Handle click interactions
    const handleClick = useCallback((e: React.MouseEvent<HTMLImageElement>) => {
        if (!imgRef.current || !isGameActive) return;

        const rect = imgRef.current.getBoundingClientRect();
        const clickX = (e.clientX - rect.left) / rect.width;
        const clickY = (e.clientY - rect.top) / rect.height;

        let foundObject = false;

        setObjects(prevObjects =>
            prevObjects.map(obj => {
                if (obj.found) return obj;

                const dx = obj.x - clickX;
                const dy = obj.y - clickY;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance <= CONFIG.HIT_TOLERANCE) {
                    foundObject = true;
                    return { ...obj, found: true };
                }

                return obj;
            })
        );

        // Show appropriate message
        if (foundObject) {
            setMessage("Talált!");
            messageTimeoutRef.current = setTimeout(() => setMessage(""), CONFIG.SUCCESS_MESSAGE_DURATION);
        } else {
            setMessage("Nem itt — próbáld újra");
            messageTimeoutRef.current = setTimeout(() => setMessage(""), CONFIG.ERROR_MESSAGE_DURATION);
        }
    }, [isGameActive]);

    // Render object markers with images
    const renderObjectMarkers = useMemo(() => {
        return objects.map(obj => (
            <div
                key={obj.id}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                style={{
                    left: `${obj.x * 100}%`,
                    top: `${obj.y * 100}%`,
                    //opacity: obj.found ? 1 : 0.5
                }}
                aria-hidden="true"
            >
                {obj.found ? (
                    // <img src={obj.image}
                    //     alt={obj.name}
                    //     className={cn("w-16 h-16 object-contain scale-120",
                    //         "animate-pulse",
                    //         `rotate-[${obj.rotation}deg]`,
                    //     )}
                    //     title={`Talált: ${obj.name}`}
                    //     style={{ filter: 'drop-shadow(0 2px 2px rgba(255,255,255,0.95))' }}
                    // />
                    <></>
                ) : (
                    obj.image ? (
                        <img
                            src={obj.image}
                            alt={obj.name}
                            className={cn(`w-16 h-16 object-contain rotate-[${obj.rotation}deg]`)}
                            style={{ color: 'white', filter: 'drop-shadow(0 2px 2px rgba(255,255,255,0.3))' }}
                        />
                    ) : (
                        <span className="text-xs text-white opacity-90">✓</span>
                    )
                )}
            </div>
        ));
    }, [objects]);

    // Render object list with images
    const renderObjectList = useMemo(() => {
        return objects.map(obj => (
            <li
                key={obj.id}
                className={cn(
                    "transition-colors duration-200 flex items-center gap-2",
                    obj.found ? 'line-through text-gray-400' : 'text-gray-900'
                )}
            >
                {obj.image && (
                    <img
                        src={obj.image}
                        alt={obj.name}
                        className="w-6 h-6 object-contain"
                    />
                )}
                <span>{obj.name}</span>
            </li>
        ));
    }, [objects]);

    return (
        <div className="min-h-screen flex flex-col items-center p-4 bg-gray-50">
            <div className="w-full max-w-3xl">
                <header className="flex items-center justify-between mb-3">
                    <h1 className="text-2xl font-semibold">Hidden Object — Játék</h1>
                    <div className="space-x-2 flex items-center">
                        <button
                            className="px-3 py-1 rounded shadow bg-white hover:bg-gray-50 transition-colors"
                            onClick={startGame}
                            disabled={imageError}
                        >
                            Új játék
                        </button>
                        <span className="text-sm text-gray-600 font-medium">
                            Idő: {timeElapsed}s
                        </span>
                        <span className="text-sm text-gray-500">
                            Hátralévő: {remainingObjects.length}/{objects.length}
                        </span>
                    </div>
                </header>

                <div className="relative border rounded overflow-hidden bg-white shadow-sm">
                    {imageError ? (
                        <div className="aspect-[4/3] bg-gray-200 flex items-center justify-center text-gray-500">
                            <div className="text-center">
                                <p>Kép betöltése sikertelen</p>
                                <button
                                    className="mt-2 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                                    onClick={startGame}
                                >
                                    Újra próbálkozás
                                </button>
                            </div>
                        </div>
                    ) : (
                        <img
                            ref={imgRef}
                            src={CONFIG.SCENE_URL}
                            alt="Játék jelenet"
                            onClick={handleClick}
                            onLoad={() => setImageError(false)}
                            onError={handleImageError}
                            className="w-full block select-none cursor-crosshair"
                            style={{ aspectRatio: '4 / 3' }}
                            loading="lazy"
                        />
                    )}

                    {/* Object markers */}
                    {renderObjectMarkers}
                    {message && (
                        <div
                            className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-60 text-white px-4 py-2 rounded text-center text-xl font-medium"
                        >
                            {message}
                        </div>
                    )}

                </div>

                <aside className="mt-3 p-3 bg-white rounded shadow">
                    <h2 className="font-medium mb-2">Megtalálandó tárgyak</h2>
                    <ul className="mt-2 space-y-1">
                        {renderObjectList}
                    </ul>

                    {message && (
                        <div
                            className="mt-3 text-sm font-medium transition-opacity duration-300"
                            role="status"
                            aria-live="polite"
                        >
                            {message}
                        </div>
                    )}
                </aside>

                <footer className="mt-4 text-xs text-gray-500">
                    <p>Tippek: A találati pontosság a <code className="bg-gray-100 px-1 rounded">HIT_TOLERANCE</code> értékével állítható.</p>
                    <p className="mt-1">Használd a kurzort a jelenet vizsgálatához, és kattints a megtalált tárgyakra.</p>
                    <p className="mt-1">A jelenet és a tárgyak képei mostantól helyi fájlokból töltődnek be.</p>
                </footer>
            </div>
        </div>
    );
}
