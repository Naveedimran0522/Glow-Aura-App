/* Bismillah-ir-Rahman-ir-Raheem ❤️ */
/* ========================================== */
/* GLOWAURA — COMPLETE ROOT LAYOUT */
/* Premium Forest Green + Champagne Gold */
/* Safe Area + Stripe + Expo Router */
/* ========================================== */

import React from "react";

import {
  StatusBar,
  StyleSheet,
  View,
  Platform,
} from "react-native";

import { Stack } from "expo-router";

import { StripeProvider } from "@stripe/stripe-react-native";

import {
  SafeAreaProvider,
} from "react-native-safe-area-context";

// ==========================================
// GLOWAURA PREMIUM THEME
// ==========================================

const COLORS = {
  forest: "#263C30",
  deep: "#192B22",
  green: "#405B48",
  gold: "#B99A65",
  champagne: "#E6D3AD",
  ivory: "#FAF8F2",
  white: "#FFFFFF",
};

// ==========================================
// ROOT LAYOUT
// ==========================================

export default function RootLayout() {
  const stripePublishableKey =
    process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY || "";

  return (
    <SafeAreaProvider>
      <StripeProvider
        publishableKey={stripePublishableKey}
      >
        <View style={styles.root}>

          {/* ================================== */}
          {/* STATUS BAR — CAMERA NOTCH AREA */}
          {/* ================================== */}

          <StatusBar
            hidden={false}
            translucent={false}
            backgroundColor={COLORS.ivory}
            barStyle="dark-content"
            animated={true}
          />

          {/* ================================== */}
          {/* EXPO ROUTER NAVIGATION */}
          {/* ================================== */}

          <Stack
            screenOptions={{
              headerShown: false,

              contentStyle: {
                backgroundColor: COLORS.ivory,
              },

              animation: "slide_from_right",

              gestureEnabled: true,

              navigationBarColor:
                Platform.OS === "android"
                  ? COLORS.ivory
                  : undefined,
            }}
          >

            {/* MAIN APP TABS */}

            <Stack.Screen
              name="(tabs)"
              options={{
                headerShown: false,
              }}
            />

            {/* STRIPE PAYMENT */}

            <Stack.Screen
              name="payment/[id]"
              options={{
                headerShown: false,
                presentation: "card",
              }}
            />

            {/* PAYMENT VERIFICATION */}

            <Stack.Screen
              name="payment/verify/[id]"
              options={{
                headerShown: false,
                presentation: "card",
              }}
            />

            {/* BOOKING CONFIRMATION */}

            <Stack.Screen
              name="booking-confirmation"
              options={{
                headerShown: false,
                presentation: "card",
              }}
            />

            {/* LOGIN */}

            <Stack.Screen
              name="login"
              options={{
                headerShown: false,
              }}
            />

            {/* OTP VERIFICATION */}

            <Stack.Screen
              name="verify-otp"
              options={{
                headerShown: false,
              }}
            />

          </Stack>

        </View>
      </StripeProvider>
    </SafeAreaProvider>
  );
}

// ==========================================
// ROOT STYLES
// ==========================================

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: COLORS.ivory,
  },
});