import re
for f in ['genetica','ecologia','celulas','microcosmo']:
    p=f'src/sites/{f}.html';t=open(p).read()
    m=re.search(r"const store=\{get\(k,d\)\{try\{const v=localStorage\.getItem\((.+?)\+k\);.*?\}\}\};",t)
    assert m,f
    pfx=m.group(1)
    add=("\n// Registro de quais chaves cada aula usa, para o botão “Recomeçar esta aula”\n"
     "const RST={cur:null,glob:new Set()};(function(){const g=store.get,st=store.set;"
     "const note=k=>{k=String(k);if(k.startsWith('__'))return;if(!RST.cur){RST.glob.add(k);return;}if(RST.glob.has(k))return;const K='__keys-'+RST.cur;const L=g.call(store,K,[]);if(!L.includes(k)){L.push(k);st.call(store,K,L);}};"
     "store.get=function(k,d){note(k);return g.call(store,k,d);};store.set=function(k,v){note(k);st.call(store,k,v);};"
     "store.del=function(k){try{localStorage.removeItem("+pfx+"+k)}catch(e){}};})();\n"
     "function addReset(id){const sec=document.getElementById(id);const hd=sec&&sec.querySelector('.aula-head');if(!hd||hd.querySelector('.btn-reset'))return;"
     "const b=h('button',{class:'btn ghost sm btn-reset',type:'button',style:'margin-top:12px;align-self:flex-start'},'↺ Recomeçar esta aula');"
     "b.onclick=()=>{if(!confirm('Apagar as respostas e os resultados desta aula neste aparelho e começar de novo?\\n\\nFichas que você já enviou ao professor continuam na planilha dele.'))return;"
     "const L=store.get('__keys-'+id,[]);L.forEach(k=>store.del(k));store.del('__keys-'+id);sec.innerHTML='';inited[id]=false;go(id);};"
     "const tx=hd.querySelector('.lede')||hd.lastElementChild;tx.after(b);}\n")
    t=t[:m.end()]+add+t[m.end():]
    # go: set current lesson
    o="function go(id){\n  if(!document.getElementById(id))id='inicio';\n"
    assert t.count(o)==1,f
    t=t.replace(o,o+"  RST.cur=(typeof INIT!=='undefined'&&INIT[id])?id:null;\n")
    # call addReset after abertura
    n=t.count("abertura(id);}")
    assert n==1,(f,n)
    t=t.replace("abertura(id);}","abertura(id);addReset(id);}")
    open(p,'w').write(t)
    print(f,'ok',pfx)
