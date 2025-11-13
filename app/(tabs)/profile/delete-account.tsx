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
import { ChevronLeft } from "lucide-react-native";
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

const SCREEN_WIDTH = Dimensions.get("window").width;

const DeleteAccountScreen = () => {
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [verificationModalVisible, setVerificationModalVisible] =
    useState(false);
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef<Array<TextInput | null>>([]);

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

    if (text && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleDeleteClick = () => {
    setConfirmModalVisible(true);
  };

  const handleConfirmDelete = () => {
    setConfirmModalVisible(false);
    setVerificationModalVisible(true);
  };

  const handleVerifyAndDelete = async () => {
    setIsDeleting(true);
    try {
      await new Promise((res) => setTimeout(res, 1000));
      setVerificationModalVisible(false);
      setSuccessModalVisible(true);
    } catch (e) {
      console.warn("deletion failed", e);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleResendCode = () => {
    console.log("Resending code...");
  };

  const isCodeComplete = code.every((digit) => digit.length === 1);

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
        </TouchableOpacity>
        <Text
          className="text-white"
          style={{
            fontSize: 18,
            fontFamily: FONT.SemiBold,
          }}
        >
          Delete Account
        </Text>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingHorizontal: 24,
          paddingTop: 20,
          paddingBottom: 40,
        }}
      >
        <Text
          style={{
            fontSize: 15,
            fontFamily: FONT.Regular,
            color: "#8E8E93",
            lineHeight: 24,
            marginBottom: 32,
          }}
        >
          Any outstanding orders on your account will be cancelled. You will no
          longer be able to use any credits in your account or access content
          such as your Direct Messages.
        </Text>

        {/* Delete Button */}
        <TouchableOpacity
          onPress={handleDeleteClick}
          style={{
            backgroundColor: "#FCCD34",
            borderRadius: 28,
            height: 48,
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 16,
          }}
        >
          <Text
            style={{
              fontSize: 18,
              fontFamily: FONT.SemiBold,
              color: "#000000",
            }}
          >
            Delete
          </Text>
        </TouchableOpacity>

        {/* Cancel Button */}
        <TouchableOpacity
          onPress={() => router.back()}
          style={{
            backgroundColor: "#1C1C1E",
            borderRadius: 28,
            height: 48,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text
            style={{
              fontSize: 18,
              fontFamily: FONT.SemiBold,
              color: "#FFFFFF",
            }}
          >
            Cancel
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Confirmation Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={confirmModalVisible}
        onRequestClose={() => setConfirmModalVisible(false)}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            justifyContent: "center",
            alignItems: "center",
            paddingHorizontal: 40,
          }}
        >
          <View
            style={{
              backgroundColor: "#2C2C2E",
              borderRadius: 20,
              padding: 19,
              width: "100%",
              maxWidth: 320,
            }}
          >
            <Text
              className="text-white text-center"
              style={{
                fontSize: 16,
                fontFamily: FONT.Regular,
                marginBottom: 24,
                lineHeight: 24,
              }}
            >
              Are you sure you want to{"\n"}Delete your account?
            </Text>

            <TouchableOpacity
              onPress={handleConfirmDelete}
              style={{
                paddingVertical: 12,
                borderBottomWidth: 1,
                borderBottomColor: "#3C3C3E",
                alignItems: "center",
              }}
            >
              <Text
                className="text-center"
                style={{
                  fontSize: 16,
                  fontFamily: FONT.Regular,
                  color: "#FF3B30",
                }}
              >
                Delete
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setConfirmModalVisible(false)}
              style={{
                paddingVertical: 12,
                alignItems: "center",
              }}
            >
              <Text
                className="text-white text-center"
                style={{
                  fontSize: 16,
                  fontFamily: FONT.Regular,
                }}
              >
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Verification Code Modal */}
      <Modal
        animationType="slide"
        transparent={false}
        visible={verificationModalVisible}
        onRequestClose={() => setVerificationModalVisible(false)}
        presentationStyle="overFullScreen"
      >
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
              onPress={() => setVerificationModalVisible(false)}
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
              style={{
                fontSize: 18,
                fontFamily: FONT.SemiBold,
              }}
            >
              Confirm Account Deletion
            </Text>
          </View>

          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{
              paddingHorizontal: 24,
              paddingTop: 40,
              paddingBottom: 40,
            }}
          >
            <Text
              style={{
                fontSize: 24,
                fontFamily: FONT.SemiBold,
                color: "#FFFFFF",
                marginBottom: 16,
                textAlign: "center",
              }}
            >
              Enter verification Code
            </Text>

            <Text
              style={{
                fontSize: 14,
                fontFamily: FONT.Regular,
                color: "#8E8E93",
                lineHeight: 22,
                marginBottom: 40,
                textAlign: "center",
              }}
            >
              To ensure security, we have sent a 6-digit code to your registered
              number:{" "}
              <Text
                style={{ color: "#FFFFFF", fontFamily: FONT.Regular }}
              >
                +995 598 *** 323
              </Text>
            </Text>

            {/* Code Input Boxes */}
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                marginBottom: 40,
                gap: 12,
              }}
            >
              {code.map((digit, index) => (
                <View
                  key={index}
                  style={{
                    width: 48,
                    height: 56,
                    backgroundColor: "#1C1C1E",
                    borderRadius: 12,
                    borderWidth: digit ? 1 : 0,
                    borderColor: digit ? "#FCCD34" : "transparent",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <TextInput
                    ref={(ref) => (inputRefs.current[index] = ref)}
                    value={digit}
                    onChangeText={(text) => handleCodeChange(text, index)}
                    onKeyPress={(e) => handleKeyPress(e, index)}
                    keyboardType="number-pad"
                    maxLength={1}
                    style={{
                      fontSize: 24,
                      fontFamily: FONT.SemiBold,
                      color: "#FFFFFF",
                      textAlign: "center",
                      width: "100%",
                      height: "100%",
                    }}
                  />
                </View>
              ))}
            </View>

            {/* Confirm Deletion Button */}
            <TouchableOpacity
              onPress={handleVerifyAndDelete}
              disabled={!isCodeComplete || isDeleting}
              style={{
                backgroundColor:
                  !isCodeComplete || isDeleting ? "#d9c85a" : "#FCCD34",
                borderRadius: 28,
                height: 48,
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 32,
                opacity: !isCodeComplete || isDeleting ? 0.6 : 1,
              }}
            >
              {isDeleting ? (
                <ActivityIndicator color="#000000" />
              ) : (
                <Text
                  style={{
                    fontSize: 18,
                    fontFamily: FONT.SemiBold,
                    color: "#000000",
                  }}
                >
                  Confirm Deletion
                </Text>
              )}
            </TouchableOpacity>

            {/* Resend Code */}
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: FONT.Regular,
                  color: "#8E8E93",
                }}
              >
                I didn't receive a code{" "}
              </Text>
              <TouchableOpacity onPress={handleResendCode}>
                <Text
                  style={{
                    fontSize: 14,
                    fontFamily: FONT.SemiBold,
                    color: "#FCCD34",
                  }}
                >
                  Resend
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>

      {/* Success Modal */}
      <Modal
        visible={successModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => {}}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "#000000",
            alignItems: "center",
            justifyContent: "center",
            paddingHorizontal: 20,
          }}
        >
          <View style={{ alignItems: "center", width: "100%" }}>
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
              style={{
                fontSize: 24,
                fontFamily: FONT.SemiBold,
                color: "#FFFFFF",
                marginBottom: 12,
                textAlign: "center",
              }}
            >
              Account Deleted{"\n"}Successfully!
            </Text>

            <Text
              style={{
                fontSize: 15,
                fontFamily: FONT.Regular,
                color: "#8E8E93",
                marginBottom: 64,
                textAlign: "center",
                lineHeight: 22,
              }}
            >
              Your account has been permanently{"\n"}deleted. We're sad to see
              you go.
            </Text>

            <TouchableOpacity
              onPress={() => {
                setSuccessModalVisible(false);
              }}
              style={{
                backgroundColor: "#FCCD34",
                alignItems: "center",
                justifyContent: "center",
                width: SCREEN_WIDTH - 48,
                height: 48,
                borderRadius: 28,
              }}
            >
              <Text
                style={{
                  fontSize: 18,
                  fontFamily: FONT.SemiBold,
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

export default DeleteAccountScreen;