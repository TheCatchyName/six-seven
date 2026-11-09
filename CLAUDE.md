# six-seven

A Claude Code mod that bursts 🙌🖐️🤲 whenever "67" shows up in the chat. Zero tokens.

| Path | What |
| --- | --- |
| `.claude-plugin/` | plugin.json (and marketplace.json once shared) |
| `hooks/` | `register.tsx` (hooks), `match.ts` (matcher), `match.test.ts` |
| `types/` | `$.state` contract |
| `memory-bank/` | read first, update before ending a session |

Develop in the session's dev-mods folder (hot reload), then copy back here.

**Validator:** before ending a session or staging, run `claude plugin validate .`, `claude plugin test .` and `tsc`, and fix what they report.

**Git:** commit directly, unsigned, Conventional Commits with the `Co-Authored-By` trailer (hook enforces). Never push without Marcus's yes.

## Deploy
Deploy = a public/private GitHub repo with `.claude-plugin/marketplace.json`, installed with one `/plugin install` line.
