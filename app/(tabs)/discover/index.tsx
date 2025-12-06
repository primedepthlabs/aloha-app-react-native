import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Modal,
  Alert,
  ActivityIndicator,
  Platform,
} from "react-native";
import { Search, Star, MoreVertical, ChevronLeft } from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { supabase } from "../../../supabaseClient";
import { getCurrentUser } from "../../../utils/authHelpers";

interface User {
  id: string;
  influencerProfileId?: string;
  name: string;
  role: string;
  image: any;
  isFavorite: boolean;
  location: string;
  about: string;
  rating: number;
  isOnline: boolean;
  gallery: string[];
  avatar_url?: string;
  isVerified?: boolean;
}

interface Notification {
  id: number;
  type: "message" | "donation" | "system" | "video";
  title: string;
  subtitle?: string;
  time: string;
  icon: string;
}

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: 1,
    type: "message",
    title: "New message from Bam",
    time: "2 hours ago",
    icon: "message",
  },
  {
    id: 2,
    type: "donation",
    title: "Donation sent successfully",
    subtitle: "Tap to view conversation",
    time: "",
    icon: "heart",
  },
  {
    id: 3,
    type: "system",
    title: "Low balance — add funds",
    time: "2 hours ago",
    icon: "settings",
  },
  {
    id: 4,
    type: "video",
    title: "Video call accepted",
    subtitle: "Tap to view conversation",
    time: "",
    icon: "video",
  },
];

const ROLES = ["All", "Influencer", "Doctor", "Youtuber", "Actor"];

export default function DiscoverScreen() {
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState<"everyone" | "favorites">(
    "everyone"
  );
  const [notificationTab, setNotificationTab] = useState<
    "all" | "messages" | "donations"
  >("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState("All");
  const [showNotificationMenu, setShowNotificationMenu] = useState<
    number | null
  >(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  // --- BLOCK USER state & helpers ---
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [blockReason, setBlockReason] = useState("");
  const [blocking, setBlocking] = useState(false);
  const [blockTarget, setBlockTarget] = useState<User | null>(null);

  // Get current user on component mount
  useEffect(() => {
    getCurrentUserId();
  }, []);

  const getCurrentUserId = async () => {
    try {
      const currentUser = await getCurrentUser();
      if (currentUser) {
        setCurrentUserId(currentUser.id);
      }
    } catch (error) {
      console.error("Error getting current user:", error);
    }
  };

  // open the block modal for a user (call from Block menu item)
  const openBlockModal = (user: User) => {
    setShowProfileMenu(false);
    setBlockTarget(user);
    setSelectedUser(null);

    setTimeout(() => {
      setShowBlockModal(true);
    }, 180);
  };

  const handleConfirmBlock = async () => {
    if (!blockTarget) {
      Alert.alert("Error", "No user selected to block.");
      return;
    }

    setBlocking(true);

    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        console.error("Supabase getUser error:", userError);
        Alert.alert("Authentication error", "Please sign in to block a user.");
        setBlocking(false);
        return;
      }

      const payload: any = {
        blocker_id: user.id,
        blocked_id: blockTarget.id,
        reason: blockReason?.trim().length > 0 ? blockReason.trim() : null,
      };

      const { error: insertError } = await supabase
        .from("blocked_users")
        .insert(payload)
        .select()
        .single();

      if (insertError) {
        console.error("Error inserting blocked_users:", insertError);
        if ((insertError as any).code === "23505") {
          Alert.alert(
            "Already blocked",
            `${blockTarget.name} is already blocked.`
          );
        } else {
          Alert.alert("Error", "Failed to block user. Please try again.");
        }
        setBlocking(false);
        return;
      }

      Alert.alert("Blocked", `${blockTarget.name} has been blocked.`);
      setShowBlockModal(false);
      setBlockTarget(null);
      setSelectedUser(null);
    } catch (err) {
      console.error("Unhandled error blocking user:", err);
      Alert.alert("Error", "An unexpected error occurred. Try again.");
    } finally {
      setBlocking(false);
    }
  };

  const isValidUUID = (s?: string) =>
    !!s &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      s || ""
    );

  // Fetch influencers from Supabase
  useEffect(() => {
    fetchInfluencers();
  }, []);

  const fetchInfluencers = async () => {
    try {
      setLoading(true);

      const currentUser = await getCurrentUser();
      if (currentUser) {
        setCurrentUserId(currentUser.id);
      }

      const { data: profiles, error } = await supabase
        .from("influencer_profiles")
        .select(
          `
        id,
        display_name,
        bio,
        profile_image_url,
        average_rating,
        is_available,
        user_id,
        users (
          id,
          full_name,
          avatar_url,
          user_type,
          is_verified,
          is_active
        )
      `
        )
        .is("users.is_active", true);

      if (error) {
        console.error("Error fetching influencer_profiles:", error);
        Alert.alert("Error", "Failed to load influencers");
        return;
      }

      const transformedUsers: User[] = (profiles || [])
        .filter((p: any) => p.user_id !== currentUser?.id)
        .map((p: any) => ({
          id: p.user_id,
          influencerProfileId: p.id,
          name: p.display_name || p.users?.full_name || "Unknown",
          role: "Influencer",
          image: p.profile_image_url
            ? { uri: p.profile_image_url }
            : require("../../../assets/images/discover.png"),
          isFavorite: false,
          location: "Unknown",
          about: p.bio || "",
          rating: p.average_rating || 4,
          isOnline: p.is_available || false,
          gallery: [
            "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400",
            "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
            "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400",
          ],
          avatar_url: p.users?.avatar_url || p.profile_image_url || undefined,
          isVerified: p.users?.is_verified ?? false,
        }));

      setUsers(transformedUsers);
    } catch (err) {
      console.error("fetchInfluencers error:", err);
      Alert.alert("Error", "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = (userId: string) => {
    setUsers((prev) => {
      const updated = prev.map((user) =>
        user.id === userId ? { ...user, isFavorite: !user.isFavorite } : user
      );

      if (selectedUser && selectedUser.id === userId) {
        const updatedSelected = updated.find((u) => u.id === userId) || null;
        setSelectedUser(updatedSelected);
      }

      return updated;
    });
  };

  const isCurrentUser = (user: User) => {
    return user.id === currentUserId;
  };

  // ✅ SIMPLIFIED: Navigate to chat using new schema
  const navigateToChat = async (user: User | null) => {
    try {
      if (!user) {
        console.warn("navigateToChat called without user");
        Alert.alert("Error", "Unable to open chat: invalid user selected.");
        return;
      }

      if (isCurrentUser(user)) {
        Alert.alert("Notice", "You cannot send messages to yourself.");
        return;
      }

      const currentUser = await getCurrentUser();
      if (!currentUser) {
        Alert.alert("Error", "Please log in to continue");
        return;
      }

      console.log("Current user ID:", currentUser.id);
      console.log("Target user ID:", user.id);

      // 🔥 SIMPLIFIED: Find conversation between two users (order doesn't matter)
      // Check both directions: (current → target) OR (target → current)
      const { data: existingConvs, error: convError } = await supabase
        .from("conversations")
        .select("id, last_message_at, created_at")
        .eq("is_active", true)
        .or(
          `and(regular_user_id.eq.${currentUser.id},regular_user_id2.eq.${user.id}),and(regular_user_id.eq.${user.id},regular_user_id2.eq.${currentUser.id})`
        )
        .order("last_message_at", { ascending: false, nullsFirst: false })
        .order("created_at", { ascending: false })
        .limit(1);

      if (convError) {
        console.error("Error checking conversations:", convError);
        Alert.alert("Error", "Could not open chat. Please try again.");
        return;
      }

      let conversationId: string;

      if (existingConvs && existingConvs.length > 0) {
        conversationId = existingConvs[0].id;
        console.log("Using existing conversation:", conversationId);
      } else {
        // Create new conversation
        const { data: newConv, error: createError } = await supabase
          .from("conversations")
          .insert({
            regular_user_id: currentUser.id,
            regular_user_id2: user.id,
            is_active: true,
          })
          .select("id")
          .single();

        if (createError) {
          console.error("Error creating conversation:", createError);

          // Handle race condition
          if (createError?.code === "23505") {
            const { data: retryConvs, error: retryError } = await supabase
              .from("conversations")
              .select("id")
              .eq("is_active", true)
              .or(
                `and(regular_user_id.eq.${currentUser.id},regular_user_id2.eq.${user.id}),and(regular_user_id.eq.${user.id},regular_user_id2.eq.${currentUser.id})`
              )
              .order("created_at", { ascending: false })
              .limit(1);

            if (retryError || !retryConvs || retryConvs.length === 0) {
              console.error(
                "Error fetching conversation after race condition:",
                retryError
              );
              Alert.alert("Error", "Failed to start conversation");
              return;
            }

            conversationId = retryConvs[0].id;
            console.log(
              "Found conversation after race condition:",
              conversationId
            );
          } else {
            Alert.alert("Error", "Failed to start conversation");
            return;
          }
        } else if (newConv) {
          conversationId = newConv.id;
          console.log("Created new conversation:", conversationId);
        } else {
          Alert.alert("Error", "Failed to start conversation");
          return;
        }
      }

      // Navigate to Chat
      router.push({
        pathname: "/(tabs)/chats/chat",
        params: {
          conversationId,
          name: user.name,
          image:
            user.avatar_url && typeof user.avatar_url === "string"
              ? user.avatar_url
              : "",
          isOnline: user.isOnline ? "true" : "false",
          isVerified: user.isVerified ? "true" : "false",
        },
      });
    } catch (err) {
      console.error("Error opening chat:", err);
      Alert.alert("Error", "Something went wrong. Please try again.");
    }
  };

  const navigateToReport = (user: User | null) => {
    console.log("Report pressed, closing menu and navigating to /report", {
      userId: user?.id,
    });

    // Close the profile menu first
    setShowProfileMenu(false);

    // Close the profile detail modal
    setSelectedUser(null);

    // Add a small delay to ensure modal is closed before navigation
    setTimeout(() => {
      if (!user || !user.id) {
        Alert.alert("Error", "Unable to report: missing user id.");
        return;
      }

      if (isCurrentUser(user)) {
        Alert.alert("Notice", "You cannot report yourself.");
        return;
      }

      // Navigate to report screen
      router.push({
        pathname: "/(tabs)/discover/report",
        params: {
          reportedUserId: user.id,
          name: user.name ?? "",
          image:
            user.avatar_url ??
            (user.image && typeof user.image === "string" ? user.image : ""),
          influencerProfileId: user.influencerProfileId ?? "",
        },
      });
    }, 350); // Wait for modal animation to complete
  };

  const applyFilter = () => {
    setShowFilterModal(false);
  };

  const filteredUsers = users.filter((user) => {
    if (selectedTab === "favorites" && !user.isFavorite) {
      return false;
    }

    if (selectedRole !== "All" && user.role !== selectedRole) {
      return false;
    }

    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      const matchesName = user.name.toLowerCase().includes(query);
      const matchesRole = user.role.toLowerCase().includes(query);
      return matchesName || matchesRole;
    }

    return true;
  });

  const filteredNotifications =
    notificationTab === "all"
      ? MOCK_NOTIFICATIONS
      : notificationTab === "messages"
      ? MOCK_NOTIFICATIONS.filter((n) => n.type === "message")
      : MOCK_NOTIFICATIONS.filter((n) => n.type === "donation");

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "message":
        return (
          <View className="w-12 h-12 bg-[#19191B] rounded-2xl items-center justify-center">
            <Image
              source={require("../../../assets/images/mess-notification.png")}
              style={{ width: 24, height: 24 }}
              resizeMode="contain"
            />
          </View>
        );
      case "donation":
        return (
          <View className="w-12 h-12 bg-[#19191B] rounded-2xl items-center justify-center">
            <Image
              source={require("../../../assets/images/heart-notification.png")}
              style={{ width: 24, height: 24 }}
              resizeMode="contain"
            />
          </View>
        );
      case "system":
        return (
          <View className="w-12 h-12 bg-[#19191B] rounded-2xl items-center justify-center">
            <Image
              source={require("../../../assets/images/settings-notification.png")}
              style={{ width: 24, height: 24 }}
              resizeMode="contain"
            />
          </View>
        );
      case "video":
        return (
          <View className="w-12 h-12 bg-[#19191B] rounded-2xl items-center justify-center">
            <Image
              source={require("../../../assets/images/videocall-notification.png")}
              style={{ width: 24, height: 24 }}
              resizeMode="contain"
            />
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <View className="flex-1 bg-black">
      {/* Header */}
      <View className="pt-14 pb-4 px-6">
        <View className="flex-row items-center justify-between mb-6">
          <View style={{ width: 28 }} />

          <Text className="text-white font-bold text-[18px] text-center flex-1">
            Discover
          </Text>

          <TouchableOpacity onPress={() => setShowNotificationModal(true)}>
            <Image
              source={require("../../../assets/images/bell-notification.png")}
              style={{ width: 24, height: 28 }}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>

        {/* Search Bar and Filter */}
        <View className="flex-row items-center gap-[12px] mb-6">
          <View className="flex-1 h-[40px] flex-row items-center bg-black border border-[#3C3C3E] rounded-xl px-3">
            <Search size={20} color="#fff" style={{ width: 20, height: 20 }} />
            <TextInput
              className="flex-1 text-white text-[15px] ml-2"
              placeholder="Search"
              placeholderTextColor="#8E8E93"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          <TouchableOpacity
            onPress={() => setShowFilterModal(true)}
            className="w-[40px] h-[40px] items-center justify-center"
          >
            <Image
              source={require("../../../assets/images/filter-icon.png")}
              style={{ width: 24, height: 24 }}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>

        {/* Tabs */}
        <View className="flex-row bg-[#1C1C1E] rounded-[11.63px] p-[3.88px]">
          <TouchableOpacity
            onPress={() => setSelectedTab("everyone")}
            activeOpacity={0.9}
            className={`flex-1 items-center justify-center rounded-[11.63px] h-[32px] ${
              selectedTab === "everyone" ? "bg-[#FCCD34]" : "bg-transparent"
            }`}
          >
            <Text
              className={`text-[16px] ${
                selectedTab === "everyone" ? "text-[#13131B]" : "text-[#8E8E93]"
              }`}
            >
              Everyone
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setSelectedTab("favorites")}
            activeOpacity={0.9}
            className={`flex-1 items-center justify-center rounded-[11.63px] h-[32px] ${
              selectedTab === "favorites" ? "bg-[#FCCD34]" : "bg-transparent"
            }`}
          >
            <Text
              className={`text-[16px] ${
                selectedTab === "favorites" ? "text-black" : "text-[#8E8E93]"
              }`}
            >
              Favorites
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* User Grid */}
      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#FCCD34" />
          <Text className="text-white mt-4">Loading influencers...</Text>
        </View>
      ) : filteredUsers.length === 0 ? (
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-white text-lg text-center">
            {selectedTab === "favorites"
              ? "No favorites yet"
              : "No influencers found"}
          </Text>
          <Text className="text-[#8E8E93] text-center mt-2">
            {selectedTab === "favorites"
              ? "Add influencers to favorites to see them here"
              : "Try adjusting your search or filters"}
          </Text>
        </View>
      ) : (
        <ScrollView
          className="flex-1 px-6"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 24 }}
        >
          <View className="flex-row flex-wrap justify-between pb-24">
            {filteredUsers.map((user) => {
              const isSelf = isCurrentUser(user);

              return (
                <TouchableOpacity
                  key={user.id}
                  className="w-[48%] mb-4"
                  onPress={() => setSelectedUser(user)}
                >
                  <View
                    className="relative rounded-3xl overflow-hidden"
                    style={{ height: 260 }}
                  >
                    <Image
                      source={user.image}
                      className="w-full h-full"
                      resizeMode="cover"
                    />

                    {isSelf && (
                      <View
                        style={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          backgroundColor: "rgba(0, 0, 0, 0.6)",
                          justifyContent: "center",
                          alignItems: "center",
                          zIndex: 5,
                        }}
                      >
                        <Text
                          style={{
                            color: "#FFFFFF",
                            fontSize: 18,
                            fontWeight: "bold",
                            textAlign: "center",
                          }}
                        >
                          You
                        </Text>
                      </View>
                    )}

                    <LinearGradient
                      colors={["rgba(0,0,0,0.9)", "transparent"]}
                      start={{ x: 0.5, y: 1 }}
                      end={{ x: 0.5, y: 0 }}
                      style={{
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        right: 0,
                        height: "60%",
                      }}
                    />

                    <TouchableOpacity
                      className="absolute top-4 right-4 z-10"
                      onPress={() => toggleFavorite(user.id)}
                    >
                      <Star
                        size={26}
                        color={user.isFavorite ? "#FCCD34" : "#fff"}
                        fill={user.isFavorite ? "#FCCD34" : "transparent"}
                        strokeWidth={2}
                      />
                    </TouchableOpacity>

                    <View
                      style={{
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        right: 0,
                        alignItems: "center",
                        paddingBottom: 16,
                      }}
                    >
                      <Text
                        style={{
                          color: "#fff",
                          fontSize: 20,
                          fontWeight: "600",
                          marginBottom: 2,
                        }}
                      >
                        {user.name}
                      </Text>

                      <Text
                        style={{
                          color: "#E5E5E5",
                          fontSize: 14,
                          marginBottom: 8,
                        }}
                      >
                        {user.role}
                      </Text>

                      {!isSelf && (
                        <TouchableOpacity
                          activeOpacity={0.8}
                          onPress={() => navigateToChat(user)}
                          style={{
                            backgroundColor: "#FCCD34",
                            borderRadius: 5,
                            paddingVertical: 4,
                            paddingHorizontal: 8,
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "center",
                            minWidth: 60,
                          }}
                        >
                          <Text
                            style={{
                              color: "black",
                              fontWeight: "500",
                              fontSize: 11,
                            }}
                          >
                            Message
                          </Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>
      )}

      {/* Filter Modal */}
      <Modal
        visible={showFilterModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowFilterModal(false)}
      >
        <View className="flex-1 justify-end">
          <TouchableOpacity
            className="flex-1 bg-black/50"
            activeOpacity={1}
            onPress={() => setShowFilterModal(false)}
          />
          <View className="bg-[#1C1C1E] rounded-t-3xl pt-2 pb-8">
            <View className="items-center py-3">
              <View className="w-10 h-1 bg-white/30 rounded-full" />
            </View>

            <ScrollView
              className="px-6"
              style={{ maxHeight: 500 }}
              showsVerticalScrollIndicator={false}
            >
              {ROLES.map((role, index) => (
                <TouchableOpacity
                  key={index}
                  className="flex-row items-center justify-between px-6 py-5"
                  onPress={() => setSelectedRole(role)}
                >
                  <Text
                    className={`text-lg ${
                      selectedRole === role ? "text-[#FCCD34]" : "text-white"
                    }`}
                  >
                    {role}
                  </Text>
                  <View
                    className={`w-6 h-6 rounded-full ${
                      selectedRole === role
                        ? "bg-[#FCCD34]"
                        : "border-2 border-gray-500"
                    } items-center justify-center`}
                  >
                    {selectedRole === role && (
                      <View className="w-3 h-3 rounded-full bg-black" />
                    )}
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Notification Modal */}
      <Modal
        visible={showNotificationModal}
        animationType="slide"
        presentationStyle={Platform.OS === "ios" ? "fullScreen" : undefined}
        onRequestClose={() => setShowNotificationModal(false)}
      >
        <View className="flex-1 bg-black">
          <View className="pt-12 pb-4 px-6">
            <View className="flex-row items-center justify-between mb-6">
              <TouchableOpacity onPress={() => setShowNotificationModal(false)}>
                <ChevronLeft size={28} color="#fff" />
              </TouchableOpacity>
              <Text className="text-white text-2xl font-bold">
                Notifications
              </Text>
              <View style={{ width: 28 }} />
            </View>

            <View className="flex-row items-center px-4 py-3 bg-black">
              <TouchableOpacity
                onPress={() => setNotificationTab("all")}
                className="items-center mr-6"
              >
                <View className="flex-row items-center pb-2">
                  <Image
                    source={require("../../../assets/images/bell-notification.png")}
                    style={{ width: 18, height: 18, marginRight: 6 }}
                    resizeMode="contain"
                  />
                  <Text
                    className={`font-semibold text-base ${
                      notificationTab === "all"
                        ? "text-white"
                        : "text-[#8E8E93]"
                    }`}
                  >
                    All
                  </Text>
                </View>
                {notificationTab === "all" && (
                  <View className="h-0.5 w-full bg-white absolute bottom-0" />
                )}
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setNotificationTab("messages")}
                className="items-center mr-6"
              >
                <View className="flex-row items-center pb-2">
                  <Image
                    source={require("../../../assets/images/white-message.png")}
                    style={{ width: 18, height: 18, marginRight: 6 }}
                    resizeMode="contain"
                  />
                  <Text
                    className={`font-semibold text-base ${
                      notificationTab === "messages"
                        ? "text-white"
                        : "text-[#8E8E93]"
                    }`}
                  >
                    Messages
                  </Text>
                </View>
                {notificationTab === "messages" && (
                  <View className="h-0.5 w-full bg-white absolute bottom-0" />
                )}
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setNotificationTab("donations")}
                className="items-center"
              >
                <View className="flex-row items-center pb-2">
                  <Image
                    source={require("../../../assets/images/heart-notification.png")}
                    style={{ width: 18, height: 18, marginRight: 6 }}
                    resizeMode="contain"
                  />
                  <Text
                    className={`font-semibold text-base ${
                      notificationTab === "donations"
                        ? "text-white"
                        : "text-[#8E8E93]"
                    }`}
                  >
                    Donations
                  </Text>
                </View>
                {notificationTab === "donations" && (
                  <View className="h-0.5 w-full bg-white absolute bottom-0" />
                )}
              </TouchableOpacity>
            </View>
          </View>

          <ScrollView
            className="flex-1 px-6"
            showsVerticalScrollIndicator={false}
          >
            {filteredNotifications.map((notification) => (
              <View key={notification.id} className="mb-4">
                <View className="flex-row items-center">
                  {getNotificationIcon(notification.type)}
                  <View className="flex-1 ml-3">
                    <Text
                      className={`text-base font-semibold ${
                        notification.type === "message"
                          ? "text-[#FCCD34]"
                          : "text-white"
                      }`}
                    >
                      {notification.title}
                    </Text>
                    {notification.subtitle && (
                      <Text className="text-[#8E8E93] text-sm mt-0.5">
                        {notification.subtitle}
                      </Text>
                    )}
                    {notification.time && (
                      <Text className="text-[#8E8E93] text-sm mt-0.5">
                        {notification.time}
                      </Text>
                    )}
                  </View>
                  <TouchableOpacity
                    onPress={() =>
                      setShowNotificationMenu(
                        showNotificationMenu === notification.id
                          ? null
                          : notification.id
                      )
                    }
                  >
                    <MoreVertical size={20} color="#8E8E93" />
                  </TouchableOpacity>
                </View>

                {showNotificationMenu === notification.id && (
                  <View className="mt-2 bg-[#2C2C2E] rounded-xl overflow-hidden">
                    <TouchableOpacity className="flex-row items-center px-4 py-3 border-b border-[#3C3C3E]">
                      <Image
                        source={require("../../../assets/images/notification-off.png")}
                        style={{ width: 20, height: 20, marginRight: 10 }}
                        resizeMode="contain"
                      />
                      <Text className="text-white font-medium">
                        Turn off notifications
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity className="flex-row items-center px-4 py-3">
                      <Image
                        source={require("../../../assets/images/delete-notification.png")}
                        style={{ width: 20, height: 20, marginRight: 10 }}
                        resizeMode="contain"
                      />
                      <Text className="text-red-500 font-medium">Delete</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            ))}
          </ScrollView>
        </View>
      </Modal>

      {/* Profile Detail Modal */}
      <Modal
        visible={selectedUser !== null}
        animationType="slide"
        presentationStyle={Platform.OS === "ios" ? "pageSheet" : undefined}
        onRequestClose={() => {
          setSelectedUser(null);
          setShowProfileMenu(false);
        }}
      >
        {selectedUser && (
          <View className="flex-1 bg-black">
            <ScrollView showsVerticalScrollIndicator={false}>
              <View className="relative" style={{ height: 600 }}>
                <Image
                  source={selectedUser.image}
                  className="w-full h-full"
                  resizeMode="cover"
                />

                <TouchableOpacity
                  className="absolute top-12 left-6 w-10 h-10 bg-black/50 rounded-full items-center justify-center"
                  onPress={() => {
                    setSelectedUser(null);
                    setShowProfileMenu(false);
                  }}
                >
                  <ChevronLeft size={24} color="#fff" />
                </TouchableOpacity>

                <View className="absolute top-3 left-0 right-0 items-center">
                  <View className="w-10 h-1 bg-white/30 rounded-full" />
                </View>

                <TouchableOpacity
                  className="absolute top-12 right-6"
                  onPress={() => setShowProfileMenu(!showProfileMenu)}
                >
                  <MoreVertical size={24} color="#fff" />
                </TouchableOpacity>

                {showProfileMenu && (
                  <View
                    className="absolute rounded-xl overflow-hidden"
                    style={{
                      position: "absolute",
                      top: 56,
                      right: 16,
                      width: 160,
                      backgroundColor: "#19191B",
                      borderRadius: 12,
                      paddingVertical: 6,
                      elevation: 6,
                      shadowColor: "#000",
                      shadowOffset: { width: 0, height: 6 },
                      shadowOpacity: 0.25,
                      shadowRadius: 12,
                    }}
                  >
                    <TouchableOpacity
                      className="flex-row items-center px-3"
                      style={{
                        height: 44,
                      }}
                      onPress={() => navigateToReport(selectedUser)}
                      activeOpacity={0.8}
                    >
                      <Image
                        source={require("../../../assets/images/flag.png")}
                        style={{ width: 16, height: 16, marginRight: 12 }}
                        resizeMode="contain"
                      />
                      <Text className="text-white font-medium">Report</Text>
                    </TouchableOpacity>

                    <View
                      style={{
                        height: 1,
                        backgroundColor: "#29292C",
                        marginHorizontal: 8,
                      }}
                    />

                    <TouchableOpacity
                      className="flex-row items-center px-3"
                      style={{
                        height: 44,
                      }}
                      onPress={() => openBlockModal(selectedUser)}
                      activeOpacity={0.8}
                    >
                      <Image
                        source={require("../../../assets/images/cross.png")}
                        style={{ width: 16, height: 16, marginRight: 12 }}
                        resizeMode="contain"
                      />
                      <Text className="text-red-500 font-medium">Block</Text>
                    </TouchableOpacity>
                  </View>
                )}

                <View
                  className="absolute bottom-0 left-0 right-0 rounded-t-3xl"
                  style={{
                    backgroundColor: "rgba(25, 25, 27, 0.85)",
                    paddingTop: 24,
                    paddingHorizontal: 24,
                    paddingBottom: 24,
                  }}
                >
                  <View className="flex-row items-center justify-between mb-4">
                    <View className="flex-row items-center">
                      <Text className="text-white text-2xl font-bold mr-2">
                        {selectedUser.name}
                      </Text>
                      {selectedUser.isVerified && (
                        <Image
                          source={require("../../../assets/images/verified-badge.png")}
                          style={{ width: 20, height: 20 }}
                          resizeMode="contain"
                        />
                      )}
                    </View>
                    <TouchableOpacity
                      className="w-12 h-12 bg-[#2C2C2E] rounded-full items-center justify-center"
                      onPress={() => toggleFavorite(selectedUser.id)}
                    >
                      <Star
                        size={24}
                        color={selectedUser.isFavorite ? "#FCCD34" : "#fff"}
                        fill={
                          selectedUser.isFavorite ? "#FCCD34" : "transparent"
                        }
                      />
                    </TouchableOpacity>
                  </View>

                  <View className="flex-row items-center mb-5">
                    <Text className="text-[#FCCD34] text-base font-semibold mr-2">
                      {selectedUser.role}
                    </Text>
                  </View>

                  <View className="mb-0">
                    {/* Hide message button for current user in profile modal */}
                    {!isCurrentUser(selectedUser) && (
                      <TouchableOpacity
                        className="bg-[#FCCD34] rounded-xl py-4 items-center justify-center mb-3"
                        onPress={() => {
                          setSelectedUser(null);
                          navigateToChat(selectedUser);
                        }}
                      >
                        <View className="flex-row items-center">
                          <Image
                            source={require("../../../assets/images/message.png")}
                            style={{ width: 20, height: 20 }}
                            resizeMode="contain"
                          />
                          <Text className="text-black text-base font-bold ml-2">
                            Message
                          </Text>
                        </View>
                      </TouchableOpacity>
                    )}

                    {/* Hide donation button for current user in profile modal */}
                    {!isCurrentUser(selectedUser) && (
                      <TouchableOpacity
                        className="bg-transparent border-2 border-[#FCCD34] rounded-xl py-4 items-center justify-center"
                        onPress={() => {
                          setSelectedUser(null);
                          router.push("/(tabs)/discover/donation");
                        }}
                      >
                        <View className="flex-row items-center">
                          <Image
                            source={require("../../../assets/images/yellow-heart.png")}
                            style={{ width: 20, height: 20, marginRight: 8 }}
                            resizeMode="contain"
                          />
                          <Text className="text-[#FCCD34] text-base font-bold">
                            Donation
                          </Text>
                        </View>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              </View>

              <View className="px-6 py-4 bg-black">
                <View className="mb-6">
                  <Text className="text-white text-lg font-bold mb-2">
                    About
                  </Text>
                  <Text className="text-[#8E8E93] mb-2 leading-6">
                    {selectedUser.about}
                  </Text>
                  <TouchableOpacity>
                    <Text className="text-[#6E6E73]">Read more...</Text>
                  </TouchableOpacity>
                </View>

                <View className="mb-6">
                  <View className="flex-row items-center justify-between mb-3">
                    <Text className="text-white text-lg font-bold">
                      Gallery
                    </Text>
                    <TouchableOpacity>
                      <Text className="text-[#FCCD34] font-semibold">
                        See all
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    className="flex-row"
                  >
                    {selectedUser.gallery.map((img, index) => (
                      <Image
                        key={index}
                        source={{ uri: img }}
                        className="w-32 h-48 rounded-2xl mr-3"
                        resizeMode="cover"
                      />
                    ))}
                  </ScrollView>
                </View>
              </View>
            </ScrollView>
          </View>
        )}
      </Modal>

      {/* Block Confirmation Modal */}
      <Modal
        visible={showBlockModal}
        animationType="fade"
        transparent={true}
        onRequestClose={() => {
          setShowBlockModal(false);
          setBlockTarget(null);
        }}
      >
        <View className="flex-1 items-center justify-center bg-black/60 px-6">
          <View
            style={{
              width: "100%",
              backgroundColor: "#0B0B0B",
              borderRadius: 16,
              paddingVertical: 20,
              paddingHorizontal: 18,
            }}
          >
            {/* Title */}
            <Text
              style={{
                color: "#fff",
                fontSize: 18,
                fontWeight: "600",
                textAlign: "center",
                marginBottom: 12,
              }}
            >
              {`Are you sure you want to\nBlock ${blockTarget?.name || ""}?`}
            </Text>

            {/* Reason label */}
            <Text
              style={{
                color: "#E5E5E5",
                fontSize: 14,
                marginBottom: 8,
              }}
            >
              Reason (optional)
            </Text>

            {/* Reason input */}
            <View
              style={{
                backgroundColor: "#19191B",
                borderColor: "#3C3C3E",
                borderWidth: 1,
                borderRadius: 12,
                paddingHorizontal: 12,
                paddingVertical: 8,
                marginBottom: 16,
              }}
            >
              <TextInput
                placeholder="Tell us why (helps moderation)"
                placeholderTextColor="#6E6E73"
                value={blockReason}
                onChangeText={setBlockReason}
                multiline
                style={{
                  color: "#fff",
                  fontSize: 15,
                  minHeight: 40,
                }}
              />
            </View>

            {/* Buttons */}
            <View style={{ flexDirection: "row", gap: 12 }}>
              <TouchableOpacity
                onPress={() => {
                  setShowBlockModal(false);
                  setBlockTarget(null);
                }}
                style={{
                  flex: 1,
                  backgroundColor: "transparent",
                  borderRadius: 12,
                  paddingVertical: 12,
                  borderWidth: 1,
                  borderColor: "rgba(255,255,255,0.06)",
                  alignItems: "center",
                }}
                activeOpacity={0.8}
              >
                <Text style={{ color: "#fff", fontSize: 16 }}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleConfirmBlock}
                disabled={blocking}
                style={{
                  flex: 1,
                  backgroundColor: "#FF3B30",
                  borderRadius: 12,
                  paddingVertical: 12,
                  alignItems: "center",
                }}
                activeOpacity={0.8}
              >
                {blocking ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text
                    style={{ color: "#fff", fontSize: 16, fontWeight: "600" }}
                  >
                    Block
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
