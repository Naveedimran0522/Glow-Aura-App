
/* Bismillah-ir-Rahman-ir-Raheem ❤️ */
/* ============================================================
   GLOWAURA — THE ROYAL BEAUTY EXPERIENCE
   SIGNATURE LUXURY ONBOARDING — 5 SCREENS
   FOREST GREEN • CHAMPAGNE GOLD • ROYAL IVORY
   PREMIUM CARDS • ANIMATIONS • SWIPE • AUTO SLIDER
   ANDROID NOTCH SAFE AREA — CORRECTED
   ============================================================ */

import React, { useEffect, useRef, useState } from "react";

import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  StatusBar,
  Animated,
  Easing,
  TouchableOpacity,
  PanResponder,
  useWindowDimensions,
} from "react-native";

import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";

import { SafeAreaView } from "react-native-safe-area-context";

// ============================================================
// CONFIGURATION
// ============================================================

const AUTO_SLIDE_DURATION = 5500;

const COLORS = {
  background: "#10251B",
  deep: "#0B1C14",
  forest: "#1C3528",
  forestLight: "#2B4937",
  green: "#49634C",
  sage: "#91A28C",
  gold: "#B9955C",
  champagne: "#E8D5AE",
  paleGold: "#F8EBD0",
  ivory: "#FFF9EF",
  white: "#FFFFFF",
  muted: "#C6C8B8",
  glass: "rgba(255,255,255,0.055)",
  border: "rgba(232,213,174,0.25)",
};

// ============================================================
// ONBOARDING CONTENT — 5 LUXURY SCREENS
// ============================================================

const SLIDES = [
  {
    id: "01",
    eyebrow: "WELCOME TO THE WORLD OF ELEGANCE",
    title: "Discover The Art",
    highlight: "Of Beautiful Living.",
    description:
      "Welcome to GlowAura — where beauty becomes an experience. Discover thoughtfully curated beauty services, extraordinary artistry and personalised care designed around your elegance.",
    image:
      "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=1200&q=90",
    category: "THE GLOWAURA SIGNATURE EXPERIENCE",
    quote: "Your beauty deserves nothing less than extraordinary.",
    badge: "THE ART OF LUXURY",
    features: ["Luxury Beauty", "Personal Care", "Exclusive Experience"],
    highlights: [
      { icon: "✦", title: "DISCOVER", detail: "Explore beauty" },
      { icon: "◇", title: "EXPERIENCE", detail: "Feel the luxury" },
      { icon: "✧", title: "SHINE", detail: "Celebrate you" },
    ],
    services: [
      { icon: "✧", title: "Beauty", detail: "Signature looks" },
      { icon: "❀", title: "Wellness", detail: "Self-care rituals" },
      { icon: "♛", title: "Luxury", detail: "Premium service" },
    ],
    bottomTitle: "A BEAUTIFUL WORLD, CREATED FOR YOU",
    bottomDescription: "Elegance • Confidence • Exclusivity",
  },

  {
    id: "02",
    eyebrow: "YOUR PERSONAL SKINCARE SANCTUARY",
    title: "Nourish Your Skin,",
    highlight: "Reveal Your Radiance.",
    description:
      "Give your skin the love it deserves. Explore refreshing glow facials, hydrating treatments, skin nourishment and relaxing skincare rituals for a naturally radiant appearance.",
    image:
      "https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?w=1200&q=90",
    category: "THE NATURAL GLOW COLLECTION",
    quote: "Beautiful skin begins with beautiful care.",
    badge: "YOUR SKINCARE JOURNEY",
    features: ["Radiance Facial", "Hydra Care", "Skin Wellness"],
    highlights: [
      { icon: "✦", title: "CLEANSE", detail: "Refresh your skin" },
      { icon: "◇", title: "NOURISH", detail: "Deep hydration" },
      { icon: "✧", title: "RADIATE", detail: "Natural glow" },
    ],
    services: [
      { icon: "❀", title: "Glow Facial", detail: "Radiance ritual" },
      { icon: "◈", title: "Hydra Care", detail: "Skin hydration" },
      { icon: "✦", title: "Skin Care", detail: "Personal care" },
    ],
    bottomTitle: "YOUR SKIN DESERVES A LITTLE LUXURY",
    bottomDescription: "Cleanse • Nourish • Glow",
  },

  {
    id: "03",
    eyebrow: "THE EXCLUSIVE ROYAL BRIDAL COLLECTION",
    title: "A Bride Like You,",
    highlight: "A Day Like Forever.",
    description:
      "Make your wedding moments unforgettable. Discover bridal makeup, engagement styling, pre-bridal skincare and carefully curated beauty packages for your once-in-a-lifetime celebration.",
    image:
      "https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&q=90",
    category: "THE BRIDAL SIGNATURE COLLECTION",
    quote: "Every bride deserves her own beautiful fairytale.",
    badge: "YOUR DREAM BRIDAL EXPERIENCE",
    features: ["Bridal Makeup", "Pre-Bridal Care", "Engagement Looks"],
    highlights: [
      { icon: "♛", title: "BRIDAL", detail: "Royal makeovers" },
      { icon: "✦", title: "GLAMOUR", detail: "Elegant styling" },
      { icon: "◇", title: "MEMORIES", detail: "Timeless moments" },
    ],
    services: [
      { icon: "♛", title: "Bridal Glow", detail: "Signature package" },
      { icon: "✧", title: "Engagement", detail: "Special occasion" },
      { icon: "❀", title: "Pre-Bridal", detail: "Beauty preparation" },
    ],
    bottomTitle: "YOUR BIG DAY. YOUR TIME TO SHINE.",
    bottomDescription: "Prepare • Celebrate • Sparkle",
  },

  {
    id: "04",
    eyebrow: "THE BEAUTIFUL WORLD OF MEHNDI ART",
    title: "Tradition In Every",
    highlight: "Beautiful Detail.",
    description:
      "Celebrate your traditions through exquisite artistry. Explore intricate bridal mehndi, graceful Arabic patterns, festive designs and beautiful creations crafted to make every occasion memorable.",
    image:
      "https://images.unsplash.com/photo-1610173827002-62c0f4f6c6b3?w=1200&q=90",
    category: "THE HERITAGE MEHNDI COLLECTION",
    quote: "Every pattern tells a story. Every detail matters.",
    badge: "THE ART OF TRADITION",
    features: ["Bridal Mehndi", "Arabic Designs", "Festive Art"],
    highlights: [
      { icon: "✦", title: "BRIDAL", detail: "Intricate patterns" },
      { icon: "◇", title: "ARABIC", detail: "Elegant designs" },
      { icon: "❀", title: "CULTURE", detail: "Timeless tradition" },
    ],
    services: [
      { icon: "❀", title: "Bridal Art", detail: "Wedding designs" },
      { icon: "✧", title: "Arabic Art", detail: "Modern patterns" },
      { icon: "◇", title: "Festive Art", detail: "Celebration looks" },
    ],
    bottomTitle: "ART THAT MAKES MEMORIES TIMELESS",
    bottomDescription: "Create • Celebrate • Cherish",
  },

  {
    id: "05",
    eyebrow: "MEET YOUR BEAUTY PROFESSIONALS",
    title: "Your Favourite Artists,",
    highlight: "Your Perfect Glow.",
    description:
      "Meet talented beauty professionals and discover their specialties. Explore artist profiles, choose your favourite service, schedule appointments and enjoy a seamless personalised beauty experience.",
    image:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=1200&q=90",
    category: "THE GLOWAURA ARTIST COLLECTION",
    quote: "Your perfect beauty experience begins right here.",
    badge: "YOUR BEAUTY JOURNEY BEGINS",
    features: ["Expert Artists", "Easy Booking", "Personalised Care"],
    highlights: [
      { icon: "✦", title: "EXPLORE", detail: "Meet professionals" },
      { icon: "◇", title: "BOOK", detail: "Choose your service" },
      { icon: "✧", title: "ENJOY", detail: "Love your glow" },
    ],
    services: [
      { icon: "♛", title: "Top Artists", detail: "Beauty experts" },
      { icon: "✦", title: "Easy Booking", detail: "Simple scheduling" },
      { icon: "❀", title: "My Beauty", detail: "Personal journey" },
    ],
    bottomTitle: "YOUR BEAUTY. YOUR CHOICE. YOUR GLOW.",
    bottomDescription: "Find • Book • Experience",
  },
];

// ============================================================
// FLOATING GOLD SPARKLE
// ============================================================

function Sparkle({
  left,
  top,
  size = 5,
  delay = 0,
}: {
  left: number;
  top: number;
  size?: number;
  delay?: number;
}) {
  const opacity = useRef(new Animated.Value(0.2)).current;
  const scale = useRef(new Animated.Value(0.5)).current;
  const translateY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.parallel([
          Animated.sequence([
            Animated.timing(opacity, {
              toValue: 1,
              duration: 1100,
              useNativeDriver: true,
            }),
            Animated.timing(opacity, {
              toValue: 0.15,
              duration: 1100,
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
            Animated.timing(translateY, {
              toValue: -12,
              duration: 2200,
              useNativeDriver: true,
            }),
            Animated.timing(translateY, {
              toValue: 0,
              duration: 2200,
              useNativeDriver: true,
            }),
          ]),
        ]),
      ])
    );

    animation.start();

    return () => animation.stop();
  }, [delay, opacity, scale, translateY]);

  return (
    <Animated.View
      pointerEvents="none"
      style={{
        position: "absolute",
        left,
        top,
        width: size,
        height: size,
        borderRadius: size,
        backgroundColor: COLORS.champagne,
        opacity,
        transform: [{ scale }, { translateY }],
        shadowColor: COLORS.gold,
        shadowOpacity: 1,
        shadowRadius: 9,
        elevation: 6,
      }}
    />
  );
}

// ============================================================
// FLOATING BACKGROUND ORBS
// ============================================================

function FloatingGlow() {
  const float = useRef(new Animated.Value(0)).current;
  const pulse = useRef(new Animated.Value(0.35)).current;

  useEffect(() => {
    const floating = Animated.loop(
      Animated.sequence([
        Animated.timing(float, {
          toValue: 1,
          duration: 4500,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(float, {
          toValue: 0,
          duration: 4500,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    );

    const pulsing = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 0.8,
          duration: 2200,
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 0.25,
          duration: 2200,
          useNativeDriver: true,
        }),
      ])
    );

    floating.start();
    pulsing.start();

    return () => {
      floating.stop();
      pulsing.stop();
    };
  }, [float, pulse]);

  return (
    <>
      <Animated.View
        pointerEvents="none"
        style={[
          styles.glowOrb,
          {
            opacity: pulse,
            transform: [
              {
                translateY: float.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, -30],
                }),
              },
              {
                scale: float.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.9, 1.15],
                }),
              },
            ],
          },
        ]}
      />

      <View pointerEvents="none" style={styles.deepGlowOrb} />
      <View pointerEvents="none" style={styles.goldGlowOrb} />
    </>
  );
}

// ============================================================
// PREMIUM ANIMATED GA ROYAL EMBLEM
// ============================================================

function AnimatedGALogo() {
  const rotation = useRef(new Animated.Value(0)).current;
  const reverseRotation = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(1)).current;
  const glow = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    const rotate = Animated.loop(
      Animated.timing(rotation, {
        toValue: 1,
        duration: 12000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );

    const reverse = Animated.loop(
      Animated.timing(reverseRotation, {
        toValue: 1,
        duration: 8500,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );

    const breathing = Animated.loop(
      Animated.sequence([
        Animated.spring(scale, {
          toValue: 1.08,
          damping: 8,
          stiffness: 90,
          useNativeDriver: true,
        }),
        Animated.spring(scale, {
          toValue: 1,
          damping: 8,
          stiffness: 90,
          useNativeDriver: true,
        }),
      ])
    );

    const glowing = Animated.loop(
      Animated.sequence([
        Animated.timing(glow, {
          toValue: 1,
          duration: 1600,
          useNativeDriver: true,
        }),
        Animated.timing(glow, {
          toValue: 0.4,
          duration: 1600,
          useNativeDriver: true,
        }),
      ])
    );

    rotate.start();
    reverse.start();
    breathing.start();
    glowing.start();

    return () => {
      rotate.stop();
      reverse.stop();
      breathing.stop();
      glowing.stop();
    };
  }, [rotation, reverseRotation, scale, glow]);

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
            transform: [{ rotate: spin }],
            opacity: glow,
          },
        ]}
      >
        <View style={styles.orbitDotGold} />
        <View style={styles.orbitDotWhite} />
        <View style={styles.orbitDotGreen} />
      </Animated.View>

      <Animated.View
        style={[
          styles.innerOrbit,
          { transform: [{ rotate: reverseSpin }] },
        ]}
      >
        <View style={styles.innerOrbitDot} />
      </Animated.View>

      <Animated.View style={[styles.logoGlow, { opacity: glow }]} />

      <Animated.View
        style={[
          styles.logoCircle,
          { transform: [{ scale }] },
        ]}
      >
        <LinearGradient
          colors={["#FFF9E9", "#E8D5AE", "#B9955C"]}
          style={styles.logoGradient}
        >
          <View style={styles.logoInnerBorder}>
            <Text style={styles.logoG}>G</Text>
            <Text style={styles.logoA}>A</Text>
          </View>
        </LinearGradient>
      </Animated.View>

      <View style={styles.logoCrown}>
        <Text style={styles.crownText}>♛</Text>
      </View>
    </View>
  );
}

// ============================================================
// MAIN ONBOARDING SCREEN
// ============================================================

export default function OnboardingScreen() {
  const router = useRouter();

  const { width, height } = useWindowDimensions();

  const [currentIndex, setCurrentIndex] = useState(0);

  const currentIndexRef = useRef(0);
  const animatingRef = useRef(false);
  const mountedRef = useRef(true);

  const translateX = useRef(new Animated.Value(0)).current;
  const imageScale = useRef(new Animated.Value(1)).current;
  const imageOpacity = useRef(new Animated.Value(1)).current;
  const contentOpacity = useRef(new Animated.Value(1)).current;
  const contentY = useRef(new Animated.Value(0)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;
  const progress = useRef(new Animated.Value(0)).current;

  const slide = SLIDES[currentIndex];

  // SafeAreaView already removes the top and bottom system areas.
  // Do not subtract safe-area insets again.

  const availableHeight = height;

  const compact = availableHeight < 740;
  const veryCompact = availableHeight < 660;

  const imageHeight = Math.min(
    compact ? 235 : 290,
    Math.max(
      veryCompact ? 175 : 195,
      availableHeight * 0.32
    )
  );

  // ----------------------------------------------------------
  // LOGIN NAVIGATION
  // ----------------------------------------------------------

  const openLogin = () => {
    if (!mountedRef.current) return;

    router.replace("/login");
  };

  // ----------------------------------------------------------
  // PROGRESS ANIMATION
  // ----------------------------------------------------------

  const animateProgress = () => {
    progress.stopAnimation();
    progress.setValue(0);

    Animated.timing(progress, {
      toValue: 1,
      duration: AUTO_SLIDE_DURATION,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start();
  };

  // ----------------------------------------------------------
  // SLIDE CHANGE
  // ----------------------------------------------------------

  const changeSlide = (nextIndex: number, direction: number) => {
    if (
      animatingRef.current ||
      nextIndex === currentIndexRef.current ||
      nextIndex < 0 ||
      nextIndex >= SLIDES.length
    ) {
      return;
    }

    animatingRef.current = true;
    progress.stopAnimation();

    Animated.parallel([
      Animated.timing(translateX, {
        toValue: -direction * width * 0.2,
        duration: 180,
        useNativeDriver: true,
      }),

      Animated.timing(imageOpacity, {
        toValue: 0,
        duration: 180,
        useNativeDriver: true,
      }),

      Animated.timing(contentOpacity, {
        toValue: 0,
        duration: 160,
        useNativeDriver: true,
      }),
    ]).start(({ finished }) => {
      if (!finished || !mountedRef.current) {
        animatingRef.current = false;
        return;
      }

      currentIndexRef.current = nextIndex;
      setCurrentIndex(nextIndex);

      translateX.setValue(direction * width * 0.5);
      imageScale.setValue(0.88);
      imageOpacity.setValue(0);
      contentY.setValue(22);
      contentOpacity.setValue(0);

      Animated.parallel([
        Animated.spring(translateX, {
          toValue: 0,
          damping: 14,
          stiffness: 100,
          useNativeDriver: true,
        }),

        Animated.spring(imageScale, {
          toValue: 1,
          damping: 13,
          stiffness: 95,
          useNativeDriver: true,
        }),

        Animated.timing(imageOpacity, {
          toValue: 1,
          duration: 450,
          useNativeDriver: true,
        }),

        Animated.parallel([
          Animated.timing(contentOpacity, {
            toValue: 1,
            duration: 450,
            delay: 80,
            useNativeDriver: true,
          }),

          Animated.spring(contentY, {
            toValue: 0,
            damping: 14,
            stiffness: 95,
            useNativeDriver: true,
          }),
        ]),
      ]).start(() => {
        if (mountedRef.current) {
          animatingRef.current = false;
        }
      });
    });
  };

  // ----------------------------------------------------------
  // AUTO SLIDE
  // ----------------------------------------------------------

  useEffect(() => {
    animateProgress();

    const timer = setTimeout(() => {
      if (!mountedRef.current || animatingRef.current) {
        return;
      }

      if (currentIndexRef.current === SLIDES.length - 1) {
        openLogin();
      } else {
        changeSlide(currentIndexRef.current + 1, 1);
      }
    }, AUTO_SLIDE_DURATION);

    return () => {
      clearTimeout(timer);
      progress.stopAnimation();
    };
  }, [currentIndex]);

  // ----------------------------------------------------------
  // CLEANUP
  // ----------------------------------------------------------

  useEffect(() => {
    mountedRef.current = true;

    return () => {
      mountedRef.current = false;

      progress.stopAnimation();
      translateX.stopAnimation();
      imageScale.stopAnimation();
      imageOpacity.stopAnimation();
      contentOpacity.stopAnimation();
      contentY.stopAnimation();
      buttonScale.stopAnimation();
    };
  }, []);

  // ----------------------------------------------------------
  // NEXT / PREVIOUS
  // ----------------------------------------------------------

  const goNext = () => {
    if (animatingRef.current) return;

    if (currentIndexRef.current === SLIDES.length - 1) {
      openLogin();
      return;
    }

    changeSlide(currentIndexRef.current + 1, 1);
  };

  const goPrevious = () => {
    if (
      currentIndexRef.current === 0 ||
      animatingRef.current
    ) {
      return;
    }

    changeSlide(currentIndexRef.current - 1, -1);
  };

  const goNextRef = useRef(goNext);
  const goPreviousRef = useRef(goPrevious);

  goNextRef.current = goNext;
  goPreviousRef.current = goPrevious;

  // ----------------------------------------------------------
  // SWIPE GESTURE
  // ----------------------------------------------------------

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gesture) =>
        Math.abs(gesture.dx) > 12 &&
        Math.abs(gesture.dx) > Math.abs(gesture.dy),

      onPanResponderRelease: (_, gesture) => {
        if (gesture.dx < -45) {
          goNextRef.current();
        } else if (gesture.dx > 45) {
          goPreviousRef.current();
        }
      },
    })
  ).current;

  // ----------------------------------------------------------
  // BUTTON ANIMATION
  // ----------------------------------------------------------

  const handleButtonPress = () => {
    if (animatingRef.current) return;

    Animated.sequence([
      Animated.spring(buttonScale, {
        toValue: 0.95,
        useNativeDriver: true,
      }),
      Animated.spring(buttonScale, {
        toValue: 1,
        friction: 4,
        tension: 100,
        useNativeDriver: true,
      }),
    ]).start();

    goNext();
  };

  const isLastSlide = currentIndex === SLIDES.length - 1;

  const rotation = translateX.interpolate({
    inputRange: [-width, 0, width],
    outputRange: ["-3deg", "0deg", "3deg"],
    extrapolate: "clamp",
  });

  // ----------------------------------------------------------
  // MAIN UI
  // ----------------------------------------------------------

  return (
    <SafeAreaView
      style={styles.safeArea}
      edges={["top", "bottom"]}
    >
      <StatusBar
        hidden={false}
        translucent={false}
        backgroundColor={COLORS.deep}
        barStyle="light-content"
      />

      <View style={styles.container}>
        {/* ROYAL BACKGROUND */}

        <LinearGradient
          colors={[
            "#0B1C14",
            "#1C3528",
            "#294333",
            "#14271D",
            "#0B1C14",
          ]}
          locations={[0, 0.3, 0.55, 0.8, 1]}
          style={StyleSheet.absoluteFillObject}
        />

        <FloatingGlow />

        {/* GOLD PARTICLES */}

        <Sparkle left={25} top={75} delay={100} size={5} />
        <Sparkle left={width - 40} top={110} delay={400} size={4} />
        <Sparkle left={width - 65} top={height * 0.4} delay={800} size={6} />
        <Sparkle left={35} top={height * 0.58} delay={300} size={4} />
        <Sparkle left={width * 0.5} top={height * 0.16} delay={700} size={3} />
        <Sparkle left={width * 0.12} top={height * 0.1} delay={100} size={4} />
        <Sparkle left={width * 0.82} top={height * 0.12} delay={400} size={6} />
        <Sparkle left={width * 0.25} top={height * 0.3} delay={700} size={3} />
        <Sparkle left={width * 0.9} top={height * 0.34} delay={200} size={4} />
        <Sparkle left={width * 0.08} top={height * 0.72} delay={900} size={5} />
        <Sparkle left={width * 0.75} top={height * 0.88} delay={300} size={4} />

        {/* HEADER */}

        <View style={styles.header}>
          <View style={styles.brandContainer}>
            <AnimatedGALogo />

            <View style={styles.brandTextContainer}>
              <Text style={styles.brandName}>GLOWAURA</Text>

              <Text style={styles.brandTagline}>
                BEAUTY • SKINCARE • MEHNDI
              </Text>

              <Text style={styles.brandSubline}>
                THE ART OF LUXURY
              </Text>
            </View>
          </View>

          <TouchableOpacity
            onPress={openLogin}
            activeOpacity={0.75}
            style={styles.skipButton}
          >
            <Text style={styles.skipText}>SKIP</Text>
            <Text style={styles.skipArrow}>→</Text>
          </TouchableOpacity>
        </View>

        {/* SCROLLABLE CONTENT */}

        <ScrollView
          style={styles.mainScroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          {/* TOP LABEL */}

          <View style={styles.topLabel}>
            <View style={styles.labelLine} />

            <Text style={styles.eyebrow}>
              {slide.eyebrow}
            </Text>

            <View style={styles.labelLine} />
          </View>

          {/* HERO IMAGE CARD */}

          <View
            style={[
              styles.imageArea,
              { height: imageHeight },
            ]}
            {...panResponder.panHandlers}
          >
            <View style={styles.cardShadow} />

            <Animated.View
              style={[
                styles.imageCard,
                {
                  opacity: imageOpacity,
                  transform: [
                    { translateX },
                    { scale: imageScale },
                    { rotate: rotation },
                  ],
                },
              ]}
            >
              <Image
                key={slide.id}
                source={{ uri: slide.image }}
                style={styles.heroImage}
                resizeMode="cover"
              />

              <LinearGradient
                colors={[
                  "rgba(11,28,20,0.02)",
                  "rgba(11,28,20,0.15)",
                  "rgba(11,28,20,0.96)",
                ]}
                locations={[0, 0.42, 1]}
                style={styles.imageGradient}
              />

              {/* IMAGE HEADER */}

              <View style={styles.imageTopRow}>
                <View style={styles.imageTag}>
                  <View style={styles.liveDot} />
                  <Text style={styles.imageTagText}>
                    GLOWAURA EXCLUSIVE
                  </Text>
                </View>

                <View style={styles.numberBadge}>
                  <Text style={styles.imageNumber}>
                    {slide.id}
                  </Text>
                </View>
              </View>

              {/* CENTER DESIGN */}

              <View style={styles.imageCenterDecor}>
                <Text style={styles.decorStar}>✦</Text>
                <View style={styles.decorLine} />
                <Text style={styles.decorCaption}>
                  BEAUTY IN EVERY DETAIL
                </Text>
              </View>

              {/* IMAGE BOTTOM */}

              <View style={styles.imageBottom}>
                <Text style={styles.imageCategory}>
                  {slide.category}
                </Text>

                <View style={styles.imageBottomLine} />

                <Text style={styles.imageQuote}>
                  “{slide.quote}”
                </Text>
              </View>

              <View style={styles.imageBorder} />
            </Animated.View>

            {/* FLOATING ORNAMENT */}

            <View style={styles.floatingBadge}>
              <LinearGradient
                colors={["#FFF9E9", "#E8D5AE", "#B9955C"]}
                style={styles.badgeCircle}
              >
                <Text style={styles.badgeStar}>✦</Text>
              </LinearGradient>
            </View>

            {/* SIDE EMBLEM */}

            <View style={styles.sideDecoration}>
              <Text style={styles.sideDecorationText}>G</Text>
            </View>
          </View>

          {/* MAIN CONTENT */}

          <Animated.View
            style={[
              styles.content,
              {
                opacity: contentOpacity,
                transform: [{ translateY: contentY }],
              },
            ]}
          >
            <View style={styles.titleContainer}>
              <Text style={styles.title}>
                {slide.title}
              </Text>

              <Text style={styles.highlightTitle}>
                {slide.highlight}
              </Text>

              <View style={styles.titleUnderline} />
            </View>

            <Text
              style={[
                styles.description,
                veryCompact && styles.smallDescription,
              ]}
            >
              {slide.description}
            </Text>

            {/* FEATURE CHIPS */}

            <View style={styles.featureContainer}>
              {slide.features.map((feature, index) => (
                <View key={feature} style={styles.featureChip}>
                  <Text style={styles.featureIcon}>
                    {index === 0 ? "✦" : index === 1 ? "◇" : "✧"}
                  </Text>

                  <Text style={styles.featureText}>
                    {feature}
                  </Text>
                </View>
              ))}
            </View>

            {/* PREMIUM SERVICE COLLECTION */}

            <View style={styles.collectionHeader}>
              <View style={styles.collectionLine} />

              <Text style={styles.collectionHeading}>
                CURATED FOR YOUR BEAUTY
              </Text>

              <View style={styles.collectionLine} />
            </View>

            <View style={styles.servicePanel}>
              {slide.services.map((service, index) => (
                <View
                  key={service.title}
                  style={[
                    styles.serviceItem,
                    index !== 2 && styles.serviceDivider,
                  ]}
                >
                  <View style={styles.serviceIconCircle}>
                    <Text style={styles.serviceIcon}>
                      {service.icon}
                    </Text>
                  </View>

                  <Text style={styles.serviceTitle}>
                    {service.title}
                  </Text>

                  <Text style={styles.serviceDetail}>
                    {service.detail}
                  </Text>
                </View>
              ))}
            </View>

            {/* THREE LUXURY BENEFITS */}

            <View style={styles.benefitsPanel}>
              {slide.highlights.map((item, index) => (
                <View
                  key={item.title}
                  style={[
                    styles.benefitItem,
                    index !== 2 && styles.benefitDivider,
                  ]}
                >
                  <Text style={styles.benefitIcon}>
                    {item.icon}
                  </Text>

                  <Text style={styles.benefitTitle}>
                    {item.title}
                  </Text>

                  <Text style={styles.benefitDetail}>
                    {item.detail}
                  </Text>
                </View>
              ))}
            </View>

            {/* EXPERIENCE BADGE */}

            <View style={styles.experienceBadge}>
              <View style={styles.experienceLine} />

              <Text style={styles.experienceText}>
                {slide.badge}
              </Text>

              <View style={styles.experienceLine} />
            </View>

            {/* BOTTOM BRAND MESSAGE */}

            <View style={styles.bottomMessage}>
              <Text style={styles.bottomTitle}>
                {slide.bottomTitle}
              </Text>

              <Text style={styles.bottomDescription}>
                {slide.bottomDescription}
              </Text>
            </View>
          </Animated.View>
        </ScrollView>

        {/* PROGRESS SECTION */}

        <View style={styles.progressSection}>
          <View style={styles.dotsRow}>
            {SLIDES.map((item, index) => (
              <TouchableOpacity
                key={item.id}
                onPress={() => {
                  if (animatingRef.current) return;

                  const direction =
                    index > currentIndexRef.current ? 1 : -1;

                  changeSlide(index, direction);
                }}
                activeOpacity={0.8}
                style={styles.dotTouchable}
              >
                <View
                  style={[
                    styles.dot,
                    currentIndex === index && styles.activeDot,
                  ]}
                />
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.progressTrack}>
            <Animated.View
              style={[
                styles.progressFill,
                {
                  width: progress.interpolate({
                    inputRange: [0, 1],
                    outputRange: ["0%", "100%"],
                  }),
                },
              ]}
            />
          </View>
        </View>

        {/* BOTTOM NAVIGATION */}

        <View style={styles.footer}>
          <TouchableOpacity
            style={[
              styles.backButton,
              currentIndex === 0 && styles.disabledBackButton,
            ]}
            onPress={goPrevious}
            activeOpacity={0.7}
            disabled={currentIndex === 0}
          >
            <Text style={styles.backArrow}>‹</Text>
          </TouchableOpacity>

          <Animated.View
            style={[
              styles.nextButtonWrapper,
              { transform: [{ scale: buttonScale }] },
            ]}
          >
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={handleButtonPress}
              style={styles.nextButton}
            >
              <LinearGradient
                colors={[
                  "#FFF8E8",
                  "#E8D5AE",
                  "#C19D65",
                ]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.buttonGradient}
              >
                <Text style={styles.nextButtonText}>
                  {isLastSlide
                    ? "BEGIN YOUR BEAUTY JOURNEY"
                    : "EXPLORE THE EXPERIENCE"}
                </Text>

                <Text style={styles.nextArrow}>→</Text>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>

          <View style={styles.slideCount}>
            <Text style={styles.slideCurrent}>
              {String(currentIndex + 1).padStart(2, "0")}
            </Text>

            <Text style={styles.slideDivider}>/</Text>

            <Text style={styles.slideTotal}>05</Text>
          </View>
        </View>

        {/* BRAND FOOTER */}

        <View style={styles.footerBrand}>
          <Text style={styles.footerCaption}>
            ✦ MADE WITH LOVE, FOR YOUR BEAUTY ✦
          </Text>

          <Text style={styles.footerSubcaption}>
            BEAUTY • ELEGANCE • CONFIDENCE
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

// ============================================================
// COMPLETE ROYAL FOREST LUXURY STYLES
// ============================================================

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.deep,
  },

  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingHorizontal: 19,
    overflow: "hidden",
  },

  // BACKGROUND

  glowOrb: {
    position: "absolute",
    width: 270,
    height: 270,
    borderRadius: 135,
    backgroundColor: "rgba(130,158,125,0.17)",
    top: "20%",
    left: "25%",
  },

  deepGlowOrb: {
    position: "absolute",
    width: 230,
    height: 230,
    borderRadius: 115,
    backgroundColor: "rgba(64,91,72,0.22)",
    top: "58%",
    left: -130,
  },

  goldGlowOrb: {
    position: "absolute",
    width: 190,
    height: 190,
    borderRadius: 95,
    backgroundColor: "rgba(185,154,101,0.10)",
    top: "5%",
    right: -120,
  },

  // HEADER

  header: {
    minHeight: 68,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  brandContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 11,
  },

  brandTextContainer: {
    justifyContent: "center",
  },

  brandName: {
    fontSize: 17,
    letterSpacing: 3,
    color: COLORS.ivory,
    fontWeight: "900",
  },

  brandTagline: {
    color: COLORS.champagne,
    fontSize: 7,
    letterSpacing: 1.35,
    marginTop: 4,
    fontWeight: "900",
  },

  brandSubline: {
    color: COLORS.sage,
    fontSize: 6,
    letterSpacing: 2,
    marginTop: 3,
    fontWeight: "800",
  },

  skipButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "rgba(232,213,174,0.4)",
    backgroundColor: "rgba(255,255,255,0.055)",
  },

  skipText: {
    color: COLORS.champagne,
    fontSize: 10,
    letterSpacing: 1.7,
    fontWeight: "900",
  },

  skipArrow: {
    color: COLORS.champagne,
    fontSize: 15,
    marginLeft: 6,
  },

  // GA LOGO

  logoContainer: {
    width: 62,
    height: 62,
    alignItems: "center",
    justifyContent: "center",
  },

  outerOrbit: {
    position: "absolute",
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 1.2,
    borderColor: COLORS.champagne,
    borderStyle: "dashed",
  },

  innerOrbit: {
    position: "absolute",
    width: 49,
    height: 49,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: "rgba(145,162,140,0.8)",
  },

  orbitDotGold: {
    position: "absolute",
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: "#FFF0CC",
    top: -3,
    left: 25,
  },

  orbitDotWhite: {
    position: "absolute",
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: COLORS.white,
    left: -2,
    top: 25,
  },

  orbitDotGreen: {
    position: "absolute",
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#AFC2A9",
    bottom: 3,
    right: 3,
  },

  innerOrbitDot: {
    position: "absolute",
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: COLORS.champagne,
    right: 4,
    top: 5,
  },

  logoGlow: {
    position: "absolute",
    width: 45,
    height: 45,
    borderRadius: 23,
    backgroundColor: "rgba(232,213,174,0.22)",
    shadowColor: COLORS.champagne,
    shadowOpacity: 1,
    shadowRadius: 20,
    elevation: 12,
  },

  logoCircle: {
    width: 38,
    height: 38,
    borderRadius: 20,
    padding: 2,
    overflow: "hidden",
    elevation: 10,
    shadowColor: COLORS.gold,
    shadowOpacity: 0.8,
    shadowRadius: 12,
  },

  logoGradient: {
    flex: 1,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },

  logoInnerBorder: {
    width: "100%",
    height: "100%",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.8)",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },

  logoG: {
    color: "#263C30",
    fontSize: 22,
    fontWeight: "900",
    fontStyle: "italic",
  },

  logoA: {
    color: "#405B48",
    fontSize: 12,
    fontWeight: "900",
    marginLeft: -3,
    marginTop: 12,
  },

  logoCrown: {
    position: "absolute",
    top: -4,
    right: 2,
  },

  crownText: {
    color: COLORS.champagne,
    fontSize: 12,
  },

  // SCROLL CONTENT

  mainScroll: {
    flex: 1,
  },

  scrollContent: {
    paddingBottom: 14,
  },

  // TOP LABEL

  topLabel: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
    marginBottom: 13,
    gap: 8,
  },

  labelLine: {
    width: 22,
    height: 1,
    backgroundColor: "rgba(232,213,174,0.7)",
  },

  eyebrow: {
    color: COLORS.champagne,
    fontSize: 8,
    fontWeight: "900",
    letterSpacing: 1.2,
    textAlign: "center",
    flexShrink: 1,
  },

  // HERO IMAGE

  imageArea: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },

  cardShadow: {
    position: "absolute",
    width: "91%",
    height: "94%",
    borderRadius: 34,
    backgroundColor: COLORS.gold,
    opacity: 0.25,
    transform: [
      { rotate: "3deg" },
      { translateY: 7 },
    ],
  },

  imageCard: {
    width: "95%",
    height: "100%",
    borderRadius: 28,
    overflow: "hidden",
    backgroundColor: COLORS.forest,
    borderWidth: 1.3,
    borderColor: "rgba(232,213,174,0.85)",
    shadowColor: COLORS.gold,
    shadowOpacity: 0.4,
    shadowRadius: 24,
    elevation: 17,
  },

  heroImage: {
    width: "100%",
    height: "100%",
    position: "absolute",
  },

  imageGradient: {
    ...StyleSheet.absoluteFillObject,
  },

  imageTopRow: {
    position: "absolute",
    top: 14,
    left: 13,
    right: 13,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  imageTag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(11,28,20,0.84)",
    borderRadius: 20,
    paddingHorizontal: 11,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "rgba(232,213,174,0.35)",
  },

  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.champagne,
  },

  imageTagText: {
    color: COLORS.ivory,
    fontSize: 7,
    letterSpacing: 0.9,
    fontWeight: "900",
  },

  numberBadge: {
    width: 34,
    height: 34,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(232,213,174,0.65)",
    backgroundColor: "rgba(11,28,20,0.78)",
  },

  imageNumber: {
    color: COLORS.ivory,
    fontSize: 10,
    fontWeight: "900",
  },

  imageCenterDecor: {
    position: "absolute",
    top: "36%",
    alignSelf: "center",
    alignItems: "center",
  },

  decorStar: {
    fontSize: 29,
    color: "rgba(255,248,233,0.95)",
  },

  decorLine: {
    width: 42,
    height: 1,
    backgroundColor: COLORS.champagne,
    marginTop: 5,
  },

  decorCaption: {
    color: COLORS.ivory,
    fontSize: 7,
    letterSpacing: 2,
    marginTop: 7,
    fontWeight: "900",
  },

  imageBottom: {
    position: "absolute",
    bottom: 20,
    left: 18,
    right: 18,
  },

  imageCategory: {
    color: COLORS.champagne,
    fontSize: 8,
    letterSpacing: 1.5,
    fontWeight: "900",
  },

  imageBottomLine: {
    width: 42,
    height: 2,
    backgroundColor: COLORS.gold,
    marginTop: 9,
    marginBottom: 9,
  },

  imageQuote: {
    color: COLORS.ivory,
    fontSize: 12,
    fontStyle: "italic",
    letterSpacing: 0.2,
    fontWeight: "600",
  },

  imageBorder: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },

  floatingBadge: {
    position: "absolute",
    right: 0,
    bottom: 14,
    borderRadius: 30,
    padding: 5,
    backgroundColor: "rgba(232,213,174,0.25)",
    zIndex: 5,
  },

  badgeCircle: {
    width: 41,
    height: 41,
    borderRadius: 21,
    justifyContent: "center",
    alignItems: "center",
  },

  badgeStar: {
    color: COLORS.forest,
    fontSize: 22,
    fontWeight: "900",
  },

  sideDecoration: {
    position: "absolute",
    left: 0,
    top: "39%",
    width: 29,
    height: 29,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "rgba(232,213,174,0.6)",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(11,28,20,0.9)",
  },

  sideDecorationText: {
    color: COLORS.champagne,
    fontSize: 13,
    fontWeight: "900",
    fontStyle: "italic",
  },

  // MAIN CONTENT

  content: {
    alignItems: "center",
    marginTop: 15,
    paddingHorizontal: 3,
  },

  titleContainer: {
    alignItems: "center",
    width: "100%",
  },

  title: {
    color: COLORS.ivory,
    fontSize: 25,
    fontWeight: "500",
    textAlign: "center",
    letterSpacing: 0.15,
  },

  highlightTitle: {
    color: COLORS.champagne,
    fontSize: 25,
    fontWeight: "800",
    textAlign: "center",
    letterSpacing: -0.3,
    marginTop: 2,
  },

  titleUnderline: {
    width: 47,
    height: 2,
    borderRadius: 2,
    backgroundColor: COLORS.gold,
    marginTop: 9,
  },

  description: {
    color: COLORS.muted,
    fontSize: 10,
    lineHeight: 16,
    textAlign: "center",
    marginTop: 10,
    paddingHorizontal: 5,
    fontWeight: "500",
  },

  smallDescription: {
    fontSize: 9,
    lineHeight: 14,
    marginTop: 7,
  },

  // FEATURE CHIPS

  featureContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
    marginTop: 12,
  },

  featureChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.065)",
    borderWidth: 1,
    borderColor: "rgba(232,213,174,0.3)",
    borderRadius: 22,
    paddingHorizontal: 10,
    paddingVertical: 7,
  },

  featureIcon: {
    color: COLORS.champagne,
    fontSize: 10,
    marginRight: 5,
  },

  featureText: {
    color: COLORS.ivory,
    fontSize: 8,
    fontWeight: "800",
  },

  // SERVICE COLLECTION

  collectionHeader: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 16,
    marginBottom: 9,
  },

  collectionLine: {
    width: 27,
    height: 1,
    backgroundColor: "rgba(232,213,174,0.45)",
  },

  collectionHeading: {
    color: COLORS.champagne,
    fontSize: 8,
    fontWeight: "900",
    letterSpacing: 1.3,
  },

  servicePanel: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    paddingVertical: 12,
    paddingHorizontal: 3,
    borderRadius: 19,
    backgroundColor: "rgba(255,255,255,0.055)",
    borderWidth: 1,
    borderColor: "rgba(232,213,174,0.25)",
  },

  serviceItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 3,
  },

  serviceDivider: {
    borderRightWidth: 1,
    borderRightColor: "rgba(232,213,174,0.28)",
  },

  serviceIconCircle: {
    width: 35,
    height: 35,
    borderRadius: 18,
    backgroundColor: "rgba(232,213,174,0.1)",
    borderWidth: 1,
    borderColor: "rgba(232,213,174,0.38)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 6,
  },

  serviceIcon: {
    color: COLORS.champagne,
    fontSize: 17,
  },

  serviceTitle: {
    color: COLORS.ivory,
    fontSize: 9,
    fontWeight: "900",
    textAlign: "center",
  },

  serviceDetail: {
    color: COLORS.muted,
    fontSize: 7,
    marginTop: 4,
    textAlign: "center",
  },

  // BENEFITS

  benefitsPanel: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    marginTop: 9,
    paddingVertical: 11,
    paddingHorizontal: 3,
    borderRadius: 17,
    backgroundColor: "rgba(11,28,20,0.35)",
    borderWidth: 1,
    borderColor: "rgba(232,213,174,0.2)",
  },

  benefitItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 3,
  },

  benefitDivider: {
    borderRightWidth: 1,
    borderRightColor: "rgba(232,213,174,0.3)",
  },

  benefitIcon: {
    color: COLORS.champagne,
    fontSize: 15,
    marginBottom: 4,
  },

  benefitTitle: {
    color: COLORS.ivory,
    fontSize: 8,
    fontWeight: "900",
    letterSpacing: 0.7,
  },

  benefitDetail: {
    color: COLORS.muted,
    fontSize: 7,
    marginTop: 4,
    textAlign: "center",
  },

  // EXPERIENCE BADGE

  experienceBadge: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 12,
  },

  experienceLine: {
    width: 20,
    height: 1,
    backgroundColor: "rgba(232,213,174,0.55)",
  },

  experienceText: {
    color: COLORS.champagne,
    fontSize: 7,
    fontWeight: "900",
    letterSpacing: 1.2,
  },

  // BOTTOM MESSAGE

  bottomMessage: {
    width: "100%",
    alignItems: "center",
    marginTop: 13,
    marginBottom: 4,
    paddingVertical: 10,
    paddingHorizontal: 7,
    borderRadius: 13,
    borderWidth: 1,
    borderColor: "rgba(232,213,174,0.16)",
    backgroundColor: "rgba(255,255,255,0.035)",
  },

  bottomTitle: {
    color: COLORS.ivory,
    fontSize: 8,
    fontWeight: "900",
    letterSpacing: 1,
    textAlign: "center",
  },

  bottomDescription: {
    color: COLORS.champagne,
    fontSize: 8,
    letterSpacing: 1.1,
    marginTop: 5,
    fontWeight: "700",
    textAlign: "center",
  },

  // PROGRESS

  progressSection: {
    marginTop: 5,
    alignItems: "center",
  },

  dotsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 7,
  },

  dotTouchable: {
    paddingHorizontal: 7,
    paddingVertical: 5,
  },

  dot: {
    width: 6,
    height: 6,
    borderRadius: 5,
    backgroundColor: "rgba(255,249,239,0.35)",
  },

  activeDot: {
    width: 23,
    backgroundColor: COLORS.champagne,
    shadowColor: COLORS.gold,
    shadowOpacity: 0.9,
    shadowRadius: 7,
    elevation: 4,
  },

  progressTrack: {
    width: 100,
    height: 2,
    borderRadius: 3,
    backgroundColor: "rgba(255,249,239,0.16)",
    overflow: "hidden",
  },

  progressFill: {
    height: 2,
    backgroundColor: COLORS.champagne,
    borderRadius: 3,
  },

  // FOOTER BUTTONS

  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 9,
    gap: 9,
  },

  backButton: {
    width: 43,
    height: 47,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "rgba(232,213,174,0.5)",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.06)",
  },

  disabledBackButton: {
    opacity: 0.4,
  },

  backArrow: {
    color: COLORS.champagne,
    fontSize: 30,
    lineHeight: 34,
    marginTop: -4,
  },

  nextButtonWrapper: {
    flex: 1,
  },

  nextButton: {
    borderRadius: 15,
    overflow: "hidden",
    shadowColor: COLORS.gold,
    shadowOpacity: 0.45,
    shadowRadius: 13,
    elevation: 9,
  },

  buttonGradient: {
    height: 47,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 8,
  },

  nextButtonText: {
    color: COLORS.forest,
    fontSize: 9,
    letterSpacing: 0.8,
    fontWeight: "900",
  },

  nextArrow: {
    color: COLORS.forest,
    fontSize: 20,
    fontWeight: "900",
    marginLeft: 9,
    marginTop: -2,
  },

  slideCount: {
    width: 45,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  slideCurrent: {
    color: COLORS.champagne,
    fontSize: 14,
    fontWeight: "900",
  },

  slideDivider: {
    color: "rgba(255,249,239,0.4)",
    marginHorizontal: 3,
  },

  slideTotal: {
    color: COLORS.muted,
    fontSize: 10,
    fontWeight: "700",
  },

  // BRAND FOOTER

  footerBrand: {
    alignItems: "center",
    marginTop: 9,
    marginBottom: 4,
  },

  footerCaption: {
    textAlign: "center",
    color: "rgba(232,213,174,0.9)",
    fontSize: 7,
    letterSpacing: 1.5,
    fontWeight: "800",
  },

  footerSubcaption: {
    textAlign: "center",
    color: "rgba(198,200,184,0.7)",
    fontSize: 6,
    letterSpacing: 1.8,
    marginTop: 4,
    fontWeight: "700",
  },
});
