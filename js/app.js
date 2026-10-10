// Firma del desarrollador y variables globales
// Escribe tu nombre y documento exacto. Esto va a personalizar la aplicacion
const developerName = "Juan Miguel López Quintana";
const developerId = "67604";
const baseUrl = "https://rickandmortyapi.com/api";


//Arreglo para favoritos. Usaremos mas adelante
let favoritesArray = [];


//Seleccion elementos del DOM
const dataContainer = document.getElementById('dataContainer');
const btnCharacters = document.getElementById('btnCharacters');
const btnLocations = document.getElementById('btnLocations');
const btnEpisodes = document.getElementById('btnEpisodes');
const btnFavorites = document.getElementById('btnFavorites');
const mainFooter = document.getElementById('mainFooter');


//Inyeccion de la firma
// Modificamos el contenido del footer en tiempo real
mainFooter.innerHTML = `<p>Developed with 💻 by <strong>${developerName}</strong>
                        (ID: ${developerId})</p>`;


//Funcion para obtener datos (Asincronia)
//Recibe el endpoint para saber que datos buscar (/character, /location, /episode)
async function fetchData(endpoint){
    try{
        //mostramos mensaje de carga mientras llegan los datos
        dataContainer.innerHTML = `<p class="loading-text>Loading multiverse data...</p>`;

        //Hacemos la peticion a la API
        const response = await fetch(`${baseUrl}${endpoint}`);
        const data = await response.json();

        //La API de Rick and Morty guarda los items dentro de una propiedad llamada 'results'
        return data.results;
    } catch (error) {
        console.error("Error: ", error);
        dataContainer.innerHTML = 
                    '<p class="loading-text" style="color: red;">Connection error</p>'
    }
}

//Funciones de renderizado (DOM)
//Funcion para pintar personajes (Incluye el boton de favoritos)
function renderCharacters(charactersData){
    dataContainer.innerHTML = '';   //Limpiamos la pantalla

    charactersData.forEach(character =>{
        //Determinamos el color del estado(Alive = verde, Dead = rojo)
        const statusColor = character.status === 'Alive' ? 'lime' : 
                            (character.status === 'Dead' ? 'red' : 'gray');

        //Creamos la tarjeta (Card)
        const cardHtml = `
            <article class="data-card">
                <img src="${character.image}" alt="${character.name}">
                <div class="card-info">
                    <h2>${character.name}</h2>
                    <p class="info-label">Status: <span style="color ${statusColor}">${character.status}</span></p>
                    <p class="info-label">Species: ${character.species}</p>

                    <!-- Boton para guardar favorito. Le pasamos el nombre del personaje en una funcion onclick -->
                    <button class="btn-add-fav" onclick="addToFavorites('${character.name}', '${character.image}')">
                        ⭐Add to Favorites
                    </button>
                </div>
            </article>`;
        dataContainer.innerHTML += cardHtml;
    });
}

//Funcion para pintar ubicaciones (Locations)
function renderLocations(locationsData){
    dataContainer.innerHTML = '';
    locationsData.forEach(location => {
        dataContainer.innerHTML += `
        <article class="data-card">
            <div class="card-info">
                <h2>🌎${location.name}</h2>
                <p class="info-label">Type: <span style="color: white;">${location.type}</span></p>
                <p class="info-label">Dimension: ${location.dimension}</p>
            </div>
        </article>
        `;
    });
}

//Funcion para pintar episodios
function renderEpisodes(episodesData){
    dataContainer.innerHTML = '';
    episodesData.forEach(episode => {
        dataContainer.innerHTML += `
        <article class="data-card">
            <div class="card-info">
                <h2>📺${episode.name}</h2>
                <p class="info-label">Code: <span style="color: lime;">${episode.episode}</span></p>
                <p class="info-label">Air Date: ${episode.air_date}</p>
            </div>
        </article>
        `;
    });
}


//Logica de favoritos (LocalStorage)
//Esta funcion se ejecuta cuando damos click en el boton add to favorites de una tarjeta
function addToFavorites(name, image){
    //Creamos objeto con los datos del personaje
    const newFavorite = {name: name, image: image};

    //Agregamos el objeto a nuestro arreglo de favoritos
    favoritesArray.push(newFavorite);

    //Serializamos el arreglo en texto (JSON) y lo guardamos en memoria del navegador
    localStorage.setItem('myFavCharacters', JSON.stringify(favoritesArray));

    alert(`¡${name} agregado a favoritos`)
}

//Funcion para pintar los favoritos
function renderFavorites(){
    dataContainer.innerHTML = '';

    //Leemos la  emoria y la convertimos de texto a arreglo nuevamente
    const saveData = localStorage.getItem('myFavCharacters');

    if (saveData) {
        //Si hay datos los desrealiza
        favoritesArray = JSON.parse(saveData);

        if (favoritesArray.length === 0) {
            dataContainer.innerHTML = '<p class="loading-text>No favorites added yet.</p>';
            return;
        }

        //Pintamos cada favorito guardado
        favoritesArray.forEach(fav => {
            dataContainer.innerHTML += `
                <article class="data-card">
                     <img src="${fav.image}" alt="${fav.name}">
                     <div class="card-info">
                       <h2>⭐${fav.name}</h2>
                     </div>
                </article>
             `;
        });
    } else {
        //Si la memoria esta vacia
        dataContainer.innerHTML = '<p class="loading-text>No favorites added yet.</p>';
    }
}


//Manejo de eventos del menu

//Funcion auxiliar para resaltar visualmente el boton seleccionado
function setActiveButton(activeBtn){
    btnCharacters.classList.remove('active');
    btnLocations.classList.remove('active');
    btnEpisodes.classList.remove('active');
    btnFavorites.classList.remove('active');

    activeBtn.classList.add('active');
}


//Evento click en personajes
btnCharacters.addEventListener('click', async () => {
    setActiveButton(btnCharacters);
    const data = await fetchData('/character')
    renderCharacters(data);
});

//Evento click en ubicaciones
btnLocations.addEventListener('click', async () => {
    setActiveButton(btnLocations);
    const data = await fetchData('/location')
    renderLocations(data);
});

//Evento click en personajes
btnEpisodes.addEventListener('click', async () => {
    setActiveButton(btnEpisodes);
    const data = await fetchData('/episode')
    renderEpisodes(data);
});

//Evento click en favoritos
btnFavorites.addEventListener('click', () =>{
    setActiveButton(btnFavorites);
    renderFavorites();     //Esta nos llama a fetchData, solo con local storage
});


//Inicio automatico

//Recuperamos los favoritos al arrancar la pagina por si habia guardado
const previousFavs = localStorage.getItem('myFavCharacters');

if (previousFavs) {
    favoritesArray = JSON.parse(previousFavs);
}

//Simulamos un click en el boton personajes para que la pantalla de inicio no salga en blanco
btnCharacters.click();