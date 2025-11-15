/* =========================================================
   SUBSCRIPTION MANAGER v2 – RENEW + REMOVE + REUSABLE
   ========================================================= */
/*
   FEATURES:
   1. Live countdown (days left) → updates every load
   2. Color warnings: YELLOW (≤5 days), RED (past due)
   3. RENEW button → turns green, says "Done"
   4. REMOVE button → deletes row permanently
   5. All state saved in localStorage (renewed + removed)
   6. Dark mode toggle (system + manual)
   7. FULLY COMMENTED — every line explained
   8. REUSABLE — can be dropped into any table project
   --------------------------------------------------------- */

document.addEventListener('DOMContentLoaded', function () {
  // ---------------------------------------------------------------
  // 1. CONFIG: Table ID & Storage Keys (CHANGE IF REUSING)
  // ---------------------------------------------------------------
  const CONFIG = {
    tableId: 'paymentTable',           // ID of your <table>
    renewalsKey: 'subscriptionRenewals', // localStorage key for renewals
    removalsKey: 'subscriptionRemovals'  // localStorage key for removed items
  };

  // ---------------------------------------------------------------
  // 2. GET DOM ELEMENTS
  // ---------------------------------------------------------------
  const table = document.getElementById(CONFIG.tableId);
  if (!table) {
    console.error(`Table with ID "${CONFIG.tableId}" not found!`);
    return;
  }
  const rows = table.querySelectorAll('tbody tr'); // All data rows

  // ---------------------------------------------------------------
  // 3. TODAY'S DATE (Philippines Time – UTC+8)
  // ---------------------------------------------------------------
  const today = new Date(); // Uses browser's local time (PH)

  // ---------------------------------------------------------------
  // 4. LOAD SAVED STATE FROM BROWSER
  // ---------------------------------------------------------------
  const savedRenewals = JSON.parse(localStorage.getItem(CONFIG.renewalsKey)) || {};
  const savedRemovals = JSON.parse(localStorage.getItem(CONFIG.removalsKey)) || {};

  // ---------------------------------------------------------------
  // 5. PROCESS EACH ROW
  // ---------------------------------------------------------------
  rows.forEach(row => {
    // Get cells: [0]=Service, [1]=Username, [2]=Expires In, [3]=Payment Due, [4]=Action
    const cells = row.cells;
    if (cells.length < 5) return; // Skip invalid rows

    const serviceCell = cells[0];
    const usernameCell = cells[1];
    const expiresCell = cells[2];
    const dueCell = cells[3];
    const actionCell = cells[4];

    const serviceName = serviceCell.textContent.trim();

    // -------------------------------------------------------------
    // 6. SKIP IF ALREADY REMOVED
    // -------------------------------------------------------------
    if (savedRemovals[serviceName]) {
      row.remove(); // Delete from DOM
      return;
    }

    // -------------------------------------------------------------
    // 7. PARSE DUE DATE (e.g., "$9.99 on 25th Dec")
    // -------------------------------------------------------------
    const dueText = dueCell.textContent.trim();
    const cleanText = dueText
      .replace(/^\$\d+\.\d+\s+on\s+/i, '')  // Remove "$X.XX on "
      .replace(/\s*\(.*\)/g, '')           // Remove "(Test)"
      .trim();

    const dateParts = cleanText.split(/\s+/);
    if (dateParts.length < 2) return;

    const day = parseInt(dateParts[0].replace(/[^0-9]/g, ''), 10);
    const monthStr = dateParts[1].toLowerCase().slice(0, 3);
    const monthMap = { jan:0, feb:1, mar:2, apr:3, may:4, jun:5,
                       jul:6, aug:7, sep:8, oct:9, nov:10, dec:11 };
    const month = monthMap[monthStr];
    if (isNaN(day) || month === undefined) return;

    let year = today.getFullYear();
    if (dateParts.length > 2 && /^\d{4}$/.test(dateParts[2])) {
      year = parseInt(dateParts[2], 10);
    } else if (month < today.getMonth() || (month === today.getMonth() && day < today.getDate())) {
      year++; // Future year if date passed
    }

    const dueDate = new Date(year, month, day);

    // -------------------------------------------------------------
    // 8. CALCULATE DAYS LEFT
    // -------------------------------------------------------------
    const msPerDay = 1000 * 60 * 60 * 24;
    const diffMs = dueDate - today;
    const diffDays = Math.ceil(diffMs / msPerDay);

    // -------------------------------------------------------------
    // 9. CLEAR OLD CLASSES
    // -------------------------------------------------------------
    row.classList.remove('near-due', 'past-due', 'renewed');

    // -------------------------------------------------------------
    // 10. CHECK RENEWAL STATUS
    // -------------------------------------------------------------
    const isRenewed = savedRenewals[serviceName];

    // -------------------------------------------------------------
    // 11. APPLY WARNING COLORS
    // -------------------------------------------------------------
    if (!isRenewed) {
      if (diffDays < 0) {
        row.classList.add('past-due');
      } else if (diffDays <= 5) {
        row.classList.add('near-due');
      }
    }

    // -------------------------------------------------------------
    // 12. UPDATE "EXPIRES IN" COLUMN
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
    // 13. CLEAR ACTION CELL
    // -------------------------------------------------------------
    actionCell.innerHTML = ''; // Reset buttons

    // -------------------------------------------------------------
    // 14. ADD RENEW BUTTON
    // -------------------------------------------------------------
    const renewBtn = document.createElement('button');
    renewBtn.className = 'renew-btn';
    renewBtn.textContent = isRenewed ? 'Done' : 'Renew';
    renewBtn.disabled = isRenewed;

    if (!isRenewed) {
      renewBtn.addEventListener('click', function () {
        row.classList.remove('near-due', 'past-due');
        row.classList.add('renewed');
        expiresCell.textContent = 'Renewed!';
        renewBtn.textContent = 'Done';
        renewBtn.disabled = true;

        savedRenewals[serviceName] = true;
        localStorage.setItem(CONFIG.renewalsKey, JSON.stringify(savedRenewals));
      });
    }
    actionCell.appendChild(renewBtn);

    // -------------------------------------------------------------
    // 15. ADD REMOVE BUTTON (NEW!)
    // -------------------------------------------------------------
    const removeBtn = document.createElement('button');
    removeBtn.textContent = 'Remove';
    removeBtn.style.cssText = `
      background: #e74c3c; color: white; border: none; 
      margin-left: 8px; padding: 8px 12px; border-radius: 6px; 
      cursor: pointer; font-size: 0.9em;
    `;
    removeBtn.addEventListener('click', function () {
      if (confirm(`Remove "${serviceName}" permanently?`)) {
        row.remove();
        savedRemovals[serviceName] = true;
        delete savedRenewals[serviceName]; // Clean up
        localStorage.setItem(CONFIG.removalsKey, JSON.stringify(savedRemovals));
        localStorage.setItem(CONFIG.renewalsKey, JSON.stringify(savedRenewals));
      }
    });
    actionCell.appendChild(removeBtn);

    // -------------------------------------------------------------
    // 16. APPLY RENEWED STYLE IF NEEDED
    // -------------------------------------------------------------
    if (isRenewed) {
      row.classList.add('renewed');
    }
  });

  // ---------------------------------------------------------------
  // 17. MAKE MANAGER REUSABLE (FOR OTHER PROJECTS!)
  // ---------------------------------------------------------------
  window.SubscriptionManager = {
    init: function(tableId) {
      CONFIG.tableId = tableId;
      // Re-run logic on new table
      const newTable = document.getElementById(tableId);
      if (newTable) {
        // Reuse same logic
        const event = new Event('DOMContentLoaded');
        document.dispatchEvent(event);
      }
    }
  };

}); // END DOMContentLoaded

/* =========================================================
   DARK MODE TOGGLE – SYSTEM + MANUAL
   ========================================================= */
const toggleBtn = document.getElementById('darkModeToggle');
const body = document.body;

// Load saved preference or system default
if (localStorage.getItem('darkMode') === 'enabled' || 
    (!localStorage.getItem('darkMode') && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
  body.classList.add('dark-mode');
  toggleBtn.textContent = 'Light Mode';
}

toggleBtn.addEventListener('click', () => {
  body.classList.toggle('dark-mode');
  const isDark = body.classList.contains('dark-mode');
  toggleBtn.textContent = isDark ? 'Light Mode' : 'Dark Mode';
  localStorage.setItem('darkMode', isDark ? 'enabled' : 'disabled');
});

/* =========================================================
   END OF FILE – READY TO COMMIT!
   ========================================================= */


// /* =========================================================
//    SUBSCRIPTION MANAGER – RENEW BUTTON + SAVE TO BROWSER
//    ========================================================= */
// /* What this does:
//    1. Reads every row → calculates days left
//    2. Colors rows: YELLOW (≤5 days), RED (past due)
//    3. Updates "Expires In" with live countdown
//    4. Adds a RENEW button in the **Action** column
//    5. Click RENEW → burns green, says "Renewed!", button says "Done"
//    6. Saves all renewals to your browser (localStorage) → stays after refresh
//    --------------------------------------------------------- */

// document.addEventListener('DOMContentLoaded', function () {

//   // ---------------------------------------------------------------
//   // 1. Get the table and all data rows
//   // ---------------------------------------------------------------
//   const table = document.getElementById('paymentTable');
//   const rows  = table.querySelectorAll('tbody tr');

//   // Today's real date (Philippines time – UTC+8)
//   const today = new Date();

//   // ---------------------------------------------------------------
//   // 2. Load saved renewals from browser (if any)
//   // ---------------------------------------------------------------
//   const savedRenewals = JSON.parse(localStorage.getItem('subscriptionRenewals')) || {};

//   // ---------------------------------------------------------------
//   // 3. Process every subscription row
//   // ---------------------------------------------------------------
//   rows.forEach(row => {
//     // Get cells by index:
//     // 0 = Service, 1 = Username, 2 = Expires In, 3 = Payment Due, 4 = Action
//     const serviceCell = row.cells[0];
//     const expiresCell = row.cells[2];
//     const dueCell     = row.cells[3];
//     const actionCell  = row.cells[4];   // ← FIXED: 5th column = Action

//     if (!serviceCell || !dueCell || !actionCell) return;

//     const serviceName = serviceCell.textContent.trim();
//     const dueText     = dueCell.textContent.trim();

//     // -------------------------------------------------------------
//     // 4. Clean the due date text
//     // -------------------------------------------------------------
//     let cleanText = dueText
//       .replace(/^\$\d+\.\d+\s+on\s+/i, '')
//       .replace(/\s*\(.*\)/g, '')
//       .trim();

//     // -------------------------------------------------------------
//     // 5. Parse day, month, year
//     // -------------------------------------------------------------
//     const monthMap = { jan:0, feb:1, mar:2, apr:3, may:4, jun:5,
//                        jul:6, aug:7, sep:8, oct:9, nov:10, dec:11 };

//     const parts = cleanText.split(/\s+/);
//     if (parts.length < 2) return;

//     const dayStr = parts[0].replace(/[^0-9]/g, '');
//     const day = parseInt(dayStr, 10);
//     if (isNaN(day)) return;

//     const monthStr = parts[1].toLowerCase().slice(0, 3);
//     const monthNum = monthMap[monthStr];
//     if (monthNum === undefined) return;

//     let year = today.getFullYear();
//     if (parts.length > 2 && /^\d{4}$/.test(parts[2])) {
//       year = parseInt(parts[2], 10);
//     } else {
//       if (monthNum < today.getMonth()) {
//         year++;
//       } else if (monthNum === today.getMonth() && day < today.getDate()) {
//         // already passed
//       }
//     }

//     const dueDate = new Date(year, monthNum, day);

//     // -------------------------------------------------------------
//     // 6. Calculate days left
//     // -------------------------------------------------------------
//     const msPerDay = 1000 * 60 * 60 * 24;
//     const diffMs   = dueDate - today;
//     const diffDays = Math.ceil(diffMs / msPerDay);

//     // -------------------------------------------------------------
//     // 7. Remove old classes
//     // -------------------------------------------------------------
//     row.classList.remove('near-due', 'past-due', 'renewed');

//     // -------------------------------------------------------------
//     // 8. Check if renewed
//     // -------------------------------------------------------------
//     const isRenewed = savedRenewals[serviceName];

//     // -------------------------------------------------------------
//     // 9. Apply warning color
//     // -------------------------------------------------------------
//     if (!isRenewed) {
//       if (diffDays < 0) {
//         row.classList.add('past-due');
//       } else if (diffDays <= 5) {
//         row.classList.add('near-due');
//       }
//     }

//     // -------------------------------------------------------------
//     // 10. Update "Expires In"
//     // -------------------------------------------------------------
//     if (expiresCell) {
//       if (isRenewed) {
//         expiresCell.textContent = 'Renewed!';
//       } else if (diffDays < 0) {
//         expiresCell.textContent = 'Expired';
//       } else {
//         expiresCell.textContent = diffDays + (diffDays === 1 ? ' day' : ' days');
//       }
//     }

//     // -------------------------------------------------------------
//     // 11. ADD RENEW BUTTON
//     // -------------------------------------------------------------
//     let renewBtn = actionCell.querySelector('.renew-btn');
//     if (!renewBtn) {
//       renewBtn = document.createElement('button');
//       renewBtn.textContent = 'Renew';
//       renewBtn.className = 'renew-btn';
//       actionCell.appendChild(renewBtn);
//     }

//     // -------------------------------------------------------------
//     // 12. If already renewed → show "Done"
//     // -------------------------------------------------------------
//     if (isRenewed) {
//       row.classList.add('renewed');
//       renewBtn.textContent = 'Done';
//       renewBtn.disabled = true;
//     } else {
//       // -------------------------------------------------------------
//       // 13. Click → renew and save
//       // -------------------------------------------------------------
//       renewBtn.addEventListener('click', function () {
//         row.classList.remove('near-due', 'past-due');
//         row.classList.add('renewed');
//         if (expiresCell) expiresCell.textContent = 'Renewed!';
//         renewBtn.textContent = 'Done';
//         renewBtn.disabled = true;

//         savedRenewals[serviceName] = true;
//         localStorage.setItem('subscriptionRenewals', JSON.stringify(savedRenewals));
//       });
//     }
//   });

// }); // end DOMContentLoaded

// /* =========================================================
//    DARK MODE TOGGLE
//    ========================================================= */
// const toggleBtn = document.getElementById('darkModeToggle');
// const body = document.body;

// // Check saved preference
// if (localStorage.getItem('darkMode') === 'enabled' || 
//     (!localStorage.getItem('darkMode') && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
//   body.classList.add('dark-mode');
//   toggleBtn.textContent = 'Light Mode';
// }

// // Toggle click
// toggleBtn.addEventListener('click', () => {
//   body.classList.toggle('dark-mode');
//   const isDark = body.classList.contains('dark-mode');
//   toggleBtn.textContent = isDark ? 'Light Mode' : 'Dark Mode';
//   localStorage.setItem('darkMode', isDark ? 'enabled' : 'disabled');
// });

// /* =========================================================
//    END OF FILE
//    ========================================================= */
