/**
 * Season Management
 * Handles season transitions and state
 */

class SeasonManager {
  constructor() {
    this.currentSeason = 0; // 0: Summer, 1: Autumn, 2: Winter, 3: Spring
    this.seasonProgress = 0; // 0-1 within current season
    this.globalProgress = 0; // 0-1 across all seasons
    this.scrollProgress = 0; // normalized scroll position (0-1)
  }

  /**
   * Update season based on scroll position
   * @param {number} scrollPercent - Current scroll position (0-1)
   */
  updateFromScroll(scrollPercent) {
    this.scrollProgress = scrollPercent;
    this.globalProgress = scrollPercent % 1; // Loop after one cycle

    // Determine current season
    const seasonIndex = Math.floor(this.globalProgress * 4);
    this.currentSeason = Math.min(seasonIndex, 3);

    // Calculate progress within current season
    const seasonStart = this.currentSeason * 0.25;
    const seasonEnd = (this.currentSeason + 1) * 0.25;
    this.seasonProgress = (this.globalProgress - seasonStart) / 0.25;
    this.seasonProgress = Math.max(0, Math.min(1, this.seasonProgress));
  }

  /**
   * Get current season object
   */
  getCurrentSeason() {
    return CONFIG.seasons[this.currentSeason];
  }

  /**
   * Get current season name
   */
  getSeasonName() {
    return this.getCurrentSeason().name;
  }

  /**
   * Interpolate color between seasons
   * @param {object} color1 - RGB color object
   * @param {object} color2 - RGB color object
   * @param {number} progress - Interpolation progress (0-1)
   */
  static interpolateColor(color1, color2, progress) {
    return {
      r: Math.round(color1.r + (color2.r - color1.r) * progress),
      g: Math.round(color1.g + (color2.g - color1.g) * progress),
      b: Math.round(color1.b + (color2.b - color1.b) * progress),
    };
  }

  /**
   * Get interpolated color for current season
   * @param {string} colorType - 'sky', 'skyLight', 'ground', 'accent'
   */
  getInterpolatedColor(colorType) {
    const currentSeason = this.getCurrentSeason();
    const nextSeason = CONFIG.seasons[(this.currentSeason + 1) % 4];

    return SeasonManager.interpolateColor(
      currentSeason.colors[colorType],
      nextSeason.colors[colorType],
      this.seasonProgress
    );
  }

  /**
   * Convert RGB to CSS color string
   */
  static rgbToString(color) {
    return `rgb(${color.r}, ${color.g}, ${color.b})`;
  }

  /**
   * Get temperature coefficient (for particle effects, wind, etc.)
   */
  getTemperatureCoefficient() {
    const temps = {
      'warm': 1.0,
      'cool': 0.6,
      'cold': 0.3,
    };
    return temps[this.getCurrentSeason().temperature] || 0.5;
  }
}

// Initialize season manager
const seasonManager = new SeasonManager();
