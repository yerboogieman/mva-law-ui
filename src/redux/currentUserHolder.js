import {createSlice} from "@reduxjs/toolkit";

export const currentUserSlice = createSlice({
    name: "currentUserHolder",
    initialState: {
        currentUser: {},
        roles: []
    },
    reducers: {
        setCurrentUser: (state, action) => {
            state.currentUser = action.payload;
        },
        setRoles: (state, action) => {
            state.roles = action.payload;
        }
    }
});

export const {
    setCurrentUser,
    setRoles
} = currentUserSlice.actions;

export default currentUserSlice.reducer;