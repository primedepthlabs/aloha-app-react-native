// app/photo.tsx - Photo Upload Screen
import React, { useState } from "react";
import { View, Text, TouchableOpacity, Image, ScrollView } from "react-native";
import { router } from "expo-router";
import { ChevronLeft, Plus, X } from "lucide-react-native";
import * as ImagePicker from "expo-image-picker";

interface PhotoSlot {
  id: number;
  uri: string | null;
  size: "large" | "medium" | "small";
}

export default function PhotoUploadScreen() {
  const [photos, setPhotos] = useState<PhotoSlot[]>([
    { id: 1, uri: null, size: "large" },
    { id: 2, uri: null, size: "medium" },
    { id: 3, uri: null, size: "medium" },
    { id: 4, uri: null, size: "small" },
    { id: 5, uri: null, size: "small" },
    { id: 6, uri: null, size: "small" },
  ]);

  const pickImage = async (id: number) => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setPhotos(
        photos.map((photo) =>
          photo.id === id ? { ...photo, uri: result.assets[0].uri } : photo
        )
      );
    }
  };

  const removeImage = (id: number) => {
    setPhotos(
      photos.map((photo) => (photo.id === id ? { ...photo, uri: null } : photo))
    );
  };

  const handleContinue = () => {
    router.replace("/discover");
  };

  const handleSkip = () => {
    router.replace("/(tabs)");
  };

  return (
    <View className="flex-1 bg-black px-6 py-12">
      {/* Header */}
      <View className="flex-row items-center mb-8">
        <TouchableOpacity onPress={() => router.back()}>
          <ChevronLeft size={24} color="#fff" />
        </TouchableOpacity>
        <View className="flex-1 h-1 bg-gray-800 mx-4 rounded-full">
          <View className="w-full h-full bg-yellow-500 rounded-full" />
        </View>
      </View>

      {/* Title */}
      <Text className="text-white text-3xl font-bold mb-2 text-center">
        Upload Your Photo
      </Text>
      <Text className="text-gray-400 text-base mb-6 text-center">
        Lorem ipsum dolor sit amet
      </Text>

      <View className="flex-1">
        {/* Content Container */}
        <View className="flex-1 justify-between">
          {/* Photo Grid */}
          <View className="mb-4">
            {/* Row 1: Large + 2 Medium */}
            <View className="flex-row mb-3" style={{ height: 240 }}>
              {/* Left Column - Large Photo */}
              <View className="flex-[1.4] mr-3">
                <TouchableOpacity
                  className="flex-1"
                  onPress={() => pickImage(1)}
                >
                  {photos[0].uri ? (
                    <View className="relative w-full h-full">
                      <Image
                        source={{ uri: photos[0].uri }}
                        className="w-full h-full rounded-3xl"
                        resizeMode="cover"
                      />
                      <TouchableOpacity
                        className="absolute top-2 right-2 w-8 h-8 bg-gray-900/80 rounded-full items-center justify-center"
                        onPress={() => removeImage(1)}
                      >
                        <X size={20} color="#fff" />
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <View className="w-full h-full border-2 border-dashed border-yellow-500 rounded-3xl items-center justify-center">
                      <View className="w-16 h-16 bg-yellow-500 rounded-full items-center justify-center">
                        <Plus size={32} color="#000" strokeWidth={3} />
                      </View>
                    </View>
                  )}
                </TouchableOpacity>
              </View>

              {/* Right Column - 2 Medium */}
              <View className="flex-1">
                {/* Medium Photo 1 */}
                <TouchableOpacity
                  className="mb-3 flex-1"
                  onPress={() => pickImage(2)}
                >
                  {photos[1].uri ? (
                    <View className="relative w-full h-full">
                      <Image
                        source={{ uri: photos[1].uri }}
                        className="w-full h-full rounded-3xl"
                        resizeMode="cover"
                      />
                      <TouchableOpacity
                        className="absolute top-2 right-2 w-8 h-8 bg-gray-900/80 rounded-full items-center justify-center"
                        onPress={() => removeImage(2)}
                      >
                        <X size={20} color="#fff" />
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <View className="w-full h-full border-2 border-dashed border-yellow-500 rounded-3xl items-center justify-center">
                      <View className="w-12 h-12 bg-yellow-500 rounded-full items-center justify-center">
                        <Plus size={24} color="#000" strokeWidth={3} />
                      </View>
                    </View>
                  )}
                </TouchableOpacity>

                {/* Medium Photo 2 */}
                <TouchableOpacity
                  className="flex-1"
                  onPress={() => pickImage(3)}
                >
                  {photos[2].uri ? (
                    <View className="relative w-full h-full">
                      <Image
                        source={{ uri: photos[2].uri }}
                        className="w-full h-full rounded-3xl"
                        resizeMode="cover"
                      />
                      <TouchableOpacity
                        className="absolute top-2 right-2 w-8 h-8 bg-gray-900/80 rounded-full items-center justify-center"
                        onPress={() => removeImage(3)}
                      >
                        <X size={20} color="#fff" />
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <View className="w-full h-full border-2 border-dashed border-yellow-500 rounded-3xl items-center justify-center">
                      <View className="w-12 h-12 bg-yellow-500 rounded-full items-center justify-center">
                        <Plus size={24} color="#000" strokeWidth={3} />
                      </View>
                    </View>
                  )}
                </TouchableOpacity>
              </View>
            </View>

            {/* Row 2: 3 Small Photos */}
            <View className="flex-row" style={{ height: 115 }}>
              {[4, 5, 6].map((index) => (
                <TouchableOpacity
                  key={index}
                  className="flex-1 mx-1.5"
                  onPress={() => pickImage(index)}
                >
                  {photos[index - 1].uri ? (
                    <View className="relative w-full h-full">
                      <Image
                        source={{ uri: photos[index - 1].uri }}
                        className="w-full h-full rounded-3xl"
                        resizeMode="cover"
                      />
                      <TouchableOpacity
                        className="absolute top-2 right-2 w-8 h-8 bg-gray-900/80 rounded-full items-center justify-center"
                        onPress={() => removeImage(index)}
                      >
                        <X size={20} color="#fff" />
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <View className="w-full h-full border-2 border-dashed border-yellow-500 rounded-3xl items-center justify-center">
                      <View className="w-12 h-12 bg-yellow-500 rounded-full items-center justify-center">
                        <Plus size={24} color="#000" strokeWidth={3} />
                      </View>
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Buttons Container */}
          <View>
            {/* Continue Button */}
            <TouchableOpacity
              className="bg-[#FCCD34] rounded-2xl py-4 px-8 mb-4"
              onPress={handleContinue}
            >
              <Text className="text-white text-center text-lg font-semibold">
                Continue
              </Text>
            </TouchableOpacity>

            {/* Skip Button */}
            <TouchableOpacity
              className="bg-gray-800 rounded-2xl py-4 px-8"
              onPress={handleSkip}
            >
              <Text className="text-white text-center text-lg font-semibold">
                Skip
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}
