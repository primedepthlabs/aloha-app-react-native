// app/(auth)/premium-calls.tsx
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
import { ChevronLeft, Video, Phone } from "lucide-react-native";
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

export default function PremiumCallsScreen() {
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [videoPrice, setVideoPrice] = useState("1.00");
  const [audioPrice, setAudioPrice] = useState("1.00");

  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  const handleNext = () => {
    router.push("/(tabs)/dashboard/iban");
  };

  const handleSkip = () => {
    router.push("/(tabs)/dashboard/iban");
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
                onPress={() => router.push("/(tabs)/dashboard/fan-donation")}
              >
                <ChevronLeft size={24} color="#fff" />
              </TouchableOpacity>

              {/* Progress Bar */}
              <View className="flex-1 h-1 bg-gray-800 mx-4 rounded-full">
                <View className="w-3/4 h-full bg-[#FCCD34] rounded-full" />
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
              Set Your Premium Call{"\n"}Rates (Per Minute)
            </Text>

            {/* Subtitle */}
            <Text
              style={{ fontFamily: FONT.Regular }}
              className="text-[#FFFFFF80] text-[14px] text-center leading-[22px] px-2 mb-8"
            >
              Monetize your time efficiently. Set your per-minute rates for live
              video and audio calls.{" "}
              <Text style={{ color: "#FCCD3480" }}>
                You can adjust these prices anytime from your Settings.
              </Text>
            </Text>
          </View>

          {/* Form Section */}
          <View className="flex-1 px-6">
            {/* Video Calls */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 16,
              }}
            >
              <Video size={20} color="#fff" style={{ marginRight: 12 }} />
              <Text
                style={{ fontFamily: FONT.Regular, flex: 1 }}
                className="text-white text-[15px]"
              >
                Enable paid video calls
              </Text>
              <TouchableOpacity
                style={{
                  width: 48,
                  height: 29,
                  borderRadius: 20,
                  backgroundColor: videoEnabled ? "#FCCD34" : "#4B5563",
                  justifyContent: "center",
                  padding: 2,
                }}
                onPress={() => setVideoEnabled(!videoEnabled)}
                activeOpacity={0.8}
              >
                <View
                  style={{
                    width: 27,
                    height: 27,
                    borderRadius: 13.5,
                    backgroundColor: "#fff",
                    alignSelf: videoEnabled ? "flex-end" : "flex-start",
                  }}
                />
              </TouchableOpacity>
            </View>

            <Text
              style={{ fontFamily: FONT.Medium }}
              className="text-white text-[15px] mb-3"
            >
              Price per minute (GEL)
            </Text>

            <TextInput
              style={{
                backgroundColor: "#19191B",
                borderRadius: 16,
                paddingHorizontal: 20,
                paddingVertical: 16,
                color: "#808080",
                fontSize: 16,
                fontFamily: FONT.Regular,
                marginBottom: 32,
              }}
              placeholder="1.00"
              placeholderTextColor="#666"
              keyboardType="decimal-pad"
              value={videoPrice}
              onChangeText={setVideoPrice}
            />

            {/* Divider */}
            <View
              style={{
                height: 1,
                backgroundColor: "#333",
                marginBottom: 32,
              }}
            />

            {/* Audio Calls */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 16,
              }}
            >
              <Phone size={20} color="#fff" style={{ marginRight: 12 }} />
              <Text
                style={{ fontFamily: FONT.Regular, flex: 1 }}
                className="text-white text-[15px]"
              >
                Enable paid audio calls
              </Text>
              <TouchableOpacity
                style={{
                  width: 48,
                  height: 29,
                  borderRadius: 20,
                  backgroundColor: audioEnabled ? "#FCCD34" : "#4B5563",
                  justifyContent: "center",
                  padding: 2,
                }}
                onPress={() => setAudioEnabled(!audioEnabled)}
                activeOpacity={0.8}
              >
                <View
                  style={{
                    width: 27,
                    height: 27,
                    borderRadius: 13.5,
                    backgroundColor: "#fff",
                    alignSelf: audioEnabled ? "flex-end" : "flex-start",
                  }}
                />
              </TouchableOpacity>
            </View>

            <Text
              style={{ fontFamily: FONT.Medium }}
              className="text-white text-[15px] mb-3"
            >
              Price per minute (GEL)
            </Text>

            <TextInput
              style={{
                backgroundColor: "#19191B",
                borderRadius: 16,
                paddingHorizontal: 20,
                paddingVertical: 16,
                color: "#808080",
                fontSize: 16,
                fontFamily: FONT.Regular,
              }}
              placeholder="1.00"
              placeholderTextColor="#666"
              keyboardType="decimal-pad"
              value={audioPrice}
              onChangeText={setAudioPrice}
            />
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
