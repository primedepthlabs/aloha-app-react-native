import React, { useState } from "react";
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

const FONT = {
  Regular: "Poppins_400Regular",
  Medium: "Poppins_500Medium",
  SemiBold: "Poppins_600SemiBold",
  Bold: "Poppins_700Bold",
};

const SCREEN_WIDTH = Dimensions.get("window").width;

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

  const blockedUsers = [
    {
      id: 1,
      name: "Sophia Bennett",
      image: require("../../../assets/images/profile-placeholder.png"),
    },
    {
      id: 2,
      name: "Ethan Carter",
      image: require("../../../assets/images/profile-placeholder.png"),
    },
    {
      id: 3,
      name: "Olivia Davis",
      image: require("../../../assets/images/profile-placeholder.png"),
    },
  ];

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
      <View
        style={{ flexDirection: "row", alignItems: "center", flex: 1 }}
      >
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
            source={item.image}
            style={{
              width: 48,
              height: 48,
              borderRadius: 24,
              marginRight: 12,
            }}
          />
          <Text
            style={{
              fontSize: 16,
              fontFamily: FONT.Medium,
              color: "#FFFFFF",
            }}
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
            style={{
              fontSize: 14,
              fontFamily: FONT.Regular,
              color: "#000000",
            }}
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
          style={{
            fontSize: 18,
            fontFamily: FONT.SemiBold,
          }}
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
          onPress={() => {}}
        />
      </ScrollView>

      {/* Edit Profile Modal */}
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
              style={{
                fontSize: 18,
                fontFamily: FONT.SemiBold,
              }}
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
              <View
                style={{
                  alignItems: "center",
                  marginBottom: 0,
                }}
              >
                <Text
                  style={{
                    fontSize: 14,
                    fontFamily: FONT.Regular,
                    color: "#FFFFFF",
                  }}
                >
                  Need Help?{" "}
                  <Text style={{ color: "#FCCD34" }}>
                    Contact Support
                  </Text>
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
                  style={{
                    paddingVertical: 12,
                    alignItems: "center",
                  }}
                >
                  <Text
                    className="text-white text-center"
                    style={{
                      fontSize: 16,
                      fontFamily: FONT.Regular,
                    }}
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
              style={{
                fontSize: 18,
                fontFamily: FONT.SemiBold,
              }}
            >
              Blocked People
            </Text>
          </View>

          <View
            style={{
              paddingHorizontal: 24,
              paddingTop: 8,
              flex: 1,
            }}
          >
            <FlatList
              data={blockedUsers}
              keyExtractor={(item) => item.id.toString()}
              renderItem={renderBlockedUser}
              ItemSeparatorComponent={() => (
                <View
                  style={{
                    height: 1,
                    backgroundColor: "transparent",
                  }}
                />
              )}
            />
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
                  <Text style={{ color: "#FCCD34" }}>
                    {selectedUser?.name}
                  </Text>
                  ?
                </Text>

                <TouchableOpacity
                  onPress={() => {
                    setUnblockModalVisible(false);
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
                    Unblock
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => setUnblockModalVisible(false)}
                  style={{
                    paddingVertical: 12,
                    alignItems: "center",
                  }}
                >
                  <Text
                    className="text-white text-center"
                    style={{
                      fontSize: 16,
                      fontFamily: FONT.Regular,
                    }}
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