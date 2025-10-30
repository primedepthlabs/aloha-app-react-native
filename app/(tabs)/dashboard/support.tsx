import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  ScrollView,
  Image,
  TextInput,
  ImageBackground,
} from "react-native";
import { styled } from "nativewind";
import {
  ChevronLeft,
  ChevronDown,
  ChevronUp,
  Search,
} from "lucide-react-native";
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
const StyledImageBackground = styled(ImageBackground);

const FONT = {
  Regular: "Poppins_400Regular",
  Medium: "Poppins_500Medium",
  SemiBold: "Poppins_600SemiBold",
  Bold: "Poppins_700Bold",
};

interface Message {
  id: string;
  text: string;
  timestamp: string;
  isSent: boolean;
  isEdited?: boolean;
  replyTo?: {
    text: string;
    isSent: boolean;
  };
}

const Support = () => {
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  const [showChat, setShowChat] = useState(false);
  const [expandedQuestion, setExpandedQuestion] = useState<string | null>("q1");
  const [searchQuery, setSearchQuery] = useState("");
  const [messageInput, setMessageInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hi, how can we help?",
      timestamp: "2:00",
      isSent: false,
    },
  ]);

  const scrollViewRef = useRef<ScrollView>(null);

  if (!fontsLoaded) {
    return (
      <View className="flex-1 items-center justify-center bg-black">
        <ActivityIndicator color="#FCCD34" />
      </View>
    );
  }

  const faqData = [
    {
      id: "q1",
      question: "How to add my IBAN?",
      answer:
        'Go to Dashboard, "Payout method rules, tap "Add Card" or "Change Bank Account", Enter your Full Name on Account and Bank (IBAN), tap "Save bank Account" to confirm.',
    },
    {
      id: "q2",
      question: "What is the withdrawal fee?",
      answer: "The withdrawal fee is 2% of the amount withdrawn.",
    },
    {
      id: "q3",
      question: "How to set prices for messages?",
      answer:
        "Go to Dashboard, then Paid Messaging settings to set your message prices.",
    },
    {
      id: "q4",
      question: "How to make my profile visible?",
      answer:
        "Go to Profile Settings, then Profile Visibility to adjust your visibility settings.",
    },
  ];

  const toggleQuestion = (id: string) => {
    setExpandedQuestion(expandedQuestion === id ? null : id);
  };

  const handleSendMessage = () => {
    if (messageInput.trim()) {
      const newMessage: Message = {
        id: Date.now().toString(),
        text: messageInput,
        timestamp: new Date().toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
          hour12: false,
        }),
        isSent: true,
      };
      setMessages([...messages, newMessage]);
      setMessageInput("");
    }
  };

  if (showChat) {
    return (
      <StyledSafeAreaView className="flex-1 bg-black">
        <StatusBar barStyle="light-content" />

        {/* Chat Header */}
        <StyledView
          style={{
            height: 60,
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: 20,
            position: "relative",
          }}
        >
          <StyledTouchableOpacity
            onPress={() => setShowChat(false)}
            style={{
              width: 40,
              height: 40,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <ChevronLeft size={26} color="#FFFFFF" strokeWidth={2} />
          </StyledTouchableOpacity>

          <StyledView
            style={{
              flex: 1,
              flexDirection: "row",
              alignItems: "center",
              marginLeft: 8,
            }}
          >
            <StyledImage
              source={require("../../../assets/images/dashboard/support-avatar.png")}
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                marginRight: 12,
              }}
              resizeMode="cover"
            />
            <StyledText
              style={{
                fontSize: 15,
                fontFamily: FONT.SemiBold,
                color: "#FFFFFF",
              }}
            >
              Support
            </StyledText>
          </StyledView>

          <StyledTouchableOpacity
            style={{
              width: 40,
              height: 40,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Search size={24} color="#FFFFFF" strokeWidth={2} />
          </StyledTouchableOpacity>
        </StyledView>

        {/* Messages Area */}
        <StyledImageBackground
          source={require("../../../assets/images/chat-background.png")}
          className="flex-1"
          resizeMode="cover"
        >
          <StyledScrollView
            ref={scrollViewRef}
            className="flex-1 px-4 pt-4"
            contentContainerStyle={{ paddingBottom: 20 }}
            onContentSizeChange={() =>
              scrollViewRef.current?.scrollToEnd({ animated: true })
            }
          >
            {messages.map((msg) => (
              <StyledView
                key={msg.id}
                style={{
                  alignSelf: msg.isSent ? "flex-end" : "flex-start",
                  maxWidth: "80%",
                  marginBottom: 12,
                }}
              >
                <StyledView
                  style={{
                    backgroundColor: msg.isSent ? "#B99F4A" : "#2D2D2F",
                    borderRadius: 16,
                    padding: 12,
                    paddingHorizontal: 16,
                  }}
                >
                  <StyledText
                    style={{
                      color: "white",
                      fontSize: 15,
                      fontFamily: FONT.Regular,
                      lineHeight: 20,
                    }}
                  >
                    {msg.text}
                  </StyledText>

                  <StyledView
                    style={{
                      flexDirection: "row",
                      justifyContent: "flex-end",
                      alignItems: "center",
                      marginTop: 4,
                      gap: 4,
                    }}
                  >
                    {msg.isEdited && (
                      <StyledText
                        style={{
                          color: "rgba(255,255,255,0.5)",
                          fontSize: 11,
                          fontFamily: FONT.Regular,
                        }}
                      >
                        Edited
                      </StyledText>
                    )}
                    <StyledText
                      style={{
                        color: "rgba(255,255,255,0.5)",
                        fontSize: 11,
                        fontFamily: FONT.Regular,
                      }}
                    >
                      {msg.timestamp}
                    </StyledText>
                    {msg.isSent && (
                      <StyledImage
                        source={require("../../../assets/images/dashboard/double-tick.png")}
                        style={{
                          width: 16,
                          height: 12,
                          marginLeft: 2,
                        }}
                        resizeMode="contain"
                      />
                    )}
                  </StyledView>
                </StyledView>
              </StyledView>
            ))}
          </StyledScrollView>
        </StyledImageBackground>

        {/* Input Area */}
        <StyledView
          style={{
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: 16,
            paddingVertical: 50,
            backgroundColor: "#000000",

            borderTopColor: "#2D2D2F",
          }}
        >
          <StyledTouchableOpacity
            style={{
              width: 40,
              height: 40,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <StyledText style={{ fontSize: 28, color: "#FFFFFF" }}>
              +
            </StyledText>
          </StyledTouchableOpacity>

          <StyledView
            style={{
              flex: 1,
              backgroundColor: "#19191B",
              borderRadius: 20,
              paddingHorizontal: 16,
              paddingVertical: 10,
              marginHorizontal: 8,
            }}
          >
            <StyledTextInput
              style={{
                color: "#FFFFFF",
                fontSize: 15,
                fontFamily: FONT.Regular,
              }}
              placeholder="Type your message"
              placeholderTextColor="#FFFFFF"
              value={messageInput}
              onChangeText={setMessageInput}
              multiline
            />
          </StyledView>

          <StyledTouchableOpacity
            style={{
              width: 40,
              height: 40,
              backgroundColor: "#FCCD34",
              borderRadius: 20,
              alignItems: "center",
              justifyContent: "center",
            }}
            onPress={handleSendMessage}
          >
            <StyledImage
              source={require("../../../assets/images/dashboard/send-icon.png")}
              style={{ width: 20, height: 20 }}
              resizeMode="contain"
            />
          </StyledTouchableOpacity>
        </StyledView>
      </StyledSafeAreaView>
    );
  }

  return (
    <StyledSafeAreaView className="flex-1 bg-black">
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <StyledView
        style={{
          height: 40,
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
          Support
        </StyledText>
      </StyledView>

      <StyledScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 30 }}
      >
        {/* How can we help you? */}
        <StyledText
          style={{
            fontSize: 18,
            fontFamily: FONT.Medium,
            color: "#FFFFFF",
            marginBottom: 10,
          }}
        >
          How can we help you?
        </StyledText>

        {/* Search Bar */}
        <StyledView
          style={{
            backgroundColor: "black",
            borderRadius: 15,
            borderWidth: 0.5,
            borderColor: "#808080",
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: 16,
            height: 40,
            marginBottom: 24,
          }}
        >
          <Search size={20} color="#6C6C70" strokeWidth={2} />
          <StyledTextInput
            style={{
              flex: 1,
              marginLeft: 12,
              color: "#FFFFFF",
              fontSize: 15,
              fontFamily: FONT.Regular,
            }}
            placeholder="Enter your keyword"
            placeholderTextColor="#808080"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </StyledView>

        {/* Talk to a support specialist Card */}
        <StyledTouchableOpacity
          onPress={() => setShowChat(true)}
          style={{
            width: 332,
            height: 145,
            borderRadius: 15,
            marginBottom: 10,
            alignSelf: "center",
          }}
        >
          <StyledImage
            source={require("../../../assets/images/dashboard/support-specialist.png")}
            style={{
              width: "100%",
              height: "100%",
              borderRadius: 15,
            }}
            resizeMode="cover"
          />
        </StyledTouchableOpacity>

        {/* Top Questions */}
        <StyledText
          style={{
            fontSize: 18,
            fontFamily: FONT.Medium,
            color: "#FFFFFF",
            marginBottom: 10,
          }}
        >
          Top questions
        </StyledText>

        {/* FAQ Items */}
        {faqData.map((faq) => (
          <StyledView
            key={faq.id}
            style={{
              backgroundColor: "black",
              borderWidth: 0.5,
              borderColor: "#808080",
              borderRadius: 12,
              marginBottom: 12,
              overflow: "hidden",
            }}
          >
            <StyledTouchableOpacity
              onPress={() => toggleQuestion(faq.id)}
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                padding: 16,
              }}
            >
              <StyledText
                style={{
                  fontSize: 15,
                  fontFamily: FONT.Medium,
                  color: "#FFFFFF",
                  flex: 1,
                  marginRight: 12,
                }}
              >
                {faq.question}
              </StyledText>
              {expandedQuestion === faq.id ? (
                <ChevronUp size={20} color="#FFFFFF" strokeWidth={2} />
              ) : (
                <ChevronDown size={20} color="#FFFFFF" strokeWidth={2} />
              )}
            </StyledTouchableOpacity>

            {expandedQuestion === faq.id && (
              <StyledView
                style={{
                  paddingHorizontal: 16,
                  paddingBottom: 16,
                  paddingTop: 0,
                }}
              >
                <StyledText
                  style={{
                    fontSize: 13,
                    fontFamily: FONT.Regular,
                    color: "#B0B0B0",
                    lineHeight: 20,
                  }}
                >
                  {faq.answer}
                </StyledText>
              </StyledView>
            )}
          </StyledView>
        ))}
      </StyledScrollView>
    </StyledSafeAreaView>
  );
};

export default Support;
