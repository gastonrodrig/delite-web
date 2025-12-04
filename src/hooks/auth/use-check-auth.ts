"use client";

import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { 
  useAppDispatch, 
  useAppSelector, 
  checkingCredentials, 
  login, 
  logout 
} from "@store";
import { useUsersStore } from "@hooks";
import { FirebaseAuth } from "@config";
import { HttpError } from "@types";

export const useCheckAuth = () => {
  const dispatch = useAppDispatch();

  const { status } = useAppSelector((state) => state.auth);
  const { findUserByEmail } = useUsersStore();

  useEffect(() => {
    dispatch(checkingCredentials());

    const unsubscribe = onAuthStateChanged(FirebaseAuth, async (user: any) => {
      try {
        // Si no hay usuario, logout inmediato
        if (!user) {
          dispatch(logout());
          return;
        }

        const email = user.providerData[0]?.email;
        if (!email) {
          dispatch(logout());
          return;
        }

        const { data } = await findUserByEmail(email);

        // Validaciones de estado del usuario
        if (!data || data.status === "Inactivo") {
          dispatch(logout());
          return;
        }

        if (data.role === "Cliente") {
          // Este rol no puede usar la app
          dispatch(logout());
          return;
        }

        // Login automático
        dispatch(
          login({
            _id: data._id,
            uid: data.auth_id,
            email: data.email,

            firstName: data.first_name ?? null,
            lastName: data.last_name ?? null,
            phone: data.phone ?? null,

            documentType: data.document_type ?? null,
            documentNumber: data.document_number ?? null,

            role: data.role,
            needsPasswordChange: data.needs_password_change ?? null,
            userStatus: data.status,
            photoURL: data.profile_picture ?? null,

            token: user.accessToken,
            isExtraDataCompleted: data.is_extra_data_completed,
          })
        );
      } catch (error: unknown) {
        const err = error as HttpError;
        console.error("Error en useCheckAuth:", err.response?.data);
        dispatch(logout());
      }
    });

    return () => unsubscribe();
  }, [dispatch, findUserByEmail]);

  return { status };
};
