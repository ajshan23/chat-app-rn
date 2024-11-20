// store/store.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slice/authSlice';
import profileReducer from "./slice/profileSlice";
import chatReducer from "./slice/chatSlice";
// Configure the store with a single reducer
const store = configureStore({
    reducer: {
        auth: authReducer, // Add the auth reducer here
        profile: profileReducer,
        chat: chatReducer
    },
});

// No need for TypeScript types in JavaScript
export default store;
