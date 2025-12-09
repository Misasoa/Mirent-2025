import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { API_BASE_URL } from "../../../config";

// Types pour les données de facturation
interface Client {
  id: number;
  nom: string;
  prenom: string;
  email: string;
}

interface Vehicule {
  id: number;
  marque: string;
  modele: string;
}

interface Region {
  id: number;
  nom: string;
}

interface Reservation {
  id: number;
  reference: string;
  client: Client;
  vehicule: Vehicule;
  location: Region;
  pickup_date: string;
  return_date: string;
  unit_price: number;
  total_price: number;
  nombreJours: number;
}

interface Paiement {
  id: number;
  montant: number;
  methode: string;
  reference_transaction: string;
  date_paiement: string;
}

interface BonDeCommande {
  id: number;
  reference: string;
  created_at: string;
  reservation: Reservation;
  paiements: Paiement[];
}

interface Facture {
  id: number;
  numero: string;
  date_facture: string;
  montant: number;
  totalPaiements: number;
  resteAPayer: number;
  bdc: BonDeCommande;
  paiements: Paiement[];
}

// État initial du slice
interface FactureState {
  factures: Facture[];
  currentFacture: Facture | null;
  loading: boolean;
  error: string | null;
}

const initialState: FactureState = {
  factures: [],
  currentFacture: null,
  loading: false,
  error: null,
};

// Configuration de l'URL de base de l'API
const API_URL = `${API_BASE_URL}/factures`;

// Thunk pour récupérer toutes les factures
export const fetchAllFactures = createAsyncThunk(
  "facture/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get<Facture[]>(`${API_URL}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
        "Erreur lors de la récupération des factures"
      );
    }
  }
);

// Thunk pour récupérer une facture par ID
export const fetchFactureById = createAsyncThunk(
  "facture/fetchById",
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await axios.get<Facture>(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || `Facture ${id} introuvable`
      );
    }
  }
);

// Nouveau Thunk pour générer une facture finale par référence de BonDeCommande
export const generateFactureFinaleByReference = createAsyncThunk(
  "facture/generateByReference",
  async (bdcReference: string, { rejectWithValue }) => {
    try {
      const response = await axios.post<Facture>(
        `${API_URL}/generate-by-reference/${bdcReference}`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
        "Erreur lors de la génération de la facture par référence"
      );
    }
  }
);

// Thunk pour générer une facture finale
export const generateFactureFinale = createAsyncThunk(
  "facture/generate",
  async (bdcId: number, { rejectWithValue }) => {
    try {
      const response = await axios.post<Facture>(
        `${API_URL}/generate/${bdcId}`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
        "Erreur lors de la génération de la facture"
      );
    }
  }
);

// Slice Redux
const factureSlice = createSlice({
  name: "facture",
  initialState,
  reducers: {
    resetError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch all factures
    builder
      .addCase(fetchAllFactures.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllFactures.fulfilled, (state, action) => {
        state.loading = false;
        state.factures = action.payload;
      })
      .addCase(fetchAllFactures.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch facture by ID
    builder
      .addCase(fetchFactureById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFactureById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentFacture = action.payload;
      })
      .addCase(fetchFactureById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Generate facture by reference
    builder
      .addCase(generateFactureFinaleByReference.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(generateFactureFinaleByReference.fulfilled, (state, action) => {
        state.loading = false;
        state.factures.push(action.payload);
        state.currentFacture = action.payload;
      })
      .addCase(generateFactureFinaleByReference.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Generate facture
    builder
      .addCase(generateFactureFinale.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(generateFactureFinale.fulfilled, (state, action) => {
        state.loading = false;
        state.factures.push(action.payload);
        state.currentFacture = action.payload;
      })
      .addCase(generateFactureFinale.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

// Export des actions
export const { resetError } = factureSlice.actions;

// Export du reducer
export default factureSlice.reducer;
