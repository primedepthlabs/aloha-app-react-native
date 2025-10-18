// app/index.tsx - Onboarding Screen
import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { router } from "expo-router";
import { useFonts } from "expo-font";
import Svg, { Path } from "react-native-svg";

export default function OnboardingScreen() {
  const [fontsLoaded] = useFonts({
    "Raleway-Black": require("../../assets/fonts/Raleway-Black.ttf"),
    "Inter-Regular": require("../../assets/fonts/Inter-Regular.ttf"),
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View className="flex-1 bg-black px-6 justify-between pt-20 pb-12">
      {/* Profile Images - Using home.png which contains the complete design */}
      <View className="flex-[1.2] justify-center items-center">
        <Image
          source={require("../../assets/images/home.png")}
          className="w-full h-full"
          resizeMode="contain"
        />
      </View>

      {/* Bottom Content */}
      <View className="flex-[0.8] justify-center">
        <Text
          className="text-yellow-400 text-5xl text-center mb-6"
          style={{ fontFamily: "Raleway-Black" }}
        >
          Welcome To{"\n"}Aloha
        </Text>
        <Text
          className="text-white text-center text-base px-4 mb-12"
          style={{ fontFamily: "Inter-Regular" }}
        >
          Say hi, share moments, and make{"\n"}every chat special
        </Text>

        {/* Get Started Button */}
        <View className="px-4">
          <TouchableOpacity
            className="bg-yellow-500 rounded-2xl py-3 px-6 flex-row justify-between items-center"
            onPress={() => router.push("/login")}
            activeOpacity={0.8}
          >
            <View className="flex-1" />
            <Text className="text-white text-lg font-semibold">
              Get started
            </Text>
            <View className="flex-1 items-end">
              <View className="w-10 h-10 bg-white/20 rounded-full justify-center items-center border-2 border-white/30">
                <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <Path
                    d="M9 5L16 12L9 19"
                    stroke="#fff"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </Svg>
              </View>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
