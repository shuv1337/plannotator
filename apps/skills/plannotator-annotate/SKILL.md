---
name: plannotator-annotate
description: Open shuvplan's annotation UI for a markdown file, converted HTML file, URL, or folder and then respond to the returned annotations.
---

# shuvplan Annotate

Use this skill when the user wants to annotate a document in shuvplan instead of reviewing it inline in chat.

Run:

```bash
plannotator annotate <path-or-url>
```

Behavior:

1. Launch the command with Bash.
2. Wait for the browser review to finish.
3. If annotations are returned, address them directly.
4. If the session closes without feedback, say so briefly and continue.

Run this as a foreground command. Do not use `systemd-run`, `nohup`, `&`, or any other detached wrapper for annotation sessions, because the returned feedback must stay connected to the current agent turn.

Do not ask the user to paste a shell command into the chat. Run the command yourself.
