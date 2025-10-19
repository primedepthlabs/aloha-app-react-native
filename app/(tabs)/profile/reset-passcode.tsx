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
import { styled } from "nativewind";
import { ChevronLeft } from "lucide-react-native";
import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
} from "@expo-google-fonts/poppins";
import { useRouter } from "expo-router";

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity);
const StyledSafeAreaView = styled(SafeAreaView);

const FONT = {
  Regular: "Poppins_400Regular",
  Medium: "Poppins_500Medium",
  SemiBold: "Poppins_600SemiBold",
  Bold: "Poppins_700Bold",
};

const SCREEN_WIDTH = Dimensions.get("window").width;

const ResetPasswordScreen = () => {
  const router = useRouter();
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  const [step, setStep] = useState(1);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [verificationCode, setVerificationCode] = useState([
    "",
    "",
    "",
    "",
    "",
    "",
  ]);
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
    if (step === 2) return verificationCode;
    if (step === 3) return newPasscode;
    return confirmPasscode;
  };

  const setCurrentPasscodeState = (arr: string[]) => {
    if (step === 2) setVerificationCode(arr);
    else if (step === 3) setNewPasscode(arr);
    else setConfirmPasscode(arr);
  };

  const handleChange = (text: string, index: number) => {
    if (!/^\d?$/.test(text)) return;
    const passcode = [...getCurrentPasscode()];
    passcode[index] = text;
    setCurrentPasscodeState(passcode);

    const maxIndex = step === 2 ? 5 : 3;
    if (text && index < maxIndex) inputRefs.current[index + 1].focus();
    if (!text && index > 0) inputRefs.current[index - 1].focus();
    if (index === maxIndex && text) Keyboard.dismiss();
  };

  const isPasscodeComplete = getCurrentPasscode().every((d) => d !== "");
  const isPhoneNumberValid = phoneNumber.length >= 9;

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
        </StyledTouchableOpacity>
        <StyledText
          className="text-white"
          style={{ fontSize: 18, fontFamily: FONT.SemiBold }}
        >
          Reset Passcode
        </StyledText>
      </StyledView>

      <StyledView style={{ flex: 1, justifyContent: "space-between" }}>
        <StyledView
          style={{
            paddingHorizontal: 24,
            paddingTop: 30,
            alignItems: "center",
          }}
        >
          {/* Step 1: Phone Number */}
          {step === 1 && (
            <>
              <StyledText
                style={{
                  fontSize: 24,
                  fontFamily: FONT.SemiBold,
                  color: "#FFFFFF",
                  marginBottom: 16,
                  textAlign: "center",
                  lineHeight: 36,
                }}
              >
                Forgot Password?
              </StyledText>

              <StyledText
                style={{
                  fontSize: 14,
                  fontFamily: FONT.Regular,
                  color: "rgba(255, 255, 255, 0.5)",
                  textAlign: "center",
                  lineHeight: 22,
                  marginBottom: 32,
                }}
              >
                Please enter your phone number to get{"\n"}the reset password
                code
              </StyledText>

              <StyledView
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  backgroundColor: "#19191B",
                  borderRadius: 16,
                  height: 56,
                  paddingHorizontal: 16,
                  marginBottom: 32,
                  width: SCREEN_WIDTH - 48,
                }}
              >
                <StyledView
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginRight: 12,
                  }}
                >
                  <StyledText
                    style={{
                      fontSize: 24,
                      marginRight: 6,
                    }}
                  >
                    🇬🇪
                  </StyledText>
                  <StyledText
                    style={{
                      fontSize: 16,
                      fontFamily: FONT.Regular,
                      color: "#FFFFFF",
                    }}
                  >
                    (+995)
                  </StyledText>
                </StyledView>
                <TextInput
                  value={phoneNumber}
                  onChangeText={setPhoneNumber}
                  placeholder="598 *** 323"
                  placeholderTextColor="rgba(255, 255, 255, 0.3)"
                  keyboardType="phone-pad"
                  style={{
                    flex: 1,
                    fontSize: 16,
                    fontFamily: FONT.Regular,
                    color: "#FFFFFF",
                  }}
                />
              </StyledView>

              <StyledTouchableOpacity
                onPress={() => setStep(2)}
                disabled={!isPhoneNumberValid}
                style={{
                  backgroundColor: !isPhoneNumberValid ? "#d9c85a" : "#FCCD34",
                  borderRadius: 15,
                  height: 48,
                  width: SCREEN_WIDTH - 48,
                  alignItems: "center",
                  justifyContent: "center",
                  opacity: !isPhoneNumberValid ? 0.6 : 1,
                }}
              >
                <StyledText
                  style={{
                    fontSize: 18,
                    fontFamily: FONT.SemiBold,
                    color: "#000000",
                  }}
                >
                  Send
                </StyledText>
              </StyledTouchableOpacity>
            </>
          )}

          {/* Step 2: Verification Code */}
          {step === 2 && (
            <>
              <StyledText
                style={{
                  fontSize: 24,
                  fontFamily: FONT.SemiBold,
                  color: "#FFFFFF",
                  marginBottom: 16,
                  textAlign: "center",
                  lineHeight: 36,
                }}
              >
                Verification Code
              </StyledText>

              <StyledText
                style={{
                  fontSize: 14,
                  fontFamily: FONT.Regular,
                  color: "rgba(255, 255, 255, 0.5)",
                  textAlign: "center",
                  lineHeight: 22,
                }}
              >
                We've sent an SMS with an activation{"\n"}code to{" "}
                <StyledText
                  style={{ color: "#FFFFFF", fontFamily: FONT.Medium }}
                >
                  +995 598 *** 323
                </StyledText>
              </StyledText>

              <StyledView
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  gap: 10,
                  marginBottom: 32,
                  marginTop: 32,
                }}
              >
                {verificationCode.map((digit, index) => (
                  <StyledView
                    key={index}
                    style={{
                      width: 50,
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
                        width: 50,
                        height: 60,
                        textAlign: "center",
                        color: "transparent",
                        fontSize: 23,
                      }}
                    />
                    <StyledText
                      style={{
                        fontSize: 23,
                        fontFamily: FONT.SemiBold,
                        color: "#FFFFFF",
                        pointerEvents: "none",
                      }}
                    >
                      {digit}
                    </StyledText>
                  </StyledView>
                ))}
              </StyledView>

              <StyledTouchableOpacity
                onPress={() => setStep(3)}
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
                <StyledText
                  style={{
                    fontSize: 18,
                    fontFamily: FONT.SemiBold,
                    color: "#000000",
                  }}
                >
                  Verify
                </StyledText>
              </StyledTouchableOpacity>

              <StyledView
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <StyledText
                  style={{
                    fontSize: 15,
                    fontFamily: FONT.Regular,
                    color: "rgba(255, 255, 255, 0.5)",
                  }}
                >
                  I didn't receive a code
                </StyledText>
                <StyledTouchableOpacity>
                  <StyledText
                    style={{
                      fontSize: 15,
                      fontFamily: FONT.Regular,
                      color: "#FCCD34",
                    }}
                  >
                    Resend
                  </StyledText>
                </StyledTouchableOpacity>
              </StyledView>
            </>
          )}

          {/* Step 3 & 4: Same as Update Password */}
          {(step === 3 || step === 4) && (
            <>
              <StyledText
                style={{
                  fontSize: 24,
                  fontFamily: FONT.SemiBold,
                  color: "#FFFFFF",
                  marginBottom: 16,
                  textAlign: "center",
                  lineHeight: 36,
                }}
              >
                {step === 3
                  ? "Create a new 4 digit\npasscode"
                  : "Confirm a new 4 digit\npasscode"}
              </StyledText>

              <StyledText
                style={{
                  fontSize: 14,
                  fontFamily: FONT.Regular,
                  color: "rgba(255, 255, 255, 0.5)",
                  textAlign: "center",
                  lineHeight: 22,
                }}
              >
                This will replace your previous{"\n"}security code
              </StyledText>

              <StyledView
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  gap: 10,
                  marginBottom: 32,
                  marginTop: 20,
                }}
              >
                {getCurrentPasscode().map((digit, index) => (
                  <StyledView
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
                    <StyledText
                      style={{
                        fontSize: 23,
                        fontFamily: FONT.SemiBold,
                        color: "#FFFFFF",
                        pointerEvents: "none",
                      }}
                    >
                      {digit}
                    </StyledText>
                  </StyledView>
                ))}
              </StyledView>

              <StyledTouchableOpacity
                onPress={() => {
                  if (step === 3 && isPasscodeComplete) setStep(4);
                  else if (step === 4 && isPasscodeComplete)
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
                  opacity: !isPasscodeComplete ? 0.6 : 1,
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
            </>
          )}
        </StyledView>
      </StyledView>

      {/* Success Modal */}
      <Modal visible={successModalVisible} transparent animationType="fade">
        <StyledView
          style={{
            flex: 1,
            backgroundColor: "#000000",
            alignItems: "center",
            justifyContent: "center",
            paddingHorizontal: 10,
          }}
        >
          <StyledView style={{ alignItems: "center", width: "100%" }}>
            <StyledView
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
            </StyledView>

            <StyledText
              style={{
                fontSize: 24,
                fontFamily: FONT.Medium,
                color: "#FFFFFF",
                marginBottom: 12,
                textAlign: "center",
                lineHeight: 32,
              }}
            >
              Passcode reset{"\n"}successfully
            </StyledText>

            <StyledText
              style={{
                fontSize: 15,
                fontFamily: FONT.Regular,
                color: "#FFFFFF",
                marginBottom: 64,
                textAlign: "center",
                lineHeight: 22,
              }}
            >
              Your new 4-digit passcode has been{"\n"}set. You can now use it to
              unlock your{"\n"}application.
            </StyledText>

            <StyledTouchableOpacity
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
              <StyledText
                style={{
                  fontSize: 15,
                  fontFamily: FONT.Bold,
                  color: "#000000",
                }}
              >
                Done
              </StyledText>
            </StyledTouchableOpacity>
          </StyledView>
        </StyledView>
      </Modal>
    </StyledSafeAreaView>
  );
};

export default ResetPasswordScreen;
