(function () {
    const sidebarRoot = document.getElementById('portfolio-sidebar');
    if (!sidebarRoot) return;

    const path = window.location.pathname.split('/').pop() || 'index.html';
    const view = new URLSearchParams(window.location.search).get('view');
    const isCurrent = (page) => path === page && view === 'about' ? ' aria-current="page"' : '';
    const isNewChat = path === 'index.html' && view !== 'about' ? ' aria-current="page"' : '';
    const isProjectContext = path === 'projects.html' || path === 'project.html' ? ' is-current' : '';
    const isArticleContext = path === 'articles.html' || path === 'article.html' ? ' is-current' : '';

    sidebarRoot.innerHTML = `
        <button class="mobile-menu-toggle" type="button" aria-label="Open navigation" aria-controls="app-sidebar" aria-expanded="false">
            <i data-lucide="panel-left" aria-hidden="true"></i>
        </button>
        <aside class="app-sidebar" id="app-sidebar" aria-label="Portfolio navigation">
            <div class="sidebar-header">
                <a class="sidebar-brand" href="./index.html">SomeMoreWater</a>
                <button class="sidebar-collapse" type="button" aria-label="Collapse sidebar" aria-expanded="true">
                    <i data-lucide="panel-left" aria-hidden="true"></i>
                </button>
            </div>
            <a class="new-chat-link" href="./index.html" data-new-chat${isNewChat}><i data-lucide="square-pen" aria-hidden="true"></i><span class="sidebar-label">New chat</span></a>
            <nav class="sidebar-nav">
                <a class="sidebar-link" href="./index.html?view=about" aria-label="About"${isCurrent('index.html')}><i data-lucide="user-round" aria-hidden="true"></i><span class="sidebar-label">About</span></a>
                <a class="sidebar-link" href="./contact.html" aria-label="Contact"${isCurrent('contact.html')}><i data-lucide="mail" aria-hidden="true"></i><span class="sidebar-label">Contact</span></a>
                <section class="sidebar-group">
                    <button class="sidebar-link sidebar-disclosure${isProjectContext}" type="button" aria-label="Toggle Projects" aria-expanded="true" aria-controls="sidebar-projects">
                        <span class="sidebar-disclosure-label"><i data-lucide="folder-code" aria-hidden="true"></i><span class="sidebar-label">Projects</span></span>
                        <i data-lucide="chevron-down" class="disclosure-icon" aria-hidden="true"></i>
                    </button>
                    <div class="sidebar-history" id="sidebar-projects"></div>
                </section>
                <section class="sidebar-group">
                    <button class="sidebar-link sidebar-disclosure${isArticleContext}" type="button" aria-label="Toggle Articles" aria-expanded="false" aria-controls="sidebar-articles">
                        <span class="sidebar-disclosure-label"><i data-lucide="book-open-text" aria-hidden="true"></i><span class="sidebar-label">Articles</span></span>
                        <i data-lucide="chevron-down" class="disclosure-icon" aria-hidden="true"></i>
                    </button>
                    <div class="sidebar-history" id="sidebar-articles" hidden></div>
                </section>
            </nav>
            <div class="sidebar-footer">
                <div class="sidebar-socials" aria-label="Social links">
                    <a href="https://github.com/somemorewater" target="_blank" rel="noopener noreferrer" aria-label="GitHub"><i data-lucide="github" aria-hidden="true"></i></a>
                    <a href="https://x.com/SomeMoreWater" target="_blank" rel="noopener noreferrer" aria-label="X"><i data-lucide="twitter" aria-hidden="true"></i></a>
                    <a href="https://instagram.com/somemorewater" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><i data-lucide="instagram" aria-hidden="true"></i></a>
                </div>
            </div>
        </aside>
        <button class="sidebar-backdrop" type="button" aria-label="Close navigation" tabindex="-1"></button>
    `;

    const sidebar = document.getElementById('app-sidebar');
    const mobileToggle = sidebarRoot.querySelector('.mobile-menu-toggle');
    const collapseButton = sidebarRoot.querySelector('.sidebar-collapse');
    const backdrop = sidebarRoot.querySelector('.sidebar-backdrop');

    function closeMobileMenu() {
        sidebar.classList.remove('mobile-open');
        mobileToggle.setAttribute('aria-expanded', 'false');
    }

    mobileToggle.addEventListener('click', () => {
        const isOpen = sidebar.classList.toggle('mobile-open');
        mobileToggle.setAttribute('aria-expanded', String(isOpen));
    });
    backdrop.addEventListener('click', closeMobileMenu);

    collapseButton.addEventListener('click', () => {
        const isCollapsed = sidebar.classList.toggle('is-collapsed');
        document.body.classList.toggle('sidebar-collapsed', isCollapsed);
        collapseButton.setAttribute('aria-expanded', String(!isCollapsed));
        collapseButton.setAttribute('aria-label', isCollapsed ? 'Expand sidebar' : 'Collapse sidebar');
    });

    sidebarRoot.querySelectorAll('.sidebar-disclosure').forEach((button) => {
        button.addEventListener('click', () => {
            const panel = document.getElementById(button.getAttribute('aria-controls'));
            const isOpen = button.getAttribute('aria-expanded') === 'true';
            button.setAttribute('aria-expanded', String(!isOpen));
            panel.hidden = isOpen;
        });
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') closeMobileMenu();
    });

    sidebarRoot.querySelectorAll('[data-new-chat]').forEach((link) => {
        link.addEventListener('click', () => {
            try {
                sessionStorage.removeItem('portfolio-new-chat-messages');
            } catch (error) {}
        });
    });

    function escapeHtml(value) {
        return String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
    }

    async function loadHistory(url, key, targetId, toHref) {
        const target = document.getElementById(targetId);
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error('Could not load navigation items');
            const data = await response.json();
            target.innerHTML = data[key].map((item) => `
                <a class="sidebar-history-link" href="${toHref(item)}" title="${escapeHtml(item.title)}">${escapeHtml(item.title)}</a>
            `).join('');
        } catch (error) {
            target.innerHTML = '<span class="sidebar-history-error">Items unavailable</span>';
        }
    }

    loadHistory('./data/projects.json', 'projects', 'sidebar-projects', (project) => `./project.html?id=${project.id}`);
    loadHistory('./data/articles.json', 'articles', 'sidebar-articles', (article) => `./article.html?id=${article.id}`);

    if (typeof window.refreshIcons === 'function') window.refreshIcons();
}());
