import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Image,
  ActivityIndicator,
  Modal,
  Animated,
  PanResponder,
  Dimensions,
} from "react-native";
import { ChevronLeft, Search } from "lucide-react-native";
import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
} from "@expo-google-fonts/poppins";
import { router, useFocusEffect } from "expo-router";
import { supabase } from "../../../supabaseClient";
import {
  getCurrentUser,
  verifyAuthentication
} from "../../../utils/authHelpers";

const FONT = {
  Regular: "Poppins_400Regular",
  Medium: "Poppins_500Medium",
  SemiBold: "Poppins_600SemiBold",
  Bold: "Poppins_700Bold",
};

const { width: SCREEN_WIDTH } = Dimensions.get("window");

interface FavoritePerson {
  id: string;
  name: string;
  image: string;
}

interface Chat {
  id: string;
  name: string;
  message: string;
  time: string;
  image?: any;
  isVerified?: boolean;
  isOnline?: boolean;
  unreadCount?: number;
  isDoubleTick?: boolean;
  isSupport?: boolean;
  isPinned?: boolean;
  conversationId?: string;
  influencerId?: string;
}

export default function ChatsPerson() {
  const [searchText, setSearchText] = useState("");
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showAllFavorites, setShowAllFavorites] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("Unread");
  const [swipedChatId, setSwipedChatId] = useState<string | null>(null);
  const [longPressedChat, setLongPressedChat] = useState<Chat | null>(null);
  const [showUnreadModal, setShowUnreadModal] = useState(false);
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  const swipeAnims = useRef<Record<string, Animated.Value>>({});
  const panResponders = useRef<Record<string, any>>({});

  const favorites: FavoritePerson[] = [
    {
      id: "1",
      name: "Gyllinton",
      image:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100",
    },
    {
      id: "2",
      name: "Alex Collins...",
      image:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100",
    },
    {
      id: "3",
      name: "Margo Millen",
      image:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100",
    },
    {
      id: "4",
      name: "Margo Millen",
      image:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100",
    },
    {
      id: "5",
      name: "Anna Vintour",
      image:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100",
    },
  ];

  const allFavorites: FavoritePerson[] = [
    ...favorites,
    {
      id: "6",
      name: "John Doe",
      image:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100",
    },
    {
      id: "7",
      name: "Sarah Wilson",
      image:
        "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=100",
    },
    {
      id: "8",
      name: "Mike Ross",
      image:
        "https://images.unsplash.com/photo-1463453091185-61582044d556?w=100",
    },
  ];

  // Fetch conversations from Supabase
  useEffect(() => {
    fetchConversations();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      fetchConversations();
    }, [])
  );

  const fetchConversations = async () => {
    try {
      setLoading(true);

      // Step 1: Verify user is authenticated using helper function
      const isAuthenticated = await verifyAuthentication();
      if (!isAuthenticated) {
        console.error("User not authenticated");
        setLoading(false);
        return;
      }

      // Step 2: Get current user data using helper function
      const currentUser = await getCurrentUser();
      if (!currentUser) {
        console.error("Unable to retrieve user data");
        setLoading(false);
        return;
      }

      setCurrentUserId(currentUser.id);
      console.log("Current user ID:", currentUser.id);

      // Step 3: Check if current user is an influencer or regular user
      const { data: userProfile, error: profileError } = await supabase
        .from("users")
        .select("user_type")
        .eq("id", currentUser.id)
        .single();

      if (profileError) {
        console.error("Error fetching user profile:", profileError);
        setLoading(false);
        return;
      }

      console.log("User type:", userProfile.user_type);

      // Step 4: Build the base query with explicit relationships
      let query;

      if (userProfile.user_type === "Influencer") {
        // For influencers, get their influencer profile ID first
        const { data: influencerProfile, error: influencerError } = await supabase
          .from("influencer_profiles")
          .select("id")
          .eq("user_id", currentUser.id)
          .single();

        if (influencerError) {
          console.error("Error fetching influencer profile:", influencerError);
          setLoading(false);
          return;
        }

        console.log("Influencer profile ID:", influencerProfile.id);

        // Query for conversations where current user is the influencer
        query = supabase
          .from("conversations")
          .select(`
          id,
          regular_user_id,
          influencer_id,
          last_message_at,
          last_message_preview,
          is_active,
          created_at,
          updated_at,
          regular_user:regular_user_id(
            id,
            full_name,
            avatar_url,
            is_verified
          )
        `)
          .eq("influencer_id", influencerProfile.id)
          .eq("is_active", true)
          .order("last_message_at", { ascending: false });

      } else {
        // For regular users, query for conversations where they are the regular user
        query = supabase
          .from("conversations")
          .select(`
          id,
          regular_user_id,
          influencer_id,
          last_message_at,
          last_message_preview,
          is_active,
          created_at,
          updated_at,
          influencer:influencer_id(
            id,
            display_name,
            profile_image_url,
            is_available,
            user_id
          )
        `)
          .eq("regular_user_id", currentUser.id)
          .eq("is_active", true)
          .order("last_message_at", { ascending: false });
      }

      const { data: conversations, error } = await query;

      if (error) {
        console.error("Error fetching conversations:", error);
        setLoading(false);
        return;
      }

      console.log(`Found ${conversations?.length || 0} conversations`);
      console.log("Conversations:", conversations);

      // Step 5: Transform data to Chat format
      const transformedChats: Chat[] = [];

      for (const conv of conversations || []) {
        let chatName = "Unknown";
        let chatImage = require("../../../assets/images/discover.png");
        let isVerified = false;
        let isOnline = false;
        let influencerId = null;

        if (userProfile.user_type === "Influencer") {
          // For influencers, show regular user's info
          const regularUser = conv.regular_user;
          chatName = regularUser?.full_name || "Unknown User";
          chatImage = regularUser?.avatar_url
            ? { uri: regularUser.avatar_url }
            : require("../../../assets/images/discover.png");
          isVerified = regularUser?.is_verified || false;
          isOnline = true; // Regular users are always considered online for now

          // For influencers, we need to get the influencer ID separately
          const { data: influencerProfile } = await supabase
            .from("influencer_profiles")
            .select("id")
            .eq("user_id", currentUser.id)
            .single();

          influencerId = influencerProfile?.id || null;
        } else {
          // For regular users, show influencer's info
          const influencer = conv.influencer;
          chatName = influencer?.display_name || "Unknown Influencer";
          chatImage = influencer?.profile_image_url
            ? { uri: influencer.profile_image_url }
            : require("../../../assets/images/discover.png");
          isOnline = influencer?.is_available || false;
          influencerId = influencer?.id;

          // Get verification status separately to avoid the join conflict
          if (influencer?.user_id) {
            const { data: influencerUser } = await supabase
              .from("users")
              .select("is_verified")
              .eq("id", influencer.user_id)
              .single();

            isVerified = influencerUser?.is_verified || false;
          }
        }

        // Only include conversations with messages or show empty ones
        const unreadCount = await getUnreadCount(conv.id, currentUser.id);

        transformedChats.push({
          id: conv.id,
          conversationId: conv.id,
          influencerId: influencerId,
          name: chatName,
          message: conv.last_message_preview || "No messages yet",
          time: formatTime(conv.last_message_at),
          image: chatImage,
          isVerified: isVerified,
          isOnline: isOnline,
          unreadCount: unreadCount,
          isDoubleTick: true,
          isSupport: false,
          isPinned: false,
        });
      }

      // Step 6: Add support chat at the beginning for all users
      const supportChat: Chat = {
        id: "support",
        name: "Support",
        message: "How to add my IBAN?",
        time: "2:00",
        image: require("../../../assets/images/dashboard/support-avatar.png"),
        isVerified: true,
        isOnline: false,
        unreadCount: 0,
        isDoubleTick: true,
        isSupport: true,
      };

      setChats([supportChat, ...transformedChats]);
      setLoading(false);
    } catch (err) {
      console.error("Error in fetchConversations:", err);
      setLoading(false);
    }
  };

  // Get unread message count for a conversation
  const getUnreadCount = async (conversationId: string, userId: string): Promise<number> => {
    try {
      const { data: unreadMessages, error } = await supabase
        .from("messages")
        .select("id")
        .eq("conversation_id", conversationId)
        .neq("sender_id", userId)
        .eq("is_read", false)
        .is("deleted_at", null);

      if (error) {
        console.error("Error fetching unread count:", error);
        return 0;
      }

      return unreadMessages?.length || 0;
    } catch (error) {
      console.error("Error in getUnreadCount:", error);
      return 0;
    }
  };

  // Format timestamp to display format
  const formatTime = (timestamp: string | null) => {
    if (!timestamp) return "";

    const date = new Date(timestamp);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInHours = diffInMs / (1000 * 60 * 60);
    const diffInDays = diffInMs / (1000 * 60 * 60 * 24);

    if (diffInHours < 24) {
      return date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: false,
      });
    } else if (diffInDays < 7) {
      return date.toLocaleDateString("en-US", { weekday: "short" });
    } else {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    }
  };

  // Handle chat press - navigate to chat screen with proper parameters
  const handleChatPress = (chat: Chat) => {
    if (swipedChatId === chat.id) {
      const anim = getSwipeAnim(chat.id);
      Animated.spring(anim, {
        toValue: 0,
        useNativeDriver: true,
      }).start(() => setSwipedChatId(null));
    } else {
      if (chat.isSupport) {
        router.push("/(tabs)/dashboard/support");
      } else if (chat.conversationId) {
        router.push({
          pathname: "/(tabs)/chats/chat",
          params: {
            conversationId: chat.conversationId,
            name: chat.name,
            image: typeof chat.image === 'string' ? chat.image : '',
            isOnline: chat.isOnline ? "true" : "false",
            isVerified: chat.isVerified ? "true" : "false"
          }
        });
      } else {
        console.error("No conversation ID found for chat:", chat.id);
      }
    }
  };

  // Handle delete chat
  const handleDeleteChat = async () => {
    if (longPressedChat?.conversationId) {
      try {
        const { error } = await supabase
          .from("conversations")
          .update({ is_active: false })
          .eq("id", longPressedChat.conversationId);

        if (!error) {
          setChats((prev) => prev.filter((c) => c.id !== longPressedChat.id));
          console.log("Chat deleted successfully");
        } else {
          console.error("Error deleting chat:", error);
        }
      } catch (err) {
        console.error("Error deleting chat:", err);
      }
    }
    setShowUnreadModal(false);
    setLongPressedChat(null);
  };

  // Handle mark as read
  const handleMarkAsRead = async () => {
    if (longPressedChat?.conversationId && currentUserId) {
      try {
        const { error } = await supabase
          .from("messages")
          .update({
            is_read: true,
            read_at: new Date().toISOString()
          })
          .eq("conversation_id", longPressedChat.conversationId)
          .neq("sender_id", currentUserId)
          .eq("is_read", false);

        if (!error) {
          setChats(prev =>
            prev.map(chat =>
              chat.id === longPressedChat.id
                ? { ...chat, unreadCount: 0 }
                : chat
            )
          );
          console.log("Messages marked as read");
        } else {
          console.error("Error marking messages as read:", error);
        }
      } catch (err) {
        console.error("Error in handleMarkAsRead:", err);
      }
    }
    setShowUnreadModal(false);
    setLongPressedChat(null);
  };

  // Handle pin chat
  const handlePinChat = () => {
    setShowUnreadModal(false);
    setLongPressedChat(null);
  };

  if (!fontsLoaded || loading) {
    return (
      <View className="flex-1 items-center justify-center bg-black">
        <ActivityIndicator color="#FCCD34" size="large" />
        <Text className="text-white mt-4" style={{ fontFamily: FONT.Regular }}>
          Loading chats...
        </Text>
      </View>
    );
  }

  // Constants for swipe distances
  const RIGHT_SWIPE_MAX = 130;
  const LEFT_SWIPE_MAX = -222;

  const getSwipeAnim = (chatId: string) => {
    if (!swipeAnims.current[chatId]) {
      swipeAnims.current[chatId] = new Animated.Value(0);
    }
    return swipeAnims.current[chatId];
  };

  const closeAllExcept = (exceptId: string | null) => {
    Object.keys(swipeAnims.current).forEach((id) => {
      if (id !== exceptId) {
        Animated.spring(swipeAnims.current[id], {
          toValue: 0,
          useNativeDriver: true,
        }).start();
      }
    });
    setSwipedChatId(exceptId);
  };

  const resetAllSwipes = () => {
    closeAllExcept(null);
  };

  const getPanResponder = (chat: Chat) => {
    if (panResponders.current[chat.id]) return panResponders.current[chat.id];

    const anim = getSwipeAnim(chat.id);

    const pr = PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return (
          Math.abs(gestureState.dx) > 10 &&
          Math.abs(gestureState.dx) > Math.abs(gestureState.dy)
        );
      },
      onPanResponderGrant: () => {
        closeAllExcept(chat.id);
      },
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dx < 0) {
          const val = Math.max(gestureState.dx, LEFT_SWIPE_MAX);
          anim.setValue(val);
        } else if (gestureState.dx > 0 && chat.isPinned) {
          const val = Math.min(gestureState.dx, RIGHT_SWIPE_MAX);
          anim.setValue(val);
        } else {
          anim.setValue(Math.min(gestureState.dx, 0));
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        const dx = gestureState.dx;
        if (dx < -80) {
          Animated.spring(anim, {
            toValue: LEFT_SWIPE_MAX,
            useNativeDriver: true,
          }).start(() => setSwipedChatId(chat.id));
        } else if (dx > 60 && chat.isPinned) {
          Animated.spring(anim, {
            toValue: RIGHT_SWIPE_MAX,
            useNativeDriver: true,
          }).start(() => setSwipedChatId(chat.id));
        } else {
          Animated.spring(anim, {
            toValue: 0,
            useNativeDriver: true,
          }).start(() => {
            if (swipedChatId === chat.id) setSwipedChatId(null);
          });
        }
      },
      onPanResponderTerminate: () => {
        Animated.spring(anim, {
          toValue: 0,
          useNativeDriver: true,
        }).start(() => setSwipedChatId(null));
      },
    });

    panResponders.current[chat.id] = pr;
    return pr;
  };

  const handleLongPress = (chat: Chat) => {
    setLongPressedChat(chat);
    setShowUnreadModal(true);
  };

  return (
    <View className="flex-1 bg-black">
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View className="pt-12 pb-4 px-5">
        <View className="flex-row items-center justify-between mb-5">
          <TouchableOpacity onPress={() => router.back()}>
            <ChevronLeft size={28} color="white" />
          </TouchableOpacity>
          <Text
            className="text-white text-xl"
            style={{ fontFamily: FONT.SemiBold }}
          >
            Chats
          </Text>
          <View style={{ width: 28 }} />
        </View>

        {/* Search Bar */}
        <View className="flex-row items-center gap-3">
          <View
            className="flex-row items-center bg-[#000000]"
            style={{
              width: 287,
              height: 40,
              borderRadius: 15,
              paddingHorizontal: 12,
              gap: 13,
              opacity: 1,
              borderWidth: 0.5,
              borderColor: "rgba(255,255,255,0.2)",
            }}
          >
            <Search size={20} color="#FFFFFF" />
            <TextInput
              placeholder="Search"
              placeholderTextColor="#7C8089"
              className="flex-1 text-white"
              style={{ fontFamily: FONT.Regular, fontSize: 16 }}
              value={searchText}
              onChangeText={setSearchText}
            />
          </View>

          <TouchableOpacity
            className="p-2"
            activeOpacity={0.8}
            onPress={() => setShowFilterModal(true)}
          >
            <Image
              source={require("../../../assets/images/filter-icon.png")}
              style={{
                width: 24,
                height: 24,
                resizeMode: "contain",
              }}
            />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView className="flex-1" onScroll={resetAllSwipes}>
        {/* Favorites Section */}
        <View className="px-5 mb-4">
          <View className="flex-row items-center justify-between mb-4">
            <Text
              className="text-white text-lg"
              style={{ fontFamily: FONT.SemiBold }}
            >
              Favorites
            </Text>
            <TouchableOpacity onPress={() => setShowAllFavorites(true)}>
              <Text
                className="text-gray-500 text-sm"
                style={{ fontFamily: FONT.Regular }}
              >
                See All...
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View className="flex-row gap-4">
              {favorites.map((person) => (
                <TouchableOpacity key={person.id} className="items-center">
                  <View className="w-16 h-16 rounded-full overflow-hidden border-2 border-[#FCCD34] mb-2">
                    <Image
                      source={{ uri: person.image }}
                      style={{ width: "100%", height: "100%" }}
                      resizeMode="cover"
                    />
                  </View>
                  <Text
                    className="text-white text-xs text-center"
                    style={{ fontFamily: FONT.Regular, maxWidth: 70 }}
                    numberOfLines={1}
                  >
                    {person.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* Chat List */}
        <View className="flex-1">
          {chats.length === 0 ? (
            <View className="items-center justify-center py-10">
              <Text
                className="text-gray-400 text-base"
                style={{ fontFamily: FONT.Regular }}
              >
                No conversations yet
              </Text>
              <Text
                className="text-gray-500 text-sm mt-2"
                style={{ fontFamily: FONT.Regular }}
              >
                Start chatting with influencers to see conversations here
              </Text>
            </View>
          ) : (
            chats.map((chat) => {
              const anim = getSwipeAnim(chat.id);
              const panResponder = getPanResponder(chat);

              return (
                <View key={chat.id} style={{ position: "relative" }}>
                  {/* Unpin Button (Left side - shown when swiping RIGHT on pinned chat) */}
                  {swipedChatId === chat.id && (
                    <>
                      {chat.isPinned ? (
                        <Animated.View
                          style={{
                            position: "absolute",
                            left: 0,
                            top: 0,
                            bottom: 0,
                            justifyContent: "center",
                            transform: [
                              {
                                translateX: 0,
                              },
                            ],
                          }}
                        >
                          <Animated.View
                            pointerEvents="box-none"
                            style={{
                              opacity: anim.interpolate({
                                inputRange: [0, RIGHT_SWIPE_MAX],
                                outputRange: [0, 1],
                                extrapolate: "clamp",
                              }),
                            }}
                          >
                            <TouchableOpacity
                              style={{
                                width: 74,
                                height: 67,
                                backgroundColor: "#63AFF7",
                                borderTopRightRadius: 10,
                                borderBottomRightRadius: 10,
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                              onPress={() => {
                                Animated.spring(anim, {
                                  toValue: 0,
                                  useNativeDriver: true,
                                }).start(() => setSwipedChatId(null));
                              }}
                            >
                              <Image
                                source={require("../../../assets/images/dashboard/unpin.png")}
                                style={{
                                  width: 24,
                                  height: 24,
                                  resizeMode: "contain",
                                  tintColor: "#FFFFFF",
                                }}
                              />
                              <Text
                                style={{
                                  fontSize: 12,
                                  fontFamily: FONT.SemiBold,
                                  color: "#FFFFFF",
                                  marginTop: 4,
                                }}
                              >
                                Unpin
                              </Text>
                            </TouchableOpacity>
                          </Animated.View>
                        </Animated.View>
                      ) : null}

                      {/* Action Buttons (Right side - shown when swiping LEFT) */}
                      <Animated.View
                        style={{
                          position: "absolute",
                          right: 0,
                          top: 0,
                          bottom: 0,
                          flexDirection: "row",
                          alignItems: "center",
                          opacity: anim.interpolate({
                            inputRange: [LEFT_SWIPE_MAX, 0],
                            outputRange: [1, 0],
                            extrapolate: "clamp",
                          }),
                        }}
                        pointerEvents={
                          swipedChatId === chat.id ? "auto" : "none"
                        }
                      >
                        <TouchableOpacity
                          style={{
                            width: 74,
                            height: 68,
                            backgroundColor: "#5856D6",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                          onPress={() => {
                            Animated.spring(anim, {
                              toValue: 0,
                              useNativeDriver: true,
                            }).start(() => setSwipedChatId(null));
                          }}
                        >
                          <Image
                            source={require("../../../assets/images/dashboard/star.png")}
                            style={{
                              width: 18,
                              height: 18,
                              resizeMode: "contain",
                              tintColor: "#FFFFFF",
                            }}
                          />
                          <Text
                            style={{
                              fontSize: 10,
                              fontFamily: FONT.Regular,
                              color: "#FFFFFF",
                              marginTop: 4,
                            }}
                          >
                            Add to
                          </Text>
                          <Text
                            style={{
                              fontSize: 10,
                              fontFamily: FONT.Regular,
                              color: "#FFFFFF",
                            }}
                          >
                            favorites
                          </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                          style={{
                            width: 74,
                            height: 68,
                            backgroundColor: "#FCCD34",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                          onPress={() => {
                            Animated.spring(anim, {
                              toValue: 0,
                              useNativeDriver: true,
                            }).start(() => setSwipedChatId(null));
                          }}
                        >
                          <Image
                            source={require("../../../assets/images/dashboard/volume.png")}
                            style={{
                              width: 23,
                              height: 21,
                              resizeMode: "contain",
                              tintColor: "#FFFFFF",
                            }}
                          />
                          <Text
                            style={{
                              fontSize: 12,
                              fontFamily: FONT.SemiBold,
                              color: "#FFFFFF",
                              marginTop: 4,
                            }}
                          >
                            Unmute
                          </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                          style={{
                            width: 74,
                            height: 68,
                            backgroundColor: "#FF3B30",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                          onPress={handleDeleteChat}
                        >
                          <Image
                            source={require("../../../assets/images/dashboard/dustbin.png")}
                            style={{
                              width: 15,
                              height: 15,
                              resizeMode: "contain",
                              tintColor: "#FFFFFF",
                            }}
                          />
                          <Text
                            style={{
                              fontSize: 12,
                              fontFamily: FONT.SemiBold,
                              color: "#FFFFFF",
                              marginTop: 4,
                            }}
                          >
                            Delete
                          </Text>
                        </TouchableOpacity>
                      </Animated.View>
                    </>
                  )}

                  {/* Chat Item */}
                  <Animated.View
                    style={{
                      transform: [
                        {
                          translateX: anim,
                        },
                      ],
                      backgroundColor: "#000000",
                    }}
                    {...panResponder.panHandlers}
                  >
                    <TouchableOpacity
                      className="flex-row items-center px-5 py-3"
                      activeOpacity={0.7}
                      onPress={() => handleChatPress(chat)}
                      onLongPress={() => handleLongPress(chat)}
                      delayLongPress={500}
                    >
                      {/* Profile Picture */}
                      <View className="relative mr-4 w-[60px] h-[60px]">
                        {chat.image ? (
                          <Image
                            source={
                              typeof chat.image === "string"
                                ? { uri: chat.image }
                                : chat.image
                            }
                            style={{ width: 60, height: 60 }}
                            className="rounded-full"
                            resizeMode="cover"
                          />
                        ) : (
                          <View className="w-[60px] h-[60px] rounded-full bg-gray-600 items-center justify-center">
                            <Text
                              className="text-white text-2xl"
                              style={{ fontFamily: FONT.SemiBold }}
                            >
                              {chat.name.charAt(0).toUpperCase()}
                            </Text>
                          </View>
                        )}
                        {chat.isOnline && (
                          <View className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-black" />
                        )}
                      </View>

                      {/* Chat Info */}
                      <View className="flex-1">
                        <View className="flex-row items-center mb-1">
                          <Text
                            className="text-white text-base"
                            style={{ fontFamily: FONT.SemiBold }}
                          >
                            {chat.name}
                          </Text>
                          {chat.isVerified && (
                            <View className="ml-1 w-4 h-4 bg-[#FCCD34] rounded-full items-center justify-center">
                              <Text className="text-black text-xs font-bold">
                                ✓
                              </Text>
                            </View>
                          )}
                        </View>
                        <Text
                          className="text-gray-400 text-sm"
                          style={{ fontFamily: FONT.Regular }}
                          numberOfLines={1}
                        >
                          {chat.message}
                        </Text>
                      </View>

                      {/* Time and Status */}
                      <View className="items-end ml-3" accessible={false}>
                        <View className="flex-row items-center mb-1">
                          {chat.isDoubleTick ? (
                            <Image
                              source={require("../../../assets/images/double-tick.png")}
                              style={{
                                width: 16,
                                height: 12,
                                marginRight: 4,
                                tintColor: chat.unreadCount
                                  ? "#FCCD34"
                                  : "#666",
                              }}
                              resizeMode="contain"
                            />
                          ) : null}

                          <Text
                            className={`text-sm ${chat.unreadCount ? "text-white" : "text-gray-500"
                              }`}
                            style={{ fontFamily: FONT.Regular }}
                            numberOfLines={1}
                            ellipsizeMode="tail"
                          >
                            {chat.time ? String(chat.time) : ""}
                          </Text>
                        </View>

                        {typeof chat.unreadCount === "number" &&
                          chat.unreadCount > 0 ? (
                          <View
                            style={{
                              width: 24,
                              height: 24,
                              borderRadius: 12,
                              backgroundColor: "#FCCD34",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                            accessibilityLabel={`${chat.unreadCount} unread messages`}
                          >
                            <Text
                              style={{
                                color: "#000",
                                fontSize: 12,
                                fontFamily: FONT.Bold,
                              }}
                              numberOfLines={1}
                            >
                              {String(chat.unreadCount)}
                            </Text>
                          </View>
                        ) : null}
                      </View>
                    </TouchableOpacity>
                  </Animated.View>
                </View>
              );
            })
          )}
        </View>
      </ScrollView>

      {/* Filter Modal */}
      <Modal
        visible={showFilterModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowFilterModal(false)}
      >
        <View className="flex-1 justify-end">
          <TouchableOpacity
            className="flex-1 bg-black/50"
            activeOpacity={1}
            onPress={() => setShowFilterModal(false)}
          />
          <View className="bg-[#1C1C1E] rounded-t-3xl pt-2 pb-8">
            <View className="items-center py-3">
              <View className="w-10 h-1 bg-white/30 rounded-full" />
            </View>

            <View className="flex-row justify-end px-6 pb-4">
              <TouchableOpacity onPress={() => setShowFilterModal(false)}>
                <Text
                  className="text-[#FCCD34] text-lg"
                  style={{ fontFamily: FONT.Medium }}
                >
                  Done
                </Text>
              </TouchableOpacity>
            </View>

            <View className="px-6 pt-4">
              {["Unread", "Active", "Favorites"].map((option) => (
                <TouchableOpacity
                  key={option}
                  className="flex-row items-center justify-between py-5"
                  onPress={() => setSelectedFilter(option)}
                >
                  <Text
                    className={`text-lg ${selectedFilter === option
                      ? "text-[#FCCD34]"
                      : "text-white"
                      }`}
                    style={{ fontFamily: FONT.Regular }}
                  >
                    {option}
                  </Text>
                  <View
                    className={`w-6 h-6 rounded-full ${selectedFilter === option
                      ? "bg-[#FCCD34]"
                      : "border-2 border-gray-500"
                      } items-center justify-center`}
                  >
                    {selectedFilter === option && (
                      <View className="w-3 h-3 rounded-full bg-black" />
                    )}
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </Modal>

      {/* All Favorites Modal */}
      <Modal
        visible={showAllFavorites}
        animationType="slide"
        transparent={false}
        onRequestClose={() => setShowAllFavorites(false)}
      >
        <View className="flex-1 bg-black">
          <StatusBar barStyle="light-content" />

          <View className="pt-12 pb-4 px-5">
            <View className="flex-row items-center justify-between mb-5">
              <TouchableOpacity onPress={() => setShowAllFavorites(false)}>
                <ChevronLeft size={28} color="white" />
              </TouchableOpacity>
              <Text
                className="text-white text-xl"
                style={{ fontFamily: FONT.SemiBold }}
              >
                Favorites
              </Text>
              <View style={{ width: 28 }} />
            </View>

            <View className="flex-row items-center gap-3">
              <View
                className="flex-row items-center bg-[#000000]"
                style={{
                  width: 287,
                  height: 40,
                  borderRadius: 15,
                  paddingHorizontal: 12,
                  gap: 13,
                  opacity: 1,
                  borderWidth: 0.3,
                  borderColor: "rgba(255,255,255,0.2)",
                }}
              >
                <Search size={20} color="#FFFFFF" />
                <TextInput
                  placeholder="Search"
                  placeholderTextColor="#7C8089"
                  className="flex-1 text-white"
                  style={{ fontFamily: FONT.Regular, fontSize: 16 }}
                />
              </View>

              <TouchableOpacity
                className="p-2"
                activeOpacity={0.8}
                onPress={() => setShowFilterModal(true)}
              >
                <Image
                  source={require("../../../assets/images/filter-icon.png")}
                  style={{
                    width: 24,
                    height: 24,
                    resizeMode: "contain",
                  }}
                />
              </TouchableOpacity>
            </View>
          </View>

          <ScrollView className="flex-1 px-5">
            {allFavorites.map((person) => (
              <TouchableOpacity
                key={person.id}
                className="flex-row items-center py-3"
              >
                <View className="relative mr-4 w-[60px] h-[60px]">
                  <Image
                    source={{ uri: person.image }}
                    style={{ width: 60, height: 60 }}
                    className="rounded-full"
                    resizeMode="cover"
                  />
                  <View className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-black" />
                </View>

                <View className="flex-1">
                  <View className="flex-row items-center mb-1">
                    <Text
                      className="text-white text-base"
                      style={{ fontFamily: FONT.SemiBold }}
                    >
                      {person.name}
                    </Text>
                    <View className="ml-1 w-4 h-4 bg-[#FCCD34] rounded-full items-center justify-center">
                      <Text className="text-black text-xs font-bold">✓</Text>
                    </View>
                  </View>
                  <Text
                    className="text-gray-400 text-sm"
                    style={{ fontFamily: FONT.Regular }}
                  >
                    Actor
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </Modal>

      {/* Unread Messages Modal */}
      <Modal
        visible={showUnreadModal}
        animationType="fade"
        transparent={true}
        onRequestClose={() => {
          setShowUnreadModal(false);
          setLongPressedChat(null);
        }}
      >
        <TouchableOpacity
          activeOpacity={1}
          className="flex-1 bg-black"
          onPress={() => {
            setShowUnreadModal(false);
            setLongPressedChat(null);
          }}
        >
          <View
            style={{
              position: "absolute",
              top: 221,
              left: 6,
              width: 364,
              height: 370,
              borderRadius: 15,
            }}
          >
            <View
              style={{
                backgroundColor: "#000000",
                borderTopLeftRadius: 15,
                borderTopRightRadius: 15,
                paddingTop: 16,
                paddingBottom: 12,
                paddingHorizontal: 20,
                borderBottomWidth: 1,
                borderBottomColor: "rgba(255, 255, 255, 0.1)",
              }}
            >
              <View className="flex-row items-center mb-4">
                <TouchableOpacity
                  onPress={() => {
                    setShowUnreadModal(false);
                    setLongPressedChat(null);
                  }}
                  className="mr-4"
                >
                  <ChevronLeft size={24} color="white" />
                </TouchableOpacity>

                <View className="relative w-12 h-12 rounded-full overflow-hidden mr-3">
                  {longPressedChat?.image && (
                    <Image
                      source={
                        typeof longPressedChat.image === "string"
                          ? { uri: longPressedChat.image }
                          : longPressedChat.image
                      }
                      style={{ width: "100%", height: "100%" }}
                      resizeMode="cover"
                    />
                  )}
                </View>

                <View className="flex-1">
                  <View className="flex-row items-center">
                    <Text
                      className="text-white text-lg mr-1"
                      style={{ fontFamily: FONT.SemiBold }}
                    >
                      {longPressedChat?.name}
                    </Text>
                    {longPressedChat?.isVerified && (
                      <View className="w-4 h-4 bg-[#FCCD34] rounded-full items-center justify-center">
                        <Text className="text-black text-xs font-bold">✓</Text>
                      </View>
                    )}
                  </View>
                  <View className="flex-row items-center mt-1">
                    <Text
                      className="text-gray-400 text-sm"
                      style={{ fontFamily: FONT.Regular }}
                    >
                      Active Now
                    </Text>
                    {longPressedChat?.isOnline && (
                      <View className="w-2 h-2 rounded-full bg-green-500 ml-2" />
                    )}
                  </View>
                </View>

                <View className="flex-row items-center gap-3">
                  <TouchableOpacity>
                    <Image
                      source={require("../../../assets/images/phone-icon.png")}
                      style={{
                        width: 18,
                        height: 18,
                        tintColor: "white",
                      }}
                      resizeMode="contain"
                    />
                  </TouchableOpacity>
                  <TouchableOpacity>
                    <Image
                      source={require("../../../assets/images/video-icon.png")}
                      style={{
                        width: 24,
                        height: 24,
                        tintColor: "white",
                      }}
                      resizeMode="contain"
                    />
                  </TouchableOpacity>
                </View>
              </View>

              <Text
                className="text-gray-400 text-center text-sm"
                style={{ fontFamily: FONT.Regular }}
              >
                Unread Messages
              </Text>
            </View>

            <View
              style={{
                flex: 1,
                backgroundColor: "#0A0A0A",
              }}
            >
              <ScrollView
                className="flex-1 px-4 py-3"
                contentContainerStyle={{ paddingBottom: 10 }}
              >
                {[
                  {
                    id: "1",
                    text: "I've been a fan of your movies for years",
                    time: "2:00",
                    isSent: false,
                  },
                  {
                    id: "2",
                    text: "I've been a fan of your movies for years I've been a fan of your movies",
                    time: "2:00",
                    isSent: true,
                  },
                  {
                    id: "3",
                    text: "I've been a fan of your movies for years",
                    time: "2:00",
                    isSent: false,
                  },
                  {
                    id: "4",
                    text: "I've been a fan of your movies for years",
                    time: "2:00",
                    isSent: false,
                  },
                ].map((msg) => (
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
                        <Text
                          style={{
                            color: "rgba(255,255,255,0.5)",
                            fontSize: 11,
                            fontFamily: FONT.Regular,
                          }}
                        >
                          {msg.time}
                        </Text>
                        {msg.isSent && (
                          <Image
                            source={require("../../../assets/images/double-tick.png")}
                            style={{
                              width: 16,
                              height: 12,
                              marginLeft: 2,
                            }}
                            resizeMode="contain"
                          />
                        )}
                      </View>
                    </View>
                  </View>
                ))}
              </ScrollView>
            </View>

            <View
              style={{
                position: "absolute",
                width: 192,
                height: 10,
                top: 450,
                left: 150,
                borderRadius: 10.51,
                borderWidth: 0.7,
                borderColor: "rgba(255,255,255,0.06)",
                backgroundColor: "#000000",
                opacity: 1,
                paddingTop: 3.5,
                paddingBottom: 3.5,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 6 },
                shadowOpacity: 0.4,
                shadowRadius: 10,
                elevation: 10,
                justifyContent: "center",
              }}
            >
              <TouchableOpacity
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  paddingVertical: 8,
                  paddingHorizontal: 14,
                }}
                onPress={handleMarkAsRead}
              >
                <Image
                  source={require("../../../assets/images/double-tick.png")}
                  style={{
                    width: 18,
                    height: 18,
                    marginRight: 10,
                    tintColor: "white",
                  }}
                  resizeMode="contain"
                />
                <Text
                  style={{
                    color: "#fff",
                    fontFamily: FONT.Regular,
                    fontSize: 14,
                  }}
                >
                  Mark as Read
                </Text>
              </TouchableOpacity>

              <View
                style={{
                  height: 1,
                  backgroundColor: "rgba(255,255,255,0.03)",
                  marginHorizontal: 8,
                }}
              />

              <TouchableOpacity
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  paddingVertical: 8,
                  paddingHorizontal: 14,
                }}
                onPress={handlePinChat}
              >
                <Image
                  source={require("../../../assets/images/dashboard/star.png")}
                  style={{
                    width: 18,
                    height: 18,
                    marginRight: 10,
                    tintColor: "white",
                  }}
                  resizeMode="contain"
                />
                <Text
                  style={{
                    color: "#fff",
                    fontFamily: FONT.Regular,
                    fontSize: 14,
                  }}
                >
                  Pin
                </Text>
              </TouchableOpacity>

              <View
                style={{
                  height: 1,
                  backgroundColor: "rgba(255,255,255,0.03)",
                  marginHorizontal: 8,
                }}
              />

              <TouchableOpacity
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  paddingVertical: 8,
                  paddingHorizontal: 14,
                }}
                onPress={handleDeleteChat}
              >
                <Image
                  source={require("../../../assets/images/dashboard/dustbin.png")}
                  style={{
                    width: 18,
                    height: 18,
                    marginRight: 10,
                    tintColor: "white",
                  }}
                  resizeMode="contain"
                />
                <Text
                  style={{
                    color: "#fff",
                    fontFamily: FONT.Regular,
                    fontSize: 14,
                  }}
                >
                  Delete
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}