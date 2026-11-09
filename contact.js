/**
 * contact.js - Handles contact form submission via HTTP POST to JSONPlaceholder API
 * API Endpoint: https://jsonplaceholder.typicode.com/posts
 */

(function () {
  'use strict';

  const POST_API_URL = 'https://jsonplaceholder.typicode.com/posts';

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initContactForm);
  } else {
    initContactForm();
  }

  function initContactForm() {
    const form = document.getElementById('contact-form') || document.querySelector('#contact-form-section form');
    const statusBox = document.getElementById('form-status');

    if (!form) return;

    const submitBtn = form.querySelector('button[type="submit"]');
    const resetBtn = form.querySelector('button[type="reset"]');
    const originalSubmitBtnHtml = submitBtn ? submitBtn.innerHTML : '<span>შეტყობინების გაგზავნა</span>';

    // Clear status message when form is reset
    if (resetBtn && statusBox) {
      resetBtn.addEventListener('click', function () {
        hideStatus();
      });
    }

    form.addEventListener('submit', async function (event) {
      event.preventDefault();

      // Trigger native HTML5 validation
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      // Collect form data values
      const fullname = (document.getElementById('fullname')?.value || '').trim();
      const email = (document.getElementById('email')?.value || '').trim();
      const phone = (document.getElementById('phone')?.value || '').trim();
      const topicSelect = document.getElementById('topic');
      const topicValue = topicSelect ? topicSelect.value : '';
      const topicText = topicSelect && topicSelect.selectedIndex >= 0 ? topicSelect.options[topicSelect.selectedIndex].text : topicValue;
      const contactMethodInput = form.querySelector('input[name="contact-method"]:checked');
      const contactMethod = contactMethodInput ? contactMethodInput.value : 'email';
      const message = (document.getElementById('message')?.value || '').trim();
      const agreement = !!document.getElementById('agreement')?.checked;

      // Prepare payload to send as JSON
      const postData = {
        title: `შეტყობინება: ${fullname} (${topicText})`,
        body: message,
        fullname: fullname,
        email: email,
        phone: phone,
        topic: topicText,
        contactMethod: contactMethod,
        agreement: agreement,
        userId: 1
      };

      // Set loading state on submit button
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.classList.add('opacity-75', 'cursor-not-allowed');
        submitBtn.innerHTML = `
          <i class="fa-solid fa-circle-notch fa-spin text-sm" aria-hidden="true"></i>
          <span>იგზავნება...</span>
        `;
      }
      hideStatus();

      try {
        const response = await fetch(POST_API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json; charset=UTF-8'
          },
          body: JSON.stringify(postData)
        });

        if (!response.ok) {
          throw new Error(`სერვერმა დააბრუნა სტატუსი: ${response.status} (${response.statusText})`);
        }

        const data = await response.json();
        console.log('JSONPlaceholder POST Success:', data);

        // Show detailed success message explaining simulation
        showSuccessMessage(data);

        // Reset the form upon successful submission
        form.reset();

      } catch (error) {
        console.error('Contact form submission error:', error);
        showErrorMessage(error.message || 'ვერ მოხერხდა შეტყობინების გაგზავნა. გთხოვთ შეამოწმოთ ინტერნეტი და სცადოთ ხელახლა.');
      } finally {
        // Restore submit button state
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.classList.remove('opacity-75', 'cursor-not-allowed');
          submitBtn.innerHTML = originalSubmitBtnHtml;
        }
      }
    });

    function hideStatus() {
      if (statusBox) {
        statusBox.classList.add('hidden');
        statusBox.innerHTML = '';
      }
    }

    function showSuccessMessage(result) {
      if (!statusBox) return;

      statusBox.className = 'mb-6 p-5 sm:p-6 rounded-2xl bg-emerald-50/90 border border-emerald-300 text-slate-800 shadow-sm transition-all duration-300 animate-fadeIn';
      statusBox.setAttribute('role', 'alert');

      statusBox.innerHTML = `
        <div class="flex items-start gap-3.5">
          <div class="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5 shadow-2xs" aria-hidden="true">
            <i class="fa-solid fa-circle-check text-xl"></i>
          </div>
          <div class="space-y-1.5 flex-1">
            <h4 class="text-base sm:text-lg font-bold text-emerald-900 flex items-center gap-2 flex-wrap">
              <span>თქვენი შეტყობინება წარმატებით გაიგზავნა!</span>
              <span class="text-xs px-2.5 py-0.5 rounded-full bg-emerald-200/80 text-emerald-800 font-semibold font-mono">
                HTTP 201 Created (ID: #${result.id || 101})
              </span>
            </h4>
            <p class="text-xs sm:text-sm text-emerald-800 leading-relaxed">
              გმადლობთ დაკავშირებისთვის! მონაცემები წარმატებით დამუშავდა და გადაიცა JSON ფორმატში.
            </p>
            <div class="mt-3 pt-2.5 border-t border-emerald-200 text-xs text-emerald-900/90 flex items-start gap-2">
              <i class="fa-solid fa-circle-info text-emerald-600 mt-0.5 shrink-0" aria-hidden="true"></i>
              <p>
                <strong>გაითვალისწინეთ:</strong> მოთხოვნა გაიგზავნა <code class="bg-emerald-100 px-1 py-0.5 rounded text-emerald-900 font-mono">JSONPlaceholder</code> სატესტო API-ზე. სერვისი ახდენს მონაცემების შენახვის სიმულაციას და რეალურად ბაზაში მუდმივად არ ინახავს მათ (JSONPlaceholder simulates saving data and does not permanently store submissions).
              </p>
            </div>
          </div>
        </div>
      `;

      statusBox.classList.remove('hidden');
      statusBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    function showErrorMessage(errorDetails) {
      if (!statusBox) return;

      statusBox.className = 'mb-6 p-5 sm:p-6 rounded-2xl bg-rose-50/90 border border-rose-300 text-slate-800 shadow-sm transition-all duration-300 animate-fadeIn';
      statusBox.setAttribute('role', 'alert');

      statusBox.innerHTML = `
        <div class="flex items-start gap-3.5">
          <div class="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0 mt-0.5 shadow-2xs" aria-hidden="true">
            <i class="fa-solid fa-triangle-exclamation text-xl"></i>
          </div>
          <div class="space-y-1.5 flex-1">
            <h4 class="text-base sm:text-lg font-bold text-rose-900">
              შეტყობინების გაგზავნა ვერ მოხერხდა
            </h4>
            <p class="text-xs sm:text-sm text-rose-800 leading-relaxed">
              დაფიქსირდა შეცდომა მონაცემების გაგზავნისას: <strong>${escapeHtml(errorDetails)}</strong>
            </p>
            <p class="text-xs text-rose-700 mt-1">
              გთხოვთ შეამოწმოთ ინტერნეტ კავშირი ან სცადოთ ხელახლა რამდენიმე წამში.
            </p>
          </div>
        </div>
      `;

      statusBox.classList.remove('hidden');
      statusBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    function escapeHtml(str) {
      if (!str) return '';
      return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
    }
  }
})();

