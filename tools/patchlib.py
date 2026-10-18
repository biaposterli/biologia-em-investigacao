import pathlib, sys, re
class P:
    def __init__(s, path):
        s.path = pathlib.Path(path); s.t = s.path.read_text(encoding='utf-8'); s.n = 0
    def rep(s, old, new, count=1):
        k = s.t.count(old)
        if (count is not None and k != count) or k == 0:
            sys.exit(f'[{s.path.name}] esperado {count}, achei {k}: {old[:110]!r}')
        s.t = s.t.replace(old, new); s.n += 1
    def cut(s, start, end, new, include_end=False):
        i = s.t.index(start); j = s.t.index(end, i)
        if include_end: j += len(end)
        s.t = s.t[:i] + new + s.t[j:]; s.n += 1
    def save(s):
        s.path.write_text(s.t, encoding='utf-8'); print(s.path.name, s.n, 'alterações')
QUIZ_TMPL = r'''  let qi=0,resp=store.get('qz-resp',{});const qcard=h('div',{class:'panel stack',style:'padding:24px'});const qstats=h('div',{class:'stats'});
  function q(){const it=QZ[qi];const t=it[0],o=it[1],c=it[2],e=it[3];const done=Object.prototype.hasOwnProperty.call(resp,qi);qcard.innerHTML='';
    qcard.append(h('div',{class:'row',style:'justify-content:space-between'},h('span',{class:'eyebrow'},`Pergunta ${qi+1} de ${QZ.length}`),h('span',{class:'pill'+(done?' ok':'')},done?'Respondida':'Não respondida')));
    const qil=__IL__;const qt=h('h3',{style:'font-size:clamp(1.2rem,2.4vw,1.8rem)'},t);qcard.append(qil?h('div',{class:'quiz-q'},qil,qt):qt);
    const og=h('div',{style:'display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:10px'});
    o.forEach((a,j)=>{const b=h('button',{class:'tool-card',style:`min-height:0;flex-direction:row;align-items:center;gap:12px;font-size:1.05rem;${done&&j===c?'border-color:var(--good);background:var(--good-soft)':''}${done&&j===resp[qi]&&j!==c?'border-color:var(--bad);background:var(--bad-soft)':''}`,disabled:done},h('span',{class:'mono',style:'font-weight:700;color:var(--tema)'},'ABCD'[j]),h('span',{},a));b.onclick=()=>{resp[qi]=j;store.set('qz-resp',resp);q();};og.append(b);});qcard.append(og);
    if(done)qcard.append(h('div',{class:'fb '+(resp[qi]===c?'ok':'info')},h('strong',{},resp[qi]===c?'Resposta correta. ':'Vamos revisar: a resposta é '+'ABCD'[c]+'. '),e));
    qcard.append(h('div',{class:'row',style:'justify-content:space-between'},h('button',{class:'btn',disabled:qi===0,onclick:()=>{qi--;q();}},'← Anterior'),h('button',{class:'btn primary',disabled:qi===QZ.length-1,onclick:()=>{qi++;q();}},'Próxima →')));
    const n=Object.keys(resp).length,ok=Object.entries(resp).filter(([k,a])=>QZ[k]&&QZ[k][2]===a).length;qstats.innerHTML='';[['Respondidas',n+'/'+QZ.length],['Acertos na 1ª tentativa',String(ok)]].forEach(([a,b])=>qstats.append(h('div',{class:'stat'},h('span',{class:'note'},a),h('span',{class:'big-num'},b))));}
  const qside=h('div',{class:'panel stack'},h('h3',{},'Seu percurso'),qstats,h('button',{class:'btn ghost sm',style:'align-self:flex-start',onclick:()=>{resp={};store.set('qz-resp',resp);qi=0;q();}},'Recomeçar o quiz'),h('p',{class:'note'},'Toque numa alternativa para ver se acertou e ler a explicação. Vale a primeira resposta.'));
'''
