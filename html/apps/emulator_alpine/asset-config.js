window.WebOSAlpine = Object.freeze({
    defaultIsoUrl: "https://media.githubusercontent.com/media/xily-random-account/WebOS/main/html/apps/emulator_alpine/alpine.iso",
    asset(name) {
        return new URL(name, document.baseURI).href;
    }
});
