let currentScale = 24; // pixel size, not multiplier
let allowOpacity = true;
let showGridlines = true;
const opacityInput = document.getElementById("opacity");
const gridlinesInput = document.getElementById("gridlines");
const scaleInput = document.getElementById("scale");
const scaleValue = document.getElementById("scaleValue");
const gallery = document.getElementById("gallery");

scaleInput.addEventListener("change", (e) => {
  currentScale = parseInt(e.target.value);
  scaleValue.textContent = `${currentScale}px`;
  renderGallery();
});
opacityInput.addEventListener("change", (e) => {
  allowOpacity = e.target.checked;
  console.log("Allow Opacity:", allowOpacity);
  renderGallery();
});
gridlinesInput.addEventListener("change", (e) => {
  showGridlines = e.target.checked;
  console.log("Show Gridlines:", showGridlines);
  renderGallery();
});

async function loadEmojis() {
  try {
    const response = await fetch("/api/emojis");
    if (!response.ok) throw new Error("Failed to load emojis");
    return await response.json();
  } catch (error) {
    console.error("Error loading emojis:", error);
    // Fallback - return empty object for now
    return {};
  }
}

function rgbaToHex(r, g, b, a) {
  // Convert RGBA to hex color string, handling transparency
  if (a === 0) {
    return "transparent";
  }
  return `rgba(${r}, ${g}, ${b}, ${a / 255})`;
}

async function createEmojiGrid(codepoint, pixelSize, allowOpacity) {
  // Fetch pixel data at resolution equal to pixelSize
  const response = await fetch(
    `/api/emoji/${codepoint}/pixels?resolution=${pixelSize}&allowOpacity=${allowOpacity}`
  );
  if (!response.ok) throw new Error("Failed to load pixel data");
  const data = await response.json();
  const pixels = data.pixels;
  const resolution = data.resolution;

  // Create wrapper container for the grid and overlay
  const wrapper = document.createElement("div");
  wrapper.className = "pixel-canvas-wrapper";

  // Create grid container
  const grid = document.createElement("div");
  grid.className = "pixel-grid";
  grid.style.gridTemplateColumns = `repeat(${resolution}, 1fr)`;
  grid.style.gridTemplateRows = `repeat(${resolution}, 1fr)`;

  // Create pixel divs
  for (let i = 0; i < pixels.length; i++) {
    const pixel = pixels[i];
    const pixelDiv = document.createElement("div");
    pixelDiv.className = "pixel";
    pixelDiv.style.backgroundColor = rgbaToHex(
      pixel.r,
      pixel.g,
      pixel.b,
      pixel.a
    );
    pixelDiv.style.border = showGridlines ? "1px solid #000" : "none";
    grid.appendChild(pixelDiv);
  }

  wrapper.appendChild(grid);
  return wrapper;
}

function createEmojiCard(codepoint, data) {
  const card = document.createElement("div");
  card.className = "emoji-card";

  const name = document.createElement("div");
  name.className = "emoji-name";
  name.textContent = data.name;

  const codePointDisplay = document.createElement("div");
  codePointDisplay.className = "emoji-unicode";
  codePointDisplay.style.fontSize = "0.9em";
  codePointDisplay.style.fontFamily = "monospace";
  codePointDisplay.textContent = codepoint;

  // Create grid asynchronously
  const gridPromise = createEmojiGrid(
    codepoint,
    currentScale,
    allowOpacity
  ).then((grid) => {
    card.appendChild(grid);
  });

  card.appendChild(name);
  card.appendChild(codePointDisplay);

  return { card, gridPromise };
}

async function renderGallery() {
  gallery.innerHTML = "";

  try {
    const response = await fetch("/api/emojis");
    if (response.ok) {
      const emojis = await response.json();

      // Limit display to first 50 emojis for performance
      const emojiArray = Object.entries(emojis).slice(0, 50);

      const promises = [];
      for (const [codepoint, data] of emojiArray) {
        const { card, gridPromise } = createEmojiCard(codepoint, data);
        gallery.appendChild(card);
        promises.push(gridPromise);
      }

      // Wait for all grids to load
      await Promise.all(promises);

      console.log(
        `Loaded ${emojiArray.length} emojis from ${
          Object.keys(emojis).length
        } available`
      );
    }
  } catch (error) {
    console.error("Error loading gallery:", error);
  }
}

// Initial render
renderGallery();
