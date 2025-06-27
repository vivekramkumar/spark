import { useTheme } from '@/contexts/ThemeContext';
import { Tabs } from 'expo-router';
import { Compass, Heart, MessageCircle, User } from 'lucide-react-native';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

function TabBarIcon({ icon: Icon, focused, color }: { icon: any; focused: boolean; color: string }) {
  return (
    <View style={[styles.tabIcon, focused && styles.tabIconFocused]}>
      <Icon size={24} color={color} strokeWidth={focused ? 2.5 : 2} />
      {focused && <View style={[styles.focusIndicator, { backgroundColor: color }]} />}
    </View>
  );
}

export default function TabLayout() {
  const { theme } = useTheme();

  if (!theme) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00C2FF" />
      </View>
    );
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.colors.button.primary.background[0],
        tabBarInactiveTintColor: theme.colors.text.secondary,
        tabBarStyle: {
          backgroundColor: theme.colors.background.card,
          borderTopWidth: 1,
          borderTopColor: theme.colors.border.default,
          height: 88,
          paddingTop: 8,
          paddingBottom: 24,
          shadowColor: theme.colors.text.primary,
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 10,
        },
        tabBarLabelStyle: {
          fontFamily: 'Inter-Medium',
          fontSize: 12,
          marginTop: 4,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Discover',
          tabBarIcon: ({ focused, color }) => (
            <TabBarIcon icon={Compass} focused={focused} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="likes"
        options={{
          title: 'Likes',
          tabBarIcon: ({ focused, color }) => (
            <TabBarIcon icon={Heart} focused={focused} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: 'Chats',
          tabBarIcon: ({ focused, color }) => (
            <TabBarIcon icon={MessageCircle} focused={focused} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ focused, color }) => (
            <TabBarIcon icon={User} focused={focused} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="edit-profile"
        options={{
          href: null, // Hide from tab bar
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0F0F23', // Dark background color
  },
  tabIcon: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  tabIconFocused: {
    transform: [{ scale: 1.1 }],
  },
  focusIndicator: {
    position: 'absolute',
    bottom: -8,
    width: 4,
    height: 4,
    borderRadius: 2,
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 4,
  },
});