// ---------- Dark / light theme ----------
const root = document.documentElement;
const themeBtn = document.querySelector(".theme-toggle");

function setTheme(theme) {
    root.setAttribute("data-theme", theme);
    themeBtn.textContent = theme === "dark" ? "☀️" : "🌙";
    try { localStorage.setItem("theme", theme); } catch (e) {}
}

let saved = null;
try { saved = localStorage.getItem("theme"); } catch (e) {}
setTheme(saved || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"));

themeBtn.addEventListener("click", () => {
    setTheme(root.getAttribute("data-theme") === "dark" ? "light" : "dark");
});

// ---------- Mobile menu ----------
const menuBtn = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");

menuBtn.addEventListener("click", () => {
    const open = navLinks.classList.toggle("open");
    menuBtn.setAttribute("aria-expanded", open);
});
navLinks.querySelectorAll("a").forEach(a =>
    a.addEventListener("click", () => {
        navLinks.classList.remove("open");
        menuBtn.setAttribute("aria-expanded", "false");
    })
);

// ---------- Skill bars fill when visible ----------
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.3 });

document.querySelectorAll(".skill-card").forEach(card => observer.observe(card));

// ---------- Highlight current nav link ----------
const sections = document.querySelectorAll("main section");
const links = document.querySelectorAll(".nav-links a");

window.addEventListener("scroll", () => {
    let current = "";
    sections.forEach(sec => {
        if (window.scrollY >= sec.offsetTop - 140) current = sec.id;
    });
    links.forEach(a => a.classList.toggle("active", a.getAttribute("href") === "#" + current));
});

// ---------- Contact form: opens your email app with the message ----------
document.getElementById("contact-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const message = document.getElementById("message").value.trim();

    const subject = encodeURIComponent("Portfolio message from " + name);
    const body = encodeURIComponent(message + "\n\nFrom: " + name + " (" + email + ")");

    window.location.href = "mailto:maheswariguttula112@gmail.com?subject=" + subject + "&body=" + body;
    document.getElementById("form-note").textContent = "Opening your email app to send the message.";
});
