// @ts-nocheck: This is javascript, stop complaining about any types
// Offline worker

const fallback =
  /*html*/ `<!DOCTYPE html><html lang=en><head><meta charset=UTF-8><link href=/favicon.png rel=icon><meta content="width=device-width,iniitial-scale=1"name=viewport><title>lAroma</title></head><body><span class=a>Entschuldigung</span><p class=b>Bitte verbinde dich mit dem Internet und versuche es dann erneut.</p></body><style>body{height:100vh;width:100vw;margin:0;display:block;overflow:hidden!important;font-family:ui-sans-serif,system-ui,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji";text-align:center;color:#fff;background:linear-gradient(0deg,#660080 35%,#330080 100%);font-size:48px;line-height:1}.b{color:oklch(.827 .119 306.383);font-size:24px;line-height:1.3333}</style></html>`;

const putInCache = async (request, response) => {
  const cache = await caches.open("v1");
  await cache.put(request, response);
};

async function cacheFetch(request) {
  const responseFromCache = await caches.match(request);
  if (responseFromCache) {
    return responseFromCache;
  }

  try {
    const responseFromNetwork = await fetch(request);

    putInCache(request, responseFromNetwork.clone());

    return responseFromNetwork;
  } catch {
    return new Response(
      fallback,
      {
        status: 408,
        headers: { "Content-Type": "text/html" },
      },
    );
  }
}

self.addEventListener("fetch", (event) => {
  event.respondWith(
    cacheFetch(
      event.request,
    ),
  );
});

self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", () => {
  clients.claim();
});

self.addEventListener("periodicsync", (e) => {
  if (e.tag === "check-study-time") {
    checkStudyTimeAndNotify();
  }
});

self.addEventListener("message", (event) => {
  switch (event.data.action) {
    case "invalidateCache": {
      console.log("Invalidating cache...");

      caches.keys().then((keys) => keys.map((key) => caches.delete(key)));

      break;
    }
  }
});