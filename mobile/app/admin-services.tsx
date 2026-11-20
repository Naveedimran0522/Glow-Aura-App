/* Bismillah-ir-Rahman-ir-Raheem ❤️ */
/* GLOWAURA — PREMIUM ADMIN SERVICES MANAGEMENT */
/* SAFE AREA + FOREST GREEN + CHAMPAGNE GOLD */

import React, { useCallback, useEffect, useState } from "react";

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Modal,
  RefreshControl,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";

// ==========================================
// CONFIGURATION
// ==========================================

const RAW_API_URL = process.env.EXPO_PUBLIC_API_URL || "";

const CLEAN_API_URL = RAW_API_URL.trim().replace(/\/+$/, "");

const API_BASE_URL = CLEAN_API_URL
  ? CLEAN_API_URL.endsWith("/api")
    ? CLEAN_API_URL
    : `${CLEAN_API_URL}/api`
  : "";

const TOKEN_KEY = "glowaura_auth_token";

const COLORS = {
  background: "#FBF8F1",
  green: "#34483A",
  gold: "#B79A68",
  text: "#292D28",
  muted: "#827D70",
  white: "#FFFFFF",
  border: "#EEE9DE",
  red: "#C65353",
  lightGreen: "#EAF0E8",
};

const CATEGORIES = [
  "All",
  "Skin Care",
  "Bridal Care",
  "Mehndi Care",
] as const;

type Category = "Skin Care" | "Bridal Care" | "Mehndi Care";
type CategoryFilter = "All" | Category;

interface Service {
  _id: string;
  serviceId: string;
  name: string;
  description: string;
  category: string;
  price: number;
  duration: string;
  image?: string;
  rating?: number;
  isActive: boolean;
}

interface ServiceForm {
  serviceId: string;
  name: string;
  description: string;
  category: Category;
  price: string;
  duration: string;
  image: string;
  rating: string;
}

const EMPTY_FORM: ServiceForm = {
  serviceId: "",
  name: "",
  description: "",
  category: "Skin Care",
  price: "",
  duration: "",
  image: "",
  rating: "0",
};

// ==========================================
// CATEGORY NORMALIZATION
// ==========================================

const normalizeCategory = (category: unknown): Category | null => {
  const value = String(category || "")
    .toLowerCase()
    .trim()
    .replace(/[\s_-]+/g, "");

  if (
    ["skincare", "skin", "facial", "facials"].includes(value)
  ) {
    return "Skin Care";
  }

  if (
    ["bridalcare", "bridal", "engagement"].includes(value)
  ) {
    return "Bridal Care";
  }

  if (
    ["mehndicare", "mehndi", "henna"].includes(value)
  ) {
    return "Mehndi Care";
  }

  return null;
};

// ==========================================
// API RESPONSE HELPERS
// ==========================================

const extractServices = (response: any): any[] => {
  if (Array.isArray(response)) {
    return response;
  }

  const possibleLists = [
    response?.services,
    response?.data?.services,
    response?.data?.items,
    response?.data?.results,
    response?.data,
    response?.items,
    response?.results,
  ];

  for (const list of possibleLists) {
    if (Array.isArray(list)) {
      return list;
    }
  }

  return [];
};

const normalizeService = (item: any): Service => {
  const rawId = item?._id || item?.id || item?.serviceId || "";

  return {
    _id: String(rawId),
    serviceId: String(
      item?.serviceId || item?.slug || item?.code || rawId || ""
    ),
    name: String(item?.name || item?.title || "Unnamed Service"),
    description: String(item?.description || ""),
    category:
      normalizeCategory(item?.category) ||
      String(item?.category || "Uncategorized"),
    price: Number(item?.price ?? 0),
    duration: String(item?.duration || ""),
    image: String(item?.image || item?.imageUrl || ""),
    rating: Number(item?.rating ?? 0),
    isActive: item?.isActive !== false,
  };
};

// ==========================================
// API REQUEST
// ==========================================

const apiRequest = async (
  endpoint: string,
  method = "GET",
  body?: object
): Promise<any> => {
  if (!API_BASE_URL) {
    throw new Error(
      "EXPO_PUBLIC_API_URL missing hai. Mobile .env file check karo."
    );
  }

  const token = await SecureStore.getItemAsync(TOKEN_KEY);

  if (!token) {
    throw new Error(
      "Admin login token nahi mila. Please dobara login karo."
    );
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
  });

  const responseText = await response.text();

  let data: any = {};

  if (responseText) {
    try {
      data = JSON.parse(responseText);
    } catch {
      throw new Error(
        `Server ne invalid response diya. HTTP ${response.status}`
      );
    }
  }

  if (!response.ok) {
    throw new Error(
      data?.message ||
        data?.error ||
        `Request failed. HTTP ${response.status}`
    );
  }

  if (data?.success === false) {
    throw new Error(data?.message || "API request unsuccessful.");
  }

  return data;
};

// ==========================================
// MAIN SCREEN
// ==========================================

export default function AdminServicesScreen() {
  const router = useRouter();

  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [saving, setSaving] = useState(false);

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] =
    useState<CategoryFilter>("All");

  const [modalVisible, setModalVisible] = useState(false);
  const [editingService, setEditingService] =
    useState<Service | null>(null);

  const [form, setForm] = useState<ServiceForm>({
    ...EMPTY_FORM,
  });

  // ==========================================
  // FETCH SERVICES
  // ==========================================

  const fetchServices = useCallback(async () => {
    try {
      const response = await apiRequest(
        "/services/admin?limit=100&page=1"
      );

      console.log(
        "GLOWAURA SERVICES API RESPONSE:",
        JSON.stringify(response, null, 2)
      );

      const serviceList = extractServices(response);

      const normalizedServices = serviceList
        .map(normalizeService)
        .filter((service: Service) => service._id.length > 0);

      setServices(normalizedServices);

      console.log(
        "GLOWAURA TOTAL SERVICES:",
        normalizedServices.length
      );
    } catch (error: any) {
      console.error("GLOWAURA FETCH SERVICES ERROR:", error);

      Alert.alert(
        "Services Error",
        error?.message || "Unable to load services."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchServices();
  };

  // ==========================================
  // FORM HELPERS
  // ==========================================

  const updateForm = (
    field: keyof ServiceForm,
    value: string
  ) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const openAddModal = () => {
    setEditingService(null);
    setForm({ ...EMPTY_FORM });
    setModalVisible(true);
  };

  const openEditModal = (service: Service) => {
    const normalizedCategory = normalizeCategory(service.category);

    setEditingService(service);

    setForm({
      serviceId: service.serviceId,
      name: service.name,
      description: service.description,
      category: normalizedCategory || "Skin Care",
      price: String(service.price),
      duration: service.duration,
      image: service.image || "",
      rating: String(service.rating ?? 0),
    });

    setModalVisible(true);
  };

  const closeModal = () => {
    if (saving) return;

    setModalVisible(false);
    setEditingService(null);
    setForm({ ...EMPTY_FORM });
  };

  // ==========================================
  // VALIDATE FORM
  // ==========================================

  const validateForm = (): boolean => {
    if (!editingService && !form.serviceId.trim()) {
      Alert.alert("Validation", "Service ID is required.");
      return false;
    }

    if (!form.name.trim()) {
      Alert.alert("Validation", "Service name is required.");
      return false;
    }

    if (!form.description.trim()) {
      Alert.alert("Validation", "Description is required.");
      return false;
    }

    const price = Number(form.price);

    if (
      !form.price.trim() ||
      !Number.isFinite(price) ||
      price < 0
    ) {
      Alert.alert("Validation", "Enter a valid price.");
      return false;
    }

    if (!form.duration.trim()) {
      Alert.alert("Validation", "Duration is required.");
      return false;
    }

    const rating = Number(form.rating);

    if (
      !Number.isFinite(rating) ||
      rating < 0 ||
      rating > 5
    ) {
      Alert.alert(
        "Validation",
        "Rating must be between 0 and 5."
      );
      return false;
    }

    return true;
  };

  // ==========================================
  // CREATE / UPDATE SERVICE
  // ==========================================

  const handleSaveService = async () => {
    if (!validateForm()) return;

    try {
      setSaving(true);

      const payload = {
        ...(!editingService
          ? {
              serviceId: form.serviceId.trim().toLowerCase(),
            }
          : {}),
        name: form.name.trim(),
        description: form.description.trim(),
        category: form.category,
        price: Number(form.price),
        duration: form.duration.trim(),
        image: form.image.trim(),
        rating: Number(form.rating),
      };

      if (editingService) {
        await apiRequest(
          `/services/${encodeURIComponent(editingService._id)}`,
          "PUT",
          payload
        );

        setModalVisible(false);

        Alert.alert(
          "Success",
          "Service updated successfully."
        );
      } else {
        await apiRequest("/services", "POST", payload);

        setModalVisible(false);

        Alert.alert(
          "Success",
          "New service added successfully."
        );
      }

      setEditingService(null);
      setForm({ ...EMPTY_FORM });

      await fetchServices();
    } catch (error: any) {
      Alert.alert(
        "Save Failed",
        error?.message || "Unable to save service."
      );
    } finally {
      setSaving(false);
    }
  };

  // ==========================================
  // ACTIVATE / DEACTIVATE SERVICE
  // ==========================================

  const handleToggleStatus = (service: Service) => {
    const newStatus = !service.isActive;

    Alert.alert(
      newStatus ? "Activate Service" : "Deactivate Service",
      `Are you sure you want to ${
        newStatus ? "activate" : "deactivate"
      } ${service.name}?`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Confirm",
          onPress: async () => {
            try {
              await apiRequest(
                `/services/${encodeURIComponent(service._id)}/status`,
                "PATCH",
                { isActive: newStatus }
              );

              setServices((previous) =>
                previous.map((item) =>
                  item._id === service._id
                    ? { ...item, isActive: newStatus }
                    : item
                )
              );

              Alert.alert(
                "Success",
                `Service ${
                  newStatus ? "activated" : "deactivated"
                } successfully.`
              );
            } catch (error: any) {
              Alert.alert(
                "Status Error",
                error?.message || "Unable to change status."
              );
            }
          },
        },
      ]
    );
  };

  // ==========================================
  // DELETE SERVICE
  // ==========================================

  const handleDeleteService = (service: Service) => {
    Alert.alert(
      "Delete Service",
      `Are you sure you want to delete ${service.name}? This action cannot be undone.`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await apiRequest(
                `/services/${encodeURIComponent(service._id)}`,
                "DELETE"
              );

              setServices((previous) =>
                previous.filter(
                  (item) => item._id !== service._id
                )
              );

              Alert.alert(
                "Deleted",
                "Service deleted successfully."
              );
            } catch (error: any) {
              Alert.alert(
                "Delete Failed",
                error?.message || "Unable to delete service."
              );
            }
          },
        },
      ]
    );
  };

  // ==========================================
  // FILTER SERVICES
  // ==========================================

  const searchText = search.trim().toLowerCase();

  const filteredServices = services.filter((service) => {
    const matchesSearch =
      service.name.toLowerCase().includes(searchText) ||
      service.serviceId.toLowerCase().includes(searchText) ||
      service.description.toLowerCase().includes(searchText);

    const serviceCategory = normalizeCategory(service.category);

    const matchesCategory =
      selectedCategory === "All" ||
      serviceCategory === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const activeCount = services.filter(
    (service) => service.isActive
  ).length;

  const inactiveCount = services.length - activeCount;

  // ==========================================
  // LOADING SCREEN
  // ==========================================

  if (loading) {
    return (
      <SafeAreaView
        style={styles.loadingContainer}
        edges={["top", "bottom"]}
      >
        <StatusBar
          backgroundColor={COLORS.background}
          barStyle="dark-content"
        />

        <ActivityIndicator
          size="large"
          color={COLORS.green}
        />

        <Text style={styles.loadingText}>
          Loading GlowAura Services...
        </Text>
      </SafeAreaView>
    );
  }

  // ==========================================
  // MAIN UI
  // ==========================================

  return (
    <SafeAreaView
      style={styles.container}
      edges={["top", "bottom"]}
    >
      <StatusBar
        backgroundColor={COLORS.background}
        barStyle="dark-content"
      />

      {/* HEADER */}

      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          activeOpacity={0.8}
        >
          <Text style={styles.backText}>‹</Text>
        </TouchableOpacity>

        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>
            Services Management
          </Text>

          <Text style={styles.headerSubtitle}>
            Manage your beauty services
          </Text>
        </View>

        <Text style={styles.headerIcon}>✦</Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={COLORS.green}
          />
        }
        contentContainerStyle={styles.scrollContent}
      >
        {/* STATISTICS */}

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>
              {services.length}
            </Text>

            <Text style={styles.statLabel}>
              Total Services
            </Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statNumber}>
              {activeCount}
            </Text>

            <Text style={styles.statLabel}>
              Active
            </Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statNumber}>
              {inactiveCount}
            </Text>

            <Text style={styles.statLabel}>
              Inactive
            </Text>
          </View>
        </View>

        {/* ADD SERVICE */}

        <TouchableOpacity
          style={styles.addButton}
          activeOpacity={0.8}
          onPress={openAddModal}
        >
          <Text style={styles.addButtonText}>
            + Add New Service
          </Text>
        </TouchableOpacity>

        {/* SEARCH */}

        <TextInput
          style={styles.searchInput}
          placeholder="Search services..."
          placeholderTextColor={COLORS.muted}
          value={search}
          onChangeText={setSearch}
          autoCorrect={false}
        />

        {/* CATEGORY FILTER */}

        <Text style={styles.sectionTitle}>
          Categories
        </Text>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryRow}
        >
          {CATEGORIES.map((category) => (
            <TouchableOpacity
              key={category}
              activeOpacity={0.8}
              style={[
                styles.categoryButton,
                selectedCategory === category &&
                  styles.categoryButtonActive,
              ]}
              onPress={() => setSelectedCategory(category)}
            >
              <Text
                style={[
                  styles.categoryText,
                  selectedCategory === category &&
                    styles.categoryTextActive,
                ]}
              >
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* SERVICE LIST HEADER */}

        <View style={styles.listHeader}>
          <Text style={styles.sectionTitle}>
            {selectedCategory === "All"
              ? "All Services"
              : selectedCategory}
          </Text>

          <Text style={styles.resultCount}>
            {filteredServices.length} services
          </Text>
        </View>

        {/* EMPTY STATE */}

        {filteredServices.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>✦</Text>

            <Text style={styles.emptyTitle}>
              {services.length === 0
                ? "No Services Available"
                : "No Services Found"}
            </Text>

            <Text style={styles.emptyDescription}>
              {services.length === 0
                ? "Backend database mein abhi services nahi mili hain. Add New Service se service create kar sakte ho."
                : "Is category mein services nahi mili. Search ya category change karke dekho."}
            </Text>

            <TouchableOpacity
              style={styles.emptyAddButton}
              onPress={
                services.length === 0
                  ? openAddModal
                  : () => {
                      setSearch("");
                      setSelectedCategory("All");
                    }
              }
            >
              <Text style={styles.emptyAddButtonText}>
                {services.length === 0
                  ? "+ Add Service"
                  : "Clear Filters"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.retryButton}
              onPress={onRefresh}
            >
              <Text style={styles.retryButtonText}>
                Refresh Services
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          filteredServices.map((service) => (
            <View
              key={service._id}
              style={styles.serviceCard}
            >
              <View style={styles.serviceTop}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.serviceName}>
                    {service.name}
                  </Text>

                  <Text style={styles.serviceId}>
                    ID: {service.serviceId || "Not available"}
                  </Text>
                </View>

                <View
                  style={[
                    styles.statusBadge,
                    service.isActive
                      ? styles.activeBadge
                      : styles.inactiveBadge,
                  ]}
                >
                  <Text
                    style={[
                      styles.statusText,
                      {
                        color: service.isActive
                          ? COLORS.green
                          : COLORS.red,
                      },
                    ]}
                  >
                    {service.isActive ? "ACTIVE" : "INACTIVE"}
                  </Text>
                </View>
              </View>

              <Text style={styles.serviceDescription}>
                {service.description ||
                  "No description available."}
              </Text>

              <View style={styles.serviceDetails}>
                <Text style={styles.detailText}>
                  {normalizeCategory(service.category) ||
                    service.category}
                </Text>

                <Text style={styles.detailText}>
                  ₹{service.price}
                </Text>

                <Text style={styles.detailText}>
                  {service.duration || "Duration not set"}
                </Text>
              </View>

              <View style={styles.actionRow}>
                <TouchableOpacity
                  style={styles.editButton}
                  onPress={() => openEditModal(service)}
                >
                  <Text style={styles.editButtonText}>
                    Edit
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.toggleButton}
                  onPress={() => handleToggleStatus(service)}
                >
                  <Text style={styles.toggleButtonText}>
                    {service.isActive
                      ? "Deactivate"
                      : "Activate"}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => handleDeleteService(service)}
                >
                  <Text style={styles.deleteButtonText}>
                    Delete
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </ScrollView>

      {/* ADD / EDIT MODAL */}

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        statusBarTranslucent
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : undefined}
            style={styles.modalKeyboard}
          >
            <SafeAreaView
              style={styles.modalContainer}
              edges={["bottom"]}
            >
              <ScrollView
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
              >
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>
                    {editingService
                      ? "Edit Service"
                      : "Add New Service"}
                  </Text>

                  <TouchableOpacity
                    onPress={closeModal}
                    disabled={saving}
                  >
                    <Text style={styles.closeButton}>✕</Text>
                  </TouchableOpacity>
                </View>

                {!editingService && (
                  <>
                    <Text style={styles.inputLabel}>
                      Service ID *
                    </Text>

                    <TextInput
                      style={styles.input}
                      placeholder="Example: skin-01"
                      placeholderTextColor={COLORS.muted}
                      value={form.serviceId}
                      onChangeText={(value) =>
                        updateForm("serviceId", value)
                      }
                      autoCapitalize="none"
                    />
                  </>
                )}

                <Text style={styles.inputLabel}>
                  Service Name *
                </Text>

                <TextInput
                  style={styles.input}
                  placeholder="Enter service name"
                  placeholderTextColor={COLORS.muted}
                  value={form.name}
                  onChangeText={(value) =>
                    updateForm("name", value)
                  }
                />

                <Text style={styles.inputLabel}>
                  Description *
                </Text>

                <TextInput
                  style={[
                    styles.input,
                    styles.descriptionInput,
                  ]}
                  placeholder="Enter service description"
                  placeholderTextColor={COLORS.muted}
                  multiline
                  value={form.description}
                  onChangeText={(value) =>
                    updateForm("description", value)
                  }
                />

                <Text style={styles.inputLabel}>
                  Category *
                </Text>

                <View style={styles.modalCategoryRow}>
                  {CATEGORIES.slice(1).map((category) => (
                    <TouchableOpacity
                      key={category}
                      style={[
                        styles.modalCategory,
                        form.category === category &&
                          styles.modalCategoryActive,
                      ]}
                      onPress={() =>
                        updateForm(
                          "category",
                          category as Category
                        )
                      }
                    >
                      <Text
                        style={[
                          styles.modalCategoryText,
                          form.category === category &&
                            styles.modalCategoryTextActive,
                        ]}
                      >
                        {category}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <Text style={styles.inputLabel}>
                  Price (₹) *
                </Text>

                <TextInput
                  style={styles.input}
                  placeholder="Example: 1499"
                  placeholderTextColor={COLORS.muted}
                  keyboardType="decimal-pad"
                  value={form.price}
                  onChangeText={(value) =>
                    updateForm("price", value)
                  }
                />

                <Text style={styles.inputLabel}>
                  Duration *
                </Text>

                <TextInput
                  style={styles.input}
                  placeholder="Example: 60 min"
                  placeholderTextColor={COLORS.muted}
                  value={form.duration}
                  onChangeText={(value) =>
                    updateForm("duration", value)
                  }
                />

                <Text style={styles.inputLabel}>
                  Image URL (Optional)
                </Text>

                <TextInput
                  style={styles.input}
                  placeholder="https://example.com/image.jpg"
                  placeholderTextColor={COLORS.muted}
                  value={form.image}
                  onChangeText={(value) =>
                    updateForm("image", value)
                  }
                  autoCapitalize="none"
                  autoCorrect={false}
                />

                <Text style={styles.inputLabel}>
                  Rating (0–5)
                </Text>

                <TextInput
                  style={styles.input}
                  placeholder="Example: 4.9"
                  placeholderTextColor={COLORS.muted}
                  keyboardType="decimal-pad"
                  value={form.rating}
                  onChangeText={(value) =>
                    updateForm("rating", value)
                  }
                />

                <TouchableOpacity
                  style={[
                    styles.saveButton,
                    saving && { opacity: 0.6 },
                  ]}
                  onPress={handleSaveService}
                  disabled={saving}
                >
                  {saving ? (
                    <ActivityIndicator color={COLORS.white} />
                  ) : (
                    <Text style={styles.saveButtonText}>
                      {editingService
                        ? "Update Service"
                        : "Create Service"}
                    </Text>
                  )}
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={closeModal}
                  disabled={saving}
                >
                  <Text style={styles.cancelButtonText}>
                    Cancel
                  </Text>
                </TouchableOpacity>
              </ScrollView>
            </SafeAreaView>
          </KeyboardAvoidingView>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

// ==========================================
// PREMIUM STYLES
// ==========================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  loadingContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: "center",
    alignItems: "center",
  },

  loadingText: {
    marginTop: 14,
    color: COLORS.green,
    fontSize: 15,
    fontWeight: "600",
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 18,
    backgroundColor: COLORS.background,
  },

  backButton: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: COLORS.white,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  backText: {
    color: COLORS.green,
    fontSize: 32,
    lineHeight: 36,
  },

  headerTitle: {
    color: COLORS.green,
    fontSize: 20,
    fontWeight: "800",
  },

  headerSubtitle: {
    color: COLORS.muted,
    fontSize: 12,
    marginTop: 4,
  },

  headerIcon: {
    fontSize: 27,
    color: COLORS.gold,
  },

  scrollContent: {
    paddingHorizontal: 18,
    paddingBottom: 50,
  },

  statsRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 10,
    marginBottom: 20,
  },

  statCard: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderRadius: 17,
    paddingVertical: 18,
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  statNumber: {
    fontSize: 25,
    fontWeight: "800",
    color: COLORS.green,
  },

  statLabel: {
    fontSize: 11,
    color: COLORS.muted,
    marginTop: 5,
  },

  addButton: {
    backgroundColor: COLORS.green,
    padding: 17,
    borderRadius: 15,
    alignItems: "center",
    marginBottom: 18,
  },

  addButtonText: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: "700",
  },

  searchInput: {
    height: 52,
    borderRadius: 14,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 16,
    color: COLORS.text,
    fontSize: 14,
    marginBottom: 22,
  },

  sectionTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: COLORS.green,
  },

  categoryRow: {
    gap: 9,
    paddingVertical: 14,
  },

  categoryButton: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 22,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  categoryButtonActive: {
    backgroundColor: COLORS.green,
    borderColor: COLORS.green,
  },

  categoryText: {
    color: COLORS.muted,
    fontSize: 12,
    fontWeight: "600",
  },

  categoryTextActive: {
    color: COLORS.white,
  },

  listHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 12,
    marginBottom: 13,
  },

  resultCount: {
    color: COLORS.muted,
    fontSize: 12,
  },

  serviceCard: {
    backgroundColor: COLORS.white,
    borderRadius: 18,
    padding: 16,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  serviceTop: {
    flexDirection: "row",
    alignItems: "flex-start",
  },

  serviceName: {
    fontSize: 16,
    fontWeight: "800",
    color: COLORS.green,
  },

  serviceId: {
    color: COLORS.muted,
    fontSize: 11,
    marginTop: 5,
  },

  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
  },

  activeBadge: {
    backgroundColor: COLORS.lightGreen,
  },

  inactiveBadge: {
    backgroundColor: "#FCEAEA",
  },

  statusText: {
    fontSize: 10,
    fontWeight: "800",
  },

  serviceDescription: {
    color: COLORS.muted,
    fontSize: 12,
    lineHeight: 19,
    marginTop: 13,
  },

  serviceDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 15,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: COLORS.border,
  },

  detailText: {
    fontSize: 11,
    fontWeight: "700",
    color: COLORS.green,
  },

  actionRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 14,
  },

  editButton: {
    flex: 1,
    backgroundColor: COLORS.lightGreen,
    paddingVertical: 11,
    borderRadius: 10,
    alignItems: "center",
  },

  editButtonText: {
    color: COLORS.green,
    fontWeight: "700",
    fontSize: 11,
  },

  toggleButton: {
    flex: 1,
    backgroundColor: "#F5F0E5",
    paddingVertical: 11,
    borderRadius: 10,
    alignItems: "center",
  },

  toggleButtonText: {
    color: "#80683D",
    fontWeight: "700",
    fontSize: 11,
  },

  deleteButton: {
    flex: 1,
    backgroundColor: "#FCEAEA",
    paddingVertical: 11,
    borderRadius: 10,
    alignItems: "center",
  },

  deleteButtonText: {
    color: COLORS.red,
    fontWeight: "700",
    fontSize: 11,
  },

  emptyContainer: {
    backgroundColor: COLORS.white,
    borderRadius: 18,
    padding: 30,
    alignItems: "center",
    marginTop: 10,
  },

  emptyIcon: {
    fontSize: 35,
    color: COLORS.gold,
  },

  emptyTitle: {
    color: COLORS.green,
    fontWeight: "800",
    fontSize: 17,
    marginTop: 12,
    textAlign: "center",
  },

  emptyDescription: {
    color: COLORS.muted,
    fontSize: 12,
    lineHeight: 19,
    marginTop: 7,
    textAlign: "center",
  },

  emptyAddButton: {
    backgroundColor: COLORS.green,
    paddingHorizontal: 22,
    paddingVertical: 12,
    borderRadius: 11,
    marginTop: 18,
  },

  emptyAddButtonText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: "700",
  },

  retryButton: {
    padding: 12,
    marginTop: 4,
  },

  retryButtonText: {
    color: COLORS.green,
    fontSize: 12,
    fontWeight: "700",
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.50)",
    justifyContent: "flex-end",
  },

  modalKeyboard: {
    width: "100%",
    maxHeight: "92%",
  },

  modalContainer: {
    backgroundColor: COLORS.background,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    paddingHorizontal: 20,
    paddingTop: 22,
    maxHeight: "92%",
  },

  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },

  modalTitle: {
    color: COLORS.green,
    fontSize: 21,
    fontWeight: "800",
  },

  closeButton: {
    fontSize: 22,
    color: COLORS.muted,
    padding: 5,
  },

  inputLabel: {
    color: COLORS.green,
    fontSize: 13,
    fontWeight: "700",
    marginBottom: 8,
    marginTop: 13,
  },

  input: {
    height: 50,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    color: COLORS.text,
    fontSize: 14,
  },

  descriptionInput: {
    height: 95,
    textAlignVertical: "top",
    paddingTop: 13,
  },

  modalCategoryRow: {
    gap: 8,
  },

  modalCategory: {
    padding: 12,
    borderRadius: 10,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  modalCategoryActive: {
    backgroundColor: COLORS.green,
    borderColor: COLORS.green,
  },

  modalCategoryText: {
    color: COLORS.muted,
    fontSize: 12,
    fontWeight: "600",
  },

  modalCategoryTextActive: {
    color: COLORS.white,
  },

  saveButton: {
    backgroundColor: COLORS.green,
    padding: 16,
    borderRadius: 13,
    alignItems: "center",
    marginTop: 25,
  },

  saveButtonText: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: "800",
  },

  cancelButton: {
    padding: 15,
    alignItems: "center",
    marginTop: 5,
  },

  cancelButtonText: {
    color: COLORS.muted,
    fontWeight: "700",
  },
});