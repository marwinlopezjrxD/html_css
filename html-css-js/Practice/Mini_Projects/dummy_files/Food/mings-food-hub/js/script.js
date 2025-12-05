/**
 * =====================================================
 * MING'S FOOD HUB - Mobile Tap Support Only
 * Only needed for tap-to-expand on phones/tablets
 * Desktop uses pure CSS hover → super smooth
 * =====================================================
 */

document.addEventListener("DOMContentLoaded", function () {
  const cards = document.querySelectorAll('.card');

  cards.forEach(card => {
    card.addEventListener('click', function (e) {
      if (window.innerWidth <= 768) {
        this.classList.toggle('active');
        e.preventDefault();
      }
    });
  });

  // Remove active state when switching to desktop
  window.addEventListener('resize', function () {
    if (window.innerWidth > 768) {
      cards.forEach(card => card.classList.remove('active'));
    }
  });
});