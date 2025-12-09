import { Container, Grid } from "@mui/material";

import Accueil from "../../../admin/Components/acceuil/Accueil";

const Home: React.FC = () => {
  return (
    <Container maxWidth="lg">
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Accueil />
        </Grid>
      </Grid>
    </Container>
  );
};

export default Home;
