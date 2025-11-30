// app/(tabs)/profile/addFunds.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  Image,
  Dimensions,
  Alert,
} from "react-native";
import { ChevronLeft } from "lucide-react-native";
import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
} from "@expo-google-fonts/poppins";
import { router } from "expo-router";
import { supabase } from "@/supabaseClient";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const FONT = {
  Regular: "Poppins_400Regular",
  Medium: "Poppins_500Medium",
  SemiBold: "Poppins_600SemiBold",
  Bold: "Poppins_700Bold",
};

export default function AddFunds() {
  const [amount, setAmount] = useState("");
  const [selectedPayment, setSelectedPayment] = useState("");
  const [showCardOptions, setShowCardOptions] = useState(false);

  const [balance, setBalance] = useState<number | null>(null);
  const [walletId, setWalletId] = useState<string | null>(null);
  const [loadingWallet, setLoadingWallet] = useState(false);
  const [processing, setProcessing] = useState(false);

  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  // ----- define the function as a declaration (hoisted) so useEffect always sees it -----
  async function loadWallet() {
    setLoadingWallet(true);
    try {
      const {
        data: { user },
        error: userErr,
      } = await supabase.auth.getUser();

      if (userErr) {
        console.error("getUser error:", userErr);
        return;
      }
      if (!user) {
        console.warn("No user logged in");
        return;
      }

      // try to fetch wallet
      const { data: walletRow, error } = await supabase
        .from("wallets")
        .select("*")
        .eq("user_id", user.id)
        .limit(1)
        .maybeSingle();

      if (error && !/No rows found/i.test(error.message ?? "")) {
        console.error("Error fetching wallet:", error);
      }

      if (!walletRow) {
        // create wallet with 0 balance
        const { data: inserted, error: insertError } = await supabase
          .from("wallets")
          .insert({
            user_id: user.id,
            balance: 0,
            currency: "USD",
          })
          .select()
          .single();

        if (insertError) {
          console.error("Error creating wallet:", insertError);
        } else {
          setWalletId(inserted.id);
          setBalance(Number(inserted.balance));
        }
      } else {
        setWalletId(walletRow.id);
        setBalance(Number(walletRow.balance));
      }
    } catch (err) {
      console.error("Unexpected loadWallet error:", err);
    } finally {
      setLoadingWallet(false);
    }
  }

  useEffect(() => {
    loadWallet();
  }, []);

  if (!fontsLoaded) {
    return (
      <View className="flex-1 items-center justify-center bg-black">
        <ActivityIndicator color="#FCCD34" />
      </View>
    );
  }

  const handlePaymentSelect = (method: string) => {
    setSelectedPayment(method);
    if (method === "card") {
      setShowCardOptions(!showCardOptions);
    } else {
      setShowCardOptions(false);
    }
  };

  // handle top-up
  const handleContinue = async () => {
    const parsed = parseFloat(amount);
    if (isNaN(parsed) || parsed <= 0) {
      Alert.alert(
        "Invalid amount",
        "Please enter a valid amount greater than 0."
      );
      return;
    }

    setProcessing(true);
    try {
      // get current user
      const {
        data: { user },
        error: userErr,
      } = await supabase.auth.getUser();

      if (userErr || !user) {
        console.error("No user or error getting user:", userErr);
        Alert.alert("Not signed in", "Please sign in before adding funds.");
        setProcessing(false);
        return;
      }

      // ensure wallet exists
      let currentWalletId = walletId;
      if (!currentWalletId) {
        const { data: insertData, error: insertErr } = await supabase
          .from("wallets")
          .insert({
            user_id: user.id,
            balance: 0,
            currency: "USD",
          })
          .select()
          .single();
        if (insertErr) {
          console.error("Error creating wallet:", insertErr);
          Alert.alert("Error", "Unable to create wallet. Try again.");
          setProcessing(false);
          return;
        }
        currentWalletId = insertData.id;
        setWalletId(currentWalletId);
        setBalance(Number(insertData.balance));
      }

      // fetch latest balance
      const { data: latestWallet, error: fetchErr } = await supabase
        .from("wallets")
        .select("id, balance")
        .eq("id", currentWalletId)
        .limit(1)
        .maybeSingle();

      if (fetchErr) {
        console.error("Error fetching latest wallet:", fetchErr);
        Alert.alert("Error", "Could not fetch latest wallet state.");
        setProcessing(false);
        return;
      }

      const currentBalance = latestWallet ? Number(latestWallet.balance) : 0;
      const newBalance = Number((currentBalance + parsed).toFixed(2));

      // Update wallet balance
      const { data: updatedWallet, error: updateErr } = await supabase
        .from("wallets")
        .update({ balance: newBalance, updated_at: new Date().toISOString() })
        .eq("id", currentWalletId)
        .select()
        .single();

      if (updateErr) {
        console.error("Error updating wallet:", updateErr);
        // record failed transaction attempt (best-effort)
        await supabase.from("transactions").insert({
          user_id: user.id,
          wallet_id: currentWalletId,
          type: "top_up",
          status: "failed",
          amount: parsed,
          currency: "USD",
          payment_method: selectedPayment || null,
          description: "Top-up failed during wallet update",
          metadata: { note: "wallet update failed" },
        });
        Alert.alert("Error", "Failed to add funds. Please try again.");
        setProcessing(false);
        return;
      }

      // Insert transaction record (completed)
      const { data: txInserted, error: txErr } = await supabase
        .from("transactions")
        .insert({
          user_id: user.id,
          wallet_id: currentWalletId,
          type: "top_up", // ensure enum matches your DB
          status: "completed",
          amount: parsed,
          currency: "USD",
          payment_method: selectedPayment || null,
          description: `Top-up via ${selectedPayment || "unknown"}`,
          metadata: { method: selectedPayment || null },
          completed_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (txErr) {
        console.error("Transaction insert failed:", txErr);
        Alert.alert(
          "Partial success",
          `Balance updated to ${updatedWallet.balance}, but failed to log transaction.`
        );
        setBalance(Number(updatedWallet.balance));
        setAmount("");
        setProcessing(false);
        return;
      }

      // success
      setBalance(Number(updatedWallet.balance));
      setAmount("");
      Alert.alert(
        "Success",
        `Funds added successfully. New balance: ${updatedWallet.balance}`
      );

      // optionally navigate back and pass param so profile can refresh
      router.back();
    } catch (err) {
      console.error("Unexpected error adding funds:", err);
      Alert.alert("Error", "An unexpected error occurred. Please try again.");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-black">
      <StatusBar barStyle="light-content" />
      <ScrollView className="flex-1">
        <View
          className="flex-row items-center px-4"
          style={{ height: 44, marginTop: 8 }}
        >
          <TouchableOpacity
            onPress={() => router.back()}
            className="absolute left-4"
            style={{ zIndex: 10 }}
          >
            <ChevronLeft size={24} color="#fff" strokeWidth={2.5} />
          </TouchableOpacity>
          <Text
            className="text-white text-center flex-1 font-semibold"
            style={{ fontSize: 18, fontFamily: FONT.SemiBold }}
          >
            Add Funds
          </Text>
        </View>

        <View style={{ paddingHorizontal: 24, paddingTop: 20 }}>
          <View
            style={{
              width: 331,
              height: 69,
              backgroundColor: "#1C1C1E",
              borderRadius: 15,
              paddingVertical: 13,
              paddingHorizontal: 20,
              marginBottom: 24,
            }}
          >
            <Text
              style={{
                fontSize: 12,
                fontFamily: FONT.Regular,
                color: "#FFFFFF",
                marginBottom: 4,
              }}
            >
              Current Balance:
            </Text>
            {loadingWallet ? (
              <ActivityIndicator />
            ) : (
              <Text
                style={{
                  fontSize: 20,
                  fontFamily: FONT.Bold,
                  color: "#FCCD34",
                }}
              >
                {balance !== null ? `${balance} USD` : "—"}
              </Text>
            )}
          </View>

          <Text
            style={{
              fontSize: 18,
              fontFamily: FONT.Medium,
              color: "#FFFFFF",
              marginBottom: 12,
            }}
          >
            Enter amount
          </Text>

          <TextInput
            value={amount}
            onChangeText={setAmount}
            placeholder="50"
            placeholderTextColor="#6F6F70"
            keyboardType="numeric"
            style={{
              width: SCREEN_WIDTH - 48,
              height: 56,
              backgroundColor: "#1C1C1E",
              borderRadius: 15,
              paddingHorizontal: 20,
              fontSize: 16,
              fontFamily: FONT.Regular,
              color: "#FFFFFF",
              marginBottom: 24,
            }}
            editable={!processing}
          />

          <Text
            style={{
              fontSize: 18,
              fontFamily: FONT.Medium,
              color: "#FFFFFF",
              marginBottom: 12,
            }}
          >
            Select Payment Method
          </Text>

          {/* Apple Pay */}
          <TouchableOpacity
            onPress={() => handlePaymentSelect("apple")}
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              width: SCREEN_WIDTH - 48,
              height: 56,
              borderRadius: 15,
              paddingHorizontal: 16,
              marginBottom: 12,
              borderWidth: selectedPayment === "apple" ? 1 : 0.5,
              borderColor: selectedPayment === "apple" ? "#FCCD34" : "#3A3A3C",
              backgroundColor: "#1C1C1E",
            }}
          >
            <View className="flex-row items-center">
              <View className="w-10 h-10 rounded-[8px] mr-3 items-center justify-center">
                <Image
                  source={require("../../../assets/images/applepay.png")}
                  className="w-7 h-7"
                  resizeMode="contain"
                />
              </View>
              <Text
                style={{
                  fontSize: 16,
                  fontFamily: FONT.Regular,
                  color: "#FFFFFF",
                }}
              >
                Apple Pay
              </Text>
            </View>
            <Text className="text-gray-500 text-[20px]">›</Text>
          </TouchableOpacity>

          {/* Card */}
          <TouchableOpacity
            onPress={() => handlePaymentSelect("card")}
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              width: SCREEN_WIDTH - 48,
              height: 56,
              borderRadius: 15,
              paddingHorizontal: 16,
              marginBottom: showCardOptions ? 12 : 24,
              borderWidth: selectedPayment === "card" ? 1 : 0.5,
              borderColor: selectedPayment === "card" ? "#FCCD34" : "#3A3A3C",
              backgroundColor: "#1C1C1E",
            }}
          >
            <View className="flex-row items-center flex-1">
              <View className="w-10 h-10 rounded-[8px] mr-3 items-center justify-center">
                <Image
                  source={require("../../../assets/images/profile/debitcard.png")}
                  className="w-6 h-6"
                  resizeMode="contain"
                />
              </View>
              <Text
                style={{
                  fontSize: 16,
                  fontFamily: FONT.Regular,
                  color: "#FFFFFF",
                }}
              >
                Credit/Debit Card
              </Text>
            </View>
            <Text className="text-gray-500 text-[20px]">
              {showCardOptions ? "∧" : "›"}
            </Text>
          </TouchableOpacity>

          {showCardOptions && (
            <View style={{ marginBottom: 12 }}>
              <TouchableOpacity
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  width: SCREEN_WIDTH - 48,
                  height: 56,
                  backgroundColor: "#2C2C2E",
                  borderRadius: 15,
                  paddingHorizontal: 16,
                  marginBottom: 12,
                }}
              >
                <View className="w-10 h-7 rounded-[6px] bg-red-600 mr-3 relative items-center justify-center">
                  <View className="w-5 h-5 bg-red-700 rounded-full absolute left-0" />
                  <View className="w-5 h-5 bg-orange-500 rounded-full absolute right-0" />
                </View>
                <Text
                  style={{
                    fontSize: 15,
                    fontFamily: FONT.Regular,
                    color: "#FFFFFF",
                  }}
                >
                  MASTERCARD **** 5100
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  width: SCREEN_WIDTH - 48,
                  height: 56,
                  backgroundColor: "#2C2C2E",
                  borderRadius: 15,
                  paddingHorizontal: 16,
                  marginBottom: 12,
                }}
              >
                <View className="w-10 h-7 rounded-[6px] bg-blue-600 mr-3 items-center justify-center">
                  <Text className="text-white font-bold text-[12px]">VISA</Text>
                </View>
                <Text
                  style={{
                    fontSize: 15,
                    fontFamily: FONT.Regular,
                    color: "#FFFFFF",
                  }}
                >
                  VISA **** 5100
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => router.push("/(tabs)/discover/addCard")}
                style={{
                  width: SCREEN_WIDTH - 48,
                  height: 48,
                  borderRadius: 15,
                  borderWidth: 0.5,
                  borderColor: "#3A3A3C",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 12,
                  backgroundColor: "transparent",
                }}
              >
                <Text
                  style={{
                    fontSize: 16,
                    fontFamily: FONT.Medium,
                    color: "#FFFFFF",
                  }}
                >
                  + Add Card
                </Text>
              </TouchableOpacity>
            </View>
          )}

          <TouchableOpacity
            onPress={handleContinue}
            disabled={processing}
            style={{
              width: SCREEN_WIDTH - 48,
              height: 48,
              borderRadius: 15,
              backgroundColor: "#FCCD34",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 32,
              opacity: processing ? 0.7 : 1,
            }}
          >
            {processing ? (
              <ActivityIndicator color="#000" />
            ) : (
              <Text
                style={{
                  fontSize: 18,
                  fontFamily: FONT.SemiBold,
                  color: "#000000",
                }}
              >
                Continue
              </Text>
            )}
          </TouchableOpacity>

          <View style={{ alignItems: "center", marginBottom: 32 }}>
            <Text
              style={{
                fontSize: 15,
                fontFamily: FONT.Regular,
                color: "#FFFFFF",
              }}
            >
              Need Help?{" "}
              <Text style={{ color: "#FCCD34", fontFamily: FONT.Medium }}>
                Contact Support
              </Text>
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
