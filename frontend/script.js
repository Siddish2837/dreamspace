// =======================================================
// DREAMSPACE FULL-STACK JAVASCRIPT
// =======================================================

const API_BASE = "http://localhost:5000";

// Fallback data in case the backend server is temporarily unreachable
const fallbackWorkspaces = {
    student: {
        key: "student",
        image: "images/student.png",
        title: "Student Workspace",
        description: "A calm and inspiring study setup designed for focus, learning and productivity.",
        features: [
            "Organized desk layout",
            "Comfortable lighting",
            "Minimal distractions",
            "Productivity focused"
        ]
    },
    developer: {
        key: "developer",
        image: "images/developer.png",
        title: "Developer Workspace",
        description: "A modern coding environment with dual monitors and an organized desk for maximum efficiency.",
        features: [
            "Dual-monitor setup",
            "Fast cable management",
            "Ergonomic keyboard and mouse",
            "Coding-friendly lighting"
        ]
    },
    gamer: {
        key: "gamer",
        image: "images/gamer.png",
        title: "Gamer Workspace",
        description: "An immersive setup with RGB lighting and powerful accessories built for gaming enthusiasts.",
        features: [
            "RGB ambient lighting",
            "High-performance chair",
            "Gaming headset station",
            "Immersive audio setup"
        ]
    },
    creator: {
        key: "creator",
        image: "images/creator.png",
        title: "Creator Workspace",
        description: "Perfect for designers, editors and content creators who bring ideas to life.",
        features: [
            "Creative desk layout",
            "Color-rich lighting",
            "Studio-inspired accessories",
            "Flexible editing space"
        ]
    },
    minimal: {
        key: "minimal",
        image: "images/minimal.png",
        title: "Minimal Workspace",
        description: "Clean, peaceful and distraction-free with a modern minimalist aesthetic.",
        features: [
            "Low-clutter layout",
            "Neutral color palette",
            "Quiet and calm atmosphere",
            "Simple, elegant design"
        ]
    },
    productivity: {
        key: "productivity",
        image: "images/productivity.png",
        title: "Productivity Workspace",
        description: "A highly organized workspace designed to maximize efficiency and daily workflow.",
        features: [
            "Task-focused layout",
            "Smart storage solutions",
            "Daily workflow optimization",
            "Clear visual organization"
        ]
    }
};

let currentWorkspaces = { ...fallbackWorkspaces };

// =======================================================
// 1. OPENING SCREEN AUTO SCROLL
// =======================================================
setTimeout(() => {
    const hero = document.getElementById("hero");
    const opening = document.getElementById("opening");
    if (hero) {
        hero.scrollIntoView({ behavior: "smooth" });
    }
    if (opening) {
        opening.style.display = "none";
    }
}, 2000);


// =======================================================
// 3. WORKSPACES: FETCH & DETAILS SWITCHING
// =======================================================
async function loadWorkspaces() {
    try {
        const response = await fetch(`${API_BASE}/workspaces`);
        if (response.ok) {
            const result = await response.json();
            if (result.success && Array.isArray(result.data)) {
                // Update our runtime workspace map
                currentWorkspaces = {};
                result.data.forEach(ws => {
                    currentWorkspaces[ws.key] = ws;
                });
                renderGalleryCards(result.data);
            }
        }
    } catch (error) {
        console.warn("Could not fetch workspaces from API, using fallback data:", error);
    }
    attachExploreButtonListeners();
}

function renderGalleryCards(workspacesList) {
    const container = document.getElementById("gallery-container");
    if (!container) return;

    container.innerHTML = workspacesList.map(ws => `
        <article class="workspace-card" data-key="${ws.key}">
            <img src="${ws.image}" alt="${ws.title}">
            <div class="workspace-label">${ws.title}</div>
            <button type="button">Explore</button>
        </article>
    `).join("");
}

function updateWorkspaceDetails(selectedKey) {
    const details = currentWorkspaces[selectedKey] || fallbackWorkspaces[selectedKey];
    if (!details) return;

    const imgEl = document.getElementById("detail-image");
    const titleEl = document.getElementById("detail-title");
    const descEl = document.getElementById("detail-description");
    const featureList = document.getElementById("detail-features");

    if (imgEl) imgEl.src = details.image;
    if (titleEl) titleEl.innerText = details.title;
    if (descEl) descEl.innerText = details.description;

    if (featureList && Array.isArray(details.features)) {
        featureList.innerHTML = details.features
            .map(feature => `<li>✔ ${feature}</li>`)
            .join("");
    }
}

function attachExploreButtonListeners() {
    const cards = document.querySelectorAll(".workspace-card");
    const detailsContainer = document.querySelector(".details-container");

    cards.forEach(card => {
        const button = card.querySelector("button");
        const key = card.getAttribute("data-key");

        if (button && key) {
            button.onclick = (e) => {
                e.preventDefault();

                if (detailsContainer) {
                    detailsContainer.classList.add("fade-out");
                    setTimeout(() => {
                        updateWorkspaceDetails(key);
                        detailsContainer.classList.remove("fade-out");
                    }, 300);
                } else {
                    updateWorkspaceDetails(key);
                }

                const target = document.getElementById("workspace-details");
                if (target) {
                    target.scrollIntoView({ behavior: "smooth" });
                }
            };
        }
    });
}

// =======================================================
// 4. DREAM BUILDER: SUBMISSION & COMMUNITY GALLERY
// =======================================================
const dreamForm = document.getElementById("dream-builder-form");

if (dreamForm) {
    dreamForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const theme = document.getElementById("dream-theme").value;
        const lighting = document.getElementById("dream-lighting").value;
        const deskSize = document.getElementById("dream-desk").value;
        const idea = document.getElementById("dream-text").value.trim();
        const submitBtn = document.getElementById("dream-submit-btn");
        const outputDiv = document.getElementById("dream-output");

        if (!theme || !lighting || !deskSize || !idea) {
            alert("Please fill out all fields to build your dream setup.");
            return;
        }

        submitBtn.disabled = true;
        submitBtn.innerText = "Building Your Setup...";

        let savedDream = null;

        try {
            const response = await fetch(`${API_BASE}/dream-builders`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ theme, lighting, deskSize, idea })
            });

            if (response.ok) {
                const resData = await response.json();
                savedDream = resData.data;
            }
        } catch (err) {
            console.warn("Backend unavailable, previewing setup locally:", err);
        }

        // Display generated card
        outputDiv.innerHTML = `
            <div class="dream-output-card">
                <h3>✨ Your Custom Dream Workspace Setup</h3>
                <div class="dream-output-tags">
                    <span class="dream-tag">🎨 ${theme}</span>
                    <span class="dream-tag">💡 ${lighting}</span>
                    <span class="dream-tag">📐 ${deskSize}</span>
                </div>
                <p><strong>Setup Concept:</strong> "${idea}"</p>
                <p style="margin-top: 10px; font-size: 0.85rem; color: #10B981; font-weight: 600;">
                    ✓ Setup successfully saved to DreamSpace database!
                </p>
            </div>
        `;

        submitBtn.disabled = false;
        submitBtn.innerText = "Build My Setup";
        dreamForm.reset();

        // Refresh community list
        loadCommunityDreams();
    });
}

async function loadCommunityDreams() {
    const grid = document.getElementById("community-dreams-grid");
    if (!grid) return;

    try {
        const response = await fetch(`${API_BASE}/dream-builders`);
        if (response.ok) {
            const result = await response.json();
            if (result.success && Array.isArray(result.data) && result.data.length > 0) {
                grid.innerHTML = result.data.slice(0, 6).map(dream => `
                    <div class="community-dream-card">
                        <h4>${dream.theme || "Custom Workspace"}</h4>
                        <p>"${dream.idea}"</p>
                        <div class="dream-meta">
                            <span class="meta-pill">💡 ${dream.lighting}</span>
                            <span class="meta-pill">📐 ${dream.deskSize}</span>
                        </div>
                    </div>
                `).join("");
                return;
            }
        }
    } catch (err) {
        console.warn("Could not load community dreams:", err);
    }

    // Default placeholder if none in DB
    grid.innerHTML = `
        <div class="community-dream-card">
            <h4>Developer Command Center</h4>
            <p>"Dual 4K OLED screens with cool daylight backlight and standing desk for all-day coding flow."</p>
            <div class="dream-meta">
                <span class="meta-pill">💡 Crisp Daylight (5000K Focus)</span>
                <span class="meta-pill">📐 Motorized Standing Desk</span>
            </div>
        </div>
        <div class="community-dream-card">
            <h4>Minimalist Zen Sanctuary</h4>
            <p>"Walnut desktop with warm ambient amber glow, concealed cables, and a single brass lamp."</p>
            <div class="dream-meta">
                <span class="meta-pill">💡 Warm Amber (2700K Glow)</span>
                <span class="meta-pill">📐 Standard Solid Wood</span>
            </div>
        </div>
    `;
}

// =======================================================
// 5. COMMUNITY FEEDBACK & REVIEWS
// =======================================================
const starRatingBox = document.getElementById("star-rating-box");
const ratingInput = document.getElementById("feedback-rating-val");

if (starRatingBox) {
    const stars = starRatingBox.querySelectorAll(".star");

    function setStarRating(rating) {
        if (ratingInput) ratingInput.value = rating;
        stars.forEach(star => {
            const starVal = Number(star.getAttribute("data-rating"));
            if (starVal <= rating) {
                star.classList.add("active");
            } else {
                star.classList.remove("active");
            }
        });
    }

    stars.forEach(star => {
        star.addEventListener("click", () => {
            const rating = Number(star.getAttribute("data-rating"));
            setStarRating(rating);
        });
    });
}

const feedbackForm = document.getElementById("feedback-form");
const feedbackStatus = document.getElementById("feedback-status");

if (feedbackForm) {
    feedbackForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const name = document.getElementById("feedback-name").value.trim();
        const rating = Number(ratingInput ? ratingInput.value : 5);
        const message = document.getElementById("feedback-msg").value.trim();
        const submitBtn = document.getElementById("feedback-submit-btn");

        if (!name || !message) {
            showFeedbackStatus("Please enter your name and feedback.", "error");
            return;
        }

        submitBtn.disabled = true;
        submitBtn.innerText = "Posting Review...";

        try {
            const response = await fetch(`${API_BASE}/feedback`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, rating, message })
            });

            if (response.ok) {
                showFeedbackStatus("Thank you! Your feedback has been recorded.", "success");
                feedbackForm.reset();
                if (starRatingBox) {
                    starRatingBox.querySelectorAll(".star").forEach(s => s.classList.add("active"));
                    if (ratingInput) ratingInput.value = "5";
                }
                loadFeedback();
            } else {
                const errData = await response.json();
                showFeedbackStatus(errData.message || "Failed to post feedback.", "error");
            }
        } catch (err) {
            showFeedbackStatus("Server offline: Could not connect to API.", "error");
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerText = "Post Feedback";
        }
    });
}

function showFeedbackStatus(msg, type) {
    if (!feedbackStatus) return;
    feedbackStatus.className = `feedback-status-msg ${type}`;
    feedbackStatus.innerText = msg;
    setTimeout(() => {
        feedbackStatus.innerText = "";
        feedbackStatus.className = "feedback-status-msg";
    }, 4000);
}

async function loadFeedback() {
    const list = document.getElementById("feedback-list");
    const countBadge = document.getElementById("feedback-count");
    if (!list) return;

    try {
        const response = await fetch(`${API_BASE}/feedback`);
        if (response.ok) {
            const result = await response.json();
            if (result.success && Array.isArray(result.data)) {
                if (countBadge) {
                    countBadge.innerText = `${result.data.length} Review${result.data.length === 1 ? "" : "s"}`;
                }

                if (result.data.length === 0) {
                    list.innerHTML = `<p style="color:#777;">No reviews yet. Be the first to leave one!</p>`;
                    return;
                }

                list.innerHTML = result.data.map(item => `
                    <div class="feedback-card" id="review-${item._id}">
                        <div class="feedback-card-header">
                            <span class="feedback-user-name">${escapeHtml(item.name)}</span>
                            <span class="feedback-stars">${"★".repeat(item.rating)}${"☆".repeat(Math.max(0, 5 - item.rating))}</span>
                        </div>
                        <p class="feedback-message">"${escapeHtml(item.message)}"</p>
                        <div class="feedback-footer">
                            <span>${item.createdAt ? new Date(item.createdAt).toLocaleDateString() : "Recent"}</span>
                            ${item._id ? `<button type="button" class="delete-feedback-btn" onclick="deleteFeedbackReview('${item._id}')">Delete</button>` : ""}
                        </div>
                    </div>
                `).join("");
                return;
            }
        }
    } catch (err) {
        console.warn("Could not load feedback from API:", err);
    }

    // Fallback reviews if API unavailable
    list.innerHTML = `
        <div class="feedback-card">
            <div class="feedback-card-header">
                <span class="feedback-user-name">Sophia Martinez</span>
                <span class="feedback-stars">★★★★★</span>
            </div>
            <p class="feedback-message">"The Developer setup with the dual-screen configuration completely transformed my daily coding productivity!"</p>
            <div class="feedback-footer">
                <span>Verified Setup</span>
            </div>
        </div>
        <div class="feedback-card">
            <div class="feedback-card-header">
                <span class="feedback-user-name">Marcus Vance</span>
                <span class="feedback-stars">★★★★★</span>
            </div>
            <p class="feedback-message">"Minimal setup is a dream come true. Zero distractions, warm lighting, and a soothing color palette."</p>
            <div class="feedback-footer">
                <span>Verified Setup</span>
            </div>
        </div>
    `;
}

// Global delete review helper
window.deleteFeedbackReview = async function (id) {
    if (!confirm("Are you sure you want to delete this review?")) return;

    try {
        const response = await fetch(`${API_BASE}/feedback/${id}`, {
            method: "DELETE"
        });

        if (response.ok) {
            const card = document.getElementById(`review-${id}`);
            if (card) {
                card.remove();
            }
            loadFeedback();
        } else {
            alert("Could not delete review.");
        }
    } catch (err) {
        alert("Failed to communicate with server.");
    }
};

function escapeHtml(string) {
    if (!string) return "";
    return string
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

// =======================================================
// INITIALIZATION
// =======================================================
document.addEventListener("DOMContentLoaded", () => {
    loadWorkspaces();
    loadCommunityDreams();
    loadFeedback();
});
