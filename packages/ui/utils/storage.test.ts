import { describe, expect, test } from "bun:test";
import { legacyCookieKey, primaryCookieKey, readCookieValue } from "./storage";

describe("cookie key migration helpers", () => {
  test("maps legacy plannotator keys to shuvplan primary keys", () => {
    expect(primaryCookieKey("plannotator-theme")).toBe("shuvplan-theme");
    expect(primaryCookieKey("shuvplan-theme")).toBe("shuvplan-theme");
    expect(primaryCookieKey("other")).toBe("other");
  });

  test("finds the legacy fallback key for shuvplan settings", () => {
    expect(legacyCookieKey("shuvplan-theme")).toBe("plannotator-theme");
    expect(legacyCookieKey("plannotator-theme")).toBe("plannotator-theme");
    expect(legacyCookieKey("other")).toBeNull();
  });

  test("reads encoded cookie values by exact key", () => {
    const cookie = "plannotator-theme=dark; shuvplan-color-theme=shuvplan%20night";

    expect(readCookieValue(cookie, "plannotator-theme")).toBe("dark");
    expect(readCookieValue(cookie, "shuvplan-color-theme")).toBe("shuvplan night");
    expect(readCookieValue(cookie, "theme")).toBeNull();
  });
});
