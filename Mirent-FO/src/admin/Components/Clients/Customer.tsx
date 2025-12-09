import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../../../redux/store";
import { Edit, Delete } from "@mui/icons-material";
import {
  fetchClients,
  addClient,
  updateClient,
  deleteClient,
} from "../../../redux/features/clients/customersSlice";

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Box,
  Avatar,
  Stack,
  Grid,
  InputAdornment,
  IconButton,
  Snackbar,
  Alert,
  TablePagination,
} from "@mui/material";
import { PhotoCamera, Person, Email, Phone } from "@mui/icons-material";

// Définition du type Customer
interface Customer {
  id: number;
  lastName: string;
  email: string;
  phone: string;
  logo: string;
  contracts?: any[]; // Add the contracts property as optional
}

const CustomerManagement: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { clients, loading, error } = useSelector(
    (state: RootState) => state.customer
  );

  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null
  );
  const [form, setForm] = useState({
    lastName: "",
    email: "",
    phone: "",
    logo: "",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [searchClicked, setSearchClicked] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [page, setPage] = useState(0); // État pour la page actuelle
  const [rowsPerPage, setRowsPerPage] = useState(5); // État pour le nombre de lignes par page

  useEffect(() => {
    dispatch(fetchClients());
  }, [dispatch]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  /**Fonction pour supprimer un client */

  const handleDeleteCustomer = (id: number) => {
    dispatch(deleteClient(id));
    setSnackbarMessage("Client supprimé avec succès !");
    setSnackbarOpen(true);
  };

  const handleOpenDialog = (customer?: Customer) => {
    if (customer) {
      setSelectedCustomer(customer);
      setForm(customer);
      setEditMode(true);
    } else {
      setSelectedCustomer(null);
      setForm({ lastName: "", email: "", phone: "", logo: "" });
      setEditMode(false);
    }
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
    setSelectedCustomer(null);
    setEditMode(false);
    setForm({ lastName: "", email: "", phone: "", logo: "" });
  };

  const handleSearch = () => {
    setSearchClicked(true);
    setPage(0); // Réinitialiser à la première page après une recherche
  };

  // Filtrer les clients en fonction du terme de recherche
  const filteredClients = clients.filter(
    (customer) =>
      customer.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone.includes(searchTerm)
  );

  // Pagination des clients filtrés
  const paginatedClients = filteredClients.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  // Gestion du changement de page
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  // Gestion du changement du nombre de lignes par page
  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Réinitialiser à la première page
  };

  {
    /*Gestion d'erreur*/
  }

  const [formErrors, setFormErrors] = useState({
    lastName: "",
    email: "",
    phone: "",
  });

  const validateForm = () => {
    let isValid = true;
    const errors = { lastName: "", email: "", phone: "" };

    if (!form.lastName.trim()) {
      errors.lastName = "Nom requis.";
      isValid = false;
    }

    if (!form.email.trim()) {
      errors.email = "Email requis.";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      errors.email = "Email invalide.";
      isValid = false;
    }

    if (!form.phone.trim()) {
      errors.phone = "Téléphone requis.";
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleAddOrEditCustomer = async () => {
    if (!validateForm()) {
      return; // Stop if form is invalid
    }

    try {
      if (editMode && selectedCustomer) {
        console.log("Modification du client :", selectedCustomer.id, form);

        await dispatch(
          updateClient({
            id: selectedCustomer.id,
            ...form,
            contracts: selectedCustomer.contracts || [],
          })
        );
        setSnackbarMessage("Client modifié avec succès !");
      } else {
        console.log("Ajout d'un nouveau client :", form);

        await dispatch(addClient(form));
        setSnackbarMessage("Client ajouté avec succès !");
      }

      dispatch(fetchClients()); // Rafraîchir la liste des clients
      handleCloseDialog();
      setSnackbarOpen(true);
    } catch (error) {
      console.error(
        "Erreur lors de l'ajout ou de la modification du client :",
        error
      );
      setSnackbarMessage("Une erreur est survenue !");
      setSnackbarOpen(true);
    }
  };

  return (
    <Box sx={{ maxWidth: "95%", margin: "auto", marginTop: 4 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          mb: 2,
          alignItems: "center",
        }}
      >
        <Typography>Gérer vos clients dans votre agence</Typography>

        <Box sx={{ display: "flex", gap: 1 }}>
          <TextField
            label="Rechercher un client..."
            variant="outlined"
            size="small"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ width: "250px" }}
          />
          <Button variant="contained" color="secondary" onClick={handleSearch}>
            Rechercher
          </Button>

          <Button
            variant="contained"
            color="primary"
            onClick={() => handleOpenDialog()}
          >
            Ajouter
          </Button>
        </Box>
      </Box>

      <Dialog open={open} onClose={handleCloseDialog} fullWidth maxWidth="sm">
        <DialogTitle sx={{ fontWeight: "bold", textAlign: "center" }}>
          {editMode ? "Modifier Client" : "Ajouter Client"}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} justifyContent="center">
            <Grid item xs={12} sx={{ textAlign: "center" }}>
              <Stack direction="column" alignItems="center" spacing={1}>
                <Avatar src={form.logo} sx={{ width: 80, height: 80 }} />
                <IconButton
                  color="primary"
                  component="label"
                  sx={{ bgcolor: "primary.light", p: 1, borderRadius: 2 }}
                >
                  <PhotoCamera />
                  <input
                    hidden
                    type="file"
                    onChange={(e) => {
                      const file = (e.target as HTMLInputElement).files?.[0];
                      if (file) {
                        setForm({ ...form, logo: URL.createObjectURL(file) });
                      }
                    }}
                  />
                </IconButton>
              </Stack>
            </Grid>

            <Grid item xs={12}>
              <TextField
                name="lastName"
                label="Nom"
                type="text"
                error={!!formErrors.lastName} // Indicate error
                helperText={formErrors.lastName}
                fullWidth
                value={form.lastName}
                onChange={handleInputChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Person />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                name="email"
                label="Email"
                type="email"
                error={!!formErrors.email} // Indicate error
                helperText={formErrors.email}
                fullWidth
                value={form.email}
                onChange={handleInputChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="phone"
                label="Téléphone"
                type="text"
                error={!!formErrors.phone}
                helperText={formErrors.phone}
                fullWidth
                value={form.phone}
                onChange={handleInputChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Phone />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleCloseDialog} color="error" variant="outlined">
            Annuler
          </Button>
          <Button
            onClick={handleAddOrEditCustomer}
            color="primary"
            variant="contained"
          >
            {editMode ? "Modifier" : "Ajouter"}
          </Button>
        </DialogActions>
      </Dialog>

      {loading && <Typography align="center">Chargement...</Typography>}
      {error && (
        <Typography align="center" color="error">
          {error}
        </Typography>
      )}

      <TableContainer component={Paper} sx={{ overflowX: "auto", mt: 2 }}>
        <Table>
          <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
            <TableRow>
              <TableCell
                sx={{ fontWeight: "bold", borderBottom: "2px solid #ddd" }}
              >
                Logo
              </TableCell>
              <TableCell
                sx={{ fontWeight: "bold", borderBottom: "2px solid #ddd" }}
              >
                Nom
              </TableCell>
              <TableCell
                sx={{ fontWeight: "bold", borderBottom: "2px solid #ddd" }}
              >
                Email
              </TableCell>
              <TableCell
                sx={{ fontWeight: "bold", borderBottom: "2px solid #ddd" }}
              >
                Téléphone
              </TableCell>
              <TableCell
                sx={{ fontWeight: "bold", borderBottom: "2px solid #ddd" }}
              >
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedClients.length > 0 ? (
              paginatedClients.map((customer) => (
                <TableRow
                  key={customer.id}
                  sx={{ "&:hover": { backgroundColor: "#f9f9f9" } }}
                >
                  <TableCell sx={{ borderBottom: "1px solid #ddd" }}>
                    <Avatar
                      src={customer.logo}
                      sx={{ width: 40, height: 40 }}
                    />
                  </TableCell>
                  <TableCell sx={{ borderBottom: "1px solid #ddd" }}>
                    {customer.lastName}
                  </TableCell>
                  <TableCell sx={{ borderBottom: "1px solid #ddd" }}>
                    {customer.email}
                  </TableCell>
                  <TableCell sx={{ borderBottom: "1px solid #ddd" }}>
                    {customer.phone}
                  </TableCell>
                  <TableCell sx={{ borderBottom: "1px solid #ddd" }}>
                    <Stack direction="row" spacing={1}>
                      <IconButton
                        onClick={() => handleOpenDialog(customer)}
                        color="primary"
                      >
                        <Edit />
                      </IconButton>
                      <IconButton
                        onClick={() => handleDeleteCustomer(customer.id)}
                        color="error"
                      >
                        <Delete />
                      </IconButton>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={5}
                  align="center"
                  sx={{ borderBottom: "1px solid #ddd" }}
                >
                  Aucun client trouvé.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={filteredClients.length} // Nombre total de clients filtrés
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        sx={{ borderTop: "1px solid #ddd" }}
      />

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity="success">
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CustomerManagement;
