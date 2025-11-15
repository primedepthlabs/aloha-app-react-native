// // app/(tabs)/discover/index.tsx  (or wherever your DiscoverScreen file lives)
// import React, { useCallback, useEffect, useState } from "react";
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   ScrollView,
//   Image,
//   Modal,
//   Alert,
//   ActivityIndicator,
// } from "react-native";
// import {
//   Search,
//   Star,
//   MessageCircle,
//   MoreVertical,
//   ChevronLeft,
// } from "lucide-react-native";
// import { LinearGradient } from "expo-linear-gradient";
// import { useRouter } from "expo-router";
// import { supabase } from "../../../supabaseClient"; // <- ensure this path is correct

// // --- Types ---
// interface User {
//   id: string; // uuid
//   name: string;
//   role: string;
//   image: any; // local require or { uri: string }
//   isFavorite?: boolean;
//   location?: string;
//   about?: string;
//   rating?: number;
//   isOnline?: boolean;
//   gallery?: string[];
//   price_per_message?: number;
// }

// interface Notification {
//   id: number;
//   type: "message" | "donation" | "system" | "video";
//   title: string;
//   subtitle?: string;
//   time: string;
//   icon: string;
// }

// // --- Placeholder notifications (kept from your original) ---
// const MOCK_NOTIFICATIONS: Notification[] = [
//   {
//     id: 1,
//     type: "message",
//     title: "New message from Bam",
//     time: "2 hours ago",
//     icon: "message",
//   },
//   {
//     id: 2,
//     type: "donation",
//     title: "Donation sent successfully",
//     subtitle: "Tap to view conversation",
//     time: "",
//     icon: "heart",
//   },
//   {
//     id: 3,
//     type: "system",
//     title: "Low balance — add funds",
//     time: "2 hours ago",
//     icon: "settings",
//   },
//   {
//     id: 4,
//     type: "video",
//     title: "Video call accepted",
//     subtitle: "Tap to view conversation",
//     time: "",
//     icon: "video",
//   },
// ];

// const ROLES = ["All", "Influencer", "Doctor", "Youtuber", "Actor"];

// // Local placeholder image (same as your mock)
// const PLACEHOLDER_IMAGE = require("../../../assets/images/discover.png");

// // --- Helper functions for DB operations ---

// /**
//  * Ensure there is a row in your app 'users' table for the authenticated user.
//  * This is necessary when you use a separate 'users' app table joined to auth.
//  */
// async function createAppUserIfMissing(authUser: any) {
//   if (!authUser?.id) return;
//   const userId = authUser.id;
//   const newUser: any = {
//     id: userId,
//     full_name:
//       authUser.user_metadata?.full_name ??
//       authUser.user_metadata?.name ??
//       "Unnamed",
//     phone_number:
//       authUser.phone ??
//       authUser.user_metadata?.phone ??
//       authUser.user_metadata?.phone_number ??
//       null,
//     is_active: true,
//     is_verified: true,
//     user_type: "influencer",
//     // add other required columns with defaults if your `users` table requires them
//   };

//   const { error } = await supabase
//     .from("users")
//     .upsert(newUser, { onConflict: "id", returning: "minimal" });

//   if (error) {
//     console.error("createAppUserIfMissing error:", error);
//     // don't throw to avoid breaking UI, but you may want to handle this up the stack
//   }
// }

// /**
//  * Ensure there is an influencer_profiles row for this user (upsert).
//  * Returns the influencer_profiles row or null.
//  */
// async function ensureInfluencerProfileForUser(userId: string) {
//   if (!userId) return null;

//   const defaultProfile = {
//     user_id: userId,
//     display_name: "New Creator",
//     bio: "",
//     category: "General",
//     profile_image_url: null,
//     cover_image_url: null,
//     price_per_message: 0.0,
//     price_per_minute_audio: 0.0,
//     price_per_minute_video: 0.0,
//     is_available: true,
//     auto_response_enabled: false,
//     auto_response_message: null,
//   };

//   // Upsert on user_id to avoid unique/foreign key errors (needs users.id to exist)
//   const { data, error } = await supabase
//     .from("influencer_profiles")
//     .upsert(defaultProfile, {
//       onConflict: "user_id",
//       returning: "representation",
//     })
//     .select();

//   if (error) {
//     console.error("ensureInfluencerProfileForUser error:", error);
//     // If you still see FK 23503, it means users row is missing or wrong userId.
//     return null;
//   }

//   return (data && data[0]) || null;
// }

// // --- Main component ---
// export default function DiscoverScreen() {
//   const router = useRouter();

//   // UI state
//   const [selectedTab, setSelectedTab] = useState<"everyone" | "favorites">(
//     "everyone"
//   );
//   const [notificationTab, setNotificationTab] = useState<
//     "all" | "messages" | "donations"
//   >("all");
//   const [searchQuery, setSearchQuery] = useState("");
//   const [selectedUser, setSelectedUser] = useState<User | null>(null);
//   const [users, setUsers] = useState<User[]>([]);
//   const [showFilterModal, setShowFilterModal] = useState(false);
//   const [showNotificationModal, setShowNotificationModal] = useState(false);
//   const [selectedRole, setSelectedRole] = useState("All");
//   const [showNotificationMenu, setShowNotificationMenu] = useState<
//     number | null
//   >(null);
//   const [showProfileMenu, setShowProfileMenu] = useState(false);
//   const [loading, setLoading] = useState(false);

//   // Favorites toggling (stored only in local UI; persist separately if needed)
//   const toggleFavorite = (userId: string) => {
//     setUsers((prev) => {
//       const updated = prev.map((user) =>
//         user.id === userId ? { ...user, isFavorite: !user.isFavorite } : user
//       );

//       if (selectedUser && selectedUser.id === userId) {
//         const updatedSelected = updated.find((u) => u.id === userId) || null;
//         setSelectedUser(updatedSelected);
//       }

//       return updated;
//     });
//   };

//   const navigateToChat = (user: User) => {
//     router.push({
//       pathname: "/(tabs)/chats/chat",
//       params: {
//         name: user.name,
//         image:
//           typeof user.image === "object"
//             ? undefined
//             : (user.image as string) ??
//               "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100",
//         isOnline: (user.isOnline || false).toString(),
//       },
//     });
//   };

//   const navigateToReport = () => {
//     setShowProfileMenu(false);
//     setSelectedUser(null);
//     router.push("/(tabs)/discover/report");
//   };

//   // Build filtered users from fetched list
//   const filteredUsers = users.filter((user) => {
//     if (selectedTab === "favorites" && !user.isFavorite) return false;
//     if (selectedRole !== "All" && user.role !== selectedRole) return false;

//     if (searchQuery.trim() !== "") {
//       const query = searchQuery.toLowerCase();
//       const matchesName = user.name.toLowerCase().includes(query);
//       const matchesRole = (user.role || "").toLowerCase().includes(query);
//       return matchesName || matchesRole;
//     }
//     return true;
//   });

//   const filteredNotifications =
//     notificationTab === "all"
//       ? MOCK_NOTIFICATIONS
//       : notificationTab === "messages"
//       ? MOCK_NOTIFICATIONS.filter((n) => n.type === "message")
//       : MOCK_NOTIFICATIONS.filter((n) => n.type === "donation");

//   const getNotificationIcon = (type: string) => {
//     switch (type) {
//       case "message":
//         return (
//           <View className="w-12 h-12 bg-[#19191B] rounded-2xl items-center justify-center">
//             <Image
//               source={require("../../../assets/images/mess-notification.png")}
//               style={{ width: 24, height: 24 }}
//               resizeMode="contain"
//             />
//           </View>
//         );
//       case "donation":
//         return (
//           <View className="w-12 h-12 bg-[#19191B] rounded-2xl items-center justify-center">
//             <Image
//               source={require("../../../assets/images/heart-notification.png")}
//               style={{ width: 24, height: 24 }}
//               resizeMode="contain"
//             />
//           </View>
//         );
//       case "system":
//         return (
//           <View className="w-12 h-12 bg-[#19191B] rounded-2xl items-center justify-center">
//             <Image
//               source={require("../../../assets/images/settings-notification.png")}
//               style={{ width: 24, height: 24 }}
//               resizeMode="contain"
//             />
//           </View>
//         );
//       case "video":
//         return (
//           <View className="w-12 h-12 bg-[#19191B] rounded-2xl items-center justify-center">
//             <Image
//               source={require("../../../assets/images/videocall-notification.png")}
//               style={{ width: 24, height: 24 }}
//               resizeMode="contain"
//             />
//           </View>
//         );
//       default:
//         return null;
//     }
//   };

//   // Fetch influencer profiles joined with users
//   const fetchInfluencers = useCallback(async () => {
//     setLoading(true);
//     try {
//       const { data, error } = await supabase.from("influencer_profiles")
//         .select(`
//           id,
//           user_id,
//           display_name,
//           bio,
//           category,
//           profile_image_url,
//           cover_image_url,
//           price_per_message,
//           is_available,
//           average_rating,
//           total_reviews,
//           users ( full_name, avatar_url )
//         `);

//       if (error) {
//         console.error("fetchInfluencers error:", error);
//         return;
//       }

//       const mapped: User[] = (data || []).map((row: any) => ({
//         id: row.id,
//         name: row.display_name ?? row.users?.full_name ?? "Unknown",
//         role: row.category ?? "Influencer",
//         image:
//           row.profile_image_url ?? row.users?.avatar_url ?? PLACEHOLDER_IMAGE,
//         about: row.bio,
//         rating: Number(row.average_rating) || 0,
//         isOnline: !!row.is_available,
//         price_per_message: Number(row.price_per_message) || 0,
//         gallery: [], // if you have a gallery table, fetch separately
//         isFavorite: false,
//       }));

//       setUsers(mapped);
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   // Subscribe to changes on influencer_profiles (refetch on change)
//   useEffect(() => {
//     fetchInfluencers();

//     // Realtime subscription — refetch on any change
//     const channel = supabase
//       .channel("public:influencer_profiles")
//       .on(
//         "postgres_changes",
//         { event: "*", schema: "public", table: "influencer_profiles" },
//         (payload) => {
//           // console.log("realtime payload:", payload);
//           fetchInfluencers();
//         }
//       )
//       .subscribe();

//     return () => {
//       // remove the channel
//       supabase.removeChannel(channel);
//     };
//   }, [fetchInfluencers]);

//   // Ensure current signed-in user has a users row and influencer_profiles row
//   useEffect(() => {
//     (async () => {
//       try {
//         const resp = await supabase.auth.getUser();
//         const authUser = resp?.data?.user;
//         if (authUser) {
//           // ensure your app users row exists
//           await createAppUserIfMissing(authUser);
//           // ensure influencer_profiles exists (safe to call; upsert will update)
//           await ensureInfluencerProfileForUser(authUser.id);
//           // finally refetch influencers to reflect any new data
//           await fetchInfluencers();
//         }
//       } catch (err) {
//         console.error("error ensuring user/profile:", err);
//       }
//     })();
//   }, [fetchInfluencers]);

//   // UI Rendering (adapted from your original code)
//   return (
//     <View className="flex-1 bg-black">
//       {/* Header */}
//       <View className="pt-12 pb-4 px-6">
//         <View className="flex-row items-center justify-between mb-6">
//           <TouchableOpacity>
//             <ChevronLeft size={28} color="#fff" />
//           </TouchableOpacity>
//           <Text className="text-white font-bold text-[18px]">Discover</Text>
//           <TouchableOpacity onPress={() => setShowNotificationModal(true)}>
//             <Image
//               source={require("../../../assets/images/bell-notification.png")}
//               style={{ width: 24, height: 28 }}
//               resizeMode="contain"
//             />
//           </TouchableOpacity>
//         </View>

//         {/* Search Bar and Filter */}
//         <View className="flex-row items-center gap-[12px] mb-6">
//           {/* Search Bar */}
//           <View className="flex-1 h-[40px] flex-row items-center bg-black border border-[#3C3C3E] rounded-xl px-3">
//             <Search size={20} color="#fff" style={{ width: 20, height: 20 }} />
//             <TextInput
//               className="flex-1 text-white text-[15px] ml-2"
//               placeholder="Search"
//               placeholderTextColor="#8E8E93"
//               value={searchQuery}
//               onChangeText={setSearchQuery}
//             />
//           </View>

//           {/* Filter Button */}
//           <TouchableOpacity
//             onPress={() => setShowFilterModal(true)}
//             className="w-[40px] h-[40px] items-center justify-center"
//           >
//             <Image
//               source={require("../../../assets/images/filter-icon.png")}
//               style={{ width: 24, height: 24 }}
//               resizeMode="contain"
//             />
//           </TouchableOpacity>
//         </View>

//         {/* Tabs */}
//         <View className="flex-row bg-[#1C1C1E] rounded-[11.63px] p-[3.88px]">
//           <TouchableOpacity
//             onPress={() => setSelectedTab("everyone")}
//             activeOpacity={0.9}
//             className={`flex-1 items-center justify-center rounded-[11.63px] h-[32px] ${
//               selectedTab === "everyone" ? "bg-[#FCCD34]" : "bg-transparent"
//             }`}
//           >
//             <Text
//               className={`text-[16px] ${
//                 selectedTab === "everyone" ? "text-[#13131B]" : "text-[#8E8E93]"
//               }`}
//             >
//               Everyone
//             </Text>
//           </TouchableOpacity>

//           <TouchableOpacity
//             onPress={() => setSelectedTab("favorites")}
//             activeOpacity={0.9}
//             className={`flex-1 items-center justify-center rounded-[11.63px] h-[32px] ${
//               selectedTab === "favorites" ? "bg-[#FCCD34]" : "bg-transparent"
//             }`}
//           >
//             <Text
//               className={`text-[16px] ${
//                 selectedTab === "favorites" ? "text-black" : "text-[#8E8E93]"
//               }`}
//             >
//               Favorites
//             </Text>
//           </TouchableOpacity>
//         </View>
//       </View>

//       {/* User Grid */}
//       <ScrollView
//         className="flex-1 px-6"
//         showsVerticalScrollIndicator={false}
//         contentContainerStyle={{ paddingBottom: 24 }}
//       >
//         {loading && (
//           <View className="items-center justify-center py-6">
//             <ActivityIndicator size="small" color="#FCCD34" />
//           </View>
//         )}

//         <View className="flex-row flex-wrap justify-between pb-24">
//           {filteredUsers.map((user) => (
//             <TouchableOpacity
//               key={user.id}
//               className="w-[48%] mb-4"
//               onPress={() => setSelectedUser(user)}
//             >
//               <View
//                 className="relative rounded-3xl overflow-hidden"
//                 style={{ height: 260 }}
//               >
//                 <Image
//                   source={user.image}
//                   className="w-full h-full"
//                   resizeMode="cover"
//                 />

//                 {/* Gradient Overlay */}
//                 <LinearGradient
//                   colors={["rgba(0,0,0,0.9)", "transparent"]}
//                   start={{ x: 0.5, y: 1 }}
//                   end={{ x: 0.5, y: 0 }}
//                   style={{
//                     position: "absolute",
//                     bottom: 0,
//                     left: 0,
//                     right: 0,
//                     height: "60%",
//                   }}
//                 />

//                 {/* Favorite Star */}
//                 <TouchableOpacity
//                   className="absolute top-4 right-4 z-10"
//                   onPress={() => toggleFavorite(user.id)}
//                 >
//                   <Star
//                     size={26}
//                     color={user.isFavorite ? "#FCCD34" : "#fff"}
//                     fill={user.isFavorite ? "#FCCD34" : "transparent"}
//                     strokeWidth={2}
//                   />
//                 </TouchableOpacity>

//                 {/* User Info */}
//                 <View
//                   style={{
//                     position: "absolute",
//                     bottom: 0,
//                     left: 0,
//                     right: 0,
//                     alignItems: "center",
//                     paddingBottom: 16,
//                   }}
//                 >
//                   <Text
//                     style={{
//                       color: "#fff",
//                       fontSize: 20,
//                       fontWeight: "600",
//                       marginBottom: 2,
//                     }}
//                   >
//                     {user.name}
//                   </Text>

//                   <Text
//                     style={{
//                       color: "#E5E5E5",
//                       fontSize: 14,
//                       marginBottom: 8,
//                     }}
//                   >
//                     {user.role}
//                   </Text>

//                   <TouchableOpacity
//                     activeOpacity={0.8}
//                     onPress={() => navigateToChat(user)}
//                     style={{
//                       backgroundColor: "#FCCD34",
//                       borderRadius: 5,
//                       paddingVertical: 4,
//                       paddingHorizontal: 8,
//                       flexDirection: "row",
//                       alignItems: "center",
//                       justifyContent: "center",
//                       minWidth: 60,
//                     }}
//                   >
//                     <Text
//                       style={{
//                         color: "black",
//                         fontWeight: "500",
//                         fontSize: 11,
//                       }}
//                     >
//                       Message
//                     </Text>
//                   </TouchableOpacity>
//                 </View>
//               </View>
//             </TouchableOpacity>
//           ))}
//         </View>
//       </ScrollView>

//       {/* Filter Modal */}
//       <Modal
//         visible={showFilterModal}
//         animationType="slide"
//         transparent={true}
//         onRequestClose={() => setShowFilterModal(false)}
//       >
//         <View className="flex-1 justify-end">
//           <TouchableOpacity
//             className="flex-1 bg-black/50"
//             activeOpacity={1}
//             onPress={() => setShowFilterModal(false)}
//           />
//           <View className="bg-[#1C1C1E] rounded-t-3xl pt-2 pb-8">
//             {/* Handle Bar */}
//             <View className="items-center py-3">
//               <View className="w-10 h-1 bg-white/30 rounded-full" />
//             </View>

//             {/* Role List */}
//             <ScrollView
//               className="px-6"
//               style={{ maxHeight: 500 }}
//               showsVerticalScrollIndicator={false}
//             >
//               {ROLES.map((role, index) => (
//                 <TouchableOpacity
//                   key={index}
//                   className="flex-row items-center justify-between px-6 py-5"
//                   onPress={() => setSelectedRole(role)}
//                 >
//                   <Text
//                     className={`text-lg ${
//                       selectedRole === role ? "text-[#FCCD34]" : "text-white"
//                     }`}
//                   >
//                     {role}
//                   </Text>
//                   <View
//                     className={`w-6 h-6 rounded-full ${
//                       selectedRole === role
//                         ? "bg-[#FCCD34]"
//                         : "border-2 border-gray-500"
//                     } items-center justify-center`}
//                   >
//                     {selectedRole === role && (
//                       <View className="w-3 h-3 rounded-full bg-black" />
//                     )}
//                   </View>
//                 </TouchableOpacity>
//               ))}
//             </ScrollView>
//           </View>
//         </View>
//       </Modal>

//       {/* Notification Modal */}
//       <Modal
//         visible={showNotificationModal}
//         animationType="slide"
//         presentationStyle="fullScreen"
//         onRequestClose={() => setShowNotificationModal(false)}
//       >
//         <View className="flex-1 bg-black">
//           <View className="pt-12 pb-4 px-6">
//             <View className="flex-row items-center justify-between mb-6">
//               <TouchableOpacity onPress={() => setShowNotificationModal(false)}>
//                 <ChevronLeft size={28} color="#fff" />
//               </TouchableOpacity>
//               <Text className="text-white text-2xl font-bold">
//                 Notifications
//               </Text>
//               <View style={{ width: 28 }} />
//             </View>

//             {/* Notification Tabs */}
//             <View className="flex-row items-center px-4 py-3 bg-black">
//               <TouchableOpacity
//                 onPress={() => setNotificationTab("all")}
//                 className="items-center mr-6"
//               >
//                 <View className="flex-row items-center pb-2">
//                   <Image
//                     source={require("../../../assets/images/bell-notification.png")}
//                     style={{ width: 18, height: 18, marginRight: 6 }}
//                     resizeMode="contain"
//                   />
//                   <Text
//                     className={`font-semibold text-base ${
//                       notificationTab === "all"
//                         ? "text-white"
//                         : "text-[#8E8E93]"
//                     }`}
//                   >
//                     All
//                   </Text>
//                 </View>
//                 {notificationTab === "all" && (
//                   <View className="h-0.5 w-full bg-white absolute bottom-0" />
//                 )}
//               </TouchableOpacity>

//               <TouchableOpacity
//                 onPress={() => setNotificationTab("messages")}
//                 className="items-center mr-6"
//               >
//                 <View className="flex-row items-center pb-2">
//                   <Image
//                     source={require("../../../assets/images/white-message.png")}
//                     style={{ width: 18, height: 18, marginRight: 6 }}
//                     resizeMode="contain"
//                   />
//                   <Text
//                     className={`font-semibold text-base ${
//                       notificationTab === "messages"
//                         ? "text-white"
//                         : "text-[#8E8E93]"
//                     }`}
//                   >
//                     Messages
//                   </Text>
//                 </View>
//                 {notificationTab === "messages" && (
//                   <View className="h-0.5 w-full bg-white absolute bottom-0" />
//                 )}
//               </TouchableOpacity>

//               <TouchableOpacity
//                 onPress={() => setNotificationTab("donations")}
//                 className="items-center"
//               >
//                 <View className="flex-row items-center pb-2">
//                   <Image
//                     source={require("../../../assets/images/heart-notification.png")}
//                     style={{ width: 18, height: 18, marginRight: 6 }}
//                     resizeMode="contain"
//                   />
//                   <Text
//                     className={`font-semibold text-base ${
//                       notificationTab === "donations"
//                         ? "text-white"
//                         : "text-[#8E8E93]"
//                     }`}
//                   >
//                     Donations
//                   </Text>
//                 </View>
//                 {notificationTab === "donations" && (
//                   <View className="h-0.5 w-full bg-white absolute bottom-0" />
//                 )}
//               </TouchableOpacity>
//             </View>
//           </View>

//           {/* Notifications List */}
//           <ScrollView
//             className="flex-1 px-6"
//             showsVerticalScrollIndicator={false}
//           >
//             {filteredNotifications.map((notification) => (
//               <View key={notification.id} className="mb-4">
//                 <View className="flex-row items-center">
//                   {getNotificationIcon(notification.type)}
//                   <View className="flex-1 ml-3">
//                     <Text
//                       className={`text-base font-semibold ${
//                         notification.type === "message"
//                           ? "text-[#FCCD34]"
//                           : "text-white"
//                       }`}
//                     >
//                       {notification.title}
//                     </Text>
//                     {notification.subtitle && (
//                       <Text className="text-[#8E8E93] text-sm mt-0.5">
//                         {notification.subtitle}
//                       </Text>
//                     )}
//                     {notification.time && (
//                       <Text className="text-[#8E8E93] text-sm mt-0.5">
//                         {notification.time}
//                       </Text>
//                     )}
//                   </View>
//                   <TouchableOpacity
//                     onPress={() =>
//                       setShowNotificationMenu(
//                         showNotificationMenu === notification.id
//                           ? null
//                           : notification.id
//                       )
//                     }
//                   >
//                     <MoreVertical size={20} color="#8E8E93" />
//                   </TouchableOpacity>
//                 </View>

//                 {/* Notification Menu */}
//                 {showNotificationMenu === notification.id && (
//                   <View className="mt-2 bg-[#2C2C2E] rounded-xl overflow-hidden">
//                     <TouchableOpacity className="flex-row items-center px-4 py-3 border-b border-[#3C3C3E]">
//                       <Image
//                         source={require("../../../assets/images/notification-off.png")}
//                         style={{ width: 20, height: 20, marginRight: 10 }}
//                         resizeMode="contain"
//                       />
//                       <Text className="text-white font-medium">
//                         Turn off notifications
//                       </Text>
//                     </TouchableOpacity>
//                     <TouchableOpacity className="flex-row items-center px-4 py-3">
//                       <Image
//                         source={require("../../../assets/images/delete-notification.png")}
//                         style={{ width: 20, height: 20, marginRight: 10 }}
//                         resizeMode="contain"
//                       />
//                       <Text className="text-red-500 font-medium">Delete</Text>
//                     </TouchableOpacity>
//                   </View>
//                 )}
//               </View>
//             ))}
//           </ScrollView>
//         </View>
//       </Modal>

//       {/* Profile Detail Modal */}
//       <Modal
//         visible={selectedUser !== null}
//         animationType="slide"
//         presentationStyle="pageSheet"
//         onRequestClose={() => setSelectedUser(null)}
//       >
//         {selectedUser && (
//           <View className="flex-1 bg-black">
//             <ScrollView showsVerticalScrollIndicator={false}>
//               {/* Profile Image */}
//               <View className="relative" style={{ height: 600 }}>
//                 <Image
//                   source={selectedUser.image}
//                   className="w-full h-full"
//                   resizeMode="cover"
//                 />

//                 {/* Back Button */}
//                 <TouchableOpacity
//                   className="absolute top-12 left-6 w-10 h-10 bg-black/50 rounded-full items-center justify-center"
//                   onPress={() => {
//                     setSelectedUser(null);
//                     setShowProfileMenu(false);
//                   }}
//                 >
//                   <ChevronLeft size={24} color="#fff" />
//                 </TouchableOpacity>

//                 {/* Handle Bar */}
//                 <View className="absolute top-3 left-0 right-0 items-center">
//                   <View className="w-10 h-1 bg-white/30 rounded-full" />
//                 </View>

//                 {/* More Options */}
//                 <TouchableOpacity
//                   className="absolute top-12 right-6"
//                   onPress={() => setShowProfileMenu(!showProfileMenu)}
//                 >
//                   <MoreVertical size={24} color="#fff" />
//                 </TouchableOpacity>

//                 {/* Profile Menu Dropdown */}
//                 {showProfileMenu && (
//                   <View
//                     className="absolute rounded-xl overflow-hidden"
//                     style={{
//                       position: "absolute",
//                       top: 56,
//                       right: 16,
//                       width: 160,
//                       backgroundColor: "#19191B",
//                       borderRadius: 12,
//                       paddingVertical: 6,
//                       elevation: 6,
//                       shadowColor: "#000",
//                       shadowOffset: { width: 0, height: 6 },
//                       shadowOpacity: 0.25,
//                       shadowRadius: 12,
//                     }}
//                   >
//                     {/* Report */}
//                     <TouchableOpacity
//                       className="flex-row items-center px-3"
//                       style={{
//                         height: 44,
//                       }}
//                       onPress={navigateToReport}
//                       activeOpacity={0.8}
//                     >
//                       <Image
//                         source={require("../../../assets/images/flag.png")}
//                         style={{ width: 16, height: 16, marginRight: 12 }}
//                         resizeMode="contain"
//                       />
//                       <Text className="text-white font-medium">Report</Text>
//                     </TouchableOpacity>

//                     <View
//                       style={{
//                         height: 1,
//                         backgroundColor: "#29292C",
//                         marginHorizontal: 8,
//                       }}
//                     />

//                     {/* Block */}
//                     <TouchableOpacity
//                       className="flex-row items-center px-3"
//                       style={{
//                         height: 44,
//                       }}
//                       onPress={() => {
//                         setShowProfileMenu(false);
//                         Alert.alert(
//                           "Block user",
//                           "Are you sure you want to block this user?",
//                           [
//                             { text: "Cancel", style: "cancel" },
//                             {
//                               text: "Block",
//                               style: "destructive",
//                               onPress: () => console.log("User blocked"),
//                             },
//                           ]
//                         );
//                       }}
//                       activeOpacity={0.8}
//                     >
//                       <Image
//                         source={require("../../../assets/images/cross.png")}
//                         style={{ width: 16, height: 16, marginRight: 12 }}
//                         resizeMode="contain"
//                       />
//                       <Text className="text-red-500 font-medium">Block</Text>
//                     </TouchableOpacity>
//                   </View>
//                 )}

//                 {/* Profile Info Card - Overlapping */}
//                 <View
//                   className="absolute bottom-0 left-0 right-0 rounded-t-3xl"
//                   style={{
//                     backgroundColor: "rgba(25, 25, 27, 0.85)",
//                     paddingTop: 24,
//                     paddingHorizontal: 24,
//                     paddingBottom: 24,
//                   }}
//                 >
//                   <View className="flex-row items-center justify-between mb-4">
//                     <View className="flex-row items-center">
//                       <Text className="text-white text-2xl font-bold mr-2">
//                         {selectedUser.name}
//                       </Text>
//                       <Image
//                         source={require("../../../assets/images/verified-badge.png")}
//                         style={{ width: 20, height: 20 }}
//                         resizeMode="contain"
//                       />
//                     </View>
//                     <TouchableOpacity
//                       className="w-12 h-12 bg-[#2C2C2E] rounded-full items-center justify-center"
//                       onPress={() => toggleFavorite(selectedUser.id)}
//                     >
//                       <Star
//                         size={24}
//                         color={selectedUser.isFavorite ? "#FCCD34" : "#fff"}
//                         fill={
//                           selectedUser.isFavorite ? "#FCCD34" : "transparent"
//                         }
//                       />
//                     </TouchableOpacity>
//                   </View>

//                   <View className="flex-row items-center mb-5">
//                     <Text className="text-[#FCCD34] text-base font-semibold mr-2">
//                       {selectedUser.role}
//                     </Text>
//                   </View>

//                   {/* Action Buttons */}
//                   <View className="mb-0">
//                     <TouchableOpacity
//                       className="bg-[#FCCD34] rounded-xl py-4 items-center justify-center mb-3"
//                       onPress={() => {
//                         setSelectedUser(null);
//                         navigateToChat(selectedUser);
//                       }}
//                     >
//                       <View className="flex-row items-center">
//                         <Image
//                           source={require("../../../assets/images/message.png")}
//                           style={{ width: 20, height: 20 }}
//                           resizeMode="contain"
//                         />
//                         <Text className="text-black text-base font-bold ml-2">
//                           Message
//                         </Text>
//                       </View>
//                     </TouchableOpacity>
//                     <TouchableOpacity
//                       className="bg-transparent border-2 border-[#FCCD34] rounded-xl py-4 items-center justify-center"
//                       onPress={() => {
//                         setSelectedUser(null);
//                         router.push("/(tabs)/discover/donation");
//                       }}
//                     >
//                       <View className="flex-row items-center">
//                         <Image
//                           source={require("../../../assets/images/yellow-heart.png")}
//                           style={{ width: 20, height: 20, marginRight: 8 }}
//                           resizeMode="contain"
//                         />
//                         <Text className="text-[#FCCD34] text-base font-bold">
//                           Donation
//                         </Text>
//                       </View>
//                     </TouchableOpacity>
//                   </View>
//                 </View>
//               </View>

//               {/* About Section - Below the card */}
//               <View className="px-6 py-4 bg-black">
//                 <View className="mb-6">
//                   <Text className="text-white text-lg font-bold mb-2">
//                     About
//                   </Text>
//                   <Text className="text-[#8E8E93] mb-2 leading-6">
//                     {selectedUser.about}
//                   </Text>
//                   <TouchableOpacity>
//                     <Text className="text-[#6E6E73]">
//                       Bam Margera is a celebrated actor, content creator, and
//                       entrepreneur known for blending boundary-pushing comedy
//                       with professional creativity....
//                     </Text>
//                   </TouchableOpacity>
//                 </View>

//                 {/* Gallery */}
//                 <View className="mb-6">
//                   <View className="flex-row items-center justify-between mb-3">
//                     <Text className="text-white text-lg font-bold">
//                       Gallery
//                     </Text>
//                     <TouchableOpacity>
//                       <Text className="text-[#FCCD34] font-semibold">
//                         See all
//                       </Text>
//                     </TouchableOpacity>
//                   </View>
//                   <ScrollView
//                     horizontal
//                     showsHorizontalScrollIndicator={false}
//                     className="flex-row"
//                   >
//                     {selectedUser.gallery?.length ? (
//                       selectedUser.gallery.map((img, index) => (
//                         <Image
//                           key={index}
//                           source={{ uri: img }}
//                           className="w-32 h-48 rounded-2xl mr-3"
//                           resizeMode="cover"
//                         />
//                       ))
//                     ) : (
//                       <Image
//                         source={PLACEHOLDER_IMAGE}
//                         className="w-32 h-48 rounded-2xl mr-3"
//                         resizeMode="cover"
//                       />
//                     )}
//                   </ScrollView>
//                 </View>
//               </View>
//             </ScrollView>
//           </View>
//         )}
//       </Modal>
//     </View>
//   );
// }
// app/(tabs)/discover/index.tsx  (or wherever your DiscoverScreen file lives)
import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Modal,
  Alert,
  ActivityIndicator,
} from "react-native";
import {
  Search,
  Star,
  MessageCircle,
  MoreVertical,
  ChevronLeft,
} from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { supabase } from "../../../supabaseClient"; // <- ensure this path is correct

// --- Types ---
interface User {
  id: string; // uuid
  name: string;
  role: string;
  image: any; // local require or { uri: string }
  isFavorite?: boolean;
  location?: string;
  about?: string;
  rating?: number;
  isOnline?: boolean;
  gallery?: string[];
  price_per_message?: number;
}

interface Notification {
  id: number;
  type: "message" | "donation" | "system" | "video";
  title: string;
  subtitle?: string;
  time: string;
  icon: string;
}

// --- Placeholder notifications (kept from your original) ---
const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: 1,
    type: "message",
    title: "New message from Bam",
    time: "2 hours ago",
    icon: "message",
  },
  {
    id: 2,
    type: "donation",
    title: "Donation sent successfully",
    subtitle: "Tap to view conversation",
    time: "",
    icon: "heart",
  },
  {
    id: 3,
    type: "system",
    title: "Low balance — add funds",
    time: "2 hours ago",
    icon: "settings",
  },
  {
    id: 4,
    type: "video",
    title: "Video call accepted",
    subtitle: "Tap to view conversation",
    time: "",
    icon: "video",
  },
];

const ROLES = ["All", "Influencer", "Doctor", "Youtuber", "Actor"];

// Local placeholder image (same as your mock)
const PLACEHOLDER_IMAGE = require("../../../assets/images/discover.png");

// --- Helper functions for DB operations ---

/**
 * Ensure there is a row in your app 'users' table for the authenticated user.
 * This is necessary when you use a separate 'users' app table joined to auth.
 */
async function createAppUserIfMissing(authUser: any) {
  if (!authUser?.id) return;
  const userId = authUser.id;

  try {
    // 1) check if user already exists
    const { data: existing, error: selectError } = await supabase
      .from("users")
      .select("id")
      .eq("id", userId)
      .maybeSingle();

    if (selectError) {
      console.error("createAppUserIfMissing select error:", selectError);
      // don't throw — best-effort only
      return;
    }

    if (existing) {
      // user already exists — do nothing (do NOT update/overwrite)
      return;
    }

    // 2) insert only when missing
    const newUser: any = {
      id: userId,
      full_name:
        authUser.user_metadata?.full_name ??
        authUser.user_metadata?.name ??
        "Unnamed",
      phone_number:
        authUser.phone ??
        authUser.user_metadata?.phone ??
        authUser.user_metadata?.phone_number ??
        null,
      is_active: true,
      is_verified: true,
      user_type: "influencer",
      // add other required columns with defaults if your `users` table requires them
    };

    const { error: insertError } = await supabase
      .from("users")
      .insert(newUser, { returning: "minimal" });

    if (insertError) {
      console.error("createAppUserIfMissing insert error:", insertError);
    }
  } catch (err) {
    console.error("createAppUserIfMissing unexpected error:", err);
  }
}

/**
 * Ensure there is an influencer_profiles row for this user (upsert).
 * Returns the influencer_profiles row or null.
 */
async function ensureInfluencerProfileForUser(userId: string) {
  if (!userId) return null;

  // make sure users row exists; if not, skip creating influencer_profile
  const { data: userRow, error: userErr } = await supabase
    .from("users")
    .select("id")
    .eq("id", userId)
    .maybeSingle();

  if (userErr) {
    console.error("ensureInfluencerProfileForUser user check error:", userErr);
    return null;
  }
  if (!userRow) {
    // no users row — don't create influencer_profiles to avoid FK issues
    return null;
  }

  // existing upsert logic (unchanged)
  const defaultProfile = {
    user_id: userId,
    display_name: "New Creator",
    bio: "",
    user_type: "Influencer",
    profile_image_url: null,
    cover_image_url: null,
    price_per_message: 0.0,
    price_per_minute_audio: 0.0,
    price_per_minute_video: 0.0,
    is_available: true,
    auto_response_enabled: false,
    auto_response_message: null,
  };

  const { data, error } = await supabase
    .from("influencer_profiles")
    .upsert(defaultProfile, {
      onConflict: "user_id",
      returning: "representation",
    })
    .select();

  if (error) {
    console.error("ensureInfluencerProfileForUser error:", error);
    return null;
  }

  return (data && data[0]) || null;
}

// --- Main component ---
export default function DiscoverScreen() {
  const router = useRouter();

  // UI state
  const [selectedTab, setSelectedTab] = useState<"everyone" | "favorites">(
    "everyone"
  );
  const [notificationTab, setNotificationTab] = useState<
    "all" | "messages" | "donations"
  >("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState("All");
  const [showNotificationMenu, setShowNotificationMenu] = useState<
    number | null
  >(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [loading, setLoading] = useState(false);

  // Favorites toggling (stored only in local UI; persist separately if needed)
  const toggleFavorite = (userId: string) => {
    setUsers((prev) => {
      const updated = prev.map((user) =>
        user.id === userId ? { ...user, isFavorite: !user.isFavorite } : user
      );

      if (selectedUser && selectedUser.id === userId) {
        const updatedSelected = updated.find((u) => u.id === userId) || null;
        setSelectedUser(updatedSelected);
      }

      return updated;
    });
  };

  const navigateToChat = (user: User) => {
    router.push({
      pathname: "/(tabs)/chats/chat",
      params: {
        name: user.name,
        image:
          typeof user.image === "object"
            ? undefined
            : (user.image as string) ??
              "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100",
        isOnline: (user.isOnline || false).toString(),
      },
    });
  };

  const navigateToReport = () => {
    setShowProfileMenu(false);
    setSelectedUser(null);
    router.push("/(tabs)/discover/report");
  };

  // Build filtered users from fetched list
  const filteredUsers = users.filter((user) => {
    if (selectedTab === "favorites" && !user.isFavorite) return false;
    if (selectedRole !== "All" && user.role !== selectedRole) return false;

    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      const matchesName = user.name.toLowerCase().includes(query);
      const matchesRole = (user.role || "").toLowerCase().includes(query);
      return matchesName || matchesRole;
    }
    return true;
  });

  const filteredNotifications =
    notificationTab === "all"
      ? MOCK_NOTIFICATIONS
      : notificationTab === "messages"
      ? MOCK_NOTIFICATIONS.filter((n) => n.type === "message")
      : MOCK_NOTIFICATIONS.filter((n) => n.type === "donation");

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "message":
        return (
          <View className="w-12 h-12 bg-[#19191B] rounded-2xl items-center justify-center">
            <Image
              source={require("../../../assets/images/mess-notification.png")}
              style={{ width: 24, height: 24 }}
              resizeMode="contain"
            />
          </View>
        );
      case "donation":
        return (
          <View className="w-12 h-12 bg-[#19191B] rounded-2xl items-center justify-center">
            <Image
              source={require("../../../assets/images/heart-notification.png")}
              style={{ width: 24, height: 24 }}
              resizeMode="contain"
            />
          </View>
        );
      case "system":
        return (
          <View className="w-12 h-12 bg-[#19191B] rounded-2xl items-center justify-center">
            <Image
              source={require("../../../assets/images/settings-notification.png")}
              style={{ width: 24, height: 24 }}
              resizeMode="contain"
            />
          </View>
        );
      case "video":
        return (
          <View className="w-12 h-12 bg-[#19191B] rounded-2xl items-center justify-center">
            <Image
              source={require("../../../assets/images/videocall-notification.png")}
              style={{ width: 24, height: 24 }}
              resizeMode="contain"
            />
          </View>
        );
      default:
        return null;
    }
  };

  // Fetch influencer profiles joined with users
  const fetchInfluencers = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from("influencer_profiles")
        .select(`
          id,
          user_id,
          display_name,
          bio,
          user_type,
          profile_image_url,
          cover_image_url,
          price_per_message,
          is_available,
          average_rating,
          total_reviews,
          users ( full_name, avatar_url )
        `);

      if (error) {
        console.error("fetchInfluencers error:", error);
        return;
      }

      const mapped: User[] = (data || []).map((row: any) => ({
        id: row.id,
        name: row.display_name ?? row.users?.full_name ?? "Unknown",
        role: row.user_type ?? "Influencer",
        image:
          row.profile_image_url ?? row.users?.avatar_url ?? PLACEHOLDER_IMAGE,
        about: row.bio,
        rating: Number(row.average_rating) || 0,
        isOnline: !!row.is_available,
        price_per_message: Number(row.price_per_message) || 0,
        gallery: [], // if you have a gallery table, fetch separately
        isFavorite: false,
      }));

      setUsers(mapped);
    } finally {
      setLoading(false);
    }
  }, []);

  // Subscribe to changes on influencer_profiles (refetch on change)
  useEffect(() => {
    fetchInfluencers();

    // Realtime subscription — refetch on any change
    const channel = supabase
      .channel("public:influencer_profiles")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "influencer_profiles" },
        (payload) => {
          // console.log("realtime payload:", payload);
          fetchInfluencers();
        }
      )
      .subscribe();

    return () => {
      // remove the channel
      supabase.removeChannel(channel);
    };
  }, [fetchInfluencers]);

  // Ensure current signed-in user has a users row and influencer_profiles row
  useEffect(() => {
    (async () => {
      try {
        const resp = await supabase.auth.getUser();
        const authUser = resp?.data?.user;
        if (authUser) {
          // ensure your app users row exists
          await createAppUserIfMissing(authUser);
          // ensure influencer_profiles exists (safe to call; upsert will update)
          await ensureInfluencerProfileForUser(authUser.id);
          // finally refetch influencers to reflect any new data
          await fetchInfluencers();
        }
      } catch (err) {
        console.error("error ensuring user/profile:", err);
      }
    })();
  }, [fetchInfluencers]);

  // UI Rendering (adapted from your original code)
  return (
    <View className="flex-1 bg-black">
      {/* Header */}
      <View className="pt-12 pb-4 px-6">
        <View className="flex-row items-center justify-between mb-6">
          <TouchableOpacity>
            <ChevronLeft size={28} color="#fff" />
          </TouchableOpacity>
          <Text className="text-white font-bold text-[18px]">Discover</Text>
          <TouchableOpacity onPress={() => setShowNotificationModal(true)}>
            <Image
              source={require("../../../assets/images/bell-notification.png")}
              style={{ width: 24, height: 28 }}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>

        {/* Search Bar and Filter */}
        <View className="flex-row items-center gap-[12px] mb-6">
          {/* Search Bar */}
          <View className="flex-1 h-[40px] flex-row items-center bg-black border border-[#3C3C3E] rounded-xl px-3">
            <Search size={20} color="#fff" style={{ width: 20, height: 20 }} />
            <TextInput
              className="flex-1 text-white text-[15px] ml-2"
              placeholder="Search"
              placeholderTextColor="#8E8E93"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          {/* Filter Button */}
          <TouchableOpacity
            onPress={() => setShowFilterModal(true)}
            className="w-[40px] h-[40px] items-center justify-center"
          >
            <Image
              source={require("../../../assets/images/filter-icon.png")}
              style={{ width: 24, height: 24 }}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>

        {/* Tabs */}
        <View className="flex-row bg-[#1C1C1E] rounded-[11.63px] p-[3.88px]">
          <TouchableOpacity
            onPress={() => setSelectedTab("everyone")}
            activeOpacity={0.9}
            className={`flex-1 items-center justify-center rounded-[11.63px] h-[32px] ${
              selectedTab === "everyone" ? "bg-[#FCCD34]" : "bg-transparent"
            }`}
          >
            <Text
              className={`text-[16px] ${
                selectedTab === "everyone" ? "text-[#13131B]" : "text-[#8E8E93]"
              }`}
            >
              Everyone
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setSelectedTab("favorites")}
            activeOpacity={0.9}
            className={`flex-1 items-center justify-center rounded-[11.63px] h-[32px] ${
              selectedTab === "favorites" ? "bg-[#FCCD34]" : "bg-transparent"
            }`}
          >
            <Text
              className={`text-[16px] ${
                selectedTab === "favorites" ? "text-black" : "text-[#8E8E93]"
              }`}
            >
              Favorites
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* User Grid */}
      <ScrollView
        className="flex-1 px-6"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24 }}
      >
        {loading && (
          <View className="items-center justify-center py-6">
            <ActivityIndicator size="small" color="#FCCD34" />
          </View>
        )}

        <View className="flex-row flex-wrap justify-between pb-24">
          {filteredUsers.map((user) => (
            <TouchableOpacity
              key={user.id}
              className="w-[48%] mb-4"
              onPress={() => setSelectedUser(user)}
            >
              <View
                className="relative rounded-3xl overflow-hidden"
                style={{ height: 260 }}
              >
                <Image
                  source={user.image}
                  className="w-full h-full"
                  resizeMode="cover"
                />

                {/* Gradient Overlay */}
                <LinearGradient
                  colors={["rgba(0,0,0,0.9)", "transparent"]}
                  start={{ x: 0.5, y: 1 }}
                  end={{ x: 0.5, y: 0 }}
                  style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: "60%",
                  }}
                />

                {/* Favorite Star */}
                <TouchableOpacity
                  className="absolute top-4 right-4 z-10"
                  onPress={() => toggleFavorite(user.id)}
                >
                  <Star
                    size={26}
                    color={user.isFavorite ? "#FCCD34" : "#fff"}
                    fill={user.isFavorite ? "#FCCD34" : "transparent"}
                    strokeWidth={2}
                  />
                </TouchableOpacity>

                {/* User Info */}
                <View
                  style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    alignItems: "center",
                    paddingBottom: 16,
                  }}
                >
                  <Text
                    style={{
                      color: "#fff",
                      fontSize: 20,
                      fontWeight: "600",
                      marginBottom: 2,
                    }}
                  >
                    {user.name}
                  </Text>

                  <Text
                    style={{
                      color: "#E5E5E5",
                      fontSize: 14,
                      marginBottom: 8,
                    }}
                  >
                    {user.role}
                  </Text>

                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => navigateToChat(user)}
                    style={{
                      backgroundColor: "#FCCD34",
                      borderRadius: 5,
                      paddingVertical: 4,
                      paddingHorizontal: 8,
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "center",
                      minWidth: 60,
                    }}
                  >
                    <Text
                      style={{
                        color: "black",
                        fontWeight: "500",
                        fontSize: 11,
                      }}
                    >
                      Message
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          ))}
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
            {/* Handle Bar */}
            <View className="items-center py-3">
              <View className="w-10 h-1 bg-white/30 rounded-full" />
            </View>

            {/* Role List */}
            <ScrollView
              className="px-6"
              style={{ maxHeight: 500 }}
              showsVerticalScrollIndicator={false}
            >
              {ROLES.map((role, index) => (
                <TouchableOpacity
                  key={index}
                  className="flex-row items-center justify-between px-6 py-5"
                  onPress={() => setSelectedRole(role)}
                >
                  <Text
                    className={`text-lg ${
                      selectedRole === role ? "text-[#FCCD34]" : "text-white"
                    }`}
                  >
                    {role}
                  </Text>
                  <View
                    className={`w-6 h-6 rounded-full ${
                      selectedRole === role
                        ? "bg-[#FCCD34]"
                        : "border-2 border-gray-500"
                    } items-center justify-center`}
                  >
                    {selectedRole === role && (
                      <View className="w-3 h-3 rounded-full bg-black" />
                    )}
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Notification Modal */}
      <Modal
        visible={showNotificationModal}
        animationType="slide"
        presentationStyle="fullScreen"
        onRequestClose={() => setShowNotificationModal(false)}
      >
        <View className="flex-1 bg-black">
          <View className="pt-12 pb-4 px-6">
            <View className="flex-row items-center justify-between mb-6">
              <TouchableOpacity onPress={() => setShowNotificationModal(false)}>
                <ChevronLeft size={28} color="#fff" />
              </TouchableOpacity>
              <Text className="text-white text-2xl font-bold">
                Notifications
              </Text>
              <View style={{ width: 28 }} />
            </View>

            {/* Notification Tabs */}
            <View className="flex-row items-center px-4 py-3 bg-black">
              <TouchableOpacity
                onPress={() => setNotificationTab("all")}
                className="items-center mr-6"
              >
                <View className="flex-row items-center pb-2">
                  <Image
                    source={require("../../../assets/images/bell-notification.png")}
                    style={{ width: 18, height: 18, marginRight: 6 }}
                    resizeMode="contain"
                  />
                  <Text
                    className={`font-semibold text-base ${
                      notificationTab === "all"
                        ? "text-white"
                        : "text-[#8E8E93]"
                    }`}
                  >
                    All
                  </Text>
                </View>
                {notificationTab === "all" && (
                  <View className="h-0.5 w-full bg-white absolute bottom-0" />
                )}
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setNotificationTab("messages")}
                className="items-center mr-6"
              >
                <View className="flex-row items-center pb-2">
                  <Image
                    source={require("../../../assets/images/white-message.png")}
                    style={{ width: 18, height: 18, marginRight: 6 }}
                    resizeMode="contain"
                  />
                  <Text
                    className={`font-semibold text-base ${
                      notificationTab === "messages"
                        ? "text-white"
                        : "text-[#8E8E93]"
                    }`}
                  >
                    Messages
                  </Text>
                </View>
                {notificationTab === "messages" && (
                  <View className="h-0.5 w-full bg-white absolute bottom-0" />
                )}
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setNotificationTab("donations")}
                className="items-center"
              >
                <View className="flex-row items-center pb-2">
                  <Image
                    source={require("../../../assets/images/heart-notification.png")}
                    style={{ width: 18, height: 18, marginRight: 6 }}
                    resizeMode="contain"
                  />
                  <Text
                    className={`font-semibold text-base ${
                      notificationTab === "donations"
                        ? "text-white"
                        : "text-[#8E8E93]"
                    }`}
                  >
                    Donations
                  </Text>
                </View>
                {notificationTab === "donations" && (
                  <View className="h-0.5 w-full bg-white absolute bottom-0" />
                )}
              </TouchableOpacity>
            </View>
          </View>

          {/* Notifications List */}
          <ScrollView
            className="flex-1 px-6"
            showsVerticalScrollIndicator={false}
          >
            {filteredNotifications.map((notification) => (
              <View key={notification.id} className="mb-4">
                <View className="flex-row items-center">
                  {getNotificationIcon(notification.type)}
                  <View className="flex-1 ml-3">
                    <Text
                      className={`text-base font-semibold ${
                        notification.type === "message"
                          ? "text-[#FCCD34]"
                          : "text-white"
                      }`}
                    >
                      {notification.title}
                    </Text>
                    {notification.subtitle && (
                      <Text className="text-[#8E8E93] text-sm mt-0.5">
                        {notification.subtitle}
                      </Text>
                    )}
                    {notification.time && (
                      <Text className="text-[#8E8E93] text-sm mt-0.5">
                        {notification.time}
                      </Text>
                    )}
                  </View>
                  <TouchableOpacity
                    onPress={() =>
                      setShowNotificationMenu(
                        showNotificationMenu === notification.id
                          ? null
                          : notification.id
                      )
                    }
                  >
                    <MoreVertical size={20} color="#8E8E93" />
                  </TouchableOpacity>
                </View>

                {/* Notification Menu */}
                {showNotificationMenu === notification.id && (
                  <View className="mt-2 bg-[#2C2C2E] rounded-xl overflow-hidden">
                    <TouchableOpacity className="flex-row items-center px-4 py-3 border-b border-[#3C3C3E]">
                      <Image
                        source={require("../../../assets/images/notification-off.png")}
                        style={{ width: 20, height: 20, marginRight: 10 }}
                        resizeMode="contain"
                      />
                      <Text className="text-white font-medium">
                        Turn off notifications
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity className="flex-row items-center px-4 py-3">
                      <Image
                        source={require("../../../assets/images/delete-notification.png")}
                        style={{ width: 20, height: 20, marginRight: 10 }}
                        resizeMode="contain"
                      />
                      <Text className="text-red-500 font-medium">Delete</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            ))}
          </ScrollView>
        </View>
      </Modal>

      {/* Profile Detail Modal */}
      <Modal
        visible={selectedUser !== null}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setSelectedUser(null)}
      >
        {selectedUser && (
          <View className="flex-1 bg-black">
            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Profile Image */}
              <View className="relative" style={{ height: 600 }}>
                <Image
                  source={selectedUser.image}
                  className="w-full h-full"
                  resizeMode="cover"
                />

                {/* Back Button */}
                <TouchableOpacity
                  className="absolute top-12 left-6 w-10 h-10 bg-black/50 rounded-full items-center justify-center"
                  onPress={() => {
                    setSelectedUser(null);
                    setShowProfileMenu(false);
                  }}
                >
                  <ChevronLeft size={24} color="#fff" />
                </TouchableOpacity>

                {/* Handle Bar */}
                <View className="absolute top-3 left-0 right-0 items-center">
                  <View className="w-10 h-1 bg-white/30 rounded-full" />
                </View>

                {/* More Options */}
                <TouchableOpacity
                  className="absolute top-12 right-6"
                  onPress={() => setShowProfileMenu(!showProfileMenu)}
                >
                  <MoreVertical size={24} color="#fff" />
                </TouchableOpacity>

                {/* Profile Menu Dropdown */}
                {showProfileMenu && (
                  <View
                    className="absolute rounded-xl overflow-hidden"
                    style={{
                      position: "absolute",
                      top: 56,
                      right: 16,
                      width: 160,
                      backgroundColor: "#19191B",
                      borderRadius: 12,
                      paddingVertical: 6,
                      elevation: 6,
                      shadowColor: "#000",
                      shadowOffset: { width: 0, height: 6 },
                      shadowOpacity: 0.25,
                      shadowRadius: 12,
                    }}
                  >
                    {/* Report */}
                    <TouchableOpacity
                      className="flex-row items-center px-3"
                      style={{
                        height: 44,
                      }}
                      onPress={navigateToReport}
                      activeOpacity={0.8}
                    >
                      <Image
                        source={require("../../../assets/images/flag.png")}
                        style={{ width: 16, height: 16, marginRight: 12 }}
                        resizeMode="contain"
                      />
                      <Text className="text-white font-medium">Report</Text>
                    </TouchableOpacity>

                    <View
                      style={{
                        height: 1,
                        backgroundColor: "#29292C",
                        marginHorizontal: 8,
                      }}
                    />

                    {/* Block */}
                    <TouchableOpacity
                      className="flex-row items-center px-3"
                      style={{
                        height: 44,
                      }}
                      onPress={() => {
                        setShowProfileMenu(false);
                        Alert.alert(
                          "Block user",
                          "Are you sure you want to block this user?",
                          [
                            { text: "Cancel", style: "cancel" },
                            {
                              text: "Block",
                              style: "destructive",
                              onPress: () => console.log("User blocked"),
                            },
                          ]
                        );
                      }}
                      activeOpacity={0.8}
                    >
                      <Image
                        source={require("../../../assets/images/cross.png")}
                        style={{ width: 16, height: 16, marginRight: 12 }}
                        resizeMode="contain"
                      />
                      <Text className="text-red-500 font-medium">Block</Text>
                    </TouchableOpacity>
                  </View>
                )}

                {/* Profile Info Card - Overlapping */}
                <View
                  className="absolute bottom-0 left-0 right-0 rounded-t-3xl"
                  style={{
                    backgroundColor: "rgba(25, 25, 27, 0.85)",
                    paddingTop: 24,
                    paddingHorizontal: 24,
                    paddingBottom: 24,
                  }}
                >
                  <View className="flex-row items-center justify-between mb-4">
                    <View className="flex-row items-center">
                      <Text className="text-white text-2xl font-bold mr-2">
                        {selectedUser.name}
                      </Text>
                      <Image
                        source={require("../../../assets/images/verified-badge.png")}
                        style={{ width: 20, height: 20 }}
                        resizeMode="contain"
                      />
                    </View>
                    <TouchableOpacity
                      className="w-12 h-12 bg-[#2C2C2E] rounded-full items-center justify-center"
                      onPress={() => toggleFavorite(selectedUser.id)}
                    >
                      <Star
                        size={24}
                        color={selectedUser.isFavorite ? "#FCCD34" : "#fff"}
                        fill={
                          selectedUser.isFavorite ? "#FCCD34" : "transparent"
                        }
                      />
                    </TouchableOpacity>
                  </View>

                  <View className="flex-row items-center mb-5">
                    <Text className="text-[#FCCD34] text-base font-semibold mr-2">
                      {selectedUser.role}
                    </Text>
                  </View>

                  {/* Action Buttons */}
                  <View className="mb-0">
                    <TouchableOpacity
                      className="bg-[#FCCD34] rounded-xl py-4 items-center justify-center mb-3"
                      onPress={() => {
                        setSelectedUser(null);
                        navigateToChat(selectedUser);
                      }}
                    >
                      <View className="flex-row items-center">
                        <Image
                          source={require("../../../assets/images/message.png")}
                          style={{ width: 20, height: 20 }}
                          resizeMode="contain"
                        />
                        <Text className="text-black text-base font-bold ml-2">
                          Message
                        </Text>
                      </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                      className="bg-transparent border-2 border-[#FCCD34] rounded-xl py-4 items-center justify-center"
                      onPress={() => {
                        setSelectedUser(null);
                        router.push("/(tabs)/discover/donation");
                      }}
                    >
                      <View className="flex-row items-center">
                        <Image
                          source={require("../../../assets/images/yellow-heart.png")}
                          style={{ width: 20, height: 20, marginRight: 8 }}
                          resizeMode="contain"
                        />
                        <Text className="text-[#FCCD34] text-base font-bold">
                          Donation
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>

              {/* About Section - Below the card */}
              <View className="px-6 py-4 bg-black">
                <View className="mb-6">
                  <Text className="text-white text-lg font-bold mb-2">
                    About
                  </Text>
                  <Text className="text-[#8E8E93] mb-2 leading-6">
                    {selectedUser.about}
                  </Text>
                  <TouchableOpacity>
                    <Text className="text-[#6E6E73]">
                      Bam Margera is a celebrated actor, content creator, and
                      entrepreneur known for blending boundary-pushing comedy
                      with professional creativity....
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* Gallery */}
                <View className="mb-6">
                  <View className="flex-row items-center justify-between mb-3">
                    <Text className="text-white text-lg font-bold">
                      Gallery
                    </Text>
                    <TouchableOpacity>
                      <Text className="text-[#FCCD34] font-semibold">
                        See all
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    className="flex-row"
                  >
                    {selectedUser.gallery?.length ? (
                      selectedUser.gallery.map((img, index) => (
                        <Image
                          key={index}
                          source={{ uri: img }}
                          className="w-32 h-48 rounded-2xl mr-3"
                          resizeMode="cover"
                        />
                      ))
                    ) : (
                      <Image
                        source={PLACEHOLDER_IMAGE}
                        className="w-32 h-48 rounded-2xl mr-3"
                        resizeMode="cover"
                      />
                    )}
                  </ScrollView>
                </View>
              </View>
            </ScrollView>
          </View>
        )}
      </Modal>
    </View>
  );
}
