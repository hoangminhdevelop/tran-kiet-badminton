// Import Swiper styling and core modules
import 'swiper/css';
import 'swiper/css/pagination';

import Swiper from 'swiper';
import { Pagination, Autoplay, EffectFade, Mousewheel } from 'swiper/modules';

// Initialize the Swiper Carousel
document.addEventListener('DOMContentLoaded', () => {
    const siteHeader = document.querySelector('.site-header');

    const syncHeaderState = () => {
        if (!siteHeader) {
            return;
        }

        if (window.scrollY > 24) {
            siteHeader.classList.add('is-scrolled');
        } else {
            siteHeader.classList.remove('is-scrolled');
        }
    };

    syncHeaderState();
    window.addEventListener('scroll', syncHeaderState, { passive: true });

    // 1. Hero Swiper Overview
    const heroSwiper = new Swiper('.hero-swiper', {
        modules: [Pagination, Autoplay, EffectFade, Mousewheel],
        loop: true,
        speed: 1000,
        effect: 'fade',
        mousewheel: {
            forceToAxis: true,
            thresholdDelta: 30,
            thresholdTime: 400,
            releaseOnEdges: false,
        },
        autoplay: {
            delay: 6000,
            disableOnInteraction: false,
        },
        pagination: {
            el: '.hero-nav',
            type: 'bullets',
            clickable: true,
        },
    });

    // 2. Coach Roster Carousel
    const coachSwiper = new Swiper('.coach-swiper', {
        loop: true,
        slidesPerView: 1.2,
        spaceBetween: 24,
        grabCursor: true,
        breakpoints: {
            1024: {
                slidesPerView: 2.5,
                spaceBetween: 48,
            },
        },
    });

    const aboutSection = document.querySelector('.about-section');
    const countNodes = Array.from(document.querySelectorAll('.about-stat strong[data-count]'));

    const animateCount = (node) => {
        const targetValue = Number(node.dataset.count || '0');
        const suffix = node.dataset.suffix || '';
        const duration = 1200;
        const startTime = performance.now();
        const formatter = new Intl.NumberFormat('en-US');

        const tick = (time) => {
            const progress = Math.min((time - startTime) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const value = Math.round(targetValue * eased);
            node.textContent = `${formatter.format(value)}${suffix}`;

            if (progress < 1) {
                requestAnimationFrame(tick);
            }
        };

        requestAnimationFrame(tick);
    };

    if (aboutSection && countNodes.length > 0) {
        const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        let hasAnimated = false;

        const runCounts = () => {
            if (hasAnimated) {
                return;
            }

            hasAnimated = true;

            countNodes.forEach((node, index) => {
                if (reducedMotion) {
                    node.textContent = `${node.dataset.count || '0'}${node.dataset.suffix || ''}`;
                    return;
                }

                window.setTimeout(() => {
                    animateCount(node);
                }, index * 140);
            });
        };

        if (reducedMotion) {
            runCounts();
        } else if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                if (entries.some((entry) => entry.isIntersecting)) {
                    runCounts();
                    observer.disconnect();
                }
            }, { threshold: 0.35 });

            observer.observe(aboutSection);
        } else {
            runCounts();
        }
    }
});
