import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { logPerformanceMetrics, preloadCriticalResources, getDeviceInfo } from "./utils/performance";

// Preload critical resources
preloadCriticalResources();

// Log device info in development
if (import.meta.env.DEV) {
  console.log('📱 Device Info:', getDeviceInfo());
}

// Render app
createRoot(document.getElementById("root")!).render(<App />);

// Log performance metrics after load
if (import.meta.env.DEV) {
  window.addEventListener('load', () => {
    setTimeout(() => {
      logPerformanceMetrics();
    }, 0);
  });
}

// Register service worker in production
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then((registration) => {
        console.log('✅ Service Worker registered:', registration.scope);
        
        // Check for updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                // New version available
                if (confirm('New version available! Reload to update?')) {
                  window.location.reload();
                }
              }
            });
          }
        });
      })
      .catch((error) => {
        console.error('❌ Service Worker registration failed:', error);
      });
  });
}
