// app/login.tsx - Login Screen with Country Picker
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  ScrollView,
  Pressable,
} from "react-native";
import { router } from "expo-router";
import { ChevronLeft, ChevronDown, Search } from "lucide-react-native";
import { COUNTRIES, getDefaultCountry, Country } from "../../utils/countryData";

export default function LoginScreen() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [selectedCountry, setSelectedCountry] = useState<Country>(
    getDefaultCountry()
  );
  const [modalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState("");

  const handleCountrySelect = (country: Country) => {
    setSelectedCountry(country);
    setModalVisible(false);
    setSearchQuery("");
  };

  const handleContinue = () => {
    // Validate phone number
    if (!phoneNumber.trim()) {
      setError("Phone number is required");
      return;
    }

    // Clear error and navigate
    setError("");
    router.push({
      pathname: "/verification",
      params: {
        phoneNumber: phoneNumber,
        countryCode: selectedCountry.code,
      },
    });
  };

  // Filter countries based on search query
  const filteredCountries = COUNTRIES.filter(
    (country) =>
      country.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
      country.code.includes(searchQuery)
  );

  return (
    <View className="flex-1 bg-black px-6 py-12">
      {/* Header */}
      <View className="flex-row items-center mb-12">
        <TouchableOpacity onPress={() => router.back()}>
          <ChevronLeft size={24} color="#fff" />
        </TouchableOpacity>
        <Text className="text-white text-2xl font-bold flex-1 text-center mr-6">
          ALOHA
        </Text>
      </View>

      {/* Content */}
      <View className="flex-1">
        <Text className="text-white text-3xl font-bold text-center mb-8">
          Let's start with your{"\n"}number
        </Text>

        {/* Phone Input */}
        <View className="mb-2">
          <View className="flex-row items-center bg-gray-900 rounded-2xl px-4 py-4">
            {/* Country Code Selector */}
            <TouchableOpacity
              onPress={() => setModalVisible(true)}
              className="flex-row items-center mr-3 pr-3 border-r border-gray-700"
            >
              <Text className="text-2xl mr-2">{selectedCountry.flag}</Text>
              <Text className="text-white text-base mr-1">
                {selectedCountry.code}
              </Text>
              <ChevronDown size={16} color="#fff" />
            </TouchableOpacity>

            {/* Phone Number Input */}
            <TextInput
              className="flex-1 text-white text-base"
              placeholder="Enter phone number"
              placeholderTextColor="#666"
              keyboardType="phone-pad"
              value={phoneNumber}
              onChangeText={(text) => {
                setPhoneNumber(text);
                // Clear error when user starts typing
                if (error) setError("");
              }}
            />
          </View>

          {/* Error Message */}
          {error ? (
            <Text className="text-red-500 text-sm mt-2 ml-4">{error}</Text>
          ) : null}
        </View>

        {/* Continue Button */}
        <TouchableOpacity
          className="bg-[#FCCD34] rounded-2xl py-4 px-8 mt-6"
          onPress={handleContinue}
        >
          <Text className="text-white text-center text-lg font-bold">
            Continue
          </Text>
        </TouchableOpacity>
      </View>

      {/* Country Picker Modal */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => {
          setModalVisible(false);
          setSearchQuery("");
        }}
      >
        <View className="flex-1 justify-end bg-black/50">
          <View className="bg-gray-900 rounded-t-3xl h-[80%]">
            {/* Modal Header */}
            <View className="p-6 border-b border-gray-800">
              <View className="flex-row items-center justify-between mb-4">
                <Text className="text-white text-xl font-bold">
                  Select Country
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    setModalVisible(false);
                    setSearchQuery("");
                  }}
                >
                  <Text className="text-gray-400 text-2xl">✕</Text>
                </TouchableOpacity>
              </View>

              {/* Search Bar */}
              <View className="flex-row items-center bg-gray-800 rounded-xl px-4 py-3">
                <Search size={20} color="#666" />
                <TextInput
                  className="flex-1 text-white text-base ml-2"
                  placeholder="Search country or code..."
                  placeholderTextColor="#666"
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                />
              </View>
            </View>

            {/* Country List */}
            <ScrollView className="flex-1">
              {filteredCountries.length > 0 ? (
                filteredCountries.map((country, index) => (
                  <Pressable
                    key={index}
                    onPress={() => handleCountrySelect(country)}
                    className="flex-row items-center px-6 py-4 border-b border-gray-800"
                  >
                    <Text className="text-3xl mr-4">{country.flag}</Text>
                    <View className="flex-1">
                      <Text className="text-white text-base font-medium">
                        {country.country}
                      </Text>
                    </View>
                    <Text className="text-gray-400 text-base">
                      {country.code}
                    </Text>
                  </Pressable>
                ))
              ) : (
                <View className="items-center justify-center py-12">
                  <Text className="text-gray-500 text-base">
                    No countries found
                  </Text>
                </View>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}
