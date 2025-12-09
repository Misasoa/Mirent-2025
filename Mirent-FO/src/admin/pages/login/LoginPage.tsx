import { Container, Grid } from "@mui/material";
import LoginPage from "../../../admin/Components/Authentification/Login";

const LocationsPage: React.FC = () => {
  return (
    <Container maxWidth="lg">
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <LoginPage />
        </Grid>
      </Grid>
    </Container>
  );
};

export default LocationsPage;
