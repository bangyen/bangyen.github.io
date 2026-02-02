import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { Grid, Box, Typography, Button, Fade } from '../../../components/mui';
import { GlobalHeader } from '../../../components/layout/GlobalHeader';
import { GlassCard } from '../../../components/ui/GlassCard';
import { COLORS, TYPOGRAPHY, SPACING } from '../../../config/theme';
import { generateMaze, MazeData } from './mazeLogic';
import { useWindow, useMobile } from '../../../hooks';
import {
    createGridTexture,
    createGlassMaterial,
    createDustParticles,
} from './visualUtils';

const MAZE_SIZE = 15;
const CELL_SIZE = 2;
const WALL_HEIGHT = 1.6;
const PLAYER_SIZE = 0.4;

export default function MazeGame(): React.ReactElement {
    const containerRef = useRef<HTMLDivElement>(null);
    const sceneRef = useRef<{
        scene: THREE.Scene;
        camera: THREE.PerspectiveCamera;
        renderer: THREE.WebGLRenderer;
        player: THREE.Group;
        walls: THREE.Mesh[];
        goal: THREE.Mesh;
        light: THREE.PointLight;
        particles: THREE.Points;
    } | null>(null);

    const [maze, setMaze] = useState<MazeData | null>(null);
    const [gameState, setGameState] = useState<'start' | 'playing' | 'won'>(
        'start'
    );
    const gameStateRef = useRef(gameState);

    const { height, width } = useWindow();
    const isMobile = useMobile('sm');
    const availableHeight = height - (isMobile ? 56 : 80); // Exact header heights

    useEffect(() => {
        gameStateRef.current = gameState;
    }, [gameState]);

    const initMaze = useCallback(() => {
        const newMaze = generateMaze(MAZE_SIZE, MAZE_SIZE);
        setMaze(newMaze);
        setGameState('playing');
    }, []);

    // Scene setup
    useEffect(() => {
        if (!containerRef.current || !maze || gameState !== 'playing') return;

        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x020202);
        scene.fog = new THREE.FogExp2(0x020202, 0.12);

        const camera = new THREE.PerspectiveCamera(
            75,
            width / availableHeight,
            0.1,
            1000
        );
        const renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true,
        });
        renderer.setSize(width, availableHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        containerRef.current.appendChild(renderer.domElement);

        // Lights
        const ambientLight = new THREE.AmbientLight(0x388bfd, 0.2); // Soft blue ambient
        scene.add(ambientLight);

        // Floor
        const floorTexture = createGridTexture();
        floorTexture.repeat.set(MAZE_SIZE, MAZE_SIZE);
        const floorGeometry = new THREE.PlaneGeometry(
            MAZE_SIZE * CELL_SIZE,
            MAZE_SIZE * CELL_SIZE
        );
        const floorMaterial = new THREE.MeshStandardMaterial({
            map: floorTexture,
            roughness: 0.2,
            metalness: 0.5,
        });
        const floor = new THREE.Mesh(floorGeometry, floorMaterial);
        floor.rotation.x = -Math.PI / 2;
        floor.position.set(
            (MAZE_SIZE * CELL_SIZE) / 2 - CELL_SIZE / 2,
            0,
            (MAZE_SIZE * CELL_SIZE) / 2 - CELL_SIZE / 2
        );
        floor.receiveShadow = true;
        scene.add(floor);

        // Walls
        const walls: THREE.Mesh[] = [];
        const glassMaterial = createGlassMaterial(COLORS.primary.main);

        maze.grid.forEach((row, r) => {
            row.forEach((cell, c) => {
                const x = c * CELL_SIZE;
                const z = r * CELL_SIZE;

                const createWall = (
                    w: number,
                    h: number,
                    d: number,
                    px: number,
                    py: number,
                    pz: number
                ) => {
                    const wall = new THREE.Mesh(
                        new THREE.BoxGeometry(w, h, d),
                        glassMaterial
                    );
                    wall.position.set(px, py, pz);
                    wall.castShadow = true;
                    wall.receiveShadow = true;
                    scene.add(wall);
                    walls.push(wall);

                    // Wall top edge glow
                    const edgeGeom = new THREE.BoxGeometry(w, 0.05, d);
                    const edgeMat = new THREE.MeshBasicMaterial({
                        color: COLORS.primary.main,
                        transparent: true,
                        opacity: 0.5,
                    });
                    const edge = new THREE.Mesh(edgeGeom, edgeMat);
                    edge.position.set(px, py + h / 2, pz);
                    scene.add(edge);
                };

                if (cell.walls.top)
                    createWall(
                        CELL_SIZE,
                        WALL_HEIGHT,
                        0.1,
                        x,
                        WALL_HEIGHT / 2,
                        z - CELL_SIZE / 2
                    );
                if (cell.walls.bottom)
                    createWall(
                        CELL_SIZE,
                        WALL_HEIGHT,
                        0.1,
                        x,
                        WALL_HEIGHT / 2,
                        z + CELL_SIZE / 2
                    );
                if (cell.walls.left)
                    createWall(
                        0.1,
                        WALL_HEIGHT,
                        CELL_SIZE,
                        x - CELL_SIZE / 2,
                        WALL_HEIGHT / 2,
                        z
                    );
                if (cell.walls.right)
                    createWall(
                        0.1,
                        WALL_HEIGHT,
                        CELL_SIZE,
                        x + CELL_SIZE / 2,
                        WALL_HEIGHT / 2,
                        z
                    );
            });
        });

        // Player: Octahedron (Diamond)
        const playerGroup = new THREE.Group();
        const playerBody = new THREE.Mesh(
            new THREE.OctahedronGeometry(PLAYER_SIZE),
            new THREE.MeshStandardMaterial({
                color: COLORS.primary.main,
                emissive: COLORS.primary.main,
                emissiveIntensity: 1,
                metalness: 1,
                roughness: 0,
            })
        );
        playerBody.position.y = PLAYER_SIZE + 0.2;
        playerBody.castShadow = true;
        playerGroup.add(playerBody);

        const playerLight = new THREE.PointLight(COLORS.primary.main, 15, 18);
        playerLight.position.y = 1;
        playerLight.castShadow = true;
        playerGroup.add(playerLight);

        playerGroup.position.set(
            maze.start[1] * CELL_SIZE,
            0,
            maze.start[0] * CELL_SIZE
        );
        scene.add(playerGroup);

        // Goal: Floating Knot
        const goal = new THREE.Mesh(
            new THREE.TorusKnotGeometry(0.35, 0.1, 100, 16),
            new THREE.MeshStandardMaterial({
                color: 0xffd700,
                emissive: 0xffd700,
                emissiveIntensity: 0.8,
                metalness: 1,
                roughness: 0.1,
            })
        );
        goal.position.set(
            maze.end[1] * CELL_SIZE,
            0.8,
            maze.end[0] * CELL_SIZE
        );
        scene.add(goal);

        // Particles
        const particles = createDustParticles(600, 60);
        scene.add(particles);

        sceneRef.current = {
            scene,
            camera,
            renderer,
            player: playerGroup,
            walls,
            goal,
            light: playerLight,
            particles,
        };

        // Game Loop
        let animationId: number;
        const keys: Record<string, boolean> = {};

        const handleKeyDown = (e: KeyboardEvent) =>
            (keys[e.key.toLowerCase()] = true);
        const handleKeyUp = (e: KeyboardEvent) =>
            (keys[e.key.toLowerCase()] = false);
        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);

        const animate = (time: number) => {
            animationId = requestAnimationFrame(animate);

            if (gameStateRef.current === 'playing') {
                const moveSpeed = 0.085;
                const dx =
                    (keys.d || keys.arrowright ? 1 : 0) -
                    (keys.a || keys.arrowleft ? 1 : 0);
                const dz =
                    (keys.s || keys.arrowdown ? 1 : 0) -
                    (keys.w || keys.arrowup ? 1 : 0);

                if (dx !== 0 || dz !== 0) {
                    const length = Math.sqrt(dx * dx + dz * dz);
                    const moveX = (dx / length) * moveSpeed;
                    const moveZ = (dz / length) * moveSpeed;

                    const checkCollision = (pos: THREE.Vector3) => {
                        return walls.some(wall => {
                            const wallBox = new THREE.Box3().setFromObject(
                                wall
                            );
                            const playerBox =
                                new THREE.Box3().setFromCenterAndSize(
                                    pos
                                        .clone()
                                        .add(
                                            new THREE.Vector3(0, PLAYER_SIZE, 0)
                                        ),
                                    new THREE.Vector3(
                                        PLAYER_SIZE * 1.5,
                                        PLAYER_SIZE * 1.5,
                                        PLAYER_SIZE * 1.5
                                    )
                                );
                            return wallBox.intersectsBox(playerBox);
                        });
                    };

                    if (dx !== 0) {
                        const newPosX = playerGroup.position.clone();
                        newPosX.x += moveX;
                        if (!checkCollision(newPosX))
                            playerGroup.position.x = newPosX.x;
                    }
                    if (dz !== 0) {
                        const newPosZ = playerGroup.position.clone();
                        newPosZ.z += moveZ;
                        if (!checkCollision(newPosZ))
                            playerGroup.position.z = newPosZ.z;
                    }
                }

                // Win condition
                const playerPos2D = new THREE.Vector2(
                    playerGroup.position.x,
                    playerGroup.position.z
                );
                const goalPos2D = new THREE.Vector2(
                    goal.position.x,
                    goal.position.z
                );
                if (playerPos2D.distanceTo(goalPos2D) < 0.7) {
                    setGameState('won');
                }

                // Breathing light & animation
                playerBody.rotation.y += 0.02;
                playerBody.rotation.z += 0.01;
                playerBody.position.y =
                    PLAYER_SIZE + 0.2 + Math.sin(time * 0.003) * 0.05;
                playerLight.intensity = 15 + Math.sin(time * 0.002) * 3;

                // Dust motion
                particles.rotation.y += 0.0005;

                // Goal animation
                goal.rotation.y += 0.03;
                goal.position.y = 0.8 + Math.sin(time * 0.004) * 0.1;

                // Camera follow
                camera.position.lerp(
                    new THREE.Vector3(
                        playerGroup.position.x,
                        9,
                        playerGroup.position.z + 5
                    ),
                    0.1
                );
                camera.lookAt(playerGroup.position);
            }

            renderer.render(scene, camera);
        };
        animate(0);

        const container = containerRef.current;
        return () => {
            cancelAnimationFrame(animationId);
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
            container.removeChild(renderer.domElement);
            renderer.dispose();
        };
    }, [maze, gameState, width, availableHeight]);

    useEffect(() => {
        document.title = '3D Maze | Bangyen';
    }, []);

    useEffect(() => {
        if (sceneRef.current) {
            const { camera, renderer } = sceneRef.current;
            camera.aspect = width / availableHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(width, availableHeight);
        }
    }, [width, availableHeight]);

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
                sx={{
                    flex: 1,
                    position: 'relative',
                    cursor: gameState === 'playing' ? 'none' : 'default',
                }}
            />

            {(gameState === 'start' || gameState === 'won') && (
                <Fade in>
                    <Box
                        sx={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            zIndex: 10,
                            width: '90%',
                            maxWidth: '400px',
                        }}
                    >
                        <GlassCard
                            sx={{
                                p: 4,
                                textAlign: 'center',
                                border: `1px solid ${COLORS.primary.main}44`,
                            }}
                        >
                            <Typography
                                variant="h2"
                                sx={{
                                    color: COLORS.primary.main,
                                    mb: 1,
                                    fontWeight: TYPOGRAPHY.fontWeight.bold,
                                }}
                            >
                                {gameState === 'start'
                                    ? '3D Maze'
                                    : 'Goal Reached!'}
                            </Typography>
                            <Typography
                                variant="body1"
                                sx={{ color: COLORS.text.secondary, mb: 4 }}
                            >
                                {gameState === 'start'
                                    ? 'Navigate the crystalline labyrinth. Use WASD or Arrows.'
                                    : 'You have mastered the path through the lights.'}
                            </Typography>
                            <Button
                                variant="contained"
                                size="large"
                                onClick={initMaze}
                                sx={{
                                    py: 1.5,
                                    px: 6,
                                    borderRadius: SPACING.borderRadius.full,
                                    boxShadow: `0 0 20px ${COLORS.primary.main}44`,
                                }}
                            >
                                {gameState === 'start'
                                    ? 'Initialize'
                                    : 'Pulse Again'}
                            </Button>
                        </GlassCard>
                    </Box>
                </Fade>
            )}
        </Grid>
    );
}
