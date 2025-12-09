import { Container, Grid } from "@mui/material";
import react from "react";
import FacturePage from "../../Components/facture/factureManagement";

const FacturePages: React.FC = () => {
  return (
    <Container maxWidth="lg">
      <Grid>
        <FacturePage />
      </Grid>
    </Container>
  );
};
export default FacturePages;
