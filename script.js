// ===== DOM Ready =====
document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initTypewriter();
    initScrollReveal();
    initCounters();
    fetchGitHubProjects();
    initProjectFilters();
});

// ===== Navigation =====
function initNavigation() {
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('nav-toggle');
    const navLinks = document.getElementById('nav-links');
    const links = document.querySelectorAll('.nav-link');

    // Scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 80) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Active link tracking
        const sections = document.querySelectorAll('section[id]');
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 150;
            if (scrollY >= sectionTop) {
                current = section.getAttribute('id');
            }
        });

        links.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });

    // Mobile toggle
    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    // Close mobile nav on link click
    links.forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });
}

// ===== Typewriter Effect =====
function initTypewriter() {
    const element = document.getElementById('typewriter');
    const phrases = [
        'Software Developer',
        'Machine Learning Engineer',
        'Computer Vision Enthusiast',
        'Full Stack Developer',
        'Deep Learning Explorer',
    ];
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function type() {
        const current = phrases[phraseIndex];

        if (isDeleting) {
            element.textContent = current.substring(0, charIndex - 1);
            charIndex--;
        } else {
            element.textContent = current.substring(0, charIndex + 1);
            charIndex++;
        }

        let delay = isDeleting ? 40 : 80;

        if (!isDeleting && charIndex === current.length) {
            delay = 2000;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            delay = 400;
        }

        setTimeout(type, delay);
    }

    setTimeout(type, 1000);
}

// ===== Scroll Reveal =====
function initScrollReveal() {
    const reveals = document.querySelectorAll('.reveal');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, index * 100);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    reveals.forEach(el => observer.observe(el));
}

// ===== Animated Counters =====
function initCounters() {
    const counters = document.querySelectorAll('[data-target]');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = parseInt(entry.target.getAttribute('data-target'));
                animateCounter(entry.target, target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(el => observer.observe(el));
}

function animateCounter(element, target) {
    let current = 0;
    const duration = 2000;
    const stepTime = Math.max(Math.floor(duration / target), 30);
    const increment = Math.max(1, Math.floor(target / (duration / stepTime)));

    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        element.textContent = current;
    }, stepTime);
}

// ===== Skill Bar Animation =====
function initSkillBars() {
    const skillFills = document.querySelectorAll('.skill-fill');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const width = entry.target.getAttribute('data-width');
                entry.target.style.width = width + '%';
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    skillFills.forEach(el => observer.observe(el));
}

// Initialize skill bars after DOM loads
setTimeout(initSkillBars, 300);

// ===== Fetch GitHub Projects =====
async function fetchGitHubProjects() {
    const grid = document.getElementById('projects-grid');

    try {
        const response = await fetch('https://api.github.com/users/nandhubabu/repos?sort=updated&per_page=100');
        const repos = await response.json();

        // Filter: non-fork, has code, sorted by most recently pushed
        const featured = repos
            .filter(r => !r.fork && r.size > 0)
            .sort((a, b) => new Date(b.pushed_at) - new Date(a.pushed_at))
            .slice(0, 12);

        grid.innerHTML = '';

        featured.forEach((repo, index) => {
            const card = createProjectCard(repo, index);
            grid.appendChild(card);
        });

        // Re-init filters after cards are loaded
        initProjectFilters();
        // Re-observe for scroll reveal
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, { threshold: 0.1 });
        grid.querySelectorAll('.reveal').forEach(el => observer.observe(el));

    } catch (err) {
        grid.innerHTML = `
            <div class="projects-loading">
                <p>Unable to load projects. <a href="https://github.com/nandhubabu?tab=repositories" target="_blank" style="color: var(--accent-cyan);">View on GitHub →</a></p>
            </div>
        `;
    }
}

function createProjectCard(repo, index) {
    const card = document.createElement('div');
    card.className = 'project-card glass-card reveal';
    card.setAttribute('data-language', repo.language || 'other');
    card.style.transitionDelay = `${index * 0.05}s`;

    const description = repo.description || getProjectDescription(repo.name);
    const langColor = getLanguageColor(repo.language);
    const formattedDate = new Date(repo.pushed_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short'
    });

    card.innerHTML = `
        <div class="project-card-header">
            <div class="project-icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
                </svg>
            </div>
            <div class="project-links">
                <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer" title="View Source">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                </a>
                ${repo.homepage ? `
                <a href="${repo.homepage}" target="_blank" rel="noopener noreferrer" title="Live Demo">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                        <polyline points="15 3 21 3 21 9"></polyline>
                        <line x1="10" y1="14" x2="21" y2="3"></line>
                    </svg>
                </a>` : ''}
            </div>
        </div>
        <h3>${formatRepoName(repo.name)}</h3>
        <p>${description}</p>
        <div class="project-meta">
            ${repo.language ? `
            <div class="project-language">
                <span class="lang-dot" style="background: ${langColor}"></span>
                <span>${repo.language}</span>
            </div>` : ''}
            <div class="project-stats">
                <span>⭐ ${repo.stargazers_count}</span>
                <span>🍴 ${repo.forks_count}</span>
                <span>📅 ${formattedDate}</span>
            </div>
        </div>
    `;

    return card;
}

function formatRepoName(name) {
    return name
        .replace(/-/g, ' ')
        .replace(/_/g, ' ')
        .replace(/\b\w/g, l => l.toUpperCase());
}

function getProjectDescription(name) {
    const descriptions = {
        'Mushroom_Farm': 'IoT-based mushroom farm automation system with sensor monitoring and environmental controls.',
        'DMS_with_Action': 'Driver Monitoring System with real-time action detection for enhanced road safety.',
        'Driver-Drowsiness-Detection': 'Real-time driver drowsiness detection using computer vision and facial landmark analysis.',
        'RL-Dino-Game': 'Reinforcement learning agent trained to play the Chrome Dino game autonomously.',
        'Food-Classification': 'Deep learning model for classifying food items from images with a web interface.',
        'v2x_hub': 'Vehicle-to-Everything (V2X) communication hub for coordinating connected vehicles.',
        'Xmas-tour': 'Interactive Christmas-themed web experience with animations and holiday visuals.',
        'Face-Recognition-Attendance-System': 'Automated attendance system using face recognition technology.',
        'Summerizer-and-Question-Genarator': 'AI-powered text summarization and question generation tool using NLP.',
        'Music-Recommendation-System': 'Machine learning-based music recommendation engine.',
        'V2X-Delay-Simulator': 'Simulation tool for testing V2X communication delay scenarios.',
        'EduPlatform-backend': 'Backend API for an educational platform built with Node.js.',
        'EduPlatform-frontend': 'React-based frontend for the EduPlatform educational system.',
        'Portfolio': 'Personal portfolio website showcasing projects and skills.',
        'Newsmate': 'News aggregation and summarization web application.',
        'Pytorch': 'Collection of PyTorch deep learning experiments and implementations.',
        'Basic-Repo-rector': 'Python tool for automating basic repository restructuring tasks.',
        'Person-recognition-and-age-emotion-detection': 'Computer vision system for person recognition, age estimation, and emotion detection.',
        'nandhubabu': 'GitHub profile README configuration repository.',
        'Weather_identifier': 'Weather identification and forecasting web application.',
        'Pass-2-Assembler': 'Implementation of a two-pass assembler for system software.',
        'AI_samasya_FrontEnd': 'Frontend for AI Samasya problem-solving platform.',
        'java': 'Collection of Java programming exercises and implementations.',
        'My-Portfolio': 'Personal portfolio website with modern design.',
        'My-Portfolio-': 'Portfolio website with Next.js and Vercel deployment.',
    };

    return descriptions[name] || 'A project exploring modern software development techniques.';
}

function getLanguageColor(language) {
    const colors = {
        'Python': '#3572A5',
        'JavaScript': '#f1e05a',
        'TypeScript': '#3178c6',
        'Java': '#b07219',
        'CSS': '#563d7c',
        'HTML': '#e34c26',
        'C': '#555555',
        'C++': '#f34b7d',
        'Jupyter Notebook': '#DA5B0B',
    };
    return colors[language] || '#8892b0';
}

// ===== Project Filters =====
function initProjectFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.getAttribute('data-filter');

            projectCards.forEach(card => {
                const lang = card.getAttribute('data-language');
                if (filter === 'all') {
                    card.style.display = '';
                } else if (filter === 'other') {
                    card.style.display = (lang !== 'Python' && lang !== 'JavaScript') ? '' : 'none';
                } else {
                    card.style.display = lang === filter ? '' : 'none';
                }
            });
        });
    });
}

