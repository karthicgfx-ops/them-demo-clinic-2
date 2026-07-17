document.addEventListener('DOMContentLoaded', () => {

    const loader = document.getElementById('loader');
    window.addEventListener('load', () => {
        setTimeout(() => loader.classList.add('hidden'), 600);
    });
    setTimeout(() => loader.classList.add('hidden'), 2000);

    const navbar = document.getElementById('navbar');
    const backTop = document.getElementById('backTop');
    const progress = document.getElementById('scroll-progress');

    function handleScroll() {
        const y = window.scrollY;
        const h = document.documentElement.scrollHeight - window.innerHeight;
        navbar.classList.toggle('scrolled', y > 50);
        backTop.classList.toggle('visible', y > 500);
        if (progress) progress.style.width = `${(y / h) * 100}%`;
    }
    window.addEventListener('scroll', handleScroll);
    handleScroll();

    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileOverlay = document.getElementById('mobileOverlay');

    function closeMobile() {
        hamburger.classList.remove('active');
        mobileMenu.classList.remove('active');
        mobileOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    function openMobile() {
        hamburger.classList.add('active');
        mobileMenu.classList.add('active');
        mobileOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    hamburger.addEventListener('click', () => {
        if (mobileMenu.classList.contains('active')) {
            closeMobile();
        } else {
            openMobile();
        }
    });

    mobileOverlay.addEventListener('click', closeMobile);

    document.querySelectorAll('.mobile-nav-link, .mobile-cta').forEach(link => {
        link.addEventListener('click', closeMobile);
    });

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = entry.target.getAttribute('data-delay') || 0;
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, parseInt(delay));
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.fade-up, .fade-left, .fade-right, .scale-in').forEach(el => {
        observer.observe(el);
    });

    function animateCounters() {
        const counters = document.querySelectorAll('.hero-stat-num[data-target], .stat-num[data-target]');
        if (!counters.length) return;

        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                const el = entry.target;
                const target = parseInt(el.getAttribute('data-target'));
                const suffix = el.getAttribute('data-suffix') || '';
                let current = 0;
                const step = Math.max(1, Math.floor(target / 40));
                const timer = setInterval(() => {
                    current += step;
                    if (current >= target) {
                        current = target;
                        clearInterval(timer);
                    }
                    el.textContent = current.toLocaleString() + suffix;
                }, 20);
                counterObserver.unobserve(el);
            });
        }, { threshold: 0.5 });

        counters.forEach(el => counterObserver.observe(el));
    }
    animateCounters();

    const testimonialTrack = document.getElementById('testimonialTrack');
    if (testimonialTrack) {
        const prevBtn = document.getElementById('prevT');
        const nextBtn = document.getElementById('nextT');
        const dotsContainer = document.getElementById('tlDots');
        const cards = testimonialTrack.querySelectorAll('.testimonial-card');
        let current = 0;
        const total = cards.length;

        for (let i = 0; i < total; i++) {
            const dot = document.createElement('div');
            dot.classList.add('tl-dot');
            if (i === 0) dot.classList.add('active');
            dot.addEventListener('click', () => goTo(i));
            dotsContainer.appendChild(dot);
        }

        function goTo(index) {
            current = index;
            testimonialTrack.style.transform = `translateX(-${index * 100}%)`;
            document.querySelectorAll('.tl-dot').forEach((d, i) => d.classList.toggle('active', i === current));
        }

        prevBtn.addEventListener('click', () => {
            current = (current - 1 + total) % total;
            goTo(current);
        });

        nextBtn.addEventListener('click', () => {
            current = (current + 1) % total;
            goTo(current);
        });

        let autoSlide = setInterval(() => {
            current = (current + 1) % total;
            goTo(current);
        }, 5000);

        const slider = document.querySelector('.testimonials-slider');
        slider.addEventListener('mouseenter', () => clearInterval(autoSlide));
        slider.addEventListener('mouseleave', () => {
            autoSlide = setInterval(() => {
                current = (current + 1) % total;
                goTo(current);
            }, 5000);
        });
    }

    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = contactForm.querySelector('button[type="submit"]');
            btn.innerHTML = '<span>Sending...</span> <i class="fas fa-spinner fa-spin"></i>';
            btn.disabled = true;

            setTimeout(() => {
                contactForm.innerHTML = `
                    <div class="form-success show">
                        <i class="fas fa-check-circle"></i>
                        <h3>Thank You!</h3>
                        <p>Your message has been sent. We'll get back to you within 24 hours.</p>
                    </div>
                `;
            }, 1500);
        });
    }

    function addTilt(card) {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width;
            const y = (e.clientY - rect.top) / rect.height;
            const tiltX = (y - 0.5) * 8;
            const tiltY = (x - 0.5) * -8;
            card.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    }

    document.querySelectorAll('.service-card, .doctor-card, .service-detail, .why-card, .process-card, .insurance-card, .blog-preview-card, .tm-card, .doctor-card-full').forEach(addTilt);

    const fadeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = entry.target.getAttribute('data-delay') || 0;
                setTimeout(() => entry.target.classList.add('visible'), parseInt(delay));
                fadeObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.fade-in-left, .fade-in-right').forEach(el => fadeObserver.observe(el));

    document.querySelectorAll('.parallax-section').forEach(section => {
        const bg = section.querySelector('.parallax-bg');
        if (!bg) return;
        window.addEventListener('scroll', () => {
            const rect = section.getBoundingClientRect();
            const offset = rect.top * 0.15;
            bg.style.transform = `translateY(${offset}px)`;
        });
    });

    const newsletterForm = document.getElementById('footerNewsletter');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const input = newsletterForm.querySelector('input');
            const btn = newsletterForm.querySelector('button');
            const original = btn.innerHTML;
            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
            btn.disabled = true;
            setTimeout(() => {
                btn.innerHTML = '<i class="fas fa-check"></i>';
                input.value = '';
                setTimeout(() => { btn.innerHTML = original; btn.disabled = false; }, 2000);
            }, 1200);
        });

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const id = this.getAttribute('href');
            if (id === '#') return;
            const el = document.querySelector(id);
            if (el) {
                e.preventDefault();
                el.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    const modalHtml = `
        <div class="booking-modal" id="bookingModal">
            <div class="booking-modal-bg"></div>
            <div class="booking-modal-wrap">
                <button class="booking-modal-close">&times;</button>
                <div class="booking-cal-container" id="bookingCalContainer"></div>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHtml);

    const bookingModal = document.getElementById('bookingModal');
    const bookingCalContainer = document.getElementById('bookingCalContainer');
    let calInited = false;

    if (bookingModal) {
        function openBooking() {
            bookingModal.classList.add('active');
            document.body.style.overflow = 'hidden';
            if (!calInited && typeof Cal !== 'undefined') {
                Cal('inline', {
                    elementOrSelector: bookingCalContainer,
                    calLink: 'themdemosites/30min',
                    config: { theme: 'light', layout: 'month_view' }
                });
                calInited = true;
            }
        }

        function closeBooking() {
            bookingModal.classList.remove('active');
            document.body.style.overflow = '';
        }

        bookingModal.querySelector('.booking-modal-bg').addEventListener('click', closeBooking);
        bookingModal.querySelector('.booking-modal-close').addEventListener('click', closeBooking);

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') closeBooking();
        });

        document.querySelectorAll('a[href="https://cal.com/themdemosites/30min"]:not([target="_blank"]), .btn-book').forEach(el => {
            el.addEventListener('click', function (e) {
                e.preventDefault();
                openBooking();
            });
        });
    }

});
