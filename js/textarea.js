(function() {
    const textareas = document.querySelectorAll("textarea");
  
    textareas.forEach((textarea) => {
      textarea.addEventListener("input", function () {
        this.style.height = "auto"; // Resetea la altura
        this.style.height = this.scrollHeight + "px"; // Ajusta la altura
      });
    });
  })();