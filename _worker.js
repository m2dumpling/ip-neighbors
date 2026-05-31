/**
 * IP 邻居 — Meituan API CORS 代理
 * 用法：
 *   /?url=<encoded_url>    代理任意美团 API
 *   /?ip=54.70.174.10      快捷 IP 定位
 *   /?lat=23.1&lng=113.3   快捷逆地理编码
 */
addEventListener("fetch", (event) => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  const url = new URL(request.url);

  if (request.method === "OPTIONS") {
    return new Response(null, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, OPTIONS",
        "Access-Control-Max-Age": "86400",
      },
    });
  }

  let target;

  // 快捷方式：/ ？ip=1.2.3.4
  const ip = url.searchParams.get("ip");
  if (ip) {
    target = `https://apimobile.meituan.com/locate/v2/ip/loc?rgeo=true&ip=${ip}`;
  }

  // 快捷方式：/ ？lat=23.1&lng=113.3
  const lat = url.searchParams.get("lat");
  const lng = url.searchParams.get("lng");
  if (!target && lat && lng) {
    target = `https://apimobile.meituan.com/group/v1/city/latlng/${lat},${lng}?tag=0`;
  }

  // 通用代理：/ ？url=<encoded_url>
  if (!target) {
    const raw = url.searchParams.get("url");
    if (!raw) {
      return respond({ error: "缺少参数：ip / lat+lng / url" }, 400);
    }
    target = raw;
  }

  try {
    const resp = await fetch(target, {
      headers: { Accept: "application/json", "User-Agent": "Mozilla/5.0" },
    });
    const body = await resp.text();
    return new Response(body, {
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (e) {
    return respond({ error: e.message }, 502);
  }
}

function respond(data, status) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
  });
}
