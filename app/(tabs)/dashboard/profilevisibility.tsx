import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  Switch,
  ScrollView,
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

const ProfileVisibility = () => {
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  const [makeDiscoverable, setMakeDiscoverable] = useState(false);
  const [showInSearch, setShowInSearch] = useState(false);
  const [showOnlineStatus, setShowOnlineStatus] = useState(false);

  if (!fontsLoaded) {
    return (
      <View
        style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "black" }}
      >
        <ActivityIndicator color="#FCCD34" />
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "black" }}>
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
          <ChevronLeft size={26} color="#FFFFFF" strokeWidth={2} />
        </TouchableOpacity>

        <Text
          style={{
            fontSize: 15,
            fontFamily: FONT.SemiBold,
            color: "#FFFFFF",
          }}
        >
          Profile Visibility
        </Text>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 30 }}
      >
        {/* Global Visibility Section */}
        <View style={{ marginBottom: 32 }}>
          <Text
            style={{
              fontSize: 18,
              fontFamily: FONT.Medium,
              color: "#FFFFFF",
              marginBottom: 10,
            }}
          >
            Global visibility
          </Text>

          {/* Make Profile Discoverable Toggle */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "flex-start",
              justifyContent: "space-between",
            }}
          >
            <View style={{ flex: 1, marginRight: 16 }}>
              <Text
                style={{
                  fontSize: 15,
                  fontFamily: FONT.Regular,
                  color: "#FFFFFF",
                }}
              >
                Make profile discoverable
              </Text>
              <Text
                style={{
                  fontSize: 13,
                  fontFamily: FONT.Regular,
                  color: "#FCCD34",
                }}
              >
                Make your profile discoverable to others
              </Text>
            </View>

            <Switch
              trackColor={{ false: "#19191B", true: "#FCCD34" }}
              thumbColor="#FFFFFF"
              ios_backgroundColor="#19191B"
              value={makeDiscoverable}
              onValueChange={setMakeDiscoverable}
              style={{ marginTop: 4 }}
            />
          </View>
        </View>

        {/* Discoverability Settings Section */}
        <View style={{ marginBottom: 32 }}>
          <Text
            style={{
              fontSize: 18,
              fontFamily: FONT.Medium,
              color: "#FFFFFF",
              marginBottom: 10,
            }}
          >
            Discoverability settings
          </Text>

          {/* Show In Search Toggle */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "flex-start",
              justifyContent: "space-between",
              marginBottom: 8,
            }}
          >
            <View style={{ flex: 1, marginRight: 16 }}>
              <Text
                style={{
                  fontSize: 15,
                  fontFamily: FONT.Regular,
                  color: "#FFFFFF",
                  marginBottom: 4,
                }}
              >
                Show profile in search results
              </Text>
              <Text
                style={{
                  fontSize: 13,
                  fontFamily: FONT.Regular,
                  color: "#FCCD34",
                }}
              >
                Show your profile in search results
              </Text>
            </View>

            <Switch
              trackColor={{ false: "#19191B", true: "#FCCD34" }}
              thumbColor="#FFFFFF"
              ios_backgroundColor="#19191B"
              value={showInSearch}
              onValueChange={setShowInSearch}
              style={{ marginTop: 4 }}
            />
          </View>
        </View>

        {/* Current Status Section */}
        <View style={{ marginBottom: 32 }}>
          <Text
            style={{
              fontSize: 18,
              fontFamily: FONT.Medium,
              color: "#FFFFFF",
              marginBottom: 10,
            }}
          >
            Current status
          </Text>

          {/* Online Toggle */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "flex-start",
              justifyContent: "space-between",
            }}
          >
            <View style={{ flex: 1, marginRight: 16 }}>
              <Text
                style={{
                  fontSize: 15,
                  fontFamily: FONT.Regular,
                  color: "#FFFFFF",
                }}
              >
                Online
              </Text>
              <Text
                style={{
                  fontSize: 13,
                  fontFamily: FONT.Regular,
                  color: "#FCCD34",
                }}
              >
                Your current status is visible to others
              </Text>
            </View>

            <Switch
              trackColor={{ false: "#19191B", true: "#FCCD34" }}
              thumbColor="#FFFFFF"
              ios_backgroundColor="#19191B"
              value={showOnlineStatus}
              onValueChange={setShowOnlineStatus}
              style={{ marginTop: 4 }}
            />
          </View>
        </View>
      </ScrollView>

      {/* Save Button */}
      <View style={{ paddingHorizontal: 20, paddingBottom: 80 }}>
        <TouchableOpacity
          style={{
            width: 332,
            height: 45,
            backgroundColor: "#FCCD34",
            borderRadius: 15,
            alignItems: "center",
            justifyContent: "center",
            alignSelf: "center",
          }}
        >
          <Text
            style={{
              fontSize: 17,
              fontFamily: FONT.SemiBold,
              color: "#000000",
            }}
          >
            Save changes
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default ProfileVisibility;
