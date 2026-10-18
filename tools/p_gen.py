import sys; sys.path.insert(0,'tools')
from patchlib import P, QUIZ_TMPL
p=P('src/sites/genetica.html')
# Início
p.rep("Simuladores, modelos e desafios para usar no projetor e no celular Cada aula traz tudo o que é preciso: a pergunta para começar, as informações do caso, a ferramenta e a ficha de respostas.",
      "Simuladores, modelos e desafios para fazer no celular ou no computador. Cada aula traz tudo o que é preciso: a pergunta para começar, as informações do caso, a ferramenta e a ficha de respostas.")
# Cartões das aulas
p.rep("desc:'Dois sacos, uma ficha A e uma a em cada. Sorteie com reposição e compare a amostra com a previsão.'","desc:'Dois sacos virtuais, uma ficha A e uma a em cada. Sorteie com reposição e compare a amostra com a previsão.'")
p.rep("desc:'Seis moedas por descendente, um histograma da turma e o efeito do ambiente sobre o mesmo genótipo.'","desc:'Seis moedas virtuais por descendente, o histograma de uma turma simulada e o efeito do ambiente sobre o mesmo genótipo.'")
p.rep("title:'DNA em escala de mesa',desc:'Monte a fita complementar, marque 5′ e 3′ e passe pela lista de auditoria.'","title:'DNA peça por peça',desc:'Monte a fita complementar, marque 5′ e 3′ e passe pela lista de auditoria.'")
p.rep("desc:'Quatro estações de revisão e um quiz com placar por grupo e explicação de cada resposta.'","desc:'Quatro estações de revisão e um quiz com a explicação de cada resposta.'")
# Aula 2
p.rep("Cada saco é um genitor Aa: uma ficha A e uma ficha a. Retire uma ficha de cada saco, registre e devolva.'));","Cada saco virtual é um genitor Aa: uma ficha A e uma ficha a. O site retira uma ficha de cada saco, registra e devolve.'));")
p.cut("    h('div',{class:'stack',style:'gap:8px;border-top:1px dashed var(--line);padding-top:12px'},\n      h('span',{class:'label'},'Fez o sorteio com sacos e fichas de verdade?'),",
      "  function save(){","""  );
""") if False else None
s=p.t
i=s.index("    svg,last,h('div',{class:'row'},btn1,btn10,reset),\n")
j=s.index("'Desfazer o último'))));",i)+len("'Desfazer o último'))));")
p.t=s[:i]+"    svg,last,h('div',{class:'row'},btn1,btn10,reset));"+s[j:];p.n+=1
p.cut("  const gin={AA:h('input'","  function upd(){const c={AA:0,Aa:0,aa:0};",
r"""  const tmsg=h('p',{class:'note'});
  const simTurma=()=>{turma=[];for(let g=0;g<9;g++){const v=[0,0,0];for(let k=0;k<24;k++){const a=(Math.random()<.5)+(Math.random()<.5);v[a===2?0:a===1?1:2]++;}turma.push(v);}store.set('lot-turma',turma);tmsg.textContent='Turma simulada: 9 colegas virtuais com 24 sorteios cada, somados aos seus.';upd();};
  R.append(h('h3',{},'Registro e comparação'),tbl,ch,msg,
    h('div',{class:'stack',style:'gap:8px;border-top:1px solid var(--line);padding-top:12px'},h('span',{class:'label'},'E se a turma toda sorteasse?'),
      h('p',{class:'note'},'Simule 9 colegas fazendo 24 sorteios cada. A coluna “Turma” soma os sorteios deles aos seus, para comparar uma amostra pequena com uma maior.'),
      h('div',{class:'row'},h('button',{class:'btn sm',onclick:simTurma},'Simular a turma'),h('button',{class:'btn sm ghost',onclick:()=>{turma=[];store.set('lot-turma',turma);tmsg.textContent='Turma simulada apagada.';upd();}},'Apagar a turma')),tmsg));
""")
p.rep("barChart(ch,{cats:['AA','Aa','aa'],series:[{name:'Grupo ('+n+')'","barChart(ch,{cats:['AA','Aa','aa'],series:[{name:'Seus ('+n+')'")
p.rep("`Fenótipo recessivo (aa) no grupo: ${c.aa} de ${n}","`Fenótipo recessivo (aa) nos seus sorteios: ${c.aa} de ${n}")
p.rep("Compare com o total da turma: o que muda com uma amostra maior?","Simule a turma e compare: o que muda com uma amostra maior?")
p.rep("h('th',{class:'n'},'Grupo'),h('th',{class:'n'},'Freq. do grupo')","h('th',{class:'n'},'Seus'),h('th',{class:'n'},'Sua freq.')")
p.rep("model('Sorteio computacional com probabilidade 1/2 para cada ficha. Não substitui o sorteio com os sacos.')","model('Sorteio computacional com probabilidade 1/2 para cada ficha, como num sorteio com sacos e fichas.')")
# Aula 4
p.rep("h('p',{},'Desenhem o heredograma com as gerações e os indivíduos numerados. Depois comparem com o desenho daqui.')","h('p',{},'Antes de abrir o desenho, imagine o heredograma: quantas gerações, quantos indivíduos e quais símbolos ficam preenchidos. Depois mostre o heredograma e confira.')")
# Aula 10
p.rep("'Sortear 8 (um grupo)'","'Sortear 8'")
p.cut("  // entrada manual da turma","  function upd(){const c=turma||",
r"""  // turma simulada
  const ch=s('svg',{class:'chart',role:'img','aria-label':'Histograma do índice genético'});const msg=h('p',{class:'note'});
  const simT=()=>{const v=TEO.map(()=>0);for(let k=0;k<240;k++){let x=0;for(let b=0;b<6;b++)x+=Math.random()<.5?1:0;v[x]++;}turma=v;store.set('jar-turma',v);upd();};
  R.append(h('p',{class:'note'},'O histograma mostra os seus sorteios. Para ver uma amostra grande, simule uma turma de 30 estudantes com 8 descendentes cada.'),h('div',{class:'row'},h('button',{class:'btn sm',onclick:simT},'Simular a turma (240 descendentes)'),h('button',{class:'btn sm ghost',onclick:()=>{turma=null;store.set('jar-turma',null);upd();}},'Voltar aos meus sorteios')),ch,msg);
""")
p.rep("{name:turma?'Turma (digitado)':'Sorteios ('+n+')'","{name:turma?'Turma simulada ('+n+')':'Seus sorteios ('+n+')'")
p.rep("Amostras da turma podem se afastar dela.`:'Sorteie descendentes ou digite a contagem da turma.';}","Amostras pequenas podem se afastar dela.`:'Sorteie descendentes ou simule a turma.';}")
p.rep("'Os cartões ambientais −1, 0 e +1 são aplicados ao MESMO genótipo. O ajuste é ilustrativo, não uma estimativa de efeitos reais.'","'Os ambientes −1 (pobre), 0 e +1 (rico) são aplicados ao MESMO genótipo. O ajuste é ilustrativo, não uma estimativa de efeitos reais.'")
p.rep("[[-1,'Cartão −1','#c9a26a'],[0,'Cartão 0','#a87b4f'],[1,'Cartão +1','#7a5a3a']]","[[-1,'Ambiente −1','#c9a26a'],[0,'Ambiente 0','#a87b4f'],[1,'Ambiente +1','#7a5a3a']]")
# Aula 12
p.rep("head('Aula 12 · Livro p. 351–353','DNA em escala de mesa'","head('Aula 12 · Livro p. 351–353','DNA peça por peça'")
p.rep("'Confira no modelo de papel: a base sai do açúcar, não do fosfato.'","'Confira no esquema acima: a base sai do açúcar, não do fosfato.'")
p.rep("row('O grupo explica o que o modelo simplifica?'","row('Você consegue explicar o que o modelo simplifica?'")
p.rep("model('Peças de papel representadas na tela. O modelo não substitui a montagem em grupo com papel e barbante.')","model('Peças representadas na tela. O modelo é plano e curto: não mostra a hélice nem as dimensões reais.')")
# Aula 14
p.rep("O DNA fica na mesa “núcleo”. Copie a fita molde em RNAm e leve só o RNAm à mesa “citoplasma”.","O DNA fica na área “núcleo”. Copie a fita molde em RNAm e leve só o RNAm à área “citoplasma”.")
p.rep("'Ainda vazia. Termine o RNAm na mesa “núcleo”.'","'Ainda vazia. Termine o RNAm na área “núcleo”.'")
# Aula 15
p.rep("'Papéis rotativos: RNAm mantém a sequência orientada; ribossomo indica o códon em leitura; RNAt apresenta o anticódon e traz o aminoácido; auditor confere início, ordem e término.'","'Acompanhe cada participante da tradução: o RNAm mantém a sequência orientada; o ribossomo lê um códon por vez; o RNAt traz o anticódon e o aminoácido. No fim, confira início, ordem e término.'")
# Aula 16
p.rep("placeholder:'Justificativa da equipe: compare os códons e a cadeia.'","placeholder:'Sua justificativa: compare os códons e a cadeia.'")
p.rep("'Escreva a justificativa da equipe (pelo menos uma frase) antes de abrir a análise.'","'Escreva a sua justificativa (pelo menos uma frase) antes de abrir a análise.'")
# Aula 17
p.rep("'Quatro estações reutilizam os modelos e registros das aulas. Cada painel apresenta uma pergunta central, um modelo ou dado, uma explicação e um limite. Depois, o quiz da unidade.'","'Quatro estações de revisão reúnem os modelos das aulas. Escolha uma estação, reabra as ferramentas e prepare uma explicação com um modelo ou dado e um limite. Depois, faça o quiz da unidade.'")
p.rep("h('p',{class:'callout'},'O visitante registra uma dúvida sobre a explicação, não sobre beleza ou popularidade. Não incluir informações pessoais de estudantes.')","h('p',{class:'callout'},'Na ficha, registre a estação escolhida, a pergunta central, o modelo ou dado usado, a explicação e um limite do modelo.')")
i=p.t.index("  // Quiz\n  let nT=store.get('qz-n',4)");j=p.t.index("  sb();q();\n};",i)+len("  sb();q();\n")
p.t=p.t[:i]+"  // Quiz individual\n  root.append(h('h3',{style:'font-size:1.5rem'},'Quiz da unidade'),h('p',{class:'note'},'Números diferentes dos da avaliação individual.'));\n"+QUIZ_TMPL.replace('__IL__','null')+"  root.append(h('div',{class:'cols wl'},qcard,qside));q();\n"+p.t[j:];p.n+=1
# Aula 18
p.rep("h('p',{class:'note'},'Adaptações de acesso (tempo ampliado, resposta oral ou por desenho) mantêm a exigência conceitual.')","h('p',{class:'note'},'Use o cronômetro para controlar o seu tempo. Se precisar de mais tempo, combine com o professor.')")
# Fichas
for a,b in [
 ("tipo:'Grupo + registro individual',desc:'O grupo discute o arquivo; cada estudante envia o seu registro.'","tipo:'Individual',desc:'Organize o arquivo, teste as hipóteses e envie o seu registro.'"),
 ("'Use o botão “Preencher com os dados da ferramenta” ou resuma os registros na ordem que o grupo escolheu.'","'Use o botão “Preencher com os dados da ferramenta” ou resuma os registros na ordem que você escolheu.'"),
 ("desc:'Dados do sorteio (com os sacos ou no site). Não altere resultados para obter a proporção esperada.'","desc:'Dados dos seus sorteios e da turma simulada. Não altere resultados para obter a proporção esperada.'"),
 ("{k:'num',t:'Contagem do grupo · AA',fill:()=>lotCounts().AA},{k:'num',t:'Contagem do grupo · Aa',fill:()=>lotCounts().Aa},{k:'num',t:'Contagem do grupo · aa',fill:()=>lotCounts().aa}","{k:'num',t:'Seus sorteios · AA',fill:()=>lotCounts().AA},{k:'num',t:'Seus sorteios · Aa',fill:()=>lotCounts().Aa},{k:'num',t:'Seus sorteios · aa',fill:()=>lotCounts().aa}"),
 ("{k:'num',t:'Total da turma · AA',fill:()=>lotTurma().AA},{k:'num',t:'Total da turma · Aa',fill:()=>lotTurma().Aa},{k:'num',t:'Total da turma · aa',fill:()=>lotTurma().aa}","{k:'num',t:'Total com a turma simulada · AA',fill:()=>lotTurma().AA},{k:'num',t:'Total com a turma simulada · Aa',fill:()=>lotTurma().Aa},{k:'num',t:'Total com a turma simulada · aa',fill:()=>lotTurma().aa}"),
 ("desc:'Contagem da turma por índice genético (0 a 6).'","desc:'Contagem por índice genético (0 a 6): use a turma simulada ou os seus sorteios.'"),
 ("{k:'num',t:'Contagem da turma · índice '+i,fill:()=>jarCounts()[i]}","{k:'num',t:'Contagem por índice · '+i,fill:()=>jarCounts()[i]}"),
 ("titulo:'Aula 12 · DNA em escala de mesa'","titulo:'Aula 12 · DNA peça por peça'"),
 ("'Fechamento: aponte uma propriedade do DNA representada e uma que o modelo de papel não mostra'","'Fechamento: aponte uma propriedade do DNA representada e uma que o modelo do site não mostra'"),
 ("'Descreva as duas moléculas-filhas que o grupo construiu'","'Descreva as duas moléculas-filhas da primeira geração no modelo semiconservativo'"),
 ("'Como o grupo soube onde começar e onde terminar?'","'Como você soube onde começar e onde terminar?'"),
 ("desc:'Dossiê da equipe sobre os quatro envelopes.'","desc:'Seu dossiê sobre os quatro envelopes.'"),
 ("tipo:'Grupo + síntese individual',desc:'Registro do painel do grupo e a sua síntese.'","tipo:'Individual',desc:'Registro da estação que você escolheu e a sua síntese.'"),
 ("{k:'mc',t:'Estação do grupo'","{k:'mc',t:'Estação escolhida'"),
 ("{k:'par',t:'Pergunta recebida de um visitante',man:1}","{k:'par',t:'Uma dúvida que ficou depois de revisar a estação',man:1}"),
]: p.rep(a,b)
import re
k=len(re.findall(r"tipo:'(Grupo|Dupla|Duplas)[^']*'",p.t))
p.t=re.sub(r"tipo:'(Grupo|Dupla|Duplas)[^']*'","tipo:'Individual'",p.t);p.n+=k
p.save()
