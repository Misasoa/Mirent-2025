import react from "react";
import { Container, Grid } from "@mui/material";
import PaiementPage from "../../Components/paiement/paiement";
const PaiementPages: React.FC = () => {
  return (
    <Container maxWidth="lg">
      <Grid>
        <PaiementPage />
      </Grid>
    </Container>
  );
};
export default PaiementPages;
