p='src/sites/genetica.html';t=open(p).read()
def rep(o,n):
    global t
    assert t.count(o)==1,o[:60]
    t=t.replace(o,n)
# CSS extra
rep(".cant-c b.lab{font-family:var(--f-display);font-size:1.05rem}`",
""".cant-c b.lab{font-family:var(--f-display);font-size:1.05rem}
.cant-c .esp{font-size:.8rem;color:var(--muted)}
.tag{display:inline-block;padding:2px 10px;border-radius:999px;font-size:.78rem;font-weight:700}
.tag.g{background:var(--good-soft);color:var(--good)}.tag.m{background:#f6ead0;color:var(--warn)}.tag.b{background:var(--bad-soft);color:var(--bad)}
.passos{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px;margin:0;padding:0;list-style:none;counter-reset:ps}
@media (max-width:760px){.passos{grid-template-columns:1fr}}
.passos li{background:var(--surface);border:1px solid var(--line);border-radius:12px;padding:10px 12px 10px 44px;position:relative;counter-increment:ps;line-height:1.45}
.passos li::before{content:counter(ps);position:absolute;left:12px;top:10px;width:22px;height:22px;border-radius:50%;background:var(--accent,#a8336b);color:#fff;font-weight:800;font-size:.8rem;display:grid;place-items:center}
.leg{display:flex;flex-wrap:wrap;gap:8px 18px;font-size:.85rem;color:var(--muted);align-items:center}
.leg span{display:inline-flex;align-items:center;gap:6px}
.rod{display:grid;gap:6px;margin:0;padding-left:18px}`""")
# card: esperado + veredito
rep("""    const g=v?v.filter(Boolean).length:null;
    cBox.append(h('div',{class:'cant-c'},h('b',{class:'lab'},z.nome),h('span',{class:'note'},fmt(z.n)+' semente'+(z.n>1?'s':'')),e,
      h('span',{class:'big-num',style:'color:'+z.cor},v?pct(g/z.n,0):'—'),h('span',{class:'note'},v?g+' verde'+(g===1?'':'s'):'ainda sem plantar')));});}""",
"""    const g=v?v.filter(Boolean).length:null;const vd=v?veredito(g/z.n):null;
    cBox.append(h('div',{class:'cant-c'},h('b',{class:'lab'},z.nome),h('span',{class:'note'},fmt(z.n)+' semente'+(z.n>1?'s':'')),e,
      h('span',{class:'esp'},'Esperado (1 em 4): '+fmt(z.n/4)+' verde'+(z.n/4===1?'':'s')),
      h('span',{class:'big-num',style:'color:'+z.cor},v?pct(g/z.n,0):'—'),h('span',{class:'note'},v?'saíram '+g+' verde'+(g===1?'':'s'):'ainda sem plantar'),
      vd?h('span',{class:'tag '+vd[0]},vd[1]):''));});}
  function veredito(f){const d=Math.abs(f-.25);return d<=.05?['g','🎯 no alvo']:d<=.12?['m','perto']:['b','longe do alvo'];}""")
# feedback: narrativa da rodada + etapas
rep("""  function upd(){drawCanteiros();drawAlvo();cont.textContent=rodadas.length+' rodada'+(rodadas.length===1?'':'s');fb.innerHTML='';
    if(rodadas.length>=5){const sp=SZ.map(z=>{const v=rodadas.map(r=>r[z.n]);return Math.max(...v)-Math.min(...v);});
      fbx(fb,'ok',h('strong',{},'O que o alvo mostra: '),`no vaso de 4 sementes, os resultados se espalharam ${Math.round(sp[0]*100)} pontos percentuais; na plantação de 1.000, só ${Math.round(sp[3]*100)}. Cada semente tem sempre 1 chance em 4 de ser verde, mas só amostras grandes acertam perto de 25%. Por isso uma família com 4 filhos pode não ter nenhum aa, ou ter dois.`);}
    else if(rodadas.length)fbx(fb,'info','Plante mais vezes. Depois de 5 rodadas, compare: em qual canteiro as bolinhas ficam mais perto do alvo?');}""",
"""  function narra(){const r=rodadas[rodadas.length-1];if(!r)return '';
    return h('div',{class:'fb info stack',style:'gap:6px'},h('strong',{},'O que aconteceu neste plantio'),
      h('ul',{class:'rod'},...SZ.map(z=>{const g=Math.round(r[z.n]*z.n);const vd=veredito(r[z.n]);
        return h('li',{},h('b',{},z.nome+': '),`esperávamos ${fmt(z.n/4)} verde${z.n/4===1?'':'s'} e saíram ${g} (${pct(r[z.n],0)}). `,h('span',{class:'tag '+vd[0]},vd[1]));})));}
  function upd(){drawCanteiros();drawAlvo();cont.textContent=rodadas.length+' plantio'+(rodadas.length===1?'':'s');fb.innerHTML='';
    const n=rodadas.length;if(!n){fb.append(h('p',{class:'note'},'Ainda não há bolinhas no alvo. Clique em “Plantar os 4 canteiros”.'));return;}
    if(n<5){fb.append(narra(),h('div',{class:'fb',style:'margin-top:8px'},h('strong',{},'Próximo passo: '),
      n===1?'um plantio só não prova nada. Plante de novo e veja: o vaso vai repetir o mesmo resultado?':`plante mais ${5-n} vez${5-n===1?'':'es'} (ou use “Plantar 10 vezes”) e observe no alvo qual cor de bolinha fica mais espalhada.`));return;}
    const sp=SZ.map(z=>{const v=rodadas.map(r=>r[z.n]);return [Math.min(...v),Math.max(...v)];});
    const ac=SZ.map(z=>rodadas.filter(r=>Math.abs(r[z.n]-.25)<=.05).length);
    fb.append(h('div',{class:'fb ok stack',style:'gap:8px'},h('strong',{},`O que ${n} plantios mostram`),
      h('p',{style:'margin:0'},`No vaso, a porcentagem de verdes foi de ${pct(sp[0][0],0)} até ${pct(sp[0][1],0)}: às vezes nenhuma verde, às vezes muitas. Na plantação, ficou sempre entre ${pct(sp[3][0],0)} e ${pct(sp[3][1],0)}, colada no alvo.`),
      h('p',{style:'margin:0'},`Vezes em que cada canteiro caiu no alvo (entre 20% e 30%): vaso ${ac[0]} de ${n}, canteiro pequeno ${ac[1]}, canteiro médio ${ac[2]}, plantação ${ac[3]}.`),
      h('p',{style:'margin:0'},h('b',{},'Por quê? '),'A chance de cada semente ser verde é sempre a mesma: 1 em 4. O que muda é o tamanho da amostra. Com poucas sementes, o acaso pesa muito (é como jogar uma moeda 4 vezes e sair 4 caras). Com muitas sementes, as sortes e azares se compensam e o resultado chega perto de 25%.'),
      h('p',{style:'margin:0'},h('b',{},'E na genética? '),'Um casal Aa × Aa com 4 filhos é como o vaso: pode ter nenhum filho aa, ou dois, sem que a regra de 1/4 esteja errada. Mendel só enxergou a proporção 3 : 1 porque contou milhares de sementes, como a plantação.')));}""")
# texto de apresentação + passos + legenda
rep("""  root.append(sim('Tiro ao alvo dos canteiros','Quatro canteiros de tamanhos diferentes recebem sementes de Aa × Aa. Em cada semente, a chance de sair verde (aa) é 1 em 4. Plante várias vezes e veja onde as bolinhas caem no alvo de 25%.',
    h('div',{class:'callout'},h('strong',{},'Antes de plantar: '),'em qual canteiro você acha que a porcentagem de verdes vai ficar mais perto de 25%? Por quê?'),
    h('div',{class:'row'},b1,b10,b0,cont),cBox,h('span',{class:'label'},'O alvo · cada bolinha é uma rodada; a maior é a última'),alvo,fb,""",
"""  const dot=(c,st)=>{const e=document.createElementNS(NS,'svg');e.setAttribute('viewBox','0 0 20 20');e.setAttribute('width','16');e.setAttribute('height','16');e.innerHTML=`<circle cx="10" cy="10" r="${st?8:6}" fill="${c}" ${st?'stroke="currentColor" stroke-width="2"':'opacity=".55"'}/>`;return e;};
  const leg=h('div',{class:'leg'},
    h('span',{},h('i',{style:'display:inline-block;width:22px;height:14px;background:var(--good-soft);border-left:3px solid var(--good)'}),'faixa verde: perto de 25% (entre 20% e 30%)'),
    h('span',{},dot('#888'),'bolinha: um plantio'),h('span',{},dot('#888',1),'com contorno: o último plantio'),
    h('span',{},h('i',{style:'display:inline-block;width:22px;height:3px;background:#888'}),'traço: do menor ao maior resultado'));
  root.append(sim('Tiro ao alvo dos canteiros','Será que a regra de 1 em 4 sempre aparece certinha? Vamos plantar sementes de ervilha e conferir.',
    h('ol',{class:'passos'},
      h('li',{},h('b',{},'A regra. '),'Todas as sementes vêm de pais Aa × Aa. Cada semente tem 1 chance em 4 (25%) de ser aa, ou seja, verde. As outras são amarelas.'),
      h('li',{},h('b',{},'O teste. '),'Plantamos em 4 lugares de tamanhos diferentes: um vaso com 4 sementes até uma plantação com 1.000. A chance de cada semente é a mesma; só muda a quantidade.'),
      h('li',{},h('b',{},'O alvo. '),'Se a regra aparecesse certinha, todo canteiro teria 25% de verdes. Cada plantio vira uma bolinha no alvo: quanto mais perto da linha verde, mais perto de 25%.')),
    h('div',{class:'callout'},h('strong',{},'Antes de plantar, aposte: '),'em qual dos 4 canteiros a porcentagem de verdes vai ficar mais perto de 25%? Anote sua aposta na ficha e depois confira.'),
    h('div',{class:'row'},b1,b10,b0,cont),cBox,h('span',{class:'label'},'O alvo · porcentagem de sementes verdes em cada plantio'),alvo,leg,fb,""")
rep("store.set('alvo-rod',rodadas);ultimo=null;upd();}},'Recomeçar');","store.set('alvo-rod',rodadas);ultimo=null;upd();}},'Recomeçar');\n  ultimo=null;")
open(p,'w').write(t)
