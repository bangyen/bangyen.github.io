/* eslint-disable no-console */
export function register() {
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker
                .register('/sw.js')
                .then(registration => {
                    console.log('SW registered:', registration);
                })
                .catch((registrationError: unknown) => {
                    console.log('SW registration failed:', registrationError);
                });
        });
    }
}

export function unregister() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.ready
            .then(registration => {
                void registration.unregister();
            })
            .catch((error: unknown) => {
                if (error instanceof Error) {
                    console.error(error.message);
                }
            });
    }
}
