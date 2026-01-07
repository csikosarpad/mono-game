import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { cn } from '@mono-game/shared';
import { GAME_CONFIG, INITIAL_OBJECTS, MESSAGES, TEXT } from './config/config';
import { GameObject, Coordinate } from './config/types';
import './App.scss';

export default function App() {
    // State management
    const [objects, setObjects] = useState<GameObject[]>(
        INITIAL_OBJECTS.map(obj => ({ ...obj, found: false }))
    );
    const [startTime, setStartTime] = useState<number | null>(null);
    const [timeElapsed, setTimeElapsed] = useState(0);
    const [message, setMessage] = useState("");
    const [isGameActive, setIsGameActive] = useState(true);
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
                        (GAME_CONFIG.MAX_COORDINATE - GAME_CONFIG.MIN_COORDINATE) +
                        GAME_CONFIG.MIN_COORDINATE
                    ).toFixed(GAME_CONFIG.COORDINATE_PRECISION),
                    y: +(
                        Math.random() *
                        (GAME_CONFIG.MAX_COORDINATE - GAME_CONFIG.MIN_COORDINATE) +
                        GAME_CONFIG.MIN_COORDINATE
                    ).toFixed(GAME_CONFIG.COORDINATE_PRECISION)
                };

                // Check for collision with existing coordinates
                const hasCollision = coords.some(existing => {
                    const distance = Math.sqrt(
                        Math.pow(newCoord.x - existing.x, 2) +
                        Math.pow(newCoord.y - existing.y, 2)
                    );
                    return distance < GAME_CONFIG.HIT_TOLERANCE;
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
                    x: +(Math.random() * (GAME_CONFIG.MAX_COORDINATE - GAME_CONFIG.MIN_COORDINATE) + GAME_CONFIG.MIN_COORDINATE).toFixed(GAME_CONFIG.COORDINATE_PRECISION),
                    y: +(Math.random() * (GAME_CONFIG.MAX_COORDINATE - GAME_CONFIG.MIN_COORDINATE) + GAME_CONFIG.MIN_COORDINATE).toFixed(GAME_CONFIG.COORDINATE_PRECISION)
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
            messageTimeoutRef.current = setTimeout(() => setMessage(MESSAGES.GAME_COMPLETE(timeElapsed)), GAME_CONFIG.SUCCESS_MESSAGE_DURATION);
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

    // Initialize game on mount
    useEffect(() => {
        startGame();
    }, [startGame]);

    // Handle image loading errors
    const handleImageError = useCallback(() => {
        setImageError(true);
        setMessage(MESSAGES.MAP_ERROR);
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

                if (distance <= GAME_CONFIG.HIT_TOLERANCE) {
                    foundObject = true;
                    return { ...obj, found: true };
                }

                return obj;
            })
        );

        // Show appropriate message
        if (foundObject) {
            setMessage(MESSAGES.SUCCESS);
            messageTimeoutRef.current = setTimeout(() => setMessage(""), GAME_CONFIG.SUCCESS_MESSAGE_DURATION);
        } else {
            setMessage(MESSAGES.NOT_HERE);
            messageTimeoutRef.current = setTimeout(() => setMessage(""), GAME_CONFIG.ERROR_MESSAGE_DURATION);
        }
    }, [isGameActive]);

    const populateMysteryItems = useMemo(() => {
        return objects.map(obj => (
            <div
                key={obj.id}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                style={{
                    left: `${obj.x * 100}%`,
                    top: `${obj.y * 100}%`,
                }}
                aria-hidden="true"
            >
                {obj.found ? (
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
                            {TEXT.NEW_GAME}
                        </button>
                        <span className="text-sm text-gray-600 font-medium">
                            {TEXT.TIME(timeElapsed)}
                        </span>
                        <span className="text-sm text-gray-500">
                            {TEXT.REMAINING(remainingObjects.length, objects.length)}
                        </span>
                    </div>
                </header>

                <div className="relative border rounded overflow-hidden bg-white shadow-sm">
                    {imageError ? (
                        <div className="aspect-[4/3] bg-gray-200 flex items-center justify-center text-gray-500">
                            <div className="text-center">
                                <p>{TEXT.IMAGE_ERROR}</p>
                                <button
                                    className="mt-2 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                                    onClick={startGame}
                                >
                                    {TEXT.RETRY_IMAGE}
                                </button>
                            </div>
                        </div>
                    ) : (
                        <img
                            ref={imgRef}
                            src={GAME_CONFIG.SCENE_URL}
                            alt="Játék jelenet"
                            onClick={handleClick}
                            onLoad={() => setImageError(false)}
                            onError={handleImageError}
                            className="w-full block select-none cursor-crosshair"
                            style={{ aspectRatio: '4 / 3' }}
                            loading="lazy"
                        />
                    )}

                    {populateMysteryItems}
                    {message && (
                        <div
                            className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-60 text-white px-4 py-2 rounded text-center text-xl font-medium"
                        >
                            {message}
                        </div>
                    )}

                </div>

                <aside className="mt-3 p-3 bg-white rounded shadow">
                    <h2 className="font-medium mb-2">{TEXT.OBJECTS}</h2>
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
                    {/* <p>Tippek: A találati pontosság a <code className="bg-gray-100 px-1 rounded">HIT_TOLERANCE</code> értékével állítható.</p> */}
                    <p className="mt-1">Használd a kurzort a jelenet vizsgálatához, és kattints a megtalált tárgyakra.</p>
                </footer>
            </div>
        </div>
    );
}
