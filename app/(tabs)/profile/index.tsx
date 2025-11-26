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
  Alert,
  Pressable,
  TouchableWithoutFeedback,
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
  Plus,
  X,
  ChevronLeft,
} from "lucide-react-native";
import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
} from "@expo-google-fonts/poppins";
import { router } from "expo-router";
import * as ImagePicker from "expo-image-picker";

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

interface PhotoSlot {
  id: number;
  uri: string | null;
  size: "large" | "medium" | "small";
}

const ProfileScreen = () => {
  // local state driven from logged-in user
  const [userName, setUserName] = useState<string | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [balance, setBalance] = useState<number | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState("English");
  const [isLanguageModalVisible, setIsLanguageModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);

  // Gallery states
  const [galleryVisible, setGalleryVisible] = useState(false);
  const [photos, setPhotos] = useState<PhotoSlot[]>([
    { id: 1, uri: null, size: "large" },
    { id: 2, uri: null, size: "medium" },
    { id: 3, uri: null, size: "medium" },
    { id: 4, uri: null, size: "small" },
    { id: 5, uri: null, size: "small" },
    { id: 6, uri: null, size: "small" },
  ]);
  const [selectedPhoto, setSelectedPhoto] = useState<PhotoSlot | null>(null);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);

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

  // Photo functions
  const pickImage = async (id: number) => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    // Some SDKs return { granted }, others return { status: 'granted' }
    const granted =
      (permission as any).granted === true ||
      (permission as any).status === "granted";

    if (!granted) {
      Alert.alert(
        "Permission Required",
        "Please grant access to your photo library"
      );
      return;
    }

    // compatibility: prefer MediaType, fallback to MediaTypeOptions, otherwise omit key
    const mediaTypes =
      (ImagePicker as any).MediaType?.Images ??
      (ImagePicker as any).MediaTypeOptions?.Images ??
      (ImagePicker as any).MediaTypeOptions?.All ??
      (ImagePicker as any).MediaType?.All ??
      undefined;

    const launchOptions: any = {
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    };
    if (mediaTypes) launchOptions.mediaTypes = mediaTypes;

    const result = await ImagePicker.launchImageLibraryAsync(launchOptions);

    // handle both shapes: new `{ canceled, assets }` and older `{ cancelled, uri }`
    if (!result.canceled && (result as any).assets?.length) {
      const uri = (result as any).assets[0].uri;
      setPhotos((p) =>
        p.map((photo) => (photo.id === id ? { ...photo, uri } : photo))
      );
      return;
    }

    // older SDK support: result.cancelled + result.uri
    if ((result as any).cancelled === false && (result as any).uri) {
      const uri = (result as any).uri;
      setPhotos((p) =>
        p.map((photo) => (photo.id === id ? { ...photo, uri } : photo))
      );
    }
  };

  const handlePhotoPress = (photo: PhotoSlot) => {
    if (photo.uri) {
      setSelectedPhoto(photo);
    } else {
      pickImage(photo.id);
    }
  };

  const handleDeletePress = (photo: PhotoSlot) => {
    setSelectedPhoto(photo);
    setDeleteModalVisible(true);
  };

  const confirmDelete = () => {
    if (selectedPhoto) {
      setPhotos((p) =>
        p.map((photo) =>
          photo.id === selectedPhoto.id ? { ...photo, uri: null } : photo
        )
      );
      setDeleteModalVisible(false);
      setSelectedPhoto(null);
    }
  };

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
            onPress={() => setGalleryVisible(true)}
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

      {/* Gallery Modal */}
      <Modal visible={galleryVisible} animationType="slide">
        <SafeAreaView className="flex-1 bg-black">
          <StatusBar barStyle="light-content" />

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
            {/* Back Arrow */}
            <TouchableOpacity
              style={{ position: "absolute", left: 20 }}
              onPress={() => router.back()}
            >
              <ChevronLeft size={24} color="#fff" />
            </TouchableOpacity>

            {/* Title */}
            <Text
              style={{
                fontSize: 20,
                fontFamily: FONT.SemiBold,
                color: "#FFF",
              }}
            >
              {userName ?? "User"}
            </Text>
          </View>

          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 20 }}
          >
            {/* Large Photo Grid */}
            <View
              style={{ flexDirection: "row", marginBottom: 12, height: 360 }}
            >
              {/* Large Photo Slot */}
              <View style={{ flex: 1.4, marginRight: 12 }}>
                <Pressable
                  style={{ flex: 1 }}
                  onPress={() => handlePhotoPress(photos[0])}
                >
                  {photos[0].uri ? (
                    <View
                      style={{
                        width: "100%",
                        height: "100%",
                        position: "relative",
                      }}
                    >
                      <Image
                        source={{ uri: photos[0].uri }}
                        style={{
                          width: "100%",
                          height: "100%",
                          borderRadius: 24,
                        }}
                        resizeMode="cover"
                      />
                      <Pressable
                        hitSlop={8}
                        onPressIn={(e) => {
                          // stop parent Pressable from also handling this touch
                          e.stopPropagation?.();
                          handleDeletePress(photos[0]);
                        }}
                        style={{
                          position: "absolute",
                          top: 8,
                          right: 8,
                          width: 32,
                          height: 32,
                          backgroundColor: "rgba(0,0,0,0.6)",
                          borderRadius: 16,
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <X size={20} color="#fff" />
                      </Pressable>
                    </View>
                  ) : (
                    <View
                      style={{
                        width: "100%",
                        height: "100%",
                        borderWidth: 2,
                        borderStyle: "dashed",
                        borderColor: "#FCCD34",
                        borderRadius: 24,
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: "rgba(252, 205, 52, 0.05)",
                      }}
                    >
                      <View
                        style={{
                          width: 64,
                          height: 64,
                          backgroundColor: "#FCCD34",
                          borderRadius: 32,
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Plus size={32} color="#000" strokeWidth={3} />
                      </View>
                    </View>
                  )}
                </Pressable>
              </View>

              {/* Medium Photo Slots */}
              <View style={{ flex: 1 }}>
                <Pressable
                  style={{ marginBottom: 12, flex: 1 }}
                  onPress={() => handlePhotoPress(photos[1])}
                >
                  {photos[1].uri ? (
                    <View
                      style={{
                        width: "100%",
                        height: "100%",
                        position: "relative",
                      }}
                    >
                      <Image
                        source={{ uri: photos[1].uri }}
                        style={{
                          width: "100%",
                          height: "100%",
                          borderRadius: 24,
                        }}
                        resizeMode="cover"
                      />
                      <Pressable
                        hitSlop={8}
                        onPressIn={(e) => {
                          e.stopPropagation?.();
                          handleDeletePress(photos[1]);
                        }}
                        style={{
                          position: "absolute",
                          top: 8,
                          right: 8,
                          width: 32,
                          height: 32,
                          backgroundColor: "rgba(0,0,0,0.6)",
                          borderRadius: 16,
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <X size={20} color="#fff" />
                      </Pressable>
                    </View>
                  ) : (
                    <View
                      style={{
                        width: "100%",
                        height: "100%",
                        borderWidth: 2,
                        borderStyle: "dashed",
                        borderColor: "#FCCD34",
                        borderRadius: 24,
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: "rgba(252, 205, 52, 0.05)",
                      }}
                    >
                      <View
                        style={{
                          width: 48,
                          height: 48,
                          backgroundColor: "#FCCD34",
                          borderRadius: 24,
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Plus size={24} color="#000" strokeWidth={3} />
                      </View>
                    </View>
                  )}
                </Pressable>

                <Pressable
                  style={{ flex: 1 }}
                  onPress={() => handlePhotoPress(photos[2])}
                >
                  {photos[2].uri ? (
                    <View
                      style={{
                        width: "100%",
                        height: "100%",
                        position: "relative",
                      }}
                    >
                      <Image
                        source={{ uri: photos[2].uri }}
                        style={{
                          width: "100%",
                          height: "100%",
                          borderRadius: 24,
                        }}
                        resizeMode="cover"
                      />
                      <Pressable
                        hitSlop={8}
                        onPressIn={(e) => {
                          e.stopPropagation?.();
                          handleDeletePress(photos[2]);
                        }}
                        style={{
                          position: "absolute",
                          top: 8,
                          right: 8,
                          width: 32,
                          height: 32,
                          backgroundColor: "rgba(0,0,0,0.6)",
                          borderRadius: 16,
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <X size={20} color="#fff" />
                      </Pressable>
                    </View>
                  ) : (
                    <View
                      style={{
                        width: "100%",
                        height: "100%",
                        borderWidth: 2,
                        borderStyle: "dashed",
                        borderColor: "#FCCD34",
                        borderRadius: 24,
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: "rgba(252, 205, 52, 0.05)",
                      }}
                    >
                      <View
                        style={{
                          width: 48,
                          height: 48,
                          backgroundColor: "#FCCD34",
                          borderRadius: 24,
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Plus size={24} color="#000" strokeWidth={3} />
                      </View>
                    </View>
                  )}
                </Pressable>
              </View>
            </View>

            {/* Small Photo Slots Row */}
            <View
              style={{ flexDirection: "row", height: 170, marginBottom: 20 }}
            >
              {[3, 4, 5].map((index) => (
                <Pressable
                  key={index}
                  style={{ flex: 1, marginHorizontal: 6 }}
                  onPress={() => handlePhotoPress(photos[index])}
                >
                  {photos[index].uri ? (
                    <View
                      style={{
                        width: "100%",
                        height: "100%",
                        position: "relative",
                      }}
                    >
                      <Image
                        source={{ uri: photos[index].uri }}
                        style={{
                          width: "100%",
                          height: "100%",
                          borderRadius: 24,
                        }}
                        resizeMode="cover"
                      />
                      <Pressable
                        hitSlop={8}
                        onPressIn={(e) => {
                          e.stopPropagation?.();
                          handleDeletePress(photos[index]);
                        }}
                        style={{
                          position: "absolute",
                          top: 8,
                          right: 8,
                          width: 32,
                          height: 32,
                          backgroundColor: "rgba(0,0,0,0.6)",
                          borderRadius: 16,
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <X size={20} color="#fff" />
                      </Pressable>
                    </View>
                  ) : (
                    <View
                      style={{
                        width: "100%",
                        height: "100%",
                        borderWidth: 2,
                        borderStyle: "dashed",
                        borderColor: "#FCCD34",
                        borderRadius: 24,
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: "rgba(252, 205, 52, 0.05)",
                      }}
                    >
                      <View
                        style={{
                          width: 48,
                          height: 48,
                          backgroundColor: "#FCCD34",
                          borderRadius: 24,
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Plus size={24} color="#000" strokeWidth={3} />
                      </View>
                    </View>
                  )}
                </Pressable>
              ))}
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        visible={deleteModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setDeleteModalVisible(false)}
      >
        {/* Tapping outside should close modal */}
        <TouchableWithoutFeedback onPress={() => setDeleteModalVisible(false)}>
          <View
            style={{
              flex: 1,
              backgroundColor: "rgba(0, 0, 0, 0.85)",
              justifyContent: "flex-end",
            }}
          >
            {/* Prevent taps inside dialog from closing modal */}
            <TouchableWithoutFeedback>
              <View
                style={{
                  paddingBottom: 40,
                  paddingHorizontal: 40,
                }}
              >
                {/* Selected Photo Preview */}
                {selectedPhoto?.uri && (
                  <View
                    style={{
                      width: "100%",
                      height: 500,
                      marginBottom: 20,
                      borderRadius: 24,
                      overflow: "hidden",
                    }}
                  >
                    <Image
                      source={{ uri: selectedPhoto.uri }}
                      style={{ width: "100%", height: "100%" }}
                      resizeMode="cover"
                    />
                  </View>
                )}

                {/* Delete Button */}
                <TouchableOpacity
                  onPress={confirmDelete}
                  style={{
                    backgroundColor: "#2C2C2E",
                    paddingVertical: 18,
                    borderRadius: 14,
                    marginBottom: 12,
                  }}
                >
                  <Text
                    style={{
                      color: "#FFF",
                      fontSize: 18,
                      fontFamily: FONT.SemiBold,
                      textAlign: "center",
                    }}
                  >
                    Delete
                  </Text>
                </TouchableOpacity>

                {/* Cancel Button */}
                <TouchableOpacity
                  onPress={() => setDeleteModalVisible(false)}
                  style={{
                    backgroundColor: "#2C2C2E",
                    paddingVertical: 18,
                    borderRadius: 14,
                  }}
                >
                  <Text
                    style={{
                      color: "#FFF",
                      fontSize: 18,
                      fontFamily: FONT.SemiBold,
                      textAlign: "center",
                    }}
                  >
                    Cancel
                  </Text>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </SafeAreaView>
  );
};

export default ProfileScreen;
