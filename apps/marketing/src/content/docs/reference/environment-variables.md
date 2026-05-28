---
title: "Environment Variables"
description: "Complete reference for all shuvplan environment variables."
sidebar:
  order: 30
section: "Reference"
---

All shuvplan environment variables and their defaults. Legacy `PLANNOTATOR_*` names remain supported as fallbacks during the compatibility window, but `SHUVPLAN_*` wins when both are set.

## Core variables

| Variable | Default | Description |
|----------|---------|-------------|
| `SHUVPLAN_REMOTE` | auto-detect | Set to `1` or `true` to force remote mode, `0` or `false` to force local mode, or leave unset to auto-detect via `SSH_TTY` / `SSH_CONNECTION`. Uses a fixed port in remote mode; browser-opening behavior depends on the environment. |
| `SHUVPLAN_PORT` | random (local) / `19432` (remote) | Fixed server port. When not set, local sessions use a random port; remote sessions default to `19432`. |
| `SHUVPLAN_BROWSER` | system default | Custom browser to open the UI in. macOS: app name or path. Linux/Windows: executable path. Can also be a script. Takes priority over `BROWSER`. Also settable per-invocation with `--browser`. |
| `BROWSER` | (none) | Standard env var for specifying a browser. VS Code sets this automatically in devcontainers. Used as fallback when `SHUVPLAN_BROWSER` is not set. |
| `SHUVPLAN_ORIGIN` | auto-detect | Explicit agent-origin override. Valid values: `claude-code`, `opencode`, `codex`, `copilot-cli`, `gemini-cli`, `pi`. Invalid values silently fall through to env-based detection. |
| `SHUVPLAN_SHARE` | enabled | Set to `disabled` to turn off sharing. Hides share UI and import options. |
| `SHUVPLAN_SHARE_URL` | current hosted compatibility portal | Base URL for share links. Set this to `https://plan.shuv.dev` for the shuvplan-hosted portal after deployment smoke passes, or to your own portal when self-hosting. |
| `SHUVPLAN_PLAN_TIMEOUT_SECONDS` | `345600` | OpenCode only. `submit_plan` wait timeout in seconds. Set `0` to disable timeout. |

## Annotation variables

| Variable | Default | Description |
|----------|---------|-------------|
| `SHUVPLAN_JINA` | enabled | Set to `0` or `false` to disable Jina Reader for URL annotation. Set to `1` or `true` to enable (this is the default). Can also be set via `~/.shuvplan/config.json` (`{ "jina": false }`) or per-invocation via `--no-jina`. |
| `JINA_API_KEY` | (none) | Optional Jina Reader API key for higher rate limits. Without it: 20 req/min. With it: 500 req/min. Free keys available from [Jina](https://jina.ai/reader/) and include 10M tokens. |

## Paste service variables

| Variable | Default | Description |
|----------|---------|-------------|
| `SHUVPLAN_PASTE_URL` | current hosted compatibility paste API | Base URL of the paste service API. Set this to `https://paste.shuv.dev` for the shuvplan-hosted paste API after deployment smoke passes, or to your own paste service when self-hosting. |

### Self-hosted paste service

When running your own paste service binary, these variables configure it:

| Variable | Default | Description |
|----------|---------|-------------|
| `PASTE_PORT` | `19433` | Server port |
| `PASTE_DATA_DIR` | `~/.shuvplan/pastes` | Filesystem storage directory |
| `PASTE_TTL_DAYS` | `7` | Paste expiration in days |
| `PASTE_MAX_SIZE` | `524288` | Max payload size in bytes (512KB) |
| `PASTE_ALLOWED_ORIGINS` | `https://plan.shuv.dev,http://localhost:3001` | CORS allowed origins (comma-separated). Include the legacy share portal during the compatibility window if needed. |

## Install script variables

| Variable | Default | Description |
|----------|---------|-------------|
| `SHUVPLAN_VERIFY_ATTESTATION` | off | Set to `1` or `true` to have the install script run `gh attestation verify` on the downloaded binary. Requires `gh` CLI installed and authenticated. Can also be set via `~/.shuvplan/config.json` (`{ "verifyAttestation": true }`) or per-invocation via `--verify-attestation`. |
| `CLAUDE_CONFIG_DIR` | `~/.claude` | Custom Claude Code config directory. The install script places hooks here instead of the default location. |

## Remote mode behavior

When remote mode is forced with `SHUVPLAN_REMOTE=1` / `true`, or SSH is detected while `SHUVPLAN_REMOTE` is unset:

- Server binds to `SHUVPLAN_PORT` (default `19432`) instead of a random port
- Browser-opening behavior depends on the environment and configured browser handler
- In headless setups, you may need to open the forwarded URL manually

### Legacy SSH detection

These environment variables are still detected for backwards compatibility:

| Variable | Description |
|----------|-------------|
| `SSH_TTY` | Set by SSH when a TTY is allocated |
| `SSH_CONNECTION` | Set by SSH with connection details |

If either is present, shuvplan enables remote mode automatically when `SHUVPLAN_REMOTE` is unset. Set `SHUVPLAN_REMOTE=1` / `true` to force remote mode or `0` / `false` to force local mode.

## Port resolution order

1. `SHUVPLAN_PORT` environment variable (if valid integer 0-65535; `0` means random)
2. `19432` if in remote mode
3. `0` (random) if in local mode

## Custom browser examples

```bash
# macOS: open in Chrome
export SHUVPLAN_BROWSER="Google Chrome"

# macOS: open in specific app
export SHUVPLAN_BROWSER="/Applications/Firefox.app"

# Linux: open in Firefox
export SHUVPLAN_BROWSER="/usr/bin/firefox"

# Custom script for remote URL handling
export SHUVPLAN_BROWSER="/path/to/my-open-script.sh"
```
