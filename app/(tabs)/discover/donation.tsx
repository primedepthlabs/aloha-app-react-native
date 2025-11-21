import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Modal,
  SafeAreaView,
  StatusBar,
  Dimensions,
  ActivityIndicator,
  Image,
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

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const FONT = {
  Regular: "Poppins_400Regular",
  Medium: "Poppins_500Medium",
  SemiBold: "Poppins_600SemiBold",
  Bold: "Poppins_700Bold",
};

const Donation = () => {
  const [step, setStep] = useState(1);
  const [selectedAmount, setSelectedAmount] = useState(10);
  const [customAmount, setCustomAmount] = useState("");
  const [message, setMessage] = useState("");
  const [selectedPayment, setSelectedPayment] = useState("balance");
  const [showCardOptions, setShowCardOptions] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showFailed, setShowFailed] = useState(false);

  const balance = 12;
  const amounts = [5, 10, 50, 100];

  const handleAmountSelect = (amount: number) => {
    setSelectedAmount(amount);
    setCustomAmount("");
  };

  const handleNext = () => {
    setStep(2);
  };

  const handleDonate = () => {
    if (selectedPayment === "balance") {
      setShowSuccess(true);
    } else {
      setShowFailed(true);
    }
  };

  const handlePaymentSelect = (method: string) => {
    setSelectedPayment(method);
    if (method === "card") {
      setShowCardOptions(!showCardOptions);
    } else {
      setShowCardOptions(false);
    }
  };

  const resetFlow = () => {
    setStep(1);
    setSelectedAmount(10);
    setCustomAmount("");
    setMessage("");
    setSelectedPayment("balance");
    setShowCardOptions(false);
  };
  useEffect(() => {
    if (!showSuccess && !showFailed) {
      resetFlow();
    }
  }, [showSuccess, showFailed]);

  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  if (!fontsLoaded) {
    return (
      <View className="flex-1 items-center justify-center bg-black">
        <ActivityIndicator color="#FCCD34" />
      </View>
    );
  }

  if (step === 1) {
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
              className="absolute left-4"
              onPress={() => router.back()}
              style={{ zIndex: 10 }}
            >
              <ChevronLeft size={24} color="#fff" strokeWidth={2.5} />
            </TouchableOpacity>
            <Text
              className="text-white text-center flex-1 font-semibold"
              style={{ fontSize: 18 }}
            >
              Donation
            </Text>
          </View>

          {/* Balance Card */}
          <View
            className="flex-row items-center justify-between px-4"
            style={{
              width: 350,
              height: 69,
              marginLeft: 21,
              marginTop: 20,
              borderRadius: 15,
              borderWidth: 0.3,
              borderColor: "#FCCD34",
              backgroundColor: "rgba(28, 28, 30, 0.8)",
            }}
          >
            <View>
              <Text
                className="text-gray-400"
                style={{
                  fontFamily: FONT.Regular,
                  fontWeight: "400",
                  fontSize: 12,
                  lineHeight: 12,
                  marginBottom: 4,
                }}
              >
                Balance:
              </Text>
              <Text
                className="text-white font-bold"
                style={{ fontSize: 18, fontFamily: FONT.SemiBold }}
              >
                {balance} GEL
              </Text>
            </View>
            <TouchableOpacity
              className="bg-[#FCCD34] items-center justify-center"
              style={{
                width: 92,
                height: 29,
                borderRadius: 10,
              }}
            >
              <Text
                className="text-black font-semibold"
                style={{ fontSize: 13 }}
              >
                + Add funds
              </Text>
            </TouchableOpacity>
          </View>

          {/* Select Amount Section */}
          <View style={{ paddingLeft: 21, paddingRight: 21, marginTop: 24 }}>
            <Text
              className="text-white font-bold"
              style={{
                fontSize: 16,
                marginBottom: 16,
                fontFamily: FONT.Bold,
              }}
            >
              Select amount
            </Text>

            {/* Amount Buttons Row */}
            <View
              className="flex-row"
              style={{
                gap: 8,
                marginBottom: 12,
              }}
            >
              {amounts.map((amount) => (
                <TouchableOpacity
                  key={amount}
                  onPress={() => handleAmountSelect(amount)}
                  className={`flex-1 items-center justify-center ${
                    selectedAmount === amount && !customAmount
                      ? "bg-yellow-400"
                      : "bg-transparent"
                  }`}
                  style={{
                    height: 48,
                    borderRadius: 15,
                    borderWidth:
                      selectedAmount === amount && !customAmount ? 0 : 0.5,
                    borderColor: "#3A3A3C",
                  }}
                >
                  <Text
                    className={`font-semibold ${
                      selectedAmount === amount && !customAmount
                        ? "text-black"
                        : "text-white"
                    }`}
                    style={{ fontSize: 16, fontFamily: FONT.Medium }}
                  >
                    {amount} GEL
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Custom Amount Input */}
            <TextInput
              value={customAmount}
              onChangeText={(text) => {
                setCustomAmount(text);
                setSelectedAmount(0);
              }}
              placeholder="Custom amount"
              placeholderTextColor="#8E8E93"
              className="bg-transparent text-white"
              style={{
                fontFamily: FONT.Regular,
                height: 48,
                borderRadius: 15,
                borderWidth: 0.5,
                backgroundColor: "#19191B",
                borderColor: "#3A3A3C",
                paddingHorizontal: 16,
                fontSize: 16,
                marginBottom: 24,
              }}
              keyboardType="numeric"
            />

            {/* Message Section */}
            <Text
              className="text-white font-bold"
              style={{
                fontSize: 15,
                marginBottom: 12,
                fontFamily: FONT.Medium,
              }}
            >
              You can say something to Bam Margera
            </Text>

            <View style={{ position: "relative", marginBottom: 24 }}>
              <TextInput
                value={message}
                onChangeText={setMessage}
                placeholder="Type your message (Max 240 chars)"
                placeholderTextColor="#8E8E93"
                className="text-white"
                multiline
                maxLength={240}
                style={{
                  fontFamily: FONT.Regular,
                  width: 349,
                  height: 93,
                  borderRadius: 17,
                  borderWidth: 0.3,
                  borderColor: "rgba(255, 255, 255, 0.2)",
                  backgroundColor: "rgba(28, 28, 30, 0.8)",
                  padding: 16,
                  fontSize: 15,
                  textAlignVertical: "top",
                }}
              />

              <Text
                className="text-gray-500 absolute"
                style={{
                  fontSize: 12,
                  bottom: 12,
                  right: 16,
                  fontStyle: "italic",
                }}
              >
                {message.length}/240
              </Text>
            </View>

            {/* Next Button */}
            <TouchableOpacity
              onPress={handleNext}
              className="bg-[#FCCD34] items-center justify-center"
              style={{
                width: 350,
                height: 48,
                borderRadius: 15,
              }}
            >
              <Text className="text-black font-bold" style={{ fontSize: 17 }}>
                Next
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // Step 2: Payment Method Screen
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
            onPress={() => setStep(1)}
            className="absolute left-4"
            style={{ zIndex: 10 }}
          >
            <ChevronLeft size={24} color="#fff" strokeWidth={2.5} />
          </TouchableOpacity>
          <Text
            className="text-white text-center flex-1 font-semibold"
            style={{ fontSize: 18 }}
          >
            Donation
          </Text>
        </View>

        {/* Amount Display */}
        <View
          className="items-center justify-center"
          style={{
            width: 350,
            marginLeft: 21,
            marginTop: 10,
            borderRadius: 15,
            backgroundColor: "rgba(28, 28, 30, 0.8)",
            paddingVertical: 16,
            marginBottom: 24,
          }}
        >
          <Text
            className="text-gray-400"
            style={{
              fontSize: 12,
              marginBottom: 4,
              fontFamily: FONT.Regular,
            }}
          >
            You are donating:
          </Text>
          <Text
            className="text-yellow-400 font-bold"
            style={{ fontSize: 18, fontFamily: FONT.SemiBold }}
          >
            {customAmount || selectedAmount} GEL
          </Text>
        </View>

        <View
          style={{
            paddingLeft: 21,
            paddingRight: 21,
            marginTop: 5,
          }}
        >
          <Text
            className="text-white font-bold"
            style={{
              fontSize: 17.5,
              marginBottom: 16,
              fontFamily: FONT.Bold,
            }}
          >
            Select Payment Method
          </Text>

          {/* Balance Option */}
          <TouchableOpacity
            onPress={() => handlePaymentSelect("balance")}
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              width: 350,
              height: 56,
              borderRadius: 15,
              paddingHorizontal: 16,
              marginBottom: 8,
              borderWidth: selectedPayment === "balance" ? 1 : 0.5,
              borderColor:
                selectedPayment === "balance" ? "#FCCD34" : "#3A3A3C",
              backgroundColor: "rgba(28, 28, 30, 0.8)",
            }}
          >
            <View className="flex-row items-center">
              <View className="w-10 h-10 rounded-[8px] mr-3 items-center justify-center">
                <Image
                  source={require("../../../assets/images/balance.png")}
                  className="w-6 h-6"
                  resizeMode="contain"
                />
              </View>
              <Text
                className="text-white"
                style={{ fontSize: 15, fontFamily: FONT.Regular }}
              >
                Balance
              </Text>
            </View>
            <View
              style={{
                width: 20,
                height: 20,
                borderRadius: 10,
                borderWidth: 2,
                borderColor:
                  selectedPayment === "balance" ? "#FCCD34" : "#8E8E93",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {selectedPayment === "balance" && (
                <View
                  style={{
                    width: 12,
                    height: 12,
                    borderRadius: 6,
                    backgroundColor: "#FCCD34",
                  }}
                />
              )}
            </View>
          </TouchableOpacity>

          {/* Apple Pay Option */}
          <TouchableOpacity
            onPress={() => handlePaymentSelect("apple")}
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              width: 350,
              height: 56,
              borderRadius: 15,
              paddingHorizontal: 16,
              marginBottom: 8,
              borderWidth: 0.5,
              borderColor: "#3A3A3C",
              backgroundColor: "rgba(28, 28, 30, 0.8)",
            }}
          >
            <View className="flex-row items-center">
              <View className="w-10 h-10 rounded-[8px] mr-3 items-center justify-center">
                <Image
                  source={require("../../../assets/images/applepay.png")}
                  className="w-7 h-7"
                  resizeMode="contain"
                />
              </View>
              <Text
                className="text-white"
                style={{ fontSize: 15, fontFamily: FONT.Regular }}
              >
                Apple Pay
              </Text>
            </View>
            <Text className="text-gray-500 text-[20px]">›</Text>
          </TouchableOpacity>

          {/* Card Option */}
          <TouchableOpacity
            onPress={() => handlePaymentSelect("card")}
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              width: 350,
              height: 56,
              borderRadius: 15,
              paddingHorizontal: 16,
              marginBottom: showCardOptions ? 8 : 8,
              borderWidth: selectedPayment === "card" ? 1 : 0.5,
              borderColor: selectedPayment === "card" ? "#FCCD34" : "#3A3A3C",
              backgroundColor: "rgba(28, 28, 30, 0.8)",
            }}
          >
            <View className="flex-row items-center flex-1">
              <View className="w-10 h-10 rounded-[8px] mr-3 items-center justify-center">
                <Image
                  source={require("../../../assets/images/creditcard.png")}
                  className="w-6 h-6"
                  resizeMode="contain"
                />
              </View>
              <Text
                className="text-white"
                style={{ fontSize: 15, fontFamily: FONT.Regular }}
              >
                Credit/Debit Card
              </Text>
            </View>
            <Text className="text-gray-500 text-[20px]">
              {showCardOptions ? "∧" : "›"}
            </Text>
          </TouchableOpacity>

          {/* Card Options Expanded */}
          {showCardOptions && (
            <View style={{ marginBottom: 8 }}>
              {/* MasterCard */}
              <TouchableOpacity
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  width: 350,
                  height: 56,
                  backgroundColor: "#2C2C2E",
                  borderRadius: 15,
                  paddingHorizontal: 16,
                  marginBottom: 8,
                }}
              >
                <View className="w-10 h-7 rounded-[6px] bg-red-600 mr-3 relative items-center justify-center">
                  <View className="w-5 h-5 bg-red-700 rounded-full absolute left-0" />
                  <View className="w-5 h-5 bg-orange-500 rounded-full absolute right-0" />
                </View>
                <Text
                  className="text-white"
                  style={{ fontSize: 15, fontFamily: FONT.Regular }}
                >
                  MASTERCARD **** 5100
                </Text>
              </TouchableOpacity>

              {/* Visa */}
              <TouchableOpacity
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  width: 350,
                  height: 56,
                  backgroundColor: "#2C2C2E",
                  borderRadius: 15,
                  paddingHorizontal: 16,
                  marginBottom: 8,
                }}
              >
                <View className="w-10 h-7 rounded-[6px] bg-blue-600 mr-3 items-center justify-center">
                  <Text className="text-white font-bold text-[12px]">VISA</Text>
                </View>
                <Text
                  className="text-white"
                  style={{ fontSize: 15, fontFamily: FONT.Regular }}
                >
                  VISA **** 5100
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Add Card Button */}
          <TouchableOpacity
            onPress={() => router.push("/(tabs)/discover/addCard")}
            style={{
              width: 350,
              height: 48,
              borderRadius: 15,
              borderWidth: 0.5,
              borderColor: "#3A3A3C",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 16,
              backgroundColor: "transparent",
            }}
          >
            <Text
              className="text-white"
              style={{ fontSize: 16, fontFamily: FONT.Medium }}
            >
              + Add Card
            </Text>
          </TouchableOpacity>

          {/* Donate Button */}
          <TouchableOpacity
            onPress={handleDonate}
            style={{
              width: 350,
              height: 48,
              borderRadius: 15,
              backgroundColor: "#FCCD34",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 12,
            }}
          >
            <Text className="text-black text-[20px] mr-2">♥</Text>
            <Text
              className="text-black"
              style={{ fontSize: 17, fontFamily: FONT.Medium }}
            >
              Donate now
            </Text>
          </TouchableOpacity>

          <Text
            className="text-gray-500 text-center"
            style={{ fontSize: 13, fontFamily: FONT.Regular }}
          >
            Donation are non-refundable
          </Text>
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
                marginBottom: 16,
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
                fontFamily: FONT.Medium,
              }}
            >
              Donation Successful!
            </Text>
            <Text
              className="text-gray-400 text-center"
              style={{ fontSize: 15, marginBottom: 32 }}
            >
              Your generous contribution will help{"\n"}make a difference.
            </Text>

            <Text
              className="text-white"
              style={{ fontSize: 18, marginBottom: 12 }}
            >
              Amount Donated
            </Text>
            <View
              style={{
                borderRadius: 12,
                borderWidth: 0.3,
                borderColor: "#FCCD34",
                paddingVertical: 24,
                paddingHorizontal: 64,
                marginBottom: 48,
              }}
            >
              <Text
                className="text-yellow-400 font-bold text-center"
                style={{ fontSize: 28 }}
              >
                {customAmount || selectedAmount} GEL
              </Text>
            </View>

            <TouchableOpacity
              onPress={() => {
                setShowSuccess(false);
                resetFlow();
                router.replace("/discover");
              }}
              className="bg-yellow-400 items-center justify-center"
              style={{
                width: 340,
                height: 48,
                borderRadius: 12,
              }}
            >
              <Text className="text-black font-bold" style={{ fontSize: 17 }}>
                Done
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Failed Modal */}
      <Modal visible={showFailed} transparent animationType="fade">
        <View className="flex-1 bg-black items-center justify-center px-5">
          <TouchableOpacity
            onPress={() => setShowFailed(false)}
            className="absolute top-16 right-8"
            style={{ zIndex: 10 }}
          >
            <Text className="text-white" style={{ fontSize: 32 }}>
              ×
            </Text>
          </TouchableOpacity>

          <View className="items-center w-full">
            <View
              className="items-center justify-center"
              style={{
                width: 120,
                height: 120,
                marginBottom: 24,
              }}
            >
              <Image
                source={require("../../../assets/images/Failed.png")}
                style={{ width: 80, height: 80 }}
                resizeMode="contain"
              />
            </View>

            <Text
              className="text-white font-bold"
              style={{
                fontSize: 24,
                marginBottom: 12,
                fontFamily: FONT.Medium,
              }}
            >
              Payment Failed!
            </Text>
            <Text
              className="text-gray-400 text-center"
              style={{ fontSize: 15, marginBottom: 32 }}
            >
              An error occurred while processing your{"\n"}contribution
            </Text>

            <Text
              className="text-white"
              style={{ fontSize: 18, marginBottom: 12 }}
            >
              Amount Due
            </Text>
            <View
              style={{
                borderRadius: 12,
                borderWidth: 0.3,
                borderColor: "#FCCD34",
                paddingVertical: 24,
                paddingHorizontal: 64,
                marginBottom: 48,
              }}
            >
              <Text
                className="text-yellow-400 font-bold text-center"
                style={{ fontSize: 28 }}
              >
                {customAmount || selectedAmount} GEL
              </Text>
            </View>

            <TouchableOpacity
              onPress={() => setShowFailed(false)}
              className="bg-[#FCCD34] items-center justify-center"
              style={{
                width: 340,
                height: 48,
                borderRadius: 12,
                marginBottom: 12,
              }}
            >
              <Text
                className="text-black font-bold"
                style={{ fontSize: 17, fontFamily: FONT.Bold }}
              >
                Try again
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                setShowFailed(false);
                resetFlow();
                setStep(1);
              }}
              className="items-center justify-center"
              style={{
                width: 340,
                height: 48,
                borderRadius: 12,
                backgroundColor: "#19191B",
                marginBottom: 32,
              }}
            >
              <Text
                className="text-white font-bold"
                style={{ fontSize: 17, fontFamily: FONT.Regular }}
              >
                Back
              </Text>
            </TouchableOpacity>

            <Text className="text-white" style={{ fontSize: 15 }}>
              Need Help?{" "}
              <Text className="text-[#FCCD34] ">Contact Support</Text>
            </Text>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default Donation;
