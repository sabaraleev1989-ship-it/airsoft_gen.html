const CACHE_NAME = 'scorpion-gen-v3.5'; // Новая версия!

const assets = [
  './',
  './index.html',
  './icon.png',
  './sw.js'
];

// Установка: закачиваем новые файлы
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Scorpion.Gen v3.5: Кэширование...');
      return cache.addAll(assets);
    })
  );
  self.skipWaiting();
});

// Активация: УДАЛЯЕМ всё старое (v2.5, v3.0 и т.д.)
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

// Работа в оффлайне
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request);
    })
  );
});
