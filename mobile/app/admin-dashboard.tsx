/* Bismillah-ir-Rahman-ir-Raheem ❤️ */
/* GLOWAURA — PREMIUM ADMIN DASHBOARD */

import React, { useCallback, useState } from "react";

import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  StatusBar,
  Alert,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import {
  useRouter,
  useFocusEffect,
} from "expo-router";

import {
  Users,
  UserRound,
  CalendarDays,
  Clock,
  CheckCircle2,
  XCircle,
  IndianRupee,
  ArrowLeft,
  RefreshCw,
  ShieldCheck,
  ChevronRight,
  BriefcaseBusiness,
} from "lucide-react-native";

import { getAuthToken } from "../services/auth";
import { getAdminOverview } from "../services/api";

// ==========================================
// COLORS
// ==========================================

const COLORS = {
  background: "#FBF8F1",
  green: "#34483A",
  gold: "#B79A68",
  white: "#FFFFFF",
  muted: "#898579",
  border: "#EEE9DE",
  red: "#B85C50",
  blue: "#637D8A",
};

// ==========================================
// TYPES
// ==========================================

interface Overview {
  totalUsers: number;
  totalArtists: number;
  totalBookings: number;
  activeBookings: number;
  cancelledBookings: number;
  completedBookings: number;
  totalRevenue: number;
  currency: string;
}

const EMPTY_OVERVIEW: Overview = {
  totalUsers: 0,
  totalArtists: 0,
  totalBookings: 0,
  activeBookings: 0,
  cancelledBookings: 0,
  completedBookings: 0,
  totalRevenue: 0,
  currency: "INR",
};

// ==========================================
// ADMIN DASHBOARD
// ==========================================

export default function AdminDashboardScreen() {
  const router = useRouter();

  const [overview, setOverview] =
    useState<Overview>(EMPTY_OVERVIEW);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  // ========================================
  // LOAD ADMIN DASHBOARD DATA
  // ========================================

  const loadDashboard = useCallback(
    async (isRefresh = false) => {
      try {
        if (isRefresh) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }

        setError("");

        const token = await getAuthToken();

        if (!token) {
          router.replace("/login");
          return;
        }

        const response = await getAdminOverview(token);

        if (!response.success || !response.overview) {
          throw new Error(
            response.message ||
              "Unable to load dashboard."
          );
        }

        setOverview({
          ...EMPTY_OVERVIEW,
          ...response.overview,
        });

      } catch (err: any) {
        console.error(
          "ADMIN DASHBOARD ERROR:",
          err
        );

        const message =
          err?.message ||
          "Unable to load admin dashboard.";

        setError(message);

        if (
          message.toLowerCase().includes("admin access") ||
          message.toLowerCase().includes("invalid or expired") ||
          message.toLowerCase().includes("authentication required")
        ) {
          Alert.alert(
            "Access Denied",
            "Your admin session is invalid. Please login again.",
            [
              {
                text: "OK",
                onPress: () => router.replace("/login"),
              },
            ]
          );
        }

      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [router]
  );

  // ========================================
  // REFRESH WHEN SCREEN OPENS
  // ========================================

  useFocusEffect(
    useCallback(() => {
      loadDashboard();
    }, [loadDashboard])
  );

  // ========================================
  // FORMAT CURRENCY
  // ========================================

  const formatRevenue = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(Number(amount) || 0);
  };

  // ========================================
  // STAT CARD
  // ========================================

  const StatCard = ({
    title,
    value,
    icon: Icon,
    color,
  }: {
    title: string;
    value: string | number;
    icon: any;
    color: string;
  }) => (
    <View style={styles.statCard}>
      <View
        style={[
          styles.statIcon,
          { backgroundColor: color + "18" },
        ]}
      >
        <Icon size={21} color={color} />
      </View>

      <Text style={styles.statValue}>
        {value}
      </Text>

      <Text style={styles.statTitle}>
        {title}
      </Text>
    </View>
  );

  // ========================================
  // LOADING SCREEN
  // ========================================

  if (loading) {
    return (
      <SafeAreaView
        style={styles.loadingScreen}
        edges={["top", "bottom", "left", "right"]}
      >
        <StatusBar
          barStyle="dark-content"
          backgroundColor={COLORS.background}
        />

        <ActivityIndicator
          size="large"
          color={COLORS.green}
        />

        <Text style={styles.loadingText}>
          Loading GlowAura Dashboard...
        </Text>
      </SafeAreaView>
    );
  }

  // ========================================
  // MAIN DASHBOARD
  // ========================================

  return (
    <SafeAreaView
      style={styles.screen}
      edges={["top", "bottom", "left", "right"]}
    >
      <StatusBar
        barStyle="light-content"
        backgroundColor={COLORS.green}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => loadDashboard(true)}
            tintColor={COLORS.green}
          />
        }
      >

        {/* ================================= */}
        {/* HEADER */}
        {/* ================================= */}

        <View style={styles.header}>

          <View style={styles.headerTop}>

            <TouchableOpacity
              style={styles.backButton}
              activeOpacity={0.7}
              onPress={() => router.back()}
            >
              <ArrowLeft
                size={21}
                color="#FFFFFF"
              />
            </TouchableOpacity>

            <View style={styles.headerTitleBox}>
              <Text style={styles.brand}>
                GLOWAURA
              </Text>

              <Text style={styles.headerSubtitle}>
                ADMIN CONTROL CENTER
              </Text>
            </View>

            <TouchableOpacity
              style={styles.refreshButton}
              activeOpacity={0.7}
              onPress={() => loadDashboard(true)}
            >
              <RefreshCw
                size={19}
                color="#FFFFFF"
              />
            </TouchableOpacity>

          </View>

          <View style={styles.welcomeBox}>

            <View style={styles.welcomeIcon}>
              <ShieldCheck
                size={25}
                color={COLORS.gold}
              />
            </View>

            <View>
              <Text style={styles.welcomeTitle}>
                Welcome, Admin
              </Text>

              <Text style={styles.welcomeSubtitle}>
                Manage your beauty business
              </Text>
            </View>

          </View>

        </View>

        {/* ================================= */}
        {/* MAIN CONTAINER */}
        {/* ================================= */}

        <View style={styles.container}>

          {/* ERROR */}

          {error ? (
            <View style={styles.errorBox}>

              <Text style={styles.errorText}>
                {error}
              </Text>

              <TouchableOpacity
                onPress={() => loadDashboard()}
                style={styles.retryButton}
                activeOpacity={0.8}
              >
                <Text style={styles.retryText}>
                  Try Again
                </Text>
              </TouchableOpacity>

            </View>
          ) : null}

          {/* ================================= */}
          {/* BUSINESS OVERVIEW */}
          {/* ================================= */}

          <Text style={styles.sectionTitle}>
            Business Overview
          </Text>

          <View style={styles.revenueCard}>

            <View style={styles.revenueHeader}>

              <View>
                <Text style={styles.revenueLabel}>
                  TOTAL REVENUE
                </Text>

                <Text style={styles.revenueAmount}>
                  {formatRevenue(overview.totalRevenue)}
                </Text>
              </View>

              <View style={styles.revenueIcon}>
                <IndianRupee
                  size={26}
                  color={COLORS.gold}
                />
              </View>

            </View>

            <Text style={styles.revenueNote}>
              Calculated from paid bookings
            </Text>

          </View>

          {/* ================================= */}
          {/* BUSINESS STATISTICS */}
          {/* ================================= */}

          <Text style={styles.sectionTitle}>
            Business Statistics
          </Text>

          <View style={styles.statsGrid}>

            <StatCard
              title="Total Users"
              value={overview.totalUsers}
              icon={Users}
              color={COLORS.green}
            />

            <StatCard
              title="Total Artists"
              value={overview.totalArtists}
              icon={UserRound}
              color={COLORS.gold}
            />

            <StatCard
              title="Total Bookings"
              value={overview.totalBookings}
              icon={CalendarDays}
              color={COLORS.blue}
            />

            <StatCard
              title="Active Bookings"
              value={overview.activeBookings}
              icon={Clock}
              color="#C18A43"
            />

            <StatCard
              title="Completed"
              value={overview.completedBookings}
              icon={CheckCircle2}
              color={COLORS.green}
            />

            <StatCard
              title="Cancelled"
              value={overview.cancelledBookings}
              icon={XCircle}
              color={COLORS.red}
            />

          </View>

          {/* ================================= */}
          {/* MANAGEMENT MODULES */}
          {/* ================================= */}

          <Text style={styles.sectionTitle}>
            Management Modules
          </Text>

          {/* ================================= */}
          {/* USERS MANAGEMENT */}
          {/* ================================= */}

          <TouchableOpacity
            style={styles.moduleCard}
            activeOpacity={0.75}
            onPress={() => router.push("/admin-users")}
          >

            <View style={styles.moduleIcon}>
              <Users
                size={22}
                color={COLORS.green}
              />
            </View>

            <View style={styles.moduleText}>

              <Text style={styles.moduleTitle}>
                Users Management
              </Text>

              <Text style={styles.moduleSubtitle}>
                Manage registered customers
              </Text>

            </View>

            <Text style={styles.moduleAction}>
              OPEN
            </Text>

            <ChevronRight
              size={19}
              color={COLORS.gold}
            />

          </TouchableOpacity>

          {/* ================================= */}
          {/* ARTISTS MANAGEMENT */}
          {/* ================================= */}

          <TouchableOpacity
            style={styles.moduleCard}
            activeOpacity={0.75}
            onPress={() => router.push("/admin-artists")}
          >

            <View style={styles.moduleIcon}>
              <UserRound
                size={22}
                color={COLORS.green}
              />
            </View>

            <View style={styles.moduleText}>

              <Text style={styles.moduleTitle}>
                Artists Management
              </Text>

              <Text style={styles.moduleSubtitle}>
                Manage beauty professionals
              </Text>

            </View>

            <Text style={styles.moduleAction}>
              OPEN
            </Text>

            <ChevronRight
              size={19}
              color={COLORS.gold}
            />

          </TouchableOpacity>

          {/* ================================= */}
          {/* BOOKINGS MANAGEMENT */}
          {/* ================================= */}

          <TouchableOpacity
            style={styles.moduleCard}
            activeOpacity={0.75}
            onPress={() => router.push("/admin-bookings")}
          >

            <View style={styles.moduleIcon}>
              <CalendarDays
                size={22}
                color={COLORS.green}
              />
            </View>

            <View style={styles.moduleText}>

              <Text style={styles.moduleTitle}>
                Bookings Management
              </Text>

              <Text style={styles.moduleSubtitle}>
                View and manage appointments
              </Text>

            </View>

            <Text style={styles.moduleAction}>
              OPEN
            </Text>

            <ChevronRight
              size={19}
              color={COLORS.gold}
            />

          </TouchableOpacity>

          {/* ================================= */}
          {/* SERVICES MANAGEMENT */}
          {/* ================================= */}

          <TouchableOpacity
            style={styles.moduleCard}
            activeOpacity={0.75}
            onPress={() => router.push("/admin-services")}
          >

            <View style={styles.moduleIcon}>
              <BriefcaseBusiness
                size={22}
                color={COLORS.green}
              />
            </View>

            <View style={styles.moduleText}>

              <Text style={styles.moduleTitle}>
                Services Management
              </Text>

              <Text style={styles.moduleSubtitle}>
                Add, edit and manage beauty services
              </Text>

            </View>

            <Text style={styles.moduleAction}>
              OPEN
            </Text>

            <ChevronRight
              size={19}
              color={COLORS.gold}
            />

          </TouchableOpacity>

          {/* ================================= */}
          {/* FOOTER */}
          {/* ================================= */}

          <Text style={styles.footer}>
            GLOWAURA • ADMIN PANEL
          </Text>

        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

// ==========================================
// STYLES
// ==========================================

const styles = StyleSheet.create({

  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  scrollContent: {
    flexGrow: 1,
    paddingBottom: 15,
  },

  loadingScreen: {
    flex: 1,
    backgroundColor: COLORS.background,
    alignItems: "center",
    justifyContent: "center",
  },

  loadingText: {
    color: COLORS.green,
    fontSize: 13,
    marginTop: 15,
  },

  // HEADER

  header: {
    backgroundColor: COLORS.green,
    paddingTop: 14,
    paddingHorizontal: 22,
    paddingBottom: 28,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },

  headerTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  backButton: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: "#FFFFFF18",
    alignItems: "center",
    justifyContent: "center",
  },

  headerTitleBox: {
    flex: 1,
    marginLeft: 14,
  },

  brand: {
    color: "#FFFFFF",
    fontSize: 19,
    fontWeight: "800",
    letterSpacing: 2,
  },

  headerSubtitle: {
    color: COLORS.gold,
    fontSize: 9,
    letterSpacing: 2,
    marginTop: 4,
  },

  refreshButton: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: "#FFFFFF18",
    alignItems: "center",
    justifyContent: "center",
  },

  welcomeBox: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 28,
    gap: 13,
  },

  welcomeIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: "#FFFFFF15",
    alignItems: "center",
    justifyContent: "center",
  },

  welcomeTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
  },

  welcomeSubtitle: {
    color: "#D8D6CB",
    fontSize: 11,
    marginTop: 5,
  },

  // MAIN CONTAINER

  container: {
    padding: 20,
  },

  sectionTitle: {
    color: COLORS.green,
    fontSize: 17,
    fontWeight: "800",
    marginTop: 22,
    marginBottom: 15,
  },

  // REVENUE

  revenueCard: {
    backgroundColor: COLORS.green,
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.gold,
  },

  revenueHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  revenueLabel: {
    color: "#D8D6CB",
    fontSize: 10,
    letterSpacing: 2,
  },

  revenueAmount: {
    color: "#FFFFFF",
    fontSize: 27,
    fontWeight: "800",
    marginTop: 10,
  },

  revenueIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: "#FFFFFF18",
    alignItems: "center",
    justifyContent: "center",
  },

  revenueNote: {
    color: "#D8D6CB",
    fontSize: 10,
    marginTop: 16,
  },

  // STATISTICS

  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 12,
  },

  statCard: {
    width: "48%",
    minHeight: 130,
    backgroundColor: COLORS.white,
    borderRadius: 17,
    padding: 15,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  statIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },

  statValue: {
    color: COLORS.green,
    fontSize: 23,
    fontWeight: "800",
    marginTop: 12,
  },

  statTitle: {
    color: COLORS.muted,
    fontSize: 11,
    marginTop: 4,
  },

  // MANAGEMENT MODULES

  moduleCard: {
    minHeight: 75,
    backgroundColor: COLORS.white,
    borderRadius: 16,
    paddingHorizontal: 14,
    marginBottom: 11,
    borderWidth: 1,
    borderColor: COLORS.border,
    flexDirection: "row",
    alignItems: "center",
  },

  moduleIcon: {
    width: 43,
    height: 43,
    borderRadius: 13,
    backgroundColor: "#F1EFE7",
    alignItems: "center",
    justifyContent: "center",
  },

  moduleText: {
    flex: 1,
    marginLeft: 12,
  },

  moduleTitle: {
    color: COLORS.green,
    fontSize: 12,
    fontWeight: "700",
  },

  moduleSubtitle: {
    color: COLORS.muted,
    fontSize: 10,
    marginTop: 5,
  },

  moduleAction: {
    color: COLORS.gold,
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 1,
    marginRight: 5,
  },

  // ERROR

  errorBox: {
    backgroundColor: "#FCEDEA",
    borderRadius: 14,
    padding: 15,
    marginBottom: 15,
  },

  errorText: {
    color: COLORS.red,
    fontSize: 12,
  },

  retryButton: {
    alignSelf: "flex-start",
    marginTop: 10,
    paddingVertical: 7,
    paddingHorizontal: 14,
    backgroundColor: COLORS.green,
    borderRadius: 9,
  },

  retryText: {
    color: COLORS.white,
    fontSize: 11,
    fontWeight: "700",
  },

  // FOOTER

  footer: {
    textAlign: "center",
    color: COLORS.gold,
    fontSize: 9,
    letterSpacing: 2,
    marginTop: 25,
    marginBottom: 15,
  },

});