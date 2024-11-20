import { createSlice } from '@reduxjs/toolkit';

const chatSlice = createSlice({
    name: 'chat',
    initialState: {
        conversations: {},
        messages: {},
        onlineUsers: [],
        typingUsers: []
    },
    reducers: {
        setConversations(state, action) {
            const conversationsArray = action.payload;

            // Iterate through the array and ensure conversations are stored as an object keyed by `conversationId`
            conversationsArray.forEach((convo) => {
                state.conversations[convo.conversationId] = convo;
            });
        },
        setMessages(state, action) {
            const { conversationId, messages } = action.payload;
            state.messages[conversationId] = messages;
        },
        addMessage(state, action) {
            const { conversationId, message, participantId, participantName, participantImage } = action.payload;
            console.log("action payload", message);

            // Initialize messages array for the conversation if it doesn't exist
            if (!state.messages[conversationId]) {
                state.messages[conversationId] = [];
            }

            // Add the new message to the messages array
            state.messages[conversationId].push(message);

            // If the conversation does not exist, create a new one
            if (!state.conversations[conversationId]) {
                state.conversations[conversationId] = {
                    conversationId,
                    participantId,
                    participantName,
                    participantImage,
                    lastMessage: message.content,
                    updatedAt: new Date().toISOString(),
                };
            } else {
                // If the conversation exists, update the last message and timestamp
                state.conversations[conversationId] = {
                    ...state.conversations[conversationId],
                    lastMessage: message.content,
                    updatedAt: new Date().toISOString(),
                };
            }
        },
        updateLastMessage(state, action) {
            const { conversationId, lastMessage } = action.payload;
            if (state.conversations[conversationId]) {
                state.conversations[conversationId].lastMessage = lastMessage;
                state.conversations[conversationId].updatedAt = new Date().toISOString();
            }
        },
        setOnlineUsers(state, action) {
            console.log("online users set cheyyan monw");

            state.onlineUsers = action.payload;
        },
        setTypingUser(state, action) {
            console.log("ibde");
            // Add the user to the typingUsers list if they aren't already in the list
            const { userId } = action.payload;
            if (!state.typingUsers.includes(userId)) {
                state.typingUsers.push(userId);
            }
            console.log("state.typingUsers:", state.typingUsers);
        },
        removeTypingUser(state, action) {
            const { userId } = action.payload;
            state.typingUsers = state.typingUsers.filter((id) => id !== userId);
        },
        updateMessageSeen(state, action) {
            const { messageId, conversationId } = action.payload;
            const messages = state.messages[conversationId];
            console.log("if messagen munne");

            if (messages) {
                const messageIndex = messages.findIndex(msg => msg.messageId === messageId);
                console.log("message index kittuo noka,", messageIndex, "::", typeof messageId);

                if (messageIndex !== -1) {
                    console.log("ivde if nte ullil");

                    // Mark the message as seen
                    messages[messageIndex].isRead = true;

                    // Optionally, update unseen count
                    if (state.conversations[conversationId]) {
                        console.log("njan state ullil keri in updatetion of unseenCount");

                        state.conversations[conversationId].unseenMessageCount = Math.max(0, state.conversations[conversationId].unseenMessageCount - 1);
                    }
                }
            }
        }
    },
});

// Change `setTypingUsers` to `setTypingUser` (or vice versa to match your preference)
export const { setConversations, setMessages, addMessage, updateLastMessage, setOnlineUsers, setTypingUser, removeTypingUser, updateMessageSeen } = chatSlice.actions;

export default chatSlice.reducer;
