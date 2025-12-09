// src/components/reservations/ReservationEditDialog.tsx
import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Box,
  CircularProgress,
  Alert,
  Grid,
} from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs, { Dayjs } from "dayjs";

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

// Interface pour le DTO de mise à jour
interface UpdateReservationDto {
  pickup_date?: string;
  return_date?: string;
  // Les infos client ne sont généralement pas modifiables via la réservation elle-même dans ce contexte, 
  // mais si le backend le permet, on garde la structure.
  // Note: D'après le code précédent, on modifiait fullName/phone/email. 
  // Si ces champs appartiennent au client, il faudrait peut-être mettre à jour le client, pas la réservation.
  // Supposons pour l'instant qu'on envoie ces champs au backend qui gère la mise à jour.
  fullName?: string;
  phone?: string;
  email?: string;
}

interface ReservationEditDialogProps {
  open: boolean;
  onClose: (updated?: boolean) => void;
  reservation: Reservation | null; // Changement: on passe l'objet entier
}

const ReservationEditDialog: React.FC<ReservationEditDialogProps> = ({
  open,
  onClose,
  reservation,
}) => {
  // État local pour les champs modifiables
  const [formData, setFormData] = useState({
    startDate: null as Dayjs | null,
    endDate: null as Dayjs | null,
    fullName: "",
    phone: "",
    email: "",
  });

  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Initialiser le formulaire quand la réservation change
  useEffect(() => {
    if (reservation && open) {
      setFormData({
        startDate: dayjs(reservation.pickup_date),
        endDate: dayjs(reservation.return_date),
        fullName: reservation.client.lastName,
        phone: reservation.client.phone,
        email: reservation.client.email,
      });
      setError(null);
      setSuccess(null);
    }
  }, [reservation, open]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(null);
    setSuccess(null);
  };

  const handleDateChange = (
    date: Dayjs | null,
    name: "startDate" | "endDate"
  ) => {
    setFormData((prev) => ({
      ...prev,
      [name]: date,
    }));
    setError(null);
    setSuccess(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reservation) return;

    setIsSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const dataToSend: any = {};

      // Détection des changements
      if (formData.fullName !== reservation.client.lastName) {
        dataToSend.fullName = formData.fullName;
      }
      if (formData.phone !== reservation.client.phone) {
        dataToSend.phone = formData.phone;
      }
      if (formData.email !== reservation.client.email) {
        dataToSend.email = formData.email;
      }

      const originalStartDate = dayjs(reservation.pickup_date);
      const originalEndDate = dayjs(reservation.return_date);

      if (formData.startDate && !formData.startDate.isSame(originalStartDate, "day")) {
        dataToSend.pickup_date = formData.startDate.format("YYYY-MM-DD");
      }
      if (formData.endDate && !formData.endDate.isSame(originalEndDate, "day")) {
        dataToSend.return_date = formData.endDate.format("YYYY-MM-DD");
      }

      if (Object.keys(dataToSend).length === 0) {
        setSuccess("Aucune modification à sauvegarder.");
        setIsSaving(false);
        return;
      }

      // Note: Assurez-vous que votre backend accepte ces champs pour une mise à jour de réservation
      // Si le backend attend 'startDate' au lieu de 'pickup_date', ajustez ici.
      // D'après le code précédent, le backend semblait attendre startDate/endDate.
      // Mais le GET renvoie pickup_date/return_date.
      // Je vais utiliser les noms du GET pour la cohérence, mais si ça échoue, il faudra vérifier le DTO du backend.

      // Correction potentielle pour le backend:
      // Si le backend attend startDate/endDate dans le body du PATCH:
      if (dataToSend.pickup_date) {
        dataToSend.startDate = dataToSend.pickup_date; // Alias pour sécurité
        // delete dataToSend.pickup_date; // Garder les deux au cas où
      }
      if (dataToSend.return_date) {
        dataToSend.endDate = dataToSend.return_date; // Alias pour sécurité
        // delete dataToSend.return_date;
      }

      const response = await fetch(
        `http://localhost:3000/reservations/${reservation.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            // 'Authorization': `Bearer ...` 
          },
          body: JSON.stringify(dataToSend),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Échec de la mise à jour.");
      }

      setSuccess("Réservation mise à jour avec succès !");
      onClose(true); // Rafraîchir la liste
    } catch (err) {
      console.error("Erreur lors de la sauvegarde:", err);
      setError(
        "Erreur lors de la sauvegarde: " +
        (err instanceof Error ? err.message : String(err))
      );
    } finally {
      setIsSaving(false);
    }
  };

  if (!reservation) return null;

  return (
    <Dialog open={open} onClose={() => onClose()} maxWidth="md" fullWidth>
      <DialogTitle>Modifier la réservation #{reservation.reference || reservation.id}</DialogTitle>
      <DialogContent dividers>
        {error && !isSaving && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            {/* Informations Client */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Informations Client
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Nom complet"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                fullWidth
                margin="normal"
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Téléphone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                fullWidth
                margin="normal"
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                fullWidth
                margin="normal"
                required
              />
            </Grid>

            {/* Période de Réservation */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                Période de Réservation
              </Typography>
            </Grid>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <Grid item xs={12} sm={6}>
                <DatePicker
                  label="Date de début"
                  value={formData.startDate}
                  onChange={(date) => handleDateChange(date, "startDate")}
                  format="DD/MM/YYYY"
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      margin: "normal",
                      required: true,
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <DatePicker
                  label="Date de fin"
                  value={formData.endDate}
                  onChange={(date) => handleDateChange(date, "endDate")}
                  format="DD/MM/YYYY"
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      margin: "normal",
                      required: true,
                    },
                  }}
                />
              </Grid>
            </LocalizationProvider>

            {/* Informations non modifiables affichées */}
            <Grid item xs={12} mt={2}>
              <Typography variant="h6" gutterBottom>
                Informations Véhicule et Région (non modifiables)
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Véhicule"
                value={`${reservation.vehicule?.marque || ""} ${reservation.vehicule?.modele || ""} (${reservation.vehicule?.immatriculation || ""})`}
                fullWidth
                margin="normal"
                disabled
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Région de prise en charge"
                value={`${reservation.region?.nom_region || ""} (${reservation.region?.nom_district || ""})`}
                fullWidth
                margin="normal"
                disabled
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Prix total (indicatif)"
                value={`${reservation.total_price} Ar`}
                fullWidth
                margin="normal"
                disabled
              />
            </Grid>
          </Grid>
          <DialogActions sx={{ px: 0, pt: 3 }}>
            <Button onClick={() => onClose()} disabled={isSaving}>
              Annuler
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={isSaving}
            >
              {isSaving ? (
                <CircularProgress size={24} />
              ) : (
                "Sauvegarder les modifications"
              )}
            </Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ReservationEditDialog;
