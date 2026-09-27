/// <reference types="vite/client" />

export function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js').then(
        (registration) => {
          console.log('RoomCraft AR SW registered: ', registration.scope);
        },
        (err) => {
          console.log('RoomCraft AR SW registration failed: ', err);
        }
      );
    });
  }
}
