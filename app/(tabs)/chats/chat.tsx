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
  Keyboard,
  TouchableWithoutFeedback,
  PermissionsAndroid,
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
  verifyAuthentication,
} from "../../../utils/authHelpers";

import {
  createAgoraRtcEngine,
  IRtcEngine,
  ChannelProfileType,
  ClientRoleType,
  RtcSurfaceView,
} from "react-native-agora";
import { AGORA_APP_ID, AGORA_DEV_TOKEN } from "../../../constants/agoraConfig";

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

const requestAgoraPermissions = async () => {
  if (Platform.OS !== "android") return true;

  try {
    const granted = await PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.CAMERA,
      PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
    ]);

    const cameraGranted =
      granted[PermissionsAndroid.PERMISSIONS.CAMERA] ===
      PermissionsAndroid.RESULTS.GRANTED;
    const micGranted =
      granted[PermissionsAndroid.PERMISSIONS.RECORD_AUDIO] ===
      PermissionsAndroid.RESULTS.GRANTED;

    return cameraGranted && micGranted;
  } catch (e) {
    console.warn("Permission error", e);
    return false;
  }
};

export default function Chat() {
  // ⚠️ safer params handling
  const params = useLocalSearchParams<{
    conversationId?: string;
    name?: string;
    image?: string;
    isOnline?: string;
    isVerified?: string;
    otherUserId?: string;
  }>();

  const conversationId = params.conversationId;
  const otherUserName = params.name ?? "";
  const otherUserImage = params.image ?? "";
  const isOnline = params.isOnline === "true";
  const isVerified = params.isVerified === "true";
  const otherUserId = params.otherUserId ?? "";

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
  const [hasEverHadMessages, setHasEverHadMessages] = useState(false);

  // Agora
  const agoraEngineRef = useRef<IRtcEngine | null>(null);
  const [remoteUid, setRemoteUid] = useState<number | null>(null);
  const [localUid] = useState<number>(() => Math.floor(Math.random() * 100000));
  const [isVideoCall, setIsVideoCall] = useState<boolean>(true);

  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  const initAgoraEngine = async () => {
    if (agoraEngineRef.current) return;

    const engine = createAgoraRtcEngine();
    engine.initialize({
      appId: AGORA_APP_ID,
      channelProfile: ChannelProfileType.ChannelProfileCommunication,
    });

    engine.addListener("onUserJoined", (_connection, uid) => {
      console.log("Remote user joined", uid);
      setRemoteUid(uid);
    });

    engine.addListener("onUserOffline", (_connection, uid) => {
      console.log("Remote user left", uid);
      setRemoteUid(null);
    });

    engine.addListener("onJoinChannelSuccess", (_connection, _uid) => {
      console.log("Joined channel successfully");
      setIsConnecting(false);
      if (!isVideoCall) {
        setAudioCallStatus("connected");
      }
    });

    agoraEngineRef.current = engine;
  };

  const endAgoraCall = async () => {
    try {
      if (agoraEngineRef.current) {
        await agoraEngineRef.current.leaveChannel();
      }
    } catch (e) {
      console.warn("leaveChannel error", e);
    }
    setRemoteUid(null);
    setCallDuration(0);
    setIsConnecting(true);
    setAudioCallStatus("requesting");
    setIsMuted(false);
    setIsVideoEnabled(true);
  };

  // destroy engine on unmount
  useEffect(() => {
    return () => {
      if (agoraEngineRef.current) {
        agoraEngineRef.current.leaveChannel();
        agoraEngineRef.current.release();
        agoraEngineRef.current = null;
      }
    };
  }, []);

  // 🔒 Early guard: if chat is opened without a valid conversationId, exit gracefully
  useEffect(() => {
    if (!conversationId || conversationId === "undefined") {
      console.warn(
        "Chat opened without a valid conversationId:",
        conversationId
      );
      Alert.alert("Error", "Unable to open chat: invalid conversation.");
      router.back();
    }
  }, [conversationId]);
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        setTimeout(() => {
          scrollViewRef.current?.scrollToEnd({ animated: true });
        }, 100);
      }
    );

    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        // Keyboard hidden
      }
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  // Get current user and initialize conversation (only when conversationId is valid)
  useEffect(() => {
    if (!conversationId || conversationId === "undefined") return;
    initializeChat();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversationId]);

  // Enhanced real-time subscription
  useEffect(() => {
    if (!conversationId || !currentUserId) return;

    console.log(
      `Setting up enhanced real-time subscription for conversation: ${conversationId}`
    );

    const subscription = supabase
      .channel(`conversation:${conversationId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "messages",
          filter: `conversation_id=eq.${conversationId}`,
        },
        async (payload) => {
          console.log("Real-time update received:", payload);

          switch (payload.eventType) {
            case "INSERT":
              await handleNewMessage(payload.new);
              break;
            case "UPDATE":
              await handleUpdatedMessage(payload.new);
              break;
            case "DELETE":
              await handleDeletedMessage(payload.old);
              break;
          }
        }
      )
      .on("system" as any, { event: "connected" }, () => {
        console.log("Realtime connected");
        setIsRealtimeConnected(true);
      })
      .on("system" as any, { event: "disconnected" }, () => {
        console.log("Realtime disconnected");
        setIsRealtimeConnected(false);
      })
      .subscribe((status) => {
        console.log("Subscription status:", status);
        if (status === "SUBSCRIBED") {
          console.log("Successfully subscribed to real-time updates");
        } else if (status === "CHANNEL_ERROR") {
          console.error("Channel error in real-time subscription");
        } else if (status === "TIMED_OUT") {
          console.error("Real-time subscription timed out");
        }
      });

    // Cleanup function
    return () => {
      console.log(
        `Cleaning up real-time subscription for conversation: ${conversationId}`
      );
      subscription.unsubscribe();
    };
  }, [conversationId, currentUserId]);

  const handleNewMessage = async (newMessage: any) => {
    console.log("Processing new message:", newMessage);

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
      const exists = prev.some((msg) => msg.id === formattedMessage.id);
      if (exists) {
        console.log("Message already exists, skipping:", formattedMessage.id);
        return prev;
      }

      console.log("Adding new message to state:", formattedMessage.id);

      // ✅ Mark that messages exist now
      setHasEverHadMessages(true);

      return [...prev, formattedMessage];
    });

    // If message is from other user, mark as read immediately
    if (newMessage.sender_id !== currentUserId) {
      console.log("Marking message as read:", newMessage.id);
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
    console.log("Processing updated message:", updatedMessage);

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
    console.log("Processing deleted message:", deletedMessage);

    setMessages((prev) => prev.filter((msg) => msg.id !== deletedMessage.id));
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

      // ✅ ConversationId is already validated in the early guard, so no extra check here

      console.log("Conversation ID:", conversationId);

      // Step 4: Verify conversation exists and user has access
      const { data: conversation, error } = await supabase
        .from("conversations")
        .select(
          `
        id,
        regular_user_id,
        regular_user_id2,
        is_active
      `
        )
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
      const isUser1 = conversation.regular_user_id === currentUser.id;
      const isUser2 = conversation.regular_user_id2 === currentUser.id;

      console.log("Access check:", {
        currentUserId: currentUser.id,
        user1Id: conversation.regular_user_id,
        user2Id: conversation.regular_user_id2,
        isUser1,
        isUser2,
      });

      if (!isUser1 && !isUser2) {
        console.error("User does not have access to this conversation");
        Alert.alert("Error", "You don't have access to this conversation");
        router.back();
        return;
      }

      console.log("User has access to conversation");

      // Step 6: Load messages for this conversation
      await loadMessages(conversationId as string, currentUser.id);
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

      // ✅ Track if this conversation has ever had messages
      if (messagesData && messagesData.length > 0) {
        setHasEverHadMessages(true);
      }

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
          read_at: new Date().toISOString(),
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
          read_at: new Date().toISOString(),
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
            is_read: false,
            read_at: null,
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

        // ✅ Mark that this conversation now has messages
        setHasEverHadMessages(true);

        // Add the new message to local state with correct read status
        const formattedMessage: Message = {
          id: newMessage.id,
          text: newMessage.content,
          timestamp: formatMessageTime(newMessage.created_at),
          isSent: true,
          isRead: false,
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

  const showWelcomeScreen =
    !hasEverHadMessages && messages.length === 0 && !loading;

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-black"
      behavior={Platform.OS === "ios" ? "padding" : "height"} // Changed for Android
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20} // Better offset
      enabled={true}
    >
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View className="bg-black pt-14 pb-3 px-4 flex-row items-center justify-between">
        <View className="flex-row items-center flex-1">
          <TouchableOpacity className="mr-4" onPress={() => router.back()}>
            <ChevronLeft size={28} color="white" />
          </TouchableOpacity>
          <View className="w-12 h-12 rounded-full bg-gray-700 mr-3 overflow-hidden">
            <Image
              source={
                otherUserImage
                  ? { uri: otherUserImage }
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
              {otherUserName || "User"}
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
          {/* AUDIO CALL */}
          <TouchableOpacity
            className="mr-4"
            onPress={async () => {
              if (!conversationId || !currentUserId) return;

              const ok = await requestAgoraPermissions();
              if (!ok) {
                Alert.alert(
                  "Permissions",
                  "Camera/Mic permission is required."
                );
                return;
              }

              setIsVideoCall(false);
              setShowAudioCall(true);
              setAudioCallStatus("requesting");
              setIsConnecting(true);
              setCallDuration(0);

              await initAgoraEngine();
              const engine = agoraEngineRef.current;
              if (!engine) return;

              try {
                await engine.enableAudio();
                await engine.disableVideo();

                await engine.joinChannel(
                  AGORA_DEV_TOKEN,
                  String(conversationId),
                  localUid,
                  {
                    clientRoleType: ClientRoleType.ClientRoleBroadcaster,
                  }
                );
              } catch (e) {
                console.error("Join audio channel error", e);
                Alert.alert("Call error", "Could not join audio call.");
                setShowAudioCall(false);
                setAudioCallStatus("requesting");
              }
            }}
          >
            <Phone size={24} color="white" fill="white" />
          </TouchableOpacity>

          {/* VIDEO CALL */}
          <TouchableOpacity
            onPress={async () => {
              if (!conversationId || !currentUserId) return;

              const ok = await requestAgoraPermissions();
              if (!ok) {
                Alert.alert(
                  "Permissions",
                  "Camera/Mic permission is required."
                );
                return;
              }

              setIsVideoCall(true);
              setShowVideoCall(true);
              setIsConnecting(true);
              setCallDuration(0);

              await initAgoraEngine();
              const engine = agoraEngineRef.current;
              if (!engine) return;

              try {
                await engine.enableVideo();
                await engine.enableAudio();

                await engine.joinChannel(
                  AGORA_DEV_TOKEN,
                  String(conversationId),
                  localUid,
                  {
                    clientRoleType: ClientRoleType.ClientRoleBroadcaster,
                  }
                );
              } catch (e) {
                console.error("Join video channel error", e);
                Alert.alert("Call error", "Could not join video call.");
                setShowVideoCall(false);
              }
            }}
          >
            <Video size={24} color="white" fill="white" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Balance Card */}
      <View className="px-2 mt-4">
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
              width: 92,
              height: 26,
              backgroundColor: "#FCCD34",
              borderRadius: 10,
              paddingHorizontal: 5,
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "row",
              gap: 3, // Figma gap
            }}
          >
            <Text
              style={{
                width: 73,
                height: 10,
                color: "black",
                fontSize: 12,
                fontFamily: FONT.Medium, // Poppins 500
                fontWeight: "500",
                lineHeight: 14, // line-height: 100%
                letterSpacing: 0,
                textAlignVertical: "center",
                includeFontPadding: false, // closer to Figma
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
                  {otherUserName || "this user"}.
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
            keyboardShouldPersistTaps="handled"
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
              .filter(
                (msg, index, self) =>
                  index === self.findIndex((m) => m.id === msg.id)
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
                          {msg.replyTo.isSent ? "You" : otherUserName}
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
            onPress={() => {
              Keyboard.dismiss(); // Add this
              setShowGallery(true);
            }}
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
                    Reply to {replyTo.isSent ? "You" : otherUserName}
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
                blurOnSubmit={false} // Add this
                returnKeyType="default" // Add this
                enablesReturnKeyAutomatically={false}
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
                    width: 41,
                    height: 27,
                    borderRadius: 16,
                    backgroundColor: message.trim() ? "#FCCD34" : "#FCCD34",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Image
                    source={require("../../../assets/images/send-text.png")}
                    style={{ width: 16, height: 16, resizeMode: "contain" }}
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
                      selectedTab === "photos" ? "text-white" : "text-white/50"
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

      {/* Video Call Modal */}
      <Modal
        visible={showVideoCall}
        animationType="fade"
        onRequestClose={async () => {
          await endAgoraCall();
          setShowVideoCall(false);
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
              onPress={async () => {
                await endAgoraCall();
                setShowVideoCall(false);
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
              {otherUserName || "User"}
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

          {/* VIDEO AREA */}
          <View style={{ flex: 1, marginTop: 16 }}>
            {remoteUid !== null ? (
              <RtcSurfaceView style={{ flex: 1 }} canvas={{ uid: remoteUid }} />
            ) : (
              <View className="flex-1 items-center justify-center">
                <Text
                  style={{
                    color: "white",
                    fontFamily: FONT.Regular,
                    fontSize: 16,
                  }}
                >
                  Waiting for other user to join…
                </Text>
              </View>
            )}

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
                <RtcSurfaceView
                  style={{ flex: 1 }}
                  canvas={{ uid: localUid }}
                />
              </View>
            )}
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

            <View className="pb-12 px-5" style={{ zIndex: 5 }}>
              <View className="flex-row justify-center items-center gap-8">
                {/* Video Toggle */}
                <View className="items-center">
                  <TouchableOpacity
                    className="w-16 h-16 rounded-full items-center justify-center"
                    style={{ backgroundColor: "rgba(255, 255, 255, 0.2)" }}
                    onPress={() => {
                      const next = !isVideoEnabled;
                      setIsVideoEnabled(next);
                      if (agoraEngineRef.current) {
                        agoraEngineRef.current.enableLocalVideo(next);
                      }
                    }}
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
                    onPress={() => {
                      const next = !isMuted;
                      setIsMuted(next);
                      if (agoraEngineRef.current) {
                        agoraEngineRef.current.muteLocalAudioStream(next);
                      }
                    }}
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
                    onPress={() => {
                      if (agoraEngineRef.current) {
                        agoraEngineRef.current.switchCamera();
                      }
                    }}
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
                    onPress={async () => {
                      await endAgoraCall();
                      setShowVideoCall(false);
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
        onRequestClose={async () => {
          await endAgoraCall();
          setShowAudioCall(false);
        }}
        statusBarTranslucent
      >
        <StatusBar barStyle="light-content" />

        <View style={{ flex: 1, backgroundColor: "#0F0F10" }}>
          <LinearGradient
            colors={["#0F0F10", "#4A3B0A"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={{ flex: 1 }}
          >
            {/* Back Button - Top Left */}
            <View
              style={{ position: "absolute", top: 50, left: 20, zIndex: 20 }}
            >
              <TouchableOpacity
                onPress={async () => {
                  await endAgoraCall();
                  setShowAudioCall(false);
                }}
              >
                <ChevronLeft size={32} color="white" />
              </TouchableOpacity>
            </View>

            {/* Center Content */}
            <View
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
                paddingHorizontal: 20,
              }}
            >
              {/* Profile Picture */}
              <View
                style={{
                  width: 160,
                  height: 160,
                  borderRadius: 80,
                  overflow: "hidden",
                  marginBottom: 32,
                  borderWidth: audioCallStatus === "requesting" ? 4 : 0,
                  borderColor: "#FCCD34",
                }}
              >
                <Image
                  source={
                    otherUserImage
                      ? { uri: otherUserImage }
                      : require("../../../assets/images/boy.png")
                  }
                  style={{ width: "100%", height: "100%" }}
                  resizeMode="cover"
                />
              </View>

              {/* Name */}
              <Text
                style={{
                  color: "white",
                  fontSize: 28,
                  fontFamily: FONT.SemiBold,
                  marginBottom: 12,
                }}
              >
                {otherUserName || "User"}
              </Text>

              {/* Status Text */}
              <Text
                style={{
                  color: "#9CA3AF",
                  fontSize: 18,
                  fontFamily: FONT.Regular,
                }}
              >
                {audioCallStatus === "requesting" && "Requesting..."}
                {audioCallStatus === "connected" &&
                  formatCallDuration(callDuration)}
                {audioCallStatus === "ended" && "Call ended"}
              </Text>
            </View>

            {/* Bottom Controls - Fixed positioning */}
            <View
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                paddingBottom: 50,
                paddingHorizontal: 20,
                backgroundColor: "rgba(15, 15, 16, 0.5)",
              }}
            >
              {/* Bottom indicator line */}
              <View style={{ alignItems: "center", marginBottom: 32 }}>
                <View
                  style={{
                    width: 134,
                    height: 5,
                    backgroundColor: "rgba(255, 255, 255, 0.3)",
                    borderRadius: 2.5,
                  }}
                />
              </View>

              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-around",
                  alignItems: "center",
                  paddingHorizontal: 10,
                }}
              >
                {/* Audio Toggle */}
                <View style={{ alignItems: "center" }}>
                  <TouchableOpacity
                    style={{
                      width: 70,
                      height: 70,
                      borderRadius: 35,
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor:
                        audioCallStatus === "ended"
                          ? "rgba(255, 255, 255, 0.1)"
                          : "#FCCD34",
                    }}
                    disabled={audioCallStatus === "ended"}
                  >
                    <Phone size={32} color="white" fill="white" />
                  </TouchableOpacity>
                  <Text
                    style={{
                      color: "white",
                      fontSize: 14,
                      fontFamily: FONT.Medium,
                      marginTop: 8,
                    }}
                  >
                    Audio
                  </Text>
                </View>

                {/* Video Toggle */}
                <View style={{ alignItems: "center" }}>
                  <TouchableOpacity
                    style={{
                      width: 70,
                      height: 70,
                      borderRadius: 35,
                      alignItems: "center",
                      justifyContent: "center",
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
                        width: 32,
                        height: 32,
                        tintColor: "white",
                      }}
                      resizeMode="contain"
                    />
                  </TouchableOpacity>
                  <Text
                    style={{
                      color: "white",
                      fontSize: 14,
                      fontFamily: FONT.Medium,
                      marginTop: 8,
                    }}
                  >
                    Video
                  </Text>
                </View>

                {/* Mute Toggle */}
                <View style={{ alignItems: "center" }}>
                  <TouchableOpacity
                    style={{
                      width: 70,
                      height: 70,
                      borderRadius: 35,
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor:
                        audioCallStatus === "ended"
                          ? "rgba(255, 255, 255, 0.1)"
                          : "rgba(255, 255, 255, 0.2)",
                    }}
                    onPress={() => {
                      const next = !isMuted;
                      setIsMuted(next);
                      if (agoraEngineRef.current) {
                        agoraEngineRef.current.muteLocalAudioStream(next);
                      }
                    }}
                    disabled={audioCallStatus === "ended"}
                  >
                    <Image
                      source={require("../../../assets/images/Mic-off.png")}
                      style={{
                        width: 32,
                        height: 32,
                        tintColor: "white",
                      }}
                      resizeMode="contain"
                    />
                  </TouchableOpacity>
                  <Text
                    style={{
                      color: "white",
                      fontSize: 14,
                      fontFamily: FONT.Medium,
                      marginTop: 8,
                    }}
                  >
                    Mute
                  </Text>
                </View>

                {/* End Call */}
                <View style={{ alignItems: "center" }}>
                  <TouchableOpacity
                    style={{
                      width: 70,
                      height: 70,
                      borderRadius: 35,
                      backgroundColor: "#EF4444",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                    onPress={async () => {
                      if (audioCallStatus === "ended") {
                        await endAgoraCall();
                        setShowAudioCall(false);
                      } else {
                        setAudioCallStatus("ended");
                        await endAgoraCall();
                        setTimeout(() => {
                          setShowAudioCall(false);
                          setAudioCallStatus("requesting");
                        }, 1000);
                      }
                    }}
                  >
                    <Text
                      style={{
                        color: "white",
                        fontSize: 28,
                        fontWeight: "bold",
                      }}
                    >
                      ✕
                    </Text>
                  </TouchableOpacity>
                  <Text
                    style={{
                      color: "white",
                      fontSize: 14,
                      fontFamily: FONT.Medium,
                      marginTop: 8,
                    }}
                  >
                    End
                  </Text>
                </View>
              </View>
            </View>
          </LinearGradient>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}
