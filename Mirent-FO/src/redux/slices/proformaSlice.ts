import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Quote {
  ref: string;
  voiture: string;
  numeroVoiture: string;
  dateDepart: string;
  dateArrivee: string;
  destination: string;
  nombreJours: number;
  carburant: number;
  prixUnitaire: number;
  prixTotal: number;
  isInvoice: boolean;
}

interface ProformaState {
  quotes: Quote[];
  error: string | null;
}

const initialState: ProformaState = {
  quotes: [],
  error: null,
};

const proformaSlice = createSlice({
  name: "proforma",
  initialState,
  reducers: {
    validateProforma: (state, action: PayloadAction<string>) => {
      const quote = state.quotes.find((q) => q.ref === action.payload);
      if (quote) {
        quote.isInvoice = true;
      }
    },
    addQuote: (state, action: PayloadAction<Quote>) => {
      const existingQuote = state.quotes.find(
        (quote) => quote.ref === action.payload.ref
      );
      if (!existingQuote) {
        state.quotes.push(action.payload);
        state.error = null;
      } else {
        state.error = "Un devis avec cette référence existe déjà !";
      }
    },
    updateQuote: (state, action: PayloadAction<Quote>) => {
      const index = state.quotes.findIndex(
        (quote) => quote.ref === action.payload.ref
      );
      if (index !== -1) {
        state.quotes[index] = action.payload;
        state.error = null;
      } else {
        state.error = "Aucun devis trouvé avec cette référence !";
      }
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const { validateProforma, addQuote, clearError, updateQuote } =
  proformaSlice.actions;
export default proformaSlice.reducer;
