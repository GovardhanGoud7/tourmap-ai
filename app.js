const destinations = [
  {
    id: 1,
    name: "Araku Valley",
    state: "Andhra Pradesh",
    category: "Nature",
    budget: 2500,
    lat: 18.3273,
    lng: 82.8750,
    description: "Explore green hills, coffee plantations, waterfalls and scenic valleys.",
    image: "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 2,
    name: "Taj Mahal",
    state: "Agra, Uttar Pradesh",
    category: "Heritage",
    budget: 3000,
    lat: 27.1751,
    lng: 78.0421,
    description: "Discover India's iconic white-marble monument and its rich history.",
    image: "https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 3,
    name: "Goa Beaches",
    state: "Goa",
    category: "Beach",
    budget: 4500,
    lat: 15.2993,
    lng: 74.1240,
    description: "Enjoy golden beaches, beautiful sunsets and coastal scenery.",
    image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 4,
    name: "Munnar",
    state: "Kerala",
    category: "Nature",
    budget: 3500,
    lat: 10.0889,
    lng: 77.0595,
    description: "Relax among misty mountains, tea gardens and winding roads.",
    image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 5,
    name: "Hampi",
    state: "Karnataka",
    category: "Heritage",
    budget: 2200,
    lat: 15.3350,
    lng: 76.4600,
    description: "Explore ancient temples, historic ruins and giant boulder landscapes.",
    image: "https://images.unsplash.com/photo-1600100397608-f0103c7f8d7c?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 6,
    name: "Ladakh",
    state: "Ladakh",
    category: "Adventure",
    budget: 7000,
    lat: 34.1526,
    lng: 77.5771,
    description: "Experience dramatic mountain passes, lakes and Himalayan scenery.",
    image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 7,
    name: "Jaipur",
    state: "Rajasthan",
    category: "Heritage",
    budget: 2800,
    lat: 26.9124,
    lng: 75.7873,
    description: "Visit royal palaces, historic forts and colourful local markets.",
    image: "https://images.unsplash.com/photo-1599661046827-dacff0c0f09a?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 8,
    name: "Ooty",
    state: "Tamil Nadu",
    category: "Nature",
    budget: 3000,
    lat: 11.4102,
    lng: 76.6950,
    description: "Enjoy cool weather, gardens, mountain views and scenic train rides.",
    image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 9,
    name: "Rishikesh",
    state: "Uttarakhand",
    category: "Adventure",
    budget: 3200,
    lat: 30.0869,
    lng: 78.2676,
    description: "Discover riverside views, yoga retreats and outdoor adventures.",
    image: "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=800&q=80"
  }
];

// Read saved data safely.
function loadSaved(key) {
  try {
    const value = JSON.parse(localStorage.getItem(key) || "[]");
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
}

let activeCategory = "All";
let searchTerm = "";
let favorites = loadSaved("tourmap-favorites")
  .filter(id => destinations.some(place => place.id === id));
let trip = loadSaved("tourmap-trip")
  .filter(id => destinations.some(place => place.id === id));

const grid = document.getElementById("destination-grid");
const favoriteGrid = document.getElementById("favorite-grid");
const searchInput = document.getElementById("search-input");
const resultCount = document.getElementById("result-count");
const emptyMessage = document.getElementById("empty-message");
const favoriteEmpty = document.getElementById("favorite-empty");
const tripList = document.getElementById("trip-list");
const tripEmpty = document.getElementById("trip-empty");
const toastElement = document.getElementById("toast");

let toastTimer;

function money(amount) {
  return "₹" + amount.toLocaleString("en-IN");
}

function saveState() {
  try {
    localStorage.setItem("tourmap-favorites", JSON.stringify(favorites));
    localStorage.setItem("tourmap-trip", JSON.stringify(trip));
  } catch {
    showToast("Your browser could not save changes.");
  }
}

function showToast(message) {
  toastElement.textContent = message;
  toastElement.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toastElement.classList.remove("show");
  }, 2400);
}

function getFilteredDestinations() {
  return destinations.filter(place => {
    const matchesCategory =
      activeCategory === "All" || place.category === activeCategory;

    const searchableText =
      `${place.name} ${place.state} ${place.category}`.toLowerCase();

    return matchesCategory && searchableText.includes(searchTerm);
  });
}

function destinationCard(place) {
  const saved = favorites.includes(place.id);
  const added = trip.includes(place.id);

  return `
    <article class="destination-card">
      <div class="card-image">
        <img
          src="${place.image}"
          alt="${place.name}"
          loading="lazy"
          onerror="this.onerror=null;this.src='https://placehold.co/800x500/e6eee7/285b45?text=TourMap+Destination'">
        <span class="category-label">${place.category}</span>
        <button
          class="heart-btn ${saved ? "saved" : ""}"
          data-action="favorite"
          data-id="${place.id}"
          aria-label="${saved ? "Remove from" : "Add to"} favorites"
          title="${saved ? "Remove favorite" : "Add favorite"}">
          ${saved ? "♥" : "♡"}
        </button>
      </div>

      <div class="card-body">
        <p class="card-location">⌖ ${place.state}</p>
        <h3>${place.name}</h3>
        <p class="card-description">${place.description}</p>

        <div class="card-footer">
          <div class="budget">
            <strong>${money(place.budget)}</strong>
            <small>Estimated budget / person</small>
          </div>

          <div class="card-actions">
            <button class="small-btn"
              data-action="map" data-id="${place.id}">
              Map
            </button>
            <button class="small-btn add"
              data-action="trip" data-id="${place.id}">
              ${added ? "Added ✓" : "+ Trip"}
            </button>
          </div>
        </div>
      </div>
    </article>
  `;
}

function renderDestinations() {
  const places = getFilteredDestinations();

  grid.innerHTML = places.map(destinationCard).join("");
  resultCount.textContent = `${places.length} places found`;
  emptyMessage.hidden = places.length !== 0;
}

function renderFavorites() {
  const places = destinations.filter(place => favorites.includes(place.id));

  favoriteGrid.innerHTML = places.map(destinationCard).join("");
  favoriteEmpty.hidden = places.length !== 0;
}

function renderTrip() {
  const places = trip
    .map(id => destinations.find(place => place.id === id))
    .filter(Boolean);

  document.getElementById("trip-count").textContent = places.length;

  const total = places.reduce((sum, place) => sum + place.budget, 0);
  document.getElementById("trip-budget").textContent = money(total);

  tripList.innerHTML = places.map((place, index) => `
    <div class="trip-item">
      <div>
        <strong>${index + 1}. ${place.name}</strong>
        <small>${place.state} · ${money(place.budget)} estimated</small>
      </div>
      <button class="remove-btn"
        data-action="remove-trip" data-id="${place.id}">
        Remove
      </button>
    </div>
  `).join("");

  tripEmpty.hidden = places.length !== 0;
}

function renderAll() {
  renderDestinations();
  renderFavorites();
  renderTrip();
}

// All cards use delegated event handling.
document.addEventListener("click", event => {
  const button = event.target.closest("[data-action]");
  if (!button) return;

  const id = Number(button.dataset.id);
  const action = button.dataset.action;
  const place = destinations.find(item => item.id === id);

  if (!place) return;

  if (action === "favorite") {
    if (favorites.includes(id)) {
      favorites = favorites.filter(item => item !== id);
      showToast(`${place.name} removed from favorites.`);
    } else {
      favorites.push(id);
      showToast(`${place.name} added to favorites!`);
    }

    saveState();
    renderAll();
  }

  if (action === "trip") {
    if (trip.includes(id)) {
      showToast(`${place.name} is already in your trip.`);
      return;
    }

    trip.push(id);
    saveState();
    renderAll();
    showToast(`${place.name} added to your itinerary.`);
  }

  if (action === "remove-trip") {
    trip = trip.filter(item => item !== id);
    saveState();
    renderAll();
    showToast("Destination removed from your trip.");
  }

  if (action === "map") {
    const mapSection = document.getElementById("map-section");
    mapSection.scrollIntoView({ behavior: "smooth" });

    if (map) {
      map.setView([place.lat, place.lng], 9);
      const marker = markers[id];
      if (marker) marker.openPopup();
    }
  }
});

// Search and category filters.
searchInput.addEventListener("input", () => {
  searchTerm = searchInput.value.trim().toLowerCase();
  renderDestinations();
});

document.getElementById("search-button").addEventListener("click", () => {
  searchTerm = searchInput.value.trim().toLowerCase();
  renderDestinations();
  document.getElementById("explore").scrollIntoView({ behavior: "smooth" });
});

searchInput.addEventListener("keydown", event => {
  if (event.key === "Enter") {
    document.getElementById("search-button").click();
  }
});

document.getElementById("filters").addEventListener("click", event => {
  const button = event.target.closest("[data-category]");
  if (!button) return;

  activeCategory = button.dataset.category;

  document.querySelectorAll(".filter").forEach(filter => {
    filter.classList.toggle("active", filter === button);
  });

  renderDestinations();
});

// Navigation helpers.
document.getElementById("favorites-nav").addEventListener("click", () => {
  document.getElementById("favorites").scrollIntoView({ behavior: "smooth" });
});

document.getElementById("clear-trip").addEventListener("click", () => {
  if (trip.length === 0) {
    showToast("Your itinerary is already empty.");
    return;
  }

  trip = [];
  saveState();
  renderAll();
  showToast("Your itinerary has been cleared.");
});

// Download the current itinerary as a text file.
document.getElementById("download-trip").addEventListener("click", () => {
  const places = trip
    .map(id => destinations.find(place => place.id === id))
    .filter(Boolean);

  if (places.length === 0) {
    showToast("Add a destination before downloading.");
    return;
  }

  const total = places.reduce((sum, place) => sum + place.budget, 0);

  const content = [
    "TOURMAP - MY TRAVEL ITINERARY",
    "================================",
    "",
    ...places.map((place, index) =>
      `${index + 1}. ${place.name}\n` +
      `   Location: ${place.state}\n` +
      `   Category: ${place.category}\n` +
      `   Estimated budget per person: ${money(place.budget)}\n`
    ),
    "================================",
    `Estimated combined budget: ${money(total)}`,
    "",
    "Note: Estimates are illustrative, not live travel prices."
  ].join("\n");

  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = "tourmap-itinerary.txt";
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);

  showToast("Your itinerary has been downloaded.");
});

// Interactive map using Leaflet and OpenStreetMap.
let map = null;
const markers = {};

function initializeMap() {
  if (typeof L === "undefined") {
    document.getElementById("map").innerHTML =
      "<p style='padding:20px'>The map could not load. Check your internet connection and refresh.</p>";
    return;
  }

  map = L.map("map").setView([22.5, 79.0], 5);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 19
  }).addTo(map);

  destinations.forEach(place => {
    const marker = L.marker([place.lat, place.lng]).addTo(map);

    marker.bindPopup(`
      <strong>${place.name}</strong><br>
      ${place.state}<br>
      ${place.category}<br>
      <strong>Estimated budget: ${money(place.budget)}</strong>
    `);

    markers[place.id] = marker;
  });
}

// Start the application.
renderAll();
initializeMap();
