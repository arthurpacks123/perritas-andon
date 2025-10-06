// sw.js — caché básico + handler de push
const CACHE = 'andon-v3';   // ← súbelo para forzar update
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icons/icon-192.png',
  './icons/icon-512.png'
];

// ---- OFFLINE ----
self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
});
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
});
self.addEventListener('fetch', (e) => {
  e.respondWith(caches.match(e.request).then(r => r || fetch(e.request)));
});

// --- Firebase Messaging en background (compat) ---
importScripts('https://www.gstatic.com/firebasejs/10.12.3/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.3/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyDSLfHxH1FaNEDOb9l-gb2Ocches1VG6fA",
  authDomain: "perritas-andon.firebaseapp.com",
  projectId: "perritas-andon",
  storageBucket: "perritas-andon.firebasestorage.app",
  messagingSenderId: "202024461735",
  appId: "1:202024461735:web:8342da996a90bf2850c282",
  measurementId: "G-8L9B0HQLVW"
});

const messaging = firebase.messaging();

// Log para depurar en la consola del SW (Application → Service Workers → "Open DevTools")
messaging.onBackgroundMessage((payload) => {
  console.log('[sw] onBackgroundMessage', payload);

  const title = (payload.notification && payload.notification.title)
             || (payload.data && payload.data.title)
             || 'Andon Perritas';
  const body  = (payload.notification && payload.notification.body)
             || (payload.data && payload.data.body)
             || '';
  const icon  = (payload.notification && payload.notification.icon)
             || './icons/icon-192.png';
  const badge = './icons/icon-192.png';

  self.registration.showNotification(title, {
    body,
    icon,
    badge,
    vibrate: [200, 100, 200],
    tag: 'andon',
    renotify: true,
    data: payload.data || {}
  });
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = 'https://arthurpacks123.github.io/perritas-andon/';
  event.waitUntil(
    clients.matchAll({type: 'window', includeUncontrolled: true}).then(clientsArr => {
      for (const c of clientsArr) {
        if (c.url.startsWith(url)) { c.focus(); return; }
      }
      return clients.openWindow(url);
    })
  );
});
