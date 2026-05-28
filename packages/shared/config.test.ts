import { afterEach, describe, expect, test } from "bun:test";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "fs";
import { tmpdir } from "os";
import { join } from "path";
import { loadConfig, saveConfig } from "./config";

const originalHome = process.env.HOME;
const tempHomes: string[] = [];

function useTempHome(): string {
  const home = mkdtempSync(join(tmpdir(), "shuvplan-config-test-"));
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

describe("config data-dir migration", () => {
  test("loads legacy ~/.plannotator config when ~/.shuvplan is missing", () => {
    const home = useTempHome();
    const legacyDir = join(home, ".plannotator");
    mkdirSync(legacyDir, { recursive: true });
    writeFileSync(join(legacyDir, "config.json"), JSON.stringify({ displayName: "legacy" }));

    expect(loadConfig().displayName).toBe("legacy");
  });

  test("saves merged config to ~/.shuvplan without deleting legacy config", () => {
    const home = useTempHome();
    const legacyDir = join(home, ".plannotator");
    mkdirSync(legacyDir, { recursive: true });
    writeFileSync(join(legacyDir, "config.json"), JSON.stringify({ displayName: "legacy" }));

    saveConfig({ diffOptions: { defaultDiffType: "staged" } });

    const nextPath = join(home, ".shuvplan", "config.json");
    expect(existsSync(nextPath)).toBe(true);
    expect(existsSync(join(legacyDir, "config.json"))).toBe(true);
    expect(JSON.parse(readFileSync(nextPath, "utf-8"))).toMatchObject({
      displayName: "legacy",
      diffOptions: { defaultDiffType: "staged" },
    });
  });
});
