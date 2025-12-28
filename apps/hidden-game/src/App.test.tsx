import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from './App';

// Mock the shared utility
vi.mock('@mono-game/shared', () => ({
    cn: (...classes: any[]) => classes.filter(Boolean).join(' ')
}));

describe('Hidden Game App', () => {
    const mockStartTime = 1000000;

    beforeEach(() => {
        // Mock Date.now() for consistent timing in tests
        vi.useFakeTimers();
        vi.setSystemTime(mockStartTime);
    });

    afterEach(() => {
        vi.useRealTimers();
        vi.clearAllMocks();
    });

    it('should render the game title and initial state', () => {
        render(<App />);

        expect(screen.getByText('Hidden Object — Játék')).toBeInTheDocument();
        expect(screen.getByText('Idő: 0s')).toBeInTheDocument();
        expect(screen.getByText('Hátralévő: 4/4')).toBeInTheDocument();
        expect(screen.getByText('Megtalálandó tárgyak')).toBeInTheDocument();

        // Check that all objects are initially not found
        expect(screen.getByText('Régi kulcs')).toBeInTheDocument();
        expect(screen.getByText('Könyv')).toBeInTheDocument();
        expect(screen.getByText('Hold')).toBeInTheDocument();
        expect(screen.getByText('Kalap')).toBeInTheDocument();
    });

    it('should start a new game when "Új játék" button is clicked', async () => {
        render(<App />);

        const startButton = screen.getByText('Új játék');
        fireEvent.click(startButton);

        // Check that game state changes
        expect(screen.getByText('Idő: 0s')).toBeInTheDocument();
        expect(screen.getByText('Hátralévő: 4/4')).toBeInTheDocument();

        // Simulate time passing
        vi.advanceTimersByTime(2000);

        await waitFor(() => {
            expect(screen.getByText('Idő: 2s')).toBeInTheDocument();
        });
    });

    it('should handle object clicks correctly', async () => {
        render(<App />);

        // Start the game
        fireEvent.click(screen.getByText('Új játék'));

        // Mock the image click with coordinates that should hit an object
        const image = screen.getByAltText('Játék jelenet');

        // Mock getBoundingClientRect for the image
        Object.defineProperty(image, 'getBoundingClientRect', {
            value: () => ({
                left: 0,
                top: 0,
                width: 1000,
                height: 750
            })
        });

        // Simulate a click that should hit an object (within tolerance)
        fireEvent.click(image, {
            clientX: 180, // x: 0.18 * 1000
            clientY: 510  // y: 0.68 * 750
        });

        // Check that success message appears
        await waitFor(() => {
            expect(screen.getByText('Talált!')).toBeInTheDocument();
        });

        // Check that object count decreases
        expect(screen.getByText('Hátralévő: 3/4')).toBeInTheDocument();
    });

    it('should show error message for missed clicks', async () => {
        render(<App />);

        // Start the game
        fireEvent.click(screen.getByText('Új játék'));

        const image = screen.getByAltText('Játék jelenet');

        // Mock getBoundingClientRect
        Object.defineProperty(image, 'getBoundingClientRect', {
            value: () => ({
                left: 0,
                top: 0,
                width: 1000,
                height: 750
            })
        });

        // Simulate a click that should miss all objects
        fireEvent.click(image, {
            clientX: 500,
            clientY: 375
        });

        // Check that error message appears
        await waitFor(() => {
            expect(screen.getByText('Nem itt — próbáld újra')).toBeInTheDocument();
        });
    });

    it('should complete the game when all objects are found', async () => {
        render(<App />);

        // Start the game
        fireEvent.click(screen.getByText('Új játék'));

        const image = screen.getByAltText('Játék jelenet');
        Object.defineProperty(image, 'getBoundingClientRect', {
            value: () => ({
                left: 0,
                top: 0,
                width: 1000,
                height: 750
            })
        });

        // Simulate finding all objects
        const coordinates = [
            { x: 180, y: 510 },  // key
            { x: 620, y: 300 },  // book  
            { x: 550, y: 90 },   // moon
            { x: 800, y: 165 }   // hat
        ];

        for (const coord of coordinates) {
            fireEvent.click(image, {
                clientX: coord.x,
                clientY: coord.y
            });

            // Wait for message to appear and disappear
            await waitFor(() => {
                expect(screen.getByText('Talált!')).toBeInTheDocument();
            });

            vi.advanceTimersByTime(1000);
        }

        // Check game completion message
        await waitFor(() => {
            expect(screen.getByText(/Gratulálok! Megtaláltad minden tárgyat/)).toBeInTheDocument();
        });

        // Check that game is no longer active
        expect(screen.queryByText('Hátralévő:')).not.toBeInTheDocument();
    });

    it('should handle image loading errors', async () => {
        render(<App />);

        const image = screen.getByAltText('Játék jelenet');

        // Simulate image error
        fireEvent.error(image);

        await waitFor(() => {
            expect(screen.getByText('Kép betöltése sikertelen')).toBeInTheDocument();
            expect(screen.getByText('Újra próbálkozás')).toBeInTheDocument();
        });
    });

    it('should reset game state when starting new game', async () => {
        render(<App />);

        // Start game and find one object
        fireEvent.click(screen.getByText('Új játék'));

        const image = screen.getByAltText('Játék jelenet');
        Object.defineProperty(image, 'getBoundingClientRect', {
            value: () => ({
                left: 0,
                top: 0,
                width: 1000,
                height: 750
            })
        });

        fireEvent.click(image, {
            clientX: 180,
            clientY: 510
        });

        await waitFor(() => {
            expect(screen.getByText('Hátralévő: 3/4')).toBeInTheDocument();
        });

        // Start new game
        fireEvent.click(screen.getByText('Új játék'));

        // Check that all objects are reset
        expect(screen.getByText('Hátralévő: 4/4')).toBeInTheDocument();
        expect(screen.getByText('Régi kulcs')).not.toHaveClass('line-through');
    });
});