import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../../../redux/store";
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
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  Typography,
  Box,
  Avatar,
  IconButton,
  Snackbar,
  Alert,
  TablePagination,
  TableSortLabel,
  Tooltip,
  InputAdornment,
  Stack,
  Grid,
  Button,
  Card,
  CardContent,
  CardActions,
  useMediaQuery,
  useTheme,
  styled,
  Fade,
  Collapse,
  Toolbar,
  List,
  ListItem,
  ListItemText,
  Checkbox,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import {
  Edit,
  Delete,
  Add,
  SearchOutlined,
  Person,
  Email,
  Phone,
  PhotoCamera,
  FilterList,
  FileDownload,
  History,
  Group,
  PersonAdd,
} from "@mui/icons-material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Papa from "papaparse";

// Thème personnalisé
const theme = createTheme({
  palette: {
    primary: {
      main: "#3b82f6",
    },
    secondary: {
      main: "#ef4444",
    },
    background: {
      default: "#f9fafb",
    },
    text: {
      primary: "#1f2937",
      secondary: "#6b7280",
    },
  },
  typography: {
    fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
    h5: {
      fontWeight: 600,
      color: "#1f2937",
    },
    body1: {
      fontSize: "0.9rem",
      color: "#1f2937",
    },
    body2: {
      fontSize: "0.85rem",
      color: "#6b7280",
    },
  },
  components: {
    MuiTableCell: {
      styleOverrides: {
        root: {
          padding: "12px 16px",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: "8px",
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: "8px",
            "& fieldset": {
              borderColor: "#d1d5db",
            },
            "&:hover fieldset": {
              borderColor: "#9ca3af",
            },
            "&.Mui-focused fieldset": {
              borderColor: "#3b82f6",
            },
          },
        },
      },
    },
  },
});

// Styles personnalisés (alignés avec LocationList.tsx)
const PrimaryButton = styled(Button)(({ theme }) => ({
  backgroundColor: "#3b82f6",
  color: theme.palette.common.white,
  padding: "8px 16px",
  borderRadius: "8px",
  textTransform: "none",
  fontWeight: 500,
  "&:hover": {
    backgroundColor: "#2563eb",
    transform: "scale(1.02)",
    transition: "all 0.3s ease",
  },
  "&.Mui-disabled": {
    backgroundColor: "#d1d5db",
    color: "#6b7280",
  },
}));

const DeleteButton = styled(Button)(({ theme }) => ({
  backgroundColor: "#ef4444",
  color: theme.palette.common.white,
  padding: "8px 16px",
  borderRadius: "8px",
  textTransform: "none",
  fontWeight: 500,
  "&:hover": {
    backgroundColor: "#dc2626",
    transform: "scale(1.02)",
    transition: "all 0.3s ease",
  },
  "&.Mui-disabled": {
    backgroundColor: "#d1d5db",
    color: "#6b7280",
  },
}));

const CancelButton = styled(Button)(({ theme }) => ({
  color: "#6b7280",
  borderColor: "#d1d5db",
  padding: "8px 16px",
  borderRadius: "8px",
  textTransform: "none",
  fontWeight: 500,
  "&:hover": {
    borderColor: "#9ca3af",
    backgroundColor: "#f3f4f6",
    transform: "scale(1.02)",
    transition: "all 0.3s ease",
  },
}));

const SearchField = styled(TextField)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    borderRadius: "12px",
    backgroundColor: "#fff",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
    "& fieldset": {
      borderColor: "#d1d5db",
    },
    "&:hover fieldset": {
      borderColor: "#9ca3af",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#3b82f6",
    },
  },
  "& .MuiInputBase-input": {
    fontSize: "0.9rem",
    color: "#1f2937",
  },
}));

const FilterField = styled(TextField)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    borderRadius: "8px",
    "& fieldset": {
      borderColor: "#d1d5db",
    },
    "&:hover fieldset": {
      borderColor: "#9ca3af",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#3b82f6",
    },
  },
  "& .MuiInputBase-input": {
    fontSize: "0.9rem",
    color: "#1f2937",
  },
}));

const FormField = styled(TextField)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    borderRadius: "8px",
    backgroundColor: "#fff",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
    "& fieldset": {
      borderColor: "#d1d5db",
    },
    "&:hover fieldset": {
      borderColor: "#9ca3af",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#3b82f6",
    },
  },
  "& .MuiInputLabel-root": {
    color: "#6b7280",
    fontSize: "0.9rem",
  },
  "& .MuiInputLabel-root.Mui-focused": {
    color: "#3b82f6",
  },
  "& .MuiInputBase-input": {
    fontSize: "0.9rem",
    color: "#1f2937",
  },
}));

const ErrorText = styled(Typography)(({ theme }) => ({
  color: "#ef4444",
  fontSize: "0.8rem",
  marginTop: "4px",
  marginLeft: "14px",
}));

interface Customer {
  id: number;
  lastName: string;
  email: string;
  phone: string;
  logo: string;
  createdAt?: string;
}

interface ActionLog {
  id: number;
  description: string;
  timestamp: string;
}

const CustomerManagement: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { clients, loading, error } = useSelector(
    (state: RootState) => state.customer
  );
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm")); // Jusqu'à 600px

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
  const [errors, setErrors] = useState<{
    lastName?: string;
    email?: string;
    phone?: string;
  }>({});
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [order, setOrder] = useState<"asc" | "desc">("asc");
  const [orderBy, setOrderBy] = useState<keyof Customer>("lastName");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const [emailDomainFilter, setEmailDomainFilter] = useState("");
  const [phonePrefixFilter, setPhonePrefixFilter] = useState("");
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [clientToDelete, setClientToDelete] = useState<Customer | null>(null);
  const [lastDeletedClient, setLastDeletedClient] = useState<Customer | null>(
    null
  );
  const [actionHistory, setActionHistory] = useState<ActionLog[]>([]);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [confirmClearHistoryOpen, setConfirmClearHistoryOpen] = useState(false);
  const [historySearchTerm, setHistorySearchTerm] = useState("");
  const [historyFilterType, setHistoryFilterType] = useState<string>("Tous");
  const [selectedClients, setSelectedClients] = useState<number[]>([]);
  const [confirmDeleteSelectedOpen, setConfirmDeleteSelectedOpen] =
    useState(false);

  // Charger l'historique depuis le localStorage au montage
  useEffect(() => {
    const savedHistory = localStorage.getItem("customerActionHistory");
    if (savedHistory) {
      setActionHistory(JSON.parse(savedHistory));
    }
  }, []);

  // Sauvegarder l'historique dans le localStorage à chaque modification
  useEffect(() => {
    localStorage.setItem(
      "customerActionHistory",
      JSON.stringify(actionHistory)
    );
  }, [actionHistory]);

  useEffect(() => {
    dispatch(fetchClients());
  }, [dispatch]);

  const logAction = (description: string) => {
    const timestamp = new Date().toLocaleString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
    setActionHistory((prev) => [
      { id: Date.now(), description, timestamp },
      ...prev,
    ]);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    validateField(name, value);
  };

  const validateField = (name: string, value: string) => {
    const newErrors = { ...errors };
    if (name === "lastName") {
      if (!value || value.trim() === "") {
        newErrors.lastName = "Le nom est requis";
      } else {
        delete newErrors.lastName;
      }
    } else if (name === "email") {
      if (!value || value.trim() === "") {
        newErrors.email = "L'email est requis";
      } else if (!/\S+@\S+\.\S+/.test(value)) {
        newErrors.email = "Email invalide";
      } else {
        const emailExists = clients.some(
          (client) =>
            client.email.toLowerCase() === value.toLowerCase() &&
            (!selectedCustomer || client.id !== selectedCustomer.id)
        );
        if (emailExists) {
          newErrors.email = "Cet email est déjà utilisé";
        } else {
          delete newErrors.email;
        }
      }
    } else if (name === "phone") {
      if (!value || value.trim() === "") {
        newErrors.phone = "Le téléphone est requis";
      } else if (!/^\+\d{9,15}$/.test(value)) {
        newErrors.phone =
          'Le numéro doit commencer par "+" suivi de 9 à 15 chiffres';
      } else {
        delete newErrors.phone;
      }
    }
    setErrors(newErrors);
  };

  const validateForm = () => {
    const newErrors: { lastName?: string; email?: string; phone?: string } = {};
    if (!form.lastName || form.lastName.trim() === "") {
      newErrors.lastName = "Le nom est requis";
    }
    if (!form.email || form.email.trim() === "") {
      newErrors.email = "L'email est requis";
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = "Email invalide";
    } else {
      const emailExists = clients.some(
        (client) =>
          client.email.toLowerCase() === form.email.toLowerCase() &&
          (!selectedCustomer || client.id !== selectedCustomer.id)
      );
      if (emailExists) {
        newErrors.email = "Cet email est déjà utilisé";
      }
    }
    if (!form.phone || form.phone.trim() === "") {
      newErrors.phone = "Le téléphone est requis";
    } else if (!/^\+\d{9,15}$/.test(form.phone)) {
      newErrors.phone =
        'Le numéro doit commencer par "+" suivi de 9 à 15 chiffres';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const resetLastName = () => {
    setForm({ ...form, lastName: "" });
    validateField("lastName", "");
  };

  const resetEmail = () => {
    setForm({ ...form, email: "" });
    validateField("email", "");
  };

  const resetPhone = () => {
    setForm({ ...form, phone: "" });
    validateField("phone", "");
  };

  const openConfirmDelete = (client: Customer) => {
    setClientToDelete(client);
    setConfirmDeleteOpen(true);
  };

  const handleConfirmDelete = () => {
    if (clientToDelete) {
      setLastDeletedClient(clientToDelete);
      dispatch(deleteClient(clientToDelete.id));
      logAction(`Client ${clientToDelete.lastName} supprimé`);
      setSnackbarMessage("Client supprimé avec succès !");
      setSnackbarOpen(true);
      setSelectedClients((prev) =>
        prev.filter((id) => id !== clientToDelete.id)
      );
    }
    setConfirmDeleteOpen(false);
    setClientToDelete(null);
  };

  const handleUndoDelete = () => {
    if (lastDeletedClient) {
      dispatch(addClient(lastDeletedClient));
      logAction(`Client ${lastDeletedClient.lastName} restauré`);
      dispatch(fetchClients());
      setSnackbarMessage("Client restauré avec succès !");
      setLastDeletedClient(null);
    }
    setSnackbarOpen(false);
  };

  const handleCloseConfirmDelete = () => {
    setConfirmDeleteOpen(false);
    setClientToDelete(null);
  };

  const openConfirmClearHistory = () => {
    setConfirmClearHistoryOpen(true);
  };

  const handleClearHistory = () => {
    setActionHistory([]);
    localStorage.removeItem("customerActionHistory");
    setConfirmClearHistoryOpen(false);
    setSnackbarMessage("Historique effacé avec succès !");
    setSnackbarOpen(true);
  };

  const handleCloseConfirmClearHistory = () => {
    setConfirmClearHistoryOpen(false);
  };

  const handleOpenDialog = (customer?: Customer) => {
    if (customer) {
      setSelectedCustomer(customer);
      setForm(customer);
      setEditMode(true);
      setErrors({});
    } else {
      setSelectedCustomer(null);
      setForm({ lastName: "", email: "", phone: "", logo: "" });
      setEditMode(false);
      setErrors({});
    }
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
    setSelectedCustomer(null);
    setEditMode(false);
    setForm({ lastName: "", email: "", phone: "", logo: "" });
    setErrors({});
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setPage(0);
  };

  const filteredClients = clients.filter((client) => {
    const matchesSearch =
      client.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.phone.includes(searchTerm);
    const matchesEmailDomain = emailDomainFilter
      ? client.email.toLowerCase().includes(emailDomainFilter.toLowerCase())
      : true;
    const matchesPhonePrefix = phonePrefixFilter
      ? client.phone.startsWith(phonePrefixFilter)
      : true;
    return matchesSearch && matchesEmailDomain && matchesPhonePrefix;
  });

  const paginatedClients = filteredClients.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleRequestSort = (property: keyof Customer) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const sortedClients = React.useMemo(() => {
    return [...paginatedClients].sort((a, b) => {
      const valA = a[orderBy] || "";
      const valB = b[orderBy] || "";

      if (order === "asc") {
        return valA < valB ? -1 : 1;
      } else {
        return valA > valB ? -1 : 1;
      }
    });
  }, [paginatedClients, order, orderBy]);

  const handleAddOrEditCustomer = async () => {
    if (!validateForm()) {
      return;
    }
    try {
      if (editMode && selectedCustomer) {
        await dispatch(updateClient({ id: selectedCustomer.id, ...form }));
        logAction(`Client ${form.lastName} modifié`);
        setSnackbarMessage("Client modifié avec succès !");
      } else {
        await dispatch(addClient(form));
        logAction(`Client ${form.lastName} ajouté`);
        setSnackbarMessage("Client ajouté avec succès !");
      }
      dispatch(fetchClients());
      handleCloseDialog();
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Erreur lors de l'ajout/modification du client :", error);
      setSnackbarMessage("Une erreur s'est produite !");
      setSnackbarOpen(true);
    }
  };

  // Export CSV
  const exportToCSV = () => {
    const csvData = sortedClients.map((client) => ({
      Nom: client.lastName,
      Email: client.email,
      Téléphone: client.phone,
      Logo: client.logo || "N/A",
    }));
    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", "clients.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Gestion de la sélection des clients
  const handleSelectAllClients = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.checked) {
      const newSelected = paginatedClients.map((client) => client.id);
      setSelectedClients(newSelected);
    } else {
      setSelectedClients([]);
    }
  };

  const handleSelectClient = (id: number) => {
    setSelectedClients((prev) =>
      prev.includes(id)
        ? prev.filter((clientId) => clientId !== id)
        : [...prev, id]
    );
  };

  const openConfirmDeleteSelected = () => {
    setConfirmDeleteSelectedOpen(true);
  };

  const handleConfirmDeleteSelected = () => {
    selectedClients.forEach((id) => {
      const client = clients.find((c) => c.id === id);
      if (client) {
        dispatch(deleteClient(id));
        logAction(`Client ${client.lastName} supprimé`);
      }
    });
    setSelectedClients([]);
    setConfirmDeleteSelectedOpen(false);
    setSnackbarMessage(
      `${selectedClients.length} client(s) supprimé(s) avec succès !`
    );
    setSnackbarOpen(true);
  };

  const handleCloseConfirmDeleteSelected = () => {
    setConfirmDeleteSelectedOpen(false);
  };

  // Filtrage de l'historique
  const filteredHistory = actionHistory.filter((action) => {
    const matchesSearch =
      action.description
        .toLowerCase()
        .includes(historySearchTerm.toLowerCase()) ||
      action.timestamp.toLowerCase().includes(historySearchTerm.toLowerCase());
    const matchesType =
      historyFilterType === "Tous" ||
      (historyFilterType === "Ajout" &&
        action.description.includes("ajouté")) ||
      (historyFilterType === "Modification" &&
        action.description.includes("modifié")) ||
      (historyFilterType === "Suppression" &&
        action.description.includes("supprimé")) ||
      (historyFilterType === "Restauration" &&
        action.description.includes("restauré"));
    return matchesSearch && matchesType;
  });

  // Calcul des statistiques
  const stats = React.useMemo(() => {
    const total = clients.length;
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    const newClients = clients.filter((client) => {
      if (!client.createdAt) return false;
      const createdDate = new Date(client.createdAt);
      return (
        createdDate.getMonth() === currentMonth &&
        createdDate.getFullYear() === currentYear
      );
    }).length;

    return [
      {
        title: "Total Clients",
        value: total,
        icon: <Group fontSize="large" color="primary" />,
        bg: "#e3f2fd",
      },
      {
        title: "Nouveaux Clients (Mois)",
        value: newClients,
        icon: <PersonAdd fontSize="large" color="success" />,
        bg: "#e8f5e9",
      },
    ];
  }, [clients]);

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ maxWidth: "95%", margin: "auto", mt: 4, mb: 8 }}>
        {/* Header */}
        <Grid
          container
          spacing={3}
          sx={{
            padding: isMobile ? 2 : 3,
            backgroundColor: "#f9fafb",
            minHeight: "100vh",
          }}
        >
          <Grid item xs={12}>
            <Typography
              variant="h4"
              sx={{ fontWeight: 600, color: "#1f2937", marginBottom: 1 }}
            >
              Gestion des Clients
            </Typography>
            <Typography
              variant="body1"
              sx={{ fontSize: "0.9rem", color: "#6b7280" }}
            >
              Gérer les clients : ajouter, modifier ou supprimer des clients.
            </Typography>
          </Grid>

          {/* Cartes de statistiques */}
          <Grid item xs={12}>
            <Grid container spacing={2} mb={1}>
              {stats.map((stat, index) => (
                <Grid item xs={12} sm={6} md={3} key={index}>
                  <Card
                    sx={{
                      backgroundColor: stat.bg,
                      borderRadius: 3,
                      boxShadow: 3,
                      transition: "0.3s",
                      "&:hover": { transform: "translateY(-5px)", boxShadow: 6 },
                      height: "100%",
                    }}
                  >
                    <CardContent>
                      <Box display="flex" alignItems="center" gap={2}>
                        {stat.icon}
                        <Box>
                          <Typography variant="subtitle2" color="text.secondary">
                            {stat.title}
                          </Typography>
                          <Typography variant="h5" fontWeight="bold">
                            {stat.value}
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Grid>

          <Grid item xs={12}>
            <Toolbar
              sx={{
                justifyContent: "space-between",
                flexDirection: isMobile ? "column" : "row",
                gap: isMobile ? 2 : 0,
                padding: isMobile ? 1 : 0,
                position: "sticky",
                top: "64px",
                backgroundColor: "#f9fafb",
                zIndex: 2,
                mb: 2,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  gap: 1,
                  flexWrap: "wrap",
                  width: isMobile ? "100%" : "auto",
                  justifyContent: isMobile ? "center" : "flex-start",
                }}
              >
                <SearchField
                  placeholder="Rechercher par nom ou email..."
                  variant="outlined"
                  size="small"
                  value={searchTerm}
                  onChange={handleSearch}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchOutlined sx={{ color: "text.secondary" }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ width: isMobile ? "100%" : "300px" }}
                />
                <Button
                  variant="outlined"
                  startIcon={<FilterList />}
                  onClick={() => setFilterOpen(!filterOpen)}
                  sx={{
                    borderColor: "#d1d5db",
                    color: "#1f2937",
                    borderRadius: "8px",
                    textTransform: "none",
                    "&:hover": {
                      borderColor: "#9ca3af",
                      backgroundColor: "#f3f4f6",
                    },
                  }}
                >
                  Filtres
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<History />}
                  onClick={() => setHistoryOpen(!historyOpen)}
                  sx={{
                    borderColor: "#d1d5db",
                    color: "#1f2937",
                    borderRadius: "8px",
                    textTransform: "none",
                    "&:hover": {
                      borderColor: "#9ca3af",
                      backgroundColor: "#f3f4f6",
                    },
                  }}
                >
                  Historique
                </Button>
              </Box>
              <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", width: isMobile ? "100%" : "auto", justifyContent: isMobile ? "center" : "flex-end" }}>
                <Button
                  variant="outlined"
                  startIcon={<FileDownload />}
                  onClick={exportToCSV}
                  sx={{
                    borderColor: "#d1d5db",
                    color: "#1f2937",
                    borderRadius: "8px",
                    textTransform: "none",
                    "&:hover": {
                      borderColor: "#9ca3af",
                      backgroundColor: "#f3f4f6",
                    },
                  }}
                >
                  Exporter CSV
                </Button>
                <PrimaryButton
                  startIcon={<Add />}
                  onClick={() => handleOpenDialog()}
                  variant="contained"
                  aria-label="Ajouter un client"
                >
                  Ajouter un client
                </PrimaryButton>
              </Box>
            </Toolbar>
          </Grid>

          {/* Barre d'actions contextuelle pour la sélection */}
          {selectedClients.length > 0 && (
            <Grid item xs={12}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  p: 2,
                  backgroundColor: "#fff",
                  borderRadius: "12px",
                  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                  mb: 2,
                  position: "sticky",
                  top: "120px",
                  zIndex: 1,
                }}
              >
                <Typography
                  variant="body1"
                  sx={{ fontWeight: 500, color: "#1f2937" }}
                >
                  {selectedClients.length} client(s) sélectionné(s)
                </Typography>
                <DeleteButton
                  onClick={openConfirmDeleteSelected}
                  aria-label="Supprimer les clients sélectionnés"
                >
                  Supprimer les clients sélectionnés
                </DeleteButton>
              </Box>
            </Grid>
          )}

          {/* Section de l'historique */}
          <Grid item xs={12}>
            <Collapse in={historyOpen}>
              <Box
                sx={{
                  p: 2,
                  backgroundColor: "#fff",
                  borderRadius: "12px",
                  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                  mb: 2,
                  maxHeight: "200px",
                  overflowY: "auto",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 2,
                  }}
                >
                  <Typography
                    variant="body1"
                    sx={{ fontWeight: 500, color: "#1f2937" }}
                  >
                    Historique des actions
                  </Typography>
                  <DeleteButton
                    onClick={openConfirmClearHistory}
                    disabled={actionHistory.length === 0}
                    aria-label="Effacer l'historique des actions"
                  >
                    Effacer l'historique
                  </DeleteButton>
                </Box>
                <Grid container spacing={2} sx={{ mb: 2 }}>
                  <Grid item xs={12} sm={6}>
                    <FilterField
                      placeholder="Rechercher dans l'historique..."
                      value={historySearchTerm}
                      onChange={(e) => setHistorySearchTerm(e.target.value)}
                      variant="outlined"
                      size="small"
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth size="small">
                      <InputLabel>Type d'action</InputLabel>
                      <Select
                        value={historyFilterType}
                        onChange={(e) => setHistoryFilterType(e.target.value)}
                        label="Type d'action"
                        sx={{
                          borderRadius: "8px",
                          "& .MuiOutlinedInput-notchedOutline": {
                            borderColor: "#d1d5db",
                          },
                          "&:hover .MuiOutlinedInput-notchedOutline": {
                            borderColor: "#9ca3af",
                          },
                          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                            borderColor: "#3b82f6",
                          },
                        }}
                      >
                        <MenuItem value="Tous">Tous</MenuItem>
                        <MenuItem value="Ajout">Ajout</MenuItem>
                        <MenuItem value="Modification">Modification</MenuItem>
                        <MenuItem value="Suppression">Suppression</MenuItem>
                        <MenuItem value="Restauration">Restauration</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
                {filteredHistory.length > 0 ? (
                  <List dense>
                    {filteredHistory.map((action) => (
                      <ListItem key={action.id}>
                        <ListItemText
                          primary={`[${action.timestamp}] ${action.description}`}
                          primaryTypographyProps={{
                            fontSize: "0.9rem",
                            color: "#1f2937",
                          }}
                        />
                      </ListItem>
                    ))}
                  </List>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    {historySearchTerm || historyFilterType !== "Tous"
                      ? "Aucune action correspondante."
                      : "Aucune action enregistrée."}
                  </Typography>
                )}
              </Box>
            </Collapse>
          </Grid>

          {/* Section des filtres */}
          <Grid item xs={12}>
            <Collapse in={filterOpen}>
              <Box
                sx={{
                  p: 2,
                  backgroundColor: "#fff",
                  borderRadius: "12px",
                  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                  mb: 2,
                }}
              >
                <Typography
                  variant="body1"
                  sx={{ fontWeight: 500, mb: 2, color: "#1f2937" }}
                >
                  Filtres
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <FilterField
                      label="Domaine d'email (ex: @gmail.com)"
                      value={emailDomainFilter}
                      onChange={(e) => setEmailDomainFilter(e.target.value)}
                      variant="outlined"
                      size="small"
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FilterField
                      label="Préfixe de téléphone (ex: +33)"
                      value={phonePrefixFilter}
                      onChange={(e) => setPhonePrefixFilter(e.target.value)}
                      variant="outlined"
                      size="small"
                      fullWidth
                    />
                  </Grid>
                </Grid>
              </Box>
            </Collapse>
          </Grid>

          {/* Tableau ou cartes (selon la taille de l'écran) */}
          <Grid item xs={12}>
            {isMobile ? (
              // Affichage sous forme de cartes sur mobile
              <Box>
                {sortedClients.length > 0 ? (
                  sortedClients.map((client) => (
                    <Card
                      key={client.id}
                      sx={{
                        mb: 2,
                        borderRadius: "12px",
                        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                        backgroundColor: "#fff",
                        "&:hover": {
                          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                          transition: "box-shadow 0.3s ease",
                        },
                      }}
                    >
                      <CardContent sx={{ p: 2 }}>
                        <Box display="flex" alignItems="center" mb={1}>
                          <Checkbox
                            checked={selectedClients.includes(client.id)}
                            onChange={() => handleSelectClient(client.id)}
                            sx={{ mr: 1 }}
                            aria-label={`Sélectionner le client ${client.lastName}`}
                          />
                          <Avatar
                            src={client.logo || "/default-avatar.png"}
                            alt={client.lastName}
                            sx={{ width: 40, height: 40, mr: 2 }}
                          />
                          <Typography variant="body1" fontWeight={500}>
                            {client.lastName}
                          </Typography>
                        </Box>
                        <Typography variant="body2" color="text.secondary">
                          Email: {client.email}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Téléphone: {client.phone}
                        </Typography>
                      </CardContent>
                      <CardActions sx={{ justifyContent: "flex-end", p: 1 }}>
                        <Tooltip title="Modifier le client">
                          <IconButton
                            onClick={() => handleOpenDialog(client)}
                            sx={{
                              color: "primary.main",
                              "&:hover": {
                                backgroundColor: "primary.light",
                                transition: "background-color 0.3s ease",
                              },
                            }}
                          >
                            <Edit fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Supprimer le client">
                          <IconButton
                            onClick={() => openConfirmDelete(client)}
                            sx={{
                              color: "secondary.main",
                              "&:hover": {
                                backgroundColor: "secondary.light",
                                transition: "background-color 0.3s ease",
                              },
                            }}
                          >
                            <Delete fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </CardActions>
                    </Card>
                  ))
                ) : (
                  <Typography
                    variant="body1"
                    color="text.secondary"
                    textAlign="center"
                  >
                    Aucun client trouvé.
                  </Typography>
                )}
              </Box>
            ) : (
              // Affichage sous forme de tableau sur desktop
              <TableContainer
                component={Paper}
                elevation={0}
                sx={{
                  overflowX: "auto",
                  borderRadius: "12px",
                  backgroundColor: "#fff",
                  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                }}
              >
                <Table>
                  <TableHead sx={{ backgroundColor: "#f3f4f6" }}>
                    <TableRow>
                      <TableCell
                        sx={{
                          fontWeight: 500,
                          color: "text.secondary",
                          fontSize: "0.85rem",
                        }}
                      >
                        <Checkbox
                          checked={
                            paginatedClients.length > 0 &&
                            paginatedClients.every((client) =>
                              selectedClients.includes(client.id)
                            )
                          }
                          onChange={handleSelectAllClients}
                          indeterminate={
                            selectedClients.length > 0 &&
                            !paginatedClients.every((client) =>
                              selectedClients.includes(client.id)
                            )
                          }
                          aria-label="Sélectionner tous les clients"
                        />
                      </TableCell>
                      <TableCell
                        sx={{
                          fontWeight: 500,
                          color: "text.secondary",
                          fontSize: "0.85rem",
                        }}
                      >
                        Logo
                      </TableCell>
                      <TableCell>
                        <TableSortLabel
                          active={orderBy === "lastName"}
                          direction={orderBy === "lastName" ? order : "asc"}
                          onClick={() => handleRequestSort("lastName")}
                          sx={{
                            fontWeight: 500,
                            color: "text.secondary",
                            fontSize: "0.85rem",
                          }}
                        >
                          Nom
                        </TableSortLabel>
                      </TableCell>
                      <TableCell>
                        <TableSortLabel
                          active={orderBy === "email"}
                          direction={orderBy === "email" ? order : "asc"}
                          onClick={() => handleRequestSort("email")}
                          sx={{
                            fontWeight: 500,
                            color: "text.secondary",
                            fontSize: "0.85rem",
                          }}
                        >
                          Email
                        </TableSortLabel>
                      </TableCell>
                      <TableCell>
                        <TableSortLabel
                          active={orderBy === "phone"}
                          direction={orderBy === "phone" ? order : "asc"}
                          onClick={() => handleRequestSort("phone")}
                          sx={{
                            fontWeight: 500,
                            color: "text.secondary",
                            fontSize: "0.85rem",
                          }}
                        >
                          Téléphone
                        </TableSortLabel>
                      </TableCell>
                      <TableCell
                        sx={{
                          fontWeight: 500,
                          color: "text.secondary",
                          fontSize: "0.85rem",
                        }}
                      >
                        Actions
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {sortedClients.length > 0 ? (
                      sortedClients.map((client, index) => (
                        <TableRow
                          key={client.id}
                          sx={{
                            backgroundColor:
                              index % 2 === 0 ? "#fff" : "#f9fafb",
                            "&:hover": {
                              backgroundColor: "#f3f4f6",
                              transition: "background-color 0.3s ease",
                            },
                            "& td": { borderBottom: "none" },
                          }}
                        >
                          <TableCell>
                            <Checkbox
                              checked={selectedClients.includes(client.id)}
                              onChange={() => handleSelectClient(client.id)}
                              aria-label={`Sélectionner le client ${client.lastName}`}
                            />
                          </TableCell>
                          <TableCell>
                            <Avatar
                              src={client.logo || "/default-avatar.png"}
                              alt={client.lastName}
                              sx={{ width: 40, height: 40 }}
                            />
                          </TableCell>
                          <TableCell
                            sx={{ fontSize: "0.9rem", color: "text.primary" }}
                          >
                            {client.lastName}
                          </TableCell>
                          <TableCell
                            sx={{ fontSize: "0.9rem", color: "text.primary" }}
                          >
                            {client.email}
                          </TableCell>
                          <TableCell
                            sx={{ fontSize: "0.9rem", color: "text.primary" }}
                          >
                            {client.phone}
                          </TableCell>
                          <TableCell>
                            <Stack direction="row" spacing={1}>
                              <Tooltip title="Modifier le client">
                                <IconButton
                                  onClick={() => handleOpenDialog(client)}
                                  sx={{
                                    color: "primary.main",
                                    "&:hover": {
                                      backgroundColor: "primary.light",
                                      transition: "background-color 0.3s ease",
                                    },
                                  }}
                                >
                                  <Edit fontSize="small" />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Supprimer le client">
                                <IconButton
                                  onClick={() => openConfirmDelete(client)}
                                  sx={{
                                    color: "secondary.main",
                                    "&:hover": {
                                      backgroundColor: "secondary.light",
                                      transition: "background-color 0.3s ease",
                                    },
                                  }}
                                >
                                  <Delete fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </Stack>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={6}
                          align="center"
                          sx={{
                            color: "text.secondary",
                            fontSize: "0.9rem",
                            py: 4,
                          }}
                        >
                          Aucun client trouvé.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Grid>

          {/* Pagination */}
          <Grid item xs={12}>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={filteredClients.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              sx={{
                "& .MuiTablePagination-selectLabel": {
                  fontSize: "0.85rem",
                  color: "text.secondary",
                },
                "& .MuiTablePagination-displayedRows": {
                  fontSize: "0.85rem",
                  color: "text.secondary",
                },
                "& .MuiTablePagination-actions": { color: "primary.main" },
                "& .MuiTablePagination-toolbar": {
                  justifyContent: "flex-end",
                  py: 1,
                },
              }}
            />
          </Grid>

          {/* Dialogue pour ajouter/modifier un client */}
          <Dialog
            open={open}
            onClose={handleCloseDialog}
            fullWidth
            maxWidth="sm"
            TransitionComponent={Fade}
            TransitionProps={{ timeout: 300 }}
            sx={{
              "& .MuiDialog-paper": {
                borderRadius: "12px",
                boxShadow: "0 4px 16px rgba(0, 0, 0, 0.15)",
                borderTop: "4px solid #3b82f6",
                backgroundColor: "#fff",
              },
            }}
          >
            <DialogTitle
              sx={{
                fontWeight: 600,
                textAlign: "center",
                color: "text.primary",
                borderBottom: "1px solid #e5e7eb",
                py: 3,
              }}
            >
              {editMode ? "Modifier Client" : "Ajouter Client"}
            </DialogTitle>
            <DialogContent sx={{ p: 4 }}>
              <Grid container spacing={3} justifyContent="center">
                <Grid item xs={12} sx={{ textAlign: "center" }}>
                  <Stack direction="column" alignItems="center" spacing={2}>
                    <Avatar
                      src={form.logo || "/default-avatar.png"}
                      alt="Logo"
                      sx={{
                        width: 80,
                        height: 80,
                        bgcolor: "#f3f4f6",
                        border: "2px solid #e5e7eb",
                      }}
                    />
                    <IconButton
                      color="primary"
                      component="label"
                      sx={{
                        bgcolor: "primary.light",
                        p: 1.5,
                        borderRadius: "12px",
                        "&:hover": {
                          bgcolor: "primary.main",
                          color: "#fff",
                        },
                      }}
                    >
                      <PhotoCamera />
                      <input
                        hidden
                        type="file"
                        onChange={(e) => {
                          const file = (e.target as HTMLInputElement)
                            .files?.[0];
                          if (file) {
                            setForm({
                              ...form,
                              logo: URL.createObjectURL(file),
                            });
                          }
                        }}
                      />
                    </IconButton>
                  </Stack>
                </Grid>
                <Grid item xs={12}>
                  <FormField
                    autoFocus
                    name="lastName"
                    label="Nom"
                    type="text"
                    fullWidth
                    value={form.lastName}
                    onChange={handleInputChange}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Tooltip title="Réinitialiser le nom">
                            <IconButton
                              onClick={resetLastName}
                              onKeyDown={(e) => {
                                if (e.key === "Enter" || e.key === " ") {
                                  resetLastName();
                                }
                              }}
                              sx={{
                                color: "#6b7280",
                                "&:hover": {
                                  color: "#3b82f6",
                                  transform: "scale(1.1)",
                                  transition: "all 0.2s ease",
                                },
                              }}
                              aria-label="Réinitialiser le nom"
                              tabIndex={0}
                            >
                              <Person />
                            </IconButton>
                          </Tooltip>
                        </InputAdornment>
                      ),
                    }}
                    sx={{ mb: errors.lastName ? 1 : 3 }}
                    InputLabelProps={{ shrink: true }}
                    inputProps={{
                      "aria-label": errors.lastName
                        ? `Nom, erreur : ${errors.lastName}`
                        : "Nom",
                    }}
                    error={!!errors.lastName}
                  />
                  {errors.lastName && <ErrorText>{errors.lastName}</ErrorText>}
                </Grid>
                <Grid item xs={12}>
                  <FormField
                    name="email"
                    label="Email"
                    type="email"
                    fullWidth
                    value={form.email}
                    onChange={handleInputChange}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Tooltip title="Réinitialiser l'email">
                            <IconButton
                              onClick={resetEmail}
                              onKeyDown={(e) => {
                                if (e.key === "Enter" || e.key === " ") {
                                  resetEmail();
                                }
                              }}
                              sx={{
                                color: "#6b7280",
                                "&:hover": {
                                  color: "#3b82f6",
                                  transform: "scale(1.1)",
                                  transition: "all 0.2s ease",
                                },
                              }}
                              aria-label="Réinitialiser l'email"
                              tabIndex={0}
                            >
                              <Email />
                            </IconButton>
                          </Tooltip>
                        </InputAdornment>
                      ),
                    }}
                    sx={{ mb: errors.email ? 1 : 3 }}
                    InputLabelProps={{ shrink: true }}
                    inputProps={{
                      "aria-label": errors.email
                        ? `Email, erreur : ${errors.email}`
                        : "Email",
                    }}
                    error={!!errors.email}
                  />
                  {errors.email && <ErrorText>{errors.email}</ErrorText>}
                </Grid>
                <Grid item xs={12}>
                  <FormField
                    name="phone"
                    label="Téléphone"
                    type="text"
                    fullWidth
                    value={form.phone}
                    onChange={handleInputChange}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Tooltip title="Réinitialiser le téléphone">
                            <IconButton
                              onClick={resetPhone}
                              onKeyDown={(e) => {
                                if (e.key === "Enter" || e.key === " ") {
                                  resetPhone();
                                }
                              }}
                              sx={{
                                color: "#6b7280",
                                "&:hover": {
                                  color: "#3b82f6",
                                  transform: "scale(1.1)",
                                  transition: "all 0.2s ease",
                                },
                              }}
                              aria-label="Réinitialiser le téléphone"
                              tabIndex={0}
                            >
                              <Phone />
                            </IconButton>
                          </Tooltip>
                        </InputAdornment>
                      ),
                    }}
                    sx={{ mb: errors.phone ? 1 : 3 }}
                    InputLabelProps={{ shrink: true }}
                    inputProps={{
                      "aria-label": errors.phone
                        ? `Téléphone, erreur : ${errors.phone}`
                        : "Téléphone",
                    }}
                    error={!!errors.phone}
                  />
                  {errors.phone && <ErrorText>{errors.phone}</ErrorText>}
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions
              sx={{
                p: 3,
                borderTop: "1px solid #e5e7eb",
                display: "flex",
                justifyContent: "space-between",
                backgroundColor: "#f9fafb",
              }}
            >
              <CancelButton
                onClick={handleCloseDialog}
                variant="outlined"
                aria-label="Annuler l'ajout ou la modification"
              >
                Annuler
              </CancelButton>
              <PrimaryButton
                onClick={handleAddOrEditCustomer}
                variant="contained"
                disabled={Object.keys(errors).length > 0}
                aria-label={
                  editMode ? "Modifier le client" : "Ajouter le client"
                }
              >
                {editMode ? "Modifier" : "Ajouter"}
              </PrimaryButton>
            </DialogActions>
          </Dialog>

          {/* Dialogue de confirmation de suppression */}
          <Dialog
            open={confirmDeleteOpen}
            onClose={handleCloseConfirmDelete}
            TransitionComponent={Fade}
            TransitionProps={{ timeout: 300 }}
            sx={{
              "& .MuiDialog-paper": {
                borderRadius: "12px",
                boxShadow: "0 4px 16px rgba(0, 0, 0, 0.15)",
                borderTop: "4px solid #ef4444",
                backgroundColor: "#fff",
              },
            }}
          >
            <DialogTitle
              sx={{
                fontWeight: 600,
                textAlign: "center",
                color: "text.primary",
                borderBottom: "1px solid #e5e7eb",
                py: 3,
              }}
            >
              Confirmer la suppression
            </DialogTitle>
            <DialogContent sx={{ p: 4 }}>
              <DialogContentText
                id="confirm-delete-description"
                sx={{ color: "#1f2937", fontSize: "1rem", textAlign: "center" }}
              >
                Êtes-vous sûr de vouloir supprimer {clientToDelete?.lastName} ?
                Cette action est irréversible.
              </DialogContentText>
            </DialogContent>
            <DialogActions
              sx={{
                p: 3,
                borderTop: "1px solid #e5e7eb",
                display: "flex",
                justifyContent: "space-between",
                backgroundColor: "#f9fafb",
              }}
            >
              <CancelButton
                onClick={handleCloseConfirmDelete}
                variant="outlined"
                aria-label="Annuler la suppression"
              >
                Annuler
              </CancelButton>
              <DeleteButton
                onClick={handleConfirmDelete}
                variant="contained"
                aria-label="Confirmer la suppression"
              >
                Supprimer
              </DeleteButton>
            </DialogActions>
          </Dialog>

          {/* Dialogue de confirmation pour supprimer les clients sélectionnés */}
          <Dialog
            open={confirmDeleteSelectedOpen}
            onClose={handleCloseConfirmDeleteSelected}
            TransitionComponent={Fade}
            TransitionProps={{ timeout: 300 }}
            sx={{
              "& .MuiDialog-paper": {
                borderRadius: "12px",
                boxShadow: "0 4px 16px rgba(0, 0, 0, 0.15)",
                borderTop: "4px solid #ef4444",
                backgroundColor: "#fff",
              },
            }}
          >
            <DialogTitle
              sx={{
                fontWeight: 600,
                textAlign: "center",
                color: "text.primary",
                borderBottom: "1px solid #e5e7eb",
                py: 3,
              }}
            >
              Confirmer la suppression
            </DialogTitle>
            <DialogContent sx={{ p: 4 }}>
              <DialogContentText
                id="confirm-delete-selected-description"
                sx={{ color: "#1f2937", fontSize: "1rem", textAlign: "center" }}
              >
                Êtes-vous sûr de vouloir supprimer {selectedClients.length}{" "}
                client(s) sélectionné(s) ? Cette action est irréversible.
              </DialogContentText>
            </DialogContent>
            <DialogActions
              sx={{
                p: 3,
                borderTop: "1px solid #e5e7eb",
                display: "flex",
                justifyContent: "space-between",
                backgroundColor: "#f9fafb",
              }}
            >
              <CancelButton
                onClick={handleCloseConfirmDeleteSelected}
                variant="outlined"
                aria-label="Annuler la suppression des clients sélectionnés"
              >
                Annuler
              </CancelButton>
              <DeleteButton
                onClick={handleConfirmDeleteSelected}
                variant="contained"
                aria-label="Confirmer la suppression des clients sélectionnés"
              >
                Supprimer
              </DeleteButton>
            </DialogActions>
          </Dialog>

          {/* Dialogue de confirmation pour effacer l'historique */}
          <Dialog
            open={confirmClearHistoryOpen}
            onClose={handleCloseConfirmClearHistory}
            TransitionComponent={Fade}
            TransitionProps={{ timeout: 300 }}
            sx={{
              "& .MuiDialog-paper": {
                borderRadius: "12px",
                boxShadow: "0 4px 16px rgba(0, 0, 0, 0.15)",
                borderTop: "4px solid #ef4444",
                backgroundColor: "#fff",
              },
            }}
          >
            <DialogTitle
              sx={{
                fontWeight: 600,
                textAlign: "center",
                color: "text.primary",
                borderBottom: "1px solid #e5e7eb",
                py: 3,
              }}
            >
              Confirmer l'effacement de l'historique
            </DialogTitle>
            <DialogContent sx={{ p: 4 }}>
              <DialogContentText
                id="confirm-clear-history-description"
                sx={{ color: "#1f2937", fontSize: "1rem", textAlign: "center" }}
              >
                Êtes-vous sûr de vouloir effacer l'historique des actions ?
                Cette action est irréversible.
              </DialogContentText>
            </DialogContent>
            <DialogActions
              sx={{
                p: 3,
                borderTop: "1px solid #e5e7eb",
                display: "flex",
                justifyContent: "space-between",
                backgroundColor: "#f9fafb",
              }}
            >
              <CancelButton
                onClick={handleCloseConfirmClearHistory}
                variant="outlined"
                aria-label="Annuler l'effacement de l'historique"
              >
                Annuler
              </CancelButton>
              <DeleteButton
                onClick={handleClearHistory}
                variant="contained"
                aria-label="Confirmer l'effacement de l'historique"
              >
                Effacer
              </DeleteButton>
            </DialogActions>
          </Dialog>

          {/* Snackbar */}
          <Snackbar
            open={snackbarOpen}
            autoHideDuration={6000}
            onClose={() => setSnackbarOpen(false)}
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
            action={
              lastDeletedClient && (
                <Button
                  color="inherit"
                  onClick={handleUndoDelete}
                  sx={{
                    color: "#3b82f6",
                    textTransform: "none",
                    "&:hover": {
                      textDecoration: "underline",
                    },
                  }}
                >
                  Annuler
                </Button>
              )
            }
          >
            <Alert
              onClose={() => setSnackbarOpen(false)}
              severity="success"
              sx={{
                width: "100%",
                backgroundColor: "#10b981",
                color: "#fff",
                "& .MuiAlert-icon": {
                  color: "#fff",
                },
              }}
            >
              {snackbarMessage}
            </Alert>
          </Snackbar>
        </Grid>
      </Box>
    </ThemeProvider>
  );
};

export default CustomerManagement;
