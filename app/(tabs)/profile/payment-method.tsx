import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Image,
  ActivityIndicator,
  Modal,
} from "react-native";
import { styled } from "nativewind";
import { ChevronLeft, MoreVertical } from "lucide-react-native";
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
const StyledImage = styled(Image);

const FONT = {
  Regular: "Poppins_400Regular",
  Medium: "Poppins_500Medium",
  SemiBold: "Poppins_600SemiBold",
  Bold: "Poppins_700Bold",
};

const PaymentMethodsScreen = () => {
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCard, setSelectedCard] = useState<number | null>(null);

  const [cards, setCards] = useState([
    { id: 1, number: "**** 5100" },
    { id: 2, number: "**** 5100" },
  ]);

  if (!fontsLoaded) {
    return (
      <View className="flex-1 items-center justify-center bg-black">
        <ActivityIndicator color="#FCCD34" />
      </View>
    );
  }

  const handleRemoveCard = () => {
    if (selectedCard !== null) {
      setCards(cards.filter((card) => card.id !== selectedCard));
      setModalVisible(false);
      setSelectedCard(null);
    }
  };

  const CardItem = ({ card }: any) => (
    <StyledView
      style={{
        height: 60,
        backgroundColor: "#1C1C1E",
        borderRadius: 12,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 16,
        marginBottom: 12,
      }}
    >
      <StyledView className="flex-row items-center flex-1">
        <StyledView
          style={{
            width: 40,
            height: 28,
            backgroundColor: "white",
            borderRadius: 6,
            marginRight: 12,
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
          }}
        >
          {/* Mastercard logo circles */}
          <StyledView
            style={{
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <StyledView
              style={{
                width: 14,
                height: 14,
                borderRadius: 7,
                backgroundColor: "#EB001B",
                marginRight: -4,
              }}
            />
            <StyledView
              style={{
                width: 14,
                height: 14,
                borderRadius: 7,
                backgroundColor: "#F79E1B",
              }}
            />
          </StyledView>
        </StyledView>
        <StyledText
          className="text-white"
          style={{
            fontSize: 16,
            fontFamily: FONT.Regular,
          }}
        >
          MASTERCARD {card.number}
        </StyledText>
      </StyledView>
      <StyledTouchableOpacity
        onPress={() => {
          setSelectedCard(card.id);
          setModalVisible(true);
        }}
        style={{
          width: 32,
          height: 32,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <MoreVertical size={20} color="#FFFFFF" strokeWidth={2} />
      </StyledTouchableOpacity>
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
          <ChevronLeft size={24} color="#FFFFFF" strokeWidth={2} />
        </StyledTouchableOpacity>
        <StyledText
          className="text-white"
          style={{
            fontSize: 18,
            fontFamily: FONT.SemiBold,
          }}
        >
          Payment Methods
        </StyledText>
      </StyledView>

      {/* Cards List */}
      <StyledView
        style={{
          paddingHorizontal: 20,
          marginTop: 32,
        }}
      >
        {cards.map((card) => (
          <CardItem key={card.id} card={card} />
        ))}

        {/* Add Card Button */}
        <StyledTouchableOpacity
          onPress={() => router.push("/(tabs)/discover/addCard")}
          style={{
            height: 60,
            backgroundColor: "transparent",
            borderRadius: 12,
            borderWidth: 1.5,
            borderColor: "#FCCD34",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "row",
            marginTop: 8,
          }}
        >
          <StyledText
            className="text-white"
            style={{
              fontSize: 18,
              fontFamily: FONT.SemiBold,
              marginRight: 8,
            }}
          >
            Add Card
          </StyledText>
          <StyledText
            className="text-white"
            style={{
              fontSize: 24,
              fontFamily: FONT.Regular,
            }}
          >
            +
          </StyledText>
        </StyledTouchableOpacity>
      </StyledView>

      {/* Bottom Sheet Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <StyledTouchableOpacity
          activeOpacity={1}
          onPress={() => setModalVisible(false)}
          style={{
            flex: 1,
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            justifyContent: "flex-end",
          }}
        >
          <StyledView
            style={{
              backgroundColor: "#1C1C1E",
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
              paddingHorizontal: 20,
              paddingTop: 24,
              paddingBottom: 40,
            }}
          >
            <StyledTouchableOpacity
              style={{
                height: 60,
                alignItems: "center",
                justifyContent: "center",
                borderBottomWidth: 0.5,
                borderBottomColor: "#3A3A3C",
              }}
            >
              <StyledText
                className="text-gray-400"
                style={{
                  fontSize: 16,
                  fontFamily: FONT.Regular,
                }}
              >
                Edit details
              </StyledText>
            </StyledTouchableOpacity>

            <StyledTouchableOpacity
              onPress={handleRemoveCard}
              style={{
                height: 60,
                alignItems: "center",
                justifyContent: "center",
                borderBottomWidth: 0.5,
                borderBottomColor: "#3A3A3C",
              }}
            >
              <StyledText
                className="text-gray-400"
                style={{
                  fontSize: 16,
                  fontFamily: FONT.Regular,
                }}
              >
                Remove Card
              </StyledText>
            </StyledTouchableOpacity>

            <StyledTouchableOpacity
              onPress={() => setModalVisible(false)}
              style={{
                height: 56,
                backgroundColor: "#2C2C2E",
                borderRadius: 12,
                alignItems: "center",
                justifyContent: "center",
                marginTop: 16,
              }}
            >
              <StyledText
                className="text-white"
                style={{
                  fontSize: 16,
                  fontFamily: FONT.SemiBold,
                }}
              >
                Cancel
              </StyledText>
            </StyledTouchableOpacity>
          </StyledView>
        </StyledTouchableOpacity>
      </Modal>
    </StyledSafeAreaView>
  );
};

export default PaymentMethodsScreen;
