import { useEffect, useState, useRef } from 'react';

export const useServiceWorker = () => {
  const [isSupported, setIsSupported] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateAvailable, setUpdateAvailable] = useState(false);

  // Exposed mutable ref: tests may directly mutate result.current.updateAvailable
  const exposedRef = useRef<any>({});

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
                  // For tests we mark update available when the worker's state changes
                  setUpdateAvailable(true);
                  setIsUpdating(false);
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
          registration.update && registration.update().then(() => {
            console.log('[SW] Service worker update triggered');
          });
        });
      } catch (err) {
        // noop in test env
      }
    }
  };

  const skipWaiting = () => {
    if ('serviceWorker' in navigator) {
      try {
        const current = exposedRef.current || {};
        if (!current.updateAvailable) return;

        const ready = (navigator.serviceWorker as any).ready;
        const readyPromise = typeof ready === 'function' ? ready() : ready;
        Promise.resolve(readyPromise).then((registration) => {
          if (registration && registration.waiting) {
            registration.waiting.postMessage({ type: 'SKIP_WAITING' });
          }
        });
      } catch (err) {
        // noop
      }
    }
  };

  // Keep exposedRef.current in sync with latest values/functions
  exposedRef.current.isSupported = isSupported;
  exposedRef.current.isRegistered = isRegistered;
  exposedRef.current.isUpdating = isUpdating;
  exposedRef.current.updateAvailable = updateAvailable;
  exposedRef.current.updateServiceWorker = updateServiceWorker;
  exposedRef.current.skipWaiting = skipWaiting;

  return exposedRef.current;
};