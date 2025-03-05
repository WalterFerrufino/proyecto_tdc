document.addEventListener("DOMContentLoaded", function () {
    const barsIcon = document.querySelector(".barsicon");
    const navMenu = document.querySelector(".nav-li-container");

    barsIcon.addEventListener("click", function () {
        navMenu.classList.toggle("hidden");
    });
});

document.addEventListener("DOMContentLoaded", function () {
    function rearrangeNav() {
        const navFigureLi = document.querySelector(".nav-figure-li");
        const navLiContainer = document.querySelector(".nav-li-container");

        if (window.innerWidth >= 1025) {
            navFigureLi.after(navLiContainer);
        } else {
            document.querySelector(".navbar").appendChild(navLiContainer);
        }
    }

    rearrangeNav(); // Ejecutar al cargar la página
    window.addEventListener("resize", rearrangeNav); // Ejecutar cuando cambia el tamaño
});