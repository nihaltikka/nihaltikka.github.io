/* Nihal Tikka — Portfolio
   Mobile navigation, active-section tracking, footer year. */

(() => {
    'use strict';

    /* ---------- Mobile navigation ---------- */
    const toggle = document.querySelector('.nav-toggle');
    const nav = document.querySelector('.nav');

    if (toggle && nav) {
        const setOpen = (open) => {
            nav.classList.toggle('open', open);
            toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
        };

        toggle.addEventListener('click', () => {
            setOpen(toggle.getAttribute('aria-expanded') !== 'true');
        });

        nav.addEventListener('click', (e) => {
            if (e.target.closest('a')) setOpen(false);
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') setOpen(false);
        });
    }

    /* ---------- Active section in the masthead ---------- */
    const navLinks = Array.from(
        document.querySelectorAll('.nav a[href^="#"]')
    ).filter((a) => a.getAttribute('href').length > 1);

    const sections = navLinks
        .map((a) => document.querySelector(a.getAttribute('href')))
        .filter(Boolean);

    if (sections.length && 'IntersectionObserver' in window) {
        const setCurrent = (id) => {
            navLinks.forEach((a) => {
                a.classList.toggle('current', a.getAttribute('href') === '#' + id);
            });
        };

        const spy = new IntersectionObserver(
            (entries) => {
                const visible = entries
                    .filter((e) => e.isIntersecting)
                    .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
                if (visible) setCurrent(visible.target.id);
            },
            { rootMargin: '-40% 0px -50% 0px', threshold: 0 }
        );

        sections.forEach((s) => spy.observe(s));
    }

    /* ---------- Footer year ---------- */
    const year = document.getElementById('year');
    if (year) year.textContent = new Date().getFullYear();
})();
