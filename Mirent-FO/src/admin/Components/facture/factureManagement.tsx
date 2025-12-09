import React, { useEffect, useState, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "../../../hooks";
import {
  fetchAllFactures,
  fetchFactureById,
  resetError,
  generateFactureFinale,
  generateFactureFinaleByReference,
} from "../../../redux/features/facture/factureSlice";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
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
  InputAdornment,
  TablePagination,
  Tooltip,
  Button,
} from "@mui/material";
import {
  Close as CloseIcon,
  Person as PersonIcon,
  History as HistoryIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  Print as PrintIcon,
} from "@mui/icons-material";
import PaymentIcon from "@mui/icons-material/Payment";
import { styled } from "@mui/material/styles";
import logoImage from "../../../assets/horizontal.png";
import signatureImage from "../../../assets/signature.png";

// Styles cohérents avec la page de paiement
const DashboardCard = styled(Card)(({}) => ({
  borderRadius: "12px",
  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
  backgroundColor: "#fff",
  transition: "box-shadow 0.3s ease, transform 0.2s ease-in-out",
  "&:hover": {
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
    transform: "scale(1.02)",
  },
}));

const FacturePage: React.FC = () => {
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const {
    factures,
    currentFacture,
    loading: isLoading,
    error: isError,
  } = useAppSelector((state) => state.facture);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [_selectedFactureId, setSelectedFactureId] = useState<number | null>(
    null
  );
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [paymentFilter, setPaymentFilter] = useState<
    "all" | "paid" | "pending"
  >("all");
  const [createFactureModalOpen, setCreateFactureModalOpen] = useState(false);
  const [bdcId, setBdcId] = useState("");
  const [bdcReference, setBdcReference] = useState("");

  useEffect(() => {
    dispatch(fetchAllFactures());
  }, [dispatch]);

  useEffect(() => {
    return () => {
      dispatch(resetError());
    };
  }, [dispatch]);

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
  const getClientName = (facture: any) => {
    if (!facture?.bdc?.reservation?.client) return "N/A";

    const client = facture.bdc.reservation.client;
    return (
      `${client.nom || client.firstName || ""} ${
        client.prenom || client.lastName || ""
      }`.trim() || "N/A"
    );
  };

  // Fonction pour obtenir les détails du véhicule de manière sécurisée
  const getVehicleDetails = (facture: any) => {
    if (!facture?.bdc?.reservation?.vehicule) return "N/A";

    const vehicle = facture.bdc.reservation.vehicule;
    if (vehicle.marque && vehicle.immatriculation)
      return `${vehicle.marque} ${vehicle.immatriculation}`;
    if (vehicle.marque && vehicle.modele)
      return `${vehicle.marque} ${vehicle.modele}`;
    if (vehicle.marque) return vehicle.marque;
    if (vehicle.immatriculation) return vehicle.immatriculation;

    return "N/A";
  };

  // Fonction pour obtenir les détails de la location
  const getLocationDetails = (facture: any) => {
    if (!facture?.bdc?.reservation?.region) return "N/A";
    const region = facture.bdc.reservation.region;
    return `${region.nom_region || "N/A"} (${region.nom_district || "N/A"})`;
  };

  // Fonction pour déterminer le statut de paiement d'une facture
  const getPaymentStatus = (facture) => {
    const totalPaye = facture.totalPaiements || 0;
    const montantTotal = facture.montant || 0;
    return totalPaye >= montantTotal ? "paid" : "pending";
  };

  // Filtrer les factures en fonction du terme de recherche et du filtre de statut
  const filteredFactures = useMemo(() => {
    return factures.filter((facture) => {
      const searchLower = searchTerm.toLowerCase();
      const numero = facture.numero || "";
      const clientName = getClientName(facture).toLowerCase();
      const bdcRef = facture.bdc?.reference || "";

      const matchesSearch =
        numero.toLowerCase().includes(searchLower) ||
        clientName.includes(searchLower) ||
        bdcRef.toLowerCase().includes(searchLower);

      if (paymentFilter === "all") return matchesSearch;

      const status = getPaymentStatus(facture);
      return status === paymentFilter && matchesSearch;
    });
  }, [factures, searchTerm, paymentFilter]);

  const handleViewDetails = (factureId: number) => {
    dispatch(fetchFactureById(factureId)).then(() => {
      setSelectedFactureId(factureId);
      setDetailsModalOpen(true);
    });
  };

  const handleCloseDetails = () => {
    setDetailsModalOpen(false);
    setSelectedFactureId(null);
  };

  // Update the handleCreateFacture function
  const handleCreateFacture = () => {
    if (bdcId) {
      dispatch(generateFactureFinale(parseInt(bdcId))).then(() => {
        setCreateFactureModalOpen(false);
        setBdcId("");
      });
    } else if (bdcReference) {
      dispatch(generateFactureFinaleByReference(bdcReference)).then(() => {
        setCreateFactureModalOpen(false);
        setBdcReference("");
      });
    }
  };

  const handlePrint = () => {
    const printWindow = window.open("", "_blank");
    if (printWindow && currentFacture) {
      const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
          <title>Facture - ${currentFacture.numero}</title>
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
              .payment-table { width: 100%; border-collapse: collapse; margin-top: 20px; }
              .payment-table th, .payment-table td { border: 1px solid #000; padding: 8px; text-align: left; }
              .payment-table th { background-color: #f2f2f2; }
              .total-box { margin-top: 20px; padding: 15px; border: 1px solid #000; background-color: #f9f9f9; }
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
                      <p>${getClientName(currentFacture)}</p>
                  </div>
              </div>

              <div style="text-align: center; margin-bottom: 20px;">
                  <div class="invoice-title">FACTURE N° ${
                    currentFacture.numero
                  }</div>
                  <div class="invoice-number">Date: ${formatDate(
                    currentFacture.date_facture
                  )}</div>
              </div>

              <table class="invoice-table">
                  <thead>
                      <tr>
                          <th>Réf.</th>
                          <th>Voiture</th>
                          <th>Destination</th>
                          <th>Période</th>
                          <th>Jours</th>
                          <th>Prix total</th>
                      </tr>
                  </thead>
                  <tbody>
                      <tr>
                          <td>${currentFacture.bdc?.reference || "N/A"}</td>
                          <td>${getVehicleDetails(currentFacture)}</td>
                          <td>${getLocationDetails(currentFacture)}</td>
                          <td>Du ${formatDate(
                            currentFacture.bdc?.reservation?.pickup_date
                          )} au ${formatDate(
        currentFacture.bdc?.reservation?.return_date
      )}</td>
                          <td>${
                            currentFacture.bdc?.reservation?.nombreJours ||
                            "N/A"
                          }</td>
                          <td>${formatCurrencyAr(currentFacture.montant)}</td>
                      </tr>
                      <tr>
                          <td colspan="5" style="text-align: right; font-weight: bold;">TOTAL</td>
                          <td style="text-weight: bold;">-</td>
                          <td style="font-weight: bold;">${formatCurrencyAr(
                            currentFacture.montant
                          )}</td>
                      </tr>
                  </tbody>
              </table>

              <div class="total-box">
                  <h3 style="margin: 0 0 10px 0; text-align: center;">DÉTAILS DE PAIEMENT</h3>
                  <table class="payment-table">
                      <thead>
                          <tr>
                              <th>Date</th>
                              <th>Montant</th>
                              <th>Méthode</th>
                              <th>Référence</th>
                          </tr>
                      </thead>
                      <tbody>
                          ${currentFacture.paiements
                            .map(
                              (paiement: any) => `
                              <tr>
                                  <td>${formatDate(paiement.date_paiement)}</td>
                                  <td>${formatCurrencyAr(paiement.montant)}</td>
                                  <td>${paiement.methode}</td>
                                  <td>${
                                    paiement.reference_transaction || "N/A"
                                  }</td>
                              </tr>
                          `
                            )
                            .join("")}
                          <tr>
                              <td colspan="3" style="text-align: right; font-weight: bold;">Total payé:</td>
                              <td style="font-weight: bold;">${formatCurrencyAr(
                                currentFacture.totalPaiements
                              )}</td>
                          </tr>
                          <tr>
                              <td colspan="3" style="text-align: right; font-weight: bold;">Reste à payer:</td>
                              <td style="font-weight: bold;">${formatCurrencyAr(
                                currentFacture.resteAPayer
                              )}</td>
                          </tr>
                      </tbody>
                  </table>
              </div>

              <div class="footer-section">
                  <p>Statut: ${
                    getPaymentStatus(currentFacture) === "paid"
                      ? "Payée"
                      : "En attente"
                  }</p>
                  <p>Antananarivo, le ${new Date().toLocaleDateString("fr-FR", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })}</p>
                  <p>Pour Mirent,</p>
                  <img src="${signatureImage}" alt="Signature" style="width: 150px; margin-top: 10px;"/>
                  <div class="signature-box">Signature et cachet de l'entreprise</div>
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

  // Pagination des factures
  const paginatedFactures = filteredFactures.slice(
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
          Chargement des factures...
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
            Gestion des Factures
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
            Suivez et gérez toutes les factures de votre entreprise
          </Typography>
        </Box>
        <Button
          variant="contained"
          onClick={() => setCreateFactureModalOpen(true)}
          sx={{
            fontWeight: 600,
            borderRadius: "8px",
            textTransform: "none",
            fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
          }}
        >
          Créer une facture
        </Button>
      </Box>

      {/* Champ de recherche */}
      <Box sx={{ mb: 2 }}>
        <TextField
          fullWidth
          placeholder="Rechercher par numéro de facture, référence BDC ou nom client..."
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
          color={paymentFilter === "all" ? "primary" : "default"}
          onClick={() => setPaymentFilter("all")}
          sx={{
            cursor: "pointer",
            fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
          }}
        />
        <Chip
          label="Payées"
          color={paymentFilter === "paid" ? "primary" : "default"}
          onClick={() => setPaymentFilter("paid")}
          sx={{
            cursor: "pointer",
            fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
          }}
        />
        <Chip
          label="En attente"
          color={paymentFilter === "pending" ? "primary" : "default"}
          onClick={() => setPaymentFilter("pending")}
          sx={{
            cursor: "pointer",
            fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
          }}
        />
      </Box>

      {/* Erreur si présente */}
      {isError && (
        <Alert
          severity="error"
          sx={{
            mb: 2,
            borderRadius: 2,
            fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
          }}
        >
          {isError}
        </Alert>
      )}

      {/* Tableau des factures */}
      <Box>
        {filteredFactures.length === 0 ? (
          <Alert
            severity="info"
            sx={{
              borderRadius: 2,
              fontFamily:
                '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
            }}
          >
            Aucune facture trouvée
          </Alert>
        ) : (
          <DashboardCard>
            <TableContainer component={Paper} elevation={0}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell
                      sx={{
                        bgcolor: "grey.50",
                        fontWeight: 700,
                        fontFamily:
                          '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
                      }}
                    >
                      Numéro
                    </TableCell>
                    <TableCell
                      sx={{
                        bgcolor: "grey.50",
                        fontWeight: 700,
                        fontFamily:
                          '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
                      }}
                    >
                      Date
                    </TableCell>
                    <TableCell
                      sx={{
                        bgcolor: "grey.50",
                        fontWeight: 700,
                        fontFamily:
                          '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
                      }}
                    >
                      Client
                    </TableCell>
                    <TableCell
                      sx={{
                        bgcolor: "grey.50",
                        fontWeight: 700,
                        fontFamily:
                          '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
                      }}
                    >
                      Véhicule
                    </TableCell>
                    <TableCell
                      sx={{
                        bgcolor: "grey.50",
                        fontWeight: 700,
                        fontFamily:
                          '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
                      }}
                    >
                      Montant
                    </TableCell>
                    <TableCell
                      sx={{
                        bgcolor: "grey.50",
                        fontWeight: 700,
                        fontFamily:
                          '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
                      }}
                    >
                      Payé
                    </TableCell>
                    <TableCell
                      sx={{
                        bgcolor: "grey.50",
                        fontWeight: 700,
                        fontFamily:
                          '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
                      }}
                    >
                      Reste
                    </TableCell>
                    <TableCell
                      sx={{
                        bgcolor: "grey.50",
                        fontWeight: 700,
                        fontFamily:
                          '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
                      }}
                    >
                      Statut
                    </TableCell>
                    <TableCell
                      sx={{
                        bgcolor: "grey.50",
                        fontWeight: 700,
                        fontFamily:
                          '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
                      }}
                    >
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedFactures.map((facture) => (
                    <TableRow key={facture.id} hover>
                      <TableCell
                        sx={{
                          fontFamily:
                            '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
                        }}
                      >
                        {facture.numero}
                      </TableCell>
                      <TableCell
                        sx={{
                          fontFamily:
                            '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
                        }}
                      >
                        {formatDate(facture.date_facture)}
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <PersonIcon
                            sx={{
                              fontSize: 16,
                              mr: 0.5,
                              color: "primary.main",
                            }}
                          />
                          <span
                            style={{
                              fontFamily:
                                '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
                            }}
                          >
                            {getClientName(facture)}
                          </span>
                        </Box>
                      </TableCell>
                      <TableCell
                        sx={{
                          fontFamily:
                            '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
                        }}
                      >
                        {getVehicleDetails(facture)}
                      </TableCell>
                      <TableCell
                        sx={{
                          fontFamily:
                            '"Poppins", "Roboto", "Helvetica", "Arial", "sans-serif',
                        }}
                      >
                        {formatCurrencyAr(facture.montant)}
                      </TableCell>
                      <TableCell
                        sx={{
                          fontFamily:
                            '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
                        }}
                      >
                        {formatCurrencyAr(facture.totalPaiements)}
                      </TableCell>
                      <TableCell
                        sx={{
                          fontFamily:
                            '"Poppins", "Roboto", "Helvetica", "Arial", "sans-serif',
                        }}
                      >
                        {formatCurrencyAr(facture.resteAPayer)}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={
                            getPaymentStatus(facture) === "paid"
                              ? "Payée"
                              : "En attente"
                          }
                          color={
                            getPaymentStatus(facture) === "paid"
                              ? "success"
                              : "warning"
                          }
                          size="small"
                          sx={{
                            fontFamily:
                              '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Tooltip title="Voir détails">
                          <IconButton
                            size="small"
                            onClick={() => handleViewDetails(facture.id)}
                            sx={{ color: "primary.main" }}
                          >
                            <HistoryIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Imprimer">
                          <IconButton
                            size="small"
                            onClick={() => {
                              dispatch(fetchFactureById(facture.id)).then(() =>
                                handlePrint()
                              );
                            }}
                            sx={{ color: "primary.main" }}
                          >
                            <PrintIcon />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={filteredFactures.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={(_event, newPage) => setPage(newPage)}
              onRowsPerPageChange={(event) => {
                setRowsPerPage(parseInt(event.target.value, 10));
                setPage(0);
              }}
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

      {/* Modal pour créer une facture */}
      <Dialog
        open={createFactureModalOpen}
        onClose={() => setCreateFactureModalOpen(false)}
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
            backgroundColor: "primary.main",
            color: "white",
            fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
          }}
        >
          Créer une nouvelle facture
        </DialogTitle>
        <DialogContent sx={{ py: 3 }}>
          <TextField
            fullWidth
            label="ID du Bon de Commande (ou laissez vide)"
            value={bdcId}
            onChange={(e) => {
              setBdcId(e.target.value);
              setBdcReference("");
            }}
            sx={{ mt: 2 }}
            type="number"
          />
          <Typography variant="body2" sx={{ my: 2, textAlign: "center" }}>
            ou
          </Typography>
          <TextField
            fullWidth
            label="Référence du Bon de Commande (ou laissez vide)"
            value={bdcReference}
            onChange={(e) => {
              setBdcReference(e.target.value);
              setBdcId(""); // Clear ID when reference is entered
            }}
            sx={{ mt: 2 }}
            type="text"
          />
        </DialogContent>
        <DialogActions
          sx={{
            px: 3,
            py: 2,
            borderTop: `1px solid ${theme.palette.divider}`,
          }}
        >
          <Button
            onClick={() => setCreateFactureModalOpen(false)}
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
            variant="contained"
            onClick={handleCreateFacture}
            sx={{
              fontWeight: 600,
              borderRadius: "8px",
              textTransform: "none",
              fontFamily:
                '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
            }}
          >
            Créer
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal pour les détails de la facture */}
      <Dialog
        open={detailsModalOpen}
        onClose={handleCloseDetails}
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
          <Box>Détails de la Facture - {currentFacture?.numero}</Box>
          <Box>
            <IconButton
              onClick={handlePrint}
              size="small"
              sx={{ color: "white", mr: 1 }}
            >
              <PrintIcon />
            </IconButton>
            <IconButton
              onClick={handleCloseDetails}
              size="small"
              sx={{ color: "white" }}
            >
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>

        <DialogContent sx={{ py: 3 }}>
          {currentFacture && (
            <Box>
              {/* Informations sur la facture */}
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
                    Informations de la Facture
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
                          Numéro
                        </Typography>
                        <Typography
                          variant="body1"
                          fontWeight={500}
                          sx={{
                            fontFamily:
                              '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
                          }}
                        >
                          {currentFacture.numero}
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
                          Date
                        </Typography>
                        <Typography
                          variant="body1"
                          fontWeight={500}
                          sx={{
                            fontFamily:
                              '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
                          }}
                        >
                          {formatDate(currentFacture.date_facture)}
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
                          {currentFacture.bdc.reference}
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
                          {getClientName(currentFacture)}
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
                          {getVehicleDetails(currentFacture)}
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
                          Période de location
                        </Typography>
                        <Typography
                          variant="body1"
                          fontWeight={500}
                          sx={{
                            fontFamily:
                              '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
                          }}
                        >
                          Du{" "}
                          {formatDate(
                            currentFacture.bdc?.reservation?.pickup_date
                          )}{" "}
                          au{" "}
                          {formatDate(
                            currentFacture.bdc?.reservation?.return_date
                          )}
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
                          Nombre de jours
                        </Typography>
                        <Typography
                          variant="body1"
                          fontWeight={500}
                          sx={{
                            fontFamily:
                              '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
                          }}
                        >
                          {currentFacture.bdc?.reservation?.nombreJours ||
                            "N/A"}
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
                          Lieu de location
                        </Typography>
                        <Typography
                          variant="body1"
                          fontWeight={500}
                          sx={{
                            fontFamily:
                              '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
                          }}
                        >
                          {getLocationDetails(currentFacture)}
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
                    {currentFacture.paiements.map((paiement: any) => (
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
                            <PaymentIcon
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
                              {formatCurrencyAr(paiement.montant)}
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
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              {/* Résumé de la facture */}
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
                    Résumé de la Facture
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
                          {formatCurrencyAr(currentFacture.montant)}
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
                          {formatCurrencyAr(currentFacture.totalPaiements)}
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
                          {formatCurrencyAr(currentFacture.resteAPayer)}
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
            onClick={handleCloseDetails}
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
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default FacturePage;
