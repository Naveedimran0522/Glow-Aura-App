/* Bismillah-ir-Rahman-ir-Raheem ❤️ */
/* GLOWAURA — PROFESSIONAL ADMIN BOOKING MANAGEMENT */

import React, {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  ActivityIndicator,
  Alert,
  FlatList,
  RefreshControl,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import { useRouter } from "expo-router";

import { apiRequest } from "../services/api";
import { getAuthToken } from "../services/auth";

// ==========================================
// TYPES
// ==========================================

type BookingStatus =
  | "pending"
  | "confirmed"
  | "completed"
  | "cancelled";

type PaymentStatus =
  | "unpaid"
  | "paid"
  | "refunded";

interface BookingUser {
  _id?: string;
  name?: string;
  email?: string;
  phone?: string;
}

interface Booking {
  _id: string;
  user?: BookingUser | string | null;
  serviceId: string;
  serviceName: string;
  category: string;
  artistName: string;
  appointmentDate: string;
  appointmentTime: string;
  duration: string;
  price: number;
  customerName: string;
  customerPhone: string;
  notes?: string;
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  paymentCurrency?: string;
  createdAt: string;
}

interface Pagination {
  page: number;
  currentPage: number;
  limit: number;
  total: number;
  totalBookings: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

interface BookingResponse {
  success: boolean;
  message?: string;
  bookings: Booking[];
  pagination: Pagination;
}

// ==========================================
// CONSTANTS
// ==========================================

const GREEN = "#344A3D";
const GOLD = "#B79A68";
const CREAM = "#FBF8F1";
const TEXT = "#292D29";
const MUTED = "#827D70";
const BORDER = "#EEE9DE";

const BOOKING_FILTERS = [
  "all",
  "pending",
  "confirmed",
  "completed",
  "cancelled",
];

const PAYMENT_FILTERS = [
  "all",
  "unpaid",
  "paid",
  "refunded",
];

// ==========================================
// HELPERS
// ==========================================

const formatPrice = (
  price: number,
  currency = "INR"
) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: currency.toUpperCase(),
    maximumFractionDigits: 0,
  }).format(Number(price || 0));
};

const formatDate = (date: string) => {
  if (!date) return "Date unavailable";

  const parsedDate = new Date(`${date}T00:00:00`);

  if (Number.isNaN(parsedDate.getTime())) {
    return date;
  }

  return parsedDate.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const getBookingColor = (status: BookingStatus) => {
  switch (status) {
    case "confirmed":
      return "#E5F2E8";
    case "completed":
      return "#E8EDF8";
    case "cancelled":
      return "#FBE9E7";
    default:
      return "#FFF2D9";
  }
};

const getPaymentColor = (status: PaymentStatus) => {
  switch (status) {
    case "paid":
      return "#E5F2E8";
    case "refunded":
      return "#FBE9E7";
    default:
      return "#FFF2D9";
  }
};

// ==========================================
// MAIN SCREEN
// ==========================================

export default function AdminBookingsScreen() {
  const router = useRouter();

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState("all");

  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // ========================================
  // LOAD BOOKINGS
  // ========================================

  const loadBookings = useCallback(
    async (requestedPage = 1, showLoader = true) => {
      try {
        if (showLoader) {
          setLoading(true);
        }

        const token = await getAuthToken();

        if (!token) {
          Alert.alert(
            "Session expired",
            "Please login again as an administrator."
          );

          router.replace("/login");
          return;
        }

        const params = new URLSearchParams({
          page: String(requestedPage),
          limit: "10",
          search: search.trim(),
          status: statusFilter,
          paymentStatus: paymentFilter,
        });

        const response = await apiRequest<BookingResponse>(
          `/admin/bookings?${params.toString()}`,
          "GET",
          undefined,
          token
        );

        setBookings(
          Array.isArray(response.bookings)
            ? response.bookings
            : []
        );

        setPagination(response.pagination || null);
        setPage(requestedPage);
      } catch (error: any) {
        console.error("ADMIN BOOKINGS ERROR:", error);

        Alert.alert(
          "Unable to load bookings",
          error?.message || "Please try again."
        );
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [
      router,
      search,
      statusFilter,
      paymentFilter,
    ]
  );

  // ========================================
  // INITIAL LOAD + FILTER CHANGES
  // ========================================

  useEffect(() => {
    const timer = setTimeout(() => {
      loadBookings(1);
    }, 350);

    return () => clearTimeout(timer);
  }, [loadBookings]);

  // ========================================
  // REFRESH
  // ========================================

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadBookings(1, false);
  };

  // ========================================
  // UPDATE BOOKING STATUS
  // ========================================

  const updateStatus = async (
    booking: Booking,
    newStatus: BookingStatus
  ) => {
    if (booking.status === "cancelled") {
      Alert.alert(
        "Booking cancelled",
        "Cancelled bookings cannot be reactivated."
      );
      return;
    }

    if (
      newStatus === "completed" &&
      booking.paymentStatus !== "paid"
    ) {
      Alert.alert(
        "Payment required",
        "Only paid bookings can be marked as completed."
      );
      return;
    }

    Alert.alert(
      "Confirm status update",
      `Change booking status to "${newStatus}"?`,
      [
        {
          text: "No",
          style: "cancel",
        },
        {
          text: "Yes, update",
          onPress: async () => {
            try {
              setUpdatingId(booking._id);

              const token = await getAuthToken();

              if (!token) {
                router.replace("/login");
                return;
              }

              await apiRequest(
                `/admin/bookings/${booking._id}/status`,
                "PATCH",
                { status: newStatus },
                token
              );

              Alert.alert(
                "Success",
                "Booking status updated successfully."
              );

              await loadBookings(page, false);
            } catch (error: any) {
              console.error(
                "BOOKING STATUS UPDATE ERROR:",
                error
              );

              Alert.alert(
                "Update failed",
                error?.message || "Unable to update booking."
              );
            } finally {
              setUpdatingId(null);
            }
          },
        },
      ]
    );
  };

  // ========================================
  // STATUS ACTIONS
  // ========================================

  const showStatusOptions = (booking: Booking) => {
    if (booking.status === "cancelled") {
      Alert.alert(
        "Cancelled booking",
        "This booking cannot be reactivated."
      );
      return;
    }

    const options: {
      label: string;
      value: BookingStatus;
    }[] = [];

    if (booking.status !== "pending") {
      options.push({
        label: "Mark as Pending",
        value: "pending",
      });
    }

    if (booking.status !== "confirmed") {
      options.push({
        label: "Confirm Booking",
        value: "confirmed",
      });
    }

    if (
      booking.status !== "completed" &&
      booking.paymentStatus === "paid"
    ) {
      options.push({
        label: "Mark as Completed",
        value: "completed",
      });
    }

    if (booking.status !== "cancelled") {
      options.push({
        label: "Cancel Booking",
        value: "cancelled",
      });
    }

    Alert.alert(
      "Manage Booking",
      "Select a new booking status.",
      [
        ...options.map((option) => ({
          text: option.label,
          onPress: () => updateStatus(
            booking,
            option.value
          ),
        })),
        {
          text: "Close",
          style: "cancel" as const,
        },
      ]
    );
  };

  // ========================================
  // BOOKING CARD
  // ========================================

  const renderBooking = ({
    item,
  }: {
    item: Booking;
  }) => {
    const isUpdating = updatingId === item._id;

    return (
      <View style={styles.bookingCard}>

        {/* HEADER */}

        <View style={styles.cardHeader}>
          <View style={{ flex: 1 }}>
            <Text style={styles.bookingId}>
              BOOKING ID
            </Text>

            <Text style={styles.idValue}>
              {item._id.slice(-10).toUpperCase()}
            </Text>
          </View>

          <View
            style={[
              styles.statusBadge,
              {
                backgroundColor: getBookingColor(
                  item.status
                ),
              },
            ]}
          >
            <Text style={styles.statusText}>
              {item.status.toUpperCase()}
            </Text>
          </View>
        </View>

        <View style={styles.divider} />

        {/* CUSTOMER */}

        <Text style={styles.sectionLabel}>
          CUSTOMER DETAILS
        </Text>

        <Text style={styles.customerName}>
          {item.customerName ||
            (typeof item.user === "object" && item.user?.name) ||
            "Customer"}
        </Text>

        <Text style={styles.detailText}>
          Phone: {item.customerPhone ||
            (typeof item.user === "object" && item.user?.phone) ||
            "Not provided"}
        </Text>

        {typeof item.user === "object" && item.user?.email ? (
          <Text style={styles.detailText}>
            Email: {item.user.email}
          </Text>
        ) : null}

        {/* SERVICE */}

        <View style={styles.divider} />

        <Text style={styles.sectionLabel}>
          SERVICE DETAILS
        </Text>

        <Text style={styles.serviceName}>
          {item.serviceName}
        </Text>

        <Text style={styles.detailText}>
          Category: {item.category}
        </Text>

        <Text style={styles.detailText}>
          Artist: {item.artistName}
        </Text>

        <Text style={styles.detailText}>
          Duration: {item.duration}
        </Text>

        {/* APPOINTMENT */}

        <View style={styles.appointmentBox}>
          <View style={styles.appointmentItem}>
            <Text style={styles.appointmentLabel}>
              APPOINTMENT DATE
            </Text>

            <Text style={styles.appointmentValue}>
              {formatDate(item.appointmentDate)}
            </Text>
          </View>

          <View style={styles.appointmentItem}>
            <Text style={styles.appointmentLabel}>
              TIME
            </Text>

            <Text style={styles.appointmentValue}>
              {item.appointmentTime}
            </Text>
          </View>
        </View>

        {/* PAYMENT */}

        <View style={styles.paymentRow}>
          <View>
            <Text style={styles.sectionLabel}>
              BOOKING AMOUNT
            </Text>

            <Text style={styles.price}>
              {formatPrice(
                item.price,
                item.paymentCurrency || "INR"
              )}
            </Text>
          </View>

          <View
            style={[
              styles.paymentBadge,
              {
                backgroundColor: getPaymentColor(
                  item.paymentStatus
                ),
              },
            ]}
          >
            <Text style={styles.paymentText}>
              {item.paymentStatus.toUpperCase()}
            </Text>
          </View>
        </View>

        {/* NOTES */}

        {item.notes ? (
          <View style={styles.notesBox}>
            <Text style={styles.sectionLabel}>
              CUSTOMER NOTES
            </Text>

            <Text style={styles.detailText}>
              {item.notes}
            </Text>
          </View>
        ) : null}

        {/* ACTION */}

        <TouchableOpacity
          style={[
            styles.actionButton,
            (isUpdating || item.status === "cancelled") &&
              styles.disabledButton,
          ]}
          disabled={
            isUpdating || item.status === "cancelled"
          }
          onPress={() => showStatusOptions(item)}
          activeOpacity={0.8}
        >
          {isUpdating ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.actionButtonText}>
              {item.status === "cancelled"
                ? "BOOKING CANCELLED"
                : "MANAGE BOOKING STATUS"}
            </Text>
          )}
        </TouchableOpacity>

      </View>
    );
  };

  // ========================================
  // EMPTY STATE
  // ========================================

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyIcon}>✦</Text>

      <Text style={styles.emptyTitle}>
        No Bookings Found
      </Text>

      <Text style={styles.emptyText}>
        No bookings match your current search or filters.
      </Text>
    </View>
  );

  // ========================================
  // MAIN UI
  // ========================================

  return (
    <SafeAreaView
      style={styles.safeArea}
      edges={["top", "bottom", "left", "right"]}
    >
      <StatusBar
        backgroundColor={GREEN}
        barStyle="light-content"
      />

      {/* HEADER */}

      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
          activeOpacity={0.7}
        >
          <Text style={styles.backText}>‹</Text>
        </TouchableOpacity>

        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>
            Booking Management
          </Text>

          <Text style={styles.headerSubtitle}>
            GlowAura Admin Panel
          </Text>
        </View>

        <Text style={styles.headerIcon}>✦</Text>
      </View>

      {/* SUMMARY */}

      <View style={styles.summaryCard}>
        <Text style={styles.summaryLabel}>
          TOTAL BOOKINGS
        </Text>

        <Text style={styles.summaryValue}>
          {pagination?.totalBookings ?? 0}
        </Text>

        <Text style={styles.summaryDescription}>
          All customer appointments
        </Text>
      </View>

      {/* SEARCH */}

      <View style={styles.searchContainer}>
        <Text style={styles.searchIcon}>⌕</Text>

        <TextInput
          style={styles.searchInput}
          placeholder="Search customer, service, artist..."
          placeholderTextColor="#A49D91"
          value={search}
          onChangeText={setSearch}
          autoCapitalize="none"
          returnKeyType="search"
        />

        {search.length > 0 ? (
          <TouchableOpacity
            onPress={() => setSearch("")}
          >
            <Text style={styles.clearSearch}>✕</Text>
          </TouchableOpacity>
        ) : null}
      </View>

      {/* FILTERS */}

      <View style={styles.filtersContainer}>
        <Text style={styles.filterTitle}>
          BOOKING STATUS
        </Text>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScroll}
        >
          {BOOKING_FILTERS.map((filter) => {
            const selected = statusFilter === filter;

            return (
              <TouchableOpacity
                key={filter}
                onPress={() => setStatusFilter(filter)}
                style={[
                  styles.filterChip,
                  selected && styles.selectedFilter,
                ]}
              >
                <Text
                  style={[
                    styles.filterText,
                    selected && styles.selectedFilterText,
                  ]}
                >
                  {filter.toUpperCase()}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        <Text style={styles.filterTitle}>
          PAYMENT STATUS
        </Text>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScroll}
        >
          {PAYMENT_FILTERS.map((filter) => {
            const selected = paymentFilter === filter;

            return (
              <TouchableOpacity
                key={filter}
                onPress={() => setPaymentFilter(filter)}
                style={[
                  styles.filterChip,
                  selected && styles.selectedFilter,
                ]}
              >
                <Text
                  style={[
                    styles.filterText,
                    selected && styles.selectedFilterText,
                  ]}
                >
                  {filter.toUpperCase()}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* BOOKING LIST */}

      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator
            size="large"
            color={GREEN}
          />

          <Text style={styles.loaderText}>
            Loading bookings...
          </Text>
        </View>
      ) : (
        <FlatList
          data={bookings}
          keyExtractor={(item) => item._id}
          renderItem={renderBooking}
          ListEmptyComponent={renderEmpty}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor={GREEN}
            />
          }
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        />
      )}

      {/* PAGINATION */}

      {!loading && pagination && pagination.totalPages > 1 ? (
        <View style={styles.paginationContainer}>
          <TouchableOpacity
            style={[
              styles.pageButton,
              !pagination.hasPreviousPage &&
                styles.pageButtonDisabled,
            ]}
            disabled={!pagination.hasPreviousPage}
            onPress={() => loadBookings(page - 1)}
          >
            <Text style={styles.pageButtonText}>
              Previous
            </Text>
          </TouchableOpacity>

          <Text style={styles.pageInfo}>
            {page} / {pagination.totalPages}
          </Text>

          <TouchableOpacity
            style={[
              styles.pageButton,
              !pagination.hasNextPage &&
                styles.pageButtonDisabled,
            ]}
            disabled={!pagination.hasNextPage}
            onPress={() => loadBookings(page + 1)}
          >
            <Text style={styles.pageButtonText}>
              Next
            </Text>
          </TouchableOpacity>
        </View>
      ) : null}

    </SafeAreaView>
  );
}

// ==========================================
// STYLES
// ==========================================

const styles = StyleSheet.create({

  safeArea: {
    flex: 1,
    backgroundColor: CREAM,
  },

  header: {
    backgroundColor: GREEN,
    paddingHorizontal: 18,
    paddingVertical: 18,
    flexDirection: "row",
    alignItems: "center",
  },

  backButton: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.12)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  backText: {
    color: "#FFFFFF",
    fontSize: 32,
    lineHeight: 35,
  },

  headerTitle: {
    color: "#FFFFFF",
    fontSize: 19,
    fontWeight: "800",
  },

  headerSubtitle: {
    color: "#E2D8C4",
    fontSize: 12,
    marginTop: 3,
  },

  headerIcon: {
    color: GOLD,
    fontSize: 27,
  },

  summaryCard: {
    backgroundColor: GREEN,
    marginHorizontal: 16,
    marginTop: 16,
    padding: 19,
    borderRadius: 17,
    borderWidth: 1,
    borderColor: GOLD,
  },

  summaryLabel: {
    color: "#E7DDC9",
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1.2,
  },

  summaryValue: {
    color: "#FFFFFF",
    fontSize: 34,
    fontWeight: "900",
    marginTop: 5,
  },

  summaryDescription: {
    color: "#E7DDC9",
    fontSize: 12,
    marginTop: 3,
  },

  searchContainer: {
    marginHorizontal: 16,
    marginTop: 16,
    paddingHorizontal: 13,
    height: 50,
    backgroundColor: "#FFFFFF",
    borderRadius: 13,
    borderWidth: 1,
    borderColor: BORDER,
    flexDirection: "row",
    alignItems: "center",
  },

  searchIcon: {
    color: GREEN,
    fontSize: 27,
    marginRight: 9,
  },

  searchInput: {
    flex: 1,
    color: TEXT,
    fontSize: 13,
    paddingVertical: 0,
  },

  clearSearch: {
    color: MUTED,
    fontSize: 17,
    padding: 5,
  },

  filtersContainer: {
    marginTop: 17,
  },

  filterTitle: {
    color: MUTED,
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1,
    marginHorizontal: 17,
    marginBottom: 9,
  },

  filterScroll: {
    paddingHorizontal: 16,
    paddingBottom: 14,
    gap: 8,
  },

  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: BORDER,
  },

  selectedFilter: {
    backgroundColor: GREEN,
    borderColor: GREEN,
  },

  filterText: {
    color: MUTED,
    fontSize: 10,
    fontWeight: "700",
  },

  selectedFilterText: {
    color: "#FFFFFF",
  },

  listContent: {
    paddingHorizontal: 16,
    paddingTop: 3,
    paddingBottom: 25,
    flexGrow: 1,
  },

  bookingCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 17,
    borderWidth: 1,
    borderColor: BORDER,
    padding: 16,
    marginBottom: 14,
  },

  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  bookingId: {
    color: MUTED,
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 1,
  },

  idValue: {
    color: GREEN,
    fontSize: 14,
    fontWeight: "900",
    marginTop: 4,
  },

  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 8,
  },

  statusText: {
    color: TEXT,
    fontSize: 9,
    fontWeight: "900",
  },

  divider: {
    height: 1,
    backgroundColor: BORDER,
    marginVertical: 14,
  },

  sectionLabel: {
    color: MUTED,
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 1,
    marginBottom: 6,
  },

  customerName: {
    color: TEXT,
    fontSize: 17,
    fontWeight: "800",
    marginBottom: 5,
  },

  detailText: {
    color: MUTED,
    fontSize: 12,
    lineHeight: 19,
  },

  serviceName: {
    color: GREEN,
    fontSize: 15,
    fontWeight: "800",
    marginBottom: 5,
  },

  appointmentBox: {
    flexDirection: "row",
    backgroundColor: CREAM,
    padding: 13,
    borderRadius: 12,
    marginTop: 15,
  },

  appointmentItem: {
    flex: 1,
  },

  appointmentLabel: {
    color: MUTED,
    fontSize: 9,
    fontWeight: "800",
  },

  appointmentValue: {
    color: GREEN,
    fontSize: 13,
    fontWeight: "800",
    marginTop: 6,
  },

  paymentRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 16,
  },

  price: {
    color: GREEN,
    fontSize: 21,
    fontWeight: "900",
  },

  paymentBadge: {
    paddingHorizontal: 11,
    paddingVertical: 8,
    borderRadius: 8,
  },

  paymentText: {
    color: TEXT,
    fontSize: 10,
    fontWeight: "900",
  },

  notesBox: {
    marginTop: 15,
    padding: 12,
    backgroundColor: CREAM,
    borderRadius: 10,
  },

  actionButton: {
    backgroundColor: GREEN,
    paddingVertical: 14,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 17,
  },

  disabledButton: {
    backgroundColor: "#999999",
  },

  actionButtonText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 0.5,
  },

  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  loaderText: {
    color: MUTED,
    fontSize: 13,
    marginTop: 12,
  },

  emptyContainer: {
    flex: 1,
    minHeight: 220,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 25,
  },

  emptyIcon: {
    fontSize: 38,
    color: GOLD,
  },

  emptyTitle: {
    color: GREEN,
    fontSize: 18,
    fontWeight: "900",
    marginTop: 12,
  },

  emptyText: {
    color: MUTED,
    fontSize: 12,
    textAlign: "center",
    lineHeight: 19,
    marginTop: 7,
  },

  paginationContainer: {
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: BORDER,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  pageButton: {
    backgroundColor: GREEN,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 9,
  },

  pageButtonDisabled: {
    backgroundColor: "#B8B8B8",
  },

  pageButtonText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "800",
  },

  pageInfo: {
    color: GREEN,
    fontSize: 12,
    fontWeight: "800",
  },

});