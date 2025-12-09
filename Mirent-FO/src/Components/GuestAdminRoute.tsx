import React from "react";
import { Navigate } from "react-router-dom";

interface GuestAdminRouteProps {
    children: React.ReactNode;
}

/**
 * Composant de protection pour les routes d'authentification admin (login, register).
 * Empêche les utilisateurs déjà connectés en tant qu'admin d'accéder aux pages login/register.
 * Si un admin est déjà connecté, il est redirigé vers /admin/home.
 */
const GuestAdminRoute: React.FC<GuestAdminRouteProps> = ({ children }) => {
    const token = localStorage.getItem("access_token");
    const userInfoStr = localStorage.getItem("user_info");

    // Si l'utilisateur est déjà authentifié
    if (token && userInfoStr) {
        try {
            const userInfo = JSON.parse(userInfoStr);

            // Si c'est un admin connecté, rediriger vers le dashboard admin
            if (userInfo.role === "admin") {
                console.log("🔒 Admin déjà connecté, redirection vers /admin/home");
                return <Navigate to="/admin/home" replace />;
            }
        } catch (error) {
            console.error("Erreur lors de la vérification de l'authentification:", error);
            // En cas d'erreur de parsing, nettoyer le localStorage
            localStorage.removeItem("access_token");
            localStorage.removeItem("user_info");
        }
    }

    // Si pas de token ou pas admin, permettre l'accès aux pages login/register
    return <>{children}</>;
};

export default GuestAdminRoute;
