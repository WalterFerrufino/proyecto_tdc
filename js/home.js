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

// ---------------- SLIDER ----------------

let imagenes = ["slider1", "slider2", "slider3"];
let index = 0;
let autoplayInterval;

// Función para cambiar la imagen manualmente o con autoplay
function cambiarImagen(direccion = 1) {
    document.getElementById(imagenes[index]).classList.remove("active");
    index = (index + direccion + imagenes.length) % imagenes.length;
    document.getElementById(imagenes[index]).classList.add("active");
    reiniciarAutoplay();
}

// Función para iniciar el autoplay
function iniciarAutoplay() {
    autoplayInterval = setInterval(() => cambiarImagen(1), 40000);
}

// Función para reiniciar el autoplay cuando el usuario interactúa
function reiniciarAutoplay() {
    clearInterval(autoplayInterval);
    iniciarAutoplay();
}

// Hacer visible la primera imagen al cargar la página
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById(imagenes[0]).classList.add("active");
    iniciarAutoplay();
});

// ---------------- SLIDER ----------------

const track = document.querySelector('.carousel-track');
const images = document.querySelectorAll('.carousel img');
const cprevButton = document.querySelector('.cprev');
const cnextButton = document.querySelector('.cnext');
const indicatorsContainer = document.querySelector('.indicators');
let currentIndex = 0;
let numIndicators = 0;
let step = 1;

function getVisibleImages() {
    const carousel = document.querySelector('.carousel');
    const carouselWidth = carousel.clientWidth;
    const imageWidth = images[0].clientWidth;
    return Math.max(1, Math.floor(carouselWidth / imageWidth));
}

function createIndicators() {
    indicatorsContainer.innerHTML = '';
    step = getVisibleImages();
    numIndicators = Math.ceil(images.length / step);
    
    for (let i = 0; i < numIndicators; i++) {
        const indicator = document.createElement('div');
        indicator.classList.add('indicator');
        if (i === 0) indicator.classList.add('cactive');
        indicator.addEventListener('click', () => goToSlide(i * step));
        indicatorsContainer.appendChild(indicator);
    }
    updateIndicators();
}

function updateIndicators() {
    document.querySelectorAll('.indicator').forEach((dot, i) => {
        dot.classList.toggle('cactive', i === Math.floor(currentIndex / step));
    });
}

function goToSlide(index) {
    currentIndex = (index + images.length) % images.length;
    track.style.transition = 'transform 0.3s ease-in-out';
    track.style.transform = `translateX(-${currentIndex * (100 / step)}%)`;
    updateIndicators();
}

cprevButton.addEventListener('click', () => goToSlide(currentIndex - step));
cnextButton.addEventListener('click', () => goToSlide(currentIndex + step));

window.addEventListener('resize', createIndicators);
createIndicators();
