/**
 * MING'S FOOD HUB - Mobile + Typewriter Animation
 * Triggers typewriter effect on hover (desktop) and tap (mobile)
 */

document.addEventListener("DOMContentLoaded", function () {
  const cards = document.querySelectorAll('.card');

  function startTypewriter(span) {
    if (!span) return;
    span.style.animation = 'none';
    span.offsetHeight; // Force reflow
    span.style.animation = 'typing 3.5s steps(60, end) forwards, blink 0.75s infinite';
  }

  cards.forEach(card => {
    const typewriter = card.querySelector('.typewriter');

    card.addEventListener('mouseenter', () => {
      if (window.innerWidth > 768) startTypewriter(typewriter);
    });

    card.addEventListener('click', function (e) {
      if (window.innerWidth <= 768) {
        this.classList.toggle('active');
        if (this.classList.contains('active')) startTypewriter(typewriter);
        e.preventDefault();
      }
    });

    card.addEventListener('mouseleave', () => {
      if (window.innerWidth > 768 && typewriter) {
        typewriter.style.animation = 'none';
      }
    });
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
      document.querySelectorAll('.card.active').forEach(c => c.classList.remove('active'));
    }
  });
});