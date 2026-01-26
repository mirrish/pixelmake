## Cross-Stitch Emojis Project Setup

This is a Node.js pixel art emoji generator with a web gallery for cross-stitch patterns.

### Project Goals

- Generate 24x24 pixel emoji PNG files
- Provide a web-viewable gallery interface
- Support limited color palettes suitable for cross-stitch
- Enable browsing and downloading of emoji patterns

### Key Files to Know

- `src/backend/server.js` - Express server & PNG generation API
- `src/frontend/` - Web gallery HTML/CSS/JS
- `data/emojis.js` - Emoji definitions and color palettes
- `public/` - Static assets served by the web server

### Next Steps

1. Install dependencies with `npm install`
2. Add emoji definitions to `data/emojis.js`
3. Run the project with `npm run dev` or `npm start`
4. Visit `http://localhost:3000` to view the gallery
