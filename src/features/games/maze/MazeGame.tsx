import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Grid, Box } from '../../../components/mui';
import { GlobalHeader } from '../../../components/layout/GlobalHeader';
import { COLORS } from '../../../config/theme';
import { generateMaze, MazeData, MazeAlgorithm } from './mazeLogic';
import { useWindow, useMobile } from '../../../hooks';

const MAZE_SIZE = 15;
const CELL_SIZE = 60; // Base pixel size for cells
const PLAYER_RADIUS = 12;
const WALL_THICKNESS = 4;

interface JoystickState {
    active: boolean;
    originConfig: { x: number; y: number } | null;
    currentConfig: { x: number; y: number } | null;
}

export default function MazeGame(): React.ReactElement {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [maze, setMaze] = useState<MazeData | null>(null);
    const [gameState, setGameState] = useState<'start' | 'playing' | 'won'>(
        'start'
    );
    const [algorithm, _setAlgorithm] = useState<MazeAlgorithm>('backtracker');

    // Refs for simulation state to avoid re-renders
    const stateRef = useRef({
        player: { x: 0, y: 0, rotation: 0 },
        goal: { x: 0, y: 0, rotation: 0 },
        camera: { x: 0, y: 0 },
        gameState: 'start',
    });

    const { height, width } = useWindow();
    const isMobile = useMobile('sm');
    const availableHeight = height - (isMobile ? 56 : 80);

    // Pointer/Touch Input State
    const pointerState = useRef({
        isDown: false,
        startX: 0,
        startY: 0,
        currentX: 0,
        currentY: 0,
    });

    const [visualJoystickState, setVisualJoystickState] =
        useState<JoystickState>({
            active: false,
            originConfig: null,
            currentConfig: null,
        });

    const initMaze = useCallback(() => {
        const newMaze = generateMaze(MAZE_SIZE, MAZE_SIZE, algorithm);
        setMaze(newMaze);

        // Initialize player and goal positions in pixel coordinates
        stateRef.current.player = {
            x: newMaze.start[1] * CELL_SIZE + CELL_SIZE / 2,
            y: newMaze.start[0] * CELL_SIZE + CELL_SIZE / 2,
            rotation: 0,
        };
        stateRef.current.goal = {
            x: newMaze.end[1] * CELL_SIZE + CELL_SIZE / 2,
            y: newMaze.end[0] * CELL_SIZE + CELL_SIZE / 2,
            rotation: 0,
        };

        stateRef.current.gameState = 'playing';
        setGameState('playing');
    }, [algorithm]);

    useEffect(() => {
        initMaze();
    }, [initMaze]);

    // Game Loop & Rendering
    useEffect(() => {
        if (!maze || gameState !== 'playing' || !canvasRef.current) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d', { alpha: true });
        if (!ctx) return;

        let animationId: number;
        const keys: Record<string, boolean> = {};

        const handleKeyDown = (e: KeyboardEvent) => {
            keys[e.key.toLowerCase()] = true;
        };
        const handleKeyUp = (e: KeyboardEvent) => {
            keys[e.key.toLowerCase()] = false;
        };
        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);

        const animate = (time: number) => {
            animationId = requestAnimationFrame(animate);

            // 1. Simulation Logic
            const moveSpeed = 4.5;
            const kdx =
                (keys.d || keys.arrowright ? 1 : 0) -
                (keys.a || keys.arrowleft ? 1 : 0);
            const kdy =
                (keys.s || keys.arrowdown ? 1 : 0) -
                (keys.w || keys.arrowup ? 1 : 0);

            let pdx = 0;
            let pdy = 0;
            const MAX_DRAG = 80;
            if (pointerState.current.isDown) {
                pdx = Math.max(
                    -1,
                    Math.min(
                        1,
                        (pointerState.current.currentX -
                            pointerState.current.startX) /
                            MAX_DRAG
                    )
                );
                pdy = Math.max(
                    -1,
                    Math.min(
                        1,
                        (pointerState.current.currentY -
                            pointerState.current.startY) /
                            MAX_DRAG
                    )
                );
            }

            const dx = kdx + pdx;
            const dy = kdy + pdy;

            if (dx !== 0 || dy !== 0) {
                const angle = Math.atan2(dy, dx);
                const mag = Math.min(1, Math.sqrt(dx * dx + dy * dy));
                const vx = Math.cos(angle) * mag * moveSpeed;
                const vy = Math.sin(angle) * mag * moveSpeed;

                // Simple 2D Collision (Cell-based)
                const nextX = stateRef.current.player.x + vx;
                const nextY = stateRef.current.player.y + vy;

                const canMoveTo = (px: number, py: number) => {
                    const r = PLAYER_RADIUS + 2;
                    const c = Math.floor(px / CELL_SIZE);
                    const r_idx = Math.floor(py / CELL_SIZE);

                    if (
                        r_idx < 0 ||
                        r_idx >= MAZE_SIZE ||
                        c < 0 ||
                        c >= MAZE_SIZE
                    )
                        return false;

                    const cell = maze.grid[r_idx]?.[c];
                    if (!cell) return false;

                    // Distance to walls
                    const left = c * CELL_SIZE;
                    const right = (c + 1) * CELL_SIZE;
                    const top = r_idx * CELL_SIZE;
                    const bottom = (r_idx + 1) * CELL_SIZE;

                    if (cell.walls.left && px - r < left) return false;
                    if (cell.walls.right && px + r > right) return false;
                    if (cell.walls.top && py - r < top) return false;
                    if (cell.walls.bottom && py + r > bottom) return false;

                    // Corner collisions (simplified)
                    return true;
                };

                if (canMoveTo(nextX, stateRef.current.player.y))
                    stateRef.current.player.x = nextX;
                if (canMoveTo(stateRef.current.player.x, nextY))
                    stateRef.current.player.y = nextY;

                stateRef.current.player.rotation += mag * 0.15;
            }

            // Camera follow
            stateRef.current.camera.x +=
                (stateRef.current.player.x - stateRef.current.camera.x) * 0.1;
            stateRef.current.camera.y +=
                (stateRef.current.player.y - stateRef.current.camera.y) * 0.1;

            // Win condition
            const distToGoal = Math.sqrt(
                Math.pow(
                    stateRef.current.player.x - stateRef.current.goal.x,
                    2
                ) +
                    Math.pow(
                        stateRef.current.player.y - stateRef.current.goal.y,
                        2
                    )
            );
            if (distToGoal < 30 && stateRef.current.gameState === 'playing') {
                stateRef.current.gameState = 'won';
                setGameState('won');
                setTimeout(() => {
                    initMaze();
                }, 1500);
            }

            // 2. Rendering Logic
            const dpr = window.devicePixelRatio || 1;
            canvas.width = width * dpr;
            canvas.height = availableHeight * dpr;
            ctx.scale(dpr, dpr);

            ctx.clearRect(0, 0, width, availableHeight);

            ctx.save();
            ctx.translate(
                width / 2 - stateRef.current.camera.x,
                availableHeight / 2 - stateRef.current.camera.y
            );

            // Draw Background Grid
            const GRID_SPACING = CELL_SIZE / 2;
            const viewLeft = stateRef.current.camera.x - width / 2;
            const viewRight = stateRef.current.camera.x + width / 2;
            const viewTop = stateRef.current.camera.y - availableHeight / 2;
            const viewBottom = stateRef.current.camera.y + availableHeight / 2;

            ctx.beginPath();
            ctx.strokeStyle = 'rgba(56, 139, 253, 0.05)';
            ctx.lineWidth = 1;
            for (
                let x = Math.floor(viewLeft / GRID_SPACING) * GRID_SPACING;
                x <= viewRight;
                x += GRID_SPACING
            ) {
                ctx.moveTo(x, viewTop);
                ctx.lineTo(x, viewBottom);
            }
            for (
                let y = Math.floor(viewTop / GRID_SPACING) * GRID_SPACING;
                y <= viewBottom;
                y += GRID_SPACING
            ) {
                ctx.moveTo(viewLeft, y);
                ctx.lineTo(viewRight, y);
            }
            ctx.stroke();

            // Draw Walls
            ctx.strokeStyle = COLORS.text.secondary;
            ctx.lineWidth = WALL_THICKNESS;
            ctx.lineCap = 'round';
            ctx.shadowColor = COLORS.text.secondary;
            ctx.shadowBlur = isMobile ? 3 : 5;

            maze.grid.forEach((row, r) => {
                row.forEach((cell, c) => {
                    const x = c * CELL_SIZE;
                    const y = r * CELL_SIZE;

                    ctx.beginPath();
                    if (cell.walls.top) {
                        ctx.moveTo(x, y);
                        ctx.lineTo(x + CELL_SIZE, y);
                    }
                    if (cell.walls.left) {
                        ctx.moveTo(x, y);
                        ctx.lineTo(x, y + CELL_SIZE);
                    }
                    // Outer bounds
                    if (c === MAZE_SIZE - 1 && cell.walls.right) {
                        ctx.moveTo(x + CELL_SIZE, y);
                        ctx.lineTo(x + CELL_SIZE, y + CELL_SIZE);
                    }
                    if (r === MAZE_SIZE - 1 && cell.walls.bottom) {
                        ctx.moveTo(x, y + CELL_SIZE);
                        ctx.lineTo(x + CELL_SIZE, y + CELL_SIZE);
                    }
                    ctx.stroke();
                });
            });
            ctx.shadowBlur = 0;

            // Draw Goal
            const goal = stateRef.current.goal;
            goal.rotation += 0.02;
            ctx.save();
            ctx.translate(goal.x, goal.y);
            ctx.rotate(goal.rotation);
            ctx.fillStyle = COLORS.primary.main;
            ctx.shadowColor = COLORS.primary.main;
            ctx.shadowBlur = 15;
            ctx.beginPath();
            ctx.rect(-10, -10, 20, 20); // Smaller goal (20x20)
            ctx.fill();
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
            ctx.lineWidth = 2;
            ctx.stroke();
            ctx.restore();

            // Draw Player
            const player = stateRef.current.player;
            ctx.save();
            ctx.translate(player.x, player.y);

            // Glow
            const gradient = ctx.createRadialGradient(
                0,
                0,
                0,
                0,
                0,
                PLAYER_RADIUS * 2
            );
            gradient.addColorStop(0, COLORS.data.amber);
            gradient.addColorStop(1, 'transparent');
            ctx.fillStyle = gradient;
            ctx.globalAlpha = 0.5 + Math.sin(time * 0.005) * 0.2;
            ctx.beginPath();
            ctx.arc(0, 0, PLAYER_RADIUS * 2, 0, Math.PI * 2);
            ctx.fill();
            ctx.globalAlpha = 1.0;

            // Core
            ctx.fillStyle = COLORS.data.amber;
            ctx.beginPath();
            ctx.arc(0, 0, PLAYER_RADIUS, 0, Math.PI * 2);
            ctx.fill();

            ctx.restore();

            ctx.restore();
        };
        requestAnimationFrame(animate);

        return () => {
            cancelAnimationFrame(animationId);
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, [maze, gameState, width, availableHeight, isMobile, initMaze]);

    const handlePointerDown = (e: React.PointerEvent) => {
        if (gameState !== 'playing') return;
        pointerState.current.isDown = true;
        pointerState.current.startX = e.clientX;
        pointerState.current.startY = e.clientY;
        pointerState.current.currentX = e.clientX;
        pointerState.current.currentY = e.clientY;

        setVisualJoystickState({
            active: true,
            originConfig: { x: e.clientX, y: e.clientY },
            currentConfig: { x: e.clientX, y: e.clientY },
        });
    };

    const handlePointerMove = (e: PointerEvent) => {
        if (!pointerState.current.isDown) return;
        pointerState.current.currentX = e.clientX;
        pointerState.current.currentY = e.clientY;

        setVisualJoystickState(prev => {
            if (!prev.originConfig) return prev;
            const VISUAL_RADIUS = 50;
            const dx = e.clientX - prev.originConfig.x;
            const dy = e.clientY - prev.originConfig.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            let x = e.clientX;
            let y = e.clientY;
            if (distance > VISUAL_RADIUS) {
                const ratio = VISUAL_RADIUS / distance;
                x = prev.originConfig.x + dx * ratio;
                y = prev.originConfig.y + dy * ratio;
            }
            return { ...prev, currentConfig: { x, y } };
        });
    };

    const handlePointerUp = () => {
        pointerState.current.isDown = false;
        setVisualJoystickState({
            active: false,
            originConfig: null,
            currentConfig: null,
        });
    };

    useEffect(() => {
        window.addEventListener('pointermove', handlePointerMove);
        window.addEventListener('pointerup', handlePointerUp);
        return () => {
            window.removeEventListener('pointermove', handlePointerMove);
            window.removeEventListener('pointerup', handlePointerUp);
        };
    }, []);

    useEffect(() => {
        document.title = '2D Maze | Bangyen';
    }, []);

    return (
        <Grid
            container
            minHeight="100vh"
            flexDirection="column"
            sx={{ background: COLORS.surface.background, overflow: 'hidden' }}
        >
            <GlobalHeader showHome={true} />
            <Box
                ref={containerRef}
                onPointerDown={handlePointerDown}
                sx={{
                    flex: 1,
                    position: 'relative',
                    touchAction: 'none',
                    backgroundColor: 'transparent',
                }}
            >
                <canvas
                    ref={canvasRef}
                    style={{
                        display: 'block',
                        width: '100%',
                        height: '100%',
                    }}
                />
            </Box>

            {visualJoystickState.active &&
                visualJoystickState.originConfig &&
                visualJoystickState.currentConfig && (
                    <Box
                        sx={{
                            position: 'absolute',
                            left: 0,
                            top: 0,
                            width: '100%',
                            height: '100%',
                            pointerEvents: 'none',
                            zIndex: 20,
                        }}
                    >
                        <Box
                            sx={{
                                position: 'absolute',
                                left: visualJoystickState.originConfig.x,
                                top: visualJoystickState.originConfig.y,
                                width: 100,
                                height: 100,
                                transform: 'translate(-50%, -50%)',
                                borderRadius: '50%',
                                border: `2px solid ${COLORS.primary.main}`,
                                opacity: 0.3,
                                background: `radial-gradient(circle, ${COLORS.primary.main} 0%, transparent 70%)`,
                            }}
                        />
                        <Box
                            sx={{
                                position: 'absolute',
                                left: visualJoystickState.currentConfig.x,
                                top: visualJoystickState.currentConfig.y,
                                width: 40,
                                height: 40,
                                transform: 'translate(-50%, -50%)',
                                borderRadius: '50%',
                                background: COLORS.primary.main,
                                boxShadow: `0 0 15px ${COLORS.primary.main}`,
                                opacity: 0.8,
                            }}
                        />
                    </Box>
                )}
        </Grid>
    );
}
