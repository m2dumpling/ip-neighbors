/**
 * IP 邻居 — Meituan API CORS 代理
 * 部署到 Cloudflare Workers: 复制粘贴 → 保存部署
 * 获得地址如 https://ip-proxy.xxxx.workers.dev
 */
export default {
  async fetch(request) {
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

    const target = url.searchParams.get("url");
    if (!target) {
      return json({ error: "missing 'url' parameter" }, 400);
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
      return json({ error: e.message }, 502);
    }
  },
};

function json(data, status) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
  });
}
