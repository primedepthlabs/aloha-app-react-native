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
  Modal,
} from "react-native";
import { styled } from "nativewind";
import { ChevronLeft, Calendar, Copy } from "lucide-react-native";
import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
} from "@expo-google-fonts/poppins";
import { router } from "expo-router";
import Svg, { Circle, Path } from "react-native-svg";

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
  const [filterVisible, setFilterVisible] = useState(false);
  const [historyVisible, setHistoryVisible] = useState(false);
  const [receiptVisible, setReceiptVisible] = useState(false);

  // Filter states
  const [fromDate, setFromDate] = useState("09-10-2025");
  const [toDate, setToDate] = useState("09-11-2025");
  const [selectedDatePeriod, setSelectedDatePeriod] = useState("This Month");
  const [selectedSources, setSelectedSources] = useState<string[]>([]);

  // Selected transaction for receipt
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null);

  if (!fontsLoaded) {
    return (
      <View className="flex-1 items-center justify-center bg-black">
        <ActivityIndicator color="#FCCD34" />
      </View>
    );
  }

  const getActiveFiltersCount = () => {
    let count = 0;
    if (selectedDatePeriod) count++;
    if (selectedSources.length > 0) count += selectedSources.length;
    return count;
  };

  const toggleSource = (source: string) => {
    if (selectedSources.includes(source)) {
      setSelectedSources(selectedSources.filter((s) => s !== source));
    } else {
      setSelectedSources([...selectedSources, source]);
    }
  };

  const handleHistoryItemClick = (item: any) => {
    // set selected transaction first
    setSelectedTransaction(item);

    // close other modals that might block the receipt modal
    setFilterVisible(false);
    setHistoryVisible(false);

    // now open the receipt modal
    setReceiptVisible(true);
  };

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

    const messagesPercent = 50;
    const videoPercent = 56;
    const donationsPercent = 12;

    return (
      <StyledView style={{ alignItems: "center", justifyContent: "center" }}>
        <Svg
          width={size}
          height={size}
          style={{ transform: [{ rotate: "-90deg" }] }}
        >
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
    <StyledView style={{ marginBottom: 20 }}>
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

  const HistoryItem = ({
    icon,
    title,
    date,
    amount,
    isPositive,
    data,
  }: any) => (
    <StyledTouchableOpacity
      onPress={() => handleHistoryItemClick(data)}
      style={{
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 10,
        borderRadius: 12,
        marginBottom: 4,
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
    </StyledTouchableOpacity>
  );

  const historyData = [
    {
      icon: require("../../../assets/images/dashboard/paid-icon.png"),
      title: "Paid message",
      date: "1 May, 2025 08:22",
      amount: "+0.05 GEL",
      isPositive: true,
      type: "Paid Message",
      from: "Ellen Smith",
      gross: "0.50 GEL",
      fee: "0.05 GEL",
      transactionId: "A1B2C4R4HD7",
    },
    {
      icon: require("../../../assets/images/dashboard/video-icon.png"),
      title: "Calls",
      date: "1 May, 2025 08:22",
      amount: "+0.05 GEL",
      isPositive: true,
      type: "Video Call",
      from: "John Doe",
      gross: "0.50 GEL",
      fee: "0.05 GEL",
      transactionId: "B2C3D5E6FG8",
    },
    {
      icon: require("../../../assets/images/dashboard/withdraw-icon.png"),
      title: "Withdrawal",
      date: "1 May, 2025 08:22",
      amount: "-0.05 GEL",
      isPositive: false,
      type: "Withdrawal",
      from: "Bank Account",
      gross: "0.50 GEL",
      fee: "0.05 GEL",
      transactionId: "C3D4E6F7GH9",
    },
    {
      icon: require("../../../assets/images/dashboard/donation-icon.png"),
      title: "Donations",
      date: "1 May, 2025 08:22",
      amount: "+0.05 GEL",
      isPositive: true,
      type: "Donation",
      from: "Sarah Johnson",
      gross: "0.50 GEL",
      fee: "0.05 GEL",
      transactionId: "D4E5F7G8HI0",
    },
  ];

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
          onPress={() => setFilterVisible(true)}
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
            <StyledTouchableOpacity onPress={() => setHistoryVisible(true)}>
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

          {historyData.slice(0, 4).map((item, index) => (
            <HistoryItem key={index} {...item} data={item} />
          ))}
        </StyledView>
      </StyledScrollView>

      {/* Earnings History Modal */}
      <Modal
        animationType="slide"
        transparent={false}
        visible={historyVisible}
        onRequestClose={() => setHistoryVisible(false)}
      >
        <StyledSafeAreaView className="flex-1 bg-black">
          <StatusBar barStyle="light-content" />

          {/* History Header */}
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
              onPress={() => setHistoryVisible(false)}
              style={{
                position: "absolute",
                left: 20,
              }}
            >
              <ChevronLeft size={28} color="#FFFFFF" strokeWidth={2} />
            </StyledTouchableOpacity>
            <StyledText
              className="text-white"
              style={{
                fontSize: 15,
                fontFamily: FONT.SemiBold,
              }}
            >
              Earnings History
            </StyledText>
            <StyledTouchableOpacity
              onPress={() => setFilterVisible(true)}
              style={{
                position: "absolute",
                right: 20,
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
            contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 20 }}
          >
            {historyData.map((item, index) => (
              <HistoryItem key={index} {...item} data={item} />
            ))}
            {historyData.map((item, index) => (
              <HistoryItem key={`duplicate-${index}`} {...item} data={item} />
            ))}
          </StyledScrollView>
        </StyledSafeAreaView>
      </Modal>

      {/* Filter Modal */}
      <Modal
        animationType="slide"
        transparent={false}
        visible={filterVisible}
        onRequestClose={() => setFilterVisible(false)}
      >
        <StyledSafeAreaView className="flex-1 bg-black">
          <StatusBar barStyle="light-content" />

          {/* Filter Header */}
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
              onPress={() => setFilterVisible(false)}
              style={{
                position: "absolute",
                left: 20,
              }}
            >
              <ChevronLeft size={28} color="#FFFFFF" strokeWidth={2} />
            </StyledTouchableOpacity>
            <StyledText
              className="text-white"
              style={{
                fontSize: 15,
                fontFamily: FONT.SemiBold,
              }}
            >
              Filter
            </StyledText>
            <StyledTouchableOpacity
              onPress={() => {
                setSelectedDatePeriod("");
                setSelectedSources([]);
              }}
              style={{
                position: "absolute",
                right: 20,
              }}
            >
              <StyledText
                style={{
                  color: "#FCCD34",
                  fontSize: 14,
                  fontFamily: FONT.Medium,
                }}
              >
                Reset
              </StyledText>
            </StyledTouchableOpacity>
          </StyledView>

          <StyledScrollView style={{ flex: 1, paddingHorizontal: 20 }}>
            {/* Date Range */}
            <StyledText
              className="text-[#ffffff]/50"
              style={{
                fontSize: 12,
                fontFamily: FONT.Medium,
                marginTop: 20,
                marginBottom: 12,
              }}
            >
              Date range
            </StyledText>

            <StyledView
              style={{ flexDirection: "row", gap: 12, marginBottom: 16 }}
            >
              <StyledView style={{ flex: 1 }}>
                <StyledText
                  className="text-gray-400"
                  style={{
                    fontSize: 12,
                    fontFamily: FONT.Regular,
                    marginBottom: 8,
                  }}
                >
                  From
                </StyledText>
                <StyledView
                  style={{
                    backgroundColor: "#19191B",
                    borderRadius: 12,
                    borderWidth: 1,
                    borderColor: "#FCCD34",
                    height: 48,
                    paddingHorizontal: 16,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <StyledText
                    className="text-white"
                    style={{
                      fontSize: 13,
                      fontFamily: FONT.Regular,
                    }}
                  >
                    {fromDate}
                  </StyledText>
                  <Calendar size={20} color="#555E67" />
                </StyledView>
              </StyledView>

              <StyledView style={{ flex: 1 }}>
                <StyledText
                  className="text-gray-400"
                  style={{
                    fontSize: 13,
                    fontFamily: FONT.Regular,
                    marginBottom: 8,
                  }}
                >
                  To
                </StyledText>
                <StyledView
                  style={{
                    backgroundColor: "#19191B",
                    borderRadius: 12,
                    height: 48,
                    paddingHorizontal: 16,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <StyledText
                    className="text-gray-400"
                    style={{
                      fontSize: 12,
                      fontFamily: FONT.Regular,
                    }}
                  >
                    {toDate}
                  </StyledText>
                  <Calendar size={20} color="#555E67" />
                </StyledView>
              </StyledView>
            </StyledView>

            {/* Period Buttons */}
            <StyledView
              style={{ flexDirection: "row", gap: 12, marginBottom: 24 }}
            >
              {["Today", "This Week", "This Month"].map((period) => (
                <StyledTouchableOpacity
                  key={period}
                  onPress={() => setSelectedDatePeriod(period)}
                  style={{
                    backgroundColor: "#19191B",
                    borderRadius: 11,
                    paddingHorizontal: 20,
                    paddingVertical: 10,
                    borderWidth: 1,
                    borderColor:
                      selectedDatePeriod === period ? "#FCCD34" : "transparent",
                  }}
                >
                  <StyledText
                    style={{
                      color:
                        selectedDatePeriod === period ? "#FFFFFF" : "#555E67",
                      fontSize: 12,
                      fontFamily: FONT.Regular,
                    }}
                  >
                    {period}
                  </StyledText>
                </StyledTouchableOpacity>
              ))}
            </StyledView>

            {/* Transaction Source */}
            <StyledText
              className="text-[#ffffff]/50"
              style={{
                fontSize: 12,
                fontFamily: FONT.Medium,
                marginBottom: 12,
              }}
            >
              Transaction Source
            </StyledText>
            <StyledView
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
                gap: 12,
                marginBottom: 32,
              }}
            >
              {["Messages", "Donations", "Calls", "Withdrawal"].map(
                (source) => (
                  <StyledTouchableOpacity
                    key={source}
                    onPress={() => toggleSource(source)}
                    style={{
                      backgroundColor: "#19191B",
                      borderRadius: 15,
                      paddingHorizontal: 10,
                      paddingVertical: 10,
                      borderWidth: 1,
                      borderColor: selectedSources.includes(source)
                        ? "#FCCD34"
                        : "transparent",
                    }}
                  >
                    <StyledText
                      style={{
                        color: selectedSources.includes(source)
                          ? "#FFFFFF"
                          : "#555E67",
                        fontSize: 12,
                        fontFamily: FONT.Regular,
                      }}
                    >
                      {source}
                    </StyledText>
                  </StyledTouchableOpacity>
                )
              )}
            </StyledView>
          </StyledScrollView>

          {/* Apply Button */}
          <StyledView
            style={{ paddingHorizontal: 20, paddingBottom: 80, paddingTop: 5 }}
          >
            <StyledTouchableOpacity
              onPress={() => setFilterVisible(false)}
              style={{
                backgroundColor: "#FCCD34",
                borderRadius: 25,
                height: 48,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <StyledText
                className="text-black"
                style={{
                  fontSize: 17,
                  fontFamily: FONT.SemiBold,
                }}
              >
                Apply filters({getActiveFiltersCount()})
              </StyledText>
            </StyledTouchableOpacity>
          </StyledView>
        </StyledSafeAreaView>
      </Modal>

      {/* Receipt Modal */}
      <Modal
        animationType="slide"
        transparent={false}
        visible={receiptVisible}
        onRequestClose={() => setReceiptVisible(false)}
      >
        <StyledSafeAreaView className="flex-1 bg-black">
          <StatusBar barStyle="light-content" />

          {/* Header */}
          <StyledView
            style={{
              height: 56,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              paddingHorizontal: 14,
              position: "relative",
            }}
          >
            <StyledTouchableOpacity
              onPress={() => setReceiptVisible(false)}
              style={{
                position: "absolute",
                left: 12,
                width: 40,
                height: 40,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <ChevronLeft size={24} color="#FFFFFF" strokeWidth={2} />
            </StyledTouchableOpacity>

            <StyledText
              style={{
                fontSize: 16,
                fontFamily: FONT.SemiBold,
                color: "#FFFFFF",
              }}
            >
              Message Fee History
            </StyledText>
          </StyledView>

          {/* Body (fixed layout - no scroll) */}
          <StyledView
            style={{
              flex: 1,
              paddingHorizontal: 20,
              paddingTop: 6,
              paddingBottom: 12,
              justifyContent: "space-between", // keeps content distributed to fit screen
            }}
          >
            {/* Top content (icon + amount + subtitle) */}
            <StyledView style={{ alignItems: "center", marginTop: 2 }}>
              <Image
                source={require("../../../assets/images/Check.png")}
                style={{ width: 40, height: 40 }}
                resizeMode="contain"
              />

              <StyledText
                style={{
                  fontSize: 20,
                  fontFamily: FONT.SemiBold,
                  color: "#FFFFFF",
                  marginTop: 10,
                }}
              >
                {selectedTransaction?.amount || "+0.45 GEL"}
              </StyledText>

              <StyledText
                style={{
                  fontSize: 11,
                  fontFamily: FONT.Regular,
                  color: "#FCCD34",
                  marginTop: 6,
                }}
              >
                Income successfully recorded
              </StyledText>
            </StyledView>

            {/* Middle content (compact cards stacked) */}
            <StyledView style={{ flexShrink: 1, gap: 8 }}>
              {/* Transaction details */}
              <StyledText
                style={{
                  fontSize: 13,
                  fontFamily: FONT.SemiBold,
                  color: "#FFFFFF",
                  marginBottom: 6,
                }}
              >
                Transaction details
              </StyledText>

              <StyledView
                style={{
                  backgroundColor: "#19191B",
                  borderRadius: 12,
                  paddingVertical: 10,
                  paddingHorizontal: 12,
                  marginBottom: 6,
                }}
              >
                <StyledView
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    paddingVertical: 6,
                    borderBottomWidth: 1,
                    borderBottomColor: "#2C2C2E",
                  }}
                >
                  <StyledText
                    style={{
                      fontSize: 13,
                      fontFamily: FONT.Regular,
                      color: "#6F6F70",
                    }}
                  >
                    Transaction type:
                  </StyledText>
                  <StyledText
                    style={{
                      fontSize: 13,
                      fontFamily: FONT.Medium,
                      color: "#FFFFFF",
                    }}
                  >
                    {selectedTransaction?.type || "Paid Message"}
                  </StyledText>
                </StyledView>

                <StyledView
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    paddingVertical: 6,
                  }}
                >
                  <StyledText
                    style={{
                      fontSize: 13,
                      fontFamily: FONT.Regular,
                      color: "#6F6F70",
                    }}
                  >
                    Received from:
                  </StyledText>
                  <StyledText
                    style={{
                      fontSize: 13,
                      fontFamily: FONT.Medium,
                      color: "#FFFFFF",
                    }}
                  >
                    {selectedTransaction?.from || "Ellen Smith"}
                  </StyledText>
                </StyledView>
              </StyledView>

              {/* Income breakdown */}
              <StyledText
                style={{
                  fontSize: 13,
                  fontFamily: FONT.SemiBold,
                  color: "#FFFFFF",
                  marginBottom: 6,
                }}
              >
                Income breakdown
              </StyledText>

              <StyledView
                style={{
                  backgroundColor: "#1C1C1E",
                  borderRadius: 12,
                  paddingVertical: 10,
                  paddingHorizontal: 12,
                  marginBottom: 6,
                }}
              >
                <StyledView
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    paddingVertical: 6,
                    borderBottomWidth: 1,
                    borderBottomColor: "#2C2C2E",
                  }}
                >
                  <StyledText
                    style={{
                      fontSize: 13,
                      fontFamily: FONT.Regular,
                      color: "#6F6F70",
                    }}
                  >
                    Gross amount charged
                  </StyledText>
                  <StyledText
                    style={{
                      fontSize: 13,
                      fontFamily: FONT.Medium,
                      color: "#FFFFFF",
                    }}
                  >
                    {selectedTransaction?.gross || "0.50 GEL"}
                  </StyledText>
                </StyledView>

                <StyledView
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    paddingVertical: 6,
                  }}
                >
                  <StyledText
                    style={{
                      fontSize: 13,
                      fontFamily: FONT.Regular,
                      color: "#6F6F70",
                    }}
                  >
                    Platform service fee (10%)
                  </StyledText>
                  <StyledText
                    style={{
                      fontSize: 13,
                      fontFamily: FONT.Medium,
                      color: "#FFFFFF",
                    }}
                  >
                    {selectedTransaction?.fee || "0.05 GEL"}
                  </StyledText>
                </StyledView>
              </StyledView>

              {/* Transaction info */}
              <StyledText
                style={{
                  fontSize: 13,
                  fontFamily: FONT.SemiBold,
                  color: "#FFFFFF",
                  marginBottom: 6,
                }}
              >
                Transaction info
              </StyledText>

              <StyledView
                style={{
                  backgroundColor: "#1C1C1E",
                  borderRadius: 12,
                  paddingVertical: 10,
                  paddingHorizontal: 12,
                }}
              >
                <StyledView
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    paddingVertical: 6,
                    borderBottomWidth: 1,
                    borderBottomColor: "#2C2C2E",
                  }}
                >
                  <StyledText
                    style={{
                      fontSize: 13,
                      fontFamily: FONT.Regular,
                      color: "#6F6F70",
                    }}
                  >
                    Date/Time:
                  </StyledText>
                  <StyledText
                    style={{
                      fontSize: 13,
                      fontFamily: FONT.Medium,
                      color: "#FFFFFF",
                    }}
                  >
                    {selectedTransaction?.date || "1 May, 2025 08:22"}
                  </StyledText>
                </StyledView>

                <StyledView
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    paddingVertical: 6,
                  }}
                >
                  <StyledText
                    style={{
                      fontSize: 13,
                      fontFamily: FONT.Regular,
                      color: "#6F6F70",
                    }}
                  >
                    Transaction ID:
                  </StyledText>

                  <StyledView
                    style={{ flexDirection: "row", alignItems: "center" }}
                  >
                    <StyledText
                      style={{
                        fontSize: 13,
                        fontFamily: FONT.Medium,
                        color: "#FFFFFF",
                        marginRight: 6,
                      }}
                    >
                      {selectedTransaction?.transactionId || "A1B2C4R4HD7"}
                    </StyledText>
                    <Copy size={16} color="#FCCD34" />
                  </StyledView>
                </StyledView>
              </StyledView>
            </StyledView>

            {/* Bottom action buttons */}
            <StyledView style={{ paddingTop: 10 }}>
              <StyledTouchableOpacity
                style={{
                  backgroundColor: "#FCCD34",
                  borderRadius: 12,
                  height: 48,
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 10,
                }}
                onPress={() => {
                  /* share logic */
                }}
              >
                <StyledText
                  style={{
                    fontSize: 15,
                    fontFamily: FONT.SemiBold,
                    color: "#000",
                  }}
                >
                  Share receipt
                </StyledText>
              </StyledTouchableOpacity>

              <StyledTouchableOpacity
                style={{
                  backgroundColor: "transparent",
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: "#FFFFFF",
                  height: 48,
                  alignItems: "center",
                  justifyContent: "center",
                }}
                onPress={() => {
                  /* support logic */
                }}
              >
                <StyledText
                  style={{
                    fontSize: 15,
                    fontFamily: FONT.SemiBold,
                    color: "#FFFFFF",
                  }}
                >
                  Get support
                </StyledText>
              </StyledTouchableOpacity>
            </StyledView>
          </StyledView>
        </StyledSafeAreaView>
      </Modal>
    </StyledSafeAreaView>
  );
};

export default EarningsDashboard;
