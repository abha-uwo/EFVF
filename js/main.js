/**
 * EFV Main JS - Global UI Interactions
 */

document.addEventListener('DOMContentLoaded', () => {
    const nav = document.querySelector('nav');

    // Optimized Scroll Reveal using IntersectionObserver
    const revealOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // Stop observing once revealed
            }
        });
    }, revealOptions);

    document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

    // Optimized Navbar Scroll Effect
    let lastScrollY = window.scrollY;
    let ticking = false;

    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                if (window.scrollY > 50) {
                    nav.classList.add('scrolled');
                } else {
                    nav.classList.remove('scrolled');
                }
                ticking = false;
            });
            ticking = true;
        }
    });

    // Mobile Menu Toggle Logic
    const initMobileMenu = () => {
        const navLinks = document.querySelector('.nav-links');
        const container = document.querySelector('nav .container');
        let hamburger = document.querySelector('.hamburger');

        if (!hamburger && container) {
            hamburger = document.createElement('button');
            hamburger.className = 'hamburger';
            hamburger.setAttribute('aria-label', 'Toggle Menu');
            hamburger.innerHTML = '<span></span><span></span><span></span>';
            container.appendChild(hamburger);
        }

        if (hamburger && navLinks) {
            hamburger.addEventListener('click', (e) => {
                e.stopPropagation();
                hamburger.classList.toggle('active');
                navLinks.classList.toggle('active');
                document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
            });

            // Auto-close when clicking outside
            document.addEventListener('click', (e) => {
                const isClickInside = navLinks.contains(e.target) || hamburger.contains(e.target);
                if (!isClickInside && navLinks.classList.contains('active')) {
                    hamburger.classList.remove('active');
                    navLinks.classList.remove('active');
                    document.body.style.overflow = '';
                }
            });

            navLinks.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', () => {
                    hamburger.classList.remove('active');
                    navLinks.classList.remove('active');
                    document.body.style.overflow = '';
                });
            });

            // Close menu if window is resized to desktop width
            window.addEventListener('resize', () => {
                if (window.innerWidth > 992 && navLinks.classList.contains('active')) {
                    hamburger.classList.remove('active');
                    navLinks.classList.remove('active');
                    document.body.style.overflow = '';
                }
            });
        }
    };

    initMobileMenu();

    // Custom Cursor Trail (Disabled on mobile for performance)
    if (!window.matchMedia("(max-width: 768px)").matches) {
        const cursor = document.createElement('div');
        cursor.className = 'cursor-trail';
        document.body.appendChild(cursor);

        Object.assign(cursor.style, {
            position: 'fixed',
            width: '20px',
            height: '20px',
            background: 'radial-gradient(circle, rgba(255, 211, 105, 0.4) 0%, transparent 70%)',
            borderRadius: '50%',
            pointerEvents: 'none',
            zIndex: '9999',
            transform: 'translate(-50%, -50%)',
            transition: 'transform 0.05s linear'
        });

        window.addEventListener('mousemove', (e) => {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
        });
    }

    // Smooth Scroll for Navigation
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const target = document.querySelector(targetId);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Book Carousel Functionality
    const track = document.getElementById('books-track');
    const prevBtn = document.querySelector('.carousel-nav.prev');
    const nextBtn = document.querySelector('.carousel-nav.next');

    if (track && prevBtn && nextBtn) {
        let currentIndex = 0;

        const updateCarousel = () => {
            const cardWidth = track.querySelector('.glass-panel').offsetWidth;
            const gap = 30; // Matches CSS gap
            const scrollAmount = (cardWidth + gap) * currentIndex;

            track.style.transform = `translateX(-${scrollAmount}px)`;

            // Update button states
            prevBtn.classList.toggle('disabled', currentIndex === 0);

            // Estimate max index (total cards - visible cards)
            const visibleCards = window.innerWidth > 1024 ? 3 : (window.innerWidth > 768 ? 2 : 1);
            const totalCards = track.querySelectorAll('.glass-panel').length;
            nextBtn.classList.toggle('disabled', currentIndex >= totalCards - visibleCards);
        };

        nextBtn.addEventListener('click', () => {
            const visibleCards = window.innerWidth > 1024 ? 3 : (window.innerWidth > 768 ? 2 : 1);
            const totalCards = track.querySelectorAll('.glass-panel').length;
            if (currentIndex < totalCards - visibleCards) {
                currentIndex++;
                updateCarousel();
            }
        });

        prevBtn.addEventListener('click', () => {
            if (currentIndex > 0) {
                currentIndex--;
                updateCarousel();
            }
        });

        // Handle resize
        window.addEventListener('resize', updateCarousel);
    }

    // Global Modal System
    const initModal = () => {
        const modalHtml = `
            <div class="modal-overlay" id="privacy-modal">
                <div class="modal-card">
                    <button class="modal-close" aria-label="Close Modal">
                        <i class="fas fa-times"></i>
                    </button>
                    <h2 style="text-align: center; margin-bottom: 25px; font-family: 'Montserrat', sans-serif; font-weight: 800; color: var(--gold-energy); border-bottom: 1px solid var(--glass-border); padding-bottom: 15px;">
                        PRIVACY POLICY
                    </h2>
                    <div class="modal-body" style="font-family: 'Inter', sans-serif; color: rgba(240, 244, 248, 0.9); max-height: 60vh; overflow-y: auto; padding-right: 10px;">
                        <div style="text-align: center; margin-bottom: 30px;">
                            <p style="font-size: 0.9rem; opacity: 0.6;">Last Updated: 18/02/2026</p>
                            <p style="margin-top: 15px;">Welcome to EFV. Your privacy is important to us. This Privacy Policy explains how we collect, use, and protect your information when you visit or purchase from our website.</p>
                        </div>

                        <div style="margin-bottom: 25px;">
                            <h3 style="font-family: 'Montserrat', sans-serif; font-size: 1rem; color: var(--gold-energy); margin-bottom: 12px; text-transform: uppercase; letter-spacing: 1px;">1. Information We Collect</h3>
                            <p style="margin-bottom: 10px;">When you visit or purchase from EFV, we may collect:</p>
                            <ul style="list-style: disc; margin-left: 20px; opacity: 0.85;">
                                <li>Full Name</li>
                                <li>Email Address</li>
                                <li>Phone Number</li>
                                <li>Billing & Shipping Address</li>
                                <li>Payment Information (processed securely via payment gateway)</li>
                                <li>IP address & browsing behavior (for analytics)</li>
                            </ul>
                            <p style="margin-top: 10px; font-style: italic;">We do not store your card details.</p>
                        </div>

                        <div style="margin-bottom: 25px;">
                            <h3 style="font-family: 'Montserrat', sans-serif; font-size: 1rem; color: var(--gold-energy); margin-bottom: 12px; text-transform: uppercase; letter-spacing: 1px;">2. How We Use Your Information</h3>
                            <p style="margin-bottom: 10px;">We use your information to:</p>
                            <ul style="list-style: disc; margin-left: 20px; opacity: 0.85;">
                                <li>Process and deliver your order</li>
                                <li>Send order confirmations & tracking details</li>
                                <li>Respond to customer support queries</li>
                                <li>Improve our website experience</li>
                                <li>Send promotional emails (only if you opt in)</li>
                            </ul>
                        </div>

                        <div style="margin-bottom: 25px;">
                            <h3 style="font-family: 'Montserrat', sans-serif; font-size: 1rem; color: var(--gold-energy); margin-bottom: 12px; text-transform: uppercase; letter-spacing: 1px;">3. Payment Security</h3>
                            <ul style="list-style: disc; margin-left: 20px; opacity: 0.85;">
                                <li>All payments are processed securely through trusted third-party payment gateways. EFV does not store sensitive payment data.</li>
                            </ul>
                        </div>

                        <div style="margin-bottom: 25px;">
                            <h3 style="font-family: 'Montserrat', sans-serif; font-size: 1rem; color: var(--gold-energy); margin-bottom: 12px; text-transform: uppercase; letter-spacing: 1px;">4. Data Protection</h3>
                            <ul style="list-style: disc; margin-left: 20px; opacity: 0.85;">
                                <li>We implement appropriate security measures to protect your data. However, no online transmission is 100% secure.</li>
                            </ul>
                        </div>

                        <div style="margin-bottom: 25px;">
                            <h3 style="font-family: 'Montserrat', sans-serif; font-size: 1rem; color: var(--gold-energy); margin-bottom: 12px; text-transform: uppercase; letter-spacing: 1px;">5. Cookies</h3>
                            <ul style="list-style: disc; margin-left: 20px; opacity: 0.85;">
                                <li>We use cookies to enhance browsing experience and track website performance.</li>
                                <li>You can disable cookies in your browser settings.</li>
                            </ul>
                        </div>

                        <div style="margin-bottom: 25px;">
                            <h3 style="font-family: 'Montserrat', sans-serif; font-size: 1rem; color: var(--gold-energy); margin-bottom: 12px; text-transform: uppercase; letter-spacing: 1px;">6. Third-Party Services</h3>
                            <p style="margin-bottom: 10px;">We may use third-party services for:</p>
                            <ul style="list-style: disc; margin-left: 20px; opacity: 0.85;">
                                <li>Payment processing</li>
                                <li>Shipping & logistics</li>
                                <li>Email marketing</li>
                                <li>Analytics</li>
                            </ul>
                            <p style="margin-top: 10px;">These third parties have their own privacy policies.</p>
                        </div>

                        <div style="margin-bottom: 25px;">
                            <h3 style="font-family: 'Montserrat', sans-serif; font-size: 1rem; color: var(--gold-energy); margin-bottom: 12px; text-transform: uppercase; letter-spacing: 1px;">7. Your Rights</h3>
                            <ul style="list-style: disc; margin-left: 20px; opacity: 0.85;">
                                <li>You may request access, correction, or deletion of your personal data by contacting us.</li>
                            </ul>
                        </div>

                        <div style="margin-bottom: 25px;">
                            <h3 style="font-family: 'Montserrat', sans-serif; font-size: 1rem; color: var(--gold-energy); margin-bottom: 12px; text-transform: uppercase; letter-spacing: 1px;">8. Contact Us</h3>
                            <ul style="list-style: none; margin-left: 0; opacity: 0.85;">
                                <li><strong>Phone no.</strong> - 83589 90909</li>
                                <li><strong>Email</strong> - admin@uwo24.com</li>
                                <li><strong>Company</strong> - Unified Web Options & Services Private Limited</li>
                                <li><strong>Project</strong> - EFV</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHtml);

        const modal = document.getElementById('privacy-modal');
        const closeBtn = modal.querySelector('.modal-close');

        const openModal = (e) => {
            if (e) e.preventDefault();
            document.body.classList.add('modal-open');
            modal.style.display = 'flex';
            setTimeout(() => modal.classList.add('active'), 10);
        };

        const closeModal = () => {
            modal.classList.remove('active');
            document.body.classList.remove('modal-open');
            setTimeout(() => modal.style.display = 'none', 400);
        };

        // Attach to all Privacy Policy links
        document.querySelectorAll('a[href*="privacy-policy.html"]').forEach(link => {
            link.addEventListener('click', openModal);
        });

        closeBtn.addEventListener('click', closeModal);
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });

        // Escape key to close
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.classList.contains('active')) closeModal();
        });
    };

    initModal();

    // Admin Navbar Visibility Logic
    window.updateAdminNavbar = () => {
        const userData = JSON.parse(localStorage.getItem('efv_user'));
        const isAdmin = sessionStorage.getItem('adminLoggedIn') === 'true' ||
            (userData && userData.email && userData.email.toLowerCase() === 'admin@uwo24.com');

        document.querySelectorAll('a[href="admin.html"]').forEach(link => {
            const listItem = link.parentElement;
            if (isAdmin) {
                listItem.style.setProperty('display', 'block', 'important');
                listItem.style.visibility = 'visible';
                listItem.style.opacity = '1';
                listItem.style.pointerEvents = 'auto';
            } else {
                listItem.style.setProperty('display', 'none', 'important');
            }
        });
    };

    // Initial check on load
    window.updateAdminNavbar();

    // Home Page Volume Buttons Active State
    const bookButtons = document.querySelectorAll('.btn-outline');
    bookButtons.forEach(btn => {
        btn.addEventListener('click', function () {
            // Remove active class from all others in the track if desired, 
            // but usually we just want feedback on the clicked one.
            bookButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            // If it's a link, we don't preventDefault so it still navigates, 
            // but the user sees the golden flash/transition.
        });
    });
});
