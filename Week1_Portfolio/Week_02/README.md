# Interactive Web Projects

A responsive collection of two browser-only projects by **Maheswari Guttula**: a live digital clock with a countdown timer, and a searchable, filterable photography gallery.

## Features

### Digital clock and countdown

- Live 12-hour clock with an AM/PM indicator and a full weekday/date display.
- Date-and-time countdown with separate day, hour, minute, and second displays.
- Start, pause, resume, and reset controls with validation for empty, invalid, and past dates.
- Quick countdowns for New Year, tomorrow, and one hour from now.
- Progress bar showing elapsed countdown time and a clear completion message.

### Interactive image gallery

- Twelve sample images across Nature, Animals, Landscapes, and Cities.
- Category filters and live search across image titles, categories, and descriptions.
- Responsive, keyboard-accessible image cards with captions and image numbers.
- Lightbox with previous, next, and close controls; Escape and arrow-key support.
- Lazy-loaded images with a local fallback illustration if a remote image cannot load.

### Shared experience

- Shared navigation between the landing page and both projects.
- Dark/light theme toggle (the preference is remembered when browser storage is available).
- Responsive layout, reduced-motion support, semantic page landmarks, and visible keyboard focus.

## Technologies

- HTML5
- CSS3
- Vanilla JavaScript

No framework, backend, build step, or package installation is required. Google Fonts and gallery sample photos load over the internet; the gallery displays a local fallback if a photo is unavailable.

## Run locally

1. Open this folder in Visual Studio Code.
2. Start **Live Server** from `index.html` (or open `index.html` directly in a browser).
3. Use the landing page to open **Digital Clock** or **Image Gallery**.

The project uses relative asset paths and can also be published as a static site with GitHub Pages. When publishing this folder from a larger repository, configure GitHub Pages to serve the `Week_02` directory (or publish the contents of this directory from a dedicated branch/repository).

## Screenshots

Screenshots can be added here after capturing the pages locally. Suggested files:

- `assets/images/homepage-screenshot.png`
- `assets/images/clock-screenshot.png`
- `assets/images/gallery-screenshot.png`

## Folder structure

```text
Week_02/
├── index.html
├── clock.html
├── gallery.html
├── css/
│   ├── style.css
│   ├── clock.css
│   └── gallery.css
├── js/
│   ├── main.js
│   ├── clock.js
│   └── gallery.js
├── assets/
│   └── images/
│       └── fallback.svg
├── README.md
├── .gitignore
└── LICENSE
```
