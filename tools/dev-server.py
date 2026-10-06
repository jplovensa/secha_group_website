"""Static preview server with byte ranges for native video seeking."""
import argparse
import re
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path


class PreviewHandler(SimpleHTTPRequestHandler):
    def send_head(self):
        self.remaining = None
        range_header = self.headers.get('Range')
        path = Path(self.translate_path(self.path))
        if not range_header or not path.is_file():
            return super().send_head()
        match = re.fullmatch(r'bytes=(\d*)-(\d*)', range_header)
        size = path.stat().st_size
        if not match or not any(match.groups()) or not size:
            return self.invalid_range(size)
        first, last = match.groups()
        if first:
            start = int(first)
            end = min(int(last) if last else size - 1, size - 1)
        else:
            start = max(0, size - int(last))
            end = size - 1
        if start > end or start >= size:
            return self.invalid_range(size)
        stream = path.open('rb')
        stream.seek(start)
        self.remaining = end - start + 1
        self.send_response(206)
        self.send_header('Content-Type', self.guess_type(str(path)))
        self.send_header('Content-Length', str(self.remaining))
        self.send_header('Content-Range', f'bytes {start}-{end}/{size}')
        self.send_header('Last-Modified', self.date_time_string(path.stat().st_mtime))
        self.end_headers()
        return stream

    def invalid_range(self, size):
        self.send_response(416)
        self.send_header('Content-Range', f'bytes */{size}')
        self.send_header('Content-Length', '0')
        self.end_headers()
        return None

    def end_headers(self):
        self.send_header('Accept-Ranges', 'bytes')
        super().end_headers()

    def copyfile(self, source, output):
        if self.remaining is None:
            return super().copyfile(source, output)
        while self.remaining:
            chunk = source.read(min(65536, self.remaining))
            if not chunk:
                break
            output.write(chunk)
            self.remaining -= len(chunk)


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--port', type=int, default=4173)
    args = parser.parse_args()
    ThreadingHTTPServer(('0.0.0.0', args.port), PreviewHandler).serve_forever()
