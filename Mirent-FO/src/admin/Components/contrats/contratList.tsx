import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  List,
  ListItem,
  ListItemText,
  Typography,
  CircularProgress,
} from "@mui/material";
import { Contract } from "../../../types/contrat";
import { fetchContracts } from "../../../redux/features/contrat/contraAction";
import { useAppDispatch } from "../../../hooks";

const ContractList: React.FC = () => {
  const dispatch = useAppDispatch();
  const contracts = useSelector((state: any) => state.contracts);
  const loading = useSelector((state: any) => state.loading);
  const error = useSelector((state: any) => state.error);

  useEffect(() => {
    dispatch(fetchContracts());
  }, [dispatch]);

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <List>
      {contracts.map((contract: Contract) => (
        <ListItem key={contract.id}>
          <ListItemText
            primary={contract.vehicle}
            secondary={`Du ${contract.startDate} au ${contract.endDate}`}
          />
        </ListItem>
      ))}
    </List>
  );
};

export default ContractList;
