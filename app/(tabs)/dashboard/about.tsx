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
} from "react-native";
import { router } from "expo-router";
import { ChevronLeft } from "lucide-react-native";

export default function AboutScreen() {
  const [bio, setBio] = useState("");
  const maxChars = 200;

  const handleNext = () => {
    // Navigate to next screen or save profile
    router.push("/discover");
  };

  const handleSkip = () => {
    router.push("/discover");
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-black"
    >
      <StatusBar barStyle="light-content" />

      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View className="pt-12 px-6">
          <View className="flex-row items-center justify-between mb-10">
            <TouchableOpacity onPress={() => router.back()}>
              <ChevronLeft size={24} color="#fff" />
            </TouchableOpacity>

            {/* Progress Bar */}
            <View className="flex-1 h-1 bg-gray-800 mx-4 rounded-full">
              <View className="w-full h-full bg-[#FCCD34] rounded-full" />
            </View>

            <TouchableOpacity onPress={handleSkip}>
              <Text className="text-white text-[16px] font-medium">Skip</Text>
            </TouchableOpacity>
          </View>

          {/* Title */}
          <Text className="text-white text-[32px] font-bold text-center leading-[38px] mb-3">
            What else do fans{"\n"}know you for?
          </Text>

          {/* Subtitle */}
          <Text className="text-gray-400 text-[15px] text-center leading-[22px] px-2 mb-8">
            Fill out a short bio highlighting your major achievements and unique
            expertise. This description will display prominently and increase
            the rate of paid messages and video calls.
          </Text>
        </View>

        {/* Form Section */}
        <View className="flex-1 px-6">
          <Text className="text-white text-[16px] font-medium mb-3">About</Text>

          <View className="relative">
            <TextInput
              className="bg-[#1A1A1A] rounded-[16px] px-5 py-4 text-white text-[16px] min-h-[180px]"
              placeholder="Type"
              placeholderTextColor="#666"
              multiline
              textAlignVertical="top"
              maxLength={maxChars}
              value={bio}
              onChangeText={setBio}
              style={{
                fontFamily: Platform.OS === "ios" ? "System" : "Roboto",
              }}
            />

            <Text className="absolute bottom-4 right-5 text-gray-500 text-[13px]">
              {bio.length}/{maxChars} Chars...
            </Text>
          </View>
        </View>

        {/* Bottom Button */}
        <View className="px-6 pb-10 pt-6">
          <TouchableOpacity
            className="bg-[#FCCD34] rounded-[20px] py-[18px] items-center justify-center"
            onPress={handleNext}
            activeOpacity={0.8}
          >
            <Text className="text-black text-[18px] font-semibold">Next</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
