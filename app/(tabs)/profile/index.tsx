import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Image,
  ActivityIndicator,
  Modal,
} from "react-native";
import { Svg, Path, Circle } from "react-native-svg";
import { styled } from "nativewind";
import {
  Settings,
  Bell,
  Star,
  CreditCard,
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
const StyledImage = styled(Image);

const FONT = {
  Regular: "Poppins_400Regular",
  Medium: "Poppins_500Medium",
  SemiBold: "Poppins_600SemiBold",
  Bold: "Poppins_700Bold",
};

const ProfileScreen = () => {
  const balance = 12;
  const userName = "Ellen smith";
  const [selectedLanguage, setSelectedLanguage] = useState("English");
  const [isLanguageModalVisible, setIsLanguageModalVisible] = useState(false);

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

  const MenuItem = ({
    icon: Icon,
    title,
    subtitle,
    rightText,
    onPress,
  }: any) => (
    <StyledTouchableOpacity
      onPress={onPress}
      style={{
        width: 330,
        height: 40,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: "black",
        borderRadius: 15,
        paddingHorizontal: 16,
        marginBottom: 10,
      }}
    >
      <StyledView className="flex-row items-center flex-1">
        <StyledView
          className="items-center justify-center"
          style={{
            width: 32,
            height: 32,
            marginRight: 12,
            backgroundColor: "#19191B",
          }}
        >
          <Icon
            size={20}
            color="#FFFFFF"
            backgroundColor="#19191B"
            strokeWidth={2}
          />
        </StyledView>
        <StyledView className="flex-1">
          <StyledText
            className="text-white"
            style={{
              fontSize: 16,
              fontFamily: FONT.Regular,
            }}
          >
            {title}
          </StyledText>
        </StyledView>
        {rightText && (
          <StyledText
            className="text-gray-400"
            style={{
              fontSize: 15,
              fontFamily: FONT.Regular,
              marginRight: 8,
            }}
          >
            {rightText}
          </StyledText>
        )}
        <ChevronRight size={20} color="#8E8E93" strokeWidth={2} />
      </StyledView>
    </StyledTouchableOpacity>
  );

  const LanguageOption = ({ flag, code, name, isSelected, onSelect }: any) => (
    <StyledTouchableOpacity
      onPress={onSelect}
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: 16,
        paddingHorizontal: 24,
        borderBottomWidth: 1,
        borderBottomColor: "#2C2C2E",
      }}
    >
      <StyledView style={{ flexDirection: "row", alignItems: "center" }}>
        <StyledText style={{ fontSize: 32, marginRight: 16 }}>
          {flag}
        </StyledText>
        <StyledText
          style={{
            fontSize: 17,
            fontFamily: FONT.Regular,
            color: "#FFFFFF",
          }}
        >
          {name}
        </StyledText>
      </StyledView>
      <StyledView
        style={{
          width: 24,
          height: 24,
          borderRadius: 12,
          borderWidth: 2,
          borderColor: isSelected ? "#FCCD34" : "#8E8E93",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {isSelected && (
          <StyledView
            style={{
              width: 12,
              height: 12,
              borderRadius: 6,
              backgroundColor: "#FCCD34",
            }}
          />
        )}
      </StyledView>
    </StyledTouchableOpacity>
  );

  const handleLanguageSelect = (language: string) => {
    setSelectedLanguage(language);
    setIsLanguageModalVisible(false);
  };

  return (
    <StyledSafeAreaView className="flex-1 bg-black">
      <StatusBar barStyle="light-content" />
      <StyledScrollView className="flex-1">
        {/* Profile Header */}
        <StyledView
          style={{
            width: 375,
            height: 65,
            marginTop: 10,
            paddingHorizontal: 20,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <StyledView
            style={{
              width: 70,
              height: 70,
              borderRadius: 35,
              overflow: "hidden",
              marginRight: 16,
              backgroundColor: "#2C2C2E",
            }}
          >
            <StyledImage
              source={require("../../../assets/images/profile-placeholder.png")}
              style={{ width: 70, height: 70 }}
              resizeMode="cover"
            />
          </StyledView>
          <StyledText
            className="text-white"
            style={{
              fontSize: 24,
              fontFamily: FONT.SemiBold,
            }}
          >
            {userName}
          </StyledText>
        </StyledView>

        {/* Balance Card */}
        <StyledView
          className="flex-row items-center justify-between px-4"
          style={{
            width: 350,
            height: 69,
            marginLeft: 21,
            marginTop: 20,
            borderRadius: 15,
            borderWidth: 0.3,
            borderColor: "#FCCD34",
            backgroundColor: "rgba(28, 28, 30, 0.8)",
          }}
        >
          <StyledView>
            <StyledText
              className="text-gray-400"
              style={{
                fontFamily: FONT.Regular,
                fontWeight: "400",
                fontSize: 12,
                lineHeight: 12,
                marginBottom: 4,
              }}
            >
              Balance:
            </StyledText>
            <StyledText
              className="text-white font-bold"
              style={{ fontSize: 18, fontFamily: FONT.SemiBold }}
            >
              {balance} GEL
            </StyledText>
          </StyledView>
          <StyledTouchableOpacity
            className="bg-[#FCCD34] items-center justify-center"
            onPress={() => router.push("/(tabs)/profile/addFunds")}
            style={{
              width: 92,
              height: 29,
              borderRadius: 10,
            }}
          >
            <StyledText
              className="text-black font-semibold"
              style={{ fontSize: 13 }}
            >
              + Add funds
            </StyledText>
          </StyledTouchableOpacity>
        </StyledView>

        {/* Tabs */}
        <StyledView
          style={{
            width: 331,
            height: 39,
            marginTop: 15,
            marginLeft: 21,
            flexDirection: "row",
            borderRadius: 15,
            padding: 3.88,
            backgroundColor: "#1C1C1E",
          }}
        >
          <StyledTouchableOpacity
            className="bg-[#FCCD34] items-center justify-center"
            style={{
              width: 144,
              height: 31.246444702148438,
              borderRadius: 15,
              paddingHorizontal: 7.75,
            }}
          >
            <StyledText
              className="text-black"
              style={{
                fontSize: 16,
                fontFamily: FONT.Regular,
              }}
            >
              Settings
            </StyledText>
          </StyledTouchableOpacity>
          <StyledTouchableOpacity
            className="items-center justify-center flex-1"
            style={{
              paddingHorizontal: 7.75,
            }}
          >
            <StyledText
              className="text-gray-400"
              style={{
                fontSize: 16,
                fontFamily: FONT.Regular,
              }}
            >
              Gallery
            </StyledText>
          </StyledTouchableOpacity>
        </StyledView>

        {/* Menu Items */}
        <StyledView
          style={{
            width: 330,
            marginTop: 15,
            marginLeft: 24,
            paddingBottom: 100,
          }}
        >
          <MenuItem
            icon={Settings}
            title="Account settings"
            onPress={() => router.push("/(tabs)/profile/account-settings")}
          />
          <MenuItem
            icon={Bell}
            title="Notification settings"
            onPress={() => router.push("/(tabs)/profile/notificationSettings")}
          />
          <MenuItem icon={Star} title="Join as talent" onPress={() => {}} />
          <MenuItem
            icon={CreditCard}
            title="Payment settings"
            onPress={() => router.push("/(tabs)/profile/payment")}
          />
          <MenuItem
            icon={HelpCircle}
            title="Contact support"
            onPress={() => router.push("/(tabs)/profile/contact-support")}
          />
          <MenuItem
            icon={ShieldCheck}
            title="Email verification"
            rightText="Unverified"
            onPress={() => router.push("/(tabs)/profile/verification")}
          />
          <MenuItem
            icon={Globe}
            title="Language"
            rightText={selectedLanguage}
            onPress={() => setIsLanguageModalVisible(true)}
          />
        </StyledView>
      </StyledScrollView>

      {/* Language Selection Modal */}
      <Modal
        visible={isLanguageModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsLanguageModalVisible(false)}
      >
        <StyledTouchableOpacity
          style={{
            flex: 1,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            justifyContent: "flex-end",
          }}
          activeOpacity={1}
          onPress={() => setIsLanguageModalVisible(false)}
        >
          <StyledTouchableOpacity
            activeOpacity={1}
            style={{
              backgroundColor: "#1C1C1E",
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              paddingBottom: 34,
            }}
          >
            {/* Handle Bar */}
            <StyledView
              style={{
                width: 36,
                height: 5,
                backgroundColor: "#48484A",
                borderRadius: 2.5,
                alignSelf: "center",
                marginTop: 12,
                marginBottom: 20,
              }}
            />

            {/* Title */}
            <StyledText
              style={{
                fontSize: 17,
                fontFamily: FONT.SemiBold,
                color: "#FFFFFF",
                textAlign: "center",
                marginBottom: 24,
              }}
            >
              Choose Language
            </StyledText>

            {/* Language Options */}
            <LanguageOption
              flag="🇬🇪"
              code="geo"
              name="Geo"
              isSelected={selectedLanguage === "Georgian"}
              onSelect={() => handleLanguageSelect("Georgian")}
            />
            <LanguageOption
              flag="🇬🇧"
              code="eng"
              name="Eng"
              isSelected={selectedLanguage === "English"}
              onSelect={() => handleLanguageSelect("English")}
            />
          </StyledTouchableOpacity>
        </StyledTouchableOpacity>
      </Modal>
    </StyledSafeAreaView>
  );
};

export default ProfileScreen;
