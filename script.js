// Mobile Menu Toggle
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
const links = document.querySelectorAll('.nav-links li');

if (hamburger) {
    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');

        // Hamburger Animation
        hamburger.classList.toggle('toggle');
    });
}

// Close menu when clicking a link
links.forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        if (hamburger) hamburger.classList.remove('toggle');
    });
});

// Sticky Header
const header = document.querySelector('#header');
const hero = document.querySelector('.hero');

window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        header.style.boxShadow = '0 5px 15px rgba(0,0,0,0.1)';
        header.style.padding = '0';
    } else {
        header.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
    }
});

// Smooth Scroll for Anchor Links (Polyfill-like behavior if needed, though CSS handles it)
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();

        const targetId = this.getAttribute('href');
        if (targetId === '#') return;

        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            // Offset for fixed header
            const headerOffset = 80;
            const elementPosition = targetElement.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: "smooth"
            });
        }
    });
});

// Intersection Observer for Scroll Animations
const observerOptions = {
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Apply animation to sections
document.querySelectorAll('.section-title, .card, .about-text, .about-image').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'all 0.8s ease-out';
    observer.observe(el);
});

// Gallery Carousel
const track = document.querySelector('.gallery-track');
const slides = Array.from(track.children);
const nextButton = document.querySelector('.next-btn');
const prevButton = document.querySelector('.prev-btn');
const dotsNav = document.querySelector('.gallery-nav');
const dots = Array.from(dotsNav.children);

if (track && slides.length > 0) {
    const slideWidth = slides[0].getBoundingClientRect().width;

    // Arrange the slides next to one another
    const setSlidePosition = (slide, index) => {
        slide.style.left = slideWidth * index + 'px';
    };
    slides.forEach(setSlidePosition);

    const moveToSlide = (track, currentSlide, targetSlide) => {
        track.style.transform = 'translateX(-' + targetSlide.style.left + ')';
        currentSlide.classList.remove('current-slide');
        targetSlide.classList.add('current-slide');
    };

    const updateDots = (currentDot, targetDot) => {
        currentDot.classList.remove('current-dot');
        targetDot.classList.add('current-dot');
    };

    // When I click left, move slides to the left
    prevButton.addEventListener('click', e => {
        const currentSlide = track.querySelector('.current-slide');
        const prevSlide = currentSlide.previousElementSibling || slides[slides.length - 1]; // Loop to last
        const currentDot = dotsNav.querySelector('.current-dot');
        const prevDot = currentDot.previousElementSibling || dots[dots.length - 1]; // Loop to last

        moveToSlide(track, currentSlide, prevSlide);
        updateDots(currentDot, prevDot);
    });

    // When I click right, move slides to the right
    nextButton.addEventListener('click', e => {
        const currentSlide = track.querySelector('.current-slide');
        const nextSlide = currentSlide.nextElementSibling || slides[0]; // Loop to first
        const currentDot = dotsNav.querySelector('.current-dot');
        const nextDot = currentDot.nextElementSibling || dots[0]; // Loop to first

        moveToSlide(track, currentSlide, nextSlide);
        updateDots(currentDot, nextDot);
    });

    // When I click the nav indicators, move to that slide
    dotsNav.addEventListener('click', e => {
        // what indicator was clicked on?
        const targetDot = e.target.closest('button');

        if (!targetDot) return;

        const currentSlide = track.querySelector('.current-slide');
        const currentDot = dotsNav.querySelector('.current-dot');
        const targetIndex = dots.findIndex(dot => dot === targetDot);
        const targetSlide = slides[targetIndex];

        moveToSlide(track, currentSlide, targetSlide);
        updateDots(currentDot, targetDot);
    });

    // Auto Play
    let autoPlayInterval = setInterval(() => {
        const currentSlide = track.querySelector('.current-slide');
        const nextSlide = currentSlide.nextElementSibling || slides[0];
        const currentDot = dotsNav.querySelector('.current-dot');
        const nextDot = currentDot.nextElementSibling || dots[0];

        moveToSlide(track, currentSlide, nextSlide);
        updateDots(currentDot, nextDot);
    }, 5000);

    // Pause on hover
    const galleryContainer = document.querySelector('.gallery-carousel');
    galleryContainer.addEventListener('mouseenter', () => {
        clearInterval(autoPlayInterval);
    });

    galleryContainer.addEventListener('mouseleave', () => {
        autoPlayInterval = setInterval(() => {
            const currentSlide = track.querySelector('.current-slide');
            const nextSlide = currentSlide.nextElementSibling || slides[0];
            const currentDot = dotsNav.querySelector('.current-dot');
            const nextDot = currentDot.nextElementSibling || dots[0];

            moveToSlide(track, currentSlide, nextSlide);
            updateDots(currentDot, nextDot);
        }, 5000);
    });

    // Handle resize to reset positions
    window.addEventListener('resize', () => {
        const newSlideWidth = slides[0].getBoundingClientRect().width;
        slides.forEach((slide, index) => {
            slide.style.left = newSlideWidth * index + 'px';
        });
        // Reset to current slide position
        const currentSlide = track.querySelector('.current-slide');
        track.style.transform = 'translateX(-' + currentSlide.style.left + ')';
    });
}
