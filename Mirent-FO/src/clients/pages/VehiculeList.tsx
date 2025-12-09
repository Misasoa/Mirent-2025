import {
  Box,
  Container,
  Grid,
  MenuItem,
  Select,
  Typography,
  Card,
  CardContent,
  CardMedia,
  SelectChangeEvent,
  Button,
  Modal,
  Fade,
  Backdrop,
  CircularProgress,
  Pagination,
  TextField,
  InputLabel,
  FormControl,
} from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { RootState, AppDispatch } from "../../redux/store";
import {
  fetchVehicles,
  Vehicle,
} from "../../redux/features/vehicle/vehiclesSlice";
import { motion } from "framer-motion";
import { addReservation } from "../../redux/features/reservation/reservationSlice";
import Navbar from "../components/Navbar";

interface Lieu {
  id: number;
  nom: string;
}

interface PrixParLieu {
  [vehiculeId: number]: {
    [lieuId: number]: number;
  };
}

const VehiculeList = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { vehicles, loading, vehiclesError } = useSelector(
    (state: RootState) => state.vehicles
  );

  const [selectedLieu, setSelectedLieu] = useState<number | "">("");
  const [selectedPlaces, setSelectedPlaces] = useState<string>("");
  const [selectedType, setSelectedType] = useState<string>("");
  const [openModal, setOpenModal] = useState(false);
  const [vehiculeActuel, setVehiculeActuel] = useState<Vehicle | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    dispatch(fetchVehicles());
  }, [dispatch]);

  const lieux: Lieu[] = [
    { id: 1, nom: "Antananarivo" },
    { id: 2, nom: "Toamasina" },
    { id: 3, nom: "Mahajanga" },
  ];

  const prixParLieu: PrixParLieu = {
    1: { 1: 50000, 2: 55000, 3: 60000 },
    2: { 1: 60000, 2: 62000, 3: 65000 },
    3: { 1: 70000, 2: 75000, 3: 78000 },
  };

  const handleLieuChange = (e: SelectChangeEvent) => {
    const value = e.target.value === "" ? "" : parseInt(e.target.value);
    setSelectedLieu(value);
  };

  const handleOpenModal = (vehicule: Vehicle) => {
    setVehiculeActuel(vehicule);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setVehiculeActuel(null);
  };

  const handleChangePage = (_: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
  };
  const handleReserve = () => {
    if (vehiculeActuel) {
      dispatch(addReservation(vehiculeActuel));
      handleCloseModal();
    }
  };

  const filteredVehicles = vehicles.filter((v) => {
    const matchLieu = selectedLieu
      ? prixParLieu[v.id]?.[selectedLieu] !== undefined
      : true;
    const matchPlaces = selectedPlaces
      ? v.nombrePlace.toString() === selectedPlaces
      : true;
    const matchType = selectedType ? v.type?.type === selectedType : true;
    return matchLieu && matchPlaces && matchType;
  });

  const paginatedVehicles = filteredVehicles.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const allTypes = Array.from(
    new Set(vehicles.map((v) => v.type?.type).filter(Boolean))
  );
  const allPlaces = Array.from(new Set(vehicles.map((v) => v.nombrePlace)));

  return (
    <Box>
      <Navbar />
      <Box sx={{ py: 4, minHeight: "100vh", bgcolor: "#f0f4f8" }}>
        <Container>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Véhicules à louer
          </Typography>

          <Grid container spacing={2} sx={{ mb: 4 }}>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Lieu</InputLabel>
                <Select
                  value={selectedLieu.toString()}
                  onChange={handleLieuChange}
                  displayEmpty
                  sx={{ bgcolor: "#fff", borderRadius: 1 }}
                >
                  <MenuItem value="">
                    <em>Choisir un lieu</em>
                  </MenuItem>
                  {lieux.map((lieu) => (
                    <MenuItem key={lieu.id} value={lieu.id}>
                      {lieu.nom}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Places</InputLabel>
                <Select
                  value={selectedPlaces}
                  onChange={(e) => setSelectedPlaces(e.target.value)}
                  displayEmpty
                >
                  <MenuItem value="">
                    <em>Toutes les places</em>
                  </MenuItem>
                  {allPlaces.map((place) => (
                    <MenuItem key={place} value={place.toString()}>
                      {place} places
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Type</InputLabel>
                <Select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  displayEmpty
                >
                  <MenuItem value="">
                    <em>Tous les types</em>
                  </MenuItem>
                  {allTypes.map((type, index) => (
                    <MenuItem key={index} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
              <CircularProgress />
            </Box>
          ) : vehiclesError ? (
            <Typography color="error" align="center">
              Une erreur est survenue lors du chargement des véhicules.
            </Typography>
          ) : (
            <>
              <Grid container spacing={4}>
                {paginatedVehicles.map((vehicule) => (
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={4}
                    key={vehicule.id}
                    component={motion.div}
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Card
                      sx={{
                        height: "100%",
                        borderRadius: 2,
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      <CardMedia
                        component="img"
                        height="180"
                        image={vehicule.imageUrl}
                        alt={vehicule.nom}
                      />
                      <CardContent sx={{ flexGrow: 1 }}>
                        <Typography variant="h6">{vehicule.nom}</Typography>
                        <Typography color="text.secondary">
                          {vehicule.marque} {vehicule.modele}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {vehicule.nombrePlace} places
                        </Typography>
                        {selectedLieu && (
                          <Typography variant="body1" sx={{ mt: 1 }}>
                            Prix :{" "}
                            <strong>
                              {prixParLieu[vehicule.id]?.[selectedLieu]
                                ? `${prixParLieu[vehicule.id][selectedLieu]} Ar`
                                : "Non disponible"}
                            </strong>
                          </Typography>
                        )}
                      </CardContent>
                      <Box sx={{ p: 2 }}>
                        <Button
                          variant="contained"
                          fullWidth
                          onClick={handleReserve}
                        >
                          Reserver
                        </Button>
                      </Box>
                    </Card>
                  </Grid>
                ))}
              </Grid>
              <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
                <Pagination
                  count={Math.ceil(filteredVehicles.length / itemsPerPage)}
                  page={currentPage}
                  onChange={handleChangePage}
                  color="primary"
                />
              </Box>
            </>
          )}
        </Container>

        {/* Modal */}
        <Modal
          open={openModal}
          onClose={handleCloseModal}
          closeAfterTransition
          slots={{ backdrop: Backdrop }}
          slotProps={{ backdrop: { timeout: 500 } }}
        >
          <Fade in={openModal}>
            <Box
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: 500,
                bgcolor: "background.paper",
                borderRadius: 2,
                boxShadow: 24,
                p: 4,
              }}
            >
              {vehiculeActuel && (
                <>
                  <Typography variant="h5" mb={2}>
                    {vehiculeActuel.nom}
                  </Typography>
                  <CardMedia
                    component="img"
                    height="200"
                    image={vehiculeActuel.imageUrl}
                    alt={vehiculeActuel.nom}
                    sx={{ mb: 2, borderRadius: 2 }}
                  />
                  <Typography>
                    <strong>Marque :</strong> {vehiculeActuel.marque}
                  </Typography>
                  <Typography>
                    <strong>Modèle :</strong> {vehiculeActuel.modele}
                  </Typography>
                  <Typography>
                    <strong>Immatriculation :</strong>{" "}
                    {vehiculeActuel.immatriculation}
                  </Typography>
                  <Typography>
                    <strong>Nombre de places :</strong>{" "}
                    {vehiculeActuel.nombrePlace}
                  </Typography>
                  <Typography>
                    <strong>Type :</strong> {vehiculeActuel.type?.type}
                  </Typography>
                  <Typography>
                    <strong>Status :</strong> {vehiculeActuel.status?.status}
                  </Typography>
                  {selectedLieu && (
                    <Typography sx={{ mt: 2 }}>
                      <strong>Prix :</strong>{" "}
                      {prixParLieu[vehiculeActuel.id]?.[selectedLieu]
                        ? `${prixParLieu[vehiculeActuel.id][selectedLieu]} Ar`
                        : "Non disponible"}
                    </Typography>
                  )}
                </>
              )}
            </Box>
          </Fade>
        </Modal>
      </Box>
    </Box>
  );
};

export default VehiculeList;
