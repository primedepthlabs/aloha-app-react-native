import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  ScrollView,
  TextInput,
  Modal,
  Image,
  Dimensions,
  Platform,
} from "react-native";
import { ChevronLeft, Copy } from "lucide-react-native";
import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
} from "@expo-google-fonts/poppins";
import { router } from "expo-router";

const SCREEN_WIDTH = Dimensions.get("window").width;

const FONT = {
  Regular: "Poppins_400Regular",
  Medium: "Poppins_500Medium",
  SemiBold: "Poppins_600SemiBold",
  Bold: "Poppins_700Bold",
};

const BUTTON_HORIZONTAL_PADDING = 24;

const Withdrawal = () => {
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  const [amount, setAmount] = useState("1250");
  const [verificationVisible, setVerificationVisible] = useState(false);
  const [historyVisible, setHistoryVisible] = useState(false);
  const [successToastVisible, setSuccessToastVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef<any[]>([]);

  const currentBalance = 1250;
  const withdrawalAmount = parseFloat(amount) || 0;
  const taxCommission = 0.5;
  const finalAmount = withdrawalAmount - taxCommission;

  if (!fontsLoaded) {
    return (
      <View className="flex-1 items-center justify-center bg-black">
        <ActivityIndicator color="#FCCD34" />
      </View>
    );
  }

  const handleCodeChange = (text: string, index: number) => {
    if (text.length > 1) {
      text = text[text.length - 1];
    }

    const newCode = [...code];
    newCode[index] = text;
    setCode(newCode);

    if (text && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const isCodeComplete = code.every((digit) => digit !== "");

  const handleSubmit = () => {
    if (isCodeComplete) {
      setIsSubmitting(true);
      setTimeout(() => {
        setIsSubmitting(false);
        setVerificationVisible(false);
        setSuccessToastVisible(true);
        setTimeout(() => {
          setSuccessToastVisible(false);
          setHistoryVisible(true);
        }, 2000);
      }, 1500);
    }
  };

  const handleWithdraw = () => {
    setVerificationVisible(true);
  };

  const historyRowStyle = {
    width: 332,
    height: 48,
    flexDirection: "row" as const,
    justifyContent: "space-between" as const,
    alignItems: "center" as const,
    paddingHorizontal: 12,
  };

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
          style={{
            fontSize: 15,
            fontFamily: FONT.SemiBold,
            color: "#FFFFFF",
          }}
        >
          Withdrawal
        </Text>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingHorizontal: 24,
          paddingTop: 20,
          paddingBottom: 160,
        }}
      >
        {/* Current Balance Card */}
        <View
          style={{
            backgroundColor: "#19191B",
            borderRadius: 16,
            padding: 20,
            marginBottom: 10,
          }}
        >
          <Text
            style={{
              fontSize: 12,
              fontFamily: FONT.Regular,
              color: "#FFFFFF",
              marginBottom: 4,
            }}
          >
            Current balance:
          </Text>
          <Text
            style={{
              fontSize: 20,
              fontFamily: FONT.SemiBold,
              color: "#FCCD34",
            }}
          >
            {currentBalance} GEL
          </Text>
        </View>

        {/* Amount to Withdraw */}
        <Text
          style={{
            fontSize: 18,
            fontFamily: FONT.Medium,
            color: "#FFFFFF",
            marginBottom: 12,
          }}
        >
          Amount to withdraw (GEL)
        </Text>

        <TextInput
          value={amount}
          onChangeText={setAmount}
          keyboardType="numeric"
          style={{
            backgroundColor: "#19191B",
            borderRadius: 12,
            height: 56,
            paddingHorizontal: 16,
            fontSize: 16,
            fontFamily: FONT.Regular,
            color: "#FFFFFFCC",
            marginBottom: 8,
          }}
          placeholderTextColor="#6F6F70"
        />

        <Text
          style={{
            fontSize: 12,
            fontFamily: FONT.Regular,
            color: "#FCCD34",
            marginBottom: 15,
          }}
        >
          Minimum withdrawal amount is 10 GEL
        </Text>

        {/* Payout Destination */}
        <Text
          style={{
            fontSize: 18,
            fontFamily: FONT.Medium,
            color: "#FFFFFF",
            marginBottom: 10,
          }}
        >
          Payout destination
        </Text>

        <TouchableOpacity
          style={{
            backgroundColor: "#19191B",
            borderRadius: 12,
            flexDirection: "row",
            alignItems: "center",
            padding: 16,
            marginBottom: 20,
          }}
        >
          <View
            style={{
              width: 38,
              height: 38,
              backgroundColor: "#2C5F7D",
              borderRadius: 12,
              alignItems: "center",
              justifyContent: "center",
              marginRight: 12,
            }}
          >
            <Image
              source={require("../../../assets/images/dashboard/bank.png")}
              style={{ width: 24, height: 24, tintColor: "#FFFFFF" }}
              resizeMode="contain"
            />
          </View>
          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontSize: 15,
                fontFamily: FONT.Regular,
                color: "#FFFFFF",
              }}
            >
              IBAN: GE**** 1234
            </Text>
          </View>
          <ChevronLeft
            size={20}
            color="#8E8E93"
            strokeWidth={2}
            style={{ transform: [{ rotate: "180deg" }] }}
          />
        </TouchableOpacity>

        {/* Withdrawal Summary */}
        <Text
          style={{
            fontSize: 16,
            fontFamily: FONT.SemiBold,
            color: "#FFFFFF",
            marginBottom: 10,
          }}
        >
          Withdrawal Summary
        </Text>

        <View
          style={{
            backgroundColor: "#19191B",
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
              style={{
                fontSize: 14,
                fontFamily: FONT.Regular,
                color: "#8E8E93",
              }}
            >
              Withdrawal amount:
            </Text>
            <Text
              style={{
                fontSize: 14,
                fontFamily: FONT.Medium,
                color: "#FFFFFF",
              }}
            >
              {withdrawalAmount.toFixed(2)} GEL
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
              style={{
                fontSize: 14,
                fontFamily: FONT.Regular,
                color: "#8E8E93",
              }}
            >
              TAX & Commission:
            </Text>
            <Text
              style={{
                fontSize: 14,
                fontFamily: FONT.Medium,
                color: "#FFFFFF",
              }}
            >
              -{taxCommission.toFixed(2)} GEL
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
              style={{
                fontSize: 14,
                fontFamily: FONT.Regular,
                color: "#8E8E93",
              }}
            >
              Final amount u'll receive:
            </Text>
            <Text
              style={{
                fontSize: 14,
                fontFamily: FONT.SemiBold,
                color: "#FFFFFF",
              }}
            >
              {finalAmount.toFixed(2)} GEL
            </Text>
          </View>
        </View>

        <Text
          style={{
            fontSize: 12,
            fontFamily: FONT.Regular,
            color: "#FCCD34",
            marginBottom: 5,
          }}
        >
          Transfers typically take 1-3 business days.
        </Text>
      </ScrollView>

      {/* Withdraw Button */}
      <View
        style={{
          position: "absolute",
          left: BUTTON_HORIZONTAL_PADDING,
          right: BUTTON_HORIZONTAL_PADDING,
          bottom: Platform.OS === "ios" ? 96 : 80,
          alignItems: "center",
          justifyContent: "center",
          zIndex: 9999,
        }}
        pointerEvents="box-none"
      >
        <TouchableOpacity
          onPress={handleWithdraw}
          disabled={withdrawalAmount < 10}
          style={{
            width: SCREEN_WIDTH - BUTTON_HORIZONTAL_PADDING * 2,
            backgroundColor: withdrawalAmount >= 10 ? "#FCCD34" : "#6F6F70",
            borderRadius: 15,
            height: 48,
            alignItems: "center",
            justifyContent: "center",
            opacity: withdrawalAmount >= 10 ? 1 : 0.5,
            ...Platform.select({
              ios: {
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 6 },
                shadowOpacity: 0.12,
                shadowRadius: 10,
              },
              android: { elevation: 8 },
            }),
          }}
        >
          <Text
            style={{
              fontSize: 18,
              fontFamily: FONT.SemiBold,
              color: "#000000",
            }}
          >
            Withdraw
          </Text>
        </TouchableOpacity>
      </View>

      {/* Success Toast */}
      {successToastVisible && (
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            backgroundColor: "#FCCD34",
            paddingVertical: 16,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text
            style={{
              fontSize: 16,
              fontFamily: FONT.SemiBold,
              color: "#000000",
            }}
          >
            Withdrawal successfully initiated!
          </Text>
        </View>
      )}

      {/* Security Verification Modal */}
      <Modal
        animationType="slide"
        transparent={false}
        visible={verificationVisible}
        onRequestClose={() => setVerificationVisible(false)}
      >
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
              onPress={() => setVerificationVisible(false)}
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
              style={{
                fontSize: 18,
                fontFamily: FONT.SemiBold,
                color: "#FFFFFF",
              }}
            >
              Security Verification
            </Text>
          </View>

          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{
              paddingHorizontal: 24,
              paddingTop: 40,
            }}
          >
            <Text
              style={{
                fontSize: 24,
                fontFamily: FONT.Bold,
                color: "#FFFFFF",
                marginBottom: 16,
                textAlign: "center",
              }}
            >
              Enter verification code
            </Text>

            <Text
              style={{
                fontSize: 14,
                fontFamily: FONT.Regular,
                color: "#8E8E93",
                lineHeight: 22,
                marginBottom: 40,
                textAlign: "center",
              }}
            >
              To ensure security, we have sent a 6-digit code to your registered
              number:{" "}
              <Text
                style={{ color: "#FFFFFF", fontFamily: FONT.SemiBold }}
              >
                +995 598 *** 323
              </Text>
            </Text>

            {/* Code Input Boxes */}
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginBottom: 40,
                paddingHorizontal: 0,
              }}
            >
              {code.map((digit, index) => (
                <View
                  key={index}
                  style={{
                    width: 52,
                    height: 64,
                    backgroundColor: "#1C1C1E",
                    borderRadius: 12,
                    borderWidth: digit ? 1 : 0,
                    borderColor: digit ? "#FCCD34" : "transparent",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <TextInput
                    ref={(el) => (inputRefs.current[index] = el)}
                    value={digit}
                    onChangeText={(text) => handleCodeChange(text, index)}
                    onKeyPress={(e) => handleKeyPress(e, index)}
                    keyboardType="number-pad"
                    maxLength={1}
                    style={{
                      fontSize: 23,
                      fontFamily: FONT.Regular,
                      color: "#FFFFFF",
                      textAlign: "center",
                      width: "100%",
                      height: "100%",
                    }}
                  />
                </View>
              ))}
            </View>

            {/* Submit Button */}
            <TouchableOpacity
              onPress={handleSubmit}
              disabled={!isCodeComplete || isSubmitting}
              style={{
                backgroundColor:
                  !isCodeComplete || isSubmitting ? "#6F6F70" : "#FCCD34",
                borderRadius: 15,
                height: 48,
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 32,
                opacity: !isCodeComplete || isSubmitting ? 0.6 : 1,
              }}
            >
              {isSubmitting ? (
                <ActivityIndicator color="#000000" />
              ) : (
                <Text
                  style={{
                    fontSize: 18,
                    fontFamily: FONT.SemiBold,
                    color: "#000000",
                  }}
                >
                  Submit
                </Text>
              )}
            </TouchableOpacity>

            {/* Resend Code */}
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: FONT.Regular,
                  color: "#8E8E93",
                }}
              >
                Send code again{" "}
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: FONT.Regular,
                  color: "#8E8E93",
                }}
              >
                00:20
              </Text>
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>

      {/* Withdrawal History Modal */}
      <Modal
        animationType="slide"
        transparent={false}
        visible={historyVisible}
        onRequestClose={() => setHistoryVisible(false)}
      >
        <SafeAreaView className="flex-1 bg-black">
          <StatusBar barStyle="light-content" />

          {/* Header */}
          <View
            style={{
              height: 56,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              paddingHorizontal: 14,
              position: "relative",
            }}
          >
            <TouchableOpacity
              onPress={() => setHistoryVisible(false)}
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
            </TouchableOpacity>

            <Text
              style={{
                fontSize: 16,
                fontFamily: FONT.SemiBold,
                color: "#FFFFFF",
              }}
            >
              Withdrawal History
            </Text>
          </View>

          {/* Body */}
          <View
            style={{
              flex: 1,
              paddingHorizontal: 20,
              paddingTop: 6,
              paddingBottom: 12,
              justifyContent: "space-between",
            }}
          >
            {/* Top content */}
            <View style={{ alignItems: "center", marginTop: 2 }}>
              <Image
                source={require("../../../assets/images/Check.png")}
                style={{ width: 40, height: 40 }}
                resizeMode="contain"
              />

              <Text
                style={{
                  fontSize: 20,
                  fontFamily: FONT.SemiBold,
                  color: "#FFFFFF",
                  marginTop: 10,
                }}
              >
                999.50 GEL
              </Text>

              <Text
                style={{
                  fontSize: 11,
                  fontFamily: FONT.Regular,
                  color: "#34C759",
                  marginTop: 6,
                }}
              >
                Completed
              </Text>
            </View>

            {/* Middle content */}
            <View style={{ flexShrink: 1, gap: 8 }}>
              {/* Balance & Amount selection */}
              <Text
                style={{
                  fontSize: 13,
                  fontFamily: FONT.SemiBold,
                  color: "#FFFFFF",
                  marginBottom: 6,
                }}
              >
                Balance & Amount selection
              </Text>

              <View
                style={{
                  backgroundColor: "#19191B",
                  borderRadius: 12,
                  paddingVertical: 10,
                  paddingHorizontal: 12,
                  marginBottom: 6,
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    ...historyRowStyle,
                    borderBottomWidth: 1,
                    borderBottomColor: "#2C2C2E",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 13,
                      fontFamily: FONT.Regular,
                      color: "#6F6F70",
                    }}
                  >
                    Withdrawal amount:
                  </Text>
                  <Text
                    style={{
                      fontSize: 13,
                      fontFamily: FONT.Medium,
                      color: "#FFFFFF",
                    }}
                  >
                    1000.00 GEL
                  </Text>
                </View>

                <View
                  style={{
                    ...historyRowStyle,
                    borderBottomWidth: 1,
                    borderBottomColor: "#2C2C2E",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 13,
                      fontFamily: FONT.Regular,
                      color: "#6F6F70",
                    }}
                  >
                    Transfer fee:
                  </Text>
                  <Text
                    style={{
                      fontSize: 13,
                      fontFamily: FONT.Medium,
                      color: "#FFFFFF",
                    }}
                  >
                    -0.50 GEL
                  </Text>
                </View>

                <View
                  style={{
                    ...historyRowStyle,
                    borderBottomWidth: 1,
                    borderBottomColor: "#2C2C2E",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 13,
                      fontFamily: FONT.Regular,
                      color: "#6F6F70",
                    }}
                  >
                    Net amount received:
                  </Text>
                  <Text
                    style={{
                      fontSize: 13,
                      fontFamily: FONT.Medium,
                      color: "#FFFFFF",
                    }}
                  >
                    999.50 GEL
                  </Text>
                </View>

                <View style={{ ...historyRowStyle }}>
                  <Text
                    style={{
                      fontSize: 13,
                      fontFamily: FONT.Regular,
                      color: "#6F6F70",
                    }}
                  >
                    Status:
                  </Text>
                  <Text
                    style={{
                      fontSize: 13,
                      fontFamily: FONT.Medium,
                      color: "#34C759",
                    }}
                  >
                    Completed
                  </Text>
                </View>
              </View>

              {/* Withdrawal summary */}
              <Text
                style={{
                  fontSize: 13,
                  fontFamily: FONT.SemiBold,
                  color: "#FFFFFF",
                  marginBottom: 6,
                }}
              >
                Withdrawal summary
              </Text>

              <View
                style={{
                  backgroundColor: "#1C1C1E",
                  borderRadius: 12,
                  paddingVertical: 10,
                  paddingHorizontal: 12,
                }}
              >
                <View
                  style={{
                    ...historyRowStyle,
                    borderBottomWidth: 1,
                    borderBottomColor: "#2C2C2E",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 13,
                      fontFamily: FONT.Regular,
                      color: "#6F6F70",
                    }}
                  >
                    Transferred to:
                  </Text>
                  <Text
                    style={{
                      fontSize: 13,
                      fontFamily: FONT.Medium,
                      color: "#FFFFFF",
                    }}
                  >
                    Bank account
                  </Text>
                </View>

                <View
                  style={{
                    ...historyRowStyle,
                    borderBottomWidth: 1,
                    borderBottomColor: "#2C2C2E",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 13,
                      fontFamily: FONT.Regular,
                      color: "#6F6F70",
                    }}
                  >
                    Initiated from:
                  </Text>
                  <Text
                    style={{
                      fontSize: 13,
                      fontFamily: FONT.Medium,
                      color: "#FFFFFF",
                    }}
                  >
                    In-App balance
                  </Text>
                </View>

                <View
                  style={{
                    ...historyRowStyle,
                    borderBottomWidth: 1,
                    borderBottomColor: "#2C2C2E",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 13,
                      fontFamily: FONT.Regular,
                      color: "#6F6F70",
                    }}
                  >
                    Date/time
                  </Text>
                  <Text
                    style={{
                      fontSize: 13,
                      fontFamily: FONT.Medium,
                      color: "#FFFFFF",
                    }}
                  >
                    May 15, 2024, 10:30
                  </Text>
                </View>

                <View style={{ ...historyRowStyle }}>
                  <Text
                    style={{
                      fontSize: 13,
                      fontFamily: FONT.Regular,
                      color: "#6F6F70",
                    }}
                  >
                    Transaction ID:
                  </Text>

                  <View
                    style={{ flexDirection: "row", alignItems: "center" }}
                  >
                    <Text
                      style={{
                        fontSize: 13,
                        fontFamily: FONT.Medium,
                        color: "#FFFFFF",
                        marginRight: 6,
                      }}
                    >
                      A1B2C4R4HD7
                    </Text>
                    <Copy size={16} color="#FCCD34" />
                  </View>
                </View>
              </View>
            </View>

            {/* Bottom action buttons */}
            <View style={{ paddingTop: 10 }}>
              <TouchableOpacity
                style={{
                  backgroundColor: "#FCCD34",
                  borderRadius: 12,
                  height: 48,
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 10,
                }}
              >
                <Text
                  style={{
                    fontSize: 15,
                    fontFamily: FONT.SemiBold,
                    color: "#000",
                  }}
                >
                  Download invoice
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setHistoryVisible(false)}
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
                  style={{
                    fontSize: 15,
                    fontFamily: FONT.SemiBold,
                    color: "#FFFFFF",
                  }}
                >
                  Close
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
};

export default Withdrawal;