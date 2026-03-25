/**
 * Linear interpolation between two values
 */
export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t
}

/**
 * Prism color spectrum constants
 */
export const PRISM_COLORS = {
  red: '#E60023',
  orange: '#FF7E4A',
  gold: '#FFD040',
  white: '#FFFFFF',
  cyan: '#97FEFF',
  azure: '#00D4FF',
  blue: '#0044FF',
  navy: '#000C50',
} as const

/**
 * Prism hue values for canvas animations
 */
export const PRISM_HUES = [348, 15, 22, 40, 55, 181, 200, 213, 240] as const

/**
 * Terminal/TerminalBlock color map
 */
export const TERMINAL_COLORS = ['#97FEFF', '#FFD040', '#FF7E4A', '#0044FF'] as const

/**
 * Constants
 */
export const PI2 = Math.PI * 2
