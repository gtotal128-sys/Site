/**
 * User Interactions and Events
 * Handles mouse, scroll, and touch events
 */

class InteractionManager {
  constructor() {
    this.mouseX = window.innerWidth / 2;
    this.mouseY = window.innerHeight / 2;
    this.scrollProgress = 0;
    this.lastScrollProgress = 0;
  }

  /**
   * Initialize event listeners
   */
  init() {
    window.addEventListener('mousemove', (e) => this.handleMouseMove(e));
    window.addEventListener('scroll', (e) => this.handleScroll());
    window.addEventListener('touchmove', (e) => this.handleTouchMove(e));
    window.addEventListener('resize', (e) => this.handleResize());
  }

  handleMouseMove(e) {
    this.mouseX = e.clientX;
    this.mouseY = e.clientY;

    // Create seasonal effects based on cursor
    this.createCursorEffects();
  }

  handleTouchMove(e) {
    if (e.touches.length > 0) {
      this.mouseX = e.touches[0].clientX;
      this.mouseY = e.touches[0].clientY;
    }
  }

  handleScroll() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    this.scrollProgress = docHeight > 0 ? scrollTop / docHeight : 0;

    // Update UI and landscape
    this.updateUI();

    // Only create particles if scroll changed significantly
    const scrollDelta = Math.abs(this.scrollProgress - this.lastScrollProgress);
    if (scrollDelta > 0.01) {
      this.createScrollEffects();
      this.lastScrollProgress = this.scrollProgress;
    }
  }

  handleResize() {
    renderer.handleResize();
  }

  createCursorEffects() {
    const season = seasonManager.getCurrentSeason();

    if (season.name === 'Autumn') {
      // Leaves swirl around cursor
      animationManager.createParticles(this.mouseX, this.mouseY, 1, 'leaf');
    } else if (season.name === 'Winter') {
      // Snowflakes react to cursor
      animationManager.createParticles(this.mouseX, this.mouseY, 1, 'snow');
    } else if (season.name === 'Spring') {
      // Petals dance around cursor
      animationManager.createParticles(this.mouseX, this.mouseY, 1, 'petal');
    } else if (season.name === 'Summer') {
      // Fireflies around cursor
      animationManager.createParticles(this.mouseX, this.mouseY, 1, 'firefly');
    }
  }

  createScrollEffects() {
    const season = seasonManager.getCurrentSeason();

    // Spawn particles based on season
    const particleCount = Math.floor(Math.random() * 3) + 1;

    if (season.name === 'Autumn') {
      animationManager.createParticles(
        Math.random() * window.innerWidth,
        Math.random() * window.innerHeight * 0.3,
        particleCount,
        'leaf'
      );
    } else if (season.name === 'Winter') {
      animationManager.createParticles(
        Math.random() * window.innerWidth,
        Math.random() * window.innerHeight * 0.4,
        particleCount,
        'snow'
      );
    } else if (season.name === 'Spring') {
      animationManager.createParticles(
        Math.random() * window.innerWidth,
        Math.random() * window.innerHeight * 0.4,
        particleCount,
        'petal'
      );
    }
  }

  updateUI() {
    // Update progress bar
    const progressBar = document.querySelector('.progress-bar::after');
    if (progressBar) {
      document.querySelector('.progress-bar::after').style.width = `${this.scrollProgress * 100}%`;
    }

    // Update season label
    const seasonLabel = document.querySelector('.season-label');
    if (seasonLabel) {
      seasonLabel.textContent = seasonManager.getSeasonName();
    }

    // Show/hide scroll indicator
    const scrollIndicator = document.getElementById('scroll-indicator');
    if (scrollIndicator) {
      if (this.scrollProgress > 0.1) {
        scrollIndicator.classList.add('hidden');
      } else {
        scrollIndicator.classList.remove('hidden');
      }
    }

    // Update story text visibility
    const storyTexts = document.querySelectorAll('.story-text');
    storyTexts.forEach((text, index) => {
      const seasonStart = index * 0.25;
      const seasonEnd = (index + 1) * 0.25;

      if (this.scrollProgress >= seasonStart && this.scrollProgress < seasonEnd) {
        text.classList.add('active');
      } else {
        text.classList.remove('active');
      }
    });
  }
}

// Initialize interaction manager
const interactionManager = new InteractionManager();
