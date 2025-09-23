document
  .querySelector(".contact-form .icon-wrapper")
  .addEventListener("click", function () {
    sendEmail();
  });

function sendEmail() {
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const message = document.getElementById("message").value;

  if (name && email && message) {
    const mailtoUrl = `mailto:oboyiloejeh@gmail.com?subject=Contact%20from%20${encodeURIComponent(
      name
    )}&body=${encodeURIComponent(message)}%0A%0AFrom: ${encodeURIComponent(
      email
    )}`;

    window.open(mailtoUrl, "_self");

    document.getElementById("name").value = "";
    document.getElementById("email").value = "";
    document.getElementById("message").value = "";
  } else {
    alert("Please fill in all fields.");
  }
}
