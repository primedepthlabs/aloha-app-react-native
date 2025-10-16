import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  Image,
} from "react-native";
import { styled } from "nativewind";
import {
  Settings,
  Bell,
  Star,
  Wallet,
  HelpCircle,
  ShieldCheck,
  Globe,
  ChevronRight,
} from "lucide-react-native";
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
const StyledScrollView = styled(ScrollView);
const StyledSafeAreaView = styled(SafeAreaView);

const FONT = {
  Regular: "Poppins_400Regular",
  Medium: "Poppins_500Medium",
  SemiBold: "Poppins_600SemiBold",
  Bold: "Poppins_700Bold",
};

const Profile = () => {
  const [activeTab, setActiveTab] = React.useState("settings");

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

  const menuItems = [
    {
      icon: Settings,
      title: "Account settings",
      onPress: () => {},
    },
    {
      icon: Bell,
      title: "Notification settings",
      onPress: () => {},
    },
    {
      icon: Star,
      title: "Join as talent",
      onPress: () => {},
    },
    {
      icon: Wallet,
      title: "Payment settings",
      onPress: () => {},
    },
    {
      icon: HelpCircle,
      title: "Contact support",
      onPress: () => {},
    },
    {
      icon: ShieldCheck,
      title: "Email verification",
      rightText: "Unverified",
      rightTextColor: "#8E8E93",
      onPress: () => {},
    },
    {
      icon: Globe,
      title: "Language",
      rightText: "English",
      rightTextColor: "#8E8E93",
      onPress: () => {},
    },
  ];

  return (
    <StyledSafeAreaView className="flex-1 bg-black">
      <StatusBar barStyle="light-content" />
      <StyledScrollView className="flex-1">
        {/* Header with Profile */}
        <StyledView style={{ paddingHorizontal: 16, marginTop: 20 }}>
          {/* Profile Section */}
          <StyledView className="flex-row items-center mb-6">
            <StyledView
              style={{
                width: 80,
                height: 80,
                borderRadius: 40,
                backgroundColor: "#2C2C2E",
                marginRight: 16,
                overflow: "hidden",
              }}
            >
              <Image
                source={{ uri: "https://i.pravatar.cc/150?img=5" }}
                style={{ width: 80, height: 80 }}
                resizeMode="cover"
              />
            </StyledView>
            <StyledView>
              <StyledText
                className="text-white"
                style={{
                  fontSize: 24,
                  fontFamily: FONT.SemiBold,
                }}
              >
                Ellen smith
              </StyledText>
            </StyledView>
          </StyledView>

          {/* Balance Card */}
          <StyledView
            style={{
              backgroundColor: "#19191B",
              borderRadius: 20,
              borderWidth: 1,
              borderColor: "#FCCD34",
              padding: 20,
              marginBottom: 24,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <StyledView>
              <StyledText
                className="text-gray-400"
                style={{
                  fontSize: 14,
                  fontFamily: FONT.Regular,
                  marginBottom: 4,
                }}
              >
                Balance:
              </StyledText>
              <StyledText
                className="text-white"
                style={{
                  fontSize: 24,
                  fontFamily: FONT.SemiBold,
                }}
              >
                12 GEL
              </StyledText>
            </StyledView>
            <StyledTouchableOpacity
              className="bg-[#FCCD34] items-center justify-center"
              style={{
                paddingHorizontal: 20,
                paddingVertical: 10,
                borderRadius: 12,
              }}
            >
              <StyledText
                className="text-black"
                style={{
                  fontSize: 14,
                  fontFamily: FONT.SemiBold,
                }}
              >
                + Add funds
              </StyledText>
            </StyledTouchableOpacity>
          </StyledView>

          {/* Tabs */}
          <StyledView
            className="flex-row mb-6"
            style={{
              gap: 16,
            }}
          >
            <StyledTouchableOpacity
              onPress={() => setActiveTab("settings")}
              className="flex-1 items-center justify-center"
              style={{
                height: 48,
                borderRadius: 24,
                backgroundColor:
                  activeTab === "settings" ? "#FCCD34" : "transparent",
              }}
            >
              <StyledText
                style={{
                  fontSize: 16,
                  fontFamily: FONT.SemiBold,
                  color: activeTab === "settings" ? "#000" : "#8E8E93",
                }}
              >
                Settings
              </StyledText>
            </StyledTouchableOpacity>
            <StyledTouchableOpacity
              onPress={() => setActiveTab("gallery")}
              className="flex-1 items-center justify-center"
              style={{
                height: 48,
                borderRadius: 24,
                backgroundColor:
                  activeTab === "gallery" ? "#FCCD34" : "transparent",
              }}
            >
              <StyledText
                style={{
                  fontSize: 16,
                  fontFamily: FONT.SemiBold,
                  color: activeTab === "gallery" ? "#000" : "#8E8E93",
                }}
              >
                Gallery
              </StyledText>
            </StyledTouchableOpacity>
          </StyledView>

          {/* Menu Items */}
          <StyledView style={{ gap: 0 }}>
            {menuItems.map((item, index) => (
              <StyledTouchableOpacity
                key={index}
                onPress={item.onPress}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  backgroundColor: "#19191B",
                  paddingVertical: 16,
                  paddingHorizontal: 16,
                  borderRadius: 16,
                  marginBottom: 8,
                }}
              >
                <StyledView className="flex-row items-center flex-1">
                  <StyledView
                    className="items-center justify-center mr-4"
                    style={{
                      width: 40,
                      height: 40,
                    }}
                  >
                    <item.icon size={24} color="#fff" strokeWidth={2} />
                  </StyledView>
                  <StyledText
                    className="text-white"
                    style={{
                      fontSize: 16,
                      fontFamily: FONT.Regular,
                    }}
                  >
                    {item.title}
                  </StyledText>
                </StyledView>
                <StyledView className="flex-row items-center">
                  {item.rightText && (
                    <StyledText
                      style={{
                        fontSize: 15,
                        fontFamily: FONT.Regular,
                        color: item.rightTextColor,
                        marginRight: 8,
                      }}
                    >
                      {item.rightText}
                    </StyledText>
                  )}
                  <ChevronRight size={20} color="#8E8E93" strokeWidth={2.5} />
                </StyledView>
              </StyledTouchableOpacity>
            ))}
          </StyledView>
        </StyledView>

        {/* Bottom spacing for tab bar */}
        <StyledView style={{ height: 100 }} />
      </StyledScrollView>

      {/* Bottom Tab Bar */}
      <StyledView
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: "#000",
          borderTopWidth: 1,
          borderTopColor: "#1C1C1E",
          paddingBottom: 20,
          paddingTop: 12,
        }}
      >
        <StyledView
          className="flex-row items-center justify-around"
          style={{ paddingHorizontal: 40 }}
        >
          <StyledTouchableOpacity
            onPress={() => router.push("/discover")}
            className="items-center"
          >
            <StyledView className="items-center justify-center mb-1">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <circle
                  cx="12"
                  cy="12"
                  r="3"
                  stroke="#8E8E93"
                  strokeWidth="2"
                />
                <path
                  d="M12 2C12 2 8 6 8 12C8 18 12 22 12 22C12 22 16 18 16 12C16 6 12 2 12 2Z"
                  stroke="#8E8E93"
                  strokeWidth="2"
                  fill="none"
                />
              </svg>
            </StyledView>
            <StyledText
              style={{
                fontSize: 11,
                fontFamily: FONT.Regular,
                color: "#8E8E93",
              }}
            >
              Discover
            </StyledText>
          </StyledTouchableOpacity>

          <StyledTouchableOpacity
            onPress={() => router.push("/chats")}
            className="items-center"
          >
            <StyledView className="items-center justify-center mb-1">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <rect
                  x="3"
                  y="5"
                  width="18"
                  height="14"
                  rx="2"
                  stroke="#8E8E93"
                  strokeWidth="2"
                />
                <path
                  d="M3 8L12 13L21 8"
                  stroke="#8E8E93"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </StyledView>
            <StyledText
              style={{
                fontSize: 11,
                fontFamily: FONT.Regular,
                color: "#8E8E93",
              }}
            >
              Chats
            </StyledText>
          </StyledTouchableOpacity>

          <StyledTouchableOpacity className="items-center">
            <StyledView className="items-center justify-center mb-1">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="8" r="4" stroke="#FCCD34" strokeWidth="2" />
                <path
                  d="M4 20C4 16.6863 6.68629 14 10 14H14C17.3137 14 20 16.6863 20 20"
                  stroke="#FCCD34"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </StyledView>
            <StyledText
              style={{
                fontSize: 11,
                fontFamily: FONT.SemiBold,
                color: "#FCCD34",
              }}
            >
              Profile
            </StyledText>
          </StyledTouchableOpacity>
        </StyledView>
      </StyledView>
    </StyledSafeAreaView>
  );
};

export default Profile;
