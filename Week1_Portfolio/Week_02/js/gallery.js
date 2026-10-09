const fallbackImage = "assets/images/fallback.svg";
const photos = [
    { title: "Alpine Lake", category: "Landscapes", alt: "Still alpine lake reflecting a range of snow-capped mountains", image: "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1200&q=85" },
    { title: "Forest Canopy", category: "Nature", alt: "Sunlight filtering through a dense green forest canopy", image: "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1200&q=85" },
    { title: "Curious Fox", category: "Animals", alt: "Red fox sitting in a field and looking toward the camera", image: "https://images.unsplash.com/photo-1474511320723-9a56873867b5?auto=format&fit=crop&w=1200&q=85" },
    { title: "City After Dark", category: "Cities", alt: "City streets glowing with lights after sunset", image: "https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=1200&q=85" },
    { title: "Ocean Cliffs", category: "Landscapes", alt: "Rugged cliffs rising above the deep blue ocean", image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1200&q=85" },
    { title: "Garden Cat", category: "Animals", alt: "Cat resting outdoors in a garden", image: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=1200&q=85" },
    { title: "Desert Dunes", category: "Nature", alt: "Soft golden sand dunes shaped by the wind", image: "https://images.unsplash.com/photo-1509316785289-025f5b846b35?auto=format&fit=crop&w=1200&q=85" },
    { title: "Old Town Lane", category: "Cities", alt: "Narrow old-town street lined with warm-colored buildings", image: "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=1200&q=85" },
    { title: "Mountain Trail", category: "Landscapes", alt: "Winding hiking trail crossing a green mountain valley", image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=85" },
    { title: "Playful Puppy", category: "Animals", alt: "Young golden dog sitting outdoors in soft natural light", image: "https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=1200&q=85" },
    { title: "Misty Woodland", category: "Nature", alt: "Quiet woodland trees fading into morning mist", image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1200&q=85" },
    { title: "Rooftop Skyline", category: "Cities", alt: "Wide city skyline viewed from a rooftop at dusk", image: "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?auto=format&fit=crop&w=1200&q=85" }
];

const galleryGrid = document.getElementById("gallery-grid");
const searchInput = document.getElementById("gallery-search");
const galleryCount = document.getElementById("gallery-count");
const emptyState = document.getElementById("empty-state");
const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightbox-image");
const lightboxFallback = document.getElementById("lightbox-fallback");
const lightboxCaption = document.getElementById("lightbox-caption");
const lightboxCount = document.getElementById("lightbox-count");
const filterButtons = document.querySelectorAll(".filter-button");

let selectedCategory = "All";
let visiblePhotos = photos.slice();
let activePhotoIndex = 0;
let opener = null;

function createPhotoCard(photo, index) {
    const button = document.createElement("button");
    button.className = "gallery-card";
    button.type = "button";
    button.setAttribute("aria-label", `View ${photo.title}, ${photo.category}`);
    button.dataset.title = photo.title.toLowerCase();
    button.dataset.category = photo.category.toLowerCase();

    const imageWrap = document.createElement("span");
    imageWrap.className = "gallery-image-wrap";
    const image = document.createElement("img");
    image.className = "gallery-image is-loading";
    image.src = photo.image;
    image.alt = photo.alt;
    image.loading = "lazy";
    image.decoding = "async";
    image.addEventListener("load", () => image.classList.remove("is-loading"), { once: true });
    image.addEventListener("error", () => {
        if (image.dataset.fallbackApplied === "true") return;
        image.dataset.fallbackApplied = "true";
        image.classList.remove("is-loading");
        image.classList.add("is-failed");
        const fallback = document.createElement("span");
        fallback.className = "image-fallback";
        fallback.textContent = "Preview unavailable";
        fallback.setAttribute("aria-hidden", "true");
        imageWrap.append(fallback);
        image.src = fallbackImage;
        image.alt = `Sample image unavailable: ${photo.alt}`;
    });
    imageWrap.append(image);

    const info = document.createElement("span");
    info.className = "gallery-card-info";
    const text = document.createElement("span");
    const title = document.createElement("strong");
    title.textContent = photo.title;
    const number = document.createElement("span");
    number.textContent = `Photo ${String(index + 1).padStart(2, "0")}`;
    text.append(title, number);
    const category = document.createElement("span");
    category.className = "gallery-category";
    category.textContent = photo.category;
    info.append(text, category);
    button.append(imageWrap, info);
    button.addEventListener("click", () => openLightbox(index, button));
    return button;
}

function renderGallery() {
    const query = searchInput.value.trim().toLocaleLowerCase();
    visiblePhotos = photos.filter((photo) => {
        const matchesCategory = selectedCategory === "All" || photo.category === selectedCategory;
        const searchableText = `${photo.title} ${photo.category} ${photo.alt}`.toLocaleLowerCase();
        return matchesCategory && searchableText.includes(query);
    });

    galleryGrid.replaceChildren(...visiblePhotos.map(createPhotoCard));
    galleryCount.textContent = `${visiblePhotos.length} ${visiblePhotos.length === 1 ? "photo" : "photos"}`;
    emptyState.hidden = visiblePhotos.length !== 0;
}

function displayLightboxPhoto() {
    const photo = visiblePhotos[activePhotoIndex];
    if (!photo) return;

    lightboxImage.classList.remove("is-loading", "is-failed");
    lightboxFallback.hidden = true;
    lightboxImage.dataset.fallbackApplied = "false";
    lightboxImage.alt = photo.alt;
    lightboxImage.src = photo.image;
    lightboxImage.classList.add("is-loading");
    lightboxCaption.textContent = photo.title;
    lightboxCount.textContent = `${String(activePhotoIndex + 1).padStart(2, "0")} / ${String(visiblePhotos.length).padStart(2, "0")} · ${photo.category}`;
}

lightboxImage.addEventListener("load", () => {
    lightboxImage.classList.remove("is-loading", "is-failed");
    lightboxFallback.hidden = true;
});
lightboxImage.addEventListener("error", () => {
    if (lightboxImage.dataset.fallbackApplied === "true") {
        lightboxImage.classList.remove("is-loading");
        lightboxFallback.hidden = false;
        return;
    }
    lightboxImage.dataset.fallbackApplied = "true";
    lightboxImage.classList.remove("is-loading");
    lightboxImage.classList.add("is-failed");
    lightboxImage.src = fallbackImage;
});

function openLightbox(index, sourceButton) {
    if (!visiblePhotos.length) return;
    activePhotoIndex = index;
    opener = sourceButton;
    displayLightboxPhoto();
    lightbox.hidden = false;
    document.body.style.overflow = "hidden";
    document.getElementById("lightbox-close").focus();
}

function closeLightbox() {
    if (lightbox.hidden) return;
    lightbox.hidden = true;
    document.body.style.overflow = "";
    if (opener && opener.isConnected) opener.focus();
}

function moveLightbox(step) {
    activePhotoIndex = (activePhotoIndex + step + visiblePhotos.length) % visiblePhotos.length;
    lightboxImage.dataset.fallbackApplied = "false";
    displayLightboxPhoto();
}

filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
        selectedCategory = button.dataset.category;
        filterButtons.forEach((filter) => {
            const isSelected = filter === button;
            filter.classList.toggle("is-active", isSelected);
            filter.setAttribute("aria-pressed", String(isSelected));
        });
        renderGallery();
    });
});

searchInput.addEventListener("input", renderGallery);
document.getElementById("lightbox-close").addEventListener("click", closeLightbox);
document.getElementById("lightbox-prev").addEventListener("click", () => moveLightbox(-1));
document.getElementById("lightbox-next").addEventListener("click", () => moveLightbox(1));

lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) closeLightbox();
});

document.addEventListener("keydown", (event) => {
    if (lightbox.hidden) return;
    if (event.key === "Escape") {
        closeLightbox();
    } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        moveLightbox(-1);
    } else if (event.key === "ArrowRight") {
        event.preventDefault();
        moveLightbox(1);
    } else if (event.key === "Tab") {
        const focusable = Array.from(lightbox.querySelectorAll("button:not(:disabled)"));
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
            event.preventDefault();
            last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first.focus();
        }
    }
});

renderGallery();
