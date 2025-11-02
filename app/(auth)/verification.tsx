// app/(auth)/verification.tsx - Verification Screen (instrumented & robust)
import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import { supabase } from "../../supabaseClient";

export default function VerificationScreen() {
  const params = useLocalSearchParams();
  const phoneNumberParam = (params.phoneNumber as string) || ""; // digits only
  const countryCodeParam = (params.countryCode as string) || ""; // digits only

  // Reconstruct E.164 (always add +)
  const fullPhoneNumber = `+${countryCodeParam.replace(
    /\D/g,
    ""
  )}${phoneNumberParam.replace(/\D/g, "")}`;

  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [timer, setTimer] = useState(120);
  const [canResend, setCanResend] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const inputRefs = useRef<any[]>([]);

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

  const formatPhoneNumber = (phone: string, code: string) => {
    if (!phone) return `+${code} *** *** ***`;
    const cleanPhone = phone.replace(/\s/g, "");
    if (cleanPhone.length <= 3) return `+${code} ${cleanPhone}`;
    const firstPart = cleanPhone.substring(0, 3);
    const masked = "*** ***";
    return `+${code} ${firstPart} ${masked}`;
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const handleCodeChange = (text: string, index: number) => {
    const newCode = [...code];
    newCode[index] = text.replace(/\D/g, ""); // digits only
    setCode(newCode);
    setIsError(false);
    setErrorMessage("");
    if (text && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleResend = async () => {
    if (!canResend || resending) return;
    setResending(true);
    try {
      console.log("Resending OTP to:", fullPhoneNumber);
      const { data, error: resendError } = await supabase.auth.signInWithOtp({
        phone: fullPhoneNumber,
      });

      if (resendError) {
        console.error("Resend Error:", resendError);
        Alert.alert(
          "Error",
          `Failed to resend code. ${resendError.message || ""}`
        );
        setResending(false);
        return;
      }

      console.log("Code resent successfully (response):", data);
      setTimer(120);
      setCanResend(false);
      setCode(["", "", "", "", "", ""]);
      setIsError(false);
      setErrorMessage("");
      Alert.alert("Success", "Verification code has been resent");
    } catch (err: any) {
      console.error("Error resending code:", err);
      Alert.alert("Error", "Failed to resend code. Please try again.");
    } finally {
      setResending(false);
    }
  };

  const handleContinue = async () => {
    const enteredCode = code.join("");
    if (enteredCode.length !== 6) {
      setIsError(true);
      setErrorMessage("Please enter complete verification code");
      return;
    }

    setLoading(true);
    setIsError(false);
    setErrorMessage("");

    try {
      console.log(
        "Verifying OTP — phone:",
        fullPhoneNumber,
        "token:",
        enteredCode
      );

      const { data, error: verifyError } = await supabase.auth.verifyOtp({
        phone: fullPhoneNumber,
        token: enteredCode,
        type: "sms",
      });

      console.log(
        "verifyOtp response data:",
        data,
        "verifyError:",
        verifyError
      );

      if (verifyError) {
        console.error("Verification Error:", verifyError);

        const msg = (verifyError.message || "").toLowerCase();

        if (msg.includes("expired")) {
          Alert.alert(
            "Code expired",
            "The verification code has expired. Would you like to resend a new code?",
            [
              { text: "Cancel", style: "cancel" },
              {
                text: "Resend",
                onPress: () => {
                  setTimer(0);
                  setCanResend(true);
                  handleResend();
                },
              },
            ]
          );

          setIsError(true);
          setErrorMessage("Code expired. Please resend a new code.");
          setLoading(false);
          return;
        }

        if (
          msg.includes("invalid") ||
          msg.includes("wrong") ||
          msg.includes("token")
        ) {
          setIsError(true);
          setErrorMessage(
            "Invalid code. Double-check the SMS code and try again."
          );
        } else {
          setIsError(true);
          setErrorMessage(
            verifyError.message || "Wrong code, please try again"
          );
        }

        setLoading(false);
        return;
      }

      // If verifyOtp returned no user/session -> surface it
      if (!data || !data.user) {
        console.warn("verifyOtp did not return user/session. Data:", data);
        Alert.alert(
          "Authentication failed",
          "Verification succeeded but no authenticated user/session was returned. Please try again."
        );
        setLoading(false);
        return;
      }

      console.log("Verification successful — authenticated user:", data.user);

      const userId = data.user.id;

      // Check if user exists in public.users table
      const { data: existingUser, error: fetchError } = await supabase
        .from("users")
        .select("*")
        .eq("id", userId)
        .single();

      console.log("existingUser query result:", { existingUser, fetchError });

      if (fetchError && fetchError.code !== "PGRST116") {
        console.error("Error checking user:", fetchError);
      }

      if (!existingUser) {
        console.log("New user — navigating to profile setup", {
          userId,
          fullPhoneNumber,
        });
        // use runtime route /profile (group folders removed)
        router.replace({
          pathname: "/(auth)/profile",
          params: {
            userId,
            phoneNumber: fullPhoneNumber,
          },
        });
      } else {
        console.log("Existing user — navigating to discover");
        router.replace("/discover");
      }
    } catch (err: any) {
      console.error("Error verifying OTP (catch):", err);
      setIsError(true);
      setErrorMessage("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-black px-6 py-12">
      <View className="flex-row items-center mb-12">
        <TouchableOpacity
          onPress={() => router.back()}
          disabled={loading || resending}
        >
          <ChevronLeft size={24} color="#fff" />
        </TouchableOpacity>
        <View className="flex-1 h-1 bg-gray-800 mx-4 rounded-full">
          <View className="w-1/3 h-full bg-yellow-500 rounded-full" />
        </View>
      </View>

      <View>
        <Text className="text-white text-3xl font-bold mb-4 text-center">
          Verification Code
        </Text>
        <Text className="text-gray-400 text-base mb-8 text-center">
          We've sent an SMS with an activation{"\n"}code to{" "}
          {formatPhoneNumber(phoneNumberParam, countryCodeParam)}
        </Text>

        <View className="flex-row justify-between mb-4">
          {code.map((digit, index) => (
            <TextInput
              key={index}
              ref={(ref) => (inputRefs.current[index] = ref)}
              className={`w-14 h-14 rounded-2xl text-white text-2xl text-center ${
                isError
                  ? "border-2 border-red-500 bg-gray-800"
                  : "border-2 border-gray-700 bg-gray-800"
              }`}
              maxLength={1}
              keyboardType="number-pad"
              value={digit}
              editable={!loading && !resending}
              onChangeText={(text) => handleCodeChange(text, index)}
              onKeyPress={(e) => handleKeyPress(e, index)}
            />
          ))}
        </View>

        {isError && errorMessage && (
          <Text className="text-red-500 text-sm mb-4 text-center">
            {errorMessage}
          </Text>
        )}

        <TouchableOpacity
          className={`rounded-2xl py-4 px-8 mb-8 ${
            loading ? "bg-gray-700" : "bg-[#FCCD34]"
          }`}
          onPress={handleContinue}
          disabled={loading || resending}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text className="text-white text-center text-lg font-semibold">
              Continue
            </Text>
          )}
        </TouchableOpacity>

        <View className="flex-row justify-between items-center">
          <Text className="text-gray-400">
            {canResend
              ? "Ready to resend"
              : `Send code again ${formatTime(timer)}`}
          </Text>
          <TouchableOpacity
            onPress={handleResend}
            disabled={!canResend || resending}
          >
            {resending ? (
              <ActivityIndicator size="small" color="#FCCD34" />
            ) : (
              <Text className={canResend ? "text-yellow-500" : "text-gray-600"}>
                Resend
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
