import { router } from 'expo-router'
import React from 'react'
import { Text, TouchableOpacity } from 'react-native'
import { View } from 'react-native'

export default function AllRoutes() {
    return (
        <View style={{ flex: 1, justifyContent: "center", alignContent: "center", alignItems: "center" }}>
            <TouchableOpacity onPress={() => router.push("/auth/login")}>
                <Text>Login</Text>
            </TouchableOpacity>
        </View>
    )
}
