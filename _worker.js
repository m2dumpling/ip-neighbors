/**
 * IP 邻居 — Meituan API CORS 代理
 * 部署到 Cloudflare Workers（粘贴到编辑器 → 保存部署）
 */
addEventListener("fetch", (event) => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  const url = new URL(request.url);

  // CORS 预检
  if (request.method === "OPTIONS") {
    return new Response(null, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, OPTIONS",
        "Access-Control-Max-Age": "86400",
      },
    });
  }

  const target = url.searchParams.get("url");
  if (!target) {
    return new Response(JSON.stringify({ error: "missing url" }), {
      status: 400,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
    });
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
    return new Response(JSON.stringify({ error: e.message }), {
      status: 502,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
    });
  }
}
