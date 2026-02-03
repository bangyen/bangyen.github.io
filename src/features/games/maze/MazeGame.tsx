import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Grid, Box } from '../../../components/mui';
import { GlobalHeader } from '../../../components/layout/GlobalHeader';
import { COLORS } from '../../../config/theme';
import { generateMaze, MazeData, MazeAlgorithm } from './mazeLogic';
import { useWindow, useMobile } from '../../../hooks';

const MAZE_SIZE = 21;
const CELL_SIZE = 100; // Closer zoom
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
        lastTime: 0,
        trail: [] as { x: number; y: number }[],
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
        stateRef.current.lastTime = 0; // Reset timing
        setGameState('playing');
    }, [algorithm]);

    useEffect(() => {
        initMaze();
    }, [initMaze]);

    // Handle Resize
    useEffect(() => {
        if (!canvasRef.current) return;
        const canvas = canvasRef.current;
        const dpr = window.devicePixelRatio || 1;
        canvas.width = width * dpr;
        canvas.height = availableHeight * dpr;
        const ctx = canvas.getContext('2d');
        if (ctx) ctx.scale(dpr, dpr);
    }, [width, availableHeight]);

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

            // Calculate delta time
            const dt = stateRef.current.lastTime
                ? (time - stateRef.current.lastTime) / 16.67 // Normalize to 60fps
                : 1;
            stateRef.current.lastTime = time;

            // 1. Simulation Logic
            const moveSpeed = 6.0 * dt;
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

                stateRef.current.player.rotation += mag * 0.15 * dt;

                // Add to trail
                stateRef.current.trail.push({
                    x: stateRef.current.player.x,
                    y: stateRef.current.player.y,
                });
            }

            // Trail dissipation logic
            const currentTrail = stateRef.current.trail;
            const maxTrail = 15;
            if (currentTrail.length > (dx !== 0 || dy !== 0 ? maxTrail : 0)) {
                currentTrail.shift();
            }

            // Camera follow (smoothed with dt)
            const cameraLerp = 1 - Math.pow(0.9, dt); // FPS-independent lerp
            stateRef.current.camera.x +=
                (stateRef.current.player.x - stateRef.current.camera.x) *
                cameraLerp;
            stateRef.current.camera.y +=
                (stateRef.current.player.y - stateRef.current.camera.y) *
                cameraLerp;

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
            // Only update canvas dimensions if they changed (handled by useEffect now)

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
            ctx.strokeStyle = COLORS.primary.main;
            ctx.globalAlpha = 0.03;
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
            ctx.globalAlpha = 1.0;

            // Draw Walls
            ctx.strokeStyle = COLORS.primary.main;
            ctx.lineWidth = WALL_THICKNESS;
            ctx.lineCap = 'round';
            ctx.shadowColor = COLORS.primary.main;
            ctx.shadowBlur = 0;

            const CORNER_RADIUS = 12;
            ctx.beginPath();
            for (let r = 0; r <= MAZE_SIZE; r++) {
                for (let c = 0; c <= MAZE_SIZE; c++) {
                    const x = c * CELL_SIZE;
                    const y = r * CELL_SIZE;

                    // Connectivity at intersection (r, c)
                    const n =
                        r > 0 &&
                        (c < MAZE_SIZE
                            ? (maze.grid[r - 1]?.[c]?.walls.left ?? false)
                            : (maze.grid[r - 1]?.[c - 1]?.walls.right ??
                              false));
                    const s =
                        r < MAZE_SIZE &&
                        (c < MAZE_SIZE
                            ? (maze.grid[r]?.[c]?.walls.left ?? false)
                            : (maze.grid[r]?.[c - 1]?.walls.right ?? false));
                    const w =
                        c > 0 &&
                        (r < MAZE_SIZE
                            ? (maze.grid[r]?.[c - 1]?.walls.top ?? false)
                            : (maze.grid[r - 1]?.[c - 1]?.walls.bottom ??
                              false));
                    const e =
                        c < MAZE_SIZE &&
                        (r < MAZE_SIZE
                            ? (maze.grid[r]?.[c]?.walls.top ?? false)
                            : (maze.grid[r - 1]?.[c]?.walls.bottom ?? false));

                    const count =
                        (n ? 1 : 0) + (s ? 1 : 0) + (w ? 1 : 0) + (e ? 1 : 0);

                    // 1. Draw Arcs for L-junctions
                    if (count === 2) {
                        if (n && e && !s && !w) {
                            ctx.moveTo(x, y - CORNER_RADIUS);
                            ctx.arcTo(
                                x,
                                y,
                                x + CORNER_RADIUS,
                                y,
                                CORNER_RADIUS
                            );
                        } else if (e && s && !w && !n) {
                            ctx.moveTo(x + CORNER_RADIUS, y);
                            ctx.arcTo(
                                x,
                                y,
                                x,
                                y + CORNER_RADIUS,
                                CORNER_RADIUS
                            );
                        } else if (s && w && !n && !e) {
                            ctx.moveTo(x, y + CORNER_RADIUS);
                            ctx.arcTo(
                                x,
                                y,
                                x - CORNER_RADIUS,
                                y,
                                CORNER_RADIUS
                            );
                        } else if (w && n && !e && !s) {
                            ctx.moveTo(x - CORNER_RADIUS, y);
                            ctx.arcTo(
                                x,
                                y,
                                x,
                                y - CORNER_RADIUS,
                                CORNER_RADIUS
                            );
                        }
                    }

                    // 2. Draw Main Segments (Shortened)
                    // Draw South Vertical Segment
                    if (s) {
                        const startY =
                            count === 2 && (w || e) ? y + CORNER_RADIUS : y;
                        // Connectivity at node below (r+1, c)
                        const nr = r + 1;
                        const _nn = true; // current 's'
                        const ns =
                            nr < MAZE_SIZE &&
                            (c < MAZE_SIZE
                                ? (maze.grid[nr]?.[c]?.walls.left ?? false)
                                : (maze.grid[nr]?.[c - 1]?.walls.right ??
                                  false));
                        const nw =
                            c > 0 &&
                            (nr < MAZE_SIZE
                                ? (maze.grid[nr]?.[c - 1]?.walls.top ?? false)
                                : (maze.grid[nr - 1]?.[c - 1]?.walls.bottom ??
                                  false));
                        const ne =
                            c < MAZE_SIZE &&
                            (nr < MAZE_SIZE
                                ? (maze.grid[nr]?.[c]?.walls.top ?? false)
                                : (maze.grid[nr - 1]?.[c]?.walls.bottom ??
                                  false));
                        const nCount =
                            1 + (ns ? 1 : 0) + (nw ? 1 : 0) + (ne ? 1 : 0);
                        const endY =
                            nCount === 2 && (nw || ne)
                                ? (r + 1) * CELL_SIZE - CORNER_RADIUS
                                : (r + 1) * CELL_SIZE;
                        ctx.moveTo(x, startY);
                        ctx.lineTo(x, endY);
                    }
                    // Draw East Horizontal Segment
                    if (e) {
                        const startX =
                            count === 2 && (n || s) ? x + CORNER_RADIUS : x;
                        // Connectivity at node to the right (r, c+1)
                        const nc = c + 1;
                        const nn =
                            r > 0 &&
                            (nc < MAZE_SIZE
                                ? (maze.grid[r - 1]?.[nc]?.walls.left ?? false)
                                : (maze.grid[r - 1]?.[nc - 1]?.walls.right ??
                                  false));
                        const ns =
                            r < MAZE_SIZE &&
                            (nc < MAZE_SIZE
                                ? (maze.grid[r]?.[nc]?.walls.left ?? false)
                                : (maze.grid[r]?.[nc - 1]?.walls.right ??
                                  false));
                        const _nw = true; // current 'e'
                        const ne =
                            nc < MAZE_SIZE &&
                            (r < MAZE_SIZE
                                ? (maze.grid[r]?.[nc]?.walls.top ?? false)
                                : (maze.grid[r - 1]?.[nc]?.walls.bottom ??
                                  false));
                        const nCount =
                            1 + (nn ? 1 : 0) + (ns ? 1 : 0) + (ne ? 1 : 0);
                        const endX =
                            nc * CELL_SIZE -
                            (nCount === 2 && (nn || ns) ? CORNER_RADIUS : 0);
                        ctx.moveTo(startX, y);
                        ctx.lineTo(endX, y);
                    }
                }
            }
            ctx.stroke();
            ctx.shadowBlur = 0;

            // Draw Goal
            const goal = stateRef.current.goal;
            goal.rotation += 0.02 * dt;
            ctx.save();
            ctx.translate(goal.x, goal.y);
            ctx.rotate(goal.rotation);
            ctx.fillStyle = COLORS.data.green;
            ctx.shadowColor = COLORS.data.green;
            ctx.shadowBlur = 0;
            ctx.beginPath();
            ctx.rect(-10, -10, 20, 20); // Smaller goal (20x20)
            ctx.fill();
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
            ctx.lineWidth = 2;
            ctx.stroke();
            ctx.restore();

            // Draw Player Trail (Smoothed)
            const trailPoints = stateRef.current.trail;
            const len = trailPoints.length;
            if (len > 2) {
                ctx.save();
                ctx.beginPath();
                ctx.strokeStyle = COLORS.data.amber;
                ctx.lineWidth = PLAYER_RADIUS;
                ctx.lineCap = 'round';
                ctx.lineJoin = 'round';

                // Start from first point
                const start = trailPoints[0];
                if (start) {
                    ctx.moveTo(start.x, start.y);

                    // Use quadratic curves through midpoints for smoothing
                    for (let i = 1; i < len - 1; i++) {
                        const p1 = trailPoints[i];
                        const p2 = trailPoints[i + 1];
                        if (p1 && p2) {
                            const xc = (p1.x + p2.x) / 2;
                            const yc = (p1.y + p2.y) / 2;
                            ctx.globalAlpha = (i / len) * 0.15;
                            ctx.quadraticCurveTo(p1.x, p1.y, xc, yc);
                            ctx.stroke();
                            ctx.beginPath();
                            ctx.moveTo(xc, yc);
                        }
                    }
                }
                ctx.restore();
            } else if (len > 1) {
                // Fallback for very short trails
                const p1 = trailPoints[0];
                const p2 = trailPoints[1];
                if (p1 && p2) {
                    ctx.save();
                    ctx.beginPath();
                    ctx.strokeStyle = COLORS.data.amber;
                    ctx.lineWidth = PLAYER_RADIUS;
                    ctx.lineCap = 'round';
                    ctx.globalAlpha = 0.15;
                    ctx.moveTo(p1.x, p1.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.stroke();
                    ctx.restore();
                }
            }

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
            ctx.globalAlpha = 0.2 + Math.sin(time * 0.005) * 0.1;
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
