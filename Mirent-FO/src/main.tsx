import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { Provider } from "react-redux";
import { store } from "./redux/store";

// ✅ Ajout pour les DatePickers
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import frLocale from "date-fns/locale/fr"; // Facultatif si tu veux les dates en français

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <LocalizationProvider
        dateAdapter={AdapterDateFns}
        adapterLocale={frLocale}
      >
        <App />
      </LocalizationProvider>
    </Provider>
  </React.StrictMode>
);
