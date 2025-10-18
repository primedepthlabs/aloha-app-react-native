import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { ChevronLeft } from "lucide-react-native";
import { useRouter } from "expo-router";
import {
  useFonts,
  Poppins_400Regular,
  Poppins_600SemiBold,
  Poppins_700Bold,
} from "@expo-google-fonts/poppins";

interface ChatScreenProps {
  userName?: string;
  userImage?: string;
  isOnline?: boolean;
  initialBalance?: number;
  messageCost?: number;
  onPressCall?: () => void;
}

export default function ChatScreen({
  userName = "Bam Margera",
  userImage = "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100",
  isOnline = true,
  initialBalance = 12,
  messageCost = 0.5,
  onPressCall,
}: ChatScreenProps) {
  const router = useRouter();

  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  if (!fontsLoaded) {
    return (
      <View className="flex-1 items-center justify-center bg-[#0A0A0A]">
        <ActivityIndicator color="#FCCD34" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-[#0A0A0A]"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      {/* Header */}
      <View className="pt-12 px-5 pb-3 border-b border-[#161616]">
        <View className="flex-row items-center justify-between mb-1">
          <View className="flex-row items-center flex-1">
            <TouchableOpacity
              className="p-1 mr-1"
              onPress={() => router.back()}
            >
              <ChevronLeft size={22} color="#fff" />
            </TouchableOpacity>

            <Image
              source={{ uri: userImage }}
              style={{
                width: 48,
                height: 48,
                borderRadius: 24,
                marginRight: 10,
              }}
            />

            <View className="flex-1">
              <Text
                className="text-white text-[18px]"
                style={{ fontFamily: "Poppins_700Bold" }}
              >
                {userName}
              </Text>

              <View className="flex-row items-center mt-1">
                <Text
                  className="text-[#9CA3AF] text-[13px] mr-2"
                  style={{ fontFamily: "Poppins_400Regular" }}
                >
                  Active Now
                </Text>
                {isOnline && (
                  <View className="w-2 h-2 rounded-full bg-[#34D399]" />
                )}
              </View>
            </View>
          </View>
        </View>

        {/* Balance row */}
        <View className="flex-row items-center justify-between mt-2 bg-[#1A1A1A] w-full px-4 py-3 ">
          <View className="flex-row items-center">
            <Text className="text-[18px] mr-1">💰</Text>
            <Text
              className="text-white"
              style={{ fontFamily: "Poppins_400Regular" }}
            >
              Balance: {initialBalance} GEL
            </Text>
          </View>

          <TouchableOpacity className="bg-[#FCCD34] py-2 px-4 rounded-full">
            <Text
              className="font-extrabold text-black"
              style={{ fontFamily: "Poppins_400Regular" }}
            >
              + Add funds
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Welcome Card */}
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: 18,
          paddingBottom: 12,
        }}
      >
        <View className="items-center justify-center pb-5">
          <View className="w-full bg-[#151515] rounded-[18px] py-7 px-5 items-center shadow-lg">
            <View className="w-[60px] h-[60px] rounded-full bg-[#F0C94E22] items-center justify-center mb-3">
              <Image
                source={require("@/assets/images/messageicon.png")}
                style={{ width: 28, height: 28 }}
                resizeMode="contain"
              />
            </View>

            <Text
              className="text-white text-[18px] mb-2"
              style={{ fontFamily: "Poppins_700Bold" }}
            >
              Welcome to Aloha!
            </Text>

            <Text
              className="text-[#9CA3AF] text-[14px] text-center leading-6 mb-4"
              style={{ fontFamily: "Poppins_400Regular" }}
            >
              You can send messages, or start a paid video/audio call with{" "}
              <Text
                style={{ color: "#fff", fontFamily: "Poppins_600SemiBold" }}
              >
                {userName}
              </Text>
              . Each message up to 160 characters costs{" "}
              <Text
                style={{ color: "#fff", fontFamily: "Poppins_600SemiBold" }}
              >
                0.05 ¢
              </Text>
              , longer messages cost{" "}
              <Text
                style={{ color: "#fff", fontFamily: "Poppins_600SemiBold" }}
              >
                0.10 ¢
              </Text>
              . Keep your balance topped up.
            </Text>

            <View className="w-full mt-2">
              <TouchableOpacity
                className="h-[58px] rounded-[14px] mb-3 flex-row items-center justify-center px-4"
                style={{ backgroundColor: "#FCCD34" }}
                onPress={() => router.push("/chatExclusive")}
                activeOpacity={0.9}
              >
                <Image
                  source={require("@/assets/images/message.png")}
                  style={{ width: 22, height: 22, marginRight: 10 }}
                  resizeMode="contain"
                />
                <Text
                  className="text-[16px]"
                  style={{
                    fontFamily: "Poppins_600SemiBold",
                    color: "#111827",
                  }}
                >
                  Send Message
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="h-[58px] rounded-[14px] mb-0 flex-row items-center justify-center px-4"
                style={{ backgroundColor: "#A066FF" }}
                onPress={onPressCall}
                activeOpacity={0.9}
              >
                <Image
                  source={require("@/assets/images/call.png")}
                  style={{ width: 22, height: 22, marginRight: 10 }}
                  resizeMode="contain"
                />
                <Text
                  className="text-[16px]"
                  style={{
                    fontFamily: "Poppins_600SemiBold",
                    color: "#0B0B0B",
                  }}
                >
                  Start Call
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
