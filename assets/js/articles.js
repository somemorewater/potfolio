// ===================================
// Global Variables
// ===================================
let articlesData = null;
let currentFilter = 'all';

// ===================================
// Load Articles from JSON
// ===================================
async function loadArticles() {
    try {
        const response = await fetch('./data/articles.json');
        if (!response.ok) {
            throw new Error('Failed to load articles data');
        }
        articlesData = await response.json();
        
        // Initialize the page
        renderFilterButtons();
        renderArticles();
        
    } catch (error) {
        console.error('Error loading articles:', error);
        showErrorMessage();
    }
}

// ===================================
// Render Filter Buttons
// ===================================
function renderFilterButtons() {
    const filterContainer = document.getElementById('filter-buttons');
    if (!filterContainer || !articlesData) return;
    
    const buttons = articlesData.categories.map((category, index) => {
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
// Render Articles
// ===================================
function renderArticles(filterCategory = 'all') {
    const articlesGrid = document.getElementById('articles-grid');
    if (!articlesGrid || !articlesData) return;
    
    // Filter articles
    const filteredArticles = filterCategory === 'all' 
        ? articlesData.articles 
        : articlesData.articles.filter(a => a.category === filterCategory);
    
    if (filteredArticles.length === 0) {
        articlesGrid.innerHTML = '<p class="no-projects">No articles found in this category.</p>';
        return;
    }
    
    // Generate HTML for each article
    const articlesHTML = filteredArticles.map((article, index) => {
        return createArticleCard(article, index);
    }).join('');
    
    articlesGrid.innerHTML = articlesHTML;
    
    // Add entrance animations
    animateProjectCards();
    
    // Add event listeners for interactive features
    attachProjectListeners();
    attachShareListeners();
}

// ===================================
// Create Article Card HTML
// ===================================
function createArticleCard(article, index) {
    const featuredBadge = article.featured ? `
        <div class="featured-badge">
            <i class="bi bi-star-fill"></i>
            <span>Featured</span>
        </div>
    ` : '';
    
    const tags = article.tags.map(tag => 
        `<span class="tag">${tag}</span>`
    ).join('');
    
    const stats = article.stats ? article.stats.map(stat => `
        <div class="stat">
            <i class="${stat.icon}"></i>
            <span>${stat.label}</span>
        </div>
    `).join('') : '';
    
    const overlayContent = article.status === 'development' 
        ? '<span class="status-badge">In Development</span>'
        : `<a href="./article.html?id=${article.id}" class="preview-btn">
                <i class="bi bi-eye"></i>
                <span>Read</span>
           </a>`;
    
    const readLink = `<a href="./article.html?id=${article.id}" class="project-link primary">
               Read article <i class="bi bi-arrow-right"></i>
           </a>`;
    
    const sourceLink = article.sourceUrl
        ? `<a href="${article.sourceUrl}" target="_blank" class="project-link">
               Source <i class="bi bi-github"></i>
           </a>`
        : '';
    
    const shareButton = `<button type="button" class="project-link share-btn" data-url="./article.html?id=${article.id}" data-title="${escapeHtml(article.title)}"><i class="bi bi-share"></i><span>Share</span></button>`;

    const footerLinks = (readLink || sourceLink)
        ? `${readLink}${sourceLink}${shareButton}`
        : `<span class="project-link disabled">Coming Soon</span>${shareButton}`;
    
    return `
        <article class="project-card ${article.featured ? 'featured' : ''}" data-category="${article.category}" data-index="${index}">
            ${featuredBadge}
            <div class="project-image">
                <img src="${article.image}" alt="${article.title} preview" loading="lazy"/>
                <div class="project-overlay">
                    ${overlayContent}
                </div>
            </div>
            <div class="project-content">
                <div class="project-meta">
                    <span class="project-category">${article.category}</span>
                    <span class="status-badge">${article.status === 'development' ? 'In Development' : 'Published'}</span>
                </div>
                <h3 class="project-title">${article.title}</h3>
                <p class="project-description">${article.description}</p>
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
// Share helpers
// ===================================
function shareOrCopy(url, title) {
    if (navigator.share) {
        navigator.share({ title: title, url: url }).catch(err => {
            console.warn('Share failed:', err);
        });
        return;
    }

    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(url).then(() => {
            alert('Link copied to clipboard');
        }).catch(() => {
            fallbackCopyText(url);
        });
    } else {
        fallbackCopyText(url);
    }
}

function fallbackCopyText(text) {
    const tmp = document.createElement('textarea');
    tmp.value = text;
    tmp.style.position = 'fixed';
    tmp.style.left = '-9999px';
    document.body.appendChild(tmp);
    tmp.select();
    try { document.execCommand('copy'); alert('Link copied to clipboard'); } catch (e) { prompt('Copy this link', text); }
    document.body.removeChild(tmp);
}

function attachShareListeners() {
    document.querySelectorAll('.share-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const url = btn.getAttribute('data-url');
            const title = btn.getAttribute('data-title') || document.title;
            shareOrCopy(url, title);
        });
    });
}

function escapeHtml(str) {
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
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
    
    // Re-render articles with animation
    const articlesGrid = document.getElementById('articles-grid');
    articlesGrid.style.opacity = '0';
    
    setTimeout(() => {
        renderArticles(filterValue);
        articlesGrid.style.transition = 'opacity 0.5s ease-out';
        articlesGrid.style.opacity = '1';
    }, 300);
}

// ===================================
// Animate Cards Entrance
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
        card.addEventListener('focusin', () => card.classList.add('focused'));
        card.addEventListener('focusout', () => card.classList.remove('focused'));
    });
}

// ===================================
// Show Error Message
// ===================================
function showErrorMessage() {
    const articlesGrid = document.getElementById('articles-grid');
    if (!articlesGrid) return;
    
    articlesGrid.innerHTML = `
        <div class="error-message">
            <i class="bi bi-exclamation-triangle" style="font-size: 3rem; color: #f87171; margin-bottom: 1rem;"></i>
            <h3 style="color: var(--text-primary); margin-bottom: 0.5rem;">Failed to Load Articles</h3>
            <p style="color: var(--text-muted);">Please check your connection and try again.</p>
            <button onclick="loadArticles()" class="btn btn-primary" style="margin-top: 1.5rem;">
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
    if (e.key >= '1' && e.key <= '9' && articlesData) {
        const index = parseInt(e.key) - 1;
        const filterButtons = document.querySelectorAll('.filter-btn');
        if (filterButtons[index]) {
            filterButtons[index].click();
        }
    }
});

// ===================================
// Lazy Loading for Images
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
// Update Count (optional)
// ===================================
function updateArticleCount() {
    if (!articlesData) return;
    
    const visibleArticles = currentFilter === 'all' 
        ? articlesData.articles.length
        : articlesData.articles.filter(p => p.category === currentFilter).length;
    
    console.log(`Showing ${visibleArticles} of ${articlesData.articles.length} articles`);
}

// ===================================
// Initialize on Page Load
// ===================================
window.addEventListener('load', () => {
    loadArticles();
});

// ===================================
// Scroll Progress (optional)
// ===================================
function updateScrollProgress() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const progress = (scrollTop / scrollHeight) * 100;
}

window.addEventListener('scroll', updateScrollProgress);

// ===================================
// Click Analytics (optional)
// ===================================
document.addEventListener('click', (e) => {
    const projectCard = e.target.closest('.project-card');
    if (projectCard) {
        const title = projectCard.querySelector('.project-title')?.textContent;
        console.log(`Article clicked: ${title}`);
    }
});
