import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useColorScheme } from "react-native";
import { Image } from "react-native";

export const unstable_settings = {
  initialRouteName: "discover",
};

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      initialRouteName="discover/index"
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        tabBarStyle: {
          backgroundColor: "#111", // dark tab bar background
          borderTopWidth: 0,

          height: 70,
          borderRadius: 30,
          marginHorizontal: 20,
          marginBottom: 10,
          position: "absolute",
          overflow: "hidden",
          elevation: 5, // for Android shadow
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 5 },
          shadowOpacity: 0.2,
          shadowRadius: 10,
        },
        tabBarActiveTintColor: "#FACC15", // yellow active icon/text
        tabBarInactiveTintColor: "#888", // grey inactive icons
      }}
    >
      {/* Discover tab */}
      <Tabs.Screen
        name="discover/index"
        options={{
          title: "Discover",
          tabBarIcon: ({ color }) => (
            <Ionicons name="location" size={22} color={color} />
          ),
        }}
      />

      {/* Chats tab */}
      <Tabs.Screen
        name="chats/index"
        options={{
          title: "Chats",
          tabBarIcon: ({ color }) => (
            <Ionicons
              name="chatbubble-ellipses-outline"
              size={22}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="dashboard/index"
        options={{
          title: "Dashboard",
          tabBarIcon: ({ color, focused }) => (
            <Image
              source={
                focused
                  ? require("../../assets/images/dashboard/dashboardicon.png")
                  : require("../../assets/images/dashboard/dashboard.png")
              }
              style={{
                width: 19,
                height: 19,
                tintColor: color, // allows dynamic tab color (active/inactive)
                resizeMode: "contain",
              }}
            />
          ),
        }}
      />

      {/* Profile tab */}
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => (
            <Ionicons name="person-outline" size={22} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="discover/addCard"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="discover/donation"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="discover/report"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="chats/chatExclusive"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="chats/chat"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="dashboard/Earnings"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="dashboard/withdrawl"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="dashboard/PaidMessages"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="dashboard/videocalls"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="dashboard/donation"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="dashboard/addbank"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="dashboard/payout"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="dashboard/blocked"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="dashboard/profilevisibility"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="dashboard/support"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="dashboard/photo"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="dashboard/welcome-dashboard"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="dashboard/about"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="dashboard/premium-calls"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="dashboard/messages"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="dashboard/fan-donation"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="dashboard/iban"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="dashboard/identity"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="dashboard/identity-select"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="dashboard/document"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="dashboard/followers"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}
// import { Tabs } from "expo-router";
// import { Image } from "react-native";
// import { useColorScheme } from "react-native";

// export const unstable_settings = {
//   initialRouteName: "discover",
// };

// export default function TabLayout() {
//   const colorScheme = useColorScheme();

//   return (
//     <Tabs
//       initialRouteName="discover"
//       screenOptions={{
//         headerShown: false,
//         tabBarShowLabel: false,
//         tabBarStyle: {
//           backgroundColor: "#1A1A1A", // slightly lighter black for depth
//           borderTopWidth: 0,
//           height: 64,
//           borderRadius: 30, // rounded corners like in the first image
//           marginHorizontal: 26,
//           marginBottom: 34,
//           position: "absolute",
//           left: 0,
//           right: 0,
//           overflow: "hidden",
//           elevation: 5,
//           shadowColor: "#000",
//           shadowOffset: { width: 0, height: 5 },
//           shadowOpacity: 0.3,
//           shadowRadius: 10,
//           paddingHorizontal: 20,
//         },
//         tabBarItemStyle: {
//           paddingVertical: 8,
//         },
//       }}
//     >
//       {/* Discover tab */}
//       <Tabs.Screen
//         name="discover/index"
//         options={{
//           title: "Discover",
//           tabBarIcon: ({ focused }) => (
//             <Image
//               source={require("../../assets/images/discover-bottom.png")}
//               style={{
//                 width: 40,
//                 height: 40,
//                 tintColor: focused ? "#FACC15" : "#808080", // yellow when active, gray when inactive
//               }}
//               resizeMode="contain"
//             />
//           ),
//         }}
//       />

//       {/* Chats tab */}
//       <Tabs.Screen
//         name="chats/index"
//         options={{
//           title: "Chats",
//           tabBarIcon: ({ focused }) => (
//             <Image
//               source={require("../../assets/images/chat-bottom.png")}
//               style={{
//                 width: 40,
//                 height: 40,
//                 tintColor: focused ? "#FACC15" : "#808080",
//               }}
//               resizeMode="contain"
//             />
//           ),
//         }}
//       />

//       {/* Profile tab */}
//       <Tabs.Screen
//         name="profile"
//         options={{
//           title: "Profile",
//           tabBarIcon: ({ focused }) => (
//             <Image
//               source={require("../../assets/images/profile-bottom.png")}
//               style={{
//                 width: 40,
//                 height: 40,
//                 tintColor: focused ? "#FACC15" : "#808080",
//               }}
//               resizeMode="contain"
//             />
//           ),
//         }}
//       />

//       <Tabs.Screen
//         name="discover/addCard"
//         options={{
//           href: null,
//         }}
//       />
//       <Tabs.Screen
//         name="discover/donation"
//         options={{
//           href: null,
//         }}
//       />
//       <Tabs.Screen
//         name="discover/report"
//         options={{
//           href: null,
//         }}
//       />
//       <Tabs.Screen
//         name="chats/chatExclusive"
//         options={{
//           href: null,
//         }}
//       />
//     </Tabs>
//   );
// }
