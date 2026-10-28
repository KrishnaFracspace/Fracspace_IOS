"""Renders the NavCore conic ring (HubNavBar.js) to assets/nav-ring.png.

Same 72 five-degree wedges and colours as the old SVG, drawn at 3x (210 px for
the 70 pt ring) with 4x4 supersampling. The view clips it to a circle.
Run: python3 -I docs/special-section/tools/make-nav-ring.py
"""
import math, os, struct, zlib

CONIC = ['#F1DDBA', '#7A5A2E', '#1A1611', '#D9B26F', '#F1DDBA']
hexc = lambda h: [int(h[i:i + 2], 16) for i in (1, 3, 5)]


def conic(t):
    seg = min(3, math.floor(t * 4))
    f = t * 4 - seg
    a, b = hexc(CONIC[seg]), hexc(CONIC[seg + 1])
    return [round(v + (b[i] - v) * f) for i, v in enumerate(a)]


WEDGE = [conic((i + 0.5) / 72) for i in range(72)]
N, SS = 210, 4
rows = []
for y in range(N):
    row = bytearray([0])
    for x in range(N):
        acc = [0, 0, 0]
        for sy in range(SS):
            for sx in range(SS):
                dx = x + (sx + 0.5) / SS - N / 2
                dy = y + (sy + 0.5) / SS - N / 2
                deg = (math.degrees(math.atan2(dy, dx)) + 90) % 360  # 0 = top, clockwise
                c = WEDGE[int(deg // 5) % 72]
                acc = [acc[i] + c[i] for i in range(3)]
        row += bytes(round(v / SS / SS) for v in acc)
    rows.append(bytes(row))

def chunk(t, d):
    return struct.pack('>I', len(d)) + t + d + struct.pack('>I', zlib.crc32(t + d) & 0xffffffff)

out = os.path.join(os.path.dirname(__file__), '../../../Screen/Version2_O/SpecialSection/assets/nav-ring.png')
with open(out, 'wb') as f:
    f.write(b'\x89PNG\r\n\x1a\n' + chunk(b'IHDR', struct.pack('>IIBBBBB', N, N, 8, 2, 0, 0, 0))
            + chunk(b'IDAT', zlib.compress(b''.join(rows), 9)) + chunk(b'IEND', b''))
print('wrote', os.path.normpath(out))
