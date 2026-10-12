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
        return width >= 800 ? 2 : 1;
      }
      if (width >= 1200) return 3;
      if (width >= 800) return 2;
      return 1;
    }

    // Maximum index calculation
    function getMaxIndex() {
      return Math.max(0, slides.length - getVisibleSlides());
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

    // Slide track to current index (percentage based, no pixel measuring)
    function updateCarousel() {
      track.style.transform = `translateX(-${currentIndex * (100 / getVisibleSlides())}%)`;
      Array.from(dotsContainer.children).forEach((dot, i) => {
        dot.classList.toggle('active', i === currentIndex);
      });
    }

    // Infinite Loop - Next Slide
    function nextSlide() {
      currentIndex = currentIndex >= getMaxIndex() ? 0 : currentIndex + 1;
      updateCarousel();
    }

    // Infinite Loop - Previous Slide
    function prevSlide() {
      currentIndex = currentIndex <= 0 ? getMaxIndex() : currentIndex - 1;
      updateCarousel();
    }

    // Button event listeners
    if (prevBtn) prevBtn.addEventListener('click', prevSlide);
    if (nextBtn) nextBtn.addEventListener('click', nextSlide);

    // Keyboard arrows (container has tabindex="0")
    container.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') nextSlide();
      if (e.key === 'ArrowLeft') prevSlide();
    });

    // Touch and swipe events
    function touchStart(event) {
      startX = event.touches[0].clientX;
      currentTranslate = 0;
      isDragging = true;
    }

    function touchMove(event) {
      if (!isDragging) return;
      currentTranslate = event.touches[0].clientX - startX;
    }

    function touchEnd() {
      if (!isDragging) return;
      isDragging = false;
      if (currentTranslate < -50) nextSlide();
      else if (currentTranslate > 50) prevSlide();
      currentTranslate = 0;
    }

    track.addEventListener('touchstart', touchStart, { passive: true });
    track.addEventListener('touchmove', touchMove, { passive: true });
    track.addEventListener('touchend', touchEnd);

    // Recalculate on window resize (clamp index so the track never overshoots)
    window.addEventListener('resize', () => {
      currentIndex = Math.min(currentIndex, getMaxIndex());
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


  // =========================================
  // TRIVIA
  // =========================================
  function initTrivia() {
    const questions = [
      {
        q: "What was the final score of Mizi vs. Sua in Round 1?",
        options: ["87 to 86", "90 to 68", "153 to 20", "100 to 99"],
        answer: 0,
        note: "Mizi won by a single point, and Sua was executed."
      },
      {
        q: "Who does Till defeat 153 to 20 in Round 2?",
        options: ["Marty", "Durian", "Acorn", "Isaac"],
        answer: 2,
        note: "Till played a punk-rock song he wrote himself and smashed his guitar."
      },
      {
        q: "Who is Ivan deeply fixated on?",
        options: ["Mizi", "Till", "Luka", "Hyuna"],
        answer: 1,
        note: "His obsession with Till drives his performances."
      },
      {
        q: "Which song does Mizi perform against Luka in Round 5?",
        options: ["Cure", "Karma", "Ruler of my Heart", "All-In"],
        answer: 2,
        note: "Luka mimics Sua's voice and gestures to break Mizi."
      },
      {
        q: "What happens to Ivan at the end of his duel with Till?",
        options: [
          "He wins and advances",
          "He escapes with the resistance",
          "He is shot by the stage's guards",
          "He forfeits and is spared"
        ],
        answer: 2,
        note: "He provoked the guards on purpose so Till would survive."
      },
      {
        q: "Who are the creators credited on this page?",
        options: ["VIVINOS & Q-Mew", "Studio Lico & Isaac", "Hyuna & Luka", "Anakt & Garden"],
        answer: 0,
        note: "Alien Stage is created and owned by VIVINOS and Studio Lico."
      },
      {
        q: "What is the name of the elite complex hosting the competition?",
        options: ["Anakt Garden", "Alien Arena", "Garden Prime", "The Stage Dome"],
        answer: 0,
        note: "Contestants are raised in captivity at Anakt Garden."
      },
      {
        q: "Which former contestant escaped and now leads the rebels?",
        options: ["Sua", "Hyuna", "Ivan", "Mizi"],
        answer: 1,
        note: "Hyuna's story ties into the resistance and Luka's past."
      }
    ];

    const quizEl = document.getElementById('trivia-quiz');
    const resultEl = document.getElementById('trivia-result');
    const progressEl = document.getElementById('trivia-progress');
    const scoreEl = document.getElementById('trivia-score');
    const barFill = document.getElementById('trivia-bar-fill');
    const questionEl = document.getElementById('trivia-question');
    const optionsEl = document.getElementById('trivia-options');
    const feedbackEl = document.getElementById('trivia-feedback');
    const nextBtn = document.getElementById('trivia-next');
    const restartBtn = document.getElementById('trivia-restart');
    const resultScore = document.getElementById('trivia-result-score');
    const resultMsg = document.getElementById('trivia-result-msg');

    if (!quizEl) return;

    let order = [];
    let current = 0;
    let score = 0;
    let answered = false;

    function shuffle(arr) {
      const a = arr.slice();
      for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
      }
      return a;
    }

    function startQuiz() {
      order = shuffle(questions);
      current = 0;
      score = 0;
      resultEl.hidden = true;
      quizEl.hidden = false;
      showQuestion();
    }

    function showQuestion() {
      answered = false;
      const item = order[current];

      progressEl.textContent = `QUESTION ${current + 1} / ${order.length}`;
      scoreEl.textContent = `SCORE: ${score}`;
      barFill.style.width = `${(current / order.length) * 100}%`;
      questionEl.textContent = item.q;
      feedbackEl.textContent = '';
      nextBtn.disabled = true;
      nextBtn.textContent = current === order.length - 1 ? 'See Results' : 'Next Question';
      optionsEl.innerHTML = '';

      // Shuffle options but remember which one is correct
      const opts = item.options.map((text, i) => ({ text, correct: i === item.answer }));
      shuffle(opts).forEach(opt => {
        const btn = document.createElement('button');
        btn.className = 'trivia-option';
        btn.textContent = opt.text;
        btn.addEventListener('click', () => selectAnswer(btn, opt.correct, item.note));
        optionsEl.appendChild(btn);
      });
    }

    function selectAnswer(btn, isCorrect, note) {
      if (answered) return;
      answered = true;

      const correctText = order[current].options[order[current].answer];

      Array.from(optionsEl.children).forEach(b => {
        b.disabled = true;
        if (b.textContent === correctText) b.classList.add('correct');
      });

      if (isCorrect) {
        score++;
        feedbackEl.textContent = `Correct! ${note}`;
      } else {
        btn.classList.add('wrong');
        feedbackEl.textContent = `Not quite. ${note}`;
      }

      scoreEl.textContent = `SCORE: ${score}`;
      nextBtn.disabled = false;
    }

    function showResults() {
      quizEl.hidden = true;
      resultEl.hidden = false;
      barFill.style.width = '100%';
      resultScore.textContent = `${score} / ${order.length}`;

      const ratio = score / order.length;
      if (ratio === 1) resultMsg.textContent = "Perfect score! You could sing for the aliens and survive.";
      else if (ratio >= 0.6) resultMsg.textContent = "Solid performance. You'd advance to the next round.";
      else resultMsg.textContent = "Eliminated... but the archive is open for another attempt.";
    }

    nextBtn.addEventListener('click', () => {
      if (current < order.length - 1) {
        current++;
        showQuestion();
      } else {
        showResults();
      }
    });

    restartBtn.addEventListener('click', startQuiz);

    startQuiz();
  }

  initTrivia();

});
