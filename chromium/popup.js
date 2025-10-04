const bgPicker = document.getElementById("bgColor");
const fgPicker = document.getElementById("fgColor");
const applyBtn = document.getElementById("apply");
const themePicker = document.getElementById("theme-select");
const preview = document.getElementById("preview");
const bgIcon = document.getElementById("bgIcon");
const fgIcon = document.getElementById("fgIcon");
const status = document.getElementById("status");
const colorOptions = document.getElementById("colorOptions");

let bg;
let fg;

// Preset themes
const darkMode = {
    bg: "#000000",
    fg: "#ffffff",
};

const lightMode = {
    bg: "#ffffff",
    fg: "#000000",
};

const polyDarkMode = {
    bg: "#2b002b",
    fg: "#ffffff",
};

// TODO: Get default page colors so the user can reset to default
const defaultMode = {};

// Update preview display
function updatePreview() {
    preview.style.backgroundColor = bgPicker.value;
    preview.style.color = fgPicker.value;
    bgIcon.style.backgroundColor = bgPicker.value;
    fgIcon.style.backgroundColor = fgPicker.value;
}

// Show status message
function showStatus(message, type = 'success') {
    status.textContent = message;
    status.className = `status ${type} show`;
    setTimeout(() => {
        status.classList.remove('show');
    }, 2000);
}

// Load saved colors
chrome.storage.sync.get(["bgColor", "fgColor"], (data) => {
    if (data.bgColor) {
        bgPicker.value = data.bgColor;
    }
    if (data.fgColor) {
        fgPicker.value = data.fgColor;
    }
    updatePreview();
});

// Apply CSS to the active tab
function applyStyles(bg, fg) {
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
        chrome.scripting.insertCSS({
            target: {tabId: tabs[0].id},
            css: `
                body {
                    background-color: ${bg} !important;
                    color: ${fg} !important;
                }
            `
        });
    });
}

// Theme picker handler
themePicker.addEventListener("change", () => {
    const theme_choice = themePicker.value;

    // Show/hide color options based on theme selection
    if (theme_choice === "custom") {
        colorOptions.style.display = "block";
    } else {
        colorOptions.style.display = "none";
    }

    if (theme_choice === "dark") {
        bgPicker.value = darkMode.bg;
        fgPicker.value = darkMode.fg;
    }
    else if (theme_choice === "light") {
        bgPicker.value = lightMode.bg;
        fgPicker.value = lightMode.fg;
    }
    else if (theme_choice === "poly-dark-mode") {
        bgPicker.value = polyDarkMode.bg;
        fgPicker.value = polyDarkMode.fg;
    }
    // If "custom" is selected, leave current color picker values

    updatePreview();
});

// Color picker handlers for live preview
bgPicker.addEventListener("input", updatePreview);
fgPicker.addEventListener("input", updatePreview);

// Apply button handler
applyBtn.addEventListener("click", () => {
    const theme_choice = themePicker.value;

    // Check to see if the preset value is set to "custom", otherwise, prioritize default themes.
    if (theme_choice === "custom") {
        bg = bgPicker.value;
        fg = fgPicker.value;
    }
    else if (theme_choice === "dark") {
        bg = darkMode.bg;
        fg = darkMode.fg;
    }
    else if (theme_choice === "light") {
        bg = lightMode.bg;
        fg = lightMode.fg;
    }
    else if (theme_choice === "poly-dark-mode") {
        bg = polyDarkMode.bg;
        fg = polyDarkMode.fg;
    }

    // Save choices
    chrome.storage.sync.set({ bgColor: bg, fgColor: fg });

    // Apply to current page
    applyStyles(bg, fg);

    // Show success message
    showStatus('✓ Theme applied successfully!');
});

// Initialize preview
updatePreview();