// Gallery Lightbox Script - Dedicated to Leyah ♡
// Optimized, clean, and blazing fast

function openLightbox(src) {
    // Set the clicked image as lightbox source
    document.getElementById('lightbox-img').src = src;
    // Show the lightbox
    document.getElementById('lightbox').classList.add('active');
}

function closeLightbox() {
    // Hide the lightbox
    document.getElementById('lightbox').classList.remove('active');
}

// Close lightbox when clicking outside image or pressing Escape
document.getElementById('lightbox').addEventListener('click', function(e) {
    if (e.target === this || e.target.classList.contains('close-lightbox')) {
        closeLightbox();
    }
});

document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') closeLightbox();
});