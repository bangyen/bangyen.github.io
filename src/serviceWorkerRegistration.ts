import { registerSW } from 'virtual:pwa-register';

export function register() {
    registerSW({ immediate: true });
}

export function unregister() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.ready
            .then(registration => {
                void registration.unregister();
            })
            .catch(() => {
                // Unregistering is best-effort during cleanup and tests.
            });
    }
}
