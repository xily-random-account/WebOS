// app.js (or inside your main index.html)
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('../sw.js')
      .then(reg => console.log('WebOS Kernel (Service Worker) registered!', reg.scope))
      .catch(err => console.error('Service Worker registration failed:', err));
  });
}
