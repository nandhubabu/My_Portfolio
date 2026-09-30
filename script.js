/**
 * AWWWARDS-TIER 3D WEBGL SPATIAL PORTFOLIO ENGINE — ELECTRIC COBALT & CYAN
 * Author: Nandhu Babu
 * Core Highlights:
 *  - Interactive 3D Spatial Developer Terminal Deck (3D Cursor Tilt & Live Systems Telemetry)
 *  - Comprehensive 22+ Project Repository Catalogue (AI/ML, Full Stack Web, IoT, Mobile)
 *  - Three.js Ambient WebGL Cosmic Starfield & Perspective Cyber Ground Grid
 *  - Dynamic Category Filters with Real-Time Counters
 *  - Typewriter Engine, Intersection Observers, Instant Email Copy
 */

document.addEventListener('DOMContentLoaded', () => {
    initCustomCursor();
    initAmbientWebGL();
    initScrollProgress();
    initTypewriter();
    initCounters();
    initProjectFilters();
    initEmailCopy();
    initMobileNav();
    fetchGitHubProjects();
});

/* ==========================================================================
   1. Custom Fluid Interactive Cursor
   ========================================================================== */
function initCustomCursor() {
    const dot = document.getElementById('cursor-dot');
    const ring = document.getElementById('cursor-ring');
    if (!dot || !ring) return;

    if (window.matchMedia('(hover: none)').matches) {
        dot.style.display = 'none';
        ring.style.display = 'none';
        return;
    }

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;

    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        dot.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
    }, { passive: true });

    function renderCursor() {
        ringX += (mouseX - ringX) * 0.18;
        ringY += (mouseY - ringY) * 0.18;
        ring.style.transform = `translate(${ringX}px, ${ringY}px)`;
        requestAnimationFrame(renderCursor);
    }
    renderCursor();

    const hoverTargets = 'a, button, [role="button"], .glass-3d-panel, .spatial-project-card, .contact-glass-card';
    document.querySelectorAll(hoverTargets).forEach(el => {
        el.addEventListener('mouseenter', () => ring.classList.add('cursor-hover'));
        el.addEventListener('mouseleave', () => ring.classList.remove('cursor-hover'));
    });
}

/* ==========================================================================
   3. Three.js Ambient WebGL Spatial Background
   ========================================================================== */
function initAmbientWebGL() {
    const canvas = document.getElementById('webgl-canvas');
    if (!canvas || typeof THREE === 'undefined') return;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x050811, 0.0016);

    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 2000);
    camera.position.z = 450;

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Starfield Particle Constellation
    const particleCount = 750;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const colorCyan = new THREE.Color(0x00d4ff);
    const colorCobalt = new THREE.Color(0x3b82f6);
    const colorWhite = new THREE.Color(0xf8fafc);

    for (let i = 0; i < particleCount; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 2200;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 1600;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 1800;

        const choice = Math.random();
        const c = choice > 0.6 ? colorCyan : (choice > 0.25 ? colorCobalt : colorWhite);
        colors[i * 3] = c.r;
        colors[i * 3 + 1] = c.g;
        colors[i * 3 + 2] = c.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
        size: 2.8,
        vertexColors: true,
        transparent: true,
        opacity: 0.75,
        blending: THREE.AdditiveBlending
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // Receding Cyber Floor Grid
    const gridHelper = new THREE.GridHelper(2400, 48, 0x00d4ff, 0x1e3a5f);
    gridHelper.position.y = -420;
    gridHelper.material.opacity = 0.22;
    gridHelper.material.transparent = true;
    scene.add(gridHelper);

    // Parallax tracking
    let targetCamX = 0;
    let targetCamY = 0;

    window.addEventListener('mousemove', (e) => {
        targetCamX = (e.clientX - window.innerWidth / 2) * 0.12;
        targetCamY = -(e.clientY - window.innerHeight / 2) * 0.1;
    }, { passive: true });

    function animateWebGL() {
        requestAnimationFrame(animateWebGL);

        particles.rotation.y += 0.00035;
        particles.rotation.x += 0.00015;

        gridHelper.position.z = (gridHelper.position.z + 0.35) % 50;

        camera.position.x += (targetCamX - camera.position.x) * 0.04;
        camera.position.y += (targetCamY - camera.position.y) * 0.04;

        renderer.render(scene, camera);
    }
    animateWebGL();

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}

/* ==========================================================================
   4. Typewriter Heading Engine
   ========================================================================== */
function initTypewriter() {
    const el = document.getElementById('typewriter');
    if (!el) return;

    const phrases = [
        'Creative Full Stack Developer',
        'AI & Deep Learning Engineer',
        'Computer Vision Specialist',
        'Edge IoT & Embedded Systems Dev',
        'Distributed Systems Architect'
    ];

    let pIdx = 0;
    let cIdx = 0;
    let isDel = false;

    function type() {
        const text = phrases[pIdx];
        if (isDel) {
            el.textContent = text.substring(0, cIdx - 1);
            cIdx--;
        } else {
            el.textContent = text.substring(0, cIdx + 1);
            cIdx++;
        }

        let speed = isDel ? 35 : 75;

        if (!isDel && cIdx === text.length) {
            speed = 2200;
            isDel = true;
        } else if (isDel && cIdx === 0) {
            isDel = false;
            pIdx = (pIdx + 1) % phrases.length;
            speed = 400;
        }

        setTimeout(type, speed);
    }
    type();
}

/* ==========================================================================
   5. Scroll Progress & Active Navigation
   ========================================================================== */
function initScrollProgress() {
    const bar = document.getElementById('scroll-progress');
    const navbar = document.querySelector('.spatial-nav');
    const sections = document.querySelectorAll('section[id]');
    const navAnchors = document.querySelectorAll('.nav-anchor');

    function update() {
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
        if (bar) bar.style.width = `${progress}%`;

        if (navbar) {
            if (scrollTop > 50) navbar.classList.add('scrolled');
            else navbar.classList.remove('scrolled');
        }

        let current = '';
        sections.forEach(sec => {
            const top = sec.offsetTop - 180;
            if (scrollTop >= top) current = sec.getAttribute('id');
        });

        navAnchors.forEach(a => {
            a.classList.remove('active');
            if (a.getAttribute('href') === `#${current}`) a.classList.add('active');
        });
    }

    window.addEventListener('scroll', update, { passive: true });
    update();
}

/* ==========================================================================
   6. Animated Number Counters
   ========================================================================== */
function initCounters() {
    const counters = document.querySelectorAll('.counter');
    if (!counters.length) return;

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const target = parseInt(el.getAttribute('data-target'), 10) || 0;
                animateNumber(el, target);
                obs.unobserve(el);
            }
        });
    }, { threshold: 0.3 });

    counters.forEach(c => observer.observe(c));
}

function animateNumber(element, target) {
    const duration = 1400;
    const start = performance.now();

    function step(now) {
        const progress = Math.min((now - start) / duration, 1);
        const ease = 1 - Math.pow(1 - progress, 3);
        element.textContent = Math.floor(ease * target);
        if (progress < 1) requestAnimationFrame(step);
        else element.textContent = target;
    }
    requestAnimationFrame(step);
}

/* ==========================================================================
   7. Comprehensive 22+ Project Repository Catalogue
   ========================================================================== */
const LANG_COLORS = {
    Python: '#38bdf8',
    JavaScript: '#F7DF1E',
    TypeScript: '#00d4ff',
    Kotlin: '#A97BFF',
    HTML: '#E34C26',
    CSS: '#563D7C',
    C: '#94a3b8',
    'C++': '#60a5fa',
    Java: '#B07219'
};

const CATEGORY_NAMES = {
    ai: 'AI & Deep Learning',
    web: 'Full Stack Web',
    iot: 'IoT & Hardware',
    mobile: 'System & Mobile'
};

// Curated 22-Project Registry with accurate details, live demos, and descriptions
const CURATED_REPOS = [
    {
        name: 'Gods_eye',
        title: 'Gods Eye Surveillance',
        category: 'ai',
        description: 'AI-powered computer vision surveillance platform featuring real-time YOLOv8 object detection, facial recognition, and automated anomaly security triggers.',
        language: 'Python',
        stargazers_count: 2,
        tags: ['Computer Vision', 'YOLOv8', 'PyTorch', 'OpenCV'],
        html_url: 'https://github.com/nandhubabu/Gods_eye'
    },
    {
        name: 'Newsmate',
        title: 'Newsmate Platform',
        category: 'web',
        description: 'Intelligent real-time news curation engine featuring multi-source automated aggregation, topic classification, and instant reader mode.',
        language: 'JavaScript',
        stargazers_count: 1,
        homepage: 'https://newsmate-one.vercel.app',
        tags: ['React', 'Node.js', 'Vercel', 'REST API'],
        html_url: 'https://github.com/nandhubabu/Newsmate'
    },
    {
        name: 'EduPlatform',
        title: 'EduPlatform LMS',
        category: 'web',
        description: 'Full-stack collaborative education platform with modular curriculum trees, real-time quizzes, student gradebook, and interactive assignments.',
        language: 'JavaScript',
        stargazers_count: 1,
        homepage: 'https://edu-platform-jade.vercel.app/',
        tags: ['React.js', 'Node.js', 'Express', 'Vercel'],
        html_url: 'https://github.com/nandhubabu/EduPlatform'
    },
    {
        name: 'CodeNova-AI',
        title: 'CodeNova AI Assistant',
        category: 'ai',
        description: 'Intelligent developer copilot and code generation workspace leveraging Large Language Models for automated refactoring and algorithm synthesis.',
        language: 'Python',
        stargazers_count: 2,
        tags: ['LLMs', 'Prompt Engineering', 'LangChain', 'Python'],
        html_url: 'https://github.com/nandhubabu/CodeNova-AI'
    },
    {
        name: 'echo_Real-time-chat-app',
        title: 'Echo Real-Time Chat',
        category: 'web',
        description: 'Full-stack high-concurrency instant messaging web app built on WebSockets (Socket.io) with user presence tracking, rooms, and encrypted tokens.',
        language: 'JavaScript',
        stargazers_count: 2,
        homepage: 'https://echo-real-time-chat-app-psi.vercel.app',
        tags: ['Socket.io', 'Express.js', 'MongoDB', 'JWT'],
        html_url: 'https://github.com/nandhubabu/echo_Real-time-chat-app'
    },
    {
        name: 'Aethel',
        title: 'Aethel Web Workspace',
        category: 'web',
        description: 'Modern reactive web platform with glassmorphic interface architecture, dynamic micro-interactions, and serverless edge endpoints.',
        language: 'JavaScript',
        stargazers_count: 1,
        homepage: 'https://aethel-five-rouge.vercel.app',
        tags: ['JavaScript', 'TailwindCSS', 'Serverless', 'Vercel'],
        html_url: 'https://github.com/nandhubabu/Aethel'
    },
    {
        name: 'V2V_communication_RL_Model',
        title: 'V2V Communication RL Model',
        category: 'ai',
        description: 'Reinforcement Learning framework training autonomous vehicles to dynamically coordinate wireless bandwidth and avoid network packet collisions.',
        language: 'Python',
        stargazers_count: 2,
        tags: ['PyTorch', 'Q-Learning', 'Gymnasium', 'V2X'],
        html_url: 'https://github.com/nandhubabu/V2V_communication_RL_Model'
    },
    {
        name: 'DMS_with_Action',
        title: 'Driver Monitoring System',
        category: 'ai',
        description: 'Real-time in-cabin driver monitoring platform tracking eye gaze, head orientation, blink frequency, and secondary dangerous activities.',
        language: 'Python',
        stargazers_count: 2,
        tags: ['Computer Vision', 'MediaPipe', 'OpenCV', 'Deep Learning'],
        html_url: 'https://github.com/nandhubabu/DMS_with_Action'
    },
    {
        name: 'Driver-Drowsiness-Detection',
        title: 'Driver Drowsiness Alert',
        category: 'ai',
        description: 'Autonomous computer vision drowsiness detector calculating Eye Aspect Ratio (EAR) across 68 facial landmarks to sound emergency alarms.',
        language: 'Python',
        stargazers_count: 1,
        tags: ['Dlib', 'OpenCV', 'SciPy', 'Python'],
        html_url: 'https://github.com/nandhubabu/Driver-Drowsiness-Detection'
    },
    {
        name: 'Bluetooth_Data_Sender',
        title: 'Bluetooth Data Sender App',
        category: 'mobile',
        description: 'Native Android application written in Kotlin for seamless RFCOMM Bluetooth packet streaming, hardware sensor telemetry, and peripheral pairing.',
        language: 'Kotlin',
        stargazers_count: 1,
        tags: ['Kotlin', 'Android SDK', 'Bluetooth API'],
        html_url: 'https://github.com/nandhubabu/Bluetooth_Data_Sender'
    },
    {
        name: 'RL-Dino-Game',
        title: 'RL Dino Game Agent',
        category: 'ai',
        description: 'Deep Q-Network (DQN) reinforcement learning agent trained on raw game screen frames to autonomously jump obstacles in the Chrome Dino game.',
        language: 'Python',
        stargazers_count: 2,
        tags: ['Deep Q-Learning', 'PyTorch', 'Computer Vision'],
        html_url: 'https://github.com/nandhubabu/RL-Dino-Game'
    },
    {
        name: 'ecommerce',
        title: 'Python E-Commerce Engine',
        category: 'web',
        description: 'Scalable multi-category e-commerce web platform with product search, shopping cart state management, checkout pipelines, and SQL persistence.',
        language: 'Python',
        stargazers_count: 1,
        tags: ['Python', 'Flask / Django', 'SQL', 'REST API'],
        html_url: 'https://github.com/nandhubabu/ecommerce'
    },
    {
        name: 'RFID-Google-Sheets-Attendance',
        title: 'RFID IoT Sheets Attendance',
        category: 'iot',
        description: 'Smart attendance hardware tracker using ESP32/NodeMCU and RC522 RFID reader, logging check-in timestamps securely to Google Sheets API.',
        language: 'C++',
        stargazers_count: 1,
        tags: ['ESP32', 'Arduino IDE', 'C++', 'Google Sheets API'],
        html_url: 'https://github.com/nandhubabu/RFID-Google-Sheets-Attendance'
    },
    {
        name: 'Esp-32-Automation',
        title: 'ESP32 Home Automation',
        category: 'iot',
        description: 'Microcontroller IoT web server on ESP32 running WebSockets for browser-based remote control of relays, lighting, and environmental sensors.',
        language: 'C++',
        stargazers_count: 1,
        tags: ['ESP32', 'IoT', 'WebSockets', 'HTML5'],
        html_url: 'https://github.com/nandhubabu/Esp-32-Automation'
    },
    {
        name: 'pond_monitor',
        title: 'Pond IoT Quality Dashboard',
        category: 'iot',
        description: 'Real-time aquaculture monitoring dashboard streaming water pH, dissolved oxygen, and temperature levels with predictive threshold alarms.',
        language: 'JavaScript',
        stargazers_count: 1,
        homepage: 'https://pond-monitor.vercel.app',
        tags: ['JavaScript', 'Chart.js', 'IoT Telemetry', 'Vercel'],
        html_url: 'https://github.com/nandhubabu/pond_monitor'
    },
    {
        name: 'image-editor',
        title: 'Advanced Canvas Image Editor',
        category: 'web',
        description: 'High-performance in-browser image manipulation workspace featuring filters, crop, tint, curves, and instant high-res PNG/JPG exports.',
        language: 'TypeScript',
        stargazers_count: 1,
        homepage: 'https://v0-advanced-image-editor-nine.vercel.app/',
        tags: ['TypeScript', 'React', 'Canvas API', 'Vercel'],
        html_url: 'https://github.com/nandhubabu/image-editor'
    },
    {
        name: 'image-filter-app',
        title: 'React Image Filter Suite',
        category: 'web',
        description: 'Dynamic image processing application with live matrix convolution filters, contrast, saturation, and custom CSS color matrices.',
        language: 'TypeScript',
        stargazers_count: 1,
        homepage: 'https://v0-react-image-filter-1bdtkdaej-nandhubabus-projects.vercel.app/',
        tags: ['React', 'TypeScript', 'CSS Filters'],
        html_url: 'https://github.com/nandhubabu/image-filter-app'
    },
    {
        name: 'Face-Recognition-Attendance-System',
        title: 'Face Biometric Attendance',
        category: 'ai',
        description: 'Automated biometric attendance pipeline utilizing 128D deep facial feature embeddings to recognize students and log timestamps to SQLite.',
        language: 'Python',
        stargazers_count: 1,
        tags: ['OpenCV', 'Face Recognition', 'Deep Learning', 'SQLite'],
        html_url: 'https://github.com/nandhubabu/Face-Recognition-Attendance-System'
    },
    {
        name: 'Pass-2-Assembler',
        title: 'Pass-2 Assembler Simulator',
        category: 'mobile',
        description: 'Interactive systems software simulator demonstrating two-pass assembly language translation, symbol table parsing, and opcode resolution.',
        language: 'JavaScript',
        stargazers_count: 1,
        homepage: 'https://nandhubabu.github.io/Pass-2-Assembler/',
        tags: ['System Programming', 'Assembler', 'JavaScript'],
        html_url: 'https://github.com/nandhubabu/Pass-2-Assembler'
    },
    {
        name: 'Emoji-Pidia',
        title: 'Emoji-Pidia Dictionary',
        category: 'web',
        description: 'Interactive encyclopedic dictionary of emojis, symbols, and Unicode specs with instant instant text search and clipboard copy triggers.',
        language: 'JavaScript',
        stargazers_count: 1,
        homepage: 'https://emoji-pidia.vercel.app/',
        tags: ['React', 'JavaScript', 'Vercel'],
        html_url: 'https://github.com/nandhubabu/Emoji-Pidia'
    },
    {
        name: 'Weather_identifier',
        title: 'Live Weather Identifier',
        category: 'web',
        description: 'Atmospheric telemetry web application fetching global real-time weather metrics, wind speed, pressure, and 5-day forecasts.',
        language: 'JavaScript',
        stargazers_count: 1,
        homepage: 'https://nandhubabu.github.io/Weather_identifier/',
        tags: ['JavaScript', 'OpenWeather API', 'GitHub Pages'],
        html_url: 'https://github.com/nandhubabu/Weather_identifier'
    },
    {
        name: 'Food-Classification',
        title: 'Deep Learning Food Classifier',
        category: 'ai',
        description: 'Multi-class Convolutional Neural Network trained to classify culinary dishes from image inputs for automated dietary recognition.',
        language: 'Python',
        stargazers_count: 2,
        tags: ['CNNs', 'TensorFlow', 'Computer Vision', 'Python'],
        html_url: 'https://github.com/nandhubabu/Food-Classification'
    }
];

async function fetchGitHubProjects() {
    const grid = document.getElementById('projects-grid');
    if (!grid) return;

    try {
        const res = await fetch('https://api.github.com/users/nandhubabu/repos?per_page=100&sort=updated');
        if (res.ok) {
            const apiRepos = await res.json();
            // Merge live stars and updated dates with our curated metadata
            const merged = CURATED_REPOS.map(c => {
                const live = apiRepos.find(r => r.name.toLowerCase() === c.name.toLowerCase());
                if (live) {
                    return {
                        ...c,
                        stargazers_count: Math.max(live.stargazers_count || 0, c.stargazers_count),
                        html_url: live.html_url || c.html_url,
                        homepage: live.homepage || c.homepage
                    };
                }
                return c;
            });
            renderProjects(grid, merged);
            updateFilterCounts(merged);
            return;
        }
    } catch (e) {
        // Fallback gracefully to curated catalogue
    }

    renderProjects(grid, CURATED_REPOS);
    updateFilterCounts(CURATED_REPOS);
}

function updateFilterCounts(repos) {
    const allCount = repos.length;
    const aiCount = repos.filter(r => r.category === 'ai').length;
    const webCount = repos.filter(r => r.category === 'web').length;
    const iotCount = repos.filter(r => r.category === 'iot').length;
    const mobileCount = repos.filter(r => r.category === 'mobile').length;

    const elAll = document.getElementById('count-all');
    const elAi = document.getElementById('count-ai');
    const elWeb = document.getElementById('count-web');
    const elIot = document.getElementById('count-iot');
    const elMobile = document.getElementById('count-mobile');

    if (elAll) elAll.textContent = allCount;
    if (elAi) elAi.textContent = aiCount;
    if (elWeb) elWeb.textContent = webCount;
    if (elIot) elIot.textContent = iotCount;
    if (elMobile) elMobile.textContent = mobileCount;
}

function renderProjects(grid, repos) {
    grid.innerHTML = '';
    repos.forEach(repo => {
        const card = createProjectCard(repo);
        grid.appendChild(card);
    });
}

function createProjectCard(repo) {
    const card = document.createElement('div');
    card.className = 'spatial-project-card';
    card.setAttribute('data-category', repo.category || 'web');
    card.setAttribute('data-language', repo.language || 'other');

    const langColor = LANG_COLORS[repo.language] || '#00d4ff';
    const hasLiveDemo = repo.homepage && repo.homepage.trim() !== '';
    const categoryLabel = CATEGORY_NAMES[repo.category] || 'Software Engineering';

    const tagsHtml = (repo.tags || [repo.language])
        .slice(0, 3)
        .map(t => `<span class="tech-tag" style="font-size: 0.72rem; padding: 4px 10px;">${t}</span>`)
        .join('');

    card.innerHTML = `
        <div>
            <div class="card-top-row">
                <div class="card-folder-svg">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                        <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
                    </svg>
                </div>
                <div class="card-ext-links">
                    ${hasLiveDemo ? `
                        <a href="${repo.homepage}" target="_blank" rel="noopener noreferrer" class="ext-icon-link" aria-label="Live Demo for ${repo.title}">
                            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                                <polyline points="15 3 21 3 21 9"></polyline>
                                <line x1="10" y1="14" x2="21" y2="3"></line>
                            </svg>
                        </a>
                    ` : ''}
                    <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer" class="ext-icon-link" aria-label="GitHub Repository for ${repo.name}">
                        <svg width="19" height="19" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                        </svg>
                    </a>
                </div>
            </div>

            <div style="margin-bottom: 8px;">
                <span style="font-family: var(--font-mono); font-size: 0.68rem; color: var(--accent-light); text-transform: uppercase; letter-spacing: 1px;">${categoryLabel}</span>
            </div>

            <h3 class="card-project-title">${repo.title || repo.name.replace(/[-_]/g, ' ')}</h3>
            <p class="card-project-summary">${repo.description}</p>
            
            <div style="display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 20px;">
                ${tagsHtml}
            </div>
        </div>

        <div class="card-bottom-row">
            <span class="lang-indicator">
                <span class="lang-color-dot" style="background-color: ${langColor};"></span>
                <span>${repo.language || 'Codebase'}</span>
            </span>
            <div class="card-meta-chips">
                ${hasLiveDemo ? '<span class="demo-live-badge">Live ↗</span>' : ''}
                <span class="stars-badge">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                    </svg>
                    ${repo.stargazers_count || 0}
                </span>
            </div>
        </div>
    `;
    return card;
}

function initProjectFilters() {
    const filterContainer = document.querySelector('.filter-pill-container');
    const grid = document.getElementById('projects-grid');
    if (!filterContainer || !grid) return;

    filterContainer.addEventListener('click', (e) => {
        const btn = e.target.closest('.filter-btn');
        if (!btn) return;

        filterContainer.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.getAttribute('data-filter');
        const cards = grid.querySelectorAll('.spatial-project-card');

        cards.forEach(card => {
            const cat = card.getAttribute('data-category');
            let isVisible = false;

            if (filter === 'all') isVisible = true;
            else isVisible = (cat === filter);

            card.style.display = isVisible ? 'flex' : 'none';
        });
    });
}

/* ==========================================================================
   8. Email One-Click Copy & Toast Feedback
   ========================================================================== */
function initEmailCopy() {
    const btn = document.getElementById('btn-copy-email');
    if (!btn) return;

    btn.addEventListener('click', () => {
        const email = 'nandhubabuvktd@gmail.com';
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(email).then(() => {
                showToast('Email copied to clipboard! (nandhubabuvktd@gmail.com) 📋');
            }).catch(() => {
                window.location.href = `mailto:${email}`;
            });
        } else {
            window.location.href = `mailto:${email}`;
        }
    });

    btn.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            btn.click();
        }
    });
}

function showToast(message) {
    const toast = document.getElementById('toast');
    const msg = document.getElementById('toast-message');
    if (!toast || !msg) return;

    msg.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3200);
}

/* ==========================================================================
   9. Mobile Menu Toggle
   ========================================================================== */
function initMobileNav() {
    const toggle = document.getElementById('menu-toggle');
    const navLinks = document.getElementById('nav-links');
    if (!toggle || !navLinks) return;

    toggle.addEventListener('click', () => {
        const open = navLinks.classList.toggle('open');
        toggle.setAttribute('aria-expanded', open);
    });

    navLinks.querySelectorAll('a').forEach(a => {
        a.addEventListener('click', () => {
            navLinks.classList.remove('open');
            toggle.setAttribute('aria-expanded', 'false');
        });
    });
}
