import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../slices/Auth';
import messageReducer from '../slices/Message';


const store = configureStore({
    reducer: {
        auth: authReducer,
        message: messageReducer
    },
})

export default store;