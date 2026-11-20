/* Bismillah-ir-Rahman-ir-Raheem ❤️ */
/* GLOWAURA — TWILIGHT DIWALI ROYAL ARTIST CAROUSEL */
/* 3 Independent Automatic Rows — Premium Emerald & Gold */
/* Favourite Artists Integration ❤️ */

import React, { useEffect, useRef } from "react";

import {
  View,
  Text,
  Image,
  Animated,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import { LinearGradient } from "expo-linear-gradient";

// ======================================================
// TYPES
// ======================================================

type Artist = {
  _id?: string;
  id?: string;
  name: string;
  image?: string;
  profileImage?: string;
  avatar?: string;
  speciality?: string;
  rating?: string | number;
};

type ArtistCarouselProps = {
  artists: Artist[];
  title?: string;
  subtitle?: string;
  onArtistPress?: (artist: Artist) => void;

  // FAVOURITE PROPS
  favoriteIds?: string[];
  favoriteLoadingIds?: string[];
  onToggleFavorite?: (artist: Artist) => void;
};

type ArtistRowProps = {
  artists: Artist[];
  direction: "left" | "right";
  duration: number;
  onArtistPress?: (artist: Artist) => void;
  rowNumber: number;

  favoriteIds: string[];
  favoriteLoadingIds: string[];
  onToggleFavorite?: (artist: Artist) => void;
};

// ======================================================
// THEME
// ======================================================

const C = {
  deep: "#101D17",
  forest: "#192B22",
  emerald: "#263C30",
  green: "#344D3C",
  gold: "#C6A66B",
  champagne: "#F0DDB5",
  ivory: "#FBF8F0",
  muted: "#B9B6A9",
  border: "rgba(198,166,107,0.42)",
  white: "#FFFFFF",
  heart: "#E85D75",
};

const CARD_WIDTH = 154;
const CARD_GAP = 12;

// ======================================================
// SINGLE AUTOMATIC ROW
// ======================================================

function ArtistRow({
  artists,
  direction,
  duration,
  onArtistPress,
  rowNumber,
  favoriteIds,
  favoriteLoadingIds,
  onToggleFavorite,
}: ArtistRowProps) {
  const translateX = useRef(new Animated.Value(0)).current;

  const distance = artists.length * (CARD_WIDTH + CARD_GAP);

  useEffect(() => {
    if (artists.length < 2) {
      translateX.setValue(0);
      return;
    }

    translateX.stopAnimation();

    translateX.setValue(
      direction === "right" ? -distance : 0
    );

    const firstMove = Animated.timing(translateX, {
      toValue: direction === "right" ? 0 : -distance,
      duration,
      useNativeDriver: true,
    });

    const secondMove = Animated.timing(translateX, {
      toValue: direction === "right" ? -distance : 0,
      duration,
      useNativeDriver: true,
    });

    const animation = Animated.loop(
      Animated.sequence([firstMove, secondMove]),
      { resetBeforeIteration: false }
    );

    animation.start();

    return () => {
      animation.stop();
      translateX.stopAnimation();
    };
  }, [
    artists.length,
    direction,
    distance,
    duration,
    translateX,
  ]);

  const repeatedArtists = [...artists, ...artists];

  return (
    <View style={styles.rowWrapper}>
      <View style={styles.rowLabel}>
        <View style={styles.rowGoldLine} />

        <Text style={styles.rowLabelText}>
          COLLECTION 0{rowNumber}
        </Text>

        <View style={styles.rowGoldLine} />

        <Text style={styles.rowDirection}>
          {direction === "left" ? "←" : "→"}
        </Text>
      </View>

      <View style={styles.sliderViewport}>
        <Animated.View
          style={[
            styles.sliderTrack,
            {
              width: distance * 2,
              transform: [{ translateX }],
            },
          ]}
        >
          {repeatedArtists.map((artist, index) => {
            const image =
              artist.image ||
              artist.profileImage ||
              artist.avatar;

            const artistId = artist._id || artist.id || "";

            const isFavorite =
              !!artistId && favoriteIds.includes(artistId);

            const isFavoriteLoading =
              !!artistId &&
              favoriteLoadingIds.includes(artistId);

            return (
              <View
                key={`${artistId || artist.name}-${index}`}
                style={styles.artistCard}
              >
                <LinearGradient
                  colors={["#344B3A", "#192B22", "#101D17"]}
                  style={styles.cardGradient}
                >
                  {/* MAIN CARD PRESS AREA */}

                  <TouchableOpacity
                    activeOpacity={0.88}
                    onPress={() => onArtistPress?.(artist)}
                    style={styles.cardMainContent}
                  >
                    {/* IMAGE */}

                    <View style={styles.imageFrame}>
                      {image ? (
                        <Image
                          source={{ uri: image }}
                          style={styles.artistImage}
                          resizeMode="cover"
                        />
                      ) : (
                        <View style={styles.imagePlaceholder}>
                          <Text style={styles.placeholderText}>
                            GA
                          </Text>
                        </View>
                      )}

                      <LinearGradient
                        colors={[
                          "transparent",
                          "rgba(10,20,15,0.25)",
                        ]}
                        style={styles.imageOverlay}
                      />

                      {/* PREMIUM BADGE */}

                      <View style={styles.premiumBadge}>
                        <Text style={styles.premiumBadgeText}>
                          ✦ PREMIUM
                        </Text>
                      </View>

                      {/* RATING — ONLY WHEN AVAILABLE */}

                      {artist.rating !== undefined &&
                        artist.rating !== null &&
                        String(artist.rating).trim() !== "" && (
                          <View style={styles.ratingBadge}>
                            <Text style={styles.ratingStar}>
                              ★
                            </Text>

                            <Text style={styles.ratingText}>
                              {artist.rating}
                            </Text>
                          </View>
                        )}
                    </View>

                    {/* CARD DETAILS */}

                    <View style={styles.cardDetails}>
                      <Text
                        style={styles.artistName}
                        numberOfLines={1}
                      >
                        {artist.name}
                      </Text>

                      <Text
                        style={styles.artistSpeciality}
                        numberOfLines={1}
                      >
                        {artist.speciality ||
                          "Beauty Professional"}
                      </Text>

                      <View style={styles.cardBottom}>
                        <View style={styles.cardGoldLine} />

                        <Text style={styles.discoverText}>
                          DISCOVER ARTIST
                        </Text>

                        <Text style={styles.discoverArrow}>
                          ↗
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>

                  {/* FAVOURITE HEART — SEPARATE BUTTON */}

                  <TouchableOpacity
                    activeOpacity={0.75}
                    disabled={
                      !artistId ||
                      isFavoriteLoading ||
                      !onToggleFavorite
                    }
                    onPress={() => {
                      if (!artistId || isFavoriteLoading) {
                        return;
                      }

                      onToggleFavorite?.(artist);
                    }}
                    style={[
                      styles.favoriteButton,
                      isFavorite && styles.favoriteButtonActive,
                    ]}
                    accessibilityRole="button"
                    accessibilityLabel={
                      isFavorite
                        ? `Remove ${artist.name} from favourites`
                        : `Add ${artist.name} to favourites`
                    }
                  >
                    {isFavoriteLoading ? (
                      <ActivityIndicator
                        size="small"
                        color={C.champagne}
                      />
                    ) : (
                      <Text
                        style={[
                          styles.favoriteHeart,
                          isFavorite &&
                            styles.favoriteHeartActive,
                        ]}
                      >
                        {isFavorite ? "♥" : "♡"}
                      </Text>
                    )}
                  </TouchableOpacity>

                  {/* DECORATIVE CORNER */}

                  <Text style={styles.cardDecoration}>
                    ✧
                  </Text>
                </LinearGradient>
              </View>
            );
          })}
        </Animated.View>
      </View>
    </View>
  );
}

// ======================================================
// MAIN ARTIST CAROUSEL
// ======================================================

export default function ArtistCarousel({
  artists,
  title = "Featured Beauty Artists",
  subtitle = "Discover your perfect beauty expert",
  onArtistPress,
  favoriteIds = [],
  favoriteLoadingIds = [],
  onToggleFavorite,
}: ArtistCarouselProps) {
  if (!artists || artists.length === 0) {
    return (
      <SafeAreaView
        style={styles.safeArea}
        edges={["top", "bottom", "left", "right"]}
      >
        <View style={styles.emptyContainer}>
          <Text style={styles.emptySymbol}>✧</Text>

          <Text style={styles.emptyTitle}>
            No artists available
          </Text>

          <Text style={styles.emptySubtitle}>
            Our beauty professionals will appear here.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  // Distribute artists across three independent rows.

  const rows = [
    artists.filter((_, index) => index % 3 === 0),
    artists.filter((_, index) => index % 3 === 1),
    artists.filter((_, index) => index % 3 === 2),
  ];

  return (
    <SafeAreaView
      style={styles.safeArea}
      edges={["top", "bottom", "left", "right"]}
    >
      <View style={styles.container}>
        {/* LUXURY HEADER */}

        <LinearGradient
          colors={["#263C30", "#192B22", "#101D17"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.headerCard}
        >
          <View style={styles.headerDecorationOne} />
          <View style={styles.headerDecorationTwo} />

          <View style={styles.headerTop}>
            <View style={styles.headerSeal}>
              <Text style={styles.headerSealText}>
                GA
              </Text>
            </View>

            <View style={styles.headerTextContainer}>
              <Text style={styles.headerEyebrow}>
                THE ROYAL BEAUTY COLLECTION
              </Text>

              <Text style={styles.headerTitle}>
                {title}
              </Text>

              <Text style={styles.headerSubtitle}>
                {subtitle}
              </Text>
            </View>

            <Text style={styles.headerStar}>
              ✧
            </Text>
          </View>

          <View style={styles.headerBottom}>
            <View style={styles.headerDivider} />

            <Text style={styles.headerBottomText}>
              CURATED WITH ELEGANCE
            </Text>

            <View style={styles.headerDivider} />
          </View>
        </LinearGradient>

        {/* DIWALI DECORATION */}

        <View style={styles.festivalLine}>
          <Text style={styles.festivalSymbol}>✦</Text>

          <Text style={styles.festivalText}>
            A CELEBRATION OF BEAUTY & ELEGANCE
          </Text>

          <Text style={styles.festivalSymbol}>✦</Text>
        </View>

        {/* THREE AUTOMATIC ROWS */}

        <View style={styles.rowsContainer}>
          <ArtistRow
            artists={rows[0]}
            direction="left"
            duration={18000}
            onArtistPress={onArtistPress}
            rowNumber={1}
            favoriteIds={favoriteIds}
            favoriteLoadingIds={favoriteLoadingIds}
            onToggleFavorite={onToggleFavorite}
          />

          <ArtistRow
            artists={rows[1]}
            direction="right"
            duration={22000}
            onArtistPress={onArtistPress}
            rowNumber={2}
            favoriteIds={favoriteIds}
            favoriteLoadingIds={favoriteLoadingIds}
            onToggleFavorite={onToggleFavorite}
          />

          <ArtistRow
            artists={rows[2]}
            direction="left"
            duration={20000}
            onArtistPress={onArtistPress}
            rowNumber={3}
            favoriteIds={favoriteIds}
            favoriteLoadingIds={favoriteLoadingIds}
            onToggleFavorite={onToggleFavorite}
          />
        </View>

        {/* FOOTER */}

        <View style={styles.carouselFooter}>
          <Text style={styles.footerSparkle}>✧</Text>

          <Text style={styles.carouselFooterText}>
            YOUR BEAUTY. YOUR ARTIST. YOUR MOMENT.
          </Text>

          <Text style={styles.footerSparkle}>✧</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

// ======================================================
// PREMIUM STYLES
// ======================================================

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: C.deep,
  },

  container: {
    marginRight: 20,
    padding: 12,
    backgroundColor: C.deep,
    borderRadius: 23,
    borderWidth: 1,
    borderColor: C.gold,
    overflow: "hidden",
  },

  // HEADER

  headerCard: {
    borderRadius: 17,
    paddingHorizontal: 14,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: C.border,
    overflow: "hidden",
  },

  headerDecorationOne: {
    position: "absolute",
    right: -20,
    top: -35,
    width: 125,
    height: 125,
    borderRadius: 70,
    borderWidth: 1,
    borderColor: "rgba(240,221,181,0.17)",
  },

  headerDecorationTwo: {
    position: "absolute",
    right: 8,
    top: -12,
    width: 80,
    height: 80,
    borderRadius: 45,
    borderWidth: 1,
    borderColor: "rgba(240,221,181,0.12)",
  },

  headerTop: {
    flexDirection: "row",
    alignItems: "center",
  },

  headerSeal: {
    width: 49,
    height: 49,
    borderRadius: 26,
    borderWidth: 1,
    borderColor: C.gold,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
    backgroundColor: "rgba(240,221,181,0.07)",
  },

  headerSealText: {
    color: C.champagne,
    fontFamily: "Georgia",
    fontSize: 20,
    fontWeight: "700",
    letterSpacing: -2,
  },

  headerTextContainer: {
    flex: 1,
  },

  headerEyebrow: {
    color: C.gold,
    fontSize: 7,
    letterSpacing: 1.5,
    fontWeight: "800",
  },

  headerTitle: {
    color: C.ivory,
    fontFamily: "Georgia",
    fontSize: 20,
    marginTop: 5,
  },

  headerSubtitle: {
    color: "#C4C7BB",
    fontSize: 9,
    marginTop: 4,
  },

  headerStar: {
    color: C.champagne,
    fontSize: 25,
    marginLeft: 5,
  },

  headerBottom: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 15,
    gap: 9,
  },

  headerDivider: {
    flex: 1,
    height: 1,
    backgroundColor: "rgba(198,166,107,0.4)",
  },

  headerBottomText: {
    color: C.champagne,
    fontSize: 7,
    letterSpacing: 1.4,
    fontWeight: "700",
  },

  // FESTIVAL LINE

  festivalLine: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 13,
    gap: 9,
  },

  festivalSymbol: {
    color: C.gold,
    fontSize: 12,
  },

  festivalText: {
    color: C.champagne,
    fontSize: 7,
    letterSpacing: 1.2,
    fontWeight: "800",
  },

  // ROWS

  rowsContainer: {
    gap: 17,
  },

  rowWrapper: {
    width: "100%",
  },

  rowLabel: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    gap: 7,
  },

  rowGoldLine: {
    width: 16,
    height: 1,
    backgroundColor: C.gold,
    opacity: 0.7,
  },

  rowLabelText: {
    color: C.champagne,
    fontSize: 7,
    letterSpacing: 1.4,
    fontWeight: "800",
  },

  rowDirection: {
    color: C.gold,
    fontSize: 13,
    marginLeft: 2,
  },

  sliderViewport: {
    width: "100%",
    overflow: "hidden",
  },

  sliderTrack: {
    flexDirection: "row",
    alignItems: "center",
  },

  // ARTIST CARD

  artistCard: {
    width: CARD_WIDTH,
    height: 224,
    marginRight: CARD_GAP,
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: C.gold,
    backgroundColor: C.forest,
  },

  cardGradient: {
    flex: 1,
    padding: 7,
    overflow: "hidden",
  },

  cardMainContent: {
    flex: 1,
  },

  imageFrame: {
    width: "100%",
    height: 132,
    borderRadius: 11,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(240,221,181,0.6)",
    position: "relative",
    backgroundColor: C.green,
  },

  artistImage: {
    width: "100%",
    height: "100%",
  },

  imagePlaceholder: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: C.green,
  },

  placeholderText: {
    color: C.champagne,
    fontFamily: "Georgia",
    fontSize: 35,
  },

  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
  },

  premiumBadge: {
    position: "absolute",
    top: 7,
    left: 7,
    backgroundColor: "rgba(20,38,28,0.9)",
    paddingHorizontal: 7,
    paddingVertical: 5,
    borderRadius: 7,
    borderWidth: 1,
    borderColor: C.gold,
  },

  premiumBadgeText: {
    color: C.champagne,
    fontSize: 6,
    fontWeight: "800",
    letterSpacing: 0.5,
  },

  ratingBadge: {
    position: "absolute",
    bottom: 7,
    right: 7,
    backgroundColor: C.champagne,
    borderRadius: 8,
    paddingHorizontal: 7,
    paddingVertical: 4,
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },

  ratingStar: {
    color: "#8E642C",
    fontSize: 9,
  },

  ratingText: {
    color: C.deep,
    fontSize: 8,
    fontWeight: "900",
  },

  // FAVOURITE HEART

  favoriteButton: {
    position: "absolute",
    top: 6,
    right: 6,
    width: 31,
    height: 31,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(16,29,23,0.94)",
    borderWidth: 1,
    borderColor: C.gold,
    zIndex: 10,
    elevation: 5,
  },

  favoriteButtonActive: {
    backgroundColor: "rgba(232,93,117,0.20)",
    borderColor: C.heart,
  },

  favoriteHeart: {
    color: C.champagne,
    fontSize: 21,
    lineHeight: 25,
  },

  favoriteHeartActive: {
    color: C.heart,
  },

  // DETAILS

  cardDetails: {
    paddingHorizontal: 4,
    paddingTop: 9,
    flex: 1,
  },

  artistName: {
    color: C.ivory,
    fontFamily: "Georgia",
    fontSize: 13,
    fontWeight: "700",
  },

  artistSpeciality: {
    color: "#C5C8BB",
    fontSize: 8,
    marginTop: 5,
  },

  cardBottom: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: "auto",
    paddingBottom: 3,
  },

  cardGoldLine: {
    width: 17,
    height: 1,
    backgroundColor: C.gold,
    marginRight: 6,
  },

  discoverText: {
    color: C.champagne,
    fontSize: 6,
    letterSpacing: 0.7,
    fontWeight: "800",
    flex: 1,
  },

  discoverArrow: {
    color: C.gold,
    fontSize: 13,
  },

  cardDecoration: {
    position: "absolute",
    right: 7,
    bottom: 37,
    color: "rgba(240,221,181,0.12)",
    fontSize: 24,
    pointerEvents: "none",
  },

  // FOOTER

  carouselFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 17,
    gap: 9,
  },

  footerSparkle: {
    color: C.gold,
    fontSize: 12,
  },

  carouselFooterText: {
    color: C.muted,
    fontSize: 7,
    letterSpacing: 1,
    fontWeight: "700",
  },

  // EMPTY

  emptyContainer: {
    backgroundColor: C.forest,
    borderRadius: 18,
    padding: 25,
    alignItems: "center",
    borderWidth: 1,
    borderColor: C.gold,
  },

  emptySymbol: {
    color: C.champagne,
    fontSize: 30,
  },

  emptyTitle: {
    color: C.ivory,
    fontFamily: "Georgia",
    fontSize: 17,
    marginTop: 8,
  },

  emptySubtitle: {
    color: C.muted,
    fontSize: 10,
    marginTop: 6,
    textAlign: "center",
  },
});