import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated, PanResponder, Dimensions, Image, FlatList } from 'react-native';
import TopBar from '../../components/topBar/TopBar';
import StorySection from '../../sections/StorySection/StorySection';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import api from '../../api/axios';
import { useDispatch, useSelector } from 'react-redux';
import { setConversations } from '../../redux/slice/chatSlice';

const drags = require('../../assets/tools/draggable.png');
const user = require('../../assets/users/person2.png');
const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const ChatScreen = () => {
    const navigation = useNavigation();
    // const [conversations, setConversations] = useState([]);
    const dispatch = useDispatch()
    const onlineUsers = useSelector((state) => state.chat.onlineUsers);
    const conversations = Object.values(useSelector((state) => state.chat.conversations));
    console.log("OnlineUsers", onlineUsers);

    const fetchConversations = async () => {
        const response = await api.get("/chat/get-conversations");
        if (response.status === 200) {
            dispatch(setConversations(response?.data?.conversations))
        }
        console.log(response.data);

    }

    useEffect(() => {
        fetchConversations();
    }, [])
    const formatUpdatedAt = (isoDate) => {
        const date = new Date(isoDate);
        const now = new Date();

        // Check if the date is today
        if (date.toDateString() === now.toDateString()) {
            // If the date is today, show time in 'h:mm AM/PM' format
            const hours = date.getHours();
            const minutes = date.getMinutes().toString().padStart(2, '0');
            const ampm = hours >= 12 ? 'PM' : 'AM';
            const formattedHours = hours % 12 || 12; // Convert 24-hour to 12-hour format
            return `${formattedHours}:${minutes} ${ampm}`;
        }

        // Check if the date is yesterday
        const yesterday = new Date(now);
        yesterday.setDate(now.getDate() - 1);
        if (date.toDateString() === yesterday.toDateString()) {
            return 'Yesterday';
        }

        // If it's neither today nor yesterday, show the date as 'MMM D, YYYY' (e.g., "Nov 5, 2024")
        const month = date.toLocaleString('default', { month: 'short' });
        const day = date.getDate();
        const year = date.getFullYear();
        return `${month} ${day}, ${year}`;
    };
    const renderItem = ({ item }) => (
        <TouchableOpacity style={styles.chatItem} onPress={() => navigation.navigate("ChatInterface", { item })}>
            <TouchableOpacity style={{ position: "relative" }}>
                <Image source={{
                    uri: item.participantImage
                }} style={styles.avatar} />
                <View style={{ position: "absolute", width: 9, height: 9, borderRadius: 50, backgroundColor: onlineUsers.includes(item?.participantId) ? "#2BEF83" : "#9A9E9C", right: 19, bottom: 3 }}></View>
            </TouchableOpacity>

            <View style={styles.chatInfo}>
                <Text style={styles.chatName}>{item.participantName}</Text>
                <Text style={styles.chatLastMessage}>{item.lastMessage}</Text>
            </View>
            <View style={{ alignContent: "center", justifyContent: "center", alignItems: "flex-end", gap: 10 }}>
                <Text style={styles.chatTimestamp}>{formatUpdatedAt(item?.updatedAt)}</Text>
                <View style={{ backgroundColor: "#F04A4C", width: 20, height: 20, borderRadius: 50, justifyContent: 'center', alignContent: "center", alignItems: "center" }}>
                    <Text style={{ color: "white", fontSize: 10 }}>{item?.unseenMessageCount}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );

    const translateY = useRef(new Animated.Value(0)).current;
    const [isChatCovered, setIsChatCovered] = useState(false);

    const panResponder = useRef(
        PanResponder.create({
            onMoveShouldSetPanResponder: (_, gestureState) => {
                return Math.abs(gestureState.dy) > 10; // Activate if there's a noticeable drag
            },
            onPanResponderMove: (_, gestureState) => {
                // Limit the translation to prevent overflowing
                if (gestureState.dy < 0 && translateY.__getValue() > -SCREEN_HEIGHT * 0.3) {
                    translateY.setValue(gestureState.dy);
                }
            },
            onPanResponderRelease: (_, gestureState) => {
                // Handle upward drag
                if (gestureState.dy < -100) {
                    // Dragging up
                    Animated.timing(translateY, {
                        toValue: -SCREEN_HEIGHT * 0.3, // Move up to cover 30% of the screen
                        duration: 300,
                        useNativeDriver: true,
                    }).start(() => setIsChatCovered(true));
                }
                // Handle downward drag
                else if (gestureState.dy > 100 && isChatCovered) {
                    // Only allow dragging down if the chat section is currently covering the story section
                    Animated.timing(translateY, {
                        toValue: 0, // Reset to original position
                        duration: 300,
                        useNativeDriver: true,
                    }).start(() => setIsChatCovered(false));
                }
                // If not dragged sufficiently, return to the closest position
                else {
                    if (isChatCovered) {
                        // Snap to covering position
                        Animated.timing(translateY, {
                            toValue: -SCREEN_HEIGHT * 0.3, // Snap to covered position
                            duration: 300,
                            useNativeDriver: true,
                        }).start();
                    } else {
                        // Return to the original position
                        Animated.timing(translateY, {
                            toValue: 0,
                            duration: 300,
                            useNativeDriver: true,
                        }).start();
                    }
                }
            },
        })
    ).current;

    return (
        <View style={styles.container}>
            <Animated.View style={[styles.storySection, { transform: [{ translateY }] }]}>
                <TopBar />
                <StorySection />
            </Animated.View>
            <Animated.View
                style={[styles.chatSection, {
                    transform: [{ translateY }],
                    height: isChatCovered ? SCREEN_HEIGHT : SCREEN_HEIGHT * 0.7
                }]}
                {...panResponder.panHandlers}
            >
                <View style={{ alignItems: "center" }}>
                    <Image source={drags} style={{ height: 5, width: 55 }} />
                </View>
                <FlatList
                    data={conversations}
                    keyExtractor={(item) => item.conversationId}
                    renderItem={renderItem}
                    contentContainerStyle={styles.chatList}
                />
            </Animated.View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
    },
    storySection: {
        height: SCREEN_HEIGHT * 0.3, // Height of the story section
        backgroundColor: 'black',
        paddingTop: 10,
        // justifyContent: 'center',
        alignItems: 'center',
    },
    chatSection: {
        backgroundColor: '#ffffff',
        padding: 20,
        borderTopLeftRadius: 40,
        borderTopRightRadius: 40,
        paddingBottom: 60
    },
    chatText: {
        fontSize: 18,
        color: '#333',
    },
    chatList: {
        paddingHorizontal: 10,
    },
    chatItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 15,
    },
    chatInfo: {
        flex: 1,
    },
    chatName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: "black"
    },
    chatLastMessage: {
        color: '#797C7B',
    },
    chatTimestamp: {
        fontSize: 12,
        color: '#888',
    },
});

export default ChatScreen;
