/* Bismillah-ir-Rahman-ir-Raheem ❤️ */
/* GLOWAURA — ARTIST PROFILE */

import React from "react";

import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import {
  useLocalSearchParams,
  useRouter,
} from "expo-router";

export default function ArtistProfileScreen() {
  const router = useRouter();

  const { name } = useLocalSearchParams<{
    name: string;
  }>();

  const artistName = name || "Beauty Professional";

  return (
    <SafeAreaView
      style={styles.safeArea}
      edges={["top", "bottom", "left", "right"]}
    >
      <ScrollView
        style={styles.screen}
        contentContainerStyle={styles.content}
      >
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.back}>‹ Back</Text>
        </TouchableOpacity>

        <View style={styles.avatar}>
          <Text style={styles.initial}>
            {artistName.charAt(0).toUpperCase()}
          </Text>
        </View>

        <Text style={styles.eyebrow}>
          MEET YOUR BEAUTY PROFESSIONAL
        </Text>

        <Text style={styles.name}>
          {artistName}
        </Text>

        <Text style={styles.role}>
          GlowAura Beauty Professional
        </Text>

        <View style={styles.ratingCard}>
          <Text style={styles.rating}>
            ★ 4.9
          </Text>

          <Text style={styles.ratingText}>
            Demo rating · Sample profile
          </Text>
        </View>

        <Text style={styles.sectionTitle}>
          About
        </Text>

        <Text style={styles.description}>
          Discover your beauty experience with a professional listed
          on GlowAura. Artist qualifications, portfolio, availability
          and verified reviews will be added when artist accounts are
          connected to the backend.
        </Text>

        <Text style={styles.sectionTitle}>
          Professional details
        </Text>

        <View style={styles.detailCard}>
          <Text style={styles.detail}>
            Beauty services
          </Text>

          <Text style={styles.detail}>
            Appointment availability: To be confirmed
          </Text>

          <Text style={styles.detail}>
            Portfolio: Coming soon
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// ==========================================
// STYLES
// ==========================================

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FBF8F1",
  },

  screen: {
    flex: 1,
    backgroundColor: "#FBF8F1",
  },

  content: {
    padding: 22,
    paddingTop: 55,
  },

  back: {
    color: "#758A70",
    fontSize: 15,
    marginBottom: 35,
  },

  avatar: {
    width: 105,
    height: 105,
    borderRadius: 36,
    backgroundColor: "#34483A",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
  },

  initial: {
    color: "#F8F4EB",
    fontSize: 47,
    fontFamily: "Georgia",
  },

  eyebrow: {
    color: "#B79A68",
    fontSize: 9,
    letterSpacing: 1.5,
    textAlign: "center",
    marginTop: 25,
  },

  name: {
    color: "#34483A",
    fontSize: 28,
    fontFamily: "Georgia",
    textAlign: "center",
    marginTop: 9,
  },

  role: {
    color: "#898579",
    fontSize: 12,
    textAlign: "center",
    marginTop: 7,
  },

  ratingCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    padding: 17,
    alignItems: "center",
    marginTop: 25,
    borderWidth: 1,
    borderColor: "#EEE9DE",
  },

  rating: {
    color: "#B79A68",
    fontSize: 19,
    fontWeight: "700",
  },

  ratingText: {
    color: "#969184",
    fontSize: 10,
    marginTop: 5,
  },

  sectionTitle: {
    color: "#34483A",
    fontSize: 20,
    fontFamily: "Georgia",
    marginTop: 28,
    marginBottom: 12,
  },

  description: {
    color: "#898579",
    fontSize: 12,
    lineHeight: 21,
  },

  detailCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    padding: 17,
    borderWidth: 1,
    borderColor: "#EEE9DE",
    gap: 13,
  },

  detail: {
    color: "#69685E",
    fontSize: 12,
  },
});