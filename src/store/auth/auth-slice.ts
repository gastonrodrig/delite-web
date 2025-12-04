import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AuthState, LoginPayload, ClientDataPayload } from "@types";

// Estado inicial
const initialState: AuthState = {
  status: "not-authenticated",
  _id: null,
  uid: null,
  email: null,
  firstName: null,
  lastName: null,
  phone: null,
  documentType: null,
  documentNumber: null,
  role: null,
  needsPasswordChange: null,
  userStatus: null,
  photoURL: null,
  token: null,
  isExtraDataCompleted: false,
};

// Auth Slice
export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, { payload }: PayloadAction<LoginPayload>) => {
      // Bloquear acceso si el usuario está inactivo
      if (payload.userStatus === "Inactivo") {
        state.status = "not-authenticated";
        return;
      }

      state._id = payload._id;
      state.uid = payload.uid;
      state.email = payload.email;
      state.firstName = payload.firstName ?? null;
      state.lastName = payload.lastName ?? null;
      state.phone = payload.phone ?? null;
      state.documentType = payload.documentType ?? null;
      state.documentNumber = payload.documentNumber ?? null;
      state.role = payload.role;
      state.needsPasswordChange = payload.needsPasswordChange ?? null;
      state.userStatus = payload.userStatus;
      state.photoURL = payload.photoURL ?? null;
      state.token = payload.token;
      state.isExtraDataCompleted = payload.isExtraDataCompleted;
      // Determinar el estado final
      state.status = payload.needsPasswordChange
        ? "first-login-password"
        : "authenticated";
    },

    logout: () => {
      return initialState;
    },

    checkingCredentials: (state) => {
      state.status = "checking";
    },

    authenticated: (state) => {
      state.status = "authenticated";
      state.needsPasswordChange = false;
    },

    sendingResetEmail: (state) => {
      state.status = "sending-reset-email";
    },

    resetEmailSent: (state) => {
      state.status = "reset-email-sent";
    },

    changingPassword: (state) => {
      state.status = "changing-password";
    },

    setClientData: (state, { payload }: PayloadAction<ClientDataPayload>) => {
      state.firstName = payload.firstName;
      state.lastName = payload.lastName;
      state.phone = payload.phone;
      state.documentType = payload.documentType;
      state.documentNumber = payload.documentNumber;
      state.needsPasswordChange = false;
      state.isExtraDataCompleted = true;
    },

    setClientProfile: (
      state,
      { payload }: PayloadAction<{ photoURL: string | null }>
    ) => {
      state.photoURL = payload.photoURL;
    },

    removeClientProfile: (state) => {
      state.photoURL = null;
    },
  },
});

// Exportar las acciones
export const {
  login,
  logout,
  checkingCredentials,
  authenticated,
  sendingResetEmail,
  resetEmailSent,
  changingPassword,
  setClientData,
  setClientProfile,
  removeClientProfile,
} = authSlice.actions;