// features/auth/authSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = { profilePic: "", userName: "", bio: "", email: "", userId: "" };

const profileSlice = createSlice({
    name: 'profile',
    initialState,
    reducers: {
        setUSer: (state, action) => {
            state.profilePic = action.payload.profilePic;
            state.userName = action.payload.userName;
            state.bio = action.payload.bio;
            state.email = action.payload.email;
            state.userId = action.payload.userId;
        },
        updateProfilePic: (state, action) => {
            state.profilePic = action.payload;
        },
        updateBioAndUserName: (state, action) => {
            state.bio = action.payload.bio;
            state.userName = action.payload.userName;
        }
    },
});

export const { setUSer, updateProfilePic, updateBioAndUserName } = profileSlice.actions;
export default profileSlice.reducer;
