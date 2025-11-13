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
} from "react-native";
import { styled } from "nativewind";
import { ChevronLeft } from "lucide-react-native";
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

const FONT = {
  Regular: "Poppins_400Regular",
  Medium: "Poppins_500Medium",
  SemiBold: "Poppins_600SemiBold",
  Bold: "Poppins_700Bold",
};

interface BlockedUser {
  id: string;
  name: string;
  avatar: any;
}

const Blocked = () => {
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  const [blockedUsers, setBlockedUsers] = useState<BlockedUser[]>([
    {
      id: "1",
      name: "Sophia Bennett",
      avatar: require("../../../assets/images/dashboard/sophia.png"),
    },
    {
      id: "2",
      name: "Ethan Carter",
      avatar: require("../../../assets/images/dashboard/ethan.png"),
    },
    {
      id: "3",
      name: "Olivia Davis",
      avatar: require("../../../assets/images/dashboard/olivia.png"),
    },
  ]);

  if (!fontsLoaded) {
    return (
      <View className="flex-1 items-center justify-center bg-black">
        <ActivityIndicator color="#FCCD34" />
      </View>
    );
  }

  const handleUnblock = (userId: string) => {
    setBlockedUsers(blockedUsers.filter((user) => user.id !== userId));
  };

  const BlockedUserItem = ({ user }: { user: BlockedUser }) => (
    <StyledView
      style={{
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 12,
        borderBottomWidth: 0,
      }}
    >
      <StyledImage
        source={user.avatar}
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
          }}
        >
          {user.name}
        </StyledText>
      </StyledView>
      <StyledTouchableOpacity
        style={{
          backgroundColor: "#FCCD34",
          borderRadius: 20,
          paddingHorizontal: 24,
          paddingVertical: 10,
        }}
        onPress={() => handleUnblock(user.id)}
      >
        <StyledText
          style={{
            fontSize: 14,
            fontFamily: FONT.SemiBold,
            color: "#000000",
          }}
        >
          Unblock
        </StyledText>
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
          Blocked People
        </StyledText>
      </StyledView>

      <StyledScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 30 }}
      >
        {blockedUsers.length > 0 ? (
          blockedUsers.map((user) => (
            <BlockedUserItem key={user.id} user={user} />
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
              No blocked users
            </StyledText>
          </StyledView>
        )}
      </StyledScrollView>
    </StyledSafeAreaView>
  );
};

export default Blocked;
