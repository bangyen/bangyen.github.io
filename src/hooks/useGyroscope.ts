import { useState, useEffect, useRef, useCallback } from 'react';

interface GyroscopeData {
    dx: number;
    dy: number;
    isActive: boolean;
    error: string | null;
}

interface DeviceOrientationEventWithPermission extends DeviceOrientationEvent {
    requestPermission?: () => Promise<'granted' | 'denied'>;
}

export function useGyroscope() {
    const [data, setData] = useState<GyroscopeData>({
        dx: 0,
        dy: 0,
        isActive: false,
        error: null,
    });

    const isEnabledRef = useRef(false);

    const handleOrientation = useCallback((event: DeviceOrientationEvent) => {
        if (!isEnabledRef.current) return;

        // beta: front-to-back tilt in degrees [-180, 180]
        // gamma: left-to-right tilt in degrees [-90, 90]
        const { beta, gamma } = event;

        if (beta === null || gamma === null) return;

        // Normalization and deadzone
        // We want 0 when the device is flat(ish) or at a comfortable holding angle.
        // Assuming comfort angle for beta is around 45 degrees if held up,
        // but for a game like this, maybe we assume 0 is flat on table.
        // Let's assume 0 is the neutral position for now.

        const SENSITIVITY = 0.05;
        const DEADZONE = 2;

        let dx = 0;
        let dy = 0;

        if (Math.abs(gamma) > DEADZONE) {
            dx = Math.max(
                -1,
                Math.min(1, (gamma - Math.sign(gamma) * DEADZONE) * SENSITIVITY)
            );
        }

        // Adjusting beta: if held at an angle, we might want to offset this.
        // For simplicity, let's just use raw beta for now.
        if (Math.abs(beta) > DEADZONE) {
            dy = Math.max(
                -1,
                Math.min(1, (beta - Math.sign(beta) * DEADZONE) * SENSITIVITY)
            );
        }

        setData(prev => ({
            ...prev,
            dx,
            dy,
            isActive: true,
        }));
    }, []);

    const requestPermission = async () => {
        const DeviceOrientationEventExtended =
            DeviceOrientationEvent as unknown as DeviceOrientationEventWithPermission;

        if (
            typeof DeviceOrientationEventExtended.requestPermission ===
            'function'
        ) {
            try {
                const permissionState =
                    await DeviceOrientationEventExtended.requestPermission();
                if (permissionState === 'granted') {
                    startListening();
                    return true;
                } else {
                    setData(prev => ({
                        ...prev,
                        error: 'Permission denied',
                        isActive: false,
                    }));
                    return false;
                }
            } catch (_error) {
                setData(prev => ({
                    ...prev,
                    error: 'Permission request failed',
                    isActive: false,
                }));
                return false;
            }
        } else {
            // Not iOS 13+, or not a mobile device with sensors
            // Just try to start listening
            startListening();
            return true;
        }
    };

    const startListening = () => {
        isEnabledRef.current = true;
        window.addEventListener('deviceorientation', handleOrientation);
        setData(prev => ({ ...prev, isActive: true, error: null }));
    };

    const stopListening = useCallback(() => {
        isEnabledRef.current = false;
        window.removeEventListener('deviceorientation', handleOrientation);
        setData({ dx: 0, dy: 0, isActive: false, error: null });
    }, [handleOrientation]);

    useEffect(() => {
        return () => {
            stopListening();
        };
    }, [stopListening]);

    return { ...data, requestPermission, stopListening };
}
