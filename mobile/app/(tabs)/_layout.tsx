
/* Bismillah ❤️ */
/* ==========================================
   GLOWAURA — PREMIUM TAB NAVIGATION
   AI BEAUTY SCREEN NAVIGATION HIDDEN
========================================== */

import React from "react";
import {
  View,
  Text,
  StyleSheet,
} from "react-native";

import { Tabs } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import {
  Home,
  Sparkles,
  CalendarDays,
  Bot,
  UserRound,
} from "lucide-react-native";

// ==========================================
// COLORS
// ==========================================

const COLORS = {
  green: "#34483A",
  gold: "#B79A68",
  cream: "#FFFEFA",
  muted: "#999B91",
  border: "#EEE9DE",
};

// ==========================================
// TAB ICONS
// ==========================================

const icons: Record<string, any> = {
  index: Home,
  services: Sparkles,
  bookings: CalendarDays,
  assistant: Bot,
  profile: UserRound,
};

// ==========================================
// TAB LABELS
// ==========================================

const labels: Record<string, string> = {
  index: "Home",
  services: "Services",
  bookings: "Bookings",
  assistant: "AI Beauty",
  profile: "Profile",
};

// ==========================================
// TAB ICON COMPONENT
// ==========================================

function TabIcon({
  name,
  focused,
}: {
  name: string;
  focused: boolean;
}) {
  const Icon = icons[name];

  if (!Icon) return null;

  return (
    <View
      style={[
        styles.iconBox,
        focused && styles.activeIconBox,
      ]}
    >
      <Icon
        size={focused ? 22 : 21}
        color={focused ? "#FFFFFF" : COLORS.muted}
        strokeWidth={focused ? 2.5 : 1.9}
      />
    </View>
  );
}

// ==========================================
// MAIN TAB LAYOUT
// ==========================================

export default function TabsLayout() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,

        // Hide bottom navigation on AI Beauty screen
        tabBarStyle:
          route.name === "assistant"
            ? { display: "none" }
            : {
                position: "absolute",

                left: 12,
                right: 12,

                bottom: Math.max(insets.bottom, 8),

                height: 70,

                backgroundColor: COLORS.cream,

                borderRadius: 23,
                borderTopWidth: 0,
                borderWidth: 1,
                borderColor: COLORS.border,

                paddingTop: 7,
                paddingBottom: 5,

                elevation: 12,

                shadowColor: "#26382A",
                shadowOffset: {
                  width: 0,
                  height: 5,
                },
                shadowOpacity: 0.13,
                shadowRadius: 12,
              },

        tabBarLabel: ({ focused }) => (
          <Text
            style={[
              styles.label,
              focused && styles.activeLabel,
            ]}
          >
            {labels[route.name]}
          </Text>
        ),

        tabBarIcon: ({ focused }) => (
          <TabIcon
            name={route.name}
            focused={focused}
          />
        ),

        tabBarActiveTintColor: COLORS.green,
        tabBarInactiveTintColor: COLORS.muted,

        tabBarHideOnKeyboard: true,

        tabBarItemStyle: {
          paddingVertical: 2,
        },
      })}
    >
      <Tabs.Screen
        name="index"
        options={{ title: "Home" }}
      />

      <Tabs.Screen
        name="services"
        options={{ title: "Services" }}
      />

      <Tabs.Screen
        name="bookings"
        options={{ title: "Bookings" }}
      />

      <Tabs.Screen
        name="assistant"
        options={{ title: "AI Beauty" }}
      />

      <Tabs.Screen
        name="profile"
        options={{ title: "Profile" }}
      />
    </Tabs>
  );
}

// ==========================================
// STYLES
// ==========================================

const styles = StyleSheet.create({
  iconBox: {
    width: 38,
    height: 35,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
  },

  activeIconBox: {
    backgroundColor: COLORS.green,
    width: 42,
    height: 37,
    borderRadius: 13,
  },

  label: {
    fontSize: 9,
    fontWeight: "500",
    color: COLORS.muted,
    marginTop: 2,
  },

  activeLabel: {
    color: COLORS.green,
    fontWeight: "800",
  },
});
