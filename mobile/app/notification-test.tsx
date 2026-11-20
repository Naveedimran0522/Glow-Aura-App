
/* Bismillah-ir-Rahman-ir-Raheem ❤️ */
/* GLOWAURA — NOTIFICATION TEST SCREEN */

import React, { useState } from "react";

import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
  Platform,
} from "react-native";

import * as Notifications from "expo-notifications";

import {
  sendLocalNotification,
  getScheduledReminders,
} from "../services/notification";

export default function NotificationTestScreen() {
  const [loading, setLoading] = useState(false);
  const [permission, setPermission] = useState("Not checked");
  const [status, setStatus] = useState("Ready to test");

  // CHECK AND REQUEST PERMISSION
  const handlePermission = async () => {
    setLoading(true);

    try {
      let result = await Notifications.getPermissionsAsync();

      if (!result.granted) {
        result = await Notifications.requestPermissionsAsync();
      }

      const granted = result.granted;

      setPermission(granted ? "Granted ❤️" : "Denied");

      setStatus(
        granted
          ? "Notification permission is active"
          : "Please allow notifications in phone settings"
      );

      Alert.alert(
        "Permission Status",
        granted
          ? "GlowAura notification permission granted! ❤️"
          : "Notification permission was not granted."
      );
    } catch (error) {
      console.error("Permission error:", error);
      Alert.alert("Permission Error", String(error));
    } finally {
      setLoading(false);
    }
  };

  // SEND TEST NOTIFICATION
  const handleSendNotification = async () => {
    setLoading(true);

    try {
      const result = await Notifications.getPermissionsAsync();

      if (!result.granted) {
        Alert.alert(
          "Permission Required",
          "Please allow notification permission first."
        );
        return;
      }

      await sendLocalNotification(
        "GlowAura ❤️",
        "Your beauty journey starts here. Your notification system is working!"
      );

      setStatus("Test notification sent successfully ❤️");

      Alert.alert(
        "Success",
        "Test notification sent. Check your phone notification panel."
      );
    } catch (error) {
      console.error("Notification error:", error);
      setStatus("Notification failed");

      Alert.alert("Notification Error", String(error));
    } finally {
      setLoading(false);
    }
  };

  // CHECK SCHEDULED NOTIFICATIONS
  const handleCheckScheduled = async () => {
    setLoading(true);

    try {
      const notifications = await getScheduledReminders();

      Alert.alert(
        "Scheduled Notifications",
        `Total scheduled notifications: ${notifications.length}`
      );

      setStatus(
        `${notifications.length} scheduled notification(s) found`
      );
    } catch (error) {
      console.error("Schedule check error:", error);
      Alert.alert("Error", String(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.brand}>GLOWAURA</Text>

      <Text style={styles.heading}>
        Notification Center
      </Text>

      <Text style={styles.subtitle}>
        Manage and test your GlowAura notifications.
      </Text>

      <View style={styles.card}>
        <Text style={styles.cardLabel}>Platform</Text>

        <Text style={styles.cardValue}>
          {Platform.OS === "android" ? "Android Device" : Platform.OS}
        </Text>

        <View style={styles.divider} />

        <Text style={styles.cardLabel}>Permission</Text>

        <Text style={styles.cardValue}>{permission}</Text>

        <View style={styles.divider} />

        <Text style={styles.cardLabel}>System Status</Text>

        <Text style={styles.status}>{status}</Text>
      </View>

      <Pressable
        style={({ pressed }) => [
          styles.primaryButton,
          pressed && styles.pressed,
          loading && styles.disabled,
        ]}
        onPress={handlePermission}
        disabled={loading}
      >
        <Text style={styles.primaryButtonText}>
          Check Notification Permission
        </Text>
      </Pressable>

      <Pressable
        style={({ pressed }) => [
          styles.primaryButton,
          pressed && styles.pressed,
          loading && styles.disabled,
        ]}
        onPress={handleSendNotification}
        disabled={loading}
      >
        <Text style={styles.primaryButtonText}>
          Send Test Notification
        </Text>
      </Pressable>

      <Pressable
        style={({ pressed }) => [
          styles.secondaryButton,
          pressed && styles.pressed,
          loading && styles.disabled,
        ]}
        onPress={handleCheckScheduled}
        disabled={loading}
      >
        <Text style={styles.secondaryButtonText}>
          Check Scheduled Notifications
        </Text>
      </Pressable>

      {loading && (
        <ActivityIndicator
          size="large"
          color="#B79A68"
          style={styles.loader}
        />
      )}

      <Text style={styles.footer}>
        Made with love for your GlowAura journey ❤️
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#FBF8F1",
    paddingHorizontal: 24,
    paddingTop: 70,
    paddingBottom: 40,
  },

  brand: {
    fontSize: 15,
    fontWeight: "800",
    letterSpacing: 6,
    color: "#B79A68",
    textAlign: "center",
  },

  heading: {
    fontSize: 29,
    fontWeight: "800",
    color: "#344A3D",
    textAlign: "center",
    marginTop: 22,
  },

  subtitle: {
    fontSize: 14,
    color: "#827D70",
    textAlign: "center",
    marginTop: 10,
    marginBottom: 35,
    lineHeight: 22,
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 22,
    marginBottom: 25,
    elevation: 3,
  },

  cardLabel: {
    fontSize: 12,
    color: "#827D70",
    fontWeight: "600",
  },

  cardValue: {
    fontSize: 16,
    color: "#344A3D",
    fontWeight: "700",
    marginTop: 7,
  },

  status: {
    fontSize: 14,
    color: "#344A3D",
    fontWeight: "600",
    marginTop: 7,
  },

  divider: {
    height: 1,
    backgroundColor: "#F0EDE5",
    marginVertical: 16,
  },

  primaryButton: {
    backgroundColor: "#344A3D",
    paddingVertical: 18,
    borderRadius: 15,
    alignItems: "center",
    marginBottom: 15,
  },

  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },

  secondaryButton: {
    borderWidth: 1.5,
    borderColor: "#B79A68",
    paddingVertical: 18,
    borderRadius: 15,
    alignItems: "center",
  },

  secondaryButtonText: {
    color: "#344A3D",
    fontSize: 14,
    fontWeight: "700",
  },

  pressed: {
    opacity: 0.75,
  },

  disabled: {
    opacity: 0.5,
  },

  loader: {
    marginTop: 25,
  },

  footer: {
    color: "#827D70",
    fontSize: 12,
    textAlign: "center",
    marginTop: 35,
  },
});
