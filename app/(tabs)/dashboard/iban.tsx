// app/(auth)/iban.tsx
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

export default function IbanScreen() {
  const [ownerName, setOwnerName] = useState("");
  const [iban, setIban] = useState("");

  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  const handleNext = () => {
    router.push("/(tabs)/dashboard/identity");
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
                onPress={() => router.push("/(tabs)/dashboard/premium-calls")}
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
              Enter your primary IBAN
            </Text>

            {/* Subtitle */}
            <Text
              style={{ fontFamily: FONT.Regular }}
              className="text-[#FFFFFF80] text-[14px] text-center leading-[22px] px-2 mb-8"
            >
              This account will receive your automatic weekly withdrawals.{" "}
              <Text style={{ color: "#FCCD3480" }}>
                You can add up to two more bank accounts later via your
                dashboard Settings.
              </Text>
            </Text>
          </View>

          {/* Form Section */}
          <View className="flex-1 px-6">
            <Text
              style={{ fontFamily: FONT.Medium }}
              className="text-white text-[18px] mb-2"
            >
              Account holder details
            </Text>

            <Text
              style={{ fontFamily: FONT.Regular }}
              className="text-[#FFFFFF80] text-[12px] mb-6"
            >
              Please provide the account holder's details as they appear on the
              bank statement.
            </Text>

            <Text
              style={{ fontFamily: FONT.Medium }}
              className="text-white text-[15px] mb-3"
            >
              IBAN owner name
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
                marginBottom: 24,
              }}
              placeholder="Enter full name"
              placeholderTextColor="#666"
              value={ownerName}
              onChangeText={setOwnerName}
            />

            <Text
              style={{ fontFamily: FONT.Medium }}
              className="text-white text-[15px] mb-3"
            >
              Bank (IBAN)
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
                marginBottom: 12,
              }}
              placeholder="Enter IBAN"
              placeholderTextColor="#666"
              value={iban}
              onChangeText={setIban}
            />

            <Text
              style={{ fontFamily: FONT.Regular }}
              className="text-[#FCCD34] text-[12px]"
            >
              Your bank details are securely encrypted and stored.
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
