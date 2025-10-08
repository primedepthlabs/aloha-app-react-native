import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Modal,
} from "react-native";
import {
  Search,
  Star,
  MessageCircle,
  MoreVertical,
  ChevronLeft,
} from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";

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
    name: "Bam Margera",
    role: "Actor",
    image: require("../../assets/images/discover.png"),
    isFavorite: true,
    location: "Chicago, IL United States",
    about:
      "Gorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis.",
    rating: 4,
    isOnline: true,
    gallery: [
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400",
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
    ],
  },
  {
    id: 3,
    name: "Bam Margera",
    role: "Actor",
    image: require("../../assets/images/discover.png"),
    isFavorite: false,
    location: "Chicago, IL United States",
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
    name: "Bam Margera",
    role: "Actor",
    image: require("../../assets/images/discover.png"),
    isFavorite: false,
    location: "Chicago, IL United States",
    about:
      "Gorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis.",
    rating: 4,
    isOnline: true,
    gallery: [
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400",
    ],
  },
];

export default function DiscoverScreen() {
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState<"everyone" | "favorites">(
    "everyone"
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(MOCK_USERS);

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

  const filteredUsers =
    selectedTab === "favorites" ? users.filter((u) => u.isFavorite) : users;

  return (
    <View className="flex-1 bg-black">
      {/* Header */}
      <View className="pt-12 pb-4 px-6">
        <View className="flex-row items-center justify-between mb-6">
          <TouchableOpacity>
            <ChevronLeft size={28} color="#fff" />
          </TouchableOpacity>
          <Text className="text-white text-3xl font-bold">Discover</Text>
          <View style={{ width: 28 }} />
        </View>

        {/* Search Bar */}
        <View className="flex-row items-center mb-6">
          <View className="flex-1 flex-row items-center bg-[#1C1C1E] rounded-xl px-4 py-3.5 mr-3">
            <Search size={22} color="#fff" />
            <TextInput
              className="flex-1 text-white text-base ml-3"
              placeholder="Search"
              placeholderTextColor="#8E8E93"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
          <TouchableOpacity className="w-12 h-12 rounded-xl items-center justify-center">
            <Image
              source={require("../../assets/images/filter-icon.png")}
              style={{ width: 22, height: 22 }}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>

        {/* Tabs */}
        <View
          style={{
            flexDirection: "row",
            backgroundColor: "#1C1C1E",
            borderRadius: 999,
            padding: 4,
            marginTop: 12,
          }}
        >
          <TouchableOpacity
            onPress={() => setSelectedTab("everyone")}
            activeOpacity={0.9}
            style={{
              flex: 1,
              paddingVertical: 14,
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 999,
              marginHorizontal: 3,
              backgroundColor:
                selectedTab === "everyone" ? "#FCCD34" : "transparent",
            }}
          >
            <Text
              style={{
                fontWeight: "700",
                fontSize: 16,
                color: selectedTab === "everyone" ? "#fff" : "#8E8E93",
              }}
            >
              Everyone
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setSelectedTab("favorites")}
            activeOpacity={0.9}
            style={{
              flex: 1,
              paddingVertical: 14,
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 999,
              marginHorizontal: 3,
              backgroundColor:
                selectedTab === "favorites" ? "#FCCD34" : "transparent",
            }}
          >
            <Text
              style={{
                fontWeight: "700",
                fontSize: 16,
                color: selectedTab === "favorites" ? "#000" : "#8E8E93",
              }}
            >
              Favorites
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* User Grid */}
      <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
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
                      fontWeight: "800",
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
                        color: "#fff",
                        fontWeight: "700",
                        fontSize: 12,
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
              <View className="relative" style={{ height: 400 }}>
                <Image
                  source={selectedUser.image}
                  className="w-full h-full"
                  resizeMode="cover"
                />

                {/* Back Button */}
                <TouchableOpacity
                  className="absolute top-12 left-6 w-10 h-10 bg-black/50 rounded-full items-center justify-center"
                  onPress={() => setSelectedUser(null)}
                >
                  <ChevronLeft size={24} color="#fff" />
                </TouchableOpacity>

                {/* Handle Bar */}
                <View className="absolute top-3 left-0 right-0 items-center">
                  <View className="w-10 h-1 bg-white/30 rounded-full" />
                </View>

                {/* More Options */}
                <TouchableOpacity className="absolute top-12 right-6">
                  <MoreVertical size={24} color="#fff" />
                </TouchableOpacity>
              </View>

              {/* Profile Info */}
              <View className="px-6 py-4">
                <View className="flex-row items-center justify-between mb-4">
                  <View className="flex-row items-center">
                    <Text className="text-white text-2xl font-bold mr-2">
                      {selectedUser.name}
                    </Text>
                    {selectedUser.isOnline && (
                      <View className="w-3 h-3 bg-green-500 rounded-full" />
                    )}
                  </View>
                  <View className="flex-row items-center">
                    <TouchableOpacity
                      className="w-12 h-12 bg-[#FCCD34] rounded-full items-center justify-center mr-3"
                      onPress={() => {
                        setSelectedUser(null);
                        navigateToChat(selectedUser);
                      }}
                    >
                      <MessageCircle size={24} color="#000" />
                    </TouchableOpacity>
                    <TouchableOpacity
                      className="w-12 h-12 bg-[#1C1C1E] rounded-full items-center justify-center"
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
                </View>

                <View className="flex-row items-center mb-6">
                  <Text className="text-[#8E8E93] mr-2">
                    {selectedUser.role}
                  </Text>
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={14}
                      color="#FCCD34"
                      fill={i < selectedUser.rating ? "#FCCD34" : "transparent"}
                    />
                  ))}
                </View>

                {/* Location */}
                <View className="mb-6">
                  <Text className="text-white text-lg font-bold mb-2">
                    Location
                  </Text>
                  <Text className="text-[#8E8E93]">
                    {selectedUser.location}
                  </Text>
                </View>

                {/* About */}
                <View className="mb-6">
                  <Text className="text-white text-lg font-bold mb-2">
                    About
                  </Text>
                  <Text className="text-[#8E8E93] mb-2">
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
