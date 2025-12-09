import { Container, Typography } from "@mui/material";
import ContractList from "../../../admin/Components/contrats/contratList";

const ContratPage: React.FC = () => {
  return (
    <Container>
      <Typography variant="h4" component="h1">
        Suivi des Contrats
      </Typography>
      <ContractList />
    </Container>
  );
};

export default ContratPage;
