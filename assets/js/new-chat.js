(function () {
    const page = document.getElementById('new-chat-page');
    const about = document.getElementById('about-content');
    if (!page || !about) return;

    const isAboutView = new URLSearchParams(window.location.search).get('view') === 'about';
    page.hidden = isAboutView;
    about.hidden = !isAboutView;
    if (isAboutView) return;

    const form = document.getElementById('chat-composer');
    const input = document.getElementById('chat-input');
    const messages = document.getElementById('chat-messages');
    const sendButton = form.querySelector('button[type="submit"]');
    const status = document.getElementById('chat-status');
    const storageKey = 'portfolio-new-chat-messages';
    let responses = [];
    let previousResponse = '';

    function readConversation() {
        try {
            return JSON.parse(sessionStorage.getItem(storageKey) || '[]');
        } catch (error) {
            return [];
        }
    }

    function saveConversation(conversation) {
        try {
            sessionStorage.setItem(storageKey, JSON.stringify(conversation));
        } catch (error) {}
    }

    function renderMessage(role, text) {
        const item = document.createElement('article');
        item.className = `chat-message chat-message-${role}`;
        const label = document.createElement('span');
        label.className = 'chat-message-label';
        label.textContent = role === 'visitor' ? 'You' : 'Portfolio banter';
        const body = document.createElement('p');
        body.textContent = text;
        item.append(label, body);
        messages.append(item);
    }

    function renderConversation() {
        const conversation = readConversation();
        conversation.forEach((message) => renderMessage(message.role, message.text));
        const lastReply = [...conversation].reverse().find((message) => message.role === 'portfolio');
        previousResponse = lastReply ? lastReply.text : '';
    }

    function chooseResponse() {
        const options = responses.length > 1
            ? responses.filter((response) => response !== previousResponse)
            : responses;
        return options[Math.floor(Math.random() * options.length)];
    }

    function updateChatState() {
        const hasMessages = messages.children.length > 0;
        page.classList.toggle('is-chatting', hasMessages);
    }

    function startNewChat() {
        try {
            sessionStorage.removeItem(storageKey);
        } catch (error) {}
        previousResponse = '';
        messages.replaceChildren();
        input.value = '';
        updateChatState();
        input.focus();
    }

    document.querySelectorAll('[data-new-chat]').forEach((link) => {
        link.addEventListener('click', (event) => {
            if (link.getAttribute('href') !== './index.html') return;
            event.preventDefault();
            startNewChat();
            window.history.replaceState({}, '', './index.html');
        });
    });

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        const text = input.value.trim();
        if (!text || responses.length === 0) return;

        const reply = chooseResponse();
        const conversation = readConversation();
        conversation.push({ role: 'visitor', text }, { role: 'portfolio', text: reply });
        saveConversation(conversation);
        renderMessage('visitor', text);
        renderMessage('portfolio', reply);
        previousResponse = reply;
        updateChatState();
        input.value = '';
        input.focus();
    });

    input.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            form.requestSubmit();
        }
    });

    fetch('./data/humor-responses.json')
        .then((response) => {
            if (!response.ok) throw new Error('Could not load local responses');
            return response.json();
        })
        .then((data) => {
            responses = Array.isArray(data.responses) ? data.responses.filter((response) => typeof response === 'string' && response.trim()) : [];
            if (responses.length === 0) throw new Error('No local responses available');
            sendButton.disabled = false;
            status.textContent = 'Local humor replies ready — canned JSON banter, not AI answers.';
        })
        .catch(() => {
            status.textContent = 'Local replies are unavailable right now.';
        });

    renderConversation();
    updateChatState();
}());
