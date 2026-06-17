const http = require('http');
const fs = require('fs');
const path = require('path');

const port = Number(process.argv[2] || 8000);
const root = process.cwd();
const types = {
    '.html': 'text/html; charset=utf-8',
    '.js': 'text/javascript; charset=utf-8',
    '.json': 'application/manifest+json; charset=utf-8',
    '.svg': 'image/svg+xml; charset=utf-8'
};

http.createServer(function (request, response) {
    const url = new URL(request.url, 'http://localhost');
    const file = url.pathname === '/' ? 'index.html' : url.pathname.slice(1);
    const fullPath = path.resolve(root, file);

    if (!fullPath.startsWith(root)) {
        response.writeHead(403);
        response.end('Forbidden');
        return;
    }

    fs.readFile(fullPath, function (error, data) {
        if (error) {
            response.writeHead(404);
            response.end('Not found');
            return;
        }

        response.writeHead(200, {
            'Content-Type': types[path.extname(fullPath)] || 'application/octet-stream'
        });
        response.end(data);
    });
}).listen(port, '127.0.0.1');
