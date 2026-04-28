let images = [];
let currentIndex = 0;

window.onload = renderSavedImages;

function renderSavedImages() {
  const container = document.getElementById("savedContainer");
  container.innerHTML = "";

  const saved = JSON.parse(localStorage.getItem("savedDogs")) || [];

  if (saved.length === 0) {
    container.innerHTML = "<p>No saved images yet.</p>";
    return;
  }

  saved.forEach((url, index) => {
    const img = document.createElement("img");
    img.src = url;

    img.onclick = () => openViewer(saved, index);

    img.oncontextmenu = (e) => {
      e.preventDefault();

      let updated = [...saved];
      updated.splice(index, 1);

      localStorage.setItem("savedDogs", JSON.stringify(updated));
      renderSavedImages();
    };

    container.appendChild(img);
  });
}

function openViewer(saved, index) {
  images = saved;
  currentIndex = index;

  const viewer = document.createElement("div");
  viewer.style.position = "fixed";
  viewer.style.top = 0;
  viewer.style.left = 0;
  viewer.style.width = "100%";
  viewer.style.height = "100%";
  viewer.style.background = "rgba(0,0,0,0.9)";
  viewer.style.display = "flex";
  viewer.style.alignItems = "center";
  viewer.style.justifyContent = "center";
  viewer.style.zIndex = 1000;

  const img = document.createElement("img");
  img.src = images[currentIndex];
  img.style.maxWidth = "90%";
  img.style.maxHeight = "90%";

  viewer.appendChild(img);

  viewer.onclick = () => viewer.remove();

  document.body.appendChild(viewer);
}

function goBack() {
  window.location.href = "index.html";
}