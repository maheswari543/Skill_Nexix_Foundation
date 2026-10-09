const root = document.documentElement;
const themeButton = document.querySelector(".theme-toggle");
const menuButton = document.querySelector(".menu-toggle");
const navigation = document.querySelector(".nav-links");

function setTheme(theme) {
    root.setAttribute("data-theme", theme);
    themeButton.textContent = theme === "dark" ? "☀️" : "🌙";
    themeButton.setAttribute(
        "aria-label",
        theme === "dark" ? "Switch to light theme" : "Switch to dark theme"
    );

    try {
        localStorage.setItem("theme", theme);
    } catch (error) {
        // The selected theme still applies for this page view if storage is unavailable.
    }
}

let savedTheme = null;
try {
    savedTheme = localStorage.getItem("theme");
} catch (error) {
    // Use the dark theme when browser storage is unavailable.
}
setTheme(savedTheme || "dark");

themeButton.addEventListener("click", () => {
    const nextTheme = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    setTheme(nextTheme);
});

function closeMenu() {
    navigation.classList.remove("open");
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "Open navigation menu");
}

menuButton.addEventListener("click", () => {
    const isOpen = navigation.classList.toggle("open");
    menuButton.setAttribute("aria-expanded", String(isOpen));
    menuButton.setAttribute(
        "aria-label",
        isOpen ? "Close navigation menu" : "Open navigation menu"
    );
});

navigation.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
});

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        closeMenu();
    }
});

const skillCards = document.querySelectorAll(".skill-card");
if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries, currentObserver) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                currentObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    skillCards.forEach((card) => observer.observe(card));
} else {
    skillCards.forEach((card) => card.classList.add("visible"));
}

const sections = document.querySelectorAll("#home, main section");
const navigationLinks = document.querySelectorAll(".nav-links a");

function updateActiveLink() {
    let currentSection = "home";

    sections.forEach((section) => {
        if (window.scrollY >= section.offsetTop - 140) {
            currentSection = section.id;
        }
    });

    navigationLinks.forEach((link) => {
        const isActive = link.getAttribute("href") === `#${currentSection}`;
        link.classList.toggle("active", isActive);
        if (isActive) {
            link.setAttribute("aria-current", "location");
        } else {
            link.removeAttribute("aria-current");
        }
    });
}

window.addEventListener("scroll", updateActiveLink, { passive: true });
updateActiveLink();

document.getElementById("contact-form").addEventListener("submit", (event) => {
    event.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const message = document.getElementById("message").value.trim();
    const subject = encodeURIComponent(`Portfolio message from ${name}`);
    const body = encodeURIComponent(`${message}\n\nFrom: ${name} (${email})`);

    document.getElementById("form-note").textContent =
        "Opening your email app to send the message.";
    window.location.href =
        `mailto:maheswariguttula112@gmail.com?subject=${subject}&body=${body}`;
});

document.getElementById("current-year").textContent = new Date().getFullYear();
