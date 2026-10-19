p='src/sites/genetica.html';t=open(p).read()
o="extend('abo',root=>{\n  const GR=['A','B','AB','O'];"
assert t.count(o)==1
n=r"""// ---------- Aula 7: O que é tipagem sanguínea ----------
const ABC_COR={'anti-A':'#2c58a5','anti-B':'#c8513b'};
function anticorpoSv(x,y,ang,r,sc=1){const c=ABC_COR[r];const tip=r==='anti-A'?`<path d="M-12,-13 l3,-5 l3,5" stroke="${c}" stroke-width="2.4" fill="none"/><path d="M6,-13 l3,-5 l3,5" stroke="${c}" stroke-width="2.4" fill="none"/>`:`<path d="M-13,-12 v-5 h7 v5" stroke="${c}" stroke-width="2.4" fill="none"/><path d="M6,-12 v-5 h7 v5" stroke="${c}" stroke-width="2.4" fill="none"/>`;
  return `<g transform="translate(${x} ${y}) rotate(${ang}) scale(${sc})"><path d="M0,14 V0 M0,0 L-9,-11 M0,0 L9,-11" stroke="${c}" stroke-width="3.6" stroke-linecap="round" fill="none"/>${tip}</g>`;}
extend('abo',root=>{
  if(!document.getElementById('tip-css')){const st=document.createElement('style');st.id='tip-css';st.textContent=
`.tip-steps{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:10px}
@media (max-width:900px){.tip-steps{grid-template-columns:repeat(2,minmax(0,1fr))}}
@media (max-width:520px){.tip-steps{grid-template-columns:1fr}}
.tip-steps>div{background:var(--surface);border:1px solid var(--line);border-radius:14px;padding:12px;display:flex;flex-direction:column;gap:6px}
.tip-steps svg{width:100%;height:auto;max-height:120px}
.tip-steps b.n{display:inline-grid;place-items:center;width:24px;height:24px;border-radius:50%;background:var(--her);color:#fff;font:800 .78rem var(--f-mono);margin-right:6px}
.tip-steps p{margin:0;font-size:.92rem;line-height:1.45}`;document.head.append(st);}
  const card=(n,tit,sv,txt)=>h('div',{},h('strong',{},h('b',{class:'n'},String(n)),tit),svgOf(sv,'0 0 200 110'),h('p',{},txt));
  const bg='<rect width="200" height="110" rx="12" fill="#f6eeee"/>';
  const steps=h('div',{class:'tip-steps'},
    card(1,'O sangue tem hemácias',bg+[[40,40],[95,68],[150,38],[60,85],[160,82]].map(([x,y])=>`<ellipse cx="${x}" cy="${y}" rx="22" ry="20" fill="#d9605e"/><ellipse cx="${x}" cy="${y}" rx="12" ry="10" fill="#c44a49"/>`).join(''),
      h('span',{},'As ',h('b',{},'hemácias'),' (glóbulos vermelhos) são as células que deixam o sangue vermelho e transportam oxigênio.')),
    card(2,'Hemácias têm “etiquetas”',bg+rbcSv('A',40,55,.85)+rbcSv('B',100,55,.85)+rbcSv('O',160,55,.85),
      h('span',{},'Na superfície da hemácia pode haver moléculas chamadas ',h('b',{},'antígenos'),': o antígeno A (▲) e o antígeno B (■). Quem tem só A é do grupo A; só B, grupo B; os dois, grupo AB; nenhum, grupo O.')),
    card(3,'O soro tem anticorpos',bg+anticorpoSv(60,58,0,'anti-A',1.8)+anticorpoSv(140,58,0,'anti-B',1.8)+`<text x="60" y="102" text-anchor="middle" font-size="12" font-weight="700" fill="#2c58a5">anti-A</text><text x="140" y="102" text-anchor="middle" font-size="12" font-weight="700" fill="#c8513b">anti-B</text>`,
      h('span',{},'O laboratório usa soros com ',h('b',{},'anticorpos'),' em forma de Y. O anti-A só se encaixa no antígeno A; o anti-B, só no B. Cada anticorpo tem ',h('b',{},'duas pontas'),'.')),
    card(4,'Aglutinação: as hemácias grudam',bg+rbcSv('A',62,56,.95)+rbcSv('A',138,56,.95)+anticorpoSv(100,48,90,'anti-A',1.2)+anticorpoSv(100,66,90,'anti-A',1.2),
      h('span',{},'Se o antígeno combina com o anticorpo, cada Y prende ',h('b',{},'duas hemácias ao mesmo tempo'),'. Elas se juntam em grumos visíveis: é a ',h('b',{},'aglutinação'),'.')));
  // laboratório por dentro
  let g=store.get('tip-g','A'),r=store.get('tip-r','anti-A');const sv=s('svg',{viewBox:'0 0 640 230',class:'chart',role:'img','aria-label':'Hemácias e anticorpos dentro da gota'});const cap=h('div',{});
  const SP=[[90,70],[250,170],[330,62],[520,160],[150,178],[560,66]],CL=[[205,92],[253,115],[211,140],[430,90],[478,112],[438,138]];
  const PAIRS=[[0,1],[1,2],[0,2],[3,4],[4,5],[3,5]];const FREE=[[40,140,20],[200,40,-30],[300,130,50],[400,40,10],[460,200,-60],[600,130,30],[360,200,80],[120,120,-10]];
  let cur=SP.map(p=>p.slice());
  const aggl=()=>r==='anti-A'?(g==='A'||g==='AB'):(g==='B'||g==='AB');
  function frame(pos,bind,tt){let str='<rect width="640" height="230" rx="14" fill="#f6eeee"/>';
    if(!bind)FREE.forEach(([x,y,a])=>str+=anticorpoSv(x,y,a,r,1.25));
    pos.forEach(([x,y])=>str+=rbcSv(g,x,y,.85));
    if(bind)PAIRS.forEach(([i,j])=>{const [x1,y1]=pos[i],[x2,y2]=pos[j];const mx=(x1+x2)/2,my=(y1+y2)/2;const ang=Math.atan2(y2-y1,x2-x1)*180/Math.PI+90;
      str+=`<g opacity="${tt}">${anticorpoSv(mx,my,ang,r,1.1)}</g>`;});
    sv.innerHTML=str;}
  async function anim(){const ag=aggl();const from=cur.map(p=>p.slice());const to=ag?CL:SP;
    await tween(ag?900:500,e=>{const pos=from.map((p,i)=>[lerp(p[0],to[i][0],e),lerp(p[1],to[i][1],e)]);frame(pos,ag,e);});cur=to.map(p=>p.slice());frame(cur,ag,1);
    const nomeAg=g==='O'?'nenhum antígeno':g==='AB'?'os antígenos A e B':'o antígeno '+g;
    cap.innerHTML='';cap.append(h('div',{class:'fb '+(ag?'no':'info')},h('strong',{},ag?'Aglutinou. ':'Não aglutinou. '),
      `Hemácias do grupo ${g} têm ${nomeAg}. O soro ${r} tem anticorpos que se encaixam só no antígeno ${r.slice(-1)}. `+(ag?'Como a hemácia tem esse antígeno, cada anticorpo prende duas hemácias e elas formam grumos.':'Como a hemácia não tem esse antígeno, os anticorpos ficam soltos e as hemácias continuam separadas.')));}
  const gSeg=seg(['A','B','AB','O'].map(x=>[x,'Grupo '+x]),g,v=>{g=v;store.set('tip-g',v);cur=SP.map(p=>p.slice());anim();},{label:'Grupo da amostra'});
  const rSeg=seg([['anti-A','Soro anti-A'],['anti-B','Soro anti-B']],r,v=>{r=v;store.set('tip-r',v);cur=SP.map(p=>p.slice());anim();},{label:'Soro'});
  frame(cur,false,0);setTimeout(anim,50);
  const LEIT=[['A','sim','não'],['B','não','sim'],['AB','sim','sim'],['O','não','não']];
  const tab=h('div',{class:'tbl-wrap'},h('table',{class:'data'},h('tr',{},h('th',{},'Com anti-A'),h('th',{},'Com anti-B'),h('th',{},'Antígenos na hemácia'),h('th',{},'Grupo')),
    ...LEIT.map(([gr,a,b])=>h('tr',{},h('td',{},a==='sim'?'✔ aglutina':'— não aglutina'),h('td',{},b==='sim'?'✔ aglutina':'— não aglutina'),h('td',{},gr==='O'?'nenhum':gr==='AB'?'A e B':gr),h('td',{},h('b',{},gr))))));
  // checagem rápida
  const Q=[['Uma amostra aglutinou só com o soro anti-B. Qual é o grupo?','B','Aglutinar com anti-B mostra que a hemácia tem o antígeno B; não aglutinar com anti-A mostra que não tem o A.'],['Uma amostra não aglutinou com nenhum dos dois soros. Qual é o grupo?','O','Sem antígeno A nem B, nenhum anticorpo encontra onde se encaixar.'],['Uma amostra aglutinou com os dois soros. Qual é o grupo?','AB','A hemácia tem os dois antígenos: os dois soros encontram onde se encaixar.']];
  const qa=store.get('tip-q',{});const qBox=h('div',{class:'stack',style:'gap:10px'});
  Q.forEach(([q,k,ex],i)=>{const fb=h('div',{});const sh=()=>{fb.innerHTML='';if(qa[i]==null)return;fb.append(h('div',{class:'fb '+(qa[i]===k?'ok':'no')},h('strong',{},qa[i]===k?'Isso! ':'Ainda não. '),ex));};
    qBox.append(h('div',{class:'stack',style:'gap:4px'},h('b',{},q),chipsPick(['A','B','AB','O'],qa[i]??null,v=>{qa[i]=v;store.set('tip-q',qa);sh();}),fb));sh();});
  root.append(panel(h('span',{class:'eyebrow'},'Antes do laboratório'),h('h3',{},'O que é tipagem sanguínea?'),
    h('p',{},h('b',{},'Tipagem sanguínea'),' é o exame que descobre o grupo sanguíneo de uma pessoa (A, B, AB ou O). Ela olha para a ',h('b',{},'superfície das hemácias'),': quais antígenos estão lá. Isso importa, por exemplo, antes de uma ',h('b',{},'transfusão'),': receber hemácias com um antígeno que o próprio corpo não tem pode provocar uma reação grave.'),
    steps,
    h('span',{class:'label'},'Veja por dentro da gota'),h('div',{class:'row'},gSeg),h('div',{class:'row'},rSeg),sv,cap,
    h('span',{class:'label'},'Como ler o resultado'),tab,
    h('p',{class:'note',style:'margin:0'},'No laboratório real, uma gota de sangue recebe soro anti-A e outra recebe soro anti-B. Também se testa o fator Rh (com soro anti-D), que é determinado por outro gene e não entra no modelo desta aula.'),
    h('span',{class:'label'},'Confira se entendeu'),qBox));
});

"""
t=t.replace(o,n+o)
# texto do simulador de tipagem virtual: reforça
o2="'Amostras fictícias. Escolha o reagente e toque nos poços para pingar. Aglutinação indica que a hemácia tem o antígeno correspondente.'"
assert t.count(o2)==1
t=t.replace(o2,"'Agora você é o técnico do laboratório. Quatro amostras fictícias: escolha o soro (anti-A ou anti-B) e toque nos poços para pingar. Se aglutinar, a hemácia tem o antígeno daquele soro. Use a tabela “Como ler o resultado” acima.'")
open(p,'w').write(t)
