import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { router } from "expo-router";
import { ChevronLeft } from "lucide-react-native";

type ReportReason =
  | "Hate speech or Harassment"
  | "Scam/Fraud"
  | "Impersonation"
  | "Nudy or Sexual Content";

export default function ReportScreen() {
  const [selectedReason, setSelectedReason] = useState<ReportReason | null>(
    "Hate speech or Harassment"
  );
  const [additionalDetails, setAdditionalDetails] = useState("");

  const reportReasons: ReportReason[] = [
    "Hate speech or Harassment",
    "Scam/Fraud",
    "Impersonation",
    "Nudy or Sexual Content",
  ];

  const handleSubmit = () => {
    if (!selectedReason) {
      return;
    }

    // Handle report submission
    console.log("Report submitted:", {
      reason: selectedReason,
      details: additionalDetails,
    });

    // Navigate back or show confirmation
    router.back();
  };

  return (
    <View className="flex-1 bg-black">
      <ScrollView className="flex-1 px-6 py-12">
        {/* Header */}
        <View className="flex-row items-center mb-8">
          <TouchableOpacity onPress={() => router.back()}>
            <ChevronLeft size={24} color="#fff" />
          </TouchableOpacity>
          <Text className="text-white text-xl font-bold flex-1 text-center mr-6">
            Report Profile
          </Text>
        </View>

        {/* Title */}
        <Text className="text-white text-3xl font-bold mb-6">
          Select a reason for reporting
        </Text>

        {/* Report Reasons */}
        <View className="mb-8">
          {reportReasons.map((reason, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => setSelectedReason(reason)}
              className="flex-row items-center justify-between bg-transparent border border-gray-700 rounded-2xl px-6 py-5 mb-4"
            >
              <Text className="text-white text-base flex-1">{reason}</Text>
              <View
                className={`w-6 h-6 rounded-full border-2 ${
                  selectedReason === reason
                    ? "border-[#FCCD34] bg-transparent"
                    : "border-gray-600"
                } items-center justify-center`}
              >
                {selectedReason === reason && (
                  <View className="w-3 h-3 rounded-full bg-[#FCCD34]" />
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Optional Details Section */}
        <Text className="text-white text-2xl font-bold mb-4">
          Tell us more (Optional)
        </Text>

        <TextInput
          className="bg-gray-900 rounded-2xl px-6 py-4 text-white text-base min-h-[200px]"
          placeholder="Peovide specific details that will help us review the report..."
          placeholderTextColor="#666"
          multiline
          textAlignVertical="top"
          value={additionalDetails}
          onChangeText={setAdditionalDetails}
        />
      </ScrollView>

      {/* Submit Button - Fixed at bottom */}
      <View className="px-6 pb-8">
        <TouchableOpacity
          className="bg-[#FCCD34] rounded-2xl py-4 px-8"
          onPress={handleSubmit}
        >
          <Text className="text-black text-center text-lg font-bold">
            Submit Report
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
