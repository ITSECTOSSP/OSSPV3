import Echo from 'laravel-echo';

// Development
window.Echo = new Echo({
    broadcaster: 'reverb',

    key: import.meta.env.VITE_REVERB_APP_KEY,

    wsHost: import.meta.env.VITE_REVERB_HOST,
    wsPort: Number(import.meta.env.VITE_REVERB_PORT),

    wssPort: Number(import.meta.env.VITE_REVERB_PORT),

    forceTLS: false,
    encrypted: false,

    enabledTransports: ['ws'],
});

//Production
// window.Echo = new Echo({
//     broadcaster: 'reverb',
//     key: import.meta.env.VITE_REVERB_APP_KEY,

//     wsHost: import.meta.env.VITE_REVERB_HOST,
//     wsPort: Number(import.meta.env.VITE_REVERB_PORT),

//     forceTLS: true, // 🔥 IMPORTANT for HTTPS site
//     encrypted: true,

//     enabledTransports: ['ws', 'wss'],
// });

window.Echo.connector.pusher.connection.bind('connected', () => {
    console.log('✅ Echo connected!');
});

window.Echo.connector.pusher.connection.bind('error', (err) => {
    console.error('❌ Echo error:', err);
});

export default window.Echo;
