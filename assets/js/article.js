// article.js - loads a single article based on ?id= or ?slug=
function getQueryParam(name) {
    const params = new URLSearchParams(window.location.search);
    return params.get(name);
}

async function loadArticle() {
    const idParam = getQueryParam('id');
    const slugParam = getQueryParam('slug');

    try {
        const res = await fetch('./data/articles.json');
        if (!res.ok) throw new Error('Failed to fetch articles');
        const data = await res.json();

        let article = null;
        if (idParam) {
            const id = parseInt(idParam, 10);
            article = data.articles.find(a => a.id === id);
        } else if (slugParam) {
            article = data.articles.find(a => a.slug === slugParam);
        }

        const container = document.getElementById('article-content');
        const titleEl = document.getElementById('article-title');
        const descEl = document.getElementById('article-description');
        const catEl = document.getElementById('article-category');

        if (!article) {
            titleEl.textContent = 'Article not found';
            descEl.textContent = '';
            container.innerHTML = '<p class="no-projects">We could not find the requested article.</p>';
            return;
        }

        // Populate header
        titleEl.textContent = article.title;
        descEl.textContent = article.description || '';
        catEl.textContent = article.category || 'Article';

        // Build article body
        const imgHtml = article.image ? `<div class="project-image"><img src="${article.image}" alt="${article.title}"/></div>` : '';
        const tagsHtml = (article.tags || []).map(t => `<span class="tag">${t}</span>`).join(' ');
        const statsHtml = (article.stats || []).map(s => `<div class="stat"><i class="${s.icon}"></i><span>${s.label}</span></div>`).join('');

        const sourceLink = article.sourceUrl ? `<a href="${article.sourceUrl}" target="_blank" class="project-link">Source <i class="bi bi-github"></i></a>` : '';

        container.innerHTML = `
            ${imgHtml}
            <div class="article-body">${article.content || '<p>No content available.</p>'}</div>
            <div class="project-tags">${tagsHtml}</div>
            <div class="project-stats">${statsHtml}</div>
            <div class="project-footer">
                <a href="./articles.html" class="project-link">Back to articles</a>
                ${sourceLink}
            </div>
        `;

    } catch (err) {
        console.error(err);
        const container = document.getElementById('article-content');
        container.innerHTML = '<div class="error-message">Failed to load article. Please try again.</div>';
    }
}

window.addEventListener('load', loadArticle);
