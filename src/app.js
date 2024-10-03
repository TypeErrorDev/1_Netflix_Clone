const API_KEY = "ff504f87";

// Declared Variables
const searchInput = document.getElementById("search-input");
const searchButton = document.getElementById("searchButton");
const movieImage = document.getElementById("movie-image");
const movieTitle = document.getElementById("title");
const movieGenre = document.getElementById("genre");
const loadingMessage = document.getElementById("loading-message");
const movieDescription = document.getElementById("description");
const movieCast = document.getElementById("cast");

// Generate a random IMDbID to load by default
function generateRandomIMDbID() {
    const minID = 1;
    const maxID = 294870;
    const randomID = Math.floor(Math.random() * (maxID - minID + 1)) + minID;
    return `tt${String(randomID).padStart(7, "0")}`; // Format as 'tt0000001'
}

async function loadRandomMovie() {
    let validMovieFound = false;

    loadingMessage.style.display = "block";

    movieImage.style.display = "none";
    movieTitle.style.display = "none";
    movieGenre.style.display = "none";
    movieCast.style.display = "none";

    while (!validMovieFound) {
        const randomIMDbID = generateRandomIMDbID();
        try {
            const res = await fetch(
                `https://www.omdbapi.com/?apikey=${API_KEY}&i=${randomIMDbID}`
            );
            if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
            const data = await res.json();

            // Check if the movie exists
            if (data.Response === "True") {
                validMovieFound = true;
                updateMovieData(data);
            }
        } catch (error) {
            console.error("Error loading random movie: ", error);
        }
    }

    // Hide loading message after the movie is displayed
    loadingMessage.style.display = "none";
}

// Main API Call
async function fetchMovie(searchValue) {
    const res = await fetch(
        `https://www.omdbapi.com/?apikey=${API_KEY}&t=${searchValue}`
    );
    if (!res.ok) throw new Error(`Error! Status: ${res.status}`);
    return await res.json();
}

// Call the API on search
searchButton.addEventListener("click", async () => {
    const searchValue = searchInput.value.trim();
    if (!searchValue) return;
    loadingMessage.style.display = "block";

    try {
        const movieData = await fetchMovie(searchValue);
        updateMovieData(movieData);
    } catch (err) {
        console.error("Error fetching movie: ", err);
        loadingMessage.innerText = "Movie not found. Try another search.";
    } finally {
        loadingMessage.style.display = "none";
    }
});

// Function to format text for even character count per line
function formatText(element, text) {
    const words = text.split(" ");
    let formattedText = "";
    let line = "";
    words.forEach((word) => {
        if (line.length + word.length + 1 <= 30) {
            line += (line.length > 0 ? " " : "") + word;
        } else {
            formattedText += line + "\n";
            line = word;
        }
    });

    formattedText += line;
    element.innerText = formattedText;
}

const updateMovieData = (data) => {
    if (!data || !data.Poster || data.Poster === "N/A") {
        console.log("Poster is N/A. Fetching a new random movie...");
        loadRandomMovie();
        return;
    }

    movieImage.src = data.Poster;
    movieTitle.innerText = `Title: ${data.Title}` || "Title not available";
    movieGenre.innerText = `Genre: ${data.Genre}` || "Genre not available";

    // Use formatText to ensure even line length without breaking words
    formatText(movieDescription, data.Plot);
    formatText(movieCast, data.Actors);

    // Show the movie display elements
    movieImage.style.display = "block";
    movieTitle.style.display = "block";
    movieGenre.style.display = "block";
    movieDescription.style.display = "block";
    movieCast.style.display = "block";
};

// Run the random movie fetch on page load
window.addEventListener("DOMContentLoaded", async () => {
    try {
        await loadRandomMovie();
    } catch (error) {
        console.error("Error loading random movie:", error);
    }
});
