// ================= EMAIL =================
function sendEmail(e) {
  e.preventDefault();

  const form = document.getElementById("contactForm");
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const message = document.getElementById("message").value;

  emailjs
    .send("service_42gq4dg", "template_50rjjaa", {
      name,
      email,
      message,
    })
    .then(() => {
      alert("Message sent");
      form.reset();
    })
    .catch((err) => {
      console.error(err);
      alert("Email failed");
    });
}

// ================= WHATSAPP =================
function sendWhatsApp(e) {
  e.preventDefault();

  const form = document.getElementById("whatsappForm");
  const btn = form.querySelector(".submit-btn");
  const name = document.getElementById("whatsappName").value;
  const message = document.getElementById("whatsappMessage").value;

  btn.disabled = true;
  btn.innerHTML = "Opening...";

  const text = encodeURIComponent(`Hi! I'm ${name}.\n\n${message}`);
  window.open(`https://wa.me/2349078954418?text=${text}`, "_blank");

  setTimeout(() => {
    btn.disabled = false;
    btn.innerHTML = "Open WhatsApp";
    form.reset();
  }, 1000);
}

// ================= INPUT EFFECTS =================
document.querySelectorAll(".form-input").forEach((input) => {
  input.addEventListener("focus", () => {
    const label = input.previousElementSibling;
    if (label?.tagName === "LABEL") {
      label.style.transform = "translateY(-3px)";
      label.style.color = "var(--primary)";
    }
  });

  input.addEventListener("blur", () => {
    const label = input.previousElementSibling;
    if (label?.tagName === "LABEL" && !input.value) {
      label.style.transform = "translateY(0)";
      label.style.color = "var(--text-secondary)";
    }
  });

  input.addEventListener("input", () => {
    input.style.transform = "scale(1.01)";
    setTimeout(() => (input.style.transform = "scale(1)"), 100);
  });
});

// ================= TEXTAREA HELPERS =================
document.querySelectorAll("textarea.form-input").forEach((textarea) => {
  const counter = document.createElement("div");
  counter.className = "char-counter";
  counter.style.cssText =
    "text-align:right;font-size:.85rem;color:var(--text-muted);margin-top:.3rem;";
  textarea.parentElement.appendChild(counter);

  const update = () => {
    counter.textContent = `${textarea.value.length} / 500`;
  };

  textarea.addEventListener("input", () => {
    textarea.style.height = "auto";
    textarea.style.height = textarea.scrollHeight + "px";
    update();
  });

  update();
});

// ================= CARD ANIMATION =================
window.addEventListener("load", () => {
  document.querySelectorAll(".form-card").forEach((card, i) => {
    card.style.opacity = "0";
    card.style.transform = "translateY(30px)";
    setTimeout(() => {
      card.style.transition = "0.6s ease";
      card.style.opacity = "1";
      card.style.transform = "translateY(0)";
    }, 200 + i * 150);
  });
});

// ================= BUTTON RIPPLE =================
document.querySelectorAll(".submit-btn").forEach((btn) => {
  btn.addEventListener("click", (e) => {
    const ripple = document.createElement("span");
    const rect = btn.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);

    ripple.style.cssText = `
      position:absolute;
      width:${size}px;
      height:${size}px;
      left:${e.clientX - rect.left - size / 2}px;
      top:${e.clientY - rect.top - size / 2}px;
      background:rgba(255,255,255,.4);
      border-radius:50%;
      animation:ripple .6s ease-out;
      pointer-events:none;
    `;

    btn.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  });
});

const rippleStyle = document.createElement("style");
rippleStyle.textContent = `
@keyframes ripple {
  to { transform: scale(4); opacity: 0; }
}`;
document.head.appendChild(rippleStyle);

// ================= SHORTCUT =================
document.addEventListener("keydown", (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
    const form = document.getElementById("contactForm");
    if (document.activeElement.form === form) sendEmail(e);
  }
});
