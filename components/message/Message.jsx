import { Image, StyleSheet, Text, View } from 'react-native';
import React from 'react';
const seen = require('../../assets/tools/seen4.png');
const seen2 = require('../../assets/tools/seen6.png');

const Message = ({ sender, text, isSeen, timestamp, messageId }) => {
    const formatTime = (isoDate) => {
        const date = new Date(isoDate);
        const hours = date.getHours();
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const ampm = hours >= 12 ? 'PM' : 'AM';
        const formattedHours = hours % 12 || 12; // Convert 24-hour to 12-hour format
        return `${formattedHours}:${minutes} ${ampm}`;
    };
    return (
        <View style={{ alignItems: sender === "me" ? "flex-end" : "flex-start", position: "relative",marginBottom:15 }}>
            <View style={{ backgroundColor: sender === "me" ? '#20A090' : "#F2F7FB", padding: 10, borderTopLeftRadius: 15, borderBottomLeftRadius: 15, borderBottomRightRadius: 15, maxWidth: '80%', marginBottom: 5, }}>
                <Text style={{ color: sender === "me" ? 'white' : "black", lineHeight: 20, paddingRight: sender === "me" ? 12 : 0 }}>
                    {text}
                </Text>
                {sender === "me" && <View style={{ position: "absolute", right: 8, bottom: 4 }}>
                    <Image source={isSeen ? seen2 : seen} style={{ width: 15, height: 15 }} />
                </View>}
            </View>
            <Text style={{ color: "#797C7B" }}>{formatTime(timestamp)}</Text>
        </View>
    );
};

export default Message;

const styles = StyleSheet.create({
    container: {
        alignItems: 'flex-end', // Align messages to the left for the sender
        // padding: 10, // Optional padding around the entire message container
    },
    messageBubble: {
        backgroundColor: '#20A090',
        padding: 10,
        borderTopLeftRadius: 15,
        borderBottomLeftRadius: 15,
        borderBottomRightRadius: 15,
        maxWidth: '80%', // Limit the width of the message bubble
        marginBottom: 5, // Space between messages
    },
    messageText: {
        color: 'white',
        lineHeight: 20, // Adjust line height for better readability
    },
});
