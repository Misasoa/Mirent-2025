import { Container, Grid } from "@mui/material";
import VehicleTypes from "../../Components/types/type";

const Types: React.FC = () => {
  return (
    <Container maxWidth="lg">
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <VehicleTypes />
        </Grid>
      </Grid>
    </Container>
  );
};

export default Types;
