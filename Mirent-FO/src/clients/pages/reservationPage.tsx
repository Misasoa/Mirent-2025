import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  TextField,
  Typography,
  Grid,
  Chip,
  CircularProgress,
  Alert,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import { motion } from "framer-motion";
import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import BuildIcon from "@mui/icons-material/Build";
import SentimentDissatisfiedIcon from "@mui/icons-material/SentimentDissatisfied";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import dayjs, { Dayjs } from "dayjs";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import Navbar from "../Components/Navbar";
import { CarburantPolicy } from "../../redux/features/reservation/reservationSlice";

// Types
interface Vehicle {
  id: number;
  marque: string;
  modele: string;
  status: { status: string }; // Assurez-vous que ceci correspond à votre entité Status côté backend
  type: { type: string };
  imageUrl: string;
  description?: string;
  features?: string[];
  immatriculation?: string;
  nombrePlace?: number;
}

// Type pour les données de région
interface Region {
  id: number;
  nom_region: string;
  nom_district: string;
  prix: { id: number; prix: number }; // Ajout du prix pour chaque région
}
interface Prix {
  id: number;
  prix: number;
}

// Palette de couleurs
const COLORS = {
  primary: "#4A90E2",
  secondary: "#50C878",
  danger: "#FF3B30",
  background: "#F9FAFB",
  surface: "#FFFFFF",
  text: "#1A1A2E",
};

// Sous-composant : Fiche Véhicule
const VehicleSummary: React.FC<{ vehicle: Vehicle }> = ({ vehicle }) => (
  <Card
    sx={{
      borderRadius: 4,
      boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
      bgcolor: COLORS.surface,
      transition: "transform 0.3s ease, box-shadow 0.3s ease",
      "&:hover": {
        transform: "translateY(-6px)",
        boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.15)",
      },
    }}
  >
    <Box
      component="img"
      src={
        vehicle.imageUrl ||
        "https://via.placeholder.com/600x338?text=Image+Indisponible "
      }
      alt={`${vehicle.marque} ${vehicle.modele}`}
      sx={{
        width: "100%",
        height: { xs: 200, sm: 240, md: 300 },
        objectFit: "cover",
        borderRadius: 2,
        mb: 2,
        transition: "transform 0.3s ease",
        "&:hover": {
          transform: "scale(1.05)",
        },
        boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
      }}
    />
    <CardContent>
      <Typography
        variant="h5"
        fontWeight="bold"
        color={COLORS.text}
        gutterBottom
      >
        {vehicle.marque} {vehicle.modele}
      </Typography>
      <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
        <Chip
          icon={
            vehicle.status.status === "Disponible" ? (
              <CheckCircleIcon />
            ) : vehicle.status.status === "Réservé" ? (
              <CancelIcon />
            ) : (
              <BuildIcon />
            )
          }
          label={vehicle.status.status}
          size="small"
          sx={{
            bgcolor:
              vehicle.status.status === "Disponible"
                ? "#e8f5e9"
                : vehicle.status.status === "Réservé"
                  ? "#fff3e0"
                  : "#ffebee",
            color:
              vehicle.status.status === "Disponible"
                ? "#2e7d32"
                : vehicle.status.status === "Réservé"
                  ? "#f57c00"
                  : "#d32f2f",
            fontWeight: 600,
          }}
        />
        <Chip
          icon={<DirectionsCarIcon />}
          label={vehicle.type.type}
          size="small"
          sx={{
            bgcolor: "#e3f2fd",
            color: "#1565c0",
            fontWeight: 600,
          }}
        />
      </Box>
      {vehicle.immatriculation && (
        <Typography variant="body2" color="#64748b">
          Immatriculation: {vehicle.immatriculation}
        </Typography>
      )}
      {vehicle.nombrePlace && (
        <Typography variant="body2" color="#64748b">
          Places: {vehicle.nombrePlace}
        </Typography>
      )}
    </CardContent>
  </Card>
);

interface ReservationData {
  startDate: Dayjs;
  endDate: Dayjs;
  region: string;
  totalPrice: number;
  regionId: number;
}

const ReservationForm: React.FC<{
  onSubmit: (data: ReservationData) => void;
  vehicle: Vehicle;
  regions: Region[];
}> = ({ onSubmit, vehicle, regions }) => {
  const [startDate, setStartDate] = useState<Dayjs | null>(null);
  const [endDate, setEndDate] = useState<Dayjs | null>(null);
  const [region, setRegion] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!startDate) newErrors.startDate = "Date de début requise";
    if (!endDate) newErrors.endDate = "Date de fin requise";
    if (startDate && endDate && startDate.isAfter(endDate, "day")) {
      newErrors.endDate =
        "La date de fin doit être après ou égale à la date de début.";
    }
    if (startDate?.isBefore(dayjs(), "day"))
      newErrors.startDate = "La date de début ne peut pas être dans le passé.";
    if (!region) newErrors.region = "Région requise";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      const selectedRegion = regions.find((r) => r.nom_region === region);
      onSubmit({
        startDate: startDate!,
        endDate: endDate!,
        region,
        totalPrice,
        regionId: selectedRegion?.id || 0,
      });
    }
  };

  // Correction : Calcul du nombre de jours pour inclure la date de fin
  const numberOfDays =
    startDate &&
      endDate &&
      (endDate.isSame(startDate, "day") || endDate.isAfter(startDate, "day")) // Vérifie que endDate est après ou égale à startDate
      ? endDate.diff(startDate, "day") + 1 // Ajoute 1 pour inclure le jour de fin dans le calcul
      : 0;

  const selectedRegion = regions.find((r) => r.nom_region === region);
  const totalPrice = selectedRegion
    ? Number(selectedRegion.prix.prix) * numberOfDays
    : 0;

  return (
    <Card
      sx={{
        borderRadius: 4,
        boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
        bgcolor: COLORS.surface,
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
        "&:hover": {
          transform: "translateY(-6px)",
          boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.15)",
        },
      }}
    >
      <CardContent>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Réserver ce véhicule
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Date de début"
                value={startDate}
                onChange={(newValue) => setStartDate(newValue as Dayjs | null)}
                minDate={dayjs()} // Empêche les dates passées
                slotProps={{
                  textField: {
                    fullWidth: true,
                    error: !!errors.startDate,
                    helperText: errors.startDate,
                  },
                }}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={12} sm={6}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Date de fin"
                value={endDate}
                onChange={(newValue) => setEndDate(newValue as Dayjs | null)}
                minDate={startDate || dayjs()} // La date de fin ne peut pas être avant la date de début
                slotProps={{
                  textField: {
                    fullWidth: true,
                    error: !!errors.endDate,
                    helperText: errors.endDate,
                  },
                }}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth error={!!errors.region}>
              <InputLabel>Destination</InputLabel>
              <Select
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                label="Destination"
              >
                {regions.map((r) => (
                  <MenuItem key={r.id} value={r.nom_region}>
                    {r.nom_region} ({r.nom_district})
                  </MenuItem>
                ))}
              </Select>
              {errors.region && (
                <Typography color="error">{errors.region}</Typography>
              )}
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <Box
              sx={{
                bgcolor: "#F1F5F9",
                p: 2,
                borderRadius: 2,
                textAlign: "center",
              }}
            >
              <Typography
                fontWeight="bold"
                color={selectedRegion ? COLORS.primary : "text.secondary"}
              >
                Prix par jour :{" "}
                {selectedRegion
                  ? `${selectedRegion.prix.prix} Ar`
                  : "Sélectionnez une région"}
              </Typography>
              {selectedRegion && (
                <Typography fontWeight="bold" color={COLORS.text} mt={1}>
                  Total : {totalPrice} Ar
                </Typography>
              )}
            </Box>
          </Grid>
        </Grid>

        <Box sx={{ mt: 3, textAlign: "center" }}>
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={vehicle.status.status !== "Disponible"}
              fullWidth
              sx={{
                bgcolor: COLORS.primary,
                color: "#fff",
                py: 1.5,
                fontWeight: 600,
                fontSize: "1rem",
                "&:hover": { bgcolor: "#357ABD" },
                "&:disabled": { bgcolor: "#ccc", cursor: "not-allowed" },
              }}
            >
              Confirmer la Réservation
            </Button>
          </motion.div>
        </Box>
      </CardContent>
    </Card>
  );
};

const ReservationPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [regionsData, setRegionsData] = useState<Region[]>([]);

  // Récupérer les informations du client connecté depuis localStorage
  const [userInfo, setUserInfo] = useState<{ id: number; email: string; firstName: string; lastName: string; role: string } | null>(null);

  useEffect(() => {
    const userInfoStr = localStorage.getItem("user_info");
    if (userInfoStr) {
      try {
        setUserInfo(JSON.parse(userInfoStr));
      } catch (error) {
        console.error("Erreur lors de la lecture de user_info:", error);
      }
    }
  }, []);

  const vehicles = useSelector((state: RootState) => state.vehicles.vehicles);
  const vehicle = vehicles.find((v) => v.id === parseInt(id || "0"));


  const fetchRegions = useCallback(async () => {
    try {
      const response = await fetch("http://localhost:3000/regions"); // Assurez-vous que l'URL est correcte
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setRegionsData(data);
    } catch (err) {
      console.error("Error fetching regions:", err);
      setError("Erreur lors du chargement des régions.");
    }
  }, []);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      await new Promise((resolve) => setTimeout(resolve, 800)); // Simule un chargement

      if (!vehicle) {
        throw new Error("Véhicule non trouvé");
      }
      // Note: La validation de disponibilité est déjà faite côté backend.
      // Vous pouvez garder ce check pour un feedback rapide côté client.
      if (vehicle.status.status !== "Disponible") {
        throw new Error("Ce véhicule n'est pas disponible pour la réservation");
      }

      await fetchRegions();

      setIsLoading(false);
    } catch (err) {
      setError((err as Error).message);
      setIsLoading(false);
    }
  }, [vehicle, fetchRegions]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleReservationSubmit = async (data: ReservationData) => {
    try {
      // Vérifier que l'utilisateur est bien connecté
      if (!userInfo || !userInfo.email) {
        throw new Error("Vous devez être connecté pour effectuer une réservation");
      }

      const token = localStorage.getItem("access_token");
      if (!token) {
        throw new Error("Session expirée, veuillez vous reconnecter");
      }

      // Récupérer le clientId depuis la table clients via l'email
      console.log("🔍 Récupération du client par email:", userInfo.email);
      const clientResponse = await fetch(
        `http://localhost:3000/clients?email=${encodeURIComponent(userInfo.email)}`,
        {
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        }
      );

      if (!clientResponse.ok) {
        throw new Error("Impossible de trouver votre profil client");
      }

      const clients = await clientResponse.json();
      if (!clients || clients.length === 0) {
        throw new Error("Votre profil client n'existe pas. Veuillez contacter le support.");
      }

      const clientId = clients[0].id;
      console.log("✅ Client trouvé avec ID:", clientId);

      // Créer le payload pour l'API devis
      const devisPayload = {
        clientId: clientId,
        vehiculeId: vehicle?.id,
        pickup_date: data.startDate.format("YYYY-MM-DD"),
        return_date: data.endDate.format("YYYY-MM-DD"),
        region_id: data.regionId,
        carburant_policy: CarburantPolicy.PLEIN_A_PLEIN,
        carburant_depart: 100,
        kilometrage_depart: 0,
      };

      console.log("📝 Envoi de la demande de devis:", devisPayload);

      const response = await fetch("http://localhost:3000/reservations/devis", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(devisPayload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message ||
          "Une erreur est survenue lors de la création du devis."
        );
      }

      const result = await response.json();
      console.log("✅ Devis créé avec succès:", result);

      setSuccess(true);
      setTimeout(() => navigate("/reservations-list"), 2000);
    } catch (err) {
      console.error("Erreur lors de la création du devis:", err);
      setError((err as Error).message || "Une erreur inconnue est survenue.");
    }
  };

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          bgcolor: COLORS.background,
        }}
      >
        <CircularProgress size={60} sx={{ color: COLORS.primary }} />
      </Box>
    );
  }

  if (error || !vehicle) {
    return (
      <Box
        sx={{
          width: "100%",
          textAlign: "center",
          py: 10,
          bgcolor: COLORS.background,
        }}
      >
        <SentimentDissatisfiedIcon
          sx={{ fontSize: 80, color: "#aaa", mb: 2 }}
        />
        <Typography variant="h5" color="#333" mb={3}>
          {error || "Véhicule non trouvé"}
        </Typography>
        <Button
          variant="contained"
          onClick={() => navigate("/list-vehicule")}
          sx={{
            bgcolor: COLORS.primary,
            color: "#fff",
            px: 4,
            py: 1.5,
            fontWeight: 600,
            "&:hover": { bgcolor: "#357ABD" },
          }}
        >
          Retour à la Flotte
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ bgcolor: COLORS.background, pb: 8, pt: { xs: 10, md: 12 } }}>
      <Navbar />{" "}
      {/* Assurez-vous que le Navbar est importé et rendu correctement */}
      <Container maxWidth="lg">
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/list-vehicule")}
          sx={{
            color: COLORS.primary,
            mb: 4,
            textTransform: "none",
            fontWeight: 600,
          }}
        >
          Retour à la flotte
        </Button>

        <Typography variant="h4" align="center" fontWeight="bold" gutterBottom>
          Réserver votre {vehicle.marque} {vehicle.modele}
        </Typography>

        {success ? (
          <Alert
            severity="success"
            icon={<CheckCircleOutlineIcon />}
            sx={{ mb: 4 }}
          >
            Réservation confirmée ! Vous serez redirigé vers la liste des
            véhicules.
          </Alert>
        ) : (
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <VehicleSummary vehicle={vehicle} />
            </Grid>
            <Grid item xs={12} md={6}>
              <ReservationForm
                vehicle={vehicle}
                onSubmit={handleReservationSubmit}
                regions={regionsData}
              />
            </Grid>
          </Grid>
        )}
      </Container>
    </Box>
  );
};

export default ReservationPage;
