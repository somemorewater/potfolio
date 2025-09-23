const toggleBtn = document.querySelector(".menu-toggle");
const sidebar = document.querySelector(".sidebar");

function toggleSidebar() {
  if (window.innerWidth > 1024) {
    sidebar.classList.toggle("hidden");
  } else {
    sidebar.classList.toggle("show");
  }
}

toggleBtn.addEventListener("click", toggleSidebar);
