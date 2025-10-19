import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  ScrollView,
  TextInput,
  Modal,
  Dimensions,
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
const StyledScrollView = styled(ScrollView);
const StyledTextInput = styled(TextInput);

const FONT = {
  Regular: "Poppins_400Regular",
  Medium: "Poppins_500Medium",
  SemiBold: "Poppins_600SemiBold",
  Bold: "Poppins_700Bold",
};

const SCREEN_WIDTH = Dimensions.get("window").width;

const VerificationScreen = () => {
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  const [step, setStep] = useState(1); // 1: Start, 2: Email Input, 3: Code Input
  const [email, setEmail] = useState("");
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const inputRefs = useRef<(TextInput | null)[]>([]);

  if (!fontsLoaded) {
    return (
      <View className="flex-1 items-center justify-center bg-black">
        <ActivityIndicator color="#FCCD34" />
      </View>
    );
  }

  const handleCodeChange = (text: string, index: number) => {
    const newCode = [...code];
    newCode[index] = text;
    setCode(newCode);

    // Auto-focus next input
    if (text && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSendVerificationCode = async () => {
    setIsSending(true);
    try {
      // Simulate API call
      await new Promise((res) => setTimeout(res, 800));
      setStep(3);
    } catch (e) {
      console.warn("send code failed", e);
    } finally {
      setIsSending(false);
    }
  };

  const handleContinue = async () => {
    setIsSending(true);
    try {
      // Simulate API call to verify code
      await new Promise((res) => setTimeout(res, 800));
      setSuccessModalVisible(true);
    } catch (e) {
      console.warn("verification failed", e);
    } finally {
      setIsSending(false);
    }
  };

  const handleResendCode = () => {
    console.log("Resending code...");
  };

  const isCodeComplete = code.every((digit) => digit.length === 1);

  // Step 1: Start Verification Screen
  if (step === 1) {
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
            onPress={() => router.back()}
            style={{
              position: "absolute",
              left: 20,
              width: 40,
              height: 40,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <ChevronLeft size={24} color="#FFFFFF" strokeWidth={2} />
          </StyledTouchableOpacity>
          <StyledText
            className="text-white"
            style={{
              fontSize: 18,
              fontFamily: FONT.SemiBold,
            }}
          >
            Verification
          </StyledText>
        </StyledView>

        <StyledScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{
            paddingHorizontal: 24,
            paddingTop: 30,
            paddingBottom: 40,
            alignItems: "center",
          }}
        >
          {/* Icon - Purple Icon Image */}
          <StyledView
            style={{
              width: 50,
              height: 47,
              marginBottom: 24,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Image
              source={require("../../../assets/images/profile/purple-icon.png")}
              style={{
                width: 50,
                height: 47,
                resizeMode: "contain",
              }}
            />
          </StyledView>

          <StyledText
            style={{
              fontSize: 18,
              fontFamily: FONT.Bold,
              color: "#FFFFFF",
              marginBottom: 18,
            }}
          >
            Start verification
          </StyledText>

          {/* Info Box */}
          <StyledView
            style={{
              width: SCREEN_WIDTH - 48,
              backgroundColor: "#1C1C1E",
              borderRadius: 20,
              padding: 24,
              marginBottom: 40,
            }}
          >
            <StyledText
              style={{
                fontSize: 18,
                fontFamily: FONT.Medium,
                color: "#FFFFFF",
                marginBottom: 12,
                textAlign: "center",
              }}
            >
              Why add your Email?
            </StyledText>
            <StyledText
              style={{
                fontSize: 15,
                fontFamily: FONT.Regular,
                color: "#FFFFFF",
                lineHeight: 22,
                textAlign: "center",
              }}
            >
              Adding your email address allows us to: Send you important account
              updates and notifications, Provide a secondary way to recover your
              password or Passcode. Verify your account ownership in case of
              suspicious activity.
            </StyledText>
          </StyledView>

          {/* Continue Button */}
          <StyledTouchableOpacity
            onPress={() => setStep(2)}
            style={{
              backgroundColor: "#FCCD34",
              borderRadius: 15,
              height: 48,
              width: SCREEN_WIDTH - 48,
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 16,
            }}
          >
            <StyledText
              style={{
                fontSize: 18,
                fontFamily: FONT.SemiBold,
                color: "#000000",
              }}
            >
              Continue verification
            </StyledText>
          </StyledTouchableOpacity>

          {/* Not Now Button */}
          <StyledTouchableOpacity
            onPress={() => router.back()}
            style={{
              backgroundColor: "#1C1C1E",
              borderRadius: 15,
              height: 48,
              width: SCREEN_WIDTH - 48,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <StyledText
              style={{
                fontSize: 18,
                fontFamily: FONT.SemiBold,
                color: "#FFFFFF",
              }}
            >
              Not now
            </StyledText>
          </StyledTouchableOpacity>
        </StyledScrollView>
      </StyledSafeAreaView>
    );
  }

  // Step 2: Enter Email Screen
  if (step === 2) {
    return (
      <StyledSafeAreaView className="flex-1 bg-black">
        <StatusBar barStyle="light-content" />

        {/* Header with Progress Bar */}
        <StyledView
          style={{
            height: 60,
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: 20,
            position: "relative",
          }}
        >
          <StyledTouchableOpacity
            onPress={() => setStep(1)}
            style={{
              width: 40,
              height: 40,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <ChevronLeft size={24} color="#FFFFFF" strokeWidth={2} />
          </StyledTouchableOpacity>

          {/* Progress Bar */}
          <StyledView
            style={{
              flex: 1,
              height: 4,
              backgroundColor: "#3A3A3C",
              borderRadius: 2,
              marginLeft: 16,
              overflow: "hidden",
            }}
          >
            <View className="w-1/3 h-full bg-yellow-500 rounded-full" />
          </StyledView>
        </StyledView>

        <StyledScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{
            paddingHorizontal: 24,
            paddingTop: 40,
            paddingBottom: 40,
          }}
        >
          <StyledText
            style={{
              fontSize: 24,
              fontFamily: FONT.SemiBold,
              color: "#FFFFFF",
              marginBottom: 12,
              textAlign: "center",
            }}
          >
            Enter your email
          </StyledText>

          <StyledText
            style={{
              fontSize: 15,
              fontFamily: FONT.Regular,
              color: "#8E8E93",
              marginBottom: 40,
              lineHeight: 22,
              textAlign: "center",
            }}
          >
            Enter your email address to receive a 6-digit verification code
          </StyledText>

          {/* Email Input */}
          <StyledTextInput
            value={email}
            onChangeText={setEmail}
            placeholder="Enter your email"
            placeholderTextColor="#6F6F70"
            keyboardType="email-address"
            autoCapitalize="none"
            style={{
              width: SCREEN_WIDTH - 48,
              height: 48,
              backgroundColor: "#19191B",
              borderWidth: 1,
              borderColor: "#474747",
              borderRadius: 15,
              paddingHorizontal: 20,
              fontSize: 16,
              fontFamily: FONT.Regular,
              color: "#FFFFFF",
              marginBottom: 24,
            }}
          />

          {/* Send Button */}
          <StyledTouchableOpacity
            onPress={handleSendVerificationCode}
            disabled={!email || isSending}
            style={{
              backgroundColor: !email || isSending ? "#d9c85a" : "#FCCD34",
              borderRadius: 15,
              height: 48,
              width: SCREEN_WIDTH - 48,
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 24,
              opacity: !email || isSending ? 0.6 : 1,
            }}
          >
            {isSending ? (
              <ActivityIndicator color="#000000" />
            ) : (
              <StyledText
                style={{
                  fontSize: 18,
                  fontFamily: FONT.SemiBold,
                  color: "#000000",
                }}
              >
                Send verification code
              </StyledText>
            )}
          </StyledTouchableOpacity>

          <StyledText
            style={{
              fontSize: 14,
              fontFamily: FONT.Regular,
              color: "#6F6F70",
              textAlign: "center",
              lineHeight: 20,
            }}
          >
            We'll send a code to your inbox. Check your spam folder if you don't
            see it.
          </StyledText>
        </StyledScrollView>
      </StyledSafeAreaView>
    );
  }

  // Step 3: Verification Code Screen
  return (
    <StyledSafeAreaView className="flex-1 bg-black">
      <StatusBar barStyle="light-content" />

      {/* Header with Progress Bar */}
      <StyledView
        style={{
          height: 60,
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 20,
          position: "relative",
        }}
      >
        <StyledTouchableOpacity
          onPress={() => setStep(2)}
          style={{
            width: 40,
            height: 40,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <ChevronLeft size={24} color="#FFFFFF" strokeWidth={2} />
        </StyledTouchableOpacity>

        {/* Progress Bar */}
        <StyledView
          style={{
            flex: 1,
            height: 4,
            backgroundColor: "#3A3A3C",
            borderRadius: 2,
            marginLeft: 16,
            overflow: "hidden",
          }}
        >
          <View className="w-2/3 h-full bg-yellow-500 rounded-full" />
        </StyledView>
      </StyledView>

      <StyledScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingHorizontal: 24,
          paddingTop: 40,
          paddingBottom: 40,
        }}
      >
        <StyledText
          style={{
            fontSize: 24,
            fontFamily: FONT.SemiBold,
            color: "#FFFFFF",
            marginBottom: 12,
            textAlign: "center",
          }}
        >
          Verification Code
        </StyledText>

        <StyledText
          style={{
            fontSize: 14,
            fontFamily: FONT.Regular,
            color: "#8E8E93",
            lineHeight: 22,
            marginBottom: 40,
            textAlign: "center",
          }}
        >
          We've sent an SMS with an activation code to{" "}
          <StyledText style={{ color: "#FFFFFF", fontFamily: FONT.Regular }}>
            {email || "Ellensio@gmail.com"}
          </StyledText>
        </StyledText>

        {/* Code Input Boxes */}
        <StyledView
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: 40,
            paddingHorizontal: 0,
          }}
        >
          {code.map((digit, index) => (
            <StyledView
              key={index}
              style={{
                width: 52,
                height: 64,
                backgroundColor: "#1C1C1E",
                borderRadius: 12,
                borderWidth: digit ? 1 : 0,
                borderColor: digit ? "#FCCD34" : "transparent",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <StyledTextInput
                ref={(el) => (inputRefs.current[index] = el)}
                value={digit}
                onChangeText={(text) => handleCodeChange(text, index)}
                onKeyPress={(e) => handleKeyPress(e, index)}
                keyboardType="number-pad"
                maxLength={1}
                style={{
                  fontSize: 23,
                  fontFamily: FONT.Regular,
                  color: "#FFFFFF",
                  textAlign: "center",
                  width: "100%",
                  height: "100%",
                }}
              />
            </StyledView>
          ))}
        </StyledView>

        {/* Continue Button */}
        <StyledTouchableOpacity
          onPress={handleContinue}
          disabled={!isCodeComplete || isSending}
          style={{
            backgroundColor:
              !isCodeComplete || isSending ? "#d9c85a" : "#FCCD34",
            borderRadius: 15,
            height: 48,
            width: SCREEN_WIDTH - 48,
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 32,
            opacity: !isCodeComplete || isSending ? 0.6 : 1,
          }}
        >
          {isSending ? (
            <ActivityIndicator color="#000000" />
          ) : (
            <StyledText
              style={{
                fontSize: 18,
                fontFamily: FONT.SemiBold,
                color: "#000000",
              }}
            >
              Continue
            </StyledText>
          )}
        </StyledTouchableOpacity>

        {/* Resend Code */}
        <StyledView
          style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <StyledText
            style={{
              fontSize: 14,
              fontFamily: FONT.Regular,
              color: "#8E8E93",
            }}
          >
            I didn't receive a code{" "}
          </StyledText>
          <StyledTouchableOpacity onPress={handleResendCode}>
            <StyledText
              style={{
                fontSize: 16,
                fontFamily: FONT.SemiBold,
                color: "#FCCD34",
              }}
            >
              Resend
            </StyledText>
          </StyledTouchableOpacity>
        </StyledView>
      </StyledScrollView>

      {/* Success Modal */}
      <Modal
        visible={successModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => {}}
      >
        <StyledView
          style={{
            flex: 1,
            backgroundColor: "#000000",
            alignItems: "center",
            justifyContent: "center",
            paddingHorizontal: 20,
          }}
        >
          <StyledView style={{ alignItems: "center", width: "100%" }}>
            <StyledView
              style={{
                width: 120,
                height: 120,
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 7,
                marginTop: -12,
              }}
            >
              <Image
                source={require("../../../assets/images/Check.png")}
                style={{ width: 120, height: 120 }}
                resizeMode="contain"
              />
            </StyledView>

            <StyledText
              style={{
                fontSize: 24,
                fontFamily: FONT.Medium,
                color: "#FFFFFF",
                marginBottom: 12,
                textAlign: "center",
              }}
            >
              Email Successfully Verified!
            </StyledText>

            <StyledText
              style={{
                fontSize: 15,
                fontFamily: FONT.Regular,
                color: "#FFFFFF",
                marginBottom: 60,
                textAlign: "center",
                lineHeight: 22,
              }}
            >
              Your email address has been successfully added to your account for
              future communications and recovery.
            </StyledText>

            <StyledTouchableOpacity
              onPress={() => {
                setSuccessModalVisible(false);
                // Navigate to settings
                // router.replace("/settings");
              }}
              style={{
                backgroundColor: "#FCCD34",
                alignItems: "center",
                justifyContent: "center",
                width: SCREEN_WIDTH - 48,
                height: 48,
                borderRadius: 15,
              }}
            >
              <StyledText
                style={{
                  fontSize: 15,
                  fontFamily: FONT.Bold,
                  color: "#000000",
                }}
              >
                Go to settings
              </StyledText>
            </StyledTouchableOpacity>
          </StyledView>
        </StyledView>
      </Modal>
    </StyledSafeAreaView>
  );
};

export default VerificationScreen;
