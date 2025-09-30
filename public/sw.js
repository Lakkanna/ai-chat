const CACHE_NAME = "noobs-today-v1";
const STATIC_CACHE_URLS = [
  "/",
  "/chat",
  "/diet",
  "/diet/goals",
  "/diet/weekly",
  "/diet/monthly",
  "/diet/weight",
  "/manifest.json",
  "/offline.html",
  "/icons/icon.svg",
  "/favicon.ico",
];

// Install event - cache static assets
self.addEventListener("install", (event) => {
  console.log("Service Worker: Installing...");
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        console.log("Service Worker: Caching static assets");
        return cache.addAll(STATIC_CACHE_URLS);
      })
      .then(() => {
        console.log("Service Worker: Installation complete");
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error("Service Worker: Installation failed", error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  console.log("Service Worker: Activating...");
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              console.log("Service Worker: Deleting old cache", cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log("Service Worker: Activation complete");
        return self.clients.claim();
      })
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener("fetch", (event) => {
  // Skip non-GET requests
  if (event.request.method !== "GET") {
    return;
  }

  // Skip external requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // Return cached version if available
      if (cachedResponse) {
        console.log("Service Worker: Serving from cache", event.request.url);
        return cachedResponse;
      }

      // Otherwise fetch from network
      console.log("Service Worker: Fetching from network", event.request.url);
      return fetch(event.request)
        .then((response) => {
          // Don't cache non-successful responses
          if (
            !response ||
            response.status !== 200 ||
            response.type !== "basic"
          ) {
            return response;
          }

          // Clone the response for caching
          const responseToCache = response.clone();

          // Cache the response for future use
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });

          return response;
        })
        .catch((error) => {
          console.error("Service Worker: Fetch failed", error);

          // Return offline page for navigation requests
          if (event.request.destination === "document") {
            return caches.match("/offline.html");
          }

          throw error;
        });
    })
  );
});

// Handle background sync for offline data
self.addEventListener("sync", (event) => {
  console.log("Service Worker: Background sync triggered", event.tag);

  if (event.tag === "diet-data-sync") {
    event.waitUntil(syncDietData());
  }

  if (event.tag === "chat-data-sync") {
    event.waitUntil(syncChatData());
  }
});

// Sync diet data when back online
async function syncDietData() {
  try {
    console.log("Service Worker: Syncing diet data...");
    // Get offline diet data from IndexedDB
    const offlineData = await getOfflineDietData();

    if (offlineData && offlineData.length > 0) {
      // Sync with server
      for (const data of offlineData) {
        try {
          await fetch("/api/diet/sync", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          });

          // Remove from offline storage after successful sync
          await removeOfflineDietData(data.id);
        } catch (error) {
          console.error("Service Worker: Failed to sync diet data", error);
        }
      }
    }
  } catch (error) {
    console.error("Service Worker: Diet data sync failed", error);
  }
}

// Sync chat data when back online
async function syncChatData() {
  try {
    console.log("Service Worker: Syncing chat data...");
    // Get offline chat data from IndexedDB
    const offlineData = await getOfflineChatData();

    if (offlineData && offlineData.length > 0) {
      // Sync with server
      for (const data of offlineData) {
        try {
          await fetch("/api/chat/sync", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          });

          // Remove from offline storage after successful sync
          await removeOfflineChatData(data.id);
        } catch (error) {
          console.error("Service Worker: Failed to sync chat data", error);
        }
      }
    }
  } catch (error) {
    console.error("Service Worker: Chat data sync failed", error);
  }
}

// Helper functions for IndexedDB operations
async function getOfflineDietData() {
  // Implementation would depend on your IndexedDB setup
  return [];
}

async function removeOfflineDietData(id) {
  // Implementation would depend on your IndexedDB setup
  return;
}

async function getOfflineChatData() {
  // Implementation would depend on your IndexedDB setup
  return [];
}

async function removeOfflineChatData(id) {
  // Implementation would depend on your IndexedDB setup
  return;
}

// Handle push notifications
self.addEventListener("push", (event) => {
  console.log("Service Worker: Push notification received");

  const options = {
    body: event.data ? event.data.text() : "New notification from Noobs Today",
    icon: "/icons/icon.svg",
    badge: "/icons/icon.svg",
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1,
    },
    actions: [
      {
        action: "explore",
        title: "Open App",
        icon: "/icons/icon.svg",
      },
      {
        action: "close",
        title: "Close",
        icon: "/icons/icon.svg",
      },
    ],
  };

  event.waitUntil(self.registration.showNotification("Noobs Today", options));
});

// Handle notification clicks
self.addEventListener("notificationclick", (event) => {
  console.log("Service Worker: Notification clicked");

  event.notification.close();

  if (event.action === "explore") {
    event.waitUntil(clients.openWindow("/"));
  } else if (event.action === "close") {
    // Just close the notification
    return;
  } else {
    // Default action - open the app
    event.waitUntil(clients.openWindow("/"));
  }
});
