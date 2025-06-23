import { Tabs } from 'expo-router';
import { Heart, MessageCircle, User } from 'lucide-react-native';
import { View, StyleSheet } from 'react-native';

function TabBarIcon({ icon: Icon, focused, color }: { icon: any; focused: boolean; color: string }) {
  return (
    <View style={[styles.tabIcon, focused && styles.tabIconFocused]}>
      <Icon size={24} color={color} strokeWidth={focused ? 2.5 : 2} />
      {focused && <View style={[styles.focusIndicator, { backgroundColor: color }]} />}
    </View>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#00F5FF',
        tabBarInactiveTintColor: '#6B7280',
        tabBarStyle: {
          backgroundColor: '#0F0F23',
          borderTopWidth: 1,
          borderTopColor: '#1F1F3A',
          height: 88,
          paddingTop: 8,
          paddingBottom: 24,
          shadowColor: '#00F5FF',
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
            <TabBarIcon icon={Heart} focused={focused} color={color} />
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
    shadowColor: '#00F5FF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 4,
  },
});