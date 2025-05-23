let playerX = 300;
let playerY = 300;
let locations = {};
const proximityRadius = 40; // how close you need to be to trigger info

// Load location data from JSON
fetch('locations.json')
  .then(response => response.json())
  .then(data => {
    locations = data;
    console.log("Location data loaded:", locations);
  })
  .catch(err => console.error("Error loading location data:", err));

// Move player dot
function updatePlayerPosition() {
  const player = document.getElementById("player");
  player.style.left = playerX + "px";
  player.style.top = playerY + "px";
  checkNearbyLocation();
}

// Movement logic
function movePlayer(dx, dy) {
  playerX += dx;
  playerY += dy;
  updatePlayerPosition();
}


// Keyboard events
document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowUp") movePlayer(0, -10);
  if (e.key === "ArrowDown") movePlayer(0, 10);
  if (e.key === "ArrowLeft") movePlayer(-10, 0);
  if (e.key === "ArrowRight") movePlayer(10, 0);
});

// Check distance between player and each location
function checkNearbyLocation() {
  for (let key in locations) {
    const loc = locations[key];
    const dx = playerX - loc.x;
    const dy = playerY - loc.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    if (distance < proximityRadius) {
      showLocation(loc);
      return;
    }
  }

  // Hide info if not near anything
  document.getElementById("location-name").innerText = "Walk to a location";
  document.getElementById("location-image").style.display = "none";
  document.getElementById("location-description").innerText = "";
}

// Display location info
function showLocation(loc) {
  document.getElementById("location-name").innerText = loc.name;
  const img = document.getElementById("location-image");
  img.src = loc.image;
  img.style.display = "block";
  document.getElementById("location-description").innerText = loc.description;
}
