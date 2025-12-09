import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Divider,
  Grid,
} from "@mui/material";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import LocalAtmIcon from "@mui/icons-material/LocalAtm";
import PersonIcon from "@mui/icons-material/Person";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";

dayjs.extend(isBetween);

// Interface de la réservation - Mise à jour pour correspondre au backend
export interface Reservation {
  id: number;
  reference: string;
  pickup_date: string;
  return_date: string;
  total_price: number;
  status: string;
  client: {
    id: number;
    lastName: string;
    email: string;
    phone: string;
  };
  vehicule: {
    id: number;
    nom?: string;
    marque: string;
    modele: string;
    immatriculation: string;
    imageUrl: string | null;
    type: { id: number; type: string };
    status: { id: number; status: string };
  };
  region: {
    id: number;
    nom_region: string;
    nom_district: string;
    prix?: { id: number; prix: number };
  };
}

interface ReservationDetailsDialogProps {
  open: boolean;
  onClose: () => void;
  reservation: Reservation | null; // Changement: on passe l'objet entier
}

// Nouvelle fonction utilitaire pour déterminer le statut affiché
const getDisplayedStatus = (
  reservation: Reservation | null | undefined
): string | undefined => {
  if (!reservation) {
    return undefined;
  }

  const today = dayjs();
  const startDate = dayjs(reservation.pickup_date);
  const endDate = dayjs(reservation.return_date);

  if (reservation.status === "Annulée") {
    return "Annulée";
  }
  if (reservation.status === "Terminée") {
    return "Terminée";
  }

  if (today.isBefore(startDate, "day")) {
    return "À venir";
  }
  if (today.isBetween(startDate, endDate, "day", "[]")) {
    return "En cours";
  }
  if (today.isAfter(endDate, "day")) {
    return "Terminée";
  }

  return reservation.status;
};

const ReservationDetailsDialog: React.FC<ReservationDetailsDialogProps> = ({
  open,
  onClose,
  reservation,
}) => {
  const displayedStatus = getDisplayedStatus(reservation);

  const getStatusColor = (status: string | undefined) => {
    switch (status) {
      case "Annulée":
        return "red";
      case "Terminée":
        return "green";
      case "En cours":
        return "orange";
      case "À venir":
        return "blue";
      default:
        return "inherit";
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Détails de la réservation #{reservation?.reference || reservation?.id}</DialogTitle>
      <DialogContent dividers>
        {reservation ? (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                Informations Véhicule
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Box sx={{ mb: 2, display: "flex", justifyContent: "center" }}>
                <img
                  src={
                    reservation.vehicule.imageUrl ||
                    "https://via.placeholder.com/250x150?text=Image+Vehicule"
                  }
                  alt={`${reservation.vehicule.marque} ${reservation.vehicule.modele}`}
                  style={{
                    width: "100%",
                    maxWidth: 250,
                    height: 150,
                    objectFit: "cover",
                    borderRadius: 8,
                  }}
                />
              </Box>
              <Typography
                variant="body1"
                sx={{ display: "flex", alignItems: "center", mb: 1 }}
              >
                <DirectionsCarIcon sx={{ mr: 1 }} color="action" />
                <strong>Marque:</strong> {reservation.vehicule.marque}
              </Typography>
              <Typography
                variant="body1"
                sx={{ display: "flex", alignItems: "center", mb: 1 }}
              >
                <DirectionsCarIcon sx={{ mr: 1 }} color="action" />
                <strong>Modèle:</strong> {reservation.vehicule.modele}
              </Typography>
              <Typography
                variant="body1"
                sx={{ display: "flex", alignItems: "center", mb: 1 }}
              >
                <DirectionsCarIcon sx={{ mr: 1 }} color="action" />
                <strong>Immatriculation:</strong>{" "}
                {reservation.vehicule.immatriculation}
              </Typography>
              <Typography
                variant="body1"
                sx={{ display: "flex", alignItems: "center", mb: 1 }}
              >
                <DirectionsCarIcon sx={{ mr: 1 }} color="action" />
                <strong>Type:</strong>{" "}
                {reservation.vehicule?.type?.type || "N/A"}
              </Typography>
              <Typography
                variant="body1"
                sx={{ display: "flex", alignItems: "center", mb: 1 }}
              >
                <DirectionsCarIcon sx={{ mr: 1 }} color="action" />
                <strong>Statut du véhicule:</strong>{" "}
                {reservation.vehicule.status.status}
              </Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                Informations Réservation
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Typography
                variant="body1"
                sx={{ display: "flex", alignItems: "center", mb: 1 }}
              >
                <CalendarTodayIcon sx={{ mr: 1 }} color="action" />
                <strong>Début:</strong>{" "}
                {dayjs(reservation.pickup_date).format("dddd D MMMM YYYY")}
              </Typography>
              <Typography
                variant="body1"
                sx={{ display: "flex", alignItems: "center", mb: 1 }}
              >
                <CalendarTodayIcon sx={{ mr: 1 }} color="action" />
                <strong>Fin:</strong>{" "}
                {dayjs(reservation.return_date).format("dddd D MMMM YYYY")}
              </Typography>
              <Typography
                variant="body1"
                sx={{ display: "flex", alignItems: "center", mb: 1 }}
              >
                <LocationOnIcon sx={{ mr: 1 }} color="action" />
                <strong>Destination de prise en charge:</strong>{" "}
                {reservation.region.nom_region} (
                {reservation.region.nom_district})
              </Typography>
              <Typography
                variant="body1"
                sx={{ display: "flex", alignItems: "center", mb: 1 }}
              >
                <LocalAtmIcon sx={{ mr: 1 }} color="action" />
                <strong>Prix par jour:</strong> {reservation.region.prix?.prix || "N/A"}{" "}
                Ar
              </Typography>
              <Typography
                variant="h6"
                color="primary"
                sx={{ display: "flex", alignItems: "center", mt: 2 }}
              >
                <LocalAtmIcon sx={{ mr: 1 }} color="primary" />
                <strong>Prix total:</strong> {reservation.total_price} Ar
              </Typography>
              <Typography
                variant="body1"
                sx={{ display: "flex", alignItems: "center", mt: 1 }}
              >
                <strong>Statut Réservation:</strong>{" "}
                <span
                  style={{
                    marginLeft: 8,
                    fontWeight: "bold",
                    color: getStatusColor(displayedStatus),
                  }}
                >
                  {displayedStatus}
                </span>
              </Typography>

              <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                Informations Client
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Typography
                variant="body1"
                sx={{ display: "flex", alignItems: "center", mb: 1 }}
              >
                <PersonIcon sx={{ mr: 1 }} color="action" />
                <strong>Nom complet:</strong> {reservation.client.lastName}
              </Typography>
              <Typography
                variant="body1"
                sx={{ display: "flex", alignItems: "center", mb: 1 }}
              >
                <PhoneIcon sx={{ mr: 1 }} color="action" />
                <strong>Téléphone:</strong> {reservation.client.phone}
              </Typography>
              <Typography
                variant="body1"
                sx={{ display: "flex", alignItems: "center", mb: 1 }}
              >
                <EmailIcon sx={{ mr: 1 }} color="action" />
                <strong>Email:</strong> {reservation.client.email}
              </Typography>
            </Grid>
          </Grid>
        ) : (
          <Typography>Aucune réservation sélectionnée.</Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary" variant="contained">
          Fermer
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ReservationDetailsDialog;
