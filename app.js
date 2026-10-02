// TourMap AI - app.js
const places = [
  { name: "Hampi", emoji: "🏛️", lat: 15.335, lng: 76.46, info: "Explore the historical monuments of Hampi." },
  { name: "Tirupati", emoji: "🛕", lat: 13.6288, lng: 79.4192, info: "Visit the famous Tirumala temple." },
  { name: "Visakhapatnam", emoji: "🏖️", lat: 17.6868, lng: 83.2185, info: "Enjoy beaches and beautiful coastal locations." },
  { name: "Araku Valley", emoji: "🌊", lat: 18.3273, lng: 82.8753, info: "Explore beautiful hills and waterfalls." },
  { name: "Lepakshi", emoji: "🗿", lat: 14.8, lng: 77.608, info: "See the Veerabhadra temple, hanging pillar and giant Nandi." },
  { name: "Gandikota", emoji: "🏞️", lat: 14.8148, lng: 78.2845, info: "Gorge views over the Penna River, the 'Grand Canyon of India'." },
  { name: "Belum Caves", emoji: "🦇", lat: 15.1, lng: 78.1167, info: "One of the longest cave systems on the Indian subcontinent." },
  { name: "Srisailam", emoji: "🕉️", lat: 16.074, lng: 78.868, info: "Mallikarjuna temple and the Srisailam dam in the Nallamala hills." },
  { name: "Mysuru", emoji: "👑", lat: 12.3052, lng: 76.6552, info: "Visit the grand Mysore Palace and Chamundi Hills." },
  { name: "Badami", emoji: "⛰️", lat: 15.9149, lng: 75.6768, info: "Rock-cut cave temples from the Chalukya dynasty." }
];

// Render place cards
const container = document.getElementById("placeContainer");
places.forEach((p) => {
  const card = document.createElement("div");
  card.className = "place-card";
  card.innerHTML = `<h3>${p.emoji} ${p.name}</h3><p>${p.info}</p>` +
    `<button onclick="showPlace(${p.lat},${p.lng},'${p.name}')">View on Map</button>`;
  container.appendChild(card);
});

// Map setup (centered on southern India)
const map = L.map("map").setView([15, 78], 6);
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution: "&copy; OpenStreetMap contributors"
}).addTo(map);

const markers = {};
places.forEach((p) => {
  markers[p.name] = L.marker([p.lat, p.lng])
    .addTo(map)
    .bindPopup(`<b>${p.name}</b><br>${p.info}`);
});

let userMarker = null;

function showPlace(lat, lng, name) {
  document.getElementById("map-section").scrollIntoView({ behavior: "smooth" });
  map.setView([lat, lng], 11);
  if (markers[name]) markers[name].openPopup();
}

function findMyLocation() {
  if (!navigator.geolocation) {
    alert("Geolocation is not supported by this browser.");
    return;
  }
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      const { latitude, longitude } = pos.coords;
      if (userMarker) map.removeLayer(userMarker);
      userMarker = L.marker([latitude, longitude])
        .addTo(map)
        .bindPopup("📍 You are here")
        .openPopup();
      document.getElementById("map-section").scrollIntoView({ behavior: "smooth" });
      map.setView([latitude, longitude], 12);
    },
    () => alert("Could not get your location. Please allow location permission."),
    { enableHighAccuracy: true, timeout: 10000 }
  );
}

function planTrip() {
  const start = document.getElementById("startLocation").value.trim();
  const dest = document.getElementById("destination").value.trim();
  const days = parseInt(document.getElementById("days").value, 10);
  const result = document.getElementById("tripResult");

  if (!start || !dest || !days || days < 1) {
    result.innerHTML = "⚠️ Please enter a starting location, a destination and the number of days.";
    return;
  }

  const match = places.find((p) => p.name.toLowerCase() === dest.toLowerCase());
  let plan = `<b>Trip: ${start} → ${dest}</b> (${days} day${days > 1 ? "s" : ""})<br>`;
  plan += `Day 1: Travel from ${start} to ${dest} and check in.<br>`;
  for (let d = 2; d < days; d++) plan += `Day ${d}: Explore the sights around ${dest}.<br>`;
  if (days > 1) plan += `Day ${days}: Last visit, shopping and return to ${start}.<br>`;
  else plan += `Visit the main sights and return to ${start}.<br>`;
  result.innerHTML = plan;

  if (match) showPlace(match.lat, match.lng, match.name);
}