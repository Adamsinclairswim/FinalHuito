let playerX = 400;
let playerY = 400;
let locations = {};
const proximity = 15;

fetch("locations.json")
  .then(res => res.json())
  .then(data => {
    locations = data;
    updatePlayerPosition();
  });

// Movement (arrow keys + WASD) with boundaries
const minX = 0;
const maxX = 800;
const minY = 0;
const maxY = 800;

document.addEventListener("keydown", e => {
  const key = e.key.toLowerCase();
  const moveKeys = ["arrowup", "arrowdown", "arrowleft", "arrowright", "w", "a", "s", "d"];
  if (moveKeys.includes(key)) {
    e.preventDefault();

    const step = 20;
    const playerEl = document.getElementById("player");
    const playerWidth = playerEl.offsetWidth;
    const playerHeight = playerEl.offsetHeight;

    switch (key) {
      case "arrowup":
      case "w":
        if (playerY - step >= minY) playerY -= step;
        break;
      case "arrowdown":
      case "s":
        if (playerY + step + playerHeight <= maxY) playerY += step;
        break;
      case "arrowleft":
      case "a":
        if (playerX - step >= minX) playerX -= step;
        break;
      case "arrowright":
      case "d":
        if (playerX + step + playerWidth <= maxX) playerX += step;
        break;
    }
    //console.log("X:" + playerX + ", Y:" + playerY);
    updatePlayerPosition();
  }
}, { passive: false });


function updatePlayerPosition() {
  gsap.to("#player", {
    top: playerY,
    left: playerX,
    duration: 0.3,
    ease: "power2.out",
    onComplete: checkProximity
  });
}

function checkProximity() {
  const mapWidth = 4322;
  const mapHeight = 3251;

  // Skip if the player is off the map
  if (playerX < 0 || playerX > mapWidth || playerY < 0 || playerY > mapHeight) {
    clearLocationDisplay();
    return;
  }

  let closest = null;
  let closestDist = Infinity;

  for (const key in locations) {
    const loc = locations[key];
    const dx = playerX - loc.x;
    const dy = playerY - loc.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < proximity && dist < closestDist) {
      closest = loc;
      closestDist = dist;
    }
  }

  if (closest) {
    showLocation(closest);
  } else {
    clearLocationDisplay();
  }
}

function showLocation(loc) {
  $("#location-name").text(loc.name);
  $("#location-image").attr("src", loc.image).show();
  $("#location-description").text(loc.description);

  // Slug bounce animation on arrival
  gsap.fromTo("#player",
    { y: "-=10" },
    { y: 0, ease: "bounce.out", duration: 0.6 }
  );
}

function clearLocationDisplay() {
  $("#location-name").text("Walk around the map");
  $("#location-image").hide();
  $("#location-description").text("");
}

$("#menu").click(function(){
  const content = document.getElementById("menuContent");
  content.classList.toggle("transparent");
  //document.getElementById("menuContent").this.classList.toggle("opaque");
});
