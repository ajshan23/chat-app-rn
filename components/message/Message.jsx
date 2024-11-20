import { Image, StyleSheet, Text, View, Dimensions } from 'react-native';
import React, { useEffect, useState, useRef } from 'react';
import { socket } from '../../App';
import { useDispatch, useSelector } from 'react-redux';
import { updateMessageSeen } from '../../redux/slice/chatSlice';

const seen = require('../../assets/tools/seen4.png');
const seen2 = require('../../assets/tools/seen6.png');

const Message = ({ sender, text, isRead, timestamp, messageId, conversationId, senderId }) => {
    const [isMessageVisible, setIsMessageVisible] = useState(false);
    const messageRef = useRef(null);  // Reference to the message component
    const screenHeight = Dimensions.get('window').height;  // Get screen height
    const dispatch = useDispatch();
    const message = useSelector((state) => state.chat.messages);

    const formatTime = (isoDate) => {
        const date = new Date(isoDate);
        const hours = date.getHours();
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const ampm = hours >= 12 ? 'PM' : 'AM';
        const formattedHours = hours % 12 || 12; // Convert 24-hour to 12-hour format
        return `${formattedHours}:${minutes} ${ampm}`;
    };

    const handleLayout = () => {
        messageRef.current.measure((x, y, width, height, pageX, pageY) => {
            // console.log("Message measurement:", { x, y, width, height, pageX, pageY });

            // Check if the message is within the visible screen height range
            if (pageY >= 0 && pageY + height <= screenHeight) {
                setIsMessageVisible(true);  // Mark the message as visible
                // console.log(`Message ${messageId} is now visible.`);
                // onVisible(messageId); // Trigger the visibility check for this message
            }
        });
    };

    useEffect(() => {
        // console.log("Message visibility:", isMessageVisible);

        if (isMessageVisible && !isRead && sender === "you") {
            console.log("Message is visible, emitting messageSeen event");

            socket.emit("messageSeen", { messageId, conversationId, senderId }, (response) => {
                if (response.status === "success") {
                    dispatch(updateMessageSeen({ messageId, conversationId }))
                    // Handle success case, e.g., update UI to show message as seen
                    console.log("Message marked as seen:", response.messageId);
                } else {
                    // Handle failure or other cases
                    console.log("Error:", response.status);
                }
            });
        }
        // console.log("message in redux:", message);

    }, [isMessageVisible]);

    return (
        <View
            ref={messageRef}
            style={{
                alignItems: sender === "me" ? "flex-end" : "flex-start",
                position: "relative",
                marginBottom: 15,
            }}
            onLayout={handleLayout}
        >
            <View
                style={{
                    backgroundColor: sender === "me" ? "#20A090" : "#F2F7FB",
                    padding: 10,
                    borderTopLeftRadius: 15,
                    borderBottomLeftRadius: 15,
                    borderBottomRightRadius: 15,
                    maxWidth: "80%",
                    marginBottom: 5,
                }}
            >
                <Text
                    style={{
                        color: sender === "me" ? "white" : "black",
                        lineHeight: 20,
                        paddingRight: sender === "me" ? 12 : 0,
                    }}
                >
                    {text}
                </Text>
                {sender === "me" && (
                    <View style={{ position: "absolute", right: 8, bottom: 4 }}>
                        <Image
                            source={isRead ? seen2 : seen}
                            style={{ width: 15, height: 15 }}
                        />
                    </View>
                )}
            </View>
            <Text style={{ color: "#797C7B" }}>{formatTime(timestamp)}</Text>
        </View>
    );
};

export default Message;

const styles = StyleSheet.create({
    container: {
        alignItems: "flex-end", // Align messages to the left for the sender
        // padding: 10, // Optional padding around the entire message container
    },
    messageBubble: {
        backgroundColor: "#20A090",
        padding: 10,
        borderTopLeftRadius: 15,
        borderBottomLeftRadius: 15,
        borderBottomRightRadius: 15,
        maxWidth: "80%", // Limit the width of the message bubble
        marginBottom: 5, // Space between messages
    },
    messageText: {
        color: "white",
        lineHeight: 20, // Adjust line height for better readability
    },
});
