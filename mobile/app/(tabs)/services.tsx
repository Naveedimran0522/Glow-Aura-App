
/* Bismillah-ir-Rahman-ir-Raheem ❤️ */
/* =========================================================
   GLOWAURA — PREMIUM DATABASE SERVICES GALLERY
   30 DATABASE SERVICES | LIVE SEARCH | CATEGORY FILTER
   FOREST GREEN + CHAMPAGNE GOLD + IVORY
========================================================= */

import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  ImageStyle,
  StyleProp,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useFocusEffect } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

// =========================================================
// API CONFIGURATION
// =========================================================

const RAW_API_URL = (
  process.env.EXPO_PUBLIC_API_URL || ""
)
  .trim()
  .replace(/\/+$/, "");

const API_BASE_URL = RAW_API_URL
  ? RAW_API_URL.endsWith("/api")
    ? RAW_API_URL
    : `${RAW_API_URL}/api`
  : "";

const API_ORIGIN = API_BASE_URL
  ? API_BASE_URL.replace(/\/api$/, "")
  : "";

// =========================================================
// THEME
// =========================================================

const COLORS = {
  background: "#FBF8F1",
  card: "#FFFFFF",
  green: "#34483A",
  darkGreen: "#243529",
  gold: "#B79A68",
  lightGold: "#E8D8B9",
  mutedGreen: "#758A70",
  text: "#29352B",
  secondary: "#827D70",
  border: "#EAE3D5",
  cream: "#F4EFE4",
  white: "#FFFFFF",
  red: "#B85C55",
  success: "#4E8B59",
};

// =========================================================
// TYPES
// =========================================================

type Category =
  | "All"
  | "Skin Care"
  | "Bridal Care"
  | "Mehndi Care";

type ServiceCategory =
  | "Skin Care"
  | "Bridal Care"
  | "Mehndi Care";

interface Service {
  _id: string;
  serviceId: string;
  name: string;
  description: string;
  category: string;
  price: number;
  duration: string;
  image?: string;
  rating?: number;
  isActive?: boolean;
}

interface ServiceResponse {
  success?: boolean;
  services?: Service[];
  data?: {
    services?: Service[];
    data?: Service[];
  };
  pagination?: unknown;
}

// =========================================================
// CATEGORY FALLBACK IMAGES
// =========================================================

const FALLBACK_IMAGES: Record<ServiceCategory, string> = {
  "Skin Care":
    "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=1000&q=85",

  "Bridal Care":
    "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1000&q=85",

  "Mehndi Care":
    "https://images.pexels.com/photos/6883468/pexels-photo-6883468.jpeg?auto=compress&cs=tinysrgb&w=1000",
};

// =========================================================
// CATEGORY NORMALIZER
// =========================================================

const normalizeCategory = (
  category?: string
): ServiceCategory => {
  const value = (category || "")
    .toLowerCase()
    .trim()
    .replace(/[\s_-]+/g, "");

  if (
    value.includes("mehndi") ||
    value.includes("mehandi") ||
    value.includes("henna")
  ) {
    return "Mehndi Care";
  }

  if (
    value.includes("bridal") ||
    value.includes("engagement") ||
    value.includes("wedding")
  ) {
    return "Bridal Care";
  }

  return "Skin Care";
};

// =========================================================
// IMAGE URL NORMALIZER
// =========================================================

const normalizeImageUrl = (image?: string): string => {
  if (!image || typeof image !== "string") {
    return "";
  }

  const cleaned = image.trim();

  if (!cleaned) return "";

  if (/^https?:\/\//i.test(cleaned)) {
    return cleaned;
  }

  if (!API_ORIGIN) return "";

  if (cleaned.startsWith("/")) {
    return `${API_ORIGIN}${cleaned}`;
  }

  return `${API_ORIGIN}/${cleaned.replace(/^\/+/, "")}`;
};

// =========================================================
// SERVICE IMAGE COMPONENT
// =========================================================

interface ServiceImageProps {
  uri?: string;
  fallbackUri: string;
  style?: StyleProp<ImageStyle>;
}

const ServiceImage = ({
  uri,
  fallbackUri,
  style,
}: ServiceImageProps) => {
  const initialUri = uri || fallbackUri;

  const [currentUri, setCurrentUri] =
    useState(initialUri);

  const [fallbackFailed, setFallbackFailed] =
    useState(false);

  useEffect(() => {
    setCurrentUri(uri || fallbackUri);
    setFallbackFailed(false);
  }, [uri, fallbackUri]);

  return (
    <View style={[styles.imageContainer, style]}>
      {!fallbackFailed ? (
        <Image
          source={{ uri: currentUri }}
          style={styles.image}
          resizeMode="cover"
          onError={() => {
            if (currentUri !== fallbackUri) {
              setCurrentUri(fallbackUri);
            } else {
              setFallbackFailed(true);
            }
          }}
        />
      ) : (
        <View style={styles.imagePlaceholder}>
          <Ionicons
            name="image-outline"
            size={30}
            color={COLORS.gold}
          />
          <Text style={styles.imagePlaceholderText}>
            Image unavailable
          </Text>
        </View>
      )}
    </View>
  );
};

// =========================================================
// MAIN SCREEN
// =========================================================

export default function ServicesScreen() {
  const router = useRouter();

  const [selectedCategory, setSelectedCategory] =
    useState<Category>("All");

  const [search, setSearch] = useState("");

  const [services, setServices] = useState<Service[]>([]);

  const [loading, setLoading] = useState(true);

  const [refreshing, setRefreshing] = useState(false);

  const [apiError, setApiError] = useState("");

  // =======================================================
  // FETCH DATABASE SERVICES
  // =======================================================

  const fetchServices = useCallback(async () => {
    try {
      setApiError("");

      if (!API_BASE_URL) {
        throw new Error(
          "API URL missing. Check EXPO_PUBLIC_API_URL in mobile .env."
        );
      }

      const response = await fetch(
        `${API_BASE_URL}/services?limit=100&page=1`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(
          `Server error: ${response.status}`
        );
      }

      const data: ServiceResponse | Service[] =
        await response.json();

      let serviceList: Service[] = [];

      if (Array.isArray(data)) {
        serviceList = data;
      } else if (Array.isArray(data.services)) {
        serviceList = data.services;
      } else if (
        Array.isArray(data.data?.services)
      ) {
        serviceList = data.data.services;
      } else if (Array.isArray(data.data?.data)) {
        serviceList = data.data.data;
      }

      const activeServices = serviceList.filter(
        (service) =>
          service &&
          service.isActive !== false &&
          !!service.name
      );

      setServices(activeServices);

      if (activeServices.length === 0) {
        setApiError(
          "No active services were returned by the database."
        );
      }
    } catch (error: unknown) {
      console.log(
        "GlowAura Services API Error:",
        error
      );

      const message =
        error instanceof Error
          ? error.message
          : "Unable to load services.";

      setApiError(message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  // =======================================================
  // SCREEN FOCUS REFRESH
  // =======================================================

  useFocusEffect(
    useCallback(() => {
      fetchServices();
    }, [fetchServices])
  );

  // =======================================================
  // MANUAL REFRESH
  // =======================================================

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchServices();
  }, [fetchServices]);

  // =======================================================
  // SEARCH + CATEGORY FILTER
  // =======================================================

  const filteredServices = useMemo(() => {
    const keyword = search
      .trim()
      .toLowerCase();

    return services.filter((service) => {
      const category = normalizeCategory(
        service.category
      );

      const categoryMatch =
        selectedCategory === "All" ||
        category === selectedCategory;

      const searchableText = [
        service.name,
        service.serviceId,
        service.description,
        service.category,
        service.duration,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const searchMatch =
        !keyword ||
        searchableText.includes(keyword);

      return categoryMatch && searchMatch;
    });
  }, [services, selectedCategory, search]);

  // =======================================================
  // DATABASE CATEGORY COUNTS
  // =======================================================

  const counts = useMemo(() => {
    return {
      all: services.length,

      skin: services.filter(
        (service) =>
          normalizeCategory(service.category) ===
          "Skin Care"
      ).length,

      bridal: services.filter(
        (service) =>
          normalizeCategory(service.category) ===
          "Bridal Care"
      ).length,

      mehndi: services.filter(
        (service) =>
          normalizeCategory(service.category) ===
          "Mehndi Care"
      ).length,
    };
  }, [services]);

  // =======================================================
  // OPEN SERVICE DETAIL
  // =======================================================

  const openService = (service: Service) => {
    const id = service.serviceId || service._id;

    if (!id) return;

    router.push({
      pathname: "/service/[id]",
      params: { id },
    });
  };

  // =======================================================
  // CATEGORY CONFIGURATION
  // =======================================================

  const categories: {
    label: Category;
    count: number;
    icon: keyof typeof Ionicons.glyphMap;
  }[] = [
    {
      label: "All",
      count: counts.all,
      icon: "grid-outline",
    },
    {
      label: "Skin Care",
      count: counts.skin,
      icon: "flower-outline",
    },
    {
      label: "Bridal Care",
      count: counts.bridal,
      icon: "diamond-outline",
    },
    {
      label: "Mehndi Care",
      count: counts.mehndi,
      icon: "leaf-outline",
    },
  ];

  // =======================================================
  // SERVICE CARD
  // =======================================================

  const renderServiceCard = (
    service: Service,
    index: number
  ) => {
    const category = normalizeCategory(
      service.category
    );

    const imageUri = normalizeImageUrl(
      service.image
    );

    const fallback =
      FALLBACK_IMAGES[category];

    return (
      <TouchableOpacity
        key={service._id || service.serviceId || index}
        style={styles.serviceCard}
        activeOpacity={0.9}
        onPress={() => openService(service)}
      >
        <View style={styles.serviceImageWrapper}>
          <ServiceImage
            uri={imageUri}
            fallbackUri={fallback}
            style={styles.serviceImage}
          />

          <View style={styles.serviceCategoryBadge}>
            <Text style={styles.serviceCategoryText}>
              {category === "Skin Care"
                ? "SKIN CARE"
                : category === "Bridal Care"
                ? "BRIDAL"
                : "MEHNDI"}
            </Text>
          </View>

          <View style={styles.serviceImageNumber}>
            <Text style={styles.serviceImageNumberText}>
              {String(index + 1).padStart(2, "0")}
            </Text>
          </View>
        </View>

        <View style={styles.serviceInfo}>
          <Text
            style={styles.serviceCategoryLabel}
            numberOfLines={1}
          >
            {category}
          </Text>

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
            {service.description}
          </Text>

          <View style={styles.serviceDivider} />

          <View style={styles.serviceBottom}>
            <View>
              <Text style={styles.priceLabel}>
                STARTING FROM
              </Text>

              <Text style={styles.servicePrice}>
                ₹
                {Number(
                  service.price || 0
                ).toLocaleString("en-IN")}
              </Text>
            </View>

            <View style={styles.durationContainer}>
              <Ionicons
                name="time-outline"
                size={12}
                color={COLORS.mutedGreen}
              />

              <Text style={styles.durationText}>
                {service.duration || "Flexible"}
              </Text>
            </View>
          </View>

          <View style={styles.bookButton}>
            <Text style={styles.bookButtonText}>
              EXPLORE SERVICE
            </Text>

            <Ionicons
              name="arrow-forward"
              size={14}
              color={COLORS.white}
            />
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  // =======================================================
  // LOADING STATE
  // =======================================================

  if (loading) {
    return (
      <SafeAreaView
        style={styles.screen}
        edges={["top", "bottom", "left", "right"]}
      >
        <View style={styles.fullLoading}>
          <View style={styles.loadingIcon}>
            <Ionicons
              name="sparkles"
              size={32}
              color={COLORS.gold}
            />
          </View>

          <ActivityIndicator
            size="large"
            color={COLORS.green}
          />

          <Text style={styles.loadingTitle}>
            Preparing Your Beauty Experience
          </Text>

          <Text style={styles.loadingSubtitle}>
            Discovering our exclusive services...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  // =======================================================
  // MAIN UI
  // =======================================================

  return (
    <SafeAreaView
      style={styles.screen}
      edges={["top", "bottom", "left", "right"]}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={COLORS.green}
          />
        }
      >
        {/* HEADER */}

        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Text style={styles.headerEyebrow}>
              THE ART OF SELF CARE
            </Text>

            <Text style={styles.headerTitle}>
              Our Services
              <Text style={styles.headerDot}>.</Text>
            </Text>

            <Text style={styles.headerSubtitle}>
              Discover your signature beauty experience
            </Text>
          </View>

          <View style={styles.headerIcon}>
            <Ionicons
              name="sparkles"
              size={25}
              color={COLORS.gold}
            />
          </View>
        </View>

        {/* HERO */}

        <View style={styles.heroBanner}>
          <View style={styles.heroContent}>
            <Text style={styles.heroEyebrow}>
              GLOWAURA EXCLUSIVE
            </Text>

            <Text style={styles.heroTitle}>
              Beauty Beyond{"\n"}Ordinary
            </Text>

            <Text style={styles.heroDescription}>
              Indulge in luxurious skincare, bridal
              elegance and timeless mehndi artistry.
            </Text>

            <View style={styles.heroTag}>
              <Ionicons
                name="diamond-outline"
                size={14}
                color={COLORS.lightGold}
              />

              <Text style={styles.heroTagText}>
                PREMIUM BEAUTY EXPERIENCE
              </Text>
            </View>
          </View>

          <View style={styles.heroDecoration}>
            <Ionicons
              name="flower-outline"
              size={112}
              color="rgba(232,216,185,0.23)"
            />
          </View>

          <View style={styles.heroCircle} />
        </View>

        {/* SEARCH */}

        <View style={styles.searchContainer}>
          <Ionicons
            name="search-outline"
            size={21}
            color={COLORS.mutedGreen}
          />

          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Search name, ID, skin, bridal, mehndi..."
            placeholderTextColor="#A39D90"
            style={styles.searchInput}
            returnKeyType="search"
            autoCorrect={false}
          />

          {search.length > 0 && (
            <TouchableOpacity
              onPress={() => setSearch("")}
              activeOpacity={0.7}
            >
              <Ionicons
                name="close-circle"
                size={21}
                color={COLORS.secondary}
              />
            </TouchableOpacity>
          )}
        </View>

        {/* CATEGORY HEADING */}

        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionEyebrow}>
              EXPLORE COLLECTIONS
            </Text>

            <Text style={styles.sectionTitle}>
              Beauty Categories
            </Text>
          </View>

          <View style={styles.collectionIcon}>
            <Ionicons
              name="apps-outline"
              size={20}
              color={COLORS.gold}
            />
          </View>
        </View>

        {/* CATEGORY FILTER */}

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryContainer}
        >
          {categories.map((item) => {
            const active =
              selectedCategory === item.label;

            return (
              <TouchableOpacity
                key={item.label}
                activeOpacity={0.85}
                onPress={() =>
                  setSelectedCategory(item.label)
                }
                style={[
                  styles.categoryButton,
                  active && styles.categoryButtonActive,
                ]}
              >
                <Ionicons
                  name={item.icon}
                  size={15}
                  color={
                    active ? COLORS.white : COLORS.mutedGreen
                  }
                />

                <Text
                  style={[
                    styles.categoryButtonText,
                    active &&
                      styles.categoryButtonTextActive,
                  ]}
                >
                  {item.label}
                </Text>

                <View
                  style={[
                    styles.categoryCount,
                    active && styles.categoryCountActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.categoryCountText,
                      active &&
                        styles.categoryCountTextActive,
                    ]}
                  >
                    {item.count}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* DATABASE STATS */}

        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>
              {counts.all}
            </Text>

            <Text style={styles.statLabel}>
              TOTAL SERVICES
            </Text>
          </View>

          <View style={styles.statDivider} />

          <View style={styles.statItem}>
            <Text style={styles.statNumber}>
              {counts.skin}
            </Text>

            <Text style={styles.statLabel}>
              SKIN CARE
            </Text>
          </View>

          <View style={styles.statDivider} />

          <View style={styles.statItem}>
            <Text style={styles.statNumber}>
              {counts.bridal}
            </Text>

            <Text style={styles.statLabel}>
              BRIDAL
            </Text>
          </View>

          <View style={styles.statDivider} />

          <View style={styles.statItem}>
            <Text style={styles.statNumber}>
              {counts.mehndi}
            </Text>

            <Text style={styles.statLabel}>
              MEHNDI
            </Text>
          </View>
        </View>

        {/* SERVICES HEADING */}

        <View style={styles.galleryHeading}>
          <View style={{ flex: 1 }}>
            <Text style={styles.sectionEyebrow}>
              OUR BEAUTY INSPIRATION
            </Text>

            <Text style={styles.sectionTitle}>
              {selectedCategory === "All"
                ? "Explore All Services"
                : selectedCategory}
            </Text>

            <Text style={styles.galleryCount}>
              Showing {filteredServices.length} of{" "}
              {services.length} database services
            </Text>
          </View>

          <View style={styles.liveBadge}>
            <View style={styles.liveDot} />

            <Text style={styles.liveText}>
              LIVE
            </Text>
          </View>
        </View>

        {/* API ERROR */}

        {!!apiError && services.length === 0 && (
          <View style={styles.errorContainer}>
            <Ionicons
              name="cloud-offline-outline"
              size={32}
              color={COLORS.red}
            />

            <Text style={styles.emptyTitle}>
              Unable to Load Services
            </Text>

            <Text style={styles.errorText}>
              {apiError}
            </Text>

            <TouchableOpacity
              style={styles.retryButton}
              onPress={() => {
                setLoading(true);
                fetchServices();
              }}
            >
              <Ionicons
                name="refresh"
                size={16}
                color={COLORS.white}
              />

              <Text style={styles.retryButtonText}>
                TRY AGAIN
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* DATABASE SERVICE GRID */}

        {filteredServices.length > 0 ? (
          <View style={styles.serviceGrid}>
            {filteredServices.map(
              (service, index) =>
                renderServiceCard(service, index)
            )}
          </View>
        ) : (
          !apiError && (
            <View style={styles.emptyContainer}>
              <View style={styles.emptyIcon}>
                <Ionicons
                  name="search-outline"
                  size={32}
                  color={COLORS.gold}
                />
              </View>

              <Text style={styles.emptyTitle}>
                No Services Found
              </Text>

              <Text style={styles.emptyText}>
                We couldn't find any services matching
                your search. Try another keyword or category.
              </Text>

              <TouchableOpacity
                style={styles.clearButton}
                onPress={() => {
                  setSearch("");
                  setSelectedCategory("All");
                }}
              >
                <Text style={styles.clearButtonText}>
                  CLEAR FILTERS
                </Text>
              </TouchableOpacity>
            </View>
          )
        )}

        {/* DATABASE FOOTNOTE */}

        {services.length > 0 && (
          <View style={styles.databaseNote}>
            <Ionicons
              name="shield-checkmark-outline"
              size={17}
              color={COLORS.success}
            />

            <Text style={styles.databaseNoteText}>
              Showing active services directly from GlowAura database.
            </Text>
          </View>
        )}

        {/* FOOTER */}

        <View style={styles.footer}>
          <View style={styles.footerDivider}>
            <View style={styles.footerLine} />

            <Ionicons
              name="sparkles"
              size={17}
              color={COLORS.gold}
            />

            <View style={styles.footerLine} />
          </View>

          <Text style={styles.footerBrand}>
            GLOWAURA
          </Text>

          <Text style={styles.footerTagline}>
            Beauty • Skincare • Mehndi
          </Text>

          <Text style={styles.footerQuote}>
            Your beauty, our signature.
          </Text>

          <Text style={styles.footerCopyright}>
            MADE WITH LOVE ❤️
          </Text>
        </View>

        <View style={{ height: 25 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

// =========================================================
// PREMIUM STYLES
// =========================================================

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  imageContainer: {
    overflow: "hidden",
    backgroundColor: COLORS.cream,
  },

  image: {
    width: "100%",
    height: "100%",
  },

  imagePlaceholder: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },

  imagePlaceholderText: {
    color: COLORS.secondary,
    fontSize: 9,
  },

  // LOADING

  fullLoading: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 25,
  },

  loadingIcon: {
    height: 76,
    width: 76,
    borderRadius: 26,
    backgroundColor: COLORS.cream,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 22,
  },

  loadingTitle: {
    color: COLORS.green,
    fontSize: 15,
    fontWeight: "800",
    marginTop: 19,
    textAlign: "center",
  },

  loadingSubtitle: {
    color: COLORS.secondary,
    fontSize: 11,
    marginTop: 7,
  },

  // HEADER

  header: {
    paddingHorizontal: 22,
    paddingTop: 17,
    paddingBottom: 19,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  headerContent: {
    flex: 1,
  },

  headerEyebrow: {
    fontSize: 9,
    letterSpacing: 3,
    fontWeight: "800",
    color: COLORS.gold,
    marginBottom: 7,
  },

  headerTitle: {
    fontSize: 32,
    fontWeight: "800",
    color: COLORS.green,
    letterSpacing: -0.8,
  },

  headerDot: {
    color: COLORS.gold,
  },

  headerSubtitle: {
    fontSize: 11,
    color: COLORS.secondary,
    marginTop: 5,
  },

  headerIcon: {
    height: 49,
    width: 49,
    borderRadius: 17,
    backgroundColor: COLORS.cream,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 10,
  },

  // HERO

  heroBanner: {
    marginHorizontal: 18,
    minHeight: 200,
    borderRadius: 24,
    backgroundColor: COLORS.green,
    overflow: "hidden",
    padding: 22,
    justifyContent: "center",
  },

  heroContent: {
    zIndex: 2,
    maxWidth: "88%",
  },

  heroEyebrow: {
    color: COLORS.lightGold,
    fontSize: 9,
    letterSpacing: 2.5,
    fontWeight: "800",
    marginBottom: 10,
  },

  heroTitle: {
    fontSize: 29,
    lineHeight: 36,
    fontWeight: "800",
    color: COLORS.white,
  },

  heroDescription: {
    fontSize: 11,
    lineHeight: 18,
    color: "#E4E8DE",
    marginTop: 9,
    maxWidth: 245,
  },

  heroTag: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 15,
    gap: 7,
  },

  heroTagText: {
    color: COLORS.lightGold,
    fontSize: 8,
    letterSpacing: 1.1,
    fontWeight: "800",
  },

  heroDecoration: {
    position: "absolute",
    right: -13,
    bottom: 10,
    transform: [{ rotate: "-18deg" }],
  },

  heroCircle: {
    position: "absolute",
    width: 155,
    height: 155,
    borderRadius: 80,
    borderWidth: 1,
    borderColor: "rgba(232,216,185,0.16)",
    right: -65,
    top: -70,
  },

  // SEARCH

  searchContainer: {
    marginHorizontal: 18,
    marginTop: 20,
    marginBottom: 24,
    height: 54,
    borderRadius: 16,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    gap: 11,
  },

  searchInput: {
    flex: 1,
    height: "100%",
    color: COLORS.text,
    fontSize: 11,
  },

  // SECTION

  sectionHeader: {
    paddingHorizontal: 20,
    marginBottom: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  sectionEyebrow: {
    fontSize: 8,
    color: COLORS.gold,
    letterSpacing: 2,
    fontWeight: "800",
    marginBottom: 5,
  },

  sectionTitle: {
    fontSize: 21,
    color: COLORS.green,
    fontWeight: "800",
    letterSpacing: -0.3,
  },

  collectionIcon: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: COLORS.cream,
    alignItems: "center",
    justifyContent: "center",
  },

  // CATEGORY

  categoryContainer: {
    paddingHorizontal: 18,
    paddingBottom: 16,
    gap: 9,
  },

  categoryButton: {
    paddingHorizontal: 13,
    height: 42,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.white,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 6,
  },

  categoryButtonActive: {
    backgroundColor: COLORS.green,
    borderColor: COLORS.green,
  },

  categoryButtonText: {
    fontSize: 10,
    fontWeight: "700",
    color: COLORS.secondary,
  },

  categoryButtonTextActive: {
    color: COLORS.white,
  },

  categoryCount: {
    minWidth: 19,
    height: 19,
    borderRadius: 10,
    backgroundColor: COLORS.cream,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4,
  },

  categoryCountActive: {
    backgroundColor: "rgba(255,255,255,0.18)",
  },

  categoryCountText: {
    color: COLORS.green,
    fontSize: 9,
    fontWeight: "800",
  },

  categoryCountTextActive: {
    color: COLORS.white,
  },

  // STATS

  statsContainer: {
    marginHorizontal: 18,
    marginTop: 2,
    marginBottom: 25,
    paddingVertical: 15,
    paddingHorizontal: 4,
    backgroundColor: COLORS.white,
    borderRadius: 17,
    borderWidth: 1,
    borderColor: COLORS.border,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },

  statItem: {
    alignItems: "center",
    flex: 1,
  },

  statNumber: {
    color: COLORS.green,
    fontSize: 22,
    fontWeight: "800",
  },

  statLabel: {
    color: COLORS.secondary,
    fontSize: 7,
    fontWeight: "800",
    marginTop: 4,
    letterSpacing: 0.5,
  },

  statDivider: {
    height: 32,
    width: 1,
    backgroundColor: COLORS.border,
  },

  // SERVICE HEADING

  galleryHeading: {
    paddingHorizontal: 20,
    marginBottom: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  galleryCount: {
    color: COLORS.secondary,
    fontSize: 10,
    marginTop: 6,
  },

  liveBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E8F0E6",
    borderRadius: 10,
    paddingHorizontal: 9,
    paddingVertical: 7,
    gap: 5,
    marginLeft: 8,
  },

  liveDot: {
    height: 6,
    width: 6,
    borderRadius: 3,
    backgroundColor: COLORS.success,
  },

  liveText: {
    fontSize: 8,
    color: COLORS.success,
    fontWeight: "900",
    letterSpacing: 1,
  },

  // DATABASE GRID

  serviceGrid: {
    paddingHorizontal: 15,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  serviceCard: {
    width: "48.3%",
    backgroundColor: COLORS.white,
    borderRadius: 17,
    overflow: "hidden",
    marginBottom: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  serviceImageWrapper: {
    height: 157,
    width: "100%",
    backgroundColor: COLORS.cream,
    position: "relative",
  },

  serviceImage: {
    height: "100%",
    width: "100%",
  },

  serviceCategoryBadge: {
    position: "absolute",
    top: 9,
    left: 8,
    backgroundColor: "rgba(36,53,41,0.91)",
    borderRadius: 7,
    paddingHorizontal: 7,
    paddingVertical: 5,
  },

  serviceCategoryText: {
    fontSize: 7,
    color: COLORS.white,
    fontWeight: "900",
    letterSpacing: 0.7,
  },

  serviceImageNumber: {
    position: "absolute",
    right: 8,
    bottom: 8,
    height: 25,
    minWidth: 25,
    borderRadius: 13,
    backgroundColor: "rgba(255,255,255,0.94)",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 5,
  },

  serviceImageNumberText: {
    fontSize: 9,
    color: COLORS.green,
    fontWeight: "900",
  },

  serviceInfo: {
    paddingHorizontal: 10,
    paddingTop: 11,
    paddingBottom: 11,
  },

  serviceCategoryLabel: {
    color: COLORS.gold,
    fontSize: 8,
    fontWeight: "900",
    letterSpacing: 0.6,
  },

  serviceName: {
    fontSize: 12,
    lineHeight: 17,
    fontWeight: "800",
    color: COLORS.green,
    marginTop: 5,
    minHeight: 34,
  },

  serviceDescription: {
    color: COLORS.secondary,
    fontSize: 9,
    lineHeight: 14,
    marginTop: 5,
    minHeight: 28,
  },

  serviceDivider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginTop: 10,
    marginBottom: 9,
  },

  serviceBottom: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 4,
  },

  priceLabel: {
    color: COLORS.secondary,
    fontSize: 6,
    fontWeight: "800",
    letterSpacing: 0.4,
  },

  servicePrice: {
    color: COLORS.green,
    fontSize: 14,
    fontWeight: "900",
    marginTop: 3,
  },

  durationContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    maxWidth: "55%",
  },

  durationText: {
    color: COLORS.secondary,
    fontSize: 8,
    flexShrink: 1,
  },

  bookButton: {
    height: 33,
    borderRadius: 9,
    backgroundColor: COLORS.green,
    marginTop: 11,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 7,
  },

  bookButtonText: {
    color: COLORS.white,
    fontSize: 8,
    fontWeight: "900",
    letterSpacing: 0.5,
  },

  // EMPTY / ERROR

  emptyContainer: {
    marginHorizontal: 18,
    backgroundColor: COLORS.white,
    borderRadius: 18,
    padding: 27,
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  emptyIcon: {
    height: 65,
    width: 65,
    borderRadius: 22,
    backgroundColor: COLORS.cream,
    alignItems: "center",
    justifyContent: "center",
  },

  emptyTitle: {
    color: COLORS.green,
    fontSize: 15,
    fontWeight: "800",
    marginTop: 12,
    textAlign: "center",
  },

  emptyText: {
    color: COLORS.secondary,
    fontSize: 10,
    textAlign: "center",
    lineHeight: 17,
    marginTop: 7,
  },

  clearButton: {
    backgroundColor: COLORS.green,
    paddingHorizontal: 19,
    paddingVertical: 11,
    borderRadius: 11,
    marginTop: 16,
  },

  clearButtonText: {
    color: COLORS.white,
    fontSize: 9,
    fontWeight: "900",
    letterSpacing: 0.7,
  },

  errorContainer: {
    marginHorizontal: 18,
    padding: 25,
    alignItems: "center",
    backgroundColor: COLORS.white,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  errorText: {
    color: COLORS.red,
    fontSize: 10,
    marginTop: 9,
    textAlign: "center",
    lineHeight: 16,
  },

  retryButton: {
    marginTop: 17,
    backgroundColor: COLORS.green,
    paddingHorizontal: 19,
    paddingVertical: 11,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
  },

  retryButtonText: {
    color: COLORS.white,
    fontSize: 9,
    fontWeight: "900",
  },

  // DATABASE NOTE

  databaseNote: {
    marginHorizontal: 20,
    marginTop: 7,
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: "#EDF3E9",
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  databaseNoteText: {
    flex: 1,
    color: COLORS.green,
    fontSize: 9,
    lineHeight: 14,
  },

  // FOOTER

  footer: {
    alignItems: "center",
    paddingTop: 30,
    paddingBottom: 20,
  },

  footerDivider: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    width: "55%",
    justifyContent: "center",
  },

  footerLine: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.border,
  },

  footerBrand: {
    color: COLORS.green,
    fontSize: 18,
    fontWeight: "900",
    letterSpacing: 4,
    marginTop: 12,
  },

  footerTagline: {
    fontSize: 9,
    color: COLORS.secondary,
    letterSpacing: 1,
    marginTop: 6,
  },

  footerQuote: {
    fontSize: 10,
    color: COLORS.gold,
    fontStyle: "italic",
    marginTop: 9,
  },

  footerCopyright: {
    fontSize: 7,
    color: COLORS.mutedGreen,
    letterSpacing: 2,
    fontWeight: "800",
    marginTop: 12,
  },
});
