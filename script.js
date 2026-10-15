document.addEventListener('DOMContentLoaded', () => {

  function initFandomCarousel() {
    const container = document.getElementById('fandom-carousel');
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

    function getVisibleSlides() {
      const width = window.innerWidth;
      if (width >= 1150) return 3;
      if (width >= 768) return 2;
      return 1;
    }

    function getMaxIndex() {
      const visible = getVisibleSlides();
      return Math.max(0, slides.length - visible);
    }

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

    function updateCarousel() {
      const slideWidth = slides[0].getBoundingClientRect().width;
      track.style.transform = `translateX(-${currentIndex * slideWidth}px)`;

      const dots = Array.from(dotsContainer.children);
      dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentIndex);
      });
    }

    function nextSlide() {
      const maxIndex = getMaxIndex();
      if (currentIndex >= maxIndex) {
        currentIndex = 0;
      } else {
        currentIndex++;
      }
      updateCarousel();
    }

    function prevSlide() {
      const maxIndex = getMaxIndex();
      if (currentIndex <= 0) {
        currentIndex = maxIndex;
      } else {
        currentIndex--;
      }
      updateCarousel();
    }

    if (prevBtn) prevBtn.addEventListener('click', prevSlide);
    if (nextBtn) nextBtn.addEventListener('click', nextSlide);

    track.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
      isDragging = true;
    });

    track.addEventListener('touchmove', (e) => {
      if (!isDragging) return;
      const currentX = e.touches[0].clientX;
      currentTranslate = currentX - startX;
    });

    track.addEventListener('touchend', () => {
      if (!isDragging) return;
      isDragging = false;
      if (currentTranslate < -50) {
        nextSlide();
      } else if (currentTranslate > 50) {
        prevSlide();
      }
      currentTranslate = 0;
    });

    window.addEventListener('resize', () => {
      setupDots();
      updateCarousel();
    });

    setupDots();
    updateCarousel();
  }

  const navbar = document.querySelector('.navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.style.background = 'rgba(7, 3, 20, 0.98)';
      navbar.style.boxShadow = '0 10px 30px rgba(0,0,0,0.9)';
    } else {
      navbar.style.background = 'rgba(7, 3, 20, 0.92)';
      navbar.style.boxShadow = '0 0 20px rgba(224, 64, 251, 0.3)';
    }
  });

  initFandomCarousel();

});