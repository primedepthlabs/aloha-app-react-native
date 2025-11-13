import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  Modal,
  Dimensions,
  Image,
  TextInput,
  Keyboard,
} from "react-native";
import { ChevronLeft } from "lucide-react-native";
import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
} from "@expo-google-fonts/poppins";
import { useRouter } from "expo-router";

const FONT = {
  Regular: "Poppins_400Regular",
  Medium: "Poppins_500Medium",
  SemiBold: "Poppins_600SemiBold",
  Bold: "Poppins_700Bold",
};

const SCREEN_WIDTH = Dimensions.get("window").width;

const UpdatePasscodeScreen = () => {
  const router = useRouter();
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  const [step, setStep] = useState(1);
  const [currentPasscode, setCurrentPasscode] = useState(["", "", "", ""]);
  const [newPasscode, setNewPasscode] = useState(["", "", "", ""]);
  const [confirmPasscode, setConfirmPasscode] = useState(["", "", "", ""]);
  const [successModalVisible, setSuccessModalVisible] = useState(false);

  const inputRefs = useRef<TextInput[]>([]);

  if (!fontsLoaded) {
    return (
      <View className="flex-1 items-center justify-center bg-black">
        <ActivityIndicator color="#FCCD34" />
      </View>
    );
  }

  const getCurrentPasscode = () => {
    if (step === 1) return currentPasscode;
    if (step === 2) return newPasscode;
    return confirmPasscode;
  };

  const setCurrentPasscodeState = (arr: string[]) => {
    if (step === 1) setCurrentPasscode(arr);
    else if (step === 2) setNewPasscode(arr);
    else setConfirmPasscode(arr);
  };

  const handleChange = (text: string, index: number) => {
    if (!/^\d?$/.test(text)) return; // allow only digits
    const passcode = [...getCurrentPasscode()];
    passcode[index] = text;
    setCurrentPasscodeState(passcode);

    // move focus forward
    if (text && index < 3) inputRefs.current[index + 1].focus();

    // move focus backward if empty
    if (!text && index > 0) inputRefs.current[index - 1].focus();

    if (index === 3 && text) Keyboard.dismiss();
  };

  const isPasscodeComplete = getCurrentPasscode().every((d) => d !== "");

  return (
    <SafeAreaView className="flex-1 bg-black">
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View
        style={{
          height: 60,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          paddingHorizontal: 20,
          position: "relative",
        }}
      >
        <TouchableOpacity
          onPress={() => (step > 1 ? setStep(step - 1) : router.back())}
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
        </TouchableOpacity>
        <Text
          className="text-white"
          style={{ fontSize: 18, fontFamily: FONT.SemiBold }}
        >
          Update Passcode
        </Text>
      </View>

      <View style={{ flex: 1, justifyContent: "space-between" }}>
        <View
          style={{
            paddingHorizontal: 24,
            paddingTop: 30,
            alignItems: "center",
          }}
        >
          {/* Title */}
          <Text
            style={{
              fontSize: 24,
              fontFamily: FONT.SemiBold,
              color: "#FFFFFF",
              marginBottom: 16,
              textAlign: "center",
              lineHeight: 36,
            }}
          >
            {step === 1
              ? "Enter current\npasscode"
              : step === 2
                ? "Choose a new 4 digit\npasscode"
                : "Confirm a new 4 digit\npasscode"}
          </Text>

          {/* Subtitle */}
          <Text
            style={{
              fontSize: 14,
              fontFamily: FONT.Regular,
              color: "rgba(255, 255, 255, 0.5)",
              textAlign: "center",
              lineHeight: 22,
            }}
          >
            {step === 1
              ? "We need to verify your identity\nbefore choosing a new code"
              : "This will replace your previous\nsecurity code"}
          </Text>

          {/* Passcode Dots with hidden inputs */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              gap: 10,
              marginBottom: 32,
              marginTop: 20,
            }}
          >
            {getCurrentPasscode().map((digit, index) => (
              <View
                key={index}
                style={{
                  width: 60,
                  height: 60,
                  backgroundColor: "#19191B",
                  borderRadius: 16,
                  borderWidth: digit ? 0.86 : 0,
                  borderColor: digit ? "#FCCD34" : "transparent",
                  alignItems: "center",
                  justifyContent: "center",
                  position: "relative",
                }}
              >
                <TextInput
                  ref={(el) => (inputRefs.current[index] = el!)}
                  value={digit}
                  onChangeText={(text) => handleChange(text, index)}
                  keyboardType="number-pad"
                  maxLength={1}
                  style={{
                    position: "absolute",
                    width: 60,
                    height: 60,
                    textAlign: "center",
                    color: "transparent",
                    fontSize: 28,
                  }}
                />
                <Text
                  style={{
                    fontSize: 23,
                    fontFamily: FONT.SemiBold,
                    color: "#FFFFFF",
                    pointerEvents: "none",
                  }}
                >
                  {digit}
                </Text>
              </View>
            ))}
          </View>

          {/* Continue Button */}
          <TouchableOpacity
            onPress={() => {
              if (step === 1 && isPasscodeComplete) setStep(2);
              else if (step === 2 && isPasscodeComplete) setStep(3);
              else if (step === 3 && isPasscodeComplete)
                setSuccessModalVisible(true);
            }}
            disabled={!isPasscodeComplete}
            style={{
              backgroundColor: !isPasscodeComplete ? "#d9c85a" : "#FCCD34",
              borderRadius: 15,
              height: 48,
              width: SCREEN_WIDTH - 48,
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 16,
              opacity: !isPasscodeComplete ? 0.6 : 1,
            }}
          >
            <Text
              style={{
                fontSize: 18,
                fontFamily: FONT.SemiBold,
                color: "#000000",
              }}
            >
              Continue
            </Text>
          </TouchableOpacity>

          {/* Forgot Passcode */}
          {step === 1 && (
            <TouchableOpacity>
              <Text
                style={{
                  fontSize: 15,
                  fontFamily: FONT.Regular,
                  color: "rgba(255, 255, 255, 0.5)",
                }}
              >
                Forgot passcode?
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Success Modal */}
      <Modal visible={successModalVisible} transparent animationType="fade">
        <View
          style={{
            flex: 1,
            backgroundColor: "#000000",
            alignItems: "center",
            justifyContent: "center",
            paddingHorizontal: 10,
          }}
        >
          <View style={{ alignItems: "center", width: "100%" }}>
            <View
              style={{
                width: 82,
                height: 82,
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 33,
              }}
            >
              <Image
                source={require("../../../assets/images/Check.png")}
                style={{ width: 120, height: 120 }}
                resizeMode="contain"
              />
            </View>

            <Text
              style={{
                fontSize: 24,
                fontFamily: FONT.Medium,
                color: "#FFFFFF",
                marginBottom: 12,
                textAlign: "center",
                lineHeight: 32,
              }}
            >
              Passcode changed{"\n"}successfully
            </Text>

            <Text
              style={{
                fontSize: 15,
                fontFamily: FONT.Regular,
                color: "#FFFFFF",
                marginBottom: 64,
                textAlign: "center",
                lineHeight: 22,
              }}
            >
              Your new 4-digit passcode has been{"\n"}updated. You can now use
              it to unlock{"\n"}your application.
            </Text>

            <TouchableOpacity
              onPress={() => {
                setSuccessModalVisible(false);
                router.back();
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
              <Text
                style={{
                  fontSize: 15,
                  fontFamily: FONT.Bold,
                  color: "#000000",
                }}
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

export default UpdatePasscodeScreen;
