import { z } from 'zod';

/**
 * User & Authentication Types
 */
export const UserSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  name: z.string(),
  avatar: z.string().optional(),
  sports: z.array(z.string()).default([]),
  level: z.enum(['beginner', 'intermediate', 'advanced']).default('beginner'),
  locality: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type User = z.infer<typeof UserSchema>;

/**
 * Auth Session Types
 */
export const AuthSessionSchema = z.object({
  access_token: z.string(),
  refresh_token: z.string().optional(),
  expires_in: z.number(),
  expires_at: z.number().optional(),
  token_type: z.string().default('Bearer'),
  user: z.object({
    id: z.string(),
    email: z.string().email(),
    phone: z.string().optional(),
  }),
});

export type AuthSession = z.infer<typeof AuthSessionSchema>;

/**
 * Onboarding Types
 */
export const OnboardingInputSchema = z.object({
  sports: z.array(z.string()).min(1, 'Select at least one sport'),
  level: z.enum(['beginner', 'intermediate', 'advanced']),
  locality: z.string().min(2, 'Locality is required'),
});

export type OnboardingInput = z.infer<typeof OnboardingInputSchema>;

/**
 * Venue Types
 */
export const VenueSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  latitude: z.number(),
  longitude: z.number(),
  sports: z.array(z.string()),
  rating: z.number().min(0).max(5),
  reviewCount: z.number().nonnegative(),
  image: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Venue = z.infer<typeof VenueSchema>;

/**
 * Sport Types
 */
export const SportSchema = z.object({
  id: z.string(),
  name: z.string(),
  icon: z.string(),
  description: z.string().optional(),
});

export type Sport = z.infer<typeof SportSchema>;

/**
 * Review Types
 */
export const ReviewSchema = z.object({
  id: z.string(),
  userId: z.string(),
  venueId: z.string(),
  rating: z.number().min(1).max(5),
  comment: z.string(),
  createdAt: z.date(),
});

export type Review = z.infer<typeof ReviewSchema>;

/**
 * API Response Types
 */
export const ApiResponseSchema = z.object({
  success: z.boolean(),
  data: z.unknown().optional(),
  error: z.string().optional(),
  timestamp: z.string(),
});

export type ApiResponse<T = unknown> = z.infer<typeof ApiResponseSchema> & {
  data?: T;
};
