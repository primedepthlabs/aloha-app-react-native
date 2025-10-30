import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  Switch,
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

const FONT = {
  Regular: "Poppins_400Regular",
  Medium: "Poppins_500Medium",
  SemiBold: "Poppins_600SemiBold",
  Bold: "Poppins_700Bold",
};

const Donation = () => {
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  const [isEnabled, setIsEnabled] = useState(false);

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
          Donation Settings
        </StyledText>
      </StyledView>

      <StyledView style={{ flex: 1, paddingHorizontal: 20, paddingTop: 30 }}>
        {/* Allow Donations Section */}
        <StyledView style={{ marginBottom: 32 }}>
          <StyledText
            style={{
              fontSize: 18,
              fontFamily: FONT.Medium,
              color: "#FFFFFF",
              marginBottom: 10,
            }}
          >
            Allow users to send donations
          </StyledText>
          <StyledView
            style={{
              flexDirection: "row",
              alignItems: "flex-start",
              justifyContent: "space-between",
            }}
          >
            <StyledView style={{ flex: 1, marginRight: 16 }}>
              <StyledText
                style={{
                  fontSize: 12,
                  fontFamily: FONT.Regular,
                  color: "#FCCD34",
                  lineHeight: 20,
                }}
              >
                When enabled, users will see a Donation button on your profile.
              </StyledText>
            </StyledView>
            <Switch
              trackColor={{ false: "#19191B", true: "#FCCD34" }}
              thumbColor="#FFFFFF"
              ios_backgroundColor="#19191B"
              onValueChange={setIsEnabled}
              value={isEnabled}
            />
          </StyledView>
        </StyledView>
      </StyledView>

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

export default Donation;
