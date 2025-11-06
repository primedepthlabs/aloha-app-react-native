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
    router.push("/about");
  };

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
            <View className="w-2/3 h-full bg-[#FCCD34] rounded-full" />
          </View>
        </View>

        {/* Title */}
        <Text className="text-white text-[32px] font-bold text-center leading-[38px] mb-3">
          Alright, let's get your{"\n"}glamour shot
        </Text>

        {/* Subtitle */}
        <Text className="text-gray-400 text-[15px] text-center leading-[22px] px-2">
          Your pic on your profile counts. A good, high quality photo will
          increase your chances of receiving orders
        </Text>
      </View>

      {/* Center Photo Placeholder/Image */}
      <View className="flex-1 items-center justify-center px-12">
        <TouchableOpacity
          onPress={pickImage}
          activeOpacity={0.7}
          className="w-full"
          style={{ aspectRatio: 0.75 }}
        >
          {selectedImage ? (
            <Image
              source={{ uri: selectedImage }}
              className="w-full h-full rounded-[24px]"
              style={{ borderWidth: 3, borderColor: "#FCCD34" }}
              resizeMode="cover"
            />
          ) : (
            <View
              className="w-full h-full rounded-[24px] items-center justify-center"
              style={{
                borderWidth: 2,
                borderColor: "#FCCD34",
                borderStyle: "dashed",
              }}
            >
              <View className="w-16 h-16 bg-[#FCCD34] rounded-full items-center justify-center">
                <Plus size={32} color="#000" strokeWidth={3} />
              </View>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Bottom Text & Button */}
      <View className="px-6 pb-10">
        <Text className="text-gray-400 text-[15px] text-center leading-[22px] mb-6 px-2">
          Your pic on your profile counts. A good, high quality photo will
          increase your chances of receiving orders
        </Text>

        <TouchableOpacity
          className={`rounded-[20px] py-[18px] items-center justify-center ${
            selectedImage ? "bg-[#FCCD34]" : "bg-gray-800"
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
    </View>
  );
}
