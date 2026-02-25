import { Tabs } from "expo-router";
export default function TabLayout() {
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: "blue", headerShown: false }}>
      {/* Matches the index.tsx file in this folder */}
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          // tabBarIcon: ({ color }) => <Icon name="home" color={color} />,
        }}
      />
      {/* Matches the profile.tsx file in this folder */}
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          // tabBarIcon: ({ color }) => <Icon name="user" color={color} />,
        }}
      />
    </Tabs>
  );
}
