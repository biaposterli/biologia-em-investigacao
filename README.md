# Biologia em Investigação

Portal com sites didáticos interativos de Biologia para o Ensino Médio (1º ao 3º ano), baseados no livro *360° Biologia* (GODOY; LOURENÇO, FTD, 2024).

- **Células em Ação** (Temas 2 a 4)
- **Microcosmo** (laboratório virtual de microscopia)
- **Ecologia em Investigação** (Temas 20 a 24)
- **Genética em Investigação** (Temas 28 a 30)

Inclui a Área do professor (turmas, link e QR code, receptor no Google Apps Script) e o Painel de avaliação.

## Publicação

Publicado no Cloudflare Pages: https://biologia-em-investigacao.pages.dev (sem comando de build). O `build.py` gera `site/` e copia o mesmo conteúdo para a raiz do repositório.

## Estrutura

| Pasta ou arquivo | O que é |
|---|---|
| `src/sites/*.html` | Um arquivo por site. É aqui que cada site é editado. |
| `src/index.body.html` | Página inicial do portal |
| `src/professor.body.html` | Área do professor |
| `src/portal.js`, `src/portal.css` | Partes compartilhadas: turma, ficha, faixa de navegação |
| `src/receptor.gs` | Código do receptor (Google Apps Script) gerado na Área do professor |
| `src/icons/` | Favicons (gerados por `build_icons.py`) |
| `build.py` | Monta a pasta `site/` a partir de `src/` |
| `site/` | Versão pronta, publicada pelo Cloudflare |

Depois de editar qualquer arquivo em `src/`, rode `python3 build.py` e envie `src/` e `site/` juntos.
