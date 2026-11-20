
/* Bismillah-ir-Rahman-ir-Raheem ❤️ */
/* GLOWAURA — HELP & SUPPORT */

import React, { useState } from "react";

import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Linking,
} from "react-native";

import { useRouter } from "expo-router";

const FAQS = [
  {
    question: "How can I book a beauty service?",
    answer:
      "Open Services, select your preferred beauty service and artist, choose an available date and time, then confirm your booking.",
  },
  {
    question: "How can I check my booking status?",
    answer:
      "Open the Bookings tab to view your appointments, payment status and booking details.",
  },
  {
    question: "What should I do if payment fails?",
    answer:
      "First check your payment status in My Bookings. Avoid making another payment until you confirm whether the previous payment was successful.",
  },
  {
    question: "Can I cancel my appointment?",
    answer:
      "Open My Bookings, select the relevant appointment and use the Cancel option if cancellation is available.",
  },
  {
    question: "How can I use the AI Beauty Assistant?",
    answer:
      "Open the AI Beauty tab to ask beauty-care questions. You can also use the available voice assistant feature.",
  },
  {
    question: "How can I update my personal information?",
    answer:
      "Open Profile and select Personal Information to view your registered account details.",
  },
];

export default function HelpSupportScreen() {
  const router = useRouter();
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);

  const contactSupport = async () => {
    const subject = encodeURIComponent("GlowAura Support Request");
    const body = encodeURIComponent(
      "Hello GlowAura Support,\n\nI need help with:\n\n\nMy registered email:\n\nThank you."
    );

    const emailUrl = `mailto:?subject=${subject}&body=${body}`;

    try {
      await Linking.openURL(emailUrl);
    } catch {
      Alert.alert(
        "Email App Not Available",
        "Please open your email application manually to contact GlowAura support."
      );
    }
  };

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.back()}
      >
        <Text style={styles.backText}>‹  Back to Profile</Text>
      </TouchableOpacity>

      <View style={styles.header}>
        <View style={styles.iconCircle}>
          <Text style={styles.headerIcon}>?</Text>
        </View>

        <Text style={styles.title}>How can we help?</Text>

        <Text style={styles.subtitle}>
          Find answers to common GlowAura questions.
        </Text>
      </View>

      <Text style={styles.sectionTitle}>
        FREQUENTLY ASKED QUESTIONS
      </Text>

      {FAQS.map((faq, index) => {
        const isExpanded = expandedIndex === index;

        return (
          <View style={styles.faqCard} key={faq.question}>
            <TouchableOpacity
              style={styles.questionRow}
              activeOpacity={0.8}
              onPress={() =>
                setExpandedIndex(isExpanded ? null : index)
              }
            >
              <Text style={styles.question}>
                {faq.question}
              </Text>

              <Text style={styles.arrow}>
                {isExpanded ? "−" : "+"}
              </Text>
            </TouchableOpacity>

            {isExpanded && (
              <View style={styles.answerContainer}>
                <Text style={styles.answer}>
                  {faq.answer}
                </Text>
              </View>
            )}
          </View>
        );
      })}

      <View style={styles.contactCard}>
        <Text style={styles.contactTitle}>
          Still need help?
        </Text>

        <Text style={styles.contactDescription}>
          Prepare a support request using your email application.
          You can describe your booking, payment or account issue.
        </Text>

        <TouchableOpacity
          style={styles.contactButton}
          onPress={contactSupport}
          activeOpacity={0.85}
        >
          <Text style={styles.contactButtonText}>
            ✉  Contact Support
          </Text>
        </TouchableOpacity>
      </View>

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

  backButton: {
    alignSelf: "flex-start",
    paddingVertical: 10,
  },

  backText: {
    color: "#34483A",
    fontSize: 14,
    fontWeight: "600",
  },

  header: {
    alignItems: "center",
    marginTop: 22,
    marginBottom: 35,
  },

  iconCircle: {
    width: 65,
    height: 65,
    borderRadius: 23,
    backgroundColor: "#34483A",
    alignItems: "center",
    justifyContent: "center",
  },

  headerIcon: {
    color: "#D8C28A",
    fontSize: 35,
    fontWeight: "700",
  },

  title: {
    color: "#34483A",
    fontSize: 25,
    fontFamily: "Georgia",
    marginTop: 17,
  },

  subtitle: {
    color: "#827D70",
    fontSize: 12,
    textAlign: "center",
    marginTop: 8,
  },

  sectionTitle: {
    color: "#B79A68",
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1.4,
    marginBottom: 14,
  },

  faqCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    marginBottom: 11,
    borderWidth: 1,
    borderColor: "#EEE9DE",
    overflow: "hidden",
  },

  questionRow: {
    minHeight: 62,
    paddingHorizontal: 16,
    paddingVertical: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  question: {
    color: "#34483A",
    fontSize: 13,
    fontWeight: "600",
    flex: 1,
    paddingRight: 12,
  },

  arrow: {
    color: "#B79A68",
    fontSize: 23,
    fontWeight: "500",
  },

  answerContainer: {
    paddingHorizontal: 16,
    paddingBottom: 17,
  },

  answer: {
    color: "#827D70",
    fontSize: 12,
    lineHeight: 20,
  },

  contactCard: {
    backgroundColor: "#34483A",
    padding: 20,
    borderRadius: 17,
    marginTop: 22,
  },

  contactTitle: {
    color: "#D8C28A",
    fontSize: 18,
    fontFamily: "Georgia",
  },

  contactDescription: {
    color: "#F8F4EB",
    fontSize: 12,
    lineHeight: 20,
    marginTop: 10,
  },

  contactButton: {
    backgroundColor: "#D8C28A",
    padding: 14,
    borderRadius: 11,
    alignItems: "center",
    marginTop: 18,
  },

  contactButtonText: {
    color: "#34483A",
    fontSize: 13,
    fontWeight: "700",
  },

  footer: {
    color: "#B79A68",
    textAlign: "center",
    fontSize: 9,
    letterSpacing: 2,
    marginTop: 35,
  },
});
