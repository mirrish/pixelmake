const express = require("express");
const path = require("path");
const { EMOJIS } = require("../../data/emojis");
const { generatePixelArtPNG, extractPixelData } = require("./pngGenerator");

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from public directory
app.use(express.static(path.join(__dirname, "../../public")));
app.use(express.json());

// Get all emojis (JSON data only)
app.get("/api/emojis", (req, res) => {
  res.json(EMOJIS);
});

// Get emoji pixel data
app.get("/api/emoji/:codepoint/pixels", async (req, res) => {
  try {
    const codepoint = req.params.codepoint;
    const emoji = EMOJIS[codepoint];

    if (!emoji) {
      return res.status(404).json({ error: "Emoji not found" });
    }

    const resolution = req.query.resolution
      ? parseInt(req.query.resolution)
      : 24;
    const allowOpacity = req.query.allowOpacity !== "false"; // Default to true unless explicitly set to false
    const pixels = await extractPixelData(
      emoji.path,
      resolution,
      !allowOpacity,
    );

    res.json({ pixels, resolution });
  } catch (error) {
    console.error("Pixel data extraction error:", error);
    res.status(500).json({ error: "Failed to extract pixel data" });
  }
});

// Get emoji details
app.get("/api/emoji/:codepoint", (req, res) => {
  const codepoint = req.params.codepoint;
  const emoji = EMOJIS[codepoint];

  if (!emoji) {
    return res.status(404).json({ error: "Emoji not found" });
  }

  res.json(emoji);
});

// Start server
app.listen(PORT, () => {
  console.log(`🎨 Pixelmake running at http://localhost:${PORT}`);
  console.log(`📊 Currently has ${Object.keys(EMOJIS).length} emoji(s)`);
});
