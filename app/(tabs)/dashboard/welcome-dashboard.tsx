import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StatusBar,
  Dimensions,
} from "react-native";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { ChevronLeft } from "lucide-react-native";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export default function WelcomeDashboard() {
  return (
    <View style={{ flex: 1, backgroundColor: "#000000" }}>
      <StatusBar barStyle="light-content" />

      <LinearGradient
        colors={[
          "#0A0A0A", // very dark gray top
          "#000000", // soft dark blue-gray middle
          "#1C1B2F", // bluish tone mid-lower
          "#2A1E10", // warm brownish tone lower
          "#3B2A12", // golden brown tint
        ]}
        locations={[0, 0.25, 0.5, 0.75, 1]}
        style={{ flex: 1 }}
      >
        {/* Content Container */}
        <View style={{ flex: 1 }}>
          {/* Header */}
          <View style={{ paddingTop: 48, paddingHorizontal: 24 }}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 50,
              }}
            >
              <TouchableOpacity
                onPress={() => router.push("/(tabs)/dashboard")}
              >
                <ChevronLeft size={26} color="#FFFFFF" strokeWidth={2} />
              </TouchableOpacity>

              {/* Progress Bar */}
              <View
                style={{
                  flex: 1,
                  height: 3,
                  backgroundColor: "#2A2A2A",
                  marginLeft: 16,
                  borderRadius: 10,
                  overflow: "hidden",
                }}
              >
                <View
                  style={{
                    width: "30%",
                    height: "100%",
                    backgroundColor: "#FCCD34",
                    borderRadius: 10,
                  }}
                />
              </View>
            </View>

            {/* Title */}
            <Text
              style={{
                fontSize: 26,
                lineHeight: 32,
                fontWeight: "600",
                textAlign: "center",
                color: "#FFFFFF",
                marginBottom: 16,
                paddingHorizontal: 20,
              }}
            >
              Welcome Aboard!{"\n"}Time to Start Earning
            </Text>

            {/* Subtitle */}
            <Text
              style={{
                fontSize: 14,
                lineHeight: 21,
                textAlign: "center",
                color: "#9E9E9E",
                paddingHorizontal: 32,
              }}
            >
              Ready to convert your influence into direct income? Here, you
              control the price: set your fee for personalized messages and
              video calls
            </Text>
          </View>

          {/* Center Image Area - Using mask.png */}
          <View
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
              marginTop: 0,
              marginBottom: 150,
            }}
          >
            <Image
              source={require("../../../assets/images/dashboard/mask.png")}
              style={{
                width: 400,
                height: 800,
              }}
              resizeMode="contain"
            />
          </View>

          {/* Bottom Button */}
          <View style={{ paddingHorizontal: 24, paddingBottom: 90 }}>
            <TouchableOpacity
              style={{
                width: "100%",
                height: 56,
                backgroundColor: "#FCCD34",
                borderRadius: 28,
                alignItems: "center",
                justifyContent: "center",
                shadowColor: "#FCCD34",
                shadowOffset: { width: 0, height: 6 },
                shadowOpacity: 0.4,
                shadowRadius: 24,
                elevation: 10,
              }}
              onPress={() => router.push("/(tabs)/dashboard/photo")}
              activeOpacity={0.85}
            >
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "600",
                  color: "#000000",
                  letterSpacing: 0.5,
                }}
              >
                Continue
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
}
