(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", () => {
    const sunlightSelect = document.getElementById("sunlight");
    const waterSelect = document.getElementById("water");
    const petsSelect = document.getElementById("pets");
    const resultsSection = document.getElementById("results");
    const plantsGrid = document.getElementById("plants-grid");
    const emptyState = document.querySelector(".results-empty-state");
    const resultsContent = document.querySelector(".results-content");
    const backToTopBtn = document.getElementById("back-to-top");

    window.allPlants = [];

    fetch("plants.json")
      .then((response) => response.json())
      .then((data) => {
        window.allPlants = data;
      })
      .catch((error) => console.error("Error loading plants:", error));

    const filterPlants = () => {
      const sun = sunlightSelect.value;
      const water = waterSelect.value;
      const pets = petsSelect.value;

      if (sun && water && pets) {
        const filtered = allPlants.filter((plant) => {
          const sunMatch = plant.sun === sun;
          const waterMatch = plant.water === water;
          const petMatch = pets === "true" ? plant.toxicity === false : true;
          return sunMatch && waterMatch && petMatch;
        });

        renderPlants(filtered);
      }
    };

    const renderPlants = (plants) => {
      plantsGrid.innerHTML = "";

      if (plants.length > 0) {
        plants.forEach((plant) => {
          const card = createPlantCard(plant);
          plantsGrid.appendChild(card);
        });

        resultsSection.classList.remove("results-empty");
        emptyState.style.display = "none";
        resultsContent.style.display = "block";

        setTimeout(() => {
          resultsSection.scrollIntoView({ behavior: "smooth" });
        }, 100);
      } else {
        resultsSection.classList.add("results-empty");
        emptyState.style.display = "block";
        resultsContent.style.display = "none";
      }
    };

    const createPlantCard = (plant) => {
      const div = document.createElement("div");
      div.className = "plant-card";

      let waterIcon = "1-drop.svg";
      let waterText = "Rarely - water once every 2-3 weeks";
      if (plant.water === "regularly") {
        waterIcon = "two-drops.svg";
        waterText = "Regularly - water once a week";
      }
      if (plant.water === "daily") {
        waterIcon = "3-drops.svg";
        waterText = "Daily - water every day";
      }

      let sunIcon = "low-sun.svg";
      let sunText = "Low sun - indirect light";
      if (plant.sun === "high") {
        sunIcon = "low-sun.svg";
        sunText = "High sun - direct sunlight";
      }
      if (plant.sun === "no") {
        sunIcon = "no-sun.svg";
        sunText = "No sun - shade tolerant";
      }

      let petText = plant.toxicity
        ? "Toxic - keep away from pets"
        : "Pet friendly - safe for pets";
      const imageName = plant.url.split("/").pop();
      const localPath = `images/plant photos/${imageName}`;

      div.innerHTML = `
                <img src="${localPath}" alt="${plant.name}" class="plant-card-image">
                <h3 class="plant-card-name">${plant.name}</h3>
                <div class="plant-card-footer">
                    <span class="plant-card-price">$${plant.price}</span>
                    <div class="plant-card-icons">
                        ${plant.toxicity ? `<img src="images/icons/toxic.svg" class="plant-card-icon" title="${petText}">` : `<img src="images/icons/pet.svg" class="plant-card-icon" title="${petText}">`}
                        <img src="images/icons/${sunIcon}" class="plant-card-icon" title="${sunText}">
                        <img src="images/icons/${waterIcon}" class="plant-card-icon" title="${waterText}">
                    </div>
                </div>
                <button onclick="addToCart(${plant.id})" class="btn-buy">Add to Cart</button>
            `;
      return div;
    };

    sunlightSelect.addEventListener("change", filterPlants);
    waterSelect.addEventListener("change", filterPlants);
    petsSelect.addEventListener("change", filterPlants);

    backToTopBtn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  });

  let cart = [];

  const toggleCart = () => {
    const drawer = document.getElementById("cart-drawer");
    const overlay = document.getElementById("cart-overlay");

    drawer.classList.toggle("active");
    overlay.classList.toggle("active");

    document.body.classList.toggle("cart-open");
  };

  window.addToCart = (id) => {
    const plant = window.allPlants.find((p) => p.id === id);
    if (plant) {
      cart.push(plant);
      updateCartUI();

      if (!document.getElementById("cart-drawer").classList.contains("active"))
        toggleCart();
    }
  };

  const updateCartUI = () => {
    const cartCount = document.getElementById("cart-count");
    const cartItems = document.getElementById("cart-items");
    const cartTotal = document.getElementById("cart-total-value");

    cartCount.innerText = cart.length;
    cartItems.innerHTML = cart
      .map(
        (item, index) => `
        <div class="cart-item">
            <div>
                <p style="color: var(--color-title); font-weight: bold;">${item.name}</p>
                <p style="font-size: 12px;">$${item.price}</p>
            </div>
            <button onclick="removeFromCart(${index})" style="background:none; border:none; color:red; cursor:pointer;">Remove</button>
        </div>
    `,
      )
      .join("");

    const total = cart.reduce((acc, item) => acc + item.price, 0);
    cartTotal.innerText = `$${total}`;
  };

  window.removeFromCart = (index) => {
    cart.splice(index, 1);
    updateCartUI();
  };

  document.getElementById("open-cart").addEventListener("click", toggleCart);
  document.getElementById("close-cart").addEventListener("click", toggleCart);
  document.getElementById("cart-overlay").addEventListener("click", toggleCart);
})();
