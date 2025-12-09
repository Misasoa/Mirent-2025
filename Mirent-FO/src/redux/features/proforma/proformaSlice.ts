import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { API_BASE_URL } from "../../../config";

// Interface pour un proforma
interface Proforma {
  id: number;
  client: { id: number; lastName: string };
  proformaNumber: string;
  date: string;
  contractReference?: string;
  notes?: string;
  totalAmount: number;
  status: "En attente" | "Confirmé" | "Annulé";
  items: ProformaItem[];
}

// Interface pour un élément de proforma
interface ProformaItem {
  id: number;
  vehicle: { id: number; nom: string };
  region: { id: number; nom_region: string };
  prix: { id: number; prix: number };
  dateDepart: string;
  dateRetour: string;
  nombreJours: number;
  subTotal: number;
}

// Interface pour les données de création de proforma
interface CreateProformaData {
  clientLastName: string;
  clientEmail?: string;
  clientPhone?: string;
  date: string;
  contractReference?: string;
  notes?: string;
  items: CreateProformaItemData[];
}

interface CreateProformaItemData {
  vehicleCriteria: { marque?: string; modele?: string; type?: string };
  regionName: string;
  dateDepart: string;
  dateRetour: string;
}

// Interface pour les critères de recherche de véhicules disponibles
interface FindAvailableVehiclesCriteria {
  marque?: string;
  modele?: string;
  type?: string;
  dateDepart: string;
  dateRetour: string;
}

// Interface pour un véhicule
interface Vehicle {
  id: number;
  nom: string;
  marque: string;
  modele: string;
  type: { id: number; type: string };
  status: { id: number; status: string };
}

// État initial
interface ProformasState {
  proformas: Proforma[];
  availableVehicles: Vehicle[];
  loading: boolean;
  error: string | null;
}

const initialState: ProformasState = {
  proformas: [],
  availableVehicles: [],
  loading: false,
  error: null,
};

// Thunk pour créer un proforma
export const createProforma = createAsyncThunk(
  "proformas/createProforma",
  async (proformaData: CreateProformaData, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/proforma`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(proformaData),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "Erreur lors de la création du proforma"
        );
      }
      const data = await response.json();
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Thunk pour récupérer tous les proformas
export const fetchProformas = createAsyncThunk(
  "proformas/fetchProformas",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/proforma`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "Erreur lors de la récupération des proformas"
        );
      }
      const data = await response.json();
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Thunk pour récupérer les véhicules disponibles
export const fetchAvailableVehicles = createAsyncThunk(
  "proformas/fetchAvailableVehicles",
  async (criteria: FindAvailableVehiclesCriteria, { rejectWithValue }) => {
    try {
      const query = new URLSearchParams(criteria as any).toString();
      const response = await fetch(
        `${API_BASE_URL}/proforma/available-vehicles?${query}`
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message ||
          "Erreur lors de la récupération des véhicules disponibles"
        );
      }
      const data = await response.json();
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Thunk pour supprimer un proforma
export const deleteProforma = createAsyncThunk(
  "proformas/deleteProforma",
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/proforma/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "Erreur lors de la suppression du proforma"
        );
      }
      return id;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Slice Redux
const proformasSlice = createSlice({
  name: "proformas",
  initialState,
  reducers: {
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Création d'un proforma
    builder
      .addCase(createProforma.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createProforma.fulfilled, (state, action) => {
        state.loading = false;
        state.proformas.push(action.payload);
      })
      .addCase(createProforma.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Récupération des proformas
    builder
      .addCase(fetchProformas.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProformas.fulfilled, (state, action) => {
        state.loading = false;
        state.proformas = action.payload;
      })
      .addCase(fetchProformas.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Récupération des véhicules disponibles
    builder
      .addCase(fetchAvailableVehicles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAvailableVehicles.fulfilled, (state, action) => {
        state.loading = false;
        state.availableVehicles = action.payload;
      })
      .addCase(fetchAvailableVehicles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Suppression d'un proforma
    builder
      .addCase(deleteProforma.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProforma.fulfilled, (state, action) => {
        state.loading = false;
        state.proformas = state.proformas.filter(
          (proforma) => proforma.id !== action.payload
        );
      })
      .addCase(deleteProforma.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

// Exporter les actions
export const { setError } = proformasSlice.actions;

// Exporter le reducer
export default proformasSlice.reducer;
