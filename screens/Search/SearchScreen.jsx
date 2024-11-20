import { Dimensions, Image, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import { ScrollView, TextInput, TouchableOpacity } from 'react-native-gesture-handler';
import Single from '../../components/search/Single';
const { width, height } = Dimensions.get('window');
const search = require('../../assets/tools/searchblack.png');
const cross = require('../../assets/tools/cross.png');

const SearchScreen = () => {
    const [searchTerm, setSearchTerm] = useState("")
    return (
        <View style={styles.background}>
            <View style={{ backgroundColor: "#F3F6F6", height: 45, marginVertical: 20, borderRadius: 10, justifyContent: "center", flexDirection: "row", alignItems: "center", gap: 6, paddingHorizontal: 10 }}>
                <TouchableOpacity>
                    <Image
                        source={search}
                        style={{ width: 24, height: 22 }} // Set width and height here
                    />
                </TouchableOpacity>
                <TextInput value={searchTerm} onChangeText={setSearchTerm} style={{ flex: 1, color: "black" }} />
                {searchTerm && <TouchableOpacity onPress={() => setSearchTerm("")}>
                    <Image
                        source={cross}
                        style={{ width: 15, height: 14 }} // Set width and height here
                    />
                </TouchableOpacity>}
            </View>
            <ScrollView style={{}} showsVerticalScrollIndicator={false}  >
                <Single />
                <Single />
                <Single />
                <Single />
                <Single />
                <Single />
                <Single />
                <Single />
                <Single />
                <Single />
                <Single />
                <Single />
                <Single />
                <Single />
                <Single />
                <Single />
                <Single />
            </ScrollView>
        </View>
    )
}

export default SearchScreen

const styles = StyleSheet.create({
    background: {
        padding: 30,
        flex: 1,
        justifyContent: 'space-between',
        backgroundColor: 'white',
        width: width,
        height: height,
        position: "relative"
    },
})