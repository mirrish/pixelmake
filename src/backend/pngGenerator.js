const sharp = require("sharp");
const fs = require("fs");

/**
 * Convert SVG to PNG at specified scale
 * @param {string} svgPath - Path to the SVG file
 * @param {number} pixelSize - Size of each pixel in the output
 * @param {boolean} hardOpacity - If true, force pixels to be fully opaque (1) or fully transparent (0)
 * @returns {Promise<Buffer>} PNG buffer
 */
async function generatePixelArtPNG(
  svgPath,
  pixelSize = 10,
  hardOpacity = false
) {
  try {
    // Read SVG file
    const svgBuffer = fs.readFileSync(svgPath);

    const targetSize = 24 * pixelSize;
    console.log(
      `Processing SVG: ${svgPath}, target size: ${targetSize}px, hard opacity: ${hardOpacity}`
    );

    // Convert SVG to PNG using Sharp
    let image = sharp(svgBuffer, { density: 300 }).resize(
      targetSize,
      targetSize,
      {
        fit: "fill",
        withoutEnlargement: false,
      }
    );

    // Apply hard opacity if requested
    if (hardOpacity) {
      // Extract raw RGBA data, apply threshold to alpha channel, then convert back
      const { data, info } = await image
        .ensureAlpha()
        .raw()
        .toBuffer({ resolveWithObject: true });

      console.log(
        `Raw image info: ${info.width}x${info.height}, channels: ${info.channels}`
      );

      // Threshold alpha channel (every 4th byte starting at index 3 in RGBA)
      for (let i = 3; i < data.length; i += 4) {
        data[i] = data[i] > 128 ? 255 : 0;
      }

      // Reconstruct and convert to PNG
      const pngBuffer = await sharp(data, {
        raw: {
          width: info.width,
          height: info.height,
          channels: info.channels,
          depth: info.depth,
        },
      })
        .png()
        .toBuffer();

      return pngBuffer;
    } else {
      // Simple path - no hard opacity processing
      const pngBuffer = await image.png().toBuffer();
      return pngBuffer;
    }
  } catch (error) {
    console.error("Error generating PNG from SVG:", error);
    throw error;
  }
}

/**
 * Extract pixel data from SVG as NxN array of RGBA colors
 * @param {string} svgPath - Path to the SVG file
 * @param {number} resolution - Resolution of pixel data (e.g., 24 for 24x24, 12 for 12x12)
 * @param {boolean} hardOpacity - If true, force pixels to be fully opaque (1) or fully transparent (0)
 * @returns {Promise<Array>} Array of pixel objects with r, g, b, a values
 */
async function extractPixelData(svgPath, resolution = 24, hardOpacity = false) {
  try {
    // Read SVG file
    const svgBuffer = fs.readFileSync(svgPath);

    // Convert SVG to NxN PNG
    let image = sharp(svgBuffer, { density: 300 }).resize(
      resolution,
      resolution,
      {
        fit: "fill",
        withoutEnlargement: false,
      }
    );

    // Get raw RGBA data
    const { data } = await image
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });

    const pixels = [];

    // Apply hard opacity if requested
    if (hardOpacity) {
      for (let i = 0; i < data.length; i += 4) {
        pixels.push({
          r: data[i],
          g: data[i + 1],
          b: data[i + 2],
          a: data[i + 3] > 128 ? 255 : 0,
        });
      }
    } else {
      for (let i = 0; i < data.length; i += 4) {
        pixels.push({
          r: data[i],
          g: data[i + 1],
          b: data[i + 2],
          a: data[i + 3],
        });
      }
    }

    return pixels;
  } catch (error) {
    console.error("Error extracting pixel data:", error);
    throw error;
  }
}

module.exports = { generatePixelArtPNG, extractPixelData };
