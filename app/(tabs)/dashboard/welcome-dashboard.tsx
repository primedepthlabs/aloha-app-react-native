// app/(auth)/welcome-dashboard.tsx
import React from "react";
import { View, Text, TouchableOpacity, Image, StatusBar } from "react-native";
import { router } from "expo-router";
import { ChevronLeft } from "lucide-react-native";

export default function WelcomeDashboard() {
  return (
    <View className="flex-1 bg-black">
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View className="pt-12 px-6">
        <View className="flex-row items-center justify-between mb-10">
          <TouchableOpacity onPress={() => router.back()}>
            <ChevronLeft size={24} color="#fff" />
          </TouchableOpacity>

          {/* Progress Bar */}
          <View className="flex-1 h-1 bg-gray-800 mx-4 rounded-full">
            <View className="w-1/3 h-full bg-[#FCCD34] rounded-full" />
          </View>
        </View>

        {/* Title */}
        <Text className="text-white text-[32px] font-bold text-center leading-[38px] mb-3">
          Welcome Aboard!{"\n"}Time to Start Earning
        </Text>

        {/* Subtitle */}
        <Text className="text-gray-400 text-[15px] text-center leading-[22px] px-4">
          Ready to convert your influence into direct income? Here, you control
          the price: set your fee for personalized messages and video calls
        </Text>
      </View>

      {/* Center Image */}
      <View className="flex-1 items-center justify-center px-6">
        <Image
          source={require("../../../assets/images/dashboard/mask.png")}
          className="w-full h-[420px]"
          resizeMode="contain"
        />
      </View>

      {/* Bottom Button */}
      <View className="px-6 pb-10">
        <TouchableOpacity
          className="bg-[#FCCD34] rounded-[20px] py-[18px] items-center justify-center"
          onPress={() => router.push("/photo")}
          activeOpacity={0.8}
        >
          <Text className="text-black text-[18px] font-semibold">Continue</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
