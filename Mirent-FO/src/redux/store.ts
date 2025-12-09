import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/auth/authSlice";
import sidebarReducer from "./features/sidebar/SidebarSlice";
import vehiclesReducer from "./features/vehicle/vehiclesSlice";
import { create } from "zustand";
import { Proforma } from "../types/Proforma";
import locationReducer from "../redux/features/lieux/locationSlice";
import customersReducer from "./features/clients/customersSlice";
import contractReducer from "./features/contrat/contratSlice";
import proformasReducer from "./features/proforma/proformaSlice";
import reservationReducer from "./features/reservation/reservationSlice";
import fichebordReducer from "./features/ficheBord/ficheBordSlice";
import bonDeCommandeReducer from "./features/commande/bonDeCommandeSlice";
import factureReducer from "./features/facture/factureSlice";
import paiementReducer from "./features/paiement/paiementSlice";
interface ProformaState {
  proformas: Proforma[];
  addProforma: (newProforma: Proforma) => void;
}

export const useProformaStore = create<ProformaState>((set) => ({
  proformas: [],
  addProforma: (newProforma) =>
    set((state) => ({ proformas: [...state.proformas, newProforma] })),
}));

export const store = configureStore({
  reducer: {
    auth: authReducer,
    vehicles: vehiclesReducer,
    sidebar: sidebarReducer,
    customer: customersReducer,
    region: locationReducer,
    contrat: contractReducer as any,
    proformas: proformasReducer,
    reservation: reservationReducer,
    fichebord: fichebordReducer,
    bonDeCommande: bonDeCommandeReducer,
    facture: factureReducer,
    reservations: reservationReducer,
    paiements: paiementReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
