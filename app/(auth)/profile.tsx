// app/(auth)/profile.tsx - Profile Screen (instrumented & robust)
import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Image,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { ChevronLeft, Plus, X } from "lucide-react-native";
import * as ImagePicker from "expo-image-picker";
import { supabase } from "../../supabaseClient";

interface PhotoSlot {
  id: number;
  uri: string | null;
  size: "large" | "medium" | "small";
}

export default function ProfileScreen() {
  const params = useLocalSearchParams();
  const userIdFromParams = (params.userId as string) || "";
  const phoneNumberFromParams = (params.phoneNumber as string) || "";

  const [step, setStep] = useState<0 | 1 | 2>(0);
  const [loading, setLoading] = useState(false);

  const [selectedGender, setSelectedGender] = useState("Woman");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [nameError, setNameError] = useState("");

  const [photos, setPhotos] = useState<PhotoSlot[]>([
    { id: 1, uri: null, size: "large" },
    { id: 2, uri: null, size: "medium" },
    { id: 3, uri: null, size: "medium" },
    { id: 4, uri: null, size: "small" },
    { id: 5, uri: null, size: "small" },
    { id: 6, uri: null, size: "small" },
  ]);

  // SAVE BASIC USER INFO (called when user completes step 1 - name entry)
  const saveBasicUserInfo = async () => {
    setLoading(true);
    try {
      // Get current authenticated user
      const { data: authData, error: userErr } = await supabase.auth.getUser();
      console.log("supabase.auth.getUser result:", { authData, userErr });

      const authUser = authData?.user;
      const finalUserId = authUser?.id ?? userIdFromParams;

      if (!finalUserId) {
        Alert.alert("Error", "User not authenticated. Please login again.");
        setLoading(false);
        return false;
      }

      const fullName = `${firstName.trim()} ${lastName.trim()}`;

      const row = {
        id: finalUserId,
        full_name: fullName,
        phone_number: phoneNumberFromParams || null,
        avatar_url: null, // Will be updated in step 2 if user adds photos
        user_type: "Influencer", // enum matches your DB
        is_verified: true,
        is_active: true,
        gender: selectedGender,
      };

      console.log("Attempting to upsert users row (step 1):", row);

      // 1) upsert into users
      const { data: upsertData, error: upsertError } = await supabase
        .from("users")
        .upsert(row, { onConflict: "id" })
        .select()
        .single();

      console.log("Upsert response:", { upsertData, upsertError });

      if (upsertError) {
        console.error("Upsert error:", upsertError);
        Alert.alert(
          "DB error",
          upsertError.message || JSON.stringify(upsertError)
        );
        setLoading(false);
        return false;
      }

      // 2) ensure influencer_profiles row exists for this user
      const { data: profileData, error: profileError } = await supabase
        .from("influencer_profiles")
        .upsert(
          {
            user_id: finalUserId,
            display_name: fullName,
            bio: "",
            profile_image_url: null, // we’ll update this in step 2 after photos
            price_per_message: 0,
            price_per_minute_audio: 0,
            price_per_minute_video: 0,
          },
          { onConflict: "user_id" } // unique on user_id in your schema
        )
        .select()
        .single();

      console.log("Influencer profile upsert:", { profileData, profileError });

      if (profileError) {
        console.error("Influencer profile upsert error:", profileError);
        Alert.alert(
          "DB error",
          profileError.message || JSON.stringify(profileError)
        );
        setLoading(false);
        return false;
      }

      console.log("Basic user info + influencer profile saved successfully");
      return true;
    } catch (error: any) {
      console.error("Error saving basic user info:", error);
      Alert.alert("Error", "An unexpected error occurred. Please try again.");
      setLoading(false);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const goNext = async () => {
    if (step === 0) return setStep(1);

    if (step === 1) {
      // Validate name inputs
      if (!firstName.trim()) {
        setNameError("First name is required");
        return;
      }
      if (!lastName.trim()) {
        setNameError("Last name is required");
        return;
      }
      setNameError("");

      // SAVE USER DATA TO DATABASE
      const saved = await saveBasicUserInfo();
      if (!saved) return; // Don't proceed if save failed

      // Move to photo upload step
      return setStep(2);
    }
  };

  const goBack = () => {
    if (step === 0) return router.back();
    if (step === 1) return setStep(0);
    if (step === 2) return setStep(1);
  };

  const uploadImageToSupabase = async (uri: string, index: number) => {
    try {
      const ext = uri.split(".").pop() || "jpg";
      const fileName = `${userIdFromParams}_${Date.now()}_${index}.${ext}`;

      const response = await fetch(uri);
      const blob = await response.blob();

      const { data, error } = await supabase.storage
        .from("user-photos")
        .upload(`profiles/${userIdFromParams}/${fileName}`, blob, {
          contentType: `image/${ext}`,
          upsert: false,
        });

      if (error) {
        console.error("Upload error:", error);
        return null;
      }

      // Use getPublicUrl result
      const publicObj = supabase.storage
        .from("user-photos")
        .getPublicUrl(data.path);
      console.log("getPublicUrl:", publicObj);
      return publicObj?.data?.publicUrl ?? null;
    } catch (error) {
      console.error("Error uploading image:", error);
      return null;
    }
  };

  const handleFinish = async () => {
    setLoading(true);
    try {
      // Get current user
      const { data: authData, error: userErr } = await supabase.auth.getUser();
      console.log("supabase.auth.getUser result:", { authData, userErr });

      const authUser = authData?.user;
      const finalUserId = authUser?.id ?? userIdFromParams;

      if (!finalUserId) {
        Alert.alert("Error", "User not authenticated. Please login again.");
        setLoading(false);
        return;
      }

      // Upload photos if any were selected
      const uploadedPhotos: string[] = [];
      for (const photo of photos) {
        if (photo.uri) {
          const publicUrl = await uploadImageToSupabase(photo.uri, photo.id);
          if (publicUrl) uploadedPhotos.push(publicUrl);
        }
      }

      // Update avatar_url if photos were uploaded
      if (uploadedPhotos.length > 0) {
        const avatarUrl = uploadedPhotos[0];

        // update users table
        const { error: updateUserError } = await supabase
          .from("users")
          .update({ avatar_url: avatarUrl })
          .eq("id", finalUserId);

        if (updateUserError) {
          console.error("Error updating user avatar_url:", updateUserError);
        }

        // update influencer_profiles table
        const { error: updateProfileError } = await supabase
          .from("influencer_profiles")
          .update({ profile_image_url: avatarUrl })
          .eq("user_id", finalUserId);

        if (updateProfileError) {
          console.error(
            "Error updating influencer profile image:",
            updateProfileError
          );
        }
      }

      console.log("Attempting to insert users row:", row);

      const { data: insertData, error: insertError } = await supabase
        .from("users")
        .insert(row)
        .select();

      console.log("Insert response:", { insertData, insertError });

      if (insertError) {
        console.error("Insert error:", insertError);
        Alert.alert(
          "DB error",
          insertError.message || JSON.stringify(insertError)
        );
        setLoading(false);
        return;
      }

      Alert.alert("Success", "Profile created successfully");
      console.log("Profile completed, navigating to discover");

      // Navigate to discover
      router.replace("/discover");
    } catch (error: any) {
      console.error("Error finishing profile (catch):", error);
      Alert.alert("Error", "An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = () => {
    // User data already saved in step 1, just navigate
    router.replace("/discover");
  };

  const pickImage = async (id: number) => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert(
        "Permission Required",
        "Please grant access to your photo library"
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets?.length) {
      const uri = result.assets[0].uri;
      setPhotos((p) =>
        p.map((photo) => (photo.id === id ? { ...photo, uri } : photo))
      );
    }
  };

  const removeImage = (id: number) => {
    setPhotos((p) =>
      p.map((photo) => (photo.id === id ? { ...photo, uri: null } : photo))
    );
  };

  const progressWidth = () => {
    if (step === 0) return "w-1/3";
    if (step === 1) return "w-2/3";
    return "w-full";
  };

  return (
    <View className="flex-1 bg-black px-6 py-12">
      <View className="flex-row items-center mb-8">
        <TouchableOpacity onPress={goBack} disabled={loading}>
          <ChevronLeft size={24} color="#fff" />
        </TouchableOpacity>
        <View className="flex-1 h-1 bg-gray-800 mx-4 rounded-full">
          <View
            className={`${progressWidth()} h-full bg-yellow-500 rounded-full`}
          />
        </View>
      </View>

      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        {step === 0 && (
          <View className="flex-1">
            <Text className="text-white text-3xl font-bold mb-2 text-center">
              What's Your Gender?
            </Text>
            <Text className="text-gray-400 text-base mb-8 text-center">
              Enter your gender
            </Text>

            <TouchableOpacity
              className={`rounded-2xl py-5 px-6 mb-4 ${
                selectedGender === "Woman"
                  ? "border-2 border-yellow-500 bg-gray-900"
                  : "bg-gray-900"
              }`}
              onPress={() => setSelectedGender("Woman")}
              disabled={loading}
            >
              <Text className="text-white text-lg">Woman</Text>
            </TouchableOpacity>

            <TouchableOpacity
              className={`rounded-2xl py-5 px-6 mb-4 ${
                selectedGender === "Man"
                  ? "border-2 border-yellow-500 bg-gray-900"
                  : "bg-gray-900"
              }`}
              onPress={() => setSelectedGender("Man")}
              disabled={loading}
            >
              <Text className="text-white text-lg">Man</Text>
            </TouchableOpacity>

            <TouchableOpacity
              className={`rounded-2xl py-5 px-6 mb-8 ${
                selectedGender === "Other"
                  ? "border-2 border-yellow-500 bg-gray-900"
                  : "bg-gray-900"
              }`}
              onPress={() => setSelectedGender("Other")}
              disabled={loading}
            >
              <Text className="text-white text-lg">Other</Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="bg-[#FCCD34] rounded-2xl py-4 px-8"
              onPress={goNext}
              disabled={loading}
            >
              <Text className="text-white text-center text-lg font-semibold">
                Continue
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {step === 1 && (
          <View className="flex-1">
            <Text className="text-white text-3xl font-bold mb-2 text-center">
              What's Your Name?
            </Text>
            <Text className="text-gray-400 text-base mb-8 text-center">
              Enter your first name and last name
            </Text>

            <TextInput
              className="bg-black rounded-3xl px-6 py-5 text-white text-lg mb-4 border-2 border-yellow-500"
              placeholder="First name"
              placeholderTextColor="#666"
              value={firstName}
              editable={!loading}
              onChangeText={(text) => {
                setFirstName(text);
                if (nameError) setNameError("");
              }}
            />

            <TextInput
              className="bg-black rounded-3xl px-6 py-5 text-white text-lg mb-2 border-2 border-yellow-500"
              placeholder="Last name"
              placeholderTextColor="#666"
              value={lastName}
              editable={!loading}
              onChangeText={(text) => {
                setLastName(text);
                if (nameError) setNameError("");
              }}
            />

            {nameError ? (
              <Text className="text-red-500 text-sm mb-3 ml-4">
                {nameError}
              </Text>
            ) : (
              <View className="mb-5" />
            )}

            <TouchableOpacity
              className={`rounded-2xl py-4 px-8 mb-3 ${
                loading ? "bg-gray-700" : "bg-[#FCCD34]"
              }`}
              onPress={goNext}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text className="text-white text-center text-lg font-semibold">
                  Continue
                </Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              className="bg-gray-800 rounded-2xl py-4 px-8"
              onPress={() => setStep(0)}
              disabled={loading}
            >
              <Text className="text-white text-center text-lg font-semibold">
                Back
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {step === 2 && (
          <View className="flex-1">
            <Text className="text-white text-3xl font-bold mb-2 text-center">
              Upload Your Photo
            </Text>
            <Text className="text-gray-400 text-base mb-6 text-center">
              Add photos to make your profile stand out
            </Text>

            <View className="flex-1 justify-between">
              <View className="mb-4">
                <View className="flex-row mb-3" style={{ height: 240 }}>
                  <View className="flex-[1.4] mr-3">
                    <TouchableOpacity
                      className="flex-1"
                      onPress={() => pickImage(1)}
                      disabled={loading}
                    >
                      {photos[0].uri ? (
                        <View className="relative w-full h-full">
                          <Image
                            source={{ uri: photos[0].uri! }}
                            className="w-full h-full rounded-3xl"
                            resizeMode="cover"
                          />
                          <TouchableOpacity
                            className="absolute top-2 right-2 w-8 h-8 bg-gray-900/80 rounded-full items-center justify-center"
                            onPress={() => removeImage(1)}
                            disabled={loading}
                          >
                            <X size={20} color="#fff" />
                          </TouchableOpacity>
                        </View>
                      ) : (
                        <View className="w-full h-full border-2 border-dashed border-yellow-500 rounded-3xl items-center justify-center">
                          <View className="w-16 h-16 bg-yellow-500 rounded-full items-center justify-center">
                            <Plus size={32} color="#000" strokeWidth={3} />
                          </View>
                        </View>
                      )}
                    </TouchableOpacity>
                  </View>

                  <View className="flex-1">
                    <TouchableOpacity
                      className="mb-3 flex-1"
                      onPress={() => pickImage(2)}
                      disabled={loading}
                    >
                      {photos[1].uri ? (
                        <View className="relative w-full h-full">
                          <Image
                            source={{ uri: photos[1].uri! }}
                            className="w-full h-full rounded-3xl"
                            resizeMode="cover"
                          />
                          <TouchableOpacity
                            className="absolute top-2 right-2 w-8 h-8 bg-gray-900/80 rounded-full items-center justify-center"
                            onPress={() => removeImage(2)}
                            disabled={loading}
                          >
                            <X size={20} color="#fff" />
                          </TouchableOpacity>
                        </View>
                      ) : (
                        <View className="w-full h-full border-2 border-dashed border-yellow-500 rounded-3xl items-center justify-center">
                          <View className="w-12 h-12 bg-yellow-500 rounded-full items-center justify-center">
                            <Plus size={24} color="#000" strokeWidth={3} />
                          </View>
                        </View>
                      )}
                    </TouchableOpacity>

                    <TouchableOpacity
                      className="flex-1"
                      onPress={() => pickImage(3)}
                      disabled={loading}
                    >
                      {photos[2].uri ? (
                        <View className="relative w-full h-full">
                          <Image
                            source={{ uri: photos[2].uri! }}
                            className="w-full h-full rounded-3xl"
                            resizeMode="cover"
                          />
                          <TouchableOpacity
                            className="absolute top-2 right-2 w-8 h-8 bg-gray-900/80 rounded-full items-center justify-center"
                            onPress={() => removeImage(3)}
                            disabled={loading}
                          >
                            <X size={20} color="#fff" />
                          </TouchableOpacity>
                        </View>
                      ) : (
                        <View className="w-full h-full border-2 border-dashed border-yellow-500 rounded-3xl items-center justify-center">
                          <View className="w-12 h-12 bg-yellow-500 rounded-full items-center justify-center">
                            <Plus size={24} color="#000" strokeWidth={3} />
                          </View>
                        </View>
                      )}
                    </TouchableOpacity>
                  </View>
                </View>

                <View className="flex-row" style={{ height: 115 }}>
                  {[4, 5, 6].map((index) => (
                    <TouchableOpacity
                      key={index}
                      className="flex-1 mx-1.5"
                      onPress={() => pickImage(index)}
                      disabled={loading}
                    >
                      {photos[index - 1].uri ? (
                        <View className="relative w-full h-full">
                          <Image
                            source={{ uri: photos[index - 1].uri! }}
                            className="w-full h-full rounded-3xl"
                            resizeMode="cover"
                          />
                          <TouchableOpacity
                            className="absolute top-2 right-2 w-8 h-8 bg-gray-900/80 rounded-full items-center justify-center"
                            onPress={() => removeImage(index)}
                            disabled={loading}
                          >
                            <X size={20} color="#fff" />
                          </TouchableOpacity>
                        </View>
                      ) : (
                        <View className="w-full h-full border-2 border-dashed border-yellow-500 rounded-3xl items-center justify-center">
                          <View className="w-12 h-12 bg-yellow-500 rounded-full items-center justify-center">
                            <Plus size={24} color="#000" strokeWidth={3} />
                          </View>
                        </View>
                      )}
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View>
                <TouchableOpacity
                  className={`rounded-2xl py-4 px-8 mb-4 ${
                    loading ? "bg-gray-700" : "bg-[#FCCD34]"
                  }`}
                  onPress={handleFinish}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text className="text-white text-center text-lg font-semibold">
                      Continue
                    </Text>
                  )}
                </TouchableOpacity>

                <TouchableOpacity
                  className="bg-gray-800 rounded-2xl py-4 px-8"
                  onPress={handleSkip}
                  disabled={loading}
                >
                  <Text className="text-white text-center text-lg font-semibold">
                    Skip
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
