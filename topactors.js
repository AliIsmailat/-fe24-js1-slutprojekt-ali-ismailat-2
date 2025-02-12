


//ChatGPT har använts för att sätta upp API:et då jag inte visste var
// jag kunde hitta olika queries på TMDB hemsidan.
const BASE_URL = 'https://api.themoviedb.org/3/';
const API_KEY = 'api_key=11b6cf96709a5d4b2f10a815f72a3569';




const IMG_URL = 'https://image.tmdb.org/t/p/w500/';
const ACTORS_URL = BASE_URL + 'person/popular?' + API_KEY;
const SEARCH_URL = BASE_URL + 'search/person?' + API_KEY;


const form = document.getElementById('form');
const search = document.getElementById('search');

const main = document.getElementById('main');

getActors(ACTORS_URL);


function getActors(url) {
    fetch(url)
        .then((res) => res.json())
        .then((data) => {
            showActors(data.results.slice(0, 10));
        })

        // .catch((err) => console.error('Could not fetch actors:', err));
        .catch((err) => {
            console.error('Could not fetch actors:', err);
            main.innerHTML = 
                `<div class="errorMessage">
                <h2>An error has occurred, please check your connection and try again.</h2>
                </div>`;
        });

}

function showActors(data) {
    //ChatGPT har använts här då jag inte visste hur jag identifiera brist på
    //sökresultat
    if (data.length === 0) {
        main.innerHTML = `<div class="actorsNoResults">
            <h2>No actors were found. <br> Please try using a different search term.</h2>
        </div>`;
        return;
    }





    data.forEach((actor) => {
        const { name, known_for, profile_path, known_for_department } = actor;

        
        const knownFor = known_for
            .map((item) => {
                const type = item.media_type === 'movie' ? 'Movie' : 'TV Show';
                const title = item.title || item.name; 
                return `${type}: "${title}"`;
            })
            .join(', ');


            





        //ChatGPT har använts här i samband med fallback imagen
        const actorElement = document.createElement('div');
        actorElement.classList.add('actor');
        actorElement.innerHTML = 
            `<img src="${profile_path ? IMG_URL + profile_path : 'images/anonymous.jpg'}" alt="${name}">
            <h2>${name}</h2>
            <div class="actor-info">
                <p><strong>Known for:</strong> ${known_for_department}</p>
                <p><strong>Famous works:</strong><br>${knownFor}</p>
            </div>`;

        main.appendChild(actorElement);
    });



    //ChatGPT har använts för Tilt.js pga upprepande error-koder.
    VanillaTilt.init(document.querySelectorAll('.actor'), {
        max: 15,           
        speed: 300, 
    });
}







form.addEventListener('submit', (e) => {
    e.preventDefault();

    const searchTerm = search.value.trim();

    if (searchTerm) {
        getActors(SEARCH_URL + '&query=' + encodeURIComponent(searchTerm));
    } else {
        getActors(ACTORS_URL); 
    }
});




