import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { Reservation } from "../reservation/reservationSlice";
import { API_BASE_URL } from "../../../config";

// Interface pour l'entité BonDeCommande
interface BonDeCommande {
  id: number;
  reference: string;
  reservation: Reservation;
  created_at: string;
  paiements?: { id: number }[];
}

// État initial du slice
interface BonDeCommandeState {
  bonsDeCommande: BonDeCommande[];
  selectedBonDeCommande: BonDeCommande | null;
  loading: boolean;
  error: string | null;
}

const initialState: BonDeCommandeState = {
  bonsDeCommande: [],
  selectedBonDeCommande: null,
  loading: false,
  error: null,
};

// Base URL de l' API
const API_URL = `${API_BASE_URL}/commande`;

// Thunk pour récupérer tous les bons de commande
export const fetchAllBonsDeCommande = createAsyncThunk(
  "bonDeCommande/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get<BonDeCommande[]>(API_URL);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message ||
        "Erreur lors de la récupération des bons de commande"
      );
    }
  }
);

// Thunk pour récupérer un bon de commande par ID
export const fetchBonDeCommandeById = createAsyncThunk(
  "bonDeCommande/fetchById",
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await axios.get<BonDeCommande>(`${API_URL}/${id}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message ||
        `Bon de commande avec ID ${id} non trouvé`
      );
    }
  }
);

// Thunk pour supprimer un bon de commande
export const deleteBonDeCommande = createAsyncThunk(
  "bonDeCommande/delete",
  async (id: number, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      return id;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message ||
        `Erreur lors de la suppression du bon de commande ${id}`
      );
    }
  }
);

// Création du slice
const bonDeCommandeSlice = createSlice({
  name: "bonDeCommande",
  initialState,
  reducers: {
    // Réinitialiser l'erreur
    clearError(state) {
      state.error = null;
    },
    // Réinitialiser le bon de commande sélectionné
    clearSelectedBonDeCommande(state) {
      state.selectedBonDeCommande = null;
    },
  },
  extraReducers: (builder) => {
    // fetchAllBonsDeCommande
    builder
      .addCase(fetchAllBonsDeCommande.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchAllBonsDeCommande.fulfilled,
        (state, action: PayloadAction<BonDeCommande[]>) => {
          state.loading = false;
          state.bonsDeCommande = action.payload;
        }
      )
      .addCase(fetchAllBonsDeCommande.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // fetchBonDeCommandeById
    builder
      .addCase(fetchBonDeCommandeById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchBonDeCommandeById.fulfilled,
        (state, action: PayloadAction<BonDeCommande>) => {
          state.loading = false;
          state.selectedBonDeCommande = action.payload;
        }
      )
      .addCase(fetchBonDeCommandeById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // deleteBonDeCommande
    builder
      .addCase(deleteBonDeCommande.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        deleteBonDeCommande.fulfilled,
        (state, action: PayloadAction<number>) => {
          state.loading = false;
          state.bonsDeCommande = state.bonsDeCommande.filter(
            (bdc) => bdc.id !== action.payload
          );
          if (state.selectedBonDeCommande?.id === action.payload) {
            state.selectedBonDeCommande = null;
          }
        }
      )
      .addCase(deleteBonDeCommande.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, clearSelectedBonDeCommande } =
  bonDeCommandeSlice.actions;
export default bonDeCommandeSlice.reducer;
