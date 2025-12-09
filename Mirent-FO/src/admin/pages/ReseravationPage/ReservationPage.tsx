import react from "react";
import { Grid, Container } from "@mui/material";

import Reservations from "../../Components/Reservation/ReservationList";

const ReservationPage: React.FC = () => {
  return (
    <Container maxWidth="lg" style={{ marginTop: "2rem" }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Reservations />
        </Grid>
      </Grid>
    </Container>
  );
};
export default ReservationPage;
