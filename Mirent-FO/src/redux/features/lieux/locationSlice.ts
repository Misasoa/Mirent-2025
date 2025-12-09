import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { API_BASE_URL } from "../../../config";

export interface Prix {
  prix: number;
}

export interface Region {
  id: number;
  nom_region: string;
  nom_district?: string;
  prix?: Prix;
}

interface RegionState {
  regions: Region[];
  loading: boolean;
  error: string | null;
}

const initialState: RegionState = {
  regions: [],
  loading: false,
  error: null,
};

// 🔹 Récupérer toutes les régions
export const fetchRegions = createAsyncThunk<Region[]>(
  "region/fetchRegions",
  async (_, thunkAPI) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/regions`);
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Erreur lors du fetch"
      );
    }
  }
);

// 🔹 Ajouter une région
export const addRegion = createAsyncThunk<Region, Omit<Region, "id">>(
  "region/addRegion",
  async (newRegion, thunkAPI) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/regions`,
        newRegion
      );
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Erreur lors de l'ajout"
      );
    }
  }
);

// 🔹 Mettre à jour une région
export const updateRegion = createAsyncThunk<
  Region,
  { id: number; data: Partial<Region> }
>("region/updateRegion", async ({ id, data }, thunkAPI) => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/regions/${id}`,
      data
    );
    return response.data;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(
      error.response?.data?.message || "Erreur lors de la mise à jour"
    );
  }
});

// 🔹 Supprimer une région
export const deleteRegion = createAsyncThunk<number, number>(
  "region/deleteRegion",
  async (id, thunkAPI) => {
    try {
      await axios.delete(`${API_BASE_URL}/regions/${id}`);
      return id;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Erreur lors de la suppression"
      );
    }
  }
);

const regionSlice = createSlice({
  name: "region",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // FETCH
    builder.addCase(fetchRegions.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(
      fetchRegions.fulfilled,
      (state, action: PayloadAction<Region[]>) => {
        state.loading = false;
        state.regions = action.payload;
      }
    );
    builder.addCase(fetchRegions.rejected, (state, action: any) => {
      state.loading = false;
      state.error = action.payload;
    });

    // ADD
    builder.addCase(
      addRegion.fulfilled,
      (state, action: PayloadAction<Region>) => {
        state.regions.push(action.payload);
      }
    );

    // UPDATE
    builder.addCase(
      updateRegion.fulfilled,
      (state, action: PayloadAction<Region>) => {
        const index = state.regions.findIndex(
          (r) => r.id === action.payload.id
        );
        if (index !== -1) {
          state.regions[index] = action.payload;
        }
      }
    );

    // DELETE
    builder.addCase(
      deleteRegion.fulfilled,
      (state, action: PayloadAction<number>) => {
        state.regions = state.regions.filter((r) => r.id !== action.payload);
      }
    );
  },
});

export default regionSlice.reducer;
