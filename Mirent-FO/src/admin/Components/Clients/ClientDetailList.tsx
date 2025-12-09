// src/admin/Components/Clients/ClientsList.tsx
import React, { useState, useEffect, useCallback } from "react"; // Importez useCallback
import axios from "axios";
import {
  Typography,
  Paper,
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  CircularProgress,
  Alert,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

// Assurez-vous que le chemin est correct.
// Renommé de ContractDetails à ClientsDetail pour correspondre à votre usage
import ClientsDetail from "./ClientsDetail";

interface Client {
  id: number;
  lastName: string;
  firstName: string;
  email: string;
  phone: string;
}

const ClientsList: React.FC = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loadingClients, setLoadingClients] = useState<boolean>(true);
  const [errorClients, setErrorClients] = useState<string | null>(null);

  const [selectedClientId, setSelectedClientId] = useState<number | null>(null);
  const [selectedClientName, setSelectedClientName] = useState<string>("");
  const [openDialog, setOpenDialog] = useState<boolean>(false);

  // États pour gérer les feedbacks du composant ClientsDetail
  const [isDetailLoading, setIsDetailLoading] = useState(false);
  const [detailErrorMessage, setDetailErrorMessage] = useState<string | null>(
    null
  );
  const [hasNoDetails, setHasNoDetails] = useState(false);

  // États pour le Snackbar de notification
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<
    "success" | "error" | "info" | "warning"
  >("info");

  useEffect(() => {
    const fetchClients = async () => {
      setLoadingClients(true);
      setErrorClients(null);
      try {
        const response = await axios.get("http://localhost:3000/clients");
        setClients(response.data);
      } catch (error) {
        console.error("Erreur lors du chargement des clients:", error);
        setErrorClients("Impossible de charger la liste des clients.");
      } finally {
        setLoadingClients(false);
      }
    };
    fetchClients();
  }, []);

  const handleOpenDialog = (client: Client) => {
    setDetailErrorMessage(null);
    setHasNoDetails(false);
    setIsDetailLoading(true);
    setSelectedClientId(client.id); // C'est la ligne qui déclenche le useEffect de ClientsDetail
    setSelectedClientName(`${client.lastName} ${client.firstName || ""}`);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    // Optionnel : Réinitialiser selectedClientId à null ici aussi
    // pour s'assurer que ClientsDetail n'est plus monté.
    // Cependant, votre condition de rendu `openDialog` est suffisante.
    // setSelectedClientId(null);
    setSelectedClientName("");
    setIsDetailLoading(false);
    setDetailErrorMessage(null);
    setHasNoDetails(false);
  };

  // Ces deux devraient être stables avec un tableau de dépendances vide
  const handleDetailLoadingChange = useCallback((isLoading: boolean) => {
    setIsDetailLoading(isLoading);
  }, []); // PAS de dépendances car setIsDetailLoading est stable

  const handleDetailError = useCallback(
    (errorMessage: string | null) => {
      setDetailErrorMessage(errorMessage);
      if (errorMessage) {
        setSnackbarMessage(errorMessage);
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      }
    },
    [] // PAS de dépendances car setDetailErrorMessage, setSnackbarMessage, etc. sont stables
  );

  // Celle-ci peut avoir des dépendances si le message qu'elle génère dépend de l'état
  // Dans ClientsList.tsx
  const handleNoDetails = useCallback(
    (noDetails: boolean) => {
      setHasNoDetails(noDetails);
      if (noDetails) {
        // Simplifiez la condition ici
        setSnackbarMessage(`Aucun contrat trouvé pour ${selectedClientName}.`);
        setSnackbarSeverity("info");
        setSnackbarOpen(true);
      }
    },
    [selectedClientName] // Gardez selectedClientName si le message en dépend
  );

  const handleCloseSnackbar = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };

  if (loadingClients) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Chargement des clients...</Typography>
      </Box>
    );
  }

  if (errorClients) {
    return (
      <Alert severity="error" sx={{ m: 3 }}>
        {errorClients}
      </Alert>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Details pour le contrat d'un Client
      </Typography>

      <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
        <TableContainer>
          <Table aria-label="liste des clients">
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Nom</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Téléphone</TableCell>
                <TableCell align="right">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {clients.map((client) => (
                <TableRow key={client.id}>
                  <TableCell>{client.id}</TableCell>
                  <TableCell>
                    {client.lastName} {client.firstName}
                  </TableCell>
                  <TableCell>{client.email}</TableCell>
                  <TableCell>{client.phone}</TableCell>
                  <TableCell align="right">
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => handleOpenDialog(client)}
                    >
                      Voir Contrats
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>
          {selectedClientName
            ? `Détails des Contrats pour ${selectedClientName}`
            : "Détails des Contrats"}
          <IconButton
            aria-label="close"
            onClick={handleCloseDialog}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          {/* Affiche la roue de chargement SI c'est en cours ET qu'il n'y a pas d'erreur */}
          {isDetailLoading && !detailErrorMessage && (
            <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
              <CircularProgress />
              <Typography sx={{ ml: 2 }}>Chargement des contrats...</Typography>
            </Box>
          )}
          {/* Affiche l'erreur SI une erreur est présente */}
          {detailErrorMessage && (
            <Alert severity="error" sx={{ my: 2 }}>
              {detailErrorMessage}
            </Alert>
          )}
          {/* Affiche "Aucun contrat" SI pas de chargement, pas d'erreur, ET hasNoDetails est true */}
          {!isDetailLoading && hasNoDetails && !detailErrorMessage && (
            <Typography
              variant="body1"
              align="center"
              sx={{ mt: 2, color: "text.secondary" }}
            >
              Aucun contrat trouvé pour ce client.
            </Typography>
          )}
          {/* Rendre ClientsDetail UNIQUEMENT si un client est sélectionné ET pas de chargement, pas d'erreur, ET il y a des détails (pas `hasNoDetails`) */}

          {selectedClientId &&
            !detailErrorMessage &&
            !hasNoDetails && ( // <-- Cette condition
              <ClientsDetail
                clientId={selectedClientId}
                onLoadingChange={handleDetailLoadingChange}
                onError={handleDetailError}
                onNoContracts={handleNoDetails}
              />
            )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Fermer</Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ClientsList;
