const express = require("express");
const path = require("path");
const { EMOJIS } = require("../../data/emojis");
const { generatePixelArtPNG, extractPixelData } = require("./pngGenerator");

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from public directory
app.use(express.static(path.join(__dirname, "../../public")));
app.use(express.json());

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

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
      !allowOpacity
    );

    res.json({ pixels, resolution });
  } catch (error) {
    console.error("Pixel data extraction error:", error);
    res.status(500).json({ error: "Failed to extract pixel data" });
  }
});

// Get specific emoji as PNG
app.get("/api/emoji/:codepoint/png", async (req, res) => {
  try {
    const codepoint = req.params.codepoint;
    const emoji = EMOJIS[codepoint];

    if (!emoji) {
      return res.status(404).json({ error: "Emoji not found" });
    }

    const pixelSize = req.query.size ? parseFloat(req.query.size) : 1;
    const allowOpacity = req.query.allowOpacity !== "false"; // Default to true unless explicitly set to false
    console.log(
      `Generating PNG for ${codepoint} with pixelSize: ${pixelSize}, allowOpacity: ${allowOpacity}`
    );
    const pngBuffer = await generatePixelArtPNG(
      emoji.path,
      pixelSize,
      !allowOpacity
    );

    res.setHeader("Content-Type", "image/png");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${emoji.filename.replace(".svg", "")}.png"`
    );
    res.send(pngBuffer);
  } catch (error) {
    console.error("PNG generation error:", error);
    res.status(500).json({ error: "Failed to generate PNG" });
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
  console.log(
    `🎨 Cross-Stitch Emoji Gallery running at http://localhost:${PORT}`
  );
  console.log(`📊 Currently has ${Object.keys(EMOJIS).length} emoji(s)`);
});
