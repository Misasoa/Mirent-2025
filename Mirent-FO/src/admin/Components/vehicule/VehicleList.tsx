import React, { useEffect, useState, useMemo } from "react";
import { useSelector } from "react-redux";
import {
  createVehicle,
  deleteVehicle,
  fetchVehicles,
  fetchVehicleStatuses,
  fetchVehicleTypes,
  updateVehicle,
  Vehicle,
  VehicleStatus,
  VehicleType,
} from "../../../redux/features/vehicle/vehiclesSlice";
import { useAppDispatch } from "../../../hooks";
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
  Avatar,
  IconButton,
  CircularProgress,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormHelperText,
  SelectChangeEvent,
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
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  DirectionsCar as CarIcon,
  CheckCircle as CheckIcon,
  Cancel as CancelIcon,
  Search as SearchIcon,
  EventAvailable as ReservedIcon,
} from "@mui/icons-material";
import { createTheme, ThemeProvider, useTheme } from "@mui/material/styles";

// Création du thème cohérent avec CustomerManagement
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
});

interface RootState {
  vehicles: {
    vehicles: Vehicle[];
    vehiclesType: VehicleType[];
    vehiclesStatus: VehicleStatus[];
    vehiclesLoading: boolean;
    vehiclesError: string | null;
    vehiclesTypeLoading: boolean;
    vehiclesTypeError: string | null;
    vehiclesStatusLoading: boolean;
    vehiclesStatusError: string | null;
  };
}

const VehicleList: React.FC = () => {
  const dispatch = useAppDispatch();
  const muiTheme = useTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down("sm"));

  const {
    vehicles,
    vehiclesType,
    vehiclesStatus,
    vehiclesLoading,
    vehiclesError,
    vehiclesTypeLoading,
    vehiclesTypeError,
    vehiclesStatusLoading,
    vehiclesStatusError,
  } = useSelector((state: RootState) => state.vehicles);

  const [newVehicle, setNewVehicle] = useState({
    nom: "",
    marque: "",
    modele: "",
    immatriculation: "",
    nombrePlace: "" as number | "",
    typeId: 0,
    statusId: 0,
    distance_moyenne: "" as number | "",
    derniere_visite: "",
    image: undefined as File | undefined,
  });

  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    dispatch(fetchVehicles());
    dispatch(fetchVehicleTypes());
    dispatch(fetchVehicleStatuses());
  }, [dispatch]);

  useEffect(() => {
    if (vehiclesError || vehiclesTypeError || vehiclesStatusError) {
      setSnackbar({
        open: true,
        message:
          vehiclesError ||
          vehiclesTypeError ||
          vehiclesStatusError ||
          "Erreur inconnue",
        severity: "error",
      });
    }
  }, [vehiclesError, vehiclesTypeError, vehiclesStatusError]);

  // Filtrage des véhicules
  const filteredVehicles = useMemo(() => {
    return vehicles.filter(
      (vehicle) =>
        vehicle.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vehicle.immatriculation.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [vehicles, searchTerm]);

  // Calcul des statistiques - CORRECTION: ajout de vérifications pour status
  const stats = useMemo(() => {
    const total = vehicles.length;
    const available = vehicles.filter(
      (v) => v.status?.status?.toLowerCase() === "disponible"
    ).length;
    const inMaintenance = vehicles.filter(
      (v) => v.status?.status?.toLowerCase() === "en maintenance"
    ).length;
    const reserved = vehicles.filter(
      (v) => v.status?.status?.toLowerCase() === "réservé"
    ).length;

    return [
      {
        title: "Total des Véhicules",
        value: total,
        icon: <CarIcon fontSize="large" color="primary" />,
        bg: "#e3f2fd",
      },
      {
        title: "Disponibles",
        value: available,
        icon: <CheckIcon fontSize="large" color="success" />,
        bg: "#e8f5e9",
      },
      {
        title: "Réservés",
        value: reserved,
        icon: <ReservedIcon fontSize="large" color="info" />,
        bg: "#e1f5fe",
      },
      {
        title: "En Maintenance",
        value: inMaintenance,
        icon: <CancelIcon fontSize="large" color="warning" />,
        bg: "#fff3e0",
      },
    ];
  }, [vehicles]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!newVehicle.nom) newErrors.nom = "Le nom est requis";
    if (!newVehicle.marque) newErrors.marque = "La marque est requise";
    if (!newVehicle.modele) newErrors.modele = "Le modèle est requis";
    if (!newVehicle.immatriculation)
      newErrors.immatriculation = "L'immatriculation est requise";
    if (!newVehicle.nombrePlace)
      newErrors.nombrePlace = "Le nombre de places est requis";
    if (newVehicle.typeId === 0) newErrors.typeId = "Le type est requis";
    if (newVehicle.statusId === 0) newErrors.statusId = "Le statut est requis";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setNewVehicle((prev) => ({
      ...prev,
      [name]:
        name === "nombrePlace" || name === "distance_moyenne"
          ? value === ""
            ? ""
            : parseFloat(value) || 0
          : value,
    }));
  };

  const handleSelectChange = (e: SelectChangeEvent<number>) => {
    const { name, value } = e.target;
    setNewVehicle((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setNewVehicle((prev) => ({ ...prev, image: e.target.files![0] }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    const vehicleData = {
      nom: newVehicle.nom,
      marque: newVehicle.marque,
      modele: newVehicle.modele,
      immatriculation: newVehicle.immatriculation,
      nombrePlace:
        newVehicle.nombrePlace === "" ? 0 : Number(newVehicle.nombrePlace),
      typeId: Number(newVehicle.typeId),
      statusId: Number(newVehicle.statusId),
      distance_moyenne:
        newVehicle.distance_moyenne === ""
          ? undefined
          : Number(newVehicle.distance_moyenne),
      derniere_visite: newVehicle.derniere_visite || undefined,
      image: newVehicle.image,
    };

    try {
      if (editingVehicle) {
        await dispatch(
          updateVehicle({
            id: editingVehicle.id,
            data: {
              nom: vehicleData.nom,
              marque: vehicleData.marque,
              modele: vehicleData.modele,
              immatriculation: vehicleData.immatriculation,
              nombrePlace: vehicleData.nombrePlace,
              type: { id: vehicleData.typeId, type: "" },
              status: { id: vehicleData.statusId, status: "" },
              distance_moyenne: vehicleData.distance_moyenne,
              derniere_visite: vehicleData.derniere_visite,
            },
            image: vehicleData.image,
          })
        ).unwrap();

        setSnackbar({
          open: true,
          message: "Véhicule mis à jour avec succès",
          severity: "success",
        });
        setEditingVehicle(null);
      } else {
        await dispatch(createVehicle(vehicleData)).unwrap();
        setSnackbar({
          open: true,
          message: "Véhicule créé avec succès",
          severity: "success",
        });
      }

      setNewVehicle({
        nom: "",
        marque: "",
        modele: "",
        immatriculation: "",
        nombrePlace: "",
        typeId: 0,
        statusId: 0,
        distance_moyenne: "",
        derniere_visite: "",
        image: undefined,
      });
      setOpenDialog(false);
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Une erreur est survenue",
        severity: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (vehicle: Vehicle) => {
    setEditingVehicle(vehicle);
    setNewVehicle({
      nom: vehicle.nom,
      marque: vehicle.marque,
      modele: vehicle.modele,
      immatriculation: vehicle.immatriculation,
      nombrePlace: vehicle.nombrePlace ?? "",
      typeId: vehicle.type.id,
      statusId: vehicle.status.id,
      distance_moyenne: vehicle.distance_moyenne ?? "",
      derniere_visite: vehicle.derniere_visite ?? "",
      image: undefined,
    });
    setOpenDialog(true);
  };

  const handleDelete = (id: number) => {
    setDeleteConfirm(id);
  };

  const confirmDelete = async () => {
    if (deleteConfirm) {
      try {
        await dispatch(deleteVehicle(deleteConfirm)).unwrap();
        setSnackbar({
          open: true,
          message: "Véhicule supprimé avec succès",
          severity: "success",
        });
      } catch (error) {
        setSnackbar({
          open: true,
          message: "Échec de la suppression",
          severity: "error",
        });
      } finally {
        setDeleteConfirm(null);
      }
    }
  };

  const resetForm = () => {
    setNewVehicle({
      nom: "",
      marque: "",
      modele: "",
      immatriculation: "",
      nombrePlace: "",
      typeId: 0,
      statusId: 0,
      distance_moyenne: "",
      derniere_visite: "",
      image: undefined,
    });
    setEditingVehicle(null);
    setErrors({});
    setOpenDialog(false);
  };

  // CORRECTION: Gestion des statuts potentiellement undefined
  const getStatusColor = (status: string | undefined) => {
    if (!status) return theme.palette.text.secondary;

    switch (status.toLowerCase()) {
      case "disponible":
        return theme.palette.success.main;
      case "en maintenance":
        return theme.palette.warning.main;
      case "réservé":
        return theme.palette.info.main;
      case "hors service":
        return theme.palette.error.main;
      default:
        return theme.palette.text.secondary;
    }
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
        {/* Header et recherche */}
        <Grid container spacing={1} mb={3} alignItems="center">
          <Grid item xs={12} sm={6}>
            <Typography variant="h4" sx={{ fontWeight: 600, color: "#1f2937" }}>
              Gestion du Parc Automobile
            </Typography>
            <Typography variant="body2" color="text.secondary" mt={0.5}>
              Consultez, ajoutez et gérez les véhicules de votre flotte
            </Typography>
          </Grid>
          <Grid
            item
            xs={12}
            sm={6}
            display="flex"
            justifyContent={isMobile ? "flex-start" : "flex-end"}
            gap={1}
            mt={isMobile ? 1 : 0}
          >
            <TextField
              size="small"
              placeholder="Rechercher..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <SearchIcon
                    sx={{ color: theme.palette.text.secondary, mr: 1 }}
                  />
                ),
              }}
              sx={{
                backgroundColor: "#fff",
                borderRadius: "8px",
                minWidth: 140,
                "& .MuiOutlinedInput-root": {
                  borderRadius: "8px",
                },
              }}
            />
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setOpenDialog(true)}
              sx={{
                borderRadius: "8px",
                textTransform: "none",
                minHeight: 36,
                fontSize: "0.8rem",
                px: 2,
                fontWeight: 600,
              }}
            >
              Ajouter un véhicule
            </Button>
          </Grid>
        </Grid>

        {/* Cartes de statistiques */}
        <Grid container spacing={2} mb={3}>
          {stats.map((stat, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card
                sx={{
                  backgroundColor: stat.bg,
                  borderRadius: 3,
                  boxShadow: 3,
                  transition: "0.3s",
                  "&:hover": { transform: "translateY(-5px)", boxShadow: 6 },
                  height: "100%",
                }}
              >
                <CardContent>
                  <Box display="flex" alignItems="center" gap={2}>
                    {stat.icon}
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">
                        {stat.title}
                      </Typography>
                      <Typography variant="h5" fontWeight="bold">
                        {stat.value}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Tableau des véhicules */}
        <Card
          elevation={3}
          sx={{ borderRadius: 3, overflow: "hidden", boxShadow: 3 }}
        >
          <CardContent sx={{ p: 0 }}>
            {vehiclesLoading || vehiclesTypeLoading || vehiclesStatusLoading ? (
              <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
                <CircularProgress size={50} />
              </Box>
            ) : (
              <>
                <TableContainer>
                  <Table>
                    <TableHead sx={{ bgcolor: theme.palette.grey[100] }}>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 700 }}>Véhicule</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>Détails</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>Statut</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>
                          Dernière visite
                        </TableCell>
                        <TableCell sx={{ fontWeight: 700 }} align="center">
                          Actions
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filteredVehicles.map((vehicle) => (
                        <TableRow key={vehicle.id} hover>
                          <TableCell
                            sx={{ display: "flex", alignItems: "center" }}
                          >
                            {vehicle.imageUrl ? (
                              <Avatar
                                src={vehicle.imageUrl}
                                alt={vehicle.nom}
                                variant="rounded"
                                sx={{
                                  width: 80,
                                  height: 60,
                                  mr: 2,
                                  boxShadow: theme.shadows[1],
                                }}
                              />
                            ) : (
                              <Avatar
                                variant="rounded"
                                sx={{
                                  width: 80,
                                  height: 60,
                                  mr: 2,
                                  bgcolor: theme.palette.grey[200],
                                  boxShadow: theme.shadows[1],
                                }}
                              >
                                <CarIcon
                                  sx={{
                                    fontSize: 30,
                                    color: theme.palette.grey[500],
                                  }}
                                />
                              </Avatar>
                            )}
                            <Box>
                              <Typography variant="subtitle1" fontWeight={600}>
                                {vehicle.nom}
                              </Typography>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                {vehicle.marque} {vehicle.modele}
                              </Typography>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                {vehicle.immatriculation}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              Type:{" "}
                              <strong>{vehicle.type?.type || "N/A"}</strong>
                            </Typography>
                            <Typography variant="body2">
                              Places: <strong>{vehicle.nombrePlace}</strong>
                            </Typography>
                            <Typography variant="body2">
                              Distance:{" "}
                              <strong>
                                {vehicle.distance_moyenne ?? "N/A"} km
                              </strong>
                            </Typography>
                          </TableCell>
                          <TableCell>
                            {/* CORRECTION: Gestion du statut potentiellement undefined */}
                            <Box
                              sx={{
                                display: "inline-flex",
                                alignItems: "center",
                                px: 1.5,
                                py: 0.5,
                                borderRadius: 1,
                                bgcolor: `${getStatusColor(
                                  vehicle.status?.status
                                )}20`,
                                color: getStatusColor(vehicle.status?.status),
                                fontWeight: 600,
                              }}
                            >
                              {vehicle.status?.status || "N/A"}
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {vehicle.derniere_visite || "N/A"}
                            </Typography>
                          </TableCell>
                          <TableCell align="center">
                            <Tooltip title="Modifier" arrow>
                              <IconButton
                                color="primary"
                                onClick={() => handleEdit(vehicle)}
                                sx={{ mx: 0.5 }}
                              >
                                <EditIcon />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Supprimer" arrow>
                              <IconButton
                                color="error"
                                onClick={() => handleDelete(vehicle.id)}
                                sx={{ mx: 0.5 }}
                              >
                                <DeleteIcon />
                              </IconButton>
                            </Tooltip>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>

                {filteredVehicles.length === 0 && (
                  <Box sx={{ textAlign: "center", py: 6 }}>
                    <CarIcon
                      sx={{
                        fontSize: 60,
                        color: theme.palette.grey[400],
                        mb: 2,
                      }}
                    />
                    <Typography variant="h6" color="textSecondary">
                      Aucun véhicule trouvé
                    </Typography>
                    <Typography color="textSecondary" sx={{ mt: 1 }}>
                      Aucun résultat ne correspond à votre recherche
                    </Typography>
                  </Box>
                )}
              </>
            )}
          </CardContent>
        </Card>

        {/* Dialog d'ajout/modification */}
        <Dialog
          open={openDialog}
          onClose={resetForm}
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
            {editingVehicle
              ? "Modifier le véhicule"
              : "Ajouter un nouveau véhicule"}
          </DialogTitle>

          <DialogContent sx={{ py: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Nom du véhicule"
                  name="nom"
                  value={newVehicle.nom}
                  onChange={handleInputChange}
                  error={!!errors.nom}
                  helperText={errors.nom}
                  required
                  variant="outlined"
                  size="small"
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Marque"
                  name="marque"
                  value={newVehicle.marque}
                  onChange={handleInputChange}
                  error={!!errors.marque}
                  helperText={errors.marque}
                  required
                  variant="outlined"
                  size="small"
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Modèle"
                  name="modele"
                  value={newVehicle.modele}
                  onChange={handleInputChange}
                  error={!!errors.modele}
                  helperText={errors.modele}
                  required
                  variant="outlined"
                  size="small"
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Immatriculation"
                  name="immatriculation"
                  value={newVehicle.immatriculation}
                  onChange={handleInputChange}
                  error={!!errors.immatriculation}
                  helperText={errors.immatriculation}
                  required
                  variant="outlined"
                  size="small"
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Nombre de places"
                  name="nombrePlace"
                  type="number"
                  value={newVehicle.nombrePlace}
                  onChange={handleInputChange}
                  error={!!errors.nombrePlace}
                  helperText={errors.nombrePlace}
                  required
                  inputProps={{ min: 1 }}
                  variant="outlined"
                  size="small"
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Distance moyenne (km)"
                  name="distance_moyenne"
                  type="number"
                  value={newVehicle.distance_moyenne}
                  onChange={handleInputChange}
                  variant="outlined"
                  size="small"
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Dernière visite"
                  name="derniere_visite"
                  type="date"
                  value={newVehicle.derniere_visite}
                  onChange={handleInputChange}
                  InputLabelProps={{ shrink: true }}
                  variant="outlined"
                  size="small"
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl
                  fullWidth
                  error={!!errors.typeId}
                  required
                  size="small"
                  sx={{ mb: 2 }}
                >
                  <InputLabel>Type de véhicule</InputLabel>
                  <Select
                    name="typeId"
                    value={newVehicle.typeId}
                    onChange={handleSelectChange}
                    label="Type de véhicule"
                    variant="outlined"
                  >
                    <MenuItem value={0} disabled>
                      Sélectionner le type
                    </MenuItem>
                    {vehiclesType.map((type) => (
                      <MenuItem key={type.id} value={type.id}>
                        {type.type}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.typeId && (
                    <FormHelperText>{errors.typeId}</FormHelperText>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl
                  fullWidth
                  error={!!errors.statusId}
                  required
                  size="small"
                  sx={{ mb: 2 }}
                >
                  <InputLabel>Statut du véhicule</InputLabel>
                  <Select
                    name="statusId"
                    value={newVehicle.statusId}
                    onChange={handleSelectChange}
                    label="Statut du véhicule"
                    variant="outlined"
                  >
                    <MenuItem value={0} disabled>
                      Sélectionner le statut
                    </MenuItem>
                    {vehiclesStatus.map((status) => (
                      <MenuItem key={status.id} value={status.id}>
                        {status.status}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.statusId && (
                    <FormHelperText>{errors.statusId}</FormHelperText>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <Button
                  variant="outlined"
                  component="label"
                  fullWidth
                  sx={{
                    py: 1.5,
                    borderRadius: "8px",
                    borderStyle: "dashed",
                    borderWidth: 1.5,
                    borderColor: theme.palette.grey[400],
                  }}
                >
                  Télécharger une image
                  <input
                    type="file"
                    name="image"
                    onChange={handleImageChange}
                    hidden
                    accept="image/*"
                  />
                </Button>
                {newVehicle.image && (
                  <Typography
                    variant="caption"
                    sx={{
                      mt: 1,
                      display: "block",
                      color: theme.palette.text.secondary,
                    }}
                  >
                    {newVehicle.image.name}
                  </Typography>
                )}
              </Grid>
            </Grid>
          </DialogContent>

          <DialogActions
            sx={{
              px: 3,
              py: 2,
              borderTop: `1px solid ${theme.palette.divider}`,
            }}
          >
            <Button
              onClick={resetForm}
              color="inherit"
              sx={{
                fontWeight: 600,
                borderRadius: "8px",
                textTransform: "none",
                px: 3,
                py: 1,
              }}
            >
              Annuler
            </Button>
            <Button
              onClick={handleSubmit}
              color="primary"
              variant="contained"
              disabled={isSubmitting}
              sx={{
                fontWeight: 600,
                borderRadius: "8px",
                textTransform: "none",
                px: 3,
                py: 1,
              }}
            >
              {isSubmitting ? (
                <CircularProgress size={20} sx={{ color: "white", mr: 1 }} />
              ) : editingVehicle ? (
                <SaveIcon sx={{ mr: 1 }} />
              ) : (
                <AddIcon sx={{ mr: 1 }} />
              )}
              {editingVehicle ? "Enregistrer" : "Ajouter"}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Confirmation de suppression */}
        <Dialog
          open={!!deleteConfirm}
          onClose={() => setDeleteConfirm(null)}
          PaperProps={{ sx: { borderRadius: 3 } }}
        >
          <DialogTitle sx={{ fontWeight: 600 }}>
            Confirmer la suppression
          </DialogTitle>
          <DialogContent>
            <Typography>
              Êtes-vous sûr de vouloir supprimer définitivement ce véhicule ?
              Cette action est irréversible.
            </Typography>
          </DialogContent>
          <DialogActions sx={{ px: 3, py: 2 }}>
            <Button
              onClick={() => setDeleteConfirm(null)}
              color="inherit"
              sx={{ fontWeight: 600 }}
            >
              Annuler
            </Button>
            <Button
              onClick={confirmDelete}
              color="error"
              variant="contained"
              startIcon={<DeleteIcon />}
              sx={{ fontWeight: 600 }}
            >
              Supprimer
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
            iconMapping={{
              success: <CheckIcon fontSize="inherit" />,
              error: <CancelIcon fontSize="inherit" />,
            }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </ThemeProvider>
  );
};

export default VehicleList;
