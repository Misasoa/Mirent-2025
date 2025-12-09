import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useAppDispatch } from "../../../hooks";
import { RootState } from "../../../redux/store";
import {
  clearError,
  clearSelectedBonDeCommande,
  deleteBonDeCommande,
  fetchAllBonsDeCommande,
  fetchBonDeCommandeById,
} from "../../../redux/features/commande/bonDeCommandeSlice";

import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Alert,
  CircularProgress,
  Card,
  CardContent,
  Tooltip,
  useTheme,
  useMediaQuery,
  TablePagination,
  Grid,
  TextField,
  InputAdornment,
} from "@mui/material";
import {
  Visibility as VisibilityIcon,
  Delete as DeleteIcon,
  Close as CloseIcon,
  Assignment as AssignmentIcon,
  Print as PrintIcon,
  Search as SearchIcon,
} from "@mui/icons-material";
import logoImage from "../../../assets/horizontal.png";
import signatureImage from "../../../assets/signature.png";

const BonDeCommandeManager: React.FC = () => {
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // Sélecteurs pour accéder à l'état Redux
  const bonsDeCommande = useSelector(
    (state: RootState) => state.bonDeCommande.bonsDeCommande
  );
  const selectedBonDeCommande = useSelector(
    (state: RootState) => state.bonDeCommande.selectedBonDeCommande
  );
  const loading = useSelector(
    (state: RootState) => state.bonDeCommande.loading
  );
  const error = useSelector((state: RootState) => state.bonDeCommande.error);

  // États pour la pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");

  // Charger la liste des bons de commande au montage du composant
  useEffect(() => {
    dispatch(fetchAllBonsDeCommande());
  }, [dispatch]);

  // Fonction pour formater les montants en Ariary
  const formatCurrencyAr = (amount: number) => {
    return (
      new Intl.NumberFormat("fr-FR", {
        maximumFractionDigits: 0,
      }).format(amount) + " Ar"
    );
  };

  // Filtrer les bons de commande en fonction du terme de recherche
  const filteredBonsDeCommande = bonsDeCommande.filter((bdc) => {
    const searchLower = searchTerm.toLowerCase();
    const bdcRef = bdc.reference || "";
    const clientName = ` ${
      bdc.reservation?.client?.lastName || ""
    }`.toLowerCase();
    const vehicleInfo = `${bdc.reservation?.vehicule?.nom || ""} ${
      bdc.reservation?.vehicule?.immatriculation || ""
    }`.toLowerCase();

    return (
      bdcRef.toLowerCase().includes(searchLower) ||
      clientName.includes(searchLower) ||
      vehicleInfo.includes(searchLower)
    );
  });

  // Gérer la sélection pour afficher les détails dans un modal
  const handleSelectBonDeCommande = (id: number) => {
    dispatch(fetchBonDeCommandeById(id));
  };

  // Gérer la suppression d'un bon de commande
  const handleDeleteBonDeCommande = (id: number) => {
    if (
      window.confirm("Êtes-vous sûr de vouloir supprimer ce bon de commande ?")
    ) {
      dispatch(deleteBonDeCommande(id));
    }
  };

  // Gestion des changements de page
  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  // Gestion du nombre de lignes par page
  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Fonction pour gérer l'impression
  const handlePrint = () => {
    const printWindow = window.open("", "_blank");
    if (printWindow && selectedBonDeCommande) {
      const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
          <title>Bon de Commande - ${selectedBonDeCommande.reference}</title>
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
                      <p>${
                        selectedBonDeCommande.reservation?.client?.lastName ||
                        "N/A"
                      }</p>
                  </div>
              </div>

              <div style="text-align: center; margin-bottom: 20px;">
                  <div class="invoice-title">BON DE COMMANDE N° ${
                    selectedBonDeCommande.reference
                  }</div>
                  <div class="invoice-title">SUIVI DU DEVIS N° ${
                    selectedBonDeCommande.reservation?.reference || "N/A"
                  }</div>
                  <div class="invoice-number">Date: ${new Date(
                    selectedBonDeCommande.created_at
                  ).toLocaleDateString()}</div>
              </div>

              <table class="invoice-table">
                  <thead>
                      <tr>
                          <th>Réf.</th>
                          <th>Voiture</th>
                          <th>Immatriculation</th>
                          <th>Destination</th>
                          <th>Période</th>
                          <th>Jours</th>
                          <th>Prix unitaire</th>
                          <th>Prix total</th>
                      </tr>
                  </thead>
                  <tbody>
                      <tr>
                          <td>${selectedBonDeCommande.reference}</td>
                          <td>${
                            selectedBonDeCommande.reservation?.vehicule?.nom ||
                            "N/A"
                          }</td>
                          <td>${
                            selectedBonDeCommande.reservation?.vehicule
                              ?.immatriculation || "N/A"
                          }</td>
                          <td>${
                            selectedBonDeCommande.reservation?.location
                              ?.nom_region || "N/A"
                          } (${
        selectedBonDeCommande.reservation?.location?.nom_district || "N/A"
      })</td>
                          <td>Du ${new Date(
                            selectedBonDeCommande.reservation.pickup_date
                          ).toLocaleDateString()} au ${new Date(
        selectedBonDeCommande.reservation.return_date
      ).toLocaleDateString()}</td>
                          <td>${
                            selectedBonDeCommande.reservation?.nombreJours ||
                            "N/A"
                          }</td>
                          <td>${
                            selectedBonDeCommande.reservation?.location?.prix?.prix
                              ? formatCurrencyAr(
                                  selectedBonDeCommande.reservation.location.prix.prix
                                ) + "/jour"
                              : "N/A"
                          }</td>
                          <td>${
                            selectedBonDeCommande.reservation?.total_price
                              ? formatCurrencyAr(
                                  selectedBonDeCommande.reservation.total_price
                                )
                              : "N/A"
                          }</td>
                      </tr>
                      <tr>
                          <td colspan="6" style="text-align: right; font-weight: bold;">TOTAL</td>
                          <td style="text-align: right; font-weight: bold;">-</td>
                          <td style="font-weight: bold;">${
                            selectedBonDeCommande.reservation?.total_price
                              ? formatCurrencyAr(
                                  selectedBonDeCommande.reservation.total_price
                                )
                              : "N/A"
                          }</td>
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

  const getClientLastName = (bonDeCommande: any) => {
    return bonDeCommande?.reservation?.client?.lastName || "N/A";
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "CONFIRMEE":
        return "success";
      case "DEVIS":
        return "warning";
      case "TERMINEE":
        return "info";
      case "ANNULEE":
        return "error";
      default:
        return "default";
    }
  };

  // Calcul des bons de commande à afficher en fonction de la pagination
  const paginatedBonsDeCommande = filteredBonsDeCommande.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  if (loading) {
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
    <Box sx={{ p: 3, backgroundColor: "#f9fafb", minHeight: "100vh" }}>
      <Typography
        variant="h4"
        sx={{ fontWeight: 600, color: "#1f2937", mb: 3 }}
      >
        Gestion des Bons de Commande
      </Typography>

      {/* Affichage des messages d'erreur */}
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

      {/* Tableau des bons de commande */}
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
              Liste des Bons de Commande
            </Typography>
          </Box>

          <TableContainer component={Paper} elevation={0}>
            <Table sx={{ minWidth: 650 }} aria-label="table of purchase orders">
              <TableHead sx={{ bgcolor: "grey.50" }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700 }}>Référence</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>
                    Réf Réservation
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Client</TableCell>
                  {!isMobile && (
                    <>
                      <TableCell sx={{ fontWeight: 700 }}>Véhicule</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>
                        Destination
                      </TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Date</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>
                        Prix Unitaire
                      </TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Statut</TableCell>
                    </>
                  )}
                  <TableCell sx={{ fontWeight: 700 }} align="center">
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedBonsDeCommande.length > 0 ? (
                  paginatedBonsDeCommande.map((bdc) => (
                    <TableRow key={bdc.id} hover>
                      <TableCell>
                        <Typography variant="body2" fontWeight={500}>
                          {bdc.reference || "N/A"}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {bdc.reservation?.reference || "N/A"}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {getClientLastName(bdc)}
                        </Typography>
                      </TableCell>
                      {!isMobile && (
                        <>
                          <TableCell>
                            <Typography variant="body2">
                              {bdc.reservation?.vehicule?.marque || "N/A"}{" "}
                              {bdc.reservation?.vehicule?.immatriculation ||
                                "N/A"}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {bdc.reservation?.location?.nom_region || "N/A"}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {new Date(bdc.created_at).toLocaleDateString()}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" fontWeight={500}>
                              {bdc.reservation?.location?.prix?.prix
                                ? `${formatCurrencyAr(
                                    bdc.reservation.location.prix.prix
                                  )}`
                                : "N/A"}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={bdc.reservation?.status || "N/A"}
                              color={
                                getStatusColor(bdc.reservation?.status) as any
                              }
                              size="small"
                            />
                          </TableCell>
                        </>
                      )}
                      <TableCell align="center">
                        <Box sx={{ display: "flex", justifyContent: "center" }}>
                          <Tooltip title="Voir détails" arrow>
                            <IconButton
                              onClick={() => handleSelectBonDeCommande(bdc.id)}
                              color="info"
                              size="small"
                            >
                              <VisibilityIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Supprimer" arrow>
                            <IconButton
                              onClick={() => handleDeleteBonDeCommande(bdc.id)}
                              color="error"
                              size="small"
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={isMobile ? 4 : 9}
                      align="center"
                      sx={{ py: 4 }}
                    >
                      <AssignmentIcon
                        sx={{ fontSize: 60, color: "grey.400", mb: 2 }}
                      />
                      <Typography variant="h6" color="textSecondary">
                        {searchTerm
                          ? "Aucun résultat trouvé"
                          : "Aucun bon de commande trouvé"}
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Pagination */}
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredBonsDeCommande.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelRowsPerPage="Lignes par page"
            labelDisplayedRows={({ from, to, count }) =>
              `${from}-${to} sur ${count}`
            }
            sx={{ borderTop: "1px solid rgba(224, 224, 224, 1)" }}
          />
        </CardContent>
      </Card>

      {/* Modal pour afficher les détails d'un bon de commande */}
      <Dialog
        open={!!selectedBonDeCommande}
        onClose={() => dispatch(clearSelectedBonDeCommande())}
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
            backgroundColor: "primary.main",
            color: "white",
          }}
        >
          <Box>Détails du Bon de Commande</Box>
          <IconButton
            onClick={() => dispatch(clearSelectedBonDeCommande())}
            size="small"
            sx={{ color: "white" }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ py: 3 }}>
          {selectedBonDeCommande && (
            <Box>
              {/* En-tête avec référence et statut */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 3,
                }}
              >
                <Box>
                  <Typography variant="h6" fontWeight={600}>
                    {selectedBonDeCommande.reference || "N/A"}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Référence du bon de commande
                  </Typography>
                </Box>
                <Chip
                  label={selectedBonDeCommande.reservation?.status || "N/A"}
                  color={
                    getStatusColor(
                      selectedBonDeCommande.reservation?.status
                    ) as any
                  }
                  size="medium"
                />
              </Box>

              <Grid container spacing={3}>
                {/* Informations client */}
                <Grid item xs={12} md={6}>
                  <Card variant="outlined" sx={{ borderRadius: 2 }}>
                    <CardContent>
                      <Typography
                        variant="h6"
                        sx={{ borderBottom: "1px solid #ddd", pb: 1, mb: 2 }}
                      >
                        Informations Client
                      </Typography>
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" color="text.secondary">
                          Nom complet
                        </Typography>
                        <Typography variant="body1" fontWeight={500}>
                          {getClientLastName(selectedBonDeCommande)}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Référence réservation
                        </Typography>
                        <Typography variant="body1" fontWeight={500}>
                          {selectedBonDeCommande.reservation?.reference ||
                            "N/A"}
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>

                {/* Informations véhicule */}
                <Grid item xs={12} md={6}>
                  <Card variant="outlined" sx={{ borderRadius: 2 }}>
                    <CardContent>
                      <Typography
                        variant="h6"
                        sx={{ borderBottom: "1px solid #ddd", pb: 1, mb: 2 }}
                      >
                        Informations Véhicule
                      </Typography>
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" color="text.secondary">
                          Marque et Modèle
                        </Typography>
                        <Typography variant="body1" fontWeight={500}>
                          {selectedBonDeCommande.reservation?.vehicule
                            ?.marque || "N/A"}{" "}
                          -{" "}
                          {selectedBonDeCommande.reservation?.vehicule
                            ?.modele || "N/A"}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Immatriculation
                        </Typography>
                        <Typography variant="body1" fontWeight={500}>
                          {selectedBonDeCommande.reservation?.vehicule
                            ?.immatriculation || "N/A"}
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>

                {/* Informations location */}
                <Grid item xs={12} md={6}>
                  <Card variant="outlined" sx={{ borderRadius: 2 }}>
                    <CardContent>
                      <Typography
                        variant="h6"
                        sx={{ borderBottom: "1px solid #ddd", pb: 1, mb: 2 }}
                      >
                        Détails Location
                      </Typography>
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" color="text.secondary">
                          Destination
                        </Typography>
                        <Typography variant="body1" fontWeight={500}>
                          {selectedBonDeCommande.reservation?.location
                            ?.nom_region || "N/A"}
                          (
                          {selectedBonDeCommande.reservation?.location
                            ?.nom_district || "N/A"}
                          )
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Prix unitaire
                        </Typography>
                                                                          <Typography variant="body1" fontWeight={500}>
                                                                            {selectedBonDeCommande.reservation?.location?.prix?.prix
                                                                              ? `${formatCurrencyAr(
                                                                                  selectedBonDeCommande.reservation.location.prix.prix
                                                                                )}/jour`
                                                                              : "N/A"}
                                                                          </Typography>                      </Box>
                    </CardContent>
                  </Card>
                </Grid>

                {/* Informations dates et prix */}
                <Grid item xs={12} md={6}>
                  <Card variant="outlined" sx={{ borderRadius: 2 }}>
                    <CardContent>
                      <Typography
                        variant="h6"
                        sx={{ borderBottom: "1px solid #ddd", pb: 1, mb: 2 }}
                      >
                        Dates et Prix
                      </Typography>
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" color="text.secondary">
                          Période
                        </Typography>
                        <Typography variant="body1" fontWeight={500}>
                          Du{" "}
                          {new Date(
                            selectedBonDeCommande.reservation.pickup_date
                          ).toLocaleDateString()}
                          au{" "}
                          {new Date(
                            selectedBonDeCommande.reservation.return_date
                          ).toLocaleDateString()}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Prix total
                        </Typography>
                        <Typography
                          variant="body1"
                          fontWeight={500}
                          color="primary.main"
                        >
                          {selectedBonDeCommande.reservation?.total_price
                            ? `${formatCurrencyAr(
                                selectedBonDeCommande.reservation.total_price
                              )}`
                            : "N/A"}
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>

              {/* Informations supplémentaires */}
              <Card variant="outlined" sx={{ borderRadius: 2, mt: 3 }}>
                <CardContent>
                  <Typography
                    variant="h6"
                    sx={{ borderBottom: "1px solid #ddd", pb: 1, mb: 2 }}
                  >
                    Informations supplémentaires
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" color="text.secondary">
                        Date de création
                      </Typography>
                      <Typography variant="body1" fontWeight={500}>
                        {new Date(
                          selectedBonDeCommande.created_at
                        ).toLocaleDateString()}
                      </Typography>
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
            onClick={() => dispatch(clearSelectedBonDeCommande())}
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
            variant="contained"
            startIcon={<PrintIcon />}
            onClick={handlePrint}
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
    </Box>
  );
};

export default BonDeCommandeManager;
