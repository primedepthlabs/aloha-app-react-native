import React from "react";
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

const Dashboard = () => {
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  if (!fontsLoaded) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "black",
        }}
      >
        <ActivityIndicator color="#FCCD34" />
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "black" }}>
      <StatusBar barStyle="light-content" />

      {/* HEADER */}
      <View
        style={{
          height: 60,
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          paddingHorizontal: 20,
        }}
      >
        <Text
          style={{ fontSize: 18, color: "#FFF", fontFamily: FONT.SemiBold }}
        >
          Dashboard
        </Text>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 7 }}
      >
        {/* BALANCE CARD */}
        <TouchableOpacity
          onPress={() => router.push("/(tabs)/dashboard/Earnings")}
          activeOpacity={0.8}
        >
          <View
            style={{
              backgroundColor: "#19191B",
              borderRadius: 16,
              padding: 20,
              marginBottom: 16,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "flex-start",
              }}
            >
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontSize: 14,
                    fontFamily: FONT.Regular,
                    color: "#FFFFFF",
                    marginBottom: 8,
                  }}
                >
                  Total balance
                </Text>

                <Text
                  style={{
                    fontSize: 32,
                    fontFamily: FONT.SemiBold,
                    color: "#FFFFFF",
                    letterSpacing: -1,
                  }}
                >
                  1250{" "}
                  <Text style={{ fontSize: 24, fontFamily: FONT.Bold }}>
                    GEL
                  </Text>
                </Text>
              </View>

              <View style={{ alignItems: "flex-end" }}>
                <Text
                  style={{
                    fontSize: 14,
                    fontFamily: FONT.Regular,
                    color: "#FFFFFF",
                    marginBottom: 8,
                  }}
                >
                  Last 7 days
                </Text>

                <Text
                  style={{
                    fontSize: 15,
                    fontFamily: FONT.Regular,
                    color: "#75FA94",
                  }}
                >
                  +35.20 GEL
                </Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>

        {/* FOLLOWERS + WITHDRAW */}

        <View style={{ flexDirection: "row", gap: 12, marginBottom: 24 }}>
          {/* Followers Button */}
          <TouchableOpacity
            onPress={() => router.push("/dashboard/followers")}
            style={{
              width: 164,
              height: 48,
              backgroundColor: "black",
              borderRadius: 15,
              paddingVertical: 16,
              paddingHorizontal: 24,
              borderWidth: 0.5,
              borderColor: "#FCCD34",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text
              style={{
                fontSize: 14,
                fontFamily: FONT.SemiBold,
                color: "#FFFFFF",
                marginRight: 8,
              }}
            >
              Followers
            </Text>

            <Text
              style={{
                fontSize: 14,
                fontFamily: FONT.SemiBold,
                color: "#FCCD34",
              }}
            >
              2 245
            </Text>
          </TouchableOpacity>

          {/* Withdrawal Button */}
          <TouchableOpacity
            onPress={() => router.push("/(tabs)/dashboard/withdrawl")}
            style={{
              width: 164,
              height: 48,
              backgroundColor: "#FCCD34",
              borderRadius: 15,
              paddingVertical: 16,
              paddingHorizontal: 24,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Image
              source={require("../../../assets/images/dashboard/withdrawl.png")}
              style={{ width: 20, height: 20, marginRight: 8 }}
              resizeMode="contain"
            />

            <Text
              style={{
                fontSize: 15,
                fontFamily: FONT.SemiBold,
                color: "#000000",
              }}
            >
              Withdrawal
            </Text>
          </TouchableOpacity>
        </View>

        {/* MONETIZATION TOOLS */}
        <View style={{ marginBottom: 24 }}>
          <Text
            style={{
              fontSize: 18,
              fontFamily: FONT.Bold,
              color: "#FFFFFF",
              marginBottom: 4,
            }}
          >
            Monetization tools
          </Text>

          <Text
            style={{
              fontSize: 14,
              fontFamily: FONT.Regular,
              color: "#8E8E93",
              marginBottom: 16,
            }}
          >
            Manage your earning tools and settings
          </Text>

          {/* Profile */}
          <TouchableOpacity
            onPress={() => router.push("/(tabs)/dashboard/welcome-dashboard")}
            style={{
              backgroundColor: "#19191B",
              borderTopLeftRadius: 16,
              borderTopRightRadius: 16,
              flexDirection: "row",
              alignItems: "center",
              paddingHorizontal: 8,
              paddingVertical: 12,
            }}
          >
            <Image
              source={require("../../../assets/images/dashboard/profile-1.png")}
              style={{ width: 40, height: 40, marginRight: 12 }}
              resizeMode="contain"
            />

            <Text
              style={{
                flex: 1,
                fontSize: 16,
                fontFamily: FONT.Regular,
                color: "#FFFFFF",
              }}
            >
              Profile
            </Text>

            <ChevronLeft
              size={20}
              color="#FFFFFFCC"
              strokeWidth={2}
              style={{ transform: [{ rotate: "180deg" }] }}
            />
          </TouchableOpacity>

          {/* Paid messaging */}
          <TouchableOpacity
            onPress={() => router.push("/(tabs)/dashboard/PaidMessages")}
            style={{
              backgroundColor: "#19191B",
              flexDirection: "row",
              alignItems: "center",
              paddingHorizontal: 8,
              paddingVertical: 12,
            }}
          >
            <Image
              source={require("../../../assets/images/dashboard/message.png")}
              style={{ width: 40, height: 40, marginRight: 12 }}
              resizeMode="contain"
            />

            <Text
              style={{
                flex: 1,
                color: "#FFFFFF",
                fontSize: 16,
                fontFamily: FONT.Regular,
              }}
            >
              Paid messaging
            </Text>

            <ChevronLeft
              size={20}
              color="#FFFFFFCC"
              strokeWidth={2}
              style={{ transform: [{ rotate: "180deg" }] }}
            />
          </TouchableOpacity>

          {/* Donation settings */}
          <TouchableOpacity
            onPress={() => router.push("/(tabs)/dashboard/donation")}
            style={{
              backgroundColor: "#19191B",
              flexDirection: "row",
              alignItems: "center",
              paddingHorizontal: 8,
              paddingVertical: 12,
            }}
          >
            <Image
              source={require("../../../assets/images/dashboard/donation.png")}
              style={{ width: 40, height: 40, marginRight: 12 }}
              resizeMode="contain"
            />

            <Text
              style={{
                flex: 1,
                fontSize: 16,
                color: "#FFFFFF",
                fontFamily: FONT.Regular,
              }}
            >
              Donation settings
            </Text>

            <ChevronLeft
              size={20}
              color="#FFFFFFCC"
              style={{ transform: [{ rotate: "180deg" }] }}
            />
          </TouchableOpacity>

          {/* Video/Audio settings */}
          <TouchableOpacity
            onPress={() => router.push("/(tabs)/dashboard/videocalls")}
            style={{
              backgroundColor: "#19191B",
              borderBottomLeftRadius: 16,
              borderBottomRightRadius: 16,
              flexDirection: "row",
              alignItems: "center",
              paddingHorizontal: 8,
              paddingVertical: 12,
            }}
          >
            <Image
              source={require("../../../assets/images/dashboard/videocall.png")}
              style={{ width: 40, height: 40, marginRight: 12 }}
              resizeMode="contain"
            />

            <Text
              style={{
                flex: 1,
                color: "#FFFFFF",
                fontSize: 16,
                fontFamily: FONT.Regular,
              }}
            >
              Video/Audio settings
            </Text>

            <ChevronLeft
              size={20}
              color="#FFFFFFCC"
              strokeWidth={2}
              style={{ transform: [{ rotate: "180deg" }] }}
            />
          </TouchableOpacity>
        </View>

        {/* FINANCIAL MANAGEMENT */}
        <View style={{ marginBottom: 24 }}>
          <Text
            style={{
              fontSize: 18,
              color: "#FFF",
              fontFamily: FONT.Bold,
              marginBottom: 4,
            }}
          >
            Financial management
          </Text>

          <Text
            style={{
              fontSize: 14,
              fontFamily: FONT.Regular,
              color: "#8E8E93",
              marginBottom: 16,
            }}
          >
            Control your earnings and payout methods
          </Text>

          <TouchableOpacity
            onPress={() => router.push("/(tabs)/dashboard/payout")}
            style={{
              backgroundColor: "#19191B",
              borderRadius: 16,
              flexDirection: "row",
              alignItems: "center",
              paddingHorizontal: 8,
              paddingVertical: 12,
            }}
          >
            <Image
              source={require("../../../assets/images/dashboard/payout.png")}
              style={{ width: 40, height: 40, marginRight: 12 }}
              resizeMode="contain"
            />

            <Text
              style={{
                flex: 1,
                color: "#FFF",
                fontSize: 16,
                fontFamily: FONT.Regular,
              }}
            >
              Payout method rules
            </Text>

            <ChevronLeft
              size={20}
              color="#FFF"
              strokeWidth={2}
              style={{ transform: [{ rotate: "180deg" }] }}
            />
          </TouchableOpacity>
        </View>

        {/* PROFILE & ADMIN */}
        <View style={{ marginBottom: 40 }}>
          <Text
            style={{
              fontSize: 18,
              fontFamily: FONT.Bold,
              color: "#FFF",
              marginBottom: 4,
            }}
          >
            Profile & Admin
          </Text>

          <Text
            style={{
              color: "#8E8E93",
              fontSize: 14,
              fontFamily: FONT.Regular,
              marginBottom: 16,
            }}
          >
            Update your public information and manage user interactions
          </Text>

          {/* Profile visibility */}
          <TouchableOpacity
            onPress={() => router.push("/(tabs)/dashboard/profilevisibility")}
            style={{
              backgroundColor: "#19191B",
              borderTopLeftRadius: 16,
              borderTopRightRadius: 16,
              flexDirection: "row",
              alignItems: "center",
              paddingHorizontal: 8,
              paddingVertical: 12,
            }}
          >
            <Image
              source={require("../../../assets/images/dashboard/profile.png")}
              style={{ width: 40, height: 40, marginRight: 12 }}
              resizeMode="contain"
            />

            <Text
              style={{
                flex: 1,
                fontSize: 16,
                color: "#FFF",
                fontFamily: FONT.Regular,
              }}
            >
              Profile visibility
            </Text>

            <ChevronLeft
              size={20}
              color="#FFF"
              strokeWidth={2}
              style={{ transform: [{ rotate: "180deg" }] }}
            />
          </TouchableOpacity>

          {/* Block list */}
          <TouchableOpacity
            onPress={() => router.push("/(tabs)/dashboard/blocked")}
            style={{
              backgroundColor: "#19191B",
              flexDirection: "row",
              alignItems: "center",
              paddingHorizontal: 8,
              paddingVertical: 12,
            }}
          >
            <Image
              source={require("../../../assets/images/dashboard/block.png")}
              style={{ width: 40, height: 40, marginRight: 12 }}
              resizeMode="contain"
            />

            <Text
              style={{
                flex: 1,
                color: "#FFF",
                fontSize: 16,
                fontFamily: FONT.Regular,
              }}
            >
              Block list
            </Text>

            <ChevronLeft
              size={20}
              color="#FFF"
              strokeWidth={2}
              style={{ transform: [{ rotate: "180deg" }] }}
            />
          </TouchableOpacity>

          {/* Support */}
          <TouchableOpacity
            onPress={() => router.push("/(tabs)/dashboard/support")}
            style={{
              backgroundColor: "#19191B",
              borderBottomLeftRadius: 16,
              borderBottomRightRadius: 16,
              flexDirection: "row",
              alignItems: "center",
              paddingHorizontal: 8,
              paddingVertical: 12,
            }}
          >
            <Image
              source={require("../../../assets/images/dashboard/support.png")}
              style={{ width: 40, height: 40, marginRight: 12 }}
              resizeMode="contain"
            />

            <Text
              style={{
                flex: 1,
                color: "#FFF",
                fontSize: 16,
                fontFamily: FONT.Regular,
              }}
            >
              Support
            </Text>

            <ChevronLeft
              size={20}
              color="#FFF"
              strokeWidth={2}
              style={{ transform: [{ rotate: "180deg" }] }}
            />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Dashboard;
