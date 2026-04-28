
let images = [];
let currentIndex = 0;

window.onload = () => {
  loadBreeds();
  renderSavedImages();
};
async function loadBreeds() {
  const breedSelect = document.getElementById("breedSelect");

  try {
    const res = await fetch("https://dog.ceo/api/breeds/list/all");
    const data = await res.json();

    const breeds = data.message;

    Object.keys(breeds).forEach(breed => {
      const option = document.createElement("option");
      option.value = breed;
      option.textContent = breed;
      breedSelect.appendChild(option);
    });

  } catch (err) {
    console.error(err);
  }
}

function loadBreed() {
  const breed = document.getElementById("breedSelect").value;
  const subSelect = document.getElementById("subBreedSelect");

  subSelect.innerHTML = '<option value="">Select sub-breed</option>';
  images = [];
  currentIndex = 0;

  if (!breed) return;

  fetch(`https://dog.ceo/api/breed/${breed}/list`)
    .then(res => res.json())
    .then(data => {
      const subBreeds = data.message;

      if (subBreeds.length > 0) {
        subSelect.style.display = "inline";

        subBreeds.forEach(sub => {
          const option = document.createElement("option");
          option.value = sub;
          option.textContent = sub;
          subSelect.appendChild(option);
        });

      } else {
        subSelect.style.display = "none";
        loadImages(); 
      }
    })
    .catch(err => console.error(err));
}

async function loadImages() {
  const breed = document.getElementById("breedSelect").value;
  const subBreed = document.getElementById("subBreedSelect").value;

  let url = subBreed
    ? `https://dog.ceo/api/breed/${breed}/${subBreed}/images`
    : `https://dog.ceo/api/breed/${breed}/images`;

  try {
    const res = await fetch(url);
    const data = await res.json();

    images = data.message;
    currentIndex = 0;

    showImage();

  } catch (err) {
    console.error(err);
  }
}

function showImage() {
  const img = document.getElementById("dogImage");

  if (images.length === 0) {
    img.src = "https://via.placeholder.com/500x300";
    return;
  }
  setImage(images[currentIndex]);
}

function nextImage() {
  if (images.length === 0) return;

  currentIndex = (currentIndex + 1) % images.length;
  showImage();
}

function prevImage() {
  if (images.length === 0) return;

  currentIndex = (currentIndex - 1 + images.length) % images.length;
  showImage();
}

function saveImage() {
  if (images.length === 0) return;

  const imageUrl = images[currentIndex];

  let saved = JSON.parse(localStorage.getItem("savedDogs")) || [];

  if (!saved.includes(imageUrl)) {
    saved.push(imageUrl);
    localStorage.setItem("savedDogs", JSON.stringify(saved));
    alert("Saved!");
  } else {
    alert("Already saved!");
  }
}

function goToSaved() {
  window.location.href = "saved.html";
}

function setImage(src) {
  const img = document.getElementById("dogImage");

  img.style.opacity = 0;

  const newImg = new Image();

  newImg.onload = () => {
    img.src = src;

    requestAnimationFrame(() => {
      img.style.opacity = 1;
    });
  };

  newImg.onerror = () => {
    img.src = "https://via.placeholder.com/500x300";
    img.style.opacity = 1;
  };

  newImg.src = src;
}