import { Navigate, Route, Routes } from "react-router-dom";
import ClientHome from "../clients/pages/home";
import VehiclesPage from "../clients/pages/vehiculePage";
import ReservationList from "../clients/pages/reservationList";
import VehicleDetails from "../clients/components/VehiclesDetails";
import ReservationPage from "../clients/pages/reservationPage";
import ReservationDetails from "../clients/pages/reservationDetailPage";
import ReservationEdit from "../clients/pages/reservationEditPage";
import Contact from "../clients/pages/Contact";
import Profile from "../clients/pages/Profile";
import ProtectedClientRoute from "../Components/ProtectedClientRoute";

const ClientRoutes = () => {
  return (
    <Routes>
      {/* Routes publiques - accessibles sans authentification */}
      <Route index element={<Navigate to="acceuil" />} />
      <Route path="acceuil" element={<ClientHome />} />
      <Route path="/list-vehicule" element={<VehiclesPage />} />
      <Route path="/contact" element={<Contact />} />
      <Route
        path="/voitures/:id/details"
        element={<VehicleDetails vehicle={{}} onClose={() => { }} />}
      />

      {/* Routes protégées - nécessitent une authentification client */}
      <Route
        path="/voitures/:id/reserver"
        element={
          <ProtectedClientRoute>
            <ReservationPage />
          </ProtectedClientRoute>
        }
      />
      <Route
        path="/reservations-list"
        element={
          <ProtectedClientRoute>
            <ReservationList />
          </ProtectedClientRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedClientRoute>
            <Profile />
          </ProtectedClientRoute>
        }
      />
      <Route
        path="/reservations/:id/details"
        element={
          <ProtectedClientRoute>
            <ReservationDetails
              open={true}
              onClose={() => { }}
              reservationId={null}
            />
          </ProtectedClientRoute>
        }
      />
      <Route
        path="/reservations/:id/edit"
        element={
          <ProtectedClientRoute>
            <ReservationEdit
              open={true}
              onClose={() => { }}
              reservationId={null}
            />
          </ProtectedClientRoute>
        }
      />
    </Routes>
  );
};
export default ClientRoutes;

