let playerX = 400;
let playerY = 400;
let locations = {};
const proximity = 30;

fetch("locations.json")
  .then(res => res.json())
  .then(data => {
    locations = data;
    updatePlayerPosition();
  });

document.addEventListener("keydown", e => {
  const keys = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"];
  if (keys.includes(e.key)) {
    e.preventDefault();
    switch (e.key) {
      case "ArrowUp": playerY -= 20; break;
      case "ArrowDown": playerY += 20; break;
      case "ArrowLeft": playerX -= 20; break;
      case "ArrowRight": playerX += 20; break;
    }
    updatePlayerPosition();
  }
}, { passive: false });

function updatePlayerPosition() {
  $("#player").css({ top: playerY + "px", left: playerX + "px" });
  checkProximity();
}

function checkProximity() {
  const mapWidth = 4322;
  const mapHeight = 3251;

  if (playerX < 0 || playerX > mapWidth || playerY < 0 || playerY > mapHeight) {
    $("#location-name").text("Walk around the map");
    $("#location-image").hide();
    $("#location-description").text("");
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
    $("#location-name").text("Walk around the map");
    $("#location-image").hide();
    $("#location-description").text("");
  }
}

function showLocation(loc) {
  $("#location-name").text(loc.name);
  $("#location-image").attr("src", loc.image).show();
  $("#location-description").text(loc.description);
}
