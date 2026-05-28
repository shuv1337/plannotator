import { afterEach, describe, expect, test } from "bun:test";
import { mkdirSync, rmSync, writeFileSync } from "fs";
import { tmpdir } from "os";
import { join } from "path";
import {
  DATA_DIR_NAME,
  LEGACY_DATA_DIR_NAME,
  getDataDirForRead,
  getDataDirForWrite,
  getDataPathForRead,
  getDataPathForWrite,
  getDataRootForRead,
  getDataRootForWrite,
} from "./data-dir";

const originalHome = process.env.HOME;
const tempHomes: string[] = [];

function useTempHome(): string {
  const home = join(tmpdir(), `shuvplan-data-dir-test-${Date.now()}-${Math.random().toString(36).slice(2)}`);
  mkdirSync(home, { recursive: true });
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

describe("shuvplan data directory resolution", () => {
  test("writes to ~/.shuvplan", () => {
    const home = useTempHome();

    expect(getDataRootForWrite()).toBe(join(home, DATA_DIR_NAME));
    expect(getDataDirForWrite("plans")).toBe(join(home, DATA_DIR_NAME, "plans"));
    expect(getDataPathForWrite("config.json")).toBe(join(home, DATA_DIR_NAME, "config.json"));
  });

  test("reads legacy ~/.plannotator when ~/.shuvplan is missing", () => {
    const home = useTempHome();
    mkdirSync(join(home, LEGACY_DATA_DIR_NAME, "history"), { recursive: true });
    writeFileSync(join(home, LEGACY_DATA_DIR_NAME, "config.json"), "{}");

    expect(getDataRootForRead()).toBe(join(home, LEGACY_DATA_DIR_NAME));
    expect(getDataDirForRead("history")).toBe(join(home, LEGACY_DATA_DIR_NAME, "history"));
    expect(getDataPathForRead("config.json")).toBe(join(home, LEGACY_DATA_DIR_NAME, "config.json"));
  });

  test("prefers ~/.shuvplan when both new and legacy paths exist", () => {
    const home = useTempHome();
    mkdirSync(join(home, LEGACY_DATA_DIR_NAME, "drafts"), { recursive: true });
    mkdirSync(join(home, DATA_DIR_NAME, "drafts"), { recursive: true });

    expect(getDataRootForRead()).toBe(join(home, DATA_DIR_NAME));
    expect(getDataDirForRead("drafts")).toBe(join(home, DATA_DIR_NAME, "drafts"));
  });
});
