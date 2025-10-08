// frontend/src/redux/store.js
import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./userSlice";
import ownerSlice from "./ownerSlice";
import mapSlice from "./mapSlice";
import socketMiddleware from "./socketMiddleware"; // Import the middleware

export const store = configureStore({
    reducer: {
        user: userSlice,
        owner: ownerSlice,
        map: mapSlice
    },
    // Add the middleware to the store
    middleware: (getDefaultMiddleware) => 
      getDefaultMiddleware().concat(socketMiddleware)
});
