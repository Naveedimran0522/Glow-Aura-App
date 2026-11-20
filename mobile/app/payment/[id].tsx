
/* Bismillah-ir-Rahman-ir-Raheem ❤️ */
/* GLOWAURA — STRIPE CHECKOUT + EXPO GO AUTO RETURN */

import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ActivityIndicator,
  Alert,
  StatusBar,
  ScrollView,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";

import * as Linking from "expo-linking";
import * as WebBrowser from "expo-web-browser";
import Constants from "expo-constants";

import { LinearGradient } from "expo-linear-gradient";

import {
  ArrowLeft,
  ShieldCheck,
  CreditCard,
  LockKeyhole,
} from "lucide-react-native";

import { createCheckoutSession } from "../../services/payment";

WebBrowser.maybeCompleteAuthSession();

const GOLD = "#E8C783";
const DARK = "#100D19";

type RouteParams = {
  id?: string | string[];
  bookingId?: string | string[];
};

const firstParam = (value?: string | string[]): string => {
  return Array.isArray(value) ? value[0] || "" : value || "";
};

const isValidBookingId = (id: string): boolean => {
  return /^[a-fA-F0-9]{24}$/.test(id);
};

const isValidStripeSessionId = (id: string): boolean => {
  return /^cs_(test|live)_[a-zA-Z0-9]+$/.test(id);
};

export default function PaymentScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<RouteParams>();

  const bookingId =
    firstParam(params.id) || firstParam(params.bookingId);

  const [loading, setLoading] = useState(false);
  const [checkoutCreated, setCheckoutCreated] = useState(false);

  const paymentStarted = useRef(false);
  const returnHandled = useRef(false);
  const sessionIdRef = useRef("");
  const mounted = useRef(true);

  // ------------------------------------------
  // GENERATE APP RETURN URL
  // ------------------------------------------

  const generateReturnUrl = useCallback((id: string): string => {
    if (!isValidBookingId(id)) {
      throw new Error("Invalid booking ID.");
    }

    const constants = Constants as any;

    const hostUri =
      Constants.expoConfig?.hostUri ||
      constants.manifest2?.extra?.expoGo?.debuggerHost ||
      constants.manifest?.debuggerHost;

    const isExpoGo =
      Constants.executionEnvironment === "storeClient" ||
      constants.appOwnership === "expo" ||
      Boolean(hostUri);

    if (isExpoGo) {
      if (!hostUri) {
        throw new Error(
          "Expo Go host not found. Restart Expo using npx expo start -c."
        );
      }

      const cleanHost = String(hostUri)
        .trim()
        .replace(/^https?:\/\//i, "")
        .replace(/^exp:\/\//i, "")
        .replace(/^\/+|\/+$/g, "");

      if (!cleanHost) {
        throw new Error("Invalid Expo Go host address.");
      }

      return `exp://${cleanHost}/--/payment/verify/${encodeURIComponent(id)}`;
    }

    return Linking.createURL(
      `payment/verify/${encodeURIComponent(id)}`
    );
  }, []);

  // ------------------------------------------
  // OPEN VERIFICATION SCREEN
  // ------------------------------------------

  const openVerificationScreen = useCallback(
    (id: string, stripeSessionId: string) => {
      if (returnHandled.current) return;

      if (
        !isValidBookingId(id) ||
        !isValidStripeSessionId(stripeSessionId)
      ) {
        Alert.alert(
          "Payment Verification",
          "Booking ID or Stripe Session ID is missing or invalid."
        );
        return;
      }

      returnHandled.current = true;

      router.replace({
        pathname: "/payment/verify/[id]",
        params: {
          id,
          sessionId: stripeSessionId,
        },
      });
    },
    [router]
  );

  // ------------------------------------------
  // HANDLE RETURN DEEP LINK
  // ------------------------------------------

  const handleReturnUrl = useCallback(
    (url: string) => {
      if (!url || returnHandled.current) return;

      try {
        const parsed = Linking.parse(url);

        const pathParts = String(parsed.path || "")
          .split("/")
          .filter(Boolean);

        const verifyIndex = pathParts.lastIndexOf("verify");

        let returnedBookingId = "";

        if (verifyIndex >= 0) {
          returnedBookingId = decodeURIComponent(
            pathParts[verifyIndex + 1] || ""
          );
        }

        const querySession =
          parsed.queryParams?.session_id ??
          parsed.queryParams?.sessionId;

        const returnedSessionId = Array.isArray(querySession)
          ? String(querySession[0] || "")
          : String(querySession || sessionIdRef.current || "");

        const finalBookingId = returnedBookingId || bookingId;

        if (
          !isValidBookingId(finalBookingId) ||
          !isValidStripeSessionId(returnedSessionId)
        ) {
          console.warn(
            "Stripe return did not contain valid verification details."
          );
          return;
        }

        openVerificationScreen(
          finalBookingId,
          returnedSessionId
        );
      } catch (error) {
        console.error("RETURN URL PARSE ERROR:", error);
      }
    },
    [bookingId, openVerificationScreen]
  );

  // ------------------------------------------
  // DEEP LINK LISTENER
  // ------------------------------------------

  useEffect(() => {
    mounted.current = true;

    const subscription = Linking.addEventListener(
      "url",
      ({ url }) => handleReturnUrl(url)
    );

    Linking.getInitialURL()
      .then((url) => {
        if (url && mounted.current) {
          handleReturnUrl(url);
        }
      })
      .catch((error) => {
        console.error("INITIAL URL ERROR:", error);
      });

    return () => {
      mounted.current = false;
      subscription.remove();
    };
  }, [handleReturnUrl]);

  // ------------------------------------------
  // START STRIPE CHECKOUT
  // ------------------------------------------

  const handlePayNow = async () => {
    if (paymentStarted.current || loading) return;

    if (!isValidBookingId(bookingId)) {
      Alert.alert("Booking Error", "The booking ID is invalid.");
      return;
    }

    paymentStarted.current = true;
    returnHandled.current = false;

    setLoading(true);
    setCheckoutCreated(false);

    try {
      const appReturnUrl = generateReturnUrl(bookingId);

      const result: any = await createCheckoutSession(
        bookingId,
        appReturnUrl
      );

      const response =
        result?.data?.data ??
        result?.data ??
        result;

      const checkoutUrl =
        response?.checkoutUrl ||
        response?.url ||
        response?.data?.checkoutUrl;

      const stripeSessionId =
        response?.sessionId ||
        response?.id ||
        response?.data?.sessionId;

      if (
        response?.success !== true ||
        !checkoutUrl ||
        !stripeSessionId
      ) {
        throw new Error(
          response?.message ||
            "Stripe checkout details are missing."
        );
      }

      if (
        !/^https:\/\/checkout\.stripe\.com\//i.test(
          String(checkoutUrl)
        )
      ) {
        throw new Error(
          "The returned Stripe Checkout URL is invalid."
        );
      }

      if (!isValidStripeSessionId(String(stripeSessionId))) {
        throw new Error("The Stripe Session ID is invalid.");
      }

      sessionIdRef.current = String(stripeSessionId);

      if (!mounted.current) return;

      setCheckoutCreated(true);
      setLoading(false);

      const browserResult = await WebBrowser.openAuthSessionAsync(
        String(checkoutUrl),
        appReturnUrl,
        {
          showTitle: true,
          preferEphemeralSession: false,
        }
      );

      if (!mounted.current) return;

      if (
        browserResult.type === "success" &&
        browserResult.url
      ) {
        handleReturnUrl(browserResult.url);
        return;
      }

      // Keep the current session available for manual verification.
      paymentStarted.current = false;

      setCheckoutCreated(true);

      if (
        browserResult.type === "dismiss" ||
        browserResult.type === "cancel"
      ) {
        Alert.alert(
          "Checkout Closed",
          "Your Stripe session is retained. If you completed payment, tap Verify Existing Payment before starting another checkout."
        );
      } else {
        Alert.alert(
          "Checkout Status",
          "The browser closed without returning verification details. You can verify the existing session."
        );
      }
    } catch (error: any) {
      console.error("STRIPE PAYMENT ERROR:", error);

      paymentStarted.current = false;

      if (mounted.current) {
        setLoading(false);

        Alert.alert(
          "Payment Error",
          error?.message || "Unable to start Stripe checkout."
        );
      }
    }
  };

  // ------------------------------------------
  // MANUAL VERIFY EXISTING SESSION
  // ------------------------------------------

  const handleManualVerify = () => {
    if (!isValidBookingId(bookingId)) {
      Alert.alert("Error", "Booking ID is invalid.");
      return;
    }

    if (!isValidStripeSessionId(sessionIdRef.current)) {
      Alert.alert(
        "Session Missing",
        "No valid Stripe session is available. Check My Bookings before starting another payment."
      );
      return;
    }

    returnHandled.current = false;

    openVerificationScreen(
      bookingId,
      sessionIdRef.current
    );
  };

  // ------------------------------------------
  // UI
  // ------------------------------------------

  return (
    <SafeAreaView
      style={styles.safeArea}
      edges={["top", "bottom", "left", "right"]}
    >
      <LinearGradient
        colors={["#100D19", "#21172C", "#100D19"]}
        style={styles.container}
      >
        <StatusBar barStyle="light-content" />

        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <Pressable
            style={styles.backButton}
            onPress={() => router.back()}
            disabled={loading}
          >
            <ArrowLeft color={GOLD} size={23} />
          </Pressable>

          <View style={styles.iconCircle}>
            <CreditCard color={GOLD} size={42} />
          </View>

          <Text style={styles.title}>Secure Payment</Text>

          <Text style={styles.subtitle}>
            Complete your GlowAura booking payment securely with Stripe.
          </Text>

          <View style={styles.securityCard}>
            <ShieldCheck color={GOLD} size={24} />

            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>
                Secure Stripe Checkout
              </Text>

              <Text style={styles.cardDescription}>
                Your payment is processed securely by Stripe.
              </Text>
            </View>
          </View>

          <View style={styles.securityCard}>
            <LockKeyhole color={GOLD} size={24} />

            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>
                Server-side Verification
              </Text>

              <Text style={styles.cardDescription}>
                Your booking is confirmed only after successful verification.
              </Text>
            </View>
          </View>

          <Pressable
            style={[
              styles.payButton,
              loading && styles.disabledButton,
            ]}
            onPress={handlePayNow}
            disabled={loading}
          >
            <LinearGradient
              colors={["#F7DFA8", "#D8AD62"]}
              style={styles.buttonGradient}
            >
              {loading ? (
                <ActivityIndicator color={DARK} />
              ) : (
                <Text style={styles.payText}>
                  Pay Securely with Stripe
                </Text>
              )}
            </LinearGradient>
          </Pressable>

          {checkoutCreated && (
            <Pressable
              style={styles.verifyButton}
              onPress={handleManualVerify}
            >
              <Text style={styles.verifyText}>
                Verify Existing Payment
              </Text>
            </Pressable>
          )}

          <Text style={styles.footer}>
            Secure payment powered by Stripe
          </Text>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
}

// ------------------------------------------
// STYLES
// ------------------------------------------

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: DARK,
  },
  container: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    padding: 24,
    paddingTop: 55,
    justifyContent: "center",
  },
  backButton: {
    position: "absolute",
    top: 45,
    left: 22,
    zIndex: 2,
    padding: 10,
  },
  iconCircle: {
    alignSelf: "center",
    width: 95,
    height: 95,
    borderRadius: 50,
    backgroundColor: "#30243B",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 25,
    borderWidth: 1,
    borderColor: GOLD,
  },
  title: {
    color: "#FFFFFF",
    fontSize: 30,
    fontWeight: "800",
    textAlign: "center",
  },
  subtitle: {
    color: "#C7BBCB",
    fontSize: 14,
    textAlign: "center",
    lineHeight: 23,
    marginTop: 12,
    marginBottom: 35,
  },
  securityCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
    padding: 18,
    backgroundColor: "#FFFFFF0D",
    borderWidth: 1,
    borderColor: "#FFFFFF18",
    borderRadius: 18,
    marginBottom: 15,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },
  cardDescription: {
    color: "#C7BBCB",
    fontSize: 12,
    lineHeight: 19,
    marginTop: 5,
  },
  payButton: {
    borderRadius: 16,
    overflow: "hidden",
    marginTop: 25,
  },
  disabledButton: {
    opacity: 0.7,
  },
  buttonGradient: {
    height: 57,
    justifyContent: "center",
    alignItems: "center",
  },
  payText: {
    color: DARK,
    fontWeight: "800",
    fontSize: 16,
  },
  verifyButton: {
    borderWidth: 1,
    borderColor: GOLD,
    borderRadius: 14,
    padding: 16,
    marginTop: 15,
    alignItems: "center",
  },
  verifyText: {
    color: GOLD,
    fontSize: 15,
    fontWeight: "700",
  },
  footer: {
    color: "#C7BBCB",
    textAlign: "center",
    marginTop: 30,
    fontSize: 12,
  },
});
