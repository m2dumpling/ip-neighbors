# IP 邻居 — C 段网络地址扫描器

输入任意 IPv4 地址，扫描同一 C 段（/24 子网）全部 256 个邻居 IP，在地图上可视化呈现。

> 数据来源：美团 App 内部 IP 定位库，可揭示国内 App 如何将海外 IP 关联到国内地理位置。

## 访问地址

**https://m2dumpling.github.io/ip-neighbors/**

## 功能

- 🔍 输入 IPv4 地址 → 自动扫描同网段 256 个 IP
- 🗺️ 地图可视化展示所有可定位 IP 的地理分布
- 📊 16×16 邻域网格，一眼看清哪些 IP 被定位
- 📍 点击网格或地图标记查看精确地址（精确到楼栋级）
- 👤 打开网页自动检测你的公网 IP，一键复制

## 技术栈

| 层 | 技术 |
|---|---|
| 前端 | 纯 HTML/CSS/JS，零框架 |
| 地图 | Leaflet + OpenStreetMap |
| 数据 | 美团定位 API (apimobile.meituan.com) |
| 代理 | Cloudflare Worker（解决浏览器 CORS 限制） |
| 部署 | GitHub Pages + Cloudflare Workers |

## 本地开发

```bash
# 需要先部署 _worker.js 到 Cloudflare Workers 获取代理地址
# 然后在 index.html 中修改 WORKER 常量
python -m http.server 8080
# 访问 http://localhost:8080
```
