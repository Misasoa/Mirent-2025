import { Container, Grid } from "@mui/material";
import ClienDetailtList from "../../Components/Clients/ClientDetailList";
import ContractDetails from "../../Components/Clients/ClientsDetail";

const ClientDetailPage: React.FC = () => {
  return (
    <Container maxWidth="lg">
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <ClienDetailtList />
        </Grid>
      </Grid>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <ContractDetails clientId={44} />{" "}
          {/* Remplacez 1 par l'ID du client sélectionné */}
        </Grid>
      </Grid>
    </Container>
  );
};
export default ClientDetailPage;
