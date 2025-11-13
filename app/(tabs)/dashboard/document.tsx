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
import { styled } from "nativewind";
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

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity);
const StyledSafeAreaView = styled(SafeAreaView);

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

  const [uploadState, setUploadState] = useState<
    "idle" | "uploading" | "uploaded"
  >("idle");
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

        // Simulate upload
        setTimeout(() => {
          setUploadState("uploaded");
        }, 2000);
      }
    } catch (error) {
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

        // Simulate upload
        setTimeout(() => {
          setUploadState("uploaded");
        }, 2000);
      }
    } catch (error) {
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
    <StyledSafeAreaView className="flex-1 bg-black">
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <StyledView
        style={{
          height: 60,
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 20,
          position: "relative",
        }}
      >
        <StyledTouchableOpacity
          onPress={() => router.back()}
          style={{
            width: 40,
            height: 40,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <ChevronLeft size={24} color="#FFFFFF" strokeWidth={2} />
        </StyledTouchableOpacity>

        {/* Progress Bar */}
        <StyledView
          style={{
            flex: 1,
            height: 4,
            backgroundColor: "#333333",
            marginLeft: 20,
            borderRadius: 2,
          }}
        >
          <StyledView
            style={{
              width: "50%",
              height: "100%",
              backgroundColor: "#FCCD34",
              borderRadius: 2,
            }}
          />
        </StyledView>
      </StyledView>

      <StyledView style={{ flex: 1, paddingHorizontal: 24, paddingTop: 40 }}>
        {/* Title */}
        <StyledText
          style={{
            fontSize: 24,
            textAlign: "center",
            fontFamily: FONT.SemiBold,
            color: "#FFFFFF",
            marginBottom: 12,
          }}
        >
          Upload Your document
        </StyledText>

        {/* Subtitle */}
        <StyledText
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
        </StyledText>

        {/* Upload Area */}
        <StyledView
          style={{
            borderWidth: 1,
            borderColor: "#FCCD34",
            borderStyle: "dashed",
            borderRadius: 16,
            padding: 24,
            marginBottom: 16,
          }}
        >
          <StyledView style={{ flexDirection: "row", alignItems: "center" }}>
            {/* Icon/Preview Box */}
            <StyledView
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
                <StyledView
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
                </StyledView>
              )}

              {uploadState === "uploading" && (
                <StyledView
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
                </StyledView>
              )}

              {uploadState === "uploaded" && selectedFile?.uri && (
                <Image
                  source={{ uri: selectedFile.uri }}
                  style={{
                    width: 90,
                    height: 90,
                    borderRadius: 12,
                  }}
                  resizeMode="cover"
                />
              )}
            </StyledView>

            {/* Text Content */}
            <StyledView style={{ flex: 1 }}>
              <StyledText
                style={{
                  fontSize: 18,
                  fontFamily: FONT.Medium,
                  color: "#FFFFFF",
                  marginBottom: 4,
                }}
              >
                Upload file
              </StyledText>

              {uploadState === "idle" && (
                <StyledText
                  style={{
                    fontSize: 15,
                    fontFamily: FONT.Regular,
                    color: "#FCCD34",
                  }}
                >
                  Choose from your{"\n"}device
                </StyledText>
              )}

              {uploadState === "uploading" && (
                <StyledText
                  style={{
                    fontSize: 15,
                    fontFamily: FONT.Regular,
                    color: "#FCCD34",
                  }}
                >
                  Uploading...
                </StyledText>
              )}

              {uploadState === "uploaded" && (
                <StyledView
                  style={{ flexDirection: "row", alignItems: "center" }}
                >
                  <StyledView style={{ flex: 1 }}>
                    <StyledText
                      style={{
                        fontSize: 13,
                        fontFamily: FONT.Regular,
                        color: "#FCCD34",
                      }}
                      numberOfLines={2}
                    >
                      {getFileName()}
                    </StyledText>
                    <StyledText
                      style={{
                        fontSize: 15,
                        fontFamily: FONT.Regular,
                        color: "#FCCD34",
                        marginTop: 4,
                      }}
                    >
                      Uploaded
                    </StyledText>
                  </StyledView>

                  <StyledTouchableOpacity
                    onPress={handleDelete}
                    style={{
                      padding: 8,
                    }}
                  >
                    <Trash2 size={20} color="#FFFFFF" />
                  </StyledTouchableOpacity>
                </StyledView>
              )}
            </StyledView>
          </StyledView>
        </StyledView>

        {/* File Format Text */}
        <StyledText
          style={{
            fontSize: 15,
            fontFamily: FONT.Regular,
            color: "#FFFFFF80",
            textAlign: "center",
            marginBottom: 24,
          }}
        >
          JPG, PNG HEIC, WEBP or PDF (max 50 MB)
        </StyledText>

        {/* Options */}
        {showOptions && uploadState === "idle" && (
          <StyledView>
            <StyledTouchableOpacity
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
              <StyledText
                style={{
                  fontSize: 18,
                  fontFamily: FONT.Regular,
                  color: "#FFFFFF",
                }}
              >
                Photo Library
              </StyledText>
              <ImageIcon size={22} color="#FCCD34" />
            </StyledTouchableOpacity>

            <StyledTouchableOpacity
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
              <StyledText
                style={{
                  fontSize: 18,
                  fontFamily: FONT.Regular,
                  color: "#FFFFFF",
                }}
              >
                Choose File
              </StyledText>
              <FileText size={22} color="#FCCD34" />
            </StyledTouchableOpacity>
          </StyledView>
        )}
      </StyledView>

      {/* Bottom Button */}
      <StyledView style={{ paddingHorizontal: 24, paddingBottom: 50 }}>
        <StyledTouchableOpacity
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
          <StyledText
            style={{
              fontSize: 18,
              fontFamily: FONT.SemiBold,
              color: "#000000",
            }}
          >
            {uploadState === "uploaded" ? "Submit" : "Continue"}
          </StyledText>
        </StyledTouchableOpacity>
      </StyledView>

      {/* Success Modal */}
      <Modal visible={successModalVisible} transparent animationType="fade">
        <StyledView
          style={{
            flex: 1,
            backgroundColor: "#000000",
            alignItems: "center",
            justifyContent: "center",
            paddingHorizontal: 24,
          }}
        >
          {/* Progress Bar at Top */}
          <StyledView
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
            <StyledView
              style={{
                width: "100%",
                height: "100%",
                backgroundColor: "#FCCD34",
                borderRadius: 2,
              }}
            />
          </StyledView>

          <StyledView style={{ alignItems: "center", width: "100%" }}>
            {/* Success Icon */}
            <StyledView
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
            </StyledView>

            {/* Success Title */}
            <StyledText
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
            </StyledText>

            {/* Success Message */}
            <StyledText
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
              <StyledText style={{ color: "#FCCD34" }}>
                {getFileName()}
              </StyledText>
              {"\n"}is confirmed and ready for final{"\n"}submission review. Tap
              the button{"\n"}below to review your document before{"\n"}sending.
            </StyledText>

            {/* Done Button */}
            <StyledTouchableOpacity
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
              <StyledText
                style={{
                  fontSize: 18,
                  fontFamily: FONT.SemiBold,
                  color: "#000000",
                }}
              >
                Done
              </StyledText>
            </StyledTouchableOpacity>
          </StyledView>
        </StyledView>
      </Modal>
    </StyledSafeAreaView>
  );
};

export default DocumentUploadScreen;
