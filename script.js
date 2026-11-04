// ==========================================
// A VERY DISCO CHRISTMAS 2026
// SECRET GROOVE + SUPABASE
// ==========================================

// Supabase public connection details.
// The publishable key is intended for browser use.
// Never put an admin key or service-role key in this file.
const SUPABASE_FUNCTION_URL =
    "https://zsxtwvjuvfsjlkzmumpx.supabase.co/functions/v1/secret-groove";
const SUPABASE_PUBLISHABLE_KEY =
    "sb_publishable_WeoplVoSsjVDL4-fhXHPJw_wPFF8iAb";

// ==========================================
// 1. CHRISTMAS COUNTDOWN
// ==========================================

const christmasDate = new Date(2026, 11, 25, 0, 0, 0).getTime();

function updateCountdown() {
    const countdown = document.getElementById("countdown");
    if (!countdown) return;

    const distance = christmasDate - Date.now();
    if (distance <= 0) {
        countdown.textContent = "MERRY CHRISTMAS! 🎄";
        return;
    }

    const days = Math.floor(distance / 86400000);
    const hours = Math.floor((distance % 86400000) / 3600000);
    const minutes = Math.floor((distance % 3600000) / 60000);
    const seconds = Math.floor((distance % 60000) / 1000);

    countdown.innerHTML = `
        <span>${days}<small>DAYS</small></span>
        <span>${hours}<small>HOURS</small></span>
        <span>${minutes}<small>MINS</small></span>
        <span>${seconds}<small>SECS</small></span>
    `;
}
updateCountdown();
setInterval(updateCountdown, 1000);

// ==========================================
// 2. ENTER THE PARTY
// ==========================================

function enterParty() {
    document.getElementById("welcomePage").style.display = "none";
    document.getElementById("partyPage").style.display = "block";
    window.scrollTo(0, 0);
}

// ==========================================
// 3. HOMEPAGE NAVIGATION
// ==========================================

function showSection(sectionId) {
    const partyPage = document.getElementById("partyPage");
    partyPage.querySelector(".party-header").style.display = "none";
    partyPage.querySelector(".party-menu").style.display = "none";

    document.querySelectorAll(".content-section").forEach(section => {
        section.style.display = "none";
    });

    const selectedSection = document.getElementById(sectionId);
    if (!selectedSection) {
        console.error("Section not found:", sectionId);
        return;
    }

    selectedSection.style.display = "flex";
    window.scrollTo(0, 0);
}

// ==========================================
// 4. BACK TO HOMEPAGE
// ==========================================

function hideSections() {
    const partyPage = document.getElementById("partyPage");
    document.querySelectorAll(".content-section").forEach(section => {
        section.style.display = "none";
    });
    partyPage.querySelector(".party-header").style.display = "block";
    partyPage.querySelector(".party-menu").style.display = "grid";
    partyPage.style.display = "block";
    window.scrollTo(0, 0);
}

// ==========================================
// 5. SECRET GROOVE WHEEL
// ==========================================

const familyNames = [
    "Mama Mae", "Daryl", "Alexa", "Kobe", "Ate Jacque", "Ate Nene",
    "Mommy Ping", "Tito Dodz", "Sabrina", "Javie", "Mommy Tic",
    "Tito Tony", "Abraham", "Amanda", "Ate Doey", "Ate Junel",
    "Wowo Cosme", "Wowa Elsie"
];

const wheelColors = [
    "#7139a6", "#17131f", "#a32959", "#30203f", "#8c55bd", "#17131f",
    "#a32959", "#49305f", "#7139a6", "#17131f", "#a32959", "#30203f",
    "#8c55bd", "#17131f", "#7139a6", "#a32959", "#30203f", "#8c55bd"
];

let wheelRotation = 0;
let wheelSpinning = false;
let currentParticipant = null;
let currentAccessCode = null;

function drawSecretWheel() {
    const canvas = document.getElementById("secretWheel");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const center = 300;
    const radius = 285;
    const slice = (Math.PI * 2) / familyNames.length;

    ctx.clearRect(0, 0, 600, 600);

    familyNames.forEach((name, index) => {
        const startAngle = -Math.PI / 2 + index * slice;
        const endAngle = startAngle + slice;

        ctx.beginPath();
        ctx.moveTo(center, center);
        ctx.arc(center, center, radius, startAngle, endAngle);
        ctx.closePath();
        ctx.fillStyle = wheelColors[index];
        ctx.fill();
        ctx.strokeStyle = "#d9c8f5";
        ctx.lineWidth = 3;
        ctx.stroke();

        ctx.save();
        const middleAngle = startAngle + slice / 2;
        ctx.translate(center, center);
        ctx.rotate(middleAngle);
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 17px Arial";
        ctx.shadowColor = "#b994ff";
        ctx.shadowBlur = 5;
        ctx.fillText(name, 155, 0, 145);
        ctx.restore();
    });

    ctx.beginPath();
    ctx.arc(center, center, 55, 0, Math.PI * 2);
    ctx.fillStyle = "#111019";
    ctx.fill();
    ctx.strokeStyle = "#e4d7ff";
    ctx.lineWidth = 7;
    ctx.stroke();
    ctx.font = "42px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("🪩", center, center);
}

// ==========================================
// 6. SUPABASE REQUEST HELPER
// ==========================================

async function callSecretGroove(action, name, accessCode) {
    const response = await fetch(SUPABASE_FUNCTION_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "apikey": SUPABASE_PUBLISHABLE_KEY
        },
        body: JSON.stringify({
            action,
            name,
            access_code: accessCode
        })
    });

    let result;
    try {
        result = await response.json();
    } catch {
        throw new Error("The server returned an unreadable response.");
    }

    if (!response.ok || !result.success) {
        throw new Error(result.error || "The request could not be completed.");
    }
    return result;
}

// ==========================================
// 7. PARTICIPANT LOGIN
// ==========================================

async function loginParticipant() {
    const nameInput = document.getElementById("participantName");
    const codeInput = document.getElementById("accessCode");
    const button = document.getElementById("loginButton");
    const message = document.getElementById("loginMessage");

    const name = nameInput.value.trim();
    const code = codeInput.value.trim();

    message.textContent = "";

    if (!name || !code) {
        message.textContent = "Please choose your name and enter your access code.";
        return;
    }

    button.disabled = true;
    button.textContent = "CHECKING ACCESS...";

    try {
        const result = await callSecretGroove("status", name, code);
        currentParticipant = result.participant;
        currentAccessCode = code;

        document.getElementById("loginPanel").hidden = true;
        document.getElementById("wheelPanel").hidden = false;
        document.getElementById("welcomeParticipant").textContent =
            `WELCOME, ${currentParticipant.toUpperCase()}!`;

        const spinButton = document.getElementById("spinButton");
        spinButton.textContent = result.already_revealed
            ? "✦ SPIN TO VIEW YOUR RECIPIENT ✦"
            : "✦ SPIN THE WHEEL ✦";

        document.getElementById("wheelMessage").textContent =
            result.already_revealed
                ? "Your recipient has already been revealed. Spin to view the same recipient again."
                : "Your secret recipient is waiting!";

        wheelRotation = 0;
        const canvas = document.getElementById("secretWheel");
        canvas.style.transition = "none";
        canvas.style.transform = "rotate(0deg)";
        drawSecretWheel();
    } catch (error) {
        message.textContent = error.message;
    } finally {
        button.disabled = false;
        button.textContent = "✦ ENTER SECRET GROOVE ✦";
    }
}

// ==========================================
// 8. SPIN TO REVEAL THE LOCKED RECIPIENT
// ==========================================

async function spinSecretWheel() {
    if (wheelSpinning || !currentParticipant || !currentAccessCode) return;

    const wheel = document.getElementById("secretWheel");
    const button = document.getElementById("spinButton");
    const message = document.getElementById("wheelMessage");

    wheelSpinning = true;
    button.disabled = true;
    button.textContent = "🪩 SPINNING...";
    message.textContent = "Connecting to your secret assignment...";

    try {
        // The server returns the already-locked recipient for this giver.
        const result = await callSecretGroove(
            "reveal",
            currentParticipant,
            currentAccessCode
        );

        const selectedIndex = familyNames.indexOf(result.recipient);
        if (selectedIndex === -1) {
            throw new Error("The assigned recipient was not found on the wheel.");
        }

        const slice = 360 / familyNames.length;
        const targetAngle = 360 - (selectedIndex * slice + slice / 2);
        const currentAngle = wheelRotation % 360;
        const adjustment = (targetAngle - currentAngle + 360) % 360;

        wheelRotation += 360 * 6 + adjustment;

        wheel.style.transition =
            "transform 5.2s cubic-bezier(0.15, 0.75, 0.15, 1)";
        wheel.style.transform = `rotate(${wheelRotation}deg)`;

        message.textContent = "The wheel is revealing your secret recipient...";

        window.setTimeout(() => {
            message.replaceChildren();
            const heading = document.createElement("span");
            heading.textContent = "🎉 YOUR SECRET SOMEONE IS 🎉";
            const recipient = document.createElement("strong");
            recipient.textContent = result.recipient;
            message.append(heading, recipient);

            button.disabled = false;
            button.textContent = "✦ SPIN TO VIEW AGAIN ✦";
            wheelSpinning = false;
        }, 5350);
    } catch (error) {
        message.textContent = error.message;
        button.disabled = false;
        button.textContent = "✦ TRY AGAIN ✦";
        wheelSpinning = false;
    }
}

// ==========================================
// 9. LOG OUT
// ==========================================

function logoutParticipant() {
    currentParticipant = null;
    currentAccessCode = null;
    wheelSpinning = false;
    wheelRotation = 0;

    document.getElementById("wheelPanel").hidden = true;
    document.getElementById("loginPanel").hidden = false;
    document.getElementById("participantName").value = "";
    document.getElementById("accessCode").value = "";
    document.getElementById("loginMessage").textContent = "";
    document.getElementById("loginButton").disabled = false;
    document.getElementById("loginButton").textContent = "✦ ENTER SECRET GROOVE ✦";
}


// ==========================================
// 10. MEMORY LANE
// ==========================================

const MEMORY_LANE_FUNCTION_URL =
    "https://zsxtwvjuvfsjlkzmumpx.supabase.co/functions/v1/memory-lane";

async function callMemoryLane(action, payload = {}) {
    const response = await fetch(MEMORY_LANE_FUNCTION_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "apikey": SUPABASE_PUBLISHABLE_KEY
        },
        body: JSON.stringify({ action, ...payload })
    });

    let result;
    try {
        result = await response.json();
    } catch {
        throw new Error("The server returned an unreadable response.");
    }

    if (!response.ok) {
        throw new Error(result.error || "The request could not be completed.");
    }

    return result;
}

async function loadMemoryGallery() {
    const gallery = document.getElementById("memoryGallery");
    if (!gallery) return;

    gallery.innerHTML = '<p class="memory-gallery-status">Loading family memories...</p>';

    try {
        const result = await callMemoryLane("gallery");
        gallery.replaceChildren();

        if (!result.memories || result.memories.length === 0) {
            gallery.innerHTML = '<p class="memory-gallery-status">Our gallery is waiting for its first approved memories. Be the first to share one! ✨</p>';
            return;
        }

        result.memories.forEach(memory => {
            const card = document.createElement("article");
            card.className = "memory-photo-card";

            const image = document.createElement("img");
            image.src = memory.image_url;
            image.alt = memory.caption || `A family memory shared by ${memory.submitter_name}`;
            image.loading = "lazy";

            const details = document.createElement("div");
            details.className = "memory-photo-details";

            const name = document.createElement("h4");
            name.textContent = memory.submitter_name;

            const caption = document.createElement("p");
            caption.textContent = memory.caption || "A special family moment.";

            details.append(name, caption);
            card.append(image, details);
            gallery.append(card);
        });
    } catch (error) {
        gallery.innerHTML = "";
        const message = document.createElement("p");
        message.className = "memory-gallery-status";
        message.textContent = error.message || "The gallery could not be loaded. Please try again later.";
        gallery.append(message);
    }
}

async function submitMemoryPhoto(event) {
    event.preventDefault();

    const form = document.getElementById("memoryUploadForm");
    const button = document.getElementById("memorySubmitButton");
    const message = document.getElementById("memoryUploadMessage");
    const photoInput = document.getElementById("memoryPhoto");
    const file = photoInput.files[0];

    message.textContent = "";

    if (!file) {
        message.textContent = "Please choose a photo first.";
        return;
    }

    if (file.size > 8 * 1024 * 1024) {
        message.textContent = "Your photo must be 8 MB or smaller.";
        return;
    }

    const formData = new FormData();
    formData.append("name", document.getElementById("memoryName").value);
    formData.append("access_code", document.getElementById("memoryCode").value);
    formData.append("caption", document.getElementById("memoryCaption").value);
    formData.append("file", file);

    button.disabled = true;
    button.textContent = "UPLOADING YOUR MEMORY...";

    try {
        const response = await fetch(MEMORY_LANE_FUNCTION_URL, {
            method: "POST",
            headers: { "apikey": SUPABASE_PUBLISHABLE_KEY },
            body: formData
        });

        let result;
        try {
            result = await response.json();
        } catch {
            throw new Error("The server returned an unreadable response.");
        }

        if (!response.ok || !result.success) {
            throw new Error(result.error || "Your photo could not be submitted.");
        }

        message.textContent = "✓ " + result.message;
        message.classList.add("success");
        form.reset();
    } catch (error) {
        message.textContent = error.message;
        message.classList.remove("success");
    } finally {
        button.disabled = false;
        button.textContent = "✦ SEND TO MEMORY LANE ✦";
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const memoryForm = document.getElementById("memoryUploadForm");
    if (memoryForm) {
        memoryForm.addEventListener("submit", submitMemoryPhoto);
    }

    const memorySection = document.getElementById("memoryLane");
    if (memorySection) {
        const memoryObserver = new MutationObserver(() => {
            if (memorySection.style.display !== "none") {
                loadMemoryGallery();
            }
        });
        memoryObserver.observe(memorySection, {
            attributes: true,
            attributeFilter: ["style"]
        });
    }
});

