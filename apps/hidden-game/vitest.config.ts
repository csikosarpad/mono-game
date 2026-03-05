import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
    plugins: [react()],
    test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: ['./src/test-setup.ts'],
        include: ['**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
        exclude: [
            '**/node_modules/**',
            '**/dist/**',
            '**/cypress/**',
            '**/.{idea,git,cache,output,temp}/**',
            '**/{karma,rollup,webpack,vite,vitest,jest,ava,babel,nyc,cypress,tsup,build,eslint,prettier}.config.*',
            '**/samples/**',
            '**/examples/**'
        ],
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
            '@mono-game/shared': path.resolve(__dirname, '../../packages/shared'),
            '@mono-game/shared-ui': path.resolve(__dirname, '../../packages/shared-ui'),
            '@mono-game/shared-styles': path.resolve(__dirname, '../../packages/shared-styles'),
        },
    },
});