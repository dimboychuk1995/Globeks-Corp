/* ============================================
   GLOBEKS CORP — JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    // ---- Preloader ----
    const preloader = document.getElementById('preloader');
    window.addEventListener('load', () => {
        setTimeout(() => {
            preloader.classList.add('hidden');
        }, 800);
    });
    // Fallback: hide preloader after 3s even if load event somehow missed
    setTimeout(() => preloader.classList.add('hidden'), 3000);

    // ---- Sticky Header ----
    const header = document.getElementById('header');
    const scrollThreshold = 50;

    function updateHeader() {
        if (window.scrollY > scrollThreshold) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }
    window.addEventListener('scroll', updateHeader, { passive: true });
    updateHeader();

    // ---- Mobile Navigation ----
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('open');
    });

    // Close mobile nav on link click
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('open');
        });
    });

    // ---- Active Nav Highlight ----
    const sections = document.querySelectorAll('section[id]');

    function highlightNav() {
        const scrollPos = window.scrollY + 150;
        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');
            const link = navLinks.querySelector(`a[href="#${id}"]`);
            if (link) {
                if (scrollPos >= top && scrollPos < top + height) {
                    link.classList.add('active');
                } else {
                    link.classList.remove('active');
                }
            }
        });
    }
    window.addEventListener('scroll', highlightNav, { passive: true });

    // ---- Counter Animation ----
    const statNumbers = document.querySelectorAll('.stat-number');
    let countersStarted = false;

    function animateCounters() {
        if (countersStarted) return;
        const statsSection = document.querySelector('.stats-grid');
        if (!statsSection) return;

        const rect = statsSection.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
            countersStarted = true;
            statNumbers.forEach(el => {
                const target = parseInt(el.getAttribute('data-target'), 10);
                const duration = 2000;
                const step = Math.ceil(target / (duration / 16));
                let current = 0;

                const timer = setInterval(() => {
                    current += step;
                    if (current >= target) {
                        current = target;
                        clearInterval(timer);
                    }
                    el.textContent = current.toLocaleString();
                }, 16);
            });
        }
    }
    window.addEventListener('scroll', animateCounters, { passive: true });
    animateCounters(); // check on load too

    // ---- Scroll Reveal (Service Cards & others) ----
    const revealElements = document.querySelectorAll('.service-card, .why-card, .discount-card, .vet-feature, .stat-box, .photo-slot');

    function revealOnScroll() {
        revealElements.forEach(el => {
            const rect = el.getBoundingClientRect();
            if (rect.top < window.innerHeight - 60) {
                el.classList.add('visible');
            }
        });
    }
    window.addEventListener('scroll', revealOnScroll, { passive: true });
    revealOnScroll();

    // ---- Gallery Filter ----
    const filterBtns = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.getAttribute('data-filter');

            galleryItems.forEach(item => {
                if (filter === 'all' || item.getAttribute('data-category') === filter) {
                    item.classList.remove('hidden');
                } else {
                    item.classList.add('hidden');
                }
            });
        });
    });

    // ---- Testimonials Slider ----
    const track = document.getElementById('testimonialsTrack');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const dotsContainer = document.getElementById('sliderDots');
    const cards = track ? track.querySelectorAll('.testimonial-card') : [];
    let currentSlide = 0;
    const totalSlides = cards.length;

    // Create dots
    if (dotsContainer && totalSlides > 0) {
        for (let i = 0; i < totalSlides; i++) {
            const dot = document.createElement('div');
            dot.className = 'slider-dot' + (i === 0 ? ' active' : '');
            dot.addEventListener('click', () => goToSlide(i));
            dotsContainer.appendChild(dot);
        }
    }

    function goToSlide(index) {
        if (index < 0) index = totalSlides - 1;
        if (index >= totalSlides) index = 0;
        currentSlide = index;
        track.style.transform = `translateX(-${currentSlide * 100}%)`;
        const dots = dotsContainer.querySelectorAll('.slider-dot');
        dots.forEach((d, i) => d.classList.toggle('active', i === currentSlide));
    }

    if (prevBtn) prevBtn.addEventListener('click', () => goToSlide(currentSlide - 1));
    if (nextBtn) nextBtn.addEventListener('click', () => goToSlide(currentSlide + 1));

    // Auto-play slider
    let autoSlide = setInterval(() => goToSlide(currentSlide + 1), 5000);

    // Pause on hover
    if (track) {
        track.addEventListener('mouseenter', () => clearInterval(autoSlide));
        track.addEventListener('mouseleave', () => {
            autoSlide = setInterval(() => goToSlide(currentSlide + 1), 5000);
        });
    }

    // ---- FAQ Accordion ----
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');

        question.addEventListener('click', () => {
            const isOpen = item.classList.contains('open');

            // Close all
            faqItems.forEach(faq => {
                faq.classList.remove('open');
                faq.querySelector('.faq-answer').style.maxHeight = null;
            });

            // Open clicked (if it was closed)
            if (!isOpen) {
                item.classList.add('open');
                answer.style.maxHeight = answer.scrollHeight + 'px';
            }
        });
    });

    // ---- Quote Form ----
    const quoteForm = document.getElementById('quoteForm');
    const formError = document.getElementById('formError');
    const formSuccess = document.getElementById('formSuccess');

    if (quoteForm) {
        const submitButton = quoteForm.querySelector('button[type="submit"]');
        const submitButtonHtml = submitButton ? submitButton.innerHTML : '';

        quoteForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Simple validation
            let isValid = true;
            const requiredFields = quoteForm.querySelectorAll('[required]');

            if (formError) {
                formError.style.display = 'none';
            }

            requiredFields.forEach(field => {
                field.classList.remove('error');
                if (!field.value.trim()) {
                    field.classList.add('error');
                    isValid = false;
                }
            });

            // Email validation
            const emailField = quoteForm.querySelector('#email');
            if (emailField && emailField.value) {
                const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailPattern.test(emailField.value)) {
                    emailField.classList.add('error');
                    isValid = false;
                }
            }

            if (!isValid) {
                return;
            }

            if (submitButton) {
                submitButton.disabled = true;
                submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            }

            try {
                const response = await fetch(quoteForm.action, {
                    method: quoteForm.method,
                    body: new FormData(quoteForm),
                    headers: {
                        Accept: 'application/json'
                    }
                });

                if (!response.ok) {
                    throw new Error('Form submission failed');
                }

                quoteForm.reset();
                quoteForm.style.display = 'none';
                formSuccess.style.display = 'block';

                // Scroll to success message
                formSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });
            } catch (error) {
                if (formError) {
                    formError.style.display = 'block';
                    formError.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            } finally {
                if (submitButton) {
                    submitButton.disabled = false;
                    submitButton.innerHTML = submitButtonHtml;
                }
            }
        });

        // Clear error on input
        quoteForm.querySelectorAll('input, select, textarea').forEach(field => {
            field.addEventListener('input', () => {
                field.classList.remove('error');
                if (formError) {
                    formError.style.display = 'none';
                }
            });
        });
    }

    // ---- Photos Load More (4 at a time) ----
    const loadMoreBtn = document.getElementById('loadMorePhotos');
    const photosGrid = document.getElementById('photosGrid');
    if (loadMoreBtn && photosGrid) {
        const allSlots = photosGrid.querySelectorAll('.photo-slot');
        const INITIAL = 4;
        const STEP = 4;
        let visibleCount = INITIAL;

        // Hide all beyond initial 4
        allSlots.forEach((slot, i) => {
            if (i >= INITIAL) slot.classList.add('photo-hidden');
        });

        function updateButton() {
            if (visibleCount >= allSlots.length) {
                loadMoreBtn.innerHTML = '<i class="fas fa-chevron-up"></i> Show Less';
            } else {
                loadMoreBtn.innerHTML = '<i class="fas fa-images"></i> Show More';
            }
        }
        updateButton();

        loadMoreBtn.addEventListener('click', () => {
            if (visibleCount >= allSlots.length) {
                // Collapse back to initial
                allSlots.forEach((slot, i) => {
                    if (i >= INITIAL) slot.classList.add('photo-hidden');
                });
                visibleCount = INITIAL;
                photosGrid.scrollIntoView({ behavior: 'smooth', block: 'start' });
            } else {
                // Show next 4
                const newVisible = Math.min(visibleCount + STEP, allSlots.length);
                for (let i = visibleCount; i < newVisible; i++) {
                    allSlots[i].classList.remove('photo-hidden');
                }
                visibleCount = newVisible;
            }
            updateButton();
        });
    }

    // ---- Back to Top ----
    const backToTop = document.getElementById('backToTop');

    function toggleBackToTop() {
        if (window.scrollY > 500) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    }

    window.addEventListener('scroll', toggleBackToTop, { passive: true });

    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // ---- Smooth Scroll for all anchor links ----
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            const targetId = anchor.getAttribute('href');
            if (targetId === '#') return;

            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // ---- Transit Bar Animation ----
    const transitBars = document.querySelectorAll('.transit-bar .bar');
    let barsAnimated = false;

    function animateBars() {
        if (barsAnimated) return;
        const coverage = document.getElementById('coverage');
        if (!coverage) return;

        const rect = coverage.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
            barsAnimated = true;
            transitBars.forEach(bar => {
                const width = bar.style.width;
                bar.style.width = '0';
                setTimeout(() => {
                    bar.style.width = width;
                }, 100);
            });
        }
    }
    window.addEventListener('scroll', animateBars, { passive: true });
});
