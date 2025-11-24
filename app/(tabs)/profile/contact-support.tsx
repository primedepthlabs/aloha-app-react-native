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
    console.log("Form submitted", { name, email, message });
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
          style={{
            fontSize: 18,
            fontFamily: FONT.SemiBold,
          }}
        >
          Contact Support
        </Text>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: 20,
        }}
      >
        {/* Support Icon */}
        <View style={{ alignItems: "center", marginBottom: 24 }}>
          <Image
            source={require("../../../assets/images/profile/contact-support.png")}
            style={{ width: 76, height: 79 }}
            resizeMode="contain"
          />
        </View>

        {/* Title */}
        <Text
          className="text-white text-center"
          style={{
            fontSize: 18,
            fontFamily: FONT.SemiBold,
            marginBottom: 32,
          }}
        >
          How can we help?
        </Text>

        {/* Name Input */}
        <View style={{ marginBottom: 16 }}>
          <TextInput
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
        </View>

        {/* Email Input */}
        <View style={{ marginBottom: emailError ? 8 : 16 }}>
          <TextInput
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
        </View>

        {/* Email Error */}
        {emailError ? (
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 16,
              paddingLeft: 4,
            }}
          >
            <View
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
              <Text
                style={{
                  color: "#FFFFFF",
                  fontSize: 14,
                  fontFamily: FONT.Bold,
                }}
              >
                !
              </Text>
            </View>
            <Text
              style={{
                color: "#FF3B30",
                fontSize: 14,
                fontFamily: FONT.Regular,
              }}
            >
              {emailError}
            </Text>
          </View>
        ) : null}

        {/* Message Input */}
        <View style={{ marginBottom: 32 }}>
          <TextInput
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
        </View>

        {/* Submit Button */}
        <TouchableOpacity
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
          <Text
            className="text-white "
            style={{
              fontSize: 18,
              fontFamily: FONT.SemiBold,
            }}
          >
            Contact Us
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ContactSupportScreen;
