const bgPicker = document.getElementById("bgColor");
const fgPicker = document.getElementById("fgColor");
const applyBtn = document.getElementById("apply");
const themePicker = document.getElementById("theme-select")

let bg;
let fg;

// TODO: USING PRESET THEMES AS GLOBAL VARS PLZ CHANGE THIS LATER!!! These could prob go in a json or something
// TODO: these are test colors, make actual themes for prod.
const darkMode = {
    bg: "#000000",
    fg: "#ffffff",
}

const lightMode = {
    bg: "#ffffff",
    fg: "#000000",
}

const polyDarkMode = {
    bg: "#2b002b",
    fg: "#ffffff",
}

// TODO: Get default page colors so the user can reset to default
const defaultMode = {}

// Load saved colors
chrome.storage.sync.get(["bgColor", "fgColor"], (data) => {
    if (data.bgColor) bgPicker.value = data.bgColor;
    if (data.fgColor) fgPicker.value = data.fgColor;
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

// Button handler
applyBtn.addEventListener("click", () => {

    // Check to see if the preset value is set to "custom", otherwise, prioritize default themes.
    if (themePicker.value === "custom") {
        bg = bgPicker.value;
        fg = fgPicker.value;

        // Save choices
        chrome.storage.sync.set({ bgColor: bg, fgColor: fg });

        // Apply to current page
        applyStyles(bg, fg);
    }

    const theme_choice = themePicker.value;
    if (theme_choice === "dark") {
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

    chrome.storage.sync.set({ bgColor: bg, fgColor: fg });

    applyStyles(bg, fg);

});