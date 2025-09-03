const categoriesUrl = "https://openapi.programming-hero.com/api/peddy/categories";
const petsUrl = "https://openapi.programming-hero.com/api/peddy/pets";

let petsData = [];
let currentCategory = null;

// Load categories
async function loadCategories() {
  const res = await fetch(categoriesUrl);
  const data = await res.json();
  const buttonsDiv = document.getElementById("category-buttons");

  data.categories.forEach(cat => {
    const btn = document.createElement("button");
    btn.innerText = cat.category;
    btn.onclick = () => {
      setActiveButton(btn);
      currentCategory = cat.category.toLowerCase();
      displayPets();
    };
    buttonsDiv.appendChild(btn);
  });
}
loadCategories();

// Load pets
async function loadPets() {
  const res = await fetch(petsUrl);
  const data = await res.json();
  petsData = data.pets;
  displayPets();
}
loadPets();

// Display pets
function displayPets() {
  const container = document.getElementById("pets-container");
  container.innerHTML = "";
  let filtered = currentCategory ? petsData.filter(p => p.category.toLowerCase() === currentCategory) : petsData;

  filtered.forEach(pet => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <img src="${pet.image}" alt="${pet.pet_name}">
      <h3>${pet.pet_name}</h3>
      <p>Breed: ${pet.breed}</p>
      <p>Birth: ${pet.date_of_birth}</p>
      <p>Gender: ${pet.gender}</p>
      <p class="price">Price: $${pet.price}</p>
      <div class="actions">
        <button class="like">❤️</button>
        <button class="adopt">Adopt</button>
        <button class="details">Details</button>
      </div>
    `;

    // Like
    card.querySelector(".like").onclick = () => addToLiked(pet);

    // Adopt
    card.querySelector(".adopt").onclick = (e) => adoptPet(e.target);

    // Details
    card.querySelector(".details").onclick = () => showDetails(pet);

    container.appendChild(card);
  });
}

// Active button
function setActiveButton(activeBtn) {
  document.querySelectorAll(".buttons button").forEach(btn => btn.classList.remove("active"));
  activeBtn.classList.add("active");
}

// Like section
function addToLiked(pet) {
  const likedDiv = document.getElementById("liked-items");
  const div = document.createElement("div");
  div.className = "liked-item";
  div.innerHTML = `
    <img src="${pet.image}">
    <span>&times;</span>
  `;
  div.querySelector("span").onclick = () => div.remove();
  likedDiv.appendChild(div);
}

// Adopt modal
function adoptPet(btn) {
  const modal = document.getElementById("modal");
  const body = document.getElementById("modal-body");
  modal.style.display = "flex";

  let count = 3;
  body.innerHTML = `<h2>🎉 Congratulations!</h2><p>Adopting in <span id="count">${count}</span> seconds...</p>`;
  const timer = setInterval(() => {
    count--;
    document.getElementById("count").innerText = count;
    if (count === 0) {
      clearInterval(timer);
      modal.style.display = "none";
      btn.innerText = "Adopted ✅";
      btn.disabled = true;
      btn.style.background = "gray";
    }
  }, 1000);
}

// Details modal
function showDetails(pet) {
  const modal = document.getElementById("modal");
  const body = document.getElementById("modal-body");
  modal.style.display = "flex";
  body.innerHTML = `
    <h2>${pet.pet_name}</h2>
    <img src="${pet.image}" style="width:100%; border-radius:8px; margin:10px 0;">
    <p><b>Breed:</b> ${pet.breed}</p>
    <p><b>Birth:</b> ${pet.date_of_birth}</p>
    <p><b>Gender:</b> ${pet.gender}</p>
    <p><b>Price:</b> $${pet.price}</p>
  `;
}

// Close modal
document.getElementById("close-modal").onclick = () => {
  document.getElementById("modal").style.display = "none";
};

// Sort by price
document.getElementById("sort-price").onclick = () => {
  petsData.sort((a, b) => a.price - b.price);
  displayPets();
};
