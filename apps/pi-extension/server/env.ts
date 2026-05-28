const PUBLIC_ENV_PREFIX = "SHUVPLAN_";
const LEGACY_ENV_PREFIX = "PLANNOTATOR_";

export function getPublicEnvValue(suffix: string): string | undefined {
	const publicKey = `${PUBLIC_ENV_PREFIX}${suffix}`;
	const legacyKey = `${LEGACY_ENV_PREFIX}${suffix}`;
	return process.env[publicKey] ?? process.env[legacyKey];
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
