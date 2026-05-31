/**
 * IP 邻居 — Meituan API CORS 代理
 * 端点:
 *   /?ip=1.2.3.4              单个 IP 定位
 *   /?lat=23.1&lng=113.3       逆地理编码
 *   /?batch=1.2.3.4,1.2.3.5    批量 IP 定位（逗号分隔，建议≤50）
 */
addEventListener("fetch", (event) => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  const url = new URL(request.url);

  if (request.method === "OPTIONS") {
    return new Response(null, {
      headers: { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Methods": "GET, OPTIONS", "Access-Control-Max-Age": "86400" },
    });
  }

  // ── 批量 IP 定位 ──
  const batch = url.searchParams.get("batch");
  if (batch) {
    const ips = batch.split(",").map(s => s.trim()).filter(Boolean);
    if (ips.length > 60) {
      return json({ error: "最多 60 个 IP" }, 400);
    }
    const results = await Promise.all(
      ips.map(async (ip) => {
        try {
          const resp = await fetch(`https://apimobile.meituan.com/locate/v2/ip/loc?rgeo=true&ip=${ip}`, {
            headers: { Accept: "application/json", "User-Agent": "Mozilla/5.0" },
          });
          const data = await resp.json();
          return { ip, data };
        } catch (e) {
          return { ip, error: e.message };
        }
      })
    );
    return new Response(JSON.stringify(results), {
      headers: cors({ "Content-Type": "application/json" }),
    });
  }

  // ── 单个 IP 定位 ──
  const ip = url.searchParams.get("ip");
  if (ip) {
    return proxy(`https://apimobile.meituan.com/locate/v2/ip/loc?rgeo=true&ip=${ip}`);
  }

  // ── 逆地理编码 ──
  const lat = url.searchParams.get("lat");
  const lng = url.searchParams.get("lng");
  if (lat && lng) {
    return proxy(`https://apimobile.meituan.com/group/v1/city/latlng/${lat},${lng}?tag=0`);
  }

  // ── 通用代理 ──
  const raw = url.searchParams.get("url");
  if (raw) return proxy(raw);

  return json({ error: "参数: ip / lat+lng / batch" }, 400);
}

async function proxy(target) {
  try {
    const resp = await fetch(target, {
      headers: { Accept: "application/json", "User-Agent": "Mozilla/5.0" },
    });
    return new Response(await resp.text(), {
      headers: cors({ "Content-Type": "application/json; charset=utf-8" }),
    });
  } catch (e) {
    return json({ error: e.message }, 502);
  }
}

function cors(extra) {
  return { ...extra, "Access-Control-Allow-Origin": "*" };
}

function json(data, status) {
  return new Response(JSON.stringify(data), {
    status,
    headers: cors({ "Content-Type": "application/json" }),
  });
}
