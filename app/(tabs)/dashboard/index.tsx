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
      <View className="flex-1 items-center justify-center bg-black">
        <ActivityIndicator color="#FCCD34" />
      </View>
    );
  }

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
        <StyledText
          className="text-white"
          style={{
            fontSize: 18,
            fontFamily: FONT.SemiBold,
          }}
        >
          Dashboard
        </StyledText>
      </StyledView>

      <StyledScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingHorizontal: 24,
          paddingTop: 7,
        }}
      >
        {/* Balance Card */}
        <StyledView
          style={{
            backgroundColor: "#19191B",
            borderRadius: 16,
            padding: 20,
            marginBottom: 16,
          }}
        >
          <StyledView
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "flex-start",
            }}
          >
            <StyledView style={{ flex: 1 }}>
              <StyledText
                style={{
                  fontSize: 14,
                  fontFamily: FONT.Regular,
                  color: "#FFFFFF",
                  marginBottom: 8,
                }}
              >
                Total balance
              </StyledText>
              <StyledText
                style={{
                  fontSize: 32,
                  fontFamily: FONT.SemiBold,
                  color: "#FFFFFF",
                  letterSpacing: -1,
                }}
              >
                1250{" "}
                <StyledText
                  style={{
                    fontSize: 24,
                    fontFamily: FONT.Bold,
                  }}
                >
                  GEL
                </StyledText>
              </StyledText>
            </StyledView>
            <StyledView style={{ alignItems: "flex-end" }}>
              <StyledText
                style={{
                  fontSize: 14,
                  fontFamily: FONT.Regular,
                  color: "#FFFFFF",
                  marginBottom: 8,
                }}
              >
                Last 7 days
              </StyledText>
              <StyledText
                style={{
                  fontSize: 15,
                  fontFamily: FONT.Regular,
                  color: "#75FA94",
                }}
              >
                +35.20 GEL
              </StyledText>
            </StyledView>
          </StyledView>
        </StyledView>

        {/* Followers and Withdrawal Buttons */}
        <StyledView
          style={{
            flexDirection: "row",
            gap: 12,
            marginBottom: 24,
          }}
        >
          {/* Followers Button */}
          <StyledTouchableOpacity
            onPress={() => {
              console.log("Followers pressed");
              router.push("/dashboard/followers");
            }}
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
            <StyledText
              style={{
                fontSize: 14,
                fontFamily: FONT.SemiBold,
                color: "#FFFFFF",
                marginRight: 8,
              }}
            >
              Followers
            </StyledText>
            <StyledText
              style={{
                fontSize: 14,
                fontFamily: FONT.SemiBold,
                color: "#FCCD34",
              }}
            >
              2 245
            </StyledText>
          </StyledTouchableOpacity>

          {/* Withdrawal Button */}
          <StyledTouchableOpacity
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
            <StyledText
              style={{
                fontSize: 15,
                fontFamily: FONT.SemiBold,
                color: "#000000",
              }}
            >
              Withdrawal
            </StyledText>
          </StyledTouchableOpacity>
        </StyledView>

        {/* Monetization Tools Section */}
        <StyledView style={{ marginBottom: 24 }}>
          <StyledText
            style={{
              fontSize: 18,
              fontFamily: FONT.Bold,
              color: "#FFFFFF",
              marginBottom: 4,
            }}
          >
            Monetization tools
          </StyledText>
          <StyledText
            style={{
              fontSize: 14,
              fontFamily: FONT.Regular,
              color: "#8E8E93",
              marginBottom: 16,
            }}
          >
            Manage your earning tools and settings
          </StyledText>

          {/* Profile */}
          <StyledTouchableOpacity
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
            <StyledView
              style={{
                borderRadius: 7.69,
                alignItems: "center",
                justifyContent: "center",
                marginRight: 12,
              }}
            >
              <Image
                source={require("../../../assets/images/dashboard/profile-1.png")}
                style={{ width: 40, height: 40 }}
                resizeMode="contain"
              />
            </StyledView>
            <StyledText
              style={{
                flex: 1,
                fontSize: 16,
                fontFamily: FONT.Regular,
                color: "#FFFFFF",
              }}
            >
              Profile
            </StyledText>
            <ChevronLeft
              size={20}
              color="#FFFFFFCC"
              strokeWidth={2}
              style={{ transform: [{ rotate: "180deg" }] }}
            />
          </StyledTouchableOpacity>

          {/* Paid messaging */}
          <StyledTouchableOpacity
            onPress={() => router.push("/(tabs)/dashboard/PaidMessages")}
            style={{
              backgroundColor: "#19191B",
              borderRadius: 0, // No rounded corners
              flexDirection: "row",
              alignItems: "center",
              paddingHorizontal: 8,
              paddingVertical: 12,
            }}
          >
            <StyledView
              style={{
                width: 40,
                height: 40,

                borderRadius: 7.69,
                alignItems: "center",
                justifyContent: "center",
                marginRight: 12,
              }}
            >
              <Image
                source={require("../../../assets/images/dashboard/message.png")}
                style={{ width: 40, height: 40 }}
                resizeMode="contain"
              />
            </StyledView>
            <StyledText
              style={{
                flex: 1,
                fontSize: 16,
                fontFamily: FONT.Regular,
                color: "#FFFFFF",
              }}
            >
              Paid messaging
            </StyledText>
            <ChevronLeft
              size={20}
              color="#FFFFFFCC"
              strokeWidth={2}
              style={{ transform: [{ rotate: "180deg" }] }}
            />
          </StyledTouchableOpacity>

          {/* Donation settings */}
          <StyledTouchableOpacity
            onPress={() => router.push("/(tabs)/dashboard/donation")}
            style={{
              backgroundColor: "#19191B",
              borderRadius: 0, // No rounded corners
              flexDirection: "row",
              alignItems: "center",
              paddingHorizontal: 8,
              paddingVertical: 12,
            }}
          >
            <StyledView
              style={{
                width: 40,
                height: 40,

                borderRadius: 7.69,
                alignItems: "center",
                justifyContent: "center",
                marginRight: 12,
              }}
            >
              <Image
                source={require("../../../assets/images/dashboard/donation.png")}
                style={{ width: 40, height: 40 }}
                resizeMode="contain"
              />
            </StyledView>
            <StyledText
              style={{
                flex: 1,
                fontSize: 16,
                fontFamily: FONT.Regular,
                color: "#FFFFFF",
              }}
            >
              Donation settings
            </StyledText>
            <ChevronLeft
              size={20}
              color="#FFFFFFCC"
              strokeWidth={2}
              style={{ transform: [{ rotate: "180deg" }] }}
            />
          </StyledTouchableOpacity>

          {/* Video/Audio settings */}
          <StyledTouchableOpacity
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
            <StyledView
              style={{
                width: 40,
                height: 40,

                borderRadius: 7.69,
                alignItems: "center",
                justifyContent: "center",
                marginRight: 12,
              }}
            >
              <Image
                source={require("../../../assets/images/dashboard/videocall.png")}
                style={{ width: 40, height: 40 }}
                resizeMode="contain"
              />
            </StyledView>
            <StyledText
              style={{
                flex: 1,
                fontSize: 16,
                fontFamily: FONT.Regular,
                color: "#FFFFFF",
              }}
            >
              Video/Audio settings
            </StyledText>
            <ChevronLeft
              size={20}
              color="#FFFFFFCC"
              strokeWidth={2}
              style={{ transform: [{ rotate: "180deg" }] }}
            />
          </StyledTouchableOpacity>
        </StyledView>

        {/* Financial Management Section */}
        <StyledView style={{ marginBottom: 24 }}>
          <StyledText
            style={{
              fontSize: 18,
              fontFamily: FONT.Bold,
              color: "#FFFFFF",
              marginBottom: 4,
            }}
          >
            Financial management
          </StyledText>
          <StyledText
            style={{
              fontSize: 14,
              fontFamily: FONT.Regular,
              color: "#8E8E93",
              marginBottom: 16,
            }}
          >
            Control your earnings and payout methods
          </StyledText>

          {/* Payout method rules */}
          <StyledTouchableOpacity
            onPress={() => router.push("/(tabs)/dashboard/payout")}
            style={{
              backgroundColor: "#19191B",
              borderRadius: 16,
              flexDirection: "row",
              alignItems: "center",
              paddingHorizontal: 8,
              paddingVertical: 6,
            }}
          >
            <StyledView
              style={{
                width: 40,
                height: 40,

                borderRadius: 7.69,
                alignItems: "center",
                justifyContent: "center",
                marginRight: 12,
              }}
            >
              <Image
                source={require("../../../assets/images/dashboard/payout.png")}
                style={{ width: 40, height: 40 }}
                resizeMode="contain"
              />
            </StyledView>
            <StyledText
              style={{
                flex: 1,
                fontSize: 16,
                fontFamily: FONT.Regular,
                color: "#FFFFFF",
              }}
            >
              Payout method rules
            </StyledText>
            <ChevronLeft
              size={20}
              color="#FFFFFFCC"
              strokeWidth={2}
              style={{ transform: [{ rotate: "180deg" }] }}
            />
          </StyledTouchableOpacity>
        </StyledView>

        {/* Profile & Admin Section */}
        <StyledView style={{ marginBottom: 40 }}>
          <StyledText
            style={{
              fontSize: 18,
              fontFamily: FONT.Bold,
              color: "#FFFFFF",
              marginBottom: 4,
            }}
          >
            Profile & Admin
          </StyledText>
          <StyledText
            style={{
              fontSize: 14,
              fontFamily: FONT.Regular,
              color: "#8E8E93",
              marginBottom: 16,
            }}
          >
            Update your public information and manage user interactions
          </StyledText>

          {/* Profile visibility */}
          <StyledTouchableOpacity
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
            <StyledView
              style={{
                width: 40,
                height: 40,

                borderRadius: 7.69,
                alignItems: "center",
                justifyContent: "center",
                marginRight: 12,
              }}
            >
              <Image
                source={require("../../../assets/images/dashboard/profile.png")}
                style={{ width: 40, height: 40 }}
                resizeMode="contain"
              />
            </StyledView>
            <StyledText
              style={{
                flex: 1,
                fontSize: 16,
                fontFamily: FONT.Regular,
                color: "#FFFFFF",
              }}
            >
              Profile visibility
            </StyledText>
            <ChevronLeft
              size={20}
              color="#FFFFFFCC"
              strokeWidth={2}
              style={{ transform: [{ rotate: "180deg" }] }}
            />
          </StyledTouchableOpacity>

          {/* Block list */}
          <StyledTouchableOpacity
            onPress={() => router.push("/(tabs)/dashboard/blocked")}
            style={{
              backgroundColor: "#19191B",
              borderRadius: 0,
              flexDirection: "row",
              alignItems: "center",
              paddingHorizontal: 8,
              paddingVertical: 12,
            }}
          >
            <StyledView
              style={{
                width: 40,
                height: 40,

                borderRadius: 7.69,
                alignItems: "center",
                justifyContent: "center",
                marginRight: 12,
              }}
            >
              <Image
                source={require("../../../assets/images/dashboard/block.png")}
                style={{ width: 40, height: 40 }}
                resizeMode="contain"
              />
            </StyledView>
            <StyledText
              style={{
                flex: 1,
                fontSize: 16,
                fontFamily: FONT.Regular,
                color: "#FFFFFF",
              }}
            >
              Block list
            </StyledText>
            <ChevronLeft
              size={20}
              color="#FFFFFFCC"
              strokeWidth={2}
              style={{ transform: [{ rotate: "180deg" }] }}
            />
          </StyledTouchableOpacity>

          {/* Support */}
          <StyledTouchableOpacity
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
            <StyledView
              style={{
                width: 40,
                height: 40,

                borderRadius: 7.69,
                alignItems: "center",
                justifyContent: "center",
                marginRight: 12,
              }}
            >
              <Image
                source={require("../../../assets/images/dashboard/support.png")}
                style={{ width: 40, height: 40 }}
                resizeMode="contain"
              />
            </StyledView>
            <StyledText
              style={{
                flex: 1,
                fontSize: 16,
                fontFamily: FONT.Regular,
                color: "#FFFFFF",
              }}
            >
              Support
            </StyledText>
            <ChevronLeft
              size={20}
              color="#FFFFFFCC"
              strokeWidth={2}
              style={{ transform: [{ rotate: "180deg" }] }}
            />
          </StyledTouchableOpacity>
        </StyledView>
      </StyledScrollView>
    </StyledSafeAreaView>
  );
};

export default Dashboard;
