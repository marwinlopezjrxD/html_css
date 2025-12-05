/**
 * =====================================================
 * MING'S FOOD HUB - Mobile Tap + Typewriter Support
 * 
 * Features:
 *  - Tap to expand on mobile
 *  - Smooth typewriter effect when description appears
 *  - Resets animation cleanly when closing
 * 
 * How it works:
 *  - On hover (desktop): Triggers typewriter
 *  - On tap (mobile): Toggles .active class + typewriter
 *  - Uses DOMContentLoaded to ensure everything loads first
 * =====================================================
 */

document.addEventListener("DOMContentLoaded", function () {
  // Select all menu cards
  const cards = document.querySelectorAll('.card');

  // Function to start typewriter animation on a specific span
  function startTypewriter(typewriterSpan) {
    if (!typewriterSpan) return; // Safety check
    
    // Reset animation to restart it fresh
    typewriterSpan.style.animation = 'none';
    typewriterSpan.offsetHeight; // Force reflow (browser trick to restart CSS animation)
    typewriterSpan.style.animation = 'typing 3s steps(45, end) forwards, blink 0.75s step-end infinite';
  }

  cards.forEach(card => {
    // Find the typewriter span inside this card
    const typewriterSpan = card.querySelector('.typewriter');

    // Desktop: Hover → start typewriter
    card.addEventListener('mouseenter', function () {
      if (window.innerWidth > 768) { // Only on desktop
        startTypewriter(typewriterSpan);
      }
    });

    // Mobile: Tap → toggle active + start typewriter
    card.addEventListener('click', function (e) {
      if (window.innerWidth <= 768) { // Only on mobile/tablet
        this.classList.toggle('active');
        if (this.classList.contains('active')) {
          startTypewriter(typewriterSpan);
        }
        e.preventDefault(); // Prevent any default link behavior
      }
    });

    // Desktop: Leave hover → reset typewriter
    card.addEventListener('mouseleave', function () {
      if (window.innerWidth > 768 && typewriterSpan) {
        typewriterSpan.style.animation = 'none';
      }
    });
  });

  // Clean up: Remove .active class when resizing to desktop (prevents stuck state)
  window.addEventListener('resize', function () {
    if (window.innerWidth > 768) {
      cards.forEach(card => card.classList.remove('active'));
    }
  });

  // Optional: Console log for debugging (remove in production)
  console.log('Ming\'s Food Hub loaded! Hover or tap for typewriter magic. 🚀');
});