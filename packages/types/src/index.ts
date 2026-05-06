import { z } from 'zod';

/**
 * User & Authentication Types
 */
export const UserSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  name: z.string(),
  avatar: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type User = z.infer<typeof UserSchema>;

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
