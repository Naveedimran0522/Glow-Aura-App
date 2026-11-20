/* Bismillah-ir-Rahman-ir-Raheem ❤️ */
/* GLOWAURA — COMPLETE APPOINTMENT BOOKING SCREEN */
/* Booking Notification + Safe Area Integrated */

import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  ActivityIndicator,
  Alert,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import DateTimePicker from "@react-native-community/datetimepicker";
import { LinearGradient } from "expo-linear-gradient";
import {
  useLocalSearchParams,
  useRouter,
} from "expo-router";

import { beautyServices } from "../../constants/services";

import {
  createBooking,
  getArtistAvailability,
} from "../../services/booking";

import {
  sendBookingCreatedNotification,
} from "../../services/notification";

/* =========================================
   TYPES
========================================= */

type BusyInterval = {
  startTime: string;
  startMinutes: number;
  endMinutes: number;
};

type AvailabilityResponse = {
  success?: boolean;
  artistName?: string;
  appointmentDate?: string;
  bookedSlots?: string[];
  busyIntervals?: BusyInterval[];
};

type BookingPayload = {
  serviceId: string;
  artistName: string;
  appointmentDate: string;
  appointmentTime: string;
  customerName: string;
  customerPhone: string;
  notes: string;
};

/* =========================================
   CONSTANTS
========================================= */

const COLORS = {
  background: "#FBF8F1",
  white: "#FFFFFF",
  green: "#344A3D",
  gold: "#B79A68",
  text: "#292D29",
  muted: "#827D70",
  border: "#E9E2D6",
  lightGreen: "#EAF0E9",
  unavailable: "#F4E8E5",
  red: "#B85C50",
};

const TIME_SLOTS = [
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
];

/* =========================================
   DATE HELPERS
========================================= */

const formatDate = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const formatDisplayDate = (date: Date) => {
  return date.toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

const getTomorrow = () => {
  const date = new Date();
  date.setDate(date.getDate() + 1);
  date.setHours(0, 0, 0, 0);
  return date;
};

const timeToMinutes = (time: string) => {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
};

const durationToMinutes = (duration: string) => {
  const value = duration.toLowerCase().trim();

  const hoursMatch = value.match(
    /(\d+(?:\.\d+)?)\s*hours?/
  );

  if (hoursMatch) {
    return Math.round(Number(hoursMatch[1]) * 60);
  }

  const minutesMatch = value.match(
    /(\d+(?:\.\d+)?)\s*minutes?/
  );

  if (minutesMatch) {
    return Math.round(Number(minutesMatch[1]));
  }

  return 60;
};

const isOverlapping = (
  selectedStart: number,
  selectedDuration: number,
  busyStart: number,
  busyEnd: number
) => {
  const selectedEnd = selectedStart + selectedDuration;

  return (
    selectedStart < busyEnd &&
    selectedEnd > busyStart
  );
};

/* =========================================
   RESPONSE HELPERS
========================================= */

const extractBookingId = (response: any): string | null => {
  const candidates = [
    response?.booking?._id,
    response?.data?.booking?._id,
    response?.data?.data?.booking?._id,
    response?.data?._id,
    response?.data?.data?._id,
    response?._id,
  ];

  const id = candidates.find(
    (value) => typeof value === "string" && value.length > 0
  );

  return id || null;
};

/* =========================================
   BOOKING SCREEN
========================================= */

export default function BookingScreen() {
  const router = useRouter();

  const { id } = useLocalSearchParams<{
    id: string;
  }>();

  /* SERVICE */

  const service = useMemo(() => {
    const serviceId = Array.isArray(id) ? id[0] : id;

    return beautyServices.find(
      (item) => item.id === serviceId
    );
  }, [id]);

  /* FORM STATES */

  const [appointmentDate, setAppointmentDate] =
    useState<Date>(getTomorrow());

  const [selectedTime, setSelectedTime] =
    useState("");

  const [customerName, setCustomerName] =
    useState("");

  const [customerPhone, setCustomerPhone] =
    useState("");

  const [notes, setNotes] = useState("");

  const [showDatePicker, setShowDatePicker] =
    useState(false);

  /* AVAILABILITY STATES */

  const [bookedSlots, setBookedSlots] =
    useState<string[]>([]);

  const [busyIntervals, setBusyIntervals] =
    useState<BusyInterval[]>([]);

  const [loadingAvailability, setLoadingAvailability] =
    useState(false);

  const [availabilityError, setAvailabilityError] =
    useState("");

  /* BOOKING STATE */

  const [submitting, setSubmitting] =
    useState(false);

  /* SERVICE DURATION */

  const serviceDuration = useMemo(() => {
    if (!service) return 60;

    return durationToMinutes(service.duration);
  }, [service]);

  /* =========================================
     LOAD ARTIST AVAILABILITY
  ========================================= */

  const loadAvailability = useCallback(async () => {
    if (!service) return;

    setLoadingAvailability(true);
    setAvailabilityError("");

    try {
      const dateString = formatDate(appointmentDate);

      const response =
        await getArtistAvailability(
          service.artist,
          dateString
        );

      const availability =
        response as AvailabilityResponse;

      setBookedSlots(
        Array.isArray(availability?.bookedSlots)
          ? availability.bookedSlots
          : []
      );

      setBusyIntervals(
        Array.isArray(availability?.busyIntervals)
          ? availability.busyIntervals
          : []
      );
    } catch (error: any) {
      console.log(
        "GlowAura availability error:",
        error
      );

      setBookedSlots([]);
      setBusyIntervals([]);

      setAvailabilityError(
        error?.message ||
          "Unable to load artist availability. Please try again."
      );
    } finally {
      setLoadingAvailability(false);
    }
  }, [service, appointmentDate]);

  useEffect(() => {
    loadAvailability();
  }, [loadAvailability]);

  /* =========================================
     CHECK SLOT AVAILABILITY
  ========================================= */

  const isSlotUnavailable = useCallback(
    (slot: string) => {
      if (!service) return true;

      if (bookedSlots.includes(slot)) {
        return true;
      }

      const slotStart = timeToMinutes(slot);

      return busyIntervals.some((interval) => {
        return isOverlapping(
          slotStart,
          serviceDuration,
          interval.startMinutes,
          interval.endMinutes
        );
      });
    },
    [service, bookedSlots, busyIntervals, serviceDuration]
  );

  /* =========================================
     DATE CHANGE
  ========================================= */

  const handleDateChange = (
    event: any,
    selectedDate?: Date
  ) => {
    setShowDatePicker(false);

    if (event?.type === "dismissed" || !selectedDate) {
      return;
    }

    selectedDate.setHours(0, 0, 0, 0);

    setAppointmentDate(selectedDate);
    setSelectedTime("");
  };

  /* =========================================
     VALIDATE FORM
  ========================================= */

  const validateForm = () => {
    if (!customerName.trim()) {
      Alert.alert(
        "Name Required",
        "Please enter your full name."
      );
      return false;
    }

    if (customerName.trim().length < 2) {
      Alert.alert(
        "Invalid Name",
        "Please enter a valid name."
      );
      return false;
    }

    const phone = customerPhone.replace(/\D/g, "");

    if (phone.length !== 10) {
      Alert.alert(
        "Invalid Phone Number",
        "Please enter a valid 10-digit mobile number."
      );
      return false;
    }

    if (!selectedTime) {
      Alert.alert(
        "Select Time",
        "Please select your appointment time."
      );
      return false;
    }

    if (availabilityError) {
      Alert.alert(
        "Availability Unavailable",
        "Please refresh artist availability before booking."
      );
      return false;
    }

    if (isSlotUnavailable(selectedTime)) {
      Alert.alert(
        "Slot Unavailable",
        "This time slot is already booked. Please select another time."
      );
      setSelectedTime("");
      loadAvailability();
      return false;
    }

    return true;
  };

  /* =========================================
     CREATE BOOKING
  ========================================= */

  const handleBooking = async () => {
    if (!service || submitting) return;

    if (!validateForm()) return;

    setSubmitting(true);

    try {
      /*
       * Refresh availability immediately before booking.
       */

      const dateString = formatDate(appointmentDate);

      const latestResponse =
        await getArtistAvailability(
          service.artist,
          dateString
        );

      const latestAvailability =
        latestResponse as AvailabilityResponse;

      const latestBookedSlots =
        Array.isArray(latestAvailability?.bookedSlots)
          ? latestAvailability.bookedSlots
          : [];

      const latestBusyIntervals =
        Array.isArray(latestAvailability?.busyIntervals)
          ? latestAvailability.busyIntervals
          : [];

      const selectedStart =
        timeToMinutes(selectedTime);

      const latestConflict =
        latestBookedSlots.includes(selectedTime) ||
        latestBusyIntervals.some((interval) =>
          isOverlapping(
            selectedStart,
            serviceDuration,
            interval.startMinutes,
            interval.endMinutes
          )
        );

      setBookedSlots(latestBookedSlots);
      setBusyIntervals(latestBusyIntervals);

      if (latestConflict) {
        setSelectedTime("");

        Alert.alert(
          "Slot Just Booked",
          "Sorry, this slot is no longer available. Please choose another time."
        );

        return;
      }

      const bookingData: BookingPayload = {
        serviceId: service.id,
        artistName: service.artist,
        appointmentDate: dateString,
        appointmentTime: selectedTime,
        customerName: customerName.trim(),
        customerPhone: customerPhone.replace(/\D/g, ""),
        notes: notes.trim(),
      };

      const response = await createBooking(bookingData);

      const bookingId = extractBookingId(response);

      if (!bookingId) {
        console.log(
          "Booking response did not contain an ID:",
          response
        );

        Alert.alert(
          "Booking Response",
          "The server response did not include a booking ID. Please check My Bookings before trying again."
        );

        return;
      }

      /*
       * BOOKING CREATED NOTIFICATION
       *
       * Notification failure must not cancel
       * or block the successfully created booking.
       */

      try {
        const notificationId =
          await sendBookingCreatedNotification(
            service.title,
            dateString,
            selectedTime,
            bookingId
          );

        if (notificationId) {
          console.log(
            "GlowAura booking notification scheduled:",
            notificationId
          );
        } else {
          console.log(
            "GlowAura booking notification was not scheduled."
          );
        }
      } catch (notificationError) {
        console.warn(
          "GlowAura booking notification error:",
          notificationError
        );
      }

      Alert.alert(
        "Booking Created ❤️",
        "Your appointment has been reserved. Continue to payment.",
        [
          {
            text: "Continue",
            onPress: () => {
              router.push({
                pathname: "/payment/[id]",
                params: {
                  id: bookingId,
                },
              });
            },
          },
        ]
      );
    } catch (error: any) {
      console.log(
        "GlowAura booking error:",
        error
      );

      const message =
        error?.message ||
        "Something went wrong while creating your booking.";

      Alert.alert(
        "Booking Failed",
        message
      );

      loadAvailability();
    } finally {
      setSubmitting(false);
    }
  };

  /* =========================================
     SERVICE NOT FOUND
  ========================================= */

  if (!service) {
    return (
      <SafeAreaView
        style={styles.safeArea}
        edges={["top", "bottom", "left", "right"]}
      >
        <StatusBar
          barStyle="dark-content"
          backgroundColor={COLORS.background}
        />

        <View style={styles.centerContainer}>
          <Text style={styles.errorTitle}>
            Service Not Found
          </Text>

          <Text style={styles.errorDescription}>
            This beauty service is unavailable.
          </Text>

          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backButtonText}>
              Go Back
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  /* =========================================
     MAIN UI
  ========================================= */

  return (
    <SafeAreaView
      style={styles.safeArea}
      edges={["top", "bottom", "left", "right"]}
    >
      <StatusBar
        barStyle="dark-content"
        backgroundColor={COLORS.background}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* HEADER */}

        <View style={styles.header}>
          <TouchableOpacity
            style={styles.headerBack}
            onPress={() => router.back()}
          >
            <Text style={styles.headerBackText}>
              ‹
            </Text>
          </TouchableOpacity>

          <View>
            <Text style={styles.brand}>
              GLOWAURA
            </Text>

            <Text style={styles.headerSubtitle}>
              Your beauty, your moment
            </Text>
          </View>
        </View>

        {/* PAGE TITLE */}

        <View style={styles.headingSection}>
          <Text style={styles.eyebrow}>
            APPOINTMENT
          </Text>

          <Text style={styles.heading}>
            Book Your Beauty
          </Text>

          <Text style={styles.subheading}>
            Choose your preferred date and time.
          </Text>
        </View>

        {/* SERVICE CARD */}

        <LinearGradient
          colors={["#405B49", "#344A3D"]}
          style={styles.serviceCard}
        >
          <Text style={styles.serviceLabel}>
            SELECTED SERVICE
          </Text>

          <Text style={styles.serviceName}>
            {service.title}
          </Text>

          <View style={styles.serviceDivider} />

          <View style={styles.serviceDetails}>
            <View>
              <Text style={styles.detailLabel}>
                BEAUTY ARTIST
              </Text>

              <Text style={styles.detailValue}>
                {service.artist}
              </Text>
            </View>

            <View>
              <Text style={styles.detailLabel}>
                DURATION
              </Text>

              <Text style={styles.detailValue}>
                {service.duration}
              </Text>
            </View>
          </View>

          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>
              Service Price
            </Text>

            <Text style={styles.price}>
              ₹{service.price.toLocaleString("en-IN")}
            </Text>
          </View>
        </LinearGradient>

        {/* DATE SELECTION */}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Choose Appointment Date
          </Text>

          <TouchableOpacity
            style={styles.dateButton}
            onPress={() => setShowDatePicker(true)}
          >
            <View>
              <Text style={styles.dateLabel}>
                APPOINTMENT DATE
              </Text>

              <Text style={styles.dateValue}>
                {formatDisplayDate(appointmentDate)}
              </Text>
            </View>

            <Text style={styles.calendarIcon}>
              ▦
            </Text>
          </TouchableOpacity>

          {showDatePicker && (
            <DateTimePicker
              value={appointmentDate}
              mode="date"
              display={
                Platform.OS === "ios"
                  ? "spinner"
                  : "default"
              }
              minimumDate={getTomorrow()}
              onChange={handleDateChange}
            />
          )}
        </View>

        {/* TIME SLOTS */}

        <View style={styles.section}>
          <View style={styles.slotHeadingRow}>
            <View>
              <Text style={styles.sectionTitle}>
                Choose Time Slot
              </Text>

              <Text style={styles.sectionSubtitle}>
                Select an available appointment time.
              </Text>
            </View>

            <TouchableOpacity
              onPress={loadAvailability}
              disabled={loadingAvailability}
            >
              <Text style={styles.refreshText}>
                ↻ Refresh
              </Text>
            </TouchableOpacity>
          </View>

          {loadingAvailability ? (
            <View style={styles.loadingBox}>
              <ActivityIndicator
                size="small"
                color={COLORS.green}
              />

              <Text style={styles.loadingText}>
                Checking artist availability...
              </Text>
            </View>
          ) : availabilityError ? (
            <View style={styles.errorBox}>
              <Text style={styles.errorMessage}>
                {availabilityError}
              </Text>

              <TouchableOpacity
                style={styles.retryButton}
                onPress={loadAvailability}
              >
                <Text style={styles.retryText}>
                  Try Again
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <>
              <View style={styles.slotGrid}>
                {TIME_SLOTS.map((slot) => {
                  const unavailable =
                    isSlotUnavailable(slot);

                  const selected =
                    selectedTime === slot;

                  return (
                    <TouchableOpacity
                      key={slot}
                      disabled={unavailable}
                      onPress={() => setSelectedTime(slot)}
                      style={[
                        styles.slotButton,
                        selected && styles.selectedSlot,
                        unavailable && styles.unavailableSlot,
                      ]}
                    >
                      <Text
                        style={[
                          styles.slotText,
                          selected && styles.selectedSlotText,
                          unavailable && styles.unavailableSlotText,
                        ]}
                      >
                        {slot}
                      </Text>

                      {unavailable && (
                        <Text style={styles.bookedText}>
                          Booked
                        </Text>
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>

              <View style={styles.legend}>
                <View style={styles.legendItem}>
                  <View style={styles.availableDot} />
                  <Text style={styles.legendText}>
                    Available
                  </Text>
                </View>

                <View style={styles.legendItem}>
                  <View style={styles.selectedDot} />
                  <Text style={styles.legendText}>
                    Selected
                  </Text>
                </View>

                <View style={styles.legendItem}>
                  <View style={styles.bookedDot} />
                  <Text style={styles.legendText}>
                    Booked
                  </Text>
                </View>
              </View>
            </>
          )}
        </View>

        {/* CUSTOMER DETAILS */}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Your Details
          </Text>

          <Text style={styles.inputLabel}>
            Full Name
          </Text>

          <TextInput
            value={customerName}
            onChangeText={setCustomerName}
            placeholder="Enter your full name"
            placeholderTextColor="#A9A397"
            style={styles.input}
            autoCapitalize="words"
          />

          <Text style={styles.inputLabel}>
            Mobile Number
          </Text>

          <TextInput
            value={customerPhone}
            onChangeText={(value) =>
              setCustomerPhone(
                value.replace(/\D/g, "").slice(0, 10)
              )
            }
            placeholder="Enter 10-digit mobile number"
            placeholderTextColor="#A9A397"
            style={styles.input}
            keyboardType="phone-pad"
            maxLength={10}
          />

          <Text style={styles.inputLabel}>
            Special Instructions (Optional)
          </Text>

          <TextInput
            value={notes}
            onChangeText={setNotes}
            placeholder="Any special request..."
            placeholderTextColor="#A9A397"
            style={[styles.input, styles.notesInput]}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        {/* BOOKING SUMMARY */}

        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>
            Booking Summary
          </Text>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>
              Service
            </Text>

            <Text style={styles.summaryValue}>
              {service.title}
            </Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>
              Artist
            </Text>

            <Text style={styles.summaryValue}>
              {service.artist}
            </Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>
              Date
            </Text>

            <Text style={styles.summaryValue}>
              {formatDate(appointmentDate)}
            </Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>
              Time
            </Text>

            <Text style={styles.summaryValue}>
              {selectedTime || "Not selected"}
            </Text>
          </View>

          <View style={styles.summaryDivider} />

          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>
              Total Amount
            </Text>

            <Text style={styles.totalPrice}>
              ₹{service.price.toLocaleString("en-IN")}
            </Text>
          </View>
        </View>

        {/* CONFIRM BUTTON */}

        <TouchableOpacity
          activeOpacity={0.85}
          disabled={
            submitting ||
            loadingAvailability ||
            !!availabilityError
          }
          onPress={handleBooking}
          style={[
            styles.confirmButton,
            (submitting ||
              loadingAvailability ||
              !!availabilityError) &&
              styles.disabledButton,
          ]}
        >
          {submitting ? (
            <ActivityIndicator
              color={COLORS.white}
              size="small"
            />
          ) : (
            <Text style={styles.confirmButtonText}>
              Confirm Appointment →
            </Text>
          )}
        </TouchableOpacity>

        <Text style={styles.footerNote}>
          Your appointment will be reserved after successful booking.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

/* =========================================
   STYLES
========================================= */

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 45,
  },

  centerContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    marginBottom: 30,
  },

  headerBack: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: COLORS.white,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  headerBackText: {
    color: COLORS.green,
    fontSize: 32,
    lineHeight: 36,
    marginTop: -4,
  },

  brand: {
    color: COLORS.green,
    fontSize: 18,
    fontWeight: "800",
    letterSpacing: 3,
  },

  headerSubtitle: {
    color: COLORS.muted,
    fontSize: 11,
    marginTop: 3,
  },

  headingSection: {
    marginBottom: 22,
  },

  eyebrow: {
    color: COLORS.gold,
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 2.5,
    marginBottom: 8,
  },

  heading: {
    color: COLORS.green,
    fontSize: 29,
    fontWeight: "800",
  },

  subheading: {
    color: COLORS.muted,
    fontSize: 13,
    marginTop: 7,
  },

  serviceCard: {
    borderRadius: 22,
    padding: 21,
    marginBottom: 28,
  },

  serviceLabel: {
    color: "#D7C8A8",
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 2,
  },

  serviceName: {
    color: COLORS.white,
    fontSize: 22,
    fontWeight: "800",
    marginTop: 9,
  },

  serviceDivider: {
    height: 1,
    backgroundColor: "rgba(255,255,255,0.2)",
    marginVertical: 19,
  },

  serviceDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  detailLabel: {
    color: "#D7C8A8",
    fontSize: 9,
    fontWeight: "700",
    letterSpacing: 1,
  },

  detailValue: {
    color: COLORS.white,
    fontSize: 13,
    fontWeight: "600",
    marginTop: 6,
  },

  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 22,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.2)",
  },

  priceLabel: {
    color: COLORS.white,
    fontSize: 13,
  },

  price: {
    color: "#E8D5A9",
    fontSize: 23,
    fontWeight: "800",
  },

  section: {
    marginBottom: 27,
  },

  sectionTitle: {
    color: COLORS.green,
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 13,
  },

  sectionSubtitle: {
    color: COLORS.muted,
    fontSize: 12,
    marginTop: -6,
    marginBottom: 14,
  },

  dateButton: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 16,
    padding: 17,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  dateLabel: {
    color: COLORS.muted,
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 1.5,
  },

  dateValue: {
    color: COLORS.green,
    fontSize: 14,
    fontWeight: "700",
    marginTop: 8,
  },

  calendarIcon: {
    color: COLORS.gold,
    fontSize: 28,
  },

  slotHeadingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },

  refreshText: {
    color: COLORS.green,
    fontSize: 12,
    fontWeight: "800",
    paddingTop: 4,
  },

  loadingBox: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 22,
    alignItems: "center",
    gap: 10,
  },

  loadingText: {
    color: COLORS.muted,
    fontSize: 12,
  },

  errorBox: {
    backgroundColor: COLORS.unavailable,
    borderRadius: 15,
    padding: 16,
  },

  errorMessage: {
    color: COLORS.red,
    fontSize: 13,
    lineHeight: 20,
  },

  retryButton: {
    marginTop: 12,
    alignSelf: "flex-start",
    backgroundColor: COLORS.green,
    paddingHorizontal: 18,
    paddingVertical: 9,
    borderRadius: 10,
  },

  retryText: {
    color: COLORS.white,
    fontWeight: "700",
    fontSize: 12,
  },

  slotGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },

  slotButton: {
    width: "18%",
    minWidth: 65,
    flexGrow: 1,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    paddingVertical: 13,
    alignItems: "center",
    justifyContent: "center",
  },

  selectedSlot: {
    backgroundColor: COLORS.green,
    borderColor: COLORS.green,
  },

  unavailableSlot: {
    backgroundColor: COLORS.unavailable,
    borderColor: "#E8D4CF",
  },

  slotText: {
    color: COLORS.green,
    fontSize: 13,
    fontWeight: "700",
  },

  selectedSlotText: {
    color: COLORS.white,
  },

  unavailableSlotText: {
    color: "#B9A6A0",
    textDecorationLine: "line-through",
  },

  bookedText: {
    color: COLORS.red,
    fontSize: 8,
    marginTop: 3,
    fontWeight: "700",
  },

  legend: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 18,
    marginTop: 17,
  },

  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  availableDot: {
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  selectedDot: {
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: COLORS.green,
  },

  bookedDot: {
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: "#D9A49B",
  },

  legendText: {
    color: COLORS.muted,
    fontSize: 10,
  },

  inputLabel: {
    color: COLORS.green,
    fontSize: 12,
    fontWeight: "700",
    marginBottom: 8,
    marginTop: 13,
  },

  input: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 13,
    paddingHorizontal: 15,
    paddingVertical: 14,
    color: COLORS.text,
    fontSize: 14,
  },

  notesInput: {
    minHeight: 100,
  },

  summaryCard: {
    backgroundColor: COLORS.white,
    borderRadius: 19,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 19,
    marginBottom: 22,
  },

  summaryTitle: {
    color: COLORS.green,
    fontSize: 17,
    fontWeight: "800",
    marginBottom: 17,
  },

  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 12,
    marginBottom: 13,
  },

  summaryLabel: {
    color: COLORS.muted,
    fontSize: 12,
    flex: 1,
  },

  summaryValue: {
    color: COLORS.text,
    fontSize: 12,
    fontWeight: "700",
    flex: 1.5,
    textAlign: "right",
  },

  summaryDivider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 7,
  },

  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 7,
  },

  totalLabel: {
    color: COLORS.green,
    fontSize: 14,
    fontWeight: "800",
  },

  totalPrice: {
    color: COLORS.green,
    fontSize: 22,
    fontWeight: "900",
  },

  confirmButton: {
    backgroundColor: COLORS.green,
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 57,
  },

  disabledButton: {
    opacity: 0.55,
  },

  confirmButtonText: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: "800",
    letterSpacing: 0.3,
  },

  footerNote: {
    color: COLORS.muted,
    fontSize: 10,
    textAlign: "center",
    marginTop: 13,
    lineHeight: 17,
  },

  errorTitle: {
    color: COLORS.green,
    fontSize: 23,
    fontWeight: "800",
  },

  errorDescription: {
    color: COLORS.muted,
    fontSize: 14,
    marginTop: 9,
  },

  backButton: {
    backgroundColor: COLORS.green,
    paddingHorizontal: 25,
    paddingVertical: 13,
    borderRadius: 12,
    marginTop: 20,
  },

  backButtonText: {
    color: COLORS.white,
    fontWeight: "700",
  },
});