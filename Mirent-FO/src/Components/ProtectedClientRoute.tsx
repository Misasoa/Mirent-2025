import React from "react";
import { Navigate } from "react-router-dom";

interface ProtectedClientRouteProps {
    children: React.ReactNode;
}

/**
 * Composant de protection des routes client.
 * Vérifie que l'utilisateur est authentifié ET qu'il a le rôle "client".
 * Sinon, redirige vers /login.
 */
const ProtectedClientRoute: React.FC<ProtectedClientRouteProps> = ({ children }) => {
    const token = localStorage.getItem("access_token");
    const userInfoStr = localStorage.getItem("user_info");

    // Vérifier si l'utilisateur est authentifié
    if (!token || !userInfoStr) {
        console.log("🔒 Accès refusé : Utilisateur non authentifié - Redirection vers /login");
        return <Navigate to="/login" replace />;
    }

    try {
        const userInfo = JSON.parse(userInfoStr);

        // Vérifier que l'utilisateur a le rôle client
        if (userInfo.role !== "client") {
            console.log("🔒 Accès refusé : Utilisateur n'est pas un client");
            return <Navigate to="/login" replace />;
        }

        // Si tout est OK, afficher le contenu
        console.log("✅ Accès autorisé pour le client:", userInfo.email);
        return <>{children}</>;
    } catch (error) {
        console.error("Erreur lors de la vérification de l'authentification:", error);
        // En cas d'erreur, nettoyer et rediriger
        localStorage.removeItem("access_token");
        localStorage.removeItem("user_info");
        return <Navigate to="/login" replace />;
    }
};

export default ProtectedClientRoute;
