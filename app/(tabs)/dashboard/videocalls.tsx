import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  TextInput,
  Switch,
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
import Svg, { Path } from "react-native-svg";

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity);
const StyledSafeAreaView = styled(SafeAreaView);
const StyledTextInput = styled(TextInput);

const FONT = {
  Regular: "Poppins_400Regular",
  Medium: "Poppins_500Medium",
  SemiBold: "Poppins_600SemiBold",
  Bold: "Poppins_700Bold",
};

const VideoCalls = () => {
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  const [videoEnabled, setVideoEnabled] = useState(true);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [videoPrice, setVideoPrice] = useState("1.00");
  const [audioPrice, setAudioPrice] = useState("1.00");

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
          Video & Audio Calls
        </StyledText>
      </StyledView>

      <StyledView style={{ flex: 1, paddingHorizontal: 20, paddingTop: 30 }}>
        {/* Video Calls Section */}
        <StyledView style={{ marginBottom: 36 }}>
          <StyledText
            style={{
              fontSize: 18,
              fontFamily: FONT.Medium,
              color: "#FFFFFF",
              marginBottom: 20,
            }}
          >
            Video calls:
          </StyledText>

          {/* Enable Video Calls Toggle */}
          <StyledView
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 24,
            }}
          >
            <StyledView style={{ flexDirection: "row", alignItems: "center" }}>
              <Image
                source={require("../../../assets/images/profile/video-call.png")}
                style={{ width: 38, height: 38 }}
              />
              <StyledText
                style={{
                  fontSize: 15,
                  fontFamily: FONT.Regular,
                  color: "#FFFFFF",
                  marginLeft: 12,
                }}
              >
                Enable paid video calls
              </StyledText>
            </StyledView>
            <Switch
              trackColor={{ false: "#3E3E40", true: "#FCCD34" }}
              thumbColor="#FFFFFF"
              ios_backgroundColor="#3E3E40"
              onValueChange={setVideoEnabled}
              value={videoEnabled}
            />
          </StyledView>

          {/* Video Price Input */}
          <StyledView>
            <StyledText
              style={{
                fontSize: 15,
                fontFamily: FONT.Medium,
                color: "#FFFFFF",
                marginBottom: 12,
              }}
            >
              Price per minute (GEL)
            </StyledText>
            <StyledTextInput
              style={{
                backgroundColor: "#19191B",
                borderRadius: 12,
                height: 48,
                paddingHorizontal: 16,
                fontSize: 16,
                fontFamily: FONT.Regular,
                color: "#6C6C70",
              }}
              value={videoPrice}
              onChangeText={setVideoPrice}
              keyboardType="decimal-pad"
              placeholderTextColor="#6C6C70"
            />
          </StyledView>
        </StyledView>

        {/* Audio Calls Section */}
        <StyledView style={{ marginBottom: 24 }}>
          <StyledText
            style={{
              fontSize: 18,
              fontFamily: FONT.Medium,
              color: "#FFFFFF",
              marginBottom: 20,
            }}
          >
            Audio calls:
          </StyledText>

          {/* Enable Audio Calls Toggle */}
          <StyledView
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 24,
            }}
          >
            <StyledView style={{ flexDirection: "row", alignItems: "center" }}>
              <Image
                source={require("../../../assets/images/dashboard/call.png")}
                style={{ width: 38, height: 38 }}
              />
              <StyledText
                style={{
                  fontSize: 15,
                  fontFamily: FONT.Regular,
                  color: "#FFFFFF",
                  marginLeft: 12,
                }}
              >
                Enable paid audio calls
              </StyledText>
            </StyledView>
            <Switch
              trackColor={{ false: "#3E3E40", true: "#FCCD34" }}
              thumbColor="#FFFFFF"
              ios_backgroundColor="#3E3E40"
              onValueChange={setAudioEnabled}
              value={audioEnabled}
            />
          </StyledView>

          {/* Audio Price Input */}
          <StyledView>
            <StyledText
              style={{
                fontSize: 15,
                fontFamily: FONT.Medium,
                color: "#FFFFFF",
                marginBottom: 12,
              }}
            >
              Price per minute (GEL)
            </StyledText>
            <StyledTextInput
              style={{
                backgroundColor: "#19191B",
                borderRadius: 12,
                height: 48,
                paddingHorizontal: 16,
                fontSize: 16,
                fontFamily: FONT.Regular,
                color: "#6C6C70",
              }}
              value={audioPrice}
              onChangeText={setAudioPrice}
              keyboardType="decimal-pad"
              placeholderTextColor="#6C6C70"
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

export default VideoCalls;
