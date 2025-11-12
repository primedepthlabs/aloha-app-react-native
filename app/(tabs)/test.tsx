import { useRouter } from 'expo-router'
import React from 'react'
import { Text, View } from 'react-native'

export default function test() {
    const router = useRouter()
    return (
        <View className='bg-red-500 flex-1 justify-center items-center'><Text>test</Text></View>
    )
}
