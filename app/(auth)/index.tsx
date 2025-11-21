// app/index.tsx - Onboarding Screen (with auth-check)
import 'react-native-url-polyfill/auto';
import React, { useEffect, useRef, useState } from "react";
import { View, Text, TouchableOpacity, Image, ActivityIndicator } from "react-native";
import { router } from "expo-router";
import { useFonts } from "expo-font";
import Svg, { Path } from "react-native-svg";
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function OnboardingScreen() {
  const [fontsLoaded] = useFonts({
    "Raleway-Black": require("../../assets/fonts/Raleway-Black.ttf"),
    "Inter-Regular": require("../../assets/fonts/Inter-Regular.ttf"),
  });

  const [checkingAuth, setCheckingAuth] = useState(true);
  const didNavigateRef = useRef(false);

  useEffect(() => {
    // Only run after fonts are loaded to avoid visual flicker
    if (!fontsLoaded) return;
    if (didNavigateRef.current) return;

    let mounted = true;

    const checkAuth = async () => {
      try {
        const raw = await AsyncStorage.getItem('@app:user_session');
        if (!mounted) return;

        let parsed: any = null;
        try {
          parsed = raw ? JSON.parse(raw) : null;
        } catch (e) {
          console.warn('Failed to parse stored session; clearing it.', e);
          await AsyncStorage.removeItem('@app:user_session');
          parsed = null;
        }

        const hasUser = !!parsed?.user;
        const hasToken = !!parsed?.access_token || !!parsed?.refresh_token;

        if (hasUser || hasToken) {
          // mark we've navigated to prevent loops
          didNavigateRef.current = true;
          // tiny delay to let navigation system settle and avoid race conditions
          // await new Promise((r) => setTimeout(r, 30));
          router.replace('/(tabs)/discover');
          return;
        }
      } catch (err) {
        console.error('Onboarding auth check error:', err);
        // On error, we intentionally fall through to show onboarding
      } finally {
        if (mounted) setCheckingAuth(false);
      }
    };

    checkAuth();

    return () => {
      mounted = false;
    };
  }, [fontsLoaded]);

  // While fonts or auth-check are pending show nothing or a loader to avoid flicker
  if (!fontsLoaded || checkingAuth) {
    return (
      <View className="flex-1 bg-black px-6 justify-center items-center">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-black px-6 justify-between pt-20 pb-12">
      {/* Profile Images - Using home.png which contains the complete design */}
      <View className="flex-[1.2] justify-center items-center">
        <Image
          source={require("../../assets/images/home.png")}
          className="w-full h-full"
          resizeMode="contain"
        />
      </View>

      {/* Bottom Content */}
      <View className="flex-[0.8] justify-center">
        <Text
          className="text-yellow-400 text-5xl text-center mb-6"
          style={{ fontFamily: "Raleway-Black" }}
        >
          Welcome To{"\n"}Aloha
        </Text>
        <Text
          className="text-white text-center text-base px-4 mb-12"
          style={{ fontFamily: "Inter-Regular" }}
        >
          Say hi, share moments, and make{"\n"}every chat special
        </Text>

        {/* Get Started Button */}
        <View className="px-4">
          <TouchableOpacity
            className="bg-yellow-500 rounded-2xl py-3 px-6 flex-row justify-between items-center"
            onPress={() => router.push("/login")}
            activeOpacity={0.8}
          >
            <View className="flex-1" />
            <Text className="text-white text-lg font-semibold">
              Get started
            </Text>
            <View className="flex-1 items-end">
              <View className="w-10 h-10 bg-white/20 rounded-full justify-center items-center border-2 border-white/30">
                <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <Path
                    d="M9 5L16 12L9 19"
                    stroke="#fff"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </Svg>
              </View>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
