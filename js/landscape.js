/**
 * Landscape Rendering
 * Draws the animated landscape on canvas
 */

class LandscapeRenderer {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');
    this.width = this.canvas.width = window.innerWidth * CONFIG.canvas.pixelRatio;
    this.height = this.canvas.height = window.innerHeight * CONFIG.canvas.pixelRatio;
    this.ctx.scale(CONFIG.canvas.pixelRatio, CONFIG.canvas.pixelRatio);

    this.landscape = {};
    this.initializeLandscape();
  }

  initializeLandscape() {
    // Create landscape elements
    this.landscape.mountains = this.createMountains();
    this.landscape.trees = this.createTrees();
    this.landscape.clouds = this.createClouds();
    this.landscape.river = this.createRiver();
  }

  createMountains() {
    const mountains = [];
    const count = CONFIG.landscape.mountains.count;
    for (let i = 0; i < count; i++) {
      mountains.push({
        x: (this.width / count) * i + this.width / (count * 2),
        y: this.height * 0.5 - CONFIG.landscape.mountains.baseHeight + Math.random() * 50,
        width: this.width / (count - 0.5),
        height: CONFIG.landscape.mountains.baseHeight + Math.random() * 100,
        parallax: 1 - (i / count) * CONFIG.landscape.mountains.parallaxStrength,
      });
    }
    return mountains;
  }

  createTrees() {
    const trees = [];
    const count = CONFIG.landscape.trees.count;
    for (let i = 0; i < count; i++) {
      trees.push({
        x: (this.width / count) * i + Math.random() * (this.width / count * 0.8),
        y: this.height * 0.6 + Math.random() * 50,
        height: 80 + Math.random() * 120,
        width: 40 + Math.random() * 60,
        id: i,
        leafDensity: 0.7 + Math.random() * 0.3,
      });
    }
    return trees;
  }

  createClouds() {
    const clouds = [];
    const count = CONFIG.landscape.clouds.count;
    for (let i = 0; i < count; i++) {
      clouds.push({
        x: Math.random() * this.width,
        y: this.height * (0.1 + Math.random() * 0.3),
        width: 60 + Math.random() * 100,
        height: 40 + Math.random() * 60,
        speed: 0.3 + Math.random() * 0.7,
        offset: Math.random() * Math.PI * 2,
      });
    }
    return clouds;
  }

  createRiver() {
    return {
      x: this.width * 0.5,
      y: this.height * 0.65,
      width: this.width * CONFIG.landscape.river.width,
      waveAmount: 0,
      flow: 0,
    };
  }

  /**
   * Render the entire landscape
   * @param {number} scrollProgress - Current scroll position (0-1)
   */
  render(scrollProgress) {
    // Update season from scroll
    seasonManager.updateFromScroll(scrollProgress);

    // Clear canvas with gradient background
    this.drawBackground();

    // Draw landscape layers (back to front)
    this.drawMountains();
    this.drawClouds();
    this.drawRiver();
    this.drawTrees();
    this.drawForeground();
  }

  drawBackground() {
    const skyColor = seasonManager.getInterpolatedColor('sky');
    const skyLightColor = seasonManager.getInterpolatedColor('skyLight');

    const gradient = this.ctx.createLinearGradient(0, 0, 0, this.height);
    gradient.addColorStop(0, SeasonManager.rgbToString(skyColor));
    gradient.addColorStop(1, SeasonManager.rgbToString(skyLightColor));

    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(0, 0, this.width, this.height);
  }

  drawMountains() {
    const mountainColor = seasonManager.getInterpolatedColor('ground');

    this.landscape.mountains.forEach((mountain) => {
      this.ctx.fillStyle = SeasonManager.rgbToString(mountainColor);
      this.ctx.beginPath();
      this.ctx.moveTo(mountain.x - mountain.width / 2, this.height);
      this.ctx.lineTo(mountain.x, mountain.y);
      this.ctx.lineTo(mountain.x + mountain.width / 2, this.height);
      this.ctx.fill();

      // Mountain shadow
      this.ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      this.ctx.beginPath();
      this.ctx.moveTo(mountain.x, mountain.y);
      this.ctx.lineTo(mountain.x + mountain.width / 2, this.height);
      this.ctx.lineTo(mountain.x + mountain.width * 0.3, this.height);
      this.ctx.fill();
    });
  }

  drawClouds() {
    const cloudColor = seasonManager.getInterpolatedColor('skyLight');
    const accentColor = seasonManager.getInterpolatedColor('accent');

    this.landscape.clouds.forEach((cloud) => {
      const offsetX = Math.sin(cloud.offset + seasonManager.scrollProgress * 2) * 50;
      const x = cloud.x + offsetX;

      this.ctx.fillStyle = `rgba(${cloudColor.r}, ${cloudColor.g}, ${cloudColor.b}, 0.7)`;
      this.ctx.beginPath();
      this.ctx.ellipse(x, cloud.y, cloud.width / 2, cloud.height / 2, 0, 0, Math.PI * 2);
      this.ctx.fill();
    });
  }

  drawRiver() {
    const accentColor = seasonManager.getInterpolatedColor('accent');
    const riverColor = { ...accentColor, a: 0.6 };

    // Draw water
    this.ctx.fillStyle = `rgba(${riverColor.r}, ${riverColor.g}, ${riverColor.b}, 0.6)`;
    this.ctx.beginPath();
    this.ctx.ellipse(
      this.landscape.river.x,
      this.landscape.river.y,
      this.landscape.river.width / 2,
      30,
      0,
      0,
      Math.PI * 2
    );
    this.ctx.fill();

    // River reflection
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
    this.ctx.beginPath();
    this.ctx.ellipse(
      this.landscape.river.x,
      this.landscape.river.y - 10,
      this.landscape.river.width / 3,
      10,
      0,
      0,
      Math.PI * 2
    );
    this.ctx.fill();
  }

  drawTrees() {
    this.landscape.trees.forEach((tree) => {
      this.drawTree(tree);
    });
  }

  drawTree(tree) {
    const season = seasonManager.getCurrentSeason();
    const seasonProgress = seasonManager.seasonProgress;

    // Trunk
    const trunkColor = seasonManager.getInterpolatedColor('ground');
    this.ctx.fillStyle = SeasonManager.rgbToString(trunkColor);
    this.ctx.fillRect(tree.x - tree.width * 0.15, tree.y, tree.width * 0.3, tree.height * 0.4);

    // Foliage based on season
    this.drawTreeFoliage(tree, season, seasonProgress);
  }

  drawTreeFoliage(tree, season, progress) {
    const accentColor = seasonManager.getInterpolatedColor('accent');
    const nextSeasonAccent = CONFIG.seasons[(seasonManager.currentSeason + 1) % 4].colors.accent;

    let foliageOpacity = 1;
    let foliageColor = { ...accentColor };

    // Season-specific foliage
    if (season.name === 'Summer') {
      foliageColor = { r: 34, g: 139, b: 34 }; // Forest green
      foliageOpacity = 0.8 + progress * 0.2;
    } else if (season.name === 'Autumn') {
      foliageColor = SeasonManager.interpolateColor(
        { r: 34, g: 139, b: 34 },
        { r: 255, g: 140, b: 0 },
        progress
      );
      foliageOpacity = 0.8;
    } else if (season.name === 'Winter') {
      foliageOpacity = Math.max(0, 0.8 - progress);
    } else if (season.name === 'Spring') {
      foliageOpacity = progress;
      foliageColor = { r: 144, g: 238, b: 144 }; // Light green
    }

    this.ctx.fillStyle = `rgba(${foliageColor.r}, ${foliageColor.g}, ${foliageColor.b}, ${foliageOpacity})`;
    this.ctx.beginPath();
    this.ctx.ellipse(
      tree.x,
      tree.y - tree.height * 0.3,
      tree.width * 0.6,
      tree.height * 0.6,
      0,
      0,
      Math.PI * 2
    );
    this.ctx.fill();
  }

  drawForeground() {
    // Grass/ground layer
    const groundColor = seasonManager.getInterpolatedColor('ground');
    this.ctx.fillStyle = SeasonManager.rgbToString(groundColor);
    this.ctx.fillRect(0, this.height * 0.75, this.width, this.height * 0.25);
  }

  /**
   * Handle window resize
   */
  handleResize() {
    this.width = this.canvas.width = window.innerWidth * CONFIG.canvas.pixelRatio;
    this.height = this.canvas.height = window.innerHeight * CONFIG.canvas.pixelRatio;
    this.ctx.scale(CONFIG.canvas.pixelRatio, CONFIG.canvas.pixelRatio);
    this.landscape = {};
    this.initializeLandscape();
  }
}

// Initialize renderer
const renderer = new LandscapeRenderer('landscape-canvas');
