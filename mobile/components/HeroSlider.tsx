import React, { useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  ImageBackground,
  NativeScrollEvent,
  NativeSyntheticEvent,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

const { width } = Dimensions.get("window");

const slides = [
  {
    title: "Your Natural Glow\nStarts Here",
    subtitle: "Discover beauty that feels like you.",
    button: "Explore Services",
    image:
      "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=1000",
  },
  {
    title: "Your Dream Bridal\nLook Awaits",
    subtitle: "Make every moment unforgettable.",
    button: "Explore Bridal Care",
    image:
      "https://images.unsplash.com/photo-1519741497674-611481863552?w=1000",
  },
  {
    title: "Beauty, Made\nPersonal",
    subtitle: "Find your perfect beauty professional.",
    button: "Find Artists",
    image:
      "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=1000",
  },
];

export default function HeroSlider() {
  const [activeIndex, setActiveIndex] = useState(0);
  const listRef = useRef<FlatList>(null);

  const handleScroll = (
    event: NativeSyntheticEvent<NativeScrollEvent>
  ) => {
    const index = Math.round(
      event.nativeEvent.contentOffset.x / width
    );
    setActiveIndex(index);
  };

  return (
    <View style={styles.container}>
      <FlatList
        ref={listRef}
        data={slides}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScroll}
        keyExtractor={(_, index) => String(index)}
        renderItem={({ item }) => (
          <ImageBackground
            source={{ uri: item.image }}
            style={styles.slide}
            imageStyle={styles.image}
          >
            <LinearGradient
              colors={[
                "rgba(20,35,26,0.08)",
                "rgba(20,35,26,0.82)",
              ]}
              style={styles.overlay}
            >
              <View style={styles.content}>
                <Text style={styles.eyebrow}>GLOWAURA EXCLUSIVE</Text>

                <Text style={styles.title}>{item.title}</Text>

                <Text style={styles.subtitle}>{item.subtitle}</Text>

                <TouchableOpacity
                  activeOpacity={0.85}
                  style={styles.button}
                  onPress={() =>
                    listRef.current?.scrollToIndex({
                      index: 0,
                      animated: true,
                    })
                  }
                >
                  <Text style={styles.buttonText}>{item.button}</Text>
                  <Text style={styles.arrow}> →</Text>
                </TouchableOpacity>
              </View>
            </LinearGradient>
          </ImageBackground>
        )}
      />

      <View style={styles.dots}>
        {slides.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              activeIndex === index && styles.activeDot,
            ]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 22,
  },
  slide: {
    width: width - 36,
    height: 245,
    marginHorizontal: 18,
    borderRadius: 24,
    overflow: "hidden",
    justifyContent: "flex-end",
  },
  image: {
    borderRadius: 24,
  },
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
    padding: 22,
  },
  content: {
    alignItems: "flex-start",
  },
  eyebrow: {
    color: "#E6D1A8",
    fontSize: 10,
    letterSpacing: 2,
    fontWeight: "700",
    marginBottom: 12,
  },
  title: {
    color: "#FFFFFF",
    fontSize: 29,
    lineHeight: 35,
    fontFamily: "Georgia",
    fontWeight: "600",
  },
  subtitle: {
    color: "#F4F0E8",
    fontSize: 12,
    marginTop: 9,
  },
  button: {
    backgroundColor: "#F8F4EB",
    paddingVertical: 11,
    paddingHorizontal: 17,
    borderRadius: 30,
    flexDirection: "row",
    marginTop: 17,
  },
  buttonText: {
    color: "#34483A",
    fontSize: 12,
    fontWeight: "700",
  },
  arrow: {
    color: "#34483A",
    fontWeight: "700",
  },
  dots: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 14,
    gap: 7,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 10,
    backgroundColor: "#D9D5CA",
  },
  activeDot: {
    width: 22,
    backgroundColor: "#758A70",
  },
});