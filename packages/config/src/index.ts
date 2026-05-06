/**
 * Design System & Configuration
 * SportSpot - Urban Sports Discovery for Bangalore
 */

/**
 * Colors (from PRD Section 3)
 */
export const Colors = {
  primary: '#A3E635', // Neon lime green
  background: '#15011B', // Deep purple/black
  secondary: '#322A3E', // Muted purple
  accent1: '#294FF6', // Blue accent
  accent2: '#FF6B6B', // Red accent
  white: '#FFFFFF',
  black: '#000000',
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
} as const;

/**
 * Fonts (from PRD Section 3)
 */
export const Fonts = {
  bebasNeue: 'BebasNeue',
  dmSans: 'DMSans',
  spaceMono: 'SpaceMono',
} as const;

/**
 * Typography Scale
 */
export const Typography = {
  h1: {
    fontSize: 32,
    fontWeight: '700' as const,
    fontFamily: Fonts.bebasNeue,
  },
  h2: {
    fontSize: 24,
    fontWeight: '700' as const,
    fontFamily: Fonts.bebasNeue,
  },
  h3: {
    fontSize: 20,
    fontWeight: '600' as const,
    fontFamily: Fonts.dmSans,
  },
  body: {
    fontSize: 16,
    fontWeight: '400' as const,
    fontFamily: Fonts.dmSans,
  },
  bodySmall: {
    fontSize: 14,
    fontWeight: '400' as const,
    fontFamily: Fonts.dmSans,
  },
  label: {
    fontSize: 12,
    fontWeight: '500' as const,
    fontFamily: Fonts.spaceMono,
  },
} as const;

/**
 * Spacing Scale
 */
export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
} as const;

/**
 * API Configuration
 */
export const API_CONFIG = {
  baseUrl: process.env.API_URL || 'http://localhost:3001',
  timeout: 10000,
} as const;

/**
 * Service URLs
 */
export const SERVICE_URLS = {
  supabase: process.env.SUPABASE_URL || 'https://qipjqinxkgjtaodjvcld.supabase.co',
  redis: process.env.REDIS_URL || 'https://integral-shrew-94551.upstash.io',
} as const;

/**
 * Feature Flags
 */
export const FEATURES = {
  enableNotifications: true,
  enableOfflineSupport: true,
  enableLocationTracking: true,
  enableQRCodeScanning: true,
} as const;

/**
 * Map Configuration (for react-native-maps)
 */
export const MAP_CONFIG = {
  defaultLatitude: 13.0827, // Bangalore, India
  defaultLongitude: 80.2707,
  defaultZoom: 13,
  radiusKm: 5,
} as const;

/**
 * Pagination
 */
export const PAGINATION = {
  defaultPageSize: 20,
  maxPageSize: 100,
} as const;
