// app/gender.tsx - Gender Screen
import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { ChevronLeft } from "lucide-react-native";

export default function GenderScreen() {
  const [selectedGender, setSelectedGender] = useState("Woman");

  return (
    <View className="flex-1 bg-black px-6 py-12">
      {/* Header */}
      <View className="flex-row items-center mb-12">
        <TouchableOpacity onPress={() => router.back()}>
          <ChevronLeft size={24} color="#fff" />
        </TouchableOpacity>
        <View className="flex-1 h-1 bg-gray-800 mx-4 rounded-full">
          <View className="w-2/3 h-full bg-yellow-500 rounded-full" />
        </View>
      </View>

      {/* Content */}
      <View className="flex-1">
        <Text className="text-white text-3xl font-bold mb-2 text-center">
          What's Your Gender?
        </Text>
        <Text className="text-gray-400 text-base mb-8 text-center">
          Enter your gender
        </Text>

        {/* Gender Options */}
        <TouchableOpacity
          className={`rounded-2xl py-5 px-6 mb-4 ${
            selectedGender === "Woman"
              ? "border-2 border-yellow-500 bg-gray-900"
              : "bg-gray-900"
          }`}
          onPress={() => setSelectedGender("Woman")}
        >
          <Text className="text-white text-lg">Woman</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className={`rounded-2xl py-5 px-6 mb-4 ${
            selectedGender === "Man"
              ? "border-2 border-yellow-500 bg-gray-900"
              : "bg-gray-900"
          }`}
          onPress={() => setSelectedGender("Man")}
        >
          <Text className="text-white text-lg">Man</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className={`rounded-2xl py-5 px-6 mb-8 ${
            selectedGender === "Other"
              ? "border-2 border-yellow-500 bg-gray-900"
              : "bg-gray-900"
          }`}
          onPress={() => setSelectedGender("Other")}
        >
          <Text className="text-white text-lg">Other</Text>
        </TouchableOpacity>

        {/* Continue Button */}
        <TouchableOpacity
          className="bg-[#FCCD34] rounded-2xl py-4 px-8"
          onPress={() => router.push("/name")}
        >
          <Text className="text-white text-center text-lg font-semibold">
            Continue
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
