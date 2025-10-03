const bgPicker = document.getElementById("bgColor");
const fgPicker = document.getElementById("fgColor");
const applyBtn = document.getElementById("apply");
const themePicker = document.getElementById("theme-select")

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
    const bg = bgPicker.value;
    const fg = fgPicker.value;

    // Save choices
    chrome.storage.sync.set({ bgColor: bg, fgColor: fg });

    // Apply to current page
    applyStyles(bg, fg);
});

// TODO: USING DEFAULT THEMES AS GLOBAL VARS PLZ CHANGE THIS LATER!!!
    var

// Preset Theme Handler
themePicker.addEventListener("change", () => {
    const theme_choice = themePicker.value;
})
