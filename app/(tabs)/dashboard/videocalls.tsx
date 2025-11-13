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

const VideoCalls = () => {
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  const [videoEnabled, setVideoEnabled] = useState(true);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [videoPrice, setVideoPrice] = useState("1.00");
  const [audioPrice, setAudioPrice] = useState("1.00");

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "black" }}>
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
          Video & Audio Calls
        </Text>
      </View>

      <View style={{ flex: 1, paddingHorizontal: 20, paddingTop: 30 }}>
        {/* Video Calls Section */}
        <View style={{ marginBottom: 36 }}>
          <Text
            style={{
              fontSize: 18,
              fontFamily: FONT.Medium,
              color: "#FFFFFF",
              marginBottom: 20,
            }}
          >
            Video calls:
          </Text>

          {/* Enable Video Calls Toggle */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 24,
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Image
                source={require("../../../assets/images/profile/video-call.png")}
                style={{ width: 38, height: 38 }}
              />
              <Text
                style={{
                  fontSize: 15,
                  fontFamily: FONT.Regular,
                  color: "#FFFFFF",
                  marginLeft: 12,
                }}
              >
                Enable paid video calls
              </Text>
            </View>

            <Switch
              trackColor={{ false: "#3E3E40", true: "#FCCD34" }}
              thumbColor="#FFFFFF"
              ios_backgroundColor="#3E3E40"
              onValueChange={setVideoEnabled}
              value={videoEnabled}
            />
          </View>

          {/* Video Price Input */}
          <View>
            <Text
              style={{
                fontSize: 15,
                fontFamily: FONT.Medium,
                color: "#FFFFFF",
                marginBottom: 12,
              }}
            >
              Price per minute (GEL)
            </Text>
            <TextInput
              style={{
                backgroundColor: "#19191B",
                borderRadius: 12,
                height: 48,
                paddingHorizontal: 16,
                fontSize: 16,
                fontFamily: FONT.Regular,
                color: "#6C6C70",
              }}
              value={videoPrice}
              onChangeText={setVideoPrice}
              keyboardType="decimal-pad"
              placeholderTextColor="#6C6C70"
            />
          </View>
        </View>

        {/* Audio Calls Section */}
        <View style={{ marginBottom: 24 }}>
          <Text
            style={{
              fontSize: 18,
              fontFamily: FONT.Medium,
              color: "#FFFFFF",
              marginBottom: 20,
            }}
          >
            Audio calls:
          </Text>

          {/* Enable Audio Calls Toggle */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 24,
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Image
                source={require("../../../assets/images/dashboard/call.png")}
                style={{ width: 38, height: 38 }}
              />
              <Text
                style={{
                  fontSize: 15,
                  fontFamily: FONT.Regular,
                  color: "#FFFFFF",
                  marginLeft: 12,
                }}
              >
                Enable paid audio calls
              </Text>
            </View>

            <Switch
              trackColor={{ false: "#3E3E40", true: "#FCCD34" }}
              thumbColor="#FFFFFF"
              ios_backgroundColor="#3E3E40"
              onValueChange={setAudioEnabled}
              value={audioEnabled}
            />
          </View>

          {/* Audio Price Input */}
          <View>
            <Text
              style={{
                fontSize: 15,
                fontFamily: FONT.Medium,
                color: "#FFFFFF",
                marginBottom: 12,
              }}
            >
              Price per minute (GEL)
            </Text>
            <TextInput
              style={{
                backgroundColor: "#19191B",
                borderRadius: 12,
                height: 48,
                paddingHorizontal: 16,
                fontSize: 16,
                fontFamily: FONT.Regular,
                color: "#6C6C70",
              }}
              value={audioPrice}
              onChangeText={setAudioPrice}
              keyboardType="decimal-pad"
              placeholderTextColor="#6C6C70"
            />
          </View>
        </View>
      </View>

      {/* Save Button */}
      <View
        style={{
          paddingHorizontal: 20,
          paddingBottom: 80,
        }}
      >
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

export default VideoCalls;
