# six-seven: brief

Mod that bursts waving hands when 67 appears in user or assistant text.

- `hooks/match.ts`: `has67` (standalone 67, "6 7", "6-7", "six seven"; skips 1967, 670, $67.50, file.ts:67, code) and `Tail` (streamed chunks; a match counts once a char follows it).
- `hooks/register.tsx`:
  - `ui.render` on AssistantMessage/UserMessage: first time a 67 message is on screen (`onScreen` not null), a ~2 s burst row is prepended to that bubble's text.
  - `turn.step`: live streamed 67 bursts in the AbovePrompt band.
  - vscode/mobile (no band): a toast.
  - 8 s cooldown; `seen` ids in `$.state`.
