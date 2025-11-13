import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  ScrollView,
  Modal,
  Image,
} from "react-native";
import { ChevronLeft, Calendar, Copy } from "lucide-react-native";
import { Svg, Circle, Path } from "react-native-svg";
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

const DepositHistoryScreen = () => {
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  const [filterVisible, setFilterVisible] = useState(false);
  const [receiptVisible, setReceiptVisible] = useState(false);
  const [selectedDeposit, setSelectedDeposit] = useState<any>(null);

  const [fromDate, setFromDate] = useState("09-10-2025");
  const [toDate, setToDate] = useState("09-11-2025");
  const [selectedPeriod, setSelectedPeriod] = useState("This Month");
  const [selectedSource, setSelectedSource] = useState<string[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string[]>([]);

  const deposits = [
    {
      id: 1,
      method: "Apple Pay",
      date: "1 May, 2025 08:22",
      amount: "5 GEL",
      status: "approved",
      transactionId: "A1B2C4R4HD7",
      processingFee: "0.10 GEL",
      type: "Balance Top-Up",
    },
    {
      id: 2,
      method: "Visa **** 9012",
      date: "1 May, 2025 08:22",
      amount: "5 GEL",
      status: "failed",
      transactionId: "A1B2C4R4HD8",
      processingFee: "0.10 GEL",
      type: "Balance Top-Up",
    },
    {
      id: 3,
      method: "Mastercard **** 9012",
      date: "1 May, 2025 08:22",
      amount: "5 GEL",
      status: "failed",
      transactionId: "A1B2C4R4HD9",
      processingFee: "0.10 GEL",
      type: "Balance Top-Up",
    },
  ];

  if (!fontsLoaded) {
    return (
      <View className="flex-1 items-center justify-center bg-black">
        <ActivityIndicator color="#FCCD34" />
      </View>
    );
  }

  const toggleSource = (source: string) => {
    if (selectedSource.includes(source)) {
      setSelectedSource(selectedSource.filter((s) => s !== source));
    } else {
      setSelectedSource([...selectedSource, source]);
    }
  };

  const toggleStatus = (status: string) => {
    if (selectedStatus.includes(status)) {
      setSelectedStatus(selectedStatus.filter((s) => s !== status));
    } else {
      setSelectedStatus([...selectedStatus, status]);
    }
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (selectedPeriod !== "") count++;
    if (selectedSource.length > 0) count += selectedSource.length;
    if (selectedStatus.length > 0) count += selectedStatus.length;
    return count;
  };

  const DepositItem = ({ deposit }: any) => (
    <TouchableOpacity
      onPress={() => {
        setSelectedDeposit(deposit);
        setReceiptVisible(true);
      }}
      style={{
        backgroundColor: "black",
        borderRadius: 12,
        padding: 10,
        marginBottom: 12,
        flexDirection: "row",
        alignItems: "center",
      }}
    >
      <View
        style={{
          marginRight: 12,
          width: 46.153846740722656,
          height: 46.153846740722656,
          borderRadius: 7.69,
          backgroundColor: "#19191B",
          alignItems: "center",
          justifyContent: "center",
          opacity: 1,
          transform: [{ rotate: "0deg" }],
        }}
      >
        <Image
          source={
            deposit.status === "approved"
              ? require("../../../assets/images/profile/check-deposit-history.png")
              : require("../../../assets/images/profile/cross-deposit-history.png")
          }
          style={{ width: 28, height: 28 }}
          resizeMode="contain"
        />
      </View>

      <View style={{ flex: 1 }}>
        <Text
          className="text-white"
          style={{
            fontSize: 15,
            fontFamily: FONT.Medium,
            marginBottom: 4,
          }}
        >
          {deposit.method}
        </Text>
        <Text
          className="text-gray-400"
          style={{
            fontSize: 12,
            fontFamily: FONT.Regular,
          }}
        >
          {deposit.date}
        </Text>
      </View>
      <Text
        style={{
          fontSize: 15,
          fontFamily: FONT.SemiBold,
          color: deposit.status === "approved" ? "#FCCD34" : "#FF736F",
        }}
      >
        {deposit.amount}
      </Text>
    </TouchableOpacity>
  );

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
          Deposit History
        </Text>
        <TouchableOpacity
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
          <Image
            source={require("../../../assets/images/filter-icon.png")}
            style={{ width: 24, height: 24 }}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>

      {/* Deposits List */}
      <ScrollView
        style={{
          flex: 1,
          paddingHorizontal: 20,
          marginTop: 20,
        }}
      >
        {deposits.map((deposit) => (
          <DepositItem key={deposit.id} deposit={deposit} />
        ))}
      </ScrollView>

      {/* Filter Modal */}
      <Modal
        animationType="slide"
        transparent={false}
        visible={filterVisible}
        onRequestClose={() => setFilterVisible(false)}
      >
        <SafeAreaView className="flex-1 bg-black">
          <StatusBar barStyle="light-content" />

          {/* Filter Header */}
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
              onPress={() => setFilterVisible(false)}
              style={{
                position: "absolute",
                left: 20,
              }}
            >
              <ChevronLeft size={28} color="#FFFFFF" strokeWidth={2} />
            </TouchableOpacity>
            <Text
              className="text-white"
              style={{
                fontSize: 20,
                fontFamily: FONT.SemiBold,
              }}
            >
              Filter
            </Text>
            <TouchableOpacity
              onPress={() => {
                setSelectedPeriod("");
                setSelectedSource([]);
                setSelectedStatus([]);
              }}
              style={{
                position: "absolute",
                right: 20,
              }}
            >
              <Text
                style={{
                  color: "#FCCD34",
                  fontSize: 16,
                  fontFamily: FONT.Medium,
                }}
              >
                Reset
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={{ flex: 1, paddingHorizontal: 20 }}>
            {/* Date Range */}
            <Text
              className="text-gray-400"
              style={{
                fontSize: 14,
                fontFamily: FONT.Medium,
                marginTop: 20,
                marginBottom: 12,
              }}
            >
              Date Range
            </Text>

            <View
              style={{ flexDirection: "row", gap: 12, marginBottom: 16 }}
            >
              <View style={{ flex: 1 }}>
                <Text
                  className="text-gray-400"
                  style={{
                    fontSize: 13,
                    fontFamily: FONT.Regular,
                    marginBottom: 8,
                  }}
                >
                  From
                </Text>
                <View
                  style={{
                    backgroundColor: "#1C1C1E",
                    borderRadius: 12,
                    borderWidth: 1,
                    borderColor: "#FCCD34",
                    height: 50,
                    paddingHorizontal: 16,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Text
                    className="text-white"
                    style={{
                      fontSize: 14,
                      fontFamily: FONT.Regular,
                    }}
                  >
                    {fromDate}
                  </Text>
                  <Calendar size={20} color="#555E67" />
                </View>
              </View>

              <View style={{ flex: 1 }}>
                <Text
                  className="text-gray-400"
                  style={{
                    fontSize: 13,
                    fontFamily: FONT.Regular,
                    marginBottom: 8,
                  }}
                >
                  To
                </Text>
                <View
                  style={{
                    backgroundColor: "#1C1C1E",
                    borderRadius: 12,
                    height: 50,
                    paddingHorizontal: 16,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Text
                    className="text-gray-400"
                    style={{
                      fontSize: 14,
                      fontFamily: FONT.Regular,
                    }}
                  >
                    {toDate}
                  </Text>
                  <Calendar size={20} color="#555E67" />
                </View>
              </View>
            </View>

            {/* Period Buttons */}
            <View
              style={{ flexDirection: "row", gap: 12, marginBottom: 24 }}
            >
              {["Today", "This Week", "This Month"].map((period) => (
                <TouchableOpacity
                  key={period}
                  onPress={() => setSelectedPeriod(period)}
                  style={{
                    backgroundColor: "#1C1C1E",
                    borderRadius: 20,
                    paddingHorizontal: 20,
                    paddingVertical: 10,
                    borderWidth: 1,
                    borderColor:
                      selectedPeriod === period ? "#FCCD34" : "transparent",
                  }}
                >
                  <Text
                    style={{
                      color: selectedPeriod === period ? "#FCCD34" : "#555E67",
                      fontSize: 14,
                      fontFamily: FONT.Regular,
                    }}
                  >
                    {period}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Payment Source */}
            <Text
              className="text-gray-400"
              style={{
                fontSize: 14,
                fontFamily: FONT.Medium,
                marginBottom: 12,
              }}
            >
              Payment source
            </Text>
            <View
              style={{ flexDirection: "row", gap: 12, marginBottom: 24 }}
            >
              {["Apple Pay", "Card"].map((source) => (
                <TouchableOpacity
                  key={source}
                  onPress={() => toggleSource(source)}
                  style={{
                    flex: 1,
                    backgroundColor: "#19191B",
                    borderRadius: 12,
                    paddingVertical: 16,
                    alignItems: "center",
                    borderWidth: 1,
                    borderColor: selectedSource.includes(source)
                      ? "#FCCD34"
                      : "transparent",
                  }}
                >
                  <Text
                    style={{
                      color: selectedSource.includes(source)
                        ? "#FCCD34"
                        : "#555E67",
                      fontSize: 14,
                      fontFamily: FONT.Regular,
                    }}
                  >
                    {source}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Payment Status */}
            <Text
              className="text-gray-400"
              style={{
                fontSize: 14,
                fontFamily: FONT.Medium,
                marginBottom: 12,
              }}
            >
              Payment Status
            </Text>
            <View
              style={{ flexDirection: "row", gap: 12, marginBottom: 32 }}
            >
              {["Approved", "Failed"].map((status) => (
                <TouchableOpacity
                  key={status}
                  onPress={() => toggleStatus(status)}
                  style={{
                    flex: 1,
                    backgroundColor: "#19191B",
                    borderRadius: 12,
                    paddingVertical: 16,
                    alignItems: "center",
                    borderWidth: 1,
                    borderColor: selectedStatus.includes(status)
                      ? "#FCCD34"
                      : "transparent",
                  }}
                >
                  <Text
                    style={{
                      color: selectedStatus.includes(status)
                        ? "#FCCD34"
                        : "#555E67",
                      fontSize: 14,
                      fontFamily: FONT.Regular,
                    }}
                  >
                    {status}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>

          {/* Apply Button */}
          <View
            style={{ paddingHorizontal: 20, paddingBottom: 34, paddingTop: 20 }}
          >
            <TouchableOpacity
              onPress={() => setFilterVisible(false)}
              style={{
                backgroundColor: "#FCCD34",
                borderRadius: 25,
                height: 48,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text
                className="text-black"
                style={{
                  fontSize: 17,
                  fontFamily: FONT.SemiBold,
                }}
              >
                Apply Filters({getActiveFiltersCount()})
              </Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>

      {/* Receipt Modal */}
      <Modal
        animationType="slide"
        transparent={false}
        visible={receiptVisible}
        onRequestClose={() => setReceiptVisible(false)}
      >
        <SafeAreaView className="flex-1 bg-black">
          <StatusBar barStyle="light-content" />

          {/* Receipt Header */}
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
              onPress={() => setReceiptVisible(false)}
              style={{
                position: "absolute",
                left: 20,
              }}
            >
              <ChevronLeft size={28} color="#FFFFFF" strokeWidth={2} />
            </TouchableOpacity>
            <Text
              className="text-white"
              style={{
                fontSize: 18,
                fontFamily: FONT.SemiBold,
              }}
            >
              Deposit Receipt
            </Text>
          </View>

          <ScrollView style={{ flex: 1, paddingHorizontal: 20 }}>
            {/* Success Icon */}
            <View
              style={{ alignItems: "center", marginTop: 32, marginBottom: 24 }}
            >
              <Svg width="45" height="45" viewBox="0 0 80 80" fill="none">
                <Circle
                  cx="40"
                  cy="40"
                  r="38"
                  stroke="#FCCD34"
                  strokeWidth="3"
                  fill="transparent"
                />
                <Path
                  d="M25 40L35 50L55 30"
                  stroke="#FCCD34"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </Svg>
            </View>

            {/* Amount */}
            <Text
              className="text-white text-center"
              style={{
                fontSize: 24,
                fontFamily: FONT.Bold,
                marginBottom: 8,
              }}
            >
              {selectedDeposit?.amount.replace(" GEL", ".00 GEL")}
            </Text>
            <Text
              className="text-center"
              style={{
                fontSize: 12,
                fontFamily: FONT.Regular,
                color: "#FCCD34",
                marginBottom: 32,
              }}
            >
              Successfully Added to Balance
            </Text>

            {/* Payment Details */}
            <Text
              className="text-white"
              style={{
                fontSize: 14,
                fontFamily: FONT.SemiBold,
                marginBottom: 16,
              }}
            >
              Payment Details
            </Text>

            <View
              style={{
                backgroundColor: "#1C1C1E",
                borderRadius: 12,
                padding: 16,
                marginBottom: 24,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  paddingVertical: 12,
                  borderBottomWidth: 1,
                  borderBottomColor: "#2C2C2E",
                }}
              >
                <Text
                  className="text-[#6F6F70]"
                  style={{
                    fontSize: 14,
                    fontFamily: FONT.Regular,
                  }}
                >
                  Paid From:
                </Text>
                <Text
                  className="text-white"
                  style={{
                    fontSize: 14,
                    fontFamily: FONT.Medium,
                  }}
                >
                  {selectedDeposit?.method}
                </Text>
              </View>

              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  paddingVertical: 12,
                  borderBottomWidth: 1,
                  borderBottomColor: "#2C2C2E",
                }}
              >
                <Text
                  className="text-[#6F6F70]"
                  style={{
                    fontSize: 14,
                    fontFamily: FONT.Regular,
                  }}
                >
                  Date/Time:
                </Text>
                <Text
                  className="text-white"
                  style={{
                    fontSize: 14,
                    fontFamily: FONT.Medium,
                  }}
                >
                  {selectedDeposit?.date}
                </Text>
              </View>

              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  paddingVertical: 12,
                }}
                >
                <Text
                  className="text-[#6F6F70]"
                  style={{
                    fontSize: 14,
                    fontFamily: FONT.Regular,
                  }}
                >
                  Transaction Type:
                </Text>
                <Text
                  className="text-white"
                  style={{
                    fontSize: 14,
                    fontFamily: FONT.Medium,
                  }}
                >
                  {selectedDeposit?.type}
                </Text>
              </View>
            </View>

            {/* System Reference */}
            <Text
              className="text-white"
              style={{
                fontSize: 16,
                fontFamily: FONT.SemiBold,
                marginBottom: 16,
              }}
            >
              System Reference
            </Text>

            <View
              style={{
                backgroundColor: "#1C1C1E",
                borderRadius: 12,
                padding: 16,
                marginBottom: 32,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  paddingVertical: 12,
                  borderBottomWidth: 1,
                  borderBottomColor: "#2C2C2E",
                }}
              >
                <Text
                  className="text-[#6F6F70]"
                  style={{
                    fontSize: 14,
                    fontFamily: FONT.Regular,
                  }}
                >
                  Transaction ID:
                </Text>
                <View
                  style={{ flexDirection: "row", alignItems: "center" }}
                >
                  <Text
                    className="text-white"
                    style={{
                      fontSize: 14,
                      fontFamily: FONT.Medium,
                      marginRight: 8,
                    }}
                  >
                    {selectedDeposit?.transactionId}
                  </Text>
                  <Copy size={16} color="#FCCD34" />
                </View>
              </View>

              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  paddingVertical: 12,
                }}
              >
                <Text
                  className="text-[#6F6F70]"
                  style={{
                    fontSize: 14,
                    fontFamily: FONT.Regular,
                  }}
                >
                  Processing fee:
                </Text>
                <Text
                  className="text-white"
                  style={{
                    fontSize: 14,
                    fontFamily: FONT.Medium,
                  }}
                >
                  {selectedDeposit?.processingFee}
                </Text>
              </View>
            </View>
          </ScrollView>

          {/* Action Buttons */}
          <View style={{ paddingHorizontal: 20, paddingBottom: 20 }}>
            <TouchableOpacity
              style={{
                backgroundColor: "#FCCD34",
                borderRadius: 12,
                height: 48,
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 12,
              }}
            >
              <Text
                className="text-black"
                style={{
                  fontSize: 16,
                  fontFamily: FONT.SemiBold,
                }}
              >
                View Balance History
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                backgroundColor: "transparent",
                borderRadius: 12,
                borderWidth: 1,
                borderColor: "#FFFFFF",
                height: 48,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text
                className="text-white"
                style={{
                  fontSize: 16,
                  fontFamily: FONT.SemiBold,
                }}
              >
                Get Support
              </Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
};

export default DepositHistoryScreen;