import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  Dimensions,
  Image,
} from "react-native";
import { styled } from "nativewind";
import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
} from "@expo-google-fonts/poppins";
import { useRouter } from "expo-router";

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

const SCREEN_WIDTH = Dimensions.get("window").width;

type SuccessScreenType = "pending" | "live";

const SuccessScreen = () => {
  const router = useRouter();
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  // Change this to "live" to see the other screen
  const [screenType] = useState<SuccessScreenType>("pending");

  if (!fontsLoaded) {
    return (
      <View className="flex-1 items-center justify-center bg-black">
        <ActivityIndicator color="#FCCD34" />
      </View>
    );
  }

  const handleButtonPress = () => {
    // Navigate to dashboard
    router.push("/dashboard");
  };

  return (
    <StyledSafeAreaView className="flex-1 bg-black">
      <StatusBar barStyle="light-content" />

      <StyledView
        style={{
          flex: 1,
          backgroundColor: "#000000",
          alignItems: "center",
          justifyContent: "center",
          paddingHorizontal: 24,
        }}
      >
        <StyledView style={{ alignItems: "center", width: "100%" }}>
          {/* Success Icon */}
          <StyledView
            style={{
              width: 120,
              height: 120,
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 32,
            }}
          >
            {/* Yellow glow circle with checkmark */}
            <StyledView
              style={{
                width: 120,
                height: 120,
                borderRadius: 60,
                backgroundColor: "#FCCD34",
                alignItems: "center",
                justifyContent: "center",
                shadowColor: "#FCCD34",
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: 0.8,
                shadowRadius: 40,
                elevation: 20,
              }}
            >
              <StyledView
                style={{
                  width: 100,
                  height: 100,
                  borderRadius: 50,
                  backgroundColor: "#FCCD34",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <StyledText
                  style={{
                    fontSize: 60,
                    color: "#FFFFFF",
                    fontFamily: FONT.Bold,
                  }}
                >
                  ✓
                </StyledText>
              </StyledView>
            </StyledView>
          </StyledView>

          {screenType === "pending" ? (
            <>
              {/* Title - Pending */}
              <StyledText
                style={{
                  fontSize: 28,
                  fontFamily: FONT.Bold,
                  color: "#FFFFFF",
                  marginBottom: 16,
                  textAlign: "center",
                  lineHeight: 36,
                }}
              >
                Almost There! Activate{"\n"}Your Revenue Stream!
              </StyledText>

              {/* Description - Pending */}
              <StyledText
                style={{
                  fontSize: 14,
                  fontFamily: FONT.Regular,
                  color: "rgba(255, 255, 255, 0.6)",
                  textAlign: "center",
                  lineHeight: 24,
                  marginBottom: 48,
                }}
              >
                Congratulations! Your ID document has been securely uploaded. We
                are performing the final background checks to ensure compliance
                and security for your future payouts. The final review typically
                takes *less than 48 hours*. We will notify you when your profile
                is live and you can start setting rates and earning.
              </StyledText>

              {/* Button - Pending */}
              <StyledTouchableOpacity
                onPress={handleButtonPress}
                style={{
                  backgroundColor: "#FCCD34",
                  alignItems: "center",
                  justifyContent: "center",
                  width: SCREEN_WIDTH - 48,
                  height: 48,
                  borderRadius: 15,
                }}
              >
                <StyledText
                  style={{
                    fontSize: 18,
                    fontFamily: FONT.SemiBold,
                    color: "#000000",
                  }}
                >
                  View my pending dashboard
                </StyledText>
              </StyledTouchableOpacity>
            </>
          ) : (
            <>
              {/* Title - Live */}
              <StyledText
                style={{
                  fontSize: 28,
                  fontFamily: FONT.Bold,
                  color: "#FFFFFF",
                  marginBottom: 16,
                  textAlign: "center",
                  lineHeight: 36,
                }}
              >
                Congratulations! Your{"\n"}Profile is LIVE
              </StyledText>

              {/* Description - Live */}
              <StyledText
                style={{
                  fontSize: 14,
                  fontFamily: FONT.Regular,
                  color: "rgba(255, 255, 255, 0.6)",
                  textAlign: "center",
                  lineHeight: 24,
                  marginBottom: 48,
                }}
              >
                Identity verification successful! Your talent profile is now
                approved and all monetization features are activated. You can
                now set your final rates and start earning immediately.
              </StyledText>

              {/* Button - Live */}
              <StyledTouchableOpacity
                onPress={handleButtonPress}
                style={{
                  backgroundColor: "#FCCD34",
                  alignItems: "center",
                  justifyContent: "center",
                  width: SCREEN_WIDTH - 48,
                  height: 48,
                  borderRadius: 15,
                }}
              >
                <StyledText
                  style={{
                    fontSize: 18,
                    fontFamily: FONT.SemiBold,
                    color: "#000000",
                  }}
                >
                  Go to my dashboard
                </StyledText>
              </StyledTouchableOpacity>
            </>
          )}
        </StyledView>
      </StyledView>
    </StyledSafeAreaView>
  );
};

export default SuccessScreen;
