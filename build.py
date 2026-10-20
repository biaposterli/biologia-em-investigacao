import subprocess, pathlib, shutil, json
R = pathlib.Path(__file__).resolve().parent; SRC = R / 'src'; OUT = R / 'out'
OUT.mkdir(exist_ok=True)
# Cada site agora é editado direto em src/sites/<site>.html (fonte única de cada site).
for f in ['ciencia', 'ecologia', 'celulas', 'genetica', 'microcosmo', 'painel']:
    shutil.copy(SRC / 'sites' / f'{f}.html', OUT / f'{f}.html')
# Fichas para o painel: extraídas dos próprios sites a cada build
specs = {}
for sid, f, start in [('eco', 'ecologia', "const REL_OPTS="), ('cel', 'celulas', "const C1='1º ano · Aula ';"), ('gen', 'genetica', "const GEN3="), ('mic', 'microcosmo', "const SPEC=["), ('cie', 'ciencia', "const SPEC=[")]:
    t = (OUT / f'{f}.html').read_text(encoding='utf-8')
    i0 = t.index(start); j = t.index('const SPEC=[', i0); k = t.index('\n];', j) + 3
    specs[sid] = t[i0:k]
js = ['/* Fichas dos quatro sites (extraídas dos próprios sites; usadas pelo painel) */', 'window.SPECS={};']
for sid, body in specs.items():
    js.append("(function(){const store={get:(k,d)=>d,set:()=>{}};const fmt=(n)=>String(n);const TEO=[1,6,15,20,15,6,1];const QZ=[];\n" + body + "\nwindow.SPECS.%s=SPEC;})();" % sid)
(OUT / 'specs.js').write_text('\n'.join(js), encoding='utf-8')
css = (SRC / 'portal.css').read_text()
gs = (SRC / 'receptor.gs').read_text()
assert '</script' not in gs
SKEL = ('<!doctype html><html lang="pt-BR"><head><meta charset="utf-8">'
        '<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">'
        '<style>:root{color-scheme:light;box-sizing:border-box;padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}'
        'body{margin:0;padding:0;font:14px -apple-system,BlinkMacSystemFont,sans-serif}img{max-width:100%}[hidden]{display:none!important}</style>'
        '</head><body>\n')
def page(name):
    b = (SRC / f'{name}.body.html').read_text().replace('/*__PORTAL_CSS__*/', css).replace('/*__RECEPTOR__*/', gs)
    return b
def icons(name, manifest=False):
    t = (f'<link rel="icon" href="icons/{name}.svg" type="image/svg+xml">'
         f'<link rel="icon" href="icons/{name}-32.png" type="image/png" sizes="32x32">'
         f'<link rel="apple-touch-icon" href="icons/{name}-180.png">')
    if name == 'portal': t = '<link rel="icon" href="icons/favicon.ico" sizes="any">' + t
    if manifest: t += '<link rel="manifest" href="site.webmanifest"><meta name="theme-color" content="#17231d">'
    return t
idx = icons('portal', True) + '\n' + page('index'); prof = icons('portal') + '\n' + page('professor')
(OUT / 'index.body.html').write_text(idx)            # página principal do artefato (o Claude coloca o esqueleto)
(OUT / 'professor.html').write_text(SKEL.replace('</head>', icons('portal') + '</head>') + page('professor') + '\n</body></html>')
(OUT / 'estudante.html').write_text(SKEL.replace('</head>', icons('portal') + '</head>') + page('estudante') + '\n</body></html>')
shutil.copy(SRC / 'portal.js', OUT / 'portal.js')
for f, n in [('ciencia.html','ciencia'),('ecologia.html','ecologia'),('celulas.html','celulas'),('genetica.html','genetica'),('microcosmo.html','microcosmo'),('painel.html','portal')]:
    t = (OUT / f).read_text()
    if 'rel="icon"' not in t:
        assert t.count('</head>') >= 1
        t = t.replace('</head>', icons(n) + '</head>', 1)
        (OUT / f).write_text(t)
if (OUT / 'icons').exists(): shutil.rmtree(OUT / 'icons')
shutil.copytree(SRC / 'icons', OUT / 'icons')
(OUT / 'site.webmanifest').write_text(json.dumps({'name': 'Biologia em Investigação', 'short_name': 'Biologia', 'start_url': './', 'display': 'standalone',
    'background_color': '#edf0ec', 'theme_color': '#17231d', 'lang': 'pt-BR',
    'icons': [{'src': 'icons/portal-192.png', 'sizes': '192x192', 'type': 'image/png'}, {'src': 'icons/portal-512.png', 'sizes': '512x512', 'type': 'image/png'}]}, ensure_ascii=False, indent=1))
# versão para hospedar (Cloudflare Pages etc.)
SITE = R / 'site'
if SITE.exists(): shutil.rmtree(SITE)
SITE.mkdir()
for f in ['ciencia.html', 'ecologia.html', 'celulas.html', 'genetica.html', 'microcosmo.html', 'painel.html', 'professor.html', 'estudante.html', 'portal.js', 'specs.js', 'site.webmanifest']:
    shutil.copy(OUT / f, SITE / f)
shutil.copytree(OUT / 'icons', SITE / 'icons')
(SITE / 'index.html').write_text(SKEL.replace('</head>', icons('portal', True) + '</head>') + page('index') + '\n</body></html>')
(SITE / 'receptor.gs').write_text(gs)
shutil.copy(SRC / 'teste.html', SITE / 'teste.html')
(SITE / '_headers').write_text('/*.html\n  Cache-Control: no-cache\n/portal.js\n  Cache-Control: no-cache\n/specs.js\n  Cache-Control: no-cache\n')

# Cópia na raiz do repositório: o Cloudflare publica certo com a pasta de saída "site" ou em branco ("/")
for p in SITE.iterdir():
    alvo = R / p.name
    if p.is_dir():
        if alvo.exists(): shutil.rmtree(alvo)
        shutil.copytree(p, alvo)
    else:
        shutil.copy(p, alvo)
print('ok', sorted(p.name for p in SITE.iterdir()))
