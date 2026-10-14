// Shared Lucide icon helper (vanilla equivalent of a shared icon component).
// Renders every <i data-lucide="..."> placeholder as an inline SVG.
// Safe to call repeatedly: required after any dynamic HTML injection
// (sidebar, project/article cards, detail pages, error states).
(function () {
    function refreshIcons() {
        try {
            if (window.lucide && typeof window.lucide.createIcons === 'function') {
                window.lucide.createIcons();
            }
        } catch (error) {
            // Icons are decorative; never break page behavior.
        }
    }

    window.refreshIcons = refreshIcons;

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', refreshIcons);
    } else {
        refreshIcons();
    }
}());
