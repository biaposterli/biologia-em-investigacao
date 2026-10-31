import pathlib,re,sys
R=pathlib.Path('/home/claude/biologia-em-investigacao')
up=pathlib.Path(sys.argv[1]).read_text(encoding='utf-8')
pla=(R/'src/sites/plantas.html').read_text(encoding='utf-8')
def rep(t,a,b,n=1):
    assert t.count(a)==n,(a[:90],t.count(a)); return t.replace(a,b)
SID,CH='crp','corpo-u2'
t=up
# 1. cabeçalho
t=rep(t,'[hidden]{display:none!important}</style>\n<title>','[hidden]{display:none!important}</style><meta name="description" content="Corpo em Transformação · Unidade 2 do livro 360° Biologia.">\n<title>')
t=rep(t,'</head><body>\n<header class="top">',f'</head><body>\n<script>window.PORTAL_SITE=\'{SID}\';</script><script src="portal.js"></script>\n<header class="top">')
# 2. armazenamento por estudante + "Recomeçar esta aula"
old_store="const store={get(k,d){try{const v=localStorage.getItem(SITE.chave+'-'+k);return v?JSON.parse(v):d}catch(e){return d}},set(k,v){try{localStorage.setItem(SITE.chave+'-'+k,JSON.stringify(v))}catch(e){}}};\n"
i=pla.index("const store={");j=pla.index("\nfunction addReset(");j=pla.index('\n',j+1)+1
blk=pla[i:j].replace("PORTAL.pfx('pla'):'pla-'",f"PORTAL.pfx('{CH}'):'{CH}-'")
assert "'pla" not in blk
t=rep(t,old_store,blk)
# 3. fichas (turma, grupos, envio) e navegação: mesmo motor do Plantas
def region(s):
    a=s.index('// ================= Fichas de resposta');g=s.index('\nfunction go(id){',a);b=s.index('\n}\n',g)+3;return a,b
a,b=region(pla);eng=pla[a:b]
assert "'pla'" not in eng and 'Plantas' not in eng
a,b=region(t);t=t[:a]+eng+t[b:]
# os textos fixos do modelo citam "a professora"; no portal, o professor pode ser qualquer um
out=R/'src/sites/corpo.html';out.write_text(t,encoding='utf-8')
print('ok',len(t),t.count('PORTAL.'),t.count('professora'))
# 4. lista de fichas fechada em linha própria ("\n];"), como o build.py espera para gerar specs.js
t=out.read_text(encoding='utf-8')
i=t.index('const SPEC=[');e=t.index('\n',i)
line=t[i:e];assert line.endswith('}];'),line[-20:]
import json;json.loads(line[len('const SPEC='):-1])
t=t[:i]+line[:-2]+'\n];'+t[e:];out.write_text(t,encoding='utf-8');print('spec ok')
