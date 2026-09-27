document.addEventListener('DOMContentLoaded', () => {

  /**
   * Initializes an infinitely looping carousel instance
   * @param {string} containerId - ID of the carousel wrapper element
   */
  function initCarousel(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const track = container.querySelector('.carousel-track');
    const slides = Array.from(track.children);
    const prevBtn = container.querySelector('.prev-btn');
    const nextBtn = container.querySelector('.next-btn');
    const dotsContainer = container.querySelector('.carousel-dots');

    let currentIndex = 0;
    let startX = 0;
    let currentTranslate = 0;
    let isDragging = false;

    // Determine visible slides per row based on media query breakpoints
    function getVisibleSlides() {
      const width = window.innerWidth;
      if (containerId === 'character-carousel') {
        if (width >= 800) return 2;
        return 1;
      } else {
        if (width >= 1200) return 3;
        if (width >= 800) return 2;
        return 1;
      }
    }

    // Maximum index calculation
    function getMaxIndex() {
      const visible = getVisibleSlides();
      return Math.max(0, slides.length - visible);
    }

    // Setup interactive indicator dots
    function setupDots() {
      dotsContainer.innerHTML = '';
      const maxIndex = getMaxIndex();
      for (let i = 0; i <= maxIndex; i++) {
        const dot = document.createElement('button');
        dot.classList.add('dot');
        dot.setAttribute('aria-label', `Slide ${i + 1}`);
        if (i === currentIndex) dot.classList.add('active');
        dot.addEventListener('click', () => {
          currentIndex = i;
          updateCarousel();
        });
        dotsContainer.appendChild(dot);
      }
    }

    // Slide track to specified index
    function updateCarousel() {
      const slideWidth = slides[0].getBoundingClientRect().width;
      track.style.transform = `translateX(-${currentIndex * slideWidth}px)`;

      // Update dots highlight
      const dots = Array.from(dotsContainer.children);
      dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentIndex);
      });
    }

    // Infinite Loop - Next Slide
    function nextSlide() {
      const maxIndex = getMaxIndex();
      if (currentIndex >= maxIndex) {
        currentIndex = 0; // Wrap around to start
      } else {
        currentIndex++;
      }
      updateCarousel();
    }

    // Infinite Loop - Previous Slide
    function prevSlide() {
      const maxIndex = getMaxIndex();
      if (currentIndex <= 0) {
        currentIndex = maxIndex; // Wrap around to end
      } else {
        currentIndex--;
      }
      updateCarousel();
    }

    // Button event listeners
    if (prevBtn) prevBtn.addEventListener('click', prevSlide);
    if (nextBtn) nextBtn.addEventListener('click', nextSlide);

    // Touch and swipe events
    track.addEventListener('touchstart', touchStart);
    track.addEventListener('touchend', touchEnd);
    track.addEventListener('touchmove', touchMove);

    function touchStart(event) {
      startX = event.touches[0].clientX;
      isDragging = true;
    }

    function touchMove(event) {
      if (!isDragging) return;
      const currentX = event.touches[0].clientX;
      currentTranslate = currentX - startX;
    }

    function touchEnd() {
      if (!isDragging) return;
      isDragging = false;
      if (currentTranslate < -50) {
        nextSlide();
      } else if (currentTranslate > 50) {
        prevSlide();
      }
      currentTranslate = 0;
    }

    // Recalculate dimensions on window resize
    window.addEventListener('resize', () => {
      setupDots();
      updateCarousel();
    });

    // Initial setup
    setupDots();
    updateCarousel();
  }

  // Initialize both carousels
  initCarousel('character-carousel');
  initCarousel('episode-carousel');

});