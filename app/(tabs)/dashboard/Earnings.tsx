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
import { ChevronLeft, Calendar, Copy } from "lucide-react-native";
import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
} from "@expo-google-fonts/poppins";
import { router } from "expo-router";
import Svg, { Circle } from "react-native-svg";

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

  const [fromDate, setFromDate] = useState("09-10-2025");
  const [toDate, setToDate] = useState("09-11-2025");
  const [selectedDatePeriod, setSelectedDatePeriod] = useState("This Month");
  const [selectedSources, setSelectedSources] = useState<string[]>([]);

  const [selectedTransaction, setSelectedTransaction] = useState<any>(null);

  if (!fontsLoaded) {
    return (
      <View className="flex-1 bg-black justify-center items-center">
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
    setSelectedTransaction(item);
    setFilterVisible(false);
    setHistoryVisible(false);
    setReceiptVisible(true);
  };

  const PeriodButton = ({ title, isSelected }: any) => (
    <TouchableOpacity
      onPress={() => setSelectedPeriod(title)}
      style={{
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 8,
        backgroundColor: isSelected ? "#FCCD34" : "transparent",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Text
        style={{
          fontSize: 14,
          fontFamily: FONT.SemiBold,
          color: isSelected ? "#000" : "#6C6C70",
        }}
      >
        {title}
      </Text>
    </TouchableOpacity>
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
      <View style={{ alignItems: "center" }}>
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

        {/* Center content */}
        <View style={{ position: "absolute", alignItems: "center" }}>
          <Text
            style={{
              fontSize: 11,
              fontFamily: FONT.Regular,
              color: "#8E8E93",
            }}
          >
            Total balance
          </Text>

          <Text
            style={{
              fontSize: 10,
              fontFamily: FONT.Regular,
              color: "#FCCD34",
            }}
          >
            100%
          </Text>

          <Text
            style={{
              fontSize: 24,
              fontFamily: FONT.SemiBold,
              color: "#FFF",
              marginTop: 2,
            }}
          >
            1250 GEL
          </Text>

          <Text
            style={{
              fontSize: 10,
              fontFamily: FONT.Regular,
              color: "#FCCD34",
            }}
          >
            Last 7 days: +35.20 GEL
          </Text>
        </View>
      </View>
    );
  };

  const EarningItem = ({ title, amount, percentage, color }: any) => (
    <View style={{ marginBottom: 20 }}>
      <View
        style={{ flexDirection: "row", justifyContent: "space-between" }}
      >
        <Text
          style={{
            fontSize: 15,
            fontFamily: FONT.Regular,
            color: "#FFF",
          }}
        >
          {title}
        </Text>

        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Text
            style={{
              fontSize: 12,
              fontFamily: FONT.Regular,
              color: "#FFF",
              marginRight: 8,
            }}
          >
            {amount}
          </Text>

          <Text
            style={{
              fontSize: 12,
              fontFamily: FONT.Regular,
              color: "#FCCD34",
            }}
          >
            {percentage}
          </Text>
        </View>
      </View>

      <View
        style={{
          height: 6,
          backgroundColor: "#2C2C2E",
          borderRadius: 3,
          overflow: "hidden",
        }}
      >
        <View
          style={{
            height: 6,
            width: `${parseInt(percentage)}%`,
            backgroundColor: color,
            borderRadius: 3,
          }}
        />
      </View>
    </View>
  );

  const HistoryItem = ({
    icon,
    title,
    date,
    amount,
    isPositive,
    data,
  }: any) => (
    <TouchableOpacity
      onPress={() => handleHistoryItemClick(data)}
      style={{
        flexDirection: "row",
        paddingVertical: 10,
        borderRadius: 12,
        marginBottom: 4,
      }}
    >
      <View
        style={{
          width: 40,
          height: 40,
          backgroundColor: "#1F1F21",
          borderRadius: 8,
          alignItems: "center",
          justifyContent: "center",
          marginRight: 16,
        }}
      >
        <Image
          source={icon}
          style={{ width: 22, height: 22 }}
          resizeMode="contain"
        />
      </View>

      <View style={{ flex: 1 }}>
        <Text
          style={{
            fontSize: 16,
            fontFamily: FONT.Medium,
            color: "#FFF",
          }}
        >
          {title}
        </Text>

        <Text
          style={{
            fontSize: 13,
            fontFamily: FONT.Regular,
            color: "#808080",
          }}
        >
          {date}
        </Text>
      </View>

      <Text
        style={{
          fontSize: 15,
          fontFamily: FONT.Regular,
          color: isPositive ? "#75FA94" : "#FF3B30",
        }}
      >
        {amount}
      </Text>
    </TouchableOpacity>
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
    <SafeAreaView className="flex-1 bg-black">
      <StatusBar barStyle="light-content" />

      {/* HEADER */}
      <View
        style={{
          height: 60,
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
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
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <ChevronLeft size={26} color="#FFF" strokeWidth={2} />
        </TouchableOpacity>

        <Text
          style={{
            color: "#FFF",
            fontSize: 18,
            fontFamily: FONT.SemiBold,
          }}
        >
          Dashboard
        </Text>

        <TouchableOpacity
          onPress={() => setFilterVisible(true)}
          style={{ position: "absolute", right: 20 }}
        >
          <Image
            source={require("../../../assets/images/filter-icon.png")}
            style={{ width: 20, height: 20 }}
          />
        </TouchableOpacity>
      </View>

      {/* BODY */}
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 20 }}
      >
        {/* PERIOD SELECTOR */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            gap: 6,
            marginBottom: 30,
          }}
        >
          <PeriodButton title="Day" isSelected={selectedPeriod === "Day"} />
          <PeriodButton title="Week" isSelected={selectedPeriod === "Week"} />
          <PeriodButton
            title="Month"
            isSelected={selectedPeriod === "Month"}
          />
        </View>

        {/* CHART */}
        <CircularChart />

        {/* EARNING ITEMS */}
        <View style={{ marginTop: 40 }}>
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
        </View>

        {/* HISTORY */}
        <View style={{ marginTop: 40 }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginBottom: 12,
            }}
          >
            <Text
              style={{
                fontSize: 18,
                fontFamily: FONT.Bold,
                color: "#FFF",
              }}
            >
              Earnings history
            </Text>

            <TouchableOpacity onPress={() => setHistoryVisible(true)}>
              <Text
                style={{
                  fontSize: 12,
                  color: "#8E8E93",
                  fontFamily: FONT.Regular,
                }}
              >
                See all..
              </Text>
            </TouchableOpacity>
          </View>

          {historyData.slice(0, 4).map((item, i) => (
            <HistoryItem key={i} {...item} data={item} />
          ))}
        </View>
      </ScrollView>

      {/* ===== MODALS BELOW ===== */}

      {/* HISTORY MODAL */}
      <Modal visible={historyVisible} animationType="slide">
        <SafeAreaView className="flex-1 bg-black">
          <StatusBar barStyle="light-content" />

          <View
            style={{
              height: 60,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
            }}
          >
            <TouchableOpacity
              onPress={() => setHistoryVisible(false)}
              style={{ position: "absolute", left: 20 }}
            >
              <ChevronLeft size={28} color="#FFF" />
            </TouchableOpacity>

            <Text
              style={{ fontFamily: FONT.SemiBold, fontSize: 16, color: "#FFF" }}
            >
              Earnings History
            </Text>
          </View>

          <ScrollView style={{ paddingHorizontal: 24 }}>
            {historyData.map((item, i) => (
              <HistoryItem key={i} {...item} data={item} />
            ))}
          </ScrollView>
        </SafeAreaView>
      </Modal>

      {/* FILTER MODAL */}
      <Modal visible={filterVisible} animationType="slide">
        <SafeAreaView className="flex-1 bg-black">
          <StatusBar barStyle="light-content" />

          <View
            style={{
              height: 60,
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <TouchableOpacity
              onPress={() => setFilterVisible(false)}
              style={{ position: "absolute", left: 20 }}
            >
              <ChevronLeft size={28} color="#FFF" />
            </TouchableOpacity>

            <Text
              style={{
                fontSize: 15,
                color: "#FFF",
                fontFamily: FONT.SemiBold,
              }}
            >
              Filter
            </Text>

            <TouchableOpacity
              onPress={() => {
                setSelectedDatePeriod("");
                setSelectedSources([]);
              }}
              style={{ position: "absolute", right: 20 }}
            >
              <Text style={{ color: "#FCCD34", fontFamily: FONT.Medium }}>
                Reset
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={{ paddingHorizontal: 20 }}>
            {/* DATE RANGE */}
            <Text
              style={{
                fontSize: 12,
                color: "#AAA",
                marginTop: 20,
                marginBottom: 12,
                fontFamily: FONT.Medium,
              }}
            >
              Date range
            </Text>

            {/* FROM - TO */}
            <View style={{ flexDirection: "row", gap: 12 }}>
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    color: "#AAA",
                    fontSize: 12,
                    marginBottom: 6,
                  }}
                >
                  From
                </Text>

                <View
                  style={{
                    backgroundColor: "#19191B",
                    borderRadius: 12,
                    borderWidth: 1,
                    borderColor: "#FCCD34",
                    paddingHorizontal: 16,
                    height: 48,
                    justifyContent: "space-between",
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <Text style={{ fontSize: 13, color: "#FFF" }}>{fromDate}</Text>
                  <Calendar size={20} color="#555" />
                </View>
              </View>

              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    color: "#AAA",
                    fontSize: 12,
                    marginBottom: 6,
                  }}
                >
                  To
                </Text>

                <View
                  style={{
                    backgroundColor: "#19191B",
                    borderRadius: 12,
                    paddingHorizontal: 16,
                    height: 48,
                    justifyContent: "space-between",
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <Text style={{ fontSize: 13, color: "#AAA" }}>{toDate}</Text>
                  <Calendar size={20} color="#555" />
                </View>
              </View>
            </View>

            {/* PERIOD QUICK BUTTONS */}
            <View
              style={{ flexDirection: "row", gap: 12, marginTop: 20 }}
            >
              {["Today", "This Week", "This Month"].map((period) => (
                <TouchableOpacity
                  key={period}
                  onPress={() => setSelectedDatePeriod(period)}
                  style={{
                    backgroundColor: "#19191B",
                    paddingVertical: 10,
                    paddingHorizontal: 20,
                    borderRadius: 10,
                    borderWidth: selectedDatePeriod === period ? 1 : 0,
                    borderColor:
                      selectedDatePeriod === period ? "#FCCD34" : "transparent",
                  }}
                >
                  <Text
                    style={{
                      color:
                        selectedDatePeriod === period ? "#FFF" : "#555E67",
                      fontSize: 12,
                    }}
                  >
                    {period}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* SOURCE FILTER */}
            <Text
              style={{
                fontSize: 12,
                color: "#AAA",
                marginTop: 24,
                marginBottom: 10,
              }}
            >
              Transaction Source
            </Text>

            <View style={{ flexDirection: "row", gap: 12, flexWrap: "wrap" }}>
              {["Messages", "Donations", "Calls", "Withdrawal"].map(
                (source) => (
                  <TouchableOpacity
                    key={source}
                    onPress={() => toggleSource(source)}
                    style={{
                      paddingVertical: 10,
                      paddingHorizontal: 12,
                      backgroundColor: "#19191B",
                      borderRadius: 12,
                      borderWidth: selectedSources.includes(source) ? 1 : 0,
                      borderColor: selectedSources.includes(source)
                        ? "#FCCD34"
                        : "transparent",
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 12,
                        color: selectedSources.includes(source)
                          ? "#FFF"
                          : "#555",
                      }}
                    >
                      {source}
                    </Text>
                  </TouchableOpacity>
                )
              )}
            </View>
          </ScrollView>

          {/* APPLY BUTTON */}
          <View style={{ padding: 20 }}>
            <TouchableOpacity
              onPress={() => setFilterVisible(false)}
              style={{
                backgroundColor: "#FCCD34",
                borderRadius: 25,
                height: 48,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text style={{ fontFamily: FONT.SemiBold, fontSize: 16 }}>
                Apply filters ({getActiveFiltersCount()})
              </Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>

      {/* RECEIPT MODAL */}
      <Modal visible={receiptVisible} animationType="slide">
        <SafeAreaView className="flex-1 bg-black">
          <StatusBar barStyle="light-content" />

          {/* HEADER */}
          <View
            style={{
              height: 56,
              justifyContent: "center",
              alignItems: "center",
              position: "relative",
            }}
          >
            <TouchableOpacity
              onPress={() => setReceiptVisible(false)}
              style={{ position: "absolute", left: 20 }}
            >
              <ChevronLeft size={24} color="#FFF" />
            </TouchableOpacity>

            <Text style={{ color: "#FFF", fontFamily: FONT.SemiBold }}>
              Message Fee History
            </Text>
          </View>

          {/* BODY */}
          <View
            style={{
              flex: 1,
              justifyContent: "space-between",
              padding: 24,
            }}
          >
            <View style={{ alignItems: "center" }}>
              <Image
                source={require("../../../assets/images/Check.png")}
                style={{ width: 50, height: 50 }}
              />

              <Text
                style={{
                  fontSize: 20,
                  fontFamily: FONT.SemiBold,
                  color: "#FFF",
                  marginTop: 10,
                }}
              >
                {selectedTransaction?.amount}
              </Text>

              <Text
                style={{
                  fontSize: 12,
                  color: "#FCCD34",
                  marginTop: 4,
                }}
              >
                Income successfully recorded
              </Text>
            </View>

            {/* DETAILS */}
            <View style={{ gap: 12 }}>
              {/* Transaction details */}
              <Text
                style={{
                  color: "#FFF",
                  fontFamily: FONT.SemiBold,
                  marginBottom: 4,
                }}
              >
                Transaction details
              </Text>

              <View
                style={{
                  backgroundColor: "#19191B",
                  padding: 12,
                  borderRadius: 12,
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    paddingVertical: 6,
                    borderBottomWidth: 1,
                    borderBottomColor: "#2C2C2E",
                  }}
                >
                  <Text style={{ color: "#6F6F70" }}>Transaction type:</Text>
                  <Text style={{ color: "#FFF" }}>
                    {selectedTransaction?.type}
                  </Text>
                </View>

                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    paddingVertical: 6,
                  }}
                >
                  <Text style={{ color: "#6F6F70" }}>Received from:</Text>
                  <Text style={{ color: "#FFF" }}>
                    {selectedTransaction?.from}
                  </Text>
                </View>
              </View>

              {/* Income breakdown */}
              <Text
                style={{
                  color: "#FFF",
                  fontFamily: FONT.SemiBold,
                }}
              >
                Income breakdown
              </Text>

              <View
                style={{
                  backgroundColor: "#1C1C1E",
                  padding: 12,
                  borderRadius: 12,
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    borderBottomWidth: 1,
                    borderBottomColor: "#2C2C2E",
                    paddingVertical: 6,
                  }}
                >
                  <Text style={{ color: "#6F6F70" }}>
                    Gross amount charged
                  </Text>
                  <Text style={{ color: "#FFF" }}>
                    {selectedTransaction?.gross}
                  </Text>
                </View>

                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    paddingVertical: 6,
                  }}
                >
                  <Text style={{ color: "#6F6F70" }}>
                    Platform fee (10%)
                  </Text>
                  <Text style={{ color: "#FFF" }}>
                    {selectedTransaction?.fee}
                  </Text>
                </View>
              </View>

              {/* Info */}
              <Text
                style={{
                  color: "#FFF",
                  fontFamily: FONT.SemiBold,
                }}
              >
                Transaction info
              </Text>

              <View
                style={{
                  backgroundColor: "#1C1C1E",
                  padding: 12,
                  borderRadius: 12,
                }}
              >
                {/* Date */}
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    borderBottomWidth: 1,
                    borderBottomColor: "#2C2C2E",
                    paddingVertical: 6,
                  }}
                >
                  <Text style={{ color: "#6F6F70" }}>Date/Time:</Text>
                  <Text style={{ color: "#FFF" }}>
                    {selectedTransaction?.date}
                  </Text>
                </View>

                {/* Transaction ID */}
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    paddingVertical: 6,
                    alignItems: "center",
                  }}
                >
                  <Text style={{ color: "#6F6F70" }}>Transaction ID:</Text>

                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Text style={{ color: "#FFF", marginRight: 6 }}>
                      {selectedTransaction?.transactionId}
                    </Text>
                    <Copy size={16} color="#FCCD34" />
                  </View>
                </View>
              </View>
            </View>

            {/* Bottom Buttons */}
            <View>
              <TouchableOpacity
                style={{
                  backgroundColor: "#FCCD34",
                  height: 46,
                  borderRadius: 12,
                  justifyContent: "center",
                  alignItems: "center",
                  marginBottom: 10,
                }}
              >
                <Text
                  style={{
                    fontSize: 15,
                    color: "#000",
                    fontFamily: FONT.SemiBold,
                  }}
                >
                  Share receipt
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={{
                  borderWidth: 1,
                  borderColor: "#FFF",
                  height: 46,
                  borderRadius: 12,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    fontSize: 15,
                    color: "#FFF",
                    fontFamily: FONT.SemiBold,
                  }}
                >
                  Get support
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
};

export default EarningsDashboard;
