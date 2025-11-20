// Performance monitoring utilities

export interface PerformanceMetrics {
  fcp?: number; // First Contentful Paint
  lcp?: number; // Largest Contentful Paint
  fid?: number; // First Input Delay
  cls?: number; // Cumulative Layout Shift
  ttfb?: number; // Time to First Byte
}

/**
 * Report Web Vitals metrics
 * Note: Install web-vitals package if you want to use this feature
 * npm install web-vitals
 */
export const reportWebVitals = (onPerfEntry?: (metric: PerformanceMetrics) => void) => {
  if (onPerfEntry && typeof onPerfEntry === 'function') {
    // Use the Web Vitals library if available
    // Uncomment below if you install web-vitals package
    /*
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      getCLS(onPerfEntry);
      getFID(onPerfEntry);
      getFCP(onPerfEntry);
      getLCP(onPerfEntry);
      getTTFB(onPerfEntry);
    });
    */
  }
};

/**
 * Log performance metrics to console (development only)
 */
export const logPerformanceMetrics = () => {
  if (import.meta.env.DEV) {
    // Navigation Timing API
    const perfData = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    
    if (perfData) {
      console.group('⚡ Performance Metrics');
      console.log('DNS Lookup:', Math.round(perfData.domainLookupEnd - perfData.domainLookupStart), 'ms');
      console.log('TCP Connection:', Math.round(perfData.connectEnd - perfData.connectStart), 'ms');
      console.log('Request Time:', Math.round(perfData.responseStart - perfData.requestStart), 'ms');
      console.log('Response Time:', Math.round(perfData.responseEnd - perfData.responseStart), 'ms');
      console.log('DOM Processing:', Math.round(perfData.domComplete - perfData.domInteractive), 'ms');
      console.log('Load Complete:', Math.round(perfData.loadEventEnd - perfData.loadEventStart), 'ms');
      console.log('Total Load Time:', Math.round(perfData.loadEventEnd - perfData.fetchStart), 'ms');
      console.groupEnd();
    }

    // Resource Timing API
    const resources = performance.getEntriesByType('resource');
    const totalSize = resources.reduce((acc, resource: any) => {
      return acc + (resource.transferSize || 0);
    }, 0);
    
    console.log('📦 Total Resources:', resources.length);
    console.log('📊 Total Transfer Size:', (totalSize / 1024).toFixed(2), 'KB');
  }
};

/**
 * Measure component render time
 */
export const measureRender = (componentName: string, callback: () => void) => {
  const start = performance.now();
  callback();
  const end = performance.now();
  
  if (import.meta.env.DEV) {
    console.log(`🎨 ${componentName} render time:`, (end - start).toFixed(2), 'ms');
  }
};

/**
 * Check if the app is running on a slow connection
 */
export const isSlowConnection = (): boolean => {
  const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
  
  if (connection) {
    // Check for 2G or slow-2g
    if (connection.effectiveType === '2g' || connection.effectiveType === 'slow-2g') {
      return true;
    }
    
    // Check for save-data mode
    if (connection.saveData) {
      return true;
    }
  }
  
  return false;
};

/**
 * Preload critical resources
 */
export const preloadCriticalResources = () => {
  // Preload fonts
  const fontLink = document.createElement('link');
  fontLink.rel = 'preload';
  fontLink.as = 'font';
  fontLink.type = 'font/woff2';
  fontLink.crossOrigin = 'anonymous';
  fontLink.href = 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff2';
  document.head.appendChild(fontLink);
};

/**
 * Lazy load images with Intersection Observer
 */
export const lazyLoadImages = () => {
  const images = document.querySelectorAll('img[data-src]');
  
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement;
          img.src = img.dataset.src || '';
          img.removeAttribute('data-src');
          observer.unobserve(img);
        }
      });
    });
    
    images.forEach(img => imageObserver.observe(img));
  } else {
    // Fallback for browsers without Intersection Observer
    images.forEach(img => {
      const image = img as HTMLImageElement;
      image.src = image.dataset.src || '';
    });
  }
};

/**
 * Get device information for debugging
 */
export const getDeviceInfo = () => {
  return {
    userAgent: navigator.userAgent,
    platform: navigator.platform,
    language: navigator.language,
    cookieEnabled: navigator.cookieEnabled,
    onLine: navigator.onLine,
    screenWidth: window.screen.width,
    screenHeight: window.screen.height,
    viewportWidth: window.innerWidth,
    viewportHeight: window.innerHeight,
    devicePixelRatio: window.devicePixelRatio,
    touchSupport: 'ontouchstart' in window,
    connection: (navigator as any).connection?.effectiveType || 'unknown',
  };
};

/**
 * Monitor memory usage (Chrome only)
 */
export const monitorMemory = () => {
  if (import.meta.env.DEV && 'memory' in performance) {
    const memory = (performance as any).memory;
    console.group('💾 Memory Usage');
    console.log('Used:', (memory.usedJSHeapSize / 1048576).toFixed(2), 'MB');
    console.log('Total:', (memory.totalJSHeapSize / 1048576).toFixed(2), 'MB');
    console.log('Limit:', (memory.jsHeapSizeLimit / 1048576).toFixed(2), 'MB');
    console.groupEnd();
  }
};
