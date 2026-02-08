const sunlightSelect = document.getElementById("sunlight");
const waterSelect = document.getElementById("water");
let allPlants = [];

fetch("plants.json")
  .then((r) => r.json())
  .then((data) => (allPlants = data))
  .catch((e) => console.error(e));

function filterPlants() {
  const sun = sunlightSelect.value;
}
