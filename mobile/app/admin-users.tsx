/* Bismillah-ir-Rahman-ir-Raheem ❤️ */
/* =====================================================
   GLOWAURA — ADMIN USERS MANAGEMENT
   PREMIUM FOREST GREEN + CHAMPAGNE GOLD UI
   SAFE AREA + SEARCH + REFRESH + PAGINATION
===================================================== */

import React, { useCallback, useEffect, useState } from "react";

import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import { useRouter } from "expo-router";

import {
  ArrowLeft,
  Search,
  Users,
  Mail,
  Phone,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
} from "lucide-react-native";

import { apiRequest } from "../services/api";
import { getAuthToken } from "../services/auth";

// =====================================================
// TYPES
// =====================================================

interface AdminUser {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
  isVerified?: boolean;
  createdAt?: string;
}

interface UsersResponse {
  success: boolean;
  message?: string;
  users?: AdminUser[];
  pagination?: {
    total?: number;
    page?: number;
    totalPages?: number;
  };
}

// =====================================================
// COLORS
// =====================================================

const COLORS = {
  background: "#FBF8F1",
  green: "#344A3D",
  gold: "#B79A68",
  text: "#292D29",
  muted: "#827D70",
  border: "#EEE9DE",
  white: "#FFFFFF",
};

// =====================================================
// ADMIN USERS SCREEN
// =====================================================

export default function AdminUsersScreen() {
  const router = useRouter();

  const [users, setUsers] = useState<AdminUser[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  // ===================================================
  // FETCH USERS
  // ===================================================

  const fetchUsers = useCallback(async () => {
    try {
      setError("");

      const token = await getAuthToken();

      if (!token) {
        throw new Error("Please login again.");
      }

      const endpoint =
        `/admin/users?page=${page}&limit=10&search=${encodeURIComponent(
          search.trim()
        )}`;

      const response = await apiRequest<UsersResponse>(
        endpoint,
        "GET",
        undefined,
        token
      );

      if (!response?.success) {
        throw new Error(
          response?.message || "Unable to load users."
        );
      }

      setUsers(
        Array.isArray(response.users) ? response.users : []
      );

      setTotal(response.pagination?.total ?? 0);

      setTotalPages(
        Math.max(1, response.pagination?.totalPages ?? 1)
      );
    } catch (err: any) {
      console.error("ADMIN USERS ERROR:", err);

      setError(err?.message || "Something went wrong.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [page, search]);

  // ===================================================
  // AUTO FETCH
  // ===================================================

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // ===================================================
  // REFRESH
  // ===================================================

  const handleRefresh = () => {
    setRefreshing(true);
    fetchUsers();
  };

  // ===================================================
  // SEARCH
  // ===================================================

  const handleSearch = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  // ===================================================
  // DATE FORMAT
  // ===================================================

  const formatDate = (date?: string) => {
    if (!date) {
      return "Date unavailable";
    }

    const parsed = new Date(date);

    if (Number.isNaN(parsed.getTime())) {
      return "Date unavailable";
    }

    return parsed.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // ===================================================
  // USER CARD
  // ===================================================

  const renderUser = ({ item }: { item: AdminUser }) => (
    <View style={styles.userCard}>
      {/* USER HEADER */}

      <View style={styles.userTop}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {item.name?.charAt(0)?.toUpperCase() || "U"}
          </Text>
        </View>

        <View style={styles.userInfo}>
          <Text style={styles.userName}>
            {item.name || "Unnamed User"}
          </Text>

          <Text style={styles.userDate}>
            Joined {formatDate(item.createdAt)}
          </Text>
        </View>

        <View style={styles.roleBadge}>
          <Text style={styles.roleText}>
            {item.role || "user"}
          </Text>
        </View>
      </View>

      {/* EMAIL */}

      <View style={styles.infoRow}>
        <Mail size={17} color={COLORS.gold} />

        <Text style={styles.infoText}>
          {item.email || "No email"}
        </Text>
      </View>

      {/* PHONE */}

      <View style={styles.infoRow}>
        <Phone size={17} color={COLORS.gold} />

        <Text style={styles.infoText}>
          {item.phone || "Phone number not available"}
        </Text>
      </View>

      {/* VERIFICATION */}

      <View style={styles.verificationRow}>
        <ShieldCheck
          size={16}
          color={
            item.isVerified ? COLORS.green : COLORS.muted
          }
        />

        <Text
          style={[
            styles.verificationText,
            {
              color: item.isVerified
                ? COLORS.green
                : COLORS.muted,
            },
          ]}
        >
          {item.isVerified
            ? "Verified Account"
            : "Not Verified"}
        </Text>
      </View>
    </View>
  );

  // ===================================================
  // MAIN UI
  // ===================================================

  return (
    <SafeAreaView
      style={styles.container}
      edges={["top", "bottom"]}
    >
      {/* HEADER */}

      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          activeOpacity={0.75}
        >
          <ArrowLeft size={22} color={COLORS.green} />
        </TouchableOpacity>

        <View style={styles.headerTextContainer}>
          <Text style={styles.headerTitle}>
            Users Management
          </Text>

          <Text style={styles.headerSubtitle}>
            Manage GlowAura customers
          </Text>
        </View>

        <TouchableOpacity
          style={styles.refreshButton}
          onPress={handleRefresh}
          activeOpacity={0.75}
        >
          <RefreshCw size={19} color={COLORS.green} />
        </TouchableOpacity>
      </View>

      {/* SUMMARY CARD */}

      <View style={styles.summaryCard}>
        <View style={styles.summaryIcon}>
          <Users size={25} color={COLORS.gold} />
        </View>

        <View>
          <Text style={styles.summaryLabel}>
            Total Registered Users
          </Text>

          <Text style={styles.summaryValue}>
            {total}
          </Text>
        </View>
      </View>

      {/* SEARCH */}

      <View style={styles.searchContainer}>
        <Search size={20} color={COLORS.muted} />

        <TextInput
          style={styles.searchInput}
          placeholder="Search name or email..."
          placeholderTextColor={COLORS.muted}
          value={search}
          onChangeText={handleSearch}
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="search"
        />
      </View>

      {/* SECTION HEADER */}

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>
          All Users
        </Text>

        <Text style={styles.sectionCount}>
          {users.length} shown
        </Text>
      </View>

      {/* LOADING */}

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator
            size="large"
            color={COLORS.green}
          />

          <Text style={styles.loadingText}>
            Loading users...
          </Text>
        </View>
      ) : error ? (
        /* ERROR */

        <View style={styles.center}>
          <Text style={styles.errorText}>
            {error}
          </Text>

          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => {
              setLoading(true);
              fetchUsers();
            }}
            activeOpacity={0.8}
          >
            <Text style={styles.retryText}>
              Try Again
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        /* USERS LIST */

        <FlatList
          data={users}
          keyExtractor={(item) => item._id}
          renderItem={renderUser}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor={COLORS.green}
              colors={[COLORS.green]}
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Users size={42} color={COLORS.gold} />

              <Text style={styles.emptyTitle}>
                No Users Found
              </Text>

              <Text style={styles.emptySubtitle}>
                Registered users will appear here.
              </Text>
            </View>
          }
        />
      )}

      {/* PAGINATION */}

      {!loading && !error && total > 0 && (
        <View style={styles.pagination}>
          <TouchableOpacity
            style={[
              styles.pageButton,
              page <= 1 && styles.disabledButton,
            ]}
            disabled={page <= 1}
            onPress={() =>
              setPage((current) => current - 1)
            }
            activeOpacity={0.7}
          >
            <ChevronLeft
              size={20}
              color={COLORS.green}
            />

            <Text style={styles.pageButtonText}>
              Previous
            </Text>
          </TouchableOpacity>

          <Text style={styles.pageText}>
            {page} / {totalPages}
          </Text>

          <TouchableOpacity
            style={[
              styles.pageButton,
              page >= totalPages && styles.disabledButton,
            ]}
            disabled={page >= totalPages}
            onPress={() =>
              setPage((current) => current + 1)
            }
            activeOpacity={0.7}
          >
            <Text style={styles.pageButtonText}>
              Next
            </Text>

            <ChevronRight
              size={20}
              color={COLORS.green}
            />
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

// =====================================================
// PREMIUM STYLES
// =====================================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  // HEADER

  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 18,
    paddingVertical: 15,
  },

  backButton: {
    width: 43,
    height: 43,
    borderRadius: 14,
    backgroundColor: COLORS.white,
    alignItems: "center",
    justifyContent: "center",
  },

  headerTextContainer: {
    flex: 1,
    marginLeft: 13,
  },

  headerTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: COLORS.green,
  },

  headerSubtitle: {
    fontSize: 12,
    color: COLORS.muted,
    marginTop: 3,
  },

  refreshButton: {
    width: 42,
    height: 42,
    borderRadius: 13,
    backgroundColor: COLORS.white,
    alignItems: "center",
    justifyContent: "center",
  },

  // SUMMARY CARD

  summaryCard: {
    backgroundColor: COLORS.green,
    borderRadius: 20,
    marginHorizontal: 18,
    marginTop: 10,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
  },

  summaryIcon: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: COLORS.white,
    alignItems: "center",
    justifyContent: "center",
  },

  summaryLabel: {
    color: "#E9E3D5",
    fontSize: 13,
  },

  summaryValue: {
    color: COLORS.white,
    fontSize: 29,
    fontWeight: "800",
    marginTop: 3,
  },

  // SEARCH

  searchContainer: {
    height: 52,
    backgroundColor: COLORS.white,
    borderRadius: 15,
    marginHorizontal: 18,
    marginTop: 20,
    paddingHorizontal: 15,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  searchInput: {
    flex: 1,
    marginLeft: 10,
    color: COLORS.text,
    fontSize: 14,
  },

  // SECTION

  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 20,
    marginTop: 23,
    marginBottom: 12,
  },

  sectionTitle: {
    color: COLORS.green,
    fontSize: 18,
    fontWeight: "800",
  },

  sectionCount: {
    color: COLORS.muted,
    fontSize: 12,
  },

  // LIST

  listContent: {
    paddingHorizontal: 18,
    paddingBottom: 20,
    flexGrow: 1,
  },

  // USER CARD

  userCard: {
    backgroundColor: COLORS.white,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 16,
    marginBottom: 13,
  },

  userTop: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },

  avatar: {
    width: 45,
    height: 45,
    borderRadius: 15,
    backgroundColor: "#F1EBDD",
    alignItems: "center",
    justifyContent: "center",
  },

  avatarText: {
    color: COLORS.green,
    fontSize: 19,
    fontWeight: "800",
  },

  userInfo: {
    flex: 1,
    marginLeft: 12,
  },

  userName: {
    color: COLORS.text,
    fontSize: 15,
    fontWeight: "800",
  },

  userDate: {
    color: COLORS.muted,
    fontSize: 11,
    marginTop: 4,
  },

  roleBadge: {
    backgroundColor: "#F1EBDD",
    borderRadius: 8,
    paddingHorizontal: 9,
    paddingVertical: 5,
  },

  roleText: {
    color: COLORS.green,
    fontSize: 10,
    fontWeight: "800",
    textTransform: "uppercase",
  },

  // USER DETAILS

  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 9,
    gap: 10,
  },

  infoText: {
    flex: 1,
    color: COLORS.muted,
    fontSize: 12,
  },

  // VERIFICATION

  verificationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    gap: 7,
  },

  verificationText: {
    fontSize: 11,
    fontWeight: "700",
  },

  // LOADING / ERROR

  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 25,
  },

  loadingText: {
    color: COLORS.muted,
    marginTop: 12,
  },

  errorText: {
    color: "#B3261E",
    textAlign: "center",
    fontSize: 14,
  },

  retryButton: {
    backgroundColor: COLORS.green,
    borderRadius: 12,
    paddingHorizontal: 25,
    paddingVertical: 12,
    marginTop: 15,
  },

  retryText: {
    color: COLORS.white,
    fontWeight: "700",
  },

  // EMPTY STATE

  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 65,
  },

  emptyTitle: {
    color: COLORS.green,
    fontSize: 17,
    fontWeight: "800",
    marginTop: 14,
  },

  emptySubtitle: {
    color: COLORS.muted,
    fontSize: 12,
    marginTop: 6,
  },

  // PAGINATION

  pagination: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    backgroundColor: COLORS.white,
  },

  pageButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingVertical: 9,
    paddingHorizontal: 10,
  },

  disabledButton: {
    opacity: 0.3,
  },

  pageButtonText: {
    color: COLORS.green,
    fontSize: 12,
    fontWeight: "700",
  },

  pageText: {
    color: COLORS.text,
    fontWeight: "800",
    fontSize: 13,
  },
});