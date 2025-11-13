import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  Switch,
  Image,
  ScrollView,
} from "react-native";
import { ChevronLeft, ChevronRight } from "lucide-react-native";
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

const Payout = () => {
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  const [autoWithdrawal, setAutoWithdrawal] = useState(false);

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
          Payout Rules
        </Text>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 30 }}
      >
        {/* Bank Transfer Section */}
        <View style={{ marginBottom: 32 }}>
          <Text
            style={{
              fontSize: 18,
              fontFamily: FONT.Medium,
              color: "#FFFFFF",
              marginBottom: 20,
            }}
          >
            Bank transfer
          </Text>

          {/* Bank Account Card */}
          <TouchableOpacity
            style={{
              backgroundColor: "#19191B",
              borderRadius: 12,
              padding: 16,
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 16,
            }}
            onPress={() => router.push("/addbank")}
          >
            <View
              style={{
                width: 48,
                height: 48,
                backgroundColor: "#2A5A7D",
                borderRadius: 8,
                alignItems: "center",
                justifyContent: "center",
                marginRight: 12,
              }}
            >
              <Image
                source={require("../../../assets/images/dashboard/bank.png")}
                style={{ width: 24, height: 24 }}
                resizeMode="contain"
              />
            </View>

            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontSize: 15,
                  fontFamily: FONT.Medium,
                  color: "#FFFFFF",
                }}
              >
                IBAN: GE**** 1234
              </Text>
            </View>

            <ChevronRight size={24} color="#6C6C70" strokeWidth={2} />
          </TouchableOpacity>

          {/* Add Bank Account Button */}
          <TouchableOpacity
            style={{
              backgroundColor: "transparent",
              borderRadius: 12,
              borderWidth: 1,
              borderColor: "#FCCD34",
              height: 48,
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "row",
            }}
            onPress={() => router.push("/(tabs)/dashboard/addbank")}
          >
            <Text
              style={{
                fontSize: 15,
                fontFamily: FONT.Medium,
                color: "#FFFFFF",
                marginRight: 8,
              }}
            >
              +
            </Text>
            <Text
              style={{
                fontSize: 15,
                fontFamily: FONT.Medium,
                color: "#FFFFFF",
              }}
            >
              Add bank account
            </Text>
          </TouchableOpacity>

          <Text
            style={{
              fontSize: 12,
              fontFamily: FONT.Regular,
              color: "#FCCD34",
              marginTop: 12,
            }}
          >
            Maximum 3 accounts can be linked for payouts
          </Text>
        </View>

        {/* Auto Withdrawal Section */}
        <View style={{ marginBottom: 24 }}>
          <Text
            style={{
              fontSize: 18,
              fontFamily: FONT.Medium,
              color: "#FFFFFF",
              marginBottom: 20,
            }}
          >
            Auto withdrawal one time per week
          </Text>

          {/* Toggle */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 16,
            }}
          >
            <Text
              style={{
                fontSize: 15,
                fontFamily: FONT.Regular,
                color: "#FFFFFF",
              }}
            >
              Enable auto withdrawal
            </Text>

            <Switch
              trackColor={{ false: "#3E3E40", true: "#FCCD34" }}
              thumbColor="#FFFFFF"
              ios_backgroundColor="#3E3E40"
              onValueChange={setAutoWithdrawal}
              value={autoWithdrawal}
            />
          </View>

          <Text
            style={{
              fontSize: 12,
              fontFamily: FONT.Regular,
              color: "#FCCD34",
            }}
          >
            Automatic payouts are processed every Monday
          </Text>
        </View>
      </ScrollView>

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

export default Payout;
