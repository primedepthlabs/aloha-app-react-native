import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  TextInput,
  ScrollView,
  Alert,
} from "react-native";
import { ChevronLeft } from "lucide-react-native";
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

const AddBank = () => {
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  const [fullName, setFullName] = useState("");
  const [iban, setIban] = useState("");
  const [nameError, setNameError] = useState("");
  const [ibanError, setIbanError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  if (!fontsLoaded) {
    return (
      <View className="flex-1 items-center justify-center bg-black">
        <ActivityIndicator color="#FCCD34" />
      </View>
    );
  }

  const validateIban = (value: string) => {
    if (value && (!value.startsWith("GE") || value.length !== 22)) {
      setIbanError(
        "Please check your IBAN It must start with 'GE' and contain 22 characters."
      );
      return false;
    }
    setIbanError("");
    return true;
  };

  const validateName = (value: string) => {
    if (!value.trim()) {
      setNameError("The name must exactly match the IBAN holder's name");
      return false;
    }
    setNameError("");
    return true;
  };

  const handleSave = () => {
    const isNameValid = validateName(fullName);
    const isIbanValid = validateIban(iban);

    if (isNameValid && isIbanValid) {
      setSuccessMessage(
        isEditing
          ? "Bank Account edited successfully!"
          : "Bank Account saved successfully!"
      );
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
      setIsEditing(true);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      "Delete Bank Account",
      "Are you sure you want to delete this bank account?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            setSuccessMessage("Bank Account deleted successfully!");
            setShowSuccess(true);
            setTimeout(() => {
              setShowSuccess(false);
              setFullName("");
              setIban("");
              setIsEditing(false);
            }, 3000);
          },
        },
      ]
    );
  };

  const maskIban = (value: string) => {
    if (!value) return "";
    const first = value.substring(0, 4);
    const last = value.substring(value.length - 4);
    const middle = " **** **** ****";
    return `${first}${middle} ${last}`;
  };

  return (
    <SafeAreaView className="flex-1 bg-black">
      <StatusBar barStyle="light-content" />

      {showSuccess && (
        <View
          style={{
            backgroundColor: "#FCCD34",
            paddingVertical: 16,
            paddingHorizontal: 20,
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            zIndex: 1000,
          }}
        >
          <Text
            style={{
              fontSize: 15,
              fontFamily: FONT.SemiBold,
              color: "#000000",
              textAlign: "center",
            }}
          >
            {successMessage}
          </Text>
        </View>
      )}

      {/* HEADER */}
      <View
        style={{
          height: 60,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          paddingHorizontal: 20,
          marginTop: showSuccess ? 56 : 0,
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
          <ChevronLeft size={26} color="#FFFFFF" strokeWidth={2} />
        </TouchableOpacity>

        <Text
          style={{
            fontSize: 15,
            fontFamily: FONT.SemiBold,
            color: "#FFFFFF",
          }}
        >
          Add Bank Account
        </Text>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 30 }}
      >
        <View style={{ marginBottom: 32 }}>
          <Text
            style={{
              fontSize: 18,
              fontFamily: FONT.Medium,
              color: "#FFFFFF",
              marginBottom: 16,
            }}
          >
            Account holder details
          </Text>

          <Text
            style={{
              fontSize: 13,
              fontFamily: FONT.Regular,
              color: "#FFFFFF",
              marginBottom: 24,
              lineHeight: 20,
            }}
          >
            Please provide the account holder's details as they appear on the
            bank statement.
          </Text>

          {/* Full Name */}
          <View style={{ marginBottom: 24 }}>
            <Text
              style={{
                fontSize: 15,
                fontFamily: FONT.Medium,
                color: "#FFFFFF",
                marginBottom: 12,
              }}
            >
              {isEditing ? "Full name of account" : "IBAN owner name"}
            </Text>

            <TextInput
              style={{
                backgroundColor: "#19191B",
                borderRadius: 12,
                height: 48,
                paddingHorizontal: 16,
                fontSize: 15,
                fontFamily: FONT.Regular,
                color: "#6C6C70",
                borderWidth: nameError ? 1 : 0,
                borderColor: nameError ? "#FF3B30" : "transparent",
              }}
              value={fullName}
              onChangeText={(text) => {
                setFullName(text);
                if (nameError) validateName(text);
              }}
              placeholder="Enter full name"
              placeholderTextColor="#6C6C70"
              editable={!isEditing}
            />

            {nameError ? (
              <View style={{ flexDirection: "row", alignItems: "center", marginTop: 8 }}>
                <View
                  style={{
                    width: 16,
                    height: 16,
                    borderRadius: 8,
                    backgroundColor: "#FF3B30",
                    alignItems: "center",
                    justifyContent: "center",
                    marginRight: 8,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 12,
                      fontFamily: FONT.Bold,
                      color: "#FFFFFF",
                    }}
                  >
                    !
                  </Text>
                </View>
                <Text
                  style={{
                    fontSize: 12,
                    fontFamily: FONT.Regular,
                    color: "#FF3B30",
                    flex: 1,
                  }}
                >
                  {nameError}
                </Text>
              </View>
            ) : null}
          </View>

          {/* IBAN */}
          <View style={{ marginBottom: 16 }}>
            <Text
              style={{
                fontSize: 15,
                fontFamily: FONT.Medium,
                color: "#FFFFFF",
                marginBottom: 12,
              }}
            >
              {isEditing ? "(IBAN)" : "Bank (IBAN)"}
            </Text>

            <TextInput
              style={{
                backgroundColor: "#19191B",
                borderRadius: 12,
                height: 48,
                paddingHorizontal: 16,
                fontSize: 15,
                fontFamily: FONT.Regular,
                color: "#6C6C70",
                borderWidth: ibanError ? 1 : 0,
                borderColor: ibanError ? "#FF3B30" : "transparent",
              }}
              value={isEditing ? maskIban(iban) : iban}
              onChangeText={(text) => {
                setIban(text.toUpperCase());
                if (ibanError) validateIban(text);
              }}
              placeholder="Enter IBAN"
              placeholderTextColor="#6C6C70"
              autoCapitalize="characters"
              editable={!isEditing}
            />

            {ibanError ? (
              <View style={{ flexDirection: "row", alignItems: "center", marginTop: 8 }}>
                <View
                  style={{
                    width: 16,
                    height: 16,
                    borderRadius: 8,
                    backgroundColor: "#FF3B30",
                    alignItems: "center",
                    justifyContent: "center",
                    marginRight: 8,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 12,
                      fontFamily: FONT.Bold,
                      color: "#FFFFFF",
                    }}
                  >
                    !
                  </Text>
                </View>
                <Text
                  style={{
                    fontSize: 12,
                    fontFamily: FONT.Regular,
                    color: "#FF3B30",
                    flex: 1,
                  }}
                >
                  {ibanError}
                </Text>
              </View>
            ) : null}
          </View>

          <Text
            style={{
              fontSize: 12,
              fontFamily: FONT.Regular,
              color: "#FCCD34",
            }}
          >
            Your bank details are securely encrypted and stored.
          </Text>
        </View>
      </ScrollView>

      {/* Buttons */}
      <View style={{ paddingHorizontal: 20, paddingBottom: 80, gap: 12 }}>
        <TouchableOpacity
          style={{
            width: 332,
            height: 45,
            backgroundColor:
              isEditing && !nameError && !ibanError
                ? "#FCCD34"
                : nameError || ibanError
                ? "#3E3E40"
                : "#FCCD34",
            borderRadius: 15,
            alignItems: "center",
            justifyContent: "center",
            alignSelf: "center",
          }}
          onPress={isEditing ? () => setIsEditing(false) : handleSave}
          disabled={!!(nameError || ibanError)}
        >
          <Text
            style={{
              fontSize: 17,
              fontFamily: FONT.SemiBold,
              color: "#000000",
            }}
          >
            {isEditing ? "Edit account" : "Save bank account"}
          </Text>
        </TouchableOpacity>

        {isEditing && (
          <TouchableOpacity
            style={{
              width: 332,
              height: 45,
              backgroundColor: "transparent",
              borderRadius: 15,
              alignItems: "center",
              justifyContent: "center",
              alignSelf: "center",
            }}
            onPress={handleDelete}
          >
            <Text
              style={{
                fontSize: 17,
                fontFamily: FONT.SemiBold,
                color: "#FFFFFF",
              }}
            >
              Delete IBAN
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
};

export default AddBank;
