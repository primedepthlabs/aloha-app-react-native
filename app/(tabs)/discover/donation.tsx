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
const StyledTextInput = styled(TextInput);
const StyledTouchableOpacity = styled(TouchableOpacity);
const StyledScrollView = styled(ScrollView);
const StyledSafeAreaView = styled(SafeAreaView);

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
      <StyledSafeAreaView className="flex-1 bg-black">
        <StatusBar barStyle="light-content" />
        <StyledScrollView className="flex-1">
          {/* Header */}
          <StyledView
            className="flex-row items-center px-4"
            style={{ height: 44, marginTop: 8 }}
          >
            <StyledTouchableOpacity
              className="absolute left-4"
              style={{ zIndex: 10 }}
            >
              <ChevronLeft size={24} color="#fff" strokeWidth={2.5} />
            </StyledTouchableOpacity>
            <StyledText
              className="text-white text-center flex-1 font-semibold"
              style={{ fontSize: 18 }}
            >
              Donation
            </StyledText>
          </StyledView>

          {/* Balance Card */}
          <StyledView
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
            <StyledView>
              <StyledText
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
              </StyledText>
              <StyledText
                className="text-white font-bold"
                style={{ fontSize: 18, fontFamily: FONT.SemiBold }}
              >
                {balance} GEL
              </StyledText>
            </StyledView>
            <StyledTouchableOpacity
              className="bg-[#FCCD34] items-center justify-center"
              style={{
                width: 92,
                height: 29,
                borderRadius: 10,
              }}
            >
              <StyledText
                className="text-black font-semibold"
                style={{ fontSize: 13 }}
              >
                + Add funds
              </StyledText>
            </StyledTouchableOpacity>
          </StyledView>

          {/* Select Amount Section */}
          <StyledView
            style={{ paddingLeft: 21, paddingRight: 21, marginTop: 24 }}
          >
            <StyledText
              className="text-white font-bold"
              style={{
                fontSize: 16,
                marginBottom: 16,
                fontFamily: FONT.Bold,
              }}
            >
              Select amount
            </StyledText>

            {/* Amount Buttons Row */}
            <StyledView
              className="flex-row"
              style={{
                gap: 8,
                marginBottom: 12,
              }}
            >
              {amounts.map((amount) => (
                <StyledTouchableOpacity
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
                  <StyledText
                    className={`font-semibold ${
                      selectedAmount === amount && !customAmount
                        ? "text-black"
                        : "text-white"
                    }`}
                    style={{ fontSize: 16, fontFamily: FONT.Medium }}
                  >
                    {amount} GEL
                  </StyledText>
                </StyledTouchableOpacity>
              ))}
            </StyledView>

            {/* Custom Amount Input */}
            <StyledTextInput
              value={customAmount}
              onChangeText={(text) => {
                setCustomAmount(text);
                setSelectedAmount(null);
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
            <StyledText
              className="text-white font-bold"
              style={{
                fontSize: 15,
                marginBottom: 12,
                fontFamily: FONT.Medium,
              }}
            >
              You can say something to Bam Margera
            </StyledText>

            <StyledView style={{ position: "relative", marginBottom: 24 }}>
              <StyledTextInput
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

              <StyledText
                className="text-gray-500 absolute"
                style={{
                  fontSize: 12,
                  bottom: 12,
                  right: 16,
                  fontStyle: "italic",
                }}
              >
                {message.length}/240
              </StyledText>
            </StyledView>

            {/* Next Button */}
            <StyledTouchableOpacity
              onPress={handleNext}
              className="bg-[#FCCD34] items-center justify-center"
              style={{
                width: 350,
                height: 48,
                borderRadius: 15,
              }}
            >
              <StyledText
                className="text-black font-bold"
                style={{ fontSize: 17 }}
              >
                Next
              </StyledText>
            </StyledTouchableOpacity>
          </StyledView>
        </StyledScrollView>
      </StyledSafeAreaView>
    );
  }

  // Step 2: Payment Method Screen
  return (
    <StyledSafeAreaView className="flex-1 bg-black">
      <StatusBar barStyle="light-content" />
      <StyledScrollView className="flex-1">
        {/* Header */}
        <StyledView
          className="flex-row items-center px-4"
          style={{ height: 44, marginTop: 8 }}
        >
          <StyledTouchableOpacity
            onPress={() => setStep(1)}
            className="absolute left-4"
            style={{ zIndex: 10 }}
          >
            <ChevronLeft size={24} color="#fff" strokeWidth={2.5} />
          </StyledTouchableOpacity>
          <StyledText
            className="text-white text-center flex-1 font-semibold"
            style={{ fontSize: 18 }}
          >
            Donation
          </StyledText>
        </StyledView>

        {/* Amount Display */}
        <StyledView
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
          <StyledText
            className="text-gray-400"
            style={{
              fontSize: 12,
              marginBottom: 4,
              fontFamily: FONT.Regular,
            }}
          >
            You are donating:
          </StyledText>
          <StyledText
            className="text-yellow-400 font-bold"
            style={{ fontSize: 18, fontFamily: FONT.SemiBold }}
          >
            {customAmount || selectedAmount} GEL
          </StyledText>
        </StyledView>

        <StyledView
          style={{
            paddingLeft: 21,
            paddingRight: 21,
            marginTop: 5,
          }}
        >
          <StyledText
            className="text-white font-bold"
            style={{
              fontSize: 17.5,
              marginBottom: 16,
              fontFamily: FONT.Bold,
            }}
          >
            Select Payment Method
          </StyledText>

          {/* Balance Option */}
          <StyledTouchableOpacity
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
            <StyledView className="flex-row items-center">
              <StyledView className="w-10 h-10 rounded-[8px] mr-3 items-center justify-center">
                <Image
                  source={require("../../../assets/images/balance.png")}
                  className="w-6 h-6"
                  resizeMode="contain"
                />
              </StyledView>
              <StyledText
                className="text-white"
                style={{ fontSize: 15, fontFamily: FONT.Regular }}
              >
                Balance
              </StyledText>
            </StyledView>
            <StyledView
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
                <StyledView
                  style={{
                    width: 12,
                    height: 12,
                    borderRadius: 6,
                    backgroundColor: "#FCCD34",
                  }}
                />
              )}
            </StyledView>
          </StyledTouchableOpacity>

          {/* Apple Pay Option */}
          <StyledTouchableOpacity
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
            <StyledView className="flex-row items-center">
              <StyledView className="w-10 h-10 rounded-[8px] mr-3 items-center justify-center">
                <Image
                  source={require("../../../assets/images/applepay.png")}
                  className="w-7 h-7"
                  resizeMode="contain"
                />
              </StyledView>
              <StyledText
                className="text-white"
                style={{ fontSize: 15, fontFamily: FONT.Regular }}
              >
                Apple Pay
              </StyledText>
            </StyledView>
            <StyledText className="text-gray-500 text-[20px]">›</StyledText>
          </StyledTouchableOpacity>

          {/* Card Option */}
          <StyledTouchableOpacity
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
            <StyledView className="flex-row items-center flex-1">
              <StyledView className="w-10 h-10 rounded-[8px] mr-3 items-center justify-center">
                <Image
                  source={require("../../../assets/images/creditcard.png")}
                  className="w-6 h-6"
                  resizeMode="contain"
                />
              </StyledView>
              <StyledText
                className="text-white"
                style={{ fontSize: 15, fontFamily: FONT.Regular }}
              >
                Credit/Debit Card
              </StyledText>
            </StyledView>
            <StyledText className="text-gray-500 text-[20px]">
              {showCardOptions ? "∧" : "›"}
            </StyledText>
          </StyledTouchableOpacity>

          {/* Card Options Expanded */}
          {showCardOptions && (
            <StyledView style={{ marginBottom: 8 }}>
              {/* MasterCard */}
              <StyledTouchableOpacity
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
                <StyledView className="w-10 h-7 rounded-[6px] bg-red-600 mr-3 relative items-center justify-center">
                  <StyledView className="w-5 h-5 bg-red-700 rounded-full absolute left-0" />
                  <StyledView className="w-5 h-5 bg-orange-500 rounded-full absolute right-0" />
                </StyledView>
                <StyledText
                  className="text-white"
                  style={{ fontSize: 15, fontFamily: FONT.Regular }}
                >
                  MASTERCARD **** 5100
                </StyledText>
              </StyledTouchableOpacity>

              {/* Visa */}
              <StyledTouchableOpacity
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
                <StyledView className="w-10 h-7 rounded-[6px] bg-blue-600 mr-3 items-center justify-center">
                  <StyledText className="text-white font-bold text-[12px]">
                    VISA
                  </StyledText>
                </StyledView>
                <StyledText
                  className="text-white"
                  style={{ fontSize: 15, fontFamily: FONT.Regular }}
                >
                  VISA **** 5100
                </StyledText>
              </StyledTouchableOpacity>
            </StyledView>
          )}

          {/* Add Card Button */}
          <StyledTouchableOpacity
            onPress={() => router.push("/addCard")}
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
            <StyledText
              className="text-white"
              style={{ fontSize: 16, fontFamily: FONT.Medium }}
            >
              + Add Card
            </StyledText>
          </StyledTouchableOpacity>

          {/* Donate Button */}
          <StyledTouchableOpacity
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
            <StyledText className="text-black text-[20px] mr-2">♥</StyledText>
            <StyledText
              className="text-black"
              style={{ fontSize: 17, fontFamily: FONT.Medium }}
            >
              Donate now
            </StyledText>
          </StyledTouchableOpacity>

          <StyledText
            className="text-gray-500 text-center"
            style={{ fontSize: 13, fontFamily: FONT.Regular }}
          >
            Donation are non-refundable
          </StyledText>
        </StyledView>
      </StyledScrollView>

      {/* Success Modal */}
      <Modal visible={showSuccess} transparent animationType="fade">
        <StyledView className="flex-1 bg-black items-center justify-center px-5">
          <StyledView className="items-center w-full">
            <StyledView
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
            </StyledView>

            <StyledText
              className="text-white font-bold"
              style={{
                fontSize: 24,
                marginBottom: 12,
                fontFamily: FONT.Medium,
              }}
            >
              Donation Successful!
            </StyledText>
            <StyledText
              className="text-gray-400 text-center"
              style={{ fontSize: 15, marginBottom: 32 }}
            >
              Your generous contribution will help{"\n"}make a difference.
            </StyledText>

            <StyledText
              className="text-white"
              style={{ fontSize: 18, marginBottom: 12 }}
            >
              Amount Donated
            </StyledText>
            <StyledView
              style={{
                borderRadius: 12,
                borderWidth: 0.3,
                borderColor: "#FCCD34",
                paddingVertical: 24,
                paddingHorizontal: 64,
                marginBottom: 48,
              }}
            >
              <StyledText
                className="text-yellow-400 font-bold text-center"
                style={{ fontSize: 28 }}
              >
                {customAmount || selectedAmount} GEL
              </StyledText>
            </StyledView>

            <StyledTouchableOpacity
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
              <StyledText
                className="text-black font-bold"
                style={{ fontSize: 17 }}
              >
                Done
              </StyledText>
            </StyledTouchableOpacity>
          </StyledView>
        </StyledView>
      </Modal>

      {/* Failed Modal */}
      <Modal visible={showFailed} transparent animationType="fade">
        <StyledView className="flex-1 bg-black items-center justify-center px-5">
          <StyledTouchableOpacity
            onPress={() => setShowFailed(false)}
            className="absolute top-16 right-8"
            style={{ zIndex: 10 }}
          >
            <StyledText className="text-white" style={{ fontSize: 32 }}>
              ×
            </StyledText>
          </StyledTouchableOpacity>

          <StyledView className="items-center w-full">
            <StyledView
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
            </StyledView>

            <StyledText
              className="text-white font-bold"
              style={{
                fontSize: 24,
                marginBottom: 12,
                fontFamily: FONT.Medium,
              }}
            >
              Payment Failed!
            </StyledText>
            <StyledText
              className="text-gray-400 text-center"
              style={{ fontSize: 15, marginBottom: 32 }}
            >
              An error occurred while processing your{"\n"}contribution
            </StyledText>

            <StyledText
              className="text-white"
              style={{ fontSize: 18, marginBottom: 12 }}
            >
              Amount Due
            </StyledText>
            <StyledView
              style={{
                borderRadius: 12,
                borderWidth: 0.3,
                borderColor: "#FCCD34",
                paddingVertical: 24,
                paddingHorizontal: 64,
                marginBottom: 48,
              }}
            >
              <StyledText
                className="text-yellow-400 font-bold text-center"
                style={{ fontSize: 28 }}
              >
                {customAmount || selectedAmount} GEL
              </StyledText>
            </StyledView>

            <StyledTouchableOpacity
              onPress={() => setShowFailed(false)}
              className="bg-[#FCCD34] items-center justify-center"
              style={{
                width: 340,
                height: 48,
                borderRadius: 12,
                marginBottom: 12,
              }}
            >
              <StyledText
                className="text-black font-bold"
                style={{ fontSize: 17, fontFamily: FONT.Bold }}
              >
                Try again
              </StyledText>
            </StyledTouchableOpacity>

            <StyledTouchableOpacity
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
              <StyledText
                className="text-white font-bold"
                style={{ fontSize: 17, fontFamily: FONT.Regular }}
              >
                Back
              </StyledText>
            </StyledTouchableOpacity>

            <StyledText className="text-white" style={{ fontSize: 15 }}>
              Need Help?{" "}
              <StyledText className="text-[#FCCD34] ">
                Contact Support
              </StyledText>
            </StyledText>
          </StyledView>
        </StyledView>
      </Modal>
    </StyledSafeAreaView>
  );
};

export default Donation;
