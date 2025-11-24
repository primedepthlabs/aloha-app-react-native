import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  ScrollView,
  TextInput,
  Modal,
  Image,
  FlatList,
  Dimensions,
  Alert,
} from "react-native";
import {
  ChevronLeft,
  ChevronDown,
  ChevronUp,
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
import { supabase } from "../../../supabaseClient";
import { clearUserSession } from "@/utils/authHelpers";

const FONT = {
  Regular: "Poppins_400Regular",
  Medium: "Poppins_500Medium",
  SemiBold: "Poppins_600SemiBold",
  Bold: "Poppins_700Bold",
};

const SCREEN_WIDTH = Dimensions.get("window").width;

const PLACEHOLDER = require("../../../assets/images/profile-placeholder.png");

const AccountSettingsScreen = () => {
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  const [firstName, setFirstName] = useState("Anna");
  const [lastName, setLastName] = useState("Smith");
  const [phone, setPhone] = useState("+995 598 *** 793");
  const [gender, setGender] = useState("Woman");
  const [genderDropdownOpen, setGenderDropdownOpen] = useState(false);

  const [saveModalVisible, setSaveModalVisible] = useState(false);
  const [editProfileVisible, setEditProfileVisible] = useState(false);
  const [blockedPeopleVisible, setBlockedPeopleVisible] = useState(false);
  const [unblockModalVisible, setUnblockModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);

  const [isSaving, setIsSaving] = useState(false);
  const [loadingBlocked, setLoadingBlocked] = useState(false);
  const [blockedUsers, setBlockedUsers] = useState<any[]>([]);

  useEffect(() => {
    if (blockedPeopleVisible) {
      loadBlockedUsers();
    }
  }, [blockedPeopleVisible]);

  if (!fontsLoaded) {
    return (
      <View className="flex-1 items-center justify-center bg-black">
        <ActivityIndicator color="#FCCD34" />
      </View>
    );
  }

  const MenuItem = ({
    iconSource,
    title,
    textColor = "white",
    onPress,
  }: any) => (
    <TouchableOpacity
      onPress={onPress}
      style={{
        width: SCREEN_WIDTH - 48,
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
            alignItems: "center",
            justifyContent: "center",
            marginRight: 12,
          }}
        >
          <Image
            source={iconSource}
            style={{
              width: 24,
              height: 24,
              resizeMode: "contain",
              backgroundColor: "#19191B",
            }}
          />
        </View>
        <Text
          style={{
            fontSize: 16,
            fontFamily: FONT.Regular,
            color: textColor === "white" ? "#FFFFFF" : "#FF3B30",
          }}
        >
          {title}
        </Text>
      </View>

      <ChevronRight size={20} color="#8E8E93" strokeWidth={2} />
    </TouchableOpacity>
  );

  async function loadBlockedUsers() {
    setLoadingBlocked(true);
    try {
      const { data: userData, error: userErr } = await supabase.auth.getUser();
      const user = userData?.user;
      if (userErr || !user) {
        console.warn("Supabase getUser error:", userErr);
        setBlockedUsers([]);
        setLoadingBlocked(false);
        return;
      }

      // 1) fetch rows from blocked_users for current user
      const { data: blockedRows, error: blockedErr } = await supabase
        .from("blocked_users")
        .select("id, blocked_id, created_at")
        .eq("blocker_id", user.id);

      if (blockedErr) {
        console.error("Error fetching blocked_users:", blockedErr);
        setBlockedUsers([]);
        setLoadingBlocked(false);
        return;
      }

      if (!blockedRows || blockedRows.length === 0) {
        setBlockedUsers([]);
        setLoadingBlocked(false);
        return;
      }

      const blockedIds = blockedRows.map((r: any) => r.blocked_id);

      // 2) fetch user profiles for those blocked ids
      const { data: usersData, error: usersErr } = await supabase
        .from("users")
        .select("id, full_name, avatar_url")
        .in("id", blockedIds as any);

      if (usersErr) {
        console.error("Error fetching users for blocked ids:", usersErr);
        setBlockedUsers([]);
        setLoadingBlocked(false);
        return;
      }

      // merge blocked_rows with users data so we can keep blocked_users.id for deletion
      const merged = blockedRows.map((row: any) => {
        const u = usersData?.find((x: any) => x.id === row.blocked_id) || {};
        return {
          id: row.id, // blocked_users table primary key
          blocked_id: row.blocked_id,
          name: u.full_name || "Unknown",
          avatar_url: u.avatar_url || null,
          created_at: row.created_at,
        };
      });

      setBlockedUsers(merged);
    } catch (err) {
      console.error("Unhandled error loading blocked users:", err);
      setBlockedUsers([]);
    } finally {
      setLoadingBlocked(false);
    }
  }

  const renderBlockedUser = ({ item }: any) => {
    return (
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingVertical: 14,
          paddingHorizontal: 6,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Image
            source={item.avatar_url ? { uri: item.avatar_url } : PLACEHOLDER}
            style={{ width: 48, height: 48, borderRadius: 24, marginRight: 12 }}
          />
          <Text
            style={{ fontSize: 16, fontFamily: FONT.Medium, color: "#FFFFFF" }}
          >
            {item.name}
          </Text>
        </View>

        <TouchableOpacity
          onPress={() => {
            setSelectedUser(item);
            setUnblockModalVisible(true);
          }}
          style={{
            backgroundColor: "#FCCD34",
            paddingHorizontal: 16,
            paddingVertical: 8,
            borderRadius: 18,
            minWidth: 88,
            alignItems: "center",
            justifyContent: "center",
            elevation: 2,
          }}
        >
          <Text
            style={{ fontSize: 14, fontFamily: FONT.Regular, color: "#000000" }}
          >
            Unblock
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  const saveProfile = async () => {
    setIsSaving(true);
    try {
      await new Promise((res) => setTimeout(res, 800));
      setSaveModalVisible(false);
      setEditProfileVisible(false);
    } catch (e) {
      console.warn("save failed", e);
    } finally {
      setIsSaving(false);
    }
  };

  const handleUnblock = async () => {
    if (!selectedUser) return;
    try {
      const { data: userData } = await supabase.auth.getUser();
      const user = userData?.user;
      if (!user) {
        Alert.alert("Not signed in", "Please sign in to manage blocked users.");
        return;
      }

      // delete the blocked_users row by its pk (id)
      const { error: delErr } = await supabase
        .from("blocked_users")
        .delete()
        .eq("id", selectedUser.id)
        .eq("blocker_id", user.id);

      if (delErr) {
        console.error("Error unblocking:", delErr);
        Alert.alert("Error", "Failed to unblock user. Try again.");
        return;
      }

      // remove from local state
      setBlockedUsers((prev) => prev.filter((b) => b.id !== selectedUser.id));
      setUnblockModalVisible(false);
      setSelectedUser(null);
    } catch (err) {
      console.error("Unhandled unblock error:", err);
      Alert.alert("Error", "Something went wrong.");
    }
  };
  const handleLogout = async () => {
    try {
      Alert.alert("Log Out", "Are you sure you want to log out?", [
        { text: "Cancel", style: "cancel" },
        {
          text: "Log Out",
          style: "destructive",
          onPress: async () => {
            try {
              // 1) Supabase logout
              await supabase.auth.signOut();

              // 2) Clear local session from helper
              await clearUserSession();

              // 3) Redirect to login screen
              router.replace("/(auth)");
            } catch (err) {
              console.error("Logout error:", err);
              Alert.alert("Error", "Failed to log out. Try again.");
            }
          },
        },
      ]);
    } catch (error) {
      console.error("Alert error:", error);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-black">
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
          <ChevronLeft size={24} color="#FFFFFF" strokeWidth={2} />
        </TouchableOpacity>
        <Text
          className="text-white"
          style={{ fontSize: 18, fontFamily: FONT.SemiBold }}
        >
          Account Settings
        </Text>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingHorizontal: 24,
          paddingTop: 20,
          paddingBottom: 40,
        }}
      >
        <MenuItem
          iconSource={require("../../../assets/images/profile/one-person.png")}
          title="Edit profile"
          onPress={() => setEditProfileVisible(true)}
        />

        <MenuItem
          iconSource={require("../../../assets/images/profile/two-person.png")}
          title="Blocked people"
          onPress={() => setBlockedPeopleVisible(true)}
        />

        <MenuItem
          iconSource={require("../../../assets/images/profile/dustbin.png")}
          title="Delete account"
          textColor="red"
          onPress={() => router.push("/(tabs)/profile/delete-account")}
        />

        <MenuItem
          iconSource={require("../../../assets/images/profile/logout.png")}
          title="Log Out"
          onPress={handleLogout}
        />
      </ScrollView>

      {/* Edit Profile Modal (unchanged) */}
      <Modal
        animationType="slide"
        transparent={false}
        visible={editProfileVisible}
        onRequestClose={() => setEditProfileVisible(false)}
        presentationStyle="overFullScreen"
      >
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
            <TouchableOpacity
              onPress={() => setEditProfileVisible(false)}
              style={{
                position: "absolute",
                left: 20,
                width: 40,
                height: 40,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <ChevronLeft size={24} color="#FFFFFF" strokeWidth={2} />
            </TouchableOpacity>
            <Text
              className="text-white"
              style={{ fontSize: 18, fontFamily: FONT.SemiBold }}
            >
              Edit Profile
            </Text>
          </View>

          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{
              paddingHorizontal: 24,
              paddingTop: 20,
              paddingBottom: 40,
            }}
          >
            {/* First Name */}
            <View style={{ marginBottom: 16 }}>
              <View
                style={{
                  backgroundColor: "#1C1C1E",
                  borderRadius: 12,
                  height: 48,
                  paddingHorizontal: 20,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <TextInput
                  value={firstName}
                  onChangeText={setFirstName}
                  placeholder="First Name"
                  placeholderTextColor="#6F6F70"
                  style={{
                    flex: 1,
                    fontSize: 16,
                    fontFamily: FONT.Regular,
                    color: "#FFFFFF",
                  }}
                />
                <Image
                  source={require("../../../assets/images/profile/edit.png")}
                  style={{
                    width: 20,
                    height: 20,
                    tintColor: "#6F6F70",
                    resizeMode: "contain",
                  }}
                />
              </View>
            </View>

            {/* Last Name */}
            <View style={{ marginBottom: 16 }}>
              <View
                style={{
                  backgroundColor: "#1C1C1E",
                  borderRadius: 12,
                  height: 48,
                  paddingHorizontal: 20,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <TextInput
                  value={lastName}
                  onChangeText={setLastName}
                  placeholder="Last Name"
                  placeholderTextColor="#6F6F70"
                  style={{
                    flex: 1,
                    fontSize: 16,
                    fontFamily: FONT.Regular,
                    color: "#FFFFFF",
                  }}
                />
                <Image
                  source={require("../../../assets/images/profile/edit.png")}
                  style={{
                    width: 20,
                    height: 20,
                    tintColor: "#6F6F70",
                    resizeMode: "contain",
                  }}
                />
              </View>
            </View>

            {/* Phone */}
            <View style={{ marginBottom: 16 }}>
              <View
                style={{
                  backgroundColor: "#1C1C1E",
                  borderRadius: 12,
                  height: 48,
                  paddingHorizontal: 20,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <TextInput
                  value={phone}
                  onChangeText={setPhone}
                  placeholder="Phone"
                  placeholderTextColor="#6F6F70"
                  style={{
                    flex: 1,
                    fontSize: 16,
                    fontFamily: FONT.Regular,
                    color: "#FFFFFF",
                  }}
                />
                <Image
                  source={require("../../../assets/images/profile/edit.png")}
                  style={{
                    width: 20,
                    height: 20,
                    tintColor: "#6F6F70",
                    resizeMode: "contain",
                  }}
                />
              </View>
            </View>

            {/* Gender Dropdown */}
            <View style={{ marginBottom: 24 }}>
              <TouchableOpacity
                onPress={() => setGenderDropdownOpen(!genderDropdownOpen)}
                style={{
                  backgroundColor: genderDropdownOpen
                    ? "transparent"
                    : "#1C1C1E",
                  borderRadius: 12,
                  height: 48,
                  paddingHorizontal: 20,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  borderWidth: genderDropdownOpen ? 1 : 0,
                  borderColor: "#FCCD34",
                }}
              >
                <Text
                  style={{
                    fontSize: 16,
                    fontFamily: FONT.Regular,
                    color: "#FFFFFF",
                  }}
                >
                  {gender}
                </Text>
                {genderDropdownOpen ? (
                  <ChevronUp size={20} color="#FFFFFF" />
                ) : (
                  <ChevronDown size={20} color="#FFFFFF" />
                )}
              </TouchableOpacity>

              {genderDropdownOpen && (
                <View
                  style={{
                    backgroundColor: "#1C1C1E",
                    borderRadius: 12,
                    marginTop: 8,
                    overflow: "hidden",
                  }}
                >
                  {["Man", "Other"].map((option, index) => (
                    <TouchableOpacity
                      key={option}
                      onPress={() => {
                        setGender(option);
                        setGenderDropdownOpen(false);
                      }}
                      style={{
                        paddingHorizontal: 20,
                        paddingVertical: 16,
                        borderBottomWidth: index === 0 ? 1 : 0,
                        borderBottomColor: "#2C2C2E",
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 16,
                          fontFamily: FONT.Regular,
                          color: "#FFFFFF",
                        }}
                      >
                        {option}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            {/* Save Button */}
            <TouchableOpacity
              onPress={() => setSaveModalVisible(true)}
              disabled={isSaving}
              style={{
                backgroundColor: isSaving ? "#d9c85a" : "#FCCD34",
                borderRadius: 28,
                height: 48,
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 24,
                width: SCREEN_WIDTH - 48,
                alignSelf: "center",
                opacity: isSaving ? 0.9 : 1,
              }}
            >
              {isSaving ? (
                <ActivityIndicator />
              ) : (
                <Text
                  style={{
                    fontSize: 18,
                    fontFamily: FONT.SemiBold,
                    color: "#FFFFFF",
                  }}
                >
                  Save
                </Text>
              )}
            </TouchableOpacity>

            {/* Bottom-fixed Contact Support */}
            <View
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                bottom: 20,
                alignItems: "center",
                paddingHorizontal: 24,
              }}
            >
              <View style={{ alignItems: "center", marginBottom: 0 }}>
                <Text
                  style={{
                    fontSize: 14,
                    fontFamily: FONT.Regular,
                    color: "#FFFFFF",
                  }}
                >
                  Need Help?{" "}
                  <Text style={{ color: "#FCCD34" }}>Contact Support</Text>
                </Text>
              </View>
            </View>
          </ScrollView>

          <Modal
            animationType="fade"
            transparent={true}
            visible={saveModalVisible}
            onRequestClose={() => {
              if (!isSaving) setSaveModalVisible(false);
            }}
          >
            <View
              style={{
                flex: 1,
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                justifyContent: "center",
                alignItems: "center",
                paddingHorizontal: 40,
              }}
            >
              <View
                style={{
                  backgroundColor: "#2C2C2E",
                  borderRadius: 20,
                  padding: 24,
                  width: "100%",
                  maxWidth: 320,
                }}
              >
                <Text
                  className="text-white text-center"
                  style={{
                    fontSize: 16,
                    fontFamily: FONT.Regular,
                    marginBottom: 24,
                    lineHeight: 24,
                  }}
                >
                  Are you sure you want to save changes?
                </Text>

                <TouchableOpacity
                  onPress={async () => {
                    if (isSaving) return;
                    await saveProfile();
                  }}
                  style={{
                    paddingVertical: 12,
                    borderBottomWidth: 1,
                    borderBottomColor: "#3C3C3E",
                    alignItems: "center",
                  }}
                >
                  <Text
                    className="text-center"
                    style={{
                      fontSize: 16,
                      fontFamily: FONT.Regular,
                      color: "#FCCD34",
                    }}
                  >
                    {isSaving ? "Saving..." : "Save"}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => {
                    if (!isSaving) setSaveModalVisible(false);
                  }}
                  style={{ paddingVertical: 12, alignItems: "center" }}
                >
                  <Text
                    className="text-white text-center"
                    style={{ fontSize: 16, fontFamily: FONT.Regular }}
                  >
                    Cancel
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </SafeAreaView>
      </Modal>

      {/* Blocked People Modal */}
      <Modal
        animationType="slide"
        transparent={false}
        visible={blockedPeopleVisible}
        onRequestClose={() => setBlockedPeopleVisible(false)}
        presentationStyle="overFullScreen"
      >
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
            <TouchableOpacity
              onPress={() => setBlockedPeopleVisible(false)}
              style={{
                position: "absolute",
                left: 20,
                width: 40,
                height: 40,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <ChevronLeft size={24} color="#FFFFFF" strokeWidth={2} />
            </TouchableOpacity>
            <Text
              className="text-white"
              style={{ fontSize: 18, fontFamily: FONT.SemiBold }}
            >
              Blocked People
            </Text>
          </View>

          <View style={{ paddingHorizontal: 24, paddingTop: 8, flex: 1 }}>
            {loadingBlocked ? (
              <View style={{ paddingTop: 24, alignItems: "center" }}>
                <ActivityIndicator color="#FCCD34" />
              </View>
            ) : (
              <FlatList
                data={blockedUsers}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderBlockedUser}
                ItemSeparatorComponent={() => (
                  <View style={{ height: 1, backgroundColor: "transparent" }} />
                )}
                ListEmptyComponent={() => (
                  <View style={{ padding: 24, alignItems: "center" }}>
                    <Text
                      style={{ color: "#8E8E93", fontFamily: FONT.Regular }}
                    >
                      You haven't blocked anyone.
                    </Text>
                  </View>
                )}
              />
            )}
          </View>

          {/* Unblock Confirmation Modal */}
          <Modal
            animationType="fade"
            transparent={true}
            visible={unblockModalVisible}
            onRequestClose={() => setUnblockModalVisible(false)}
          >
            <View
              style={{
                flex: 1,
                backgroundColor: "rgba(0, 0, 0, 0.7)",
                justifyContent: "center",
                alignItems: "center",
                paddingHorizontal: 40,
              }}
            >
              <View
                style={{
                  backgroundColor: "#2C2C2E",
                  borderRadius: 20,
                  padding: 24,
                  width: "100%",
                  maxWidth: 320,
                }}
              >
                <Text
                  className="text-white text-center"
                  style={{
                    fontSize: 16,
                    fontFamily: FONT.Regular,
                    marginBottom: 24,
                    lineHeight: 24,
                  }}
                >
                  Are you sure you want to{"\n"}Unblock{" "}
                  <Text style={{ color: "#FCCD34" }}>{selectedUser?.name}</Text>
                  ?
                </Text>

                <TouchableOpacity
                  onPress={handleUnblock}
                  style={{
                    paddingVertical: 12,
                    borderBottomWidth: 1,
                    borderBottomColor: "#3C3C3E",
                    alignItems: "center",
                  }}
                >
                  <Text
                    className="text-center"
                    style={{
                      fontSize: 16,
                      fontFamily: FONT.Regular,
                      color: "#FCCD34",
                    }}
                  >
                    Unblock
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => setUnblockModalVisible(false)}
                  style={{ paddingVertical: 12, alignItems: "center" }}
                >
                  <Text
                    className="text-white text-center"
                    style={{ fontSize: 16, fontFamily: FONT.Regular }}
                  >
                    Cancel
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
};

export default AccountSettingsScreen;
