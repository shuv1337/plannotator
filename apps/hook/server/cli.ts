export function isTopLevelHelpInvocation(args: string[]): boolean {
  return args[0] === "--help";
}

export function isVersionInvocation(args: string[]): boolean {
  return args[0] === "--version" || args[0] === "-v";
}

declare const __CLI_VERSION__: string;

export function formatVersion(): string {
  return `shuvplan ${typeof __CLI_VERSION__ !== "undefined" ? __CLI_VERSION__ : "dev"}`;
}

export function isInteractiveNoArgInvocation(
  args: string[],
  stdinIsTTY: boolean | undefined,
): boolean {
  return args.length === 0 && stdinIsTTY === true;
}

export function formatTopLevelHelp(): string {
  return [
    "Usage:",
    "  shuvplan --help",
    "  shuvplan --version, -v",
    "  shuvplan [--browser <name>]",
    "  shuvplan review [--git] [PR_URL]",
    "  shuvplan annotate <file.md | file.html | https://... | folder/>  [--no-jina] [--gate] [--json] [--hook]",
    "  shuvplan setup-goal <interview|facts> <bundle.json | -> [--json]",
    "  shuvplan last",
    "  shuvplan archive",
    "  shuvplan sessions",
    "  shuvplan submissions [--last] [--limit N]",
    "  shuvplan improve-context",
    "",
    "Note:",
    "  running 'shuvplan' without arguments is for hook integration and expects JSON on stdin",
    "  legacy 'plannotator' commands remain available during the compatibility window",
  ].join("\n");
}

export function formatInteractiveNoArgClarification(): string {
  return [
    "shuvplan (without arguments) is usually launched automatically by agent hooks.",
    "It expects hook JSON on stdin.",
    "",
    "For interactive use, try:",
    "  shuvplan review",
    "  shuvplan annotate <file.md | file.html | https://...>",
    "  shuvplan setup-goal interview bundle.json --json",
    "  shuvplan last",
    "  shuvplan archive",
    "  shuvplan sessions",
    "  shuvplan submissions --last",
    "",
    "Legacy 'plannotator' commands continue to work during the compatibility window.",
    "Run 'shuvplan --help' for top-level usage.",
  ].join("\n");
}
