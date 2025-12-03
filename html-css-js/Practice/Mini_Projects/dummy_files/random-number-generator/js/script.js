/**
 * Saturn Based Theme Random Number Generator – Odd Number Edition (1, 3, 5, 7, 9 only)
 * Purpose: Randomly assign a daily running distance from the allowed odd values
 * Future-proof: Easy to extend to two-digit odd numbers in 2026+
 * Author: ME
 * Version: 1.0.0
 */

 // DOM element references – cached for performance and clarity
const kmDisplay    = document.getElementById('kmDisplay');      // Card that holds the number
const kmNumber     = kmDisplay.querySelector('.km-number');     // The actual changing digit(s)
const generateBtn  = document.getElementById('generateBtn');    // Trigger button
const container    = document.querySelector('.container');      // Main content wrapper for entrance animation

// Allowed distances – strictly odd numbers only (single digit for 2025)
const oddDistances = [1, 3, 5, 7, 9];

/**
 * Generates a new random odd KM value and updates the UI with smooth animation
 */
generateBtn.addEventListener('click', () => {
  // 1. Scale down the card slightly for visual feedback
  kmDisplay.style.transform = 'scale(0.92)';
  kmDisplay.style.transition = 'transform 0.2s ease';

  // 2. Fade out the current number
  kmNumber.style.opacity = '0';
  kmNumber.style.transition = 'opacity 0.25s ease';

  // 3. After a short delay, reveal the new random distance
  setTimeout(() => {
    // Select random index from oddDistances array
    const randomIndex = Math.floor(Math.random() * oddDistances.length);
    const newDistance = oddDistances[randomIndex];

    // Update the displayed number
    kmNumber.textContent = newDistance;

    // Fade the new number back in
    kmNumber.style.opacity = '1';

    // Return card to original size with smooth spring-back feel
    kmDisplay.style.transform = 'scale(1)';
  }, 320); // Timing synchronized with CSS transitions
});

/**
 * Page load entrance animation
 * Adds the 'loaded' class to trigger the CSS-based fade-in + scale animation
 */
window.addEventListener('load', () => {
  // Small delay ensures DOM is fully painted before animation starts
  setTimeout(() => {
    container.classList.add('loaded');
  }, 150);
});

/**
 * FUTURE EXTENSION (2026+)
 * When ready for two-digit odd numbers, simply replace or extend the array:
 * 
 * const oddDistances = [1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21, 23, 25, 27, 29];
 * 
 * Or make it dynamic:
 * const year = new Date().getFullYear();
 * const max = year >= 2026 ? 29 : 9;
 * const oddDistances = Array.from({length: (max+1)/2}, (_, i) => 1 + i * 2);
 */

 // End of script – clean, fast, and ready for deployment