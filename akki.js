const glow = document.querySelector('.cursor-glow');
window.addEventListener('mousemove', e => {
  glow.style.left = e.clientX + 'px';
  glow.style.top = e.clientY + 'px';
});

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('show');
  });
}, { threshold: .12 });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// One click unlocks audio. Browsers block unsolicited sound until a user gesture.
let soundUnlocked = false;
const soundHint = document.querySelector('#soundHint');
const unlockSound = () => {
  soundUnlocked = true;
  soundHint?.classList.add('unlocked');
};
document.addEventListener('click', unlockSound, { once: true });
soundHint?.addEventListener('click', unlockSound);

/* =========================================
   BEFORE / AFTER + YOUTUBE — HOVER PLAY
========================================= */

document.querySelectorAll('.ba-card').forEach(baCard => {

  const videos = baCard.querySelectorAll('video');

  if (!videos.length) return;

  const playBA = () => {

    videos.forEach(video => {
      video.currentTime = 0;
      video.muted = true;
      video.volume = 0;
      video.play().catch(() => {});
    });

    baCard.classList.add('is-playing');
  };

  const resetBA = () => {

    videos.forEach(video => {
      video.pause();
      video.currentTime = 0;
    });

    baCard.classList.remove('is-playing');
  };

  baCard.addEventListener('mouseenter', playBA);
  baCard.addEventListener('mouseleave', resetBA);

  baCard.addEventListener('touchstart', playBA, {
    passive: true
  });

});


document.querySelectorAll('.video-card').forEach(card => {
  const video = card.querySelector('.portfolio-video');
  let touchTimer;

  const playOnce = async () => {
    if (!soundUnlocked) unlockSound();
    video.pause();
    video.currentTime = 0;
    video.muted = false;
    video.volume = 1;
    card.classList.add('is-playing');
    try { await video.play(); }
    catch (err) {
      // If the browser still blocks sound, retry muted so the visual preview works.
      video.muted = true;
      try { await video.play(); } catch (_) {}
    }
  };

  const reset = () => {
    video.pause();
    video.currentTime = 0;
    card.classList.remove('is-playing');
  };

  card.addEventListener('mouseenter', playOnce);
  card.addEventListener('mouseleave', reset);
  card.addEventListener('touchstart', () => {
    clearTimeout(touchTimer);
    playOnce();
    touchTimer = setTimeout(reset, 10000);
  }, { passive: true });
  video.addEventListener('ended', reset);
});

document.querySelectorAll("a[href^='#']").forEach(link => {
  link.addEventListener('click', e => {
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});


/* =================================
   SHOWCASE VIDEO + SOUND
================================= */

let soundEnabled = false;

const showcaseVideos =
  document.querySelectorAll(".showcase-video video");


/* FIRST USER CLICK = SOUND UNLOCK */

document.addEventListener("click", () => {

  soundEnabled = true;

  showcaseVideos.forEach(video => {
    video.muted = false;
    video.volume = 1;
  });

}, { once: true });


/* HOVER PLAY */

document.querySelectorAll(".showcase-video").forEach(card => {

  const video = card.querySelector("video");

  card.addEventListener("mouseenter", () => {

    video.currentTime = 0;

    if (soundEnabled) {
      video.muted = false;
      video.volume = 1;
    } else {
      video.muted = true;
    }

    video.play().catch(() => {});

  });


  card.addEventListener("mouseleave", () => {

    video.pause();
    video.currentTime = 0;

  });

});

/* ================================
   MAGNETIC SHOWCASE BUTTON
================================ */

const showcaseButton = document.querySelector(".showcase-btn");

if (showcaseButton) {

  showcaseButton.addEventListener("mousemove", (e) => {

    const rect = showcaseButton.getBoundingClientRect();

    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    showcaseButton.style.transform =
      `translate(${x * 0.25}px, ${y * 0.25}px) scale(1.05)`;

  });

  showcaseButton.addEventListener("mouseleave", () => {

    showcaseButton.style.transform =
      "translate(0, 0) scale(1)";

  });

}



/* =========================================
   CUSTOM VIDEO — HOVER PLAY
========================================= */

document.querySelectorAll('.custom-video-card').forEach(card => {

    const video = card.querySelector('.custom-video');

    if (!video) return;

    card.addEventListener('mouseenter', async () => {

        video.currentTime = 0;
        video.muted = false;
        video.volume = 1;

        card.classList.add('is-playing');

        try {
            await video.play();
        } catch (error) {
            console.log("Video/audio blocked:", error);
        }

    });

    card.addEventListener('mouseleave', () => {

        video.pause();
        video.currentTime = 0;

        card.classList.remove('is-playing');

    });

});