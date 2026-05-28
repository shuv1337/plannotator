import { describe, expect, test } from "bun:test";
import {
  formatInteractiveNoArgClarification,
  formatTopLevelHelp,
  formatVersion,
  isInteractiveNoArgInvocation,
  isTopLevelHelpInvocation,
  isVersionInvocation,
} from "./cli";

describe("CLI top-level help", () => {
  test("recognizes top-level --help", () => {
    expect(isTopLevelHelpInvocation(["--help"])).toBe(true);
    expect(isTopLevelHelpInvocation([])).toBe(false);
    expect(isTopLevelHelpInvocation(["review", "--help"])).toBe(false);
  });

  test("renders concise top-level usage", () => {
    const output = formatTopLevelHelp();

    expect(output).toContain("shuvplan --help");
    expect(output).toContain("shuvplan --version, -v");
    expect(output).toContain("shuvplan [--browser <name>]");
    expect(output).toContain("shuvplan review [--git] [PR_URL]");
    expect(output).toContain("shuvplan annotate <file.md | file.html | https://... | folder/>");
    expect(output).toContain("shuvplan setup-goal <interview|facts>");
    expect(output).toContain("shuvplan submissions [--last] [--limit N]");
    expect(output).toContain("legacy 'plannotator' commands remain available");
  });
});

describe("CLI --version", () => {
  test("recognizes --version and -v", () => {
    expect(isVersionInvocation(["--version"])).toBe(true);
    expect(isVersionInvocation(["-v"])).toBe(true);
    expect(isVersionInvocation([])).toBe(false);
    expect(isVersionInvocation(["review"])).toBe(false);
  });

  test("formats version string", () => {
    const output = formatVersion();
    expect(output).toStartWith("shuvplan ");
  });
});

describe("interactive no-arg invocation", () => {
  test("detects bare interactive invocation only when stdin is a TTY", () => {
    expect(isInteractiveNoArgInvocation([], true)).toBe(true);
    expect(isInteractiveNoArgInvocation([], false)).toBe(false);
    expect(isInteractiveNoArgInvocation([], undefined)).toBe(false);
    expect(isInteractiveNoArgInvocation(["review"], true)).toBe(false);
  });

  test("renders clarification for interactive users", () => {
    const output = formatInteractiveNoArgClarification();

    expect(output).toContain("usually launched automatically by agent hooks");
    expect(output).toContain("It expects hook JSON on stdin.");
    expect(output).toContain("shuvplan review");
    expect(output).toContain("shuvplan setup-goal interview bundle.json --json");
    expect(output).toContain("shuvplan sessions");
    expect(output).toContain("shuvplan submissions --last");
    expect(output).toContain("Run 'shuvplan --help' for top-level usage.");
  });
});
