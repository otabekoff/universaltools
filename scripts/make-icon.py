"""Usage: python make-icon.py OUT.png [LIFT] [ACCENT_HEX]

Generate the UniversalTools icon: a gradient badge with a 2x2 'pack' of tiles,
one tile lifted out in accent colour carrying a </> glyph."""
import sys
from PIL import Image, ImageDraw, ImageFilter

S = 1024  # drawing canvas; downsampled to 512 for smooth edges
OUT = sys.argv[1] if len(sys.argv) > 1 else "icon.png"
LIFT = int(sys.argv[2]) if len(sys.argv) > 2 else 0
# accent colour of the </> tile, e.g. "#FBBF24"; sub-packs each use their own
ACCENT = sys.argv[3] if len(sys.argv) > 3 else "#FBBF24"
ACCENT_RGBA = tuple(int(ACCENT.lstrip("#")[i:i + 2], 16) for i in (0, 2, 4)) + (255,)


def lerp(a, b, t):
    return tuple(int(a[i] + (b[i] - a[i]) * t) for i in range(3))


# diagonal gradient background
c1, c2 = (79, 70, 229), (6, 182, 212)  # indigo -> cyan
grad = Image.new("RGB", (S, S))
px = grad.load()
for y in range(S):
    for x in range(S):
        px[x, y] = lerp(c1, c2, (x + y) / (2 * S - 2))

mask = Image.new("L", (S, S), 0)
ImageDraw.Draw(mask).rounded_rectangle((0, 0, S - 1, S - 1), radius=int(S * 0.22), fill=255)
img = Image.new("RGBA", (S, S), (0, 0, 0, 0))
img.paste(grad, (0, 0), mask)

# tiles
tile, gap, r = 250, 56, 56
lift = LIFT
x0 = (S - (2 * tile + gap) - lift) // 2
y0 = (S - (2 * tile + gap) + lift) // 2
pos = {
    "tl": (x0, y0),
    "bl": (x0, y0 + tile + gap),
    "br": (x0 + tile + gap, y0 + tile + gap),
}
acc = (x0 + tile + gap + lift, y0 - lift)  # top-right tile, lifted out

# soft shadow
shadow = Image.new("RGBA", (S, S), (0, 0, 0, 0))
sd = ImageDraw.Draw(shadow)
for (x, y) in list(pos.values()) + [acc]:
    sd.rounded_rectangle((x + 10, y + 22, x + tile + 10, y + tile + 22), radius=r, fill=(15, 23, 42, 90))
shadow = shadow.filter(ImageFilter.GaussianBlur(22))
img = Image.alpha_composite(img, shadow)

d = ImageDraw.Draw(img)
for (x, y) in pos.values():
    d.rounded_rectangle((x, y, x + tile, y + tile), radius=r, fill=(255, 255, 255, 240))

ax, ay = acc
d.rounded_rectangle((ax, ay, ax + tile, ay + tile), radius=r, fill=ACCENT_RGBA)

# </> glyph on accent tile: thin strokes, clear gaps between the three parts
ink, w = (30, 27, 75), 17
cx, cy = ax + tile / 2, ay + tile / 2
ox, ix, h, sl = 80, 50, 36, 11  # outer x, inner x, half-height, slash lean
strokes = [
    [(cx - ix, cy - h), (cx - ox, cy), (cx - ix, cy + h)],
    [(cx + ix, cy - h), (cx + ox, cy), (cx + ix, cy + h)],
    [(cx + sl, cy - h - 4), (cx - sl, cy + h + 4)],
]
for pts in strokes:
    d.line(pts, fill=ink, width=w, joint="curve")
    for p in pts:  # round caps
        d.ellipse((p[0] - w / 2, p[1] - w / 2, p[0] + w / 2, p[1] + w / 2), fill=ink)

img.resize((512, 512), Image.LANCZOS).save(OUT, optimize=True)
print("wrote", OUT)
