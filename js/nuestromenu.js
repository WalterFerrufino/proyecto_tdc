// Seleccionamos todos los overlays
const overlays = document.querySelectorAll(".menus-overlay > div");
const menusOverlay = document.querySelector(".menus-overlay");

// Función para ocultar todos los overlays
function hideAllOverlays() {
    overlays.forEach(overlay => overlay.style.display = "none");
}

// Función para ocultar el scroll
function hideScroll() {
    document.body.style.overflow = "hidden";
}

// Función para mostrar el scroll
function showScroll() {
    document.body.style.overflow = "auto";
}

// Evento para cerrar el overlay y restaurar el scroll
document.querySelectorAll(".menu-overlay-close").forEach(closeBtn => {
    closeBtn.addEventListener("click", function() {
        menusOverlay.style.display = "none";
        hideAllOverlays();
        showScroll(); // Restaura el scroll cuando se cierra
    });
});

// Eventos para abrir cada imagen en su overlay correspondiente
document.querySelectorAll(".menu-img1, .menu-img2, .menu-img3").forEach((img, index) => {
    img.addEventListener("click", function() {
        menusOverlay.style.display = "flex";
        hideAllOverlays(); // Ocultar todos los overlays antes de mostrar el correcto
        overlays[index].style.display = "flex";
        hideScroll(); // Ocultar el scroll cuando se abre el overlay
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
