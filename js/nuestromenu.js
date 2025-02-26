// Seleccionamos todos los overlays
const overlays = document.querySelectorAll(".menus-overlay > div");
const menusOverlay = document.querySelector(".menus-overlay");

// Función para ocultar todos los overlays
function hideAllOverlays() {
    overlays.forEach(overlay => overlay.style.display = "none");
}

// Evento para cerrar el overlay
document.querySelectorAll(".menu-overlay-close").forEach(closeBtn => {
    closeBtn.addEventListener("click", function() {
        menusOverlay.style.display = "none";
        hideAllOverlays();
    });
});

// Eventos para abrir cada imagen en su overlay correspondiente
document.querySelectorAll(".menu-img1, .menu-img2, .menu-img3").forEach((img, index) => {
    img.addEventListener("click", function() {
        menusOverlay.style.display = "flex";
        hideAllOverlays(); // Ocultar todos los overlays antes de mostrar el correcto
        overlays[index].style.display = "flex";
    });
});

// Función para mostrar un overlay específico
function showOverlay(index) {
    hideAllOverlays();
    overlays[index].style.display = "flex";
}

// Agregar eventos a los botones de avance (derecha)
document.querySelectorAll(".menu-overlay__p-right").forEach((btn, index) => {
    btn.addEventListener("click", function() {
        let nextIndex = (index + 1) % overlays.length;
        showOverlay(nextIndex);
    });
});

// Agregar eventos a los botones de retroceso (izquierda)
document.querySelectorAll(".menu-overlay__p-left").forEach((btn, index) => {
    btn.addEventListener("click", function() {
        let prevIndex = (index - 1 + overlays.length) % overlays.length;
        showOverlay(prevIndex);
    });
});





// Función para ocultar el scroll
function hideScroll() {
    document.body.style.overflow = "hidden";
}

// Función para mostrar el scroll
function showScroll() {
    document.body.style.overflow = "auto";
}

// Modificar los eventos de apertura para ocultar el scroll
document.querySelectorAll(".menu-img").forEach(img => {
    img.addEventListener("click", function() {
        document.querySelector(".menus-overlay").style.display = "flex";
        hideScroll();
    });
});

// Modificar el evento de cierre para volver a mostrar el scroll
document.querySelector(".menu-overlay-close").addEventListener("click", function() {
    document.querySelector(".menus-overlay").style.display = "none";
    showScroll();
});
