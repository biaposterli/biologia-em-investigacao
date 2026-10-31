"""Substitui os esquemas do módulo Corpo (src/sites/corpo.html) pelas ilustrações de tools/corpo_ilustracoes.js.
Não altera fichas (SPEC) nem textos das aulas, exceto legendas das figuras."""
import pathlib,re
R=pathlib.Path(__file__).resolve().parent.parent
F=R/'src/sites/corpo.html'
s=F.read_text(encoding='utf-8')
lib=(R/'tools/corpo_ilustracoes.js').read_text(encoding='utf-8')
assert '</script' not in lib

def fn_span(t,name):
    """início e fim (exclusivo) de 'function name(...){...}' com chaves balanceadas, ciente de strings e templates"""
    i=t.index('\nfunction '+name+'(')+1
    j=t.index('{',t.index(')',i));depth=0;k=j;stack=[]
    while True:
        c=t[k]
        if stack and stack[-1] in "'\"":
            if c=='\\':k+=2;continue
            if c==stack[-1]:stack.pop()
        elif stack and stack[-1]=='`':
            if c=='\\':k+=2;continue
            if c=='`':stack.pop()
            elif c=='$' and t[k+1]=='{':stack.append('${');k+=2;continue
        else:
            if c in "'\"`":stack.append(c)
            elif c=='{':
                if stack and stack[-1]=='${':stack.append('{')
                else:depth+=1
            elif c=='}':
                if stack and stack[-1]=='{':stack.pop()
                elif stack and stack[-1]=='${':stack.pop()
                else:
                    depth-=1
                    if depth==0:
                        k+=1
                        if t[k]=='\n':k+=1
                        return i,k
        k+=1
def drop(name):
    global s
    a,b=fn_span(s,name);s=s[:a]+s[b:]
def put(name,code):
    global s
    a,b=fn_span(s,name);s=s[:a]+code.strip()+'\n'+s[b:]
def rep(a,b):
    global s
    assert s.count(a)==1,(a[:80],s.count(a));s=s.replace(a,b)

for n in ['uKidney','uHeart','uBreastUnits','uFemale','uMale','uPancreas','uOvary','uGestationOrgans','pTravelMap','hThyroid','uAgentBody']:drop(n)
put('hInset','''
function hInset(i){const L2=['Traqueia: referência da posição no pescoço','Tireoide: dois lobos unidos pelo istmo','Laringe (cartilagem tireóidea), acima da glândula'],L3=['Esôfago: nesta vista posterior, fica à frente da traqueia','Tireoide vista por trás','Paratireoides: geralmente quatro, na face posterior da tireoide'],L4=['Rim: a suprarrenal fica sobre o polo superior','Córtex da suprarrenal (região externa): cortisol, entre outros hormônios','Medula da suprarrenal (região interna): adrenalina e noradrenalina'];
 if(i<2)return {b:iHypo(i),labels:HYPO_LABELS};if(i===2)return {b:iThyroid(false),labels:L2};if(i===3)return {b:iThyroid(true),labels:L3};if(i===4)return {b:iAdrenal(),labels:L4};if(i===5)return {b:iPancreas(),labels:PANC_LABELS};if(i===6)return {b:iOvaryInset(),labels:OVARY_LABELS};return {b:iTestis(),labels:TESTIS_LABELS};}''')
a,b=fn_span(s,'hAtlas');old=s[a:b]
new=old[:old.index('function draw(i){')]+'''function draw(i){const q=H_GLANDS[i],inset=hInset(i),hl=[[180,64,16,16],[183,75,13,13],[180,118,24,16],[180,118,24,16],[180,238,46,16],[196,252,40,16],[180,317,40,15],[180,364,20,22]][i];let body=iBody(i,i===7)+`<ellipse cx="${hl[0]}" cy="${hl[1]}" rx="${hl[2]}" ry="${hl[3]}" fill="none" stroke="var(--tema)" stroke-width="3" stroke-dasharray="4 3"/><rect x="309" y="38" width="298" height="340" rx="20" fill="var(--surface-2)" stroke="var(--line)"/>`+uText(458,24,i===3?'Ampliação · face posterior':i<2?'Ampliação · corte mediano':'Ampliação anatômica',17)+inset.b;'''+old[old.index('\nimage.replaceChildren('):] if '\nimage.replaceChildren(' in old else None
assert new, 'hAtlas layout mudou'
s=s[:a]+new+s[b:]
put('hTarget','''
function hTarget(type){if(type==='thyroid')return iThyroid(false);if(type==='pituitary')return iHypo(1);if(type==='adrenal')return iAdrenal();if(type==='uterus'||type==='gonads')return iOvaryInset();if(type==='bone')return iBone();if(type==='kidney')return iKidneyCut();if(type==='liver')return iLiver();if(type==='heart')return iHeart();if(type==='breast')return iBreast();return iCells();}''')
rep("'Ilustração de um dos alvos de '+q[1]+'; consulte todos os alvos no quadro','300 30 300 330'","'Ilustração de um dos alvos de '+q[1]+'; consulte todos os alvos no quadro','300 20 330 360'")
rep("uLegend(({pituitary:hInset(1).labels,adrenal:hInset(4).labels,uterus:hInset(6).labels,gonads:hInset(6).labels})[q[7]]||[])","uLegend(({pituitary:hInset(1).labels,adrenal:hInset(4).labels,uterus:hInset(6).labels,gonads:hInset(6).labels,thyroid:hInset(2).labels})[q[7]]||[])")
# A1 · sinalização
i0=s.index("(i,t)=>({body:`<rect x=\"35\" y=\"110\"");i1=s.index("labels:['Célula produtora','Circulação sanguínea','Célula-alvo com receptor compatível']}))",i0)+len("labels:['Célula produtora','Circulação sanguínea','Célula-alvo com receptor compatível']}))")
s=s[:i0]+"(i,t)=>({body:iSignal(i,t),labels:SIGNAL_LABELS}))"+s[i1:]
# A3 · glicose
i0=s.index("(i,t)=>{const count=high?");i1=s.index("labels:['Sangue: pontos representam glicose','Pâncreas: secreção do sinal','Fígado: participa do armazenamento ou da liberação de glicose']};}",i0)
i1+=len("labels:['Sangue: pontos representam glicose','Pâncreas: secreção do sinal','Fígado: participa do armazenamento ou da liberação de glicose']};}")
s=s[:i0]+"(i,t)=>({body:iGlucose(high,i,t),labels:GLU_LABELS})"+s[i1:]
# A6 · ciclo
put('uCycleOrgans','function uCycleOrgans(i,t){return iCycle(i,t);}')
rep("labels:['Ovário: folículo, ovulação ou corpo lúteo conforme a etapa','Corte esquemático do útero: espessura e estado do endométrio']","labels:['Ovário em corte: folículos, ovulação ou corpo lúteo conforme a etapa','Parede do útero em corte: camada funcional do endométrio (glândulas e artérias espiraladas), camada basal e miométrio']")
# A7 · encontro
i0=s.index("(i,t)=>{let detail='';if(i===0)detail=");i1=s.index("...(i>=3?['Cavidade do blastocisto','Massa celular interna']:[])]};}",i0)+len("...(i>=3?['Cavidade do blastocisto','Massa celular interna']:[])]};}")
s=s[:i0]+"(i,t)=>{const r=iEncounter(i,t);return {body:r.b,labels:r.labels};}"+s[i1:]
rep("O pequeno mapa indica o percurso geral, e o detalhe mostra mudanças celulares.","O pequeno mapa indica o percurso geral (a tuba e o ovário de um lado), e o detalhe mostra mudanças celulares em outra ampliação.")
# A8 · placenta
put('pPlacentaDraw','function pPlacentaDraw(i,t){return iPlacenta(i,t);}')
# A9 · lactação
put('uLactationOrgans','function uLactationOrgans(i,t){return iLactation(i,t);}')
rep("labels:['Alvéolos mamários: produção de leite','Ductos: caminho de saída']}","labels:LACT_LABELS}")
# A10 · métodos
put('mDraw','function mDraw(i){return iMethod(i);}')
# A11 · agentes
i0=s.index("(i,t)=>({body:uAgentBody(i)");i1=s.index("alt:'Representação simbólica do tipo de agente; não é uma imagem diagnóstica'})",i0)+len("alt:'Representação simbólica do tipo de agente; não é uma imagem diagnóstica'})")
s=s[:i0]+"(i,t)=>iAgent(i)"+s[i1:]
rep("limit:'Ícones simbólicos sem escala. Não representam lesões","limit:'Esquemas da estrutura dos agentes, sem escala entre os painéis. Não representam lesões")
# A12 · cena
put('uPeopleScene','function uPeopleScene(i,t){return iPeople(i,t);}')
# biblioteca antes do atlas
rep("// Atlas anatômico e rotas hormonais: revisão das aulas iniciais.\n",lib.strip()+"\n// Atlas anatômico e rotas hormonais: revisão das aulas iniciais.\n")
# figuras do livro: apagar sobras de recorte da página (selo "B" do espermatozoide e triângulo verde da figura do feto)
import base64,io
from PIL import Image,ImageDraw
def clean(key,boxes):
    global s
    i=s.index('"'+key+'": "data:image/png;base64,')+len(key)+5;j=s.index('"',i)
    head,data=s[i:j].split(',',1);im=Image.open(io.BytesIO(base64.b64decode(data))).convert('RGB');d=ImageDraw.Draw(im)
    for box,col in boxes:
        d.rectangle(box,fill=col if col else im.getpixel((box[2]+12,box[1]+10)))
    buf=io.BytesIO();im.save(buf,'PNG',optimize=True);s=s[:i]+head+','+base64.b64encode(buf.getvalue()).decode()+s[j:]
clean('espermatozoide',[((3,3,52,54),(255,255,255))])
clean('feto',[((0,50,42,114),None)])
F.write_text(s,encoding='utf-8');print('ok',len(s))
