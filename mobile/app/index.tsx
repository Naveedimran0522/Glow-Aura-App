
/* Bismillah-ir-Rahman-ir-Raheem ❤️ */
/* GLOWAURA — SIGNATURE FOREST LUXURY SPLASH */
/* PREMIUM GA ORBITAL LOGO + GOLDEN PARTICLES */
/* MATCHING HOME SCREEN — FOREST GREEN & CHAMPAGNE GOLD */
/* SAFE AREA VIEW UPDATED */

import React, { useEffect, useRef } from "react";

import {
  View,
  Text,
  StyleSheet,
  Animated,
  Easing,
  StatusBar,
  Dimensions,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";

const { width: W, height: H } = Dimensions.get("window");

// ======================================================
// COLORS
// ======================================================

const C = {
  forest: "#263C30",
  deep: "#192B22",
  green: "#405B48",
  sage: "#829482",
  gold: "#B99A65",
  champagne: "#E6D3AD",
  ivory: "#FAF8F2",
  white: "#FFFFFF",
  pale: "#F0EDE4",
  blush: "#E9DCD2",
};

// ======================================================
// PARTICLES
// ======================================================

const PARTICLES = Array.from({ length: 38 }, (_, i) => ({
  x: (i * 43 + 7) % 96,
  y: (i * 31 + 9) % 92,
  delay: i * 90,
  size: 3 + (i % 4) * 2,
}));

// ======================================================
// FLOATING GOLDEN SPARKLES
// ======================================================

function Sparkle({
  item,
}: {
  item: (typeof PARTICLES)[number];
}) {
  const opacity = useRef(new Animated.Value(0.15)).current;
  const scale = useRef(new Animated.Value(0.5)).current;
  const float = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.parallel([
        Animated.sequence([
          Animated.delay(item.delay),
          Animated.timing(opacity, {
            toValue: 1,
            duration: 900,
            useNativeDriver: true,
          }),
          Animated.timing(opacity, {
            toValue: 0.12,
            duration: 1300,
            useNativeDriver: true,
          }),
        ]),

        Animated.sequence([
          Animated.timing(scale, {
            toValue: 1.5,
            duration: 1100,
            useNativeDriver: true,
          }),
          Animated.timing(scale, {
            toValue: 0.5,
            duration: 1100,
            useNativeDriver: true,
          }),
        ]),

        Animated.sequence([
          Animated.timing(float, {
            toValue: -20,
            duration: 2200,
            useNativeDriver: true,
          }),
          Animated.timing(float, {
            toValue: 0,
            duration: 2200,
            useNativeDriver: true,
          }),
        ]),
      ])
    );

    animation.start();

    return () => animation.stop();
  }, [item.delay, opacity, scale, float]);

  return (
    <Animated.Text
      pointerEvents="none"
      style={{
        position: "absolute",
        left: (W * item.x) / 100,
        top: (H * item.y) / 100,
        fontSize: item.size + 4,
        color: C.champagne,
        opacity,
        transform: [
          { scale },
          { translateY: float },
        ],
        textShadowColor: C.gold,
        textShadowRadius: 12,
      }}
    >
      ✦
    </Animated.Text>
  );
}

// ======================================================
// FLOATING IVORY PETALS
// ======================================================

function FloatingPetal({
  left,
  top,
  delay,
}: {
  left: number;
  top: number;
  delay: number;
}) {
  const y = useRef(new Animated.Value(0)).current;
  const rotate = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.parallel([
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(y, {
            toValue: -35,
            duration: 3000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(y, {
            toValue: 0,
            duration: 3000,
            easing: Easing.inOut(Easing.ease),
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

        Animated.sequence([
          Animated.timing(opacity, {
            toValue: 0.9,
            duration: 1500,
            useNativeDriver: true,
          }),
          Animated.timing(opacity, {
            toValue: 0.35,
            duration: 1500,
            useNativeDriver: true,
          }),
        ]),
      ])
    );

    animation.start();

    return () => animation.stop();
  }, [delay, y, rotate, opacity]);

  const rotation = rotate.interpolate({
    inputRange: [0, 1],
    outputRange: ["-30deg", "35deg"],
  });

  return (
    <Animated.Text
      pointerEvents="none"
      style={{
        position: "absolute",
        left,
        top,
        fontSize: 27,
        color: C.champagne,
        opacity,
        transform: [
          { translateY: y },
          { rotate: rotation },
        ],
      }}
    >
      ❀
    </Animated.Text>
  );
}

// ======================================================
// PREMIUM GA ORBITAL LOGO
// ======================================================

function AnimatedGALogo() {
  const rotation = useRef(new Animated.Value(0)).current;
  const reverseRotation = useRef(new Animated.Value(0)).current;
  const bounce = useRef(new Animated.Value(0.7)).current;
  const glow = useRef(new Animated.Value(0.5)).current;
  const orbitScale = useRef(new Animated.Value(0.85)).current;

  useEffect(() => {
    const rotate = Animated.loop(
      Animated.timing(rotation, {
        toValue: 1,
        duration: 9000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );

    const reverse = Animated.loop(
      Animated.timing(reverseRotation, {
        toValue: 1,
        duration: 6500,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );

    const bouncing = Animated.loop(
      Animated.sequence([
        Animated.spring(bounce, {
          toValue: 1.06,
          friction: 5,
          tension: 45,
          useNativeDriver: true,
        }),
        Animated.spring(bounce, {
          toValue: 0.98,
          friction: 5,
          tension: 45,
          useNativeDriver: true,
        }),
      ])
    );

    const glowing = Animated.loop(
      Animated.sequence([
        Animated.timing(glow, {
          toValue: 1,
          duration: 1300,
          useNativeDriver: true,
        }),
        Animated.timing(glow, {
          toValue: 0.4,
          duration: 1300,
          useNativeDriver: true,
        }),
      ])
    );

    const orbit = Animated.loop(
      Animated.sequence([
        Animated.timing(orbitScale, {
          toValue: 1.12,
          duration: 1600,
          useNativeDriver: true,
        }),
        Animated.timing(orbitScale, {
          toValue: 0.85,
          duration: 1600,
          useNativeDriver: true,
        }),
      ])
    );

    rotate.start();
    reverse.start();
    bouncing.start();
    glowing.start();
    orbit.start();

    return () => {
      rotate.stop();
      reverse.stop();
      bouncing.stop();
      glowing.stop();
      orbit.stop();
    };
  }, [rotation, reverseRotation, bounce, glow, orbitScale]);

  const spin = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  const reverseSpin = reverseRotation.interpolate({
    inputRange: [0, 1],
    outputRange: ["360deg", "0deg"],
  });

  return (
    <View style={styles.logoContainer}>

      <Animated.View
        style={[
          styles.outerOrbit,
          {
            opacity: glow,
            transform: [{ rotate: spin }],
          },
        ]}
      >
        <View style={styles.goldDot} />
        <View style={styles.champagneDot} />
        <View style={styles.whiteDot} />
      </Animated.View>

      <Animated.View
        style={[
          styles.middleOrbit,
          {
            transform: [{ rotate: reverseSpin }],
          },
        ]}
      >
        <View style={styles.smallGoldDot} />
        <View style={styles.smallSageDot} />
      </Animated.View>

      <Animated.View
        style={[
          styles.logoGlow,
          {
            opacity: glow,
            transform: [{ scale: orbitScale }],
          },
        ]}
      />

      <Animated.View
        style={[
          styles.logoMainCircle,
          {
            transform: [{ scale: bounce }],
          },
        ]}
      >
        <LinearGradient
          colors={[
            "#FAF8F2",
            "#E6D3AD",
            "#B99A65",
            "#405B48",
          ]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.logoGradient}
        >
          <View style={styles.logoInnerBorder}>
            <Text style={styles.logoG}>G</Text>
            <Text style={styles.logoA}>A</Text>
          </View>
        </LinearGradient>
      </Animated.View>

      <Animated.View
        pointerEvents="none"
        style={[
          styles.particleOrbit,
          { transform: [{ rotate: spin }] },
        ]}
      >
        <View style={[styles.logoParticle, styles.particleOne]} />
        <View style={[styles.logoParticle, styles.particleTwo]} />
        <View style={[styles.logoParticle, styles.particleThree]} />
        <View style={[styles.logoParticle, styles.particleFour]} />
      </Animated.View>

      <Animated.View
        pointerEvents="none"
        style={[
          styles.starOrbit,
          { transform: [{ rotate: reverseSpin }] },
        ]}
      >
        <Text style={styles.orbitStar}>✦</Text>
        <Text style={[styles.orbitStar, styles.orbitStarSecond]}>
          ✧
        </Text>
      </Animated.View>

    </View>
  );
}

// ======================================================
// MAIN SPLASH SCREEN
// ======================================================

export default function SplashScreen() {
  const router = useRouter();

  const entrance = useRef(new Animated.Value(0.65)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const brandOpacity = useRef(new Animated.Value(0)).current;
  const brandY = useRef(new Animated.Value(25)).current;
  const subtitleOpacity = useRef(new Animated.Value(0)).current;
  const halo = useRef(new Animated.Value(0.8)).current;
  const progress = useRef(new Animated.Value(0)).current;
  const shine = useRef(new Animated.Value(-1)).current;
  const bottomOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    let mounted = true;

    const intro = Animated.sequence([
      Animated.delay(250),

      Animated.parallel([
        Animated.spring(entrance, {
          toValue: 1,
          friction: 4,
          tension: 55,
          useNativeDriver: true,
        }),

        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]),

      Animated.parallel([
        Animated.spring(brandY, {
          toValue: 0,
          friction: 7,
          tension: 35,
          useNativeDriver: true,
        }),

        Animated.timing(brandOpacity, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]),

      Animated.parallel([
        Animated.timing(subtitleOpacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),

        Animated.timing(bottomOpacity, {
          toValue: 1,
          duration: 900,
          useNativeDriver: true,
        }),
      ]),
    ]);

    const haloLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(halo, {
          toValue: 1.15,
          duration: 2000,
          useNativeDriver: true,
        }),

        Animated.timing(halo, {
          toValue: 0.8,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    );

    const progressLoop = Animated.timing(progress, {
      toValue: 1,
      duration: 4200,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: false,
    });

    const shineLoop = Animated.loop(
      Animated.timing(shine, {
        toValue: 1,
        duration: 1700,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );

    intro.start();
    haloLoop.start();
    progressLoop.start();
    shineLoop.start();

    const timer = setTimeout(() => {
      if (mounted) {
        router.replace("/onboarding");
      }
    }, 5500);

    return () => {
      mounted = false;

      clearTimeout(timer);

      intro.stop();
      haloLoop.stop();
      progressLoop.stop();
      shineLoop.stop();
    };
  }, [
    router,
    entrance,
    logoOpacity,
    brandOpacity,
    brandY,
    subtitleOpacity,
    halo,
    progress,
    shine,
    bottomOpacity,
  ]);

  const progressWidth = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });

  const shineX = shine.interpolate({
    inputRange: [-1, 1],
    outputRange: [-80, 300],
  });

  return (
    <LinearGradient
      colors={[
        C.deep,
        C.forest,
        C.green,
        C.deep,
      ]}
      locations={[0, 0.36, 0.72, 1]}
      style={styles.container}
    >
      <StatusBar
        barStyle="light-content"
        backgroundColor={C.deep}
        translucent={false}
      />

      {/* SAFE AREA VIEW */}

      <SafeAreaView
        edges={["top", "bottom"]}
        style={styles.safeArea}
      >

        {/* AMBIENT GOLDEN BACKGROUND */}

        <Animated.View
          pointerEvents="none"
          style={[
            styles.ambientGlow,
            {
              transform: [{ scale: halo }],
            },
          ]}
        />

        <View
          pointerEvents="none"
          style={styles.secondaryGlow}
        />

        <View
          pointerEvents="none"
          style={styles.bottomGlow}
        />

        {/* FLOATING PARTICLES */}

        {PARTICLES.map((item, index) => (
          <Sparkle key={index} item={item} />
        ))}

        {/* FLOATING PETALS */}

        <FloatingPetal
          left={W * 0.13}
          top={H * 0.24}
          delay={200}
        />

        <FloatingPetal
          left={W * 0.79}
          top={H * 0.35}
          delay={800}
        />

        <FloatingPetal
          left={W * 0.18}
          top={H * 0.75}
          delay={400}
        />

        <FloatingPetal
          left={W * 0.83}
          top={H * 0.80}
          delay={1000}
        />

        {/* TOP BRAND LABEL */}

        <View style={styles.topLabel}>
          <Text style={styles.topStar}>✧</Text>

          <View style={styles.topLine} />

          <Text style={styles.topText}>
            THE BEAUTY ATELIER
          </Text>

          <View style={styles.topLine} />

          <Text style={styles.topStar}>✧</Text>
        </View>

        {/* CENTER CONTENT */}

        <View style={styles.centerContent}>

          <Animated.View
            style={[
              styles.logoArea,
              {
                opacity: logoOpacity,
                transform: [{ scale: entrance }],
              },
            ]}
          >
            <AnimatedGALogo />

            <Text style={styles.established}>
              EST. 2026
            </Text>
          </Animated.View>

          {/* BRAND NAME */}

          <Animated.View
            style={{
              alignItems: "center",
              opacity: brandOpacity,
              transform: [{ translateY: brandY }],
            }}
          >
            <Text style={styles.brandName}>
              GlowAura
            </Text>

            <View style={styles.brandDecoration}>
              <View style={styles.brandLine} />

              <Text style={styles.brandDiamond}>
                ✧
              </Text>

              <View style={styles.brandLine} />
            </View>
          </Animated.View>

          {/* TAGLINE */}

          <Animated.View
            style={[
              styles.description,
              {
                opacity: subtitleOpacity,
              },
            ]}
          >
            <Text style={styles.tagline}>
              BEAUTY BEYOND ORDINARY
            </Text>

            <Text style={styles.services}>
              SKINCARE  ·  BRIDAL  ·  MEHNDI
            </Text>
          </Animated.View>

        </View>

        {/* BOTTOM LOADER */}

        <Animated.View
          style={[
            styles.bottomSection,
            {
              opacity: bottomOpacity,
            },
          ]}
        >
          <Text style={styles.quote}>
            "Every detail, a touch of elegance."
          </Text>

          <View style={styles.progressTrack}>
            <Animated.View
              style={[
                styles.progressFill,
                {
                  width: progressWidth,
                },
              ]}
            />

            <Animated.View
              pointerEvents="none"
              style={[
                styles.progressShine,
                {
                  transform: [{ translateX: shineX }],
                },
              ]}
            />
          </View>

          <Text style={styles.loading}>
            CRAFTING YOUR BEAUTY EXPERIENCE
          </Text>

          {/* FOOTER */}

          <View style={styles.footer}>
            <View style={styles.footerLine} />

            <Text style={styles.version}>
              GLOWAURA  ·  1.0.0
            </Text>

            <View style={styles.footerLine} />
          </View>

        </Animated.View>

      </SafeAreaView>
    </LinearGradient>
  );
}

// ======================================================
// SIGNATURE FOREST LUXURY STYLES
// ======================================================

const styles = StyleSheet.create({

  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },

  // SAFE AREA

  safeArea: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },

  // BACKGROUND GLOW

  ambientGlow: {
    position: "absolute",
    width: W * 0.9,
    height: W * 0.9,
    borderRadius: W,
    backgroundColor: C.gold,
    opacity: 0.13,
  },

  secondaryGlow: {
    position: "absolute",
    width: W * 0.6,
    height: W * 0.6,
    borderRadius: W,
    backgroundColor: C.champagne,
    opacity: 0.07,
    top: H * 0.15,
    left: W * 0.2,
  },

  bottomGlow: {
    position: "absolute",
    width: W * 0.7,
    height: W * 0.7,
    borderRadius: W,
    backgroundColor: C.sage,
    opacity: 0.09,
    bottom: -H * 0.2,
    right: -W * 0.2,
  },

  // TOP LABEL

  topLabel: {
    position: "absolute",
    top: H * 0.075,
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
  },

  topStar: {
    color: C.champagne,
    fontSize: 15,
  },

  topLine: {
    width: 23,
    height: 1,
    backgroundColor: C.gold,
  },

  topText: {
    fontSize: 8,
    letterSpacing: 3,
    color: C.ivory,
  },

  // CENTER

  centerContent: {
    alignItems: "center",
    marginTop: -H * 0.025,
  },

  logoArea: {
    width: 250,
    height: 260,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 5,
  },

  // ORBITAL LOGO

  logoContainer: {
    width: 225,
    height: 225,
    alignItems: "center",
    justifyContent: "center",
  },

  outerOrbit: {
    position: "absolute",
    width: 205,
    height: 205,
    borderRadius: 110,
    borderWidth: 1.4,
    borderColor: "rgba(230,211,173,0.8)",
    borderStyle: "dashed",
  },

  middleOrbit: {
    position: "absolute",
    width: 178,
    height: 178,
    borderRadius: 90,
    borderWidth: 1.2,
    borderColor: "rgba(185,154,101,0.75)",
  },

  goldDot: {
    position: "absolute",
    width: 11,
    height: 11,
    borderRadius: 6,
    backgroundColor: C.champagne,
    top: -5,
    left: 95,
    shadowColor: C.gold,
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 8,
  },

  champagneDot: {
    position: "absolute",
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: C.gold,
    bottom: 18,
    right: 10,
    shadowColor: C.gold,
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 8,
  },

  whiteDot: {
    position: "absolute",
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: C.white,
    left: 12,
    top: 80,
  },

  smallGoldDot: {
    position: "absolute",
    width: 8,
    height: 8,
    borderRadius: 5,
    backgroundColor: C.champagne,
    right: 18,
    top: 8,
  },

  smallSageDot: {
    position: "absolute",
    width: 8,
    height: 8,
    borderRadius: 5,
    backgroundColor: C.sage,
    left: 12,
    bottom: 12,
  },

  logoGlow: {
    position: "absolute",
    width: 170,
    height: 170,
    borderRadius: 90,
    backgroundColor: "rgba(230,211,173,0.16)",
    shadowColor: C.champagne,
    shadowOpacity: 1,
    shadowRadius: 38,
    elevation: 18,
  },

  logoMainCircle: {
    width: 150,
    height: 150,
    borderRadius: 80,
    padding: 5,
    overflow: "hidden",
    elevation: 20,
    shadowColor: C.gold,
    shadowOpacity: 0.9,
    shadowRadius: 25,
  },

  logoGradient: {
    flex: 1,
    borderRadius: 75,
    alignItems: "center",
    justifyContent: "center",
  },

  logoInnerBorder: {
    width: 132,
    height: 132,
    borderRadius: 66,
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.85)",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },

  logoG: {
    color: C.forest,
    fontFamily: "Georgia",
    fontSize: 83,
    fontStyle: "italic",
    marginRight: -18,
  },

  logoA: {
    color: C.deep,
    fontFamily: "Georgia",
    fontSize: 73,
    fontStyle: "italic",
    marginTop: 18,
  },

  // PARTICLE ORBIT

  particleOrbit: {
    position: "absolute",
    width: 220,
    height: 220,
    alignItems: "center",
    justifyContent: "center",
  },

  logoParticle: {
    position: "absolute",
    borderRadius: 10,
    backgroundColor: C.champagne,
    shadowColor: C.gold,
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 8,
  },

  particleOne: {
    width: 6,
    height: 6,
    top: 3,
    left: 105,
  },

  particleTwo: {
    width: 8,
    height: 8,
    right: 4,
    top: 105,
    backgroundColor: C.gold,
  },

  particleThree: {
    width: 5,
    height: 5,
    bottom: 3,
    left: 105,
    backgroundColor: C.white,
  },

  particleFour: {
    width: 7,
    height: 7,
    left: 4,
    top: 105,
    backgroundColor: C.sage,
  },

  starOrbit: {
    position: "absolute",
    width: 195,
    height: 195,
    alignItems: "center",
    justifyContent: "center",
  },

  orbitStar: {
    position: "absolute",
    top: 5,
    right: 38,
    fontSize: 21,
    color: C.champagne,
    textShadowColor: C.gold,
    textShadowRadius: 12,
  },

  orbitStarSecond: {
    top: undefined,
    right: undefined,
    bottom: 7,
    left: 35,
    color: C.sage,
    fontSize: 17,
  },

  established: {
    position: "absolute",
    bottom: -2,
    color: C.champagne,
    fontSize: 8,
    letterSpacing: 4,
  },

  // BRAND NAME

  brandName: {
    fontFamily: "Georgia",
    fontSize: Math.min(W * 0.145, 55),
    color: C.ivory,
    letterSpacing: 1.5,
    textShadowColor: C.gold,
    textShadowRadius: 12,
  },

  brandDecoration: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginTop: 15,
  },

  brandLine: {
    width: 43,
    height: 1,
    backgroundColor: C.gold,
  },

  brandDiamond: {
    color: C.champagne,
    fontSize: 17,
  },

  // DESCRIPTION

  description: {
    alignItems: "center",
    marginTop: 23,
  },

  tagline: {
    color: C.ivory,
    fontSize: 9,
    letterSpacing: 3,
    fontWeight: "600",
  },

  services: {
    color: C.champagne,
    fontSize: 9,
    letterSpacing: 2,
    marginTop: 13,
  },

  // BOTTOM LOADER

  bottomSection: {
    position: "absolute",
    bottom: H * 0.065,
    width: "78%",
    alignItems: "center",
  },

  quote: {
    fontFamily: "Georgia",
    fontStyle: "italic",
    color: C.ivory,
    fontSize: 13,
    marginBottom: 26,
    textAlign: "center",
  },

  progressTrack: {
    width: "100%",
    height: 4,
    backgroundColor: "#526B58",
    borderRadius: 10,
    overflow: "hidden",
    borderWidth: 0.5,
    borderColor: C.gold,
  },

  progressFill: {
    height: 4,
    backgroundColor: C.champagne,
    borderRadius: 10,
  },

  progressShine: {
    position: "absolute",
    height: 4,
    width: 35,
    backgroundColor: C.white,
    opacity: 0.7,
  },

  loading: {
    marginTop: 17,
    color: C.champagne,
    fontSize: 8,
    letterSpacing: 2,
    textAlign: "center",
  },

  footer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 13,
    marginTop: 26,
  },

  footerLine: {
    width: 38,
    height: 1,
    backgroundColor: C.gold,
  },

  version: {
    color: C.champagne,
    fontSize: 8,
    letterSpacing: 2,
  },

});
