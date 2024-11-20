import React, { useRef } from "react";
import { Animated, PanResponder, StyleSheet, Text, View, Image } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

const ChatItem = ({ item, activeSwipeId, setActiveSwipeId }) => {
    const translateX = useRef(new Animated.Value(0)).current;

    const chatPanResponder = useRef(
        PanResponder.create({
            onMoveShouldSetPanResponder: (_, gestureState) => Math.abs(gestureState.dx) > 10,
            onPanResponderMove: (_, gestureState) => {
                if (gestureState.dx < 0) translateX.setValue(gestureState.dx); // Only allow left swipe
            },
            onPanResponderRelease: (_, gestureState) => {
                if (gestureState.dx < -100) {
                    // Snap to the left to show action buttons
                    Animated.timing(translateX, {
                        toValue: -100,
                        duration: 200,
                        useNativeDriver: true,
                    }).start(() => setActiveSwipeId(item.id));
                } else {
                    // Reset if swipe is less than threshold
                    Animated.timing(translateX, {
                        toValue: 0,
                        duration: 200,
                        useNativeDriver: true,
                    }).start(() => setActiveSwipeId(null));
                }
            },
        })
    ).current;

    const handleOutFocus = () => {
        if (activeSwipeId === item.id) {
            Animated.timing(translateX, {
                toValue: 0,
                duration: 200,
                useNativeDriver: true,
            }).start(() => setActiveSwipeId(null));
        }
    };

    return (
        <TouchableOpacity activeOpacity={1} onPress={handleOutFocus}>
            <View style={styles.chatItemContainer}>
                <Animated.View style={[styles.chatItem, { transform: [{ translateX }] }]} {...chatPanResponder.panHandlers}>
                    <Image source={item.avatar} style={styles.avatar} />
                    <View style={styles.chatInfo}>
                        <Text style={styles.chatName}>{item.name}</Text>
                        <Text style={styles.chatLastMessage}>{item.lastMessage}</Text>
                    </View>
                    <View style={{ alignItems: "flex-end", gap: 5 }}>
                        <Text style={styles.chatTimestamp}>{item.timestamp}</Text>
                        <View style={styles.badge}>
                            <Text style={styles.badgeText}>1</Text>
                        </View>
                    </View>
                </Animated.View>
                {activeSwipeId === item.id && (
                    <View style={styles.actionButtons}>
                        <TouchableOpacity style={styles.deleteButton}>
                            <Text style={styles.buttonText}>D</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.notifyButton}>
                            <Text style={styles.buttonText}>N</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    chatItemContainer: {
        position: "relative",
        marginBottom: 1,
    },
    chatItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 15,
        paddingHorizontal: 10,
        backgroundColor: '#ffffff',
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
    actionButtons: {
        position: 'absolute',
        right: 0,
        top: 0,
        bottom: 0,
        width: 100,
        flexDirection: 'row',
        backgroundColor: '#f8f8f8',
    },
    deleteButton: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FF3B30',
    },
    notifyButton: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#007AFF',
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    badge: {
        backgroundColor: "#F04A4C",
        width: 20,
        height: 20,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    badgeText: {
        color: "white",
        fontSize: 10,
    },
});

export default ChatItem;
