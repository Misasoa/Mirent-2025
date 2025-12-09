import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";

interface ProtectedAdminRouteProps {
    children: React.ReactNode;
}

/**
 * Composant de protection des routes admin.
 * Vérifie que l'utilisateur est authentifié ET qu'il a le rôle "admin".
 * Sinon, redirige vers /admin/login.
 */
const ProtectedAdminRoute: React.FC<ProtectedAdminRouteProps> = ({
    children,
}) => {
    const token = localStorage.getItem("access_token");
    const userInfoStr = localStorage.getItem("user_info");

    // Vérifier si l'utilisateur est authentifié
    if (!token || !userInfoStr) {
        console.log("🔒 Accès refusé : Utilisateur non authentifié");
        return <Navigate to="/admin/login" replace />;
    }

    try {
        const userInfo = JSON.parse(userInfoStr);

        // Vérifier que l'utilisateur a le rôle admin
        if (userInfo.role !== "admin") {
            console.log("🔒 Accès refusé : Utilisateur n'est pas admin");
            return <Navigate to="/admin/login" replace />;
        }

        // Si tout est OK, afficher le contenu
        return <>{children}</>;
    } catch (error) {
        console.error("Erreur lors de la vérification de l'authentification:", error);
        // En cas d'erreur, nettoyer et rediriger
        localStorage.removeItem("access_token");
        localStorage.removeItem("user_info");
        return <Navigate to="/admin/login" replace />;
    }
};

export default ProtectedAdminRoute;
