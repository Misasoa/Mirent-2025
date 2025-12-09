import { Container, Grid } from "@mui/material";
import CustomerList from "../../../admin/Components/Clients/CustomerList";

const ClientPage: React.FC = () => {
  return (
    <Container maxWidth="lg">
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <CustomerList />
        </Grid>
      </Grid>
    </Container>
  );
};

export default ClientPage;
