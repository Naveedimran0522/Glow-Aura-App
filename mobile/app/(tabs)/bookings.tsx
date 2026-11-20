/* Bismillah-ir-Rahman-ir-Raheem ❤️ */
/* GLOWAURA — MY BOOKINGS SCREEN */
/* Auto Refresh + Payment Confirmation + Booking Alarm Reminders */

import React, {
  useCallback,
  useState,
} from "react";

import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import { useFocusEffect } from "expo-router";

import {
  getMyBookings,
  cancelMyBooking,
} from "../../services/booking";

import {
  syncBookingReminders,
  cancelBookingReminder,
} from "../../services/notification";

type Booking = {
  _id: string;
  serviceName: string;
  category: string;
  artistName: string;
  appointmentDate: string;
  appointmentTime: string;
  duration: string;
  price: number;
  status: string;
  paymentStatus?: string;
};

function extractBookings(response: any): Booking[] {
  const data = response?.data ?? response;

  if (Array.isArray(data?.bookings)) {
    return data.bookings;
  }

  if (Array.isArray(data?.data?.bookings)) {
    return data.data.bookings;
  }

  if (Array.isArray(data)) {
    return data;
  }

  return [];
}

export default function BookingsScreen() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [cancellingId, setCancellingId] = useState("");

  // Bismillah ❤️
  // Fetch latest bookings and synchronize reminders.

  const loadBookings = useCallback(async (
    showLoader = false,
    silent = false
  ) => {
    try {
      if (showLoader) {
        setLoading(true);
      }

      const response: any = await getMyBookings();

      const latestBookings = extractBookings(response);

      // Schedule/cancel reminders according to current booking status.
      await syncBookingReminders(latestBookings);

      setBookings(latestBookings);

      console.log(
        "GLOWAURA — BOOKINGS UPDATED:",
        latestBookings.length
      );

      console.log(
        "GLOWAURA — LATEST BOOKINGS:",
        latestBookings
      );

    } catch (error: any) {
      console.error("BOOKINGS FETCH ERROR:", error);

      if (!silent) {
        Alert.alert(
          "Unable to load bookings",
          error?.message || "Please login and try again."
        );
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  // Bismillah ❤️
  // Automatically refresh whenever My Bookings becomes active.

  useFocusEffect(
    useCallback(() => {
      loadBookings(true, true);

      return () => {
        // No cleanup required.
      };
    }, [loadBookings])
  );

  // Bismillah ❤️
  // Pull-to-refresh.

  const refresh = useCallback(() => {
    setRefreshing(true);
    loadBookings(false, false);
  }, [loadBookings]);

  // Bismillah ❤️
  // Cancel booking + its scheduled alarm reminder.

  const handleCancel = useCallback((bookingId: string) => {
    Alert.alert(
      "Cancel Appointment",
      "Are you sure you want to cancel this booking?",
      [
        {
          text: "Keep Booking",
          style: "cancel",
        },
        {
          text: "Cancel Booking",
          style: "destructive",

          onPress: async () => {
            try {
              setCancellingId(bookingId);

              // First cancel booking on backend.
              await cancelMyBooking(bookingId);

              // Then cancel its scheduled local reminder.
              await cancelBookingReminder(bookingId);

              Alert.alert(
                "Booking Cancelled",
                "Your appointment and its reminder have been cancelled successfully."
              );

              // Fetch updated bookings and synchronize reminders.
              await loadBookings(false, true);

            } catch (error: any) {
              console.error("BOOKING CANCEL ERROR:", error);

              Alert.alert(
                "Cancellation Failed",
                error?.message || "Unable to cancel booking."
              );
            } finally {
              setCancellingId("");
            }
          },
        },
      ]
    );
  }, [loadBookings]);

  // Bismillah ❤️
  // Format appointment date safely.

  const formatAppointmentDate = (date: string) => {
    if (!date) return "Date unavailable";

    const normalizedDate = String(date).split("T")[0];

    const [year, month, day] = normalizedDate
      .split("-")
      .map(Number);

    if (!year || !month || !day) {
      const parsed = new Date(date);

      if (Number.isNaN(parsed.getTime())) {
        return date;
      }

      return parsed.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    }

    return new Date(
      year,
      month - 1,
      day
    ).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  // Bismillah ❤️
  // Status colors.

  const statusColor = (status: string) => {
    switch (String(status || "").toLowerCase()) {
      case "confirmed":
        return "#527A52";

      case "cancelled":
        return "#B65D52";

      case "completed":
        return "#758A70";

      case "pending_payment":
        return "#B18A43";

      default:
        return "#B18A43";
    }
  };

  const paymentColor = (paymentStatus?: string) => {
    switch (String(paymentStatus || "").toLowerCase()) {
      case "paid":
        return "#527A52";

      case "failed":
        return "#B65D52";

      default:
        return "#B18A43";
    }
  };

  // Bismillah ❤️
  // Initial loading screen.

  if (loading) {
    return (
      <SafeAreaView
        style={styles.loading}
        edges={["top", "bottom", "left", "right"]}
      >
        <ActivityIndicator
          size="large"
          color="#758A70"
        />

        <Text style={styles.loadingText}>
          Loading your appointments...
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={styles.screen}
      edges={["top", "bottom", "left", "right"]}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={refresh}
            colors={["#758A70"]}
            tintColor="#758A70"
          />
        }
      >
        {/* HEADER */}

        <Text style={styles.eyebrow}>
          YOUR BEAUTY JOURNEY
        </Text>

        <Text style={styles.title}>
          My Bookings
        </Text>

        <Text style={styles.subtitle}>
          All your appointments, together in one place.
        </Text>

        {/* BOOKING COUNT */}

        <View style={styles.countCard}>
          <View>
            <Text style={styles.countLabel}>
              TOTAL APPOINTMENTS
            </Text>

            <Text style={styles.countNumber}>
              {bookings.length}
            </Text>
          </View>

          <Text style={styles.countIcon}>
            ♡
          </Text>
        </View>

        {/* EMPTY STATE */}

        {bookings.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>
              ♡
            </Text>

            <Text style={styles.emptyTitle}>
              No bookings yet
            </Text>

            <Text style={styles.emptyDescription}>
              Your confirmed appointment requests will appear here.
              Book your first beauty experience with GlowAura.
            </Text>

            <TouchableOpacity
              style={styles.emptyRefreshButton}
              onPress={refresh}
              disabled={refreshing}
            >
              {refreshing ? (
                <ActivityIndicator color="#758A70" />
              ) : (
                <Text style={styles.refreshText}>
                  Refresh Bookings ↻
                </Text>
              )}
            </TouchableOpacity>
          </View>
        ) : (
          bookings.map((booking) => {
            const bookingStatus = String(
              booking.status || "pending"
            ).toLowerCase();

            const canCancel = [
              "pending",
              "confirmed",
            ].includes(bookingStatus);

            const isCancelling =
              cancellingId === booking._id;

            return (
              <View
                key={booking._id}
                style={styles.card}
              >
                {/* CARD HEADER */}

                <View style={styles.cardHeader}>
                  <Text style={styles.category}>
                    {booking.category || "BEAUTY SERVICE"}
                  </Text>

                  <View
                    style={[
                      styles.statusBadge,
                      {
                        backgroundColor:
                          `${statusColor(bookingStatus)}15`,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.status,
                        {
                          color: statusColor(bookingStatus),
                        },
                      ]}
                    >
                      {bookingStatus.replace(/_/g, " ").toUpperCase()}
                    </Text>
                  </View>
                </View>

                {/* SERVICE */}

                <Text style={styles.serviceName}>
                  {booking.serviceName || "Beauty Appointment"}
                </Text>

                <View style={styles.divider} />

                {/* DETAILS */}

                <View style={styles.detailRow}>
                  <Text style={styles.label}>
                    Artist
                  </Text>

                  <Text style={styles.value}>
                    {booking.artistName || "Not assigned"}
                  </Text>
                </View>

                <View style={styles.detailRow}>
                  <Text style={styles.label}>
                    Date
                  </Text>

                  <Text style={styles.value}>
                    {formatAppointmentDate(
                      booking.appointmentDate
                    )}
                  </Text>
                </View>

                <View style={styles.detailRow}>
                  <Text style={styles.label}>
                    Time
                  </Text>

                  <Text style={styles.value}>
                    {booking.appointmentTime || "Not available"}
                  </Text>
                </View>

                <View style={styles.detailRow}>
                  <Text style={styles.label}>
                    Duration
                  </Text>

                  <Text style={styles.value}>
                    {booking.duration || "Not available"}
                  </Text>
                </View>

                {/* PAYMENT STATUS */}

                {booking.paymentStatus ? (
                  <View style={styles.paymentStatusRow}>
                    <Text style={styles.label}>
                      Payment
                    </Text>

                    <Text
                      style={[
                        styles.paymentStatus,
                        {
                          color: paymentColor(
                            booking.paymentStatus
                          ),
                        },
                      ]}
                    >
                      {booking.paymentStatus.toUpperCase()}
                    </Text>
                  </View>
                ) : null}

                {/* PRICE */}

                <View style={styles.priceRow}>
                  <Text style={styles.totalLabel}>
                    Total Amount
                  </Text>

                  <Text style={styles.price}>
                    ₹{Number(
                      booking.price || 0
                    ).toLocaleString("en-IN")}
                  </Text>
                </View>

                {/* CANCEL BUTTON */}

                {canCancel && (
                  <TouchableOpacity
                    style={[
                      styles.cancelButton,
                      isCancelling && styles.disabledButton,
                    ]}
                    onPress={() => handleCancel(booking._id)}
                    disabled={isCancelling}
                  >
                    {isCancelling ? (
                      <ActivityIndicator color="#B65D52" />
                    ) : (
                      <Text style={styles.cancelText}>
                        Cancel Booking
                      </Text>
                    )}
                  </TouchableOpacity>
                )}
              </View>
            );
          })
        )}

        {/* REFRESH BUTTON */}

        {bookings.length > 0 && (
          <TouchableOpacity
            style={styles.refreshButton}
            onPress={refresh}
            disabled={refreshing}
          >
            {refreshing ? (
              <ActivityIndicator color="#758A70" />
            ) : (
              <Text style={styles.refreshText}>
                Refresh Bookings ↻
              </Text>
            )}
          </TouchableOpacity>
        )}

        <Text style={styles.footer}>
          Made with ❤️ by GlowAura
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#FBF8F1",
  },

  content: {
    padding: 20,
    paddingTop: 55,
    paddingBottom: 35,
  },

  loading: {
    flex: 1,
    backgroundColor: "#FBF8F1",
    justifyContent: "center",
    alignItems: "center",
  },

  loadingText: {
    color: "#758A70",
    fontSize: 12,
    marginTop: 12,
  },

  eyebrow: {
    color: "#B79A68",
    fontSize: 9,
    letterSpacing: 2,
  },

  title: {
    color: "#34483A",
    fontFamily: "Georgia",
    fontSize: 31,
    marginTop: 9,
  },

  subtitle: {
    color: "#898579",
    fontSize: 12,
    marginTop: 8,
    marginBottom: 20,
  },

  countCard: {
    backgroundColor: "#34483A",
    borderRadius: 18,
    padding: 20,
    marginBottom: 22,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  countLabel: {
    color: "#D8C9A9",
    fontSize: 9,
    letterSpacing: 1.5,
  },

  countNumber: {
    color: "#FFFFFF",
    fontSize: 30,
    fontWeight: "900",
    marginTop: 5,
  },

  countIcon: {
    color: "#E8C783",
    fontSize: 42,
  },

  empty: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 30,
    alignItems: "center",
    marginTop: 10,
    borderWidth: 1,
    borderColor: "#EEE9DE",
  },

  emptyIcon: {
    color: "#B79A68",
    fontSize: 45,
  },

  emptyTitle: {
    color: "#34483A",
    fontFamily: "Georgia",
    fontSize: 21,
    marginTop: 15,
  },

  emptyDescription: {
    color: "#898579",
    fontSize: 11,
    textAlign: "center",
    lineHeight: 19,
    marginTop: 8,
  },

  emptyRefreshButton: {
    padding: 15,
    marginTop: 8,
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 16,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#EEE9DE",
  },

  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  category: {
    color: "#B79A68",
    fontSize: 9,
    letterSpacing: 1,
    flexShrink: 1,
  },

  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
  },

  status: {
    fontSize: 9,
    fontWeight: "800",
  },

  serviceName: {
    color: "#34483A",
    fontFamily: "Georgia",
    fontSize: 20,
    marginTop: 12,
  },

  divider: {
    height: 1,
    backgroundColor: "#EEE9DE",
    marginVertical: 14,
  },

  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },

  label: {
    color: "#999487",
    fontSize: 10,
  },

  value: {
    color: "#52634F",
    fontSize: 10,
    fontWeight: "600",
    textAlign: "right",
    flexShrink: 1,
  },

  paymentStatusRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingBottom: 12,
  },

  paymentStatus: {
    fontSize: 10,
    fontWeight: "900",
  },

  priceRow: {
    borderTopWidth: 1,
    borderTopColor: "#EEE9DE",
    paddingTop: 14,
    marginTop: 3,
    flexDirection: "row",
    justifyContent: "space-between",
  },

  totalLabel: {
    color: "#34483A",
    fontSize: 12,
    fontWeight: "700",
  },

  price: {
    color: "#34483A",
    fontSize: 17,
    fontWeight: "700",
  },

  cancelButton: {
    borderWidth: 1,
    borderColor: "#E7D5D0",
    padding: 12,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 15,
  },

  cancelText: {
    color: "#B65D52",
    fontSize: 11,
    fontWeight: "700",
  },

  disabledButton: {
    opacity: 0.5,
  },

  refreshButton: {
    alignItems: "center",
    padding: 15,
  },

  refreshText: {
    color: "#758A70",
    fontSize: 11,
    fontWeight: "700",
  },

  footer: {
    color: "#B5A69A",
    fontSize: 10,
    textAlign: "center",
    marginTop: 20,
  },
});