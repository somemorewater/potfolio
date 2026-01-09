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
                <i class="${category.icon}"></i>
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
    
    // Add entrance animations
    animateProjectCards();
    
    // Add event listeners for interactive features
    attachProjectListeners();
}

// ===================================
// Create Project Card HTML
// ===================================
function createProjectCard(project, index) {
    const featuredBadge = project.featured ? `
        <div class="featured-badge">
            <i class="bi bi-star-fill"></i>
            <span>Featured</span>
        </div>
    ` : '';
    
    const tags = project.tags.map(tag => 
        `<span class="tag">${tag}</span>`
    ).join('');
    
    const stats = project.stats.map(stat => `
        <div class="stat">
            <i class="${stat.icon}"></i>
            <span>${stat.label}</span>
        </div>
    `).join('');
    
    const overlayContent = project.status === 'development' 
        ? '<span class="status-badge">In Development</span>'
        : project.liveUrl 
            ? `<a href="${project.liveUrl}" target="_blank" class="preview-btn">
                <i class="bi bi-eye"></i>
                <span>Live Demo</span>
               </a>`
            : '';
    
    const footerLink = project.liveUrl 
        ? `<a href="${project.liveUrl}" target="_blank" class="project-link">
               View Project <i class="bi bi-arrow-right"></i>
           </a>`
        : project.githubUrl
            ? `<a href="${project.githubUrl}" target="_blank" class="project-link">
                   View on GitHub <i class="bi bi-arrow-right"></i>
               </a>`
            : `<span class="project-link disabled">Coming Soon</span>`;
    
    return `
        <article class="project-card ${project.featured ? 'featured' : ''}" data-category="${project.category}" data-index="${index}">
            ${featuredBadge}
            <div class="project-image">
                <img src="${project.image}" alt="${project.title} preview" loading="lazy"/>
                <div class="project-overlay">
                    ${overlayContent}
                </div>
            </div>
            <div class="project-content">
                <div class="project-tags">
                    ${tags}
                </div>
                <h3 class="project-title">${project.title}</h3>
                <p class="project-description">${project.description}</p>
                <div class="project-stats">
                    ${stats}
                </div>
                <div class="project-footer">
                    ${footerLink}
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
    
    // Re-render projects with animation
    const projectsGrid = document.getElementById('projects-grid');
    projectsGrid.style.opacity = '0';
    
    setTimeout(() => {
        renderProjects(filterValue);
        projectsGrid.style.transition = 'opacity 0.5s ease-out';
        projectsGrid.style.opacity = '1';
    }, 300);
}

// ===================================
// Animate Project Cards Entrance
// ===================================
function animateProjectCards() {
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            card.style.transition = 'all 0.6s ease-out';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 100);
    });
}

// ===================================
// Attach Interactive Listeners
// ===================================
function attachProjectListeners() {
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach(card => {
        // Parallax Effect on Images
        const image = card.querySelector('.project-image img');
        
        card.addEventListener('mousemove', (e) => {
            if (window.innerWidth < 768) return; // Skip on mobile
            
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const deltaX = (x - centerX) / centerX;
            const deltaY = (y - centerY) / centerY;
            
            if (image) {
                image.style.transform = `scale(1.1) translate(${deltaX * 10}px, ${deltaY * 10}px)`;
            }
        });
        
        card.addEventListener('mouseleave', () => {
            if (image) {
                image.style.transform = 'scale(1.1)';
            }
        });
        
        // 3D Tilt Effect on Cards
        card.addEventListener('mousemove', (e) => {
            if (window.innerWidth < 768) return; // Skip on mobile
            
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
        });
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
            <i class="bi bi-exclamation-triangle" style="font-size: 3rem; color: #f87171; margin-bottom: 1rem;"></i>
            <h3 style="color: var(--text-primary); margin-bottom: 0.5rem;">Failed to Load Projects</h3>
            <p style="color: var(--text-muted);">Please check your connection and try again.</p>
            <button onclick="loadProjects()" class="btn btn-primary" style="margin-top: 1.5rem;">
                <span>Retry</span>
                <i class="bi bi-arrow-clockwise"></i>
            </button>
        </div>
    `;
}

// ===================================
// Keyboard Navigation for Filters
// ===================================
document.addEventListener('keydown', (e) => {
    if (e.key >= '1' && e.key <= '4' && projectsData) {
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


