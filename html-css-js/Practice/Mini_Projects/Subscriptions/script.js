/* =========================================================
   SUBSCRIPTION MANAGER – RENEW + REMOVE + EXPIRED BUTTON
   ========================================================= */
/*
   This script adds interactive features to your subscription table:
   - Calculates days until payment is due
   - Colors rows: yellow (≤5 days), red (expired)
   - Adds "Renew" and "Remove" buttons
   - Saves renewals and removals using localStorage
   - Updates "Expires In" column in real time
   - Works with dark mode toggle
   --------------------------------------------------------- */

document.addEventListener('DOMContentLoaded', function () {
  // ---------------------------------------------------------------
  // 1. CONFIG: Settings for table and storage
  // ---------------------------------------------------------------
  const CONFIG = {
    tableId: 'paymentTable',           // ID of the subscription table in HTML
    renewalsKey: 'subscriptionRenewals', // localStorage key for renewed items
    removalsKey: 'subscriptionRemovals'  // localStorage key for removed items
  };

  // Get the table element by its ID
  const table = document.getElementById(CONFIG.tableId);
  if (!table) {
    console.error(`Table with ID "${CONFIG.tableId}" not found!`);
    return;
  }

  // Select all rows inside <tbody>
  const rows = table.querySelectorAll('tbody tr');

  // Get current date (uses browser's local time)
  const today = new Date();

  // Load saved data from localStorage
  const savedRenewals = JSON.parse(localStorage.getItem(CONFIG.renewalsKey)) || {};
  const savedRemovals = JSON.parse(localStorage.getItem(CONFIG.removalsKey)) || {};

  // ---------------------------------------------------------------
  // 2. PROCESS EACH ROW
  // ---------------------------------------------------------------
  rows.forEach(row => {
    const cells = row.cells;
    if (cells.length < 5) return; // Skip if row is incomplete

    // Map cells to meaningful variables
    const serviceCell = cells[0];  // e.g., "Spotify Shared Plan"
    const usernameCell = cells[1]; // e.g., "Fergus2k8" or empty
    const expiresCell = cells[2];  // Will be updated with days/Expired
    const dueCell = cells[3];      // e.g., "$0.95 on 25th Dec"
    const actionCell = cells[4];   // Where buttons go

    const serviceName = serviceCell.textContent.trim();

    // Remove row if it was previously deleted
    if (savedRemovals[serviceName]) {
      row.remove();
      return;
    }

    // -------------------------------------------------------------
    // 3. EXTRACT AND CLEAN DUE DATE
    // -------------------------------------------------------------
    const dueText = dueCell.textContent.trim();
    const cleanText = dueText
      .replace(/^\$\d+\.\d+\s+on\s+/i, '')  // Remove price and "on"
      .replace(/\s*\(.*\)/g, '')           // Remove (Test), (Test Date), etc.
      .trim();

    const dateParts = cleanText.split(/\s+/);
    if (dateParts.length < 2) return;

    // Parse day (remove "th", "st", etc.)
    const day = parseInt(dateParts[0].replace(/[^0-9]/g, ''), 10);
    const monthStr = dateParts[1].toLowerCase().slice(0, 3);

    // Map month names to numbers (0 = Jan, 11 = Dec)
    const monthMap = {
      jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5,
      jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11
    };
    const month = monthMap[monthStr];
    if (isNaN(day) || month === undefined) return;

    // Determine year
    let year = today.getFullYear();
    if (dateParts.length > 2 && /^\d{4}$/.test(dateParts[2])) {
      year = parseInt(dateParts[2], 10);
    } else if (month < today.getMonth() || (month === today.getMonth() && day < today.getDate())) {
      year++;
    }

    const dueDate = new Date(year, month, day);

    // -------------------------------------------------------------
    // 4. CALCULATE DAYS REMAINING
    // -------------------------------------------------------------
    const msPerDay = 1000 * 60 * 60 * 24;
    const diffMs = dueDate - today;
    const diffDays = Math.ceil(diffMs / msPerDay);

    // Remove any existing status classes
    row.classList.remove('near-due', 'past-due', 'renewed');

    // Check if already renewed
    const isRenewed = savedRenewals[serviceName];

    // Apply warning colors if not renewed
    if (!isRenewed) {
      if (diffDays < 0) {
        row.classList.add('past-due');
      } else if (diffDays <= 5) {
        row.classList.add('near-due');
      }
    }

    // -------------------------------------------------------------
    // 5. UPDATE "EXPIRES IN" COLUMN
    // -------------------------------------------------------------
    if (expiresCell) {
      if (isRenewed) {
        expiresCell.textContent = 'Renewed!';
      } else if (diffDays < 0) {
        expiresCell.textContent = 'Expired';
      } else {
        expiresCell.textContent = diffDays + (diffDays === 1 ? ' day' : ' days');
      }
    }

    // Clear action cell
    actionCell.innerHTML = '';

    // -------------------------------------------------------------
    // 6. ADD RENEW BUTTON
    // -------------------------------------------------------------
    const renewBtn = document.createElement('button');
    renewBtn.className = 'renew-btn';

    if (isRenewed) {
      renewBtn.textContent = 'Done';
      renewBtn.disabled = true;
      row.classList.add('renewed');
    } else if (diffDays < 0) {
      renewBtn.textContent = 'Renew Now';
      renewBtn.style.backgroundColor = '#ff9800';
      renewBtn.style.color = 'white';
    } else {
      renewBtn.textContent = 'Renew';
    }

    if (!isRenewed) {
      renewBtn.addEventListener('click', function () {
        row.classList.remove('near-due', 'past-due');
        row.classList.add('renewed');
        expiresCell.textContent = 'Renewed!';
        renewBtn.textContent = 'Done';
        renewBtn.disabled = true;
        renewBtn.style.backgroundColor = '';

        savedRenewals[serviceName] = true;
        localStorage.setItem(CONFIG.renewalsKey, JSON.stringify(savedRenewals));
      });
    }
    actionCell.appendChild(renewBtn);

    // -------------------------------------------------------------
    // 7. ADD REMOVE BUTTON
    // -------------------------------------------------------------
    const removeBtn = document.createElement('button');
    removeBtn.textContent = 'Remove';
    removeBtn.className = 'remove-btn';

    removeBtn.addEventListener('click', function () {
      if (confirm(`Remove "${serviceName}" permanently?`)) {
        row.remove();
        savedRemovals[serviceName] = true;
        delete savedRenewals[serviceName];
        localStorage.setItem(CONFIG.removalsKey, JSON.stringify(savedRemovals));
        localStorage.setItem(CONFIG.renewalsKey, JSON.stringify(savedRenewals));
      }
    });
    actionCell.appendChild(removeBtn);
  });
});

/* =========================================================
   DARK MODE TOGGLE
   ========================================================= */
// Get toggle button and body
const toggleBtn = document.getElementById('darkModeToggle');
const body = document.body;

// Check saved preference or system default
if (
  localStorage.getItem('darkMode') === 'enabled' ||
  (!localStorage.getItem('darkMode') && window.matchMedia('(prefers-color-scheme: dark)').matches)
) {
  body.classList.add('dark-mode');
  toggleBtn.textContent = 'Light Mode';
}

// Toggle on click
toggleBtn.addEventListener('click', () => {
  body.classList.toggle('dark-mode');
  const isDark = body.classList.contains('dark-mode');
  toggleBtn.textContent = isDark ? 'Light Mode' : 'Dark Mode';
  localStorage.setItem('darkMode', isDark ? 'enabled' : 'disabled');
});

/* =========================================================
   END OF FILE
   ========================================================= */