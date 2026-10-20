/* Biologia em Investigação · núcleo compartilhado do portal
   Guarda a turma (vinda do link ou do código do professor), a identificação do estudante
   e monta a faixa de navegação entre os sites. Carregado por todas as páginas.
   Estudantes: cada aparelho pode ter vários estudantes (computador ou tablet compartilhado).
   Cada um tem o seu espaço de respostas. O primeiro estudante do aparelho ("p0") usa as chaves
   antigas (por exemplo "gen-draft-Aula 01"), então nada do que já foi respondido é movido ou apagado;
   os demais usam chaves com o seu código ("gen-@e1abc-draft-Aula 01"). */
window.__biErros=[];try{addEventListener('error',function(e){window.__biErros.push((e.message||'erro')+' (linha '+e.lineno+')');});}catch(e){}
(function(){
  'use strict';
  // Endereço público do portal (ex.: https://biologia-investigacao.pages.dev/). Usado para gerar o link das turmas
  // quando a área do professor é aberta dentro do Claude. Fora do Claude, o endereço é detectado sozinho.
  var PORTAL_URL='';

  var SITES={
    cie:{id:'cie',nome:'Ciência em Investigação',curto:'Ciência',file:'ciencia.html',cor:'#5b45a3',chave:'cie'},
    eco:{id:'eco',nome:'Ecologia em Investigação',curto:'Ecologia',file:'ecologia.html',cor:'#1d6b58',chave:'eco'},
    cel:{id:'cel',nome:'Células em Ação',curto:'Células',file:'celulas.html',cor:'#a3601b',chave:'cel'},
    gen:{id:'gen',nome:'Genética em Investigação',curto:'Genética',file:'genetica.html',cor:'#a3336b',chave:'gen'},
    mic:{id:'mic',nome:'Microcosmo',curto:'Microcosmo',file:'microcosmo.html',cor:'#2c58a5',chave:'micro'}
  };
  var ORDER=['cie','mic','cel','eco','gen'];
  var K_TURMA='bi-turma',K_ID='bi-ident',K_PROF='bi-prof',K_PERFIS='bi-perfis',K_QUEM='bi-quem';

  function lsGet(k,d){try{var v=localStorage.getItem(k);return v?JSON.parse(v):d;}catch(e){return d;}}
  function lsSet(k,v){try{if(v==null)localStorage.removeItem(k);else localStorage.setItem(k,JSON.stringify(v));}catch(e){}}
  function b64e(str){var b=btoa(unescape(encodeURIComponent(str)));return b.replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');}
  function b64d(s){s=String(s).replace(/-/g,'+').replace(/_/g,'/');while(s.length%4)s+='=';return decodeURIComponent(escape(atob(s)));}

  // ---------- Receptor (Google Apps Script) ----------
  function idDoReceptor(url){var m=String(url||'').trim().match(/script\.google\.com\/(?:a\/[^\/]+\/)?macros\/s\/([A-Za-z0-9_-]{20,})\/(?:exec|dev)/);return m?m[1]:'';}
  function urlDoReceptor(id){return /^[A-Za-z0-9_-]{20,}$/.test(id||'')?'https://script.google.com/macros/s/'+id+'/exec':'';}

  // ---------- Turma (o que o estudante recebe do professor) ----------
  function limpa(s,max){return String(s==null?'':s).replace(/[\u0000-\u001f<>]/g,'').trim().slice(0,max);}
  function validaTurma(c){
    if(!c||typeof c!=='object')return null;
    var r=String(c.r||'');if(!/^[A-Za-z0-9_-]{20,}$/.test(r))return null;
    var t=Array.isArray(c.t)?c.t.map(function(x){return limpa(x,20);}).filter(Boolean).slice(0,40):[];
    var g=Math.max(0,Math.min(20,parseInt(c.g,10)||0));
    return {v:1,n:limpa(c.n,60)||'seu professor',e:limpa(c.e,80),r:r,t:t,g:g};
  }
  function codigoDaTurma(c){var v=validaTurma(c);return v?b64e(JSON.stringify({v:1,n:v.n,e:v.e,r:v.r,t:v.t,g:v.g})):'';}
  function lerCodigo(texto){
    var s=String(texto||'').trim();if(!s)return null;
    var m=s.match(/[?&#]turma=([A-Za-z0-9_-]+)/);if(m)s=m[1];
    s=s.replace(/\s+/g,'');
    try{return validaTurma(JSON.parse(b64d(s)));}catch(e){return null;}
  }
  function turma(){return validaTurma(lsGet(K_TURMA,null));}
  function definirTurma(c){var v=validaTurma(c);lsSet(K_TURMA,v);return v;}
  function sairDaTurma(){lsSet(K_TURMA,null);}

  // Chegou pelo link do professor? (?turma=CÓDIGO)
  (function(){try{
    var p=new URLSearchParams(location.search);var t=p.get('turma');if(!t)return;
    var c=lerCodigo(t);if(c){definirTurma(c);window.__biTurmaNova=true;}
    p.delete('turma');var q=p.toString();
    history.replaceState(null,'',location.pathname+(q?'?'+q:'')+location.hash);
  }catch(e){}})();

  // ---------- Estudantes deste aparelho ----------
  function idOk(id){return /^(p0|e[a-z0-9]{4,15})$/.test(String(id||''));}
  function perfis(){
    var p=lsGet(K_PERFIS,null);
    if(!p||!Array.isArray(p.lista)||!p.lista.length){
      // Primeira vez com esta versão: quem já usava o aparelho vira o primeiro estudante, com tudo o que respondeu
      var i=lsGet(K_ID,null)||{};
      p={v:1,atual:'p0',lista:[{id:'p0',nome:limpa(i.nome,120),turma:limpa(i.turma,20),grupo:limpa(i.grupo,20)}]};
      lsSet(K_PERFIS,p);
    }
    p.lista=p.lista.filter(function(x){return x&&idOk(x.id);});
    if(!p.lista.some(function(x){return x.id==='p0';}))p.lista.unshift({id:'p0',nome:'',turma:'',grupo:''});
    if(!p.lista.some(function(x){return x.id===p.atual;}))p.atual='p0';
    return p;
  }
  // O estudante desta aba fica fixo até a página recarregar (trocar de estudante recarrega a página)
  var ATUAL=perfis().atual;
  function estudantes(){return perfis().lista.map(function(x){return {id:x.id,nome:x.nome||'',turma:x.turma||'',grupo:x.grupo||'',atual:x.id===ATUAL};});}
  function estudanteAtual(){var l=perfis().lista;for(var k=0;k<l.length;k++)if(l[k].id===ATUAL)return l[k];return l[0];}
  // Prefixo das respostas de um site para um estudante: pfx('gen') → "gen-" (primeiro estudante) ou "gen-@e1abc-"
  function pfx(chave,id){id=id||ATUAL;return id==='p0'?chave+'-':chave+'-@'+id+'-';}
  function trocarEstudante(id){var p=perfis();if(!p.lista.some(function(x){return x.id===id;}))return false;p.atual=id;lsSet(K_PERFIS,p);try{sessionStorage.setItem(K_QUEM,'1');}catch(e){}return true;}
  function novoEstudante(){var p=perfis();var id='e'+Date.now().toString(36).slice(-6)+Math.random().toString(36).slice(2,6);p.lista.push({id:id,nome:'',turma:'',grupo:''});p.atual=id;lsSet(K_PERFIS,p);try{sessionStorage.setItem(K_QUEM,'1');}catch(e){}return id;}
  // Tira um estudante do aparelho e apaga as respostas dele SÓ neste aparelho (as fichas enviadas continuam na planilha)
  function removerEstudante(id){
    if(id==='p0'||id===ATUAL)return false;var p=perfis();if(!p.lista.some(function(x){return x.id===id;}))return false;
    var marca='-@'+id+'-',apagar=[];
    try{for(var k=0;k<localStorage.length;k++){var c=localStorage.key(k);if(c&&c.indexOf(marca)>0)apagar.push(c);}apagar.forEach(function(c){localStorage.removeItem(c);});}catch(e){}
    p.lista=p.lista.filter(function(x){return x.id!==id;});lsSet(K_PERFIS,p);return true;
  }
  function nomeCurto(n){n=String(n||'').trim();return n?n.split(/\s+/)[0]:'';}

  // ---------- Identificação do estudante (vale para todos os sites) ----------
  function ident(){
    var i=estudanteAtual()||{nome:'',turma:'',grupo:''};
    var c=turma();
    var r={nome:i.nome||'',turma:i.turma||'',grupo:i.grupo||''};
    if(c&&c.t.length&&r.turma&&c.t.indexOf(r.turma)<0)r.turma='';
    if(c&&r.grupo&&grupos().indexOf(r.grupo)<0)r.grupo='';
    return r;
  }
  function saveIdent(i){
    var p=perfis();var v={nome:limpa(i.nome,120),turma:limpa(i.turma,20),grupo:limpa(i.grupo,20)};
    p.lista.forEach(function(x){if(x.id===ATUAL){x.nome=v.nome;x.turma=v.turma;x.grupo=v.grupo;}});
    lsSet(K_PERFIS,p);
    if(ATUAL==='p0')lsSet(K_ID,v); // mantém a chave antiga em dia
    try{window.dispatchEvent(new CustomEvent('bi-ident',{detail:v}));}catch(e){}
  }
  function grupos(){var c=turma();var n=c&&c.g?c.g:8;var a=[];for(var k=1;k<=n;k++)a.push(String(k));a.push('Sem grupo');return a;}
  function turmas(){var c=turma();return c?c.t.slice():[];}
  function escola(){var c=turma();return c&&c.e?c.e:'';}

  // ---------- Fichas ----------
  function site(){return SITES[window.PORTAL_SITE]||null;}
  function codeFor(siteId,raw){var s=SITES[siteId];var m=String(raw).match(/Aula\s*(\d+)\s*$/);var n=m?('0'+parseInt(m[1],10)).slice(-2):String(raw);return (s?s.curto:'Site')+' · Aula '+n;}
  function code(raw){return codeFor(window.PORTAL_SITE,raw);}
  function receiver(){var c=turma();return c?urlDoReceptor(c.r):'';}
  function sendLabel(){var c=turma();return c?'Enviar para '+c.n:'Enviar';}
  function offText(){return 'Esta ficha ainda não está ligada a uma turma. Abra o link que o seu professor compartilhou ou cole o código da turma no quadro acima. Enquanto isso, suas respostas ficam guardadas neste aparelho.';}

  function el(tag,attrs){var e=document.createElement(tag);attrs=attrs||{};Object.keys(attrs).forEach(function(k){var v=attrs[k];if(v==null||v===false)return;if(k==='class')e.className=v;else if(k==='text')e.textContent=v;else if(k.slice(0,2)==='on')e.addEventListener(k.slice(2),v);else e.setAttribute(k,v===true?'':v);});for(var i=2;i<arguments.length;i++){var c=arguments[i];if(c==null||c===false)continue;if(Array.isArray(c))c.forEach(function(x){if(x!=null)e.append(x);});else e.append(c.nodeType?c:document.createTextNode(String(c)));}return e;}

  // Caixa para colar o código ou o link da turma
  function caixaCodigo(onOk,{compact}={}){
    var inp=el('input',{type:'text',class:'bi-code-in',placeholder:'Cole aqui o link ou o código da turma','aria-label':'Link ou código da turma',autocomplete:'off',spellcheck:'false'});
    var msg=el('span',{class:'bi-code-msg',role:'status'});
    var btn=el('button',{type:'button',class:'btn primary sm'},'Entrar na turma');
    function go(){var c=lerCodigo(inp.value);if(!c){msg.textContent='Não reconheci esse código. Copie de novo a mensagem do professor, inteira.';msg.className='bi-code-msg err';return;}definirTurma(c);msg.className='bi-code-msg ok';msg.textContent='Pronto: turma de '+c.n+'.';if(onOk)onOk(c);}
    btn.onclick=go;inp.addEventListener('keydown',function(e){if(e.key==='Enter'){e.preventDefault();go();}});
    return el('div',{class:'bi-code'+(compact?' compact':'')},el('div',{class:'bi-code-row'},inp,btn),msg);
  }

  // Quadro no topo de cada ficha: para quem ela vai
  function fichaBanner(){
    var c=turma();var box=el('div',{class:'bi-banner'+(c?' on':'')});
    function draw(){
      box.innerHTML='';c=turma();box.className='bi-banner'+(c?' on':'');
      if(c){
        box.append(el('div',{class:'bi-banner-t'},el('span',{class:'bi-dot','aria-hidden':'true'}),el('span',{},'Esta ficha vai para ',el('strong',{},c.n),c.e?' · '+c.e:'')));
        var trocar=el('button',{type:'button',class:'btn ghost sm'},'Trocar de turma');
        trocar.onclick=function(){box.innerHTML='';box.append(el('p',{class:'bi-banner-t'},'Cole o link ou o código da nova turma.'),caixaCodigo(function(){setTimeout(function(){location.reload();},400);}),el('button',{type:'button',class:'btn ghost sm',onclick:draw},'Cancelar'));};
        box.append(trocar);
      }else{
        box.append(el('p',{class:'bi-banner-t'},el('strong',{},'Para enviar, entre na turma. '),'Abra o link que o seu professor compartilhou ou cole aqui o código da turma.'),caixaCodigo(function(){setTimeout(function(){location.reload();},400);}));
      }
    }
    draw();
    // Quem está respondendo (em aparelho compartilhado, cada estudante tem o seu espaço)
    var quem=el('div',{class:'bi-quem'});
    function drawQuem(){
      var e=estudanteAtual(),n=String(e&&e.nome||'').trim();quem.innerHTML='';
      quem.append(el('span',{class:'bi-av','aria-hidden':'true'},iniciais(n)),
        el('span',{class:'bi-quem-t'},n?['Respondendo como ',el('strong',{},n),'. '] : (window.PORTAL_ESTUDANTE?'Escreva o seu nome. ':'Escreva o seu nome abaixo. '),window.PORTAL_ESTUDANTE?null:el('a',{href:'estudante.html'},'Minha página')),
        el('button',{type:'button',class:'btn ghost sm',onclick:function(){escolherEstudante({titulo:'Quem vai responder?'});}},'Não é você? Trocar'));
    }
    drawQuem();window.addEventListener('bi-ident',drawQuem);
    return el('div',{class:'bi-fb'},box,quem,caixaNuvem());
  }

  // Seletor de turma da ficha (usa o seletor de botões do próprio site)
  function turmaCtl(seg,ident,onChange){
    var t=turmas();
    if(!t.length)return el('span',{class:'note bi-turma-off'},'Definida pelo link do professor');
    return seg(t.map(function(x){return [x,x];}),ident.turma||null,onChange,{label:'Turma'});
  }

  // ---------- Respostas guardadas na planilha do professor (nome + senha de 4 números) ----------
  // Só as fichas vão para a nuvem (rascunho, envio, previsão), não o estado dos simuladores.
  var K_NUVEM_MSG='bi-nuvem-msg';
  function normNome(s){return String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/\s+/g,' ').trim();}
  function nomeOk(n){return String(n||'').trim().split(/\s+/).filter(Boolean).length>=2;}
  function atualizarPerfil(fn){var p=perfis();p.lista.forEach(function(x){if(x.id===ATUAL)fn(x);});lsSet(K_PERFIS,p);}
  function coletar(){
    var out={};
    Object.keys(SITES).forEach(function(k){
      var pre=pfx(SITES[k].chave),o={};
      try{for(var i=0;i<localStorage.length;i++){var c=localStorage.key(i);if(!c||c.indexOf(pre)!==0)continue;var r=c.slice(pre.length);if(r.charAt(0)==='@')continue;if(/^(draft|sent|sid|prev)-/.test(r))o[r]=localStorage.getItem(c);}}catch(e){}
      if(Object.keys(o).length)out[SITES[k].chave]=o;
    });
    return out;
  }
  // Junta o que veio da planilha com o que já está no aparelho: nada que está aqui é apagado
  function aplicar(dados){
    var n=0;
    Object.keys(SITES).forEach(function(k){
      var ch=SITES[k].chave,o=dados&&dados[ch];if(!o||typeof o!=='object')return;var pre=pfx(ch);
      Object.keys(o).forEach(function(r){
        if(!/^(draft|sent|sid|prev)-/.test(r)||typeof o[r]!=='string')return;
        var cur=null;try{cur=localStorage.getItem(pre+r);}catch(e){}
        if(cur==null){try{localStorage.setItem(pre+r,o[r]);n++;}catch(e){}return;}
        if(/^draft-/.test(r)){try{var a=JSON.parse(cur)||{},b=JSON.parse(o[r])||{},mud=false;Object.keys(b).forEach(function(q){if(!String(a[q]||'').trim()&&String(b[q]||'').trim()){a[q]=b[q];mud=true;}});if(mud){localStorage.setItem(pre+r,JSON.stringify(a));n++;}}catch(e){}}
      });
    });
    return n;
  }
  function hash(s){var h=5381;for(var i=0;i<s.length;i++)h=((h<<5)+h+s.charCodeAt(i))|0;return String(h>>>0);}
  async function api(acao,corpo,keep){
    var url=receiver();if(!url)throw {erro:'turma',texto:'Entre na turma primeiro.'};
    var b=JSON.stringify(Object.assign({acao:acao,escola:escola()},corpo));
    var r;try{r=await fetch(url,{method:'POST',body:b,keepalive:!!keep&&b.length<60000});}catch(e){throw {erro:'rede',texto:'Sem conexão com a planilha do professor. Confira a internet.'};}
    var j;try{j=await r.json();}catch(e){throw {erro:'rede',texto:'A planilha do professor não respondeu.'};}
    if(j&&j.ok===false&&j.status==='incompleto')throw {erro:'versao',texto:'O professor ainda precisa atualizar o receptor para ativar as senhas.'};
    return j||{};
  }
  function nuvem(){var e=estudanteAtual();return e&&e.nuvem&&e.nuvem.senha?e.nuvem:null;}
  var enviando=false,CRIANDO=false,SENHA_NOVA='';
  function avisar(){try{window.dispatchEvent(new Event('bi-nuvem'));}catch(e){}}
  async function guardarNaNuvem(keep){
    var nv=nuvem(),e=estudanteAtual();if(!nv||enviando||!receiver())return;
    if(normNome(e.nome)!==nv.nome)return; // mudou o nome: espera entrar de novo
    var s=JSON.stringify(coletar()),hs=hash(s+'|'+e.turma+'|'+e.grupo);if(hs===nv.ult)return;
    enviando=true;
    try{var j=await api('aluno-guardar',{nome:e.nome,senha:nv.senha,turma:e.turma,grupo:e.grupo,dados:s},keep);
      if(j.ok)atualizarPerfil(function(x){if(x.nuvem)x.nuvem.ult=hs;x.nuvem.quando=Date.now();});
      else if(j.erro==='senha'||j.erro==='naoexiste')atualizarPerfil(function(x){delete x.nuvem;});
    }catch(err){}finally{enviando=false;}
  }
  // Quadro da ficha: entrar com a senha ou criar a senha
  function caixaNuvem(){
    var box=el('div',{class:'bi-nuvem',role:'region','aria-label':'Guardar as respostas'});
    var ultimoNome='',timer=null,timerCriar=null,estado='',erroCriar='';
    function pin(id){return el('input',{type:'password',inputmode:'numeric',pattern:'[0-9]*',maxlength:'4',autocomplete:'off',class:'bi-pin',id:id,'aria-label':'Senha de 4 números',placeholder:'••••'});}
    function msg(t,cls){return el('p',{class:'bi-nuvem-msg'+(cls?' '+cls:''),role:'status'},t);}
    function draw(){
      box.innerHTML='';box.className='bi-nuvem';
      var e=estudanteAtual(),nv=nuvem();
      if(!receiver()){box.hidden=true;return;}box.hidden=false;
      if(nv&&normNome(e.nome)===nv.nome){
        if(SENHA_NOVA){
          box.className='bi-nuvem nova';
          box.append(el('p',{class:'bi-nuvem-t'},el('strong',{},'Esta é a sua senha:')),
            el('div',{class:'bi-senha',role:'status','aria-label':'Senha '+SENHA_NOVA.split('').join(' ')},SENHA_NOVA),
            el('p',{class:'bi-nuvem-t'},'Anote no caderno. Em outro celular ou computador, escreva o seu nome completo e esta senha para continuar de onde parou. Se esquecer, o professor também tem a senha.'),
            el('div',{class:'bi-nuvem-row'},el('button',{type:'button',class:'btn primary sm',onclick:function(){SENHA_NOVA='';avisar();}},'Já anotei')));
          return;
        }
        box.className='bi-nuvem on';
        var vis=el('span',{class:'mono'},'••••'),bt=el('button',{type:'button',class:'btn ghost sm'},'Ver minha senha');
        bt.onclick=function(){var v=vis.textContent==='••••';vis.textContent=v?nv.senha:'••••';bt.textContent=v?'Ocultar':'Ver minha senha';};
        box.append(el('span',{class:'bi-nuvem-ic','aria-hidden':'true'},'☁'),el('span',{class:'bi-nuvem-t'},'Respostas guardadas também na planilha do professor. Senha: ',vis),bt);
        return;
      }
      if(!nomeOk(e.nome)){box.hidden=true;return;}
      if(estado==='busca'){box.append(msg('Procurando '+e.nome.trim()+' na turma…'));return;}
      if(estado==='existe'){
        var p1=pin('bi-pin-in'),ok=el('button',{type:'button',class:'btn primary sm'},'Entrar'),m=msg('');
        async function entrar(){
          if(!/^\d{4}$/.test(p1.value)){m.textContent='A senha tem 4 números.';m.className='bi-nuvem-msg err';return;}
          ok.disabled=true;m.textContent='Conferindo…';m.className='bi-nuvem-msg';
          try{var j=await api('aluno-entrar',{nome:estudanteAtual().nome,senha:p1.value});
            if(!j.ok){ok.disabled=false;m.className='bi-nuvem-msg err';m.textContent=(j.texto||'Não deu certo.')+(j.restam>0?' Restam '+j.restam+' tentativas.':'')+(j.erro==='senha'?' Esqueceu? Peça ao professor.':'');return;}
            var dados={};try{dados=JSON.parse(j.dados||'{}');}catch(x){}
            // Se este espaço já tem respostas de outra pessoa, abre um espaço novo para quem entrou
            var cur=estudanteAtual(),temDados=Object.keys(coletar()).length>0;
            if(temDados&&cur.nuvem&&cur.nuvem.nome&&cur.nuvem.nome!==normNome(j.nome)){ATUAL=novoEstudante();}
            var senha=p1.value;
            atualizarPerfil(function(x){x.nome=j.nome||x.nome;if(j.turma)x.turma=j.turma;if(j.grupo)x.grupo=j.grupo;x.nuvem={nome:normNome(j.nome||x.nome),senha:senha,ult:'',quando:Date.now()};});
            if(ATUAL==='p0')lsSet(K_ID,{nome:j.nome,turma:j.turma||'',grupo:j.grupo||''});
            var n=aplicar(dados);
            try{sessionStorage.setItem(K_NUVEM_MSG,n?'Pronto! Suas respostas voltaram para este aparelho.':'Pronto! Você entrou.');sessionStorage.setItem(K_QUEM,'1');}catch(x){}
            location.reload();
          }catch(err){ok.disabled=false;m.className='bi-nuvem-msg err';m.textContent=err.texto||'Não deu certo.';}
        }
        ok.onclick=entrar;p1.addEventListener('keydown',function(ev){if(ev.key==='Enter'){ev.preventDefault();entrar();}});
        box.append(el('p',{class:'bi-nuvem-t'},el('strong',{},e.nome.trim()),' já tem respostas guardadas nesta turma. Digite a sua senha para trazê-las para este aparelho.'),
          el('div',{class:'bi-nuvem-row'},p1,ok,el('button',{type:'button',class:'btn ghost sm',onclick:function(){m.className='bi-nuvem-msg';m.textContent='Então já existe outro estudante com esse nome. Acrescente mais um sobrenome ao seu nome para ter a sua própria senha.';}},'Não sou eu')),m);
        return;
      }
      if(estado==='novo'||estado==='criando'){
        box.append(msg(estado==='criando'?'Gerando a sua senha…':'Primeira vez de '+e.nome.trim()+' por aqui? Quando terminar de escrever o nome, a sua senha será gerada.'));
        if(erroCriar)box.append(msg(erroCriar,'err'));
        return;
      }
      box.hidden=true;
    }
    async function verificar(){
      var e=estudanteAtual(),n=normNome(e.nome);if(!nomeOk(e.nome)||!receiver()||(nuvem()&&nuvem().nome===n)){estado='';draw();return;}
      if(n===ultimoNome&&estado)return;ultimoNome=n;estado='busca';erroCriar='';draw();
      try{var j=await api('aluno-ver',{nome:e.nome.trim()});if(normNome(estudanteAtual().nome)!==n)return;estado=j.ok?(j.existe?'existe':'novo'):'';}catch(err){estado='';}
      draw();if(estado==='novo')timerCriar=setTimeout(confirmar,7000);
    }
    // O nome está completo (saiu do campo, apertou Enter ou parou de digitar): gera a senha
    async function confirmar(){
      clearTimeout(timerCriar);
      var e=estudanteAtual(),n=normNome(e.nome);
      if(estado!=='novo'||n!==ultimoNome||!nomeOk(e.nome)||nuvem())return;
      if(CRIANDO)return;CRIANDO=true;estado='criando';erroCriar='';draw();
      var s=JSON.stringify(coletar());
      try{var j=await api('aluno-criar',{nome:e.nome.trim(),turma:e.turma,grupo:e.grupo,dados:s});
        if(j.ok&&/^\d{4}$/.test(String(j.senha||''))){
          var senha=String(j.senha);atualizarPerfil(function(x){x.nuvem={nome:n,senha:senha,ult:hash(s+'|'+e.turma+'|'+e.grupo),quando:Date.now()};});
          SENHA_NOVA=senha;estado='';
        }else if(j.erro==='existe'){estado='existe';}
        else{estado='novo';erroCriar=(j.texto||'Não consegui gerar a senha.')+' Tente sair do campo do nome de novo.';}
      }catch(err){estado='novo';erroCriar=(err.texto||'Não consegui gerar a senha.');}
      finally{CRIANDO=false;}
      avisar();
    }
    function agendar(){clearTimeout(timer);clearTimeout(timerCriar);var e=estudanteAtual();if(normNome(e.nome)!==ultimoNome){estado='';draw();}timer=setTimeout(verificar,1100);}
    window.addEventListener('bi-ident',agendar);
    window.addEventListener('bi-nuvem',draw);
    document.addEventListener('focusout',function(ev){var x=ev.target;if(x&&x.matches&&x.matches('input[autocomplete=name]'))setTimeout(confirmar,200);});
    document.addEventListener('keydown',function(ev){var x=ev.target;if(ev.key==='Enter'&&x&&x.matches&&x.matches('input[autocomplete=name]'))setTimeout(confirmar,200);});
    draw();verificar();
    return box;
  }

  // ---------- Escolher o estudante (aparelho compartilhado) ----------
  function iniciais(n){var p=String(n||'').trim().split(/\s+/).filter(Boolean);return p.length?((p[0][0]||'')+(p.length>1?p[p.length-1][0]:'')).toUpperCase():'?';}
  function escolherEstudante(op){
    op=op||{};injectCss();
    var velho=document.getElementById('bi-quem-dlg');if(velho)velho.remove();
    var lista=estudantes();
    var fundo=el('div',{class:'bi-dlg-bg',id:'bi-quem-dlg'});
    function fechar(){fundo.remove();document.removeEventListener('keydown',esc);try{sessionStorage.setItem(K_QUEM,'1');}catch(e){}}
    function esc(e){if(e.key==='Escape')fechar();}
    function ir(id){if(id===ATUAL){fechar();return;}trocarEstudante(id);location.reload();}
    var itens=el('div',{class:'bi-dlg-list'});
    lista.forEach(function(s){
      itens.append(el('button',{type:'button',class:'bi-pessoa'+(s.atual?' on':''),onclick:function(){ir(s.id);}},
        el('span',{class:'bi-av','aria-hidden':'true'},iniciais(s.nome)),
        el('span',{class:'bi-pessoa-t'},el('b',{},s.nome||'Estudante sem nome'),el('small',{},[s.turma?'Turma '+s.turma:'',s.grupo&&s.grupo!=='Sem grupo'?'Grupo '+s.grupo:''].filter(Boolean).join(' · ')||(s.atual?'Usando agora':''))),
        s.atual?el('span',{class:'bi-pessoa-tag'},'agora'):null));
    });
    var caixa=el('div',{class:'bi-dlg',role:'dialog','aria-modal':'true','aria-labelledby':'bi-dlg-t'},
      el('h2',{id:'bi-dlg-t'},op.titulo||'Quem está usando?'),
      el('p',{class:'note'},'Cada estudante tem o seu espaço neste aparelho, com as suas respostas. Toque no seu nome ou crie o seu espaço.'),
      itens,
      el('div',{class:'row'},el('button',{type:'button',class:'btn primary',onclick:function(){novoEstudante();location.reload();}},'+ Sou novo neste aparelho'),el('button',{type:'button',class:'btn ghost',onclick:fechar},'Fechar')));
    fundo.append(caixa);fundo.addEventListener('click',function(e){if(e.target===fundo)fechar();});
    document.addEventListener('keydown',esc);document.body.append(fundo);
    var foco=caixa.querySelector('.bi-pessoa.on')||caixa.querySelector('button');if(foco)foco.focus();
  }

  // Link para uma ficha: site.html?ficha=Aula%2001 abre a aula e rola até a ficha
  function irParaFicha(){
    try{
      var p=new URLSearchParams(location.search);var code=p.get('ficha');if(!code)return;
      p.delete('ficha');var q=p.toString();history.replaceState(null,'',location.pathname+(q?'?'+q:'')+location.hash);
      var sec=null;
      try{if(typeof FICHA_DE!=='undefined'){for(var k in FICHA_DE)if(FICHA_DE[k]===code){sec=k;break;}}}catch(e){}
      try{if(!sec&&typeof SPEC!=='undefined'&&SPEC.find){var f=SPEC.find(function(x){return x.code===code;});if(f&&f.id)sec=f.id;}}catch(e){}
      if(!sec||typeof go!=='function'||!document.getElementById(sec))return;
      go(sec);setTimeout(function(){var b=document.getElementById('ficha-'+sec);if(b)b.scrollIntoView({behavior:'smooth',block:'start'});},350);
    }catch(e){}
  }

  // ---------- Professor (fica só no navegador do professor) ----------
  function prof(){return lsGet(K_PROF,null);}
  function salvarProf(p){lsSet(K_PROF,p);}
  function standalone(){try{return window.top===window&&!window.claude;}catch(e){return false;}}
  function baseUrl(p){
    if(standalone()&&/^https?:/.test(location.protocol)){var d=location.href.split('#')[0].split('?')[0];return d.replace(/[^\/]*$/,'');}
    var b=(p&&p.base)||PORTAL_URL||'';if(b&&!/\/$/.test(b))b+='/';return b;
  }
  function linkDaTurma(p){var b=baseUrl(p);var cod=codigoDaTurma({n:p.nome,e:p.escola,r:p.r,t:p.turmas,g:p.grupos});return b&&cod?b+'?turma='+cod:'';}
  // Rótulo da turma no painel: com a escola na frente quando houver mais de uma
  function rotuloTurma(escola,turma){escola=String(escola||'').trim();turma=String(turma||'').trim();return escola&&turma?escola+' · '+turma:turma;}

  // ---------- Faixa de navegação entre os sites ----------
  var CSS='.bi-strip{display:flex;align-items:center;gap:4px;overflow-x:auto;scrollbar-width:none;font-size:.8rem;margin:-2px 0 0;padding:0 0 2px}'+
  '.bi-strip::-webkit-scrollbar{display:none}'+
  '.bi-strip a{flex:none;display:inline-flex;align-items:center;gap:6px;padding:3px 10px;border-radius:999px;color:var(--muted);text-decoration:none;border:1px solid transparent;font-weight:700;white-space:nowrap}'+
  '.bi-strip a:hover{color:var(--ink);background:var(--surface)}'+
  '.bi-strip a[aria-current="page"]{color:var(--ink);border-color:var(--line);background:var(--surface)}'+
  '.bi-strip a i{width:8px;height:8px;border-radius:50%;display:inline-block}'+
  '.bi-strip .bi-home{color:var(--ink)}'+
  '.bi-strip .bi-sep{flex:none;width:1px;height:16px;background:var(--line);margin:0 4px}'+
  '.bi-banner{display:flex;flex-wrap:wrap;gap:10px;align-items:center;justify-content:space-between;padding:12px 14px;border-radius:12px;border:1px dashed var(--line);background:var(--surface)}'+
  '.bi-banner.on{border-style:solid}'+
  '.bi-banner-t{margin:0;display:flex;gap:8px;align-items:center;flex-wrap:wrap}'+
  '.bi-dot{width:10px;height:10px;border-radius:50%;background:var(--good,#2b7a4b);display:inline-block;flex:none}'+
  '.bi-code{display:flex;flex-direction:column;gap:6px;width:100%}'+
  '.bi-code-row{display:flex;gap:8px;flex-wrap:wrap}'+
  '.bi-code-in{flex:1 1 220px;min-width:0;font-family:var(--f-mono,monospace);font-size:.85rem}'+
  '.bi-code-msg{font-size:.85rem;color:var(--muted)}.bi-code-msg.err{color:var(--bad,#b03c35)}.bi-code-msg.ok{color:var(--good,#2b7a4b);font-weight:700}'+
  '.bi-turma-off{align-self:center}'+
  '.bi-fb{display:flex;flex-direction:column;gap:8px}'+
  '.bi-quem{display:flex;flex-wrap:wrap;gap:8px 10px;align-items:center;font-size:.92rem}'+
  '.bi-quem-t{flex:1 1 200px}.bi-quem-t a{font-weight:700;color:var(--tema,var(--ink))}'+
  '.bi-av{width:30px;height:30px;border-radius:9px;background:var(--tema-soft,var(--surface-2));color:var(--tema,var(--ink));display:inline-grid;place-items:center;font-family:var(--f-display,inherit);font-weight:800;font-size:.85rem;flex:none}'+
  '.bi-strip a.bi-eu{margin-left:auto;border-color:var(--line);background:var(--surface);color:var(--ink);padding:2px 10px 2px 3px}'+
  '.bi-strip a.bi-eu .bi-av{width:22px;height:22px;border-radius:999px;font-size:.66rem}'+
  '.bi-dlg-bg{position:fixed;inset:0;z-index:80;background:rgba(10,16,13,.55);display:flex;align-items:center;justify-content:center;padding:16px}'+
  '.bi-dlg{background:var(--surface);color:var(--ink);border:1px solid var(--line);border-radius:18px;box-shadow:0 30px 60px -20px rgba(0,0,0,.5);padding:22px;width:min(460px,100%);max-height:calc(100vh - 32px);overflow:auto;display:flex;flex-direction:column;gap:12px}'+
  '.bi-dlg h2{font-size:1.4rem}'+
  '.bi-dlg-list{display:flex;flex-direction:column;gap:6px}'+
  '.bi-pessoa{display:flex;align-items:center;gap:12px;text-align:left;width:100%;padding:9px 12px;border-radius:12px;border:1px solid var(--line);background:var(--bg);cursor:pointer}'+
  '.bi-pessoa:hover{border-color:var(--tema,var(--ink))}'+
  '.bi-pessoa.on{border-width:2px;border-color:var(--tema,var(--good))}'+
  '.bi-pessoa .bi-av{width:38px;height:38px;border-radius:11px;font-size:1rem}'+
  '.bi-pessoa-t{display:flex;flex-direction:column;flex:1;min-width:0}.bi-pessoa-t b{line-height:1.25}.bi-pessoa-t small{color:var(--muted);font-size:.82rem}'+
  '.bi-pessoa-tag{font-family:var(--f-mono,monospace);font-size:.68rem;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:var(--good,#2b7a4b)}'+
  '.bi-nuvem{display:flex;flex-direction:column;gap:8px;padding:12px 14px;border-radius:12px;border:1px solid color-mix(in srgb,var(--tema,var(--accent)) 40%,var(--line));background:var(--tema-soft,var(--surface-2))}'+
  '.bi-nuvem.on{flex-direction:row;align-items:center;gap:10px;padding:8px 12px;background:var(--surface);border-color:var(--line);font-size:.88rem;color:var(--muted)}'+
  '.bi-nuvem.nova{border-width:2px;border-color:var(--good,#2b7a4b);background:var(--good-soft,#dbefe1)}'+
  '.bi-senha{font-family:var(--f-mono,monospace);font-size:2.4rem;font-weight:700;letter-spacing:.35em;line-height:1;color:var(--ink)}'+
  '.bi-nuvem.on .bi-nuvem-t{flex:1}'+
  '.bi-nuvem-ic{font-size:1.2rem;color:var(--good,#2b7a4b)}'+
  '.bi-nuvem-row{display:flex;gap:8px;flex-wrap:wrap;align-items:center}'+
  '.bi-pin{width:7.5em!important;font-family:var(--f-mono,monospace);font-size:1.1rem;letter-spacing:.3em;text-align:center}'+
  '.bi-nuvem-msg{font-size:.88rem;color:var(--muted);margin:0}.bi-nuvem-msg:empty{display:none}.bi-nuvem-msg.err{color:var(--bad,#b03c35);font-weight:700}'+
  '.bi-toast{position:fixed;left:50%;transform:translateX(-50%);bottom:calc(18px + env(safe-area-inset-bottom,0px));z-index:60;background:var(--ink);color:var(--surface);padding:10px 16px;border-radius:999px;font-weight:700;box-shadow:0 10px 30px -10px rgba(0,0,0,.5);max-width:calc(100% - 32px);text-align:center}'+
  '.bi-rodape{border-top:1px solid var(--line);margin-top:8px}'+
  '.bi-rodape-in{max-width:1280px;margin:0 auto;padding:18px 16px calc(90px + env(safe-area-inset-bottom,0px))}'+
  '.bi-copy{margin:0;font-size:.82rem;line-height:1.45;color:var(--muted)}';
  function injectCss(){if(document.getElementById('bi-css'))return;var s=document.createElement('style');s.id='bi-css';s.textContent=CSS;document.head.append(s);}
  function strip(){
    var top=document.querySelector('header.top .top-in');if(!top||top.querySelector('.bi-strip'))return;
    var cur=window.PORTAL_SITE;
    var nav=el('nav',{class:'bi-strip','aria-label':'Sites da coleção'},el('a',{href:'index.html',class:'bi-home'},'← Biologia em Investigação'),el('span',{class:'bi-sep','aria-hidden':'true'}));
    ORDER.forEach(function(k){var s=SITES[k];nav.append(el('a',{href:s.file,'aria-current':k===cur?'page':null},el('i',{style:'background:'+s.cor,'aria-hidden':'true'}),s.nome));});
    var eu=el('a',{href:'estudante.html',class:'bi-eu',title:'Minha página: minhas fichas em todos os sites'});
    function drawEu(){var n=estudanteAtual().nome;eu.innerHTML='';eu.append(el('span',{class:'bi-av','aria-hidden':'true'},iniciais(n)),nomeCurto(n)?'Minha página · '+nomeCurto(n):'Minha página');}
    drawEu();window.addEventListener('bi-ident',drawEu);
    nav.append(eu);
    top.prepend(nav);
  }
  // Aviso de direitos autorais no rodapé de todas as páginas
  var COPY='© 2026 Biologia em Investigação · Criado por Bianca Posterli Firmino et al. Todos os direitos reservados.';
  function rodape(){
    if(document.querySelector('.bi-copy'))return;
    var p=el('p',{class:'bi-copy'},COPY);
    var w=document.querySelector('body > footer .wrap');
    if(w){w.append(p);return;}
    var f=el('footer',{class:'bi-rodape'},el('div',{class:'bi-rodape-in'},p));
    var m=document.querySelector('body > main');
    if(m)m.after(f);else document.body.append(f);
  }
  function toast(t){var d=el('div',{class:'bi-toast',role:'status'},t);document.body.append(d);setTimeout(function(){d.remove();},4200);}
  function boot(){
    injectCss();
    rodape();
    if(window.PORTAL_SITE)strip();
    if(window.__biTurmaNova){var c=turma();if(c)toast('Você entrou na turma de '+c.n+'.');}
    if(window.PORTAL_SITE)setTimeout(irParaFicha,0);
    try{var nm=sessionStorage.getItem(K_NUVEM_MSG);if(nm){sessionStorage.removeItem(K_NUVEM_MSG);toast(nm);}}catch(e){}
    // Guarda as fichas na planilha do professor de tempos em tempos e ao sair da página
    if(window.PORTAL_SITE||window.PORTAL_ESTUDANTE){
      setInterval(function(){guardarNaNuvem(false);},30000);
      document.addEventListener('visibilitychange',function(){if(document.visibilityState==='hidden')guardarNaNuvem(true);});
      window.addEventListener('pagehide',function(){guardarNaNuvem(true);});
    }
    // Aparelho com mais de um estudante: pergunta quem está usando, uma vez por sessão do navegador
    if(window.PORTAL_SITE||window.PORTAL_ESTUDANTE){var ja='1';try{ja=sessionStorage.getItem(K_QUEM);}catch(e){}if(!ja&&perfis().lista.length>1)setTimeout(function(){escolherEstudante();},300);}
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();

  window.PORTAL={SITES:SITES,ORDER:ORDER,escola:escola,rotuloTurma:rotuloTurma,el:el,lsGet:lsGet,lsSet:lsSet,
    turma:turma,definirTurma:definirTurma,sairDaTurma:sairDaTurma,lerCodigo:lerCodigo,codigoDaTurma:codigoDaTurma,caixaCodigo:caixaCodigo,
    ident:ident,saveIdent:saveIdent,estudantes:estudantes,estudanteAtual:estudanteAtual,pfx:pfx,trocarEstudante:trocarEstudante,novoEstudante:novoEstudante,removerEstudante:removerEstudante,escolherEstudante:escolherEstudante,guardarNaNuvem:guardarNaNuvem,iniciais:iniciais,grupos:grupos,turmas:turmas,turmaCtl:turmaCtl,fichaBanner:fichaBanner,
    site:site,code:code,codeFor:codeFor,receiver:receiver,sendLabel:sendLabel,offText:offText,
    idDoReceptor:idDoReceptor,urlDoReceptor:urlDoReceptor,prof:prof,salvarProf:salvarProf,standalone:standalone,baseUrl:baseUrl,linkDaTurma:linkDaTurma,
    injectCss:injectCss,toast:toast};
})();
