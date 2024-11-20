import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
const user = require('../../assets/users/person2.png');
const Single = () => {

    return (
        <TouchableOpacity style={{ flexDirection: "row", gap: 14, alignItems: "center", marginBottom: 18 }}>
            <Image source={user} style={{ width: 53, height: 53, borderRadius: 50 }} />
            <View style={{ gap: 3 }}>
                <Text style={{ fontSize: 18, fontWeight: '500', color: "black" }}>Gokul Pv appu</Text>
                <Text style={{ color: "#797C7B", fontSize: 12 }}>Be your own hero</Text>
            </View>
        </TouchableOpacity>
    )
}

export default Single

const styles = StyleSheet.create({})