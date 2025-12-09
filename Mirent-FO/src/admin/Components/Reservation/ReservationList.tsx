import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  CarburantPolicy,
  clearError,
  completeReservation,
  confirmReservation,
  createDevis,
  fetchReservations,
  ReservationStatus,
  selectAllReservations,
  selectCurrentReservation,
  selectError,
  selectLoading,
  setCurrentReservation,
  cancelReservation,
  deleteReservation,
} from "../../../redux/features/reservation/reservationSlice";
import { useAppDispatch } from "../../../hooks";
import { RootState } from "../../../redux/store";
import { fetchVehicles } from "../../../redux/features/vehicle/vehiclesSlice";
import { fetchClients } from "../../../redux/features/clients/customersSlice";
import { fetchRegions } from "../../../redux/features/lieux/locationSlice";

import {
  Box,
  Typography,
  Grid,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Button,
  IconButton,
  CircularProgress,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  useMediaQuery,
  Chip,
  Divider,
  SelectChangeEvent,
  InputAdornment,
  TablePagination,
} from "@mui/material";
import {
  Add as AddIcon,
  Close as CloseIcon,
  CheckCircle as CheckIcon,
  Visibility as VisibilityIcon,
  Assignment as AssignmentIcon,
  DirectionsCar as CarIcon,
  Person as PersonIcon,
  CalendarToday as CalendarIcon,
  FilterList as FilterIcon,
  Search as SearchIcon,
  Print as PrintIcon,
  Cancel as CancelIcon, // Ajout de l'icône d'annulation
  Delete as DeleteIcon, // Ajout de l'icône de suppression
} from "@mui/icons-material";
import { createTheme, ThemeProvider, useTheme } from "@mui/material/styles";

import logoImage from "../../../assets/horizontal.png";
import signatureImage from "../../../assets/signature.png";

// Création du thème cohérent avec les autres pages
const theme = createTheme({
  palette: {
    primary: { main: "#3b82f6" },
    secondary: { main: "#ef4444" },
    background: { default: "#f9fafb" },
    text: { primary: "#1f2937", secondary: "#6b7280" },
  },
  typography: {
    fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: { fontWeight: 600, color: "#1f2937" },
    h6: { fontWeight: 600, color: "#1f2937" },
    body1: { fontSize: "0.9rem", color: "#1f2937" },
    body2: { fontSize: "0.85rem", color: "#6b7280" },
  },
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          marginTop: "8px",
          "& .MuiInputLabel-root": {
            position: "relative",
            transform: "none",
            marginBottom: "4px",
            fontWeight: 500,
            fontSize: "0.875rem",
          },
        },
      },
    },
    MuiFormControl: {
      styleOverrides: {
        root: {
          marginTop: "8px",
          "& .MuiInputLabel-root": {
            position: "relative",
            transform: "none",
            marginBottom: "4px",
            fontWeight: 500,
            fontSize: "0.875rem",
          },
        },
      },
    },
  },
});

interface CreateReservationFormData {
  clientId: number;
  vehiculeId: number;
  pickup_date: string;
  return_date: string;
  region_id: number;
  carburant_policy: CarburantPolicy;
  carburant_depart?: number;
  kilometrage_depart?: number;
}

const ReservationManager: React.FC = () => {
  const dispatch = useAppDispatch();
  const muiTheme = useTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down("sm"));

  // Charger les données initiales
  useEffect(() => {
    dispatch(fetchReservations());
    dispatch(fetchVehicles());
    dispatch(fetchClients());
    dispatch(fetchRegions());
  }, [dispatch]);

  // Sélecteurs Redux
  const reservations = useSelector(selectAllReservations);
  const currentReservation = useSelector(selectCurrentReservation);

  useEffect(() => {
    console.log("Current reservation from Redux:", currentReservation);
  }, [currentReservation]);

  const loading = useSelector(selectLoading);
  const error = useSelector(selectError);

  // Accès direct aux états via RootState
  const vehicles = useSelector((state: RootState) => state.vehicles.vehicles);
  const vehiclesLoading = useSelector(
    (state: RootState) => state.vehicles.loading
  );
  const clients = useSelector((state: RootState) => state.customer.clients);
  const clientsLoading = useSelector(
    (state: RootState) => state.customer.loading
  );
  const regions = useSelector((state: RootState) => state.region.regions);
  const regionsLoading = useSelector(
    (state: RootState) => state.region.loading
  );

  // États locaux
  const [showForm, setShowForm] = useState(false);
  const [showCompleteForm, setShowCompleteForm] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [carburantRetour, setCarburantRetour] = useState<number>(0);
  const [statusFilter, setStatusFilter] = useState<string>("TOUS");
  const [searchTerm, setSearchTerm] = useState("");
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Données du formulaire
  const [formData, setFormData] = useState<CreateReservationFormData>({
    clientId: 0,
    vehiculeId: 0,
    pickup_date: "",
    return_date: "",
    region_id: 0,
    carburant_policy: CarburantPolicy.PLEIN_A_PLEIN,
    carburant_depart: 0,
    kilometrage_depart: 0,
  });

  // Fonction pour formater les montants en Ariary
  const formatCurrencyAr = (amount: number) => {
    return (
      new Intl.NumberFormat("fr-FR", {
        maximumFractionDigits: 0,
      }).format(amount) + " Ar"
    );
  };

  // Fonction pour gérer l'impression
  const handlePrintReservation = () => {
    const printWindow = window.open("", "_blank");
    if (printWindow && currentReservation) {
      const printContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Facture Proforma - ${currentReservation.reference}</title>
        <style>
          body { font-family: 'Arial', sans-serif; font-size: 12px; margin: 0; padding: 20px; }
          .container { max-width: 800px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; }
          .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px; }
          .logo { width: 150px; }
          .client-box { border: 1px solid #000; padding: 10px; width: 250px; text-align: left; }
          .invoice-title { font-size: 18px; font-weight: bold; margin-bottom: 5px; }
          .invoice-number { font-size: 14px; margin-bottom: 10px; }
          .invoice-table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          .invoice-table th, .invoice-table td { border: 1px solid #000; padding: 8px; text-align: left; }
          .invoice-table th { background-color: #f2f2f2; }
          .total-text { margin-top: 20px; font-weight: bold; }
          .footer-section { margin-top: 40px; text-align: right; }
          .signature-box { border-top: 1px solid #000; width: 200px; margin-left: auto; margin-top: 10px; text-align: center; padding-top: 5px; }
          .contact-info { margin-top: 40px; border-top: 1px solid #ddd; padding-top: 10px; text-align: center; font-size: 10px; }
          @media print {
            body { border: none; }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <img src="${logoImage}" alt="Mirent Logo" class="logo" />
            <div class="client-box" justify-content="center" align-items="center">
              <strong>Client:</strong>
              <p>${getClientName(currentReservation)}</p>
            </div>
          </div>

          <div style="text-align: center; margin-bottom: 20px;">
            <div class="invoice-title">DEVIS N° ${currentReservation.reference
        }</div>
            <div class="invoice-number">Date: ${new Date().toLocaleDateString()}</div>
          </div>

          <table class="invoice-table">
            <thead>
              <tr>
                <th>Réf.</th>
                <th>Voiture</th>
                <th>Numéro</th>
                <th>Destination</th>
                <th>Date</th>
                <th>Jour</th>
                <th>Prix unitaire</th>
                <th>Prix total</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>${currentReservation.reference}</td>
                <td>${getVehicleName(currentReservation)}</td>
                <td>${getVehicleLicensePlate(currentReservation)}</td>
                <td>${currentReservation.region?.nom_region ||
        currentReservation.location?.nom_region ||
        "N/A"
        }</td>
                <td>${new Date(
          currentReservation.pickup_date
        ).toLocaleDateString()} au ${new Date(
          currentReservation.return_date
        ).toLocaleDateString()}</td>
                <td>${currentReservation.nombreJours || 0}</td>
                <td>${currentReservation.prix_unitaire
          ? formatCurrencyAr(currentReservation.prix_unitaire) + "/jour"
          : currentReservation.location?.prix?.prix
            ? formatCurrencyAr(currentReservation.location.prix.prix) +
            "/jour"
            : "N/A"
        }</td>
                <td>${formatCurrencyAr(currentReservation.total_price)}</td>
              </tr>
              <tr>
                <td colspan="7" style="text-align: right; font-weight: bold;">TOTAL</td>
                <td style="text-align: right; font-weight: bold;">-</td>
                <td style="font-weight: bold;">${formatCurrencyAr(
          currentReservation.total_price
        )}</td>
              </tr>
            </tbody>
          </table>


          <div class="footer-section">
            <p>Antananarivo, le ${new Date().toLocaleDateString("fr-FR", {
          day: "2-digit",
          month: "long",
          year: "numeric",
        })}</p>
            <p>Pour Mirent,</p>
            <img src="${signatureImage}" alt="Signature" style="width: 150px; margin-top: 10px;"/>
          </div>

          <div class="contact-info">
            <p>
              Mail: mirent.mdg@gmail.com
              <br/>
              Tel: +261 34 25 690 04
              <br/>
              Lot II F 136 Ter Avaradoha Antananarivo 101
              <br/>
              NIF: 7018457585 Stat: 49295 11 024 0 10541
              <br/>
              RIB: 00015 00008 0386510000 1 37
            </p>
          </div>

        </div>
      </body>
    </html>
    `;

      printWindow.document.write(printContent);
      printWindow.document.close();
    }
  };

  // Filtrer les réservations en fonction du terme de recherche
  const filteredReservations = reservations.filter((reservation) => {
    const searchLower = searchTerm.toLowerCase();
    const reservationRef = reservation.reference || "";
    const clientName = `${reservation.client?.lastName || ""}`.toLowerCase();
    const vehicleInfo = `${reservation.vehicule?.marque || ""} ${reservation.vehicule?.modele || ""
      }`.toLowerCase();

    return (
      reservationRef.toLowerCase().includes(searchLower) ||
      clientName.includes(searchLower) ||
      vehicleInfo.includes(searchLower)
    );
  });

  // Gérer les changements du formulaire pour les inputs
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name.includes("Id") || name.includes("_id") || name.includes("depart")
          ? Number(value)
          : value,
    }));
  };

  // Gérer les changements du formulaire pour les selects
  const handleSelectChange = (
    e: SelectChangeEvent<number | CarburantPolicy | string>
  ) => {
    const { name, value } = e.target;

    if (name === "statusFilter") {
      setStatusFilter(value as string);
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // Soumettre le formulaire de création
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await dispatch(createDevis(formData)).unwrap();
      setShowForm(false);
      setFormData({
        clientId: 0,
        vehiculeId: 0,
        pickup_date: "",
        return_date: "",
        region_id: 0,
        carburant_policy: CarburantPolicy.PLEIN_A_PLEIN,
        carburant_depart: 0,
        kilometrage_depart: 0,
      });
      setSnackbar({
        open: true,
        message: "Devis créé avec succès",
        severity: "success",
      });
    } catch (err) {
      console.error("Erreur lors de la création du devis:", err);
      setSnackbar({
        open: true,
        message: "Erreur lors de la création du devis",
        severity: "error",
      });
    }
  };

  // Confirmer une réservation
  const handleConfirm = async (id: number) => {
    try {
      await dispatch(confirmReservation(id)).unwrap();
      // Rafraîchir la liste des réservations pour afficher le nouveau statut
      await dispatch(fetchReservations());
      setSnackbar({
        open: true,
        message: "Réservation confirmée avec succès",
        severity: "success",
      });
    } catch (err) {
      console.error("Erreur lors de la confirmation:", err);
      setSnackbar({
        open: true,
        message: "Erreur lors de la confirmation",
        severity: "error",
      });
    }
  };

  // Compléter une réservation
  const handleComplete = async () => {
    if (!currentReservation) return;

    try {
      await dispatch(
        completeReservation({
          id: currentReservation.id,
          carburant_retour: carburantRetour,
        })
      ).unwrap();
      // Rafraîchir la liste des réservations pour afficher le nouveau statut
      await dispatch(fetchReservations());
      setShowCompleteForm(false);
      setCarburantRetour(0);
      setSnackbar({
        open: true,
        message: "Réservation complétée avec succès",
        severity: "success",
      });
    } catch (err) {
      console.error("Erreur lors de la complétion:", err);
      setSnackbar({
        open: true,
        message: "Erreur lors de la complétion",
        severity: "error",
      });
    }
  };

  // Annuler une réservation
  const handleCancel = async (id: number) => {
    try {
      await dispatch(cancelReservation(id)).unwrap();
      setSnackbar({
        open: true,
        message: "Réservation annulée avec succès",
        severity: "success",
      });
    } catch (err) {
      console.error("Erreur lors de l'annulation:", err);
      setSnackbar({
        open: true,
        message: "Erreur lors de l'annulation",
        severity: "error",
      });
    }
  };

  // Supprimer une réservation
  const handleDelete = async (id: number) => {
    try {
      await dispatch(deleteReservation(id)).unwrap();
      setSnackbar({
        open: true,
        message: "Réservation supprimée avec succès",
        severity: "success",
      });
    } catch (err) {
      console.error("Erreur lors de la suppression:", err);
      setSnackbar({
        open: true,
        message: "Erreur lors de la suppression",
        severity: "error",
      });
    }
  };

  // Filtrer les véhicules disponibles
  const availableVehicles = Array.isArray(vehicles)
    ? vehicles.filter(
      (vehicle: any) =>
        vehicle.status && vehicle.status.status === "Disponible"
    )
    : [];

  // Calculer le nombre de jours entre deux dates
  const calculateDays = (pickup: string, returnDate: string): number => {
    if (!pickup || !returnDate) return 0;
    const start = new Date(pickup);
    const end = new Date(returnDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  // Calculer le prix total estimé
  const calculateEstimatedPrice = (): number => {
    if (!formData.region_id || !formData.pickup_date || !formData.return_date)
      return 0;

    const selectedRegion = Array.isArray(regions)
      ? regions.find((r: any) => r.id === formData.region_id)
      : null;

    if (!selectedRegion || !selectedRegion.prix) return 0;

    const days = calculateDays(formData.pickup_date, formData.return_date);
    return days * selectedRegion.prix.prix;
  };

  // Fonction pour obtenir le nom du client en toute sécurité
  const getClientName = (reservation: any): string => {
    if (!reservation || !reservation.client) {
      console.warn("Client missing in reservation:", reservation);
      return "N/A";
    }
    return (
      `${reservation.client.firstName || ""} ${reservation.client.lastName || ""
        }`.trim() || "N/A"
    );
  };

  // Fonction pour obtenir le nom du véhicule en toute sécurité
  const getVehicleName = (reservation: any): string => {
    if (!reservation || !reservation.vehicule) {
      console.warn("Vehicle missing in reservation:", reservation);
      return "N/A";
    }
    return (
      `${reservation.vehicule.marque || ""} ${reservation.vehicule.modele || ""
        }`.trim() || "N/A"
    );
  };

  // Fonction pour obtenir la plaque d'immatriculation en toute sécurité
  const getVehicleLicensePlate = (reservation: any): string => {
    if (!reservation || !reservation.vehicule) {
      console.warn("Vehicle missing in reservation:", reservation);
      return "N/A";
    }
    return reservation.vehicule.immatriculation || "N/A";
  };

  // Fonction pour obtenir le nombre de places du véhicule
  const getVehicleSeats = (reservation: any): number => {
    if (!reservation || !reservation.vehicule) {
      console.warn("Vehicle missing in reservation:", reservation);
      return 0;
    }
    return reservation.vehicule.nombrePlace || 0;
  };

  // Fonction pour obtenir la couleur du statut
  const getStatusColor = (status: string) => {
    switch (status) {
      case ReservationStatus.DEVIS:
        return "warning";
      case ReservationStatus.CONFIRMEE:
        return "success";
      case ReservationStatus.TERMINEE:
        return "info";
      case ReservationStatus.ANNULEE:
        return "error";
      default:
        return "default";
    }
  };

  // Fonction pour visualiser les détails d'une réservation
  const handleViewDetails = (reservation: any) => {
    dispatch(setCurrentReservation(reservation));
    setShowDetailsModal(true);
  };

  // Filtrer et trier les réservations
  const filteredAndSortedReservations = Array.isArray(filteredReservations)
    ? [...filteredReservations]
      .filter(
        (reservation: any) =>
          statusFilter === "TOUS" || reservation.status === statusFilter
      )
      .sort((a: any, b: any) => {
        // Trier par référence en ordre croissant
        if (a.reference && b.reference) {
          return a.reference.localeCompare(b.reference);
        }
        return 0;
      })
    : [];

  // Calculer les réservations à afficher pour la page courante
  const paginatedReservations = filteredAndSortedReservations.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  // Gestion du changement de page
  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  // Gestion du changement du nombre de lignes par page
  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  if (loading || vehiclesLoading || clientsLoading || regionsLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "50vh",
        }}
      >
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          px: isMobile ? 2 : 3,
          py: 2,
          backgroundColor: "#f9fafb",
          minHeight: "100vh",
        }}
      >
        {/* Header et bouton d'action */}
        <Grid container spacing={1} mb={3} alignItems="center">
          <Grid item xs={12} sm={6}>
            <Typography variant="h4" sx={{ fontWeight: 600, color: "#1f2937" }}>
              Gestion des Réservations
            </Typography>
            <Typography variant="body2" color="text.secondary" mt={0.5}>
              Créez et gérez les réservations de vos clients
            </Typography>
          </Grid>
          <Grid
            item
            xs={12}
            sm={6}
            display="flex"
            justifyContent={isMobile ? "flex-start" : "flex-end"}
            mt={isMobile ? 1 : 0}
          >
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setShowForm(true)}
              sx={{
                borderRadius: "8px",
                textTransform: "none",
                fontWeight: 600,
                px: 3,
                py: 1,
              }}
            >
              Nouveau devis
            </Button>
          </Grid>
        </Grid>

        {/* Affichage des erreurs */}
        {error && (
          <Alert
            severity="error"
            sx={{ mb: 3, borderRadius: 2 }}
            action={
              <IconButton
                aria-label="close"
                color="inherit"
                size="small"
                onClick={() => dispatch(clearError())}
              >
                <CloseIcon fontSize="inherit" />
              </IconButton>
            }
          >
            {error}
          </Alert>
        )}

        {/* Champ de recherche */}
        <Box sx={{ mb: 3 }}>
          <TextField
            fullWidth
            placeholder="Rechercher par référence, client ou véhicule..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
            }}
            sx={{
              backgroundColor: "white",
              borderRadius: 2,
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
              },
            }}
          />
        </Box>

        {/* Formulaire de création de devis */}
        <Dialog
          open={showForm}
          onClose={() => setShowForm(false)}
          fullWidth
          maxWidth="md"
          PaperProps={{
            sx: {
              borderRadius: 3,
              boxShadow: 3,
            },
          }}
        >
          <DialogTitle
            sx={{
              fontWeight: 600,
              fontSize: "1.2rem",
              py: 2,
              borderBottom: `1px solid ${theme.palette.divider}`,
            }}
          >
            Créer un nouveau devis
          </DialogTitle>

          <DialogContent sx={{ py: 3 }}>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth required>
                    <InputLabel shrink>Client</InputLabel>
                    <Select
                      name="clientId"
                      value={formData.clientId}
                      onChange={handleSelectChange}
                      label="Client"
                      notched
                    >
                      <MenuItem value={0}>Sélectionner un client</MenuItem>
                      {Array.isArray(clients) &&
                        clients.map((client: any) => (
                          <MenuItem key={client.id} value={client.id}>
                            {client.firstName} {client.lastName}
                          </MenuItem>
                        ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={6}>
                  <FormControl fullWidth required>
                    <InputLabel shrink>Véhicule</InputLabel>
                    <Select
                      name="vehiculeId"
                      value={formData.vehiculeId}
                      onChange={handleSelectChange}
                      label="Véhicule"
                      notched
                    >
                      <MenuItem value={0}>Sélectionner un véhicule</MenuItem>
                      {availableVehicles.map((vehicle: any) => (
                        <MenuItem key={vehicle.id} value={vehicle.id}>
                          {vehicle.marque} {vehicle.modele} -{" "}
                          {vehicle.immatriculation} ({vehicle.nombrePlace}{" "}
                          Places)
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Date de prise en charge"
                    type="date"
                    name="pickup_date"
                    value={formData.pickup_date}
                    onChange={handleInputChange}
                    required
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Date de retour"
                    type="date"
                    name="return_date"
                    value={formData.return_date}
                    onChange={handleInputChange}
                    required
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <FormControl fullWidth required>
                    <InputLabel shrink>Région de location</InputLabel>
                    <Select
                      name="region_id"
                      value={formData.region_id}
                      onChange={handleSelectChange}
                      label="Région de location"
                      notched
                    >
                      <MenuItem value={0}>Sélectionner une région</MenuItem>
                      {Array.isArray(regions) &&
                        regions.map((region: any) => (
                          <MenuItem key={region.id} value={region.id}>
                            {region.nom_region} ({region.nom_district}) -{" "}
                            {formatCurrencyAr(region.prix?.prix)}/jour
                          </MenuItem>
                        ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel shrink>Politique de carburant</InputLabel>
                    <Select
                      name="carburant_policy"
                      value={formData.carburant_policy}
                      onChange={handleSelectChange}
                      label="Politique de carburant"
                      notched
                    >
                      <MenuItem value={CarburantPolicy.PLEIN_A_PLEIN}>
                        Plein à plein
                      </MenuItem>
                      <MenuItem value={CarburantPolicy.PAY_AS_YOU_USE}>
                        Pay as you use
                      </MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                {formData.carburant_policy ===
                  CarburantPolicy.PAY_AS_YOU_USE && (
                    <>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="Niveau de carburant au départ (%)"
                          type="number"
                          name="carburant_depart"
                          value={formData.carburant_depart}
                          onChange={handleInputChange}
                          inputProps={{ min: 0, max: 100 }}
                        />
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="Kilométrage au départ"
                          type="number"
                          name="kilometrage_depart"
                          value={formData.kilometrage_depart}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              kilometrage_depart: Number(e.target.value),
                            })
                          }
                          inputProps={{ min: 0 }}
                        />
                      </Grid>
                    </>
                  )}
              </Grid>

              <Box
                sx={{
                  bgcolor: "grey.50",
                  p: 2,
                  borderRadius: 1,
                  mt: 3,
                  border: `1px solid ${theme.palette.divider}`,
                }}
              >
                <Typography variant="subtitle2" gutterBottom>
                  Estimation du prix
                </Typography>
                <Typography>
                  {calculateEstimatedPrice() > 0
                    ? `${formatCurrencyAr(
                      calculateEstimatedPrice()
                    )} pour ${calculateDays(
                      formData.pickup_date,
                      formData.return_date
                    )} jours`
                    : "Remplissez les dates et la région pour voir le prix estimé"}
                </Typography>
              </Box>
            </form>
          </DialogContent>

          <DialogActions
            sx={{
              px: 3,
              py: 2,
              borderTop: `1px solid ${theme.palette.divider}`,
            }}
          >
            <Button
              onClick={() => setShowForm(false)}
              color="inherit"
              sx={{
                fontWeight: 600,
                borderRadius: "8px",
                textTransform: "none",
                px: 3,
              }}
            >
              Annuler
            </Button>
            <Button
              onClick={handleSubmit}
              color="primary"
              variant="contained"
              sx={{
                fontWeight: 600,
                borderRadius: "8px",
                textTransform: "none",
                px: 3,
              }}
            >
              Créer le devis
            </Button>
          </DialogActions>
        </Dialog>

        {/* Filtre par statut */}
        <Card sx={{ mb: 3, p: 2, borderRadius: 2, boxShadow: 2 }}>
          <Grid container alignItems="center" spacing={2}>
            <Grid item>
              <FilterIcon color="primary" />
            </Grid>
            <Grid item>
              <Typography variant="subtitle1" fontWeight={500}>
                Filtrer par statut:
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth>
                <Select
                  name="statusFilter"
                  value={statusFilter}
                  onChange={handleSelectChange}
                  size="small"
                >
                  <MenuItem value="TOUS">Tous les statuts</MenuItem>
                  <MenuItem value={ReservationStatus.DEVIS}>Devis</MenuItem>
                  <MenuItem value={ReservationStatus.CONFIRMEE}>
                    Confirmée
                  </MenuItem>
                  <MenuItem value={ReservationStatus.TERMINEE}>
                    Terminée
                  </MenuItem>
                  <MenuItem value={ReservationStatus.ANNULEE}>Annulée</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Card>

        {/* Tableau des réservations */}
        <Card
          elevation={3}
          sx={{ borderRadius: 3, overflow: "hidden", boxShadow: 3 }}
        >
          <CardContent sx={{ p: 0 }}>
            <Box
              sx={{
                p: 2,
                bgcolor: "grey.100",
                display: "flex",
                alignItems: "center",
              }}
            >
              <AssignmentIcon sx={{ mr: 1, color: "primary.main" }} />
              <Typography variant="h6" fontWeight={600}>
                Liste des Réservations
              </Typography>
            </Box>

            <TableContainer>
              <Table>
                <TableHead sx={{ bgcolor: "grey.50" }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700 }}>Référence</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Client</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Véhicule</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Places</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Dates</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Prix</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Statut</TableCell>
                    <TableCell sx={{ fontWeight: 700 }} align="center">
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedReservations.length > 0 ? (
                    paginatedReservations.map((reservation: any) => (
                      <TableRow key={reservation.id} hover>
                        <TableCell>
                          <Typography variant="body2" fontWeight={500}>
                            {reservation.reference || "N/A"}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            <PersonIcon
                              sx={{
                                fontSize: 20,
                                mr: 1,
                                color: "text.secondary",
                              }}
                            />
                            <Typography variant="body2">
                              {getClientName(reservation)}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            <CarIcon
                              sx={{
                                fontSize: 20,
                                mr: 1,
                                color: "text.secondary",
                              }}
                            />
                            <Box>
                              <Typography variant="body2">
                                {getVehicleName(reservation)}
                              </Typography>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                {getVehicleLicensePlate(reservation)}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" align="center">
                            {getVehicleSeats(reservation)}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            <CalendarIcon
                              sx={{
                                fontSize: 20,
                                mr: 1,
                                color: "text.secondary",
                              }}
                            />
                            <Box>
                              <Typography variant="body2">
                                {reservation.pickup_date
                                  ? new Date(
                                    reservation.pickup_date
                                  ).toLocaleDateString()
                                  : "N/A"}
                              </Typography>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                au{" "}
                                {reservation.return_date
                                  ? new Date(
                                    reservation.return_date
                                  ).toLocaleDateString()
                                  : "N/A"}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            <Typography variant="body2">
                              {reservation.total_price
                                ? `${formatCurrencyAr(reservation.total_price)}`
                                : "N/A"}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={reservation.status || "N/A"}
                            color={getStatusColor(reservation.status) as any}
                            size="small"
                          />
                        </TableCell>
                        <TableCell align="center">
                          <Box
                            sx={{ display: "flex", justifyContent: "center" }}
                          >
                            {reservation.status === ReservationStatus.DEVIS && (
                              <>
                                <Tooltip title="Confirmer" arrow>
                                  <IconButton
                                    onClick={() =>
                                      handleConfirm(reservation.id)
                                    }
                                    color="primary"
                                    size="small"
                                  >
                                    <CheckIcon />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title="Annuler" arrow>
                                  <IconButton
                                    onClick={() => handleCancel(reservation.id)}
                                    color="secondary"
                                    size="small"
                                  >
                                    <CancelIcon />
                                  </IconButton>
                                </Tooltip>
                              </>
                            )}
                            {reservation.status ===
                              ReservationStatus.CONFIRMEE && (
                                <>
                                  <Tooltip title="Compléter" arrow>
                                    <IconButton
                                      onClick={() => {
                                        dispatch(
                                          setCurrentReservation(reservation)
                                        );
                                        setShowCompleteForm(true);
                                      }}
                                      color="success"
                                      size="small"
                                    >
                                      <CheckIcon />
                                    </IconButton>
                                  </Tooltip>
                                  <Tooltip title="Annuler" arrow>
                                    <IconButton
                                      onClick={() => handleCancel(reservation.id)}
                                      color="secondary"
                                      size="small"
                                    >
                                      <CancelIcon />
                                    </IconButton>
                                  </Tooltip>
                                </>
                              )}
                            {(reservation.status ===
                              ReservationStatus.ANNULEE ||
                              reservation.status ===
                              ReservationStatus.TERMINEE) && (
                                <Tooltip title="Supprimer" arrow>
                                  <IconButton
                                    onClick={() => handleDelete(reservation.id)}
                                    color="error"
                                    size="small"
                                  >
                                    <DeleteIcon />
                                  </IconButton>
                                </Tooltip>
                              )}
                            <Tooltip title="Voir détails" arrow>
                              <IconButton
                                onClick={() => handleViewDetails(reservation)}
                                color="info"
                                size="small"
                              >
                                <VisibilityIcon />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                        <AssignmentIcon
                          sx={{ fontSize: 60, color: "grey.400", mb: 2 }}
                        />
                        <Typography variant="h6" color="textSecondary">
                          {searchTerm
                            ? "Aucun résultat trouvé"
                            : "Aucune réservation trouvée"}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Pagination */}
            {filteredAndSortedReservations.length > 0 && (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  p: 2,
                  borderTop: "1px solid",
                  borderColor: "divider",
                  flexDirection: isMobile ? "column" : "row",
                  gap: isMobile ? 2 : 0,
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  {`${filteredAndSortedReservations.length} réservation(s) au total`}
                </Typography>

                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  {filteredAndSortedReservations.length > 0 && (
                    <TablePagination
                      rowsPerPageOptions={[5, 10, 25, 50]}
                      component="div"
                      count={filteredAndSortedReservations.length}
                      rowsPerPage={rowsPerPage}
                      page={page}
                      onPageChange={handleChangePage}
                      onRowsPerPageChange={handleChangeRowsPerPage}
                      labelRowsPerPage="Lignes par page"
                      labelDisplayedRows={({ from, to, count }) =>
                        `${from}-${to} sur ${count}`
                      }
                      sx={{
                        borderTop: "1px solid",
                        borderColor: "divider",
                        "& .MuiTablePagination-toolbar": {
                          flexWrap: "wrap",
                          justifyContent: "flex-end",
                          gap: 2,
                        },
                      }}
                    />
                  )}
                </Box>
              </Box>
            )}
          </CardContent>
        </Card>

        {/* Modal pour compléter une réservation */}
        <Dialog
          open={showCompleteForm}
          onClose={() => setShowCompleteForm(false)}
          PaperProps={{
            sx: {
              borderRadius: 3,
              boxShadow: 3,
            },
          }}
        >
          <DialogTitle
            sx={{
              fontWeight: 600,
              fontSize: "1.2rem",
              py: 2,
              borderBottom: `1px solid ${theme.palette.divider}`,
            }}
          >
            Compléter la réservation
          </DialogTitle>

          <DialogContent sx={{ py: 3 }}>
            {currentReservation && (
              <>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Référence
                  </Typography>
                  <Typography variant="body1" fontWeight={500}>
                    {currentReservation.reference}
                  </Typography>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Véhicule
                  </Typography>
                  <Typography variant="body1" fontWeight={500}>
                    {getVehicleName(currentReservation)} (
                    {getVehicleLicensePlate(currentReservation)})
                  </Typography>
                </Box>

                <Divider sx={{ my: 2 }} />
              </>
            )}
          </DialogContent>

          <DialogActions
            sx={{
              px: 3,
              py: 2,
              borderTop: `1px solid ${theme.palette.divider}`,
            }}
          >
            <Button
              onClick={() => setShowCompleteForm(false)}
              color="inherit"
              sx={{
                fontWeight: 600,
                borderRadius: "8px",
                textTransform: "none",
                px: 3,
              }}
            >
              Annuler
            </Button>
            <Button
              onClick={handleComplete}
              color="primary"
              variant="contained"
              sx={{
                fontWeight: 600,
                borderRadius: "8px",
                textTransform: "none",
                px: 3,
              }}
            >
              Terminer la réservation
            </Button>
          </DialogActions>
        </Dialog>

        {/* Modal pour afficher les détails de réservation */}
        <Dialog
          open={showDetailsModal}
          onClose={() => setShowDetailsModal(false)}
          fullWidth
          maxWidth="md"
          PaperProps={{
            sx: {
              borderRadius: 3,
              boxShadow: 3,
            },
          }}
        >
          <DialogTitle
            sx={{
              fontWeight: 600,
              fontSize: "1.2rem",
              py: 2,
              borderBottom: `1px solid ${theme.palette.divider}`,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            Détails de la réservation
            <IconButton onClick={() => setShowDetailsModal(false)} size="small">
              <CloseIcon />
            </IconButton>
          </DialogTitle>

          <DialogContent sx={{ py: 3 }}>
            {currentReservation && (
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Référence
                  </Typography>
                  <Typography variant="body1" fontWeight={500} mb={2}>
                    {currentReservation.reference || "N/A"}
                  </Typography>

                  <Typography variant="subtitle2" color="text.secondary">
                    Client
                  </Typography>
                  <Typography variant="body1" fontWeight={500} mb={2}>
                    {getClientName(currentReservation)}
                  </Typography>

                  <Typography variant="subtitle2" color="text.secondary">
                    Véhicule
                  </Typography>
                  <Typography variant="body1" fontWeight={500} mb={2}>
                    {getVehicleName(currentReservation)} (
                    {getVehicleLicensePlate(currentReservation)})
                  </Typography>

                  <Typography variant="subtitle2" color="text.secondary">
                    Nombre de places
                  </Typography>
                  <Typography variant="body1" fontWeight={500} mb={2}>
                    {getVehicleSeats(currentReservation)}
                  </Typography>

                  <Typography variant="subtitle2" color="text.secondary">
                    Politique de carburant
                  </Typography>
                  <Typography variant="body1" fontWeight={500} mb={2}>
                    {currentReservation.carburant_policy ===
                      CarburantPolicy.PLEIN_A_PLEIN
                      ? "Plein à plein"
                      : "Pay as you use"}
                  </Typography>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Dates de location
                  </Typography>
                  <Typography variant="body1" fontWeight={500} mb={2}>
                    Du{" "}
                    {currentReservation.pickup_date
                      ? new Date(
                        currentReservation.pickup_date
                      ).toLocaleDateString()
                      : "N/A"}
                    <br />
                    Au{" "}
                    {currentReservation.return_date
                      ? new Date(
                        currentReservation.return_date
                      ).toLocaleDateString()
                      : "N/A"}
                  </Typography>

                  <Typography variant="subtitle2" color="text.secondary">
                    Prix total
                  </Typography>
                  <Typography variant="body1" fontWeight={500} mb={2}>
                    {currentReservation.total_price
                      ? `${formatCurrencyAr(currentReservation.total_price)}`
                      : "N/A"}
                  </Typography>

                  <Typography variant="subtitle2" color="text.secondary">
                    Statut
                  </Typography>
                  <Chip
                    label={currentReservation.status || "N/A"}
                    color={getStatusColor(currentReservation.status) as any}
                    sx={{ mb: 2 }}
                  />
                </Grid>
              </Grid>
            )}
          </DialogContent>

          <DialogActions
            sx={{
              px: 3,
              py: 2,
              borderTop: `1px solid ${theme.palette.divider}`,
            }}
          >
            <Button
              onClick={() => setShowDetailsModal(false)}
              color="inherit"
              sx={{
                fontWeight: 600,
                borderRadius: "8px",
                textTransform: "none",
              }}
            >
              Fermer
            </Button>
            <Button
              onClick={handlePrintReservation}
              color="primary"
              variant="contained"
              startIcon={<PrintIcon />}
              sx={{
                fontWeight: 600,
                borderRadius: "8px",
                textTransform: "none",
              }}
            >
              Imprimer
            </Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar pour les notifications */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <Alert
            onClose={() => setSnackbar({ ...snackbar, open: false })}
            severity={snackbar.severity}
            sx={{
              width: "100%",
              borderRadius: 2,
              boxShadow: theme.shadows[3],
            }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </ThemeProvider>
  );
};

export default ReservationManager;
