/* Bismillah-ir-Rahman-ir-Raheem ❤️ */
/* GLOWAURA — PREMIUM PROFILE WITH ADMIN ACCESS */
/* Forest Green + Champagne Gold + Ivory Luxury Theme */

import React, { useCallback, useState } from "react";

import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
} from "react-native";

import {
  useRouter,
  useFocusEffect,
} from "expo-router";

import {
  logout,
  getCurrentUser,
} from "../../services/auth";

// ==========================================
// GLOWAURA LUXURY COLORS
// ==========================================

const COLORS = {
  deep: "#192B22",
  forest: "#263C30",
  green: "#405B48",
  sage: "#829482",

  gold: "#B99A65",
  champagne: "#E6D3AD",

  ivory: "#FAF8F2",
  white: "#FFFFFF",

  text: "#35271F",
  muted: "#89877D",

  border: "#EAE3D6",
  pale: "#F0EDE4",
};

// ==========================================
// USER PROFILE TYPE
// ==========================================

type ProfileUser = {
  name?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  role?: string;
  [key: string]: any;
};

// ==========================================
// GET FIRST AND LAST NAME INITIALS
// ==========================================

const getUserInitials = (user: ProfileUser | null): string => {
  if (!user) return "?";

  // First priority: actual first and last name
  const firstName = String(user.firstName || "").trim();
  const lastName = String(user.lastName || "").trim();

  if (firstName && lastName) {
    return (
      firstName.charAt(0) +
      lastName.charAt(0)
    ).toUpperCase();
  }

  // Second priority: full name
  const fullName = String(user.name || "").trim();

  if (fullName) {
    const nameParts = fullName
      .split(/\s+/)
      .filter(Boolean);

    if (nameParts.length >= 2) {
      return (
        nameParts[0].charAt(0) +
        nameParts[nameParts.length - 1].charAt(0)
      ).toUpperCase();
    }

    return nameParts[0]
      .substring(0, 2)
      .toUpperCase();
  }

  // Third priority: email username
  const email = String(user.email || "").trim();

  if (email) {
    const emailName = email.split("@")[0];

    const nameParts = emailName
      .split(/[._\-\s]+/)
      .filter(Boolean);

    if (nameParts.length >= 2) {
      return (
        nameParts[0].charAt(0) +
        nameParts[nameParts.length - 1].charAt(0)
      ).toUpperCase();
    }

    return emailName
      .replace(/[^a-zA-Z]/g, "")
      .substring(0, 2)
      .toUpperCase() || "?";
  }

  return "?";
};

// ==========================================
// PROFILE SCREEN
// ==========================================

export default function ProfileScreen() {
  const router = useRouter();

  const [user, setUser] = useState<ProfileUser | null>(null);

  const [isAdmin, setIsAdmin] = useState(false);
  const [checkingAdmin, setCheckingAdmin] = useState(true);

  const avatarInitials = getUserInitials(user);

  // ==========================================
  // LOAD ACTUAL BACKEND USER
  // ==========================================

  useFocusEffect(
    useCallback(() => {
      let mounted = true;

      const loadProfile = async () => {
        try {
          setCheckingAdmin(true);

          const currentUser = await getCurrentUser();

          if (!mounted) return;

          if (currentUser) {
            setUser(currentUser);

            setIsAdmin(
              currentUser.role === "admin"
            );

            console.log(
              "GLOWAURA PROFILE USER:",
              currentUser
            );

            console.log(
              "GLOWAURA ACCOUNT ROLE:",
              currentUser.role
            );
          } else {
            setUser(null);
            setIsAdmin(false);
          }
        } catch (error) {
          console.error(
            "PROFILE LOAD ERROR:",
            error
          );

          if (mounted) {
            setUser(null);
            setIsAdmin(false);
          }
        } finally {
          if (mounted) {
            setCheckingAdmin(false);
          }
        }
      };

      loadProfile();

      return () => {
        mounted = false;
      };
    }, [])
  );

  // ==========================================
  // OPEN ADMIN DASHBOARD
  // ==========================================

  const handleAdminDashboard = () => {
    if (!isAdmin) {
      Alert.alert(
        "Access Denied",
        "Admin access is required."
      );
      return;
    }

    router.push("/admin-dashboard");
  };

  // ==========================================
  // LOGOUT
  // ==========================================

  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Logout",
          style: "destructive",

          onPress: async () => {
            try {
              await logout();

              setUser(null);
              setIsAdmin(false);

              router.replace("/login");
            } catch (error) {
              console.error(
                "LOGOUT ERROR:",
                error
              );

              Alert.alert(
                "Error",
                "Unable to logout. Please try again."
              );
            }
          },
        },
      ]
    );
  };

  // ==========================================
  // PROFILE UI
  // ==========================================

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >

      {/* PROFILE AVATAR */}

      <View style={styles.avatarOuter}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {avatarInitials}
          </Text>
        </View>

        <View style={styles.avatarBadge}>
          <Text style={styles.avatarBadgeText}>
            ✦
          </Text>
        </View>
      </View>

      {/* PROFILE TITLE */}

      <Text style={styles.title}>
        My Profile
      </Text>

      <Text style={styles.subtitle}>
        Your personal GlowAura space.
      </Text>

      {/* USER EMAIL */}

      {user?.email ? (
        <View style={styles.emailContainer}>
          <Text style={styles.emailIcon}>
            ✉
          </Text>

          <Text style={styles.emailText}>
            {user.email}
          </Text>
        </View>
      ) : null}

      {/* ADMIN LOADING */}

      {checkingAdmin && (
        <View style={styles.adminLoading}>
          <ActivityIndicator
            size="small"
            color={COLORS.green}
          />

          <Text style={styles.loadingText}>
            Checking account permissions...
          </Text>
        </View>
      )}

      {/* ADMIN DASHBOARD */}

      {isAdmin && !checkingAdmin && (
        <TouchableOpacity
          style={styles.adminOption}
          onPress={handleAdminDashboard}
          activeOpacity={0.85}
        >
          <View style={styles.adminLeft}>
            <View style={styles.adminIconContainer}>
              <Text style={styles.adminIcon}>
                ✦
              </Text>
            </View>

            <View>
              <Text style={styles.adminTitle}>
                Admin Dashboard
              </Text>

              <Text style={styles.adminSubtitle}>
                Manage your GlowAura business
              </Text>
            </View>
          </View>

          <Text style={styles.adminArrow}>
            ›
          </Text>
        </TouchableOpacity>
      )}

      {/* PERSONAL INFORMATION */}

      <TouchableOpacity
        style={styles.option}
        activeOpacity={0.8}
        onPress={() => router.push("/personal-information")}
      >
        <View style={styles.optionLeft}>
          <Text style={styles.optionIcon}>
            ♙
          </Text>

          <Text style={styles.optionText}>
            Personal Information
          </Text>
        </View>

        <Text style={styles.arrow}>
          ›
        </Text>
      </TouchableOpacity>

      {/* HELP & SUPPORT */}

      <TouchableOpacity
        style={styles.option}
        activeOpacity={0.8}
        onPress={() => router.push("/help-support")}
      >
        <View style={styles.optionLeft}>
          <Text style={styles.optionIcon}>
            ♧
          </Text>

          <Text style={styles.optionText}>
            Help & Support
          </Text>
        </View>

        <Text style={styles.arrow}>
          ›
        </Text>
      </TouchableOpacity>

      {/* LOGOUT */}

      <TouchableOpacity
        style={styles.logout}
        onPress={handleLogout}
        activeOpacity={0.85}
      >
        <Text style={styles.logoutIcon}>
          ↗
        </Text>

        <Text style={styles.logoutText}>
          Log Out
        </Text>
      </TouchableOpacity>

      {/* FOOTER */}

      <View style={styles.footerContainer}>
        <View style={styles.footerLine} />

        <Text style={styles.footer}>
          GLOWAURA BEAUTY EXPERIENCE
        </Text>

        <Text style={styles.footerSub}>
          Beauty • Skincare • Mehndi
        </Text>
      </View>

    </ScrollView>
  );
}

// ==========================================
// PREMIUM PROFILE STYLES
// ==========================================

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.ivory,
  },

  content: {
    paddingHorizontal: 22,
    paddingTop: 65,
    paddingBottom: 120,
  },

  // AVATAR

  avatarOuter: {
    width: 106,
    height: 106,
    borderRadius: 36,

    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",

    backgroundColor: COLORS.champagne,

    borderWidth: 1,
    borderColor: COLORS.gold,

    shadowColor: COLORS.deep,
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },

  avatar: {
    width: 88,
    height: 88,
    borderRadius: 29,

    backgroundColor: COLORS.forest,

    alignItems: "center",
    justifyContent: "center",

    borderWidth: 2,
    borderColor: COLORS.ivory,
  },

  avatarText: {
    color: COLORS.ivory,
    fontSize: 34,
    fontFamily: "Georgia",
    fontWeight: "700",
    letterSpacing: 2,
  },

  avatarBadge: {
    position: "absolute",
    right: -3,
    bottom: -3,

    width: 29,
    height: 29,
    borderRadius: 15,

    backgroundColor: COLORS.gold,

    alignItems: "center",
    justifyContent: "center",

    borderWidth: 2,
    borderColor: COLORS.ivory,
  },

  avatarBadgeText: {
    color: COLORS.deep,
    fontSize: 15,
  },

  // TITLE

  title: {
    color: COLORS.forest,
    fontFamily: "Georgia",
    fontSize: 29,
    textAlign: "center",
    marginTop: 19,
    fontWeight: "600",
  },

  subtitle: {
    color: COLORS.muted,
    fontSize: 12,
    textAlign: "center",
    marginTop: 7,
    marginBottom: 15,
  },

  // EMAIL

  emailContainer: {
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",

    backgroundColor: COLORS.pale,

    paddingHorizontal: 15,
    paddingVertical: 9,

    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,

    marginBottom: 28,
  },

  emailIcon: {
    color: COLORS.gold,
    fontSize: 14,
    marginRight: 8,
  },

  emailText: {
    color: COLORS.green,
    fontSize: 11,
    fontWeight: "600",
  },

  // ADMIN LOADING

  adminLoading: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 18,
    gap: 10,
  },

  loadingText: {
    color: COLORS.muted,
    fontSize: 11,
  },

  // ADMIN DASHBOARD

  adminOption: {
    minHeight: 78,

    backgroundColor: COLORS.forest,

    borderRadius: 17,
    paddingHorizontal: 17,

    marginBottom: 19,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",

    borderWidth: 1,
    borderColor: COLORS.gold,

    shadowColor: COLORS.deep,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },

  adminLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 13,
  },

  adminIconContainer: {
    width: 43,
    height: 43,
    borderRadius: 14,

    backgroundColor: COLORS.green,

    alignItems: "center",
    justifyContent: "center",

    borderWidth: 1,
    borderColor: COLORS.gold,
  },

  adminIcon: {
    color: COLORS.champagne,
    fontSize: 25,
  },

  adminTitle: {
    color: COLORS.ivory,
    fontSize: 14,
    fontWeight: "700",
  },

  adminSubtitle: {
    color: COLORS.champagne,
    fontSize: 10,
    marginTop: 5,
  },

  adminArrow: {
    color: COLORS.champagne,
    fontSize: 27,
  },

  // PROFILE OPTIONS

  option: {
    minHeight: 61,

    backgroundColor: COLORS.white,

    borderRadius: 15,
    paddingHorizontal: 17,

    marginBottom: 12,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",

    borderWidth: 1,
    borderColor: COLORS.border,

    shadowColor: COLORS.deep,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.04,
    shadowRadius: 5,
    elevation: 2,
  },

  optionLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 13,
  },

  optionIcon: {
    color: COLORS.gold,
    fontSize: 21,
    width: 25,
    textAlign: "center",
  },

  optionText: {
    color: COLORS.forest,
    fontSize: 13,
    fontWeight: "600",
  },

  arrow: {
    color: COLORS.gold,
    fontSize: 25,
  },

  // LOGOUT

  logout: {
    backgroundColor: COLORS.forest,

    padding: 17,
    borderRadius: 16,

    marginTop: 21,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 9,

    borderWidth: 1,
    borderColor: COLORS.gold,

    shadowColor: COLORS.deep,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.13,
    shadowRadius: 7,
    elevation: 3,
  },

  logoutIcon: {
    color: COLORS.champagne,
    fontSize: 17,
  },

  logoutText: {
    color: COLORS.ivory,
    textAlign: "center",
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 0.5,
  },

  // FOOTER

  footerContainer: {
    alignItems: "center",
    marginTop: 35,
  },

  footerLine: {
    width: 55,
    height: 1,
    backgroundColor: COLORS.gold,
    marginBottom: 16,
  },

  footer: {
    color: COLORS.gold,
    textAlign: "center",
    fontSize: 9,
    letterSpacing: 2,
    fontWeight: "700",
  },

  footerSub: {
    color: COLORS.muted,
    fontSize: 10,
    marginTop: 8,
    letterSpacing: 0.5,
  },
});