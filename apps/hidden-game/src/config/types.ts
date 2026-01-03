// Type definitions for better type safety

export interface GameObject {
    id: string;
    name: string;
    x: number;
    y: number;
    rotation?: number;
    found: boolean;
    image?: string; // Optional image path for local assets
}

export interface Coordinate {
    x: number;
    y: number;
}

export interface GameState {
    objects: GameObject[];
    startTime: number | null;
    timeElapsed: number;
    isGameActive: boolean;
    message: string;
    imageError: boolean;
}

export interface GameActions {
    startGame: () => void;
    handleImageError: () => void;
    handleClick: (e: React.MouseEvent<HTMLImageElement>) => void;
    setMessage: (message: string) => void;
}

export interface GameDerivedState {
    allObjectsFound: boolean;
    remainingObjects: GameObject[];
    foundObjects: GameObject[];
}