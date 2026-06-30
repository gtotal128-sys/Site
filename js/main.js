/**
 * Main Application Loop
 */

let lastTime = Date.now();

/**
 * Main animation loop
 */
function animationLoop() {
  const currentTime = Date.now();
  const deltaTime = Math.min(currentTime - lastTime, 50); // Cap at 50ms
  lastTime = currentTime;

  // Get scroll progress
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const scrollProgress = docHeight > 0 ? scrollTop / docHeight : 0;

  // Update systems
  animationManager.update(deltaTime, scrollProgress);

  // Render landscape
  renderer.render(scrollProgress);

  // Render particles
  animationManager.renderParticles(renderer.ctx);

  requestAnimationFrame(animationLoop);
}

/**
 * Initialize application
 */
function init() {
  console.log('🌍 Seasons — An Endless Cycle');
  console.log('Initializing...');

  // Initialize managers
  interactionManager.init();

  // Start animation loop
  animationLoop();

  console.log('✨ Ready to explore the seasons');
}

/**
 * Start application when DOM is ready
 */
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
