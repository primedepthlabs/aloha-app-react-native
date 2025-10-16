import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Modal,
  Image,
} from "react-native";
import { ChevronLeft } from "lucide-react-native";
import { useRouter } from "expo-router";

interface ReportReason {
  id: number;
  label: string;
}

const REPORT_REASONS: ReportReason[] = [
  { id: 1, label: "Hate speech or Harassment" },
  { id: 2, label: "Scam/Fraud" },
  { id: 3, label: "Impersonation" },
  { id: 4, label: "Nudy or Sexual Content" },
];

export default function ReportScreen() {
  const router = useRouter();
  const [selectedReason, setSelectedReason] = useState<number | null>(null);
  const [additionalDetails, setAdditionalDetails] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleSubmitReport = () => {
    if (selectedReason === null) {
      return;
    }
    setShowSuccessModal(true);
  };

  const handleDone = () => {
    setShowSuccessModal(false);
    router.push("/report");
  };

  return (
    <View className="flex-1 bg-black">
      {/* Header */}
      <View className="pt-12 pb-4 px-4">
        <View className="flex-row items-center">
          <TouchableOpacity
            onPress={() => router.push("/discover")}
            className="mr-4"
          >
            <ChevronLeft size={24} color="#fff" />
          </TouchableOpacity>
          <Text className="text-white font-semibold text-[18px] flex-1 text-center">
            Report Profile
          </Text>
        </View>
      </View>

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* Section Title */}
        <View className="px-4 pt-4 pb-6">
          <Text className="text-white text-[18px] font-medium leading-6">
            Select a reason for reporting
          </Text>
        </View>

        {/* Report Reasons */}
        <View className="px-4 mb-6">
          {REPORT_REASONS.map((reason, index) => (
            <TouchableOpacity
              key={reason.id}
              onPress={() => setSelectedReason(reason.id)}
              className="flex-row items-center justify-between bg-transparent border border-[#808080] rounded-[15px] px-[14px] py-[13px]"
              style={{
                marginBottom: index < REPORT_REASONS.length - 1 ? 12 : 0,
              }}
              activeOpacity={0.7}
            >
              <Text className="text-white text-[16px] flex-1 font-normal">
                {reason.label}
              </Text>
              <View
                className={`w-[24px] h-[24px] rounded-full ${
                  selectedReason === reason.id
                    ? "bg-[#FCCD34]"
                    : "border-[2px] border-[#808080]"
                } items-center justify-center`}
              >
                {selectedReason === reason.id && (
                  <View className="w-[10px] h-[10px] rounded-full bg-black" />
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Additional Details */}
        <View className="px-4 pt-6">
          <Text className="text-white text-[18px] font-medium mb-4 leading-6">
            Tell us more (Optional)
          </Text>

          <View className="bg-[#19191B] border border-[#808080] rounded-[15px]  px-[14px] py-[14px] mb-8">
            <TextInput
              className="text-white text-[15px] min-h-[100px]"
              placeholder="Provide specific details that will help us review the report..."
              placeholderTextColor="#6E6E73"
              multiline
              textAlignVertical="top"
              value={additionalDetails}
              onChangeText={setAdditionalDetails}
              style={{ fontFamily: "System" }}
            />
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            onPress={handleSubmitReport}
            className={`rounded-[15px] py-[16px] items-center justify-center ${
              selectedReason === null ? "bg-[#3C3C3E]" : "bg-[#FCCD34]"
            }`}
            disabled={selectedReason === null}
            activeOpacity={0.8}
          >
            <Text
              className={`text-[17px] font-semibold ${
                selectedReason === null ? "text-[#6E6E73]" : "text-black"
              }`}
            >
              Submit Report
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Success Modal */}
      <Modal
        visible={showSuccessModal}
        animationType="fade"
        transparent={true}
        onRequestClose={handleDone}
      >
        <View className="flex-1 bg-black/95 items-center justify-center px-6">
          <View className="items-center w-full">
            {/* Success Icon */}
            <View className="mb-12 items-center justify-center">
              <Image
                source={require("../../assets/images/Check.png")}
                style={{ width: 160, height: 160 }}
                resizeMode="contain"
              />
            </View>

            {/* Success Text */}
            <Text className="text-white text-[32px] font-semibold mb-5 text-center">
              Report Submitted
            </Text>
            <Text className="text-white text-[16px] text-center leading-6 px-6 mb-12">
              Thank you for helping us keep the community safe. we will review
              your report shortly.
            </Text>

            {/* Done Button - Same level as Submit Button */}
            <TouchableOpacity
              onPress={handleDone}
              className="bg-[#FCCD34] rounded-[20px] py-[18px] w-full"
              activeOpacity={0.8}
            >
              <Text className="text-black text-[18px] font-bold text-center">
                Done
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}
