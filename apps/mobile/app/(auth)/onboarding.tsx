import { useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { OnboardingInputSchema, OnboardingInput } from 'types';
import { SPORTS } from '@/constants/sports';
import { Colors } from '@/constants/theme';
import { useAuthStore } from '@/stores/authStore';
import { trpc } from '@/lib/trpc';

/**
 * Screen 02: Onboarding Screen
 * - Sport multi-select with chip UI
 * - Level picker (beginner, intermediate, advanced)
 * - Locality input
 * - Calls completeOnboarding and redirects to tabs
 */
export default function OnboardingScreen() {
  const router = useRouter();
  const { setIsOnboarded, setUser, session } = useAuthStore();
  const [selectedSports, setSelectedSports] = useState<string[]>([]);
  const [selectedLevel, setSelectedLevel] = useState<'beginner' | 'intermediate' | 'advanced'>('beginner');

  const completeOnboardingMutation = trpc.auth.completeOnboarding.useMutation();

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<OnboardingInput>({
    resolver: zodResolver(OnboardingInputSchema),
    defaultValues: {
      sports: [],
      level: 'beginner',
      locality: '',
    },
  });

  const locality = watch('locality');

  /**
   * Handle sport chip selection
   */
  const toggleSport = useCallback((sportId: string) => {
    setSelectedSports((prev) => {
      if (prev.includes(sportId)) {
        return prev.filter((id) => id !== sportId);
      }
      return [...prev, sportId];
    });
  }, []);

  /**
   * Handle form submission
   * Calls completeOnboarding tRPC procedure
   */
  const onSubmit = async () => {
    if (selectedSports.length === 0) {
      Alert.alert('Error', 'Please select at least one sport');
      return;
    }

    if (!locality.trim()) {
      Alert.alert('Error', 'Please enter your locality');
      return;
    }

    try {
      const result = await completeOnboardingMutation.mutateAsync({
        sports: selectedSports,
        level: selectedLevel,
        locality: locality.trim(),
      });

      // Update store
      setIsOnboarded(true);

      // Create user profile
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email || '',
          name: '',
          sports: selectedSports,
          level: selectedLevel,
          locality: locality.trim(),
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }

      // Redirect to tabs
      router.replace('/(tabs)');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to complete onboarding');
    }
  };

  const levels: Array<'beginner' | 'intermediate' | 'advanced'> = [
    'beginner',
    'intermediate',
    'advanced',
  ];

  const isLoading = completeOnboardingMutation.isPending;

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: Colors.background }}
      contentContainerStyle={{ padding: 24, paddingBottom: 40 }}
    >
      {/* Header */}
      <View style={{ marginBottom: 32 }}>
        <Text
          style={{
            fontSize: 28,
            fontWeight: '700',
            color: Colors.white,
            marginBottom: 8,
          }}
        >
          Let's Get Started
        </Text>
        <Text
          style={{
            fontSize: 14,
            color: Colors.gray[400],
            lineHeight: 20,
          }}
        >
          Tell us about your sports interests and experience level
        </Text>
      </View>

      {/* Sports Selection */}
      <View style={{ marginBottom: 32 }}>
        <Text
          style={{
            fontSize: 16,
            fontWeight: '600',
            color: Colors.white,
            marginBottom: 12,
          }}
        >
          Favorite Sports *
        </Text>
        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: 8,
          }}
        >
          {SPORTS.map((sport) => (
            <TouchableOpacity
              key={sport.id}
              onPress={() => toggleSport(sport.id)}
              style={{
                paddingHorizontal: 12,
                paddingVertical: 8,
                borderRadius: 20,
                borderWidth: 2,
                borderColor: selectedSports.includes(sport.id)
                  ? Colors.primary
                  : Colors.gray[700],
                backgroundColor: selectedSports.includes(sport.id)
                  ? Colors.primary
                  : 'transparent',
                flexDirection: 'row',
                alignItems: 'center',
                gap: 6,
              }}
              activeOpacity={0.7}
            >
              <MaterialCommunityIcons
                name={sport.iconName}
                size={16}
                color={
                  selectedSports.includes(sport.id)
                    ? Colors.background
                    : Colors.gray[400]
                }
              />
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: '500',
                  color: selectedSports.includes(sport.id)
                    ? Colors.background
                    : Colors.white,
                }}
              >
                {sport.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        {selectedSports.length === 0 && (
          <Text style={{ fontSize: 12, color: Colors.error, marginTop: 8 }}>
            Please select at least one sport
          </Text>
        )}
      </View>

      {/* Experience Level */}
      <View style={{ marginBottom: 32 }}>
        <Text
          style={{
            fontSize: 16,
            fontWeight: '600',
            color: Colors.white,
            marginBottom: 12,
          }}
        >
          Experience Level *
        </Text>
        <View style={{ gap: 8 }}>
          {levels.map((level) => (
            <TouchableOpacity
              key={level}
              onPress={() => setSelectedLevel(level)}
              style={{
                paddingHorizontal: 16,
                paddingVertical: 12,
                borderRadius: 8,
                borderWidth: 2,
                borderColor: selectedLevel === level
                  ? Colors.primary
                  : Colors.gray[700],
                backgroundColor: selectedLevel === level
                  ? `${Colors.primary}20`
                  : 'transparent',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
              activeOpacity={0.7}
            >
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: '500',
                  color: selectedLevel === level ? Colors.primary : Colors.white,
                  textTransform: 'capitalize',
                }}
              >
                {level}
              </Text>
              {selectedLevel === level && (
                <MaterialCommunityIcons
                  name="check-circle"
                  size={20}
                  color={Colors.primary}
                />
              )}
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Locality Input */}
      <View style={{ marginBottom: 32 }}>
        <Text
          style={{
            fontSize: 16,
            fontWeight: '600',
            color: Colors.white,
            marginBottom: 8,
          }}
        >
          Your Locality *
        </Text>
        <Controller
          control={control}
          name="locality"
          render={({ field: { onChange, value } }) => (
            <>
              <TextInput
                placeholder="e.g., Indiranagar, Bangalore"
                placeholderTextColor={Colors.gray[500]}
                value={value}
                onChangeText={onChange}
                style={{
                  backgroundColor: Colors.secondaryBackground,
                  color: Colors.white,
                  paddingHorizontal: 16,
                  paddingVertical: 12,
                  borderRadius: 8,
                  borderWidth: 1,
                  borderColor: errors.locality ? Colors.error : Colors.gray[700],
                  fontSize: 14,
                }}
              />
              {errors.locality && (
                <Text
                  style={{
                    fontSize: 12,
                    color: Colors.error,
                    marginTop: 6,
                  }}
                >
                  {errors.locality.message}
                </Text>
              )}
            </>
          )}
        />
      </View>

      {/* Submit Button */}
      <TouchableOpacity
        onPress={onSubmit}
        disabled={isLoading || selectedSports.length === 0 || !locality.trim()}
        style={{
          backgroundColor: Colors.primary,
          paddingVertical: 16,
          borderRadius: 12,
          alignItems: 'center',
          opacity: isLoading || selectedSports.length === 0 || !locality.trim()
            ? 0.5
            : 1,
        }}
        activeOpacity={0.8}
      >
        {isLoading ? (
          <ActivityIndicator color={Colors.background} />
        ) : (
          <Text
            style={{
              fontSize: 16,
              fontWeight: '600',
              color: Colors.background,
            }}
          >
            Continue
          </Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}
