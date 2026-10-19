/**
 * Biologia em Investigação · receptor das fichas
 *
 * Recebe as fichas que os estudantes enviam pelos sites e grava nesta planilha,
 * uma aba por site e aula (por exemplo "Ecologia · Aula 01").
 * Também entrega os dados ao Painel de avaliação, que só abre com a senha abaixo.
 *
 * Este código foi gerado na Área do professor do portal, já com o seu nome e a sua senha.
 * Não é preciso alterar nada.
 */
const PROFESSOR = __PROFESSOR__;
const SENHA_PAINEL = __SENHA__;

const SITES = ['Ecologia', 'Células', 'Genética', 'Microcosmo'];
const MAX_TEXTO = 1200;
const MAX_PERGUNTAS = 80;
const FIXAS = ['Carimbo de data/hora', 'Nome completo', 'Escola', 'Turma', 'Grupo'];
const ABA_AVAL = 'Avaliação';
const CAB_AVAL = ['Chave', 'Atividade', 'Turma', 'Nome', 'Grupo', 'Pontos automáticos', 'Máximo automático',
  'Pontos das abertas', 'Nota', 'Comentário', 'Atualizado em'];

function codigoValido(c) {
  return typeof c === 'string' && new RegExp('^(' + SITES.join('|') + ') · Aula \\d{2}$').test(c);
}

// Envio pelo site aberto dentro do Claude: abre uma aba de confirmação.
// Também atende o painel (acao=dados) e o teste de conexão (acao=teste).
function doGet(e) {
  const p = (e && e.parameter) || {};
  if (p.acao === 'teste') return json({ ok: true, professor: PROFESSOR });
  if (p.acao === 'dados') return json(dados(p.senha));
  if (!p.d) return pagina('Receptor ativo', 'Este endereço recebe as fichas dos estudantes de ' + PROFESSOR + '. Está funcionando.', true);
  let d;
  try {
    d = JSON.parse(Utilities.newBlob(Utilities.base64DecodeWebSafe(p.d)).getDataAsString('UTF-8'));
  } catch (err) {
    return pagina('Não foi possível ler o envio', 'Volte ao site e toque em Enviar de novo.', false);
  }
  const r = salvar(d);
  return pagina(r.titulo, r.texto, r.ok, d);
}

// Envio direto do site publicado e gravação das notas pelo painel: responde em JSON.
function doPost(e) {
  let r;
  try {
    const d = JSON.parse(e.postData.contents);
    r = d && d.acao === 'nota' ? salvarNota(d) : salvar(d);
  } catch (err) {
    r = { ok: false, status: 'erro', titulo: 'Não foi possível ler o envio', texto: 'Tente enviar de novo.' };
  }
  return json(r);
}

function json(o) {
  return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
}
function senhaOk(s) { return typeof s === 'string' && s.length >= 6 && s === SENHA_PAINEL; }

function salvar(dados) {
  const nome = limpar(dados && dados.nome, 120).trim();
  if (!dados || !codigoValido(dados.code) || !nome) {
    return { ok: false, status: 'incompleto', titulo: 'Envio incompleto', texto: 'Confira o nome e a atividade e envie de novo.' };
  }
  const resp = {};
  Object.keys(dados.ans || {}).slice(0, MAX_PERGUNTAS).forEach(function (k) {
    const t = limpar(k, 200).trim();
    if (t && FIXAS.indexOf(t) < 0 && t !== 'ID do envio') resp[t] = limpar(dados.ans[k], MAX_TEXTO);
  });
  const lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let aba = ss.getSheetByName(dados.code);
    if (!aba) {
      aba = ss.insertSheet(dados.code);
      const cab0 = FIXAS.concat(Object.keys(resp)).concat(['ID do envio']);
      aba.getRange(1, 1, 1, cab0.length).setValues([cab0]).setFontWeight('bold');
      aba.setFrozenRows(1);
    }
    let cab = aba.getRange(1, 1, 1, Math.max(aba.getLastColumn(), 1)).getValues()[0].map(String);
    const escola = limpar(dados.escola, 80).trim();
    const extras = (escola ? ['Escola'] : []).concat(Object.keys(resp)).concat(['ID do envio']);
    const faltam = extras.filter(function (t) { return cab.indexOf(t) < 0; });
    if (faltam.length) {
      if (aba.getMaxColumns() < cab.length + faltam.length) aba.insertColumnsAfter(aba.getMaxColumns(), cab.length + faltam.length - aba.getMaxColumns());
      aba.getRange(1, cab.length + 1, 1, faltam.length).setValues([faltam]).setFontWeight('bold');
      cab = cab.concat(faltam);
    }
    const idEnvio = limpar(dados.id, 60);
    const colId = cab.indexOf('ID do envio') + 1;
    if (idEnvio && aba.getLastRow() > 1) {
      const ids = aba.getRange(2, colId, aba.getLastRow() - 1, 1).getValues().map(function (r) { return String(r[0]); });
      if (ids.indexOf(idEnvio) >= 0) return { ok: true, status: 'repetido', titulo: 'Já recebido', texto: 'Esta resposta já tinha chegado.' };
    }
    const fixo = {
      'Carimbo de data/hora': Utilities.formatDate(new Date(), 'America/Sao_Paulo', 'dd/MM/yyyy HH:mm:ss'),
      'Nome completo': nome, 'Escola': escola, 'Turma': limpar(dados.turma, 20), 'Grupo': limpar(dados.grupo, 20), 'ID do envio': idEnvio
    };
    const linha = cab.map(function (t) { return t in fixo ? fixo[t] : (t in resp ? resp[t] : ''); });
    aba.appendRow(linha.map(seguro));
  } finally {
    lock.releaseLock();
  }
  return { ok: true, status: 'salvo', titulo: 'Resposta enviada!', texto: PROFESSOR + ' já recebeu.' };
}

// Dados para o Painel de avaliação
function dados(senha) {
  if (!senhaOk(senha)) return { ok: false, erro: 'senha', texto: 'Senha do painel incorreta.' };
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const abas = {};
  ss.getSheets().forEach(function (sh) {
    const n = sh.getName();
    if (codigoValido(n) || n === ABA_AVAL || n === 'Alunos') abas[n] = sh.getLastRow() ? sh.getDataRange().getDisplayValues() : [];
  });
  return { ok: true, professor: PROFESSOR, planilha: ss.getUrl(), abas: abas };
}

// Correção feita no painel: grava ou atualiza a linha do envio na aba Avaliação
function salvarNota(d) {
  if (!senhaOk(d.senha)) return { ok: false, erro: 'senha', texto: 'Senha do painel incorreta.' };
  const row = Array.isArray(d.linha) ? d.linha.slice(0, CAB_AVAL.length) : null;
  if (!row || row.length !== CAB_AVAL.length || !row[0] || !codigoValido(row[1])) return { ok: false, erro: 'dados', texto: 'Correção incompleta.' };
  const linha = row.map(function (v) { return seguro(limpar(v, 2000)); });
  const lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let aba = ss.getSheetByName(ABA_AVAL);
    if (!aba) {
      aba = ss.insertSheet(ABA_AVAL);
      aba.getRange(1, 1, 1, CAB_AVAL.length).setValues([CAB_AVAL]).setFontWeight('bold');
      aba.setFrozenRows(1);
    }
    const n = aba.getLastRow();
    const chaves = n > 1 ? aba.getRange(2, 1, n - 1, 1).getValues().map(function (r) { return String(r[0]); }) : [];
    const i = chaves.indexOf(String(row[0]));
    if (i >= 0) aba.getRange(i + 2, 1, 1, linha.length).setValues([linha]);
    else aba.appendRow(linha);
  } finally {
    lock.releaseLock();
  }
  return { ok: true };
}

function limpar(v, max) { return String(v == null ? '' : v).replace(/[\u0000-\u0008]/g, '').slice(0, max); }
function seguro(v) { return (typeof v === 'string' && /^[=+\-@]/.test(v)) ? "'" + v : v; }

function pagina(titulo, texto, ok, dados) {
  const quem = dados && dados.nome ? '<p class="q">' + esc(dados.nome) + ' · Turma ' + esc(dados.turma || '') + ' · ' + esc(dados.code || '') + '</p>' : '';
  const html = '<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1"><style>' +
    'body{margin:0;font-family:system-ui,sans-serif;background:#eef0e9;color:#17231d;display:flex;min-height:100vh;align-items:center;justify-content:center;padding:24px}' +
    '.c{background:#fff;border-radius:18px;padding:28px;max-width:420px;text-align:center;box-shadow:0 10px 30px -18px rgba(0,0,0,.4)}' +
    '.i{width:64px;height:64px;border-radius:50%;margin:0 auto 12px;display:flex;align-items:center;justify-content:center;font-size:34px;color:#fff;background:' + (ok ? '#2b7a4b' : '#b03c35') + '}' +
    'h1{font-size:1.5rem;margin:0 0 8px}p{margin:0 0 8px;line-height:1.5}.q{color:#556459;font-size:.9rem}</style></head><body><div class="c"><div class="i">' + (ok ? '✓' : '!') + '</div><h1>' + esc(titulo) + '</h1><p>' + esc(texto) + (ok ? ' Pode fechar esta aba.' : '') + '</p>' + quem + '</div></body></html>';
  return HtmlService.createHtmlOutput(html).setTitle(titulo).addMetaTag('viewport', 'width=device-width, initial-scale=1');
}
function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

/** Rode uma vez pelo editor (botão Executar) para autorizar o acesso a esta planilha antes de implantar. */
function autorizar() { Logger.log('Autorizado para a planilha: ' + SpreadsheetApp.getActiveSpreadsheet().getName()); }
