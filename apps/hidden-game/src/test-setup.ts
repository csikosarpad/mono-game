import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock the shared utility
vi.mock('@mono-game/shared', () => ({
    cn: (...classes: any[]) => classes.filter(Boolean).join(' ')
}));