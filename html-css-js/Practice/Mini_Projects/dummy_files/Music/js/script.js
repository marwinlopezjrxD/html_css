// Back to Top button functionality

window.onscroll = function() {
    if (document.body.scrollTop > 300 || document.documentElement.scrollTop > 300) {
        document.getElementById("backToTop").style.display = "block";
    } else {
        document.getElementById("backToTop").style.display = "none";
    }
};

function topFunction() {
    window.scrollTo({top: 0, behavior: 'smooth'});
}