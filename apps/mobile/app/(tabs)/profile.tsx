import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors } from '@/constants/theme';
import { useAuthStore } from '@/stores/authStore';
import { getTRPCClient } from '@/lib/trpc';

export default function ProfileScreen() {
  const router = useRouter();
  const { user, clearSession } = useAuthStore();
  const trpcClient = getTRPCClient();

  const handleLogout = async () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      {
        text: 'Cancel',
        onPress: () => {},
        style: 'cancel',
      },
      {
        text: 'Logout',
        onPress: async () => {
          try {
            // Call logout API
            await trpcClient.auth.logout.mutate();
          } catch (error) {
            console.warn('Logout error (continuing):', error);
          } finally {
            // Clear local session regardless of API result
            clearSession();
            router.replace('/(auth)');
          }
        },
        style: 'destructive',
      },
    ]);
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: Colors.background,
        paddingHorizontal: 24,
        paddingTop: 32,
      }}
    >
      {/* Profile Header */}
      <View style={{ marginBottom: 32 }}>
        <View
          style={{
            width: 80,
            height: 80,
            borderRadius: 40,
            backgroundColor: Colors.primary,
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 16,
          }}
        >
          <MaterialCommunityIcons
            name="account"
            size={40}
            color={Colors.background}
          />
        </View>
        <Text style={{ fontSize: 24, fontWeight: '700', color: Colors.white }}>
          {user?.name || 'User'}
        </Text>
        <Text style={{ fontSize: 14, color: Colors.gray[400], marginTop: 4 }}>
          {user?.email || user?.id}
        </Text>
      </View>

      {/* User Info */}
      {user && (
        <View
          style={{
            backgroundColor: Colors.secondaryBackground,
            borderRadius: 12,
            padding: 16,
            marginBottom: 32,
          }}
        >
          {user.sports && user.sports.length > 0 && (
            <View style={{ marginBottom: 12 }}>
              <Text style={{ fontSize: 12, color: Colors.gray[400] }}>
                Favorite Sports
              </Text>
              <Text style={{ fontSize: 14, color: Colors.white, marginTop: 4 }}>
                {user.sports.join(', ')}
              </Text>
            </View>
          )}

          {user.level && (
            <View style={{ marginBottom: 12 }}>
              <Text style={{ fontSize: 12, color: Colors.gray[400] }}>
                Experience Level
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  color: Colors.white,
                  marginTop: 4,
                  textTransform: 'capitalize',
                }}
              >
                {user.level}
              </Text>
            </View>
          )}

          {user.locality && (
            <View>
              <Text style={{ fontSize: 12, color: Colors.gray[400] }}>
                Locality
              </Text>
              <Text style={{ fontSize: 14, color: Colors.white, marginTop: 4 }}>
                {user.locality}
              </Text>
            </View>
          )}
        </View>
      )}

      {/* Logout Button */}
      <TouchableOpacity
        onPress={handleLogout}
        style={{
          backgroundColor: Colors.error,
          paddingVertical: 14,
          borderRadius: 8,
          alignItems: 'center',
          flexDirection: 'row',
          justifyContent: 'center',
          gap: 8,
        }}
        activeOpacity={0.8}
      >
        <MaterialCommunityIcons name="logout" size={18} color={Colors.white} />
        <Text style={{ fontSize: 14, fontWeight: '600', color: Colors.white }}>
          Logout
        </Text>
      </TouchableOpacity>
    </View>
  );
}
