import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  Image,
  Dimensions,
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

const AddFunds = () => {
  const [amount, setAmount] = useState("");
  const [selectedPayment, setSelectedPayment] = useState("");
  const [showCardOptions, setShowCardOptions] = useState(false);

  const balance = 12;

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

  const handlePaymentSelect = (method: string) => {
    setSelectedPayment(method);
    if (method === "card") {
      setShowCardOptions(!showCardOptions);
    } else {
      setShowCardOptions(false);
    }
  };

  const handleContinue = () => {
    // Implement continue logic
    console.log("Continue with amount:", amount, "payment:", selectedPayment);
  };

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
            onPress={() => router.back()}
            className="absolute left-4"
            style={{ zIndex: 10 }}
          >
            <ChevronLeft size={24} color="#fff" strokeWidth={2.5} />
          </StyledTouchableOpacity>
          <StyledText
            className="text-white text-center flex-1 font-semibold"
            style={{ fontSize: 18, fontFamily: FONT.SemiBold }}
          >
            Add Funds
          </StyledText>
        </StyledView>

        <StyledView style={{ paddingHorizontal: 24, paddingTop: 20 }}>
          {/* Current Balance Card */}
          <StyledView
            style={{
              width: 331,
              height: 69,
              backgroundColor: "#1C1C1E",
              borderRadius: 15,
              paddingVertical: 13,
              paddingHorizontal: 20,
              marginBottom: 24,
            }}
          >
            <StyledText
              style={{
                fontSize: 12,
                fontFamily: FONT.Regular,
                color: "#FFFFFF",
                marginBottom: 4,
              }}
            >
              Current Balance:
            </StyledText>
            <StyledText
              style={{
                fontSize: 20,
                fontFamily: FONT.Bold,
                color: "#FCCD34",
              }}
            >
              {balance} GEL
            </StyledText>
          </StyledView>

          {/* Enter Amount Section */}
          <StyledText
            style={{
              fontSize: 18,
              fontFamily: FONT.Medium,
              color: "#FFFFFF",
              marginBottom: 12,
            }}
          >
            Enter amount
          </StyledText>

          <StyledTextInput
            value={amount}
            onChangeText={setAmount}
            placeholder="50"
            placeholderTextColor="#6F6F70"
            keyboardType="numeric"
            style={{
              width: SCREEN_WIDTH - 48,
              height: 56,
              backgroundColor: "#1C1C1E",
              borderRadius: 15,
              paddingHorizontal: 20,
              fontSize: 16,
              fontFamily: FONT.Regular,
              color: "#FFFFFF",
              marginBottom: 24,
            }}
          />

          {/* Select Payment Method Section */}
          <StyledText
            style={{
              fontSize: 18,
              fontFamily: FONT.Medium,
              color: "#FFFFFF",
              marginBottom: 12,
            }}
          >
            Select Payment Method
          </StyledText>

          {/* Apple Pay Option */}
          <StyledTouchableOpacity
            onPress={() => handlePaymentSelect("apple")}
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              width: SCREEN_WIDTH - 48,
              height: 56,
              borderRadius: 15,
              paddingHorizontal: 16,
              marginBottom: 12,
              borderWidth: selectedPayment === "apple" ? 1 : 0.5,
              borderColor: selectedPayment === "apple" ? "#FCCD34" : "#3A3A3C",
              backgroundColor: "#1C1C1E",
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
                style={{
                  fontSize: 16,
                  fontFamily: FONT.Regular,
                  color: "#FFFFFF",
                }}
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
              width: SCREEN_WIDTH - 48,
              height: 56,
              borderRadius: 15,
              paddingHorizontal: 16,
              marginBottom: showCardOptions ? 12 : 24,
              borderWidth: selectedPayment === "card" ? 1 : 0.5,
              borderColor: selectedPayment === "card" ? "#FCCD34" : "#3A3A3C",
              backgroundColor: "#1C1C1E",
            }}
          >
            <StyledView className="flex-row items-center flex-1">
              <StyledView className="w-10 h-10 rounded-[8px] mr-3 items-center justify-center">
                <Image
                  source={require("../../../assets/images/profile/debitcard.png")}
                  className="w-6 h-6"
                  resizeMode="contain"
                />
              </StyledView>
              <StyledText
                style={{
                  fontSize: 16,
                  fontFamily: FONT.Regular,
                  color: "#FFFFFF",
                }}
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
            <StyledView style={{ marginBottom: 12 }}>
              {/* MasterCard */}
              <StyledTouchableOpacity
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  width: SCREEN_WIDTH - 48,
                  height: 56,
                  backgroundColor: "#2C2C2E",
                  borderRadius: 15,
                  paddingHorizontal: 16,
                  marginBottom: 12,
                }}
              >
                <StyledView className="w-10 h-7 rounded-[6px] bg-red-600 mr-3 relative items-center justify-center">
                  <StyledView className="w-5 h-5 bg-red-700 rounded-full absolute left-0" />
                  <StyledView className="w-5 h-5 bg-orange-500 rounded-full absolute right-0" />
                </StyledView>
                <StyledText
                  style={{
                    fontSize: 15,
                    fontFamily: FONT.Regular,
                    color: "#FFFFFF",
                  }}
                >
                  MASTERCARD **** 5100
                </StyledText>
              </StyledTouchableOpacity>

              {/* Visa */}
              <StyledTouchableOpacity
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  width: SCREEN_WIDTH - 48,
                  height: 56,
                  backgroundColor: "#2C2C2E",
                  borderRadius: 15,
                  paddingHorizontal: 16,
                  marginBottom: 12,
                }}
              >
                <StyledView className="w-10 h-7 rounded-[6px] bg-blue-600 mr-3 items-center justify-center">
                  <StyledText className="text-white font-bold text-[12px]">
                    VISA
                  </StyledText>
                </StyledView>
                <StyledText
                  style={{
                    fontSize: 15,
                    fontFamily: FONT.Regular,
                    color: "#FFFFFF",
                  }}
                >
                  VISA **** 5100
                </StyledText>
              </StyledTouchableOpacity>

              {/* Add Card Button */}
              <StyledTouchableOpacity
                onPress={() => router.push("/(tabs)/discover/addCard")}
                style={{
                  width: SCREEN_WIDTH - 48,
                  height: 48,
                  borderRadius: 15,
                  borderWidth: 0.5,
                  borderColor: "#3A3A3C",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 12,
                  backgroundColor: "transparent",
                }}
              >
                <StyledText
                  style={{
                    fontSize: 16,
                    fontFamily: FONT.Medium,
                    color: "#FFFFFF",
                  }}
                >
                  + Add Card
                </StyledText>
              </StyledTouchableOpacity>
            </StyledView>
          )}

          {/* Continue Button */}
          <StyledTouchableOpacity
            onPress={handleContinue}
            style={{
              width: SCREEN_WIDTH - 48,
              height: 48,
              borderRadius: 15,
              backgroundColor: "#FCCD34",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 32,
            }}
          >
            <StyledText
              style={{
                fontSize: 18,
                fontFamily: FONT.SemiBold,
                color: "#000000",
              }}
            >
              Continue
            </StyledText>
          </StyledTouchableOpacity>

          {/* Contact Support */}
          <StyledView
            style={{
              alignItems: "center",
              marginBottom: 32,
            }}
          >
            <StyledText
              style={{
                fontSize: 15,
                fontFamily: FONT.Regular,
                color: "#FFFFFF",
              }}
            >
              Need Help?{" "}
              <StyledText style={{ color: "#FCCD34", fontFamily: FONT.Medium }}>
                Contact Support
              </StyledText>
            </StyledText>
          </StyledView>
        </StyledView>
      </StyledScrollView>
    </StyledSafeAreaView>
  );
};

export default AddFunds;
