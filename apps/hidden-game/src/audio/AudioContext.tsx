import React, { createContext, useContext, useEffect, useState, useRef } from 'react';

interface AudioContextType {
    isMusicEnabled: boolean;
    toggleMusic: () => void;
    playSound: (soundName: string) => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export const useAudio = () => {
    const context = useContext(AudioContext);
    if (!context) {
        throw new Error('useAudio must be used within an AudioProvider');
    }
    return context;
};

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isMusicEnabled, setIsMusicEnabled] = useState(() => {
        // Check localStorage for user preference
        const saved = localStorage.getItem('hidden-game-music-enabled');
        return saved ? JSON.parse(saved) : true;
    });

    const audioContextRef = useRef<AudioContext | null>(null);
    const musicAudioRef = useRef<HTMLAudioElement | null>(null);
    const soundEffectsRef = useRef<Map<string, HTMLAudioElement>>(new Map());

    // Initialize audio context
    useEffect(() => {
        // Create audio context on first user interaction
        const handleFirstInteraction = () => {
            if (!audioContextRef.current) {
                audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
            }
            document.removeEventListener('click', handleFirstInteraction);
            document.removeEventListener('keydown', handleFirstInteraction);
        };

        document.addEventListener('click', handleFirstInteraction);
        document.addEventListener('keydown', handleFirstInteraction);

        return () => {
            document.removeEventListener('click', handleFirstInteraction);
            document.removeEventListener('keydown', handleFirstInteraction);
        };
    }, []);

    // Initialize music audio element
    useEffect(() => {
        if (!musicAudioRef.current) {
            musicAudioRef.current = new Audio('/audio/music/kids-happy-background-music-1.mp3');
            musicAudioRef.current.loop = true;
            musicAudioRef.current.volume = 0.3; // Lower volume for background music
        }

        const musicAudio = musicAudioRef.current;

        const toggleMusicPlayback = () => {
            if (isMusicEnabled) {
                // Resume audio context if suspended
                if (audioContextRef.current?.state === 'suspended') {
                    audioContextRef.current.resume();
                }

                musicAudio.play().catch(error => {
                    console.warn('Music playback failed:', error);
                });
            } else {
                musicAudio.pause();
                musicAudio.currentTime = 0;
            }
        };

        toggleMusicPlayback();

        return () => {
            musicAudio.pause();
        };
    }, [isMusicEnabled]);

    // Initialize sound effects
    useEffect(() => {
        const soundEffects = soundEffectsRef.current;

        // Success sound
        const successSound = new Audio('/audio/sfx/successed-295058.mp3');
        successSound.volume = 0.5;
        soundEffects.set('success', successSound);

        // Error sound
        const errorSound = new Audio('/audio/sfx/good-6081.mp3');
        errorSound.volume = 0.5;
        soundEffects.set('error', errorSound);

        // Purchase sound
        const purchaseSound = new Audio('/audio/sfx/purchase-success-384963.mp3');
        purchaseSound.volume = 0.5;
        soundEffects.set('purchase', purchaseSound);

        return () => {
            soundEffects.forEach(sound => {
                sound.pause();
                sound.currentTime = 0;
            });
        };
    }, []);

    const toggleMusic = () => {
        const newMusicState = !isMusicEnabled;
        setIsMusicEnabled(newMusicState);
        localStorage.setItem('hidden-game-music-enabled', JSON.stringify(newMusicState));
    };

    const playSound = (soundName: string) => {
        const sound = soundEffectsRef.current.get(soundName);
        if (sound) {
            // Reset sound to beginning to allow overlapping plays
            sound.currentTime = 0;
            sound.play().catch(error => {
                console.warn(`Failed to play sound ${soundName}:`, error);
            });
        }
    };

    const value: AudioContextType = {
        isMusicEnabled,
        toggleMusic,
        playSound,
    };

    return (
        <AudioContext.Provider value={value}>
            {children}
        </AudioContext.Provider>
    );
};