import sys; sys.path.insert(0,'tools')
from patchlib import P
p=P('src/sites/genetica.html')
NEW=r"""  // Direita: aposta, tubos de sementes e mural da turma
  let turma=store.get('lot-turma',[]);let aposta=store.get('lot-aposta',null);let prevN=draws.length;
  const apBox=h('div',{class:'stack',style:'gap:8px'});const tubes=s('svg',{class:'chart',viewBox:'0 0 600 330',role:'img','aria-label':'Tubos com as sementes sorteadas: AA, Aa e aa'});
  const ratio=h('div',{});const msg=h('div',{});const mural=h('div',{class:'stack',style:'gap:10px'});const tmsg=h('p',{class:'note'});
  R.append(h('h3',{},'Aposta, tubos e mural'),apBox,tubes,ratio,msg,
    h('div',{class:'stack',style:'gap:8px;border-top:1px solid var(--line);padding-top:14px'},h('span',{class:'label'},'Mural da turma'),
      h('p',{class:'note'},'Cada coluna é um estudante com 24 sorteios. A sua está destacada. A turma toda junta chega mais perto de 25%?'),
      h('div',{class:'row'},h('button',{class:'btn sm primary',onclick:()=>simTurma()},'Simular a turma'),h('button',{class:'btn sm ghost',onclick:()=>{turma=[];store.set('lot-turma',turma);tmsg.textContent='';upd();}},'Apagar a turma')),mural,tmsg));
  const simTurma=()=>{turma=[];for(let g=0;g<9;g++){const v=[0,0,0];for(let k=0;k<24;k++){const a=(Math.random()<.5)+(Math.random()<.5);v[a===2?0:a===1?1:2]++;}turma.push(v);}store.set('lot-turma',turma);tmsg.textContent='9 colegas virtuais fizeram 24 sorteios cada.';upd();};
  function drawAposta(n,c){apBox.innerHTML='';
    if(aposta==null){const sl=h('input',{type:'range',min:0,max:24,value:6,id:'lot-ap','aria-label':'Quantos aa em 24 sorteios'});const out=h('output',{class:'big-num'},'6');sl.oninput=()=>out.textContent=sl.value;
      apBox.append(h('div',{class:'callout stack',style:'gap:8px'},h('strong',{},'Faça a sua aposta antes de sortear'),h('span',{},'Em 24 descendentes de Aa × Aa, quantos serão aa (sementes verdes)?'),h('div',{class:'row',style:'gap:14px'},out,h('div',{style:'flex:1;min-width:160px'},sl)),
        h('button',{class:'btn primary',style:'align-self:flex-start',onclick:()=>{aposta=+sl.value;store.set('lot-aposta',aposta);upd();}},'Registrar aposta')));
      if(n)apBox.append(h('p',{class:'note'},'Você já começou a sortear: a aposta vale para os próximos 24.'));return;}
    const fim=n>=24;const aa24=fim?draws.slice(0,24).filter(d=>d==='aa').length:c.aa;const dif=Math.abs(aa24-aposta);
    apBox.append(h('div',{class:'row',style:'gap:10px'},h('span',{class:'pill ex'},'Sua aposta: '+aposta+' aa'),h('span',{class:'pill'},fim?'Resultado: '+aa24+' aa em 24':'Até agora: '+c.aa+' aa em '+n),
      fim?h('span',{class:'pill '+(dif<=1?'ok':dif<=3?'':'no')},dif===0?'Na mosca!':dif<=1?'Quase!':'Errou por '+dif):null,
      h('button',{class:'btn sm ghost',onclick:()=>{aposta=null;store.set('lot-aposta',null);upd();}},'Nova aposta')));
    if(fim)apBox.append(h('p',{class:'note'},'O esperado é 6 (1/4 de 24). Acertar exatamente é difícil: o acaso faz cada amostra variar.'));}
  function drawTubes(n,c,novo){tubes.innerHTML='';const K=[['AA','#d9a61e','amarela'],['Aa','#e9c94a','amarela'],['aa','#6fa33a','verde']];
    tubes.append(s('rect',{width:600,height:330,fill:'var(--surface)'}));
    const cap=Math.max(16,...K.map(([k])=>c[k]),Math.ceil(n/2)+2);const r=9,cols=3,rowH=2*r+2;const rows=Math.ceil(cap/cols);const th=Math.min(240,rows*rowH+8);const sc=th<rows*rowH+8?th/(rows*rowH+8):1;
    K.forEach(([k,col,fen],i)=>{const x=60+i*190,w=cols*(2*r+2)+12,top=34,bot=top+240;
      tubes.append(s('path',{d:`M${x},${top} V${bot-14} q0,14 14,14 H${x+w-14} q14,0 14,-14 V${top}`,fill:'var(--surface-2)',stroke:'var(--muted)','stroke-width':2.5}));
      const g=s('g',{transform:`translate(${x+6} ${bot-6}) scale(${sc})`});tubes.append(g);
      for(let j=0;j<c[k];j++){const cx=r+1+(j%cols)*(2*r+2),cy=-(r+1)-Math.floor(j/cols)*rowH;const isNew=novo&&novo.k===k&&j===c[k]-1;
        const e=s('circle',{cx,cy,r,fill:col,stroke:'rgba(0,0,0,.3)','stroke-width':1});if(isNew)e.setAttribute('class','pop');g.append(e);}
      if(n){const exp=n*(k==='Aa'?.5:.25);const ye=bot-6-Math.ceil(exp/cols)*rowH*sc;tubes.append(s('line',{x1:x-8,x2:x+w+8,y1:ye,y2:ye,stroke:'var(--ink)','stroke-width':2,'stroke-dasharray':'6 4'}));
        if(i===2)tubes.append(s('text',{x:x+w+12,y:ye+4,'font-size':12,fill:'var(--muted)'},'esperado'));}
      tubes.append(s('text',{x:x+w/2,y:22,'text-anchor':'middle','font-size':18,'font-weight':800,fill:'var(--ink)','font-family':'var(--f-mono)'},k));
      tubes.append(s('text',{x:x+w/2,y:bot+24,'text-anchor':'middle','font-size':15,'font-weight':700,fill:'var(--ink)'},c[k]+(n?' · '+pct(c[k]/n,0):'')));
      tubes.append(s('text',{x:x+w/2,y:bot+42,'text-anchor':'middle','font-size':12,fill:'var(--muted)'},'semente '+fen));});
    if(!n)tubes.append(s('text',{x:300,y:170,'text-anchor':'middle','font-size':15,fill:'var(--muted)'},'Sorteie para encher os tubos'));}
  function drawRatio(n,c){ratio.innerHTML='';if(!n)return;const am=c.AA+c.Aa,vd=c.aa;
    const bar=h('div',{style:'display:flex;height:22px;border-radius:999px;overflow:hidden;border:1px solid var(--line)'},h('span',{style:`width:${am/n*100}%;background:#e3bd3a`}),h('span',{style:`width:${vd/n*100}%;background:#6fa33a`}));
    ratio.append(h('div',{class:'stack',style:'gap:6px'},h('div',{class:'row',style:'justify-content:space-between'},h('strong',{},'Fenótipos: '+am+' amarelas : '+vd+' verdes'),h('span',{class:'mono'},vd?'≈ '+fmt(am/vd,1)+' : 1':'— : 0')),bar,
      h('div',{style:'position:relative;height:14px'},h('span',{class:'note',style:'position:absolute;left:75%;transform:translateX(-50%)'},'▲ 3 : 1'))));}
  function drawMural(c,n){mural.innerHTML='';if(!turma.length){return;}
    const all=[{v:[c.AA,c.Aa,c.aa],eu:true}].concat(turma.map(v=>({v})));const W=600,H=210,bw=W/all.length;const sv=s('svg',{class:'chart',viewBox:`0 0 ${W} ${H}`,role:'img','aria-label':'Porcentagem de aa de cada estudante'});
    sv.append(s('rect',{width:W,height:H,fill:'var(--surface)'}));const Y=v=>170-v/.6*150;
    [0,.25,.5].forEach(v=>{sv.append(s('line',{x1:30,x2:W,y1:Y(v),y2:Y(v),stroke:v===.25?'var(--ink)':'var(--line)','stroke-dasharray':v===.25?'6 4':null,'stroke-width':v===.25?2:1}));sv.append(s('text',{x:26,y:Y(v)+4,'text-anchor':'end','font-size':11,fill:'var(--muted)'},Math.round(v*100)+'%'));});
    all.forEach((o,i)=>{const t=o.v[0]+o.v[1]+o.v[2];const f=t?o.v[2]/t:0;const x=30+i*((W-40)/all.length)+6,w=(W-40)/all.length-12;
      sv.append(s('rect',{x,y:Y(f),width:w,height:170-Y(f),rx:4,fill:o.eu?'var(--tema)':'#9fbf72',stroke:o.eu?'var(--ink)':'none','stroke-width':2}));
      sv.append(s('text',{x:x+w/2,y:Y(f)-5,'text-anchor':'middle','font-size':11,'font-weight':700,fill:'var(--ink)'},t?Math.round(f*100)+'%':'—'));
      sv.append(s('text',{x:x+w/2,y:190,'text-anchor':'middle','font-size':11,'font-weight':o.eu?800:400,fill:o.eu?'var(--tema)':'var(--muted)'},o.eu?'Você':'#'+(i+1)));});
    const T=all.reduce((a,o)=>[a[0]+o.v[0],a[1]+o.v[1],a[2]+o.v[2]],[0,0,0]);const nt=T[0]+T[1]+T[2];
    const fs=all.map(o=>{const t=o.v[0]+o.v[1]+o.v[2];return t?o.v[2]/t:null;}).filter(x=>x!=null);
    mural.append(sv,h('div',{class:'stats'},h('div',{class:'stat'},h('span',{class:'note'},'Turma toda: aa'),h('span',{class:'big-num'},nt?pct(T[2]/nt,0):'—'),h('span',{class:'note'},T[2]+' de '+nt)),
      h('div',{class:'stat'},h('span',{class:'note'},'Menor e maior individual'),h('span',{class:'big-num'},fs.length?Math.round(Math.min(...fs)*100)+'–'+Math.round(Math.max(...fs)*100)+'%':'—')),
      h('div',{class:'stat'},h('span',{class:'note'},'Esperado'),h('span',{class:'big-num'},'25%'))),
      h('p',{class:'callout'},'Cada estudante sozinho pode ficar longe de 25%. Somando a turma, a porcentagem costuma chegar mais perto: amostras maiores variam menos.'));}
  function upd(){const c={AA:0,Aa:0,aa:0};draws.forEach(d=>c[d]++);const n=draws.length;const novo=n>prevN?{k:draws[n-1]}:null;prevN=n;
    last.innerHTML='';draws.slice(-24).forEach(d=>last.append(h('span',{class:'pill'+(d==='aa'?' ex':'')},d)));
    drawAposta(n,c);drawTubes(n,c,novo);drawRatio(n,c);drawMural(c,n);
    msg.innerHTML='';if(n)msg.append(h('div',{class:'fb info'},`Sementes verdes (aa): ${c.aa} de ${n} (${pct(c.aa/n,0)}). Esperado: 1/4 = 25%. `+(n<24?'Continue até 24.':'Uma amostra que se afasta de 3 : 1 não refuta sozinha o modelo. Simule a turma e compare.')));}
  upd();
"""
i=p.t.index("  // Direita: tabela, gráfico e turma");j=p.t.index("  // Meiose",i)
p.t=p.t[:i]+NEW+p.t[j:];p.n+=1
p.save()
