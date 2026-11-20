/* Bismillah-ir-Rahman-ir-Raheem ❤️ */
/* GLOWAURA — FOREST GREEN & CHAMPAGNE LUXURY REGISTER */

import React, { useEffect, useRef, useState } from "react";

import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
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

/* ==========================================
   GLOWAURA FOREST LUXURY COLOR PALETTE
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
  darkText: "#263C30",
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
   REGISTER SCREEN
========================================== */

export default function RegisterScreen() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

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
        delay: 300,
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
     REGISTER + SEND OTP
  ========================================== */

  const handleRegister = async () => {
    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();
    const cleanPhone = phone.trim();

    if (!cleanName || !cleanEmail || !cleanPhone) {
      Alert.alert(
        "Missing Details",
        "Please fill in all fields."
      );
      return;
    }

    if (cleanName.length < 2) {
      Alert.alert(
        "Invalid Name",
        "Please enter a valid full name."
      );
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      Alert.alert(
        "Invalid Email",
        "Please enter a valid email address."
      );
      return;
    }

    const digits = cleanPhone.replace(/\D/g, "");

    if (digits.length < 10 || digits.length > 15) {
      Alert.alert(
        "Invalid Phone",
        "Please enter a valid phone number."
      );
      return;
    }

    if (loading) return;

    setLoading(true);

    try {
      await sendOTP({
        name: cleanName,
        email: cleanEmail,
        phone: cleanPhone,
        purpose: "register",
      });

      router.push({
        pathname: "/verify-otp",
        params: {
          name: cleanName,
          email: cleanEmail,
          phone: cleanPhone,
          purpose: "register",
        },
      });
    } catch (error: any) {
      Alert.alert(
        "Registration Error",
        error?.message ||
          "Unable to send OTP. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const glowOpacity = buttonGlow.interpolate({
    inputRange: [0, 1],
    outputRange: [0.15, 0.8],
  });

  /* ==========================================
     UI
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
          <Sparkle
            key={item.id}
            item={item}
          />
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

      {/* SAFE AREA */}

      <SafeAreaView
        style={styles.safeArea}
        edges={["top", "bottom"]}
      >
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

            {/* WELCOME */}

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
                Create Account
              </Text>

              <Text style={styles.subtitle}>
                Begin your beautiful journey with GlowAura.
                {"\n"}
                Discover beauty beyond ordinary.
              </Text>
            </Animated.View>

            {/* REGISTER CARD */}

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
                      JOIN THE GLOWAURA EXPERIENCE
                    </Text>

                    <Text style={styles.cardIcon}>✧</Text>
                  </View>

                  {/* FULL NAME */}

                  <Text style={styles.label}>
                    FULL NAME
                  </Text>

                  <View style={styles.inputContainer}>
                    <Text style={styles.inputIcon}>
                      ♙
                    </Text>

                    <View style={styles.inputDivider} />

                    <TextInput
                      value={name}
                      onChangeText={setName}
                      placeholder="Enter your full name"
                      placeholderTextColor="#89877D"
                      autoCapitalize="words"
                      autoCorrect={false}
                      autoComplete="name"
                      returnKeyType="next"
                      editable={!loading}
                      style={styles.input}
                    />
                  </View>

                  {/* EMAIL ADDRESS */}

                  <Text style={styles.label}>
                    EMAIL ADDRESS
                  </Text>

                  <View style={styles.inputContainer}>
                    <Text style={styles.inputIcon}>
                      ✉
                    </Text>

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
                      returnKeyType="next"
                      editable={!loading}
                      style={styles.input}
                    />
                  </View>

                  {/* PHONE NUMBER */}

                  <Text style={styles.label}>
                    PHONE NUMBER
                  </Text>

                  <View style={styles.inputContainer}>
                    <Text style={styles.inputIcon}>
                      ⌕
                    </Text>

                    <View style={styles.inputDivider} />

                    <TextInput
                      value={phone}
                      onChangeText={setPhone}
                      placeholder="Enter your phone number"
                      placeholderTextColor="#89877D"
                      keyboardType="phone-pad"
                      maxLength={15}
                      returnKeyType="done"
                      onSubmitEditing={handleRegister}
                      editable={!loading}
                      style={styles.input}
                    />
                  </View>

                  {/* PRIVACY INFORMATION */}

                  <View style={styles.secureInfo}>
                    <Text style={styles.secureIcon}>
                      ◆
                    </Text>

                    <Text style={styles.secureText}>
                      Your personal information stays protected.
                    </Text>
                  </View>

                  {/* BUTTON GLOW */}

                  <Animated.View
                    pointerEvents="none"
                    style={[
                      styles.buttonGlow,
                      { opacity: glowOpacity },
                    ]}
                  />

                  {/* CREATE ACCOUNT BUTTON */}

                  <Pressable
                    onPress={handleRegister}
                    disabled={loading}
                    style={({ pressed }) => [
                      styles.buttonWrapper,
                      pressed &&
                        !loading && {
                          transform: [{ scale: 0.97 }],
                        },
                      loading && { opacity: 0.8 },
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
                          color="#E6D3AD"
                        />
                      ) : (
                        <>
                          <Text style={styles.buttonText}>
                            Create My Account
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

                  {/* LOGIN LINK */}

                  <View style={styles.loginRow}>
                    <Text style={styles.loginText}>
                      Already have an account?
                    </Text>

                    <Pressable
                      onPress={() => router.replace("/login")}
                      disabled={loading}
                    >
                      <Text style={styles.loginLink}>
                        {" "}Login
                      </Text>
                    </Pressable>
                  </View>

                  {/* DIVIDER */}

                  <View style={styles.divider}>
                    <View style={styles.dividerLine} />

                    <Text style={styles.dividerIcon}>
                      ✧
                    </Text>

                    <View style={styles.dividerLine} />
                  </View>

                  <Text style={styles.bottomNote}>
                    MADE WITH LOVE FOR YOUR BEAUTY
                  </Text>
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
      </SafeAreaView>
    </LinearGradient>
  );
}

/* ==========================================
   FOREST GREEN LUXURY STYLES
========================================== */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: "hidden",
  },

  safeArea: {
    flex: 1,
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
    marginBottom: 22,
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
    borderColor: "#B99A65",
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
    color: "#B99A65",
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
    color: "#B99A65",
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
    fontSize: 34,
    color: COLORS.ivory,
    textAlign: "center",
  },

  subtitle: {
    color: "#E6D3AD",
    fontSize: 12,
    lineHeight: 21,
    textAlign: "center",
    marginTop: 9,
  },

  /* REGISTER CARD */

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
    marginBottom: 23,
  },

  cardIcon: {
    color: COLORS.gold,
    fontSize: 14,
  },

  cardTitle: {
    color: COLORS.forest,
    fontSize: 9,
    letterSpacing: 1.2,
    fontWeight: "700",
  },

  /* INPUTS */

  label: {
    color: COLORS.forest,
    fontSize: 10,
    letterSpacing: 2.2,
    fontWeight: "700",
    marginBottom: 10,
  },

  inputContainer: {
    height: 55,
    borderRadius: 30,
    borderWidth: 1.2,
    borderColor: "#C8B995",
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    marginBottom: 19,
  },

  inputIcon: {
    fontSize: 20,
    color: COLORS.green,
  },

  inputDivider: {
    width: 1,
    height: 27,
    backgroundColor: "#D9D2C2",
    marginHorizontal: 12,
  },

  input: {
    flex: 1,
    fontSize: 12,
    color: COLORS.darkText,
    paddingVertical: 10,
  },

  /* PRIVACY */

  secureInfo: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 0,
    marginBottom: 12,
  },

  secureIcon: {
    color: COLORS.gold,
    fontSize: 11,
  },

  secureText: {
    color: COLORS.softText,
    fontSize: 9,
  },

  /* BUTTON */

  buttonGlow: {
    position: "absolute",
    bottom: 112,
    left: 10,
    right: 10,
    height: 62,
    borderRadius: 40,
    backgroundColor: "#B99A65",
    shadowColor: COLORS.champagne,
    shadowOpacity: 1,
    shadowRadius: 20,
    elevation: 8,
  },

  buttonWrapper: {
    marginTop: 12,
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

  /* LOGIN */

  loginRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },

  loginText: {
    color: COLORS.muted,
    fontSize: 11,
  },

  loginLink: {
    color: COLORS.forest,
    fontSize: 12,
    fontWeight: "800",
  },

  /* DIVIDER */

  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
    marginBottom: 15,
  },

  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#EAE3D6",
  },

  dividerIcon: {
    color: COLORS.gold,
    fontSize: 15,
    marginHorizontal: 12,
  },

  bottomNote: {
    textAlign: "center",
    color: COLORS.muted,
    fontSize: 8,
    fontWeight: "700",
    letterSpacing: 1.8,
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