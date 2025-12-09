import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: "admin" | "client";
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  token: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess(
      state,
      action: PayloadAction<{ user: User; token: string }>
    ) {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;

      // Stocker dans localStorage
      localStorage.setItem("access_token", action.payload.token);
      localStorage.setItem("user_info", JSON.stringify(action.payload.user));
    },

    initializeAuth(state) {
      // Charger depuis localStorage au démarrage de l'app
      const token = localStorage.getItem("access_token");
      const userInfo = localStorage.getItem("user_info");

      if (token && userInfo) {
        try {
          const user = JSON.parse(userInfo) as User;
          state.isAuthenticated = true;
          state.user = user;
          state.token = token;
        } catch (error) {
          // En cas d'erreur de parsing, nettoyer le localStorage
          localStorage.removeItem("access_token");
          localStorage.removeItem("user_info");
        }
      }
    },

    logout(state) {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;

      // Nettoyer le localStorage
      localStorage.removeItem("access_token");
      localStorage.removeItem("user_info");
      localStorage.removeItem("isLoggedIn"); // Pour le Navbar
    },
  },
});

export const { loginSuccess, initializeAuth, logout } = authSlice.actions;
export default authSlice.reducer;
