import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Modal,
  Alert,
} from "react-native";
import {
  Search,
  Star,
  MessageCircle,
  MoreVertical,
  ChevronLeft,
} from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter, Link } from "expo-router";

interface User {
  id: number;
  name: string;
  role: string;
  image: any;
  isFavorite: boolean;
  location: string;
  about: string;
  rating: number;
  isOnline: boolean;
  gallery: string[];
}

interface Notification {
  id: number;
  type: "message" | "donation" | "system" | "video";
  title: string;
  subtitle?: string;
  time: string;
  icon: string;
}

const MOCK_USERS: User[] = [
  {
    id: 1,
    name: "Bam Margera",
    role: "Actor",
    image: require("../../assets/images/discover.png"),
    isFavorite: false,
    location: "Chicago, IL United States",
    about:
      "Gorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis. Class aptent taciti sociosqu ad litora to ...",
    rating: 4,
    isOnline: true,
    gallery: [
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400",
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400",
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400",
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
    ],
  },
  {
    id: 2,
    name: "Sarah Johnson",
    role: "Influencer",
    image: require("../../assets/images/discover.png"),
    isFavorite: true,
    location: "Los Angeles, CA United States",
    about:
      "Gorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis.",
    rating: 5,
    isOnline: true,
    gallery: [
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400",
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
    ],
  },
  {
    id: 3,
    name: "Mike Chen",
    role: "Doctor",
    image: require("../../assets/images/discover.png"),
    isFavorite: false,
    location: "New York, NY United States",
    about:
      "Gorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis.",
    rating: 4,
    isOnline: false,
    gallery: [
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400",
    ],
  },
  {
    id: 4,
    name: "Emma Stone",
    role: "Youtuber",
    image: require("../../assets/images/discover.png"),
    isFavorite: false,
    location: "Miami, FL United States",
    about:
      "Gorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis.",
    rating: 4,
    isOnline: true,
    gallery: [
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400",
    ],
  },
];

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
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState("All");
  const [showNotificationMenu, setShowNotificationMenu] = useState<
    number | null
  >(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const toggleFavorite = (userId: number) => {
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

  const navigateToChat = (user: User) => {
    router.push({
      pathname: "/chatScreen",
      params: {
        name: user.name,
        image:
          "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100",
        isOnline: user.isOnline.toString(),
      },
    });
  };

  const navigateToReport = () => {
    console.log("Report pressed, closing menu and navigating to /report");
    setShowProfileMenu(false);
    setSelectedUser(null); // Close the profile modal too
    router.push("/(tabs)/report");
  };

  const applyFilter = () => {
    setShowFilterModal(false);
  };

  // Filter users based on selected tab, role, and search query
  const filteredUsers = users.filter((user) => {
    // Filter by favorites tab
    if (selectedTab === "favorites" && !user.isFavorite) {
      return false;
    }

    // Filter by selected role
    if (selectedRole !== "All" && user.role !== selectedRole) {
      return false;
    }

    // Filter by search query
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
              source={require("../../assets/images/mess-notification.png")}
              style={{ width: 24, height: 24 }}
              resizeMode="contain"
            />
          </View>
        );
      case "donation":
        return (
          <View className="w-12 h-12 bg-[#19191B] rounded-2xl items-center justify-center">
            <Image
              source={require("../../assets/images/heart-notification.png")}
              style={{ width: 24, height: 24 }}
              resizeMode="contain"
            />
          </View>
        );
      case "system":
        return (
          <View className="w-12 h-12 bg-[#19191B] rounded-2xl items-center justify-center">
            <Image
              source={require("../../assets/images/settings-notification.png")}
              style={{ width: 24, height: 24 }}
              resizeMode="contain"
            />
          </View>
        );
      case "video":
        return (
          <View className="w-12 h-12 bg-[#19191B] rounded-2xl items-center justify-center">
            <Image
              source={require("../../assets/images/videocall-notification.png")}
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
      <View className="pt-12 pb-4 px-6">
        <View className="flex-row items-center justify-between mb-6">
          <TouchableOpacity>
            <ChevronLeft size={28} color="#fff" />
          </TouchableOpacity>
          <Text className="text-white font-bold text-[18px]">Discover</Text>
          <TouchableOpacity onPress={() => setShowNotificationModal(true)}>
            <Image
              source={require("../../assets/images/bell-notification.png")}
              style={{ width: 24, height: 28 }}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>

        {/* Search Bar and Filter */}
        <View className="flex-row items-center gap-[12px] mb-6">
          {/* Search Bar */}
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

          {/* Filter Button */}
          <TouchableOpacity
            onPress={() => setShowFilterModal(true)}
            className="w-[40px] h-[40px] items-center justify-center"
          >
            <Image
              source={require("../../assets/images/filter-icon.png")}
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
      <ScrollView
        className="flex-1 px-6"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24 }}
      >
        <View className="flex-row flex-wrap justify-between pb-24">
          {filteredUsers.map((user) => (
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

                {/* Gradient Overlay */}
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

                {/* Favorite Star */}
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

                {/* User Info */}
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
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

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
            {/* Handle Bar */}
            <View className="items-center py-3">
              <View className="w-10 h-1 bg-white/30 rounded-full" />
            </View>

            {/* Role List */}
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

            {/* Apply Button */}
          </View>
        </View>
      </Modal>

      {/* Notification Modal */}
      <Modal
        visible={showNotificationModal}
        animationType="slide"
        presentationStyle="fullScreen"
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

            {/* Notification Tabs */}
            <View className="flex-row items-center px-4 py-3 bg-black">
              <TouchableOpacity
                onPress={() => setNotificationTab("all")}
                className="items-center mr-6"
              >
                <View className="flex-row items-center pb-2">
                  <Image
                    source={require("../../assets/images/bell-notification.png")}
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
                    source={require("../../assets/images/white-message.png")}
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
                    source={require("../../assets/images/heart-notification.png")}
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

          {/* Notifications List */}
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

                {/* Notification Menu */}
                {showNotificationMenu === notification.id && (
                  <View className="mt-2 bg-[#2C2C2E] rounded-xl overflow-hidden">
                    <TouchableOpacity className="flex-row items-center px-4 py-3 border-b border-[#3C3C3E]">
                      <Image
                        source={require("../../assets/images/notification-off.png")}
                        style={{ width: 20, height: 20, marginRight: 10 }}
                        resizeMode="contain"
                      />
                      <Text className="text-white font-medium">
                        Turn off notifications
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity className="flex-row items-center px-4 py-3">
                      <Image
                        source={require("../../assets/images/delete-notification.png")}
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
        presentationStyle="pageSheet"
        onRequestClose={() => setSelectedUser(null)}
      >
        {selectedUser && (
          <View className="flex-1 bg-black">
            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Profile Image */}
              <View className="relative" style={{ height: 600 }}>
                <Image
                  source={selectedUser.image}
                  className="w-full h-full"
                  resizeMode="cover"
                />

                {/* Back Button */}
                <TouchableOpacity
                  className="absolute top-12 left-6 w-10 h-10 bg-black/50 rounded-full items-center justify-center"
                  onPress={() => {
                    setSelectedUser(null);
                    setShowProfileMenu(false);
                  }}
                >
                  <ChevronLeft size={24} color="#fff" />
                </TouchableOpacity>

                {/* Handle Bar */}
                <View className="absolute top-3 left-0 right-0 items-center">
                  <View className="w-10 h-1 bg-white/30 rounded-full" />
                </View>

                {/* More Options */}
                <TouchableOpacity
                  className="absolute top-12 right-6"
                  onPress={() => setShowProfileMenu(!showProfileMenu)}
                >
                  <MoreVertical size={24} color="#fff" />
                </TouchableOpacity>

                {/* Profile Menu Dropdown */}
                {showProfileMenu && (
                  <View
                    className="absolute rounded-xl overflow-hidden"
                    style={{
                      width: 333,
                      height: 179,
                      top: 211,
                      left: 22,
                      backgroundColor: "#19191B",
                      opacity: 1,
                    }}
                  >
                    {/* Report Button */}
                    <TouchableOpacity
                      className="flex-row items-center px-4"
                      style={{
                        width: 333,
                        height: 48,
                        borderTopWidth: 0.3,
                        borderTopColor: "#29292C",
                        backgroundColor: "#19191B",
                      }}
                      onPress={navigateToReport}
                      activeOpacity={0.8}
                    >
                      <Image
                        source={require("../../assets/images/flag.png")}
                        className="w-5 h-5 mr-2.5"
                        resizeMode="contain"
                      />
                      <Text className="text-white font-medium">Report</Text>
                    </TouchableOpacity>

                    {/* Block Button */}
                    <TouchableOpacity
                      className="flex-row items-center px-4"
                      style={{
                        width: 333,
                        height: 48,
                        borderTopWidth: 0.3,
                        borderTopColor: "#29292C",
                        backgroundColor: "#19191B",
                      }}
                      onPress={() => {
                        setShowProfileMenu(false);
                        Alert.alert(
                          "Block user",
                          "Are you sure you want to block this user?",
                          [
                            { text: "Cancel", style: "cancel" },
                            {
                              text: "Block",
                              style: "destructive",
                              onPress: () => console.log("User blocked"),
                            },
                          ]
                        );
                      }}
                    >
                      <Image
                        source={require("../../assets/images/cross.png")}
                        className="w-5 h-5 mr-2.5"
                        resizeMode="contain"
                      />
                      <Text className="text-red-500 font-medium">Block</Text>
                    </TouchableOpacity>
                  </View>
                )}

                {/* Profile Info Card - Overlapping */}
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
                      <Image
                        source={require("../../assets/images/verified-badge.png")}
                        style={{ width: 20, height: 20 }}
                        resizeMode="contain"
                      />
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

                  {/* Action Buttons */}
                  <View className="mb-0">
                    <TouchableOpacity
                      className="bg-[#FCCD34] rounded-xl py-4 items-center justify-center mb-3"
                      onPress={() => {
                        setSelectedUser(null);
                        navigateToChat(selectedUser);
                      }}
                    >
                      <View className="flex-row items-center">
                        <Image
                          source={require("../../assets/images/message.png")}
                          style={{ width: 20, height: 20 }}
                          resizeMode="contain"
                        />
                        <Text className="text-black text-base font-bold ml-2">
                          Message
                        </Text>
                      </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                      className="bg-transparent border-2 border-[#FCCD34] rounded-xl py-4 items-center justify-center"
                      onPress={() => {
                        setSelectedUser(null);
                        router.push("/donation");
                      }}
                    >
                      <View className="flex-row items-center">
                        <Image
                          source={require("../../assets/images/yellow-heart.png")}
                          style={{ width: 20, height: 20, marginRight: 8 }}
                          resizeMode="contain"
                        />
                        <Text className="text-[#FCCD34] text-base font-bold">
                          Donation
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>

              {/* About Section - Below the card */}
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

                {/* Gallery */}
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
    </View>
  );
}
