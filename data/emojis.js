// Emoji definitions loaded from SVG files
const fs = require("fs");
const path = require("path");

/**
 * Dynamically load all SVG files from the svg directory
 * Returns an object mapping unicode codepoints to SVG file info
 */
function loadEmojiSVGs() {
  const svgDir = path.join(__dirname, "selected");
  const emojis = {};

  try {
    const files = fs.readdirSync(svgDir);

    files.forEach((file) => {
      if (file.endsWith(".svg")) {
        // Remove .svg extension to get the unicode codepoint
        const codepoint = file.slice(0, -4);
        emojis[codepoint] = {
          codepoint: codepoint,
          name: codepoint.replace(/-/g, "_"),
          path: path.join(svgDir, file),
          filename: file,
        };
      }
    });
  } catch (error) {
    console.error("Error loading SVG files:", error);
  }

  return emojis;
}

// Load all emojis from SVG directory
const EMOJIS = loadEmojiSVGs();

module.exports = { EMOJIS };
