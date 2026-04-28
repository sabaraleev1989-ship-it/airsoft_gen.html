const CACHE_NAME = 'scorpion-gen-v2.5';

// Список файлов для полной работы в оффлайне
const assets = [
  './',
  './index.html',
  './icon.png',
  './sw.js'
];

// Установка: скачиваем файлы в память телефона
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Scorpion.Gen: Ресурсы кэшированы');
      return cache.addAll(assets);
    })
  );
  self.skipWaiting();
});

// Активация: удаляем старый кэш
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

// Стратегия: Сначала сеть, если связи нет — Кэш
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request);
    })
  );
});
