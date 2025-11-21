import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
  StatusBar,
  Image,
  ActivityIndicator,
  Modal,
  Pressable,
  Alert,
  KeyboardAvoidingView,
  Platform,
  FlatList,
  Dimensions,
  RefreshControl,
} from "react-native";
import { Phone, Video, ChevronLeft, Plus } from "lucide-react-native";
import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
} from "@expo-google-fonts/poppins";
import { router, useLocalSearchParams } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { supabase } from "../../../supabaseClient";
import {
  getCurrentUser,
  verifyAuthentication
} from "../../../utils/authHelpers";

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
  isRead?: boolean;
  replyTo?: Message | null;
  content_type?: string;
  media_url?: string;
  created_at?: string;
  sender_id?: string;
}

export default function Chat() {
  const params = useLocalSearchParams();
  const conversationId = params.conversationId as string;
  const influencerName = params.name as string;
  const influencerImage = params.image as string;
  const isOnline = params.isOnline === "true";
  const isVerified = params.isVerified === "true";

  const [message, setMessage] = useState("");
  const [balance, setBalance] = useState(12);
  const [messages, setMessages] = useState<Message[]>([]);
  const [contextMenu, setContextMenu] = useState<Message | null>(null);
  const [editingMessage, setEditingMessage] = useState<Message | null>(null);
  const [replyTo, setReplyTo] = useState<Message | null>(null);
  const [charCount, setCharCount] = useState(0);
  const [showGallery, setShowGallery] = useState(false);
  const [selectedImages, setSelectedImages] = useState<number[]>([]);
  const [showCamera, setShowCamera] = useState(false);
  const [showPhotoPreview, setShowPhotoPreview] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [selectedTab, setSelectedTab] = useState<"photos" | "videos">("photos");
  const [inputHeight, setInputHeight] = useState(48);
  const scrollViewRef = useRef<ScrollView>(null);
  const textInputRef = useRef<TextInput>(null);
  const [showVideoCall, setShowVideoCall] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [isConnecting, setIsConnecting] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [showAudioCall, setShowAudioCall] = useState(false);
  const [audioCallStatus, setAudioCallStatus] = useState<
    "requesting" | "connected" | "ended"
  >("requesting");
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isRealtimeConnected, setIsRealtimeConnected] = useState(false);

  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  // Get current user and initialize conversation
  useEffect(() => {
    initializeChat();
  }, []);

  // Enhanced real-time subscription
  useEffect(() => {
    if (!conversationId || !currentUserId) return;

    console.log(`Setting up enhanced real-time subscription for conversation: ${conversationId}`);

    const subscription = supabase
      .channel(`conversation:${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`,
        },
        async (payload) => {
          console.log('Real-time update received:', payload);

          switch (payload.eventType) {
            case 'INSERT':
              await handleNewMessage(payload.new);
              break;
            case 'UPDATE':
              await handleUpdatedMessage(payload.new);
              break;
            case 'DELETE':
              await handleDeletedMessage(payload.old);
              break;
          }
        }
      )
      .on('system' as any, { event: 'connected' }, () => {
        console.log('Realtime connected');
        setIsRealtimeConnected(true);
      })
      .on('system' as any, { event: 'disconnected' }, () => {
        console.log('Realtime disconnected');
        setIsRealtimeConnected(false);
      })
      .subscribe((status) => {
        console.log('Subscription status:', status);
        if (status === 'SUBSCRIBED') {
          console.log('Successfully subscribed to real-time updates');
        } else if (status === 'CHANNEL_ERROR') {
          console.error('Channel error in real-time subscription');
        } else if (status === 'TIMED_OUT') {
          console.error('Real-time subscription timed out');
        }
      });

    // Cleanup function
    return () => {
      console.log(`Cleaning up real-time subscription for conversation: ${conversationId}`);
      subscription.unsubscribe();
    };
  }, [conversationId, currentUserId]);

  // Handle new message from real-time
  const handleNewMessage = async (newMessage: any) => {
    console.log('Processing new message:', newMessage);

    // Format the new message
    const formattedMessage: Message = {
      id: newMessage.id,
      text: newMessage.content,
      timestamp: formatMessageTime(newMessage.created_at),
      isSent: newMessage.sender_id === currentUserId,
      isRead: newMessage.is_read,
      content_type: newMessage.content_type,
      media_url: newMessage.media_url,
      created_at: newMessage.created_at,
      sender_id: newMessage.sender_id,
    };

    // Add to messages state, avoiding duplicates
    setMessages((prev) => {
      // Check if message already exists to avoid duplicates
      const exists = prev.some(msg => msg.id === formattedMessage.id);
      if (exists) {
        console.log('Message already exists, skipping:', formattedMessage.id);
        return prev;
      }

      console.log('Adding new message to state:', formattedMessage.id);
      return [...prev, formattedMessage];
    });

    // If message is from other user, mark as read immediately
    if (newMessage.sender_id !== currentUserId) {
      console.log('Marking message as read:', newMessage.id);
      await markMessageAsRead(newMessage.id);

      // Update the message read status in state
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === newMessage.id ? { ...msg, isRead: true } : msg
        )
      );
    }

    // Scroll to bottom
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  // Handle updated message from real-time
  const handleUpdatedMessage = async (updatedMessage: any) => {
    console.log('Processing updated message:', updatedMessage);

    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === updatedMessage.id
          ? {
            ...msg,
            text: updatedMessage.content,
            isRead: updatedMessage.is_read,
            isEdited: false,
          }
          : msg
      )
    );
  };

  // Handle deleted message from real-time
  const handleDeletedMessage = async (deletedMessage: any) => {
    console.log('Processing deleted message:', deletedMessage);

    setMessages((prev) =>
      prev.filter((msg) => msg.id !== deletedMessage.id)
    );
  };

  const initializeChat = async () => {
    try {
      setLoading(true);

      // Step 1: Verify user is authenticated
      const isAuthenticated = await verifyAuthentication();
      if (!isAuthenticated) {
        Alert.alert("Error", "Please log in to continue");
        router.back();
        return;
      }

      // Step 2: Get current user data
      const currentUser = await getCurrentUser();
      if (!currentUser) {
        Alert.alert("Error", "Unable to retrieve user data");
        router.back();
        return;
      }

      setCurrentUserId(currentUser.id);
      console.log("Current user ID:", currentUser.id);

      // Step 3: Validate conversationId
      if (!conversationId || conversationId === "undefined") {
        console.error("Missing or invalid conversationId:", conversationId);
        Alert.alert("Error", "Unable to open chat: invalid conversation.");
        router.back();
        return;
      }

      console.log("Conversation ID:", conversationId);

      // Step 4: Verify conversation exists and user has access
      const { data: conversation, error } = await supabase
        .from("conversations")
        .select(`
        id,
        regular_user_id,
        influencer_id,
        is_active,
        influencer:influencer_id(
          user_id
        )
      `)
        .eq("id", conversationId)
        .eq("is_active", true)
        .single();

      if (error || !conversation) {
        console.error("Error fetching conversation:", error);
        Alert.alert("Error", "Conversation not found or no longer active");
        router.back();
        return;
      }

      // Step 5: Verify user has access to this conversation
      // For regular users: check if they are the regular_user_id
      // For influencers: check if they are the influencer's user_id
      const isRegularUser = conversation.regular_user_id === currentUser.id;

      // Check if current user is the influencer by comparing with influencer's user_id
      const isInfluencer = conversation.influencer?.user_id === currentUser.id;

      console.log("Access check:", {
        currentUserId: currentUser.id,
        regularUserId: conversation.regular_user_id,
        influencerUserId: conversation.influencer?.user_id,
        isRegularUser,
        isInfluencer
      });

      if (!isRegularUser && !isInfluencer) {
        console.error("User does not have access to this conversation");
        Alert.alert("Error", "You don't have access to this conversation");
        router.back();
        return;
      }

      console.log("User has access to conversation");

      // Step 6: Load messages for this conversation
      await loadMessages(conversationId, currentUser.id);

    } catch (error) {
      console.error("Error initializing chat:", error);
      Alert.alert("Error", "Failed to initialize chat");
    } finally {
      setLoading(false);
    }
  };

  const formatMessageTime = (timestamp: string): string => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const loadMessages = async (convId: string, userId: string) => {
    try {
      console.log("Loading messages for conversation:", convId);

      const { data: messagesData, error } = await supabase
        .from("messages")
        .select("*")
        .eq("conversation_id", convId)
        .is("deleted_at", null)
        .order("created_at", { ascending: true });

      if (error) {
        console.error("Error loading messages:", error);
        Alert.alert("Error", "Failed to load messages");
        return;
      }

      console.log(`Loaded ${messagesData?.length || 0} messages`);

      // Format messages and determine if they were sent by current user
      const formattedMessages: Message[] = (messagesData || []).map((msg) => ({
        id: msg.id,
        text: msg.content,
        timestamp: formatMessageTime(msg.created_at),
        isSent: msg.sender_id === userId,
        isRead: msg.is_read,
        content_type: msg.content_type,
        media_url: msg.media_url,
        created_at: msg.created_at,
        sender_id: msg.sender_id,
      }));

      setMessages(formattedMessages);

      // Mark unread messages from other user as read
      const unreadMessageIds = messagesData
        ?.filter((msg) => msg.sender_id !== userId && !msg.is_read)
        .map((msg) => msg.id);

      if (unreadMessageIds && unreadMessageIds.length > 0) {
        console.log(`Marking ${unreadMessageIds.length} messages as read`);
        await markMessagesAsRead(unreadMessageIds);

        // Update local state to reflect read status
        setMessages((prev) =>
          prev.map((msg) =>
            unreadMessageIds.includes(msg.id) ? { ...msg, isRead: true } : msg
          )
        );
      }

      // Scroll to bottom after loading
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: false });
      }, 100);

    } catch (error) {
      console.error("Error in loadMessages:", error);
      Alert.alert("Error", "Failed to load messages");
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    if (conversationId && currentUserId) {
      await loadMessages(conversationId, currentUserId);
    }
    setRefreshing(false);
  };

  const markMessageAsRead = async (messageId: string) => {
    try {
      const { error } = await supabase
        .from("messages")
        .update({
          is_read: true,
          read_at: new Date().toISOString()
        })
        .eq("id", messageId);

      if (error) {
        console.error("Error marking message as read:", error);
      } else {
        console.log("Message marked as read:", messageId);
      }
    } catch (error) {
      console.error("Error marking message as read:", error);
    }
  };

  const markMessagesAsRead = async (messageIds: string[]) => {
    try {
      const { error } = await supabase
        .from("messages")
        .update({
          is_read: true,
          read_at: new Date().toISOString()
        })
        .in("id", messageIds);

      if (error) {
        console.error("Error marking messages as read:", error);
      } else {
        console.log("Messages marked as read:", messageIds.length);
      }
    } catch (error) {
      console.error("Error marking messages as read:", error);
    }
  };

  const calculateCost = (text: string) => {
    const length = text.length;
    if (length === 0) return 0;
    if (length <= 60) return 0.05;
    return Math.ceil(length / 60) * 0.05;
  };

  const handleTextChange = (text: string) => {
    setMessage(text);
    setCharCount(text.length);
  };

  const handleSendMessage = async () => {
    if (message.trim() === "" || !conversationId || !currentUserId) return;

    const cost = calculateCost(message);
    if (balance < cost) {
      Alert.alert(
        "Insufficient Balance",
        "Please add funds to send this message."
      );
      return;
    }

    try {
      if (editingMessage) {
        // Update existing message
        const { error } = await supabase
          .from("messages")
          .update({
            content: message,
            updated_at: new Date().toISOString(),
          })
          .eq("id", editingMessage.id);

        if (error) throw error;

        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === editingMessage.id
              ? { ...msg, text: message, isEdited: true }
              : msg
          )
        );
        setEditingMessage(null);
        setReplyTo(null);
      } else {
        // Create new message - set is_read to false by default
        const { data: newMessage, error } = await supabase
          .from("messages")
          .insert({
            conversation_id: conversationId,
            sender_id: currentUserId,
            content: message,
            content_type: "text",
            is_paid: cost > 0,
            amount_charged: cost,
            is_delivered: true,
            delivered_at: new Date().toISOString(),
            is_read: false, // Explicitly set to false for sent messages
            read_at: null, // Set to null since it's not read yet
          })
          .select()
          .single();

        if (error) throw error;

        // Update conversation last message
        await supabase
          .from("conversations")
          .update({
            last_message_at: new Date().toISOString(),
            last_message_preview: message.substring(0, 100),
            updated_at: new Date().toISOString(),
          })
          .eq("id", conversationId);

        console.log("Message sent successfully:", newMessage.id);

        // Update balance
        setBalance((prev) => parseFloat((prev - cost).toFixed(2)));

        // Add the new message to local state with correct read status
        const formattedMessage: Message = {
          id: newMessage.id,
          text: newMessage.content,
          timestamp: formatMessageTime(newMessage.created_at),
          isSent: true, // This message is sent by current user
          isRead: false, // Messages you send should show as unread until the other person reads them
          content_type: newMessage.content_type,
          media_url: newMessage.media_url,
          created_at: newMessage.created_at,
          sender_id: newMessage.sender_id,
        };

        setMessages((prev) => [...prev, formattedMessage]);
      }

      setMessage("");
      setCharCount(0);
      setInputHeight(48);
      setReplyTo(null);

      // Scroll to bottom
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);

    } catch (error) {
      console.error("Error sending message:", error);
      Alert.alert("Error", "Failed to send message. Please try again.");
    }
  };

  const handleLongPress = (msg: Message) => {
    setContextMenu(msg);
  };

  const handleReply = () => {
    setReplyTo(contextMenu);
    setContextMenu(null);
    textInputRef.current?.focus();
  };

  const handleCopy = () => {
    setContextMenu(null);
    Alert.alert("Copied", "Message copied to clipboard");
  };

  const handleEdit = () => {
    if (contextMenu && contextMenu.isSent) {
      setMessage(contextMenu.text);
      setEditingMessage(contextMenu);
      setContextMenu(null);
      textInputRef.current?.focus();
    }
  };

  const handleDelete = async () => {
    const msgToDelete = contextMenu;
    setContextMenu(null);

    Alert.alert(
      "Delete Message",
      "Are you sure you want to delete this message?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              // Soft delete
              const { error } = await supabase
                .from("messages")
                .update({ deleted_at: new Date().toISOString() })
                .eq("id", msgToDelete?.id);

              if (error) throw error;

              setMessages((prev) =>
                prev.filter((msg) => msg.id !== msgToDelete?.id)
              );
            } catch (error) {
              console.error("Error deleting message:", error);
              Alert.alert("Error", "Failed to delete message");
            }
          },
        },
      ]
    );
  };

  const handleReport = () => {
    setContextMenu(null);
    Alert.alert("Report", "Message has been reported");
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

  // Timer effects
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (showVideoCall && !isConnecting) {
      interval = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [showVideoCall, isConnecting]);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (showAudioCall && audioCallStatus === "connected") {
      interval = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [showAudioCall, audioCallStatus]);

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

  if (!fontsLoaded || loading) {
    return (
      <View className="flex-1 items-center justify-center bg-black">
        <ActivityIndicator color="#FCCD34" />
        <Text className="text-white mt-4" style={{ fontFamily: FONT.Regular }}>
          Loading chat...
        </Text>
      </View>
    );
  }

  const formatCallDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const showWelcomeScreen = messages.length === 0;

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-black"
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={0}
    >
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View className="bg-black pt-12 pb-3 px-4 flex-row items-center justify-between">
        <View className="flex-row items-center flex-1">
          <TouchableOpacity className="mr-4" onPress={() => router.back()}>
            <ChevronLeft size={28} color="white" />
          </TouchableOpacity>
          <View className="w-12 h-12 rounded-full bg-gray-700 mr-3 overflow-hidden">
            <Image
              source={
                influencerImage
                  ? { uri: influencerImage }
                  : require("../../../assets/images/discover.png")
              }
              style={{ width: "100%", height: "100%" }}
            />
          </View>
          <View className="flex-1">
            <Text
              className="text-white"
              style={{
                fontSize: 20,
                fontFamily: FONT.SemiBold,
              }}
            >
              {influencerName || "User"}
            </Text>
            <View className="flex-row items-center">
              <Text
                className="text-gray-400"
                style={{
                  fontSize: 14,
                  fontFamily: FONT.Regular,
                }}
              >
                {isOnline ? "Active Now" : "Offline"}
              </Text>
              {isOnline && (
                <View className="w-2 h-2 rounded-full bg-green-500 ml-2" />
              )}
              {isVerified && (
                <View className="ml-1 w-4 h-4 bg-[#FCCD34] rounded-full items-center justify-center">
                  <Text className="text-black text-xs font-bold">✓</Text>
                </View>
              )}
              {isRealtimeConnected && (
                <View className="flex-row items-center ml-2">
                  <View className="w-2 h-2 rounded-full bg-green-500 mr-1" />
                  <Text
                    className="text-green-500 text-xs"
                    style={{ fontFamily: FONT.Regular }}
                  >
                    Live
                  </Text>
                </View>
              )}
            </View>
          </View>
        </View>
        <View className="flex-row items-center">
          <TouchableOpacity
            className="mr-4"
            onPress={() => {
              setShowAudioCall(true);
              setAudioCallStatus("requesting");
              setTimeout(() => setAudioCallStatus("connected"), 2000);
            }}
          >
            <Phone size={24} color="white" fill="white" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setShowVideoCall(true);
              setIsConnecting(true);
              setTimeout(() => setIsConnecting(false), 2000);
            }}
          >
            <Video size={24} color="white" fill="white" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Balance Card */}
      <View className="px-4 mt-4">
        <View
          style={{
            width: "100%",
            height: 55,
            backgroundColor: "#19191B",
            borderRadius: 8,
            paddingHorizontal: 16,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Image
              source={require("../../../assets/images/balance-icon.png")}
              style={{
                width: 22,
                height: 22,
                marginRight: 8,
              }}
              resizeMode="contain"
            />
            <Text
              style={{
                color: "white",
                fontSize: 16,
                fontFamily: FONT.Medium,
              }}
            >
              Balance: {balance.toFixed(2)} GEL
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => router.push("/(tabs)/profile/addFunds")}
            style={{
              backgroundColor: "#FCCD34",
              borderRadius: 20,
              paddingHorizontal: 16,
              height: 36,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text
              style={{
                color: "black",
                fontSize: 14,
                fontFamily: FONT.SemiBold,
              }}
            >
              + Add funds
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Messages Area */}
      <ImageBackground
        source={require("../../../assets/images/chat-background.png")}
        className="flex-1 mt-4"
        resizeMode="cover"
      >
        {showWelcomeScreen ? (
          <ScrollView
            className="flex-1 px-4"
            contentContainerStyle={{
              flexGrow: 1,
              justifyContent: "center",
              paddingBottom: 40,
            }}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                tintColor="#FCCD34"
                colors={["#FCCD34"]}
              />
            }
          >
            <View className="flex-1 justify-center items-center px-6">
              <View className=" items-center justify-center mb-3">
                <Image
                  source={require("../../../assets/images/messageicon.png")}
                  style={{ width: 30, height: 30 }}
                  resizeMode="contain"
                />
              </View>
              <Text
                className="text-white text-center mb-6"
                style={{
                  fontSize: 16,
                  fontFamily: FONT.Bold,
                }}
              >
                Welcome!
              </Text>
              <View
                style={{
                  width: "100%",
                  maxWidth: 340,
                  borderRadius: 16,
                  padding: 24,
                  backgroundColor: "#19191B",
                }}
              >
                <Text
                  className="text-gray-300 text-center mb-4"
                  style={{
                    fontSize: 15,
                    fontFamily: FONT.Regular,
                    lineHeight: 22,
                  }}
                >
                  You can send messages, or start a paid video/audio call with{" "}
                  {influencerName || "this user"}.
                </Text>
                <Text
                  className="text-gray-300 text-center mb-4"
                  style={{
                    fontSize: 15,
                    fontFamily: FONT.Regular,
                    lineHeight: 22,
                  }}
                >
                  Each message up to 60 characters costs 0.05 ₾, longer messages
                  cost more ₾.
                </Text>
                <Text
                  className="text-gray-300 text-center"
                  style={{
                    fontSize: 15,
                    fontFamily: FONT.Regular,
                    lineHeight: 22,
                  }}
                >
                  Keep your balance topped up.
                </Text>
              </View>
            </View>
          </ScrollView>
        ) : (
          <ScrollView
            ref={scrollViewRef}
            className="flex-1 px-4 pt-4"
            contentContainerStyle={{ paddingBottom: 20 }}
            onContentSizeChange={() =>
              scrollViewRef.current?.scrollToEnd({ animated: true })
            }
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                tintColor="#FCCD34"
                colors={["#FCCD34"]}
              />
            }
          >
            {messages
              .filter((msg, index, self) =>
                index === self.findIndex(m => m.id === msg.id)
              )
              .map((msg) => (
                <TouchableOpacity
                  key={msg.id}
                  onLongPress={() => handleLongPress(msg)}
                  activeOpacity={0.7}
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
                    {msg.replyTo && (
                      <View
                        style={{
                          backgroundColor: msg.isSent
                            ? "rgba(0,0,0,0.25)"
                            : "rgba(0,0,0,0.3)",
                          paddingVertical: 6,
                          paddingHorizontal: 10,
                          borderRadius: 8,
                          marginBottom: 8,
                          alignSelf: "stretch",
                        }}
                      >
                        <Text
                          style={{
                            color: "#FFFFFF",
                            fontFamily: FONT.SemiBold,
                            fontSize: 12,
                            marginBottom: 2,
                          }}
                        >
                          {msg.replyTo.isSent ? "You" : influencerName}
                        </Text>
                        <Text
                          numberOfLines={1}
                          ellipsizeMode="tail"
                          style={{
                            color: "rgba(255,255,255,0.8)",
                            fontFamily: FONT.Regular,
                            fontSize: 12,
                          }}
                        >
                          {msg.replyTo.text}
                        </Text>
                      </View>
                    )}

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
                          source={require("../../../assets/images/double-tick.png")}
                          style={{
                            width: 16,
                            height: 12,
                            marginLeft: 2,
                            tintColor: msg.isRead ? "#FCCD34" : "#666",
                          }}
                          resizeMode="contain"
                        />
                      )}
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
          </ScrollView>
        )}
      </ImageBackground>

      {/* Input Area */}
      <View className="bg-black px-4 pb-5 pt-3">
        <View className="flex-row items-end">
          <TouchableOpacity
            className="mr-3 mb-2"
            onPress={() => setShowGallery(true)}
          >
            <Plus size={28} color="#FCCD34" />
          </TouchableOpacity>

          <View style={{ flex: 1 }}>
            {replyTo && (
              <View
                style={{
                  backgroundColor: "black",
                  borderTopLeftRadius: 16,
                  borderTopRightRadius: 16,
                  borderBottomLeftRadius: 0,
                  borderBottomRightRadius: 0,
                  paddingVertical: 8,
                  paddingHorizontal: 16,
                  borderColor: "#585858",
                  borderWidth: 0.3,
                  marginBottom: 0,
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Text
                    style={{
                      color: "#FCCD34",
                      fontFamily: FONT.SemiBold,
                      fontSize: 13,
                    }}
                  >
                    Reply to {replyTo.isSent ? "You" : influencerName}
                  </Text>

                  <TouchableOpacity onPress={() => setReplyTo(null)}>
                    <Image
                      source={require("../../../assets/images/white-cross.png")}
                      style={{
                        width: 14,
                        height: 14,
                        tintColor: "rgba(255,255,255,0.6)",
                      }}
                      resizeMode="contain"
                    />
                  </TouchableOpacity>
                </View>

                <Text
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  style={{
                    color: "rgba(255,255,255,0.5)",
                    fontFamily: FONT.Regular,
                    fontSize: 12,
                    marginTop: 2,
                  }}
                >
                  {replyTo.text}
                </Text>
              </View>
            )}

            <View
              style={{
                minHeight: 48,
                maxHeight: 120,
                borderRadius: replyTo ? 0 : 24,
                borderTopLeftRadius: replyTo ? 0 : 24,
                borderTopRightRadius: replyTo ? 0 : 24,
                borderBottomLeftRadius: 24,
                borderBottomRightRadius: 24,
                borderWidth: 1,
                borderColor: "#3A3A3A",
                backgroundColor: "#19191B",
                paddingHorizontal: 16,
                paddingVertical: 12,
                flexDirection: "row",
                alignItems: "flex-end",
              }}
            >
              <TextInput
                ref={textInputRef}
                value={message}
                onChangeText={handleTextChange}
                placeholder="Type your message (0.05 Gel)"
                placeholderTextColor="#6B7280"
                style={{
                  flex: 1,
                  fontSize: 15,
                  fontFamily: FONT.Regular,
                  color: "white",
                  paddingTop: 2,
                  paddingBottom: 2,
                  maxHeight: 96,
                }}
                multiline
                onContentSizeChange={(e) => {
                  const newHeight = Math.max(
                    48,
                    Math.min(120, e.nativeEvent.contentSize.height + 24)
                  );
                  setInputHeight(newHeight);
                }}
              />

              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginLeft: 8,
                }}
              >
                {message.length > 0 && (
                  <Text
                    style={{
                      color: "#6B7280",
                      fontSize: 12,
                      fontFamily: FONT.Regular,
                      marginRight: 8,
                    }}
                  >
                    {charCount}/60
                  </Text>
                )}

                <TouchableOpacity
                  onPress={handleSendMessage}
                  disabled={message.trim() === ""}
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 16,
                    backgroundColor: message.trim() ? "#FCCD34" : "#FCCD34",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Image
                    source={require("../../../assets/images/Right.png")}
                    style={{ width: 26, height: 26, resizeMode: "contain" }}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </View>

      {/* Context Menu Modal */}
      <Modal
        visible={contextMenu !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setContextMenu(null)}
      >
        <Pressable
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.7)",
            justifyContent: "center",
            alignItems: "center",
          }}
          onPress={() => setContextMenu(null)}
        >
          <View
            style={{
              width: 170,
              backgroundColor: "#1C1C1E",
              borderRadius: 10,
              paddingVertical: 8,
              overflow: "hidden",
              transform: [{ translateY: -10 }],
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 6 },
              shadowOpacity: 0.4,
              shadowRadius: 12,
              elevation: 10,
            }}
          >
            {[
              {
                key: "reply",
                label: "Reply",
                icon: require("../../../assets/images/reply-icon.png"),
                width: 21,
                height: 21,
                onPress: handleReply,
                color: "#FFFFFF",
              },
              {
                key: "copy",
                label: "Copy",
                icon: require("../../../assets/images/copy-icon.png"),
                onPress: handleCopy,
                color: "#FFFFFF",
              },
              ...(contextMenu?.isSent
                ? [
                  {
                    key: "edit",
                    label: "Edit",
                    icon: require("../../../assets/images/edit-icon.png"),
                    onPress: handleEdit,
                    color: "#FFFFFF",
                  },
                  {
                    key: "delete",
                    label: "Delete",
                    icon: require("../../../assets/images/delete-icon.png"),
                    onPress: handleDelete,
                    color: "#FFFFFF",
                  },
                ]
                : [
                  {
                    key: "report",
                    label: "Report",
                    icon: require("../../../assets/images/report-icon.png"),
                    onPress: handleReport,
                    color: "#FFFFFF",
                  },
                ]),
            ].map((item, idx, arr) => (
              <React.Fragment key={item.key}>
                <TouchableOpacity
                  onPress={() => {
                    item.onPress();
                  }}
                  activeOpacity={0.7}
                  style={{
                    height: 48,
                    paddingHorizontal: 16,
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <Image
                    source={item.icon}
                    style={{
                      width: 22,
                      height: 22,
                      marginRight: 14,
                      resizeMode: "contain",
                      tintColor: item.color,
                    }}
                  />
                  <Text
                    style={{
                      color: item.color,
                      fontSize: 17,
                      fontFamily: FONT.Regular,
                    }}
                  >
                    {item.label}
                  </Text>
                </TouchableOpacity>
                {idx < arr.length - 1 && (
                  <View
                    style={{
                      height: 1,
                      backgroundColor: "rgba(255,255,255,0.1)",
                      marginLeft: 52,
                    }}
                  />
                )}
              </React.Fragment>
            ))}
          </View>
        </Pressable>
      </Modal>

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
                        className={`absolute top-2 right-2 w-6 h-6 rounded-full border-2 ${isSelected
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
                    className={`text-base font-semibold ${selectedTab === "photos" ? "text-white" : "text-white/50"
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
                    className={`text-base font-semibold ${selectedTab === "videos"
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

      {/* Video Call Modal */}
      <Modal
        visible={showVideoCall}
        animationType="fade"
        onRequestClose={() => {
          setShowVideoCall(false);
          setCallDuration(0);
          setIsConnecting(true);
        }}
      >
        <StatusBar barStyle="light-content" />

        <ImageBackground
          source={require("../../../assets/images/girl.png")}
          className="flex-1"
          resizeMode="cover"
        >
          {/* Back Button - Top Left */}
          <View className="absolute top-12 left-5 z-20">
            <TouchableOpacity
              onPress={() => {
                setShowVideoCall(false);
                setCallDuration(0);
                setIsConnecting(true);
              }}
            >
              <ChevronLeft size={32} color="white" />
            </TouchableOpacity>
          </View>

          {/* Header */}
          <View className="pt-12 px-5 items-center">
            <View className="w-20 h-20 rounded-full overflow-hidden mb-4 border-2 border-red-500">
              <Image
                source={require("../../../assets/images/boy.png")}
                style={{ width: "100%", height: "100%" }}
                resizeMode="cover"
              />
            </View>

            <Text
              className="text-white text-2xl mb-2"
              style={{ fontFamily: FONT.SemiBold }}
            >
              {influencerName || "User"}
            </Text>

            <Text
              className="text-white text-lg"
              style={{ fontFamily: FONT.Regular }}
            >
              {isConnecting
                ? "connecting..."
                : formatCallDuration(callDuration)}
            </Text>
          </View>

          {/* Bottom Controls with Gradient Background */}
          <View className="absolute bottom-0 left-0 right-0">
            {/* Gradient Overlay - Behind the video preview */}
            <View
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                height: 200,
                backgroundColor: "rgba(15, 15, 16, 0.5)",
              }}
            />

            {/* Small Video Preview - Above gradient, positioned precisely */}
            {!isConnecting && (
              <View
                style={{
                  position: "absolute",
                  width: 147,
                  height: 174,
                  right: 20,
                  bottom: 230,
                  borderRadius: 12.43,
                  overflow: "hidden",
                  borderWidth: 2,
                  borderColor: "rgba(255, 255, 255, 0.3)",
                  zIndex: 10,
                }}
              >
                <Image
                  source={require("../../../assets/images/boy.png")}
                  style={{ width: "100%", height: "100%" }}
                  resizeMode="cover"
                />
              </View>
            )}

            <View className="pb-12 px-5" style={{ zIndex: 5 }}>
              <View className="flex-row justify-center items-center gap-8">
                {/* Video Toggle */}
                <View className="items-center">
                  <TouchableOpacity
                    className="w-16 h-16 rounded-full items-center justify-center"
                    style={{ backgroundColor: "rgba(255, 255, 255, 0.2)" }}
                    onPress={() => setIsVideoEnabled(!isVideoEnabled)}
                  >
                    <Image
                      source={require("../../../assets/images/camera.png")}
                      style={{
                        width: 28,
                        height: 28,
                        tintColor: "white",
                      }}
                      resizeMode="contain"
                    />
                  </TouchableOpacity>
                  <Text
                    className="text-white text-base mt-2"
                    style={{ fontFamily: FONT.Medium }}
                  >
                    Video
                  </Text>
                </View>

                {/* Mute Toggle */}
                <View className="items-center">
                  <TouchableOpacity
                    className="w-16 h-16 rounded-full items-center justify-center"
                    style={{ backgroundColor: "rgba(255, 255, 255, 0.2)" }}
                    onPress={() => setIsMuted(!isMuted)}
                  >
                    <Image
                      source={require("../../../assets/images/Mic-off.png")}
                      style={{
                        width: 28,
                        height: 28,
                        tintColor: "white",
                      }}
                      resizeMode="contain"
                    />
                  </TouchableOpacity>
                  <Text
                    className="text-white text-base mt-2"
                    style={{ fontFamily: FONT.Medium }}
                  >
                    Mute
                  </Text>
                </View>

                {/* Flip Camera */}
                <View className="items-center">
                  <TouchableOpacity
                    className="w-16 h-16 rounded-full items-center justify-center"
                    style={{ backgroundColor: "rgba(255, 255, 255, 0.2)" }}
                  >
                    <Image
                      source={require("../../../assets/images/camera.png")}
                      style={{
                        width: 28,
                        height: 28,
                        tintColor: "white",
                      }}
                      resizeMode="contain"
                    />
                  </TouchableOpacity>
                  <Text
                    className="text-white text-base mt-2"
                    style={{ fontFamily: FONT.Medium }}
                  >
                    Flip
                  </Text>
                </View>

                {/* End Call */}
                <View className="items-center">
                  <TouchableOpacity
                    className="w-16 h-16 rounded-full bg-red-500 items-center justify-center"
                    onPress={() => {
                      setShowVideoCall(false);
                      setCallDuration(0);
                      setIsConnecting(true);
                    }}
                  >
                    <Text className="text-white text-3xl font-bold">✕</Text>
                  </TouchableOpacity>
                  <Text
                    className="text-white text-base mt-2"
                    style={{ fontFamily: FONT.Medium }}
                  >
                    End
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </ImageBackground>
      </Modal>

      {/* Audio Call Modal */}
      <Modal
        visible={showAudioCall}
        animationType="fade"
        onRequestClose={() => {
          setShowAudioCall(false);
          setCallDuration(0);
          setAudioCallStatus("requesting");
        }}
      >
        <StatusBar barStyle="light-content" />

        <LinearGradient
          colors={["#0F0F10", "#4A3B0A"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          className="flex-1"
        >
          {/* Back Button - Top Left */}
          <View className="absolute top-12 left-5 z-20">
            <TouchableOpacity
              onPress={() => {
                setShowAudioCall(false);
                setCallDuration(0);
                setAudioCallStatus("requesting");
              }}
            >
              <ChevronLeft size={32} color="white" />
            </TouchableOpacity>
          </View>

          {/* Center Content */}
          <View className="flex-1 items-center justify-center px-5">
            {/* Profile Picture */}
            <View
              className="w-32 h-32 rounded-full overflow-hidden mb-8"
              style={{
                borderWidth: audioCallStatus === "requesting" ? 4 : 0,
                borderColor: "#FCCD34",
              }}
            >
              <Image
                source={
                  influencerImage
                    ? { uri: influencerImage }
                    : require("../../../assets/images/boy.png")
                }
                style={{ width: "100%", height: "100%" }}
                resizeMode="cover"
              />
            </View>

            {/* Name */}
            <Text
              className="text-white text-3xl mb-3"
              style={{ fontFamily: FONT.SemiBold }}
            >
              {influencerName || "User"}
            </Text>

            {/* Status Text */}
            <Text
              className="text-gray-400 text-lg"
              style={{ fontFamily: FONT.Regular }}
            >
              {audioCallStatus === "requesting" && "Requesting..."}
              {audioCallStatus === "connected" &&
                formatCallDuration(callDuration)}
              {audioCallStatus === "ended" && "Call ended"}
            </Text>
          </View>

          {/* Bottom Controls */}
          <View className="pb-12 px-5">
            {/* Bottom indicator line */}
            <View className="items-center mb-8">
              <View
                className="bg-gray-500 rounded-full"
                style={{
                  width: 134,
                  height: 5,
                }}
              />
            </View>

            <View className="flex-row justify-center items-center gap-8">
              {/* Audio Toggle */}
              <View className="items-center">
                <TouchableOpacity
                  className="w-16 h-16 rounded-full items-center justify-center"
                  style={{
                    backgroundColor:
                      audioCallStatus === "ended"
                        ? "rgba(255, 255, 255, 0.1)"
                        : "#FCCD34",
                  }}
                  disabled={audioCallStatus === "ended"}
                >
                  <Phone
                    size={28}
                    color={audioCallStatus === "ended" ? "white" : "white"}
                    fill="white"
                  />
                </TouchableOpacity>
                <Text
                  className="text-white text-base mt-2"
                  style={{ fontFamily: FONT.Medium }}
                >
                  Audio
                </Text>
              </View>

              {/* Video Toggle */}
              <View className="items-center">
                <TouchableOpacity
                  className="w-16 h-16 rounded-full items-center justify-center"
                  style={{
                    backgroundColor:
                      audioCallStatus === "ended"
                        ? "rgba(255, 255, 255, 0.1)"
                        : "rgba(255, 255, 255, 0.2)",
                  }}
                  disabled={audioCallStatus === "ended"}
                >
                  <Image
                    source={require("../../../assets/images/camera.png")}
                    style={{
                      width: 28,
                      height: 28,
                      tintColor: "white",
                    }}
                    resizeMode="contain"
                  />
                </TouchableOpacity>
                <Text
                  className="text-white text-base mt-2"
                  style={{ fontFamily: FONT.Medium }}
                >
                  Video
                </Text>
              </View>

              {/* Mute Toggle */}
              <View className="items-center">
                <TouchableOpacity
                  className="w-16 h-16 rounded-full items-center justify-center"
                  style={{
                    backgroundColor:
                      audioCallStatus === "ended"
                        ? "rgba(255, 255, 255, 0.1)"
                        : "rgba(255, 255, 255, 0.2)",
                  }}
                  onPress={() => setIsMuted(!isMuted)}
                  disabled={audioCallStatus === "ended"}
                >
                  <Image
                    source={require("../../../assets/images/Mic-off.png")}
                    style={{
                      width: 28,
                      height: 28,
                      tintColor: "white",
                    }}
                    resizeMode="contain"
                  />
                </TouchableOpacity>
                <Text
                  className="text-white text-base mt-2"
                  style={{ fontFamily: FONT.Medium }}
                >
                  Mute
                </Text>
              </View>

              {/* End Call */}
              <View className="items-center">
                <TouchableOpacity
                  className="w-16 h-16 rounded-full bg-red-500 items-center justify-center"
                  onPress={() => {
                    if (audioCallStatus === "ended") {
                      setShowAudioCall(false);
                      setCallDuration(0);
                      setAudioCallStatus("requesting");
                    } else {
                      setAudioCallStatus("ended");
                      setTimeout(() => {
                        setShowAudioCall(false);
                        setCallDuration(0);
                        setAudioCallStatus("requesting");
                      }, 2000);
                    }
                  }}
                >
                  <Text className="text-white text-3xl font-bold">✕</Text>
                </TouchableOpacity>
                <Text
                  className="text-white text-base mt-2"
                  style={{ fontFamily: FONT.Medium }}
                >
                  End
                </Text>
              </View>
            </View>
          </View>
        </LinearGradient>
      </Modal>
    </KeyboardAvoidingView>
  );
}