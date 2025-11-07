// app/(auth)/photo.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StatusBar,
  Alert,
} from "react-native";
import { router } from "expo-router";
import { ChevronLeft, Plus } from "lucide-react-native";
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";

export default function PhotoScreen() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert(
        "Permission Required",
        "Please grant access to your photo library"
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [3, 4],
      quality: 0.9,
    });

    if (!result.canceled && result.assets?.length) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const handleNext = () => {
    if (!selectedImage) {
      Alert.alert("Photo Required", "Please add your profile photo");
      return;
    }
    router.push("/(tabs)/dashboard/about");
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#000000" }}>
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
        {/* Header */}
        <View className="pt-12 px-6">
          <View className="flex-row items-center justify-between mb-10">
            <TouchableOpacity
              onPress={() => router.push("/(tabs)/dashboard/welcome-dashboard")}
            >
              <ChevronLeft size={24} color="#fff" />
            </TouchableOpacity>

            {/* Progress Bar */}
            <View className="flex-1 h-1 bg-gray-800 mx-4 rounded-full">
              <View className="w-2/3 h-full bg-[#FCCD34] rounded-full" />
            </View>
          </View>

          {/* Title */}
          <Text className="text-white text-[24px] font-bold text-center leading-[38px] mb-3">
            Alright, let's get your{"\n"}glamour shot
          </Text>

          {/* Subtitle */}
          <Text className="text-gray-400 text-[14px] text-center leading-[22px] px-2">
            Your pic on your profile counts. A good, high quality photo will
            increase your chances of receiving orders
          </Text>
        </View>

        {/* Center Photo Placeholder/Image */}
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <TouchableOpacity
            onPress={pickImage}
            activeOpacity={0.7}
            style={{
              width: 206,
              height: 216,
              borderRadius: 15,
              justifyContent: "center",
              alignItems: "center",
              borderWidth: selectedImage ? 3 : 2,
              borderColor: "#FCCD34",
              borderStyle: selectedImage ? "solid" : "dashed",
            }}
          >
            {selectedImage ? (
              <Image
                source={{ uri: selectedImage }}
                style={{
                  width: 206,
                  height: 216,
                  borderRadius: 15,
                }}
                resizeMode="cover"
              />
            ) : (
              <View className="items-center justify-center">
                <View
                  style={{
                    width: 64,
                    height: 64,
                    borderRadius: 32,
                    backgroundColor: "#FCCD34",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Plus size={32} color="#000" strokeWidth={3} />
                </View>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Bottom Text & Button */}
        <View className="px-6 pb-20">
          <Text className="text-gray-400 text-[15px] text-center leading-[22px] mb-6 px-2">
            Your pic on your profile counts. A good, high quality photo will
            increase your chances of receiving orders
          </Text>

          <TouchableOpacity
            className={`w-[332px] h-[48px] rounded-[15px] py-[15px] items-center justify-center ${
              selectedImage ? "bg-[#FCCD34]" : "bg-[#19191B]"
            }`}
            onPress={handleNext}
            activeOpacity={0.8}
          >
            <Text
              className={`text-[18px] font-semibold ${
                selectedImage ? "text-black" : "text-white"
              }`}
            >
              Next
            </Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </View>
  );
}
