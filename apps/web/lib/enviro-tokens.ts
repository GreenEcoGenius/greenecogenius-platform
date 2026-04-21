/**
 * Enviro Design Tokens — TypeScript mirror.
 *
 * Source of truth: `apps/web/styles/theme.css` (block "ENVIRO DESIGN TOKENS").
 *
 * Use this module from JavaScript / TypeScript contexts that cannot read CSS
 * variables directly:
 *   - Recharts (chart palettes, axis colors)
 *   - GSAP / ScrollTrigger (durations, eases, transforms)
 *   - Framer Motion (spring configs, eases, durations)
 *   - Canvas / SVG runtime drawings
 *   - Tests / snapshots
 *
 * IMPORTANT
 * - Always keep this file in sync with `theme.css` enviro-* values.
 * - Never import this file from a Server Component to render inline styles
 *   that should react to CSS variables. Prefer Tailwind classes mapped to
 *   the same tokens (e.g. `bg-[--color-enviro-forest-900]` or a wrapper
 *   utility) so the values stay declarative.
 */

export const enviroColors = {
  forest: {
    50: '#ecf8f8',
    100: '#cfe6e6',
    200: '#9fcdcd',
    300: '#6fb3b3',
    400: '#4a8f8f',
    500: '#346868',
    600: '#2b5151',
    700: '#1f4646',
    800: '#103535',
    900: '#063232',
    950: '#021c1c',
  },
  lime: {
    50: '#f4faea',
    100: '#e6f4d2',
    200: '#d4eaae',
    300: '#c2df93',
    400: '#a9cf6c',
    500: '#8fbf4a',
    600: '#729b35',
    700: '#57752a',
    800: '#3f5620',
    900: '#2b3b18',
  },
  ember: {
    50: '#fdeee7',
    100: '#fbd4c1',
    200: '#f7ad8b',
    300: '#f08458',
    400: '#ea6c3c',
    500: '#e3572b',
    600: '#c1431d',
    700: '#9a3517',
    800: '#6f2611',
    900: '#4a190b',
  },
  cream: {
    50: '#f7fbfb',
    100: '#ecf8f8',
    200: '#e5e5e5',
    300: '#d4d4d4',
    400: '#a3a3a3',
    500: '#737373',
  },
  white: '#ffffff',
  black: '#000000',
  overlayStrong: 'rgba(0, 0, 0, 0.9)',
  overlaySoft: 'rgba(6, 50, 50, 0)',
  textOnDark: 'rgba(255, 255, 255, 0.7)',
} as const;

export const enviroSemantic = {
  bg: enviroColors.cream[100],
  bgElevated: enviroColors.white,
  bgInverse: enviroColors.forest[900],
  bgInverseElevated: enviroColors.forest[700],
  fg: enviroColors.forest[900],
  fgMuted: enviroColors.forest[600],
  fgInverse: enviroColors.white,
  fgInverseMuted: enviroColors.textOnDark,
  border: enviroColors.cream[300],
  borderStrong: enviroColors.forest[600],
  borderOnDark: 'rgba(255, 255, 255, 0.12)',
  accent: enviroColors.lime[300],
  accentFg: enviroColors.forest[900],
  cta: enviroColors.ember[500],
  ctaHover: enviroColors.ember[600],
  ctaFg: enviroColors.white,
} as const;

export const enviroFonts = {
  display:
    "var(--font-enviro-display), 'Inter', system-ui, sans-serif",
  sans: "var(--font-enviro-sans), 'Inter', system-ui, sans-serif",
  mono: "ui-monospace, SFMono-Regular, 'JetBrains Mono', Menlo, monospace",
} as const;

export const enviroTextSizes = {
  xs: '12px',
  sm: '14px',
  base: '16px',
  md: '18px',
  lg: '20px',
  xl: '22px',
  '2xl': '24px',
  '3xl': '28px',
  '4xl': '32px',
  '5xl': '40px',
  '6xl': '48px',
  '7xl': '64px',
  '8xl': '98px',
  '9xl': '170px',
} as const;

export const enviroDisplaySizes = {
  sm: 'clamp(2rem, 4vw + 1rem, 3rem)',
  md: 'clamp(2.5rem, 6vw + 1rem, 4.5rem)',
  lg: 'clamp(3rem, 8vw + 1rem, 6.5rem)',
  xl: 'clamp(3.5rem, 10vw + 1rem, 9rem)',
  '2xl': 'clamp(4rem, 12vw + 1rem, 10.625rem)',
} as const;

export const enviroLineHeights = {
  tight: 1,
  snug: 1.1,
  display: 1.2,
  base: 1.3,
  relaxed: 1.4,
  loose: 1.5,
} as const;

export const enviroLetterSpacings = {
  tight: '-1px',
  display: '-0.02em',
  normal: '0',
  wide: '0.04em',
  bracket: '0.08em',
} as const;

export const enviroFontWeights = {
  normal: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
  display: 800,
} as const;

export const enviroRadii = {
  xs: '8px',
  sm: '10px',
  md: '12px',
  lg: '16px',
  xl: '20px',
  '2xl': '25px',
  '3xl': '30px',
  '4xl': '32px',
  '5xl': '40px',
  '6xl': '50px',
  pill: '999px',
} as const;

export const enviroSpacing = {
  1: '6px',
  2: '8px',
  3: '10px',
  4: '12px',
  5: '16px',
  6: '20px',
  7: '24px',
  8: '30px',
  9: '32px',
  10: '40px',
  11: '48px',
  12: '56px',
  13: '64px',
  14: '80px',
  15: '110px',
} as const;

export const enviroSection = {
  ySm: '48px',
  yMd: '80px',
  yLg: '110px',
  yXl: '160px',
} as const;

export const enviroContainers = {
  sm: '640px',
  md: '1024px',
  lg: '1280px',
  xl: '1440px',
} as const;

export const enviroShadows = {
  sm: '0 1px 2px rgba(6, 50, 50, 0.06)',
  md: '0 4px 12px rgba(6, 50, 50, 0.08)',
  lg: '0 12px 32px rgba(6, 50, 50, 0.12)',
  xl: '0 24px 64px rgba(6, 50, 50, 0.18)',
  card: '0 2px 8px rgba(6, 50, 50, 0.06), 0 0 0 1px rgba(6, 50, 50, 0.04)',
  elevated: '0 16px 48px rgba(6, 50, 50, 0.16)',
  glowLime: '0 0 0 4px rgba(194, 223, 147, 0.35)',
  glowEmber: '0 0 0 4px rgba(227, 87, 43, 0.35)',
  focus: '0 0 0 3px rgba(194, 223, 147, 0.6)',
  insetCard: 'inset 0 0 0 1px rgba(255, 255, 255, 0.08)',
} as const;

/**
 * Eases as cubic-bezier strings (CSS-compatible).
 * For GSAP, prefer `enviroEasesGsap`. For Framer Motion, prefer
 * `enviroEasesFramer` (numeric tuples).
 */
export const enviroEases = {
  out: 'cubic-bezier(0.16, 1, 0.3, 1)',
  outSoft: 'cubic-bezier(0.22, 1, 0.36, 1)',
  inOut: 'cubic-bezier(0.83, 0, 0.17, 1)',
  spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
  linear: 'cubic-bezier(0, 0, 1, 1)',
} as const;

/** Framer Motion-friendly bezier tuples. */
export const enviroEasesFramer = {
  out: [0.16, 1, 0.3, 1] as const,
  outSoft: [0.22, 1, 0.36, 1] as const,
  inOut: [0.83, 0, 0.17, 1] as const,
  spring: [0.34, 1.56, 0.64, 1] as const,
  linear: [0, 0, 1, 1] as const,
};

/** GSAP-friendly ease names (mapped to GSAP's CustomEase / built-ins). */
export const enviroEasesGsap = {
  out: 'expo.out',
  outSoft: 'power3.out',
  inOut: 'power4.inOut',
  spring: 'back.out(1.6)',
  linear: 'none',
} as const;

/** Durations in milliseconds. Use `* 1` for ms or `/ 1000` for seconds. */
export const enviroDurationsMs = {
  fast: 150,
  base: 300,
  slow: 600,
  slower: 900,
  slowest: 1400,
} as const;

/** Durations in seconds — convenient for GSAP / Framer Motion. */
export const enviroDurations = {
  fast: 0.15,
  base: 0.3,
  slow: 0.6,
  slower: 0.9,
  slowest: 1.4,
} as const;

export const enviroGradients = {
  heroOverlay:
    'linear-gradient(180deg, rgba(0, 0, 0, 0.9) 0%, rgba(6, 50, 50, 0) 50%, rgba(0, 0, 0, 0.9) 100%)',
  cream: 'linear-gradient(135deg, #f7fbfb 0%, #ecf8f8 100%)',
  forest: 'linear-gradient(180deg, #063232 0%, #1f4646 100%)',
  emberCta: 'linear-gradient(135deg, #e3572b 0%, #c1431d 100%)',
  limeSoft:
    'linear-gradient(135deg, rgba(194, 223, 147, 0.2) 0%, rgba(194, 223, 147, 0) 100%)',
} as const;

export const enviroZIndex = {
  base: 0,
  raised: 10,
  sticky: 30,
  overlay: 40,
  modal: 50,
  popover: 60,
  toast: 70,
} as const;

/**
 * Recharts palette — ordered for Enviro brand consistency on multi-series.
 * 1) Lime accent  2) Forest deep  3) Ember CTA  4) Cream mid  5) Forest mid
 */
export const enviroChartPalette = [
  enviroColors.lime[400],
  enviroColors.forest[800],
  enviroColors.ember[500],
  enviroColors.cream[400],
  enviroColors.forest[500],
  enviroColors.lime[600],
  enviroColors.ember[300],
] as const;

/**
 * Aggregated default export — convenient `import enviro from '~/lib/enviro-tokens'`.
 */
const enviroTokens = {
  colors: enviroColors,
  semantic: enviroSemantic,
  fonts: enviroFonts,
  text: enviroTextSizes,
  display: enviroDisplaySizes,
  leading: enviroLineHeights,
  tracking: enviroLetterSpacings,
  weight: enviroFontWeights,
  radii: enviroRadii,
  space: enviroSpacing,
  section: enviroSection,
  containers: enviroContainers,
  shadows: enviroShadows,
  eases: enviroEases,
  easesFramer: enviroEasesFramer,
  easesGsap: enviroEasesGsap,
  durationsMs: enviroDurationsMs,
  durations: enviroDurations,
  gradients: enviroGradients,
  z: enviroZIndex,
  chart: enviroChartPalette,
} as const;

export type EnviroTokens = typeof enviroTokens;

export default enviroTokens;
