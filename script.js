/* Nihal Tikka — Portfolio 2026
   Interactions: scroll progress, nav show/hide, reveal-on-scroll,
   animated counters, magnetic buttons, mobile nav. */

(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* ---------- Smooth scroll for anchor links ---------- */
    document.querySelectorAll('a[href^="#"]').forEach((link) => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (!href || href === '#') return;
            const target = document.querySelector(href);
            if (!target) return;
            e.preventDefault();
            target.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth' });
        });
    });

    /* ---------- Scroll progress + nav show/hide ---------- */
    const nav = document.querySelector('.nav');
    const progress = document.querySelector('.progress-bar span');
    let lastY = window.scrollY;
    let ticking = false;

    const onScroll = () => {
        const y = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const pct = docHeight > 0 ? (y / docHeight) * 100 : 0;

        if (progress) progress.style.width = pct + '%';

        if (nav) {
            nav.classList.toggle('scrolled', y > 20);

            if (y > 120) {
                if (y > lastY + 4) {
                    nav.classList.add('hidden');
                } else if (y < lastY - 4) {
                    nav.classList.remove('hidden');
                }
            } else {
                nav.classList.remove('hidden');
            }
        }

        lastY = y;
        ticking = false;
    };

    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(onScroll);
            ticking = true;
        }
    }, { passive: true });

    /* ---------- Reveal-on-scroll ---------- */
    const revealTargets = document.querySelectorAll(
        [
            '[data-reveal]',
            '.section',
            '.section-head',
            '.job',
            '.project',
            '.cert',
            '.skill-group',
            '.edu',
            '.contact-grid li',
            '.stats > div',
        ].join(',')
    );

    if (!prefersReducedMotion && 'IntersectionObserver' in window) {
        const io = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('in');
                        io.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
        );
        revealTargets.forEach((el) => io.observe(el));
    } else {
        revealTargets.forEach((el) => el.classList.add('in'));
    }

    /* ---------- Animated counters (graceful fallback: HTML shows target) ---------- */
    const counters = document.querySelectorAll('.count');
    const animateCount = (el) => {
        const target = parseInt(el.dataset.target, 10) || 0;
        const duration = 1400;
        const start = performance.now();

        const tick = (now) => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            el.textContent = Math.round(target * eased).toString();
            if (progress < 1) requestAnimationFrame(tick);
        };

        el.textContent = '0';
        requestAnimationFrame(tick);
    };

    if (!prefersReducedMotion && 'IntersectionObserver' in window) {
        const cio = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        animateCount(entry.target);
                        cio.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.4 }
        );
        counters.forEach((c) => cio.observe(c));
    }
    /* If reduced motion or no observer support, keep the target value already in HTML */

    /* ---------- Magnetic buttons ---------- */
    if (!prefersReducedMotion && window.matchMedia('(hover: hover)').matches) {
        document.querySelectorAll('[data-magnetic]').forEach((btn) => {
            const strength = 14;
            btn.addEventListener('mousemove', (e) => {
                const rect = btn.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                btn.style.transform = `translate(${(x / rect.width) * strength}px, ${(y / rect.height) * strength}px)`;
            });
            btn.addEventListener('mouseleave', () => {
                btn.style.transform = '';
            });
        });
    }

    /* ---------- Mobile nav ---------- */
    const toggle = document.querySelector('.nav-toggle');
    const links = document.querySelector('.nav-links');

    if (toggle && links) {
        toggle.addEventListener('click', () => {
            const open = links.classList.toggle('open');
            toggle.classList.toggle('active', open);
            toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
        });

        links.querySelectorAll('a').forEach((a) =>
            a.addEventListener('click', () => {
                links.classList.remove('open');
                toggle.classList.remove('active');
                toggle.setAttribute('aria-expanded', 'false');
            })
        );
    }

    /* ---------- Initial nudge ---------- */
    onScroll();
})();
