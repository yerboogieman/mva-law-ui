import { configureStore } from "@reduxjs/toolkit";
import currentUserReducer from "./currentUserHolder";

export default configureStore({
    reducer: {
        currentUserHolder: currentUserReducer
    }
});