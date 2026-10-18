/* Biologia em Investigação · núcleo compartilhado do portal
   Guarda a turma (vinda do link ou do código do professor), a identificação do estudante
   e monta a faixa de navegação entre os sites. Carregado por todas as páginas. */
window.__biErros=[];try{addEventListener('error',function(e){window.__biErros.push((e.message||'erro')+' (linha '+e.lineno+')');});}catch(e){}
(function(){
  'use strict';
  // Endereço público do portal (ex.: https://biologia-investigacao.pages.dev/). Usado para gerar o link das turmas
  // quando a área do professor é aberta dentro do Claude. Fora do Claude, o endereço é detectado sozinho.
  var PORTAL_URL='';

  var SITES={
    eco:{id:'eco',nome:'Ecologia em Investigação',curto:'Ecologia',file:'ecologia.html',cor:'#1d6b58'},
    cel:{id:'cel',nome:'Células em Ação',curto:'Células',file:'celulas.html',cor:'#a3601b'},
    gen:{id:'gen',nome:'Genética em Investigação',curto:'Genética',file:'genetica.html',cor:'#a3336b'},
    mic:{id:'mic',nome:'Microcosmo',curto:'Microcosmo',file:'microcosmo.html',cor:'#2c58a5'}
  };
  var ORDER=['cel','mic','eco','gen'];
  var K_TURMA='bi-turma',K_ID='bi-ident',K_PROF='bi-prof';

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

  // ---------- Identificação do estudante (vale para os quatro sites) ----------
  function ident(){
    var i=lsGet(K_ID,null)||{nome:'',turma:'',grupo:''};
    var c=turma();
    if(c&&c.t.length&&i.turma&&c.t.indexOf(i.turma)<0)i.turma='';
    if(c&&i.grupo&&grupos().indexOf(i.grupo)<0)i.grupo='';
    return {nome:i.nome||'',turma:i.turma||'',grupo:i.grupo||''};
  }
  function saveIdent(i){lsSet(K_ID,{nome:i.nome||'',turma:i.turma||'',grupo:i.grupo||''});}
  function grupos(){var c=turma();var n=c&&c.g?c.g:8;var a=[];for(var k=1;k<=n;k++)a.push(String(k));a.push('Sem grupo');return a;}
  function turmas(){var c=turma();return c?c.t.slice():[];}

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
    draw();return box;
  }

  // Seletor de turma da ficha (usa o seletor de botões do próprio site)
  function turmaCtl(seg,ident,onChange){
    var t=turmas();
    if(!t.length)return el('span',{class:'note bi-turma-off'},'Definida pelo link do professor');
    return seg(t.map(function(x){return [x,x];}),ident.turma||null,onChange,{label:'Turma'});
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
  '.bi-toast{position:fixed;left:50%;transform:translateX(-50%);bottom:calc(18px + env(safe-area-inset-bottom,0px));z-index:60;background:var(--ink);color:var(--surface);padding:10px 16px;border-radius:999px;font-weight:700;box-shadow:0 10px 30px -10px rgba(0,0,0,.5);max-width:calc(100% - 32px);text-align:center}';
  function injectCss(){if(document.getElementById('bi-css'))return;var s=document.createElement('style');s.id='bi-css';s.textContent=CSS;document.head.append(s);}
  function strip(){
    var top=document.querySelector('header.top .top-in');if(!top||top.querySelector('.bi-strip'))return;
    var cur=window.PORTAL_SITE;
    var nav=el('nav',{class:'bi-strip','aria-label':'Sites da coleção'},el('a',{href:'index.html',class:'bi-home'},'← Biologia em Investigação'),el('span',{class:'bi-sep','aria-hidden':'true'}));
    ORDER.forEach(function(k){var s=SITES[k];nav.append(el('a',{href:s.file,'aria-current':k===cur?'page':null},el('i',{style:'background:'+s.cor,'aria-hidden':'true'}),s.nome));});
    top.prepend(nav);
  }
  function toast(t){var d=el('div',{class:'bi-toast',role:'status'},t);document.body.append(d);setTimeout(function(){d.remove();},4200);}
  function boot(){
    injectCss();
    if(window.PORTAL_SITE)strip();
    if(window.__biTurmaNova){var c=turma();if(c)toast('Você entrou na turma de '+c.n+'.');}
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();

  window.PORTAL={SITES:SITES,ORDER:ORDER,el:el,lsGet:lsGet,lsSet:lsSet,
    turma:turma,definirTurma:definirTurma,sairDaTurma:sairDaTurma,lerCodigo:lerCodigo,codigoDaTurma:codigoDaTurma,caixaCodigo:caixaCodigo,
    ident:ident,saveIdent:saveIdent,grupos:grupos,turmas:turmas,turmaCtl:turmaCtl,fichaBanner:fichaBanner,
    site:site,code:code,codeFor:codeFor,receiver:receiver,sendLabel:sendLabel,offText:offText,
    idDoReceptor:idDoReceptor,urlDoReceptor:urlDoReceptor,prof:prof,salvarProf:salvarProf,standalone:standalone,baseUrl:baseUrl,linkDaTurma:linkDaTurma,
    injectCss:injectCss,toast:toast};
})();
