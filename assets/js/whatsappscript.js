document
  .querySelector("#whatsappForm")
  .addEventListener("click", function () {
    const name = document.getElementById("whatsappName").value;
    const message = document.getElementById("whatsappMessage").value;

    if (name && message) {
      const whatsappUrl = `https://wa.me/2349078954418?text=I am%20${encodeURIComponent(
        name
      )}%0A${encodeURIComponent(message)}`;
      window.open(whatsappUrl, "_blank");

      document.getElementById("whatsappName").value = "";
      document.getElementById("whatsappMessage").value = "";
    }
  });
