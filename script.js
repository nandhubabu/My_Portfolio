// ===== DOM Ready =====
document.addEventListener('DOMContentLoaded', () => {
    initNavDock();
    initScrollProgress();
    initTypewriter();
    initScrollReveal();
    initCounters();
    initSkillBars();
    initProjectFilters();
    initEmailCopy();
    initParticleCanvas();
    initCursorGlow();
    initHeroParallax();
    initCardTilt();
    fetchGitHubProjects();
    fetchGitHubProfile();
});

// ===== Scroll Progress Bar =====
function initScrollProgress() {
    const progressBar = document.getElementById('scroll-progress');
    if (!progressBar) return;

    function updateProgress() {
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
        progressBar.style.width = `${progress}%`;
    }

    window.addEventListener('scroll', updateProgress, { passive: true });
    updateProgress();
}

// ===== Navigation Dock =====
function initNavDock() {
    const links = document.querySelectorAll('.nav-dock-link');
    const sections = document.querySelectorAll('section[id]');

    function updateActiveNav() {
        const scrollY = window.scrollY;
        let current = '';

        // Highlight last section if scrolled to bottom of page
        if (window.innerHeight + scrollY >= document.documentElement.scrollHeight - 60) {
            const lastSection = sections[sections.length - 1];
            if (lastSection) {
                current = lastSection.getAttribute('id');
            }
        } else {
            sections.forEach(section => {
                const sectionTop = section.offsetTop - 180;
                if (scrollY >= sectionTop) {
                    current = section.getAttribute('id');
                }
            });
        }

        links.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', updateActiveNav, { passive: true });
    updateActiveNav();
}

// ===== Typewriter Effect =====
function initTypewriter() {
    const element = document.getElementById('typewriter');
    if (!element) return;

    const phrases = [
        'Software Developer',
        'AI & ML Engineer',
        'Computer Vision Specialist',
        'Full Stack Developer',
        'IoT & Embedded Systems Dev',
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
                    observer.unobserve(entry.target);
                }, index * 80);
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
                const target = parseInt(entry.target.getAttribute('data-target'), 10) || 0;
                animateCounter(entry.target, target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(el => observer.observe(el));
}

function animateCounter(element, target) {
    if (target === 0) {
        element.textContent = '0';
        return;
    }
    const duration = 1600;
    const start = performance.now();

    function update(currentTime) {
        const elapsed = currentTime - start;
        const progress = Math.min(elapsed / duration, 1);
        // Smooth ease-out cubic curve
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(easeOut * target);

        element.textContent = current;

        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            element.textContent = target;
        }
    }

    requestAnimationFrame(update);
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
    }, { threshold: 0.2 });

    skillFills.forEach(el => observer.observe(el));
}

// ===== Project Filters =====
function initProjectFilters() {
    const filterContainer = document.querySelector('.projects-filter');
    const grid = document.getElementById('projects-grid');
    if (!filterContainer || !grid) return;

    filterContainer.addEventListener('click', (e) => {
        const btn = e.target.closest('.filter-btn');
        if (!btn) return;

        const filterBtns = filterContainer.querySelectorAll('.filter-btn');
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.getAttribute('data-filter');
        const projectCards = grid.querySelectorAll('.project-card');
        let visibleCount = 0;

        projectCards.forEach(card => {
            const lang = card.getAttribute('data-language');
            let isVisible = false;

            if (filter === 'all') {
                isVisible = true;
            } else if (filter === 'other') {
                isVisible = (lang !== 'Python' && lang !== 'JavaScript' && lang !== 'TypeScript');
            } else {
                isVisible = (lang === filter);
            }

            card.style.display = isVisible ? '' : 'none';
            if (isVisible) visibleCount++;
        });

        // Handle empty filter result
        let emptyState = grid.querySelector('.projects-empty');
        if (visibleCount === 0) {
            if (!emptyState) {
                emptyState = document.createElement('div');
                emptyState.className = 'projects-empty';
                emptyState.textContent = 'No repositories found for this category.';
                grid.appendChild(emptyState);
            }
            emptyState.style.display = 'block';
        } else if (emptyState) {
            emptyState.style.display = 'none';
        }
    });
}

// ===== Interactive Email Copy Feedback =====
function initEmailCopy() {
    const emailCard = document.querySelector('a[href^="mailto:"]');
    if (!emailCard) return;

    emailCard.addEventListener('click', (e) => {
        const email = 'nandhubabuvktd@gmail.com';
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(email).then(() => {
                showToast('Email address copied to clipboard! 📋');
            }).catch(() => {
                showToast('Opening mail client...');
            });
        }
    });
}

let toastTimer = null;
function showToast(message) {
    const toast = document.getElementById('toast');
    const toastMsg = document.getElementById('toast-message');
    if (!toast) return;

    if (toastMsg) toastMsg.textContent = message;
    toast.classList.add('show');

    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
        toast.classList.remove('show');
    }, 2800);
}

// ===== Live GitHub Profile Data Sync =====
async function fetchGitHubProfile() {
    try {
        const response = await fetch('https://api.github.com/users/nandhubabu');
        if (!response.ok) return;
        const profile = await response.json();

        // Dynamically update repo & follower stats if elements are present
        const repoStat = document.querySelector('.stat-item:nth-child(1) .stat-number');
        const followersStat = document.querySelector('.stat-item:nth-child(2) .stat-number');

        if (repoStat && profile.public_repos !== undefined) {
            repoStat.setAttribute('data-target', profile.public_repos);
        }
        if (followersStat && profile.followers !== undefined) {
            followersStat.setAttribute('data-target', profile.followers);
        }
    } catch {
        // Fallback targets already present in HTML
    }
}

// ===== Fetch GitHub Projects =====
async function fetchGitHubProjects() {
    const grid = document.getElementById('projects-grid');
    if (!grid) return;

    try {
        const response = await fetch('https://api.github.com/users/nandhubabu/repos?sort=updated&per_page=100');
        if (!response.ok) {
            throw new Error(`GitHub API error status: ${response.status}`);
        }

        const repos = await response.json();
        if (!Array.isArray(repos)) {
            throw new Error('Response is not an array of repos');
        }

        // Filter: non-fork, has code, sorted by most recently pushed
        const excludedRepos = ['Summerizer-and-Question-Genarator'];
        const featured = repos
            .filter(r => !r.fork && r.size > 0 && !excludedRepos.includes(r.name))
            .sort((a, b) => new Date(b.pushed_at) - new Date(a.pushed_at))
            .slice(0, 12);

        if (featured.length === 0) {
            renderFallbackProjects(grid);
            return;
        }

        grid.innerHTML = '';
        featured.forEach((repo, index) => {
            const card = createProjectCard(repo, index);
            grid.appendChild(card);
        });

        observeProjectCards(grid);

    } catch (err) {
        console.warn('GitHub API fetch failed or rate-limited. Rendering fallback projects.', err);
        renderFallbackProjects(grid);
    }
}

function observeProjectCards(grid) {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    grid.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

// Fallback projects in case GitHub API rate limit is reached or visitor is offline
function renderFallbackProjects(grid) {
    const fallbackRepos = [
        {
            name: 'Gods_eye',
            description: 'AI-powered surveillance system with real-time object detection and intelligent monitoring capabilities.',
            language: 'JavaScript',
            stargazers_count: 0,
            forks_count: 0,
            pushed_at: new Date().toISOString(),
            html_url: 'https://github.com/nandhubabu/Gods_eye'
        },
        {
            name: 'CodeNova-AI',
            description: 'AI-powered code generation and assistance tool leveraging large language models for intelligent coding.',
            language: 'Python',
            stargazers_count: 1,
            forks_count: 0,
            pushed_at: new Date().toISOString(),
            html_url: 'https://github.com/nandhubabu/CodeNova-AI'
        },
        {
            name: 'echo_Real-time-chat-app',
            description: 'Full-stack real-time chat application with Socket.io, user authentication, and live messaging.',
            language: 'JavaScript',
            stargazers_count: 1,
            forks_count: 0,
            pushed_at: new Date().toISOString(),
            html_url: 'https://github.com/nandhubabu/echo_Real-time-chat-app',
            homepage: 'https://echo-real-time-chat-app-psi.vercel.app'
        },
        {
            name: 'Aethel',
            description: 'Modern web application with elegant UI and full-stack architecture deployed on Vercel.',
            language: 'JavaScript',
            stargazers_count: 0,
            forks_count: 0,
            pushed_at: new Date().toISOString(),
            html_url: 'https://github.com/nandhubabu/Aethel',
            homepage: 'https://aethel-five-rouge.vercel.app'
        },
        {
            name: 'EduPlatform',
            description: 'Full-stack educational platform with React frontend and Node.js backend for interactive learning.',
            language: 'JavaScript',
            stargazers_count: 0,
            forks_count: 0,
            pushed_at: new Date().toISOString(),
            html_url: 'https://github.com/nandhubabu/EduPlatform',
            homepage: 'https://edu-platform-jade.vercel.app/'
        },
        {
            name: 'ecommerce',
            description: 'E-commerce platform built with Python featuring product management, cart system, and payment integration.',
            language: 'Python',
            stargazers_count: 0,
            forks_count: 0,
            pushed_at: new Date().toISOString(),
            html_url: 'https://github.com/nandhubabu/ecommerce'
        },
        {
            name: 'V2V_communication_RL_Model',
            description: 'Vehicle-to-Vehicle communication system using Reinforcement Learning for optimized data exchange.',
            language: 'Python',
            stargazers_count: 0,
            forks_count: 0,
            pushed_at: new Date().toISOString(),
            html_url: 'https://github.com/nandhubabu/V2V_communication_RL_Model'
        },
        {
            name: 'DMS_with_Action',
            description: 'Driver Monitoring System with real-time action detection for enhanced road safety.',
            language: 'Python',
            stargazers_count: 0,
            forks_count: 0,
            pushed_at: new Date().toISOString(),
            html_url: 'https://github.com/nandhubabu/DMS_with_Action'
        },
        {
            name: 'Bluetooth_Data_Sender',
            description: 'Android app built with Kotlin for Bluetooth-based data transfer between devices.',
            language: 'Kotlin',
            stargazers_count: 0,
            forks_count: 0,
            pushed_at: new Date().toISOString(),
            html_url: 'https://github.com/nandhubabu/Bluetooth_Data_Sender'
        },
        {
            name: 'RL-Dino-Game',
            description: 'Reinforcement learning agent trained to play the Chrome Dino game autonomously.',
            language: 'Python',
            stargazers_count: 1,
            forks_count: 0,
            pushed_at: new Date().toISOString(),
            html_url: 'https://github.com/nandhubabu/RL-Dino-Game'
        },
        {
            name: 'Newsmate',
            description: 'News aggregation and summarization web app with curated feeds and Vercel deployment.',
            language: 'JavaScript',
            stargazers_count: 0,
            forks_count: 0,
            pushed_at: new Date().toISOString(),
            html_url: 'https://github.com/nandhubabu/Newsmate',
            homepage: 'https://newsmate-one.vercel.app'
        },
        {
            name: 'Mushroom_Farm',
            description: 'IoT-based mushroom farm automation with Raspberry Pi sensor monitoring and environmental controls.',
            language: 'Python',
            stargazers_count: 0,
            forks_count: 0,
            pushed_at: new Date().toISOString(),
            html_url: 'https://github.com/nandhubabu/Mushroom_Farm'
        }
    ];

    grid.innerHTML = '';
    fallbackRepos.forEach((repo, index) => {
        const card = createProjectCard(repo, index);
        grid.appendChild(card);
    });

    observeProjectCards(grid);
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
                <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer" title="View Source" aria-label="View Source on GitHub">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                </a>
                ${repo.homepage ? `
                <a href="${repo.homepage}" target="_blank" rel="noopener noreferrer" title="Live Demo" aria-label="Live Demo">
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
        'Gods_eye': 'AI-powered surveillance system with real-time object detection and intelligent monitoring.',
        'CodeNova-AI': 'AI-powered code generation tool leveraging large language models for intelligent coding assistance.',
        'Aethel': 'Modern web application with elegant UI and full-stack architecture deployed on Vercel.',
        'echo_Real-time-chat-app': 'Full-stack real-time chat app with Socket.io, authentication, and live messaging.',
        'ecommerce': 'E-commerce platform with product management, cart system, and payment integration.',
        'EduPlatform': 'Full-stack educational platform with React frontend and Node.js backend.',
        'V2V_communication_RL_Model': 'Vehicle-to-Vehicle communication using Reinforcement Learning for optimized data exchange.',
        'Bluetooth_Data_Sender': 'Android app built with Kotlin for Bluetooth-based data transfer between devices.',
        'Mushroom_Farm': 'IoT-based mushroom farm automation with Raspberry Pi sensor monitoring and environmental controls.',
        'DMS_with_Action': 'Driver Monitoring System with real-time action detection for enhanced road safety.',
        'Driver-Drowsiness-Detection': 'Real-time driver drowsiness detection using computer vision and facial landmark analysis.',
        'RL-Dino-Game': 'Reinforcement learning agent trained to play the Chrome Dino game autonomously.',
        'Food-Classification': 'Deep learning model for classifying food items from images with a web interface.',
        'v2x_hub': 'Vehicle-to-Everything (V2X) communication hub for coordinating connected vehicles.',
        'Xmas-tour': 'Interactive Christmas-themed web experience with animations and holiday visuals.',
        'Face-Recognition-Attendance-System': 'Automated attendance system using face recognition technology.',
        'Music-Recommendation-System': 'Machine learning-based music recommendation engine.',
        'V2X-Delay-Simulator': 'Simulation tool for testing V2X communication delay scenarios.',
        'EduPlatform-backend': 'Backend API for an educational platform built with Node.js and Express.',
        'EduPlatform-frontend': 'React-based frontend for the EduPlatform educational system.',
        'Portfolio': 'Personal portfolio website showcasing projects and skills.',
        'Newsmate': 'News aggregation and summarization web application with curated feeds.',
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
        'Spotify_clone': 'Spotify UI clone with music playback functionality.',
        'Online-Voting-System': 'Web-based online voting system with secure authentication.',
        'Notemate': 'Note-taking web application with EJS templating and CRUD operations.',
        'ML---basics': 'Machine learning fundamentals with Jupyter Notebook experiments.',
        'Esp-32-Automation': 'ESP32-based IoT automation system for smart home controls.',
        'RFID-Google-Sheets-Attendance': 'RFID-based attendance system integrated with Google Sheets using C++.',
        'image-editor': 'Advanced image editor web application built with TypeScript.',
        'React-Basics': 'React.js fundamentals and component-based architecture practice.',
        'Emoji-Pidia': 'Emoji encyclopedia web app with search and discovery features.',
        'image-filter-app': 'React-based image filter application with real-time preview.',
        'Network-Lab': 'Computer networking lab programs implemented in C.',
        'React-Reselling-App': 'React-based reselling marketplace application.',
        'pond_monitor': 'IoT pond monitoring system with real-time sensor data visualization.',
        'Traffic-Accident-Identifier': 'Traffic accident detection and identification system.',
        'E-commerce-using-flask': 'E-commerce web application built with Flask framework.',
        'Image-to-text': 'OCR-based image to text extraction tool using Python.',
        'Meme-Generator': 'Dynamic meme generator web application with custom templates.',
        'SDG-Explorer': 'Interactive explorer for UN Sustainable Development Goals.',
        'Interactive-Quiz-Application': 'Dynamic quiz application with scoring and feedback system.',
        '100-day-s-Python': '100 Days of Python programming challenge solutions.',
    };

    return descriptions[name] || 'A project exploring modern software development techniques.';
}

function getLanguageColor(language) {
    const colors = {
        'Python': '#3572A5',
        'JavaScript': '#f1e05a',
        'TypeScript': '#3178c6',
        'Java': '#b07219',
        'Kotlin': '#A97BFF',
        'CSS': '#563d7c',
        'HTML': '#e34c26',
        'C': '#555555',
        'C++': '#f34b7d',
        'Jupyter Notebook': '#DA5B0B',
        'EJS': '#a91e50',
    };
    return colors[language] || '#8892b0';
}

// ===== Particle Canvas (Neural Network Style) =====
function initParticleCanvas() {
    const canvas = document.getElementById('particle-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let particles = [];
    let animationId;
    const PARTICLE_COUNT = 60;
    const CONNECTION_DISTANCE = 150;
    let mouse = { x: -1000, y: -1000 };

    function resize() {
        const hero = canvas.parentElement?.parentElement;
        if (!hero) return;
        canvas.width = hero.offsetWidth;
        canvas.height = hero.offsetHeight;
    }

    function createParticles() {
        particles = [];
        for (let i = 0; i < PARTICLE_COUNT; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                radius: Math.random() * 2 + 1,
                opacity: Math.random() * 0.5 + 0.2,
            });
        }
    }

    function drawParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw connections
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < CONNECTION_DISTANCE) {
                    const opacity = (1 - dist / CONNECTION_DISTANCE) * 0.15;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(0, 212, 255, ${opacity})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }

            // Mouse connection
            const dxm = particles[i].x - mouse.x;
            const dym = particles[i].y - mouse.y;
            const distm = Math.sqrt(dxm * dxm + dym * dym);
            if (distm < 200) {
                const opacity = (1 - distm / 200) * 0.3;
                ctx.beginPath();
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(mouse.x, mouse.y);
                ctx.strokeStyle = `rgba(124, 58, 237, ${opacity})`;
                ctx.lineWidth = 0.8;
                ctx.stroke();
            }
        }

        // Draw particles
        particles.forEach(p => {
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(0, 212, 255, ${p.opacity})`;
            ctx.fill();

            // Update position
            p.x += p.vx;
            p.y += p.vy;

            // Wrap around edges
            if (p.x < 0) p.x = canvas.width;
            if (p.x > canvas.width) p.x = 0;
            if (p.y < 0) p.y = canvas.height;
            if (p.y > canvas.height) p.y = 0;
        });

        animationId = requestAnimationFrame(drawParticles);
    }

    // Only animate when hero is visible
    const heroSection = document.getElementById('home');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                if (!animationId) drawParticles();
            } else {
                if (animationId) {
                    cancelAnimationFrame(animationId);
                    animationId = null;
                }
            }
        });
    }, { threshold: 0.1 });

    if (heroSection) observer.observe(heroSection);

    window.addEventListener('resize', () => {
        resize();
        createParticles();
    });

    canvas.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
    });

    canvas.addEventListener('mouseleave', () => {
        mouse.x = -1000;
        mouse.y = -1000;
    });

    resize();
    createParticles();
    drawParticles();
}

// ===== Cursor Glow Effect =====
function initCursorGlow() {
    const glow = document.getElementById('cursor-glow');
    if (!glow || window.matchMedia('(max-width: 768px)').matches) return;

    let targetX = 0, targetY = 0;
    let currentX = 0, currentY = 0;

    document.addEventListener('mousemove', (e) => {
        targetX = e.clientX;
        targetY = e.clientY;
        if (!glow.classList.contains('active')) {
            glow.classList.add('active');
        }
    });

    document.addEventListener('mouseleave', () => {
        glow.classList.remove('active');
    });

    function animate() {
        currentX += (targetX - currentX) * 0.08;
        currentY += (targetY - currentY) * 0.08;
        glow.style.left = currentX + 'px';
        glow.style.top = currentY + 'px';
        requestAnimationFrame(animate);
    }

    animate();
}

// ===== Hero Parallax on Orbs =====
function initHeroParallax() {
    const orbs = document.querySelectorAll('.hero-orb');
    if (!orbs.length || window.matchMedia('(max-width: 768px)').matches) return;

    const hero = document.querySelector('.hero');
    if (!hero) return;

    hero.addEventListener('mousemove', (e) => {
        const rect = hero.getBoundingClientRect();
        const x = (e.clientX - rect.left - rect.width / 2) / rect.width;
        const y = (e.clientY - rect.top - rect.height / 2) / rect.height;

        orbs.forEach((orb, i) => {
            const speed = (i + 1) * 15;
            orb.style.transform = `translate(${x * speed}px, ${y * speed}px)`;
        });
    });

    hero.addEventListener('mouseleave', () => {
        orbs.forEach(orb => {
            orb.style.transform = 'translate(0, 0)';
            orb.style.transition = 'transform 0.6s ease';
            setTimeout(() => { orb.style.transition = ''; }, 600);
        });
    });
}

// ===== Card Tilt Effect =====
function initCardTilt() {
    if (window.matchMedia('(max-width: 768px)').matches) return;

    const cards = document.querySelectorAll('.glass-card');

    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = ((y - centerY) / centerY) * -5;
            const rotateY = ((x - centerX) / centerX) * 5;

            card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });
}

