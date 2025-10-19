import React, { useState, useEffect } from "react";
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
  ScrollView,
} from "react-native";
import { styled } from "nativewind";
import { ChevronLeft, X } from "lucide-react-native";
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

const PasskeyScreen = () => {
  const router = useRouter();
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  const [step, setStep] = useState(1); // 1: Info, 2: Confirmation Modal, 3: Face ID, 4: Success
  const [confirmationModalVisible, setConfirmationModalVisible] =
    useState(false);
  const [faceIdModalVisible, setFaceIdModalVisible] = useState(false);
  const [successModalVisible, setSuccessModalVisible] = useState(false);

  if (!fontsLoaded) {
    return (
      <View className="flex-1 items-center justify-center bg-black">
        <ActivityIndicator color="#FCCD34" />
      </View>
    );
  }

  const handleContinueFromInfo = () => {
    setConfirmationModalVisible(true);
  };

  const handleContinueFromConfirmation = () => {
    setConfirmationModalVisible(false);
    setTimeout(() => {
      setSuccessModalVisible(true);
    }, 300);
  };

  const handleFaceIdComplete = () => {
    setFaceIdModalVisible(false);
    setTimeout(() => {
      setSuccessModalVisible(true);
    }, 300);
  };

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
          style={{ fontSize: 18, fontFamily: FONT.SemiBold }}
        >
          Passkey
        </StyledText>
      </StyledView>

      {/* Main Content */}
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          paddingHorizontal: 24,
          paddingTop: 10,
          alignItems: "center",
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Icon */}
        <StyledView
          style={{
            width: 40,
            height: 40,
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 32,
          }}
        >
          <Image
            source={require("../../../assets/images/passkey-icon.png")}
            style={{ width: 56, height: 56 }}
            resizeMode="cover"
          />
        </StyledView>

        {/* Title */}
        <StyledText
          style={{
            fontSize: 18,
            fontFamily: FONT.Bold,
            color: "#FFFFFF",
            marginBottom: 32,
            textAlign: "center",
            lineHeight: 32,
          }}
        >
          Create a passkey
        </StyledText>

        {/* Info Sections */}
        <StyledView
          style={{
            width: "100%",
            marginBottom: 32,
            backgroundColor: "#19191B",
            padding: 16,
            borderRadius: 12,
          }}
        >
          {/* What are passkeys for? */}
          <StyledView style={{ marginBottom: 32 }}>
            <StyledText
              style={{
                fontSize: 18,
                fontFamily: FONT.Bold,
                color: "#FFFFFF",
                marginBottom: 8,
              }}
            >
              What are passkeys for?
            </StyledText>
            <StyledText
              style={{
                fontSize: 15,
                fontFamily: FONT.Regular,
                color: "rgba(255, 255, 255, 0.7)",
                lineHeight: 22,
              }}
            >
              Passkeys let you log in quickly and securely using this device's
              fingerprint, face recognition, or PIN.
            </StyledText>
          </StyledView>

          {/* Why are passkeys safe? */}
          <StyledView style={{ marginBottom: 32 }}>
            <StyledText
              style={{
                fontSize: 18,
                fontFamily: FONT.Bold,
                color: "#FFFFFF",
                marginBottom: 8,
              }}
            >
              Why are passkeys safe?
            </StyledText>
            <StyledText
              style={{
                fontSize: 15,
                fontFamily: FONT.Regular,
                color: "rgba(255, 255, 255, 0.7)",
                lineHeight: 22,
              }}
            >
              Passkeys are encrypted digital keys that cannot be stolen.
            </StyledText>
          </StyledView>

          {/* Where are passkeys stored? */}
          <StyledView>
            <StyledText
              style={{
                fontSize: 18,
                fontFamily: FONT.Bold,
                color: "#FFFFFF",
                marginBottom: 8,
              }}
            >
              Where are passkeys stored?
            </StyledText>
            <StyledText
              style={{
                fontSize: 15,
                fontFamily: FONT.Regular,
                color: "rgba(255, 255, 255, 0.7)",
                lineHeight: 22,
              }}
            >
              Passkeys are saved to your Password Manager/iCloud KeyChain, so
              you can sign in on other devices.
            </StyledText>
          </StyledView>
        </StyledView>
      </ScrollView>

      {/* Continue Button */}
      <StyledView style={{ paddingHorizontal: 24, paddingBottom: 80 }}>
        <StyledTouchableOpacity
          onPress={handleContinueFromInfo}
          style={{
            backgroundColor: "#FCCD34",
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
              color: "#000000",
            }}
          >
            Continue
          </StyledText>
        </StyledTouchableOpacity>
      </StyledView>

      {/* Confirmation Modal */}
      <Modal
        visible={confirmationModalVisible}
        transparent
        animationType="fade"
      >
        <StyledView
          style={{
            flex: 1,
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            alignItems: "center",
            justifyContent: "flex-end",
          }}
        >
          <StyledView
            style={{
              backgroundColor: "#1C1C1E",
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
              width: "100%",
              paddingHorizontal: 24,
              paddingTop: 32,
              paddingBottom: 40,
              alignItems: "center",
            }}
          >
            {/* Close Button */}
            <StyledTouchableOpacity
              onPress={() => setConfirmationModalVisible(false)}
              style={{
                position: "absolute",
                top: 16,
                right: 16,
                width: 32,
                height: 32,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <X size={24} color="#FFFFFF" strokeWidth={2} />
            </StyledTouchableOpacity>

            {/* Icon */}
            {/* Icon */}
            <StyledView
              style={{
                width: 40,
                height: 40,
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 32,
              }}
            >
              <Image
                source={require("../../../assets/images/passkey-icon.png")}
                style={{ width: 56, height: 56 }}
                resizeMode="cover"
              />
            </StyledView>

            {/* Title */}
            <StyledText
              style={{
                fontSize: 20,
                fontFamily: FONT.Bold,
                color: "#FFFFFF",
                marginBottom: 12,
                textAlign: "center",
              }}
            >
              Create passkey?
            </StyledText>

            {/* Description */}
            <StyledText
              style={{
                fontSize: 15,
                fontFamily: FONT.Regular,
                color: "rgba(255, 255, 255, 0.7)",
                textAlign: "center",
                lineHeight: 22,
                marginBottom: 32,
              }}
            >
              A passkey for "EllenSmith@mail.com" will be saved in iCloud
              Keychain and available on all your devices.
            </StyledText>

            {/* Continue Button */}
            <StyledTouchableOpacity
              onPress={handleContinueFromConfirmation}
              style={{
                backgroundColor: "#FCCD34",
                borderRadius: 15,
                height: 48,
                width: "100%",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <StyledText
                style={{
                  fontSize: 16,
                  fontFamily: FONT.SemiBold,
                  color: "#000000",
                }}
              >
                Continue
              </StyledText>
            </StyledTouchableOpacity>
          </StyledView>
        </StyledView>
      </Modal>

      {/* Face ID Modal */}
      <Modal visible={faceIdModalVisible} transparent animationType="fade">
        <StyledView
          style={{
            flex: 1,
            backgroundColor: "rgba(0, 0, 0, 0.95)",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <StyledView
            style={{
              backgroundColor: "#1C1C1E",
              borderRadius: 24,
              paddingVertical: 48,
              paddingHorizontal: 40,
              alignItems: "center",
              width: SCREEN_WIDTH - 80,
            }}
          >
            {/* Face ID Icon */}
            <StyledView
              style={{
                width: 100,
                height: 100,
                borderRadius: 20,
                borderWidth: 3,
                borderColor: "#FFFFFF",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 24,
              }}
            >
              <StyledView
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  backgroundColor: "#FFFFFF",
                  marginBottom: 8,
                }}
              />
              <StyledView
                style={{
                  width: 60,
                  height: 20,
                  borderTopLeftRadius: 30,
                  borderTopRightRadius: 30,
                  borderWidth: 3,
                  borderBottomWidth: 0,
                  borderColor: "#FFFFFF",
                }}
              />
            </StyledView>

            {/* Text */}
            <StyledText
              style={{
                fontSize: 18,
                fontFamily: FONT.Medium,
                color: "#FFFFFF",
                textAlign: "center",
              }}
            >
              Face ID
            </StyledText>
          </StyledView>

          {/* Simulate Face ID completion after 2 seconds */}
          {setTimeout(() => {
            if (faceIdModalVisible) {
              handleFaceIdComplete();
            }
          }, 2000)}
        </StyledView>
      </Modal>

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
                marginBottom: 64,
                textAlign: "center",
                lineHeight: 32,
              }}
            >
              Passkey successfully{"\n"}created!
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

export default PasskeyScreen;
