# shuvplan for Copilot CLI

Interactive plan review, code review, and markdown annotation for GitHub Copilot CLI.

## Install

**Install the `shuvplan` command:**

**macOS / Linux / WSL:**

```bash
curl -fsSL https://plan.shuv.dev/install.sh | bash
```

**Windows PowerShell:**

```powershell
irm https://plan.shuv.dev/install.ps1 | iex
```

**Then in Copilot CLI:**

```
/plugin marketplace add backnotprop/plannotator
/plugin install plannotator-copilot@plannotator
```

Restart Copilot CLI after plugin install. Plan review activates automatically when you use plan mode (`Shift+Tab` to enter plan mode).

## How It Works

### Plan Mode Integration

When you use plan mode in Copilot CLI:

1. The agent writes `plan.md` to the session state directory
2. The agent calls `exit_plan_mode` to present the plan
3. The `preToolUse` hook intercepts this and opens the shuvplan review UI in your browser
4. You review the plan, optionally add annotations
5. **Approve** → the plan is accepted and the agent proceeds
6. **Deny** → the agent receives your feedback and revises the plan

### Available Commands

| Command | Description |
|---------|-------------|
| `/shuvplan-review` | Open interactive code review for current changes or a PR URL |
| `/shuvplan-annotate <file>` | Open interactive annotation UI for a markdown file |
| `/shuvplan-last` | Annotate the last rendered assistant message |

## Environment Variables

| Variable | Description |
|----------|-------------|
| `SHUVPLAN_REMOTE` | Set to `1` / `true` for remote mode, `0` / `false` for local mode, or leave unset for SSH auto-detection. Uses a fixed port in remote mode; browser-opening behavior depends on the environment. |
| `SHUVPLAN_PORT` | Fixed port to use. Default: random locally, `19432` for remote sessions. |
| `SHUVPLAN_BROWSER` | Custom browser to open. macOS: app name or path. Linux/Windows: executable path. |
| `SHUVPLAN_SHARE` | Set to `disabled` to turn off URL sharing. |

## Limitations

- **Plan mode** requires the `shuvplan` CLI to be installed and on PATH
- **`/shuvplan-last`** parses `events.jsonl` from the Copilot CLI session state directory — format may change between Copilot CLI versions

## Links

- [Website](https://plan.shuv.dev)
- [GitHub](https://github.com/backnotprop/plannotator)
- [Docs](https://plan.shuv.dev/docs/getting-started/installation/)
