/* =========================================================
   SUBSCRIPTION MANAGER – RENEW BUTTON + SAVE TO BROWSER
   ========================================================= */
/* What this does:
   1. Reads every row → calculates days left
   2. Colors rows: YELLOW (≤5 days), RED (past due)
   3. Updates "Expires In" with live countdown
   4. Adds a RENEW button in the **Action** column
   5. Click RENEW → burns green, says "Renewed!", button says "Done"
   6. Saves all renewals to your browser (localStorage) → stays after refresh
   --------------------------------------------------------- */

document.addEventListener('DOMContentLoaded', function () {

  // ---------------------------------------------------------------
  // 1. Get the table and all data rows
  // ---------------------------------------------------------------
  const table = document.getElementById('paymentTable');
  const rows  = table.querySelectorAll('tbody tr');

  // Today's real date (Philippines time – UTC+8)
  const today = new Date();

  // ---------------------------------------------------------------
  // 2. Load saved renewals from browser (if any)
  // ---------------------------------------------------------------
  const savedRenewals = JSON.parse(localStorage.getItem('subscriptionRenewals')) || {};

  // ---------------------------------------------------------------
  // 3. Process every subscription row
  // ---------------------------------------------------------------
  rows.forEach(row => {
    // Get cells by index:
    // 0 = Service, 1 = Username, 2 = Expires In, 3 = Payment Due, 4 = Action
    const serviceCell = row.cells[0];
    const expiresCell = row.cells[2];
    const dueCell     = row.cells[3];
    const actionCell  = row.cells[4];   // ← FIXED: 5th column = Action

    if (!serviceCell || !dueCell || !actionCell) return;

    const serviceName = serviceCell.textContent.trim();
    const dueText     = dueCell.textContent.trim();

    // -------------------------------------------------------------
    // 4. Clean the due date text
    // -------------------------------------------------------------
    let cleanText = dueText
      .replace(/^\$\d+\.\d+\s+on\s+/i, '')
      .replace(/\s*\(.*\)/g, '')
      .trim();

    // -------------------------------------------------------------
    // 5. Parse day, month, year
    // -------------------------------------------------------------
    const monthMap = { jan:0, feb:1, mar:2, apr:3, may:4, jun:5,
                       jul:6, aug:7, sep:8, oct:9, nov:10, dec:11 };

    const parts = cleanText.split(/\s+/);
    if (parts.length < 2) return;

    const dayStr = parts[0].replace(/[^0-9]/g, '');
    const day = parseInt(dayStr, 10);
    if (isNaN(day)) return;

    const monthStr = parts[1].toLowerCase().slice(0, 3);
    const monthNum = monthMap[monthStr];
    if (monthNum === undefined) return;

    let year = today.getFullYear();
    if (parts.length > 2 && /^\d{4}$/.test(parts[2])) {
      year = parseInt(parts[2], 10);
    } else {
      if (monthNum < today.getMonth()) {
        year++;
      } else if (monthNum === today.getMonth() && day < today.getDate()) {
        // already passed
      }
    }

    const dueDate = new Date(year, monthNum, day);

    // -------------------------------------------------------------
    // 6. Calculate days left
    // -------------------------------------------------------------
    const msPerDay = 1000 * 60 * 60 * 24;
    const diffMs   = dueDate - today;
    const diffDays = Math.ceil(diffMs / msPerDay);

    // -------------------------------------------------------------
    // 7. Remove old classes
    // -------------------------------------------------------------
    row.classList.remove('near-due', 'past-due', 'renewed');

    // -------------------------------------------------------------
    // 8. Check if renewed
    // -------------------------------------------------------------
    const isRenewed = savedRenewals[serviceName];

    // -------------------------------------------------------------
    // 9. Apply warning color
    // -------------------------------------------------------------
    if (!isRenewed) {
      if (diffDays < 0) {
        row.classList.add('past-due');
      } else if (diffDays <= 5) {
        row.classList.add('near-due');
      }
    }

    // -------------------------------------------------------------
    // 10. Update "Expires In"
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

    // -------------------------------------------------------------
    // 11. ADD RENEW BUTTON
    // -------------------------------------------------------------
    let renewBtn = actionCell.querySelector('.renew-btn');
    if (!renewBtn) {
      renewBtn = document.createElement('button');
      renewBtn.textContent = 'Renew';
      renewBtn.className = 'renew-btn';
      actionCell.appendChild(renewBtn);
    }

    // -------------------------------------------------------------
    // 12. If already renewed → show "Done"
    // -------------------------------------------------------------
    if (isRenewed) {
      row.classList.add('renewed');
      renewBtn.textContent = 'Done';
      renewBtn.disabled = true;
    } else {
      // -------------------------------------------------------------
      // 13. Click → renew and save
      // -------------------------------------------------------------
      renewBtn.addEventListener('click', function () {
        row.classList.remove('near-due', 'past-due');
        row.classList.add('renewed');
        if (expiresCell) expiresCell.textContent = 'Renewed!';
        renewBtn.textContent = 'Done';
        renewBtn.disabled = true;

        savedRenewals[serviceName] = true;
        localStorage.setItem('subscriptionRenewals', JSON.stringify(savedRenewals));
      });
    }
  });

}); // end DOMContentLoaded

/* =========================================================
   DARK MODE TOGGLE
   ========================================================= */
const toggleBtn = document.getElementById('darkModeToggle');
const body = document.body;

// Check saved preference
if (localStorage.getItem('darkMode') === 'enabled' || 
    (!localStorage.getItem('darkMode') && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
  body.classList.add('dark-mode');
  toggleBtn.textContent = 'Light Mode';
}

// Toggle click
toggleBtn.addEventListener('click', () => {
  body.classList.toggle('dark-mode');
  const isDark = body.classList.contains('dark-mode');
  toggleBtn.textContent = isDark ? 'Light Mode' : 'Dark Mode';
  localStorage.setItem('darkMode', isDark ? 'enabled' : 'disabled');
});

/* =========================================================
   END OF FILE
   ========================================================= */