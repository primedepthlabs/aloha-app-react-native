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
import { styled } from "nativewind";
import { ChevronLeft, Copy } from "lucide-react-native";
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
const StyledTextInput = styled(TextInput);
const StyledImage = styled(Image);

const SCREEN_WIDTH = Dimensions.get("window").width;

const FONT = {
  Regular: "Poppins_400Regular",
  Medium: "Poppins_500Medium",
  SemiBold: "Poppins_600SemiBold",
  Bold: "Poppins_700Bold",
};

const BUTTON_HORIZONTAL_PADDING = 24; // matches your content padding

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

  // Verification code state
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

  /* ---------- Styles used for history modal rows ---------- */
  const historyRowStyle = {
    width: 332,
    height: 48,
    flexDirection: "row" as const,
    justifyContent: "space-between" as const,
    alignItems: "center" as const,
    paddingHorizontal: 12,
  };

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
          style={{
            fontSize: 15,
            fontFamily: FONT.SemiBold,
            color: "#FFFFFF",
          }}
        >
          Withdrawal
        </StyledText>
      </StyledView>

      <StyledScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingHorizontal: 24,
          paddingTop: 20,
          paddingBottom: 160, // ensure scrolling space so content isn't hidden behind absolute button
        }}
      >
        {/* Current Balance Card */}
        <StyledView
          style={{
            backgroundColor: "#19191B",
            borderRadius: 16,
            padding: 20,
            marginBottom: 10,
          }}
        >
          <StyledText
            style={{
              fontSize: 12,
              fontFamily: FONT.Regular,
              color: "#FFFFFF",
              marginBottom: 4,
            }}
          >
            Current balance:
          </StyledText>
          <StyledText
            style={{
              fontSize: 20,
              fontFamily: FONT.SemiBold,
              color: "#FCCD34",
            }}
          >
            {currentBalance} GEL
          </StyledText>
        </StyledView>

        {/* Amount to Withdraw */}
        <StyledText
          style={{
            fontSize: 18,
            fontFamily: FONT.Medium,
            color: "#FFFFFF",
            marginBottom: 12,
          }}
        >
          Amount to withdraw (GEL)
        </StyledText>

        <StyledTextInput
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

        <StyledText
          style={{
            fontSize: 12,
            fontFamily: FONT.Regular,
            color: "#FCCD34",
            marginBottom: 15,
          }}
        >
          Minimum withdrawal amount is 10 GEL
        </StyledText>

        {/* Payout Destination */}
        <StyledText
          style={{
            fontSize: 18,
            fontFamily: FONT.Medium,
            color: "#FFFFFF",
            marginBottom: 10,
          }}
        >
          Payout destination
        </StyledText>

        <StyledTouchableOpacity
          style={{
            backgroundColor: "#19191B",
            borderRadius: 12,
            flexDirection: "row",
            alignItems: "center",
            padding: 16,
            marginBottom: 20,
          }}
        >
          <StyledView
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
          </StyledView>
          <StyledView style={{ flex: 1 }}>
            <StyledText
              style={{
                fontSize: 15,
                fontFamily: FONT.Regular,
                color: "#FFFFFF",
              }}
            >
              IBAN: GE**** 1234
            </StyledText>
          </StyledView>
          <ChevronLeft
            size={20}
            color="#8E8E93"
            strokeWidth={2}
            style={{ transform: [{ rotate: "180deg" }] }}
          />
        </StyledTouchableOpacity>

        {/* Withdrawal Summary */}
        <StyledText
          style={{
            fontSize: 16,
            fontFamily: FONT.SemiBold,
            color: "#FFFFFF",
            marginBottom: 10,
          }}
        >
          Withdrawal Summary
        </StyledText>

        <StyledView
          style={{
            backgroundColor: "#19191B",
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
              style={{
                fontSize: 14,
                fontFamily: FONT.Regular,
                color: "#8E8E93",
              }}
            >
              Withdrawal amount:
            </StyledText>
            <StyledText
              style={{
                fontSize: 14,
                fontFamily: FONT.Medium,
                color: "#FFFFFF",
              }}
            >
              {withdrawalAmount.toFixed(2)} GEL
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
                color: "#8E8E93",
              }}
            >
              TAX & Commission:
            </StyledText>
            <StyledText
              style={{
                fontSize: 14,
                fontFamily: FONT.Medium,
                color: "#FFFFFF",
              }}
            >
              -{taxCommission.toFixed(2)} GEL
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
                color: "#8E8E93",
              }}
            >
              Final amount u'll receive:
            </StyledText>
            <StyledText
              style={{
                fontSize: 14,
                fontFamily: FONT.SemiBold,
                color: "#FFFFFF",
              }}
            >
              {finalAmount.toFixed(2)} GEL
            </StyledText>
          </StyledView>
        </StyledView>

        <StyledText
          style={{
            fontSize: 12,
            fontFamily: FONT.Regular,
            color: "#FCCD34",
            marginBottom: 5,
          }}
        >
          Transfers typically take 1-3 business days.
        </StyledText>
      </StyledScrollView>

      {/* Withdraw Button (absolute, centered pill like screenshot) */}
      <StyledView
        style={{
          position: "absolute",
          left: BUTTON_HORIZONTAL_PADDING,
          right: BUTTON_HORIZONTAL_PADDING,
          // bump bottom high so it clears tab bars / rounded device bottom
          bottom: Platform.OS === "ios" ? 96 : 80,
          alignItems: "center",
          justifyContent: "center",
          zIndex: 9999, // make sure it's on top
        }}
        pointerEvents="box-none"
      >
        <StyledTouchableOpacity
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
          <StyledText
            style={{
              fontSize: 18,
              fontFamily: FONT.SemiBold,
              color: "#000000",
            }}
          >
            Withdraw
          </StyledText>
        </StyledTouchableOpacity>
      </StyledView>

      {/* Success Toast */}
      {successToastVisible && (
        <StyledView
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
          <StyledText
            style={{
              fontSize: 16,
              fontFamily: FONT.SemiBold,
              color: "#000000",
            }}
          >
            Withdrawal successfully initiated!
          </StyledText>
        </StyledView>
      )}

      {/* Security Verification Modal */}
      <Modal
        animationType="slide"
        transparent={false}
        visible={verificationVisible}
        onRequestClose={() => setVerificationVisible(false)}
      >
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
            </StyledTouchableOpacity>
            <StyledText
              style={{
                fontSize: 18,
                fontFamily: FONT.SemiBold,
                color: "#FFFFFF",
              }}
            >
              Security Verification
            </StyledText>
          </StyledView>

          <StyledScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{
              paddingHorizontal: 24,
              paddingTop: 40,
            }}
          >
            <StyledText
              style={{
                fontSize: 24,
                fontFamily: FONT.Bold,
                color: "#FFFFFF",
                marginBottom: 16,
                textAlign: "center",
              }}
            >
              Enter verification code
            </StyledText>

            <StyledText
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
              <StyledText
                style={{ color: "#FFFFFF", fontFamily: FONT.SemiBold }}
              >
                +995 598 *** 323
              </StyledText>
            </StyledText>

            {/* Code Input Boxes */}
            <StyledView
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginBottom: 40,
                paddingHorizontal: 0,
              }}
            >
              {code.map((digit, index) => (
                <StyledView
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
                  <StyledTextInput
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
                </StyledView>
              ))}
            </StyledView>

            {/* Submit Button */}
            <StyledTouchableOpacity
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
                <StyledText
                  style={{
                    fontSize: 18,
                    fontFamily: FONT.SemiBold,
                    color: "#000000",
                  }}
                >
                  Submit
                </StyledText>
              )}
            </StyledTouchableOpacity>

            {/* Resend Code */}
            <StyledView
              style={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <StyledText
                style={{
                  fontSize: 14,
                  fontFamily: FONT.Regular,
                  color: "#8E8E93",
                }}
              >
                Send code again{" "}
              </StyledText>
              <StyledText
                style={{
                  fontSize: 14,
                  fontFamily: FONT.Regular,
                  color: "#8E8E93",
                }}
              >
                00:20
              </StyledText>
            </StyledView>
          </StyledScrollView>
        </StyledSafeAreaView>
      </Modal>

      {/* Withdrawal History Modal */}
      <Modal
        animationType="slide"
        transparent={false}
        visible={historyVisible}
        onRequestClose={() => setHistoryVisible(false)}
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
            </StyledTouchableOpacity>

            <StyledText
              style={{
                fontSize: 16,
                fontFamily: FONT.SemiBold,
                color: "#FFFFFF",
              }}
            >
              Withdrawal History
            </StyledText>
          </StyledView>

          {/* Body (fixed layout - no scroll) */}
          <StyledView
            style={{
              flex: 1,
              paddingHorizontal: 20,
              paddingTop: 6,
              paddingBottom: 12,
              justifyContent: "space-between",
            }}
          >
            {/* Top content (icon + amount + subtitle) */}
            <StyledView style={{ alignItems: "center", marginTop: 2 }}>
              <StyledImage
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
                999.50 GEL
              </StyledText>

              <StyledText
                style={{
                  fontSize: 11,
                  fontFamily: FONT.Regular,
                  color: "#34C759",
                  marginTop: 6,
                }}
              >
                Completed
              </StyledText>
            </StyledView>

            {/* Middle content (compact cards stacked) */}
            <StyledView style={{ flexShrink: 1, gap: 8 }}>
              {/* Balance & Amount selection */}
              <StyledText
                style={{
                  fontSize: 13,
                  fontFamily: FONT.SemiBold,
                  color: "#FFFFFF",
                  marginBottom: 6,
                }}
              >
                Balance & Amount selection
              </StyledText>

              <StyledView
                style={{
                  backgroundColor: "#19191B",
                  borderRadius: 12,
                  paddingVertical: 10,
                  paddingHorizontal: 12,
                  marginBottom: 6,
                  alignItems: "center",
                }}
              >
                <StyledView
                  style={{
                    ...historyRowStyle,
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
                    Withdrawal amount:
                  </StyledText>
                  <StyledText
                    style={{
                      fontSize: 13,
                      fontFamily: FONT.Medium,
                      color: "#FFFFFF",
                    }}
                  >
                    1000.00 GEL
                  </StyledText>
                </StyledView>

                <StyledView
                  style={{
                    ...historyRowStyle,
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
                    Transfer fee:
                  </StyledText>
                  <StyledText
                    style={{
                      fontSize: 13,
                      fontFamily: FONT.Medium,
                      color: "#FFFFFF",
                    }}
                  >
                    -0.50 GEL
                  </StyledText>
                </StyledView>

                <StyledView
                  style={{
                    ...historyRowStyle,
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
                    Net amount received:
                  </StyledText>
                  <StyledText
                    style={{
                      fontSize: 13,
                      fontFamily: FONT.Medium,
                      color: "#FFFFFF",
                    }}
                  >
                    999.50 GEL
                  </StyledText>
                </StyledView>

                <StyledView style={{ ...historyRowStyle }}>
                  <StyledText
                    style={{
                      fontSize: 13,
                      fontFamily: FONT.Regular,
                      color: "#6F6F70",
                    }}
                  >
                    Status:
                  </StyledText>
                  <StyledText
                    style={{
                      fontSize: 13,
                      fontFamily: FONT.Medium,
                      color: "#34C759",
                    }}
                  >
                    Completed
                  </StyledText>
                </StyledView>
              </StyledView>

              {/* Withdrawal summary */}
              <StyledText
                style={{
                  fontSize: 13,
                  fontFamily: FONT.SemiBold,
                  color: "#FFFFFF",
                  marginBottom: 6,
                }}
              >
                Withdrawal summary
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
                    ...historyRowStyle,
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
                    Transferred to:
                  </StyledText>
                  <StyledText
                    style={{
                      fontSize: 13,
                      fontFamily: FONT.Medium,
                      color: "#FFFFFF",
                    }}
                  >
                    Bank account
                  </StyledText>
                </StyledView>

                <StyledView
                  style={{
                    ...historyRowStyle,
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
                    Initiated from:
                  </StyledText>
                  <StyledText
                    style={{
                      fontSize: 13,
                      fontFamily: FONT.Medium,
                      color: "#FFFFFF",
                    }}
                  >
                    In-App balance
                  </StyledText>
                </StyledView>

                <StyledView
                  style={{
                    ...historyRowStyle,
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
                    Date/time
                  </StyledText>
                  <StyledText
                    style={{
                      fontSize: 13,
                      fontFamily: FONT.Medium,
                      color: "#FFFFFF",
                    }}
                  >
                    May 15, 2024, 10:30
                  </StyledText>
                </StyledView>

                <StyledView style={{ ...historyRowStyle }}>
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
                      A1B2C4R4HD7
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
              >
                <StyledText
                  style={{
                    fontSize: 15,
                    fontFamily: FONT.SemiBold,
                    color: "#000",
                  }}
                >
                  Download invoice
                </StyledText>
              </StyledTouchableOpacity>

              <StyledTouchableOpacity
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
                <StyledText
                  style={{
                    fontSize: 15,
                    fontFamily: FONT.SemiBold,
                    color: "#FFFFFF",
                  }}
                >
                  Close
                </StyledText>
              </StyledTouchableOpacity>
            </StyledView>
          </StyledView>
        </StyledSafeAreaView>
      </Modal>
    </StyledSafeAreaView>
  );
};

export default Withdrawal;
