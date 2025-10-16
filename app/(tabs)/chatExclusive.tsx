import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  TextInput,
  Modal,
  FlatList,
  Dimensions,
} from "react-native";
import { ChevronLeft, Phone, Video, Plus, Check } from "lucide-react-native";
import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
} from "@expo-google-fonts/poppins";
import { useRouter } from "expo-router";

const { width, height } = Dimensions.get("window");

interface Message {
  id: string;
  text: string;
  timestamp: string;
  isSent: boolean;
  isEdited?: boolean;
  isRead?: boolean;
}

interface ChatExclusiveScreenProps {
  userName?: string;
  userImage?: string;
  isOnline?: boolean;
  initialBalance?: number;
  messageCost?: number;
  onPressBack?: () => void;
  onPressSendDonation?: () => void;
  onPressSupportCharity?: () => void;
  onPressUnlockResponses?: () => void;
  onSendMessage?: (message: string) => void;
}

export default function ChatExclusiveScreen({
  userName = "Bam Margera",
  userImage = "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100",
  isOnline = true,
  initialBalance = 12,
  messageCost = 0.05,
  onPressBack,
  onPressSendDonation,
  onPressSupportCharity,
  onPressUnlockResponses,
  onSendMessage,
}: ChatExclusiveScreenProps) {
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });
  const router = useRouter();
  const [messageText, setMessageText] = React.useState("");
  const [balance, setBalance] = React.useState(initialBalance);
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [showWelcome, setShowWelcome] = React.useState(true);
  const [charCount, setCharCount] = React.useState(0);
  const [showMediaPicker, setShowMediaPicker] = React.useState(false);
  const [showGallery, setShowGallery] = React.useState(false);
  const [selectedImages, setSelectedImages] = React.useState<number[]>([]);
  const [showCamera, setShowCamera] = React.useState(false);
  const [showPhotoPreview, setShowPhotoPreview] = React.useState(false);
  const [previewImage, setPreviewImage] = React.useState<string>("");
  const [selectedTab, setSelectedTab] = React.useState<"photos" | "videos">(
    "photos"
  );
  const scrollViewRef = React.useRef<ScrollView>(null);

  // Sample gallery images
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

  const handleSendMessage = () => {
    if (messageText.trim()) {
      const cost = charCount <= 60 ? 0.05 : 0.1;

      if (balance >= cost) {
        const newMessage: Message = {
          id: Date.now().toString(),
          text: messageText,
          timestamp: "2:00",
          isSent: true,
          isRead: true,
        };

        setMessages([...messages, newMessage]);
        setBalance((prev) => parseFloat((prev - cost).toFixed(2)));
        setMessageText("");
        setCharCount(0);
        setShowWelcome(false);

        if (onSendMessage) {
          onSendMessage(messageText);
        }

        // Simulate received message
        setTimeout(() => {
          const receivedMessage: Message = {
            id: (Date.now() + 1).toString(),
            text: "I've been a fan of your movies for years",
            timestamp: "2:00",
            isSent: false,
          };
          setMessages((prev) => [...prev, receivedMessage]);
        }, 1000);
      }
    }
  };

  const handleTextChange = (text: string) => {
    setMessageText(text);
    setCharCount(text.length);
  };

  const toggleImageSelection = (index: number) => {
    if (selectedImages.includes(index)) {
      setSelectedImages(selectedImages.filter((i) => i !== index));
    } else {
      setSelectedImages([...selectedImages, index]);
    }
  };

  const handleGalleryConfirm = () => {
    setShowGallery(false);
    setSelectedImages([]);
  };

  const handleCameraCapture = () => {
    const capturedImage =
      "https://images.unsplash.com/photo-1606115915090-be18fea23ec7?w=400";
    setPreviewImage(capturedImage);
    setShowCamera(false);
    setShowPhotoPreview(true);
  };

  if (!fontsLoaded) {
    return (
      <View className="flex-1 items-center justify-center bg-[#0A0A0A]">
        <ActivityIndicator color="#FCCD34" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-[#0A0A0A]"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={0}
    >
      {/* Header */}
      <View className="pt-12 px-5 pb-3">
        <View className="flex-row items-center justify-between mb-3">
          <View className="flex-row items-center flex-1">
            <TouchableOpacity className="mr-2" onPress={() => router.back()}>
              <ChevronLeft size={24} color="#fff" />
            </TouchableOpacity>

            <Image
              source={{ uri: userImage }}
              style={{
                width: 48,
                height: 48,
                borderRadius: 24,
                marginRight: 10,
              }}
            />

            <View className="flex-1">
              <Text
                className="text-white text-[18px]"
                style={{ fontFamily: "Poppins_600SemiBold" }}
              >
                {userName}
              </Text>

              <View className="flex-row items-center mt-0.5">
                <Text
                  className="text-[#9CA3AF] text-[13px] mr-1.5"
                  style={{ fontFamily: "Poppins_400Regular" }}
                >
                  Active Now
                </Text>
                {isOnline && (
                  <View className="w-2 h-2 rounded-full bg-[#10B981]" />
                )}
              </View>
            </View>
          </View>

          <View className="flex-row items-center">
            <TouchableOpacity className="mr-7">
              <Phone size={20} color="#ffffff" fill="#ffffff" />
            </TouchableOpacity>
            <TouchableOpacity>
              <Video size={22} color="#ffffff" fill="#ffffff" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Balance row */}
        <View className="flex-row items-center justify-between mt-2 bg-[#1A1A1A] w-full px-4 py-3">
          <View className="flex-row items-center">
            <Text className="text-[18px] mr-1">💰</Text>
            <Text
              className="text-white"
              style={{ fontFamily: "Poppins_400Regular" }}
            >
              Balance: {balance} GEL
            </Text>
          </View>

          <TouchableOpacity className="bg-[#FCCD34] py-2 px-4 rounded-full">
            <Text
              className="font-extrabold text-black"
              style={{ fontFamily: "Poppins_600SemiBold" }}
            >
              + Add funds
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Content */}
      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: 20,
          paddingBottom: 90,
        }}
        showsVerticalScrollIndicator={false}
        onContentSizeChange={() =>
          scrollViewRef.current?.scrollToEnd({ animated: true })
        }
      >
        {showWelcome ? (
          <View className="items-center mb-5">
            <View className="w-[40px] h-[40px] items-center justify-center mb-2">
              <Text className="text-[30px]">💬</Text>
            </View>

            <Text
              className="text-white text-[15px] mb-3"
              style={{ fontFamily: "Poppins_700Bold" }}
            >
              Welcome!
            </Text>

            <View className="bg-[#1A1A1A] rounded-2xl py-8 px-7 w-full">
              <Text
                className="text-[#B8B8B8] text-[13px] text-center leading-5"
                style={{ fontFamily: "Poppins_400Regular" }}
              >
                You can send messages, or start a paid video/audio call with{" "}
                <Text
                  style={{ color: "#fff", fontFamily: "Poppins_500Medium" }}
                >
                  {userName}
                </Text>
                .{"\n\n"}
                Each message up to 60 characters costs{" "}
                <Text
                  style={{ color: "#fff", fontFamily: "Poppins_500Medium" }}
                >
                  0.05 ¢
                </Text>
                , longer messages cost more ¢.{"\n\n"}
                Keep your balance topped up.
              </Text>
            </View>
          </View>
        ) : (
          <View className="flex-1">
            {messages.map((message) => (
              <View key={message.id} className="mb-3">
                {message.isSent ? (
                  <View className="items-end">
                    <View className="bg-[#B8A05E] rounded-2xl rounded-tr-sm px-4 py-3 max-w-[80%]">
                      <Text
                        className="text-white text-[14px]"
                        style={{ fontFamily: "Poppins_400Regular" }}
                      >
                        {message.text}
                      </Text>
                    </View>
                    <View className="flex-row items-center mt-1">
                      {message.isEdited && (
                        <Text
                          className="text-[#9CA3AF] text-[11px] mr-1"
                          style={{ fontFamily: "Poppins_400Regular" }}
                        >
                          edited
                        </Text>
                      )}
                      <Text
                        className="text-[#9CA3AF] text-[11px] mr-1"
                        style={{ fontFamily: "Poppins_400Regular" }}
                      >
                        {message.timestamp}
                      </Text>
                      {message.isRead && (
                        <Text className="text-[#9CA3AF] text-[11px]">✓✓</Text>
                      )}
                    </View>
                  </View>
                ) : (
                  <View className="items-start">
                    <View className="bg-[#1A1A1A] rounded-2xl rounded-tl-sm px-4 py-3 max-w-[80%]">
                      <Text
                        className="text-white text-[14px]"
                        style={{ fontFamily: "Poppins_400Regular" }}
                      >
                        {message.text}
                      </Text>
                    </View>
                    <Text
                      className="text-[#9CA3AF] text-[11px] mt-1"
                      style={{ fontFamily: "Poppins_400Regular" }}
                    >
                      {message.timestamp}
                    </Text>
                  </View>
                )}
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Message Input - Fixed at bottom */}
      <View className="absolute bottom-0 left-0 right-0 bg-[#0A0A0A] px-5 py-3 pb-6">
        <View className="flex-row items-center justify-center">
          {/* + Button */}
          <TouchableOpacity
            className="w-10 h-10 rounded-full bg-[#1A1A1A] items-center justify-center mr-2.5"
            activeOpacity={0.8}
            onPress={() => setShowMediaPicker(true)}
          >
            <Plus size={24} color="#fff" />
          </TouchableOpacity>

          {/* Message Input with Send Icon Inside */}
          <View className="flex-1 bg-[#1A1A1A] rounded-full flex-row items-center px-4">
            <TextInput
              className="flex-1 text-white text-[14px]"
              placeholder={`Type your message (${
                charCount <= 60 ? "0.05" : "0.10"
              } Gel)`}
              placeholderTextColor="#9CA3AF"
              value={messageText}
              onChangeText={handleTextChange}
              style={{
                fontFamily: "Poppins_400Regular",
                paddingVertical: 15,
              }}
              multiline
            />

            {/* Character count */}
            {messageText.length > 0 && (
              <Text
                className="text-[#9CA3AF] text-[12px] mr-2"
                style={{ fontFamily: "Poppins_400Regular" }}
              >
                {charCount}/60
              </Text>
            )}

            {/* Send Button Inside Input */}
            <TouchableOpacity
              className="w-8 h-8 rounded-full bg-[#FCCD34] items-center justify-center"
              onPress={handleSendMessage}
              activeOpacity={0.8}
            >
              <Text className="text-black text-[16px] font-bold">➤</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Media Picker Modal */}
      <Modal
        visible={showMediaPicker}
        transparent
        animationType="fade"
        onRequestClose={() => setShowMediaPicker(false)}
      >
        <TouchableOpacity
          className="flex-1 bg-black/50"
          activeOpacity={1}
          onPress={() => setShowMediaPicker(false)}
        >
          <View className="absolute bottom-20 left-5 bg-[#1A1A1A] rounded-2xl p-4 w-48">
            <TouchableOpacity
              className="py-3"
              onPress={() => {
                setShowMediaPicker(false);
                setShowGallery(true);
              }}
            >
              <Text
                className="text-white text-[15px]"
                style={{ fontFamily: "Poppins_500Medium" }}
              >
                📷 Gallery
              </Text>
            </TouchableOpacity>
            <View className="h-[1px] bg-[#2A2A2A]" />
            <TouchableOpacity
              className="py-3"
              onPress={() => {
                setShowMediaPicker(false);
                setShowCamera(true);
              }}
            >
              <Text
                className="text-white text-[15px]"
                style={{ fontFamily: "Poppins_500Medium" }}
              >
                📸 Camera
              </Text>
            </TouchableOpacity>
            <View className="h-[1px] bg-[#2A2A2A]" />
            <TouchableOpacity
              className="py-3"
              onPress={() => setShowMediaPicker(false)}
            >
              <Text
                className="text-white text-[15px]"
                style={{ fontFamily: "Poppins_500Medium" }}
              >
                📄 File
              </Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Gallery Modal */}
      <Modal
        visible={showGallery}
        animationType="slide"
        onRequestClose={() => setShowGallery(false)}
      >
        <View className="flex-1 bg-[#0A0A0A]">
          {/* Gallery Header */}
          <View className="pt-12 px-5 pb-3 flex-row items-center justify-between">
            <View className="flex-row items-center">
              <TouchableOpacity
                className={`px-6 py-2 rounded-full ${
                  selectedImages.length === 0 ? "bg-[#FCCD34]" : "bg-[#1A1A1A]"
                }`}
                onPress={() => setSelectedImages([])}
              >
                <Text
                  className={`text-[14px] ${
                    selectedImages.length === 0 ? "text-black" : "text-white"
                  }`}
                  style={{ fontFamily: "Poppins_600SemiBold" }}
                >
                  Photos
                </Text>
              </TouchableOpacity>
              <TouchableOpacity className="px-6 py-2 rounded-full bg-[#1A1A1A] ml-2">
                <Text
                  className="text-white text-[14px]"
                  style={{ fontFamily: "Poppins_500Medium" }}
                >
                  Albums
                </Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity onPress={() => setShowGallery(false)}>
              <Text
                className="text-[#FCCD34] text-[15px]"
                style={{ fontFamily: "Poppins_600SemiBold" }}
              >
                Close
              </Text>
            </TouchableOpacity>
          </View>

          {/* Gallery Grid */}
          <FlatList
            data={galleryImages}
            numColumns={3}
            keyExtractor={(item, index) => index.toString()}
            contentContainerStyle={{ padding: 2 }}
            renderItem={({ item, index }) => (
              <TouchableOpacity
                className="w-[33.33%] p-[2px]"
                onPress={() => toggleImageSelection(index)}
              >
                <View className="relative">
                  <Image
                    source={{ uri: item }}
                    style={{ width: "100%", aspectRatio: 1 }}
                  />
                  {/* Selection checkbox */}
                  <View
                    className={`absolute top-2 right-2 w-6 h-6 rounded-md border-2 ${
                      selectedImages.includes(index)
                        ? "bg-[#FCCD34] border-[#FCCD34]"
                        : "bg-transparent border-white"
                    } items-center justify-center`}
                  >
                    {selectedImages.includes(index) && (
                      <Check size={16} color="#000" strokeWidth={3} />
                    )}
                  </View>
                </View>
              </TouchableOpacity>
            )}
          />

          {/* Bottom Bar */}
          <View className="bg-[#0A0A0A] border-t border-[#1A1A1A] px-5 py-4 flex-row items-center justify-between">
            <TouchableOpacity className="flex-1 items-center py-3">
              <Text className="text-[28px]">🖼️</Text>
              <Text
                className="text-[#FCCD34] text-[11px] mt-1"
                style={{ fontFamily: "Poppins_600SemiBold" }}
              >
                Gallery
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="flex-1 items-center py-3"
              onPress={() => {
                setShowGallery(false);
                setShowCamera(true);
              }}
            >
              <Text className="text-[28px]">📷</Text>
              <Text
                className="text-[#6B7280] text-[11px] mt-1"
                style={{ fontFamily: "Poppins_500Medium" }}
              >
                Camera
              </Text>
            </TouchableOpacity>
            <TouchableOpacity className="flex-1 items-center py-3">
              <Text className="text-[28px]">📄</Text>
              <Text
                className="text-[#6B7280] text-[11px] mt-1"
                style={{ fontFamily: "Poppins_500Medium" }}
              >
                File
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Camera Modal */}
      <Modal
        visible={showCamera}
        animationType="slide"
        onRequestClose={() => setShowCamera(false)}
      >
        <View className="flex-1 bg-black">
          {/* Camera Header */}
          <View className="absolute top-12 left-0 right-0 px-5 z-10">
            <TouchableOpacity
              className="self-end bg-[#2A2A2A] w-10 h-10 rounded-full items-center justify-center"
              onPress={() => setShowCamera(false)}
            >
              <Text className="text-white text-[20px]">✕</Text>
            </TouchableOpacity>
          </View>

          {/* Camera Preview (simulated) */}
          <View className="flex-1 bg-[#1A1A1A] items-center justify-center">
            <Text
              className="text-[#6B7280] text-[16px]"
              style={{ fontFamily: "Poppins_400Regular" }}
            >
              Camera View
            </Text>
          </View>

          {/* Camera Controls */}
          <View className="absolute bottom-0 left-0 right-0 pb-10">
            {/* Thumbnails */}
            <View className="px-5 mb-5">
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {galleryImages.slice(0, 4).map((img, idx) => (
                  <TouchableOpacity
                    key={idx}
                    onPress={() => {
                      setPreviewImage(img);
                      setShowCamera(false);
                      setShowPhotoPreview(true);
                    }}
                  >
                    <Image
                      source={{ uri: img }}
                      style={{
                        width: 80,
                        height: 80,
                        borderRadius: 8,
                        marginRight: 10,
                      }}
                    />
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* Capture Button */}
            <View className="items-center">
              <TouchableOpacity
                className="w-20 h-20 rounded-full bg-[#FCCD34] items-center justify-center"
                onPress={handleCameraCapture}
              >
                <View className="w-16 h-16 rounded-full bg-white" />
              </TouchableOpacity>
            </View>

            {/* Bottom Navigation */}
            <View className="flex-row items-center justify-around mt-8 px-10">
              <TouchableOpacity
                className="items-center"
                onPress={() => setSelectedTab("photos")}
              >
                <Text
                  className={`text-[28px] ${
                    selectedTab === "photos" ? "" : "opacity-50"
                  }`}
                >
                  🖼️
                </Text>
                <Text
                  className={`text-[11px] mt-1 ${
                    selectedTab === "photos" ? "text-white" : "text-[#6B7280]"
                  }`}
                  style={{ fontFamily: "Poppins_600SemiBold" }}
                >
                  Photos
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="items-center"
                onPress={() => setSelectedTab("videos")}
              >
                <Text
                  className={`text-[28px] ${
                    selectedTab === "videos" ? "" : "opacity-50"
                  }`}
                >
                  🎥
                </Text>
                <Text
                  className={`text-[11px] mt-1 ${
                    selectedTab === "videos" ? "text-white" : "text-[#6B7280]"
                  }`}
                  style={{ fontFamily: "Poppins_500Medium" }}
                >
                  Videos
                </Text>
              </TouchableOpacity>
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
          {/* Close Button */}
          <View className="absolute top-12 right-5 z-10">
            <TouchableOpacity
              className="bg-[#2A2A2A] w-10 h-10 rounded-full items-center justify-center"
              onPress={() => setShowPhotoPreview(false)}
            >
              <Text className="text-white text-[20px]">✕</Text>
            </TouchableOpacity>
          </View>

          {/* Preview Image */}
          <View className="flex-1 items-center justify-center">
            <Image
              source={{ uri: previewImage }}
              style={{
                width: width,
                height: height * 0.7,
                resizeMode: "contain",
              }}
            />
          </View>

          {/* Thumbnails */}
          <View className="px-5 py-5">
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {galleryImages.slice(0, 4).map((img, idx) => (
                <TouchableOpacity
                  key={idx}
                  onPress={() => setPreviewImage(img)}
                >
                  <Image
                    source={{ uri: img }}
                    style={{
                      width: 80,
                      height: 80,
                      borderRadius: 8,
                      marginRight: 10,
                      opacity: img === previewImage ? 1 : 0.5,
                      borderWidth: img === previewImage ? 2 : 0,
                      borderColor: "#FCCD34",
                    }}
                  />
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Action Buttons */}
          <View className="flex-row items-center justify-around pb-10 px-10">
            <TouchableOpacity className="items-center">
              <View className="w-14 h-14 rounded-full bg-[#1A1A1A] items-center justify-center mb-2">
                <Text className="text-white text-[24px]">🎨</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              className="w-16 h-16 rounded-full bg-[#FCCD34] items-center justify-center"
              onPress={() => {
                setShowPhotoPreview(false);
                // Handle photo send - add to messages
                const newMessage: Message = {
                  id: Date.now().toString(),
                  text: "📷 Photo sent",
                  timestamp: "2:00",
                  isSent: true,
                  isRead: true,
                };
                setMessages([...messages, newMessage]);
                setShowWelcome(false);
              }}
            >
              <Text className="text-[28px]">➤</Text>
            </TouchableOpacity>
            <TouchableOpacity className="items-center">
              <View className="w-14 h-14 rounded-full bg-[#1A1A1A] items-center justify-center mb-2">
                <Text className="text-white text-[24px]">⚙️</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}
