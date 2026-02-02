import * as THREE from 'three';

/**
 * Creates a frosted glass material similar to the site's GlassCard.
 */
export function createGlassMaterial(
    color: number | string = 0x388bfd
): THREE.MeshStandardMaterial {
    return new THREE.MeshStandardMaterial({
        color: color,
        metalness: 0,
        roughness: 0.2, // Slightly smoother
        transparent: false, // Fix overlap brightness
        opacity: 1,
        emissive: color,
        emissiveIntensity: 0.2,
    });
}

/**
 * Creates a procedural grid texture using a Canvas.
 */
export function createGridTexture(
    size = 256,
    divisions = 8,
    color = '#020202',
    lineColor = 'rgba(56, 139, 253, 0.15)'
): THREE.CanvasTexture {
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');

    if (ctx) {
        // Background
        ctx.fillStyle = color;
        ctx.fillRect(0, 0, size, size);

        // Grid lines
        ctx.strokeStyle = lineColor;
        ctx.lineWidth = 2;
        const step = size / divisions;

        for (let i = 0; i <= size; i += step) {
            ctx.beginPath();
            ctx.moveTo(i, 0);
            ctx.lineTo(i, size);
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(0, i);
            ctx.lineTo(size, i);
            ctx.stroke();
        }
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    return texture;
}

/**
 * Noise-based "dust" particles that move slowly.
 */
export function createDustParticles(count = 400, bounds = 40): THREE.Points {
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
        positions[i * 3] = (Math.random() - 0.5) * bounds;
        positions[i * 3 + 1] = Math.random() * 5;
        positions[i * 3 + 2] = (Math.random() - 0.5) * bounds;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
        color: 0x388bfd,
        size: 0.03,
        transparent: true,
        opacity: 0.2,
        blending: THREE.AdditiveBlending,
    });

    return new THREE.Points(geometry, material);
}
