// ===================== Ilustrações científicas da Unidade 2 (esquemas originais) =====================
// Convenções: vista anterior = lado direito do corpo à esquerda de quem olha. Sem id, gradiente ou <marker>.
const IC={skin:'#ecd6c3',skinS:'#b89a83',brain:'#e3c9d3',brainS:'#9c7488',bone:'#e9dfc8',boneS:'#a8977a',gland:'#c96f86',glandS:'#8e4459',
 gold:'#d8b25e',goldS:'#9c7a32',kid:'#b9706f',kidS:'#874c51',blood:'#c0475a',bloodL:'#f3d5da',vein:'#5d7fae',fat:'#f4e6c4',fatS:'#c9b07a',
 mus:'#c7837a',musS:'#91524c',muc:'#e8b4bd',mucS:'#a3606f',cyto:'#f4f1ea',nuc:'#9aa8c4',nucS:'#5f6f93',hormone:'#d39b2a',ins:'#3f7fae',glu:'#c4622d'};
const r1=n=>Math.round(n*10)/10;
// marcador numerado ligado a um ponto da estrutura por uma linha-guia
function lk(x,y,mx,my,n){const a=Math.atan2(y-my,x-mx),sx=mx+15*Math.cos(a),sy=my+15*Math.sin(a);return `<path d="M${r1(sx)} ${r1(sy)}L${x} ${y}" stroke="#6b7680" stroke-width="1.3" fill="none"/><circle cx="${x}" cy="${y}" r="2.6" fill="#6b7680"/>`+uMark(mx,my,n);}
function iHd(x,y,a,c,s=10){return `<path d="M${r1(x)} ${r1(y)}L${r1(x-s*Math.cos(a-.45))} ${r1(y-s*Math.sin(a-.45))}L${r1(x-s*Math.cos(a+.45))} ${r1(y-s*Math.sin(a+.45))}Z" fill="${c}"/>`;}
// seta com ponta preenchida; pts: [[x,y],...]; curva quadrática se 3 pontos e q=true
function ar(pts,c='#5b6b73',w=2.4,q=false,dash=false){const n=pts.length,a=pts[n-2],b=pts[n-1],ang=Math.atan2(b[1]-a[1],b[0]-a[0]),e=[b[0]-7*Math.cos(ang),b[1]-7*Math.sin(ang)];const P=pts.slice(0,-1).concat([e]);const d=q&&n===3?`M${P[0]}Q${P[1]} ${P[2]}`:'M'+P.map(p=>p.map(r1).join(' ')).join('L');return `<path d="${d}" fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round"${dash?' stroke-dasharray="6 5"':''}/>`+iHd(b[0],b[1],ang,c,10);}
const T=(x,y,s,size=12,o={})=>`<text x="${x}" y="${y}" font-size="${size}" text-anchor="${o.a||'middle'}"${o.w?` font-weight="${o.w}"`:''}${o.c?` style="fill:${o.c}"`:''}${o.i?' font-style="italic"':''}${o.h?' paint-order="stroke" stroke="#fbf8f3" stroke-width="3.5" stroke-linejoin="round"':''}>${s}</text>`;
function cellE(x,y,rx,ry,f=IC.cyto,s='#9a8f7d',nr=0.34,rot=0){return `<g transform="rotate(${rot} ${x} ${y})"><ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="${f}" stroke="${s}" stroke-width="2"/>${nr?`<ellipse cx="${x}" cy="${y}" rx="${r1(rx*nr)}" ry="${r1(ry*nr*1.05)}" fill="${IC.nuc}" stroke="${IC.nucS}" stroke-width="1.2"/>`:''}</g>`;}
function rbc(x,y,s=1,rot=0){return `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${s})"><ellipse rx="11" ry="6" fill="#c24b5a" stroke="#97323f" stroke-width="1"/><ellipse rx="5" ry="2.2" fill="#de8790"/></g>`;}
function hormone(x,y,c=IC.hormone,r=5){return `<circle cx="${r1(x)}" cy="${r1(y)}" r="${r}" fill="${c}" stroke="#8a5d10" stroke-width="1.1"/>`;}
function hatchBone(x,y,w,h){let d='';for(let i=0;i<6;i++)d+=`<circle cx="${r1(x+((i*37)%w))}" cy="${r1(y+((i*23)%h))}" r="2" fill="${IC.boneS}" opacity=".45"/>`;return d;}

// ---------- A1 · Silhueta em vista anterior com as glândulas ----------
function iBody(sel,male){
 const S=IC.skinS;let b=`<g>`;
 // contorno do corpo
 b+=`<path d="M180 22C158 22 146 40 146 60C146 80 157 96 168 101L167 113C150 117 128 121 116 131C104 141 101 160 99 184L91 262C89 280 88 300 92 306C97 310 103 305 104 296L113 216L118 196L121 250C121 270 118 288 120 312L122 342C125 372 128 392 131 420H170L176 352H184L190 420H229C232 392 235 372 238 342L240 312C242 288 239 270 239 250L242 196L247 216L256 296C257 305 263 310 268 306C272 300 271 280 269 262L261 184C259 160 256 141 244 131C232 121 210 117 193 113L192 101C203 96 214 80 214 60C214 40 202 22 180 22Z" fill="${IC.skin}" stroke="${S}" stroke-width="2.2" stroke-linejoin="round"/>`;
 // referências internas apagadas: encéfalo, traqueia, pulmões, diafragma, rins
 b+=`<path d="M156 52C156 36 168 28 180 28C192 28 204 36 204 52C204 62 199 68 192 70H168C161 68 156 62 156 52Z" fill="${IC.brain}" opacity=".75"/>`;
 b+=`<path d="M180 104V150" stroke="#cfd6d6" stroke-width="7" stroke-linecap="round"/>`;
 b+=`<path d="M174 150C150 150 136 164 134 196C133 210 140 214 160 210C170 208 175 200 176 186ZM186 150C210 150 224 164 226 196C227 210 220 214 200 210C190 208 185 200 184 186Z" fill="#efdfe0" stroke="#d5bcbe" stroke-width="1.2"/>`;
 b+=`<path d="M131 214Q180 196 229 214" fill="none" stroke="#d7b9a4" stroke-width="2" stroke-dasharray="4 3"/>`;
 b+=`<path d="M152 242C140 242 136 256 137 268C138 282 146 290 156 287C163 285 163 278 158 272C154 267 154 261 159 256C163 251 161 242 152 242ZM208 236C220 236 224 250 223 262C222 276 214 284 204 281C197 279 197 272 202 266C206 261 206 255 201 250C197 245 199 236 208 236Z" fill="${IC.kid}" opacity=".55"/>`;
 // pelve (referência)
 b+=`<path d="M138 302Q180 288 222 302Q218 330 180 334Q142 330 138 302Z" fill="none" stroke="#d9c3ae" stroke-width="2"/>`;
 const on=k=>sel===k;const op=k=>on(k)?1:.62;
 // hipotálamo e hipófise
 b+=`<g opacity="${on(0)||on(1)?1:.7}"><ellipse cx="180" cy="62" rx="7" ry="4.5" fill="${IC.gland}" stroke="${IC.glandS}" stroke-width="1"/><path d="M182 66L183 72" stroke="${IC.glandS}" stroke-width="1.6"/><ellipse cx="183" cy="75" rx="4.6" ry="3.6" fill="#a8507a" stroke="${IC.glandS}" stroke-width="1"/></g>`;
 // tireoide (lobos + istmo) e paratireoides (posteriores, tracejadas)
 b+=`<path d="M176 114C170 106 163 108 163 116C163 124 168 128 175 124H185C192 128 197 124 197 116C197 108 190 106 184 114Z" fill="${IC.gland}" stroke="${IC.glandS}" stroke-width="1.2" opacity="${op(2)}"/>`;
 if(on(3))b+=[[167,112],[193,112],[168,122],[192,122]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="2.6" fill="${IC.gold}" stroke="${IC.goldS}" stroke-width="1" stroke-dasharray="1.5 1"/>`).join('');
 // suprarrenais: direita piramidal, esquerda semilunar
 b+=`<g opacity="${op(4)}"><path d="M144 244L152 230L161 242Q153 246 144 244Z" fill="${IC.gold}" stroke="${IC.goldS}" stroke-width="1.2"/><path d="M199 238Q201 226 211 224Q219 230 215 242Q207 236 199 238Z" fill="${IC.gold}" stroke="${IC.goldS}" stroke-width="1.2"/></g>`;
 // pâncreas: cabeça na alça do duodeno (lado direito do corpo), cauda em direção ao baço
 b+=`<path d="M163 244Q154 250 157 262Q162 270 172 266" fill="none" stroke="#d8b3a0" stroke-width="5" opacity=".8"/>`;
 b+=`<path d="M166 252C162 260 166 266 173 264C182 262 192 258 203 254C213 250 222 245 228 240C230 236 226 234 221 236C210 241 198 245 186 248C179 249 172 249 166 252Z" fill="#dcb46a" stroke="#a27d3c" stroke-width="1.2" opacity="${op(5)}"/>`;
 if(male){b+=`<path d="M168 352Q166 378 180 382Q194 378 192 352Z" fill="#e3c0a9" stroke="${S}" stroke-width="1.6"/><ellipse cx="174" cy="364" rx="5" ry="7" fill="${IC.gold}" stroke="${IC.goldS}" opacity="${op(7)}"/><ellipse cx="186" cy="364" rx="5" ry="7" fill="${IC.gold}" stroke="${IC.goldS}" opacity="${op(7)}"/>`;}
 else{b+=`<path d="M172 312Q180 304 188 312L186 326H174Z" fill="#d79aa8" stroke="#a5687a" stroke-width="1.2" opacity=".85"/><path d="M174 312Q164 306 156 312M186 312Q196 306 204 312" fill="none" stroke="#c48b98" stroke-width="2"/><ellipse cx="154" cy="317" rx="5" ry="3.6" fill="${IC.gold}" stroke="${IC.goldS}" opacity="${op(6)}"/><ellipse cx="206" cy="317" rx="5" ry="3.6" fill="${IC.gold}" stroke="${IC.goldS}" opacity="${op(6)}"/>`;}
 b+=T(116,415,'D',11,{c:'#7d8a90'})+T(244,415,'E',11,{c:'#7d8a90'});
 return b+'</g>';}

// Ampliações (painel x 309–607, y 38–378)
function iHypo(i){
 let b='';
 // corte mediano da base do encéfalo, face voltada para a esquerda
 b+=`<path d="M540 222C566 210 592 226 590 252C588 274 566 284 544 274Z" fill="#dcc0cb" stroke="${IC.brainS}" stroke-width="2"/>`+[0,1,2].map(k=>`<path d="M${552+k*9} 228q8 22 0 40" fill="none" stroke="#b998a6" stroke-width="1.4"/>`).join('');
 b+=`<path d="M508 206C530 210 546 220 548 246C550 270 540 290 536 330H510C512 300 508 280 498 262C490 246 492 222 508 206Z" fill="#d9bcc8" stroke="${IC.brainS}" stroke-width="2"/>`;
 b+=`<path d="M330 186C328 120 372 74 444 70C512 66 566 96 584 150C592 176 586 196 570 206C552 214 530 210 512 210L486 214C478 226 468 232 456 232L442 232C432 226 418 214 400 210C370 206 346 204 330 186Z" fill="${IC.brain}" stroke="${IC.brainS}" stroke-width="2.2"/>`;
 // corpo caloso, tálamo, terceiro ventrículo
 b+=`<path d="M392 132Q452 104 520 132Q530 144 516 146Q452 124 398 146Q384 144 392 132Z" fill="#f2e6eb" stroke="#b5949f" stroke-width="1.4"/>`;
 b+=`<ellipse cx="470" cy="170" rx="34" ry="20" fill="#d8b7c4" stroke="#a7808f" stroke-width="1.4"/>`;
 // hipotálamo (núcleos neurossecretores) logo abaixo do tálamo, anterior
 b+=`<path d="M420 186Q446 176 474 192Q478 208 462 220Q446 228 430 218Q414 204 420 186Z" fill="${i===0?'#c25b80':'#cf8aa4'}" stroke="#8e4459" stroke-width="1.6"/>`;
 b+=uCircle(436,196,3.4,'#7d2f4b')+uCircle(452,200,3.4,'#7d2f4b')+uCircle(444,210,3,'#7d2f4b');
 // quiasma óptico (referência anterior)
 b+=`<ellipse cx="408" cy="220" rx="12" ry="6" fill="#efe7cf" stroke="#a89a6c" stroke-width="1.4"/>`;
 // haste (infundíbulo) e hipófise na sela turca
 b+=`<path d="M448 222C452 240 458 252 470 262L484 262C474 248 466 236 462 220Z" fill="#cf9ab0" stroke="#8e4459" stroke-width="1.4"/>`;
 b+=`<path d="M396 292Q400 334 454 336Q508 334 514 292L520 292Q518 348 454 350Q392 348 388 292Z" fill="${IC.bone}" stroke="${IC.boneS}" stroke-width="1.6"/>`;
 b+=`<path d="M410 286C404 260 428 254 452 260C466 264 470 276 470 290C470 312 452 324 430 320C416 316 412 302 410 286Z" fill="${i===1?'#b0466e':'#c76f8e'}" stroke="#7d2f4b" stroke-width="1.6"/>`;
 b+=`<path d="M472 266C490 264 504 276 504 294C504 312 490 322 476 318C468 314 466 300 470 288Z" fill="#9db0d6" stroke="#5a6f9e" stroke-width="1.6"/>`;
 // axônios neurossecretores: hipotálamo → neuroipófise
 b+=`<path d="M440 200Q458 232 482 290M452 204Q466 236 488 296" fill="none" stroke="#5a6f9e" stroke-width="1.6" stroke-dasharray="4 3"/>`;
 // sistema porta: capilares na eminência mediana → adenoipófise
 b+=`<path d="M452 236Q440 252 432 276M458 240Q450 260 444 286" fill="none" stroke="#c0475a" stroke-width="2"/>`+uCircle(452,236,3,'#c0475a')+uCircle(458,240,3,'#c0475a');
 b+=T(374,368,'anterior ←',11,{c:'#7f8a94'})+T(552,368,'→ posterior',11,{c:'#7f8a94'});
 b+=lk(446,206,348,248,1)+lk(426,300,350,312,2)+lk(492,300,580,318,3)+lk(458,248,600,190,4);
 return b;}
const HYPO_LABELS=['Hipotálamo: núcleos de neurônios neurossecretores na base do encéfalo','Adenoipófise (porção anterior): produz e libera seus hormônios','Neuroipófise (porção posterior): libera ADH e ocitocina trazidos por axônios (tracejado)','Haste e vasos porta (vermelho): levam sinais do hipotálamo à adenoipófise'];

function iThyroid(back){
 let b='';
 if(!back){b+=`<path d="M428 62L488 62L482 104Q458 118 434 104Z" fill="#e5e7e2" stroke="#9aa39b" stroke-width="2"/><path d="M458 68V108" stroke="#b8c0b8" stroke-width="2"/><path d="M436 112H480L478 128H438Z" fill="#e5e7e2" stroke="#9aa39b" stroke-width="2"/>`+T(458,84,'laringe',10,{c:'#7f8a94'});}
 else b+=`<path d="M424 70Q458 58 492 70L486 126H430Z" fill="#e2d8d0" stroke="#a7988b" stroke-width="2"/>`+T(458,96,'faringe',11,{c:'#7f8a94'});
 b+=`<rect x="438" y="130" width="40" height="214" rx="10" fill="#dfe3df" stroke="#9aa39b" stroke-width="2"/>`+Array.from({length:10},(_,k)=>`<path d="M440 ${142+k*20}H476" stroke="#b8c0b8" stroke-width="5" stroke-linecap="round"/>`).join('');
 // lobos (direito e esquerdo) e istmo à frente do 2º–4º anéis traqueais
 const lobe=(x,m)=>`<path d="M${x} 146C${x-m*26} 146 ${x-m*34} 178 ${x-m*32} 214C${x-m*30} 250 ${x-m*16} 270 ${x} 268C${x+m*14} 266 ${x+m*18} 246 ${x+m*16} 222L${x+m*14} 176C${x+m*12} 156 ${x+m*8} 146 ${x} 146Z" fill="${IC.gland}" stroke="${IC.glandS}" stroke-width="2"/>`;
 const lobes=lobe(420,1)+lobe(496,-1)+(back?'':`<path d="M430 198Q458 190 486 198L486 226Q458 234 430 226Z" fill="${IC.gland}" stroke="${IC.glandS}" stroke-width="2"/>`);
 const folls=Array.from({length:10},(_,k)=>uCircle((k<5?408:508)+(k%2)*8,170+(k%5)*20,3,'#e8b3c2')).join('');
 if(back){b+=lobes+folls+`<rect x="442" y="122" width="32" height="232" rx="12" fill="#d9b9a7" stroke="#a7826e" stroke-width="2"/>`+T(458,330,'esôfago',10,{c:'#6b4f40'});
  b+=[[404,176],[512,176],[402,240],[514,240]].map(([x,y])=>`<ellipse cx="${x}" cy="${y}" rx="9" ry="7" fill="${IC.gold}" stroke="${IC.goldS}" stroke-width="1.6"/>`).join('');
  b+=lk(458,290,560,318,1)+lk(500,206,572,150,2)+lk(402,240,350,282,3);}
 else b+=lobes+folls+lk(458,300,560,318,1)+lk(500,206,572,150,2)+lk(470,96,568,84,3)+T(458,214,'istmo',10,{c:'#5b2a38'});
 return b;}
function iAdrenal(){
 let b='';
 // rim (corte) com cápsula, córtex e medula renais
 b+=`<path d="M388 190C352 190 336 232 340 282C344 330 372 356 404 350C428 346 432 326 418 310C406 298 404 280 418 266C432 252 430 232 418 214C410 200 400 190 388 190Z" fill="${IC.kid}" stroke="${IC.kidS}" stroke-width="2.2"/>`;
 b+=`<path d="M392 206C364 210 354 240 356 280C358 314 376 334 398 334" fill="none" stroke="#d6a09b" stroke-width="2"/>`;
 // suprarrenal sobre o polo superior
 b+=`<path d="M352 196C356 158 384 126 412 128C430 130 432 152 424 176C418 194 404 204 386 206C370 206 358 204 352 196Z" fill="${IC.gold}" stroke="${IC.goldS}" stroke-width="2"/>`;
 // ampliação do corte da suprarrenal
 b+=`<path d="M424 152L470 108M424 182L470 240" stroke="#9aa3a8" stroke-width="1.2" stroke-dasharray="4 3"/>`;
 b+=`<path d="M470 96C520 70 586 96 590 160C594 226 548 262 498 252C470 246 456 220 458 176C460 138 462 104 470 96Z" fill="#e3c26f" stroke="${IC.goldS}" stroke-width="2.4"/>`;
 b+=`<path d="M476 106C520 86 576 108 578 160C580 214 544 244 502 238C478 234 468 212 470 178C471 144 470 114 476 106Z" fill="#e9cf8a" stroke="#c6a456" stroke-width="1.4"/>`;
 b+=`<path d="M490 128C518 116 556 130 558 162C560 196 536 216 508 212C490 208 482 192 484 168C485 146 484 134 490 128Z" fill="#d79b7c" stroke="#9c6a4f" stroke-width="1.6"/>`;
 // camadas do córtex (faixas) e vaso central da medula
 b+=`<path d="M478 116C520 98 568 118 570 160" fill="none" stroke="#d8b768" stroke-width="1.2" stroke-dasharray="3 3"/><path d="M514 164C524 160 536 168 532 180" fill="none" stroke="${IC.vein}" stroke-width="4" stroke-linecap="round"/>`;
 b+=T(530,286,'corte da suprarrenal',11,{c:'#7f8a94'});
 b+=lk(372,290,344,342,1)+lk(568,140,590,74,2)+lk(512,190,540,226,3);
 return b;}

function iPancreas(){
 let b='';
 // duodeno em C, cabeça, corpo e cauda (vista anterior)
 b+=`<path d="M356 92C330 100 326 140 336 168C346 196 370 206 394 198" fill="none" stroke="#d9b7a6" stroke-width="20" stroke-linecap="round"/><path d="M356 92C330 100 326 140 336 168C346 196 370 206 394 198" fill="none" stroke="#efd8cc" stroke-width="10" stroke-linecap="round"/>`;
 b+=`<path d="M352 122C344 150 352 180 372 184C394 186 418 172 446 160C476 146 512 128 548 112C566 104 572 92 562 86C548 80 520 92 490 104C458 116 424 122 398 120C380 118 360 112 352 122Z" fill="#dcb46a" stroke="#a27d3c" stroke-width="2.2"/>`;
 b+=`<path d="M364 160Q420 140 470 126Q516 112 556 94" fill="none" stroke="#bb9142" stroke-width="2.4"/>`;
 b+=Array.from({length:14},(_,k)=>`<path d="M${372+k*13} ${150-k*4}q4 6 0 12" fill="none" stroke="#c39b52" stroke-width="1.2"/>`).join('');
 b+=T(356,226,'cabeça',11,{c:'#7f8a94'})+T(452,184,'corpo',11,{c:'#7f8a94'})+T(556,140,'cauda',11,{c:'#7f8a94'});
 // ilhota ampliada entre ácinos
 b+=`<path d="M462 136L404 246M478 132L560 246" stroke="#9aa3a8" stroke-width="1.2" stroke-dasharray="4 3"/><circle cx="470" cy="134" r="6" fill="none" stroke="#7a5a2a" stroke-width="1.6"/>`;
 b+=`<circle cx="482" cy="294" r="74" fill="#efe1c0" stroke="#a27d3c" stroke-width="2"/>`;
 // ácinos exócrinos na periferia
 b+=Array.from({length:10},(_,k)=>{const a=k/10*Math.PI*2;const x=482+60*Math.cos(a),y=294+60*Math.sin(a);return `<circle cx="${r1(x)}" cy="${r1(y)}" r="13" fill="#e2c48e" stroke="#b08a46" stroke-width="1.2"/><circle cx="${r1(x)}" cy="${r1(y)}" r="3" fill="#f7ecd6"/>`;}).join('');
 // ilhota: maioria células beta (azuis), alfa (vermelhas), capilar
 b+=`<circle cx="482" cy="294" r="40" fill="#f6efe0" stroke="#8f7a4a" stroke-width="1.4"/>`;
 const cells=[[468,280,'b'],[486,276,'b'],[500,286,'b'],[472,298,'b'],[494,304,'a'],[480,314,'b'],[462,312,'a'],[504,300,'b'],[456,292,'a'],[490,290,'b'],[478,262,'a'],[506,270,'b']];
 b+=cells.map(([x,y,k])=>uCircle(x,y,7.5,k==='b'?'#7aa3c6':'#d07b6a')).join('');
 b+=`<path d="M450 304Q482 286 514 296" fill="none" stroke="${IC.blood}" stroke-width="3"/>`;
 b+=lk(430,130,380,64,1)+lk(470,296,582,376,2)+lk(530,322,590,270,3);
 return b;}
const PANC_LABELS=['Pâncreas: cabeça junto ao duodeno, corpo e cauda','Ilhota pancreática: células beta (azuis, insulina) e alfa (alaranjadas, glucagon), com capilar sanguíneo','Ácinos: parte exócrina, que produz suco digestivo'];

function iUterusFront(o={}){
 // vista frontal: útero, tubas com fímbrias, ovários presos ao útero pelo ligamento
 const {x=458,y=200,s=1,folls=true}=o;
 let b=`<g transform="translate(${x} ${y}) scale(${s})">`;
 b+=`<path d="M-30 -58C-60 -62 -96 -70 -116 -52C-132 -38 -138 -14 -128 2" fill="none" stroke="#b97588" stroke-width="10" stroke-linecap="round"/><path d="M30 -58C60 -62 96 -70 116 -52C132 -38 138 -14 128 2" fill="none" stroke="#b97588" stroke-width="10" stroke-linecap="round"/>`;
 b+=`<path d="M-30 -58C-60 -62 -96 -70 -116 -52C-132 -38 -138 -14 -128 2" fill="none" stroke="#e7b9c3" stroke-width="4" stroke-linecap="round"/><path d="M30 -58C60 -62 96 -70 116 -52C132 -38 138 -14 128 2" fill="none" stroke="#e7b9c3" stroke-width="4" stroke-linecap="round"/>`;
 b+=[-1,0,1,2].map(k=>`<path d="M-128 2l${-10+k*7} 14M128 2l${10-k*7} 14" stroke="#b97588" stroke-width="3.4" stroke-linecap="round"/>`).join('');
 b+=`<path d="M-34 -36Q-60 -20 -88 -14M34 -36Q60 -20 88 -14" stroke="#c9a8a0" stroke-width="3" fill="none"/>`;
 b+=`<ellipse cx="-100" cy="-10" rx="28" ry="17" fill="${IC.gold}" stroke="${IC.goldS}" stroke-width="1.8" transform="rotate(-12 -100 -10)"/><ellipse cx="100" cy="-10" rx="28" ry="17" fill="${IC.gold}" stroke="${IC.goldS}" stroke-width="1.8" transform="rotate(12 100 -10)"/>`;
 if(folls)b+=[[-110,-12,6],[-96,-4,4],[-90,-16,3.5],[106,-14,7],[92,-6,4]].map(([fx,fy,r])=>`<circle cx="${fx}" cy="${fy}" r="${r}" fill="#f6e7c3" stroke="#b4924a" stroke-width="1"/>`).join('');
 b+=`<path d="M-40 -60C-42 -76 40 -76 40 -60C46 -20 34 18 16 40L14 70H-14L-16 40C-34 18 -46 -20 -40 -60Z" fill="#d69aa8" stroke="#975d6b" stroke-width="2.4"/>`;
 b+=`<path d="M-24 -50Q0 -58 24 -50Q16 -14 4 18H-4Q-16 -14 -24 -50Z" fill="#f4dfe2" stroke="#c07d8e" stroke-width="5" stroke-linejoin="round"/><path d="M-3 18V70M3 18V70" stroke="#f4dfe2" stroke-width="2"/>`;
 b+=`<path d="M-16 70L-20 128Q0 136 20 128L16 70Z" fill="#e3b3bd" stroke="#975d6b" stroke-width="2"/>`+[0,1,2,3,4].map(k=>`<path d="M-14 ${80+k*10}H14" stroke="#c48b98" stroke-width="1.4"/>`).join('');
 return b+'</g>';}
function iOvaryInset(){return iUterusFront({x:458,y:180,s:1.05})+lk(354,170,354,272,1)+lk(458,160,520,280,2)+lk(328,190,400,326,3);}
const OVARY_LABELS=['Ovário: folículos em diferentes estágios','Útero: referência da localização pélvica','Tuba uterina com fímbrias, próximas ao ovário'];

function iTestis(){
 let b='';
 // escroto em corte frontal com septo; testículo, epidídimo e funículo espermático
 b+=`<path d="M364 120C338 170 344 300 400 330C430 346 486 346 516 330C572 300 578 170 552 120C520 104 396 104 364 120Z" fill="#e7c6b1" stroke="${IC.skinS}" stroke-width="2.4"/><path d="M458 116V340" stroke="#c9a28a" stroke-width="2" stroke-dasharray="5 4"/>`;
 [[410,1],[506,-1]].forEach(([cx,m])=>{
  b+=`<path d="M${cx-m*8} 60Q${cx-m*30} 120 ${cx-m*40} 180" fill="none" stroke="#b78e74" stroke-width="12" stroke-linecap="round"/><path d="M${cx-m*8} 60Q${cx-m*30} 120 ${cx-m*40} 180" fill="none" stroke="#e1c1a8" stroke-width="5"/>`;
  b+=`<ellipse cx="${cx}" cy="240" rx="40" ry="56" fill="#f1e2d6" stroke="#b9937d" stroke-width="2"/>`;
  b+=`<ellipse cx="${cx}" cy="240" rx="32" ry="48" fill="${IC.gold}" stroke="${IC.goldS}" stroke-width="2"/>`;
  b+=[0,1,2,3].map(k=>`<path d="M${cx-26} ${206+k*22}q${m*14} -10 26 0t26 0" fill="none" stroke="#b68d4b" stroke-width="1.3"/>`).join('');
  b+=`<path d="M${cx-m*16} 186C${cx-m*44} 180 ${cx-m*50} 214 ${cx-m*44} 240C${cx-m*40} 266 ${cx-m*42} 286 ${cx-m*26} 294" fill="none" stroke="#c98a5f" stroke-width="11" stroke-linecap="round"/>`;
 });
 b+=lk(410,252,470,370,1)+lk(530,320,590,350,2)+lk(550,240,594,196,3)+lk(392,110,340,80,4);
 return b;}
const TESTIS_LABELS=['Testículo: túbulos seminíferos (produção de espermatozoides) e células de Leydig (testosterona)','Escroto: bolsa de pele e músculo fora da cavidade abdominal','Epidídimo: maturação e armazenamento','Funículo espermático: ducto deferente, vasos e nervos'];

// ---------- A1 · Da produção à resposta ----------
function iSignal(i,t){
 let b='';
 // líquido intersticial (fundo) 
 b+=`<rect x="14" y="40" width="612" height="296" rx="18" fill="#f3f1ea" stroke="#ddd6c6"/>`;
 // célula endócrina: núcleo, retículo e vesículas de secreção
 b+=`<path d="M40 120C40 92 62 80 92 80C130 80 168 94 172 128C176 166 172 214 150 244C130 268 76 270 52 246C34 226 40 160 40 120Z" fill="#f3e2cf" stroke="#a9876a" stroke-width="2.4"/>`;
 b+=`<ellipse cx="92" cy="170" rx="28" ry="24" fill="${IC.nuc}" stroke="${IC.nucS}" stroke-width="1.6"/><circle cx="98" cy="164" r="6" fill="#6f7fa6"/>`;
 b+=`<path d="M62 116q14-8 28 0t28 0M58 132q14-8 28 0t28 0" fill="none" stroke="#c49a7a" stroke-width="2"/>`;
 const ves=[[140,140],[152,170],[140,206],[124,226],[132,110]];
 b+=ves.map(([x,y],k)=>`<circle cx="${x}" cy="${y}" r="8" fill="#fbf2dc" stroke="#b08a46" stroke-width="1.4"/>`+hormone(x,y,IC.hormone,3.2)).join('');
 // capilar com endotélio e hemácias
 b+=`<path d="M190 150H452M190 232H452" stroke="#c98f98" stroke-width="10"/><rect x="190" y="155" width="262" height="72" fill="${IC.bloodL}"/>`;
 b+=[218,300,382].map(x=>`<ellipse cx="${x}" cy="150" rx="12" ry="4" fill="#9b6672"/><ellipse cx="${x+40}" cy="232" rx="12" ry="4" fill="#9b6672"/>`).join('');
 b+=rbc(236,180,1,-8)+rbc(310,206,1,12)+rbc(372,178,1,4)+rbc(420,206,1,-14);
 // célula-alvo (com receptores) e célula não-alvo (sem receptores compatíveis)
 const cellR=(y,on)=>`<path d="M486 ${y}C486 ${y-30} 520 ${y-44} 560 ${y-44}C600 ${y-44} 618 ${y-24} 618 ${y+6}C618 ${y+40} 594 ${y+56} 556 ${y+56}C514 ${y+56} 486 ${y+34} 486 ${y}Z" fill="${on?'#cfe2c3':'#e8ece4'}" stroke="${on?'#5f8a4e':'#9aa39b'}" stroke-width="2.4"/><ellipse cx="566" cy="${y+8}" rx="22" ry="18" fill="${IC.nuc}" stroke="${IC.nucS}" stroke-width="1.4"/>`;
 b+=cellR(108,i===3)+cellR(276,false);
 const recs=[[488,96,180],[492,128,170],[500,74,200]];
 const recep=([x,y,a])=>`<g transform="translate(${x} ${y}) rotate(${a})"><path d="M0 -7V7" stroke="#4f7d43" stroke-width="5"/><path d="M-9 -9Q0 -1 -9 9" fill="none" stroke="#4f7d43" stroke-width="3.4"/></g>`;
 b+=recs.map(recep).join('');
 // hormônios conforme a etapa
 const E=(a,c,k)=>a+(c-a)*k;
 if(i===0){[[172,140],[176,176],[168,210]].forEach(([x,y],k)=>{b+=hormone(E(150,x+6+k*4,t),E(y,y,t));});b+=ar([[160,96],[184,96]],'#8a6a2d',2);}
 if(i===1){[[0,174],[1,196],[2,186],[3,210]].forEach(([k,y])=>{b+=hormone(E(200+k*12,330+k*30,t),y);});b+=ar([[300,252],[420,252]],'#8a6a2d',2);}
 if(i>=2){const tt=i===2?t:1;b+=hormone(E(452,478,tt),E(176,98,tt))+hormone(E(452,482,tt),E(196,126,tt))+hormone(E(452,494,tt),E(206,264,tt))+hormone(E(440,480,tt),E(220,300,tt));}
 if(i===3){b+=ar([[512,112],[546,112]],'#3f6d33',2.4)+`<path d="M520 136q20 8 30 -6" fill="none" stroke="#3f6d33" stroke-width="2" stroke-dasharray="4 3"/>`+T(556,186,'resposta celular',13,{w:700,c:'#3f6d33'})+T(556,212,'sem receptor: sem resposta',12,{c:'#7f8a94'});}
 b+=lk(92,232,40,300,1)+lk(320,232,320,300,2)+lk(498,82,452,66,3)+lk(600,286,470,322,4);
 return b;}
const SIGNAL_LABELS=['Célula endócrina: produz o hormônio e o libera por exocitose (vesículas)','Capilar sanguíneo: o hormônio circula com o sangue','Célula-alvo: tem receptores compatíveis (verde) e responde','Célula sem receptor compatível: recebe o mesmo sangue, mas não responde'];

// ---------- Órgãos-alvo (janela 300–600 × 30–360) ----------
function iBone(){let b='';
 // osso longo (fêmur simplificado) em corte longitudinal: epífises, placas de crescimento, diáfise, cavidade medular
 b+=`<path d="M410 70C384 52 352 70 360 98C366 118 392 124 420 120L424 290C394 288 370 300 372 324C374 348 404 356 430 344C446 352 470 356 486 340C500 322 488 294 462 290L466 120C490 122 510 108 508 88C506 62 476 54 456 70C442 62 424 62 410 70Z" fill="${IC.bone}" stroke="${IC.boneS}" stroke-width="2.4"/>`;
 b+=`<path d="M432 128H454L452 282H434Z" fill="#e8c08e" stroke="#c7a06a" stroke-width="1.4"/>`;
 b+=`<path d="M388 114Q440 104 494 108M392 300Q440 292 484 302" fill="none" stroke="#7d8eb0" stroke-width="3" stroke-dasharray="6 3"/>`;
 b+=hatchBone(372,72,120,40)+hatchBone(380,300,100,40);
 b+=`<path d="M494 110L530 110" stroke="#7d8eb0" stroke-width="1.3"/>`+T(560,112,'placa de',11)+T(560,125,'crescimento',11)+T(450,206,'medula',10,{c:'#8a6534'});
 return b;}
function iKidneyCut(){let b='';
 // rim em corte frontal: córtex, pirâmides medulares, cálices, pelve renal, ureter e vasos no hilo
 b+=`<path d="M420 62C360 58 330 120 332 196C334 274 370 332 426 330C462 328 470 300 456 278C442 258 440 232 446 212C450 192 450 168 444 150C454 124 456 66 420 62Z" fill="#b9706f" stroke="${IC.kidS}" stroke-width="2.4"/>`;
 b+=`<path d="M420 78C372 76 348 128 350 196C352 262 380 312 424 314" fill="none" stroke="#d29b93" stroke-width="12" opacity=".7"/>`;
 b+=[[118,364],[170,352],[222,352],[272,364]].map(([y,bx])=>`<path d="M${bx} ${y-20}Q${bx-6} ${y} ${bx} ${y+20}L${404} ${y+3}L${404} ${y-3}Z" fill="#8f4f55"/><path d="M402 ${y-8}Q412 ${y} 402 ${y+8}" fill="none" stroke="#efd9a8" stroke-width="5"/>`).join('');
 b+=`<path d="M402 126Q420 150 430 176Q440 200 430 224Q420 252 402 268M430 200H470" fill="none" stroke="#efd9a8" stroke-width="10" stroke-linecap="round"/>`;
 b+=`<path d="M454 206Q480 230 476 340" fill="none" stroke="#e1c27e" stroke-width="9" stroke-linecap="round"/>`;
 b+=`<path d="M444 180H560" stroke="${IC.blood}" stroke-width="7"/><path d="M446 196H560" stroke="${IC.vein}" stroke-width="7"/>`;
 b+=T(562,174,'artéria',10,{a:'start'})+T(562,214,'veia',10,{a:'start'})+T(500,330,'ureter',10,{a:'start'});
 return b;}
function iLiver(){let b='';
 // fígado em vista anterior: lobo direito (à esquerda de quem olha) maior, ligamento falciforme, vesícula biliar
 b+=`<path d="M318 132C344 92 420 80 488 88C540 94 586 112 594 138C598 152 580 160 560 166C520 178 480 196 450 222C420 248 386 268 358 262C330 256 316 230 312 200C308 170 308 148 318 132Z" fill="#a85e5f" stroke="#7e4149" stroke-width="2.4"/>`;
 b+=`<path d="M458 92Q452 150 446 222" fill="none" stroke="#d6a49b" stroke-width="3"/>`;
 b+=`<path d="M408 244C406 262 416 278 430 276C442 274 444 258 438 246Z" fill="#7d9a5a" stroke="#5a7340" stroke-width="1.8"/>`;
 
 b+=T(372,182,'lobo',11,{c:'#fbe9e6'})+T(372,196,'direito',11,{c:'#fbe9e6'})+T(530,140,'lobo',11,{c:'#fbe9e6'})+T(530,154,'esquerdo',11,{c:'#fbe9e6'})+T(470,300,'vesícula biliar',11);
 return b;}
function iHeart(){let b='';
 // coração em vista anterior: átrios, ventrículos, aorta, tronco pulmonar, veia cava superior, artérias coronárias
 b+=`<path d="M400 120H426V58H400Z" fill="#7f98b8" stroke="#5a6f8e" stroke-width="2"/>`;
 b+=`<path d="M432 132C430 92 440 64 470 60C500 56 518 72 516 92L498 96C496 80 486 76 474 78C458 82 454 100 456 132Z" fill="#c9545f" stroke="#8d3242" stroke-width="2"/>`;
 b+=`<path d="M470 62l-4 -22M484 60l2 -22M500 66l10 -18" stroke="#c9545f" stroke-width="7" stroke-linecap="round"/>`;
 b+=`<path d="M392 150C380 140 384 120 404 118C420 116 438 124 446 134Z" fill="#8fa4c4" stroke="#5a6f8e" stroke-width="2"/>`;
 b+=`<path d="M500 118C524 112 546 124 540 146L512 150Z" fill="#d9828a" stroke="#8d3242" stroke-width="2"/>`;
 b+=`<path d="M388 154C380 200 414 262 506 320C540 272 556 216 546 156C536 132 506 126 474 134C446 126 404 132 388 154Z" fill="#b8525d" stroke="#7d2f3c" stroke-width="2.4"/>`;
 b+=`<path d="M470 128C468 120 486 112 498 118C512 126 504 140 494 148Z" fill="#7f98b8" stroke="#5a6f8e" stroke-width="2"/>`;
 b+=`<path d="M462 140Q462 230 504 316" fill="none" stroke="#e6b07a" stroke-width="4"/><path d="M462 160Q500 176 528 214M458 180Q420 196 404 222" fill="none" stroke="#e6b07a" stroke-width="2.6"/>`;
 b+=T(404,52,'veia cava',10)+T(536,48,'aorta',10)+T(430,252,'ventrículo',10,{c:'#fde3e3'})+T(430,265,'direito',10,{c:'#fde3e3'})+T(516,220,'ventrículo',10,{c:'#fde3e3'})+T(516,233,'esquerdo',10,{c:'#fde3e3'});
 return b;}
function iBreast(o={}){
 // mama em corte sagital (parede torácica à esquerda): lobos com alvéolos, ductos lactíferos, mamilo, tecido adiposo
 const {x=0,y=0,s=1,milk=0,eject=0}=o;let b=`<g transform="translate(${x} ${y}) scale(${s})">`;
 b+=`<path d="M320 40V340" stroke="#c7837a" stroke-width="22"/>`+[0,1,2,3,4,5,6].map(k=>`<path d="M310 ${58+k*42}H330" stroke="#a5655e" stroke-width="2"/>`).join('');
 b+=`<path d="M334 50C420 60 520 110 560 176C568 186 584 186 590 192C596 200 590 212 582 214C576 216 568 216 560 222C520 286 420 330 334 334Z" fill="#f2dcc4" stroke="#b48b70" stroke-width="2.4"/>`;
 b+=`<path d="M560 176C568 186 584 186 590 192C596 200 590 212 582 214C576 216 568 216 560 222Z" fill="#c98e78" stroke="#9c6650"/>`;
 b+=[[356,62],[440,82],[500,118],[352,322],[440,306],[500,268],[452,190],[352,190]].map(([fx,fy])=>`<ellipse cx="${fx}" cy="${fy}" rx="16" ry="10" fill="#f6ead2" stroke="#e1cda8"/>`).join('');
 const lobes=[[392,96],[372,156],[372,226],[392,286]];
 lobes.forEach(([lx,ly],k)=>{const ty=192+(k-1.5)*8;
  b+=`<path d="M${lx+26} ${ly}Q${470} ${(ly+ty)/2} 572 ${ty}" fill="none" stroke="#b78769" stroke-width="5"/><path d="M${lx+26} ${ly}Q${470} ${(ly+ty)/2} 572 ${ty}" fill="none" stroke="#f7e8d8" stroke-width="2"/>`;
  [[0,-16],[-14,-6],[-14,10],[0,18],[14,-10],[14,10],[0,0]].forEach(([dx,dy])=>{b+=`<circle cx="${lx+dx}" cy="${ly+dy}" r="8" fill="#d9a08b" stroke="#9c6650" stroke-width="1.2"/><circle cx="${lx+dx}" cy="${ly+dy}" r="${milk?3.4:2.2}" fill="${milk?'#fffdf4':'#f3dccc'}"/>`;});
  if(eject)for(let j=0;j<3;j++){const u=((eject+j/3)%1);b+=`<circle cx="${r1(lx+26+(546-lx)*u)}" cy="${r1(ly+(ty-ly)*u*u)}" r="3.4" fill="#fffdf4" stroke="#c9b28c" stroke-width=".8"/>`;}
 });
 b+=T(372,354,'parede torácica',10);
 return b+'</g>';}
function iCells(){let b='';
 b+=`<rect x="320" y="70" width="270" height="250" rx="18" fill="#eef1ea" stroke="#cfd6c8"/>`;
 [[380,140],[470,120],[556,150],[400,250],[500,240],[570,270]].forEach(([x,y],k)=>{b+=cellE(x,y,40,34,'#cfe2c3','#5f8a4e',.36,k*17);});
 b+=[[350,118],[438,96],[528,126],[368,226],[472,214],[540,250]].map(([x,y])=>`<g transform="translate(${x} ${y})"><path d="M0 -6V6" stroke="#4f7d43" stroke-width="4"/><path d="M-7 -7Q0 0 -7 7" fill="none" stroke="#4f7d43" stroke-width="3"/></g>`).join('');
 b+=T(456,342,'células de vários tecidos com receptores',11);
 return b;}

// ---------- A3 · Glicose, insulina e glucagon ----------
function iGlucose(high,i,t){
 let b='';const count=high?[12,12,7,5][i]:[3,3,6,8][i];
 // vaso sanguíneo com hemácias e glicose
 b+=`<path d="M40 50H600M40 124H600" stroke="#b65b70" stroke-width="9"/><rect x="40" y="55" width="560" height="64" fill="#f6dde1"/>`;
 b+=[90,250,410,560].map((x,k)=>rbc(x,k%2?100:74,1,k*9-10)).join('');
 const G=[];for(let k=0;k<12;k++)G.push([70+k*44,k%2?72:100]);
 b+=G.slice(0,count).map(([x,y])=>`<polygon points="${[0,1,2,3,4,5].map(j=>r1(x+6.5*Math.cos(j*Math.PI/3))+','+r1(y+6.5*Math.sin(j*Math.PI/3))).join(' ')}" fill="${IC.gold}" stroke="${IC.goldS}" stroke-width="1.2"/>`).join('');
 // pâncreas com ilhota ampliada
 b+=`<path d="M40 222C34 204 48 190 64 194C86 182 112 186 134 184C160 182 186 176 204 186C214 194 204 206 190 210C164 220 132 224 104 232C80 240 52 244 40 222Z" fill="#dcb46a" stroke="#a27d3c" stroke-width="2"/>`;
 b+=`<circle cx="120" cy="290" r="44" fill="#efe1c0" stroke="#a27d3c" stroke-width="1.6"/><path d="M112 216L92 250M130 214L148 250" stroke="#9aa3a8" stroke-width="1.2" stroke-dasharray="4 3"/><circle cx="120" cy="212" r="6" fill="none" stroke="#7a5a2a" stroke-width="1.5"/>`;
 const act=i>=1&&i<=2;
 [[104,276,'b'],[122,270,'b'],[138,282,'a'],[108,296,'b'],[126,300,'b'],[142,302,'a'],[118,316,'b'],[98,312,'a']].forEach(([x,y,k])=>{const on=act&&((high&&k==='b')||(!high&&k==='a'));b+=`<circle cx="${x}" cy="${y}" r="8" fill="${k==='b'?'#7aa3c6':'#d07b6a'}" stroke="${on?'#1f2b3a':'none'}" stroke-width="2"/>`;});
 const hc=high?IC.ins:IC.glu;
 if(act){b+=ar([[196,196],[236,136]],hc,2.4);for(let k=0;k<3;k++){const u=(t+k/3)%1;b+=`<rect x="${r1(196+40*u-4)}" y="${r1(196-60*u-4)}" width="8" height="8" rx="2" fill="${hc}"/>`;}}
 if(i>=1&&i<=2)b+=Array.from({length:i===1?3:6},(_,k)=>`<rect x="${270+k*52}" y="${k%2?66:96}" width="8" height="8" rx="2" fill="${hc}"/>`).join('');
 // fígado com grânulos de glicogênio
 b+=`<path d="M398 214C420 180 480 170 536 176C574 180 604 194 604 214C604 228 586 234 566 238C534 244 502 258 478 280C454 300 424 310 404 300C384 288 380 246 398 214Z" fill="#a85e5f" stroke="#7e4149" stroke-width="2"/>`;
 const gly=high?[2,2,6,7][i]:[6,6,3,2][i];
 b+=Array.from({length:gly},(_,k)=>{const x=430+(k%4)*34,y=214+Math.floor(k/4)*30;return [0,1,2,3,4].map(j=>uCircle(r1(x+6*Math.cos(j*1.26)),r1(y+6*Math.sin(j*1.26)),3.2,'#f2c8cf')).join('');}).join('');
 // célula muscular ou adiposa (alvo da insulina)
 b+=`<rect x="250" y="226" width="110" height="64" rx="26" fill="#e8c2bc" stroke="#a7685f" stroke-width="2"/><ellipse cx="305" cy="258" rx="14" ry="10" fill="${IC.nuc}" stroke="${IC.nucS}"/>`;
 if(high&&i===2){b+=ar([[300,124],[300,222]],'#8a6a2d',2)+ar([[470,124],[470,206]],'#8a6a2d',2);}
 if(!high&&i===2){b+=ar([[500,200],[500,130]],'#8a6a2d',2);}
 if(i===3)b+=T(330,160,high?'glicose menor → menos estímulo às células beta':'glicose maior → menos estímulo às células alfa',14);
 b+=T(486,326,'glicogênio (rosetas claras)',10)+T(305,306,'músculo / tecido adiposo',10);
 b+=uMark(24,86,1)+lk(80,206,30,180,2)+lk(560,196,620,170,3)+lk(120,300,190,330,4);
 return b;}
const GLU_LABELS=['Sangue: hexágonos = glicose; o número indica aumento ou queda, não uma medida','Pâncreas: secreção do sinal pelas ilhotas','Fígado: armazena glicose como glicogênio ou a libera para o sangue','Ilhota: células beta (azuis, insulina) e alfa (alaranjadas, glucagon); a ativa fica contornada'];

// ---------- A6 · Ciclo ovariano e uterino ----------
function iFollicle(x,y,r,o={}){
 // folículo antral: teca, granulosa, antro com líquido, cúmulo com ovócito e zona pelúcida
 const {oo=true}=o;let b=`<circle cx="${x}" cy="${y}" r="${r+5}" fill="#e6c79a" stroke="#b08a52" stroke-width="1.4"/><circle cx="${x}" cy="${y}" r="${r}" fill="#f0d79a" stroke="#c4a160" stroke-width="1.2"/><circle cx="${x}" cy="${y}" r="${r*.74}" fill="#fbf4dc" stroke="#d9c48c" stroke-width="1"/>`;
 if(oo)b+=`<circle cx="${r1(x+r*.38)}" cy="${r1(y-r*.28)}" r="${r1(r*.36)}" fill="#f0d79a"/><circle cx="${r1(x+r*.38)}" cy="${r1(y-r*.28)}" r="${r1(r*.22)}" fill="#fff" stroke="#c9b27a" stroke-width="2"/><circle cx="${r1(x+r*.38)}" cy="${r1(y-r*.28)}" r="${r1(r*.17)}" fill="#f4e6c9"/>`;
 return b;}
function iSmallFoll(x,y,r=6){return `<circle cx="${x}" cy="${y}" r="${r}" fill="#f0d79a" stroke="#c4a160" stroke-width="1"/><circle cx="${x}" cy="${y}" r="${r*.5}" fill="#fff" stroke="#c9b27a" stroke-width=".8"/>`;}
function iCycle(i,t){
 let b='';
 // ovário em corte
 b+=`<path d="M36 176C34 110 92 74 156 76C222 78 270 116 266 176C262 236 214 276 150 276C88 276 38 240 36 176Z" fill="#e8cfa9" stroke="#a7845a" stroke-width="2.4"/>`;
 b+=[[70,150],[84,212],[120,248],[196,250],[230,214],[110,108],[180,102]].map(([x,y])=>iSmallFoll(x,y)).join('');
  if(i===0)b+=iFollicle(150,170,16)+iFollicle(108,180,10,{oo:true});
 if(i===1){const r=26+18*t;b+=iFollicle(162-8*t,164,r)+iSmallFoll(104,184,9);}
 if(i===2){b+=`<path d="M246 132C228 120 198 128 192 154C186 180 204 200 228 200C246 200 260 188 262 172" fill="#f6e4b4" stroke="#c4a160" stroke-width="5"/><path d="M226 140C214 142 206 156 210 170C214 182 228 188 240 182" fill="none" stroke="#e8b06a" stroke-width="3" stroke-dasharray="3 3"/>`+uCircle(258,152,3,IC.blood)+uCircle(262,160,2.4,IC.blood);
  const ox=262+40*t,oy=150-10*t;b+=`<circle cx="${ox}" cy="${oy}" r="13" fill="#f0d79a" stroke="#c4a160"/><circle cx="${ox}" cy="${oy}" r="8" fill="#fff" stroke="#c9b27a" stroke-width="2"/>`;
  b+=`<path d="M346 112c-22 2-34 18-34 32m10-34c-12 12-14 30-8 42m18-42c-6 16-4 32 4 40m10-36c0 12 4 22 10 28" fill="none" stroke="#b97588" stroke-width="5" stroke-linecap="round"/>`+T(326,196,'fímbrias',10);}
 if(i===3){b+=`<path d="M160 136C190 128 214 146 214 176C214 204 190 222 160 220C130 218 110 198 112 172C114 148 134 138 160 136Z" fill="#e9c24d" stroke="#b08a20" stroke-width="2"/>`;
  b+=`<path d="M128 166q10 -14 20 0t20 0t20 0M126 186q10 -14 20 0t20 0t20 0M136 204q10 -12 20 0t20 0" fill="none" stroke="#c99a1f" stroke-width="2"/><circle cx="162" cy="182" r="10" fill="#f6d77c"/>`;}
 // endométrio: bloco da parede uterina (lúmen em cima, miométrio embaixo)
 const fx=[34,64,90,112][i]+(i===1?22*t:0),top=300-110-fx;
 b+=`<rect x="360" y="270" width="250" height="56" fill="#c9837f" stroke="#91524c" stroke-width="2"/>`+[0,1,2,3,4,5].map(k=>`<path d="M${366+k*42} 282q14 8 30 0M${370+k*42} 304q14 8 30 0" fill="none" stroke="#a9615c" stroke-width="1.6"/>`).join('');
 b+=`<rect x="360" y="246" width="250" height="24" fill="#e7a8a7" stroke="#b46f72" stroke-width="1"/>`;
 const shed=i===0;
 b+=`<path d="M360 246V${246-fx}${shed?'Q380 '+(236-fx)+' 396 '+(246-fx)+'T432 '+(246-fx)+'T468 '+(246-fx)+'T504 '+(246-fx)+'T540 '+(246-fx)+'T576 '+(246-fx)+'T610 '+(246-fx):'H610'}V246Z" fill="#f1c4c6" stroke="#b46f72" stroke-width="2"/>`;
 // glândulas (retas na proliferativa, tortuosas na secretora) e artérias espiraladas
 for(let k=0;k<5;k++){const gx=386+k*48;
  if(i===3)b+=`<path d="M${gx} ${246-fx}q-8 ${fx*.2} 0 ${fx*.4}t0 ${fx*.4}t0 ${fx*.2}" fill="none" stroke="#c97c86" stroke-width="5"/><path d="M${gx} ${246-fx}q-8 ${fx*.2} 0 ${fx*.4}t0 ${fx*.4}t0 ${fx*.2}" fill="none" stroke="#fbe8ea" stroke-width="2"/>`;
  else b+=`<path d="M${gx} ${246-fx}V250" stroke="#c97c86" stroke-width="5"/><path d="M${gx} ${246-fx}V250" stroke="#fbe8ea" stroke-width="2"/>`;
  const ax=gx+24,coils=i===3?4:i>=1?2:1;let d=`M${ax} 300`;const hgt=54+fx*.85;for(let c=0;c<coils;c++){const y0=300-c*hgt/coils,y1=300-(c+1)*hgt/coils;const A=i===3?11:7;d+=`C${ax+A} ${r1(y0-(y0-y1)*.3)} ${ax-A} ${r1(y0-(y0-y1)*.7)} ${ax} ${r1(y1)}`;}b+=`<path d="${d}" fill="none" stroke="${IC.blood}" stroke-width="2.2"/>`;}
 if(shed){b+=[[384,196,-12],[436,190,10],[496,198,-6],[556,192,14]].map(([x,y,a])=>`<path d="M${x} ${y-10*t}l16 -4l10 8l-14 8Z" fill="#e8a5aa" stroke="#b46f72" transform="rotate(${a} ${x} ${y})"/>`).join('')+[400,470,540].map(x=>uCircle(x,186-12*t,4,IC.blood)).join('');}
 b+=T(604,262,'camada basal',10,{a:'end',c:'#7d3b3e',h:1})+T(604,320,'miométrio',10,{a:'end',c:'#fde9e6'})+T(485,250-fx*.55,'camada funcional',11,{c:'#7d3b3e',h:1});
 b+=T(485,36,['Menstruação','Fase proliferativa','Ovulação','Fase secretora (lútea)'][i],13,{w:700})+T(150,300,['Folículos iniciais','Folículo dominante (antral)','Ovócito liberado com células da corona','Corpo lúteo'][i],12,{w:700});
 b+=uMark(40,60,1)+uMark(352,60,2);
 return b;}

// ---------- A7 · Da fecundação à implantação ----------
function iSperm(x,y,a=0,s=1){return `<g transform="translate(${r1(x)} ${r1(y)}) rotate(${a}) scale(${s})"><ellipse cx="0" cy="0" rx="5.5" ry="3.6" fill="#5f7fa0" stroke="#3e5874" stroke-width=".8"/><path d="M-5 0h-7" stroke="#7a8fa8" stroke-width="2.2"/><path d="M-12 0q-8 -6 -16 0t-16 0t-14 0" fill="none" stroke="#7a8fa8" stroke-width="1.2"/></g>`;}
function iZona(x,y,r){return `<circle cx="${x}" cy="${y}" r="${r}" fill="#fbf6ea" stroke="#ddd0b2" stroke-width="9"/>`;}
function iBlastomere(x,y,r){return `<circle cx="${r1(x)}" cy="${r1(y)}" r="${r1(r)}" fill="#e7dcb6" stroke="#a8935c" stroke-width="1.4"/><circle cx="${r1(x)}" cy="${r1(y)}" r="${r1(r*.3)}" fill="${IC.nuc}"/>`;}
const TRAVEL_PTS=[[46,128],[87,118],[118,121],[143,150],[160,136]];
function iTravel(i,t){
 const p=TRAVEL_PTS[i],q=TRAVEL_PTS[Math.max(0,i-1)],x=q[0]+(p[0]-q[0])*t,y=q[1]+(p[1]-q[1])*t;
 return iUterusFront({x:150,y:175,s:.9})+`<path d="M60 166Q52 150 46 128" fill="none" stroke="#c9a14a" stroke-width="1.6" stroke-dasharray="3 3"/><circle cx="${r1(x)}" cy="${r1(y)}" r="9" fill="#fff8e6" stroke="#8a6a2d" stroke-width="2"/><circle cx="${r1(x)}" cy="${r1(y)}" r="16" fill="none" stroke="var(--tema)" stroke-width="2" stroke-dasharray="4 3"/>`;}
function iEncounter(i,t){
 let b=iTravel(i,t)+`<rect x="328" y="40" width="300" height="290" rx="18" fill="#f6f3ec" stroke="#ddd6c6"/>`;
 const cx=478,cy=186;let labels=['Percurso no sistema genital: ampola da tuba → útero','Detalhe ampliado (fora de escala em relação ao mapa)'];
 if(i===0){
  b+=Array.from({length:14},(_,k)=>{const a=k/14*Math.PI*2;return `<circle cx="${r1(cx+82*Math.cos(a))}" cy="${r1(cy+82*Math.sin(a))}" r="13" fill="#eedfc0" stroke="#c4a160" stroke-width="1.2"/>`;}).join('');
  b+=iZona(cx,cy,64)+`<circle cx="${cx}" cy="${cy}" r="56" fill="#f4e6c9" stroke="#c9b27a" stroke-width="1.4"/><circle cx="${cx+38}" cy="${cy-32}" r="6" fill="#efe1c0" stroke="#b49a63"/>`;
  b+=`<path d="M${cx+20} ${cy-30}L${cx+30} ${cy-14}M${cx+16} ${cy-26}L${cx+34} ${cy-18}M${cx+24} ${cy-34}L${cx+26} ${cy-10}" stroke="#8f6f9b" stroke-width="1.4"/>`;
  b+=iSperm(cx-170+104*t,cy-6,0)+iSperm(400,104,40)+iSperm(392,278,-30)+iSperm(580,96,140)+iSperm(600,256,-150);
  b+=lk(cx-45,cy+44,350,320,3)+lk(cx+60,cy+56,612,316,4)+lk(cx+38,cy-32,608,62,5);
  labels.push('Zona pelúcida: camada de glicoproteínas ao redor do ovócito','Corona radiata: células foliculares que acompanham o ovócito','Corpúsculo polar; o ovócito secundário completa a meiose após a entrada do espermatozoide');}
 if(i===1){b+=iZona(cx,cy,64)+iBlastomere(cx-22,cy,28)+iBlastomere(cx+24,cy+2,27)+`<circle cx="${cx+8}" cy="${cy-48}" r="5" fill="#efe1c0" stroke="#b49a63"/>`+lk(cx-40,cy+48,350,320,3)+lk(cx+24,cy+2,610,320,4);labels.push('Zona pelúcida: ainda envolve o embrião','Blastômeros: células da clivagem; o volume total quase não aumenta');}
 if(i===2){const P=[[0,0],[-22,-14],[22,-14],[-22,14],[22,14],[0,-28],[0,28],[-38,0],[38,0],[-14,-40],[14,40],[-38,-26],[38,26],[-38,24],[38,-26],[14,-40]];b+=iZona(cx,cy,64)+P.map(([dx,dy])=>iBlastomere(cx+dx,cy+dy,14)).join('')+lk(cx-40,cy+48,350,320,3)+lk(cx+22,cy+14,610,320,4);labels.push('Zona pelúcida','Mórula: esfera compacta de cerca de 16 células');}
 if(i===3){b+=`<circle cx="${cx}" cy="${cy}" r="${66}" fill="none" stroke="#ddd0b2" stroke-width="${6-3*t}" stroke-dasharray="${t>.5?'14 8':'0'}"/>`;
  b+=`<circle cx="${cx}" cy="${cy}" r="58" fill="#eaf2f6" stroke="#9ab4c4" stroke-width="2"/>`+Array.from({length:22},(_,k)=>{const a=k/22*Math.PI*2;return `<ellipse cx="${r1(cx+54*Math.cos(a))}" cy="${r1(cy+54*Math.sin(a))}" rx="10" ry="5" fill="#d9c79a" stroke="#a8935c" stroke-width="1" transform="rotate(${r1(a*180/Math.PI+90)} ${r1(cx+54*Math.cos(a))} ${r1(cy+54*Math.sin(a))})"/>`;}).join('');
  b+=[[-26,-24],[-12,-32],[-30,-6],[-14,-14],[-2,-26],[-20,6]].map(([dx,dy])=>iBlastomere(cx+dx,cy+dy,10)).join('');
  b+=lk(cx+16,cy+20,612,320,3)+lk(cx-16,cy-14,350,90,4)+lk(cx+54,cy-14,612,70,5)+lk(cx-62,cy+26,350,300,6);
  labels.push('Blastocele (cavidade do blastocisto)','Massa celular interna (embrioblasto): formará o embrião','Trofoblasto: camada externa; participará da placenta','Zona pelúcida se rompe: o blastocisto “eclode” antes de implantar');}
 if(i===4){
  b+=`<path d="M560 40H628V330H560C548 280 556 230 552 186C548 140 556 90 560 40Z" fill="#f1c4c6" stroke="#b46f72" stroke-width="2"/>`;
  b+=[80,150,230,290].map(y=>`<path d="M628 ${y}H584q-8 0 -8 8v8" fill="none" stroke="#c97c86" stroke-width="5"/>`).join('')+`<path d="M612 60q-14 40 0 80t0 80t0 90" fill="none" stroke="${IC.blood}" stroke-width="2.4"/>`;
  const bx=440+70*t;
  b+=`<circle cx="${bx}" cy="${cy}" r="58" fill="#eaf2f6" stroke="#a8935c" stroke-width="6"/>`+[[30,-24],[40,-6],[28,10],[42,16],[16,-8]].map(([dx,dy])=>iBlastomere(bx+dx,cy+dy,10)).join('');
  b+=`<path d="M${bx+52} ${cy-30}C${bx+70+20*t} ${cy-40} ${bx+74+26*t} ${cy-8} ${bx+68+30*t} ${cy+6}C${bx+76+24*t} ${cy+20} ${bx+66+20*t} ${cy+38} ${bx+50} ${cy+32}Z" fill="#a57bb4" stroke="#6e4c7d" stroke-width="1.6"/>`;
  b+=lk(bx+38,cy-6,420,70,3)+lk(bx+68,cy+10,560,322,4)+lk(600,120,612,64,5)+lk(bx-56,cy+10,350,300,6);
  labels.push('Massa celular interna voltada para o endométrio','Sinciciotrofoblasto: avança no endométrio e estabelece contato com tecidos e vasos maternos','Endométrio: glândulas e vasos sanguíneos','Trofoblasto e blastocele');}
 {const P=TRAVEL_PTS[i];b+=lk(P[0],P[1]+10,40,60,1)+uMark(342,28,2);}
 return {b,labels};}

// ---------- A8 · Barreira placentária ----------
function iPlacenta(dir,t){
 let b='';
 // rótulos da coluna esquerda
 b+=T(104,74,'Sangue materno',22)+T(104,96,'espaço interviloso',13)+T(104,176,'Interface',22)+T(104,198,'sinciciotrofoblasto,',12)+T(104,213,'estroma e endotélio',12)+T(104,268,'Sangue fetal',22)+T(104,290,'capilar da vilosidade',13);
 // espaço interviloso com hemácias maternas
 b+=`<rect x="226" y="34" width="384" height="96" rx="14" fill="#f6dde1" stroke="#c38b95" stroke-width="1.6"/>`;
 b+=[[266,66,-10],[352,98,8],[452,62,-4],[540,96,14],[580,58,0]].map(([x,y,a])=>rbc(x,y,1.1,a)).join('');
 // sinciciotrofoblasto com microvilosidades e vários núcleos, citotrofoblasto, estroma, endotélio
 b+=`<path d="M226 130H610V158H226Z" fill="#c9a6cf" stroke="#8e6b97" stroke-width="1.6"/>`+Array.from({length:38},(_,k)=>`<path d="M${232+k*10} 130v-6" stroke="#8e6b97" stroke-width="2"/>`).join('');
 b+=[262,330,402,470,540,596].map(x=>`<ellipse cx="${x}" cy="144" rx="8" ry="5" fill="#7b5a8a"/>`).join('');
 b+=`<path d="M226 158H610V196H226Z" fill="#efe6d4" stroke="#c9b997" stroke-width="1"/>`+[[300,176],[420,182],[520,172]].map(([x,y])=>`<path d="M${x-14} ${y}q14 -10 28 0" fill="none" stroke="#b9a578" stroke-width="2"/>`).join('');
 b+=`<path d="M226 196H610V212H226Z" fill="#e2b8a8" stroke="#a87a69" stroke-width="1.4"/>`+[280,400,520].map(x=>`<ellipse cx="${x}" cy="204" rx="16" ry="4" fill="#a8665a"/>`).join('');
 // capilar fetal
 b+=`<rect x="226" y="212" width="384" height="100" rx="0" fill="#f3e3ea" stroke="none"/><path d="M226 312H610" stroke="#a87a69" stroke-width="6"/>`;
 b+=[[270,250,6],[360,282,-8],[460,246,4],[560,280,-12]].map(([x,y,a])=>rbc(x,y,.95,a)).join('');
 // substâncias atravessando
 const up=dir===1;const mol=(x,y,k)=>k==='o2'?`<circle cx="${r1(x)}" cy="${r1(y)}" r="5.5" fill="#d94a4a" stroke="#962f2f"/>`:k==='gl'?`<polygon points="${[0,1,2,3,4,5].map(j=>r1(x+6*Math.cos(j*Math.PI/3))+','+r1(y+6*Math.sin(j*Math.PI/3))).join(' ')}" fill="${IC.gold}" stroke="${IC.goldS}"/>`:k==='co2'?`<circle cx="${r1(x)}" cy="${r1(y)}" r="5.5" fill="#7b8794" stroke="#4f5964"/>`:`<rect x="${r1(x-5)}" y="${r1(y-5)}" width="10" height="10" rx="2" fill="#9a7bb0" stroke="#664a7a"/>`;
 const kinds=up?['co2','ur','co2']:['o2','gl','o2'];
 kinds.forEach((k,j)=>{const x=320+j*90,ya=up?270:84,yb=up?84:270,u=Math.min(1,Math.max(0,t*1.3-j*.15));b+=mol(x,ya+(yb-ya)*u,k);});
 b+=ar([[594,up?280:70],[594,up?70:280]],up?'#4f5964':'#b2402f',2.4);
 b+=T(418,334,up?'cinza: gás carbônico · lilás: ureia e outros resíduos':'vermelho: oxigênio · hexágono: glicose',12);
 return b;}

// ---------- A9 · Produção e ejeção do leite ----------
function iLactation(i,t){
 const prod=i===1,ej=i===2;let b=`<g transform="translate(-300 -10) scale(1)">`+iBreast({milk:1,eject:ej?t:0})+`</g>`;
 // ampliação de um alvéolo
 b+=`<path d="M108 102L380 64M108 120L380 300" stroke="#9aa3a8" stroke-width="1.2" stroke-dasharray="4 3"/><circle cx="100" cy="110" r="22" fill="none" stroke="#7a5a2a" stroke-width="1.6"/>`;
 b+=`<rect x="380" y="40" width="248" height="290" rx="18" fill="#f6f3ec" stroke="#ddd6c6"/>`;
 const cx=500,cy=176,R=78;
 b+=`<path d="M${cx+R-6} ${cy+14}Q${cx+R+40} ${cy+40} 600 300" fill="none" stroke="#b78769" stroke-width="22"/><path d="M${cx+R-6} ${cy+14}Q${cx+R+40} ${cy+40} 600 300" fill="none" stroke="#fdf7ea" stroke-width="12"/>`;
 b+=`<path d="M${cx-R-14} ${cy+60}Q${cx-40} ${cy+R+30} ${cx+30} ${cy+R+16}" fill="none" stroke="${IC.blood}" stroke-width="5"/>`;
 b+=`<circle cx="${cx}" cy="${cy}" r="${R}" fill="#e4b9a4" stroke="#9c6650" stroke-width="2"/>`;
 b+=Array.from({length:14},(_,k)=>{const a=k/14*Math.PI*2,x=cx+(R-16)*Math.cos(a),y=cy+(R-16)*Math.sin(a);return `<path d="M${r1(cx+R*Math.cos(a-.2))} ${r1(cy+R*Math.sin(a-.2))}L${r1(cx+(R-30)*Math.cos(a-.2))} ${r1(cy+(R-30)*Math.sin(a-.2))}" stroke="#b9826c" stroke-width="1.2"/><circle cx="${r1(x)}" cy="${r1(y)}" r="5" fill="${IC.nuc}"/>`;}).join('');
 b+=`<circle cx="${cx}" cy="${cy}" r="${R-30}" fill="#fffaf0" stroke="#c99f86" stroke-width="1.6"/>`;
 const drops=prod?Math.round(4+8*t):8;b+=Array.from({length:drops},(_,k)=>{const a=k*2.4,rr=12+(k%3)*10;return `<circle cx="${r1(cx+rr*Math.cos(a)-(ej?14*t:0))}" cy="${r1(cy+rr*Math.sin(a))}" r="4.4" fill="#fffdf4" stroke="#d1bb92"/>`;}).join('');
 if(prod)b+=Array.from({length:5},(_,k)=>{const a=k*1.26;return `<circle cx="${r1(cx+(R-24-10*t)*Math.cos(a))}" cy="${r1(cy+(R-24-10*t)*Math.sin(a))}" r="3" fill="#fffdf4" stroke="#d1bb92"/>`;}).join('');
 // células mioepiteliais (em cesto) em torno do alvéolo
 const sq=ej?1-.06*Math.sin(t*Math.PI):1;
 b+=Array.from({length:7},(_,k)=>{const a=k/7*Math.PI*2+.2;return `<path d="M${r1(cx+(R+3)*sq*Math.cos(a-.35))} ${r1(cy+(R+3)*sq*Math.sin(a-.35))}A${R+3} ${R+3} 0 0 1 ${r1(cx+(R+3)*sq*Math.cos(a+.35))} ${r1(cy+(R+3)*sq*Math.sin(a+.35))}" fill="none" stroke="${ej?'#7b3b5c':'#b77aa0'}" stroke-width="${ej?6:4}" stroke-linecap="round"/>`;}).join('');
 if(ej)b+=Array.from({length:3},(_,k)=>{const u=(t+k/3)%1;return `<circle cx="${r1(cx+R+4+18*u)}" cy="${r1(cy+24+96*u)}" r="4.4" fill="#fffdf4" stroke="#d1bb92"/>`;}).join('');
 b+=T(504,318,prod?'prolactina (adenoipófise) → produção':'ocitocina (neuroipófise) → contração',12,{w:700,c:prod?'#3f6d8c':'#7b3b5c'});
 b+=lk(130,96,200,30,1)+lk(232,176,250,330,2)+lk(cx+R-2,cy-20,612,98,3)+lk(cx+R-40,cy-30,400,72,4)+lk(cx-30,cy+10,398,250,5);
 return b;}
const LACT_LABELS=['Alvéolos mamários (lóbulos): produção de leite','Ductos lactíferos: caminho até o mamilo','Células mioepiteliais: contraem-se sob ação da ocitocina','Células secretoras (lactócitos) que revestem o alvéolo','Luz do alvéolo, onde o leite se acumula'];

// ---------- A10 · Mecanismos de prevenção ----------
function iMethod(i){
 let b='',labels=[];
 if(i===0){
  b+=`<path d="M276 300C270 300 268 292 270 286L272 110C272 84 292 70 320 70C348 70 368 84 368 110L370 286C372 292 370 300 364 300" fill="#e6f1ee" stroke="#16705d" stroke-width="3.5"/>`;
  b+=`<path d="M308 72C306 52 312 40 320 40C328 40 334 52 332 72" fill="#e6f1ee" stroke="#16705d" stroke-width="3"/>`;
  b+=`<ellipse cx="320" cy="300" rx="56" ry="11" fill="#d2e6e0" stroke="#16705d" stroke-width="7"/>`;
  b+=`<path d="M282 108Q320 82 358 108V146Q320 156 282 146Z" fill="#f4f1e4" opacity=".9"/>`+[[300,108,-80],[322,104,-95],[342,112,-110],[312,124,-70]].map(([x,y,a])=>iSperm(x,y,a,.62)).join('');
  b+=[[178,140],[160,204],[192,256]].map(([x,y])=>`<g opacity=".5">${iSperm(x,y,0,.9)}</g>`).join('')+`<path d="M230 120V280" stroke="#16705d" stroke-width="2" stroke-dasharray="6 5"/>`;
  b+=lk(368,190,440,190,1)+lk(340,120,440,60,2)+lk(320,306,440,312,3);
  labels=['Preservativo externo: película que forma barreira; esquema sem demonstração de uso','Sêmen retido no interior, junto ao reservatório da ponta: não chega ao trato genital','Borda enrolada na base. O preservativo interno também é um método de barreira'];}
 if(i===1){
  b+=`<ellipse cx="180" cy="176" rx="118" ry="86" fill="#e8cfa9" stroke="#a7845a" stroke-width="2.4"/>`+[[110,140],[150,210],[210,130],[240,200],[180,170],[120,190]].map(([x,y])=>iSmallFoll(x,y,9)).join('');
  b+=`<path d="M300 176h50" stroke="#b5aaa0" stroke-width="3" stroke-dasharray="5 5"/><path d="M314 156l24 40M338 156l-24 40" stroke="#a3336b" stroke-width="5" stroke-linecap="round"/>`;
  b+=`<path d="M430 60H520V140C520 180 506 200 498 240V320H452V240C444 200 430 180 430 140Z" fill="#d69aa8" stroke="#975d6b" stroke-width="2.4"/><path d="M466 230H484V320H466Z" fill="#f4dfe2"/>`;
  b+=Array.from({length:6},(_,k)=>`<path d="M468 ${236+k*14}q6 -8 14 0" fill="none" stroke="#b9c6d6" stroke-width="3"/>`).join('')+iSperm(474,340,-90,.8);
  b+=T(475,110,'útero',12,{c:'#7d3b4c'})+T(530,300,'colo',12,{a:'start'})+lk(150,120,60,60,1)+lk(326,176,326,90,2)+lk(476,262,590,262,3);
  labels=['Ovário: os folículos não completam o desenvolvimento (exemplo de efeito hormonal)','Ovulação inibida em muitos ciclos','Colo do útero: muco mais espesso dificulta a passagem dos espermatozoides'];}
 if(i===2){
  b+=iUterusFront({x:320,y:170,s:1.25,folls:false});
  b+=`<path d="M320 120V196" stroke="#f3eee6" stroke-width="7" stroke-linecap="round"/><path d="M294 112Q320 122 346 112" fill="none" stroke="#f3eee6" stroke-width="6" stroke-linecap="round"/>`;
  b+=`<path d="M320 120V196M294 112Q320 122 346 112" fill="none" stroke="#7c8a93" stroke-width="2.2" stroke-linecap="round"/>`+Array.from({length:9},(_,k)=>`<path d="M315 ${128+k*7.5}h10" stroke="#c4742f" stroke-width="3"/>`).join('');
  b+=`<path d="M318 198Q316 240 314 300M322 198Q324 240 326 300" fill="none" stroke="#5b6b73" stroke-width="1.4"/>`+iSperm(330,170,120,.7)+iSperm(300,150,60,.7);
  b+=lk(322,150,440,120,1)+lk(326,280,440,300,2)+lk(320,110,200,70,3);
  labels=['DIU de cobre na cavidade uterina: haste e braços em T; fio de cobre (laranja) na haste','Fios que passam pelo colo, usados no acompanhamento','O cobre prejudica a função e a movimentação dos espermatozoides, dificultando a fecundação'];}
 if(i===3){
  // vasectomia
  b+=`<ellipse cx="150" cy="240" rx="40" ry="56" fill="${IC.gold}" stroke="${IC.goldS}" stroke-width="2"/><path d="M178 196C196 210 198 260 182 290" fill="none" stroke="#c98a5f" stroke-width="11" stroke-linecap="round"/>`;
  b+=`<path d="M184 292Q214 296 214 250V178" fill="none" stroke="#b97f5c" stroke-width="7"/><path d="M214 150V64" stroke="#b97f5c" stroke-width="7"/><path d="M206 178h16M206 150h16" stroke="#3b4952" stroke-width="3"/>`+T(150,330,'vasectomia',13,{w:700});
  // laqueadura
  b+=iUterusFront({x:470,y:190,s:.95,folls:true})+`<path d="M392 120l12 12M404 120l-12 12M548 120l-12 12M536 120l12 12" stroke="#3b4952" stroke-width="3"/>`+T(470,330,'laqueadura',13,{w:700});
  b+=lk(214,164,280,120,1)+lk(398,126,360,60,2)+lk(150,240,80,300,3);
  labels=['Vasectomia: segmento de cada ducto deferente é interrompido; o sêmen continua sendo produzido, sem espermatozoides','Laqueadura: interrupção das duas tubas uterinas, impedindo o encontro dos gametas','Testículos e ovários continuam produzindo hormônios'];}
 if(i===4){
  const cal=(x,hl,lab)=>`<rect x="${x}" y="70" width="250" height="210" rx="14" fill="var(--surface)" stroke="#899a94" stroke-width="2"/><path d="M${x} 104H${x+250}" stroke="#899a94" stroke-width="2"/>`+T(x+125,94,lab,13,{w:700})+Array.from({length:35},(_,k)=>`<rect x="${x+12+k%7*33}" y="${114+Math.floor(k/7)*32}" width="28" height="26" rx="5" fill="${hl.includes(k)?'#d9e8e1':'#ecebe5'}" stroke="${hl.includes(k)?'#16705d':'none'}"/>`).join('');
  b+=cal(50,[11,12,13,14,15],'Ciclo de 28 dias')+cal(340,[17,18,19,20,21],'Ciclo de 35 dias');
  b+=T(320,312,'a mesma regra de contagem aponta janelas diferentes quando o ciclo varia',13);
  b+=lk(70,92,30,40,1)+lk(560,92,610,40,2);
  labels=['Calendário: registro de dias, não observação direta da ovulação','Em outro ciclo, a janela estimada muda. Métodos de percepção da fertilidade envolvem sinais corporais e orientação; contar dias isoladamente não confirma a ovulação'];}
 return {body:b,labels,alt:'Esquema do mecanismo: '+['Preservativo','Métodos hormonais','DIU de cobre','Métodos cirúrgicos','Métodos comportamentais'][i]};}

// ---------- A11 · Agentes de ISTs (morfologia esquemática) ----------
function iAgent(i){
 let b='',labels=[];const cx=320,cy=176;
 const spikes=(r,n,len,c,knob)=>Array.from({length:n},(_,k)=>{const a=k/n*Math.PI*2;return `<path d="M${r1(cx+r*Math.cos(a))} ${r1(cy+r*Math.sin(a))}L${r1(cx+(r+len)*Math.cos(a))} ${r1(cy+(r+len)*Math.sin(a))}" stroke="${c}" stroke-width="4" stroke-linecap="round"/>`+(knob?`<circle cx="${r1(cx+(r+len+3)*Math.cos(a))}" cy="${r1(cy+(r+len+3)*Math.sin(a))}" r="5" fill="${c}"/>`:'');}).join('');
 const hexa=(r,f,st)=>`<polygon points="${[0,1,2,3,4,5].map(j=>r1(cx+r*Math.cos(j*Math.PI/3+Math.PI/6))+','+r1(cy+r*Math.sin(j*Math.PI/3+Math.PI/6))).join(' ')}" fill="${f}" stroke="${st}" stroke-width="3"/>`;
 if(i===0){
  b+=spikes(112,22,14,'#7b5a8a',false)+`<circle cx="${cx}" cy="${cy}" r="112" fill="#efe3f1" stroke="#8f719b" stroke-width="7"/><circle cx="${cx}" cy="${cy}" r="96" fill="#e3d4c4" opacity=".7"/>`;
  b+=hexa(66,'#c5c5dd','#5f5f88')+`<path d="M${cx-30} ${cy}c10 -30 30 30 40 0s30 30 20 0" fill="none" stroke="#a3336b" stroke-width="3"/>`;
  b+=lk(cx+112,cy-40,560,90,1)+lk(cx-84,cy+40,90,270,2)+lk(cx+40,cy+40,560,280,3)+lk(cx,cy,90,80,4);
  labels=['Envelope lipídico com glicoproteínas (espículas)','Tegumento: camada de proteínas entre envelope e capsídeo','Capsídeo icosaédrico','DNA de fita dupla'];}
 if(i===1){
  b+=hexa(96,'#d9dbe9','#5f5f88')+Array.from({length:19},(_,k)=>{const rr=k===0?0:k<7?34:68,a=k===0?0:k<7?(k-1)/6*Math.PI*2:(k-7)/12*Math.PI*2;return [0,1,2,3,4].map(j=>uCircle(r1(cx+rr*Math.cos(a)+7*Math.cos(j*1.256)),r1(cy+rr*Math.sin(a)+7*Math.sin(j*1.256)),4,'#8c8fb8')).join('');}).join('');
  b+=lk(cx+90,cy-20,560,90,1)+lk(cx+34,cy,560,280,2);
  labels=['Capsídeo icosaédrico sem envelope (vírus “nu”)','Capsômeros: grupos de cinco proteínas (L1) na superfície; dentro, DNA circular de fita dupla'];}
 if(i===2){
  const sp=(x0,y0,len,a)=>{let d=`M0 0`;for(let k=0;k<len;k++)d+=`q4 -7 8 0t8 0`;return `<g transform="translate(${x0} ${y0}) rotate(${a})"><path d="${d}" fill="none" stroke="#6e4c7d" stroke-width="4.4" stroke-linecap="round"/><path d="${d}" fill="none" stroke="#d6c3df" stroke-width="1.6" stroke-linecap="round"/><path d="M3 1.5H${len*16-3}" stroke="#a3336b" stroke-width="1.2" stroke-dasharray="2 3"/></g>`;};
  b+=`<rect x="70" y="70" width="500" height="210" rx="16" fill="#f4eef0" stroke="#d7c6cc"/>`+sp(100,120,8,-6)+sp(120,236,7,8)+sp(250,170,9,-14)+rbc(440,180,4.2,10);
  b+=lk(180,112,180,40,1)+lk(300,158,300,312,2)+lk(470,200,580,312,3);
  labels=['Treponema pallidum: bactéria espiralada (espiroqueta), muito fina e com espiras regulares','Flagelos internos (endoflagelos), entre as membranas, produzem o movimento','Hemácia na mesma escala (cerca de 7 µm): a bactéria tem comprimento parecido, mas é muito mais fina'];}
 if(i===3){
  b+=spikes(100,14,18,'#5b7a5a',true)+`<circle cx="${cx}" cy="${cy}" r="100" fill="#efe3f1" stroke="#8f719b" stroke-width="7"/><circle cx="${cx}" cy="${cy}" r="84" fill="none" stroke="#c7a9cf" stroke-width="6"/>`;
  b+=`<path d="M${cx-14} ${cy-62}L${cx+14} ${cy-62}L${cx+44} ${cy+56}L${cx-44} ${cy+56}Z" fill="#c5c5dd" stroke="#5f5f88" stroke-width="3" stroke-linejoin="round"/>`;
  b+=`<path d="M${cx-10} ${cy-40}c10 14 -10 28 0 42s-10 28 0 40M${cx+8} ${cy-40}c10 14 -10 28 0 42s-10 28 0 40" fill="none" stroke="#a3336b" stroke-width="2.4"/>`+uCircle(cx-22,cy+38,5,'#d39b2a')+uCircle(cx+22,cy+38,5,'#d39b2a');
  b+=lk(cx+82,cy-58,560,90,1)+lk(cx-84,cy+20,90,270,2)+lk(cx-30,cy+50,90,80,3)+lk(cx,cy+10,560,280,4);
  labels=['Envelope com glicoproteínas gp120/gp41, que se ligam a receptores (como CD4) de linfócitos','Matriz proteica sob o envelope','Capsídeo cônico com enzimas, como a transcriptase reversa (amarelo)','Duas cópias de RNA (genoma)'];}
 b+=T(320,338,i===2?'bactérias e hemácia em escala aproximada; o painel não é uma imagem de microscópio':'esquema sem escala: vírus medem dezenas a centenas de nanômetros',11,{c:'#7f8a94'});
 return {body:b,labels,alt:'Esquema da estrutura do agente; não é uma imagem diagnóstica'};}

// ---------- A12 · Cena de conversa ----------
function iPerson(x,skin,shirt,hair,o={}){
 const {back=0,arm=0}=o;let b=`<g transform="translate(${x+back} 0)">`;
 b+=`<path d="M-44 300V196C-44 170 -26 156 0 156C26 156 44 170 44 196V300Z" fill="${shirt}"/>`;
 b+=`<path d="M-40 182C-58 210 -60 248 -52 270" fill="none" stroke="${shirt}" stroke-width="18" stroke-linecap="round"/>`;
 b+=arm===1?`<path d="M40 182C64 176 76 150 74 126" fill="none" stroke="${shirt}" stroke-width="18" stroke-linecap="round"/><circle cx="74" cy="118" r="11" fill="${skin}"/>`:arm===2?`<path d="M40 182C70 186 92 178 108 170" fill="none" stroke="${shirt}" stroke-width="18" stroke-linecap="round"/><circle cx="114" cy="166" r="10" fill="${skin}"/>`:`<path d="M40 182C58 210 60 248 52 270" fill="none" stroke="${shirt}" stroke-width="18" stroke-linecap="round"/>`;
 b+=`<rect x="-9" y="134" width="18" height="24" fill="${skin}"/><ellipse cx="0" cy="112" rx="28" ry="32" fill="${skin}"/>`+hair;
 b+=`<circle cx="-10" cy="112" r="2.6" fill="#2b2b2b"/><circle cx="10" cy="112" r="2.6" fill="#2b2b2b"/><path d="M-8 126q8 5 16 0" fill="none" stroke="#5a3a2e" stroke-width="2" stroke-linecap="round"/>`;
 return b+'</g>';}
function iPeople(i,t){
 let b='';
 const h1=`<path d="M-30 106C-32 80 -14 72 0 72C18 72 32 82 30 106C24 92 -22 92 -30 106Z" fill="#2e2420"/>`,h2=`<path d="M-30 110C-34 76 -10 70 4 72C26 74 34 92 30 122L28 150C24 130 22 104 0 96C-14 96 -24 110 -30 130Z" fill="#6b4630"/>`,h3=`<path d="M-30 104C-36 70 36 70 30 104C34 80 18 70 0 70S-36 80 -30 104Z" fill="#1d1a19"/>`+[-24,-12,0,12,24].map(x=>`<circle cx="${x}" cy="${78}" r="9" fill="#1d1a19"/>`).join('');
 b+=iPerson(150,'#8d6046','#7594a5',h1,{arm:i===0?1:0})+iPerson(320,'#d8a989','#a383a5',h2,{arm:i===1?1:0,back:i===1?14*t:0})+iPerson(490,'#634c42','#859969',h3,{arm:i===3?1:0});
 const bub=(x,y,w,s)=>`<rect x="${x}" y="${y}" width="${w}" height="38" rx="15" fill="#e3edf0" stroke="#b8cbd1"/><path d="M${x+30} ${y+38}l8 12l8 -12" fill="#e3edf0"/>`+T(x+w/2,y+25,s,15,{c:'#1a1f2b'});
 if(i===0)b+=bub(84,22,152,'Vamos conversar?');
 if(i===1)b+=bub(256,22,128,'Agora não.');
 if(i===2)b+=bub(70,22,200,'Tudo bem, eu respeito.')+uArrow(190,322,450,322,UCOL.green)+uText(320,344,'Escutar e respeitar limites',15);
 if(i===3)b+=bub(408,22,186,'Conte comigo.')+uText(320,340,'Apoio sem exposição',16);
 return b;}
