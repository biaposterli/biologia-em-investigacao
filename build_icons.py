import pathlib, cairosvg, io
from PIL import Image
OUT = pathlib.Path(__file__).resolve().parent / 'src' / 'icons'; OUT.mkdir(parents=True, exist_ok=True)

def frame(fill, inner):
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="{fill}"/>{inner}</svg>'

W = 'fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"'
ICONS = {
  # Portal: o campo do microscópio dividido entre os quatro sites
  'portal': frame('#17231d',
     '<circle cx="32" cy="32" r="22" fill="#f4f1ea"/>'
     '<path d="M32 13A19 19 0 0 0 13 32H32z" fill="#c27a2c"/>'
     '<path d="M32 13A19 19 0 0 1 51 32H32z" fill="#3d6fc4"/>'
     '<path d="M13 32A19 19 0 0 0 32 51V32z" fill="#2a8a6f"/>'
     '<path d="M51 32A19 19 0 0 1 32 51V32z" fill="#c2457f"/>'),
  'celulas': frame('#a3601b',
     f'<path d="M14 30c0-11 10-18 21-17s16 9 15 18-7 19-19 20-17-9-17-21z" {W}/><circle cx="27" cy="29" r="7" fill="#fff"/><ellipse cx="40" cy="40" rx="5" ry="2.6" transform="rotate(-30 40 40)" fill="#fff"/><circle cx="41" cy="23" r="2.4" fill="#fff"/>'),
  'microcosmo': frame('#2c58a5',
     f'<path d="M22 10l10 10-6 6-10-10z" fill="#fff"/><path d="M29 23l9 9" {W}/>'
     f'<path d="M38 52a14 14 0 0 0 4-22" {W}/><path d="M24 52v-7h12" {W}/><path d="M13 53h38" {W}/>'),
  'ecologia': frame('#1d6b58',
     f'<path d="M32 54V34" {W}/><path d="M32 36c-11 0-17-7-17-19 11 0 17 7 17 19z" fill="#fff"/>'
     f'<path d="M32 31c0-10 6-16 19-16 0 10-7 16-19 16z" fill="#fff" opacity=".8"/>'),
  'genetica': frame('#a3336b',
     f'<path d="M22 9c0 16 20 16 20 23s-20 7-20 23" {W}/><path d="M42 9c0 16-20 16-20 23s20 7 20 23" {W}/>'
     '<path d="M25 18h14M25 46h14" stroke="#fff" stroke-width="4" stroke-linecap="round"/>'),
}
for name, svg in ICONS.items():
    (OUT / f'{name}.svg').write_text(svg)
    for size in ([32, 180, 192, 512] if name == 'portal' else [32, 180]):
        png = cairosvg.svg2png(bytestring=svg.encode(), output_width=size, output_height=size)
        (OUT / f'{name}-{size}.png').write_bytes(png)
# favicon.ico do portal (16, 32 e 48 px)
big = Image.open(io.BytesIO(cairosvg.svg2png(bytestring=ICONS['portal'].encode(), output_width=256, output_height=256)))
big.save(OUT / 'favicon.ico', sizes=[(16, 16), (32, 32), (48, 48)])
# prévia
prev = Image.new('RGBA', (5 * 180 + 6 * 20, 220 + 60), (238, 240, 236, 255))
for i, n in enumerate(ICONS):
    im = Image.open(OUT / f'{n}-180.png'); prev.paste(im, (20 + i * 200, 20), im)
    sm = Image.open(OUT / f'{n}-32.png').resize((32, 32)); prev.paste(sm, (20 + i * 200 + 74, 220), sm)
prev.save(OUT.parent.parent / 'out' / 'icons_preview.png')
print(sorted(p.name for p in OUT.iterdir()))
