const root = document.documentElement;
const themeButton = document.querySelector(".theme-toggle");
const menuButton = document.querySelector(".menu-toggle");
const navigationPanel = document.querySelector(".nav-panel");

function applyTheme(theme) {
    const selectedTheme = theme === "light" ? "light" : "dark";
    root.dataset.theme = selectedTheme;
    themeButton.textContent = selectedTheme === "dark" ? "☀" : "☾";
    themeButton.setAttribute(
        "aria-label",
        selectedTheme === "dark" ? "Switch to light theme" : "Switch to dark theme"
    );

    try {
        localStorage.setItem("interactive-projects-theme", selectedTheme);
    } catch (error) {
        // Theme changes still apply for this visit when storage is unavailable.
    }
}

let preferredTheme = "dark";
try {
    preferredTheme = localStorage.getItem("interactive-projects-theme") || "dark";
} catch (error) {
    // Keep the dark default when browser storage is unavailable.
}
applyTheme(preferredTheme);

themeButton.addEventListener("click", () => {
    applyTheme(root.dataset.theme === "dark" ? "light" : "dark");
});

function closeNavigation() {
    navigationPanel.classList.remove("is-open");
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "Open navigation menu");
}

menuButton.addEventListener("click", () => {
    const isOpen = navigationPanel.classList.toggle("is-open");
    menuButton.setAttribute("aria-expanded", String(isOpen));
    menuButton.setAttribute(
        "aria-label",
        isOpen ? "Close navigation menu" : "Open navigation menu"
    );
});

document.querySelectorAll(".nav-links a").forEach((link) => {
    link.addEventListener("click", closeNavigation);
});

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeNavigation();
});

document.querySelectorAll("[data-current-year]").forEach((element) => {
    element.textContent = String(new Date().getFullYear());
});
