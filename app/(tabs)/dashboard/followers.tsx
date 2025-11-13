import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  ScrollView,
  Image,
  TextInput,
  Modal,
} from "react-native";
import { ChevronLeft, Search, Trash2 } from "lucide-react-native";
import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
} from "@expo-google-fonts/poppins";
import { router } from "expo-router";

const FONT = {
  Regular: "Poppins_400Regular",
  Medium: "Poppins_500Medium",
  SemiBold: "Poppins_600SemiBold",
  Bold: "Poppins_700Bold",
};

interface Follower {
  id: string;
  name: string;
  addedDate: string;
  avatar: any;
}

const Followers = () => {
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedFollower, setSelectedFollower] = useState<Follower | null>(
    null
  );

  const [followers, setFollowers] = useState<Follower[]>([
    {
      id: "1",
      name: "Sophia Carter",
      addedDate: "2023-08-15",
      avatar: require("../../../assets/images/dashboard/sophia.png"),
    },
    {
      id: "2",
      name: "Sophia Carter",
      addedDate: "2023-08-15",
      avatar: require("../../../assets/images/dashboard/sophia.png"),
    },
    {
      id: "3",
      name: "Sophia Carter",
      addedDate: "2023-08-15",
      avatar: require("../../../assets/images/dashboard/sophia.png"),
    },
    {
      id: "4",
      name: "Sophia Carter",
      addedDate: "2023-08-15",
      avatar: require("../../../assets/images/dashboard/sophia.png"),
    },
  ]);

  if (!fontsLoaded) {
    return (
      <View className="flex-1 items-center justify-center bg-black">
        <ActivityIndicator color="#FCCD34" />
      </View>
    );
  }

  const handleDeletePress = (follower: Follower) => {
    setSelectedFollower(follower);
    setShowDeleteModal(true);
  };

  const handleDelete = () => {
    if (selectedFollower) {
      setFollowers(followers.filter((f) => f.id !== selectedFollower.id));
      setShowDeleteModal(false);
      setSelectedFollower(null);
    }
  };

  const filteredFollowers = followers.filter((follower) =>
    follower.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const FollowerItem = ({ follower }: { follower: Follower }) => (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 12,
      }}
    >
      <Image
        source={follower.avatar}
        style={{
          width: 60,
          height: 60,
          borderRadius: 30,
          marginRight: 16,
        }}
      />

      <View style={{ flex: 1 }}>
        <Text
          style={{
            fontSize: 16,
            fontFamily: FONT.Medium,
            color: "#FFFFFF",
            marginBottom: 4,
          }}
        >
          {follower.name}
        </Text>

        <Text
          style={{
            fontSize: 12,
            fontFamily: FONT.Regular,
            color: "#6C6C70",
          }}
        >
          Added {follower.addedDate}
        </Text>
      </View>

      <TouchableOpacity
        onPress={() => handleDeletePress(follower)}
        style={{
          width: 40,
          height: 40,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Trash2 size={22} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-black">
      <StatusBar barStyle="light-content" />

      {/* HEADER */}
      <View
        style={{
          height: 60,
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          position: "relative",
        }}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          style={{
            position: "absolute",
            left: 20,
            width: 40,
            height: 40,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <ChevronLeft size={26} color="#FFF" />
        </TouchableOpacity>

        <Text
          style={{ fontSize: 15, color: "#FFF", fontFamily: FONT.SemiBold }}
        >
          Followers
        </Text>
      </View>

      {/* SEARCH BAR */}
      <View style={{ paddingHorizontal: 20, paddingVertical: 20 }}>
        <View
          style={{
            backgroundColor: "#1C1C1E",
            borderRadius: 12,
            height: 48,
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: 16,
          }}
        >
          <Search size={20} color="#6C6C70" />

          <TextInput
            placeholder="Search"
            placeholderTextColor="#6C6C70"
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={{
              flex: 1,
              marginLeft: 12,
              color: "#FFF",
              fontSize: 15,
              fontFamily: FONT.Regular,
            }}
          />
        </View>
      </View>

      {/* FOLLOWERS COUNT */}
      <View style={{ paddingHorizontal: 20 }}>
        <Text
          style={{
            fontSize: 16,
            fontFamily: FONT.SemiBold,
            color: "#FFFFFF",
          }}
        >
          {followers.length.toLocaleString()} Followers
        </Text>
      </View>

      {/* LIST */}
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 10 }}
      >
        {filteredFollowers.length > 0 ? (
          filteredFollowers.map((follower) => (
            <FollowerItem key={follower.id} follower={follower} />
          ))
        ) : (
          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
              paddingTop: 100,
            }}
          >
            <Text
              style={{
                fontSize: 15,
                fontFamily: FONT.Regular,
                color: "#6C6C70",
              }}
            >
              No followers found
            </Text>
          </View>
        )}
      </ScrollView>

      {/* DELETE CONFIRMATION MODAL */}
      <Modal
        visible={showDeleteModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowDeleteModal(false)}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.8)",
            justifyContent: "center",
            alignItems: "center",
            paddingHorizontal: 20,
          }}
        >
          <View
            style={{
              backgroundColor: "#19191B",
              width: "100%",
              maxWidth: 340,
              borderRadius: 16,
              padding: 24,
            }}
          >
            <Text
              style={{
                fontSize: 15,
                color: "#FFFFFF",
                textAlign: "center",
                fontFamily: FONT.Regular,
                marginBottom: 8,
              }}
            >
              Are you sure you want to delete
            </Text>

            <Text
              style={{
                fontSize: 16,
                color: "#FCCD34",
                textAlign: "center",
                fontFamily: FONT.SemiBold,
                marginBottom: 24,
              }}
            >
              {selectedFollower?.name} from followers?
            </Text>

            <TouchableOpacity
              onPress={handleDelete}
              style={{
                paddingVertical: 14,
                borderBottomWidth: 1,
                borderBottomColor: "#3A3A3C",
              }}
            >
              <Text
                style={{
                  textAlign: "center",
                  color: "#FF453A",
                  fontFamily: FONT.Medium,
                  fontSize: 15,
                }}
              >
                Delete
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setShowDeleteModal(false)}
              style={{ paddingVertical: 14 }}
            >
              <Text
                style={{
                  textAlign: "center",
                  color: "#FFF",
                  fontFamily: FONT.Medium,
                  fontSize: 15,
                }}
              >
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default Followers;
