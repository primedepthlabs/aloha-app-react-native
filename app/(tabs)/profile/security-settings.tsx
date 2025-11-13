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
import * as LocalAuthentication from "expo-local-authentication";

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

const SecuritySettings = () => {
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  // Main Screen States
  const [faceIdEnabled, setFaceIdEnabled] = useState(true);

  // Passkey Screen States
  const [passkeyScreenVisible, setPasskeyScreenVisible] = useState(false);
  const [passkeyActive, setPasskeyActive] = useState(true);
  const [deletePasskeyModalVisible, setDeletePasskeyModalVisible] =
    useState(false);
  const [biometricAuthVisible, setBiometricAuthVisible] = useState(false);

  // Passcode Screen States
  const [passcodeScreenVisible, setPasscodeScreenVisible] = useState(false);
  const [passcodeEnabled, setPasscodeEnabled] = useState(true);

  if (!fontsLoaded) {
    return (
      <View className="flex-1 items-center justify-center bg-black">
        <ActivityIndicator color="#FCCD34" />
      </View>
    );
  }

  const toggleFaceId = () => {
    setFaceIdEnabled(!faceIdEnabled);
  };

  const handleRemovePasskey = () => {
    setDeletePasskeyModalVisible(true);
  };

  const confirmDeletePasskey = () => {
    setDeletePasskeyModalVisible(false);
    setBiometricAuthVisible(true);
  };

  const handleBiometricAuth = async () => {
    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage:
          "Use your device's Face ID, Touch ID, or PIN to confirm removal of your Passkey.",
      });

      if (result.success) {
        setBiometricAuthVisible(false);
        setPasskeyActive(false);
        // Navigate back or show success message
      }
    } catch (error) {
      console.error("Authentication error:", error);
    }
  };

  const togglePasscode = () => {
    setPasscodeEnabled(!passcodeEnabled);
  };

  // Main Security Settings Screen
  const renderMainScreen = () => (
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
          Security Settings
        </StyledText>
      </StyledView>

      <StyledScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingHorizontal: 24,
          paddingTop: 7,
        }}
      >
        {/* Passkey Option */}
        <StyledTouchableOpacity
          onPress={() => setPasskeyScreenVisible(true)}
          style={{
            backgroundColor: "black",
            borderRadius: 16,
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: 8,
            paddingVertical: 12,
            marginBottom: 6,
          }}
        >
          <StyledView
            style={{
              width: 40,
              height: 40,
              backgroundColor: "#19191B",
              borderRadius: 7.69,
              alignItems: "center",
              justifyContent: "center",
              marginRight: 12,
            }}
          >
            <Image
              source={require("../../../assets/images/passkey.png")}
              style={{ width: 24, height: 24 }}
              resizeMode="contain"
            />
          </StyledView>
          <StyledText
            style={{
              flex: 1,
              fontSize: 16,
              fontFamily: FONT.Medium,
              color: "#FFFFFF",
            }}
          >
            Passkey
          </StyledText>
          <ChevronLeft
            size={20}
            color="#8E8E93"
            strokeWidth={2}
            style={{ transform: [{ rotate: "180deg" }] }}
          />
        </StyledTouchableOpacity>

        {/* Face ID Option */}
        <StyledView
          style={{
            backgroundColor: "black",
            borderRadius: 16,
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: 8,
            paddingVertical: 12,
            marginBottom: 6,
          }}
        >
          <StyledView
            style={{
              width: 40,
              height: 40,
              backgroundColor: "#19191B",
              borderRadius: 7.69,
              alignItems: "center",
              justifyContent: "center",
              marginRight: 12,
            }}
          >
            <Image
              source={require("../../../assets/images/faceid.png")}
              style={{ width: 24, height: 24 }}
              resizeMode="contain"
            />
          </StyledView>
          <StyledText
            style={{
              flex: 1,
              fontSize: 16,
              fontFamily: FONT.Medium,
              color: "#FFFFFF",
            }}
          >
            Face ID
          </StyledText>
          <StyledTouchableOpacity
            onPress={toggleFaceId}
            style={{
              width: 51,
              height: 31,
              borderRadius: 15.5,
              backgroundColor: faceIdEnabled ? "#FCCD34" : "#39393D",
              padding: 2,
              justifyContent: "center",
            }}
          >
            <StyledView
              style={{
                width: 27,
                height: 27,
                borderRadius: 13.5,
                backgroundColor: "#FFFFFF",
                transform: [{ translateX: faceIdEnabled ? 20 : 0 }],
              }}
            />
          </StyledTouchableOpacity>
        </StyledView>

        {/* Passcode Option */}
        <StyledTouchableOpacity
          onPress={() => setPasscodeScreenVisible(true)}
          style={{
            backgroundColor: "black",
            borderRadius: 16,
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: 8,
            paddingVertical: 6,
          }}
        >
          <StyledView
            style={{
              width: 40,
              height: 40,
              backgroundColor: "#19191B",
              borderRadius: 7.69,
              alignItems: "center",
              justifyContent: "center",
              marginRight: 12,
            }}
          >
            <Image
              source={require("../../../assets/images/passcode.png")}
              style={{ width: 24, height: 24 }}
              resizeMode="contain"
            />
          </StyledView>
          <StyledText
            style={{
              flex: 1,
              fontSize: 16,
              fontFamily: FONT.Medium,
              color: "#FFFFFF",
            }}
          >
            Passcode
          </StyledText>
          <ChevronLeft
            size={20}
            color="#8E8E93"
            strokeWidth={2}
            style={{ transform: [{ rotate: "180deg" }] }}
          />
        </StyledTouchableOpacity>
      </StyledScrollView>
    </StyledSafeAreaView>
  );

  // Passkey Screen
  const renderPasskeyScreen = () => (
    <Modal
      animationType="slide"
      transparent={false}
      visible={passkeyScreenVisible}
      onRequestClose={() => setPasskeyScreenVisible(false)}
    >
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
            onPress={() => setPasskeyScreenVisible(false)}
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
            Passkey
          </StyledText>
        </StyledView>

        <StyledScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{
            paddingHorizontal: 24,
            paddingTop: 4,
          }}
        >
          {/* Passkey Status */}
          <StyledView
            style={{
              backgroundColor: "black",
              borderRadius: 16,
              flexDirection: "row",
              alignItems: "center",
              paddingHorizontal: 10,
              paddingVertical: 12,
              marginBottom: 6,
            }}
          >
            <StyledView
              style={{
                width: 40,
                height: 40,
                backgroundColor: "#19191B",
                borderRadius: 7.69,
                alignItems: "center",
                justifyContent: "center",
                marginRight: 12,
              }}
            >
              <Image
                source={require("../../../assets/images/passkey-status.png")}
                style={{ width: 24, height: 24 }}
                resizeMode="contain"
              />
            </StyledView>
            <StyledView style={{ flex: 1 }}>
              <StyledText
                style={{
                  fontSize: 15,
                  fontFamily: FONT.Regular,
                  color: "#FFFFFF",
                  marginBottom: 4,
                }}
              >
                Passkey Status: Active
              </StyledText>
              <StyledText
                style={{
                  fontSize: 12,
                  fontFamily: FONT.Regular,
                  color: "#FCCD34",
                  lineHeight: 18,
                }}
              >
                Passkeys are a more secure way to sign in to your account. They
                replace...
              </StyledText>
            </StyledView>
            <StyledView
              style={{
                width: 24,
                height: 24,
                borderRadius: 12,

                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Image
                source={require("../../../assets/images/profile/check-deposit-history.png")}
                style={{ width: 20, height: 20 }}
                resizeMode="contain"
              />
            </StyledView>
          </StyledView>

          {/* Remove Passkey */}
          <StyledTouchableOpacity
            onPress={handleRemovePasskey}
            style={{
              backgroundColor: "black",
              borderRadius: 16,
              flexDirection: "row",
              alignItems: "center",
              paddingHorizontal: 8,
              paddingVertical: 12,
              marginBottom: 6,
            }}
          >
            <StyledView
              style={{
                width: 40,
                height: 40,
                backgroundColor: "#19191B",
                borderRadius: 7.69,
                alignItems: "center",
                justifyContent: "center",
                marginRight: 12,
              }}
            >
              <Image
                source={require("../../../assets/images/profile/dustbin.png")}
                style={{ width: 24, height: 24 }}
                resizeMode="contain"
              />
            </StyledView>
            <StyledText
              style={{
                flex: 1,
                fontSize: 15,
                fontFamily: FONT.Regular,
                color: "#FFFFFF",
              }}
            >
              Remove Passkey
            </StyledText>
            <ChevronLeft
              size={20}
              color="#8E8E93"
              strokeWidth={2}
              style={{ transform: [{ rotate: "180deg" }] }}
            />
          </StyledTouchableOpacity>

          {/* Recreate Passkey */}
          <StyledTouchableOpacity
            style={{
              backgroundColor: "black",
              borderRadius: 16,
              flexDirection: "row",
              alignItems: "center",
              paddingHorizontal: 8,
              paddingVertical: 6,
            }}
          >
            <StyledView
              style={{
                width: 40,
                height: 40,
                backgroundColor: "#19191B",
                borderRadius: 7.69,
                alignItems: "center",
                justifyContent: "center",
                marginRight: 12,
              }}
            >
              <Image
                source={require("../../../assets/images/recreate.png")}
                style={{ width: 24, height: 24 }}
                resizeMode="contain"
              />
            </StyledView>
            <StyledText
              style={{
                flex: 1,
                fontSize: 15,
                fontFamily: FONT.Regular,
                color: "#FFFFFF",
              }}
            >
              Recreate Passkey
            </StyledText>
            <ChevronLeft
              size={20}
              color="#8E8E93"
              strokeWidth={2}
              style={{ transform: [{ rotate: "180deg" }] }}
            />
          </StyledTouchableOpacity>
        </StyledScrollView>
      </StyledSafeAreaView>

      {/* Delete Passkey Confirmation Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={deletePasskeyModalVisible}
        onRequestClose={() => setDeletePasskeyModalVisible(false)}
      >
        <StyledView
          style={{
            flex: 1,
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            justifyContent: "center",
            alignItems: "center",
            paddingHorizontal: 40,
          }}
        >
          <StyledView
            style={{
              backgroundColor: "#2C2C2E",
              borderRadius: 20,
              padding: 19,
              width: "100%",
              maxWidth: 320,
            }}
          >
            <StyledText
              className="text-white text-center"
              style={{
                fontSize: 15,
                fontFamily: FONT.Regular,
                marginBottom: 10,
                // lineHeight: 24,
              }}
            >
              Are you sure you want to{"\n"}Delete your Passkey?
            </StyledText>

            <StyledTouchableOpacity
              onPress={confirmDeletePasskey}
              style={{
                paddingVertical: 12,
                borderBottomWidth: 1,
                borderBottomColor: "#3C3C3E",
                alignItems: "center",
              }}
            >
              <StyledText
                className="text-center"
                style={{
                  fontSize: 16,
                  fontFamily: FONT.Regular,
                  color: "#FF3B30",
                }}
              >
                Delete
              </StyledText>
            </StyledTouchableOpacity>

            <StyledTouchableOpacity
              onPress={() => setDeletePasskeyModalVisible(false)}
              style={{
                paddingVertical: 12,
                alignItems: "center",
              }}
            >
              <StyledText
                className="text-white text-center"
                style={{
                  fontSize: 16,
                  fontFamily: FONT.Regular,
                }}
              >
                Cancel
              </StyledText>
            </StyledTouchableOpacity>
          </StyledView>
        </StyledView>
      </Modal>

      {/* Biometric Authentication Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={biometricAuthVisible}
        onRequestClose={() => setBiometricAuthVisible(false)}
      >
        <StyledView
          style={{
            flex: 1,
            backgroundColor: "rgba(0, 0, 0, 0.85)",
            justifyContent: "center",
            alignItems: "center",
            paddingHorizontal: 40,
          }}
        >
          <StyledView style={{ alignItems: "center" }}>
            <StyledText
              style={{
                fontSize: 16,
                fontFamily: FONT.Regular,
                color: "#FFFFFF",
                textAlign: "center",
                marginBottom: 32,
                lineHeight: 24,
              }}
            >
              Use your device's Face ID, Touch ID,{"\n"}or PIN to confirm
              removal of your{"\n"}Passkey.
            </StyledText>

            <StyledView
              style={{
                width: 120,
                height: 120,
                backgroundColor: "#3C3C3E",
                borderRadius: 16,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Image
                source={require("../../../assets/images/faceid.png")}
                style={{ width: 48, height: 48 }}
                resizeMode="contain"
              />
              <StyledText
                style={{
                  fontSize: 14,
                  fontFamily: FONT.Regular,
                  color: "#FFFFFF",
                  marginTop: 8,
                }}
              >
                Face ID
              </StyledText>
            </StyledView>
          </StyledView>
        </StyledView>
      </Modal>
    </Modal>
  );

  // Passcode Screen
  const renderPasscodeScreen = () => (
    <Modal
      animationType="slide"
      transparent={false}
      visible={passcodeScreenVisible}
      onRequestClose={() => setPasscodeScreenVisible(false)}
    >
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
            onPress={() => setPasscodeScreenVisible(false)}
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
            Passcode
          </StyledText>
        </StyledView>

        <StyledScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{
            paddingHorizontal: 24,
            paddingTop: 4,
          }}
        >
          {/* Update Passcode */}
          <StyledTouchableOpacity
            style={{
              backgroundColor: "BLACK",
              borderRadius: 16,
              flexDirection: "row",
              alignItems: "center",
              paddingHorizontal: 8,
              paddingVertical: 12,
              marginBottom: 6,
            }}
          >
            <StyledView
              style={{
                width: 40,
                height: 40,
                backgroundColor: "#19191B",
                borderRadius: 12,
                alignItems: "center",
                justifyContent: "center",
                marginRight: 12,
              }}
            >
              <Image
                source={require("../../../assets/images/passcode.png")}
                style={{ width: 24, height: 24 }}
                resizeMode="contain"
              />
            </StyledView>
            <StyledTouchableOpacity
              onPress={() => router.push("/(tabs)/profile/update-passcode")}
              style={{ flex: 1 }}
            >
              <StyledText
                style={{
                  flex: 1,
                  fontSize: 16,
                  fontFamily: FONT.Regular,
                  color: "#FFFFFF",
                }}
              >
                Update passcode
              </StyledText>
            </StyledTouchableOpacity>
            <ChevronLeft
              size={20}
              color="#8E8E93"
              strokeWidth={2}
              style={{ transform: [{ rotate: "180deg" }] }}
            />
          </StyledTouchableOpacity>

          {/* Turn Off Passcode */}
          <StyledView
            style={{
              backgroundColor: "black",
              borderRadius: 16,
              flexDirection: "row",
              alignItems: "center",

              paddingHorizontal: 8,
              paddingVertical: 6,
            }}
          >
            <StyledView
              style={{
                width: 40,
                height: 40,
                backgroundColor: "#19191B",
                borderRadius: 12,
                alignItems: "center",
                justifyContent: "center",
                marginRight: 12,
              }}
            >
              <Image
                source={require("../../../assets/images/passcode.png")}
                style={{ width: 24, height: 24 }}
                resizeMode="contain"
              />
            </StyledView>
            <StyledText
              style={{
                flex: 1,
                fontSize: 16,
                fontFamily: FONT.Regular,
                color: "#FFFFFF",
              }}
            >
              Turn off passcode
            </StyledText>
            <StyledTouchableOpacity
              onPress={togglePasscode}
              style={{
                width: 51,
                height: 31,
                borderRadius: 15.5,
                backgroundColor: passcodeEnabled ? "#FCCD34" : "#39393D",
                padding: 2,
                justifyContent: "center",
              }}
            >
              <StyledView
                style={{
                  width: 27,
                  height: 27,
                  borderRadius: 13.5,
                  backgroundColor: "#FFFFFF",
                  transform: [{ translateX: passcodeEnabled ? 20 : 0 }],
                }}
              />
            </StyledTouchableOpacity>
          </StyledView>
        </StyledScrollView>
      </StyledSafeAreaView>
    </Modal>
  );

  return (
    <>
      {renderMainScreen()}
      {renderPasskeyScreen()}
      {renderPasscodeScreen()}
    </>
  );
};

export default SecuritySettings;
