# Week 2: CSS + Basic JavaScript

This week's focus was **interactivity and animations**. I built both assignments, so this repository has two small projects.

## Assignment 1: Interactive Image Gallery

A photo gallery with 8 images in a grid. Clicking an image opens it in a larger lightbox view.

### Features

- 8 images shown in a responsive grid (4 columns on desktop, 3 on tablet, 2 on mobile)
- Hover animations: the image zooms and darkens, and a caption slides up
- Click an image to open it in a lightbox with a bigger version
- Previous and next buttons, with an image counter (for example 3 / 8)
- Close with the × button, the Esc key, or a click on the dark background
- Keyboard support: Enter opens an image, and the left and right arrow keys move between images

### Skills gained

DOM manipulation and event handling.

## Assignment 2: Digital Clock / Countdown Timer

A live digital clock and a countdown timer on one page.

### Features

- Live clock in HH:MM:SS format, updated every second
- Full date shown below the time
- Countdown to the next New Year by default, showing days, hours, minutes and seconds
- Optional: pick any date and time and start a new countdown
- Shows "Time is up!" when the countdown ends

### Skills gained

The JavaScript `Date()` object and `setInterval()`.

## Technologies used

| Technology | Used for |
|------------|----------|
| HTML5 | Page structure |
| CSS3 | Grid layout, hover effects, transitions, animations, responsive design |
| JavaScript | DOM manipulation, events, `Date()`, `setInterval()` |

## Project structure

```
week2/
├── gallery.html    # Assignment 1: Interactive Image Gallery
├── clock.html      # Assignment 2: Digital Clock / Countdown Timer
└── README.md       # Project description
```

Each file contains its own HTML, CSS and JavaScript, so no other files are needed.

## How to run

1. Download or clone this repository.
2. Double-click `gallery.html` or `clock.html` to open it in any web browser.

The gallery loads its images from the internet (picsum.photos), so it needs a connection. To use your own pictures, change the `src` of each image in `gallery.html`.

## Key concepts used

- `document.querySelectorAll()` and `getElementById()` to select elements
- `addEventListener()` for click and keyboard events
- `classList.add()` and `classList.remove()` to show and hide the lightbox
- CSS `transition`, `transform` and `@keyframes` for animations
- `new Date()`, `getHours()`, `getMinutes()` and `getSeconds()` to read the time
- `setInterval()` to update the page every 1000 milliseconds
- `padStart()` to show numbers as two digits (05 instead of 5)

## Contact

- Email: maheswariguttula112@gmail.com
- GitHub: https://github.com/maheswari543/Skill_Nexix_Foundation
- LinkedIn: https://www.linkedin.com/in/maheswari-guttula-757a3a365/

## License

This project is for learning purposes. © 2026 Maheswari Guttula.
