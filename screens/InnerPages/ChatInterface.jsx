import { useNavigation } from '@react-navigation/native';
import React, { useState, useRef, useEffect } from 'react';
import { View, Text, Image, TextInput, TouchableOpacity, ScrollView, StyleSheet, Dimensions, Animated } from 'react-native';
import Message from '../../components/message/Message';
import api from '../../api/axios';
import { useDispatch, useSelector } from 'react-redux';
import { addMessage, setMessages, updateLastMessage } from '../../redux/slice/chatSlice';

const leftArrow = require('../../assets/navigation/leftArrow.png');
const audioCall = require('../../assets/tools/call.png');
const videoCall = require('../../assets/tools/videocall.png');
const camera = require('../../assets/tools/camera.png');
const microphone = require('../../assets/tools/microphone.png');
const sticker = require('../../assets/tools/sticker.png');
const pin = require('../../assets/tools/pin.png');
const sent = require('../../assets/tools/sent.png');

const { width, height } = Dimensions.get('window');

export default function ChatInterface({ route }) {
    const { item } = route.params;
    const isOnline = useSelector((state) => state.chat.onlineUsers.includes(item?.participantId))
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const [inputText, setInputText] = useState('');
    const [conversationId, setConversationId] = useState(item?.conversationId ? item?.conversationId : "")
    const messages = useSelector((state) => state.chat.messages[conversationId] || []);
    const [hasMoreMessages, setHasMoreMessages] = useState(true);
    const logginedUserId = useSelector((state) => state.profile.userId);
    const scrollViewRef = useRef(null);
    const [isAtBottom, setIsAtBottom] = useState(true);
    // console.log("loggined", logginedUserId);

    // Animated values for icons
    const cameraOpacity = useRef(new Animated.Value(1)).current;
    const microphoneOpacity = useRef(new Animated.Value(1)).current;
    const sentOpacity = useRef(new Animated.Value(0)).current;
    useEffect(() => {
        if (messages.length === 0) {
            fetchMessages();
        }

    }, [])
    useEffect(() => {
        // Scroll to the bottom only if the user is already at the bottom
        scrollViewRef.current?.scrollToEnd({ animated: true });

    }, [messages, isAtBottom]);
    // Handle scroll event to check if user is at the bottom
    const handleScroll = (event) => {
        const contentHeight = event.nativeEvent.contentSize.height;
        const contentOffsetY = event.nativeEvent.contentOffset.y;
        const visibleHeight = event.nativeEvent.layoutMeasurement.height;

        // If the user is at the bottom, allow auto-scrolling
        if (contentHeight - contentOffsetY === visibleHeight) {
            setIsAtBottom(true);
        } else {
            setIsAtBottom(false);
        }
    };

    const fetchMessages = async (limit = 40) => {
        console.log("vilikuununn");

        try {
            const oldestMessage = messages[messages.length - 1];
            const untilTimestamp = oldestMessage ? oldestMessage.timestamp : null;

            const response = await api.get(
                `/chat/get-messages/${conversationId}?limit=${limit}${untilTimestamp ? `&until=${untilTimestamp}` : ''}`
            );

            if (response.status === 200) {
                const { messages: newMessages } = response.data;

                if (newMessages && Array.isArray(newMessages)) {
                    const orderedMessages = [...newMessages].reverse();
                    dispatch(setMessages({ conversationId, messages: orderedMessages }));

                    if (newMessages.length < limit) {
                        setHasMoreMessages(false);
                    }
                }
            }
        } catch (error) {
            console.error("Error fetching messages:", error);
            alert("Failed to fetch messages. Please try again.");
        }
    };
    const sendMessage = async (conversationType = "normal") => {
        let receiverId = item?.participantId;

        try {
            if (!inputText.trim()) {
                console.warn('Message content cannot be empty');
                return;
            }

            const payload = {
                messageContent: inputText,
                conversationId: conversationId || null,
                receiverId: receiverId,
                type: conversationType,
            };

            const response = await api.post('/chat/send-message', payload);

            if (response.status === 200) {
                const { message, conversationId: updatedConversationId } = response.data;
                dispatch(addMessage({ conversationId: updatedConversationId, message }));
                dispatch(updateLastMessage({ conversationId: updatedConversationId, inputText }))
                // Optionally update the conversationId if it's new
                item.conversationId = updatedConversationId;
                setInputText('');
            } else {
                console.error('Failed to send message:', response.data?.message);
            }
        } catch (error) {
            console.error('Error sending message:', error);
            alert('Failed to send message. Please try again.');
        }
    };





    useEffect(() => {
        // Animate icons based on inputText
        if (inputText) {
            // Fade out camera and microphone
            Animated.parallel([
                Animated.timing(cameraOpacity, {
                    toValue: 0,
                    duration: 200,
                    useNativeDriver: true,
                }),
                Animated.timing(microphoneOpacity, {
                    toValue: 0,
                    duration: 200,
                    useNativeDriver: true,
                }),
                // Fade in sent icon
                Animated.timing(sentOpacity, {
                    toValue: 1,
                    duration: 200,
                    useNativeDriver: true,
                }),
            ]).start();
        } else {
            // Fade in camera and microphone
            Animated.parallel([
                Animated.timing(cameraOpacity, {
                    toValue: 1,
                    duration: 200,
                    useNativeDriver: true,
                }),
                Animated.timing(microphoneOpacity, {
                    toValue: 1,
                    duration: 200,
                    useNativeDriver: true,
                }),
                // Fade out sent icon
                Animated.timing(sentOpacity, {
                    toValue: 0,
                    duration: 200,
                    useNativeDriver: true,
                }),
            ]).start();
        }
    }, [inputText]);


    return (
        <View style={styles.background}>
            {/* Header */}
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: "space-between", paddingTop: 12 }}>
                <View style={{ flexDirection: "row", flex: 1, alignItems: "center", gap: 10 }}>
                    <TouchableOpacity onPress={() => navigation?.goBack?.()} >
                        <Image
                            source={leftArrow}
                            style={{ width: 19, height: 14 }} // Set width and height here
                        />

                    </TouchableOpacity>
                    <TouchableOpacity style={{ position: "relative" }}>
                        <Image source={{ uri: item?.participantImage }} style={{ width: 50, height: 50, borderRadius: 50 }} />
                        <View style={{ position: "absolute", width: 9, height: 9, borderRadius: 50, backgroundColor: isOnline ? "#2BEF83" : "#9A9E9C", right: 3, bottom: 3 }}></View>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ flex: 1 }}>
                        <Text style={{ fontSize: 16, fontWeight: 'bold', color: "black" }}>{item?.participantName}</Text>
                        {isOnline && <Text style={{ color: '#797C7B', fontSize: 12 }}>Active now</Text>}
                    </TouchableOpacity>
                </View>
                {/* Icons for Call and Video */}
                <View style={{ flexDirection: "row", gap: 10, justifyContent: "center", alignContent: "center", alignItems: "center" }}>
                    <TouchableOpacity>
                        <Image
                            source={audioCall}
                            style={{ width: 22, height: 21 }} // Set width and height here
                        />
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <Image
                            source={videoCall}
                            style={{ width: 25, height: 17 }} // Set width and height here
                        />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Chat Area */}
            <ScrollView ref={scrollViewRef}
                style={{ paddingVertical: 18 }}
                showsVerticalScrollIndicator={false}
                onScroll={handleScroll}
                scrollEventThrottle={16}   >

                {/* Date Divider */}
                {
                    messages && messages.map((message, index) => {
                        return <Message key={index} sender={logginedUserId === message?.senderId ? "me" : "you"} text={message?.content} isSeen={message?.isRead} timestamp={message?.timestamp} messageId={message?.messageId} />
                    })
                }
            </ScrollView>

            {/* Message Input */}
            <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 8, backgroundColor: "white", justifyContent: "space-between", gap: 15 }}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 15, flex: 1 }}>
                    <TouchableOpacity>
                        <Image
                            source={pin}
                            style={{ width: 19, height: 22 }} // Set width and height here
                        />
                    </TouchableOpacity>
                    <TextInput
                        placeholder="Write your message"
                        placeholderTextColor="#797C7B"
                        style={{ flex: 1, backgroundColor: '#F3F6F6', borderRadius: 15, color: "black", paddingHorizontal: 10 }}
                        value={inputText}
                        onChangeText={text => setInputText(text)}
                    />
                </View>
                <View>
                    {!inputText ? (
                        <View style={{ flexDirection: "row", gap: 15 }}>
                            <Animated.View style={{ opacity: cameraOpacity }}>
                                <TouchableOpacity>
                                    <Image
                                        source={camera}
                                        style={{ width: 23, height: 21 }} // Set width and height here
                                    />
                                </TouchableOpacity>
                            </Animated.View>
                            <Animated.View style={{ opacity: microphoneOpacity }}>
                                <TouchableOpacity>
                                    <Image
                                        source={microphone}
                                        style={{ width: 15, height: 21 }} // Set width and height here
                                    />
                                </TouchableOpacity>
                            </Animated.View>
                        </View>
                    ) : (
                        <Animated.View style={{ opacity: sentOpacity }}>
                            <TouchableOpacity style={{ width: 50, height: 50, borderRadius: 50, justifyContent: "center", backgroundColor: "#20A090", alignItems: "center" }} onPress={() => sendMessage()}>
                                <Image
                                    source={sent}
                                    style={{ width: 20, height: 30 }} // Set width and height here
                                />
                            </TouchableOpacity>
                        </Animated.View>
                    )}
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    background: {
        paddingHorizontal: 27,
        paddingVertical: 5,
        flex: 1,
        justifyContent: 'space-between',
        backgroundColor: 'white',
        width: width,
        height: height,
        position: "relative"
    },
});
