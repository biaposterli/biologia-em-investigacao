import re
def edit(p,pairs):
    t=open(p).read()
    for o,n in pairs:
        assert t.count(o)==1,(p,t.count(o),o[:80]);t=t.replace(o,n)
    open(p,'w').write(t)
# portal.js
edit('portal.js',[
 ("  function turmas(){var c=turma();return c?c.t.slice():[];}","  function turmas(){var c=turma();return c?c.t.slice():[];}\n  function escola(){var c=turma();return c&&c.e?c.e:'';}"),
 ("  function linkDaTurma(p){var b=baseUrl(p);var cod=codigoDaTurma({n:p.nome,e:p.escola,r:p.r,t:p.turmas,g:p.grupos});return b&&cod?b+'?turma='+cod:'';}",
  "  function linkDaTurma(p){var b=baseUrl(p);var cod=codigoDaTurma({n:p.nome,e:p.escola,r:p.r,t:p.turmas,g:p.grupos});return b&&cod?b+'?turma='+cod:'';}\n  // Rótulo da turma no painel: com a escola na frente quando houver mais de uma\n  function rotuloTurma(escola,turma){escola=String(escola||'').trim();turma=String(turma||'').trim();return escola&&turma?escola+' · '+turma:turma;}"),
])
t=open('portal.js').read()
t=re.sub(r"(window\.PORTAL=\{SITES:SITES,ORDER:ORDER,)",r"\1escola:escola,rotuloTurma:rotuloTurma,",t,1);open('portal.js','w').write(t)
assert 'escola:escola,rotuloTurma' in t
# sites payload
for f in ['genetica','ecologia','celulas','microcosmo']:
    edit(f'sites/{f}.html',[("nome:ident.nome.trim(),turma:ident.turma,grupo:ident.grupo,id:sendId,ans};}","nome:ident.nome.trim(),escola:(PORTAL.escola?PORTAL.escola():''),turma:ident.turma,grupo:ident.grupo,id:sendId,ans};}")])
# receptor
edit('receptor.gs',[
 ("const FIXAS = ['Carimbo de data/hora', 'Nome completo', 'Turma', 'Grupo'];","const FIXAS = ['Carimbo de data/hora', 'Nome completo', 'Escola', 'Turma', 'Grupo'];"),
 ("    const faltam = Object.keys(resp).concat(['ID do envio']).filter(function (t) { return cab.indexOf(t) < 0; });",
  "    const escola = limpar(dados.escola, 80).trim();\n    const extras = (escola ? ['Escola'] : []).concat(Object.keys(resp)).concat(['ID do envio']);\n    const faltam = extras.filter(function (t) { return cab.indexOf(t) < 0; });"),
 ("'Nome completo': nome, 'Turma': limpar(dados.turma, 20),","'Nome completo': nome, 'Escola': escola, 'Turma': limpar(dados.turma, 20),"),
])
# painel
edit('sites/painel.html',[
 ("S.alunos=al.slice(1).filter(r=>r[0]&&String(r[0]).trim()).map(r=>({nome:String(r[0]).trim(),turma:String(r[1]||'').trim(),grupo:String(r[2]||'').trim()}));",
  "S.alunos=al.slice(1).filter(r=>r[0]&&String(r[0]).trim()).map(r=>({nome:String(r[0]).trim(),turma:P.rotuloTurma(r[3],r[1]),grupo:String(r[2]||'').trim()}));"),
 ("  const iN=ix('Nome completo'),iT=ix('Turma'),iG=ix('Grupo');","  const iN=ix('Nome completo'),iT=ix('Turma'),iG=ix('Grupo'),iE=ix('Escola');"),
 ("nk:norm(nome),turma:String(r[iT]||'').trim(),grupo:","nk:norm(nome),turma:P.rotuloTurma(iE>=0?r[iE]:'',r[iT]),grupo:"),
 ("coluna A nome completo, B turma (igual à do link, por exemplo 2ºA) e C grupo.'","coluna A nome completo, B turma (igual à do link, por exemplo 2ºA) e C grupo. Se você dá aula em mais de uma escola, use a coluna D para o nome da escola, igual ao da Área do professor.'"),
])
