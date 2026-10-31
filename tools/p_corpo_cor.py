"""Corpo em Transformação: interface na cor do módulo no portal (azul-petróleo #1f6f8b), como Plantas e Diversidade."""
import pathlib,re
F=pathlib.Path(__file__).resolve().parent.parent/'src/sites/corpo.html'
s=F.read_text(encoding='utf-8')
L='#1f6f8b';LS='#d6e9ef';D='#6cc0d9';DS='#15303a'
t=lambda c,cs:''.join(f'--t{k}:{c};--t{k}-soft:{cs};' for k in range(1,7))
css=('\n/* Cor do módulo no portal (azul-petróleo): todos os temas usam a mesma cor, como em Plantas e Diversidade. */\n'
 f':root{{--bg:#edf2f4;--grid:#d3e0e6;{t(L,LS)}--tema:var(--t1);--tema-soft:var(--t1-soft)}}\n'
 f'@media(prefers-color-scheme:dark){{:root:not([data-theme="light"]){{--bg:#10171a;--grid:#1d282d;--surface:#172126;--surface-2:#213039;--ink:#e6eef1;--muted:#a6b6be;--line:#2f4049;{t(D,DS)}}}}}\n'
 f':root[data-theme="dark"]{{--bg:#10171a;--grid:#1d282d;--surface:#172126;--surface-2:#213039;--ink:#e6eef1;--muted:#a6b6be;--line:#2f4049;{t(D,DS)}}}\n')
mark='/* Cor do módulo no portal'
if mark in s: s=s[:s.index('\n'+mark)]+s[s.index('</style>\n</head><body>'):]
i=s.index('</style>\n</head><body>');s=s[:i]+css+s[i:]
# destaques e marcas desenhados com as cores antigas dos temas passam a seguir a cor do módulo
body=s.index('<script>window.PORTAL_SITE')
s=s[:body]+s[body:].replace('stroke="#a3336b" stroke-width="3" stroke-dasharray="5 4"','stroke="var(--tema)" stroke-width="3" stroke-dasharray="5 4"').replace('stroke="#9a5a10" stroke-width="3" stroke-dasharray="5 4"','stroke="var(--tema)" stroke-width="3" stroke-dasharray="5 4"')
# capa: círculos em tons de azul-petróleo
s=s.replace("uCircle(105,120,56,'#a3336b')+uCircle(365,120,56,'#2c58a5')+uCircle(105,300,56,'#16705d')+uCircle(365,300,56,'#356f2a')","uCircle(105,120,56,'#1f6f8b')+uCircle(365,120,56,'#2b5f7e')+uCircle(105,300,56,'#2f8a9a')+uCircle(365,300,56,'#174f63')")
s=s.replace('fill="#a75f77"/>`+uText(240,394','fill="#c0475a"/>`+uText(240,394')
s=s.replace('<rect width="480" height="420" rx="28" fill="#e8edf1"/><path d="M60 215Q240 40 420 210M60 215Q240 390 420 210" fill="none" stroke="#9cb2c5"','<rect width="480" height="420" rx="28" fill="#e3eef2"/><path d="M60 215Q240 40 420 210M60 215Q240 390 420 210" fill="none" stroke="#8fb5c4"')
F.write_text(s,encoding='utf-8');print('ok')
