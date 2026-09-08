window.onload = () => SpinnyCircle

function SpinnyCircle() {

}


class WebPopcornKernel {
    constructor() {
        this.modules = {};
        this.bootLogs = [];
        this.booted = false;

        if (localStorage.getItem("CryptoKey") == null || "") {
            console.error("No CrptoKey provided in LS, perhaps enter one to store securely.");
        }

    }

    boot() {
        log("booting system 'popcorn-web' please wait...")

        
    }

    requestStoragePermission() {
        // come back to.
    }

}

class WebPopcorn_VirtualFS {
    constructor(disk_drive_name) {
        console.log("WebPopcorn's VFS is loaded and in store...")
        this.ddn = disk_drive_name;

        if (this.ddn == "") {
            this.ddn = "Untitled FS"; 
            log("No name... Named to 'Untitled FS' ")
        }

        this.fs = [];
    }

    mkdir(path_name) {
        this.fs[path_name] = {};
    }

    write(path, data) {
        this.fs[path] = data;
    }

    read(path) {
        return this.fs[path];
    }

    list(path) {
        const folder = this.fs[path];
        return Object.keys(folder || {});
    }

}