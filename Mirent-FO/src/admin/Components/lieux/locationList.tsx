import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  IconButton,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useMediaQuery,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Tooltip,
  CircularProgress,
  Alert,
  Snackbar,
  Autocomplete,
  TablePagination,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import {
  styled,
  createTheme,
  ThemeProvider,
  useTheme,
} from "@mui/material/styles";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import {
  addRegion,
  deleteRegion,
  fetchRegions,
  updateRegion,
  Region,
} from "../../../redux/features/lieux/locationSlice";
import { useAppDispatch } from "../../../hooks";

// === Theme personnalisé ===
const theme = createTheme({
  palette: {
    primary: { main: "#3b82f6" },
    secondary: { main: "#ef4444" },
    background: { default: "#f8fafc" },
    text: { primary: "#1e293b", secondary: "#64748b" },
    grey: { 100: "#f1f5f9", 200: "#e2e8f0" },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: { fontWeight: 600, color: "#1e293b" },
    body1: { fontSize: "0.9rem", color: "#1e293b" },
    body2: { fontSize: "0.8125rem", color: "#64748b" },
    button: { textTransform: "none", fontWeight: 500 },
  },
  components: {
    MuiButton: { styleOverrides: { root: { borderRadius: "8px" } } },
    MuiTextField: {
      styleOverrides: {
        root: { backgroundColor: "#fff", borderRadius: "8px" },
      },
    },
    MuiPaper: { styleOverrides: { root: { borderRadius: "12px" } } },
  },
});

const DashboardCard = styled("div")(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: "16px",
  backgroundColor: "#fff",
  boxShadow: "0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06)",
  transition: "all 0.2s ease-in-out",
  "&:hover": { boxShadow: "0 4px 12px rgba(0,0,0,0.1)" },
}));

const LocationList: React.FC = () => {
  const dispatch = useAppDispatch();
  const {
    regions,
    loading,
    error: sliceError,
  } = useSelector((state: RootState) => state.region);
  const muiTheme = useTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down("sm"));

  // === États locaux ===
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState<Region | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [regionToDelete, setRegionToDelete] = useState<{
    id: number;
    name: string;
  } | null>(null);

  const [regionName, setRegionName] = useState("");
  const [districtName, setDistrictName] = useState("");
  const [price, setPrice] = useState("");

  // === États pour la pagination ===
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // === Notifications ===
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error" | "info" | "warning";
  }>({
    open: false,
    message: "",
    severity: "success",
  });

  // Fermeture du snackbar
  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  // Fonction pour formater les prix en Ariary
  const formatCurrencyAr = (amount: number) => {
    return (
      new Intl.NumberFormat("fr-FR", {
        maximumFractionDigits: 0,
      }).format(amount) + " Ar"
    );
  };

  // Extraire les districts uniques
  const districts = Array.from(
    new Set(regions.map((r) => r.nom_district).filter(Boolean))
  ) as string[];

  useEffect(() => {
    dispatch(fetchRegions());
  }, [dispatch]);

  // Filtrer les régions
  const filteredRegions = regions.filter((r) => {
    const matchesSearch = r.nom_region
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesDistrict =
      !selectedDistrict || r.nom_district === selectedDistrict;
    return matchesSearch && matchesDistrict;
  });

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

  // Calculer les régions à afficher pour la page courante
  const paginatedRegions = filteredRegions.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  // Ouvrir le dialog
  const handleOpenDialog = (region?: Region) => {
    if (region) {
      setSelectedRegion(region);
      setRegionName(region.nom_region);
      setDistrictName(region.nom_district || "");
      setPrice(region.prix?.prix.toString() || "");
    } else {
      setSelectedRegion(null);
      setRegionName("");
      setDistrictName("");
      setPrice("");
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedRegion(null);
    setRegionName("");
    setDistrictName("");
    setPrice("");
  };

  // Sauvegarder une région
  const handleSaveRegion = () => {
    const regionData = {
      nom_region: regionName.trim(),
      nom_district: districtName.trim() || undefined,
      prix: price ? { prix: parseFloat(price) } : undefined,
    };

    if (!regionData.nom_region) return;

    const action = selectedRegion?.id
      ? dispatch(updateRegion({ id: selectedRegion.id, data: regionData }))
      : dispatch(addRegion(regionData));

    action
      .unwrap()
      .then(() => {
        setSnackbar({
          open: true,
          message: selectedRegion?.id
            ? "Région mise à jour avec succès."
            : "Région ajoutée avec succès.",
          severity: "success",
        });
        dispatch(fetchRegions());
      })
      .catch((err) => {
        setSnackbar({
          open: true,
          message: `Échec: ${err.message || "Erreur inconnue"}`,
          severity: "error",
        });
      });

    handleCloseDialog();
  };

  // Ouvrir la confirmation de suppression
  const handleOpenDeleteConfirm = (id: number, name: string) => {
    setRegionToDelete({ id, name });
    setDeleteConfirmOpen(true);
  };

  // Fermer la confirmation de suppression
  const handleCloseDeleteConfirm = () => {
    setDeleteConfirmOpen(false);
    setRegionToDelete(null);
  };

  // Supprimer une région après confirmation
  const handleConfirmDelete = () => {
    if (!regionToDelete) return;

    dispatch(deleteRegion(regionToDelete.id))
      .unwrap()
      .then(() => {
        setSnackbar({
          open: true,
          message: `Région "${regionToDelete.name}" supprimée avec succès.`,
          severity: "success",
        });
        dispatch(fetchRegions());
      })
      .catch(() => {
        setSnackbar({
          open: true,
          message: "Échec de la suppression de la région.",
          severity: "error",
        });
      });

    handleCloseDeleteConfirm();
  };

  // Export CSV
  const handleExportCSV = () => {
    const header = ["Nom de la Région", "District", "Prix (Ar)"];
    const rows = filteredRegions.map((r) => [
      r.nom_region,
      r.nom_district || "-",
      r.prix ? formatCurrencyAr(r.prix.prix) : "-",
    ]);
    const csvContent = [header, ...rows].map((e) => e.join(",")).join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const dateStr = new Date().toISOString().split("T")[0];
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `regions_${dateStr}.csv`);
    link.click();

    setSnackbar({
      open: true,
      message: "Export CSV effectué.",
      severity: "info",
    });
  };

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          px: { xs: 2, sm: 3, md: 4 },
          py: { xs: 2, sm: 3 },
          backgroundColor: "#f8fafc",
          minHeight: "100vh",
        }}
      >
        {/* === Header === */}
        <Grid container spacing={3} alignItems="center" mb={3}>
          <Grid item xs={12} md={6}>
            <Typography variant="h4" fontWeight={600}>
              Gestion des Régions
            </Typography>
            <Typography variant="body1" color="text.secondary" mt={1}>
              Ajoutez, modifiez ou supprimez des régions et leurs tarifs.
            </Typography>
          </Grid>

          <Grid
            item
            xs={12}
            md={6}
            display="flex"
            flexDirection={isMobile ? "column" : "row"}
            justifyContent="flex-end"
            gap={2}
            alignItems={isMobile ? "stretch" : "center"}
          >
            <TextField
              size="small"
              placeholder="Rechercher par région..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              fullWidth={isMobile}
              sx={{ minWidth: { xs: "100%", sm: 180 } }}
            />

            <Autocomplete
              options={districts}
              value={selectedDistrict}
              onChange={(_, value) => setSelectedDistrict(value)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  size="small"
                  label="Filtrer par district"
                  placeholder="Tous"
                />
              )}
              clearOnEscape
              disableClearable={false}
              fullWidth={isMobile}
              sx={{ minWidth: { xs: "100%", sm: 200 } }}
            />

            <Box
              display="flex"
              gap={1}
              flexWrap="nowrap"
              width={isMobile ? "100%" : "auto"}
            >
              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={handleExportCSV}
                sx={{ flexGrow: isMobile ? 1 : 0 }}
              >
                Exporter
              </Button>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => handleOpenDialog()}
                sx={{ flexGrow: isMobile ? 1 : 0 }}
              >
                Ajouter
              </Button>
            </Box>
          </Grid>
        </Grid>

        {/* === Erreur globale === */}
        {sliceError && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {sliceError}
          </Alert>
        )}

        {/* === Tableau === */}
        <DashboardCard>
          {loading ? (
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              py={6}
            >
              <CircularProgress color="primary" />
              <Typography variant="body2" color="text.secondary" ml={2}>
                Chargement...
              </Typography>
            </Box>
          ) : (
            <>
              <TableContainer component={Paper} elevation={0}>
                <Table size="medium">
                  <TableHead>
                    <TableRow sx={{ backgroundColor: "#f1f5f9" }}>
                      <TableCell>
                        <Typography
                          variant="body1"
                          fontWeight={600}
                          color="text.primary"
                        >
                          Région
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography
                          variant="body1"
                          fontWeight={600}
                          color="text.primary"
                        >
                          District
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography
                          variant="body1"
                          fontWeight={600}
                          color="text.primary"
                        >
                          Prix (Ar)
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography
                          variant="body1"
                          fontWeight={600}
                          color="text.primary"
                        >
                          Actions
                        </Typography>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {paginatedRegions.length > 0 ? (
                      paginatedRegions.map((region) => (
                        <TableRow key={region.id} hover>
                          <TableCell>
                            <Typography variant="body1" fontWeight={500}>
                              {region.nom_region}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" color="text.secondary">
                              {region.nom_district || "-"}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body1" fontWeight={500}>
                              {region.prix && typeof region.prix.prix === 'number' && !isNaN(region.prix.prix)
                                ? formatCurrencyAr(region.prix.prix)
                                : "-"}
                            </Typography>
                          </TableCell>
                          <TableCell align="right">
                            <Tooltip title="Modifier">
                              <IconButton
                                size="small"
                                color="primary"
                                onClick={() => handleOpenDialog(region)}
                                sx={{ mr: 0.5 }}
                              >
                                <EditIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Supprimer">
                              <IconButton
                                size="small"
                                color="error"
                                onClick={() =>
                                  handleOpenDeleteConfirm(
                                    region.id,
                                    region.nom_region
                                  )
                                }
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={4} align="center">
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            py={3}
                          >
                            Aucune région correspondante.
                          </Typography>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>

              {/* === Pagination === */}
              {filteredRegions.length > 0 && (
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
                    {`${filteredRegions.length} région(s) au total`}
                  </Typography>

                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <TablePagination
                      rowsPerPageOptions={[5, 10, 25, 50]}
                      component="div"
                      count={filteredRegions.length}
                      rowsPerPage={rowsPerPage}
                      page={page}
                      onPageChange={handleChangePage}
                      onRowsPerPageChange={handleChangeRowsPerPage}
                      labelRowsPerPage="Lignes par page"
                      labelDisplayedRows={({ from, to, count }) =>
                        `${from}-${to} sur ${count}`
                      }
                      sx={{
                        "& .MuiTablePagination-toolbar": {
                          flexWrap: "wrap",
                          justifyContent: "flex-end",
                          gap: 2,
                        },
                      }}
                    />
                  </Box>
                </Box>
              )}
            </>
          )}
        </DashboardCard>

        {/* === Dialog d'ajout/modification === */}
        <Dialog
          open={openDialog}
          onClose={handleCloseDialog}
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle sx={{ fontWeight: 600, fontSize: "1.25rem" }}>
            {selectedRegion?.id ? "Modifier Région" : "Ajouter Région"}
          </DialogTitle>
          <DialogContent>
            <Typography variant="body2" color="text.secondary" mb={2}>
              Remplissez les informations ci-dessous.
            </Typography>

            <TextField
              autoFocus
              fullWidth
              label="Nom de la Région *"
              value={regionName}
              onChange={(e) => setRegionName(e.target.value)}
              margin="normal"
              required
              variant="outlined"
            />
            <TextField
              fullWidth
              label="Nom du District (optionnel)"
              value={districtName}
              onChange={(e) => setDistrictName(e.target.value)}
              margin="normal"
              variant="outlined"
            />
            <TextField
              fullWidth
              label="Prix en Ariary (optionnel)"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              margin="normal"
              type="number"
              InputProps={{ inputProps: { min: 0 } }}
              variant="outlined"
            />
          </DialogContent>
          <DialogActions sx={{ p: 3, pt: 1 }}>
            <Button onClick={handleCloseDialog} color="inherit">
              Annuler
            </Button>
            <Button
              onClick={handleSaveRegion}
              variant="contained"
              disabled={!regionName.trim()}
            >
              Enregistrer
            </Button>
          </DialogActions>
        </Dialog>

        {/* === Dialog de confirmation de suppression === */}
        <Dialog open={deleteConfirmOpen} onClose={handleCloseDeleteConfirm}>
          <DialogTitle sx={{ fontWeight: 600 }}>
            Confirmer la suppression
          </DialogTitle>
          <DialogContent>
            <Typography>
              Êtes-vous sûr de vouloir supprimer la région "
              {regionToDelete?.name}" ? Cette action est irréversible.
            </Typography>
          </DialogContent>
          <DialogActions sx={{ p: 3, pt: 1 }}>
            <Button onClick={handleCloseDeleteConfirm} color="inherit">
              Annuler
            </Button>
            <Button
              onClick={handleConfirmDelete}
              variant="contained"
              color="error"
            >
              Supprimer
            </Button>
          </DialogActions>
        </Dialog>

        {/* === Snackbar (notifications) === */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={5000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity={snackbar.severity}
            variant="filled"
            sx={{ width: "100%" }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </ThemeProvider>
  );
};

export default LocationList;
