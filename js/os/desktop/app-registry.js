(() => {
    const definitions = new Map();

    function register(definition) {
        definitions.set(definition.id, Object.freeze({ ...definition }));
    }

    function all() {
        return [...definitions.values()];
    }

    function launch(id, argument) {
        const definition = definitions.get(id);
        if (!definition) return window.createWindow("WebOS", "Unknown app: " + id);
        const handler = window[definition.handler];
        if (typeof handler !== "function") {
            return window.createWindow("WebOS", "App handler is unavailable: " + definition.name);
        }
        return handler(argument);
    }

    function render() {
        const grid = document.querySelector(".LauncherGrid");
        const dock = document.getElementById("dock");
        if (!grid || !dock) return;
        grid.replaceChildren();
        dock.replaceChildren();
        all().forEach((definition) => {
            const launcherButton = document.createElement("button");
            launcherButton.className = "AppIcon";
            launcherButton.type = "button";
            launcherButton.dataset.app = definition.id;
            launcherButton.innerHTML = `<strong>${definition.icon}</strong><span>${definition.name}</span><small>${definition.description}</small>`;
            launcherButton.addEventListener("click", () => launch(definition.id));
            grid.appendChild(launcherButton);
            if (definition.dock) {
                const dockButton = document.createElement("button");
                dockButton.className = "DockIcon";
                dockButton.type = "button";
                dockButton.title = definition.name;
                dockButton.textContent = definition.icon;
                dockButton.addEventListener("click", () => launch(definition.id));
                dock.appendChild(dockButton);
            }
        });
    }

    window.WebOSAppRegistry = Object.freeze({ register, all, launch, render });
})();
