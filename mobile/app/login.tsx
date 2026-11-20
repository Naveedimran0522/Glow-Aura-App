
/* Bismillah-ir-Rahman-ir-Raheem ❤️ */
/* GLOWAURA — FOREST GREEN & CHAMPAGNE GOLD LUXURY LOGIN */
/* SAFE AREA VIEW INTEGRATED — ORIGINAL DESIGN PRESERVED */

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

import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { sendOTP } from "../services/auth";

const { width: W, height: H } = Dimensions.get("window");

// ======================================================
// COLORS
// ======================================================

const COLORS = {
  deep: "#192B22",
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
  darkText: "#263C30",
  lightText: "#F7F1E5",
};

// ======================================================
// PARTICLES
// ======================================================

const PARTICLES = Array.from({ length: 30 }, (_, i) => ({
  id: i,
  x: (i * 43 + 7) % W,
  y: (i * 31 + 9) % H,
  size: 3 + (i % 3) * 2,
  delay: i * 90,
}));

// ======================================================
// GOLDEN SPARKLE PARTICLES
// ======================================================

function Sparkle({ item }: { item: typeof PARTICLES[number] }) {
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

// ======================================================
// FLOATING GOLDEN PETALS
// ======================================================

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

  const rotation = rotate.interpolate({
    inputRange: [0, 1],
    outputRange: ["-25deg", "30deg"],
  });

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
          { rotate: rotation },
        ],
      }}
    >
      ❀
    </Animated.Text>
  );
}

// ======================================================
// ROTATING ORBIT
// ======================================================

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

// ======================================================
// MAIN LOGIN SCREEN
// ======================================================

export default function LoginScreen() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const entrance = useRef(new Animated.Value(0.7)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const cardOpacity = useRef(new Animated.Value(0)).current;
  const cardY = useRef(new Animated.Value(45)).current;
  const logoBounce = useRef(new Animated.Value(1)).current;
  const centerPulse = useRef(new Animated.Value(1)).current;
  const centerGlow = useRef(new Animated.Value(0.3)).current;
  const buttonGlow = useRef(new Animated.Value(0)).current;

  // ====================================================
  // INTRO ANIMATIONS
  // ====================================================

  useEffect(() => {
    const intro = Animated.parallel([
      Animated.spring(entrance, {
        toValue: 1,
        tension: 40,
        friction: 5,
        useNativeDriver: true,
      }),

      Animated.timing(logoOpacity, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),

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

    const pulse = Animated.loop(
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

    const bounce = Animated.loop(
      Animated.sequence([
        Animated.delay(2200),

        Animated.spring(logoBounce, {
          toValue: 1.06,
          friction: 4,
          tension: 40,
          useNativeDriver: true,
        }),

        Animated.spring(logoBounce, {
          toValue: 1,
          friction: 4,
          useNativeDriver: true,
        }),
      ])
    );

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
    pulse.start();
    bounce.start();
    glow.start();

    return () => {
      intro.stop();
      pulse.stop();
      bounce.stop();
      glow.stop();
    };
  }, [
    entrance,
    logoOpacity,
    cardOpacity,
    cardY,
    logoBounce,
    centerPulse,
    centerGlow,
    buttonGlow,
  ]);

  // ====================================================
  // EMAIL OTP LOGIN
  // ====================================================

  const handleLogin = async () => {
    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail) {
      Alert.alert(
        "Email Required",
        "Please enter your email address."
      );
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(normalizedEmail)) {
      Alert.alert(
        "Invalid Email",
        "Please enter a valid email."
      );
      return;
    }

    if (loading) return;

    setLoading(true);

    try {
      await sendOTP({
        email: normalizedEmail,
        purpose: "login",
      });

      router.push({
        pathname: "/verify-otp",
        params: {
          email: normalizedEmail,
          purpose: "login",
        },
      });
    } catch (error: any) {
      Alert.alert(
        "Login Error",
        error?.message || "Unable to send OTP."
      );
    } finally {
      setLoading(false);
    }
  };

  const glowOpacity = buttonGlow.interpolate({
    inputRange: [0, 1],
    outputRange: [0.15, 0.7],
  });

  // ====================================================
  // UI
  // ====================================================

  return (
    <LinearGradient
      colors={[
        COLORS.deep,
        COLORS.forest,
        COLORS.green,
        COLORS.deep,
      ]}
      locations={[0, 0.36, 0.72, 1]}
      style={styles.container}
    >
      <StatusBar
        barStyle="light-content"
        backgroundColor={COLORS.deep}
        translucent={false}
      />

      {/* SAFE AREA VIEW */}

      <SafeAreaView
        edges={["top", "bottom"]}
        style={styles.safeArea}
      >

        {/* BACKGROUND AMBIENCE */}

        <View
          style={StyleSheet.absoluteFill}
          pointerEvents="none"
        >
          <View style={styles.ambientGlow} />
          <View style={styles.bottomGlow} />

          {PARTICLES.map((item) => (
            <Sparkle key={item.id} item={item} />
          ))}

          <Petal left={W * 0.08} top={H * 0.24} delay={200} />
          <Petal left={W * 0.83} top={H * 0.31} delay={600} />
          <Petal left={W * 0.12} top={H * 0.75} delay={900} />
          <Petal left={W * 0.85} top={H * 0.78} delay={400} />
        </View>

        <KeyboardAvoidingView
          style={styles.keyboardView}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <ScrollView
            contentContainerStyle={styles.scroll}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
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
              onPress={() => router.replace("/onboarding")}
              style={styles.backButton}
            >
              <Text style={styles.backArrow}>‹</Text>
              <Text style={styles.backText}>Back</Text>
            </Pressable>

            {/* ANIMATED LOGO */}

            <Animated.View
              style={[
                styles.logoSection,
                {
                  opacity: logoOpacity,
                  transform: [
                    { scale: entrance },
                    { scale: logoBounce },
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
                  color="rgba(185,154,101,0.5)"
                />

                {/* CENTRAL LOGO */}

                <LinearGradient
                  colors={[
                    COLORS.ivory,
                    COLORS.champagne,
                    "#C9B58D",
                  ]}
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

                <Text style={styles.established}>
                  EST. 2026
                </Text>
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

            {/* WELCOME SECTION */}

            <Animated.View
              style={[
                styles.welcomeSection,
                { opacity: cardOpacity },
              ]}
            >
              <View style={styles.headingDivider}>
                <View style={styles.headingLine} />
                <Text style={styles.headingStar}>✦</Text>
                <View style={styles.headingLine} />
              </View>

              <Text style={styles.welcome}>
                Welcome Back
              </Text>

              <Text style={styles.subtitle}>
                Your glow awaits. Sign in to continue
                {"\n"}
                your beauty journey.
              </Text>
            </Animated.View>

            {/* LUXURY LOGIN CARD */}

            <Animated.View
              style={{
                opacity: cardOpacity,
                transform: [{ translateY: cardY }],
              }}
            >
              <View style={styles.cardOuter}>
                <LinearGradient
                  colors={[
                    COLORS.ivory,
                    "#F5F1E7",
                    "#EDE5D5",
                  ]}
                  style={styles.card}
                >
                  <View style={styles.cardHeading}>
                    <Text style={styles.cardIcon}>✧</Text>

                    <Text style={styles.cardTitle}>
                      SIGN IN TO YOUR ACCOUNT
                    </Text>

                    <Text style={styles.cardIcon}>✧</Text>
                  </View>

                  <Text style={styles.label}>
                    EMAIL ADDRESS
                  </Text>

                  {/* EMAIL INPUT */}

                  <View style={styles.inputContainer}>
                    <Text style={styles.emailIcon}>✉</Text>

                    <View style={styles.inputDivider} />

                    <TextInput
                      value={email}
                      onChangeText={setEmail}
                      placeholder="Enter your email address"
                      placeholderTextColor="#89877D"
                      keyboardType="email-address"
                      autoCapitalize="none"
                      autoCorrect={false}
                      autoComplete="email"
                      editable={!loading}
                      returnKeyType="done"
                      onSubmitEditing={handleLogin}
                      style={styles.input}
                    />
                  </View>

                  {/* BUTTON GLOW */}

                  <Animated.View
                    pointerEvents="none"
                    style={[
                      styles.buttonGlow,
                      { opacity: glowOpacity },
                    ]}
                  />

                  {/* CONTINUE BUTTON */}

                  <Pressable
                    onPress={handleLogin}
                    disabled={loading}
                    style={({ pressed }) => [
                      styles.buttonWrapper,
                      pressed && {
                        transform: [{ scale: 0.97 }],
                      },
                      loading && { opacity: 0.8 },
                    ]}
                  >
                    <LinearGradient
                      colors={[
                        COLORS.green,
                        COLORS.forest,
                        COLORS.deep,
                      ]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.button}
                    >
                      {loading ? (
                        <ActivityIndicator color={COLORS.ivory} />
                      ) : (
                        <>
                          <Text style={styles.buttonText}>
                            Continue with Email
                          </Text>

                          <View style={styles.buttonArrowCircle}>
                            <Text style={styles.buttonArrow}>→</Text>
                          </View>
                        </>
                      )}
                    </LinearGradient>
                  </Pressable>

                  {/* SECURE VERIFICATION */}

                  <View style={styles.secureInfo}>
                    <Text style={styles.secureIcon}>◆</Text>

                    <Text style={styles.secureText}>
                      Secure email verification with OTP
                    </Text>
                  </View>

                </LinearGradient>
              </View>
            </Animated.View>

            {/* REGISTER */}

            <Animated.View style={{ opacity: cardOpacity }}>
              <View style={styles.registerDivider}>
                <View style={styles.registerLine} />

                <Text style={styles.registerLabel}>
                  NEW TO GLOWAURA?
                </Text>

                <View style={styles.registerLine} />
              </View>

              <Pressable
                onPress={() => router.push("/register")}
                style={({ pressed }) => [
                  styles.registerButton,
                  pressed && { opacity: 0.7 },
                ]}
              >
                <Text style={styles.registerText}>
                  Create New Account
                </Text>

                <Text style={styles.registerArrow}>↗</Text>
              </Pressable>
            </Animated.View>

            {/* FOOTER */}

            <View style={styles.footerSection}>
              <View style={styles.footerDivider}>
                <View style={styles.footerLine} />

                <Text style={styles.footerStar}>✦</Text>

                <View style={styles.footerLine} />
              </View>

              <Text style={styles.footerText}>
                BEAUTY IS AN EXPERIENCE, NOT JUST A LOOK.
              </Text>

              <Text style={styles.footerSub}>
                MADE WITH LOVE • GLOW WITH CONFIDENCE
              </Text>
            </View>

          </ScrollView>
        </KeyboardAvoidingView>

      </SafeAreaView>
    </LinearGradient>
  );
}

// ======================================================
// FOREST GREEN & CHAMPAGNE GOLD LUXURY STYLES
// ======================================================

const styles = StyleSheet.create({

  container: {
    flex: 1,
    overflow: "hidden",
  },

  // SAFE AREA

  safeArea: {
    flex: 1,
    width: "100%",
    overflow: "hidden",
  },

  keyboardView: {
    flex: 1,
  },

  scroll: {
    flexGrow: 1,
    paddingHorizontal: 23,
    paddingTop: 48,
    paddingBottom: 40,
    justifyContent: "center",
  },

  // BACKGROUND

  ambientGlow: {
    position: "absolute",
    width: W * 0.9,
    height: W * 0.9,
    borderRadius: W,
    backgroundColor: COLORS.sage,
    opacity: 0.16,
    top: H * 0.18,
    left: W * 0.05,
  },

  bottomGlow: {
    position: "absolute",
    width: W * 0.75,
    height: W * 0.75,
    borderRadius: W,
    backgroundColor: COLORS.gold,
    opacity: 0.12,
    bottom: -100,
    right: -100,
  },

  // TOP LABEL

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
    backgroundColor: COLORS.gold,
  },

  topText: {
    color: COLORS.ivory,
    fontSize: 8,
    letterSpacing: 2.5,
    fontWeight: "600",
  },

  // BACK BUTTON

  backButton: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    paddingHorizontal: 15,
    paddingVertical: 7,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: "rgba(230,211,173,0.5)",
    backgroundColor: "rgba(250,248,242,0.08)",
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

  // LOGO

  logoSection: {
    alignItems: "center",
    marginBottom: 24,
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
    borderColor: COLORS.ivory,
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
    color: COLORS.deep,
    marginRight: -18,
  },

  logoA: {
    fontFamily: "Georgia",
    fontSize: 72,
    fontStyle: "italic",
    color: COLORS.green,
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
    backgroundColor: COLORS.gold,
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

  // BRAND

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
    backgroundColor: COLORS.champagne,
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

  // WELCOME

  welcomeSection: {
    alignItems: "center",
    marginBottom: 24,
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
    backgroundColor: COLORS.gold,
  },

  headingStar: {
    color: COLORS.champagne,
    fontSize: 19,
  },

  welcome: {
    fontFamily: "Georgia",
    fontSize: 35,
    color: COLORS.ivory,
    textAlign: "center",
  },

  subtitle: {
    color: "#E3E7DD",
    fontSize: 12,
    lineHeight: 21,
    textAlign: "center",
    marginTop: 9,
  },

  // LOGIN CARD

  cardOuter: {
    borderRadius: 29,
    borderWidth: 1.5,
    borderColor: COLORS.champagne,
    padding: 3,
    backgroundColor: "rgba(230,211,173,0.12)",
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
    gap: 9,
    marginBottom: 24,
  },

  cardIcon: {
    color: COLORS.gold,
    fontSize: 14,
  },

  cardTitle: {
    color: COLORS.forest,
    fontSize: 9,
    letterSpacing: 1.5,
    fontWeight: "700",
  },

  label: {
    color: COLORS.forest,
    fontSize: 10,
    letterSpacing: 2.5,
    fontWeight: "700",
    marginBottom: 12,
  },

  // EMAIL INPUT

  inputContainer: {
    height: 57,
    borderRadius: 30,
    borderWidth: 1.2,
    borderColor: "#C9B994",
    backgroundColor: "rgba(255,255,255,0.75)",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
  },

  emailIcon: {
    fontSize: 21,
    color: COLORS.green,
  },

  inputDivider: {
    width: 1,
    height: 27,
    backgroundColor: "#D6CBB4",
    marginHorizontal: 12,
  },

  input: {
    flex: 1,
    fontSize: 13,
    color: COLORS.deep,
    paddingVertical: 10,
  },

  // BUTTON

  buttonGlow: {
    position: "absolute",
    bottom: 60,
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
    marginTop: 27,
    borderRadius: 40,
    overflow: "hidden",
    borderWidth: 1.5,
    borderColor: COLORS.champagne,
    elevation: 6,
  },

  button: {
    height: 62,
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
    width: 44,
    height: 44,
    borderRadius: 23,
    borderWidth: 1,
    borderColor: COLORS.champagne,
    alignItems: "center",
    justifyContent: "center",
  },

  buttonArrow: {
    color: COLORS.ivory,
    fontSize: 26,
  },

  // SECURE INFO

  secureInfo: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 20,
  },

  secureIcon: {
    color: COLORS.gold,
    fontSize: 11,
  },

  secureText: {
    color: COLORS.forest,
    fontSize: 10,
  },

  // REGISTER

  registerDivider: {
    flexDirection: "row",
    alignItems: "center",
    gap: 11,
    marginVertical: 26,
  },

  registerLine: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.gold,
  },

  registerLabel: {
    color: COLORS.ivory,
    fontSize: 9,
    letterSpacing: 2,
    fontWeight: "600",
  },

  registerButton: {
    height: 55,
    borderRadius: 35,
    borderWidth: 1.2,
    borderColor: COLORS.champagne,
    backgroundColor: "rgba(250,248,242,0.08)",
    justifyContent: "center",
    alignItems: "center",
  },

  registerText: {
    fontFamily: "Georgia",
    color: COLORS.ivory,
    fontSize: 16,
  },

  registerArrow: {
    position: "absolute",
    right: 20,
    color: COLORS.champagne,
    fontSize: 21,
  },

  // FOOTER

  footerSection: {
    alignItems: "center",
    marginTop: 30,
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
    backgroundColor: COLORS.gold,
  },

  footerStar: {
    color: COLORS.champagne,
    fontSize: 15,
  },

  footerText: {
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
