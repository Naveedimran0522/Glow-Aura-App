
/* Bismillah-ir-Rahman-ir-Raheem ❤️ */
/* =====================================================
   GLOWAURA — SIGNATURE LUXURY BEAUTY EXPERIENCE
   PREMIUM FOREST GREEN + CHAMPAGNE GOLD
   MONGODB SERVICES + ADVANCED SEARCH + ANIMATED GA LOGO
   MEET THE ARTIST SECTION REMOVED
   ===================================================== */

import React, {
  useState,
  useEffect,
  useMemo,
  useRef,
  useCallback,
} from "react";

import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Modal,
  Pressable,
  StyleSheet,
  StatusBar,
  Keyboard,
  Animated,
  Easing,
  ActivityIndicator,
  RefreshControl,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter, useFocusEffect } from "expo-router";

import HeroSlider from "../../components/HeroSlider";

// =====================================================
// THEME
// =====================================================

const C = {
  forest: "#263C30",
  deep: "#192B22",
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
};

// =====================================================
// API CONFIGURATION
// =====================================================

const RAW_API_URL = String(
  process.env.EXPO_PUBLIC_API_URL || ""
)
  .trim()
  .replace(/\/+$/, "");

const API_BASE_URL = RAW_API_URL
  ? /\/api$/i.test(RAW_API_URL)
    ? RAW_API_URL
    : `${RAW_API_URL}/api`
  : "";

const API_ORIGIN = API_BASE_URL
  ? API_BASE_URL.replace(/\/api$/i, "")
  : "";

// =====================================================
// TYPES
// =====================================================

type BeautyService = {
  _id?: string;
  id?: string;
  serviceId?: string;
  name: string;
  description?: string;
  category: string;
  price?: number | string;
  duration?: number | string;
  image?: string;
  rating?: number | string;
  isActive?: boolean;
};

type Artist = {
  id: string;
  name: string;
  speciality: string;
  rating: string;
  image: string;
};

// =====================================================
// CATEGORY FALLBACK IMAGES
// =====================================================

const CATEGORY_FALLBACKS: Record<string, string> = {
  "Skin Care":
    "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800",

  "Bridal Care":
    "https://images.unsplash.com/photo-1519741497674-611481863552?w=800",

  "Mehndi Care":
    "https://images.unsplash.com/photo-1605497788044-5a32c7078486?w=800",

  Other:
    "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800",
};

// =====================================================
// CATEGORY NORMALIZATION
// =====================================================

const normalizeCategory = (value?: string) => {
  const category = String(value || "")
    .trim()
    .toLowerCase();

  if (
    category.includes("skin") ||
    category.includes("facial") ||
    category.includes("skincare")
  ) {
    return "Skin Care";
  }

  if (
    category.includes("bridal") ||
    category.includes("bride") ||
    category.includes("wedding") ||
    category.includes("makeup")
  ) {
    return "Bridal Care";
  }

  if (
    category.includes("mehndi") ||
    category.includes("henna")
  ) {
    return "Mehndi Care";
  }

  return "Other";
};

// =====================================================
// IMAGE HELPER
// =====================================================

const getServiceImage = (
  image?: string,
  category?: string
) => {
  const value = String(image || "").trim();

  if (!value) {
    return (
      CATEGORY_FALLBACKS[normalizeCategory(category)] ||
      CATEGORY_FALLBACKS.Other
    );
  }

  if (/^https?:\/\//i.test(value)) {
    return value;
  }

  if (!API_ORIGIN) {
    return (
      CATEGORY_FALLBACKS[normalizeCategory(category)] ||
      CATEGORY_FALLBACKS.Other
    );
  }

  return value.startsWith("/")
    ? `${API_ORIGIN}${value}`
    : `${API_ORIGIN}/${value}`;
};

// =====================================================
// PRICE FORMAT
// =====================================================

const formatPrice = (price?: number | string) => {
  if (
    price === undefined ||
    price === null ||
    price === ""
  ) {
    return "Price on request";
  }

  const amount = Number(price);

  if (!Number.isFinite(amount)) {
    return "Price on request";
  }

  return `₹${amount.toLocaleString("en-IN")}`;
};

// =====================================================
// DURATION FORMAT
// =====================================================

const formatDuration = (
  duration?: number | string
) => {
  if (
    duration === undefined ||
    duration === null ||
    duration === ""
  ) {
    return "Duration varies";
  }

  const value = String(duration).trim();

  if (/[a-z]/i.test(value)) {
    return value;
  }

  const minutes = Number(duration);

  if (!Number.isFinite(minutes) || minutes <= 0) {
    return "Duration varies";
  }

  if (minutes >= 60 && minutes % 60 === 0) {
    const hours = minutes / 60;

    return `${hours} hr${hours > 1 ? "s" : ""}`;
  }

  if (minutes > 60) {
    return `${Math.floor(minutes / 60)} hr ${minutes % 60} min`;
  }

  return `${minutes} min`;
};

// =====================================================
// EXTRACT SERVICES FROM API RESPONSE
// =====================================================

const extractServices = (
  response: any
): BeautyService[] => {
  const possibleArrays = [
    response,
    response?.services,
    response?.data,
    response?.data?.services,
    response?.data?.data,
    response?.data?.data?.services,
    response?.results,
  ];

  const result = possibleArrays.find(
    Array.isArray
  );

  if (!result) {
    return [];
  }

  return result
    .filter(
      (service: any) =>
        service &&
        typeof service === "object"
    )
    .filter(
      (service: any) =>
        service.isActive !== false
    )
    .map((service: any) => ({
      ...service,
      name: String(
        service.name ||
          service.title ||
          "Beauty Service"
      ),
      category: normalizeCategory(
        service.category ||
          service.serviceCategory ||
          service.type
      ),
    }));
};

// =====================================================
// ANIMATED GA LOGO
// =====================================================

const PARTICLE_POSITIONS = [
  { x: 5, y: 20, delay: 0 },
  { x: 85, y: 10, delay: 250 },
  { x: 95, y: 55, delay: 500 },
  { x: 75, y: 92, delay: 750 },
  { x: 15, y: 90, delay: 1000 },
  { x: 0, y: 55, delay: 1250 },
  { x: 50, y: 0, delay: 1500 },
  { x: 45, y: 100, delay: 1750 },
];

function AnimatedGALogo({
  size = 42,
}: {
  size?: number;
}) {
  const rotation = useRef(
    new Animated.Value(0)
  ).current;

  const pulse = useRef(
    new Animated.Value(0)
  ).current;

  const particles = useRef(
    PARTICLE_POSITIONS.map(
      () => new Animated.Value(0)
    )
  ).current;

  useEffect(() => {
    const orbit = Animated.loop(
      Animated.timing(rotation, {
        toValue: 1,
        duration: 12000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );

    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1,
          duration: 1800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 0,
          duration: 1800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );

    const particleAnimations =
      particles.map((particle, index) =>
        Animated.loop(
          Animated.sequence([
            Animated.delay(
              PARTICLE_POSITIONS[index].delay
            ),
            Animated.timing(particle, {
              toValue: 1,
              duration: 1200,
              easing: Easing.inOut(Easing.ease),
              useNativeDriver: true,
            }),
            Animated.timing(particle, {
              toValue: 0,
              duration: 1200,
              easing: Easing.inOut(Easing.ease),
              useNativeDriver: true,
            }),
          ])
        )
      );

    orbit.start();
    pulseAnimation.start();

    particleAnimations.forEach((animation) =>
      animation.start()
    );

    return () => {
      orbit.stop();
      pulseAnimation.stop();

      particleAnimations.forEach((animation) =>
        animation.stop()
      );
    };
  }, [rotation, pulse, particles]);

  const rotate = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  const glowScale = pulse.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.07],
  });

  return (
    <View
      style={{
        width: size + 28,
        height: size + 28,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {PARTICLE_POSITIONS.map(
        (particle, index) => (
          <Animated.View
            key={index}
            pointerEvents="none"
            style={{
              position: "absolute",
              left:
                ((size + 28) * particle.x) / 100,
              top:
                ((size + 28) * particle.y) / 100,
              width: index % 3 === 0 ? 5 : 3,
              height: index % 3 === 0 ? 5 : 3,
              borderRadius: 5,
              backgroundColor: C.gold,
              opacity: particles[index].interpolate({
                inputRange: [0, 1],
                outputRange: [0.15, 1],
              }),
              transform: [
                {
                  scale: particles[index].interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.5, 1.8],
                  }),
                },
              ],
            }}
          />
        )
      )}

      <Animated.View
        style={{
          position: "absolute",
          width: size + 15,
          height: size + 15,
          borderRadius: (size + 15) / 2,
          borderWidth: 1,
          borderColor: C.gold,
          borderStyle: "dashed",
          transform: [{ rotate }],
        }}
      />

      <Animated.View
        style={{
          width: size,
          height: size,
          borderRadius: size / 2,
          transform: [{ scale: glowScale }],
          elevation: 9,
        }}
      >
        <LinearGradient
          colors={[
            "#526D55",
            "#263C30",
            "#14251C",
          ]}
          style={{
            flex: 1,
            borderRadius: size / 2,
            borderWidth: 1.5,
            borderColor: C.champagne,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text
            style={{
              color: C.champagne,
              fontFamily: "Georgia",
              fontSize: size * 0.44,
              fontWeight: "700",
              letterSpacing: -3,
            }}
          >
            GA
          </Text>

          <Text
            style={{
              position: "absolute",
              right: size * 0.12,
              top: size * 0.08,
              fontSize: size * 0.16,
              color: C.champagne,
            }}
          >
            ✦
          </Text>
        </LinearGradient>
      </Animated.View>
    </View>
  );
}

// =====================================================
// CATEGORIES
// =====================================================

const categories = [
  {
    name: "Skin Care",
    subtitle: "Radiance & renewal",
    symbol: "✧",
    keywords:
      "skin facial skincare hydra glow treatment",
  },
  {
    name: "Bridal Care",
    subtitle: "Your royal moment",
    symbol: "♕",
    keywords:
      "bridal bride wedding makeup engagement",
  },
  {
    name: "Mehndi Care",
    subtitle: "Tradition in art",
    symbol: "❀",
    keywords:
      "mehndi henna arabic bridal traditional",
  },
];

// =====================================================
// ARTISTS
// Kept for advanced search only.
// No artist collection is rendered on Home.
// =====================================================

const artists: Artist[] = [
  {
    id: "1",
    name: "Ayesha Khan",
    speciality: "Bridal Makeup Artist",
    rating: "4.9",
    image:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=500",
  },
  {
    id: "2",
    name: "Sara Malik",
    speciality: "Skin Care Expert",
    rating: "4.8",
    image:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500",
  },
  {
    id: "3",
    name: "Meera Artistry",
    speciality: "Professional Mehndi Artist",
    rating: "4.9",
    image:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=500",
  },
  {
    id: "4",
    name: "Zara Beauty",
    speciality: "Professional Makeup",
    rating: "4.8",
    image:
      "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=500",
  },
  {
    id: "5",
    name: "Hina Siddiqui",
    speciality: "Hair & Makeup Expert",
    rating: "4.9",
    image:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=500",
  },
  {
    id: "6",
    name: "Noor Jahan",
    speciality: "Luxury Bridal Artist",
    rating: "5.0",
    image:
      "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=500",
  },
  {
    id: "7",
    name: "Mehak Fatima",
    speciality: "Skin Specialist",
    rating: "4.8",
    image:
      "https://images.unsplash.com/photo-1524250502761-1ac6f2e30d43?w=500",
  },
  {
    id: "8",
    name: "Maryam Khan",
    speciality: "Facial Expert",
    rating: "4.7",
    image:
      "https://images.unsplash.com/photo-1517841905240-472988bab9df?w=500",
  },
  {
    id: "9",
    name: "Saba Parveen",
    speciality: "Beauty Therapist",
    rating: "4.9",
    image:
      "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=500",
  },
  {
    id: "10",
    name: "Neha Mishra",
    speciality: "Spa & Skin Care",
    rating: "4.8",
    image:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500",
  },
  {
    id: "11",
    name: "Ananya Reddy",
    speciality: "Skin Care Specialist",
    rating: "4.9",
    image:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=500",
  },
  {
    id: "12",
    name: "Pooja Verma",
    speciality: "Herbal Beauty Expert",
    rating: "4.7",
    image:
      "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=500",
  },
];

// =====================================================
// SERVICE CARD
// =====================================================

function HomeServiceCard({
  service,
  onPress,
}: {
  service: BeautyService;
  onPress: () => void;
}) {
  const [imageFailed, setImageFailed] =
    useState(false);

  const imageSource = imageFailed
    ? CATEGORY_FALLBACKS[
        normalizeCategory(service.category)
      ] || CATEGORY_FALLBACKS.Other
    : getServiceImage(
        service.image,
        service.category
      );

  return (
    <TouchableOpacity
      style={styles.serviceCard}
      activeOpacity={0.88}
      onPress={onPress}
    >
      <View style={styles.serviceImageWrap}>
        <Image
          source={{ uri: imageSource }}
          style={styles.serviceImage}
          resizeMode="cover"
          onError={() => setImageFailed(true)}
        />

        <View style={styles.serviceImageShade} />

        <View style={styles.serviceCategoryBadge}>
          <Text style={styles.serviceCategoryBadgeText}>
            {normalizeCategory(
              service.category
            ).toUpperCase()}
          </Text>
        </View>

        <View style={styles.serviceImageStar}>
          <Text style={styles.serviceImageStarText}>
            ✦
          </Text>
        </View>
      </View>

      <View style={styles.serviceCardContent}>
        <Text
          style={styles.serviceName}
          numberOfLines={2}
        >
          {service.name}
        </Text>

        <Text
          style={styles.serviceDescription}
          numberOfLines={2}
        >
          {service.description ||
            "A beautiful experience, curated for you."}
        </Text>

        <View style={styles.serviceMetaRow}>
          <Text style={styles.serviceDuration}>
            ◷ {formatDuration(service.duration)}
          </Text>

          <Text style={styles.servicePrice}>
            {formatPrice(service.price)}
          </Text>
        </View>

        <View style={styles.serviceCardFooter}>
          <Text style={styles.serviceExploreText}>
            EXPLORE SERVICE
          </Text>

          <Text style={styles.serviceExploreArrow}>
            ↗
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

// =====================================================
// HOME SCREEN
// =====================================================

export default function HomeScreen() {
  const router = useRouter();

  const [menuVisible, setMenuVisible] =
    useState(false);

  const [search, setSearch] = useState("");

  const [searchFocused, setSearchFocused] =
    useState(false);

  const [services, setServices] =
    useState<BeautyService[]>([]);

  const [servicesLoading, setServicesLoading] =
    useState(true);

  const [servicesRefreshing, setServicesRefreshing] =
    useState(false);

  const [servicesError, setServicesError] =
    useState("");

  const query = search.trim().toLowerCase();

  // ===================================================
  // FETCH MONGODB SERVICES
  // ===================================================

  const loadServices = useCallback(
    async (isRefresh = false) => {
      if (!API_BASE_URL) {
        setServicesError(
          "API URL missing. Check EXPO_PUBLIC_API_URL in mobile .env."
        );

        setServicesLoading(false);
        setServicesRefreshing(false);
        return;
      }

      if (isRefresh) {
        setServicesRefreshing(true);
      } else {
        setServicesLoading(true);
      }

      setServicesError("");

      try {
        const response = await fetch(
          `${API_BASE_URL}/services?limit=100&page=1`,
          {
            method: "GET",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
          }
        );

        const responseText =
          await response.text();

        let responseData: any = {};

        try {
          responseData = responseText
            ? JSON.parse(responseText)
            : {};
        } catch {
          throw new Error(
            "Server returned an invalid response."
          );
        }

        if (!response.ok) {
          throw new Error(
            responseData?.message ||
              responseData?.error ||
              `Unable to load services (${response.status}).`
          );
        }

        const serviceList =
          extractServices(responseData);

        setServices(serviceList);

        if (serviceList.length === 0) {
          setServicesError(
            "No active services found. Please check your services database."
          );
        }
      } catch (error: any) {
        console.log(
          "GlowAura Home Services Error:",
          error?.message || error
        );

        setServicesError(
          error?.message ||
            "Unable to connect to GlowAura services. Please try again."
        );
      } finally {
        setServicesLoading(false);
        setServicesRefreshing(false);
      }
    },
    []
  );

  // Load whenever Home receives focus.
  // Only one automatic fetch is used to avoid duplicate requests.

  useFocusEffect(
    useCallback(() => {
      loadServices();
    }, [loadServices])
  );

  // ===================================================
  // NAVIGATION
  // ===================================================

  const openServices = (value?: string) => {
    Keyboard.dismiss();
    setSearchFocused(false);

    const searchValue = value?.trim();

    if (searchValue) {
      router.push({
        pathname: "/(tabs)/services",
        params: {
          search: searchValue,
        },
      } as any);
    } else {
      router.push("/(tabs)/services");
    }
  };

  const openServiceDetail = (
    service: BeautyService
  ) => {
    Keyboard.dismiss();
    setSearchFocused(false);

    const serviceId =
      service.serviceId ||
      service._id ||
      service.id;

    if (!serviceId) {
      openServices(service.name);
      return;
    }

    router.push({
      pathname: "/service/[id]",
      params: {
        id: String(serviceId),
      },
    } as any);
  };

  const openNotifications = () => {
    router.push("/notification-test" as any);
  };

  const openAssistant = () => {
    router.push("/(tabs)/assistant");
  };

  const openArtistProfile = (
    artist: Artist
  ) => {
    Keyboard.dismiss();
    setSearchFocused(false);

    router.push({
      pathname: "/artist-profile",
      params: {
        id: artist.id,
        name: artist.name,
      },
    } as any);
  };

  const menuItems = [
    {
      label: "Home",
      route: "/(tabs)",
    },
    {
      label: "Explore Services",
      route: "/(tabs)/services",
    },
    {
      label: "My Bookings",
      route: "/(tabs)/bookings",
    },
    {
      label: "AI Beauty Assistant",
      route: "/(tabs)/assistant",
    },
    {
      label: "My Profile",
      route: "/(tabs)/profile",
    },
  ];

  // ===================================================
  // CATEGORY FILTERS
  // ===================================================

  const skinServices = useMemo(
    () =>
      services.filter(
        (item) =>
          item.category === "Skin Care"
      ),
    [services]
  );

  const bridalServices = useMemo(
    () =>
      services.filter(
        (item) =>
          item.category === "Bridal Care"
      ),
    [services]
  );

  const mehndiServices = useMemo(
    () =>
      services.filter(
        (item) =>
          item.category === "Mehndi Care"
      ),
    [services]
  );

  // ===================================================
  // ADVANCED SEARCH
  // ===================================================

  const filteredArtists = useMemo(() => {
    if (!query) return [];

    return artists.filter((artist) =>
      `${artist.name} ${artist.speciality}`
        .toLowerCase()
        .includes(query)
    );
  }, [query]);

  const filteredCategories = useMemo(() => {
    if (!query) return [];

    return categories.filter((category) =>
      `${category.name} ${category.subtitle} ${category.keywords}`
        .toLowerCase()
        .includes(query)
    );
  }, [query]);

  const filteredServices = useMemo(() => {
    if (!query) return [];

    return services.filter((service) =>
      [
        service.name,
        service.serviceId,
        service.description,
        service.category,
        service.duration,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(query)
    );
  }, [query, services]);

  const totalSearchResults =
    filteredArtists.length +
    filteredCategories.length +
    filteredServices.length;

  const hasSearchResults =
    totalSearchResults > 0;

  const searchSuggestionsVisible =
    searchFocused && query.length > 0;

  const selectSearchResult = (
    value: string
  ) => {
    setSearch(value);
    Keyboard.dismiss();
    setSearchFocused(false);
    openServices(value);
  };

  // ===================================================
  // RENDER
  // ===================================================

  return (
    <SafeAreaView
      style={styles.screen}
      edges={["top"]}
    >
      <StatusBar
        barStyle="dark-content"
        backgroundColor={C.ivory}
        translucent={false}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={servicesRefreshing}
            onRefresh={() => loadServices(true)}
            tintColor={C.gold}
            colors={[C.forest]}
          />
        }
      >

        {/* HEADER */}

        <View style={styles.header}>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => setMenuVisible(true)}
            activeOpacity={0.8}
          >
            <Text style={styles.menuIcon}>
              ☰
            </Text>
          </TouchableOpacity>

          <View style={styles.brand}>
            <AnimatedGALogo size={38} />

            <Text style={styles.brandName}>
              GLOWAURA
            </Text>

            <Text style={styles.brandTagline}>
              THE ART OF BEAUTY
            </Text>
          </View>

          <TouchableOpacity
            style={styles.headerButton}
            onPress={openNotifications}
            activeOpacity={0.8}
          >
            <Text style={styles.notificationIcon}>
              ♧
            </Text>

            <View style={styles.notificationDot} />
          </TouchableOpacity>
        </View>

        {/* HERO INTRO */}

        <View style={styles.hero}>
          <View style={styles.heroTopRow}>
            <View style={styles.heroLine} />

            <Text style={styles.heroEyebrow}>
              THE GLOWAURA EXPERIENCE
            </Text>

            <View style={styles.heroLine} />
          </View>

          <Text style={styles.heroTitle}>
            Beauty is an art.
          </Text>

          <Text style={styles.heroItalic}>
            Make yourself the masterpiece.
          </Text>

          <Text style={styles.heroDescription}>
            Discover exceptional beauty experiences,
            curated around you.
          </Text>

          <View style={styles.heroSeal}>
            <Text style={styles.heroSealText}>
              GA
            </Text>

            <Text style={styles.heroSealSmall}>
              EST. BEAUTY
            </Text>
          </View>
        </View>

        {/* ADVANCED SEARCH */}

        <View style={styles.searchSection}>
          <View
            style={[
              styles.searchBox,
              searchFocused &&
                styles.searchBoxActive,
            ]}
          >
            <Text style={styles.searchIcon}>
              ⌕
            </Text>

            <TextInput
              value={search}
              onChangeText={setSearch}
              placeholder="Artists, skincare, mehndi, services..."
              placeholderTextColor="#A39F93"
              style={styles.searchInput}
              returnKeyType="search"
              onFocus={() =>
                setSearchFocused(true)
              }
              onSubmitEditing={() =>
                openServices(search)
              }
              autoCorrect={false}
            />

            {search.length > 0 && (
              <TouchableOpacity
                style={styles.clearSearch}
                onPress={() => setSearch("")}
              >
                <Text style={styles.clearSearchText}>
                  ×
                </Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={styles.searchButton}
              onPress={() => openServices(search)}
            >
              <Text style={styles.searchButtonText}>
                SEARCH
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.searchHintRow}>
            <Text style={styles.searchHintLabel}>
              TRENDING:
            </Text>

            {[
              "Bridal",
              "Facial",
              "Mehndi",
            ].map((item) => (
              <TouchableOpacity
                key={item}
                onPress={() => {
                  setSearch(item);
                  setSearchFocused(true);
                }}
              >
                <Text style={styles.searchHint}>
                  {item}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {searchSuggestionsVisible && (
            <View style={styles.searchResults}>
              <View style={styles.searchResultsHeader}>
                <Text style={styles.searchResultsTitle}>
                  SEARCH RESULTS
                </Text>

                <Text style={styles.searchResultsCount}>
                  {totalSearchResults} MATCHES
                </Text>
              </View>

              {!hasSearchResults && (
                <View style={styles.noSearchResults}>
                  <Text style={styles.noSearchTitle}>
                    No matches found
                  </Text>

                  <Text style={styles.noSearchSubtitle}>
                    Try artist names, skin care,
                    bridal or mehndi.
                  </Text>
                </View>
              )}

              {/* ARTIST SEARCH RESULTS */}

              {filteredArtists
                .slice(0, 4)
                .map((artist) => (
                  <TouchableOpacity
                    key={artist.id}
                    style={styles.searchResultItem}
                    onPress={() =>
                      openArtistProfile(artist)
                    }
                  >
                    <Image
                      source={{
                        uri: artist.image,
                      }}
                      style={styles.searchAvatar}
                    />

                    <View style={styles.searchResultInfo}>
                      <Text style={styles.searchResultName}>
                        {artist.name}
                      </Text>

                      <Text style={styles.searchResultSub}>
                        {artist.speciality}
                      </Text>
                    </View>

                    <Text style={styles.searchResultArrow}>
                      ›
                    </Text>
                  </TouchableOpacity>
                ))}

              {/* CATEGORY SEARCH RESULTS */}

              {filteredCategories.map(
                (category) => (
                  <TouchableOpacity
                    key={category.name}
                    style={styles.searchResultItem}
                    onPress={() =>
                      selectSearchResult(
                        category.name
                      )
                    }
                  >
                    <View style={styles.searchCategoryIcon}>
                      <Text style={styles.searchCategorySymbol}>
                        {category.symbol}
                      </Text>
                    </View>

                    <View style={styles.searchResultInfo}>
                      <Text style={styles.searchResultName}>
                        {category.name}
                      </Text>

                      <Text style={styles.searchResultSub}>
                        {category.subtitle}
                      </Text>
                    </View>

                    <Text style={styles.searchResultArrow}>
                      ›
                    </Text>
                  </TouchableOpacity>
                )
              )}

              {/* DATABASE SERVICE SEARCH RESULTS */}

              {filteredServices
                .slice(0, 5)
                .map((service) => (
                  <TouchableOpacity
                    key={
                      service._id ||
                      service.serviceId ||
                      service.name
                    }
                    style={styles.searchResultItem}
                    onPress={() =>
                      openServiceDetail(service)
                    }
                  >
                    <Image
                      source={{
                        uri: getServiceImage(
                          service.image,
                          service.category
                        ),
                      }}
                      style={styles.searchAvatar}
                    />

                    <View style={styles.searchResultInfo}>
                      <Text style={styles.searchResultName}>
                        {service.name}
                      </Text>

                      <Text style={styles.searchResultSub}>
                        {service.category} •{" "}
                        {formatPrice(service.price)}
                      </Text>
                    </View>

                    <Text style={styles.searchResultArrow}>
                      ›
                    </Text>
                  </TouchableOpacity>
                ))}

              <TouchableOpacity
                style={styles.allResultsButton}
                onPress={() =>
                  openServices(search)
                }
              >
                <Text style={styles.allResultsText}>
                  VIEW ALL RESULTS →
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* HERO SLIDER */}

        <View style={styles.sliderWrap}>
          <HeroSlider />
        </View>

        {/* CATEGORIES */}

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.sectionEyebrow}>
                CURATED FOR YOUR BEAUTY
              </Text>

              <Text style={styles.sectionTitle}>
                Explore Collections
              </Text>
            </View>

            <TouchableOpacity
              onPress={() => openServices()}
            >
              <Text style={styles.viewAll}>
                VIEW ALL ↗
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.categoryRow}>
            {categories.map((item, index) => (
              <TouchableOpacity
                key={item.name}
                style={styles.categoryCard}
                activeOpacity={0.88}
                onPress={() =>
                  openServices(item.name)
                }
              >
                <View style={styles.categoryTop}>
                  <Text style={styles.categoryNumber}>
                    0{index + 1}
                  </Text>

                  <Text style={styles.categorySymbol}>
                    {item.symbol}
                  </Text>
                </View>

                <View style={styles.categoryBottom}>
                  <Text style={styles.categoryName}>
                    {item.name}
                  </Text>

                  <Text style={styles.categoryDescription}>
                    {item.subtitle}
                  </Text>

                  <View style={styles.categoryArrowCircle}>
                    <Text style={styles.categoryArrow}>
                      ↗
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* MONGODB DATABASE SERVICES */}

        <View style={styles.databaseSection}>
          <View style={styles.databaseHeading}>
            <View style={styles.databaseHeadingText}>
              <Text style={styles.sectionEyebrow}>
                THE GLOWAURA EDIT
              </Text>

              <Text style={styles.sectionTitle}>
                Signature Services
              </Text>

              <Text style={styles.databaseSubtitle}>
                Discover your next beauty experience.
              </Text>
            </View>

            <TouchableOpacity
              onPress={() => openServices()}
              style={styles.databaseViewAll}
            >
              <Text style={styles.viewAll}>
                VIEW ALL ↗
              </Text>
            </TouchableOpacity>
          </View>

          {/* DATABASE STATISTICS */}

          <View style={styles.databaseStats}>
            {[
              {
                value: services.length,
                label: "SERVICES",
              },
              {
                value: skinServices.length,
                label: "SKIN CARE",
              },
              {
                value: bridalServices.length,
                label: "BRIDAL",
              },
              {
                value: mehndiServices.length,
                label: "MEHNDI",
              },
            ].map((item, index) => (
              <React.Fragment key={item.label}>
                {index > 0 && (
                  <View
                    style={styles.databaseStatDivider}
                  />
                )}

                <View style={styles.databaseStat}>
                  <Text style={styles.databaseStatNumber}>
                    {item.value}
                  </Text>

                  <Text style={styles.databaseStatLabel}>
                    {item.label}
                  </Text>
                </View>
              </React.Fragment>
            ))}
          </View>

          {/* LOADING */}

          {servicesLoading &&
          services.length === 0 ? (
            <View style={styles.servicesLoading}>
              <ActivityIndicator
                size="large"
                color={C.gold}
              />

              <Text style={styles.servicesLoadingText}>
                Curating your beauty collection...
              </Text>
            </View>
          ) : services.length === 0 ? (
            /* EMPTY STATE */

            <View style={styles.servicesEmpty}>
              <Text style={styles.servicesEmptyIcon}>
                ✧
              </Text>

              <Text style={styles.servicesEmptyTitle}>
                Services are getting ready
              </Text>

              <Text style={styles.servicesEmptyText}>
                {servicesError ||
                  "Please refresh to discover our beauty collection."}
              </Text>

              <TouchableOpacity
                style={styles.retryButton}
                onPress={() => loadServices()}
              >
                <Text style={styles.retryButtonText}>
                  TRY AGAIN
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            /* SERVICE CATEGORY LISTS */

            <>
              {[
                {
                  title: "Skin Care",
                  subtitle: "Radiance & renewal",
                  symbol: "✧",
                  data: skinServices,
                },
                {
                  title: "Bridal Care",
                  subtitle: "Your royal moment",
                  symbol: "♕",
                  data: bridalServices,
                },
                {
                  title: "Mehndi Care",
                  subtitle: "Tradition in art",
                  symbol: "❀",
                  data: mehndiServices,
                },
              ].map((category) =>
                category.data.length > 0 ? (
                  <View
                    key={category.title}
                    style={styles.databaseCategory}
                  >
                    <View
                      style={styles.databaseCategoryHeader}
                    >
                      <View
                        style={styles.databaseCategoryTitleWrap}
                      >
                        <Text
                          style={styles.databaseCategorySymbol}
                        >
                          {category.symbol}
                        </Text>

                        <View>
                          <Text
                            style={styles.databaseCategoryTitle}
                          >
                            {category.title}
                          </Text>

                          <Text
                            style={styles.databaseCategorySub}
                          >
                            {category.subtitle}
                          </Text>
                        </View>
                      </View>

                      <TouchableOpacity
                        onPress={() =>
                          openServices(category.title)
                        }
                      >
                        <Text style={styles.viewAll}>
                          SEE ALL ↗
                        </Text>
                      </TouchableOpacity>
                    </View>

                    <ScrollView
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      contentContainerStyle={
                        styles.serviceHorizontalList
                      }
                    >
                      {category.data.map(
                        (service) => (
                          <HomeServiceCard
                            key={
                              service._id ||
                              service.serviceId ||
                              service.name
                            }
                            service={service}
                            onPress={() =>
                              openServiceDetail(service)
                            }
                          />
                        )
                      )}
                    </ScrollView>
                  </View>
                ) : null
              )}

              {servicesError !== "" && (
                <Text style={styles.servicesRefreshHint}>
                  {servicesError}
                </Text>
              )}
            </>
          )}
        </View>

        {/* LUXURY OFFER */}

        <View style={styles.offerWrap}>
          <LinearGradient
            colors={[
              "#415B49",
              "#293E31",
              "#192B22",
            ]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.offerCard}
          >
            <View style={styles.offerOutline} />

            <View style={styles.offerContent}>
              <Text style={styles.offerEyebrow}>
                THE SIGNATURE COLLECTION
              </Text>

              <Text style={styles.offerTitle}>
                A little luxury.
              </Text>

              <Text style={styles.offerItalic}>
                A lifetime of confidence.
              </Text>

              <Text style={styles.offerDescription}>
                Discover extraordinary treatments
                and personalized beauty experiences.
              </Text>

              <TouchableOpacity
                style={styles.offerButton}
                onPress={() => openServices()}
              >
                <Text style={styles.offerButtonText}>
                  EXPLORE COLLECTION
                </Text>

                <Text style={styles.offerButtonArrow}>
                  ↗
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.offerEmblem}>
              <Text style={styles.offerEmblemGA}>
                GA
              </Text>

              <View style={styles.offerEmblemLine} />

              <Text style={styles.offerEmblemText}>
                LUXURY
              </Text>
            </View>

            <Text style={styles.offerDecoration}>
              ✧
            </Text>
          </LinearGradient>
        </View>

        {/* AI BEAUTY ASSISTANT */}

        <TouchableOpacity
          activeOpacity={0.9}
          style={styles.aiCard}
          onPress={openAssistant}
        >
          <LinearGradient
            colors={["#344D3C", "#1D3025"]}
            style={styles.aiGradient}
          >
            <View style={styles.aiIcon}>
              <Text style={styles.aiIconText}>
                ✧
              </Text>
            </View>

            <View style={styles.aiContent}>
              <Text style={styles.aiEyebrow}>
                YOUR PERSONAL BEAUTY CONCIERGE
              </Text>

              <Text style={styles.aiTitle}>
                Meet GlowAura AI
              </Text>

              <Text style={styles.aiDescription}>
                Your beauty questions deserve
                a personalized answer.
              </Text>
            </View>

            <View style={styles.aiArrowCircle}>
              <Text style={styles.aiArrow}>
                ↗
              </Text>
            </View>
          </LinearGradient>
        </TouchableOpacity>

        {/* TRUST SECTION */}

        <View style={styles.trustSection}>
          {[
            {
              icon: "✧",
              title: "EXCELLENCE",
              subtitle: "Premium care",
            },
            {
              icon: "♕",
              title: "EXPERTISE",
              subtitle: "Skilled artists",
            },
            {
              icon: "♡",
              title: "EXPERIENCE",
              subtitle: "Easy booking",
            },
          ].map((item, index) => (
            <React.Fragment key={item.title}>
              {index > 0 && (
                <View style={styles.trustDivider} />
              )}

              <View style={styles.trustItem}>
                <Text style={styles.trustIcon}>
                  {item.icon}
                </Text>

                <Text style={styles.trustTitle}>
                  {item.title}
                </Text>

                <Text style={styles.trustSubtitle}>
                  {item.subtitle}
                </Text>
              </View>
            </React.Fragment>
          ))}
        </View>

        {/* FOOTER */}

        <View style={styles.footer}>
          <View style={styles.footerLogoAnimated}>
            <AnimatedGALogo size={43} />
          </View>

          <Text style={styles.footerBrand}>
            GLOWAURA
          </Text>

          <Text style={styles.footerTagline}>
            THE ART OF BEAUTY
          </Text>

          <View style={styles.footerLine} />

          <Text style={styles.footerText}>
            Where beauty meets elegance.
          </Text>

          <Text style={styles.footerCopyright}>
            © GLOWAURA • BEAUTY • SKINCARE • MEHNDI
          </Text>
        </View>
      </ScrollView>

      {/* SIDEBAR */}

      <Modal
        visible={menuVisible}
        transparent
        animationType="fade"
        onRequestClose={() =>
          setMenuVisible(false)
        }
      >
        <View style={styles.modalContainer}>
          <Pressable
            style={styles.modalBackdrop}
            onPress={() =>
              setMenuVisible(false)
            }
          />

          <View style={styles.sidebar}>
            <LinearGradient
              colors={["#304A39", "#192B22"]}
              style={styles.sidebarHeader}
            >
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() =>
                  setMenuVisible(false)
                }
              >
                <Text style={styles.closeText}>
                  ×
                </Text>
              </TouchableOpacity>

              <AnimatedGALogo size={58} />

              <Text style={styles.sidebarBrand}>
                GLOWAURA
              </Text>

              <Text style={styles.sidebarTagline}>
                THE ART OF BEAUTY
              </Text>

              <View style={styles.sidebarGoldLine} />
            </LinearGradient>

            <Text style={styles.sidebarCaption}>
              YOUR BEAUTY DESTINATION
            </Text>

            {menuItems.map((item, index) => (
              <TouchableOpacity
                key={item.label}
                style={styles.menuItem}
                activeOpacity={0.75}
                onPress={() => {
                  setMenuVisible(false);
                  router.push(item.route as any);
                }}
              >
                <View style={styles.menuItemLeft}>
                  <Text style={styles.menuNumber}>
                    0{index + 1}
                  </Text>

                  <Text style={styles.menuItemText}>
                    {item.label}
                  </Text>
                </View>

                <Text style={styles.menuArrow}>
                  ↗
                </Text>
              </TouchableOpacity>
            ))}

            <View style={styles.sidebarBottom}>
              <Text style={styles.sidebarBottomSymbol}>
                ✧
              </Text>

              <Text style={styles.sidebarBottomText}>
                Beauty begins with you.
              </Text>

              <Text style={styles.sidebarCopyright}>
                GLOWAURA • PREMIUM BEAUTY
              </Text>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

// =====================================================
// COMPLETE STYLES
// =====================================================

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: C.ivory,
  },

  scrollContent: {
    paddingBottom: 35,
  },

  // HEADER

  header: {
    paddingHorizontal: 19,
    paddingTop: 13,
    paddingBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  headerButton: {
    width: 43,
    height: 43,
    borderRadius: 15,
    backgroundColor: C.white,
    borderWidth: 1,
    borderColor: C.border,
    alignItems: "center",
    justifyContent: "center",
    elevation: 2,
  },

  menuIcon: {
    color: C.forest,
    fontSize: 21,
  },

  notificationIcon: {
    color: C.forest,
    fontSize: 22,
  },

  notificationDot: {
    position: "absolute",
    right: 9,
    top: 8,
    width: 8,
    height: 8,
    borderRadius: 5,
    backgroundColor: "#B97960",
    borderWidth: 1,
    borderColor: C.white,
  },

  brand: {
    alignItems: "center",
  },

  brandName: {
    color: C.forest,
    fontFamily: "Georgia",
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: 3.2,
  },

  brandTagline: {
    color: C.gold,
    fontSize: 7,
    fontWeight: "800",
    letterSpacing: 2,
    marginTop: 3,
  },

  // HERO

  hero: {
    marginTop: 25,
    paddingHorizontal: 23,
    alignItems: "center",
    position: "relative",
    paddingBottom: 12,
  },

  heroTopRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
  },

  heroLine: {
    width: 24,
    height: 1,
    backgroundColor: C.gold,
  },

  heroEyebrow: {
    color: C.gold,
    fontSize: 9,
    letterSpacing: 2,
    fontWeight: "800",
  },

  heroTitle: {
    color: C.forest,
    fontSize: 35,
    fontFamily: "Georgia",
    marginTop: 16,
    textAlign: "center",
  },

  heroItalic: {
    color: C.sage,
    fontFamily: "Georgia",
    fontStyle: "italic",
    fontSize: 21,
    marginTop: 3,
    textAlign: "center",
  },

  heroDescription: {
    color: C.muted,
    fontSize: 11,
    marginTop: 12,
    lineHeight: 18,
    textAlign: "center",
    maxWidth: 270,
  },

  heroSeal: {
    position: "absolute",
    right: 12,
    top: 45,
    width: 48,
    height: 48,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: "#E7DDC9",
    alignItems: "center",
    justifyContent: "center",
    opacity: 0.7,
  },

  heroSealText: {
    color: C.gold,
    fontFamily: "Georgia",
    fontSize: 16,
  },

  heroSealSmall: {
    color: C.gold,
    fontSize: 5,
    letterSpacing: 1,
  },

  // SEARCH

  searchSection: {
    marginHorizontal: 17,
    marginTop: 19,
    zIndex: 10,
  },

  searchBox: {
    minHeight: 57,
    paddingHorizontal: 13,
    backgroundColor: C.white,
    borderRadius: 17,
    borderWidth: 1,
    borderColor: C.border,
    flexDirection: "row",
    alignItems: "center",
    elevation: 3,
    shadowColor: C.forest,
    shadowOpacity: 0.06,
    shadowRadius: 9,
    shadowOffset: {
      width: 0,
      height: 3,
    },
  },

  searchBoxActive: {
    borderColor: C.gold,
  },

  searchIcon: {
    color: C.gold,
    fontSize: 28,
    marginRight: 8,
  },

  searchInput: {
    flex: 1,
    minWidth: 0,
    color: C.forest,
    fontSize: 11,
    paddingVertical: 10,
  },

  searchButton: {
    backgroundColor: C.forest,
    paddingHorizontal: 13,
    paddingVertical: 13,
    borderRadius: 12,
  },

  searchButtonText: {
    color: C.white,
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 0.8,
  },

  clearSearch: {
    paddingHorizontal: 7,
    paddingVertical: 5,
  },

  clearSearchText: {
    color: C.muted,
    fontSize: 22,
  },

  searchHintRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 5,
    paddingTop: 11,
  },

  searchHintLabel: {
    color: C.gold,
    fontSize: 8,
    fontWeight: "800",
    letterSpacing: 1,
  },

  searchHint: {
    color: C.sage,
    fontSize: 9,
    fontWeight: "700",
    textDecorationLine: "underline",
  },

  searchResults: {
    backgroundColor: C.white,
    marginTop: 8,
    borderRadius: 17,
    borderWidth: 1,
    borderColor: C.border,
    padding: 13,
    elevation: 8,
  },

  searchResultsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
    marginBottom: 5,
  },

  searchResultsTitle: {
    color: C.forest,
    fontSize: 9,
    letterSpacing: 1.3,
    fontWeight: "800",
  },

  searchResultsCount: {
    color: C.gold,
    fontSize: 8,
    fontWeight: "800",
  },

  searchResultItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 9,
    borderBottomWidth: 1,
    borderBottomColor: "#F0ECE4",
    gap: 11,
  },

  searchAvatar: {
    width: 39,
    height: 39,
    borderRadius: 13,
    backgroundColor: C.pale,
  },

  searchResultInfo: {
    flex: 1,
  },

  searchResultName: {
    color: C.forest,
    fontSize: 11,
    fontWeight: "800",
  },

  searchResultSub: {
    color: C.muted,
    fontSize: 9,
    marginTop: 3,
  },

  searchResultArrow: {
    color: C.gold,
    fontSize: 21,
  },

  searchCategoryIcon: {
    width: 39,
    height: 39,
    borderRadius: 13,
    backgroundColor: C.pale,
    alignItems: "center",
    justifyContent: "center",
  },

  searchCategorySymbol: {
    color: C.gold,
    fontSize: 21,
  },

  noSearchResults: {
    alignItems: "center",
    padding: 18,
  },

  noSearchTitle: {
    color: C.forest,
    fontSize: 13,
    fontWeight: "800",
  },

  noSearchSubtitle: {
    color: C.muted,
    fontSize: 10,
    textAlign: "center",
    marginTop: 6,
  },

  allResultsButton: {
    paddingVertical: 12,
    alignItems: "center",
  },

  allResultsText: {
    color: C.gold,
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 1,
  },

  sliderWrap: {
    marginTop: 21,
  },

  // SECTIONS

  section: {
    marginTop: 34,
    paddingLeft: 20,
  },

  sectionHeader: {
    paddingRight: 20,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    marginBottom: 17,
  },

  sectionEyebrow: {
    color: C.gold,
    fontSize: 8,
    letterSpacing: 1.7,
    fontWeight: "800",
  },

  sectionTitle: {
    color: C.forest,
    fontSize: 25,
    fontFamily: "Georgia",
    marginTop: 7,
  },

  viewAll: {
    color: C.gold,
    fontSize: 8,
    fontWeight: "800",
    letterSpacing: 0.8,
    paddingBottom: 4,
  },

  // CATEGORIES

  categoryRow: {
    flexDirection: "row",
    paddingRight: 15,
    gap: 9,
  },

  categoryCard: {
    flex: 1,
    minHeight: 160,
    borderRadius: 17,
    padding: 11,
    backgroundColor: C.white,
    borderWidth: 1,
    borderColor: C.border,
    justifyContent: "space-between",
    elevation: 2,
  },

  categoryTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  categoryNumber: {
    color: "#C8BFAE",
    fontSize: 9,
    fontWeight: "800",
  },

  categorySymbol: {
    color: C.gold,
    fontSize: 24,
  },

  categoryBottom: {
    alignItems: "flex-start",
  },

  categoryName: {
    color: C.forest,
    fontSize: 11,
    fontFamily: "Georgia",
    fontWeight: "700",
  },

  categoryDescription: {
    color: C.muted,
    fontSize: 8,
    marginTop: 5,
  },

  categoryArrowCircle: {
    width: 25,
    height: 25,
    borderRadius: 13,
    backgroundColor: C.pale,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },

  categoryArrow: {
    color: C.gold,
    fontSize: 13,
  },

  // DATABASE SERVICES

  databaseSection: {
    marginTop: 37,
  },

  databaseHeading: {
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
  },

  databaseHeadingText: {
    flex: 1,
  },

  databaseSubtitle: {
    color: C.muted,
    fontSize: 10,
    marginTop: 7,
  },

  databaseViewAll: {
    paddingBottom: 4,
  },

  databaseStats: {
    marginHorizontal: 18,
    marginTop: 18,
    marginBottom: 23,
    paddingVertical: 15,
    paddingHorizontal: 8,
    backgroundColor: "#F0EDE4",
    borderRadius: 15,
    borderWidth: 1,
    borderColor: C.border,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },

  databaseStat: {
    flex: 1,
    alignItems: "center",
  },

  databaseStatNumber: {
    color: C.forest,
    fontFamily: "Georgia",
    fontSize: 20,
    fontWeight: "700",
  },

  databaseStatLabel: {
    color: C.gold,
    fontSize: 7,
    fontWeight: "800",
    letterSpacing: 0.6,
    marginTop: 4,
  },

  databaseStatDivider: {
    width: 1,
    height: 30,
    backgroundColor: "#DCD4C5",
  },

  databaseCategory: {
    marginBottom: 27,
  },

  databaseCategoryHeader: {
    paddingHorizontal: 20,
    marginBottom: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  databaseCategoryTitleWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 11,
  },

  databaseCategorySymbol: {
    color: C.gold,
    fontSize: 28,
  },

  databaseCategoryTitle: {
    color: C.forest,
    fontFamily: "Georgia",
    fontSize: 19,
    fontWeight: "700",
  },

  databaseCategorySub: {
    color: C.muted,
    fontSize: 9,
    marginTop: 3,
  },

  serviceHorizontalList: {
    paddingLeft: 18,
    paddingRight: 8,
    gap: 13,
  },

  serviceCard: {
    width: 225,
    backgroundColor: C.white,
    borderRadius: 18,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: C.border,
    elevation: 3,
  },

  serviceImageWrap: {
    height: 150,
    width: "100%",
    backgroundColor: C.pale,
    overflow: "hidden",
  },

  serviceImage: {
    width: "100%",
    height: "100%",
  },

  serviceImageShade: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(25,43,34,0.10)",
  },

  serviceCategoryBadge: {
    position: "absolute",
    left: 10,
    bottom: 10,
    backgroundColor: "rgba(25,43,34,0.88)",
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(230,211,173,0.65)",
  },

  serviceCategoryBadgeText: {
    color: C.champagne,
    fontSize: 7,
    fontWeight: "800",
    letterSpacing: 0.7,
  },

  serviceImageStar: {
    position: "absolute",
    top: 10,
    right: 10,
    width: 29,
    height: 29,
    borderRadius: 15,
    backgroundColor: "rgba(255,255,255,0.9)",
    alignItems: "center",
    justifyContent: "center",
  },

  serviceImageStarText: {
    color: C.gold,
    fontSize: 15,
  },

  serviceCardContent: {
    padding: 13,
  },

  serviceName: {
    color: C.forest,
    fontFamily: "Georgia",
    fontSize: 15,
    fontWeight: "700",
    minHeight: 38,
    lineHeight: 19,
  },

  serviceDescription: {
    color: C.muted,
    fontSize: 9,
    lineHeight: 14,
    marginTop: 5,
    minHeight: 29,
  },

  serviceMetaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: C.border,
  },

  serviceDuration: {
    color: C.muted,
    fontSize: 9,
  },

  servicePrice: {
    color: C.forest,
    fontSize: 12,
    fontWeight: "800",
  },

  serviceCardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#F0ECE4",
  },

  serviceExploreText: {
    color: C.gold,
    fontSize: 8,
    fontWeight: "800",
    letterSpacing: 0.8,
  },

  serviceExploreArrow: {
    color: C.gold,
    fontSize: 17,
  },

  servicesLoading: {
    marginHorizontal: 18,
    minHeight: 160,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: C.white,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 18,
  },

  servicesLoadingText: {
    color: C.muted,
    fontSize: 10,
    marginTop: 13,
  },

  servicesEmpty: {
    marginHorizontal: 18,
    padding: 25,
    alignItems: "center",
    backgroundColor: C.white,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 18,
  },

  servicesEmptyIcon: {
    color: C.gold,
    fontSize: 32,
  },

  servicesEmptyTitle: {
    color: C.forest,
    fontFamily: "Georgia",
    fontSize: 17,
    marginTop: 9,
  },

  servicesEmptyText: {
    color: C.muted,
    fontSize: 10,
    lineHeight: 16,
    textAlign: "center",
    marginTop: 8,
  },

  retryButton: {
    backgroundColor: C.forest,
    paddingHorizontal: 22,
    paddingVertical: 11,
    borderRadius: 10,
    marginTop: 15,
  },

  retryButtonText: {
    color: C.champagne,
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 1,
  },

  servicesRefreshHint: {
    color: C.muted,
    fontSize: 9,
    marginHorizontal: 20,
    marginTop: 5,
  },

  // LUXURY OFFER

  offerWrap: {
    marginHorizontal: 17,
    marginTop: 32,
  },

  offerCard: {
    minHeight: 235,
    borderRadius: 22,
    padding: 21,
    overflow: "hidden",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: C.gold,
  },

  offerOutline: {
    ...StyleSheet.absoluteFillObject,
    borderWidth: 1,
    borderColor: "rgba(230,211,173,0.22)",
    borderRadius: 17,
    margin: 7,
  },

  offerContent: {
    zIndex: 2,
    maxWidth: "78%",
  },

  offerEyebrow: {
    color: C.champagne,
    fontSize: 8,
    letterSpacing: 1.5,
    fontWeight: "800",
  },

  offerTitle: {
    color: C.white,
    fontSize: 29,
    fontFamily: "Georgia",
    marginTop: 15,
  },

  offerItalic: {
    color: C.champagne,
    fontFamily: "Georgia",
    fontSize: 17,
    fontStyle: "italic",
    marginTop: 2,
  },

  offerDescription: {
    color: "#E0E4DB",
    fontSize: 9,
    lineHeight: 16,
    marginTop: 11,
  },

  offerButton: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 13,
    backgroundColor: C.champagne,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 9,
    marginTop: 17,
  },

  offerButtonText: {
    color: C.forest,
    fontSize: 8,
    fontWeight: "800",
    letterSpacing: 0.7,
  },

  offerButtonArrow: {
    color: C.forest,
    fontSize: 15,
  },

  offerEmblem: {
    position: "absolute",
    right: 15,
    top: 40,
    width: 82,
    height: 82,
    borderRadius: 45,
    borderWidth: 1,
    borderColor: "rgba(230,211,173,0.65)",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1,
  },

  offerEmblemGA: {
    color: C.champagne,
    fontFamily: "Georgia",
    fontSize: 29,
  },

  offerEmblemLine: {
    width: 33,
    height: 1,
    backgroundColor: C.gold,
    marginVertical: 3,
  },

  offerEmblemText: {
    color: C.champagne,
    fontSize: 7,
    letterSpacing: 2,
  },

  offerDecoration: {
    position: "absolute",
    right: -15,
    bottom: -35,
    fontSize: 145,
    color: "rgba(230,211,173,0.09)",
  },

  // AI ASSISTANT

  aiCard: {
    marginHorizontal: 17,
    marginTop: 33,
    borderRadius: 19,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: C.gold,
    elevation: 4,
  },

  aiGradient: {
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  aiIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: C.champagne,
    alignItems: "center",
    justifyContent: "center",
  },

  aiIconText: {
    color: C.forest,
    fontSize: 27,
  },

  aiContent: {
    flex: 1,
  },

  aiEyebrow: {
    color: C.champagne,
    fontSize: 7,
    letterSpacing: 1,
    fontWeight: "800",
  },

  aiTitle: {
    color: C.white,
    fontFamily: "Georgia",
    fontSize: 19,
    marginTop: 5,
  },

  aiDescription: {
    color: "#D5DDD4",
    fontSize: 9,
    lineHeight: 14,
    marginTop: 5,
  },

  aiArrowCircle: {
    width: 34,
    height: 34,
    borderRadius: 18,
    backgroundColor: C.champagne,
    alignItems: "center",
    justifyContent: "center",
  },

  aiArrow: {
    color: C.forest,
    fontSize: 19,
  },

  // TRUST

  trustSection: {
    marginHorizontal: 17,
    marginTop: 27,
    backgroundColor: "#F0EDE4",
    borderRadius: 17,
    paddingVertical: 19,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    borderWidth: 1,
    borderColor: C.border,
  },

  trustItem: {
    flex: 1,
    alignItems: "center",
  },

  trustIcon: {
    color: C.gold,
    fontSize: 22,
  },

  trustTitle: {
    color: C.forest,
    fontSize: 8,
    fontWeight: "800",
    letterSpacing: 0.5,
    marginTop: 7,
  },

  trustSubtitle: {
    color: C.muted,
    fontSize: 8,
    marginTop: 4,
  },

  trustDivider: {
    height: 43,
    width: 1,
    backgroundColor: "#DCD4C5",
  },

  // FOOTER

  footer: {
    alignItems: "center",
    marginTop: 34,
    paddingBottom: 10,
  },

  footerLogoAnimated: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 5,
  },

  footerBrand: {
    color: C.forest,
    fontFamily: "Georgia",
    fontSize: 20,
    letterSpacing: 3,
    marginTop: 9,
  },

  footerTagline: {
    color: C.gold,
    fontSize: 8,
    letterSpacing: 2,
    marginTop: 5,
    fontWeight: "800",
  },

  footerLine: {
    width: 55,
    height: 1,
    backgroundColor: C.gold,
    marginTop: 15,
  },

  footerText: {
    color: C.muted,
    fontSize: 10,
    marginTop: 11,
    fontFamily: "Georgia",
    fontStyle: "italic",
  },

  footerCopyright: {
    color: "#AAA494",
    fontSize: 7,
    letterSpacing: 1,
    marginTop: 13,
  },

  // SIDEBAR

  modalContainer: {
    flex: 1,
    flexDirection: "row",
  },

  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(15,29,21,0.62)",
  },

  sidebar: {
    width: "84%",
    maxWidth: 345,
    backgroundColor: C.ivory,
    paddingBottom: 25,
  },

  sidebarHeader: {
    minHeight: 260,
    paddingTop: 54,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },

  sidebarBrand: {
    color: C.white,
    fontFamily: "Georgia",
    fontSize: 24,
    letterSpacing: 3,
    marginTop: 12,
  },

  sidebarTagline: {
    color: C.champagne,
    fontSize: 8,
    letterSpacing: 2,
    marginTop: 6,
  },

  sidebarGoldLine: {
    width: 43,
    height: 1,
    backgroundColor: C.gold,
    marginTop: 17,
  },

  closeButton: {
    position: "absolute",
    right: 15,
    top: 44,
    padding: 8,
    zIndex: 5,
  },

  closeText: {
    color: C.white,
    fontSize: 30,
  },

  sidebarCaption: {
    color: C.gold,
    fontSize: 9,
    letterSpacing: 1.7,
    fontWeight: "800",
    marginHorizontal: 22,
    marginTop: 26,
    marginBottom: 14,
  },

  menuItem: {
    minHeight: 57,
    marginHorizontal: 21,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  menuItemLeft: {
    flexDirection: "row",
    alignItems: "center",
  },

  menuNumber: {
    color: C.gold,
    fontSize: 9,
    marginRight: 15,
    fontWeight: "800",
  },

  menuItemText: {
    color: C.forest,
    fontSize: 12,
    fontWeight: "700",
  },

  menuArrow: {
    color: C.gold,
    fontSize: 18,
  },

  sidebarBottom: {
    marginTop: "auto",
    alignItems: "center",
    paddingTop: 20,
  },

  sidebarBottomSymbol: {
    color: C.gold,
    fontSize: 25,
  },

  sidebarBottomText: {
    color: C.sage,
    fontFamily: "Georgia",
    fontStyle: "italic",
    fontSize: 15,
    marginTop: 5,
  },

  sidebarCopyright: {
    color: "#AAA494",
    fontSize: 7,
    letterSpacing: 1.2,
    marginTop: 12,
  },
});
