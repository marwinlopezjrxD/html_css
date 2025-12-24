// script.js - Back to Top button functionality (shared for all pages)

// Show/hide the button when scrolling
window.onscroll = function() {
    if (document.body.scrollTop > 300 || document.documentElement.scrollTop > 300) {
        document.getElementById("backToTop").style.display = "block";
    } else {
        document.getElementById("backToTop").style.display = "none";
    }
};

// Smooth scroll to top when button is clicked
function topFunction() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}