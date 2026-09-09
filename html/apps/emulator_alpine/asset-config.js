window.WebOSAlpine = Object.freeze({
    asset(name) {
        return new URL(name, document.baseURI).href;
    }
});
