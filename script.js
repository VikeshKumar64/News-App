const API_KEY = "b8f8f3dd2ac02992f001338b768f448c";
const url = "https://gnews.io/api/v4/search?q=";

window.addEventListener('load', () => fetchNews("World"));

const loadingScreen = document.getElementById("loading-screen");

// Display loading screen
loadingScreen.style.display = "flex";

function scrolling() {
    var cardo = document.querySelector('.card-container');
    var cardPosition = cardo.getBoundingClientRect().top;
    var screenPosition = window.innerHeight / 1.3;

    if (cardPosition < screenPosition) {
        cardo.classList.add('card-container-change');
    }
}

window.addEventListener('scroll', scrolling);

//////////////////
async function fetchNews(query) {
    const gNewsURL = `${url}${query}&lang=en&country=us&max=10&apikey=${API_KEY}`;
    try {
        const response = await fetch(gNewsURL);
        const data = await response.json();
        const sortedArticles = data.articles.sort(
            (newest, oldest) =>
                new Date(oldest.publishedAt) - new Date(newest.publishedAt)
        );
        bindData(sortedArticles);
    } catch (error) {
        console.error("Error fetching data:", error);
    } finally {
        // Hide loading screen after data is fetched (success or error)
        loadingScreen.style.display = "none";
    }
}

function bindData(articles) {
    const cardsContainer = document.getElementById("card-container");
    const newsCardTemplate = document.getElementById("template-news-card");

    cardsContainer.innerHTML = "";

    articles.forEach(article => {
        if (!article.image) return; // Use 'image' for GNews instead of 'urlToImage'
        const cardClone = newsCardTemplate.content.cloneNode(true);
        fillData(cardClone, article);
        cardsContainer.appendChild(cardClone);
    });
}

function fillData(cardClone, article) {
    const newImg = cardClone.querySelector('#news-img');
    const newsTitle = cardClone.querySelector('#news-title');
    const newsSource = cardClone.querySelector('#news-source');
    const newsDesc = cardClone.querySelector('#news-desc');

    newImg.src = article.image; // Use 'image' for GNews
    newsTitle.innerHTML = article.title;
    newsDesc.textContent = article.description;

    let date = new Date(article.publishedAt).toLocaleString('en-US', {
        timeZone: "Asia/Jakarta"
    });
    newsSource.innerHTML = `${article.source.name} -- ${date}`;

    cardClone.firstElementChild.addEventListener('click', () => {
        window.open(article.url, "_blank");
    });
}

let curSelectedNav = null;
function onNavItemClick(id) {
    removeSearch();
    fetchNews(id);
    const navItem = document.getElementById(id);
    curSelectedNav?.classList.remove('active');
    curSelectedNav = navItem;
    curSelectedNav.classList.add('active');
    scrollTop();
}

const searchButton = document.getElementById('search-button');
const searchText = document.getElementById('search-text');

let searchPerformed = true;
searchButton.addEventListener('click', () => {
    const query = searchText.value;
    if (!query) return;
    fetchNews(query);

    curSelectedNav?.classList.remove('active');
    curSelectedNav = null;
    if (searchPerformed) {
        scrollTop();
    }
});

function scrollTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function removeSearch() {
    searchText.value = "";
    let searched = document.getElementById("search-text").value;
    searched.innerHTML = "";
}

searchText.addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
        const query = searchText.value;
        if (query) {
            removeSearch(); // Clear previous search results
            fetchNews(query);
            scrollTop();
        }
    }
});

function initiateSearch() {
    if (query) {
        fetchNews(query);
    }
}

// Add an event listener to the dark mode toggle icon
const darkModeToggle = document.getElementById("dark-mode-toggle");
darkModeToggle.addEventListener("click", toggleDarkMode);

// Initial state of dark mode
let isDarkMode = false;

// Function to toggle dark mode
function toggleDarkMode() {
    isDarkMode = !isDarkMode; // Toggle the state

    // Update the CSS variables to apply dark mode
    document.documentElement.style.setProperty("--background-color", isDarkMode ? "var(--background-color-dark)" : "var(--background-color-light)");
    document.documentElement.style.setProperty("--text-color", isDarkMode ? "var(--text-color-dark)" : "var(--text-color-light)");
    document.documentElement.style.setProperty("--secondary-text-color", isDarkMode ? "var(--secondary-text-color-dark)" : "var(--secondary-text-color-light)");

    // Toggle the dark mode class on the body element
    document.body.classList.toggle("dark-mode", isDarkMode);
}

// JavaScript to toggle the menu
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});
