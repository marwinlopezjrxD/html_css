// Back to Top functionality

// Show the button when user scrolls down 300px from the top
window.onscroll = function() {
    if (document.body.scrollTop > 300 || document.documentElement.scrollTop > 300) {
        document.getElementById("backToTop").style.display = "block";
    } else {
        document.getElementById("backToTop").style.display = "none";
    }
};

// When the user clicks the button, scroll smoothly to the top
function topFunction() {
    window.scrollTo({top: 0, behavior: 'smooth'});
}