(() => {
    const root = document.documentElement;
    const launch = new URLSearchParams(location.hash.slice(1));
    if (launch.has("WebAppData") || launch.has("WebAppPlatform")) root.classList.add("in-max");
    const systemTheme = window.matchMedia("(prefers-color-scheme: dark)");
    const storageKey = "stukach-theme";
    let preference;
    try {
        preference = localStorage.getItem(storageKey);
    } catch {}

    function applyTheme() {
        const theme = preference === "light" || preference === "dark"
            ? preference : systemTheme.matches ? "dark" : "light";
        root.dataset.theme = theme;
        const dark = theme === "dark";
        for (const meta of document.querySelectorAll('meta[name="theme-color"]')) {
            meta.removeAttribute("media");
            meta.content = dark ? "#0B111C" : "#BFE8FC";
        }
        const button = document.getElementById("toggle-theme");
        if (button) {
            const label = dark ? "Включить светлую тему" : "Включить тёмную тему";
            button.setAttribute("aria-label", label);
            button.setAttribute("aria-pressed", String(dark));
            button.title = label;
        }
    }

    applyTheme();
    systemTheme.addEventListener("change", applyTheme);
    window.addEventListener("storage", (event) => {
        if (event.key === storageKey || event.key === null) {
            preference = event.key === null ? null : event.newValue;
            applyTheme();
        }
    });
    document.addEventListener("DOMContentLoaded", () => {
        applyTheme();
        document.getElementById("toggle-theme")?.addEventListener("click", () => {
            preference = root.dataset.theme === "dark" ? "light" : "dark";
            try {
                localStorage.setItem(storageKey, preference);
            } catch {}
            applyTheme();
        });
    });
})();
