import { useSelector } from "react-redux";
import { useAppDispatch } from "../hooks";
import { fetchVehicles } from "../redux/features/vehicle/vehiclesSlice";
import { useEffect } from "react";
import { Alert, Box, Card, CardContent, CardMedia, CircularProgress, Grid, Typography } from "@mui/material";
import { RootState } from "../redux/store";
import Navbar from "./Components/Navbar";


const ClientCatalogue = () => {
  const dispatch = useAppDispatch();
  const { vehicles, vehiclesTypeLoading, vehiclesTypeError } = useSelector(
    (state: RootState) => state.vehicles
  );

  useEffect(() => {
    dispatch(fetchVehicles());
  }, [dispatch]);

  return (
    <Box>
      <Navbar />
      <Box sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          Catalogue des véhicules
        </Typography>

        {vehiclesTypeLoading && (
          <Box textAlign="center" mt={4}>
            <CircularProgress />
          </Box>
        )}

        {vehiclesTypeError && (
          <Alert severity="error" sx={{ mt: 2 }}>Erreur : {vehiclesTypeError}</Alert>
        )}

        <Grid container spacing={3} mt={2}>
          {vehicles.map((vehicle) => (
            <Grid item xs={12} sm={6} md={4} key={vehicle.id}>
              <Card sx={{ maxWidth: 345 }}>
                <CardMedia
                  component="img"
                  height="180"
                  image={vehicle.imageUrl || "/placeholder.jpg"}
                  alt={vehicle.nom}
                />
                <CardContent>
                  <Typography variant="h6" component="div">
                    {vehicle.nom} - {vehicle.marque}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Modèle : {vehicle.modele}
                    <br />
                    Immatriculation : {vehicle.immatriculation}
                    <br />
                    Places : {vehicle.nombrePlace}
                    <br />
                    Type : {vehicle.type?.type}
                    <br />
                    Statut : {vehicle.status?.status}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

      </Box>
    </Box>
  );
};

export default ClientCatalogue;