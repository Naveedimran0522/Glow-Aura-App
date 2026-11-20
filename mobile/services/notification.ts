
/* Bismillah-ir-Rahman-ir-Raheem ❤️ */
/* GLOWAURA — COMPLETE NOTIFICATIONS & BOOKING REMINDERS */

import { Platform } from "react-native";
import * as Notifications from "expo-notifications";

/* =========================================
   CONFIGURATION
========================================= */

const CHANNEL_ID = "glowaura-booking-reminders-v2";

let channelReady = false;
let channelFailed = false;

/* =========================================
   FOREGROUND NOTIFICATION HANDLER
========================================= */

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

/* =========================================
   INITIALIZE NOTIFICATIONS
========================================= */

export async function initializeNotifications(): Promise<boolean> {
  try {
    // Android notification channel
    if (
      Platform.OS === "android" &&
      !channelReady &&
      !channelFailed
    ) {
      try {
        await Notifications.setNotificationChannelAsync(CHANNEL_ID, {
          name: "GlowAura Booking Reminders",
          description: "Booking updates and appointment reminders",
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 400, 200, 400],
          sound: "default",
          enableVibrate: true,
          enableLights: true,
          lightColor: "#B79A68",
        });

        channelReady = true;
      } catch (channelError) {
        // Channel error should not crash booking/payment flow.
        channelFailed = true;

        console.warn(
          "GlowAura Android channel initialization failed:",
          channelError
        );
      }
    }

    const currentPermission =
      await Notifications.getPermissionsAsync();

    let granted = currentPermission.granted;

    if (!granted) {
      const requested =
        await Notifications.requestPermissionsAsync();

      granted = requested.granted;
    }

    return granted;
  } catch (error) {
    console.warn(
      "GlowAura notification initialization failed:",
      error
    );

    return false;
  }
}

/* =========================================
   LOCAL NOTIFICATION
========================================= */

export async function sendLocalNotification(
  title: string,
  body: string,
  data: Record<string, unknown> = {}
): Promise<string | null> {
  try {
    const permissionGranted =
      await initializeNotifications();

    if (!permissionGranted) {
      console.warn(
        "GlowAura notification permission not granted."
      );

      return null;
    }

    const identifier =
      await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          sound: "default",
          data: {
            type: "glowaura-instant",
            ...data,
          },
        },

        // Immediate notification.
        trigger: null,
      });

    return identifier;
  } catch (error) {
    console.warn(
      "GlowAura local notification failed:",
      error
    );

    return null;
  }
}

/* =========================================
   APPOINTMENT DATE & TIME PARSER
========================================= */

export function getAppointmentDateTime(
  appointmentDate: string,
  appointmentTime: string
): Date | null {
  try {
    const dateText = String(
      appointmentDate || ""
    ).trim();

    const timeText = String(
      appointmentTime || ""
    ).trim();

    if (!dateText || !timeText) {
      return null;
    }

    let year: number;
    let month: number;
    let day: number;

    // YYYY-MM-DD or ISO date string
    const isoMatch = dateText.match(
      /^(\d{4})-(\d{1,2})-(\d{1,2})/
    );

    if (isoMatch) {
      year = Number(isoMatch[1]);
      month = Number(isoMatch[2]);
      day = Number(isoMatch[3]);
    } else {
      // DD/MM/YYYY or DD-MM-YYYY
      const localMatch = dateText.match(
        /^(\d{1,2})[/-](\d{1,2})[/-](\d{4})$/
      );

      if (!localMatch) {
        return null;
      }

      day = Number(localMatch[1]);
      month = Number(localMatch[2]);
      year = Number(localMatch[3]);
    }

    if (
      year < 2000 ||
      month < 1 ||
      month > 12 ||
      day < 1 ||
      day > 31
    ) {
      return null;
    }

    // Supports 10:30 AM, 14:30, and 9 AM
    const timeMatch = timeText.match(
      /^(\d{1,2})(?::(\d{2}))?(?::\d{2})?\s*(AM|PM)?$/i
    );

    if (!timeMatch) {
      return null;
    }

    let hour = Number(timeMatch[1]);
    const minute = Number(timeMatch[2] || 0);

    const meridiem =
      timeMatch[3]?.toUpperCase();

    if (minute < 0 || minute > 59) {
      return null;
    }

    if (meridiem) {
      if (hour < 1 || hour > 12) {
        return null;
      }

      if (meridiem === "AM" && hour === 12) {
        hour = 0;
      }

      if (meridiem === "PM" && hour !== 12) {
        hour += 12;
      }
    } else if (hour < 0 || hour > 23) {
      return null;
    }

    const appointment = new Date(
      year,
      month - 1,
      day,
      hour,
      minute,
      0,
      0
    );

    // Reject invalid dates.
    if (
      appointment.getFullYear() !== year ||
      appointment.getMonth() !== month - 1 ||
      appointment.getDate() !== day
    ) {
      return null;
    }

    return appointment;
  } catch (error) {
    console.warn(
      "GlowAura date/time parsing failed:",
      error
    );

    return null;
  }
}

/* =========================================
   BOOKING CREATED NOTIFICATION
========================================= */

export async function sendBookingCreatedNotification(
  serviceName: string,
  appointmentDate: string,
  appointmentTime: string,
  bookingId: string
): Promise<string | null> {
  if (!bookingId) {
    return null;
  }

  return sendLocalNotification(
    "GlowAura Booking Created ❤️",
    `Your ${serviceName || "beauty"} appointment is reserved for ${appointmentDate} at ${appointmentTime}. Please complete your payment.`,
    {
      type: "booking-created",
      bookingId,
    }
  );
}

/* =========================================
   PAYMENT SUCCESS NOTIFICATION
========================================= */

export async function sendPaymentSuccessNotification(
  serviceName: string,
  amount: number | string,
  bookingId: string
): Promise<string | null> {
  if (!bookingId) {
    return null;
  }

  const formattedAmount =
    amount === undefined || amount === null || amount === ""
      ? ""
      : ` Amount: ₹${amount}.`;

  return sendLocalNotification(
    "Payment Successful ❤️",
    `Your payment for ${serviceName || "your appointment"} was successful.${formattedAmount} Thank you for choosing GlowAura!`,
    {
      type: "payment-success",
      bookingId,
    }
  );
}

/* =========================================
   BOOKING CONFIRMED NOTIFICATION
========================================= */

export async function sendBookingConfirmedNotification(
  serviceName: string,
  bookingId: string
): Promise<string | null> {
  if (!bookingId) {
    return null;
  }

  return sendLocalNotification(
    "Appointment Confirmed ❤️",
    `Your ${serviceName || "beauty"} appointment is now confirmed. We look forward to seeing you!`,
    {
      type: "booking-confirmed",
      bookingId,
    }
  );
}

/* =========================================
   PAYMENT FAILED NOTIFICATION
========================================= */

export async function sendPaymentFailedNotification(
  serviceName: string,
  bookingId: string
): Promise<string | null> {
  if (!bookingId) {
    return null;
  }

  return sendLocalNotification(
    "Payment Not Completed",
    `Payment for ${serviceName || "your appointment"} was not completed. Please check My Bookings.`,
    {
      type: "payment-failed",
      bookingId,
    }
  );
}

/* =========================================
   SCHEDULE BOOKING REMINDER
   1 HOUR BEFORE APPOINTMENT
========================================= */

export async function scheduleBookingReminder(
  booking: {
    _id: string;
    serviceName?: string;
    artistName?: string;
    appointmentDate: string;
    appointmentTime: string;
  }
): Promise<string | null> {
  try {
    if (!booking?._id) {
      return null;
    }

    const permissionGranted =
      await initializeNotifications();

    if (!permissionGranted) {
      return null;
    }

    const appointment = getAppointmentDateTime(
      booking.appointmentDate,
      booking.appointmentTime
    );

    if (!appointment) {
      console.warn(
        "GlowAura invalid appointment date/time:",
        booking.appointmentDate,
        booking.appointmentTime
      );

      return null;
    }

    const reminderDate = new Date(
      appointment.getTime() - 60 * 60 * 1000
    );

    // Do not schedule past reminders.
    if (reminderDate.getTime() <= Date.now()) {
      return null;
    }

    const scheduled =
      await Notifications.getAllScheduledNotificationsAsync();

    const matchingReminders = scheduled.filter(
      (item) =>
        String(item.content.data?.bookingId || "") ===
        String(booking._id)
    );

    const appointmentISO = appointment.toISOString();

    // Existing reminder already matches appointment.
    const existingCorrectReminder =
      matchingReminders.find(
        (item) =>
          item.content.data?.appointmentAt === appointmentISO
      );

    if (existingCorrectReminder) {
      // Remove any extra duplicate reminders.
      for (const item of matchingReminders) {
        if (
          item.identifier !==
          existingCorrectReminder.identifier
        ) {
          await Notifications.cancelScheduledNotificationAsync(
            item.identifier
          );
        }
      }

      return existingCorrectReminder.identifier;
    }

    // Cancel old reminders if appointment date/time changed.
    for (const item of matchingReminders) {
      await Notifications.cancelScheduledNotificationAsync(
        item.identifier
      );
    }

    const serviceName =
      booking.serviceName || "your beauty appointment";

    const artistName =
      booking.artistName || "your artist";

    const trigger: Notifications.DateTriggerInput = {
      type: Notifications.SchedulableTriggerInputTypes.DATE,
      date: reminderDate,

      ...(Platform.OS === "android" && channelReady
        ? { channelId: CHANNEL_ID }
        : {}),
    };

    const identifier =
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "GlowAura Appointment Reminder ❤️",

          body: `Your ${serviceName} appointment with ${artistName} is in 1 hour. Get ready!`,

          sound: "default",

          priority:
            Notifications.AndroidNotificationPriority.MAX,

          data: {
            type: "booking-reminder",
            bookingId: booking._id,
            appointmentAt: appointmentISO,
          },
        },

        trigger,
      });

    console.log(
      "GlowAura reminder scheduled:",
      booking._id,
      reminderDate.toLocaleString()
    );

    return identifier;
  } catch (error) {
    console.warn(
      "GlowAura booking reminder failed:",
      error
    );

    return null;
  }
}

/* =========================================
   PAYMENT SCREEN REMINDER WRAPPER
========================================= */

export async function scheduleAppointmentReminder(
  bookingId: string,
  serviceName: string,
  appointmentDate: string,
  appointmentTime: string
): Promise<string | null> {
  if (!bookingId) {
    return null;
  }

  return scheduleBookingReminder({
    _id: bookingId,
    serviceName,
    appointmentDate,
    appointmentTime,
  });
}

/* =========================================
   CANCEL ONE BOOKING REMINDER
========================================= */

export async function cancelBookingReminder(
  bookingId: string
): Promise<void> {
  try {
    if (!bookingId) {
      return;
    }

    const scheduled =
      await Notifications.getAllScheduledNotificationsAsync();

    const matching = scheduled.filter(
      (item) =>
        String(item.content.data?.bookingId || "") ===
        String(bookingId)
    );

    await Promise.all(
      matching.map((item) =>
        Notifications.cancelScheduledNotificationAsync(
          item.identifier
        )
      )
    );

    console.log(
      "GlowAura reminder cancelled:",
      bookingId
    );
  } catch (error) {
    console.warn(
      "GlowAura reminder cancellation failed:",
      error
    );
  }
}

/* =========================================
   SYNC BOOKING REMINDERS
========================================= */

export async function syncBookingReminders(
  bookings: Array<{
    _id: string;
    serviceName?: string;
    artistName?: string;
    appointmentDate: string;
    appointmentTime: string;
    status?: string;
  }>
): Promise<void> {
  try {
    if (!Array.isArray(bookings)) {
      return;
    }

    await initializeNotifications();

    const activeBookings = bookings.filter(
      (booking) => {
        const status = String(
          booking.status || ""
        ).toLowerCase();

        return (
          Boolean(booking._id) &&
          ![
            "cancelled",
            "canceled",
            "completed",
            "rejected",
          ].includes(status)
        );
      }
    );

    const activeIds = new Set(
      activeBookings.map((booking) =>
        String(booking._id)
      )
    );

    const scheduled =
      await Notifications.getAllScheduledNotificationsAsync();

    // Cancel reminders for bookings no longer active.
    for (const item of scheduled) {
      const bookingId = item.content.data?.bookingId;

      if (
        bookingId &&
        !activeIds.has(String(bookingId))
      ) {
        await Notifications.cancelScheduledNotificationAsync(
          item.identifier
        );
      }
    }

    // Schedule reminders for active bookings.
    for (const booking of activeBookings) {
      await scheduleBookingReminder(booking);
    }
  } catch (error) {
    console.warn(
      "GlowAura reminder sync failed:",
      error
    );
  }
}

/* =========================================
   GET ALL SCHEDULED REMINDERS
========================================= */

export async function getScheduledReminders() {
  try {
    return await Notifications.getAllScheduledNotificationsAsync();
  } catch (error) {
    console.warn(
      "GlowAura scheduled reminders fetch failed:",
      error
    );

    return [];
  }
}

/* =========================================
   CANCEL ALL BOOKING REMINDERS
========================================= */

export async function cancelAllBookingReminders(): Promise<void> {
  try {
    const scheduled =
      await Notifications.getAllScheduledNotificationsAsync();

    const bookingReminders = scheduled.filter(
      (item) => Boolean(item.content.data?.bookingId)
    );

    await Promise.all(
      bookingReminders.map((item) =>
        Notifications.cancelScheduledNotificationAsync(
          item.identifier
        )
      )
    );

    console.log(
      "GlowAura all booking reminders cancelled."
    );
  } catch (error) {
    console.warn(
      "GlowAura cancel all reminders failed:",
      error
    );
  }
}
