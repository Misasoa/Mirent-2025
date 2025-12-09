// src/features/sidebar/sidebarSlice.ts
import { createSlice } from "@reduxjs/toolkit";

interface SidebarState {
  isOpen: boolean;
}

const initialState: SidebarState = {
  isOpen: false,
};

const sidebarSlice = createSlice({
  name: "sidebar",
  initialState,
  reducers: {
    setSidebarOpen(state, action) {
      state.isOpen = action.payload;
    },
  },
});

export const { setSidebarOpen } = sidebarSlice.actions;
export default sidebarSlice.reducer;
