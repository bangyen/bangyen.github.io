/// <reference types="vitest" />
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import path from 'path';

export default defineConfig(async ({ mode }) => {
    const isTest = mode === 'test' || !!process.env.VITEST;

    const plugins = [react(), tsconfigPaths()];

    if (!isTest) {
        const wasm = (await import('vite-plugin-wasm')).default;
        const topLevelAwait = (await import('vite-plugin-top-level-await'))
            .default;
        plugins.push(wasm(), topLevelAwait());
    }

    return {
        plugins,
        resolve: {
            alias: {
                'lights-out-wasm': path.resolve(
                    import.meta.dirname,
                    'wasm/lights-out-wasm/pkg/lights_out_wasm.js'
                ),
                'slant-wasm': path.resolve(
                    import.meta.dirname,
                    'wasm/slant-wasm/pkg/slant_wasm.js'
                ),
            },
        },
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
                    manualChunks(id: string) {
                        if (id.includes('node_modules')) {
                            if (id.includes('@mui/icons-material')) {
                                return 'vendor_mui_icons';
                            }
                            if (id.includes('@mui') || id.includes('@emotion')) {
                                return 'vendor_mui_core';
                            }
                            if (id.includes('recharts')) {
                                return 'vendor_recharts';
                            }
                            if (id.includes('katex')) {
                                return 'vendor_math';
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
            pool: 'forks', // Use forks for better compatibility with Bun/Node environments
            globals: true,
            environment: 'jsdom',
            setupFiles: './src/setupTests.ts',
            include: ['src/**/*.test.{js,jsx,ts,tsx}'],
            // Exclude tests that require WASM modules (must be built with wasm-pack first)
            exclude: [
                'src/features/games/lights-out/__tests__/Example.test.tsx',
                'src/features/games/lights-out/__tests__/boardHandlers.test.ts',
                'src/features/games/lights-out/__tests__/matrices.test.ts',
                'src/features/games/slant/__tests__/wasmInit.test.ts',
                'src/utils/math/gf2/__tests__/inversion.test.ts',
                'node_modules',
            ],
            // Optimization: Disable CSS parsing for logic tests
            css: false,
            isolate: true,
            fileParallelism: true,
            maxWorkers: '50%',
            sequence: {
                hooks: 'list',
            },
            coverage: {
                provider: 'v8',
                reporter: ['text', 'lcov', 'html'],
                thresholds: {
                    statements: 85,
                    branches: 75,
                    functions: 85,
                    lines: 85,
                },
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
    };
});
