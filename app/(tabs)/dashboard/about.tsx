// app/(auth)/about.tsx
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

export default function AboutScreen() {
  const [bio, setBio] = useState("");
  const maxChars = 200;

  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  const handleNext = () => {
    router.push("/(tabs)/dashboard/messages");
  };

  const handleSkip = () => {
    router.push("/discover");
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
        colors={[
          "#0A0A0A", // very dark gray top
          "#000000", // soft dark middle
          "#1C1B2F", // bluish tone mid-lower
          "#2A1E10", // warm brownish tone lower
          "#3B2A12", // golden brown tint
        ]}
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
                onPress={() => router.push("/(tabs)/dashboard/photo")}
              >
                <ChevronLeft size={24} color="#fff" />
              </TouchableOpacity>

              {/* Progress Bar */}
              <View className="flex-1 h-1 bg-gray-800 mx-4 rounded-full">
                <View className="w-full h-full bg-[#FCCD34] rounded-full" />
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
              What else do fans{"\n"}know you for?
            </Text>

            {/* Subtitle */}
            <Text
              style={{ fontFamily: FONT.Regular }}
              className="text-[#FFFFFF80] text-[14px] text-center leading-[22px] px-2 mb-8"
            >
              Fill out a short bio highlighting your major achievements and
              unique expertise. This description will display prominently and
              increase the rate of paid messages and video calls.
            </Text>
          </View>

          {/* Form Section */}
          <View className="flex-1 px-6">
            <Text
              style={{ fontFamily: FONT.Medium }}
              className="text-white text-[15px] mb-3"
            >
              About
            </Text>

            <View style={{ position: "relative" }}>
              <TextInput
                style={{
                  backgroundColor: "#1A1A1A",
                  borderRadius: 16,
                  paddingHorizontal: 20,
                  paddingVertical: 16,
                  color: "#FFFFFF",
                  fontSize: 16,
                  minHeight: 180,
                  fontFamily: FONT.Regular,
                }}
                placeholder="Type"
                placeholderTextColor="#666"
                multiline
                textAlignVertical="top"
                maxLength={maxChars}
                value={bio}
                onChangeText={setBio}
              />

              <Text
                style={{
                  position: "absolute",
                  right: 20,
                  bottom: 12,
                  color: "#9CA3AF",
                  fontSize: 12,
                  fontFamily: FONT.Regular,
                }}
              >
                {bio.length}/{maxChars} Chars...
              </Text>
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
    </KeyboardAvoidingView>
  );
}
