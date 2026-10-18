import sys,re; sys.path.insert(0,'tools')
from patchlib import P, QUIZ_TMPL
p=P('src/sites/ecologia.html')
p.rep("Simuladores, jogos e painéis para usar no projetor junto com os apêndices impressos. Cada aula tem a sua ferramenta; as fichas continuam sendo o registro dos estudantes.","Simuladores, jogos e laboratórios virtuais para fazer no celular ou no computador. Cada aula tem a sua ferramenta e termina com a ficha de respostas.")
p.rep("desc:'Os cartões A–H do Apêndice 1: efeitos (+, −, 0), relação proposta e uma pista nova que pode mudar a hipótese.'","desc:'Oito cartões de casos: efeitos (+, −, 0), relação proposta e uma pista nova que pode mudar a hipótese.'")
p.rep("desc:'Os setores registram propostas, a turma vota e o quadro de ações do Apêndice 8 se monta no projetor.'","desc:'Você representa os setores, registra propostas, define as prioridades e monta o quadro de ações.'")
p.rep("desc:'Revisão de todos os temas com cronômetro, placar por grupo e explicação de cada resposta.'","desc:'Revisão de todos os temas, com a explicação de cada resposta.'")
# cabeçalhos sem apêndices
for a,b in [("'Aulas 1 e 2 · Apêndice 1'","'Aulas 1 e 2'"),("'Aula 3 · Apêndice 1, ficha de observação'","'Aula 3'"),("'Aula 4 · Apêndice 2'","'Aula 4'"),("'Aulas 5 e 6 · Apêndice 3'","'Aulas 5 e 6'"),("'Aula 7 · Apêndice 4'","'Aula 7'"),("'Aulas 8 e 9 · Apêndice 5'","'Aulas 8 e 9'"),("'Aulas 10 e 11 · Apêndice 6'","'Aulas 10 e 11'"),("'Aula 12 · Apêndice 7'","'Aula 12'"),("'Aula 13 · Apêndice 8'","'Aula 13'")]: p.rep("head("+a,"head("+b)
# Aulas 1 e 2: progresso individual no lugar do placar dos grupos
p.cut("  // placar\n","\n  function open(c){",r"""  // progresso individual
  const done=store.get('det-done',{});
  const sb=h('div',{class:'panel stack'},h('span',{class:'label'},'Seu progresso'));left.append(sb);
  const prog=h('div',{class:'stack',style:'gap:6px'});sb.append(prog);
  function drawScores(){prog.innerHTML='';const n=CARDS.filter(c=>done[c.id]).length;prog.append(h('span',{class:'big-num'},n+'/'+CARDS.length),h('span',{class:'note'},'cartões classificados corretamente'));CARDS.forEach(c=>{if(c.btn)c.btn.querySelector('.num').textContent='CARTÃO '+c.id+(done[c.id]?' · ✓':'');});}
  drawScores();
  sb.append(h('button',{class:'btn sm ghost',style:'align-self:flex-start',onclick:()=>{Object.keys(done).forEach(k=>delete done[k]);store.set('det-done',done);drawScores();}},'Recomeçar'));
""")
p.rep("      out.append(h('div',{class:'fb '+(okSame&&okEff&&okRel?'ok':'info')},c.why));","      out.append(h('div',{class:'fb '+(okSame&&okEff&&okRel?'ok':'info')},c.why));\n      if(okSame&&okEff&&okRel){done[c.id]=true;store.set('det-done',done);drawScores();}")
# Aula 3
p.rep("Na ficha, registre como “esquema” e use a ampliação só quando observar lâmina de verdade.'","Na ficha, registre o organismo escolhido e a ampliação total usada no microscópio virtual.'")
# Aula 4
p.rep("hp.append(h('h3',{},'Rodadas da turma'))","hp.append(h('h3',{},'Suas rodadas'))")
p.rep("Pergunta para a turma: em que distribuição","Pense: em que distribuição")
# Aulas 5 e 6
p.rep("'Todos os valores são simulados. Use para discutir as fichas, não para substituir o gráfico feito à mão.'","'Todos os valores são simulados. Use o laboratório para responder à ficha desta aula.'")
p.rep("'Exemplo diferente das fichas. Troque pelos números da ficha ou da avaliação diagnóstica.'","'Exemplo para praticar. Depois, use os números da ficha desta aula.'")
p.rep("'Façam a conta no caderno primeiro.'","'Faça a conta antes de ver o resultado.'")
p.rep("series.push({name:'Ficha A',","series.push({name:'Curva A',");p.rep("series.push({name:'Ficha B',","series.push({name:'Curva B',")
p.rep("L.append(h('label',{class:'row'},fc,'Mostrar dados A e B da ficha'));","L.append(h('label',{class:'row'},fc,'Mostrar as curvas A e B da ficha'));")
# pirâmides etárias C e D (antes só no papel)
i=p.t.index("INIT.populacoes=root=>{");j=p.t.index("\n};",i)
pir=r"""
  // Estrutura etária: populações C e D (usadas na ficha)
  const piram=(nome,v)=>{const W=300,H=200,cx=150;let g=`<rect width="${W}" height="${H}" fill="var(--surface)"/><line x1="${cx}" y1="10" x2="${cx}" y2="178" stroke="var(--line)"/>`;
    v.forEach((x,i)=>{const y=162-i*30,w=x*12;g+=`<rect x="${cx-w}" y="${y}" width="${w}" height="24" rx="3" fill="var(--sky)" opacity=".85"/><rect x="${cx}" y="${y}" width="${w}" height="24" rx="3" fill="var(--berry)" opacity=".85"/>`;g+=`<text x="${W-6}" y="${y+16}" text-anchor="end" font-size="11" fill="var(--muted)">${['jovens','adultos jovens','adultos','maduros','idosos','muito idosos'][i]}</text>`;});
    g+=`<text x="${cx}" y="196" text-anchor="middle" font-size="12" font-weight="700" fill="var(--ink)">${nome}</text>`;const e=document.createElementNS(NS,'svg');e.setAttribute('viewBox',`0 0 ${W} ${H}`);e.setAttribute('class','chart');e.setAttribute('role','img');e.setAttribute('aria-label','Estrutura etária da '+nome);e.innerHTML=g;return e;};
  root.append(h('div',{class:'panel stack'},h('h3',{},'Estrutura etária das populações C e D'),h('p',{class:'note'},'Cada barra mostra quantos indivíduos há em cada faixa de idade (machos à esquerda, fêmeas à direita). Dados fictícios.'),
    h('div',{class:'cols'},piram('População C',[9,7,5,3.5,2,1]),piram('População D',[3,3.5,4,4.5,4,3])),
    h('p',{class:'note'},'Pergunta da ficha: qual população tende a crescer, se as condições se mantiverem? Que limites existem para prever o futuro só com esses dados?')));"""
p.t=p.t[:j]+pir+p.t[j:];p.n+=1
# Aulas 8 e 9
p.rep("'Processos (tiras do apêndice)'","'Processos'")
p.rep("'Quando o grupo terminar, clique em “Conferir modelo”.'","'Quando terminar, clique em “Conferir modelo”.'")
p.rep("`Cada estudante é um átomo de ${key==='carbono'?'carbono':'nitrogênio'}. Role o dado 10 vezes e anote o caminho no caderno.`","`Você é um átomo de ${key==='carbono'?'carbono':'nitrogênio'}. Role o dado 10 vezes: o caminho fica anotado abaixo.`")
# Aulas 10 e 11: sem troca de turma na bancada
i=p.t.index("top.append(h('span',{class:'label'},'Turma'),seg([['2A','Turma A'],['2B','Turma B']]");j=p.t.index(",badge,",i)
p.t=p.t[:i]+"top.append("+p.t[j+1:];p.n+=1
p.rep("const t=/B$/i.test(ident.turma||'')?'2B':'2A';","const t='2A';")
p.rep("fillMsg.textContent='Resultados da bancada da Turma '+(ident.turma||'A')+' copiados. Confira antes de enviar.'","fillMsg.textContent='Resultados da bancada copiados. Confira antes de enviar.'")
# Aula 12: opinião individual no lugar da votação da turma
i=p.t.index("  const votes=store.get('esq-votes',{f:0,b:0,d:0});");j=p.t.index("vdraw();}},'Zerar'));};vdraw();",i)+len("vdraw();}},'Zerar'));};vdraw();")
p.t=p.t[:i]+"""  let voto=store.get('esq-voto',null);const vb=h('div',{class:'row'});L.append(h('span',{class:'label'},'Qual é a sua opinião?'),vb);
  const vdraw=()=>{vb.innerHTML='';vb.append(seg([['f','É fato'],['b','É boato'],['d','Precisamos de dados']],voto,v=>{voto=v;store.set('esq-voto',v);},{label:'Sua opinião'}));};vdraw();"""+p.t[j:];p.n+=1
# Aula 13
p.rep("'Desafio fictício: famílias sem esgotamento adequado, uso de água doce para lazer, resíduos acumulados, cães e solo degradado. Preocupação com esquistossomose e leishmaniose visceral, sem transmissão confirmada.'","'Desafio fictício: famílias sem esgotamento adequado, uso de água doce para lazer, resíduos acumulados, cães e solo degradado. Preocupação com esquistossomose e leishmaniose visceral, sem transmissão confirmada. Você representa os quatro setores: proponha ações, ordene as prioridades e monte o quadro do conselho.'")
p.rep("h('button',{class:'btn sm primary',onclick:()=>{p.v++;save();draw();},'aria-label':'Votar'},'+ voto')","h('button',{class:'btn sm primary',onclick:()=>{p.v++;save();draw();},'aria-label':'Aumentar a prioridade'},'+ prioridade')")
p.rep("onclick:()=>{p.v=Math.max(0,p.v-1);save();draw();},'aria-label':'Tirar voto'}","onclick:()=>{p.v=Math.max(0,p.v-1);save();draw();},'aria-label':'Diminuir a prioridade'}")
p.rep("'Síntese: escolham 3 ações iniciais e 1 de médio prazo, considerando a capacidade de execução. Uma mesma medida não precisa prevenir as duas doenças.'","'Síntese: escolha 3 ações iniciais e 1 de médio prazo, considerando a capacidade de execução. As ações com mais prioridade sobem na lista. Uma mesma medida não precisa prevenir as duas doenças.'")
# Aula 14: quiz individual
i=p.t.index("  root.append(head('Aula 14 · Revisão','Quiz da unidade'");j=p.t.index("  sb();q();\n};",i)+len("  sb();q();\n")
p.t=p.t[:i]+"  root.append(head('Aula 14 · Revisão','Quiz da unidade','Perguntas diferentes das da avaliação individual. Toque numa alternativa para ver se acertou e ler a explicação.'));\n"+QUIZ_TMPL.replace('__IL__',"ilu(QZ_IL[qi],'ilu')")+"  root.append(h('div',{class:'cols wide-left'},qcard,qside));q();\n"+p.t[j:];p.n+=1
# Fichas
for a,b in [
 ("tipo:'Grupo + bilhete individual',\n  desc:'Cada estudante envia este formulário com as respostas do grupo e o seu próprio bilhete.',","tipo:'Individual',\n  desc:'Envie as suas classificações dos cartões e o seu bilhete.',"),
 ("{k:'hdr',t:'Classifique a relação de cada cartão (Apêndice 1)'}","{k:'hdr',t:'Classifique a relação de cada cartão'}"),
 ("help:'Exemplo: 400× (10× × 40×). Se usou fotografia, escreva \"imagem\".'","help:'Exemplo: 400× (10× × 40×), como aparece no microscópio virtual.'"),
 ("{k:'par',t:'Descreva as estruturas que você identificou e a legenda do seu desenho',man:2}","{k:'par',t:'Descreva as estruturas que você identificou no microscópio virtual',man:2}"),
 ("tipo:'Grupo',\n  desc:'Cada estudante envia com os dados do seu grupo (Apêndice 2). Use vírgula ou ponto nos decimais.',","tipo:'Individual',\n  desc:'Use os dados da sua bandeja. Use vírgula ou ponto nos decimais.',"),
 ("desc:'Respostas da ficha do Apêndice 3 (dados simulados).',","desc:'Use o laboratório de populações e as pirâmides C e D (dados simulados).',"),
 ("desc:'Cenários do Apêndice 4 (situações fictícias inspiradas na Caatinga).',","desc:'Cenários do gestor da área (situações fictícias inspiradas na Caatinga).',"),
 ("desc:'Depois de montar os modelos com os cartões do Apêndice 5.',","desc:'Depois de montar os modelos dos ciclos no site.',"),
 ("tipo:'Grupo + síntese individual',\n  desc:'Cada estudante envia com os dados do grupo (Apêndice 6). Volumes em mL.',","tipo:'Individual',\n  desc:'Use os resultados da sua bancada virtual. Volumes em mL.',"),
 ("{k:'par',t:'Hipótese do grupo',man:1}","{k:'par',t:'Sua hipótese',man:1}"),
 ("desc:'Caso fictício do Apêndice 7.',","desc:'Caso fictício desta aula.',"),
 ("tipo:'Grupo + síntese individual',\n  desc:'Cada estudante envia com a proposta do seu setor (Apêndice 8) e a sua síntese.',","tipo:'Individual',\n  desc:'Envie a sua proposta principal e a sua síntese.',"),
 ("{k:'mc',t:'Setor do grupo',","{k:'mc',t:'Setor da sua proposta principal',"),
 ("desc:'Versão digital do Apêndice 9. Responda com suas palavras.',","desc:'Avaliação da unidade. Responda com suas palavras.',"),
]: p.rep(a,b)
k=len(re.findall(r"tipo:'(Grupo|Dupla|Duplas)[^']*'",p.t));p.t=re.sub(r"tipo:'(Grupo|Dupla|Duplas)[^']*'","tipo:'Individual'",p.t);p.n+=k
p.save()
