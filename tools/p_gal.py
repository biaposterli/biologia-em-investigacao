p='src/sites/genetica.html';t=open(p).read()
def rep(o,n):
    global t
    assert t.count(o)==1,(t.count(o),o[:70]);t=t.replace(o,n)
rep("function alHTML(t){if(t==='IA')return 'I<sup>A</sup>';if(t==='IB')return 'I<sup>B</sup>';return t;}",
    "function alHTML(t){if(t==='IA')return 'I<sup>A</sup>';if(t==='IB')return 'I<sup>B</sup>';if(t==='CV')return 'C<sup>V</sup>';if(t==='CB')return 'C<sup>B</sup>';return t;}")
rep("function genoTxt(g){return g.map(l=>l.map(t=>t==='IA'?'Iᴬ':t==='IB'?'Iᴮ':t).join('')).join('');}",
    "function genoTxt(g){return g.map(l=>l.map(t=>t==='IA'?'Iᴬ':t==='IB'?'Iᴮ':t==='CV'?'Cⱽ':t==='CB'?'Cᴮ':t).join('')).join('');}")
rep("const ORD=t=>t==='IA'?0:","const ORD=t=>t==='CV'?0:t==='CB'?1:t==='IA'?0:")
# vaca + zoom dos pelos
rep("// ================= Aula 5: Galeria das dominâncias =================\n",
r"""// ================= Aula 5: Galeria das dominâncias =================
// Gado Shorthorn (modelo escolar de codominância): CᵛCᵛ vermelho, CᴮCᴮ branco, CᵛCᴮ ruão (pelos vermelhos e brancos misturados)
const COW={red:'#9c3b22',white:'#f5f0e6'};
function cowSv(f){const base=f==='vermelho'?COW.red:COW.white,ol='#4a3a30';let hairs='';
  if(f==='ruão'){const r=seeded(7);for(let i=0;i<70;i++){const x=8+r()*21,y=9.6+r()*9.6;hairs+=`<path d="M${x.toFixed(1)},${y.toFixed(1)} l${(r()*.6-.3).toFixed(2)},1.3" stroke="${COW.red}" stroke-width=".75" stroke-linecap="round"/>`;}}
  const leg=x=>`<rect x="${x}" y="18" width="2.6" height="7.5" rx="1" fill="${f==='vermelho'?COW.red:COW.white}" stroke="${ol}" stroke-width=".5"/><rect x="${x}" y="24.4" width="2.6" height="1.6" fill="#3b2c22"/>`;
  return `<ellipse cx="19" cy="27" rx="13" ry="1.4" fill="rgba(0,0,0,.12)"/>`+leg(9)+leg(13)+leg(23)+leg(27)+
   `<path d="M29.5,11 q3,3 1.6,9" stroke="${ol}" stroke-width=".7" fill="none"/><path d="M30.6,19.4 l.9,1.8 l-1.7,-.4z" fill="${ol}"/>`+
   `<rect x="7.5" y="9" width="23" height="11" rx="5" fill="${base}" stroke="${ol}" stroke-width=".7"/>`+hairs+
   `<path d="M3,7.4 l-1.6,-1.6 M8,7.4 l1.6,-1.6" stroke="#d9cdb5" stroke-width="1.1" stroke-linecap="round"/>`+
   `<ellipse cx="2.3" cy="9" rx="1.6" ry=".9" fill="${base}" stroke="${ol}" stroke-width=".5"/><ellipse cx="8.7" cy="9" rx="1.6" ry=".9" fill="${base}" stroke="${ol}" stroke-width=".5"/>`+
   `<path d="M2.6,8.2 h5.8 l.4,5.6 q-3.3,2.4 -6.6,0z" fill="${base}" stroke="${ol}" stroke-width=".7"/>`+
   (f==='ruão'?`<path d="M3.6,10 l.2,1.2 M5.4,9.4 l.1,1.3 M7,10.4 l.2,1.2 M4.4,12 l.1,1" stroke="${COW.red}" stroke-width=".7" stroke-linecap="round"/>`:'')+
   `<ellipse cx="5.5" cy="13.8" rx="2.7" ry="1.6" fill="#e3a993" stroke="${ol}" stroke-width=".5"/><circle cx="4.4" cy="10.4" r=".55" fill="#1e1612"/><circle cx="6.8" cy="10.4" r=".55" fill="#1e1612"/>`;}
function pelosSv(f,id){const r=seeded(f==='vermelho'?3:f==='branco'?5:9);let s='';
  for(let i=0;i<46;i++){const x=6+(i%23)*3+r()*1.4,y0=i<23?4:40;const red=f==='vermelho'?true:f==='branco'?false:r()<.5;
    s+=`<path d="M${x.toFixed(1)},${y0} q${(r()*4-2).toFixed(1)},18 ${(r()*3-1.5).toFixed(1)},38" stroke="${red?COW.red:'#fbf8f1'}" stroke-width="2.4" stroke-linecap="round" fill="none"/>`+(red?'':`<path d="M${x.toFixed(1)},${y0} q${0},18 0,38" stroke="#cdbfa6" stroke-width=".4" fill="none" opacity=".0"/>`);}
  return `<defs><clipPath id="${id}"><circle cx="40" cy="40" r="36"/></clipPath></defs><circle cx="40" cy="40" r="37" fill="#e9e2d4"/><g clip-path="url(#${id})">${s}</g><circle cx="40" cy="40" r="37" fill="none" stroke="#566074" stroke-width="2.5"/>`;}
""")
# modelo 3
o=t[t.index("  {k:3,nome:'Modelo 3',a:['R','S'],tipo:'Codominância'"):]
o=o[:o.index("}];\n")+4]
rep(o,"""  {k:3,nome:'Modelo 3',a:['CV','CB'],tipo:'Codominância',fen:g=>{const z=g[0].join('');return z==='CVCV'?'vermelho':z==='CBCB'?'branco':'ruão';},draw:cowSv,leg:'Gado Shorthorn: CᵛCᵛ tem pelagem vermelha; CᴮCᴮ, branca; CᵛCᴮ é ruão: tem pelos vermelhos E pelos brancos misturados, lado a lado.',gr:'1 CᵛCᵛ : 2 CᵛCᴮ : 1 CᴮCᴮ',fr:'1 vermelho : 2 ruão : 1 branco'}];
""")
# painel "De perto" para o modelo 3
rep("""        h('p',{class:'callout'},m===1?'O alelo a não sumiu na F1: ele segrega e reaparece em aa na F2.':m===2?'O rosa não é “mistura irreversível”: na F2 o vermelho e o branco voltam puros.':'No heterozigoto, os dois marcadores aparecem ao mesmo tempo, sem intermediário.')));""",
"""        h('p',{class:'callout'},m===1?'O alelo a não sumiu na F1: ele segrega e reaparece em aa na F2.':m===2?'O rosa não é “mistura irreversível”: na F2 o vermelho e o branco voltam puros.':'No ruão, os dois alelos se expressam ao mesmo tempo: aparecem pelos vermelhos e pelos brancos. Não surge uma cor intermediária.')));
    if(m===3){const zc=(f,g)=>{const z=svgOf(pelosSv(f,'zp-'+f.replace('ã','a')),'0 0 80 80');z.setAttribute('class','gal-zoom');return h('div',{class:'stack',style:'gap:6px;align-items:center;text-align:center'},svgOf(cowSv(f),'0 0 38 30','ilu ilu-sm'),z,h('span',{class:'al',html:g}),h('strong',{},f),h('span',{class:'note'},f==='vermelho'?'só pelos vermelhos':f==='branco'?'só pelos brancos':'pelos vermelhos e brancos, cada um de uma cor'));};
      const pinkZ=svgOf(`<circle cx="40" cy="40" r="37" fill="#ee9ab4"/><circle cx="40" cy="40" r="37" fill="none" stroke="#566074" stroke-width="2.5"/>`,'0 0 80 80');pinkZ.setAttribute('class','gal-zoom');
      body.append(h('div',{class:'panel stack',style:'grid-column:1/-1'},h('h3',{},'De perto: a lupa nos pelos'),
        h('p',{},'Olhando de longe, o gado ruão parece ter uma cor “acinzentada” ou avermelhada clara. Com a lupa, dá para ver o que acontece de verdade: cada pelo é vermelho ',h('b',{},'ou'),' branco. Os dois alelos se expressam juntos, lado a lado.'),
        h('div',{class:'gal-zrow'},zc('vermelho',genoHTML([['CV','CV']])),zc('ruão',genoHTML([['CV','CB']])),zc('branco',genoHTML([['CB','CB']]))),
        h('div',{class:'row',style:'gap:14px;align-items:center;background:var(--surface-2);border-radius:12px;padding:10px 14px'},pinkZ,h('p',{style:'margin:0;flex:1;min-width:200px'},h('b',{},'Compare com o Modelo 2 (dominância incompleta): '),'na flor rosa, o heterozigoto tem um fenótipo intermediário, uma terceira cor. No ruão não há pelo “rosa”: há os dois fenótipos dos pais ao mesmo tempo. Essa é a diferença entre dominância incompleta e codominância.'))));}""")
rep("function fenCard(G,g,lab){","if(!document.getElementById('gal-css')){const st=document.createElement('style');st.id='gal-css';st.textContent='.gal-zoom{width:110px;height:110px}.gal-zrow{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px}@media (max-width:560px){.gal-zrow{grid-template-columns:1fr}}';document.head.append(st);}\n  function fenCard(G,g,lab){")
rep("'Três modelos didáticos de um locus. As letras representam alelos de um gene, não substâncias que se diluem. Os modelos 2 e 3 usam símbolos próprios; não são três genes.'",
    "'Três modelos didáticos de um locus. As letras representam alelos de um gene, não substâncias que se diluem. Os modelos 2 e 3 usam símbolos próprios; não são três genes. O Modelo 3 usa a pelagem do gado Shorthorn, exemplo clássico de codominância.'")
# canteiro F2
rep("const b=h('button',{class:'btn primary'},'Plantar 64 sementes da F2');","const b=h('button',{class:'btn primary'},'Gerar 64 descendentes da F2');")
rep("root.append(sim('Canteiro da F2','Usa o modelo escolhido acima. Cada semente sorteia um alelo de cada genitor heterozigoto.',b,box,out));","root.append(sim('Descendentes da F2','Usa o modelo escolhido acima: flores nos modelos 1 e 2, bezerros no modelo 3. Cada descendente sorteia um alelo de cada genitor heterozigoto.',b,box,out));")
rep("`. Esperado: ${G.fr} (em 64: ${G.k===1?'48 : 16':'16 : 32 : 16'}). Plante de novo e compare.`","`. Esperado: ${G.fr} (em 64: ${G.k===1?'48 : 16':'16 : 32 : 16'}). Gere de novo e compare.`")
open(p,'w').write(t)
