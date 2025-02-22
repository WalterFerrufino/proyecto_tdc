window.addEventListener('scroll', function() {
    const parallaxImages = document.querySelectorAll('.parallax__img');

    parallaxImages.forEach(function(img) {
        const rect = img.getBoundingClientRect();
        const scrollPosition = window.pageYOffset;
        const imgTop = rect.top + scrollPosition;

        if (scrollPosition + window.innerHeight > imgTop && scrollPosition < imgTop + rect.height) {
            img.style.transform = 'translateY(' + (scrollPosition - imgTop) * 0.8 + 'px)';
        }
    });
});
