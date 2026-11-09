/**
 * employees.js - Fetches and renders employee cards from JSONPlaceholder API
 * API Endpoint: https://jsonplaceholder.typicode.com/users
 */

(function () {
  'use strict';

  const API_URL = 'https://jsonplaceholder.typicode.com/users';

  // DOM Elements
  const loadingElement = document.getElementById('loading-state');
  const errorElement = document.getElementById('error-state');
  const errorMessageElement = document.getElementById('error-message');
  const retryButton = document.getElementById('retry-btn');
  const gridElement = document.getElementById('employees-grid');
  const countBadge = document.getElementById('employees-count');

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  function init() {
    if (retryButton) {
      retryButton.addEventListener('click', fetchEmployees);
    }
    fetchEmployees();
  }

  /**
   * Helper function to safely escape HTML strings
   */
  function escapeHtml(str) {
    if (str === null || str === undefined) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  /**
   * Generates 1-2 letter initials from a person's full name
   */
  function getInitials(name) {
    if (!name) return 'U';
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) {
      return parts[0].substring(0, 2).toUpperCase();
    }
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }

  /**
   * Fetches employee data from JSONPlaceholder API using fetch()
   */
  async function fetchEmployees() {
    // Show loading state, hide error and grid
    if (loadingElement) loadingElement.classList.remove('hidden');
    if (errorElement) errorElement.classList.add('hidden');
    if (gridElement) {
      gridElement.classList.add('hidden');
      gridElement.innerHTML = '';
    }
    if (countBadge) countBadge.textContent = '...';

    try {
      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error(`სერვერმა დააბრუნა სტატუსი: ${response.status} (${response.statusText})`);
      }

      const employees = await response.json();

      if (!Array.isArray(employees) || employees.length === 0) {
        throw new Error('თანამშრომელთა სია ცარიელია.');
      }

      renderEmployees(employees);

      // Hide loading and show grid
      if (loadingElement) loadingElement.classList.add('hidden');
      if (gridElement) gridElement.classList.remove('hidden');
      if (countBadge) countBadge.textContent = `${employees.length} თანამშრომელი`;

    } catch (error) {
      console.error('Error fetching employees:', error);
      showError(error.message || 'ვერ მოხერხდა მონაცემების მიღება. გთხოვთ შეამოწმოთ ინტერნეტ კავშირი.');
    }
  }

  /**
   * Displays the error message container
   */
  function showError(message) {
    if (loadingElement) loadingElement.classList.add('hidden');
    if (gridElement) gridElement.classList.add('hidden');
    if (errorMessageElement) errorMessageElement.textContent = message;
    if (errorElement) errorElement.classList.remove('hidden');
    if (countBadge) countBadge.textContent = 'შეცდომა';
  }

  /**
   * Renders the array of employee objects into responsive cards
   */
  function renderEmployees(employees) {
    if (!gridElement) return;

    gridElement.innerHTML = '';

    employees.forEach(function (emp) {
      const name = emp.name || 'უცნობი თანამშრომელი';
      const username = emp.username || 'user';
      const email = emp.email || 'N/A';
      const city = emp.address && emp.address.city ? emp.address.city : 'N/A';
      const phone = emp.phone || 'N/A';
      const company = emp.company && emp.company.name ? emp.company.name : 'N/A';
      const initials = getInitials(name);

      const card = document.createElement('article');
      card.className =
        'bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs hover:shadow-md hover:border-indigo-300 transition-all duration-200 flex flex-col justify-between group';

      card.innerHTML = `
        <div>
          <!-- ბარათის ზედა ნაწილი: ინიციალები და მომხმარებლის სახელი -->
          <div class="flex items-start justify-between gap-3 mb-4">
            <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-700 text-white font-bold text-base flex items-center justify-center shadow-xs shrink-0 group-hover:scale-105 transition-transform duration-200" aria-hidden="true">
              ${escapeHtml(initials)}
            </div>
            <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200/60" title="მომხმარებლის სახელი (Username)">
              <i class="fa-solid fa-at text-[10px] text-indigo-500" aria-hidden="true"></i>
              <span>${escapeHtml(username)}</span>
            </span>
          </div>

          <!-- სახელი და კომპანია -->
          <h3 class="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
            ${escapeHtml(name)}
          </h3>
          <p class="text-xs font-medium text-slate-500 mb-4 flex items-center gap-1.5 mt-1" title="კომპანია">
            <i class="fa-solid fa-building text-slate-400" aria-hidden="true"></i>
            <span>${escapeHtml(company)}</span>
          </p>

          <!-- დეტალური საკონტაქტო მონაცემები -->
          <ul class="space-y-2.5 pt-3 border-t border-slate-100 text-xs sm:text-sm">
            <!-- ელ-ფოსტა -->
            <li class="flex items-center gap-2.5 text-slate-600">
              <span class="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0" aria-hidden="true">
                <i class="fa-solid fa-envelope text-xs"></i>
              </span>
              <a href="mailto:${encodeURIComponent(email)}" class="text-indigo-600 hover:text-indigo-800 hover:underline truncate font-medium" title="ელ-ფოსტის გაგზავნა">
                ${escapeHtml(email)}
              </a>
            </li>

            <!-- ტელეფონის ნომერი -->
            <li class="flex items-center gap-2.5 text-slate-600">
              <span class="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0" aria-hidden="true">
                <i class="fa-solid fa-phone text-xs"></i>
              </span>
              <a href="tel:${escapeHtml(phone)}" class="text-slate-700 hover:text-emerald-700 hover:underline truncate font-medium" title="დარეკვა">
                ${escapeHtml(phone)}
              </a>
            </li>

            <!-- ქალაქი -->
            <li class="flex items-center gap-2.5 text-slate-600">
              <span class="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0" aria-hidden="true">
                <i class="fa-solid fa-location-dot text-xs"></i>
              </span>
              <span class="text-slate-700 truncate font-medium" title="ქალაქი">
                ${escapeHtml(city)}
              </span>
            </li>
          </ul>
        </div>

        <!-- ბარათის ქვედა ნაწილი -->
        <div class="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
          <span class="inline-flex items-center gap-1.5 text-emerald-600 font-medium">
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>აქტიური</span>
          </span>
          <span class="font-mono text-slate-400">ID: #${emp.id || '-'}</span>
        </div>
      `;

      gridElement.appendChild(card);
    });
  }
})();

