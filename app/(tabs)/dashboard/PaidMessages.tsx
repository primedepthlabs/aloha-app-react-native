import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  TextInput,
  Switch,
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

const PaidMessages = () => {
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  const [isEnabled, setIsEnabled] = useState(true);
  const [price, setPrice] = useState("0.05");

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "black" }}>
        <ActivityIndicator color="#FCCD34" />
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "black" }}>
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
          <ChevronLeft size={26} color="#FFFFFF" strokeWidth={2} />
        </TouchableOpacity>

        <Text
          style={{
            fontSize: 15,
            fontFamily: FONT.SemiBold,
            color: "#FFFFFF",
          }}
        >
          Paid Messaging
        </Text>
      </View>

      <View style={{ flex: 1, paddingHorizontal: 20, paddingTop: 30 }}>
        {/* Enable Paid Message Toggle */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 32,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Image
              source={require("../../../assets/images/dashboard/lock-icon.png")}
              style={{ width: 15, height: 15 }}
            />
            <Text
              style={{
                fontSize: 16,
                fontFamily: FONT.Regular,
                color: "#FFFFFF",
                marginLeft: 12,
              }}
            >
              Enable Paid Message
            </Text>
          </View>

          <Switch
            trackColor={{ false: "#3E3E40", true: "#FCCD34" }}
            thumbColor="#FFFFFF"
            ios_backgroundColor="#3E3E40"
            onValueChange={setIsEnabled}
            value={isEnabled}
          />
        </View>

        {/* Price Input */}
        <View style={{ marginBottom: 16 }}>
          <Text
            style={{
              fontSize: 16,
              fontFamily: FONT.Regular,
              color: "#FFFFFF",
              marginBottom: 16,
            }}
          >
            Price for first 60 characters (GEL)
          </Text>

          <TextInput
            style={{
              backgroundColor: "#19191B",
              borderRadius: 15,
              borderWidth: 1,
              borderColor: "#808080",
              height: 48,
              paddingHorizontal: 16,
              fontSize: 16,
              fontFamily: FONT.Regular,
              color: "#6C6C70",
            }}
            value={price}
            onChangeText={setPrice}
            keyboardType="decimal-pad"
            placeholderTextColor="#6C6C70"
          />
        </View>

        {/* Info Text */}
        <View style={{ marginBottom: 24 }}>
          <Text
            style={{
              fontSize: 12,
              fontFamily: FONT.Regular,
              color: "#808080",
              lineHeight: 20,
              marginBottom: 12,
            }}
          >
            Users are charged this fee only when you send a reply.
          </Text>

          <Text
            style={{
              fontSize: 12,
              fontFamily: FONT.Regular,
              color: "#808080",
              lineHeight: 20,
              marginBottom: 12,
            }}
          >
            If you do not reply within 24 hours, the user will be refunded automatically.
          </Text>

          <Text
            style={{
              fontSize: 12,
              fontFamily: FONT.Regular,
              color: "#808080",
              lineHeight: 20,
            }}
          >
            The total charge is calculated based on the length of the user's message, capped at the second price point for every 60 characters beyond the first.
          </Text>
        </View>
      </View>

      {/* Save Button */}
      <View style={{ paddingHorizontal: 20, paddingBottom: 80 }}>
        <TouchableOpacity
          style={{
            width: 332,
            height: 45,
            backgroundColor: "#FCCD34",
            borderRadius: 15,
            alignItems: "center",
            justifyContent: "center",
            alignSelf: "center",
          }}
        >
          <Text
            style={{
              fontSize: 17,
              fontFamily: FONT.SemiBold,
              color: "#000000",
            }}
          >
            Save changes
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default PaidMessages;
