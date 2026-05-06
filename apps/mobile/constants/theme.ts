/**
 * SportSpot Design Tokens
 * Theme configuration with colors, fonts, spacing, and border radius
 */

/**
 * Color Palette
 */
export const Colors = {
  // Primary
  primary: '#A3E635', // Neon lime green

  // Backgrounds
  background: '#15011B', // Deep purple/black
  secondaryBackground: '#322A3E', // Muted purple

  // Accents
  accent1: '#294FF6', // Blue accent
  accent2: '#FF6B6B', // Red accent

  // Gradients (use with LinearGradient component)
  gradient: {
    purple: '#A259FF',
    purpleOpacity: 'rgba(162, 89, 255, 0.4)', // 40% opacity
    red: '#FF6B6B',
    redOpacity: 'rgba(255, 107, 107, 0.1)', // 10% opacity
  },

  // Neutral
  white: '#FFFFFF',
  black: '#000000',

  // Grayscale (for text and disabled states)
  gray: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827',
  },

  // Semantic colors
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',
} as const;

/**
 * Font Families
 * BebasNeue, DMSans, SpaceMono must be loaded via Expo.Font
 */
export const Fonts = {
  bebasNeue: 'BebasNeue',
  dmSans: 'DMSans',
  spaceMono: 'SpaceMono',
} as const;

/**
 * Typography Scale
 * Defines font sizes and weights for different text elements
 */
export const Typography = {
  // Headings
  h1: {
    fontSize: 32,
    fontWeight: '700' as const,
    fontFamily: Fonts.bebasNeue,
    lineHeight: 40,
  },
  h2: {
    fontSize: 28,
    fontWeight: '700' as const,
    fontFamily: Fonts.bebasNeue,
    lineHeight: 36,
  },
  h3: {
    fontSize: 24,
    fontWeight: '600' as const,
    fontFamily: Fonts.dmSans,
    lineHeight: 32,
  },

  // Body text
  bodyLarge: {
    fontSize: 18,
    fontWeight: '400' as const,
    fontFamily: Fonts.dmSans,
    lineHeight: 28,
  },
  body: {
    fontSize: 16,
    fontWeight: '400' as const,
    fontFamily: Fonts.dmSans,
    lineHeight: 24,
  },
  bodySmall: {
    fontSize: 14,
    fontWeight: '400' as const,
    fontFamily: Fonts.dmSans,
    lineHeight: 20,
  },

  // Labels and captions
  label: {
    fontSize: 12,
    fontWeight: '500' as const,
    fontFamily: Fonts.spaceMono,
    lineHeight: 16,
  },
  caption: {
    fontSize: 12,
    fontWeight: '400' as const,
    fontFamily: Fonts.dmSans,
    lineHeight: 16,
  },
} as const;

/**
 * Spacing Scale
 * Used for padding, margin, and gap values
 */
export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  huge: 48,
} as const;

/**
 * Border Radius Scale
 * Used for component corners and roundness
 */
export const BorderRadius = {
  none: 0,
  xs: 4,
  sm: 6,
  md: 8,
  lg: 12,
  xl: 16,
  xxl: 20,
  full: 9999, // for circular elements
} as const;

/**
 * Shadows (optional, for elevation)
 */
export const Shadows = {
  sm: {
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  md: {
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 4,
  },
  lg: {
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  xl: {
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 12,
  },
} as const;

/**
 * Animation Durations (in milliseconds)
 */
export const AnimationDurations = {
  fast: 150,
  base: 300,
  slow: 500,
} as const;

/**
 * Zindex hierarchy for layering
 */
export const ZIndex = {
  base: 0,
  dropdown: 1000,
  sticky: 1100,
  fixed: 1200,
  modal: 1300,
  popover: 1400,
  tooltip: 1500,
} as const;
