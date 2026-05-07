import { Stack } from 'expo-router';

/**
 * Auth stack layout
 * Groups splash and onboarding screens
 */
export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animationEnabled: false, // Disable animation for auth transitions
      }}
    >
      {/* Splash Screen - default */}
      <Stack.Screen name="index" />

      {/* Onboarding Screen */}
      <Stack.Screen name="onboarding" />
    </Stack>
  );
}
