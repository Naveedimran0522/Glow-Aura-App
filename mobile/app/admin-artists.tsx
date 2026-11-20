/* Bismillah-ir-Rahman-ir-Raheem ❤️ */
/* GLOWAURA — ADMIN ARTISTS MANAGEMENT */

import React, { useCallback, useState } from "react";

import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import { useFocusEffect, useRouter } from "expo-router";

import {
  ArrowLeft,
  Search,
  RefreshCw,
  Users,
} from "lucide-react-native";

import { apiRequest } from "../services/api";
import { getAuthToken } from "../services/auth";

interface Artist {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
  isVerified: boolean;
  createdAt: string;
}

interface Pagination {
  currentPage: number;
  totalPages: number;
  totalArtists: number;
  limit: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

interface ArtistsResponse {
  success: boolean;
  message: string;
  artists: Artist[];
  pagination: Pagination;
}

const COLORS = {
  background: "#FBF8F1",
  green: "#344A3D",
  gold: "#B79A68",
  text: "#292D28",
  muted: "#827D70",
  border: "#EEE9DE",
  white: "#FFFFFF",
  red: "#B94A48",
};

export default function AdminArtistsScreen() {
  const router = useRouter();

  const [artists, setArtists] = useState<Artist[]>([]);
  const [searchText, setSearchText] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");

  const [page, setPage] = useState(1);
  const [pagination, setPagination] =
    useState<Pagination | null>(null);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const loadArtists = useCallback(async () => {
    try {
      setErrorMessage("");

      const token = await getAuthToken();

      if (!token) {
        router.replace("/login");
        return;
      }

      const endpoint =
        `/admin/artists?page=${page}&limit=10` +
        `&search=${encodeURIComponent(appliedSearch)}`;

      const response = await apiRequest<ArtistsResponse>(
        endpoint,
        "GET",
        undefined,
        token
      );

      if (!response.success) {
        throw new Error(
          response.message || "Unable to load artists."
        );
      }

      setArtists(response.artists || []);
      setPagination(response.pagination || null);
    } catch (error: any) {
      const message =
        error?.message || "Unable to load artists.";

      setErrorMessage(message);

      if (
        message.toLowerCase().includes("unauthorized") ||
        message.toLowerCase().includes("admin") ||
        message.toLowerCase().includes("authentication")
      ) {
        Alert.alert("Access Denied", message);
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [page, appliedSearch, router]);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      loadArtists();
    }, [loadArtists])
  );

  const handleSearch = () => {
    setPage(1);
    setLoading(true);
    setAppliedSearch(searchText.trim());
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadArtists();
  };

  const changePage = (nextPage: number) => {
    if (
      nextPage < 1 ||
      (pagination && nextPage > pagination.totalPages)
    ) {
      return;
    }

    setPage(nextPage);
    setLoading(true);
  };

  const formatDate = (date: string) => {
    if (!date) return "Unavailable";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "Unavailable";
    }

    return parsedDate.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const renderArtist = ({ item }: { item: Artist }) => (
    <View style={styles.artistCard}>
      <View style={styles.artistTop}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {(item.name || "A")
              .charAt(0)
              .toUpperCase()}
          </Text>
        </View>

        <View style={styles.artistInfo}>
          <Text style={styles.artistName} numberOfLines={1}>
            {item.name || "Unnamed Artist"}
          </Text>

          <Text style={styles.artistEmail} numberOfLines={1}>
            {item.email}
          </Text>
        </View>

        <View style={styles.roleBadge}>
          <Text style={styles.roleText}>ARTIST</Text>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.detailRow}>
        <Text style={styles.detailLabel}>Phone</Text>
        <Text style={styles.detailValue}>
          {item.phone || "Not provided"}
        </Text>
      </View>

      <View style={styles.detailRow}>
        <Text style={styles.detailLabel}>Verification</Text>

        <Text
          style={[
            styles.detailValue,
            {
              color: item.isVerified
                ? COLORS.green
                : COLORS.red,
            },
          ]}
        >
          {item.isVerified ? "Verified" : "Not verified"}
        </Text>
      </View>

      <View style={styles.detailRow}>
        <Text style={styles.detailLabel}>Joined</Text>
        <Text style={styles.detailValue}>
          {formatDate(item.createdAt)}
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView
      style={styles.safeArea}
      edges={["top", "bottom", "left", "right"]}
    >
      {/* HEADER */}

      <View style={styles.header}>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={22} color={COLORS.green} />
        </TouchableOpacity>

        <View style={styles.headerInfo}>
          <Text style={styles.headerTitle}>
            Artists Management
          </Text>

          <Text style={styles.headerSubtitle}>
            Manage GlowAura artists
          </Text>
        </View>

        <TouchableOpacity
          style={styles.iconButton}
          onPress={handleRefresh}
        >
          <RefreshCw size={19} color={COLORS.green} />
        </TouchableOpacity>
      </View>

      {/* TOTAL ARTISTS */}

      <View style={styles.summaryCard}>
        <View style={styles.summaryIcon}>
          <Users size={25} color={COLORS.gold} />
        </View>

        <View>
          <Text style={styles.summaryLabel}>
            Total Artists
          </Text>

          <Text style={styles.summaryNumber}>
            {pagination?.totalArtists ?? 0}
          </Text>
        </View>
      </View>

      {/* SEARCH */}

      <View style={styles.searchContainer}>
        <Search size={20} color={COLORS.muted} />

        <TextInput
          style={styles.searchInput}
          placeholder="Search artist name, email or phone..."
          placeholderTextColor={COLORS.muted}
          value={searchText}
          onChangeText={setSearchText}
          onSubmitEditing={handleSearch}
          returnKeyType="search"
          autoCapitalize="none"
        />

        <TouchableOpacity
          style={styles.searchButton}
          onPress={handleSearch}
        >
          <Text style={styles.searchButtonText}>
            Search
          </Text>
        </TouchableOpacity>
      </View>

      {/* SECTION TITLE */}

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>
          Registered Artists
        </Text>

        <Text style={styles.sectionCount}>
          {artists.length} shown
        </Text>
      </View>

      {/* LOADING / ERROR / LIST */}

      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator
            size="large"
            color={COLORS.green}
          />

          <Text style={styles.loadingText}>
            Loading artists...
          </Text>
        </View>
      ) : errorMessage && artists.length === 0 ? (
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>
            {errorMessage}
          </Text>

          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => {
              setLoading(true);
              loadArtists();
            }}
          >
            <Text style={styles.retryText}>
              Try Again
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={artists}
          keyExtractor={(item) => item._id}
          renderItem={renderArtist}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor={COLORS.green}
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Users size={40} color={COLORS.gold} />

              <Text style={styles.emptyTitle}>
                No artists found
              </Text>

              <Text style={styles.emptySubtitle}>
                No artist accounts match your search.
              </Text>
            </View>
          }
          ListFooterComponent={
            pagination && pagination.totalPages > 1 ? (
              <View style={styles.pagination}>
                <TouchableOpacity
                  style={[
                    styles.pageButton,
                    !pagination.hasPreviousPage &&
                      styles.disabledButton,
                  ]}
                  disabled={!pagination.hasPreviousPage}
                  onPress={() => changePage(page - 1)}
                >
                  <Text style={styles.pageButtonText}>
                    Previous
                  </Text>
                </TouchableOpacity>

                <Text style={styles.pageNumber}>
                  {pagination.currentPage} /{" "}
                  {pagination.totalPages}
                </Text>

                <TouchableOpacity
                  style={[
                    styles.pageButton,
                    !pagination.hasNextPage &&
                      styles.disabledButton,
                  ]}
                  disabled={!pagination.hasNextPage}
                  onPress={() => changePage(page + 1)}
                >
                  <Text style={styles.pageButtonText}>
                    Next
                  </Text>
                </TouchableOpacity>
              </View>
            ) : null
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 18,
    paddingVertical: 14,
  },
  iconButton: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: COLORS.white,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  headerInfo: {
    flex: 1,
    marginLeft: 12,
  },
  headerTitle: {
    fontSize: 19,
    fontWeight: "800",
    color: COLORS.green,
  },
  headerSubtitle: {
    fontSize: 12,
    color: COLORS.muted,
    marginTop: 3,
  },
  summaryCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.green,
    marginHorizontal: 18,
    marginTop: 8,
    padding: 18,
    borderRadius: 18,
    gap: 14,
  },
  summaryIcon: {
    width: 48,
    height: 48,
    borderRadius: 15,
    backgroundColor: COLORS.white,
    justifyContent: "center",
    alignItems: "center",
  },
  summaryLabel: {
    color: "#E8E2D5",
    fontSize: 13,
  },
  summaryNumber: {
    color: COLORS.white,
    fontSize: 27,
    fontWeight: "800",
    marginTop: 3,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.white,
    marginHorizontal: 18,
    marginTop: 18,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 13,
    height: 52,
    gap: 9,
  },
  searchInput: {
    flex: 1,
    color: COLORS.text,
    fontSize: 12,
  },
  searchButton: {
    backgroundColor: COLORS.green,
    paddingHorizontal: 13,
    paddingVertical: 9,
    borderRadius: 9,
  },
  searchButtonText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: "700",
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 20,
    marginTop: 22,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: COLORS.green,
  },
  sectionCount: {
    fontSize: 12,
    color: COLORS.muted,
  },
  listContent: {
    paddingHorizontal: 18,
    paddingBottom: 30,
  },
  artistCard: {
    backgroundColor: COLORS.white,
    borderRadius: 17,
    padding: 15,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  artistTop: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 45,
    height: 45,
    borderRadius: 15,
    backgroundColor: "#EDE8DB",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    color: COLORS.green,
    fontSize: 19,
    fontWeight: "800",
  },
  artistInfo: {
    flex: 1,
    marginLeft: 11,
    marginRight: 5,
  },
  artistName: {
    fontSize: 15,
    fontWeight: "800",
    color: COLORS.text,
  },
  artistEmail: {
    fontSize: 11,
    color: COLORS.muted,
    marginTop: 4,
  },
  roleBadge: {
    paddingHorizontal: 9,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: "#E8EFE8",
  },
  roleText: {
    fontSize: 9,
    fontWeight: "800",
    color: COLORS.green,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 13,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 9,
  },
  detailLabel: {
    fontSize: 12,
    color: COLORS.muted,
  },
  detailValue: {
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.text,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 25,
  },
  loadingText: {
    color: COLORS.muted,
    marginTop: 12,
    fontSize: 13,
  },
  errorText: {
    color: COLORS.red,
    textAlign: "center",
    fontSize: 13,
  },
  retryButton: {
    marginTop: 15,
    backgroundColor: COLORS.green,
    paddingHorizontal: 25,
    paddingVertical: 12,
    borderRadius: 10,
  },
  retryText: {
    color: COLORS.white,
    fontWeight: "700",
  },
  emptyContainer: {
    alignItems: "center",
    paddingVertical: 55,
  },
  emptyTitle: {
    color: COLORS.green,
    fontSize: 16,
    fontWeight: "800",
    marginTop: 14,
  },
  emptySubtitle: {
    color: COLORS.muted,
    fontSize: 12,
    textAlign: "center",
    marginTop: 6,
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 18,
  },
  pageButton: {
    backgroundColor: COLORS.green,
    paddingHorizontal: 15,
    paddingVertical: 11,
    borderRadius: 10,
  },
  disabledButton: {
    opacity: 0.35,
  },
  pageButtonText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: "700",
  },
  pageNumber: {
    color: COLORS.green,
    fontSize: 13,
    fontWeight: "800",
  },
});