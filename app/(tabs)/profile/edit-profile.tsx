import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Modal,
  Alert,
} from "react-native";
import { ChevronLeft, ChevronDown, MoreVertical, X } from "lucide-react-native";
import { useRouter } from "expo-router";

const ROLES = ["Actor", "Doctor", "Youtuber", "Influencer"];

interface GalleryImage {
  id: string;
  uri: string;
}

export default function ProfileEditScreen() {
  const router = useRouter();
  const [firstName, setFirstName] = useState("Bam");
  const [lastName, setLastName] = useState("Margera");
  const [selectedRole, setSelectedRole] = useState("Actor");
  const [about, setAbout] = useState(
    "Bam Margera is a celebrated actor, content creator, and entrepreneur known for blending boundary-pushing comedy with professional creativity..."
  );
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [activeTab, setActiveTab] = useState<"profile" | "gallery">("profile");
  const [showPhotoMenu, setShowPhotoMenu] = useState(false);
  const [showSaveConfirmation, setShowSaveConfirmation] = useState(false);
  const [profileImage, setProfileImage] = useState(
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400"
  );
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([
    {
      id: "1",
      uri: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400",
    },
    {
      id: "2",
      uri: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
    },
    {
      id: "3",
      uri: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400",
    },
  ]);
  const [selectedGalleryImage, setSelectedGalleryImage] = useState<
    string | null
  >(null);

  const handleSave = () => {
    setShowSaveConfirmation(true);
  };

  const confirmSave = () => {
    setShowSaveConfirmation(false);
    Alert.alert("Success", "Profile updated successfully");
  };

  const handleChooseFromLibrary = () => {
    setShowPhotoMenu(false);
    Alert.alert("Info", "Choose from library functionality");
  };

  const handleRemovePhoto = () => {
    setShowPhotoMenu(false);
    setProfileImage("");
  };

  const handleAddGalleryImage = () => {
    Alert.alert("Info", "Add gallery image functionality");
  };

  const handleDeleteGalleryImage = (id: string) => {
    setGalleryImages((prev) => prev.filter((img) => img.id !== id));
    setSelectedGalleryImage(null);
  };

  return (
    <View className="flex-1 bg-black">
      {/* Header */}
      <View className="pt-12 pb-4 px-6">
        <View className="flex-row items-center justify-between">
          <TouchableOpacity onPress={() => router.back()}>
            <ChevronLeft size={28} color="#fff" />
          </TouchableOpacity>
          <Text className="text-white font-bold text-[18px]">Edit Profile</Text>
          <View style={{ width: 28 }} />
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* Profile Image Section */}
        <View className="items-center mb-6 relative">
          <View className="relative">
            {profileImage ? (
              <Image
                source={{ uri: profileImage }}
                style={{ width: 120, height: 120, borderRadius: 60 }}
                resizeMode="cover"
              />
            ) : (
              <View
                style={{
                  width: 120,
                  height: 120,
                  borderRadius: 60,
                  backgroundColor: "#2C2C2E",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <View
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 24,
                    backgroundColor: "#fff",
                  }}
                />
                <View
                  style={{
                    width: 80,
                    height: 40,
                    borderRadius: 40,
                    backgroundColor: "#8E8E93",
                    marginTop: 8,
                  }}
                />
              </View>
            )}

            {/* Three Dots Menu */}
            <TouchableOpacity
              className="absolute -top-2 -right-2"
              onPress={() => setShowPhotoMenu(true)}
              style={{
                width: 32,
                height: 32,
                borderRadius: 16,
                backgroundColor: "#2C2C2E",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <MoreVertical size={18} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Photo Menu Modal */}
        <Modal
          visible={showPhotoMenu}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setShowPhotoMenu(false)}
        >
          <TouchableOpacity
            className="flex-1 justify-center items-center"
            style={{ backgroundColor: "rgba(0,0,0,0.7)" }}
            activeOpacity={1}
            onPress={() => setShowPhotoMenu(false)}
          >
            <View
              className="bg-[#1C1C1E] rounded-2xl overflow-hidden"
              style={{ width: 280 }}
            >
              <TouchableOpacity
                className="flex-row items-center px-4 py-4 border-b border-[#2C2C2E]"
                onPress={handleChooseFromLibrary}
              >
                <Image
                  source={require("../../../assets/images/gallery-icon.png")}
                  style={{ width: 20, height: 20, marginRight: 12 }}
                  resizeMode="contain"
                />
                <Text className="text-white text-base font-medium">
                  Choose from library
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="flex-row items-center px-4 py-4"
                onPress={handleRemovePhoto}
              >
                <Image
                  source={require("../../../assets/images/cross-icon.png")}
                  style={{ width: 20, height: 20, marginRight: 12 }}
                  resizeMode="contain"
                />
                <Text className="text-red-500 text-base font-medium">
                  Remove current photo
                </Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </Modal>

        {/* Tabs */}
        <View className="flex-row mb-6 px-6">
          <TouchableOpacity
            onPress={() => setActiveTab("profile")}
            className={`flex-1 items-center justify-center py-3 rounded-xl mr-2 ${
              activeTab === "profile" ? "bg-[#FCCD34]" : "bg-[#2C2C2E]"
            }`}
          >
            <Text
              className={`text-base font-semibold ${
                activeTab === "profile" ? "text-black" : "text-[#8E8E93]"
              }`}
            >
              Profile
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setActiveTab("gallery")}
            className={`flex-1 items-center justify-center py-3 rounded-xl ml-2 ${
              activeTab === "gallery" ? "bg-[#FCCD34]" : "bg-[#2C2C2E]"
            }`}
          >
            <Text
              className={`text-base font-semibold ${
                activeTab === "gallery" ? "text-black" : "text-[#8E8E93]"
              }`}
            >
              Gallery
            </Text>
          </TouchableOpacity>
        </View>

        {/* Profile Tab Content */}
        {activeTab === "profile" && (
          <View className="px-6">
            {/* First Name */}
            <View className="mb-4">
              <View className="flex-row items-center justify-between bg-[#2C2C2E] rounded-xl px-4 py-4">
                <TextInput
                  className="flex-1 text-white text-base"
                  value={firstName}
                  onChangeText={setFirstName}
                  placeholder="First Name"
                  placeholderTextColor="#8E8E93"
                />
                <Image
                  source={require("../../../assets/images/edits-icon.png")}
                  style={{ width: 20, height: 20 }}
                  resizeMode="contain"
                />
              </View>
            </View>

            {/* Last Name */}
            <View className="mb-4">
              <View className="flex-row items-center justify-between bg-[#2C2C2E] rounded-xl px-4 py-4">
                <TextInput
                  className="flex-1 text-white text-base"
                  value={lastName}
                  onChangeText={setLastName}
                  placeholder="Last Name"
                  placeholderTextColor="#8E8E93"
                />
                <Image
                  source={require("../../../assets/images/edits-icon.png")}
                  style={{ width: 20, height: 20 }}
                  resizeMode="contain"
                />
              </View>
            </View>

            {/* Role Dropdown */}
            <View className="mb-6">
              <TouchableOpacity
                className="flex-row items-center justify-between bg-[#2C2C2E] rounded-xl px-4 py-4"
                onPress={() => setShowRoleDropdown(!showRoleDropdown)}
              >
                <Text className="text-white text-base">{selectedRole}</Text>
                <ChevronDown size={20} color="#fff" />
              </TouchableOpacity>

              {/* Dropdown Options */}
              {showRoleDropdown && (
                <View className="bg-[#2C2C2E] rounded-xl mt-2 overflow-hidden">
                  {ROLES.map((role, index) => (
                    <TouchableOpacity
                      key={index}
                      className="px-4 py-4 border-b border-[#3C3C3E]"
                      onPress={() => {
                        setSelectedRole(role);
                        setShowRoleDropdown(false);
                      }}
                    >
                      <Text className="text-white text-base">{role}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            {/* About Section */}
            <View className="mb-6">
              <Text className="text-white text-lg font-bold mb-3">About</Text>
              <View className="bg-[#2C2C2E] rounded-xl p-4 relative">
                <TextInput
                  className="text-white text-base leading-6"
                  value={about}
                  onChangeText={setAbout}
                  multiline
                  numberOfLines={6}
                  textAlignVertical="top"
                  style={{ minHeight: 120 }}
                />
                <TouchableOpacity
                  className="absolute bottom-4 right-4"
                  style={{ width: 20, height: 20 }}
                >
                  <Image
                    source={require("../../../assets/images/edits-icon.png")}
                    style={{ width: 20, height: 20 }}
                    resizeMode="contain"
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}

        {/* Gallery Tab Content */}
        {activeTab === "gallery" && (
          <View className="px-6">
            {/* Gallery Grid */}
            <View className="flex-row flex-wrap justify-between">
              {/* Add Image Button */}
              <TouchableOpacity
                className="bg-[#2C2C2E] rounded-2xl items-center justify-center mb-4"
                style={{ width: "48%", height: 200 }}
                onPress={handleAddGalleryImage}
              >
                <View
                  className="items-center justify-center"
                  style={{ width: 60, height: 60 }}
                >
                  <View className="absolute w-12 h-1 bg-white rounded-full" />
                  <View className="absolute w-1 h-12 bg-white rounded-full" />
                </View>
              </TouchableOpacity>

              {/* Gallery Images */}
              {galleryImages.map((image) => (
                <View
                  key={image.id}
                  className="rounded-2xl overflow-hidden mb-4 relative"
                  style={{ width: "48%", height: 200 }}
                >
                  <Image
                    source={{ uri: image.uri }}
                    className="w-full h-full"
                    resizeMode="cover"
                  />
                  <TouchableOpacity
                    className="absolute top-2 right-2 bg-black/70 rounded-full p-1"
                    onPress={() => setSelectedGalleryImage(image.id)}
                  >
                    <X size={20} color="#fff" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </View>
        )}
      </ScrollView>

      {/* Save Button */}
      <View
        className="absolute bottom-0 left-0 right-0 px-6 pb-8 pt-4"
        style={{ backgroundColor: "black" }}
      >
        <TouchableOpacity
          className="bg-[#FCCD34] rounded-xl py-4 items-center justify-center"
          onPress={handleSave}
        >
          <Text className="text-black text-base font-bold">Save</Text>
        </TouchableOpacity>
      </View>

      {/* Save Confirmation Modal */}
      <Modal
        visible={showSaveConfirmation}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowSaveConfirmation(false)}
      >
        <View
          className="flex-1 justify-center items-center"
          style={{ backgroundColor: "rgba(0,0,0,0.7)" }}
        >
          <View
            className="bg-[#1C1C1E] rounded-2xl overflow-hidden"
            style={{ width: 300 }}
          >
            <View className="p-6">
              <Text className="text-white text-center text-lg font-semibold mb-2">
                Are you sure you want to
              </Text>
              <Text className="text-white text-center text-lg font-semibold mb-6">
                save changes?
              </Text>

              <TouchableOpacity className="py-3 mb-2" onPress={confirmSave}>
                <Text className="text-[#FCCD34] text-center text-base font-semibold">
                  Save
                </Text>
              </TouchableOpacity>

              <View className="h-px bg-[#2C2C2E] my-2" />

              <TouchableOpacity
                className="py-3"
                onPress={() => setShowSaveConfirmation(false)}
              >
                <Text className="text-white text-center text-base font-semibold">
                  Cancel
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Delete Gallery Image Confirmation */}
      <Modal
        visible={selectedGalleryImage !== null}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setSelectedGalleryImage(null)}
      >
        <View
          className="flex-1 justify-center items-center"
          style={{ backgroundColor: "rgba(0,0,0,0.9)" }}
        >
          {selectedGalleryImage && (
            <>
              <Image
                source={{
                  uri:
                    galleryImages.find((img) => img.id === selectedGalleryImage)
                      ?.uri || "",
                }}
                style={{ width: "90%", height: 400, borderRadius: 16 }}
                resizeMode="cover"
              />

              <View className="mt-8" style={{ width: "90%" }}>
                <TouchableOpacity
                  className="bg-transparent border-2 border-white rounded-xl py-4 items-center justify-center mb-3"
                  onPress={() => handleDeleteGalleryImage(selectedGalleryImage)}
                >
                  <Text className="text-white text-base font-bold">Delete</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  className="bg-[#2C2C2E] rounded-xl py-4 items-center justify-center"
                  onPress={() => setSelectedGalleryImage(null)}
                >
                  <Text className="text-white text-base font-bold">Cancel</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>
      </Modal>
    </View>
  );
}
