# 🗺️ TourMap AI – Smart Tourist Mapping System

An interactive tourist map website where you can explore popular destinations, find your current location and plan a simple trip.

**Live demo:** https://govardhangoud7.github.io/tourmap-ai/

## Features
- Interactive tourist map (Leaflet.js + OpenStreetMap)
- 10 tourist place markers with popups
- Place explorer cards with a **View on Map** button
- Current location with **Find My Location**
- Basic trip planner (start, destination, number of days)
- Responsive design for mobile and desktop

## Places Included
Hampi, Tirupati, Visakhapatnam, Araku Valley, Lepakshi, Gandikota, Belum Caves, Srisailam, Mysuru, Badami

## Technologies
- HTML
- CSS
- JavaScript
- Leaflet.js
- OpenStreetMap

## Project Structure
```
tourmap-ai/
├── index.html   # Page layout
├── style.css    # Styling
├── app.js       # Map, places, location and trip planner logic
└── README.md
```

## Run Locally in VS Code
1. Open this folder in VS Code.
2. Install the **Live Server** extension.
3. Right-click `index.html`.
4. Select **Open with Live Server**.
5. Allow location permission when using **Find My Location**.

## Add a New Place
Open `app.js` and add one line to the `places` list:
```js
{ name: "Place Name", emoji: "📍", lat: 0.0, lng: 0.0, info: "Short description." }
```
The card and map marker are created automatically.

## Notes
- Internet is required for the map tiles and the hero image.
- **Find My Location** needs HTTPS (works on GitHub Pages and Live Server).

## Author
Govardhan Goud
