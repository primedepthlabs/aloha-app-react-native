import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  ScrollView,
  TextInput,
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

const ContactSupportScreen = () => {
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [emailError, setEmailError] = useState("");

  if (!fontsLoaded) {
    return (
      <View className="flex-1 items-center justify-center bg-black">
        <ActivityIndicator color="#FCCD34" />
      </View>
    );
  }

  const validateEmail = (text: string) => {
    setEmail(text);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (text && !emailRegex.test(text)) {
      setEmailError("Wrong email address");
    } else {
      setEmailError("");
    }
  };

  const handleSubmit = () => {
    // Handle form submission
    console.log("Form submitted", { name, email, message });
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
          style={{
            fontSize: 18,
            fontFamily: FONT.SemiBold,
          }}
        >
          Contact Support
        </StyledText>
      </StyledView>

      <StyledScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: 20,
        }}
      >
        {/* Support Icon */}
        <StyledView style={{ alignItems: "center", marginBottom: 24 }}>
          <Image
            source={require("../../../assets/images/profile/contact-support.png")}
            style={{ width: 76, height: 79 }}
            resizeMode="contain"
          />
        </StyledView>

        {/* Title */}
        <StyledText
          className="text-white text-center"
          style={{
            fontSize: 18,
            fontFamily: FONT.SemiBold,
            marginBottom: 32,
          }}
        >
          How can we help?
        </StyledText>

        {/* Name Input */}
        <StyledView style={{ marginBottom: 16 }}>
          <StyledTextInput
            value={name}
            onChangeText={setName}
            placeholder="Enter your name"
            placeholderTextColor="#6F6F70"
            style={{
              backgroundColor: "#1C1C1E",
              borderRadius: 25,
              height: 48,
              paddingHorizontal: 20,
              fontSize: 16,
              fontFamily: FONT.Regular,
              color: "#FFFFFF",
              borderWidth: 1,
              borderColor: "transparent",
            }}
          />
        </StyledView>

        {/* Email Input */}
        <StyledView style={{ marginBottom: emailError ? 8 : 16 }}>
          <StyledTextInput
            value={email}
            onChangeText={validateEmail}
            placeholder="Enter your email"
            placeholderTextColor="#6F6F70"
            keyboardType="email-address"
            autoCapitalize="none"
            style={{
              backgroundColor: "#1C1C1E",
              borderRadius: 25,
              height: 48,
              paddingHorizontal: 20,
              fontSize: 16,
              fontFamily: FONT.Regular,
              color: "#FFFFFF",
              borderWidth: 1,
              borderColor: emailError ? "#FF3B30" : "transparent",
            }}
          />
        </StyledView>

        {/* Email Error */}
        {emailError ? (
          <StyledView
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 16,
              paddingLeft: 4,
            }}
          >
            <StyledView
              style={{
                width: 20,
                height: 20,
                borderRadius: 10,
                backgroundColor: "#FF3B30",
                alignItems: "center",
                justifyContent: "center",
                marginRight: 8,
              }}
            >
              <StyledText
                style={{
                  color: "#FFFFFF",
                  fontSize: 14,
                  fontFamily: FONT.Bold,
                }}
              >
                !
              </StyledText>
            </StyledView>
            <StyledText
              style={{
                color: "#FF3B30",
                fontSize: 14,
                fontFamily: FONT.Regular,
              }}
            >
              {emailError}
            </StyledText>
          </StyledView>
        ) : null}

        {/* Message Input */}
        <StyledView style={{ marginBottom: 32 }}>
          <StyledTextInput
            value={message}
            onChangeText={setMessage}
            placeholder="Type your message ..."
            placeholderTextColor="#6F6F70"
            multiline
            textAlignVertical="top"
            style={{
              backgroundColor: "#1C1C1E",
              borderRadius: 25,
              height: 93,
              paddingHorizontal: 20,
              paddingTop: 16,
              paddingBottom: 16,
              fontSize: 16,
              fontFamily: FONT.Regular,
              color: "#FFFFFF",
              borderWidth: 1,
              borderColor: "transparent",
            }}
          />
        </StyledView>

        {/* Submit Button */}
        <StyledTouchableOpacity
          onPress={handleSubmit}
          style={{
            backgroundColor: "#FCCD34",
            borderRadius: 15,
            height: 48,
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 40,
          }}
        >
          <StyledText
            className="text-white "
            style={{
              fontSize: 18,
              fontFamily: FONT.SemiBold,
            }}
          >
            Contact Us
          </StyledText>
        </StyledTouchableOpacity>
      </StyledScrollView>
    </StyledSafeAreaView>
  );
};

export default ContactSupportScreen;
