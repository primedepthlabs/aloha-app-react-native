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
import { ChevronLeft, ChevronRight } from "lucide-react-native";
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
    <TouchableOpacity
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
      <View className="flex-row items-center flex-1">
        <View
          style={{
            width: 40,
            height: 40,
            marginRight: 16,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Image
            source={icon}
            style={{ width: 24, height: 24 }}
            resizeMode="contain"
          />
        </View>
        <View className="flex-1">
          <Text
            className="text-white"
            style={{
              fontSize: 16,
              fontFamily: FONT.Regular,
            }}
          >
            {title}
          </Text>
        </View>
      </View>
      <ChevronRight size={20} color="#8E8E93" strokeWidth={2} />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="flex-1 bg-black">
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View
        style={{
          height: 60,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          paddingHorizontal: 20,
          position: "relative",
        }}
      >
        <TouchableOpacity
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
        </TouchableOpacity>
        <Text
          className="text-white"
          style={{
            fontSize: 20,
            fontFamily: FONT.SemiBold,
          }}
        >
          Payment Settings
        </Text>
      </View>

      {/* Menu Items Container */}
      <View
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
      </View>
    </SafeAreaView>
  );
};

export default PaymentScreen;
