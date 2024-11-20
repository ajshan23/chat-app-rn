import { Image, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native';
import { TouchableOpacity } from 'react-native-gesture-handler';
const user = require('../../assets/users/person2.png');
const SingleStory = () => {
    const navigation = useNavigation()
    return (
        <TouchableOpacity style={{ alignItems: "center", gap: 8 }} onPress={() => navigation.navigate("test")}>
            <View style={{ borderRadius: 50, borderColor: "#FFC746", borderWidth: 3, padding: 1 }}>
                <View style={{ borderRadius: 50, borderColor: "black", borderWidth: 3, padding: 1 }}>
                    <Image source={user} style={{ width: 50, height: 50 }} />
                </View>
            </View>
            <Text style={{ color: "white", fontWeight: "600" }}>Appu</Text>
        </TouchableOpacity>
    )
}

export default SingleStory;

const styles = StyleSheet.create({})