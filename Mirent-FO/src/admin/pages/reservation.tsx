import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Select,
  MenuItem,
  Typography,
  Box,
} from "@mui/material";

interface Reservation {
  id: number;
  client: string;
  vehicle: string;
  startDate: string;
  endDate: string;
  status: string;
}

const Reservations: React.FC = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);

  useEffect(() => {
    fetch("http://localhost:3000/reservations")
      .then((res) => res.json())
      .then((data) => setReservations(data));
  }, []);

  const updateStatus = async (id: number, status: string) => {
    await fetch(`http://localhost:3001/reservations/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });

    setReservations(
      reservations.map((r) => (r.id === id ? { ...r, status } : r))
    );
  };

  return (
    <Box sx={{ maxWidth: "90%", margin: "auto", marginTop: 4 }}>
      <Typography variant="h5" align="center">
        Suivi des Réservations
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Client</TableCell>
              <TableCell>Véhicule</TableCell>
              <TableCell>Date de début</TableCell>
              <TableCell>Date de fin</TableCell>
              <TableCell>Statut</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {reservations.map((r) => (
              <TableRow key={r.id}>
                <TableCell>{r.client}</TableCell>
                <TableCell>{r.vehicle}</TableCell>
                <TableCell>{r.startDate}</TableCell>
                <TableCell>{r.endDate}</TableCell>
                <TableCell>
                  <Select
                    value={r.status}
                    onChange={(e) => updateStatus(r.id, e.target.value)}
                  >
                    <MenuItem value="En attente">En attente</MenuItem>
                    <MenuItem value="Confirmée">Confirmée</MenuItem>
                    <MenuItem value="Annulée">Annulée</MenuItem>
                  </Select>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Reservations;
