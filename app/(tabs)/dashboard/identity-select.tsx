// app/(auth)/identity-select.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  Image,
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

export default function IdentitySelectScreen() {
  const [selectedId, setSelectedId] = useState<string>("id-card");

  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  const handleNext = () => {
    router.push("/(tabs)/dashboard/document");
  };

  const handleSkip = () => {
    router.push("/iban");
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
                onPress={() => router.push("/(tabs)/dashboard/identity")}
              >
                <ChevronLeft size={24} color="#fff" />
              </TouchableOpacity>

              {/* Progress Bar */}
              <View className="flex-1 h-1 bg-gray-800 mx-4 rounded-full">
                <View className="w-1/2 h-full bg-[#FCCD34] rounded-full" />
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
          </View>

          {/* Selection Section */}
          <View className="flex-1 px-6">
            <Text
              style={{ fontFamily: FONT.SemiBold }}
              className="text-white text-[24px] text-center mb-2"
            >
              Select ID type
            </Text>

            <Text
              style={{ fontFamily: FONT.Regular }}
              className="text-white text-[15px] text-center mb-8"
            >
              What method would you prefer to use?
            </Text>

            {/* ID Card Option */}
            <TouchableOpacity
              style={{
                backgroundColor: "#19191B",
                borderRadius: 16,
                paddingHorizontal: 20,
                paddingVertical: 20,
                marginBottom: 16,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                borderWidth: 1,
                borderColor:
                  selectedId === "id-card" ? "#FCCD34" : "transparent",
              }}
              onPress={() => setSelectedId("id-card")}
              activeOpacity={0.8}
            >
              <View className="flex-row items-center">
                <Image
                  source={require("../../../assets/images/dashboard/id.png")}
                  style={{ width: 40, height: 40, marginRight: 16 }}
                  resizeMode="contain"
                />
                <Text
                  style={{ fontFamily: FONT.Medium }}
                  className="text-white text-[18px]"
                >
                  ID card
                </Text>
              </View>
              <View
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: 12,
                  borderWidth: 2,
                  borderColor: selectedId === "id-card" ? "#FCCD34" : "#666",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {selectedId === "id-card" && (
                  <View
                    style={{
                      width: 12,
                      height: 12,
                      borderRadius: 6,
                      backgroundColor: "#FCCD34",
                    }}
                  />
                )}
              </View>
            </TouchableOpacity>

            {/* Passport Option */}
            <TouchableOpacity
              style={{
                backgroundColor: "#19191B",
                borderRadius: 16,
                paddingHorizontal: 20,
                paddingVertical: 20,
                marginBottom: 16,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                borderWidth: 1,
                borderColor:
                  selectedId === "passport" ? "#FCCD34" : "transparent",
              }}
              onPress={() => setSelectedId("passport")}
              activeOpacity={0.8}
            >
              <View className="flex-row items-center">
                <Image
                  source={require("../../../assets/images/dashboard/passport.png")}
                  style={{ width: 40, height: 40, marginRight: 16 }}
                  resizeMode="contain"
                />
                <Text
                  style={{ fontFamily: FONT.Medium }}
                  className="text-white text-[18px]"
                >
                  Passport
                </Text>
              </View>
              <View
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: 12,
                  borderWidth: 2,
                  borderColor: selectedId === "passport" ? "#FCCD34" : "#666",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {selectedId === "passport" && (
                  <View
                    style={{
                      width: 12,
                      height: 12,
                      borderRadius: 6,
                      backgroundColor: "#FCCD34",
                    }}
                  />
                )}
              </View>
            </TouchableOpacity>

            {/* Driver's License Option */}
            <TouchableOpacity
              style={{
                backgroundColor: "#19191B",
                borderRadius: 16,
                paddingHorizontal: 20,
                paddingVertical: 20,
                marginBottom: 16,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                borderWidth: 1,
                borderColor:
                  selectedId === "drivers-license" ? "#FCCD34" : "transparent",
              }}
              onPress={() => setSelectedId("drivers-license")}
              activeOpacity={0.8}
            >
              <View className="flex-row items-center">
                <Image
                  source={require("../../../assets/images/dashboard/license.png")}
                  style={{ width: 40, height: 40, marginRight: 16 }}
                  resizeMode="contain"
                />
                <Text
                  style={{ fontFamily: FONT.Medium }}
                  className="text-white text-[18px]"
                >
                  Driver's license
                </Text>
              </View>
              <View
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: 12,
                  borderWidth: 2,
                  borderColor:
                    selectedId === "drivers-license" ? "#FCCD34" : "#666",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {selectedId === "drivers-license" && (
                  <View
                    style={{
                      width: 12,
                      height: 12,
                      borderRadius: 6,
                      backgroundColor: "#FCCD34",
                    }}
                  />
                )}
              </View>
            </TouchableOpacity>

            {/* Terms Text */}
            <Text
              style={{ fontFamily: FONT.Regular }}
              className="text-[#FFFFFF80] text-[12px] text-center mt-8 px-4"
            >
              Clicking the continue button means that I have read and agreed to
              the{" "}
              <Text style={{ color: "#FCCD34" }}>
                user identity authentication information statement
              </Text>
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
