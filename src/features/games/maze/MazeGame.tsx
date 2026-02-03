import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { Grid, Box } from '../../../components/mui';
import { GlobalHeader } from '../../../components/layout/GlobalHeader';
import { COLORS } from '../../../config/theme';
import { generateMaze, MazeData } from './mazeLogic';
import { useWindow, useMobile } from '../../../hooks';
import { createGlassMaterial, createDustParticles } from './visualUtils';

const MAZE_SIZE = 15;
const CELL_SIZE = 2;
const WALL_HEIGHT = 1.6;
const PLAYER_SIZE = 0.4;

interface JoystickState {
    active: boolean;
    originConfig: { x: number; y: number } | null;
    currentConfig: { x: number; y: number } | null;
}

export default function MazeGame(): React.ReactElement {
    const containerRef = useRef<HTMLDivElement>(null);
    const sceneRef = useRef<{
        scene: THREE.Scene;
        camera: THREE.OrthographicCamera;
        renderer: THREE.WebGLRenderer;

        player: THREE.Object3D;
        // walls: THREE.Mesh[]; // Replaced with InstancedMesh
        wallColliders: THREE.Box3[]; // Collision-only data

        goalGroup: THREE.Group;
        goalPrism: THREE.Mesh;
        goalCore: THREE.Mesh;
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

    useEffect(() => {
        gameStateRef.current = gameState;
    }, [gameState]);

    const initMaze = useCallback(() => {
        const newMaze = generateMaze(MAZE_SIZE, MAZE_SIZE);
        setMaze(newMaze);
        setGameState('playing');
    }, []);

    // Auto-start on mount
    useEffect(() => {
        initMaze();
    }, [initMaze]);

    // Global keyboard controls (Start/Restart)
    useEffect(() => {
        const handleGlobalKeyDown = (e: KeyboardEvent) => {
            if (['enter', ' '].includes(e.key.toLowerCase())) {
                if (gameState === 'start' || gameState === 'won') {
                    e.preventDefault();
                    initMaze();
                }
            }
        };
        window.addEventListener('keydown', handleGlobalKeyDown);
        return () => {
            window.removeEventListener('keydown', handleGlobalKeyDown);
        };
    }, [gameState, initMaze]);

    // Scene setup
    useEffect(() => {
        if (!containerRef.current || !maze || gameState !== 'playing') return;

        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x020202);
        // fog is less useful in ortho top-down, maybe lighter or remove? Keeping for depth cue if overlapping.
        scene.fog = new THREE.FogExp2(0x020202, 0.05);

        // Orthographic Camera Setup
        const aspect = width / availableHeight;
        const viewSize = 18; // Amount of world units visible vertically
        const camera = new THREE.OrthographicCamera(
            (-viewSize * aspect) / 2,
            (viewSize * aspect) / 2,
            viewSize / 2,
            -viewSize / 2,
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
        const floorGeometry = new THREE.PlaneGeometry(
            MAZE_SIZE * CELL_SIZE,
            MAZE_SIZE * CELL_SIZE
        );
        const floorMaterial = new THREE.MeshStandardMaterial({
            color: 0x111111, // Solid dark gray
            roughness: 0.8,
            metalness: 0.1,
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

        // Walls (Instanced Rendering)
        const wallColliders: THREE.Box3[] = [];
        const glassMaterial = createGlassMaterial(COLORS.primary.main);

        // Count total walls first to allocate InstancedMesh
        let wallCount = 0;
        maze.grid.forEach(row => {
            row.forEach(cell => {
                if (cell.walls.top) wallCount++;
                if (cell.walls.bottom) wallCount++;
                if (cell.walls.left) wallCount++;
                if (cell.walls.right) wallCount++;
            });
        });

        const wallGeometry = new THREE.BoxGeometry(1, 1, 1); // Unit cube, scaled later
        const wallsInstance = new THREE.InstancedMesh(
            wallGeometry,
            glassMaterial,
            wallCount
        );
        wallsInstance.castShadow = true;
        wallsInstance.receiveShadow = true;
        scene.add(wallsInstance);

        const dummy = new THREE.Object3D();
        let instanceIdx = 0;

        maze.grid.forEach((row, r) => {
            row.forEach((cell, c) => {
                const x = c * CELL_SIZE;
                const z = r * CELL_SIZE;

                const addWall = (
                    w: number,
                    h: number,
                    d: number,
                    px: number,
                    py: number,
                    pz: number
                ) => {
                    // Physics (Collider)
                    const wallBox = new THREE.Box3();
                    wallBox.setFromCenterAndSize(
                        new THREE.Vector3(px, py, pz),
                        new THREE.Vector3(w, h, d)
                    );
                    wallColliders.push(wallBox);

                    // Visual (Instanced Wall)
                    dummy.position.set(px, py, pz);
                    dummy.scale.set(w, h, d);
                    dummy.updateMatrix();
                    wallsInstance.setMatrixAt(instanceIdx, dummy.matrix);

                    instanceIdx++;
                };

                if (cell.walls.top)
                    addWall(
                        CELL_SIZE + 0.2, // Overlap corners
                        WALL_HEIGHT,
                        0.25, // Thicker walls
                        x,
                        WALL_HEIGHT / 2,
                        z - CELL_SIZE / 2
                    );
                if (cell.walls.bottom)
                    addWall(
                        CELL_SIZE + 0.2,
                        WALL_HEIGHT,
                        0.25,
                        x,
                        WALL_HEIGHT / 2,
                        z + CELL_SIZE / 2
                    );
                if (cell.walls.left)
                    addWall(
                        0.25,
                        WALL_HEIGHT,
                        CELL_SIZE + 0.2,
                        x - CELL_SIZE / 2,
                        WALL_HEIGHT / 2,
                        z
                    );
                if (cell.walls.right)
                    addWall(
                        0.25,
                        WALL_HEIGHT,
                        CELL_SIZE + 0.2,
                        x + CELL_SIZE / 2,
                        WALL_HEIGHT / 2,
                        z
                    );
            });
        });

        // Player: Review Simple Aesthetic (Glowing Core + Wireframe Cage)
        const playerBody = new THREE.Group();

        // 1. The Glowing Core
        const coreMesh = new THREE.Mesh(
            new THREE.SphereGeometry(PLAYER_SIZE * 0.8, 32, 32),
            new THREE.MeshStandardMaterial({
                color: COLORS.primary.main,
                emissive: COLORS.primary.main,
                emissiveIntensity: 2,
                roughness: 1, // Remove specular highlight (glowing dot)
                metalness: 0,
            })
        );
        coreMesh.castShadow = false; // Emissive objects shouldn't cast dark shadows
        playerBody.add(coreMesh);

        // 2. The Wireframe Cage (for rotation visualization)
        const cageMesh = new THREE.Mesh(
            new THREE.IcosahedronGeometry(PLAYER_SIZE * 0.85, 1),
            new THREE.MeshBasicMaterial({
                color: 0xffffff,
                wireframe: true,
                transparent: true,
                opacity: 0.7, // Make more visible
            })
        );
        playerBody.add(cageMesh);

        playerBody.position.set(
            maze.start[1] * CELL_SIZE,
            PLAYER_SIZE * 0.8 + 0.1,
            maze.start[0] * CELL_SIZE
        );
        scene.add(playerBody);

        const playerLight = new THREE.PointLight(COLORS.primary.main, 10, 15);
        playerLight.position
            .copy(playerBody.position)
            .add(new THREE.Vector3(0, 1, 0));
        playerLight.castShadow = true;
        scene.add(playerLight);

        const goalGroup = new THREE.Group();
        goalGroup.position.set(
            maze.end[1] * CELL_SIZE,
            1, // Slightly higher base position
            maze.end[0] * CELL_SIZE
        );

        // 1. Outer Shell (Icosahedron)
        const goalPrism = new THREE.Mesh(
            new THREE.IcosahedronGeometry(0.45, 0),
            new THREE.MeshPhysicalMaterial({
                color: 0x00ffff, // Cyan
                metalness: 0.1,
                roughness: 0,
                transmission: 0.6, // Glassy
                thickness: 2,
                emissive: 0x00ffff,
                emissiveIntensity: 0.6,
                clearcoat: 1,
                clearcoatRoughness: 0,
            })
        );
        goalGroup.add(goalPrism);
        goalPrism.castShadow = true;

        // 2. Inner Core (Octahedron)
        const goalCore = new THREE.Mesh(
            new THREE.OctahedronGeometry(0.2),
            new THREE.MeshBasicMaterial({
                color: 0xffffff,
                wireframe: true,
            })
        );
        goalGroup.add(goalCore);

        // 4. Point Light for the goal
        const goalLight = new THREE.PointLight(0x00ffff, 10, 10);
        goalGroup.add(goalLight);

        // 5. Goal Particles (Concentrated energy) - REMOVED for simpler aesthetic
        // const goalParticles = createDustParticles(200, 2);
        // goalGroup.add(goalParticles);

        scene.add(goalGroup);

        // Particles
        const particles = createDustParticles(600, 60);
        scene.add(particles);

        sceneRef.current = {
            scene,
            camera,
            renderer,
            player: playerBody,
            wallColliders,

            goalGroup,
            goalPrism,
            goalCore,
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

        const handlePointerDown = (e: PointerEvent) => {
            if (gameStateRef.current !== 'playing') return;
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

                return {
                    ...prev,
                    currentConfig: { x, y },
                };
            });
        };

        const handlePointerUp = () => {
            pointerState.current.isDown = false;
            pointerState.current.startX = 0;
            pointerState.current.startY = 0;
            pointerState.current.currentX = 0;
            pointerState.current.currentY = 0;

            setVisualJoystickState({
                active: false,
                originConfig: null,
                currentConfig: null,
            });
        };

        // Attach pointer events to the container
        // Attach pointer events to the container
        containerRef.current.addEventListener('pointerdown', handlePointerDown);
        window.addEventListener('pointermove', handlePointerMove);
        window.addEventListener('pointerup', handlePointerUp);

        const xAxis = new THREE.Vector3(1, 0, 0);
        const zAxis = new THREE.Vector3(0, 0, 1);
        const lightOffset = new THREE.Vector3(0, 1, 0);

        const animate = (time: number) => {
            animationId = requestAnimationFrame(animate);

            if (gameStateRef.current === 'playing') {
                const moveSpeed = 0.085;

                // Keyboard input
                const kdx =
                    (keys.d || keys.arrowright ? 1 : 0) -
                    (keys.a || keys.arrowleft ? 1 : 0);
                const kdz =
                    (keys.s || keys.arrowdown ? 1 : 0) -
                    (keys.w || keys.arrowup ? 1 : 0);

                // Pointer/Touch input (Virtual Joystick)
                let pdx = 0;
                let pdz = 0;
                const MAX_DRAG = 100; // Pixels to reach max speed

                if (pointerState.current.isDown) {
                    const diffX =
                        pointerState.current.currentX -
                        pointerState.current.startX;
                    const diffY =
                        pointerState.current.currentY -
                        pointerState.current.startY;

                    // Normalize roughly to -1 to 1 range based on drag distance
                    pdx = Math.max(-1, Math.min(1, diffX / MAX_DRAG));
                    pdz = Math.max(-1, Math.min(1, diffY / MAX_DRAG));
                }

                // Combine inputs (clamp magnitude to 1)
                const dx = kdx + pdx;
                const dz = kdz + pdz;

                if (dx !== 0 || dz !== 0) {
                    const length = Math.sqrt(dx * dx + dz * dz);
                    const moveX = (dx / length) * moveSpeed;
                    const moveZ = (dz / length) * moveSpeed;

                    const checkCollision = (pos: THREE.Vector3) => {
                        // Use the Box3 array for collision checks
                        return wallColliders.some(wallBox => {
                            const playerBox =
                                new THREE.Box3().setFromCenterAndSize(
                                    pos, // Sphere is centered
                                    new THREE.Vector3(
                                        PLAYER_SIZE * 1.6,
                                        PLAYER_SIZE * 1.6,
                                        PLAYER_SIZE * 1.6
                                    )
                                );
                            return wallBox.intersectsBox(playerBox);
                        });
                    };

                    if (dx !== 0) {
                        const newPosX = playerBody.position.clone();
                        newPosX.x += moveX;
                        if (!checkCollision(newPosX))
                            playerBody.position.x = newPosX.x;
                    }
                    if (dz !== 0) {
                        const newPosZ = playerBody.position.clone();
                        newPosZ.z += moveZ;
                        if (!checkCollision(newPosZ))
                            playerBody.position.z = newPosZ.z;
                    }
                }

                // Rolling Animation
                // Rotate around the axis perpendicular to motion
                // Speed = distance / radius
                const speedX = dx * moveSpeed;
                const speedZ = dz * moveSpeed;
                if (dx !== 0 || dz !== 0) {
                    playerBody.rotateOnWorldAxis(xAxis, speedZ * 3.2); // 3.2 ≈ 1 / radius (0.3125)
                    playerBody.rotateOnWorldAxis(zAxis, -speedX * 3.2);
                }

                // Win condition
                const playerPos2D = new THREE.Vector2(
                    playerBody.position.x,
                    playerBody.position.z
                );
                const goalPos2D = new THREE.Vector2(
                    goalGroup.position.x,
                    goalGroup.position.z
                );

                // Check distance and ensuring we haven't already won (to prevent spamming resets)
                // We use a property on the goalGroup to track if it's been "collected" for this round
                if (
                    playerPos2D.distanceTo(goalPos2D) < 0.7 &&
                    goalGroup.visible
                ) {
                    // "Collect" the goal visually
                    goalGroup.visible = false;

                    // Auto-restart after 1.5 seconds
                    setTimeout(() => {
                        initMaze();
                    }, 1500);
                }

                // Breathing light & animation
                playerBody.position.y =
                    PLAYER_SIZE + 0.2 + Math.sin(time * 0.003) * 0.05;

                // Sync light position (since it's no longer a child)
                playerLight.position.copy(playerBody.position).add(lightOffset);

                playerLight.intensity = 10 + Math.sin(time * 0.005) * 5;

                // Dust motion
                particles.rotation.y += 0.0005;

                // Goal animation
                goalPrism.rotation.x += 0.01;
                goalPrism.rotation.y += 0.02;
                goalCore.rotation.x -= 0.02; // Spin opposite
                goalCore.rotation.z -= 0.01;

                // Bobbing whole group
                goalGroup.position.y = 1 + Math.sin(time * 0.003) * 0.15;

                // Camera follow
                camera.position.set(
                    playerBody.position.x,
                    20,
                    playerBody.position.z
                );
                camera.lookAt(playerBody.position);

                renderer.render(scene, camera);
            }
        };
        animate(0);

        const container = containerRef.current;
        return () => {
            cancelAnimationFrame(animationId);
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
            container.removeEventListener('pointerdown', handlePointerDown);
            window.removeEventListener('pointermove', handlePointerMove);
            window.removeEventListener('pointerup', handlePointerUp);
            container.removeChild(renderer.domElement);
            renderer.dispose();
        };
    }, [maze, gameState, width, availableHeight, initMaze]);

    useEffect(() => {
        document.title = '3D Maze | Bangyen';
    }, []);

    useEffect(() => {
        if (sceneRef.current) {
            const { camera, renderer } = sceneRef.current;
            const aspect = width / availableHeight;
            const viewSize = 18;
            camera.left = (-viewSize * aspect) / 2;
            camera.right = (viewSize * aspect) / 2;
            camera.top = viewSize / 2;
            camera.bottom = -viewSize / 2;
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
                    touchAction: 'none', // Prevent scrolling while playing
                }}
            />

            {/* Visual Joystick */}
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
                        {/* Base */}
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
                        {/* Stick */}
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
