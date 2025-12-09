import React, { useEffect, useState, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "../../../hooks";
import {
  addPaiement,
  fetchAllPaiementsWithDetails,
  PaymentMethod,
  resetPaiementState,
} from "../../../redux/features/paiement/paiementSlice";
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Alert,
  CircularProgress,
  IconButton,
  useTheme,
  Avatar,
  InputAdornment,
  TablePagination,
  Tooltip,
} from "@mui/material";
import {
  Add as AddIcon,
  Close as CloseIcon,
  Assignment as AssignmentIcon,
  Person as PersonIcon,
  AttachMoney as MoneyIcon,
  TrendingUp as TrendingUpIcon,
  Receipt as ReceiptIcon,
  History as HistoryIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
} from "@mui/icons-material";
import PaymentIcon from "@mui/icons-material/Payment";
import { styled } from "@mui/material/styles";

// Styles cohérents avec la page d'accueil
const DashboardCard = styled(Card)(({ }) => ({
  borderRadius: "12px",
  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
  backgroundColor: "#fff",
  transition: "box-shadow 0.3s ease, transform 0.2s ease-in-out",
  "&:hover": {
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
    transform: "scale(1.02)",
  },
}));

const PaiementPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const { paiements, isLoading, isError, message } = useAppSelector(
    (state) => state.paiements
  );
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    bdcReference: "",
    montant: "",
    methode: PaymentMethod.ESPECES,
    referenceTransaction: "",
  });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedBdc, setSelectedBdc] = useState<string | null>(null);
  const [historyModalOpen, setHistoryModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [paymentFilter, setPaymentFilter] = useState<
    "all" | "paid" | "pending"
  >("all");
  const [pendingBDC, setPendingBDC] = useState<any[]>([]);

  useEffect(() => {
    dispatch(fetchAllPaiementsWithDetails());
  }, [dispatch]);

  useEffect(() => {
    return () => {
      dispatch(resetPaiementState());
    };
  }, [dispatch]);

  // Récupérer les BDC en attente de paiement
  useEffect(() => {
    const fetchPendingBDC = async () => {
      try {
        const response = await fetch("http://localhost:3000/commande/pending-payments");
        const data = await response.json();
        if (response.ok) {
          setPendingBDC(data || []);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des BDC en attente", error);
      }
    };
    fetchPendingBDC();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR");
  };

  const formatCurrencyAr = (amount: number) => {
    return (
      new Intl.NumberFormat("fr-FR", {
        maximumFractionDigits: 0,
      }).format(amount) + " Ar"
    );
  };

  // Fonction pour obtenir le nom du client de manière sécurisée
  const getClientName = (bdc: any) => {
    if (!bdc?.reservation?.client) return "N/A";

    const client = bdc.reservation.client;
    return `${client.firstName || ""} ${client.lastName || ""}`.trim() || "N/A";
  };

  // Fonction pour obtenir les détails du véhicule de manière sécurisée
  const getVehicleDetails = (bdc: any) => {
    if (!bdc?.reservation?.vehicule) return "N/A";

    const vehicle = bdc.reservation.vehicule;
    if (vehicle.marque && vehicle.immatriculation)
      return `${vehicle.marque} ${vehicle.immatriculation}`;
    if (vehicle.marque && vehicle.modele)
      return `${vehicle.marque} ${vehicle.modele}`;
    if (vehicle.marque) return vehicle.marque;
    if (vehicle.immatriculation) return vehicle.immatriculation;

    return "N/A";
  };

  // Grouper les paiements par bon de commande
  const paiementsByBdc = useMemo(() => {
    return paiements.reduce((acc, paiement) => {
      const bdcRef = paiement.bdc?.reference || "unknown";
      if (!acc[bdcRef]) {
        acc[bdcRef] = {
          bdc: paiement.bdc,
          paiements: [],
          totalPaye: 0,
          montantTotal:
            paiement.resume_paiement?.montantTotal ||
            paiement.details_bdc?.reservation?.total_price ||
            0,
        };
      }
      acc[bdcRef].paiements.push(paiement);
      acc[bdcRef].totalPaye += parseFloat(paiement.montant);
      return acc;
    }, {} as Record<string, any>);
  }, [paiements]);

  // Fonction pour déterminer le statut de paiement d'un BDC
  const getPaymentStatus = (bdcData: any) => {
    const totalPaye = bdcData.totalPaye;
    const montantTotal = bdcData.montantTotal;
    return totalPaye >= montantTotal ? "paid" : "pending";
  };

  // Filtrer les paiements en fonction du terme de recherche et du filtre de statut
  const filteredPaiements = useMemo(() => {
    return paiements.filter((paiement) => {
      const searchLower = searchTerm.toLowerCase();
      const bdcRef = paiement.bdc?.reference || "";
      const clientName = getClientName(paiement.bdc).toLowerCase();

      // Vérifier d'abord le terme de recherche
      const matchesSearch =
        bdcRef.toLowerCase().includes(searchLower) ||
        clientName.includes(searchLower);

      // Si aucun filtre de statut n'est appliqué, retourner les résultats de la recherche
      if (paymentFilter === "all") return matchesSearch;

      // Trouver les données du BDC pour ce paiement
      const bdcRefForPaiement = paiement.bdc?.reference || "unknown";
      const bdcData = paiementsByBdc[bdcRefForPaiement];

      // Si nous n'avons pas de données BDC, inclure ou non selon le filtre
      if (!bdcData) return paymentFilter === "pending" && matchesSearch;

      // Vérifier le statut de paiement
      const status = getPaymentStatus(bdcData);

      return status === paymentFilter && matchesSearch;
    });
  }, [paiements, searchTerm, paymentFilter, paiementsByBdc]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(
      addPaiement({
        bdcReference: formData.bdcReference,
        montant: parseFloat(formData.montant),
        methode: formData.methode,
        reference: formData.referenceTransaction || undefined,
      })
    ).then(() => {
      setFormData({
        bdcReference: "",
        montant: "",
        methode: PaymentMethod.ESPECES,
        referenceTransaction: "",
      });
      setShowAddForm(false);
      // Recharger les données après un délai
      setTimeout(() => {
        dispatch(fetchAllPaiementsWithDetails());
        // Rafraîchir aussi les BDC en attente
        fetch("http://localhost:3000/commande/pending-payments")
          .then(res => res.json())
          .then(data => setPendingBDC(data || []))
          .catch(err => console.error("Erreur lors du rafraîchissement des BDC", err));
      }, 500);
    });
  };

  const handleReset = () => {
    setFormData({
      bdcReference: "",
      montant: "",
      methode: PaymentMethod.ESPECES,
      referenceTransaction: "",
    });
    setShowAddForm(false);
    dispatch(resetPaiementState());
  };

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleGenerateFacture = (bdcReference: string) => {
    console.log("Générer facture pour:", bdcReference);
    // Logique pour générer une facture
  };

  const handleViewHistory = (bdcReference: string) => {
    setSelectedBdc(bdcReference);
    setHistoryModalOpen(true);
  };

  const handleCloseHistory = () => {
    setHistoryModalOpen(false);
    setSelectedBdc(null);
  };

  // Fonction pour pré-remplir le formulaire avec les infos du BDC
  const handleAddPaymentForBDC = (bdcReference: string) => {
    setFormData({
      ...formData,
      bdcReference: bdcReference,
    });
    setShowAddForm(true);
  };

  // Calculer les statistiques globales
  const totalPaiements = Object.values(paiementsByBdc).reduce(
    (sum: number, data: any) => sum + data.totalPaye,
    0
  );
  const totalMontant = Object.values(paiementsByBdc).reduce(
    (sum: number, data: any) => sum + data.montantTotal,
    0
  );

  // Pagination des paiements
  const paginatedPaiements = filteredPaiements.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "50vh",
          flexDirection: "column",
        }}
      >
        <CircularProgress size={60} />
        <Typography
          variant="h6"
          sx={{
            mt: 2,
            fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
          }}
        >
          Chargement des paiements...
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ px: 3, py: 2, backgroundColor: "#f9fafb", minHeight: "100vh" }}>
      {/* En-tête de page */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Box>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 600,
              marginBottom: 1,
              color: "#1f2937",
              fontFamily:
                '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
            }}
          >
            Gestion des Paiements
          </Typography>
          <Typography
            variant="body1"
            sx={{
              fontSize: "0.9rem",
              color: "#6b7280",
              fontFamily:
                '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
            }}
          >
            Suivez et gérez tous les paiements de votre entreprise
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setShowAddForm(true)}
          sx={{
            borderRadius: "12px",
            textTransform: "none",
            fontWeight: 600,
            px: 3,
            py: 1.5,
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
            "&:hover": {
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
            },
            fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
          }}
        >
          Nouveau Paiement
        </Button>
      </Box>

      {/* Champ de recherche */}
      <Box sx={{ mb: 2 }}>
        <TextField
          fullWidth
          placeholder="Rechercher par référence BDC ou nom client..."
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

      {/* Filtre par statut de paiement */}
      <Box sx={{ mb: 3, display: "flex", alignItems: "center", gap: 1 }}>
        <FilterIcon color="action" />
        <Typography
          variant="body2"
          sx={{
            color: "#6b7280",
            fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
          }}
        >
          Filtrer par statut:
        </Typography>
        <Chip
          label="Tous"
          clickable
          color={paymentFilter === "all" ? "primary" : "default"}
          onClick={() => setPaymentFilter("all")}
          sx={{
            fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
          }}
        />
        <Chip
          label="Complets"
          clickable
          color={paymentFilter === "paid" ? "primary" : "default"}
          onClick={() => setPaymentFilter("paid")}
          sx={{
            fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
          }}
        />
        <Chip
          label="En attente"
          clickable
          color={paymentFilter === "pending" ? "primary" : "default"}
          onClick={() => setPaymentFilter("pending")}
          sx={{
            fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
          }}
        />
      </Box>

      {/* Statistiques globales */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <DashboardCard
            sx={{
              p: 3,
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Avatar sx={{ bgcolor: "#3b82f6", mr: 2, width: 56, height: 56 }}>
              <TrendingUpIcon sx={{ fontSize: 30 }} />
            </Avatar>
            <Box>
              <Typography
                variant="h4"
                fontWeight={700}
                sx={{
                  color: "#1f2937",
                  mt: 1,
                  fontFamily:
                    '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
                }}
              >
                {formatCurrencyAr(totalPaiements)}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: "#6b7280",
                  fontSize: "0.875rem",
                  fontFamily:
                    '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
                }}
              >
                Total des paiements
              </Typography>
            </Box>
          </DashboardCard>
        </Grid>
        <Grid item xs={12} md={6}>
          <DashboardCard
            sx={{
              p: 3,
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Avatar sx={{ bgcolor: "#ef4444", mr: 2, width: 56, height: 56 }}>
              <ReceiptIcon sx={{ fontSize: 30 }} />
            </Avatar>
            <Box>
              <Typography
                variant="h4"
                fontWeight={700}
                sx={{
                  color: "#1f2937",
                  mt: 1,
                  fontFamily:
                    '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
                }}
              >
                {formatCurrencyAr(pendingBDC.reduce((sum, bdc) => sum + bdc.reste, 0))}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: "#6b7280",
                  fontSize: "0.875rem",
                  fontFamily:
                    '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
                }}
              >
                Total BDC en attente
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: "#9ca3af",
                  fontSize: "0.75rem",
                  fontFamily:
                    '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
                }}
              >
                ({pendingBDC.length} bon{pendingBDC.length > 1 ? 's' : ''} de commande)
              </Typography>
            </Box>
          </DashboardCard>
        </Grid>
      </Grid>

      {/* Formulaire d'ajout de paiement */}
      <Dialog
        open={showAddForm}
        onClose={() => setShowAddForm(false)}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: 3,
            fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
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
            backgroundColor: "primary.main",
            color: "white",
            fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
          }}
        >
          Nouveau Paiement
          <IconButton
            onClick={() => setShowAddForm(false)}
            size="small"
            sx={{ color: "white" }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ py: 3 }}>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Référence Bon de Commande"
                  value={formData.bdcReference}
                  onChange={(e) =>
                    setFormData({ ...formData, bdcReference: e.target.value })
                  }
                  required
                  variant="outlined"
                  sx={{
                    fontFamily:
                      '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Montant"
                  type="number"
                  inputProps={{ step: "0.01" }}
                  value={formData.montant}
                  onChange={(e) =>
                    setFormData({ ...formData, montant: e.target.value })
                  }
                  required
                  variant="outlined"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <MoneyIcon color="action" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    fontFamily:
                      '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  select
                  label="Méthode de Paiement"
                  value={formData.methode}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      methode: e.target.value as PaymentMethod,
                    })
                  }
                  variant="outlined"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PaymentIcon color="action" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    fontFamily:
                      '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
                  }}
                >
                  <MenuItem
                    value={PaymentMethod.ESPECES}
                    sx={{
                      fontFamily:
                        '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
                    }}
                  >
                    Espèces
                  </MenuItem>
                  <MenuItem
                    value={PaymentMethod.MOBILE_MONEY}
                    sx={{
                      fontFamily:
                        '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
                    }}
                  >
                    Mobile Money
                  </MenuItem>
                  <MenuItem
                    value={PaymentMethod.CARTE_BANCAIRE}
                    sx={{
                      fontFamily:
                        '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
                    }}
                  >
                    Carte Bancaire
                  </MenuItem>
                </TextField>
              </Grid>

              {(formData.methode === PaymentMethod.MOBILE_MONEY ||
                formData.methode === PaymentMethod.CARTE_BANCAIRE) && (
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Référence Transaction"
                      value={formData.referenceTransaction}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          referenceTransaction: e.target.value,
                        })
                      }
                      required
                      variant="outlined"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <AssignmentIcon color="action" />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        fontFamily:
                          '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
                      }}
                    />
                  </Grid>
                )}
            </Grid>
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
            onClick={handleReset}
            color="inherit"
            sx={{
              fontWeight: 600,
              borderRadius: "8px",
              textTransform: "none",
              fontFamily:
                '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
            }}
          >
            Annuler
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={isLoading}
            sx={{
              fontWeight: 600,
              borderRadius: "8px",
              textTransform: "none",
              fontFamily:
                '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
            }}
          >
            {isLoading ? <CircularProgress size={24} /> : "Ajouter Paiement"}
          </Button>
        </DialogActions>
      </Dialog >

      {/* Affichage des erreurs */}
      {
        isError && (
          <Alert
            severity="error"
            sx={{
              mb: 3,
              borderRadius: 2,
              fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
            }}
            action={
              <IconButton
                aria-label="close"
                color="inherit"
                size="small"
                onClick={() => dispatch(resetPaiementState())}
              >
                <CloseIcon fontSize="inherit" />
              </IconButton>
            }
          >
            {message}
          </Alert>
        )
      }

      {/* Section BDC en Attente de Paiement */}
      {
        pendingBDC.length > 0 && paymentFilter !== "paid" && (
          <Box sx={{ mb: 4 }}>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 600,
                color: "#1f2937",
                mb: 2,
                display: "flex",
                alignItems: "center",
                fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
              }}
            >
              <MoneyIcon sx={{ mr: 1, color: "#ef4444" }} />
              Bons de Commande en Attente de Paiement ({pendingBDC.length})
            </Typography>

            <Grid container spacing={2}>
              {pendingBDC.map((bdc) => (
                <Grid item xs={12} md={6} lg={4} key={bdc.id}>
                  <DashboardCard sx={{ p: 2, borderLeft: "4px solid #ef4444" }}>
                    <Box sx={{ mb: 1.5 }}>
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 600,
                          color: "#1f2937",
                          mb: 0.5,
                          fontFamily:
                            '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
                        }}
                      >
                        {bdc.reference}
                      </Typography>
                      <Box sx={{ display: "flex", alignItems: "center", mb: 0.5 }}>
                        <PersonIcon
                          sx={{ fontSize: 16, mr: 0.5, color: "text.secondary" }}
                        />
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            fontFamily:
                              '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
                          }}
                        >
                          {bdc.client.lastName}
                        </Typography>
                      </Box>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          fontFamily:
                            '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
                        }}
                      >
                        {bdc.vehicule.marque} {bdc.vehicule.immatriculation}
                      </Typography>
                    </Box>

                    <Box
                      sx={{
                        bgcolor: "#f3f4f6",
                        p: 1.5,
                        borderRadius: 1,
                        mb: 1.5,
                      }}
                    >
                      <Grid container spacing={1}>
                        <Grid item xs={6}>
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{
                              fontFamily:
                                '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
                            }}
                          >
                            Total
                          </Typography>
                          <Typography
                            variant="body2"
                            fontWeight={600}
                            sx={{
                              fontFamily:
                                '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
                            }}
                          >
                            {formatCurrencyAr(bdc.montantTotal)}
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{
                              fontFamily:
                                '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
                            }}
                          >
                            Payé
                          </Typography>
                          <Typography
                            variant="body2"
                            fontWeight={600}
                            color="success.main"
                            sx={{
                              fontFamily:
                                '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
                            }}
                          >
                            {formatCurrencyAr(bdc.totalPaye)}
                          </Typography>
                        </Grid>
                        <Grid item xs={12}>
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{
                              fontFamily:
                                '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
                            }}
                          >
                            Reste à payer
                          </Typography>
                          <Typography
                            variant="h6"
                            fontWeight={700}
                            color="error.main"
                            sx={{
                              fontFamily:
                                '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
                            }}
                          >
                            {formatCurrencyAr(bdc.reste)}
                          </Typography>
                        </Grid>
                      </Grid>
                    </Box>

                    <Button
                      fullWidth
                      variant="contained"
                      startIcon={<AddIcon />}
                      onClick={() => handleAddPaymentForBDC(bdc.reference)}
                      sx={{
                        borderRadius: "8px",
                        textTransform: "none",
                        fontWeight: 600,
                        fontFamily:
                          '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
                      }}
                    >
                      Ajouter Paiement
                    </Button>
                  </DashboardCard>
                </Grid>
              ))}
            </Grid>
          </Box>
        )
      }

      {/* Tableau des paiements */}
      <Box sx={{ mb: 3 }}>
        <Typography
          variant="h5"
          sx={{
            fontWeight: 600,
            color: "#1f2937",
            mb: 3,
            fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
          }}
        >
          Liste des Paiements
        </Typography>

        {filteredPaiements.length === 0 ? (
          <DashboardCard sx={{ p: 4, textAlign: "center" }}>
            <AssignmentIcon sx={{ fontSize: 60, color: "grey.400", mb: 2 }} />
            <Typography
              variant="h6"
              color="textSecondary"
              gutterBottom
              sx={{
                fontFamily:
                  '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
              }}
            >
              {searchTerm
                ? "Aucun résultat trouvé"
                : "Aucun paiement enregistré"}
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                mb: 2,
                fontFamily:
                  '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
              }}
            >
              {searchTerm
                ? "Essayez une autre recherche"
                : "Commencez par ajouter votre premier paiement"}
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setShowAddForm(true)}
              sx={{
                borderRadius: 2,
                fontFamily:
                  '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
              }}
            >
              Ajouter un paiement
            </Button>
          </DashboardCard>
        ) : (
          <DashboardCard sx={{ p: 0, overflow: "hidden" }}>
            <Box
              sx={{
                p: 2,
                bgcolor: "grey.100",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <AssignmentIcon sx={{ mr: 1, color: "#3b82f6" }} />
                <Typography
                  variant="h6"
                  fontWeight={600}
                  sx={{
                    color: "#1f2937",
                    fontFamily:
                      '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
                  }}
                >
                  Tous les Paiements
                </Typography>
              </Box>
              <Chip
                label={
                  paymentFilter === "all"
                    ? "Tous"
                    : paymentFilter === "paid"
                      ? "Complets"
                      : "En attente"
                }
                color={
                  paymentFilter === "all"
                    ? "default"
                    : paymentFilter === "paid"
                      ? "success"
                      : "warning"
                }
                size="small"
              />
            </Box>

            <TableContainer component={Paper} elevation={0}>
              <Table sx={{ minWidth: 650 }} aria-label="table of payments">
                <TableHead sx={{ bgcolor: "grey.50" }}>
                  <TableRow>
                    <TableCell
                      sx={{
                        fontWeight: 700,
                        color: "#1f2937",
                        fontFamily:
                          '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
                      }}
                    >
                      Référence BDC
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: 700,
                        color: "#1f2937",
                        fontFamily:
                          '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
                      }}
                    >
                      Client
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: 700,
                        color: "#1f2937",
                        fontFamily:
                          '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
                      }}
                    >
                      Date
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: 700,
                        color: "#1f2937",
                        fontFamily:
                          '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
                      }}
                    >
                      Montant
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: 700,
                        color: "#1f2937",
                        fontFamily:
                          '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
                      }}
                    >
                      Méthode
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: 700,
                        color: "#1f2937",
                        fontFamily:
                          '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
                      }}
                    >
                      Référence Transaction
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: 700,
                        color: "#1f2937",
                        fontFamily:
                          '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
                      }}
                      align="center"
                    >
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedPaiements.map((paiement) => {
                    const bdcRef = paiement.bdc?.reference || "unknown";
                    const bdcData = paiementsByBdc[bdcRef];
                    const isPaid = bdcData
                      ? getPaymentStatus(bdcData) === "paid"
                      : false;

                    return (
                      <TableRow key={paiement.id} hover>
                        <TableCell>
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            <Typography
                              variant="body2"
                              fontWeight={500}
                              sx={{
                                color: "#1f2937",
                                fontFamily:
                                  '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
                              }}
                            >
                              {paiement.bdc?.reference || "N/A"}
                            </Typography>
                            {isPaid && (
                              <Chip
                                label="Payé"
                                size="small"
                                color="success"
                                sx={{ ml: 1, height: 20, fontSize: "0.7rem" }}
                              />
                            )}
                          </Box>
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
                            <Typography
                              variant="body2"
                              sx={{
                                color: "#1f2937",
                                fontFamily:
                                  '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
                              }}
                            >
                              {getClientName(paiement.bdc)}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography
                            variant="body2"
                            sx={{
                              color: "#1f2937",
                              fontFamily:
                                '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
                            }}
                          >
                            {formatDate(paiement.date_paiement)}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography
                            variant="body2"
                            fontWeight={500}
                            sx={{
                              color: "#1f2937",
                              fontFamily:
                                '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
                            }}
                          >
                            {formatCurrencyAr(parseFloat(paiement.montant))}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={paiement.methode}
                            size="small"
                            sx={{
                              backgroundColor: "#3b82f6",
                              color: "white",
                              fontWeight: 500,
                              fontFamily:
                                '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <Typography
                            variant="body2"
                            sx={{
                              color: "#1f2937",
                              fontFamily:
                                '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
                            }}
                          >
                            {paiement.reference_transaction || "N/A"}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Box
                            sx={{
                              display: "flex",
                              gap: 1,
                              justifyContent: "center",
                            }}
                          >
                            <Tooltip title="Générer Facture" arrow>
                              <IconButton
                                onClick={() =>
                                  handleGenerateFacture(paiement.bdc?.reference)
                                }
                                color="primary"
                                size="small"
                                sx={{
                                  backgroundColor: "#3b82f6",
                                  color: "white",
                                  "&:hover": { backgroundColor: "#2563eb" },
                                }}
                              >
                                <ReceiptIcon />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Voir Historique" arrow>
                              <IconButton
                                onClick={() =>
                                  handleViewHistory(paiement.bdc?.reference)
                                }
                                color="info"
                                size="small"
                                sx={{
                                  backgroundColor: "#10b981",
                                  color: "white",
                                  "&:hover": { backgroundColor: "#059669" },
                                }}
                              >
                                <HistoryIcon />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Pagination */}
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={filteredPaiements.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              labelRowsPerPage="Lignes par page"
              labelDisplayedRows={({ from, to, count }) =>
                `${from}-${to} sur ${count}`
              }
              sx={{
                borderTop: "1px solid rgba(224, 224, 224, 1)",
                fontFamily:
                  '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
              }}
            />
          </DashboardCard>
        )}
      </Box>

      {/* Modal pour l'historique des paiements */}
      <Dialog
        open={historyModalOpen}
        onClose={handleCloseHistory}
        fullWidth
        maxWidth="md"
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: 3,
            fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
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
            backgroundColor: "primary.main",
            color: "white",
            fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
          }}
        >
          <Box>Historique des Paiements - BDC: {selectedBdc}</Box>
          <IconButton
            onClick={handleCloseHistory}
            size="small"
            sx={{ color: "white" }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ py: 3 }}>
          {selectedBdc && paiementsByBdc[selectedBdc] && (
            <Box>
              {/* Informations sur le BDC */}
              <Card variant="outlined" sx={{ borderRadius: 2, mb: 3 }}>
                <CardContent>
                  <Typography
                    variant="h6"
                    sx={{
                      borderBottom: "1px solid #ddd",
                      pb: 1,
                      mb: 2,
                      fontFamily:
                        '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
                    }}
                  >
                    Informations du Bon de Commande
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <Box sx={{ mb: 2 }}>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            fontFamily:
                              '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
                          }}
                        >
                          Référence BDC
                        </Typography>
                        <Typography
                          variant="body1"
                          fontWeight={500}
                          sx={{
                            fontFamily:
                              '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
                          }}
                        >
                          {selectedBdc}
                        </Typography>
                      </Box>
                      <Box sx={{ mb: 2 }}>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            fontFamily:
                              '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
                          }}
                        >
                          Client
                        </Typography>
                        <Typography
                          variant="body1"
                          fontWeight={500}
                          sx={{
                            fontFamily:
                              '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
                          }}
                        >
                          {getClientName(paiementsByBdc[selectedBdc].bdc)}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Box sx={{ mb: 2 }}>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            fontFamily:
                              '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
                          }}
                        >
                          Véhicule
                        </Typography>
                        <Typography
                          variant="body1"
                          fontWeight={500}
                          sx={{
                            fontFamily:
                              '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
                          }}
                        >
                          {getVehicleDetails(paiementsByBdc[selectedBdc].bdc)}
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>

              {/* Détails des paiements */}
              <Typography
                variant="h6"
                sx={{
                  mb: 2,
                  fontFamily:
                    '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
                }}
              >
                Détails des paiements
              </Typography>

              <TableContainer
                component={Paper}
                elevation={0}
                sx={{ borderRadius: 2 }}
              >
                <Table size="small">
                  <TableHead sx={{ bgcolor: "grey.50" }}>
                    <TableRow>
                      <TableCell
                        sx={{
                          fontWeight: 700,
                          fontFamily:
                            '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
                        }}
                      >
                        Date
                      </TableCell>
                      <TableCell
                        sx={{
                          fontWeight: 700,
                          fontFamily:
                            '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
                        }}
                      >
                        Montant
                      </TableCell>
                      <TableCell
                        sx={{
                          fontWeight: 700,
                          fontFamily:
                            '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
                        }}
                      >
                        Méthode
                      </TableCell>
                      <TableCell
                        sx={{
                          fontWeight: 700,
                          fontFamily:
                            '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
                        }}
                      >
                        Référence
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {paiementsByBdc[selectedBdc].paiements.map(
                      (paiement: any) => (
                        <TableRow key={paiement.id} hover>
                          <TableCell
                            sx={{
                              fontFamily:
                                '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
                            }}
                          >
                            {formatDate(paiement.date_paiement)}
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: "flex", alignItems: "center" }}>
                              <MoneyIcon
                                sx={{
                                  fontSize: 16,
                                  mr: 0.5,
                                  color: "success.main",
                                }}
                              />
                              <span
                                style={{
                                  fontFamily:
                                    '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
                                }}
                              >
                                {formatCurrencyAr(parseFloat(paiement.montant))}
                              </span>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={paiement.methode}
                              size="small"
                              color="primary"
                              variant="outlined"
                              sx={{
                                fontFamily:
                                  '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
                              }}
                            />
                          </TableCell>
                          <TableCell
                            sx={{
                              fontFamily:
                                '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
                            }}
                          >
                            {paiement.reference_transaction || "N/A"}
                          </TableCell>
                        </TableRow>
                      )
                    )}
                  </TableBody>
                </Table>
              </TableContainer>

              {/* Résumé des paiements */}
              <Card variant="outlined" sx={{ borderRadius: 2, mt: 3 }}>
                <CardContent>
                  <Typography
                    variant="h6"
                    sx={{
                      borderBottom: "1px solid #ddd",
                      pb: 1,
                      mb: 2,
                      fontFamily:
                        '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
                    }}
                  >
                    Résumé des Paiements
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={4}>
                      <Box
                        sx={{
                          textAlign: "center",
                          p: 2,
                          bgcolor: "grey.50",
                          borderRadius: 2,
                        }}
                      >
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            fontFamily:
                              '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
                          }}
                        >
                          Total à payer
                        </Typography>
                        <Typography
                          variant="h6"
                          fontWeight={600}
                          sx={{
                            fontFamily:
                              '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
                          }}
                        >
                          {formatCurrencyAr(
                            paiementsByBdc[selectedBdc].montantTotal
                          )}
                        </Typography>
                      </Box>
                    </Grid>

                    <Grid item xs={12} md={4}>
                      <Box
                        sx={{
                          textAlign: "center",
                          p: 2,
                          bgcolor: "success.light",
                          borderRadius: 2,
                        }}
                      >
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            fontFamily:
                              '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
                          }}
                        >
                          Total payé
                        </Typography>
                        <Typography
                          variant="h6"
                          fontWeight={600}
                          color="success.dark"
                          sx={{
                            fontFamily:
                              '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
                          }}
                        >
                          {formatCurrencyAr(
                            paiementsByBdc[selectedBdc].totalPaye
                          )}
                        </Typography>
                      </Box>
                    </Grid>

                    <Grid item xs={12} md={4}>
                      <Box
                        sx={{
                          textAlign: "center",
                          p: 2,
                          bgcolor: "warning.light",
                          borderRadius: 2,
                        }}
                      >
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            fontFamily:
                              '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
                          }}
                        >
                          Reste à payer
                        </Typography>
                        <Typography
                          variant="h6"
                          fontWeight={600}
                          color="warning.dark"
                          sx={{
                            fontFamily:
                              '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
                          }}
                        >
                          {formatCurrencyAr(
                            paiementsByBdc[selectedBdc].montantTotal -
                            paiementsByBdc[selectedBdc].totalPaye
                          )}
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Box>
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
            onClick={handleCloseHistory}
            color="inherit"
            sx={{
              fontWeight: 600,
              borderRadius: "8px",
              textTransform: "none",
              fontFamily:
                '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
            }}
          >
            Fermer
          </Button>
          <Button
            variant="contained"
            startIcon={<ReceiptIcon />}
            onClick={() => handleGenerateFacture(selectedBdc || "")}
            sx={{
              fontWeight: 600,
              borderRadius: "8px",
              textTransform: "none",
              fontFamily:
                '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
            }}
          >
            Générer Facture
          </Button>
        </DialogActions>
      </Dialog>
    </Box >
  );
};

export default PaiementPage;
