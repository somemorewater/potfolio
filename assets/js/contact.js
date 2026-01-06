// ===================================
// Copy Email Functionality
// ===================================
function copyEmail() {
    const email = 'oboyiloejeh@gmail.com';
    const copyMessage = document.getElementById('copy-message');
    
    // Create a temporary textarea to copy text
    const textarea = document.createElement('textarea');
    textarea.value = email;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    
    textarea.select();
    textarea.setSelectionRange(0, 99999); // For mobile devices
    
    try {
        document.execCommand('copy');
        
        // Show success message
        copyMessage.classList.add('show');
        
        // Hide message after 2 seconds
        setTimeout(() => {
            copyMessage.classList.remove('show');
        }, 2000);
        
        // Add animation to button
        const copyBtn = event.target.closest('.copy-btn');
        copyBtn.style.transform = 'scale(0.9)';
        setTimeout(() => {
            copyBtn.style.transform = 'scale(1)';
        }, 150);
        
    } catch (err) {
        console.error('Failed to copy email:', err);
    }
    
    document.body.removeChild(textarea);
}

// ===================================
// Email Form Submission
// ===================================
function sendEmail(event) {
    event.preventDefault();
    
    const form = document.getElementById('contactForm');
    const formStatus = document.getElementById('form-status');
    const submitBtn = form.querySelector('.submit-btn');
    
    // Get form values
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;
    
    // Disable submit button
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="btn-text">Sending...</span><span class="btn-icon"><i class="bi bi-hourglass-split"></i></span>';
    
    // Create mailto link
    const subject = encodeURIComponent(`Portfolio Contact from ${name}`);
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`);
    const mailtoLink = `mailto:oboyiloejeh@gmail.com?subject=${subject}&body=${body}`;
    
    // Open default email client
    window.location.href = mailtoLink;
    
    // Show success message
    setTimeout(() => {
        formStatus.className = 'form-status success';
        formStatus.innerHTML = '<i class="bi bi-check-circle-fill"></i> Email client opened! Please send the message.';
        
        // Reset form
        form.reset();
        
        // Re-enable submit button
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<span class="btn-text">Send Message</span><span class="btn-icon"><i class="bi bi-send"></i></span>';
        
        // Hide status after 5 seconds
        setTimeout(() => {
            formStatus.className = 'form-status';
        }, 5000);
    }, 500);
    
    return false;
}

// ===================================
// WhatsApp Form Submission
// ===================================
function sendWhatsApp(event) {
    event.preventDefault();
    
    const form = document.getElementById('whatsappForm');
    const submitBtn = form.querySelector('.submit-btn');
    
    const name = document.getElementById('whatsappName').value;
    const message = document.getElementById('whatsappMessage').value;
    
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="btn-text">Opening...</span><span class="btn-icon"><i class="bi bi-hourglass-split"></i></span>';
    
    const whatsappMessage = encodeURIComponent(`Hi! I'm ${name}.\n\n${message}`);
    const whatsappNumber = '2349078954418';
    const whatsappURL = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;
    
    window.open(whatsappURL, '_blank');
    
    setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<span class="btn-text">Open WhatsApp</span><span class="btn-icon"><i class="bi bi-whatsapp"></i></span>';
        form.reset();
    }, 1000);
    
    return false;
}

// ===================================
// Form Input Animations
// ===================================
const formInputs = document.querySelectorAll('.form-input');

formInputs.forEach(input => {
    input.addEventListener('focus', () => {
        const label = input.previousElementSibling;
        if (label && label.tagName === 'LABEL') {
            label.style.transform = 'translateY(-3px)';
            label.style.color = 'var(--primary)';
        }
    });
    
    input.addEventListener('blur', () => {
        const label = input.previousElementSibling;
        if (label && label.tagName === 'LABEL' && !input.value) {
            label.style.transform = 'translateY(0)';
            label.style.color = 'var(--text-secondary)';
        }
    });
    
    input.addEventListener('input', () => {
        input.style.transform = 'scale(1.01)';
        setTimeout(() => {
            input.style.transform = 'scale(1)';
        }, 100);
    });
});

// ===================================
// Form Validation with Visual Feedback
// ===================================
function validateForm(formId) {
    const form = document.getElementById(formId);
    const inputs = form.querySelectorAll('input[required], textarea[required]');
    let isValid = true;
    
    inputs.forEach(input => {
        if (!input.value.trim()) {
            isValid = false;
            input.style.borderColor = '#f87171';
            
            setTimeout(() => {
                input.style.borderColor = 'var(--glass-border)';
            }, 2000);
        }
    });
    
    return isValid;
}

// ===================================
// Character Counter for Textareas
// ===================================
const textareas = document.querySelectorAll('textarea.form-input');

textareas.forEach(textarea => {
    const maxLength = 500;
    
    // Create counter element
    const counter = document.createElement('div');
    counter.className = 'char-counter';
    counter.style.cssText = `
        text-align: right;
        font-size: 0.85rem;
        color: var(--text-muted);
        margin-top: 0.3rem;
    `;
    
    textarea.parentElement.appendChild(counter);
    
    // Update counter
    function updateCounter() {
        const length = textarea.value.length;
        counter.textContent = `${length} / ${maxLength}`;
        
        if (length > maxLength * 0.9) {
            counter.style.color = '#f59e0b';
        } else {
            counter.style.color = 'var(--text-muted)';
        }
    }
    
    textarea.addEventListener('input', updateCounter);
    updateCounter();
});

// ===================================
// Auto-resize Textareas
// ===================================
textareas.forEach(textarea => {
    textarea.addEventListener('input', function() {
        this.style.height = 'auto';
        this.style.height = (this.scrollHeight) + 'px';
    });
});

// ===================================
// Form Card Entrance Animations
// ===================================
window.addEventListener('load', () => {
    const formCards = document.querySelectorAll('.form-card');
    
    formCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            card.style.transition = 'all 0.6s ease-out';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, 200 + (index * 150));
    });
});

// ===================================
// Add Ripple Effect to Submit Buttons
// ===================================
const submitButtons = document.querySelectorAll('.submit-btn');

submitButtons.forEach(button => {
    button.addEventListener('click', function(e) {
        // Don't add ripple if form is invalid
        const form = this.closest('form');
        if (!form.checkValidity()) {
            return;
        }
        
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: rgba(255, 255, 255, 0.4);
            border-radius: 50%;
            transform: scale(0);
            animation: ripple 0.6s ease-out;
            pointer-events: none;
        `;
        
        this.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    });
});

// Add ripple animation
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// ===================================
// Success Confetti Effect (Optional)
// ===================================
function showConfetti() {
    // This is a placeholder for a confetti effect
    // You could integrate a library like canvas-confetti here
    console.log('🎉 Message sent successfully!');
}

// ===================================
// Keyboard Shortcuts
// ===================================
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + Enter to submit email form
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        const emailForm = document.getElementById('contactForm');
        if (document.activeElement.form === emailForm) {
            e.preventDefault();
            sendEmail(e);
        }
    }
});

// ===================================
// Smooth Scroll to Form on Load (if hash present)
// ===================================
window.addEventListener('load', () => {
    if (window.location.hash === '#contact') {
        const contactForm = document.getElementById('contactForm');
        if (contactForm) {
            contactForm.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }
});

console.log('📧 Contact page loaded! Use Ctrl/Cmd + Enter to quickly submit the email form.');
