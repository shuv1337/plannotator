import { afterEach, describe, expect, test } from "bun:test";
import { existsSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from "fs";
import { tmpdir } from "os";
import { join } from "path";
import { getLatestSubmission, listSubmissions, recordSubmission } from "./submissions";

const originalHome = process.env.HOME;
const tempHomes: string[] = [];

function useTempHome(): string {
  const home = mkdtempSync(join(tmpdir(), "shuvplan-submissions-test-"));
  process.env.HOME = home;
  tempHomes.push(home);
  return home;
}

afterEach(() => {
  if (originalHome === undefined) {
    delete process.env.HOME;
  } else {
    process.env.HOME = originalHome;
  }
  for (const home of tempHomes.splice(0)) {
    rmSync(home, { recursive: true, force: true });
  }
});

describe("submission data-dir migration", () => {
  test("records submissions under ~/.shuvplan", () => {
    const home = useTempHome();
    recordSubmission({ mode: "plan", origin: "codex", decision: "approved" });

    expect(existsSync(join(home, ".shuvplan", "submissions", "latest.json"))).toBe(true);
  });

  test("reads legacy latest submission when new submissions are missing", () => {
    const home = useTempHome();
    const legacyDir = join(home, ".plannotator", "submissions");
    mkdirSync(legacyDir, { recursive: true });
    writeFileSync(join(legacyDir, "latest.json"), JSON.stringify({
      id: "legacy",
      createdAt: "2026-05-28T00:00:00.000Z",
      mode: "plan",
      origin: "codex",
      cwd: home,
      decision: "denied",
    }));

    expect(getLatestSubmission()?.id).toBe("legacy");
    expect(listSubmissions()).toEqual([]);
  });
});
