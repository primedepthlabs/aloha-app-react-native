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
import { ChevronLeft } from "lucide-react-native";
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
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 12,
      }}
    >
      <Image
        source={user.avatar}
        style={{
          width: 60,
          height: 60,
          borderRadius: 30,
          marginRight: 16,
        }}
        resizeMode="cover"
      />

      <View style={{ flex: 1 }}>
        <Text
          style={{
            fontSize: 16,
            fontFamily: FONT.Medium,
            color: "#FFFFFF",
          }}
        >
          {user.name}
        </Text>
      </View>

      <TouchableOpacity
        style={{
          backgroundColor: "#FCCD34",
          borderRadius: 20,
          paddingHorizontal: 24,
          paddingVertical: 10,
        }}
        onPress={() => handleUnblock(user.id)}
      >
        <Text
          style={{
            fontSize: 14,
            fontFamily: FONT.SemiBold,
            color: "#000000",
          }}
        >
          Unblock
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-black">
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View
        style={{
          height: 60,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          paddingHorizontal: 20,
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
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <ChevronLeft size={26} color="#FFFFFF" strokeWidth={2} />
        </TouchableOpacity>

        <Text
          style={{
            fontSize: 15,
            fontFamily: FONT.SemiBold,
            color: "#FFFFFF",
          }}
        >
          Blocked People
        </Text>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 30 }}
      >
        {blockedUsers.length > 0 ? (
          blockedUsers.map((user) => (
            <BlockedUserItem key={user.id} user={user} />
          ))
        ) : (
          <View
            style={{
              flex: 1,
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
                textAlign: "center",
              }}
            >
              No blocked users
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Blocked;
