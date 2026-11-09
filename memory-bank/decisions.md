# Decisions

Append-only; new dated entries above the marker.

## Gotchas
- No window-focus event exists. `ui.focus` is the focus ring inside a Pane/band, not the window. "Burst when you come back" relies on `onScreen` turning non-null as the bubble is drawn again.
- Hooks must be top-level functions (validate refuses closures).

## Decisions
- 2026-11-09: bubble burst = rewriting `text` of AssistantMessage/UserMessage rows (all surfaces). No true overlay over bubbles exists; Backdrop is behind the conversation.
- 2026-11-09: validator = plugin validate + plugin test + tsc.

<!-- END-OF-LOG: append new dated entries directly above this line -->
