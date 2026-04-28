const CACHE_NAME = 'scorpion-gen-v4.0';

// Список файлов для кэширования
const assets = [
  './',
  './index.html',
  './icon.png',
  './sw.js'
];

// Установка: записываем файлы в память
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Scorpion.Gen v4.0: Кэш успешно создан');
      return cache.addAll(assets);
    })
  );
  self.skipWaiting();
});

// Активация: УДАЛЯЕМ старые версии кэша (v3.5, v3.0 и т.д.)
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

// Стратегия: Сначала смотрим в сеть, если интернета нет — берем из кэша
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request);
    })
  );
});
