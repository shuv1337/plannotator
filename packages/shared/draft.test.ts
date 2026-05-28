import { afterEach, describe, expect, test } from "bun:test";
import { existsSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from "fs";
import { tmpdir } from "os";
import { join } from "path";
import { deleteDraft, getDraftDir, loadDraft, saveDraft } from "./draft";

const originalHome = process.env.HOME;
const tempHomes: string[] = [];

function useTempHome(): string {
  const home = mkdtempSync(join(tmpdir(), "shuvplan-draft-test-"));
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

describe("draft data-dir migration", () => {
  test("writes drafts to ~/.shuvplan", () => {
    const home = useTempHome();
    saveDraft("abc", { value: 1 });

    expect(getDraftDir()).toBe(join(home, ".shuvplan", "drafts"));
    expect(existsSync(join(home, ".shuvplan", "drafts", "abc.json"))).toBe(true);
  });

  test("loads and deletes legacy draft when new draft is missing", () => {
    const home = useTempHome();
    const legacyDir = join(home, ".plannotator", "drafts");
    mkdirSync(legacyDir, { recursive: true });
    const legacyPath = join(legacyDir, "abc.json");
    writeFileSync(legacyPath, JSON.stringify({ value: 2 }));

    expect(loadDraft("abc")).toEqual({ value: 2 });
    deleteDraft("abc");
    expect(existsSync(legacyPath)).toBe(false);
  });
});
