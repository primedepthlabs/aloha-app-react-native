import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  Image,
} from "react-native";
import { styled } from "nativewind";
import { ChevronLeft } from "lucide-react-native";
import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
} from "@expo-google-fonts/poppins";
import { router } from "expo-router";

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity);
const StyledSafeAreaView = styled(SafeAreaView);
const StyledImage = styled(Image);

const FONT = {
  Regular: "Poppins_400Regular",
  Medium: "Poppins_500Medium",
  SemiBold: "Poppins_600SemiBold",
  Bold: "Poppins_700Bold",
};

// ✅ Custom Toggle Switch Component
const ToggleSwitch = ({ value, onValueChange }: any) => (
  <StyledTouchableOpacity
    onPress={() => onValueChange(!value)}
    style={{
      width: 51,
      height: 31,
      borderRadius: 15.5,
      backgroundColor: value ? "#FCCD34" : "#39393D",
      justifyContent: "center",
      padding: 2,
    }}
  >
    <StyledView
      style={{
        width: 27,
        height: 27,
        borderRadius: 13.5,
        backgroundColor: "white",
        transform: [{ translateX: value ? 20 : 0 }],
      }}
    />
  </StyledTouchableOpacity>
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
    <StyledView
      style={{
        height: 63,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 16,
      }}
    >
      <StyledView className="flex-row items-center flex-1">
        <StyledImage
          source={imageSource}
          style={{ width: 40, height: 40, marginRight: 16 }}
          resizeMode="contain"
        />
        <StyledView className="flex-1">
          <StyledText
            className="text-white"
            style={{
              fontSize: 16,
              fontFamily: FONT.Medium,
              marginBottom: 2,
            }}
          >
            {title}
          </StyledText>
          <StyledText
            className="text-gray-400"
            style={{
              fontSize: 13,
              fontFamily: FONT.Regular,
            }}
          >
            {subtitle}
          </StyledText>
        </StyledView>
      </StyledView>
      <ToggleSwitch value={value} onValueChange={onValueChange} />
    </StyledView>
  );

  return (
    <StyledSafeAreaView className="flex-1 bg-black">
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <StyledView
        style={{
          height: 60,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          paddingHorizontal: 20,
          position: "relative",
        }}
      >
        <StyledTouchableOpacity
          onPress={() => router.push("/(tabs)/profile")}
          style={{
            position: "absolute",
            left: 20,
            width: 40,
            height: 40,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <ChevronLeft size={26} color="#FFFFFF" strokeWidth={2} />
        </StyledTouchableOpacity>
        <StyledText
          className="text-white"
          style={{
            fontSize: 18,
            fontFamily: FONT.SemiBold,
          }}
        >
          Notification Settings
        </StyledText>
      </StyledView>

      {/* Notification Items */}
      <StyledView style={{ paddingTop: 20, paddingHorizontal: 10 }}>
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
      </StyledView>
    </StyledSafeAreaView>
  );
};

export default NotificationScreen;
