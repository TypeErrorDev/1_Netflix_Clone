const API_KEY = "ff504f87";

// Declared Variables
const searchInput = document.getElementById("search-input");
const searchButton = document.getElementById("searchButton");
const movieImage = document.getElementById("movie-image");
const movieTitle = document.getElementById("title");
const movieGenre = document.getElementById("genre");
const loadingMessage = document.getElementById("loading-message");
const movieDescription = document.getElementById("description");

// Generate a random IMDbID to load by default
function generateRandomIMDbID() {
    const minID = 1; // Starting number for IMDb IDs
    const maxID = 294870; // Ending number for IMDb IDs
    const randomID = Math.floor(Math.random() * (maxID - minID + 1)) + minID;
    return `tt${String(randomID).padStart(7, "0")}`; // Format as 'tt0000001'
}

async function loadRandomMovie() {
    let validMovieFound = false;

    // Show loading message
    loadingMessage.style.display = "block";

    // Hide movie display elements initially
    movieImage.style.display = "none";
    movieTitle.style.display = "none";
    movieGenre.style.display = "none";

    while (!validMovieFound) {
        const randomIMDbID = generateRandomIMDbID();
        try {
            const res = await fetch(
                `https://www.omdbapi.com/?apikey=${API_KEY}&i=${randomIMDbID}`
            );
            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }
            const data = await res.json();

            // Check if the movie exists
            if (data.Response === "True") {
                await displayMovieData(data);
                validMovieFound = true; // Set flag to true if a valid movie is found
            } else {
                console.log(
                    "Movie does not exist. Fetching a new random movie..."
                );
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
        `http://www.omdbapi.com/?apikey=${API_KEY}&t=${searchValue}`
    );
    if (!res.ok) {
        throw new Error(`Error! Status: ${res.status}`);
    }
    const data = await res.json();
    return data;
}

// Call the API on search
searchButton.addEventListener("click", async () => {
    const searchValue = searchInput.value;
    try {
        const movieData = await fetchMovie(searchValue);
        displayMovieData(movieData);
    } catch (err) {
        console.error("Error fetching movie: ");
    }
});

const displayMovieData = async (data) => {
    // Check if data exists and if the Poster is valid
    if (!data || !data.Poster || data.Poster === "N/A") {
        console.log("Poster is N/A. Fetching a new random movie...");
        await loadRandomMovie(); // Fetch a new random movie
        return; // Skip displaying the current movie
    }

    // If the poster is valid, update the DOM elements
    movieImage.src = data.Poster; // Set the movie poster URL
    movieTitle.innerText = `Title: ${data.Title}` || "Title not available"; // Set the movie title
    movieGenre.innerText = `Genre: ${data.Genre}` || "Genre not available"; // Set the movie genre
    movieDescription.innerText = `Description: ${data.Plot}`;

    // Show the movie display elements
    movieImage.style.display = "block";
    movieTitle.style.display = "block";
    movieGenre.style.display = "block";
};

// Run the random movie fetch on page load
window.addEventListener("DOMContentLoaded", async () => {
    try {
        await loadRandomMovie();
        // console.log("Random movie loaded successfully!");
    } catch (error) {
        console.error("Error loading random movie:", error);
    }
});
