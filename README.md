# Pixelmake

Turn svgs into pixel art that is scalable and can be used for cross-stitch, bead work, and other grid-based crafts.

## Project Structure

```
pixelmake/
├── src/
│   ├── backend/          # Express server & PNG generation
│   ├── frontend/         # HTML/CSS/JS for web gallery
├── data/                 # Emoji definitions & color palettes
├── public/               # Static assets served by Express
├── package.json
└── README.md
```

## Features

- Generate pixel emojis in format 12x12 to 124x124
- Web gallery viewer for easy browsing

## Installation

```bash
npm install
```

## Running the Project

Development mode (with auto-reload):

```bash
npm run dev
```

Production mode:

```bash
npm start
```

The gallery will be available at `http://localhost:3000`

## Adding Emojis

Add files to `data/selected`.

## Technologies

- **Backend**: Express.js, Sharp
- **Frontend**: HTML5, CSS3, Vanilla JavaScript
