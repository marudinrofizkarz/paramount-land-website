/**
 * Critical CSS untuk above-the-fold content
 * Diload inline untuk mempercepat First Contentful Paint
 */

export const criticalCSS = `
  /* Reset minimal untuk performa */
  *, *::before, *::after {
    box-sizing: border-box;
  }
  
  html {
    line-height: 1.15;
    -webkit-text-size-adjust: 100%;
    font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif;
  }
  
  body {
    margin: 0;
    padding: 0;
    min-height: 100vh;
    background-color: #ffffff;
    color: #0f172a;
  }
  
  /* Hero slider critical styles */
  .hero-container {
    width: 100%;
    height: 50vh;
    min-height: 400px;
    position: relative;
    overflow: hidden;
    background-color: #f8fafc;
  }
  
  @media (min-width: 768px) {
    .hero-container {
      height: 60vh;
      min-height: 500px;
    }
  }
  
  /* Image loading optimization */
  .hero-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: opacity 0.3s ease-in-out;
  }
  
  /* Navigation critical styles */
  .header-nav {
    position: sticky;
    top: 0;
    z-index: 50;
    background-color: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    border-bottom: 1px solid #e2e8f0;
  }
  
  /* Loading skeleton styles */
  .skeleton {
    background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
    background-size: 200% 100%;
    animation: loading 1.5s infinite;
  }
  
  @keyframes loading {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }
  
  /* Dark mode support */
  @media (prefers-color-scheme: dark) {
    body {
      background-color: #0f172a;
      color: #f8fafc;
    }
    
    .hero-container {
      background-color: #1e293b;
    }
    
    .header-nav {
      background-color: rgba(15, 23, 42, 0.95);
      border-bottom-color: #334155;
    }
    
    .skeleton {
      background: linear-gradient(90deg, #1e293b 25%, #334155 50%, #1e293b 75%);
      background-size: 200% 100%;
    }
  }
  
  /* Font display optimization */
  @font-face {
    font-family: 'Inter';
    font-style: normal;
    font-weight: 400;
    font-display: swap;
  }
`;
