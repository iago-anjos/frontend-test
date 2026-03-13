"use strict";

const state = { sunlight: null, water: null, pets: null };
let plants = [];
let cart = [];

document.addEventListener("DOMContentLoaded", async () => {
  plants = await loadPlants();
  initDropdowns();
  initCart();
  initBackToTop();
  renderNoResults();
});

async function loadPlants() {
  const res = await fetch("plants.json");
  return res.json();
}

function initDropdowns() {
  document.querySelectorAll(".dropdown").forEach((dd) => {
    const btn = dd.querySelector(".dropdown__btn");
    const list = dd.querySelector(".dropdown__list");
    const filter = dd.dataset.filter;

    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const isOpen = dd.classList.contains("dropdown--open");
      closeAllDropdowns();
      if (!isOpen) {
        dd.classList.add("dropdown--open");
        btn.setAttribute("aria-expanded", "true");
      }
    });

    list.addEventListener("click", (e) => {
      const item = e.target.closest(".dropdown__item");
      if (!item) return;

      list
        .querySelectorAll(".dropdown__item")
        .forEach((i) => i.classList.remove("dropdown__item--selected"));
      item.classList.add("dropdown__item--selected");

      dd.querySelector(".dropdown__value").textContent =
        item.textContent.trim();
      dd.classList.add("dropdown--selected");

      state[filter] = item.dataset.value;

      closeAllDropdowns();
      applyFilters();
    });
  });

  document.addEventListener("click", closeAllDropdowns);
}

function closeAllDropdowns() {
  document.querySelectorAll(".dropdown--open").forEach((dd) => {
    dd.classList.remove("dropdown--open");
    dd.querySelector(".dropdown__btn").setAttribute("aria-expanded", "false");
  });
}

function resetDropdown(filter) {
  const dd = document.querySelector(`.dropdown[data-filter="${filter}"]`);
  if (!dd) return;
  dd.querySelector(".dropdown__value").textContent = "Select...";
  dd.classList.remove("dropdown--selected");
  dd.querySelectorAll(".dropdown__item").forEach((i) =>
    i.classList.remove("dropdown__item--selected"),
  );
}

function applyFilters() {
  if (!state.sunlight && !state.water && state.pets === null) {
    renderNoResults();
    return;
  }

  const results = plants.filter((p) => {
    if (state.sunlight && p.sun !== state.sunlight) return false;
    if (state.water && p.water !== state.water) return false;
    if (state.pets === "true" && p.toxicity === true) return false;
    return true;
  });

  results.length === 0 ? renderNoResults() : renderPicks(results);
}

function renderNoResults() {
  document.getElementById("no-results").removeAttribute("hidden");
  document.getElementById("picks").setAttribute("hidden", "");
}

function renderPicks(list) {
  document.getElementById("no-results").setAttribute("hidden", "");
  const picks = document.getElementById("picks");
  picks.removeAttribute("hidden");

  const grid = document.getElementById("plant-grid");
  grid.innerHTML = "";

  list.forEach((p) => {
    const card = document.createElement("div");
    card.className = "plant-card";
    card.innerHTML = `
      <div class="plant-card__img-wrap">
        <img src="${localImagePath(p.url)}" alt="${p.name}" />
      </div>
      <p class="plant-card__name">${p.name}</p>
      <p class="plant-card__price">$${p.price}</p>
      <div class="plant-card__icons">
        ${
          p.toxicity
            ? `<img src="images/icons/toxic.svg" title="Toxic — keep away from pets" />`
            : `<img src="images/icons/pet.svg"   title="Pet friendly" />`
        }
        <img src="images/icons/${sunIcon(p.sun)}"     title="${sunLabel(p.sun)}" />
        <img src="images/icons/${waterIcon(p.water)}" title="${waterLabel(p.water)}" />
      </div>
      <button class="plant-card__cart-btn" data-id="${p.id}">Add to Cart</button>
    `;
    grid.appendChild(card);
  });

  grid.querySelectorAll(".plant-card__cart-btn").forEach((btn) => {
    btn.addEventListener("click", () => addToCart(parseInt(btn.dataset.id)));
  });

  picks.scrollIntoView({ behavior: "smooth", block: "start" });
}

function localImagePath(url) {
  const name = url.split("/").pop();
  return `images/plant photos/${name}`;
}

function sunIcon(sun) {
  if (sun === "no") return "no-sun.svg";
  if (sun === "high") return "low-sun.svg";
  return "low-sun.svg";
}
function sunLabel(sun) {
  if (sun === "no") return "No sun — shade tolerant";
  if (sun === "high") return "High sun — direct sunlight";
  return "Low sun — indirect light";
}
function waterIcon(water) {
  if (water === "regularly") return "two-drops.svg";
  if (water === "daily") return "3-drops.svg";
  return "1-drop.svg";
}
function waterLabel(water) {
  if (water === "regularly") return "Regularly — water once a week";
  if (water === "daily") return "Daily — water every day";
  return "Rarely — water once every 2–3 weeks";
}

function initCart() {
  document.getElementById("open-cart").addEventListener("click", toggleCart);
  document.getElementById("close-cart").addEventListener("click", toggleCart);
  document.getElementById("cart-overlay").addEventListener("click", toggleCart);
}

function toggleCart() {
  const drawer = document.getElementById("cart-drawer");
  const overlay = document.getElementById("cart-overlay");
  drawer.classList.toggle("active");
  overlay.classList.toggle("active");
  document.body.classList.toggle("cart-open");
}

function addToCart(id) {
  const plant = plants.find((p) => p.id === id);
  if (!plant) return;
  cart.push(plant);
  updateCartUI();
  if (!document.getElementById("cart-drawer").classList.contains("active")) {
    toggleCart();
  }
}

function removeFromCart(index) {
  cart.splice(index, 1);
  updateCartUI();
}

function updateCartUI() {
  document.getElementById("cart-count").textContent = cart.length;

  document.getElementById("cart-items").innerHTML = cart
    .map(
      (item, index) => `
      <div class="cart-item">
        <div>
          <p style="color:#0c261c;font-weight:700;">${item.name}</p>
          <p style="font-size:13px;color:#848484;">$${item.price}</p>
        </div>
        <button
          onclick="removeFromCart(${index})"
          style="background:none;border:none;color:#c0392b;cursor:pointer;font-family:'Montserrat',sans-serif;font-size:13px;">
          Remove
        </button>
      </div>
    `,
    )
    .join("");

  const total = cart.reduce((acc, item) => acc + item.price, 0);
  document.getElementById("cart-total-value").textContent = `$${total}`;
}

window.removeFromCart = removeFromCart;

function initBackToTop() {
  const btn = document.getElementById("back-to-top");
  if (btn) {
    btn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }
}
