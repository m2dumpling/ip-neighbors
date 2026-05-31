"""
本地代理服务器 — 零 CORS 限制
使用方法: python server.py
然后访问 http://localhost:8080

该服务器同时托管静态文件和代理 API 请求，
同源策略下不存在跨域问题。
"""

import http.server
import urllib.request
import urllib.error
import json
import os
import re

PORT = 8080
MEITUAN_API = "https://apimobile.meituan.com/locate/v2/ip/loc"

class ProxyHandler(http.server.SimpleHTTPRequestHandler):

    def do_GET(self):
        # 代理 API 请求
        if self.path.startswith('/proxy?'):
            self.handle_proxy()
        else:
            # 提供静态文件
            super().do_GET()

    def handle_proxy(self):
        import urllib.parse
        params = urllib.parse.parse_qs(urllib.parse.urlparse(self.path).query)
        url = params.get('url', [None])[0]

        if not url:
            self.send_error(400, 'Missing "url" parameter')
            return

        try:
            req = urllib.request.Request(url, headers={
                'Accept': 'application/json',
                'User-Agent': 'Mozilla/5.0',
            })
            with urllib.request.urlopen(req, timeout=10) as resp:
                data = resp.read()
                self.send_response(200)
                self.send_header('Content-Type', 'application/json; charset=utf-8')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.send_header('Content-Length', str(len(data)))
                self.end_headers()
                self.wfile.write(data)
        except urllib.error.HTTPError as e:
            self.send_error(e.code, str(e))
        except urllib.error.URLError as e:
            self.send_error(502, f'Proxy error: {e.reason}')
        except Exception as e:
            self.send_error(500, f'Internal error: {str(e)}')

    def log_message(self, format, *args):
        print(f'[{self.log_date_time_string()}] {args[0]} {args[1]} {args[2]}')


if __name__ == '__main__':
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    server = http.server.HTTPServer(('0.0.0.0', PORT), ProxyHandler)
    print(f'🚀 服务器已启动: http://localhost:{PORT}')
    print(f'   API 代理: http://localhost:{PORT}/proxy?url=...')
    print(f'   按 Ctrl+C 停止')
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print('\n服务器已停止')
        server.server_close()
