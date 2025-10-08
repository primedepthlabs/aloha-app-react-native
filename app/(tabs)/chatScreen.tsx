// // ChatScreen.tsx
// import React, { useState } from "react";
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   ScrollView,
//   Image,
//   KeyboardAvoidingView,
//   Platform,
//   StyleSheet,
//   ActivityIndicator,
// } from "react-native";
// import {
//   ChevronLeft,
//   Phone,
//   Video,
//   Plus,
//   Send,
//   Mic,
//   Star,
// } from "lucide-react-native";
// import {
//   useFonts,
//   Poppins_400Regular,
//   Poppins_600SemiBold,
//   Poppins_700Bold,
// } from "@expo-google-fonts/poppins";

// interface Message {
//   id: number;
//   text: string;
//   isSent: boolean;
//   timestamp: string;
//   isDelivered?: boolean;
//   isEdited?: boolean;
// }

// interface ChatScreenProps {
//   userName?: string;
//   userImage?: string;
//   isOnline?: boolean;
//   initialBalance?: number;
//   messageCost?: number;
// }

// export default function ChatScreen({
//   userName = "Bam Margera",
//   userImage = "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100",
//   isOnline = true,
//   initialBalance = 12,
//   messageCost = 0.5,
// }: ChatScreenProps) {
//   const [message, setMessage] = useState("");
//   const [showWelcome, setShowWelcome] = useState(true);
//   const [balance] = useState(initialBalance);
//   const [messages, setMessages] = useState<Message[]>([
//     {
//       id: 1,
//       text: "I've been a fan of your movies for years",
//       isSent: false,
//       timestamp: "2:00",
//     },
//     {
//       id: 2,
//       text: "I've been a fan of your movies for years I've been a fan of your movies movies..",
//       isSent: true,
//       timestamp: "2:00",
//       isDelivered: true,
//     },
//     {
//       id: 3,
//       text: "I've been a fan of your movies for years",
//       isSent: false,
//       timestamp: "2:00",
//     },
//     {
//       id: 4,
//       text: "I've been a fan of your movies for years I've been a fan of your movies",
//       isSent: true,
//       timestamp: "2:00",
//       isDelivered: true,
//       isEdited: true,
//     },
//   ]);

//   const charCount = message.length;
//   const maxFreeChars = 160;
//   const isOverLimit = charCount > maxFreeChars;
//   const hasInsufficientBalance = balance < messageCost;

//   const getCharCountColor = () => {
//     if (hasInsufficientBalance) return "#EF4444";
//     if (isOverLimit) return "#FCCD34";
//     return "#6B7280";
//   };

//   const handleSendMessage = () => {
//     if (message.trim() && !hasInsufficientBalance) {
//       const newMessage: Message = {
//         id: messages.length + 1,
//         text: message,
//         isSent: true,
//         timestamp: "2:00",
//         isDelivered: true,
//       };
//       setMessages([...messages, newMessage]);
//       setMessage("");
//       setShowWelcome(false);
//     }
//   };

//   const [fontsLoaded] = useFonts({
//     Poppins_400Regular,
//     Poppins_600SemiBold,
//     Poppins_700Bold,
//   });

//   if (!fontsLoaded) {
//     return (
//       <View style={styles.centered}>
//         <ActivityIndicator color="#FCCD34" />
//       </View>
//     );
//   }

//   return (
//     <KeyboardAvoidingView
//       style={styles.container}
//       behavior={Platform.OS === "ios" ? "padding" : "height"}
//     >
//       {/* Header */}
//       <View style={styles.header}>
//         <View style={styles.headerTop}>
//           <View style={styles.headerLeft}>
//             <TouchableOpacity style={styles.iconButton}>
//               <ChevronLeft size={22} color="#fff" />
//             </TouchableOpacity>

//             <Image source={{ uri: userImage }} style={styles.avatar} />

//             <View style={{ flex: 1 }}>
//               <Text style={styles.userName}>{userName}</Text>
//               <View style={styles.statusRow}>
//                 <Text style={styles.statusText}>Active Now</Text>
//                 {isOnline && <View style={styles.onlineDot} />}
//               </View>
//             </View>
//           </View>
//         </View>

//         {/* Balance row */}
//         <View style={styles.balanceRow}>
//           <View style={{ flexDirection: "row", alignItems: "center" }}>
//             <Text style={styles.walletEmoji}>💰</Text>
//             <Text style={styles.balanceText}>Balance: {balance} GEL</Text>
//           </View>

//           <TouchableOpacity style={styles.addFundsBtn}>
//             <Text style={styles.addFundsText}>+ Add funds</Text>
//           </TouchableOpacity>
//         </View>
//       </View>

//       {/* Messages / Welcome */}
//       <ScrollView contentContainerStyle={styles.messagesScroll}>
//         {showWelcome && (
//           <View style={styles.welcomeWrapper}>
//             <View style={styles.card}>
//               <View style={styles.iconCircle}>
//                 <Image
//                   source={require("@/assets/images/messageicon.png")}
//                   style={styles.iconInner}
//                   resizeMode="contain"
//                 />
//               </View>

//               <Text style={styles.cardTitle}>Welcome to Aloha!</Text>

//               <Text style={styles.cardDescription}>
//                 You can send messages, or start a paid video/audio call with{" "}
//                 <Text style={styles.cardDescriptionBold}>{userName}</Text>. Each
//                 message up to {maxFreeChars} characters costs{" "}
//                 <Text style={styles.cardDescriptionBold}>0.05 ¢</Text>, longer
//                 messages cost{" "}
//                 <Text style={styles.cardDescriptionBold}>0.10 ¢</Text>. Keep
//                 your balance topped up.
//               </Text>

//               <View style={styles.buttonsColumn}>
//                 <TouchableOpacity
//                   style={[styles.pillButton, styles.yellowButton]}
//                   onPress={() => setShowWelcome(false)}
//                 >
//                   <Image
//                     source={require("@/assets/images/message.png")}
//                     style={styles.pillIcon}
//                     resizeMode="contain"
//                   />
//                   <Text style={[styles.pillText, styles.pillTextDark]}>
//                     Send Message
//                   </Text>
//                 </TouchableOpacity>

//                 <TouchableOpacity
//                   style={[styles.pillButton, styles.purpleButton]}
//                 >
//                   <Image
//                     source={require("@/assets/images/call.png")}
//                     style={styles.pillIcon}
//                     resizeMode="contain"
//                   />
//                   <Text style={[styles.pillText, styles.pillTextLight]}>
//                     Start Call
//                   </Text>
//                 </TouchableOpacity>
//               </View>
//             </View>
//           </View>
//         )}

//         {!showWelcome &&
//           messages.map((msg) => (
//             <View
//               key={msg.id}
//               style={[
//                 styles.msgRow,
//                 msg.isSent
//                   ? { alignItems: "flex-end" }
//                   : { alignItems: "flex-start" },
//               ]}
//             >
//               <View
//                 style={[
//                   styles.msgBubble,
//                   msg.isSent ? styles.msgBubbleSent : styles.msgBubbleReceived,
//                 ]}
//               >
//                 <Text style={styles.msgText}>{msg.text}</Text>

//                 <View style={styles.msgMeta}>
//                   {msg.isEdited && (
//                     <Text style={styles.editedText}>edited</Text>
//                   )}
//                   <Text style={styles.timestamp}>{msg.timestamp}</Text>
//                   {msg.isSent && msg.isDelivered && (
//                     <Text style={styles.timestamp}> ✓✓</Text>
//                   )}
//                 </View>
//               </View>
//             </View>
//           ))}
//       </ScrollView>

//       {/* Warnings */}
//       {isOverLimit && (
//         <View style={styles.warning}>
//           <Text style={styles.warningEmoji}>⚠️</Text>
//           <Text style={styles.warningText}>
//             Your message exceeded {maxFreeChars} characters. Extra characters
//             will be charged at 0.10 GEL
//           </Text>
//         </View>
//       )}

//       {hasInsufficientBalance && message.length > 0 && (
//         <View
//           style={[
//             styles.warning,
//             {
//               backgroundColor: "rgba(127,29,29,0.2)",
//               borderColor: "rgba(185,28,28,0.5)",
//             },
//           ]}
//         >
//           <Text style={styles.warningEmoji}>❗</Text>
//           <Text style={[styles.warningText, { color: "#FCA5A5" }]}>
//             There is not enough balance on your account
//           </Text>
//         </View>
//       )}

//       {/* Char count */}
//       {message.length > 0 && (
//         <View style={styles.charCountWrap}>
//           <View style={styles.charCountBox}>
//             <Text
//               style={{
//                 color: getCharCountColor(),
//                 fontFamily: "Poppins_600SemiBold",
//                 fontSize: 12,
//               }}
//             >
//               {charCount}/{maxFreeChars} chars - {messageCost.toFixed(2)} (GEL)
//             </Text>
//           </View>
//         </View>
//       )}

//       {/* Input */}
//     </KeyboardAvoidingView>
//   );
// }

// /* Styles */
// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: "#0A0A0A" },
//   centered: {
//     flex: 1,
//     alignItems: "center",
//     justifyContent: "center",
//     backgroundColor: "#0A0A0A",
//   },

//   header: {
//     paddingTop: 48,
//     paddingHorizontal: 20,
//     paddingBottom: 14,
//     borderBottomWidth: 1,
//     borderBottomColor: "#161616",
//   },
//   headerTop: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     marginBottom: 6,
//   },
//   headerLeft: { flexDirection: "row", alignItems: "center", flex: 1 },
//   iconButton: { padding: 6, marginRight: 6 },
//   avatar: { width: 48, height: 48, borderRadius: 24, marginRight: 10 },
//   userName: { color: "#fff", fontSize: 18, fontFamily: "Poppins_700Bold" },
//   statusRow: { flexDirection: "row", alignItems: "center", marginTop: 4 },
//   statusText: {
//     color: "#9CA3AF",
//     fontSize: 13,
//     marginRight: 8,
//     fontFamily: "Poppins_400Regular",
//   },
//   onlineDot: {
//     width: 8,
//     height: 8,
//     borderRadius: 4,
//     backgroundColor: "#34D399",
//   },

//   headerRight: { flexDirection: "row", alignItems: "center" },

//   balanceRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     marginTop: 8,
//   },
//   walletEmoji: { fontSize: 18, marginRight: 6 },
//   balanceText: { color: "#fff", fontFamily: "Poppins_400Regular" },
//   addFundsBtn: {
//     backgroundColor: "#FCCD34",
//     paddingVertical: 8,
//     paddingHorizontal: 14,
//     borderRadius: 999,
//   },
//   addFundsText: {
//     color: "#000",
//     fontWeight: "700",
//     fontFamily: "Poppins_400Regular",
//   },

//   pricingBanner: {
//     marginTop: 10,
//     backgroundColor: "rgba(252,205,52,0.05)",
//     borderWidth: 1,
//     borderColor: "rgba(252,205,52,0.18)",
//     borderRadius: 10,
//     paddingHorizontal: 12,
//     paddingVertical: 8,
//     flexDirection: "row",
//     alignItems: "center",
//   },
//   pricingText: {
//     color: "#F5D88A",
//     marginLeft: 8,
//     fontSize: 13,
//     flex: 1,
//     fontFamily: "Poppins_400Regular",
//   },

//   messagesScroll: { paddingHorizontal: 20, paddingTop: 18, paddingBottom: 12 },

//   welcomeWrapper: {
//     alignItems: "center",
//     justifyContent: "center",
//     paddingBottom: 20,
//   },

//   card: {
//     width: "100%",
//     backgroundColor: "#151515",
//     borderRadius: 18,
//     paddingVertical: 28,
//     paddingHorizontal: 22,
//     alignItems: "center",
//     shadowColor: "#000",
//     shadowOpacity: 0.6,
//     shadowOffset: { width: 0, height: 6 },
//     shadowRadius: 12,
//     elevation: 6,
//   },

//   iconCircle: {
//     width: 60,
//     height: 60,
//     borderRadius: 30,
//     backgroundColor: "#F0C94E22",
//     alignItems: "center",
//     justifyContent: "center",
//     marginBottom: 14,
//   },
//   iconInner: { width: 28, height: 28 },

//   cardTitle: {
//     color: "#fff",
//     fontSize: 18,
//     fontFamily: "Poppins_700Bold",
//     marginBottom: 10,
//   },
//   cardDescription: {
//     color: "#9CA3AF",
//     textAlign: "center",
//     lineHeight: 22,
//     fontSize: 14,
//     marginBottom: 18,
//     fontFamily: "Poppins_400Regular",
//   },
//   cardDescriptionBold: { color: "#fff", fontFamily: "Poppins_600SemiBold" },

//   buttonsColumn: { width: "100%", marginTop: 8 },

//   pillButton: {
//     height: 58,
//     borderRadius: 14,
//     marginBottom: 14,
//     alignItems: "center",
//     justifyContent: "center",
//     flexDirection: "row",
//     paddingHorizontal: 18,
//   },
//   yellowButton: { backgroundColor: "#FCCD34" },
//   purpleButton: { backgroundColor: "#A066FF" },

//   pillIcon: { width: 22, height: 22, marginRight: 10 },
//   pillText: { fontSize: 16, fontFamily: "Poppins_600SemiBold" },
//   pillTextDark: { color: "#111827" },
//   pillTextLight: { color: "#0B0B0B", color: "#0B0B0B" },

//   // messages
//   msgRow: { marginBottom: 10 },
//   msgBubble: {
//     maxWidth: "75%",
//     borderRadius: 14,
//     paddingHorizontal: 12,
//     paddingVertical: 10,
//   },
//   msgBubbleSent: { backgroundColor: "#B77F00" /* yellow-ish */ },
//   msgBubbleReceived: { backgroundColor: "#1F1F1F" },
//   msgText: { color: "#fff", fontFamily: "Poppins_400Regular" },
//   msgMeta: {
//     flexDirection: "row",
//     justifyContent: "flex-end",
//     alignItems: "center",
//     marginTop: 8,
//   },
//   editedText: {
//     color: "#D1D5DB",
//     fontSize: 11,
//     marginRight: 6,
//     fontFamily: "Poppins_400Regular",
//   },
//   timestamp: {
//     color: "#D1D5DB",
//     fontSize: 11,
//     fontFamily: "Poppins_400Regular",
//   },

//   warning: {
//     flexDirection: "row",
//     alignItems: "center",
//     paddingVertical: 12,
//     paddingHorizontal: 20,
//     backgroundColor: "rgba(252,205,52,0.06)",
//     borderTopWidth: 1,
//     borderTopColor: "rgba(252,205,52,0.18)",
//   },
//   warningEmoji: { fontSize: 18, marginRight: 10 },
//   warningText: { color: "#FCD34D", flex: 1, fontSize: 13 },

//   charCountWrap: { paddingHorizontal: 20, paddingVertical: 8 },
//   charCountBox: {
//     backgroundColor: "#151515",
//     paddingHorizontal: 12,
//     paddingVertical: 8,
//     borderRadius: 8,
//     alignSelf: "center",
//   },

//   inputBar: {
//     paddingHorizontal: 20,
//     paddingVertical: 14,
//     borderTopWidth: 1,
//     borderTopColor: "#161616",
//   },
//   inputRow: { flexDirection: "row", alignItems: "center" },
//   inputBox: {
//     flex: 1,
//     backgroundColor: "#151515",
//     borderRadius: 999,
//     paddingHorizontal: 14,
//     paddingVertical: 12,
//   },
//   textInput: {
//     color: "#fff",
//     fontFamily: "Poppins_400Regular",
//     fontSize: 15,
//     maxHeight: 120,
//   },
//   sendButton: {
//     marginLeft: 12,
//     width: 44,
//     height: 44,
//     borderRadius: 22,
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   sendButtonActive: { backgroundColor: "#FCCD34" },
//   sendButtonInactive: { backgroundColor: "#151515" },
// });
// ChatScreen.tsx
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
} from "react-native";
import { ChevronLeft } from "lucide-react-native";
import { useRouter } from "expo-router";
import {
  useFonts,
  Poppins_400Regular,
  Poppins_600SemiBold,
  Poppins_700Bold,
} from "@expo-google-fonts/poppins";

interface ChatScreenProps {
  userName?: string;
  userImage?: string;
  isOnline?: boolean;
  initialBalance?: number;
  messageCost?: number;
  onPressCall?: () => void;
}

export default function ChatScreen({
  userName = "Bam Margera",
  userImage = "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100",
  isOnline = true,
  initialBalance = 12,
  messageCost = 0.5,
  onPressCall,
}: ChatScreenProps) {
  const router = useRouter();

  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

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
    >
      {/* Header */}
      <View className="pt-12 px-5 pb-3 border-b border-[#161616]">
        <View className="flex-row items-center justify-between mb-1">
          <View className="flex-row items-center flex-1">
            <TouchableOpacity
              className="p-1 mr-1"
              onPress={() => router.back()}
            >
              <ChevronLeft size={22} color="#fff" />
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
                style={{ fontFamily: "Poppins_700Bold" }}
              >
                {userName}
              </Text>

              <View className="flex-row items-center mt-1">
                <Text
                  className="text-[#9CA3AF] text-[13px] mr-2"
                  style={{ fontFamily: "Poppins_400Regular" }}
                >
                  Active Now
                </Text>
                {isOnline && (
                  <View className="w-2 h-2 rounded-full bg-[#34D399]" />
                )}
              </View>
            </View>
          </View>
        </View>

        {/* Balance row */}
        <View className="flex-row items-center justify-between mt-2 bg-[#1A1A1A] w-full px-4 py-3 ">
          <View className="flex-row items-center">
            <Text className="text-[18px] mr-1">💰</Text>
            <Text
              className="text-white"
              style={{ fontFamily: "Poppins_400Regular" }}
            >
              Balance: {initialBalance} GEL
            </Text>
          </View>

          <TouchableOpacity className="bg-[#FCCD34] py-2 px-4 rounded-full">
            <Text
              className="font-extrabold text-black"
              style={{ fontFamily: "Poppins_400Regular" }}
            >
              + Add funds
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Welcome Card */}
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: 18,
          paddingBottom: 12,
        }}
      >
        <View className="items-center justify-center pb-5">
          <View className="w-full bg-[#151515] rounded-[18px] py-7 px-5 items-center shadow-lg">
            <View className="w-[60px] h-[60px] rounded-full bg-[#F0C94E22] items-center justify-center mb-3">
              <Image
                source={require("@/assets/images/messageicon.png")}
                style={{ width: 28, height: 28 }}
                resizeMode="contain"
              />
            </View>

            <Text
              className="text-white text-[18px] mb-2"
              style={{ fontFamily: "Poppins_700Bold" }}
            >
              Welcome to Aloha!
            </Text>

            <Text
              className="text-[#9CA3AF] text-[14px] text-center leading-6 mb-4"
              style={{ fontFamily: "Poppins_400Regular" }}
            >
              You can send messages, or start a paid video/audio call with{" "}
              <Text
                style={{ color: "#fff", fontFamily: "Poppins_600SemiBold" }}
              >
                {userName}
              </Text>
              . Each message up to 160 characters costs{" "}
              <Text
                style={{ color: "#fff", fontFamily: "Poppins_600SemiBold" }}
              >
                0.05 ¢
              </Text>
              , longer messages cost{" "}
              <Text
                style={{ color: "#fff", fontFamily: "Poppins_600SemiBold" }}
              >
                0.10 ¢
              </Text>
              . Keep your balance topped up.
            </Text>

            <View className="w-full mt-2">
              <TouchableOpacity
                className="h-[58px] rounded-[14px] mb-3 flex-row items-center justify-center px-4"
                style={{ backgroundColor: "#FCCD34" }}
                onPress={() => router.push("/(tabs)/chatExclusive")}
                activeOpacity={0.9}
              >
                <Image
                  source={require("@/assets/images/message.png")}
                  style={{ width: 22, height: 22, marginRight: 10 }}
                  resizeMode="contain"
                />
                <Text
                  className="text-[16px]"
                  style={{
                    fontFamily: "Poppins_600SemiBold",
                    color: "#111827",
                  }}
                >
                  Send Message
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="h-[58px] rounded-[14px] mb-0 flex-row items-center justify-center px-4"
                style={{ backgroundColor: "#A066FF" }}
                onPress={onPressCall}
                activeOpacity={0.9}
              >
                <Image
                  source={require("@/assets/images/call.png")}
                  style={{ width: 22, height: 22, marginRight: 10 }}
                  resizeMode="contain"
                />
                <Text
                  className="text-[16px]"
                  style={{
                    fontFamily: "Poppins_600SemiBold",
                    color: "#0B0B0B",
                  }}
                >
                  Start Call
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
