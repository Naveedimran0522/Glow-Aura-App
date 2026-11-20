/* Bismillah-ir-Rahman-ir-Raheem ❤️ */
/* GLOWAURA — BOOKING CONFIRMATION */

import React, { useEffect, useRef } from "react";

import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import { useLocalSearchParams, useRouter } from "expo-router";

import { sendLocalNotification } from "../services/notification";

export default function BookingConfirmationScreen() {
  const router = useRouter();

  const { id } = useLocalSearchParams<{ id: string }>();

  const notificationSent = useRef(false);

  // =====================================
  // BOOKING CONFIRMATION NOTIFICATION
  // =====================================

  useEffect(() => {
    if (!id || notificationSent.current) {
      return;
    }

    notificationSent.current = true;

    const sendConfirmation = async () => {
      try {
        await sendLocalNotification(
          "GlowAura Booking Request ❤️",
          "Your appointment request has been submitted successfully. Check My Bookings for its current status."
        );

        console.log(
          "GlowAura: Booking notification sent successfully."
        );
      } catch (error) {
        console.warn(
          "GlowAura: Booking notification could not be sent:",
          error
        );
      }
    };

    sendConfirmation();
  }, [id]);

  // =====================================
  // NAVIGATION
  // =====================================

  const openBookings = () => {
    router.replace("/(tabs)/bookings");
  };

  const goHome = () => {
    router.replace("/(tabs)");
  };

  // =====================================
  // UI
  // =====================================

  return (
    <SafeAreaView
      style={styles.safeArea}
      edges={["top", "bottom", "left", "right"]}
    >
      <View style={styles.screen}>
        <View style={styles.successCircle}>
          <Text style={styles.check}>✓</Text>
        </View>

        <Text style={styles.eyebrow}>
          GLOWAURA BOOKING
        </Text>

        <Text style={styles.title}>
          Request Submitted!
        </Text>

        <Text style={styles.description}>
          Your appointment request has been saved successfully.
          You can view its current status in My Bookings.
        </Text>

        <View style={styles.referenceCard}>
          <Text style={styles.referenceLabel}>
            BOOKING REFERENCE
          </Text>

          <Text style={styles.referenceId}>
            {id || "Unavailable"}
          </Text>

          <Text style={styles.pending}>
            STATUS: PENDING
          </Text>
        </View>

        <TouchableOpacity
          style={styles.primaryButton}
          activeOpacity={0.85}
          onPress={openBookings}
        >
          <Text style={styles.primaryText}>
            View My Bookings →
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          activeOpacity={0.7}
          onPress={goHome}
        >
          <Text style={styles.secondaryText}>
            Back to Home
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// =====================================
// STYLES
// =====================================

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FBF8F1",
  },

  screen: {
    flex: 1,
    backgroundColor: "#FBF8F1",
    alignItems: "center",
    justifyContent: "center",
    padding: 25,
  },

  successCircle: {
    width: 90,
    height: 90,
    borderRadius: 30,
    backgroundColor: "#E7EDE2",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 25,
  },

  check: {
    color: "#526F51",
    fontSize: 48,
  },

  eyebrow: {
    color: "#B79A68",
    fontSize: 9,
    letterSpacing: 2,
  },

  title: {
    color: "#34483A",
    fontFamily: "Georgia",
    fontSize: 29,
    marginTop: 12,
    textAlign: "center",
  },

  description: {
    color: "#898579",
    fontSize: 12,
    lineHeight: 21,
    textAlign: "center",
    marginTop: 12,
  },

  referenceCard: {
    backgroundColor: "#FFFFFF",
    width: "100%",
    borderRadius: 18,
    padding: 20,
    alignItems: "center",
    marginTop: 28,
    borderWidth: 1,
    borderColor: "#EEE9DE",
  },

  referenceLabel: {
    color: "#A19B8E",
    fontSize: 9,
    letterSpacing: 1.3,
  },

  referenceId: {
    color: "#34483A",
    fontSize: 13,
    fontWeight: "700",
    marginTop: 10,
  },

  pending: {
    color: "#B79A68",
    fontSize: 10,
    fontWeight: "700",
    marginTop: 12,
  },

  primaryButton: {
    backgroundColor: "#34483A",
    width: "100%",
    padding: 17,
    borderRadius: 15,
    alignItems: "center",
    marginTop: 25,
  },

  primaryText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "700",
  },

  secondaryButton: {
    padding: 16,
    marginTop: 5,
  },

  secondaryText: {
    color: "#758A70",
    fontSize: 12,
    fontWeight: "600",
  },
});