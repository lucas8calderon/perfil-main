// Mobile Navigation
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');
const navLinks = document.querySelectorAll('.nav-link');

// Toggle mobile menu
hamburger.addEventListener('click', () => {
	hamburger.classList.toggle('active');
  navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
navLinks.forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
  });
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
  if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
  }
});

// Header scroll effect
const header = document.getElementById('header');
let lastScrollY = window.scrollY;

window.addEventListener('scroll', () => {
  const currentScrollY = window.scrollY;
  updateHeaderStyles();
  lastScrollY = currentScrollY;
});

// Dark/Light Theme Toggle
const themeToggle = document.querySelector('.theme-toggle');
const themeIcon = document.getElementById('theme-icon');
const body = document.body;

// Check for saved theme preference or default to light mode
const currentTheme = localStorage.getItem('theme') || 'light';
body.setAttribute('data-theme', currentTheme);

if (currentTheme === 'dark') {
  themeIcon.className = 'fas fa-sun';
} else {
  themeIcon.className = 'fas fa-moon';
}

// Function to update header styles based on theme
function updateHeaderStyles() {
  const isDarkMode = body.getAttribute('data-theme') === 'dark';
  const currentScrollY = window.scrollY;
  
  if (currentScrollY > 100) {
    if (isDarkMode) {
      header.style.background = 'rgba(17, 24, 39, 0.98)';
      header.style.borderBottom = '1px solid rgba(75, 85, 99, 0.3)';
      header.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)';
    } else {
      header.style.background = 'rgba(255, 255, 255, 0.95)';
      header.style.borderBottom = '1px solid var(--border-color)';
      header.style.boxShadow = 'none';
    }
  } else {
    if (isDarkMode) {
      header.style.background = 'rgba(17, 24, 39, 0.95)';
      header.style.borderBottom = '1px solid rgba(75, 85, 99, 0.2)';
      header.style.boxShadow = 'none';
    } else {
      header.style.background = 'rgba(255, 255, 255, 0.95)';
      header.style.borderBottom = '1px solid var(--border-color)';
      header.style.boxShadow = 'none';
    }
  }
  header.style.backdropFilter = 'blur(10px)';
}

themeToggle.addEventListener('click', () => {
  const currentTheme = body.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  
  body.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
  
  if (newTheme === 'dark') {
    themeIcon.className = 'fas fa-sun';
  } else {
    themeIcon.className = 'fas fa-moon';
  }
  
  // Update header styles when theme changes
  updateHeaderStyles();
});

// Projects Carousel
class Carousel {
  constructor() {
    this.track = document.getElementById('carousel-track');
    this.slides = document.querySelectorAll('.carousel-slide');
    this.indicators = document.querySelectorAll('.indicator');
    this.prevBtn = document.getElementById('prev-btn');
    this.nextBtn = document.getElementById('next-btn');
    this.currentSlide = 0;
    this.slideCount = this.slides.length;
    this.autoSlideInterval = null;
    
    this.init();
  }
  
  init() {
    console.log('Carousel initialized with', this.slideCount, 'slides');
    console.log('Slides found:', this.slides);
    console.log('Track element:', this.track);
    
    // Verify all slides are found
    if (this.slideCount === 0) {
      console.error('No slides found!');
      return;
    }
    
    // Log each slide
    this.slides.forEach((slide, index) => {
      console.log(`Slide ${index}:`, slide);
    });
    
    this.showSlide(0);
    this.bindEvents();
    this.startAutoSlide();
  }
  
  bindEvents() {
    this.prevBtn.addEventListener('click', () => this.prevSlide());
    this.nextBtn.addEventListener('click', () => this.nextSlide());
    
    this.indicators.forEach((indicator, index) => {
      indicator.addEventListener('click', () => this.goToSlide(index));
    });
    
    // Pause auto-slide on hover
    this.track.addEventListener('mouseenter', () => this.stopAutoSlide());
    this.track.addEventListener('mouseleave', () => this.startAutoSlide());
    
    // Touch/swipe support
    let startX = 0;
    let endX = 0;
    
    this.track.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
    });
    
    this.track.addEventListener('touchend', (e) => {
      endX = e.changedTouches[0].clientX;
      this.handleSwipe(startX, endX);
    });
  }
  
  handleSwipe(startX, endX) {
    const threshold = 50;
    const diff = startX - endX;
    
    if (Math.abs(diff) > threshold) {
      if (diff > 0) {
        this.nextSlide();
	} else {
        this.prevSlide();
      }
    }
  }
  
  showSlide(slideIndex) {
    // Hide all slides
    this.slides.forEach((slide, index) => {
      slide.style.display = index === slideIndex ? 'block' : 'none';
      slide.classList.toggle('active', index === slideIndex);
    });
    
    // Update indicators
    this.indicators.forEach((indicator, index) => {
      indicator.classList.toggle('active', index === slideIndex);
    });
    
    console.log('Showing slide:', slideIndex);
  }
  
  goToSlide(slideIndex) {
    this.currentSlide = slideIndex;
    this.showSlide(slideIndex);
  }
  
  nextSlide() {
    this.currentSlide = (this.currentSlide + 1) % this.slideCount;
    this.showSlide(this.currentSlide);
  }
  
  prevSlide() {
    this.currentSlide = this.currentSlide === 0 ? this.slideCount - 1 : this.currentSlide - 1;
    this.showSlide(this.currentSlide);
  }
  
  startAutoSlide() {
    this.autoSlideInterval = setInterval(() => {
      this.nextSlide();
    }, 5000);
  }
  
  stopAutoSlide() {
    if (this.autoSlideInterval) {
      clearInterval(this.autoSlideInterval);
      this.autoSlideInterval = null;
    }
  }
}

// Initialize carousel when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('carousel-track')) {
    new Carousel();
  }
  
  // Initialize header styles
  updateHeaderStyles();
});

// Intersection Observer for animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('animate');
      
      // Animate skill bars
      if (entry.target.classList.contains('skill-bar')) {
        const level = entry.target.getAttribute('data-level');
        entry.target.style.setProperty('--width', level + '%');
      }
    }
  });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
  // Observe skill bars
  document.querySelectorAll('.skill-bar').forEach(bar => {
    observer.observe(bar);
  });
  
  // Observe timeline items
  document.querySelectorAll('.timeline-item').forEach(item => {
    observer.observe(item);
  });
  
  // Observe project cards
  document.querySelectorAll('.project-card').forEach(card => {
    observer.observe(card);
  });
  
  // Observe about stats
  document.querySelectorAll('.stat-item').forEach(stat => {
    observer.observe(stat);
  });
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      const headerHeight = document.getElementById('header').offsetHeight;
      const targetPosition = target.offsetTop - headerHeight;
      
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    }
  });
});

// Contact form handling
const contactForm = document.getElementById('contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(this);
    const name = formData.get('name');
    const email = formData.get('email');
    const subject = formData.get('subject');
    const message = formData.get('message');
    
    // Create mailto link
    const mailtoLink = `mailto:lucas8calderon@hotmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`Nome: ${name}\nEmail: ${email}\n\nMensagem:\n${message}`)}`;
    
    // Open email client
    window.location.href = mailtoLink;
    
    // Show success message
    const submitBtn = this.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-check"></i> Enviado!';
    submitBtn.style.background = 'var(--accent-color)';
    
    setTimeout(() => {
      submitBtn.innerHTML = originalText;
      submitBtn.style.background = '';
      this.reset();
    }, 3000);
  });
}

// Parallax effect for hero section
window.addEventListener('scroll', () => {
  const scrolled = window.pageYOffset;
  const hero = document.getElementById('hero');
  if (hero) {
    const rate = scrolled * -0.5;
    hero.style.transform = `translateY(${rate}px)`;
  }
});

// Add loading animation
window.addEventListener('load', () => {
  document.body.classList.add('loaded');
});

// Add typing effect to hero title
function typeWriter(element, text, speed = 100) {
  let i = 0;
  element.innerHTML = '';
  
  function type() {
    if (i < text.length) {
      element.innerHTML += text.charAt(i);
      i++;
      setTimeout(type, speed);
    }
  }
  
  type();
}

// Initialize typing effect when page loads
document.addEventListener('DOMContentLoaded', () => {
  const heroName = document.querySelector('.hero-name');
  if (heroName) {
    const originalText = heroName.textContent;
    setTimeout(() => {
      typeWriter(heroName, originalText, 150);
    }, 1000);
  }
});

// Add scroll progress indicator
function createScrollProgress() {
  const progressBar = document.createElement('div');
  progressBar.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 0%;
    height: 3px;
    background: linear-gradient(90deg, #667eea, #764ba2);
    z-index: 9999;
    transition: width 0.1s ease;
  `;
  document.body.appendChild(progressBar);
  
  window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset;
    const docHeight = document.body.offsetHeight - window.innerHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;
    progressBar.style.width = scrollPercent + '%';
  });
}

// Initialize scroll progress
createScrollProgress();

// Add hover effects to floating icons
document.addEventListener('DOMContentLoaded', () => {
  const floatingIcons = document.querySelectorAll('.floating-icon');
  
  floatingIcons.forEach(icon => {
    icon.addEventListener('mouseenter', () => {
      icon.style.transform = 'scale(1.2) rotate(360deg)';
      icon.style.transition = 'transform 0.5s ease';
    });
    
    icon.addEventListener('mouseleave', () => {
      icon.style.transform = 'scale(1) rotate(0deg)';
    });
	});
});

// Add particle effect to hero section
function createParticles() {
  const hero = document.getElementById('hero');
  if (!hero) return;
  
  const particleCount = 50;
  
  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    particle.style.cssText = `
      position: absolute;
      width: 2px;
      height: 2px;
      background: rgba(255, 255, 255, 0.5);
      border-radius: 50%;
      pointer-events: none;
      animation: float ${Math.random() * 3 + 2}s ease-in-out infinite;
      left: ${Math.random() * 100}%;
      top: ${Math.random() * 100}%;
      animation-delay: ${Math.random() * 2}s;
    `;
    hero.appendChild(particle);
  }
}

// Initialize particles
createParticles();