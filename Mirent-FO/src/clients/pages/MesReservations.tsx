import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../redux/store";
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
} from "@mui/material";
import { removeReservation } from "../../redux/features/reservation/reservationSlice";

const MesReservations = () => {
  const reservations = useSelector(
    (state: RootState) => state.reservation.reservations
  );
  const dispatch = useDispatch();

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        Mes Réservations
      </Typography>
      {reservations.length === 0 ? (
        <Typography>Aucune réservation.</Typography>
      ) : (
        reservations.map((vehicule) => (
          <Card key={vehicule.id} sx={{ mb: 2, display: "flex" }}>
            <CardMedia
              component="img"
              sx={{ width: 150 }}
              image={vehicule.imageUrl}
              alt={vehicule.nom}
            />
            <CardContent>
              <Typography variant="h6">{vehicule.nom}</Typography>
              <Typography>
                {vehicule.marque} {vehicule.modele}
              </Typography>
              <Typography>{vehicule.nombrePlace} places</Typography>
              <Button
                color="error"
                onClick={() => dispatch(removeReservation(vehicule.id))}
              >
                Supprimer
              </Button>
            </CardContent>
          </Card>
        ))
      )}
    </Box>
  );
};

export default MesReservations;
