function copyEmail() {
  const email = document.getElementById("email-link").textContent;
  const tempInput = document.createElement("input");
  document.body.appendChild(tempInput);
  tempInput.value = email;
  tempInput.select();
  document.execCommand("copy");
  document.body.removeChild(tempInput);

  // Show confirmation message
  const message = document.getElementById("copy-message");
  message.style.display = "inline";
  setTimeout(() => {
    message.style.display = "none";
  }, 2000); // Message disappears after 2 seconds
}
