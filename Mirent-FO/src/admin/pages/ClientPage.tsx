import React from "react";
import ClientsDetail from "../Components/Clients/ClientsDetail";
import ClientDetailList from "../Components/Clients/ClientDetailList";
import CustomerPage from "../Components/Clients/Customer";

const ClientsPage: React.FC = () => {
  return (
    <div>
      <h1>Détails d'un client</h1>
      <ClientsDetail />
      <ClientDetailList />
    </div>
  );
};

export default ClientsPage;
