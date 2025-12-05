/**
 * =====================================================
 * MING'S FOOD HUB - Mobile Tap Support
 * Enables tap-to-expand cards on touch devices
 * (Hover doesn't exist on mobile, so we use click)
 * =====================================================
 */

document.addEventListener("DOMContentLoaded", function () {
  // Select all menu cards
  const cards = document.querySelectorAll('.card');

  cards.forEach(card => {
    // Only activate tap behavior on mobile/small screens
    card.addEventListener('click', function (e) {
      if (window.innerWidth <= 768) {
        // Toggle .active class to show long description
        this.classList.toggle('active');
        
        // Optional: Prevent accidental link navigation if added later
        e.preventDefault();
      }
    });
  });

  // Optional: Remove .active class when resizing to desktop (prevents stuck state)
  window.addEventListener('resize', function () {
    if (window.innerWidth > 768) {
      cards.forEach(card => card.classList.remove('active'));
    }
  });
});