document.addEventListener("DOMContentLoaded", () => {
  const track = document.getElementById("carouselTrack");
  const slides = Array.from(track.children);
  const nextBtn = document.getElementById("nextBtn");
  const prevBtn = document.getElementById("prevBtn");
  const dotsContainer = document.getElementById("carouselDots");

  let currentIndex = 0;
  const slideCount = slides.length;

  // 1. Generate Dot Navigation Dynamic Elements
  slides.forEach((_, index) => {
    const dot = document.createElement("button");
    dot.classList.add("hxh-dot");
    if (index === 0) dot.classList.add("active");
    dot.setAttribute("aria-label", `Slide ${index + 1}`);
    dot.addEventListener("click", () => goToSlide(index));
    dotsContainer.appendChild(dot);
  });

  const dots = Array.from(dotsContainer.children);

  // 2. Core Function to Move Carousel
  function goToSlide(index) {
    if (index < 0) {
      currentIndex = slideCount - 1;
    } else if (index >= slideCount) {
      currentIndex = 0;
    } else {
      currentIndex = index;
    }

    // Slide track using CSS translateX transform
    track.style.transform = `translateX(-${currentIndex * 100}%)`;

    // Update active dot indicator
    dots.forEach((dot, idx) => {
      dot.classList.toggle("active", idx === currentIndex);
    });
  }

  // 3. Event Listeners for Prev/Next Buttons
  nextBtn.addEventListener("click", () => {
    goToSlide(currentIndex + 1);
    resetAutoSlide();
  });

  prevBtn.addEventListener("click", () => {
    goToSlide(currentIndex - 1);
    resetAutoSlide();
  });

  // 4. Keyboard Arrow Key Navigation
  document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") {
      goToSlide(currentIndex + 1);
      resetAutoSlide();
    } else if (e.key === "ArrowLeft") {
      goToSlide(currentIndex - 1);
      resetAutoSlide();
    }
  });

  // 5. Optional Auto-Rotation (Every 6 Seconds)
  let autoSlideTimer = setInterval(() => {
    goToSlide(currentIndex + 1);
  }, 6000);

  function resetAutoSlide() {
    clearInterval(autoSlideTimer);
    autoSlideTimer = setInterval(() => {
      goToSlide(currentIndex + 1);
    }, 6000);
  }
});