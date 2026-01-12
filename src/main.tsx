import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "./App.tsx";
import "./index.css";
import { logPerformanceMetrics, preloadCriticalResources, getDeviceInfo } from "./utils/performance";
import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter } from "react-router-dom";

// Initialize performance monitoring
if (import.meta.env.DEV) {
  // Only run in development to avoid console noise in production
  window.addEventListener('load', () => {
    setTimeout(() => {
      logPerformanceMetrics();
      const info = getDeviceInfo();
      console.log('Device Info:', info);
    }, 0);
  });
}

// Preload critical resources
// We wrap this in a check for window to ensure it doesn't run during build if we ever move back to SSG tools
if (typeof window !== 'undefined') {
  preloadCriticalResources();
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </HelmetProvider>
  </React.StrictMode>
);



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
