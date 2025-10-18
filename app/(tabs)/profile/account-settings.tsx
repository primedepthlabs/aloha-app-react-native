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
} from "react-native";
import { styled } from "nativewind";
import { ChevronLeft, ChevronDown, ChevronUp } from "lucide-react-native";
import { Svg, Path } from "react-native-svg";
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
  const [selectedPerson, setSelectedPerson] = useState("");

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

  const MenuItem = ({ icon, title, textColor = "white", onPress }: any) => (
    <StyledTouchableOpacity
      onPress={onPress}
      style={{
        width: 330,
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
          {icon}
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
      <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <Path
          d="M9 18L15 12L9 6"
          stroke="#8E8E93"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Svg>
    </StyledTouchableOpacity>
  );

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
          icon={
            <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <Path
                d="M20 21C20 19.6044 20 18.9067 19.8278 18.3389C19.44 17.0605 18.4395 16.06 17.1611 15.6722C16.5933 15.5 15.8956 15.5 14.5 15.5H9.5C8.10444 15.5 7.40665 15.5 6.83886 15.6722C5.56045 16.06 4.56004 17.0605 4.17224 18.3389C4 18.9067 4 19.6044 4 21M16.5 7.5C16.5 9.98528 14.4853 12 12 12C9.51472 12 7.5 9.98528 7.5 7.5C7.5 5.01472 9.51472 3 12 3C14.4853 3 16.5 5.01472 16.5 7.5Z"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
          }
          title="Edit profile"
          onPress={() => setEditProfileVisible(true)}
        />

        <MenuItem
          icon={
            <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <Path
                d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13M16 3.13C16.8604 3.3503 17.623 3.8507 18.1676 4.55231C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89317 18.7122 8.75608 18.1676 9.45769C17.623 10.1593 16.8604 10.6597 16 10.88M13 7C13 9.20914 11.2091 11 9 11C6.79086 11 5 9.20914 5 7C5 4.79086 6.79086 3 9 3C11.2091 3 13 4.79086 13 7Z"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
          }
          title="Blocked people"
          onPress={() => setBlockedPeopleVisible(true)}
        />

        <MenuItem
          icon={
            <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <Path
                d="M3 6H21M5 6V20C5 20.5304 5.21071 21.0391 5.58579 21.4142C5.96086 21.7893 6.46957 22 7 22H17C17.5304 22 18.0391 21.7893 18.4142 21.4142C18.7893 21.0391 19 20.5304 19 20V6M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6"
                stroke="#FF3B30"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
          }
          title="Delete account"
          textColor="red"
          onPress={() => {}}
        />

        <MenuItem
          icon={
            <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <Path
                d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <Path
                d="M16 17L21 12L16 7"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <Path
                d="M21 12H9"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
          }
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
            }}
          >
            {/* First Name */}
            <StyledView style={{ marginBottom: 16 }}>
              <StyledView
                style={{
                  backgroundColor: "#1C1C1E",
                  borderRadius: 12,
                  height: 56,
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
                <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <Path
                    d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13"
                    stroke="#6F6F70"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <Path
                    d="M18.5 2.50001C18.8978 2.10219 19.4374 1.87869 20 1.87869C20.5626 1.87869 21.1022 2.10219 21.5 2.50001C21.8978 2.89784 22.1213 3.4374 22.1213 4.00001C22.1213 4.56262 21.8978 5.10219 21.5 5.50001L12 15L8 16L9 12L18.5 2.50001Z"
                    stroke="#6F6F70"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </Svg>
              </StyledView>
            </StyledView>

            {/* Last Name */}
            <StyledView style={{ marginBottom: 16 }}>
              <StyledView
                style={{
                  backgroundColor: "#1C1C1E",
                  borderRadius: 12,
                  height: 56,
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
                <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <Path
                    d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13"
                    stroke="#6F6F70"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <Path
                    d="M18.5 2.50001C18.8978 2.10219 19.4374 1.87869 20 1.87869C20.5626 1.87869 21.1022 2.10219 21.5 2.50001C21.8978 2.89784 22.1213 3.4374 22.1213 4.00001C22.1213 4.56262 21.8978 5.10219 21.5 5.50001L12 15L8 16L9 12L18.5 2.50001Z"
                    stroke="#6F6F70"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </Svg>
              </StyledView>
            </StyledView>

            {/* Phone */}
            <StyledView style={{ marginBottom: 16 }}>
              <StyledView
                style={{
                  backgroundColor: "#1C1C1E",
                  borderRadius: 12,
                  height: 56,
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
                <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <Path
                    d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13"
                    stroke="#6F6F70"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <Path
                    d="M18.5 2.50001C18.8978 2.10219 19.4374 1.87869 20 1.87869C20.5626 1.87869 21.1022 2.10219 21.5 2.50001C21.8978 2.89784 22.1213 3.4374 22.1213 4.00001C22.1213 4.56262 21.8978 5.10219 21.5 5.50001L12 15L8 16L9 12L18.5 2.50001Z"
                    stroke="#6F6F70"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </Svg>
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
                  height: 56,
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

            {/* Save Button */}
            <StyledTouchableOpacity
              onPress={() => setSaveModalVisible(true)}
              style={{
                backgroundColor: "#FCCD34",
                borderRadius: 12,
                height: 56,
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 24,
              }}
            >
              <StyledText
                className="text-black"
                style={{
                  fontSize: 18,
                  fontFamily: FONT.SemiBold,
                }}
              >
                Save
              </StyledText>
            </StyledTouchableOpacity>

            {/* Contact Support Link */}
            <StyledView
              style={{
                alignItems: "center",
                marginBottom: 40,
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
          </StyledScrollView>
        </StyledSafeAreaView>
      </Modal>

      {/* Save Confirmation Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={saveModalVisible}
        onRequestClose={() => setSaveModalVisible(false)}
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
              onPress={() => {
                setSaveModalVisible(false);
                setEditProfileVisible(false);
              }}
              style={{
                paddingVertical: 12,
                borderBottomWidth: 1,
                borderBottomColor: "#3C3C3E",
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
