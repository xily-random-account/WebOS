# WebOS
> A literal OS in a browser, powered by pure html, css, js, and WASM!

## About WebOS
The Linux terminal runs an Alpine Linux x86 userspace in the browser with CheerpX. This is currently a work in progress.

### CheerpX deployment requirement

CheerpX requires `SharedArrayBuffer`, so the emulator route must be served with these headers:

```text
Cross-Origin-Opener-Policy: same-origin
Cross-Origin-Embedder-Policy: require-corp
```

The included `vercel.json` applies them to the Alpine emulator route. Use HTTPS in production; localhost development also requires both headers.

## Credited and By?
This is an idea created by [XiLy](https://GitHub.com/xi-self13) who owns [OpenFiddles](https://GitHub.com/OpenFiddles).
