import sys,re; sys.path.insert(0,'tools')
from patchlib import P, QUIZ_TMPL
p=P('src/sites/celulas.html')
p.rep("Cada aula começa com uma previsão, tem uma ferramenta para investigar e termina com a ficha para enviar ao professor.","Tudo é feito no celular ou no computador: cada aula começa com uma previsão, tem uma ferramenta para investigar e termina com a ficha para enviar ao professor.")
# rótulos dos cartões
for a,b in [("ap:'Apêndice 1 · ficha de modelos',title:'Detetive do nucleoide'","ap:'Quadro comparativo',title:'Detetive do nucleoide'"),
            ("ap:'Apêndice 1 · ficha de modelos',title:'Fábrica de leite de cabra'","ap:'Percurso da proteína',title:'Fábrica de leite de cabra'"),
            ("ap:'Apêndice 1',title:'Microscópio da cebola'","ap:'Microscópio virtual',title:'Microscópio da cebola'"),
            ("ap:'Apêndice 2',title:'Batata no sal',desc:'Experimento virtual de osmose com balança, réplicas e verificação de teste justo. Também aceita os dados reais da turma.'","ap:'Experimento virtual',title:'Batata no sal',desc:'Experimento virtual de osmose com balança, réplicas e verificação de teste justo.'"),
            ("ap:'Apêndice 3',title:'Do novelo ao cromossomo'","ap:'Modelos de cromossomos',title:'Do novelo ao cromossomo'"),
            ("ap:'Apêndice 3',title:'Cicatrização em ação'","ap:'Simulador do ciclo celular',title:'Cicatrização em ação'"),
            ("ap:'Apêndice 3',title:'Loteria dos gametas'","ap:'Simulador da meiose',title:'Loteria dos gametas'"),
            ("ap:'Apêndice 4',title:'Laboratório do pão',desc:'Garrafas A a D com balões, fita métrica e cronômetro.","ap:'Experimento virtual',title:'Laboratório do pão',desc:'Garrafas virtuais A a D com balões, fita métrica e cronômetro."),
            ("ap:'Apêndice 4',title:'Do balão ao gráfico'","ap:'Gráfico',title:'Do balão ao gráfico'"),
            ("ap:'Apêndice 5',title:'Revisão integradora',desc:'Quiz por grupos com","ap:'Quiz e autoavaliação',title:'Revisão integradora',desc:'Quiz com")]: p.rep(a,b)
# cabeçalhos sem apêndices
n0=p.t.count("head('Aula")
p.t,k=re.subn(r"head\('(Aula \d+) · Apêndice \d+ · ",r"head('\1 · ",p.t);p.n+=k;print('cabeçalhos',k)
# textos
p.rep("'Os mesmos cartões da atividade em grupo. Depois expliquem a relação entre os níveis.'","'Ordene os níveis do menor para o maior. Depois explique, na ficha, a relação entre eles.'")
p.rep("'Uma bactéria é uma célula mesmo sem núcleo? Investigue as estruturas de três células e monte o quadro do Apêndice 1.'","'Uma bactéria é uma célula mesmo sem núcleo? Investigue as estruturas de três células e monte o quadro comparativo.'")
p.rep("h('h3',{},'Quadro comparativo (Apêndice 1)')","h('h3',{},'Quadro comparativo')")
p.rep("'Para a célula vegetal, use como exemplo uma célula da folha que faz fotossíntese. Justifique cada marcação no caderno.'","'Para a célula vegetal, use como exemplo uma célula da folha que faz fotossíntese. Pense na justificativa de cada marcação: ela vai para a ficha.'")
p.rep("'Para cada estrutura, marque o que vale para a SUA observação. Depois confira com as orientações: “não ver” não prova que a estrutura não existe.'","'Para cada estrutura, marque o que vale para a SUA observação no microscópio virtual. Depois confira: “não ver” não prova que a estrutura não existe.'")
p.rep("'O sal altera a quantidade de água em um tecido vegetal? Monte os copos, pese as amostras, espere e pese de novo. Se a turma fez a prática de verdade, digite os dados reais.'","'O sal altera a quantidade de água em um tecido vegetal? Monte os copos virtuais, pese as amostras, espere e pese de novo.'")
p.rep("'Um cartaz modelo para treinar. Depois façam a mesma análise com os cartazes da abertura do Tema 3 do livro.'","'Um cartaz modelo para treinar a leitura crítica: quem fez, para quê, com que dados.'")
p.rep("'O que faz a massa do pão crescer? Monte as garrafas A a D, coloque os balões e meça a circunferência aos 0, 10 e 20 minutos. Nunca vede rigidamente as garrafas nem aqueça o recipiente fechado.'","'O que faz a massa do pão crescer? Monte as garrafas virtuais A a D, coloque os balões e meça a circunferência aos 0, 10 e 20 minutos.'")
p.rep("'Circunferência medida na parte mais larga do balão, sem apertar. Use o registro agregado da turma na próxima aula.'","'Circunferência medida na parte mais larga do balão. As medidas ficam guardadas para o gráfico da próxima aula.'")
# só experimento virtual (sem dados reais da turma)
p.rep("let mode=store.get('osm-mode','sim');","let mode='sim';")
p.rep("let mode=store.get('lev-mode','sim');","let mode='sim';")
p.rep("const modeSeg=seg([['sim','Experimento virtual'],['real','Dados reais da turma']],mode,v=>{mode=v;store.set('osm-mode',v);upd();},{label:'Modo'});","const modeSeg=h('span',{class:'pill ex'},'Experimento virtual');")
p.rep("const modeSeg=seg([['sim','Experimento virtual'],['real','Dados reais da turma']],mode,v=>{mode=v;store.set('lev-mode',v);drawBench();checkFair();drawTable();updCtrl();publish();},{label:'Modo'});","const modeSeg=h('span',{class:'pill ex'},'Experimento virtual');")
p.rep("'Ainda não há medidas da aula 14 neste aparelho. Faça a montagem virtual ou digite os dados reais lá na Aula 14 e volte aqui.'","'Ainda não há medidas da aula 14 neste aparelho. Faça o experimento virtual na Aula 14 e volte aqui.'")
# quiz individual
p.rep("'Como estrutura, divisão e metabolismo se relacionam? Perguntas com números diferentes dos da avaliação. Os grupos respondem, o professor revela e dá os pontos.'","'Como estrutura, divisão e metabolismo se relacionam? Responda o quiz, leia a explicação de cada resposta e faça a autoavaliação.'")
i=p.t.index("  let nT=store.get('qz-n',4),score=store.get('qz-score',[0,0,0,0,0,0]),i=0,revealed=false,picked=null,timer=null,left=40;\n  const top=h('div',{class:'row'});const board");
j=p.t.index("  sb();q();root.append(top,board,card);\n",i)+len("  sb();q();root.append(top,board,card);\n")
p.t=p.t[:i]+QUIZ_TMPL.replace('__IL__',"it[4]?ilu(it[4],'ilu'):null")+"  root.append(h('div',{class:'cols wide-left'},qcard,qside));q();\n"+p.t[j:];p.n+=1
# fichas
for a,b in [("desc:'Cada estudante envia com o quadro da dupla e o seu bilhete.'","desc:'Envie o seu quadro e o seu bilhete.'"),
            ("desc:'Roteiro de observação celular (Apêndice 1). O desenho fica no caderno.'","desc:'Roteiro de observação no microscópio virtual.'"),
            ("{k:'par',t:'Legenda do desenho: estruturas que você realmente distinguiu',man:2}","{k:'par',t:'Estruturas que você realmente distinguiu no microscópio virtual',man:2}"),
            ("desc:'Investigação da osmose (Apêndice 2). A: água; B: 5 g de sal em 100 mL.","desc:'Investigação da osmose no experimento virtual. A: água; B: 5 g de sal em 100 mL."),
            ("desc:'Núcleo, cromatina e cromossomos (Apêndice 3).'","desc:'Núcleo, cromatina e cromossomos.'"),
            ("desc:'Simulação da mitose com 2n = 4 (Apêndice 3).'","desc:'Simulação da mitose com 2n = 4.'"),
            ("desc:'Simulação da meiose com 2n = 4 (Apêndice 3).'","desc:'Simulação da meiose com 2n = 4.'"),
            ("desc:'Investigação do metabolismo das leveduras (Apêndice 4).","desc:'Investigação do metabolismo das leveduras no experimento virtual."),
            ("{k:'par',t:'Hipótese do grupo',man:1}","{k:'par',t:'Sua hipótese',man:1}"),
            ("desc:'Autoavaliação da unidade. A avaliação do Apêndice 5 é feita em papel.'","desc:'Autoavaliação da unidade.'")]: p.rep(a,b,count=None)
k=len(re.findall(r"tipo:'(Grupo|Dupla|Duplas)[^']*'",p.t));p.t=re.sub(r"tipo:'(Grupo|Dupla|Duplas)[^']*'","tipo:'Individual'",p.t);p.n+=k
p.save()
