
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
import { store } from '../store/store';

window.Pusher = Pusher;

const echo = new Echo({
  broadcaster: 'reverb',
  key: import.meta.env.VITE_REVERB_APP_KEY,
  wsHost: import.meta.env.VITE_REVERB_HOST || 'localhost',
  wsPort: Number(import.meta.env.VITE_REVERB_PORT || 8080),
  wssPort: Number(import.meta.env.VITE_REVERB_PORT || 8080),
  forceTLS: import.meta.env.VITE_REVERB_SCHEME === 'https',
  enabledTransports: ['ws', 'wss'],

  authEndpoint: 'http://127.0.0.1:8000/api/broadcasting/auth',

  authorizer: (channel) => ({
    authorize: (socketId, callback) => {
      const state = store.getState();

      // Inspect your actual Redux state structure
      const tokenState = state.token?.token;

      // console.log('Token state:', tokenState);

      // Support either a plain token or a JSON string
      let token = tokenState;

      if (typeof token === 'string' && token.startsWith('{')) {
        try {
          token = JSON.parse(token).token;
        } catch {
          console.error('The saved token is not valid JSON');
          callback(true, { message: 'Invalid token format' });
          return;
        }
      }

      if (!token || typeof token !== 'string') {
        console.error('No valid authentication token found');
        callback(true, { message: 'Missing authentication token' });
        return;
      }

      fetch('http://127.0.0.1:8000/api/broadcasting/auth', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          socket_id: socketId,
          channel_name: channel.name,
        }),
      })
        .then(async (response) => {
          const data = await response.json();

          if (!response.ok) {
            console.error('Broadcast authorization failed:', response.status, data);
            callback(true, data);
            return;
          }

          callback(false, data);
        })
        .catch((error) => {
          console.error('Authorization request failed:', error);
          callback(true, error);
        });
    },
  }),
});

export default echo;
