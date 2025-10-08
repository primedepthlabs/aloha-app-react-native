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
  TextInput,
} from "react-native";
import { ChevronLeft, Phone, Video, Plus } from "lucide-react-native";
import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
} from "@expo-google-fonts/poppins";
import { useRouter } from "expo-router";

interface ChatExclusiveScreenProps {
  userName?: string;
  userImage?: string;
  isOnline?: boolean;
  initialBalance?: number;
  messageCost?: number;
  onPressBack?: () => void;
  onPressSendDonation?: () => void;
  onPressSupportCharity?: () => void;
  onPressUnlockResponses?: () => void;
  onSendMessage?: (message: string) => void;
}

export default function ChatExclusiveScreen({
  userName = "Bam Margera",
  userImage = "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100",
  isOnline = true,
  initialBalance = 12,
  messageCost = 0.5,
  onPressBack,
  onPressSendDonation,
  onPressSupportCharity,
  onPressUnlockResponses,
  onSendMessage,
}: ChatExclusiveScreenProps) {
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });
  const router = useRouter();
  const [messageText, setMessageText] = React.useState("");

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
      keyboardVerticalOffset={0}
    >
      {/* Header */}
      <View className="pt-12 px-5 pb-3">
        <View className="flex-row items-center justify-between mb-3">
          <View className="flex-row items-center flex-1">
            <TouchableOpacity className="mr-2" onPress={() => router.back()}>
              <ChevronLeft size={24} color="#fff" />
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
                style={{ fontFamily: "Poppins_600SemiBold" }}
              >
                {userName}
              </Text>

              <View className="flex-row items-center mt-0.5">
                <Text
                  className="text-[#9CA3AF] text-[13px] mr-1.5"
                  style={{ fontFamily: "Poppins_400Regular" }}
                >
                  Active Now
                </Text>
                {isOnline && (
                  <View className="w-2 h-2 rounded-full bg-[#10B981]" />
                )}
              </View>
            </View>
          </View>

          <View className="flex-row items-center">
            <TouchableOpacity className="mr-7">
              <Phone size={20} color="#ffffff" fill="#ffffff" />
            </TouchableOpacity>
            <TouchableOpacity>
              <Video size={22} color="#ffffff" fill="#ffffff" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Balance row with divider line */}
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

      {/* Content */}
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: 20,
          paddingBottom: 90,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Welcome Card */}
        <View className="items-center mb-5">
          <View className="w-[40px] h-[40px] items-center justify-center mb-2">
            <Image
              source={require("../../assets/images/chaticon.png")}
              style={{ width: 30, height: 20 }}
            />
          </View>

          <Text
            className="text-white text-[15px] mb-3"
            style={{ fontFamily: "Poppins_700Bold" }}
          >
            Welcome!
          </Text>

          <View className="bg-[#1A1A1A] rounded-2xl py-4 px-4 w-full">
            <Text
              className="text-[#B8B8B8] text-[13px] text-center leading-5"
              style={{ fontFamily: "Poppins_400Regular" }}
            >
              You can send messages, or start a paid video/audio call with{" "}
              <Text style={{ color: "#fff", fontFamily: "Poppins_500Medium" }}>
                {userName}
              </Text>
              . Each message up to 160 characters costs{" "}
              <Text style={{ color: "#fff", fontFamily: "Poppins_500Medium" }}>
                0.05 ¢
              </Text>
              , longer messages cost{" "}
              <Text style={{ color: "#fff", fontFamily: "Poppins_500Medium" }}>
                0.10 ¢
              </Text>
              . Keep your balance topped up.
            </Text>
          </View>
        </View>

        {/* Exclusive Access Section */}
        <View className="items-center mb-4">
          <View className="w-[44px] h-[44px] items-center justify-center mb-2.5">
            <Image
              source={require("../../assets/images/lock.png")}
              style={{ width: 30, height: 30 }}
            />
          </View>

          <Text
            className="text-white text-[15px] mb-4"
            style={{ fontFamily: "Poppins_700Bold" }}
          >
            Exclusive Access
          </Text>
        </View>

        {/* Action Buttons */}
        <View className="w-full">
          <TouchableOpacity
            className="bg-[#1A1A1A] rounded-xl py-3.5 px-4 mb-3"
            onPress={onPressSendDonation}
            activeOpacity={0.7}
          >
            <Text
              className="text-[#C4C4C4] text-[14px] text-center"
              style={{ fontFamily: "Poppins_400Regular" }}
            >
              Send a donation
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="bg-[#1A1A1A] rounded-xl py-3.5 px-4 mb-3"
            onPress={onPressSupportCharity}
            activeOpacity={0.7}
          >
            <Text
              className="text-[#C4C4C4] text-[14px] text-center"
              style={{ fontFamily: "Poppins_400Regular" }}
            >
              Support a charity chosen by {userName}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="bg-[#1A1A1A] rounded-xl py-3.5 px-4"
            onPress={onPressUnlockResponses}
            activeOpacity={0.7}
          >
            <Text
              className="text-[#C4C4C4] text-[14px] text-center"
              style={{ fontFamily: "Poppins_400Regular" }}
            >
              Unlock exclusive responses
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Message Input - Fixed at bottom */}
      <View className="absolute bottom-0 left-0 right-0 bg-[#0A0A0A] px-5 py-3 pb-6">
        <View className="flex-row items-center justify-center">
          {/* + Button */}
          <TouchableOpacity
            className="w-10 h-10 rounded-full bg-[#1A1A1A] items-center justify-center mr-2.5"
            activeOpacity={0.8}
          >
            <Text className="text-white text-2xl font-bold">+</Text>
          </TouchableOpacity>

          {/* Message Input with Send Icon Inside */}
          <View className="flex-1 bg-[#1A1A1A] rounded-full flex-row items-center px-4">
            <TextInput
              className="flex-1 text-white text-[14px]"
              placeholder={`Type your message (${messageCost} Gel)`}
              placeholderTextColor="#9CA3AF"
              value={messageText}
              onChangeText={setMessageText}
              style={{
                fontFamily: "Poppins_400Regular",
                paddingVertical: 15,
              }}
            />

            {/* Send Button Inside Input */}
            <TouchableOpacity
              className="w-8 h-8 rounded-full bg-[#FCCD34] items-center justify-center"
              onPress={() => {
                if (onSendMessage && messageText.trim()) {
                  onSendMessage(messageText);
                  setMessageText("");
                }
              }}
              activeOpacity={0.8}
            >
              <Image
                source={require("../../assets/images/Right.png")}
                style={{ width: 16, height: 16, resizeMode: "contain" }}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
