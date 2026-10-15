/* =========================================
   1. CHARACTER CAROUSEL
========================================= */
document.addEventListener("DOMContentLoaded", () => {
  const track = document.getElementById("carouselTrack");
  const slides = Array.from(track.children);
  const nextBtn = document.getElementById("nextBtn");
  const prevBtn = document.getElementById("prevBtn");
  const dotsContainer = document.getElementById("carouselDots");

  let currentIndex = 0;
  const slideCount = slides.length;

  // Generate dot navigation
  slides.forEach((_, index) => {
    const dot = document.createElement("button");
    dot.classList.add("hxh-dot");
    if (index === 0) dot.classList.add("active");
    dot.setAttribute("aria-label", `Slide ${index + 1}`);
    dot.addEventListener("click", () => {
      goToSlide(index);
      resetAutoSlide();
    });
    dotsContainer.appendChild(dot);
  });

  const dots = Array.from(dotsContainer.children);

  // Move carousel
  function goToSlide(index) {
    if (index < 0) {
      currentIndex = slideCount - 1;
    } else if (index >= slideCount) {
      currentIndex = 0;
    } else {
      currentIndex = index;
    }

    track.style.transform = `translateX(-${currentIndex * 100}%)`;

    dots.forEach((dot, idx) => {
      dot.classList.toggle("active", idx === currentIndex);
    });
  }

  // Prev / Next buttons
  nextBtn.addEventListener("click", () => {
    goToSlide(currentIndex + 1);
    resetAutoSlide();
  });

  prevBtn.addEventListener("click", () => {
    goToSlide(currentIndex - 1);
    resetAutoSlide();
  });

  // Keyboard arrows (ignored while the trivia exam is on screen)
  document.addEventListener("keydown", (e) => {
    const quiz = document.getElementById("htQuiz");
    if (quiz && quiz.classList.contains("ht-active")) return;

    if (e.key === "ArrowRight") {
      goToSlide(currentIndex + 1);
      resetAutoSlide();
    } else if (e.key === "ArrowLeft") {
      goToSlide(currentIndex - 1);
      resetAutoSlide();
    }
  });

  // Auto-rotation every 6 seconds
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

/* =========================================
   2. HUNTER × HUNTER TRIVIA
   Wrapped in an IIFE so it can't clash with the carousel code.
========================================= */
(function () {
  const ROUND_SIZE = 10;
  const STORE_KEY = "hxhTriviaBest";

  const QUESTIONS = [
    { q: "What is the name of Gon's father?", options: ["Ging Freecss", "Kite", "Isaac Netero", "Mito"], answer: 0 },
    { q: "Which Nen type is Gon?", options: ["Transmuter", "Enhancer", "Emitter", "Conjurer"], answer: 1 },
    { q: "Which Nen type is Killua?", options: ["Manipulator", "Specialist", "Transmuter", "Enhancer"], answer: 2 },
    { q: "Which Nen type is Leorio?", options: ["Conjurer", "Emitter", "Enhancer", "Specialist"], answer: 1 },
    { q: "What is the name of Kurapika's clan?", options: ["Zoldyck", "Kurta", "Freecss", "Paradinight"], answer: 1 },
    { q: "Who is the leader of the Phantom Troupe?", options: ["Hisoka", "Uvogin", "Chrollo Lucilfer", "Feitan"], answer: 2 },
    { q: "What is Hisoka's signature Nen ability called?", options: ["Bungee Gum", "Jajanken", "Dowsing Chain", "Godspeed"], answer: 0 },
    { q: "What is Killua's family name?", options: ["Zoldyck", "Lucilfer", "Morow", "Netero"], answer: 0 },
    { q: "What is Gon's signature attack called?", options: ["Thunderbolt", "Rock", "Jajanken", "Nen Beam"], answer: 2 },
    { q: "Who was the chairman of the Hunter Association during the early arcs?", options: ["Pariston Hill", "Isaac Netero", "Cheadle Yorkshire", "Ging Freecss"], answer: 1 },
    { q: "Which island does Gon leave to take the Hunter Exam?", options: ["Whale Island", "Greed Island", "Dark Continent", "Kakin"], answer: 0 },
    { q: "Which Nen technique completely seals off a user's aura?", options: ["Ten", "Zetsu", "Ren", "Hatsu"], answer: 1 }
  ];

  const $ = (id) => document.getElementById(id);
  if (!$("trivia")) return; // section missing on this page

  const screens = { start: $("htStart"), quiz: $("htQuiz"), result: $("htResult") };
  const optionsEl = $("htOptions");
  const nextBtn = $("htNextBtn");

  let order = [], index = 0, score = 0, answered = false, missed = [];

  const shuffle = (arr) => {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };

  const show = (name) => {
    Object.values(screens).forEach((s) => s.classList.remove("ht-active"));
    screens[name].classList.add("ht-active");
  };

  const getBest = () => {
    try { return localStorage.getItem(STORE_KEY); } catch (e) { return null; }
  };
  const setBest = (v) => {
    try { localStorage.setItem(STORE_KEY, String(v)); } catch (e) { /* storage unavailable */ }
  };
  const renderBest = () => {
    const b = getBest();
    $("htBest").textContent = b !== null ? "BEST SCORE: " + b + "/" + ROUND_SIZE : "";
  };

  function start() {
    // Pick a random set of questions and shuffle each question's options
    order = shuffle(QUESTIONS).slice(0, ROUND_SIZE).map((item) => {
      const correctText = item.options[item.answer];
      const options = shuffle(item.options);
      return { q: item.q, options: options, answer: options.indexOf(correctText) };
    });
    index = 0;
    score = 0;
    missed = [];
    show("quiz");
    render();
  }

  function render() {
    const item = order[index];
    answered = false;
    $("htQuestion").textContent = item.q;
    $("htCounter").textContent = "QUESTION " + (index + 1) + " / " + order.length;
    $("htScore").textContent = score;
    $("htProgress").style.width = (index / order.length) * 100 + "%";
    $("htFeedback").textContent = "";
    $("htFeedback").className = "ht-feedback";
    nextBtn.hidden = true;
    nextBtn.textContent = index === order.length - 1 ? "See Results" : "Next Question";

    optionsEl.innerHTML = "";
    item.options.forEach((text, i) => {
      const btn = document.createElement("button");
      btn.className = "ht-option";
      btn.textContent = text;
      btn.addEventListener("click", () => choose(i, btn));
      optionsEl.appendChild(btn);
    });
  }

  function choose(choice, btn) {
    if (answered) return;
    answered = true;
    const item = order[index];
    const buttons = Array.from(optionsEl.children);
    buttons.forEach((b) => (b.disabled = true));
    buttons[item.answer].classList.add("ht-correct");
    const fb = $("htFeedback");

    if (choice === item.answer) {
      score++;
      $("htScore").textContent = score;
      fb.textContent = "✔ Correct!";
      fb.classList.add("ht-good");
    } else {
      btn.classList.add("ht-wrong");
      fb.textContent = "✘ Wrong. The answer is \"" + item.options[item.answer] + "\".";
      fb.classList.add("ht-bad");
      missed.push({ q: item.q, correct: item.options[item.answer] });
    }
    nextBtn.hidden = false;
  }

  function rank(s, total) {
    const pct = (s / total) * 100;
    if (pct === 100) return ["Chairman Level", "A perfect score. Netero would be proud."];
    if (pct >= 80) return ["Hunter License Granted", "You passed the exam with flying colors."];
    if (pct >= 60) return ["Exam Survivor", "You made it through, but the final round was close."];
    if (pct >= 40) return ["Rookie Hunter", "You've got potential. Keep training your Nen."];
    return ["Failed the Exam", "Back to Whale Island. Rewatch and try again!"];
  }

  function finish() {
    $("htProgress").style.width = "100%";
    const total = order.length;
    const r = rank(score, total);
    $("htRank").textContent = r[0];
    $("htMessage").textContent = r[1];
    $("htFinal").textContent = score;
    $("htTotal").textContent = "/" + total;

    const prev = getBest();
    if (prev === null || score > Number(prev)) setBest(score);
    renderBest();

    const missEl = $("htMisses");
    missEl.innerHTML = "";
    missed.forEach((m) => {
      const div = document.createElement("div");
      div.className = "ht-miss";
      const strong = document.createElement("strong");
      strong.textContent = m.q;
      const span = document.createElement("span");
      span.textContent = "Correct answer: " + m.correct;
      div.append(strong, span);
      missEl.appendChild(div);
    });
    show("result");
  }

  $("htStartBtn").addEventListener("click", start);
  $("htRetryBtn").addEventListener("click", start);
  nextBtn.addEventListener("click", () => {
    index++;
    if (index >= order.length) finish();
    else render();
  });

  renderBest();
})();