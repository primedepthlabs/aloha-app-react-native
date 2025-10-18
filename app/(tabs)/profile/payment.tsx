import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Image,
  ActivityIndicator,
} from "react-native";
import { styled } from "nativewind";
import { ChevronLeft, ChevronRight } from "lucide-react-native";
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
const StyledImage = styled(Image);

const FONT = {
  Regular: "Poppins_400Regular",
  Medium: "Poppins_500Medium",
  SemiBold: "Poppins_600SemiBold",
  Bold: "Poppins_700Bold",
};

const PaymentScreen = () => {
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

  const MenuItem = ({ icon, title, onPress }: any) => (
    <StyledTouchableOpacity
      onPress={onPress}
      style={{
        height: 42,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 0,
        marginBottom: 10,
      }}
    >
      <StyledView className="flex-row items-center flex-1">
        <StyledView
          style={{
            width: 40,
            height: 40,
            marginRight: 16,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <StyledImage
            source={icon}
            style={{ width: 24, height: 24 }}
            resizeMode="contain"
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
      </StyledView>
      <ChevronRight size={20} color="#8E8E93" strokeWidth={2} />
    </StyledTouchableOpacity>
  );

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
          <ChevronLeft size={28} color="#FFFFFF" strokeWidth={2} />
        </StyledTouchableOpacity>
        <StyledText
          className="text-white"
          style={{
            fontSize: 20,
            fontFamily: FONT.SemiBold,
          }}
        >
          Payment Settings
        </StyledText>
      </StyledView>

      {/* Menu Items Container */}
      <StyledView
        style={{
          width: 331,
          height: 240,
          top: 30,
          left: 20,
          gap: 10,
        }}
      >
        <MenuItem
          icon={require("../../../assets/images/profile/payment-method.png")}
          title="Payment methods"
          onPress={() => router.push("/(tabs)/profile/payment-method")}
        />
        <MenuItem
          icon={require("../../../assets/images/profile/deposit-history.png")}
          title="Deposit history"
          onPress={() => router.push("/(tabs)/profile/deposit-history")}
        />
        <MenuItem
          icon={require("../../../assets/images/profile/donation-history.png")}
          title="Donation history"
          onPress={() => router.push("/(tabs)/profile/donation-history")}
        />
        <MenuItem
          icon={require("../../../assets/images/profile/message-fee.png")}
          title="Message Fee history"
          onPress={() => router.push("/(tabs)/profile/messagefee-history")}
        />
        <MenuItem
          icon={require("../../../assets/images/profile/video-audiocall.png")}
          title="Audio/Video call history"
          onPress={() => router.push("/(tabs)/profile/call-history")}
        />
      </StyledView>
    </StyledSafeAreaView>
  );
};

export default PaymentScreen;
