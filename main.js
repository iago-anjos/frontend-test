const sunlightSelect = document.getElementById("sunlight");
let allPlants = [];

fetch("plants.json")
  .then((response) => response.json())
  .then((data) => {
    allPlants = data;
  });

function filterPlants() {
  const sun = sunlightSelect.value;
}
