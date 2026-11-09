/**
 * main.js - Shared scripts for personal portfolio website
 * Handles responsive mobile navigation (hamburger menu) across all pages
 */

(function () {
  'use strict';

  // Initialize mobile menu once DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMobileMenu);
  } else {
    initMobileMenu();
  }

  function initMobileMenu() {
    const btn = document.getElementById('mobile-menu-btn');
    const menu = document.getElementById('mobile-menu');
    const hamburgerIcon = document.getElementById('hamburger-icon');
    const closeIcon = document.getElementById('close-icon');

    if (!btn || !menu) {
      return;
    }

    /**
     * Toggles the mobile menu open/closed state
     * @param {boolean} [forceState] - optional boolean to force open (true) or closed (false)
     */
    function setMenuState(open) {
      if (open) {
        menu.classList.remove('hidden');
        btn.setAttribute('aria-expanded', 'true');
        btn.setAttribute('aria-label', 'ნავიგაციის მენიუს დახურვა');
        if (hamburgerIcon) hamburgerIcon.classList.add('hidden');
        if (closeIcon) closeIcon.classList.remove('hidden');
      } else {
        menu.classList.add('hidden');
        btn.setAttribute('aria-expanded', 'false');
        btn.setAttribute('aria-label', 'ნავიგაციის მენიუს გახსნა');
        if (hamburgerIcon) hamburgerIcon.classList.remove('hidden');
        if (closeIcon) closeIcon.classList.add('hidden');
      }
    }

    // Toggle menu when clicking the hamburger button
    btn.addEventListener('click', function () {
      const isOpen = !menu.classList.contains('hidden');
      setMenuState(!isOpen);
    });

    // Close the menu when any navigation link inside it is clicked
    const links = menu.querySelectorAll('a');
    links.forEach(function (link) {
      link.addEventListener('click', function () {
        setMenuState(false);
      });
    });

    // Close the menu automatically when resizing to desktop viewport (>= 768px)
    window.addEventListener('resize', function () {
      if (window.innerWidth >= 768 && !menu.classList.contains('hidden')) {
        setMenuState(false);
      }
    });
  }
})();

