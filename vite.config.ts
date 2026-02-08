/// <reference types="vitest" />
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import wasm from 'vite-plugin-wasm';
import topLevelAwait from 'vite-plugin-top-level-await';

export default defineConfig({
    plugins: [react(), tsconfigPaths(), wasm(), topLevelAwait()],
    worker: {
        format: 'es',
    },
    build: {
        outDir: 'build', // Maintain 'build' for gh-pages compatibility
        // Enable source maps for production debugging (can be disabled for smaller builds)
        sourcemap: false,
        // Minification options
        minify: 'terser',
        terserOptions: {
            compress: {
                drop_console: true, // Remove console.logs in production
                drop_debugger: true,
                pure_funcs: ['console.log', 'console.info'], // Remove specific console methods
            },
        },
        // CSS code splitting
        cssCodeSplit: true,
        // Chunk size warnings - reduced to catch issues earlier
        chunkSizeWarningLimit: 400, // Warn if chunks exceed 400KB
        // Asset inlining threshold (assets smaller than this will be inlined as base64)
        assetsInlineLimit: 4096, // 4KB
        rollupOptions: {
            output: {
                // Optimize chunk file names
                chunkFileNames: 'assets/[name]-[hash].js',
                entryFileNames: 'assets/[name]-[hash].js',
                assetFileNames: 'assets/[name]-[hash].[ext]',
                // Manual chunk splitting for better caching
                manualChunks(id) {
                    if (id.includes('node_modules')) {
                        if (id.includes('@mui/icons-material')) {
                            return 'vendor_mui_icons';
                        }
                        if (
                            id.includes('@mui') ||
                            id.includes('@emotion')
                        ) {
                            return 'vendor_mui_core';
                        }
                        if (id.includes('recharts')) {
                            return 'vendor_recharts';
                        }
                        if (
                            id.includes('/node_modules/react/') ||
                            id.includes('/node_modules/react-dom/') ||
                            id.includes('/node_modules/react-router/') ||
                            id.includes('/node_modules/react-router-dom/')
                        ) {
                            return 'vendor_react';
                        }
                    }
                },
            },
            // Tree-shaking optimizations
            treeshake: {
                moduleSideEffects: false,
                propertyReadSideEffects: false,
            },
        },
    },
    // Optimize dependencies
    optimizeDeps: {
        include: ['react', 'react-dom', 'react-router-dom'],
    },
    server: {
        open: true,
        port: 3000,
    },
    test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: './src/setupTests.ts',
        include: ['src/**/*.test.{js,jsx,ts,tsx}'],
        // Optimization: Disable CSS parsing for logic tests
        css: false,
        // Optimization: Fine-tune performance (Vitest 4 options)
        pool: 'threads',
        isolate: true,
        fileParallelism: true,
        maxWorkers: '50%',
        sequence: {
            hooks: 'list',
        },
        coverage: {
            provider: 'v8',
            reporter: ['text', 'lcov', 'html'],
            exclude: [
                'src/index.tsx',
                'src/setupTests.ts',
                'src/**/*.test.{js,jsx,ts,tsx}',
                'src/**/*.d.ts',
                'config/**',
                'build/**',
                'coverage/**',
                '**/*.config.{js,ts,mjs}',
            ],
        },
    },
});
