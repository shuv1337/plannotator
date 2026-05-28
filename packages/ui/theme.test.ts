import { describe, expect, it } from 'bun:test';
import {
  DEFAULT_COLOR_THEME,
  DEFAULT_THEME_MODE,
  resolveThemeClasses,
} from './components/ThemeProvider';
import { BUILT_IN_THEMES } from './utils/themeRegistry';

describe('shuvplan theme defaults', () => {
  it('registers shuvplan as the first dual-mode built-in theme', () => {
    const theme = BUILT_IN_THEMES[0];

    expect(theme.id).toBe('shuvplan');
    expect(theme.name).toBe('shuvplan');
    expect(theme.builtIn).toBe(true);
    expect(theme.modeSupport).toBe('both');
    expect(theme.colors.light.background).toBe('#faf9f6');
    expect(theme.colors.dark.background).toBe('#011627');
  });

  it('uses shuvplan and system mode as provider defaults', () => {
    expect(DEFAULT_COLOR_THEME).toBe('shuvplan');
    expect(DEFAULT_THEME_MODE).toBe('system');
  });

  it('resolves shuvplan light and dark classes without mode locking', () => {
    expect(resolveThemeClasses('shuvplan', 'light')).toBe('theme-shuvplan light');
    expect(resolveThemeClasses('shuvplan', 'dark')).toBe('theme-shuvplan');
  });

  it('keeps legacy light-only and dark-only theme mode locking', () => {
    expect(resolveThemeClasses('one-light', 'dark')).toBe('theme-one-light light');
    expect(resolveThemeClasses('night-owl', 'light')).toBe('theme-night-owl');
  });
});
