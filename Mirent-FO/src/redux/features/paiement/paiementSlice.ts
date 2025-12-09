import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import {
  CarburantPolicy,
  Client,
  Region,
} from "../reservation/reservationSlice";
import { Vehicle } from "../vehicle/vehiclesSlice";
import { API_BASE_URL } from "../../../config";

export enum PaymentMethod {
  ESPECES = "especes",
  MOBILE_MONEY = "mobile_money",
  CARTE_BANCAIRE = "carte_bancaire",
}

// Interfaces pour les structures de données
export interface Reservation {
  id: number;
  reference: string;
  createdAt: Date | string;
  pickup_date: Date | string;
  return_date: Date | string;
  total_price: number;
  client: Client;
  vehicule: Vehicle;
  region: Region;
  nombreJours: number;
  note?: string;
  carburant_policy: CarburantPolicy;
  carburant_depart?: number;
  carburant_retour?: number;
  kilometrage_depart?: number;
  kilometrage_retour?: number;
  prix_unitaire?: number;
  total_en_lettres?: string;
}

export interface BonDeCommande {
  id: number;
  reference: string;
  reservation: Reservation;
}

export interface PaiementSummary {
  bdcId: number;
  montantTotal: number;
  totalPaye: number;
  reste: number;
}

export interface Paiement {
  id: number;
  montant: string;
  methode: PaymentMethod;
  reference_transaction: string | null;
  date_paiement: string;
  bdc: BonDeCommande;
  details_bdc?: BonDeCommande;
  resume_paiement?: PaiementSummary;
}

// État initial du slice
export interface PaiementState {
  paiements: Paiement[];
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  message: string;
}

const initialState: PaiementState = {
  paiements: [],
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: "",
};

const API_URL = `${API_BASE_URL}/paiements`;

// Thunk pour récupérer tous les paiements
export const fetchAllPaiementsWithDetails = createAsyncThunk<Paiement[]>(
  "paiements/fetchAllPaiementsWithDetails",
  async (_, thunkAPI) => {
    try {
      const response = await axios.get<Paiement[]>(`${API_URL}/all/details`);
      return response.data;
    } catch (error: any) {
      const message =
        error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Thunk pour ajouter un paiement
export const addPaiement = createAsyncThunk<
  Paiement,
  {
    bdcReference: string;
    montant: number;
    methode: PaymentMethod;
    reference?: string;
  }
>("paiements/addPaiement", async (paiementData, thunkAPI) => {
  try {
    const response = await axios.post<Paiement>(
      `${API_URL}/${paiementData.bdcReference}`,
      paiementData
    );
    return response.data;
  } catch (error: any) {
    const message =
      error.response?.data?.message || error.message || error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});

const paiementSlice = createSlice({
  name: "paiement",
  initialState,
  reducers: {
    resetPaiementState: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    builder
      // Cas pour fetchAllPaiementsWithDetails
      .addCase(fetchAllPaiementsWithDetails.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(
        fetchAllPaiementsWithDetails.fulfilled,
        (state, action: PayloadAction<Paiement[]>) => {
          state.isLoading = false;
          state.isSuccess = true;
          state.paiements = action.payload;
        }
      )
      .addCase(fetchAllPaiementsWithDetails.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
        state.paiements = [];
      })
      // Cas pour addPaiement
      .addCase(addPaiement.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(
        addPaiement.fulfilled,
        (state, _action: PayloadAction<Paiement>) => {
          state.isLoading = false;
          state.isSuccess = true;
        }
      )
      .addCase(addPaiement.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
      });
  },
});

export const { resetPaiementState } = paiementSlice.actions;
export default paiementSlice.reducer;
