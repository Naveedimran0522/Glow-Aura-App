
/* Bismillah-ir-Rahman-ir-Raheem ❤️ */
/* GLOWAURA — PERSONAL INFORMATION SCREEN */

import React, { useCallback, useState } from "react";

import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from "react-native";

import { useRouter, useFocusEffect } from "expo-router";

import { getCurrentUser } from "../services/auth";

interface User {
  name?: string;
  email?: string;
  phone?: string;
  role?: string;
  isVerified?: boolean;
}

export default function PersonalInformationScreen() {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const loadProfile = useCallback(async () => {
    try {
      setError("");

      const result = await getCurrentUser();

      if (!result) {
        setUser(null);
        setError("Unable to load your account. Please login again.");
        return;
      }

      setUser(result);
    } catch (err: any) {
      console.error("PERSONAL INFORMATION ERROR:", err);
      setError(err?.message || "Unable to load profile information.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadProfile();
    }, [loadProfile])
  );

  const handleRefresh = () => {
    setRefreshing(true);
    loadProfile();
  };

  const renderInfo = (
    label: string,
    value?: string | boolean
  ) => (
    <View style={styles.infoCard}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>
        {value === true
          ? "Verified"
          : value === false
          ? "Not Verified"
          : value || "Not available"}
      </Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#34483A" />
        <Text style={styles.loadingText}>
          Loading your information...
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={handleRefresh}
          tintColor="#34483A"
        />
      }
    >
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.back()}
      >
        <Text style={styles.backText}>‹  Back to Profile</Text>
      </TouchableOpacity>

      <View style={styles.heading}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {user?.name?.charAt(0)?.toUpperCase() || "G"}
          </Text>
        </View>

        <Text style={styles.title}>Personal Information</Text>
        <Text style={styles.subtitle}>
          Your GlowAura account details
        </Text>
      </View>

      {error ? (
        <View style={styles.errorCard}>
          <Text style={styles.errorText}>{error}</Text>

          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => {
              setLoading(true);
              loadProfile();
            }}
          >
            <Text style={styles.retryText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <Text style={styles.sectionTitle}>ACCOUNT DETAILS</Text>

          {renderInfo("Full Name", user?.name)}
          {renderInfo("Email Address", user?.email)}
          {renderInfo("Phone Number", user?.phone)}
          
          <Text style={styles.sectionTitle}>
            ACCOUNT SECURITY
          </Text>

          {renderInfo(
            "Account Type",
            user?.role?.toUpperCase()
          )}

          {renderInfo(
            "Email Verification",
            user?.isVerified
          )}

          <View style={styles.noteCard}>
            <Text style={styles.noteTitle}>
              Your information is secure
            </Text>
            <Text style={styles.noteText}>
              Your account information is retrieved from your
              registered GlowAura account.
            </Text>
          </View>
        </>
      )}

      <Text style={styles.footer}>
        GLOWAURA BEAUTY EXPERIENCE
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#FBF8F1",
  },

  content: {
    padding: 22,
    paddingTop: 55,
    paddingBottom: 60,
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FBF8F1",
  },

  loadingText: {
    marginTop: 12,
    color: "#827D70",
    fontSize: 13,
  },

  backButton: {
    alignSelf: "flex-start",
    paddingVertical: 10,
  },

  backText: {
    color: "#34483A",
    fontSize: 14,
    fontWeight: "600",
  },

  heading: {
    alignItems: "center",
    marginTop: 20,
    marginBottom: 35,
  },

  avatar: {
    width: 76,
    height: 76,
    borderRadius: 26,
    backgroundColor: "#34483A",
    alignItems: "center",
    justifyContent: "center",
  },

  avatarText: {
    color: "#FFFFFF",
    fontSize: 32,
    fontWeight: "600",
  },

  title: {
    color: "#34483A",
    fontSize: 24,
    fontFamily: "Georgia",
    marginTop: 17,
  },

  subtitle: {
    color: "#827D70",
    fontSize: 12,
    marginTop: 7,
  },

  sectionTitle: {
    color: "#B79A68",
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1.5,
    marginBottom: 12,
    marginTop: 10,
  },

  infoCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 17,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#EEE9DE",
  },

  infoLabel: {
    color: "#827D70",
    fontSize: 11,
    marginBottom: 8,
  },

  infoValue: {
    color: "#34483A",
    fontSize: 15,
    fontWeight: "600",
  },

  noteCard: {
    backgroundColor: "#34483A",
    padding: 18,
    borderRadius: 15,
    marginTop: 20,
  },

  noteTitle: {
    color: "#D8C28A",
    fontSize: 14,
    fontWeight: "700",
  },

  noteText: {
    color: "#F8F4EB",
    fontSize: 12,
    lineHeight: 20,
    marginTop: 8,
  },

  errorCard: {
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderRadius: 15,
    alignItems: "center",
  },

  errorText: {
    color: "#A33A32",
    textAlign: "center",
    fontSize: 13,
  },

  retryButton: {
    backgroundColor: "#34483A",
    paddingHorizontal: 25,
    paddingVertical: 12,
    borderRadius: 10,
    marginTop: 15,
  },

  retryText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },

  footer: {
    color: "#B79A68",
    textAlign: "center",
    fontSize: 9,
    letterSpacing: 2,
    marginTop: 35,
  },
});
