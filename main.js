// ============================================
// PORTFOLIO SITE - MAIN.JS
// Modern, modular JavaScript for dynamic features
// ============================================

// ============================================
// 1. UTILITY FUNCTIONS
// ============================================

const utils = {
  // Debounce function for performance
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },

  // Smooth scroll to element
  smoothScroll(target) {
    const element = document.querySelector(target);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  },

  // Get stored theme preference
  getTheme() {
    return localStorage.getItem('theme') || 'dark';
  },

  // Set theme preference
  setTheme(theme) {
    localStorage.setItem('theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  }
};

// ============================================
// 2. THEME MANAGER
// ============================================

class ThemeManager {
  constructor() {
    this.init();
  }

  init() {
    // Apply saved theme
    const savedTheme = utils.getTheme();
    utils.setTheme(savedTheme);

    // Create theme toggle button
    this.createToggleButton();
  }

  createToggleButton() {
    const nav = document.querySelector('.nav-links');
    if (!nav) return;

    const themeToggle = document.createElement('li');
    themeToggle.innerHTML = `
      <button class="theme-toggle" aria-label="Toggle theme">
        <span class="theme-icon">🌙</span>
      </button>
    `;
    nav.appendChild(themeToggle);

    const button = themeToggle.querySelector('.theme-toggle');
    this.updateIcon(button);

    button.addEventListener('click', () => this.toggle(button));
  }

  toggle(button) {
    const current = utils.getTheme();
    const newTheme = current === 'dark' ? 'light' : 'dark';
    utils.setTheme(newTheme);
    this.updateIcon(button);
  }

  updateIcon(button) {
    const icon = button.querySelector('.theme-icon');
    icon.textContent = utils.getTheme() === 'dark' ? '☀️' : '🌙';
  }
}

// ============================================
// 3. INTERSECTION OBSERVER (Scroll Animations)
// ============================================

class ScrollAnimator {
  constructor() {
    this.init();
  }

  init() {
    const options = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          this.observer.unobserve(entry.target);
        }
      });
    }, options);

    this.observe();
  }

  observe() {
    const elements = document.querySelectorAll('.fade-up, .slide-in-left, .slide-in-right');
    elements.forEach(el => this.observer.observe(el));
  }

  // Call this when new elements are added dynamically
  refresh() {
    this.observe();
  }
}

// ============================================
// 4. NAVIGATION HANDLER
// ============================================

class NavigationHandler {
  constructor() {
    this.init();
  }

  init() {
    this.highlightCurrentPage();
    this.addMobileMenu();
    this.addScrollBehavior();
  }

  highlightCurrentPage() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-links a');
    
    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href === currentPage || (currentPage === '' && href === 'index.html')) {
        link.classList.add('active');
      }
    });
  }

  addMobileMenu() {
    const nav = document.querySelector('nav');
    if (!nav) return;

    // Create hamburger button
    const hamburger = document.createElement('button');
    hamburger.className = 'hamburger';
    hamburger.setAttribute('aria-label', 'Toggle menu');
    hamburger.innerHTML = `
      <span></span>
      <span></span>
      <span></span>
    `;

    nav.insertBefore(hamburger, nav.querySelector('.nav-links'));

    // Toggle menu
    hamburger.addEventListener('click', () => {
      const navLinks = document.querySelector('.nav-links');
      navLinks.classList.toggle('active');
      hamburger.classList.toggle('active');
    });
  }

  addScrollBehavior() {
    let lastScroll = 0;
    const header = document.querySelector('header');

    window.addEventListener('scroll', utils.debounce(() => {
      const currentScroll = window.pageYOffset;

      if (currentScroll <= 0) {
        header.classList.remove('scroll-up', 'scroll-down');
        return;
      }

      if (currentScroll > lastScroll && currentScroll > 100) {
        // Scrolling down
        header.classList.add('scroll-down');
        header.classList.remove('scroll-up');
      } else {
        // Scrolling up
        header.classList.add('scroll-up');
        header.classList.remove('scroll-down');
      }

      lastScroll = currentScroll;
    }, 100));
  }
}

// ============================================
// 5. PROJECTS MANAGER (for projects page)
// ============================================

class ProjectsManager {
  constructor() {
    this.projects = [
      {
        id: 1,
        title: "Media Server Automation Platform",
        category: ["homelab", "media"],
        image: "assets/plex.png",
        description: "Designed and deployed a modular media platform using multiple LXC containers on Proxmox with shared ZFS storage. Each service runs independently for improved reliability, security, and scalability.",
        technologies: ["Proxmox VE", "LXC", "ZFS", "Plex", "Radarr", "Sonarr", "Prowlarr", "Overseerr", "qBittorrent"],
        features: [
          "Service isolation with LXC containers",
          "Shared ZFS storage with proper permissions",
          "Automated media acquisition pipeline",
          "Migration planning to Docker architecture"
        ],
        github: "#",
        demo: "#"
      },
      {
        id: 2,
        title: "Secure Remote Access with Cloudflare Zero Trust",
        category: ["security", "networking"],
        image: "assets/cloudflare.png",
        description: "Implemented secure external access to internal services without exposing ports to the public internet. All traffic is routed through Cloudflare Tunnel and managed with Nginx Proxy Manager.",
        technologies: ["Cloudflare Tunnel", "Nginx Proxy Manager", "Docker", "Portainer", "DNS", "SSL/TLS"],
        features: [
          "Zero Trust network architecture",
          "Reverse proxy with automatic SSL",
          "No open inbound ports",
          "Centralized access management"
        ],
        github: "#",
        demo: "#"
      },
      {
        id: 3,
        title: "Infrastructure Automation & Monitoring",
        category: ["automation"],
        image: "assets/automation.png",
        description: "Developed scripts and workflows to automate routine homelab tasks such as backups, service monitoring, and system maintenance to improve reliability and efficiency.",
        technologies: ["Bash", "Python", "Linux", "cron", "Docker"],
        features: [
          "Automated backup solutions",
          "Service health monitoring",
          "Alert notifications",
          "System maintenance scripts"
        ],
        github: "#",
        demo: "#"
      }
    ];

    this.currentFilter = 'all';
    this.init();
  }

  init() {
    if (!document.querySelector('.projects-grid')) return;
    
    this.setupFilters();
    this.renderProjects();
    this.setupModals();
  }

  setupFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        this.currentFilter = button.dataset.filter;
        this.renderProjects();
      });
    });
  }

  renderProjects() {
    const grid = document.querySelector('.projects-grid');
    if (!grid) return;

    grid.innerHTML = '';

    const filtered = this.currentFilter === 'all' 
      ? this.projects 
      : this.projects.filter(p => p.category.includes(this.currentFilter));

    filtered.forEach((project, index) => {
      const card = this.createProjectCard(project, index);
      grid.appendChild(card);
    });

    // Refresh scroll animations
    if (window.scrollAnimator) {
      window.scrollAnimator.refresh();
    }
  }

  createProjectCard(project, index) {
    const article = document.createElement('article');
    article.className = 'project-card fade-up';
    article.style.animationDelay = `${index * 0.1}s`;
    article.dataset.projectId = project.id;

    article.innerHTML = `
      <img src="${project.image}" alt="${project.title}" class="project-img">
      <h3>${project.title}</h3>
      <p>${project.description.substring(0, 120)}...</p>
      <div class="project-tags">
        ${project.technologies.slice(0, 3).map(tech => 
          `<span class="tag">${tech}</span>`
        ).join('')}
      </div>
      <button class="btn btn-sm view-details" data-id="${project.id}">
        View Details →
      </button>
    `;

    article.querySelector('.view-details').addEventListener('click', (e) => {
      e.stopPropagation();
      this.showProjectModal(project);
    });

    return article;
  }

  setupModals() {
    // Modal will be created on demand
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('modal-backdrop')) {
        this.closeModal();
      }
    });
  }

  showProjectModal(project) {
    const modal = this.createModal(project);
    document.body.appendChild(modal);
    
    setTimeout(() => modal.classList.add('active'), 10);
    document.body.style.overflow = 'hidden';
  }

  createModal(project) {
    const modal = document.createElement('div');
    modal.className = 'modal-backdrop';
    
    modal.innerHTML = `
      <div class="modal-container">
        <button class="modal-close">&times;</button>
        <div class="modal-header">
          <img src="${project.image}" alt="${project.title}">
          <h2>${project.title}</h2>
        </div>
        <div class="modal-body">
          <p class="modal-description">${project.description}</p>
          
          <div class="modal-section">
            <h3>Key Features</h3>
            <ul class="features-list">
              ${project.features.map(f => `<li>${f}</li>`).join('')}
            </ul>
          </div>

          <div class="modal-section">
            <h3>Technologies Used</h3>
            <div class="tech-tags">
              ${project.technologies.map(tech => 
                `<span class="tag">${tech}</span>`
              ).join('')}
            </div>
          </div>

          <div class="modal-actions">
            <a href="${project.github}" class="btn btn-outline">View on GitHub</a>
            <a href="${project.demo}" class="btn">Live Demo</a>
          </div>
        </div>
      </div>
    `;

    modal.querySelector('.modal-close').addEventListener('click', () => this.closeModal());
    
    return modal;
  }

  closeModal() {
    const modal = document.querySelector('.modal-backdrop');
    if (modal) {
      modal.classList.remove('active');
      setTimeout(() => {
        modal.remove();
        document.body.style.overflow = '';
      }, 300);
    }
  }
}

// ============================================
// 6. SKILLS MANAGER (for homepage)
// ============================================

class SkillsManager {
  constructor() {
    this.init();
  }

  init() {
    const skills = document.querySelectorAll('.skill');
    if (!skills.length) return;

    skills.forEach(skill => {
      skill.addEventListener('click', () => this.showSkillModal(skill));
    });
  }

  showSkillModal(skillElement) {
    const title = skillElement.dataset.title;
    const description = skillElement.dataset.description;

    const modal = document.createElement('div');
    modal.className = 'modal-backdrop active';
    
    modal.innerHTML = `
      <div class="modal-container">
        <button class="modal-close">&times;</button>
        <div class="modal-header">
          <h2>${title}</h2>
        </div>
        <div class="modal-body">
          <p>${description}</p>
        </div>
      </div>
    `;

    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';

    modal.querySelector('.modal-close').addEventListener('click', () => {
      modal.classList.remove('active');
      setTimeout(() => {
        modal.remove();
        document.body.style.overflow = '';
      }, 300);
    });

    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.querySelector('.modal-close').click();
      }
    });
  }
}

// ============================================
// 7. TYPING ANIMATION (for hero section)
// ============================================

class TypingAnimation {
  constructor(element, words, typingSpeed = 100, deletingSpeed = 50, pauseTime = 2000) {
    this.element = element;
    this.words = words;
    this.typingSpeed = typingSpeed;
    this.deletingSpeed = deletingSpeed;
    this.pauseTime = pauseTime;
    this.wordIndex = 0;
    this.charIndex = 0;
    this.isDeleting = false;
    
    if (element) this.type();
  }

  type() {
    const currentWord = this.words[this.wordIndex];
    
    if (this.isDeleting) {
      this.element.textContent = currentWord.substring(0, this.charIndex - 1);
      this.charIndex--;
    } else {
      this.element.textContent = currentWord.substring(0, this.charIndex + 1);
      this.charIndex++;
    }

    let typeSpeed = this.isDeleting ? this.deletingSpeed : this.typingSpeed;

    if (!this.isDeleting && this.charIndex === currentWord.length) {
      typeSpeed = this.pauseTime;
      this.isDeleting = true;
    } else if (this.isDeleting && this.charIndex === 0) {
      this.isDeleting = false;
      this.wordIndex = (this.wordIndex + 1) % this.words.length;
    }

    setTimeout(() => this.type(), typeSpeed);
  }
}

// ============================================
// 8. CONTACT FORM HANDLER
// ============================================

class ContactFormHandler {
  constructor() {
    this.init();
  }

  init() {
    const form = document.querySelector('.contact-form');
    if (!form) return;

    form.addEventListener('submit', (e) => this.handleSubmit(e));
  }

  async handleSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);

    // Here you would typically send to a backend
    console.log('Form submitted:', data);

    // Show success message
    this.showMessage('Message sent successfully!', 'success');
    e.target.reset();
  }

  showMessage(text, type) {
    const message = document.createElement('div');
    message.className = `form-message ${type}`;
    message.textContent = text;

    const form = document.querySelector('.contact-form');
    form.appendChild(message);

    setTimeout(() => message.remove(), 3000);
  }
}

// ============================================
// 9. INITIALIZE EVERYTHING
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  // Initialize core features
  window.themeManager = new ThemeManager();
  window.scrollAnimator = new ScrollAnimator();
  window.navigationHandler = new NavigationHandler();

  // Initialize page-specific features
  window.projectsManager = new ProjectsManager();
  window.skillsManager = new SkillsManager();
  window.contactFormHandler = new ContactFormHandler();

  // Add typing animation to hero if exists
  const typingElement = document.querySelector('.typing-text');
  if (typingElement) {
    new TypingAnimation(typingElement, [
      'IT Professional',
      'Cybersecurity Enthusiast',
      'Homelab Builder',
      'Automation Expert'
    ]);
  }

  // Add page load animation
  document.body.classList.add('loaded');

  console.log('✅ Portfolio initialized with modern JavaScript features!');
});