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
import { styled } from "nativewind";
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

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity);
const StyledSafeAreaView = styled(SafeAreaView);
const StyledScrollView = styled(ScrollView);

const FONT = {
  Regular: "Poppins_400Regular",
  Medium: "Poppins_500Medium",
  SemiBold: "Poppins_600SemiBold",
  Bold: "Poppins_700Bold",
};

const CallHistoryScreen = () => {
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  const [filterVisible, setFilterVisible] = useState(false);
  const [receiptVisible, setReceiptVisible] = useState(false);
  const [selectedCall, setSelectedCall] = useState<any>(null);

  // Filter states
  const [fromDate, setFromDate] = useState("09-10-2025");
  const [toDate, setToDate] = useState("09-11-2025");
  const [selectedPeriod, setSelectedPeriod] = useState("This Month");
  const [selectedCallType, setSelectedCallType] = useState<string[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string[]>([]);

  const calls = [
    {
      id: 1,
      recipient: "Bam Mar...",
      date: "1 May, 2025 08:22",
      amount: "-0.05 GEL",
      status: "successful",
      feeType: "Audio Call",
      duration: "5 min/ 30 sec",
      rateApplied: "0.25 GEL/Min",
      paidFrom: "In-App Balance",
      transactionId: "A1B2C4R4HD7",
      totalAmount: "-1.25 GEL",
    },
    {
      id: 2,
      recipient: "Bam Mar...",
      date: "1 May, 2025 08:22",
      amount: "-0.05 GEL",
      status: "successful",
      feeType: "Audio Call",
      duration: "5 min/ 30 sec",
      rateApplied: "0.25 GEL/Min",
      paidFrom: "In-App Balance",
      transactionId: "A1B2C4R4HD8",
      totalAmount: "-1.25 GEL",
    },
    {
      id: 3,
      recipient: "Bam Mar...",
      date: "1 May, 2025 08:22",
      amount: "-0.05 GEL",
      status: "successful",
      feeType: "Audio Call",
      duration: "5 min/ 30 sec",
      rateApplied: "0.25 GEL/Min",
      paidFrom: "In-App Balance",
      transactionId: "A1B2C4R4HD9",
      totalAmount: "-1.25 GEL",
    },
    {
      id: 4,
      recipient: "Bam Mar...",
      date: "1 May, 2025 08:22",
      amount: "-0.05 GEL",
      status: "failed",
      feeType: "Audio Call",
      duration: "5 min/ 30 sec",
      rateApplied: "0.25 GEL/Min",
      paidFrom: "In-App Balance",
      transactionId: "A1B2C4R4HD10",
      totalAmount: "-1.25 GEL",
    },
  ];

  if (!fontsLoaded) {
    return (
      <View className="flex-1 items-center justify-center bg-black">
        <ActivityIndicator color="#FCCD34" />
      </View>
    );
  }

  const toggleCallType = (type: string) => {
    if (selectedCallType.includes(type)) {
      setSelectedCallType(selectedCallType.filter((t) => t !== type));
    } else {
      setSelectedCallType([...selectedCallType, type]);
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
    if (selectedCallType.length > 0) count += selectedCallType.length;
    if (selectedStatus.length > 0) count += selectedStatus.length;
    return count;
  };

  const CallItem = ({ call }: any) => (
    <StyledTouchableOpacity
      onPress={() => {
        setSelectedCall(call);
        setReceiptVisible(true);
      }}
      style={{
        backgroundColor: "black",
        borderRadius: 12,
        padding: 5,
        marginBottom: 12,
        flexDirection: "row",
        alignItems: "center",
      }}
    >
      <StyledView
        style={{
          marginRight: 12,
          width: 40,
          height: 40,
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
            call.status === "successful"
              ? require("../../../assets/images/profile/check-deposit-history.png")
              : require("../../../assets/images/profile/cross-deposit-history.png")
          }
          style={{ width: 28, height: 28 }}
          resizeMode="contain"
        />
      </StyledView>

      <StyledView style={{ flex: 1 }}>
        <StyledText
          className="text-white"
          style={{
            fontSize: 16,
            fontFamily: FONT.SemiBold,
            marginBottom: 4,
          }}
        >
          Call with ({call.recipient})
        </StyledText>
        <StyledText
          className="text-gray-400"
          style={{
            fontSize: 13,
            fontFamily: FONT.Regular,
          }}
        >
          {call.date}
        </StyledText>
      </StyledView>

      <StyledText
        style={{
          fontSize: 16,
          fontFamily: FONT.SemiBold,
          color: call.status === "successful" ? "#FCCD34" : "#FF736F",
        }}
      >
        {call.amount}
      </StyledText>
    </StyledTouchableOpacity>
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
          <ChevronLeft size={24} color="#FFFFFF" strokeWidth={2} />
        </StyledTouchableOpacity>
        <StyledText
          className="text-white"
          style={{
            fontSize: 18,
            fontFamily: FONT.SemiBold,
          }}
        >
          Call History
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
          <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <Path
              d="M3 7H21M6 12H18M9 17H15"
              stroke="#FFFFFF"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </Svg>
        </StyledTouchableOpacity>
      </StyledView>

      {/* Calls List */}
      <StyledScrollView
        style={{
          flex: 1,
          paddingHorizontal: 20,
          marginTop: 20,
        }}
      >
        {calls.map((call) => (
          <CallItem key={call.id} call={call} />
        ))}
      </StyledScrollView>

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
                fontSize: 20,
                fontFamily: FONT.SemiBold,
              }}
            >
              Filter
            </StyledText>
            <StyledTouchableOpacity
              onPress={() => {
                setSelectedPeriod("");
                setSelectedCallType([]);
                setSelectedStatus([]);
              }}
              style={{
                position: "absolute",
                right: 20,
              }}
            >
              <StyledText
                style={{
                  color: "#FCCD34",
                  fontSize: 16,
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
              className="text-gray-400"
              style={{
                fontSize: 14,
                fontFamily: FONT.Medium,
                marginTop: 20,
                marginBottom: 12,
              }}
            >
              Date Range
            </StyledText>

            <StyledView
              style={{ flexDirection: "row", gap: 12, marginBottom: 16 }}
            >
              <StyledView style={{ flex: 1 }}>
                <StyledText
                  className="text-gray-400"
                  style={{
                    fontSize: 13,
                    fontFamily: FONT.Regular,
                    marginBottom: 8,
                  }}
                >
                  From
                </StyledText>
                <StyledView
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
                  <StyledText
                    className="text-white"
                    style={{
                      fontSize: 14,
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
                    backgroundColor: "#1C1C1E",
                    borderRadius: 12,
                    height: 50,
                    paddingHorizontal: 16,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <StyledText
                    className="text-gray-400"
                    style={{
                      fontSize: 14,
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
                  <StyledText
                    style={{
                      color: selectedPeriod === period ? "#FCCD34" : "#555E67",
                      fontSize: 14,
                      fontFamily: FONT.Regular,
                    }}
                  >
                    {period}
                  </StyledText>
                </StyledTouchableOpacity>
              ))}
            </StyledView>

            {/* Call Type */}
            <StyledText
              className="text-gray-400"
              style={{
                fontSize: 14,
                fontFamily: FONT.Medium,
                marginBottom: 12,
              }}
            >
              Call Type
            </StyledText>
            <StyledView
              style={{ flexDirection: "row", gap: 12, marginBottom: 24 }}
            >
              {["Audio Call", "Video Call"].map((type) => (
                <StyledTouchableOpacity
                  key={type}
                  onPress={() => toggleCallType(type)}
                  style={{
                    flex: 1,
                    backgroundColor: "#19191B",
                    borderRadius: 12,
                    height: 48,
                    paddingVertical: 12,
                    alignItems: "center",
                    borderWidth: 1,
                    borderColor: selectedCallType.includes(type)
                      ? "#FCCD34"
                      : "transparent",
                  }}
                >
                  <StyledText
                    style={{
                      color: selectedCallType.includes(type)
                        ? "#FCCD34"
                        : "#555E67",
                      fontSize: 14,
                      fontFamily: FONT.Regular,
                    }}
                  >
                    {type}
                  </StyledText>
                </StyledTouchableOpacity>
              ))}
            </StyledView>

            {/* Payment Status */}
            <StyledText
              className="text-gray-400"
              style={{
                fontSize: 14,
                fontFamily: FONT.Medium,
                marginBottom: 12,
              }}
            >
              Payment Status
            </StyledText>
            <StyledView
              style={{ flexDirection: "row", gap: 12, marginBottom: 32 }}
            >
              {["Successfull", "Failed"].map((status) => (
                <StyledTouchableOpacity
                  key={status}
                  onPress={() => toggleStatus(status)}
                  style={{
                    flex: 1,
                    backgroundColor: "#19191B",
                    borderRadius: 12,
                    height: 48,
                    paddingVertical: 12,
                    alignItems: "center",
                    borderWidth: 1,
                    borderColor: selectedStatus.includes(status)
                      ? "#FCCD34"
                      : "transparent",
                  }}
                >
                  <StyledText
                    style={{
                      color: selectedStatus.includes(status)
                        ? "#FCCD34"
                        : "#555E67",
                      fontSize: 14,
                      fontFamily: FONT.Regular,
                    }}
                  >
                    {status}
                  </StyledText>
                </StyledTouchableOpacity>
              ))}
            </StyledView>
          </StyledScrollView>

          {/* Apply Button */}
          <StyledView
            style={{ paddingHorizontal: 20, paddingBottom: 34, paddingTop: 20 }}
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
                Apply Filters({getActiveFiltersCount()})
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

          {/* Receipt Header */}
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
              onPress={() => setReceiptVisible(false)}
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
                fontSize: 18,
                fontFamily: FONT.SemiBold,
              }}
            >
              Call Receipt
            </StyledText>
          </StyledView>

          <StyledScrollView style={{ flex: 1, paddingHorizontal: 20 }}>
            {/* Success Icon */}
            <StyledView
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
            </StyledView>

            {/* Amount */}
            <StyledText
              className="text-white text-center"
              style={{
                fontSize: 24,
                fontFamily: FONT.Bold,
                marginBottom: 8,
              }}
            >
              {selectedCall?.totalAmount}
            </StyledText>
            <StyledText
              className="text-center"
              style={{
                fontSize: 14,
                fontFamily: FONT.Regular,
                color: "#FCCD34",
                marginBottom: 32,
              }}
            >
              Payment Successfully
            </StyledText>

            {/* Service Details */}
            <StyledText
              className="text-white"
              style={{
                fontSize: 14,
                fontFamily: FONT.SemiBold,
                marginBottom: 16,
              }}
            >
              Service Details
            </StyledText>

            <StyledView
              style={{
                backgroundColor: "#1C1C1E",
                borderRadius: 12,
                padding: 16,
                marginBottom: 24,
              }}
            >
              <StyledView
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  paddingVertical: 12,
                  borderBottomWidth: 1,
                  borderBottomColor: "#2C2C2E",
                }}
              >
                <StyledText
                  className="text-[#6F6F70]"
                  style={{
                    fontSize: 14,
                    fontFamily: FONT.Regular,
                  }}
                >
                  Recipient of Payment:
                </StyledText>
                <StyledText
                  className="text-white"
                  style={{
                    fontSize: 14,
                    fontFamily: FONT.Medium,
                  }}
                >
                  Bam Margera
                </StyledText>
              </StyledView>

              <StyledView
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  paddingVertical: 12,
                  borderBottomWidth: 1,
                  borderBottomColor: "#2C2C2E",
                }}
              >
                <StyledText
                  style={{
                    fontSize: 14,
                    fontFamily: FONT.Regular,
                    color: "#6F6F70",
                  }}
                >
                  Fee Type:
                </StyledText>
                <StyledText
                  className="text-white"
                  style={{
                    fontSize: 14,
                    fontFamily: FONT.Medium,
                  }}
                >
                  {selectedCall?.feeType}
                </StyledText>
              </StyledView>

              <StyledView
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  paddingVertical: 12,
                  borderBottomWidth: 1,
                  borderBottomColor: "#2C2C2E",
                }}
              >
                <StyledText
                  style={{
                    fontSize: 14,
                    fontFamily: FONT.Regular,
                    color: "#6F6F70",
                  }}
                >
                  Call duration:
                </StyledText>
                <StyledText
                  className="text-white"
                  style={{
                    fontSize: 14,
                    fontFamily: FONT.Medium,
                  }}
                >
                  {selectedCall?.duration}
                </StyledText>
              </StyledView>

              <StyledView
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  paddingVertical: 12,
                }}
              >
                <StyledText
                  style={{
                    fontSize: 14,
                    fontFamily: FONT.Regular,
                    color: "#6F6F70",
                  }}
                >
                  Rate Applied:
                </StyledText>
                <StyledText
                  className="text-white"
                  style={{
                    fontSize: 14,
                    fontFamily: FONT.Medium,
                  }}
                >
                  {selectedCall?.rateApplied}
                </StyledText>
              </StyledView>
            </StyledView>

            {/* Transaction Info */}
            <StyledText
              className="text-white"
              style={{
                fontSize: 16,
                fontFamily: FONT.SemiBold,
                marginBottom: 16,
              }}
            >
              Transaction Info
            </StyledText>

            <StyledView
              style={{
                backgroundColor: "#1C1C1E",
                borderRadius: 12,
                padding: 16,
                marginBottom: 32,
              }}
            >
              <StyledView
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  paddingVertical: 12,
                  borderBottomWidth: 1,
                  borderBottomColor: "#2C2C2E",
                }}
              >
                <StyledText
                  style={{
                    fontSize: 14,
                    fontFamily: FONT.Regular,
                    color: "#6F6F70",
                  }}
                >
                  Paid From:
                </StyledText>
                <StyledText
                  className="text-white"
                  style={{
                    fontSize: 14,
                    fontFamily: FONT.Medium,
                  }}
                >
                  {selectedCall?.paidFrom}
                </StyledText>
              </StyledView>

              <StyledView
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  paddingVertical: 12,
                  borderBottomWidth: 1,
                  borderBottomColor: "#2C2C2E",
                }}
              >
                <StyledText
                  style={{
                    fontSize: 14,
                    fontFamily: FONT.Regular,
                    color: "#6F6F70",
                  }}
                >
                  Date/Time:
                </StyledText>
                <StyledText
                  className="text-white"
                  style={{
                    fontSize: 14,
                    fontFamily: FONT.Medium,
                  }}
                >
                  {selectedCall?.date}
                </StyledText>
              </StyledView>

              <StyledView
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  paddingVertical: 12,
                }}
              >
                <StyledText
                  style={{
                    fontSize: 14,
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
                    className="text-white"
                    style={{
                      fontSize: 14,
                      fontFamily: FONT.Medium,
                      marginRight: 8,
                    }}
                  >
                    {selectedCall?.transactionId}
                  </StyledText>
                  <Copy size={16} color="#FCCD34" />
                </StyledView>
              </StyledView>
            </StyledView>
          </StyledScrollView>

          {/* Action Buttons */}
          <StyledView style={{ paddingHorizontal: 20, paddingBottom: 20 }}>
            <StyledTouchableOpacity
              style={{
                backgroundColor: "#FCCD34",
                borderRadius: 12,
                height: 48,
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 12,
              }}
            >
              <StyledText
                className="text-black"
                style={{
                  fontSize: 16,
                  fontFamily: FONT.SemiBold,
                }}
              >
                Share Receipt
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
            >
              <StyledText
                className="text-white"
                style={{
                  fontSize: 16,
                  fontFamily: FONT.SemiBold,
                }}
              >
                Get Support
              </StyledText>
            </StyledTouchableOpacity>
          </StyledView>
        </StyledSafeAreaView>
      </Modal>
    </StyledSafeAreaView>
  );
};

export default CallHistoryScreen;
