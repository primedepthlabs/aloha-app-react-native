// app/name.tsx - Name Screen
import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { ChevronLeft } from "lucide-react-native";

export default function NameScreen() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const handleContinue = () => {
    router.push("/(auth)/photo");
  };
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
          What's Your Name?
        </Text>
        <Text className="text-gray-400 text-base mb-8 text-center">
          Enter your first name and last name
        </Text>

        {/* Name Inputs */}
        <TextInput
          className="bg-black rounded-3xl px-6 py-5 text-white text-lg mb-4 border-2 border-yellow-500"
          placeholder="First name"
          placeholderTextColor="#666"
          value={firstName}
          onChangeText={setFirstName}
        />

        <TextInput
          className="bg-black rounded-3xl px-6 py-5 text-white text-lg mb-5 border-2 border-yellow-500"
          placeholder="Last name"
          placeholderTextColor="#666"
          value={lastName}
          onChangeText={setLastName}
        />

        {/* Continue Button */}
        <TouchableOpacity
          className="bg-[#FCCD34] rounded-2xl py-4 px-8"
          onPress={handleContinue}
        >
          <Text className="text-white text-center text-lg font-semibold">
            Continue
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
