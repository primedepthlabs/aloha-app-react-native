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

const PaidMessages = () => {
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  const [isEnabled, setIsEnabled] = useState(true);
  const [price, setPrice] = useState("0.05");

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
          Paid Messaging
        </StyledText>
      </StyledView>

      <StyledView style={{ flex: 1, paddingHorizontal: 20, paddingTop: 30 }}>
        {/* Enable Paid Message Toggle */}
        <StyledView
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 32,
          }}
        >
          <StyledView style={{ flexDirection: "row", alignItems: "center" }}>
            <Image
              source={require("../../../assets/images/dashboard/lock-icon.png")}
              style={{ width: 15, height: 15 }}
            />
            <StyledText
              style={{
                fontSize: 16,
                fontFamily: FONT.Regular,
                color: "#FFFFFF",
                marginLeft: 12,
              }}
            >
              Enable Paid Message
            </StyledText>
          </StyledView>
          <Switch
            trackColor={{ false: "#3E3E40", true: "#FCCD34" }}
            thumbColor="#FFFFFF"
            ios_backgroundColor="#3E3E40"
            onValueChange={setIsEnabled}
            value={isEnabled}
          />
        </StyledView>

        {/* Price Input */}
        <StyledView style={{ marginBottom: 16 }}>
          <StyledText
            style={{
              fontSize: 16,
              fontFamily: FONT.Regular,
              color: "#FFFFFF",
              marginBottom: 16,
            }}
          >
            Price for first 60 characters (GEL)
          </StyledText>
          <StyledTextInput
            style={{
              backgroundColor: "#19191B",
              borderRadius: 15,
              borderWidth: 1,
              borderColor: "#808080",
              height: 48,
              paddingHorizontal: 16,
              fontSize: 16,
              fontFamily: FONT.Regular,
              color: "#6C6C70",
            }}
            value={price}
            onChangeText={setPrice}
            keyboardType="decimal-pad"
            placeholderTextColor="#6C6C70"
          />
        </StyledView>

        {/* Info Text */}
        <StyledView style={{ marginBottom: 24 }}>
          <StyledText
            style={{
              fontSize: 12,
              fontFamily: FONT.Regular,
              color: "#808080",
              lineHeight: 20,
              marginBottom: 12,
            }}
          >
            Users are charged this fee only when you send a reply.
          </StyledText>
          <StyledText
            style={{
              fontSize: 12,
              fontFamily: FONT.Regular,
              color: "#808080",
              lineHeight: 20,
              marginBottom: 12,
            }}
          >
            If you do not reply within 24 hours, the user will be refunded
            automatically.
          </StyledText>
          <StyledText
            style={{
              fontSize: 12,
              fontFamily: FONT.Regular,
              color: "#808080",
              lineHeight: 20,
            }}
          >
            The total charge is calculated based on the length of the user's
            message, capped at the second price point for every 60 characters
            beyond the first.
          </StyledText>
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

export default PaidMessages;
