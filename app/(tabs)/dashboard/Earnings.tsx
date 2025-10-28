import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  ScrollView,
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
import Svg, { Circle } from "react-native-svg";

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

const EarningsDashboard = () => {
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  const [selectedPeriod, setSelectedPeriod] = useState("Day");

  if (!fontsLoaded) {
    return (
      <View className="flex-1 items-center justify-center bg-black">
        <ActivityIndicator color="#FCCD34" />
      </View>
    );
  }

  const PeriodButton = ({ title, isSelected }: any) => (
    <StyledTouchableOpacity
      onPress={() => setSelectedPeriod(title)}
      style={{
        paddingTop: 8,
        paddingRight: 12,
        paddingBottom: 8,
        paddingLeft: 12,
        borderRadius: 8,
        backgroundColor: isSelected ? "#FCCD34" : "transparent",
        minWidth: 52,
        height: 33,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <StyledText
        style={{
          fontSize: 14,
          fontFamily: FONT.SemiBold,
          color: isSelected ? "#000000" : "#6C6C70",
        }}
      >
        {title}
      </StyledText>
    </StyledTouchableOpacity>
  );

  const CircularChart = () => {
    const size = 200;
    const strokeWidth = 25;
    const center = size / 2;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;

    // Percentages for each segment
    const messagesPercent = 50; // 400 GEL
    const videoPercent = 56; // 700 GEL (50 + 56 = 106)
    const donationsPercent = 12; // 150 GEL (106 + 12 = 118)

    const messagesOffset = 0;
    const videoOffset = (messagesPercent / 100) * circumference;
    const donationsOffset =
      ((messagesPercent + videoPercent) / 100) * circumference;

    return (
      <StyledView style={{ alignItems: "center", justifyContent: "center" }}>
        <Svg
          width={size}
          height={size}
          style={{ transform: [{ rotate: "-90deg" }] }}
        >
          {/* Messages segment -- Yellow */}
          <Circle
            cx={center}
            cy={center}
            r={radius}
            stroke="#FCCD34"
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={
              circumference - (messagesPercent / 100) * circumference
            }
            strokeLinecap="round"
          />
          {/* Video & Audio segment - Cyan */}
          <Circle
            cx={center}
            cy={center}
            r={radius}
            stroke="#5AC8FA"
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={
              circumference - (videoPercent / 100) * circumference
            }
            strokeLinecap="round"
            rotation={-90 + (messagesPercent / 100) * 360}
            origin={`${center}, ${center}`}
          />
          {/* Donations segment - Purple */}
          <Circle
            cx={center}
            cy={center}
            r={radius}
            stroke="#AF52DE"
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={
              circumference - (donationsPercent / 100) * circumference
            }
            strokeLinecap="round"
            rotation={-90 + ((messagesPercent + videoPercent) / 100) * 360}
            origin={`${center}, ${center}`}
          />
        </Svg>
        {/* Center content */}
        <StyledView
          style={{
            position: "absolute",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <StyledText
            style={{
              fontSize: 11,
              fontFamily: FONT.Regular,
              color: "#8E8E93",
              marginBottom: 4,
            }}
          >
            Total balance
          </StyledText>
          <StyledText
            style={{
              fontSize: 10,
              fontFamily: FONT.Regular,
              color: "#FCCD34",
              marginBottom: 8,
            }}
          >
            100%
          </StyledText>
          <StyledText
            style={{
              fontSize: 24,
              fontFamily: FONT.SemiBold,
              color: "#FFFFFF",
              letterSpacing: -1,
            }}
          >
            1250 GEL
          </StyledText>
          <StyledText
            style={{
              fontSize: 10,
              fontFamily: FONT.Regular,
              color: "#FCCD34",
              marginTop: 4,
            }}
          >
            Last 7 days: +35.20 GEL
          </StyledText>
        </StyledView>
      </StyledView>
    );
  };

  const EarningItem = ({ title, amount, percentage, color }: any) => (
    <StyledView
      style={{
        marginBottom: 20,
      }}
    >
      <StyledView
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 8,
        }}
      >
        <StyledText
          style={{
            fontSize: 15,
            fontFamily: FONT.Regular,
            color: "#FFFFFF",
          }}
        >
          {title}
        </StyledText>
        <StyledView style={{ flexDirection: "row", alignItems: "center" }}>
          <StyledText
            style={{
              fontSize: 12,
              fontFamily: FONT.Regular,
              color: "#FFFFFF",
              marginRight: 8,
            }}
          >
            {amount}
          </StyledText>
          <StyledText
            style={{
              fontSize: 12,
              fontFamily: FONT.Regular,
              color: "#FCCD34",
            }}
          >
            {percentage}
          </StyledText>
        </StyledView>
      </StyledView>
      <StyledView
        style={{
          height: 6,
          backgroundColor: "#2C2C2E",
          borderRadius: 3,
          overflow: "hidden",
        }}
      >
        <StyledView
          style={{
            height: 6,
            width: `${parseInt(percentage)}%`,
            backgroundColor: color,
            borderRadius: 3,
          }}
        />
      </StyledView>
    </StyledView>
  );

  const HistoryItem = ({ icon, title, date, amount, isPositive }: any) => (
    <StyledView
      style={{
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 16,

        borderRadius: 12,
        marginBottom: 8,
      }}
    >
      <StyledView
        style={{
          width: 40,
          height: 40,
          backgroundColor: "#1F1F21",
          borderRadius: 7.75,
          alignItems: "center",
          justifyContent: "center",
          marginRight: 16,
        }}
      >
        <StyledImage
          source={icon}
          style={{ width: 22, height: 22 }}
          resizeMode="contain"
        />
      </StyledView>
      <StyledView style={{ flex: 1 }}>
        <StyledText
          style={{
            fontSize: 16,
            fontFamily: FONT.Medium,
            color: "#FFFFFF",
            marginBottom: 4,
          }}
        >
          {title}
        </StyledText>
        <StyledText
          style={{
            fontSize: 13,
            fontFamily: FONT.Regular,
            color: "#808080",
          }}
        >
          {date}
        </StyledText>
      </StyledView>
      <StyledText
        style={{
          fontSize: 15,
          fontFamily: FONT.Regular,
          color: isPositive ? "#75FA94" : "#FF3B30",
        }}
      >
        {amount}
      </StyledText>
    </StyledView>
  );

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
          className="text-white"
          style={{
            fontSize: 18,
            fontFamily: FONT.SemiBold,
          }}
        >
          Dashboard
        </StyledText>
        <StyledTouchableOpacity
          style={{
            position: "absolute",
            right: 20,
            width: 40,
            height: 40,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <StyledImage
            source={require("../../../assets/images/filter-icon.png")}
            style={{ width: 20, height: 20 }}
            resizeMode="contain"
          />
        </StyledTouchableOpacity>
      </StyledView>

      <StyledScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingHorizontal: 24,
          paddingTop: 20,
        }}
      >
        {/* Period Selector */}
        <StyledView
          style={{
            flexDirection: "row",
            justifyContent: "center",
            gap: 4,
            marginBottom: 32,
          }}
        >
          <PeriodButton title="Day" isSelected={selectedPeriod === "Day"} />
          <PeriodButton title="Week" isSelected={selectedPeriod === "Week"} />
          <PeriodButton title="Month" isSelected={selectedPeriod === "Month"} />
        </StyledView>

        {/* Circular Chart */}
        <StyledView style={{ marginBottom: 40 }}>
          <CircularChart />
        </StyledView>

        {/* Earnings Breakdown */}
        <StyledView style={{ marginBottom: 32 }}>
          <EarningItem
            title="Messages"
            amount="+400 GEL"
            percentage="32%"
            color="#FCCD34"
          />
          <EarningItem
            title="Video & Audio calls"
            amount="+700 GEL"
            percentage="32%"
            color="#5AC8FA"
          />
          <EarningItem
            title="Donations"
            amount="+150 GEL"
            percentage="32%"
            color="#AF52DE"
          />
        </StyledView>

        {/* Earnings History */}
        <StyledView style={{ marginBottom: 40 }}>
          <StyledView
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 16,
            }}
          >
            <StyledText
              style={{
                fontSize: 18,
                fontFamily: FONT.Bold,
                color: "#FFFFFF",
              }}
            >
              Earnings history
            </StyledText>
            <StyledTouchableOpacity>
              <StyledText
                style={{
                  fontSize: 12,
                  fontFamily: FONT.Regular,
                  color: "#8E8E93",
                }}
              >
                See all..
              </StyledText>
            </StyledTouchableOpacity>
          </StyledView>

          <HistoryItem
            icon={require("../../../assets/images/dashboard/paid-icon.png")}
            title="Paid message"
            date="1 May, 2025 08:22"
            amount="+0.05 GEL"
            isPositive={true}
          />
          <HistoryItem
            icon={require("../../../assets/images/dashboard/video-icon.png")}
            title="Calls"
            date="1 May, 2025 08:22"
            amount="+0.05 GEL"
            isPositive={true}
          />
          <HistoryItem
            icon={require("../../../assets/images/dashboard/withdraw-icon.png")}
            title="Withdrawal"
            date="1 May, 2025 08:22"
            amount="-0.05 GEL"
            isPositive={false}
          />
          <HistoryItem
            icon={require("../../../assets/images/dashboard/donation-icon.png")}
            title="Donations"
            date="1 May, 2025 08:22"
            amount="+0.05 GEL"
            isPositive={true}
          />
        </StyledView>
      </StyledScrollView>
    </StyledSafeAreaView>
  );
};

export default EarningsDashboard;
