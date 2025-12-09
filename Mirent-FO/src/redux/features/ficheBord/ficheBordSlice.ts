// store/slices/logbookSlice.ts

import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { Logbook } from "../../../types/fichebord";

interface LogbookState {
  items: Logbook[];
  loading: boolean;
  error: string | null;
}

const initialState: LogbookState = {
  items: [],
  loading: false,
  error: null,
};

// Thunks
export const fetchLogbooks = createAsyncThunk("logbook/fetchAll", async () => {
  const res = await axios.get("/api/logbook");
  return res.data;
});

export const createLogbook = createAsyncThunk(
  "logbook/create",
  async (logbook: Logbook) => {
    const res = await axios.post("/api/logbook", logbook);
    return res.data;
  }
);

const logbookSlice = createSlice({
  name: "logbook",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchLogbooks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchLogbooks.fulfilled,
        (state, action: PayloadAction<Logbook[]>) => {
          state.loading = false;
          state.items = action.payload;
        }
      )
      .addCase(fetchLogbooks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch logbooks";
      })
      .addCase(
        createLogbook.fulfilled,
        (state, action: PayloadAction<Logbook>) => {
          state.items.push(action.payload);
        }
      );
  },
});

export default logbookSlice.reducer;
