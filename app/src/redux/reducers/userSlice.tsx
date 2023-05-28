// userSlice.ts

import { createSlice } from '@reduxjs/toolkit';

interface UserState {
  is_patient: boolean;
  // Other user-related state properties...
}

const initialState: UserState = {
  is_patient: false,
  // Other initial state values...
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserStatus: (state, action) => {
      state.is_patient = action.payload;
    },
    // Other user-related reducers...
  },
});

export const { setUserStatus } = userSlice.actions;

export default userSlice.reducer;
