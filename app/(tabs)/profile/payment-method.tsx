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
import { ChevronLeft, MoreVertical } from "lucide-react-native";
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
    <View
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
      <View className="flex-row items-center flex-1">
        <View
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
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <View
              style={{
                width: 14,
                height: 14,
                borderRadius: 7,
                backgroundColor: "#EB001B",
                marginRight: -4,
              }}
            />
            <View
              style={{
                width: 14,
                height: 14,
                borderRadius: 7,
                backgroundColor: "#F79E1B",
              }}
            />
          </View>
        </View>
        <Text
          className="text-white"
          style={{
            fontSize: 16,
            fontFamily: FONT.Regular,
          }}
        >
          MASTERCARD {card.number}
        </Text>
      </View>
      <TouchableOpacity
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
      </TouchableOpacity>
    </View>
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
          Payment Methods
        </Text>
      </View>

      {/* Cards List */}
      <View
        style={{
          paddingHorizontal: 20,
          marginTop: 32,
        }}
      >
        {cards.map((card) => (
          <CardItem key={card.id} card={card} />
        ))}

        {/* Add Card Button */}
        <TouchableOpacity
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
          <Text
            className="text-white"
            style={{
              fontSize: 18,
              fontFamily: FONT.SemiBold,
              marginRight: 8,
            }}
          >
            Add Card
          </Text>
          <Text
            className="text-white"
            style={{
              fontSize: 24,
              fontFamily: FONT.Regular,
            }}
          >
            +
          </Text>
        </TouchableOpacity>
      </View>

      {/* Bottom Sheet Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => setModalVisible(false)}
          style={{
            flex: 1,
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            justifyContent: "flex-end",
          }}
        >
          <View
            style={{
              backgroundColor: "#1C1C1E",
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
              paddingHorizontal: 20,
              paddingTop: 24,
              paddingBottom: 40,
            }}
          >
            <TouchableOpacity
              style={{
                height: 60,
                alignItems: "center",
                justifyContent: "center",
                borderBottomWidth: 0.5,
                borderBottomColor: "#3A3A3C",
              }}
            >
              <Text
                className="text-gray-400"
                style={{
                  fontSize: 16,
                  fontFamily: FONT.Regular,
                }}
              >
                Edit details
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleRemoveCard}
              style={{
                height: 60,
                alignItems: "center",
                justifyContent: "center",
                borderBottomWidth: 0.5,
                borderBottomColor: "#3A3A3C",
              }}
            >
              <Text
                className="text-gray-400"
                style={{
                  fontSize: 16,
                  fontFamily: FONT.Regular,
                }}
              >
                Remove Card
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
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
              <Text
                className="text-white"
                style={{
                  fontSize: 16,
                  fontFamily: FONT.SemiBold,
                }}
              >
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
};

export default PaymentMethodsScreen;
