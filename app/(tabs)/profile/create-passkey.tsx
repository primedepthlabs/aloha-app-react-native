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
  ScrollView,
} from "react-native";
import { ChevronLeft, X } from "lucide-react-native";
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

const PasskeyScreen = () => {
  const router = useRouter();
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  const [step, setStep] = useState(1);
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
          style={{ fontSize: 18, fontFamily: FONT.SemiBold }}
        >
          Passkey
        </Text>
      </View>

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
        <View
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
        </View>

        {/* Title */}
        <Text
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
        </Text>

        {/* Info Sections */}
        <View
          style={{
            width: "100%",
            marginBottom: 32,
            backgroundColor: "#19191B",
            padding: 16,
            borderRadius: 12,
          }}
        >
          {/* What are passkeys for? */}
          <View style={{ marginBottom: 32 }}>
            <Text
              style={{
                fontSize: 18,
                fontFamily: FONT.Bold,
                color: "#FFFFFF",
                marginBottom: 8,
              }}
            >
              What are passkeys for?
            </Text>
            <Text
              style={{
                fontSize: 15,
                fontFamily: FONT.Regular,
                color: "rgba(255, 255, 255, 0.7)",
                lineHeight: 22,
              }}
            >
              Passkeys let you log in quickly and securely using this device's
              fingerprint, face recognition, or PIN.
            </Text>
          </View>

          {/* Why are passkeys safe? */}
          <View style={{ marginBottom: 32 }}>
            <Text
              style={{
                fontSize: 18,
                fontFamily: FONT.Bold,
                color: "#FFFFFF",
                marginBottom: 8,
              }}
            >
              Why are passkeys safe?
            </Text>
            <Text
              style={{
                fontSize: 15,
                fontFamily: FONT.Regular,
                color: "rgba(255, 255, 255, 0.7)",
                lineHeight: 22,
              }}
            >
              Passkeys are encrypted digital keys that cannot be stolen.
            </Text>
          </View>

          {/* Where are passkeys stored? */}
          <View>
            <Text
              style={{
                fontSize: 18,
                fontFamily: FONT.Bold,
                color: "#FFFFFF",
                marginBottom: 8,
              }}
            >
              Where are passkeys stored?
            </Text>
            <Text
              style={{
                fontSize: 15,
                fontFamily: FONT.Regular,
                color: "rgba(255, 255, 255, 0.7)",
                lineHeight: 22,
              }}
            >
              Passkeys are saved to your Password Manager/iCloud KeyChain, so
              you can sign in on other devices.
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Continue Button */}
      <View style={{ paddingHorizontal: 24, paddingBottom: 80 }}>
        <TouchableOpacity
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
      </View>

      {/* Confirmation Modal */}
      <Modal
        visible={confirmationModalVisible}
        transparent
        animationType="fade"
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            alignItems: "center",
            justifyContent: "flex-end",
          }}
        >
          <View
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
            <TouchableOpacity
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
            </TouchableOpacity>

            {/* Icon */}
            <View
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
            </View>

            {/* Title */}
            <Text
              style={{
                fontSize: 20,
                fontFamily: FONT.Bold,
                color: "#FFFFFF",
                marginBottom: 12,
                textAlign: "center",
              }}
            >
              Create passkey?
            </Text>

            {/* Description */}
            <Text
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
            </Text>

            {/* Continue Button */}
            <TouchableOpacity
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
              <Text
                style={{
                  fontSize: 16,
                  fontFamily: FONT.SemiBold,
                  color: "#000000",
                }}
                >
                Continue
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Face ID Modal */}
      <Modal visible={faceIdModalVisible} transparent animationType="fade">
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0, 0, 0, 0.95)",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <View
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
            <View
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
              <View
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  backgroundColor: "#FFFFFF",
                  marginBottom: 8,
                }}
              />
              <View
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
            </View>

            {/* Text */}
            <Text
              style={{
                fontSize: 18,
                fontFamily: FONT.Medium,
                color: "#FFFFFF",
                textAlign: "center",
              }}
            >
              Face ID
            </Text>
          </View>

          {/* Simulate Face ID completion after 2 seconds */}
          {setTimeout(() => {
            if (faceIdModalVisible) {
              handleFaceIdComplete();
            }
          }, 2000)}
        </View>
      </Modal>

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
                marginBottom: 64,
                textAlign: "center",
                lineHeight: 32,
              }}
            >
              Passkey successfully{"\n"}created!
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

export default PasskeyScreen;