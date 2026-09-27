document.addEventListener('DOMContentLoaded', () => {
  
  /* =========================================================
     1. CAROUSEL ENGINE
     ========================================================= */
  const track = document.getElementById('carouselTrack');
  const slides = Array.from(track.children);
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const dotsContainer = document.getElementById('dotsContainer');
  
  let currentIndex = 0;
  const totalSlides = slides.length;

  // Create Dot Indicators dynamically
  slides.forEach((_, index) => {
    const dot = document.createElement('div');
    dot.classList.add('fr-dot');
    if (index === 0) dot.classList.add('active');
    dot.addEventListener('click', () => goToSlide(index));
    dotsContainer.appendChild(dot);
  });

  const dots = Array.from(dotsContainer.children);

  function updateCarousel() {
    track.style.transform = `translateX(-${currentIndex * 100}%)`;
    dots.forEach((dot, index) => {
      dot.classList.toggle('active', index === currentIndex);
    });
  }

  function goToSlide(index) {
    currentIndex = index;
    updateCarousel();
  }

  function nextSlide() {
    currentIndex = (currentIndex + 1) % totalSlides;
    updateCarousel();
  }

  function prevSlide() {
    currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
    updateCarousel();
  }

  nextBtn.addEventListener('click', nextSlide);
  prevBtn.addEventListener('click', prevSlide);

  // Touch / Swipe support for Mobile Devices
  let startX = 0;
  let endX = 0;

  track.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
  });

  track.addEventListener('touchend', (e) => {
    endX = e.changedTouches[0].clientX;
    if (startX - endX > 50) nextSlide();
    if (endX - startX > 50) prevSlide();
  });

  /* =========================================================
     2. RANDOM QUOTE GENERATOR
     ========================================================= */
  const quotes = [
    { text: "Welcome to the real world. It sucks. You're gonna love it!", author: "Monica Geller" },
    { text: "How you doin'?", author: "Joey Tribbiani" },
    { text: "Could this BE any more iconic?", author: "Chandler Bing" },
    { text: "They don't know that we know they know we know.", author: "Phoebe Buffay" },
    { text: "WE WERE ON A BREAK!", author: "Ross Geller" },
    { text: "Ah, humor based on my pain. Ah, good one.", author: "Rachel Green" },
    { text: "I'm not great at the advice. Can I interest you in a sarcastic comment?", author: "Chandler Bing" },
    { text: "Joey doesn't share food!", author: "Joey Tribbiani" },
    { text: "She's your lobster. C'mon, you guys, it's a known fact that lobsters fall in love and mate for life.", author: "Phoebe Buffay" }
  ];

  const quoteText = document.getElementById('quoteText');
  const quoteAuthor = document.getElementById('quoteAuthor');
  const quoteBtn = document.getElementById('quoteBtn');

  quoteBtn.addEventListener('click', () => {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    quoteText.textContent = `"${quotes[randomIndex].text}"`;
    quoteAuthor.textContent = `— ${quotes[randomIndex].author}`;
  });

  /* =========================================================
     3. TRIVIA QUIZ ENGINE
     ========================================================= */
  const triviaData = [
    {
      question: "What is the name of Joey's bedtime penguin plushie?",
      options: ["Pengu", "Hugsy", "Waddles", "Snowy"],
      answer: 1
    },
    {
      question: "What color is the iconic apartment door in Monica's apartment?",
      options: ["Blue", "Red", "Purple", "Yellow"],
      answer: 2
    },
    {
      question: "How many times was Ross Geller legally married?",
      options: ["2 times", "3 times", "4 times", "1 time"],
      answer: 1
    },
    {
      question: "What instrument does Phoebe Buffay play?",
      options: ["Guitar", "Piano", "Ukulele", "Violin"],
      answer: 0
    }
  ];

  let currentQuizIndex = 0;
  const quizQuestion = document.getElementById('quizQuestion');
  const quizOptions = document.getElementById('quizOptions');
  const quizFeedback = document.getElementById('quizFeedback');
  const nextQuizBtn = document.getElementById('nextQuizBtn');

  function loadQuestion() {
    quizFeedback.textContent = '';
    nextQuizBtn.style.display = 'none';
    quizOptions.innerHTML = '';

    const currentData = triviaData[currentQuizIndex];
    quizQuestion.textContent = currentData.question;

    currentData.options.forEach((optionText, idx) => {
      const btn = document.createElement('button');
      btn.classList.add('fr-quiz-btn');
      btn.textContent = optionText;
      btn.addEventListener('click', () => selectAnswer(idx, currentData.answer));
      quizOptions.appendChild(btn);
    });
  }

  function selectAnswer(selectedIdx, correctIdx) {
    const optionButtons = quizOptions.querySelectorAll('.fr-quiz-btn');
    optionButtons.forEach((btn, idx) => {
      btn.disabled = true;
      if (idx === correctIdx) {
        btn.classList.add('correct');
      } else if (idx === selectedIdx) {
        btn.classList.add('incorrect');
      }
    });

    if (selectedIdx === correctIdx) {
      quizFeedback.textContent = "✨ Correct! Could you BE any smarter?";
      quizFeedback.style.color = "#00ff66";
    } else {
      quizFeedback.textContent = "❌ Wrong answer! Time to re-watch the show!";
      quizFeedback.style.color = "#ff3838";
    }

    nextQuizBtn.style.display = 'inline-block';
  }

  nextQuizBtn.addEventListener('click', () => {
    currentQuizIndex = (currentQuizIndex + 1) % triviaData.length;
    loadQuestion();
  });

  // Initialize Trivia Game
  loadQuestion();
});