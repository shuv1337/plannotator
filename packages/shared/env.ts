const PUBLIC_ENV_PREFIX = "SHUVPLAN_";
const LEGACY_ENV_PREFIX = "PLANNOTATOR_";

/**
 * Resolve a public shuvplan/shuvplan environment variable.
 *
 * New SHUVPLAN_* names intentionally win over PLANNOTATOR_* for user-facing
 * settings. Internal transport variables should keep using explicit env reads
 * until they are promoted to public configuration.
 */
export function getPublicEnvValue(suffix: string): string | undefined {
  const publicKey = `${PUBLIC_ENV_PREFIX}${suffix}`;
  const legacyKey = `${LEGACY_ENV_PREFIX}${suffix}`;
  return process.env[publicKey] ?? process.env[legacyKey];
}

export function hasPublicEnvValue(suffix: string): boolean {
  return getPublicEnvValue(suffix) !== undefined;
}

export function publicEnvName(suffix: string): string {
  return `${PUBLIC_ENV_PREFIX}${suffix}`;
}

export function legacyEnvName(suffix: string): string {
  return `${LEGACY_ENV_PREFIX}${suffix}`;
}

export function publicEnvNames(suffix: string): string {
  return `${publicEnvName(suffix)}/${legacyEnvName(suffix)}`;
}
