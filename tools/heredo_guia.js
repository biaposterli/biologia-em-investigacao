// ---------- Aula 4: Guia completo do heredograma ----------
// Notação compacta: cada geração é uma linha de pessoas "sexo+x+marcas" (m homem, f mulher, u não informado;
// a afetado, c portador, d falecido, p probando, q genótipo sem manifestação, n mutação nova).
// Uniões: "I1+I2>II2,II3" (união comum) ou "III2=III3>IV1" (união consanguínea).
const ROM=['I','II','III','IV','V'];
function pedParse(spec){const P={};
  spec.g.forEach((line,gi)=>line.trim().split(/\s+/).forEach((tok,i)=>{const m=tok.match(/^([mfu])(\d+)([a-z]*)$/);const id=ROM[gi]+'-'+(i+1);P[id]={id,g:gi,sex:m[1],x:+m[2],f:m[3]||''};}));
  const ref=s=>{const q=s.match(/^([IV]+)(\d+)$/);return q[1]+'-'+q[2];};
  const U=(spec.u||[]).map(s=>{const m=s.match(/^([IV]+\d+)([+=])([IV]+\d+)(?:>(.*))?$/);return {a:ref(m[1]),b:ref(m[3]),cons:m[2]==='=',kids:(m[4]||'').split(',').filter(Boolean).map(ref)};});
  return {P,U,ng:spec.g.length};}
let pedClip=0;
function pedDraw(ped,{carriers=false,onTap=null,hl=null,fill=null,num=true,path=null,W=640}={}){
  const r=17,Y=g=>46+g*96,H=Y(ped.ng-1)+52;const fz=innerWidth<600?1.45:1;const xs0=Object.values(ped.P).map(p=>p.x);const X0=Math.min(...xs0)-70,X1=Math.max(...xs0)+34;
  const sv=s('svg',{viewBox:`${X0} 0 ${X1-X0} ${H}`,class:'chart ped',role:'img','aria-label':'Heredograma'});sv.style.maxWidth=Math.round((X1-X0)*1.15)+'px';sv.style.marginInline='auto';sv.style.display='block';
  sv.append(s('rect',{x:X0,width:X1-X0,height:H,fill:'var(--surface)'}));
  const hot=(el,k,id)=>{if(!onTap)return el;el.setAttribute('class','ped-hot');el.style.cursor='pointer';el.addEventListener('click',ev=>{ev.stopPropagation();onTap(k,id);});return el;};
  for(let g=0;g<ped.ng;g++)sv.append(hot(s('text',{x:X0+8,y:Y(g)+6,'font-size':17*fz,'font-weight':800,fill:'var(--ink)','font-family':'var(--f-display)'},ROM[g]),'ger',ROM[g]));
  ped.U.forEach(u=>{const A=ped.P[u.a],B=ped.P[u.b];const y=Y(A.g);const x1=Math.min(A.x,B.x)+r,x2=Math.max(A.x,B.x)-r;const mx=(A.x+B.x)/2;
    const gU=s('g',{});
    if(u.cons){gU.append(s('line',{x1,x2,y1:y-3.5,y2:y-3.5,stroke:'var(--ink)','stroke-width':2.2}),s('line',{x1,x2,y1:y+3.5,y2:y+3.5,stroke:'var(--ink)','stroke-width':2.2}));}
    else gU.append(s('line',{x1,x2,y1:y,y2:y,stroke:'var(--ink)','stroke-width':2.2}));
    gU.append(s('rect',{x:x1,y:y-9,width:Math.max(4,x2-x1),height:18,fill:'transparent'}));sv.append(hot(gU,u.cons?'cons':'uniao',u.a+'|'+u.b));
    if(u.kids.length){const ys=y+48;const xs=u.kids.map(k=>ped.P[k].x);const gD=s('g',{});
      gD.append(s('line',{x1:mx,x2:mx,y1:y+(u.cons?3.5:0),y2:ys,stroke:'var(--ink)','stroke-width':2.2}));
      gD.append(s('line',{x1:Math.min(mx,...xs),x2:Math.max(mx,...xs),y1:ys,y2:ys,stroke:'var(--ink)','stroke-width':2.2}));
      xs.forEach(x=>gD.append(s('line',{x1:x,x2:x,y1:ys,y2:Y(ped.P[u.kids[0]].g)-r,stroke:'var(--ink)','stroke-width':2.2})));
      gD.append(s('rect',{x:Math.min(mx,...xs)-4,y:ys-8,width:Math.max(mx,...xs)-Math.min(mx,...xs)+8,height:16,fill:'transparent'}));
      sv.append(hot(gD,'desc',u.a+'|'+u.b));}});
  if(path){path.forEach(pts=>{sv.append(s('polyline',{points:pts.map(id=>ped.P[id].x+','+Y(ped.P[id].g)).join(' '),fill:'none',stroke:'#e0a020','stroke-width':7,'stroke-linejoin':'round','stroke-linecap':'round',opacity:.55}));});}
  Object.values(ped.P).forEach(p=>{const x=p.x,y=Y(p.g);const af=p.f.includes('a');const g=s('g',{});
    const sel=hl&&hl.includes(p.id);const st=sel?'var(--her)':'var(--ink)',sw=sel?4:2.4;
    const shape=(fillc,extra={})=>p.sex==='m'?s('rect',Object.assign({x:x-r,y:y-r,width:2*r,height:2*r,fill:fillc},extra)):p.sex==='f'?s('circle',Object.assign({cx:x,cy:y,r:r+1,fill:fillc},extra)):s('path',Object.assign({d:`M${x},${y-r-3} L${x+r+3},${y} L${x},${y+r+3} L${x-r-3},${y}Z`,fill:fillc},extra));
    const lev=fill&&fill[p.id]!=null?fill[p.id]:(af?1:0);
    g.append(shape('var(--surface)'));
    if(lev>0){const id='pc'+(++pedClip);const cp=s('clipPath',{id});cp.append(s('rect',{x:x-r-4,y:y+r+4-(2*r+8)*lev,width:2*r+8,height:(2*r+8)*lev}));g.append(cp);g.append(shape('var(--her)',{'clip-path':`url(#${id})`}));}
    g.append(shape('none',{stroke:st,'stroke-width':sw}));
    if(carriers&&p.f.includes('c'))g.append(s('circle',{cx:x,cy:y,r:5,fill:'var(--ink)'}));
    if(p.f.includes('q'))g.append(s('text',{x,y:y+6,'text-anchor':'middle','font-size':17,'font-weight':800,fill:'var(--her)'},'?'));
    if(p.f.includes('d'))g.append(s('line',{x1:x-r-7,y1:y+r+7,x2:x+r+7,y2:y-r-7,stroke:'var(--ink)','stroke-width':2.4}));
    if(p.f.includes('p')){g.append(s('path',{d:`M${x-r-26},${y+r+16} L${x-r-6},${y+r-2}`,stroke:'var(--ink)','stroke-width':2.4}));g.append(s('path',{d:`M${x-r-3},${y+r-5} l-10,2 l7,7z`,fill:'var(--ink)'}));}
    if(p.f.includes('n'))g.append(s('path',{d:`M${x+r+6},${y-r-8} l-6,10 h6 l-5,10`,stroke:'#e0a020','stroke-width':2.6,fill:'none','stroke-linejoin':'round'}));
    if(num)g.append(s('text',{x,y:y+r+12+6*fz,'text-anchor':'middle','font-size':14*fz,'font-weight':700,fill:'var(--muted)','font-family':'var(--f-mono)'},p.id.split('-')[1]));
    g.append(s('rect',{x:x-r-6,y:y-r-6,width:2*r+12,height:2*r+12,fill:'transparent'}));
    sv.append(hot(g,'pessoa',p.id));});
  return sv;}
function pedMini(str,vb='0 0 70 50'){const e=svgOf(str,vb,'ped-mini');return e;}

const GUIA_FAM=pedParse({g:['m260d f380','f110 m190 f430 m520','m110 f270c m350c f540','m280ap f360'],
  u:['I1+I2>II2,II3','II1+II2>III1,III2','II3+II4>III3,III4','III2=III3>IV1,IV2']});

const PADROES={
  ad:{nome:'Autossômica dominante',onde:'autossomo',ped:{g:['m260a f380','f100 m180a f320 f460a m540','m100a f200 f440 m560a'],u:['I1+I2>II2,II3,II4','II1+II2>III1,III2','II4+II5>III3,III4']},
    pistas:['Aparece em todas as gerações (não “pula” geração).','Afeta homens e mulheres em proporções parecidas.','Toda pessoa afetada tem pelo menos um genitor afetado.','Pai afetado pode ter filho homem afetado (o que descarta herança ligada ao X).']},
  ar:{nome:'Autossômica recessiva',onde:'autossomo',ped:{g:['m260 f380','f100 m180 f320a m460 f540','f100a m200 m440 f560a'],u:['I1+I2>II2,II3,II4','II1+II2>III1,III2','II4+II5>III3,III4']},carr:['I-1','I-2','II-1','II-2','II-4','II-5'],
    pistas:['Pode “pular” gerações.','Pais sem a característica podem ter filhos afetados: os dois são portadores (Aa).','Afeta homens e mulheres em proporções parecidas.','É mais comum em uniões consanguíneas.']},
  xd:{nome:'Ligada ao X dominante',onde:'X',ped:{g:['m260a f380','m100 f180a m320 f460a m540','m80a f150 m220 f440a m560'],u:['I1+I2>II2,II3,II4','II1+II2>III1,III2,III3','II4+II5>III4,III5']},
    pistas:['Pai afetado passa para TODAS as filhas e para NENHUM filho homem (o filho recebe o Y do pai).','Mãe afetada heterozigota passa para cerca de metade dos filhos, de ambos os sexos.','Costuma haver mais mulheres afetadas do que homens.']},
  xr:{nome:'Ligada ao X recessiva',onde:'X',ped:{g:['m260a f380','m100 f180c m320 f460c m540','m80a f150 m220 m440a f560'],u:['I1+I2>II2,II3,II4','II1+II2>III1,III2,III3','II4+II5>III4,III5']},carr:['II-2','II-4'],
    pistas:['Afeta principalmente homens.','Homem afetado não passa para os filhos homens, mas todas as filhas recebem o alelo (portadoras).','Mulheres portadoras geralmente não manifestam e podem ter filhos homens afetados: parece “pular” geração pelo lado feminino.']},
  y:{nome:'Ligada ao Y',onde:'Y',ped:{g:['m260a f380','f100 m180a f320 m460a f540','m100a f200 m440a f560'],u:['I1+I2>II2,II3,II4','II1+II2>III1,III2','II4+II5>III3,III4']},
    pistas:['Só homens são afetados.','Pai afetado passa para TODOS os filhos homens.','Nunca passa por mulheres. É um padrão raro: o cromossomo Y tem poucos genes.']},
  mt:{nome:'Mitocondrial',onde:'mitocôndria',ped:{g:['m260 f380a','m100 f180a m320a f400','m100a f180a m340 f420'],u:['I1+I2>II2,II3','II1+II2>III1,III2','II3+II4>III3,III4']},
    pistas:['É transmitida pela mãe: as mitocôndrias do zigoto vêm do óvulo.','Mãe afetada pode passar para todos os filhos, de ambos os sexos.','Homem afetado NÃO passa para nenhum filho.','A intensidade pode variar muito entre irmãos (cada célula tem muitas mitocôndrias, nem todas com a alteração).']}};
const DESAFIO=[
  {k:'xr',ped:{g:['m260 f380c','m140a f220 f420c m520','m380a f460 m560a'],u:['I1+I2>II1,II2,II3','II3+II4>III1,III2,III3']},carr:['I-2','II-3']},
  {k:'ad',ped:{g:['m260 f380a','m120a f200 f330 m420a f520','f100a m200a m380 f460a'],u:['I1+I2>II1,II3,II4','II1+II2>III1,III2','II4+II5>III3,III4']}},
  {k:'mt',ped:{g:['m260a f380','f120a m200 m360 f440a','m100a f180a m340a f420a f500a'],u:['I1+I2>II2,II3','II1+II2>III1,III2','II3+II4>III3,III4,III5']}},
  {k:'y',ped:{g:['m260a f380','m140a f220 m320a f400 f520','m120a f200 m300a m380a'],u:['I1+I2>II1,II3,II5','II1+II2>III1,III2','II3+II4>III3,III4']}},
  {k:'ar',ped:{g:['m200 f300 m400 f500','m250 f450','f300a m400'],u:['I1+I2>II1','I3+I4>II2','II1+II2>III1,III2']},carr:['II-1','II-2']},
  {k:'xd',ped:{g:['m260 f380a','m120a f200 f330a m420','f100a m180 m300a f380 m460 f540a'],u:['I1+I2>II1,II3','II1+II2>III1,III2','II3+II4>III3,III4,III5,III6']}}];
const ONDE_SV={autossomo:'<rect x="16" y="6" width="12" height="38" rx="6" fill="#b9c3d6" stroke="#566074"/><rect x="34" y="6" width="12" height="38" rx="6" fill="#b9c3d6" stroke="#566074"/><rect x="16" y="20" width="12" height="5" fill="var(--her)"/><rect x="34" y="20" width="12" height="5" fill="var(--her)"/>',
  X:'<path d="M14,6 L40,44 M40,6 L14,44" stroke="#566074" stroke-width="8" stroke-linecap="round"/><path d="M21,16 L26,24" stroke="var(--her)" stroke-width="8"/>',
  Y:'<path d="M14,6 L27,24 L40,6 M27,24 V44" stroke="#566074" stroke-width="8" stroke-linecap="round" fill="none"/><path d="M27,32 V38" stroke="var(--her)" stroke-width="8"/>',
  'mitocôndria':'<ellipse cx="28" cy="25" rx="22" ry="13" fill="#f2d9b8" stroke="#a5672e" stroke-width="2"/><path d="M12,25 q4,-9 8,0 t8,0 t8,0 t8,0" stroke="#a5672e" stroke-width="2" fill="none"/><circle cx="20" cy="17" r="3" fill="var(--her)"/>'};

extend('heredo',root=>{
  if(!document.getElementById('hg-css')){const st=document.createElement('style');st.id='hg-css';st.textContent=
`.hg-nav{display:flex;flex-wrap:wrap;gap:6px}
.hg-nav button{border:1px solid var(--line);background:var(--surface);border-radius:999px;padding:6px 12px;font:600 .85rem var(--f-body);color:var(--ink);cursor:pointer}
.hg-nav button[aria-current="true"]{background:var(--her);border-color:var(--her);color:#fff}
.hg-nav button b{font-family:var(--f-mono);margin-right:4px}
.ped-hot:hover{opacity:.82}
.hg-leg{display:grid;grid-template-columns:repeat(auto-fill,minmax(130px,1fr));gap:8px}
.hg-leg>div{display:flex;flex-direction:column;align-items:center;gap:4px;text-align:center;background:var(--surface);border:1px solid var(--line);border-radius:12px;padding:8px;font-size:.84rem;line-height:1.3}
.ped-mini{width:70px;height:50px}
.hg-card{background:var(--surface);border:1px solid var(--line);border-radius:14px;padding:14px;display:flex;flex-direction:column;gap:8px}
.hg-card h4{margin:0;font:700 1.05rem var(--f-display)}
.hg-num{display:inline-grid;place-items:center;width:24px;height:24px;border-radius:50%;background:var(--her);color:#fff;font:800 .75rem var(--f-mono);margin-right:6px;vertical-align:middle}
.hg-gloss{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:8px}
.hg-gloss div{background:var(--surface);border:1px solid var(--line);border-left:4px solid var(--her);border-radius:10px;padding:8px 10px;font-size:.9rem;line-height:1.4}
.hg-grid2{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}
@media (max-width:760px){.hg-grid2{grid-template-columns:1fr}}
.hg-chr{width:100%;max-width:240px;height:auto}
.hg-icons{display:flex;flex-wrap:wrap;gap:4px}
.hg-step{display:flex;justify-content:space-between;gap:8px;flex-wrap:wrap}
.hg-pill{display:inline-block;padding:2px 9px;border-radius:999px;background:var(--her-soft);color:var(--her);font-weight:700;font-size:.8rem}`;document.head.append(st);}

  const ST=[['1','Ler o desenho'],['2','Gene e alelos'],['3','Padrões de herança'],['4','Além de um gene'],['5','Probabilidade'],['6','Consanguinidade e limites']];
  let est=store.get('hg-est',0);
  const nav=h('div',{class:'hg-nav',role:'tablist'});const box=h('div',{class:'stack'});
  const sec=h('div',{class:'panel stack',id:'hg-guia'},h('span',{class:'eyebrow'},'Guia completo'),h('h3',{},'Tudo o que um heredograma mostra (e o que ele não mostra)'),
    h('p',{class:'note',style:'margin:0'},'Seis estações curtas. Todas as famílias são fictícias. Faça na ordem: cada estação usa o que veio antes.'),nav,box);
  const head=root.querySelector('.aula-head');head.after(sec);
  const navB=ST.map(([n,t],i)=>{const b=h('button',{type:'button',role:'tab'},h('b',{},n),t);b.onclick=()=>{est=i;store.set('hg-est',i);show();sec.scrollIntoView({block:'start',behavior:reduced()?'auto':'smooth'});};nav.append(b);return b;});
  const stepBtns=()=>h('div',{class:'hg-step'},est>0?h('button',{class:'btn ghost',onclick:()=>{est--;store.set('hg-est',est);show();sec.scrollIntoView({block:'start'});}},'← Estação anterior'):h('span',{}),
    est<ST.length-1?h('button',{class:'btn primary',onclick:()=>{est++;store.set('hg-est',est);show();sec.scrollIntoView({block:'start'});}},'Próxima estação →'):h('span',{class:'hg-pill'},'Fim do guia: agora resolva o caso abaixo'));
  function show(){navB.forEach((b,i)=>b.setAttribute('aria-current',String(i===est)));box.innerHTML='';[e1,e2,e3,e4,e5,e6][est]();box.append(stepBtns());}

  // ===== Estação 1: ler o desenho =====
  function e1(){
    box.append(h('p',{},h('b',{},'Heredograma'),' (ou genealogia) é a representação da transmissão de uma característica em uma família ao longo das gerações. Cada símbolo é uma pessoa; cada linha mostra um parentesco.'));
    const leg=h('div',{class:'hg-leg'});
    const L=[[`<rect x="20" y="8" width="30" height="30" fill="var(--surface)" stroke="var(--ink)" stroke-width="2.2"/>`,'Homem (quadrado)'],
      [`<circle cx="35" cy="23" r="16" fill="var(--surface)" stroke="var(--ink)" stroke-width="2.2"/>`,'Mulher (círculo)'],
      [`<path d="M35,4 L54,23 L35,42 L16,23Z" fill="var(--surface)" stroke="var(--ink)" stroke-width="2.2"/>`,'Sexo não informado (losango)'],
      [`<rect x="8" y="8" width="26" height="26" fill="var(--her)" stroke="var(--ink)" stroke-width="2"/><circle cx="52" cy="21" r="13" fill="var(--her)" stroke="var(--ink)" stroke-width="2"/>`,'Símbolo preenchido: tem (manifesta) a característica'],
      [`<rect x="8" y="8" width="26" height="26" fill="var(--surface)" stroke="var(--ink)" stroke-width="2"/><circle cx="52" cy="21" r="13" fill="var(--surface)" stroke="var(--ink)" stroke-width="2"/>`,'Símbolo vazio: não manifesta a característica'],
      [`<circle cx="35" cy="23" r="16" fill="var(--surface)" stroke="var(--ink)" stroke-width="2.2"/><circle cx="35" cy="23" r="4.5" fill="var(--ink)"/>`,'Ponto no centro: portador(a) (alguns livros usam o símbolo meio preenchido)'],
      [`<rect x="20" y="8" width="30" height="30" fill="var(--surface)" stroke="var(--ink)" stroke-width="2.2"/><line x1="13" y1="45" x2="57" y2="1" stroke="var(--ink)" stroke-width="2.2"/>`,'Traço diagonal: pessoa falecida'],
      [`<rect x="30" y="8" width="30" height="30" fill="var(--her)" stroke="var(--ink)" stroke-width="2.2"/><path d="M4,46 L24,32" stroke="var(--ink)" stroke-width="2.2"/><path d="M27,29 l-10,2 l7,7z" fill="var(--ink)"/>`,'Seta: probando (quem iniciou a investigação)'],
      [`<rect x="2" y="12" width="20" height="20" fill="var(--surface)" stroke="var(--ink)" stroke-width="2"/><circle cx="58" cy="22" r="10" fill="var(--surface)" stroke="var(--ink)" stroke-width="2"/><line x1="22" y1="22" x2="48" y2="22" stroke="var(--ink)" stroke-width="2.2"/>`,'Linha horizontal entre duas pessoas: união'],
      [`<rect x="2" y="12" width="20" height="20" fill="var(--surface)" stroke="var(--ink)" stroke-width="2"/><circle cx="58" cy="22" r="10" fill="var(--surface)" stroke="var(--ink)" stroke-width="2"/><line x1="22" y1="18.5" x2="48" y2="18.5" stroke="var(--ink)" stroke-width="2.2"/><line x1="22" y1="25.5" x2="48" y2="25.5" stroke="var(--ink)" stroke-width="2.2"/>`,'Linha dupla: união consanguínea (entre parentes)'],
      [`<line x1="35" y1="2" x2="35" y2="16" stroke="var(--ink)" stroke-width="2.2"/><line x1="14" y1="16" x2="56" y2="16" stroke="var(--ink)" stroke-width="2.2"/><line x1="14" y1="16" x2="14" y2="28" stroke="var(--ink)" stroke-width="2.2"/><line x1="56" y1="16" x2="56" y2="28" stroke="var(--ink)" stroke-width="2.2"/><rect x="5" y="28" width="18" height="18" fill="var(--surface)" stroke="var(--ink)" stroke-width="2"/><circle cx="56" cy="37" r="9" fill="var(--surface)" stroke="var(--ink)" stroke-width="2"/>`,'Linha vertical e linha de irmandade: descendência (filhos do casal)'],
      [`<text x="10" y="30" font-size="20" font-weight="800" fill="var(--ink)">II</text><rect x="38" y="6" width="22" height="22" fill="var(--surface)" stroke="var(--ink)" stroke-width="2"/><text x="49" y="45" text-anchor="middle" font-size="13" font-weight="700" fill="var(--muted)" font-family="monospace">3</text>`,'Romano: geração. Número: posição da pessoa, da esquerda para a direita (II-3)']];
    L.forEach(([sv,t])=>leg.append(h('div',{},pedMini(sv),h('span',{},t))));
    box.append(h('span',{class:'label'},'Legenda dos símbolos'),leg);
    const info=h('div',{class:'fb info',style:'min-height:3em'},'Toque em qualquer parte do heredograma abaixo: uma pessoa, uma linha de união, uma linha de filhos ou o número de uma geração.');
    const MIS=[['Toque no probando.',(k,id)=>k==='pessoa'&&id==='IV-1'],['Toque na pessoa III-4.',(k,id)=>k==='pessoa'&&id==='III-4'],['Toque na união consanguínea.',k=>k==='cons'],['Toque na pessoa falecida.',(k,id)=>k==='pessoa'&&id==='I-1'],['Toque em uma pessoa que é obrigatoriamente portadora (ligue “Mostrar portadores” para conferir depois).',(k,id)=>k==='pessoa'&&(id==='III-2'||id==='III-3')]];
    let mi=store.get('hg-mis',0);let car=false;const misBox=h('div',{});const wrap=h('div',{});
    const sexo={m:'homem',f:'mulher',u:'sexo não informado'};
    function tap(k,id){let t;
      if(k==='pessoa'){const p=GUIA_FAM.P[id];const f=p.f;const par=[];
        par.push(h('b',{},id+': '),`${sexo[p.sex]}, geração ${id.split('-')[0]}, ${id.split('-')[1]}ª pessoa da esquerda para a direita. `);
        par.push(f.includes('a')?'Símbolo preenchido: manifesta a característica (aqui, uma condição autossômica recessiva). ':'Símbolo vazio: não manifesta a característica. ');
        if(f.includes('p'))par.push(h('b',{},'É o probando: '),'a investigação da família começou por ele (seta). ');
        if(f.includes('d'))par.push('O traço diagonal indica que é falecido. ');
        if(f.includes('c'))par.push('Teve um filho afetado sem ser afetado: é obrigatoriamente portador(a), Aa. ');
        if(id==='III-2'||id==='III-3')par.push('Participa de uma união consanguínea (primos).');
        t=h('span',{},...par);}
      else if(k==='uniao')t=h('span',{},h('b',{},'União: '),'a linha horizontal liga duas pessoas que tiveram filhos juntas.');
      else if(k==='cons')t=h('span',{},h('b',{},'União consanguínea: '),'linha dupla. III-2 e III-3 são primos: os pais deles (II-2 e II-3) são irmãos. Parentes podem ter herdado o mesmo alelo de um ancestral comum (I-1 ou I-2).');
      else if(k==='desc')t=h('span',{},h('b',{},'Descendência: '),'a linha vertical desce da união até a linha de irmandade, de onde saem os filhos do casal, em ordem de nascimento da esquerda para a direita.');
      else if(k==='ger')t=h('span',{},h('b',{},'Geração '+id+': '),'cada geração ocupa uma linha e recebe um algarismo romano, de cima (mais antiga) para baixo.');
      info.innerHTML='';info.append(t);
      if(mi<MIS.length&&MIS[mi][1](k,id)){mi++;store.set('hg-mis',mi);drawMis(true);}else if(mi<MIS.length)drawMis(false,true);}
    function drawMis(acertou,errou){misBox.innerHTML='';
      if(mi>=MIS.length){misBox.append(h('div',{class:'fb ok'},h('strong',{},'Missões completas! '),'Você já lê símbolos, uniões, gerações, o probando e a consanguinidade.',h('button',{class:'btn ghost sm',style:'margin-left:8px',onclick:()=>{mi=0;store.set('hg-mis',0);drawMis();}},'Refazer')));return;}
      misBox.append(h('div',{class:'callout'},h('strong',{},`Missão ${mi+1} de ${MIS.length}: `),MIS[mi][0],acertou?h('span',{class:'hg-pill',style:'margin-left:8px'},'✔ acertou a anterior'):'',errou?h('span',{class:'note',style:'margin-left:8px'},'(ainda não; leia a explicação e tente de novo)'):''));}
    function draw(){wrap.innerHTML='';wrap.append(pedDraw(GUIA_FAM,{carriers:car,onTap:tap}));}
    const ck=h('input',{type:'checkbox'});ck.onchange=()=>{car=ck.checked;draw();};
    box.append(h('span',{class:'label'},'Família fictícia: a investigação começou por IV-1'),misBox,wrap,h('label',{class:'row'},ck,'Mostrar portadores obrigatórios'),info);
    drawMis();draw();
    box.append(h('div',{class:'hg-gloss'},
      h('div',{},h('b',{},'Gerações: '),'algarismos romanos (I, II, III...), da mais antiga para a mais recente.'),
      h('div',{},h('b',{},'Indivíduos: '),'numerados da esquerda para a direita dentro de cada geração. “III-2” é a 2ª pessoa da 3ª geração.'),
      h('div',{},h('b',{},'Probando: '),'a pessoa a partir da qual a investigação genética da família começou. É indicado por uma seta.'),
      h('div',{},h('b',{},'Consanguinidade: '),'parentesco entre os integrantes de uma união. Aumenta a chance de os dois carregarem o mesmo alelo herdado de um ancestral comum.')));}

  // ===== Estação 2: gene e alelos =====
  function e2(){
    box.append(svgOf(`<rect width="640" height="190" fill="var(--surface)"/>
      <rect x="40" y="25" width="26" height="140" rx="13" fill="#c6cfdf" stroke="#566074" stroke-width="2"/><rect x="84" y="25" width="26" height="140" rx="13" fill="#c6cfdf" stroke="#566074" stroke-width="2"/>
      <rect x="40" y="80" width="26" height="12" fill="var(--her)"/><rect x="84" y="80" width="26" height="12" fill="#e9a6c4"/>
      <text x="53" y="182" text-anchor="middle" font-size="12" fill="var(--muted)">do pai</text><text x="97" y="182" text-anchor="middle" font-size="12" fill="var(--muted)">da mãe</text>
      <text x="10" y="16" font-size="13" font-weight="700" fill="var(--ink)">cromossomos homólogos</text>
      <path d="M110,86 H128" stroke="var(--muted)" stroke-dasharray="4 3"/><text x="132" y="84" font-size="13" font-weight="700" fill="var(--ink)">locus</text><text x="132" y="100" font-size="12" fill="var(--muted)">(lugar do gene)</text>
      <path d="M66,80 L250,40 M66,92 L250,140" stroke="var(--muted)" stroke-dasharray="4 3"/>
      <g transform="translate(250 40)"><rect width="250" height="100" rx="12" fill="var(--surface-2)" stroke="var(--line)"/>
      ${Array.from({length:12},(_,i)=>`<path d="M${14+i*19},22 v56" stroke="${['#e07a5f','#3d8bd8','#f2b134','#59a96a'][i%4]}" stroke-width="5"/>`).join('')}
      <path d="M10,22 H240 M10,78 H240" stroke="#566074" stroke-width="3"/><rect x="40" y="12" width="150" height="76" rx="8" fill="none" stroke="var(--her)" stroke-width="3" stroke-dasharray="6 4"/>
      <text x="115" y="8" text-anchor="middle" font-size="13" font-weight="800" fill="var(--her)">gene</text></g>
      <path d="M505,90 H545" stroke="var(--ink)" stroke-width="2.4"/><path d="M545,90 l-8,-5 v10z" fill="var(--ink)"/>
      <g transform="translate(580 90)"><circle r="16" fill="#f2d39a" stroke="#a5672e"/><circle cx="-14" cy="-14" r="10" fill="#e9b96d" stroke="#a5672e"/><circle cx="14" cy="12" r="11" fill="#e9b96d" stroke="#a5672e"/></g>
      <text x="580" y="136" text-anchor="middle" font-size="12" fill="var(--ink)">produto funcional</text><text x="580" y="151" text-anchor="middle" font-size="12" fill="var(--muted)">(proteína ou RNA)</text>`,'0 0 640 190','chart'));
    box.append(h('p',{},h('b',{},'Gene'),' é uma sequência de DNA que contém informações para produzir um produto funcional (uma proteína ou um RNA). Ele fica num lugar fixo do cromossomo, o ',h('b',{},'locus'),'. Como os cromossomos vêm em pares (um do pai, um da mãe), cada pessoa tem duas cópias de cada gene autossômico. Cada versão de um gene é um ',h('b',{},'alelo'),'.'));
    // montador
    let a1=store.get('hg-a1','A'),a2=store.get('hg-a2','a');const out=h('div',{});const chr=h('div',{});
    const pick=(v,on)=>chipsPick([['A','A (dominante)'],['a','a (recessivo)']],v,on);
    function upd(){const g=[a1,a2].sort((x,y)=>x==='A'?-1:y==='A'?1:0).join('');const hom=a1===a2;const man=g==='aa';
      chr.innerHTML='';chr.append(svgOf(`<rect x="30" y="10" width="34" height="120" rx="17" fill="#c6cfdf" stroke="#566074" stroke-width="2"/><rect x="100" y="10" width="34" height="120" rx="17" fill="#c6cfdf" stroke="#566074" stroke-width="2"/>
        <rect x="30" y="58" width="34" height="22" fill="${a1==='A'?'var(--her)':'#f3c6da'}"/><rect x="100" y="58" width="34" height="22" fill="${a2==='A'?'var(--her)':'#f3c6da'}"/>
        <text x="47" y="75" text-anchor="middle" font-size="18" font-weight="800" fill="${a1==='A'?'#fff':'var(--her)'}" font-family="monospace">${a1}</text><text x="117" y="75" text-anchor="middle" font-size="18" font-weight="800" fill="${a2==='A'?'#fff':'var(--her)'}" font-family="monospace">${a2}</text>`,'0 0 164 140','hg-chr'));
      out.innerHTML='';out.append(h('table',{class:'data'},
        h('tr',{},h('th',{},'Genótipo'),h('td',{class:'mono'},h('b',{},g),' (a constituição genética para esse gene)')),
        h('tr',{},h('th',{},'Zigose'),h('td',{},hom?h('span',{},h('b',{},'Homozigose: '),'dois alelos iguais.'):h('span',{},h('b',{},'Heterozigose: '),'dois alelos diferentes.'))),
        h('tr',{},h('th',{},'Fenótipo'),h('td',{},man?'Manifesta a característica recessiva (símbolo preenchido).':'Não manifesta a característica recessiva (símbolo vazio).')),
        h('tr',{},h('th',{},'Por quê?'),h('td',{},g==='Aa'?'A é dominante: basta uma cópia para o efeito dele aparecer. O alelo a é recessivo: só se manifesta sem A.':g==='AA'?'Duas cópias do alelo dominante.':'Sem nenhum A, o efeito do alelo recessivo aparece.')),
        h('tr',{},h('th',{},'Portador?'),h('td',{},g==='Aa'?h('span',{},h('b',{},'Sim. '),'Tem o alelo recessivo, mas geralmente não manifesta a condição. Pode passá-lo aos filhos.'):g==='aa'?'Manifesta a condição (não é chamado de portador, e sim de afetado).':'Não: não tem o alelo a.'))));}
    box.append(h('div',{class:'hg-grid2'},h('div',{class:'stack',style:'gap:8px'},h('span',{class:'label'},'Monte o par: alelo no cromossomo do pai'),pick(a1,v=>{a1=v;store.set('hg-a1',v);upd();}),h('span',{class:'label'},'Alelo no cromossomo da mãe'),pick(a2,v=>{a2=v;store.set('hg-a2',v);upd();}),chr),out));
    upd();
    box.append(h('div',{class:'hg-card'},h('h4',{},'Polialelia: mais de dois alelos na população'),
      h('div',{class:'row',style:'gap:14px;align-items:center'},svgOf(`<rect width="240" height="110" rx="12" fill="var(--surface-2)"/>${[[30,30,'Iᴬ','#d9534f'],[75,55,'Iᴮ','#3d8bd8'],[120,28,'i','#8d99a8'],[165,60,'Iᴬ','#d9534f'],[205,32,'i','#8d99a8'],[50,82,'i','#8d99a8'],[100,88,'Iᴮ','#3d8bd8'],[150,92,'i','#8d99a8'],[200,85,'Iᴬ','#d9534f']].map(([x,y,t,c])=>`<circle cx="${x}" cy="${y}" r="15" fill="${c}"/><text x="${x}" y="${y+5}" text-anchor="middle" font-size="13" font-weight="800" fill="#fff">${t}</text>`).join('')}`,'0 0 240 110','hg-chr'),
        h('p',{style:'margin:0;flex:1;min-width:200px'},'O gene do sistema ABO tem ',h('b',{},'três alelos'),' na população: Iᴬ, Iᴮ e i. Isso é ',h('b',{},'polialelia'),' (alelos múltiplos). Mas cada pessoa tem só ',h('b',{},'dois'),', um em cada cromossomo do par: por exemplo, IᴬIᴮ ou Iᴮi. Veja mais na aula 7.'))));
    box.append(h('div',{class:'hg-gloss'},...[['Gene','sequência de DNA com informações para produzir um produto funcional.'],['Alelo','uma das versões de um gene.'],['Polialelia','três ou mais alelos de um mesmo gene na população.'],['Genótipo','constituição genética: AA, Aa ou aa.'],['Fenótipo','característica observável (o que aparece no símbolo).'],['Homozigose','dois alelos iguais para um gene (AA ou aa).'],['Heterozigose','dois alelos diferentes para um gene (Aa).'],['Dominância e recessividade','relação entre alelos: o dominante se manifesta com uma cópia; o recessivo só sem o dominante.'],['Portador','tem o alelo recessivo, mas geralmente não manifesta a condição.']].map(([a,b])=>h('div',{},h('b',{},a+': '),b))));}

  // ===== Estação 3: padrões =====
  function e3(){
    let k=store.get('hg-pad','ad'),car=false;const area=h('div',{class:'stack'});
    box.append(h('p',{},'O modo como a característica aparece na família dá pistas de ',h('b',{},'onde o gene está'),' (num autossomo, no X, no Y ou nas mitocôndrias) e se o alelo é dominante ou recessivo. Escolha um padrão e confira as pistas no exemplo.'),
      chipsPick(Object.entries(PADROES).map(([kk,v])=>[kk,v.nome]),k,v=>{k=v;store.set('hg-pad',v);draw();}),area);
    function draw(){const P=PADROES[k];area.innerHTML='';const ck=h('input',{type:'checkbox'});ck.checked=car;ck.onchange=()=>{car=ck.checked;draw();};
      area.append(h('div',{class:'row',style:'gap:12px;align-items:center'},svgOf(ONDE_SV[P.onde],'0 0 56 50','ped-mini'),h('div',{},h('b',{},P.nome),h('br'),h('span',{class:'note'},'Onde está o gene: '+(P.onde==='autossomo'?'em um autossomo (cromossomo não sexual)':P.onde==='mitocôndria'?'no DNA das mitocôndrias':'no cromossomo '+P.onde)))),
        (()=>{const pp=pedParse(P.ped);(P.carr||[]).forEach(id=>{pp.P[id].f+='c';});return pedDraw(pp,{carriers:car});})(),(k==='ar'||k==='xr')?h('label',{class:'row'},ck,'Mostrar portadoras e portadores'):'',
        h('ul',{style:'margin:0;padding-left:20px;line-height:1.5'},...P.pistas.map(t=>h('li',{},t))));
}
    draw();
    // desafio
    const ord=store.get('hg-dord',null)||DESAFIO.map((_,i)=>i).sort(()=>Math.random()-.5);store.set('hg-dord',ord);
    let di=store.get('hg-di',0);const ans=store.get('hg-dans',{});const dz=h('div',{class:'stack'});
    box.append(h('div',{class:'hg-card'},h('h4',{},'Desafio: qual é o padrão?'),h('p',{class:'note',style:'margin:0'},'Seis famílias novas. Use as pistas: quem é afetado, de quem herdou e para quem passou.'),dz));
    function dd(){dz.innerHTML='';const D=DESAFIO[ord[di]];const pp=pedParse(D.ped);(D.carr||[]).forEach(id=>{pp.P[id].f+='c';});
      const fb=h('div',{});
      dz.append(h('div',{class:'row',style:'justify-content:space-between'},h('b',{},`Família ${di+1} de ${DESAFIO.length}`),h('span',{class:'note'},`Acertos: ${Object.entries(ans).filter(([i,v])=>DESAFIO[ord[i]].k===v).length}`)),
        pedDraw(pp,{carriers:true}),h('p',{class:'note',style:'margin:0'},'Pontos no centro: portadores conhecidos (quando houver).'),
        chipsPick(Object.entries(PADROES).map(([kk,v])=>[kk,v.nome]),ans[di]??null,v=>{ans[di]=v;store.set('hg-dans',ans);showFb();dd();}),fb,
        h('div',{class:'row'},h('button',{class:'btn ghost sm',disabled:di===0?true:null,onclick:()=>{di--;store.set('hg-di',di);dd();}},'← Família anterior'),h('button',{class:'btn sm',disabled:di===DESAFIO.length-1?true:null,onclick:()=>{di++;store.set('hg-di',di);dd();}},'Próxima família →')));
      function showFb(){fb.innerHTML='';if(ans[di]==null)return;const ok=ans[di]===D.k;const P=PADROES[D.k];
        fb.append(h('div',{class:'fb '+(ok?'ok':'no')},h('strong',{},ok?'Isso! ':'Ainda não. '),ok?('É '+P.nome.toLowerCase()+'. Pista principal: '+P.pistas[0]):'Releia as pistas de cada padrão acima. Dica: comece olhando o que acontece com os filhos de um homem afetado.'));}
      showFb();}
    dd();}

  // ===== Estação 4: além de um gene =====
  function e4(){
    box.append(h('p',{},'Nem toda característica segue o modelo de um gene com dois alelos e efeito sempre visível. Quatro situações mudam a leitura do heredograma.'));
    // poligênica e multifatorial
    let ng=store.get('hg-ng',3),amb=store.get('hg-amb',false);const ch=s('svg',{class:'chart',role:'img','aria-label':'Distribuição da característica na população'});const cap=h('p',{class:'note',style:'margin:0'});
    function dp(){const n=2*ng;let cats,vals;
      if(!amb){cats=[...Array(n+1)].map((_,i)=>String(i));vals=cats.map((_,i)=>binom(n,i)/Math.pow(2,n));}
      else{const B=n*2+3;const cnt=Array(B).fill(0);const r=seeded(11);const N=4000;for(let i=0;i<N;i++){let c=0;for(let j=0;j<n;j++)if(r()<.5)c++;const u1=r()||1e-9,u2=r();const z=Math.sqrt(-2*Math.log(u1))*Math.cos(6.2832*u2);let v=c+z*.9;const b=Math.max(0,Math.min(B-1,Math.round((v+1)*2)));cnt[b]++;}
        cats=cnt.map((_,i)=>String(i/2-1).replace('.',','));vals=cnt.map(c=>c/N);}
      barChart(ch,{cats,series:[{name:'Pessoas',color:'var(--her)',values:vals}],yMax:Math.max(...vals)*1.15,fmtY:v=>pct(v,0),xLabel:amb?'Valor da característica (genes + ambiente)':'Número de alelos “+” (que aumentam a característica)',height:220});
      cap.textContent=amb?'Com o ambiente (alimentação, sono, doenças, clima...) somado aos genes, as classes se misturam e a distribuição vira uma curva contínua: é a herança multifatorial, como a altura humana.':ng===1?'Um gene: só 3 classes bem separadas (0, 1 ou 2 alelos “+”).':`${ng} genes: ${2*ng+1} classes. Quanto mais genes somam efeitos, mais as classes se aproximam de uma curva em forma de sino: herança poligênica.`;}
    box.append(h('div',{class:'hg-card'},h('h4',{},h('span',{class:'hg-num'},'A'),'Herança poligênica e multifatorial'),
      h('p',{style:'margin:0'},h('b',{},'Poligênica: '),'vários genes participam de uma mesma característica, cada um somando um pouco. ',h('b',{},'Multifatorial: '),'genes e fatores ambientais atuam juntos.'),
      h('div',{class:'row'},h('span',{class:'label'},'Genes'),seg([1,2,3,4].map(n=>[n,String(n)]),ng,v=>{ng=v;store.set('hg-ng',v);dp();}),h('span',{class:'label'},'Ambiente'),seg([[false,'Sem efeito'],[true,'Com efeito']],amb,v=>{amb=v;store.set('hg-amb',v);dp();})),ch,cap,
      h('p',{class:'note',style:'margin:0'},'Num heredograma, essas características não seguem as proporções simples de Mendel: é difícil marcar “tem” ou “não tem”.')));dp();
    // penetrância
    let pen=store.get('hg-pen',70);const icons=h('div',{class:'hg-icons'});const pv=h('output',{class:'big-num',style:'color:var(--her)'});
    const sl=h('input',{type:'range',min:0,max:100,step:10,value:pen,'aria-label':'Penetrância'});sl.oninput=()=>{pen=+sl.value;store.set('hg-pen',pen);dpen();};
    function dpen(){pv.textContent=pen+'%';icons.innerHTML='';const n=Math.round(pen/5);for(let i=0;i<20;i++){const e=svgOf(`<rect x="3" y="3" width="22" height="22" fill="${i<n?'var(--her)':'var(--surface)'}" stroke="var(--ink)" stroke-width="2"/><text x="14" y="38" text-anchor="middle" font-size="10" font-family="monospace" fill="var(--muted)">Aa</text>`,'0 0 28 42');e.setAttribute('width','28');e.setAttribute('height','42');icons.append(e);}}
    const penPed=pedParse({g:['m260a f380','f160 m240q f400','m200a f280'],u:['I1+I2>II2,II3','II1+II2>III1,III2']});
    box.append(h('div',{class:'hg-card'},h('h4',{},h('span',{class:'hg-num'},'B'),'Penetrância'),
      h('p',{style:'margin:0'},h('b',{},'Penetrância'),' é a proporção de pessoas com determinado genótipo que manifestam a característica. Se a penetrância é incompleta, alguém pode ter o alelo dominante e não manifestar.'),
      pedDraw(penPed),h('p',{class:'note',style:'margin:0'},'Condição dominante: II-2 (“?”) não manifesta, mas é filho de I-1 afetado e pai de III-1 afetado. Ele deve ter o alelo e não o manifestou: penetrância incompleta. Sem isso, o desenho pareceria “pular” uma geração, como na herança recessiva.'),
      h('div',{class:'row',style:'gap:12px'},h('span',{class:'label'},'Penetrância'),sl,pv),icons,h('p',{class:'note',style:'margin:0'},'20 pessoas com o mesmo genótipo Aa. Preenchidas: as que manifestam.')));dpen();
    // expressividade
    const exPed=pedParse({g:['m260a f380','f160 m240a f400a m480','m200a f280a m440a'],u:['I1+I2>II2,II3','II1+II2>III1,III2','II3+II4>III3']});
    box.append(h('div',{class:'hg-card'},h('h4',{},h('span',{class:'hg-num'},'C'),'Expressividade'),
      h('p',{style:'margin:0'},h('b',{},'Expressividade'),' é a variação na intensidade ou na forma como uma característica se manifesta em pessoas que a têm. Todos os preenchidos abaixo manifestam a mesma condição dominante, mas em graus diferentes (quanto mais preenchido, mais intenso).'),
      pedDraw(exPed,{fill:{'I-1':.35,'II-2':1,'II-3':.6,'III-1':.25,'III-2':.8,'III-3':.5}}),
      h('p',{class:'note',style:'margin:0'},'Não confunda: penetrância pergunta “manifesta ou não?”; expressividade pergunta “quanto e de que forma manifesta?”.')));
    // novas mutações
    const nmPed=pedParse({g:['m200 f320','m260an f380','m240a f320 m400'],u:['I1+I2>II1','II1+II2>III1,III2,III3']});
    box.append(h('div',{class:'hg-card'},h('h4',{},h('span',{class:'hg-num'},'D'),'Novas mutações'),
      h('p',{style:'margin:0'},'II-1 manifesta uma condição dominante, mas ninguém antes dele tinha a característica. Uma explicação possível é uma ',h('b',{},'mutação nova'),' (⚡) num gameta de um dos pais: uma alteração no DNA que surgiu ali, sem histórico na família. A partir dele, a característica passa a ser herdada.'),
      pedDraw(nmPed),h('p',{class:'note',style:'margin:0'},'Outras explicações para “apareceu do nada”: penetrância incompleta em um dos pais, ou uma herança recessiva. Por isso o heredograma sozinho nem sempre decide.')));}

  // ===== Estação 5: probabilidade =====
  function e5(){
    box.append(h('p',{},'Na família da estação 1, a condição é autossômica recessiva. III-2 e III-3 não a manifestam, mas tiveram IV-1 afetado (aa). Então os dois são obrigatoriamente ',h('b',{},'Aa'),'. O ',h('b',{},'quadro de Punnett'),' mostra as combinações possíveis de alelos nos filhos deles.'));
    box.append(h('div',{class:'hg-grid2'},h('div',{class:'stack',style:'gap:6px;align-items:center'},h('b',{},'III-2 (Aa) × III-3 (Aa)'),(()=>{const e=agPunnett('Aa','Aa',g=>g==='aa');e.style.maxWidth='200px';e.style.width='100%';e.style.height='auto';return e;})(),h('p',{class:'note',style:'margin:0;text-align:center'},'Casa acesa: aa (manifesta). Pessoas de cabelo e pele claros representam aa.')),
      h('table',{class:'data'},h('tr',{},h('th',{},'Genótipo'),h('th',{},'Probabilidade')),h('tr',{},h('td',{},'AA'),h('td',{},'1/4')),h('tr',{},h('td',{},'Aa (portador)'),h('td',{},'2/4 = 1/2')),h('tr',{},h('td',{},'aa (manifesta)'),h('td',{},'1/4')))));
    // gestações
    const hist=store.get('hg-gest',[]);const row=h('div',{class:'hg-icons'});const msg=h('div',{});
    function dg(){row.innerHTML='';hist.forEach((g,i)=>{const e=svgOf(pessoaSv(16,17,15,g==='aa'),'0 0 32 34');e.setAttribute('width','32');e.setAttribute('height','34');e.setAttribute('title',g);row.append(h('div',{class:'stack',style:'gap:0;align-items:center'},e,h('span',{class:'mono',style:'font-size:.72rem'},g)));});
      msg.innerHTML='';if(!hist.length){msg.append(h('p',{class:'note'},'Simule as gestações do casal, uma de cada vez.'));return;}
      const ult=hist.slice(-3);const seq=ult.length>=2&&ult.every(x=>x==='aa');
      msg.append(h('div',{class:'fb info'},h('b',{},`Gestação ${hist.length}: ${hist[hist.length-1]}. `),`Chance de a próxima gestação ser aa: `,h('b',{},'1/4'),', ',seq?'mesmo depois de filhos aa seguidos. ':'qualquer que tenha sido o resultado anterior. ','Cada gestação vem de um novo encontro de gametas: as probabilidades se renovam a cada gestação.'));}
    box.append(h('p',{class:'callout'},h('strong',{},'Lembrete da aula 4: '),'para “o 1º filho aa ',h('b',{},'e'),' o 2º filho aa”, multiplique (1/4 × 1/4 = 1/16). Para “um filho AA ',h('b',{},'ou'),' Aa”, some (1/4 + 2/4 = 3/4). “E” deixa a chance menor; “ou” deixa maior.'));
    box.append(h('div',{class:'hg-card'},h('h4',{},'Independência entre gestações'),h('div',{class:'row'},h('button',{class:'btn primary',onclick:()=>{const g=['A','a'][Math.random()<.5?0:1]+['A','a'][Math.random()<.5?0:1];hist.push(g==='aA'?'Aa':g);store.set('hg-gest',hist);dg();}},'🤰 Nova gestação'),h('button',{class:'btn ghost sm',onclick:()=>{hist.length=0;store.set('hg-gest',hist);dg();}},'Recomeçar')),row,msg));dg();
    // desafio 2/3
    const q=store.get('hg-23',null);const fb=h('div',{});
    const show=v=>{fb.innerHTML='';if(v==null)return;fbx(fb,v==='2/3'?'ok':'no',h('strong',{},v==='2/3'?'Isso! ':'Quase. '),'IV-2 não é aa (não manifesta). Então sobram só 3 casas do quadro: AA, Aa e Aa. Em 2 delas ela é portadora: 2/3. Saber o fenótipo muda o “universo” de possibilidades.');};
    box.append(h('div',{class:'hg-card'},h('h4',{},'Desafio extra'),h('p',{style:'margin:0'},'IV-2 é irmã do probando e não manifesta a condição. Qual a probabilidade de ela ser portadora (Aa)?'),chipsPick(['1/4','1/2','2/3','3/4'].map(x=>[x,x]),q,v=>{store.set('hg-23',v);show(v);}),fb));show(q);}

  // ===== Estação 6: consanguinidade e limites =====
  function e6(){
    let on=store.get('hg-path',false);const wrap=h('div',{});
    const ped=pedParse({g:['m260d f380','f110 m190 f430 m520','m110 f270 m350 f540','m280ap f360'],u:['I1+I2>II2,II3','II1+II2>III1,III2','II3+II4>III3,III4','III2=III3>IV1,IV2']});
    if(on){['I-1','II-2','II-3','III-2','III-3'].forEach(id=>ped.P[id].f+='c');}
    function d(){wrap.innerHTML='';wrap.append(pedDraw(ped,{carriers:on,path:on?[['I-1','II-2','III-2','IV-1'],['I-1','II-3','III-3','IV-1']]:null}));}
    const b=h('button',{class:'btn primary'},on?'Esconder o caminho do alelo':'Seguir o alelo do ancestral comum');b.onclick=()=>{store.set('hg-path',!on);e6Re();};
    box.append(h('div',{class:'hg-card'},h('h4',{},'Consanguinidade: o mesmo alelo por dois caminhos'),
      h('p',{style:'margin:0'},'Suponha que o bisavô I-1 tinha um alelo a. Ele pode passar esse alelo para os dois filhos (II-2 e II-3), que o passam para os filhos deles. Quando os primos III-2 e III-3 se unem, os dois podem ter ',h('b',{},'a mesma cópia'),' do alelo a, herdada do mesmo ancestral. Por isso, uniões consanguíneas aumentam a chance de nascer alguém aa.'),h('div',{class:'row'},b),wrap,
      on?h('p',{class:'note',style:'margin:0'},'Faixa amarela: o caminho do alelo a de I-1 até IV-1, por dois lados da família. Pontos: quem carregaria esse alelo nesse cenário.'):''));d();
    // limites
    const lp=pedParse({g:['m260 f380a','m280a f360'],u:['I1+I2>II1,II2']});const ans=store.get('hg-lim',{});const fb=h('div',{class:'stack',style:'gap:6px'});
    const OK={ad:true,ar:true,xd:true,xr:true,y:false,mt:false};
    const EX={ad:'Possível: a mãe seria Aa e passou A para o filho.',ar:'Possível: a mãe seria aa e o pai, Aa.',xd:'Possível: a mãe seria heterozigota; passou o X com o alelo para o filho e o outro X para a filha.',xr:'Possível: a mãe seria afetada (XᵃXᵃ) e o pai normal; o filho recebe Xᵃ da mãe; a filha, um Xᵃ da mãe e um Xᴬ do pai, fica portadora.',y:'Impossível: uma mulher afetada não tem cromossomo Y.',mt:'Não se sustenta: a mãe afetada passaria para todos os filhos, e a filha não manifesta.'};
    const list=h('div',{class:'stack',style:'gap:8px'});const concl=h('div',{});
    const updC=()=>{concl.innerHTML='';if(Object.keys(OK).every(k=>ans[k]!=null))concl.append(h('div',{class:'callout'},h('strong',{},'Conclusão: '),'quatro padrões diferentes explicam o mesmo desenho. O heredograma fornece pistas, mas nem sempre permite determinar sozinho o padrão de herança: famílias pequenas, penetrância incompleta, expressividade variável, mutações novas e informações que faltam (adoção, parentes sem dados) limitam a conclusão. Por isso a genética também usa testes moleculares e o histórico de outras famílias.'));else concl.append(h('p',{class:'note'},'Responda os seis padrões para ver a conclusão.'));};
    Object.entries(PADROES).forEach(([k,P])=>{const r=h('div',{});const sh=()=>{r.innerHTML='';if(ans[k]==null)return;const ok=(ans[k]==='s')===OK[k];r.append(h('div',{class:'fb '+(ok?'ok':'no')},h('strong',{},ok?'Certo. ':'Reveja. '),EX[k]));};
      list.append(h('div',{class:'stack',style:'gap:4px'},h('div',{class:'row',style:'justify-content:space-between'},h('b',{},P.nome),chipsPick([['s','Compatível'],['n','Não compatível']],ans[k]??null,v=>{ans[k]=v;store.set('hg-lim',ans);sh();updC();})),r));sh();});updC();
    box.append(h('div',{class:'hg-card'},h('h4',{},'Os limites da análise'),h('p',{style:'margin:0'},'Uma família pequena: mãe afetada, pai não afetado, um filho afetado e uma filha não afetada. Para cada padrão, decida se ele é compatível com este desenho (considere penetrância completa).'),
      pedDraw(lp),list,concl));}
  function e6Re(){box.innerHTML='';e6();box.append(stepBtns());}
  show();
});

