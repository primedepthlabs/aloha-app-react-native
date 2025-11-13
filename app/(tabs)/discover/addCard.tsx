import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Modal,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  Image,
} from "react-native";
import { ChevronLeft, Camera } from "lucide-react-native";
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

const AddCard = () => {
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [saveCard, setSaveCard] = useState(false);
  const [showError, setShowError] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [cardType, setCardType] = useState("");

  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  const detectCardType = (number: string) => {
    const cleanNumber = number.replace(/\s/g, "");
    if (cleanNumber.startsWith("4")) {
      return "VISA";
    } else if (cleanNumber.startsWith("5")) {
      return "MASTERCARD";
    }
    return "";
  };

  const formatCardNumber = (text: string) => {
    const cleaned = text.replace(/\s/g, "");
    const chunks = cleaned.match(/.{1,4}/g);
    return chunks ? chunks.join(" ") : cleaned;
  };

  const formatExpiryDate = (text: string) => {
    const cleaned = text.replace(/\D/g, "");
    if (cleaned.length >= 2) {
      return cleaned.slice(0, 2) + "/" + cleaned.slice(2, 4);
    }
    return cleaned;
  };

  const handleCardNumberChange = (text: string) => {
    const cleaned = text.replace(/\s/g, "");
    if (cleaned.length <= 16) {
      setCardNumber(formatCardNumber(cleaned));
      setCardType(detectCardType(cleaned));
      if (showError) setShowError(false);
    }
  };

  const handleExpiryChange = (text: string) => {
    const cleaned = text.replace(/\D/g, "");
    if (cleaned.length <= 4) {
      setExpiryDate(formatExpiryDate(cleaned));
    }
  };

  const handleCvvChange = (text: string) => {
    if (text.length <= 3) {
      setCvv(text);
    }
  };

  const validateCard = () => {
    const cleanNumber = cardNumber.replace(/\s/g, "");
    if (cleanNumber.length !== 16) {
      setShowError(true);
      return false;
    }
    return true;
  };

  const handleContinue = () => {
    if (validateCard()) {
      setShowSuccess(true);
    }
  };

  if (!fontsLoaded) {
    return (
      <View className="flex-1 items-center justify-center bg-black">
        <ActivityIndicator color="#FCCD34" />
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-black">
      <StatusBar barStyle="light-content" />
      <ScrollView className="flex-1">
        {/* Header */}
        <View
          className="flex-row items-center px-4"
          style={{ height: 44, marginTop: 8 }}
        >
          <TouchableOpacity
            onPress={() => router.back()}
            className="absolute left-4"
            style={{ zIndex: 10 }}
          >
            <ChevronLeft size={24} color="#fff" strokeWidth={2.5} />
          </TouchableOpacity>
          <Text
            className="text-white text-center flex-1 font-semibold"
            style={{ fontSize: 18, fontFamily: FONT.SemiBold }}
          >
            Add Cart
          </Text>
        </View>

        <View style={{ paddingHorizontal: 21, marginTop: 40 }}>
          {/* Card Number Input */}
          <Text
            className="text-white mb-2"
            style={{ fontSize: 15, fontFamily: FONT.Regular }}
          >
            Card Number
          </Text>
          <View style={{ position: "relative", marginBottom: 16 }}>
            <TextInput
              value={cardNumber}
              onChangeText={handleCardNumberChange}
              placeholder="Your card number"
              placeholderTextColor="#C6C6C6"
              className="text-white"
              style={{
                fontFamily: FONT.Regular,
                height: 56,
                borderRadius: 15,
                borderWidth: showError ? 1 : 0.5,
                borderColor: showError ? "#FF3B30" : "#3A3A3C",
                backgroundColor: "#19191B",
                paddingHorizontal: 16,
                paddingLeft: cardType ? 60 : 16,
                fontSize: 16,
              }}
              keyboardType="numeric"
              maxLength={19}
            />
            {cardType && (
              <View
                className="absolute items-center justify-center"
                style={{
                  left: 16,
                  top: 8,
                  width: 40,
                  height: 40,
                  backgroundColor: cardType === "VISA" ? "#1A1F71" : "#EB001B",
                  borderRadius: 8,
                }}
              >
                <Text
                  className="text-white font-bold"
                  style={{ fontSize: 12 }}
                >
                  {cardType === "VISA" ? "VISA" : "MC"}
                </Text>
              </View>
            )}
            <TouchableOpacity
              className="absolute items-center justify-center"
              style={{
                right: 16,
                top: 16,
                width: 24,
                height: 24,
              }}
            >
              <Camera size={20} color="#EFEFEF" />
            </TouchableOpacity>
          </View>

          {showError && (
            <View
              className="flex-row items-center mb-4"
              style={{ marginTop: -12 }}
            >
              <View
                className="items-center justify-center mr-2"
                style={{
                  width: 16,
                  height: 16,
                  borderRadius: 8,
                  backgroundColor: "#FF3B30",
                }}
              >
                <Text
                  className="text-white font-bold"
                  style={{ fontSize: 10 }}
                >
                  !
                </Text>
              </View>
              <Text
                style={{
                  color: "#FF3B30",
                  fontSize: 14,
                  fontFamily: FONT.Regular,
                }}
              >
                Please check your credit card number.
              </Text>
            </View>
          )}

          {/* Expiry Date and CVV Row */}
          <View
            className="flex-row"
            style={{ gap: 16, marginBottom: 24 }}
          >
            {/* Expiry Date */}
            <View style={{ flex: 1 }}>
              <Text
                className="text-white mb-2"
                style={{ fontSize: 15, fontFamily: FONT.Regular }}
              >
                Exp. Date
              </Text>
              <TextInput
                value={expiryDate}
                onChangeText={handleExpiryChange}
                placeholder="MM/YY"
                placeholderTextColor="#C6C6C6"
                className="text-white"
                style={{
                  fontFamily: FONT.Regular,
                  height: 56,
                  borderRadius: 15,
                  borderWidth: 0.5,
                  borderColor: "#3A3A3C",
                  backgroundColor: "#19191B",
                  paddingHorizontal: 16,
                  fontSize: 16,
                }}
                keyboardType="numeric"
                maxLength={5}
              />
            </View>

            {/* CVV */}
            <View style={{ flex: 1 }}>
              <Text
                className="text-white mb-2"
                style={{ fontSize: 15, fontFamily: FONT.Regular }}
              >
                CVV
              </Text>
              <TextInput
                value={cvv}
                onChangeText={handleCvvChange}
                placeholder="123"
                placeholderTextColor="#C6C6C6"
                className="text-white"
                style={{
                  fontFamily: FONT.Regular,
                  height: 56,
                  borderRadius: 15,
                  borderWidth: 0.5,
                  borderColor: "#3A3A3C",
                  backgroundColor: "#19191B",
                  paddingHorizontal: 16,
                  fontSize: 16,
                }}
                keyboardType="numeric"
                maxLength={3}
                secureTextEntry
              />
            </View>
          </View>

          {/* Save Card Checkbox */}
          <TouchableOpacity
            onPress={() => setSaveCard(!saveCard)}
            className="flex-row items-center mb-8"
          >
            <View
              style={{
                width: 24,
                height: 24,
                borderRadius: 12,
                borderWidth: 2,
                borderColor: saveCard ? "#FCCD34" : "#8E8E93",
                alignItems: "center",
                justifyContent: "center",
                marginRight: 12,
              }}
            >
              {saveCard && (
                <View
                  style={{
                    width: 14,
                    height: 14,
                    borderRadius: 7,
                    backgroundColor: "#FCCD34",
                  }}
                />
              )}
            </View>
            <Text
              className="text-[#6F6F70]"
              style={{ fontSize: 16, fontFamily: FONT.Regular }}
            >
              Save this card
            </Text>
          </TouchableOpacity>

          {/* Continue Button */}
          <TouchableOpacity
            onPress={handleContinue}
            disabled={!cardNumber || !expiryDate || !cvv}
            className="items-center justify-center"
            style={{
              width: 350,
              height: 48,
              borderRadius: 15,
              backgroundColor:
                cardNumber && expiryDate && cvv ? "#FCCD34" : "#3A3A3C",
              marginTop: 300,
            }}
          >
            <Text
              className="font-bold"
              style={{
                fontSize: 17,
                fontFamily: FONT.SemiBold,
                color: cardNumber && expiryDate && cvv ? "#000" : "#8E8E93",
              }}
            >
              Continue
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Success Modal */}
      <Modal visible={showSuccess} transparent animationType="fade">
        <View className="flex-1 bg-black items-center justify-center px-5">
          <View className="items-center w-full">
            <View
              style={{
                width: 120,
                height: 120,
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 32,
              }}
            >
              <Image
                source={require("../../../assets/images/Check.png")}
                style={{ width: 120, height: 120 }}
                resizeMode="contain"
              />
            </View>

            <Text
              className="text-white font-bold"
              style={{
                fontSize: 24,
                marginBottom: 12,
                fontFamily: FONT.SemiBold,
              }}
            >
              Card add Successfull!
            </Text>
            <Text
              className="text-gray-400 text-center"
              style={{
                fontSize: 15,
                marginBottom: 80,
                fontFamily: FONT.Regular,
              }}
            >
              You can now use this card for your{"\n"}purchases and donations.
            </Text>

            <TouchableOpacity
              onPress={() => {
                setShowSuccess(false);
                router.back();
              }}
              className="bg-[#FCCD34] items-center justify-center"
              style={{
                width: 350,
                height: 48,
                borderRadius: 15,
              }}
            >
              <Text
                className="text-black font-bold"
                style={{ fontSize: 17, fontFamily: FONT.SemiBold }}
              >
                Done
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default AddCard;