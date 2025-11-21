// app/(tabs)/discover/report.tsx
import React, { useState, useEffect } from "react";
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
import { ChevronLeft } from "lucide-react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { supabase } from "../../../supabaseClient";

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

// Map UI reason IDs to DB enum values — update these if your DB enum differs
const REASON_TO_REPORT_TYPE: Record<number, string> = {
  1: "harassment",
  2: "scam",
  3: "impersonation",
  4: "sexual",
};

export default function ReportScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  // Try to support multiple incoming param names; we prefer reportedUserId
  const resolvedReportedUserId =
    (params.reportedUserId as string) ??
    (params.influencerId as string) ??
    (params.userId as string) ??
    (params.id as string) ??
    null;

  const reportedUserName = (params.name as string) || "";
  const reportedUserImage = (params.image as string) || "";

  const [selectedReason, setSelectedReason] = useState<number | null>(null);
  const [additionalDetails, setAdditionalDetails] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [checkingParams, setCheckingParams] = useState(true);

  useEffect(() => {
    // Basic runtime param check and logging for debugging
    console.log("ReportScreen - params:", params);
    console.log(
      "ReportScreen - resolvedReportedUserId:",
      resolvedReportedUserId
    );

    if (!resolvedReportedUserId) {
      // Show a gentle alert and navigate back after user confirms
      Alert.alert(
        "Missing user",
        "Reported user id is missing. Please open the profile or chat and try reporting from there.",
        [
          {
            text: "OK",
            onPress: () => {
              // go back to discover
              router.push("/(tabs)/discover");
            },
          },
        ]
      );
    }

    setCheckingParams(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmitReport = async () => {
    if (selectedReason === null) {
      Alert.alert(
        "Select a reason",
        "Please choose a reason before submitting."
      );
      return;
    }

    // verify we have a reported user id
    if (!resolvedReportedUserId) {
      Alert.alert(
        "Missing data",
        "No reported user was found. Please open the profile or chat and try again."
      );
      return;
    }

    // basic sanity check for uuid-like string
    if (
      typeof resolvedReportedUserId !== "string" ||
      resolvedReportedUserId.length < 8
    ) {
      Alert.alert("Invalid user id", "Reported user id looks invalid.");
      return;
    }

    setSubmitting(true);

    try {
      // get current user (reporter)
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        console.error("Supabase getUser error:", userError);
        Alert.alert(
          "Authentication error",
          "Please sign in to submit a report."
        );
        setSubmitting(false);
        return;
      }

      const reporterId = user.id;
      const reportedUserIdFinal = String(resolvedReportedUserId);

      const reportType = REASON_TO_REPORT_TYPE[selectedReason];
      if (!reportType) {
        Alert.alert("Error", "Invalid report type. Contact support.");
        setSubmitting(false);
        return;
      }

      const descriptionText =
        additionalDetails?.trim().length > 0
          ? additionalDetails.trim()
          : REPORT_REASONS.find((r) => r.id === selectedReason)?.label || "";

      const payload: any = {
        reporter_id: reporterId,
        reported_user_id: reportedUserIdFinal,
        report_type: reportType,
        description: descriptionText,
        related_entity_type: "profile",
        related_entity_id: reportedUserIdFinal,
        evidence_urls: null, // keep null by default; add URLs if you implement uploads
        // status will default to 'open' in DB
      };

      console.log("ReportScreen - inserting payload:", payload);

      const { data: createdReport, error: insertError } = await supabase
        .from("abuse_reports")
        .insert(payload)
        .select()
        .single();

      console.log("ReportScreen - insert response:", {
        createdReport,
        insertError,
      });

      if (insertError) {
        console.error("Error inserting abuse report:", insertError);
        Alert.alert("Error", "Failed to submit report. Please try again.");
        setSubmitting(false);
        return;
      }

      // OPTIONAL: add a suspicious_activities record (non-fatal)
      try {
        await supabase.from("suspicious_activities").insert({
          user_id: reportedUserIdFinal,
          activity_type: reportType,
          severity:
            selectedReason === 4
              ? "high"
              : selectedReason === 2
              ? "medium"
              : "low",
          description: `Report ${createdReport.id}: ${descriptionText}`,
          metadata: {
            report_id: createdReport.id,
            reporter: reporterId,
          },
        });
      } catch (saErr) {
        // non-blocking; log and continue
        console.warn(
          "Failed to create suspicious_activities entry (non-fatal):",
          saErr
        );
      }

      setShowSuccessModal(true);
    } catch (err) {
      console.error("Unhandled error submitting report:", err);
      Alert.alert("Error", "An unexpected error occurred. Try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDone = () => {
    setShowSuccessModal(false);
    router.push("/(tabs)/discover");
  };

  // Keep UI identical to your original file
  return (
    <View className="flex-1 bg-black">
      {/* Header */}
      <View className="pt-12 pb-4 px-4">
        <View className="flex-row items-center">
          <TouchableOpacity
            onPress={() => router.push("/(tabs)/discover")}
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
            disabled={selectedReason === null || submitting}
            activeOpacity={0.8}
          >
            {submitting ? (
              <ActivityIndicator />
            ) : (
              <Text
                className={`text-[17px] font-semibold ${
                  selectedReason === null ? "text-[#6E6E73]" : "text-black"
                }`}
              >
                Submit Report
              </Text>
            )}
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
                source={require("../../../assets/images/Check.png")}
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
