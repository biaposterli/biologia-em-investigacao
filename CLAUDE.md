# Biologia em Investigação

Portal de sites didáticos de Biologia (Ensino Médio). Textos e interface em português do Brasil.

## Como trabalhar neste repositório

- Edite só em `src/`. Cada site é um arquivo em `src/sites/` (ciencia, ecologia, celulas, genetica, microcosmo, corpo, diversidade, plantas, painel). Não edite `site/` à mão.
- Depois de editar, rode `python3 build.py`. Ele regenera `site/` (com `specs.js`, as fichas que o painel usa, extraídas dos próprios sites) e copia o mesmo conteúdo para a raiz do repositório, que é o que o Cloudflare Pages publica.
- Antes de enviar: confira a sintaxe dos scripts (`node --check`) e teste no navegador, em largura de computador e de celular (cerca de 390 px).
- Faça commit de tudo junto e envie para `main`. O Cloudflare Pages (https://biologia-em-investigacao.pages.dev) publica automaticamente em cerca de um minuto.
- `teste.html` confere se cada site abre no aparelho de quem acessa; útil para diagnosticar problemas.
- Preserve a identidade visual da coleção (cores, fontes Bricolage Grotesque, Atkinson Hyperlegible e JetBrains Mono, layout das aulas).
- Fichas: alterar o texto de uma pergunta (`t`) cria uma coluna nova na planilha do professor. Avise quando fizer isso.
- Os sites não guardam dados de estudantes; as fichas vão para a planilha de cada professor pelo receptor.

## graphify

O repositório tem um mapa do código feito com o Graphify (https://graphify.net). A pasta `graphify-out/` não vai para o GitHub (publicada pelo Cloudflare, ela apareceria no site), então gere o mapa no início da sessão se ele não existir:

```
pip install graphifyy          # uma vez por máquina (no ambiente do Claude: --break-system-packages)
graphify extract . --code-only # cerca de 10 s, sem custo de API
graphify cluster-only . --no-label
```

- `.graphifyrc` faz o Graphify ler os blocos `<script>` dos sites em `src/sites/*.html` como código (`language.html=.vue`). Sem isso, os sites ficam fora do mapa.
- `.graphifyignore` deixa de fora as cópias geradas pelo `build.py` (`site/` e os arquivos da raiz), para que cada função apareça uma vez só, apontando para `src/`.

This project has a knowledge graph at graphify-out/ with god nodes, community structure, and cross-file relationships.

Rules:
- When graphify-out/graph.json exists, run `graphify query "<question>"` before your first grep, search or source-file read for a codebase question, and put this rule in every subagent prompt that explores code. Read raw files only for lines the graph or an earlier read already located. Use `graphify path "<A>" "<B>"` for relationships and `graphify explain "<concept>"` for focused concepts. These return a scoped subgraph, usually much smaller than GRAPH_REPORT.md or raw grep output.
- If graphify-out/wiki/index.md exists, use it for broad navigation instead of raw source browsing.
- Read graphify-out/GRAPH_REPORT.md only for broad architecture review or when query/path/explain do not surface enough context.
- After modifying code, run `graphify update .` to keep the graph current (AST-only, no API cost).
- A committed graphify-out/graph.json is rewritten whole on every build, so a large diff to it in a pull request is expected. Do not flag it as churn or suggest skipping the graph rebuild or its hooks.
