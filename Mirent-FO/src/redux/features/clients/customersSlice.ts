import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { Customer, Contract } from "../../../types/clientDetail";
import { API_BASE_URL } from "../../../config";

interface ClientState {
  clients: Customer[];
  loading: boolean;
  error: string | null;
}

const initialState: ClientState = {
  clients: [],
  loading: false,
  error: null,
};

// 🛠️ **Async Thunks**
export const fetchClients = createAsyncThunk(
  "clients/fetchClients",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/clients`);
      if (!response.ok) {
        throw new Error("Failed to fetch clients.");
      }
      return await response.json();
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const addClient = createAsyncThunk(
  "clients/addClient",
  async (client: Omit<Customer, "id" | "contracts">, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("lastName", client.lastName);
      formData.append("email", client.email);
      formData.append("phone", client.phone);

      if (client.logo) {
        const file = await fetch(client.logo).then((res) => res.blob());
        formData.append("logo", file, "logo.jpg");
      }

      const response = await fetch(`${API_BASE_URL}/clients`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to add client.");
      }

      return (await response.json()) as Customer;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateClient = createAsyncThunk(
  "clients/updateClient",
  async (client: Customer, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("lastName", client.lastName);
      formData.append("email", client.email);
      formData.append("phone", client.phone);

      if (client.logo) {
        const file = await fetch(client.logo).then((res) => res.blob());
        formData.append("logo", file, "logo.jpg");
      }

      const response = await fetch(
        `${API_BASE_URL}/clients/${client.id}`,
        {
          method: "PUT",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update client.");
      }

      return (await response.json()) as Customer;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteClient = createAsyncThunk(
  "clients/deleteClient",
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/clients/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete client.");
      }

      return id;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// 📝 **Gestion des contrats**
export const addContract = createAsyncThunk(
  "clients/addContract",
  async (
    {
      clientId,
      contract,
    }: { clientId: number; contract: Omit<Contract, "id"> },
    { rejectWithValue }
  ) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/clients/${clientId}/contracts`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(contract),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to add contract.");
      }

      return { clientId, contract: await response.json() };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// **Slice Redux**
const clientSlice = createSlice({
  name: "customer",
  initialState,

  reducers: {
    setClients(state, action: PayloadAction<Customer[]>) {
      state.clients = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchClients.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchClients.fulfilled,
        (state, action: PayloadAction<Customer[]>) => {
          state.loading = false;
          state.clients = action.payload;
        }
      )
      .addCase(fetchClients.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(
        addClient.fulfilled,
        (state, action: PayloadAction<Customer>) => {
          state.clients.push(action.payload);
        }
      )
      .addCase(
        updateClient.fulfilled,
        (state, action: PayloadAction<Customer>) => {
          const index = state.clients.findIndex(
            (c) => c.id === action.payload.id
          );
          if (index !== -1) {
            state.clients[index] = action.payload;
          }
        }
      )
      .addCase(
        deleteClient.fulfilled,
        (state, action: PayloadAction<number>) => {
          state.clients = state.clients.filter((c) => c.id !== action.payload);
        }
      )
      .addCase(
        addContract.fulfilled,
        (
          state,
          action: PayloadAction<{ clientId: number; contract: Contract }>
        ) => {
          const client = state.clients.find(
            (c) => c.id === action.payload.clientId
          );
          if (client) {
            client.contracts.push(action.payload.contract);
          }
        }
      );
  },
});
export const { setClients } = clientSlice.actions;

export default clientSlice.reducer;
