p='professor.body.html';t=open(p).read()
def rep(o,n):
    global t
    assert t.count(o)==1,(t.count(o),o[:80]);t=t.replace(o,n)
rep("""          <div class="grid2">
            <label class="field"><span class="label">Como os estudantes chamam você</span><input type="text" id="pNome" maxlength="60" placeholder="Prof.ª Ana Souza" autocomplete="name"></label>
            <label class="field"><span class="label">Escola (opcional)</span><input type="text" id="pEscola" maxlength="80" placeholder="EE Professor João Lima"></label>
          </div>""","""          <label class="field" style="max-width:420px"><span class="label">Como os estudantes chamam você</span><input type="text" id="pNome" maxlength="60" placeholder="Prof.ª Ana Souza" autocomplete="name"></label>""")
rep("""          <div class="stack" style="gap:4px"><h2>Suas turmas</h2><p class="note">Marque as turmas de cada ano. O estudante escolhe a turma dele na ficha.</p></div>
          <div id="series"></div>
          <div class="grid2">
            <label class="field"><span class="label">Outras turmas (separe por vírgula)</span><input type="text" id="pOutras" maxlength="200" placeholder="2º Técnico, EJA 3"></label>
            <label class="field"><span class="label">Grupos por turma</span><input type="number" id="pGrupos" min="1" max="20" value="8" inputmode="numeric"></label>
          </div>""","""          <div class="stack" style="gap:4px"><h2>Suas escolas e turmas</h2><p class="note">Marque as turmas de cada ano. O estudante escolhe a turma dele na ficha. Dá aula em mais de uma escola? Adicione cada uma: cada escola ganha o seu próprio link e QR code, e as fichas de todas chegam na mesma planilha, com a coluna “Escola”. No painel, você filtra por escola e turma.</p></div>
          <div id="escolas" class="stack" style="gap:16px"></div>
          <div class="row"><button type="button" class="btn" id="addEscola">+ Adicionar outra escola</button></div>
          <label class="field" style="max-width:220px"><span class="label">Grupos por turma</span><input type="number" id="pGrupos" min="1" max="20" value="8" inputmode="numeric"></label>""")
rep(".serie b{font-family:var(--f-display);font-size:1.1rem}",""".serie b{font-family:var(--f-display);font-size:1.1rem}
.escola-box{border:1px solid var(--line);border-radius:16px;padding:14px 16px;display:flex;flex-direction:column;gap:10px;background:var(--bg)}
.escola-top{display:flex;gap:10px;align-items:flex-end;flex-wrap:wrap}.escola-top .field{flex:1 1 240px}
.link-escola{border:1px solid var(--line);border-radius:16px;padding:16px;display:flex;flex-direction:column;gap:12px}
.link-escola h3{margin:0;font-family:var(--f-display);font-size:1.15rem}""")
# JS
rep("""  let C=Object.assign({nome:'',escola:'',sel:[],outras:'',grupos:8,r:'',senha:'',base:''},P.prof()||{});
  if(!C.senha)C.senha=novaSenha();
  const turmasDe=c=>c.sel.slice().sort((a,b)=>SERIES.indexOf(a.slice(0,2))-SERIES.indexOf(b.slice(0,2))||a.localeCompare(b,'pt-BR')).concat(String(c.outras||'').split(',').map(s=>s.trim()).filter(Boolean)).filter((t,i,arr)=>arr.indexOf(t)===i).slice(0,40);
  function save(){C.turmas=turmasDe(C);P.salvarProf(C);update();}

  // 1. nome
  $('#pNome').value=C.nome;$('#pEscola').value=C.escola;
  $('#pNome').oninput=e=>{C.nome=e.target.value;save();};$('#pEscola').oninput=e=>{C.escola=e.target.value;save();};
  // 2. turmas
  const series=$('#series');
  SERIES.forEach(sr=>{const chips=el('div',{class:'chips',role:'group','aria-label':sr+' ano'});
    LETRAS.forEach(l=>{const t=sr+l;const b=el('button',{type:'button',class:'chip','aria-pressed':String(C.sel.includes(t))},l);b.onclick=()=>{const on=C.sel.includes(t);C.sel=on?C.sel.filter(x=>x!==t):C.sel.concat(t);b.setAttribute('aria-pressed',String(!on));save();};chips.append(b);});
    series.append(el('div',{class:'serie'},el('b',{},sr+' ano'),chips));});
  $('#pOutras').value=C.outras;$('#pOutras').oninput=e=>{C.outras=e.target.value;save();};""",
"""  let C=Object.assign({nome:'',escolas:null,grupos:8,r:'',senha:'',base:''},P.prof()||{});
  // Configuração antiga (uma escola só) vira a primeira escola da lista
  if(!Array.isArray(C.escolas)||!C.escolas.length)C.escolas=[{nome:C.escola||'',sel:Array.isArray(C.sel)?C.sel:[],outras:C.outras||''}];
  delete C.escola;delete C.sel;delete C.outras;
  if(!C.senha)C.senha=novaSenha();
  const turmasDe=c=>(c.sel||[]).slice().sort((a,b)=>SERIES.indexOf(a.slice(0,2))-SERIES.indexOf(b.slice(0,2))||a.localeCompare(b,'pt-BR')).concat(String(c.outras||'').split(',').map(s=>s.trim()).filter(Boolean)).filter((t,i,arr)=>arr.indexOf(t)===i).slice(0,40);
  function save(){C.escolas.forEach(e=>e.turmas=turmasDe(e));C.turmas=C.escolas[0].turmas;C.escola=C.escolas[0].nome;P.salvarProf(C);update();}

  // 1. nome
  $('#pNome').value=C.nome;
  $('#pNome').oninput=e=>{C.nome=e.target.value;save();};
  // 2. escolas e turmas
  const escBox=$('#escolas');
  function drawEscolas(){escBox.innerHTML='';const multi=C.escolas.length>1;
    C.escolas.forEach((E,ix)=>{const box=el('div',{class:'escola-box'});
      const nm=el('input',{type:'text',maxlength:'80',placeholder:'EE Professor João Lima','aria-label':'Nome da escola '+(ix+1)});nm.value=E.nome||'';nm.oninput=e=>{E.nome=e.target.value;save();};
      const top=el('div',{class:'escola-top'},el('label',{class:'field'},el('span',{class:'label'},multi?'Escola '+(ix+1):'Escola'+(multi?'':' (opcional se for só uma)')),nm));
      if(multi)top.append(el('button',{type:'button',class:'btn ghost sm',onclick:()=>{if(!confirm('Remover '+(E.nome||'esta escola')+' da lista? O link dela deixa de aparecer aqui, mas quem já entrou continua enviando para a sua planilha.'))return;C.escolas.splice(ix,1);drawEscolas();save();}},'Remover escola'));
      box.append(top);
      SERIES.forEach(sr=>{const chips=el('div',{class:'chips',role:'group','aria-label':sr+' ano, escola '+(ix+1)});
        LETRAS.forEach(l=>{const t=sr+l;const b=el('button',{type:'button',class:'chip','aria-pressed':String((E.sel||[]).includes(t))},l);b.onclick=()=>{E.sel=E.sel||[];const on=E.sel.includes(t);E.sel=on?E.sel.filter(x=>x!==t):E.sel.concat(t);b.setAttribute('aria-pressed',String(!on));save();};chips.append(b);});
        box.append(el('div',{class:'serie'},el('b',{},sr+' ano'),chips));});
      const ou=el('input',{type:'text',maxlength:'200',placeholder:'2º Técnico, EJA 3'});ou.value=E.outras||'';ou.oninput=e=>{E.outras=e.target.value;save();};
      box.append(el('label',{class:'field'},el('span',{class:'label'},'Outras turmas (separe por vírgula)'),ou));
      escBox.append(box);});}
  $('#addEscola').onclick=()=>{C.escolas.push({nome:'',sel:[],outras:''});drawEscolas();save();const ins=escBox.querySelectorAll('input[type=text]');const last=escBox.lastElementChild&&escBox.lastElementChild.querySelector('input');if(last)last.focus();};
  drawEscolas();""")
rep("""    C.turmas=turmasDe(C);
    const okNome=!!(C.nome||'').trim(),okT=C.turmas.length>0,okR=!!C.r;""","""    C.escolas.forEach(e=>e.turmas=turmasDe(e));
    const multi=C.escolas.length>1;
    const okNome=!!(C.nome||'').trim(),okT=C.escolas.every(e=>e.turmas.length>0)&&(!multi||C.escolas.every(e=>(e.nome||'').trim())),okR=!!C.r;
    const nT=C.escolas.reduce((a,e)=>a+e.turmas.length,0);""")
rep("""    if(!pronto){out.append(el('p',{class:'fb warn'},'Complete '+[!okNome&&'o seu nome',!okT&&'as turmas',!okR&&'o URL do receptor'].filter(Boolean).join(', ')+' para gerar o link da turma.'));}
    else{
      const cod=P.codigoDaTurma({n:C.nome,e:C.escola,r:C.r,t:C.turmas,g:C.grupos});const link=P.linkDaTurma(C);""","""    if(!pronto){out.append(el('p',{class:'fb warn'},'Complete '+[!okNome&&'o seu nome',!okT&&(multi?'o nome e as turmas de cada escola':'as turmas'),!okR&&'o URL do receptor'].filter(Boolean).join(', ')+' para gerar o link da turma.'));}
    else C.escolas.forEach(E=>{
      const blk=multi?el('div',{class:'link-escola'},el('h3',{},E.nome)):out;if(multi)out.append(blk);
      const PE={nome:C.nome,escola:E.nome,r:C.r,turmas:E.turmas,grupos:C.grupos,base:C.base};
      const cod=P.codigoDaTurma({n:C.nome,e:E.nome,r:C.r,t:E.turmas,g:C.grupos});const link=P.linkDaTurma(PE);""")
# inside the else body, replace out.append with blk.append and closing
t2=t
a=t2.index("      const cod=P.codigoDaTurma({n:C.nome,e:E.nome")
b=t2.index("    // situação")
body=t2[a:b]
body=body.replace("out.append(","blk.append(").replace("out.querySelector('.qr')","blk.querySelector('.qr')").replace("projetar(link)","projetar(link,E.nome)")
body=body.replace("const msg='Turma, para usar","const msg=(multi?E.nome+'\\n':'')+'Turma, para usar")
assert body.rstrip().endswith("}"),body[-40:]
body=body.rstrip()[:-1]+"});\n"
t=t2[:a]+body+t2[b:]
rep("[['Nome',okNome],['Turmas'+(okT?' ('+C.turmas.length+')':''),okT],","[['Nome',okNome],[(multi?'Escolas e turmas ('+C.escolas.length+' escolas, '+nT+' turmas)':'Turmas'+(okT?' ('+nT+')':'')),okT],")
rep("""      el('span',{class:'note'},'Esta ficha vai para ',el('strong',{},(C.nome||'').trim()||'(seu nome)')),
      el('span',{class:'label'},'Turma'),el('div',{class:'chips'},(C.turmas.length?C.turmas:['—'])""","""      el('span',{class:'note'},'Esta ficha vai para ',el('strong',{},(C.nome||'').trim()||'(seu nome)'),(C.escolas[0].nome||'').trim()?' · '+C.escolas[0].nome.trim():''),
      el('span',{class:'label'},'Turma'),el('div',{class:'chips'},(C.escolas[0].turmas.length?C.escolas[0].turmas:['—'])""")
rep("C.turmas.length>9?el('span',{class:'note'},'+'+(C.turmas.length-9)):null)","C.escolas[0].turmas.length>9?el('span',{class:'note'},'+'+(C.escolas[0].turmas.length-9)):null)")
rep("function projetar(link){const o=el('div',{class:'overlay',role:'dialog','aria-label':'QR code da turma'},el('h2',{},'Turma de '+((C.nome||'').trim()||'professor'))",
    "function projetar(link,esc){const o=el('div',{class:'overlay',role:'dialog','aria-label':'QR code da turma'},el('h2',{},'Turma de '+((C.nome||'').trim()||'professor')+(esc?' · '+esc:''))")
open(p,'w').write(t)
