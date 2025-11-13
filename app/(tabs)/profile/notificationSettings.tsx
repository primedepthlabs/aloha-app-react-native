import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
  Image,
  ScrollView,
} from "react-native";
import { ChevronLeft } from "lucide-react-native";
import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
} from "@expo-google-fonts/poppins";
import { router } from "expo-router";

const FONT = {
  Regular: "Poppins_400Regular",
  Medium: "Poppins_500Medium",
  SemiBold: "Poppins_600SemiBold",
  Bold: "Poppins_700Bold",
};

// ✅ Custom Toggle Switch Component
const ToggleSwitch = ({ value, onValueChange }: any) => (
  <TouchableOpacity
    onPress={() => onValueChange(!value)}
    style={{
      width: 51,
      height: 31,
      borderRadius: 15.5,
      backgroundColor: value ? "#FCCD34" : "#39393D",
      justifyContent: "center",
      padding: 2,
    }}
    activeOpacity={0.8}
  >
    <View
      style={{
        width: 27,
        height: 27,
        borderRadius: 13.5,
        backgroundColor: "white",
        transform: [{ translateX: value ? 20 : 0 }],
      }}
    />
  </TouchableOpacity>
);

const NotificationScreen = () => {
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  const [notifications, setNotifications] = useState({
    messageReplies: true,
    messagePayment: false,
    videoAudioCall: false,
    donationReceipts: false,
    balanceUpdates: false,
    systemAnnouncements: false,
    promotions: false,
  });

  if (!fontsLoaded) {
    return (
      <View className="flex-1 items-center justify-center bg-black">
        <ActivityIndicator color="#FCCD34" />
      </View>
    );
  }

  const NotificationItem = ({
    imageSource,
    title,
    subtitle,
    value,
    onValueChange,
  }: any) => (
    <View className="flex-row items-center justify-between px-5 py-4">
      <View className="flex-row items-center flex-1">
        <View className="w-12 h-12 bg-[#1C1C1E] rounded-2xl items-center justify-center mr-4">
          <Image
            source={imageSource}
            style={{ width: 24, height: 24 }}
            resizeMode="contain"
          />
        </View>
        <View className="flex-1 pr-3">
          <Text
            className="text-white text-base mb-0.5"
            style={{
              fontFamily: FONT.SemiBold,
            }}
          >
            {title}
          </Text>
          <Text
            className="text-gray-400 text-sm"
            style={{
              fontFamily: FONT.Regular,
            }}
            numberOfLines={1}
          >
            {subtitle}
          </Text>
        </View>
      </View>
      <ToggleSwitch value={value} onValueChange={onValueChange} />
    </View>
  );

  return (
    <View className="flex-1 bg-black">
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View className="pt-12 pb-5 px-5">
        <View className="flex-row items-center justify-between">
          <TouchableOpacity
            onPress={() => router.push("/(tabs)/profile")}
            className="w-10 h-10 items-center justify-center -ml-2"
          >
            <ChevronLeft size={28} color="#FFFFFF" strokeWidth={2.5} />
          </TouchableOpacity>
          <Text
            className="text-white text-xl flex-1 text-center -mr-8"
            style={{
              fontFamily: FONT.SemiBold,
            }}
          >
            Notification Settings
          </Text>
          <View className="w-10" />
        </View>
      </View>

      {/* Notification Items */}
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="pb-8">
          <NotificationItem
            imageSource={require("../../../assets/images/profile/notification.png")}
            title="New Message Replies"
            subtitle="Replies to your messages"
            value={notifications.messageReplies}
            onValueChange={(val: boolean) =>
              setNotifications({ ...notifications, messageReplies: val })
            }
          />
          <NotificationItem
            imageSource={require("../../../assets/images/profile/payment.png")}
            title="Message Payment"
            subtitle="Confirmations for message payments"
            value={notifications.messagePayment}
            onValueChange={(val: boolean) =>
              setNotifications({ ...notifications, messagePayment: val })
            }
          />
          <NotificationItem
            imageSource={require("../../../assets/images/profile/video-call.png")}
            title="Video & Audio Call Updates"
            subtitle="Updates on video and audio calls"
            value={notifications.videoAudioCall}
            onValueChange={(val: boolean) =>
              setNotifications({ ...notifications, videoAudioCall: val })
            }
          />
          <NotificationItem
            imageSource={require("../../../assets/images/profile/donation.png")}
            title="Donation Receipts"
            subtitle="Receipts for your donations"
            value={notifications.donationReceipts}
            onValueChange={(val: boolean) =>
              setNotifications({ ...notifications, donationReceipts: val })
            }
          />
          <NotificationItem
            imageSource={require("../../../assets/images/profile/balance.png")}
            title="Balance Updates"
            subtitle="Updates on your balance"
            value={notifications.balanceUpdates}
            onValueChange={(val: boolean) =>
              setNotifications({ ...notifications, balanceUpdates: val })
            }
          />
          <NotificationItem
            imageSource={require("../../../assets/images/profile/system-annoucement.png")}
            title="System Announcements"
            subtitle="System-wide announcements"
            value={notifications.systemAnnouncements}
            onValueChange={(val: boolean) =>
              setNotifications({ ...notifications, systemAnnouncements: val })
            }
          />
          <NotificationItem
            imageSource={require("../../../assets/images/profile/promotion.png")}
            title="Promotions & Offers"
            subtitle="Promotions and special offers"
            value={notifications.promotions}
            onValueChange={(val: boolean) =>
              setNotifications({ ...notifications, promotions: val })
            }
          />
        </View>
      </ScrollView>
    </View>
  );
};

export default NotificationScreen;