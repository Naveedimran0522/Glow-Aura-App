
/* Bismillah-ir-Rahman-ir-Raheem ❤️ */
/* =====================================================
   GLOWAURA — PREMIUM DATABASE SERVICE DETAILS
   MONGODB API + DYNAMIC IMAGE + SAFE AREA
   FOREST GREEN + CHAMPAGNE GOLD + IVORY
===================================================== */

import React, { useCallback, useEffect, useMemo, useState } from "react";

import {
  View,
  Text,
  ImageBackground,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ActivityIndicator,
  RefreshControl,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import {
  useLocalSearchParams,
  useRouter,
} from "expo-router";

// =====================================================
// API CONFIGURATION
// =====================================================

const RAW_API_URL = (process.env.EXPO_PUBLIC_API_URL || "")
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

// =====================================================
// SERVICE TYPE
// =====================================================

type Service = {
  _id?: string;
  serviceId?: string;
  name?: string;
  title?: string;
  category?: string;
  description?: string;
  price?: number | string;
  duration?: string | number;
  image?: string;
  rating?: number | string;
  details?: string[];
  isActive?: boolean;
};

// =====================================================
// API RESPONSE TYPE
// =====================================================

type ApiResponse = {
  success?: boolean;
  services?: Service[];
  data?: any;
  message?: string;
};

// =====================================================
// IMAGE URL HELPER
// =====================================================

const getImageUrl = (image?: string) => {
  if (!image || typeof image !== "string") {
    return "";
  }

  const cleanImage = image.trim();

  if (!cleanImage) {
    return "";
  }

  if (
    cleanImage.startsWith("https://") ||
    cleanImage.startsWith("http://")
  ) {
    return cleanImage;
  }

  if (!API_ORIGIN) {
    return cleanImage;
  }

  if (cleanImage.startsWith("/")) {
    return `${API_ORIGIN}${cleanImage}`;
  }

  return `${API_ORIGIN}/${cleanImage}`;
};

// =====================================================
// RESPONSE DATA HELPER
// =====================================================

const extractServices = (response: any): Service[] => {
  if (Array.isArray(response)) {
    return response;
  }

  if (Array.isArray(response?.services)) {
    return response.services;
  }

  if (Array.isArray(response?.data?.services)) {
    return response.data.services;
  }

  if (Array.isArray(response?.data?.data)) {
    return response.data.data;
  }

  if (Array.isArray(response?.data)) {
    return response.data;
  }

  return [];
};

// =====================================================
// SERVICE DETAILS SCREEN
// =====================================================

export default function ServiceDetailsScreen() {
  const router = useRouter();

  const { id } = useLocalSearchParams<{ id: string }>();

  const serviceId = Array.isArray(id) ? id[0] : id;

  const [service, setService] = useState<Service | null>(null);

  const [loading, setLoading] = useState(true);

  const [refreshing, setRefreshing] = useState(false);

  const [error, setError] = useState("");

  // =====================================================
  // FETCH SERVICE FROM MONGODB
  // =====================================================

  const fetchService = useCallback(async (isRefresh = false) => {
    if (!serviceId) {
      setError("Invalid service ID.");
      setLoading(false);
      return;
    }

    if (!API_BASE_URL) {
      setError(
        "API URL is missing. Please check your mobile .env file."
      );
      setLoading(false);
      return;
    }

    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const response = await fetch(
        `${API_BASE_URL}/services?limit=100&page=1`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        }
      );

      const responseData: ApiResponse = await response.json();

      if (!response.ok) {
        throw new Error(
          responseData?.message ||
          "Unable to load service details."
        );
      }

      const allServices = extractServices(responseData);

      const matchedService = allServices.find((item) => {
        const databaseId = String(item._id || "");
        const customId = String(item.serviceId || "");

        return (
          databaseId === String(serviceId) ||
          customId === String(serviceId)
        );
      });

      if (!matchedService || matchedService.isActive === false) {
        setService(null);
        setError("This beauty experience is currently unavailable.");
        return;
      }

      setService(matchedService);
    } catch (err: any) {
      console.error("GlowAura service details error:", err);

      setError(
        err?.message ||
        "Something went wrong while loading this service."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [serviceId]);

  // =====================================================
  // INITIAL LOAD
  // =====================================================

  useEffect(() => {
    fetchService();
  }, [fetchService]);

  // =====================================================
  // DYNAMIC SERVICE VALUES
  // =====================================================

  const serviceName = service?.name || service?.title || "Beauty Service";

  const category = service?.category || "Beauty Experience";

  const description =
    service?.description ||
    "Discover a luxurious beauty experience curated by GlowAura professionals.";

  const duration = service?.duration
    ? String(service.duration)
    : "To be confirmed";

  const rating = service?.rating
    ? String(service.rating)
    : "5.0";

  const price = useMemo(() => {
    const value = Number(service?.price || 0);

    return Number.isFinite(value) ? value : 0;
  }, [service?.price]);

  const imageUrl = useMemo(
    () => getImageUrl(service?.image),
    [service?.image]
  );

  const includedDetails = useMemo(() => {
    if (Array.isArray(service?.details) && service.details.length > 0) {
      return service.details;
    }

    return [
      "Personalised beauty consultation",
      "Premium quality beauty products",
      "Professional treatment experience",
      "Hygienic and comfortable service",
      "Dedicated GlowAura care",
    ];
  }, [service?.details]);

  // =====================================================
  // BOOKING NAVIGATION
  // =====================================================

  const handleBooking = () => {
    if (!service) return;

    const bookingId = service.serviceId || service._id;

    if (!bookingId) {
      return;
    }

    router.push({
      pathname: "/booking/[id]",
      params: {
        id: String(bookingId),
      },
    });
  };

  // =====================================================
  // LOADING SCREEN
  // =====================================================

  if (loading) {
    return (
      <SafeAreaView
        style={styles.loadingScreen}
        edges={["top", "bottom", "left", "right"]}
      >
        <StatusBar
          barStyle="dark-content"
          backgroundColor="#FBF8F1"
          translucent={false}
        />

        <View style={styles.loadingLogo}>
          <Text style={styles.loadingLogoText}>GA</Text>
        </View>

        <ActivityIndicator
          size="large"
          color="#B79A68"
          style={styles.loader}
        />

        <Text style={styles.loadingTitle}>
          Preparing Your Experience
        </Text>

        <Text style={styles.loadingSubtitle}>
          Discovering your luxury beauty treatment...
        </Text>
      </SafeAreaView>
    );
  }

  // =====================================================
  // SERVICE NOT FOUND / API ERROR
  // =====================================================

  if (!service) {
    return (
      <SafeAreaView
        style={styles.notFound}
        edges={["top", "bottom", "left", "right"]}
      >
        <StatusBar
          barStyle="dark-content"
          backgroundColor="#FBF8F1"
          translucent={false}
        />

        <Text style={styles.notFoundIcon}>✿</Text>

        <Text style={styles.notFoundTitle}>
          Service Unavailable
        </Text>

        <Text style={styles.notFoundText}>
          {error ||
            "This beauty experience is currently unavailable."}
        </Text>

        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => fetchService()}
          activeOpacity={0.85}
        >
          <Text style={styles.retryButtonText}>
            Try Again
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.backButtonError}
          onPress={() => router.back()}
          activeOpacity={0.85}
        >
          <Text style={styles.backButtonErrorText}>
            Go Back
          </Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  // =====================================================
  // MAIN SCREEN
  // =====================================================

  return (
    <SafeAreaView
      style={styles.safeArea}
      edges={["top", "bottom", "left", "right"]}
    >
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#FBF8F1"
        translucent={false}
      />

      <View style={styles.screen}>

        {/* =========================================
            SCROLLABLE SERVICE CONTENT
        ========================================= */}

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => fetchService(true)}
              tintColor="#B79A68"
            />
          }
        >

          {/* =====================================
              HERO IMAGE
          ===================================== */}

          <ImageBackground
            source={
              imageUrl
                ? { uri: imageUrl }
                : undefined
            }
            style={styles.hero}
            imageStyle={styles.heroImage}
          >
            {!imageUrl && (
              <View style={styles.imageFallback}>
                <Text style={styles.imageFallbackIcon}>✿</Text>
                <Text style={styles.imageFallbackText}>
                  GLOWAURA
                </Text>
              </View>
            )}

            <View style={styles.heroOverlay}>

              <TouchableOpacity
                style={styles.backButton}
                onPress={() => router.back()}
                activeOpacity={0.8}
              >
                <Text style={styles.backText}>‹</Text>
              </TouchableOpacity>

              <View style={styles.heroBottom}>
                <Text style={styles.heroBrand}>
                  GLOWAURA
                </Text>

                <Text style={styles.heroSubtitle}>
                  YOUR BEAUTY, YOUR MOMENT
                </Text>
              </View>

            </View>
          </ImageBackground>

          {/* =====================================
              MAIN CONTENT
          ===================================== */}

          <View style={styles.content}>

            <View style={styles.categoryBadge}>
              <Text style={styles.category}>
                {category.toUpperCase()}
              </Text>
            </View>

            <Text style={styles.title}>
              {serviceName}
            </Text>

            <Text style={styles.description}>
              {description}
            </Text>

            {/* =================================
                SERVICE INFORMATION
            ================================= */}

            <View style={styles.infoRow}>

              <View style={styles.infoCard}>
                <Text style={styles.infoIcon}>◷</Text>

                <Text style={styles.infoLabel}>
                  DURATION
                </Text>

                <Text style={styles.infoValue}>
                  {duration}
                </Text>
              </View>

              <View style={styles.infoCard}>
                <Text style={styles.infoIcon}>★</Text>

                <Text style={styles.infoLabel}>
                  RATING
                </Text>

                <Text style={styles.infoValue}>
                  {rating}/5
                </Text>
              </View>

            </View>

            {/* =================================
                ABOUT EXPERIENCE
            ================================= */}

            <Text style={styles.sectionTitle}>
              About This Experience
            </Text>

            <Text style={styles.bodyText}>
              {description}
            </Text>

            {/* =================================
                WHAT'S INCLUDED
            ================================= */}

            <Text style={styles.sectionTitle}>
              What's Included
            </Text>

            <View style={styles.includedCard}>
              {includedDetails.map((detail, index) => (
                <View
                  key={`${service._id || service.serviceId}-${index}`}
                  style={[
                    styles.detailRow,
                    index === includedDetails.length - 1 &&
                      styles.lastDetailRow,
                  ]}
                >
                  <View style={styles.checkCircle}>
                    <Text style={styles.check}>✓</Text>
                  </View>

                  <Text style={styles.detailText}>
                    {detail}
                  </Text>
                </View>
              ))}
            </View>

            {/* =================================
                LUXURY PROMISE
            ================================= */}

            <View style={styles.promiseCard}>
              <Text style={styles.promiseIcon}>✧</Text>

              <Text style={styles.promiseTitle}>
                The GlowAura Promise
              </Text>

              <Text style={styles.promiseText}>
                Every experience is thoughtfully curated
                to make you feel confident, beautiful
                and truly special.
              </Text>
            </View>

            {/* =================================
                IMPORTANT NOTE
            ================================= */}

            <View style={styles.noteCard}>
              <Text style={styles.noteTitle}>
                ✧ A Little Note
              </Text>

              <Text style={styles.noteText}>
                Service availability and final details
                will be confirmed during your booking.
              </Text>
            </View>

            <View style={styles.bottomSpacing} />

          </View>
        </ScrollView>

        {/* =========================================
            FIXED BOOKING BAR
        ========================================= */}

        <View style={styles.bottomBar}>

          <View style={styles.priceContainer}>
            <Text style={styles.priceLabel}>
              YOUR EXPERIENCE
            </Text>

            <Text style={styles.price}>
              ₹{price.toLocaleString("en-IN")}
            </Text>
          </View>

          <TouchableOpacity
            style={styles.bookButton}
            activeOpacity={0.85}
            onPress={handleBooking}
          >
            <Text style={styles.bookText}>
              Book Now →
            </Text>
          </TouchableOpacity>

        </View>

      </View>
    </SafeAreaView>
  );
}

// =====================================================
// PREMIUM STYLES
// =====================================================

const styles = StyleSheet.create({

  // ==========================================
  // SAFE AREA
  // ==========================================

  safeArea: {
    flex: 1,
    backgroundColor: "#FBF8F1",
  },

  screen: {
    flex: 1,
    backgroundColor: "#FBF8F1",
  },

  scrollContent: {
    paddingBottom: 10,
  },

  // ==========================================
  // LOADING
  // ==========================================

  loadingScreen: {
    flex: 1,
    backgroundColor: "#FBF8F1",
    alignItems: "center",
    justifyContent: "center",
    padding: 25,
  },

  loadingLogo: {
    width: 76,
    height: 76,
    borderRadius: 26,
    backgroundColor: "#34483A",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#B79A68",
  },

  loadingLogoText: {
    color: "#F8F4EB",
    fontFamily: "Georgia",
    fontSize: 29,
    letterSpacing: 2,
  },

  loader: {
    marginTop: 28,
  },

  loadingTitle: {
    color: "#34483A",
    fontFamily: "Georgia",
    fontSize: 21,
    marginTop: 22,
    textAlign: "center",
  },

  loadingSubtitle: {
    color: "#898579",
    fontSize: 11,
    marginTop: 9,
    textAlign: "center",
  },

  // ==========================================
  // HERO IMAGE
  // ==========================================

  hero: {
    height: 310,
    justifyContent: "flex-end",
    backgroundColor: "#34483A",
    overflow: "hidden",
  },

  heroImage: {
    resizeMode: "cover",
  },

  imageFallback: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#34483A",
  },

  imageFallbackIcon: {
    color: "#D8C49B",
    fontSize: 55,
  },

  imageFallbackText: {
    color: "#FFFFFF",
    fontFamily: "Georgia",
    fontSize: 18,
    letterSpacing: 5,
    marginTop: 12,
  },

  heroOverlay: {
    flex: 1,
    justifyContent: "space-between",
    padding: 22,
    backgroundColor: "rgba(30,45,34,0.25)",
  },

  backButton: {
    width: 44,
    height: 44,
    borderRadius: 15,
    backgroundColor: "#FBF8F1",
    alignItems: "center",
    justifyContent: "center",
  },

  backText: {
    color: "#34483A",
    fontSize: 34,
    lineHeight: 39,
  },

  heroBottom: {
    marginBottom: 5,
  },

  heroBrand: {
    color: "#FFFFFF",
    fontSize: 22,
    letterSpacing: 5,
    fontFamily: "Georgia",
  },

  heroSubtitle: {
    color: "#F1E8D8",
    fontSize: 9,
    letterSpacing: 2,
    marginTop: 7,
  },

  // ==========================================
  // MAIN CONTENT
  // ==========================================

  content: {
    padding: 22,
  },

  categoryBadge: {
    alignSelf: "flex-start",
    backgroundColor: "#F0EEE5",
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
  },

  category: {
    color: "#B79A68",
    fontSize: 9,
    letterSpacing: 1.7,
    fontWeight: "700",
  },

  title: {
    color: "#34483A",
    fontFamily: "Georgia",
    fontSize: 29,
    lineHeight: 38,
    marginTop: 13,
  },

  description: {
    color: "#898579",
    fontSize: 13,
    lineHeight: 22,
    marginTop: 11,
  },

  // ==========================================
  // SERVICE INFORMATION
  // ==========================================

  infoRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 25,
  },

  infoCard: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 17,
    padding: 16,
    borderWidth: 1,
    borderColor: "#EEE9DE",
  },

  infoIcon: {
    color: "#B79A68",
    fontSize: 22,
  },

  infoLabel: {
    color: "#A19B8E",
    fontSize: 9,
    letterSpacing: 1.4,
    marginTop: 10,
  },

  infoValue: {
    color: "#34483A",
    fontSize: 14,
    fontWeight: "700",
    marginTop: 6,
  },

  // ==========================================
  // ABOUT + INCLUDED SERVICES
  // ==========================================

  sectionTitle: {
    color: "#34483A",
    fontFamily: "Georgia",
    fontSize: 21,
    marginTop: 30,
    marginBottom: 13,
  },

  bodyText: {
    color: "#898579",
    fontSize: 13,
    lineHeight: 23,
  },

  includedCard: {
    backgroundColor: "#FFFFFF",
    padding: 17,
    borderRadius: 17,
    borderWidth: 1,
    borderColor: "#EEE9DE",
  },

  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },

  lastDetailRow: {
    marginBottom: 0,
  },

  checkCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#EEF0E8",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  check: {
    color: "#758A70",
    fontSize: 13,
    fontWeight: "700",
  },

  detailText: {
    color: "#69685E",
    fontSize: 12,
    flex: 1,
    lineHeight: 19,
  },

  // ==========================================
  // GLOWAURA PROMISE
  // ==========================================

  promiseCard: {
    backgroundColor: "#34483A",
    borderRadius: 19,
    padding: 21,
    marginTop: 27,
    alignItems: "center",
  },

  promiseIcon: {
    color: "#D8C49B",
    fontSize: 27,
  },

  promiseTitle: {
    color: "#F8F4EB",
    fontFamily: "Georgia",
    fontSize: 19,
    marginTop: 9,
  },

  promiseText: {
    color: "#E6DFD0",
    fontSize: 11,
    lineHeight: 19,
    textAlign: "center",
    marginTop: 9,
  },

  // ==========================================
  // NOTE
  // ==========================================

  noteCard: {
    backgroundColor: "#F0EEE5",
    borderRadius: 16,
    padding: 17,
    marginTop: 20,
  },

  noteTitle: {
    color: "#34483A",
    fontFamily: "Georgia",
    fontSize: 16,
  },

  noteText: {
    color: "#898579",
    fontSize: 11,
    lineHeight: 19,
    marginTop: 8,
  },

  bottomSpacing: {
    height: 35,
  },

  // ==========================================
  // FIXED BOOKING BAR
  // ==========================================

  bottomBar: {
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#EEE9DE",
    paddingHorizontal: 19,
    paddingTop: 13,
    paddingBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  priceContainer: {
    flex: 1,
  },

  priceLabel: {
    color: "#A19B8E",
    fontSize: 8,
    letterSpacing: 1.2,
  },

  price: {
    color: "#34483A",
    fontSize: 22,
    fontWeight: "700",
    marginTop: 5,
  },

  bookButton: {
    backgroundColor: "#34483A",
    paddingHorizontal: 25,
    paddingVertical: 16,
    borderRadius: 15,
  },

  bookText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "700",
  },

  // ==========================================
  // SERVICE NOT FOUND
  // ==========================================

  notFound: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FBF8F1",
    padding: 25,
  },

  notFoundIcon: {
    fontSize: 45,
    color: "#B79A68",
  },

  notFoundTitle: {
    color: "#34483A",
    fontSize: 23,
    fontFamily: "Georgia",
    marginTop: 15,
  },

  notFoundText: {
    color: "#898579",
    textAlign: "center",
    fontSize: 12,
    lineHeight: 20,
    marginTop: 10,
  },

  retryButton: {
    backgroundColor: "#B79A68",
    paddingHorizontal: 30,
    paddingVertical: 14,
    borderRadius: 13,
    marginTop: 22,
  },

  retryButtonText: {
    color: "#FFFFFF",
    fontWeight: "700",
  },

  backButtonError: {
    backgroundColor: "#34483A",
    paddingHorizontal: 30,
    paddingVertical: 14,
    borderRadius: 13,
    marginTop: 12,
  },

  backButtonErrorText: {
    color: "#FFFFFF",
    fontWeight: "700",
  },

});
