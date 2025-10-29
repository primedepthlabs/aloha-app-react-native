// app/verification.tsx - Verification Screen
import React, { useState, useRef, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { ChevronLeft } from "lucide-react-native";

export default function VerificationScreen() {
  const params = useLocalSearchParams();
  const phoneNumber = (params.phoneNumber as string) || "";
  const countryCode = (params.countryCode as string) || "+995";

  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [isError, setIsError] = useState(false);
  const [timer, setTimer] = useState(120); // 2 minutes in seconds
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef<any[]>([]);

  // Format phone number with masking (e.g., +995 598 *** ***)
  const formatPhoneNumber = (phone: string, code: string) => {
    if (!phone) return `${code} *** *** ***`;

    const cleanPhone = phone.replace(/\s/g, "");
    if (cleanPhone.length <= 3) return `${code} ${cleanPhone}`;

    const firstPart = cleanPhone.substring(0, 3);
    const masked = "*** ***";
    return `${code} ${firstPart} ${masked}`;
  };

  // Countdown timer effect
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [timer]);

  // Format timer display (mm:ss)
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const handleCodeChange = (text: string, index: number) => {
    const newCode = [...code];
    newCode[index] = text;
    setCode(newCode);
    setIsError(false);

    if (text && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleContinue = () => {
    const enteredCode = code.join("");
    if (enteredCode === "122222") {
      router.push("/(auth)/gender");
    } else {
      setIsError(true);
    }
  };

  const handleResend = () => {
    if (canResend) {
      // Reset timer and code
      setTimer(120);
      setCanResend(false);
      setCode(["", "", "", "", "", ""]);
      setIsError(false);
      // Here you would also trigger the API call to resend SMS
      console.log("Resending SMS to:", countryCode, phoneNumber);
    }
  };

  return (
    <View className="flex-1 bg-black px-6 py-12">
      {/* Header */}
      <View className="flex-row items-center mb-12">
        <TouchableOpacity onPress={() => router.back()}>
          <ChevronLeft size={24} color="#fff" />
        </TouchableOpacity>
        <View className="flex-1 h-1 bg-gray-800 mx-4 rounded-full">
          <View className="w-1/3 h-full bg-yellow-500 rounded-full" />
        </View>
      </View>

      {/* Content */}
      <View>
        <Text className="text-white text-3xl font-bold mb-4 text-center">
          Verification Code
        </Text>
        <Text className="text-gray-400 text-base mb-8 text-center">
          We've sent an SMS with an activation{"\n"}code to{" "}
          {formatPhoneNumber(phoneNumber, countryCode)}
        </Text>

        {/* Code Input */}
        <View className="flex-row justify-between mb-4">
          {code.map((digit, index) => (
            <TextInput
              key={index}
              ref={(ref) => (inputRefs.current[index] = ref)}
              className={`w-14 h-14 rounded-2xl text-white text-2xl text-center ${
                isError
                  ? "border-2 border-red-500 bg-gray-800"
                  : "border-2 border-black-500 bg-gray-800"
              }`}
              maxLength={1}
              keyboardType="number-pad"
              value={digit}
              onChangeText={(text) => handleCodeChange(text, index)}
              onKeyPress={(e) => handleKeyPress(e, index)}
            />
          ))}
        </View>

        {/* Error Message */}
        {isError && (
          <Text className="text-red-500 text-sm mb-4">
            Wrong code, please try again
          </Text>
        )}

        {/* Continue Button */}
        <TouchableOpacity
          className="bg-[#FCCD34] rounded-2xl py-4 px-8 mb-8"
          onPress={handleContinue}
        >
          <Text className="text-white text-center text-lg font-semibold">
            Continue
          </Text>
        </TouchableOpacity>

        {/* Resend Options */}
        <View className="flex-row justify-between items-center">
          <Text className="text-gray-400">
            {canResend
              ? "Ready to resend"
              : `Send code again ${formatTime(timer)}`}
          </Text>
          <TouchableOpacity onPress={handleResend} disabled={!canResend}>
            <Text className={canResend ? "text-yellow-500" : "text-gray-600"}>
              Resend
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
