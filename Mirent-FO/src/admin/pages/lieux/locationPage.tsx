import React from "react";
import { Container, Grid } from "@mui/material";
import LocationList from "../../Components/lieux/locationList";

const LocationsPage: React.FC = () => {
  return (
    <Container maxWidth="lg">
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <LocationList />
        </Grid>
      </Grid>
    </Container>
  );
};

export default LocationsPage;
