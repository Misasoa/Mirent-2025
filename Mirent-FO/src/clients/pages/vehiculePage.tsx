import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Container,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Pagination,
  Skeleton,
  TextField,
  Typography,
  Select,
  Popover,
} from "@mui/material";
import { motion, useScroll, useTransform } from "framer-motion";
import { useState, useEffect, useCallback } from "react"; // Import useCallback
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Navbar from "../components/Navbar";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import SentimentDissatisfiedIcon from "@mui/icons-material/SentimentDissatisfied";
import InfoIcon from "@mui/icons-material/Info";
import SearchIcon from "@mui/icons-material/Search";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import BuildIcon from "@mui/icons-material/Build";
import image from "/src/assets/bg.jpeg";

// Import depuis votre slice
import {
  fetchVehicles,
  fetchVehicleTypes,
  fetchVehicleStatuses,
} from "../../redux/features/vehicle/vehiclesSlice";
import { RootState } from "../../redux/store";
import { useAppDispatch } from "../../hooks";
import VehicleDetails from "../components/VehiclesDetails"; // Ensure VehicleDetails can handle null prop

const VehiclesPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  // Sélecteurs pour récupérer les données du store
  const {
    vehicles,
    vehiclesLoading,
    vehiclesError,
    vehiclesType,
    vehiclesTypeLoading,
    vehiclesTypeError,
    vehiclesStatus,
    vehiclesStatusLoading,
    vehiclesStatusError,
  } = useSelector((state: RootState) => state.vehicles);

  const [page, setPage] = useState(1);
  const [brandFilter, setBrandFilter] = useState("Toutes");
  const [typeFilter, setTypeFilter] = useState("Tous");
  const [statusFilter, setStatusFilter] = useState("Tous");
  const [searchQuery, setSearchQuery] = useState("");
  const [popoverAnchor, setPopoverAnchor] = useState<HTMLElement | null>(null);
  const [selectedVehicleId, setSelectedVehicleId] = useState<number | null>(
    null
  );
  const itemsPerPage = 6;

  // Charger les données au montage du composant
  useEffect(() => {
    dispatch(fetchVehicles());
    dispatch(fetchVehicleTypes());
    dispatch(fetchVehicleStatuses());
  }, [dispatch]);

  // Filtres dynamiques à partir des données Redux
  // Ensure that unique brands are extracted correctly, handling potential duplicates from `vehicles` array
  const brands = ["Toutes", ...new Set(vehicles.map((v) => v.marque))];
  const types = ["Tous", ...vehiclesType.map((t) => t.type)];
  const statuses = ["Tous", ...vehiclesStatus.map((s) => s.status)];

  // Filtrage des véhicules
  const filteredVehicles = vehicles.filter((vehicle) => {
    const matchesBrand = brandFilter === "Toutes" || vehicle.marque === brandFilter;
    const matchesType = typeFilter === "Tous" || vehicle.type.type === typeFilter;
    const matchesStatus = statusFilter === "Tous" || vehicle.status.status === statusFilter;
    const matchesSearch = searchQuery
      ? vehicle.marque.toLowerCase().includes(searchQuery.toLowerCase()) ||
        vehicle.modele.toLowerCase().includes(searchQuery.toLowerCase()) ||
        vehicle.immatriculation?.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
    return matchesBrand && matchesType && matchesStatus && matchesSearch;
  });

  // Réinitialiser les filtres (using useCallback)
  const resetFilters = useCallback(() => {
    setBrandFilter("Toutes");
    setTypeFilter("Tous");
    setStatusFilter("Tous");
    setSearchQuery("");
    setPage(1);
  }, []);

  // Pagination
  const totalPages = Math.ceil(filteredVehicles.length / itemsPerPage);
  const paginatedVehicles = filteredVehicles.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  // Animations
  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.2, duration: 0.5 },
    }),
  };

  const buttonVariants = {
    hover: { scale: 1.05, boxShadow: "0px 8px 24px rgba(0, 0, 0, 0.3)" },
    tap: { scale: 0.95 },
  };

  // Parallax effect for background
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 1000], [0, 250]);

  // Gestion du popover (using useCallback)
  const handleOpenPopover = useCallback(
    (event: React.MouseEvent<HTMLElement>, vehicleId: number) => {
      setPopoverAnchor(event.currentTarget);
      setSelectedVehicleId(vehicleId);
    },
    []
  );

  const handleClosePopover = useCallback(() => {
    setPopoverAnchor(null);
    setSelectedVehicleId(null);
  }, []);

  const selectedVehicle = vehicles.find((v) => v.id === selectedVehicleId) || null;

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(145deg, #f0f4f8 0%, #e0e7ef 100%)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background */}
      <motion.div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `url(${image})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: 0.1,
          zIndex: 0,
          y,
        }}
      />
      <Navbar />
      <Container
        sx={{
          p: { xs: 2, md: 4 },
          pt: { xs: 10, md: 14 },
          pb: 8,
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Titre */}
        <Typography
          variant="h3"
          gutterBottom
          textAlign="center"
          fontWeight="bold"
          sx={{
            color: "#1a202c",
            mb: 6,
            textShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
            fontSize: { xs: "2.2rem", md: "3.5rem" },
          }}
        >
          Découvrez Notre Flotte
        </Typography>

        {/* Erreurs */}
        {(vehiclesError || vehiclesTypeError || vehiclesStatusError) && (
          <Box sx={{ mb: 4, textAlign: "center" }}>
            <Typography color="error">
              Erreur : {vehiclesError || vehiclesTypeError || vehiclesStatusError}
            </Typography>
          </Box>
        )}

        {/* Filtres */}
        <Box
          sx={{
            mb: 6,
            display: "flex",
            gap: 2,
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(255, 255, 255, 0.95)",
            p: 3,
            borderRadius: 4,
            boxShadow: "0px 6px 24px rgba(0, 0, 0, 0.1)",
            border: "1px solid rgba(0, 0, 0, 0.05)",
          }}
        >
          <TextField
            label="Rechercher..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(1);
            }}
            sx={{
              minWidth: { xs: 140, sm: 220 },
              bgcolor: "#fff",
              borderRadius: 8,
              "& .MuiOutlinedInput-root": {
                borderRadius: 8,
              },
            }}
            InputProps={{
              startAdornment: <SearchIcon sx={{ mr: 1, color: "#3b82f6" }} />,
            }}
          />

          <FormControl
            sx={{
              minWidth: { xs: 140, sm: 180 },
              bgcolor: "#fff",
              borderRadius: 8,
            }}
          >
            <InputLabel sx={{ fontWeight: 500, color: "#3b82f6" }}>Marque</InputLabel>
            <Select
              value={brandFilter}
              label="Marque"
              onChange={(e) => {
                setBrandFilter(e.target.value);
                setPage(1);
              }}
              sx={{
                borderRadius: 8,
                "& .MuiSelect-select": { py: 1.5 },
              }}
              disabled={vehiclesLoading} // Disable while loading brands
            >
              {brands.map((brand) => (
                <MenuItem key={brand} value={brand}>
                  {brand}
                </MenuItem>
              ))}
              {vehiclesLoading && <MenuItem disabled>Chargement...</MenuItem>}
            </Select>
          </FormControl>

          <FormControl
            sx={{
              minWidth: { xs: 140, sm: 180 },
              bgcolor: "#fff",
              borderRadius: 8,
            }}
          >
            <InputLabel sx={{ fontWeight: 500, color: "#3b82f6" }}>Type</InputLabel>
            <Select
              value={typeFilter}
              label="Type"
              onChange={(e) => {
                setTypeFilter(e.target.value);
                setPage(1);
              }}
              sx={{
                borderRadius: 8,
                "& .MuiSelect-select": { py: 1.5 },
              }}
              disabled={vehiclesTypeLoading} // Disable while loading types
            >
              {types.map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
              {vehiclesTypeLoading && <MenuItem disabled>Chargement...</MenuItem>}
            </Select>
          </FormControl>

          <FormControl
            sx={{
              minWidth: { xs: 140, sm: 180 },
              bgcolor: "#fff",
              borderRadius: 8,
            }}
          >
            <InputLabel sx={{ fontWeight: 500, color: "#3b82f6" }}>Statut</InputLabel>
            <Select
              value={statusFilter}
              label="Statut"
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              sx={{
                borderRadius: 8,
                "& .MuiSelect-select": { py: 1.5 },
              }}
              disabled={vehiclesStatusLoading} // Disable while loading statuses
            >
              {statuses.map((status) => (
                <MenuItem key={status} value={status}>
                  {status}
                </MenuItem>
              ))}
              {vehiclesStatusLoading && <MenuItem disabled>Chargement...</MenuItem>}
            </Select>
          </FormControl>

          <Button
            onClick={resetFilters}
            startIcon={<RestartAltIcon />}
            sx={{
              bgcolor: "#fff",
              color: "#ef4444",
              border: "1px solid #ef4444",
              borderRadius: 8,
              px: 3,
              py: 1,
              fontWeight: 600,
              textTransform: "none",
              "&:hover": { bgcolor: "#fef2f2", color: "#dc2626" },
            }}
          >
            Réinitialiser
          </Button>
        </Box>

        {/* Grille des véhicules */}
        <Grid container spacing={4}>
          {vehiclesLoading || vehiclesTypeLoading || vehiclesStatusLoading
            ? Array.from(new Array(itemsPerPage)).map((_, index) => ( // Use itemsPerPage for skeleton count
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Skeleton variant="rectangular" height={240} animation="wave" sx={{ borderRadius: 2 }} />
                  <Box sx={{ pt: 1.5, pb: 2, px: 1 }}>
                    <Skeleton width="80%" height={30} />
                    <Skeleton width="60%" height={20} />
                    <Skeleton width="40%" height={20} />
                  </Box>
                </Grid>
              ))
            : paginatedVehicles.length > 0
            ? paginatedVehicles.map((vehicle, index) => (
                <Grid item xs={12} sm={6} md={4} key={vehicle.id}>
                  <motion.div
                    custom={index}
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    <Card
                      sx={{
                        borderRadius: 2, // Applied to Card
                        boxShadow: "0px 4px 16px rgba(0, 0, 0, 0.1)", // Applied to Card
                        bgcolor: "#ffffff", // Applied to Card
                        transition: "transform 0.3s ease, box-shadow 0.3s ease", // Applied to Card
                        "&:hover": {
                          transform: "translateY(-10px)", // Applied to Card
                          boxShadow: "0px 12px 32px rgba(0, 0, 0, 0.2)", // Applied to Card
                        },
                      }}
                    >
                      <CardMedia
                        component="img"
                        height="240"
                        image={
                          vehicle.imageUrl ||
                          "https://via.placeholder.com/500x240?text=Image+Indisponible"
                        }
                        alt={`${vehicle.marque} ${vehicle.modele}`}
                        sx={{
                          objectFit: "cover",
                          borderTopLeftRadius: 8,
                          borderTopRightRadius: 8,
                        }}
                      />
                      <CardContent sx={{ flexGrow: 1, p: 3 }}>
                        <Typography
                          gutterBottom
                          variant="h6"
                          component="div"
                          fontWeight="bold"
                          sx={{
                            color: "#0f172a",
                            fontSize: "1.3rem",
                            fontFamily: "'Inter', sans-serif",
                          }}
                        >
                          {vehicle.marque} {vehicle.modele}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            color: "#475569",
                            mb: 1.5,
                            fontFamily: "'Inter', sans-serif",
                          }}
                        >
                          {vehicle.type.type}
                        </Typography>
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          {vehicle.status.status === "Disponible" ? (
                            <CheckCircleIcon
                              sx={{ color: "#2e7d32", fontSize: "1.2rem" }}
                            />
                          ) : vehicle.status.status === "Réservé" ? (
                            <CancelIcon
                              sx={{ color: "#ff9800", fontSize: "1.2rem" }}
                            />
                          ) : (
                            <BuildIcon
                              sx={{ color: "#d32f2f", fontSize: "1.2rem" }}
                            />
                          )}
                          <Typography
                            variant="body1"
                            sx={{
                              color:
                                vehicle.status.status === "Disponible"
                                  ? "#2e7d32"
                                  : vehicle.status.status === "Réservé"
                                  ? "#ff9800"
                                  : "#d32f2f",
                              fontWeight: 600,
                              fontFamily: "'Inter', sans-serif",
                            }}
                          >
                            {vehicle.status.status}
                          </Typography>
                        </Box>
                      </CardContent>
                      <CardActions sx={{ p: 3, pt: 0, display: "flex", gap: 2, justifyContent: "center" }}>
                        <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
                          <Button
                            size="medium"
                            variant="contained"
                            onClick={() => navigate(`/voitures/${vehicle.id}/reserver`)}
                            disabled={vehicle.status.status !== "Disponible"}
                            sx={{
                              bgcolor: "#f97316",
                              color: "#fff",
                              borderRadius: 8,
                              px: 3,
                              py: 1.5,
                              fontWeight: 600,
                              textTransform: "none",
                              "&:hover": { bgcolor: "#ea580c" },
                              "&:disabled": { bgcolor: "#d1d5db", color: "#fff" },
                            }}
                          >
                            Réserver
                          </Button>
                        </motion.div>
                        <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
                          <Button
                            size="medium"
                            variant="outlined"
                            onClick={(e) => handleOpenPopover(e, vehicle.id)}
                            sx={{
                              borderColor: "#3b82f6",
                              color: "#3b82f6",
                              borderRadius: 8,
                              px: 3,
                              py: 1.5,
                              fontWeight: 600,
                              textTransform: "none",
                              "&:hover": { borderColor: "#1d4ed8", bgcolor: "rgba(59, 130, 246, 0.08)" },
                            }}
                            startIcon={<InfoIcon />}
                          >
                            Détails
                          </Button>
                        </motion.div>
                      </CardActions>
                    </Card>
                  </motion.div>
                </Grid>
              ))
            : (
                <Box sx={{ width: "100%", textAlign: "center", py: 10 }}>
                  <SentimentDissatisfiedIcon sx={{ fontSize: 60, color: "#6b7280" }} />
                  <Typography variant="h5" sx={{ color: "#1f2937", mt: 2 }}>
                    Aucun véhicule trouvé
                  </Typography>
                </Box>
              )}
        </Grid>

        {/* Pagination */}
        {totalPages > 1 && !vehiclesLoading && (
          <Box sx={{ mt: 8, display: "flex", justifyContent: "center" }}>
            <Pagination
              count={totalPages}
              page={page}
              onChange={(e, value) => setPage(value)}
              color="primary"
              size="large"
              sx={{
                "& .MuiPaginationItem-root": {
                  color: "#1e293b",
                  bgcolor: "transparent",
                  borderRadius: 8,
                  "&:hover": { bgcolor: "rgba(59, 130, 246, 0.1)" },
                  "&.Mui-selected": { bgcolor: "#f97316", color: "#fff" },
                },
              }}
            />
          </Box>
        )}

        {/* Popover */}
        <Popover
          open={Boolean(popoverAnchor)}
          anchorEl={popoverAnchor}
          onClose={handleClosePopover}
          anchorOrigin={{
            vertical: "center",
            horizontal: "center",
          }}
          transformOrigin={{
            vertical: "center",
            horizontal: "center",
          }}
          sx={{
            "& .MuiPopover-paper": {
              borderRadius: 2,
              overflow: "visible",
              boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.2)",
            },
          }}
        >
          {/* Ensure VehicleDetails component can handle 'null' for vehicle prop */}
          <VehicleDetails vehicle={selectedVehicle} onClose={handleClosePopover} />
        </Popover>
      </Container>
    </Box>
  );
};

export default VehiclesPage;