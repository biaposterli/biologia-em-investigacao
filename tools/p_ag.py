p='src/sites/genetica.html';t=open(p).read()
def rep(o,n):
    global t
    assert t.count(o)==1,o[:70]
    t=t.replace(o,n)

# ---------- helpers (antes do INIT.agencia)
rep("// ================= Aula 3: Agência de previsões =================\nINIT.agencia=root=>{\n",
r"""// ================= Aula 3: Agência de previsões =================
// Ilustrações: ervilhas (A = amarela, dominante; a = verde, recessivo)
const agSort=(x,y)=>x===y?x+y:(x==='A'?'Aa':'Aa');
const agGeno=(x,y)=>x==='a'&&y==='a'?'aa':x==='A'&&y==='A'?'AA':'Aa';
const agOk=(g,ev)=>ev==='dom'?g!=='aa':ev==='rec'?g==='aa':g===ev;
const agCol=g=>g==='aa'?PEA.G:PEA.Y;
// quadro 2×2 com ervilhas; hl(g) diz quais casas acendem
function agPunnett(p1,p2,hl,{lab=true}={}){const c=46,o=30;let str='';
  const gam=(x,y,a)=>`<circle cx="${x}" cy="${y}" r="11" fill="var(--surface-2)" stroke="var(--line)"/><text x="${x}" y="${y+4.5}" text-anchor="middle" font-size="13" font-weight="800" font-family="var(--f-mono)" fill="var(--ink)">${a}</text>`;
  [0,1].forEach(i=>{str+=gam(o+c*i+c/2,14,p2[i]);str+=gam(14,o+c*i+c/2,p1[i]);});
  [0,1].forEach(r=>[0,1].forEach(k=>{const g=agGeno(p1[r],p2[k]);const on=hl(g);const x=o+c*k,y=o+c*r;
    str+=`<rect x="${x+1.5}" y="${y+1.5}" width="${c-3}" height="${c-3}" rx="7" fill="${on?'var(--her-soft)':'var(--surface)'}" stroke="${on?'var(--her)':'var(--line)'}" stroke-width="${on?3:1.2}"/>`;
    str+=`<g opacity="${on?1:.35}">${seedSv(x+c/2,y+c/2-6,9,agCol(g))}</g>`;
    if(lab)str+=`<text x="${x+c/2}" y="${y+c-6}" text-anchor="middle" font-size="11" font-weight="700" font-family="var(--f-mono)" fill="var(--ink)" opacity="${on?1:.55}">${g}</text>`;}));
  return svgOf(str,'0 0 124 124','agp');}
// área 4×4: linhas = 1º filho, colunas = 2º filho
function agArea(p1,p2,ev1,ev2){const cells=[];[0,1].forEach(r=>[0,1].forEach(k=>cells.push(agGeno(p1[r],p2[k]))));
  const c=26,o=36;let str='',n=0;
  cells.forEach((g,i)=>{str+=`<g>${seedSv(o+c*i+c/2,14,6.5,agCol(g))}</g>`;str+=`<g>${seedSv(14,o+c*i+c/2,6.5,agCol(g))}</g>`;});
  cells.forEach((g1,r)=>cells.forEach((g2,k)=>{const on=agOk(g1,ev1)&&agOk(g2,ev2);if(on)n++;
    str+=`<rect x="${o+c*k+1}" y="${o+c*r+1}" width="${c-2}" height="${c-2}" rx="4" fill="${on?'var(--her)':'var(--surface-2)'}" opacity="${on?.9:.8}"/>`;
    if(on)str+=`<text x="${o+c*k+c/2}" y="${o+c*r+c/2+4}" text-anchor="middle" font-size="11" font-weight="800" fill="#fff">✓</text>`;}));
  str+=`<text x="${o+2*c}" y="${o+4*c+16}" text-anchor="middle" font-size="10.5" fill="var(--muted)">2º filho →</text><text x="8" y="${o+2*c}" text-anchor="middle" font-size="10.5" fill="var(--muted)" transform="rotate(-90 8 ${o+2*c})">1º filho →</text>`;
  const e=svgOf(str,'0 0 '+(o+4*c+4)+' '+(o+4*c+24),'aga');e.n=n;return e;}
INIT.agencia=root=>{
  if(!document.getElementById('ag-css')){const st=document.createElement('style');st.id='ag-css';st.textContent=
`.agp{width:100%;max-width:150px;height:auto}.aga{width:100%;max-width:190px;height:auto}
.ag-card{display:flex;flex-direction:column;gap:8px;align-items:stretch}
.ag-card .ag-fig{display:flex;justify-content:center;align-items:center;gap:6px;flex-wrap:wrap;min-height:150px}
.ag-cap{font-size:.86rem;color:var(--muted);text-align:center;line-height:1.4}
.ag-cap b{color:var(--her)}
.ag-op{font:800 1.6rem var(--f-display);color:var(--her);padding:0 2px}
.ag-row{display:flex;flex-wrap:wrap;align-items:center;justify-content:center;gap:6px 4px}
.ag-mini{display:flex;flex-direction:column;align-items:center;gap:2px;width:118px}
.ag-mini .agp{max-width:110px}.ag-mini span{font-size:.8rem;color:var(--muted);text-align:center}
.ag-mini b{font-family:var(--f-mono);color:var(--her)}
.ag-bar{display:flex;height:30px;border-radius:8px;overflow:hidden;border:1px solid var(--line);width:100%;max-width:360px}
.ag-bar span{display:grid;place-items:center;font:700 .8rem var(--f-mono);border-right:2px solid var(--surface)}
.ag-tl{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px}
@media (max-width:560px){.ag-tl{grid-template-columns:1fr}}
.ag-tl>div{background:var(--surface);border:1px solid var(--line);border-radius:12px;padding:10px;display:flex;gap:10px;align-items:center}
.ag-tl svg{flex:none}
.ag-sieve{display:grid;grid-template-columns:repeat(auto-fill,minmax(44px,1fr));gap:6px}
.ag-sieve div{display:flex;gap:2px;justify-content:center;padding:4px 2px;border-radius:8px;border:1px solid transparent;opacity:.28}
.ag-sieve div.on{opacity:1;border-color:var(--her);background:var(--her-soft)}
.ag-sieve i{width:11px;height:11px;border-radius:50%;display:block;border:1px solid rgba(0,0,0,.25)}`;document.head.append(st);}
""")

# ---------- cards dos pedidos com ilustração
rep("""    h('div',{class:'cols three'},...[['Pedido A','Em Aa × Aa, qual a probabilidade de fenótipo recessivo no próximo descendente?'],['Pedido B','Em dois descendentes, qual a probabilidade de ambos serem aa? Considere eventos independentes.'],['Pedido C','Qual a probabilidade de um descendente ser AA ou Aa? Identifique por que as alternativas são mutuamente exclusivas.']].map(([a,b])=>h('div',{class:'stack stat-box',style:'gap:4px'},h('span',{class:'eyebrow'},a),h('p',{},b)))),""",
r"""    h('div',{class:'row',style:'gap:14px;align-items:center'},h('span',{class:'row',style:'gap:6px'},svgOf(seedSv(12,12,9,PEA.Y),'0 0 24 24'),h('span',{},h('b',{},'AA'),' ou ',h('b',{},'Aa'),': ervilha amarela')),h('span',{class:'row',style:'gap:6px'},svgOf(seedSv(12,12,9,PEA.G),'0 0 24 24'),h('span',{},h('b',{},'aa'),': ervilha verde'))),
    h('div',{class:'cols three'},...[
      ['Pedido A','Em Aa × Aa, qual a probabilidade de fenótipo recessivo no próximo descendente?',()=>agPunnett('Aa','Aa',g=>g==='aa'),h('span',{},'O quadro tem 4 casas igualmente prováveis. Só ',h('b',{},'1'),' é verde (aa): ',h('b',{},'1/4'),'.')],
      ['Pedido B','Em dois descendentes, qual a probabilidade de ambos serem aa? Considere eventos independentes.',()=>agArea('Aa','Aa','aa','aa'),h('span',{},'Cada filho tem 4 resultados; dois filhos juntos têm 4 × 4 = 16 combinações. Só ',h('b',{},'1'),' tem os dois verdes: ',h('b',{},'1/4 × 1/4 = 1/16'),'. ',h('b',{},'“E” multiplica.'))],
      ['Pedido C','Qual a probabilidade de um descendente ser AA ou Aa? Identifique por que as alternativas são mutuamente exclusivas.',()=>agPunnett('Aa','Aa',g=>g!=='aa'),h('span',{},'AA ocupa 1 casa e Aa ocupa 2. Uma ervilha não cai em duas casas ao mesmo tempo, então dá para somar: ',h('b',{},'1/4 + 2/4 = 3/4'),'. ',h('b',{},'“Ou” soma.'))]
    ].map(([a,b,fig,cap])=>h('div',{class:'stat-box ag-card'},h('span',{class:'eyebrow'},a),h('p',{style:'margin:0'},b),
      (()=>{const d=h('details',{},h('summary',{class:'btn ghost sm',style:'list-style:none;display:inline-flex'},'👀 Ver a ilustração'),h('div',{class:'stack',style:'gap:6px;margin-top:8px'},h('div',{class:'ag-fig'},fig()),h('p',{class:'ag-cap',style:'margin:0'},cap)));return d;})()))),""")

# ---------- ilustração viva no "Monte um pedido"
rep("""  const body=h('div',{class:'stack'});const res=h('div',{});
  L.append(h('span',{class:'label'},'Cruzamento'),crossSel,h('span',{class:'label'},'Tipo de pedido'),modoSel,body,res,""",
"""  const body=h('div',{class:'stack'});const res=h('div',{});const fig=h('div',{class:'stack',style:'gap:8px;align-items:center'});
  L.append(h('span',{class:'label'},'Cruzamento'),crossSel,h('span',{class:'label'},'Tipo de pedido'),modoSel,body,fig,res,""")
rep("""      const ps=evs.slice(0,nf).map(e=>pOf(e,d));const p=ps.reduce((a,b)=>a*b,1);
      res.innerHTML='';""",
"""      const ps=evs.slice(0,nf).map(e=>pOf(e,d));const p=ps.reduce((a,b)=>a*b,1);
      const [p1,p2]=CR[cr];fig.innerHTML='';const row=h('div',{class:'ag-row'});
      evs.slice(0,nf).forEach((e,i)=>{if(i)row.append(h('span',{class:'ag-op'},'×'));row.append(h('div',{class:'ag-mini'},agPunnett(p1,p2,g=>agOk(g,e)),h('span',{},(i+1)+'º filho: ',h('b',{},F(ps[i])))));});
      row.append(h('span',{class:'ag-op'},'='),h('span',{class:'big-num',style:'color:var(--her)'},F(p)));
      fig.append(h('span',{class:'label'},'Ilustração: as casas acesas atendem ao pedido'),row);
      if(nf===2){const a=agArea(p1,p2,evs[0],evs[1]);fig.append(h('div',{class:'ag-row',style:'gap:12px'},a,h('p',{class:'ag-cap',style:'max-width:240px;text-align:left;margin:0'},'Os dois filhos juntos: 4 × 4 = 16 combinações igualmente prováveis. ',h('b',{},a.n+' de 16'),' atendem ao pedido = '+F(a.n/16)+'.')));}
      else if(nf>2)fig.append(h('p',{class:'ag-cap',style:'margin:0'},`Com ${nf} filhos são ${fmt(Math.pow(4,nf))} combinações: em vez de desenhar todas, multiplique as chances de cada filho.`));
      res.innerHTML='';""")
rep("""      const ps=['AA','Aa','aa'].filter(k=>ouSet.includes(k)).map(k=>[k,d[k]||0]);const p=ps.reduce((a,b)=>a+b[1],0);
      res.innerHTML='';""",
"""      const ps=['AA','Aa','aa'].filter(k=>ouSet.includes(k)).map(k=>[k,d[k]||0]);const p=ps.reduce((a,b)=>a+b[1],0);
      const [p1,p2]=CR[cr];fig.innerHTML='';const bar=h('div',{class:'ag-bar'});
      ['AA','Aa','aa'].forEach(k=>{const q=d[k]||0;if(!q)return;const on=ouSet.includes(k);bar.append(h('span',{style:`flex:${q};background:${on?'var(--her)':'var(--surface-2)'};color:${on?'#fff':'var(--muted)'}`},k+' '+F(q)));});
      fig.append(h('span',{class:'label'},'Ilustração: as casas acesas atendem ao pedido'),h('div',{class:'ag-row',style:'gap:14px'},h('div',{class:'ag-mini',style:'width:150px'},agPunnett(p1,p2,g=>ouSet.includes(g))),
        h('div',{class:'stack',style:'gap:6px;max-width:360px;flex:1;min-width:200px'},bar,h('p',{class:'ag-cap',style:'text-align:left;margin:0'},ps.length?`${ps.filter(x=>x[1]>0).length>1?'As partes acesas não se sobrepõem, então somamos: ':'Parte acesa: '}${F(p)} da barra.`:'Marque um genótipo para acender as casas.'))));
      res.innerHTML='';""")

# ---------- independência: linha do tempo + peneira
rep("""  R.append(h('p',{},'Simule muitas famílias Aa × Aa com três filhos. Separe só as famílias em que os dois primeiros foram aa. Com que frequência o terceiro também é aa?'));
  const out=h('div',{class:'stack'});""",
"""  const tlBox=(col,t1,t2,q)=>h('div',{},q?svgOf(`<circle cx="22" cy="22" r="19" fill="var(--surface-2)" stroke="var(--her)" stroke-width="2" stroke-dasharray="4 3"/><text x="22" y="29" text-anchor="middle" font-size="20" font-weight="800" fill="var(--her)">?</text>`,'0 0 44 44'):svgOf(seedSv(22,22,16,col),'0 0 44 44'),h('div',{class:'stack',style:'gap:2px'},h('b',{},t1),h('span',{class:'note'},t2)));
  [...R.querySelectorAll('svg')].forEach(x=>x.setAttribute('width','44'));
  R.append(h('div',{class:'ag-tl'},tlBox(PEA.G,'1º filho: aa','verde'),tlBox(PEA.G,'2º filho: aa','verde de novo'),tlBox(null,'3º filho: ?','A chance de verde caiu, subiu ou continua 1/4?',true)),
    h('p',{class:'note',style:'margin:0'},'Pense numa moeda: depois de duas caras, a moeda não “sabe” o que saiu antes. Cada filho vem de um novo encontro de gametas.'),
    h('p',{},'Teste: simule muitas famílias Aa × Aa com três filhos. Separe só as famílias em que os dois primeiros foram aa. Com que frequência o terceiro também é aa?'));
  R.querySelectorAll('.ag-tl svg').forEach(x=>{x.setAttribute('width','44');x.setAttribute('height','44');});
  const out=h('div',{class:'stack'});""")
rep("""const N=20000;for(let i=0;i<N;i++){const k=()=>Math.random()<.25;const a=k(),b=k(),c=k();tot++;if(a&&b){fam++;if(c)hit++;}}
    out.innerHTML='';out.append(""",
"""const N=20000;const amostra=[];for(let i=0;i<N;i++){const k=()=>Math.random()<.25;const a=k(),b=k(),c=k();tot++;if(i<64)amostra.push([a,b,c]);if(a&&b){fam++;if(c)hit++;}}
    const sieve=h('div',{class:'ag-sieve'},...amostra.map(f=>h('div',{class:f[0]&&f[1]?'on':''},...f.map(v=>h('i',{style:'background:'+(v?PEA.G:PEA.Y)})))));
    const nOn=amostra.filter(f=>f[0]&&f[1]).length;
    out.innerHTML='';out.append(h('span',{class:'label'},'Peneira: 64 das famílias simuladas (cada uma = 3 ervilhas)'),sieve,h('p',{class:'note',style:'margin:0'},`Destacadas: as ${nOn} famílias em que os dois primeiros filhos foram verdes (aa). Olhe só a terceira ervilha delas. Abaixo, o mesmo para todas as ${fmt(tot)} famílias.`),""")

# ---------- auditoria individual (sem troca de relatórios)
rep("""  root.append(panel(h('h3',{},'Auditoria entre pares'),h('p',{},'Troquem os relatórios. Para cada pedido, procurem: o cálculo está certo? A operação (produto ou soma) foi justificada? A condição de validade foi escrita? Localize uma conta correta sem justificativa e complete a explicação.'),h('p',{class:'note'},'Sem apostas e sem premiação por acerto aleatório.')));""",
r"""  const AUD=[{who:'Estagiário 1',t:'Pedido B: 1/4 + 1/4 = 1/2, porque são dois filhos.',ok:false,ex:'Erro. “Os dois filhos aa” é um pedido com “e”: os dois precisam acontecer. Multiplica-se: 1/4 × 1/4 = 1/16. Somar daria uma chance maior do que a de cada filho sozinho, o que não faz sentido.'},
    {who:'Estagiária 2',t:'Pedido C: 1/4 + 2/4 = 3/4, porque um descendente não pode ser AA e Aa ao mesmo tempo.',ok:true,ex:'Correto e bem justificado: as alternativas não se sobrepõem (são mutuamente exclusivas), então podem ser somadas.'},
    {who:'Estagiário 3',t:'Já nasceram dois filhos aa. Então o terceiro tem chance menor do que 1/4 de ser aa.',ok:false,ex:'Erro. Cada filho vem de uma nova fecundação, independente das anteriores. A chance continua 1/4.'},
    {who:'Estagiária 4',t:'Pedido A: 1/4.',ok:false,ex:'A conta está certa, mas falta a justificativa e a condição de validade: de Aa × Aa saem 4 combinações igualmente prováveis, e só 1 é aa (modelo de dominância completa, gametas com a mesma chance).'}];
  const audBox=h('div',{class:'stack',style:'gap:10px'});const aud=store.get('ag-aud',{});
  AUD.forEach((a,i)=>{const fb=h('div',{});const show=()=>{fb.innerHTML='';if(aud[i]==null)return;const acertou=(aud[i]==='ok')===a.ok;fb.append(h('div',{class:'fb '+(acertou?'ok':'no')},h('strong',{},acertou?'Boa auditoria. ':'Olhe de novo. '),a.ex));};
    audBox.append(h('div',{class:'stat-box stack',style:'gap:8px'},h('div',{class:'row',style:'gap:10px;align-items:center'},svgOf(`<circle cx="18" cy="13" r="8" fill="var(--her-soft)" stroke="var(--her)" stroke-width="1.6"/><path d="M4 34 q14 -18 28 0" fill="var(--her-soft)" stroke="var(--her)" stroke-width="1.6"/>`,'0 0 36 36'),h('span',{class:'eyebrow'},a.who)),
      h('p',{style:'margin:0;font-style:italic'},'“'+a.t+'”'),chipsPick([['ok','✔ Aprovado'],['erro','✘ Precisa corrigir']],aud[i],v=>{aud[i]=v;store.set('ag-aud',aud);show();}),fb));show();});
  audBox.querySelectorAll('.stat-box>.row svg').forEach(x=>{x.setAttribute('width','36');x.setAttribute('height','36');});
  root.append(panel(h('h3',{},'Auditoria da agência'),h('p',{},'Estagiários da agência entregaram estas respostas. Para cada uma, decida: pode ir para o cliente ou precisa ser corrigida? Confira o cálculo, a operação (produto ou soma) e a justificativa.'),audBox));""")
# remove linha errada (selecionava svgs do painel R antes da hora)
rep("  [...R.querySelectorAll('svg')].forEach(x=>x.setAttribute('width','44'));\n","")
open(p,'w').write(t)
