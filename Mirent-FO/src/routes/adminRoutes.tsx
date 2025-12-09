import {
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";

import MainLayout from "../layouts/MainLayouts";
import Devis from "../admin/pages/Devis/DevisPage";
import Commande from "../admin/pages/commande/CommandePage";
import LocationsPage from "../admin/pages/lieux/locationPage";
import Home from "../admin/pages/acceuil/HomePage";
import Vehicule from "../admin/pages/vehicules/vehiculePage";
import Types from "../admin/pages/Types/type";
import ClientPage from "../admin/pages/clients/ClientPage";
import ClientDetailPage from "../admin/pages/ClientDetailPage/clientdetailPage";
import CommandePage from "../admin/pages/commande/CommandePage";
import UserProfile from "../Components/profile/userProfile";
import ContratPage from "../admin/pages/contrat/contratPage";
import ContactPage from "../admin/pages/Contact/ContactPage";
import PaiementPage from "../admin/pages/paiement/PaiementPage";
import Reservations from "../admin/pages/ReseravationPage/ReservationPage";
import FacturePages from "../admin/pages/facture/FacturePage";
import RegisterAdmin from "../admin/Components/Authentification/RegisterAdmin";
import LoginAdmin from "../admin/Components/Authentification/LoginAdmin";
import ProtectedAdminRoute from "../Components/ProtectedAdminRoute";
import GuestAdminRoute from "../Components/GuestAdminRoute";

const AdminRoutes = () => {
  return (
    <Routes>
      {/* Redirection de la racine vers login */}
      <Route path="/" element={<Navigate to="login" replace />} />

      {/* Route de connexion admin - PROTÉGÉE (redirige les admins déjà connectés) */}
      <Route
        path="login"
        element={
          <GuestAdminRoute>
            <LoginAdmin />
          </GuestAdminRoute>
        }
      />

      {/* Route d'inscription admin - PROTÉGÉE (redirige les admins déjà connectés) */}
      <Route
        path="register-admin"
        element={
          <GuestAdminRoute>
            <RegisterAdmin />
          </GuestAdminRoute>
        }
      />

      {/* ROUTES PROTÉGÉES - Toutes les routes ci-dessous nécessitent une authentification admin */}

      {/* Route pour l'accueil */}
      <Route
        path="home"
        element={
          <ProtectedAdminRoute>
            <MainLayout>
              <Home />
            </MainLayout>
          </ProtectedAdminRoute>
        }
      />

      {/* Route pour les réservations */}
      <Route
        path="reservations"
        element={
          <ProtectedAdminRoute>
            <MainLayout>
              <Reservations />
            </MainLayout>
          </ProtectedAdminRoute>
        }
      />

      {/* Route pour les Commandes */}
      <Route
        path="commandes"
        element={
          <ProtectedAdminRoute>
            <MainLayout>
              <CommandePage />
            </MainLayout>
          </ProtectedAdminRoute>
        }
      />

      {/* Route pour les Paiements */}
      <Route
        path="paiements"
        element={
          <ProtectedAdminRoute>
            <MainLayout>
              <PaiementPage />
            </MainLayout>
          </ProtectedAdminRoute>
        }
      />

      {/* Route pour les factures */}
      <Route
        path="factures"
        element={
          <ProtectedAdminRoute>
            <MainLayout>
              <FacturePages />
            </MainLayout>
          </ProtectedAdminRoute>
        }
      />

      {/* Route pour les véhicules */}
      <Route
        path="vehicules"
        element={
          <ProtectedAdminRoute>
            <MainLayout>
              <Vehicule />
            </MainLayout>
          </ProtectedAdminRoute>
        }
      />



      {/* Route pour les types de véhicules */}
      <Route
        path="types"
        element={
          <ProtectedAdminRoute>
            <MainLayout>
              <Types />
            </MainLayout>
          </ProtectedAdminRoute>
        }
      />

      {/* Route pour les clients */}
      <Route
        path="clients"
        element={
          <ProtectedAdminRoute>
            <MainLayout>
              <ClientPage />
            </MainLayout>
          </ProtectedAdminRoute>
        }
      />

      {/* Route pour le détail d'un client */}
      <Route
        path="client_detail"
        element={
          <ProtectedAdminRoute>
            <MainLayout>
              <ClientDetailPage />
            </MainLayout>
          </ProtectedAdminRoute>
        }
      />

      {/* Route pour la page proformat */}
      <Route
        path="/proformat/nouveau"
        element={
          <ProtectedAdminRoute>
            <MainLayout>
              <Commande />
            </MainLayout>
          </ProtectedAdminRoute>
        }
      />

      {/* Route pour les devis */}
      <Route
        path="devis"
        element={
          <ProtectedAdminRoute>
            <MainLayout>
              <Devis />
            </MainLayout>
          </ProtectedAdminRoute>
        }
      />

      {/* Route pour le profil utilisateur */}
      <Route
        path="profile"
        element={
          <ProtectedAdminRoute>
            <MainLayout>
              <UserProfile />
            </MainLayout>
          </ProtectedAdminRoute>
        }
      />

      {/* Route pour les lieux */}
      <Route
        path="lieux"
        element={
          <ProtectedAdminRoute>
            <MainLayout>
              <LocationsPage />
            </MainLayout>
          </ProtectedAdminRoute>
        }
      />

      {/* Route pour les contrats */}
      <Route
        path="contrats"
        element={
          <ProtectedAdminRoute>
            <MainLayout>
              <ContratPage />
            </MainLayout>
          </ProtectedAdminRoute>
        }
      />

      {/* Route pour le contact */}
      <Route
        path="contact"
        element={
          <ProtectedAdminRoute>
            <MainLayout>
              <ContactPage />
            </MainLayout>
          </ProtectedAdminRoute>
        }
      />

      {/* Route pour déconnexion (peut-être à implémenter) */}
      <Route path="logout" />
    </Routes>
  );
};

export default AdminRoutes;
