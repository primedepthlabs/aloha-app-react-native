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
import { styled } from "nativewind";
import { ChevronLeft, ChevronRight } from "lucide-react-native";
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
const StyledImage = styled(Image);

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
      <View className="flex-1 items-center justify-center bg-black">
        <ActivityIndicator color="#FCCD34" />
      </View>
    );
  }

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
          <ChevronLeft size={26} color="#FFFFFF" strokeWidth={2} />
        </StyledTouchableOpacity>
        <StyledText
          style={{
            fontSize: 15,
            fontFamily: FONT.SemiBold,
            color: "#FFFFFF",
          }}
        >
          Payout Rules
        </StyledText>
      </StyledView>

      <StyledScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 30 }}
      >
        {/* Bank Transfer Section */}
        <StyledView style={{ marginBottom: 32 }}>
          <StyledText
            style={{
              fontSize: 18,
              fontFamily: FONT.Medium,
              color: "#FFFFFF",
              marginBottom: 20,
            }}
          >
            Bank transfer
          </StyledText>

          {/* Bank Account Card */}
          <StyledTouchableOpacity
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
            <StyledView
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
            </StyledView>
            <StyledView style={{ flex: 1 }}>
              <StyledText
                style={{
                  fontSize: 15,
                  fontFamily: FONT.Medium,
                  color: "#FFFFFF",
                }}
              >
                IBAN: GE**** 1234
              </StyledText>
            </StyledView>
            <ChevronRight size={24} color="#6C6C70" strokeWidth={2} />
          </StyledTouchableOpacity>

          {/* Add Bank Account Button */}
          <StyledTouchableOpacity
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
            <StyledText
              style={{
                fontSize: 15,
                fontFamily: FONT.Medium,
                color: "#FFFFFF",
                marginRight: 8,
              }}
            >
              +
            </StyledText>
            <StyledText
              style={{
                fontSize: 15,
                fontFamily: FONT.Medium,
                color: "#FFFFFF",
              }}
            >
              Add bank account
            </StyledText>
          </StyledTouchableOpacity>

          <StyledText
            style={{
              fontSize: 12,
              fontFamily: FONT.Regular,
              color: "#FCCD34",
              marginTop: 12,
            }}
          >
            Maximum 3 accounts can be linked for payouts
          </StyledText>
        </StyledView>

        {/* Auto Withdrawal Section */}
        <StyledView style={{ marginBottom: 24 }}>
          <StyledText
            style={{
              fontSize: 18,
              fontFamily: FONT.Medium,
              color: "#FFFFFF",
              marginBottom: 20,
            }}
          >
            Auto withdrawal one times per week
          </StyledText>

          {/* Enable Auto Withdrawal Toggle */}
          <StyledView
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 16,
            }}
          >
            <StyledText
              style={{
                fontSize: 15,
                fontFamily: FONT.Regular,
                color: "#FFFFFF",
              }}
            >
              Enable auto withdrawal
            </StyledText>
            <Switch
              trackColor={{ false: "#3E3E40", true: "#FCCD34" }}
              thumbColor="#FFFFFF"
              ios_backgroundColor="#3E3E40"
              onValueChange={setAutoWithdrawal}
              value={autoWithdrawal}
            />
          </StyledView>

          <StyledText
            style={{
              fontSize: 12,
              fontFamily: FONT.Regular,
              color: "#FCCD34",
            }}
          >
            Automatic payouts are procceed every Monday
          </StyledText>
        </StyledView>
      </StyledScrollView>

      {/* Save Button */}
      <StyledView
        style={{
          paddingHorizontal: 20,
          paddingBottom: 80,
        }}
      >
        <StyledTouchableOpacity
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
          <StyledText
            style={{
              fontSize: 17,
              fontFamily: FONT.SemiBold,
              color: "#000000",
            }}
          >
            Save changes
          </StyledText>
        </StyledTouchableOpacity>
      </StyledView>
    </StyledSafeAreaView>
  );
};

export default Payout;
