const sunlightSelect = document.getElementById("sunlight");
const waterSelect = document.getElementById("water");
const petsSelect = document.getElementById("pets");
const resultsSection = document.getElementById("results");
let allPlants = [];

fetch("plants.json")
  .then((r) => r.json())
  .then((data) => (allPlants = data))
  .catch((e) => console.error(e));

const filterPlants = () => {
  const sun = sunlightSelect.value;
  const water = waterSelect.value;
  const pets = petsSelect.value;
};
