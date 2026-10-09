const clockTime = document.getElementById("clock-time");
const clockPeriod = document.getElementById("clock-period");
const clockDate = document.getElementById("clock-date");
const countdownForm = document.getElementById("countdown-form");
const targetInput = document.getElementById("target-date");
const countdownMessage = document.getElementById("countdown-message");
const timerStartButton = document.getElementById("timer-start");
const timerPauseButton = document.getElementById("timer-pause");
const timerResumeButton = document.getElementById("timer-resume");
const timerResetButton = document.getElementById("timer-reset");
const progressBar = document.getElementById("countdown-progress");
const progressFill = document.getElementById("progress-fill");

const countdownUnits = {
    days: document.getElementById("days"),
    hours: document.getElementById("hours"),
    minutes: document.getElementById("minutes"),
    seconds: document.getElementById("seconds")
};

let targetTime = null;
let initialDuration = 0;
let remainingDuration = 0;
let isRunning = false;

function pad(value) {
    return String(value).padStart(2, "0");
}

function updateClock() {
    const now = new Date();
    const hours = now.getHours();
    clockTime.textContent = `${pad(hours % 12 || 12)}:${pad(now.getMinutes())}`;
    clockPeriod.textContent = hours >= 12 ? "PM" : "AM";
    clockDate.textContent = new Intl.DateTimeFormat("en-IN", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric"
    }).format(now);
}

function showMessage(message, type = "") {
    countdownMessage.textContent = message;
    countdownMessage.classList.toggle("is-error", type === "error");
    countdownMessage.classList.toggle("is-complete", type === "complete");
}

function updateControls() {
    timerStartButton.disabled = isRunning;
    timerPauseButton.disabled = !isRunning;
    timerResumeButton.disabled = isRunning || initialDuration <= 0 || remainingDuration <= 0;
}

function updateProgress(remaining) {
    const elapsedPercent = initialDuration > 0
        ? Math.min(100, Math.max(0, ((initialDuration - remaining) / initialDuration) * 100))
        : 0;
    const roundedPercent = Math.round(elapsedPercent);
    progressFill.style.width = `${elapsedPercent}%`;
    progressBar.setAttribute("aria-valuenow", String(roundedPercent));
    document.getElementById("progress-value").textContent = `${roundedPercent}%`;
}

function renderTime(remaining) {
    const totalSeconds = Math.max(0, Math.floor(remaining / 1000));
    const values = {
        days: Math.floor(totalSeconds / 86400),
        hours: Math.floor((totalSeconds % 86400) / 3600),
        minutes: Math.floor((totalSeconds % 3600) / 60),
        seconds: totalSeconds % 60
    };

    Object.entries(values).forEach(([unit, value]) => {
        countdownUnits[unit].textContent = pad(value);
    });
    updateProgress(remaining);
}

function tickCountdown() {
    if (!isRunning || !targetTime) return;

    remainingDuration = Math.max(0, targetTime - Date.now());
    renderTime(remainingDuration);

    if (remainingDuration === 0) {
        isRunning = false;
        targetTime = null;
        showMessage("Countdown complete! Your chosen moment has arrived.", "complete");
        updateControls();
    }
}

function setTarget(date) {
    const now = Date.now();
    if (!(date instanceof Date) || Number.isNaN(date.getTime())) {
        showMessage("That date and time is invalid. Please choose a valid date.", "error");
        return false;
    }
    if (date.getTime() <= now) {
        showMessage("Choose a date and time in the future.", "error");
        return false;
    }

    targetTime = date.getTime();
    initialDuration = targetTime - now;
    remainingDuration = initialDuration;
    isRunning = true;
    showMessage(`Counting down to ${date.toLocaleString()}.`);
    renderTime(remainingDuration);
    updateControls();
    return true;
}

function validateAndStart() {
    if (!targetInput.value) {
        showMessage("Please choose a date and time before starting.", "error");
        targetInput.focus();
        return false;
    }

    const chosenDate = new Date(targetInput.value);
    if (Number.isNaN(chosenDate.getTime())) {
        showMessage("That date and time is invalid. Please choose a valid date.", "error");
        targetInput.focus();
        return false;
    }
    return setTarget(chosenDate);
}

function setLocalDateInput(date) {
    const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
    targetInput.value = localDate.toISOString().slice(0, 16);
}

function pauseCountdown() {
    if (!isRunning || !targetTime) return;
    remainingDuration = Math.max(0, targetTime - Date.now());
    targetTime = null;
    isRunning = false;
    renderTime(remainingDuration);
    showMessage("Countdown paused.");
    updateControls();
}

function resumeCountdown() {
    if (isRunning || remainingDuration <= 0) return;
    targetTime = Date.now() + remainingDuration;
    isRunning = true;
    showMessage("Countdown resumed.");
    updateControls();
    tickCountdown();
}

function resetCountdown() {
    isRunning = false;
    targetTime = null;
    initialDuration = 0;
    remainingDuration = 0;
    renderTime(0);
    showMessage("Countdown reset. Choose a date and time to start again.");
    updateControls();
}

countdownForm.addEventListener("submit", (event) => {
    event.preventDefault();
    validateAndStart();
});

timerStartButton.addEventListener("click", validateAndStart);
timerPauseButton.addEventListener("click", pauseCountdown);
timerResumeButton.addEventListener("click", resumeCountdown);
timerResetButton.addEventListener("click", resetCountdown);

document.querySelectorAll("[data-quick]").forEach((button) => {
    button.addEventListener("click", () => {
        const now = new Date();
        let destination;
        if (button.dataset.quick === "new-year") {
            destination = new Date(now.getFullYear() + 1, 0, 1, 0, 0, 0, 0);
        } else if (button.dataset.quick === "tomorrow") {
            destination = new Date(now);
            destination.setDate(destination.getDate() + 1);
        } else {
            destination = new Date(now.getTime() + 60 * 60 * 1000);
        }

        setLocalDateInput(destination);
        setTarget(destination);
    });
});

updateClock();
renderTime(0);
updateControls();
const firstNewYear = new Date(new Date().getFullYear() + 1, 0, 1, 0, 0, 0, 0);
setLocalDateInput(firstNewYear);
setTarget(firstNewYear);
window.setInterval(() => {
    updateClock();
    if (isRunning) tickCountdown();
}, 1000);
