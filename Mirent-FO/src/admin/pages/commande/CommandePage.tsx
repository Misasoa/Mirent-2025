import React from "react";
import { Container, Grid } from "@mui/material";
import Commande from "../../Components/Commandes/BonDeCommandeManagement";

const CommandePage: React.FC = () => {
  return (
    <Container maxWidth="lg">
      <Commande />
    </Container>
  );
};
export default CommandePage;
