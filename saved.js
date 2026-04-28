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
  viewer.style.flexDirection = "column";
  viewer.style.alignItems = "center";
  viewer.style.justifyContent = "center";
  viewer.style.zIndex = 1000;

  const img = document.createElement("img");
  img.src = images[currentIndex];
  img.style.maxWidth = "90%";
  img.style.maxHeight = "80%";

  const downloadBtn = document.createElement("button");
  downloadBtn.innerText = "⬇ Download";
  downloadBtn.style.marginTop = "15px";
  downloadBtn.style.padding = "10px 20px";
  downloadBtn.style.cursor = "pointer";

  downloadBtn.onclick = async (e) => {
  e.stopPropagation();

  try {
    const imageUrl = images[currentIndex];

    const response = await fetch(imageUrl);
    const blob = await response.blob();

    const blobUrl = URL.createObjectURL(blob);

    let filename = imageUrl.split("/").pop().split("?")[0];

    if (!filename) {
      filename = "dog.jpg";
    }

    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = filename;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(blobUrl);
  } catch (err) {
    console.error("Download failed:", err);
  }
};

  viewer.appendChild(img);
  viewer.appendChild(downloadBtn);

  viewer.onclick = () => viewer.remove();

  document.body.appendChild(viewer);
}

function goBack() {
  window.location.href = "index.html";
}