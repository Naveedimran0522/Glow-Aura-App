
/* Bismillah-ir-Rahman-ir-Raheem ❤️ */
/* GLOWAURA — FOREST GREEN & CHAMPAGNE LUXURY OTP VERIFICATION */

import React, { useEffect, useRef, useState } from "react";

import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  ActivityIndicator,
  Animated,
  Easing,
  Dimensions,
  StatusBar,
} from "react-native";

import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import { sendOTP, verifyOTP } from "../services/auth";

const { width: W, height: H } = Dimensions.get("window");

/* ==========================================
   GLOWAURA FOREST LUXURY COLORS
========================================== */

const COLORS = {
  background: "#192B22",
  forest: "#263C30",
  green: "#405B48",
  sage: "#829482",
  gold: "#B99A65",
  champagne: "#E6D3AD",
  ivory: "#FAF8F2",
  white: "#FFFFFF",
  muted: "#89877D",
  border: "#EAE3D6",
  pale: "#F0EDE4",
  blush: "#E9DCD2",
  text: "#263C30",
  softText: "#6D786C",
};

/* ==========================================
   BACKGROUND PARTICLES
========================================== */

const PARTICLES = Array.from({ length: 30 }, (_, i) => ({
  id: i,
  x: (i * 43 + 7) % W,
  y: (i * 31 + 9) % H,
  size: 3 + (i % 3) * 2,
  delay: i * 90,
}));

/* ==========================================
   GOLDEN SPARKLES
========================================== */

function Sparkle({
  item,
}: {
  item: (typeof PARTICLES)[number];
}) {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.delay(item.delay),
        Animated.timing(anim, {
          toValue: 1,
          duration: 1100,
          useNativeDriver: true,
        }),
        Animated.timing(anim, {
          toValue: 0,
          duration: 1300,
          useNativeDriver: true,
        }),
      ])
    );

    loop.start();

    return () => loop.stop();
  }, [anim, item.delay]);

  return (
    <Animated.Text
      pointerEvents="none"
      style={{
        position: "absolute",
        left: item.x,
        top: item.y,
        fontSize: item.size + 5,
        color: COLORS.champagne,
        opacity: anim.interpolate({
          inputRange: [0, 1],
          outputRange: [0.12, 0.95],
        }),
        transform: [
          {
            scale: anim.interpolate({
              inputRange: [0, 1],
              outputRange: [0.5, 1.5],
            }),
          },
          {
            translateY: anim.interpolate({
              inputRange: [0, 1],
              outputRange: [10, -20],
            }),
          },
        ],
      }}
    >
      ✦
    </Animated.Text>
  );
}

/* ==========================================
   FLOATING IVORY PETALS
========================================== */

function Petal({
  left,
  top,
  delay,
}: {
  left: number;
  top: number;
  delay: number;
}) {
  const float = useRef(new Animated.Value(0)).current;
  const rotate = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.parallel([
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(float, {
            toValue: 1,
            duration: 3000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(float, {
            toValue: 0,
            duration: 3000,
            useNativeDriver: true,
          }),
        ]),
        Animated.sequence([
          Animated.timing(rotate, {
            toValue: 1,
            duration: 3000,
            useNativeDriver: true,
          }),
          Animated.timing(rotate, {
            toValue: 0,
            duration: 3000,
            useNativeDriver: true,
          }),
        ]),
      ])
    );

    loop.start();

    return () => loop.stop();
  }, [delay, float, rotate]);

  return (
    <Animated.Text
      pointerEvents="none"
      style={{
        position: "absolute",
        left,
        top,
        fontSize: 25,
        color: COLORS.champagne,
        opacity: 0.65,
        transform: [
          {
            translateY: float.interpolate({
              inputRange: [0, 1],
              outputRange: [0, -30],
            }),
          },
          {
            rotate: rotate.interpolate({
              inputRange: [0, 1],
              outputRange: ["-25deg", "30deg"],
            }),
          },
        ],
      }}
    >
      ❀
    </Animated.Text>
  );
}

/* ==========================================
   ROTATING GOLDEN ORBITS
========================================== */

function Orbit({
  size,
  duration,
  reverse = false,
  color,
}: {
  size: number;
  duration: number;
  reverse?: boolean;
  color: string;
}) {
  const rotation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(rotation, {
        toValue: 1,
        duration,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );

    loop.start();

    return () => loop.stop();
  }, [duration, rotation]);

  const spin = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: reverse
      ? ["360deg", "0deg"]
      : ["0deg", "360deg"],
  });

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.orbit,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          borderColor: color,
          transform: [{ rotate: spin }],
        },
      ]}
    >
      <View style={styles.orbitDot} />
    </Animated.View>
  );
}

/* ==========================================
   GLOWAURA LUXURY GA LOGO
========================================== */

function LuxuryLogo() {
  const bounce = useRef(new Animated.Value(0.75)).current;
  const pulse = useRef(new Animated.Value(1)).current;
  const centerPulse = useRef(new Animated.Value(1)).current;
  const centerGlow = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const intro = Animated.spring(bounce, {
      toValue: 1,
      tension: 40,
      friction: 5,
      useNativeDriver: true,
    });

    const logoLoop = Animated.loop(
      Animated.sequence([
        Animated.delay(2200),
        Animated.spring(pulse, {
          toValue: 1.06,
          friction: 4,
          tension: 40,
          useNativeDriver: true,
        }),
        Animated.spring(pulse, {
          toValue: 1,
          friction: 4,
          useNativeDriver: true,
        }),
      ])
    );

    const centerLoop = Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.spring(centerPulse, {
            toValue: 1.5,
            friction: 4,
            useNativeDriver: true,
          }),
          Animated.timing(centerGlow, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.spring(centerPulse, {
            toValue: 1,
            friction: 4,
            useNativeDriver: true,
          }),
          Animated.timing(centerGlow, {
            toValue: 0.3,
            duration: 1000,
            useNativeDriver: true,
          }),
        ]),
      ])
    );

    intro.start();
    logoLoop.start();
    centerLoop.start();

    return () => {
      intro.stop();
      logoLoop.stop();
      centerLoop.stop();
    };
  }, [bounce, pulse, centerPulse, centerGlow]);

  return (
    <Animated.View
      style={[
        styles.logoSection,
        {
          opacity: bounce,
          transform: [
            { scale: bounce },
            { scale: pulse },
          ],
        },
      ]}
    >
      <View style={styles.logoOrbitContainer}>
        <Orbit
          size={214}
          duration={17000}
          color="rgba(230,211,173,0.65)"
        />

        <Orbit
          size={190}
          duration={12000}
          reverse
          color="rgba(250,248,242,0.55)"
        />

        <Orbit
          size={166}
          duration={9000}
          color="rgba(185,154,101,0.55)"
        />

        <LinearGradient
          colors={["#FAF8F2", "#E6D3AD", "#C5AE7F"]}
          style={styles.logoCircle}
        >
          <View style={styles.innerBorder} />

          <View style={styles.monogram}>
            <Text style={styles.logoG}>G</Text>
            <Text style={styles.logoA}>A</Text>
          </View>

          <Text style={styles.crown}>♛</Text>

          <Animated.View
            style={[
              styles.centerDotGlow,
              {
                opacity: centerGlow,
                transform: [{ scale: centerPulse }],
              },
            ]}
          />

          <View style={styles.centerDot} />

          <View style={styles.logoDecoration}>
            <View style={styles.tinyLine} />
            <Text style={styles.tinyStar}>✦</Text>
            <View style={styles.tinyLine} />
          </View>
        </LinearGradient>

        <Text style={styles.established}>EST. 2026</Text>
      </View>

      <Text style={styles.brand}>GlowAura</Text>

      <View style={styles.brandDivider}>
        <View style={styles.brandLine} />
        <Text style={styles.brandStar}>✧</Text>
        <View style={styles.brandLine} />
      </View>

      <Text style={styles.tagline}>
        BEAUTY BEYOND ORDINARY
      </Text>
    </Animated.View>
  );
}

/* ==========================================
   OTP VERIFICATION SCREEN
========================================== */

export default function VerifyOTPScreen() {
  const router = useRouter();

  const params = useLocalSearchParams<{
    email?: string | string[];
    purpose?: string | string[];
    name?: string | string[];
    phone?: string | string[];
  }>();

  const getParam = (value?: string | string[]) =>
    Array.isArray(value) ? value[0] || "" : value || "";

  const email = getParam(params.email);
  const requestedPurpose = getParam(params.purpose);

  const purpose =
    requestedPurpose === "login" ? "login" : "register";

  const name = getParam(params.name);
  const phone = getParam(params.phone);

  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(60);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  const inputRef = useRef<TextInput>(null);

  const cardOpacity = useRef(new Animated.Value(0)).current;
  const cardY = useRef(new Animated.Value(45)).current;
  const buttonGlow = useRef(new Animated.Value(0)).current;

  /* ==========================================
     SCREEN ANIMATIONS
  ========================================== */

  useEffect(() => {
    const intro = Animated.parallel([
      Animated.timing(cardOpacity, {
        toValue: 1,
        duration: 1000,
        delay: 350,
        useNativeDriver: true,
      }),

      Animated.spring(cardY, {
        toValue: 0,
        tension: 35,
        friction: 8,
        delay: 250,
        useNativeDriver: true,
      }),
    ]);

    const glow = Animated.loop(
      Animated.sequence([
        Animated.timing(buttonGlow, {
          toValue: 1,
          duration: 1800,
          useNativeDriver: true,
        }),
        Animated.timing(buttonGlow, {
          toValue: 0,
          duration: 1800,
          useNativeDriver: true,
        }),
      ])
    );

    intro.start();
    glow.start();

    return () => {
      intro.stop();
      glow.stop();
    };
  }, [cardOpacity, cardY, buttonGlow]);

  /* ==========================================
     OTP COUNTDOWN
  ========================================== */

  useEffect(() => {
    if (timer <= 0) return;

    const interval = setInterval(() => {
      setTimer((previous) => Math.max(0, previous - 1));
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  const formattedTimer = `00:${String(timer).padStart(2, "0")}`;

  /* ==========================================
     VERIFY OTP
  ========================================== */

  const handleVerify = async () => {
    if (!email.trim()) {
      Alert.alert(
        "Missing Email",
        "Please go back and enter your email."
      );
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      Alert.alert(
        "Invalid Email",
        "Please check your email address."
      );
      return;
    }

    if (otp.length !== 6) {
      Alert.alert(
        "Invalid OTP",
        "Please enter all 6 digits."
      );
      return;
    }

    if (loading || resending) return;

    setLoading(true);

    try {
      await verifyOTP({
        email: email.trim().toLowerCase(),
        otp,
        purpose,
      });

      Alert.alert(
        "Welcome to GlowAura!",
        "Your email has been verified successfully.",
        [
          {
            text: "Continue",
            onPress: () => router.replace("/(tabs)"),
          },
        ]
      );
    } catch (error: any) {
      Alert.alert(
        "Verification Failed",
        error?.message ||
          "Incorrect or expired OTP. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  /* ==========================================
     RESEND OTP
  ========================================== */

  const handleResend = async () => {
    if (timer > 0 || resending || loading) return;

    if (!email.trim()) {
      Alert.alert(
        "Missing Email",
        "Please go back and enter your email."
      );
      return;
    }

    setResending(true);

    try {
      await sendOTP({
        email: email.trim().toLowerCase(),
        purpose,
        ...(purpose === "register"
          ? {
              name,
              phone,
            }
          : {}),
      });

      setOtp("");
      setTimer(60);

      Alert.alert(
        "OTP Sent Successfully",
        "A new verification code has been sent to your email."
      );
    } catch (error: any) {
      Alert.alert(
        "Resend Failed",
        error?.message ||
          "Unable to resend OTP. Please try again."
      );
    } finally {
      setResending(false);
    }
  };

  const glowOpacity = buttonGlow.interpolate({
    inputRange: [0, 1],
    outputRange: [0.2, 0.85],
  });

  /* ==========================================
     SCREEN UI
  ========================================== */

  return (
    <LinearGradient
      colors={[
        "#192B22",
        "#263C30",
        "#405B48",
        "#192B22",
      ]}
      locations={[0, 0.36, 0.72, 1]}
      style={styles.container}
    >
      <StatusBar
        barStyle="light-content"
        backgroundColor="#192B22"
      />

      {/* AMBIENT BACKGROUND */}

      <View
        style={StyleSheet.absoluteFill}
        pointerEvents="none"
      >
        <View style={styles.ambientGlow} />
        <View style={styles.bottomGlow} />

        {PARTICLES.map((item) => (
          <Sparkle key={item.id} item={item} />
        ))}

        <Petal
          left={W * 0.08}
          top={H * 0.24}
          delay={200}
        />

        <Petal
          left={W * 0.83}
          top={H * 0.31}
          delay={600}
        />

        <Petal
          left={W * 0.12}
          top={H * 0.75}
          delay={900}
        />

        <Petal
          left={W * 0.85}
          top={H * 0.78}
          delay={400}
        />
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={
          Platform.OS === "ios"
            ? "padding"
            : undefined
        }
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* TOP LABEL */}

          <View style={styles.topLabel}>
            <Text style={styles.topStar}>✧</Text>

            <View style={styles.topLine} />

            <Text style={styles.topText}>
              THE BEAUTY ATELIER
            </Text>

            <View style={styles.topLine} />

            <Text style={styles.topStar}>✧</Text>
          </View>

          {/* BACK BUTTON */}

          <Pressable
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <Text style={styles.backArrow}>‹</Text>

            <Text style={styles.backText}>
              Back
            </Text>
          </Pressable>

          {/* BRAND LOGO */}

          <LuxuryLogo />

          {/* VERIFICATION HEADING */}

          <Animated.View
            style={[
              styles.welcomeSection,
              { opacity: cardOpacity },
            ]}
          >
            <View style={styles.headingDivider}>
              <View style={styles.headingLine} />

              <Text style={styles.headingStar}>
                ✦
              </Text>

              <View style={styles.headingLine} />
            </View>

            <Text style={styles.welcome}>
              Verify Your Email
            </Text>

            <Text style={styles.subtitle}>
              One little step towards your beautiful journey.
            </Text>

            <Text style={styles.emailDescription}>
              WE HAVE SENT YOUR 6-DIGIT VERIFICATION CODE TO
            </Text>

            <Text style={styles.email}>
              {email || "No email provided"}
            </Text>
          </Animated.View>

          {/* OTP CARD */}

          <Animated.View
            style={{
              opacity: cardOpacity,
              transform: [{ translateY: cardY }],
            }}
          >
            <View style={styles.cardOuter}>
              <LinearGradient
                colors={[
                  "#FFFFFF",
                  "#FAF8F2",
                  "#F0EDE4",
                ]}
                style={styles.card}
              >
                <View style={styles.cardHeading}>
                  <Text style={styles.cardIcon}>✧</Text>

                  <Text style={styles.cardTitle}>
                    SECURE EMAIL VERIFICATION
                  </Text>

                  <Text style={styles.cardIcon}>✧</Text>
                </View>

                {/* VERIFICATION ICON */}

                <View style={styles.verificationIcon}>
                  <Text style={styles.mailIcon}>✉</Text>

                  <View style={styles.mailCheck}>
                    <Text style={styles.mailCheckText}>
                      ✓
                    </Text>
                  </View>
                </View>

                <Text style={styles.cardMainTitle}>
                  Enter Your Secret Code
                </Text>

                <Text style={styles.cardSubtitle}>
                  Enter the 6-digit code sent to your inbox.
                </Text>

                <Text style={styles.label}>
                  VERIFICATION CODE
                </Text>

                {/* SIX OTP BOXES */}

                <Pressable
                  style={styles.otpBoxes}
                  onPress={() => inputRef.current?.focus()}
                  accessibilityRole="button"
                  accessibilityLabel="Open OTP input"
                >
                  {Array.from({ length: 6 }).map((_, index) => {
                    const isFilled = index < otp.length;
                    const isActive = index === otp.length;

                    return (
                      <View
                        key={index}
                        style={[
                          styles.otpBox,
                          isFilled && styles.filledOtpBox,
                          isActive && styles.activeOtpBox,
                        ]}
                      >
                        <Text style={styles.otpDigit}>
                          {otp[index] || ""}
                        </Text>

                        {isActive && !isFilled && (
                          <View style={styles.otpCursor} />
                        )}
                      </View>
                    );
                  })}
                </Pressable>

                {/* HIDDEN INPUT */}

                <TextInput
                  ref={inputRef}
                  value={otp}
                  onChangeText={(value) =>
                    setOtp(
                      value.replace(/[^0-9]/g, "").slice(0, 6)
                    )
                  }
                  keyboardType="number-pad"
                  maxLength={6}
                  autoFocus
                  style={styles.hiddenInput}
                  caretHidden
                  accessibilityLabel="Enter six digit OTP"
                  editable={!loading && !resending}
                />

                <Text style={styles.inputHint}>
                  ✧ TAP THE BOXES ABOVE TO ENTER YOUR CODE
                </Text>

                {/* RESEND DIVIDER */}

                <View style={styles.resendDivider} />

                {/* RESEND OTP */}

                <View style={styles.timerRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.resendText}>
                      Didn't receive your code?
                    </Text>

                    <Text style={styles.timer}>
                      {timer > 0
                        ? `Available in ${formattedTimer}`
                        : "You can request a new OTP now"}
                    </Text>
                  </View>

                  <Pressable
                    onPress={handleResend}
                    disabled={
                      timer > 0 ||
                      resending ||
                      loading
                    }
                    style={styles.resendButtonWrapper}
                  >
                    {resending ? (
                      <ActivityIndicator
                        color={COLORS.green}
                      />
                    ) : (
                      <Text
                        style={[
                          styles.resendButton,
                          timer > 0 && styles.disabledResend,
                        ]}
                      >
                        Resend OTP ↗
                      </Text>
                    )}
                  </Pressable>
                </View>

                {/* BUTTON GLOW */}

                <Animated.View
                  pointerEvents="none"
                  style={[
                    styles.buttonGlow,
                    { opacity: glowOpacity },
                  ]}
                />

                {/* VERIFY BUTTON */}

                <Pressable
                  onPress={handleVerify}
                  disabled={loading || resending}
                  style={({ pressed }) => [
                    styles.buttonWrapper,
                    pressed &&
                      !loading && {
                        transform: [{ scale: 0.97 }],
                      },
                    (loading || resending) && {
                      opacity: 0.8,
                    },
                  ]}
                >
                  <LinearGradient
                    colors={[
                      "#405B48",
                      "#263C30",
                      "#192B22",
                    ]}
                    style={styles.button}
                  >
                    {loading ? (
                      <ActivityIndicator
                        color={COLORS.champagne}
                      />
                    ) : (
                      <>
                        <Text style={styles.buttonText}>
                          Verify & Continue
                        </Text>

                        <View style={styles.buttonArrowCircle}>
                          <Text style={styles.buttonArrow}>
                            →
                          </Text>
                        </View>
                      </>
                    )}
                  </LinearGradient>
                </Pressable>

                {/* DIVIDER */}

                <View style={styles.divider}>
                  <View style={styles.dividerLine} />

                  <Text style={styles.dividerIcon}>
                    ✧
                  </Text>

                  <View style={styles.dividerLine} />
                </View>

                {/* SECURITY */}

                <View style={styles.secureInfo}>
                  <Text style={styles.secureIcon}>
                    ◆
                  </Text>

                  <Text style={styles.bottomNote}>
                    YOUR SECURITY IS OUR PRIORITY
                  </Text>
                </View>
              </LinearGradient>
            </View>
          </Animated.View>

          {/* FOOTER */}

          <View style={styles.footerSection}>
            <View style={styles.footerDivider}>
              <View style={styles.footerLine} />

              <Text style={styles.footerStar}>
                ✦
              </Text>

              <View style={styles.footerLine} />
            </View>

            <Text style={styles.footer}>
              BEAUTY IS AN EXPERIENCE, NOT JUST A LOOK.
            </Text>

            <Text style={styles.footerSub}>
              YOUR BEAUTY • YOUR GLOW • YOUR AURA
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

/* ==========================================
   FOREST GREEN & CHAMPAGNE STYLES
========================================== */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: "hidden",
  },

  scroll: {
    flexGrow: 1,
    paddingHorizontal: 23,
    paddingTop: 48,
    paddingBottom: 40,
    justifyContent: "center",
  },

  /* BACKGROUND */

  ambientGlow: {
    position: "absolute",
    width: W * 0.9,
    height: W * 0.9,
    borderRadius: W,
    backgroundColor: "#829482",
    opacity: 0.18,
    top: H * 0.18,
    left: W * 0.05,
  },

  bottomGlow: {
    position: "absolute",
    width: W * 0.75,
    height: W * 0.75,
    borderRadius: W,
    backgroundColor: "#B99A65",
    opacity: 0.12,
    bottom: -100,
    right: -100,
  },

  /* TOP LABEL */

  topLabel: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginBottom: 19,
  },

  topStar: {
    color: COLORS.champagne,
    fontSize: 15,
  },

  topLine: {
    width: 24,
    height: 1,
    backgroundColor: "#829482",
  },

  topText: {
    color: COLORS.champagne,
    fontSize: 8,
    letterSpacing: 2.5,
    fontWeight: "600",
  },

  /* BACK BUTTON */

  backButton: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    paddingHorizontal: 15,
    paddingVertical: 7,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: "rgba(230,211,173,0.55)",
    backgroundColor: "rgba(250,248,242,0.09)",
    marginBottom: 5,
  },

  backArrow: {
    fontSize: 27,
    color: COLORS.ivory,
    marginRight: 7,
  },

  backText: {
    color: COLORS.ivory,
    fontSize: 12,
  },

  /* LOGO */

  logoSection: {
    alignItems: "center",
    marginBottom: 20,
  },

  logoOrbitContainer: {
    width: 225,
    height: 225,
    alignItems: "center",
    justifyContent: "center",
  },

  orbit: {
    position: "absolute",
    borderWidth: 1,
    borderStyle: "dashed",
    alignItems: "center",
  },

  orbitDot: {
    width: 9,
    height: 9,
    borderRadius: 6,
    backgroundColor: COLORS.champagne,
    borderWidth: 1,
    borderColor: COLORS.ivory,
    marginTop: -5,
    shadowColor: COLORS.gold,
    shadowOpacity: 1,
    shadowRadius: 9,
    elevation: 5,
  },

  logoCircle: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 2,
    borderColor: COLORS.champagne,
    alignItems: "center",
    justifyContent: "center",
    elevation: 18,
    shadowColor: COLORS.gold,
    shadowOpacity: 0.5,
    shadowRadius: 20,
  },

  innerBorder: {
    position: "absolute",
    width: 132,
    height: 132,
    borderRadius: 66,
    borderWidth: 1,
    borderColor: COLORS.gold,
  },

  monogram: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  logoG: {
    fontFamily: "Georgia",
    fontSize: 82,
    fontStyle: "italic",
    color: "#263C30",
    marginRight: -18,
  },

  logoA: {
    fontFamily: "Georgia",
    fontSize: 72,
    fontStyle: "italic",
    color: "#405B48",
    marginTop: 18,
  },

  crown: {
    position: "absolute",
    top: 5,
    fontSize: 23,
    color: COLORS.gold,
  },

  centerDotGlow: {
    position: "absolute",
    width: 15,
    height: 15,
    borderRadius: 10,
    backgroundColor: COLORS.gold,
    shadowColor: COLORS.champagne,
    shadowOpacity: 1,
    shadowRadius: 15,
    elevation: 8,
  },

  centerDot: {
    position: "absolute",
    width: 5,
    height: 5,
    borderRadius: 5,
    backgroundColor: COLORS.white,
  },

  logoDecoration: {
    position: "absolute",
    bottom: 19,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  tinyLine: {
    width: 17,
    height: 1,
    backgroundColor: "#829482",
  },

  tinyStar: {
    color: COLORS.gold,
    fontSize: 9,
  },

  established: {
    position: "absolute",
    bottom: -3,
    color: COLORS.champagne,
    fontSize: 8,
    letterSpacing: 4,
  },

  brand: {
    fontFamily: "Georgia",
    fontSize: Math.min(W * 0.14, 52),
    color: COLORS.ivory,
    letterSpacing: 1.5,
    textShadowColor: COLORS.gold,
    textShadowRadius: 16,
  },

  brandDivider: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginTop: 7,
  },

  brandLine: {
    width: 44,
    height: 1,
    backgroundColor: COLORS.gold,
  },

  brandStar: {
    color: COLORS.champagne,
    fontSize: 17,
  },

  tagline: {
    color: COLORS.champagne,
    fontSize: 9,
    letterSpacing: 2.3,
    marginTop: 11,
    fontWeight: "600",
  },

  /* WELCOME */

  welcomeSection: {
    alignItems: "center",
    marginBottom: 23,
  },

  headingDivider: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 10,
  },

  headingLine: {
    width: 48,
    height: 1,
    backgroundColor: "#829482",
  },

  headingStar: {
    color: COLORS.champagne,
    fontSize: 19,
  },

  welcome: {
    fontFamily: "Georgia",
    fontSize: 32,
    color: COLORS.ivory,
    textAlign: "center",
  },

  subtitle: {
    color: COLORS.champagne,
    fontSize: 12,
    lineHeight: 21,
    textAlign: "center",
    marginTop: 9,
  },

  emailDescription: {
    color: COLORS.ivory,
    fontSize: 8,
    letterSpacing: 1.1,
    textAlign: "center",
    marginTop: 17,
  },

  email: {
    color: COLORS.champagne,
    fontSize: 13,
    fontWeight: "800",
    marginTop: 7,
    textAlign: "center",
  },

  /* OTP CARD */

  cardOuter: {
    borderRadius: 29,
    borderWidth: 1.5,
    borderColor: COLORS.gold,
    padding: 3,
    backgroundColor: "rgba(230,211,173,0.15)",
    shadowColor: COLORS.gold,
    shadowOpacity: 0.32,
    shadowRadius: 22,
    shadowOffset: { width: 0, height: 9 },
    elevation: 10,
  },

  card: {
    borderRadius: 25,
    padding: 21,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  cardHeading: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    marginBottom: 20,
  },

  cardIcon: {
    color: COLORS.gold,
    fontSize: 14,
  },

  cardTitle: {
    color: COLORS.forest,
    fontSize: 9,
    letterSpacing: 1.1,
    fontWeight: "700",
  },

  /* VERIFICATION ICON */

  verificationIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F0EDE4",
    borderWidth: 1.5,
    borderColor: COLORS.champagne,
    marginBottom: 13,
  },

  mailIcon: {
    fontSize: 31,
    color: COLORS.forest,
  },

  mailCheck: {
    position: "absolute",
    right: -3,
    bottom: -2,
    width: 23,
    height: 23,
    borderRadius: 12,
    backgroundColor: COLORS.green,
    borderWidth: 2,
    borderColor: COLORS.ivory,
    alignItems: "center",
    justifyContent: "center",
  },

  mailCheckText: {
    color: COLORS.ivory,
    fontSize: 13,
    fontWeight: "800",
  },

  cardMainTitle: {
    fontFamily: "Georgia",
    color: COLORS.forest,
    fontSize: 21,
    textAlign: "center",
  },

  cardSubtitle: {
    color: COLORS.softText,
    fontSize: 10,
    textAlign: "center",
    marginTop: 7,
    marginBottom: 24,
  },

  /* OTP INPUT */

  label: {
    color: COLORS.forest,
    fontSize: 10,
    letterSpacing: 2,
    fontWeight: "700",
    marginBottom: 13,
  },

  otpBoxes: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 7,
  },

  otpBox: {
    flex: 1,
    height: 53,
    backgroundColor: "rgba(255,255,255,0.85)",
    borderRadius: 13,
    borderWidth: 1,
    borderColor: "#C8B995",
    justifyContent: "center",
    alignItems: "center",
  },

  filledOtpBox: {
    backgroundColor: "#F0EDE4",
    borderColor: COLORS.green,
  },

  activeOtpBox: {
    borderColor: COLORS.forest,
    borderWidth: 1.8,
    backgroundColor: COLORS.white,
  },

  otpDigit: {
    color: COLORS.forest,
    fontSize: 22,
    fontWeight: "800",
  },

  otpCursor: {
    width: 2,
    height: 20,
    backgroundColor: COLORS.green,
    position: "absolute",
  },

  hiddenInput: {
    position: "absolute",
    width: 1,
    height: 1,
    opacity: 0,
    top: 80,
    left: 80,
  },

  inputHint: {
    color: COLORS.muted,
    fontSize: 8,
    letterSpacing: 0.8,
    marginTop: 12,
  },

  /* RESEND */

  resendDivider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginTop: 24,
    marginBottom: 18,
  },

  timerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  resendText: {
    color: COLORS.forest,
    fontSize: 10,
    fontWeight: "600",
  },

  timer: {
    color: COLORS.muted,
    fontSize: 9,
    marginTop: 6,
  },

  resendButtonWrapper: {
    paddingVertical: 8,
    paddingHorizontal: 5,
  },

  resendButton: {
    color: COLORS.green,
    fontSize: 10,
    fontWeight: "800",
  },

  disabledResend: {
    color: "#B8B5A9",
  },

  /* VERIFY BUTTON */

  buttonGlow: {
    position: "absolute",
    bottom: 90,
    left: 10,
    right: 10,
    height: 62,
    borderRadius: 40,
    backgroundColor: COLORS.gold,
    shadowColor: COLORS.champagne,
    shadowOpacity: 1,
    shadowRadius: 20,
    elevation: 8,
  },

  buttonWrapper: {
    marginTop: 24,
    borderRadius: 40,
    overflow: "hidden",
    borderWidth: 1.5,
    borderColor: COLORS.gold,
    elevation: 6,
  },

  button: {
    height: 60,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 15,
  },

  buttonText: {
    fontFamily: "Georgia",
    color: COLORS.ivory,
    fontSize: 16,
  },

  buttonArrowCircle: {
    position: "absolute",
    right: 8,
    width: 43,
    height: 43,
    borderRadius: 23,
    borderWidth: 1,
    borderColor: COLORS.champagne,
    alignItems: "center",
    justifyContent: "center",
  },

  buttonArrow: {
    color: COLORS.champagne,
    fontSize: 25,
  },

  /* SECURITY */

  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 21,
    marginBottom: 15,
  },

  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.border,
  },

  dividerIcon: {
    color: COLORS.gold,
    fontSize: 15,
    marginHorizontal: 12,
  },

  secureInfo: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },

  secureIcon: {
    color: COLORS.gold,
    fontSize: 10,
  },

  bottomNote: {
    textAlign: "center",
    color: COLORS.muted,
    fontSize: 8,
    fontWeight: "700",
    letterSpacing: 1.6,
  },

  /* FOOTER */

  footerSection: {
    alignItems: "center",
    marginTop: 28,
  },

  footerDivider: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 15,
  },

  footerLine: {
    width: 40,
    height: 1,
    backgroundColor: "#829482",
  },

  footerStar: {
    color: COLORS.champagne,
    fontSize: 15,
  },

  footer: {
    color: COLORS.ivory,
    fontSize: 8,
    letterSpacing: 1.2,
    textAlign: "center",
  },

  footerSub: {
    color: COLORS.champagne,
    fontSize: 8,
    letterSpacing: 1.4,
    marginTop: 10,
  },
});
