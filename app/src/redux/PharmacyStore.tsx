import { configureStore } from '@reduxjs/toolkit';
import drugsReducer from './features/drugs/drugsSlice';

export default configureStore({
    reducer: {
      drugs: drugsReducer
    }
});