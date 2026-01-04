// script.js - Pagination for SZA SOS + Lana (3 pages)

const page1 = document.getElementById('page1');
const page2 = document.getElementById('page2');
const page3 = document.getElementById('page3');
const prevBtn = document.getElementById('prev-page');
const nextBtn = document.getElementById('next-page');
const pageInfo = document.getElementById('page-info');

let currentPage = 1;
const totalPages = 3;

function updatePage() {
    page1.style.display = currentPage === 1 ? 'grid' : 'none';
    page2.style.display = currentPage === 2 ? 'grid' : 'none';
    page3.style.display = currentPage === 3 ? 'grid' : 'none';

    pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;

    // Disable Previous on page 1, Next on last page
    prevBtn.style.pointerEvents = currentPage === 1 ? 'none' : 'auto';
    prevBtn.style.opacity = currentPage === 1 ? '0.5' : '1';
    nextBtn.style.pointerEvents = currentPage === totalPages ? 'none' : 'auto';
    nextBtn.style.opacity = currentPage === totalPages ? '0.5' : '1';
}

nextBtn.addEventListener('click', (e) => {
    e.preventDefault();
    if (currentPage < totalPages) {
        currentPage++;
        updatePage();
    }
});

prevBtn.addEventListener('click', (e) => {
    e.preventDefault();
    if (currentPage > 1) {
        currentPage--;
        updatePage();
    }
});

// Start on Page 1
updatePage();