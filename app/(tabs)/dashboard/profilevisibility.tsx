import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  Switch,
  ScrollView,
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

const ProfileVisibility = () => {
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  const [makeDiscoverable, setMakeDiscoverable] = useState(false);
  const [showInSearch, setShowInSearch] = useState(false);
  const [showOnlineStatus, setShowOnlineStatus] = useState(false);

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
          Profile Visibility
        </StyledText>
      </StyledView>

      <StyledScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 30 }}
      >
        {/* Global Visibility Section */}
        <StyledView style={{ marginBottom: 32 }}>
          <StyledText
            style={{
              fontSize: 18,
              fontFamily: FONT.Medium,
              color: "#FFFFFF",
              marginBottom: 10,
            }}
          >
            Global visibility
          </StyledText>

          {/* Make Profile Discoverable Toggle */}
          <StyledView
            style={{
              flexDirection: "row",
              alignItems: "flex-start",
              justifyContent: "space-between",
              marginBottom: 0,
            }}
          >
            <StyledView style={{ flex: 1, marginRight: 16 }}>
              <StyledText
                style={{
                  fontSize: 15,
                  fontFamily: FONT.Regular,
                  color: "#FFFFFF",
                  marginBottom: 0,
                }}
              >
                Make profile discoverable
              </StyledText>
              <StyledText
                style={{
                  fontSize: 13,
                  fontFamily: FONT.Regular,
                  color: "#FCCD34",
                }}
              >
                Make your profile discoverable to others
              </StyledText>
            </StyledView>
            <Switch
              trackColor={{ false: "#19191B", true: "#FCCD34" }}
              thumbColor="#FFFFFF"
              ios_backgroundColor="#19191B"
              onValueChange={setMakeDiscoverable}
              value={makeDiscoverable}
              style={{ marginTop: 4 }}
            />
          </StyledView>
        </StyledView>

        {/* Discoverability Settings Section */}
        <StyledView style={{ marginBottom: 32 }}>
          <StyledText
            style={{
              fontSize: 18,
              fontFamily: FONT.Medium,
              color: "#FFFFFF",
              marginBottom: 10,
            }}
          >
            Discoverability settings
          </StyledText>

          {/* Show Profile in Search Results Toggle */}
          <StyledView
            style={{
              flexDirection: "row",
              alignItems: "flex-start",
              justifyContent: "space-between",
              marginBottom: 8,
            }}
          >
            <StyledView style={{ flex: 1, marginRight: 16 }}>
              <StyledText
                style={{
                  fontSize: 15,
                  fontFamily: FONT.Regular,
                  color: "#FFFFFF",
                  marginBottom: 4,
                }}
              >
                Show profile in search results
              </StyledText>
              <StyledText
                style={{
                  fontSize: 13,
                  fontFamily: FONT.Regular,
                  color: "#FCCD34",
                }}
              >
                Show your profile in search results
              </StyledText>
            </StyledView>
            <Switch
              trackColor={{ false: "#19191B", true: "#FCCD34" }}
              thumbColor="#FFFFFF"
              ios_backgroundColor="#19191B"
              onValueChange={setShowInSearch}
              value={showInSearch}
              style={{ marginTop: 4 }}
            />
          </StyledView>
        </StyledView>

        {/* Current Status Section */}
        <StyledView style={{ marginBottom: 32 }}>
          <StyledText
            style={{
              fontSize: 18,
              fontFamily: FONT.Medium,
              color: "#FFFFFF",
              marginBottom: 10,
            }}
          >
            Current status
          </StyledText>

          {/* Online Status Toggle */}
          <StyledView
            style={{
              flexDirection: "row",
              alignItems: "flex-start",
              justifyContent: "space-between",
              marginBottom: 0,
            }}
          >
            <StyledView style={{ flex: 1, marginRight: 16 }}>
              <StyledText
                style={{
                  fontSize: 15,
                  fontFamily: FONT.Regular,
                  color: "#FFFFFF",
                  marginBottom: 0,
                }}
              >
                Online
              </StyledText>
              <StyledText
                style={{
                  fontSize: 13,
                  fontFamily: FONT.Regular,
                  color: "#FCCD34",
                }}
              >
                Your current status is visible to others
              </StyledText>
            </StyledView>
            <Switch
              trackColor={{ false: "#19191B", true: "#FCCD34" }}
              thumbColor="#FFFFFF"
              ios_backgroundColor="#19191B"
              onValueChange={setShowOnlineStatus}
              value={showOnlineStatus}
              style={{ marginTop: 4 }}
            />
          </StyledView>
        </StyledView>
      </StyledScrollView>

      {/* Save Button */}
      <StyledView
        style={{
          paddingHorizontal: 20,
          paddingBottom: 80,
        }}
      >
        <StyledTouchableOpacity
          style={{
            width: 332,
            height: 45,
            backgroundColor: "#FCCD34",
            borderRadius: 15,
            alignItems: "center",
            justifyContent: "center",
            alignSelf: "center",
          }}
        >
          <StyledText
            style={{
              fontSize: 17,
              fontFamily: FONT.SemiBold,
              color: "#000000",
            }}
          >
            Save changes
          </StyledText>
        </StyledTouchableOpacity>
      </StyledView>
    </StyledSafeAreaView>
  );
};

export default ProfileVisibility;
