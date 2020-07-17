/**
 * @module client/service-worker
 * @see https://developers.google.com/web/fundamentals/primers/service-workers
 */

/**
 * @typedef {ExtendableEvent} InstallEvent
 * @see https://developer.mozilla.org/en-US/docs/Web/API/InstallEvent
 * @see https://developer.mozilla.org/en-US/docs/Web/API/ExtendableEvent/waitUntil
 */

/**
 * @typedef {ExtendableEvent} FetchEvent
 * @see https://developer.mozilla.org/en-US/docs/Web/API/FetchEvent
 * @see https://developer.mozilla.org/en-US/docs/Web/API/FetchEvent/respondWith
 */

const CacheName = "VH-CACHE";

/**
 * I expect this to be driven off of a `Map.<url: string, hash: string>` which would itself be generated at build time.
 * Note, the hashes in the Map are not used directly by this service worker. However, they do cause the service worker
 * to be updated (because the text content of the service worker changes), triggering the `activate` event-handler
 * where we will bust all existing caches.
 *
 * @return {string} - list of URLs to be cached.
 */
// const getURLsToCache = () => Object.keys(CacheMap);




/*******************************************************
 * Install Service Worker                              *
 *******************************************************/
/**
 * Opens/Creates a cache and caches certain resources.
 * @see https://developer.mozilla.org/en-US/docs/Web/API/CacheStorage/open
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Cache/addAll
 * @returns {Promise}
 */
// const setUpCache = async () => {
//   const cache = await caches.open(CacheName);
//   return await cache.addAll(getURLsToCache());
// };

/**
 * Called when a service-worker is installed. This is the time to cache resources.
 * @see https://developers.google.com/web/fundamentals/primers/service-workers#install_a_service_worker
 * @param {InstallEvent} event
 */
// const onInstall = (event) => event.waitUntil(setUpCache());
// self.addEventListener("install", onInstall)




/*******************************************************
 * Fetch Resources                                     *
 *******************************************************/
/**
 * Returns the promise that may be passed to a FetchEvent:respondWith call.
 * @param {FetchEvent}
 * @returns {Promise}
 */
const getFromCache = async (event) => {
  console.log("[VHSW] getFromCache()");
  const cachedResponse = await caches.match(event.request);
  if (cachedResponse) {
    return cachedResponse;
  }

  const response = await fetch(event.request);
  if (!response || response.status !== 200 || response.type !== "basic") {
    return response;
  }

  // Thank you developers.google.com writer.
  // IMPORTANT: Clone the response. A response is a stream
  // and because we want the browser to consume the response
  // as well as the cache consuming the response, we need
  // to clone it so we have two streams.
  var responseToCache = response.clone();
  const cache = await caches.open(CacheName)
  await cache.put(event.request, responseToCache);
  return response;
};

/**
 * Intercepts a request and responds with the cached version, if present.
 * @param {FetchEvent}
 */
const onFetch = (event) => event.respondWith(getFromCache());
self.addEventListener("fetch", onFetch);




/*******************************************************
 * Update Service Worker                               *
 *******************************************************/
/**
 * @returns {Promise}
 */
const bustCache = async () => {
  console.log("[VHSW] bustCache()");
  const cacheNames = await caches.keys();
  await Promise.all(cacheNames.map(cacheName => caches.delete(cacheName)));
};

/**
 * Called when the service worker is updated. This happens whenever the service worker file itself (service-worker.js)
 * is modified. See developers.google.com article about service workers to understand the exact lifecycle.
 * 
 * @see https://developers.google.com/web/fundamentals/primers/service-workers#update-a-service-worker
 * @param {ExtendableEvent} event 
 */
const onActivate = (event) => event.waitUntil(bustCache());

console.log("[VHSW] Service worker loaded");
self.addEventListener("activate", onActivate);
