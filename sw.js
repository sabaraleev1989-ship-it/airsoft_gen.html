const CACHE_NAME = 'scorpion-gen-v4.1'; // Обновляем версию для синхронизации

const assets = [
  './',
  './index.html',
  './icon.png',
  './sw.js'
];

// Установка: кэшируем новые файлы
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Scorpion.Gen v4.1: Кэширование ресурсов...');
      return cache.addAll(assets);
    })
  );
  self.skipWaiting();
});

// Активация: УДАЛЯЕМ старый кэш v4.0 и ниже
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
