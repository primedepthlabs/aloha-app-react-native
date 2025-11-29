import React, { useState, useRef, useEffect } from "react";
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
  Modal,
  FlatList,
  Dimensions,
  Keyboard,
  Alert,
  KeyboardAvoidingView, // ✅ ADDED
  Platform, // ✅ ADDED
} from "react-native";
import {
  ChevronLeft,
  ChevronDown,
  ChevronUp,
  Search,
  Plus,
} from "lucide-react-native";
import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
} from "@expo-google-fonts/poppins";
import { router, useLocalSearchParams } from "expo-router";

const { width } = Dimensions.get("window");

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
  const params = useLocalSearchParams();

  const [showChat, setShowChat] = useState(false);
  const [expandedQuestion, setExpandedQuestion] = useState<string | null>("q1");
  const [searchQuery, setSearchQuery] = useState("");
  const [messageInput, setMessageInput] = useState("");
  const [showGallery, setShowGallery] = useState(false);
  const [selectedImages, setSelectedImages] = useState<number[]>([]);
  const [showCamera, setShowCamera] = useState(false);
  const [showPhotoPreview, setShowPhotoPreview] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [selectedTab, setSelectedTab] = useState<"photos" | "videos">("photos");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hi, how can we help?",
      timestamp: "2:00",
      isSent: false,
    },
  ]);

  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    if (params.chat === "true") {
      setShowChat(true); // instantly open chat UI
    }
  }, [params]);

  if (!fontsLoaded) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "black",
        }}
      >
        <ActivityIndicator color="#FCCD34" />
      </View>
    );
  }

  const faqData = [
    {
      id: "q1",
      question: "How to add my IBAN?",
      answer:
        'Go to Dashboard, "Payout method rules", tap "Add Card" or "Change Bank Account", enter your Details, then Save.',
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
        "Visit Dashboard > Paid Messaging settings to set your message prices.",
    },
    {
      id: "q4",
      question: "How to make my profile visible?",
      answer:
        "Go to Profile Settings > Profile Visibility to modify your visibility options.",
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

  const toggleImageSelection = (index: number) => {
    if (selectedImages.includes(index)) {
      setSelectedImages(selectedImages.filter((i) => i !== index));
    } else {
      setSelectedImages([...selectedImages, index]);
    }
  };

  const handleCameraCapture = () => {
    const capturedImage =
      "https://images.unsplash.com/photo-1606115915090-be18fea23ec7?w=400";
    setPreviewImage(capturedImage);
    setShowCamera(false);
    setShowPhotoPreview(true);
  };

  const galleryImages = [
    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400",
    "https://images.unsplash.com/photo-1551817958-fa1f5d8d26d2?w=400",
    "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400",
    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400",
    "https://images.unsplash.com/photo-1551817958-fa1f5d8d26d2?w=400",
    "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400",
    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400",
    "https://images.unsplash.com/photo-1551817958-fa1f5d8d26d2?w=400",
    "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400",
  ];

  /* --------------------------- CHAT SCREEN --------------------------- */
  if (showChat) {
    return (
      <KeyboardAvoidingView
        style={{ flex: 1, backgroundColor: "black" }}
        behavior={Platform.OS === "ios" ? "padding" : undefined} // ✅ KEYBOARD HANDLING
        keyboardVerticalOffset={0}
      >
        <SafeAreaView style={{ flex: 1, backgroundColor: "black" }}>
          <StatusBar barStyle="light-content" />

          {/* Chat Header */}
          <View
            style={{
              height: 60,
              flexDirection: "row",
              alignItems: "center",
              paddingHorizontal: 20,
              position: "relative",
            }}
          >
            <TouchableOpacity
              onPress={() => router.push("/(tabs)/chats")}
              style={{
                width: 40,
                height: 40,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <ChevronLeft size={26} color="#FFFFFF" strokeWidth={2} />
            </TouchableOpacity>

            <View
              style={{
                flex: 1,
                flexDirection: "row",
                alignItems: "center",
                marginLeft: 8,
              }}
            >
              <Image
                source={require("../../../assets/images/dashboard/support-avatar.png")}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  marginRight: 12,
                }}
                resizeMode="cover"
              />
              <Text
                style={{
                  fontSize: 15,
                  fontFamily: FONT.SemiBold,
                  color: "#FFFFFF",
                }}
              >
                Support
              </Text>
            </View>

            <TouchableOpacity
              style={{
                width: 40,
                height: 40,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Search size={24} color="#FFFFFF" strokeWidth={2} />
            </TouchableOpacity>
          </View>

          {/* Chat Background */}
          <ImageBackground
            source={require("../../../assets/images/chat-background.png")}
            style={{ flex: 1 }}
            resizeMode="cover"
          >
            <ScrollView
              ref={scrollViewRef}
              style={{ flex: 1, paddingHorizontal: 16, paddingTop: 16 }}
              contentContainerStyle={{ paddingBottom: 20 }}
              keyboardShouldPersistTaps="handled"
              onContentSizeChange={() =>
                scrollViewRef.current?.scrollToEnd({ animated: true })
              }
            >
              {messages.map((msg) => (
                <View
                  key={msg.id}
                  style={{
                    alignSelf: msg.isSent ? "flex-end" : "flex-start",
                    maxWidth: "80%",
                    marginBottom: 12,
                  }}
                >
                  <View
                    style={{
                      backgroundColor: msg.isSent ? "#B99F4A" : "#2D2D2F",
                      borderRadius: 16,
                      padding: 12,
                      paddingHorizontal: 16,
                    }}
                  >
                    <Text
                      style={{
                        color: "white",
                        fontSize: 15,
                        fontFamily: FONT.Regular,
                        lineHeight: 20,
                      }}
                    >
                      {msg.text}
                    </Text>

                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "flex-end",
                        alignItems: "center",
                        marginTop: 4,
                        gap: 4,
                      }}
                    >
                      {msg.isEdited && (
                        <Text
                          style={{
                            color: "rgba(255,255,255,0.5)",
                            fontSize: 11,
                            fontFamily: FONT.Regular,
                          }}
                        >
                          Edited
                        </Text>
                      )}
                      <Text
                        style={{
                          color: "rgba(255,255,255,0.5)",
                          fontSize: 11,
                          fontFamily: FONT.Regular,
                        }}
                      >
                        {msg.timestamp}
                      </Text>

                      {msg.isSent && (
                        <Image
                          source={require("../../../assets/images/dashboard/double-tick.png")}
                          style={{ width: 16, height: 12, marginLeft: 2 }}
                          resizeMode="contain"
                        />
                      )}
                    </View>
                  </View>
                </View>
              ))}
            </ScrollView>
          </ImageBackground>

          {/* Bottom Chat Input */}
          <View
            style={{
              backgroundColor: "#000000",
              paddingHorizontal: 16,
              paddingBottom: 50, // 🔁 can be smaller since KAV moves it
              paddingTop: 12,
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "flex-end" }}>
              {/* Plus Button */}
              <TouchableOpacity
                style={{
                  width: 28,
                  height: 28,
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: 12,
                  marginBottom: 10,
                }}
                onPress={() => {
                  Keyboard.dismiss();
                  setShowGallery(true);
                }}
              >
                <Plus size={28} color="#FCCD34" />
              </TouchableOpacity>

              {/* Input Container */}
              <View style={{ flex: 1 }}>
                <View
                  style={{
                    minHeight: 48,
                    maxHeight: 120,
                    borderRadius: 24,
                    borderWidth: 1,
                    borderColor: "#3A3A3A",
                    backgroundColor: "#19191B",
                    paddingHorizontal: 16,
                    paddingVertical: 12,
                    flexDirection: "row",
                    alignItems: "flex-end",
                  }}
                >
                  {/* Text Input */}
                  <TextInput
                    style={{
                      flex: 1,
                      fontSize: 15,
                      fontFamily: FONT.Regular,
                      color: "#FFFFFF",
                      paddingTop: 2,
                      paddingBottom: 2,
                      maxHeight: 96,
                    }}
                    placeholder="Type your message"
                    placeholderTextColor="#6B7280"
                    value={messageInput}
                    onChangeText={setMessageInput}
                    multiline
                    blurOnSubmit={false}
                    returnKeyType="default"
                    enablesReturnKeyAutomatically={false}
                  />

                  {/* Send Button */}
                  <TouchableOpacity
                    onPress={handleSendMessage}
                    disabled={messageInput.trim() === ""}
                    style={{
                      width: 41,
                      height: 27,
                      borderRadius: 16,
                      backgroundColor:
                        messageInput.trim() === "" ? "#555" : "#FCCD34",
                      alignItems: "center",
                      justifyContent: "center",
                      marginLeft: 8,
                    }}
                  >
                    <Image
                      source={require("../../../assets/images/dashboard/send-icon.png")}
                      style={{ width: 16, height: 16, resizeMode: "contain" }}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>

          {/* Gallery Modal */}
          <Modal
            visible={showGallery}
            animationType="slide"
            transparent={true}
            onRequestClose={() => setShowGallery(false)}
          >
            <View className="flex-1 bg-black/50 justify-end">
              <View
                className="bg-[#0A0A0A]"
                style={{
                  height: 549,
                  borderTopLeftRadius: 15,
                  borderTopRightRadius: 15,
                  overflow: "hidden",
                }}
              >
                {/* Header */}
                <View className="pt-6 px-5 pb-3 flex-row items-center justify-between">
                  <View className="flex-row items-center border border-[#333333] rounded-full p-[2px]">
                    <TouchableOpacity className="px-5 py-2 rounded-full bg-[#FCCD34]">
                      <Text
                        className="text-black text-[14px]"
                        style={{ fontFamily: FONT.SemiBold }}
                      >
                        Photos
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity className="px-5 py-2 rounded-full bg-transparent">
                      <Text
                        className="text-white text-[14px]"
                        style={{ fontFamily: FONT.Medium }}
                      >
                        Albums
                      </Text>
                    </TouchableOpacity>
                  </View>

                  <TouchableOpacity onPress={() => setShowGallery(false)}>
                    <Text
                      className="text-[#FCCD34] text-[15px]"
                      style={{ fontFamily: FONT.SemiBold }}
                    >
                      Close
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* Access Notice */}
                <Text
                  className="text-gray-400 text-center mb-1"
                  style={{ fontFamily: FONT.Regular, fontSize: 13 }}
                >
                  You have limited Aloha from accessing your photos
                </Text>
                <TouchableOpacity className="self-center mb-3">
                  <Text
                    className="text-[#FCCD34]"
                    style={{ fontFamily: FONT.Medium, fontSize: 13 }}
                  >
                    Manage
                  </Text>
                </TouchableOpacity>

                {/* Gallery Grid */}
                <FlatList
                  data={["camera", ...galleryImages]}
                  numColumns={3}
                  keyExtractor={(item, index) => index.toString()}
                  contentContainerStyle={{ padding: 2 }}
                  renderItem={({ item, index }) => {
                    if (item === "camera") {
                      return (
                        <TouchableOpacity
                          className="w-[33.33%] p-[1px]"
                          onPress={() => {
                            setShowGallery(false);
                            setShowCamera(true);
                          }}
                        >
                          <View className="bg-[#1A1A1A] items-center justify-center aspect-square">
                            <Image
                              source={require("../../../assets/images/camera-icon.png")}
                              style={{
                                width: 36,
                                height: 36,
                                tintColor: "#FFFFFF",
                              }}
                            />
                          </View>
                        </TouchableOpacity>
                      );
                    }

                    const isSelected = selectedImages.includes(index - 1);

                    return (
                      <TouchableOpacity
                        className="w-[33.33%] p-[1px]"
                        onPress={() => toggleImageSelection(index - 1)}
                      >
                        <View className="relative">
                          <Image
                            source={{ uri: item }}
                            style={{ width: "100%", aspectRatio: 1 }}
                          />
                          <View
                            className={`absolute top-2 right-2 w-6 h-6 rounded-full border-2 ${
                              isSelected
                                ? "bg-[#FCCD34] border-[#FCCD34]"
                                : "border-white"
                            } items-center justify-center`}
                          >
                            {isSelected && (
                              <Text
                                className="text-black text-[11px]"
                                style={{ fontFamily: FONT.Bold }}
                              >
                                {selectedImages.indexOf(index - 1) + 1}
                              </Text>
                            )}
                          </View>
                        </View>
                      </TouchableOpacity>
                    );
                  }}
                />

                {/* Bottom Tabs */}
                <View className="bg-[#0A0A0A] border-t border-[#1A1A1A] px-5 py-4 flex-row items-center justify-around">
                  <View className="flex-1 items-center py-3">
                    <Image
                      source={require("../../../assets/images/gallery.png")}
                      style={{ width: 28, height: 28, resizeMode: "contain" }}
                    />
                    <Text
                      className="text-[#FCCD34] text-[11px] mt-1"
                      style={{ fontFamily: FONT.SemiBold }}
                    >
                      Gallery
                    </Text>
                  </View>

                  <TouchableOpacity className="flex-1 items-center py-3">
                    <Image
                      source={require("../../../assets/images/file-icon.png")}
                      style={{ width: 26, height: 26, resizeMode: "contain" }}
                    />
                    <Text
                      className="text-[#6B7280] text-[11px] mt-1"
                      style={{ fontFamily: FONT.Medium }}
                    >
                      File
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>

          {/* Camera Modal */}
          <Modal
            visible={showCamera}
            animationType="slide"
            onRequestClose={() => setShowCamera(false)}
            statusBarTranslucent
          >
            <StatusBar barStyle="light-content" />
            <View className="flex-1 bg-[#7B8A9E]">
              {/* Close Button - Top Right */}
              <View
                className="absolute z-10"
                style={{
                  top: 50,
                  right: 20,
                }}
              >
                <TouchableOpacity
                  className="w-10 h-10 items-center justify-center rounded-lg"
                  onPress={() => setShowCamera(false)}
                  style={{
                    backgroundColor: "rgba(25, 25, 27, 0.5)",
                  }}
                >
                  <Image
                    source={require("../../../assets/images/white-cross.png")}
                    className="w-5 h-5"
                    resizeMode="contain"
                  />
                </TouchableOpacity>
              </View>

              {/* Camera View Area */}
              <View className="flex-1 items-center justify-center">
                <Text className="text-white/40 text-xl">Camera View</Text>
              </View>

              {/* Bottom Section with Dark Overlay */}
              <View
                className="absolute left-0 right-0 bottom-0"
                style={{
                  backgroundColor: "rgba(42, 52, 66, 0.95)",
                  paddingBottom: 40,
                }}
              >
                {/* Gallery Thumbnails Row */}
                <View className="px-5 pt-5 pb-4">
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{
                      alignItems: "center",
                      gap: 12,
                    }}
                  >
                    {galleryImages.map((img, idx) => (
                      <TouchableOpacity
                        key={idx}
                        onPress={() => {
                          setPreviewImage(img);
                          setShowCamera(false);
                          setShowPhotoPreview(true);
                        }}
                        style={{
                          width: 70,
                          height: 70,
                          borderRadius: 12,
                          borderWidth: 2,
                          borderColor: "rgba(255, 255, 255, 0.2)",
                          overflow: "hidden",
                        }}
                      >
                        <Image
                          source={{ uri: img }}
                          style={{
                            width: "100%",
                            height: "100%",
                          }}
                          resizeMode="cover"
                        />
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>

                {/* Yellow Capture Button - Centered */}
                <View className="items-center py-5">
                  <TouchableOpacity
                    onPress={handleCameraCapture}
                    style={{
                      width: 70,
                      height: 70,
                      borderRadius: 35,
                      backgroundColor: "#FCCD34",
                    }}
                  />
                </View>

                {/* Bottom Icons and Tabs Row */}
                <View className="flex-row items-center justify-between px-8 pb-2">
                  {/* Left Icon - Gallery */}
                  <TouchableOpacity className="items-center w-16">
                    <Image
                      source={require("../../../assets/images/gallery-camera.png")}
                      className="w-8 h-8"
                      resizeMode="contain"
                      style={{ tintColor: "white" }}
                    />
                  </TouchableOpacity>

                  {/* Center - Photos/Videos Tabs */}
                  <View className="flex-row items-center gap-12">
                    <TouchableOpacity
                      onPress={() => setSelectedTab("photos")}
                      className="items-center"
                    >
                      <Text
                        className={`text-base font-semibold ${
                          selectedTab === "photos"
                            ? "text-white"
                            : "text-white/50"
                        }`}
                      >
                        Photos
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => setSelectedTab("videos")}
                      className="items-center"
                    >
                      <Text
                        className={`text-base font-semibold ${
                          selectedTab === "videos"
                            ? "text-[#FCCD34]"
                            : "text-white/50"
                        }`}
                      >
                        Videos
                      </Text>
                    </TouchableOpacity>
                  </View>

                  {/* Right Icon - Camera Flip */}
                  <TouchableOpacity className="items-center w-16">
                    <Image
                      source={require("../../../assets/images/camera.png")}
                      className="w-8 h-8"
                      resizeMode="contain"
                      style={{ tintColor: "white" }}
                    />
                  </TouchableOpacity>
                </View>

                {/* Bottom Home Indicator */}
                <View className="items-center pt-3">
                  <View
                    className="bg-white/80 rounded-full"
                    style={{
                      width: 134,
                      height: 5,
                    }}
                  />
                </View>
              </View>
            </View>
          </Modal>

          {/* Photo Preview Modal */}
          <Modal
            visible={showPhotoPreview}
            animationType="fade"
            onRequestClose={() => setShowPhotoPreview(false)}
          >
            <View className="flex-1 bg-black">
              <View className="absolute top-12 left-0 right-0 px-5 z-10 flex-row justify-between">
                <TouchableOpacity
                  className="bg-[#2A2A2A] w-10 h-10 rounded-full items-center justify-center"
                  onPress={() => setShowPhotoPreview(false)}
                >
                  <Text className="text-white text-[20px]">✕</Text>
                </TouchableOpacity>
              </View>

              <View className="flex-1 items-center justify-center">
                <Image
                  source={{ uri: previewImage }}
                  style={{
                    width: width - 40,
                    height: width - 40,
                    borderRadius: 12,
                  }}
                  resizeMode="cover"
                />
              </View>

              <View className="absolute bottom-0 left-0 right-0 pb-10 px-5">
                <TouchableOpacity
                  className="bg-[#FCCD34] h-14 rounded-full items-center justify-center"
                  onPress={() => {
                    setShowPhotoPreview(false);
                    Alert.alert("Success", "Photo sent!");
                  }}
                >
                  <Text
                    className="text-black text-[16px]"
                    style={{ fontFamily: FONT.SemiBold }}
                  >
                    Send Photo
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </SafeAreaView>
      </KeyboardAvoidingView>
    );
  }

  /* -------------------------- FAQ MAIN SCREEN ------------------------ */

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "black" }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={0}
    >
      <SafeAreaView style={{ flex: 1, backgroundColor: "black" }}>
        <StatusBar barStyle="light-content" />

        {/* Header */}
        <View
          style={{
            height: 40,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            paddingHorizontal: 20,
            position: "relative",
          }}
        >
          <TouchableOpacity
            onPress={() => router.push("/(tabs)/chats")}
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
            Support
          </Text>
        </View>

        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 30 }}
          keyboardShouldPersistTaps="handled"
        >
          {/* How can we help? */}
          <Text
            style={{
              fontSize: 18,
              fontFamily: FONT.Medium,
              color: "#FFFFFF",
              marginBottom: 10,
            }}
          >
            How can we help you?
          </Text>

          {/* Search Bar */}
          <View
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
            <TextInput
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
          </View>

          {/* Contact support card */}
          <TouchableOpacity
            onPress={() => setShowChat(true)}
            style={{
              width: 332,
              height: 145,
              borderRadius: 15,
              marginBottom: 10,
              alignSelf: "center",
              overflow: "hidden",
            }}
          >
            <Image
              source={require("../../../assets/images/dashboard/support-specialist.png")}
              style={{ width: "100%", height: "100%" }}
              resizeMode="cover"
            />
          </TouchableOpacity>

          {/* Top FAQs */}
          <Text
            style={{
              fontSize: 18,
              fontFamily: FONT.Medium,
              color: "#FFFFFF",
              marginBottom: 10,
            }}
          >
            Top questions
          </Text>

          {faqData.map((faq) => (
            <View
              key={faq.id}
              style={{
                backgroundColor: "black",
                borderWidth: 0.5,
                borderColor: "#808080",
                borderRadius: 12,
                marginBottom: 12,
              }}
            >
              <TouchableOpacity
                onPress={() => toggleQuestion(faq.id)}
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: 16,
                }}
              >
                <Text
                  style={{
                    fontSize: 15,
                    fontFamily: FONT.Medium,
                    color: "#FFFFFF",
                    flex: 1,
                    marginRight: 12,
                  }}
                >
                  {faq.question}
                </Text>

                {expandedQuestion === faq.id ? (
                  <ChevronUp size={20} color="#FFFFFF" strokeWidth={2} />
                ) : (
                  <ChevronDown size={20} color="#FFFFFF" strokeWidth={2} />
                )}
              </TouchableOpacity>

              {expandedQuestion === faq.id && (
                <View style={{ paddingHorizontal: 16, paddingBottom: 16 }}>
                  <Text
                    style={{
                      fontSize: 13,
                      fontFamily: FONT.Regular,
                      color: "#B0B0B0",
                      lineHeight: 20,
                    }}
                  >
                    {faq.answer}
                  </Text>
                </View>
              )}
            </View>
          ))}
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

export default Support;
