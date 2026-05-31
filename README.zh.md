# IP 邻居 — C 段网络地址扫描器

输入任意 IPv4 地址，扫描同一 C 段（/24 子网）全部 256 个邻居 IP，在地图上可视化呈现。

> 数据来源：美团 App 内部 IP 定位库。可揭示国内 App 如何将海外 IP 关联到国内地理位置——这正是 VPN 泄露背后的原理。


[English](https://github.com/m2dumpling/ip-neighbors) | [在线演示](https://m2dumpling.github.io/ip-neighbors/)


## 快速开始

访问 **https://m2dumpling.github.io/ip-neighbors/**

输入 IPv4 地址（如 `54.70.174.10`），点击扫描。C 段 256 个 IP 会被并发查询美团定位库，结果显示在地图上。

## 功能

- 🔍 **C 段扫描** — 约 3 秒完成 256 个 IP 的全网段扫描
- 🗺️ **地图可视化** — Leaflet 交互地图，支持缩放，标记可点击
- 📊 **16×16 网格** — 一眼看清哪些 IP 有定位数据，点击跳转地图
- 📍 **精确地址** — 点击 IP 查看楼栋级详细地址（如"中山大学广州校区南校园"）
- 👤 **访客 IP 检测** — 打开页面自动检测公网 IP，一键复制
- 📱 **响应式** — 桌面和手机均可使用

## 原理

```
浏览器 ──── 6 次批量请求 ────▶ Cloudflare Worker ──── 50 并发 ────▶ 美团 API
                ▲                       ▲
                │ CORS 头               │ 无跨域限制
                │                       │ （服务端直连）
```

1. **前端** — 纯静态 HTML/CSS/JS，部署在 GitHub Pages
2. **代理** — Cloudflare Worker 添加 CORS 头，批量转发请求
3. **数据** — 组合两个美团 API：
   - `locate/v2/ip/loc` — IP → 省份、城市、区县、经纬度
   - `city/latlng` — 经纬度 → 精确地址

## 技术栈

| 层 | 技术 |
|---|---|
| 前端 | 纯 HTML/CSS/JS，零框架依赖 |
| 地图 | Leaflet + OpenStreetMap |
| 代理 | Cloudflare Workers（免费额度） |
| 部署 | GitHub Pages |
| 数据 | 美团定位 API |
