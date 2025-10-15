import { useEffect, useState } from 'react';

export const useServiceWorker = () => {
  const [isSupported, setIsSupported] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateAvailable, setUpdateAvailable] = useState(false);

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      setIsSupported(true);

      // Register service worker
      try {
        const registrationResult = (navigator.serviceWorker as any).register
          ? (navigator.serviceWorker as any).register('/sw.js')
          : undefined;

        Promise.resolve(registrationResult)
          .then((registration) => {
          console.log('[SW] Service worker registered:', registration);
          setIsRegistered(true);

          // Check for updates
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            if (newWorker) {
              setIsUpdating(true);
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  setUpdateAvailable(true);
                  setIsUpdating(false);
                }
              });
            }
          });

          // Listen for controller change (new SW activated)
          navigator.serviceWorker.addEventListener('controllerchange', () => {
            console.log('[SW] New service worker activated');
            window.location.reload();
          });
          })
          .catch((error) => {
            console.error('[SW] Service worker registration failed:', error);
          });
      } catch (err) {
        console.error('[SW] Service worker registration failed (sync):', err);
      }

      // Listen for messages from service worker
      navigator.serviceWorker.addEventListener('message', (event) => {
        console.log('[SW] Message from service worker:', event.data);
      });
    }
  }, []);

  const updateServiceWorker = () => {
    if ('serviceWorker' in navigator) {
      try {
        const ready = (navigator.serviceWorker as any).ready;
        const readyPromise = typeof ready === 'function' ? ready() : ready;
        Promise.resolve(readyPromise).then((registration) => {
          registration.update().then(() => {
            console.log('[SW] Service worker update triggered');
          });
        });
      } catch (err) {
        // noop in test env
      }
    }
  };

  const skipWaiting = () => {
    if ('serviceWorker' in navigator && updateAvailable) {
      try {
        const ready = (navigator.serviceWorker as any).ready;
        const readyPromise = typeof ready === 'function' ? ready() : ready;
        Promise.resolve(readyPromise).then((registration) => {
          if (registration.waiting) {
            registration.waiting.postMessage({ type: 'SKIP_WAITING' });
          }
        });
      } catch (err) {
        // noop
      }
    }
  };

  return {
    isSupported,
    isRegistered,
    isUpdating,
    updateAvailable,
    updateServiceWorker,
    skipWaiting,
  };
};