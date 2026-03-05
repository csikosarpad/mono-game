import React from 'react';
import { useAudio } from '../audio/AudioContext';
import { cn } from '@mono-game/shared';

export const MusicToggle: React.FC = () => {
    const { isMusicEnabled, toggleMusic } = useAudio();

    return (
        <button
            onClick={toggleMusic}
            className={cn(
                "px-3 py-1 rounded shadow transition-colors duration-200",
                "flex items-center gap-2",
                "bg-game-card hover:bg-gray-50 dark:hover:bg-gray-700",
                "text-game-text border border-game-border"
            )}
            aria-label={isMusicEnabled ? "Hang kikapcsolása" : "Hang bekapcsolása"}
            title={isMusicEnabled ? "Hang kikapcsolása" : "Hang bekapcsolása"}
        >
            <span className="text-sm font-medium">
                {isMusicEnabled ? "🎵 Zene: BE" : "🔇 Zene: KI"}
            </span>
        </button>
    );
};