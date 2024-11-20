
import { Image, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useSelector } from 'react-redux';
const user = require('../../assets/users/usersample.png');
const plus = require('../../assets/tools/plus.png');
const OwnerStory = () => {
    const profilePic = useSelector((state) => state.profile.profilePic);


    return (
        <View style={{ alignItems: "center", gap: 8, }}>
            <View style={{ borderRadius: 50, borderColor: "#FFFFFF", borderWidth: 3, padding: 1, position: "relative" }}>
                <View style={{ borderRadius: 50, borderColor: "black", borderWidth: 3, padding: 1 }}>
                    {!profilePic ? <Image source={user} style={{ width: 50, height: 50 }} />
                        : <Image source={{ uri: profilePic }} style={{ width: 50, height: 50, borderRadius: 50 }} />}
                </View>
                <View style={{ backgroundColor: "white", borderRadius: 50, borderColor: "black", borderWidth: 3, padding: 3, position: "absolute", right: -4, bottom: -4 }}>
                    <Image source={plus} style={{ width: 15, height: 15 }} />
                </View>
            </View>

            <Text style={{ color: "white", fontWeight: "600" }}>My status</Text>
        </View>
    )
}

export default OwnerStory;

const styles = StyleSheet.create({})