/**
 * Animation and Effects Management
 */

class AnimationManager {
  constructor() {
    this.particles = [];
    this.time = 0;
  }

  /**
   * Update animations based on time and scroll progress
   * @param {number} deltaTime - Time since last frame in ms
   * @param {number} scrollProgress - Current scroll position (0-1)
   */
  update(deltaTime, scrollProgress) {
    this.time += deltaTime;

    // Update particles
    this.updateParticles(deltaTime, scrollProgress);
  }

  /**
   * Create particles for seasonal effects
   * @param {number} x - X position
   * @param {number} y - Y position
   * @param {number} count - Number of particles
   * @param {string} type - Particle type ('leaf', 'snow', 'petal', 'firefly')
   */
  createParticles(x, y, count, type) {
    const season = seasonManager.getCurrentSeason();

    for (let i = 0; i < count; i++) {
      const particle = {
        x: x + (Math.random() - 0.5) * 50,
        y: y + (Math.random() - 0.5) * 50,
        vx: (Math.random() - 0.5) * 2,
        vy: 0.5 + Math.random() * 1.5,
        life: CONFIG.animation.particleLife,
        maxLife: CONFIG.animation.particleLife,
        type: type,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.1,
      };

      this.particles.push(particle);
    }
  }

  updateParticles(deltaTime, scrollProgress) {
    this.particles = this.particles.filter((p) => {
      p.life -= deltaTime;
      return p.life > 0;
    });

    this.particles.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;
      p.rotation += p.rotationSpeed;

      // Apply wind and season effects
      const tempCoeff = seasonManager.getTemperatureCoefficient();
      p.vy *= (0.98 + tempCoeff * 0.02);
    });
  }

  /**
   * Render particles on canvas
   * @param {CanvasRenderingContext2D} ctx - Canvas context
   */
  renderParticles(ctx) {
    this.particles.forEach((p) => {
      const alpha = p.life / p.maxLife;
      const accentColor = seasonManager.getInterpolatedColor('accent');

      ctx.save();
      ctx.globalAlpha = alpha * 0.7;
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);

      if (p.type === 'leaf') {
        this.drawLeaf(ctx, accentColor);
      } else if (p.type === 'snow') {
        this.drawSnowflake(ctx);
      } else if (p.type === 'petal') {
        this.drawPetal(ctx);
      } else if (p.type === 'firefly') {
        this.drawFirefly(ctx);
      }

      ctx.restore();
    });
  }

  drawLeaf(ctx, color) {
    ctx.fillStyle = `rgb(${color.r}, ${color.g}, ${color.b})`;
    ctx.beginPath();
    ctx.ellipse(0, 0, 8, 5, 0.3, 0, Math.PI * 2);
    ctx.fill();
  }

  drawSnowflake(ctx) {
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.lineWidth = 1;
    for (let i = 0; i < 6; i++) {
      ctx.save();
      ctx.rotate((i / 6) * Math.PI * 2);
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(0, -12);
      ctx.stroke();
      ctx.restore();
    }
  }

  drawPetal(ctx) {
    ctx.fillStyle = 'rgba(255, 192, 203, 0.8)';
    ctx.beginPath();
    ctx.ellipse(0, 0, 6, 4, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  drawFirefly(ctx) {
    ctx.fillStyle = 'rgba(255, 255, 100, 0.9)';
    ctx.beginPath();
    ctx.arc(0, 0, 2, 0, Math.PI * 2);
    ctx.fill();
  }
}

// Initialize animation manager
const animationManager = new AnimationManager();
