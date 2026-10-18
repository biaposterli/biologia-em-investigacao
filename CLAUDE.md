# Biologia em Investigação

Portal de sites didáticos de Biologia (Ensino Médio). Textos e interface em português do Brasil.

## Como trabalhar neste repositório

- Edite só em `src/`. Cada site é um arquivo em `src/sites/` (ecologia, celulas, genetica, microcosmo, painel). Não edite `site/` à mão.
- Depois de editar, rode `python3 build.py` para regenerar `site/` e `site/specs.js` (as fichas que o painel usa são extraídas dos próprios sites).
- Antes de enviar: confira a sintaxe dos scripts (`node --check`) e teste no navegador, em largura de computador e de celular (cerca de 390 px).
- Faça commit de `src/` e `site/` juntos e envie para `main`. O Cloudflare Pages publica `site/` automaticamente.
- Preserve a identidade visual da coleção (cores, fontes Bricolage Grotesque, Atkinson Hyperlegible e JetBrains Mono, layout das aulas).
- Fichas: alterar o texto de uma pergunta (`t`) cria uma coluna nova na planilha do professor. Avise quando fizer isso.
- Os sites não guardam dados de estudantes; as fichas vão para a planilha de cada professor pelo receptor.
