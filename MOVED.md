# Where the knowledge base went

**On 10 August 2026 the pension-domain knowledge left this repo.**

`knowledge/` and `research/` now live at **[ClerioWealth/clerio-knowledge](https://github.com/ClerioWealth/clerio-knowledge)**,
checked out locally at `~/git/clerio-knowledge`. Nothing was lost in the move: all 251 content
files were verified byte-identical, path by path, before the originals here were removed.

| Was here | Is now |
|---|---|
| `knowledge/` | the **root** of `clerio-knowledge` — the Obsidian vault root is the repo root |
| `research/specimens/` | `clerio-knowledge/research/specimens/` (161 files, excluded from the note graph) |
| `research/{be,de,fr}-build-spec.md` | `clerio-knowledge/research/` |

## Why it moved

It had accumulated **untracked** inside the repo of the `retir-ai` prototype, which Clerio
replaced — 63 MB of research, never once committed, on a single machine. It also needed a home
of its own because more than one repo reads it: `clerio-web`'s tax module and `clerio-api`'s
estimate engine and parsers both do. Something two repos consume belongs to neither.

Moving it also freed the **`pension-kb`** skill, which used to sit at
`retir-ai/.claude/skills/pension-kb/` — directory-scoped, and therefore invisible from the repos
where the work actually happens. It is now installed user-level at `~/.claude/skills/pension-kb/`.

## What stayed, and why

- **`foundation/`** — TAM, competitive landscape, market size. Business and GTM, not domain
  knowledge; the vault's own capture rule has always drawn that line.
- **`docs/`** — the fit4start application.
- **`retir-ai/`** — the prototype itself. This repo is its archive now.

## What was never here and must never be

Real, identifiable member documents live in `~/git/docs`, **outside every repository**. The
vault's specimen rule allows only publisher-published specimens, blank forms, official guides and
already-redacted examples. That rule predates this move and survives it.
