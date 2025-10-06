// sw.js — caché básico + (luego) handler de push
const CACHE = 'andon-v2';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icons/icon-192.png',
  './icons/icon-512.png'
];
// --- Firebase Messaging en background (compat) ---
importScripts('https://www.gstatic.com/firebasejs/10.12.3/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.3/firebase-messaging-compat.js');

// Misma configuración que en index.html
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

// Cuando llega un push con la app cerrada o en 2º plano
messaging.onBackgroundMessage((payload) => {
  // Intenta usar primero notification del payload (Composer la manda)
  const title = (payload.notification && payload.notification.title) || (payload.data && payload.data.title) || 'Andon Perritas';
  const body  = (payload.notification && payload.notification.body)  || (payload.data && payload.data.body)  || '';
  const icon  = (payload.notification && payload.notification.icon)  || '/perritas-andon/icons/icon-192.png';
  const badge = '/perritas-andon/icons/icon-192.png';

  self.registration.showNotification(title, {
    body,
    icon,
    badge,
    vibrate: [200, 100, 200],
    tag: 'andon',       // si llega otra con el mismo tag, vuelve a notificar (renotify)
    renotify: true,
    data: payload.data || {}
  });
});

// Opcional: al tocar la notificación, abrir/enfocar la app
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

