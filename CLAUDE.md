# Biologia em Investigação

Portal de sites didáticos de Biologia (Ensino Médio). Textos e interface em português do Brasil.

## Como trabalhar neste repositório

- Edite só em `src/`. Cada site é um arquivo em `src/sites/` (ciencia, ecologia, celulas, genetica, microcosmo, diversidade, plantas, painel). Não edite `site/` à mão.
- Depois de editar, rode `python3 build.py`. Ele regenera `site/` (com `specs.js`, as fichas que o painel usa, extraídas dos próprios sites) e copia o mesmo conteúdo para a raiz do repositório, que é o que o Cloudflare Pages publica.
- Antes de enviar: confira a sintaxe dos scripts (`node --check`) e teste no navegador, em largura de computador e de celular (cerca de 390 px).
- Faça commit de tudo junto e envie para `main`. O Cloudflare Pages (https://biologia-em-investigacao.pages.dev) publica automaticamente em cerca de um minuto.
- `teste.html` confere se cada site abre no aparelho de quem acessa; útil para diagnosticar problemas.
- Preserve a identidade visual da coleção (cores, fontes Bricolage Grotesque, Atkinson Hyperlegible e JetBrains Mono, layout das aulas).
- Fichas: alterar o texto de uma pergunta (`t`) cria uma coluna nova na planilha do professor. Avise quando fizer isso.
- Os sites não guardam dados de estudantes; as fichas vão para a planilha de cada professor pelo receptor.
