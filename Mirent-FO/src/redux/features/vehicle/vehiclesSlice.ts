import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { API_BASE_URL } from "../../../config";

export interface Vehicle {
  id: number;
  nom: string;
  marque: string;
  modele: string;
  immatriculation: string;
  nombrePlace: number;
  imageUrl: string | null;
  distance_moyenne?: number;
  derniere_visite?: string;
  type: {
    id: number;
    type: string;
  };
  status: {
    id: number;
    status: string;
  };
}

export interface VehicleType {
  id: number;
  type: string;
}

export interface VehicleStatus {
  id: number;
  status: string;
}

interface VehicleState {
  vehicles: Vehicle[];
  loading: boolean;
  vehiclesType: VehicleType[];
  vehiclesStatus: VehicleStatus[];
  vehiclesLoading: boolean;
  vehiclesError: string | null;
  vehiclesTypeLoading: boolean;
  vehiclesTypeError: string | null;
  vehiclesStatusLoading: boolean;
  vehiclesStatusError: string | null;
  availableCount: number;
}

const initialState: VehicleState = {
  vehicles: [],
  loading: false,
  vehiclesType: [],
  vehiclesStatus: [],
  vehiclesLoading: false,
  vehiclesError: null,
  vehiclesTypeLoading: false,
  vehiclesTypeError: null,
  vehiclesStatusLoading: false,
  vehiclesStatusError: null,
  availableCount: 0,
};

// --- FETCH TYPES & STATUSES ---
export const fetchVehicleStatuses = createAsyncThunk(
  "vehicles/fetchVehicleStatuses",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/status`);
      return response.data as VehicleStatus[];
    } catch (error) {
      if (error instanceof Error) return rejectWithValue(error.message);
      return rejectWithValue("An unknown error occurred");
    }
  }
);

export const fetchVehicleTypes = createAsyncThunk(
  "vehicles/fetchVehicleTypes",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/type`);
      return response.data as VehicleType[];
    } catch (error) {
      if (error instanceof Error) return rejectWithValue(error.message);
      return rejectWithValue("An unknown error occurred");
    }
  }
);

// --- ADD / UPDATE / DELETE TYPES ---
export const addVehicleType = createAsyncThunk(
  "vehicles/addVehicleType",
  async (vehicleType: VehicleType, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/type`,
        vehicleType
      );
      return response.data as VehicleType;
    } catch (error) {
      if (error instanceof Error) return rejectWithValue(error.message);
      return rejectWithValue("An unknown error occurred");
    }
  }
);

export const updateVehicleType = createAsyncThunk(
  "vehicles/updateVehicleType",
  async (vehicleType: VehicleType, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/type/${vehicleType.id}`,
        vehicleType
      );
      return response.data as VehicleType;
    } catch (error) {
      if (error instanceof Error) return rejectWithValue(error.message);
      return rejectWithValue("An unknown error occurred");
    }
  }
);

export const deleteVehicleType = createAsyncThunk(
  "vehicles/deleteVehicleType",
  async (id: number, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_BASE_URL}/type/${id}`);
      return id;
    } catch (error) {
      if (error instanceof Error) return rejectWithValue(error.message);
      return rejectWithValue("An unknown error occurred");
    }
  }
);

// --- FETCH VEHICLES ---
export const fetchVehicles = createAsyncThunk(
  "vehicles/fetchVehicles",
  async () => {
    const response = await axios.get(`${API_BASE_URL}/vehicles`);
    return response.data as Vehicle[];
  }
);

// --- CREATE VEHICLE ---
export const createVehicle = createAsyncThunk(
  "vehicles/createVehicle",
  async (
    {
      nom,
      marque,
      modele,
      immatriculation,
      nombrePlace,
      typeId,
      statusId,
      distance_moyenne,
      derniere_visite,
      image,
    }: {
      nom: string;
      marque: string;
      modele: string;
      immatriculation: string;
      nombrePlace: number;
      typeId: number;
      statusId: number;
      distance_moyenne?: number;
      derniere_visite?: string;
      image?: File;
    },
    { rejectWithValue }
  ) => {
    try {
      const formData = new FormData();
      formData.append("nom", nom);
      formData.append("marque", marque);
      formData.append("modele", modele);
      formData.append("immatriculation", immatriculation);
      formData.append("nombrePlace", nombrePlace.toString());
      formData.append("typeId", typeId.toString());
      formData.append("statusId", statusId.toString());
      if (distance_moyenne !== undefined) {
        formData.append("distance_moyenne", distance_moyenne.toString());
      }
      if (derniere_visite) {
        formData.append("derniere_visite", derniere_visite);
      }
      if (image) {
        formData.append("image", image);
      }

      // Log des données envoyées
      console.log("FormData envoyée:", {
        nom,
        marque,
        modele,
        immatriculation,
        nombrePlace,
        typeId,
        statusId,
        distance_moyenne,
        derniere_visite,
        image: image ? image.name : null,
      });

      const response = await axios.post(
        `${API_BASE_URL}/vehicles`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data as Vehicle;
    } catch (err) {
      if (axios.isAxiosError(err)) {
        return rejectWithValue(err.message);
      }
      return rejectWithValue("An unknown error occurred");
    }
  }
);

// --- UPDATE VEHICLE ---
export const updateVehicle = createAsyncThunk(
  "vehicles/updateVehicle",
  async (
    { id, data, image }: { id: number; data: Partial<Vehicle>; image?: File },
    { rejectWithValue }
  ) => {
    try {
      const formData = new FormData();
      if (data.nom) formData.append("nom", data.nom);
      if (data.marque) formData.append("marque", data.marque);
      if (data.modele) formData.append("modele", data.modele);
      if (data.immatriculation)
        formData.append("immatriculation", data.immatriculation);
      if (data.nombrePlace)
        formData.append("nombrePlace", data.nombrePlace.toString());
      if (data.type) formData.append("typeId", data.type.id.toString());
      if (data.status) formData.append("statusId", data.status.id.toString());
      if (data.distance_moyenne !== undefined)
        formData.append("distance_moyenne", data.distance_moyenne.toString());
      if (data.derniere_visite)
        formData.append("derniere_visite", data.derniere_visite);
      if (image) {
        formData.append("image", image);
      }

      const response = await axios.put(
        `${API_BASE_URL}/vehicles/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data as Vehicle;
    } catch (err) {
      if (axios.isAxiosError(err)) {
        return rejectWithValue(err.message);
      }
      return rejectWithValue("An unknown error occurred");
    }
  }
);

export const deleteVehicle = createAsyncThunk(
  "vehicles/deleteVehicle",
  async (id: number) => {
    await axios.delete(`${API_BASE_URL}/vehicles/${id}`);
    return id;
  }
);

// --- UPDATE VEHICLE STATUS BY ID ---
export const updateVehicleStatus = createAsyncThunk(
  "vehicles/updateVehicleStatus",
  async (
    { id, statusId }: { id: number; statusId: number },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.patch(
        `${API_BASE_URL}/vehicles/${id}/status`,
        { statusId }
      );
      return response.data as Vehicle;
    } catch (err) {
      if (axios.isAxiosError(err)) {
        return rejectWithValue(err.message);
      }
      return rejectWithValue("An unknown error occurred");
    }
  }
);

// --- UPDATE VEHICLE STATUS BY NAME ---
export const updateVehicleStatusByName = createAsyncThunk(
  "vehicles/updateVehicleStatusByName",
  async (
    { id, statusName }: { id: number; statusName: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/vehicles/${id}/status`,
        { status: statusName }
      );
      return response.data as Vehicle;
    } catch (err) {
      if (axios.isAxiosError(err)) {
        return rejectWithValue(err.message);
      }
      return rejectWithValue("An unknown error occurred");
    }
  }
);

// --- FETCH AVAILABLE VEHICLES COUNT ---
export const fetchAvailableVehiclesCount = createAsyncThunk<
  number,
  void,
  { rejectValue: string }
>("vehicles/fetchAvailableVehiclesCount", async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/vehicles/available-count`
    );
    const data = response.data;
    const count = typeof data === "number" ? data : data?.count;
    if (typeof count !== "number") {
      return rejectWithValue(
        "Le compteur de véhicules disponibles n'est pas un nombre valide"
      );
    }
    return count;
  } catch (err) {
    if (axios.isAxiosError(err)) {
      return rejectWithValue(err.message);
    }
    return rejectWithValue("An unknown error occurred");
  }
});

const vehiclesSlice = createSlice({
  name: "vehicles",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // --- FETCH VEHICLES ---
      .addCase(fetchVehicles.pending, (state) => {
        state.vehiclesLoading = true;
        state.vehiclesError = null;
      })
      .addCase(fetchVehicles.fulfilled, (state, action) => {
        state.vehiclesLoading = false;
        state.vehicles = action.payload;
      })
      .addCase(fetchVehicles.rejected, (state, action) => {
        state.vehiclesLoading = false;
        state.vehiclesError = action.payload as string;
      })
      // --- CREATE VEHICLE ---
      .addCase(createVehicle.fulfilled, (state, action) => {
        state.vehicles.push(action.payload);
      })
      .addCase(createVehicle.rejected, (state, action) => {
        console.error(
          "Failed to create vehicle:",
          action.payload,
          action.error
        );
        state.vehiclesError = action.payload as string;
      })
      // --- UPDATE VEHICLE ---
      .addCase(updateVehicle.pending, (state) => {
        state.loading = true;
        state.vehiclesError = null;
      })
      .addCase(updateVehicle.fulfilled, (state, action) => {
        state.loading = false;
        state.vehicles = state.vehicles.map((v) =>
          v.id === action.payload.id ? action.payload : v
        );
      })
      .addCase(updateVehicle.rejected, (state, action) => {
        state.loading = false;
        state.vehiclesError = action.payload as string;
      })
      // --- DELETE VEHICLE ---
      .addCase(deleteVehicle.fulfilled, (state, action) => {
        state.vehicles = state.vehicles.filter((v) => v.id !== action.payload);
      })
      // --- FETCH TYPES ---
      .addCase(fetchVehicleTypes.pending, (state) => {
        state.vehiclesTypeLoading = true;
        state.vehiclesTypeError = null;
      })
      .addCase(fetchVehicleTypes.fulfilled, (state, action) => {
        state.vehiclesTypeLoading = false;
        state.vehiclesType = action.payload;
      })
      .addCase(fetchVehicleTypes.rejected, (state, action) => {
        state.vehiclesTypeLoading = false;
        state.vehiclesTypeError = action.payload as string;
      })
      // --- ADD / UPDATE / DELETE TYPE ---
      .addCase(addVehicleType.fulfilled, (state, action) => {
        state.vehiclesType.push(action.payload);
      })
      .addCase(updateVehicleType.fulfilled, (state, action) => {
        const index = state.vehiclesType.findIndex(
          (t) => t.id === action.payload.id
        );
        if (index !== -1) state.vehiclesType[index] = action.payload;
      })
      .addCase(deleteVehicleType.fulfilled, (state, action) => {
        state.vehiclesType = state.vehiclesType.filter(
          (t) => t.id !== action.payload
        );
      })
      // --- FETCH STATUSES ---
      .addCase(fetchVehicleStatuses.pending, (state) => {
        state.vehiclesStatusLoading = true;
        state.vehiclesStatusError = null;
      })
      .addCase(fetchVehicleStatuses.fulfilled, (state, action) => {
        state.vehiclesStatusLoading = false;
        state.vehiclesStatus = action.payload;
      })
      .addCase(fetchVehicleStatuses.rejected, (state, action) => {
        state.vehiclesStatusLoading = false;
        state.vehiclesStatusError = action.payload as string;
      })
      // --- UPDATE VEHICLE STATUS BY ID ---
      .addCase(updateVehicleStatus.fulfilled, (state, action) => {
        state.vehicles = state.vehicles.map((v) =>
          v.id === action.payload.id ? action.payload : v
        );
      })
      .addCase(updateVehicleStatus.rejected, (state, action) => {
        state.vehiclesError = action.payload as string;
      })
      // --- UPDATE VEHICLE STATUS BY NAME ---
      .addCase(updateVehicleStatusByName.fulfilled, (state, action) => {
        state.vehicles = state.vehicles.map((v) =>
          v.id === action.payload.id ? action.payload : v
        );
      })
      .addCase(updateVehicleStatusByName.rejected, (state, action) => {
        state.vehiclesError = action.payload as string;
      })
      // --- FETCH AVAILABLE VEHICLES COUNT ---
      .addCase(fetchAvailableVehiclesCount.fulfilled, (state, action) => {
        state.loading = false;
        state.availableCount = action.payload;
      })
      .addCase(fetchAvailableVehiclesCount.rejected, (state, action) => {
        state.loading = false;
        state.availableCount = 0;
        console.error(
          "Failed to fetch available vehicles count:",
          action.payload
        );
      });
  },
});

export default vehiclesSlice.reducer;
