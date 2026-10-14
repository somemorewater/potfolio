// ===================================
// Global Variables
// ===================================
let projectsData = null;
let currentFilter = 'all';

// ===================================
// Load Projects from JSON
// ===================================
async function loadProjects() {
    try {
        const response = await fetch('./data/projects.json');
        if (!response.ok) {
            throw new Error('Failed to load projects data');
        }
        projectsData = await response.json();
        
        // Initialize the page
        renderFilterButtons();
        renderProjects();
        requestAnimationFrame(() => {
            const target = document.querySelector(window.location.hash);
            if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
        
    } catch (error) {
        console.error('Error loading projects:', error);
        showErrorMessage();
    }
}

// ===================================
// Render Filter Buttons
// ===================================
function renderFilterButtons() {
    const filterContainer = document.getElementById('filter-buttons');
    if (!filterContainer || !projectsData) return;
    
    const buttons = projectsData.categories.map((category, index) => {
        const isActive = category.id === 'all' ? 'active' : '';
        return `
            <button class="filter-btn ${isActive}" data-filter="${category.id}">
                <i data-lucide="${category.icon}"></i>
                <span>${category.name}</span>
            </button>
        `;
    }).join('');
    
    filterContainer.innerHTML = buttons;
    
    // Add event listeners
    filterContainer.querySelectorAll('.filter-btn').forEach(button => {
        button.addEventListener('click', handleFilterClick);
    });
}

// ===================================
// Render Projects
// ===================================
function renderProjects(filterCategory = 'all') {
    const projectsGrid = document.getElementById('projects-grid');
    if (!projectsGrid || !projectsData) return;
    
    // Filter projects
    const filteredProjects = filterCategory === 'all' 
        ? projectsData.projects 
        : projectsData.projects.filter(p => p.category === filterCategory);
    
    if (filteredProjects.length === 0) {
        projectsGrid.innerHTML = '<p class="no-projects">No projects found in this category.</p>';
        return;
    }
    
    // Generate HTML for each project
    const projectsHTML = filteredProjects.map((project, index) => {
        return createProjectCard(project, index);
    }).join('');
    
    projectsGrid.innerHTML = projectsHTML;
    if (typeof window.refreshIcons === 'function') window.refreshIcons();
    
    // Add event listeners for interactive features
    attachProjectListeners();
}

// ===================================
// Create Project Card HTML
// ===================================
function createProjectCard(project, index) {
    const featuredBadge = project.featured ? `
        <div class="featured-badge">
            <i data-lucide="star"></i>
            <span>Featured</span>
        </div>
    ` : '';
    
    const tags = project.tags.map(tag => 
        `<span class="tag">${tag}</span>`
    ).join('');
    
    const stats = project.stats.map(stat => `
        <div class="stat">
            <i data-lucide="${stat.icon}"></i>
            <span>${stat.label}</span>
        </div>
    `).join('');
    
    const overlayContent = project.status === 'development' 
        ? '<span class="status-badge">In Development</span>'
        : project.liveUrl 
            ? `<a href="${project.liveUrl}" target="_blank" rel="noopener noreferrer" class="preview-btn">
                <i data-lucide="eye"></i>
                <span>Live Demo</span>
               </a>`
            : '';
    
    const detailsLink = `<a href="./project.html?id=${project.id}" class="project-link">
               View details <i data-lucide="arrow-right"></i>
           </a>`;

    const liveLink = project.liveUrl 
        ? `<a href="${project.liveUrl}" target="_blank" rel="noopener noreferrer" class="project-link primary">
               Open project <i data-lucide="arrow-right"></i>
           </a>`
        : '';
    
    const githubLink = project.githubUrl
        ? `<a href="${project.githubUrl}" target="_blank" rel="noopener noreferrer" class="project-link">
               Source code <i data-lucide="github"></i>
           </a>`
        : '';
    
    const footerLinks = liveLink || githubLink
        ? `${detailsLink}${liveLink}${githubLink}`
        : `${detailsLink}<span class="project-link disabled">Coming Soon</span>`;
    
    return `
        <article id="project-${project.id}" class="project-card ${project.featured ? 'featured' : ''}" data-category="${project.category}" data-index="${index}">
            ${featuredBadge}
            <div class="project-image">
                <img src="${project.image}" alt="${project.title} preview" loading="lazy"/>
                <div class="project-overlay">
                    ${overlayContent}
                </div>
            </div>
            <div class="project-content">
                <div class="project-meta">
                    <span class="project-category">${project.category}</span>
                    <span class="status-badge">${project.status.replace(/\b\w/g, letter => letter.toUpperCase())}</span>
                </div>
                <h3 class="project-title">${project.title}</h3>
                <p class="project-description">${project.description}</p>
                <div class="project-tags">
                    ${tags}
                </div>
                <div class="project-stats">
                    ${stats}
                </div>
                <div class="project-footer">
                    ${footerLinks}
                </div>
            </div>
        </article>
    `;
}

// ===================================
// Handle Filter Click
// ===================================
function handleFilterClick(event) {
    const button = event.currentTarget;
    const filterValue = button.getAttribute('data-filter');
    
    // Update active state
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    button.classList.add('active');
    
    // Update current filter
    currentFilter = filterValue;
    
    renderProjects(filterValue);
}

// ===================================
// Attach Interactive Listeners
// ===================================
function attachProjectListeners() {
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach(card => {
        card.addEventListener('focusin', () => card.classList.add('focused'));
        card.addEventListener('focusout', () => card.classList.remove('focused'));
    });
}

// ===================================
// Show Error Message
// ===================================
function showErrorMessage() {
    const projectsGrid = document.getElementById('projects-grid');
    if (!projectsGrid) return;
    
    projectsGrid.innerHTML = `
        <div class="error-message">
            <i data-lucide="triangle-alert" style="font-size: 3rem; color: #f87171; margin-bottom: 1rem;"></i>
            <h3 style="color: var(--text-primary); margin-bottom: 0.5rem;">Failed to Load Projects</h3>
            <p style="color: var(--text-muted);">Please check your connection and try again.</p>
            <button onclick="loadProjects()" class="btn btn-primary" style="margin-top: 1.5rem;">
                <span>Retry</span>
                <i data-lucide="rotate-cw"></i>
            </button>
        </div>
    `;
    if (typeof window.refreshIcons === 'function') window.refreshIcons();
}

// ===================================
// Keyboard Navigation for Filters
// ===================================
document.addEventListener('keydown', (e) => {
    if (e.key >= '1' && e.key <= '9' && projectsData) {
        const index = parseInt(e.key) - 1;
        const filterButtons = document.querySelectorAll('.filter-btn');
        if (filterButtons[index]) {
            filterButtons[index].click();
        }
    }
});

// ===================================
// Lazy Loading for Project Images
// ===================================
function setupLazyLoading() {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.style.opacity = '1';
                observer.unobserve(img);
            }
        });
    }, {
        threshold: 0.1
    });

    document.querySelectorAll('.project-image img').forEach(img => {
        img.style.opacity = '0';
        img.style.transition = 'opacity 0.5s ease-out';
        imageObserver.observe(img);
    });
}

// ===================================
// Update Project Count Display
// ===================================
function updateProjectCount() {
    if (!projectsData) return;
    
    const visibleProjects = currentFilter === 'all' 
        ? projectsData.projects.length
        : projectsData.projects.filter(p => p.category === currentFilter).length;
    
    console.log(`Showing ${visibleProjects} of ${projectsData.projects.length} projects`);
}

// ===================================
// Initialize on Page Load
// ===================================
window.addEventListener('load', () => {
    loadProjects();
});

// ===================================
// Scroll Progress Indicator (Optional)
// ===================================
function updateScrollProgress() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const progress = (scrollTop / scrollHeight) * 100;
    
    // You can use this to show a progress bar if desired
    // document.getElementById('progress-bar').style.width = progress + '%';
}

window.addEventListener('scroll', updateScrollProgress);

// ===================================
// Project Card Click Analytics (Optional)
// ===================================
document.addEventListener('click', (e) => {
    const projectCard = e.target.closest('.project-card');
    if (projectCard) {
        const projectTitle = projectCard.querySelector('.project-title')?.textContent;
        console.log(`Project clicked: ${projectTitle}`);
        // You can send this to analytics if needed
    }
});

