// src/pages/ReservationList.tsx
import React, { useEffect, useState, useCallback } from "react";
import {
  Box,
  Typography,
  Card,
  Grid,
  Button,
  Chip,
  Stack,
  TextField,
  InputAdornment,
  ButtonGroup,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Pagination,
  CircularProgress,
  Alert,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import AssignmentIcon from "@mui/icons-material/Assignment";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import Navbar from "../Components/Navbar";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter"; // Import for isSameOrAfter
import { Link } from "react-router-dom";
import SentimentDissatisfiedIcon from "@mui/icons-material/SentimentDissatisfied";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../redux/store";
import { confirmReservation } from "../../redux/features/reservation/reservationSlice";

// Importez les nouveaux composants Dialog
import ReservationDetails from "../pages/reservationDetailPage";
import ReservationEdit from "../pages/reservationEditPage";

dayjs.extend(isBetween);
dayjs.extend(isSameOrAfter); // Extend dayjs with isSameOrAfter

// URL de base de votre API NestJS (à ajuster si nécessaire)
const API_BASE_URL = "http://localhost:3000";

// Enumération pour les statuts de réservation (doit correspondre à ReservationStatus.ts du backend)
enum ReservationStatus {
  UPCOMING = "À venir",
  IN_PROGRESS = "En cours",
  COMPLETED = "Terminée",
  CANCELLED = "Annulée",
  PENDING_PAYMENT = "En attente de paiement",
  CONFIRMED = "Confirmée", // Potentiellement utilisé si vous avez une étape de confirmation explicite
}

// Interface Reservation - correspond à la structure du backend
interface Reservation {
  id: number;
  reference: string; // Référence unique de la réservation
  pickup_date: string; // Date de début 
  return_date: string; // Date de fin
  total_price: number;
  status: string; // "devis", "confirmee", "annulee", "terminee"
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
  region: { // Région de prise en charge
    id: number;
    nom_region: string;
    nom_district: string;
  };
  nombreJours: number;
  created_at: string;
  updated_at: string;
}

const itemsPerPage = 4;

const ReservationList: React.FC = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState("Toutes"); // Filtre basé sur le statut affiché
  const [sort, setSort] = useState("recent");
  const [searchText, setSearchText] = useState("");
  const [page, setPage] = useState(1);
  const dispatch = useDispatch<AppDispatch>();

  // États pour les modales
  const [openCancelDialog, setOpenCancelDialog] = useState(false);
  const [reservationToCancel, setReservationToCancel] = useState<number | null>(
    null
  );

  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [selectedReservation, setSelectedReservation] =
    useState<Reservation | null>(null);

  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [proformas, setProformas] = useState<any[]>([]);

  /**
   * Récupère la liste des réservations du client connecté depuis le backend.
   */
  const fetchReservations = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Récupérer l'email du client connecté
      const userInfoStr = localStorage.getItem("user_info");
      if (!userInfoStr) {
        throw new Error("Vous devez être connecté pour voir vos réservations.");
      }

      const userInfo = JSON.parse(userInfoStr);
      const token = localStorage.getItem("access_token");

      // Récupérer d'abord le clientId via l'email
      const clientResponse = await fetch(
        `${API_BASE_URL}/clients?email=${encodeURIComponent(userInfo.email)}`,
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }
      );

      if (!clientResponse.ok) {
        throw new Error("Impossible de récupérer votre profil client.");
      }

      const clients = await clientResponse.json();
      if (!clients || clients.length === 0) {
        throw new Error("Profil client introuvable.");
      }

      const clientId = clients[0].id;
      console.log("📋 Récupération des réservations pour le client ID:", clientId);

      // Récupérer les réservations du client
      const response = await fetch(
        `${API_BASE_URL}/reservations?clientId=${clientId}`,
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "Échec de la récupération des réservations."
        );
      }

      const data: Reservation[] = await response.json();
      console.log("✅ Réservations récupérées:", data);
      setReservations(data);
    } catch (err) {
      console.error("Erreur lors de la récupération des réservations:", err);
      setError("Erreur lors du chargement des réservations.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReservations();
    // Récupérer aussi les proformas pour savoir lesquelles ont un PDF disponible
    const fetchProformas = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const response = await fetch(`${API_BASE_URL}/proforma`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        if (response.ok) {
          const data = await response.json();
          setProformas(data || []);
          console.log("📄 Proformas chargées:", data.length);
        }
      } catch (err) {
        console.error("Erreur chargement proformas:", err);
      }
    };
    fetchProformas();
  }, [fetchReservations]);

  // --- Fonctions de gestion des modales et actions ---

  // Ouvrir la modale de détails
  const handleViewDetails = (reservation: Reservation) => {
    setSelectedReservation(reservation);
    setOpenDetailsDialog(true);
  };

  // Fermer la modale de détails
  const handleCloseDetailsDialog = () => {
    setOpenDetailsDialog(false);
    setSelectedReservation(null);
  };

  // Ouvrir la modale d'édition
  const handleEdit = (reservation: Reservation) => {
    setSelectedReservation(reservation);
    setOpenEditDialog(true);
  };

  // Fermer la modale d'édition
  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
    setSelectedReservation(null);
    fetchReservations(); // Recharger les réservations après une édition potentielle
  };

  // Demander confirmation avant d'annuler
  const handleConfirmCancel = (id: number) => {
    setReservationToCancel(id);
    setOpenCancelDialog(true);
  };

  // Annuler la réservation après confirmation (appel PATCH au lieu de DELETE)
  const handleCancelReservation = async () => {
    if (reservationToCancel === null) return;

    setOpenCancelDialog(false); // Ferme la modale de confirmation
    setIsLoading(true); // Indique le chargement
    setError(null); // Réinitialise l'erreur

    try {
      // Le backend attend maintenant un PATCH à /reservations/:id/cancel
      const response = await fetch(
        `${API_BASE_URL}/reservations/${reservationToCancel}/cancel`,
        {
          method: "PATCH", // CHANGEMENT: Passer de DELETE à PATCH
          headers: { "Content-Type": "application/json" },
          // Pas besoin de corps car la logique de statut est gérée côté service
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "Échec de l'annulation de la réservation."
        );
      }

      await fetchReservations(); // Recharger la liste après succès
      // Utiliser une alerte MUI ou un SnackBar pour un meilleur UX au lieu de `alert()`
      // setSuccessMessage("Réservation annulée avec succès !");
      console.log("Réservation annulée avec succès !"); // À remplacer par un vrai système de notification
    } catch (err) {
      console.error("Erreur lors de l'annulation:", err);
      setError(
        "Échec de l'annulation de la réservation: " + (err as Error).message
      );
    } finally {
      setIsLoading(false); // Arrête le chargement
      setReservationToCancel(null); // Réinitialise l'ID de la réservation à annuler
    }
  };

  // Confirmer un devis (transformer en bon de commande)
  const handleConfirmQuote = async (reservationId: number) => {
    try {
      setIsLoading(true);
      await dispatch(confirmReservation(reservationId)).unwrap();
      await fetchReservations(); // Recharger la liste
      console.log("✅ Devis confirmé avec succès !");
    } catch (err) {
      console.error("Erreur lors de la confirmation du devis:", err);
      setError("Échec de la confirmation du devis: " + (err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  // Télécharger le PDF de la proforma
  const handleDownloadProformaPDF = async (reservationId: number) => {
    try {
      console.log("🔍 Tentative de téléchargement PDF pour réservation ID:", reservationId);
      const token = localStorage.getItem("access_token");

      // Étape 1: Récupérer toutes les proformas pour trouver celle de cette réservation
      console.log("📡 Récupération de toutes les proformas...");
      const proformasResponse = await fetch(
        `${API_BASE_URL}/proforma`,
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }
      );

      if (!proformasResponse.ok) {
        console.error("❌ Erreur récupération proformas:", proformasResponse.status);
        throw new Error("Impossible de récupérer les proformas");
      }

      const proformas = await proformasResponse.json();
      console.log("✅ Proformas récupérées:", proformas);
      console.log("🔍 Nombre de proformas:", proformas.length);

      // Trouver la proforma qui correspond à cette réservation
      const proforma = proformas.find((p: any) => {
        console.log(`Checking proforma ${p.id}, reservation:`, p.reservation);
        return p.reservation?.id === reservationId;
      });

      console.log("🎯 Proforma trouvée:", proforma);

      if (!proforma) {
        console.error("❌ Aucune proforma trouvée pour reservation ID:", reservationId);
        throw new Error("Aucune proforma trouvée pour cette réservation. Veuillez contacter le support.");
      }

      // Étape 2: Télécharger le PDF de la proforma
      console.log("📥 Téléchargement du PDF pour proforma ID:", proforma.id);
      const pdfResponse = await fetch(
        `${API_BASE_URL}/proforma/${proforma.id}/pdf`,
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }
      );

      if (!pdfResponse.ok) {
        console.error("❌ Erreur téléchargement PDF:", pdfResponse.status);
        throw new Error(`Impossible de télécharger le PDF (${pdfResponse.status})`);
      }

      // Créer un blob à partir de la réponse
      const blob = await pdfResponse.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `proforma_${proforma.proformaNumber || reservationId}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      console.log("✅ PDF téléchargé avec succès!");
    } catch (err) {
      console.error("❌ Erreur lors du téléchargement du PDF:", err);
      const errorMessage = (err as Error).message || "Erreur inconnue";
      setError("Échec du téléchargement du PDF: " + errorMessage);
      // Afficher aussi une alerte pour l'utilisateur
      alert("Erreur: " + errorMessage);
    }
  };

  // Logique de filtrage, tri et pagination
  const filteredReservations = reservations.filter((res) => {
    // Vérification de sécurité : si vehicle est undefined, on ne peut pas rechercher dessus
    const matchSearch = res.vehicule
      ? res.vehicule.modele.toLowerCase().includes(searchText.toLowerCase()) ||
      res.vehicule.marque.toLowerCase().includes(searchText.toLowerCase()) ||
      res.vehicule.immatriculation
        .toLowerCase()
        .includes(searchText.toLowerCase()) ||
      res.client?.lastName?.toLowerCase().includes(searchText.toLowerCase()) ||
      res.client?.email?.toLowerCase().includes(searchText.toLowerCase()) ||
      res.client?.phone?.includes(searchText)
      : // Si vehicule est undefined, chercher seulement dans les champs utilisateur  
      res.client?.lastName?.toLowerCase().includes(searchText.toLowerCase()) ||
      res.client?.email?.toLowerCase().includes(searchText.toLowerCase()) ||
      res.client?.phone?.includes(searchText);

    // La logique de détermination du statut affiché reste pertinente
    let reservationDisplayStatus: ReservationStatus;
    const today = dayjs();
    const startDate = dayjs(res.pickup_date);
    const endDate = dayjs(res.return_date);

    // Priorité à l'état "Annulée" ou "Terminée" s'il vient du backend
    if (res.status === ReservationStatus.CANCELLED) {
      reservationDisplayStatus = ReservationStatus.CANCELLED;
    } else if (res.status === ReservationStatus.COMPLETED) {
      reservationDisplayStatus = ReservationStatus.COMPLETED;
    } else if (today.isBefore(startDate, "day")) {
      reservationDisplayStatus = ReservationStatus.UPCOMING;
    } else if (today.isBetween(startDate, endDate, "day", "[]")) {
      // Inclut les bornes
      reservationDisplayStatus = ReservationStatus.IN_PROGRESS;
    } else if (today.isAfter(endDate, "day")) {
      reservationDisplayStatus = ReservationStatus.COMPLETED; // Redondant si le backend gère mais assure la cohérence
    } else {
      // Si le statut du backend est 'En attente de paiement' ou 'Confirmée'
      reservationDisplayStatus = res.status;
    }

    const matchFilter =
      filter === "Toutes" || reservationDisplayStatus === filter;
    return matchSearch && matchFilter;
  });

  const sortedReservations = [...filteredReservations].sort((a, b) => {
    if (sort === "recent") {
      return new Date(b.pickup_date).getTime() - new Date(a.pickup_date).getTime();
    } else if (sort === "ancien") {
      return new Date(a.pickup_date).getTime() - new Date(b.pickup_date).getTime();
    } else if (sort === "prix") {
      // Tri par prix (ascendant)
      return a.total_price - b.total_price;
    }
    return 0; // Fallback
  });

  const totalPages = Math.ceil(sortedReservations.length / itemsPerPage);
  const paginatedReservations = sortedReservations.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  return (
    <Box sx={{ pb: 8, pt: { xs: 10, md: 12 }, px: { xs: 2, md: 4 } }}>
      <Navbar />
      <Typography
        variant="h4"
        mb={4}
        fontWeight="bold"
        align="center"
        color="#1A1A2E"
      >
        Mes Réservations
      </Typography>

      {/* Section Statistiques */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={4}>
          <Card
            sx={{
              p: 2,
              display: "flex",
              alignItems: "center",
              gap: 2,
              borderRadius: 3,
              boxShadow: 2,
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              color: "white",
            }}
          >
            <Box
              sx={{
                bgcolor: "rgba(255, 255, 255, 0.2)",
                p: 1.5,
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <AssignmentIcon sx={{ fontSize: 32 }} />
            </Box>
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="h4" fontWeight="bold">
                {reservations.filter((r) => r.status === "devis").length}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                Devis en attente
              </Typography>
            </Box>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card
            sx={{
              p: 2,
              display: "flex",
              alignItems: "center",
              gap: 2,
              borderRadius: 3,
              boxShadow: 2,
              background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
              color: "white",
            }}
          >
            <Box
              sx={{
                bgcolor: "rgba(255, 255, 255, 0.2)",
                p: 1.5,
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <DirectionsCarIcon sx={{ fontSize: 32 }} />
            </Box>
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="h4" fontWeight="bold">
                {reservations.filter((r) => {
                  const today = dayjs();
                  const startDate = dayjs(r.pickup_date);
                  const endDate = dayjs(r.return_date);
                  return (
                    r.status !== "annulee" &&
                    r.status !== "terminee" &&
                    today.isBetween(startDate, endDate, "day", "[]")
                  );
                }).length}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                Réservations en cours
              </Typography>
            </Box>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card
            sx={{
              p: 2,
              display: "flex",
              alignItems: "center",
              gap: 2,
              borderRadius: 3,
              boxShadow: 2,
              background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
              color: "white",
            }}
          >
            <Box
              sx={{
                bgcolor: "rgba(255, 255, 255, 0.2)",
                p: 1.5,
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <EventAvailableIcon sx={{ fontSize: 32 }} />
            </Box>
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="h4" fontWeight="bold">
                {reservations.filter((r) => {
                  const today = dayjs();
                  const startDate = dayjs(r.pickup_date);
                  return (
                    r.status !== "annulee" &&
                    r.status !== "terminee" &&
                    today.isBefore(startDate, "day")
                  );
                }).length}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                Réservations à venir
              </Typography>
            </Box>
          </Card>
        </Grid>
      </Grid>

      {/* Barre de filtre supérieure */}
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          backgroundColor: "#fff",
          p: 2,
          borderRadius: 3,
          boxShadow: 2,
          mb: 3,
          gap: 2,
        }}
      >
        <TextField
          variant="outlined"
          size="small"
          placeholder="Rechercher par modèle, marque, immatriculation, client..."
          sx={{
            flexGrow: 1,
            maxWidth: 300,
            "& .MuiOutlinedInput-root": {
              borderRadius: 2,
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />

        <ButtonGroup
          variant="contained"
          color="primary"
          sx={{ borderRadius: 2 }}
        >
          {Object.values(ReservationStatus).map(
            // Utilise les valeurs de l'énumération pour les boutons
            (label) => (
              <Button
                key={label}
                variant={filter === label ? "contained" : "outlined"}
                onClick={() => setFilter(label)}
                sx={{
                  textTransform: "none",
                  fontWeight: "bold",
                }}
              >
                {label}
              </Button>
            )
          )}
          {/* Ajout du filtre "Toutes" si vous ne l'avez pas dans l'énumération */}
          <Button
            key="Toutes"
            variant={filter === "Toutes" ? "contained" : "outlined"}
            onClick={() => setFilter("Toutes")}
            sx={{
              textTransform: "none",
              fontWeight: "bold",
            }}
          >
            Toutes
          </Button>
        </ButtonGroup>

        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel id="sort-label">Trier par</InputLabel>
          <Select
            labelId="sort-label"
            value={sort}
            label="Trier par"
            onChange={(e) => setSort(e.target.value)}
          >
            <MenuItem value="recent">Plus récent</MenuItem>
            <MenuItem value="ancien">Plus ancien</MenuItem>
            <MenuItem value="prix">Prix</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Chargement/Erreur/Pas de Réservations */}
      {isLoading ? (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "40vh",
            bgcolor: "#F9FAFB",
          }}
        >
          <CircularProgress size={60} sx={{ color: "#4A90E2" }} />
          <Typography variant="h6" sx={{ mt: 2, color: "#1A1A2E" }}>
            Chargement des réservations...
          </Typography>
        </Box>
      ) : error ? (
        <Box sx={{ textAlign: "center", py: 5, bgcolor: "#F9FAFB" }}>
          <SentimentDissatisfiedIcon
            sx={{ fontSize: 80, color: "#FF3B30", mb: 2 }}
          />
          <Typography variant="h5" color="#FF3B30" mb={3}>
            {error}
          </Typography>
          <Button
            variant="contained"
            onClick={fetchReservations}
            sx={{ bgcolor: "#4A90E2", "&:hover": { bgcolor: "#357ABD" } }}
          >
            Réessayer
          </Button>
        </Box>
      ) : paginatedReservations.length === 0 ? (
        <Alert
          severity="info"
          sx={{ mt: 4, bgcolor: "#e3f2fd", color: "#1565c0" }}
        >
          <Typography variant="body1">
            Aucune réservation trouvée.
            <Link
              to="/list-vehicule"
              style={{
                color: "#4A90E2",
                textDecoration: "none",
                fontWeight: "bold",
                marginLeft: "5px",
              }}
            >
              Réservez un véhicule maintenant !
            </Link>
          </Typography>
        </Alert>
      ) : (
        <Grid container spacing={3}>
          {paginatedReservations.map((res) => {
            let displayedStatus: ReservationStatus;
            let chipColor:
              | "success"
              | "warning"
              | "error"
              | "info"
              | "primary" = "info";

            const today = dayjs();
            const startDate = dayjs(res.pickup_date);
            const endDate = dayjs(res.return_date);

            // Détermination du statut affiché basé sur la logique backend et la date actuelle
            if (res.status === ReservationStatus.CANCELLED) {
              displayedStatus = ReservationStatus.CANCELLED;
            } else if (res.status === ReservationStatus.COMPLETED) {
              displayedStatus = ReservationStatus.COMPLETED;
            } else if (today.isBefore(startDate, "day")) {
              displayedStatus = ReservationStatus.UPCOMING;
            } else if (today.isBetween(startDate, endDate, "day", "[]")) {
              displayedStatus = ReservationStatus.IN_PROGRESS;
            } else if (today.isAfter(endDate, "day")) {
              // Si le backend n'a pas encore mis à jour en "Terminée", on l'affiche comme tel
              displayedStatus = ReservationStatus.COMPLETED;
            } else {
              // Pour les autres statuts comme 'En attente de paiement', 'Confirmée'
              displayedStatus = res.status;
            }

            // Définition de la couleur du chip en fonction du statut affiché
            switch (displayedStatus) {
              case ReservationStatus.UPCOMING:
                chipColor = "primary";
                break;
              case ReservationStatus.IN_PROGRESS:
                chipColor = "warning";
                break;
              case ReservationStatus.COMPLETED:
                chipColor = "success";
                break;
              case ReservationStatus.CANCELLED:
                chipColor = "error";
                break;
              case ReservationStatus.PENDING_PAYMENT:
                chipColor = "info"; // Ou une autre couleur spécifique
                break;
              case ReservationStatus.CONFIRMED:
                chipColor = "primary"; // Peut-être une nuance différente de primary
                break;
              default:
                chipColor = "info";
            }

            // Les réservations sont annulables si elles sont À venir, En cours ou En attente de paiement/confirmée
            const isCancellable =
              displayedStatus === ReservationStatus.UPCOMING ||
              displayedStatus === ReservationStatus.IN_PROGRESS ||
              displayedStatus === ReservationStatus.PENDING_PAYMENT ||
              displayedStatus === ReservationStatus.CONFIRMED;

            // Les réservations sont modifiables uniquement si elles sont À venir ou En attente de paiement
            const isEditable =
              displayedStatus === ReservationStatus.UPCOMING ||
              displayedStatus === ReservationStatus.PENDING_PAYMENT;

            return (
              <Grid item xs={12} key={res.id}>
                <Card
                  sx={{ display: "flex", p: 2, borderRadius: 3, boxShadow: 3 }}
                >
                  <Box
                    component="img"
                    src={
                      res.vehicule?.imageUrl ||
                      "https://via.placeholder.com/200x150?text=Véhicule+Non+Disponible"
                    }
                    alt={res.vehicule?.modele || "Véhicule"}
                    sx={{
                      width: 200,
                      height: 150,
                      borderRadius: 2,
                      objectFit: "cover",
                      mr: 2,
                    }}
                  />
                  <Box
                    sx={{
                      flexGrow: 1,
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      gap: 0.5,
                      p: 1,
                    }}
                  >
                    <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                      {res.vehicule?.marque || "Inconnu"} {res.vehicule?.modele || ""}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Du {dayjs(res.pickup_date).format("DD/MM/YYYY")} au{" "}
                      {dayjs(res.return_date).format("DD/MM/YYYY")}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Immatriculation: {res.vehicule?.immatriculation || "N/A"}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Région: {res.region.nom_region} (
                      {res.region.nom_district})
                    </Typography>
                    <Typography variant="h6" color="primary" fontWeight="bold">
                      {res.total_price} Ar
                    </Typography>
                  </Box>
                  <Stack justifyContent="space-between" alignItems="flex-end">
                    <Chip
                      label={displayedStatus}
                      color={chipColor}
                      variant="outlined"
                      sx={{ fontWeight: "bold" }}
                    />
                    <Stack direction="row" spacing={1} mt={2}>
                      <Button
                        size="small"
                        variant="contained"
                        color="primary"
                        startIcon={<VisibilityIcon />}
                        onClick={() => handleViewDetails(res)}
                      >
                        Voir détails
                      </Button>
                      <Button
                        size="small"
                        variant="outlined"
                        color="warning"
                        startIcon={<EditIcon />}
                        onClick={() => handleEdit(res)}
                        disabled={!isEditable}
                      >
                        Modifier
                      </Button>
                      <Button
                        size="small"
                        variant="outlined"
                        color="error"
                        startIcon={<DeleteIcon />}
                        onClick={() => handleConfirmCancel(res.id)}
                        disabled={!isCancellable}
                      >
                        Annuler
                      </Button>
                    </Stack>
                    {/* Bouton de confirmation de devis - visible uniquement pour les devis */}
                    {res.status === "devis" && (
                      <Button
                        size="small"
                        variant="contained"
                        color="success"
                        startIcon={<CheckCircleIcon />}
                        onClick={() => handleConfirmQuote(res.id)}
                        sx={{ mt: 1, width: "100%" }}
                      >
                        Confirmer le devis
                      </Button>
                    )}
                    {/* Bouton de téléchargement PDF Proforma - visible uniquement si une proforma existe */}
                    {proformas.some((p: any) => p.reservation?.id === res.id) && (
                      <Button
                        size="small"
                        variant="outlined"
                        color="secondary"
                        startIcon={<PictureAsPdfIcon />}
                        onClick={() => handleDownloadProformaPDF(res.id)}
                        sx={{ mt: 1, width: "100%" }}
                      >
                        Télécharger Facture Proforma
                      </Button>
                    )}
                  </Stack>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}

      <Box mt={4} display="flex" justifyContent="center">
        <Pagination
          count={totalPages}
          page={page}
          onChange={handlePageChange}
          shape="rounded"
          color="primary"
        />
      </Box>

      {/* Modale de confirmation d'annulation */}
      <Dialog
        open={openCancelDialog}
        onClose={() => setOpenCancelDialog(false)}
        aria-labelledby="cancel-dialog-title"
        aria-describedby="cancel-dialog-description"
      >
        <DialogTitle id="cancel-dialog-title">
          {"Confirmer l'annulation ?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="cancel-dialog-description">
            Êtes-vous sûr de vouloir annuler cette réservation ? Cette action
            est irréversible.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCancelDialog(false)}>Non</Button>
          <Button onClick={handleCancelReservation} autoFocus color="error">
            Oui, Annuler
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modale de Détails */}
      {selectedReservation && (
        <ReservationDetails
          open={openDetailsDialog}
          onClose={handleCloseDetailsDialog}
          reservation={selectedReservation}
        />
      )}

      {/* Modale d'Édition */}
      {selectedReservation && (
        <ReservationEdit
          open={openEditDialog}
          onClose={handleCloseEditDialog}
          reservation={selectedReservation}
        />
      )}
    </Box>
  );
};

export default ReservationList;
