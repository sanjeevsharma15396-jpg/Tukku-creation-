import { DarkSurfacePreset } from '../types';

export const THEME_PRESETS: Record<
  DarkSurfacePreset,
  {
    background: string;
    surface: string;
    surfaceElevated: string;
    border: string;
    borderStrong: string;
    heroGradient: readonly [string, string, string];
  }
> = {
  obsidian: {
    background: '#07060B',
    surface: '#100D1A',
    surfaceElevated: '#171226',
    border: 'rgba(167, 139, 250, 0.14)',
    borderStrong: 'rgba(167, 139, 250, 0.30)',
    heroGradient: ['#190B33', '#2E1065', '#0D0917'],
  },
  amethyst: {
    background: '#0B0714',
    surface: '#140E24',
    surfaceElevated: '#1D1433',
    border: 'rgba(192, 132, 252, 0.18)',
    borderStrong: 'rgba(192, 132, 252, 0.36)',
    heroGradient: ['#240B47', '#3B0764', '#120B24'],
  },
};

export const COLORS = {
  textPrimary: '#F5F3FF',
  textSecondary: '#C4B5FD',
  textMuted: '#8B7FA8',
  violetPrimary: '#7C3AED',
  violetBright: '#8B5CF6',
  amethyst: '#A855F7',
  deepPurple: '#4C1D95',
  danger: '#F87171',
  dangerSurface: 'rgba(248, 113, 113, 0.12)',
  primaryGradient: ['#7C3AED', '#9333EA'] as readonly [string, string],
  violetSoftGradient: ['rgba(124, 58, 237, 0.24)', 'rgba(88, 28, 135, 0.12)'] as readonly [
    string,
    string,
  ],
};

export const RADIUS = {
  sm: 10,
  md: 14,
  lg: 20,
  xl: 24,
  full: 999,
};
