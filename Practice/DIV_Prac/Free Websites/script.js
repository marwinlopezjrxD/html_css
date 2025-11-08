// ========================================================
// MAKE THE "YOUR TURN" CLOUD CHANGE ON CLICK
// ========================================================

// Get the interactive cloud by its ID
const interactiveDiv = document.getElementById('interactiveDiv');

// Listen for clicks
interactiveDiv.addEventListener('click', function() {
  // Toggle a class that changes style
  this.classList.toggle('clicked');

  // Optional: change text
  const paragraph = this.querySelector('p');
  if (this.classList.contains('clicked')) {
    paragraph.textContent = 'Wow! You clicked me! 🎉 Now I’m bigger and greener!';
  } else {
    paragraph.textContent = 'Click this cloud to change its color and size.';
  }
});

// ========================================================
// ADD A NEW CLASS FOR CLICKED STATE (in CSS below)
// ========================================================

// We define the .clicked style directly in CSS (see below)
// But here's a fallback in case you want JS-only:
// interactiveDiv.style.background = '#A5D6A7'; etc.