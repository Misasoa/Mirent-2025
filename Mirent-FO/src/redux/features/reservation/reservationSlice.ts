// reservationSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { API_BASE_URL } from "../../../config";
import { RootState } from "../../store";

// reservationTypes.ts
export enum ReservationStatus {
  DEVIS = "devis",
  CONFIRMEE = "confirmee",
  ANNULEE = "annulee",
  TERMINEE = "terminee",
}

export enum CarburantPolicy {
  PLEIN_A_PLEIN = "plein_a_plein",
  PAY_AS_YOU_USE = "pay_as_you_use",
}

export interface Prix {
  prix: number;
}

// Types pour les sous-entités
export interface Client {
  id: number;
  lastName: string;
}

export interface Vehicle {
  id: number;
  nom: string;
  marque: string;
  modele: string;
  immatriculation: string;
  nombrePlace: number;
}

export interface Region {
  id: number;
  nom_region: string;
  nom_district: string | null;
  prix?: Prix;
}

// Type principal pour la réservation
export interface Reservation {
  id: number;
  reference: string;
  createdAt: Date | string;
  pickup_date: Date | string;
  return_date: Date | string;
  total_price: number;
  status: ReservationStatus;
  client: Client;
  vehicule: Vehicle;
  location: Region;
  nombreJours: number;
  note?: string;
  carburant_policy: CarburantPolicy;
  carburant_depart?: number;
  carburant_retour?: number;
  kilometrage_depart?: number;
  kilometrage_retour?: number;
  prix_unitaire?: number;
  total_en_lettres?: string;
  canBeCancelled?: boolean;
  canBeDeleted?: boolean;
}

interface ReservationState {
  reservations: Reservation[];
  loading: boolean;
  error: string | null;
  currentReservation: Reservation | null;
}

const initialState: ReservationState = {
  reservations: [],
  loading: false,
  error: null,
  currentReservation: null,
};

const API_URL = `${API_BASE_URL}/reservations`;

export const fetchReservations = createAsyncThunk(
  "reservations/fetchReservations",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(API_URL);
      if (!response.ok)
        throw new Error("Erreur lors du chargement des réservations");
      const data = await response.json();
      console.log("Données API des réservations :", data);
      return data;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

export const createDevis = createAsyncThunk(
  "reservations/createDevis",
  async (dto: CreateReservationDto, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/devis`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dto),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "Erreur lors de la création du devis"
        );
      }

      const newReservation = await response.json();
      console.log("API Response (new devis):", newReservation);
      return newReservation;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

export const confirmReservation = createAsyncThunk(
  "reservations/confirmReservation",
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/${id}/confirm`, {
        method: "PATCH",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erreur lors de la confirmation");
      }

      return await response.json();
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

export const completeReservation = createAsyncThunk(
  "reservations/completeReservation",
  async (
    { id, carburant_retour }: CompleteReservationPayload,
    { rejectWithValue }
  ) => {
    try {
      const response = await fetch(`${API_URL}/${id}/complete`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ carburant_retour }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erreur lors de la complétion");
      }

      return await response.json();
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

export const cancelReservation = createAsyncThunk(
  "reservations/cancelReservation",
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/${id}/cancel`, {
        method: "PATCH",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erreur lors de l'annulation");
      }

      return await response.json();
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

export const deleteReservation = createAsyncThunk(
  "reservations/deleteReservation",
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erreur lors de la suppression");
      }

      return id; // Retourne l'ID de la réservation supprimée
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

// ----------------------
// 📌 Types pour les payloads
// ----------------------
export interface CreateReservationDto {
  clientId: number;
  vehiculeId: number;
  pickup_date: string;
  return_date: string;
  region_id: number;
  carburant_policy: CarburantPolicy;
  carburant_depart?: number;
  kilometrage_depart?: number;
}

interface CompleteReservationPayload {
  id: number;
  carburant_retour: number;
}

// ----------------------
// 📌 Slice Redux
// ----------------------
const reservationSlice = createSlice({
  name: "reservations",
  initialState,
  reducers: {
    setCurrentReservation(state, action: PayloadAction<Reservation | null>) {
      state.currentReservation = action.payload;
    },
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all reservations
      .addCase(fetchReservations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReservations.fulfilled, (state, action) => {
        state.loading = false;
        state.reservations = action.payload;
      })
      .addCase(fetchReservations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Create devis
      .addCase(createDevis.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createDevis.fulfilled, (state, action) => {
        state.loading = false;
        state.reservations = [...state.reservations, action.payload];
        state.currentReservation = action.payload;
        console.log(
          "Redux State Updated (new devis):",
          state.reservations,
          state.currentReservation
        );
      })
      .addCase(createDevis.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Confirm reservation
      .addCase(confirmReservation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(confirmReservation.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.reservations.findIndex(
          (r) => r.id === action.payload.id
        );
        if (index !== -1) {
          state.reservations[index] = action.payload;
        }
        if (state.currentReservation?.id === action.payload.id) {
          state.currentReservation = action.payload;
        }
      })
      .addCase(confirmReservation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Complete reservation
      .addCase(completeReservation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(completeReservation.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.reservations.findIndex(
          (r) => r.id === action.payload.id
        );
        if (index !== -1) {
          state.reservations[index] = action.payload;
        }
        if (state.currentReservation?.id === action.payload.id) {
          state.currentReservation = action.payload;
        }
      })
      .addCase(completeReservation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Cancel reservation
      .addCase(cancelReservation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(cancelReservation.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.reservations.findIndex(
          (r) => r.id === action.payload.id
        );
        if (index !== -1) {
          state.reservations[index] = action.payload;
        }
        if (state.currentReservation?.id === action.payload.id) {
          state.currentReservation = action.payload;
        }
      })
      .addCase(cancelReservation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Delete reservation
      .addCase(deleteReservation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteReservation.fulfilled, (state, action) => {
        state.loading = false;
        // Supprimer la réservation de la liste
        state.reservations = state.reservations.filter(
          (r) => r.id !== action.payload
        );
        // Si la réservation courante est celle supprimée, la mettre à null
        if (state.currentReservation?.id === action.payload) {
          state.currentReservation = null;
        }
      })
      .addCase(deleteReservation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setCurrentReservation, clearError } = reservationSlice.actions;

// Sélecteurs
export const selectAllReservations = (state: RootState) =>
  state.reservations.reservations;
export const selectCurrentReservation = (state: RootState) =>
  state.reservations.currentReservation;
export const selectLoading = (state: RootState) => state.reservations.loading;
export const selectError = (state: RootState) => state.reservations.error;

// Nouveaux sélecteurs utilitaires
export const selectReservationById = (state: RootState, id: number) =>
  state.reservations.reservations.find((r) => r.id === id);

export const selectDevisReservations = (state: RootState) =>
  state.reservations.reservations.filter(
    (r) => r.status === ReservationStatus.DEVIS
  );

export const selectConfirmedReservations = (state: RootState) =>
  state.reservations.reservations.filter(
    (r) => r.status === ReservationStatus.CONFIRMEE
  );

export const selectCancelledReservations = (state: RootState) =>
  state.reservations.reservations.filter(
    (r) => r.status === ReservationStatus.ANNULEE
  );

export const selectCompletedReservations = (state: RootState) =>
  state.reservations.reservations.filter(
    (r) => r.status === ReservationStatus.TERMINEE
  );

export default reservationSlice.reducer;
