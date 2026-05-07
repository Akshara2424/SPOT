import { initTRPC, TRPCError } from '@trpc/server';
import { z } from 'zod';
import { createClient } from '@supabase/supabase-js';

/**
 * Redefine schemas locally to avoid cross-package import issues
 */
const OnboardingInputSchema = z.object({
  sports: z.array(z.string()).min(1, 'Select at least one sport'),
  level: z.enum(['beginner', 'intermediate', 'advanced']),
  locality: z.string().min(2, 'Locality is required'),
});

const AuthSessionSchema = z.object({
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

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase credentials are missing');
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Initialize tRPC
const t = initTRPC.create();

/**
 * Send OTP via SMS to phone number
 * Returns nothing on success, user should wait for SMS
 */
export const sendOtpProcedure = t.procedure
  .input(
    z.object({
      phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number'),
    })
  )
  .mutation(async ({ input }) => {
    try {
      const { error } = await supabase.auth.signInWithOtp({
        phone: input.phone,
      });

      if (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: error.message,
        });
      }

      return { success: true };
    } catch (error) {
      if (error instanceof TRPCError) throw error;
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to send OTP',
      });
    }
  });

/**
 * Verify OTP and establish session
 * Returns auth session with access token
 */
export const verifyOtpProcedure = t.procedure
  .input(
    z.object({
      phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number'),
      token: z.string().min(6, 'Invalid OTP'),
    })
  )
  .mutation(async ({ input }) => {
    try {
      const { data, error } = await supabase.auth.verifyOtp({
        phone: input.phone,
        token: input.token,
        type: 'sms',
      });

      if (error || !data.session) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: error?.message || 'Invalid OTP',
        });
      }

      return AuthSessionSchema.parse({
        access_token: data.session.access_token,
        refresh_token: data.session.refresh_token,
        expires_in: data.session.expires_in,
        expires_at: data.session.expires_at,
        token_type: 'Bearer',
        user: {
          id: data.user.id,
          email: data.user.email || '',
          phone: data.user.phone,
        },
      });
    } catch (error) {
      if (error instanceof TRPCError) throw error;
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'OTP verification failed',
      });
    }
  });

/**
 * Complete user onboarding
 * Requires valid session token in Authorization header
 */
export const completeOnboardingProcedure = t.procedure
  .input(OnboardingInputSchema)
  .mutation(async ({ input, ctx }) => {
    try {
      // Get auth token from context (injected from middleware)
      const token = (ctx as any)?.token;
      if (!token) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'No authentication token provided',
        });
      }

      // Create authenticated Supabase client with token
      const authedSupabase = createClient(supabaseUrl, supabaseAnonKey, {
        global: {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      });

      // Get current user
      const { data: userData, error: userError } =
        await authedSupabase.auth.getUser();

      if (userError || !userData.user) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'Invalid or expired token',
        });
      }

      // Update user profile in database (assumes users table exists)
      const { error: updateError } = await authedSupabase
        .from('users')
        .update({
          sports: input.sports,
          level: input.level,
          locality: input.locality,
          updated_at: new Date().toISOString(),
        })
        .eq('id', userData.user.id);

      if (updateError) {
        // If users table doesn't exist yet, just return success
        // In production, ensure your database schema is set up
        console.warn('Could not update user profile:', updateError);
      }

      return {
        success: true,
        userId: userData.user.id,
      };
    } catch (error) {
      if (error instanceof TRPCError) throw error;
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Onboarding failed',
      });
    }
  });

/**
 * Logout and invalidate session
 * Requires valid session token
 */
export const logoutProcedure = t.procedure.mutation(async ({ ctx }) => {
  try {
    const token = (ctx as any)?.token;
    if (!token) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'No authentication token provided',
      });
    }

    // Create authenticated client and sign out
    const authedSupabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    });

    const { error } = await authedSupabase.auth.signOut();

    if (error) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: error.message,
      });
    }

    return { success: true };
  } catch (error) {
    if (error instanceof TRPCError) throw error;
    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Logout failed',
    });
  }
});

/**
 * Auth router combining all procedures
 */
export const authRouter = t.router({
  sendOtp: sendOtpProcedure,
  verifyOtp: verifyOtpProcedure,
  completeOnboarding: completeOnboardingProcedure,
  logout: logoutProcedure,
});

export type AuthRouter = typeof authRouter;
