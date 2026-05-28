/**
 * shuvplan data directory resolution.
 *
 * New writes go to ~/.shuvplan. Reads prefer ~/.shuvplan and fall back to
 * ~/.plannotator when the new path does not exist, preserving existing installs
 * through the compatibility window.
 */

import { existsSync, mkdirSync } from "fs";
import { homedir } from "os";
import { dirname, join } from "path";

export const DATA_DIR_NAME = ".shuvplan";
export const LEGACY_DATA_DIR_NAME = ".plannotator";

function currentHomeDir(): string {
  return process.env.HOME || process.env.USERPROFILE || homedir();
}

export function getDataRootForWrite(): string {
  const dir = join(currentHomeDir(), DATA_DIR_NAME);
  mkdirSync(dir, { recursive: true });
  return dir;
}

export function getDataRootForRead(): string {
  const next = join(currentHomeDir(), DATA_DIR_NAME);
  if (existsSync(next)) return next;

  const legacy = join(currentHomeDir(), LEGACY_DATA_DIR_NAME);
  return existsSync(legacy) ? legacy : next;
}

export function getLegacyDataRoot(): string {
  return join(currentHomeDir(), LEGACY_DATA_DIR_NAME);
}

export function getDataDirForWrite(...segments: string[]): string {
  const dir = join(getDataRootForWrite(), ...segments);
  mkdirSync(dir, { recursive: true });
  return dir;
}

export function getDataDirForRead(...segments: string[]): string {
  const next = join(currentHomeDir(), DATA_DIR_NAME, ...segments);
  if (existsSync(next)) return next;

  const legacy = join(currentHomeDir(), LEGACY_DATA_DIR_NAME, ...segments);
  return existsSync(legacy) ? legacy : next;
}

export function getDataPathForWrite(...segments: string[]): string {
  const filePath = join(getDataRootForWrite(), ...segments);
  mkdirSync(dirname(filePath), { recursive: true });
  return filePath;
}

export function getDataPathForRead(...segments: string[]): string {
  const next = join(currentHomeDir(), DATA_DIR_NAME, ...segments);
  if (existsSync(next)) return next;

  const legacy = join(currentHomeDir(), LEGACY_DATA_DIR_NAME, ...segments);
  return existsSync(legacy) ? legacy : next;
}
