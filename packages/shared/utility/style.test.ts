import { describe, it, expect } from 'vitest';
import { cn } from './style';

describe('cn utility function', () => {
    it('should merge class names correctly', () => {
        const result = cn('bg-blue-500');
        expect(result).toBe('bg-blue-500');
    });

    it('should merge multiple class names', () => {
        const result = cn('bg-blue-500', 'text-white', 'p-4');
        expect(result).toBe('bg-blue-500 text-white p-4');
    });

    it('should handle conditional classes', () => {
        const isActive = true;
        const result = cn('bg-blue-500', isActive && 'border-2');
        expect(result).toBe('bg-blue-500 border-2');
    });

    it('should handle falsy values', () => {
        const result = cn('bg-blue-500', null, undefined, false, 'text-white');
        expect(result).toBe('bg-blue-500 text-white');
    });

    it('should handle arrays of classes', () => {
        const result = cn(['bg-blue-500', 'text-white'], 'p-4');
        expect(result).toBe('bg-blue-500 text-white p-4');
    });

    it('should handle objects for conditional classes', () => {
        const isActive = true;
        const result = cn('bg-blue-500', {
            'border-2': isActive,
            'border-red-500': !isActive
        });
        expect(result).toBe('bg-blue-500 border-2');
    });
});