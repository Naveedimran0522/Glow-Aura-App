
/* Bismillah-ir-Rahman-ir-Raheem ❤️ */
/* GLOWAURA — PREMIUM FAVOURITE ARTISTS */

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
  Alert,
} from "react-native";

import {
  useFocusEffect,
  useRouter,
} from "expo-router";

import * as SecureStore from "expo-secure-store";

import {
  FavoriteArtist,
  getAvailableArtists,
  getFavoriteArtists,
  addFavoriteArtist,
  removeFavoriteArtist,
} from "../services/api";

export default function FavoriteArtistsScreen() {
  const router = useRouter();

  const [artists, setArtists] = useState<FavoriteArtist[]>([]);
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);

  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [error, setError] = useState("");

  /* ==========================================
     LOAD ARTISTS AND FAVOURITES
  ========================================== */

  const loadArtists = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const token = await SecureStore.getItemAsync(
        "glowaura_auth_token"
      );

      if (!token) {
        router.replace("/login");
        return;
      }

      const [
        availableResponse,
        favoriteResponse,
      ] = await Promise.all([
        getAvailableArtists(token),
        getFavoriteArtists(token),
      ]);

      if (
        !availableResponse?.success ||
        !favoriteResponse?.success
      ) {
        throw new Error(
          "Unable to load favourite artists."
        );
      }

      setArtists(
        Array.isArray(availableResponse.artists)
          ? availableResponse.artists
          : []
      );

      setFavoriteIds(
        Array.isArray(favoriteResponse.artists)
          ? favoriteResponse.artists.map(
              (artist) => artist._id
            )
          : []
      );

    } catch (err: any) {
      console.error(
        "FAVOURITE ARTISTS ERROR:",
        err
      );

      setError(
        err?.message || "Unable to load artists."
      );

    } finally {
      setLoading(false);
    }
  }, [router]);

  /* ==========================================
     REFRESH WHEN SCREEN OPENS
  ========================================== */

  useFocusEffect(
    useCallback(() => {
      loadArtists();
    }, [loadArtists])
  );

  /* ==========================================
     TOGGLE FAVOURITE
  ========================================== */

  const handleToggleFavorite = async (
    artist: FavoriteArtist
  ) => {
    if (updatingId) return;

    const isFavorite = favoriteIds.includes(artist._id);

    try {
      setUpdatingId(artist._id);

      const token = await SecureStore.getItemAsync(
        "glowaura_auth_token"
      );

      if (!token) {
        router.replace("/login");
        return;
      }

      if (isFavorite) {
        await removeFavoriteArtist(
          artist._id,
          token
        );

        setFavoriteIds((previous) =>
          previous.filter((id) => id !== artist._id)
        );

        Alert.alert(
          "Removed ❤️",
          `${artist.name} removed from your favourites.`
        );

      } else {
        await addFavoriteArtist(
          artist._id,
          token
        );

        setFavoriteIds((previous) =>
          previous.includes(artist._id)
            ? previous
            : [...previous, artist._id]
        );

        Alert.alert(
          "Added ❤️",
          `${artist.name} added to your favourites.`
        );
      }

    } catch (err: any) {
      console.error(
        "TOGGLE FAVOURITE ERROR:",
        err
      );

      Alert.alert(
        "Error",
        err?.message || "Unable to update favourite."
      );

    } finally {
      setUpdatingId(null);
    }
  };

  /* ==========================================
     LOADING SCREEN
  ========================================== */

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator
          size="large"
          color="#B98555"
        />

        <Text style={styles.loadingText}>
          Loading your favourite artists...
        </Text>
      </View>
    );
  }

  /* ==========================================
     ERROR SCREEN
  ========================================== */

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorTitle}>
          Unable to Load Artists
        </Text>

        <Text style={styles.errorText}>
          {error}
        </Text>

        <TouchableOpacity
          style={styles.retryButton}
          onPress={loadArtists}
        >
          <Text style={styles.retryText}>
            Try Again
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.backRetryButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backRetryText}>
            Go Back
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  /* ==========================================
     FAVOURITE ARTISTS UI
  ========================================== */

  return (
    <View style={styles.screen}>

      {/* HEADER */}

      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backText}>‹</Text>
        </TouchableOpacity>

        <View style={styles.headerContent}>
          <Text style={styles.title}>
            Favourite Artists
          </Text>

          <Text style={styles.subtitle}>
            Your favourite beauty professionals
          </Text>
        </View>
      </View>

      {/* FAVOURITE COUNT */}

      <View style={styles.countCard}>
        <Text style={styles.countNumber}>
          {favoriteIds.length}
        </Text>

        <Text style={styles.countLabel}>
          Saved Favourite Artists ❤️
        </Text>
      </View>

      {/* ARTIST LIST */}

      <ScrollView
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      >

        {artists.length === 0 ? (

          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>
              ♡
            </Text>

            <Text style={styles.emptyTitle}>
              No Artists Available
            </Text>

            <Text style={styles.emptyText}>
              Verified artists will appear here when available.
            </Text>
          </View>

        ) : (

          artists.map((artist) => {
            const isFavorite = favoriteIds.includes(
              artist._id
            );

            const isUpdating =
              updatingId === artist._id;

            return (
              <View
                key={artist._id}
                style={styles.artistCard}
              >

                <View style={styles.artistAvatar}>
                  <Text style={styles.avatarText}>
                    {artist.name?.charAt(0)?.toUpperCase() || "A"}
                  </Text>
                </View>

                <View style={styles.artistInfo}>
                  <Text style={styles.artistName}>
                    {artist.name}
                  </Text>

                  <Text style={styles.artistRole}>
                    Beauty Professional
                  </Text>

                  <Text style={styles.verified}>
                    ✓ Verified Artist
                  </Text>
                </View>

                <TouchableOpacity
                  style={[
                    styles.heartButton,
                    isFavorite && styles.activeHeart,
                  ]}
                  onPress={() =>
                    handleToggleFavorite(artist)
                  }
                  disabled={!!updatingId}
                  activeOpacity={0.7}
                >
                  {isUpdating ? (
                    <ActivityIndicator
                      size="small"
                      color="#C66B89"
                    />
                  ) : (
                    <Text
                      style={[
                        styles.heart,
                        isFavorite && styles.heartActive,
                      ]}
                    >
                      {isFavorite ? "♥" : "♡"}
                    </Text>
                  )}
                </TouchableOpacity>

              </View>
            );
          })

        )}

        <View style={styles.bottomSpace} />

      </ScrollView>
    </View>
  );
}

/* ==========================================
   STYLES
========================================== */

const styles = StyleSheet.create({

  screen: {
    flex: 1,
    backgroundColor: "#FBF8F1",
  },

  center: {
    flex: 1,
    backgroundColor: "#FBF8F1",
    alignItems: "center",
    justifyContent: "center",
    padding: 25,
  },

  loadingText: {
    color: "#34483A",
    marginTop: 15,
    fontSize: 13,
  },

  errorTitle: {
    color: "#34483A",
    fontSize: 21,
    fontWeight: "700",
  },

  errorText: {
    color: "#898579",
    fontSize: 13,
    marginTop: 10,
    textAlign: "center",
  },

  retryButton: {
    backgroundColor: "#34483A",
    paddingHorizontal: 30,
    paddingVertical: 13,
    borderRadius: 12,
    marginTop: 20,
  },

  retryText: {
    color: "#FFFFFF",
    fontWeight: "700",
  },

  backRetryButton: {
    padding: 12,
    marginTop: 8,
  },

  backRetryText: {
    color: "#34483A",
    fontWeight: "600",
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 22,
  },

  backButton: {
    width: 43,
    height: 43,
    borderRadius: 14,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#EEE9DE",
  },

  backText: {
    color: "#34483A",
    fontSize: 34,
    lineHeight: 38,
  },

  headerContent: {
    marginLeft: 14,
    flex: 1,
  },

  title: {
    fontFamily: "Georgia",
    fontSize: 22,
    color: "#34483A",
  },

  subtitle: {
    color: "#898579",
    fontSize: 11,
    marginTop: 5,
  },

  countCard: {
    marginHorizontal: 20,
    marginBottom: 18,
    padding: 18,
    borderRadius: 17,
    backgroundColor: "#34483A",
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  countNumber: {
    color: "#E8C783",
    fontSize: 29,
    fontWeight: "bold",
  },

  countLabel: {
    color: "#FFFFFF",
    fontSize: 12,
  },

  list: {
    paddingHorizontal: 20,
    paddingTop: 3,
  },

  artistCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 17,
    padding: 15,
    marginBottom: 13,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#EEE9DE",
  },

  artistAvatar: {
    width: 54,
    height: 54,
    borderRadius: 17,
    backgroundColor: "#F3E7DC",
    alignItems: "center",
    justifyContent: "center",
  },

  avatarText: {
    color: "#34483A",
    fontSize: 23,
    fontFamily: "Georgia",
  },

  artistInfo: {
    flex: 1,
    marginLeft: 13,
  },

  artistName: {
    color: "#34483A",
    fontSize: 14,
    fontWeight: "700",
  },

  artistRole: {
    color: "#898579",
    fontSize: 11,
    marginTop: 4,
  },

  verified: {
    color: "#426B58",
    fontSize: 10,
    marginTop: 5,
  },

  heartButton: {
    width: 43,
    height: 43,
    borderRadius: 14,
    backgroundColor: "#FBF8F1",
    alignItems: "center",
    justifyContent: "center",
  },

  activeHeart: {
    backgroundColor: "#FCE8EF",
  },

  heart: {
    color: "#C66B89",
    fontSize: 27,
  },

  heartActive: {
    color: "#C66B89",
  },

  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 75,
  },

  emptyIcon: {
    color: "#C66B89",
    fontSize: 65,
  },

  emptyTitle: {
    color: "#34483A",
    fontSize: 19,
    fontWeight: "700",
    marginTop: 15,
  },

  emptyText: {
    color: "#898579",
    fontSize: 12,
    textAlign: "center",
    marginTop: 8,
    lineHeight: 20,
  },

  bottomSpace: {
    height: 35,
  },

});
