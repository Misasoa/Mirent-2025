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

    </Container>
  );
};
export default ClientDetailPage;
