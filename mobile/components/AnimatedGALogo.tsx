/* Bismillah-ir-Rahman-ir-Raheem ❤️ */
/* GLOWAURA — SIGNATURE ANIMATED GA LOGO */

import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Easing,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

export default function AnimatedGALogo() {
  const rotation = useRef(new Animated.Value(0)).current;
  const reverseRotation = useRef(new Animated.Value(0)).current;
  const bounce = useRef(new Animated.Value(1)).current;
  const glow = useRef(new Animated.Value(0.6)).current;
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
          toValue: 1.1,
          damping: 7,
          stiffness: 100,
          useNativeDriver: true,
        }),
        Animated.spring(bounce, {
          toValue: 1,
          damping: 8,
          stiffness: 100,
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
        Animated.spring(orbitScale, {
          toValue: 1.12,
          speed: 2,
          useNativeDriver: true,
        }),
        Animated.spring(orbitScale, {
          toValue: 0.85,
          speed: 2,
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
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.outerRing,
          {
            transform: [{ rotate: spin }],
            opacity: glow,
          },
        ]}
      >
        <View style={styles.goldDot} />
        <View style={styles.greenDot} />
        <View style={styles.whiteDot} />
      </Animated.View>

      <Animated.View
        style={[
          styles.middleRing,
          { transform: [{ rotate: reverseSpin }] },
        ]}
      >
        <View style={styles.smallGoldDot} />
        <View style={styles.smallGreenDot} />
      </Animated.View>

      <Animated.View
        style={[
          styles.glow,
          {
            opacity: glow,
            transform: [{ scale: orbitScale }],
          },
        ]}
      />

      <Animated.View
        style={[
          styles.mainCircle,
          { transform: [{ scale: bounce }] },
        ]}
      >
        <LinearGradient
          colors={["#FFF8E9", "#E6D3AD", "#B99A65", "#829482"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.innerGradient}
        >
          <View style={styles.innerBorder}>
            <Text style={styles.letterG}>G</Text>
            <Text style={styles.letterA}>A</Text>
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
        <View style={[styles.particle, styles.particleOne]} />
        <View style={[styles.particle, styles.particleTwo]} />
        <View style={[styles.particle, styles.particleThree]} />
        <View style={[styles.particle, styles.particleFour]} />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 66,
    height: 66,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  outerRing: {
    position: "absolute",
    width: 61,
    height: 61,
    borderRadius: 31,
    borderWidth: 1.3,
    borderColor: "rgba(230,211,173,0.85)",
    borderStyle: "dashed",
  },
  middleRing: {
    position: "absolute",
    width: 51,
    height: 51,
    borderRadius: 26,
    borderWidth: 1,
    borderColor: "rgba(130,148,130,0.9)",
  },
  goldDot: {
    position: "absolute",
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#FFF0CC",
    top: -4,
    left: 25,
  },
  greenDot: {
    position: "absolute",
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#AFC2A9",
    bottom: 3,
    right: 3,
  },
  whiteDot: {
    position: "absolute",
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: "#FFFFFF",
    left: -2,
    top: 25,
  },
  smallGoldDot: {
    position: "absolute",
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: "#FFF0CC",
    right: 3,
    top: 5,
  },
  smallGreenDot: {
    position: "absolute",
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: "#AFC2A9",
    left: 3,
    bottom: 5,
  },
  glow: {
    position: "absolute",
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(230,211,173,0.28)",
    shadowColor: "#E6D3AD",
    shadowOpacity: 1,
    shadowRadius: 22,
    elevation: 12,
  },
  mainCircle: {
    width: 39,
    height: 39,
    borderRadius: 22,
    padding: 2,
    overflow: "hidden",
    elevation: 10,
    shadowColor: "#B99A65",
    shadowOpacity: 0.8,
    shadowRadius: 12,
  },
  innerGradient: {
    flex: 1,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  innerBorder: {
    width: "100%",
    height: "100%",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.75)",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  letterG: {
    color: "#263C30",
    fontSize: 22,
    fontWeight: "900",
    fontStyle: "italic",
  },
  letterA: {
    color: "#405B48",
    fontSize: 12,
    fontWeight: "900",
    marginLeft: -3,
    marginTop: 12,
  },
  particleOrbit: {
    position: "absolute",
    width: 66,
    height: 66,
    alignItems: "center",
    justifyContent: "center",
  },
  particle: {
    position: "absolute",
    borderRadius: 10,
    backgroundColor: "#FFE8B8",
    shadowColor: "#E6D3AD",
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 7,
  },
  particleOne: {
    width: 4,
    height: 4,
    top: 1,
    left: 30,
  },
  particleTwo: {
    width: 6,
    height: 6,
    right: 0,
    top: 30,
    backgroundColor: "#AFC2A9",
  },
  particleThree: {
    width: 3,
    height: 3,
    bottom: 2,
    left: 28,
    backgroundColor: "#FFFFFF",
  },
  particleFour: {
    width: 5,
    height: 5,
    left: 0,
    top: 28,
    backgroundColor: "#D9C49A",
  },
});