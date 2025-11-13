// app/(auth)/paid-message.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { router } from "expo-router";
import { ChevronLeft, Lock } from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";

import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
} from "@expo-google-fonts/poppins";

const FONT = {
  Regular: "Poppins_400Regular",
  Medium: "Poppins_500Medium",
  SemiBold: "Poppins_600SemiBold",
  Bold: "Poppins_700Bold",
};

export default function PaidMessageScreen() {
  const [price, setPrice] = useState("0.50");
  const [isEnabled, setIsEnabled] = useState(true);

  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  const handleNext = () => {
    router.push("/(tabs)/dashboard/fan-donation");
  };

  const handleSkip = () => {
    router.push("/(tabs)/dashboard/fan-donation");
  };

  const isValidPrice = () => {
    const numPrice = parseFloat(price);
    return numPrice >= 0.5 && numPrice <= 100;
  };

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, backgroundColor: "#000" }}>
        <StatusBar barStyle="light-content" />
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <ActivityIndicator size="large" color="#FCCD34" />
        </View>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <StatusBar barStyle="light-content" />

      <LinearGradient
        colors={["#0A0A0A", "#000000", "#1C1B2F", "#2A1E10", "#3B2A12"]}
        locations={[0, 0.25, 0.5, 0.75, 1]}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View className="pt-12 px-6">
            <View className="flex-row items-center justify-between mb-10">
              <TouchableOpacity
                onPress={() => router.push("/(tabs)/dashboard/about")}
              >
                <ChevronLeft size={24} color="#fff" />
              </TouchableOpacity>

              {/* Progress Bar */}
              <View className="flex-1 h-1 bg-gray-800 mx-4 rounded-full">
                <View className="w-1/4 h-full bg-[#FCCD34] rounded-full" />
              </View>

              <TouchableOpacity onPress={handleSkip}>
                <Text
                  style={{ fontFamily: FONT.Medium }}
                  className="text-white text-[16px]"
                >
                  Skip
                </Text>
              </TouchableOpacity>
            </View>

            {/* Title */}
            <Text
              style={{ fontFamily: FONT.SemiBold }}
              className="text-white text-[24px] text-center leading-[38px] mb-3"
            >
              Set Your Paid{"\n"}Message Rate
            </Text>

            {/* Subtitle */}
            <Text
              style={{ fontFamily: FONT.Regular }}
              className="text-[#FFFFFF80] text-[14px] text-center leading-[22px] px-2 mb-8"
            >
              Set your premium rate. This ensures your private chat becomes an
              efficient monetization channel.{" "}
              <Text style={{ color: "#FBCC3480" }}>
                You can adjust this price anytime from your dashboard Settings
              </Text>
            </Text>
          </View>

          {/* Form Section */}
          <View className="flex-1 px-6">
            {/* Enable Toggle */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 32,
              }}
            >
              <Lock size={20} color="#fff" style={{ marginRight: 12 }} />
              <Text
                style={{ fontFamily: FONT.Regular, flex: 1 }}
                className="text-white text-[15px]"
              >
                Enable Paid Message
              </Text>
              <TouchableOpacity
                style={{
                  width: 48,
                  height: 29,
                  borderRadius: 20,
                  backgroundColor: isEnabled ? "#FCCD34" : "#4B5563",
                  justifyContent: "center",
                  padding: 2,
                }}
                onPress={() => setIsEnabled(!isEnabled)}
                activeOpacity={0.8}
              >
                <View
                  style={{
                    width: 27,
                    height: 27,
                    borderRadius: 13.5,
                    backgroundColor: "#fff",
                    alignSelf: isEnabled ? "flex-end" : "flex-start",
                  }}
                />
              </TouchableOpacity>
            </View>

            {/* Price Input */}
            <Text
              style={{ fontFamily: FONT.Medium }}
              className="text-white text-[15px] mb-3"
            >
              Price for first 60 characters (GEL)
            </Text>

            <View style={{ marginBottom: 12 }}>
              <TextInput
                style={{
                  backgroundColor: "#19191B",
                  borderRadius: 16,
                  paddingHorizontal: 20,
                  paddingVertical: 16,
                  color: "#808080",
                  fontSize: 16,
                  fontFamily: FONT.Regular,
                  borderWidth: !isValidPrice() ? 1 : 0,
                  borderColor: !isValidPrice() ? "#EF4444" : "transparent",
                }}
                placeholder="0.50"
                placeholderTextColor="#666"
                keyboardType="decimal-pad"
                value={price}
                onChangeText={setPrice}
              />
            </View>

            {/* Info Text */}
            <Text
              style={{
                fontFamily: FONT.Regular,
                color: !isValidPrice() ? "#EF4444" : "#FCCD34",
                fontSize: 12,
                marginBottom: 8,
              }}
            >
              {!isValidPrice()
                ? "The minimum fee is 0.50 GEL"
                : "The minimum fee is 0.50 GEL. Maximum-100GEL"}
            </Text>

            <Text
              style={{ fontFamily: FONT.Regular }}
              className="text-[#9CA3AF] text-[12px] mb-2"
            >
              Users are charged this fee only when you send a reply.
            </Text>

            <Text
              style={{ fontFamily: FONT.Regular }}
              className="text-[#9CA3AF] text-[12px]"
            >
              If you do not reply within 24 hours, the user will be refunded
              automatically.
            </Text>
          </View>

          {/* Bottom Button */}
          <View className="px-6 pb-20 pt-6 items-center">
            <TouchableOpacity
              style={{
                backgroundColor: "#FCCD34",
                width: 332,
                height: 48,
                borderRadius: 15,
                alignItems: "center",
                justifyContent: "center",
              }}
              onPress={handleNext}
              activeOpacity={0.8}
            >
              <Text
                style={{
                  fontSize: 18,
                  fontFamily: FONT.SemiBold,
                  color: "#000",
                }}
              >
                Next
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
}
