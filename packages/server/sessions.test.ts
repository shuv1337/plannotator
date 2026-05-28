import { afterEach, describe, expect, test } from "bun:test";
import { existsSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from "fs";
import { tmpdir } from "os";
import { join } from "path";
import { listSessions, registerSession, unregisterSession, type SessionInfo } from "./sessions";

const originalHome = process.env.HOME;
const tempHomes: string[] = [];

function useTempHome(): string {
  const home = mkdtempSync(join(tmpdir(), "shuvplan-sessions-test-"));
  process.env.HOME = home;
  tempHomes.push(home);
  return home;
}

function session(overrides: Partial<SessionInfo> = {}): SessionInfo {
  return {
    pid: process.pid,
    port: 19432,
    url: "http://localhost:19432",
    mode: "plan",
    project: "repo",
    startedAt: new Date().toISOString(),
    label: "Plan",
    ...overrides,
  };
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

describe("session data-dir migration", () => {
  test("registers sessions under ~/.shuvplan", () => {
    const home = useTempHome();
    registerSession(session());

    expect(existsSync(join(home, ".shuvplan", "sessions", `${process.pid}.json`))).toBe(true);
  });

  test("lists and unregisters legacy sessions when new sessions are missing", () => {
    const home = useTempHome();
    const legacyDir = join(home, ".plannotator", "sessions");
    mkdirSync(legacyDir, { recursive: true });
    const legacyPath = join(legacyDir, `${process.pid}.json`);
    writeFileSync(legacyPath, JSON.stringify(session()));

    expect(listSessions()).toHaveLength(1);
    unregisterSession();
    expect(existsSync(legacyPath)).toBe(false);
  });
});
