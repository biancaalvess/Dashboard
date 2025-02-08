const BASE_URL = "https://api.open-meteo.com/v1/forecast";

const cities = [
    {
        name: "Nova York",
        time: "6:30 AM",
        temp: 18,
        condition: "Manhã Fresca",
        icon: "🌤️",
        sunrise: "6:00 AM",
        wind: 3,
        humidity: 75,
    },
    {
        name: "Londres",
        time: "11:30 AM",
        temp: 15,
        condition: "Nublado",
        icon: "☁️",
        sunrise: "5:45 AM",
        wind: 5,
        humidity: 80,
    },
    {
        name: "Tóquio",
        time: "7:30 PM",
        temp: 22,
        condition: "Noite Clara",
        icon: "🌙",
        sunrise: "4:30 AM",
        wind: 2,
        humidity: 65,
    },
    {
        name: "Sydney",
        time: "8:30 PM",
        temp: 20,
        condition: "Noite Amena",
        icon: "🌆",
        sunrise: "6:15 AM",
        wind: 4,
        humidity: 70,
    },
];

const weatherCards = document.getElementById("weatherCards");
const citySearch = document.getElementById("citySearch");
const searchButton = document.getElementById("searchButton");
const themeToggle = document.getElementById("themeToggle");
const modal = document.getElementById("weatherModal");
const modalContent = document.getElementById("modalContent");
const closeModal = document.getElementsByClassName("close")[0];

function createWeatherCard(city) {
    const card = document.createElement("div");
    card.className = "weather-card";
    card.innerHTML = `
        <div class="weather-icon">${city.icon}</div>
        <h2>${city.name}</h2>
        <p>${city.temp}°C</p>
        <p>${city.condition}</p>
    `;
    card.addEventListener("click", () => showModal(city));
    return card;
}

function renderWeatherCards(cities) {
    weatherCards.innerHTML = "";
    cities.forEach((city) => {
        weatherCards.appendChild(createWeatherCard(city));
    });
}

function showModal(city) {
    modalContent.innerHTML = `
        <h2>${city.name}</h2>
        <p>Temperatura: ${city.temp}°C</p>
        <p>Condição: ${city.condition}</p>
        <p>Hora: ${city.time}</p>
        <p>Nascer do Sol: ${city.sunrise}</p>
        <p>Vento: ${city.wind} m/s</p>
        <p>Umidade: ${city.humidity}%</p>
    `;
    modal.style.display = "block";
}

closeModal.onclick = () => {
    modal.style.display = "none";
};

window.onclick = (event) => {
    if (event.target == modal) {
        modal.style.display = "none";
    }
};

// Função para buscar clima de cidades via API
async function fetchWeather(cityName) {
    const url = `${BASE_URL}?latitude=52.52&longitude=13.41&current=temperature_2m,wind_speed_10m&hourly=temperature_2m,relative_humidity_2m,wind_speed_10m`;
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error("Erro ao buscar dados");
        const data = await response.json();

        return {
            name: cityName,
            temp: data.current.temperature_2m,
            condition: "Dados da Open-Meteo",
            icon: `🌍`,
            wind: data.current.wind_speed_10m,
            humidity: data.hourly.relative_humidity_2m[0],
        };
    } catch (error) {
        alert("Erro: " + error.message);
        return null;
    }
}


searchButton.addEventListener("click", async () => {
    const searchTerm = citySearch.value.trim().toLowerCase();

    // Verifica se a cidade já está na lista local
    let filteredCities = cities.filter((city) =>
        city.name.toLowerCase().includes(searchTerm)
    );

    // Se não encontrou na lista local, busca na API
    if (filteredCities.length === 0 && searchTerm !== "") {
        const newCity = await fetchWeather(searchTerm);
        if (newCity) filteredCities.push(newCity);
    }

    renderWeatherCards(filteredCities);
});

themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
});

renderWeatherCards(cities);

// Animação para os cartões
function animateCards() {
    const cards = document.querySelectorAll(".weather-card");
    cards.forEach((card, index) => {
        setTimeout(() => {
            card.style.opacity = "1";
            card.style.transform = "translateY(0)";
        }, index * 100);
    });
}

// Chamar a animação após renderizar os cartões
renderWeatherCards(cities);
setTimeout(animateCards, 100);
