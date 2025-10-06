// IMPORTS PARA FCM (compat)
importScripts('https://www.gstatic.com/firebasejs/10.12.3/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.3/firebase-messaging-compat.js');

// Pega tu mismo firebaseConfig:
firebase.initializeApp({
  apiKey: "AIzaSyDSLfHxH1FaNEDOb9l-gb2Ocches1VG6fA",
  authDomain: "perritas-andon.firebaseapp.com",
  projectId: "perritas-andon",
  storageBucket: "perritas-andon.firebasestorage.app",
  messagingSenderId: "202024461735",
  appId: "1:202024461735:web:8342da996a90bf2850c282"
});

const messaging = firebase.messaging();
messaging.onBackgroundMessage((payload) => {
  self.registration.showNotification(
    payload.notification?.title || 'Andon Perritas',
    {
      body: payload.notification?.body || 'Recordatorio',
      icon: '/icons/icon-192.png',
      badge: '/icons/badge-72.png'
    }
  );
});

// sw.js — caché básico + (luego) handler de push
const CACHE = 'andon-v2';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icons/icon-192.png',
  './icons/icon-512.png'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
  self.skipWaiting();
});
self.addEventListener('activate', e => self.clients.claim());
self.addEventListener('fetch', e => {
  e.respondWith(
    fetch(e.request).catch(() => caches.match(e.request))
  );
});
