import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  Modal,
  Dimensions,
  Image,
  Alert,
} from "react-native";
import {
  ChevronLeft,
  Upload,
  Image as ImageIcon,
  FileText,
  Trash2,
} from "lucide-react-native";
import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
} from "@expo-google-fonts/poppins";
import { useRouter } from "expo-router";
import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";

const FONT = {
  Regular: "Poppins_400Regular",
  Medium: "Poppins_500Medium",
  SemiBold: "Poppins_600SemiBold",
  Bold: "Poppins_700Bold",
};

const SCREEN_WIDTH = Dimensions.get("window").width;

const DocumentUploadScreen = () => {
  const router = useRouter();
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  const [uploadState, setUploadState] = useState<"idle" | "uploading" | "uploaded">("idle");
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const [showOptions, setShowOptions] = useState(true);
  const [successModalVisible, setSuccessModalVisible] = useState(false);

  if (!fontsLoaded) {
    return (
      <View className="flex-1 items-center justify-center bg-black">
        <ActivityIndicator color="#FCCD34" />
      </View>
    );
  }

  const handlePhotoLibrary = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        quality: 1,
      });

      if (!result.canceled) {
        setSelectedFile(result.assets[0]);
        setShowOptions(false);
        setUploadState("uploading");

        setTimeout(() => {
          setUploadState("uploaded");
        }, 2000);
      }
    } catch {
      Alert.alert("Error", "Failed to pick image");
    }
  };

  const handleChooseFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ["application/pdf", "image/*"],
        copyToCacheDirectory: true,
      });

      if (result.type === "success") {
        setSelectedFile(result);
        setShowOptions(false);
        setUploadState("uploading");

        setTimeout(() => {
          setUploadState("uploaded");
        }, 2000);
      }
    } catch {
      Alert.alert("Error", "Failed to pick document");
    }
  };

  const handleDelete = () => {
    setSelectedFile(null);
    setUploadState("idle");
    setShowOptions(true);
  };

  const handleSubmit = () => {
    if (uploadState === "uploaded") {
      setSuccessModalVisible(true);
    }
  };

  const getFileName = () => {
    if (!selectedFile) return "";
    return selectedFile.name || selectedFile.fileName || "Document.pdf";
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
          paddingHorizontal: 20,
          position: "relative",
        }}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          style={{
            width: 40,
            height: 40,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <ChevronLeft size={24} color="#FFFFFF" strokeWidth={2} />
        </TouchableOpacity>

        <View
          style={{
            flex: 1,
            height: 4,
            backgroundColor: "#333333",
            marginLeft: 20,
            borderRadius: 2,
          }}
        >
          <View
            style={{
              width: "50%",
              height: "100%",
              backgroundColor: "#FCCD34",
              borderRadius: 2,
            }}
          />
        </View>
      </View>

      <View style={{ flex: 1, paddingHorizontal: 24, paddingTop: 40 }}>
        {/* Title */}
        <Text
          style={{
            fontSize: 24,
            textAlign: "center",
            fontFamily: FONT.SemiBold,
            color: "#FFFFFF",
            marginBottom: 12,
          }}
        >
          Upload Your document
        </Text>

        {/* Subtitle */}
        <Text
          style={{
            fontSize: 14,
            fontFamily: FONT.Regular,
            textAlign: "center",
            color: "rgba(255, 255, 255, 0.5)",
            marginBottom: 40,
            lineHeight: 22,
          }}
        >
          Ensure all details on the photo are visible{"\n"}and easy to read.
        </Text>

        {/* Upload Area */}
        <View
          style={{
            borderWidth: 1,
            borderColor: "#FCCD34",
            borderStyle: "dashed",
            borderRadius: 16,
            padding: 24,
            marginBottom: 16,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            {/* Icon / Preview */}
            <View
              style={{
                width: 90,
                height: 90,
                backgroundColor: "#2A2A2C",
                borderRadius: 12,
                alignItems: "center",
                justifyContent: "center",
                marginRight: 20,
              }}
            >
              {uploadState === "idle" && (
                <View
                  style={{
                    width: 50,
                    height: 50,
                    backgroundColor: "#4A4A4C",
                    borderRadius: 25,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Upload size={24} color="#FCCD34" />
                </View>
              )}

              {uploadState === "uploading" && (
                <View
                  style={{
                    width: 50,
                    height: 50,
                    backgroundColor: "#4A4A4C",
                    borderRadius: 25,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <ActivityIndicator size="small" color="#FCCD34" />
                </View>
              )}

              {uploadState === "uploaded" && selectedFile?.uri && (
                <Image
                  source={{ uri: selectedFile.uri }}
                  style={{ width: 90, height: 90, borderRadius: 12 }}
                  resizeMode="cover"
                />
              )}
            </View>

            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontSize: 18,
                  fontFamily: FONT.Medium,
                  color: "#FFFFFF",
                  marginBottom: 4,
                }}
              >
                Upload file
              </Text>

              {uploadState === "idle" && (
                <Text
                  style={{
                    fontSize: 15,
                    fontFamily: FONT.Regular,
                    color: "#FCCD34",
                  }}
                >
                  Choose from your{"\n"}device
                </Text>
              )}

              {uploadState === "uploading" && (
                <Text
                  style={{
                    fontSize: 15,
                    fontFamily: FONT.Regular,
                    color: "#FCCD34",
                  }}
                >
                  Uploading...
                </Text>
              )}

              {uploadState === "uploaded" && (
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <View style={{ flex: 1 }}>
                    <Text
                      numberOfLines={2}
                      style={{
                        fontSize: 13,
                        fontFamily: FONT.Regular,
                        color: "#FCCD34",
                      }}
                    >
                      {getFileName()}
                    </Text>
                    <Text
                      style={{
                        fontSize: 15,
                        fontFamily: FONT.Regular,
                        color: "#FCCD34",
                        marginTop: 4,
                      }}
                    >
                      Uploaded
                    </Text>
                  </View>

                  <TouchableOpacity onPress={handleDelete} style={{ padding: 8 }}>
                    <Trash2 size={20} color="#FFFFFF" />
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>
        </View>

        <Text
          style={{
            fontSize: 15,
            fontFamily: FONT.Regular,
            color: "#FFFFFF80",
            textAlign: "center",
            marginBottom: 24,
          }}
        >
          JPG, PNG HEIC, WEBP or PDF (max 50 MB)
        </Text>

        {/* Options */}
        {showOptions && uploadState === "idle" && (
          <View>
            <TouchableOpacity
              onPress={handlePhotoLibrary}
              style={{
                backgroundColor: "#19191B",
                paddingVertical: 20,
                paddingHorizontal: 24,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                borderRadius: 20,
                borderBottomWidth: 1,
                borderBottomColor: "#2C2C2E",
              }}
            >
              <Text
                style={{
                  fontSize: 18,
                  fontFamily: FONT.Regular,
                  color: "#FFFFFF",
                }}
              >
                Photo Library
              </Text>
              <ImageIcon size={22} color="#FCCD34" />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleChooseFile}
              style={{
                backgroundColor: "#19191B",
                paddingVertical: 20,
                paddingHorizontal: 24,
                flexDirection: "row",
                borderRadius: 20,
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Text
                style={{
                  fontSize: 18,
                  fontFamily: FONT.Regular,
                  color: "#FFFFFF",
                }}
              >
                Choose File
              </Text>
              <FileText size={22} color="#FCCD34" />
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Bottom Button */}
      <View style={{ paddingHorizontal: 24, paddingBottom: 50 }}>
        <TouchableOpacity
          onPress={handleSubmit}
          disabled={uploadState !== "uploaded"}
          style={{
            backgroundColor: uploadState === "uploaded" ? "#FCCD34" : "#d9c85a",
            borderRadius: 15,
            height: 48,
            alignItems: "center",
            justifyContent: "center",
            opacity: uploadState === "uploaded" ? 1 : 0.6,
          }}
        >
          <Text
            style={{
              fontSize: 18,
              fontFamily: FONT.SemiBold,
              color: "#000000",
            }}
          >
            {uploadState === "uploaded" ? "Submit" : "Continue"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Success Modal */}
      <Modal visible={successModalVisible} transparent animationType="fade">
        <View
          style={{
            flex: 1,
            backgroundColor: "#000000",
            alignItems: "center",
            justifyContent: "center",
            paddingHorizontal: 24,
          }}
        >
          <View
            style={{
              position: "absolute",
              top: 60,
              left: 20,
              right: 20,
              height: 4,
              backgroundColor: "#333333",
              borderRadius: 2,
            }}
          >
            <View
              style={{
                width: "100%",
                height: "100%",
                backgroundColor: "#FCCD34",
                borderRadius: 2,
              }}
            />
          </View>

          <View style={{ alignItems: "center", width: "100%" }}>
            <View
              style={{
                width: 120,
                height: 120,
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 32,
              }}
            >
              <Image
                source={require("../../../assets/images/Check.png")}
                style={{ width: 120, height: 120 }}
                resizeMode="contain"
              />
            </View>

            <Text
              style={{
                fontSize: 28,
                fontFamily: FONT.Bold,
                color: "#FFFFFF",
                marginBottom: 16,
                textAlign: "center",
                lineHeight: 36,
              }}
            >
              File Uploaded{"\n"}Successfully!
            </Text>

            <Text
              style={{
                fontSize: 14,
                fontFamily: FONT.Regular,
                color: "rgba(255, 255, 255, 0.6)",
                textAlign: "center",
                lineHeight: 24,
                marginBottom: 48,
              }}
            >
              The document{" "}
              <Text style={{ color: "#FCCD34" }}>{getFileName()}</Text>
              {"\n"}is confirmed and ready for final{"\n"}submission review.
            </Text>

            <TouchableOpacity
              onPress={() => {
                setSuccessModalVisible(false);
                router.back();
              }}
              style={{
                backgroundColor: "#FCCD34",
                alignItems: "center",
                justifyContent: "center",
                width: SCREEN_WIDTH - 48,
                height: 48,
                borderRadius: 15,
              }}
            >
              <Text
                style={{
                  fontSize: 18,
                  fontFamily: FONT.SemiBold,
                  color: "#000000",
                }}
              >
                Done
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default DocumentUploadScreen;
