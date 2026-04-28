// Название кэша — меняй версию (v2.2, v2.3 и т.д.), когда обновляешь код
const CACHE_NAME = 'scorpion-gen-v2.5';

// Список файлов для полной работы в оффлайне
const assets = [
  './',
  './index.html',
  './icon.png',
  './sw.js'
];

// 1. Установка: скачиваем файлы в память телефона
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Scorpion.Gen: Файлы кэшированы');
      return cache.addAll(assets);
    })
  );
  // Активируем Service Worker сразу, не дожидаясь перезагрузки
  self.skipWaiting();
});

// 2. Активация: удаляем старый кэш предыдущих версий
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
  // Заставляем Service Worker сразу начать контролировать страницу
  self.clients.claim();
});

// 3. Работа с запросами: стратегия "Сначала сеть, если нет связи — кэш"
// Это лучший вариант для обновляемых сценариев
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request);
    })
  );
});
