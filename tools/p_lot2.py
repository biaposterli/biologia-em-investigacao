import sys; sys.path.insert(0,'tools')
from patchlib import P
p=P('src/sites/genetica.html')
NEW=r"""extend('loteria',root=>{
  // Tiro ao alvo dos canteiros: amostras pequenas erram mais, amostras grandes acertam perto de 25%
  if(!document.getElementById('alvo-css')){const st=document.createElement('style');st.id='alvo-css';st.textContent=
`.cant{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px}
@media (max-width:760px){.cant{grid-template-columns:repeat(2,minmax(0,1fr))}}
.cant-c{display:flex;flex-direction:column;gap:6px;align-items:center;text-align:center;background:var(--surface);border:1px solid var(--line);border-radius:14px;padding:12px 8px}
.cant-c svg{width:100%;max-width:150px;height:auto;aspect-ratio:1;border-radius:10px;background:#7a5a3a}
.cant-c .big-num{font-size:1.6rem}
.cant-c b.lab{font-family:var(--f-display);font-size:1.05rem}`;document.head.append(st);}
  const SZ=[{n:4,nome:'Vaso',cor:'#b5673f'},{n:20,nome:'Canteiro pequeno',cor:'#c08a3e'},{n:100,nome:'Canteiro médio',cor:'#5b8f45'},{n:1000,nome:'Plantação',cor:'#2c58a5'}];
  let rodadas=store.get('alvo-rod',[]);let ultimo=null;
  const cBox=h('div',{class:'cant'});const alvo=s('svg',{class:'chart',viewBox:'0 0 640 300',role:'img','aria-label':'Alvo: porcentagem de sementes verdes em cada rodada, por tamanho de canteiro'});
  const fb=h('div',{});const cont=h('span',{class:'pill'});
  function plantar(){const r={};const sem={};SZ.forEach(z=>{const v=[];let g=0;for(let i=0;i<z.n;i++){const verde=Math.random()<.25;v.push(verde);if(verde)g++;}r[z.n]=g/z.n;sem[z.n]=v;});rodadas.push(r);if(rodadas.length>40)rodadas.shift();store.set('alvo-rod',rodadas);ultimo=sem;}
  function drawCanteiros(){cBox.innerHTML='';SZ.forEach(z=>{const v=ultimo?ultimo[z.n]:null;const k=Math.ceil(Math.sqrt(z.n));const cell=100/k;
    let inner='';if(v)v.forEach((verde,i)=>{const x=(i%k)*cell+cell/2,y=Math.floor(i/k)*cell+cell/2;inner+=`<circle cx="${x.toFixed(2)}" cy="${y.toFixed(2)}" r="${(cell*.4).toFixed(2)}" fill="${verde?'#6fa33a':'#e3bd3a'}"/>`;});
    const e=document.createElementNS(NS,'svg');e.setAttribute('viewBox','0 0 100 100');e.setAttribute('aria-hidden','true');e.innerHTML=inner;
    const g=v?v.filter(Boolean).length:null;
    cBox.append(h('div',{class:'cant-c'},h('b',{class:'lab'},z.nome),h('span',{class:'note'},fmt(z.n)+' semente'+(z.n>1?'s':'')),e,
      h('span',{class:'big-num',style:'color:'+z.cor},v?pct(g/z.n,0):'—'),h('span',{class:'note'},v?g+' verde'+(g===1?'':'s'):'ainda sem plantar')));});}
  function drawAlvo(){alvo.innerHTML='';const W=640,ml=150,mr=20,X=f=>ml+Math.min(f,.75)/.75*(W-ml-mr);
    alvo.append(s('rect',{width:W,height:300,fill:'var(--surface)'}));
    alvo.append(s('rect',{x:X(.2),y:10,width:X(.3)-X(.2),height:262,fill:'var(--good-soft)'}));
    alvo.append(s('line',{x1:X(.25),x2:X(.25),y1:10,y2:272,stroke:'var(--good)','stroke-width':2.5}));
    alvo.append(s('text',{x:X(.25),y:290,'text-anchor':'middle','font-size':12,'font-weight':800,fill:'var(--good)'},'alvo: 25%'));
    [0,.5,.75].forEach(f=>alvo.append(s('text',{x:X(f),y:290,'text-anchor':'middle','font-size':11,fill:'var(--muted)'},f===.75?'75% ou mais':Math.round(f*100)+'%')));
    SZ.forEach((z,i)=>{const y=40+i*64;alvo.append(s('line',{x1:ml,x2:W-mr,y1:y,y2:y,stroke:'var(--line)'}));
      alvo.append(s('text',{x:10,y:y-4,'font-size':13,'font-weight':700,fill:'var(--ink)'},z.nome));alvo.append(s('text',{x:10,y:y+12,'font-size':11,fill:'var(--muted)'},fmt(z.n)+' sementes'));
      const vals=rodadas.map(r=>r[z.n]);vals.forEach((f,j)=>{const rr=seeded(j*7+i*131+3);const jit=(rr()-.5)*22;const ult=j===vals.length-1;
        alvo.append(s('circle',{cx:X(f),cy:y+jit,r:ult?8:6,fill:z.cor,opacity:ult?1:.55,stroke:ult?'var(--ink)':'none','stroke-width':2}));});
      if(vals.length>1){const mn=Math.min(...vals),mx=Math.max(...vals);alvo.append(s('line',{x1:X(mn),x2:X(mx),y1:y+22,y2:y+22,stroke:z.cor,'stroke-width':3}));
        alvo.append(s('text',{x:W-mr,y:y+36,'text-anchor':'end','font-size':11,fill:'var(--muted)'},'de '+Math.round(mn*100)+'% a '+Math.round(mx*100)+'%'));}});}
  function upd(){drawCanteiros();drawAlvo();cont.textContent=rodadas.length+' rodada'+(rodadas.length===1?'':'s');fb.innerHTML='';
    if(rodadas.length>=5){const sp=SZ.map(z=>{const v=rodadas.map(r=>r[z.n]);return Math.max(...v)-Math.min(...v);});
      fbx(fb,'ok',h('strong',{},'O que o alvo mostra: '),`no vaso de 4 sementes, os resultados se espalharam ${Math.round(sp[0]*100)} pontos percentuais; na plantação de 1.000, só ${Math.round(sp[3]*100)}. Cada semente tem sempre 1 chance em 4 de ser verde, mas só amostras grandes acertam perto de 25%. Por isso uma família com 4 filhos pode não ter nenhum aa, ou ter dois.`);}
    else if(rodadas.length)fbx(fb,'info','Plante mais vezes. Depois de 5 rodadas, compare: em qual canteiro as bolinhas ficam mais perto do alvo?');}
  ultimo=null;upd();
  const b1=h('button',{class:'btn primary',onclick:()=>{plantar();upd();}},'🌱 Plantar os 4 canteiros');
  const b10=h('button',{class:'btn',onclick:async()=>{b10.disabled=true;for(let i=0;i<10;i++){plantar();upd();await sleep(reduced()?0:180);}b10.disabled=false;}},'Plantar 10 vezes');
  const b0=h('button',{class:'btn ghost sm',onclick:()=>{rodadas=[];store.set('alvo-rod',rodadas);ultimo=null;upd();}},'Recomeçar');
  root.append(sim('Tiro ao alvo dos canteiros','Quatro canteiros de tamanhos diferentes recebem sementes de Aa × Aa. Em cada semente, a chance de sair verde (aa) é 1 em 4. Plante várias vezes e veja onde as bolinhas caem no alvo de 25%.',
    h('div',{class:'callout'},h('strong',{},'Antes de plantar: '),'em qual canteiro você acha que a porcentagem de verdes vai ficar mais perto de 25%? Por quê?'),
    h('div',{class:'row'},b1,b10,b0,cont),cBox,h('span',{class:'label'},'O alvo · cada bolinha é uma rodada; a maior é a última'),alvo,fb,
    model('Cada semente é sorteada com probabilidade 1/4 de ser aa, como na loteria dos sacos. Isso é a lei dos grandes números: quanto maior a amostra, mais perto da probabilidade esperada.')));
});"""
i=p.t.index("extend('loteria',root=>{");j=p.t.index("\n});",i)+4
p.t=p.t[:i]+NEW+p.t[j:];p.n+=1
p.save()
