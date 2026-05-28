import { afterEach, describe, expect, test } from "bun:test";
import {
  getPublicEnvValue,
  hasPublicEnvValue,
  legacyEnvName,
  publicEnvName,
} from "./env";

const savedEnv: Record<string, string | undefined> = {};
const envKeys = ["SHUVPLAN_REMOTE", "PLANNOTATOR_REMOTE", "SHUVPLAN_BROWSER", "PLANNOTATOR_BROWSER"];

function clearEnv() {
  for (const key of envKeys) {
    savedEnv[key] = process.env[key];
    delete process.env[key];
  }
}

afterEach(() => {
  for (const key of envKeys) {
    if (savedEnv[key] !== undefined) {
      process.env[key] = savedEnv[key];
    } else {
      delete process.env[key];
    }
  }
});

describe("public shuvplan env aliases", () => {
  test("SHUVPLAN_* wins over PLANNOTATOR_*", () => {
    clearEnv();
    process.env.SHUVPLAN_REMOTE = "1";
    process.env.PLANNOTATOR_REMOTE = "0";

    expect(getPublicEnvValue("REMOTE")).toBe("1");
  });

  test("falls back to PLANNOTATOR_* when SHUVPLAN_* is unset", () => {
    clearEnv();
    process.env.PLANNOTATOR_BROWSER = "/usr/bin/firefox";

    expect(getPublicEnvValue("BROWSER")).toBe("/usr/bin/firefox");
  });

  test("reports whether either public or legacy env name is present", () => {
    clearEnv();
    expect(hasPublicEnvValue("REMOTE")).toBe(false);

    process.env.PLANNOTATOR_REMOTE = "true";
    expect(hasPublicEnvValue("REMOTE")).toBe(true);
  });

  test("formats public and legacy names consistently", () => {
    expect(publicEnvName("PORT")).toBe("SHUVPLAN_PORT");
    expect(legacyEnvName("PORT")).toBe("PLANNOTATOR_PORT");
  });
});
