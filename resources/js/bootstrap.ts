import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

declare global {
    interface Window {
        Echo: Echo<any>;
        Pusher: typeof Pusher;
    }
}

window.Pusher = Pusher;

// Autodetecta host/esquema/puerto del WebSocket para que funcione en cualquier
// despliegue (localhost, docker, Render) sin recompilar con la URL. Si quieres
// forzar uno concreto, definelo via VITE_REVERB_* en el build.
const scheme = import.meta.env.VITE_REVERB_SCHEME
    ?? (window.location.protocol === 'https:' ? 'https' : 'http');
const secure = scheme === 'https';
const explicitPort = Number(import.meta.env.VITE_REVERB_PORT ?? '') || 0;

window.Echo = new Echo({
    broadcaster: 'reverb',
    key: import.meta.env.VITE_REVERB_APP_KEY,
    wsHost: import.meta.env.VITE_REVERB_HOST || window.location.hostname,
    wsPort: explicitPort || (secure ? 443 : 8080),
    wssPort: explicitPort || 443,
    forceTLS: secure,
    enabledTransports: ['ws', 'wss'],
});
