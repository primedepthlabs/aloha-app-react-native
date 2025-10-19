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
import { styled } from "nativewind";
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

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity);
const StyledSafeAreaView = styled(SafeAreaView);
const StyledScrollView = styled(ScrollView);
const StyledTextInput = styled(TextInput);

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

  // modal states
  const [saveModalVisible, setSaveModalVisible] = useState(false);
  const [editProfileVisible, setEditProfileVisible] = useState(false);
  const [blockedPeopleVisible, setBlockedPeopleVisible] = useState(false);
  const [unblockModalVisible, setUnblockModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);

  // saving lock to prevent double clicks
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
    <StyledTouchableOpacity
      onPress={onPress}
      style={{
        // use responsive width rather than fixed 330
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
      <StyledView
        style={{ flexDirection: "row", alignItems: "center", flex: 1 }}
      >
        <StyledView
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
        </StyledView>
        <StyledText
          style={{
            fontSize: 16,
            fontFamily: FONT.Regular,
            color: textColor === "white" ? "#FFFFFF" : "#FF3B30",
          }}
        >
          {title}
        </StyledText>
      </StyledView>

      <ChevronRight size={20} color="#8E8E93" strokeWidth={2} />
    </StyledTouchableOpacity>
  );

  const renderBlockedUser = ({ item }: any) => {
    return (
      <StyledView
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingVertical: 14,
          paddingHorizontal: 6,
        }}
      >
        <StyledView style={{ flexDirection: "row", alignItems: "center" }}>
          <Image
            source={item.image}
            style={{
              width: 48,
              height: 48,
              borderRadius: 24,
              marginRight: 12,
            }}
          />
          <StyledText
            style={{
              fontSize: 16,
              fontFamily: FONT.Medium,
              color: "#FFFFFF",
            }}
          >
            {item.name}
          </StyledText>
        </StyledView>

        <StyledTouchableOpacity
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
          <StyledText
            style={{
              fontSize: 14,
              fontFamily: FONT.Regular,
              color: "#000000",
            }}
          >
            Unblock
          </StyledText>
        </StyledTouchableOpacity>
      </StyledView>
    );
  };

  // simulated save function — replace with your API call
  const saveProfile = async () => {
    setIsSaving(true);
    try {
      // simulate network
      await new Promise((res) => setTimeout(res, 800));
      // TODO: call your API here with ({ firstName, lastName, phone, gender })
      // on success:
      setSaveModalVisible(false);
      setEditProfileVisible(false);
    } catch (e) {
      // handle error (show toast/snackbar)
      console.warn("save failed", e);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <StyledSafeAreaView className="flex-1 bg-black">
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <StyledView
        style={{
          height: 60,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          paddingHorizontal: 20,
          position: "relative",
        }}
      >
        <StyledTouchableOpacity
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
        </StyledTouchableOpacity>
        <StyledText
          className="text-white"
          style={{
            fontSize: 18,
            fontFamily: FONT.SemiBold,
          }}
        >
          Account Settings
        </StyledText>
      </StyledView>

      <StyledScrollView
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
      </StyledScrollView>

      {/* Edit Profile Modal */}
      <Modal
        animationType="slide"
        transparent={false}
        visible={editProfileVisible}
        onRequestClose={() => setEditProfileVisible(false)}
        presentationStyle="overFullScreen"
      >
        <StyledSafeAreaView className="flex-1 bg-black">
          <StatusBar barStyle="light-content" />

          <StyledView
            style={{
              height: 60,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              paddingHorizontal: 20,
              position: "relative",
            }}
          >
            <StyledTouchableOpacity
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
            </StyledTouchableOpacity>
            <StyledText
              className="text-white"
              style={{
                fontSize: 18,
                fontFamily: FONT.SemiBold,
              }}
            >
              Edit Profile
            </StyledText>
          </StyledView>

          <StyledScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{
              paddingHorizontal: 24,
              paddingTop: 20,
              paddingBottom: 40,
            }}
          >
            {/* First Name */}
            <StyledView style={{ marginBottom: 16 }}>
              <StyledView
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
                <StyledTextInput
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
              </StyledView>
            </StyledView>

            {/* Last Name */}
            <StyledView style={{ marginBottom: 16 }}>
              <StyledView
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
                <StyledTextInput
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
              </StyledView>
            </StyledView>

            {/* Phone */}
            <StyledView style={{ marginBottom: 16 }}>
              <StyledView
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
                <StyledTextInput
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
              </StyledView>
            </StyledView>

            {/* Gender Dropdown */}
            <StyledView style={{ marginBottom: 24 }}>
              <StyledTouchableOpacity
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
                <StyledText
                  style={{
                    fontSize: 16,
                    fontFamily: FONT.Regular,
                    color: "#FFFFFF",
                  }}
                >
                  {gender}
                </StyledText>
                {genderDropdownOpen ? (
                  <ChevronUp size={20} color="#FFFFFF" />
                ) : (
                  <ChevronDown size={20} color="#FFFFFF" />
                )}
              </StyledTouchableOpacity>

              {genderDropdownOpen && (
                <StyledView
                  style={{
                    backgroundColor: "#1C1C1E",
                    borderRadius: 12,
                    marginTop: 8,
                    overflow: "hidden",
                  }}
                >
                  {["Man", "Other"].map((option, index) => (
                    <StyledTouchableOpacity
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
                      <StyledText
                        style={{
                          fontSize: 16,
                          fontFamily: FONT.Regular,
                          color: "#FFFFFF",
                        }}
                      >
                        {option}
                      </StyledText>
                    </StyledTouchableOpacity>
                  ))}
                </StyledView>
              )}
            </StyledView>

            {/* Save Button (disabled while saving) */}
            <StyledTouchableOpacity
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
                <StyledText
                  style={{
                    fontSize: 18,
                    fontFamily: FONT.SemiBold,
                    color: "#FFFFFF",
                  }}
                >
                  Save
                </StyledText>
              )}
            </StyledTouchableOpacity>
            {/* Bottom-fixed Contact Support */}
            <StyledView
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                bottom: 20,
                alignItems: "center",
                paddingHorizontal: 24,
              }}
            >
              <StyledView
                style={{
                  alignItems: "center",
                  marginBottom: 0,
                }}
              >
                <StyledText
                  style={{
                    fontSize: 14,
                    fontFamily: FONT.Regular,
                    color: "#FFFFFF",
                  }}
                >
                  Need Help?{" "}
                  <StyledText style={{ color: "#FCCD34" }}>
                    Contact Support
                  </StyledText>
                </StyledText>
              </StyledView>
            </StyledView>
          </StyledScrollView>

          <Modal
            animationType="fade"
            transparent={true}
            visible={saveModalVisible}
            onRequestClose={() => {
              if (!isSaving) setSaveModalVisible(false);
            }}
          >
            <StyledView
              style={{
                flex: 1,
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                justifyContent: "center",
                alignItems: "center",
                paddingHorizontal: 40,
              }}
            >
              <StyledView
                style={{
                  backgroundColor: "#2C2C2E",
                  borderRadius: 20,
                  padding: 24,
                  width: "100%",
                  maxWidth: 320,
                }}
              >
                <StyledText
                  className="text-white text-center"
                  style={{
                    fontSize: 16,
                    fontFamily: FONT.Regular,
                    marginBottom: 24,
                    lineHeight: 24,
                  }}
                >
                  Are you sure you want to save changes?
                </StyledText>

                <StyledTouchableOpacity
                  onPress={async () => {
                    if (isSaving) return; // guard
                    await saveProfile();
                  }}
                  style={{
                    paddingVertical: 12,
                    borderBottomWidth: 1,
                    borderBottomColor: "#3C3C3E",
                    alignItems: "center",
                  }}
                >
                  <StyledText
                    className="text-center"
                    style={{
                      fontSize: 16,
                      fontFamily: FONT.Regular,
                      color: "#FCCD34",
                    }}
                  >
                    {isSaving ? "Saving..." : "Save"}
                  </StyledText>
                </StyledTouchableOpacity>

                <StyledTouchableOpacity
                  onPress={() => {
                    if (!isSaving) setSaveModalVisible(false);
                  }}
                  style={{
                    paddingVertical: 12,
                    alignItems: "center",
                  }}
                >
                  <StyledText
                    className="text-white text-center"
                    style={{
                      fontSize: 16,
                      fontFamily: FONT.Regular,
                    }}
                  >
                    Cancel
                  </StyledText>
                </StyledTouchableOpacity>
              </StyledView>
            </StyledView>
          </Modal>
          {/* -------------------------
              End nested Save Confirmation Modal
              ------------------------- */}
        </StyledSafeAreaView>
      </Modal>

      {/* Blocked People Modal (updated — includes nested Unblock Confirmation Modal) */}
      <Modal
        animationType="slide"
        transparent={false}
        visible={blockedPeopleVisible}
        onRequestClose={() => setBlockedPeopleVisible(false)}
        presentationStyle="overFullScreen"
      >
        <StyledSafeAreaView className="flex-1 bg-black">
          <StatusBar barStyle="light-content" />
          <StyledView
            style={{
              height: 60,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              paddingHorizontal: 20,
              position: "relative",
            }}
          >
            <StyledTouchableOpacity
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
            </StyledTouchableOpacity>
            <StyledText
              className="text-white"
              style={{
                fontSize: 18,
                fontFamily: FONT.SemiBold,
              }}
            >
              Blocked People
            </StyledText>
          </StyledView>

          <StyledView
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
                <StyledView
                  style={{
                    height: 1,
                    backgroundColor: "transparent",
                  }}
                />
              )}
            />
          </StyledView>

          {/* -------------------------
        Nested Unblock Confirmation Modal
        (now guaranteed to display above the blocked-people screen)
        ------------------------- */}
          <Modal
            animationType="fade"
            transparent={true}
            visible={unblockModalVisible}
            onRequestClose={() => setUnblockModalVisible(false)}
          >
            <StyledView
              style={{
                flex: 1,
                backgroundColor: "rgba(0, 0, 0, 0.7)",
                justifyContent: "center",
                alignItems: "center",
                paddingHorizontal: 40,
              }}
            >
              <StyledView
                style={{
                  backgroundColor: "#2C2C2E",
                  borderRadius: 20,
                  padding: 24,
                  width: "100%",
                  maxWidth: 320,
                }}
              >
                <StyledText
                  className="text-white text-center"
                  style={{
                    fontSize: 16,
                    fontFamily: FONT.Regular,
                    marginBottom: 24,
                    lineHeight: 24,
                  }}
                >
                  Are you sure you want to{"\n"}Unblock{" "}
                  <StyledText style={{ color: "#FCCD34" }}>
                    {selectedUser?.name}
                  </StyledText>
                  ?
                </StyledText>

                <StyledTouchableOpacity
                  onPress={() => {
                    // Implement unblock logic here:
                    // - remove user from blockedUsers source (call API / update state)
                    // - optionally show a toast
                    // then close modal(s)
                    // example (if blockedUsers were in state): setBlockedUsers(prev => prev.filter(u => u.id !== selectedUser.id));
                    setUnblockModalVisible(false);
                  }}
                  style={{
                    paddingVertical: 12,
                    borderBottomWidth: 1,
                    borderBottomColor: "#3C3C3E",
                    alignItems: "center",
                  }}
                >
                  <StyledText
                    className="text-center"
                    style={{
                      fontSize: 16,
                      fontFamily: FONT.Regular,
                      color: "#FCCD34",
                    }}
                  >
                    Unblock
                  </StyledText>
                </StyledTouchableOpacity>

                <StyledTouchableOpacity
                  onPress={() => setUnblockModalVisible(false)}
                  style={{
                    paddingVertical: 12,
                    alignItems: "center",
                  }}
                >
                  <StyledText
                    className="text-white text-center"
                    style={{
                      fontSize: 16,
                      fontFamily: FONT.Regular,
                    }}
                  >
                    Cancel
                  </StyledText>
                </StyledTouchableOpacity>
              </StyledView>
            </StyledView>
          </Modal>
          {/* -------------------------
        End nested Unblock Confirmation Modal
        ------------------------- */}
        </StyledSafeAreaView>
      </Modal>

      {/* Unblock Confirmation Modal */}
      <Modal
        animationType="none"
        transparent={true}
        visible={unblockModalVisible}
        onRequestClose={() => setUnblockModalVisible(false)}
      >
        <StyledView
          style={{
            flex: 1,
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            justifyContent: "center",
            alignItems: "center",
            paddingHorizontal: 40,
          }}
        >
          <StyledView
            style={{
              backgroundColor: "#2C2C2E",
              borderRadius: 20,
              padding: 24,
              width: "100%",
              maxWidth: 320,
            }}
          >
            <StyledText
              className="text-white text-center"
              style={{
                fontSize: 16,
                fontFamily: FONT.Regular,
                marginBottom: 24,
                lineHeight: 24,
              }}
            >
              Are you sure you want to{"\n"}Unblock{" "}
              <StyledText style={{ color: "#FCCD34" }}>
                {selectedUser?.name}
              </StyledText>
              ?
            </StyledText>

            <StyledTouchableOpacity
              onPress={() => {
                // Implement unblock logic here
                setUnblockModalVisible(false);
              }}
              style={{
                paddingVertical: 12,
                borderBottomWidth: 1,
                borderBottomColor: "#3C3C3E",
                alignItems: "center",
              }}
            >
              <StyledText
                className="text-center"
                style={{
                  fontSize: 16,
                  fontFamily: FONT.Regular,
                  color: "#FCCD34",
                }}
              >
                Unblock
              </StyledText>
            </StyledTouchableOpacity>

            <StyledTouchableOpacity
              onPress={() => setUnblockModalVisible(false)}
              style={{
                paddingVertical: 12,
                alignItems: "center",
              }}
            >
              <StyledText
                className="text-white text-center"
                style={{
                  fontSize: 16,
                  fontFamily: FONT.Regular,
                }}
              >
                Cancel
              </StyledText>
            </StyledTouchableOpacity>
          </StyledView>
        </StyledView>
      </Modal>
    </StyledSafeAreaView>
  );
};

export default AccountSettingsScreen;
