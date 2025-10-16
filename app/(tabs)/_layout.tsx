// import FontAwesome from "@expo/vector-icons/FontAwesome";
// import { Link, Tabs } from "expo-router";
// import { Pressable, useColorScheme } from "react-native";

// import Colors from "../../utils/colors";

// /**
//  * You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
//  */
// function TabBarIcon(props: {
//   name: React.ComponentProps<typeof FontAwesome>["name"];
//   color: string;
// }) {
//   return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
// }

// export default function TabLayout() {
//   const colorScheme = useColorScheme();

//   return (
//     <Tabs
//       screenOptions={{
//         tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
//         tabBarStyle: { display: "none" }, // Hide the tab bar
//         headerShown: false, // Hide the header
//       }}
//     >
//       <Tabs.Screen
//         name="index"
//         options={{
//           title: "Template App",
//           tabBarIcon: ({ color }) => <TabBarIcon name="code" color={color} />,
//         }}
//       />
//     </Tabs>
//   );
// }
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Tabs } from "expo-router";
import { useColorScheme } from "react-native";
import Colors from "../../utils/colors";

function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>["name"];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

// Ensure expo-router will try to open "discover" first inside this group
export const unstable_settings = {
  initialRouteName: "discover",
};

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      // also pass initialRouteName here to be explicit
      initialRouteName="discover"
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        tabBarStyle: { display: "none" }, // hide tab bar if you want
        headerShown: false,
      }}
    >
      {/* Explicitly declare the discover screen */}
      <Tabs.Screen
        name="discover"
        options={{
          title: "Discover",
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="compass" color={color} />
          ),
        }}
      />

      {/* Keep index if you still need it, but it won't be the initial */}
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
        }}
      />
    </Tabs>
  );
}
