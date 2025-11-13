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
import { styled } from "nativewind";
import { ChevronLeft, Search, Trash2 } from "lucide-react-native";
import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
} from "@expo-google-fonts/poppins";
import { router } from "expo-router";

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity);
const StyledSafeAreaView = styled(SafeAreaView);
const StyledScrollView = styled(ScrollView);
const StyledImage = styled(Image);
const StyledTextInput = styled(TextInput);

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
    <StyledView
      style={{
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 12,
        borderBottomWidth: 0,
      }}
    >
      <StyledImage
        source={follower.avatar}
        style={{
          width: 60,
          height: 60,
          borderRadius: 30,
          marginRight: 16,
        }}
        resizeMode="cover"
      />
      <StyledView style={{ flex: 1 }}>
        <StyledText
          style={{
            fontSize: 16,
            fontFamily: FONT.Medium,
            color: "#FFFFFF",
            marginBottom: 4,
          }}
        >
          {follower.name}
        </StyledText>
        <StyledText
          style={{
            fontSize: 12,
            fontFamily: FONT.Regular,
            color: "#6C6C70",
          }}
        >
          Added {follower.addedDate}
        </StyledText>
      </StyledView>
      <StyledTouchableOpacity
        style={{
          width: 40,
          height: 40,
          alignItems: "center",
          justifyContent: "center",
        }}
        onPress={() => handleDeletePress(follower)}
      >
        <Trash2 size={22} color="#FFFFFF" />
      </StyledTouchableOpacity>
    </StyledView>
  );

  return (
    <StyledSafeAreaView className="flex-1 bg-black">
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <StyledView
        style={{
          height: 60,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          paddingHorizontal: 20,
          position: "relative",
        }}
      >
        <StyledTouchableOpacity
          onPress={() => router.back()}
          style={{
            position: "absolute",
            left: 20,
            width: 40,
            height: 40,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <ChevronLeft size={26} color="#FFFFFF" strokeWidth={2} />
        </StyledTouchableOpacity>
        <StyledText
          style={{
            fontSize: 15,
            fontFamily: FONT.SemiBold,
            color: "#FFFFFF",
          }}
        >
          Followers
        </StyledText>
      </StyledView>

      {/* Search Bar */}
      <StyledView
        style={{ paddingHorizontal: 20, paddingTop: 10, paddingBottom: 20 }}
      >
        <StyledView
          style={{
            backgroundColor: "#1C1C1E",
            borderRadius: 12,
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: 16,
            height: 48,
          }}
        >
          <Search size={20} color="#6C6C70" />
          <StyledTextInput
            placeholder="Search"
            placeholderTextColor="#6C6C70"
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={{
              flex: 1,
              marginLeft: 12,
              fontSize: 15,
              fontFamily: FONT.Regular,
              color: "#FFFFFF",
            }}
          />
        </StyledView>
      </StyledView>

      {/* Followers Count */}
      <StyledView style={{ paddingHorizontal: 20, paddingBottom: 10 }}>
        <StyledText
          style={{
            fontSize: 16,
            fontFamily: FONT.SemiBold,
            color: "#FFFFFF",
          }}
        >
          {followers.length.toLocaleString()} Followers
        </StyledText>
      </StyledView>

      <StyledScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 10 }}
      >
        {filteredFollowers.length > 0 ? (
          filteredFollowers.map((follower) => (
            <FollowerItem key={follower.id} follower={follower} />
          ))
        ) : (
          <StyledView
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
              paddingTop: 100,
            }}
          >
            <StyledText
              style={{
                fontSize: 15,
                fontFamily: FONT.Regular,
                color: "#6C6C70",
                textAlign: "center",
              }}
            >
              No followers found
            </StyledText>
          </StyledView>
        )}
      </StyledScrollView>

      {/* Delete Confirmation Modal */}
      <Modal
        visible={showDeleteModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowDeleteModal(false)}
      >
        <StyledView
          style={{
            flex: 1,
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            alignItems: "center",
            justifyContent: "center",
            paddingHorizontal: 23,
          }}
        >
          <StyledView
            style={{
              backgroundColor: "#19191B",
              borderRadius: 16,
              padding: 24,
              width: "100%",
              maxWidth: 340,
            }}
          >
            <StyledText
              style={{
                fontSize: 15,
                fontFamily: FONT.Regular,
                color: "#FFFFFF",
                textAlign: "center",
                marginBottom: 8,
              }}
            >
              Are you sure you want to Delete
            </StyledText>
            <StyledText
              style={{
                fontSize: 16,
                fontFamily: FONT.SemiBold,
                color: "#FCCD34",
                textAlign: "center",
                marginBottom: 24,
              }}
            >
              {selectedFollower?.name} from followers?
            </StyledText>

            <StyledTouchableOpacity
              onPress={handleDelete}
              style={{
                paddingVertical: 14,
                borderBottomWidth: 1,
                borderBottomColor: "#3A3A3C",
              }}
            >
              <StyledText
                style={{
                  fontSize: 15,
                  fontFamily: FONT.Medium,
                  color: "#FF453A",
                  textAlign: "center",
                }}
              >
                Delete
              </StyledText>
            </StyledTouchableOpacity>

            <StyledTouchableOpacity
              onPress={() => setShowDeleteModal(false)}
              style={{
                paddingVertical: 14,
              }}
            >
              <StyledText
                style={{
                  fontSize: 15,
                  fontFamily: FONT.Medium,
                  color: "#FFFFFF",
                  textAlign: "center",
                }}
              >
                Cancel
              </StyledText>
            </StyledTouchableOpacity>
          </StyledView>
        </StyledView>
      </Modal>
    </StyledSafeAreaView>
  );
};

export default Followers;
