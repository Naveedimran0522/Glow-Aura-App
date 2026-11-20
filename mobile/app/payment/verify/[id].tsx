
/* Bismillah-ir-Rahman-ir-Raheem ❤️ */
/* GLOWAURA — PAYMENT VERIFICATION + NOTIFICATIONS */

import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  StatusBar,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";

import { verifyCheckoutSession } from "../../../services/payment";

import {
  sendPaymentSuccessNotification,
  sendPaymentFailedNotification,
  sendBookingConfirmedNotification,
  scheduleAppointmentReminder,
} from "../../../services/notification";

const GOLD = "#E8C783";

type RouteParams = {
  id?: string | string[];
  sessionId?: string | string[];
  session_id?: string | string[];
};

const getParam = (value?: string | string[]): string => {
  return Array.isArray(value) ? value[0] || "" : value || "";
};

const isValidBookingId = (id: string): boolean => {
  return /^[a-fA-F0-9]{24}$/.test(id);
};

const isValidStripeSessionId = (id: string): boolean => {
  return /^cs_(test|live)_[a-zA-Z0-9]+$/.test(id);
};

// ------------------------------------------
// NORMALIZE DATE
// ------------------------------------------

const normalizeDate = (value: unknown): string => {
  if (!value) return "";

  const dateString = String(value).trim();

  if (/^\d{4}-\d{2}-\d{2}T/.test(dateString)) {
    return dateString.split("T")[0];
  }

  if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
    const [year, month, day] = dateString.split("-").map(Number);
    const date = new Date(year, month - 1, day);

    if (
      date.getFullYear() !== year ||
      date.getMonth() !== month - 1 ||
      date.getDate() !== day
    ) {
      return "";
    }

    return dateString;
  }

  const localMatch = dateString.match(
    /^(\d{1,2})[/-](\d{1,2})[/-](\d{4})$/
  );

  if (localMatch) {
    const day = localMatch[1].padStart(2, "0");
    const month = localMatch[2].padStart(2, "0");
    const year = localMatch[3];

    const date = new Date(
      Number(year),
      Number(month) - 1,
      Number(day)
    );

    if (
      date.getFullYear() !== Number(year) ||
      date.getMonth() !== Number(month) - 1 ||
      date.getDate() !== Number(day)
    ) {
      return "";
    }

    return `${year}-${month}-${day}`;
  }

  return "";
};

// ------------------------------------------
// NORMALIZE TIME
// ------------------------------------------

const normalizeTime = (value: unknown): string => {
  if (!value) return "";

  const time = String(value).trim();

  if (/^(?:[01]\d|2[0-3]):[0-5]\d$/.test(time)) {
    return time;
  }

  const match = time.match(
    /^(\d{1,2}):(\d{2})\s*(AM|PM)$/i
  );

  if (!match) return "";

  let hours = Number(match[1]);
  const minutes = match[2];
  const period = match[3].toUpperCase();

  if (hours < 1 || hours > 12) return "";

  if (period === "PM" && hours !== 12) {
    hours += 12;
  }

  if (period === "AM" && hours === 12) {
    hours = 0;
  }

  return `${String(hours).padStart(2, "0")}:${minutes}`;
};

// ------------------------------------------
// NORMALIZE BACKEND RESPONSE
// ------------------------------------------

const normalizeResponse = (result: any): any => {
  let response = result;

  for (let index = 0; index < 3; index++) {
    if (
      response?.data &&
      typeof response.data === "object" &&
      !Array.isArray(response.data) &&
      response.success === undefined &&
      response.paid === undefined &&
      response.paymentStatus === undefined
    ) {
      response = response.data;
    } else {
      break;
    }
  }

  return response || {};
};

export default function VerifyPaymentScreen() {
  const router = useRouter();

  const params = useLocalSearchParams<RouteParams>();

  const bookingId = getParam(params.id);

  const sessionId =
    getParam(params.sessionId) ||
    getParam(params.session_id);

  const [loading, setLoading] = useState(true);
  const [verified, setVerified] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const verificationStarted = useRef(false);
  const successNotificationsSent = useRef(false);
  const failureNotificationSent = useRef(false);
  const navigationStarted = useRef(false);

  const navigationTimer =
    useRef<ReturnType<typeof setTimeout> | null>(null);

  const mounted = useRef(true);

  // ------------------------------------------
  // SUCCESS NOTIFICATIONS
  // ------------------------------------------

  const sendSuccessNotifications = useCallback(
    async (booking: any, response: any) => {
      if (successNotificationsSent.current) return;

      successNotificationsSent.current = true;

      const serviceName = String(
        booking?.serviceName ||
          response?.serviceName ||
          "GlowAura Appointment"
      );

      const amount =
        booking?.price ??
        response?.amount ??
        response?.paymentAmount ??
        0;

      try {
        await sendPaymentSuccessNotification(
          serviceName,
          amount,
          bookingId
        );
      } catch (error) {
        console.warn("PAYMENT NOTIFICATION ERROR:", error);
      }

      try {
        await sendBookingConfirmedNotification(
          serviceName,
          bookingId
        );
      } catch (error) {
        console.warn("BOOKING NOTIFICATION ERROR:", error);
      }

      const appointmentDate = normalizeDate(
        booking?.appointmentDate ||
          response?.appointmentDate
      );

      const appointmentTime = normalizeTime(
        booking?.appointmentTime ||
          response?.appointmentTime
      );

      if (appointmentDate && appointmentTime) {
        try {
          const reminderId = await scheduleAppointmentReminder(
            bookingId,
            serviceName,
            appointmentDate,
            appointmentTime
          );

          console.log(
            "APPOINTMENT REMINDER SCHEDULED:",
            reminderId
          );
        } catch (error) {
          console.warn(
            "REMINDER SCHEDULING ERROR:",
            error
          );
        }
      } else {
        console.warn(
          "Appointment date/time missing. Reminder not scheduled."
        );
      }
    },
    [bookingId]
  );

  // ------------------------------------------
  // FAILURE NOTIFICATION
  // ------------------------------------------

  const sendFailureNotification = useCallback(
    async (booking: any, response: any) => {
      if (failureNotificationSent.current) return;

      failureNotificationSent.current = true;

      const serviceName = String(
        booking?.serviceName ||
          response?.serviceName ||
          "GlowAura Appointment"
      );

      try {
        await sendPaymentFailedNotification(
          serviceName,
          bookingId
        );
      } catch (error) {
        console.warn(
          "FAILURE NOTIFICATION ERROR:",
          error
        );
      }
    },
    [bookingId]
  );

  // ------------------------------------------
  // OPEN MY BOOKINGS
  // ------------------------------------------

  const openMyBookings = useCallback(() => {
    if (navigationStarted.current) return;

    navigationStarted.current = true;

    if (navigationTimer.current) {
      clearTimeout(navigationTimer.current);
      navigationTimer.current = null;
    }

    router.replace("/(tabs)/bookings");
  }, [router]);

  // ------------------------------------------
  // VERIFY PAYMENT WITH BACKEND
  // ------------------------------------------

  const handleVerifyPayment = useCallback(async () => {
    // FIX: verified state dependency removed.
    // This prevents the success state from recreating
    // the callback and clearing the navigation timer.

    if (verificationStarted.current) return;

    if (
      !isValidBookingId(bookingId) ||
      !isValidStripeSessionId(sessionId)
    ) {
      setLoading(false);

      setErrorMessage(
        "Booking ID or Stripe Session ID is missing or invalid. Return to My Bookings and check your payment."
      );

      return;
    }

    verificationStarted.current = true;

    setLoading(true);
    setErrorMessage("");

    try {
      const result: any = await verifyCheckoutSession(
        bookingId,
        sessionId
      );

      const response = normalizeResponse(result);

      const booking =
        response?.booking ||
        response?.data?.booking ||
        {};

      const paymentStatus = String(
        response?.paymentStatus ||
          booking?.paymentStatus ||
          response?.payment?.status ||
          ""
      ).toLowerCase();

      // --------------------------------------
      // EXPLICIT PAYMENT FAILURE ONLY
      // --------------------------------------

      const paymentFailed =
        response?.failed === true ||
        response?.paymentFailed === true ||
        paymentStatus === "failed";

      if (paymentFailed) {
        await sendFailureNotification(booking, response);

        throw new Error(
          response?.message ||
            "Your payment was not successful."
        );
      }

      // --------------------------------------
      // VERIFIED SUCCESS ONLY
      // --------------------------------------

      const paymentSuccess =
        response?.success === true &&
        (
          response?.paid === true ||
          paymentStatus === "paid"
        );

      if (!paymentSuccess) {
        throw new Error(
          response?.message ||
            "Payment has not been confirmed yet. Please wait and retry verification."
        );
      }

      if (!mounted.current) return;

      setVerified(true);
      setLoading(false);
      setErrorMessage("");

      // Notifications must not block navigation.
      void sendSuccessNotifications(booking, response);

      // FIX: timer is independent of verified state.
      navigationTimer.current = setTimeout(() => {
        if (mounted.current) {
          openMyBookings();
        }
      }, 2500);

    } catch (error: any) {
      console.error(
        "PAYMENT VERIFICATION ERROR:",
        error
      );

      verificationStarted.current = false;

      if (!mounted.current) return;

      setLoading(false);

      setErrorMessage(
        error?.message ||
          "Payment verification failed. Please try again."
      );
    }
  }, [
    bookingId,
    sessionId,
    openMyBookings,
    sendSuccessNotifications,
    sendFailureNotification,
  ]);

  // ------------------------------------------
  // AUTO VERIFY
  // ------------------------------------------

  useEffect(() => {
    mounted.current = true;

    void handleVerifyPayment();

    return () => {
      mounted.current = false;

      if (navigationTimer.current) {
        clearTimeout(navigationTimer.current);
        navigationTimer.current = null;
      }
    };
  }, [handleVerifyPayment]);

  // ------------------------------------------
  // UI
  // ------------------------------------------

  return (
    <SafeAreaView
      style={styles.safeArea}
      edges={["top", "bottom", "left", "right"]}
    >
      <View style={styles.container}>
        <StatusBar
          barStyle="dark-content"
          backgroundColor="#FFF9EF"
        />

        <View style={styles.content}>
          {loading ? (
            <>
              <ActivityIndicator
                size="large"
                color={GOLD}
                style={styles.loader}
              />

              <Text style={styles.title}>
                Verifying Payment
              </Text>

              <Text style={styles.description}>
                Please wait while GlowAura securely verifies your Stripe payment.
              </Text>
            </>
          ) : verified ? (
            <>
              <Text style={styles.successIcon}>✓</Text>

              <Text style={styles.title}>
                Payment Successful!
              </Text>

              <Text style={styles.description}>
                Your GlowAura booking is confirmed. Taking you to My Bookings...
              </Text>

              <ActivityIndicator
                color={GOLD}
                style={{ marginTop: 25 }}
              />
            </>
          ) : (
            <>
              <Text style={styles.errorIcon}>!</Text>

              <Text style={styles.title}>
                Verification Pending
              </Text>

              <Text style={styles.description}>
                {errorMessage}
              </Text>

              <TouchableOpacity
                style={styles.button}
                onPress={() => {
                  void handleVerifyPayment();
                }}
                activeOpacity={0.8}
              >
                <Text style={styles.buttonText}>
                  Retry Verification
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={() => {
                  router.replace("/(tabs)/bookings");
                }}
                activeOpacity={0.8}
              >
                <Text style={styles.secondaryText}>
                  Go to My Bookings
                </Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

// ------------------------------------------
// STYLES
// ------------------------------------------

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFF9EF",
  },
  container: {
    flex: 1,
    backgroundColor: "#FFF9EF",
    justifyContent: "center",
    alignItems: "center",
    padding: 25,
  },
  content: {
    width: "100%",
    alignItems: "center",
  },
  loader: {
    marginBottom: 30,
  },
  title: {
    fontSize: 25,
    fontWeight: "800",
    color: "#30243B",
    textAlign: "center",
    marginTop: 20,
  },
  description: {
    color: "#746A78",
    fontSize: 15,
    lineHeight: 24,
    textAlign: "center",
    marginTop: 14,
  },
  successIcon: {
    width: 90,
    height: 90,
    borderRadius: 50,
    backgroundColor: "#E5F5E9",
    color: "#249653",
    textAlign: "center",
    textAlignVertical: "center",
    overflow: "hidden",
    fontSize: 55,
    fontWeight: "800",
  },
  errorIcon: {
    width: 85,
    height: 85,
    borderRadius: 50,
    backgroundColor: "#FCE8E6",
    color: "#D9534F",
    textAlign: "center",
    textAlignVertical: "center",
    overflow: "hidden",
    fontSize: 48,
    fontWeight: "800",
  },
  button: {
    backgroundColor: GOLD,
    width: "100%",
    padding: 17,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 30,
  },
  buttonText: {
    color: "#30243B",
    fontSize: 16,
    fontWeight: "800",
  },
  secondaryButton: {
    marginTop: 18,
    padding: 12,
  },
  secondaryText: {
    color: "#746A78",
    fontWeight: "700",
  },
});
