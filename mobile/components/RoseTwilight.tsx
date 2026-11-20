
/* Bismillah ❤️ */
/* GLOWAURA — COMPLETE ROSE TWILIGHT LUXURY THEME */

import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Easing,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

const { width, height } = Dimensions.get("window");

const PARTICLES = Array.from({ length: 38 }, (_, i) => ({
  x: (i * 53 + 17) % width,
  y: (i * 89 + 23) % height,
  size: i % 6 === 0 ? 5 : i % 3 === 0 ? 3 : 2,
  delay: i * 90,
}));

type Props = {
  size?: number;
};

export default function RoseTwilight({ size = 76 }: Props) {
  const rotation = useRef(new Animated.Value(0)).current;
  const reverseRotation = useRef(new Animated.Value(0)).current;
  const bounce = useRef(new Animated.Value(0)).current;
  const pulse = useRef(new Animated.Value(0)).current;

  const particles = useRef(
    PARTICLES.map(() => new Animated.Value(0))
  ).current;

  useEffect(() => {
    const animations = [
      Animated.loop(
        Animated.timing(rotation, {
          toValue: 1,
          duration: 12000,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      ),
      Animated.loop(
        Animated.timing(reverseRotation, {
          toValue: 1,
          duration: 8500,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      ),
      Animated.loop(
        Animated.sequence([
          Animated.timing(bounce, {
            toValue: -5,
            duration: 900,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.spring(bounce, {
            toValue: 0,
            friction: 4,
            tension: 45,
            useNativeDriver: true,
          }),
        ])
      ),
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulse, {
            toValue: 1,
            duration: 1300,
            useNativeDriver: true,
          }),
          Animated.timing(pulse, {
            toValue: 0,
            duration: 1300,
            useNativeDriver: true,
          }),
        ])
      ),
    ];

    const particleLoops = particles.map((value, index) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(PARTICLES[index].delay),
          Animated.timing(value, {
            toValue: 1,
            duration: 1800 + (index % 5) * 200,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(value, {
            toValue: 0,
            duration: 1800 + (index % 5) * 200,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      )
    );

    animations.forEach((animation) => animation.start());
    particleLoops.forEach((animation) => animation.start());

    return () => {
      animations.forEach((animation) => animation.stop());
      particleLoops.forEach((animation) => animation.stop());
    };
  }, []);

  const spin = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  const reverseSpin = reverseRotation.interpolate({
    inputRange: [0, 1],
    outputRange: ["360deg", "0deg"],
  });

  const pulseScale = pulse.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.12],
  });

  const ring = size * 1.25;

  return (
    <View style={styles.root} pointerEvents="none">
      {/* FULL ROSE TWILIGHT BACKGROUND */}

      <LinearGradient
        colors={["#160B19", "#281326", "#35172C", "#190D1D"]}
        locations={[0, 0.35, 0.7, 1]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFillObject}
      />

      <View style={styles.glowOne} />
      <View style={styles.glowTwo} />
      <View style={styles.glowThree} />

      {/* BACKGROUND PARTICLES */}

      {PARTICLES.map((item, index) => {
        const animation = particles[index];

        return (
          <Animated.View
            key={index}
            style={[
              styles.particle,
              {
                left: item.x,
                top: item.y,
                width: item.size,
                height: item.size,
                borderRadius: item.size,
                opacity: animation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.15, 0.95],
                }),
                transform: [
                  {
                    translateY: animation.interpolate({
                      inputRange: [0, 1],
                      outputRange: [12, -22],
                    }),
                  },
                  {
                    scale: animation.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.6, 1.5],
                    }),
                  },
                ],
              },
            ]}
          />
        );
      })}

      {/* LOGO CONTAINER */}

      <View
        style={[
          styles.logoContainer,
          {
            width: size * 1.65,
            height: size * 1.65,
          },
        ]}
      >
        <Animated.View
          style={[
            styles.glow,
            {
              width: ring * 1.4,
              height: ring * 1.4,
              borderRadius: ring,
              transform: [{ scale: pulseScale }],
              opacity: pulse.interpolate({
                inputRange: [0, 1],
                outputRange: [0.25, 0.55],
              }),
            },
          ]}
        />

        {/* OUTER ROTATING RING */}

        <Animated.View
          style={[
            styles.outerRing,
            {
              width: ring,
              height: ring,
              borderRadius: ring,
              transform: [{ rotate: spin }],
            },
          ]}
        >
          <View style={styles.goldDot} />
          <View style={styles.bottomDot} />
        </Animated.View>

        {/* INNER ROTATING RING */}

        <Animated.View
          style={[
            styles.innerRing,
            {
              width: size * 1.05,
              height: size * 1.05,
              borderRadius: size,
              transform: [{ rotate: reverseSpin }],
            },
          ]}
        >
          <View style={styles.pinkDot} />
        </Animated.View>

        {/* CENTER GA LOGO */}

        <Animated.View
          style={{
            transform: [
              { translateY: bounce },
              { scale: pulseScale },
            ],
          }}
        >
          <LinearGradient
            colors={["#F4D3DE", "#C66B89", "#57243F"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[
              styles.logo,
              {
                width: size * 0.82,
                height: size * 0.82,
                borderRadius: size,
              },
            ]}
          >
            <View style={styles.logoInner}>
              <Text style={[styles.logoText, { fontSize: size * 0.32 }]}>
                GA
              </Text>
              <View style={styles.logoLine} />
              <Text style={styles.logoCaption}>GLOWAURA</Text>
            </View>
          </LinearGradient>
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    ...StyleSheet.absoluteFillObject,
    overflow: "hidden",
    backgroundColor: "#190D19",
  },

  glowOne: {
    position: "absolute",
    width: 300,
    height: 300,
    borderRadius: 200,
    backgroundColor: "rgba(198,107,137,0.17)",
    top: -100,
    right: -130,
  },

  glowTwo: {
    position: "absolute",
    width: 260,
    height: 260,
    borderRadius: 200,
    backgroundColor: "rgba(126,53,106,0.20)",
    bottom: 40,
    left: -120,
  },

  glowThree: {
    position: "absolute",
    width: 200,
    height: 200,
    borderRadius: 150,
    backgroundColor: "rgba(233,197,140,0.08)",
    top: "40%",
    right: -120,
  },

  particle: {
    position: "absolute",
    backgroundColor: "#F4D6DF",
    shadowColor: "#E7A4B8",
    shadowOpacity: 0.9,
    shadowRadius: 7,
    elevation: 5,
  },

  logoContainer: {
    position: "absolute",
    top: 70,
    right: 18,
    alignItems: "center",
    justifyContent: "center",
  },

  glow: {
    position: "absolute",
    backgroundColor: "#C66B89",
    shadowColor: "#E7A4B8",
    shadowOpacity: 0.8,
    shadowRadius: 30,
    elevation: 15,
  },

  outerRing: {
    position: "absolute",
    borderWidth: 1.5,
    borderColor: "rgba(233,197,140,0.65)",
    borderStyle: "dashed",
  },

  goldDot: {
    position: "absolute",
    top: -4,
    left: "48%",
    width: 9,
    height: 9,
    borderRadius: 10,
    backgroundColor: "#E9C58C",
  },

  bottomDot: {
    position: "absolute",
    bottom: 0,
    right: "18%",
    width: 6,
    height: 6,
    borderRadius: 5,
    backgroundColor: "#F4C7D5",
  },

  innerRing: {
    position: "absolute",
    borderWidth: 1,
    borderColor: "rgba(231,164,184,0.55)",
  },

  pinkDot: {
    position: "absolute",
    top: "15%",
    right: "5%",
    width: 7,
    height: 7,
    borderRadius: 5,
    backgroundColor: "#E7A4B8",
  },

  logo: {
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#F4D9C2",
    padding: 4,
  },

  logoInner: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255,243,236,0.55)",
    borderRadius: 100,
  },

  logoText: {
    color: "#FFF3EC",
    fontWeight: "900",
    letterSpacing: 1,
  },

  logoLine: {
    width: "42%",
    height: 1,
    backgroundColor: "#F1D29E",
    marginTop: 1,
  },

  logoCaption: {
    color: "#FFF3EC",
    fontSize: 6,
    fontWeight: "800",
    letterSpacing: 1.2,
    marginTop: 3,
  },
});
