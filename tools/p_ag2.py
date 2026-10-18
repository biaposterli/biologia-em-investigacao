p='src/sites/genetica.html';t=open(p).read()
def rep(o,n,c=1):
    global t
    assert t.count(o)==c,(t.count(o),o[:70])
    t=t.replace(o,n)
rep("""// Ilustrações: ervilhas (A = amarela, dominante; a = verde, recessivo)
""","""// Ilustrações: família fictícia com albinismo (A = produz melanina; a = albinismo, recessivo)
const pessoaSv=(x,y,r,alb)=>{const sk=alb?'#f6e1d3':'#9a6040',hr=alb?'#f7f1df':'#2a1b12',hs=alb?'#bfae8c':'#2a1b12';
  return `<path d="M${x-r*.82},${y+r} Q${x-r*.82},${y+r*.22} ${x},${y+r*.22} Q${x+r*.82},${y+r*.22} ${x+r*.82},${y+r}Z" fill="#6b7f99"/>`+
  `<circle cx="${x}" cy="${y-r*.32}" r="${r*.44}" fill="${sk}" stroke="rgba(0,0,0,.28)" stroke-width="${r*.06}"/>`+
  `<path d="M${x-r*.47},${y-r*.26} Q${x-r*.52},${y-r*.86} ${x},${y-r*.84} Q${x+r*.52},${y-r*.86} ${x+r*.47},${y-r*.26} Q${x+r*.2},${y-r*.62} ${x-r*.47},${y-r*.26}Z" fill="${hr}" stroke="${hs}" stroke-width="${r*.05}"/>`;};
""")
rep("const agCol=g=>g==='aa'?PEA.G:PEA.Y;\n","")
rep("// quadro 2×2 com ervilhas;","// quadro 2×2 com pessoas;")
rep("str+=`<g opacity=\"${on?1:.35}\">${seedSv(x+c/2,y+c/2-6,9,agCol(g))}</g>`;","str+=`<g opacity=\"${on?1:.35}\">${pessoaSv(x+c/2,y+c/2-5,12,g==='aa')}</g>`;")
rep("cells.forEach((g,i)=>{str+=`<g>${seedSv(o+c*i+c/2,o-14,6.5,agCol(g))}</g>`;str+=`<g>${seedSv(o-14,o+c*i+c/2,6.5,agCol(g))}</g>`;});",
    "cells.forEach((g,i)=>{str+=`<g>${pessoaSv(o+c*i+c/2,o-14,10,g==='aa')}</g>`;str+=`<g>${pessoaSv(o-14,o+c*i+c/2,10,g==='aa')}</g>`;});")
rep("""h('span',{class:'row',style:'gap:6px'},svgOf(seedSv(12,12,9,PEA.Y),'0 0 24 24','ag-ico'),h('span',{},h('b',{},'AA'),' ou ',h('b',{},'Aa'),': ervilha amarela')),h('span',{class:'row',style:'gap:6px'},svgOf(seedSv(12,12,9,PEA.G),'0 0 24 24','ag-ico'),h('span',{},h('b',{},'aa'),': ervilha verde'))),""",
"""h('span',{class:'row',style:'gap:6px'},svgOf(pessoaSv(14,15,13,false),'0 0 28 28','ag-ico'),h('span',{},h('b',{},'AA'),' ou ',h('b',{},'Aa'),': produz melanina')),h('span',{class:'row',style:'gap:6px'},svgOf(pessoaSv(14,15,13,true),'0 0 28 28','ag-ico'),h('span',{},h('b',{},'aa'),': albinismo'))),
    h('p',{class:'note',style:'margin:0'},'Família fictícia. No albinismo oculocutâneo tipo 1, a herança é autossômica recessiva: a pessoa aa produz pouca ou nenhuma melanina, o pigmento da pele, dos cabelos e dos olhos. Quem é Aa produz melanina normalmente, mas pode passar o alelo a para os filhos.'),""")
rep("' é verde (aa): '","' tem albinismo (aa): '")
rep("' tem os dois verdes: '","' tem os dois filhos aa: '")
rep("Uma ervilha não cai em duas casas ao mesmo tempo, então dá para somar: ","Uma pessoa não pode ser AA e Aa ao mesmo tempo, então dá para somar: ")
rep("svgOf(seedSv(22,22,16,col),'0 0 44 44','ag-tli')","svgOf(pessoaSv(22,24,20,true),'0 0 44 44','ag-tli')")
rep("tlBox(PEA.G,'1º filho: aa','verde'),tlBox(PEA.G,'2º filho: aa','verde de novo'),tlBox(null,'3º filho: ?','A chance de verde caiu, subiu ou continua 1/4?',true)",
    "tlBox(1,'1º filho: aa','albinismo'),tlBox(1,'2º filho: aa','albinismo de novo'),tlBox(null,'3º filho: ?','A chance de ser aa caiu, subiu ou continua 1/4?',true)")
rep("...f.map(v=>h('i',{style:'background:'+(v?PEA.G:PEA.Y)}))))","svgOf(f.map((v,j)=>pessoaSv(7+j*12,9,6.5,v)).join(''),'0 0 36 17','ag-fam')))")
rep("'Peneira: 64 das famílias simuladas (cada uma = 3 ervilhas)'","'Peneira: 64 das famílias simuladas (cada uma com 3 filhos)'")
rep("em que os dois primeiros filhos foram verdes (aa). Olhe só a terceira ervilha delas.","em que os dois primeiros filhos foram aa. Olhe só o terceiro filho delas.")
rep("Nenhuma destas 64 teve os dois primeiros filhos verdes","Nenhuma destas 64 teve os dois primeiros filhos aa")
rep(".ag-sieve{display:grid;grid-template-columns:repeat(auto-fill,minmax(44px,1fr));gap:6px}",".ag-sieve{display:grid;grid-template-columns:repeat(auto-fill,minmax(48px,1fr));gap:6px}.ag-fam{width:40px;height:19px}")
rep(".ag-sieve i{width:11px;height:11px;border-radius:50%;display:block;border:1px solid rgba(0,0,0,.25)}","")
# Maternidade virtual
rep("kids.forEach(a=>row.append(h('span',{title:a?'aa':'AA ou Aa',style:`width:22px;height:22px;border-radius:50%;display:inline-block;background:${a?'var(--her)':'var(--surface-2)'};border:2px solid var(--her)`})));",
    "kids.forEach(a=>{const e=svgOf(pessoaSv(13,14,12,a),'0 0 26 26');e.setAttribute('width','26');e.setAttribute('height','26');e.setAttribute('role','img');e.setAttribute('aria-label',a?'aa':'AA ou Aa');row.append(e);});")
rep("'Gere famílias Aa × Aa e veja como os filhos aa se distribuem entre elas. Círculo preenchido: filho aa.'","'Gere famílias fictícias Aa × Aa e veja como os filhos aa (com albinismo, cabelo e pele claros no desenho) se distribuem entre elas.'")
open(p,'w').write(t)
