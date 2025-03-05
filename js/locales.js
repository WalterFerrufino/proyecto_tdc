let map;
let userLocation;
let userMarker;

function initMap() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            userLocation = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };

            obtenerDireccionUsuario(userLocation.lat, userLocation.lng);

            map = new google.maps.Map(document.getElementById("map"), {
                center: userLocation,
                zoom: 12
            });

            userMarker = new google.maps.Marker({
                position: userLocation,
                map: map,
                title: "Tu ubicación",
                icon: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png"
            });

            if (google.maps.places) {
                buscarSucursales();
            } else {
                console.error("Google Places API no está disponible.");
            }

        }, () => {
            console.error("No se pudo obtener la ubicación del usuario.");
        });
    } else {
        console.error("Geolocalización no es soportada por este navegador.");
    }
}

// 🔥 Función para obtener la dirección del usuario usando la Geocoding API
function obtenerDireccionUsuario(lat, lng) {
    const apiKey = "AIzaSyCf4nI2F04G6ijnSrDlU9MoWBN4kbnKXrA"; // Reemplazá con tu API Key
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            console.log("Respuesta de la API de Geocoding:", data); // 👀 Ver si llega bien la data

            if (data.status === "OK" && data.results.length > 0) {
                const direccion = data.results[0].formatted_address; // Obtiene la dirección formateada
                console.log("Dirección obtenida:", direccion); // 👀 Ver si se obtiene la dirección
                
                document.getElementById("search-input").value = direccion; // Muestra la dirección en el input
            } else {
                console.error("Error al obtener la dirección:", data.status);
            }
        })
        .catch(error => console.error("Error en la solicitud de geocodificación:", error));
}


document.getElementById("search-icon").addEventListener("click", () => {
    const address = document.getElementById("search-input").value.trim();
    if (address === "") return;

    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ address }, (results, status) => {
        if (status === "OK") {
            const newLocation = results[0].geometry.location;
            userLocation = { lat: newLocation.lat(), lng: newLocation.lng() };

            map.setCenter(userLocation);
            userMarker.setPosition(userLocation);
            buscarSucursales();
        } else {
            console.error("No se pudo encontrar la dirección:", status);
        }
    });
});

function buscarSucursales() {
    const service = new google.maps.places.PlacesService(map);
    const geocoder = new google.maps.Geocoder();
    const request = {
        query: "Tienda de Café",
        fields: ["name", "geometry", "formatted_address"]
    };

    service.textSearch(request, (results, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
            let sucursales = results.map(place => ({
                place,
                distancia: calcularDistancia(userLocation, place.geometry.location)
            }));

            sucursales.sort((a, b) => a.distancia - b.distancia);
            mostrarSucursales(sucursales, geocoder);
        } else {
            console.error("No se encontraron resultados:", status);
        }
    });
}

function mostrarSucursales(sucursales, geocoder) {
    const storesContainer = document.querySelector(".stores-container");
    storesContainer.innerHTML = "";

    sucursales.forEach(({ place, distancia }) => {
        const mapsURL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.formatted_address)}`;

        // 📌 Crear el marcador
        const marker = new google.maps.Marker({
            position: place.geometry.location,
            map: map,
            title: place.name
        });

        // 🚀 Agregar evento para abrir Google Maps al hacer clic en el pin
        marker.addListener("click", () => {
            window.open(mapsURL, "_blank");
        });

        // 🏪 Geocodificación para obtener el barrio
        geocoder.geocode({ location: place.geometry.location }, (geocodeResults, geocodeStatus) => {
            if (geocodeStatus === "OK" && geocodeResults.length > 0) {
                const barrio = obtenerBarrio(geocodeResults);
                const nombreSucursal = `Tienda ${barrio}`;

                const storeDiv = document.createElement("div");
                storeDiv.classList.add("store");
                storeDiv.innerHTML = `
                    <h3 class="store-name">${nombreSucursal}</h3>
                    <p class="store-address">${place.formatted_address}</p>
                    <p class="store-distance">Distancia: ${distancia.toFixed(2)} km</p>
                `;

                storeDiv.addEventListener("click", () => window.open(mapsURL, "_blank"));
                storesContainer.appendChild(storeDiv);
            } else {
                console.error("No se pudo determinar el barrio:", geocodeStatus);
            }
        });
    });
}

function calcularDistancia(userLoc, storeLoc) {
    const R = 6371;
    const dLat = (storeLoc.lat() - userLoc.lat) * (Math.PI / 180);
    const dLng = (storeLoc.lng() - userLoc.lng) * (Math.PI / 180);

    const a = Math.sin(dLat / 2) ** 2 +
              Math.cos(userLoc.lat * (Math.PI / 180)) *
              Math.cos(storeLoc.lat() * (Math.PI / 180)) *
              Math.sin(dLng / 2) ** 2;

    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function obtenerBarrio(geocodeResults) {
    for (const result of geocodeResults) {
        for (const component of result.address_components) {
            if (component.types.includes("sublocality") || component.types.includes("locality")) {
                return component.long_name;
            }
        }
    }
    return "Desconocido";
}

document.getElementById("find-icon").addEventListener("click", () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                const geocoder = new google.maps.Geocoder();
                const latlng = { lat: latitude, lng: longitude };

                geocoder.geocode({ location: latlng }, (results, status) => {
                    if (status === "OK" && results[0]) {
                        document.getElementById("search-input").value = results[0].formatted_address;
                    } else {
                        console.error("No se pudo obtener la dirección.");
                    }
                });
            },
            (error) => {
                console.error("Error al obtener la ubicación:", error.message);
            }
        );
    } else {
        alert("La geolocalización no está soportada en este navegador.");
    }
});



/* ------------------------------------ LO DE ABAJO ES PARA TRABAJAR SIN API KEY

const sucursales = [
    { nombre: "Tienda Recoleta", direccion: "Av. Callao 1234, Buenos Aires", lat: -34.588, lng: -58.397 },
    { nombre: "Tienda Palermo", direccion: "Av. Santa Fe 5678, Buenos Aires", lat: -34.579, lng: -58.415 },
    { nombre: "Tienda Belgrano", direccion: "Juramento 2500, Buenos Aires", lat: -34.562, lng: -58.450 }
];

// Obtener ubicación del usuario sin API Key
navigator.geolocation.getCurrentPosition((pos) => {
    const latUser = pos.coords.latitude;
    const lngUser = pos.coords.longitude;

    // Calcular distancia con la fórmula de Haversine
    sucursales.forEach(sucursal => {
        sucursal.distancia = calcularDistancia(latUser, lngUser, sucursal.lat, sucursal.lng);
    });

    // Ordenar por distancia
    sucursales.sort((a, b) => a.distancia - b.distancia);

    // Mostrar sucursales
    const storesContainer = document.querySelector(".stores-container");
    storesContainer.innerHTML = "";
    
    sucursales.forEach(sucursal => {
        const storeDiv = document.createElement("div");
        storeDiv.classList.add("store");
        storeDiv.innerHTML = `
            <h3 class="store-name">${sucursal.nombre}</h3>
            <p class="store-address">${sucursal.direccion}</p>
            <p class="store-distance">Distancia: ${sucursal.distancia.toFixed(2)} km</p>
        `;
        storeDiv.addEventListener("click", () => {
            window.open(`https://www.google.com/maps/search/?q=${encodeURIComponent(sucursal.direccion)}`, "_blank");
        });

        storesContainer.appendChild(storeDiv);
    });
});

// Función para calcular distancia con la fórmula de Haversine
function calcularDistancia(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radio de la Tierra en km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a = 
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * 
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distancia en km
}

*/