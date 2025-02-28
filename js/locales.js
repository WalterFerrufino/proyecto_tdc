document.getElementById("find-icon").addEventListener("click", () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const lat = position.coords.latitude;
                const lng = position.coords.longitude;

                try {
                    const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=AIzaSyCxzCRucR-brugXTGnV5RsOJHM-92XnwMk`);
                    const data = await response.json();

                    if (data.status === "OK") {
                        const address = data.results[0].formatted_address;
                        document.getElementById("search-input").value = address;
                    } else {
                        console.error("No se pudo obtener la dirección:", data.status);
                    }
                } catch (error) {
                    console.error("Error al obtener la dirección:", error);
                }
            },
            (error) => {
                console.error("Error al obtener la ubicación:", error);
            }
        );
    } else {
        console.error("La geolocalización no está soportada en este navegador.");
    }
});
