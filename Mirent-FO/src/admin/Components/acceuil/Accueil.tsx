import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
  Tooltip,
  IconButton,
  Avatar,
  useMediaQuery,
  useTheme,
  Card,
  CardContent,
  CardActions,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Snackbar,
  Alert,
  Chip,
} from "@mui/material";
import {
  DirectionsCar as CarIcon,
  People as PeopleIcon,
  AttachMoney as MoneyIcon,
  Percent as PercentIcon,
  TrendingUp as TrendingUpIcon,
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Person as PersonIcon,
  CalendarToday as CalendarIcon,
} from "@mui/icons-material";
import { LineChart } from "@mui/x-charts/LineChart";
import { useDispatch, useSelector } from "react-redux";

import { styled, createTheme, ThemeProvider } from "@mui/material/styles";
import { AppDispatch, RootState } from "../../../redux/store";
import {
  fetchVehicles,
  Vehicle,
} from "../../../redux/features/vehicle/vehiclesSlice";
import {
  Reservation,
  ReservationStatus,
  selectAllReservations,
  deleteReservation,
} from "../../../redux/features/reservation/reservationSlice";

// Thème personnalisé (identique à LocationList.tsx et VehiclesList.tsx)
const theme = createTheme({
  palette: {
    primary: {
      main: "#3b82f6",
    },
    secondary: {
      main: "#ef4444",
    },
    background: {
      default: "#f9fafb",
    },
    text: {
      primary: "#1f2937",
      secondary: "#6b7280",
    },
  },
  typography: {
    fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
      color: "#1f2937",
    },
    h6: {
      fontWeight: 600,
      color: "#1f2937",
    },
    body1: {
      fontSize: "0.9rem",
      color: "#1f2937",
    },
    body2: {
      fontSize: "0.85rem",
      color: "#6b7280",
    },
  },
  components: {
    MuiTableCell: {
      styleOverrides: {
        root: {
          padding: "12px 16px",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: "8px",
        },
      },
    },
  },
});

// Styles personnalisés (alignés avec LocationList.tsx et VehiclesList.tsx)
const DashboardCard = styled("div")(({ theme }) => ({
  padding: theme.spacing(2),
  borderRadius: "12px",
  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
  backgroundColor: "#fff",
  transition: "box-shadow 0.3s ease, transform 0.2s ease-in-out",
  "&:hover": {
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
    transform: "scale(1.02)",
  },
}));

const SecondaryButton = styled(IconButton)(({ theme }) => ({
  backgroundColor: "#ef4444",
  color: theme.palette.common.white,
  padding: "8px 16px",
  borderRadius: "8px",
  textTransform: "none",
  fontWeight: 500,
  "&:hover": {
    backgroundColor: "#dc2626",
    transform: "scale(1.02)",
    transition: "all 0.3s ease",
  },
  "&.Mui-disabled": {
    backgroundColor: "#d1d5db",
    color: "#6b7280",
  },
}));

const CancelButton = styled(IconButton)(({ theme }) => ({
  color: "#6b7280",
  borderColor: "#d1d5db",
  padding: "8px 16px",
  borderRadius: "8px",
  textTransform: "none",
  fontWeight: 500,
  "&:hover": {
    borderColor: "#9ca3af",
    backgroundColor: "#f3f4f6",
    transform: "scale(1.02)",
    transition: "all 0.3s ease",
  },
}));

// Interfaces pour les données
interface Booking {
  id: number;
  client: string;
  car: string;
  startDate: string;
  endDate: string;
  status: "En cours" | "Confirmé" | "En attente";
}

const Accueil: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { vehicles, vehiclesError } = useSelector(
    (state: RootState) => state.vehicles
  );
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm")); // Jusqu'à 600px
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md")); // 600px à 960px

  const [availableVehiclesCount, setAvailableVehiclesCount] = useState<
    number | null
  >(null);
  const [availableClientsCount, setAvailableClientsCount] = useState<
    number | null
  >(null);
  const [totalRevenue, setTotalRevenue] = useState<number | null>(null);
  const [occupancyRate, setOccupancyRate] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [bookingToDelete, setBookingToDelete] = useState<Booking | null>(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  // Sélecteur pour les réservations (ajouté)
  const reservations = useSelector(selectAllReservations);

  // Récupérer les véhicules via Redux
  useEffect(() => {
    dispatch(fetchVehicles());
  }, [dispatch]);

  // Filtrer les véhicules disponibles
  const availableCars = vehicles.filter(
    (vehicle: Vehicle) => vehicle.status.status === "Disponible"
  );

  // Filtrer les réservations en attente (ajouté)
  const pendingReservations = reservations.filter(
    (res: Reservation) => res.status === ReservationStatus.DEVIS
  );

  // Fonctions utilitaires pour le tableau
  const getClientName = (reservation: Reservation): string => {
    return `${reservation.client?.lastName || "N/A"}`;
  };

  const getVehicleName = (reservation: Reservation): string => {
    return reservation.vehicule?.nom || "N/A";
  };

  const getVehicleLicensePlate = (reservation: Reservation): string => {
    return reservation.vehicule?.immatriculation || "N/A";
  };

  const formatCurrencyAr = (amount: number): string => {
    return new Intl.NumberFormat("fr-FR", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount) + " Ar";
  };
  // Récupérer le nombre de véhicules disponibles
  useEffect(() => {
    const fetchAvailableVehicles = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/vehicles/available-count`
        );
        const data = await response.json();
        // L'API peut retourner soit un nombre directement, soit un objet {count: number}
        const count = typeof data === 'number' ? data : data.count;
        setAvailableVehiclesCount(count);
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des véhicules disponibles",
          error
        );
        setError("Erreur lors du chargement des véhicules disponibles");
      }
    };
    fetchAvailableVehicles();
  }, []);

  // Récupérer le nombre de clients
  useEffect(() => {
    const fetchAvailableClients = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/clients/client-count`
        );
        const data = await response.json();
        if (response.ok) {
          // L'API peut retourner soit un nombre directement, soit un objet {count: number}
          const count = typeof data === 'number' ? data : data.count;
          setAvailableClientsCount(count);
        } else {
          console.error("Erreur API:", data.message);
          setAvailableClientsCount(null);
          setError("Erreur lors du chargement des clients");
        }
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des nombres de clients",
          error
        );
        setAvailableClientsCount(null);
        setError("Erreur lors du chargement des clients");
      }
    };
    fetchAvailableClients();
  }, []);

  // Récupérer le revenu total
  useEffect(() => {
    const fetchTotalRevenue = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/paiements/total-revenue`
        );
        const data = await response.json();
        if (response.ok) {
          setTotalRevenue(data.total || 0);
        } else {
          console.error("Erreur API:", data.message);
          setTotalRevenue(null);
          setError("Erreur lors du chargement du revenu total");
        }
      } catch (error) {
        console.error(
          "Erreur lors de la récupération du revenu total",
          error
        );
        setTotalRevenue(null);
        setError("Erreur lors du chargement du revenu total");
      }
    };
    fetchTotalRevenue();
  }, []);

  // Récupérer le taux d'occupation
  useEffect(() => {
    const fetchOccupancyRate = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/vehicles/occupancy-rate`
        );
        const data = await response.json();
        if (response.ok) {
          setOccupancyRate(data.rate || 0);
        } else {
          console.error("Erreur API:", data.message);
          setOccupancyRate(null);
          setError("Erreur lors du chargement du taux d'occupation");
        }
      } catch (error) {
        console.error(
          "Erreur lors de la récupération du taux d'occupation",
          error
        );
        setOccupancyRate(null);
        setError("Erreur lors du chargement du taux d'occupation");
      }
    };
    fetchOccupancyRate();
  }, []);

  // Fonctions pour les actions du tableau
  const handleViewBooking = (id: number) => {
    console.log(`Voir la réservation ${id}`);
  };

  const handleEditBooking = (id: number) => {
    console.log(`Modifier la réservation ${id}`);
  };

  const handleDeleteBooking = () => {
    if (bookingToDelete) {
      // Note: bookingToDelete is of type Booking (old interface)
      // We need to find the actual reservation ID to delete
      // For now, this function won't be called since the table uses reservations
      setOpenSnackbar(true);
    }
    setOpenDeleteDialog(false);
    setBookingToDelete(null);
  };

  const openDeleteDialogForBooking = (booking: Booking) => {
    setBookingToDelete(booking);
    setOpenDeleteDialog(true);
  };

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
        {/* Afficher les erreurs s'il y en a */}
        {(error || vehiclesError) && (
          <Typography
            color="error"
            sx={{ mb: 2, fontSize: isMobile ? "0.9rem" : "1rem" }}
          >
            {error || vehiclesError}
          </Typography>
        )}

        {/* Titre de la page */}
        <Grid container spacing={3} mb={isMobile ? 2 : 4}>
          <Grid item xs={12}>
            <Typography
              variant="h4"
              sx={{ fontWeight: 600, color: "#1f2937", marginBottom: 1 }}
            >
              Tableau de Bord
            </Typography>
            <Typography
              variant="body1"
              sx={{ fontSize: "0.9rem", color: "#6b7280" }}
            >
              Aperçu des performances, véhicules disponibles et réservations
              récentes.
            </Typography>
          </Grid>
        </Grid>

        {/* Widgets statistiques */}
        <Grid container spacing={isMobile ? 2 : 4} mb={isMobile ? 2 : 4}>
          <Grid item xs={12} sm={6} md={3}>
            <DashboardCard
              sx={{
                p: isMobile ? 2 : 3,
                textAlign: "center",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <CarIcon
                sx={{
                  fontSize: isMobile ? 30 : 40,
                  color: "#3b82f6",
                  mb: 1,
                  transition: "all 0.3s ease",
                }}
                aria-label="Icône de véhicules disponibles"
              />
              <Typography
                variant="body2"
                color="#6b7280"
                fontSize={isMobile ? "0.8rem" : "0.875rem"}
              >
                Véhicules disponibles
              </Typography>
              <Typography
                variant="h5"
                fontSize={isMobile ? "1.2rem" : "1.5rem"}
                color="#1f2937"
              >
                {availableVehiclesCount ?? "Chargement..."}
              </Typography>
            </DashboardCard>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <DashboardCard
              sx={{
                p: isMobile ? 2 : 3,
                textAlign: "center",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <PeopleIcon
                sx={{
                  fontSize: isMobile ? 30 : 40,
                  color: "#3b82f6",
                  mb: 1,
                  transition: "all 0.3s ease",
                }}
                aria-label="Icône de total clients"
              />
              <Typography
                variant="body2"
                color="#6b7280"
                fontSize={isMobile ? "0.8rem" : "0.875rem"}
              >
                Total Clients
              </Typography>
              <Typography
                variant="h5"
                fontSize={isMobile ? "1.2rem" : "1.5rem"}
                color="#1f2937"
              >
                {availableClientsCount ?? "Chargement..."}
              </Typography>
            </DashboardCard>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <DashboardCard
              sx={{
                p: isMobile ? 2 : 3,
                textAlign: "center",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <MoneyIcon
                sx={{
                  fontSize: isMobile ? 30 : 40,
                  color: "#3b82f6",
                  mb: 1,
                  transition: "all 0.3s ease",
                }}
                aria-label="Icône de revenus totaux"
              />
              <Typography
                variant="body2"
                color="#6b7280"
                fontSize={isMobile ? "0.8rem" : "0.875rem"}
              >
                Revenus totaux
              </Typography>
              <Typography
                variant="h5"
                fontSize={isMobile ? "1.2rem" : "1.5rem"}
                color="#1f2937"
              >
                {totalRevenue !== null
                  ? formatCurrencyAr(totalRevenue)
                  : "Chargement..."}
              </Typography>
            </DashboardCard>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <DashboardCard
              sx={{
                p: isMobile ? 2 : 3,
                textAlign: "center",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <PercentIcon
                sx={{
                  fontSize: isMobile ? 30 : 40,
                  color: "#3b82f6",
                  mb: 1,
                  transition: "all 0.3s ease",
                }}
                aria-label="Icône de taux d'occupation"
              />
              <Typography
                variant="body2"
                color="#6b7280"
                fontSize={isMobile ? "0.8rem" : "0.875rem"}
              >
                Taux d'occupation
              </Typography>
              <Typography
                variant="h5"
                fontSize={isMobile ? "1.2rem" : "1.5rem"}
                color="#1f2937"
              >
                {occupancyRate !== null
                  ? `${occupancyRate}%`
                  : "Chargement..."}
              </Typography>
            </DashboardCard>
          </Grid>
        </Grid>

        {/* Graphique et véhicules disponibles */}
        <Grid container spacing={isMobile ? 2 : 4}>
          <Grid item xs={12} md={8}>
            <DashboardCard sx={{ p: isMobile ? 2 : 3 }}>
              <Typography
                variant="h6"
                gutterBottom
                fontSize={isMobile ? "1rem" : "1.25rem"}
                color="#1f2937"
              >
                Performance{" "}
                <TrendingUpIcon
                  sx={{
                    verticalAlign: "middle",
                    ml: 1,
                    fontSize: isMobile ? "1rem" : "1.25rem",
                    color: "#3b82f6",
                  }}
                />
              </Typography>
              <Box sx={{ height: isMobile ? 200 : 300 }}>
                <LineChart
                  xAxis={[
                    {
                      data: [1, 2, 3, 4, 5],
                      label: "Mois",
                      scaleType: "point",
                      tickFontSize: isMobile ? 10 : 12,
                    },
                  ]}
                  series={[
                    {
                      data: [200000, 300000, 250000, 400000, 350000],
                      label: "Revenus (Ar)",
                      color: "#3b82f6",
                    },
                  ]}
                  height={isMobile ? 200 : 300}
                  margin={{ top: 20, bottom: 40, left: 50, right: 20 }}
                  sx={{
                    "& .MuiChartsAxis-tickLabel": {
                      fontSize: isMobile ? "0.7rem" : "0.8rem",
                    },
                    "& .MuiChartsAxis-label": {
                      fontSize: isMobile ? "0.8rem" : "0.9rem",
                    },
                  }}
                />
              </Box>
            </DashboardCard>
          </Grid>
          <Grid item xs={12} md={4}>
            <DashboardCard sx={{ p: isMobile ? 2 : 3 }}>
              <Typography
                variant="h6"
                gutterBottom
                fontSize={isMobile ? "1rem" : "1.25rem"}
                color="#1f2937"
              >
                Véhicules disponibles
              </Typography>
              <Box
                sx={{
                  maxHeight: isMobile ? 200 : 300,
                  overflowY: "auto",
                  overflowX: "hidden",
                  pr: 1,
                  "&::-webkit-scrollbar": {
                    width: "8px",
                  },
                  "&::-webkit-scrollbar-track": {
                    background: "#f3f4f6",
                    borderRadius: "4px",
                  },
                  "&::-webkit-scrollbar-thumb": {
                    background: "#3b82f6",
                    borderRadius: "4px",
                  },
                  "&::-webkit-scrollbar-thumb:hover": {
                    background: "#2563eb",
                  },
                  scrollbarWidth: "thin",
                  scrollbarColor: "#3b82f6 #f3f4f6",
                }}
              >
                {availableCars.length > 0 ? (
                  availableCars.map((car: Vehicle) => (
                    <Box
                      key={car.id}
                      display="flex"
                      alignItems="center"
                      gap={2}
                      my={isMobile ? 1 : 2}
                      sx={{
                        p: 1,
                        borderRadius: "8px",
                        transition: "background-color 0.3s ease",
                        "&:hover": {
                          backgroundColor: "#f3f4f6",
                        },
                      }}
                      aria-label={`Véhicule disponible: ${car.nom}`}
                    >
                      <Avatar
                        variant="rounded"
                        src={car.imageUrl}
                        sx={{
                          width: isMobile ? 40 : 56,
                          height: isMobile ? 40 : 56,
                        }}
                      />
                      <Box>
                        <Typography
                          variant="subtitle1"
                          fontSize={isMobile ? "0.9rem" : "1rem"}
                          color="#1f2937"
                        >
                          {car.nom}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="success.main"
                          fontSize={isMobile ? "0.8rem" : "0.875rem"}
                        >
                          {car.status.status}
                        </Typography>
                      </Box>
                    </Box>
                  ))
                ) : (
                  <Typography
                    variant="body2"
                    color="#6b7280"
                    fontSize={isMobile ? "0.8rem" : "0.875rem"}
                  >
                    Aucun véhicule disponible pour le moment.
                  </Typography>
                )}
              </Box>
            </DashboardCard>
          </Grid>
        </Grid>

        {/* Réservations récentes */}
        <Grid item xs={12}>
          <DashboardCard sx={{ p: isMobile ? 2 : 3 }}>
            <Typography
              variant="h6"
              gutterBottom
              fontSize={isMobile ? "1rem" : "1.25rem"}
              color="#1f2937"
            >
              Réservations en Attente
            </Typography>
            {isMobile ? (
              // Vue Mobile : Liste de cartes pour les réservations
              <Box>
                {pendingReservations.length > 0 ? (
                  pendingReservations.map((reservation: Reservation) => (
                    <Card
                      key={reservation.id}
                      variant="outlined"
                      sx={{ mb: 2, borderRadius: 2 }}
                    >
                      <CardContent>
                        <Box
                          display="flex"
                          justifyContent="space-between"
                          alignItems="center"
                          mb={1}
                        >
                          <Typography variant="h6" fontSize="1rem">
                            {reservation.reference || "N/A"}
                          </Typography>
                          <Chip
                            label={reservation.status}
                            color="secondary"
                            size="small"
                          />
                        </Box>
                        <Box display="flex" alignItems="center" mb={0.5}>
                          <PersonIcon
                            fontSize="small"
                            sx={{ mr: 1, color: "text.secondary" }}
                          />
                          <Typography variant="body2">
                            {getClientName(reservation)}
                          </Typography>
                        </Box>
                        <Box display="flex" alignItems="center" mb={0.5}>
                          <CarIcon
                            fontSize="small"
                            sx={{ mr: 1, color: "text.secondary" }}
                          />
                          <Typography variant="body2">
                            {getVehicleName(reservation)} (
                            {getVehicleLicensePlate(reservation)})
                          </Typography>
                        </Box>
                        <Box display="flex" alignItems="center" mb={1}>
                          <CalendarIcon
                            fontSize="small"
                            sx={{ mr: 1, color: "text.secondary" }}
                          />
                          <Typography variant="body2">
                            {new Date(
                              reservation.pickup_date
                            ).toLocaleDateString()}{" "}
                            -{" "}
                            {new Date(
                              reservation.return_date
                            ).toLocaleDateString()}
                          </Typography>
                        </Box>
                        <Typography
                          variant="h6"
                          color="primary"
                          fontWeight="bold"
                        >
                          {reservation.total_price
                            ? formatCurrencyAr(reservation.total_price)
                            : "N/A"}
                        </Typography>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <Typography variant="body2" color="text.secondary" align="center">
                    Aucune réservation en attente.
                  </Typography>
                )}
              </Box>
            ) : (
              // Vue Desktop : Table classique
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Référence</TableCell>
                      <TableCell>Client</TableCell>
                      <TableCell>Véhicule</TableCell>
                      <TableCell>Dates</TableCell>
                      <TableCell>Prix Total</TableCell>
                      <TableCell>Statut</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {pendingReservations.length > 0 ? (
                      pendingReservations.map((reservation: Reservation) => (
                        <TableRow key={reservation.id} hover>
                          <TableCell>{reservation.reference || "N/A"}</TableCell>
                          <TableCell>
                            <Box sx={{ display: "flex", alignItems: "center" }}>
                              <PersonIcon
                                sx={{
                                  fontSize: 20,
                                  mr: 1,
                                  color: "text.secondary",
                                }}
                              />
                              {getClientName(reservation)}
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
                              {getVehicleName(reservation)} (
                              {getVehicleLicensePlate(reservation)})
                            </Box>
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
                              Du{" "}
                              {new Date(
                                reservation.pickup_date
                              ).toLocaleDateString()}{" "}
                              au{" "}
                              {new Date(
                                reservation.return_date
                              ).toLocaleDateString()}
                            </Box>
                          </TableCell>
                          <TableCell>
                            {reservation.total_price
                              ? formatCurrencyAr(reservation.total_price)
                              : "N/A"}
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={reservation.status}
                              color="secondary"
                              size="small"
                            />
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} align="center">
                          <Typography variant="body2" color="#6b7280">
                            Aucune réservation confirmée pour le moment.
                          </Typography>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </DashboardCard>
        </Grid>

        {/* Dialogue de confirmation de suppression */}
        <Dialog
          open={openDeleteDialog}
          onClose={() => setOpenDeleteDialog(false)}
          sx={{
            "& .MuiDialog-paper": {
              borderRadius: "12px",
              boxShadow: "0 4px 16px rgba(0, 0, 0, 0.15)",
              backgroundColor: "#fff",
            },
          }}
        >
          <DialogTitle
            sx={{
              fontWeight: 600,
              color: "#1f2937",
              textAlign: "center",
              py: 3,
            }}
          >
            Confirmer la suppression
          </DialogTitle>
          <DialogContent sx={{ p: 4 }}>
            <DialogContentText
              sx={{ color: "#1f2937", fontSize: "1rem", textAlign: "center" }}
            >
              Êtes-vous sûr de vouloir supprimer la réservation de{" "}
              {bookingToDelete?.client} ?
            </DialogContentText>
          </DialogContent>
          <DialogActions
            sx={{ p: 3, display: "flex", justifyContent: "space-between" }}
          >
            <CancelButton
              onClick={() => setOpenDeleteDialog(false)}
              aria-label="Annuler la suppression"
            >
              Annuler
            </CancelButton>
            <SecondaryButton
              onClick={handleDeleteBooking}
              aria-label="Confirmer la suppression"
            >
              Supprimer
            </SecondaryButton>
          </DialogActions>
        </Dialog>

        {/* Snackbar de succès */}
        <Snackbar
          open={openSnackbar}
          autoHideDuration={3000}
          onClose={() => setOpenSnackbar(false)}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <Alert
            onClose={() => setOpenSnackbar(false)}
            severity="success"
            sx={{
              width: "100%",
              backgroundColor: "#10b981",
              color: "#fff",
              "& .MuiAlert-icon": {
                color: "#fff",
              },
            }}
          >
            Réservation supprimée avec succès !
          </Alert>
        </Snackbar>
      </Box>
    </ThemeProvider>
  );
};

export default Accueil;
