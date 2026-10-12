const root = document.documentElement;
const themeButton = document.querySelector(".theme-toggle");
const menuButton = document.querySelector(".menu-toggle");
const navPanel = document.querySelector(".nav-panel");
const navigationLinks = document.querySelectorAll(".nav-links a");
const sections = document.querySelectorAll("main .page-section");
const backToTop = document.querySelector(".back-to-top");

function setTheme(theme, remember = true) {
    root.setAttribute("data-theme", theme);
    const nextTheme = theme === "dark" ? "light" : "dark";
    themeButton.setAttribute("aria-label", `Switch to ${nextTheme} theme`);
    themeButton.setAttribute("title", `Switch to ${nextTheme} theme`);

    if (remember) {
        try {
            localStorage.setItem("portfolio-theme", theme);
        } catch (error) {
            // Theme selection still works for this page view if storage is unavailable.
        }
    }
}

let savedTheme = null;
try {
    savedTheme = localStorage.getItem("portfolio-theme");
} catch (error) {
    // Fall back to the default dark theme if browser storage is unavailable.
}
setTheme(savedTheme === "light" ? "light" : "dark", false);

themeButton.addEventListener("click", () => {
    const nextTheme = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    setTheme(nextTheme);
});

function closeMenu() {
    navPanel.classList.remove("is-open");
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "Open navigation menu");
}

menuButton.addEventListener("click", () => {
    const isOpen = navPanel.classList.toggle("is-open");
    menuButton.setAttribute("aria-expanded", String(isOpen));
    menuButton.setAttribute(
        "aria-label",
        isOpen ? "Close navigation menu" : "Open navigation menu"
    );
});

navigationLinks.forEach((link) => {
    link.addEventListener("click", closeMenu);
});

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        closeMenu();
    }
});

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const revealElements = document.querySelectorAll("[data-reveal]");

if (!reduceMotion && "IntersectionObserver" in window) {
    document.body.classList.add("reveal-ready");
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("is-visible");
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12, rootMargin: "0px 0px -35px 0px" });

    revealElements.forEach((element) => revealObserver.observe(element));
} else {
    revealElements.forEach((element) => element.classList.add("is-visible"));
}

function updateActiveSection() {
    const marker = window.innerHeight * 0.36;
    let activeSection = sections[0];

    sections.forEach((section) => {
        const bounds = section.getBoundingClientRect();
        if (bounds.top <= marker && bounds.bottom > marker) {
            activeSection = section;
        }
    });

    if (activeSection) {
        navigationLinks.forEach((link) => {
            const isActive = link.getAttribute("href") === `#${activeSection.id}`;
            if (isActive) {
                link.setAttribute("aria-current", "location");
            } else {
                link.removeAttribute("aria-current");
            }
        });
    }

    backToTop.classList.toggle("is-visible", window.scrollY > 500);
}

window.addEventListener("scroll", updateActiveSection, { passive: true });
window.addEventListener("resize", updateActiveSection);
updateActiveSection();

document.querySelectorAll('.project-button[href="#"]').forEach((link) => {
    link.addEventListener("click", (event) => event.preventDefault());
});

const contactForm = document.getElementById("contact-form");
const formStatus = document.getElementById("form-status");
const submitButton = contactForm.querySelector('button[type="submit"]');

contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    formStatus.removeAttribute("data-state");

    if (contactForm.action.includes("YOUR_FORM_ID")) {
        formStatus.textContent =
            "The form is ready, but it needs your Formspree form ID. Replace YOUR_FORM_ID in the form action to enable sending.";
        formStatus.dataset.state = "error";
        return;
    }

    submitButton.disabled = true;
    contactForm.setAttribute("aria-busy", "true");
    formStatus.textContent = "Sending your message…";

    try {
        const response = await fetch(contactForm.action, {
            method: "POST",
            body: new FormData(contactForm),
            headers: { Accept: "application/json" }
        });

        if (!response.ok) {
            throw new Error("Your message could not be sent. Please try again or email me directly.");
        }

        contactForm.reset();
        formStatus.textContent = "Thanks for reaching out! Your message has been sent.";
        formStatus.dataset.state = "success";
    } catch (error) {
        formStatus.textContent = error instanceof Error
            ? error.message
            : "Your message could not be sent. Please try again or email me directly.";
        formStatus.dataset.state = "error";
    } finally {
        submitButton.disabled = false;
        contactForm.removeAttribute("aria-busy");
    }
});

document.getElementById("current-year").textContent = new Date().getFullYear();
