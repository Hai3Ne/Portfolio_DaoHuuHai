document.addEventListener('DOMContentLoaded', function () {
    document.body.classList.add('loaded');
    initScrollAnimations();
    initSmoothScrolling();
    initMobileMenu();
    initContactForm();
    initExperienceYears();
    handleGameInstructionsVisibility();
    handleGameState();
    addProjectCardEffects();
    initStickyImage();
    window.addEventListener('resize', initStickyImage);
});
function initExperienceYears() {
    const gameIndustryStart = new Date(2021, 8, 20);
    const today = new Date();
    let years = today.getFullYear() - gameIndustryStart.getFullYear();
    const hasNotReachedAnniversary =
        today.getMonth() < gameIndustryStart.getMonth() ||
        (today.getMonth() === gameIndustryStart.getMonth() && today.getDate() < gameIndustryStart.getDate());

    if (hasNotReachedAnniversary) {
        years -= 1;
    }

    const experienceText = `over ${Math.max(years, 0)} years`;
    document.querySelectorAll('[data-game-experience]').forEach(element => {
        element.textContent = experienceText;
    });
}
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.section-title, .project-card, .about-content > *, .contact-content > *');

    const animateOnScroll = function () {
        animatedElements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;

            // If element is in viewport
            if (elementPosition < windowHeight - 100) {
                element.classList.add('slide-in');
            }
        });
    };
    animateOnScroll();
    window.addEventListener('scroll', animateOnScroll);
}
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 70, // Adjust for header height
                    behavior: 'smooth'
                });

                // Close mobile menu if open
                const navLinks = document.querySelector('.nav-links');
                const menuToggle = document.querySelector('.menu-toggle');

                if (navLinks && navLinks.classList.contains('show')) {
                    navLinks.classList.remove('show');
                    menuToggle.classList.remove('active');
                }

                // Pause game when navigating away from hero section
                if (targetId !== '#home' && window.gameInterface) {
                    window.gameInterface.pauseGame();
                } else if (window.gameInterface) {
                    window.gameInterface.startGame();
                }
            }
        });
    });
}
function initMobileMenu() {
    const nav = document.querySelector('nav');
    const navLinks = document.querySelector('.nav-links');

    if (nav && navLinks && window.innerWidth <= 768) {
        // Create menu toggle button if not already present
        if (!document.querySelector('.menu-toggle')) {
            const menuToggle = document.createElement('div');
            menuToggle.className = 'menu-toggle';
            menuToggle.innerHTML = '<span></span><span></span><span></span>';

            nav.insertBefore(menuToggle, navLinks);

            // Add click event
            menuToggle.addEventListener('click', function () {
                navLinks.classList.toggle('show');
                menuToggle.classList.toggle('active');
            });

            // Close menu when a link is clicked
            navLinks.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', function () {
                    navLinks.classList.remove('show');
                    menuToggle.classList.remove('active');
                });
            });

            // Close menu when clicking outside
            document.addEventListener('click', function (e) {
                if (!nav.contains(e.target) && navLinks.classList.contains('show')) {
                    navLinks.classList.remove('show');
                    menuToggle.classList.remove('active');
                }
            });
        }
    }
}
function initContactForm() {
    const contactForm = document.querySelector('.contact-form form');

    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const message = document.getElementById('message').value.trim();

            // Simple validation
            if (!name || !email || !message) {
                showFormMessage('Please fill in all fields.', 'error');
                return;
            }

            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                showFormMessage('Please enter a valid email address.', 'error');
                return;
            }

            const recipient = contactForm.dataset.contactEmail || 'daohuuhai98@gmail.com';
            const subject = encodeURIComponent(`Portfolio contact from ${name}`);
            const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`);

            window.location.href = `mailto:${recipient}?subject=${subject}&body=${body}`;
            showFormMessage('Your email app is opening with the message ready to send.', 'success');
        });
    }
}

function showFormMessage(message, type) {
    // Remove existing message
    const existingMessage = document.querySelector('.form-message');
    if (existingMessage) {
        existingMessage.remove();
    }

    // Create message element
    const messageEl = document.createElement('div');
    messageEl.className = `form-message ${type}`;
    messageEl.textContent = message;

    // Add to DOM
    const contactForm = document.querySelector('.contact-form form');
    contactForm.appendChild(messageEl);

    // Remove after 5 seconds
    setTimeout(() => {
        messageEl.classList.add('fade-out');
        setTimeout(() => messageEl.remove(), 500);
    }, 5000);
}

function handleGameInstructionsVisibility() {
    const gameInstructions = document.querySelector('.game-instructions');
    const heroSection = document.querySelector('.hero');

    if (!gameInstructions || !heroSection) {
        return;
    }

    function checkScroll() {
        const heroRect = heroSection.getBoundingClientRect();

        // If the bottom of hero section has gone above viewport
        if (heroRect.bottom <= 0) {
            gameInstructions.classList.add('hidden');
        } else {
            gameInstructions.classList.remove('hidden');
        }
    }

    window.addEventListener('scroll', checkScroll);

    // Check immediately to set initial state
    checkScroll();
}

function handleGameState() {
    const heroSection = document.querySelector('.hero');
    const gameInterface = window.gameInterface;

    if (heroSection && gameInterface) {
        window.addEventListener('scroll', function () {
            const heroBottom = heroSection.offsetTop + heroSection.offsetHeight;
            const scrollPosition = window.scrollY + window.innerHeight / 2;

            // Pause game when scrolled past hero section
            if (scrollPosition > heroBottom) {
                gameInterface.pauseGame();
            } else {
                gameInterface.startGame();
            }
        });
    }
}

function addProjectCardEffects() {
    const projectCards = document.querySelectorAll('.project-card');

    projectCards.forEach(card => {
        // Add tilt effect
        card.addEventListener('mousemove', function (e) {
            const cardRect = card.getBoundingClientRect();
            const cardCenterX = cardRect.left + cardRect.width / 2;
            const cardCenterY = cardRect.top + cardRect.height / 2;

            const mouseX = e.clientX;
            const mouseY = e.clientY;

            // Calculate percentage distance from center (-1 to 1)
            const rotateY = ((mouseX - cardCenterX) / (cardRect.width / 2)) * 5;
            const rotateX = ((cardCenterY - mouseY) / (cardRect.height / 2)) * 5;

            // Apply rotation
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
        });

        // Reset on mouse leave
        card.addEventListener('mouseleave', function () {
            card.style.transform = '';
        });
    });
}

function initStickyImage() {
    const aboutSection = document.querySelector('.about');
    const aboutImage = document.querySelector('.about-image');
    const profileImg = document.querySelector('.profile-img');
    if (!aboutSection || !aboutImage || !profileImg) return;
    if (window.innerWidth <= 992) return;
    window.addEventListener('scroll', function () {
        const rect = aboutSection.getBoundingClientRect();
        if (rect.top <= 0 && rect.bottom >= window.innerHeight) {
            const scrollPosition = window.scrollY - aboutSection.offsetTop;
            const parallaxValue = scrollPosition * 0.05;
            if (parallaxValue > 0 && parallaxValue < 40) {
                profileImg.style.transform = `translateY(${parallaxValue}px)`;
            }
        }
    });

    const aboutTextElements = document.querySelectorAll('.about-text p, .about-text .skill-section, .about-text .interests-section, .about-text .education-section');

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('slide-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    aboutTextElements.forEach(element => {
        observer.observe(element);
        element.classList.add('hidden-element');
    });
}
