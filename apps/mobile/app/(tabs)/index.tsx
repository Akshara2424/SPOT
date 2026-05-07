import { View, Text } from 'react-native';
import { Colors } from '@/constants/theme';

export default function HomeScreen() {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: Colors.background,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Text style={{ color: Colors.white, fontSize: 18 }}>Home Screen</Text>
      <Text style={{ color: Colors.gray[400], marginTop: 8 }}>
        Coming soon...
      </Text>
    </View>
  );
}
