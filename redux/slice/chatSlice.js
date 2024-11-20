import { createSlice } from '@reduxjs/toolkit';

const chatSlice = createSlice({
    name: 'chat',
    initialState: {
        conversations: {},
        messages: {},
        onlineUsers: [],
    },
    reducers: {
        setConversations(state, action) {
            const { conversations } = action.payload;
            state.conversations = conversations;
        },
        setMessages(state, action) {
            const { conversationId, messages } = action.payload;
            state.messages[conversationId] = messages;
        },
        addMessage(state, action) {
            const { conversationId, message, participantId, participantName, participantImage } = action.payload;

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
            state.onlineUsers = action.payload;
        }
    },
});

export const { setConversations, setMessages, addMessage, updateLastMessage, setOnlineUsers } = chatSlice.actions;
export default chatSlice.reducer;
