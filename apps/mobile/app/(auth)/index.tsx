import { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Animated, Dimensions, Alert, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors } from '@/constants/theme';
import { useAuthStore } from '@/stores/authStore';
import { trpc } from '@/lib/trpc';

/**
 * Screen 01: Splash Screen
 * - Displays animated logo
 * - Auto-redirects to tabs if authenticated
 * - Shows phone input and OTP verification
 * - Redirects to onboarding after successful OTP verification
 */
export default function SplashScreen() {
  const router = useRouter();
  const { session, isOnboarded, setSession } = useAuthStore();
  const scaleAnim = new Animated.Value(0);
  const opacityAnim = new Animated.Value(0);
  const { height } = Dimensions.get('window');

  const [showPhoneInput, setShowPhoneInput] = useState(false);
  const [phone, setPhone] = useState('');
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [otp, setOtp] = useState('');
  
  // tRPC mutations
  const sendOtpMutation = trpc.auth.sendOtp.useMutation();
  const verifyOtpMutation = trpc.auth.verifyOtp.useMutation();

  /**
   * Effect: Check auth status and redirect
   */
  useEffect(() => {
    // Animate logo on mount
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        speed: 1.5,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();

    // Check auth status after a delay
    const timer = setTimeout(() => {
      if (session && isOnboarded) {
        // Authenticated and onboarded - go to tabs
        router.replace('/(tabs)');
      } else if (session && !isOnboarded) {
        // Authenticated but not onboarded - go to onboarding
        router.replace('/(auth)/onboarding');
      }
      // If not authenticated, stay on splash with sign in option
    }, 1500);

    return () => clearTimeout(timer);
  }, [session, isOnboarded, router]);

  /**
   * Handle send OTP
   */
  const handleSendOtp = async () => {
    if (!phone.trim()) {
      Alert.alert('Error', 'Please enter your phone number');
      return;
    }

    try {
      await sendOtpMutation.mutateAsync({
        phone: phone.startsWith('+') ? phone : `+91${phone}`,
      });
      setShowOtpInput(true);
      Alert.alert('Success', 'OTP sent to your phone number');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to send OTP');
    }
  };

  /**
   * Handle verify OTP
   */
  const handleVerifyOtp = async () => {
    if (!otp.trim()) {
      Alert.alert('Error', 'Please enter the OTP');
      return;
    }

    try {
      const session = await verifyOtpMutation.mutateAsync({
        phone: phone.startsWith('+') ? phone : `+91${phone}`,
        token: otp,
      });
      
      // Store session in auth store
      setSession(session);
      
      // Reset form
      setPhone('');
      setOtp('');
      setShowPhoneInput(false);
      setShowOtpInput(false);
      
      // Redirect to onboarding
      router.replace('/(auth)/onboarding');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to verify OTP');
    }
  };

  /**
   * Handle sign in - show phone input
   */
  const handleSignIn = () => {
    setShowPhoneInput(true);
  };

  const handleBack = () => {
    setShowPhoneInput(false);
    setShowOtpInput(false);
    setPhone('');
    setOtp('');
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: Colors.background,
        justifyContent: 'space-between',
        paddingBottom: 60,
      }}
    >
      {/* Animated Logo */}
      {!showPhoneInput && (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Animated.View
            style={{
              transform: [{ scale: scaleAnim }],
              opacity: opacityAnim,
            }}
          >
            <View
              style={{
                width: 120,
                height: 120,
                borderRadius: 60,
                backgroundColor: Colors.primary,
                justifyContent: 'center',
                alignItems: 'center',
                shadowColor: Colors.primary,
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.4,
                shadowRadius: 12,
                elevation: 8,
              }}
            >
              <MaterialCommunityIcons
                name="basketball"
                size={60}
                color={Colors.background}
              />
            </View>
          </Animated.View>

          {/* App Title */}
          <Animated.View
            style={{
              opacity: opacityAnim,
              marginTop: 32,
            }}
          >
            <Text
              style={{
                fontSize: 32,
                fontWeight: '700',
                color: Colors.white,
                letterSpacing: 1,
              }}
            >
              SPORTSPOT
            </Text>
            <Text
              style={{
                fontSize: 14,
                color: Colors.gray[400],
                textAlign: 'center',
                marginTop: 8,
                letterSpacing: 0.5,
              }}
            >
              Urban Sports Discovery
            </Text>
          </Animated.View>
        </View>
      )}

      {/* Sign In / Phone Input Section */}
      {!session && (
        <Animated.View style={{ opacity: opacityAnim }}>
          {!showPhoneInput ? (
            <>
              <TouchableOpacity
                onPress={handleSignIn}
                style={{
                  backgroundColor: Colors.primary,
                  marginHorizontal: 24,
                  paddingVertical: 16,
                  borderRadius: 12,
                  alignItems: 'center',
                  marginBottom: 16,
                  shadowColor: Colors.primary,
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.3,
                  shadowRadius: 8,
                  elevation: 6,
                }}
                activeOpacity={0.8}
              >
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: '600',
                    color: Colors.background,
                    letterSpacing: 0.5,
                  }}
                >
                  Get Started
                </Text>
              </TouchableOpacity>

              {/* Info text */}
              <Text
                style={{
                  fontSize: 12,
                  color: Colors.gray[500],
                  textAlign: 'center',
                  paddingHorizontal: 24,
                }}
              >
                Sign in via SMS to discover urban sports venues
              </Text>
            </>
          ) : (
            <>
              {/* Phone Input Form */}
              <View style={{ marginHorizontal: 24, marginBottom: 16 }}>
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: '600',
                    color: Colors.white,
                    marginBottom: 16,
                  }}
                >
                  {showOtpInput ? 'Enter OTP' : 'Enter Phone Number'}
                </Text>

                {!showOtpInput && (
                  <>
                    <TextInput
                      placeholder="Phone number (10 digits)"
                      placeholderTextColor={Colors.gray[500]}
                      value={phone}
                      onChangeText={setPhone}
                      keyboardType="phone-pad"
                      editable={!sendOtpMutation.isPending}
                      style={{
                        backgroundColor: Colors.secondaryBackground,
                        color: Colors.white,
                        paddingHorizontal: 16,
                        paddingVertical: 12,
                        borderRadius: 8,
                        borderWidth: 1,
                        borderColor: Colors.gray[700],
                        fontSize: 14,
                        marginBottom: 12,
                      }}
                    />

                    <TouchableOpacity
                      onPress={handleSendOtp}
                      disabled={sendOtpMutation.isPending || !phone.trim()}
                      style={{
                        backgroundColor: Colors.primary,
                        paddingVertical: 14,
                        borderRadius: 8,
                        alignItems: 'center',
                        opacity: sendOtpMutation.isPending || !phone.trim() ? 0.5 : 1,
                      }}
                      activeOpacity={0.8}
                    >
                      <Text
                        style={{
                          fontSize: 14,
                          fontWeight: '600',
                          color: Colors.background,
                        }}
                      >
                        {sendOtpMutation.isPending ? 'Sending...' : 'Send OTP'}
                      </Text>
                    </TouchableOpacity>
                  </>
                )}

                {showOtpInput && (
                  <>
                    <TextInput
                      placeholder="6-digit OTP"
                      placeholderTextColor={Colors.gray[500]}
                      value={otp}
                      onChangeText={setOtp}
                      keyboardType="number-pad"
                      maxLength={6}
                      editable={!verifyOtpMutation.isPending}
                      style={{
                        backgroundColor: Colors.secondaryBackground,
                        color: Colors.white,
                        paddingHorizontal: 16,
                        paddingVertical: 12,
                        borderRadius: 8,
                        borderWidth: 1,
                        borderColor: Colors.gray[700],
                        fontSize: 14,
                        marginBottom: 12,
                        textAlign: 'center',
                        letterSpacing: 8,
                      }}
                    />

                    <TouchableOpacity
                      onPress={handleVerifyOtp}
                      disabled={verifyOtpMutation.isPending || !otp.trim()}
                      style={{
                        backgroundColor: Colors.primary,
                        paddingVertical: 14,
                        borderRadius: 8,
                        alignItems: 'center',
                        opacity: verifyOtpMutation.isPending || !otp.trim() ? 0.5 : 1,
                      }}
                      activeOpacity={0.8}
                    >
                      <Text
                        style={{
                          fontSize: 14,
                          fontWeight: '600',
                          color: Colors.background,
                        }}
                      >
                        {verifyOtpMutation.isPending ? 'Verifying...' : 'Verify OTP'}
                      </Text>
                    </TouchableOpacity>
                  </>
                )}
              </View>

              {/* Back Button */}
              <TouchableOpacity
                onPress={handleBack}
                style={{
                  marginHorizontal: 24,
                  paddingVertical: 12,
                  alignItems: 'center',
                }}
              >
                <Text style={{ fontSize: 14, color: Colors.gray[400] }}>
                  ← Back
                </Text>
              </TouchableOpacity>
            </>
          )}
        </Animated.View>
      )}
    </View>
  );
}
