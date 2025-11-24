import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Image,
  ActivityIndicator,
  Modal,
  Linking,
} from "react-native";
import {} from "nativewind";
import {
  Settings,
  Bell,
  Star,
  CreditCard,
  HelpCircle,
  ShieldCheck,
  Globe,
  ChevronRight,
} from "lucide-react-native";
import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
} from "@expo-google-fonts/poppins";
import { router } from "expo-router";

// <-- UPDATE THIS IMPORT PATH if your auth helper lives elsewhere -->
import {
  getCurrentUserFromServer,
  getCurrentUser,
  getUserProfile,
} from "@/utils/authHelpers";

const FONT = {
  Regular: "Poppins_400Regular",
  Medium: "Poppins_500Medium",
  SemiBold: "Poppins_600SemiBold",
  Bold: "Poppins_700Bold",
};

const ProfileScreen = () => {
  // local state driven from logged-in user
  const [userName, setUserName] = useState<string | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [balance, setBalance] = useState<number | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState("English");
  const [isLanguageModalVisible, setIsLanguageModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);

  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  useEffect(() => {
    let mounted = true;

    const loadUser = async () => {
      try {
        // Try to get fresh user from server first
        const serverUser = await getCurrentUserFromServer().catch(() =>
          getCurrentUser()
        ); // fallback to cached

        // serverUser may be null
        if (!serverUser) {
          if (mounted) {
            setUserName("Guest");
            setAvatarUrl(null);
            setBalance(null);
            setLoading(false);
          }
          return;
        }

        // name from user_metadata.full_name or user_metadata.username or fallback to phone/id
        const name =
          serverUser.user_metadata?.full_name ||
          serverUser.user_metadata?.username ||
          serverUser.email ||
          serverUser.phone ||
          "User";

        // set preliminary
        if (mounted) {
          setUserName(name);
        }

        // Try to fetch extended profile (your DB users table)
        try {
          const profile = await getUserProfile();
          if (mounted && profile) {
            // adapt to your schema: avatar_url, full_name, balance etc.
            setAvatarUrl(profile.avatar_url ?? profile.image_url ?? null);
            // If you store balance in profile as `balance` or `wallet_balance` adjust below:
            const parsedBalance =
              typeof profile.balance === "number"
                ? profile.balance
                : profile.wallet_balance &&
                  !isNaN(Number(profile.wallet_balance))
                ? Number(profile.wallet_balance)
                : null;
            if (parsedBalance !== null) setBalance(parsedBalance);
            if (profile.full_name && mounted) setUserName(profile.full_name);
          }
        } catch (err) {
          // no profile table or failed — keep minimal info from auth user
          // console.warn("profile fetch failed", err);
        }
      } catch (err) {
        console.error("Error loading user data:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadUser();
    return () => {
      mounted = false;
    };
  }, []);

  if (!fontsLoaded) {
    return (
      <View className="flex-1 items-center justify-center bg-black">
        <ActivityIndicator color="#FCCD34" />
      </View>
    );
  }

  const MenuItem = ({
    icon: Icon,
    title,
    subtitle,
    rightText,
    onPress,
  }: any) => (
    <TouchableOpacity
      onPress={onPress}
      style={{
        width: 330,
        height: 40,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: "black",
        borderRadius: 15,
        paddingHorizontal: 16,
        marginBottom: 10,
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
        <View
          style={{
            width: 32,
            height: 32,
            marginRight: 12,
            backgroundColor: "#19191B",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 8,
          }}
        >
          <Icon size={20} color="#FFFFFF" strokeWidth={2} />
        </View>
        <View style={{ flex: 1 }}>
          <Text
            style={{
              fontSize: 16,
              fontFamily: FONT.Regular,
              color: "#fff",
            }}
          >
            {title}
          </Text>
        </View>
        {rightText && (
          <Text
            style={{
              fontSize: 15,
              fontFamily: FONT.Regular,
              marginRight: 8,
              color: "#9A9A9A",
            }}
          >
            {rightText}
          </Text>
        )}
        <ChevronRight size={20} color="#8E8E93" strokeWidth={2} />
      </View>
    </TouchableOpacity>
  );

  const LanguageOption = ({ flag, code, name, isSelected, onSelect }: any) => (
    <TouchableOpacity
      onPress={onSelect}
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: 16,
        paddingHorizontal: 24,
        borderBottomWidth: 1,
        borderBottomColor: "#2C2C2E",
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Text style={{ fontSize: 32, marginRight: 16 }}>{flag}</Text>
        <Text
          style={{
            fontSize: 17,
            fontFamily: FONT.Regular,
            color: "#FFFFFF",
          }}
        >
          {name}
        </Text>
      </View>
      <View
        style={{
          width: 24,
          height: 24,
          borderRadius: 12,
          borderWidth: 2,
          borderColor: isSelected ? "#FCCD34" : "#8E8E93",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {isSelected && (
          <View
            style={{
              width: 12,
              height: 12,
              borderRadius: 6,
              backgroundColor: "#FCCD34",
            }}
          />
        )}
      </View>
    </TouchableOpacity>
  );

  const handleLanguageSelect = (language: string) => {
    setSelectedLanguage(language);
    setIsLanguageModalVisible(false);
  };

  // When loading show spinner in center
  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-black">
        <StatusBar barStyle="light-content" />
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator color="#FCCD34" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-black">
      <StatusBar barStyle="light-content" />
      <ScrollView className="flex-1">
        {/* Profile Header */}
        <View
          style={{
            width: 375,
            height: 65,
            marginTop: 10,
            paddingHorizontal: 20,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <View
            style={{
              width: 70,
              height: 70,
              borderRadius: 35,
              overflow: "hidden",
              marginRight: 16,
              backgroundColor: "#2C2C2E",
            }}
          >
            {avatarUrl ? (
              <Image
                source={{ uri: avatarUrl }}
                style={{ width: 70, height: 70 }}
                resizeMode="cover"
              />
            ) : (
              <Image
                source={require("../../../assets/images/profile-placeholder.png")}
                style={{ width: 70, height: 70 }}
                resizeMode="cover"
              />
            )}
          </View>
          <Text
            className="text-white"
            style={{
              fontSize: 24,
              fontFamily: FONT.SemiBold,
            }}
          >
            {userName ?? "User"}
          </Text>
        </View>

        {/* Balance Card */}
        <View
          className="flex-row items-center justify-between px-4"
          style={{
            width: 350,
            height: 69,
            marginLeft: 21,
            marginTop: 20,
            borderRadius: 15,
            borderWidth: 0.3,
            borderColor: "#FCCD34",
            backgroundColor: "rgba(28, 28, 30, 0.8)",
          }}
        >
          <View>
            <Text
              className="text-gray-400"
              style={{
                fontFamily: FONT.Regular,
                fontWeight: "400",
                fontSize: 12,
                lineHeight: 12,
                marginBottom: 4,
                color: "#C7C7CC",
              }}
            >
              Balance:
            </Text>
            <Text
              className="text-white font-bold"
              style={{ fontSize: 18, fontFamily: FONT.SemiBold }}
            >
              {balance !== null ? `${balance} GEL` : "0"}
            </Text>
          </View>
          <TouchableOpacity
            className="bg-[#FCCD34] items-center justify-center"
            onPress={() => router.push("/(tabs)/profile/addFunds")}
            style={{
              width: 92,
              height: 29,
              borderRadius: 10,
            }}
          >
            <Text className="text-black font-semibold" style={{ fontSize: 13 }}>
              + Add funds
            </Text>
          </TouchableOpacity>
        </View>

        {/* Tabs */}
        <View
          style={{
            width: 331,
            height: 39,
            marginTop: 15,
            marginLeft: 21,
            flexDirection: "row",
            borderRadius: 15,
            padding: 3.88,
            backgroundColor: "#1C1C1E",
          }}
        >
          <TouchableOpacity
            className="bg-[#FCCD34] items-center justify-center"
            style={{
              width: 144,
              height: 31.246444702148438,
              borderRadius: 15,
              paddingHorizontal: 7.75,
            }}
          >
            <Text
              className="text-black"
              style={{
                fontSize: 16,
                fontFamily: FONT.Regular,
              }}
            >
              Settings
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="items-center justify-center flex-1"
            style={{
              paddingHorizontal: 7.75,
            }}
            onPress={() => {
              /* keep for gallery navigation if needed */
            }}
          >
            <Text
              className="text-gray-400"
              style={{
                fontSize: 16,
                fontFamily: FONT.Regular,
              }}
            >
              Gallery
            </Text>
          </TouchableOpacity>
        </View>

        {/* Menu Items */}
        <View
          style={{
            width: 330,
            marginTop: 15,
            marginLeft: 24,
            paddingBottom: 100,
          }}
        >
          <MenuItem
            icon={Settings}
            title="Account settings"
            onPress={() => router.push("/(tabs)/profile/account-settings")}
          />
          <MenuItem
            icon={ShieldCheck}
            title="Security settings"
            onPress={() => router.push("/(tabs)/profile/security-settings")}
          />
          <MenuItem
            icon={Bell}
            title="Notification settings"
            onPress={() => router.push("/(tabs)/profile/notificationSettings")}
          />
          <MenuItem
            icon={Star}
            title="Join as Star"
            onPress={() =>
              Linking.openURL("https://alohastars.io/join-as-start")
            }
          />
          <MenuItem
            icon={CreditCard}
            title="Payment settings"
            onPress={() => router.push("/(tabs)/profile/payment")}
          />
          <MenuItem
            icon={HelpCircle}
            title="Contact support"
            onPress={() => router.push("/(tabs)/profile/contact-support")}
          />
          <MenuItem
            icon={ShieldCheck}
            title="Email verification"
            rightText="Unverified"
            onPress={() => router.push("/(tabs)/profile/verification")}
          />
          <MenuItem
            icon={Globe}
            title="Language"
            rightText={selectedLanguage}
            onPress={() => setIsLanguageModalVisible(true)}
          />
        </View>
      </ScrollView>

      {/* Language Selection Modal */}
      <Modal
        visible={isLanguageModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsLanguageModalVisible(false)}
      >
        <TouchableOpacity
          style={{
            flex: 1,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            justifyContent: "flex-end",
          }}
          activeOpacity={1}
          onPress={() => setIsLanguageModalVisible(false)}
        >
          <TouchableOpacity
            activeOpacity={1}
            style={{
              backgroundColor: "#1C1C1E",
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              paddingBottom: 34,
            }}
          >
            {/* Handle Bar */}
            <View
              style={{
                width: 36,
                height: 5,
                backgroundColor: "#48484A",
                borderRadius: 2.5,
                alignSelf: "center",
                marginTop: 12,
                marginBottom: 20,
              }}
            />

            {/* Title */}
            <Text
              style={{
                fontSize: 17,
                fontFamily: FONT.SemiBold,
                color: "#FFFFFF",
                textAlign: "center",
                marginBottom: 24,
              }}
            >
              Choose Language
            </Text>

            {/* Language Options */}
            <LanguageOption
              flag="🇬🇪"
              code="geo"
              name="Geo"
              isSelected={selectedLanguage === "Georgian"}
              onSelect={() => handleLanguageSelect("Georgian")}
            />
            <LanguageOption
              flag="🇬🇧"
              code="eng"
              name="Eng"
              isSelected={selectedLanguage === "English"}
              onSelect={() => handleLanguageSelect("English")}
            />
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
};

export default ProfileScreen;
