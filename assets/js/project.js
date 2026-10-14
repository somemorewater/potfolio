(async function () {
    const title = document.getElementById('project-title');
    const description = document.getElementById('project-description');
    const category = document.getElementById('project-category');
    const content = document.getElementById('project-content');
    const id = Number(new URLSearchParams(window.location.search).get('id'));

    function escapeHtml(value) {
        return String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
    }

    function formatStatus(value) {
        return String(value || '').replace(/\b\w/g, (letter) => letter.toUpperCase());
    }

    try {
        const response = await fetch('./data/projects.json');
        if (!response.ok) throw new Error('Could not load projects');
        const data = await response.json();
        const project = data.projects.find((item) => item.id === id);

        if (!project) {
            title.textContent = 'Project not found';
            description.textContent = 'The requested project could not be found.';
            content.innerHTML = '<a class="project-link" href="./projects.html">Back to projects</a>';
            return;
        }

        document.title = `${project.title} | Water - Ejeh Oboyilo`;
        title.textContent = project.title;
        description.textContent = project.description;
        category.textContent = project.category;

        const tags = project.tags.map((tag) => `<span class="tag">${escapeHtml(tag)}</span>`).join('');
        const stats = project.stats.map((stat) => `<div class="stat"><i data-lucide="${escapeHtml(stat.icon)}" aria-hidden="true"></i><span>${escapeHtml(stat.label)}</span></div>`).join('');
        const liveLink = project.liveUrl ? `<a class="project-link primary" href="${escapeHtml(project.liveUrl)}" target="_blank" rel="noopener noreferrer">Open live project <i data-lucide="square-arrow-out-up-right" aria-hidden="true"></i></a>` : '';
        const sourceLink = project.githubUrl ? `<a class="project-link" href="${escapeHtml(project.githubUrl)}" target="_blank" rel="noopener noreferrer">Source code <i data-lucide="github" aria-hidden="true"></i></a>` : '';
        const links = liveLink || sourceLink ? `${liveLink}${sourceLink}` : '<span class="project-link disabled">Links coming soon</span>';

        content.innerHTML = `
            <figure class="detail-image"><img src="${escapeHtml(project.image)}" alt="${escapeHtml(project.title)} preview" /></figure>
            <div class="detail-meta"><span class="status-badge">${escapeHtml(formatStatus(project.status))}</span></div>
            <section class="detail-section"><h2>Overview</h2><p>${escapeHtml(project.description)}</p></section>
            <section class="detail-section"><h2>Technologies</h2><div class="project-tags">${tags}</div></section>
            <section class="detail-section"><h2>Highlights</h2><div class="project-stats">${stats}</div></section>
            <div class="project-footer"><a class="project-link" href="./projects.html">All projects</a>${links}</div>
        `;
        if (typeof window.refreshIcons === 'function') window.refreshIcons();
    } catch (error) {
        title.textContent = 'Project unavailable';
        description.textContent = '';
        content.innerHTML = '<div class="error-message">Failed to load this project. Please try again.</div>';
    }
}());
