// app/(auth)/donations.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { router } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
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

export default function DonationsScreen() {
  const [isEnabled, setIsEnabled] = useState(false);

  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  const handleNext = () => {
    router.push("/(tabs)/dashboard/premium-calls");
  };

  const handleSkip = () => {
    router.push("/(tabs)/dashboard/premium-calls");
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
    <View style={{ flex: 1 }}>
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
                onPress={() => router.push("/(tabs)/dashboard/messages")}
              >
                <ChevronLeft size={24} color="#fff" />
              </TouchableOpacity>

              {/* Progress Bar */}
              <View className="flex-1 h-1 bg-gray-800 mx-4 rounded-full">
                <View className="w-2/4 h-full bg-[#FCCD34] rounded-full" />
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
              Would You Like to{"\n"}Accept Fan Donations?
            </Text>

            {/* Subtitle */}
            <Text
              style={{ fontFamily: FONT.Regular }}
              className="text-[#FFFFFF80] text-[14px] text-center leading-[22px] px-2 mb-12"
            >
              Enable this feature to allow your most dedicated fans to send
              direct tips and financial support, instantly increasing your
              revenue potential.
            </Text>
          </View>

          {/* Toggle Section */}
          {/* Toggle Section */}
          <View className="flex-1 px-6">
            <Text
              style={{ fontFamily: FONT.Medium }}
              className="text-white text-[18px] mb-3"
            >
              Allow users to send donations
            </Text>

            {/* Subtitle + Toggle in One Row */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Text
                style={{ fontFamily: FONT.Regular, flex: 1 }}
                className="text-[#FCCD34] text-[12px] pr-4"
              >
                When enabled, users will see a Donation button on your profile.
              </Text>

              {/* Toggle Switch */}
              <TouchableOpacity
                style={{
                  width: 48,
                  height: 29,
                  borderRadius: 20,
                  backgroundColor: isEnabled ? "#FCCD34" : "#19191B",
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
    </View>
  );
}
