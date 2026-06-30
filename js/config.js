/**
 * Configuration for the Seasons project
 */

const CONFIG = {
  // Canvas Settings
  canvas: {
    width: window.innerWidth,
    height: window.innerHeight,
    pixelRatio: window.devicePixelRatio || 1,
  },

  // Season Configuration
  seasons: [
    {
      name: 'Summer',
      icon: '☀️',
      duration: 0.25, // 25% of scroll
      startScroll: 0.0,
      colors: {
        sky: { r: 135, g: 206, b: 235 },
        skyLight: { r: 224, g: 246, b: 255 },
        ground: { r: 45, g: 80, b: 22 },
        accent: { r: 255, g: 215, b: 0 },
      },
      temperature: 'warm',
    },
    {
      name: 'Autumn',
      icon: '🍂',
      duration: 0.25,
      startScroll: 0.25,
      colors: {
        sky: { r: 255, g: 140, b: 66 },
        skyLight: { r: 255, g: 184, b: 77 },
        ground: { r: 139, g: 69, b: 19 },
        accent: { r: 255, g: 69, b: 0 },
      },
      temperature: 'cool',
    },
    {
      name: 'Winter',
      icon: '❄️',
      duration: 0.25,
      startScroll: 0.5,
      colors: {
        sky: { r: 176, g: 224, b: 230 },
        skyLight: { r: 232, g: 244, b: 248 },
        ground: { r: 240, g: 248, b: 255 },
        accent: { r: 173, g: 216, b: 230 },
      },
      temperature: 'cold',
    },
    {
      name: 'Spring',
      icon: '🌸',
      duration: 0.25,
      startScroll: 0.75,
      colors: {
        sky: { r: 135, g: 206, b: 235 },
        skyLight: { r: 255, g: 182, b: 193 },
        ground: { r: 144, g: 238, b: 144 },
        accent: { r: 255, g: 20, b: 147 },
      },
      temperature: 'warm',
    },
  ],

  // Landscape Elements
  landscape: {
    mountains: {
      count: 3,
      baseHeight: 150,
      parallaxStrength: 0.3,
    },
    trees: {
      count: 8,
      spread: 0.8,
    },
    clouds: {
      count: 4,
      speed: 0.01,
    },
    river: {
      speed: 0.005,
      width: 0.2,
    },
  },

  // Animation Settings
  animation: {
    smoothing: 0.1,
    particleLife: 2000, // ms
  },

  // Scroll Configuration
  scroll: {
    sensitivity: 1.0,
    maxScroll: 400, // vh
  },
};

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CONFIG;
}
